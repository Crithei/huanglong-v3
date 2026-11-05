/* 数字人导游：对话弹层 + 回答来源。
   回答来源是 HL.guide.provider.reply(问题, 上下文, onStream?)：可以返回回答对象，也可以返回 Promise；
   onStream(html) 用来边生成边显示。默认来源是本文件的内置规则；features/guide-cloud.js 加载后
   换成云端问答（WorkBuddy），云端失败时它会回头调用这里的 HL.guide.rules。

   回答对象：{ html: '<p>…</p>', acts?: [{ k, label, primary? }], note?: '回答上方的小字说明' }
   acts 的 k 可用：station（打开本站攻略）、route（看路线）、altitude（高原反应服务）、
   fac:<设施id>（在地图上定位）、filter:<设施类型>（筛选设施）、goto:<景点id>（打开某站）、
   water:<章节id>（打开一滴水章节）、panel:<面板>（打开游览页面板）、lab:<预设>（打开彩池实验室）、persona:<角色>（换数字人）、
   adjust-yes / adjust-no（确认减站）、plan-yes（应用云端给的规划条件）。
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

  /* 生灵徽章：问题里提到了哪些物种（规则见 data/badges.js 的 species）。
     长关键词先匹配并抹掉，「小熊猫」里的「熊猫」就不会再算成大熊猫。 */
  const SPECIES = (D.badges && D.badges.species) || [];
  const SP_KEYS = SPECIES.flatMap(sp => sp.keywords.map(k => [k, sp])).sort((a, b) => b[0].length - a[0].length);
  HL.speciesIn = text => {
    let rest = String(text || '');
    const hit = [];
    SP_KEYS.forEach(([k, sp]) => {
      if (!rest.includes(k)) return;
      rest = rest.split(k).join(' ');
      if (!hit.includes(sp)) hit.push(sp);
    });
    return SPECIES.filter(sp => hit.includes(sp));
  };

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
      const sps = HL.speciesIn(q);
      if (sps.length) {
        return { html: sps.map(sp => `<p><b>${esc(sp.name)}</b>：${esc(sp.description)}</p>`).join('') + '<p>野生动物多在清晨和傍晚活动，栈道上偶遇的机会不大。遇见了请保持距离，不追赶、不投喂。</p>' };
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
  let busy = false;
  const persona = () => HL.guide.provider.persona && HL.guide.provider.persona();

  function renderChat() {
    const box = $('#chat');
    if (!box) return;
    box.innerHTML = chat.map((m, i) => m.who === 'me'
      ? `<div class="msg me">${esc(m.text)}</div>`
      : `<div class="msg bot${m.pending ? ' is-pending' : ''}">${m.who === 'bot' && m.name ? `<span class="who">${esc(m.name)}</span>` : ''}${m.note ? `<p class="note-line">${esc(m.note)}</p>` : ''}${m.html || '<p class="typing" aria-label="正在回答"><i></i><i></i><i></i></p>'}${m.acts && !m.pending ? `<div class="acts">${m.acts.map(a =>
        `<button class="btn ${a.primary ? 'btn-primary' : 'btn-ghost'}" type="button" data-act="guide-act" data-k="${esc(a.k)}" data-m="${i}" ${m.used ? 'disabled' : ''}>${esc(a.label)}</button>`).join('')}</div>` : ''}</div>`).join('');
    const body = box.closest('.sheet-body');
    body.scrollTop = body.scrollHeight;
  }

  /* 先放一个「正在回答」气泡，回答来源可以边生成边填进去 */
  function ask(q) {
    if (!$('#chat')) return HL.openGuide(q);
    if (busy) return;
    busy = true;
    const p = persona();
    chat.push({ who: 'me', text: q });
    const msg = { who: 'bot', pending: true, html: '', name: p ? p.name : '' };
    chat.push(msg);
    renderChat();
    const wait = new Promise(r => setTimeout(r, 380));
    const onStream = html => { msg.html = html; renderChat(); };
    Promise.all([Promise.resolve().then(() => HL.guide.provider.reply(q, context(), onStream)), wait])
      .then(([a]) => a, () => ({ html: '<p>暂时没能回答，请稍后再试。</p>', failed: true }))
      .then(a => { Object.assign(msg, a, { pending: false }); busy = false; if (!a.failed) collectSpecies(q, msg); renderChat(); });
  }

  /* 问题里提到、还没收下的物种：记进 S.species，回答下方加一行提示，并弹出提示条 */
  function collectSpecies(q, msg) {
    const fresh = HL.speciesIn(q).filter(sp => !S.species.includes(sp.id));
    if (!fresh.length) return;
    S.species = [...S.species, ...fresh.map(sp => sp.id)];
    HL.store.save();
    if (HL.pages.mine) HL.pages.mine.render();
    msg.html += `<div class="g-species">${fresh.map(sp =>
      `<button type="button" data-act="species" data-id="${esc(sp.id)}"><img src="${esc(sp.img)}" alt=""><span>收下生灵徽章<b>${esc(sp.name)}</b></span></button>`).join('')}</div>`;
    HL.toast(`收下生灵徽章「${fresh.map(sp => sp.name).join('」「')}」`);
  }

  function welcome() {
    const p = persona();
    return p
      ? { who: 'bot', name: p.name, html: p.welcome.split('\n').map(l => `<p>${esc(l)}</p>`).join('') + '<p class="note-line">回答由 AI 依据黄龙知识库生成，仅供参考；价格、开放时间以景区当天公告为准。需要改路线、找设施时，我会给出按钮，你点了才生效。</p>' }
      : { who: 'bot', html: `<p>我是黄龙的数字人导游，可以讲景点、找设施，也能帮你调整路线。</p><p>现在是演示版本，回答来自内置景点资料，还没有接入真实问答。</p>` };
  }

  /* 四位角色切换条（只有云端问答时显示） */
  function personaBar() {
    const G = HL.data.guide;
    if (!persona() || !G) return '';
    return `<div class="personas" role="radiogroup" aria-label="选择数字人">${G.order.map(k => {
      const p = G.personas[k];
      return `<button type="button" role="radio" aria-checked="${S.persona === k}" data-act="guide-persona" data-id="${k}">
        <img src="${esc(p.avatar)}" alt="" width="36" height="36"><span><b>${esc(p.name)}</b><small>${esc(p.tag)}</small></span></button>`;
    }).join('')}</div>`;
  }

  HL.openGuide = question => {
    if (!chat.length) chat.push(welcome());
    const p = persona();
    const quick = p ? [...p.chips.slice(0, 4), '最近的厕所', '走不动了，少走一点'] : QUICK;
    HL.openSheet({
      title: p ? `数字人导游 · ${p.name}` : '数字人导游', cls: 'guide',
      tag: `<span class="guide-tag">${esc(HL.guide.provider.label || '演示回答')}</span>`,
      body: `${personaBar()}<div class="chat" id="chat" aria-live="polite"></div>`,
      foot: `<div class="guide-input">
        <div class="chips">${quick.map(q => `<button class="chip" type="button" data-act="ask" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>
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
    if (k === 'plan-yes') {
      const prefs = HL.guide.provider.takePlan && HL.guide.provider.takePlan();
      if (!prefs) return;
      const before = HL.store.snapshot();
      S.plan = prefs; HL.store.save();
      HL.applyPlan();
      const r = HL.plan(S.plan, S.visited);
      chat.push({ who: 'bot', html: `<p>已按新条件调整：细看 ${r.kept.length} 站，路过 ${r.deferred.length} 站。</p>`, acts: [{ k: 'route', label: '查看路线', primary: true }] });
      renderChat();
      HL.toast('路线已调整', { label: '撤销', fn: () => HL.store.restore(before) });
      return;
    }
    if (k === 'adjust-no') { pending = null; if (HL.guide.provider.takePlan) HL.guide.provider.takePlan(); chat.push({ who: 'bot', html: '<p>好的，路线保持原样。</p>' }); renderChat(); return; }
    if (k.startsWith('persona:')) { switchPersona(k.slice(8)); return; }
    renderChat();
    HL.closeSheet();
    if (k.startsWith('goto:')) HL.selectStation(k.slice(5));
    else if (k.startsWith('water:')) HL.openWater(k.slice(6));
    else if (k.startsWith('panel:')) HL.goTour(k.slice(6));
    else if (k.startsWith('lab:')) HL.openLab(k.slice(4) || undefined);
    else if (k === 'station') HL.selectStation(S.current);
    else if (k === 'route') HL.goTour('route');
    else if (k === 'altitude') HL.openCard('service-altitude');
    else if (k.startsWith('fac:')) HL.focusFacility(k.slice(4));
    else if (k.startsWith('filter:')) { S.fac = k.slice(7); S.facFocus = null; HL.goTour('fac'); }
  }

  function switchPersona(id) {
    if (!HL.data.guide || !HL.data.guide.personas[id] || id === S.persona) return;
    S.persona = id; HL.store.save();
    chat.push(welcome());
    HL.openGuide();
  }

  /* 从其他页面直接向某位角色提问（例如彩池实验室把此刻的状态问给华屿） */
  HL.askGuide = (question, personaId) => {
    if (personaId && HL.data.guide && HL.data.guide.personas[personaId] && personaId !== S.persona) {
      S.persona = personaId; HL.store.save(); chat.push(welcome());
    }
    HL.openGuide(question);
  };

  HL.act('guide', () => HL.openGuide());
  HL.act('guide-persona', el => switchPersona(el.dataset.id));
  HL.act('ask', el => ask(el.dataset.q));
  HL.act('guide-act', el => guideAct(el.dataset.k, Number(el.dataset.m)));
})();
