"""给五种鸟的照片生成景深图，供「立体检视」（features/depthview.js）做手机倾斜视差；顺便生成林中全景的模糊贴图。
照片原图在 assets-src/birds/（来源和授权见 CREDITS.md），用 Depth Anything V2 Small 估计深度（本机运行，第一次会下载约 100 MB 模型）。
输出：assets/sound/3d/s1.webp（彩图）+ s1-depth.webp（灰度，越白越近），以及 pano-blur.webp（2:1 等距柱状投影的模糊全景）。
用法：python tools/depth-maps.py [--pano | --refine | --scenes]（--scenes：景点实景照的景深，输出 assets/photos/depth/）
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


if __name__ == '__main__':
    import sys
    os.makedirs(OUT, exist_ok=True)
    if '--scenes' in sys.argv: scenes()                 # 景点实景照的景深图
    elif '--pano' in sys.argv: pano()                   # 只重做全景
    elif '--refine' in sys.argv: depth_maps(False)      # 只重做深度预处理（读 assets-src/birds/3d-raw/，不跑模型）
    else: depth_maps(); pano()
