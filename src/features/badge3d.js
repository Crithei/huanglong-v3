/* 生灵徽章的金属检视器（参考麦当劳徽章页：正面珐琅金属、背面刻字、可拖动旋转）。
   一张透明底的徽章图同时当作三样东西用：正面的画、侧边叠层的蒙版、背面金板的蒙版。
   侧边是 LAYERS 张蒙版叠在 Z 轴上，转到侧面就看到一圈金属厚度；正面和背面各盖一层随角度移动的高光。
   交互：拖动旋转，松手后带惯性回到最近的一面；轻点翻面；没人碰时轻轻摆动。安卓手机还会跟着手机倾斜。
   html(opts) 生成结构，mount(root) 启动；root 从页面上移除后循环自动停止。 */
(() => {
  'use strict';
  const { esc } = HL;
  const DEPTH = 18, LAYERS = 24;
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 背面的蝴蝶扣：两个圆形针托 */
  /* CSS 变量里的 url() 会按样式表的位置解析，这里先转成绝对地址 */
  const abs = src => new URL(src, location.href).href;
  const clutch = cls => `<i class="bv-clutch ${cls}"><i></i></i>`;

  HL.badge3d = {
    /* opts: { src, metal(描边蒙版图，见 tools/metal-mask.py), state: got|near|locked, name, latin, en, place, date, no, total, stamp(邮戳 HTML，可选) } */
    html(o) {
      const edges = Array.from({ length: LAYERS }, (_, i) => {
        const z = -DEPTH / 2 + (DEPTH * (i + .5)) / LAYERS;
        return `<i class="bv-edge" style="transform:translateZ(${z.toFixed(2)}px)"></i>`;
      }).join('');
      const back = o.state === 'got'
        ? `<small>黄龙 · 生灵徽章</small><b>${esc(o.name)}</b><i>${esc(o.latin)}</i>
           <span class="bv-rule"></span><em>${esc(o.place)}</em><em>${esc(o.date)} 点亮</em><small class="bv-no">No.${String(o.no).padStart(2, '0')} / ${String(o.total).padStart(2, '0')}</small>`
        : `<small>黄龙 · 生灵徽章</small><b>${o.state === 'near' ? '待点亮' : '未解锁'}</b><span class="bv-rule"></span><em>${esc(o.place)}</em>`;
      return `<div class="bv is-${o.state}" style="--src:url('${esc(abs(o.src))}');--metal:url('${esc(abs(o.metal || o.src))}')">
        <div class="bv-stage" role="img" aria-label="${esc(o.name)}徽章，可拖动旋转查看背面">
          <div class="bv-obj">
            ${edges}
            <div class="bv-face bv-front"><img src="${esc(o.src)}" alt="" draggable="false"><i class="bv-holo"></i><i class="bv-sheen"></i><i class="bv-gild"></i><i class="bv-glint"></i></div>
            <div class="bv-face bv-back"><div class="bv-plate"></div>${clutch('l')}${clutch('r')}<div class="bv-text">${back}</div><i class="bv-sheen"></i></div>
          </div>
        </div>
        <div class="bv-shadow"></div>
        <p class="bv-tip">拖动转一转，轻点翻到背面</p>${o.stamp || ''}
      </div>`;
    },

    mount(root) {
      if (!root || root.dataset.on) return;
      root.dataset.on = '1';
      const obj = root.querySelector('.bv-obj'), stage = root.querySelector('.bv-stage');
      let rx = -6, ry = -18, vx = 0, vy = 0, target = 0, drag = null, t0 = performance.now(), tilt = { x: 0, y: 0 };
      let idle = !reduce(), lastTouch = 0;

      const onTilt = e => {
        if (e.beta == null) return;
        tilt = { x: Math.max(-14, Math.min(14, (e.beta - 45) * .35)), y: Math.max(-18, Math.min(18, e.gamma * .45)) };
      };
      addEventListener('deviceorientation', onTilt);

      stage.addEventListener('pointerdown', e => {
        drag = { x: e.clientX, y: e.clientY, rx, ry, moved: 0, t: performance.now() };
        stage.setPointerCapture(e.pointerId); vx = vy = 0; lastTouch = performance.now();
        root.classList.add('is-drag');
      });
      stage.addEventListener('pointermove', e => {
        if (!drag) return;
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
        const nry = drag.ry + dx * .55, nrx = Math.max(-40, Math.min(40, drag.rx - dy * .4));
        vy = nry - ry; vx = nrx - rx; ry = nry; rx = nrx;
      });
      const end = () => {
        if (!drag) return;
        if (drag.moved < 6) target += 180;                  // 轻点：翻面
        else target = Math.round((ry + Math.max(-150, Math.min(150, vy * 8))) / 180) * 180; // 甩动：按惯性落到最近的一面
        drag = null; lastTouch = performance.now(); root.classList.remove('is-drag');
      };
      stage.addEventListener('pointerup', end);
      stage.addEventListener('pointercancel', end);

      const frame = now => {
        if (!root.isConnected) { removeEventListener('deviceorientation', onTilt); return; }
        if (!drag) {
          const t = (now - t0) / 1000, quiet = now - lastTouch > 2200 && idle;
          const sway = quiet ? Math.sin(t * .7) * 16 : 0, nod = quiet ? Math.sin(t * .9 + 1) * 5 : 0;
          ry += (target + sway + tilt.y - ry) * .08;
          rx += (-4 + nod + tilt.x - rx) * .08;
        }
        obj.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        /* 高光位置跟着角度走：正面朝左转时亮带往右滑，像光源固定在左上方 */
        const a = ((ry % 360) + 540) % 360 - 180, facing = Math.abs(a) < 90 ? a : (a > 0 ? a - 180 : a + 180);
        root.style.setProperty('--gx', (50 - facing * 1.6).toFixed(1) + '%');
        root.style.setProperty('--gy', (50 + rx * 1.4).toFixed(1) + '%');
        root.style.setProperty('--side', Math.abs(Math.sin(a * Math.PI / 180)).toFixed(3));
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    },

    /* 互动页格子里的小徽章：一道只沿描边走的扫光 */
    mini(src, state, metal) {
      return `<span class="bv-mini is-${state}" style="--src:url('${esc(abs(src))}');--metal:url('${esc(abs(metal || src))}')"><img src="${esc(src)}" alt="" loading="lazy" decoding="async"></span>`;
    },
  };
})();
