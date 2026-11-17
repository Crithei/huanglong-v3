/* 点云滚动页：网址带 ?flock=1 时打开（页面上没有入口，测试用）。
   五只鸟各是 6 万个彩色点（tools/bird-points.py：IS-Net 抠出鸟和枝条，按景深推成 3D，颜色取照片原色），存在 assets/sound/flock/sN.bin。
   往下滚：开头一团漂浮的光点 → 聚成第一只鸟 → 散开 → 聚成下一只……每段滚动只在中间变形，两头停住；
   变形时点沿各自的随机方向散开再收拢。鸟停住时缓慢转动，手指拖动或倾斜手机可以转着看。
   渲染：WebGL 直接画点（gl.POINTS），两只鸟的点按序号一一对应，顶点着色器里插值，不用外部库。 */
(() => {
  'use strict';
  const { esc, icon } = HL;
  const N = 60000;

  const VS = `attribute vec3 pa,pb,rnd;attribute vec3 ca,cb;
    uniform float t,scat,time,size,asp,yaw,pitch,fs;varying vec3 vc;
    void main(){
      vec3 p=mix(pa,pb,t);
      vec3 dir=normalize(rnd-.5+1e-4);dir.z*=.35;   // 主要在平面里散开，不往镜头冲
      p+=dir*scat*(.35+.75*rnd.x)+vec3(sin(time*.7+rnd.y*6.28),cos(time*.6+rnd.z*6.28),sin(time*.5+rnd.x*6.28)*.3)*scat*.14;
      float cy=cos(yaw),sy=sin(yaw),cp=cos(pitch),sp=sin(pitch);
      p=vec3(p.x*cy+p.z*sy,p.y,-p.x*sy+p.z*cy);
      p=vec3(p.x,p.y*cp-p.z*sp,p.y*sp+p.z*cp);
      float w=3.1-p.z;
      gl_Position=vec4(p.x*fs/asp,p.y*fs,(w-1.)/6.*w,w);
      gl_PointSize=size*3./max(w,2.2);
      vc=mix(ca,cb,t);}`;
  const FS = `precision mediump float;varying vec3 vc;uniform float glow;
    void main(){vec2 c=gl_PointCoord-.5;float r=dot(c,c);if(r>.25)discard;
      gl_FragColor=vec4(vc*(1.+glow*(1.-r*4.)),1.);}`;

  const ease = x => x * x * (3 - 2 * x);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));

  /* 开头那团光点：扁扁的一团，颜色在青绿和暖金之间 */
  function cloud() {
    const pos = new Int16Array(N * 3), col = new Uint8Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.pow(Math.random(), .6) * .95, h = (Math.random() - .5) * .5 * (1 - r * .6);
      pos.set([Math.cos(a) * r * 32767, h * 32767, Math.sin(a) * r * .6 * 32767], i * 3);
      const k = Math.random();
      col.set(k < .55 ? [120 + 60 * Math.random(), 200, 190] : [230, 196 + 30 * Math.random(), 120], i * 3);
    }
    // 按高度排，和鸟的点序对上
    const idx = [...Array(N).keys()].sort((p, q) => pos[p * 3 + 1] - pos[q * 3 + 1] || pos[p * 3] - pos[q * 3]);
    const P = new Int16Array(N * 3), C = new Uint8Array(N * 3);
    idx.forEach((j, i) => { P.set(pos.subarray(j * 3, j * 3 + 3), i * 3); C.set(col.subarray(j * 3, j * 3 + 3), i * 3); });
    const buf = new Uint8Array(N * 9); buf.set(new Uint8Array(P.buffer), 0); buf.set(C, N * 6);
    return buf.buffer;
  }

  /* 共用的点云渲染器（点云页和碰一碰动画都用）：renderer(canvas) → { buffer(ab), pair(a, b), fit(), draw(u) } */
  function renderer(cv, bg = [.07, .09, .075]) {
    const g = cv.getContext('webgl', { antialias: true });
    if (!g) return null;
    const sh = (type, src) => { const s = g.createShader(type); g.shaderSource(s, src); g.compileShader(s); return s; };
    const pr = g.createProgram(); g.attachShader(pr, sh(g.VERTEX_SHADER, VS)); g.attachShader(pr, sh(g.FRAGMENT_SHADER, FS)); g.linkProgram(pr); g.useProgram(pr);
    const A = n => g.getAttribLocation(pr, n), U = n => g.getUniformLocation(pr, n);
    // 每个点一组随机数：散开的方向和漂浮的相位
    const rnd = new Float32Array(N * 3); for (let i = 0; i < rnd.length; i++) rnd[i] = Math.random();
    const rb = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, rb); g.bufferData(g.ARRAY_BUFFER, rnd, g.STATIC_DRAW);
    g.enableVertexAttribArray(A('rnd')); g.vertexAttribPointer(A('rnd'), 3, g.FLOAT, false, 0, 0);
    const bind = (b, pName, cName) => {
      g.bindBuffer(g.ARRAY_BUFFER, b);
      g.enableVertexAttribArray(A(pName)); g.vertexAttribPointer(A(pName), 3, g.SHORT, true, 6, 0);
      g.enableVertexAttribArray(A(cName)); g.vertexAttribPointer(A(cName), 3, g.UNSIGNED_BYTE, true, 3, N * 6);
    };
    g.enable(g.DEPTH_TEST); g.clearColor(bg[0], bg[1], bg[2], 1);
    const dpr = Math.min(2, devicePixelRatio || 1);
    const R = {
      dpr,
      buffer: ab => { const b = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, b); g.bufferData(g.ARRAY_BUFFER, ab, g.STATIC_DRAW); return b; },
      pair: (a, b) => { bind(a, 'pa', 'ca'); bind(b, 'pb', 'cb'); },
      fit: () => { cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; g.viewport(0, 0, cv.width, cv.height); },
      /* u: { t, scat, time, yaw, pitch, glow, size, zoom } */
      draw: u => {
        const asp = cv.width / cv.height;
        g.uniform1f(U('t'), u.t); g.uniform1f(U('scat'), u.scat); g.uniform1f(U('time'), u.time);
        g.uniform1f(U('size'), (u.size || 2.1) * dpr); g.uniform1f(U('asp'), asp);
        g.uniform1f(U('fs'), 2.75 * Math.min(asp, 1) * (u.zoom || 1)); // 按屏幕短边适配：竖屏时鸟占满宽度
        g.uniform1f(U('yaw'), u.yaw); g.uniform1f(U('pitch'), u.pitch); g.uniform1f(U('glow'), u.glow);
        g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
        g.drawArrays(g.POINTS, 0, N);
      },
    };
    R.fit();
    return R;
  }

  /* 声波涟漪：一圈圈同心圆，颜色借这只鸟自己的点（碰一碰动画的起点） */
  function ripple(birdAb) {
    const pos = new Int16Array(N * 3), col = new Uint8Array(birdAb, N * 6, N * 3);
    for (let i = 0; i < N; i++) {
      const ring = Math.floor(Math.random() * 6), r = .16 + ring * .15 + (Math.random() - .5) * .025, a = Math.random() * Math.PI * 2;
      pos.set([Math.cos(a) * r * 32767, Math.sin(a) * r * 32767, (Math.random() - .5) * .06 * 32767], i * 3);
    }
    const buf = new Uint8Array(N * 9); buf.set(new Uint8Array(pos.buffer), 0); buf.set(col, N * 6);
    return buf.buffer;
  }

  const loadBird = id => fetch(`assets/sound/flock/${id}.bin`).then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); });
  HL.pointCloud = { N, renderer, ripple, loadBird, ease, clamp };

  async function open() {
    const stops = HL.data.birds.stops;
    const el = document.createElement('div');
    el.className = 'fl';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', '五只鸟的点云');
    el.innerHTML = `
      <canvas class="fl-canvas" aria-hidden="true"></canvas>
      <button class="dv-close icon-btn fl-close" type="button" aria-label="关闭">${icon('x')}</button>
      <div class="fl-scroll">
        <section class="fl-sec fl-intro"><p class="fl-kicker">声纹栈道 · 五只鸟</p><h2>六万个点<br>拼出一只鸟</h2><p class="fl-hint">向下滑动</p></section>
        ${stops.map(s => `<section class="fl-sec" style="--c:${esc(s.colors[2])}"><div class="fl-cap">
          <small>No.${s.no} · ${esc(s.place)}</small><h3>${esc(s.bird)}</h3><i>${esc(s.latin)}</i>
          <p>${esc(s.look)}</p>
          <span class="fl-credit">照片 ${esc(s.photo3d.author)} · ${esc(s.photo3d.license)}</span></div></section>`).join('')}
        <section class="fl-sec fl-end"><p>拖动或倾斜手机，可以转着看</p><button class="btn btn-light" type="button" data-fl="top">回到开头</button></section>
      </div>
      <p class="fl-load" aria-live="polite">点云加载中…</p>`;
    document.body.append(el);
    const shell = [document.querySelector('.pages'), document.querySelector('.tabbar'), document.querySelector('.fab'), document.querySelector('#layer')];
    shell.forEach(e => { if (e) e.inert = true; });
    let alive = true;
    el.querySelector('.fl-close').addEventListener('click', () => { alive = false; shell.forEach(e => { if (e) e.inert = false; }); el.remove(); });
    const sc = el.querySelector('.fl-scroll');
    el.querySelector('[data-fl="top"]').addEventListener('click', () => sc.scrollTo({ top: 0, behavior: 'smooth' }));

    const cv = el.querySelector('.fl-canvas'), PC = renderer(cv);
    if (!PC) { el.querySelector('.fl-load').textContent = '这个浏览器不支持 WebGL。'; return; }

    let bufs;
    try {
      const raw = await Promise.all(stops.map(s => loadBird(s.id)));
      bufs = [cloud(), ...raw].map(PC.buffer);
    } catch (e) { el.querySelector('.fl-load').textContent = '点云文件加载失败。'; return; }
    if (!alive) return;
    el.querySelector('.fl-load').remove();
    const fit = PC.fit;
    addEventListener('resize', fit);

    /* 拖动和倾斜：转动鸟 */
    let ry = 0, rx = 0, dragX = null, gyro = null, base = null;
    cv.addEventListener('pointerdown', e => { dragX = { x: e.clientX, y: e.clientY, ry, rx }; });
    addEventListener('pointermove', e => { if (dragX) { ry = dragX.ry + (e.clientX - dragX.x) / innerWidth * 2.4; rx = clamp(dragX.rx + (e.clientY - dragX.y) / innerHeight * 1.2, -.5, .5); } });
    addEventListener('pointerup', () => { dragX = null; });
    const onOri = e => { if (e.beta != null) gyro = { b: e.beta, g: e.gamma || 0 }; };
    addEventListener('deviceorientation', onOri);

    let lastSeg = -1;
    const t0 = performance.now();
    const frame = now => {
      if (!alive) { removeEventListener('resize', fit); removeEventListener('deviceorientation', onOri); return; }
      const secH = sc.clientHeight * 1.3;
      const p = clamp(sc.scrollTop / secH, 0, stops.length);
      const k = Math.min(stops.length - 1, Math.floor(p)), f = p - k;
      const tt = ease(clamp((f - .22) / .56));                 // 每段中间变形，两头停住
      if (k !== lastSeg) { PC.pair(bufs[k], bufs[k + 1]); lastSeg = k; }
      const time = (now - t0) / 1000;
      let gy = 0, gx = 0;
      if (gyro) { if (!base) base = { ...gyro }; gy = clamp((gyro.g - base.g) / 30, -1, 1) * .6; gx = clamp((gyro.b - base.b) / 30, -1, 1) * .3; }
      PC.draw({ t: tt, scat: Math.sin(tt * Math.PI) * .6 + (k === 0 && tt < .01 ? .06 : 0), time,
        yaw: ry + gy + Math.sin(time * .35) * .32, pitch: rx + gx + .08 + Math.sin(time * .27) * .05, glow: .15 + Math.sin(tt * Math.PI) * .5 });
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  HL.flockFromUrl = () => {
    const params = new URLSearchParams(location.search);
    if (params.get('flock') !== '1') return;
    params.delete('flock');
    history.replaceState(null, '', location.pathname + (params.toString() ? '?' + params : '') + location.hash);
    open();
  };
})();
