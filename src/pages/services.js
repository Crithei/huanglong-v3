/* 服务页：顶部醒目入口（featured: true 的卡片）+ 三组服务列表。
   组和卡片都来自 src/data/cards.js 的 services；新增入口只改数据，不用改这里。 */
(() => {
  'use strict';
  const { $, esc, icon, tidy, data: D } = HL;

  function render() {
    const groups = D.cards.services;
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
      <p class="slot" style="margin:18px 20px 0">这一页留给组员作品继续加入：科普视频、专业演示、小游戏和数字人作品，按上面三组归类。</p>`;
  }

  HL.pages.services = { render };
})();
