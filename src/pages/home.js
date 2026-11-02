/* 首页：主视觉 → 快捷入口 → 沿途色带 → 精选景观 → 游玩灵感 → 文创商店。
   文案和精选景点都在 src/data/（meta.js、cards.js），这里只管排版。 */
(() => {
  'use strict';
  const { $, esc, icon, idx, data: D } = HL;
  const ST = D.stations, M = D.meta;

  function render() {
    const hero = M.hero, heroSt = idx.station[hero.station];
    const first = ST[0], last = ST[ST.length - 1];
    $('#p-home').innerHTML = `
      <header class="hero">
        <img src="${esc(heroSt.photo.src)}" alt="${esc(hero.alt)}">
        <p class="hero-credit">${esc(hero.credit)}</p>
        <div class="hero-title"><h1>${esc(hero.title)}</h1><span>${esc(hero.tagline)}</span></div>
        <div class="hero-body">
          <p>${esc(hero.lead)}</p>
          <small>沿途 ${ST.length} 处停留，终点${esc(last.name)}海拔${esc(M.finaleAltitude)}</small>
          <div class="hero-actions">
            <button class="btn btn-light" type="button" data-act="go-tour" data-panel="station">${icon('map')}开始游览</button>
            <button class="btn btn-glass" type="button" data-act="go-tour" data-panel="route">看看路线</button>
          </div>
        </div>
        ${HL.rimSvg()}
      </header>

      <nav class="quick" aria-label="快捷入口">
        ${D.cards.quick.map(q => `<button type="button" data-act="tab" data-page="${q.go}">${icon(q.icon)}<b>${esc(q.title)}</b><span>${esc(q.subtitle)}</span></button>`).join('')}
      </nav>

      <section class="sec" aria-labelledby="h-strata">
        <div class="sec-h"><h2 id="h-strata">一条沟，${ST.length} 处停留</h2><span class="aside">色块宽度是建议停留时间</span></div>
        <div class="strata">${HL.strata(true)}</div>
        <div class="strata-ends"><span><b>${esc(first.name)}</b> ${esc(first.area)}</span><span>${esc(last.name)} <b>${esc(M.finaleAltitude)}</b></span></div>
      </section>

      <section class="sec" aria-labelledby="h-spots">
        <div class="sec-h"><h2 id="h-spots">精选景观</h2><button class="link-btn" type="button" data-act="go-tour" data-panel="route">全部 ${ST.length} 处</button></div>
        <div class="scroller">
          ${M.featured.map(id => idx.station[id]).map(s => `
            <button class="spot" type="button" data-act="station" data-id="${s.id}">
              ${HL.media(s)}
              <span class="tag">${s.photo ? esc(s.category) : '示意图'}</span>
              <b>${esc(s.name)}</b><span>${esc(s.tagline)}</span>
            </button>`).join('')}
        </div>
      </section>

      <section class="sec" aria-labelledby="h-inspire">
        <h2 class="sr" id="h-inspire">游玩灵感</h2>
        <button class="inspire" type="button" data-act="tab" data-page="${D.cards.inspire.go}">
          <div><b>${esc(D.cards.inspire.title)}</b><span>${esc(D.cards.inspire.subtitle)}</span><em>${esc(D.cards.inspire.cta)}</em></div>
          ${HL.dropArt()}
        </button>
      </section>

      <section class="sec" aria-labelledby="h-shop">
        <div class="sec-h"><h2 id="h-shop">文创商店</h2><span class="aside">商品图为示意</span></div>
        <div class="shop">
          ${D.cards.products.map(p => `
            <button class="product" type="button" data-act="product" data-id="${p.id}">
              <div class="media">${HL.productArt(p.id)}</div>
              <b>${esc(p.title)}</b><span>${esc(p.subtitle)}</span>
            </button>`).join('')}
        </div>
      </section>`;
  }

  HL.pages.home = { render };
})();
