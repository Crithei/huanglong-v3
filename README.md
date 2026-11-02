# 黄龙景区综合服务系统 · 第三版前端骨架

手机竖屏优先的景区服务网页原型，最终面向微信小程序。底部四页固定为 **首页 / 游览 / 服务 / 我的**。

这一版沿用第二版设计稿（`huanglong-v2-design`）的视觉，主要整理代码结构，方便多人分工继续开发：

- 代码按页面和功能拆成小文件，每人负责自己的文件，减少冲突；
- 内容全部放在 `src/data/`，改文案、加服务入口不用碰代码；
- 不需要安装任何依赖，双击 `index.html` 就能打开；
- `python tools/check.py` 在提交前检查数据和代码引用；
- `python tools/build-single.py` 打包成一个 HTML 文件，发给没有开发环境的人。

**在线访问：** <https://huanglong.nyxal.site/>（手机打开效果最好）

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

生成的 `dist/huanglong.html` 内嵌了样式、脚本、数据和图片（约 0.9 MB），可以直接用微信或邮件发送。

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
    cards.js          内容卡片：快捷入口、游玩灵感、服务三组、文创商品、旅行记录
  core/               基础：命名空间与工具、数据索引、本机状态、页面切换
  ui/                 跨页面组件：插图、列表行、色带、弹层、提示
  features/           功能：详情弹层（含作品链接）、数字人导游
  pages/              四个页面，各管各的渲染和动作
    home.js  tour-map.js  tour-map-tencent.js  tour.js  services.js  mine.js
  config.example.js   本机配置模板（地图 Key）；复制为 config.local.js 后填写，后者不进仓库
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
| 新增文创商品 | `cards.js` → `products`；如需专门的占位图，在 `src/ui/art.js` 的 `productArt` 里加一种 |
| 改某一页的版式 | `src/pages/<页面>.js` 与 `src/styles/<页面>.css` |
| 接入真实的数字人问答 | 替换 `HL.guide.provider`，见 `src/features/guide.js` 顶部说明 |
| 本机显示腾讯地图 | 复制 `src/config.example.js` 为 `src/config.local.js` 并填 Key（不进仓库），见开发指南「地图」 |
| 改地图上画的内容 | `src/pages/tour-map-tencent.js`；示意图在 `src/pages/tour-map.js` |

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

- **第一版**（[Crithei/huanglong-poi-route-prototype](https://github.com/Crithei/huanglong-poi-route-prototype)）有真实高德地图、POI 目录、游线规则、到站打卡、Three.js 小游戏、彩池实验室、护照与手账。本骨架的景点和设施数据来自第一版的 `data/`，其他功能没有迁移。
- **第二版**（可编辑展示原型 `prototype.html`）确定了四页结构、服务分组和卡片内容，并带浏览器内编辑器和 HTML / JSON 导出。本骨架沿用它的卡片字段（`cta / url / author` 等），但**没有移植浏览器内编辑器**，原因和后续选项见 [docs/现状与待办.md](docs/现状与待办.md)。
- **第二版设计稿**（`huanglong-v2-design`）是本骨架的视觉来源，页面效果与它保持一致。

## 素材授权

- `assets/five-colored-pond.jpg`、`assets/welcome-ponds.jpg`：Kounosu，CC BY-SA 3.0，来自 Wikimedia Commons。使用时保留署名。
- 设施数据：高德地图 Web Service v3/place/around，查询于 2026-09-18。
- 其余插图（景点示意图、文创占位图、印章）由代码生成。
