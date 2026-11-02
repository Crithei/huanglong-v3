/* 游览页上半部分的地图。对外只有 HL.renderMap() 与 HL.ping(loc)，面板不用管用的是哪种地图。

   #map 里有三层：
     .map-real       腾讯地图（src/pages/tour-map-tencent.js，即 HL.realMap），配置了 Key 才会出现
     .map-schematic  内置 SVG 示意图：没有 Key、断网、浏览器不支持 WebGL，或用户选了「示意」时显示
     .map-tools      右上角的「地图 / 卫星 / 示意」切换
   示意图不是真实底图：横轴大致按纬度展开、并按游线顺序拉开密集段，纵轴按经度。 */
(() => {
  'use strict';
  const { $, esc, S, data: D } = HL;
  const ST = D.stations, FAC = D.facilities;
  const MODES = [['vector', '地图'], ['satellite', '卫星'], ['schematic', '示意']];

  /* 把 [经度, 纬度] 归一化到 0–1 平面。传站序号 i 时用路线等距化后的位置。 */
  const GEO = (() => {
    const pts = [...ST.map(s => s.loc), ...FAC.map(f => f.loc)];
    const latMax = Math.max(...pts.map(p => p[1]));
    const lonMax = Math.max(...pts.map(p => p[0]));
    const lonMin = Math.min(...pts.map(p => p[0]));
    const gx = loc => (latMax - loc[1]) * HL.M_LAT;
    // Stations are spaced partly by route order so dense stretches stay readable.
    const knots = [];
    ST.forEach((s, i) => knots.push(Math.max(gx(s.loc), i ? knots[i - 1] + 5 : -Infinity)));
    const g0 = knots[0], g1 = knots[knots.length - 1], n = knots.length - 1;
    const sx = knots.map((g, i) => .35 * (g - g0) / (g1 - g0) + .65 * i / n);
    const warp = g => {
      if (g <= g0) return (g - g0) / (g1 - g0) * .55;
      if (g >= g1) return 1 + (g - g1) / (g1 - g0);
      let i = 0; while (g > knots[i + 1]) i++;
      const t = (g - knots[i]) / (knots[i + 1] - knots[i]);
      return sx[i] + t * (sx[i + 1] - sx[i]);
    };
    const xs = pts.map(p => warp(gx(p)));
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    return {
      norm(loc, i) {
        const x = i == null ? warp(gx(loc)) : sx[i];
        return [(x - xMin) / (xMax - xMin), (lonMax - loc[0]) / (lonMax - lonMin)];
      },
    };
  })();

  function smooth(p) {
    let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
      d += ` C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)} ${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)} ${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`;
    }
    return d;
  }

  let mapProj = null;
  function drawSchematic(el) {
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    const padL = 26, padR = 30, padT = 58, padB = 46;
    const P = (loc, i) => { const [x, y] = GEO.norm(loc, i); return [padL + x * (w - padL - padR), padT + y * (h - padT - padB)]; };
    mapProj = P;
    const pts = ST.map((s, i) => P(s.loc, i));
    const trail = smooth(pts);
    const r = HL.seeded('contours');
    let contours = '';
    for (const off of [-150, -112, -76, -42, 46, 82, 118, 156, 196]) {
      contours += `<path class="contour" d="${smooth(pts.map(([x, y], i) => [x, y + off + Math.sin(i * 1.3 + off) * 7 + (r() - .5) * 6]).filter((_, i) => i % 2 === 0 || i === pts.length - 1))}"/>`;
    }
    const facMode = S.panel === 'fac';
    let facs = '';
    if (facMode) {
      FAC.filter(f => S.fac === 'all' || f.type === S.fac).forEach(f => {
        const [x, y] = P(f.loc);
        const focus = f.id === S.facFocus;
        const sz = focus ? 15 : 10;
        facs += `<g class="fac fac-${f.type}${focus ? ' is-focus' : ''}" role="button" tabindex="0" data-act="fac" data-id="${f.id}" aria-label="${esc(f.name)}，${HL.FAC_LABEL[f.type]}">
          <rect class="hit" x="${x - 12}" y="${y - 12}" width="24" height="24" fill="transparent"/>
          <rect x="${x - sz / 2}" y="${y - sz / 2}" width="${sz}" height="${sz}" rx="3" fill="var(--fc)"/>
          ${focus ? `<text class="lbl" x="${Math.min(Math.max(x, 60), w - 60)}" y="${y - 14}" text-anchor="middle">${esc(f.name)}</text>` : ''}</g>`;
      });
    }
    let stations = '';
    ST.forEach((s, i) => {
      const [x, y] = pts[i];
      const cur = s.id === S.current;
      const cls = ['st', cur ? 'is-current' : '', S.off.includes(s.id) ? 'is-off' : '', facMode && !cur ? 'is-dim' : ''].join(' ');
      stations += `<g class="${cls}" role="button" tabindex="0" data-act="select" data-id="${s.id}" aria-label="第 ${i + 1} 站 ${esc(s.name)}${cur ? '，当前' : ''}">
        <circle cx="${x}" cy="${y}" r="13" fill="transparent"/>
        <circle class="ring" cx="${x}" cy="${y}" r="11.5"/>
        <circle class="dot" cx="${x}" cy="${y}" r="${cur ? 7 : 5.5}" fill="${s.tint}"/>
        ${S.visited.includes(s.id) ? `<circle cx="${x}" cy="${y}" r="2.2" fill="#17332d"/>` : ''}</g>`;
    });
    const labels = [];
    const cur = HL.indexOf(S.current);
    const lx = x => Math.min(Math.max(x, 44), w - 44);
    labels.push(`<text class="lbl is-current" x="${lx(pts[cur][0])}" y="${pts[cur][1] - 19}" text-anchor="middle">${esc(ST[cur].name)}</text>`);
    if (!facMode) {
      [0, ST.length - 1].filter(i => i !== cur && Math.abs(i - cur) > 1).forEach(i => {
        labels.push(`<text class="lbl" x="${lx(pts[i][0])}" y="${pts[i][1] + 24}" text-anchor="middle">${esc(ST[i].name)}</text>`);
      });
    }
    el.innerHTML = `
      <svg viewBox="0 0 ${w} ${h}" role="group" aria-label="黄龙沟示意图，${ST.length} 处停留">
        ${contours}
        <path d="${trail}" fill="none" stroke="#e8f3ed" stroke-width="40" stroke-linecap="round" opacity=".85"/>
        <path class="trail" d="${trail}"/><path class="trail-core" d="${trail}"/>
        ${facs}${stations}${labels.join('')}
        <g id="ping-layer"></g>
      </svg>
      <div class="north" aria-hidden="true"><svg class="i" viewBox="0 0 24 24"><path d="M19 12H5M10 7l-5 5 5 5"/></svg>北<span>示意图</span></div>`;
  }

  /* 真实地图可用（或正在加载）且用户没选「示意」时用真实地图。 */
  const realWanted = () => HL.realMap && HL.realMap.status !== 'failed' && S.mapMode !== 'schematic';
  const realShown = () => realWanted() && HL.realMap.status === 'ready';

  function drawTools(el) {
    const rm = HL.realMap;
    if (!rm || rm.status === 'failed') {
      el.innerHTML = rm && rm.reason !== 'nokey' ? `<span class="map-note">${esc(rm.message)}，显示示意图</span>` : '';
      return;
    }
    el.innerHTML = `<div class="map-mode" role="radiogroup" aria-label="地图显示方式">${MODES.map(([m, t]) =>
      `<button type="button" role="radio" aria-checked="${S.mapMode === m}" data-act="map-mode" data-mode="${m}">${t}</button>`).join('')}</div>`;
  }

  HL.renderMap = () => {
    const el = $('#map');
    if (!el.clientWidth || !el.clientHeight) return;
    if (!el.querySelector('.map-schematic')) {
      el.innerHTML = '<div class="map-real" hidden></div><div class="map-schematic"></div><div class="map-tools"></div>';
    }
    const real = el.querySelector('.map-real'), sch = el.querySelector('.map-schematic');
    /* 先切换显隐再画：腾讯地图要在容器可见、有尺寸时创建 */
    real.hidden = !realShown();
    sch.hidden = realShown();
    if (realWanted()) HL.realMap.render(real);
    if (!sch.hidden) drawSchematic(sch);
    drawTools(el.querySelector('.map-tools'));
  };

  /* 在地图上提示「在这里」：真实地图平移过去，示意图闪一下。 */
  HL.ping = loc => {
    if (realShown()) { HL.realMap.ping(loc); return; }
    if (!mapProj || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const i = ST.findIndex(s => s.loc === loc);
    const [x, y] = mapProj(loc, i < 0 ? undefined : i);
    const layer = $('#ping-layer');
    if (layer) layer.innerHTML = `<circle class="ping" cx="${x}" cy="${y}" r="9"/>`;
  };

  HL.act('map-mode', el => {
    S.mapMode = el.dataset.mode; HL.store.save();
    if (HL.realMap) HL.realMap.setMode(S.mapMode);
    HL.renderMap();
  });

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (S.page === 'tour') HL.renderMap(); }, 120); });
})();
