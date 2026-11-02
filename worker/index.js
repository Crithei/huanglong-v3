/* 线上入口。静态文件由 Cloudflare assets 直接返回，这里只处理没有对应文件的请求。

   腾讯地图 Key 用官方「代理服务转发」方案（https://lbs.qq.com/webApi/javascriptGL/glGuide/glKeyDelegate）：
   浏览器加载地图时不带 Key，JSAPI 把需要 Key 的请求发到 /_TMapService/…，由这里补上 Secret 里的 Key 再转给腾讯。
   Key 不在仓库、不在上传的文件里，也不会出现在浏览器的源码和网络请求中。设置方法：
     wrangler secret put TMAP_JS_KEY

   /src/config.local.js：本机开发时是不进仓库、写着 Key 的文件；线上由这里生成，只告诉页面代理地址，不含 Key。 */

/* 只接受从这些网站发起的地图请求，防止别人借我们的域名消耗 Key 的额度 */
const ALLOWED_HOSTS = ['huanglong.nyxal.site', 'huanglong-v3.itsmephrynx.workers.dev'];

/* 与官方 Nginx 示例一一对应：[路径前缀, 转发目标, Key 参数名, 是否保留前缀之后的路径] */
const TMAP_ROUTES = [
  ['/_TMapService/checkKey', 'https://apikey.map.qq.com/mkey/index.php/mkey/check', 'key', false],
  ['/_TMapService/oversea', 'https://overseactrl.map.qq.com', 'apikey', true],
  ['/_TMapService/service', 'https://apis.map.qq.com/ws', 'key', true],
  ['/_TMapService', 'https://pr.map.qq.com/pingd?appid=jsapi_v3', 'key', false],
];

function fromOurSite(request) {
  const src = request.headers.get('Origin') || request.headers.get('Referer');
  if (!src) return false;
  try { return ALLOWED_HOSTS.includes(new URL(src).hostname); } catch (e) { return false; }
}

async function proxyTmap(request, env, url) {
  const key = String(env.TMAP_JS_KEY || '').trim();
  if (!key) return new Response('map key not configured', { status: 503 });
  if (!fromOurSite(request)) return new Response('forbidden', { status: 403 });
  const route = TMAP_ROUTES.find(([prefix]) => url.pathname === prefix || url.pathname.startsWith(prefix + '/'));
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/_TMapService' || url.pathname.startsWith('/_TMapService/')) {
      return proxyTmap(request, env, url);
    }
    if (url.pathname === '/src/config.local.js') {
      const on = Boolean(String(env.TMAP_JS_KEY || '').trim());
      const body = on ? 'HL.config.tmapProxy = location.origin + "/_TMapService";\n' : '';
      return new Response(body, {
        headers: { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-store' },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
