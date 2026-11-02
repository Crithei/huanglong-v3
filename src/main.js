/* 启动：统一的点击 / 键盘分发，然后画出全部页面。必须最后加载。 */
(() => {
  'use strict';

  /* 带 data-act 的元素被点击时，调用 HL.act() 登记的同名函数。 */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const fn = HL.actions[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el); }
    else console.warn(`[HL] 没有登记的动作「${el.dataset.act}」`);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { HL.closeSheet(); return; }
    /* 地图上的 SVG 点位用 role="button"，补上回车 / 空格触发。 */
    const g = e.target.closest && e.target.closest('svg [role="button"]');
    if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  });

  HL.renderAll();
  HL.setPage(HL.S.page);
})();
