"""给五种鸟的照片生成景深图，供「立体检视」（features/depthview.js）做手机倾斜视差；顺便生成林中全景的模糊贴图。
照片原图在 assets-src/birds/（来源和授权见 CREDITS.md），用 Depth Anything V2 Small 估计深度（本机运行，第一次会下载约 100 MB 模型）。
输出：assets/sound/3d/s1.webp（彩图）+ s1-depth.webp（灰度，越白越近），以及 pano-blur.webp（2:1 等距柱状投影的模糊全景）。
用法：python tools/depth-maps.py [--pano | --refine | --scenes | --shop]（--scenes：景点实景照的景深，输出 assets/photos/depth/；--shop：文创透卡效果图拆前后两层）
   需要 transformers（这台电脑装在 D:/hl-tools/py，见开发指南）
"""
import os
import numpy as np
from PIL import Image, ImageFilter, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, OUT = os.path.join(ROOT, 'assets-src', 'birds'), os.path.join(ROOT, 'assets', 'sound', '3d')
REAL = os.path.join(ROOT, 'assets', 'sound', 'real')
# 选 CC0 / CC BY 的照片（不用 BY-SA，省去改编作品同授权的麻烦）
PHOTOS = {'s1': 's1-photo.jpg', 's2': 's2-photo-b.jpg', 's3': 's3-photo-a.jpg', 's4': 's4-photo.jpg', 's5': 's5-photo-c.jpg'}
SIZE = 1280


RAW = os.path.join(SRC, '3d-raw')  # 模型直接输出的深度（未处理），重调预处理时不用再跑模型


def otsu(d):
    h, e = np.histogram(d, 64, (0, 1)); c = (e[:-1] + e[1:]) / 2; best, t = -1, .5
    for i in range(1, 64):
        w0, w1 = h[:i].sum(), h[i:].sum()
        if not w0 or not w1: continue
        m0, m1 = (h[:i] * c[:i]).sum() / w0, (h[i:] * c[i:]).sum() / w1
        if w0 * w1 * (m0 - m1) ** 2 > best: best, t = w0 * w1 * (m0 - m1) ** 2, c[i]
    return t


def refine(d):
    """减少拉丝：背景（虚化的焦外）深度大幅平滑，整块平移不扭曲；前景轮廓在深度图里外扩几像素，
    让前后交界落在虚的背景里，而不是落在清晰的羽毛上。"""
    from scipy import ndimage as ndi
    t = otsu(d)
    w = np.clip((d - (t - .06)) / .12, 0, 1)                  # 前景权重
    bg = ndi.gaussian_filter(d, 24)
    d2 = w * d + (1 - w) * np.minimum(bg, t - .02)
    d2 = ndi.grey_dilation(d2, size=(9, 9))
    return ndi.gaussian_filter(d2, 1.5)


