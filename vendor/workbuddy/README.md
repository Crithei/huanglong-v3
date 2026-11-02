# WorkBuddy 云端 SDK

`workbuddy-cloud-sdk.global.js`：原样来自「黄龙数字人网页端交接包 20261102」的 `vendor/` 目录（约 71 KB），全局名 `window.WorkBuddyCloud`。数字人第一次提问时由 `src/features/guide-cloud.js` 加载。

只用到两个接口：`cloud.database.rpc('kb_search', …)`（知识库检索）和 `cloud.llm.chat.completions.create({ stream: true, … })`（流式生成）。配置在 `src/data/guide.js`。

云端按来源域名校验：本机预览 `http://localhost:4191` 已实测可用；正式域名（如 `huanglong.nyxal.site`）要请云端应用的所有者加进白名单，否则会自动退回内置回答。
