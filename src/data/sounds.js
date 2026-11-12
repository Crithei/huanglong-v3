/* 声景手册：沿途要收集的声音（互动页「听见黄龙」的第二本手册，逻辑在 features/soundbank.js）。
   每个目标对应一个景点（station）和一类声音（kind）。游客到了就录一段 recordSeconds 秒的声音，
   录完生成一张「声音标本」贴进声景手册：录音和声纹图只存在手机上，不上传。
   kind 只是这个目标「应该」是什么声音；录完后手机会粗略判断听到的是哪类，游客可以自己改。
   listen 是「听什么」的引导，写的是现场普遍能听到的东西，不保证每次都有。
   等号右边必须是合法 JSON，运行 python tools/check.py 校验。 */
HL.data.sounds = {
  "recordSeconds": 10,
  "kinds": [
    { "id": "water", "name": "水", "label": "水声", "color": "#3aa7ad", "hint": "持续、铺满所有音高的沙沙声" },
    { "id": "wind", "name": "风", "label": "风声", "color": "#7f9a5b", "hint": "低沉、一阵一阵，有起有落" },
    { "id": "bird", "name": "鸟", "label": "鸟鸣", "color": "#c4553a", "hint": "高音、短促，一声一声分得开" },
    { "id": "quiet", "name": "静", "label": "安静", "color": "#2a3b4a", "hint": "几乎没有声音，只剩远处的底噪" },
    { "id": "voice", "name": "人", "label": "人声", "color": "#9a8558", "hint": "说话、脚步，中低音为主" }
  ],
  "targets": [
    {
      "id": "w-fall", "kind": "water", "station": "flying-waterfall",
      "title": "瀑布的轰鸣",
      "listen": "水从一级级钙华坎上落下，声音低沉、连续，像不会停的掌声。",
      "tip": "离观景点近一点，水声会盖住别的一切。"
    },
    {
      "id": "w-cascade", "kind": "water", "station": "liantai-fall",
      "title": "叠瀑的分合",
      "listen": "一股水分成几股，又在下面合拢。仔细听，不同的水流音高不一样。",
      "tip": "左右走几步，声音会变。"
    },
    {
      "id": "w-shoal", "kind": "water", "station": "jinsha-pudi",
      "title": "滩流的细响",
      "listen": "薄薄一层水铺过金色的钙华滩，声音很轻，像细沙在流。",
      "tip": "蹲低一点，手机靠近栈道边缘。"
    },
    {
      "id": "w-overflow", "kind": "water", "station": "welcome-pond",
      "title": "池与池之间",
      "listen": "水从一个彩池越过池沿，溢进下一个，声音细碎，时有时无。",
      "tip": "找两个池子相连的地方。"
    },
    {
      "id": "f-fir", "kind": "wind", "station": "welcome-pond", "place": "声纹栈道 · 冷杉林",
      "title": "冷杉林的风",
      "listen": "风穿过冷杉的针叶，是细密的嘶嘶声，和阔叶树的哗哗声不一样。",
      "tip": "进到栈道的林子里，背对着沟里的水声。"
    },
    {
      "id": "f-temple", "kind": "wind", "station": "huanglong-ancient-temple",
      "title": "古寺旁的风",
      "listen": "开阔处的风一阵一阵。留意风停下来的那几秒，四周会突然安静。",
      "tip": "录的时候用手挡一下麦克风，风噪会小一些。"
    },
    {
      "id": "b-chorus", "kind": "bird", "station": "welcome-pond", "place": "声纹栈道",
      "title": "上午的合唱",
      "listen": "研究团队发现，上午 8 点到 10 点林子里的鸟种最多。停下来，数一数有几种不同的叫声。",
      "tip": "上午来最好；离开水声，进到林子里。"
    },
    {
      "id": "b-stream", "kind": "bird", "station": "bonsai-pond", "place": "盆景池 · 溪边",
      "title": "水声里的鸟",
      "listen": "溪边石头上的鸟叫又尖又短，要从水声里把它挑出来。红尾水鸲和白顶溪鸲都爱待在这样的地方。",
      "tip": "先看石头上有没有鸟在点尾巴。"
    },
    {
      "id": "q-mirror", "kind": "quiet", "station": "mirror-pond",
      "title": "明镜前的安静",
      "listen": "明镜倒映池的水面很平。不说话，听听安静的时候，还剩下哪些声音。",
      "tip": "等身边的人走过去再录。"
    }
  ]
};
