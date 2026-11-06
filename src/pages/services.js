/* 服务（底栏第四页）：顶部醒目入口（featured: true 的卡片）+ 三组服务列表 + 我的记录。
   组和卡片都来自 src/data/cards.js 的 services；新增入口只改数据，不用改这里。
   我的记录：路线进度、想去的景点、想要的文创、旅行记录（cards.js 的 mine）、清空记录，由本机状态即时生成。 */
(() => {
  'use strict';
  const { $, esc, icon, tidy, S, idx, data: D } = HL;

  function render() {
    const groups = D.cards.services;
    const act = HL.active();
    const got = act.filter(s => S.visited.includes(s.id)).length;
    const pct = act.length ? got / act.length : 0;
    const C = 2 * Math.PI * 28;
    const next = act.find(s => !S.visited.includes(s.id));

    const featured = groups.flatMap(g => g.items).filter(c => c.featured);
    $('#p-services').innerHTML = `
      <header class="page-head"><h1>景区服务</h1><p>需要的服务，放在手边</p></header>
      ${featured.map(c => `<div style="padding:0 20px">
        <button class="alert-band" type="button" data-act="card" data-id="${c.id}">
          <span class="ico">${icon(c.icon)}</span>
          <span><b>${esc(c.title)}</b><span>${esc(c.lead || tidy(c.subtitle))}</span></span>
          ${icon('chev')}
        </button>
      </div>`).join('')}
      ${groups.map(g => `
        <section class="sec" aria-label="${esc(g.title)}">
          <div class="sec-h"><h2>${esc(g.title)}</h2></div>
          <ul class="rows">
            ${g.items.filter(c => !c.featured).map(c => HL.row({ act: 'card', id: c.id, icon: c.icon, title: c.title, sub: tidy(c.subtitle) })).join('')}
          </ul>
        </section>`).join('')}
      <p class="slot" style="margin:18px 20px 0">这一页留给组员作品继续加入：科普视频、专业演示、小游戏和数字人作品，按上面三组归类。</p>

      <header class="mine-head records-head" id="records"><div><h2>我的记录</h2><p>路线进度和收藏，存在这台手机上，不上传</p></div>
        <svg class="progress-ring" viewBox="0 0 68 68" role="img" aria-label="路线打卡 ${got} / ${act.length}">
          <circle cx="34" cy="34" r="28" stroke="rgba(23,51,45,.1)"/>
          <circle cx="34" cy="34" r="28" stroke="var(--gold)" stroke-linecap="round" stroke-dasharray="${(C * pct).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 34 34)"/>
          <text x="34" y="40" text-anchor="middle">${got}/${act.length}</text>
        </svg></header>

      <section class="sec" aria-labelledby="h-plan">
        <div class="sec-h"><h2 id="h-plan">本次路线</h2></div>
        <div class="plan-card">
          <div class="t"><b>${act.length} 站，停留约 ${HL.fmtMin(HL.sumMin(act))}</b>
            <span>${next ? `下一站：${esc(next.name)}` : act.length ? '路线里的站都打卡了' : '还没有选择站点'}</span>
            <div class="mini-strata">${HL.strata(false)}</div></div>
          <button class="btn btn-primary" type="button" data-act="${next ? 'select' : 'go-tour'}" data-id="${next ? next.id : ''}" data-panel="route">${next ? '继续游览' : '查看路线'}</button>
        </div>
      </section>

      <section class="sec" aria-labelledby="h-wish">
        <div class="sec-h"><h2 id="h-wish">想去的景点</h2></div>
        ${S.wish.length ? `<ul class="rows">${S.wish.map(id => idx.station[id]).map(s => HL.row({
          act: 'station', id: s.id, icon: 'pool', icoStyle: `background:${s.tint};color:var(--ink)`, title: s.name, sub: s.tagline })).join('')}</ul>`
          : `<div class="empty">在景点详情里点心形，就会收进这里。<br><button class="btn btn-ghost" type="button" data-act="tab" data-page="home">去看精选景观</button></div>`}
      </section>

      <section class="sec" aria-labelledby="h-want">
        <div class="sec-h"><h2 id="h-want">想要的文创</h2></div>
        ${S.want.length ? `<ul class="rows">${S.want.map(id => idx.product[id]).map(p => HL.row({
          act: 'product', id: p.id, ico: HL.productArt(p.id), icoStyle: 'overflow:hidden;padding:0', title: p.title, sub: p.subtitle })).join('')}</ul>`
          : `<div class="empty">在文创商店里点「想要」，会记在这里。</div>`}
      </section>

      <section class="sec" aria-labelledby="h-more">
        <div class="sec-h"><h2 id="h-more">旅行记录</h2></div>
        <ul class="rows">
          ${D.cards.mine.map(c => HL.row({ act: 'card', id: c.id, icon: c.icon, title: c.title, sub: tidy(c.subtitle) })).join('')}
        </ul>
      </section>

      <button class="danger-link" type="button" data-act="reset">清空本机记录</button>`;
  }

  HL.pages.services = { render };

  HL.act('reset', () => {
    const before = HL.store.snapshot();
    HL.store.reset({ page: 'services' }); HL.renderAll(); HL.setPage('services');
    HL.toast('已清空本机记录', { label: '撤销', fn: () => { HL.store.restore(before); HL.setPage('services'); } });
  });

})();
