/* 内容索引、距离与时间换算、路线计算。只读数据和状态，不碰 DOM。 */
(() => {
  'use strict';
  const { data: D } = HL;

  const ST = D.stations;
  const FAC = D.facilities;
  const C = D.cards;

  /* 按 id 查找：HL.idx.station['five-color-pond'] */
  HL.idx = {
    station: Object.fromEntries(ST.map(s => [s.id, s])),
    facility: Object.fromEntries(FAC.map(f => [f.id, f])),
    product: Object.fromEntries(C.products.map(p => [p.id, p])),
    card: Object.fromEntries([...C.quick, C.inspire, ...C.services.flatMap(g => g.items), ...C.mine].map(c => [c.id, c])),
  };

  HL.FAC_TYPES = [['all', '全部'], ['toilet', '厕所'], ['supply', '补给'], ['medical', '医疗'], ['transit', '索道接驳'], ['visitor', '游客中心']];
  HL.FAC_LABEL = { toilet: '厕所', supply: '小卖部与餐饮', medical: '医疗点', transit: '索道与接驳', visitor: '游客中心' };
  HL.FAC_ICON = { toilet: 'toilet', supply: 'cup', medical: 'cross', transit: 'cable', visitor: 'info' };

  /* 黄龙沟纬度约 32.74°，在这个范围内用平面近似足够。 */
  const M_LAT = 111320;
  const M_LON = 111320 * Math.cos(32.74 * Math.PI / 180);

  Object.assign(HL, {
    M_LAT,
    dist: (a, b) => Math.hypot((a[0] - b[0]) * M_LON, (a[1] - b[1]) * M_LAT),
    fmtDist: m => m < 1000 ? `约 ${Math.max(10, Math.round(m / 10) * 10)} 米` : `约 ${(m / 1000).toFixed(1)} 公里`,
    fmtMin: m => m < 60 ? `${m} 分钟` : `${Math.floor(m / 60)} 小时${m % 60 ? ` ${m % 60} 分钟` : ''}`,
    indexOf: id => ST.findIndex(s => s.id === id),
    sumMin: list => list.reduce((n, s) => n + s.minutes, 0),
    /* 当前路线里的站（去掉被移出的） */
    active: () => ST.filter(s => !HL.S.off.includes(s.id)),
    /* 离某站最近的某类设施：{ f, d } */
    nearest: (type, from) => FAC.filter(f => f.type === type)
      .map(f => ({ f, d: HL.dist(f.loc, from.loc) })).sort((a, b) => a.d - b.d)[0],
  });
})();
