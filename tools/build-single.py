"""把整个项目打包成一个独立的 HTML 文件，方便发给没有开发环境的人（微信、邮件附件）。

运行：python tools/build-single.py        （在项目根目录）
输出：dist/huanglong.html —— 样式、脚本、数据、图片全部内嵌，双击即可打开。

dist/ 是生成物，已在 .gitignore 中忽略；改内容请改 src/，再重新运行本脚本。
"""
import base64, mimetypes, os, re, subprocess, sys
from datetime import date

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
OUT = os.path.join(ROOT, "dist", "huanglong.html")


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as fh:
        return fh.read()


# 先跑检查，有错误就不打包。
check = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "check.py")])
if check.returncode:
    sys.exit("检查未通过，没有生成文件。")

# assets/ 下（含子文件夹：photos、stamps、badges、guide）的图片转成 data URI，替换所有文本里的 "assets/…"。
assets = {}
for dirpath, _, files in os.walk(os.path.join(ROOT, "assets")):
    for fn in sorted(files):
        path = os.path.join(dirpath, fn)
        mime = mimetypes.guess_type(fn)[0]
        if mime and mime.startswith("image/"):
            rel = os.path.relpath(path, ROOT).replace("\\", "/")
            with open(path, "rb") as fh:
                assets[rel] = "data:%s;base64,%s" % (mime, base64.b64encode(fh.read()).decode("ascii"))


def inline_assets(text):
    for rel, uri in assets.items():
        text = text.replace(rel, uri)
    return text


def no_close(text, tag):
    # 内嵌内容里不能出现 </script> 或 </style>，否则会提前结束标签。
    return re.sub(r"</(%s)" % tag, r"<\\/\1", text, flags=re.I)


html = read("index.html")
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">',
              lambda m: "<style>/* %s */\n%s</style>" % (m.group(1), no_close(inline_assets(read(m.group(1))), "style")), html)
html = re.sub(r'<script src="([^"]+)"></script>',
              lambda m: "<script>/* %s */\n%s</script>" % (m.group(1), no_close(inline_assets(read(m.group(1))), "script")), html)
html = html.replace("<head>", "<head>\n<!-- 由 tools/build-single.py 于 %s 生成，请勿直接修改 -->" % date.today().isoformat(), 1)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8", newline="\n") as fh:
    fh.write(html)
print("已生成 %s（%.0f KB，内嵌图片 %d 张）" % (os.path.relpath(OUT, ROOT), os.path.getsize(OUT) / 1024, len(assets)))
