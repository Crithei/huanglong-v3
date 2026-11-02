# 水滴四章：从 v1 原样搬来的两个文件

来源：v1 仓库 [Crithei/huanglong-poi-route-prototype](https://github.com/Crithei/huanglong-poi-route-prototype)，本地提交 `28797c5`（2026-10-27「寻泉裂隙」版，含三消开路的第一章）。复制于 2026-11-02，内容未改动。

| 文件 | v1 原路径 | 作用 | 全局名 |
| --- | --- | --- | --- |
| `follow-state.js` | `follow-state.js` | 四章状态机：解锁、互动规则、计时推进、奖励、存档校验 | `window.HuanglongJournal` |
| `water-scene.js` | `assets/water-scene.js` | Three.js 0.180.0 低多边形场景（打包产物，约 575 KB，含 Three.js） | `window.HuanglongWaterScene` |
| `THREE-LICENSE.txt` | `assets/THREE-LICENSE` | Three.js 的 MIT 许可证，随打包产物分发时必须保留 | — |

v3 的界面在 `src/features/water.js`，只调用这两个文件公开的函数，不改它们。

- `follow-state.js` 在页面启动时加载（存档校验要用）。
- `water-scene.js` 体积大，只在第一次打开章节页时加载；加载失败或浏览器不支持 WebGL 时，章节页显示二维示意，互动照常可完成。

## 要改玩法或模型时

这两个文件是 v1 的源码 / 构建产物，不要在这里直接改：

- 改规则、文案判定：在 v1 的 `follow-state.js` 改并跑 v1 的测试（`npm test`），再复制过来；
- 改三维模型：在 v1 的 `src/water-*.mjs` 改，运行 `npm run build:water` 生成 `assets/water-scene.js`，再复制过来。

复制后在本文件更新来源提交号。
