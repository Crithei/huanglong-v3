/* 游客状态：当前页、当前站、路线取舍、打卡、收藏。
   全部存在本机 localStorage，不上传。改字段时同步更新 defaults() 和 sanitize()，
   并把 KEY 末尾的版本号加一，旧草稿就不会以错误的结构读进来。 */
(() => {
  'use strict';
  const { idx } = HL;

  /* 地址带 ?demo 时（汇报页 present/ 里嵌入的就是这种）用单独的演示存档，不碰游客自己的进度 */
  const KEY = new URLSearchParams(location.search).has('demo') ? 'huanglong.v3.demo' : 'huanglong.v3.1';
  const PAGES = ['home', 'tour', 'play', 'services']; // 底栏四页：首页 / 游览 / 互动 / 服务
  const PANELS = ['station', 'fac', 'route'];
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
    lab: null,                      // 彩池实验室：池群状态、对照起点、观察卡、发现与贴纸，见 features/lab.js（由 sanitize 补全）
    off: [],                        // 只路过、不停留的站（地图上为空心点）
    visited: [],                    // 已打卡的站
    wish: [],                       // 想去的景点
    want: [],                       // 想要的文创
    seen: [],                       // 已点亮的生灵徽章（到站后找到观察线索），见 data/badges.js 的 species
    sound: null,                    // 听见黄龙：声音驿站收集、认声纹、安静挑战、记录、手册翻到第几页，见 features/sound.js（由 sanitize 补全）
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

  /* 彩池实验室：池群状态交给 v1 模型校验（vendor/huanglong-pool/pool-lab-state.js），恢复后一律暂停。 */
  const LAB_GOALS = ['connected', 'low-water', 'rim-grown'];
  function sanitizeLab(l) {
    const M = window.HuanglongPoolModel, src = l && typeof l === 'object' ? l : {};
    const pool = n => (Number.isInteger(n) && n >= 0 && n < 4 ? n : 3);
    const world = M.restore(src.world); world.running = false;
    const baseline = src.baseline ? M.restore(src.baseline) : M.snapshot(world); baseline.running = false;
    const records = (Array.isArray(src.records) ? src.records : []).filter(r => r && r.world && r.world.version === 1)
      .slice(-6).map(r => ({ world: Object.assign(M.restore(r.world), { running: false }), selected: pool(r.selected) }));
    const found = LAB_GOALS.filter(g => Array.isArray(src.found) && src.found.includes(g));
    const stickerAt = found.length === 3 && typeof src.stickerAt === 'string' ? src.stickerAt : null;
    return { world, baseline, records, selected: pool(src.selected), speed: [1, 3, 6].includes(src.speed) ? src.speed : 3, found, stickerAt };
  }

  /* 读进来的数据可能来自旧版本或被手改过，逐项校正。 */
  function sanitize(v) {
    const ids = (a, table) => (Array.isArray(a) ? a : []).filter(id => table[id]);
    v.off = ids(v.off, idx.station); v.visited = ids(v.visited, idx.station); v.wish = ids(v.wish, idx.station);
    v.want = ids(v.want, idx.product);
    /* 生灵徽章要先到对应站打卡；撤回打卡后，那一站的线索也一起作废 */
    const sp = Object.fromEntries(((HL.data.badges && HL.data.badges.species) || []).map(x => [x.id, x]));
    v.seen = [...new Set(Array.isArray(v.seen) ? v.seen : [])].filter(id => sp[id] && sp[id].stations.some(s => v.visited.includes(s)));
    delete v.species; // 旧版「问导游解锁」的记录，规则已改，不再沿用
    if (v.page === 'mine') v.page = 'play'; // 旧版的「我的」页已拆成互动和服务
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
    v.lab = sanitizeLab(v.lab);
    /* 听见黄龙：只保留 data/birds.js 里有的驿站 */
    const so = v.sound && typeof v.sound === 'object' ? v.sound : {};
    const stops = new Set(((HL.data.birds && HL.data.birds.stops) || []).map(s => s.id));
    const keep = (o, ok) => Object.fromEntries(Object.entries(o && typeof o === 'object' ? o : {}).filter(([k, x]) => stops.has(k) && ok(x)));
    const got = keep(so.got, x => typeof x === 'string');
    v.sound = {
      got,
      quiz: keep(so.quiz, x => x === true && true),
      quiet: keep(so.quiet, x => typeof x === 'string'),
      note: keep(so.note, x => typeof x === 'string' && x.length <= 60),
      page: Number.isInteger(so.page) && so.page >= 0 ? so.page : 0,
    };
    ['quiz', 'quiet', 'note'].forEach(k => { for (const id of Object.keys(v.sound[k])) if (!got[id]) delete v.sound[k][id]; }); // 没收集的站不能有后面几枚章
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
