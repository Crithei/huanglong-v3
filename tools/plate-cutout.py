"""把博物画从纸上「剪」下来：去掉纸色背景，输出透明底 webp，给碰一碰动画用（features/tapintro.js 的博物画模式）。
原图在 assets-src/birds/（来源和授权见那里的 CREDITS.md），输出到 assets/sound/plate-s1.webp … plate-s5.webp。
做法：用大窗口最大值滤波估计每处的纸色（纸会泛黄、有渐变），比纸色深或颜色差得多的像素留下；
淡淡的水色、芦苇变成半透明。再去掉零碎小点、填上鸟身上浅色的洞。
手修版优先：assets-src/birds/ 里有 plate-s1-edit.png（透明底 PNG）就直接用它，只裁边、缩放、压缩；
栈道手册鸟页的彩色鸟同理，bird-s1-edit.png 会替换 assets/sound/bird-s1.webp。
用法：python tools/plate-cutout.py
"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, OUT = os.path.join(ROOT, 'assets-src', 'birds'), os.path.join(ROOT, 'assets', 'sound')
# 文件, 裁切（左, 上, 右, 下，占原图的比例）, 阈值（色差小于 lo 全透明、大于 hi 全不透明）, 是否只留最大一块
PLATES = {
    's1': ('s1-plate-gould.jpg', (.07, .02, .99, .84), 7, 20, False),
    's2': ('s2-plate-naumann.jpg', (.12, .18, .88, .79), 16, 30, False),
    's3': ('s3-plate-gould.jpg', (0, 0, 1, 1), 9, 24, False),
    's4': ('s4-plate-yarkand.jpg', (.03, .12, .97, .75), 9, 22, False),
    's5': ('s45-plate-watercolour.jpg', (.035, .05, .6, .585), 18, 34, True),
}
# 补救轮廓（原图比例的多边形）：画家用白颜料画的部分已经泛黄，和纸色分不开，轮廓里整块保留
_cap = [(45, 195), (70, 140), (120, 95), (200, 70), (290, 62), (370, 72), (430, 95), (470, 125), (495, 160),
        (440, 120), (380, 100), (300, 95), (220, 110), (150, 150), (100, 190)]
RESCUE = {'s5': [((.42 * 3840 + x) / 3840, (.03 * 2772 + y) / 2772) for x, y in _cap]}  # 白顶溪鸲的白冠，从原画头部量出来
MAX = 1100


def lab(rgb):
    c = rgb / 255.0
    c = np.where(c > .04045, ((c + .055) / 1.055) ** 2.4, c / 12.92)
    xyz = c @ np.array([[.4124, .3576, .1805], [.2126, .7152, .0722], [.0193, .1192, .9505]]).T / [.9505, 1, 1.089]
    f = np.where(xyz > .008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def cut(name, box, lo, hi, largest, rescue=None):
    im = Image.open(os.path.join(SRC, name)).convert('RGB')
    W, H = im.size
    im = im.crop((int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H)))
    cw, ch = im.size
    im.thumbnail((MAX, MAX), Image.LANCZOS)
    sx, sy = im.size[0] / cw, im.size[1] / ch
    rgb = np.asarray(im).astype(float)
    L = lab(rgb)
    # 纸色：亮度的局部最大值附近、颜色淡的像素，平滑后当作每处的底色
    k = max(15, int(min(im.size) / 14) | 1)
    top = ndi.gaussian_filter(ndi.maximum_filter(L[..., 0], k), k / 2)
    # 整页四边的中位色当作纸的基准色，老纸偏黄也能认出来
    edge = np.concatenate([L[:8].reshape(-1, 3), L[-8:].reshape(-1, 3), L[:, :8].reshape(-1, 3), L[:, -8:].reshape(-1, 3)])
    ref = np.median(edge, 0)
    paper = (L[..., 0] > top - 9) & (np.sqrt(((L - ref) ** 2).sum(-1)) < 24)
    w = ndi.gaussian_filter(paper.astype(float), k)
    bg = np.stack([ndi.gaussian_filter(L[..., i] * paper, k) / (w + 1e-6) for i in range(3)], -1)
    d = np.sqrt(((L - bg) ** 2 * [1.2, 1, 1]).sum(-1))
    a = np.clip((d - lo) / (hi - lo), 0, 1)
    # 去掉零碎小点；大块里的浅色洞填上
    solid = a > .5
    lab_, n = ndi.label(solid)
    if n:
        sizes = ndi.sum(solid, lab_, range(1, n + 1))
        keep = np.isin(lab_, 1 + np.where(sizes > solid.size * .0006)[0]) if not largest else lab_ == 1 + int(np.argmax(sizes))
        near = ndi.binary_dilation(keep, iterations=6)
        a = np.where(near, a, 0) if largest else np.where(near | (a < .5), a, 0)
        # 只填小洞（鸟身上的浅色羽毛）；树枝和鸟围出来的大块纸照样去掉
        holes = ndi.binary_fill_holes(keep) & ~keep
        hl, hn = ndi.label(holes)
        if hn:
            hs = ndi.sum(holes, hl, range(1, hn + 1))
            small = np.isin(hl, 1 + np.where(hs < holes.size * .003)[0])
            a = np.maximum(a, ndi.gaussian_filter(small * 1.0, 1.2))
    if rescue:
        from PIL import ImageDraw
        m = Image.new('L', (a.shape[1], a.shape[0]), 0)
        pts = [((fx - box[0]) * W * sx, (fy - box[1]) * H * sy) for fx, fy in rescue]
        ImageDraw.Draw(m).polygon(pts, fill=255)
        mm = ndi.gaussian_filter(np.asarray(m) / 255.0, 1.2)
        a = np.maximum(a, mm)
        # 轮廓里的浅色（白颜料和透出来的绿底）统一往米白拉，去掉绿边
        lite = (mm * np.clip((L[..., 0] - 55) / 20, 0, 1))[..., None]
        rgb = rgb * (1 - lite * .7) + np.array([238, 230, 210]) * lite * .7
    a = ndi.gaussian_filter(a, .6)
    out = Image.fromarray(np.dstack([rgb, a * 255]).astype('uint8'), 'RGBA')
    bb = out.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
    return out.crop(bb) if bb else out


def edited(path):
    """手修版：透明底 PNG，只裁掉四周空白、缩到 MAX、压成 webp，不再自动抠。"""
    o = Image.open(path).convert('RGBA')
    bb = o.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
    if bb: o = o.crop(bb)
    o.thumbnail((MAX, MAX), Image.LANCZOS)
    return o


if __name__ == '__main__':
    for sid, (name, box, lo, hi, largest) in PLATES.items():
        # assets-src/birds/plate-s1-edit.png 存在时优先用手修版，重跑脚本也不会覆盖手工修改
        hand = os.path.join(SRC, f'plate-{sid}-edit.png')
        o = edited(hand) if os.path.exists(hand) else cut(name, box, lo, hi, largest, RESCUE.get(sid))
        p = os.path.join(OUT, f'plate-{sid}.webp')
        o.save(p, 'WEBP', quality=84, alpha_quality=90, method=6)
        print(sid, '手修版' if os.path.exists(hand) else '自动抠图', o.size, os.path.getsize(p) // 1024, 'KB')
    # 栈道手册鸟页上的彩色鸟（原来从宣传册截的），手修版放 assets-src/birds/bird-s1-edit.png，直接替换 assets/sound/bird-s1.webp
    for i in range(1, 6):
        hand = os.path.join(SRC, f'bird-s{i}-edit.png')
        if os.path.exists(hand):
            o = edited(hand); p = os.path.join(OUT, f'bird-s{i}.webp')
            o.save(p, 'WEBP', quality=84, alpha_quality=90, method=6)
            print(f'bird-s{i} 手修版', o.size, os.path.getsize(p) // 1024, 'KB')
