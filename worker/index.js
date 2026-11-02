/* 线上入口。静态文件由 Cloudflare assets 直接返回，这里只处理没有对应文件的请求。

   /src/config.local.js：本机开发时是不进仓库的文件，线上由这里用 Secret 生成，
   这样 Key 不在仓库、也不在上传的静态文件里。设置方法：
     wrangler secret put TMAP_JS_KEY
   注意：网页端 Key 本来就会被浏览器拿到，只能靠腾讯控制台的域名白名单保护。 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/src/config.local.js') {
      const key = String(env.TMAP_JS_KEY || '').trim();
      return new Response(`HL.config.tmapKey = ${JSON.stringify(key)};\n`, {
        headers: { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-store' },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
