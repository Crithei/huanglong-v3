/* 数字人导游：对话弹层 + 回答来源。
   现在的回答来自内置规则（演示回答，未接入 AI）。接入真实问答时，只需替换
   HL.guide.provider.reply(问题, 上下文)：可以返回回答对象，也可以返回 Promise。

   回答对象：{ html: '<p>…</p>', acts?: [{ k, label, primary? }] }
   acts 的 k 可用：station（打开本站攻略）、route（看路线）、altitude（高原反应服务）、
   fac:<设施id>（在地图上定位）、filter:<设施类型>（筛选设施）、adjust-yes / adjust-no（确认减站）。
   注意：html 会原样插入页面，接入外部回答时必须先转义或做白名单过滤。 */
(() => {
  'use strict';
  const { $, esc, icon, S, idx, data: D } = HL;
  const ST = D.stations;

  const chat = [];
  const QUICK = ['这里看什么', '最近的厕所', '走不动了，少走一点', '有点头晕', '下山坐索道'];
  let pending = null; // 等待确认的减站方案

  /* 传给回答来源的上下文：当前站、路线、已打卡。真实问答接入时可以一并发给后端。 */
  const context = () => ({ station: idx.station[S.current], route: HL.active(), visited: S.visited.slice() });

  /* ---------- 内置规则回答 ---------- */
  /* 减站：用游线规划（features/planner.js）按「轻松」节奏重算，只调整当前站之后、还在细看的站，最多 3 个。 */
  function adjustReply() {
    const ci = HL.indexOf(S.current), finale = D.meta.finale;
    const plan = HL.plan({ ...S.plan, pace: '轻松' }, S.visited);
    const drop = plan.deferred.filter(s => HL.indexOf(s.id) > ci && !S.off.includes(s.id) && s.id !== finale).slice(0, 3);
    if (!drop.length) {
      return { html: `<p>剩下的站已经比较轻松了。可以在附近的补给点坐一会儿，再决定要不要继续。</p>`, acts: [{ k: 'filter:supply', label: '看附近补给点', primary: true }] };
    }
    const keep = !S.off.includes(finale) && !S.visited.includes(finale);
    pending = drop.map(s => s.id);
    return {
      html: `<p>后面体力消耗较大的几站可以只路过、不停留${keep ? `，${esc(idx.station[finale].name)}照样细看` : ''}：</p>
        <div class="diff">路过 ${drop.map(s => `<s>${esc(s.name)}</s>`).join('、')}<br>少停约 ${HL.fmtMin(HL.sumMin(drop))}，细看的站剩 ${HL.active().length - drop.length} 个</div>
        <p>确认后才会修改路线，之后也能恢复。</p>`,
      acts: [{ k: 'adjust-yes', label: '确认调整', primary: true }, { k: 'adjust-no', label: '先不改' }],
    };
  }

  const rules = {
    reply(q, { station: s }) {
      if (/累|走不动|少走|时间不够|赶时间|减站/.test(q)) return adjustReply();
      if (/头晕|高反|高原|不舒服|难受|医|喘/.test(q)) {
        const m = HL.nearest('medical', s);
        return {
          html: `<p>先停下来就地休息，不要继续上行。症状没有缓解或加重时，联系现场工作人员或医疗点。</p><p>离${esc(s.name)}最近的医疗点是「${esc(m.f.name)}」，直线${HL.fmtDist(m.d)}。</p>`,
          acts: [{ k: 'fac:' + m.f.id, label: '在地图上看', primary: true }, { k: 'altitude', label: '高原反应服务' }],
        };
      }
      if (/厕所|卫生间|洗手间/.test(q)) {
        const t = HL.nearest('toilet', s);
        return { html: `<p>离${esc(s.name)}最近的厕所是「${esc(t.f.name)}」，直线${HL.fmtDist(t.d)}。实际走法以栈道和现场指引为准。</p>`, acts: [{ k: 'fac:' + t.f.id, label: '在地图上看', primary: true }] };
      }
      if (/索道|下山|缆车|接驳/.test(q)) {
        const t = HL.nearest('transit', s);
        return { html: `<p>离这里最近的接驳点是「${esc(t.f.name)}」，直线${HL.fmtDist(t.d)}。索道运营时间以现场公告为准。</p>`, acts: [{ k: 'fac:' + t.f.id, label: '在地图上看', primary: true }] };
      }
      if (/拍|照片|机位/.test(q)) return { html: `<p>${esc(s.name)}：${esc(s.photoTip)}</p>`, acts: [{ k: 'station', label: '打开本站攻略' }] };
      if (/看什么|这里|介绍|讲讲|是什么/.test(q)) {
        return { html: `<p><b>${esc(s.name)}</b>，${esc(s.tagline)}。</p><p>${esc(s.viewing)}</p>`, acts: [{ k: 'station', label: '打开本站攻略', primary: true }] };
      }
      return { html: `<p>这个问题还没有接入真实问答。可以试试下面几个常见问题，或者问问厕所、医疗点、索道和拍照。</p>` };
    },
  };

  HL.guide = { provider: rules, rules, context };

  /* ---------- 对话界面 ---------- */
  function renderChat() {
    const box = $('#chat');
    if (!box) return;
    box.innerHTML = chat.map((m, i) => m.who === 'me'
      ? `<div class="msg me">${esc(m.text)}</div>`
      : `<div class="msg bot">${m.html}${m.acts ? `<div class="acts">${m.acts.map(a =>
        `<button class="btn ${a.primary ? 'btn-primary' : 'btn-ghost'}" type="button" data-act="guide-act" data-k="${esc(a.k)}" data-m="${i}" ${m.used ? 'disabled' : ''}>${esc(a.label)}</button>`).join('')}</div>` : ''}</div>`).join('');
    const body = box.closest('.sheet-body');
    body.scrollTop = body.scrollHeight;
  }

  function ask(q) {
    if (!$('#chat')) return HL.openGuide(q);
    chat.push({ who: 'me', text: q });
    renderChat();
    const wait = new Promise(r => setTimeout(r, 380));
    Promise.all([Promise.resolve().then(() => HL.guide.provider.reply(q, context())), wait])
      .then(([a]) => a, () => ({ html: '<p>暂时没能回答，请稍后再试。</p>' }))
      .then(a => { chat.push({ who: 'bot', ...a }); renderChat(); });
  }

  HL.openGuide = question => {
    if (!chat.length) {
      chat.push({ who: 'bot', html: `<p>我是黄龙的数字人导游，可以讲景点、找设施，也能帮你调整路线。</p><p>现在是演示版本，回答来自内置景点资料，还没有接入真实问答。</p>` });
    }
    HL.openSheet({
      title: '数字人导游', cls: 'guide', tag: '<span class="guide-tag">演示回答</span>',
      body: `<div class="chat" id="chat" aria-live="polite"></div>`,
      foot: `<div class="guide-input">
        <div class="chips">${QUICK.map(q => `<button class="chip" type="button" data-act="ask" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>
        <form id="guide-form"><label class="sr" for="guide-q">输入问题</label>
          <input id="guide-q" autocomplete="off" maxlength="60" placeholder="问问附近的设施、景点或路线">
          <button class="icon-btn" type="submit" aria-label="发送">${icon('send')}</button></form></div>`,
    });
    renderChat();
    $('#guide-form').addEventListener('submit', e => {
      e.preventDefault();
      const v = $('#guide-q').value.trim();
      if (v) { $('#guide-q').value = ''; ask(v); }
    });
    if (question) ask(question);
  };

  function guideAct(k, mi) {
    if (chat[mi]) chat[mi].used = true;
    if (k === 'adjust-yes' && pending) {
      const before = HL.store.snapshot();
      S.off = [...new Set([...S.off, ...pending])]; pending = null; HL.store.save(); HL.renderAll();
      chat.push({ who: 'bot', html: `<p>已调整，现在细看 ${HL.active().length} 站，停留约 ${HL.fmtMin(HL.sumMin(HL.active()))}。</p>`, acts: [{ k: 'route', label: '查看路线', primary: true }] });
      renderChat();
      HL.toast('路线已调整', { label: '撤销', fn: () => HL.store.restore(before) });
      return;
    }
    if (k === 'adjust-no') { pending = null; chat.push({ who: 'bot', html: '<p>好的，路线保持原样。</p>' }); renderChat(); return; }
    renderChat();
    HL.closeSheet();
    if (k === 'station') HL.selectStation(S.current);
    else if (k === 'route') HL.goTour('route');
    else if (k === 'altitude') HL.openCard('service-altitude');
    else if (k.startsWith('fac:')) HL.focusFacility(k.slice(4));
    else if (k.startsWith('filter:')) { S.fac = k.slice(7); S.facFocus = null; HL.goTour('fac'); }
  }

  HL.act('guide', () => HL.openGuide());
  HL.act('ask', el => ask(el.dataset.q));
  HL.act('guide-act', el => guideAct(el.dataset.k, Number(el.dataset.m)));
})();
