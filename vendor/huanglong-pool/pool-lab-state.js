/* Qualitative demonstration, not a calibrated hydrological or geochemical model.
 * Water and dissolved material are accounted for; rates compress unrelated timescales. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.HuanglongPoolModel=factory();
})(typeof window==='undefined'?globalThis:window,()=>{
  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  const DEFAULTS={flow:60,calcium:60,exchange:55,light:70};
  const POOLS=[
    {name:'上游池',area:1,rim:.62,floor:.05,water:.42,links:[[1,.58],[2,.42]]},
    {name:'左侧池',area:.72,rim:.57,floor:.06,water:.32,links:[[3,1]]},
    {name:'右侧池',area:.85,rim:.53,floor:.05,water:.36,links:[[3,1]]},
    {name:'下游池',area:1.35,rim:.49,floor:.04,water:.28,links:[]}
  ];
  const POOL_KEYS=['water','calcium','rim','floor','deposited','outflow','depositRate'];
  const LEDGER_KEYS=['waterIn','waterOut','waterLost','calciumIn','calciumOut','calciumLost'];
  function create(){return {version:1,inputs:{...DEFAULTS},elapsed:0,running:false,
    pools:POOLS.map(p=>({water:p.water*p.area,calcium:p.water*p.area*.72,rim:p.rim,floor:p.floor,deposited:0,outflow:0,depositRate:0})),
    ledger:Object.fromEntries(LEDGER_KEYS.map(k=>[k,0]))};}
  function setInput(s,name,value){
    if(!Object.hasOwn(DEFAULTS,name)||!Number.isFinite(value))return false;
    s.inputs[name]=clamp(value,0,100);return true;
  }
  function substep(s,dt){
    const incoming=POOLS.map(()=>({water:0,calcium:0}));
    const source=s.inputs.flow/100*.18*dt,solute=source*s.inputs.calcium/100*1.2;
    incoming[0]={water:source,calcium:solute};
    s.ledger.waterIn+=source;s.ledger.calciumIn+=solute;
    for(let i=0;i<POOLS.length;i++){
      const p=s.pools[i],def=POOLS[i];p.water+=incoming[i].water;p.calcium+=incoming[i].calcium;
      // Precipitate available dissolved material, with a wetness limit; no calcium is created.
      const wet=clamp(p.water/(def.area*.2),0,1);
      const precipitate=Math.min(p.calcium,p.calcium*.025*(s.inputs.exchange/100)*wet*dt);
      p.calcium-=precipitate;p.deposited+=precipitate;p.depositRate=precipitate/dt;
      p.rim=Math.min(def.rim+.32,p.rim+precipitate/def.area*.38);
      p.floor=Math.min(def.floor+.20,p.floor+precipitate/def.area*.085);
      const concentration=p.water>1e-12?p.calcium/p.water:0;
      // Combined seepage loss is explicitly tracked, including its dissolved load.
      const loss=Math.min(p.water,p.water*.012*dt);
      p.water-=loss;p.calcium-=loss*concentration;
      s.ledger.waterLost+=loss;s.ledger.calciumLost+=loss*concentration;
      const excess=Math.max(0,p.water/def.area+p.floor-p.rim);
      const out=Math.min(p.water,1.65*Math.pow(excess,1.4)*dt);
      const carried=Math.min(p.calcium,out*concentration);
      p.water-=out;p.calcium-=carried;p.outflow=out/dt;
      if(def.links.length){for(const [to,fraction] of def.links){incoming[to].water+=out*fraction;incoming[to].calcium+=carried*fraction;}}
      else{s.ledger.waterOut+=out;s.ledger.calciumOut+=carried;}
    }
    s.elapsed+=dt;
  }
  function advance(s,seconds){
    if(!Number.isFinite(seconds)||seconds<=0)return s;
    let remaining=Math.min(5,seconds);
    while(remaining>1e-8){const dt=Math.min(.05,remaining);substep(s,dt);remaining-=dt;}
    return s;
  }
  function tick(s,seconds){if(s.running)advance(s,seconds);return s;}
  const snapshot=s=>JSON.parse(JSON.stringify(s));
  function restore(raw){
    const fresh=create();let v;try{v=typeof raw==='string'?JSON.parse(raw):raw;}catch{return fresh;}
    if(!v||v.version!==1||!Number.isFinite(v.elapsed)||v.elapsed<0||v.elapsed>1e7||!v.inputs||
      !Array.isArray(v.pools)||v.pools.length!==4||!v.ledger)return fresh;
    if(!Object.keys(DEFAULTS).every(k=>Number.isFinite(v.inputs[k])&&v.inputs[k]>=0&&v.inputs[k]<=100))return fresh;
    if(!v.pools.every((p,i)=>p&&POOL_KEYS.every(k=>Number.isFinite(p[k])&&p[k]>=0&&p[k]<1e7)&&
      p.water<POOLS[i].area*2&&p.calcium<10&&p.rim>=POOLS[i].rim&&p.rim<=POOLS[i].rim+.321&&
      p.floor>=POOLS[i].floor&&p.floor<=POOLS[i].floor+.201))return fresh;
    if(!LEDGER_KEYS.every(k=>Number.isFinite(v.ledger[k])&&v.ledger[k]>=0&&v.ledger[k]<1e9))return fresh;
    fresh.elapsed=v.elapsed;
    for(const k of Object.keys(DEFAULTS))fresh.inputs[k]=v.inputs[k];
    fresh.pools=v.pools.map(p=>Object.fromEntries(POOL_KEYS.map(k=>[k,p[k]])));
    for(const k of LEDGER_KEYS)fresh.ledger[k]=v.ledger[k];
    return fresh;
  }
  const depth=(s,i)=>s.pools[i].water/POOLS[i].area;
  function discoveries(s){const found=[];
    if(s.pools.every(p=>p.outflow>.006))found.push('connected');
    if(s.elapsed>10&&s.inputs.flow<=15&&s.pools.reduce((n,p,i)=>n+depth(s,i),0)/4<.23)found.push('low-water');
    if(s.pools.some((p,i)=>p.rim-POOLS[i].rim>=.07))found.push('rim-grown');
    return found;
  }
  function describe(s,index=3){
    const i=clamp(Number.isInteger(index)?index:3,0,3),p=s.pools[i],d=depth(s,i),growth=p.rim-POOLS[i].rim;
    // Follow this pool's current balance, not the upstream control alone. A weak
    // supply can still refill an empty pool; a disconnected lower pool can drain.
    const inflow=i===0?s.inputs.flow/100*.18:POOLS.reduce((n,parent,j)=>n+parent.links.reduce((q,[to,fraction])=>q+(to===i?s.pools[j].outflow*fraction:0),0),0);
    const rate=(inflow-p.outflow-p.water*.012)/POOLS[i].area;
    const trend=rate>.0002?'rising':rate<-.0002?'falling':'steady';
    const trendLabel=trend==='rising'?'水位上升':trend==='falling'?'水位下降':'水位渐稳';
    const precipitating=s.inputs.exchange>0&&p.calcium>1e-9&&p.depositRate>.00005;
    let title,reason,next;
    if(trend==='falling'){
      title=d<.16?'水退下去，原来的池沿还在':'这片池子的水位正在下降';
      reason='此刻流入这片池子的水少于渗漏与流出，水位逐渐回落。上游的补给变化需要经过池群传递，不会让所有池子同时变干。';
      next='保留此刻作对照；恢复来水后，观察哪片池子先重新蓄水。';
    }else if(trend==='rising'&&p.outflow<.006){
      title=d<.16?'水正在回来，池底渐渐被淹没':s.inputs.flow<15?'来水较弱，仍有少量水在蓄积':'先蓄水，再越过池沿';
      reason='此刻流入多于流失，水位在上升；水面还未明显高过池沿，向下一池的溢流较弱。';
      next='继续推演，留意水面何时越过池沿，接上下一片池子。';
    }else if(p.outflow<.006){
      title=d<.16?'浅水露底，池沿仍然保留':'水位渐稳，溢流仍较弱';
      reason='流入与流失接近平衡，水位变化缓慢。已经形成的池沿不会随着来水减少而消失。';
      next='改变来水，看看水位能否重新超过池沿。';
    }else{
      title=growth>.07?'池沿留下薄层，水继续向下游':'水连成一条路，溢流送往下游';
      reason='水面超过池沿后出现溢流，上游的水和剩余溶解物一起传到下游。'+(precipitating?'适宜逸气条件下，部分碳酸钙析出，池沿与池底逐渐累积。':'此刻新薄层增长很弱，已有池沿仍然保留。');
      next='对照起点，比较水面和浅色池沿，再改变一个条件继续观察。';
    }
    if(s.inputs.exchange===0){reason+=' 演示中的CO₂逸散条件已关闭，新的沉积暂停。';}
    else if(p.calcium<1e-9){reason+=' 这片池子缺少可用的溶解钙，暂时不能形成新的沉积。';}
    return {title,reason,next,name:POOLS[i].name,depth:d,growth,outflow:p.outflow,trend,
      water:d<.16?'浅水露底':d<.43?'浅青透底':'青蓝较深',flow:p.outflow>.006?'溢流中 · '+trendLabel:trendLabel,
      mineral:growth>.07?'薄层已累积':precipitating?'薄层正积累':'暂未增长'};
  }
  return {DEFAULTS,POOLS,create,setInput,advance,tick,snapshot,restore,depth,discoveries,describe};
});
