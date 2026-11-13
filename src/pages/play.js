/* 互动（底栏第三页）：一滴水的旅程（内嵌播放器）→ 彩池实验室（内嵌）→ 山水护照 → 徽章与贴纸 → 黄龙生灵。
   两个科普互动直接在页面里玩，不再进二级页面；打卡得的印章、徽章接在下面，由本机状态即时生成。 */
(() => {
  'use strict';
  const { $, esc, icon, S, idx, data: D } = HL;
  const ST = D.stations, SP = D.badges.species || [];

  /* 页面骨架只建一次：一滴水播放器和实验室装进去以后一直留着（里面有三维场景和画布），
     之后每次 render 只刷新标题旁的进度和下面的收集区。 */
  function frame() {
    $('#p-play').innerHTML = `
      <header class="page-head"><h1>边走边玩</h1><p>跟着一滴水，看彩池怎样长出来</p></header>

      <section class="sec play-sec" aria-labelledby="h-water">
        <div class="sec-h"><h2 id="h-water">一滴水的旅程</h2><span class="aside" id="play-water-count"></span></div>
        <div class="water-view is-inline" id="water-view"></div>
      </section>

      <section class="sec play-sec" aria-labelledby="h-lab">
        <div class="sec-h"><h2 id="h-lab">彩池实验室</h2><span class="aside" id="play-lab-count"></span></div>
        <div class="lab-view is-inline" id="lab-view" aria-label="彩池演化实验室"></div>
      </section>

      <section class="sec play-sec" aria-labelledby="h-sound">
        <div class="sec-h"><h2 id="h-sound">听见黄龙</h2><span class="aside" id="play-sound-count"></span></div>
        <div class="hb-switch" role="tablist" aria-label="选一本手册">
          <button type="button" role="tab" data-act="sound-which" data-v="guide"><b>栈道手册</b><small>认识声纹栈道和五种鸟</small></button>
          <button type="button" role="tab" data-act="sound-which" data-v="collect"><b>声景手册</b><small>沿途录下水、风、鸟和安静</small></button>
        </div>
        <div id="sound-book"></div>
        <div class="sound-scan" id="sound-scan"></div>
        <p class="sound-credit" id="sound-credit"></p>
      </section>

      <div id="play-collect"></div>`;
    HL.waterMount(); HL.labMount();
  }

  function render() {
    if (!$('#water-view')) frame();
    const badges = HL.badgeStatus();
    $('#play-water-count').textContent = `${HL.waterDone()} / 4 章`;
    $('#play-lab-count').textContent = S.lab.stickerAt ? '已收下贴纸' : `发现 ${S.lab.found.length} / 3`;
    HL.waterRefresh(); HL.labRefresh(); HL.soundRender();
    $('#play-collect').innerHTML = `
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
      </section>

      <section class="sec" aria-labelledby="h-species">
        <div class="sec-h"><h2 id="h-species">黄龙生灵</h2><span class="aside">点亮 ${S.seen.length} / ${SP.length}</span></div>
        <p class="sec-note">${esc(D.badges.speciesRule)}</p>
        <div class="badges species">${SP.map(sp => {
          const st = HL.speciesState(sp), where = sp.stations.map(id => idx.station[id].name).join('或');
          const sub = st === 'got' ? '已点亮' : st === 'near' ? `找线索：${sp.clue.label}` : `到${where}打卡`;
          return `<button class="badge is-${st}${st === 'got' ? ' is-got' : ''}" type="button" data-act="species" data-id="${sp.id}" aria-label="${esc(sp.name)}，${esc(sub)}">
            ${HL.badge3d.mini(sp.img, st, HL.speciesMetal(sp))}<b>${esc(sp.name)}</b><span>${esc(sub)}</span></button>`;
        }).join('')}</div>
      </section>
      <p class="note" style="margin:16px 20px 0">打卡和线索都是手动记录，不核验位置；徽章只作纪念，不能兑换实物。</p>`;
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

  /* 切进来时刷新并让播放器按可见性开始；切走时暂停两个互动 */
  HL.pages.play = { render, onShow: () => { render(); HL.waterShown(); } };
  const setPage = HL.setPage;
  HL.setPage = p => { setPage(p); if (p !== 'play') { HL.waterShown(); HL.labPause(); } };
})();
