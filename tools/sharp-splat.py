"""用 Apple SHARP（单张照片生成 3D 高斯泼溅）给五只鸟各生成一个完整场景，只给测试页 ?splat=test 用（features/splattest.js）。
授权：SHARP 的模型权重只许研究用途（Apple Machine Learning Research License，禁止商用），生成的 .splat 已写进 .gitignore，只在本地用。
体积：完整场景每只约 34 MB，超过 Cloudflare 单文件 25 MB 的上限，本来也上不了线。
依赖（都在 D 盘）：代码 D:/hl-tools/ml-sharp（github.com/apple/ml-sharp），权重 D:/hl-tools/models/sharp_2572gikvuh.pt（2.6 GB），
torchvision / timm / plyfile 装在 D:/hl-tools/py。只做预测、不渲染，CPU 每只约 70 秒。
输出：assets/sound/3d/sN.splat（gsplat.js 的 .splat：位置 3×f32、尺度 3×f32、RGBA 4×u8、四元数 4×u8），并打印测试页要的参数。
用法：PYTHONPATH="D:/hl-tools/py;D:/hl-tools/ml-sharp/src" python tools/sharp-splat.py [s1 …] [--keep 2000000]
"""
import os, sys, math, time, json
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets-src', 'birds')
OUT = os.path.join(ROOT, 'assets', 'sound', '3d')
CKPT = os.environ.get('SHARP_CKPT', 'D:/hl-tools/models/sharp_2572gikvuh.pt')
PHOTOS = {'s1': 's1-photo.jpg', 's2': 's2-photo-b.jpg', 's3': 's3-photo-a.jpg', 's4': 's4-photo.jpg', 's5': 's5-photo-c.jpg'}


def predict(model, image, f_px):
    """照抄 sharp/cli/predict.py 的 predict_image（那个文件会 import 渲染模块，要 CUDA 版 gsplat）"""
    import torch, torch.nn.functional as F
    from sharp.utils.gaussians import unproject_gaussians
    internal = (1536, 1536)
    img = torch.from_numpy(image.copy()).float().permute(2, 0, 1) / 255.0
    _, h, w = img.shape
    x = F.interpolate(img[None], size=(internal[1], internal[0]), mode='bilinear', align_corners=True)
    with torch.no_grad():
        g = model(x, torch.tensor([f_px / w]).float())
    K = torch.tensor([[f_px, 0, w / 2, 0], [0, f_px, h / 2, 0], [0, 0, 1, 0], [0, 0, 0, 1]]).float()
    K[0] *= internal[0] / w; K[1] *= internal[1] / h
    return unproject_gaussians(g, torch.eye(4), K, internal)


def to_splat(g, keep):
    from sharp.utils import color_space as cs
    xyz = g.mean_vectors.flatten(0, 1).numpy().astype(np.float32)
    scale = g.singular_values.flatten(0, 1).numpy().astype(np.float32)
    rot = g.quaternions.flatten(0, 1).numpy().astype(np.float32)
    rgb = cs.linearRGB2sRGB(g.colors.flatten(0, 1)).clamp(0, 1).numpy()
    a = g.opacities.flatten(0, 1).numpy().reshape(-1)
    n0 = len(a)
    # 只去掉几乎透明的；要压体积时按不透明度留 keep 个。不要乘尺寸：那样会把表现羽毛细节的小高斯删光，画面发糊
    m = a > .04
    xyz, scale, rot, rgb, a = xyz[m], scale[m], rot[m], rgb[m], a[m]
    if len(a) > keep:
        idx = np.argsort(-a)[:keep]
        xyz, scale, rot, rgb, a = xyz[idx], scale[idx], rot[idx], rgb[idx], a[idx]
    rot = rot / np.linalg.norm(rot, axis=1, keepdims=True)
    buf = np.zeros(len(a), dtype=[('p', '<f4', 3), ('s', '<f4', 3), ('c', 'u1', 4), ('r', 'u1', 4)])
    buf['p'] = xyz; buf['s'] = scale
    buf['c'] = np.clip(np.concatenate([rgb, a[:, None]], 1) * 255, 0, 255).astype('u1')
    buf['r'] = np.clip(rot * 128 + 128, 0, 255).astype('u1')
    return buf, n0


def main(ids, keep):
    import torch
    from sharp.models import create_predictor, PredictorParams
    torch.set_num_threads(max(1, os.cpu_count() - 1))
    model = create_predictor(PredictorParams())
    model.load_state_dict(torch.load(CKPT, map_location='cpu', weights_only=True))
    model.eval()
    meta = {}
    for sid in ids:
        t = time.time()
        image = np.asarray(Image.open(os.path.join(SRC, PHOTOS[sid])).convert('RGB'))
        h, w = image.shape[:2]
        f_px = 30.0 * math.hypot(w, h) / math.hypot(36, 24)    # 照片没有 EXIF 焦距，按 SHARP 的默认 30 mm 等效
        buf, n0 = to_splat(predict(model, image, f_px), keep)
        p = os.path.join(OUT, f'{sid}.splat')
        buf.tofile(p)
        P = buf['p']; z = P[:, 2]
        c = (np.abs(P[:, 0] / z) < .08) & (np.abs(P[:, 1] / z) < .08)   # 画面中心附近，通常是鸟
        meta[sid] = {'aspect': round(w / h, 4), 'fx': round(f_px / w, 4), 'focus': round(float(np.median(z[c] if c.any() else z)), 3), 'count': int(len(buf))}
        print(sid, f'高斯 {n0} → {len(buf)}', f'{os.path.getsize(p) / 2**20:.1f} MB', f'{time.time() - t:.0f}s', meta[sid])
    # 测试页读这个文件拿画幅、焦距和环绕焦点（也不提交）
    old = {}
    mp = os.path.join(OUT, 'splat-meta.json')
    if os.path.exists(mp): old = json.load(open(mp, encoding='utf8'))
    old.update(meta)
    json.dump(old, open(mp, 'w', encoding='utf8', newline='\n'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    args = sys.argv[1:]
    keep = int(args[args.index('--keep') + 1]) if '--keep' in args else 2000000
    main([a for a in args if a in PHOTOS] or list(PHOTOS), keep)
