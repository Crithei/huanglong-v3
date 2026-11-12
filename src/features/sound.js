/* 听见黄龙 · 栈道手册：声纹栈道的介绍 + 五种鸟的收集（互动页第三块，和「声景手册」features/soundbank.js 并存）。数据见 data/birds.js。
   翻页引擎和拼贴零件在 features/handbook.js。
   内容整理自同济大学许晓青团队的《黄龙鸟类声纹栈道》宣传册；视觉是拼贴和剪纸：
   照片像贴上去的纸片（白边、胶带、微微歪斜），鸟是抠出来的图，没收集时只是一张剪影。

   现场：栈道上五块科普展牌各有一个鸣声二维码。碰一碰或扫一扫打开 …/?tag=s1，
   这只鸟的照片就「贴」进手册，再认声纹、安静半分钟、写一句记录。原型里用「模拟碰一碰」代替。

   翻页：不是整页硬转，而是纸沿着一条折线卷起来。折线是「页角原位置」和「手指」连线的垂直平分线，
   折线一侧的纸留在原处，另一侧翻折过来露出纸背，并在下一页上投下阴影。松手过半就翻过去，否则弹回。
   点右侧翻下一页，点左侧翻回；顶部的章节标签和目录可以直接跳转。

   麦克风只在手机上实时画声纹、估相对音量，不录音、不上传；关掉弹层或切到后台立即停止。
   进度存在 S.sound：got 收集时间 / quiz 认声纹 / quiet 安静挑战 / note 记录 / nodes 到过的节点 / page 页码。
   对外：HL.soundRender()（互动页调用）、HL.openSoundStop(id, 来自扫码?)、HL.sonogram(站, 选项)、HL.soundHint(站)。 */
