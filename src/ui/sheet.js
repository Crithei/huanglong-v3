/* 底部弹层（详情、导游对话共用）与轻提示。
   打开弹层时页面主体设为 inert，焦点留在弹层内；关闭后焦点回到原来的按钮。 */
(() => {
  'use strict';
  const { $, esc, icon } = HL;

  let lastFocus = null;
  const shell = () => [$('.pages'), $('.tabbar'), $('.fab')];

  /* openSheet({ title, body, foot, cls, tag })：body / foot / tag 为 HTML 字符串，title 为纯文字。 */
  HL.openSheet = ({ title, body, foot = '', cls = '', tag = '' }) => {
    const L = $('#layer');
    if (L.hidden) lastFocus = document.activeElement;
    L.innerHTML = `<div class="scrim" data-act="close"></div>
      <div class="sheet ${cls}" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div class="sheet-top"><h2 id="sheet-title">${esc(title)}</h2>${tag}<button class="icon-btn" type="button" data-act="close" aria-label="关闭">${icon('x')}</button></div>
        <div class="sheet-body">${body}</div>${foot}
      </div>`;
    L.hidden = false;
    shell().forEach(e => { e.inert = true; });
    $('.sheet-top .icon-btn', L).focus();
  };

  HL.closeSheet = () => {
    const L = $('#layer');
    if (L.hidden) return;
    L.hidden = true; L.innerHTML = '';
    shell().forEach(e => { e.inert = false; });
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  };

  HL.act('close', () => HL.closeSheet());

  /* toast(文字, { label, fn })：第二个参数可选，用于「撤销」之类的操作按钮。 */
  let toastTimer;
  const hideToast = () => { $('#toast').hidden = true; };
  HL.toast = (msg, action) => {
    const t = $('#toast');
    t.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ''}`;
    t.hidden = false;
    if (action) $('button', t).onclick = () => { hideToast(); action.fn(); };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, action ? 5000 : 2600);
  };
})();
