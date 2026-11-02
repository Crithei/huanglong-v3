/* 游览页的腾讯地图（JavaScript API GL，命名空间 TMap）。
   由 tour-map.js 调用，对外是 HL.realMap = { status, reason, message, render(el), ping(loc), setMode(mode) }。

   加载顺序：src/config.local.js（本机 Key，不进仓库）→ map.qq.com/api/gljs → 创建地图。
   任何一步失败都把 status 置为 'failed'，tour-map.js 会退回内置示意图。

   画在地图上的东西：
     - 景点：按游线顺序编号的圆点，当前站带深色外圈，移出路线的站为空心，打过卡的有中心点；
     - 游线：按站序连起来的金色虚线，只是示意，不是实际栈道走向；
     - 设施：只在「沿途设施」面板显示，颜色与列表一致；
     - 文字：当前站名、选中的设施名。
   坐标统一用数据里的 [经度, 纬度]（GCJ-02，与腾讯地图一致），不需要转换。 */
(() => {
  'use strict';
  const { S, data: D } = HL;
  const ST = D.stations, FAC = D.facilities;
  const LOAD_TIMEOUT = 12000;
  const C = { ink: '#17332d', deep: '#12666d', gold: '#c9a04b', off: '#8aa59c' };
  /* 与 styles/base.css 的 .fac-* 保持一致 */
  const FAC_COLOR = { toilet: '#3c8fa0', supply: '#b98a2f', medical: '#c0584a', transit: '#5d6fa8', visitor: '#2f7d5b' };

  const rm = HL.realMap = { status: 'idle', reason: '', message: '', render, ping, setMode };
  let map = null, box = null, layer = {}, styles = {}, fitted = false;

  const ll = loc => new TMap.LatLng(loc[1], loc[0]);
  const baseMapOf = mode => ({ type: mode === 'satellite' ? 'satellite' : 'vector' });
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fail(reason, message) {
    Object.assign(rm, { status: 'failed', reason, message });
    console.warn(`[HL] 腾讯地图未启用：${message}`);
    if (S.page === 'tour') HL.renderMap();
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function hasWebGL() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  async function load() {
    rm.status = 'loading';
    await loadScript('src/config.local.js').catch(() => { /* 没有本机配置就是没有 Key */ });
    const key = String(HL.config.tmapKey || '').trim();
    if (!key) return fail('nokey', '未配置地图 Key');
    if (!hasWebGL()) return fail('webgl', '浏览器不支持 WebGL');
    const ok = await new Promise(resolve => {
      const timer = setTimeout(() => resolve(false), LOAD_TIMEOUT);
      /* JSAPI 用全局回调通知加载完成，这是本项目唯一的额外全局名 */
      window.__hlTmapReady = () => { clearTimeout(timer); resolve(true); };
      loadScript(`https://map.qq.com/api/gljs?v=1.exp&key=${encodeURIComponent(key)}&callback=__hlTmapReady`)
        .catch(() => { clearTimeout(timer); resolve(false); });
    });
    if (!ok || !window.TMap) return fail('network', '地图加载失败');
    rm.status = 'ready';
    if (S.page === 'tour') HL.renderMap();
  }

  /* ---------- 标记图片：用 SVG 生成，按需登记样式 ---------- */
  const svgSrc = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

  function stationIcon(s, i, st) {
    const cur = st.cur, off = st.off;
    const r = cur ? 9 : 7;
    const ring = cur ? `<circle cx="18" cy="18" r="15" fill="none" stroke="${C.deep}" stroke-width="3"/>` : '';
    const dot = off
      ? `<circle cx="18" cy="18" r="${r}" fill="#fff" stroke="${C.off}" stroke-width="2" stroke-dasharray="3 2"/>`
      : `<circle cx="18" cy="18" r="${r}" fill="${s.tint}" stroke="#fff" stroke-width="2.5"/>`;
    const visit = st.visited ? `<circle cx="18" cy="18" r="2.6" fill="${C.ink}"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" opacity="${st.dim ? .4 : 1}">${ring}${dot}${visit}</svg>`;
  }

  function facIcon(type, focus) {
    const n = focus ? 18 : 13, o = (24 - n) / 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect x="${o}" y="${o}" width="${n}" height="${n}" rx="3.5" fill="${FAC_COLOR[type]}" stroke="${focus ? C.ink : '#fff'}" stroke-width="${focus ? 2.5 : 1.6}"/></svg>`;
  }

  function useStyle(id, make, size) {
    if (!styles[id]) {
      styles[id] = new TMap.MarkerStyle({ width: size, height: size, anchor: { x: size / 2, y: size / 2 }, src: svgSrc(make()) });
      layer.points.setStyles(styles);
    }
    return id;
  }

  /* ---------- 创建与更新 ---------- */
  function stationBounds() {
    const lats = ST.map(s => s.loc[1]), lons = ST.map(s => s.loc[0]);
    return new TMap.LatLngBounds(
      new TMap.LatLng(Math.min(...lats), Math.min(...lons)),
      new TMap.LatLng(Math.max(...lats), Math.max(...lons)));
  }

  function fit(ease) {
    map.fitBounds(stationBounds(), { padding: { top: 84, bottom: 52, left: 40, right: 40 }, ...(ease && !reduced() ? { ease: { duration: 400 } } : {}) });
  }

  function create(el) {
    if (map) map.destroy();
    box = el; styles = {}; fitted = false;
    const b = stationBounds();
    map = new TMap.Map(el, {
      center: b.getCenter(), zoom: 14, minZoom: 11, maxZoom: 19,
      viewMode: '2D', baseMap: baseMapOf(S.mapMode),
    });
    const ID = TMap.constants.DEFAULT_CONTROL_ID;
    [ID.ZOOM, ID.ROTATION].forEach(id => { if (map.getControl(id)) map.removeControl(id); });

    layer.trail = new TMap.MultiPolyline({
      map,
      styles: { trail: new TMap.PolylineStyle({ color: C.gold, width: 3, borderWidth: 2, borderColor: 'rgba(255,255,255,.9)', lineCap: 'round', dashArray: [6, 5] }) },
      geometries: [{ id: 'trail', styleId: 'trail', paths: ST.map(s => ll(s.loc)) }],
    });
    layer.points = new TMap.MultiMarker({ map, styles: {}, geometries: [] });
    layer.labels = new TMap.MultiLabel({
      map,
      styles: {
        station: new TMap.LabelStyle({ color: C.ink, size: 14, offset: { x: 0, y: -24 }, strokeColor: 'rgba(250,252,250,.95)', strokeWidth: 3 }),
        fac: new TMap.LabelStyle({ color: C.ink, size: 12, offset: { x: 0, y: -18 }, strokeColor: 'rgba(250,252,250,.95)', strokeWidth: 3 }),
      },
      geometries: [],
    });
    layer.points.on('click', e => {
      const p = e && e.geometry && e.geometry.properties;
      if (!p) return;
      if (p.kind === 'station') HL.selectStation(p.id);
      else HL.focusFacility(p.id);
    });
  }

  function update() {
    const facMode = S.panel === 'fac';
    const pts = ST.map((s, i) => {
      const st = { cur: s.id === S.current, off: S.off.includes(s.id), visited: S.visited.includes(s.id) };
      st.dim = facMode && !st.cur;
      const sid = useStyle(`st-${s.id}-${+st.cur}${+st.off}${+st.visited}${+st.dim}`, () => stationIcon(s, i, st), 36);
      return { id: 'st-' + s.id, styleId: sid, position: ll(s.loc), rank: st.cur ? 100 : 50 - i, properties: { kind: 'station', id: s.id } };
    });
    if (facMode) {
      FAC.filter(f => S.fac === 'all' || f.type === S.fac).forEach(f => {
        const focus = f.id === S.facFocus;
        pts.push({ id: 'fac-' + f.id, styleId: useStyle(`fac-${f.type}-${+focus}`, () => facIcon(f.type, focus), 24),
          position: ll(f.loc), rank: focus ? 90 : 10, properties: { kind: 'fac', id: f.id } });
      });
    }
    layer.points.setGeometries(pts);

    const cur = ST.find(s => s.id === S.current);
    const labels = [{ id: 'cur', styleId: 'station', position: ll(cur.loc), content: cur.name }];
    const ff = facMode && FAC.find(f => f.id === S.facFocus);
    if (ff) labels.push({ id: 'fac', styleId: 'fac', position: ll(ff.loc), content: ff.name });
    layer.labels.setGeometries(labels);

    if (!fitted) { fit(false); fitted = true; }
  }

  function render(el) {
    if (rm.status === 'idle') { load(); return; }
    if (rm.status !== 'ready') return;
    if (!map || box !== el) create(el);
    update();
  }

  function ping(loc) {
    if (!map) return;
    const status = { center: ll(loc), zoom: Math.max(map.getZoom(), 15) };
    if (reduced()) { map.setCenter(status.center); map.setZoom(status.zoom); }
    else map.easeTo(status, { duration: 500 });
  }

  function setMode(mode) {
    if (map && mode !== 'schematic') map.setBaseMap(baseMapOf(mode));
  }
})();
