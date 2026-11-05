"""提交前检查：数据格式、引用关系、脚本清单、动作名称。只需要 Python 3，不用安装任何包。

运行：python tools/check.py        （在项目根目录）
全部通过时退出码为 0；有问题时逐条列出并以 1 退出。
"""
import json, os, re, sys
from urllib.parse import urlparse

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
errors, warnings = [], []
err = errors.append
warn = warnings.append


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as fh:
        return fh.read()


def load_data(name):
    """src/data/<name>.js 的格式是「注释 + HL.data.<name> = <JSON>;」。"""
    rel = "src/data/%s.js" % name
    text = read(rel)
    m = re.search(r"HL\.data\.%s\s*=\s*" % name, text)
    if not m:
        err("%s：找不到 HL.data.%s = ..." % (rel, name))
        return None
    body = text[m.end():].rstrip().rstrip(";")
    try:
        return json.loads(body)
    except json.JSONDecodeError as e:
        err("%s：不是合法 JSON（第 %d 行附近：%s）。常见原因：单引号、尾逗号、写了注释。" % (rel, body[:e.pos].count("\n") + m.string[:m.end()].count("\n") + 1, e.msg))
        return None


# 卡片 go 字段可用的内部去向，与 src/features/details.js 的 GO 保持一致。
GO = {"", "home", "tour", "services", "mine", "facilities", "medical", "guide", "water", "lab"}
FAC_TYPES = {"toilet", "supply", "medical", "transit", "visitor"}
CARD_FIELDS = ["id", "kind", "title", "subtitle", "body", "go", "cta", "url", "author"]

index_html = read("index.html")
icons = set(re.findall(r'<symbol id="i-([\w-]+)"', index_html))

meta, stations, facilities, cards = (load_data(n) for n in ("meta", "stations", "facilities", "cards"))
ids = {}


def claim(i, where):
    if i in ids:
        err("重复的 id「%s」：%s 和 %s" % (i, ids[i], where))
    ids[i] = where


def check_url(u, where):
    if not u:
        return
    p = urlparse(u)
    if p.scheme not in ("http", "https") or not p.netloc:
        err("%s：url 必须是完整的 http(s) 网址，现在是「%s」" % (where, u))


def check_asset(src, where):
    if not os.path.isfile(os.path.join(ROOT, src)):
        err("%s：图片 %s 不存在" % (where, src))


# ---------- 景点 ----------
station_ids = set()
if stations is not None:
    for k, s in enumerate(stations):
        where = "stations[%d] %s" % (k, s.get("id", "?"))
        for f, t in [("id", str), ("name", str), ("category", str), ("area", str), ("minutes", int), ("effort", int),
                     ("tint", str), ("loc", list), ("tagline", str), ("summary", str), ("viewing", str), ("photoTip", str), ("tip", str)]:
            if not isinstance(s.get(f), t):
                err("%s：缺少字段 %s 或类型不对（应为 %s）" % (where, f, t.__name__))
        if not isinstance(s.get("id"), str):
            continue
        claim(s["id"], where)
        station_ids.add(s["id"])
        if isinstance(s.get("effort"), int) and not 1 <= s["effort"] <= 3:
            err("%s：effort 应为 1–3" % where)
        if isinstance(s.get("tint"), str) and not re.fullmatch(r"#[0-9a-fA-F]{6}", s["tint"]):
            err("%s：tint 应为 #rrggbb" % where)
        loc = s.get("loc")
        if isinstance(loc, list) and not (len(loc) == 2 and 103 < loc[0] < 104.5 and 32 < loc[1] < 33.5):
            warn("%s：坐标 %s 不在黄龙沟附近，确认是不是写反了经纬度" % (where, loc))
        # v1 并入的内容字段（2026-11-02）
        if s.get("collection") not in ("pond", "waterfall", "landform", "culture"):
            err("%s：collection 应为 pond / waterfall / landform / culture 之一" % where)
        if not isinstance(s.get("rank"), int):
            err("%s：rank 应为整数（越大越优先细看）" % where)
        for f in ("aliases", "highlights", "story"):
            if not (isinstance(s.get(f), list) and all(isinstance(x, str) and x for x in s[f])):
                err("%s：%s 应为文字列表（没有就写 []）" % (where, f))
        for f in ("intro", "tradeoff", "expectation", "checkedAt"):
            if not isinstance(s.get(f), str):
                err("%s：缺少字段 %s（没有就写空字符串）" % (where, f))
        for j, src in enumerate(s.get("sources") or []):
            if not src.get("title"):
                err("%s：sources[%d] 缺少 title" % (where, j))
            check_url(src.get("url", ""), "%s sources[%d]" % (where, j))
        if s.get("stamp"):
            check_asset(s["stamp"], where + " stamp")
        facts = s.get("facts", [])
        if not (isinstance(facts, list) and all(isinstance(f, list) and len(f) == 2 and all(isinstance(y, str) and y for y in f) for f in facts)):
            err("%s：facts 应为 [[名称, 数值], …]" % where)
        if s.get("photo") and s["photo"].get("page"):
            check_url(s["photo"]["page"], where + " photo.page")
        if s.get("photo"):
            if not s["photo"].get("credit"):
                err("%s：照片必须写 credit（作者与授权）" % where)
            check_asset(s["photo"].get("src", ""), where)

