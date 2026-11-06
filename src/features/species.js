/* 生灵徽章（规则和数据见 data/badges.js 的 species）：
   到对应站打卡 → 互动页显出剪影、站点面板出现观察线索；在那一站点「找到了」→ 点亮，记在 S.seen。
   线索是游客自己勾选的，和到站打卡一样不核验。数字人导游只负责「了解更多」，不参与解锁。 */
(() => {
  'use strict';
  const { esc, icon, S, idx, data: D } = HL;
  const SP = (D.badges && D.badges.species) || [];
  const byId = id => SP.find(x => x.id === id);

  /* locked 还没到站 / near 已到站、待找线索 / got 已点亮 */
  HL.speciesState = sp => S.seen.includes(sp.id) ? 'got' : sp.stations.some(id => S.visited.includes(id)) ? 'near' : 'locked';
  HL.speciesAt = stationId => SP.filter(sp => sp.stations.includes(stationId));

  /* 撤回打卡时，靠这一站点亮的徽章一起收回（另一站也打过卡的不收回） */
  HL.pruneSeen = () => { S.seen = S.seen.filter(id => { const sp = byId(id); return sp && sp.stations.some(s => S.visited.includes(s)); }); };

  /* 站点面板里的「这一段的生灵」 */
  HL.speciesBlock = s => {
    const list = HL.speciesAt(s.id);
    if (!list.length) return '';
    const here = S.visited.includes(s.id);
    return `<div class="guide-block species-block" id="species-block"><h3>这一段的生灵</h3>
      ${here ? '' : '<p class="note">到站打卡后，可以在这里找观察线索，点亮生灵徽章。</p>'}
      ${list.map(sp => {
        const got = S.seen.includes(sp.id);
        return `<div class="sp-clue${got ? ' is-got' : ''}">
          <button class="sp-badge" type="button" data-act="species" data-id="${sp.id}" aria-label="查看${esc(sp.name)}徽章"><img src="${esc(sp.img)}" alt=""></button>
          <div class="t"><b>${esc(sp.name)} · 找「${esc(sp.clue.label)}」</b><p>${esc(sp.clue.hint)}</p>
            ${here ? `<button class="btn ${got ? 'is-on' : 'btn-primary'} btn-sm" type="button" data-act="species-seen" data-id="${sp.id}" aria-pressed="${got}">${icon(got ? 'check' : 'leaf')}${got ? '已点亮' : '找到了'}</button>` : ''}</div>
        </div>`;
      }).join('')}</div>`;
  };

  HL.act('species-seen', el => {
    const sp = byId(el.dataset.id);
    if (!sp || !sp.stations.some(id => S.visited.includes(id))) return;
    const before = HL.store.snapshot(), had = S.seen.includes(sp.id);
    S.seen = had ? S.seen.filter(x => x !== sp.id) : [...S.seen, sp.id];
    HL.store.save(); HL.renderAll();
    if (el.closest('#layer')) HL.actions.species({ dataset: { id: sp.id } }); // 在徽章详情里点的，刷新详情
    HL.toast(had ? `已取消点亮「${sp.name}」` : `点亮生灵徽章「${sp.name}」`,
      had ? { label: '撤销', fn: () => HL.store.restore(before) } : { label: '去看看', fn: () => { HL.closeSheet(); HL.setPage('play'); } });
  });

  /* 徽章详情：三种状态各给一个主按钮；「问问导游」始终在，作为了解更多 */
  HL.act('species', el => {
    const sp = byId(el.dataset.id);
    if (!sp) return;
    const st = HL.speciesState(sp), who = D.guide && D.guide.personas.qiyu;
    const where = sp.stations.map(id => idx.station[id].name).join('或');
    const lead = st === 'got' ? '已点亮' : st === 'near' ? `已到站，还差一条线索：${sp.clue.label}` : `到${where}打卡后显出剪影`;
    const main = st === 'near' && sp.stations.find(id => S.visited.includes(id));
    HL.openSheet({
      title: sp.name,
      body: `<div class="sheet-media square badge-media"><img src="${esc(sp.img)}" alt="${esc(sp.name)}徽章" class="sp-${st}"></div>
        <p class="lead">${esc(lead)}</p>
        <p class="latin"><i>${esc(sp.latin)}</i> · ${esc(sp.en)}</p>
        ${st === 'locked' ? '' : `<p>${esc(sp.description)}</p>`}
        <p class="kv"><b>观察线索</b>　${esc(where)}：${esc(sp.clue.hint)}</p>
        <p class="note">线索看的是它生活的环境，在栈道上就能找到，不用离开步道去寻找动物。野外遇见野生动物请保持距离，不追赶、不投喂。徽章只作纪念，不能兑换实物。</p>`,
      foot: `<div class="sheet-foot">
        <button class="btn btn-ghost" type="button" data-act="species-ask" data-id="${sp.id}">${icon('chat')}${who ? `问问${esc(who.name)}` : '问问导游'}</button>
        ${main ? `<button class="btn btn-primary" type="button" data-act="species-seen" data-id="${sp.id}">${icon('leaf')}找到了</button>`
          : `<button class="btn ${st === 'got' ? 'btn-ghost' : 'btn-primary'}" type="button" data-act="species-go" data-id="${sp.id}">${icon('map')}去${esc(idx.station[sp.stations[0]].name)}</button>`}</div>`,
    });
  });

  HL.act('species-go', el => { const sp = byId(el.dataset.id); if (sp) { HL.closeSheet(); HL.selectStation(sp.stations[0]); } });
  HL.act('species-ask', el => { const sp = byId(el.dataset.id); if (sp) HL.askGuide(`给我讲讲${sp.name}`, 'qiyu'); });
})();
