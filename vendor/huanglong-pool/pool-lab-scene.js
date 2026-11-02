window.HuanglongPoolScene=(()=>{
  const M=window.HuanglongPoolModel,W=720,H=700;
  const shapes=[{x:386,y:154,rx:194,ry:91,seed:1.1},{x:211,y:326,rx:167,ry:98,seed:2.3},{x:506,y:379,rx:149,ry:108,seed:4.7},{x:345,y:554,rx:257,ry:121,seed:7.9}];
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Stable, smoothly joined lobes; the same outline is reused for water, rims and comparison.
  function outline(ctx,g,scale=1,offset=0){
    const points=[];
    for(let j=0;j<36;j++){const a=j/36*Math.PI*2,r=1+.08*Math.sin(a*5+g.seed)+.065*Math.sin(a*3-g.seed)+.028*Math.cos(a*9+g.seed);
      points.push([g.x+Math.cos(a)*g.rx*r*scale,g.y+Math.sin(a)*g.ry*r*scale+offset]);}
    ctx.beginPath();const a=points.at(-1),b=points[0];ctx.moveTo((a[0]+b[0])/2,(a[1]+b[1])/2);
    for(let j=0;j<points.length;j++){const p=points[j],q=points[(j+1)%points.length];ctx.quadraticCurveTo(p[0],p[1],(p[0]+q[0])/2,(p[1]+q[1])/2);}ctx.closePath();
  }
  function tree(ctx,x,y,size,opacity){
    ctx.save();ctx.translate(x,y);ctx.globalAlpha=opacity;ctx.strokeStyle='#6f8365';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,4);ctx.lineTo(0,-size);ctx.stroke();
    for(let k=0;k<4;k++){const yy=-size+k*size*.22,w=size*(.15+k*.08);ctx.fillStyle=k%2?'#718a68':'#486c5a';ctx.beginPath();ctx.moveTo(0,yy-size*.16);ctx.lineTo(w,yy+size*.27);ctx.lineTo(-w,yy+size*.23);ctx.closePath();ctx.fill();}ctx.restore();
  }
  function path(ctx,points){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));}
  const streams=[
    {from:-1,points:[403,-20,378,10,413,63,383,99]},
    {from:0,points:[316,207,311,247,231,234,224,287]},
    {from:0,points:[513,190,545,218,481,265,503,307]},
    {from:1,points:[224,394,276,429,217,469,266,500]},
    {from:2,points:[485,453,472,477,501,491,454,521]},
    {from:3,points:[337,641,365,670,319,670,326,722]}
  ];
  function drawStream(ctx,line,amount,t,front=false){
    path(ctx,line.points);ctx.lineCap='round';ctx.strokeStyle=front?'#478f883b':'#b9b894';ctx.lineWidth=front?6:17;ctx.stroke();
    if(amount<.003)return;
    path(ctx,line.points);ctx.strokeStyle='#76beba';ctx.lineWidth=clamp(4+amount*80,4,19);ctx.stroke();
    path(ctx,line.points);ctx.strokeStyle='#e7f6da';ctx.lineWidth=1.7;ctx.setLineDash([5,19]);ctx.lineDashOffset=-t*21;ctx.stroke();ctx.setLineDash([]);
  }
  function pool(ctx,s,i,t,selected){
    const g=shapes[i],p=s.pools[i],d=M.depth(s,i),growth=p.rim-M.POOLS[i].rim;
    const rim=growth*40,drop=12+growth*35,waterScale=clamp(.22+Math.sqrt(d)*.94,.24,.965);
    outline(ctx,g,1.065,drop);ctx.fillStyle='#8c9b73';ctx.shadowColor='#3c5b3925';ctx.shadowBlur=22;ctx.shadowOffsetY=9;ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    outline(ctx,g,1.045,drop*.48);ctx.fillStyle='#c0b282';ctx.fill();
    outline(ctx,g,1.028,3);ctx.fillStyle='#e2d5a5';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#a8a17b';ctx.stroke();
    outline(ctx,g,1,0);ctx.fillStyle='#f1e9c7';ctx.fill();
    const bed=ctx.createRadialGradient(g.x,g.y,6,g.x,g.y,g.rx);bed.addColorStop(0,'#ccd2b2');bed.addColorStop(.65,'#dddab6');bed.addColorStop(1,'#f9efd0');
    outline(ctx,g,.955,1);ctx.fillStyle=bed;ctx.fill();
    // Exposed terraces are the persistent bed, visible again when the water retreats.
    for(let ring=0;ring<5;ring++){outline(ctx,g,.49+ring*.105,3);ctx.strokeStyle=ring%2?'#faf1d4aa':'#b7b99955';ctx.lineWidth=ring%2?2.5:1;ctx.stroke();}
    if(d>.007){
      ctx.save();outline(ctx,g,waterScale,3);ctx.clip();
      const deep=clamp(d/.87,0,1),light=s.inputs.light/100;
      const water=ctx.createRadialGradient(g.x-g.rx*.22,g.y-g.ry*.12,5,g.x,g.y,g.rx*.95);
      water.addColorStop(0,`hsl(${180+deep*9} ${35+light*14}% ${66-deep*34+light*3}%)`);
      water.addColorStop(.5,`hsl(${172+deep*13} ${34+light*10}% ${69-deep*26}%)`);
      water.addColorStop(.85,`hsl(166 32% ${74-deep*12}%)`);water.addColorStop(1,'#c8e0c4');
      ctx.fillStyle=water;ctx.fillRect(g.x-g.rx*1.2,g.y-g.ry*1.2,g.rx*2.4,g.ry*2.4);
      for(let ring=0;ring<4;ring++){outline(ctx,g,waterScale*(.45+ring*.15),3);ctx.strokeStyle=`rgba(200,234,211,${.08+(1-deep)*.14})`;ctx.lineWidth=5-ring;ctx.stroke();}
      // Slow, restrained ripples and moving glints remain inside the actual water footprint.
      ctx.strokeStyle=`rgba(241,252,222,${.13+light*.17})`;ctx.lineWidth=1.4;
      for(let j=0;j<9;j++){const y=g.y-g.ry*.7+j*g.ry*.16+Math.sin(t*.42+j)*2;
        const x=g.x-g.rx*.8+(j%3)*g.rx*.23+Math.sin(t*.3+j)*5;
        ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+20,y+3,x+45,y-5,x+62+(j%3)*14,y-1);ctx.stroke();}
      for(let j=0;j<12;j++){const x=g.x+Math.sin(j*8.19+i)*g.rx*.83,y=g.y+Math.cos(j*3.32+i)*g.ry*.72;
        const a=(Math.sin(t*.8+j*2.8)+1)/2;ctx.fillStyle=`rgba(243,250,223,${a*.35*light})`;ctx.beginPath();ctx.ellipse(x,y,1.8+a*1.7,.65,0,0,7);ctx.fill();}
      ctx.restore();outline(ctx,g,waterScale,3);ctx.strokeStyle='#d9edcfb0';ctx.lineWidth=2;ctx.stroke();
    }
    outline(ctx,g,1,0);ctx.strokeStyle='#fff4d5';ctx.lineWidth=5+rim;ctx.stroke();
    outline(ctx,g,1.029,2);ctx.strokeStyle='#ccb985';ctx.lineWidth=1.4;ctx.stroke();
    if(p.depositRate>.00005){for(let j=0;j<8;j++){const a=j/8*Math.PI*2+t*.03,x=g.x+Math.cos(a)*g.rx,y=g.y+Math.sin(a)*g.ry;
      ctx.globalAlpha=.28+.3*Math.sin(t*1.3+j)**2;ctx.fillStyle='#fffbe4';ctx.beginPath();ctx.arc(x,y,1.4+growth*3,0,7);ctx.fill();}ctx.globalAlpha=1;}
    if(i===selected){outline(ctx,g,1.075,0);ctx.strokeStyle='#315f4f60';ctx.lineWidth=1.2;ctx.setLineDash([4,6]);ctx.stroke();ctx.setLineDash([]);}
  }
  function world(ctx,s,t,selected){
    const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#e3e6d5');bg.addColorStop(.45,'#f2ecd7');bg.addColorStop(1,'#d5deca');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(-90,40+i*69);ctx.bezierCurveTo(180,-35+i*66,426,214+i*44,820,136+i*70);ctx.strokeStyle=i%3?'#a3b99b1d':'#ffffff55';ctx.lineWidth=i%3?1:3;ctx.stroke();}
    const trees=[[57,176,30,.30],[87,197,22,.22],[657,204,37,.35],[688,227,27,.22],[28,470,39,.36],[60,502,29,.25],[643,579,34,.27],[605,656,24,.2],[148,114,26,.22],[566,73,35,.20]];
    trees.forEach(args=>tree(ctx,...args));
    streams.forEach(line=>drawStream(ctx,line,line.from<0?s.inputs.flow*.0018:s.pools[line.from].outflow,t));
    shapes.forEach((g,i)=>pool(ctx,s,i,t,selected));
    // Short surface overflow strokes connect the visible crest to the channel beneath.
    streams.filter(l=>l.from>=0).forEach(l=>{if(s.pools[l.from].outflow>.006){const pts=l.points;ctx.beginPath();ctx.moveTo(pts[0],pts[1]-5);ctx.quadraticCurveTo(pts[0]+6,pts[1]+10,pts[0]+1,pts[1]+18);ctx.strokeStyle='#dff5d9';ctx.lineWidth=3;ctx.stroke();}});
    const glow=ctx.createRadialGradient(590,50,5,590,50,490);glow.addColorStop(0,`rgba(255,246,195,${s.inputs.light*.0015})`);glow.addColorStop(1,'#ffffee00');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
  }
  function mount(canvas){
    let ctx;try{ctx=canvas.getContext('2d');}catch{}if(!ctx)return null;
    const ratio=Math.min(1.5,window.devicePixelRatio||1);canvas.width=W*ratio;canvas.height=H*ratio;
    function draw(s,{selected=3,baseline=null,split=.5}={}){
      ctx.setTransform(ratio,0,0,ratio,0,0);world(ctx,s,s.elapsed,selected);
      if(baseline){ctx.save();ctx.beginPath();ctx.rect(0,0,W*split,H);ctx.clip();world(ctx,baseline,baseline.elapsed,selected);ctx.restore();ctx.beginPath();ctx.moveTo(W*split,0);ctx.lineTo(W*split,H);ctx.strokeStyle='#fff9e8';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.arc(W*split,H*.47,16,0,7);ctx.fillStyle='#fff9e8';ctx.fill();ctx.fillStyle='#3d7164';ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillText('↔',W*split,H*.47+6);}
    }
    return {draw,hit(x,y){let result=-1;for(let i=0;i<shapes.length;i++){const g=shapes[i];if(((x*W-g.x)/g.rx)**2+((y*H-g.y)/g.ry)**2<1.1)result=i;}return result;}};
  }
  function section(s,i){
    const p=s.pools[i],def=M.POOLS[i],bottom=147-p.floor*96,waterY=bottom-M.depth(s,i)*96,rimY=147-p.rim*96,oldRim=147-def.rim*96;
    return `<svg viewBox="0 0 360 178" role="img" aria-label="${esc(def.name)}剖面：水面${p.outflow>.006?'已超过':'接近或低于'}池沿"><defs><linearGradient id="poolSectionWater" x2="0" y2="1"><stop stop-color="#9bd1bc"/><stop offset="1" stop-color="#419596"/></linearGradient></defs><path d="M25 151V${rimY}H59V${bottom}H287V${rimY}H314V158H25Z" fill="#ccb887"/><path d="M25 ${rimY}H59V${bottom}H287V${rimY}H314" fill="none" stroke="#f9edc7" stroke-width="6"/><path d="M62 ${waterY}H284V${bottom}H62Z" fill="url(#poolSectionWater)" opacity=".9"/><path d="M62 ${waterY}H284" stroke="#f3f6dc" stroke-width="2"/><path d="M13 ${oldRim}H70M277 ${oldRim}H327" fill="none" stroke="#7e9878" stroke-dasharray="3 4"/><g fill="#607b6c" font-size="10" font-family="sans-serif"><text x="69" y="${Math.max(15,waterY-8)}">水面</text><text x="311" y="${Math.max(15,rimY-8)}" text-anchor="end">池沿</text><text x="159" y="169">池底 · 累积的薄层</text></g></svg>`;
  }
  return {mount,section};
})();
