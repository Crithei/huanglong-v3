/* 声纹圆盘：把一段 10 秒录音的频谱画成一张唱片式的圆形标本（声景手册用，逻辑在 features/soundbank.js）。
   数据：T 个时间片 × F 个频段（100 Hz–10 kHz 对数分布），每格 0–35 编成一个 36 进制字符，整段是 T*F 个字符的字符串。
   画法：时间绕圆一圈（从顶上顺时针，外圈 10 个刻度是 10 秒），频率由内向外；按类别（水 / 风 / 鸟 / 静 / 人）换一套笔触和配色，
   再用「采集点 + 录音时间」算一个种子，决定起始角度、扭转、波纹频率，同一类的两张也不会一样。
   API：HL.soundDisc = { T, F, encode, decode, draw(canvas, spec, opts), url(spec, opts), live(canvas, opts), fromImage(dataURL) } */
(() => {
  'use strict';
  const T = 72, F = 32, FMIN = 100, FMAX = 10000;
  const SERIF = '"Noto Serif SC","Source Han Serif SC","Songti SC",serif';

  /* 各类的底色和由暗到亮的色阶 */
  const THEMES = {
    water: { bg: '#0c2a2d', stops: ['#123e42', '#1f7f86', '#57c3c0', '#c4efe7', '#ffffff'], ink: '#3aa7ad' },
    wind:  { bg: '#1b2416', stops: ['#2b3a21', '#5d7a3e', '#a2b86b', '#e3e7ae', '#fffbe0'], ink: '#7f9a5b' },
    bird:  { bg: '#2a1411', stops: ['#4a1e17', '#a33b26', '#e0773b', '#f6c26b', '#fff3d6'], ink: '#c4553a' },
    quiet: { bg: '#0f151c', stops: ['#1b2632', '#384e66', '#7b93ab', '#c8d5e1', '#ffffff'], ink: '#2a3b4a' },
    voice: { bg: '#231b11', stops: ['#3a2c19', '#7a6037', '#b8995d', '#e8d6a5', '#fffaf0'], ink: '#9a8558' },
  };
  const theme = k => THEMES[k] || THEMES.water;
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const pal = (th, v) => {
    const s = th.stops, x = Math.max(0, Math.min(.9999, v)) * (s.length - 1), i = Math.floor(x), f = x - i;
    const a = hex(s[i]), b = hex(s[i + 1]);
    return `rgb(${a.map((c, j) => Math.round(c + (b[j] - c) * f)).join(',')})`;
  };

  /* 种子随机数：同一段录音每次画出来都一样 */
  const hash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = seed => { let a = seed || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

  const encode = frames => frames.map(b => b.map(v => Math.round(Math.max(0, Math.min(1, v)) * 35).toString(36)).join('')).join('');
  const decode = s => Array.from({ length: T }, (_, t) => Array.from({ length: F }, (_, f) => parseInt(s[t * F + f] || '0', 36) / 35));
  /* 频段 f 的边界频率（对数分布） */
  const edge = i => FMIN * (FMAX / FMIN) ** (i / F);

  /* 几何：S 是画布边长 */
  function geo(S, seed) {
    const r = rng(seed);
    return { S, c: S / 2, rim: S / 2 - 2, txt: S / 2 - S * .035, R: S / 2 - S * .075, r0: S * .13,
      a0: r() * Math.PI * 2, twist: .7 + r() * .9, ripple: 4 + Math.floor(r() * 5), phase: r() * 6.28, rnd: r };
  }
  const rad = (G, f) => G.r0 + (f + .5) * (G.R - G.r0) / F;

  /* 一个时间片的笔触 */
  function frame(g, G, kind, t, b) {
    const th = theme(kind), da = Math.PI * 2 / T, a = G.a0 - Math.PI / 2 + t * da, w = (G.R - G.r0) / F, c = G.c;
    g.lineCap = 'butt';
    if (kind === 'wind') {
      /* 错位留空：每格只画三分之一，连起来是一条条往外甩的螺旋拖尾 */
      for (let f = 0; f < F; f++) { const v = b[f]; if (v < .05 || (t + f) % 3) continue;
        const aa = a + G.twist * f / F; g.lineCap = 'round'; g.globalAlpha = .3 + .7 * v; g.strokeStyle = pal(th, .2 + v * .8); g.lineWidth = w * (.35 + .5 * v);
        g.beginPath(); g.arc(c, c, rad(G, f), aa, aa + da * (1.2 + 2.4 * v)); g.stroke(); }
    } else if (kind === 'bird') {
      /* 花瓣：每个时间片一片半透明花瓣。花瓣长短看这一片最响有多响、声音偏高还是偏低，胖瘦看整体响度；
         叠起来是一朵花，声音起伏大就开得参差，声音均匀就是一朵规整的菊花 */
      const am = a + da / 2;
      let e = 0, cf = 0; for (let f = 0; f < F; f++) { e += b[f]; cf += b[f] * f; }
      const mean = e / F, cen = e ? cf / e : F / 2, top = Math.max(...b);
      const L = G.r0 + (G.R - G.r0) * Math.min(1, .25 + .55 * top + .35 * cen / F), wid = da * (1.6 + 2.4 * mean);
      const at = (ang, r) => [c + Math.cos(ang) * r, c + Math.sin(ang) * r], rm = G.r0 + (L - G.r0) * .6;
      const grd = g.createLinearGradient(...at(am, G.r0), ...at(am, L));
      grd.addColorStop(0, pal(th, .18)); grd.addColorStop(.55, pal(th, .5 + .2 * top)); grd.addColorStop(1, pal(th, .75 + .25 * top));
      g.globalAlpha = .2 + .3 * top; g.fillStyle = grd;
      g.beginPath(); g.moveTo(...at(am, G.r0));
      g.quadraticCurveTo(...at(am + wid, rm), ...at(am, L)); g.quadraticCurveTo(...at(am - wid, rm), ...at(am, G.r0)); g.fill();
      g.globalAlpha = .35 + .35 * top; g.strokeStyle = pal(th, .88); g.lineWidth = G.S * .0025; g.stroke();
    } else if (kind === 'quiet') {
      const r = rng(hash(G.a0 + ':' + t));
      for (let f = 0; f < F; f++) { const v = b[f]; if (r() > v * 1.6 + .02) continue;
        const am = a + r() * da, rr = rad(G, f) + (r() - .5) * w; g.globalAlpha = .4 + .6 * v; g.fillStyle = pal(th, .45 + v * .55);
        g.beginPath(); g.arc(c + Math.cos(am) * rr, c + Math.sin(am) * rr, G.S * (.002 + .005 * v), 0, 7); g.fill(); }
    } else if (kind === 'voice') {
      for (let f = 0; f < F; f++) { const v = b[f] * (f < F / 2 ? 1 : .6); if (v < .05) continue;
        g.globalAlpha = .2 + .75 * v; g.strokeStyle = pal(th, v); g.lineWidth = w * (f < F / 2 ? 1.1 : .5);
        g.beginPath(); g.arc(c, c, rad(G, f), a, a + da * 1.04); g.stroke(); }
    } else { /* water：同心环，半径随角度轻轻起伏，像水波 */
      for (let f = 0; f < F; f++) { const v = b[f]; if (v < .04) continue;
        const rp = Math.sin(a * G.ripple + G.phase + f * .45) * w * .35;
        g.globalAlpha = .22 + .78 * v; g.strokeStyle = pal(th, v); g.lineWidth = w * .92;
        g.beginPath(); g.arc(c, c, rad(G, f) + rp, a, a + da * 1.03); g.stroke(); }
    }
    g.globalAlpha = 1;
  }

  /* 底盘：底色、唱片纹、秒刻度、起点 */
  function base(g, G, kind) {
    const th = theme(kind), c = G.c, S = G.S;
    g.clearRect(0, 0, S, S);
    const bg = g.createRadialGradient(c, c * .8, S * .05, c, c, G.rim);
    bg.addColorStop(0, th.bg); bg.addColorStop(1, '#050807');
    g.fillStyle = bg; g.beginPath(); g.arc(c, c, G.rim, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.045)'; g.lineWidth = 1;
    for (let r = G.r0 + 3; r < G.R; r += S * .012) { g.beginPath(); g.arc(c, c, r, 0, 7); g.stroke(); }
    if (kind === 'quiet') { g.strokeStyle = 'rgba(200,214,226,.12)'; for (let i = 1; i <= 4; i++) { g.beginPath(); g.arc(c, c, G.r0 + (G.R - G.r0) * i / 4, 0, 7); g.stroke(); } }
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = S * .004;
    for (let i = 0; i < 10; i++) { const a = G.a0 - Math.PI / 2 + i * Math.PI / 5, r1 = G.R + S * .008, r2 = G.R + S * (i ? .02 : .03);
      g.beginPath(); g.moveTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1); g.lineTo(c + Math.cos(a) * r2, c + Math.sin(a) * r2); g.stroke(); }
    g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; g.beginPath(); g.arc(c, c, G.rim - .5, 0, 7); g.stroke();
  }

  /* 圆心是唱片纸标（不写字，只有类别色的细环和中心孔），外圈环绕文字 */
  function label(g, G, kind, text) {
    const th = theme(kind), c = G.c, S = G.S;
    g.fillStyle = '#f4ecd8'; g.beginPath(); g.arc(c, c, G.r0 * .86, 0, 7); g.fill();
    g.strokeStyle = th.ink; g.lineWidth = S * .006; g.beginPath(); g.arc(c, c, G.r0 * .72, 0, 7); g.stroke();
    g.lineWidth = S * .003; g.beginPath(); g.arc(c, c, G.r0 * .5, 0, 7); g.stroke();
    g.fillStyle = '#1a1712'; g.beginPath(); g.arc(c, c, G.r0 * .13, 0, 7); g.fill();
    if (!text) return;
    g.font = `500 ${S * .032}px ${SERIF}`; g.fillStyle = 'rgba(255,248,230,.72)'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const r = G.txt, chars = [...text], ws = chars.map(ch => g.measureText(ch).width + S * .006), tot = ws.reduce((x, y) => x + y, 0);
    let a = -Math.PI / 2 - tot / r / 2;
    chars.forEach((ch, i) => { const am = a + ws[i] / 2 / r; g.save(); g.translate(c + Math.cos(am) * r, c + Math.sin(am) * r); g.rotate(am + Math.PI / 2); g.fillText(ch, 0, 0); g.restore(); a += ws[i] / r; });
  }

  /* opts: { kind, seed, text, size } */
  function draw(cv, spec, o) {
    const S = cv.width = cv.height = o.size || 360, g = cv.getContext('2d'), G = geo(S, hash(o.seed));
    base(g, G, o.kind);
    /* 自动增益：按这一段最响的 2% 归一，安静的录音也看得出纹理 */
    const fr = decode(spec), all = fr.flat().sort((x, y) => x - y), gain = 1 / Math.max(.3, all[Math.floor(all.length * .98)] || 1);
    fr.forEach((b, t) => frame(g, G, o.kind, t, b.map(v => Math.min(1, v * gain))));
    label(g, G, o.kind, o.text);
    return cv;
  }
  const cache = new Map();
  function url(spec, o) {
    const key = [o.kind, o.seed, o.text, o.size, spec].join('|');
    if (!cache.has(key)) {
      const cv = draw(document.createElement('canvas'), spec, o);
      let u = cv.toDataURL('image/webp', .86); if (!u.startsWith('data:image/webp')) u = cv.toDataURL('image/png');
      if (cache.size > 40) cache.delete(cache.keys().next().value);
      cache.set(key, u);
    }
    return cache.get(key);
  }

  /* 录音时边录边画：push(i, bands) 画第 i 个时间片 */
  function live(cv, o) {
    const S = cv.width = cv.height = o.size || 360, g = cv.getContext('2d'), G = geo(S, hash(o.seed));
    const reset = () => { base(g, G, o.kind); label(g, G, o.kind, o.text); };
    reset();
    return { reset, push: (t, b) => { frame(g, G, o.kind, t, b); label(g, G, o.kind, ''); }, a0: G.a0 };
  }

  /* 旧版存的是 360×100 的矩形声纹图（横轴时间，纵轴 0–10 kHz 线性），读像素换算成数据 */
  function fromImage(src) {
    return new Promise(ok => {
      const im = new Image();
      im.onload = () => {
        const W = 360, H = 100, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
        const g = cv.getContext('2d'); g.drawImage(im, 0, 0, W, H);
        const px = g.getImageData(0, 0, W, H).data, frames = [];
        for (let t = 0; t < T; t++) {
          const x = Math.min(W - 1, Math.round((t + .5) / T * W)), b = [];
          for (let f = 0; f < F; f++) {
            const hz = Math.sqrt(edge(f) * edge(f + 1)), y = Math.max(0, Math.min(H - 1, Math.round((1 - hz / FMAX) * H)));
            const r = px[(y * W + x) * 4]; b.push(Math.max(0, Math.min(1, (r - 25) / 225)));
          }
          frames.push(b);
        }
        ok(encode(frames));
      };
      im.onerror = () => ok(null);
      im.src = src;
    });
  }

  HL.soundDisc = { T, F, edge, encode, decode, draw, url, live, fromImage };
})();
