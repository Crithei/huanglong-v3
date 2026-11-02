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
    mine: { label: '打开我的', icon: 'user', run: () => HL.setPage('mine') },
    facilities: { label: '在游览页查看', icon: 'map', run: () => HL.goTour('fac') },
    medical: { label: '查看最近的医疗点', icon: 'cross', run: () => HL.focusFacility(HL.nearest('medical', idx.station[S.current]).f.id) },
    guide: { label: '问问导游', icon: 'guide', run: () => HL.openGuide() },
  };
  HL.GO = GO;

  HL.openStation = id => {
    const s = idx.station[id], wished = S.wish.includes(id);
    HL.openSheet({
      title: s.name,
      body: `${HL.media(s, 'sheet-media')}
        <p class="lead">${esc(s.tagline)}</p>
        <p>${esc(s.summary)}</p>
        <p class="kv"><b>看什么</b>　${esc(s.viewing)}</p>
        <p class="kv"><b>建议停留</b>　${s.minutes} 分钟，${esc(s.area)}</p>
        <p class="credit">${s.photo ? esc(s.photo.credit) : '示意图，实景照片待替换'}</p>`,
      foot: `<div class="sheet-foot">
        <button class="icon-btn" type="button" data-act="wish" data-id="${id}" aria-pressed="${wished}" aria-label="收藏到想去的景点">${icon('heart')}</button>
        <button class="btn btn-primary" type="button" data-act="select" data-id="${id}">${icon('map')}在游览中查看</button></div>`,
    });
  };

  HL.openProduct = id => {
    const p = idx.product[id], on = S.want.includes(id), url = HL.safeUrl(p.url);
    HL.openSheet({
      title: p.title,
      body: `<div class="sheet-media square">${HL.productArt(id)}</div><p class="lead">${esc(p.subtitle)}</p>${paras(p.body)}`,
      foot: `<div class="sheet-foot">${url
        ? `<a class="btn btn-ghost" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(p.cta || '查看商品')}</a>`
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

  HL.act('want', el => {
    const id = el.dataset.id, on = S.want.includes(id);
    S.want = on ? S.want.filter(x => x !== id) : [...S.want, id];
    HL.store.save(); HL.pages.mine.render(); HL.openProduct(id);
    HL.toast(on ? '已从想要清单移除' : '已加入想要清单');
  });
})();
