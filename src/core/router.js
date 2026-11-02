/* 页面切换与整体重绘。
   每个页面模块登记 HL.pages.<id> = { render() }，可选 onShow()（切到该页时调用）。 */
(() => {
  'use strict';
  const { $, $$, S } = HL;

  HL.renderAll = () => {
    HL.PAGES.forEach(id => { if (HL.pages[id]) HL.pages[id].render(); });
  };

  HL.setPage = p => {
    S.page = p; HL.store.save();
    $('#app').dataset.page = p;
    HL.PAGES.forEach(id => { $('#p-' + id).hidden = id !== p; });
    $$('.tabbar button').forEach(b => b.setAttribute('aria-current', b.dataset.page === p ? 'page' : 'false'));
    const page = HL.pages[p];
    if (page && page.onShow) page.onShow();
  };

  HL.act('tab', el => { HL.closeSheet(); HL.setPage(el.dataset.page); });
})();
