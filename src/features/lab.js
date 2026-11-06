/* 彩池演化实验室：一片四池相连的池群，改变来水、溶解钙、CO₂ 逸散、光照，看它连续演化。
   移植自 v1（huanglong-poi-route-prototype 提交 28797c5 的 pool-lab.js），文案与规则沿用 v1：
     - vendor/huanglong-pool/pool-lab-state.js：定性模型，原样使用（window.HuanglongPoolModel）；
     - vendor/huanglong-pool/pool-lab-scene.js：Canvas 池群与 SVG 剖面，原样使用（window.HuanglongPoolScene）；
     - 本文件：互动页里的内嵌实验室。默认只露出画面和「开始演化 / 展开实验室」，控件、对照、观察卡、发现与贴纸在展开后出现。v1 的「写进手账」等手账搬来后再接。
   进度存在 S.lab（读档时由 state.js 校验，恢复后一律暂停）。
   和数字人的联动：
     - 实验页与观察卡上的「问问华屿」：把此刻的条件和池子状态写成问题，换到钙华研学的华屿来答；
     - 数字人每次回答都能读到实验室状态（HL.labSituation）；
     - 数字人可以提议 openLab(preset)：用某个预设条件打开实验室（HL.openLab）。
   对外：HL.labMount() / HL.labRefresh() / HL.labPause()（互动页调用）、HL.openLab(preset?)、HL.labSituation()、HL.LAB_PRESETS。 */
