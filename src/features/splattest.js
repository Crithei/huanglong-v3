/* 高斯泼溅测试页：网址带 ?splat=test 时打开（页面上没有入口，和 ?nfc=write 一样）。
   显示 Apple SHARP 从五张鸟类照片生成的完整 3D 高斯场景（tools/sharp-splat.py 生成，assets/sound/3d/sN.splat），用 gsplat.js 渲染。
   两种看法：「小幅环绕」跟随手机倾斜（和立体检视一样的手感）；「自由旋转」拖动绕场景转、双指或滚轮缩放，能看出场景的边界。
   场景文件每只约 35 MB，超过 Cloudflare 单文件 25 MB 上限，模型也只许研究用途，所以只在本地有；线上打开会提示文件不在。 */
(() => {
  'use strict';
  const { esc, icon } = HL;
  const STOPS = () => HL.data.birds.stops;

  async function open() {
    const el = document.createElement('div');
    el.className = 'dv st is-in';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', '高斯泼溅测试页');
    el.innerHTML = `
      <canvas class="st-canvas" aria-label="3D 高斯场景，拖动可以转动"></canvas>
      <button class="dv-close icon-btn" type="button" aria-label="关闭">${icon('x')}</button>
      <div class="st-top">
        <p class="dv-head">高斯泼溅测试 · SHARP 单图生成</p>
        <div class="st-birds" role="group" aria-label="选鸟">${STOPS().map((s, i) => `<button type="button" data-id="${s.id}" aria-pressed="${i === 0}">${esc(s.bird)}</button>`).join('')}</div>
        <div class="dv-modes" role="group" aria-label="看法"><button type="button" data-mode="tilt" aria-pressed="true">小幅环绕</button><button type="button" data-mode="free" aria-pressed="false">自由旋转</button></div>
      </div>
      <div class="st-info" aria-live="polite"></div>
      <p class="dv-tip st-tip"></p>
      <small class="st-note">3D 场景由 Apple SHARP 模型从照片生成，仅供研究演示；照片来自 Wikimedia Commons，作者与授权见立体检视</small>`;
    document.body.append(el);
    const shell = [document.querySelector('.pages'), document.querySelector('.tabbar'), document.querySelector('.fab'), document.querySelector('#layer')];
    shell.forEach(e => { if (e) e.inert = true; });
    const info = el.querySelector('.st-info'), tip = el.querySelector('.st-tip');
    let alive = true, controls = null;
    el.querySelector('.dv-close').addEventListener('click', () => { alive = false; shell.forEach(e => { if (e) e.inert = false; }); el.remove(); });

    let SPLAT, meta;
    try {
      SPLAT = await import(new URL('vendor/gsplat/gsplat.es.js', location.href).href);
      meta = await (await fetch('assets/sound/3d/splat-meta.json', { cache: 'no-store' })).json();
    } catch (e) {
      info.textContent = '这里没有场景文件。场景只在本地生成：运行 tools/sharp-splat.py，再用本地预览打开 ?splat=test。';
      return;
    }
    const cv = el.querySelector('.st-canvas');
    const renderer = new SPLAT.WebGLRenderer(cv);
    renderer.backgroundColor = new SPLAT.Color32(26, 30, 24, 255);
    const camera = new SPLAT.Camera();
    let scene = new SPLAT.Scene(), cur = null, mode = 'tilt', W = 0, H = 0;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const fit = () => {
      W = Math.round(cv.clientWidth * dpr); H = Math.round(cv.clientHeight * dpr);
      renderer.setSize(W, H);
      if (cur) { const m = meta[cur]; camera.data.fx = camera.data.fy = Math.min(W, H * m.aspect) * m.fx; } // 让整张照片的画幅放得下
    };
    addEventListener('resize', fit);

    /* 小幅环绕：倾斜 / 拖动 / 没人碰时轻摆，相机绕鸟所在深度移动、始终看着鸟 */
    let tx = 0, ty = 0, x = 0, y = 0, drag = null, base = null, lastTouch = 0;
    const t0 = performance.now();
    cv.addEventListener('pointerdown', e => { if (mode !== 'tilt') return; drag = { x: e.clientX, y: e.clientY, tx, ty }; lastTouch = performance.now(); });
    cv.addEventListener('pointermove', e => {
      if (!drag) return;
      tx = Math.max(-1, Math.min(1, drag.tx + (e.clientX - drag.x) / cv.clientWidth * 2.4));
      ty = Math.max(-1, Math.min(1, drag.ty + (e.clientY - drag.y) / cv.clientHeight * 2.4)); lastTouch = performance.now();
    });
    addEventListener('pointerup', () => { drag = null; });
    let gyroData = null;
    const onOri = e => { if (e.beta != null) gyroData = { b: e.beta, g: e.gamma || 0, t: performance.now() }; };
    const startGyro = async () => {
      try { if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission && (await DeviceOrientationEvent.requestPermission()) !== 'granted') return; } catch (e) { return; }
      addEventListener('deviceorientation', onOri);
    };
    if (!(typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission)) startGyro();
    else { const b = document.createElement('button'); b.className = 'dv-gyro'; b.type = 'button'; b.innerHTML = `${icon('rotr')}开启体感`; b.onclick = () => { startGyro(); b.remove(); }; el.append(b); }

    const setMode = m => {
      mode = m;
      el.querySelectorAll('.dv-modes button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
      if (controls) { controls.dispose(); controls = null; }
      if (m === 'free' && cur) {
        const f = meta[cur].focus;
        controls = new SPLAT.OrbitControls(camera, cv, 0, 0, f, false, new SPLAT.Vector3(0, 0, f));
        controls.minZoom = f * .15; controls.maxZoom = f * 4;
      }
      tip.textContent = m === 'free' ? '拖动绕场景转，双指或滚轮缩放；转到侧面能看出这个场景只是从一张照片「长」出来的一层壳' : '倾斜手机或拖动，看小幅环绕下的前后层次';
    };
    el.querySelectorAll('.dv-modes button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

    let loading = 0;
    const load = async id => {
      const my = ++loading;
      el.querySelectorAll('.st-birds button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
      const m = meta[id];
      if (!m) { info.textContent = `${id} 还没有生成场景`; return; }
      const t = performance.now(), next = new SPLAT.Scene();
      try {
        await SPLAT.Loader.LoadAsync(`assets/sound/3d/${id}.splat`, next, p => { if (my === loading) info.textContent = `加载中 ${Math.round(p * 100)}%（约 ${(m.count * 32 / 2 ** 20).toFixed(0)} MB）`; });
      } catch (e) { if (my === loading) info.textContent = '场景文件加载失败（只在本地有）'; return; }
      if (my !== loading || !alive) return;
      scene = next; cur = id; fit(); setMode(mode);
      info.textContent = `${m.count.toLocaleString()} 个高斯 · ${(m.count * 32 / 2 ** 20).toFixed(1)} MB · 加载 ${((performance.now() - t) / 1000).toFixed(1)} 秒`;
    };
    el.querySelectorAll('.st-birds button').forEach(b => b.addEventListener('click', () => load(b.dataset.id)));

    let frames = 0, fpsT = performance.now(), fps = 0;
    const frame = now => {
      if (!alive) { removeEventListener('resize', fit); removeEventListener('deviceorientation', onOri); renderer.dispose(); return; }
      if (cur) {
        if (mode === 'tilt') {
          if (!drag && gyroData && now - gyroData.t < 1000) {
            if (!base) base = { b: gyroData.b, g: gyroData.g };
            tx = Math.max(-1, Math.min(1, (gyroData.g - base.g) / 18)); ty = Math.max(-1, Math.min(1, (gyroData.b - base.b) / 18));
          } else if (!drag && now - lastTouch > 2500) { const s = (now - t0) / 1000; tx = Math.sin(s * .6) * .55; ty = Math.sin(s * .45 + 1) * .3; }
          x += (tx - x) * .12; y += (ty - y) * .12;
          const f = meta[cur].focus, pos = new SPLAT.Vector3(-x * .07 * f, -y * .05 * f, 0);
          camera.position = pos;
          camera.rotation = SPLAT.Quaternion.LookRotation(new SPLAT.Vector3(0, 0, f).subtract(pos).normalize());
        } else if (controls) controls.update();
        renderer.render(scene, camera);
        frames++;
        if (now - fpsT > 1000) { fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now; el.querySelector('.st-info').dataset.fps = `${fps} fps`; }
      }
      requestAnimationFrame(frame);
    };
    fit(); setMode('tilt');
    requestAnimationFrame(frame);
    load(STOPS()[0].id);
  }

  HL.splatFromUrl = () => {
    const params = new URLSearchParams(location.search);
    if (params.get('splat') !== 'test') return;
    params.delete('splat');
    history.replaceState(null, '', location.pathname + (params.toString() ? '?' + params : '') + location.hash);
    open();
  };
})();
