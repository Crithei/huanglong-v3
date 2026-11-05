/* 徽章与贴纸：主题徽章（按六枚主章计数）、实验贴纸与生灵徽章（问导游解锁）。规则和文字沿用 v1 data/passport.js，图在 assets/badges/，生灵徽章图在 assets/species/。
   等号右边必须是合法 JSON，运行 python tools/check.py 校验。 */
HL.data.badges = {
  "source": "v1 data/passport.js 的 themes 与 pool 实验，图来自 v1 assets/passport/（原创 SVG）；生灵徽章图来自项目组 11-5 素材包",
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
  ],
  "species": [
    {
      "id": "giant-panda",
      "name": "大熊猫",
      "latin": "Ailuropoda melanoleuca",
      "en": "Giant Panda",
      "group": "兽类",
      "keywords": [
        "大熊猫",
        "熊猫",
        "滚滚"
      ],
      "img": "assets/species/giant-panda.webp",
      "description": "国家一级重点保护野生动物。黄龙所在的岷山是大熊猫的重要栖息地，它们住在竹林茂密的山林里，一天大半时间都在吃竹子。"
    },
    {
      "id": "red-panda",
      "name": "小熊猫",
      "latin": "Ailurus fulgens",
      "en": "Red Panda",
      "group": "兽类",
      "keywords": [
        "小熊猫"
      ],
      "img": "assets/species/red-panda.webp",
      "description": "国家二级重点保护野生动物。红棕色的毛和一条带环纹的大尾巴，爱在树上休息，也吃竹叶。名字里有熊猫，和大熊猫并不是近亲。"
    },
    {
      "id": "golden-monkey",
      "name": "川金丝猴",
      "latin": "Rhinopithecus roxellana",
      "en": "Golden Snub-nosed Monkey",
      "group": "兽类",
      "keywords": [
        "川金丝猴",
        "金丝猴"
      ],
      "img": "assets/species/golden-monkey.webp",
      "description": "国家一级重点保护野生动物，中国特有。蓝色的脸、金色的长毛，成群生活在高山森林里，冬天也不下到太低的地方。"
    },
    {
      "id": "takin",
      "name": "羚牛",
      "latin": "Budorcas taxicolor",
      "en": "Takin",
      "group": "兽类",
      "keywords": [
        "羚牛",
        "扭角羚"
      ],
      "img": "assets/species/takin.webp",
      "description": "国家一级重点保护野生动物。体形壮实，角向后扭转，常结群在高山林地和草甸间季节性迁移。"
    },
    {
      "id": "golden-pheasant",
      "name": "红腹锦鸡",
      "latin": "Chrysolophus pictus",
      "en": "Golden Pheasant",
      "group": "鸟类",
      "keywords": [
        "红腹锦鸡",
        "锦鸡",
        "金鸡"
      ],
      "img": "assets/species/golden-pheasant.webp",
      "description": "国家二级重点保护野生动物，中国特有。雄鸟金冠红腹、尾羽很长，常在林下灌丛里活动，比起飞更爱走。"
    },
    {
      "id": "chinese-monal",
      "name": "绿尾虹雉",
      "latin": "Lophophorus lhuysii",
      "en": "Chinese Monal",
      "group": "鸟类",
      "keywords": [
        "绿尾虹雉",
        "虹雉"
      ],
      "img": "assets/species/chinese-monal.webp",
      "description": "国家一级重点保护野生动物，中国特有。雄鸟羽色带金属光泽，生活在林线以上的高山草甸和灌丛，是高海拔的代表鸟类。"
    },
    {
      "id": "blue-eared-pheasant",
      "name": "蓝马鸡",
      "latin": "Crossoptilon auritum",
      "en": "Blue Eared Pheasant",
      "group": "鸟类",
      "keywords": [
        "蓝马鸡",
        "马鸡"
      ],
      "img": "assets/species/blue-eared-pheasant.webp",
      "description": "国家二级重点保护野生动物，中国特有。全身蓝灰，脸部红色，耳后有一对白色羽簇，常成群在针叶林和灌丛间觅食。"
    },
    {
      "id": "golden-eagle",
      "name": "金雕",
      "latin": "Aquila chrysaetos",
      "en": "Golden Eagle",
      "group": "鸟类",
      "keywords": [
        "金雕"
      ],
      "img": "assets/species/golden-eagle.webp",
      "description": "国家一级重点保护野生动物。大型猛禽，翼展可超过两米，常在高山开阔地带的上空盘旋。"
    },
    {
      "id": "sichuan-jay",
      "name": "黑头噪鸦",
      "latin": "Perisoreus internigrans",
      "en": "Sichuan Jay",
      "group": "鸟类",
      "keywords": [
        "黑头噪鸦",
        "噪鸦"
      ],
      "img": "assets/species/sichuan-jay.webp",
      "description": "国家一级重点保护野生动物，中国特有。羽色灰暗、不太起眼，只生活在青藏高原东缘的亚高山针叶林里，分布范围很窄。"
    },
    {
      "id": "snowy-cheeked-laughingthrush",
      "name": "黑额山噪鹛",
      "latin": "Ianthocincla sukatschewi",
      "en": "Snowy-cheeked Laughingthrush",
      "group": "鸟类",
      "keywords": [
        "黑额山噪鹛",
        "山噪鹛"
      ],
      "img": "assets/species/snowy-cheeked-laughingthrush.webp",
      "description": "国家一级重点保护野生动物，中国特有。脸颊有白斑，只分布在甘肃南部和四川北部的山地林下，数量稀少。"
    }
  ],
  "speciesRule": "向任意一位数字人导游提问，问题里提到某个物种，就收下这枚生灵徽章。"
};
