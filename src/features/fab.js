/* 数字人入口（index.html 里的 .fab）：按住拖到哪里都行，松手贴到最近的左边或右边；位置记在本机。
   轻点照常打开导游对话；拖动过就不算点击。名字签显示当前导游（换导游、关掉弹层后刷新）。 */
(() => {
  'use strict';
  const { $, S } = HL;
  const fab = $('.fab');
  if (!fab) return;
  const app = fab.closest('.app');
  const KEY = 'huanglong.v3.fab';
  const GAP = 12;

  /* ---------- 名字签 ---------- */
  HL.fabRefresh = () => {
    const G = HL.data.guide, p = G && G.personas[S.persona], el = fab.querySelector('.fab-who-name');
    if (el) el.textContent = p ? `${p.name} · 在线` : '在线';
    fab.setAttribute('aria-label', `问问数字人导游${p ? p.name : ''}（可拖动）`);
  };
  const close = HL.closeSheet;
  HL.closeSheet = (...a) => { const r = close(...a); HL.fabRefresh(); return r; };

  /* ---------- 位置：top 相对整个 app，side 是 left / right ---------- */
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  const write = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* 存不了就只在这次有效 */ } };
  const range = () => {
    const tab = $('.tabbar'), h = app.clientHeight - (tab ? tab.offsetHeight : 0);
    return { min: GAP + 8, max: Math.max(GAP + 8, h - fab.offsetHeight - GAP) };
  };
  function place(pos) {
    if (!pos) return;
    const { min, max } = range(), top = Math.min(max, Math.max(min, pos.top * (app.clientHeight || 1)));
    fab.classList.add('is-placed');
    fab.classList.toggle('is-left', pos.side === 'left');
    fab.style.top = top + 'px';
    fab.style.right = 'auto';
    fab.style.left = (pos.side === 'left' ? GAP : app.clientWidth - fab.offsetWidth - GAP) + 'px'; // 一律用 left，贴边时才有过渡
  }

  /* ---------- 拖动 ---------- */
  let drag = null, moved = false;
  fab.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const r = fab.getBoundingClientRect(), a = app.getBoundingClientRect();
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, a, w: r.width, h: r.height };
    moved = false;
  });
  fab.addEventListener('pointermove', e => {
    const d = drag;
    if (!d || d.id !== e.pointerId) return;
    if (!moved) {
      if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 7) return;
      moved = true;
      fab.classList.add('is-drag', 'is-placed');
      try { fab.setPointerCapture(e.pointerId); } catch (err) { /* 捕获失败也能拖 */ }
    }
    const { min, max } = range();
    const x = Math.min(d.a.width - d.w - 4, Math.max(4, e.clientX - d.a.left - d.dx));
    const y = Math.min(max, Math.max(min, e.clientY - d.a.top - d.dy));
    fab.style.left = x + 'px'; fab.style.right = 'auto'; fab.style.top = y + 'px';
  });
  const end = e => {
    const d = drag;
    if (!d || d.id !== e.pointerId) return;
    drag = null;
    if (!moved) return;
    fab.classList.remove('is-drag');
    const r = fab.getBoundingClientRect();
    const side = r.left + r.width / 2 < d.a.left + d.a.width / 2 ? 'left' : 'right';
    const pos = { side, top: (r.top - d.a.top) / d.a.height };
    place(pos);
    write(pos);
  };
  fab.addEventListener('pointerup', end);
  fab.addEventListener('pointercancel', end);
  /* 拖过就吞掉这次点击，不打开对话（捕获阶段，赶在 main.js 的统一分发之前） */
  fab.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  /* 键盘也能挪：Alt + 方向键换边、上下移 */
  fab.addEventListener('keydown', e => {
    if (!e.altKey || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const cur = read() || { side: 'right', top: (fab.offsetTop) / app.clientHeight };
    if (e.key === 'ArrowLeft') cur.side = 'left';
    if (e.key === 'ArrowRight') cur.side = 'right';
    if (e.key === 'ArrowUp') cur.top -= .05;
    if (e.key === 'ArrowDown') cur.top += .05;
    place(cur); const { min, max } = range(); cur.top = Math.min(max, Math.max(min, cur.top * app.clientHeight)) / app.clientHeight; write(cur);
  });

  addEventListener('resize', () => place(read()));
  /* 换页时入口宽度会变（游览页只留小像），贴右边的要重新算 left */
  new MutationObserver(() => place(read())).observe(app, { attributes: true, attributeFilter: ['data-page'] });
  place(read());
  HL.fabRefresh();
})();
