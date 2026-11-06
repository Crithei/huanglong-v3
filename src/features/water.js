/* 一滴水（底栏「互动」页）：水流、溶解、出露、沉积四章互动，到关联景点打卡后解锁，顺序不限。
   移植自 v1（huanglong-poi-route-prototype 提交 28797c5 的 follow.js），文案与互动规则沿用 v1：
     - vendor/huanglong-water/follow-state.js：章节状态机，原样使用（window.HuanglongJournal）；
     - vendor/huanglong-water/water-scene.js：Three.js 场景，原样使用，播放器第一次滚进屏幕时才加载（window.HuanglongWaterScene）；
     - 本文件：互动页里的内嵌播放器（章节标签、场景、棋盘、拖放、镜头按钮）。
   解锁只认 S.visited（到站打卡）；玩游戏、看详情都不会产生打卡记录。
   对外：HL.waterMount() / HL.waterRefresh() / HL.waterShown()（互动页调用）、HL.openWater(章节 id)、HL.waterNext()、HL.waterHint(站)、HL.openWater(章节 id)、HL.chaptersFor(站 id)、HL.newChapters(打卡前的 visited)。 */
(() => {
  'use strict';
  const { $, esc, icon, S, idx } = HL;
  const E = window.HuanglongJournal;
  const SCENE_SRC = 'vendor/huanglong-water/water-scene.js';
  const NAMES = { flow: '穿过山林', dissolution: '走进岩层', emergence: '遇见天空', deposition: '长成彩池' };
  const ICONS = { flow: 'leaf', dissolution: 'layers', emergence: 'drop', deposition: 'pool' };

  /* 章节文案：v1 follow.js 的 chapterCopy 压缩成关键词和短句（原文见 v1 提交 28797c5）。
     keys 显示在标题旁；gesture 是怎么玩；science 收在「科普说明」里；phase 是互动中的状态提示。 */
  const COPY = {
    flow: { keys: ['径流', '下渗', '落叶蓄水'], gesture: '交换相邻落叶，三片同形就消除，给水打通下坡路', science: '三消只是玩法。真实的落叶层能蓄水、护住土壤，岩石让水绕流；现场请别移动落叶、树枝和石头。', firstHint: '先点一片落叶，再点旁边一片交换', phase: { idle: '水还没到坡脚，继续开路', connected: '水路贯通，水渗进土壤和裂隙' } },
    dissolution: { keys: ['CO₂', '石灰岩', '溶解'], gesture: '把 CO₂ 气团拖到水滴上', science: '含 CO₂ 的水能慢慢溶解石灰岩。金色粒子是溶解物，不是碎石；剖面是示意。', firstHint: '拖动 CO₂ 气团，交给水滴', phase: { idle: '水滴在等一团 CO₂', active: '石灰岩正在一点点溶解', complete: '溶解物随水流向远方' } },
    emergence: { keys: ['裂隙', '地下水', '泉眼'], gesture: '点岩块旋转，接通蓝色水路', science: '旋转岩块只是解谜。真实地下水沿连通的孔隙和裂隙流动；出露后 CO₂ 逸散，为钙华沉积创造条件。', firstHint: '从左上来水处开始，点岩块旋转', phase: { idle: '琥珀色是断点，转一转', active: '泉水出露，CO₂ 缓缓逸散' } },
    deposition: { keys: ['池沿', '蓄水', '溢流'], gesture: '把水滴拖进光环，或点下方按钮', science: '池沿生长、蓄水和溢流在自然里交织发生，这里分段演示；时间不对应真实年限，水也不会变成石头。', firstHint: '把水滴拖到光环里', phase: { idle: '带水滴去下一处低地', travel: '水滴正在出发', growth: '池沿生长中', fill: '水面蓄积中', overflow: '水越过池沿', complete: '三片彩池连成一段风景' } },
  };

  /* ---------- 状态 ---------- */
  /* 状态机要一个「旅程」对象：stamps 由到站打卡生成，chapters 直接用 S.water 里的对象，改动会留在 S 上。 */
  const journal = () => ({ stamps: Object.fromEntries(S.visited.map(id => [id, true])), chapters: S.water.chapters, chapterBadgeAt: S.water.badgeAt });
  const isOpen = (id, visited = S.visited) => E.CHAPTERS.find(c => c.id === id).poiIds.some(p => visited.includes(p));
  const chapter = id => E.CHAPTERS.find(c => c.id === id);
  const progress = id => S.water.chapters[id];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stationName = id => idx.station[id].name;

  HL.chaptersFor = stationId => E.CHAPTERS.filter(c => c.poiIds.includes(stationId));
  HL.waterDone = () => E.CHAPTERS.filter(c => progress(c.id).earnedAt).length;
  /* 首页「边走边玩」上的下一步提示 */
  HL.waterNext = () => {
    const c = E.CHAPTERS.find(x => !progress(x.id).earnedAt);
    if (!c) return '四章集齐，收下「山水同行者」';
    return isOpen(c.id) ? `可以开始：第 ${E.CHAPTERS.indexOf(c) + 1} 章「${NAMES[c.id]}」` : `下一章到${stationName(c.poiIds[0])}打卡解锁`;
  };
  /* 这次打卡新解锁的章节：打卡前的 visited 与现在比较 */
  HL.newChapters = before => E.CHAPTERS.filter(c => !isOpen(c.id, before) && isOpen(c.id));

  /* ---------- 互动页的四章卡片、首页卡片的进度文字、本站攻略里的提示 ---------- */
  HL.waterHint = s => HL.chaptersFor(s.id).map(c => {
    const open = isOpen(c.id), earned = progress(c.id).earnedAt, n = E.CHAPTERS.indexOf(c) + 1;
    return `<div class="water-hint">
      <span class="ico">${icon(ICONS[c.id])}</span>
      <div class="t"><b>一滴水 · 第 ${n} 章「${NAMES[c.id]}」</b><span>${earned ? '已完成，可以重玩' : open ? '已解锁，可以开始' : '在这一站到站打卡后解锁'}</span></div>
      <button class="btn btn-ghost" type="button" data-act="water-open" data-id="${c.id}">${open ? '进入' : '预览'}</button>
    </div>`;
  }).join('');

  /* ---------- 章节页 ---------- */
  let scene = null, sceneLoad = 'idle', paused = false, drag = null, fallbackTimer = 0, saveClock = 0, uiClock = 0;
  let forestPick = null, forestHintPair = [], forestSerial = -1, springHint = null, springSelected = null;
  const view = () => $('#water-view');
  /* 只有在互动页、而且播放器在屏幕里时才推进动画和状态 */
  let inView = false;
  const shown = () => !!view() && S.page === 'play' && inView;

  const DROP = '<path d="M30 3C24 19 9 31 9 45a21 21 0 0042 0C51 31 36 19 30 3" fill="#62c9ca"/><circle cx="24" cy="44" r="2" fill="#315858"/><circle cx="36" cy="44" r="2" fill="#315858"/>';
  function shell() {
    view().innerHTML = `
      <div class="water-tabs" role="tablist" aria-label="四章" id="waterTabs"></div>
      <div class="water-body" id="waterBody">
        <div class="water-story"><h3 id="waterTitle"></h3><span class="water-keys" id="waterKeys"></span></div>
        <div class="water-canvas" id="waterScene" data-render-state="loading">
          <div class="water-fallback"><div class="fallback-ponds"><span></span><span></span><span></span><span></span></div><p id="waterFallbackTitle">过程示意</p><small>没有三维画面也能玩</small></div>
          <span class="water-scene-state" id="waterSceneState"></span>
          <div id="co2Interaction" class="co2-interaction" hidden>
            <button type="button" id="co2Token" class="co2-token" aria-label="CO₂ 气团，拖到水滴上，或按回车加入"><svg class="co2-fallback-cloud" viewBox="0 0 100 68" aria-hidden="true"><path d="M18 53C1 49 4 28 21 25C21 5 47 3 56 17C72 5 90 19 85 31C104 39 90 62 75 57H24Z" fill="#d7e6db"/><path d="M21 25L37 15L57 23L64 40L46 55L22 49Z" fill="#ecf2e4"/><path d="M57 23L73 19L86 32L75 47L64 40Z" fill="#bacec2"/></svg><span class="gas-caption">CO₂</span></button>
            <button type="button" id="co2DropTarget" class="co2-drop-target" tabindex="-1" aria-label="把 CO₂ 放在水滴上"><span class="co2-target-label">让水带上 CO₂</span><svg class="co2-fallback-drop" viewBox="0 0 60 70" aria-hidden="true">${DROP}</svg></button>
          </div>
          <div id="waterDropInteraction" class="water-drop-interaction" hidden>
            <button type="button" id="waterDropHandle" class="water-drop-handle" aria-label="拖动水滴到下一片彩池，或按回车出发"><svg class="anchor-fallback-drop" viewBox="0 0 60 70" aria-hidden="true">${DROP}</svg><span class="drop-handle-caption">拖动水滴</span></button>
            <div id="waterDropNextTarget" class="water-drop-next-target"><span>下一片彩池</span></div>
          </div>
          <div class="water-controls" role="group" aria-label="模型视角">
            <button type="button" data-act="water-cam" data-cam="left" aria-label="向左旋转模型">${icon('rotl')}</button>
            <button type="button" data-act="water-cam" data-cam="right" aria-label="向右旋转模型">${icon('rotr')}</button>
            <button type="button" data-act="water-cam" data-cam="zoom" aria-label="放大模型">${icon('zoom')}</button>
            <button type="button" data-act="water-cam" data-cam="reset" aria-label="恢复模型视角">${icon('reset')}</button>
            <button type="button" data-act="water-cam" data-cam="pause" aria-label="暂停场景动画" aria-pressed="false" id="waterPause">${icon('pause')}</button>
          </div>
        </div>
        <p class="water-gesture" id="waterGesture"></p>
        <div class="water-unlock" id="waterUnlock" hidden></div>
        <fieldset class="water-game" id="waterGame"><legend>本章互动</legend></fieldset>
        <div class="water-feedback" id="waterFeedbackBox">
          <span class="ico" id="waterFeedbackIco"></span>
          <div class="t"><p id="waterFeedback" role="status"></p><span class="meta"><span id="waterProgress"></span><span id="waterReward"></span></span></div>
        </div>
        <button class="btn btn-primary water-action" type="button" data-act="water-action" id="waterAction"></button>
        <button class="btn btn-ghost water-action" type="button" data-act="water-step" id="waterStep" hidden>查看下一状态</button>
        <p class="water-badge" id="waterBadge" hidden>${icon('stamp')}四章集齐，收下「山水同行者」</p>
        <details class="story water-science"><summary>科普说明</summary><p id="waterScience"></p></details>
      </div>`;
    view().setAttribute('aria-labelledby', 'waterTitle');
    bindDrag({ source: 'co2Token', target: 'co2DropTarget', overlay: 'co2Interaction', chapter: 'dissolution', action: 'charge' });
    bindDrag({ source: 'waterDropHandle', target: 'waterDropNextTarget', overlay: 'waterDropInteraction', chapter: 'deposition', action: 'start' });
    /* 滚进屏幕才加载三维场景；滚出去或切到别的页就暂停，省电也不偷跑进度 */
    if (window.IntersectionObserver) new IntersectionObserver(es => { inView = es[0].isIntersecting; onVisible(); }, { threshold: 0.05 }).observe($('#waterScene'));
    else { inView = true; onVisible(); }
  }
  function onVisible() {
    if (shown()) { loadScene(); if (!fallbackTimer) fallbackTimer = setInterval(fallbackTick, 100); }
    else { cancelDrag(); clearInterval(fallbackTimer); fallbackTimer = 0; }
    if (scene) scene.pause(paused || !shown());
  }

  /* 互动页第一次渲染时调用：把播放器装进页面 */
  HL.waterMount = () => { if (!view() || view().innerHTML) return; shell(); renderGame(); };
  HL.waterRefresh = () => { if (view() && view().innerHTML) renderGame(); };
  HL.waterShown = onVisible; // 切页时由互动页调用

  /* 从别处打开某一章：切到互动页，选中这一章，滚到播放器 */
  HL.openWater = id => {
    HL.closeSheet();
    if (S.page !== 'play') HL.setPage('play');
    HL.waterMount();
    cancelDrag();
    if (id && chapter(id)) S.water.active = id;
    forestPick = null; forestHintPair = []; springHint = null; springSelected = null;
    HL.store.save();
    renderGame();
    const sec = view().closest('section.sec') || view();
    requestAnimationFrame(() => sec.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }));
  };

  /* 第一次打开时才加载 575 KB 的三维场景；失败或不支持 WebGL 就用二维示意，互动照常 */
  function loadScene() {
    if (sceneLoad === 'idle') {
      sceneLoad = 'loading';
      const s = document.createElement('script');
      s.src = SCENE_SRC;
      s.onload = () => { sceneLoad = 'loaded'; mount(); };
      s.onerror = () => { sceneLoad = 'failed'; $('#waterScene').dataset.renderState = 'fallback'; };
      document.head.appendChild(s);
    } else if (sceneLoad === 'loaded') mount();
  }
  function mount() {
    const host = $('#waterScene');
    if (scene || !host || !window.HuanglongWaterScene) return;
    try { scene = HuanglongWaterScene.mount(host, { onInteract: (a, v) => play(a, v), onTick: tick, onDragCancel: cancelDrag }); } catch (e) { scene = null; }
    if (!scene) host.dataset.renderState = 'fallback';
    else { sync(); scene.pause(paused || !shown()); }
  }

  /* ---------- 渲染 ---------- */
  function feedbackOf(id, p, open) {
    const c = COPY[id];
    if (!open) return { text: '先看模型，到站打卡后就能玩', state: 'locked' };
    if (p.won) return { text: `已收下「${chapter(id).reward}」`, state: 'complete' };
    const fresh = id === 'flow' || id === 'emergence' ? p.moves === 0 : id === 'dissolution' ? !p.charged && p.elapsed === 0 : p.sequence === 0 && p.fraction === 0 && !p.running;
    if (fresh) return { text: c.firstHint, state: 'hint' };
    if (id === 'flow') return { text: E.forestInfo(p).connected ? c.phase.connected : c.phase.idle, state: 'process' };
    if (id === 'dissolution') return p.charged ? (p.elapsed >= 8 ? { text: c.phase.complete, state: 'complete' } : { text: c.phase.active, state: 'process' }) : { text: c.phase.idle, state: 'hint' };
    if (id === 'emergence') return { text: E.springInfo(p).connected ? c.phase.active : c.phase.idle, state: 'process' };
    if (p.sequence === 9) return { text: c.phase.complete, state: 'complete' };
    if (p.running && p.travel < 1) return { text: c.phase.travel, state: 'process' };
    if (p.running) return { text: c.phase[['growth', 'fill', 'overflow'][p.sequence % 3]], state: 'process' };
    if (p.sequence > 0 && p.sequence % 3 === 0) return { text: '这一片彩池长好了，继续下一片', state: 'process' };
    return { text: c.phase.idle, state: 'hint' };
  }

  const LEAF = {
    0: '<path d="M8 26C4 10 17 5 29 4c1 14-4 26-17 26Z"/><path d="M9 29 25 9M15 22l-3-7m8 2 5 0"/>',
    1: '<path d="m18 3 4 9 8-2-3 8 6 5-11 2-4 8-4-8-11-2 6-5-3-8 8 2Z"/><path d="M18 11v21"/>',
    2: '<path d="M18 3C6 12 5 23 18 31 31 23 30 12 18 3Z"/><path d="M18 9v21m0-11-6-4m6 9 6-5"/>',
    '-1': '<path d="m6 13 9-7 12 3 6 17-12 5-17-6Z"/><path d="m15 6 5 13 13 7M6 13l14 6 1 12"/>',
    '-2': '<path d="m6 30 24-23M13 23l-5-10m12 3 9 2m-5-8 0-7"/>',
  };
  const gameBtn = (a, v, attrs, body) => `<button type="button" data-act="water-game" data-a="${a}" data-v="${v}" ${attrs}>${body}</button>`;

  function forestBoard(p, open) {
    const info = E.forestInfo(p), labels = ['椭圆叶', '枫形叶', '尖叶'], animate = p.serial !== forestSerial;
    forestSerial = p.serial;
    const locked = !open || info.connected;
    return `<legend>穿过山林 · 三消开路</legend>
      <div class="forest-intro"><b>水源 ↓</b><span>交换 ${p.moves} 次 · 不限步数</span></div>
      <div class="forest-board" aria-label="六行五列林间坡面，交换相邻落叶">${p.tiles.map((v, i) => {
        const wet = info.wet.includes(i), sel = forestPick === i, hint = forestHintPair.includes(i);
        const cls = `forest-cell leaf-${v}${p.open[i] ? ' opened' : ''}${wet ? ' wet' : ''}${sel ? ' selected' : ''}${hint ? ' hinted' : ''}${animate && p.lastClear.includes(i) ? ' scattered' : ''}`;
        const label = `第${Math.floor(i / 5) + 1}行第${i % 5 + 1}列，${v === -1 ? '固定岩石' : v === -2 ? '枝条，邻近消除可松动' : labels[v]}${wet ? '，水路已连通' : p.open[i] ? '，地面已打开' : ''}`;
        return gameBtn('pick', i, `class="${cls}" aria-pressed="${sel}" aria-label="${label}" ${!open || v < 0 || p.won || info.connected ? 'disabled' : ''}`,
          `<svg viewBox="0 0 36 36" aria-hidden="true">${LEAF[v]}</svg>${wet ? '<span class="forest-ripple"></span>' : ''}`);
      }).join('')}</div>
      <div class="forest-outlet${info.connected ? ' flowing' : ''}">↓ 土壤与裂隙 · 渗入地下水</div>
      <div class="game-tools">${gameBtn('hint', '', `class="btn btn-ghost" ${locked ? 'disabled' : ''}`, '提示')}${gameBtn('shuffle', '', `class="btn btn-ghost" ${locked ? 'disabled' : ''}`, '换一盘')}</div>
      <p class="game-legend">叶形可换 · 岩石绕行 · 枝条靠邻消除</p>
      ${info.connected ? '<div class="game-discovery"><b>径流 → 下渗</b><p>水汇向低处，渗进土壤和裂隙</p></div>' : ''}`;
  }

  function springBoard(p, open) {
    const info = E.springInfo(p), dirs = ['上', '右', '下', '左'];
    return `<legend>寻找泉眼 · 旋转裂隙</legend>
      <div class="spring-summary"><span>地下水来向 ↓</span><b>${info.path.length} / 6 已接通</b></div>
      <div class="spring-board" aria-label="三行两列岩层，点击顺时针旋转九十度">${p.rotations.map((r, i) => {
        const wet = info.path.includes(i), blocked = info.blocked === i, ports = E.springPorts(i, r), d = i === 5 ? 'M50 0V100' : 'M50 0V50H100';
        const cls = `spring-tile${wet ? ' wet' : ''}${blocked ? ' blocked' : ''}${springHint === i ? ' hinted' : ''}${springSelected === i ? ' selected' : ''}`;
        const label = `第${Math.floor(i / 2) + 1}层${i % 2 ? '右侧' : '左侧'}岩层，开口朝${ports.map(x => dirs[x]).join('和')}，${blocked ? '水路断点' : wet ? '已通水' : '未连通'}，点击旋转`;
        return gameBtn('rotateRock', i, `class="${cls}" aria-label="${label}" ${!open || p.won ? 'disabled' : ''}`,
          `<svg viewBox="0 0 100 100" aria-hidden="true"><path class="spring-strata" d="M9 22h82M9 34h82M9 70h82M9 82h82"/><g transform="rotate(${r * 90} 50 50)"><path class="spring-crack" d="${d}"/><path class="spring-water" d="${d}"/></g><circle class="spring-stop" cx="50" cy="50" r="14"/></svg><span class="spring-turn">↻</span>`);
      }).join('')}</div>
      <div class="spring-exit${info.connected ? ' active' : ''}">→ 山坡泉口 · 遇见天空</div>
      <div class="game-tools">${gameBtn('springHint', '', `class="btn btn-ghost" ${!open || info.connected ? 'disabled' : ''}`, '提示')}<span>转动 ${p.moves} 次</span></div>
      <p class="game-legend">点一下转 90° · 开口对齐才通水</p>
      <div class="game-discovery" ${info.connected ? '' : 'hidden'}><b>地下水 → 泉眼</b><div class="water-meter"><i id="springFill"></i></div><span id="springText">泉流与气泡正在出现…</span></div>`;
  }

  function renderGame() {
    const id = S.water.active, c = chapter(id), copy = COPY[id], p = progress(id), open = isOpen(id);
    $('#waterTabs').innerHTML = E.CHAPTERS.map((x, i) => {
      const st = progress(x.id).earnedAt ? 'is-earned' : isOpen(x.id) ? 'is-open' : 'is-locked';
      return `<button type="button" role="tab" aria-selected="${x.id === id}" data-act="water-open" data-id="${x.id}" class="${st}">
      <small>0${i + 1} ${esc(x.label)}</small>${NAMES[x.id]}${st === 'is-earned' ? icon('check') : st === 'is-locked' ? icon('lock') : '<i class="dot" aria-hidden="true"></i>'}</button>`;
    }).join('');
    const host = $('#waterScene');
    host.dataset.chapter = id;
    $('#waterSceneState').textContent = p.won ? '本章已完成' : open ? '可以玩' : '模型预览';
    $('#waterFallbackTitle').textContent = c.label + '过程示意';
    $('#waterTitle').textContent = `第 ${E.CHAPTERS.indexOf(c) + 1} 章 · ${NAMES[id]}`;
    $('#waterKeys').innerHTML = copy.keys.map(k => `<span>${esc(k)}</span>`).join('');
    $('#waterScience').textContent = copy.science;
    $('#waterGesture').textContent = copy.gesture;
    $('#waterBadge').hidden = !S.water.badgeAt;
    const cnt = $('#play-water-count'); if (cnt) cnt.textContent = `${HL.waterDone()} / 4 章`; // 互动页标题旁的进度

    const unlock = $('#waterUnlock');
    unlock.hidden = open;
    unlock.innerHTML = open ? '' : `<b>${icon('lock')}到站打卡解锁</b>
      <div class="unlock-btns">${c.poiIds.map(pid => `<button class="btn btn-primary" type="button" data-act="water-checkin" data-id="${pid}">${icon('stamp')}我在${esc(stationName(pid))}</button>`).join('')}</div>`;

    const game = $('#waterGame');
    game.disabled = !open;
    if (id === 'flow') game.innerHTML = forestBoard(p, open);
    if (id === 'emergence') game.innerHTML = springBoard(p, open);
    if (id === 'dissolution') game.innerHTML = `<legend>让水带上 CO₂</legend>${p.charged
      ? '<p class="game-legend center">石灰岩轮廓正在变化</p>'
      : gameBtn('charge', '', 'class="btn btn-ghost game-wide"', '点这里，把 CO₂ 交给水滴')}<div class="water-meter"><i id="waterMeter"></i></div>`;
    if (id === 'deposition') game.innerHTML = `<legend>${p.sequence === 9 ? '三片新彩池，连成一段风景' : `正在生成第 ${Math.floor(p.sequence / 3) + 1} 片新彩池`}</legend>
      <div class="pool-phases">${['池沿生长', '水流积累', '水流溢出'].map((t, i) => `<span class="${p.sequence < 9 && p.sequence % 3 === i ? 'is-now' : ''}">${t}</span>`).join('')}</div>
      <div class="water-meter"><i id="waterMeter"></i></div>`;

    $('#co2Interaction').hidden = id !== 'dissolution' || !open || p.charged;
    $('#waterDropInteraction').hidden = id !== 'deposition' || !open || p.running || p.won;
    if (drag && $('#' + drag.overlay).hidden) cancelDrag();
    sync();
  }

  function statusOf(id, p) {
    if (id === 'flow') return E.forestInfo(p).connected ? '径流正在进入地下' : `水流到达第 ${E.forestInfo(p).depth} / 6 层坡面`;
    if (id === 'dissolution') return p.charged ? (p.elapsed >= 8 ? '溶解物随水流向远方' : '石灰岩正在溶解…') : '等待水带上 CO₂';
    if (id === 'emergence') return E.springInfo(p).connected ? '泉水出露 · CO₂ 缓缓逸散' : `已接通 ${E.springInfo(p).path.length} / 6 块岩层`;
    if (p.sequence === 9) return '三片新彩池已生成';
    if (p.running && p.travel < 1) return '水滴正在前往下一片低处…';
    if (p.running) return ['池沿正在生长…', '水正在蓄满新池…', '水正越过池沿…'][p.sequence % 3];
    return '等待下一片彩池生成';
  }

  /* 只更新会随时间变化的部分；updateScene 为假时不通知三维场景（动画帧里调用）。 */
  function sync(updateScene = true) {
    const id = S.water.active, c = chapter(id), p = progress(id), open = isOpen(id), status = statusOf(id, p), fb = feedbackOf(id, p, open);
    $('#waterProgress').textContent = status;
    $('#waterReward').textContent = p.earnedAt ? `✓ ${c.reward}` : `完成后收下「${c.reward}」`;
    const feedback = $('#waterFeedback'), box = $('#waterFeedbackBox');
    if (!feedback.dataset.hold) { feedback.textContent = fb.text; }
    if (box.dataset.state !== fb.state) {
      box.dataset.state = fb.state;
      $('#waterFeedbackIco').innerHTML = icon({ locked: 'lock', hint: 'info', process: 'drop', complete: 'check' }[fb.state]);
    }
    const sf = $('#springFill');
    if (sf) {
      sf.style.width = (p.exposure / 6 * 100) + '%';
      $('#springText').textContent = p.won ? '已收下寻泉者印记' : p.exposure < 1.5 ? '水正穿过最后一段裂隙…' : p.exposure < 3.5 ? '泉水出露，汇入山脚水潭…' : 'CO₂ 缓缓逸散，观察水与气体的方向。';
    }
    const meter = $('#waterMeter');
    if (meter) meter.style.width = (id === 'dissolution' ? p.elapsed / 8 * 100 : id === 'deposition' ? (p.sequence === 9 ? 100 : (p.sequence % 3 + p.fraction) / 3 * 100) : 0) + '%';
    const action = $('#waterAction');
    action.hidden = !open || (!p.won && id !== 'deposition');
    action.disabled = id === 'deposition' && p.running;
    action.textContent = p.won ? '再玩一次' : p.running ? status : p.sequence === 0 ? '带水滴出发' : '带水滴去下一处';
    const step = $('#waterStep');
    step.hidden = !reduced() || !open || p.won;
    step.disabled = id === 'flow' ? !E.forestInfo(p).connected : id === 'dissolution' ? !p.charged : id === 'emergence' ? !E.springInfo(p).connected : !p.running;
    if (updateScene && scene) scene.setChapter(id, p, open, id === 'flow' ? { selectedCell: forestPick, hintCells: forestHintPair } : id === 'emergence' ? { selectedRock: springSelected, hintIndex: springHint } : {});
  }

  /* 反馈文字：互动结果要停留一会儿，不被下一帧的阶段文字立刻覆盖 */
  function say(text) {
    const f = $('#waterFeedback');
    f.textContent = text; f.dataset.hold = '1';
    clearTimeout(say.t); say.t = setTimeout(() => { delete f.dataset.hold; }, 2500);
  }

  /* ---------- 互动 ---------- */
  function play(action, value) {
    const id = S.water.active, p = progress(id);
    if (!isOpen(id)) return;
    if (id === 'emergence') {
      if (action === 'springHint') { const h = E.springHint(p); springHint = h ? h.index : null; renderGame(); say(h ? '转动描边的岩层，让裂隙对准来水方向。' : '泉路已经接通。'); return; }
      if (action === 'rotateRock') { springSelected = value; springHint = null; }
    }
    if (id === 'flow') {
      if (action === 'hint') { forestHintPair = E.forestHint(p) || []; forestPick = null; renderGame(); say('交换描边的两片落叶，试着让同形落叶三连。'); return; }
      if (action === 'pick') {
        if (p.won || E.forestInfo(p).connected || p.tiles[value] < 0) return;
        const near = forestPick !== null && Math.abs(forestPick % 5 - value % 5) + Math.abs(Math.floor(forestPick / 5) - Math.floor(value / 5)) === 1;
        if (!near) { forestPick = forestPick === value ? null : value; forestHintPair = []; renderGame(); return; }
        const pair = [forestPick, value]; forestPick = null; forestHintPair = [];
        return play('swap', pair);
      }
      forestPick = null; forestHintPair = [];
    }
    const j = journal(), r = E.playChapter(j, id, action, value);
    S.water.badgeAt = j.chapterBadgeAt;
    HL.store.save();
    renderGame();
    say(r.message);
    const connected = (id === 'flow' && action === 'swap' && E.forestInfo(progress('flow')).connected)
      || (id === 'emergence' && action === 'rotateRock' && E.springInfo(progress('emergence')).connected);
    if (r.ok && connected) $('#waterScene').scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
  }

  /* 三维场景每帧回调；没有场景时由 fallbackTick 每 0.1 秒推进。force 用于「减少动态效果」下手动查看下一状态。 */
  function tick(id, dt, force = false) {
    if (!shown() || id !== S.water.active || ((paused || reduced() || document.hidden) && !force)) return;
    const j = journal(), r = E.tickChapter(j, id, dt);
    S.water.badgeAt = j.chapterBadgeAt;
    if (!r.changed) return;
    saveClock += dt; uiClock += dt;
    if (r.phaseChanged) { renderGame(); HL.store.save(); saveClock = 0; }
    else if (uiClock > .12) { sync(false); uiClock = 0; }
    if (saveClock >= 1) { HL.store.save(); saveClock = 0; }
    if (r.earned) { HL.toast(r.message + (S.water.badgeAt ? ' 四章已集齐。' : '')); HL.pages.play.render(); } // 徽章区也要更新
  }
  function fallbackTick() {
    const host = $('#waterScene');
    if (!shown() || document.hidden || (scene && host.dataset.renderState !== 'fallback')) return;
    tick(S.water.active, .1);
  }

  /* ---------- 拖放：气团 → 水滴（溶解），水滴 → 下一处（沉积）。有三维场景时拖的是模型本身 ---------- */
  function cancelDrag(accepted = false) {
    if (!drag) return;
    const d = drag; drag = null;
    try { d.token.releasePointerCapture(d.id); } catch (e) { /* 已释放 */ }
    d.token.style.transform = ''; d.token.classList.remove('dragging'); d.target.classList.remove('receiving');
    if (d.modeled && scene) scene.endDrag(accepted);
  }
  function bindDrag({ source, target, overlay, chapter: ch, action }) {
    const token = $('#' + source), dest = $('#' + target);
    const over = (x, y) => { const r = dest.getBoundingClientRect(); return r.width > 0 && x >= r.left - 8 && x <= r.right + 8 && y >= r.top - 8 && y <= r.bottom + 8; };
    token.addEventListener('pointerdown', e => {
      if (e.button !== 0 || drag || $('#' + overlay).hidden || S.water.active !== ch) return;
      const modeled = $('#waterScene').dataset.renderState === 'ready' && !!(scene && scene.beginDrag);
      if (modeled && scene.beginDrag(e.clientX, e.clientY) === false) return;
      e.preventDefault();
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, token, target: dest, overlay, modeled };
      try { token.setPointerCapture(e.pointerId); } catch (err) { cancelDrag(); return; }
      token.classList.add('dragging');
    });
    token.addEventListener('pointermove', e => {
      if (!drag || drag.token !== token || drag.id !== e.pointerId) return;
      if (drag.modeled) scene.moveDrag(e.clientX, e.clientY);
      else token.style.transform = `translate(calc(-50% + ${e.clientX - drag.x}px), calc(-50% + ${e.clientY - drag.y}px))`;
      dest.classList.toggle('receiving', over(e.clientX, e.clientY));
    });
    token.addEventListener('pointerup', e => {
      if (!drag || drag.token !== token || drag.id !== e.pointerId) return;
      const ok = Math.hypot(e.clientX - drag.x, e.clientY - drag.y) >= 8 && over(e.clientX, e.clientY);
      cancelDrag(ok);
      if (ok) play(action);
      else say(ch === 'dissolution' ? '把气团拖到水滴身上，松手后水才会带上 CO₂。' : '把水滴拖进下一处光环，或点下方按钮带它出发。');
    });
    ['pointercancel', 'lostpointercapture'].forEach(ev => token.addEventListener(ev, () => { if (drag && drag.token === token) cancelDrag(); }));
    /* 键盘（回车 / 空格）触发的 click 没有坐标，直接执行 */
    token.addEventListener('click', e => { if (e.detail === 0 && !$('#' + overlay).hidden) play(action); });
  }

  /* ---------- 动作 ---------- */
  HL.act('water-open', el => HL.openWater(el.dataset.id));
  HL.act('water-game', el => play(el.dataset.a, el.dataset.v === '' ? undefined : Number(el.dataset.v)));
  HL.act('water-action', () => {
    cancelDrag();
    const id = S.water.active;
    if (progress(id).won) { const j = journal(); E.resetChapter(j, id); HL.store.save(); renderGame(); say('重新开始本章，已经收下的印记会保留。'); }
    else if (id === 'deposition') play('start');
  });
  HL.act('water-step', () => {
    const id = S.water.active, p = progress(id), step = p.sequence;
    for (let i = 0; i < 34 && !progress(id).won; i++) { tick(id, .25, true); if (id === 'deposition' && progress(id).sequence !== step) break; }
    renderGame();
  });
  HL.act('water-cam', el => {
    cancelDrag();
    const a = el.dataset.cam;
    if (!scene) return;
    if (a === 'left') scene.rotate(-1);
    if (a === 'right') scene.rotate(1);
    if (a === 'zoom') scene.zoom(1);
    if (a === 'reset') scene.reset();
    if (a === 'pause') {
      paused = !paused; scene.pause(paused);
      el.setAttribute('aria-pressed', String(paused));
      el.setAttribute('aria-label', paused ? '继续场景动画' : '暂停场景动画');
      el.innerHTML = icon(paused ? 'resume' : 'pause');
    }
  });
  /* 章节页里的到站打卡：和本站攻略的「到站打卡」写同一份记录 */
  HL.act('water-checkin', el => {
    const sid = el.dataset.id, before = HL.store.snapshot();
    if (!S.visited.includes(sid)) S.visited = [...S.visited, sid];
    HL.store.save(); HL.renderAll(); renderGame();
    HL.toast(`收下「${stationName(sid)}」印章，解锁「${NAMES[S.water.active]}」`, { label: '撤销', fn: () => HL.store.restore(before) });
  });

  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelDrag(); HL.store.save(); } });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => HL.waterRefresh());
  window.addEventListener('pagehide', e => { HL.store.save(); cancelDrag(); if (!e.persisted && scene) { scene.dispose(); scene = null; } });
})();
