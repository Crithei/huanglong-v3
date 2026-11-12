/* 可翻页的手册：卷页翻书引擎 + 拼贴剪纸零件。「栈道手册」（features/sound.js）和「声景手册」（features/soundbank.js）共用。

   用法：const book = HL.Handbook.create({ name, chapters, pages, getPage, setPage, cls })
     name      手册名，同时写在根元素的 data-book 上，翻页按钮靠它找到自己的手册
     chapters  顶部章节标签 [[章节 id, 文字], …]
     pages()   返回 [{ ch: 章节 id, cls: 页面类名, html }]；html 里写 <span class="hb-pn"></span> 会被换成页码
     getPage / setPage  读写当前页码（存在 S 里）
   book.render(host)  把手册装进 host（已经在里面就只刷新）；book.redraw() 只重画当前页；book.goTo(i) 翻到第 i 页。

   卷页：页角被拖到手指位置 F，折线是「页角原位置」和 F 连线的垂直平分线。折线一侧的纸留在原处（clip-path 裁掉另一侧），
   另一侧用一张同样大小的纸背按折线镜像过来，再在折线两边各放一条渐变当折痕和投影。页角到书脊两端的距离不超过原长，纸不会被扯离书脊。 */
(() => {
  'use strict';
  const { esc, icon } = HL;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 拼贴零件 ---------- */
  const tape = (cls = '') => `<i class="pc-tape ${cls}" aria-hidden="true"></i>`;
  HL.pc = {
    tape,
    /* 贴上去的照片：白边、胶带、微微歪 */
    photo: (src, alt, cls = '') => `<figure class="pc-photo ${cls}">${tape()}<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" draggable="false"></figure>`,
    /* 撕下来的纸条当标签 */
    strip: (text, cls = '') => `<span class="pc-strip ${cls}">${esc(text)}</span>`,
    /* 抠出来的图，和用它当蒙版的剪影 */
    cut: (src, alt, cls = '') => `<img class="pc-cut ${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" draggable="false">`,
    sil: (src, alt, cls = '') => `<span class="pc-sil ${cls}" role="img" aria-label="${esc(alt)}" style="-webkit-mask-image:url(${src});mask-image:url(${src})"></span>`,
    /* 页脚的剪纸山林：三层纸，一层山脊两层冷杉 */
    forest: (cls = '') => {
      const firs = (y, s, step, off) => { let d = ''; for (let x = off; x < 330; x += step) d += `M${x} ${y}l${-7 * s} 0l${4 * s} ${-7 * s}l${-2.5 * s} 0l${3.5 * s} ${-6 * s}l${-2 * s} 0l${4 * s} ${-8 * s}l${4 * s} ${8 * s}l${-2 * s} 0l${3.5 * s} ${6 * s}l${-2.5 * s} 0l${4 * s} ${7 * s}Z`; return d; };
      return `<svg class="pc-forest ${cls}" viewBox="0 0 320 70" preserveAspectRatio="none" aria-hidden="true">
        <path class="f1" d="M0 70V40L40 22l30 14 36-26 34 24 28-12 40 20 34-18 38 16 40-14V70Z"/>
        <path class="f2" d="M0 70V52h320v18Z${firs(54, 1.15, 34, 12)}"/>
        <path class="f3" d="M0 70V62h320v8Z${firs(63, .85, 26, 4)}"/></svg>`;
    },
  };

  /* ---------- 几何：矩形被半平面裁剪（保留 (X-M)·n 与 sign 同号的一侧） ---------- */
  function clip(w, h, M, n, sign) {
    const rect = [[0, 0], [w, 0], [w, h], [0, h]], out = [];
    const side = p => ((p[0] - M.x) * n.x + (p[1] - M.y) * n.y) * sign;
    for (let i = 0; i < 4; i++) {
      const a = rect[i], c = rect[(i + 1) % 4], sa = side(a), sc = side(c);
      if (sa >= 0) out.push(a);
      if ((sa >= 0) !== (sc >= 0)) { const t = sa / (sa - sc); out.push([a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t]); }
    }
    return out;
  }
  const poly = pts => pts.length ? `polygon(${pts.map(p => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(',')})` : 'polygon(0 0)';

  const books = {};

  function create(o) {
    const bk = { o, P: [], n: 0, el: null, flip: null, raf: 0, drag: null };
    const $b = sel => bk.el.querySelector(sel);
    const leafHtml = (pg, i) => `<div class="hb-page pc-paper ${pg.cls}">${pg.html.replace('<span class="hb-pn"></span>', `<span class="hb-pn">${i} / ${bk.n - 2}</span>`)}</div>`;

    function build(host) {
      host.innerHTML = `<div class="hb ${o.cls || ''}" data-book="${o.name}">
          <div class="hb-tabs" role="tablist" aria-label="章节">${o.chapters.map(([c, t]) => `<button type="button" role="tab" data-act="hb-ch" data-ch="${c}">${esc(t)}</button>`).join('')}</div>
          <div class="hb-stack" role="group" aria-roledescription="手册" aria-label="${esc(o.label || '手册')}，左右拖动翻页">
            <div class="hb-layer hb-under" hidden></div>
            <div class="hb-layer hb-top"></div>
            <i class="hb-cast" hidden></i>
            <div class="hb-flapwrap" hidden><div class="hb-layer hb-flap"><i class="hb-crease"></i></div></div>
            <span class="hb-spine" aria-hidden="true"></span>
          </div>
          <div class="hb-nav">
            <button class="icon-btn" type="button" data-act="hb-turn" data-dir="-1" aria-label="上一页">${icon('prev')}</button>
            <span class="hb-no"></span>
            <button class="icon-btn" type="button" data-act="hb-turn" data-dir="1" aria-label="下一页">${icon('chev')}</button>
          </div></div>`;
      bk.el = host.firstElementChild;
      Object.assign(bk, { st: $b('.hb-stack'), top: $b('.hb-top'), under: $b('.hb-under'), cast: $b('.hb-cast'), wrap: $b('.hb-flapwrap'), flap: $b('.hb-flap'), crease: $b('.hb-crease') });
      bindPointer();
    }

    bk.render = host => {
      if (!host) return;
      if (!bk.el || !host.contains(bk.el)) build(host);
      cancelAnimationFrame(bk.raf); bk.flip = null;
      bk.P = o.pages(); bk.n = bk.P.length;
      const p = Math.max(0, Math.min(bk.n - 1, o.getPage() || 0));
      if (p !== o.getPage()) o.setPage(p);
      show(p);
    };
    bk.redraw = () => { if (!bk.el) return; bk.P = o.pages(); bk.n = bk.P.length; show(o.getPage()); };
    bk.chStart = ch => bk.P.findIndex(pg => pg.ch === ch);
    bk.find = fn => bk.P.findIndex(fn);

    function show(p) {
      bk.top.innerHTML = leafHtml(bk.P[p], p);
      bk.top.style.clipPath = ''; bk.under.hidden = true; bk.wrap.hidden = true; bk.cast.hidden = true;
      bk.st.style.setProperty('--rest', String(Math.min(6, bk.n - 1 - p)));
      bk.top.querySelectorAll('.toc-pn').forEach(e => { e.textContent = bk.chStart(e.dataset.ch); });
      $b('.hb-no').textContent = p === 0 ? '封面' : p === bk.n - 1 ? '封底' : `${p} / ${bk.n - 2}`;
      $b('[data-dir="-1"]').disabled = p === 0;
      $b('[data-dir="1"]').disabled = p === bk.n - 1;
      bk.el.querySelectorAll('.hb-tabs button').forEach(t => t.setAttribute('aria-selected', String(t.dataset.ch === bk.P[p].ch)));
      if (o.onShow) o.onShow(bk.top.firstElementChild, p);
    }

    /* 页角被拖到 F：算出折线，裁掉当前页被翻起的部分，把纸背翻折到另一侧 */
    function fold(F) {
      const f = bk.flip, w = f.w, h = f.h, cy = f.cy;
      for (let k = 0; k < 2; k++) for (const [sy, r] of [[cy, w], [h - cy, Math.hypot(w, h)]]) {
        const dx = F.x, dy = F.y - sy, d = Math.hypot(dx, dy);
        if (d > r) { F.x = dx / d * r; F.y = sy + dy / d * r; }
      }
      f.F = F;
      const dx = F.x - w, dy = F.y - cy, len = Math.hypot(dx, dy);
      if (len < 1.5) { bk.top.style.clipPath = ''; bk.wrap.hidden = true; bk.cast.hidden = true; return; }
      const n = { x: dx / len, y: dy / len }, M = { x: (w + F.x) / 2, y: (cy + F.y) / 2 };
      bk.top.style.clipPath = poly(clip(w, h, M, n, 1));
      bk.flap.style.clipPath = poly(clip(w, h, M, n, -1));
      const k2 = 2 * (M.x * n.x + M.y * n.y);
      bk.flap.style.transform = `matrix(${1 - 2 * n.x * n.x},${-2 * n.x * n.y},${-2 * n.x * n.y},${1 - 2 * n.y * n.y},${k2 * n.x},${k2 * n.y})`;
      const ang = Math.atan2(n.y, n.x) * 180 / Math.PI + 180, sw = Math.min(70, 12 + len * .28);
      const place = `translate(${M.x.toFixed(1)}px,${M.y.toFixed(1)}px) rotate(${ang.toFixed(2)}deg) translate(0,-50%)`;
      bk.crease.style.transform = place; bk.crease.style.width = sw + 'px';
      bk.cast.style.transform = place; bk.cast.style.width = sw * .9 + 'px';
      bk.wrap.hidden = false; bk.cast.hidden = false;
    }
    function startFlip(dir, target) {
      const p = o.getPage();
      const leaf = dir > 0 ? p : (target ?? p - 1), under = dir > 0 ? (target ?? p + 1) : p;
      if (leaf < 0 || under > bk.n - 1 || leaf === under) return false;
      const r = bk.top.getBoundingClientRect();
      bk.flip = { dir, leaf, under, w: r.width, h: r.height, cy: r.height, F: null };
      bk.top.innerHTML = leafHtml(bk.P[leaf], leaf);
      bk.under.innerHTML = leafHtml(bk.P[under], under);
      bk.under.hidden = false;
      return true;
    }
    function endFlip(commit) {
      const f = bk.flip; bk.flip = null;
      if (commit) o.setPage(f.dir > 0 ? f.under : f.leaf);
      show(o.getPage());
    }
    /* 松手后把页角送到终点（翻过去是书脊左边的镜像点，弹回是原位） */
    function settle(commit) {
      const f = bk.flip, from = { ...f.F }, done = f.dir > 0 ? commit : !commit;
      const to = done ? { x: -f.w, y: f.cy } : { x: f.w, y: f.cy }, t0 = performance.now(), dur = 160 + 260 * Math.min(1, Math.abs(to.x - from.x) / (2 * f.w));
      const step = now => {
        const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
        fold({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e });
        if (t < 1) bk.raf = requestAnimationFrame(step); else endFlip(commit);
      };
      bk.raf = requestAnimationFrame(step);
    }
    /* 自动翻页：页角沿一条弧线走，纸会先卷起再落下 */
    function autoFlip(dir, target) {
      if (bk.flip || !startFlip(dir, target)) return;
      if (reduced()) { endFlip(true); return; }
      const f = bk.flip, t0 = performance.now(), dur = 620;
      const step = now => {
        const t = Math.min(1, (now - t0) / dur), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, u = dir > 0 ? e : 1 - e;
        fold({ x: f.w - 2 * f.w * u, y: f.cy - Math.sin(Math.PI * u) * f.h * .2 });
        if (t < 1) bk.raf = requestAnimationFrame(step); else endFlip(true);
      };
      bk.raf = requestAnimationFrame(step);
    }
    bk.turn = dir => autoFlip(dir);
    bk.goTo = i => { if (!bk.el) return; i = Math.max(0, Math.min(bk.n - 1, i)); const p = o.getPage(); if (i !== p) autoFlip(i > p ? 1 : -1, i); };

    /* 手指拖动：横向才算翻页，竖向留给页面滚动 */
    function bindPointer() {
      const st = bk.st;
      st.addEventListener('pointerdown', e => {
        if (e.button !== 0 || bk.flip) return;
        bk.drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false, ui: !!e.target.closest('button, a, textarea, input, [data-act]') };
      });
      st.addEventListener('pointermove', e => {
        const d = bk.drag;
        if (!d || d.id !== e.pointerId) return;
        const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
        if (!d.moved) {
          if (Math.abs(dx) < 9 || Math.abs(dx) < Math.abs(dy) * 1.2) { if (Math.abs(dy) > 14) bk.drag = null; return; }
          if (!startFlip(dx < 0 ? 1 : -1)) { bk.drag = null; return; }
          d.moved = true;
          const r = bk.top.getBoundingClientRect();
          bk.flip.cy = d.y0 - r.top < r.height / 2 ? 0 : r.height; // 抓上半页从右上角卷，抓下半页从右下角卷
          try { st.setPointerCapture(e.pointerId); } catch (err) { /* 捕获失败也能拖 */ }
        }
        const f = bk.flip;
        fold({ x: (f.dir > 0 ? f.w : -f.w) + dx * 1.9, y: f.cy + dy * .9 });
      });
      const end = e => {
        const d = bk.drag;
        if (!d || d.id !== e.pointerId) return;
        bk.drag = null;
        if (!d.moved) { // 轻点：右边翻下一页，左边翻回；点在按钮上不算
          if (e.type !== 'pointerup' || d.ui) return;
          const r = st.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width;
          if (fx > .72) autoFlip(1); else if (fx < .28) autoFlip(-1);
          return;
        }
        const f = bk.flip;
        settle(e.type === 'pointerup' && (f.dir > 0 ? f.F.x < f.w * .55 : f.F.x > -f.w * .55)); // 拖过页宽四分之一左右就算翻过去
      };
      st.addEventListener('pointerup', end);
      st.addEventListener('pointercancel', end);
    }

    books[o.name] = bk;
    return bk;
  }

  const of = el => books[el.closest('.hb') && el.closest('.hb').dataset.book];
  HL.act('hb-turn', el => { const b = of(el); if (b) b.turn(Number(el.dataset.dir)); });
  HL.act('hb-ch', el => { const b = of(el); if (b) b.goTo(b.chStart(el.dataset.ch)); });

  HL.Handbook = { create, books };
})();
