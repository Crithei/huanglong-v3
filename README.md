# 黄龙景区综合服务系统 · 第三版前端骨架

手机竖屏优先的景区服务网页原型，最终面向微信小程序。底部四页为 **首页 / 游览 / 互动 / 服务**：互动页放一滴水四章、彩池实验室、听见黄龙声景手册和印章、徽章、生灵收集；服务页放服务入口，底部是「我的记录」（路线进度、想去、想要、旅行记录）。

这一版沿用第二版设计稿（`huanglong-v2-design`）的视觉，主要整理代码结构，方便多人分工继续开发：

- 代码按页面和功能拆成小文件，每人负责自己的文件，减少冲突；
- 内容全部放在 `src/data/`，改文案、加服务入口不用碰代码；
- 不需要安装任何依赖，双击 `index.html` 就能打开；
- `python tools/check.py` 在提交前检查数据和代码引用；
- `python tools/build-single.py` 打包成一个 HTML 文件，发给没有开发环境的人。

**在线访问：** <https://huanglong.nyxal.site/>（手机打开效果最好）

**汇报演示：** <https://huanglong.nyxal.site/present/>（电脑横屏打开；左边是真实页面，右边是讲解，两边互相跳转；← → 翻页，N 显示 / 隐藏讲解要点）

## 快速开始

**直接看效果：** 双击 `index.html`，用 Chrome 或 Edge 打开。电脑上会显示手机画幅，手机上全屏显示。

**本地预览（推荐开发时使用）：**

```bash
python -m http.server 4191 --bind 127.0.0.1
```

然后在浏览器打开 http://127.0.0.1:4191/ 。这是本机地址，不能发给别人。

**提交前检查：**

```bash
python tools/check.py
```

**生成单文件版：**

```bash
python tools/build-single.py
```

生成的 `dist/huanglong.html` 内嵌了样式、脚本、数据和全部图片（约 3.2 MB；不含水滴四章的三维场景和数字人云端问答，这两样在单文件版里分别显示二维示意和内置回答），可以直接用微信或邮件发送。

只需要 Python 3.8 及以上，不需要 Node、npm 或任何第三方包。

## 目录

```
index.html            外壳：图标 sprite、页面容器、底部导航；按顺序引用全部 CSS / JS
assets/               图片（实景照片需写明作者与授权，见下）
src/
  data/               ← 内容：改文案、加入口都在这里
    meta.js           首页主视觉、精选景观、终点、数据来源
    stations.js       14 处景点，数组顺序就是游线顺序
    facilities.js     51 个沿途设施（高德 POI，GCJ-02 坐标）
    cards.js          内容卡片：快捷入口、服务三组、文创商品、旅行记录
  core/               基础：命名空间与工具、数据索引、本机状态、页面切换
  ui/                 跨页面组件：插图、列表行、色带、弹层、提示、首页滑动视差
  features/           功能：详情弹层（含作品链接）、数字人导游
  pages/              四个页面，各管各的渲染和动作
    home.js  tour-map.js  tour-map-tencent.js  tour.js  play.js  services.js
  config.example.js   本机配置模板（地图 Key）；复制为 config.local.js 后填写，后者不进仓库
vendor/
  huanglong-water/    从 v1 原样搬来的水滴四章状态机与三维场景（不要直接改，见其中 README）
  huanglong-pool/     从 v1 原样搬来的彩池实验室模型与画面（不要直接改，见其中 README）
  workbuddy/          数字人云端问答 SDK（来自数字人交接包）
  styles/             样式：base 是设计令牌与通用组件，其余按区域分文件
  main.js             启动与事件分发（最后加载）
tools/
  check.py            数据与代码检查
  build-single.py     打包单文件 HTML
docs/
  开发指南.md          架构、数据字段、常见改动的做法、约定
  现状与待办.md        哪些已实现、哪些是演示、哪些等接口；待决定的事项
```

## 常见改动