# ---------- 设施 ----------
if facilities is not None:
    for k, f in enumerate(facilities):
        where = "facilities[%d] %s" % (k, f.get("id", "?"))
        if f.get("type") not in FAC_TYPES:
            err("%s：type 应为 %s 之一" % (where, "/".join(sorted(FAC_TYPES))))
        if not f.get("name"):
            err("%s：缺少 name" % where)
        loc = f.get("loc")
        if not (isinstance(loc, list) and len(loc) == 2):
            err("%s：loc 应为 [经度, 纬度]" % where)
        if f.get("id"):
            claim(f["id"], where)

# ---------- 卡片 ----------
def check_card(c, where, need_icon=True):
    for f in CARD_FIELDS:
        if f not in c:
            err("%s：缺少字段 %s（没有就写空字符串）" % (where, f))
    if c.get("id"):
        claim(c["id"], where)
    if c.get("go", "") not in GO:
        err("%s：go「%s」不认识，可用：%s" % (where, c.get("go"), "、".join(sorted(g for g in GO if g))))
    check_url(c.get("url", ""), where)
    if need_icon:
        if not c.get("icon"):
            err("%s：缺少 icon" % where)
        elif c["icon"] not in icons:
            err("%s：图标「%s」不在 index.html 的 sprite 里" % (where, c["icon"]))


if cards is not None:
    for k, c in enumerate(cards.get("quick", [])):
        check_card(c, "cards.quick[%d]" % k)
        if c.get("go") not in ("home", "tour", "services", "mine"):
            err("cards.quick[%d]：快捷入口的 go 只能是四个页面之一" % k)
    if "inspire" in cards:
        check_card(cards["inspire"], "cards.inspire", need_icon=False)
    featured = 0
    for g, group in enumerate(cards.get("services", [])):
        if not group.get("title"):
            err("cards.services[%d]：缺少组标题 title" % g)
        for k, c in enumerate(group.get("items", [])):
            check_card(c, "cards.services[%d].items[%d] %s" % (g, k, c.get("id", "?")))
            featured += bool(c.get("featured"))
    if featured > 1:
        warn("服务页有 %d 张 featured 卡片，顶部醒目入口建议只放一张" % featured)
    for k, p in enumerate(cards.get("products", [])):
        check_card(p, "cards.products[%d] %s" % (k, p.get("id", "?")), need_icon=False)
        for v in p.get("variants", []):
            if not v.get("label") or not v.get("img"):
                err("cards.products[%d] %s：variants 每项要有 label 和 img" % (k, p.get("id", "?")))
            else:
                check_asset(v["img"], "cards.products[%d] %s 款式「%s」" % (k, p.get("id", "?"), v["label"]))
        if p.get("fit", "cover") not in ("cover", "contain"):
            err("cards.products[%d] %s：fit 只能是 cover 或 contain" % (k, p.get("id", "?")))
    for k, c in enumerate(cards.get("mine", [])):
        check_card(c, "cards.mine[%d] %s" % (k, c.get("id", "?")))

