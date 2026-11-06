"""生成 8 个没有 v1 手绘章的景点印章（assets/stamps/*.svg）。

框、名牌、水滴、金色点缀照抄 v1 的六枚手绘章（600×720 画幅），只换中间的场景，
这样十四枚放在一起是同一套。改场景就改下面 SCENES 里对应的函数，再运行：
    python tools/make-stamps.py
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "stamps")

INK = "#285e50"      # 外框、名牌
CREAM = "#f4ecd5"
GOLD = "#d9c187"
SCENE = "M300 133Q431 134 491 208V474Q490 518 300 561Q110 518 109 474V208Q169 134 300 133Z"

PINE = ('<g id="pine"><path d="M0-59L-13-32H-7L-22-9H-14L-28 14H28L14-9H22L7-32H13Z" fill="currentColor"/>'
        '<path d="M0-42V24" stroke="#dce0bf" stroke-width="1.3" opacity=".4"/></g>')


def pine(x, y, s=1.0, c="#315b46"):
    return f'<use href="#pine" transform="translate({x} {y}) scale({s})" color="{c}"/>'


def sky(top, bottom):
    return (f'<linearGradient id="sky" x2="0" y2="1"><stop stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/></linearGradient>',
            '<path d="M90 120H510V572H90Z" fill="url(#sky)"/>')


def mountains(fill="#74988b", snow="#fff4d9", y=0):
    return (f'<g transform="translate(0 {y})"><path d="M77 300L170 206L222 252L306 160L382 252L428 222L526 318Z" fill="{fill}"/>'
            f'<path d="M170 206L136 244L164 232L176 244L188 226L204 232ZM306 160L252 222L284 210L300 224L310 194L330 218L346 212Z" fill="{snow}"/></g>')


def water_lines(x, y, w, n=2, c="#e9efd7"):
    return "".join(f'<path d="M{x} {y + i * 9}q{w / 2} 7 {w} 0" fill="none" stroke="{c}" stroke-width="1.6" opacity=".7"/>' for i in range(n))


# ---------- 八个场景 ----------
def liantai():
    """莲台飞瀑：一层层像莲台的钙华台地，水帘从台沿垂下"""
    d, bg = sky("#cfe2d6", "#eef0d6")
    out = [bg, mountains(), '<path d="M81 330Q200 280 300 300Q410 280 520 330V560H81Z" fill="#4f7a62"/>']
    tiers = [(300, 300, 120, "#9fd9d4"), (300, 372, 160, "#7cc6c0"), (300, 446, 200, "#5fb1aa")]
    for cx, cy, rx, c in tiers:
        out.append(f'<ellipse cx="{cx}" cy="{cy + 12}" rx="{rx}" ry="26" fill="#a98c58"/>')
        out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="26" fill="{c}" stroke="#f2dfaa" stroke-width="8"/>')
        out.append(water_lines(cx - rx * .45, cy - 4, rx * .9))
    for x in range(200, 410, 18):  # 台沿垂下的水帘
        out.append(f'<path d="M{x} 322v34M{x - 30} 396v38" stroke="#f6fbf2" stroke-width="3" stroke-linecap="round" opacity=".85"/>')
    out += [pine(150, 330, 1.1), pine(452, 322, 1.2), pine(128, 420, .9, "#2f5644"), pine(478, 430, 1, "#2f5644")]
    return d, out, "莲台叠瀑"


def washbody():
    """洗身洞观景台：金色钙华坡上的洞口，前面一道观景栏杆"""
    d, bg = sky("#d6e4d3", "#f1e8c6")
    out = [bg, mountains("#86a593", y=10),
           '<path d="M81 300Q200 262 300 280Q420 258 520 300V560H81Z" fill="#d6b56c"/>',
           '<path d="M81 300Q200 262 300 280Q420 258 520 300" fill="none" stroke="#f2dfaa" stroke-width="6"/>']
    for i, y in enumerate(range(318, 470, 26)):  # 金色滩流的纹路
        out.append(f'<path d="M{100 + i * 6} {y}Q300 {y - 18} {500 - i * 6} {y}" fill="none" stroke="#f3dc9b" stroke-width="3" opacity=".8"/>')
    out.append('<path d="M240 420Q240 330 300 330Q360 330 360 420Z" fill="#3e5a4c"/>')
    out.append('<path d="M252 420Q252 344 300 344Q348 344 348 420Z" fill="#26413a"/>')
    for x in range(262, 344, 12):
        out.append(f'<path d="M{x} 352v62" stroke="#cdeee6" stroke-width="2.2" opacity=".75"/>')
    out.append('<path d="M120 470H480M120 470v40M200 470v40M280 470v40M360 470v40M440 470v40M120 490H480" stroke="#7b5a3a" stroke-width="7" stroke-linecap="round"/>')
    out += [pine(140, 300, 1.1), pine(462, 296, 1.15)]
    return d, out, "金滩洞口"


def mirror():
    """明镜倒映池：雪峰和林带完整地倒映在静水里"""
    d, bg = sky("#c3d8d6", "#eaefdb")
    peak = '<path d="M150 300L240 210L280 246L330 182L410 270L460 300Z" fill="#6f9289"/><path d="M330 182L298 222L318 214L330 226L342 208L356 218Z" fill="#fff4d9"/><path d="M240 210L218 236L236 230L246 238Z" fill="#fff4d9"/>'
    out = [bg, peak, '<path d="M90 300Q300 286 510 300V330H90Z" fill="#3f6a55"/>']
    out += [pine(x, 300, .62, "#2f5644") for x in range(130, 480, 34)]
    out.append('<path d="M96 330H504V540H96Z" fill="#8fd2cc"/>')
    out.append(f'<g transform="translate(0 660) scale(1 -1)" opacity=".42">{peak}</g>')
    out.append('<g opacity=".35" transform="translate(0 660) scale(1 -1)">' + "".join(pine(x, 300, .62, "#2f5644") for x in range(130, 480, 34)) + '</g>')
    out.append('<path d="M96 330Q300 318 504 330" fill="none" stroke="#f2dfaa" stroke-width="7"/>')
    for y in (420, 452, 486):
        out.append(f'<path d="M150 {y}h90M300 {y + 8}h120" stroke="#e9f6f0" stroke-width="2" stroke-linecap="round" opacity=".7"/>')
    return d, out, "天光倒影"


def suoluo():
    """娑罗映彩池：杜鹃（娑罗）花丛探到池面，水里浮着花瓣"""
    d, bg = sky("#dcd7e6", "#efe9d6")
    out = [bg, mountains("#8a9b97", y=8), '<path d="M81 318Q300 284 520 318V560H81Z" fill="#4c7560"/>']
    for cx, cy, rx, c in [(300, 380, 170, "#b5a6d2"), (300, 460, 200, "#8fc3c0")]:
        out.append(f'<ellipse cx="{cx}" cy="{cy + 12}" rx="{rx}" ry="34" fill="#a98c58"/>')
        out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="34" fill="{c}" stroke="#f2dfaa" stroke-width="8"/>')
        out.append(water_lines(cx - rx * .4, cy - 6, rx * .8))

    def bush(x, y, s, flip=1):
        g = [f'<g transform="translate({x} {y}) scale({s * flip} {s})">',
             '<path d="M0 0C-20-40-60-50-90-40C-70-20-40 0 0 0Z" fill="#3d6a4f"/><path d="M0 0C-10-50 10-80 40-90C40-60 30-20 0 0Z" fill="#4d7d5c"/>']
        for bx, by, r in [(-60, -48, 15), (-30, -66, 17), (10, -82, 16), (38, -92, 13), (-82, -30, 12)]:
            g.append(f'<circle cx="{bx}" cy="{by}" r="{r}" fill="#d48fb8"/><circle cx="{bx - 4}" cy="{by - 4}" r="{r * .45}" fill="#f2c6dd"/>')
        g.append('</g>')
        return "".join(g)
    out += [bush(190, 360, 1.05), bush(420, 346, .95, -1)]
    for x, y in [(250, 392), (330, 470), (380, 380), (230, 470), (300, 452)]:
        out.append(f'<ellipse cx="{x}" cy="{y}" rx="6" ry="3.5" fill="#f2c6dd" transform="rotate(-20 {x} {y})"/>')
    return d, out, "花影入池"


def bridge():
    """接仙桥：林间溪流上的木拱桥，桥头一缕祥云"""
    d, bg = sky("#cfe0d2", "#eeecd2")
    out = [bg, mountains(y=4), '<path d="M81 300Q300 270 520 300V560H81Z" fill="#4a755d"/>',
           '<path d="M270 300Q250 380 220 440Q200 500 210 560H390Q380 500 360 440Q330 380 330 300Z" fill="#8fd2cc"/>',
           '<path d="M270 300Q250 380 220 440Q200 500 210 560M330 300Q330 380 360 440Q380 500 390 560" fill="none" stroke="#f2dfaa" stroke-width="6"/>']
    out.append(water_lines(250, 470, 100, 3))
    out.append('<path d="M150 430Q300 340 450 430" fill="none" stroke="#6b4a2f" stroke-width="16" stroke-linecap="round"/>')
    out.append('<path d="M150 430Q300 340 450 430" fill="none" stroke="#a9794a" stroke-width="8" stroke-linecap="round"/>')
    out.append('<path d="M168 402Q300 318 432 402" fill="none" stroke="#6b4a2f" stroke-width="5"/>')
    for x in (180, 220, 260, 300, 340, 380, 420):
        y = 430 - (1 - ((x - 300) / 150) ** 2) * 45
        out.append(f'<path d="M{x} {y:.0f}v-28" stroke="#6b4a2f" stroke-width="5" stroke-linecap="round"/>')
    out.append('<path d="M380 230q16-18 36-6q18-14 34 4q14 0 12 14H384q-12-2-4-12Z" fill="#fbf6e6" opacity=".9"/>')
    out.append('<path d="M396 238q10-8 20 0" fill="none" stroke="#d9c187" stroke-width="2"/>')
    out += [pine(140, 330, 1.2), pine(466, 326, 1.25), pine(120, 470, 1, "#2f5644"), pine(486, 476, 1, "#2f5644")]
    return d, out, "林间渡桥"


def temple(name_peak=False):
    """寺庙：重檐、红墙、台阶；古寺背后多一座雪峰和经幡"""
    d, bg = sky("#cddcd6", "#f0e9cf")
    out = [bg]
    if name_peak:
        out.append('<path d="M110 330L230 196L268 236L320 150L420 268L490 330Z" fill="#8aa49c"/><path d="M320 150L282 204L304 194L318 210L334 186L350 200Z" fill="#fffaf0"/><path d="M230 196L206 228L226 220L238 230Z" fill="#fffaf0"/>')
    else:
        out.append(mountains("#7f9e90", y=20))
    out.append('<path d="M81 340Q300 304 520 340V560H81Z" fill="#4e7a60"/>')
    out += [pine(140, 350, 1.3), pine(470, 346, 1.35), pine(176, 372, 1, "#2f5644"), pine(432, 372, 1, "#2f5644")]
    # 台基、红墙、门
    out.append('<path d="M200 432H400V452H200Z" fill="#c9b892"/><path d="M220 452H380V470H220Z" fill="#b9a780"/>')
    out.append('<path d="M226 372H374V432H226Z" fill="#a8553d"/>')
    out.append('<path d="M286 392H314V432H286Z" fill="#5a2f22"/><path d="M244 388H268V412H244ZM332 388H356V412H332Z" fill="#e3c27c" opacity=".9"/>')
    # 重檐：下檐、上层墙、上檐，檐角起翘
    out.append('<path d="M190 380Q300 356 410 380L428 360Q300 326 172 360Z" fill="#26352f" stroke="#d9c187" stroke-width="3" stroke-linejoin="round"/>')
    out.append('<path d="M250 340H350V362H250Z" fill="#a8553d"/>')
    out.append('<path d="M226 346Q300 324 374 346L392 328Q300 294 208 328Z" fill="#26352f" stroke="#d9c187" stroke-width="3" stroke-linejoin="round"/>')
    out.append('<path d="M296 302h8v-12h-8Z" fill="#d9c187"/><circle cx="300" cy="286" r="5" fill="#d9c187"/>')
    out.append('<path d="M172 360l-8-10M428 360l8-10M208 328l-8-10M392 328l8-10" stroke="#26352f" stroke-width="6" stroke-linecap="round"/>')
    out.append('<path d="M196 374Q300 352 404 374M232 341Q300 321 368 341" fill="none" stroke="#4a6a5e" stroke-width="2" opacity=".8"/>')
    out.append('<path d="M262 470H338L350 520H250Z" fill="#c9b892"/><path d="M256 486h88M253 503h94" stroke="#a8966e" stroke-width="2"/>')
    if name_peak:
        colors = ["#3f7fb0", "#f4ecd5", "#b8433a", "#3f8a5a", "#e2b443"]
        out.append('<path d="M120 280Q210 300 300 286Q390 300 480 280" fill="none" stroke="#7b5a3a" stroke-width="1.6"/>')
        for i in range(12):
            x = 134 + i * 28
            y = 284 + (8 if 3 < i < 8 else 4)
            out.append(f'<path d="M{x} {y}h14v18h-14Z" fill="{colors[i % 5]}"/>')
        # 古寺就在五彩池旁：前面两片小彩池
        out.append('<ellipse cx="170" cy="508" rx="62" ry="16" fill="#7cc6c0" stroke="#f2dfaa" stroke-width="5"/><ellipse cx="432" cy="512" rx="62" ry="16" fill="#e7b96a" stroke="#f2dfaa" stroke-width="5"/>')
    else:
        out.append('<ellipse cx="300" cy="530" rx="120" ry="18" fill="#8fd2cc" stroke="#f2dfaa" stroke-width="5"/>')
    return d, out, "雪山古刹" if name_peak else "林间古寺"


def cave():
    """黄龙洞：洞口向里看，钟乳石垂下，洞底一汪水映着洞口的光"""
    d = ('<radialGradient id="glow" cx=".5" cy=".42" r=".55"><stop stop-color="#f6efd2"/><stop offset=".45" stop-color="#9fbfb2"/>'
         '<stop offset="1" stop-color="#1f3b34"/></radialGradient>')
    out = ['<path d="M90 120H510V572H90Z" fill="#1f3b34"/>',
           '<path d="M140 560Q130 300 300 250Q470 300 460 560Z" fill="url(#glow)"/>',
           '<path d="M140 560Q130 300 300 250Q470 300 460 560" fill="none" stroke="#d8c58f" stroke-width="5" opacity=".7"/>']
    for x, h, w in [(170, 120, 26), (214, 80, 18), (252, 140, 22), (296, 60, 14), (334, 110, 20), (380, 150, 26), (424, 90, 20)]:
        out.append(f'<path d="M{x - w} 130L{x + w} 130L{x} {130 + h}Z" fill="#e0d3a8"/><path d="M{x - w / 3:.0f} 130L{x + w / 3:.0f} 130L{x} {130 + h * .7:.0f}Z" fill="#f6ecc9"/>')
    for x, h, w in [(186, 60, 22), (240, 38, 16), (372, 46, 18), (420, 70, 24)]:
        out.append(f'<path d="M{x - w} 500L{x + w} 500L{x} {500 - h}Z" fill="#d4c497"/>')
    out.append('<ellipse cx="300" cy="510" rx="140" ry="22" fill="#7cc6c0" stroke="#f2dfaa" stroke-width="5"/>')
    out.append('<ellipse cx="300" cy="506" rx="60" ry="7" fill="#f6efd2" opacity=".6"/>')
    for x, y in [(282, 412), (300, 446), (318, 400)]:
        out.append(f'<path d="M{x} {y}q-4 7 0 10q4-3 0-10Z" fill="#cdeee6"/>')
    return d, out, "洞中钟乳"


SCENES = {
    "liantai-fall": ("莲台飞瀑", liantai),
    "wash-body-viewpoint": ("洗身洞观景台", washbody),
    "mirror-pond": ("明镜倒映池", mirror),
    "suoluo-pond": ("娑罗映彩池", suoluo),
    "immortal-bridge": ("接仙桥", bridge),
    "huanglong-middle-temple": ("黄龙中寺", lambda: temple(False)),
    "huanglong-ancient-temple": ("黄龙古寺", lambda: temple(True)),
    "huanglong-cave": ("黄龙洞", cave),
}


def stamp(name, scene):
    defs, body, sub = scene()
    size = {2: 44, 3: 42, 4: 38, 5: 32, 6: 27}[len(name)]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="600" height="720" viewBox="0 0 600 720" role="img" aria-labelledby="title"><title id="title">{name} · {sub}</title>
<defs><clipPath id="scene"><path d="{SCENE}"/></clipPath>{defs}{PINE}</defs>
<path d="M300 29L472 97L538 183V501L494 575L300 687L106 575L62 501V183L128 97Z" fill="{INK}"/>
<path d="M300 40L465 109L526 187V497L485 566L300 674L115 566L74 497V187L135 109Z" fill="{CREAM}" stroke="{GOLD}" stroke-width="6"/>
<path d="M300 58L454 121L510 195V491L474 555L300 654L126 555L90 491V195L146 121Z" fill="none" stroke="{GOLD}" stroke-width="1.5"/>
<g clip-path="url(#scene)">{"".join(body)}</g>
<path d="{SCENE}" fill="none" stroke="{INK}" stroke-width="4"/>
<g text-anchor="middle" font-family="'Microsoft YaHei',sans-serif">
<text x="300" y="122" fill="{INK}" font-size="12" letter-spacing="5">HUANGLONG</text>
<path d="M124 515Q300 566 476 515L465 570Q300 647 135 570Z" fill="{INK}" stroke="{GOLD}" stroke-width="2"/>
<text x="300" y="{588 - (42 - size) // 3}" fill="#f6e9c7" font-size="{size}" font-weight="600" letter-spacing="{5 if len(name) < 5 else 2}">{name}</text>
<text x="300" y="634" fill="{INK}" font-size="14" letter-spacing="4">{sub}</text>
</g>
<path d="M300 64C294 79 285 83 285 94a15 15 0 0030 0c0-11-9-15-15-30Z" fill="#91c6b2" stroke="{INK}" stroke-width="1.5"/>
<g fill="{GOLD}"><path d="M104 256l4 6-4 6-4-6ZM496 256l4 6-4 6-4-6ZM300 645l3 5-3 5-3-5Z"/><circle cx="174" cy="602" r="2.5"/><circle cx="426" cy="602" r="2.5"/></g>
</svg>
'''


if __name__ == "__main__":
    for sid, (name, scene) in SCENES.items():
        path = os.path.join(OUT, sid + ".svg")
        with open(path, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(stamp(name, scene))
        print("写入", os.path.relpath(path, ROOT))