| 想做的事 | 改哪里 |
| --- | --- |
| 改景点介绍、拍摄建议 | `src/data/stations.js` |
| 改服务入口的标题、说明 | `src/data/cards.js` → `services` |
| 给科普视频、小游戏、数字人作品接上网址 | `src/data/cards.js` 对应卡片的 `url`（完整 http/https 地址），`author` 写作者 |
| 新增一个服务入口 | 在 `cards.js` 的对应组 `items` 里复制一张卡片，改 `id` 和内容 |
| 换首页精选景观 | `src/data/meta.js` → `featured` |
| 新增文创商品 | `cards.js` → `products`；填 `variants` 放效果图；没有效果图时显示 `src/ui/art.js` 里 `productArt` 的通用示意图 |
| 改某一页的版式 | `src/pages/<页面>.js` 与 `src/styles/<页面>.css` |
| 改数字人的人设、欢迎语、常用问题 | `src/data/guide.js`；问答流程在 `src/features/guide-cloud.js`，见开发指南「数字人导游」 |
| 本机显示腾讯地图 | 复制 `src/config.example.js` 为 `src/config.local.js` 并填 Key（不进仓库），见开发指南「地图」 |
| 改地图上画的内容 | `src/pages/tour-map-tencent.js`；示意图在 `src/pages/tour-map.js` |
| 改游线规划的估算数字 | `src/features/planner.js` 顶部 |
| 改水滴四章的文案、按钮、样式 | `src/features/water.js`、`src/styles/water.css`；玩法和模型在 v1 改，见 `vendor/huanglong-water/README.md` |

每次改完运行 `python tools/check.py`。详细字段说明和示例见 [docs/开发指南.md](docs/开发指南.md)。

## 多人协作

仓库：<https://github.com/Crithei/huanglong-v3>（公开）

```bash
git clone https://github.com/Crithei/huanglong-v3.git
cd huanglong-v3
python tools/check.py
```

每个功能开一个分支，合并前跑一遍 `tools/check.py`。仓库公开，**不要提交任何地图 Key 或密钥**（`.env`、`*.local.*` 已在 `.gitignore` 中排除）。`dist/` 是生成物，不进仓库，需要时本地运行 `build-single.py` 生成。

分工建议按文件划分，每人负责一页或一个功能：`pages/home.js + styles/home.css`、`pages/tour*.js + styles/tour.css`，以此类推。内容组只改 `src/data/`。`core/`、`ui/`、`index.html`、`styles/base.css` 是公共部分，改之前在群里说一声。

不熟悉 Git 的组员可以只改 `src/data/` 里的文件，发给汇总的人合并；也可以在 GitHub 网页上直接编辑 `src/data/` 里的文件并提交修改请求。

## 与前两版的关系

