/* 游览页「一滴水」：水流、溶解、出露、沉积四章互动，到关联景点打卡后解锁，顺序不限。
   移植自 v1（huanglong-poi-route-prototype 提交 28797c5 的 follow.js），文案与互动规则沿用 v1：
     - vendor/huanglong-water/follow-state.js：章节状态机，原样使用（window.HuanglongJournal）；
     - vendor/huanglong-water/water-scene.js：Three.js 场景，原样使用，第一次打开章节页时才加载（window.HuanglongWaterScene）；
     - 本文件：章节卡、章节页、棋盘、拖放、镜头按钮。
   解锁只认 S.visited（到站打卡）；玩游戏、看详情都不会产生打卡记录。
   对外：HL.waterPanel()、HL.waterHint(站)、HL.openWater(章节 id)、HL.chaptersFor(站 id)、HL.newChapters(打卡前的 visited)。 */
(() => {
  'use strict';
  const { $, esc, icon, S, idx } = HL;
  const E = window.HuanglongJournal;
  const SCENE_SRC = 'vendor/huanglong-water/water-scene.js';
  const NAMES = { flow: '穿过山林', dissolution: '走进岩层', emergence: '遇见天空', deposition: '长成彩池' };
  const ICONS = { flow: 'leaf', dissolution: 'layers', emergence: 'drop', deposition: 'pool' };

  /* v1 follow.js 的 chapterCopy，原文保留 */
  const COPY = {
    flow: { scene: '穿过山林 / 为一滴水开路', copy: '交换两片相邻落叶，三个相同形状相连就会散开，也能松动附近枝条。水会沿打开的地面向下流，绕过岩石，抵达坡脚的渗水区。', science: '三消是虚拟开路玩法。自然界的落叶能蓄水、保护土壤；岩石使水绕流，并不会被消除。径流受地形影响，部分水从土壤与裂隙下渗。现场请保留落叶、树枝与岩石。', fallback: '在下方棋盘交换落叶。蓝色地面表示已连通的水路；没有三维画面也能完成本关。', firstHint: '先点一片落叶，再点相邻落叶交换，横向或纵向连成三个。目标是把上方水源连到下方渗水区。', phase: { idle: '为水滴打开一条向下的路。岩石要绕过，枝条靠邻近消除松动。', connected: '水路已经贯通，观察水从坡脚的土壤与裂隙渗入地下。' }, poi: '在金沙铺地与迎宾池之间，留意坡势、岩石与水路的关系；游戏不代表现场可以移动自然物。', gesture: '交换落叶三连 · 为水滴打通下坡路' },
    dissolution: { scene: '溶解 / 水带走山的一点点', copy: '把轻轻飘动的 CO₂ 气团拖到水滴身上。随后静静看：水流进入岩层，石灰岩逐渐缩小，溶解物随水向前。', science: '含 CO₂ 的水在适当条件下可溶解碳酸盐岩。金色粒子表示溶解物，不是石块碎屑。剖面为科普示意，不要求游客入洞。', fallback: '把 CO₂ 拖给水滴，或使用下方加入按钮。过程会自动演示，不需要再点击观察点。', firstHint: '把会呼吸的 CO₂ 气团拖到水滴上，让水带着它进入岩层。', phase: { idle: '水还在等一团 CO₂；拖动气团，让它先溶进水里。', active: '水带着 CO₂ 进入岩层，石灰岩正在一点点溶解。', complete: '溶解物已经随水向前迁移，岩层轮廓留下了变化。' }, poi: '这一章连接洗身洞观景点：现场可以把“水带走山的一点点”想成一段很慢的旅程。', gesture: '拖动气团，把 CO₂ 交给水滴' },
    emergence: { scene: '遇见天空 / 寻找山里的泉眼', copy: '轻点岩层，每次顺时针转动一格。让裂隙接上蓝色水路，带水滴绕过不透水层，在山脚找到泉眼。', science: '岩层旋转只是解谜表达。真实地下水沿连通的孔隙与裂隙运动，受水头和地层条件影响；本关只画向下与横向水路。地下水出露后，条件变化可能促使 CO₂ 逸散，为后续钙华沉积创造条件。', fallback: '下方六块岩层可直接点击或用键盘操作。蓝色表示连通，琥珀色标出断点；接通后观察泉水出露。', firstHint: '从左上方来水处开始。点击岩层旋转，让裂隙开口与下一块对齐；蓝色水路会告诉你接到了哪里。', phase: { idle: '水停在琥珀色断点。旋转岩层，寻找继续向下的裂隙。', active: '泉路贯通！地下水来到地表，泉水涌出，CO₂ 正缓缓逸散。' }, poi: '在飞瀑流辉与莲台飞瀑附近观察水的形态；本章是出露过程示意，不是现场地下水道测绘。', gesture: '点击岩层旋转 · 蓝色连通 · 琥珀色断点' },
    deposition: { scene: '沉积 / 让风景慢慢长出来', copy: '这一滴水会一直陪着你。把它拖到下一处淡淡的光环里，或点下方按钮带它过去；抵达后，池沿慢慢长起，水蓄满，再溢向下一片低处。', science: '池沿生长、蓄水与溢流在自然界相互交织，这里分段呈现便于观察；演示时间不对应真实年限。沉积来自溶解物，水不会变成石头。', fallback: '把水滴拖到下一处，或点击按钮带它过去。随后依次播放：池沿生长 → 蓄水 → 溢流，共三池。', firstHint: '拖动同一滴水到下一处光环，或点按钮让它出发；抵达后先看池沿生长，再看水面蓄满。', phase: { idle: '把水滴带到下一处低地，新的池沿才会开始生长。', travel: '水滴正在前往下一处低地，准备把新的池沿长出来。', growth: '池沿正在生长，水面还没有蓄满。', fill: '池沿托住了水，水面正在慢慢蓄积。', overflow: '水面越过池沿，正溢向下一片低处。', complete: '三片彩池已经连成一段风景，沉积过程完成。' }, poi: '这一章串起五彩池、争艳彩池与盆景池：每一处池沿，都是水留下的一点时间。', gesture: '拖动水滴去下一处 · 也可点按钮带它出发' },
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
  /* 这次打卡新解锁的章节：打卡前的 visited 与现在比较 */
  HL.newChapters = before => E.CHAPTERS.filter(c => !isOpen(c.id, before) && isOpen(c.id));

  /* ---------- 游览页「一滴水」面板与本站攻略里的提示 ---------- */
  HL.waterPanel = () => {
    const done = E.CHAPTERS.filter(c => progress(c.id).earnedAt).length;
    return `
      <div class="water-head">
        <div><h2>一滴水的旅程</h2><p>水流、溶解、出露、沉积四章。到关联景点打卡后解锁，顺序不限，未解锁也可以先预览模型。</p></div>
        <span class="water-count">${done} / 4 章</span>
      </div>
      <div class="chapter-grid">${E.CHAPTERS.map((c, i) => {
        const open = isOpen(c.id), earned = progress(c.id).earnedAt;
        return `<button class="chapter-card${earned ? ' is-earned' : open ? ' is-open' : ''}" type="button" data-act="water-open" data-id="${c.id}">
          <span class="top"><span>0${i + 1} · ${esc(c.label)}</span>${icon(earned ? 'check' : open ? ICONS[c.id] : 'lock')}</span>
          <b>${NAMES[c.id]}</b>
          <small>${c.poiIds.map(p => esc(stationName(p))).join(' / ')}</small>
          <span class="state">${earned ? `已完成 · ${esc(c.reward)}` : open ? '已解锁 · 开始探索' : '到站解锁 · 可先预览'}</span>
        </button>`;
      }).join('')}</div>
      ${S.water.badgeAt ? `<p class="water-badge">${icon('stamp')}四章集齐，收下「山水同行者」。</p>` : ''}
      <p class="note">模型与动画是科普示意：地下剖面不是现场测绘，演示时间不对应真实年限。到站打卡是手动记录，不核验位置。</p>`;
  };

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
  const shown = () => !view().hidden;

  const DROP = '<path d="M30 3C24 19 9 31 9 45a21 21 0 0042 0C51 31 36 19 30 3" fill="#62c9ca"/><circle cx="24" cy="44" r="2" fill="#315858"/><circle cx="36" cy="44" r="2" fill="#315858"/>';
  function shell() {
    view().innerHTML = `
      <header class="water-top">
        <button class="icon-btn" type="button" data-act="water-close" aria-label="返回游览">${icon('prev')}</button>
        <div class="water-tabs" role="tablist" aria-label="四章" id="waterTabs"></div>
      </header>
      <div class="water-body" id="waterBody">
        <div class="water-canvas" id="waterScene" data-render-state="loading">
          <div class="water-fallback"><div class="fallback-ponds"><span></span><span></span><span></span><span></span></div><p id="waterFallbackTitle">过程示意</p><small id="waterFallbackCopy"></small></div>
          <span class="water-scene-label" id="waterSceneLabel"></span>
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
        <div class="water-story"><span class="water-stage-label" id="waterStageLabel"></span><h2 id="waterTitle"></h2><p id="waterStageCopy"></p></div>
        <fieldset class="water-game" id="waterGame"><legend>本章互动</legend></fieldset>
        <div class="water-feedback" id="waterFeedbackBox">
          <span class="ico" id="waterFeedbackIco"></span>
          <div class="t"><p id="waterFeedback" role="status"></p><span class="meta"><span id="waterProgress"></span><span id="waterReward"></span></span></div>
        </div>
        <button class="btn btn-primary water-action" type="button" data-act="water-action" id="waterAction"></button>
        <button class="btn btn-ghost water-action" type="button" data-act="water-step" id="waterStep" hidden>查看下一状态</button>
        <p class="note water-science" id="waterScience"></p>
      </div>`;
    view().setAttribute('aria-labelledby', 'waterTitle');
    bindDrag({ source: 'co2Token', target: 'co2DropTarget', overlay: 'co2Interaction', chapter: 'dissolution', action: 'charge' });
    bindDrag({ source: 'waterDropHandle', target: 'waterDropNextTarget', overlay: 'waterDropInteraction', chapter: 'deposition', action: 'start' });
  }

  HL.openWater = id => {
    if (!view().innerHTML) shell();
    cancelDrag();
    if (id && chapter(id)) S.water.active = id;
    forestPick = null; forestHintPair = []; springHint = null; springSelected = null;
    HL.store.save();
    HL.closeSheet();
    view().hidden = false;
    $('#waterBody').scrollTop = 0;
    renderGame();
    loadScene();
    if (!fallbackTimer) fallbackTimer = setInterval(fallbackTick, 100);
    $('[data-act="water-close"]').focus({ preventScroll: true });
  };

  function closeWater() {
    cancelDrag(); HL.store.save();
    view().hidden = true;
    clearInterval(fallbackTimer); fallbackTimer = 0;
    if (S.page === 'tour') HL.pages.tour.render();
  }

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
    else sync();
  }

  /* ---------- 渲染 ---------- */
  function feedbackOf(id, p, open) {
    const c = COPY[id];
    if (!open) return { text: '模型可预览；到达关联景点打卡后，这一章会打开互动。', state: 'locked' };
    if (p.won) return { text: `已收下「${chapter(id).reward}」。${c.poi}`, state: 'complete' };
    const fresh = id === 'flow' || id === 'emergence' ? p.moves === 0 : id === 'dissolution' ? !p.charged && p.elapsed === 0 : p.sequence === 0 && p.fraction === 0 && !p.running;
    if (fresh) return { text: c.firstHint, state: 'hint' };
    if (id === 'flow') return { text: E.forestInfo(p).connected ? c.phase.connected : c.phase.idle, state: 'process' };
    if (id === 'dissolution') return p.charged ? (p.elapsed >= 8 ? { text: c.phase.complete, state: 'complete' } : { text: c.phase.active, state: 'process' }) : { text: c.phase.idle, state: 'hint' };
    if (id === 'emergence') return { text: E.springInfo(p).connected ? c.phase.active : c.phase.idle, state: 'process' };
    if (p.sequence === 9) return { text: c.phase.complete, state: 'complete' };
    if (p.running && p.travel < 1) return { text: c.phase.travel, state: 'process' };
    if (p.running) return { text: c.phase[['growth', 'fill', 'overflow'][p.sequence % 3]], state: 'process' };
    if (p.sequence > 0 && p.sequence % 3 === 0) return { text: `这一片彩池已经完成。${c.poi}`, state: 'process' };
    return { text: c.phase.idle, state: 'hint' };
  }

  function stageCopy(id, p) {
    const c = COPY[id];
    if (id === 'flow' && E.forestInfo(p).connected) return `${c.copy} ${c.phase.connected}`;
    if (id === 'dissolution' && p.charged) return `${c.copy} ${p.elapsed >= 8 ? c.phase.complete : c.phase.active}`;
    if (id === 'emergence' && E.springInfo(p).connected) return `${c.copy} ${c.phase.active}`;
    if (id === 'deposition') {
      const phase = p.won ? 'complete' : p.running && p.travel < 1 ? 'travel' : p.running ? ['growth', 'fill', 'overflow'][p.sequence % 3] : p.sequence === 9 ? 'complete' : 'idle';
      return `${c.copy} ${c.poi} ${c.phase[phase]}`;
    }
    return c.copy;
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
      <div class="forest-intro"><b>水源 ↓</b><span>已交换 ${p.moves} 次 · 不限步数</span></div>
      <div class="forest-board" aria-label="六行五列林间坡面，交换相邻落叶">${p.tiles.map((v, i) => {
        const wet = info.wet.includes(i), sel = forestPick === i, hint = forestHintPair.includes(i);
        const cls = `forest-cell leaf-${v}${p.open[i] ? ' opened' : ''}${wet ? ' wet' : ''}${sel ? ' selected' : ''}${hint ? ' hinted' : ''}${animate && p.lastClear.includes(i) ? ' scattered' : ''}`;
        const label = `第${Math.floor(i / 5) + 1}行第${i % 5 + 1}列，${v === -1 ? '固定岩石' : v === -2 ? '枝条，邻近消除可松动' : labels[v]}${wet ? '，水路已连通' : p.open[i] ? '，地面已打开' : ''}`;
        return gameBtn('pick', i, `class="${cls}" aria-pressed="${sel}" aria-label="${label}" ${!open || v < 0 || p.won || info.connected ? 'disabled' : ''}`,
          `<svg viewBox="0 0 36 36" aria-hidden="true">${LEAF[v]}</svg>${wet ? '<span class="forest-ripple"></span>' : ''}`);
      }).join('')}</div>
      <div class="forest-outlet${info.connected ? ' flowing' : ''}">↓ 土壤与裂隙 · 渗入地下水</div>
      <div class="game-tools">${gameBtn('hint', '', `class="btn btn-ghost" ${locked ? 'disabled' : ''}`, '给我一个提示')}${gameBtn('shuffle', '', `class="btn btn-ghost" ${locked ? 'disabled' : ''}`, '微风换一盘')}</div>
      <p class="game-legend">三种叶形可交换 · 岩石绕行 · 枝条靠邻消除。消除后新落叶轻落，已打开的地面与水路保留。</p>
      ${info.connected ? '<div class="game-discovery"><b>径流 → 下渗</b><p>水沿坡面低处汇集，再进入土壤和岩石裂隙。落叶层也能蓄水，让一部分水慢慢渗下去。</p></div>' : ''}`;
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
      <div class="game-tools">${gameBtn('springHint', '', `class="btn btn-ghost" ${!open || info.connected ? 'disabled' : ''}`, '看看哪一块需要转动')}<span>已转动 ${p.moves} 次</span></div>
      <p class="game-legend">点击一次旋转 90° · 开口对齐才通水 · 不限步数</p>
      <div class="game-discovery" ${info.connected ? '' : 'hidden'}><b>地下水来到地表</b><div class="water-meter"><i id="springFill"></i></div><span id="springText">泉流与气泡正在出现…</span><p>水从裂隙出露，气泡向上离开水体。下一章看看沉积怎样留下池沿。</p></div>`;
  }

  function renderGame() {
    const id = S.water.active, c = chapter(id), copy = COPY[id], p = progress(id), open = isOpen(id);
    $('#waterTabs').innerHTML = E.CHAPTERS.map((x, i) => `<button type="button" role="tab" aria-selected="${x.id === id}" data-act="water-open" data-id="${x.id}" class="${progress(x.id).earnedAt ? 'is-earned' : isOpen(x.id) ? '' : 'is-locked'}">
      <small>0${i + 1}</small>${esc(x.label)}${progress(x.id).earnedAt ? icon('check') : isOpen(x.id) ? '' : icon('lock')}</button>`).join('');
    const host = $('#waterScene');
    host.dataset.chapter = id;
    $('#waterSceneLabel').textContent = copy.scene;
    $('#waterSceneState').textContent = p.won ? '本章已完成' : open ? '已到站 · 可互动' : '模型预览 · 互动未解锁';
    $('#waterFallbackTitle').textContent = c.label + '过程示意';
    $('#waterFallbackCopy').textContent = copy.fallback;
    $('#waterStageLabel').textContent = `第 ${E.CHAPTERS.indexOf(c) + 1} 章 · ${c.label} · ${c.poiIds.map(stationName).join(' / ')}`;
    $('#waterTitle').textContent = c.title;
    $('#waterScience').textContent = copy.science;
    $('#waterGesture').textContent = copy.gesture;

    const unlock = $('#waterUnlock');
    unlock.hidden = open;
    unlock.innerHTML = open ? '' : `<b>${icon('pin')}到达关联景点，打开这一章</b>
      <p>到下面任意一处，在「本站攻略」或这里点「到站打卡」即可解锁。打卡是手动记录，不核验位置。</p>
      <ul class="rows">${c.poiIds.map(pid => `<li class="unlock-row"><span><b>${esc(stationName(pid))}</b>${esc(idx.station[pid].area)}</span>
        <button class="btn btn-ghost" type="button" data-act="station" data-id="${pid}">介绍</button>
        <button class="btn btn-primary" type="button" data-act="water-checkin" data-id="${pid}">${icon('stamp')}我在这里，到站打卡</button></li>`).join('')}</ul>`;

    const game = $('#waterGame');
    game.disabled = !open;
    if (id === 'flow') game.innerHTML = forestBoard(p, open);
    if (id === 'emergence') game.innerHTML = springBoard(p, open);
    if (id === 'dissolution') game.innerHTML = `<legend>让水带上 CO₂</legend>${p.charged
      ? '<p class="game-legend center">顺着水流看，石灰岩的轮廓正在慢慢改变。</p>'
      : gameBtn('charge', '', 'class="btn btn-ghost game-wide"', '也可点击，把 CO₂ 交给水滴')}<div class="water-meter"><i id="waterMeter"></i></div>`;
    if (id === 'deposition') game.innerHTML = `<legend>${p.sequence === 9 ? '三片新彩池，连成一段风景' : `正在生成第 ${Math.floor(p.sequence / 3) + 1} 片新彩池`}</legend>
      <div class="pool-phases">${['池沿生长', '水流积累', '水流溢出'].map((t, i) => `<span class="${p.sequence < 9 && p.sequence % 3 === i ? 'is-now' : ''}">${t}</span>`).join('')}</div>
      <div class="water-meter"><i id="waterMeter"></i></div><p class="game-legend">拖动同一滴水到光环处，也可用下方按钮带它前往。</p>`;

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
    $('#waterStageCopy').textContent = stageCopy(id, p);
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
    action.textContent = p.won ? '重新体验本章' : p.running ? status : p.sequence === 0 ? '带水滴去第一处 · 生长彩池' : '带水滴去下一处 · 继续生长';
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
    if (r.ok && connected) $('#waterScene').scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
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
    if (r.earned) HL.toast(r.message + (S.water.badgeAt ? ' 四章已集齐。' : ''));
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
  HL.act('water-close', closeWater);
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
    HL.toast(`收下「${stationName(sid)}」印章，解锁「${chapter(S.water.active).label}」`, { label: '撤销', fn: () => { HL.store.restore(before); renderGame(); } });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && view() && !view().hidden && !document.querySelector('.layer:not([hidden])')) closeWater();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelDrag(); HL.store.save(); } });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => { if (view() && !view().hidden) renderGame(); });
  window.addEventListener('pagehide', e => { HL.store.save(); cancelDrag(); if (!e.persisted && scene) { scene.dispose(); scene = null; } });
})();
