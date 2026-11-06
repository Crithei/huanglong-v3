/* 数字人导游 · 云端回答来源（WorkBuddy 云：知识库检索 + 大模型流式作答）。
   流程沿用「黄龙数字人网页端交接包」：按角色板块检索 6 条知识片段 → 组装规则 → 流式生成 → 引用编号与依据折叠。
   v3 加了两件事：
     1. 把「游客此刻」告诉模型：在哪一站、哪些站细看 / 路过、打过哪些卡、规划条件、一滴水进度；
     2. 模型可以在回答末尾写一行 <<cmd {"name":…,"args":{…}}>>，这里按白名单校验后变成对话里的按钮，
        由游客点了才生效；改路线还要再确认、可撤销。打卡、清空记录等永远不开放给模型。
   云端不通，或知识库一条都没检索到时，退回内置规则回答（HL.guide.rules）。
   配置与四位角色在 src/data/guide.js；SDK 在 vendor/workbuddy/，第一次提问时才加载。
   线上由 worker 生成的 config.local.js 给出 HL.config.cloudProxy（同源代理 /cloud），有它就走代理，见 worker/index.js。 */
(() => {
  'use strict';
  const { esc, S, idx, data: D } = HL;
  const G = D.guide, ST = D.stations;
  if (!G || !G.cloud || !G.cloud.enabled) return;

  let cloud = null, sdkLoading = null;
  const history = [];            // 最近几轮 { role, content }，切换角色不清空
  let pendingPlan = null;        // 等游客确认的规划条件

  const persona = () => G.personas[S.persona] || G.personas.huaxi;

  function loadSdk() {
    if (cloud) return Promise.resolve(cloud);
    if (!sdkLoading) {
      const script = (src, must) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src; s.onload = resolve; s.onerror = () => (must ? reject(new Error(src)) : resolve());
        document.head.appendChild(s);
      });
      /* 代理地址写在 config.local.js 里；地图可能还没打开、没读过它，这里先读一次（读不到就直连） */
      sdkLoading = (HL.config.cloudProxy ? Promise.resolve() : script('src/config.local.js', false))
        .then(() => script(G.cloud.sdk, true)).then(() => {
        cloud = window.WorkBuddyCloud.createWorkBuddyCloud({
          endpoint: (HL.config && HL.config.cloudProxy) || G.cloud.endpoint, oauthRelayBaseUrl: G.cloud.oauthRelayBaseUrl, publishableKey: G.cloud.publishableKey,
        });
        return cloud;
      });
      sdkLoading.catch(() => { sdkLoading = null; });
    }
    return sdkLoading;
  }

  /* ---------- 页面命令：白名单 ---------- */
  const FAC = { toilet: '厕所', supply: '补给', medical: '医疗点', transit: '索道接驳', visitor: '游客中心' };
  const PANELS = { station: '本站攻略', fac: '沿途设施', route: '我的路线', water: '互动页（一滴水和彩池实验室）' }; // water 由 HL.goTour 转到底栏「互动」页
  const CHAPTERS = window.HuanglongJournal ? HuanglongJournal.CHAPTERS : [];
  const pick = (v, list) => list.some(o => o[0] === v) ? v : undefined;

  /* 把一条命令变成按钮（或规划确认卡）。不认识、参数不对的命令直接丢掉。 */
  function toActs(cmd) {
    const a = cmd && cmd.args && typeof cmd.args === 'object' ? cmd.args : {};
    switch (cmd && cmd.name) {
      case 'showStation': {
        const s = idx.station[a.id]; if (!s) return null;
        return { acts: [{ k: 'goto:' + s.id, label: `在游览中看「${s.name}」`, primary: true }] };
      }
      case 'findFacility': {
        if (!FAC[a.type]) return null;
        const n = HL.nearest(a.type, idx.station[S.current]);
        return n && { acts: [{ k: 'fac:' + n.f.id, label: `在地图上看「${n.f.name}」`, primary: true }] };
      }
      case 'openWater': {
        const c = CHAPTERS.find(x => x.id === a.chapter); if (!c) return null;
        return { acts: [{ k: 'water:' + c.id, label: `打开一滴水「${c.label}」`, primary: true }] };
      }
      case 'openLab': {
        const p = HL.LAB_PRESETS[a.preset];
        return { acts: [{ k: 'lab:' + (p ? a.preset : ''), label: p ? `打开彩池实验室（${p.label}）` : '打开彩池实验室', primary: true }] };
      }
      case 'openPanel':
        return PANELS[a.panel] ? { acts: [{ k: 'panel:' + a.panel, label: `打开${PANELS[a.panel]}` }] } : null;
      case 'planRoute': {
        const prefs = { ...S.plan };
        const h = pick(Number(a.hours), HL.PLAN.hours); if (h) prefs.hours = h;
        const pace = pick(a.pace, HL.PLAN.pace); if (pace) prefs.pace = pace;
        const mode = pick(a.mode, HL.PLAN.mode); if (mode) prefs.mode = mode;
        if (typeof a.cable === 'boolean') prefs.cable = a.cable;
        const r = HL.plan(prefs, S.visited);
        pendingPlan = prefs;
        return {
          html: `<div class="diff">按 ${prefs.hours} 小时、${esc(prefs.pace)}节奏、${esc(prefs.mode)}${prefs.cable ? '、坐索道上行' : ''}：细看 ${r.kept.length} 站，路过 ${r.deferred.length} 站，估算约 ${HL.fmtMin(r.minutes)}。<br>${esc(r.reason)}</div>`,
          acts: [{ k: 'plan-yes', label: '按这个安排调整路线', primary: true }, { k: 'adjust-no', label: '先不改' }],
        };
      }
      default: return null;
    }
  }

  function commandGuide() {
    return [
      '【页面命令】这个网页能替游客做事。若游客的需求可以由页面完成，在回答最后另起一行输出一条命令，格式严格为：<<cmd {"name":"命令名","args":{…}}>>。最多两条；没有合适的就不要输出。命令只会变成按钮，游客点了才生效，所以正文里说「可以点下面的按钮」，不要说已经办好了。',
      '可用命令：',
      `showStation(id) 在游览页打开某个景点。id 只能从这里选：${ST.map(s => `${s.id}=${s.name}`).join('，')}`,
      'findFacility(type) 在地图上定位离游客最近的设施。type：toilet 厕所 / supply 补给 / medical 医疗点 / transit 索道接驳 / visitor 游客中心',
      `planRoute(hours, pace, mode, cable) 按条件重排路线（哪些站细看、哪些路过）。hours：${HL.PLAN.hours.map(o => o[0]).join(' / ')}；pace：轻松 / 平衡 / 深度；mode：观光核心 / 科普研学 / 摄影 / 低负担；cable：true / false。只填游客提到的条件。游客说累、走不动、时间不够时用它。`,
      `openWater(chapter) 打开「一滴水」互动小游戏，用动画演示水的旅程：flow=水流（径流、下渗）、dissolution=溶解（CO₂ 溶解石灰岩）、emergence=出露（地下水、泉水出露）、deposition=沉积（钙华池沿生长、彩池形成）。游客想看演示、动画、互动，或讲到这些过程时，推荐对应的一章。`,
      'openPanel(panel) 打开游览页面板：station 本站攻略 / fac 沿途设施 / route 我的路线 / water 互动页（一滴水四章和彩池实验室）',
      'openLab(preset) 打开彩池演化实验室：四池相连的池群，可改来水、溶解钙、CO₂ 逸散、光照，看蓄水、溢流、池沿沉积怎样连续变化。preset 可选：steady 补给充足 / low 来水减少 / grow 增强沉积条件 / shade 柔光观察（可省略）。游客想动手试试水量、沉积、水色的关系时推荐。',
    ].join('\n');
  }

  function situation() {
    const s = idx.station[S.current], i = HL.indexOf(S.current);
    const kept = HL.active().map(x => x.name), passed = ST.filter(x => S.off.includes(x.id)).map(x => x.name);
    const done = CHAPTERS.filter(c => S.water.chapters[c.id].earnedAt).map(c => c.label);
    return [
      '【游客此刻】以下是网页记录的游客状态，回答时可以参考，不要逐条复述：',
      `正在看第 ${i + 1} 站「${s.name}」（${s.area}，海拔信息以知识片段为准）。`,
      `路线：停下细看 ${kept.length} 站${passed.length ? `；只路过：${passed.join('、')}` : ''}。`,
      `已到站打卡：${S.visited.length ? S.visited.map(id => idx.station[id].name).join('、') : '还没有'}。`,
      `规划条件：可用 ${S.plan.hours} 小时，${S.plan.pace}节奏，偏好${S.plan.mode}，${S.plan.cable ? '坐' : '不坐'}索道上行。`,
      `一滴水互动：${done.length ? '已完成' + done.join('、') : '还没有完成的章节'}。`,
      HL.labSituation ? HL.labSituation() : '',
    ].filter(Boolean).join('\n');
  }

  /* 与交接包 buildSystem 相同的结构，后面加上游客状态和页面命令 */
  function systemPrompt(p, chunks) {
    const kb = chunks.map((c, i) => `[${i + 1}] ${c.title}\n${c.body}`).join('\n\n');
    const lines = p.rules.length
      ? [...p.rules, G.citeRule, '【服务范围】' + p.scope, '【板块边界】' + p.boundary]
      : ['你是' + p.persona, '【回答规范】', ...G.answerRules, ...(p.styleHint ? ['【说话风格】' + p.styleHint] : []),
        '【服务范围】' + p.scope, '【板块边界】' + p.boundary, G.forbid, G.fallback];
    return [...lines, situation(), commandGuide(), '\n【知识片段】\n' + kb].join('\n');
  }

  /* ---------- 回答排版：先转义，再认少量格式 ---------- */
  const CMD = /<<cmd\s*(\{[\s\S]*?\})\s*>>/g;
  function format(text) {
    const lines = esc(text.replace(CMD, '').replace(/<<cmd[\s\S]*$/, '').trim()).split(/\n+/);
    let html = '', list = '';
    const inline = s => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/【(.+?)】/g, '<b class="h">【$1】</b>').replace(/\[(\d{1,2})\]/g, '<sup>[$1]</sup>');
    for (const l of lines) {
      const m = l.match(/^\s*(?:[-•·]|\d+[.、])\s*(.*)$/);
      if (m) { list += `<li>${inline(m[1])}</li>`; continue; }
      if (list) { html += `<ul>${list}</ul>`; list = ''; }
      html += `<p>${inline(l)}</p>`;
    }
    return html + (list ? `<ul>${list}</ul>` : '');
  }

  function sourcesBlock(chunks) {
    return `<details class="kb-src"><summary>知识库依据（${chunks.length}）</summary><ol>${chunks.map(c =>
      `<li><b>${esc(c.title || '')}</b> ${esc(String(c.body || '').replace(/\s+/g, '').slice(0, 48))}…</li>`).join('')}</ol></details>`;
  }

  /* ---------- 回答配图（沿用交接包 matchPhotos 的规则，图库在 src/data/photos.js） ----------
     只放强相关的图：问句点名了条目（完整名或别名），或回答正文写出了完整名称；只被泛称带过的不放。
     v3 加了一条：问句里被更长的词完整盖住的短词不算点名（问「五彩池」时，里面的「彩池」不再拉出泛泛的彩池图）。
     每个点名的对象只出一张，最多 4 张；同一对象的几张图轮换着出，同一会话尽量不重复。 */
  const PHOTOS = D.photos || [], PHOTO_MAX = 4, shownPhotos = new Set();
  function matchPhotos(board, q, answer) {
    const pool = [];
    PHOTOS.forEach((m, i) => { if ((m.boards || [m.board]).includes(board) && m.title) pool.push(i); });
    const hits = [];   // 问句里命中的 [位置, 关键词, 图]
    for (const i of pool) for (const k of PHOTOS[i].keywords || []) { const p = q.indexOf(k); if (p >= 0) hits.push([p, k, i]); }
    const covered = ([p, k]) => hits.some(([p2, k2]) => k2.length > k.length && p2 <= p && p + k.length <= p2 + k2.length);
    const scored = [], named = new Set();
    for (const h of hits.filter(h => !covered(h)).sort((x, y) => x[0] - y[0] || y[1].length - x[1].length)) {
      if (named.has(h[2])) continue;
      named.add(h[2]); scored.push([1, h[0], h[2], h[1]]);
    }
    for (const i of pool) {
      if (named.has(i) || hits.some(h => h[2] === i)) continue;
      const ia = answer.indexOf(PHOTOS[i].title); if (ia >= 0) scored.push([2, ia, i, PHOTOS[i].title]);
    }
    scored.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
    const groups = new Map();   // 按点名的词分组：同一个词只出一张
    for (const [, , i, key] of scored) { if (!groups.has(key)) groups.set(key, []); groups.get(key).push(i); }
    return [...groups.values()].slice(0, PHOTO_MAX).map(list => {
      const i = list.find(x => !shownPhotos.has(x)); const pick = i === undefined ? list[0] : i;
      shownPhotos.add(pick); return pick;
    });
  }
  const photoSrc = m => encodeURI(m.file);
  const photosBlock = list => (list.length ? `<div class="g-photos">${list.map(i => { const m = PHOTOS[i];
    return `<button type="button" class="g-photo" data-act="guide-photo" data-i="${i}" aria-label="看大图：${esc(m.title)}"><img src="${photoSrc(m)}" alt="" loading="lazy"><span>${esc(m.title)}</span></button>`; }).join('')}</div>` : '');

  /* 点配图看大图，点任意处关闭 */
  HL.act('guide-photo', el => {
    const m = PHOTOS[Number(el.dataset.i)]; if (!m) return;
    let box = document.getElementById('photo-view');
    if (!box) { box = document.createElement('div'); box.id = 'photo-view'; box.className = 'photo-view'; document.body.appendChild(box); box.onclick = e => { if (!e.target.closest('a')) box.hidden = true; }; }
    const url = HL.safeUrl(m.source);
    box.innerHTML = `<img src="${photoSrc(m)}" alt="${esc(m.title)}"><b>${esc(m.title)}</b>${m.credit ? `<span>${esc(m.credit)}</span>` : ''}${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">图片来源页</a>` : ''}<small>点任意处关闭</small>`;
    box.hidden = false;
  });

  /* 回答里出现「请切换到【华屿】」之类时，给一个换角色的按钮 */
  function handoffActs(text) {
    const named = k => text.includes('【' + G.personas[k].name) || text.includes(G.personas[k].name + '】');
    return G.order.filter(k => k !== S.persona && named(k)).slice(0, 2)
      .map(k => ({ k: 'persona:' + k, label: `换${G.personas[k].name}来答` }));
  }

  /* ---------- 回答来源 ---------- */
  const provider = {
    label: 'AI 回答 · 仅供参考',
    persona,
    async reply(q, ctx, onStream) {
      const p = persona();
      let chunks;
      try {
        const c = await loadSdk();
        const { data, error } = await c.database.rpc('kb_search', { p_board: p.board, p_query: q, p_limit: G.cloud.topK });
        if (error) throw error;
        chunks = data || [];
      } catch (e) {
        return fallback(q, ctx, e);
      }
      /* 知识库没有依据：不让模型编，退回内置规则（能找设施、减站、高反提示） */
      if (!chunks.length) {
        const local = await HL.guide.rules.reply(q, ctx);
        return { ...local, html: local.html.includes('还没有接入真实问答') ? `<p>${esc(G.noHit)}</p>` : local.html, note: '知识库没有检索到依据，以下来自内置景点资料' };
      }
      const messages = [{ role: 'system', content: systemPrompt(p, chunks) }, ...history.slice(-G.cloud.history), { role: 'user', content: q }];
      let text = '';
      try {
        for await (const part of cloud.llm.chat.completions.create({ model: G.cloud.model, messages, stream: true, temperature: 0.4, reasoning_effort: 'none' })) {
          const d = part.choices && part.choices[0] && part.choices[0].delta && part.choices[0].delta.content;
          if (d) { text += d; if (onStream) onStream(format(text)); }
        }
      } catch (e) {
        if (!text) return fallback(q, ctx, e);
      }
      if (!text.trim()) return fallback(q, ctx, new Error('empty'));
      history.push({ role: 'user', content: q }, { role: 'assistant', content: text.replace(CMD, '').trim() });
      let html = format(text), acts = [];
      for (const m of text.matchAll(CMD)) {
        let cmd; try { cmd = JSON.parse(m[1]); } catch (e) { continue; }
        const r = toActs(cmd);
        if (r) { if (r.html) html += r.html; acts.push(...r.acts); }
      }
      acts.push(...handoffActs(text));
      return { html: html + photosBlock(matchPhotos(p.board, q, text.replace(CMD, ''))) + sourcesBlock(chunks), acts: acts.slice(0, 4), who: p.name };
    },
    takePlan() { const p = pendingPlan; pendingPlan = null; return p; },
    reset() { history.length = 0; shownPhotos.clear(); },
  };

  async function fallback(q, ctx, err) {
    const code = String((err && err.error && err.error.code) || (err && err.message) || '');
    const why = code.startsWith('auth_') ? '云端没有放行当前网址（来源校验未通过）'
      : code.startsWith('quota_') ? '云端额度暂时不足' : '暂时连不上云端';
    console.warn('[HL] 数字人云端回答失败，改用内置回答：', code || err);
    const local = await HL.guide.rules.reply(q, ctx);
    return { ...local, note: `${why}，以下来自内置景点资料` };
  }

  HL.guide.provider = provider;
})();
