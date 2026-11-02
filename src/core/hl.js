/* 黄龙景区综合服务系统 · 全局命名空间与公共工具
   所有脚本都是普通 <script>（不是 ES 模块），这样双击 index.html 也能运行。
   每个文件只往 window.HL 上挂东西，不再定义新的全局变量。 */
(() => {
  'use strict';

  const HL = window.HL = {
    data: {},     // src/data/*.js 填入的原始内容
    pages: {},    // 页面模块：HL.pages.home = { render() }
    actions: {},  // data-act 名称 → 处理函数，由 HL.act() 登记
    config: {},   // 本机配置（地图 Key 等），由 src/config.local.js 填入，见 src/config.example.js
  };

  HL.$ = (s, r = document) => r.querySelector(s);
  HL.$$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* 所有拼进 HTML 的文字都要先经过 esc()。 */
  HL.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* 图标来自 index.html 顶部的 SVG sprite，名称写 #i- 后面的部分。 */
  HL.icon = (n, cls = 'i') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;

  /* 卡片副标题在数据里用「·」分隔，界面上显示成顿号。 */
  HL.tidy = s => String(s).replace(/\s*·\s*/g, '、');

  /* 卡片正文：按行分段，「标签：内容」形式的行显示成键值。 */
  HL.paras = text => String(text).split('\n').filter(Boolean).map(l => {
    const m = l.match(/^([^：]{2,6})：(.+)$/);
    return m ? `<p class="kv"><b>${HL.esc(m[1])}</b>　${HL.esc(m[2])}</p>` : `<p>${HL.esc(l)}</p>`;
  }).join('');

  /* 只放行完整的 http(s) 网址；其他（javascript:、相对路径等）一律当作未填写。 */
  HL.safeUrl = u => {
    try {
      const x = new URL(String(u || '').trim());
      return x.protocol === 'http:' || x.protocol === 'https:' ? x.href : '';
    } catch (e) { return ''; }
  };

  /* 登记点击动作：元素写 data-act="名称"，点击时调用 fn(元素)。
     名称全局唯一，重名会在控制台报警，避免两个人的模块互相覆盖。 */
  HL.act = (name, fn) => {
    if (HL.actions[name]) console.warn(`[HL] 动作「${name}」被重复登记，后者覆盖前者`);
    HL.actions[name] = fn;
  };
})();
