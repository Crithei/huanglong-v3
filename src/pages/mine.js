/* 我的：进度环 → 本次路线 → 山水护照 → 徽章与贴纸（含一滴水入口） → 想去的景点 → 想要的文创 → 旅行记录。
   除「旅行记录」来自 cards.js 的 mine，其余都由本机状态即时生成。 */
(() => {
  'use strict';
  const { $, esc, icon, tidy, S, idx, data: D } = HL;
  const ST = D.stations;

  function render() {
    const act = HL.active();
    const got = act.filter(s => S.visited.includes(s.id)).length;
    const pct = act.length ? got / act.length : 0;
    const C = 2 * Math.PI * 28;
    const next = act.find(s => !S.visited.includes(s.id));
    const badges = HL.badgeStatus();
    $('#p-mine').innerHTML = `
      <header class="mine-head">
        <div><h1>我的黄龙</h1><p>把旅程，留成自己的故事</p></div>
        <svg class="progress-ring" viewBox="0 0 68 68" role="img" aria-label="路线打卡 ${got} / ${act.length}">
          <circle cx="34" cy="34" r="28" stroke="rgba(23,51,45,.1)"/>
          <circle cx="34" cy="34" r="28" stroke="var(--gold)" stroke-linecap="round" stroke-dasharray="${(C * pct).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 34 34)"/>
          <text x="34" y="40" text-anchor="middle">${got}/${act.length}</text>
        </svg>
      </header>

      <section class="sec" aria-labelledby="h-plan">
        <div class="sec-h"><h2 id="h-plan">本次路线</h2></div>
        <div class="plan-card">
          <div class="t"><b>${act.length} 站，停留约 ${HL.fmtMin(HL.sumMin(act))}</b>
            <span>${next ? `下一站：${esc(next.name)}` : act.length ? '路线里的站都打卡了' : '还没有选择站点'}</span>
            <div class="mini-strata">${HL.strata(false)}</div></div>
          <button class="btn btn-primary" type="button" data-act="${next ? 'select' : 'go-tour'}" data-id="${next ? next.id : ''}" data-panel="route">${next ? '继续游览' : '查看路线'}</button>
        </div>
      </section>

      <section class="sec" aria-labelledby="h-stamps">
        <div class="sec-h"><h2 id="h-stamps">山水护照</h2><span class="aside">收下 ${S.visited.length} / ${ST.length} 枚</span></div>
        <div class="stamps">
          ${ST.map(s => {
            const g = S.visited.includes(s.id);
            return `<button class="stamp${g ? ' is-got' : ''}" type="button" data-act="select" data-id="${s.id}" aria-label="${esc(s.name)}${g ? '，已收下印章' : '，未打卡'}">${HL.stampArt(s, g)}<span>${esc(s.name)}</span></button>`;
          }).join('')}
        </div>
      </section>

      <section class="sec" aria-labelledby="h-badges">
        <div class="sec-h"><h2 id="h-badges">徽章与贴纸</h2><span class="aside">收下 ${badges.filter(b => b.got).length} / ${badges.length}</span></div>
        <div class="badges">${badges.map(b => `
          <button class="badge${b.got ? ' is-got' : ''}" type="button" data-act="badge" data-id="${b.id}" aria-label="${esc(b.reward)}，${b.got ? '已获得' : esc(b.progress)}">
            <img src="${esc(b.img)}" alt="" loading="lazy" decoding="async"><b>${esc(b.reward)}</b><span>${b.got ? '已获得' : esc(b.progress)}</span></button>`).join('')}
        </div>
        <ul class="rows" style="margin-top:12px">${HL.row({ act: 'go-tour', id: '', icon: 'drop', title: '一滴水的旅程',
          sub: `${HL.waterDone()} / 4 章${S.water.badgeAt ? ' · 已收下「山水同行者」' : ' · 到关联景点打卡后解锁'}` }).replace('data-act="go-tour"', 'data-act="go-tour" data-panel="water"')}</ul>
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

  /* 徽章与贴纸是否获得（规则见 data/badges.js）：主题徽章按六枚主章计数，「细节发现者」还要一枚实验贴纸。
     visited 可传打卡前的记录，用来判断这次打卡新得了哪枚。 */
  HL.badgeStatus = (visited = S.visited) => {
    const B = D.badges, main = B.main.filter(id => visited.includes(id)).length;
    const stickers = B.stickers.map(s => ({ ...s, reward: s.title, got: s.id === 'pool' && !!(S.lab && S.lab.stickerAt),
      progress: s.id === 'pool' ? `实验发现 ${S.lab ? S.lab.found.length : 0} / 3` : '' }));
    const labs = stickers.filter(s => s.got).length;
    const themes = B.themes.map(t => ({ ...t, got: main >= t.need && labs >= t.labs,
      progress: `主章 ${Math.min(main, t.need)} / ${t.need}${t.labs ? ` · 实验贴纸 ${Math.min(labs, t.labs)} / ${t.labs}` : ''}` }));
    return [...themes, ...stickers];
  };

  HL.act('badge', el => {
    const b = HL.badgeStatus().find(x => x.id === el.dataset.id);
    HL.openSheet({
      title: b.reward,
      body: `<div class="sheet-media square badge-media"><img src="${esc(b.img)}" alt="${esc(b.reward)}"${b.got ? '' : ' class="is-locked"'}></div>
        <p class="lead">${b.got ? '已获得' : esc(b.progress)}</p><p>${esc(b.description)}</p>
        ${b.goals ? `<ul class="highlights">${b.goals.map(g => `<li>${S.lab.found.includes(g.id) ? '✓ ' : ''}${esc(g.label)}：${esc(g.hint)}</li>`).join('')}</ul>` : ''}
        <p class="note">打卡是手动记录，不核验位置；徽章只作纪念，不能兑换实物。</p>`,
      foot: b.id === 'pool' ? `<div class="sheet-foot"><button class="btn btn-primary" type="button" data-act="lab-open">${icon('pool')}打开彩池实验室</button></div>` : '',
    });
  });

  HL.pages.mine = { render };

  HL.act('reset', () => {
    const before = HL.store.snapshot();
    HL.store.reset({ page: 'mine' }); HL.renderAll(); HL.setPage('mine');
    HL.toast('已清空本机记录', { label: '撤销', fn: () => { HL.store.restore(before); HL.setPage('mine'); } });
  });
})();
