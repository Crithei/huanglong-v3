"""把五只鸟做成点云，给滚动切换的点云页（features/flock.js，?flock=1）用。
每只：IS-Net 抠出鸟和它站的枝条 → 抠图范围内随机取 N 个像素 → 按原始景深（Depth Anything V2 Small）推成 3D 点 → 颜色取照片原色。
点按高度排序，切换时上下对应的部位彼此飞过去，看起来像鸟在变形，而不是一团乱飞。
不用 SHARP：景深模型和抠图模型都是 Apache 2.0，可以公开上线；照片署名照旧（见 README）。
输入：assets/sound/3d/sN.webp（彩图）、assets-src/birds/3d-raw/sN.png（tools/depth-maps.py 存的原始景深，16 位，近处为 1）
输出：assets/sound/flock/sN.bin：N 个点，先是位置 int16×3（-32767…32767 对应 -1…1，y 朝上），再是颜色 uint8×3
用法：PYTHONPATH=D:/hl-tools/py python tools/bird-points.py
"""
import os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D3 = os.path.join(ROOT, 'assets', 'sound', '3d')
RAW = os.path.join(ROOT, 'assets-src', 'birds', '3d-raw')
OUT = os.path.join(ROOT, 'assets', 'sound', 'flock')
MODEL = os.environ.get('ISNET_MODEL', 'D:/hl-tools/models/isnet-general-use.onnx')
N = 60000
RELIEF = .55   # 景深推出来的厚度（相对鸟的宽度），太大会显得假，太小没有立体感


def mask(sess, im):
    x = np.asarray(im.resize((1024, 1024), Image.BILINEAR)).astype(np.float32) / 255 - .5
    y = sess.run(None, {sess.get_inputs()[0].name: x.transpose(2, 0, 1)[None]})[0][0, 0]
    y = (y - y.min()) / (y.max() - y.min() + 1e-6)
    m = np.asarray(Image.fromarray((y * 255).astype('uint8')).resize(im.size, Image.BILINEAR)).astype(float) / 255
    solid = m > .5
    lab, n = ndi.label(solid)
    if n:
        sizes = ndi.sum(solid, lab, range(1, n + 1))
        solid = lab == 1 + int(np.argmax(sizes))
    return ndi.binary_erosion(solid, iterations=1)   # 往里收一像素，边缘不带背景色


def main():
    import onnxruntime as ort
    sess = ort.InferenceSession(MODEL, providers=['CPUExecutionProvider'])
    os.makedirs(OUT, exist_ok=True)
    rng = np.random.default_rng(7)
    for i in range(1, 6):
        sid = f's{i}'
        im = Image.open(os.path.join(D3, f'{sid}.webp')).convert('RGB')
        rgb = np.asarray(im).astype(np.float32)
        d = np.asarray(Image.open(os.path.join(RAW, f'{sid}.png'))).astype(np.float32) / 65535
        d = ndi.gaussian_filter(d, 1.2)
        m = mask(sess, im)
        ys, xs = np.nonzero(m)
        pick = rng.choice(len(xs), N, replace=len(xs) < N)
        u = xs[pick] + rng.random(N) - .5; v = ys[pick] + rng.random(N) - .5
        col = rgb[ys[pick], xs[pick]]
        z = d[ys[pick], xs[pick]]
        # 以鸟的中心为原点；宽度归一，景深按鸟的宽度给厚度
        cx, cy = np.median(u), np.median(v)
        w = max(np.percentile(u, 99) - np.percentile(u, 1), np.percentile(v, 99) - np.percentile(v, 1))
        X = (u - cx) / w * 1.7; Y = -(v - cy) / w * 1.7
        Z = (z - np.median(z)) / (np.percentile(z, 98) - np.percentile(z, 2) + 1e-6) * RELIEF
        P = np.stack([X, Y, Z], 1)
        P /= max(1.0, np.abs(P).max())
        order = np.lexsort((P[:, 0], P[:, 1]))          # 按高度排，同高再按左右
        P, col = P[order], col[order]
        buf = (P * 32767).astype('<i2').tobytes() + col.astype('u1').tobytes()
        p = os.path.join(OUT, f'{sid}.bin')
        open(p, 'wb').write(buf)
        print(sid, f'鸟占 {m.mean() * 100:.1f}%', f'{len(buf) // 1024} KB')


if __name__ == '__main__':
    main()