def depth_maps(run_model=True):
    os.makedirs(RAW, exist_ok=True)
    pipe = None
    if run_model:
        from transformers import pipeline
        pipe = pipeline('depth-estimation', model='depth-anything/Depth-Anything-V2-Small-hf')
    for sid, name in PHOTOS.items():
        im = Image.open(os.path.join(SRC, name)).convert('RGB')
        im.thumbnail((SIZE, SIZE), Image.LANCZOS)
        raw = os.path.join(RAW, f'{sid}.png')
        if pipe:
            d = np.asarray(pipe(im)['depth'].resize(im.size, Image.BICUBIC)).astype(float)
            lo, hi = np.percentile(d, 2), np.percentile(d, 99.5)
            d = np.clip((d - lo) / (hi - lo + 1e-6), 0, 1) ** .9   # 0–1，近处为 1
            Image.fromarray((d * 65535).astype('uint16')).save(raw)
        else:
            d = np.asarray(Image.open(raw)).astype(float) / 65535
        dm = Image.fromarray((np.clip(refine(d), 0, 1) * 255).astype('uint8'))
        im.save(os.path.join(OUT, f'{sid}.webp'), 'WEBP', quality=82, method=6)
        dm.save(os.path.join(OUT, f'{sid}-depth.webp'), 'WEBP', quality=88, method=6)
        print(sid, im.size, os.path.getsize(os.path.join(OUT, f'{sid}.webp')) // 1024, 'KB')


def pano():
    """拿栈道林子的实拍横向拼一圈，每张纵向铺满（林子照片本来上面天光、下面地面），重度模糊当占位全景；
    两极渐变成天色和苔藓色，避免球顶球底拉伸。等拿到 360° 实拍就替换 pano-blur.webp。"""
    names = ['entry', 'trail-1', 'turn-2', 'trail-2', 'pillar-2', 'wall-1']
    W, H = 2048, 1024
    tw = W // len(names)
    canvas = Image.new('RGB', (W, H))
    for i, n in enumerate(names):
        im = ImageOps.fit(Image.open(os.path.join(REAL, n + '.webp')).convert('RGB'), (tw + (W - tw * len(names) if i == len(names) - 1 else 0), H), Image.LANCZOS, centering=(.5, .5))
        canvas.paste(im, (i * tw, 0))
    arr = np.asarray(canvas).astype(float)
    ys = (np.arange(H) / (H - 1))[:, None, None]
    sky = np.array([206, 220, 214]); moss = np.array([64, 80, 46])
    up = np.clip((.22 - ys) / .22, 0, 1) ** 1.2      # 顶部 22% 渐变到天色
    dn = np.clip((ys - .8) / .2, 0, 1) ** 1.2         # 底部 20% 渐变到苔藓色
    arr = arr * (1 - up) + sky * up
    arr = arr * (1 - dn) + moss * dn
    img = Image.fromarray(np.clip(arr, 0, 255).astype('uint8'))
    # 横向循环模糊：左右各接一段再模糊，0° 和 360° 处连得上
    pad = 160
    wide = Image.new('RGB', (W + 2 * pad, H)); wide.paste(img.crop((W - pad, 0, W, H)), (0, 0)); wide.paste(img, (pad, 0)); wide.paste(img.crop((0, 0, pad, H)), (W + pad, 0))
    wide = wide.filter(ImageFilter.GaussianBlur(26))
    img = wide.crop((pad, 0, pad + W, H))
    p = os.path.join(OUT, 'pano-blur.webp'); img.save(p, 'WEBP', quality=72, method=6)
    print('pano', img.size, os.path.getsize(p) // 1024, 'KB')


def scenes():
    """景点实景照（stations.js 里有 photo 的景点）的景深图，给首页精选景观和景点详情的立体检视用。
    风景照的远近是连续的（近岸、中景林子、远山），不能像鸟那样切前景、背景：只轻度平滑，近景轮廓外扩几像素免得拉丝，
    网页上把不动面放在中景（景深中位数），近景和远景往相反方向移。输出 assets/photos/depth/<景点 id>.webp。"""
    import json
    from scipy import ndimage as ndi
    from transformers import pipeline
    t = open(os.path.join(ROOT, 'src', 'data', 'stations.js'), encoding='utf8').read()
    stations = json.loads(t[t.index('['):t.rindex(']') + 1])
    out = os.path.join(ROOT, 'assets', 'photos', 'depth'); os.makedirs(out, exist_ok=True)
    pipe = pipeline('depth-estimation', model='depth-anything/Depth-Anything-V2-Small-hf')
    for s in stations:
        if not s.get('photo'): continue
        im = Image.open(os.path.join(ROOT, s['photo']['src'])).convert('RGB')
        im.thumbnail((SIZE, SIZE), Image.LANCZOS)
        d = np.asarray(pipe(im)['depth'].resize(im.size, Image.BICUBIC)).astype(float)
        lo, hi = np.percentile(d, 2), np.percentile(d, 99.5)
        d = np.clip((d - lo) / (hi - lo + 1e-6), 0, 1)
        d = ndi.gaussian_filter(ndi.grey_dilation(d, size=(5, 5)), 1.5)
        p = os.path.join(out, s['id'] + '.webp')
        Image.fromarray((d * 255).astype('uint8')).save(p, 'WEBP', quality=86, method=6)
        print(s['id'], im.size, os.path.getsize(p) // 1024, 'KB', '中位', round(float(np.median(d)), 3))


def touka_masks(card):
    """透卡商品图（白底、卡下有一道灰投影）→ 卡身和中间留空的窗：连着图边的白和灰是图外，不连边的大块纯白是窗，其余是卡身。
    灰色只在连着图边时才算图外，免得把画里的瀑布、雪山、云当成窗。"""
    from scipy import ndimage as ndi
    c = np.asarray(card).astype(int)
    white = c.min(axis=2) > 232
    pale = white | ((c.max(axis=2) - c.min(axis=2) < 14) & (c.mean(axis=2) > 120))
    lo, _ = ndi.label(pale)
    outside = np.isin(lo, list(set(np.unique(np.concatenate([lo[0], lo[-1], lo[:, 0], lo[:, -1]]))) - {0}))
    lab, n = ndi.label(white & ~outside)
    sizes = ndi.sum(white & ~outside, lab, range(1, n + 1))
    win = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > white.size * .03])
    win = ndi.binary_fill_holes(ndi.binary_closing(win, iterations=2))
    return ndi.binary_opening(~outside & ~win, iterations=1), win

def touka_align(card, scene):
    """商品图和效果图里是同一张画：SIFT 特征配对 + RANSAC 求单应矩阵，把商品图贴到效果图里卡的位置。"""
    import cv2
    g1, g2 = (cv2.cvtColor(np.asarray(x), cv2.COLOR_RGB2GRAY) for x in (card, scene))
    sift = cv2.SIFT_create(4000)
    k1, d1 = sift.detectAndCompute(g1, None); k2, d2 = sift.detectAndCompute(g2, None)
    good = [a for a, b in cv2.BFMatcher().knnMatch(d1, d2, k=2) if a.distance < .72 * b.distance]
    H, inl = cv2.findHomography(np.float32([k1[a.queryIdx].pt for a in good]), np.float32([k2[a.trainIdx].pt for a in good]), cv2.RANSAC, 4.0)
    return H, int(inl.sum())


def touka_cut(a, wb, ww, d, wide_edge=False):
    """手 + 透卡的精确抠图。a 是效果图，wb / ww 是对齐过来的卡身和窗，d 是景深（0–1，近处大）。
    手：卡轮廓外、景深近、肤色、靠近下左右图边的大块。然后 GrabCut 两轮：
    整图一轮（卡身里面确定是前景，窗的中间和卡外确定是背景，边上几像素让它按颜色判），
    再在窗口附近单独一轮，颜色模型只看窗里的背景和窗边的卡框，修窗口的边。"""
    import cv2
    from scipy import ndimage as ndi
    D = lambda m, n: ndi.binary_dilation(m, iterations=n)
    E = lambda m, n: ndi.binary_erosion(m, iterations=n)
    near, silh = d > otsu(d), wb | ww
    ycc = cv2.cvtColor(a, cv2.COLOR_RGB2YCrCb)
    skin = ndi.binary_closing((ycc[..., 1] > 135) & (ycc[..., 1] < 180) & (ycc[..., 2] > 80) & (ycc[..., 2] < 130), iterations=3)
    hl, _ = ndi.label(near & skin & ~D(silh, 4))
    edge_ids = set(np.unique(np.concatenate([hl[-24:].ravel(), hl[:, :24].ravel(), hl[:, -24:].ravel()]))) - {0}
    hand = np.isin(hl, [i for i in edge_ids if (hl == i).sum() > hl.size * .004])
    m = np.full(a.shape[:2], cv2.GC_BGD, np.uint8)
    m[D(silh, 28 if wide_edge else 5) & ~silh] = cv2.GC_PR_BGD
    m[D(ww, 2)] = cv2.GC_PR_BGD
    m[wb & ~D(ww, 2)] = cv2.GC_PR_FGD
    m[E(wb & ~D(ww, 10), 8)] = cv2.GC_FGD
    m[D(hand, 6)] = cv2.GC_PR_FGD
    m[E(hand, 8)] = cv2.GC_FGD
    m[E(ww, 10)] = cv2.GC_BGD
    bgr = cv2.cvtColor(a, cv2.COLOR_RGB2BGR)
    cv2.grabCut(bgr, m, None, np.zeros((1, 65)), np.zeros((1, 65)), 6, cv2.GC_INIT_WITH_MASK)
    fg = (m == cv2.GC_FGD) | (m == cv2.GC_PR_FGD)
    ys, xs = np.where(D(ww, 24))
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    m2 = np.where(fg, cv2.GC_PR_FGD, cv2.GC_PR_BGD).astype(np.uint8)[y0:y1, x0:x1]
    m2[E(fg, 14)[y0:y1, x0:x1]] = cv2.GC_FGD; m2[E(ww, 12)[y0:y1, x0:x1]] = cv2.GC_BGD
    cv2.grabCut(np.ascontiguousarray(bgr[y0:y1, x0:x1]), m2, None, np.zeros((1, 65)), np.zeros((1, 65)), 5, cv2.GC_INIT_WITH_MASK)
    fg[y0:y1, x0:x1] = (m2 == cv2.GC_FGD) | (m2 == cv2.GC_PR_FGD)
    fg = ndi.binary_opening(fg, iterations=1)
    lab, n = ndi.label(fg); sz = ndi.sum(fg, lab, range(1, n + 1))
    fg = np.isin(lab, [i + 1 for i, z in enumerate(sz) if z > fg.size * .003])       # 去掉零碎小块
    lab, n = ndi.label(~fg); sz = ndi.sum(~fg, lab, range(1, n + 1))
    return fg | np.isin(lab, [i + 1 for i, z in enumerate(sz) if z < fg.size * .0008])  # 补小洞


def touka_fill(a, fg):
    """补出被手和卡挡住的背景。背景本来就是虚的，用「推拉」金字塔填：逐级缩小时只平均看得见的像素，
    缩到填满后再逐级放大，把空洞填上周围颜色的平滑过渡（不会像 Telea 那样拉出放射状的条纹）。"""
    import cv2
    from scipy import ndimage as ndi
    hole = ndi.binary_dilation(fg, iterations=8)
    img, w = a.astype(np.float32), (~hole).astype(np.float32)
    levels = []
    while min(img.shape[:2]) > 4:
        levels.append((img, w))
        h2, w2 = img.shape[0] // 2, img.shape[1] // 2
        sw = cv2.resize(w, (w2, h2), interpolation=cv2.INTER_AREA)
        si = cv2.resize(img * w[..., None], (w2, h2), interpolation=cv2.INTER_AREA) / np.maximum(sw, 1e-6)[..., None]
        img, w = si, np.minimum(sw * 4, 1)
    for li, lw in reversed(levels):
        up = cv2.resize(img, (li.shape[1], li.shape[0]), interpolation=cv2.INTER_LINEAR)
        img = li * lw[..., None] + up * (1 - lw[..., None])
    filled = cv2.GaussianBlur(img, (0, 0), 3)
    k = ndi.gaussian_filter(hole.astype(float), 2)[..., None]
    return np.clip(a * (1 - k) + filled * k, 0, 255).astype(np.uint8)

def shop():
    """文创「透卡」：四张手持实景效果图拆成前后两层，给商品详情里点商品图后的立体检视用。
    原图在 assets-src/shop/touka/（<款>-card.jpg 商品图、<款>-scene.png 效果图，几 MB，不提交）。
    前层是手和透卡（带透明度的抠图），后层是卡框里外的实景（被挡住的部分补出来）。网页上前层轻轻动、后层动得多，
    两层各自平移，交界处不会像单张景深图那样把边缘拉成丝。
    卡在哪：光靠景深分不出来（黄龙寺那张，窗里的寺离得近，模型把它和卡估成一样近），所以先把商品图对齐到效果图上（touka_align），
    再结合景深和肤色找手，最后 GrabCut 按颜色修边（touka_cut）。
    输出 assets/shop/touka-<款>.webp（商品图）、touka-<款>-scene.webp（原效果图，不支持 WebGL 时看平面）、-fg.webp（前层）、-bg.webp（后层）。"""
    import cv2
    from scipy import ndimage as ndi
    from transformers import pipeline
    src = os.path.join(ROOT, 'assets-src', 'shop', 'touka'); out = os.path.join(ROOT, 'assets', 'shop')
    pipe = pipeline('depth-estimation', model='depth-anything/Depth-Anything-V2-Small-hf')
    for k in ['zhaga', 'muchang', 'huanglong', 'zhala']:
        card = Image.open(os.path.join(src, k + '-card.jpg')).convert('RGB')
        card.save(os.path.join(out, f'touka-{k}.webp'), 'WEBP', quality=86, method=6)
        im = Image.open(os.path.join(src, k + '-scene.png')).convert('RGB')
        im.thumbnail((SIZE, SIZE), Image.LANCZOS)
        a = np.asarray(im)
        d = np.asarray(pipe(im)['depth'].resize(im.size, Image.BICUBIC)).astype(float)
        lo, hi = np.percentile(d, 2), np.percentile(d, 99.5)
        d = np.clip((d - lo) / (hi - lo + 1e-6), 0, 1)
        body, win = touka_masks(card)
        H, inliers = touka_align(card, im)
        warp = lambda m: cv2.warpPerspective(m.astype(np.uint8) * 255, H, im.size) > 127
        fg = touka_cut(a, warp(body), warp(win), d, wide_edge=(k == 'zhala'))  # 扎拉寺的实物卡比商品图多一圈白边
        alpha = (np.clip(ndi.gaussian_filter(fg.astype(float), .8), 0, 1) * 255).astype('uint8')
        im.save(os.path.join(out, f'touka-{k}-scene.webp'), 'WEBP', quality=84, method=6)
        Image.fromarray(np.dstack([a, alpha])).save(os.path.join(out, f'touka-{k}-fg.webp'), 'WEBP', quality=86, method=6)
        Image.fromarray(touka_fill(a, fg)).save(os.path.join(out, f'touka-{k}-bg.webp'), 'WEBP', quality=80, method=6)
        print(k, im.size, '对齐特征点', inliers, '前层占画面', f'{fg.mean():.0%}',
              '大小', *(os.path.getsize(os.path.join(out, f'touka-{k}-{x}.webp')) // 1024 for x in ('fg', 'bg')), 'KB')


if __name__ == '__main__':
    import sys
    os.makedirs(OUT, exist_ok=True)
    if '--scenes' in sys.argv: scenes()                 # 景点实景照的景深图
    elif '--shop' in sys.argv: shop()                   # 文创透卡效果图拆前后两层
    elif '--pano' in sys.argv: pano()                   # 只重做全景
    elif '--refine' in sys.argv: depth_maps(False)      # 只重做深度预处理（读 assets-src/birds/3d-raw/，不跑模型）
    else: depth_maps(); pano()
