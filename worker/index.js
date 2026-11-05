/* 线上入口。静态文件由 Cloudflare assets 直接返回，这里只处理没有对应文件的请求。

   腾讯地图 Key 用官方「代理服务转发」方案（https://lbs.qq.com/webApi/javascriptGL/glGuide/glKeyDelegate）：
   浏览器加载地图时不带 Key，JSAPI 把需要 Key 的请求发到 /_TMapService/…，由这里补上 Secret 里的 Key 再转给腾讯。
   Key 不在仓库、不在上传的文件里，也不会出现在浏览器的源码和网络请求中。设置方法：
     wrangler secret put TMAP_JS_KEY

   /src/config.local.js：本机开发时是不进仓库、写着 Key 的文件；线上由这里生成，只告诉页面地图和数字人的代理地址，不含 Key。 */

/* 只接受从这些网站发起的地图和数字人请求，防止别人借我们的域名消耗额度 */
const ALLOWED_HOSTS = ['huanglong.nyxal.site', 'huanglong-v3.itsmephrynx.workers.dev', 'localhost', '127.0.0.1']; // 后两个给 wrangler dev 本机调试

/* 与官方 Nginx 示例对应：[路径前缀, 转发目标, Key 参数名, 是否保留前缀之后的路径]
   官方示例里还有 /_TMapService/service → apis.map.qq.com/ws（WebService），这里故意不转发：
   页面没用到服务类库，而来源检查挡不住伪造 Referer 的脚本，开着会让人借域名消耗额度。
   以后要搜地点、查路线，另写带限流的服务端接口，不要把它加回来。 */
const TMAP_ROUTES = [
  ['/_TMapService/checkKey', 'https://apikey.map.qq.com/mkey/index.php/mkey/check', 'key', false],
  ['/_TMapService/oversea', 'https://overseactrl.map.qq.com', 'apikey', true],
];
const TMAP_PING = ['/_TMapService', 'https://pr.map.qq.com/pingd?appid=jsapi_v3', 'key', false];

function fromOurSite(request) {
  const src = request.headers.get('Origin') || request.headers.get('Referer');
  if (!src) return false;
  try { return ALLOWED_HOSTS.includes(new URL(src).hostname); } catch (e) { return false; }
}

async function proxyTmap(request, env, url) {
  const key = String(env.TMAP_JS_KEY || '').trim();
  if (!key) return new Response('map key not configured', { status: 503 });
  if (!fromOurSite(request)) return new Response('forbidden', { status: 403 });
  /* 只认这几条确切路径；/_TMapService/service 等其他子路径一律 404，不会落到统计接口上 */
  const route = url.pathname === TMAP_PING[0] ? TMAP_PING
    : TMAP_ROUTES.find(([prefix]) => url.pathname === prefix || url.pathname.startsWith(prefix + '/'));
  if (!route) return new Response('not found', { status: 404 });
  const [prefix, target, keyName, keepPath] = route;
  const out = new URL(target + (keepPath ? url.pathname.slice(prefix.length) : ''));
  url.searchParams.forEach((v, k) => { if (k !== 'key' && k !== 'apikey') out.searchParams.append(k, v); });
  out.searchParams.set(keyName, key);
  const upstream = await fetch(out.toString(), {
    method: request.method,
    headers: { 'Accept': request.headers.get('Accept') || '*/*', 'User-Agent': request.headers.get('User-Agent') || '' },
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
  });
  const headers = new Headers(upstream.headers);
  headers.set('Cache-Control', 'no-store');
  return new Response(upstream.body, { status: upstream.status, headers });
}

/* 数字人云端同源代理（方案来自「黄龙知识库接入_nyxal站点_部署包」）。
   WorkBuddy 云只放行应用登记的发布域名，huanglong.nyxal.site 不在名单里，平台放行前由这里转发：
   页面请求 /cloud/.cloud/…（同源，没有跨域），这里把 Origin 换成登记域名再转给云端。
   只放行页面真正用到的两个接口：知识库检索 kb_search 和大模型流式对话；其他路径一律 404，
   并且只接受从我们网站发起的请求，防止别人借域名调用对方的大模型额度。
   平台正式放行后：把 src/data/guide.js 的 proxy 删掉，再删掉这一段。 */
const CLOUD_UPSTREAM = 'https://huanglong-digital-human.app.workbuddy.host';
const CLOUD_ALLOWED = [
  /^\/\.cloud\/database\/rest\/(?:v1\/)?rpc\/kb_search$/, // SDK 实际请求不带 v1，部署包文档里带
  /^\/\.cloud\/llm\/(?:[\w-]+\/)*chat\/completions$/,
];

async function proxyCloud(request, url) {
  if (!fromOurSite(request)) return new Response('forbidden', { status: 403 });
  const path = url.pathname.slice('/cloud'.length);
  if (request.method !== 'POST' || !CLOUD_ALLOWED.some(re => re.test(path))) return new Response('not found', { status: 404 });
  const headers = new Headers();
  ['Content-Type', 'Accept', 'Authorization', 'Prefer', 'X-Wb-Webapp-Access-Key'].forEach(h => {
    const v = request.headers.get(h); if (v) headers.set(h, v);
  });
  for (const [k, v] of request.headers) if (k.startsWith('x-wb-') || k.startsWith('accept-profile') || k.startsWith('content-profile')) headers.set(k, v);
  headers.set('Origin', CLOUD_UPSTREAM);
  headers.set('Accept-Encoding', 'identity'); // fetch 会自动解压，原样透传压缩头会让浏览器二次解码
  let upstream;
  try {
    upstream = await fetch(CLOUD_UPSTREAM + path + url.search, { method: 'POST', headers, body: request.body, redirect: 'manual', duplex: 'half' }); // duplex 给 Node 本地自测用，Workers 会忽略
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: 'upstream_unreachable' } }), { status: 502, headers: { 'content-type': 'application/json' } });
  }
  const out = new Headers(upstream.headers);
  ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers', 'Content-Encoding', 'Content-Length']
    .forEach(h => out.delete(h));
  out.set('Cache-Control', 'no-store');
  return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: out }); // 原样透传，保留流式回答
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/cloud/')) return proxyCloud(request, url);
    if (url.pathname === '/_TMapService' || url.pathname.startsWith('/_TMapService/')) {
      return proxyTmap(request, env, url);
    }
    if (url.pathname === '/src/config.local.js') {
      const on = Boolean(String(env.TMAP_JS_KEY || '').trim());
      const body = (on ? 'HL.config.tmapProxy = location.origin + "/_TMapService";\n' : '')
        + 'HL.config.cloudProxy = location.origin + "/cloud";\n';
      return new Response(body, {
        headers: { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-store' },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
