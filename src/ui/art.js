/* 插图：景点示意图（没有实景照片时）、文创商品图、印章、水滴、池沿。
   都是按数据即时生成的 SVG 字符串；有真实素材后替换对应函数即可。 */
(() => {
  'use strict';
  const { esc } = HL;

  function hex(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function mix(a, b, t) {
    const x = hex(a), y = hex(b);
    return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
  }
  /* 以字符串为种子的伪随机数，同一景点每次画出来都一样。 */
  function seeded(str) {
    let h = 2166136261;
    for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
  }
  HL.seeded = seeded;

  function sceneArt(st) {
    const w = 320, h = 240, r = seeded(st.id);
    const tint = st.tint;
    const ridge = (y0, amp, step) => {
      let d = `M0 ${h} L0 ${y0}`;
      for (let x = 0; x <= w + step; x += step) d += ` Q${x + step / 2} ${y0 - amp * (.4 + r() * .9)} ${x + step} ${y0 - amp * (r() - .3)}`;
      return d + ` L${w} ${h} Z`;
    };
    let s = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">`;
    s += `<defs><linearGradient id="sky-${st.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9f1ec"/><stop offset="1" stop-color="#cfe0d6"/></linearGradient></defs>`;
    s += `<rect width="${w}" height="${h}" fill="url(#sky-${st.id})"/>`;
    s += `<path d="${ridge(h * .2, 26, 90)}" fill="#9db7aa"/>`;
    s += `<path d="${ridge(h * .27, 14, 34)}" fill="#4f7565"/>`;
    s += `<path d="${ridge(h * .33, 9, 16)}" fill="#2a5444"/>`;
    // Travertine terraces: each tier is a tinted pool held by a pale calcite lip.
    const tiers = 5, lips = [];
    for (let k = 0; k < tiers; k++) {
      const y = h * (.36 + k * .135), a = 8 + r() * 12, b = r() * .3;
      const lip = `M-4 ${y + a * b} C${w * (.25 + r() * .1)} ${y - a} ${w * (.55 + r() * .1)} ${y + a} ${w + 4} ${y - a * .3}`;
      const fill = mix(mix(tint, '#17332d', .34 - k * .07), '#ffffff', k * .07);
      s += `<path d="${lip} L${w + 4} ${h} L-4 ${h} Z" fill="${fill}"/>`;
      lips.push({ d: lip, y });
    }
    if (st.category === '瀑布钙华') {
      // Short spills over each lip, offset per tier, so water reads as cascading.
      lips.slice(0, -1).forEach(l => {
        const n = 4 + Math.floor(r() * 3);
        for (let i = 0; i < n; i++) {
          const x = w * (.12 + r() * .76), len = h * (.06 + r() * .05);
          s += `<path d="M${x.toFixed(1)} ${(l.y + 2).toFixed(1)} q${(r() * 4 - 2).toFixed(1)} ${(len / 2).toFixed(1)} ${(r() * 3 - 1.5).toFixed(1)} ${len.toFixed(1)}" stroke="#fff" stroke-opacity="${(.55 + r() * .35).toFixed(2)}" stroke-width="${(1.2 + r() * 1.6).toFixed(1)}" stroke-linecap="round" fill="none"/>`;
        }
      });
    }
    if (st.category === '人文自然' || st.category === '洞穴人文') {
      const x = w * (.42 + r() * .16), y = h * .33;
      s += `<rect x="${x - 26}" y="${y - 4}" width="52" height="18" fill="#6d5034"/><path d="M${x - 40} ${y - 2} Q${x} ${y - 12} ${x + 40} ${y - 2} L${x + 30} ${y - 14} L${x - 30} ${y - 14} Z" fill="#33291e"/><path d="M${x - 34} ${y - 16} Q${x} ${y - 28} ${x + 34} ${y - 16} L${x + 24} ${y - 26} L${x - 24} ${y - 26} Z" fill="#33291e"/><rect x="${x - 6}" y="${y + 2}" width="12" height="12" fill="#2a2018"/>`;
    }
    if (st.category === '钙华景观' || st.category === '观景台') {
      // Flow lines across a sloping calcite face.
      for (let i = 0; i < 8; i++) {
        const x0 = w * (-.1 + i * .16), y0 = h;
        s += `<path d="M${x0.toFixed(1)} ${y0} Q${(x0 + w * .12).toFixed(1)} ${(h * .7).toFixed(1)} ${(x0 + w * .3).toFixed(1)} ${(h * .42).toFixed(1)}" stroke="#f4ecd4" stroke-opacity=".45" stroke-width="1.6" fill="none"/>`;
      }
    }
    lips.forEach((l, k) => { s += `<path d="${l.d}" fill="none" stroke="#f4ecd4" stroke-width="${2.2 + k * .6}" stroke-opacity="${.7 + k * .06}" stroke-linecap="round"/>`; });
    return s + '</svg>';
  }

  /* 景点图：有 photo 用照片，没有就画示意图。 */
  HL.media = (st, cls = 'media') => st.photo
    ? `<div class="${cls}" style="--c:${st.tint}"><img src="${esc(st.photo.src)}" alt="${esc(st.name)}实景" loading="lazy"></div>`
    : `<div class="${cls}" style="--c:${st.tint}" role="img" aria-label="${esc(st.name)}示意图">${sceneArt(st)}</div>`;

  /* 文创商品占位图。新增商品没有专门画法时用明信片样式。 */
  HL.productArt = id => {
    const v = 'viewBox="0 0 200 200" aria-hidden="true"';
    const rims = (x, y, w, colors) => colors.map((c, k) => {
      const yy = y + k * 26;
      return `<path d="M${x} ${yy + 6} q${w / 4} -10 ${w / 2} 0 t${w / 2} 0 V${yy + 34} H${x} Z" fill="${c}"/><path d="M${x} ${yy + 6} q${w / 4} -10 ${w / 2} 0 t${w / 2} 0" stroke="#f4ecd4" stroke-width="3" fill="none"/>`;
    }).join('');
    switch (id) {
      case 'shop-pool-magnet':
        return `<svg ${v}><rect width="200" height="200" fill="#e4eee8"/><rect x="44" y="48" width="112" height="112" rx="24" fill="#12666d" transform="translate(4 6)" opacity=".18"/><clipPath id="pm"><rect x="44" y="44" width="112" height="112" rx="24"/></clipPath><g clip-path="url(#pm)"><rect x="44" y="44" width="112" height="112" fill="#2a5444"/>${rims(44, 62, 112, ['#9ee1d8', '#64c8ce', '#3aa7ad', '#12666d'])}</g></svg>`;
      case 'shop-field-notebook':
        return `<svg ${v}><rect width="200" height="200" fill="#f1ead6"/><rect x="56" y="30" width="96" height="140" rx="8" fill="#17332d" transform="translate(4 5)" opacity=".2"/><rect x="56" y="30" width="96" height="140" rx="8" fill="#1d4a42"/><path d="M68 30v140" stroke="#0f2621" stroke-width="2"/><path d="M138 30v140" stroke="#c9a04b" stroke-width="5"/><circle cx="102" cy="96" r="22" fill="none" stroke="#c9a04b" stroke-width="3"/><path d="M88 92q7-5 14 0t14 0M88 101q7-5 14 0t14 0" stroke="#c9a04b" stroke-width="2.4" fill="none"/></svg>`;
      case 'shop-water-bookmark':
        return `<svg ${v}><rect width="200" height="200" fill="#e7efe9"/><path d="M100 8v20" stroke="#c9a04b" stroke-width="2"/><circle cx="100" cy="10" r="4" fill="#c9a04b"/><rect x="78" y="28" width="44" height="160" rx="8" fill="#4cc3c2"/><path d="M100 48s11 12 11 20a11 11 0 0 1-22 0c0-8 11-20 11-20z" fill="#fafcfa"/><path d="M78 118q11-7 22 0t22 0M78 136q11-7 22 0t22 0M78 154q11-7 22 0t22 0" stroke="#f4ecd4" stroke-width="3" fill="none"/></svg>`;
      default:
        return `<svg ${v}><rect width="200" height="200" fill="#e9efe6"/><g transform="rotate(-6 100 100)"><rect x="28" y="52" width="144" height="100" rx="4" fill="#17332d" opacity=".15" transform="translate(4 5)"/><rect x="28" y="52" width="144" height="100" rx="4" fill="#fafcfa"/><clipPath id="pc"><rect x="36" y="60" width="88" height="84" rx="2"/></clipPath><g clip-path="url(#pc)"><rect x="36" y="60" width="88" height="84" fill="#dfe9e2"/><path d="M36 112l22-30 14 16 16-24 36 38v32H36z" fill="#2a5444"/><path d="M36 124q22-8 44 0t44 0V144H36z" fill="#64c8ce"/><path d="M36 124q22-8 44 0t44 0" stroke="#f4ecd4" stroke-width="2.5" fill="none"/></g><rect x="138" y="62" width="24" height="28" fill="none" stroke="#c9a04b" stroke-width="2" stroke-dasharray="3 2"/><path d="M134 112h28M134 124h28M134 136h20" stroke="#c4cfc9" stroke-width="2"/></g></svg>`;
    }
  };

  HL.dropArt = () => `<svg class="art" viewBox="0 0 92 112" aria-hidden="true"><path d="M46 6s34 36 34 62a34 34 0 0 1-68 0C12 42 46 6 46 6z" fill="#12666d"/><clipPath id="dc"><path d="M46 6s34 36 34 62a34 34 0 0 1-68 0C12 42 46 6 46 6z"/></clipPath><g clip-path="url(#dc)"><path d="M0 62q23-10 46 0t46 0V112H0z" fill="#4cc3c2"/><path d="M0 78q23-10 46 0t46 0V112H0z" fill="#9ee1d8"/><path d="M0 94q23-10 46 0t46 0V112H0z" fill="#f4ecd4"/><path d="M0 62q23-10 46 0t46 0M0 78q23-10 46 0t46 0" stroke="#f4ecd4" stroke-width="2.5" fill="none"/></g></svg>`;

  /* 印章：有 v1 手绘章（stations.js 的 stamp）就用图，未收下时由样式变灰；其余用代码画的圆章 */
  HL.stampArt = (st, got) => st.stamp
    ? `<img class="stamp-art${got ? '' : ' is-locked'}" src="${HL.esc(st.stamp)}" alt="" loading="lazy" decoding="async">`
    : got
    ? `<svg viewBox="0 0 62 62" aria-hidden="true"><circle cx="31" cy="31" r="28" fill="none" stroke="#c9a04b" stroke-width="2.5"/><circle cx="31" cy="31" r="24" fill="${st.tint}"/><path d="M15 27q8-6 16 0t16 0M15 35q8-6 16 0t16 0M17 43q7-5 14 0t14 0" stroke="#fafcfa" stroke-width="2.2" fill="none"/><circle cx="31" cy="31" r="24" fill="none" stroke="rgba(23,51,45,.35)" stroke-width="1"/></svg>`
    : `<svg viewBox="0 0 62 62" aria-hidden="true"><circle cx="31" cy="31" r="27" fill="none" stroke="rgba(23,51,45,.28)" stroke-width="1.6" stroke-dasharray="3 4"/><path d="M18 30q6.5-5 13 0t13 0M18 38q6.5-5 13 0t13 0" stroke="rgba(23,51,45,.16)" stroke-width="2" fill="none"/></svg>`;

  HL.rimSvg = () => `<svg class="rim" viewBox="0 0 400 26" preserveAspectRatio="none" aria-hidden="true"><path d="M0 26V14C60 4 120 20 200 12S330 2 400 12V26Z"/><path class="lip" d="M0 14C60 4 120 20 200 12S330 2 400 12" vector-effect="non-scaling-stroke"/></svg>`;
})();
