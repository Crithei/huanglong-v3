(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HuanglongJournal=api;})(typeof window==='undefined'?globalThis:window,()=>{
  const preferences=()=>({hours:6,pace:'平衡',cableCar:false,shortageMinutes:0});
  const CHAPTERS=Object.freeze([
    {id:'flow',label:'水流',title:'顺着山势，找到一条水路',poiIds:['jinsha-pudi','welcome-pond'],icon:'route',reward:'循流者'},
    {id:'dissolution',label:'溶解',title:'走进岩层，带上山的礼物',poiIds:['wash-body-viewpoint'],icon:'gem',reward:'岩层探访者'},
    {id:'emergence',label:'出露',title:'穿过裂隙，重新遇见天空',poiIds:['flying-waterfall','liantai-fall'],icon:'waves',reward:'寻泉者'},
    {id:'deposition',label:'沉积',title:'留下微小的一层，长成彩池',poiIds:['five-color-pond','zhengyan-chi','bonsai-pond'],icon:'layers',reward:'彩池营造者'},
  ].map(c=>Object.freeze({...c,poiIds:Object.freeze(c.poiIds)})));
  // A small match-3 board reveals permanent ground; rocks remain in place.
  const FOREST={cols:5,rows:6,rocks:[4,5,14,20,29],branches:[9,15,24],source:2,outlet:27};
  const near=(a,b)=>Math.abs(a%5-b%5)+Math.abs(Math.floor(a/5)-Math.floor(b/5))===1;
  function forestCreate(){return {tiles:Array.from({length:30},(_,i)=>FOREST.rocks.includes(i)?-1:FOREST.branches.includes(i)?-2:([0,0,1,0,2][i%5]+Math.floor(i/5))%3),open:Array(30).fill(false),wet:[],moves:0,seed:731,runoff:0,lastClear:[],serial:0};}
  function forestMatches(tiles){const set=new Set();for(let i=0;i<30;i++)for(const step of [1,5]){if(tiles[i]<0)continue;const run=[i];for(let j=i+step;j<30&&(step===5||Math.floor(j/5)===Math.floor(i/5))&&tiles[j]===tiles[i];j+=step)run.push(j);if(run.length>=3)run.forEach(j=>set.add(j));}return [...set];}
  function forestInfo(p){const wet=[],queue=p.open?.[2]?[2]:[],seen=new Set(queue);while(queue.length){const i=queue.shift();wet.push(i);for(const n of [i-1,i+1,i+5]){if(n<0||n>=30||!near(i,n)||seen.has(n)||!p.open[n]||p.tiles[n]<0)continue;seen.add(n);queue.push(n);}}return {wet,connected:seen.has(27),depth:wet.length?Math.max(...wet.map(i=>Math.floor(i/5)+1)):0};}
  function forestTrial(p,pair){if(!Array.isArray(pair)||pair.length!==2||!pair.every(i=>Number.isInteger(i)&&i>=0&&i<30)||!near(...pair)||pair.some(i=>p.tiles[i]<0))return null;const tiles=p.tiles.slice(),[a,b]=pair;[tiles[a],tiles[b]]=[tiles[b],tiles[a]];const matches=forestMatches(tiles);if(!matches.includes(a)&&!matches.includes(b))return null;const clear=new Set(matches);for(const i of matches)FOREST.branches.forEach(j=>{if(tiles[j]===-2&&near(i,j))clear.add(j);});const open=p.open.slice();clear.forEach(i=>{open[i]=true;if(tiles[i]===-2)tiles[i]=0;});return {tiles,open,clear:[...clear]};}
  function forestHint(p){let best=null,score=-1;const current=forestInfo(p).wet.length;for(let i=0;i<30;i++)for(const j of [i+1,i+5]){const t=forestTrial(p,[i,j]);if(!t)continue;const info=forestInfo(t),fresh=t.clear.filter(n=>!p.open[n]).length;const value=(info.connected?10000:0)+(info.wet.length-current)*30+fresh*5+t.clear.filter(n=>!p.open[n]&&n%5===2).length*2;if(value>score){score=value;best=[i,j];}}return best;}
  function forestRandom(p){p.seed=(Math.imul(p.seed,1664525)+1013904223)>>>0;return p.seed%3;}
  function forestFill(p,indices){for(const i of indices)p.tiles[i]=-3;for(const i of indices){const start=forestRandom(p);for(let k=0;k<3;k++){p.tiles[i]=(start+k)%3;if(!forestMatches(p.tiles).includes(i))break;}}}
  function forestShuffle(p){for(let attempt=0;attempt<80;attempt++){forestFill(p,p.tiles.map((v,i)=>v>=0?i:-1).filter(i=>i>=0));if(forestHint(p))return true;}return false;}
  function forestSwap(p,pair){const trial=forestTrial(p,pair);if(!trial)return false;p.tiles=trial.tiles;p.open=trial.open;p.lastClear=trial.clear;p.serial++;p.moves++;forestFill(p,trial.clear);p.wet=forestInfo(p).wet;if(!forestHint(p)&&!forestInfo(p).connected)forestShuffle(p);return true;}
  // Ports clockwise: north, east, south, west. Flow may descend or move sideways, never climb.
  const SPRING=Object.freeze({route:[0,1,3,2,4,5],solution:[0,2,1,3,0,1],initial:[1,3,2,0,1,0],types:['bend','bend','bend','bend','bend','straight']});
  const springCreate=()=>({rotations:[...SPRING.initial],moves:0,exposure:0});
  const springPorts=(index,rotation)=> (SPRING.types[index]==='straight'?[0,2]:[0,1]).map(d=>(d+rotation)%4);
  function springInfo(p){
    const rotations=Array.isArray(p.rotations)&&p.rotations.length===6?p.rotations:SPRING.initial;
    const path=[],segments=[];let index=0,entry=0,blocked=0;
    for(let n=0;n<6;n++){
      blocked=index;const ports=springPorts(index,rotations[index]);
      if(!ports.includes(entry))return {path,segments,blocked,connected:false};
      const exit=ports.find(d=>d!==entry);
      path.push(index);segments.push({index,entry,exit});
      if(index===5&&exit===1)return {path,segments,blocked:null,connected:true};
      if(exit===0)return {path,segments,blocked:index,connected:false};
      const next=index+({1:1,2:2,3:-1}[exit]||0);
      if(next<0||next>5||(exit!==2&&Math.floor(next/2)!==Math.floor(index/2))||path.includes(next))return {path,segments,blocked:index,connected:false};
      entry=(exit+2)%4;index=next;
    }
    return {path,segments,blocked,connected:false};
  }
  function springHint(p){if(springInfo(p).connected)return null;for(const index of SPRING.route){const current=springPorts(index,p.rotations[index]).sort().join(),desired=springPorts(index,SPRING.solution[index]).sort().join();if(current!==desired)return {index,turns:(SPRING.solution[index]-p.rotations[index]+4)%4};}return null;}
  const blankChapter=id=>({won:false,earnedAt:null,...({flow:forestCreate(),dissolution:{charged:false,elapsed:0},emergence:springCreate(),deposition:{sequence:0,fraction:0,running:false,travel:1}}[id])});
  const create=()=>({version:5,selected:null,preferences:preferences(),arrived:null,completed:[],stamps:{},gameStep:0,growth:0,waterBadge:false,waterBadgeAt:null,activeChapter:'flow',chapters:Object.fromEntries(CHAPTERS.map(c=>[c.id,blankChapter(c.id)])),chapterBadgeAt:null});
  function checkIn(s,id,allowed){if(!allowed.includes(id)||s.stamps[id])return false;s.stamps[id]=new Date().toISOString();return true;}
  function arrive(s,id,allowed){if(!allowed.includes(id)||s.completed.includes(id)||s.arrived===id)return false;s.arrived=id;checkIn(s,id,allowed);return true;}
  const isChapterUnlocked=(s,id)=>!!CHAPTERS.find(c=>c.id===id)?.poiIds.some(p=>s.stamps[p]);
  const flowConnected=p=>forestInfo(p).connected;
  const solved=(id,p)=>id==='flow'?flowConnected(p)&&p.runoff>=1:id==='dissolution'?p.charged&&p.elapsed>=8:id==='emergence'?springInfo(p).connected&&p.exposure>=6:id==='deposition'?p.sequence===9:false;
  const result=(ok,message='',completed=false,earned=false)=>({ok,message,completed,earned});
  function award(s,id){const p=s.chapters[id],earned=!p.earnedAt;p.won=true;p.earnedAt=p.earnedAt||new Date().toISOString();if(CHAPTERS.every(c=>s.chapters[c.id].earnedAt))s.chapterBadgeAt=s.chapterBadgeAt||new Date().toISOString();return result(true,'收下「'+CHAPTERS.find(c=>c.id===id).reward+'」印记，水的旅程还在继续。',true,earned);}
  function resetChapter(s,id){if(!isChapterUnlocked(s,id))return false;const earnedAt=s.chapters[id].earnedAt;s.chapters[id]={...blankChapter(id),earnedAt};return true;}
  function playChapter(s,id,action,value){
    if(!isChapterUnlocked(s,id))return result(false,'到关联景点打卡后，才能开始本章。');
    const p=s.chapters[id];
    if(action==='finish')return solved(id,p)?award(s,id):result(false,'让眼前的过程继续发生，完成后会自动收下印记。');
    if(id==='flow'&&action==='swap'&&!p.won&&!flowConnected(p)){if(!forestSwap(p,value))return result(false,'交换相邻落叶，横向或纵向连成三个相同形状；岩石与枝条不能交换。');return result(true,flowConnected(p)?'水路贯通了！看水顺坡流下，再从土壤和裂隙渗入地下。':'落叶散开，枝条松动。亮起的水路会保留，继续向下游开路。');}
    if(id==='flow'&&action==='shuffle'&&!p.won&&!flowConnected(p)){forestShuffle(p);p.lastClear=[];return result(true,'微风重新排列了落叶，已打开的地面与水路保留。');}
    if(id==='dissolution'&&action==='charge'&&!p.charged){p.charged=true;return result(true,'水带上了 CO₂。看看石灰岩如何缓慢溶解，溶解物随水迁移。');}
    if(id==='emergence'&&action==='rotateRock'&&Number.isInteger(value)&&value>=0&&value<6&&!p.won){const before=springInfo(p).path.length;p.rotations[value]=(p.rotations[value]+1)%4;p.moves++;const next=springInfo(p);if(!next.connected)p.exposure=0;return result(true,next.connected?'泉路贯通！水流来到地表，观察泉水涌出与 CO₂ 逸散。':next.path.length>before?'裂隙接上了，水滴继续向前！沿蓝色水路找到下一个断点。':next.path.length<before?'水路断开了。水停在琥珀色断点，试着把裂隙重新对齐。':'岩层已转动。让裂隙的开口对准相邻岩层，水才能继续走。');}
    if(id==='deposition'&&action==='start'&&!p.won&&!p.running&&p.sequence<9&&p.sequence%3===0){p.running=true;p.travel=0;return result(true,'水滴先去下一片低处，再让池沿生长、蓄水和溢流。');}
    return result(false,'这一步暂时不能进行。');
  }
  function tickChapter(s,id,seconds){
    if(!Number.isFinite(seconds)||seconds<=0||!isChapterUnlocked(s,id))return {changed:false};
    const dt=Math.min(seconds,.25),p=s.chapters[id];if(p.won)return {changed:false};let changed=false,phaseChanged=false;
    if(id==='flow'&&flowConnected(p)){p.runoff=Math.min(1,p.runoff+dt/4);changed=true;}
    if(id==='dissolution'&&p.charged){p.elapsed=Math.min(8,p.elapsed+dt);changed=true;}
    if(id==='emergence'&&springInfo(p).connected){p.exposure=Math.min(6,p.exposure+dt);changed=true;}
    if(id==='deposition'&&p.running&&p.travel<1){p.travel=Math.min(1,p.travel+dt/.7);if(p.travel>1-1e-9)p.travel=1;return {changed:true,phaseChanged:p.travel===1};}
    if(id==='deposition'&&p.running){p.fraction=Math.min(1,p.fraction+dt/[3,3,2.5][p.sequence%3]);changed=true;if(p.fraction>=1-1e-9){p.sequence++;p.fraction=0;phaseChanged=true;if(p.sequence%3===0)p.running=false;}}
    if(solved(id,p))return {...award(s,id),changed:true,phaseChanged:true};
    return {changed,phaseChanged};
  }
  function depart(s,id){if(s.arrived!==id||s.completed.includes(id))return false;s.completed.push(id);s.arrived=null;return true;}
  function advanceGame(s,expected){if(s.gameStep!==expected||expected<0||expected>=3||(expected===2&&s.growth<1))return false;s.gameStep++;if(s.gameStep===3){s.waterBadge=true;s.waterBadgeAt=s.waterBadgeAt||new Date().toISOString();}return true;}
  function setGrowth(s,value){if(s.gameStep!==2||!Number.isFinite(value))return false;s.growth=Math.min(1,Math.max(0,value));return true;}
  function restartGame(s){s.gameStep=0;s.growth=0;}
  function restore(raw,allowed){
    const s=create();let saved;try{saved=JSON.parse(raw);}catch{return s;}
    if(!saved||Array.isArray(saved)||![1,2,3,4,5].includes(saved.version))return s;
    const ids=value=>Array.isArray(value)?[...new Set(value.filter(id=>allowed.includes(id)))]:[];
    s.selected=Array.isArray(saved.selected)?ids(saved.selected):null;
    s.completed=ids(saved.completed);
    s.arrived=allowed.includes(saved.arrived)&&!s.completed.includes(saved.arrived)?saved.arrived:null;
    for(const id of allowed){const date=saved.stamps?.[id];if(typeof date==='string'&&/^\d{4}-\d\d-\d\dT/.test(date)&&Number.isFinite(Date.parse(date)))s.stamps[id]=date;}
    s.gameStep=Number.isInteger(saved.gameStep)&&saved.gameStep>=0&&saved.gameStep<=3?saved.gameStep:0;
    s.growth=s.gameStep===3?1:Number.isFinite(saved.growth)?Math.max(0,Math.min(1,saved.growth)):0;
    s.waterBadgeAt=typeof saved.waterBadgeAt==='string'&&/^\d{4}-\d\d-\d\dT/.test(saved.waterBadgeAt)&&Number.isFinite(Date.parse(saved.waterBadgeAt))?saved.waterBadgeAt:null;
    s.waterBadge=s.gameStep===3||(saved.waterBadge===true&&s.waterBadgeAt!==null);
    const p=saved.preferences||{};
    if([4.5,6,8].includes(p.hours))s.preferences.hours=p.hours;
    if(['轻松','平衡','深度'].includes(p.pace))s.preferences.pace=p.pace;
    s.preferences.cableCar=p.cableCar===true;
    if(Number.isFinite(p.shortageMinutes)&&p.shortageMinutes>=0&&p.shortageMinutes<=1440)s.preferences.shortageMinutes=p.shortageMinutes;
    if(saved.version>=2){
      const date=v=>typeof v==='string'&&/^\d{4}-\d\d-\d\dT/.test(v)&&Number.isFinite(Date.parse(v))?v:null;
      if(CHAPTERS.some(c=>c.id===saved.activeChapter))s.activeChapter=saved.activeChapter;
      for(const c of CHAPTERS){
        const v=saved.chapters?.[c.id],p=s.chapters[c.id];if(!v||!isChapterUnlocked(s,c.id))continue;
        const clamp=(n,max)=>Number.isFinite(n)?Math.min(max,Math.max(0,n)):0;
        p.earnedAt=date(v.earnedAt);
        if(c.id==='flow'){
          if(saved.version>=4&&Array.isArray(v.tiles)&&v.tiles.length===30&&Array.isArray(v.open)&&v.open.length===30&&v.tiles.every((n,i)=>FOREST.rocks.includes(i)?n===-1:FOREST.branches.includes(i)?[-2,0,1,2].includes(n):[0,1,2].includes(n))&&v.open.every(n=>typeof n==='boolean')){
            p.tiles=v.tiles.slice();p.open=v.open.map((n,i)=>p.tiles[i]>=0&&n);p.moves=Number.isSafeInteger(v.moves)&&v.moves>=0?v.moves:0;p.seed=Number.isInteger(v.seed)?v.seed>>>0:731;p.serial=p.moves;p.lastClear=[];p.wet=forestInfo(p).wet;p.runoff=flowConnected(p)?clamp(v.runoff,1):0;p.won=v.won===true&&!!p.earnedAt&&p.runoff===1;
            if(forestMatches(p.tiles).length||(!forestHint(p)&&!flowConnected(p)))forestShuffle(p);
          }
          continue;
        }
        if(c.id==='emergence'){
          if(saved.version>=5&&Array.isArray(v.rotations)&&v.rotations.length===6&&v.rotations.every(n=>Number.isInteger(n)&&n>=0&&n<4)){
            p.rotations=v.rotations.slice();p.moves=Number.isSafeInteger(v.moves)&&v.moves>=0?v.moves:0;p.exposure=springInfo(p).connected?clamp(v.exposure,6):0;p.won=v.won===true&&!!p.earnedAt&&p.exposure===6;
          }
          continue;
        }
        if(saved.version>=3){
          if(c.id==='dissolution'){p.charged=v.charged===true;p.elapsed=p.charged?clamp(v.elapsed,8):0;}
          if(c.id==='deposition'){p.sequence=Number.isInteger(v.sequence)&&v.sequence>=0&&v.sequence<=9?v.sequence:0;p.fraction=p.sequence<9?clamp(v.fraction,1):0;p.running=p.sequence<9&&(v.running===true||p.sequence%3!==0);p.travel=p.running&&p.sequence%3===0&&p.fraction===0&&Number.isFinite(v.travel)?clamp(v.travel,1):1;}
          p.won=v.won===true&&!!p.earnedAt;
          if(c.id==='deposition'&&p.sequence===9&&!p.earnedAt){p.sequence=0;p.fraction=0;p.running=false;}
        }else if(v.won===true&&p.earnedAt){
          p.won=true;
          if(c.id==='dissolution'){p.charged=true;p.elapsed=8;}
          if(c.id==='deposition')p.sequence=9;
        }
      }
      if(CHAPTERS.every(c=>s.chapters[c.id].earnedAt))s.chapterBadgeAt=date(saved.chapterBadgeAt)||CHAPTERS.map(c=>s.chapters[c.id].earnedAt).sort().at(-1);
    }
    return s;
  }
  return {SPRING,springCreate,springInfo,springHint,springPorts,FOREST,forestCreate,forestInfo,forestHint,forestMatches,create,arrive,depart,advanceGame,setGrowth,restartGame,restore,CHAPTERS,checkIn,isChapterUnlocked,playChapter,resetChapter,tickChapter};
});
