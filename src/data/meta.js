/* 首页主视觉、精选景观、终点与数据来源。
   字段说明见 docs/开发指南.md 的「数据」一节。
   等号右边必须是合法 JSON（双引号、无尾逗号、不写注释），运行 python tools/check.py 校验。 */
HL.data.meta = {
  "source": {
    "pois": "第一版 data/scenic.js，景点内容核对于 2026-09-20",
    "facilities": "高德地图 Web Service v3/place/around，查询于 2026-09-18，坐标 GCJ-02"
  },
  "hero": {
    "station": "five-color-pond",
    "title": "黄龙",
    "tagline": "人间瑶池",
    "lead": "一条钙华沟谷，从迎宾池一路走到五彩池。",
    "alt": "五彩池层叠的钙华池与碧蓝池水",
    "credit": "五彩池实景，摄影 Kounosu，CC BY-SA 3.0"
  },
  "finale": "five-color-pond",
  "finaleAltitude": "约 3576 米",
  "featured": [
    "welcome-pond",
    "flying-waterfall",
    "liantai-fall",
    "wash-body-viewpoint",
    "jinsha-pudi",
    "bonsai-pond",
    "mirror-pond",
    "suoluo-pond",
    "zhengyan-chi",
    "immortal-bridge",
    "huanglong-middle-temple",
    "huanglong-ancient-temple",
    "five-color-pond"
  ]
};
