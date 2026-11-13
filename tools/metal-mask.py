"""生灵徽章的金属描边蒙版：从 assets/species/*.webp 挑出金色的凸起细线（比周围亮、色相偏金）和贴轮廓的外框，
输出到 assets/species/metal/ 同名文件（白色 + alpha）。徽章检视器用它把高光只打在描边上。
用法：python tools/metal-mask.py assets/species/metal assets/species/*.webp
"""
import sys, os, numpy as np
from PIL import Image, ImageFilter
def mask(path):
    im=Image.open(path).convert('RGBA'); al=np.asarray(im)[...,3].astype(float)/255
    hsv=np.asarray(im.convert('RGB').convert('HSV')).astype(float)/255
    h=hsv[...,0]*360; s=hsv[...,1]; v=hsv[...,2]
    V=Image.fromarray((v*255).astype('uint8'))
    loc=np.asarray(V.filter(ImageFilter.GaussianBlur(6))).astype(float)/255
    lift=np.clip((v-loc-.04)/.18,0,1)                  # 比周围亮：凸起的细线
    warm=np.clip(1-np.abs(h-36)/22,0,1)*np.clip((s-.2)/.2,0,1)  # 金色色相
    bright=np.clip((v-.45)/.35,0,1)
    m=lift*bright*(.15+.85*warm)*al
    # 外框：贴着轮廓的一圈本来就是金边
    A=Image.fromarray((al*255).astype('uint8'))
    inner=np.asarray(A.filter(ImageFilter.MinFilter(15))).astype(float)/255
    rim=np.clip(al-inner,0,1)*bright*warm
    m=np.maximum(m,rim)
    return Image.fromarray((np.clip(m*1.3,0,1)*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.5))
out=sys.argv[1]
for f in sys.argv[2:]:
    m=mask(f); L=Image.new('RGBA',m.size,(255,255,255,0)); L.putalpha(m)
    L.save(os.path.join(out,os.path.basename(f)),'WEBP',quality=60,alpha_quality=55,method=6)