(() => {
  'use strict';
  const { $, esc, icon, S, idx } = HL;
  const B = HL.data.birds, STOPS = B.stops, T = B.trail, SC = B.science;
  const byId = id => STOPS.find(s => s.id === id);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmtDate = iso => { const d = new Date(iso); return `${d.getMonth() + 1} 月 ${d.getDate()} 日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const save = () => HL.store.save();
  const birdImg = s => `assets/sound/bird-${s.id}.webp`;

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

  /* ---------- 拼贴零件（features/handbook.js） ---------- */
  const { tape, photo, strip, forest } = HL.pc;
  const sil = (s, cls = '') => HL.pc.sil(birdImg(s), `${s.bird}的剪影`, cls);
  const cut = (s, cls = '') => HL.pc.cut(birdImg(s), s.bird, cls);

  /* ---------- 收集 ---------- */
  function collect(id) {
    if (S.sound.got[id]) return false;
    S.sound.got[id] = new Date().toISOString();
    save();
    return true;
  }
  const doneCount = () => STOPS.filter(s => S.sound.got[s.id]).length;
  const nodeCount = () => B.nodes.filter(n => S.sound.nodes[n.id]).length;

  /* ---------- 手册里的小互动：鸟鸣时钟选中的钟点、橙翅噪鹛选中的叫声 ---------- */
  const ui = { hour: new Date().getHours(), scene: B.scenes[0].id };
  const hourKind = h => (h >= 20 || h <= 6) ? 'night' : h === 7 ? 'dawn' : (h === 8 || h === 10) ? 'peak' : (h === 9 || h === 11) ? 'morning' : (h === 16 || h === 18) ? 'pm' : h === 19 ? 'dusk' : 'noon';

  function dial() {
    const cx = 110, cy = 110, r0 = 54, r1 = 98, now = new Date().getHours();
    const pt = (r, a) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    let g = '';
    for (let h = 0; h < 24; h++) {
      const a0 = (h * 15 - 90) * Math.PI / 180, a1 = ((h + 1) * 15 - 90) * Math.PI / 180, k = hourKind(h), v = SC.day.rich[h];
      const rr = k === 'night' ? r0 + 10 : v ? r0 + 12 + v / .6 * (r1 - r0 - 12) : r0 + 20;
      g += `<path class="dl-w dl-${k}${h === ui.hour ? ' is-on' : ''}" data-act="hb-hour" data-h="${h}" role="button" aria-label="${h} 点" d="M${pt(r0, a0)}L${pt(rr, a0)}A${rr} ${rr} 0 0 1 ${pt(rr, a1)}L${pt(r0, a1)}A${r0} ${r0} 0 0 0 ${pt(r0, a0)}Z"/>`;
    }
    const lab = [0, 6, 12, 18].map(h => `<text class="dl-t" x="${cx + 106 * Math.cos((h * 15 - 90) * Math.PI / 180)}" y="${cy + 106 * Math.sin((h * 15 - 90) * Math.PI / 180) + 3}">${h}</text>`).join('');
    const an = (now * 15 + 7.5 - 90) * Math.PI / 180;
    return `<svg class="dial" viewBox="0 0 220 220" role="group" aria-label="鸟鸣时钟，点一个钟点看那时的鸟声">${g}${lab}
      <circle class="dl-now" cx="${cx + 46 * Math.cos(an)}" cy="${cy + 46 * Math.sin(an)}" r="3.5"/>
      <text class="dl-h" x="${cx}" y="${cy - 2}">${ui.hour} 点</text><text class="dl-s" x="${cx}" y="${cy + 15}">${ui.hour === now ? '现在' : '点别的钟点'}</text></svg>`;
  }

  /* ---------- 手册的页 ---------- */
  const CHAPTERS = [['trail', '栈道'], ['voice', '声纹'], ['rhythm', '节律'], ['birds', '五鸟'], ['mine', '集章']];

  function pages() {
    const P = [], n = doneCount();
    const add = (ch, cls, html) => P.push({ ch, cls, html });
    const run = t => `<header class="hb-run"><span>${esc(t)}</span><span class="hb-pn"></span></header>`;

    /* 封面 */
    add('', 'hb-cover', `
      ${photo('assets/sound/cover.webp', '冷杉林里的声纹栈道入口', 'cv-photo')}
      <img class="cv-birds" src="assets/sound/poly-pair.webp" alt="" draggable="false">
      <div class="cv-title">${strip('HUANGLONG · SOUNDSCAPE', 'is-small')}<h3>栈道手册</h3>${strip(T.name, 'is-gold')}</div>
      <p class="cv-motto">${esc(T.motto)}</p>
      <span class="cv-count">已贴上 ${n} / ${STOPS.length} 只鸟</span>
      <span class="hb-hint">从右边往左拖，翻开 ←</span>${forest()}`);

    /* 目录 */
    const toc = [['trail', '一条藏在冷杉林里的栈道', '在哪、有什么'], ['voice', '看得见的声音', '声纹是什么、怎么监测'], ['rhythm', '鸟的作息表', '一天、一季、远近'], ['birds', '五位歌手', '展牌上的五种鸟'], ['mine', '我的收集', '集章与致谢']];
    add('', 'hb-toc', `${run('目录')}
      <h4>这本手册里有</h4>
      <ol class="toc">${toc.map(([ch, a, b], i) => `<li><button type="button" data-act="hb-ch" data-ch="${ch}"><i>${i + 1}</i><span><b>${a}</b><small>${b}</small></span><em class="toc-pn" data-ch="${ch}"></em></button></li>`).join('')}</ol>
      <div class="toc-how">${strip('怎么集章', 'is-red')}
        <p><b>碰一碰</b>展牌上的二维码，鸟的照片贴进手册　<b>认声纹</b>三选一　<b>安静半分钟</b>听一听</p></div>
      <img class="toc-bird" src="assets/sound/poly-feed.webp" alt="" draggable="false">`);

    /* 一、栈道 */
    add('trail', 'hb-where', `${run('一 · 栈道')}
      <h4>藏在冷杉林里的<br>一条栈道</h4>
      <p class="hb-p">${esc(T.where)}</p>
      <svg class="route" viewBox="0 0 300 96" role="img" aria-label="栈道示意：从迎宾池一侧进入，经声景展亭、五块科普展牌到数字展厅，另一头通向莲台飞瀑">
        <path class="rt-line" d="M22 70C60 76 70 40 104 44S150 74 184 58s50-34 94-30"/>
        <g class="rt-end"><circle cx="22" cy="70" r="6"/><text x="22" y="90">迎宾池</text><circle cx="278" cy="28" r="6"/><text x="278" y="14">莲台飞瀑</text></g>
        <g class="rt-node"><rect x="50" y="60" width="12" height="12" rx="2"/><text x="56" y="54">入口</text><rect x="98" y="38" width="12" height="12" rx="2"/><text x="104" y="32">声景展亭</text><rect x="222" y="34" width="14" height="12" rx="2"/><text x="229" y="60">数字展厅</text></g>
        <g class="rt-star">${[[132, 56], [150, 66], [168, 66], [186, 57], [203, 46]].map(([x, y]) => `<path d="M${x} ${y - 5}l1.5 3.4 3.7.4-2.8 2.5.8 3.6-3.2-1.9-3.2 1.9.8-3.6-2.8-2.5 3.7-.4Z"/>`).join('')}<text x="168" y="84">五块鸟类展牌</text></g></svg>
      <div class="facts">${T.facts.map(([a, b]) => `<span><b>${esc(a)}</b>${esc(b)}</span>`).join('')}</div>
      <button class="hb-link" type="button" data-act="select" data-id="${T.from}">${icon('map')}在游览里看迎宾池</button>${forest('is-low')}`);

    const nodeCard = (nd, i) => `<button class="node${S.sound.nodes[nd.id] ? ' is-on' : ''}" type="button" data-act="hb-node" data-id="${nd.id}" style="--r:${[-2.2, 1.6, 1.8, -1.4][i % 4]}deg">
        ${photo(nd.img, nd.name)}<b>${esc(nd.name)}</b><small>${esc(nd.line)}</small><i class="node-tick">${S.sound.nodes[nd.id] ? '到过' : ''}</i></button>`;
    add('trail', 'hb-nodes', `${run('一 · 栈道')}<h4>八处节点 <small>上</small></h4><div class="nodes">${B.nodes.slice(0, 4).map(nodeCard).join('')}</div><p class="hb-foot">点一张照片看介绍，到过的可以盖个章</p>`);
    add('trail', 'hb-nodes', `${run('一 · 栈道')}<h4>八处节点 <small>下</small></h4><div class="nodes">${B.nodes.slice(4).map(nodeCard).join('')}</div><p class="hb-foot">已到过 ${nodeCount()} / ${B.nodes.length} 处</p>`);

    /* 二、声纹 */
    add('voice', 'hb-what', `${run('二 · 声纹')}
      <h4>看得见的声音</h4>
      <p class="hb-p">${esc(SC.what)}</p>
      <div class="sg-piece">${tape()}${HL.sonogram(STOPS[0], { axes: true, dark: true })}<span class="sg-up">↑ 越高音越尖</span><span class="sg-right">越右越晚 →</span></div>
      <div class="two">${SC.factors.map(([a, b]) => `<div>${strip(a, 'is-green')}<small>${esc(b)}</small></div>`).join('')}</div>
      <p class="hb-small">${esc(SC.stable)}</p>`);
    add('voice', 'hb-uses', `${run('二 · 声纹')}
      <h4>叫声和鸣声，<br>不是一回事</h4>
      <table class="cs"><thead><tr>${SC.callSong.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${SC.callSong.rows.map(r => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</tbody></table>
      <p class="hb-quote">${esc(SC.callSong.example)}</p>
      ${strip('听声纹有什么用', 'is-red')}
      <ul class="uses">${SC.uses.map(([a, b]) => `<li><b>${esc(a)}</b>${esc(b)}</li>`).join('')}</ul>`);
    add('voice', 'hb-pam', `${run('二 · 声纹')}
      <h4>不打扰地听三年</h4>
      <p class="hb-p">${esc(SC.monitor.how)}</p>
      <div class="facts is-4">${SC.monitor.numbers.map(([a, b]) => `<span><b>${esc(a)}</b>${esc(b)}</span>`).join('')}</div>
      <div class="sites">${SC.monitor.sites.map((s, i) => `<span style="--r:${[-3, 2, -1, 3, -2, 1][i]}deg">${esc(s)}</span>`).join('')}</div>
      <div class="top2">${SC.monitor.top.map(([a, b], i) => `<div><i>${i + 1}</i><b>${esc(a)}</b><small>${esc(b)}</small></div>`).join('')}</div>
      <p class="hb-small">${esc(SC.monitor.who)}</p>`);

    /* 三、节律 */
    const k = hourKind(ui.hour), v = SC.day.rich[ui.hour];
    add('rhythm', 'hb-dial', `${run('三 · 节律')}
      <h4>鸟鸣时钟</h4>
      <p class="hb-small">点一个钟点，看那时林子里有多热闹。圆点是现在。</p>
      ${dial()}
      <div class="dial-say">${strip(`${ui.hour} 点`, 'is-red')}<p>${esc(SC.day.text[k])}${v ? `<em>平均每条录音 ${v} 种鸟</em>` : ''}</p></div>
      <p class="hb-foot">${esc(SC.day.note)}</p>`);
    const mMax = Math.max(...SC.months.rows.map(r => r[1])), sMax = Math.max(...SC.space.rows.map(r => r[1]));
    add('rhythm', 'hb-season', `${run('三 · 节律')}
      <h4>夏天最吵，<br>人少的地方最吵</h4>
      ${strip('从八月到十二月', 'is-green')}
      <div class="bars">${SC.months.rows.map(([m, x]) => `<div><span>${esc(m)}</span><i style="width:${(x / mMax * 100).toFixed(0)}%"></i><b>${x}</b></div>`).join('')}</div>
      ${strip('从山沟到索道', 'is-green')}
      <div class="bars is-site">${SC.space.rows.map(([m, x]) => `<div><span>${esc(m)}</span><i style="width:${(x / sMax * 100).toFixed(0)}%"></i><b>${x}</b></div>`).join('')}</div>
      <p class="hb-small">${esc(SC.months.note)}</p>
      <p class="hb-quote">${esc(SC.space.take)}</p>`);

    /* 四、五鸟：每种两页，橙翅噪鹛多一页四种叫声 */
    for (const s of STOPS) {
      const got = S.sound.got[s.id], q = S.sound.quiz[s.id], quiet = S.sound.quiet[s.id], note = S.sound.note[s.id];
      add('birds', `hb-bird${got ? ' is-got' : ''}`, `${run(`四 · 五鸟 · No.${s.no}`)}
        <div class="bd-stage" style="--c:${s.colors[2]}">${got ? cut(s) : sil(s)}<i class="bd-blob"></i>${got ? '' : '<span class="bd-ask">碰一碰展牌，把它贴进来</span>'}</div>
        <div class="bd-name"><small>${esc(s.pinyin)}</small><h4>${esc(s.bird)}</h4><i>${esc(s.latin)} · ${esc(s.en)}</i></div>
        ${s.protect ? strip(s.protect, 'is-red bd-protect') : ''}
        <div class="bd-size"><span>♂ ${esc(s.weight[0])} · ${esc(s.length[0])}</span><span>♀ ${esc(s.weight[1])} · ${esc(s.length[1])}</span></div>
        <div class="hb-stamps">
          <span class="hb-stamp${got ? ' is-on' : ''}"><b>贴</b><small>${got ? esc(fmtDate(got)) : '碰一碰'}</small></span>
          <span class="hb-stamp${q ? ' is-on' : ''}"><b>认</b><small>${q ? '认出声纹' : '认声纹'}</small></span>
          <span class="hb-stamp${quiet ? ' is-on' : ''}"><b>静</b><small>${quiet ? '安静半分钟' : '半分钟'}</small></span></div>
        ${note ? `<p class="hb-note">「${esc(note)}」</p>` : ''}
        <button class="hb-open" type="button" data-act="${got ? 'sound-stop' : 'sound-scan'}" data-id="${s.id}">${got ? '打开这一站' : '原型：模拟碰一碰'}</button>`);
      add('birds', 'hb-life', `${run(`四 · 五鸟 · ${s.bird}`)}
        <div class="lf-head">${cut(s, 'lf-cut')}<div><h4>它的生活</h4><div class="swatch">${s.colors.map(c => `<span style="background:${c}"></span>`).join('')}</div></div></div>
        <p class="hb-p">${esc(s.look)}</p>
        ${s.alt ? `<div class="alt" role="img" aria-label="分布海拔 ${s.alt[0]} 到 ${s.alt[1]} 米，栈道在 ${T.altitude} 米"><i class="alt-band" style="left:${s.alt[0] / 50}%;width:${(s.alt[1] - s.alt[0]) / 50}%"></i><i class="alt-here" style="left:${T.altitude / 50}%"></i>
          <span class="alt-l">${s.alt[0] || '平原'}${s.alt[0] ? ' 米' : ''}</span><span class="alt-r">${s.alt[1]} 米</span><span class="alt-t" style="left:${T.altitude / 50}%">栈道</span></div>` : ''}
        <dl class="lf">
          <dt>住</dt><dd>${esc(s.habitat)}</dd>
          ${s.food ? `<dt>吃</dt><dd>${esc(s.food)}</dd>` : ''}
          <dt>${s.food ? '行' : '巢'}</dt><dd>${esc(s.habit)}</dd>
          ${s.breed ? `<dt>育</dt><dd>${esc(s.breed)}</dd>` : ''}
          <dt>声</dt><dd>${esc(s.voice)}</dd></dl>`);
      if (s.id === 's1') {
        const sc = B.scenes.find(x => x.id === ui.scene) || B.scenes[0];
        add('birds', 'hb-scene', `${run('四 · 五鸟 · 声景展亭')}
          <h4>橙翅噪鹛的<br>四种叫声</h4>
          <div class="sc-tabs">${B.scenes.map(x => `<button type="button" data-act="hb-scene" data-id="${x.id}" aria-pressed="${x.id === sc.id}">${esc(x.name)}</button>`).join('')}</div>
          <div class="sc-card">${tape()}<small>${esc(sc.en)}</small>
            <div class="sc-cal"><span>月</span>${Array.from({ length: 12 }, (_, i) => `<i class="${sc.months.includes(i + 1) ? 'is-on' : ''}">${i + 1}</i>`).join('')}</div>
            ${sc.hours.length ? `<div class="sc-cal is-h"><span>时</span>${Array.from({ length: 24 }, (_, i) => `<i class="${sc.hours.includes(i) ? 'is-on' : ''}"></i>`).join('')}<em>${sc.hours[0]}–${sc.hours[sc.hours.length - 1]} 点</em></div>` : ''}
            <p>${esc(sc.text)}</p><p class="sc-voice">${esc(sc.voice)}</p></div>
          <img class="sc-bird" src="assets/sound/poly-nest.webp" alt="" draggable="false">`);
      }
    }

    /* 五、集章 */
    const all = n === STOPS.length;
    const quietN = STOPS.filter(s => S.sound.quiet[s.id]).length, quizN = STOPS.filter(s => S.sound.quiz[s.id]).length;
    add('mine', `hb-end${all ? ' is-done' : ''}`, `${run('五 · 集章')}
      <h4>${all ? '声景聆听者' : `还差 ${STOPS.length - n} 只鸟`}</h4>
      <div class="end-row">${STOPS.map((s, i) => `<button type="button" data-act="hb-bird" data-id="${s.id}" style="--r:${[-6, 4, -3, 5, -4][i]}deg" aria-label="${esc(s.bird)}">${S.sound.got[s.id] ? cut(s) : sil(s)}</button>`).join('')}</div>
      <div class="hb-seal">${all ? '听' : n}</div>
      <ul class="end-list"><li>贴进手册的鸟 <b>${n} / ${STOPS.length}</b></li><li>认出声纹 <b>${quizN}</b> 次</li><li>安静半分钟 <b>${quietN}</b> 次</li><li>到过的节点 <b>${nodeCount()} / ${B.nodes.length}</b></li></ul>
      <p class="hb-small">${all ? '五位歌手都见过了。清晨再来，它们会换主唱。' : '沿着栈道走，留意展牌上的二维码。'}</p>${forest('is-low')}`);
    add('mine', 'hb-thanks', `${run('五 · 致谢')}
      <h4>这些内容从哪来</h4>
      <p class="hb-p">${esc(B.credit)}</p>
      <p class="hb-small">${esc(SC.monitor.who)}</p>
      ${strip('相关报道', 'is-green')}
      <ul class="press">${B.press.map(([m, t, d, u]) => `<li><a href="${esc(HL.safeUrl(u))}" target="_blank" rel="noopener noreferrer"><b>${esc(m)}</b>${esc(t)}<small>${esc(d)}</small></a></li>`).join('')}</ul>
      <p class="hb-small">用手机听鸟鸣请戴耳机，别对着林子外放。</p>`);
    add('', 'hb-back', `<img src="assets/sound/poly-nest.webp" alt="" draggable="false"><span>黄龙伴游 · 听见黄龙</span>${forest()}`);
    return P;
  }

  /* ---------- 手册：翻页引擎在 features/handbook.js ---------- */
  const book = HL.Handbook.create({
    name: 'guide', label: '栈道手册', chapters: CHAPTERS, pages,
    getPage: () => S.sound.page, setPage: i => { S.sound.page = i; save(); },
  });
  HL.soundGuide = book;
  HL.soundRender = () => {
    const host = $('#sound-book');
    if (!host) return;
    const which = S.sound.book === 'collect' ? 'collect' : 'guide';
    document.querySelectorAll('.hb-switch button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.v === which)));
    const credit = $('#sound-credit');
    if (credit) credit.textContent = which === 'guide' ? B.credit : '声景手册是本项目的原型设计；分类是按频谱特征粗略判断的，不是 AI 识别。研究数据引自同济大学许晓青团队的《黄龙鸟类声纹栈道》宣传册。';
    if (which === 'collect') { HL.bankRender(); return; }
    book.render(host);
    const cnt = $('#play-sound-count');
    if (cnt) cnt.textContent = `已贴上 ${doneCount()} / ${STOPS.length} 只鸟`;
    const scan = $('#sound-scan');
    if (scan) scan.innerHTML = `<b>${icon('pin')}原型：模拟在展牌前碰一碰</b><p>声纹栈道上有五块鸟类科普展牌，每块都有鸣声二维码。设想在展牌上加 NFC：手机碰一下或扫一下，就把这只鸟贴进手册。</p>
      <div class="chips">${STOPS.map(s => `<button class="chip${S.sound.got[s.id] ? ' is-got' : ''}" type="button" data-act="sound-scan" data-id="${s.id}">No.${s.no} ${S.sound.got[s.id] ? esc(s.bird) : '展牌'}</button>`).join('')}</div>`;
  };
  const birdPage = id => book.find(p => p.cls.startsWith('hb-bird') && p.html.includes(`data-id="${id}"`));
  HL.act('sound-which', el => { S.sound.book = el.dataset.v; save(); HL.soundRender(); });
  HL.act('hb-bird', el => book.goTo(birdPage(el.dataset.id)));
  /* 页内的小互动：只重画当前页，不翻页 */
  const redraw = () => book.redraw();
  HL.act('hb-hour', el => { ui.hour = Number(el.dataset.h); redraw(); });
  HL.act('hb-scene', el => { ui.scene = el.dataset.id; redraw(); });
  HL.act('hb-node', el => {
    const nd = B.nodes.find(x => x.id === el.dataset.id), on = !!S.sound.nodes[nd.id];
    HL.openSheet({
      title: nd.name, cls: 'sound-sheet',
      body: `<div class="nd-photo">${photo(nd.img, nd.name)}</div><p class="lead">${esc(nd.line)}</p><p>${esc(nd.detail)}</p><p class="note">图片和介绍来自《黄龙鸟类声纹栈道》宣传册。</p>`,
      foot: `<div class="sheet-foot"><button class="btn ${on ? 'is-on' : 'btn-primary'}" type="button" data-act="hb-node-tick" data-id="${nd.id}" aria-pressed="${on}">${icon(on ? 'check' : 'stamp')}${on ? '已盖「到过」章' : '我到过这里'}</button></div>`,
    });
  });
  HL.act('hb-node-tick', el => {
    const id = el.dataset.id;
    if (S.sound.nodes[id]) delete S.sound.nodes[id]; else S.sound.nodes[id] = true;
    save(); HL.closeSheet(); redraw();
    HL.toast(S.sound.nodes[id] ? '盖上了「到过」章' : '已取消');
  });

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
        ${fresh ? `<div class="sd-stamped" aria-live="polite"><span class="sd-stamp">贴</span><div><b>已贴进栈道手册</b><small>${esc(fmtDate(got))}</small></div></div>` : ''}
        <div class="sd-hero pc-paper" style="--c:${s.colors[2]}">${tape()}${cut(s, fresh ? 'is-new' : '')}<i class="bd-blob"></i>
          <div class="sd-head"><small>${esc(s.pinyin)}</small><h3>${esc(s.bird)}</h3><i>${esc(s.latin)}</i><i>${esc(s.en)}</i></div></div>
        <div class="sd-keys">${s.protect ? `<span class="is-red">${esc(s.protect)}</span>` : ''}${s.keys.map(k => `<span>${esc(k)}</span>`).join('')}</div>
        <div class="bd-size"><span>♂ ${esc(s.weight[0])} · ${esc(s.length[0])}</span><span>♀ ${esc(s.weight[1])} · ${esc(s.length[1])}</span></div>
        <div class="sd-sono">${HL.sonogram(s, { axes: true, dark: true })}
          <p>声纹示意：越往上音越高，越往右时间越晚。</p>
          <button class="btn btn-ghost" type="button" disabled>${icon('audio')}听真声 · 展牌上有鸣声二维码</button></div>
        <dl class="sd-card">
          <dt>外形</dt><dd>${esc(s.look)}</dd><dt>叫声</dt><dd>${esc(s.voice)}</dd>
          <dt>住</dt><dd>${esc(s.habitat)}</dd>${s.food ? `<dt>吃</dt><dd>${esc(s.food)}</dd>` : ''}
          <dt>习性</dt><dd>${esc(s.habit)}</dd>${s.breed ? `<dt>繁殖</dt><dd>${esc(s.breed)}</dd>` : ''}</dl>
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

  HL.act('sound-scan', el => HL.openSoundStop(el.dataset.id, true));
  HL.act('sound-stop', el => HL.openSoundStop(el.dataset.id));
  HL.act('sound-book', el => {
    HL.closeSheet();
    if (S.page !== 'play') HL.setPage('play');
    S.sound.book = 'guide';
    if (!book.P.length) book.P = pages();
    S.sound.page = Math.max(0, birdPage(el.dataset.id)); save(); HL.pages.play.render();
    const sec = $('#h-sound');
    if (sec) requestAnimationFrame(() => sec.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }));
  });
  HL.act('sound-open', () => {
    HL.closeSheet();
    S.sound.book = 'guide'; save();
    if (S.page !== 'play') HL.setPage('play');
    const sec = $('#h-sound');
    if (sec) requestAnimationFrame(() => sec.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }));
  });

  /* 本站攻略里的提示：栈道在迎宾池和莲台飞瀑之间 */
  HL.soundHint = s => (s.id === T.from || s.id === T.to) ? `<div class="water-hint">
      <span class="ico">${icon('audio')}</span>
      <div class="t"><b>鸟类声纹栈道 · 就在附近的林子里</b><span>${esc(T.facts[0][0])}，${esc(T.facts[1][0])}节点；已贴上 ${doneCount()} / ${STOPS.length} 只鸟</span></div>
      <button class="btn btn-ghost" type="button" data-act="sound-open">手册</button>
    </div>` : '';

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
    S.sound.book = 'guide';
    HL.setPage('play');
    HL.openSoundStop(tag, true);
  };
})();