# ---------- 数字人导游 data/guide.js ----------
guide = load_data("guide")
if guide is not None:
    cloud = guide.get("cloud", {})
    key = cloud.get("publishableKey", "")
    if key and not key.startswith("wbpk_"):
        err("guide.cloud.publishableKey：只能放 wbpk_ 开头的公开只读密钥，服务端 / 写权限密钥不能进前端")
    if cloud.get("sdk") and not os.path.isfile(os.path.join(ROOT, cloud["sdk"])):
        err("guide.cloud.sdk：文件 %s 不存在" % cloud["sdk"])
    personas = guide.get("personas", {})
    for k in guide.get("order", []):
        if k not in personas:
            err("guide.order：没有角色「%s」" % k)
    for k, pr in personas.items():
        where = "guide.personas.%s" % k
        for f in ("name", "tag", "board", "welcome", "persona", "scope", "boundary", "avatar"):
            if not isinstance(pr.get(f), str) or not pr.get(f):
                err("%s：缺少 %s" % (where, f))
        if pr.get("board") not in ("public", "karst", "orchid", "biodiv"):
            err("%s：board 应为 public / karst / orchid / biodiv（与云端知识库分区一致）" % where)
        if pr.get("avatar"):
            check_asset(pr["avatar"], where)
        if not (isinstance(pr.get("chips"), list) and pr["chips"]):
            err("%s：chips 至少要有一个常用问题" % where)

# ---------- 数字人配图 data/photos.js ----------
photos = load_data("photos")
if photos is not None:
    for k, ph in enumerate(photos):
        where = "photos[%d] %s" % (k, ph.get("title", "?"))
        if not ph.get("title") or not ph.get("keywords"):
            err("%s：缺少 title 或 keywords" % where)
        bs = ph.get("boards") or [ph.get("board")]
        if not all(b in ("public", "karst", "orchid", "biodiv") for b in bs):
            err("%s：board 应为 public / karst / orchid / biodiv" % where)
        check_asset(ph.get("file", ""), where)
        check_url(ph.get("source", ""), where)

# ---------- 徽章 data/badges.js ----------
badges = load_data("badges")
if badges is not None and stations is not None:
    for i in badges.get("main", []):
        if i not in station_ids:
            err("badges.main：没有 id 为「%s」的景点" % i)
    for b in badges.get("themes", []) + badges.get("stickers", []):
        where = "badges %s" % b.get("id", "?")
        if b.get("img"):
            check_asset(b["img"], where)
        else:
            err("%s：缺少 img" % where)
        for i in b.get("poiIds", []):
            if i not in station_ids:
                err("%s：poiIds 里没有景点「%s」" % (where, i))
    # 生灵徽章：问导游时问题里出现 keywords 就收下，同一个关键词不能分给两个物种
    seen_kw = {}
    for s in badges.get("species", []):
        where = "badges.species %s" % s.get("id", "?")
        for f in ("id", "name", "latin", "en", "group", "img", "description"):
            if not s.get(f):
                err("%s：缺少 %s" % (where, f))
        if s.get("id"):
            claim(s["id"], where)
        if s.get("img"):
            check_asset(s["img"], where)
        kws = s.get("keywords") or []
        if s.get("name") not in kws:
            err("%s：keywords 里要包含物种名「%s」" % (where, s.get("name")))
        for kw in kws:
            if kw in seen_kw:
                err("%s：关键词「%s」已经给了 %s" % (where, kw, seen_kw[kw]))
            seen_kw[kw] = s.get("id")
    if badges.get("species") and not badges.get("speciesRule"):
        err("badges：有 species 时要写 speciesRule（我的页显示的规则说明）")

