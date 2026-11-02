/* 本机配置示例。
   复制本文件为 src/config.local.js，填入自己的 Key 后刷新页面即可显示腾讯地图。
   config.local.js 已被 .gitignore 排除，不会进仓库；不要把 Key 写进其他文件。

   tmapKey：腾讯位置服务「JavaScript API GL」Key（https://lbs.qq.com/dev/console/key/manage）。
     建议单独申请一个只给网页用的 Key，并在控制台把「域名白名单」设为 127.0.0.1、localhost 和正式域名。
     这个 Key 会出现在浏览器里，任何访问者都能看到，所以只靠域名白名单保护；
     WebService Key（查路线、搜地点）不要放在这里，要放在服务端代理里。

   没有这个文件或 Key 为空时，游览页自动使用内置示意图，其他功能不受影响。 */
HL.config.tmapKey = '';
