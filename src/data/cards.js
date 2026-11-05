/* 内容卡片：首页快捷入口、游玩灵感、服务页三组入口、文创商品（variants 为款式图，第一张是封面）、我的页旅行记录。
   字段说明见 docs/开发指南.md 的「数据」一节。
   等号右边必须是合法 JSON（双引号、无尾逗号、不写注释），运行 python tools/check.py 校验。 */
HL.data.cards = {
  "quick": [
    {
      "id": "home-guide",
      "kind": "service",
      "title": "游览导览",
      "subtitle": "地图、路线和随行",
      "body": "在同一页查看景点位置、当前停留和沿途设施。",
      "icon": "map",
      "go": "tour",
      "cta": "进入游览",
      "url": "",
      "author": ""
    },
    {
      "id": "home-services",
      "kind": "service",
      "title": "景区服务",
      "subtitle": "出行、讲解与探索",
      "body": "找到游玩需要的服务，也能进入科普视频、专业演示和互动作品。",
      "icon": "grid",
      "go": "services",
      "cta": "查看服务",
      "url": "",
      "author": ""
    },
    {
      "id": "home-passport",
      "kind": "service",
      "title": "山水护照",
      "subtitle": "印章和旅行记录",
      "body": "收下地点印章，回看自己的观察与数字手账。",
      "icon": "stamp",
      "go": "mine",
      "cta": "打开护照",
      "url": "",
      "author": ""
    }
  ],
  "inspire": {
    "id": "home-nature",
    "kind": "guide",
    "title": "跟着一滴水认识黄龙",
    "subtitle": "从山间水源到彩池池沿，用短互动理解彩池怎样长出来。",
    "body": "从水流、溶解、出露到沉积，用短互动理解变化，再到彩池实验室连续观察。",
    "go": "water",
    "cta": "开始一滴水的旅程",
    "url": "",
    "author": ""
  },
  "services": [
    {
      "title": "游玩必备",
      "items": [
        {
          "id": "service-ticket",
          "kind": "service",
          "title": "门票预约",
          "subtitle": "购票与入园信息",
          "body": "整合官方预约入口、入园须知与订单查询入口。",
          "icon": "ticket",
          "go": "",
          "cta": "查看预约入口",
          "url": "",
          "author": ""
        },
        {
          "id": "service-transport",
          "kind": "service",
          "title": "交通与索道",
          "subtitle": "到达 · 接驳 · 索道",
          "body": "查看到达景区的交通方式，以及接驳、索道的乘坐信息。",
          "icon": "bus",
          "go": "",
          "cta": "查看交通信息",
          "url": "",
          "author": ""
        },
        {
          "id": "service-nearby",
          "kind": "service",
          "title": "找设施",
          "subtitle": "厕所 · 休息 · 补给",
          "body": "返回游览地图，查找沿途服务设施。",
          "icon": "pin",
          "go": "facilities",
          "cta": "在游览页查看",
          "url": "",
          "author": ""
        },
        {
          "id": "service-help",
          "kind": "service",
          "title": "咨询与帮助",
          "subtitle": "游客中心 · 联系 · 反馈",
          "body": "集中展示游客中心、景区咨询、问题反馈与求助入口。",
          "icon": "help",
          "go": "",
          "cta": "查看联系方式",
          "url": "",
          "author": ""
        }
      ]
    },
    {
      "title": "听懂黄龙",
      "items": [
        {
          "id": "service-altitude",
          "kind": "service",
          "title": "高原反应服务",
          "subtitle": "高海拔适应 · 不适识别 · 求助指引",
          "body": "行前了解：认识高海拔环境，安排适应时间，按自身情况调整游览节奏。\n游中留意：头痛、恶心、头晕或明显疲乏可能与高海拔有关；出现不适时停止继续上升，休息并向现场工作人员或医务人员求助。\n及时求助：若出现静息时呼吸困难、意识异常或走路不稳，应立即寻求紧急医疗帮助，在安全条件下尽快下降。\n服务内容：可接入高原反应科普、医疗点与供氧点信息，以及景区求助渠道。",
          "icon": "altitude",
          "go": "medical",
          "cta": "查看最近的医疗点",
          "url": "",
          "author": "",
          "featured": true,
          "lead": "头晕、乏力或呼吸不畅时先看这里"
        },
        {
          "id": "service-avatar",
          "kind": "avatar",
          "title": "数字人导游",
          "subtitle": "有问题，和导游聊聊",
          "body": "用数字人承接景点问答、自然讲解与游览建议。可在此接入已有数字人作品。",
          "icon": "guide",
          "go": "guide",
          "cta": "进入数字人作品",
          "url": "",
          "author": ""
        },
        {
          "id": "service-audio",
          "kind": "audio",
          "title": "景点语音讲解",
          "subtitle": "边走边听，认识眼前风景",
          "body": "选择景点或主题播放讲解，支持回到当前游览。",
          "icon": "audio",
          "go": "",
          "cta": "收听讲解",
          "url": "",
          "author": ""
        },
        {
          "id": "service-video",
          "kind": "video",
          "title": "三分钟认识钙华",
          "subtitle": "科普视频 · 水与石的故事",
          "body": "视频内容入口：水如何携带溶解物质，又如何在合适条件下形成沉积。可替换为组员的科普视频页面。",
          "icon": "play",
          "go": "",
          "cta": "打开科普视频",
          "url": "",
          "author": ""
        }
      ]
    },
    {
      "title": "探索与互动",
      "items": [
        {
          "id": "service-demo",
          "kind": "demo",
          "title": "黄龙地貌演示",
          "subtitle": "剖面 · 地形 · 形成过程",
          "body": "展示景区地貌、地下水和钙华沉积的专业演示。可接入独立三维作品、图解或可视化页面。",
          "icon": "layers",
          "go": "",
          "cta": "打开专业演示",
          "url": "",
          "author": ""
        },
        {
          "id": "service-game",
          "kind": "game",
          "title": "一滴水的旅程",
          "subtitle": "四章互动 · 到站解锁",
          "body": "跟着同一滴水走过水流、溶解、出露、沉积四章：到关联景点打卡后解锁，在游览页「一滴水」里玩。也可以替换为组员自己的互动作品（填 url）。",
          "icon": "drop",
          "go": "water",
          "cta": "开始一滴水的旅程",
          "url": "",
          "author": ""
        },
        {
          "id": "service-lab",
          "kind": "demo",
          "title": "彩池演化实验室",
          "subtitle": "改变条件，连续观察池群",
          "body": "在同一片池群里改变来水和沉积条件，连续观察水位、溢流与池沿怎样变化；可以留下观察卡前后对照，也能把此刻的现象问给钙华研学的华屿。到相关景点打卡后，集齐三类发现可收下「池群观察者」贴纸。",
          "icon": "pool",
          "go": "lab",
          "cta": "打开彩池实验室",
          "url": "",
          "author": ""
        },
        {
          "id": "service-ecology",
          "kind": "game",
          "title": "寻找黄龙的自然细节",
          "subtitle": "植物 · 水流 · 景观观察",
          "body": "以现场观察为主题的轻互动入口，可以扩展识别、配对或探索任务。",
          "icon": "leaf",
          "go": "",
          "cta": "开始自然探索",
          "url": "",
          "author": ""
        }
      ]
    }
  ],
  "products": [
    {
      "id": "shop-orchid-frame",
      "kind": "product",
      "title": "兰花镂空书签",
      "subtitle": "金属框里留一枝黄龙兰花",
      "body": "以黄龙的四种野生兰花为题，花和叶用珐琅填色，嵌在细长的金属框里，有金色和银色两种框。\n野生兰花请只看不采，把它们带回家的方式就是这样一枚书签。",
      "go": "",
      "cta": "",
      "url": "",
      "author": "",
      "variants": [
        {
          "label": "盔花兰 · 金框",
          "img": "assets/shop/orchid-galearis-frame.webp"
        },
        {
          "label": "羊耳蒜 · 银框",
          "img": "assets/shop/orchid-liparis-frame.webp"
        },
        {
          "label": "舌喙兰 · 银框",
          "img": "assets/shop/orchid-hemipilia-frame.webp"
        },
        {
          "label": "舌喙兰 · 金框",
          "img": "assets/shop/orchid-hemipilia-frame-gold.webp"
        },
        {
          "label": "鸟巢兰 · 银框",
          "img": "assets/shop/orchid-neottia-frame.webp"
        },
        {
          "label": "鸟巢兰 · 金框",
          "img": "assets/shop/orchid-neottia-frame-gold.webp"
        }
      ]
    },
    {
      "id": "shop-orchid-tassel",
      "kind": "product",
      "title": "兰花流苏书签",
      "subtitle": "花枝书签，链尾坠一朵小花",
      "body": "同一套四种兰花，做成镂空花枝的书签，细链末端挂一朵单独的小花，夹在书页外也看得见。",
      "go": "",
      "cta": "",
      "url": "",
      "author": "",
      "variants": [
        {
          "label": "盔花兰",
          "img": "assets/shop/orchid-galearis-tassel.webp"
        },
        {
          "label": "羊耳蒜",
          "img": "assets/shop/orchid-liparis-tassel.webp"
        },
        {
          "label": "舌喙兰",
          "img": "assets/shop/orchid-hemipilia-tassel.webp"
        },
        {
          "label": "鸟巢兰",
          "img": "assets/shop/orchid-neottia-tassel.webp"
        }
      ]
    },
    {
      "id": "shop-orchid-pin",
      "kind": "product",
      "title": "兰花珐琅徽章",
      "subtitle": "椭圆花框徽章，配一枚花朵胸针",
      "body": "椭圆金边花框里是整株兰花，另配一枚单朵花的小胸针，可以分开别。四种兰花各有一款底色。",
      "go": "",
      "cta": "",
      "url": "",
      "author": "",
      "variants": [
        {
          "label": "盔花兰",
          "img": "assets/shop/orchid-galearis-pin.webp"
        },
        {
          "label": "羊耳蒜",
          "img": "assets/shop/orchid-liparis-pin.webp"
        },
        {
          "label": "舌喙兰",
          "img": "assets/shop/orchid-hemipilia-pin.webp"
        },
        {
          "label": "鸟巢兰",
          "img": "assets/shop/orchid-neottia-pin.webp"
        }
      ]
    },
    {
      "id": "shop-species-badges",
      "kind": "product",
      "title": "黄龙生灵徽章",
      "subtitle": "十种珍稀动物，一套金章",
      "body": "和「我的 · 黄龙生灵」是同一套图案：大熊猫、川金丝猴、绿尾虹雉等十种动物，六边形金章上写着学名和英文名。\n线上的徽章问导游就能收下，这里是可以带走的实物款。",
      "go": "mine",
      "cta": "",
      "url": "",
      "author": "",
      "variants": [
        {
          "label": "大熊猫",
          "img": "assets/species/giant-panda.webp"
        },
        {
          "label": "小熊猫",
          "img": "assets/species/red-panda.webp"
        },
        {
          "label": "川金丝猴",
          "img": "assets/species/golden-monkey.webp"
        },
        {
          "label": "羚牛",
          "img": "assets/species/takin.webp"
        },
        {
          "label": "红腹锦鸡",
          "img": "assets/species/golden-pheasant.webp"
        },
        {
          "label": "绿尾虹雉",
          "img": "assets/species/chinese-monal.webp"
        },
        {
          "label": "蓝马鸡",
          "img": "assets/species/blue-eared-pheasant.webp"
        },
        {
          "label": "金雕",
          "img": "assets/species/golden-eagle.webp"
        },
        {
          "label": "黑头噪鸦",
          "img": "assets/species/sichuan-jay.webp"
        },
        {
          "label": "黑额山噪鹛",
          "img": "assets/species/snowy-cheeked-laughingthrush.webp"
        }
      ],
      "fit": "contain"
    },
    {
      "id": "shop-sticker",
      "kind": "product",
      "title": "黄龙生灵贴纸",
      "subtitle": "林间和高处，两张贴纸页",
      "body": "把黄龙山里的动物画成圆滚滚的贴纸，分「林间」和「高处」两页，可以贴在手账、水杯和行李箱上。",
      "go": "",
      "cta": "",
      "url": "",
      "author": "",
      "variants": [
        {
          "label": "林间",
          "img": "assets/shop/sticker-forest.webp"
        },
        {
          "label": "高处",
          "img": "assets/shop/sticker-alpine.webp"
        }
      ]
    },
    {
      "id": "shop-stamps",
      "kind": "product",
      "title": "生灵邮票贴",
      "subtitle": "黄喉貂、豹猫、小熊猫、川金丝猴",
      "body": "四枚齿孔边的邮票贴纸，画的是黄喉貂、豹猫、小熊猫和川金丝猴，适合贴在明信片和手账上。",
      "go": "",
      "cta": "",
      "url": "",
      "author": "",
      "variants": [
        {
          "label": "四连张",
          "img": "assets/shop/stamps-four.webp"
        }
      ]
    },
    {
      "id": "shop-bird-postcards",
      "kind": "product",
      "title": "山林鸟类明信片",
      "subtitle": "雪线上下的鸟",
      "body": "以黄龙及周边山地的鸟为题的插画明信片：红腹锦鸡、绿尾虹雉、蓝马鸡、金雕、黑颈鹤，另有一张九种小鸟的习作。",
      "go": "",
      "cta": "",
      "url": "",
      "author": "",
      "variants": [
        {
          "label": "红腹锦鸡",
          "img": "assets/shop/ill-golden-pheasant.webp"
        },
        {
          "label": "绿尾虹雉",
          "img": "assets/shop/ill-chinese-monal.webp"
        },
        {
          "label": "蓝马鸡",
          "img": "assets/shop/ill-blue-eared-pheasant.webp"
        },
        {
          "label": "蓝马鸡 · 特写",
          "img": "assets/shop/ill-blue-eared-pheasant-close.webp"
        },
        {
          "label": "金雕",
          "img": "assets/shop/ill-golden-eagle.webp"
        },
        {
          "label": "黑颈鹤",
          "img": "assets/shop/ill-black-necked-crane.webp"
        },
        {
          "label": "九种小鸟",
          "img": "assets/shop/ill-nine-birds.webp"
        }
      ]
    },
    {
      "id": "shop-takin-plush",
      "kind": "product",
      "title": "羚牛发声玩偶",
      "subtitle": "约 20 厘米，捏一下会叫",
      "body": "把高山上的羚牛做成一团毛茸茸的玩偶，高约 20 厘米，捏一下会出声。另有一款皱着眉、背着金色爆炸星的「生气版」。",
      "go": "",
      "cta": "",
      "url": "",
      "author": "",
      "variants": [
        {
          "label": "仰头叫",
          "img": "assets/shop/takin-plush.webp"
        },
        {
          "label": "背面",
          "img": "assets/shop/takin-plush-back.webp"
        },
        {
          "label": "生气版",
          "img": "assets/shop/takin-plush-angry.webp"
        }
      ]
    },
    {
      "id": "shop-pool-magnet",
      "kind": "product",
      "title": "彩池层叠冰箱贴",
      "subtitle": "把一池碧色带回家",
      "body": "以彩池池沿的层次与水色为灵感，展示层叠造型的纪念磁贴。",
      "go": "",
      "cta": "",
      "url": "",
      "author": ""
    },
    {
      "id": "shop-field-notebook",
      "kind": "product",
      "title": "山水观察手账",
      "subtitle": "记录旅途里的自然细节",
      "body": "以黄龙山水与沿途观察为主题的随身手账，预留印章、照片与观察笔记的位置。",
      "go": "",
      "cta": "",
      "url": "",
      "author": ""
    },
    {
      "id": "shop-water-bookmark",
      "kind": "product",
      "title": "一滴水书签",
      "subtitle": "让水的旅程停在书页间",
      "body": "以水滴和水路为主题的书签，将钙华形成的故事藏进日常阅读。",
      "go": "",
      "cta": "",
      "url": "",
      "author": ""
    },
    {
      "id": "shop-mountain-postcard",
      "kind": "product",
      "title": "黄龙风景明信片",
      "subtitle": "寄出山林与彩池的颜色",
      "body": "以山林、瀑布与彩池为主题的风景明信片组，留下一句话与一次旅行的记忆。",
      "go": "",
      "cta": "",
      "url": "",
      "author": ""
    }
  ],
  "mine": [
    {
      "id": "mine-journal",
      "kind": "journal",
      "title": "数字手账",
      "subtitle": "印章、照片与一句观察",
      "body": "把旅程的地点、观察和印章排成自己的页面，编辑并导出留念。",
      "go": "",
      "cta": "翻开数字手账",
      "url": "",
      "author": "",
      "icon": "book",
      "hint": "暂为介绍，功能开发中"
    },
    {
      "id": "mine-gift",
      "kind": "guide",
      "title": "把观察带回家",
      "subtitle": "观察折册 · 层积纪念片",
      "body": "将数字观察与个人折册、池沿层积观察片等实体纪念设计联系起来。",
      "go": "",
      "cta": "看看纪念品构想",
      "url": "",
      "author": "",
      "icon": "leaf",
      "hint": "暂为介绍，功能开发中"
    }
  ]
};
