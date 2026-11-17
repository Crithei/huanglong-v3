/* 写 NFC 芯片的工具页：网址带 ?nfc=write 时打开（不在页面上放入口，给布置现场的人用）。
   用安卓手机的 Chrome 打开线上网址，点某个点位的「写入」，把空白芯片贴到手机背面就写好了（Web NFC，只有安卓 Chrome 支持，必须是 https）。
   每个芯片写一条网址记录：…/?rec=采集点&via=nfc（声景手册）、…/?tag=s1&via=nfc（栈道手册，博物画图鉴动画）
   或 …/?tag=s1&via=nfc&fx=points（栈道手册，点云动画；另起一批芯片，两种并存）。
   iPhone 不能用网页写，只能读：可以复制网址，用 NFC Tools 之类的 App 写。这里不提供「锁定芯片」，锁定不可撤销，要锁请在 App 里做。 */
(() => {
  'use strict';
  const { $, esc, icon } = HL;
  const can = 'NDEFReader' in window;
  const base = () => location.origin + location.pathname;
  const urlFor = (key, id, fx) => `${base()}?${key}=${id}&via=nfc${fx ? `&fx=${fx}` : ''}`;

  function points() {
    const TG = HL.data.sounds.targets, K = HL.data.sounds.kinds, ST = HL.data.birds.stops;
    const place = t => t.place || HL.idx.station[t.station].name;
    return [
      { group: '声景手册 · 采集点', items: TG.map((t, i) => ({ key: 'rec', id: t.id, no: i + 1, title: t.title, place: place(t), color: K.find(k => k.id === t.kind).color })) },
      { group: '栈道手册 · 声音驿站（博物画图鉴动画）', items: ST.map(s => ({ key: 'tag', id: s.id, no: s.no, title: s.bird, place: s.place, color: '#2e5d4b' })) },
      { group: '栈道手册 · 声音驿站（点云动画）', items: ST.map(s => ({ key: 'tag', id: s.id, fx: 'points', no: s.no, title: s.bird, place: s.place, color: '#12161a' })) },
    ];
  }

  let ctrl = null;
  const stop = () => { if (ctrl) { ctrl.abort(); ctrl = null; } };

  function open() {
    const prod = location.protocol === 'https:';
    HL.openSheet({
      title: '写入 NFC 芯片', cls: 'nfc-sheet',
      body: `
        <p class="nfc-state ${can ? 'is-ok' : 'is-no'}">${icon(can ? 'check' : 'info')}${can
          ? '这台手机可以直接写。点「写入」，再把芯片贴到手机背面摄像头下方，听到提示或看到「已写入」再拿开。'
          : '这个浏览器不能写芯片。请用安卓手机的 Chrome 打开这个网址；也可以点「复制」，用 NFC Tools 之类的 App 写入。'}</p>
        ${prod ? '' : `<p class="nfc-state is-no">${icon('info')}现在是本地地址（${esc(location.host)}），写进去的网址别人打不开。正式布置请在线上网址打开本页。</p>`}
        <p class="nfc-base">写入的网址前缀：<code>${esc(base())}</code></p>
        ${can ? `<button class="btn btn-ghost nfc-read" type="button" data-act="nfc-read">${icon('zoom')}读取一张芯片核对</button><p class="nfc-msg" id="nfcRead" role="status"></p>` : ''}
        ${points().map(g => `<h3 class="nfc-h">${esc(g.group)}</h3>
          <ul class="nfc-list">${g.items.map(p => `<li style="--k:${p.color}">
            <i class="nfc-no">${p.no}</i>
            <div class="nfc-t"><b>${esc(p.title)}</b><small>${esc(p.place)}</small><code>?${p.key}=${p.id}&amp;via=nfc${p.fx ? `&amp;fx=${p.fx}` : ''}</code><span class="nfc-msg" id="nfc-${p.id}${p.fx ? '-' + p.fx : ''}" role="status"></span></div>
            <div class="nfc-b">
              ${can ? `<button class="btn btn-primary btn-sm" type="button" data-act="nfc-write" data-key="${p.key}" data-id="${p.id}" data-fx="${p.fx || ''}">写入</button>` : ''}
              <button class="btn btn-ghost btn-sm" type="button" data-act="nfc-copy" data-key="${p.key}" data-id="${p.id}" data-fx="${p.fx || ''}">复制</button>
              <button class="btn btn-ghost btn-sm" type="button" data-act="nfc-try" data-key="${p.key}" data-id="${p.id}" data-fx="${p.fx || ''}">预览</button>
            </div></li>`).join('')}</ul>`).join('')}
        <p class="note">一个芯片写一个点位。写之前先把芯片贴在要放的位置旁边编好号，写完用「读取」核对一遍再固定。</p>`,
    });
  }

  HL.act('nfc-write', async el => {
    stop();
    const { key, id, fx } = el.dataset, msg = $('#nfc-' + id + (fx ? '-' + fx : '')), url = urlFor(key, id, fx);
    ctrl = new AbortController();
    const timer = setTimeout(stop, 25000);
    msg.textContent = '请把芯片贴到手机背面…'; msg.className = 'nfc-msg is-wait';
    try {
      await new NDEFReader().write({ records: [{ recordType: 'url', data: url }] }, { signal: ctrl.signal, overwrite: true });
      msg.textContent = '已写入'; msg.className = 'nfc-msg is-ok';
      try { navigator.vibrate && navigator.vibrate(30); } catch (e) { /* 不支持 */ }
    } catch (e) {
      msg.className = 'nfc-msg is-err';
      msg.textContent = e.name === 'AbortError' ? '超时了，没有碰到芯片。再点一次写入。'
        : e.name === 'NotAllowedError' ? '没有 NFC 权限，或者手机的 NFC 没打开。'
        : e.name === 'NotSupportedError' ? '芯片不支持写入，可能已经锁定。'
        : `写入失败：${e.message || e.name}`;
    } finally { clearTimeout(timer); ctrl = null; }
  });

  HL.act('nfc-read', async () => {
    stop();
    const msg = $('#nfcRead'), reader = new NDEFReader();
    ctrl = new AbortController();
    const timer = setTimeout(stop, 25000);
    msg.textContent = '请把芯片贴到手机背面…'; msg.className = 'nfc-msg is-wait';
    try {
      await reader.scan({ signal: ctrl.signal });
      reader.onreading = e => {
        const rec = e.message.records.find(r => r.recordType === 'url' || r.recordType === 'absolute-url');
        const url = rec ? new TextDecoder().decode(rec.data) : '';
        const q = url ? new URL(url).searchParams : new URLSearchParams(), id = q.get('rec') || q.get('tag');
        const fx = q.get('fx') || undefined, p = points().flatMap(g => g.items).find(x => x.id === id && x.fx === fx);
        msg.className = 'nfc-msg ' + (p ? 'is-ok' : 'is-err');
        msg.textContent = !rec ? `这张芯片里没有网址（序列号 ${e.serialNumber || '未知'}）。`
          : p ? `${p.no}. ${p.title}（${p.place}）：${url}` : `网址不是本项目的点位：${url}`;
        clearTimeout(timer); stop();
      };
    } catch (e) {
      clearTimeout(timer);
      msg.className = 'nfc-msg is-err'; msg.textContent = e.name === 'AbortError' ? '超时了，没有碰到芯片。' : `读取失败：${e.message || e.name}`;
    }
  });

  HL.act('nfc-copy', async el => {
    const url = urlFor(el.dataset.key, el.dataset.id, el.dataset.fx);
    try { await navigator.clipboard.writeText(url); HL.toast('已复制网址'); } catch (e) { HL.toast(url); }
  });

  /* 预览：不用芯片，直接播一遍碰一碰的动画 */
  HL.act('nfc-try', el => {
    stop(); HL.closeSheet();
    if (el.dataset.key === 'rec') HL.bankArrive(el.dataset.id, 'nfc'); else HL.soundArrive(el.dataset.id, 'nfc', el.dataset.fx);
  });

  const close = HL.closeSheet;
  HL.closeSheet = () => { stop(); close(); };

  HL.nfcFromUrl = () => {
    const params = new URLSearchParams(location.search);
    if (params.get('nfc') !== 'write') return;
    params.delete('nfc');
    history.replaceState(null, '', location.pathname + (params.toString() ? '?' + params : '') + location.hash);
    open();
  };
  HL.openNfcWriter = open;
})();
