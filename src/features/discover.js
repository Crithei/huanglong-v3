/* 发现手记：四本研学主题手册（水文地质 / 生态联系 / 退化保育 / 色彩感知），放在互动页「听见黄龙」下面。
   内容在 data/discover.js；翻页引擎和拼贴零件和栈道手册共用（features/handbook.js），每本一个 Handbook。
   页内的小互动只改当前这一页的 DOM，不翻页、不存档：看线索（照片叠标注）、择一（两站换着看）、
   资料怎么说（从页脚升起的一张纸）、点一句看证据、看光路。只有「在现场看过」记进 S.discover.seen。
   照片点一下进立体检视（有景深图的景点）。 */
(() => {
  'use strict';
  const { $, esc, icon, S, idx } = HL;
  const D = HL.data.discover;
  if (!D) return;
  const BOOKS = D.books;
  const { photo, strip, forest } = HL.pc;
  const save = () => HL.store.save();
  const byId = id => BOOKS.find(b => b.id === id) || BOOKS[0];
  const st = id => idx.station[id];
  const pic = id => (st(id) && st(id).photo ? st(id).photo.src : '');
  const stops = b => b.pages.filter(p => p.type === 'stop');
  const seenKey = (b, p) => `${b.id}:${p.id}`;
  const seenCount = b => stops(b).filter(p => S.discover.seen[seenKey(b, p)]).length;

  /* ---------- 概念图：照手册原图重画，颜色和字号交给 styles/discover.css ---------- */
  const FIG = {
    cycle: `<svg class="fx-svg" viewBox="0 0 570 286" role="img" aria-label="黄龙沟水循环概念剖面：地表水与泉水混合，部分水进入地下后再出露">
      <defs><marker id="fxA1" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#347c88"/></marker>
        <marker id="fxA2" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#816844"/></marker></defs>
      <path d="M12 95L91 72 176 121 265 129 350 140 440 181 558 191V265H12Z" fill="#dfd1ae" stroke="#9e8e68" stroke-width="2"/>
      <path d="M39 89Q84 70 126 94L172 119 240 126 290 131" fill="none" stroke="#347c88" stroke-width="6" marker-end="url(#fxA1)"/>
      <path d="M72 188Q120 183 164 121M299 132Q322 200 373 225Q416 238 455 181" fill="none" stroke="#816844" stroke-width="5" stroke-dasharray="9 7" marker-end="url(#fxA2)"/>
      <path d="M458 181Q500 182 542 190" fill="none" stroke="#347c88" stroke-width="6" marker-end="url(#fxA1)"/>
      <text x="23" y="54">地表水</text><text x="40" y="222">泉水补给</text><text x="262" y="106">水进入地下</text><text x="420" y="158">再出露</text><text x="228" y="262" class="is-dim">地下转化（资料解释）</text></svg>`,
    drop: `<svg class="fx-svg is-mini" viewBox="0 0 300 170" role="img" aria-label="坡面与跌坎的简化对照：贴坡流动和跌落">
      <path d="M10 68L105 84H149V118L290 145V162H10Z" fill="#dfd1ae"/>
      <path d="M15 64L103 80H147Q158 81 165 112L281 138" fill="none" stroke="#337783" stroke-width="5"/>
      <text x="16" y="50">贴坡流动</text><text x="170" y="74">跌落</text></svg>`,
    evidence: `<svg class="fx-svg" viewBox="0 0 570 268" role="img" aria-label="观察和作用解释需要的证据不同：上面一行实线连起水面、池缘、植物的位置，下面一行虚线连起生物活动和沉积条件">
      <rect x="14" y="20" width="542" height="94" rx="6" fill="#fdfcf6" stroke="#9cb39c"/><rect x="14" y="150" width="542" height="95" rx="6" fill="#f2ebd8" stroke="#c7b789"/>
      <path d="M129 82H216M345 82H439" stroke="#376c54" stroke-width="4" fill="none"/>
      <path d="M170 212H395" stroke="#896b3f" stroke-dasharray="9 6" stroke-width="4" fill="none"/>
      <text x="30" y="50" class="is-dim">可观察的位置</text><text x="54" y="94">水面</text><text x="232" y="94">池缘</text><text x="449" y="94">植物</text>
      <text x="30" y="181" class="is-dim">需研究的作用</text><text x="34" y="224">生物活动</text><text x="405" y="224">沉积条件</text></svg>`,
    rays: `<svg class="fx-svg fx-rays" viewBox="0 0 505 278" role="img" aria-label="天空反射与池底可见的概念剖面：实线是天空光被水面反射到眼睛，虚线是池底的光透出水面进入眼睛">
      <defs><marker id="fxB1" viewBox="0 0 10 10" markerWidth="3.4" markerHeight="3.4" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#246284"/></marker>
        <marker id="fxB2" viewBox="0 0 10 10" markerWidth="3.4" markerHeight="3.4" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#75451f"/></marker></defs>
      <rect x="14" y="13" width="477" height="135" fill="#e7f1f2"/><rect x="14" y="148" width="477" height="106" fill="#c7e2da"/>
      <path d="M14 244Q70 221 139 241T264 253T395 235Q461 227 491 243V265H14Z" fill="#e5d5ab" stroke="#907851" stroke-width="2"/>
      <path d="M14 148H491" fill="none" stroke="#4b776f" stroke-width="2"/>
      <text x="40" y="46">天空</text><text x="423" y="50">眼睛</text><text x="28" y="138">水面</text><text x="28" y="196">池水</text><text x="370" y="262">池底</text>
      <path d="M400 63Q413 49 426 63Q413 77 400 63Z" fill="#fffaf0" stroke="#203c33" stroke-width="2"/><circle cx="413" cy="63" r="4" fill="#203c33"/>
      <path class="beam-reflect" d="M77 62L163 106L245 148L334 103L407 66" fill="none" stroke="#246284" stroke-width="4.5" marker-mid="url(#fxB1)"/>
      <path class="beam-bottom" d="M264 253L296 201L329 148L368 108L406 69" fill="none" stroke="#75451f" stroke-width="4.5" stroke-dasharray="9 6" marker-mid="url(#fxB2)"/></svg>`,
    bank: `<svg class="fx-svg" viewBox="0 0 350 211" role="img" aria-label="栈道、滩面和表层流水的关系图：左边栈道是观察位置，右边钙华坡是滩面，蓝线是坡面上看得见的流水">
      <path d="M16 120H108" stroke="#785021" stroke-width="9" stroke-linecap="round"/><path d="M29 120V155M91 120V155" stroke="#9b793e" stroke-width="6"/>
      <path d="M116 101Q165 83 211 107T332 140V185H116Z" fill="#e5d4a7" stroke="#9b793e" stroke-width="2"/>
      <path d="M125 94Q170 77 214 101T324 133" fill="none" stroke="#347c88" stroke-width="5" stroke-linecap="round"/>
      <text x="16" y="70">观察位置</text><text x="178" y="58">可见流水</text><text x="15" y="182">栈道</text><text x="206" y="168">滩面</text></svg>`,
  };

  /* 照片上的标注：每条一根引线、一个点、一块深色标签（坐标是照片像素） */
  function annoSvg(a) {
    const [w, h] = a.vb, fs = Math.round(w / 30);
    return `<svg class="fx-anno" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${a.marks.map(([t, px, py, bx, by]) => {
      const bw = t.length * fs + fs * 1.1, bh = fs * 1.6;
      return `<path d="M${bx} ${by}L${px} ${py}" stroke="#fff6d9" stroke-width="${fs / 6}"/><circle cx="${px}" cy="${py}" r="${fs / 3.5}" fill="#213b32" stroke="#fff6d9" stroke-width="${fs / 12}"/>
        <rect x="${bx - bw / 2}" y="${by - bh / 2}" width="${bw}" height="${bh}" rx="${fs / 5}" fill="#213b32" stroke="#fff6d9" stroke-width="${fs / 14}"/>
        <text x="${bx}" y="${by + fs * .36}" font-size="${fs}" fill="#fff6d9" text-anchor="middle">${esc(t)}</text>`;
    }).join('')}</svg>`;
  }

  /* 一张贴上去的景点照：有景深图就能点进立体检视；可叠标注、编号点 */
  function fig(id, o = {}) {
    const s = st(id), deep = s && s.photo && s.photo.depth;
    return `<div class="fx-fig${o.cls ? ' ' + o.cls : ''}" style="--r:${o.r || -1.2}deg"${o.hidden ? ' hidden' : ''} data-i="${o.i ?? 0}">
      ${deep ? `<button class="fx-shot" type="button" data-act="scene-view" data-id="${id}" aria-label="立体检视：${esc(s.name)}">` : '<div class="fx-shot">'}
        ${photo(pic(id), s ? s.name : '')}${o.anno ? annoSvg(o.anno) : ''}
        ${o.pins ? o.pins.map(([n, x, y]) => `<i class="fx-pin" style="left:${x}%;top:${y}%">${esc(n)}</i>`).join('') : ''}
      ${deep ? `<span class="fx-3d" aria-hidden="true">${icon('layers')}</span></button>` : '</div>'}
      <span class="fx-cap">${esc(o.label || (s ? s.name : ''))}</span></div>`;
  }

  const clues = p => p.clues ? `<dl class="fx-clues${p.grid ? ' is-grid' : ''}">${p.clues.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>` : '';
  const more = p => p.more ? `<div class="fx-more" role="region" aria-label="${esc(p.more[0])}">
      <button class="fx-x" type="button" data-act="fx-more" aria-label="收起">${icon('x')}</button>
      ${strip(p.type === 'review' ? '再想一步' : '资料怎么说', 'is-green')}<b>${esc(p.more[0])}</b><p>${esc(p.more[1])}</p>${p.moreFig ? FIG[p.moreFig] : ''}
      ${p.station ? `<button class="hb-link" type="button" data-act="select" data-id="${p.station}">${icon('map')}在游览里看${esc(st(p.station).name)}</button>` : ''}</div>` : '';

  function pageFoot(b, p) {
    const k = seenKey(b, p), on = !!S.discover.seen[k];
    return `<div class="fx-foot">
        ${p.more ? `<button class="fx-btn" type="button" data-act="fx-more">${icon('info')}${p.moreFig ? '看关系图' : p.type === 'review' ? '再想一步' : '资料怎么说'}</button>` : ''}
        ${p.type === 'stop' ? `<button class="fx-btn fx-seen${on ? ' is-on' : ''}" type="button" data-act="fx-seen" data-k="${k}" aria-pressed="${on}">${icon(on ? 'check' : 'stamp')}${on ? '在现场看过' : '我在现场看过'}</button>` : ''}
      </div>
      <p class="fx-keep">${esc(p.keep || '')}</p>${more(p)}`;
  }

  /* ---------- 一本书的全部页 ---------- */
  function pagesOf(b) {
    const P = [], add = (ch, cls, html) => P.push({ ch, cls: `fx-page ${cls}`, html });
    const run = t => `<header class="hb-run"><span>${esc(b.no)} ${esc(b.name)} · ${esc(t)}</span><span class="hb-pn"></span></header>`;
    const n = seenCount(b), total = stops(b).length;

    add('go', 'hb-cover fx-cover', `
      ${photo(pic(b.cover), st(b.cover).name, 'cv-photo')}
      <div class="cv-title">${strip(`HUANGLONG · FIELD NOTES ${b.no}`, 'is-small')}<h3>${esc(b.name)}</h3>${strip('发现手记', 'is-gold')}</div>
      <p class="fx-q">${esc(b.title)}</p>
      <p class="cv-motto">${esc(b.question)}</p>
      <span class="cv-count">现场看过 ${n} / ${total} 站</span>
      <span class="hb-hint">从右边往左拖，翻开 ←</span>${forest()}`);

    /* 目录：页码在拼好全书后回填 */
    const tocAt = P.length;
    add('go', 'hb-toc fx-toc', '');

    b.pages.forEach(p => {
      const head = `${run(p.tag)}<h4>${esc(p.title)}</h4>`;
      if (p.type === 'stop') {
        let media = '';
        if (p.pick) {
          media = `<div class="fx-pick" role="tablist" aria-label="任选一处">${p.pick.map(([id], i) => `<button type="button" role="tab" data-act="fx-pick" data-i="${i}" aria-selected="${i === 0}">${esc(st(id).name)}</button>`).join('')}<small>择一即可</small></div>
            ${p.pick.map(([id, note], i) => fig(id, { i, hidden: i > 0, label: note })).join('')}`;
        } else if (p.pair) {
          media = `<div class="fx-pair">${p.pair.map(([id, label], i) => fig(id, { label, r: i ? 1.4 : -1.6 })).join('')}</div>`;
        } else {
          media = fig(p.station, { anno: p.anno, pins: p.pins });
          if (p.anno) media = `<div class="fx-annowrap">${media}<button class="fx-btn fx-annobtn" type="button" data-act="fx-anno" aria-pressed="false">${icon('zoom')}看线索</button></div>`;
        }
        add('see', `fx-stop${p.pick ? ' has-pick' : ''}${p.pair ? ' has-pair' : ''}`, `${head}${media}
          <p class="hb-p fx-ask">${esc(p.ask)}</p>${clues(p)}${p.fig ? FIG[p.fig] : ''}${pageFoot(b, p)}`);
      } else if (p.type === 'insert') {
        add('ins', 'fx-insert', `${head}<p class="hb-p">${esc(p.text)}</p>
          ${p.fig ? FIG[p.fig] : ''}
          ${p.beams ? `<div class="fx-beams">${p.beams.map(([k, t]) => `<button class="fx-btn" type="button" data-act="fx-beam" data-k="${k}" aria-pressed="false">${esc(t)}</button>`).join('')}</div>` : ''}
          ${p.note ? `<p class="hb-small">${esc(p.note)}</p>` : ''}
          ${p.quiz ? `<div class="fx-quiz">${strip(p.quiz.q, 'is-red')}${p.quiz.opts.map(([t, ok, fb], i) => `<button class="fx-opt" type="button" data-act="fx-quiz" data-i="${i}" data-ok="${ok}"><b>“${esc(t)}”</b><small>${esc(fb)}</small></button>`).join('')}</div>` : ''}
          ${pageFoot(b, p)}`);
      } else {
        add('back', 'fx-review', `${head}<p class="hb-p">${esc(p.ask)}</p>
          ${p.rows ? `<div class="fx-rows is-${p.rows.length}">${p.rows.map(([a, t, id], i) => `<div class="fx-row" style="--r:${[-2, 1.5, -1][i]}deg">${photo(pic(id), st(id).name)}<b>${esc(a)}</b><small>${esc(t)}</small></div>`).join('')}</div>` : ''}
          ${p.actions ? `<div class="fx-acts">${p.actions.map(([a, t], i) => `<button class="fx-opt fx-act" type="button" data-act="fx-pick-act" data-i="${i}" aria-pressed="false"><b>${esc(a)}</b><small>${esc(t)}</small></button>`).join('')}</div>` : ''}
          ${p.say ? `<p class="hb-quote">可以这样说：${esc(p.say)}</p>` : ''}
          ${p.care ? `<p class="hb-small">${esc(p.care)} ${esc(D.rules)}</p>` : ''}
          <div class="fx-seal${n === total ? ' is-done' : ''}"><i>${n === total ? '全' : n}</i><span>现场看过<br>${n} / ${total} 站</span></div>
          ${pageFoot(b, p)}`);
      }
    });

    /* 依据与图片 */
    const used = [...new Set(b.pages.flatMap(p => p.station ? [p.station] : p.pick ? p.pick.map(x => x[0]) : p.pair ? p.pair.map(x => x[0]) : p.rows ? p.rows.map(x => x[2]) : []).concat(b.cover))];
    add('back', 'fx-sources', `${run('依据与图片')}<h4>这些内容从哪来</h4>
      <ul class="fx-src">${b.sources.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
      ${strip('照片', 'is-green')}
      <p class="hb-small">${used.map(id => `${esc(st(id).name)}：${esc(st(id).photo.credit)}`).join('；')}。照片只用来认景物，不是同机位、同时段的监测资料。</p>
      <p class="hb-small">${esc(D.credit)}</p>`);
    add('', 'hb-back fx-back', `<span class="fx-back-no">${esc(b.no)}</span><span>黄龙伴游 · 发现手记 · ${esc(b.name)}</span>${forest()}`);

    /* 回填目录 */
    const rows = P.map((pg, i) => ({ pg, i })).filter(x => x.i > tocAt && x.i < P.length - 1);
    const where = p => p.type === 'insert' ? '插页' : p.type === 'review' ? '回看' : (p.pick || p.pair || [[p.station]]).map(x => st(x[0]).name.replace(/观景台$/, '')).join(' / ');
    const labelOf = i => { const p = b.pages[i - tocAt - 1]; return p ? [where(p), p.title] : ['依据', '这些内容从哪来']; };
    P[tocAt].html = `${run('目录')}<h4>${esc(b.title)}</h4>
      <p class="hb-small fx-route">${esc(b.route)}的发现手记</p>
      <ol class="toc fx-tocl">${rows.map(({ i }) => { const [a, t] = labelOf(i); return `<li><button type="button" data-act="fx-go" data-i="${i}"><span><b>${esc(t)}</b><small>${esc(a)}</small></span><em>${i}</em></button></li>`; }).join('')}</ol>
      <p class="hb-small">${esc(b.intro)}这是研学主题顺序，不是步道导航；可以独自看，也可以结伴指认、讨论。</p>`;
    return P;
  }

  /* ---------- 四本书 ---------- */
  const CH = [['go', '封面'], ['see', '沿途'], ['ins', '插页'], ['back', '回看']];
  const book = {};
  BOOKS.forEach(b => {
    book[b.id] = HL.Handbook.create({
      name: 'fx-' + b.id, label: `发现手记 · ${b.name}`, chapters: CH, cls: 'fx-hb', pages: () => pagesOf(b),
      getPage: () => S.discover.page[b.id] || 0, setPage: i => { S.discover.page[b.id] = i; save(); },
    });
  });
  const cur = () => byId(S.discover.book);

  HL.discoverRender = () => {
    const host = $('#fx-book');
    if (!host) return;
    const b = cur();
    document.querySelectorAll('.fx-switch button').forEach(x => x.setAttribute('aria-selected', String(x.dataset.v === b.id)));
    host.style.setProperty('--bk', b.color);
    book[b.id].render(host);
    const cnt = $('#play-fx-count');
    if (cnt) cnt.textContent = `现场看过 ${BOOKS.reduce((s, x) => s + seenCount(x), 0)} / ${BOOKS.reduce((s, x) => s + stops(x).length, 0)} 站`;
  };
  /* 互动页上的切换条和整节骨架（play.js 建好空节后调用） */
  HL.discoverSection = () => `
    <div class="hb-switch fx-switch" role="tablist" aria-label="选一本发现手记">${BOOKS.map(b => `<button type="button" role="tab" data-act="fx-which" data-v="${b.id}" style="--bk:${b.color}"><i>${esc(b.no)}</i><b>${esc(b.name)}</b><small>${esc(b.short)}</small></button>`).join('')}</div>
    <div id="fx-book"></div>
    <p class="sound-credit">${esc(D.credit)} 照片来自 Wikimedia Commons，署名见每本最后一页。</p>`;

  /* 首页卡片、汇报页用：切到互动页，翻开某一本 */
  HL.openDiscover = id => {
    HL.closeSheet();
    if (id) { S.discover.book = byId(id).id; save(); }
    if (S.page !== 'play') HL.setPage('play');
    HL.discoverRender();
    const sec = $('#h-discover');
    if (sec) requestAnimationFrame(() => sec.closest('section').scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  };

  /* ---------- 动作 ---------- */
  const pageOf = el => el.closest('.hb-page');
  HL.act('fx-which', el => { S.discover.book = byId(el.dataset.v).id; save(); HL.discoverRender(); });
  HL.act('fx-open', el => HL.openDiscover(el.dataset.v));
  HL.act('fx-go', el => book[cur().id].goTo(Number(el.dataset.i)));
  HL.act('fx-anno', el => {
    const on = el.getAttribute('aria-pressed') !== 'true';
    el.setAttribute('aria-pressed', String(on));
    el.closest('.fx-annowrap').classList.toggle('is-anno', on);
  });
  HL.act('fx-pick', el => {
    const pg = pageOf(el), i = el.dataset.i;
    pg.querySelectorAll('.fx-pick button').forEach(x => x.setAttribute('aria-selected', String(x === el)));
    pg.querySelectorAll('.fx-fig').forEach(f => { f.hidden = f.dataset.i !== i; });
  });
  HL.act('fx-more', el => { const m = pageOf(el).querySelector('.fx-more'); if (m) m.classList.toggle('is-open'); });
  HL.act('fx-quiz', el => {
    el.parentNode.querySelectorAll('.fx-opt').forEach(x => x.classList.toggle('is-picked', x === el));
    el.classList.add(el.dataset.ok === 'true' ? 'is-yes' : 'is-no');
  });
  HL.act('fx-pick-act', el => { const on = el.getAttribute('aria-pressed') !== 'true'; el.setAttribute('aria-pressed', String(on)); });
  HL.act('fx-beam', el => {
    const on = el.getAttribute('aria-pressed') !== 'true', svg = pageOf(el).querySelector('.fx-rays');
    el.parentNode.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === el && on)));
    if (svg) svg.dataset.show = on ? el.dataset.k : '';
  });
  HL.act('fx-seen', el => {
    const k = el.dataset.k;
    if (S.discover.seen[k]) delete S.discover.seen[k]; else S.discover.seen[k] = new Date().toISOString();
    save(); book[cur().id].redraw();
    const cnt = $('#play-fx-count');
    if (cnt) cnt.textContent = `现场看过 ${BOOKS.reduce((s, x) => s + seenCount(x), 0)} / ${BOOKS.reduce((s, x) => s + stops(x).length, 0)} 站`;
    HL.toast(S.discover.seen[k] ? '记下了：在现场看过这一站' : '已取消');
  });
})();
