/* 跨页面复用的小组件，返回 HTML 字符串。 */
(() => {
  'use strict';
  const { esc, icon, S } = HL;

  /* 列表行：服务入口、设施、收藏都用它。
     opts: { act, id, icon, ico（自定义图标区 HTML）, icoCls, icoStyle, title, sub, end（右侧文字）, chev, focus } */
  HL.row = o => `<li><button class="row${o.focus ? ' is-focus' : ''}" type="button" data-act="${o.act}" data-id="${esc(o.id)}">
    <span class="ico${o.icoCls ? ' ' + o.icoCls : ''}"${o.icoStyle ? ` style="${o.icoStyle}"` : ''}>${o.ico || icon(o.icon)}</span>
    <span class="t"><b>${esc(o.title)}</b><span>${esc(o.sub)}</span></span>
    ${o.end ? `<span class="end">${esc(o.end)}</span>` : ''}${o.chev === false ? '' : icon('chev', 'i chev')}</button></li>`;

  /* 景点的「背后的故事与资料来源」，默认收起。本站攻略和景点详情都用它。 */
  HL.storyBlock = s => {
    if (!s.story.length && !s.sources.length) return '';
    const links = s.sources.map(x => {
      const url = HL.safeUrl(x.url);
      return `<li>${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)}</a>` : esc(x.title)}${x.note ? `<span>${esc(x.note)}</span>` : ''}</li>`;
    }).join('');
    return `<details class="story">
      <summary>背后的故事与资料来源</summary>
      ${s.story.map(p => `<p>${esc(p)}</p>`).join('')}
      ${links ? `<ul class="sources">${links}</ul>` : ''}
      ${s.checkedAt ? `<p class="note">内容核对于 ${esc(s.checkedAt)}，开放与管理信息以景区当天公告为准。</p>` : ''}
    </details>`;
  };

  HL.effortDots = n => `<span class="effort" aria-label="体力 ${n} 级，共 3 级">${[1, 2, 3].map(i => `<i class="${i > n ? 'off' : ''}"></i>`).join('')}</span>`;

  /* 沿途色带：每段宽度 = 建议停留时间。interactive 为真时每段可点，跳到该站。 */
  HL.strata = interactive => HL.data.stations.map(s => {
    const off = S.off.includes(s.id), seen = S.visited.includes(s.id);
    if (!interactive) return `<i class="${off ? 'off' : ''}" style="--c:${s.tint};flex:${s.minutes} 1 0"></i>`;
    return `<button type="button" class="${seen ? 'is-visited' : ''} ${off ? 'is-off' : ''}" style="--c:${s.tint};flex:${s.minutes} 1 0;${off ? 'opacity:.28;' : ''}" data-act="select" data-id="${s.id}" aria-label="${esc(s.name)}，建议停留 ${s.minutes} 分钟${seen ? '，已打卡' : ''}"></button>`;
  }).join('');
})();
