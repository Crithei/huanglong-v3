/* 听见黄龙：声音驿站 + 声景手册（互动页第三块）。数据见 data/birds.js。
   现场设想：栈道上的声音驿站贴 NFC 或二维码，里面只是一个网址 …/?tag=s1。
   手机碰一碰或扫一扫就打开这一站：盖章收进手册，再认声纹、安静半分钟、写一句记录。
   原型阶段没有实物，互动页里有「模拟碰一碰」按钮代替。

   声景手册：一本可以用手指翻的小册子。每一页是一张「纸」，绕左侧书脊转动；
   手指拖动时纸跟着转、光影跟着变，松手过半就翻过去，否则弹回。点右侧翻下一页，点左侧翻回。

   麦克风：只在手机上实时画声纹、估相对音量，不录音、不上传；关掉弹层或切到后台立即停止。
   进度存在 S.sound：got 收集时间 / quiz 认声纹答对 / quiet 安静挑战结果 / note 记录 / page 翻到第几页。
   对外：HL.soundRender()（互动页调用）、HL.openSoundStop(id, 来自扫码?)、HL.sonogram(站, 选项)。 */
(() => {
  'use strict';
  const { $, esc, icon, S } = HL;
  const B = HL.data.birds, STOPS = B.stops;
  const byId = id => STOPS.find(s => s.id === id);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmtDate = iso => { const d = new Date(iso); return `${d.getMonth() + 1} 月 ${d.getDate()} 日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const save = () => HL.store.save();

  /* ---------- 声纹示意图：横轴 0–3 秒，纵轴 0–10 千赫 ---------- */
  HL.sonogram = (stop, { axes = false, dark = false, cls = '' } = {}) => {
    const W = 300, H = 120, L = axes ? 24 : 0, Bm = axes ? 14 : 0;
    const x = t => L + t / 3 * (W - L), y = f => (H - Bm) - f / 10 * (H - Bm);
    const paths = [];
    for (const n of stop.notes) {
      if (n.shape === 'sweep') paths.push(`M${x(n.t)} ${y(n.f0)}L${x(n.t + n.d)} ${y(n.f1)}`);
      else if (n.shape === 'arc') paths.push(`M${x(n.t)} ${y(n.f0)}Q${x(n.t + n.d / 2)} ${y(n.peak * 2 - (n.f0 + n.f1) / 2)} ${x(n.t + n.d)} ${y(n.f1)}`);
      else if (n.shape === 'trill') {
        const k = n.n || 8, step = n.d / k;
        for (let i = 0; i < k; i++) {
          const f = n.f0 + (n.f1 - n.f0) * (i / Math.max(1, k - 1)), t = n.t + i * step;
          paths.push(`M${x(t)} ${y(f + .7)}L${x(t + step * .6)} ${y(f - .7)}`);
        }
      }
    }
    const d = paths.join('');
    const grid = [2, 4, 6, 8].map(f => `<path d="M${L} ${y(f)}H${W}" class="sg-grid"/>`).join('');
    const ax = axes ? `<g class="sg-ax"><text x="${L - 4}" y="${y(8) + 3}">8</text><text x="${L - 4}" y="${y(4) + 3}">4</text><text x="${L - 4}" y="${H - Bm + 3}">0</text>
      <text x="${L}" y="${H - 2}">0</text><text x="${x(1.5)}" y="${H - 2}">1.5</text><text x="${W - 2}" y="${H - 2}" text-anchor="end">3 秒</text><text x="2" y="10" text-anchor="start">千赫</text></g>` : '';
    return `<svg class="sonogram${dark ? ' is-dark' : ''} ${cls}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(stop.bird)}叫声的声纹示意图">${grid}${ax}
      <path d="${d}" class="sg-glow"/><path d="${d}" class="sg-line"/></svg>`;
  };

  /* ---------- 收集 ---------- */
  function collect(id) {
    if (S.sound.got[id]) return false;
    S.sound.got[id] = new Date().toISOString();
    save();
    return true;
  }
  const doneCount = () => STOPS.filter(s => S.sound.got[s.id]).length;

  /* ---------- 声景手册 ---------- */
  function pages() {
    const n = doneCount();
    const list = [];
    list.push(`<div class="hb-cover">
        <span class="hb-cover-top">HUANGLONG · SOUNDSCAPE</span>
        <h3>声景手册</h3><p>听见黄龙 · 鸟的声音身份证</p>
        ${HL.sonogram(STOPS[0], { cls: 'hb-cover-sg' })}
        <span class="hb-cover-count">已收集 ${n} / ${STOPS.length}</span>
        <span class="hb-hint">向左拖动，翻开手册 ←</span></div>`);
    list.push(`<div class="hb-page hb-guide">
        <span class="hb-no">使用说明</span>
        <h4>在栈道上，收集鸟的声音</h4>
        <ol><li><b>找到声音驿站</b>栈道边的小木牌，一共 ${STOPS.length} 处</li>
          <li><b>手机碰一碰，或扫一扫</b>这一页就会盖上第一枚章</li>
          <li><b>看声纹认鸟</b>答对，盖第二枚章</li>
          <li><b>安静半分钟</b>听听周围有多少声音，盖第三枚章</li></ol>
        <p class="hb-small">鸟鸣只给人听，请不要外放引鸟。</p>
        <p class="hb-credit">${esc(B.credit)}</p></div>`);
    for (const s of STOPS) {
      const got = S.sound.got[s.id], q = S.sound.quiz[s.id], quiet = S.sound.quiet[s.id], note = S.sound.note[s.id];
      list.push(got ? `<div class="hb-page hb-bird">
          <span class="hb-no">No.${s.no} · ${esc(s.place)}</span>
          <h4>${esc(s.bird)}</h4><i class="hb-latin">${esc(s.latin)}</i>
          <div class="hb-swatch">${s.colors.map(c => `<span style="background:${c}"></span>`).join('')}</div>
          ${HL.sonogram(s, { axes: true })}
          <div class="hb-keys">${s.keys.map(k => `<span>${esc(k)}</span>`).join('')}</div>
          <p class="hb-voice">${esc(s.voice)}</p>
          <div class="hb-stamps">
            <span class="hb-stamp is-on"><b>收</b><small>${esc(fmtDate(got))}</small></span>
            <span class="hb-stamp${q ? ' is-on' : ''}"><b>认</b><small>${q ? '认出声纹' : '待完成'}</small></span>
            <span class="hb-stamp${quiet ? ' is-on' : ''}"><b>静</b><small>${quiet ? '安静半分钟' : '待完成'}</small></span>
          </div>
          ${note ? `<p class="hb-note">「${esc(note)}」</p>` : ''}
          <button class="hb-open" type="button" data-act="sound-stop" data-id="${s.id}">打开这一站</button></div>`
        : `<div class="hb-page hb-bird is-locked">
          <span class="hb-no">No.${s.no} · ${esc(s.place)}</span>
          <h4>？？？</h4><i class="hb-latin">还没听见它</i>
          ${HL.sonogram(s, { axes: true, cls: 'is-ghost' })}
          <p class="hb-voice">${esc(s.tip)}</p>
          <div class="hb-stamps"><span class="hb-stamp"><b>收</b></span><span class="hb-stamp"><b>认</b></span><span class="hb-stamp"><b>静</b></span></div>
          <button class="hb-open" type="button" data-act="sound-scan" data-id="${s.id}">原型：模拟在这里碰一碰</button></div>`);
    }
    const all = n === STOPS.length;
    const quietN = STOPS.filter(s => S.sound.quiet[s.id]).length, quizN = STOPS.filter(s => S.sound.quiz[s.id]).length;
    list.push(`<div class="hb-page hb-end${all ? ' is-done' : ''}">
        <span class="hb-no">小结</span>
        <h4>${all ? '声景聆听者' : `还差 ${STOPS.length - n} 站`}</h4>
        <div class="hb-seal">${all ? '听' : n}</div>
        <ul><li>收集鸟的声音身份证 <b>${n} / ${STOPS.length}</b></li><li>认出声纹 <b>${quizN}</b> 次</li><li>安静半分钟 <b>${quietN}</b> 次</li></ul>
        <p class="hb-small">${all ? '五种鸟都听过了。下次清晨再来，它们会换主唱。' : '沿着栈道继续走，留意溪流边和林子里的声音。'}</p></div>`);
    list.push(`<div class="hb-back"><span>黄龙伴游 · 听见黄龙</span></div>`);
    return list;
  }

  let book = null; // { el, leaves, n, drag }
  HL.soundRender = () => {
    const host = $('#sound-book');
    if (!host) return;
    const P = pages(), n = P.length;
    S.sound.page = Math.max(0, Math.min(n - 1, S.sound.page || 0));
    host.innerHTML = `<div class="hb" id="hb">
        <div class="hb-stack" id="hbStack" role="group" aria-roledescription="手册" aria-label="声景手册，可左右拖动翻页">
          ${P.map((html, i) => `<div class="hb-leaf" data-i="${i}" aria-hidden="${i !== S.sound.page}"><div class="hb-face hb-front">${html}</div><div class="hb-face hb-backside"></div><i class="hb-shade"></i></div>`).join('')}
          <span class="hb-spine" aria-hidden="true"></span>
        </div>
        <div class="hb-nav">
          <button class="icon-btn" type="button" data-act="hb-turn" data-dir="-1" aria-label="上一页">${icon('prev')}</button>
          <span id="hbPageNo"></span>
          <button class="icon-btn" type="button" data-act="hb-turn" data-dir="1" aria-label="下一页">${icon('chev')}</button>
        </div></div>`;
    const el = $('#hb'), leaves = [...el.querySelectorAll('.hb-leaf')];
    book = { el, leaves, n, drag: null };
    layout(false);
    bindDrag();
    const cnt = $('#play-sound-count');
    if (cnt) cnt.textContent = `已收集 ${doneCount()} / ${STOPS.length}`;
  };

  /* 每张纸的角度：已翻过的在 -180°，当前及之后的在 0°；叠放次序保证当前页在最上面 */
  function layout(animate = true) {
    const p = S.sound.page;
    book.leaves.forEach((lf, i) => {
      lf.style.transition = animate && !reduced() ? '' : 'none';
      const turned = i < p;
      lf.style.transform = `rotateY(${turned ? -180 : 0}deg)`;
      lf.style.zIndex = turned ? i : book.n - i;
      lf.classList.toggle('is-turned', turned);
      lf.setAttribute('aria-hidden', String(i !== p));
      lf.querySelector('.hb-shade').style.opacity = 0;
    });
    const no = $('#hbPageNo');
    if (no) no.textContent = p === 0 ? '封面' : p === book.n - 1 ? '封底' : `${p} / ${book.n - 2}`;
    book.el.querySelector('[data-dir="-1"]').disabled = p === 0;
    book.el.querySelector('[data-dir="1"]').disabled = p === book.n - 1;
  }
  function turn(dir) {
    const next = S.sound.page + dir;
    if (next < 0 || next > book.n - 1) return;
    const lf = book.leaves[dir > 0 ? S.sound.page : next];
    lf.style.zIndex = 999; // 翻动中的纸压在最上面
    S.sound.page = next; save();
    requestAnimationFrame(() => layout(true));
  }
  HL.act('hb-turn', el => turn(Number(el.dataset.dir)));
  function goTo(i) { S.sound.page = i; save(); if (book) layout(false); }

  /* 手指拖动翻页：横向拖才算翻页，竖向留给页面滚动 */
  function bindDrag() {
    const st = $('#hbStack');
    st.addEventListener('pointerdown', e => {
      if (e.button !== 0 || e.target.closest('button, a, textarea, input')) return;
      const r = st.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, p = S.sound.page;
      const dir = fx < .3 && p > 0 ? -1 : p < book.n - 1 ? 1 : 0;
      if (!dir) return;
      book.drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, w: r.width, dir, leaf: book.leaves[dir > 0 ? p : p - 1], moved: false, ang: dir > 0 ? 0 : -180, fx };
    });
    st.addEventListener('pointermove', e => {
      const d = book.drag;
      if (!d || d.id !== e.pointerId) return;
      const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
      if (!d.moved) {
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) { if (Math.abs(dy) > 12) book.drag = null; return; }
        d.moved = true; d.leaf.style.transition = 'none'; d.leaf.style.zIndex = 999;
        try { st.setPointerCapture(e.pointerId); } catch (err) { /* 捕获失败也能拖 */ }
      }
      d.ang = d.dir > 0 ? Math.max(-180, Math.min(0, dx / d.w * 200)) : Math.max(-180, Math.min(0, -180 + dx / d.w * 200));
      d.leaf.style.transform = `rotateY(${d.ang}deg)`;
      d.leaf.querySelector('.hb-shade').style.opacity = (Math.sin(-d.ang / 180 * Math.PI) * .55).toFixed(3);
    });
    const end = e => {
      const d = book.drag;
      if (!d || d.id !== e.pointerId) return;
      book.drag = null;
      if (!d.moved) { // 轻点：右侧翻下一页，左侧翻回
        if (e.type === 'pointerup') turn(d.fx < .3 ? -1 : 1);
        return;
      }
      const go = d.dir > 0 ? d.ang < -70 : d.ang > -110;
      d.leaf.style.transition = '';
      if (go) { S.sound.page += d.dir; save(); }
      layout(true);
    };
    st.addEventListener('pointerup', end);
    st.addEventListener('pointercancel', end);
  }

  /* ---------- 驿站弹层 ---------- */
  function quizSet(stop) {
    /* 三张声纹：这一站的鸟 + 两种别的，顺序按站号固定打乱，同一站每次一样 */
    const others = STOPS.filter(s => s.id !== stop.id);
    const pick = [stop, others[stop.no % others.length], others[(stop.no + 2) % others.length]];
    const k = stop.no % 3;
    return [...pick.slice(3 - k), ...pick.slice(0, 3 - k)];
  }

  HL.openSoundStop = (id, fromScan = false) => {
    const s = byId(id);
    if (!s) return;
    const fresh = fromScan && collect(id);
    if (fresh) HL.soundRender();
    const got = S.sound.got[id];
    HL.openSheet({
      title: `No.${s.no} 声音驿站`, cls: 'sound-sheet',
      body: `
        ${fresh ? `<div class="sd-stamped" aria-live="polite"><span class="sd-stamp">收</span><div><b>已收进声景手册</b><small>${esc(fmtDate(got))}</small></div></div>` : ''}
        <p class="sd-place">${esc(s.place)}</p>
        <div class="sd-head"><h3>${esc(s.bird)}</h3><i>${esc(s.latin)} · ${esc(s.en)}</i></div>
        <div class="sd-keys">${s.keys.map(k => `<span>${esc(k)}</span>`).join('')}<span>${esc(s.size)}</span></div>
        <div class="sd-sono">${HL.sonogram(s, { axes: true, dark: true })}
          <p>声纹示意：越往上音越高，越往右时间越晚。</p>
          <button class="btn btn-ghost" type="button" disabled>${icon('audio')}听真声 · 录音待团队授权</button></div>
        <dl class="sd-card">
          <dt>外形</dt><dd>${esc(s.look)}</dd><dt>叫声</dt><dd>${esc(s.voice)}</dd>
          <dt>习性</dt><dd>${esc(s.habit)}</dd><dt>生境</dt><dd>${esc(s.habitat)}</dd></dl>
        <p class="sd-tip">${icon('info')}${esc(s.tip)}</p>

        <section class="sd-block" id="sdQuiz">${quizHtml(s)}</section>

        <section class="sd-block sd-live">
          <h4>现场声景<small>${S.sound.quiet[id] ? '已盖「静」章' : '安静半分钟，盖「静」章'}</small></h4>
          <div class="sd-live-view"><canvas id="sdCanvas" width="600" height="200" aria-label="麦克风实时声纹"></canvas>
            <div class="sd-live-idle" id="sdIdle">打开麦克风，看看身边的声音长什么样</div>
            <span class="sd-axis-hi">高音</span><span class="sd-axis-lo">低音</span></div>
          <div class="sd-meter"><i id="sdMeter"></i><span id="sdLevel">相对音量 —</span></div>
          <div class="sd-live-btns">
            <button class="btn btn-ghost" type="button" data-act="sound-mic" id="sdMic">${icon('audio')}打开麦克风</button>
            <button class="btn btn-primary" type="button" data-act="sound-quiet" data-id="${id}" id="sdQuiet">安静 ${B.quietSeconds} 秒</button></div>
          <p class="sd-result" id="sdResult" role="status"></p>
          <p class="note">只在手机上实时分析，不录音、不上传。音量是相对值，不是分贝计读数。</p>
        </section>

        <section class="sd-block">
          <h4>我的记录</h4>
          <textarea id="sdNote" maxlength="60" rows="2" placeholder="听到了什么？比如：溪边石头上，一闪一闪的红尾巴">${esc(S.sound.note[id] || '')}</textarea>
          <button class="btn btn-ghost" type="button" data-act="sound-note" data-id="${id}">记下来</button>
        </section>`,
      foot: `<div class="sheet-foot"><button class="btn btn-primary" type="button" data-act="sound-book" data-id="${id}">${icon('book')}在手册里看这一页</button></div>`,
    });
  };

  function quizHtml(s) {
    const done = S.sound.quiz[s.id];
    return `<h4>看声纹认鸟<small>${done ? '已盖「认」章' : '答对盖「认」章'}</small></h4>
      <p>下面哪一张是<b>${esc(s.bird)}</b>的声纹？提示：${esc(s.voice)}</p>
      <div class="sd-quiz">${quizSet(s).map((o, i) => `<button type="button" data-act="sound-answer" data-id="${s.id}" data-pick="${o.id}" aria-label="第 ${i + 1} 张声纹">${HL.sonogram(o, { dark: true })}<span>${'ABC'[i]}</span></button>`).join('')}</div>
      <p class="sd-result" id="sdQuizResult" role="status"></p>`;
  }

  HL.act('sound-answer', el => {
    const s = byId(el.dataset.id), ok = el.dataset.pick === s.id, box = $('#sdQuiz');
    box.querySelectorAll('.sd-quiz button').forEach(b => b.classList.remove('is-right', 'is-wrong'));
    el.classList.add(ok ? 'is-right' : 'is-wrong');
    if (ok) {
      const first = !S.sound.quiz[s.id];
      S.sound.quiz[s.id] = true; save(); HL.soundRender();
      box.querySelector('h4 small').textContent = '已盖「认」章';
      $('#sdQuizResult').textContent = `答对了！${s.bird}的声纹：${s.sono}。${first ? '手册上盖了「认」章。' : ''}`;
    } else {
      const o = byId(el.dataset.pick);
      $('#sdQuizResult').textContent = `这张是${o.bird}：${o.sono}。再看看别的。`;
    }
  });

  HL.act('sound-note', el => {
    const v = $('#sdNote').value.trim().slice(0, 60);
    if (v) S.sound.note[el.dataset.id] = v; else delete S.sound.note[el.dataset.id];
    save(); HL.soundRender();
    HL.toast(v ? '记进手册了' : '已清空这一站的记录');
  });

  HL.act('sound-scan', el => {
    const id = el.dataset.id;
    HL.openSoundStop(id, true);
  });
  HL.act('sound-stop', el => HL.openSoundStop(el.dataset.id));
  HL.act('sound-book', el => {
    const i = STOPS.findIndex(s => s.id === el.dataset.id) + 2;
    HL.closeSheet();
    if (S.page !== 'play') HL.setPage('play');
    goTo(i);
    const sec = $('#h-sound');
    if (sec) requestAnimationFrame(() => sec.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }));
  });

  /* ---------- 麦克风：实时声纹 + 相对音量 + 安静挑战 ---------- */
  let mic = null; // { stream, ctx, an, freq, wave, raf, quiet }
  async function startMic() {
    if (mic) return true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { $('#sdResult').textContent = '这个浏览器不支持麦克风。'; return false; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const an = ctx.createAnalyser(); an.fftSize = 1024; an.smoothingTimeConstant = 0;
      ctx.createMediaStreamSource(stream).connect(an);
      mic = { stream, ctx, an, freq: new Uint8Array(an.frequencyBinCount), wave: new Float32Array(an.fftSize), raf: 0, quiet: null };
      $('#sdIdle').hidden = true;
      const b = $('#sdMic'); if (b) b.innerHTML = `${icon('pause')}关掉麦克风`;
      draw();
      return true;
    } catch (e) {
      $('#sdResult').textContent = '没拿到麦克风权限。可以在浏览器设置里允许后再试。';
      return false;
    }
  }
  function stopMic() {
    if (!mic) return;
    cancelAnimationFrame(mic.raf);
    mic.stream.getTracks().forEach(t => t.stop());
    mic.ctx.close();
    mic = null;
    const b = $('#sdMic'); if (b) b.innerHTML = `${icon('audio')}打开麦克风`;
    const idle = $('#sdIdle'); if (idle) idle.hidden = false;
  }
  function level() {
    mic.an.getFloatTimeDomainData(mic.wave);
    let sum = 0; for (const v of mic.wave) sum += v * v;
    return 20 * Math.log10(Math.sqrt(sum / mic.wave.length) + 1e-9); // dBFS，相对值
  }
  function draw() {
    const cv = $('#sdCanvas');
    if (!mic || !cv) { stopMic(); return; }
    const g = cv.getContext('2d'), W = cv.width, H = cv.height;
    mic.an.getByteFrequencyData(mic.freq);
    /* 画面整体左移 2 像素，最右边画新的一列：0–10 千赫自下而上 */
    g.drawImage(cv, -2, 0);
    const top = Math.min(mic.freq.length, Math.round(10000 / (mic.ctx.sampleRate / 2) * mic.freq.length));
    for (let yy = 0; yy < H; yy++) {
      const v = mic.freq[Math.floor((1 - yy / H) * top)] / 255;
      g.fillStyle = `rgba(${Math.round(60 + 190 * v)},${Math.round(200 * v + 30)},${Math.round(180 - 60 * v)},${Math.min(1, .15 + v * 1.2)})`;
      g.fillRect(W - 2, yy, 2, 1);
    }
    const db = level(), pct = Math.max(0, Math.min(100, (db + 70) / 60 * 100));
    $('#sdMeter').style.width = pct + '%';
    $('#sdLevel').textContent = `相对音量 ${db < -50 ? '很安静' : db < -38 ? '安静' : db < -26 ? '有点吵' : '嘈杂'}`;
    if (mic.quiet) tickQuiet(db);
    mic.raf = requestAnimationFrame(draw);
  }

  /* 安静挑战：持续 quietSeconds 秒，八成时间相对音量低于门槛就算通过 */
  const QUIET_DB = -42;
  function tickQuiet(db) {
    const q = mic.quiet, left = B.quietSeconds - (performance.now() - q.t0) / 1000;
    q.n++; if (db < QUIET_DB) q.ok++;
    const btn = $('#sdQuiet');
    if (left > 0) { if (btn) btn.textContent = `保持安静… ${Math.ceil(left)} 秒`; return; }
    mic.quiet = null;
    const ratio = q.ok / Math.max(1, q.n), pass = ratio >= .8;
    if (btn) { btn.disabled = false; btn.textContent = `再来 ${B.quietSeconds} 秒`; }
    if (pass) {
      const first = !S.sound.quiet[q.id];
      S.sound.quiet[q.id] = new Date().toISOString(); save(); HL.soundRender();
      $('#sdResult').textContent = `${Math.round(ratio * 100)}% 的时间都很安静。${first ? '手册上盖了「静」章。' : ''} 安静下来，鸟声就浮出来了。`;
    } else {
      $('#sdResult').textContent = `只有 ${Math.round(ratio * 100)}% 的时间够安静。人声和脚步声会盖住鸟叫，换个时机再试试。`;
    }
  }
  HL.act('sound-mic', async () => { if (mic) stopMic(); else await startMic(); });
  HL.act('sound-quiet', async el => {
    if (!(await startMic())) return;
    if (mic.quiet) return;
    mic.quiet = { id: el.dataset.id, t0: performance.now(), n: 0, ok: 0 };
    el.disabled = true;
    $('#sdResult').textContent = '开始了。停下脚步，别说话，听听周围。';
  });

  /* 关弹层、切后台、离开页面时立刻关麦克风 */
  const closeSheet = HL.closeSheet;
  HL.closeSheet = () => { stopMic(); closeSheet(); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopMic(); });
  window.addEventListener('pagehide', stopMic);

  /* ---------- 网址直达：…/?tag=s1（NFC 和二维码里写的就是它） ---------- */
  HL.soundFromUrl = () => {
    const params = new URLSearchParams(location.search), tag = params.get('tag');
    if (!tag || !byId(tag)) return;
    params.delete('tag');
    history.replaceState(null, '', location.pathname + (params.toString() ? '?' + params : '') + location.hash);
    HL.setPage('play');
    HL.openSoundStop(tag, true);
  };
})();
