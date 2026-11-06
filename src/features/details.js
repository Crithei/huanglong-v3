/* 详情弹层：景点、文创商品、内容卡片（服务入口、旅行记录等），以及收藏类操作。
   内容卡片的按钮完全由数据决定，见 openCard()。 */
(() => {
  'use strict';
  const { esc, icon, tidy, paras, S, idx } = HL;

  /* 卡片 go 字段可以填的内部去向。新增去向：在这里加一项，并在 tools/check.py 的 GO 里登记。 */
  const GO = {
    home: { label: '回到首页', icon: 'home', run: () => HL.setPage('home') },
    tour: { label: '进入游览', icon: 'map', run: () => HL.goTour('station') },
    services: { label: '查看服务', icon: 'grid', run: () => HL.setPage('services') },
    play: { label: '去互动页', icon: 'drop', run: () => HL.setPage('play') },
    records: { label: '看我的记录', icon: 'user', run: () => { HL.setPage('services'); const r = document.getElementById('records'); if (r) r.scrollIntoView({ block: 'start' }); } },
    facilities: { label: '在游览页查看', icon: 'map', run: () => HL.goTour('fac') },
    medical: { label: '查看最近的医疗点', icon: 'cross', run: () => HL.focusFacility(HL.nearest('medical', idx.station[S.current]).f.id) },
    guide: { label: '问问导游', icon: 'guide', run: () => HL.openGuide() },
    water: { label: '开始一滴水的旅程', icon: 'drop', run: () => HL.goTour('water') },
    lab: { label: '打开彩池实验室', icon: 'pool', run: () => HL.openLab() },
  };
  HL.GO = GO;

  HL.openStation = id => {
    const s = idx.station[id], wished = S.wish.includes(id);
    HL.openSheet({
      title: s.name,
      body: `${HL.media(s, 'sheet-media')}
        <p class="lead">${esc(s.tagline)}</p>
        <p>${esc(s.intro || s.summary)}</p>
        ${HL.factChips(s)}
        ${s.highlights.length ? `<ul class="highlights">${s.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
        <p class="kv"><b>看什么</b>　${esc(s.viewing)}</p>
        ${s.tradeoff ? `<p class="kv"><b>怎么取舍</b>　${esc(s.tradeoff)}</p>` : ''}
        <p class="kv"><b>建议停留</b>　${s.minutes} 分钟，${esc(s.area)}</p>
        ${HL.photoCredit(s)}
        ${HL.storyBlock(s)}`,
      foot: `<div class="sheet-foot">
        <button class="icon-btn" type="button" data-act="wish" data-id="${id}" aria-pressed="${wished}" aria-label="收藏到想去的景点">${icon('heart')}</button>
        <button class="btn btn-primary" type="button" data-act="select" data-id="${id}">${icon('map')}在游览中查看</button></div>`,
    });
  };

  /* 商品款式图：大图 + 一排缩略图，点缩略图换大图 */
  const variantsBlock = p => {
    const v = p.variants;
    return `<div class="sheet-media variant-main"><img id="variant-img" src="${esc(encodeURI(v[0].img))}" alt="${esc(p.title + ' · ' + v[0].label)}"></div>
      ${v.length > 1 ? `<div class="variants" role="group" aria-label="款式">${v.map((x, i) =>
        `<button type="button" data-act="product-variant" data-src="${esc(encodeURI(x.img))}" data-alt="${esc(p.title + ' · ' + x.label)}" aria-pressed="${i === 0}"><img src="${esc(encodeURI(x.img))}" alt="" loading="lazy"><span>${esc(x.label)}</span></button>`).join('')}</div>` : ''}
      <p class="note">商品图为设计效果图，实物以上架时为准。</p>`;
  };
  HL.act('product-variant', el => {
    const img = document.getElementById('variant-img');
    if (!img) return;
    img.src = el.dataset.src; img.alt = el.dataset.alt;
    el.parentNode.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === el)));
  });

  HL.openProduct = id => {
    const p = idx.product[id], on = S.want.includes(id), url = HL.safeUrl(p.url);
    HL.openSheet({
      title: p.title,
      body: `${p.variants && p.variants.length ? variantsBlock(p) : `<div class="sheet-media square">${HL.productArt(id)}</div>`}<p class="lead">${esc(p.subtitle)}</p>${paras(p.body)}`,
      foot: `<div class="sheet-foot">${url
        ? `<a class="btn btn-ghost" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(p.cta || '查看商品')}</a>`
        : p.go && GO[p.go] ? `<button class="btn btn-ghost" type="button" data-act="product-go" data-id="${id}">${icon(GO[p.go].icon)}${p.go === 'play' ? '看我点亮的生灵' : GO[p.go].label}</button>`
        : '<span class="hint">示意商品，购买入口待接入</span>'}
        <button class="btn ${on ? 'is-on' : 'btn-ghost'}" type="button" data-act="want" data-id="${id}" aria-pressed="${on}">${icon(on ? 'check' : 'heart')}${on ? '已在想要清单' : '想要'}</button></div>`,
    });
  };

  /* 内容卡片详情。按钮规则：
     1. 填了 url（必须是 http/https）→ 主按钮在新标签页打开作品，文字用 cta；
     2. 填了 go → 内部跳转按钮（有 url 时降为次按钮）；
     3. 都没填 → 显示卡片的 hint（没有则用默认文字），说明入口待接入。
     go 为 guide 且没有 url 时，直接打开导游对话。 */
  HL.openCard = id => {
    const c = idx.card[id], url = HL.safeUrl(c.url), go = GO[c.go];
    const hint = c.hint || '作品入口待接入，接入后从这里打开';
    if (c.go === 'guide' && !url) return HL.openGuide();
    const btns = [];
    if (go) {
      const label = url ? go.label : (c.cta || go.label);
      btns.push(`<button class="btn ${url ? 'btn-ghost' : 'btn-primary'}" type="button" data-act="card-go" data-id="${c.id}">${icon(go.icon)}${esc(label)}</button>`);
    }
    if (url) btns.push(`<a class="btn btn-primary" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(c.cta || '打开作品')}</a>`);
    HL.openSheet({
      title: c.title,
      body: `<p class="lead">${esc(tidy(c.subtitle))}</p>${paras(c.body)}${c.author ? `<p class="byline">作品：${esc(c.author)}</p>` : ''}`,
      foot: `<div class="sheet-foot">${btns.length ? btns.join('')
        : `<span class="hint">${esc(hint)}</span><button class="btn btn-ghost" type="button" data-act="close">知道了</button>`}</div>`,
    });
  };

  HL.act('station', el => HL.openStation(el.dataset.id));
  HL.act('product', el => HL.openProduct(el.dataset.id));
  HL.act('card', el => HL.openCard(el.dataset.id));
  HL.act('card-go', el => { HL.closeSheet(); GO[idx.card[el.dataset.id].go].run(); });

  HL.act('wish', el => {
    const id = el.dataset.id, on = S.wish.includes(id);
    S.wish = on ? S.wish.filter(x => x !== id) : [...S.wish, id];
    HL.store.save(); HL.renderAll();
    HL.$$(`[data-act="wish"][data-id="${id}"]`).forEach(b => b.setAttribute('aria-pressed', String(!on)));
    HL.toast(on ? '已从想去的景点移除' : '已收进想去的景点');
  });

  HL.act('product-go', el => { const p = idx.product[el.dataset.id]; HL.closeSheet(); GO[p.go].run(); });
  HL.act('want', el => {
    const id = el.dataset.id, on = S.want.includes(id);
    S.want = on ? S.want.filter(x => x !== id) : [...S.want, id];
    HL.store.save(); HL.pages.services.render(); // 想要清单在服务页「我的记录」里 HL.openProduct(id);
    HL.toast(on ? '已从想要清单移除' : '已加入想要清单');
  });
})();