(() => {
  'use strict';
  const { $, esc, icon, S, idx } = HL;
  const M = window.HuanglongPoolModel, Scene = window.HuanglongPoolScene;
  const B = HL.data.badges.stickers.find(s => s.id === 'pool');

  const CONTROLS = [
    { id: 'flow', label: '来水', help: '水位 · 溢流' },
    { id: 'calcium', label: '溶解钙', help: '池沿的原料' },
    { id: 'exchange', label: 'CO₂ 逸散', help: '促进析出' },
    { id: 'light', label: '光照', help: '只改观感' },
  ];
  /* v1 的四个预设：只改相关条件，池群接着当前状态演化 */
  const PRESETS = HL.LAB_PRESETS = {
    steady: { label: '补给充足', set: { flow: 75, calcium: 60, exchange: 55, light: 70 } },
    low: { label: '来水减少', set: { flow: 5 } },
    grow: { label: '增强沉积条件', set: { calcium: 90, exchange: 90 } },
    shade: { label: '柔光观察', set: { light: 20 } },
  };
  const clock = t => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t) % 60).padStart(2, '0')}`;
  const level = v => (v === 0 ? '关闭' : v < 30 ? '较弱' : v < 70 ? '适中' : '较强');
  const L = () => S.lab;
  const view = () => $('#lab-view');
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const unlocked = () => B.poiIds.some(id => S.visited.includes(id));

  let renderer = null, compare = false, split = .5, frame = null, last = null, lastText = 0, lastSave = 0, visible = true, drag = null;

  /* ---------- 给数字人的状态与问题 ---------- */
  HL.labSituation = () => {
    const l = L(); if (!l || (!l.world.elapsed && !l.records.length)) return '';
    const d = M.describe(l.world, l.selected), i = l.world.inputs;
    return `彩池实验室（定性演示，不是现场数据）：演示 ${clock(l.world.elapsed)}，来水${level(i.flow)}、溶解钙${level(i.calcium)}、CO₂ 逸散${level(i.exchange)}、光照${level(i.light)}；正在看${d.name}「${d.title}」：${d.reason}；已记录发现 ${l.found.length} / 3。`;
  };
  function question(world, selected) {
    const d = M.describe(world, selected), i = world.inputs;
    return `我在彩池实验室：来水${level(i.flow)}、溶解钙${level(i.calcium)}、CO₂ 逸散${level(i.exchange)}。${d.name}现在「${d.title}」，${d.water}，${d.mineral}。这在真实的黄龙彩池里是什么原理？现场哪里能看到类似的现象？`;
  }

  /* ---------- 页面：内嵌在互动页，不再是全屏页 ---------- */
  function shell() {
    view().innerHTML = `
      <div class="lab-body" id="labBody">
        <div class="lab-stage is-idle" id="labStage">
          <div class="lab-stage-top"><span class="lab-live" id="labRun">○ 等待开始</span><span class="lab-clock" id="labClock">演示 00:00</span></div>
          <div class="lab-canvas-wrap">
            <canvas id="labCanvas" role="img" aria-label="相连的四片彩池；可用下方按钮选择池子查看剖面"></canvas>
            <p class="lab-fallback" id="labFallback" hidden>这个浏览器画不出池群，剖面和文字照样能看。</p>
            <div class="lab-compare-labels" id="labCompareLabels" hidden><span>对照起点</span><span>此刻</span></div>
          </div>
          <div class="lab-stage-bottom"><span class="lab-keys"><span>来水</span>→<span>蓄水</span>→<span>溢流</span>→<span>池沿</span></span>
            <button type="button" data-act="lab-compare" id="labCompare" aria-pressed="false">起点对照</button></div>
          <div class="lab-compare-tools" id="labCompareTools" hidden>
            <label for="labWipe">拖分界线比较前后</label>
            <input type="range" id="labWipe" min="5" max="95" value="50">
            <button class="btn btn-ghost" type="button" data-act="lab-baseline">此刻设为起点</button>
          </div>
        </div>
        <div class="lab-transport">
          <button class="btn btn-primary" type="button" data-act="lab-play" id="labPlay">${icon('resume')}开始演化</button>
          <button class="btn btn-ghost lab-expand" type="button" data-act="lab-expand" id="labExpand" aria-expanded="false" aria-controls="labDetail">展开实验室${icon('chev')}</button>
        </div>
        <!-- 互动页上默认只露出画面和上面两个按钮；条件、观察、贴纸都收在这里，点「展开实验室」才出现 -->
        <div class="lab-detail" id="labDetail" hidden>
        <div class="lab-transport lab-transport-more">
          <button class="btn btn-ghost" type="button" data-act="lab-step" id="labStep">推演一段</button>
          <div class="seg lab-speed" role="radiogroup" aria-label="演示速度">${[1, 3, 6].map(v => `<button type="button" role="radio" data-act="lab-speed" data-v="${v}" aria-checked="false">${v}×</button>`).join('')}</div>
          <button class="icon-btn" type="button" data-act="lab-reset" aria-label="复位池群演化，保留观察记录和贴纸">${icon('reset')}</button>
        </div>
        <p class="note lab-note" id="labMotionNote"></p>
        <section class="lab-inputs" aria-label="环境条件">${CONTROLS.map(c => `
          <label class="lab-control" for="labInput-${c.id}">
            <span><b>${c.label}</b><small id="labHelp-${c.id}">${c.help}</small><output id="labValue-${c.id}"></output></span>
            <input id="labInput-${c.id}" type="range" min="0" max="100" data-lab-input="${c.id}" aria-describedby="labHelp-${c.id}"></label>`).join('')}
        </section>
        <div class="chips lab-presets" role="group" aria-label="一键改条件">${Object.entries(PRESETS).map(([k, p]) => `<button class="chip" type="button" data-act="lab-preset" data-id="${k}">${p.label}</button>`).join('')}</div>

        <section class="lab-insight">
          <div class="seg lab-pools" role="radiogroup" aria-label="选择观察的池子">${M.POOLS.map((p, i) => `<button type="button" role="radio" data-act="lab-select" data-v="${i}" aria-checked="false">${esc(p.name)}</button>`).join('')}</div>
          <h3 id="labWhyTitle"></h3>
          <div class="lab-signals" id="labSignals"></div>
          <p class="lab-why" id="labWhy"></p>
          <p class="lab-next" id="labNext"></p>
          <details class="story lab-section"><summary><span id="labSectionName"></span>剖面（虚线是初始池沿）</summary><div id="labSection"></div></details>
        </section>

        <div class="lab-record-bar">
          <button class="btn btn-primary" type="button" data-act="lab-record">${icon('check')}留下这次观察</button>
          <button class="btn btn-ghost" type="button" data-act="lab-ask">${icon('chat')}问问华屿</button>
        </div>
        <p class="water-feedback lab-feedback" id="labFeedback" role="status" hidden></p>
        <details class="story lab-records-box" id="labRecordsBox"><summary id="labRecordsTitle">观察记录</summary><div class="lab-records" id="labRecords"></div></details>

        <section class="lab-collection" id="labCollection"></section>
        <details class="story"><summary>这个模型能说明什么</summary>
          <p>来水先蓄积，高过池沿就向下游溢流；CO₂ 逸散让部分溶解物析出，长成池沿和池底薄层。光照、水深和浅色池底一起决定水色。</p>
          <p>这是定性模型：时间被压缩，输入都是相对强弱，不是黄龙实测数据，不能用来判断景区状态或推算年限。</p>
          <p>到现场：在栈道上比较水面、池沿和溢流；不进入彩池，不触碰钙华。</p></details>
        </div>
      </div>`;
    renderer = Scene.mount($('#labCanvas'));
    $('#labFallback').hidden = !!renderer;
    view().addEventListener('input', e => {
      const k = e.target.dataset.labInput;
      if (k) { M.setInput(L().world, k, Number(e.target.value)); refreshControls(); refresh(); HL.store.save(); }
      if (e.target.id === 'labWipe') moveSplit(Number(e.target.value) / 100);
    });
    const cv = $('#labCanvas');
    cv.addEventListener('click', e => {
      if (!renderer || compare) return;
      const r = cv.getBoundingClientRect(), hit = renderer.hit((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      if (hit >= 0) { L().selected = hit; refresh(); HL.store.save(); }
    });
    cv.addEventListener('pointerdown', e => {
      if (!compare || e.button !== 0) return;
      const r = cv.getBoundingClientRect();
      if (r.width <= 0 || Math.abs(e.clientX - r.left - r.width * split) > 28) return;
      drag = e.pointerId; try { cv.setPointerCapture(e.pointerId); } catch (err) { /* 捕获失败就不拖 */ }
    });
    cv.addEventListener('pointermove', e => {
      if (drag !== e.pointerId || !compare) return;
      const r = cv.getBoundingClientRect(); if (r.width > 0) moveSplit((e.clientX - r.left) / r.width);
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => cv.addEventListener(ev, stopDrag));
    if (window.IntersectionObserver) new IntersectionObserver(es => { visible = es[0].isIntersecting; if (!visible && L().world.running) pause(); }, { threshold: 0 }).observe(cv);
  }

  /* ---------- 刷新 ---------- */
  const draw = () => renderer && renderer.draw(L().world, { selected: L().selected, baseline: compare ? L().baseline : null, split });
  function refreshControls() {
    for (const c of CONTROLS) {
      const v = L().world.inputs[c.id], input = $(`[data-lab-input="${c.id}"]`);
      input.value = v; input.style.setProperty('--range', v + '%');
      input.setAttribute('aria-valuetext', `${level(v)}，相对值 ${v}`);
      $('#labValue-' + c.id).textContent = level(v);
    }
  }
  function refresh() {
    const l = L(), w = l.world, d = M.describe(w, l.selected);
    $('#labClock').textContent = '演示 ' + clock(w.elapsed);
    const run = $('#labRun'); run.textContent = w.running ? '● 正在演化' : w.elapsed ? 'Ⅱ 已暂停' : '○ 等待开始'; run.classList.toggle('is-running', w.running);
    $('#labStage').classList.toggle('is-idle', !w.running); // 待机时画面上有一道慢慢扫过的水光
    const play = $('#labPlay'); play.hidden = reduced();
    play.innerHTML = w.running ? `${icon('pause')}暂停观察` : `${icon('resume')}${w.elapsed ? '继续演化' : '开始演化'}`;
    $('#labStep').disabled = w.running;
    $('#labMotionNote').textContent = reduced() ? '已开启减少动态效果：点「推演一段」逐步看' : '时间已压缩 · 滚出画面会暂停';
    view().querySelectorAll('[data-act="lab-speed"]').forEach(b => b.setAttribute('aria-checked', String(Number(b.dataset.v) === l.speed)));
    view().querySelectorAll('[data-act="lab-select"]').forEach(b => b.setAttribute('aria-checked', String(Number(b.dataset.v) === l.selected)));
    $('#labWhyTitle').textContent = `${d.name} · ${d.title}`; $('#labWhy').textContent = d.reason; $('#labNext').textContent = d.next;
    $('#labSignals').innerHTML = `<span><i class="sig-water"></i>${esc(d.water)}</span><span><i class="sig-flow"></i>${esc(d.flow)}</span><span><i class="sig-rim"></i>${esc(d.mineral)}</span>`;
    $('#labSectionName').textContent = d.name; $('#labSection').innerHTML = Scene.section(w, l.selected);
    $('#labCompare').setAttribute('aria-pressed', String(compare));
    $('#labCompareTools').hidden = !compare; $('#labCompareLabels').hidden = !compare;
    $('#labCanvas').classList.toggle('is-comparing', compare);
    draw();
  }
  function renderRecords() {
    const l = L();
    $('#labRecords').innerHTML = l.records.length ? l.records.map((r, i) => {
      const d = M.describe(r.world, r.selected);
      return `<article class="lab-record"><div class="top"><span>观察 ${String(i + 1).padStart(2, '0')}</span><span>${clock(r.world.elapsed)} · ${esc(d.name)}</span></div>
        <b>${esc(d.title)}</b><p>${esc(d.reason)}</p>
        <div class="acts"><button class="btn btn-ghost" type="button" data-act="lab-compare-record" data-v="${i}">与此刻对照</button>
          <button class="btn btn-ghost" type="button" data-act="lab-ask-record" data-v="${i}">${icon('chat')}问华屿</button></div></article>`;
    }).join('') : '<p class="note">让水流起来，再留下一个好奇的时刻</p>';
    $('#labRecordsTitle').textContent = `观察记录（${l.records.length}）`;
  }
  function renderCollection() {
    const l = L(), open = unlocked();
    const cnt = $('#play-lab-count'); if (cnt) cnt.textContent = l.stickerAt ? '已收下贴纸' : `发现 ${l.found.length} / 3`;
    $('#labCollection').innerHTML = `
      <div class="lab-sticker${l.stickerAt ? ' is-got' : ''}"><img src="${esc(B.img)}" alt=""><div>
        <b>池群观察者 · ${l.found.length} / 3</b>
        <span>${l.stickerAt ? '已收下贴纸' : open ? '已到站 · 留下观察就计入发现' : '预习模式 · 到下列景点打卡后才计入'}</span></div></div>
      <ul class="lab-goals">${B.goals.map(g => `<li class="${l.found.includes(g.id) ? 'is-done' : ''}">${icon(l.found.includes(g.id) ? 'check' : 'pool')}<span><b>${esc(g.label)}</b>${esc(g.hint)}</span></li>`).join('')}</ul>
      ${open ? '' : `<div class="chips">${B.poiIds.map(id => `<button class="chip" type="button" data-act="station" data-id="${id}">${esc(idx.station[id].name)}</button>`).join('')}</div>`}`;
  }

  /* ---------- 演化循环：离开、后台、滚出画面、减少动态效果时暂停，不追赶 ---------- */
  function stopDrag() { if (drag !== null) { try { $('#labCanvas').releasePointerCapture(drag); } catch (e) { /* 已释放 */ } drag = null; } }
  function pause(msg) {
    if (!L()) return;
    L().world.running = false;
    if (frame !== null) { cancelAnimationFrame(frame); frame = null; }
    last = null; stopDrag();
    if (view() && view().innerHTML) refresh();
    HL.store.save();
    if (msg) say(msg);
  }
  function tick(now) {
    frame = null;
    const w = L().world;
    if (!w.running || S.page !== 'play' || !visible || document.hidden || reduced()) { pause(); return; }
    if (last === null) last = now;
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    M.tick(w, dt * L().speed);
    if (now - lastText > 180) { refresh(); lastText = now; } else draw();
    if (now - lastSave > 2500) { HL.store.save(); lastSave = now; }
    frame = requestAnimationFrame(tick);
  }
  function say(text) { const f = $('#labFeedback'); f.hidden = !text; f.textContent = text || ''; }
  function moveSplit(v) { split = Math.min(.95, Math.max(.05, v)); $('#labWipe').value = String(Math.round(split * 100)); draw(); }

  /* ---------- 展开 / 收起详情 ---------- */
  function expand(on) {
    const d = $('#labDetail'), b = $('#labExpand');
    if (!d) return;
    d.hidden = !on;
    b.setAttribute('aria-expanded', String(on));
    b.innerHTML = on ? `收起${icon('chev')}` : `展开实验室${icon('chev')}`;
  }
  HL.act('lab-expand', () => {
    const on = $('#labDetail').hidden;
    expand(on);
    if (!on) $('#labStage').scrollIntoView({ block: 'nearest' }); // 收起后回到画面
  });

  /* ---------- 挂载 / 打开 ---------- */
  /* 互动页第一次渲染时调用：把实验室装进页面 */
  HL.labMount = () => {
    if (!view() || view().innerHTML) return;
    shell(); refreshControls(); refresh(); renderRecords(); renderCollection();
  };
  HL.labRefresh = () => { if (view() && view().innerHTML) { refresh(); renderCollection(); } };
  HL.labPause = () => { if (L() && L().world.running) pause(); };
  /* 从别处打开：切到互动页，滚到实验室；preset 是数字人建议的条件 */
  HL.openLab = preset => {
    HL.closeSheet();
    if (S.page !== 'play') HL.setPage('play');
    HL.labMount();
    expand(true);
    if (preset && PRESETS[preset]) {
      Object.entries(PRESETS[preset].set).forEach(([k, v]) => M.setInput(L().world, k, v));
      refreshControls(); refresh();
      say(`已调成「${PRESETS[preset].label}」，点「开始演化」看池群怎样响应`);
    }
    HL.store.save();
    const sec = view().closest('section.sec') || view();
    requestAnimationFrame(() => sec.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }));
  };

  function askGuide(world, selected) {
    pause();
    HL.askGuide(question(world, selected), 'huayu');
  }

  HL.act('lab-open', () => HL.openLab());

  /* 实验室在别处露出的入口：首页和互动页用的进度文字、站点面板里的提示 */
  HL.labProgress = () => S.lab.stickerAt ? '已收下「池群观察者」贴纸' : `发现 ${S.lab.found.length} / 3 · 随时可以玩`;
  HL.isLabStation = id => B.poiIds.includes(id);
  HL.labHint = s => B.poiIds.includes(s.id) ? `<div class="water-hint">
      <span class="ico">${icon('pool')}</span>
      <div class="t"><b>彩池实验室 · 在池边动手试试</b><span>${S.lab.stickerAt ? '已收下「池群观察者」，可以继续玩' : `改来水和沉积条件，看池群怎样长；${S.visited.includes(s.id) ? '已打卡，集齐三类发现收下贴纸' : '打卡后集齐三类发现收下贴纸'}`}</span></div>
      <button class="btn btn-ghost" type="button" data-act="lab-open">打开</button>
    </div>` : '';
  HL.act('lab-play', () => {
    const w = L().world;
    if (w.running) { pause(); return; }
    if (reduced()) return;
    visible = true; w.running = true; last = null; refresh(); HL.store.save();
    frame = requestAnimationFrame(tick);
  });
  HL.act('lab-step', () => { if (L().world.running) return; M.advance(L().world, 5); refresh(); HL.store.save(); });
  HL.act('lab-speed', el => { L().speed = Number(el.dataset.v); refresh(); HL.store.save(); });
  HL.act('lab-reset', () => {
    pause(); L().world = M.create(); L().baseline = M.snapshot(L().world); compare = false;
    refreshControls(); refresh(); HL.store.save();
    say('池群回到开始，观察记录和贴纸都保留');
  });
  HL.act('lab-preset', el => {
    Object.entries(PRESETS[el.dataset.id].set).forEach(([k, v]) => M.setInput(L().world, k, v));
    refreshControls(); refresh(); HL.store.save();
    say('条件变了，' + (L().world.running ? '看池群怎样响应' : '点继续演化看接下来的变化'));
  });
  HL.act('lab-select', el => { L().selected = Number(el.dataset.v); refresh(); HL.store.save(); });
  HL.act('lab-compare', () => { stopDrag(); compare = !compare; refresh(); });
  HL.act('lab-baseline', () => { L().baseline = M.snapshot(L().world); L().baseline.running = false; refresh(); HL.store.save(); say('此刻设为对照起点，改一个条件再看'); });
  HL.act('lab-compare-record', el => {
    L().baseline = M.snapshot(L().records[Number(el.dataset.v)].world); compare = true; refresh(); HL.store.save();
    $('#labStage').scrollIntoView({ block: 'start' });
  });
  HL.act('lab-record', () => {
    const l = L(), w = l.world;
    const sig = JSON.stringify({ ...w, running: false });
    const dup = l.records.some(r => r.selected === l.selected && JSON.stringify({ ...r.world, running: false }) === sig);
    if (!dup) { l.records.push({ world: { ...M.snapshot(w), running: false }, selected: l.selected }); if (l.records.length > 6) l.records.shift(); }
    let msg = dup ? '这个时刻已经留在观察记录里。' : '已留下这次观察。';
    if (unlocked()) {
      const fresh = M.discoveries(w).filter(g => !l.found.includes(g));
      if (fresh.length) {
        l.found = B.goals.map(g => g.id).filter(g => l.found.includes(g) || fresh.includes(g));
        msg += ` 新发现：${fresh.map(g => B.goals.find(x => x.id === g).label).join('、')}。`;
      }
      if (l.found.length === 3 && !l.stickerAt) { l.stickerAt = new Date().toISOString(); msg += ' 三类发现集齐，收下「池群观察者」贴纸！'; HL.toast('收下「池群观察者」贴纸', { label: '去看看', fn: () => { const b = document.getElementById('h-badges'); if (b) b.scrollIntoView({ block: 'start' }); } }); HL.pages.play.render(); }
    } else if (M.discoveries(w).length) {
      msg += ' 这是预习模式：到关联景点打卡后，再记录一次就会计入发现。';
    }
    HL.store.save(); renderRecords(); renderCollection(); say(msg);
  });
  HL.act('lab-ask', () => askGuide(L().world, L().selected));
  HL.act('lab-ask-record', el => { const r = L().records[Number(el.dataset.v)]; askGuide(r.world, r.selected); });

  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.addEventListener('pagehide', () => pause());
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => { pause(); if (view() && view().innerHTML) refresh(); });
})();
