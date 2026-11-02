/* 游客状态：当前页、当前站、路线取舍、打卡、收藏。
   全部存在本机 localStorage，不上传。改字段时同步更新 defaults() 和 sanitize()，
   并把 KEY 末尾的版本号加一，旧草稿就不会以错误的结构读进来。 */
(() => {
  'use strict';
  const { idx } = HL;

  const KEY = 'huanglong.v3.1';
  const PAGES = ['home', 'tour', 'services', 'mine'];
  const PANELS = ['station', 'fac', 'route'];

  const defaults = () => ({
    page: 'home',                   // 底部导航当前页
    current: HL.data.stations[0].id, // 游览页当前站
    panel: 'station',               // 游览面板：station / fac / route
    fac: 'all',                     // 设施筛选
    facFocus: null,                 // 地图上高亮的设施
    off: [],                        // 移出路线的站
    visited: [],                    // 已打卡的站
    wish: [],                       // 想去的景点
    want: [],                       // 想要的文创
  });

  /* 读进来的数据可能来自旧版本或被手改过，逐项校正。 */
  function sanitize(v) {
    const ids = (a, table) => (Array.isArray(a) ? a : []).filter(id => table[id]);
    v.off = ids(v.off, idx.station); v.visited = ids(v.visited, idx.station); v.wish = ids(v.wish, idx.station);
    v.want = ids(v.want, idx.product);
    if (!PAGES.includes(v.page)) v.page = 'home';
    if (!idx.station[v.current]) v.current = HL.data.stations[0].id;
    if (!PANELS.includes(v.panel)) v.panel = 'station';
    if (!HL.FAC_TYPES.some(t => t[0] === v.fac)) v.fac = 'all';
    if (!idx.facility[v.facFocus]) v.facFocus = null;
    return v;
  }

  function load() {
    try {
      const v = JSON.parse(localStorage.getItem(KEY));
      if (v && typeof v === 'object') return sanitize({ ...defaults(), ...v });
    } catch (e) { /* 存储不可用或内容损坏，用默认值 */ }
    return defaults();
  }

  /* HL.S 始终是同一个对象，各模块可以放心地 const S = HL.S。 */
  const S = HL.S = load();
  let storageOk = true;

  const replace = v => { Object.keys(S).forEach(k => delete S[k]); Object.assign(S, v); };

  HL.PAGES = PAGES;
  HL.store = {
    save() {
      try { localStorage.setItem(KEY, JSON.stringify(S)); }
      catch (e) {
        if (storageOk) { storageOk = false; HL.toast('浏览器没有开放本机存储，关闭页面后记录会丢失'); }
      }
    },
    /* 撤销用：先 snapshot()，出错或用户点撤销时 restore(快照)。 */
    snapshot: () => JSON.parse(JSON.stringify(S)),
    restore(snap) { replace(sanitize(snap)); HL.store.save(); HL.renderAll(); },
    reset(extra = {}) { replace({ ...defaults(), ...extra }); HL.store.save(); },
  };
})();
