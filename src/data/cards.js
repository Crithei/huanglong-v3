/* 内容卡片：首页快捷入口、游玩灵感、服务页三组入口、文创商品、我的页旅行记录。
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
          "body": "在同一片池群中改变来水和沉积相关条件，对照变化、查看剖面、留下观察。",
          "icon": "pool",
          "go": "",
          "cta": "进入实验室",
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
