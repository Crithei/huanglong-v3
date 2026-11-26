/* 立体检视与林中全景（栈道手册用）。
   立体检视：一张鸟类照片 + 一张景深图（tools/depth-maps.py 用 Depth Anything V2 生成，越白越近），
   WebGL 着色器按深度逐像素位移：手机一歪，近处的鸟和枝条、远处的林子错开，像隔着玻璃看立体标本。
   林中全景：2:1 等距柱状投影贴图投到球面上，转手机环视；现在是栈道实拍拼成的模糊占位图（assets/sound/3d/pano-blur.webp），
   拿到 360° 实拍后换图即可。五只鸟按习性放在不同方位，点了进入它的立体检视。
   体感：DeviceOrientation。iPhone 要用户点一下「开启体感」才给权限；没有陀螺仪时用手指拖，放着不动会轻轻摆。
   API：HL.depthView.open(stopId)、HL.panoView.open() */
(() => {
  'use strict';
  const { esc, icon } = HL;
  const B = HL.data.birds, STOPS = B.stops;
  const byId = id => STOPS.find(s => s.id === id);
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 体感 ---------- */
  const gyro = {
    data: null, listening: false,
    needAsk: () => typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function',
    has: () => 'DeviceOrientationEvent' in window,
    start() {
      if (gyro.listening) return;
      gyro.listening = true;
      addEventListener('deviceorientation', e => { if (e.beta != null) gyro.data = { a: e.alpha || 0, b: e.beta, g: e.gamma || 0, t: performance.now() }; });
    },
    async ask() {
      try { if (gyro.needAsk() && (await DeviceOrientationEvent.requestPermission()) !== 'granted') return false; } catch (e) { return false; }
      gyro.start(); return true;
    },
    live: () => !!gyro.data && performance.now() - gyro.data.t < 1000,
  };
  if (gyro.has() && !gyro.needAsk()) gyro.start(); // 安卓不用问

  /* ---------- WebGL 小工具 ---------- */
  function gl(canvas) {
    const g = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!g) return null;
    const buf = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
    return g;
  }
  function program(g, fs) {
    const vs = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0,1);}';
    const pr = g.createProgram();
    [[g.VERTEX_SHADER, vs], [g.FRAGMENT_SHADER, fs]].forEach(([t, src]) => { const s = g.createShader(t); g.shaderSource(s, src); g.compileShader(s); g.attachShader(pr, s); });
    g.linkProgram(pr); g.useProgram(pr);
    const loc = g.getAttribLocation(pr, 'p'); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    return pr;
  }
  function texture(g, unit, img, wrap) {
    const t = g.createTexture(); g.activeTexture(g.TEXTURE0 + unit); g.bindTexture(g.TEXTURE_2D, t);
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, img);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR); g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, wrap ? g.REPEAT : g.CLAMP_TO_EDGE); g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
    return t;
  }
  const load = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });

  /* 全屏层：和碰一碰动画共用纸色底；返回 { el, close } */
  function layer(cls, html) {
    const el = document.createElement('div');
    el.className = `dv ${cls}`;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = html;
    document.body.append(el);
    const shell = [document.querySelector('.pages'), document.querySelector('.tabbar'), document.querySelector('.fab'), document.querySelector('#layer')];
    const prev = shell.map(e => e && e.inert);
    shell.forEach(e => { if (e) e.inert = true; });
    const close = () => { el.classList.add('is-out'); shell.forEach((e, i) => { if (e) e.inert = prev[i]; }); setTimeout(() => el.remove(), 300); };
    el.querySelector('.dv-close').addEventListener('click', close);
    requestAnimationFrame(() => el.classList.add('is-in'));
    el.querySelector('.dv-close').focus();
    return { el, close };
  }
  const gyroBtn = () => gyro.needAsk() ? `<button class="dv-gyro" type="button">${icon('rotr')}开启体感</button>` : '';
  function wireGyroBtn(el, then) {
    const b = el.querySelector('.dv-gyro');
    if (b) b.addEventListener('click', async () => { if (await gyro.ask()) { b.remove(); then && then(); } else b.textContent = '没有拿到体感权限，可以用手指拖'; });
  }

  /* ---------- 立体检视 ---------- */
  /* 逐层搜索（relief mapping）：沿视线从近到远找第一个挡住这一点的表面，前景自然盖住背景，交界处不再互相拉扯。
     focus 是不动的深度：放在鸟所在的深度，清晰的鸟几乎不动，虚化的背景移动，拉伸藏在焦外里。 */
  const DEPTH_FS = `precision mediump float;varying vec2 v;uniform sampler2D img,dep;uniform vec2 off;uniform float zoom,focus;
    void main(){vec2 uv=(v-.5)/zoom+.5;vec2 p=uv+off*(1.-focus);float pt=1.,ph=texture2D(dep,p).r;
      if(ph<1.){for(int i=1;i<=28;i++){float t=1.-float(i)/28.;vec2 q=uv+off*(t-focus);float h=texture2D(dep,q).r;
        if(h>=t){float a=ph-pt,b=h-t,k=a/(a-b+1e-5);p=uv+off*(mix(pt,t,k)-focus);break;}pt=t;ph=h;p=q;}}
      gl_FragColor=texture2D(img,clamp(p,.001,.999));}`;
  /* 两层版：后层整体平移 offB，前层（带透明度）平移 offF，再按前层的透明度叠起来。两层各自平移，交界不拉丝 */
  const LAYER_FS = `precision mediump float;varying vec2 v;uniform sampler2D bg,fg;uniform vec2 offB,offF;uniform float zoom;
    void main(){vec2 uv=(v-.5)/zoom+.5;vec4 f=texture2D(fg,clamp(uv+offF,.001,.999));vec3 b=texture2D(bg,clamp(uv+offB,.001,.999)).rgb;
      gl_FragColor=vec4(mix(b,f.rgb,f.a),1.);}`;
  /* 焦平面：取景深图里最近那一成像素的深度（通常就是鸟） */
  const focusOf = (dep, pct = .92) => {
    const c = document.createElement('canvas'); c.width = 96; c.height = Math.round(96 * dep.naturalHeight / dep.naturalWidth);
    const x = c.getContext('2d'); x.drawImage(dep, 0, 0, c.width, c.height);
    const px = x.getImageData(0, 0, c.width, c.height).data, a = [];
    for (let i = 0; i < px.length; i += 4) a.push(px[i] / 255);
    a.sort((p, q) => p - q); return a[Math.floor(a.length * pct)] || .8;
  };

  /* 通用查看器：鸟和景点实景照共用。c = { head, title, sub, credit（HTML）, src, depth, pct（不动面取景深的哪个分位）, max（最大位移） }
     传 layers = { fg, bg, near, far } 时改用两层版：前层（带透明度）移 near，后层往反方向移 far（文创透卡用） */
  async function show(c) {
      const P = c;
      const { el, close } = layer('dv-depth', `
        <button class="dv-close icon-btn" type="button" aria-label="关闭">${icon('x')}</button>
        <p class="dv-head">${esc(c.head)}</p>
        <div class="dv-frame"><canvas class="dv-canvas" role="img" aria-label="${esc(c.title)}的照片，倾斜手机或拖动可以看出前后层次"></canvas><i class="dv-glare"></i></div>
        <div class="dv-cap"><b>${esc(c.title)}</b>${c.sub ? `<i>${esc(c.sub)}</i>` : ''}
          <small>${c.credit}</small></div>
        <p class="dv-tip">${gyro.has() ? '倾斜手机看前后层次，也可以用手指拖' : '用手指拖动看前后层次'}</p>${gyroBtn()}`);
      const cv = el.querySelector('.dv-canvas'), g = gl(cv);
      if (!g) { el.querySelector('.dv-tip').textContent = '这个浏览器不支持 WebGL，只能看平面照片。'; cv.replaceWith(Object.assign(new Image(), { src: P.src, className: 'dv-flat' })); return; }
      const L = c.layers;
      const [img, dep] = await Promise.all(L ? [load(L.bg), load(L.fg)] : [load(P.src), load(P.depth)]).catch(() => []);
      if (!img || !el.isConnected) return;
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      const pr = program(g, L ? LAYER_FS : DEPTH_FS);
      texture(g, 0, img); texture(g, 1, dep);
      g.uniform1i(g.getUniformLocation(pr, L ? 'bg' : 'img'), 0); g.uniform1i(g.getUniformLocation(pr, L ? 'fg' : 'dep'), 1);
      g.uniform1f(g.getUniformLocation(pr, 'zoom'), L ? 1 + L.far * 2.4 : 1.07);
      if (!L) g.uniform1f(g.getUniformLocation(pr, 'focus'), focusOf(dep, c.pct || .92));
      const uOff = g.getUniformLocation(pr, L ? 'offB' : 'off'), uOffF = L && g.getUniformLocation(pr, 'offF');
      g.viewport(0, 0, cv.width, cv.height);

      let tx = 0, ty = 0, x = 0, y = 0, drag = null, base = null, lastTouch = 0;
      const MAX = c.max || .03; // 最大位移占画面宽度的比例，留在 zoom 1.07 放大出来的余量里
      cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, tx, ty }; cv.setPointerCapture(e.pointerId); lastTouch = performance.now(); });
      cv.addEventListener('pointermove', e => {
        if (!drag) return; const r = cv.getBoundingClientRect();
        tx = Math.max(-1, Math.min(1, drag.tx + (e.clientX - drag.x) / r.width * 2.4));
        ty = Math.max(-1, Math.min(1, drag.ty + (e.clientY - drag.y) / r.height * 2.4)); lastTouch = performance.now();
      });
      const up = () => { drag = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
      wireGyroBtn(el, () => { base = null; });

      const t0 = performance.now();
      const frame = now => {
        if (!el.isConnected) return;
        if (!drag && gyro.live()) {
          const d = gyro.data; if (!base) base = { b: d.b, g: d.g };
          tx = Math.max(-1, Math.min(1, (d.g - base.g) / 18)); ty = Math.max(-1, Math.min(1, (d.b - base.b) / 18));
          base.b += (d.b - base.b) * .004; base.g += (d.g - base.g) * .004; // 基准慢慢跟上，换个姿势拿手机也能回中
        } else if (!drag && now - lastTouch > 2500 && !reduce()) {
          const t = (now - t0) / 1000; tx = Math.sin(t * .6) * .55; ty = Math.sin(t * .45 + 1) * .3;
        }
        x += (tx - x) * .12; y += (ty - y) * .12;
        if (L) { g.uniform2f(uOff, -x * L.far, -y * L.far * .7); g.uniform2f(uOffF, x * L.near, y * L.near * .7); }
        else g.uniform2f(uOff, -x * MAX, -y * MAX * .7);
        g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
        el.style.setProperty('--gx', (50 + x * 40).toFixed(1) + '%'); el.style.setProperty('--gy', (40 + y * 30).toFixed(1) + '%');
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
      el.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  HL.depthView = {
    /* 鸟：不动面放在鸟所在的深度（最近那一成），清晰的鸟几乎不动 */
    open(id) {
      const s = byId(id), P = s && s.photo3d;
      if (!P) return;
      show({ head: `立体检视 · No.${s.no}`, title: s.bird, sub: s.latin, src: P.src, depth: P.depth, pct: .92, max: .03,
        credit: `照片：${esc(P.author)} · ${esc(P.license)} · <a href="${esc(P.page)}" target="_blank" rel="noopener">Wikimedia Commons</a>` });
    },
    /* 景点实景照：远近连续，不动面放在中景（景深中位数），近景和远景往相反方向移 */
    openScene(id) {
      const s = HL.idx.station[id], P = s && s.photo;
      if (!P || !P.depth) return;
      const url = HL.safeUrl(P.page);
      show({ head: '立体检视 · 精选景观', title: s.name, sub: s.category, src: P.src, depth: P.depth, pct: .5, max: .04,
        credit: `照片：${url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(P.credit)}</a>` : esc(P.credit)}` });
    },
  };
  /* 文创透卡：手持实景效果图拆成前后两层（tools/depth-maps.py --shop）：手和卡一层，轻轻跟着动；卡框里外的实景一层，往反方向移得多 */
  HL.depthView.openProduct = (pid, i) => {
    const p = HL.idx.product[pid], v = p && p.variants && p.variants[i];
    if (!v || !v.scene || !v.fg || !v.bg) return;
    show({ head: '立体检视 · 文创商店', title: `${p.title} · ${v.label}`, sub: '手持效果图', src: v.scene, layers: { fg: v.fg, bg: v.bg, near: .012, far: .05 },
      credit: '设计效果图，实物以上架时为准' });
  };
  HL.act('scene-view', el => HL.depthView.openScene(el.dataset.id));

  /* ---------- 林中全景 ---------- */
  const PANO_FS = `precision mediump float;varying vec2 v;uniform sampler2D tex;uniform float yaw,pitch,tf,asp;
    void main(){vec2 n=(v*2.-1.)*vec2(1.,-1.);vec3 d=normalize(vec3(n.x*tf*asp,n.y*tf,-1.));
      float cp=cos(pitch),sp=sin(pitch);d=vec3(d.x,d.y*cp-d.z*sp,d.y*sp+d.z*cp);
      float cy=cos(yaw),sy=sin(yaw);d=vec3(d.x*cy-d.z*sy,d.y,d.x*sy+d.z*cy);
      vec2 uv=vec2(atan(d.x,-d.z)/6.2831853+.5,.5-asin(clamp(d.y,-1.,1.))/3.1415927);
      gl_FragColor=texture2D(tex,uv);}`;
  const RAD = Math.PI / 180;

  HL.panoView = {
    async open() {
      const PV = B.pano;
      const { el, close } = layer('dv-pano', `
        <canvas class="dv-canvas pano-canvas" role="img" aria-label="声纹栈道林中全景，转动手机或拖动环视四周"></canvas>
        <div class="pano-spots">${PV.spots.map(p => { const s = byId(p.stop); return `<button class="pano-spot" type="button" data-stop="${s.id}" style="--c:${esc(s.colors[2])}"><img src="${esc(s.photo3d.src)}" alt=""><b>${esc(s.bird)}</b><small>${esc(p.hint)}</small></button>`; }).join('')}</div>
        <button class="dv-close icon-btn" type="button" aria-label="关闭">${icon('x')}</button>
        <div class="pano-top"><p class="dv-head">林中全景 · 声纹栈道</p><small>${esc(PV.note)}</small></div>
        <div class="pano-compass" aria-hidden="true"><i></i></div>
        <p class="dv-tip pano-tip">${gyro.has() ? '转动手机环顾四周，找找五只鸟' : '拖动画面环顾四周，找找五只鸟'}</p>${gyroBtn()}`);
      const cv = el.querySelector('.pano-canvas'), g = gl(cv);
      if (!g) { el.querySelector('.pano-tip').textContent = '这个浏览器不支持 WebGL，看不了全景。'; return; }
      const img = await load(PV.src).catch(() => null);
      if (!img || !el.isConnected) return;
      const pr = program(g, PANO_FS);
      texture(g, 0, img, true); // REPEAT 要求 2 的幂尺寸，全景图是 2048×1024
      const U = n => g.getUniformLocation(pr, n), uYaw = U('yaw'), uPitch = U('pitch'), uTf = U('tf'), uAsp = U('asp');
      const fov = 75 * RAD, tf = Math.tan(fov / 2);
      const spots = [...el.querySelectorAll('.pano-spot')].map((b, i) => ({ b, h: PV.spots[i].yaw * RAD, p: PV.spots[i].pitch * RAD }));
      spots.forEach(sp => sp.b.addEventListener('click', () => HL.depthView.open(sp.b.dataset.stop)));

      let yaw = PV.start * RAD, pitch = 0, dragYaw = 0, dragPitch = 0, drag = null, base = null, lastTouch = 0, dpr = Math.min(2, devicePixelRatio || 1);
      const resize = () => { cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; g.viewport(0, 0, cv.width, cv.height); };
      resize(); addEventListener('resize', resize);
      cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, yw: dragYaw, pt: dragPitch }; cv.setPointerCapture(e.pointerId); });
      cv.addEventListener('pointermove', e => {
        if (!drag) return;
        dragYaw = drag.yw - (e.clientX - drag.x) / cv.clientWidth * fov * (cv.clientWidth / cv.clientHeight) * 1.1;
        dragPitch = Math.max(-1.2, Math.min(1.2, drag.pt + (e.clientY - drag.y) / cv.clientHeight * fov * 1.1)); lastTouch = performance.now();
      });
      const up = () => { drag = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
      wireGyroBtn(el, () => { base = null; });
      el.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

      const t0 = performance.now();
      const frame = now => {
        if (!el.isConnected) { removeEventListener('resize', resize); return; }
        let ty = PV.start * RAD + dragYaw, tp = dragPitch;
        if (gyro.live()) {
          /* 竖着拿手机：alpha 是朝向（逆时针增大），beta 90° 是平视 */
          const d = gyro.data; if (!base) base = { a: d.a };
          let da = (base.a - d.a) * RAD; da = Math.atan2(Math.sin(da), Math.cos(da));
          ty += da; tp += Math.max(-1.2, Math.min(1.2, (d.b - 90) * RAD));
        } else if (!drag && now - lastTouch > 3000 && !reduce()) ty += (now - t0) / 1000 * .05; // 没有体感时慢慢转
        let dy = ty - yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        yaw += dy * .15; pitch += (Math.max(-1.25, Math.min(1.25, tp)) - pitch) * .15;
        const asp = cv.width / cv.height;
        g.uniform1f(uYaw, yaw); g.uniform1f(uPitch, pitch); g.uniform1f(uTf, tf); g.uniform1f(uAsp, asp);
        g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
        /* 鸟点位：把方向转到相机坐标，投到屏幕上 */
        const W = cv.clientWidth, H = cv.clientHeight, cy = Math.cos(-yaw), sy = Math.sin(-yaw), cp = Math.cos(-pitch), spp = Math.sin(-pitch);
        for (const sp of spots) {
          let x = Math.sin(sp.h) * Math.cos(sp.p), y = Math.sin(sp.p), z = -Math.cos(sp.h) * Math.cos(sp.p);
          [x, z] = [x * cy - z * sy, x * sy + z * cy];
          [y, z] = [y * cp - z * spp, y * spp + z * cp];
          const vis = -z > .15, sx = x / -z / (tf * asp), syy = y / -z / tf;
          sp.b.style.transform = `translate(${((sx + 1) / 2 * W).toFixed(1)}px, ${((1 - syy) / 2 * H).toFixed(1)}px) translate(-50%, -50%) scale(${vis ? 1 : 0})`;
          sp.b.style.opacity = vis && Math.abs(sx) < 1.3 ? 1 : 0;
        }
        el.querySelector('.pano-compass i').style.transform = `rotate(${(-yaw / RAD).toFixed(1)}deg)`;
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    },
  };

  HL.act('depth-view', el => HL.depthView.open(el.dataset.id));
  HL.act('pano-view', () => HL.panoView.open());
})();
