/* 游线规划：按可用时间、节奏、偏好、是否坐索道，决定 14 站里哪些「停下细看」、哪些「路过看一眼」。
   黄龙是一条主栈道，14 站都会经过，所以放不下的站不是删掉，而是改成路过（S.off）。
   规则改自 v1（huanglong-poi-route-prototype/app.js 的 buildPlan），是原型估算，不是实测：
     - 时间预算 = 可用小时 × 60 − 25 分钟返程缓冲，再按节奏加减；
     - 细看一站 = 建议停留 × 节奏系数；路过一站约 3 分钟。
       （v1 每站另加体力 × 4 分钟和站间 9 分钟，套到 14 站会多算三个多小时，而步行已单独计入，所以去掉；
       体力通过节奏系数和优先级体现。）
     - 步行：入沟到五彩池一程约 128 分钟（坐索道上行约 93 分钟）；
     - 超出预算时，从「优先级最低」的站开始改成路过，已打卡的站不动。优先级 = rank 按节奏和偏好调整。
   v1 只给游客挑出的几个点排序，直接套用到 14 站会只剩两三站，所以改成了细看 / 路过。
   对外：HL.plan(prefs, visited) 只计算不改状态；HL.PLAN 是界面用的选项。
   数字人和按钮都可以调用它，应用结果统一走 tour.js 的 plan-apply（需用户确认、可撤销）。 */
(() => {
  'use strict';
  const ST = HL.data.stations;

  HL.PLAN = {
    hours: [[4.5, '4.5 小时'], [6, '6 小时'], [8, '8 小时']],
    pace: [['轻松', '轻松'], ['平衡', '平衡'], ['深度', '深度']],
    mode: [['观光核心', '观光核心'], ['科普研学', '科普研学'], ['摄影', '摄影'], ['低负担', '低负担']],
    defaults: { hours: 6, pace: '平衡', mode: '观光核心', cable: false },
  };

  const PACE_BUDGET = { 轻松: -18, 平衡: 0, 深度: 16 };
  const PACE_FACTOR = { 轻松: 1.12, 平衡: 1, 深度: 0.94 };

  const budgetOf = p => Math.max(100, p.hours * 60 - 25 + PACE_BUDGET[p.pace]);
  const stopMinutes = (s, p) => Math.round(s.minutes * PACE_FACTOR[p.pace]);

  const PASS_MIN = 3;

  /* 整条路线的估算用时（含步行）与里程。stops 是细看的站，其余算路过。 */
  HL.routeEstimate = (stops, p) => {
    const minutes = (p.cable ? 93 : 128) + (ST.length - stops.length) * PASS_MIN
      + stops.reduce((t, s) => t + stopMinutes(s, p), 0);
    const km = (p.cable ? 3.1 : 5.2) + stops.reduce((t, s) => t + .2 + s.effort * .09, 0);
    return { minutes, km: Math.round(km * 10) / 10 };
  };

  function modeBonus(s, mode) {
    const text = `${s.category} ${s.collection} ${s.summary}`;
    if (mode === '科普研学') return /水|瀑布|地貌|钙华|洞|湿地|冰川/.test(text) ? 1.8 : 0;
    if (mode === '摄影') return /彩池|瀑布|水面|倒影|云海|观景/.test(text) ? 2 : 0;
    if (mode === '低负担') return -s.effort * 1.8;
    return 0;
  }

  /* v1 在「平衡」「深度」里把偏好分减掉，会让选了「摄影」反而先暂缓拍摄点；这里统一为加分。 */
  function priority(s, p) {
    const b = modeBonus(s, p.mode);
    if (p.pace === '轻松') return s.rank - s.effort * 1.5 + b;
    if (p.pace === '深度') return s.rank + s.effort * .35 + b * .35;
    return s.rank + b;
  }

  HL.plan = (prefs, visited = []) => {
    const p = { ...HL.PLAN.defaults, ...prefs };
    const budget = budgetOf(p);
    const kept = [...ST], deferred = [];
    while (kept.length && HL.routeEstimate(kept, p).minutes > budget) {
      const drop = kept.filter(s => !visited.includes(s.id)).sort((a, b) => priority(a, p) - priority(b, p))[0];
      if (!drop) break;
      kept.splice(kept.indexOf(drop), 1);
      deferred.push(drop);
    }
    deferred.sort((a, b) => HL.indexOf(a.id) - HL.indexOf(b.id));
    const est = HL.routeEstimate(kept, p);
    let reason = '每一站都能停下细看，并留出了返程缓冲。';
    if (deferred.length) reason = `为留出返程缓冲，${deferred.map(s => s.name).join('、')} 建议路过看一眼，不专门停留。`;
    if (p.cable) reason += '按坐索道上行估算，班次和开放情况以景区当天公告为准。';
    if (est.minutes > budget) reason = '已打卡的站加起来已经超出这段时间，建议放慢节奏或延长时间。';
    return { prefs: p, kept, deferred, budget, minutes: est.minutes, km: est.km, buffer: Math.max(0, budget - est.minutes), reason };
  };
})();
