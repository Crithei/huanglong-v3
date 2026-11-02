# 彩池实验室：从 v1 原样搬来的两个文件

来源：v1 仓库 Crithei/huanglong-poi-route-prototype，本地提交 `28797c5`（彩池实验室为 2026-10-08 版）。复制于 2026-11-02，内容未改动。

| 文件 | v1 原路径 | 作用 | 全局名 |
| --- | --- | --- | --- |
| `pool-lab-state.js` | `pool-lab-state.js` | 定性模型：四池水量与溶解物收支、溢流、沉积、三类发现、文字解释、存档校验 | `window.HuanglongPoolModel` |
| `pool-lab-scene.js` | `pool-lab-scene.js` | Canvas 池群画面（720×700）与 SVG 剖面 | `window.HuanglongPoolScene` |

v3 的界面在 `src/features/lab.js`，只调用这两个文件公开的函数。模型在 `state.js` 读档时就要用，所以两个文件都在页面启动时加载（共约 17 KB）。

要改模型或画面：在 v1 改好并跑 v1 的测试（`npm test`），再复制过来，并在这里更新来源提交号。
