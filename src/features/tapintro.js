/* 碰一碰 / 扫一扫的开场动画：从芯片或二维码打开某个点位时，先播约 2.3 秒的「到达」动画，再弹出那一页。
   顺序：纸底铺开 → 声波涟漪从圆心扩散 → 点位照片从圆心剪开显现、外圈环形字转动 → 标题纸条滑入 → 「已到达 n / N」盖章 → 淡出。
   传了 plate（博物画抠图）就换成「图鉴」版：图框画出来 → 鸟先以墨稿显出、再从左到右上色 → 中文名、学名 → 羽色色卡 → 盖章。栈道手册的五只鸟用这一版。
   轻点任意处跳过；系统开了「减少动态效果」时只做淡入淡出。
   HL.tapIntro({ via, book, title, place, img, color, no, total, plate, latin, en, colors }) 返回 Promise，动画结束时 resolve。 */
(() => {
  'use strict';
  const { esc } = HL;
  const VIA = { nfc: '碰一碰', qr: '扫一扫' };
  const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  /* 图鉴版：一页博物画 */
  const plateHTML = (o, verb) => `
      <div class="tap-paper"></div>
      <i class="tp-frame" aria-hidden="true"></i>
      <p class="tp-head" aria-hidden="true">PLATE ${ROMAN[o.no] || o.no} · ${esc(o.book)} · ${esc(verb)}</p>
      <div class="tp-art" aria-hidden="true">
        <img class="tp-ink" src="${esc(o.plate)}" alt="">
        <img class="tp-color" src="${esc(o.plate)}" alt="">
      </div>
      <div class="tp-cap" aria-hidden="true">
        <b class="tp-name">${esc(o.title)}</b>
        <i class="tp-latin">${esc(o.latin || '')}</i>
        <small class="tp-en">${esc(o.en || '')} · ${esc(o.place)}</small>
        ${o.colors ? `<span class="tp-chips">${o.colors.map((c, i) => `<i style="--c:${esc(c)};--i:${i}"></i>`).join('')}</span>` : ''}
      </div>
      <div class="tap-stamp tp-stamp" aria-hidden="true"><small>已到达</small><b>${o.no}<em>/ ${o.total}</em></b></div>
      <p class="tap-skip" aria-hidden="true">轻点继续</p>`;

  HL.tapIntro = o => new Promise(done => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const verb = VIA[o.via] || '到站';
    const ring = Array(3).fill(`${verb} · ${o.book} · ${o.place}`).join(' · ') + ' · ';
    const el = document.createElement('div');
    el.className = `tap${reduce ? ' is-reduced' : ''}${o.plate ? ' is-plate' : ''}`;
    el.style.setProperty('--k', o.color || 'var(--deep)');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-label', `${verb}：${o.book}，${o.place}，${o.title}，第 ${o.no} 个，共 ${o.total} 个`);
    el.innerHTML = o.plate ? plateHTML(o, verb) : `
      <div class="tap-paper"></div>
      <div class="tap-rings" aria-hidden="true">${[0, 1, 2, 3, 4].map(i => `<i style="--i:${i}"></i>`).join('')}</div>
      <div class="tap-core" aria-hidden="true">
        <svg class="tap-ring" viewBox="0 0 200 200"><defs><path id="tapPath" d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0"/></defs>
          <text><textPath href="#tapPath" textLength="535">${esc(ring)}</textPath></text></svg>
        <div class="tap-photo"><img src="${esc(o.img)}" alt=""></div>
        <i class="tap-tape"></i>
      </div>
      <div class="tap-text" aria-hidden="true">
        <small class="tap-verb">${esc(verb)} · ${esc(o.book)}</small>
        <b class="tap-title">${esc(o.title)}</b>
        <span class="tap-place">${esc(o.place)}</span>
      </div>
      <div class="tap-stamp" aria-hidden="true"><small>已到达</small><b>${o.no}<em>/ ${o.total}</em></b></div>
      <p class="tap-skip" aria-hidden="true">轻点继续</p>`;
    document.body.append(el);

    let over = false;
    const timers = [];
    const finish = () => {
      if (over) return; over = true;
      timers.forEach(clearTimeout);
      el.classList.add('is-out');
      setTimeout(() => { el.remove(); }, reduce ? 200 : 520);
      done();
    };
    el.addEventListener('click', finish);
    /* 盖章那一下轻震：只有安卓支持，而且 Chrome 要求用户先点过页面，碰芯片刚打开时不会震 */
    const ua = navigator.userActivation;
    if (!reduce && navigator.vibrate && ua && ua.hasBeenActive) timers.push(setTimeout(() => { try { navigator.vibrate && navigator.vibrate([14, 50, 22]); } catch (e) { /* 不支持就算了 */ } }, o.plate ? 2050 : 1500));
    timers.push(setTimeout(finish, reduce ? 900 : o.plate ? 3300 : 2600));
  });
})();