# ---------- 首页配置 ----------
if meta is not None and stations is not None:
    for i in meta.get("featured", []):
        if i not in station_ids:
            err("meta.featured：没有 id 为「%s」的景点" % i)
    for key in ("finale",):
        if meta.get(key) not in station_ids:
            err("meta.%s：没有 id 为「%s」的景点" % (key, meta.get(key)))
    hero = meta.get("hero", {})
    st = next((s for s in stations if s.get("id") == hero.get("station")), None)
    if not st:
        err("meta.hero.station：没有 id 为「%s」的景点" % hero.get("station"))
    elif not st.get("photo"):
        err("meta.hero.station：主视觉景点「%s」必须有实景照片" % st["id"])

# ---------- 脚本清单与动作 ----------
scripts = re.findall(r'<script src="([^"]+)"', index_html)
styles = re.findall(r'<link rel="stylesheet" href="([^"]+)"', index_html)
for rel in scripts + styles:
    if not os.path.isfile(os.path.join(ROOT, rel)):
        err("index.html 引用了不存在的文件 %s" % rel)
# 本机配置由 tour-map-tencent.js 按需加载，不能写进 index.html，否则单文件打包会把 Key 带出去
LOCAL_CONFIG = {"src/config.example.js", "src/config.local.js"}
for rel in LOCAL_CONFIG & set(scripts):
    err("index.html 不能直接引用 %s（含本机 Key，由地图模块按需加载）" % rel)
if os.path.isfile(os.path.join(ROOT, "src/config.example.js")) and re.search(r"tmapKey\s*=\s*'[^']+'", read("src/config.example.js")):
    err("src/config.example.js 里不能填真实 Key，请写在 src/config.local.js")
for folder, ext, listed in (("src", ".js", scripts), ("src/styles", ".css", styles)):
    for dirpath, _, files in os.walk(os.path.join(ROOT, folder)):
        for fn in files:
            rel = os.path.relpath(os.path.join(dirpath, fn), ROOT).replace("\\", "/")
            if fn.endswith(ext) and rel not in listed and rel not in LOCAL_CONFIG:
                err("%s 没有在 index.html 里引用" % rel)
if scripts and scripts[0] != "src/core/hl.js":
    err("index.html：src/core/hl.js 必须第一个加载")
if scripts and scripts[-1] != "src/main.js":
    err("index.html：src/main.js 必须最后加载")

js = {rel: read(rel) for rel in scripts if os.path.isfile(os.path.join(ROOT, rel))}
registered = {}
for rel, text in js.items():
    for name in re.findall(r"HL\.act\('([a-z0-9-]+)'", text):
        if name in registered:
            err("动作「%s」在 %s 和 %s 重复登记" % (name, registered[name], rel))
        registered[name] = rel
used = set()
for text in list(js.values()) + [index_html]:
    used.update(re.findall(r'data-act="([a-z0-9-]+)"', text))
for name in sorted(used - set(registered)):
    err("data-act=\"%s\" 没有对应的 HL.act('%s', …)" % (name, name))
for text in js.values():
    for n in re.findall(r"icon\('([\w-]+)'", text):
        if n not in icons:
            err("代码里用了不存在的图标「%s」" % n)

# ---------- 结果 ----------
for w in warnings:
    print("提醒  " + w)
for e in errors:
    print("错误  " + e)
counts = []
if stations is not None:
    counts.append("景点 %d" % len(stations))
if facilities is not None:
    counts.append("设施 %d" % len(facilities))
if cards is not None:
    counts.append("服务入口 %d" % sum(len(g.get("items", [])) for g in cards.get("services", [])))
print("%s：%s，动作 %d 个，脚本 %d 个。" % ("未通过" if errors else "通过", "，".join(counts), len(registered), len(scripts)))
sys.exit(1 if errors else 0)
