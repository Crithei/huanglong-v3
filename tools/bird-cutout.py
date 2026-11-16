"""从高清照片里抠出五只鸟，替换栈道手册鸟页上的彩色鸟（assets/sound/bird-s1.webp …）。
照片和立体检视用的是同一张（assets-src/birds/，来源和授权见 CREDITS.md），点鸟进入检视时看到的就是这只鸟。
抠图用 IS-Net（DIS 高精度二分分割，Apache 2.0，rembg 发布的 isnet-general-use.onnx），onnxruntime 在 CPU 上跑。
输出透明底 webp，长边 900 px；鸟的剪影（未收集时）由网页用同一张图做蒙版，不用另出图。
用法：PYTHONPATH=D:/hl-tools/py python tools/bird-cutout.py [s1 …]
"""
import os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets-src', 'birds')
OUT = os.path.join(ROOT, 'assets', 'sound')
MODEL = os.environ.get('ISNET_MODEL', 'D:/hl-tools/models/isnet-general-use.onnx')
PHOTOS = {'s1': 's1-photo.jpg', 's2': 's2-photo-b.jpg', 's3': 's3-photo-a.jpg', 's4': 's4-photo.jpg', 's5': 's5-photo-c.jpg'}
LONG = 900


def mask(sess, im):
    x = np.asarray(im.resize((1024, 1024), Image.BILINEAR)).astype(np.float32) / 255 - .5
    x = x.transpose(2, 0, 1)[None]
    y = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
    y = (y - y.min()) / (y.max() - y.min() + 1e-6)
    return np.asarray(Image.fromarray((y * 255).astype('uint8')).resize(im.size, Image.BILINEAR)).astype(float) / 255


def main(ids):
    import onnxruntime as ort
    sess = ort.InferenceSession(MODEL, providers=['CPUExecutionProvider'])
    for sid in ids:
        im = Image.open(os.path.join(SRC, PHOTOS[sid])).convert('RGB')
        m = mask(sess, im)
        solid = m > .5
        lab, n = ndi.label(solid)
        if n:   # 只留最大的一块（鸟和它站的地方），去掉零碎的误检
            sizes = ndi.sum(solid, lab, range(1, n + 1))
            keep = ndi.binary_dilation(lab == 1 + int(np.argmax(sizes)), iterations=4)
            m = m * keep
        a = np.clip((m - .15) / .7, 0, 1)
        rgba = Image.fromarray(np.dstack([np.asarray(im), (a * 255).astype('uint8')]), 'RGBA')
        bb = rgba.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
        rgba = rgba.crop(bb)
        rgba.thumbnail((LONG, LONG), Image.LANCZOS)
        p = os.path.join(OUT, f'bird-{sid}.webp')
        rgba.save(p, 'WEBP', quality=86, alpha_quality=92, method=6)
        print(sid, rgba.size, os.path.getsize(p) // 1024, 'KB', f'前景占 {solid.mean() * 100:.1f}%')


if __name__ == '__main__':
    main([a for a in sys.argv[1:] if a in PHOTOS] or list(PHOTOS))
