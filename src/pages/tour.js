/* 游览页下半部分：「本站攻略 / 沿途设施 / 我的路线」三个面板，以及跳转到游览页的公共入口。
   地图在 tour-map.js。面板切换时地图跟着切换显示景点或设施。 */
(() => {
  'use strict';
  const { $, esc, icon, S, idx, data: D } = HL;
  const ST = D.stations, FAC = D.facilities;

  const PANELS = [['station', '本站攻略'], ['fac', '沿途设施'], ['route', '我的路线']];

  function renderPanelTabs() {
    $('#panel-tabs').innerHTML = `<div class="seg" role="tablist" aria-label="游览内容">${PANELS.map(([k, t]) =>
      `<button type="button" role="tab" id="tab-${k}" aria-controls="panel-body" aria-selected="${S.panel === k}" tabindex="${S.panel === k ? 0 : -1}" data-act="panel" data-panel="${k}">${t}</button>`).join('')}</div>`;
    $('#panel-body').setAttribute('aria-labelledby', 'tab-' + S.panel);
  }

  function stationPanel() {
    const i = HL.indexOf(S.current), s = ST[i];
    const visited = S.visited.includes(s.id), wished = S.wish.includes(s.id), off = S.off.includes(s.id);
    return `
      <div class="station-head">
        <div class="t"><small>第 ${i + 1} 站，${esc(s.area)}</small><h2>${esc(s.name)}</h2><p>${esc(s.tagline)}</p></div>
        <div class="stepper">
          <button class="icon-btn" type="button" data-act="step" data-dir="-1" aria-label="上一站" ${i === 0 ? 'disabled' : ''}>${icon('prev')}</button>
          <button class="icon-btn" type="button" data-act="step" data-dir="1" aria-label="下一站" ${i === ST.length - 1 ? 'disabled' : ''}>${icon('chev')}</button>
        </div>
      </div>
      <div class="facts">
        <div><b>${s.minutes} 分钟</b>建议停留</div>
        <div><b>${HL.effortDots(s.effort)}</b>体力</div>
        <div><b>${esc(s.category)}</b>类型</div>
      </div>
      ${off ? `<div class="empty" style="margin-top:14px">这一站不在你的路线里。<br><button class="btn btn-ghost" type="button" data-act="toggle-stop" data-id="${s.id}">加回路线</button></div>` : ''}
      <div class="guide-block"><h3>看什么</h3><p>${esc(s.viewing)}</p></div>
      <div class="guide-block"><h3>怎么拍</h3><p>${esc(s.photoTip)}</p></div>
      <div class="guide-block"><h3>留意</h3><p>${esc(s.tip)}</p></div>
      ${HL.media(s, 'station-photo')}
      <p class="credit">${s.photo ? esc(s.photo.credit) : '示意图，实景照片待替换'}</p>
      <div class="station-actions">
        <button class="btn ${visited ? 'is-on' : 'btn-primary'}" type="button" data-act="visit" data-id="${s.id}" aria-pressed="${visited}">${icon(visited ? 'check' : 'stamp')}${visited ? '已收下印章' : '到站打卡'}</button>
        <button class="icon-btn" type="button" data-act="wish" data-id="${s.id}" aria-pressed="${wished}" aria-label="收藏到想去的景点">${icon('heart')}</button>
        <button class="icon-btn" type="button" data-act="ask" data-q="这里看什么" aria-label="问问导游这一站">${icon('chat')}</button>
      </div>`;
  }

  function facPanel() {
    const s = idx.station[S.current];
    const list = FAC.filter(f => S.fac === 'all' || f.type === S.fac)
      .map(f => ({ f, d: HL.dist(f.loc, s.loc) })).sort((a, b) => a.d - b.d).slice(0, S.fac === 'all' ? 12 : 30);
    return `
      <div class="chips" role="group" aria-label="设施类型">
        ${HL.FAC_TYPES.map(([k, t]) => `<button class="chip" type="button" data-act="fac-filter" data-id="${k}" aria-pressed="${S.fac === k}">${t}</button>`).join('')}
      </div>
      <p class="note" style="margin:12px 0 2px">离<b style="color:var(--ink)">${esc(s.name)}</b>由近到远</p>
      <ul class="rows">
        ${list.map(({ f, d }) => HL.row({ act: 'fac', id: f.id, icon: HL.FAC_ICON[f.type], icoCls: `fac fac-${f.type}`,
          title: f.name, sub: HL.FAC_LABEL[f.type], end: `直线${HL.fmtDist(d)}`, chev: false, focus: f.id === S.facFocus })).join('')}
      </ul>
      <p class="note">${esc(D.meta.source.facilities)}。距离为直线估算，实际走法以栈道和现场指引为准。</p>`;
  }

  function routePanel() {
    const act = HL.active();
    return `
      <div class="route-sum"><b>${act.length} 站，停留约 ${HL.fmtMin(HL.sumMin(act))}</b><span>不含步行时间</span></div>
      <div class="strata" style="height:22px;margin:10px 0 8px">${HL.strata(true)}</div>
      <ul class="rows">
        ${ST.map((s, i) => {
          const on = !S.off.includes(s.id);
          return `<li class="stop${on ? '' : ' is-off'}">
            <span class="no">${i + 1}</span><span class="sw" style="--c:${s.tint}"></span>
            <button class="name" type="button" data-act="select" data-id="${s.id}">
              <b>${esc(s.name)}${S.visited.includes(s.id) ? '<span class="visited-tag">已打卡</span>' : ''}</b>
              <span>${s.minutes} 分钟，${esc(s.area)}</span></button>
            <button class="toggle" type="button" role="checkbox" aria-checked="${on}" data-act="toggle-stop" data-id="${s.id}" aria-label="把${esc(s.name)}${on ? '移出' : '加入'}路线"><span>${on ? icon('check') : ''}</span></button>
          </li>`;
        }).join('')}
      </ul>
      <div class="station-actions">
        <button class="btn btn-ghost" type="button" data-act="ask" data-q="走不动了，少走一点">${icon('chat')}请导游帮我减站</button>
        ${S.off.length ? `<button class="btn btn-ghost" type="button" data-act="restore-route">恢复全部</button>` : ''}
      </div>
      <p class="note">停留时间来自${esc(D.meta.source.pois)}，只作安排参考。</p>`;
  }

  const PANEL_RENDER = { station: stationPanel, fac: facPanel, route: routePanel };

  /* 地图需要容器尺寸，所以只在游览页可见时绘制。 */
  function render() {
    if (S.page !== 'tour') return;
    HL.renderMap(); renderPanelTabs();
    $('#panel-body').innerHTML = PANEL_RENDER[S.panel]();
  }

  HL.pages.tour = { render, onShow: render };

  /* ---------- 供其他页面调用的入口 ---------- */
  HL.goTour = panel => {
    S.panel = panel || 'station';
    if (S.panel !== 'fac') S.facFocus = null;
    HL.store.save(); HL.setPage('tour');
  };

  HL.selectStation = (id, toPanel = 'station') => {
    S.current = id; S.panel = toPanel; S.facFocus = null; HL.store.save();
    if (S.page !== 'tour') HL.setPage('tour'); else render();
    $('#panel-body').scrollTop = 0;
    HL.ping(idx.station[id].loc);
  };

  HL.focusFacility = id => {
    const f = idx.facility[id];
    S.panel = 'fac'; S.facFocus = id;
    if (S.fac !== 'all' && S.fac !== f.type) S.fac = f.type;
    HL.store.save();
    if (S.page !== 'tour') HL.setPage('tour'); else render();
    const row = $('#panel-body .row.is-focus');
    if (row) row.scrollIntoView({ block: 'nearest' });
    HL.ping(f.loc);
  };

  /* ---------- 动作 ---------- */
  HL.act('go-tour', el => { HL.closeSheet(); HL.goTour(el.dataset.panel); });
  HL.act('select', el => { HL.closeSheet(); HL.selectStation(el.dataset.id); });
  HL.act('step', el => { const s = ST[HL.indexOf(S.current) + Number(el.dataset.dir)]; if (s) HL.selectStation(s.id); });
  HL.act('panel', el => {
    S.panel = el.dataset.panel; HL.store.save(); render();
    $('#panel-body').scrollTop = 0; $('#tab-' + S.panel).focus();
  });
  HL.act('fac-filter', el => { S.fac = el.dataset.id; S.facFocus = null; HL.store.save(); render(); });
  HL.act('fac', el => HL.focusFacility(el.dataset.id));

  HL.act('toggle-stop', el => {
    const id = el.dataset.id, before = HL.store.snapshot(), on = S.off.includes(id);
    S.off = on ? S.off.filter(x => x !== id) : [...S.off, id];
    HL.store.save(); HL.renderAll();
    HL.toast(`${on ? '已加回' : '已移出'}「${idx.station[id].name}」`, { label: '撤销', fn: () => HL.store.restore(before) });
  });
  HL.act('restore-route', () => {
    const before = HL.store.snapshot();
    S.off = []; HL.store.save(); HL.renderAll();
    HL.toast('已恢复全部站点', { label: '撤销', fn: () => HL.store.restore(before) });
  });
  HL.act('visit', el => {
    const id = el.dataset.id, before = HL.store.snapshot(), had = S.visited.includes(id);
    S.visited = had ? S.visited.filter(x => x !== id) : [...S.visited, id];
    HL.store.save(); HL.renderAll();
    if (had) HL.toast(`已撤回「${idx.station[id].name}」的印章`, { label: '撤销', fn: () => HL.store.restore(before) });
    else HL.toast(`收下「${idx.station[id].name}」印章`, { label: '去护照', fn: () => HL.setPage('mine') });
  });

  /* 面板分段：左右方向键切换。 */
  document.addEventListener('keydown', e => {
    const tab = e.target.closest && e.target.closest('[role="tab"]');
    if (!tab || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    const i = PANELS.findIndex(p => p[0] === S.panel) + (e.key === 'ArrowRight' ? 1 : -1);
    HL.actions.panel({ dataset: { panel: PANELS[(i + PANELS.length) % PANELS.length][0] } });
  });
})();