- **第一版**（[Crithei/huanglong-poi-route-prototype](https://github.com/Crithei/huanglong-poi-route-prototype)）有真实高德地图、POI 目录、游线规则、到站打卡、Three.js 小游戏、彩池实验室、护照与手账。已迁入：景点与设施数据、景点完整介绍、游线规划（改为细看 / 路过）、水滴四章（三维场景与状态机原样使用）、彩池实验室、手绘印章与徽章。尚未迁入：数字手账。
- **第二版**（可编辑展示原型 `prototype.html`）确定了四页结构、服务分组和卡片内容，并带浏览器内编辑器和 HTML / JSON 导出。本骨架沿用它的卡片字段（`cta / url / author` 等），但**没有移植浏览器内编辑器**，原因和后续选项见 [docs/现状与待办.md](docs/现状与待办.md)。
- **第二版设计稿**（`huanglong-v2-design`）是本骨架的视觉来源，页面效果与它保持一致。

## 素材授权

景点实景照片均来自 Wikimedia Commons，协议为 CC BY 3.0 或 CC BY-SA 3.0，可以商用和修改，但**必须保留署名和协议**（页面上每张照片下方都有署名链接）。BY-SA 的照片若被裁剪、调色后另行发布，新作品也要用同样的协议。照片已缩到 960 像素宽以减小体积。黄龙洞暂无可确认地点、协议合适的照片，仍用示意图。

| 景点 | 文件 | 作者 · 协议 | 原图 |
| --- | --- | --- | --- |
| 迎宾池 | `assets/welcome-ponds.jpg` | Kounosu · CC BY-SA 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Welcome-Ponds_Huanglong_Sichuan_China.jpg) |
| 飞瀑流辉 | `assets/photos/flying-waterfall.jpg` | rheins · CC BY 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E9%A3%9E%E7%80%91%E6%B5%81%E8%BE%89_-_Marvellous_Flying_Waterfll_-_2011.10_-_panoramio.jpg) |
| 莲台飞瀑 | `assets/photos/liantai-fall.jpg` | Leungcwd · CC BY-SA 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E9%BB%83%E9%BE%8D-%E8%93%AE%E5%8F%B0%E9%A3%9B%E7%80%91.JPG) |
| 洗身洞观景台 | `assets/photos/wash-body-viewpoint.jpg` | Leungcwd · CC BY-SA 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E9%BB%83%E9%BE%8D-%E6%B4%97%E8%BA%AB%E6%B4%9E.JPG) |
| 金沙铺地 | `assets/photos/jinsha-pudi.jpg` | Kounosu · CC BY-SA 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Golden-Sand-Field_Huanglong_Sichuan_China.jpg) |
| 盆景池 | `assets/photos/bonsai-pond.jpg` | rheins · CC BY 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E7%9B%86%E6%99%AF%E6%B1%A0_-_Bonsai_Pond_-_2011.10_-_panoramio.jpg) |
| 明镜倒映池 | `assets/photos/mirror-pond.jpg` | Leungcwd · CC BY-SA 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E9%BB%83%E9%BE%8D-%E6%98%8E%E9%8F%A1%E5%80%92%E6%98%A0%E6%B1%A0.JPG) |
| 娑罗映彩池 | `assets/photos/suoluo-pond.jpg` | Leungcwd · CC BY-SA 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E9%BB%83%E9%BE%8D-%E5%A8%91%E8%98%BF%E6%98%A0%E5%BD%A9%E6%B1%A0.JPG) |
| 争艳彩池 | `assets/photos/zhengyan-chi.jpg` | rheins · CC BY 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E4%BA%89%E8%89%B3%E6%B1%A0%E5%85%A8%E6%99%AF_-_Panorama_of_Beauty-Competing_Pond_-_2011.10_-_panoramio.jpg) |
| 接仙桥 | `assets/photos/immortal-bridge.jpg` | rheins · CC BY 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E6%8E%A5%E4%BB%99%E6%A1%A5_-_Immortal_Guilding_Bridge_-_2011.10_-_panoramio.jpg) |
| 黄龙中寺 | `assets/photos/huanglong-middle-temple.jpg` | Jmhullot · CC BY 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Huanglong_middle_temple.jpg) |
| 黄龙古寺 | `assets/photos/huanglong-ancient-temple.jpg` | Jmhullot · CC BY 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Huanglong_ancient_temple.jpg) |
| 五彩池 | `assets/five-colored-pond.jpg` | Kounosu · CC BY-SA 3.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Water-of-Five-colored-Pond_Huanglong_Sichuan_China.jpg) |
- 设施数据：高德地图 Web Service v3/place/around，查询于 2026-09-18。
- `assets/stamps/`、`assets/badges/`：印章、徽章与贴纸。六枚手绘章和主题徽章来自 v1 `assets/passport/`（原创 SVG）；另外 8 枚景点章由 `tools/make-stamps.py` 按同一套框生成。
- `assets/guide/`：四位数字人头像，来自「黄龙数字人网页端交接包 20261102」。
- `assets/guide/photos/`：数字人回答配图 45 张，同样来自交接包图库，索引在 `src/data/photos.js`，作者与协议写在每条的 `credit`、大图下方有显示。景区实景 18 张来自 Wikimedia Commons；生物多样性 7 张照片来自 iNaturalist（CC BY / CC0），另 20 张是项目自绘的图纸与物种设定图。兰花图库 150 张没有许可说明，暂未收入。单文件版不内嵌这些图。
- `assets/species/`、`assets/shop/`：十枚生灵徽章，以及文创商店的兰花书签、兰花珐琅徽章、贴纸、邮票、鸟类明信片、羚牛玩偶效果图，来自项目组素材包「11-5」和「兰花文创」，已转成 webp 并压缩尺寸。
- `assets/play/`：首页「随行互动」两张卡片的配图，是本项目一滴水第四章完成态的三维模型和彩池实验室池群画面的截图。
- 其余插图（景点示意图）由代码生成。
