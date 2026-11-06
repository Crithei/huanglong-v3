/* 首页滑动时的纵深视差：
     - 主视觉：背景照片比页面滚得慢、略微放大；大标题和导语跟着漂移、渐隐，像三层纸叠在一起；
     - 卡片里的图片（精选景观、随行互动、文创商店）在框里反向轻移，框不动、画面在动；
     - 各栏目标题进入视野时从下方浮上来。
   只用 CSS 的 translate / scale / opacity 属性，不碰 transform，所以和卡片原有的待机动画（transform 关键帧）能叠加。
   开启「减少动态效果」时整个关掉；只处理首页，其他页面不受影响。 */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  /* 图片在框里能移动的最大距离（像素），数值越大看起来离得越远；第三项为真时稍微放大，挪动时框里不露边。
     一滴水的模型图要完整显示，只挪不放大。 */
  const DEPTH = [
    ['.spot .media img', 22, true],
    ['.play-card .shot-lab img', 14, true],
    ['.play-card .shot-water img', 8, false],
    ['.product .media img', 10, true],
  ];

  let page = null, frame = 0, io = null;

  function apply() {
    frame = 0;
    if (!page || page.hidden || reduced.matches) return;
    const y = page.scrollTop, vh = page.clientHeight, top = page.getBoundingClientRect().top;

    /* 主视觉三层：照片最慢，标题居中，导语和按钮最快 */
    const hero = page.querySelector('.hero');
    if (hero) {
      const h = hero.offsetHeight, k = Math.min(1, y / h);
      const img = hero.querySelector(':scope > img');
      if (img) { img.style.translate = `0 ${y * .45}px`; img.style.scale = String(1 + k * .08); }
      const title = hero.querySelector('.hero-title');
      if (title) { title.style.translate = `0 ${y * .28}px`; title.style.opacity = String(1 - k * 1.3); }
      const body = hero.querySelector('.hero-body');
      if (body) { body.style.translate = `0 ${y * .12}px`; body.style.opacity = String(1 - k * .9); }
    }

    /* 卡片图片：按它离屏幕中线的远近，往相反方向挪一点 */
    for (const [sel, d, zoom] of DEPTH) {
      for (const el of page.querySelectorAll(sel)) {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < top - 40 || r.top > top + vh + 40) continue;
        const t = ((r.top + r.height / 2) - (top + vh / 2)) / vh; // -0.5（上方）… 0.5（下方）
        el.style.translate = `0 ${(-t * d).toFixed(1)}px`;
        if (zoom) el.style.scale = '1.12';
      }
    }
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(apply); };

  /* 栏目标题：进入视野时浮上来（只做一次） */
  function watchTitles() {
    if (io) io.disconnect();
    if (reduced.matches || !window.IntersectionObserver) return;
    io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { root: page, threshold: .2 });
    page.querySelectorAll('.sec-h, .strata, .play-grid').forEach(el => {
      if (!el.classList.contains('is-in')) { el.classList.add('rise'); io.observe(el); }
    });
  }

  /* 恢复成没有视差的样子（切到减少动态效果时） */
  function clear() {
    page.querySelectorAll('.hero > img, .hero-title, .hero-body, ' + DEPTH.map(d => d[0]).join(', ')).forEach(el => {
      el.style.translate = ''; el.style.scale = ''; el.style.opacity = '';
    });
    page.querySelectorAll('.rise').forEach(el => el.classList.add('is-in'));
  }

  function init() {
    page = document.getElementById('p-home');
    if (!page) return;
    page.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    /* 首页每次重绘都会换掉里面的元素，重绘后重新挂上 */
    new MutationObserver(() => { watchTitles(); schedule(); }).observe(page, { childList: true });
    reduced.addEventListener('change', () => { if (reduced.matches) clear(); else { watchTitles(); schedule(); } });
    watchTitles(); schedule();
  }

  HL.parallax = { init, refresh: schedule };
})();
