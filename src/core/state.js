/* 游客状态：当前页、当前站、路线取舍、打卡、收藏。
   全部存在本机 localStorage，不上传。改字段时同步更新 defaults() 和 sanitize()，
   并把 KEY 末尾的版本号加一，旧草稿就不会以错误的结构读进来。 */
(() => {
  'use strict';
  const { idx } = HL;

  const KEY = 'huanglong.v3.1';
  const PAGES = ['home', 'tour', 'services', 'mine'];
  const PANELS = ['station', 'fac', 'route', 'water'];
  const MAP_MODES = ['vector', 'satellite', 'schematic'];

  const defaults = () => ({
    page: 'home',                   // 底部导航当前页
    current: HL.data.stations[0].id, // 游览页当前站
    panel: 'station',               // 游览面板：station / fac / route
    fac: 'all',                     // 设施筛选
    facFocus: null,                 // 地图上高亮的设施
    mapMode: 'vector',              // 地图底图：vector 地图 / satellite 卫星 / schematic 示意图
    plan: { hours: 6, pace: '平衡', mode: '观光核心', cable: false }, // 游线规划的条件，见 features/planner.js
    water: { active: 'flow', chapters: null, badgeAt: null }, // 水滴四章进度，见 features/water.js（chapters 由 sanitize 补全）
    persona: 'huaxi',               // 数字人导游当前角色，见 data/guide.js
    off: [],                        // 只路过、不停留的站（地图上为空心点）
    visited: [],                    // 已打卡的站
    wish: [],                       // 想去的景点
    want: [],                       // 想要的文创
  });

  /* 水滴四章：交给 v1 的状态机校验（vendor/huanglong-water/follow-state.js）。
     解锁依据只有到站打卡 visited；没有依据的章节进度会被丢弃，这和 v1 的规则一致。 */
  function sanitizeWater(w, visited) {
    const src = w && typeof w === 'object' ? w : {};
    const stamps = Object.fromEntries(visited.map(id => [id, '2026-01-01T00:00:00.000Z']));
    const s = window.HuanglongJournal.restore(JSON.stringify({
      version: 5, stamps, chapters: src.chapters, activeChapter: src.active, chapterBadgeAt: src.badgeAt,
    }), HL.data.stations.map(x => x.id));
    return { active: s.activeChapter, chapters: s.chapters, badgeAt: s.chapterBadgeAt };
  }

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
    if (!MAP_MODES.includes(v.mapMode)) v.mapMode = 'vector';
    const p = v.plan && typeof v.plan === 'object' ? v.plan : {}, d = defaults().plan;
    const pick = (val, list, dflt) => (list.some(o => o[0] === val) ? val : dflt);
    v.plan = {
      hours: pick(p.hours, HL.PLAN.hours, d.hours), pace: pick(p.pace, HL.PLAN.pace, d.pace),
      mode: pick(p.mode, HL.PLAN.mode, d.mode), cable: p.cable === true,
    };
    v.water = sanitizeWater(v.water, v.visited);
    if (!(HL.data.guide && HL.data.guide.personas[v.persona])) v.persona = 'huaxi';
    return v;
  }

  function load() {
    try {
      const v = JSON.parse(localStorage.getItem(KEY));
      if (v && typeof v === 'object') return sanitize({ ...defaults(), ...v });
    } catch (e) { /* 存储不可用或内容损坏，用默认值 */ }
    return sanitize(defaults());
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
    reset(extra = {}) { replace(sanitize({ ...defaults(), ...extra })); HL.store.save(); },
  };
})();
