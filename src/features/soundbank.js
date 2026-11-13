/* 听见黄龙 · 声景手册：沿途收集 9 种声音（水、风、鸟、静），和「栈道手册」（features/sound.js）并存。数据见 data/sounds.js。

   采集是一个固定的小仪式：到了地点，按下按钮录 recordSeconds 秒，屏幕上从左到右画出这段声音的声纹，
   录完生成一张「声音标本」贴进声景手册。录音存在浏览器的 IndexedDB，声纹图（小 webp）和信息存在 S.sound.bank，都不上传。

   粗略判断：不用 AI 模型，只看几项频谱特征——
     安静：整体音量很低；
     水声：频谱平坦（各个音高都有能量）且音量稳定；
     风声：能量集中在低频，音量一阵一阵起伏；
     鸟鸣：两千赫以上的能量一阵一阵地突然冒出来（鸟叫是短促的高音，常常快速滑音，不一定是一个尖峰）；
     人声：一千赫左右以下有音调，整体偏低。
   判断只是建议，游客可以改；以后可以换成 YAMNet 这类模型。
   对外：HL.bankRender()、HL.openBankRec(id)、HL.bankClassify(统计)（方便测试）。 */
(() => {
  'use strict';
  const { $, esc, icon, S, idx } = HL;
  const D = HL.data.sounds, KINDS = D.kinds, TG = D.targets, SEC = D.recordSeconds;
  const kind = id => KINDS.find(k => k.id === id);
  const byId = id => TG.find(t => t.id === id);
  const save = () => HL.store.save();
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmtDate = iso => { const d = new Date(iso); return `${d.getMonth() + 1} 月 ${d.getDate()} 日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const { tape, photo, strip, forest } = HL.pc;
  const stPhoto = t => { const s = idx.station[t.station]; return s && s.photo ? s.photo.src : 'assets/sound/cover.webp'; };
  const place = t => t.place || idx.station[t.station].name;
  const done = () => TG.filter(t => S.sound.bank[t.id]).length;

  /* 声纹圆盘（features/sounddisc.js）：按类别换风格，按「采集点 + 录音时间」定种子 */
  const shortDate = iso => { const d = new Date(iso); return `${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const discOpts = (t, k, at) => ({ kind: k, seed: t.id + at, text: `${place(t)} · ${shortDate(at)} · ${kind(k).label}` });
  const disc = (t, b, alt = '') => b.spec
    ? `<img class="bk-disc" data-disc="${t.id}" src="${HL.soundDisc.url(b.spec, discOpts(t, b.kind, b.at))}" alt="${esc(alt)}" draggable="false">`
    : `<img class="bk-disc is-legacy" data-disc="${t.id}" src="${b.img}" alt="${esc(alt)}" draggable="false">`;
  /* 旧版存的是矩形声纹图：读像素换成频谱数据，存回去，再画成圆盘 */
  let migrating = false;
  async function migrate() {
    const old = TG.filter(t => S.sound.bank[t.id] && !S.sound.bank[t.id].spec && S.sound.bank[t.id].img);
    if (!old.length || migrating) return;
    migrating = true;
    for (const t of old) { const spec = await HL.soundDisc.fromImage(S.sound.bank[t.id].img); if (spec) { S.sound.bank[t.id].spec = spec; delete S.sound.bank[t.id].img; } }
    migrating = false; save(); HL.bankRender();
  }

  /* ---------- 录音存储：IndexedDB，只在本机 ---------- */
  const DBN = 'huanglong-sound', ST = 'clips';
  function idb(mode, fn) {
    return new Promise((ok, no) => {
      if (!window.indexedDB) { no(new Error('no indexedDB')); return; }
      const r = indexedDB.open(DBN, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(ST);
      r.onerror = () => no(r.error);
      r.onsuccess = () => {
        const tx = r.result.transaction(ST, mode), q = fn(tx.objectStore(ST));
        tx.oncomplete = () => { ok(q && q.result); r.result.close(); };
        tx.onerror = () => { no(tx.error); r.result.close(); };
      };
    });
  }
  const clipPut = (id, blob) => idb('readwrite', s => s.put(blob, id)).catch(() => null);
  const clipGet = id => idb('readonly', s => s.get(id)).catch(() => null);
  const clipClear = () => idb('readwrite', s => s.clear()).catch(() => null);

  /* ---------- 声景手册的页 ---------- */
  const CHAPTERS = [['how', '怎么采'], ['map', '地图'], ['water', '水'], ['wind', '风'], ['bird', '鸟'], ['quiet', '静'], ['wall', '标本']];

  function slot(t) {
    const b = S.sound.bank[t.id], k = kind(t.kind);
    const got = b ? `<div class="bk-spec" style="--k:${kind(b.kind).color}">${tape()}${disc(t, b, `${t.title}的声纹标本`)}
        <div class="bk-spec-meta">${strip(kind(b.kind).label, 'bk-kind')}<small>${esc(fmtDate(b.at))}</small>
          <button type="button" data-act="bank-play" data-id="${t.id}" aria-label="播放${esc(t.title)}">${icon('play')}</button></div></div>`
      : `<button class="bk-empty" type="button" data-act="bank-rec" data-id="${t.id}" style="--k:${k.color}">${icon('audio')}到这里录 ${SEC} 秒</button>`;
    return `<div class="bk-slot${b ? ' is-got' : ''}">
        <div class="bk-head">${photo(stPhoto(t), place(t), 'bk-thumb')}<div><small>${esc(place(t))}</small><b>${esc(t.title)}</b></div>
          <i class="bk-tick" style="--k:${k.color}">${b ? '采' : k.name}</i></div>
        <p class="bk-listen">${esc(t.listen)}</p>${got}</div>`;
  }

  function routeMap() {
    /* 竖着画：迎宾池在下，五彩池在上，和往沟里走的方向一致。景点名写在右边，采集点画在左边 */
    const ST = HL.data.stations, W = 300, H = 330, pad = 14;
    const pos = i => { const u = i / (ST.length - 1); return [150 + Math.sin(u * Math.PI * 2.3) * 34, H - pad - u * (H - 2 * pad)]; };
    let d = '', dots = '';
    ST.forEach((s, i) => { const [x, y] = pos(i); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); });
    ST.forEach((s, i) => {
      const [x, y] = pos(i), here = TG.filter(t => t.station === s.id);
      dots += `<circle class="mp-st${here.length ? ' is-t' : ''}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${here.length ? 4 : 2.6}"/>`;
      dots += `<text class="mp-name${here.length ? ' is-t' : ''}" x="${(x + 10).toFixed(1)}" y="${(y + 3).toFixed(1)}">${esc(s.name)}</text>`;
      here.forEach((t, j) => {
        const b = S.sound.bank[t.id], k = kind(t.kind), cx = x - 17 - j * 17;
        dots += `<g class="mp-t${b ? ' is-got' : ''}" data-act="bank-goto" data-id="${t.id}" role="button" aria-label="${esc(t.title)}">
          <circle cx="${cx.toFixed(1)}" cy="${y.toFixed(1)}" r="7.5" fill="${b ? k.color : '#fffdf6'}" stroke="${k.color}"/><text x="${cx.toFixed(1)}" y="${(y + 3.2).toFixed(1)}" fill="${b ? '#fff' : k.color}">${k.name}</text></g>`;
      });
    });
    return `<svg class="bk-map" viewBox="0 0 ${W} ${H}" role="group" aria-label="声音地图：九种声音在沿途哪里，从迎宾池往上到五彩池">
      <path class="mp-road" d="${d}"/>${dots}</svg>`;
  }

  function pages() {
    const P = [], n = done();
    const add = (ch, cls, html) => P.push({ ch, cls, html });
    const run = t => `<header class="hb-run"><span>${esc(t)}</span><span class="hb-pn"></span></header>`;
    const fall = idx.station['flying-waterfall'];

    add('', 'hb-cover is-bank', `
      ${photo(fall.photo.src, '飞瀑流辉', 'cv-photo')}
      <img class="cv-birds" src="assets/sound/poly-feed.webp" alt="" draggable="false">
      <div class="cv-title">${strip('HUANGLONG · FIELD RECORDING', 'is-small')}<h3>声景手册</h3>${strip('九种黄龙的声音', 'is-gold')}</div>
      <p class="cv-motto">走到一个地方，停下来，录十秒。把水、风、鸟和安静，做成自己的声音标本。</p>
      <span class="cv-count">已采集 ${n} / ${TG.length}</span>
      <span class="hb-hint">从右边往左拖，翻开 ←</span>${forest()}`);

    add('how', 'bk-how', `${run('怎么采')}
      <h4>把声音做成标本</h4>
      <ol class="bk-steps">
        <li><b>找到地点</b>按地图走，九个地方各有一种声音</li>
        <li><b>停下来，按下录音</b>不说话，录 ${SEC} 秒，看着声纹一点点画出来</li>
        <li><b>贴进声景手册</b>手机会粗略猜是哪类声音，猜错了可以改</li></ol>
      <div class="bk-kinds">${KINDS.filter(k => k.id !== 'voice').map(k => `<span style="--k:${k.color}"><b>${k.name}</b><small>${esc(k.hint)}</small></span>`).join('')}</div>
      <p class="hb-small">录音和声纹只存在这台手机上，不上传。清空本机记录时会一起删掉。</p>`);

    add('map', 'bk-mapp', `${run('声音地图')}
      <h4>九种声音在哪</h4>
      <p class="hb-small">从下往上走：迎宾池到五彩池。点一个彩色圆点，翻到它那一页。</p>
      ${routeMap()}
      <div class="bk-legend">${KINDS.filter(k => k.id !== 'voice').map(k => `<span style="--k:${k.color}"><i>${k.name}</i>${TG.filter(t => t.kind === k.id && S.sound.bank[t.id]).length} / ${TG.filter(t => t.kind === k.id).length}</span>`).join('')}</div>`);

    for (const k of KINDS.filter(x => x.id !== 'voice')) {
      const list = TG.filter(t => t.kind === k.id);
      for (let i = 0; i < list.length; i += 2) {
        const two = list.slice(i, i + 2);
        add(k.id, `bk-kindp kind-${k.id}`, `${run(`${k.label}${list.length > 2 ? ` · ${i / 2 + 1}` : ''}`)}
          <div class="bk-kh" style="--k:${k.color}"><i>${k.name}</i><div><h4>${esc(k.label)}</h4><small>${esc(k.hint)}</small></div></div>
          ${two.map(slot).join('')}${two.length === 1 ? '<p class="hb-small bk-solo">安静不是没有声音。录下来的声纹会很淡，那正是这里的样子。</p>' : ''}`);
      }
    }

    const got = TG.filter(t => S.sound.bank[t.id]);
    add('wall', 'bk-wall', `${run('标本墙')}
      <h4>我的声音标本</h4>
      ${got.length ? `<div class="bk-grid">${got.map((t, i) => { const b = S.sound.bank[t.id]; return `<button type="button" data-act="bank-play" data-id="${t.id}" style="--r:${[-3, 2, -1.5, 2.5, -2, 1.5][i % 6]}deg;--k:${kind(b.kind).color}">${disc(t, b)}<b>${esc(t.title)}</b><small>${esc(kind(b.kind).label)}</small></button>`; }).join('')}</div>`
        : '<p class="bk-none">还没有标本。翻到「水」「风」「鸟」「静」，找一个地方录第一段。</p>'}
      <p class="hb-foot">点一张唱片，回放那一段声音</p>`);

    const all = n === TG.length;
    add('wall', `hb-end${all ? ' is-done' : ''}`, `${run('小结')}
      <h4>${all ? '声景采集者' : `还差 ${TG.length - n} 段声音`}</h4>
      <div class="hb-seal">${all ? '采' : n}</div>
      <div class="bk-sum">${KINDS.filter(k => k.id !== 'voice').map(k => { const tot = TG.filter(t => t.kind === k.id).length, c = TG.filter(t => t.kind === k.id && S.sound.bank[t.id]).length; return `<div style="--k:${k.color}"><i>${k.name}</i><span><em style="width:${c / tot * 100}%"></em></span><b>${c} / ${tot}</b></div>`; }).join('')}</div>
      <p class="hb-small">${all ? '九段声音都录到了。换个季节、换个钟点再来，同一个地方听起来会不一样。' : '研究团队发现，上午 8 点到 10 点林子里的鸟种最多。早点出发。'}</p>${forest('is-low')}`);
    add('', 'hb-back is-bank', `<img src="assets/sound/poly-pair.webp" alt="" draggable="false"><span>黄龙伴游 · 声景手册</span>${forest()}`);
    return P;
  }

  const book = HL.Handbook.create({
    name: 'bank', label: '声景手册', chapters: CHAPTERS, pages,
    getPage: () => S.sound.page2, setPage: i => { S.sound.page2 = i; save(); },
  });

  HL.bankRender = () => {
    const host = $('#sound-book');
    if (!host) return;
    book.render(host);
    migrate();
    const cnt = $('#play-sound-count');
    if (cnt) cnt.textContent = `已采集 ${done()} / ${TG.length} 段`;
    const scan = $('#sound-scan');
    if (scan) scan.innerHTML = `<b>${icon('audio')}原型：直接开始采集</b><p>实地也可以在这九个地方立小牌子，碰一碰或扫一扫就打开对应的录音页（网址 …/?rec=w-fall）。</p>
      <div class="chips">${TG.map(t => `<button class="chip${S.sound.bank[t.id] ? ' is-got' : ''}" type="button" data-act="bank-rec" data-id="${t.id}">${kind(t.kind).name} · ${esc(t.title)}</button>`).join('')}</div>`;
  };
  const targetPage = id => book.find(p => p.html.includes(`data-act="bank-rec" data-id="${id}"`) || p.html.includes(`data-act="bank-play" data-id="${id}" aria-label`));
  HL.act('bank-goto', el => book.goTo(targetPage(el.dataset.id)));

  /* ---------- 回放 ---------- */
  let player = null;
  /* 播放时对应的圆盘像唱片一样转 */
  const spin = id => document.querySelectorAll('.bk-disc').forEach(d => d.classList.toggle('is-spin', d.dataset.disc === id));
  HL.act('bank-play', async el => {
    if (player) { player.pause(); URL.revokeObjectURL(player.src); const same = player.dataset.id === el.dataset.id; player = null; spin(null); if (same) return; }
    const blob = await clipGet(el.dataset.id);
    if (!blob) { HL.toast('这段录音不在这台手机上了，只剩声纹'); return; }
    player = new Audio(URL.createObjectURL(blob)); player.dataset.id = el.dataset.id;
    player.onended = () => { URL.revokeObjectURL(player.src); player = null; spin(null); };
    player.play().then(() => spin(el.dataset.id)).catch(() => HL.toast('播放失败'));
  });

  /* ---------- 粗略判断 ---------- */
  const mean = a => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
  const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(p * (s.length - 1))] : 0; };
  HL.bankClassify = raw => {
    /* 丢掉开头几帧（麦克风刚打开时的空白） */
    const st = Object.fromEntries(Object.entries(raw).map(([k, a]) => [k, a.slice(6)]));
    const lv = pct(st.level, .5), spread = pct(st.level, .9) - pct(st.level, .1);
    const flat = mean(st.flat), low = mean(st.low), hiMed = pct(st.hiE, .5);
    const n = Math.max(1, st.hiE.length);
    const burst = st.hiE.filter((v, i) => v - hiMed > 8 && st.hiFrac[i] > .45).length / n;
    const tone = st.hiTone.filter(v => v > 20).length / n;
    const voice = st.loTone.filter((v, i) => v > 20 && st.cent[i] < 1800 && st.hiTone[i] < 15).length / n;
    const bird = Math.min(1, burst * .8 + tone);
    const sc = {
      quiet: lv < -55 ? 3 : lv < -48 ? 1.2 : 0,
      water: flat * 2.2 + (spread < 4 ? .6 : 0) + (low < .5 ? .3 : 0) - bird * 1.5,
      wind: low * 1.8 + (spread > 5 ? .6 : 0) - flat * .5,
      bird: bird * 4,
      voice: voice * 2.6,
    };
    const rank = Object.entries(sc).sort((a, b) => b[1] - a[1]);
    return { guess: rank[0][0], sure: rank[0][1] - rank[1][1] > .5, also: rank[0][0] !== 'bird' && bird > .06 ? 'bird' : null, sc, stats: { lv, spread, flat, low, burst, tone, voice } };
  };

  /* ---------- 录音弹层 ---------- */
  let rec = null; // { id, stream, ctx, an, mr, chunks, raf, t0, x, st, done }
  HL.openBankRec = id => {
    const t = byId(id), k = kind(t.kind), b = S.sound.bank[id];
    stopRec();
    const at0 = b ? b.at : new Date().toISOString();
    HL.openSheet({
      title: '采集声音', cls: 'sound-sheet bank-sheet',
      body: `
        <div class="br-hero pc-paper">${photo(stPhoto(t), place(t), 'br-photo')}<div>${strip(k.label, 'bk-kind')}<h3>${esc(t.title)}</h3><small>${esc(place(t))}</small></div></div>
        <p class="br-listen">${esc(t.listen)}</p>
        <p class="sd-tip">${icon('info')}${esc(t.tip)}</p>
        <div class="br-rec">
          <div class="br-view"><canvas id="brCanvas" width="360" height="360" aria-label="正在录的声音的声纹圆盘"></canvas><i class="br-head" id="brHead"></i></div>
          <div class="br-idle" id="brIdle">${b ? '已经采过一段，再录会替换旧的标本。' : `按下按钮，安静地录 ${SEC} 秒，指针转一圈就录完了。`}<br><small>圆心是低音，外圈是高音</small></div>
          <button class="br-btn" type="button" data-act="bank-start" data-id="${id}" id="brBtn" aria-label="开始录音"><i></i><span id="brBtnText">录 ${SEC} 秒</span></button>
          <p class="sd-result" id="brMsg" role="status"></p>
        </div>
        <div class="br-out" id="brOut" hidden></div>
        <p class="note">录音和声纹只存在这台手机上，不上传。分类是按频谱特征粗略判断的，可以改；换了类别，圆盘的样式也跟着换。</p>`,
    });
    const cv = $('#brCanvas');
    if (b && b.spec) HL.soundDisc.draw(cv, b.spec, discOpts(t, b.kind, b.at));
    else HL.soundDisc.live(cv, discOpts(t, t.kind, at0));
  };

  async function startRec(id) {
    if (rec) return;
    const msg = $('#brMsg');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { msg.textContent = '这个浏览器不支持录音。'; return; }
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }); }
    catch (e) { msg.textContent = '没拿到麦克风权限。可以在浏览器设置里允许后再试。'; return; }
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const an = ctx.createAnalyser(); an.fftSize = 2048; an.smoothingTimeConstant = .2;
    ctx.createMediaStreamSource(stream).connect(an);
    let mr = null; const chunks = [];
    if (window.MediaRecorder) {
      const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac'].find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m));
      try { mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined); mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); }; mr.start(); } catch (e) { mr = null; }
    }
    const tg = byId(id), at = new Date().toISOString(), disc0 = HL.soundDisc.live($('#brCanvas'), discOpts(tg, tg.kind, at));
    $('#brHead').style.setProperty('--a0', disc0.a0 + 'rad');
    rec = { id, at, disc: disc0, frames: [], cur: 0, acc: new Array(HL.soundDisc.F).fill(0), stream, ctx, an, mr, chunks, raf: 0, t0: performance.now(), freq: new Float32Array(an.frequencyBinCount), wave: new Float32Array(an.fftSize),
      st: { level: [], flat: [], low: [], hiTone: [], loTone: [], cent: [], hiE: [], hiFrac: [] } };
    $('#brIdle').hidden = true; $('#brOut').hidden = true; $('#brHead').classList.add('is-on');
    const btn = $('#brBtn'); btn.classList.add('is-rec'); btn.dataset.act = 'bank-cancel'; btn.setAttribute('aria-label', '停止录音');
    msg.textContent = '在录了。别说话，听。';
    tick();
  }

  function tick() {
    const r = rec, cv = $('#brCanvas');
    if (!r || !cv) { stopRec(); return; }
    const el = (performance.now() - r.t0) / 1000;
    r.an.getFloatFrequencyData(r.freq); r.an.getFloatTimeDomainData(r.wave);
    const sr = r.ctx.sampleRate, bw = sr / r.an.fftSize, bin = hz => Math.min(r.freq.length - 1, Math.round(hz / bw));
    const db = i => Math.max(-120, isFinite(r.freq[i]) ? r.freq[i] : -120);
    /* 这一帧的声纹：按对数频段取最大值，攒够一个时间片就画到圆盘上，指针跟着转 */
    const DS = HL.soundDisc, idxT = Math.min(DS.T - 1, Math.floor(el / SEC * DS.T));
    for (let f = 0; f < DS.F; f++) {
      const i0 = bin(DS.edge(f)), i1 = Math.max(i0, bin(DS.edge(f + 1)) - 1);
      let m = -120; for (let i = i0; i <= i1; i++) m = Math.max(m, db(i));
      r.acc[f] = Math.max(r.acc[f], Math.max(0, Math.min(1, (m + 100) / 70)));
    }
    if (r.cur < idxT) flush(r, idxT);
    $('#brHead').style.setProperty('--p', Math.min(1, el / SEC));
    /* 特征 */
    let sum = 0; for (const v of r.wave) sum += v * v;
    const lv = 20 * Math.log10(Math.sqrt(sum / r.wave.length) + 1e-9);
    let ln = 0, pw = 0, lo = 0, cf = 0, n = 0, hi = 0, all = 0;
    for (let i = bin(200); i <= bin(8000); i++) { const p = 10 ** (db(i) / 10) + 1e-14; ln += Math.log(p); pw += p; cf += p * i * bw; n++; if (i <= bin(500)) lo += p; }
    for (let i = bin(50); i <= bin(9000); i++) { const p = 10 ** (db(i) / 10) + 1e-14; all += p; if (i >= bin(2000)) hi += p; }
    const peak = (a, b) => { const v = []; for (let i = bin(a); i <= bin(b); i++) v.push(db(i)); v.sort((p, q) => p - q); return v[v.length - 1] - v[v.length >> 1]; };
    const s = r.st;
    s.level.push(lv); s.flat.push(Math.exp(ln / n) / (pw / n)); s.low.push(lo / pw); s.cent.push(cf / pw);
    s.hiTone.push(peak(2000, 9000)); s.loTone.push(peak(150, 1200));
    s.hiE.push(10 * Math.log10(hi + 1e-14)); s.hiFrac.push(hi / all);
    if (el >= SEC) { finish(); return; }
    $('#brBtnText').textContent = `${Math.ceil(SEC - el)} 秒`;
    r.raf = requestAnimationFrame(tick);
  }

  /* 把攒好的时间片收进数据并画出来；手机卡顿一次跨过好几片时，这几片都用同一组数值 */
  function flush(r, to = r.cur + 1) {
    const b = r.acc.slice();
    while (r.cur < to) { r.frames[r.cur] = b; r.disc.push(r.cur, b); r.cur++; }
    r.acc.fill(0);
  }

  function release() {
    if (!rec) return;
    cancelAnimationFrame(rec.raf);
    rec.stream.getTracks().forEach(t => t.stop());
    rec.ctx.close();
  }
  function stopRec() { if (!rec) return; if (rec.mr && rec.mr.state !== 'inactive') try { rec.mr.stop(); } catch (e) { /* 已停止 */ } release(); rec = null; }

  function finish() {
    const r = rec;
    cancelAnimationFrame(r.raf);
    const result = HL.bankClassify(r.st);
    /* 频谱数据编成字符串存进进度里，圆盘随时按类别重画 */
    if (r.cur < HL.soundDisc.T) flush(r, HL.soundDisc.T);
    const spec = HL.soundDisc.encode(r.frames);
    const done = blob => { release(); rec = null; showResult(r.id, spec, r.at, blob, result); };
    if (r.mr && r.mr.state !== 'inactive') { r.mr.onstop = () => done(r.chunks.length ? new Blob(r.chunks, { type: r.mr.mimeType || 'audio/webm' }) : null); r.mr.stop(); }
    else done(null);
  }

  let pending = null;
  function showResult(id, spec, at, blob, res) {
    pending = { id, spec, at, blob, kind: res.guess, guess: res.guess };
    const cv = $('#brCanvas'); if (cv) HL.soundDisc.draw(cv, spec, discOpts(byId(id), res.guess, at));
    const t = byId(id), btn = $('#brBtn');
    if (!btn) return;
    btn.classList.remove('is-rec'); btn.dataset.act = 'bank-start'; btn.setAttribute('aria-label', '重新录音'); $('#brBtnText').textContent = '重录';
    $('#brHead').classList.remove('is-on');
    $('#brMsg').textContent = '';
    const g = kind(res.guess), match = res.guess === t.kind;
    const out = $('#brOut'); out.hidden = false;
    out.innerHTML = `<p class="br-guess">${res.sure ? '听起来' : '有点像'}是<b style="color:${g.color}">${g.label}</b>${res.also && res.guess !== 'bird' ? '，里面还夹着鸟鸣' : ''}。${match ? '' : `这里要采的是${kind(t.kind).label}，换个位置再录也行，或者就这样收下。`}</p>
      <div class="br-pick" role="radiogroup" aria-label="改成别的类别">${KINDS.map(k => `<button type="button" role="radio" data-act="bank-kind" data-k="${k.id}" aria-checked="${k.id === res.guess}" style="--k:${k.color}">${k.label}</button>`).join('')}</div>
      <div class="sheet-foot br-foot">${blob ? `<button class="btn btn-ghost" type="button" data-act="bank-preview">${icon('play')}听一遍</button>` : ''}
        <button class="btn btn-primary" type="button" data-act="bank-save">${icon('check')}贴进声景手册</button></div>
      ${blob ? '' : '<p class="note">这个浏览器存不了音频，只会保存声纹图。</p>'}`;
  }

  HL.act('bank-rec', el => HL.openBankRec(el.dataset.id));
  HL.act('bank-start', el => startRec(el.dataset.id));
  HL.act('bank-cancel', () => {
    stopRec();
    const btn = $('#brBtn'); if (!btn) return;
    btn.classList.remove('is-rec'); btn.dataset.act = 'bank-start'; $('#brBtnText').textContent = `录 ${SEC} 秒`;
    $('#brMsg').textContent = '已停止，没有保存。'; $('#brHead').classList.remove('is-on');
  });
  HL.act('bank-kind', el => {
    if (!pending) return;
    pending.kind = el.dataset.k;
    const cv = $('#brCanvas'); if (cv) HL.soundDisc.draw(cv, pending.spec, discOpts(byId(pending.id), pending.kind, pending.at));
    el.parentNode.querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', String(b === el)));
  });
  HL.act('bank-preview', () => {
    if (!pending || !pending.blob) return;
    const a = new Audio(URL.createObjectURL(pending.blob)); a.onended = () => URL.revokeObjectURL(a.src); a.play().catch(() => {});
  });
  HL.act('bank-save', async () => {
    if (!pending) return;
    const p = pending; pending = null;
    S.sound.bank[p.id] = { at: p.at, kind: p.kind, guess: p.guess, spec: p.spec };
    save();
    if (p.blob) await clipPut(p.id, p.blob);
    HL.closeSheet();
    S.sound.book = 'collect'; save();
    if (S.page !== 'play') HL.setPage('play'); else HL.pages.play.render();
    const i = targetPage(p.id);
    if (i >= 0) { S.sound.page2 = i; save(); HL.bankRender(); }
    const sec = $('#h-sound'); if (sec) requestAnimationFrame(() => sec.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }));
    HL.toast(`「${byId(p.id).title}」贴进声景手册了`);
  });

  /* 关弹层、切后台立刻停录；清空本机记录时连录音一起删 */
  const closeSheet = HL.closeSheet;
  HL.closeSheet = () => { stopRec(); pending = null; closeSheet(); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopRec(); });
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('[data-act="reset"]')) clipClear(); }, true);

  /* 网址直达：…/?rec=w-fall（以后在地点的小牌子上贴 NFC 或二维码） */
  HL.bankFromUrl = () => {
    const params = new URLSearchParams(location.search), id = params.get('rec');
    if (!id || !byId(id)) return;
    params.delete('rec');
    history.replaceState(null, '', location.pathname + (params.toString() ? '?' + params : '') + location.hash);
    S.sound.book = 'collect'; save();
    HL.setPage('play');
    HL.openBankRec(id);
  };
})();
