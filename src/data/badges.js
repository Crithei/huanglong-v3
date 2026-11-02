/* 徽章与贴纸：主题徽章（按六枚主章计数）与实验贴纸。规则和文字沿用 v1 data/passport.js，图在 assets/badges/。
   等号右边必须是合法 JSON，运行 python tools/check.py 校验。 */
HL.data.badges = {
  "source": "v1 data/passport.js 的 themes 与 pool 实验，图来自 v1 assets/passport/（原创 SVG）",
  "main": [
    "welcome-pond",
    "flying-waterfall",
    "jinsha-pudi",
    "bonsai-pond",
    "zhengyan-chi",
    "five-color-pond"
  ],
  "themes": [
    {
      "id": "gentle",
      "title": "慢看两站",
      "reward": "山水初见",
      "need": 2,
      "labs": 0,
      "img": "assets/badges/badge-gentle.svg",
      "description": "六枚主章任意两枚。可以折返，也可以慢慢走。"
    },
    {
      "id": "wander",
      "title": "山水漫游",
      "reward": "山水同行",
      "need": 3,
      "labs": 0,
      "img": "assets/badges/badge-wander.svg",
      "description": "六枚主章任意三枚，不限顺序、不赶时间。"
    },
    {
      "id": "observer",
      "title": "自然观察",
      "reward": "细节发现者",
      "need": 2,
      "labs": 1,
      "img": "assets/badges/badge-observer.svg",
      "description": "任意两枚主章，加一枚实验贴纸。多看一眼也算一段旅程。"
    }
  ],
  "stickers": [
    {
      "id": "pool",
      "title": "池群观察者",
      "img": "assets/badges/sticker-pool.svg",
      "poiIds": [
        "five-color-pond",
        "jinsha-pudi",
        "zhengyan-chi",
        "welcome-pond"
      ],
      "description": "在五彩池、金沙铺地、争艳彩池、迎宾池任一处到站后，在彩池实验室记录三类发现。",
      "goals": [
        {
          "id": "connected",
          "label": "水路连起来",
          "hint": "让四片池子依次蓄水并出现溢流。"
        },
        {
          "id": "low-water",
          "label": "看见水退下去",
          "hint": "降低来水，观察池底逐渐露出。"
        },
        {
          "id": "rim-grown",
          "label": "池沿留下薄层",
          "hint": "保持含钙来水和逸气条件，让池沿慢慢抬高。"
        }
      ]
    }
  ]
};
