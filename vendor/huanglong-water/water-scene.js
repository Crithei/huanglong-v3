(()=>{var hh=Object.create;var lc=Object.defineProperty;var uh=Object.getOwnPropertyDescriptor;var dh=Object.getOwnPropertyNames;var fh=Object.getPrototypeOf,ph=Object.prototype.hasOwnProperty;var mh=(i,e)=>()=>(e||i((e={exports:{}}).exports,e),e.exports);var gh=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of dh(e))!ph.call(i,s)&&s!==t&&lc(i,s,{get:()=>e[s],enumerable:!(n=uh(e,s))||n.enumerable});return i};var _h=(i,e,t)=>(t=i!=null?hh(fh(i)):{},gh(e||!i||!i.__esModule?lc(t,"default",{value:i,enumerable:!0}):t,i));var Kl=mh((cx,Do)=>{(function(i,e){let t=e();typeof Do=="object"&&Do.exports?Do.exports=t:i.HuanglongJournal=t})(typeof window>"u"?globalThis:window,()=>{let i=()=>({hours:6,pace:"\u5E73\u8861",cableCar:!1,shortageMinutes:0}),e=Object.freeze([{id:"flow",label:"\u6C34\u6D41",title:"\u987A\u7740\u5C71\u52BF\uFF0C\u627E\u5230\u4E00\u6761\u6C34\u8DEF",poiIds:["jinsha-pudi","welcome-pond"],icon:"route",reward:"\u5FAA\u6D41\u8005"},{id:"dissolution",label:"\u6EB6\u89E3",title:"\u8D70\u8FDB\u5CA9\u5C42\uFF0C\u5E26\u4E0A\u5C71\u7684\u793C\u7269",poiIds:["wash-body-viewpoint"],icon:"gem",reward:"\u5CA9\u5C42\u63A2\u8BBF\u8005"},{id:"emergence",label:"\u51FA\u9732",title:"\u7A7F\u8FC7\u88C2\u9699\uFF0C\u91CD\u65B0\u9047\u89C1\u5929\u7A7A",poiIds:["flying-waterfall","liantai-fall"],icon:"waves",reward:"\u5BFB\u6CC9\u8005"},{id:"deposition",label:"\u6C89\u79EF",title:"\u7559\u4E0B\u5FAE\u5C0F\u7684\u4E00\u5C42\uFF0C\u957F\u6210\u5F69\u6C60",poiIds:["five-color-pond","zhengyan-chi","bonsai-pond"],icon:"layers",reward:"\u5F69\u6C60\u8425\u9020\u8005"}].map(U=>Object.freeze({...U,poiIds:Object.freeze(U.poiIds)}))),t={cols:5,rows:6,rocks:[4,5,14,20,29],branches:[9,15,24],source:2,outlet:27},n=(U,y)=>Math.abs(U%5-y%5)+Math.abs(Math.floor(U/5)-Math.floor(y/5))===1;function s(){return{tiles:Array.from({length:30},(U,y)=>t.rocks.includes(y)?-1:t.branches.includes(y)?-2:([0,0,1,0,2][y%5]+Math.floor(y/5))%3),open:Array(30).fill(!1),wet:[],moves:0,seed:731,runoff:0,lastClear:[],serial:0}}function r(U){let y=new Set;for(let R=0;R<30;R++)for(let E of[1,5]){if(U[R]<0)continue;let A=[R];for(let X=R+E;X<30&&(E===5||Math.floor(X/5)===Math.floor(R/5))&&U[X]===U[R];X+=E)A.push(X);A.length>=3&&A.forEach(X=>y.add(X))}return[...y]}function o(U){let y=[],R=U.open?.[2]?[2]:[],E=new Set(R);for(;R.length;){let A=R.shift();y.push(A);for(let X of[A-1,A+1,A+5])X<0||X>=30||!n(A,X)||E.has(X)||!U.open[X]||U.tiles[X]<0||(E.add(X),R.push(X))}return{wet:y,connected:E.has(27),depth:y.length?Math.max(...y.map(A=>Math.floor(A/5)+1)):0}}function a(U,y){if(!Array.isArray(y)||y.length!==2||!y.every(V=>Number.isInteger(V)&&V>=0&&V<30)||!n(...y)||y.some(V=>U.tiles[V]<0))return null;let R=U.tiles.slice(),[E,A]=y;[R[E],R[A]]=[R[A],R[E]];let X=r(R);if(!X.includes(E)&&!X.includes(A))return null;let j=new Set(X);for(let V of X)t.branches.forEach(W=>{R[W]===-2&&n(V,W)&&j.add(W)});let B=U.open.slice();return j.forEach(V=>{B[V]=!0,R[V]===-2&&(R[V]=0)}),{tiles:R,open:B,clear:[...j]}}function l(U){let y=null,R=-1,E=o(U).wet.length;for(let A=0;A<30;A++)for(let X of[A+1,A+5]){let j=a(U,[A,X]);if(!j)continue;let B=o(j),V=j.clear.filter(te=>!U.open[te]).length,W=(B.connected?1e4:0)+(B.wet.length-E)*30+V*5+j.clear.filter(te=>!U.open[te]&&te%5===2).length*2;W>R&&(R=W,y=[A,X])}return y}function c(U){return U.seed=Math.imul(U.seed,1664525)+1013904223>>>0,U.seed%3}function h(U,y){for(let R of y)U.tiles[R]=-3;for(let R of y){let E=c(U);for(let A=0;A<3&&(U.tiles[R]=(E+A)%3,!!r(U.tiles).includes(R));A++);}}function u(U){for(let y=0;y<80;y++)if(h(U,U.tiles.map((R,E)=>R>=0?E:-1).filter(R=>R>=0)),l(U))return!0;return!1}function p(U,y){let R=a(U,y);return R?(U.tiles=R.tiles,U.open=R.open,U.lastClear=R.clear,U.serial++,U.moves++,h(U,R.clear),U.wet=o(U).wet,!l(U)&&!o(U).connected&&u(U),!0):!1}let d=Object.freeze({route:[0,1,3,2,4,5],solution:[0,2,1,3,0,1],initial:[1,3,2,0,1,0],types:["bend","bend","bend","bend","bend","straight"]}),_=()=>({rotations:[...d.initial],moves:0,exposure:0}),v=(U,y)=>(d.types[U]==="straight"?[0,2]:[0,1]).map(R=>(R+y)%4);function m(U){let y=Array.isArray(U.rotations)&&U.rotations.length===6?U.rotations:d.initial,R=[],E=[],A=0,X=0,j=0;for(let B=0;B<6;B++){j=A;let V=v(A,y[A]);if(!V.includes(X))return{path:R,segments:E,blocked:j,connected:!1};let W=V.find(Y=>Y!==X);if(R.push(A),E.push({index:A,entry:X,exit:W}),A===5&&W===1)return{path:R,segments:E,blocked:null,connected:!0};if(W===0)return{path:R,segments:E,blocked:A,connected:!1};let te=A+({1:1,2:2,3:-1}[W]||0);if(te<0||te>5||W!==2&&Math.floor(te/2)!==Math.floor(A/2)||R.includes(te))return{path:R,segments:E,blocked:A,connected:!1};X=(W+2)%4,A=te}return{path:R,segments:E,blocked:j,connected:!1}}function f(U){if(m(U).connected)return null;for(let y of d.route){let R=v(y,U.rotations[y]).sort().join(),E=v(y,d.solution[y]).sort().join();if(R!==E)return{index:y,turns:(d.solution[y]-U.rotations[y]+4)%4}}return null}let I=U=>({won:!1,earnedAt:null,...{flow:s(),dissolution:{charged:!1,elapsed:0},emergence:_(),deposition:{sequence:0,fraction:0,running:!1,travel:1}}[U]}),P=()=>({version:5,selected:null,preferences:i(),arrived:null,completed:[],stamps:{},gameStep:0,growth:0,waterBadge:!1,waterBadgeAt:null,activeChapter:"flow",chapters:Object.fromEntries(e.map(U=>[U.id,I(U.id)])),chapterBadgeAt:null});function M(U,y,R){return!R.includes(y)||U.stamps[y]?!1:(U.stamps[y]=new Date().toISOString(),!0)}function C(U,y,R){return!R.includes(y)||U.completed.includes(y)||U.arrived===y?!1:(U.arrived=y,M(U,y,R),!0)}let b=(U,y)=>!!e.find(R=>R.id===y)?.poiIds.some(R=>U.stamps[R]),D=U=>o(U).connected,w=(U,y)=>U==="flow"?D(y)&&y.runoff>=1:U==="dissolution"?y.charged&&y.elapsed>=8:U==="emergence"?m(y).connected&&y.exposure>=6:U==="deposition"?y.sequence===9:!1,g=(U,y="",R=!1,E=!1)=>({ok:U,message:y,completed:R,earned:E});function x(U,y){let R=U.chapters[y],E=!R.earnedAt;return R.won=!0,R.earnedAt=R.earnedAt||new Date().toISOString(),e.every(A=>U.chapters[A.id].earnedAt)&&(U.chapterBadgeAt=U.chapterBadgeAt||new Date().toISOString()),g(!0,"\u6536\u4E0B\u300C"+e.find(A=>A.id===y).reward+"\u300D\u5370\u8BB0\uFF0C\u6C34\u7684\u65C5\u7A0B\u8FD8\u5728\u7EE7\u7EED\u3002",!0,E)}function N(U,y){if(!b(U,y))return!1;let R=U.chapters[y].earnedAt;return U.chapters[y]={...I(y),earnedAt:R},!0}function O(U,y,R,E){if(!b(U,y))return g(!1,"\u5230\u5173\u8054\u666F\u70B9\u6253\u5361\u540E\uFF0C\u624D\u80FD\u5F00\u59CB\u672C\u7AE0\u3002");let A=U.chapters[y];if(R==="finish")return w(y,A)?x(U,y):g(!1,"\u8BA9\u773C\u524D\u7684\u8FC7\u7A0B\u7EE7\u7EED\u53D1\u751F\uFF0C\u5B8C\u6210\u540E\u4F1A\u81EA\u52A8\u6536\u4E0B\u5370\u8BB0\u3002");if(y==="flow"&&R==="swap"&&!A.won&&!D(A))return p(A,E)?g(!0,D(A)?"\u6C34\u8DEF\u8D2F\u901A\u4E86\uFF01\u770B\u6C34\u987A\u5761\u6D41\u4E0B\uFF0C\u518D\u4ECE\u571F\u58E4\u548C\u88C2\u9699\u6E17\u5165\u5730\u4E0B\u3002":"\u843D\u53F6\u6563\u5F00\uFF0C\u679D\u6761\u677E\u52A8\u3002\u4EAE\u8D77\u7684\u6C34\u8DEF\u4F1A\u4FDD\u7559\uFF0C\u7EE7\u7EED\u5411\u4E0B\u6E38\u5F00\u8DEF\u3002"):g(!1,"\u4EA4\u6362\u76F8\u90BB\u843D\u53F6\uFF0C\u6A2A\u5411\u6216\u7EB5\u5411\u8FDE\u6210\u4E09\u4E2A\u76F8\u540C\u5F62\u72B6\uFF1B\u5CA9\u77F3\u4E0E\u679D\u6761\u4E0D\u80FD\u4EA4\u6362\u3002");if(y==="flow"&&R==="shuffle"&&!A.won&&!D(A))return u(A),A.lastClear=[],g(!0,"\u5FAE\u98CE\u91CD\u65B0\u6392\u5217\u4E86\u843D\u53F6\uFF0C\u5DF2\u6253\u5F00\u7684\u5730\u9762\u4E0E\u6C34\u8DEF\u4FDD\u7559\u3002");if(y==="dissolution"&&R==="charge"&&!A.charged)return A.charged=!0,g(!0,"\u6C34\u5E26\u4E0A\u4E86 CO\u2082\u3002\u770B\u770B\u77F3\u7070\u5CA9\u5982\u4F55\u7F13\u6162\u6EB6\u89E3\uFF0C\u6EB6\u89E3\u7269\u968F\u6C34\u8FC1\u79FB\u3002");if(y==="emergence"&&R==="rotateRock"&&Number.isInteger(E)&&E>=0&&E<6&&!A.won){let X=m(A).path.length;A.rotations[E]=(A.rotations[E]+1)%4,A.moves++;let j=m(A);return j.connected||(A.exposure=0),g(!0,j.connected?"\u6CC9\u8DEF\u8D2F\u901A\uFF01\u6C34\u6D41\u6765\u5230\u5730\u8868\uFF0C\u89C2\u5BDF\u6CC9\u6C34\u6D8C\u51FA\u4E0E CO\u2082 \u9038\u6563\u3002":j.path.length>X?"\u88C2\u9699\u63A5\u4E0A\u4E86\uFF0C\u6C34\u6EF4\u7EE7\u7EED\u5411\u524D\uFF01\u6CBF\u84DD\u8272\u6C34\u8DEF\u627E\u5230\u4E0B\u4E00\u4E2A\u65AD\u70B9\u3002":j.path.length<X?"\u6C34\u8DEF\u65AD\u5F00\u4E86\u3002\u6C34\u505C\u5728\u7425\u73C0\u8272\u65AD\u70B9\uFF0C\u8BD5\u7740\u628A\u88C2\u9699\u91CD\u65B0\u5BF9\u9F50\u3002":"\u5CA9\u5C42\u5DF2\u8F6C\u52A8\u3002\u8BA9\u88C2\u9699\u7684\u5F00\u53E3\u5BF9\u51C6\u76F8\u90BB\u5CA9\u5C42\uFF0C\u6C34\u624D\u80FD\u7EE7\u7EED\u8D70\u3002")}return y==="deposition"&&R==="start"&&!A.won&&!A.running&&A.sequence<9&&A.sequence%3===0?(A.running=!0,A.travel=0,g(!0,"\u6C34\u6EF4\u5148\u53BB\u4E0B\u4E00\u7247\u4F4E\u5904\uFF0C\u518D\u8BA9\u6C60\u6CBF\u751F\u957F\u3001\u84C4\u6C34\u548C\u6EA2\u6D41\u3002")):g(!1,"\u8FD9\u4E00\u6B65\u6682\u65F6\u4E0D\u80FD\u8FDB\u884C\u3002")}function z(U,y,R){if(!Number.isFinite(R)||R<=0||!b(U,y))return{changed:!1};let E=Math.min(R,.25),A=U.chapters[y];if(A.won)return{changed:!1};let X=!1,j=!1;return y==="flow"&&D(A)&&(A.runoff=Math.min(1,A.runoff+E/4),X=!0),y==="dissolution"&&A.charged&&(A.elapsed=Math.min(8,A.elapsed+E),X=!0),y==="emergence"&&m(A).connected&&(A.exposure=Math.min(6,A.exposure+E),X=!0),y==="deposition"&&A.running&&A.travel<1?(A.travel=Math.min(1,A.travel+E/.7),A.travel>1-1e-9&&(A.travel=1),{changed:!0,phaseChanged:A.travel===1}):(y==="deposition"&&A.running&&(A.fraction=Math.min(1,A.fraction+E/[3,3,2.5][A.sequence%3]),X=!0,A.fraction>=1-1e-9&&(A.sequence++,A.fraction=0,j=!0,A.sequence%3===0&&(A.running=!1))),w(y,A)?{...x(U,y),changed:!0,phaseChanged:!0}:{changed:X,phaseChanged:j})}function q(U,y){return U.arrived!==y||U.completed.includes(y)?!1:(U.completed.push(y),U.arrived=null,!0)}function H(U,y){return U.gameStep!==y||y<0||y>=3||y===2&&U.growth<1?!1:(U.gameStep++,U.gameStep===3&&(U.waterBadge=!0,U.waterBadgeAt=U.waterBadgeAt||new Date().toISOString()),!0)}function G(U,y){return U.gameStep!==2||!Number.isFinite(y)?!1:(U.growth=Math.min(1,Math.max(0,y)),!0)}function Q(U){U.gameStep=0,U.growth=0}function Z(U,y){let R=P(),E;try{E=JSON.parse(U)}catch{return R}if(!E||Array.isArray(E)||![1,2,3,4,5].includes(E.version))return R;let A=j=>Array.isArray(j)?[...new Set(j.filter(B=>y.includes(B)))]:[];R.selected=Array.isArray(E.selected)?A(E.selected):null,R.completed=A(E.completed),R.arrived=y.includes(E.arrived)&&!R.completed.includes(E.arrived)?E.arrived:null;for(let j of y){let B=E.stamps?.[j];typeof B=="string"&&/^\d{4}-\d\d-\d\dT/.test(B)&&Number.isFinite(Date.parse(B))&&(R.stamps[j]=B)}R.gameStep=Number.isInteger(E.gameStep)&&E.gameStep>=0&&E.gameStep<=3?E.gameStep:0,R.growth=R.gameStep===3?1:Number.isFinite(E.growth)?Math.max(0,Math.min(1,E.growth)):0,R.waterBadgeAt=typeof E.waterBadgeAt=="string"&&/^\d{4}-\d\d-\d\dT/.test(E.waterBadgeAt)&&Number.isFinite(Date.parse(E.waterBadgeAt))?E.waterBadgeAt:null,R.waterBadge=R.gameStep===3||E.waterBadge===!0&&R.waterBadgeAt!==null;let X=E.preferences||{};if([4.5,6,8].includes(X.hours)&&(R.preferences.hours=X.hours),["\u8F7B\u677E","\u5E73\u8861","\u6DF1\u5EA6"].includes(X.pace)&&(R.preferences.pace=X.pace),R.preferences.cableCar=X.cableCar===!0,Number.isFinite(X.shortageMinutes)&&X.shortageMinutes>=0&&X.shortageMinutes<=1440&&(R.preferences.shortageMinutes=X.shortageMinutes),E.version>=2){let j=B=>typeof B=="string"&&/^\d{4}-\d\d-\d\dT/.test(B)&&Number.isFinite(Date.parse(B))?B:null;e.some(B=>B.id===E.activeChapter)&&(R.activeChapter=E.activeChapter);for(let B of e){let V=E.chapters?.[B.id],W=R.chapters[B.id];if(!V||!b(R,B.id))continue;let te=(Y,oe)=>Number.isFinite(Y)?Math.min(oe,Math.max(0,Y)):0;if(W.earnedAt=j(V.earnedAt),B.id==="flow"){E.version>=4&&Array.isArray(V.tiles)&&V.tiles.length===30&&Array.isArray(V.open)&&V.open.length===30&&V.tiles.every((Y,oe)=>t.rocks.includes(oe)?Y===-1:t.branches.includes(oe)?[-2,0,1,2].includes(Y):[0,1,2].includes(Y))&&V.open.every(Y=>typeof Y=="boolean")&&(W.tiles=V.tiles.slice(),W.open=V.open.map((Y,oe)=>W.tiles[oe]>=0&&Y),W.moves=Number.isSafeInteger(V.moves)&&V.moves>=0?V.moves:0,W.seed=Number.isInteger(V.seed)?V.seed>>>0:731,W.serial=W.moves,W.lastClear=[],W.wet=o(W).wet,W.runoff=D(W)?te(V.runoff,1):0,W.won=V.won===!0&&!!W.earnedAt&&W.runoff===1,(r(W.tiles).length||!l(W)&&!D(W))&&u(W));continue}if(B.id==="emergence"){E.version>=5&&Array.isArray(V.rotations)&&V.rotations.length===6&&V.rotations.every(Y=>Number.isInteger(Y)&&Y>=0&&Y<4)&&(W.rotations=V.rotations.slice(),W.moves=Number.isSafeInteger(V.moves)&&V.moves>=0?V.moves:0,W.exposure=m(W).connected?te(V.exposure,6):0,W.won=V.won===!0&&!!W.earnedAt&&W.exposure===6);continue}E.version>=3?(B.id==="dissolution"&&(W.charged=V.charged===!0,W.elapsed=W.charged?te(V.elapsed,8):0),B.id==="deposition"&&(W.sequence=Number.isInteger(V.sequence)&&V.sequence>=0&&V.sequence<=9?V.sequence:0,W.fraction=W.sequence<9?te(V.fraction,1):0,W.running=W.sequence<9&&(V.running===!0||W.sequence%3!==0),W.travel=W.running&&W.sequence%3===0&&W.fraction===0&&Number.isFinite(V.travel)?te(V.travel,1):1),W.won=V.won===!0&&!!W.earnedAt,B.id==="deposition"&&W.sequence===9&&!W.earnedAt&&(W.sequence=0,W.fraction=0,W.running=!1)):V.won===!0&&W.earnedAt&&(W.won=!0,B.id==="dissolution"&&(W.charged=!0,W.elapsed=8),B.id==="deposition"&&(W.sequence=9))}e.every(B=>R.chapters[B.id].earnedAt)&&(R.chapterBadgeAt=j(E.chapterBadgeAt)||e.map(B=>R.chapters[B.id].earnedAt).sort().at(-1))}return R}return{SPRING:d,springCreate:_,springInfo:m,springHint:f,springPorts:v,FOREST:t,forestCreate:s,forestInfo:o,forestHint:l,forestMatches:r,create:P,arrive:C,depart:q,advanceGame:H,setGrowth:G,restartGame:Q,restore:Z,CHAPTERS:e,checkIn:M,isChapterUnlocked:b,playChapter:O,resetChapter:N,tickChapter:z}})});var Lc=0,ga=1,Uc=2;var _a=1,Lr=2,hn=3,Sn=0,It=1,ft=2,Rn=0,ei=1,xa=2,ya=3,va=4,Nc=5,zn=100,Fc=101,Oc=102,Bc=103,zc=104,Hc=200,kc=201,Vc=202,Gc=203,sr=204,rr=205,Wc=206,Xc=207,qc=208,Yc=209,Zc=210,Jc=211,$c=212,Kc=213,Qc=214,Ur=0,Nr=1,Fr=2,ti=3,Or=4,Br=5,zr=6,Hr=7,Ma=0,jc=1,el=2,Cn=0,tl=1,nl=2,il=3,kr=4,sl=5,rl=6,ol=7;var Sa=300,ci=301,li=302,Vr=303,Gr=304,Rs=306,or=1e3,Bn=1001,ar=1002,Gt=1003,al=1004;var Cs=1005;var Qt=1006,Wr=1007;var Gn=1008;var on=1009,ba=1010,Ea=1011,Hi=1012,Xr=1013,Wn=1014,un=1015,ki=1016,qr=1017,Yr=1018,Vi=1020,wa=35902,Ta=35899,Aa=1021,Ra=1022,qt=1023,Pi=1026,Gi=1027,Ca=1028,Zr=1029,Ia=1030,Jr=1031;var $r=1033,Is=33776,Ps=33777,Ds=33778,Ls=33779,Kr=35840,Qr=35841,jr=35842,eo=35843,to=36196,no=37492,io=37496,so=37808,ro=37809,oo=37810,ao=37811,co=37812,lo=37813,ho=37814,uo=37815,fo=37816,po=37817,mo=37818,go=37819,_o=37820,xo=37821,yo=36492,vo=36494,Mo=36495,So=36283,bo=36284,Eo=36285,wo=36286;var os=2300,cr=2301,ir=2302,aa=2400,ca=2401,la=2402;var cl=3200,ll=3201;var Pa=0,hl=1,In="",Rt="srgb",ni="srgb-linear",as="linear",et="srgb";var jn=7680;var ha=519,ul=512,dl=513,fl=514,Da=515,pl=516,ml=517,gl=518,_l=519,ua=35044;var La="300 es",Kt=2e3,cs=2001;var bn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},St=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],hc=1234567,ns=Math.PI/180,Di=180/Math.PI;function Wi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(St[i&255]+St[i>>8&255]+St[i>>16&255]+St[i>>24&255]+"-"+St[e&255]+St[e>>8&255]+"-"+St[e>>16&15|64]+St[e>>24&255]+"-"+St[t&63|128]+St[t>>8&255]+"-"+St[t>>16&255]+St[t>>24&255]+St[n&255]+St[n>>8&255]+St[n>>16&255]+St[n>>24&255]).toLowerCase()}function Ye(i,e,t){return Math.max(e,Math.min(t,i))}function Ua(i,e){return(i%e+e)%e}function xh(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function yh(i,e,t){return i!==e?(t-i)/(e-i):0}function is(i,e,t){return(1-t)*i+t*e}function vh(i,e,t,n){return is(i,e,1-Math.exp(-t*n))}function Mh(i,e=1){return e-Math.abs(Ua(i,e*2)-e)}function Sh(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function bh(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Eh(i,e){return i+Math.floor(Math.random()*(e-i+1))}function wh(i,e){return i+Math.random()*(e-i)}function Th(i){return i*(.5-Math.random())}function Ah(i){i!==void 0&&(hc=i);let e=hc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Rh(i){return i*ns}function Ch(i){return i*Di}function Ih(i){return(i&i-1)===0&&i!==0}function Ph(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Dh(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Lh(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),p=o((e-n)/2),d=r((n-e)/2),_=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*p,a*c);break;case"YZY":i.set(l*p,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*p,a*h,a*c);break;case"XZX":i.set(a*h,l*_,l*d,a*c);break;case"YXY":i.set(l*d,a*h,l*_,a*c);break;case"ZYZ":i.set(l*_,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ci(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function At(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Ke={DEG2RAD:ns,RAD2DEG:Di,generateUUID:Wi,clamp:Ye,euclideanModulo:Ua,mapLinear:xh,inverseLerp:yh,lerp:is,damp:vh,pingpong:Mh,smoothstep:Sh,smootherstep:bh,randInt:Eh,randFloat:wh,randFloatSpread:Th,seededRandom:Ah,degToRad:Rh,radToDeg:Ch,isPowerOfTwo:Ih,ceilPowerOfTwo:Ph,floorPowerOfTwo:Dh,setQuaternionFromProperEuler:Lh,normalize:At,denormalize:Ci},Me=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ye(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},En=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],p=r[o+0],d=r[o+1],_=r[o+2],v=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=p,e[t+1]=d,e[t+2]=_,e[t+3]=v;return}if(u!==v||l!==p||c!==d||h!==_){let m=1-a,f=l*p+c*d+h*_+u*v,I=f>=0?1:-1,P=1-f*f;if(P>Number.EPSILON){let C=Math.sqrt(P),b=Math.atan2(C,f*I);m=Math.sin(m*b)/C,a=Math.sin(a*b)/C}let M=a*I;if(l=l*m+p*M,c=c*m+d*M,h=h*m+_*M,u=u*m+v*M,m===1-a){let C=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=C,c*=C,h*=C,u*=C}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],p=r[o+1],d=r[o+2],_=r[o+3];return e[t]=a*_+h*u+l*d-c*p,e[t+1]=l*_+h*p+c*u-a*d,e[t+2]=c*_+h*d+a*p-l*u,e[t+3]=h*_-a*u-l*p-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),p=l(n/2),d=l(s/2),_=l(r/2);switch(o){case"XYZ":this._x=p*h*u+c*d*_,this._y=c*d*u-p*h*_,this._z=c*h*_+p*d*u,this._w=c*h*u-p*d*_;break;case"YXZ":this._x=p*h*u+c*d*_,this._y=c*d*u-p*h*_,this._z=c*h*_-p*d*u,this._w=c*h*u+p*d*_;break;case"ZXY":this._x=p*h*u-c*d*_,this._y=c*d*u+p*h*_,this._z=c*h*_+p*d*u,this._w=c*h*u-p*d*_;break;case"ZYX":this._x=p*h*u-c*d*_,this._y=c*d*u+p*h*_,this._z=c*h*_-p*d*u,this._w=c*h*u+p*d*_;break;case"YZX":this._x=p*h*u+c*d*_,this._y=c*d*u+p*h*_,this._z=c*h*_-p*d*u,this._w=c*h*u-p*d*_;break;case"XZY":this._x=p*h*u-c*d*_,this._y=c*d*u-p*h*_,this._z=c*h*_+p*d*u,this._w=c*h*u+p*d*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],p=n+a+u;if(p>0){let d=.5/Math.sqrt(p+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(n>a&&n>u){let d=2*Math.sqrt(1+n-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>u){let d=2*Math.sqrt(1+a-n-u);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+u-n-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ye(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let d=1-t;return this._w=d*o+t*this._w,this._x=d*n+t*this._x,this._y=d*s+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,p=Math.sin(t*h)/c;return this._w=o*u+this._w*p,this._x=n*u+this._x*p,this._y=s*u+this._y*p,this._z=r*u+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},k=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(uc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(uc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Fo.copy(this).projectOnVector(e),this.sub(Fo)}reflect(e){return this.sub(Fo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ye(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Fo=new k,uc=new En,We=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],p=n[2],d=n[5],_=n[8],v=s[0],m=s[3],f=s[6],I=s[1],P=s[4],M=s[7],C=s[2],b=s[5],D=s[8];return r[0]=o*v+a*I+l*C,r[3]=o*m+a*P+l*b,r[6]=o*f+a*M+l*D,r[1]=c*v+h*I+u*C,r[4]=c*m+h*P+u*b,r[7]=c*f+h*M+u*D,r[2]=p*v+d*I+_*C,r[5]=p*m+d*P+_*b,r[8]=p*f+d*M+_*D,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,p=a*l-h*r,d=c*r-o*l,_=t*u+n*p+s*d;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/_;return e[0]=u*v,e[1]=(s*c-h*n)*v,e[2]=(a*n-s*o)*v,e[3]=p*v,e[4]=(h*t-s*l)*v,e[5]=(s*r-a*t)*v,e[6]=d*v,e[7]=(n*l-c*t)*v,e[8]=(o*t-n*r)*v,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Oo.makeScale(e,t)),this}rotate(e){return this.premultiply(Oo.makeRotation(-e)),this}translate(e,t){return this.premultiply(Oo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Oo=new We;function Na(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ls(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function xl(){let i=ls("canvas");return i.style.display="block",i}var dc={};function Li(i){i in dc||(dc[i]=!0,console.warn(i))}function yl(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var fc=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),pc=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Uh(){let i={enabled:!0,workingColorSpace:ni,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===et&&(s.r=Mn(s.r),s.g=Mn(s.g),s.b=Mn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===et&&(s.r=Ii(s.r),s.g=Ii(s.g),s.b=Ii(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===In?as:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Li("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Li("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ni]:{primaries:e,whitePoint:n,transfer:as,toXYZ:fc,fromXYZ:pc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Rt},outputColorSpaceConfig:{drawingBufferColorSpace:Rt}},[Rt]:{primaries:e,whitePoint:n,transfer:et,toXYZ:fc,fromXYZ:pc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Rt}}}),i}var Je=Uh();function Mn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ii(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var _i,lr=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{_i===void 0&&(_i=ls("canvas")),_i.width=e.width,_i.height=e.height;let s=_i.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=_i}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ls("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Mn(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Mn(t[n]/255)*255):t[n]=Mn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Nh=0,Ui=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Nh++}),this.uuid=Wi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Bo(s[o].image)):r.push(Bo(s[o]))}else r=Bo(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Bo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?lr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Fh=0,zo=new k,Ot=class i extends bn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Bn,s=Bn,r=Qt,o=Gn,a=qt,l=on,c=i.DEFAULT_ANISOTROPY,h=In){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fh++}),this.uuid=Wi(),this.name="",this.source=new Ui(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Me(0,0),this.repeat=new Me(1,1),this.center=new Me(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(zo).x}get height(){return this.source.getSize(zo).y}get depth(){return this.source.getSize(zo).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Sa)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case or:e.x=e.x-Math.floor(e.x);break;case Bn:e.x=e.x<0?0:1;break;case ar:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case or:e.y=e.y-Math.floor(e.y);break;case Bn:e.y=e.y<0?0:1;break;case ar:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ot.DEFAULT_IMAGE=null;Ot.DEFAULT_MAPPING=Sa;Ot.DEFAULT_ANISOTROPY=1;var dt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],p=l[1],d=l[5],_=l[9],v=l[2],m=l[6],f=l[10];if(Math.abs(h-p)<.01&&Math.abs(u-v)<.01&&Math.abs(_-m)<.01){if(Math.abs(h+p)<.1&&Math.abs(u+v)<.1&&Math.abs(_+m)<.1&&Math.abs(c+d+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let P=(c+1)/2,M=(d+1)/2,C=(f+1)/2,b=(h+p)/4,D=(u+v)/4,w=(_+m)/4;return P>M&&P>C?P<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(P),s=b/n,r=D/n):M>C?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=b/s,r=w/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=D/r,s=w/r),this.set(n,s,r,t),this}let I=Math.sqrt((m-_)*(m-_)+(u-v)*(u-v)+(p-h)*(p-h));return Math.abs(I)<.001&&(I=1),this.x=(m-_)/I,this.y=(u-v)/I,this.z=(p-h)/I,this.w=Math.acos((c+d+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this.w=Ye(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this.w=Ye(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},hr=class extends bn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new Ot(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Qt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ui(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},cn=class extends hr{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},hs=class extends Ot{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=Bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ur=class extends Ot{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=Bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Hn=class{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Zt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Zt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Zt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Zt):Zt.fromBufferAttribute(r,o),Zt.applyMatrix4(e.matrixWorld),this.expandByPoint(Zt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Bs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Bs.copy(n.boundingBox)),Bs.applyMatrix4(e.matrixWorld),this.union(Bs)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Zt),Zt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Qi),zs.subVectors(this.max,Qi),xi.subVectors(e.a,Qi),yi.subVectors(e.b,Qi),vi.subVectors(e.c,Qi),Pn.subVectors(yi,xi),Dn.subVectors(vi,yi),Jn.subVectors(xi,vi);let t=[0,-Pn.z,Pn.y,0,-Dn.z,Dn.y,0,-Jn.z,Jn.y,Pn.z,0,-Pn.x,Dn.z,0,-Dn.x,Jn.z,0,-Jn.x,-Pn.y,Pn.x,0,-Dn.y,Dn.x,0,-Jn.y,Jn.x,0];return!Ho(t,xi,yi,vi,zs)||(t=[1,0,0,0,1,0,0,0,1],!Ho(t,xi,yi,vi,zs))?!1:(Hs.crossVectors(Pn,Dn),t=[Hs.x,Hs.y,Hs.z],Ho(t,xi,yi,vi,zs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Zt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Zt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},gn=[new k,new k,new k,new k,new k,new k,new k,new k],Zt=new k,Bs=new Hn,xi=new k,yi=new k,vi=new k,Pn=new k,Dn=new k,Jn=new k,Qi=new k,zs=new k,Hs=new k,$n=new k;function Ho(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){$n.fromArray(i,r);let a=s.x*Math.abs($n.x)+s.y*Math.abs($n.y)+s.z*Math.abs($n.z),l=e.dot($n),c=t.dot($n),h=n.dot($n);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Oh=new Hn,ji=new k,ko=new k,Ni=class{constructor(e=new k,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Oh.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ji.subVectors(e,this.center);let t=ji.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ji,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ko.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ji.copy(e.center).add(ko)),this.expandByPoint(ji.copy(e.center).sub(ko))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},_n=new k,Vo=new k,ks=new k,Ln=new k,Go=new k,Vs=new k,Wo=new k,us=class{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_n)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=_n.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(_n.copy(this.origin).addScaledVector(this.direction,t),_n.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Vo.copy(e).add(t).multiplyScalar(.5),ks.copy(t).sub(e).normalize(),Ln.copy(this.origin).sub(Vo);let r=e.distanceTo(t)*.5,o=-this.direction.dot(ks),a=Ln.dot(this.direction),l=-Ln.dot(ks),c=Ln.lengthSq(),h=Math.abs(1-o*o),u,p,d,_;if(h>0)if(u=o*l-a,p=o*a-l,_=r*h,u>=0)if(p>=-_)if(p<=_){let v=1/h;u*=v,p*=v,d=u*(u+o*p+2*a)+p*(o*u+p+2*l)+c}else p=r,u=Math.max(0,-(o*p+a)),d=-u*u+p*(p+2*l)+c;else p=-r,u=Math.max(0,-(o*p+a)),d=-u*u+p*(p+2*l)+c;else p<=-_?(u=Math.max(0,-(-o*r+a)),p=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+p*(p+2*l)+c):p<=_?(u=0,p=Math.min(Math.max(-r,-l),r),d=p*(p+2*l)+c):(u=Math.max(0,-(o*r+a)),p=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+p*(p+2*l)+c);else p=o>0?-r:r,u=Math.max(0,-(o*p+a)),d=-u*u+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Vo).addScaledVector(ks,p),d}intersectSphere(e,t){_n.subVectors(e.center,this.origin);let n=_n.dot(this.direction),s=_n.dot(_n)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,p=this.origin;return c>=0?(n=(e.min.x-p.x)*c,s=(e.max.x-p.x)*c):(n=(e.max.x-p.x)*c,s=(e.min.x-p.x)*c),h>=0?(r=(e.min.y-p.y)*h,o=(e.max.y-p.y)*h):(r=(e.max.y-p.y)*h,o=(e.min.y-p.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-p.z)*u,l=(e.max.z-p.z)*u):(a=(e.max.z-p.z)*u,l=(e.min.z-p.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,_n)!==null}intersectTriangle(e,t,n,s,r){Go.subVectors(t,e),Vs.subVectors(n,e),Wo.crossVectors(Go,Vs);let o=this.direction.dot(Wo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ln.subVectors(this.origin,e);let l=a*this.direction.dot(Vs.crossVectors(Ln,Vs));if(l<0)return null;let c=a*this.direction.dot(Go.cross(Ln));if(c<0||l+c>o)return null;let h=-a*Ln.dot(Wo);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ut=class i{constructor(e,t,n,s,r,o,a,l,c,h,u,p,d,_,v,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,p,d,_,v,m)}set(e,t,n,s,r,o,a,l,c,h,u,p,d,_,v,m){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=p,f[3]=d,f[7]=_,f[11]=v,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Mi.setFromMatrixColumn(e,0).length(),r=1/Mi.setFromMatrixColumn(e,1).length(),o=1/Mi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let p=o*h,d=o*u,_=a*h,v=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+_*c,t[5]=p-v*c,t[9]=-a*l,t[2]=v-p*c,t[6]=_+d*c,t[10]=o*l}else if(e.order==="YXZ"){let p=l*h,d=l*u,_=c*h,v=c*u;t[0]=p+v*a,t[4]=_*a-d,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=d*a-_,t[6]=v+p*a,t[10]=o*l}else if(e.order==="ZXY"){let p=l*h,d=l*u,_=c*h,v=c*u;t[0]=p-v*a,t[4]=-o*u,t[8]=_+d*a,t[1]=d+_*a,t[5]=o*h,t[9]=v-p*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let p=o*h,d=o*u,_=a*h,v=a*u;t[0]=l*h,t[4]=_*c-d,t[8]=p*c+v,t[1]=l*u,t[5]=v*c+p,t[9]=d*c-_,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let p=o*l,d=o*c,_=a*l,v=a*c;t[0]=l*h,t[4]=v-p*u,t[8]=_*u+d,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=d*u+_,t[10]=p-v*u}else if(e.order==="XZY"){let p=o*l,d=o*c,_=a*l,v=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=p*u+v,t[5]=o*h,t[9]=d*u-_,t[2]=_*u-d,t[6]=a*h,t[10]=v*u+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Bh,e,zh)}lookAt(e,t,n){let s=this.elements;return Nt.subVectors(e,t),Nt.lengthSq()===0&&(Nt.z=1),Nt.normalize(),Un.crossVectors(n,Nt),Un.lengthSq()===0&&(Math.abs(n.z)===1?Nt.x+=1e-4:Nt.z+=1e-4,Nt.normalize(),Un.crossVectors(n,Nt)),Un.normalize(),Gs.crossVectors(Nt,Un),s[0]=Un.x,s[4]=Gs.x,s[8]=Nt.x,s[1]=Un.y,s[5]=Gs.y,s[9]=Nt.y,s[2]=Un.z,s[6]=Gs.z,s[10]=Nt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],p=n[9],d=n[13],_=n[2],v=n[6],m=n[10],f=n[14],I=n[3],P=n[7],M=n[11],C=n[15],b=s[0],D=s[4],w=s[8],g=s[12],x=s[1],N=s[5],O=s[9],z=s[13],q=s[2],H=s[6],G=s[10],Q=s[14],Z=s[3],U=s[7],y=s[11],R=s[15];return r[0]=o*b+a*x+l*q+c*Z,r[4]=o*D+a*N+l*H+c*U,r[8]=o*w+a*O+l*G+c*y,r[12]=o*g+a*z+l*Q+c*R,r[1]=h*b+u*x+p*q+d*Z,r[5]=h*D+u*N+p*H+d*U,r[9]=h*w+u*O+p*G+d*y,r[13]=h*g+u*z+p*Q+d*R,r[2]=_*b+v*x+m*q+f*Z,r[6]=_*D+v*N+m*H+f*U,r[10]=_*w+v*O+m*G+f*y,r[14]=_*g+v*z+m*Q+f*R,r[3]=I*b+P*x+M*q+C*Z,r[7]=I*D+P*N+M*H+C*U,r[11]=I*w+P*O+M*G+C*y,r[15]=I*g+P*z+M*Q+C*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],p=e[10],d=e[14],_=e[3],v=e[7],m=e[11],f=e[15];return _*(+r*l*u-s*c*u-r*a*p+n*c*p+s*a*d-n*l*d)+v*(+t*l*d-t*c*p+r*o*p-s*o*d+s*c*h-r*l*h)+m*(+t*c*u-t*a*d-r*o*u+n*o*d+r*a*h-n*c*h)+f*(-s*a*h-t*l*u+t*a*p+s*o*u-n*o*p+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],p=e[10],d=e[11],_=e[12],v=e[13],m=e[14],f=e[15],I=u*m*c-v*p*c+v*l*d-a*m*d-u*l*f+a*p*f,P=_*p*c-h*m*c-_*l*d+o*m*d+h*l*f-o*p*f,M=h*v*c-_*u*c+_*a*d-o*v*d-h*a*f+o*u*f,C=_*u*l-h*v*l-_*a*p+o*v*p+h*a*m-o*u*m,b=t*I+n*P+s*M+r*C;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let D=1/b;return e[0]=I*D,e[1]=(v*p*r-u*m*r-v*s*d+n*m*d+u*s*f-n*p*f)*D,e[2]=(a*m*r-v*l*r+v*s*c-n*m*c-a*s*f+n*l*f)*D,e[3]=(u*l*r-a*p*r-u*s*c+n*p*c+a*s*d-n*l*d)*D,e[4]=P*D,e[5]=(h*m*r-_*p*r+_*s*d-t*m*d-h*s*f+t*p*f)*D,e[6]=(_*l*r-o*m*r-_*s*c+t*m*c+o*s*f-t*l*f)*D,e[7]=(o*p*r-h*l*r+h*s*c-t*p*c-o*s*d+t*l*d)*D,e[8]=M*D,e[9]=(_*u*r-h*v*r-_*n*d+t*v*d+h*n*f-t*u*f)*D,e[10]=(o*v*r-_*a*r+_*n*c-t*v*c-o*n*f+t*a*f)*D,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*d-t*a*d)*D,e[12]=C*D,e[13]=(h*v*s-_*u*s+_*n*p-t*v*p-h*n*m+t*u*m)*D,e[14]=(_*a*s-o*v*s-_*n*l+t*v*l+o*n*m-t*a*m)*D,e[15]=(o*u*s-h*a*s+h*n*l-t*u*l-o*n*p+t*a*p)*D,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,p=r*c,d=r*h,_=r*u,v=o*h,m=o*u,f=a*u,I=l*c,P=l*h,M=l*u,C=n.x,b=n.y,D=n.z;return s[0]=(1-(v+f))*C,s[1]=(d+M)*C,s[2]=(_-P)*C,s[3]=0,s[4]=(d-M)*b,s[5]=(1-(p+f))*b,s[6]=(m+I)*b,s[7]=0,s[8]=(_+P)*D,s[9]=(m-I)*D,s[10]=(1-(p+v))*D,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Mi.set(s[0],s[1],s[2]).length(),o=Mi.set(s[4],s[5],s[6]).length(),a=Mi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Jt.copy(this);let c=1/r,h=1/o,u=1/a;return Jt.elements[0]*=c,Jt.elements[1]*=c,Jt.elements[2]*=c,Jt.elements[4]*=h,Jt.elements[5]*=h,Jt.elements[6]*=h,Jt.elements[8]*=u,Jt.elements[9]*=u,Jt.elements[10]*=u,t.setFromRotationMatrix(Jt),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Kt,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),p=(t+e)/(t-e),d=(n+s)/(n-s),_,v;if(l)_=r/(o-r),v=o*r/(o-r);else if(a===Kt)_=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===cs)_=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Kt,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),p=-(t+e)/(t-e),d=-(n+s)/(n-s),_,v;if(l)_=1/(o-r),v=o/(o-r);else if(a===Kt)_=-2/(o-r),v=-(o+r)/(o-r);else if(a===cs)_=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=p,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=_,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Mi=new k,Jt=new ut,Bh=new k(0,0,0),zh=new k(1,1,1),Un=new k,Gs=new k,Nt=new k,mc=new ut,gc=new En,jt=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],p=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(Ye(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ye(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ye(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return mc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(mc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return gc.setFromEuler(this),this.setFromQuaternion(gc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};jt.DEFAULT_ORDER="XYZ";var Fi=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Hh=0,_c=new k,Si=new En,xn=new ut,Ws=new k,es=new k,kh=new k,Vh=new En,xc=new k(1,0,0),yc=new k(0,1,0),vc=new k(0,0,1),Mc={type:"added"},Gh={type:"removed"},bi={type:"childadded",child:null},Xo={type:"childremoved",child:null},Mt=class i extends bn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hh++}),this.uuid=Wi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new k,t=new jt,n=new En,s=new k(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ut},normalMatrix:{value:new We}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Fi,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.multiply(Si),this}rotateOnWorldAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.premultiply(Si),this}rotateX(e){return this.rotateOnAxis(xc,e)}rotateY(e){return this.rotateOnAxis(yc,e)}rotateZ(e){return this.rotateOnAxis(vc,e)}translateOnAxis(e,t){return _c.copy(e).applyQuaternion(this.quaternion),this.position.add(_c.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(xc,e)}translateY(e){return this.translateOnAxis(yc,e)}translateZ(e){return this.translateOnAxis(vc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ws.copy(e):Ws.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),es.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(es,Ws,this.up):xn.lookAt(Ws,es,this.up),this.quaternion.setFromRotationMatrix(xn),s&&(xn.extractRotation(s.matrixWorld),Si.setFromRotationMatrix(xn),this.quaternion.premultiply(Si.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Mc),bi.child=e,this.dispatchEvent(bi),bi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Gh),Xo.child=e,this.dispatchEvent(Xo),Xo.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(xn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Mc),bi.child=e,this.dispatchEvent(bi),bi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(es,e,kh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(es,Vh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),p=o(e.skeletons),d=o(e.animations),_=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),p.length>0&&(n.skeletons=p),d.length>0&&(n.animations=d),_.length>0&&(n.nodes=_)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Mt.DEFAULT_UP=new k(0,1,0);Mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var $t=new k,yn=new k,qo=new k,vn=new k,Ei=new k,wi=new k,Sc=new k,Yo=new k,Zo=new k,Jo=new k,$o=new dt,Ko=new dt,Qo=new dt,On=class i{constructor(e=new k,t=new k,n=new k){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),$t.subVectors(e,t),s.cross($t);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){$t.subVectors(s,t),yn.subVectors(n,t),qo.subVectors(e,t);let o=$t.dot($t),a=$t.dot(yn),l=$t.dot(qo),c=yn.dot(yn),h=yn.dot(qo),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let p=1/u,d=(c*l-a*h)*p,_=(o*h-a*l)*p;return r.set(1-d-_,_,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,vn)===null?!1:vn.x>=0&&vn.y>=0&&vn.x+vn.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,vn.x),l.addScaledVector(o,vn.y),l.addScaledVector(a,vn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return $o.setScalar(0),Ko.setScalar(0),Qo.setScalar(0),$o.fromBufferAttribute(e,t),Ko.fromBufferAttribute(e,n),Qo.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector($o,r.x),o.addScaledVector(Ko,r.y),o.addScaledVector(Qo,r.z),o}static isFrontFacing(e,t,n,s){return $t.subVectors(n,t),yn.subVectors(e,t),$t.cross(yn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $t.subVectors(this.c,this.b),yn.subVectors(this.a,this.b),$t.cross(yn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Ei.subVectors(s,n),wi.subVectors(r,n),Yo.subVectors(e,n);let l=Ei.dot(Yo),c=wi.dot(Yo);if(l<=0&&c<=0)return t.copy(n);Zo.subVectors(e,s);let h=Ei.dot(Zo),u=wi.dot(Zo);if(h>=0&&u<=h)return t.copy(s);let p=l*u-h*c;if(p<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(Ei,o);Jo.subVectors(e,r);let d=Ei.dot(Jo),_=wi.dot(Jo);if(_>=0&&d<=_)return t.copy(r);let v=d*c-l*_;if(v<=0&&c>=0&&_<=0)return a=c/(c-_),t.copy(n).addScaledVector(wi,a);let m=h*_-d*u;if(m<=0&&u-h>=0&&d-_>=0)return Sc.subVectors(r,s),a=(u-h)/(u-h+(d-_)),t.copy(s).addScaledVector(Sc,a);let f=1/(m+v+p);return o=v*f,a=p*f,t.copy(n).addScaledVector(Ei,o).addScaledVector(wi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},vl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Nn={h:0,s:0,l:0},Xs={h:0,s:0,l:0};function jo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Oe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Rt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Je.workingColorSpace){return this.r=e,this.g=t,this.b=n,Je.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Je.workingColorSpace){if(e=Ua(e,1),t=Ye(t,0,1),n=Ye(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=jo(o,r,e+1/3),this.g=jo(o,r,e),this.b=jo(o,r,e-1/3)}return Je.colorSpaceToWorking(this,s),this}setStyle(e,t=Rt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Rt){let n=vl[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Mn(e.r),this.g=Mn(e.g),this.b=Mn(e.b),this}copyLinearToSRGB(e){return this.r=Ii(e.r),this.g=Ii(e.g),this.b=Ii(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Rt){return Je.workingToColorSpace(bt.copy(this),e),Math.round(Ye(bt.r*255,0,255))*65536+Math.round(Ye(bt.g*255,0,255))*256+Math.round(Ye(bt.b*255,0,255))}getHexString(e=Rt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.workingToColorSpace(bt.copy(this),t);let n=bt.r,s=bt.g,r=bt.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Je.workingColorSpace){return Je.workingToColorSpace(bt.copy(this),t),e.r=bt.r,e.g=bt.g,e.b=bt.b,e}getStyle(e=Rt){Je.workingToColorSpace(bt.copy(this),e);let t=bt.r,n=bt.g,s=bt.b;return e!==Rt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Nn),this.setHSL(Nn.h+e,Nn.s+t,Nn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Nn),e.getHSL(Xs);let n=is(Nn.h,Xs.h,t),s=is(Nn.s,Xs.s,t),r=is(Nn.l,Xs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},bt=new Oe;Oe.NAMES=vl;var Wh=0,wn=class extends bn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wh++}),this.uuid=Wi(),this.name="",this.type="Material",this.blending=ei,this.side=Sn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sr,this.blendDst=rr,this.blendEquation=zn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Oe(0,0,0),this.blendAlpha=0,this.depthFunc=ti,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ha,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jn,this.stencilZFail=jn,this.stencilZPass=jn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ei&&(n.blending=this.blending),this.side!==Sn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==sr&&(n.blendSrc=this.blendSrc),this.blendDst!==rr&&(n.blendDst=this.blendDst),this.blendEquation!==zn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ti&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ha&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==jn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==jn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==jn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},ln=class extends wn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new jt,this.combine=Ma,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var _t=new k,qs=new Me,Xh=0,Ct=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Xh++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ua,this.updateRanges=[],this.gpuType=un,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)qs.fromBufferAttribute(this,t),qs.applyMatrix3(e),this.setXY(t,qs.x,qs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix3(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix4(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyNormalMatrix(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.transformDirection(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ci(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=At(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ci(t,this.array)),t}setX(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ci(t,this.array)),t}setY(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ci(t,this.array)),t}setZ(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ci(t,this.array)),t}setW(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),n=At(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),n=At(n,this.array),s=At(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),n=At(n,this.array),s=At(s,this.array),r=At(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ua&&(e.usage=this.usage),e}};var ds=class extends Ct{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var fs=class extends Ct{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Ve=class extends Ct{constructor(e,t,n){super(new Float32Array(e),t,n)}},qh=0,kt=new ut,ea=new Mt,Ti=new k,Ft=new Hn,ts=new Hn,vt=new k,st=class i extends bn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qh++}),this.uuid=Wi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Na(e)?fs:ds)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new We().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return kt.makeRotationFromQuaternion(e),this.applyMatrix4(kt),this}rotateX(e){return kt.makeRotationX(e),this.applyMatrix4(kt),this}rotateY(e){return kt.makeRotationY(e),this.applyMatrix4(kt),this}rotateZ(e){return kt.makeRotationZ(e),this.applyMatrix4(kt),this}translate(e,t,n){return kt.makeTranslation(e,t,n),this.applyMatrix4(kt),this}scale(e,t,n){return kt.makeScale(e,t,n),this.applyMatrix4(kt),this}lookAt(e){return ea.lookAt(e),ea.updateMatrix(),this.applyMatrix4(ea.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ti).negate(),this.translate(Ti.x,Ti.y,Ti.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ve(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Hn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Ft.setFromBufferAttribute(r),this.morphTargetsRelative?(vt.addVectors(this.boundingBox.min,Ft.min),this.boundingBox.expandByPoint(vt),vt.addVectors(this.boundingBox.max,Ft.max),this.boundingBox.expandByPoint(vt)):(this.boundingBox.expandByPoint(Ft.min),this.boundingBox.expandByPoint(Ft.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ni);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(e){let n=this.boundingSphere.center;if(Ft.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];ts.setFromBufferAttribute(a),this.morphTargetsRelative?(vt.addVectors(Ft.min,ts.min),Ft.expandByPoint(vt),vt.addVectors(Ft.max,ts.max),Ft.expandByPoint(vt)):(Ft.expandByPoint(ts.min),Ft.expandByPoint(ts.max))}Ft.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)vt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(vt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)vt.fromBufferAttribute(a,c),l&&(Ti.fromBufferAttribute(e,c),vt.add(Ti)),s=Math.max(s,n.distanceToSquared(vt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ct(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let w=0;w<n.count;w++)a[w]=new k,l[w]=new k;let c=new k,h=new k,u=new k,p=new Me,d=new Me,_=new Me,v=new k,m=new k;function f(w,g,x){c.fromBufferAttribute(n,w),h.fromBufferAttribute(n,g),u.fromBufferAttribute(n,x),p.fromBufferAttribute(r,w),d.fromBufferAttribute(r,g),_.fromBufferAttribute(r,x),h.sub(c),u.sub(c),d.sub(p),_.sub(p);let N=1/(d.x*_.y-_.x*d.y);isFinite(N)&&(v.copy(h).multiplyScalar(_.y).addScaledVector(u,-d.y).multiplyScalar(N),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-_.x).multiplyScalar(N),a[w].add(v),a[g].add(v),a[x].add(v),l[w].add(m),l[g].add(m),l[x].add(m))}let I=this.groups;I.length===0&&(I=[{start:0,count:e.count}]);for(let w=0,g=I.length;w<g;++w){let x=I[w],N=x.start,O=x.count;for(let z=N,q=N+O;z<q;z+=3)f(e.getX(z+0),e.getX(z+1),e.getX(z+2))}let P=new k,M=new k,C=new k,b=new k;function D(w){C.fromBufferAttribute(s,w),b.copy(C);let g=a[w];P.copy(g),P.sub(C.multiplyScalar(C.dot(g))).normalize(),M.crossVectors(b,g);let N=M.dot(l[w])<0?-1:1;o.setXYZW(w,P.x,P.y,P.z,N)}for(let w=0,g=I.length;w<g;++w){let x=I[w],N=x.start,O=x.count;for(let z=N,q=N+O;z<q;z+=3)D(e.getX(z+0)),D(e.getX(z+1)),D(e.getX(z+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ct(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let p=0,d=n.count;p<d;p++)n.setXYZ(p,0,0,0);let s=new k,r=new k,o=new k,a=new k,l=new k,c=new k,h=new k,u=new k;if(e)for(let p=0,d=e.count;p<d;p+=3){let _=e.getX(p+0),v=e.getX(p+1),m=e.getX(p+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,_),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let p=0,d=t.count;p<d;p+=3)s.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),o.fromBufferAttribute(t,p+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)vt.fromBufferAttribute(e,t),vt.normalize(),e.setXYZ(t,vt.x,vt.y,vt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,p=new c.constructor(l.length*h),d=0,_=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?d=l[v]*a.data.stride+a.offset:d=l[v]*h;for(let f=0;f<h;f++)p[_++]=c[d++]}return new Ct(p,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let p=c[h],d=e(p,n);l.push(d)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,p=c.length;u<p;u++){let d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let p=0,d=u.length;p<d;p++)h.push(u[p].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},bc=new ut,Kn=new us,Ys=new Ni,Ec=new k,Zs=new k,Js=new k,$s=new k,ta=new k,Ks=new k,wc=new k,Qs=new k,mt=class extends Mt{constructor(e=new st,t=new ln){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Ks.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(ta.fromBufferAttribute(u,e),o?Ks.addScaledVector(ta,h):Ks.addScaledVector(ta.sub(t),h))}t.add(Ks)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ys.copy(n.boundingSphere),Ys.applyMatrix4(r),Kn.copy(e.ray).recast(e.near),!(Ys.containsPoint(Kn.origin)===!1&&(Kn.intersectSphere(Ys,Ec)===null||Kn.origin.distanceToSquared(Ec)>(e.far-e.near)**2))&&(bc.copy(r).invert(),Kn.copy(e.ray).applyMatrix4(bc),!(n.boundingBox!==null&&Kn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Kn)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,p=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,v=p.length;_<v;_++){let m=p[_],f=o[m.materialIndex],I=Math.max(m.start,d.start),P=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let M=I,C=P;M<C;M+=3){let b=a.getX(M),D=a.getX(M+1),w=a.getX(M+2);s=js(this,f,e,n,c,h,u,b,D,w),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let _=Math.max(0,d.start),v=Math.min(a.count,d.start+d.count);for(let m=_,f=v;m<f;m+=3){let I=a.getX(m),P=a.getX(m+1),M=a.getX(m+2);s=js(this,o,e,n,c,h,u,I,P,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,v=p.length;_<v;_++){let m=p[_],f=o[m.materialIndex],I=Math.max(m.start,d.start),P=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let M=I,C=P;M<C;M+=3){let b=M,D=M+1,w=M+2;s=js(this,f,e,n,c,h,u,b,D,w),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let _=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let m=_,f=v;m<f;m+=3){let I=m,P=m+1,M=m+2;s=js(this,o,e,n,c,h,u,I,P,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Yh(i,e,t,n,s,r,o,a){let l;if(e.side===It?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Sn,a),l===null)return null;Qs.copy(a),Qs.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Qs);return c<t.near||c>t.far?null:{distance:c,point:Qs.clone(),object:i}}function js(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Zs),i.getVertexPosition(l,Js),i.getVertexPosition(c,$s);let h=Yh(i,e,t,n,Zs,Js,$s,wc);if(h){let u=new k;On.getBarycoord(wc,Zs,Js,$s,u),s&&(h.uv=On.getInterpolatedAttribute(s,a,l,c,u,new Me)),r&&(h.uv1=On.getInterpolatedAttribute(r,a,l,c,u,new Me)),o&&(h.normal=On.getInterpolatedAttribute(o,a,l,c,u,new k),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let p={a,b:l,c,normal:new k,materialIndex:0};On.getNormal(Zs,Js,$s,p.normal),h.face=p,h.barycoord=u}return h}var en=class i extends st{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],p=0,d=0;_("z","y","x",-1,-1,n,t,e,o,r,0),_("z","y","x",1,-1,n,t,-e,o,r,1),_("x","z","y",1,1,e,n,t,s,o,2),_("x","z","y",1,-1,e,n,-t,s,o,3),_("x","y","z",1,-1,e,t,n,s,r,4),_("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Ve(c,3)),this.setAttribute("normal",new Ve(h,3)),this.setAttribute("uv",new Ve(u,2));function _(v,m,f,I,P,M,C,b,D,w,g){let x=M/D,N=C/w,O=M/2,z=C/2,q=b/2,H=D+1,G=w+1,Q=0,Z=0,U=new k;for(let y=0;y<G;y++){let R=y*N-z;for(let E=0;E<H;E++){let A=E*x-O;U[v]=A*I,U[m]=R*P,U[f]=q,c.push(U.x,U.y,U.z),U[v]=0,U[m]=0,U[f]=b>0?1:-1,h.push(U.x,U.y,U.z),u.push(E/D),u.push(1-y/w),Q+=1}}for(let y=0;y<w;y++)for(let R=0;R<D;R++){let E=p+R+H*y,A=p+R+H*(y+1),X=p+(R+1)+H*(y+1),j=p+(R+1)+H*y;l.push(E,A,j),l.push(A,X,j),Z+=6}a.addGroup(d,Z,g),d+=Z,p+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function hi(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function wt(i){let e={};for(let t=0;t<i.length;t++){let n=hi(i[t]);for(let s in n)e[s]=n[s]}return e}function Zh(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Fa(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var Ml={clone:hi,merge:wt},Jh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$h=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,tn=class extends wn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Jh,this.fragmentShader=$h,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=hi(e.uniforms),this.uniformsGroups=Zh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ps=class extends Mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=Kt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Fn=new k,Tc=new Me,Ac=new Me,Et=class extends ps{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Di*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ns*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Di*2*Math.atan(Math.tan(ns*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Fn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fn.x,Fn.y).multiplyScalar(-e/Fn.z),Fn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fn.x,Fn.y).multiplyScalar(-e/Fn.z)}getViewSize(e,t){return this.getViewBounds(e,Tc,Ac),t.subVectors(Ac,Tc)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ns*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ai=-90,Ri=1,dr=class extends Mt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Et(Ai,Ri,e,t);s.layers=this.layers,this.add(s);let r=new Et(Ai,Ri,e,t);r.layers=this.layers,this.add(r);let o=new Et(Ai,Ri,e,t);o.layers=this.layers,this.add(o);let a=new Et(Ai,Ri,e,t);a.layers=this.layers,this.add(a);let l=new Et(Ai,Ri,e,t);l.layers=this.layers,this.add(l);let c=new Et(Ai,Ri,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===Kt)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===cs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),p=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,p,d),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}},ms=class extends Ot{constructor(e=[],t=ci,n,s,r,o,a,l,c,h){super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},fr=class extends cn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ms(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new en(5,5,5),r=new tn({name:"CubemapFromEquirect",uniforms:hi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:It,blending:Rn});r.uniforms.tEquirect.value=t;let o=new mt(s,r),a=t.minFilter;return t.minFilter===Gn&&(t.minFilter=Qt),new dr(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},je=class extends Mt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Kh={type:"move"},Oi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new je,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new je,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new je,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let v of e.hand.values()){let m=t.getJointPose(v,n),f=this._getHandJoint(c,v);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],p=h.position.distanceTo(u.position),d=.02,_=.005;c.inputState.pinching&&p>d+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=d-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Kh)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new je;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var gs=class extends Mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new jt,this.environmentIntensity=1,this.environmentRotation=new jt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var na=new k,Qh=new k,jh=new We,Vt=class{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=na.subVectors(n,t).cross(Qh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(na),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||jh.getNormalMatrix(e),s=this.coplanarPoint(na).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Qn=new Ni,eu=new Me(.5,.5),er=new k,Bi=class{constructor(e=new Vt,t=new Vt,n=new Vt,s=new Vt,r=new Vt,o=new Vt){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Kt,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],p=r[6],d=r[7],_=r[8],v=r[9],m=r[10],f=r[11],I=r[12],P=r[13],M=r[14],C=r[15];if(s[0].setComponents(c-o,d-h,f-_,C-I).normalize(),s[1].setComponents(c+o,d+h,f+_,C+I).normalize(),s[2].setComponents(c+a,d+u,f+v,C+P).normalize(),s[3].setComponents(c-a,d-u,f-v,C-P).normalize(),n)s[4].setComponents(l,p,m,M).normalize(),s[5].setComponents(c-l,d-p,f-m,C-M).normalize();else if(s[4].setComponents(c-l,d-p,f-m,C-M).normalize(),t===Kt)s[5].setComponents(c+l,d+p,f+m,C+M).normalize();else if(t===cs)s[5].setComponents(l,p,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Qn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Qn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Qn)}intersectsSprite(e){Qn.center.set(0,0,0);let t=eu.distanceTo(e.center);return Qn.radius=.7071067811865476+t,Qn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Qn)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(er.x=s.normal.x>0?e.max.x:e.min.x,er.y=s.normal.y>0?e.max.y:e.min.y,er.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(er)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var _s=class extends Ot{constructor(e,t,n=Wn,s,r,o,a=Gt,l=Gt,c,h=Pi,u=1){if(h!==Pi&&h!==Gi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let p={width:e,height:t,depth:u};super(p,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ui(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},xs=class extends Ot{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var Wt=class i extends st{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],p=[],d=[],_=0,v=[],m=n/2,f=0;I(),o===!1&&(e>0&&P(!0),t>0&&P(!1)),this.setIndex(h),this.setAttribute("position",new Ve(u,3)),this.setAttribute("normal",new Ve(p,3)),this.setAttribute("uv",new Ve(d,2));function I(){let M=new k,C=new k,b=0,D=(t-e)/n;for(let w=0;w<=r;w++){let g=[],x=w/r,N=x*(t-e)+e;for(let O=0;O<=s;O++){let z=O/s,q=z*l+a,H=Math.sin(q),G=Math.cos(q);C.x=N*H,C.y=-x*n+m,C.z=N*G,u.push(C.x,C.y,C.z),M.set(H,D,G).normalize(),p.push(M.x,M.y,M.z),d.push(z,1-x),g.push(_++)}v.push(g)}for(let w=0;w<s;w++)for(let g=0;g<r;g++){let x=v[g][w],N=v[g+1][w],O=v[g+1][w+1],z=v[g][w+1];(e>0||g!==0)&&(h.push(x,N,z),b+=3),(t>0||g!==r-1)&&(h.push(N,O,z),b+=3)}c.addGroup(f,b,0),f+=b}function P(M){let C=_,b=new Me,D=new k,w=0,g=M===!0?e:t,x=M===!0?1:-1;for(let O=1;O<=s;O++)u.push(0,m*x,0),p.push(0,x,0),d.push(.5,.5),_++;let N=_;for(let O=0;O<=s;O++){let q=O/s*l+a,H=Math.cos(q),G=Math.sin(q);D.x=g*G,D.y=m*x,D.z=g*H,u.push(D.x,D.y,D.z),p.push(0,x,0),b.x=H*.5+.5,b.y=G*.5*x+.5,d.push(b.x,b.y),_++}for(let O=0;O<s;O++){let z=C+O,q=N+O;M===!0?h.push(q,q+1,z):h.push(q+1,q,z),w+=3}c.addGroup(f,w,M===!0?1:2),f+=w}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ii=class i extends Wt{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ys=class i extends st{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new Ve(r,3)),this.setAttribute("normal",new Ve(r.slice(),3)),this.setAttribute("uv",new Ve(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(I){let P=new k,M=new k,C=new k;for(let b=0;b<t.length;b+=3)d(t[b+0],P),d(t[b+1],M),d(t[b+2],C),l(P,M,C,I)}function l(I,P,M,C){let b=C+1,D=[];for(let w=0;w<=b;w++){D[w]=[];let g=I.clone().lerp(M,w/b),x=P.clone().lerp(M,w/b),N=b-w;for(let O=0;O<=N;O++)O===0&&w===b?D[w][O]=g:D[w][O]=g.clone().lerp(x,O/N)}for(let w=0;w<b;w++)for(let g=0;g<2*(b-w)-1;g++){let x=Math.floor(g/2);g%2===0?(p(D[w][x+1]),p(D[w+1][x]),p(D[w][x])):(p(D[w][x+1]),p(D[w+1][x+1]),p(D[w+1][x]))}}function c(I){let P=new k;for(let M=0;M<r.length;M+=3)P.x=r[M+0],P.y=r[M+1],P.z=r[M+2],P.normalize().multiplyScalar(I),r[M+0]=P.x,r[M+1]=P.y,r[M+2]=P.z}function h(){let I=new k;for(let P=0;P<r.length;P+=3){I.x=r[P+0],I.y=r[P+1],I.z=r[P+2];let M=m(I)/2/Math.PI+.5,C=f(I)/Math.PI+.5;o.push(M,1-C)}_(),u()}function u(){for(let I=0;I<o.length;I+=6){let P=o[I+0],M=o[I+2],C=o[I+4],b=Math.max(P,M,C),D=Math.min(P,M,C);b>.9&&D<.1&&(P<.2&&(o[I+0]+=1),M<.2&&(o[I+2]+=1),C<.2&&(o[I+4]+=1))}}function p(I){r.push(I.x,I.y,I.z)}function d(I,P){let M=I*3;P.x=e[M+0],P.y=e[M+1],P.z=e[M+2]}function _(){let I=new k,P=new k,M=new k,C=new k,b=new Me,D=new Me,w=new Me;for(let g=0,x=0;g<r.length;g+=9,x+=6){I.set(r[g+0],r[g+1],r[g+2]),P.set(r[g+3],r[g+4],r[g+5]),M.set(r[g+6],r[g+7],r[g+8]),b.set(o[x+0],o[x+1]),D.set(o[x+2],o[x+3]),w.set(o[x+4],o[x+5]),C.copy(I).add(P).add(M).divideScalar(3);let N=m(C);v(b,x+0,I,N),v(D,x+2,P,N),v(w,x+4,M,N)}}function v(I,P,M,C){C<0&&I.x===1&&(o[P]=I.x-1),M.x===0&&M.z===0&&(o[P]=C/2/Math.PI+.5)}function m(I){return Math.atan2(I.z,-I.x)}function f(I){return Math.atan2(-I.y,Math.sqrt(I.x*I.x+I.z*I.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var Xt=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],p=n[s+1]-h,d=(o-h)/p;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new Me:new k);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new k,s=[],r=[],o=[],a=new k,l=new ut;for(let d=0;d<=e;d++){let _=d/e;s[d]=this.getTangentAt(_,new k)}r[0]=new k,o[0]=new k;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),p=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),p<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();let _=Math.acos(Ye(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(a,_))}o[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(Ye(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(d=-d);for(let _=1;_<=e;_++)r[_].applyMatrix4(l.makeRotationAxis(s[_],d*_)),o[_].crossVectors(s[_],r[_])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},vs=class extends Xt{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new Me){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),p=l-this.aX,d=c-this.aY;l=p*h-d*u+this.aX,c=p*u+d*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},pr=class extends vs{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Oa(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let p=(o-r)/c-(a-r)/(c+h)+(a-o)/h,d=(a-o)/h-(l-o)/(h+u)+(l-a)/u;p*=h,d*=h,s(o,a,p,d)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var tr=new k,ia=new Oa,sa=new Oa,ra=new Oa,nn=class extends Xt{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new k){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(tr.subVectors(s[0],s[1]).add(s[0]),c=tr);let u=s[a%r],p=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(tr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=tr),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,_=Math.pow(c.distanceToSquared(u),d),v=Math.pow(u.distanceToSquared(p),d),m=Math.pow(p.distanceToSquared(h),d);v<1e-4&&(v=1),_<1e-4&&(_=v),m<1e-4&&(m=v),ia.initNonuniformCatmullRom(c.x,u.x,p.x,h.x,_,v,m),sa.initNonuniformCatmullRom(c.y,u.y,p.y,h.y,_,v,m),ra.initNonuniformCatmullRom(c.z,u.z,p.z,h.z,_,v,m)}else this.curveType==="catmullrom"&&(ia.initCatmullRom(c.x,u.x,p.x,h.x,this.tension),sa.initCatmullRom(c.y,u.y,p.y,h.y,this.tension),ra.initCatmullRom(c.z,u.z,p.z,h.z,this.tension));return n.set(ia.calc(l),sa.calc(l),ra.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new k().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Rc(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function tu(i,e){let t=1-i;return t*t*e}function nu(i,e){return 2*(1-i)*i*e}function iu(i,e){return i*i*e}function ss(i,e,t,n){return tu(i,e)+nu(i,t)+iu(i,n)}function su(i,e){let t=1-i;return t*t*t*e}function ru(i,e){let t=1-i;return 3*t*t*i*e}function ou(i,e){return 3*(1-i)*i*i*e}function au(i,e){return i*i*i*e}function rs(i,e,t,n,s){return su(i,e)+ru(i,t)+ou(i,n)+au(i,s)}var mr=class extends Xt{constructor(e=new Me,t=new Me,n=new Me,s=new Me){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Me){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(rs(e,s.x,r.x,o.x,a.x),rs(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},gr=class extends Xt{constructor(e=new k,t=new k,n=new k,s=new k){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new k){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(rs(e,s.x,r.x,o.x,a.x),rs(e,s.y,r.y,o.y,a.y),rs(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},_r=class extends Xt{constructor(e=new Me,t=new Me){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Me){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Me){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},xr=class extends Xt{constructor(e=new k,t=new k){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new k){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new k){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},yr=class extends Xt{constructor(e=new Me,t=new Me,n=new Me){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Me){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(ss(e,s.x,r.x,o.x),ss(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ms=class extends Xt{constructor(e=new k,t=new k,n=new k){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new k){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(ss(e,s.x,r.x,o.x),ss(e,s.y,r.y,o.y),ss(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},vr=class extends Xt{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Me){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Rc(a,l.x,c.x,h.x,u.x),Rc(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new Me().fromArray(s))}return this}},cu=Object.freeze({__proto__:null,ArcCurve:pr,CatmullRomCurve3:nn,CubicBezierCurve:mr,CubicBezierCurve3:gr,EllipseCurve:vs,LineCurve:_r,LineCurve3:xr,QuadraticBezierCurve:yr,QuadraticBezierCurve3:Ms,SplineCurve:vr});var gt=class i extends ys{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},si=class i extends st{constructor(e=[new Me(0,-.5),new Me(.5,0),new Me(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=Ye(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/t,u=new k,p=new Me,d=new k,_=new k,v=new k,m=0,f=0;for(let I=0;I<=e.length-1;I++)switch(I){case 0:m=e[I+1].x-e[I].x,f=e[I+1].y-e[I].y,d.x=f*1,d.y=-m,d.z=f*0,v.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case e.length-1:l.push(v.x,v.y,v.z);break;default:m=e[I+1].x-e[I].x,f=e[I+1].y-e[I].y,d.x=f*1,d.y=-m,d.z=f*0,_.copy(d),d.x+=v.x,d.y+=v.y,d.z+=v.z,d.normalize(),l.push(d.x,d.y,d.z),v.copy(_)}for(let I=0;I<=t;I++){let P=n+I*h*s,M=Math.sin(P),C=Math.cos(P);for(let b=0;b<=e.length-1;b++){u.x=e[b].x*M,u.y=e[b].y,u.z=e[b].x*C,o.push(u.x,u.y,u.z),p.x=I/t,p.y=b/(e.length-1),a.push(p.x,p.y);let D=l[3*b+0]*M,w=l[3*b+1],g=l[3*b+0]*C;c.push(D,w,g)}}for(let I=0;I<t;I++)for(let P=0;P<e.length-1;P++){let M=P+I*e.length,C=M,b=M+e.length,D=M+e.length+1,w=M+1;r.push(C,b,w),r.push(D,w,b)}this.setIndex(r),this.setAttribute("position",new Ve(o,3)),this.setAttribute("uv",new Ve(a,2)),this.setAttribute("normal",new Ve(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},sn=class i extends ys{constructor(e=1,t=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},rn=class i extends st{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,p=t/l,d=[],_=[],v=[],m=[];for(let f=0;f<h;f++){let I=f*p-o;for(let P=0;P<c;P++){let M=P*u-r;_.push(M,-I,0),v.push(0,0,1),m.push(P/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let I=0;I<a;I++){let P=I+c*f,M=I+c*(f+1),C=I+1+c*(f+1),b=I+1+c*f;d.push(P,M,b),d.push(M,C,b)}this.setIndex(d),this.setAttribute("position",new Ve(_,3)),this.setAttribute("normal",new Ve(v,3)),this.setAttribute("uv",new Ve(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},ri=class i extends st{constructor(e=.5,t=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);let a=[],l=[],c=[],h=[],u=e,p=(t-e)/s,d=new k,_=new Me;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){let f=r+m/n*o;d.x=u*Math.cos(f),d.y=u*Math.sin(f),l.push(d.x,d.y,d.z),c.push(0,0,1),_.x=(d.x/t+1)/2,_.y=(d.y/t+1)/2,h.push(_.x,_.y)}u+=p}for(let v=0;v<s;v++){let m=v*(n+1);for(let f=0;f<n;f++){let I=f+m,P=I,M=I+n+1,C=I+n+2,b=I+1;a.push(P,M,b),a.push(M,C,b)}}this.setIndex(a),this.setAttribute("position",new Ve(l,3)),this.setAttribute("normal",new Ve(c,3)),this.setAttribute("uv",new Ve(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var oi=class i extends st{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new k,p=new k,d=[],_=[],v=[],m=[];for(let f=0;f<=n;f++){let I=[],P=f/n,M=0;f===0&&o===0?M=.5/t:f===n&&l===Math.PI&&(M=-.5/t);for(let C=0;C<=t;C++){let b=C/t;u.x=-e*Math.cos(s+b*r)*Math.sin(o+P*a),u.y=e*Math.cos(o+P*a),u.z=e*Math.sin(s+b*r)*Math.sin(o+P*a),_.push(u.x,u.y,u.z),p.copy(u).normalize(),v.push(p.x,p.y,p.z),m.push(b+M,1-P),I.push(c++)}h.push(I)}for(let f=0;f<n;f++)for(let I=0;I<t;I++){let P=h[f][I+1],M=h[f][I],C=h[f+1][I],b=h[f+1][I+1];(f!==0||o>0)&&d.push(P,M,b),(f!==n-1||l<Math.PI)&&d.push(M,C,b)}this.setIndex(d),this.setAttribute("position",new Ve(_,3)),this.setAttribute("normal",new Ve(v,3)),this.setAttribute("uv",new Ve(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Tn=class i extends st{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new k,u=new k,p=new k;for(let d=0;d<=n;d++)for(let _=0;_<=s;_++){let v=_/s*r,m=d/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(v),u.y=(e+t*Math.cos(m))*Math.sin(v),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),p.subVectors(u,h).normalize(),l.push(p.x,p.y,p.z),c.push(_/s),c.push(d/n)}for(let d=1;d<=n;d++)for(let _=1;_<=s;_++){let v=(s+1)*d+_-1,m=(s+1)*(d-1)+_-1,f=(s+1)*(d-1)+_,I=(s+1)*d+_;o.push(v,m,I),o.push(m,f,I)}this.setIndex(o),this.setAttribute("position",new Ve(a,3)),this.setAttribute("normal",new Ve(l,3)),this.setAttribute("uv",new Ve(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var An=class i extends st{constructor(e=new Ms(new k(-1,-1,0),new k(-1,1,0),new k(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new k,l=new k,c=new Me,h=new k,u=[],p=[],d=[],_=[];v(),this.setIndex(_),this.setAttribute("position",new Ve(u,3)),this.setAttribute("normal",new Ve(p,3)),this.setAttribute("uv",new Ve(d,2));function v(){for(let P=0;P<t;P++)m(P);m(r===!1?t:0),I(),f()}function m(P){h=e.getPointAt(P/t,h);let M=o.normals[P],C=o.binormals[P];for(let b=0;b<=s;b++){let D=b/s*Math.PI*2,w=Math.sin(D),g=-Math.cos(D);l.x=g*M.x+w*C.x,l.y=g*M.y+w*C.y,l.z=g*M.z+w*C.z,l.normalize(),p.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function f(){for(let P=1;P<=t;P++)for(let M=1;M<=s;M++){let C=(s+1)*(P-1)+(M-1),b=(s+1)*P+(M-1),D=(s+1)*P+M,w=(s+1)*(P-1)+M;_.push(C,b,w),_.push(b,D,w)}}function I(){for(let P=0;P<=t;P++)for(let M=0;M<=s;M++)c.x=P/t,c.y=M/s,d.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new cu[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};var Ss=class extends wn{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Oe(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};var Dt=class extends wn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Pa,this.normalScale=new Me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new jt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Mr=class extends wn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=cl,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Sr=class extends wn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function nr(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function lu(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var ai=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},br=class extends ai{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:aa,endingEnd:aa}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case ca:r=e,a=2*t-n;break;case la:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ca:o=e,l=2*n-t;break;case la:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,p=this._weightPrev,d=this._weightNext,_=(n-t)/(s-t),v=_*_,m=v*_,f=-p*m+2*p*v-p*_,I=(1+p)*m+(-1.5-2*p)*v+(-.5+p)*_+1,P=(-1-d)*m+(1.5+d)*v+.5*_,M=d*m-d*v;for(let C=0;C!==a;++C)r[C]=f*o[h+C]+I*o[c+C]+P*o[l+C]+M*o[u+C];return r}},Er=class extends ai{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let p=0;p!==a;++p)r[p]=o[c+p]*u+o[l+p]*h;return r}},wr=class extends ai{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Bt=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=nr(t,this.TimeBufferType),this.values=nr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:nr(e.times,Array),values:nr(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new wr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Er(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new br(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case os:t=this.InterpolantFactoryMethodDiscrete;break;case cr:t=this.InterpolantFactoryMethodLinear;break;case ir:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return os;case this.InterpolantFactoryMethodLinear:return cr;case this.InterpolantFactoryMethodSmooth:return ir}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&lu(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ir,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,p=u-n,d=u+n;for(let _=0;_!==n;++_){let v=t[u+_];if(v!==t[p+_]||v!==t[d+_]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,p=o*n;for(let d=0;d!==n;++d)t[p+d]=t[u+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Bt.prototype.ValueTypeName="";Bt.prototype.TimeBufferType=Float32Array;Bt.prototype.ValueBufferType=Float32Array;Bt.prototype.DefaultInterpolation=cr;var kn=class extends Bt{constructor(e,t,n){super(e,t,n)}};kn.prototype.ValueTypeName="bool";kn.prototype.ValueBufferType=Array;kn.prototype.DefaultInterpolation=os;kn.prototype.InterpolantFactoryMethodLinear=void 0;kn.prototype.InterpolantFactoryMethodSmooth=void 0;var Tr=class extends Bt{constructor(e,t,n,s){super(e,t,n,s)}};Tr.prototype.ValueTypeName="color";var Ar=class extends Bt{constructor(e,t,n,s){super(e,t,n,s)}};Ar.prototype.ValueTypeName="number";var Rr=class extends ai{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)En.slerpFlat(r,0,o,c-a,o,c,l);return r}},bs=class extends Bt{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Rr(this.times,this.values,this.getValueSize(),e)}};bs.prototype.ValueTypeName="quaternion";bs.prototype.InterpolantFactoryMethodSmooth=void 0;var Vn=class extends Bt{constructor(e,t,n){super(e,t,n)}};Vn.prototype.ValueTypeName="string";Vn.prototype.ValueBufferType=Array;Vn.prototype.DefaultInterpolation=os;Vn.prototype.InterpolantFactoryMethodLinear=void 0;Vn.prototype.InterpolantFactoryMethodSmooth=void 0;var Cr=class extends Bt{constructor(e,t,n,s){super(e,t,n,s)}};Cr.prototype.ValueTypeName="vector";var Ir=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,p=c.length;u<p;u+=2){let d=c[u],_=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return _}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Sl=new Ir,Pr=class{constructor(e){this.manager=e!==void 0?e:Sl,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Pr.DEFAULT_MATERIAL_NAME="__DEFAULT";var Es=class extends Mt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Oe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},ws=class extends Es{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Oe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},oa=new ut,Cc=new k,Ic=new k,da=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Me(512,512),this.mapType=on,this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bi,this._frameExtents=new Me(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Cc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Cc),Ic.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ic),t.updateMatrixWorld(),oa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(oa,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(oa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Ts=class extends ps{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},fa=class extends da{constructor(){super(new Ts(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},zi=class extends Es{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.target=new Mt,this.shadow=new fa}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var Dr=class extends Et{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Ba="\\[\\]\\.:\\/",hu=new RegExp("["+Ba+"]","g"),za="[^"+Ba+"]",uu="[^"+Ba.replace("\\.","")+"]",du=/((?:WC+[\/:])*)/.source.replace("WC",za),fu=/(WCOD+)?/.source.replace("WCOD",uu),pu=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",za),mu=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",za),gu=new RegExp("^"+du+fu+pu+mu+"$"),_u=["material","materials","bones","map"],pa=class{constructor(e,t,n){let s=n||ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ct=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(hu,"")}static parseTrackName(e){let t=gu.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);_u.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ct.Composite=pa;ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ct.prototype.GetterByBindingType=[ct.prototype._getValue_direct,ct.prototype._getValue_array,ct.prototype._getValue_arrayElement,ct.prototype._getValue_toArray];ct.prototype.SetterByBindingTypeAndVersioning=[[ct.prototype._setValue_direct,ct.prototype._setValue_direct_setNeedsUpdate,ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_array,ct.prototype._setValue_array_setNeedsUpdate,ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_arrayElement,ct.prototype._setValue_arrayElement_setNeedsUpdate,ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_fromArray,ct.prototype._setValue_fromArray_setNeedsUpdate,ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var rg=new Float32Array(1);var Pc=new ut,As=class{constructor(e,t,n=0,s=1/0){this.ray=new us(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Fi,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Pc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Pc),this}intersectObject(e,t=!0,n=[]){return ma(e,this,n,t),n.sort(Dc),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)ma(e[s],this,n,t);return n.sort(Dc),n}};function Dc(i,e){return i.distance-e.distance}function ma(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)ma(r[o],e,t,!0)}}function Ha(i,e,t,n){let s=xu(n);switch(t){case Aa:return i*e;case Ca:return i*e/s.components*s.byteLength;case Zr:return i*e/s.components*s.byteLength;case Ia:return i*e*2/s.components*s.byteLength;case Jr:return i*e*2/s.components*s.byteLength;case Ra:return i*e*3/s.components*s.byteLength;case qt:return i*e*4/s.components*s.byteLength;case $r:return i*e*4/s.components*s.byteLength;case Is:case Ps:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ds:case Ls:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Qr:case eo:return Math.max(i,16)*Math.max(e,8)/4;case Kr:case jr:return Math.max(i,8)*Math.max(e,8)/2;case to:case no:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case io:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case so:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ro:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case oo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ao:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case co:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case lo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ho:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case uo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case fo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case po:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case mo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case go:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case _o:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case xo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case yo:case vo:case Mo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case So:case bo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Eo:case wo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function xu(i){switch(i){case on:case ba:return{byteLength:1,components:1};case Hi:case Ea:case ki:return{byteLength:2,components:1};case qr:case Yr:return{byteLength:2,components:4};case Wn:case Xr:case un:return{byteLength:4,components:1};case wa:case Ta:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function ql(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Tu(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,p=i.createBuffer();i.bindBuffer(l,p),i.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((d,_)=>d.start-_.start);let p=0;for(let d=1;d<u.length;d++){let _=u[p],v=u[d];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++p,u[p]=v)}u.length=p+1;for(let d=0,_=u.length;d<_;d++){let v=u[d];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Au=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ru=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Cu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Iu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Du=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Lu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Uu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Nu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Fu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ou=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Bu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,zu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Hu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ku=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Vu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Gu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Wu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Xu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,qu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Yu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Zu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ju=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,$u=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ku=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Qu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,ju=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ed=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,td=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,nd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,id="gl_FragColor = linearToOutputTexel( gl_FragColor );",sd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,rd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,od=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ad=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,cd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ld=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,hd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ud=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,dd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,pd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,md=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_d=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,xd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,yd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,vd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Md=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Sd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,bd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ed=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,wd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Td=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ad=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Rd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Cd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Id=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Pd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ld=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ud=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Nd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Fd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Od=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,zd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Hd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,kd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vd=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Gd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Xd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,qd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Zd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Jd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,$d=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Kd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Qd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,jd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ef=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,tf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,nf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,of=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,af=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,cf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,hf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,uf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,df=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ff=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,mf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,gf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,_f=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,xf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,yf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Mf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Sf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,bf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ef=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,wf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Tf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Af=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Rf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,If=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Df=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Uf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Nf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ff=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Of=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zf=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Hf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Vf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,qf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Zf=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Jf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$f=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Qf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ep=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,np=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ip=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,rp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,op=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qe={alphahash_fragment:Au,alphahash_pars_fragment:Ru,alphamap_fragment:Cu,alphamap_pars_fragment:Iu,alphatest_fragment:Pu,alphatest_pars_fragment:Du,aomap_fragment:Lu,aomap_pars_fragment:Uu,batching_pars_vertex:Nu,batching_vertex:Fu,begin_vertex:Ou,beginnormal_vertex:Bu,bsdfs:zu,iridescence_fragment:Hu,bumpmap_pars_fragment:ku,clipping_planes_fragment:Vu,clipping_planes_pars_fragment:Gu,clipping_planes_pars_vertex:Wu,clipping_planes_vertex:Xu,color_fragment:qu,color_pars_fragment:Yu,color_pars_vertex:Zu,color_vertex:Ju,common:$u,cube_uv_reflection_fragment:Ku,defaultnormal_vertex:Qu,displacementmap_pars_vertex:ju,displacementmap_vertex:ed,emissivemap_fragment:td,emissivemap_pars_fragment:nd,colorspace_fragment:id,colorspace_pars_fragment:sd,envmap_fragment:rd,envmap_common_pars_fragment:od,envmap_pars_fragment:ad,envmap_pars_vertex:cd,envmap_physical_pars_fragment:yd,envmap_vertex:ld,fog_vertex:hd,fog_pars_vertex:ud,fog_fragment:dd,fog_pars_fragment:fd,gradientmap_pars_fragment:pd,lightmap_pars_fragment:md,lights_lambert_fragment:gd,lights_lambert_pars_fragment:_d,lights_pars_begin:xd,lights_toon_fragment:vd,lights_toon_pars_fragment:Md,lights_phong_fragment:Sd,lights_phong_pars_fragment:bd,lights_physical_fragment:Ed,lights_physical_pars_fragment:wd,lights_fragment_begin:Td,lights_fragment_maps:Ad,lights_fragment_end:Rd,logdepthbuf_fragment:Cd,logdepthbuf_pars_fragment:Id,logdepthbuf_pars_vertex:Pd,logdepthbuf_vertex:Dd,map_fragment:Ld,map_pars_fragment:Ud,map_particle_fragment:Nd,map_particle_pars_fragment:Fd,metalnessmap_fragment:Od,metalnessmap_pars_fragment:Bd,morphinstance_vertex:zd,morphcolor_vertex:Hd,morphnormal_vertex:kd,morphtarget_pars_vertex:Vd,morphtarget_vertex:Gd,normal_fragment_begin:Wd,normal_fragment_maps:Xd,normal_pars_fragment:qd,normal_pars_vertex:Yd,normal_vertex:Zd,normalmap_pars_fragment:Jd,clearcoat_normal_fragment_begin:$d,clearcoat_normal_fragment_maps:Kd,clearcoat_pars_fragment:Qd,iridescence_pars_fragment:jd,opaque_fragment:ef,packing:tf,premultiplied_alpha_fragment:nf,project_vertex:sf,dithering_fragment:rf,dithering_pars_fragment:of,roughnessmap_fragment:af,roughnessmap_pars_fragment:cf,shadowmap_pars_fragment:lf,shadowmap_pars_vertex:hf,shadowmap_vertex:uf,shadowmask_pars_fragment:df,skinbase_vertex:ff,skinning_pars_vertex:pf,skinning_vertex:mf,skinnormal_vertex:gf,specularmap_fragment:_f,specularmap_pars_fragment:xf,tonemapping_fragment:yf,tonemapping_pars_fragment:vf,transmission_fragment:Mf,transmission_pars_fragment:Sf,uv_pars_fragment:bf,uv_pars_vertex:Ef,uv_vertex:wf,worldpos_vertex:Tf,background_vert:Af,background_frag:Rf,backgroundCube_vert:Cf,backgroundCube_frag:If,cube_vert:Pf,cube_frag:Df,depth_vert:Lf,depth_frag:Uf,distanceRGBA_vert:Nf,distanceRGBA_frag:Ff,equirect_vert:Of,equirect_frag:Bf,linedashed_vert:zf,linedashed_frag:Hf,meshbasic_vert:kf,meshbasic_frag:Vf,meshlambert_vert:Gf,meshlambert_frag:Wf,meshmatcap_vert:Xf,meshmatcap_frag:qf,meshnormal_vert:Yf,meshnormal_frag:Zf,meshphong_vert:Jf,meshphong_frag:$f,meshphysical_vert:Kf,meshphysical_frag:Qf,meshtoon_vert:jf,meshtoon_frag:ep,points_vert:tp,points_frag:np,shadow_vert:ip,shadow_frag:sp,sprite_vert:rp,sprite_frag:op},Se={common:{diffuse:{value:new Oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new Me(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new Oe(16777215)},opacity:{value:1},center:{value:new Me(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},dn={basic:{uniforms:wt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:wt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new Oe(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:wt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new Oe(0)},specular:{value:new Oe(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:wt([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new Oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:wt([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new Oe(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:wt([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:wt([Se.points,Se.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:wt([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:wt([Se.common,Se.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:wt([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:wt([Se.sprite,Se.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:wt([Se.common,Se.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:wt([Se.lights,Se.fog,{color:{value:new Oe(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};dn.physical={uniforms:wt([dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new Me(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new Oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new Me},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new Oe(0)},specularColor:{value:new Oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new Me},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};var To={r:0,b:0,g:0},ui=new jt,ap=new ut;function cp(i,e,t,n,s,r,o){let a=new Oe(0),l=r===!0?0:1,c,h,u=null,p=0,d=null;function _(P){let M=P.isScene===!0?P.background:null;return M&&M.isTexture&&(M=(P.backgroundBlurriness>0?t:e).get(M)),M}function v(P){let M=!1,C=_(P);C===null?f(a,l):C&&C.isColor&&(f(C,1),M=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,o):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(P,M){let C=_(M);C&&(C.isCubeTexture||C.mapping===Rs)?(h===void 0&&(h=new mt(new en(1,1,1),new tn({name:"BackgroundCubeMaterial",uniforms:hi(dn.backgroundCube.uniforms),vertexShader:dn.backgroundCube.vertexShader,fragmentShader:dn.backgroundCube.fragmentShader,side:It,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,D,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ui.copy(M.backgroundRotation),ui.x*=-1,ui.y*=-1,ui.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(ui.y*=-1,ui.z*=-1),h.material.uniforms.envMap.value=C,h.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(ap.makeRotationFromEuler(ui)),h.material.toneMapped=Je.getTransfer(C.colorSpace)!==et,(u!==C||p!==C.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=C,p=C.version,d=i.toneMapping),h.layers.enableAll(),P.unshift(h,h.geometry,h.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new mt(new rn(2,2),new tn({name:"BackgroundMaterial",uniforms:hi(dn.background.uniforms),vertexShader:dn.background.vertexShader,fragmentShader:dn.background.fragmentShader,side:Sn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=Je.getTransfer(C.colorSpace)!==et,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(u!==C||p!==C.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,u=C,p=C.version,d=i.toneMapping),c.layers.enableAll(),P.unshift(c,c.geometry,c.material,0,0,null))}function f(P,M){P.getRGB(To,Fa(i)),n.buffers.color.setClear(To.r,To.g,To.b,M,o)}function I(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(P,M=1){a.set(P),l=M,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(P){l=P,f(a,l)},render:v,addToRenderList:m,dispose:I}}function lp(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null),r=s,o=!1;function a(x,N,O,z,q){let H=!1,G=u(z,O,N);r!==G&&(r=G,c(r.object)),H=d(x,z,O,q),H&&_(x,z,O,q),q!==null&&e.update(q,i.ELEMENT_ARRAY_BUFFER),(H||o)&&(o=!1,M(x,N,O,z),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function l(){return i.createVertexArray()}function c(x){return i.bindVertexArray(x)}function h(x){return i.deleteVertexArray(x)}function u(x,N,O){let z=O.wireframe===!0,q=n[x.id];q===void 0&&(q={},n[x.id]=q);let H=q[N.id];H===void 0&&(H={},q[N.id]=H);let G=H[z];return G===void 0&&(G=p(l()),H[z]=G),G}function p(x){let N=[],O=[],z=[];for(let q=0;q<t;q++)N[q]=0,O[q]=0,z[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:O,attributeDivisors:z,object:x,attributes:{},index:null}}function d(x,N,O,z){let q=r.attributes,H=N.attributes,G=0,Q=O.getAttributes();for(let Z in Q)if(Q[Z].location>=0){let y=q[Z],R=H[Z];if(R===void 0&&(Z==="instanceMatrix"&&x.instanceMatrix&&(R=x.instanceMatrix),Z==="instanceColor"&&x.instanceColor&&(R=x.instanceColor)),y===void 0||y.attribute!==R||R&&y.data!==R.data)return!0;G++}return r.attributesNum!==G||r.index!==z}function _(x,N,O,z){let q={},H=N.attributes,G=0,Q=O.getAttributes();for(let Z in Q)if(Q[Z].location>=0){let y=H[Z];y===void 0&&(Z==="instanceMatrix"&&x.instanceMatrix&&(y=x.instanceMatrix),Z==="instanceColor"&&x.instanceColor&&(y=x.instanceColor));let R={};R.attribute=y,y&&y.data&&(R.data=y.data),q[Z]=R,G++}r.attributes=q,r.attributesNum=G,r.index=z}function v(){let x=r.newAttributes;for(let N=0,O=x.length;N<O;N++)x[N]=0}function m(x){f(x,0)}function f(x,N){let O=r.newAttributes,z=r.enabledAttributes,q=r.attributeDivisors;O[x]=1,z[x]===0&&(i.enableVertexAttribArray(x),z[x]=1),q[x]!==N&&(i.vertexAttribDivisor(x,N),q[x]=N)}function I(){let x=r.newAttributes,N=r.enabledAttributes;for(let O=0,z=N.length;O<z;O++)N[O]!==x[O]&&(i.disableVertexAttribArray(O),N[O]=0)}function P(x,N,O,z,q,H,G){G===!0?i.vertexAttribIPointer(x,N,O,q,H):i.vertexAttribPointer(x,N,O,z,q,H)}function M(x,N,O,z){v();let q=z.attributes,H=O.getAttributes(),G=N.defaultAttributeValues;for(let Q in H){let Z=H[Q];if(Z.location>=0){let U=q[Q];if(U===void 0&&(Q==="instanceMatrix"&&x.instanceMatrix&&(U=x.instanceMatrix),Q==="instanceColor"&&x.instanceColor&&(U=x.instanceColor)),U!==void 0){let y=U.normalized,R=U.itemSize,E=e.get(U);if(E===void 0)continue;let A=E.buffer,X=E.type,j=E.bytesPerElement,B=X===i.INT||X===i.UNSIGNED_INT||U.gpuType===Xr;if(U.isInterleavedBufferAttribute){let V=U.data,W=V.stride,te=U.offset;if(V.isInstancedInterleavedBuffer){for(let Y=0;Y<Z.locationSize;Y++)f(Z.location+Y,V.meshPerAttribute);x.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let Y=0;Y<Z.locationSize;Y++)m(Z.location+Y);i.bindBuffer(i.ARRAY_BUFFER,A);for(let Y=0;Y<Z.locationSize;Y++)P(Z.location+Y,R/Z.locationSize,X,y,W*j,(te+R/Z.locationSize*Y)*j,B)}else{if(U.isInstancedBufferAttribute){for(let V=0;V<Z.locationSize;V++)f(Z.location+V,U.meshPerAttribute);x.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=U.meshPerAttribute*U.count)}else for(let V=0;V<Z.locationSize;V++)m(Z.location+V);i.bindBuffer(i.ARRAY_BUFFER,A);for(let V=0;V<Z.locationSize;V++)P(Z.location+V,R/Z.locationSize,X,y,R*j,R/Z.locationSize*V*j,B)}}else if(G!==void 0){let y=G[Q];if(y!==void 0)switch(y.length){case 2:i.vertexAttrib2fv(Z.location,y);break;case 3:i.vertexAttrib3fv(Z.location,y);break;case 4:i.vertexAttrib4fv(Z.location,y);break;default:i.vertexAttrib1fv(Z.location,y)}}}}I()}function C(){w();for(let x in n){let N=n[x];for(let O in N){let z=N[O];for(let q in z)h(z[q].object),delete z[q];delete N[O]}delete n[x]}}function b(x){if(n[x.id]===void 0)return;let N=n[x.id];for(let O in N){let z=N[O];for(let q in z)h(z[q].object),delete z[q];delete N[O]}delete n[x.id]}function D(x){for(let N in n){let O=n[N];if(O[x.id]===void 0)continue;let z=O[x.id];for(let q in z)h(z[q].object),delete z[q];delete O[x.id]}}function w(){g(),o=!0,r!==s&&(r=s,c(r.object))}function g(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:w,resetDefaultState:g,dispose:C,releaseStatesOfGeometry:b,releaseStatesOfProgram:D,initAttributes:v,enableAttribute:m,disableUnusedAttributes:I}}function hp(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let d=0;for(let _=0;_<u;_++)d+=h[_];t.update(d,n,1)}function l(c,h,u,p){if(u===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let _=0;_<c.length;_++)o(c[_],h[_],p[_]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,h,0,p,0,u);let _=0;for(let v=0;v<u;v++)_+=h[v]*p[v];t.update(_,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function up(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let D=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(D){return!(D!==qt&&n.convert(D)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(D){let w=D===ki&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(D!==on&&n.convert(D)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&D!==un&&!w)}function l(D){if(D==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),I=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),P=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=_>0,b=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:p,maxTextures:d,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:I,maxVaryings:P,maxFragmentUniforms:M,vertexTextures:C,maxSamples:b}}function dp(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Vt,a=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){let d=u.length!==0||p||n!==0||s;return s=p,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,p){t=h(u,p,0)},this.setState=function(u,p,d){let _=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||_===null||_.length===0||r&&!m)r?h(null):c();else{let I=r?0:n,P=I*4,M=f.clippingState||null;l.value=M,M=h(_,p,P,d);for(let C=0;C!==P;++C)M[C]=t[C];f.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=I}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,p,d,_){let v=u!==null?u.length:0,m=null;if(v!==0){if(m=l.value,_!==!0||m===null){let f=d+v*4,I=p.matrixWorldInverse;a.getNormalMatrix(I),(m===null||m.length<f)&&(m=new Float32Array(f));for(let P=0,M=d;P!==v;++P,M+=4)o.copy(u[P]).applyMatrix4(I,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function fp(i){let e=new WeakMap;function t(o,a){return a===Vr?o.mapping=ci:a===Gr&&(o.mapping=li),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Vr||a===Gr)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new fr(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var qi=4,bl=[.125,.215,.35,.446,.526,.582],pi=20,ka=new Ts,El=new Oe,Va=null,Ga=0,Wa=0,Xa=!1,fi=(1+Math.sqrt(5))/2,Xi=1/fi,wl=[new k(-fi,Xi,0),new k(fi,Xi,0),new k(-Xi,0,fi),new k(Xi,0,fi),new k(0,fi,-Xi),new k(0,fi,Xi),new k(-1,1,-1),new k(1,1,-1),new k(-1,1,1),new k(1,1,1)],pp=new k,Co=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=pp}=r;Va=this._renderer.getRenderTarget(),Ga=this._renderer.getActiveCubeFace(),Wa=this._renderer.getActiveMipmapLevel(),Xa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Rl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Al(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Va,Ga,Wa),this._renderer.xr.enabled=Xa,e.scissorTest=!1,Ao(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ci||e.mapping===li?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Va=this._renderer.getRenderTarget(),Ga=this._renderer.getActiveCubeFace(),Wa=this._renderer.getActiveMipmapLevel(),Xa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Qt,minFilter:Qt,generateMipmaps:!1,type:ki,format:qt,colorSpace:ni,depthBuffer:!1},s=Tl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Tl(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=mp(r)),this._blurMaterial=gp(r,e,t)}return s}_compileMaterial(e){let t=new mt(this._lodPlanes[0],e);this._renderer.compile(t,ka)}_sceneToCubeUV(e,t,n,s,r){let l=new Et(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,p=u.autoClear,d=u.toneMapping;u.getClearColor(El),u.toneMapping=Cn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let v=new ln({name:"PMREM.Background",side:It,depthWrite:!1,depthTest:!1}),m=new mt(new en,v),f=!1,I=e.background;I?I.isColor&&(v.color.copy(I),e.background=null,f=!0):(v.color.copy(El),f=!0);for(let P=0;P<6;P++){let M=P%3;M===0?(l.up.set(0,c[P],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[P],r.y,r.z)):M===1?(l.up.set(0,0,c[P]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[P],r.z)):(l.up.set(0,c[P],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[P]));let C=this._cubeSize;Ao(s,M*C,P>2?C:0,C,C),u.setRenderTarget(s),f&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=d,u.autoClear=p,e.background=I}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===ci||e.mapping===li;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Rl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Al());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new mt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Ao(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,ka)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=wl[(s-r-1)%wl.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new mt(this._lodPlanes[s],c),p=c.uniforms,d=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*pi-1),v=r/_,m=isFinite(r)?1+Math.floor(h*v):pi;m>pi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${pi}`);let f=[],I=0;for(let D=0;D<pi;++D){let w=D/v,g=Math.exp(-w*w/2);f.push(g),D===0?I+=g:D<m&&(I+=2*g)}for(let D=0;D<f.length;D++)f[D]=f[D]/I;p.envMap.value=e.texture,p.samples.value=m,p.weights.value=f,p.latitudinal.value=o==="latitudinal",a&&(p.poleAxis.value=a);let{_lodMax:P}=this;p.dTheta.value=_,p.mipInt.value=P-n;let M=this._sizeLods[s],C=3*M*(s>P-qi?s-P+qi:0),b=4*(this._cubeSize-M);Ao(t,C,b,3*M,2*M),l.setRenderTarget(t),l.render(u,ka)}};function mp(i){let e=[],t=[],n=[],s=i,r=i-qi+1+bl.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-qi?l=bl[o-i+qi-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,p=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,_=6,v=3,m=2,f=1,I=new Float32Array(v*_*d),P=new Float32Array(m*_*d),M=new Float32Array(f*_*d);for(let b=0;b<d;b++){let D=b%3*2/3-1,w=b>2?0:-1,g=[D,w,0,D+2/3,w,0,D+2/3,w+1,0,D,w,0,D+2/3,w+1,0,D,w+1,0];I.set(g,v*_*b),P.set(p,m*_*b);let x=[b,b,b,b,b,b];M.set(x,f*_*b)}let C=new st;C.setAttribute("position",new Ct(I,v)),C.setAttribute("uv",new Ct(P,m)),C.setAttribute("faceIndex",new Ct(M,f)),e.push(C),s>qi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Tl(i,e,t){let n=new cn(i,e,t);return n.texture.mapping=Rs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ao(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function gp(i,e,t){let n=new Float32Array(pi),s=new k(0,1,0);return new tn({name:"SphericalGaussianBlur",defines:{n:pi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Al(){return new tn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Rl(){return new tn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function tc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function _p(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Vr||l===Gr,h=l===ci||l===li;if(c||h){let u=e.get(a),p=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==p)return t===null&&(t=new Co(i)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let d=a.image;return c&&d&&d.height>0||h&&d&&s(d)?(t===null&&(t=new Co(i)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function xp(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Li("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function yp(i,e,t,n){let s={},r=new WeakMap;function o(u){let p=u.target;p.index!==null&&e.remove(p.index);for(let _ in p.attributes)e.remove(p.attributes[_]);p.removeEventListener("dispose",o),delete s[p.id];let d=r.get(p);d&&(e.remove(d),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function a(u,p){return s[p.id]===!0||(p.addEventListener("dispose",o),s[p.id]=!0,t.memory.geometries++),p}function l(u){let p=u.attributes;for(let d in p)e.update(p[d],i.ARRAY_BUFFER)}function c(u){let p=[],d=u.index,_=u.attributes.position,v=0;if(d!==null){let I=d.array;v=d.version;for(let P=0,M=I.length;P<M;P+=3){let C=I[P+0],b=I[P+1],D=I[P+2];p.push(C,b,b,D,D,C)}}else if(_!==void 0){let I=_.array;v=_.version;for(let P=0,M=I.length/3-1;P<M;P+=3){let C=P+0,b=P+1,D=P+2;p.push(C,b,b,D,D,C)}}else return;let m=new(Na(p)?fs:ds)(p,1);m.version=v;let f=r.get(u);f&&e.remove(f),r.set(u,m)}function h(u){let p=r.get(u);if(p){let d=u.index;d!==null&&p.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function vp(i,e,t){let n;function s(p){n=p}let r,o;function a(p){r=p.type,o=p.bytesPerElement}function l(p,d){i.drawElements(n,d,r,p*o),t.update(d,n,1)}function c(p,d,_){_!==0&&(i.drawElementsInstanced(n,d,r,p*o,_),t.update(d,n,_))}function h(p,d,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,p,0,_);let m=0;for(let f=0;f<_;f++)m+=d[f];t.update(m,n,1)}function u(p,d,_,v){if(_===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<p.length;f++)c(p[f]/o,d[f],v[f]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,r,p,0,v,0,_);let f=0;for(let I=0;I<_;I++)f+=d[I]*v[I];t.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Mp(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Sp(i,e,t){let n=new WeakMap,s=new dt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,p=n.get(a);if(p===void 0||p.count!==u){let g=function(){D.dispose(),n.delete(a),a.removeEventListener("dispose",g)};p!==void 0&&p.texture.dispose();let d=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],I=a.morphAttributes.color||[],P=0;d===!0&&(P=1),_===!0&&(P=2),v===!0&&(P=3);let M=a.attributes.position.count*P,C=1;M>e.maxTextureSize&&(C=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);let b=new Float32Array(M*C*4*u),D=new hs(b,M,C,u);D.type=un,D.needsUpdate=!0;let w=P*4;for(let x=0;x<u;x++){let N=m[x],O=f[x],z=I[x],q=M*C*4*x;for(let H=0;H<N.count;H++){let G=H*w;d===!0&&(s.fromBufferAttribute(N,H),b[q+G+0]=s.x,b[q+G+1]=s.y,b[q+G+2]=s.z,b[q+G+3]=0),_===!0&&(s.fromBufferAttribute(O,H),b[q+G+4]=s.x,b[q+G+5]=s.y,b[q+G+6]=s.z,b[q+G+7]=0),v===!0&&(s.fromBufferAttribute(z,H),b[q+G+8]=s.x,b[q+G+9]=s.y,b[q+G+10]=s.z,b[q+G+11]=z.itemSize===4?s.w:1)}}p={count:u,texture:D,size:new Me(M,C)},n.set(a,p),a.addEventListener("dispose",g)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let d=0;for(let v=0;v<c.length;v++)d+=c[v];let _=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",p.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function bp(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let p=l.skeleton;s.get(p)!==c&&(p.update(),s.set(p,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Yl=new Ot,Cl=new _s(1,1),Zl=new hs,Jl=new ur,$l=new ms,Il=[],Pl=[],Dl=new Float32Array(16),Ll=new Float32Array(9),Ul=new Float32Array(4);function Zi(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Il[s];if(r===void 0&&(r=new Float32Array(s),Il[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function xt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Po(i,e){let t=Pl[e];t===void 0&&(t=new Int32Array(e),Pl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Ep(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function wp(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;i.uniform2fv(this.addr,e),yt(t,e)}}function Tp(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(xt(t,e))return;i.uniform3fv(this.addr,e),yt(t,e)}}function Ap(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;i.uniform4fv(this.addr,e),yt(t,e)}}function Rp(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(xt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),yt(t,e)}else{if(xt(t,n))return;Ul.set(n),i.uniformMatrix2fv(this.addr,!1,Ul),yt(t,n)}}function Cp(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(xt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),yt(t,e)}else{if(xt(t,n))return;Ll.set(n),i.uniformMatrix3fv(this.addr,!1,Ll),yt(t,n)}}function Ip(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(xt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),yt(t,e)}else{if(xt(t,n))return;Dl.set(n),i.uniformMatrix4fv(this.addr,!1,Dl),yt(t,n)}}function Pp(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Dp(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;i.uniform2iv(this.addr,e),yt(t,e)}}function Lp(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;i.uniform3iv(this.addr,e),yt(t,e)}}function Up(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;i.uniform4iv(this.addr,e),yt(t,e)}}function Np(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Fp(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;i.uniform2uiv(this.addr,e),yt(t,e)}}function Op(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;i.uniform3uiv(this.addr,e),yt(t,e)}}function Bp(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;i.uniform4uiv(this.addr,e),yt(t,e)}}function zp(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Cl.compareFunction=Da,r=Cl):r=Yl,t.setTexture2D(e||r,s)}function Hp(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Jl,s)}function kp(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||$l,s)}function Vp(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Zl,s)}function Gp(i){switch(i){case 5126:return Ep;case 35664:return wp;case 35665:return Tp;case 35666:return Ap;case 35674:return Rp;case 35675:return Cp;case 35676:return Ip;case 5124:case 35670:return Pp;case 35667:case 35671:return Dp;case 35668:case 35672:return Lp;case 35669:case 35673:return Up;case 5125:return Np;case 36294:return Fp;case 36295:return Op;case 36296:return Bp;case 35678:case 36198:case 36298:case 36306:case 35682:return zp;case 35679:case 36299:case 36307:return Hp;case 35680:case 36300:case 36308:case 36293:return kp;case 36289:case 36303:case 36311:case 36292:return Vp}}function Wp(i,e){i.uniform1fv(this.addr,e)}function Xp(i,e){let t=Zi(e,this.size,2);i.uniform2fv(this.addr,t)}function qp(i,e){let t=Zi(e,this.size,3);i.uniform3fv(this.addr,t)}function Yp(i,e){let t=Zi(e,this.size,4);i.uniform4fv(this.addr,t)}function Zp(i,e){let t=Zi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Jp(i,e){let t=Zi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function $p(i,e){let t=Zi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Kp(i,e){i.uniform1iv(this.addr,e)}function Qp(i,e){i.uniform2iv(this.addr,e)}function jp(i,e){i.uniform3iv(this.addr,e)}function em(i,e){i.uniform4iv(this.addr,e)}function tm(i,e){i.uniform1uiv(this.addr,e)}function nm(i,e){i.uniform2uiv(this.addr,e)}function im(i,e){i.uniform3uiv(this.addr,e)}function sm(i,e){i.uniform4uiv(this.addr,e)}function rm(i,e,t){let n=this.cache,s=e.length,r=Po(t,s);xt(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Yl,r[o])}function om(i,e,t){let n=this.cache,s=e.length,r=Po(t,s);xt(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Jl,r[o])}function am(i,e,t){let n=this.cache,s=e.length,r=Po(t,s);xt(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||$l,r[o])}function cm(i,e,t){let n=this.cache,s=e.length,r=Po(t,s);xt(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Zl,r[o])}function lm(i){switch(i){case 5126:return Wp;case 35664:return Xp;case 35665:return qp;case 35666:return Yp;case 35674:return Zp;case 35675:return Jp;case 35676:return $p;case 5124:case 35670:return Kp;case 35667:case 35671:return Qp;case 35668:case 35672:return jp;case 35669:case 35673:return em;case 5125:return tm;case 36294:return nm;case 36295:return im;case 36296:return sm;case 35678:case 36198:case 36298:case 36306:case 35682:return rm;case 35679:case 36299:case 36307:return om;case 35680:case 36300:case 36308:case 36293:return am;case 36289:case 36303:case 36311:case 36292:return cm}}var Ya=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Gp(t.type)}},Za=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=lm(t.type)}},Ja=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},qa=/(\w+)(\])?(\[|\.)?/g;function Nl(i,e){i.seq.push(e),i.map[e.id]=e}function hm(i,e,t){let n=i.name,s=n.length;for(qa.lastIndex=0;;){let r=qa.exec(n),o=qa.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Nl(t,c===void 0?new Ya(a,i,e):new Za(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new Ja(a),Nl(t,u)),t=u}}}var Yi=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);hm(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function Fl(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var um=37297,dm=0;function fm(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Ol=new We;function pm(i){Je._getMatrix(Ol,Je.workingColorSpace,i);let e=`mat3( ${Ol.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(i)){case as:return[e,"LinearTransferOETF"];case et:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Bl(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+fm(i.getShaderSource(e),a)}else return r}function mm(i,e){let t=pm(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function gm(i,e){let t;switch(e){case tl:t="Linear";break;case nl:t="Reinhard";break;case il:t="Cineon";break;case kr:t="ACESFilmic";break;case rl:t="AgX";break;case ol:t="Neutral";break;case sl:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ro=new k;function _m(){Je.getLuminanceCoefficients(Ro);let i=Ro.x.toFixed(4),e=Ro.y.toFixed(4),t=Ro.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function xm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Us).join(`
`)}function ym(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function vm(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Us(i){return i!==""}function zl(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Hl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Mm=/^[ \t]*#include +<([\w\d./]+)>/gm;function $a(i){return i.replace(Mm,bm)}var Sm=new Map;function bm(i,e){let t=qe[e];if(t===void 0){let n=Sm.get(e);if(n!==void 0)t=qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return $a(t)}var Em=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function kl(i){return i.replace(Em,wm)}function wm(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Vl(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Tm(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===_a?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Lr?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===hn&&(e="SHADOWMAP_TYPE_VSM"),e}function Am(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ci:case li:e="ENVMAP_TYPE_CUBE";break;case Rs:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Rm(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case li:e="ENVMAP_MODE_REFRACTION";break}return e}function Cm(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ma:e="ENVMAP_BLENDING_MULTIPLY";break;case jc:e="ENVMAP_BLENDING_MIX";break;case el:e="ENVMAP_BLENDING_ADD";break}return e}function Im(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Pm(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Tm(t),c=Am(t),h=Rm(t),u=Cm(t),p=Im(t),d=xm(t),_=ym(r),v=s.createProgram(),m,f,I=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Us).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Us).join(`
`),f.length>0&&(f+=`
`)):(m=[Vl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Us).join(`
`),f=[Vl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Cn?"#define TONE_MAPPING":"",t.toneMapping!==Cn?qe.tonemapping_pars_fragment:"",t.toneMapping!==Cn?gm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,mm("linearToOutputTexel",t.outputColorSpace),_m(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Us).join(`
`)),o=$a(o),o=zl(o,t),o=Hl(o,t),a=$a(a),a=zl(a,t),a=Hl(a,t),o=kl(o),a=kl(a),t.isRawShaderMaterial!==!0&&(I=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===La?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===La?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let P=I+m+o,M=I+f+a,C=Fl(s,s.VERTEX_SHADER,P),b=Fl(s,s.FRAGMENT_SHADER,M);s.attachShader(v,C),s.attachShader(v,b),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function D(N){if(i.debug.checkShaderErrors){let O=s.getProgramInfoLog(v)||"",z=s.getShaderInfoLog(C)||"",q=s.getShaderInfoLog(b)||"",H=O.trim(),G=z.trim(),Q=q.trim(),Z=!0,U=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(Z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,C,b);else{let y=Bl(s,C,"vertex"),R=Bl(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+H+`
`+y+`
`+R)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(G===""||Q==="")&&(U=!1);U&&(N.diagnostics={runnable:Z,programLog:H,vertexShader:{log:G,prefix:m},fragmentShader:{log:Q,prefix:f}})}s.deleteShader(C),s.deleteShader(b),w=new Yi(s,v),g=vm(s,v)}let w;this.getUniforms=function(){return w===void 0&&D(this),w};let g;this.getAttributes=function(){return g===void 0&&D(this),g};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(v,um)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=dm++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=C,this.fragmentShader=b,this}var Dm=0,Ka=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Qa(e),t.set(e,n)),n}},Qa=class{constructor(e){this.id=Dm++,this.code=e,this.usedTimes=0}};function Lm(i,e,t,n,s,r,o){let a=new Fi,l=new Ka,c=new Set,h=[],u=s.logarithmicDepthBuffer,p=s.vertexTextures,d=s.precision,_={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(g){return c.add(g),g===0?"uv":`uv${g}`}function m(g,x,N,O,z){let q=O.fog,H=z.geometry,G=g.isMeshStandardMaterial?O.environment:null,Q=(g.isMeshStandardMaterial?t:e).get(g.envMap||G),Z=Q&&Q.mapping===Rs?Q.image.height:null,U=_[g.type];g.precision!==null&&(d=s.getMaxPrecision(g.precision),d!==g.precision&&console.warn("THREE.WebGLProgram.getParameters:",g.precision,"not supported, using",d,"instead."));let y=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,R=y!==void 0?y.length:0,E=0;H.morphAttributes.position!==void 0&&(E=1),H.morphAttributes.normal!==void 0&&(E=2),H.morphAttributes.color!==void 0&&(E=3);let A,X,j,B;if(U){let Qe=dn[U];A=Qe.vertexShader,X=Qe.fragmentShader}else A=g.vertexShader,X=g.fragmentShader,l.update(g),j=l.getVertexShaderID(g),B=l.getFragmentShaderID(g);let V=i.getRenderTarget(),W=i.state.buffers.depth.getReversed(),te=z.isInstancedMesh===!0,Y=z.isBatchedMesh===!0,oe=!!g.map,se=!!g.matcap,L=!!Q,he=!!g.aoMap,ve=!!g.lightMap,ae=!!g.bumpMap,le=!!g.normalMap,Te=!!g.displacementMap,_e=!!g.emissiveMap,Ne=!!g.metalnessMap,tt=!!g.roughnessMap,nt=g.anisotropy>0,F=g.clearcoat>0,S=g.dispersion>0,ee=g.iridescence>0,ce=g.sheen>0,de=g.transmission>0,re=nt&&!!g.anisotropyMap,Ue=F&&!!g.clearcoatMap,xe=F&&!!g.clearcoatNormalMap,Pe=F&&!!g.clearcoatRoughnessMap,De=ee&&!!g.iridescenceMap,me=ee&&!!g.iridescenceThicknessMap,we=ce&&!!g.sheenColorMap,He=ce&&!!g.sheenRoughnessMap,Le=!!g.specularMap,be=!!g.specularColorMap,Xe=!!g.specularIntensityMap,J=de&&!!g.transmissionMap,ge=de&&!!g.thicknessMap,ye=!!g.gradientMap,Re=!!g.alphaMap,fe=g.alphaTest>0,ue=!!g.alphaHash,Ie=!!g.extensions,Ge=Cn;g.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(Ge=i.toneMapping);let ot={shaderID:U,shaderType:g.type,shaderName:g.name,vertexShader:A,fragmentShader:X,defines:g.defines,customVertexShaderID:j,customFragmentShaderID:B,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:d,batching:Y,batchingColor:Y&&z._colorsTexture!==null,instancing:te,instancingColor:te&&z.instanceColor!==null,instancingMorph:te&&z.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:V===null?i.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:ni,alphaToCoverage:!!g.alphaToCoverage,map:oe,matcap:se,envMap:L,envMapMode:L&&Q.mapping,envMapCubeUVHeight:Z,aoMap:he,lightMap:ve,bumpMap:ae,normalMap:le,displacementMap:p&&Te,emissiveMap:_e,normalMapObjectSpace:le&&g.normalMapType===hl,normalMapTangentSpace:le&&g.normalMapType===Pa,metalnessMap:Ne,roughnessMap:tt,anisotropy:nt,anisotropyMap:re,clearcoat:F,clearcoatMap:Ue,clearcoatNormalMap:xe,clearcoatRoughnessMap:Pe,dispersion:S,iridescence:ee,iridescenceMap:De,iridescenceThicknessMap:me,sheen:ce,sheenColorMap:we,sheenRoughnessMap:He,specularMap:Le,specularColorMap:be,specularIntensityMap:Xe,transmission:de,transmissionMap:J,thicknessMap:ge,gradientMap:ye,opaque:g.transparent===!1&&g.blending===ei&&g.alphaToCoverage===!1,alphaMap:Re,alphaTest:fe,alphaHash:ue,combine:g.combine,mapUv:oe&&v(g.map.channel),aoMapUv:he&&v(g.aoMap.channel),lightMapUv:ve&&v(g.lightMap.channel),bumpMapUv:ae&&v(g.bumpMap.channel),normalMapUv:le&&v(g.normalMap.channel),displacementMapUv:Te&&v(g.displacementMap.channel),emissiveMapUv:_e&&v(g.emissiveMap.channel),metalnessMapUv:Ne&&v(g.metalnessMap.channel),roughnessMapUv:tt&&v(g.roughnessMap.channel),anisotropyMapUv:re&&v(g.anisotropyMap.channel),clearcoatMapUv:Ue&&v(g.clearcoatMap.channel),clearcoatNormalMapUv:xe&&v(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pe&&v(g.clearcoatRoughnessMap.channel),iridescenceMapUv:De&&v(g.iridescenceMap.channel),iridescenceThicknessMapUv:me&&v(g.iridescenceThicknessMap.channel),sheenColorMapUv:we&&v(g.sheenColorMap.channel),sheenRoughnessMapUv:He&&v(g.sheenRoughnessMap.channel),specularMapUv:Le&&v(g.specularMap.channel),specularColorMapUv:be&&v(g.specularColorMap.channel),specularIntensityMapUv:Xe&&v(g.specularIntensityMap.channel),transmissionMapUv:J&&v(g.transmissionMap.channel),thicknessMapUv:ge&&v(g.thicknessMap.channel),alphaMapUv:Re&&v(g.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(le||nt),vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!H.attributes.uv&&(oe||Re),fog:!!q,useFog:g.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:g.flatShading===!0&&g.wireframe===!1,sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:W,skinning:z.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:R,morphTextureStride:E,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:g.dithering,shadowMapEnabled:i.shadowMap.enabled&&N.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ge,decodeVideoTexture:oe&&g.map.isVideoTexture===!0&&Je.getTransfer(g.map.colorSpace)===et,decodeVideoTextureEmissive:_e&&g.emissiveMap.isVideoTexture===!0&&Je.getTransfer(g.emissiveMap.colorSpace)===et,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===ft,flipSided:g.side===It,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:Ie&&g.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ie&&g.extensions.multiDraw===!0||Y)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return ot.vertexUv1s=c.has(1),ot.vertexUv2s=c.has(2),ot.vertexUv3s=c.has(3),c.clear(),ot}function f(g){let x=[];if(g.shaderID?x.push(g.shaderID):(x.push(g.customVertexShaderID),x.push(g.customFragmentShaderID)),g.defines!==void 0)for(let N in g.defines)x.push(N),x.push(g.defines[N]);return g.isRawShaderMaterial===!1&&(I(x,g),P(x,g),x.push(i.outputColorSpace)),x.push(g.customProgramCacheKey),x.join()}function I(g,x){g.push(x.precision),g.push(x.outputColorSpace),g.push(x.envMapMode),g.push(x.envMapCubeUVHeight),g.push(x.mapUv),g.push(x.alphaMapUv),g.push(x.lightMapUv),g.push(x.aoMapUv),g.push(x.bumpMapUv),g.push(x.normalMapUv),g.push(x.displacementMapUv),g.push(x.emissiveMapUv),g.push(x.metalnessMapUv),g.push(x.roughnessMapUv),g.push(x.anisotropyMapUv),g.push(x.clearcoatMapUv),g.push(x.clearcoatNormalMapUv),g.push(x.clearcoatRoughnessMapUv),g.push(x.iridescenceMapUv),g.push(x.iridescenceThicknessMapUv),g.push(x.sheenColorMapUv),g.push(x.sheenRoughnessMapUv),g.push(x.specularMapUv),g.push(x.specularColorMapUv),g.push(x.specularIntensityMapUv),g.push(x.transmissionMapUv),g.push(x.thicknessMapUv),g.push(x.combine),g.push(x.fogExp2),g.push(x.sizeAttenuation),g.push(x.morphTargetsCount),g.push(x.morphAttributeCount),g.push(x.numDirLights),g.push(x.numPointLights),g.push(x.numSpotLights),g.push(x.numSpotLightMaps),g.push(x.numHemiLights),g.push(x.numRectAreaLights),g.push(x.numDirLightShadows),g.push(x.numPointLightShadows),g.push(x.numSpotLightShadows),g.push(x.numSpotLightShadowsWithMaps),g.push(x.numLightProbes),g.push(x.shadowMapType),g.push(x.toneMapping),g.push(x.numClippingPlanes),g.push(x.numClipIntersection),g.push(x.depthPacking)}function P(g,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),x.gradientMap&&a.enable(22),g.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reversedDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),g.push(a.mask)}function M(g){let x=_[g.type],N;if(x){let O=dn[x];N=Ml.clone(O.uniforms)}else N=g.uniforms;return N}function C(g,x){let N;for(let O=0,z=h.length;O<z;O++){let q=h[O];if(q.cacheKey===x){N=q,++N.usedTimes;break}}return N===void 0&&(N=new Pm(i,x,g,r),h.push(N)),N}function b(g){if(--g.usedTimes===0){let x=h.indexOf(g);h[x]=h[h.length-1],h.pop(),g.destroy()}}function D(g){l.remove(g)}function w(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:M,acquireProgram:C,releaseProgram:b,releaseShaderCache:D,programs:h,dispose:w}}function Um(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Nm(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Gl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Wl(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,p,d,_,v,m){let f=i[e];return f===void 0?(f={id:u.id,object:u,geometry:p,material:d,groupOrder:_,renderOrder:u.renderOrder,z:v,group:m},i[e]=f):(f.id=u.id,f.object=u,f.geometry=p,f.material=d,f.groupOrder=_,f.renderOrder=u.renderOrder,f.z=v,f.group=m),e++,f}function a(u,p,d,_,v,m){let f=o(u,p,d,_,v,m);d.transmission>0?n.push(f):d.transparent===!0?s.push(f):t.push(f)}function l(u,p,d,_,v,m){let f=o(u,p,d,_,v,m);d.transmission>0?n.unshift(f):d.transparent===!0?s.unshift(f):t.unshift(f)}function c(u,p){t.length>1&&t.sort(u||Nm),n.length>1&&n.sort(p||Gl),s.length>1&&s.sort(p||Gl)}function h(){for(let u=e,p=i.length;u<p;u++){let d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function Fm(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Wl,i.set(n,[o])):s>=r.length?(o=new Wl,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Om(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new k,color:new Oe};break;case"SpotLight":t={position:new k,direction:new k,color:new Oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new Oe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new Oe,groundColor:new Oe};break;case"RectAreaLight":t={color:new Oe,position:new k,halfWidth:new k,halfHeight:new k};break}return i[e.id]=t,t}}}function Bm(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var zm=0;function Hm(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function km(i){let e=new Om,t=Bm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new k);let s=new k,r=new ut,o=new ut;function a(c){let h=0,u=0,p=0;for(let g=0;g<9;g++)n.probe[g].set(0,0,0);let d=0,_=0,v=0,m=0,f=0,I=0,P=0,M=0,C=0,b=0,D=0;c.sort(Hm);for(let g=0,x=c.length;g<x;g++){let N=c[g],O=N.color,z=N.intensity,q=N.distance,H=N.shadow&&N.shadow.map?N.shadow.map.texture:null;if(N.isAmbientLight)h+=O.r*z,u+=O.g*z,p+=O.b*z;else if(N.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(N.sh.coefficients[G],z);D++}else if(N.isDirectionalLight){let G=e.get(N);if(G.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let Q=N.shadow,Z=t.get(N);Z.shadowIntensity=Q.intensity,Z.shadowBias=Q.bias,Z.shadowNormalBias=Q.normalBias,Z.shadowRadius=Q.radius,Z.shadowMapSize=Q.mapSize,n.directionalShadow[d]=Z,n.directionalShadowMap[d]=H,n.directionalShadowMatrix[d]=N.shadow.matrix,I++}n.directional[d]=G,d++}else if(N.isSpotLight){let G=e.get(N);G.position.setFromMatrixPosition(N.matrixWorld),G.color.copy(O).multiplyScalar(z),G.distance=q,G.coneCos=Math.cos(N.angle),G.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),G.decay=N.decay,n.spot[v]=G;let Q=N.shadow;if(N.map&&(n.spotLightMap[C]=N.map,C++,Q.updateMatrices(N),N.castShadow&&b++),n.spotLightMatrix[v]=Q.matrix,N.castShadow){let Z=t.get(N);Z.shadowIntensity=Q.intensity,Z.shadowBias=Q.bias,Z.shadowNormalBias=Q.normalBias,Z.shadowRadius=Q.radius,Z.shadowMapSize=Q.mapSize,n.spotShadow[v]=Z,n.spotShadowMap[v]=H,M++}v++}else if(N.isRectAreaLight){let G=e.get(N);G.color.copy(O).multiplyScalar(z),G.halfWidth.set(N.width*.5,0,0),G.halfHeight.set(0,N.height*.5,0),n.rectArea[m]=G,m++}else if(N.isPointLight){let G=e.get(N);if(G.color.copy(N.color).multiplyScalar(N.intensity),G.distance=N.distance,G.decay=N.decay,N.castShadow){let Q=N.shadow,Z=t.get(N);Z.shadowIntensity=Q.intensity,Z.shadowBias=Q.bias,Z.shadowNormalBias=Q.normalBias,Z.shadowRadius=Q.radius,Z.shadowMapSize=Q.mapSize,Z.shadowCameraNear=Q.camera.near,Z.shadowCameraFar=Q.camera.far,n.pointShadow[_]=Z,n.pointShadowMap[_]=H,n.pointShadowMatrix[_]=N.shadow.matrix,P++}n.point[_]=G,_++}else if(N.isHemisphereLight){let G=e.get(N);G.skyColor.copy(N.color).multiplyScalar(z),G.groundColor.copy(N.groundColor).multiplyScalar(z),n.hemi[f]=G,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Se.LTC_FLOAT_1,n.rectAreaLTC2=Se.LTC_FLOAT_2):(n.rectAreaLTC1=Se.LTC_HALF_1,n.rectAreaLTC2=Se.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=p;let w=n.hash;(w.directionalLength!==d||w.pointLength!==_||w.spotLength!==v||w.rectAreaLength!==m||w.hemiLength!==f||w.numDirectionalShadows!==I||w.numPointShadows!==P||w.numSpotShadows!==M||w.numSpotMaps!==C||w.numLightProbes!==D)&&(n.directional.length=d,n.spot.length=v,n.rectArea.length=m,n.point.length=_,n.hemi.length=f,n.directionalShadow.length=I,n.directionalShadowMap.length=I,n.pointShadow.length=P,n.pointShadowMap.length=P,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=I,n.pointShadowMatrix.length=P,n.spotLightMatrix.length=M+C-b,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=D,w.directionalLength=d,w.pointLength=_,w.spotLength=v,w.rectAreaLength=m,w.hemiLength=f,w.numDirectionalShadows=I,w.numPointShadows=P,w.numSpotShadows=M,w.numSpotMaps=C,w.numLightProbes=D,n.version=zm++)}function l(c,h){let u=0,p=0,d=0,_=0,v=0,m=h.matrixWorldInverse;for(let f=0,I=c.length;f<I;f++){let P=c[f];if(P.isDirectionalLight){let M=n.directional[u];M.direction.setFromMatrixPosition(P.matrixWorld),s.setFromMatrixPosition(P.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),u++}else if(P.isSpotLight){let M=n.spot[d];M.position.setFromMatrixPosition(P.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(P.matrixWorld),s.setFromMatrixPosition(P.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),d++}else if(P.isRectAreaLight){let M=n.rectArea[_];M.position.setFromMatrixPosition(P.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(P.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(P.width*.5,0,0),M.halfHeight.set(0,P.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),_++}else if(P.isPointLight){let M=n.point[p];M.position.setFromMatrixPosition(P.matrixWorld),M.position.applyMatrix4(m),p++}else if(P.isHemisphereLight){let M=n.hemi[v];M.direction.setFromMatrixPosition(P.matrixWorld),M.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:n}}function Xl(i){let e=new km(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Vm(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Xl(i),e.set(s,[a])):r>=o.length?(a=new Xl(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var Gm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Wm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Xm(i,e,t){let n=new Bi,s=new Me,r=new Me,o=new dt,a=new Mr({depthPacking:ll}),l=new Sr,c={},h=t.maxTextureSize,u={[Sn]:It,[It]:Sn,[ft]:ft},p=new tn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Me},radius:{value:4}},vertexShader:Gm,fragmentShader:Wm}),d=p.clone();d.defines.HORIZONTAL_PASS=1;let _=new st;_.setAttribute("position",new Ct(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new mt(_,p),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_a;let f=this.type;this.render=function(b,D,w){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;let g=i.getRenderTarget(),x=i.getActiveCubeFace(),N=i.getActiveMipmapLevel(),O=i.state;O.setBlending(Rn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let z=f!==hn&&this.type===hn,q=f===hn&&this.type!==hn;for(let H=0,G=b.length;H<G;H++){let Q=b[H],Z=Q.shadow;if(Z===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(Z.autoUpdate===!1&&Z.needsUpdate===!1)continue;s.copy(Z.mapSize);let U=Z.getFrameExtents();if(s.multiply(U),r.copy(Z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/U.x),s.x=r.x*U.x,Z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/U.y),s.y=r.y*U.y,Z.mapSize.y=r.y)),Z.map===null||z===!0||q===!0){let R=this.type!==hn?{minFilter:Gt,magFilter:Gt}:{};Z.map!==null&&Z.map.dispose(),Z.map=new cn(s.x,s.y,R),Z.map.texture.name=Q.name+".shadowMap",Z.camera.updateProjectionMatrix()}i.setRenderTarget(Z.map),i.clear();let y=Z.getViewportCount();for(let R=0;R<y;R++){let E=Z.getViewport(R);o.set(r.x*E.x,r.y*E.y,r.x*E.z,r.y*E.w),O.viewport(o),Z.updateMatrices(Q,R),n=Z.getFrustum(),M(D,w,Z.camera,Q,this.type)}Z.isPointLightShadow!==!0&&this.type===hn&&I(Z,w),Z.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(g,x,N)};function I(b,D){let w=e.update(v);p.defines.VSM_SAMPLES!==b.blurSamples&&(p.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,p.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new cn(s.x,s.y)),p.uniforms.shadow_pass.value=b.map.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(D,null,w,p,v,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(D,null,w,d,v,null)}function P(b,D,w,g){let x=null,N=w.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(N!==void 0)x=N;else if(x=w.isPointLight===!0?l:a,i.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0||D.alphaToCoverage===!0){let O=x.uuid,z=D.uuid,q=c[O];q===void 0&&(q={},c[O]=q);let H=q[z];H===void 0&&(H=x.clone(),q[z]=H,D.addEventListener("dispose",C)),x=H}if(x.visible=D.visible,x.wireframe=D.wireframe,g===hn?x.side=D.shadowSide!==null?D.shadowSide:D.side:x.side=D.shadowSide!==null?D.shadowSide:u[D.side],x.alphaMap=D.alphaMap,x.alphaTest=D.alphaToCoverage===!0?.5:D.alphaTest,x.map=D.map,x.clipShadows=D.clipShadows,x.clippingPlanes=D.clippingPlanes,x.clipIntersection=D.clipIntersection,x.displacementMap=D.displacementMap,x.displacementScale=D.displacementScale,x.displacementBias=D.displacementBias,x.wireframeLinewidth=D.wireframeLinewidth,x.linewidth=D.linewidth,w.isPointLight===!0&&x.isMeshDistanceMaterial===!0){let O=i.properties.get(x);O.light=w}return x}function M(b,D,w,g,x){if(b.visible===!1)return;if(b.layers.test(D.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&x===hn)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,b.matrixWorld);let z=e.update(b),q=b.material;if(Array.isArray(q)){let H=z.groups;for(let G=0,Q=H.length;G<Q;G++){let Z=H[G],U=q[Z.materialIndex];if(U&&U.visible){let y=P(b,U,g,x);b.onBeforeShadow(i,b,D,w,z,y,Z),i.renderBufferDirect(w,null,z,y,b,Z),b.onAfterShadow(i,b,D,w,z,y,Z)}}}else if(q.visible){let H=P(b,q,g,x);b.onBeforeShadow(i,b,D,w,z,H,null),i.renderBufferDirect(w,null,z,H,b,null),b.onAfterShadow(i,b,D,w,z,H,null)}}let O=b.children;for(let z=0,q=O.length;z<q;z++)M(O[z],D,w,g,x)}function C(b){b.target.removeEventListener("dispose",C);for(let w in c){let g=c[w],x=b.target.uuid;x in g&&(g[x].dispose(),delete g[x])}}}var qm={[Ur]:Nr,[Fr]:zr,[Or]:Hr,[ti]:Br,[Nr]:Ur,[zr]:Fr,[Hr]:Or,[Br]:ti};function Ym(i,e){function t(){let J=!1,ge=new dt,ye=null,Re=new dt(0,0,0,0);return{setMask:function(fe){ye!==fe&&!J&&(i.colorMask(fe,fe,fe,fe),ye=fe)},setLocked:function(fe){J=fe},setClear:function(fe,ue,Ie,Ge,ot){ot===!0&&(fe*=Ge,ue*=Ge,Ie*=Ge),ge.set(fe,ue,Ie,Ge),Re.equals(ge)===!1&&(i.clearColor(fe,ue,Ie,Ge),Re.copy(ge))},reset:function(){J=!1,ye=null,Re.set(-1,0,0,0)}}}function n(){let J=!1,ge=!1,ye=null,Re=null,fe=null;return{setReversed:function(ue){if(ge!==ue){let Ie=e.get("EXT_clip_control");ue?Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.ZERO_TO_ONE_EXT):Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.NEGATIVE_ONE_TO_ONE_EXT),ge=ue;let Ge=fe;fe=null,this.setClear(Ge)}},getReversed:function(){return ge},setTest:function(ue){ue?V(i.DEPTH_TEST):W(i.DEPTH_TEST)},setMask:function(ue){ye!==ue&&!J&&(i.depthMask(ue),ye=ue)},setFunc:function(ue){if(ge&&(ue=qm[ue]),Re!==ue){switch(ue){case Ur:i.depthFunc(i.NEVER);break;case Nr:i.depthFunc(i.ALWAYS);break;case Fr:i.depthFunc(i.LESS);break;case ti:i.depthFunc(i.LEQUAL);break;case Or:i.depthFunc(i.EQUAL);break;case Br:i.depthFunc(i.GEQUAL);break;case zr:i.depthFunc(i.GREATER);break;case Hr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Re=ue}},setLocked:function(ue){J=ue},setClear:function(ue){fe!==ue&&(ge&&(ue=1-ue),i.clearDepth(ue),fe=ue)},reset:function(){J=!1,ye=null,Re=null,fe=null,ge=!1}}}function s(){let J=!1,ge=null,ye=null,Re=null,fe=null,ue=null,Ie=null,Ge=null,ot=null;return{setTest:function(Qe){J||(Qe?V(i.STENCIL_TEST):W(i.STENCIL_TEST))},setMask:function(Qe){ge!==Qe&&!J&&(i.stencilMask(Qe),ge=Qe)},setFunc:function(Qe,mn,an){(ye!==Qe||Re!==mn||fe!==an)&&(i.stencilFunc(Qe,mn,an),ye=Qe,Re=mn,fe=an)},setOp:function(Qe,mn,an){(ue!==Qe||Ie!==mn||Ge!==an)&&(i.stencilOp(Qe,mn,an),ue=Qe,Ie=mn,Ge=an)},setLocked:function(Qe){J=Qe},setClear:function(Qe){ot!==Qe&&(i.clearStencil(Qe),ot=Qe)},reset:function(){J=!1,ge=null,ye=null,Re=null,fe=null,ue=null,Ie=null,Ge=null,ot=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},p=new WeakMap,d=[],_=null,v=!1,m=null,f=null,I=null,P=null,M=null,C=null,b=null,D=new Oe(0,0,0),w=0,g=!1,x=null,N=null,O=null,z=null,q=null,H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),G=!1,Q=0,Z=i.getParameter(i.VERSION);Z.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(Z)[1]),G=Q>=1):Z.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),G=Q>=2);let U=null,y={},R=i.getParameter(i.SCISSOR_BOX),E=i.getParameter(i.VIEWPORT),A=new dt().fromArray(R),X=new dt().fromArray(E);function j(J,ge,ye,Re){let fe=new Uint8Array(4),ue=i.createTexture();i.bindTexture(J,ue),i.texParameteri(J,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(J,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ie=0;Ie<ye;Ie++)J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?i.texImage3D(ge,0,i.RGBA,1,1,Re,0,i.RGBA,i.UNSIGNED_BYTE,fe):i.texImage2D(ge+Ie,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,fe);return ue}let B={};B[i.TEXTURE_2D]=j(i.TEXTURE_2D,i.TEXTURE_2D,1),B[i.TEXTURE_CUBE_MAP]=j(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),B[i.TEXTURE_2D_ARRAY]=j(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),B[i.TEXTURE_3D]=j(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),V(i.DEPTH_TEST),o.setFunc(ti),ae(!1),le(ga),V(i.CULL_FACE),he(Rn);function V(J){h[J]!==!0&&(i.enable(J),h[J]=!0)}function W(J){h[J]!==!1&&(i.disable(J),h[J]=!1)}function te(J,ge){return u[J]!==ge?(i.bindFramebuffer(J,ge),u[J]=ge,J===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ge),J===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ge),!0):!1}function Y(J,ge){let ye=d,Re=!1;if(J){ye=p.get(ge),ye===void 0&&(ye=[],p.set(ge,ye));let fe=J.textures;if(ye.length!==fe.length||ye[0]!==i.COLOR_ATTACHMENT0){for(let ue=0,Ie=fe.length;ue<Ie;ue++)ye[ue]=i.COLOR_ATTACHMENT0+ue;ye.length=fe.length,Re=!0}}else ye[0]!==i.BACK&&(ye[0]=i.BACK,Re=!0);Re&&i.drawBuffers(ye)}function oe(J){return _!==J?(i.useProgram(J),_=J,!0):!1}let se={[zn]:i.FUNC_ADD,[Fc]:i.FUNC_SUBTRACT,[Oc]:i.FUNC_REVERSE_SUBTRACT};se[Bc]=i.MIN,se[zc]=i.MAX;let L={[Hc]:i.ZERO,[kc]:i.ONE,[Vc]:i.SRC_COLOR,[sr]:i.SRC_ALPHA,[Zc]:i.SRC_ALPHA_SATURATE,[qc]:i.DST_COLOR,[Wc]:i.DST_ALPHA,[Gc]:i.ONE_MINUS_SRC_COLOR,[rr]:i.ONE_MINUS_SRC_ALPHA,[Yc]:i.ONE_MINUS_DST_COLOR,[Xc]:i.ONE_MINUS_DST_ALPHA,[Jc]:i.CONSTANT_COLOR,[$c]:i.ONE_MINUS_CONSTANT_COLOR,[Kc]:i.CONSTANT_ALPHA,[Qc]:i.ONE_MINUS_CONSTANT_ALPHA};function he(J,ge,ye,Re,fe,ue,Ie,Ge,ot,Qe){if(J===Rn){v===!0&&(W(i.BLEND),v=!1);return}if(v===!1&&(V(i.BLEND),v=!0),J!==Nc){if(J!==m||Qe!==g){if((f!==zn||M!==zn)&&(i.blendEquation(i.FUNC_ADD),f=zn,M=zn),Qe)switch(J){case ei:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case xa:i.blendFunc(i.ONE,i.ONE);break;case ya:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case va:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",J);break}else switch(J){case ei:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case xa:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ya:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case va:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",J);break}I=null,P=null,C=null,b=null,D.set(0,0,0),w=0,m=J,g=Qe}return}fe=fe||ge,ue=ue||ye,Ie=Ie||Re,(ge!==f||fe!==M)&&(i.blendEquationSeparate(se[ge],se[fe]),f=ge,M=fe),(ye!==I||Re!==P||ue!==C||Ie!==b)&&(i.blendFuncSeparate(L[ye],L[Re],L[ue],L[Ie]),I=ye,P=Re,C=ue,b=Ie),(Ge.equals(D)===!1||ot!==w)&&(i.blendColor(Ge.r,Ge.g,Ge.b,ot),D.copy(Ge),w=ot),m=J,g=!1}function ve(J,ge){J.side===ft?W(i.CULL_FACE):V(i.CULL_FACE);let ye=J.side===It;ge&&(ye=!ye),ae(ye),J.blending===ei&&J.transparent===!1?he(Rn):he(J.blending,J.blendEquation,J.blendSrc,J.blendDst,J.blendEquationAlpha,J.blendSrcAlpha,J.blendDstAlpha,J.blendColor,J.blendAlpha,J.premultipliedAlpha),o.setFunc(J.depthFunc),o.setTest(J.depthTest),o.setMask(J.depthWrite),r.setMask(J.colorWrite);let Re=J.stencilWrite;a.setTest(Re),Re&&(a.setMask(J.stencilWriteMask),a.setFunc(J.stencilFunc,J.stencilRef,J.stencilFuncMask),a.setOp(J.stencilFail,J.stencilZFail,J.stencilZPass)),_e(J.polygonOffset,J.polygonOffsetFactor,J.polygonOffsetUnits),J.alphaToCoverage===!0?V(i.SAMPLE_ALPHA_TO_COVERAGE):W(i.SAMPLE_ALPHA_TO_COVERAGE)}function ae(J){x!==J&&(J?i.frontFace(i.CW):i.frontFace(i.CCW),x=J)}function le(J){J!==Lc?(V(i.CULL_FACE),J!==N&&(J===ga?i.cullFace(i.BACK):J===Uc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):W(i.CULL_FACE),N=J}function Te(J){J!==O&&(G&&i.lineWidth(J),O=J)}function _e(J,ge,ye){J?(V(i.POLYGON_OFFSET_FILL),(z!==ge||q!==ye)&&(i.polygonOffset(ge,ye),z=ge,q=ye)):W(i.POLYGON_OFFSET_FILL)}function Ne(J){J?V(i.SCISSOR_TEST):W(i.SCISSOR_TEST)}function tt(J){J===void 0&&(J=i.TEXTURE0+H-1),U!==J&&(i.activeTexture(J),U=J)}function nt(J,ge,ye){ye===void 0&&(U===null?ye=i.TEXTURE0+H-1:ye=U);let Re=y[ye];Re===void 0&&(Re={type:void 0,texture:void 0},y[ye]=Re),(Re.type!==J||Re.texture!==ge)&&(U!==ye&&(i.activeTexture(ye),U=ye),i.bindTexture(J,ge||B[J]),Re.type=J,Re.texture=ge)}function F(){let J=y[U];J!==void 0&&J.type!==void 0&&(i.bindTexture(J.type,null),J.type=void 0,J.texture=void 0)}function S(){try{i.compressedTexImage2D(...arguments)}catch(J){console.error("THREE.WebGLState:",J)}}function ee(){try{i.compressedTexImage3D(...arguments)}catch(J){console.error("THREE.WebGLState:",J)}}function ce(){try{i.texSubImage2D(...arguments)}catch(J){console.error("THREE.WebGLState:",J)}}function de(){try{i.texSubImage3D(...arguments)}catch(J){console.error("THREE.WebGLState:",J)}}function re(){try{i.compressedTexSubImage2D(...arguments)}catch(J){console.error("THREE.WebGLState:",J)}}function Ue(){try{i.compressedTexSubImage3D(...arguments)}catch(J){console.error("THREE.WebGLState:",J)}}function xe(){try{i.texStorage2D(...arguments)}catch(J){console.error("THREE.WebGLState:",J)}}function Pe(){try{i.texStorage3D(...arguments)}catch(J){console.error("THREE.WebGLState:",J)}}function De(){try{i.texImage2D(...arguments)}catch(J){console.error("THREE.WebGLState:",J)}}function me(){try{i.texImage3D(...arguments)}catch(J){console.error("THREE.WebGLState:",J)}}function we(J){A.equals(J)===!1&&(i.scissor(J.x,J.y,J.z,J.w),A.copy(J))}function He(J){X.equals(J)===!1&&(i.viewport(J.x,J.y,J.z,J.w),X.copy(J))}function Le(J,ge){let ye=c.get(ge);ye===void 0&&(ye=new WeakMap,c.set(ge,ye));let Re=ye.get(J);Re===void 0&&(Re=i.getUniformBlockIndex(ge,J.name),ye.set(J,Re))}function be(J,ge){let Re=c.get(ge).get(J);l.get(ge)!==Re&&(i.uniformBlockBinding(ge,Re,J.__bindingPointIndex),l.set(ge,Re))}function Xe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},U=null,y={},u={},p=new WeakMap,d=[],_=null,v=!1,m=null,f=null,I=null,P=null,M=null,C=null,b=null,D=new Oe(0,0,0),w=0,g=!1,x=null,N=null,O=null,z=null,q=null,A.set(0,0,i.canvas.width,i.canvas.height),X.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:V,disable:W,bindFramebuffer:te,drawBuffers:Y,useProgram:oe,setBlending:he,setMaterial:ve,setFlipSided:ae,setCullFace:le,setLineWidth:Te,setPolygonOffset:_e,setScissorTest:Ne,activeTexture:tt,bindTexture:nt,unbindTexture:F,compressedTexImage2D:S,compressedTexImage3D:ee,texImage2D:De,texImage3D:me,updateUBOMapping:Le,uniformBlockBinding:be,texStorage2D:xe,texStorage3D:Pe,texSubImage2D:ce,texSubImage3D:de,compressedTexSubImage2D:re,compressedTexSubImage3D:Ue,scissor:we,viewport:He,reset:Xe}}function Zm(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Me,h=new WeakMap,u,p=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(F,S){return d?new OffscreenCanvas(F,S):ls("canvas")}function v(F,S,ee){let ce=1,de=nt(F);if((de.width>ee||de.height>ee)&&(ce=ee/Math.max(de.width,de.height)),ce<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){let re=Math.floor(ce*de.width),Ue=Math.floor(ce*de.height);u===void 0&&(u=_(re,Ue));let xe=S?_(re,Ue):u;return xe.width=re,xe.height=Ue,xe.getContext("2d").drawImage(F,0,0,re,Ue),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+de.width+"x"+de.height+") to ("+re+"x"+Ue+")."),xe}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+de.width+"x"+de.height+")."),F;return F}function m(F){return F.generateMipmaps}function f(F){i.generateMipmap(F)}function I(F){return F.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:F.isWebGL3DRenderTarget?i.TEXTURE_3D:F.isWebGLArrayRenderTarget||F.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function P(F,S,ee,ce,de=!1){if(F!==null){if(i[F]!==void 0)return i[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let re=S;if(S===i.RED&&(ee===i.FLOAT&&(re=i.R32F),ee===i.HALF_FLOAT&&(re=i.R16F),ee===i.UNSIGNED_BYTE&&(re=i.R8)),S===i.RED_INTEGER&&(ee===i.UNSIGNED_BYTE&&(re=i.R8UI),ee===i.UNSIGNED_SHORT&&(re=i.R16UI),ee===i.UNSIGNED_INT&&(re=i.R32UI),ee===i.BYTE&&(re=i.R8I),ee===i.SHORT&&(re=i.R16I),ee===i.INT&&(re=i.R32I)),S===i.RG&&(ee===i.FLOAT&&(re=i.RG32F),ee===i.HALF_FLOAT&&(re=i.RG16F),ee===i.UNSIGNED_BYTE&&(re=i.RG8)),S===i.RG_INTEGER&&(ee===i.UNSIGNED_BYTE&&(re=i.RG8UI),ee===i.UNSIGNED_SHORT&&(re=i.RG16UI),ee===i.UNSIGNED_INT&&(re=i.RG32UI),ee===i.BYTE&&(re=i.RG8I),ee===i.SHORT&&(re=i.RG16I),ee===i.INT&&(re=i.RG32I)),S===i.RGB_INTEGER&&(ee===i.UNSIGNED_BYTE&&(re=i.RGB8UI),ee===i.UNSIGNED_SHORT&&(re=i.RGB16UI),ee===i.UNSIGNED_INT&&(re=i.RGB32UI),ee===i.BYTE&&(re=i.RGB8I),ee===i.SHORT&&(re=i.RGB16I),ee===i.INT&&(re=i.RGB32I)),S===i.RGBA_INTEGER&&(ee===i.UNSIGNED_BYTE&&(re=i.RGBA8UI),ee===i.UNSIGNED_SHORT&&(re=i.RGBA16UI),ee===i.UNSIGNED_INT&&(re=i.RGBA32UI),ee===i.BYTE&&(re=i.RGBA8I),ee===i.SHORT&&(re=i.RGBA16I),ee===i.INT&&(re=i.RGBA32I)),S===i.RGB&&(ee===i.UNSIGNED_INT_5_9_9_9_REV&&(re=i.RGB9_E5),ee===i.UNSIGNED_INT_10F_11F_11F_REV&&(re=i.R11F_G11F_B10F)),S===i.RGBA){let Ue=de?as:Je.getTransfer(ce);ee===i.FLOAT&&(re=i.RGBA32F),ee===i.HALF_FLOAT&&(re=i.RGBA16F),ee===i.UNSIGNED_BYTE&&(re=Ue===et?i.SRGB8_ALPHA8:i.RGBA8),ee===i.UNSIGNED_SHORT_4_4_4_4&&(re=i.RGBA4),ee===i.UNSIGNED_SHORT_5_5_5_1&&(re=i.RGB5_A1)}return(re===i.R16F||re===i.R32F||re===i.RG16F||re===i.RG32F||re===i.RGBA16F||re===i.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function M(F,S){let ee;return F?S===null||S===Wn||S===Vi?ee=i.DEPTH24_STENCIL8:S===un?ee=i.DEPTH32F_STENCIL8:S===Hi&&(ee=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Wn||S===Vi?ee=i.DEPTH_COMPONENT24:S===un?ee=i.DEPTH_COMPONENT32F:S===Hi&&(ee=i.DEPTH_COMPONENT16),ee}function C(F,S){return m(F)===!0||F.isFramebufferTexture&&F.minFilter!==Gt&&F.minFilter!==Qt?Math.log2(Math.max(S.width,S.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?S.mipmaps.length:1}function b(F){let S=F.target;S.removeEventListener("dispose",b),w(S),S.isVideoTexture&&h.delete(S)}function D(F){let S=F.target;S.removeEventListener("dispose",D),x(S)}function w(F){let S=n.get(F);if(S.__webglInit===void 0)return;let ee=F.source,ce=p.get(ee);if(ce){let de=ce[S.__cacheKey];de.usedTimes--,de.usedTimes===0&&g(F),Object.keys(ce).length===0&&p.delete(ee)}n.remove(F)}function g(F){let S=n.get(F);i.deleteTexture(S.__webglTexture);let ee=F.source,ce=p.get(ee);delete ce[S.__cacheKey],o.memory.textures--}function x(F){let S=n.get(F);if(F.depthTexture&&(F.depthTexture.dispose(),n.remove(F.depthTexture)),F.isWebGLCubeRenderTarget)for(let ce=0;ce<6;ce++){if(Array.isArray(S.__webglFramebuffer[ce]))for(let de=0;de<S.__webglFramebuffer[ce].length;de++)i.deleteFramebuffer(S.__webglFramebuffer[ce][de]);else i.deleteFramebuffer(S.__webglFramebuffer[ce]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[ce])}else{if(Array.isArray(S.__webglFramebuffer))for(let ce=0;ce<S.__webglFramebuffer.length;ce++)i.deleteFramebuffer(S.__webglFramebuffer[ce]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let ce=0;ce<S.__webglColorRenderbuffer.length;ce++)S.__webglColorRenderbuffer[ce]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[ce]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let ee=F.textures;for(let ce=0,de=ee.length;ce<de;ce++){let re=n.get(ee[ce]);re.__webglTexture&&(i.deleteTexture(re.__webglTexture),o.memory.textures--),n.remove(ee[ce])}n.remove(F)}let N=0;function O(){N=0}function z(){let F=N;return F>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+s.maxTextures),N+=1,F}function q(F){let S=[];return S.push(F.wrapS),S.push(F.wrapT),S.push(F.wrapR||0),S.push(F.magFilter),S.push(F.minFilter),S.push(F.anisotropy),S.push(F.internalFormat),S.push(F.format),S.push(F.type),S.push(F.generateMipmaps),S.push(F.premultiplyAlpha),S.push(F.flipY),S.push(F.unpackAlignment),S.push(F.colorSpace),S.join()}function H(F,S){let ee=n.get(F);if(F.isVideoTexture&&Ne(F),F.isRenderTargetTexture===!1&&F.isExternalTexture!==!0&&F.version>0&&ee.__version!==F.version){let ce=F.image;if(ce===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ce.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{B(ee,F,S);return}}else F.isExternalTexture&&(ee.__webglTexture=F.sourceTexture?F.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,ee.__webglTexture,i.TEXTURE0+S)}function G(F,S){let ee=n.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&ee.__version!==F.version){B(ee,F,S);return}t.bindTexture(i.TEXTURE_2D_ARRAY,ee.__webglTexture,i.TEXTURE0+S)}function Q(F,S){let ee=n.get(F);if(F.isRenderTargetTexture===!1&&F.version>0&&ee.__version!==F.version){B(ee,F,S);return}t.bindTexture(i.TEXTURE_3D,ee.__webglTexture,i.TEXTURE0+S)}function Z(F,S){let ee=n.get(F);if(F.version>0&&ee.__version!==F.version){V(ee,F,S);return}t.bindTexture(i.TEXTURE_CUBE_MAP,ee.__webglTexture,i.TEXTURE0+S)}let U={[or]:i.REPEAT,[Bn]:i.CLAMP_TO_EDGE,[ar]:i.MIRRORED_REPEAT},y={[Gt]:i.NEAREST,[al]:i.NEAREST_MIPMAP_NEAREST,[Cs]:i.NEAREST_MIPMAP_LINEAR,[Qt]:i.LINEAR,[Wr]:i.LINEAR_MIPMAP_NEAREST,[Gn]:i.LINEAR_MIPMAP_LINEAR},R={[ul]:i.NEVER,[_l]:i.ALWAYS,[dl]:i.LESS,[Da]:i.LEQUAL,[fl]:i.EQUAL,[gl]:i.GEQUAL,[pl]:i.GREATER,[ml]:i.NOTEQUAL};function E(F,S){if(S.type===un&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Qt||S.magFilter===Wr||S.magFilter===Cs||S.magFilter===Gn||S.minFilter===Qt||S.minFilter===Wr||S.minFilter===Cs||S.minFilter===Gn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(F,i.TEXTURE_WRAP_S,U[S.wrapS]),i.texParameteri(F,i.TEXTURE_WRAP_T,U[S.wrapT]),(F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY)&&i.texParameteri(F,i.TEXTURE_WRAP_R,U[S.wrapR]),i.texParameteri(F,i.TEXTURE_MAG_FILTER,y[S.magFilter]),i.texParameteri(F,i.TEXTURE_MIN_FILTER,y[S.minFilter]),S.compareFunction&&(i.texParameteri(F,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(F,i.TEXTURE_COMPARE_FUNC,R[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Gt||S.minFilter!==Cs&&S.minFilter!==Gn||S.type===un&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let ee=e.get("EXT_texture_filter_anisotropic");i.texParameterf(F,ee.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function A(F,S){let ee=!1;F.__webglInit===void 0&&(F.__webglInit=!0,S.addEventListener("dispose",b));let ce=S.source,de=p.get(ce);de===void 0&&(de={},p.set(ce,de));let re=q(S);if(re!==F.__cacheKey){de[re]===void 0&&(de[re]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,ee=!0),de[re].usedTimes++;let Ue=de[F.__cacheKey];Ue!==void 0&&(de[F.__cacheKey].usedTimes--,Ue.usedTimes===0&&g(S)),F.__cacheKey=re,F.__webglTexture=de[re].texture}return ee}function X(F,S,ee){return Math.floor(Math.floor(F/ee)/S)}function j(F,S,ee,ce){let re=F.updateRanges;if(re.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,ee,ce,S.data);else{re.sort((me,we)=>me.start-we.start);let Ue=0;for(let me=1;me<re.length;me++){let we=re[Ue],He=re[me],Le=we.start+we.count,be=X(He.start,S.width,4),Xe=X(we.start,S.width,4);He.start<=Le+1&&be===Xe&&X(He.start+He.count-1,S.width,4)===be?we.count=Math.max(we.count,He.start+He.count-we.start):(++Ue,re[Ue]=He)}re.length=Ue+1;let xe=i.getParameter(i.UNPACK_ROW_LENGTH),Pe=i.getParameter(i.UNPACK_SKIP_PIXELS),De=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let me=0,we=re.length;me<we;me++){let He=re[me],Le=Math.floor(He.start/4),be=Math.ceil(He.count/4),Xe=Le%S.width,J=Math.floor(Le/S.width),ge=be,ye=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Xe),i.pixelStorei(i.UNPACK_SKIP_ROWS,J),t.texSubImage2D(i.TEXTURE_2D,0,Xe,J,ge,ye,ee,ce,S.data)}F.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,xe),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Pe),i.pixelStorei(i.UNPACK_SKIP_ROWS,De)}}function B(F,S,ee){let ce=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(ce=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(ce=i.TEXTURE_3D);let de=A(F,S),re=S.source;t.bindTexture(ce,F.__webglTexture,i.TEXTURE0+ee);let Ue=n.get(re);if(re.version!==Ue.__version||de===!0){t.activeTexture(i.TEXTURE0+ee);let xe=Je.getPrimaries(Je.workingColorSpace),Pe=S.colorSpace===In?null:Je.getPrimaries(S.colorSpace),De=S.colorSpace===In||xe===Pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);let me=v(S.image,!1,s.maxTextureSize);me=tt(S,me);let we=r.convert(S.format,S.colorSpace),He=r.convert(S.type),Le=P(S.internalFormat,we,He,S.colorSpace,S.isVideoTexture);E(ce,S);let be,Xe=S.mipmaps,J=S.isVideoTexture!==!0,ge=Ue.__version===void 0||de===!0,ye=re.dataReady,Re=C(S,me);if(S.isDepthTexture)Le=M(S.format===Gi,S.type),ge&&(J?t.texStorage2D(i.TEXTURE_2D,1,Le,me.width,me.height):t.texImage2D(i.TEXTURE_2D,0,Le,me.width,me.height,0,we,He,null));else if(S.isDataTexture)if(Xe.length>0){J&&ge&&t.texStorage2D(i.TEXTURE_2D,Re,Le,Xe[0].width,Xe[0].height);for(let fe=0,ue=Xe.length;fe<ue;fe++)be=Xe[fe],J?ye&&t.texSubImage2D(i.TEXTURE_2D,fe,0,0,be.width,be.height,we,He,be.data):t.texImage2D(i.TEXTURE_2D,fe,Le,be.width,be.height,0,we,He,be.data);S.generateMipmaps=!1}else J?(ge&&t.texStorage2D(i.TEXTURE_2D,Re,Le,me.width,me.height),ye&&j(S,me,we,He)):t.texImage2D(i.TEXTURE_2D,0,Le,me.width,me.height,0,we,He,me.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){J&&ge&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Re,Le,Xe[0].width,Xe[0].height,me.depth);for(let fe=0,ue=Xe.length;fe<ue;fe++)if(be=Xe[fe],S.format!==qt)if(we!==null)if(J){if(ye)if(S.layerUpdates.size>0){let Ie=Ha(be.width,be.height,S.format,S.type);for(let Ge of S.layerUpdates){let ot=be.data.subarray(Ge*Ie/be.data.BYTES_PER_ELEMENT,(Ge+1)*Ie/be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,fe,0,0,Ge,be.width,be.height,1,we,ot)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,fe,0,0,0,be.width,be.height,me.depth,we,be.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,fe,Le,be.width,be.height,me.depth,0,be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else J?ye&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,fe,0,0,0,be.width,be.height,me.depth,we,He,be.data):t.texImage3D(i.TEXTURE_2D_ARRAY,fe,Le,be.width,be.height,me.depth,0,we,He,be.data)}else{J&&ge&&t.texStorage2D(i.TEXTURE_2D,Re,Le,Xe[0].width,Xe[0].height);for(let fe=0,ue=Xe.length;fe<ue;fe++)be=Xe[fe],S.format!==qt?we!==null?J?ye&&t.compressedTexSubImage2D(i.TEXTURE_2D,fe,0,0,be.width,be.height,we,be.data):t.compressedTexImage2D(i.TEXTURE_2D,fe,Le,be.width,be.height,0,be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):J?ye&&t.texSubImage2D(i.TEXTURE_2D,fe,0,0,be.width,be.height,we,He,be.data):t.texImage2D(i.TEXTURE_2D,fe,Le,be.width,be.height,0,we,He,be.data)}else if(S.isDataArrayTexture)if(J){if(ge&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Re,Le,me.width,me.height,me.depth),ye)if(S.layerUpdates.size>0){let fe=Ha(me.width,me.height,S.format,S.type);for(let ue of S.layerUpdates){let Ie=me.data.subarray(ue*fe/me.data.BYTES_PER_ELEMENT,(ue+1)*fe/me.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ue,me.width,me.height,1,we,He,Ie)}S.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,me.width,me.height,me.depth,we,He,me.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Le,me.width,me.height,me.depth,0,we,He,me.data);else if(S.isData3DTexture)J?(ge&&t.texStorage3D(i.TEXTURE_3D,Re,Le,me.width,me.height,me.depth),ye&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,me.width,me.height,me.depth,we,He,me.data)):t.texImage3D(i.TEXTURE_3D,0,Le,me.width,me.height,me.depth,0,we,He,me.data);else if(S.isFramebufferTexture){if(ge)if(J)t.texStorage2D(i.TEXTURE_2D,Re,Le,me.width,me.height);else{let fe=me.width,ue=me.height;for(let Ie=0;Ie<Re;Ie++)t.texImage2D(i.TEXTURE_2D,Ie,Le,fe,ue,0,we,He,null),fe>>=1,ue>>=1}}else if(Xe.length>0){if(J&&ge){let fe=nt(Xe[0]);t.texStorage2D(i.TEXTURE_2D,Re,Le,fe.width,fe.height)}for(let fe=0,ue=Xe.length;fe<ue;fe++)be=Xe[fe],J?ye&&t.texSubImage2D(i.TEXTURE_2D,fe,0,0,we,He,be):t.texImage2D(i.TEXTURE_2D,fe,Le,we,He,be);S.generateMipmaps=!1}else if(J){if(ge){let fe=nt(me);t.texStorage2D(i.TEXTURE_2D,Re,Le,fe.width,fe.height)}ye&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,we,He,me)}else t.texImage2D(i.TEXTURE_2D,0,Le,we,He,me);m(S)&&f(ce),Ue.__version=re.version,S.onUpdate&&S.onUpdate(S)}F.__version=S.version}function V(F,S,ee){if(S.image.length!==6)return;let ce=A(F,S),de=S.source;t.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+ee);let re=n.get(de);if(de.version!==re.__version||ce===!0){t.activeTexture(i.TEXTURE0+ee);let Ue=Je.getPrimaries(Je.workingColorSpace),xe=S.colorSpace===In?null:Je.getPrimaries(S.colorSpace),Pe=S.colorSpace===In||Ue===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe);let De=S.isCompressedTexture||S.image[0].isCompressedTexture,me=S.image[0]&&S.image[0].isDataTexture,we=[];for(let ue=0;ue<6;ue++)!De&&!me?we[ue]=v(S.image[ue],!0,s.maxCubemapSize):we[ue]=me?S.image[ue].image:S.image[ue],we[ue]=tt(S,we[ue]);let He=we[0],Le=r.convert(S.format,S.colorSpace),be=r.convert(S.type),Xe=P(S.internalFormat,Le,be,S.colorSpace),J=S.isVideoTexture!==!0,ge=re.__version===void 0||ce===!0,ye=de.dataReady,Re=C(S,He);E(i.TEXTURE_CUBE_MAP,S);let fe;if(De){J&&ge&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Re,Xe,He.width,He.height);for(let ue=0;ue<6;ue++){fe=we[ue].mipmaps;for(let Ie=0;Ie<fe.length;Ie++){let Ge=fe[Ie];S.format!==qt?Le!==null?J?ye&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Ie,0,0,Ge.width,Ge.height,Le,Ge.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Ie,Xe,Ge.width,Ge.height,0,Ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):J?ye&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Ie,0,0,Ge.width,Ge.height,Le,be,Ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Ie,Xe,Ge.width,Ge.height,0,Le,be,Ge.data)}}}else{if(fe=S.mipmaps,J&&ge){fe.length>0&&Re++;let ue=nt(we[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Re,Xe,ue.width,ue.height)}for(let ue=0;ue<6;ue++)if(me){J?ye&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,we[ue].width,we[ue].height,Le,be,we[ue].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,Xe,we[ue].width,we[ue].height,0,Le,be,we[ue].data);for(let Ie=0;Ie<fe.length;Ie++){let ot=fe[Ie].image[ue].image;J?ye&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Ie+1,0,0,ot.width,ot.height,Le,be,ot.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Ie+1,Xe,ot.width,ot.height,0,Le,be,ot.data)}}else{J?ye&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,Le,be,we[ue]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,Xe,Le,be,we[ue]);for(let Ie=0;Ie<fe.length;Ie++){let Ge=fe[Ie];J?ye&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Ie+1,0,0,Le,be,Ge.image[ue]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Ie+1,Xe,Le,be,Ge.image[ue])}}}m(S)&&f(i.TEXTURE_CUBE_MAP),re.__version=de.version,S.onUpdate&&S.onUpdate(S)}F.__version=S.version}function W(F,S,ee,ce,de,re){let Ue=r.convert(ee.format,ee.colorSpace),xe=r.convert(ee.type),Pe=P(ee.internalFormat,Ue,xe,ee.colorSpace),De=n.get(S),me=n.get(ee);if(me.__renderTarget=S,!De.__hasExternalTextures){let we=Math.max(1,S.width>>re),He=Math.max(1,S.height>>re);de===i.TEXTURE_3D||de===i.TEXTURE_2D_ARRAY?t.texImage3D(de,re,Pe,we,He,S.depth,0,Ue,xe,null):t.texImage2D(de,re,Pe,we,He,0,Ue,xe,null)}t.bindFramebuffer(i.FRAMEBUFFER,F),_e(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ce,de,me.__webglTexture,0,Te(S)):(de===i.TEXTURE_2D||de>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&de<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ce,de,me.__webglTexture,re),t.bindFramebuffer(i.FRAMEBUFFER,null)}function te(F,S,ee){if(i.bindRenderbuffer(i.RENDERBUFFER,F),S.depthBuffer){let ce=S.depthTexture,de=ce&&ce.isDepthTexture?ce.type:null,re=M(S.stencilBuffer,de),Ue=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xe=Te(S);_e(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,xe,re,S.width,S.height):ee?i.renderbufferStorageMultisample(i.RENDERBUFFER,xe,re,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,re,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ue,i.RENDERBUFFER,F)}else{let ce=S.textures;for(let de=0;de<ce.length;de++){let re=ce[de],Ue=r.convert(re.format,re.colorSpace),xe=r.convert(re.type),Pe=P(re.internalFormat,Ue,xe,re.colorSpace),De=Te(S);ee&&_e(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,De,Pe,S.width,S.height):_e(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,De,Pe,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Pe,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Y(F,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,F),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let ce=n.get(S.depthTexture);ce.__renderTarget=S,(!ce.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),H(S.depthTexture,0);let de=ce.__webglTexture,re=Te(S);if(S.depthTexture.format===Pi)_e(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,de,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,de,0);else if(S.depthTexture.format===Gi)_e(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,de,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,de,0);else throw new Error("Unknown depthTexture format")}function oe(F){let S=n.get(F),ee=F.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==F.depthTexture){let ce=F.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),ce){let de=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,ce.removeEventListener("dispose",de)};ce.addEventListener("dispose",de),S.__depthDisposeCallback=de}S.__boundDepthTexture=ce}if(F.depthTexture&&!S.__autoAllocateDepthBuffer){if(ee)throw new Error("target.depthTexture not supported in Cube render targets");let ce=F.texture.mipmaps;ce&&ce.length>0?Y(S.__webglFramebuffer[0],F):Y(S.__webglFramebuffer,F)}else if(ee){S.__webglDepthbuffer=[];for(let ce=0;ce<6;ce++)if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[ce]),S.__webglDepthbuffer[ce]===void 0)S.__webglDepthbuffer[ce]=i.createRenderbuffer(),te(S.__webglDepthbuffer[ce],F,!1);else{let de=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=S.__webglDepthbuffer[ce];i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,de,i.RENDERBUFFER,re)}}else{let ce=F.texture.mipmaps;if(ce&&ce.length>0?t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),te(S.__webglDepthbuffer,F,!1);else{let de=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,de,i.RENDERBUFFER,re)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function se(F,S,ee){let ce=n.get(F);S!==void 0&&W(ce.__webglFramebuffer,F,F.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),ee!==void 0&&oe(F)}function L(F){let S=F.texture,ee=n.get(F),ce=n.get(S);F.addEventListener("dispose",D);let de=F.textures,re=F.isWebGLCubeRenderTarget===!0,Ue=de.length>1;if(Ue||(ce.__webglTexture===void 0&&(ce.__webglTexture=i.createTexture()),ce.__version=S.version,o.memory.textures++),re){ee.__webglFramebuffer=[];for(let xe=0;xe<6;xe++)if(S.mipmaps&&S.mipmaps.length>0){ee.__webglFramebuffer[xe]=[];for(let Pe=0;Pe<S.mipmaps.length;Pe++)ee.__webglFramebuffer[xe][Pe]=i.createFramebuffer()}else ee.__webglFramebuffer[xe]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){ee.__webglFramebuffer=[];for(let xe=0;xe<S.mipmaps.length;xe++)ee.__webglFramebuffer[xe]=i.createFramebuffer()}else ee.__webglFramebuffer=i.createFramebuffer();if(Ue)for(let xe=0,Pe=de.length;xe<Pe;xe++){let De=n.get(de[xe]);De.__webglTexture===void 0&&(De.__webglTexture=i.createTexture(),o.memory.textures++)}if(F.samples>0&&_e(F)===!1){ee.__webglMultisampledFramebuffer=i.createFramebuffer(),ee.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,ee.__webglMultisampledFramebuffer);for(let xe=0;xe<de.length;xe++){let Pe=de[xe];ee.__webglColorRenderbuffer[xe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,ee.__webglColorRenderbuffer[xe]);let De=r.convert(Pe.format,Pe.colorSpace),me=r.convert(Pe.type),we=P(Pe.internalFormat,De,me,Pe.colorSpace,F.isXRRenderTarget===!0),He=Te(F);i.renderbufferStorageMultisample(i.RENDERBUFFER,He,we,F.width,F.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.RENDERBUFFER,ee.__webglColorRenderbuffer[xe])}i.bindRenderbuffer(i.RENDERBUFFER,null),F.depthBuffer&&(ee.__webglDepthRenderbuffer=i.createRenderbuffer(),te(ee.__webglDepthRenderbuffer,F,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(re){t.bindTexture(i.TEXTURE_CUBE_MAP,ce.__webglTexture),E(i.TEXTURE_CUBE_MAP,S);for(let xe=0;xe<6;xe++)if(S.mipmaps&&S.mipmaps.length>0)for(let Pe=0;Pe<S.mipmaps.length;Pe++)W(ee.__webglFramebuffer[xe][Pe],F,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Pe);else W(ee.__webglFramebuffer[xe],F,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0);m(S)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ue){for(let xe=0,Pe=de.length;xe<Pe;xe++){let De=de[xe],me=n.get(De),we=i.TEXTURE_2D;(F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(we=F.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(we,me.__webglTexture),E(we,De),W(ee.__webglFramebuffer,F,De,i.COLOR_ATTACHMENT0+xe,we,0),m(De)&&f(we)}t.unbindTexture()}else{let xe=i.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(xe=F.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(xe,ce.__webglTexture),E(xe,S),S.mipmaps&&S.mipmaps.length>0)for(let Pe=0;Pe<S.mipmaps.length;Pe++)W(ee.__webglFramebuffer[Pe],F,S,i.COLOR_ATTACHMENT0,xe,Pe);else W(ee.__webglFramebuffer,F,S,i.COLOR_ATTACHMENT0,xe,0);m(S)&&f(xe),t.unbindTexture()}F.depthBuffer&&oe(F)}function he(F){let S=F.textures;for(let ee=0,ce=S.length;ee<ce;ee++){let de=S[ee];if(m(de)){let re=I(F),Ue=n.get(de).__webglTexture;t.bindTexture(re,Ue),f(re),t.unbindTexture()}}}let ve=[],ae=[];function le(F){if(F.samples>0){if(_e(F)===!1){let S=F.textures,ee=F.width,ce=F.height,de=i.COLOR_BUFFER_BIT,re=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ue=n.get(F),xe=S.length>1;if(xe)for(let De=0;De<S.length;De++)t.bindFramebuffer(i.FRAMEBUFFER,Ue.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+De,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ue.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+De,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ue.__webglMultisampledFramebuffer);let Pe=F.texture.mipmaps;Pe&&Pe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ue.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ue.__webglFramebuffer);for(let De=0;De<S.length;De++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(de|=i.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(de|=i.STENCIL_BUFFER_BIT)),xe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ue.__webglColorRenderbuffer[De]);let me=n.get(S[De]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,me,0)}i.blitFramebuffer(0,0,ee,ce,0,0,ee,ce,de,i.NEAREST),l===!0&&(ve.length=0,ae.length=0,ve.push(i.COLOR_ATTACHMENT0+De),F.depthBuffer&&F.resolveDepthBuffer===!1&&(ve.push(re),ae.push(re),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ae)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ve))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),xe)for(let De=0;De<S.length;De++){t.bindFramebuffer(i.FRAMEBUFFER,Ue.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+De,i.RENDERBUFFER,Ue.__webglColorRenderbuffer[De]);let me=n.get(S[De]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ue.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+De,i.TEXTURE_2D,me,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ue.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&l){let S=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function Te(F){return Math.min(s.maxSamples,F.samples)}function _e(F){let S=n.get(F);return F.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Ne(F){let S=o.render.frame;h.get(F)!==S&&(h.set(F,S),F.update())}function tt(F,S){let ee=F.colorSpace,ce=F.format,de=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||ee!==ni&&ee!==In&&(Je.getTransfer(ee)===et?(ce!==qt||de!==on)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",ee)),S}function nt(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(c.width=F.naturalWidth||F.width,c.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(c.width=F.displayWidth,c.height=F.displayHeight):(c.width=F.width,c.height=F.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=O,this.setTexture2D=H,this.setTexture2DArray=G,this.setTexture3D=Q,this.setTextureCube=Z,this.rebindTextures=se,this.setupRenderTarget=L,this.updateRenderTargetMipmap=he,this.updateMultisampleRenderTarget=le,this.setupDepthRenderbuffer=oe,this.setupFrameBufferTexture=W,this.useMultisampledRTT=_e}function Jm(i,e){function t(n,s=In){let r,o=Je.getTransfer(s);if(n===on)return i.UNSIGNED_BYTE;if(n===qr)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Yr)return i.UNSIGNED_SHORT_5_5_5_1;if(n===wa)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ta)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ba)return i.BYTE;if(n===Ea)return i.SHORT;if(n===Hi)return i.UNSIGNED_SHORT;if(n===Xr)return i.INT;if(n===Wn)return i.UNSIGNED_INT;if(n===un)return i.FLOAT;if(n===ki)return i.HALF_FLOAT;if(n===Aa)return i.ALPHA;if(n===Ra)return i.RGB;if(n===qt)return i.RGBA;if(n===Pi)return i.DEPTH_COMPONENT;if(n===Gi)return i.DEPTH_STENCIL;if(n===Ca)return i.RED;if(n===Zr)return i.RED_INTEGER;if(n===Ia)return i.RG;if(n===Jr)return i.RG_INTEGER;if(n===$r)return i.RGBA_INTEGER;if(n===Is||n===Ps||n===Ds||n===Ls)if(o===et)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Is)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ps)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ds)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ls)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Is)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ps)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ds)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ls)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Kr||n===Qr||n===jr||n===eo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Kr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===jr)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===eo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===to||n===no||n===io)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===to||n===no)return o===et?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===io)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===so||n===ro||n===oo||n===ao||n===co||n===lo||n===ho||n===uo||n===fo||n===po||n===mo||n===go||n===_o||n===xo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===so)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ro)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===oo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ao)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===co)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===lo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ho)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===uo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===fo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===po)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===mo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===go)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===_o)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===xo)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===yo||n===vo||n===Mo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===yo)return o===et?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===vo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Mo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===So||n===bo||n===Eo||n===wo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===So)return r.COMPRESSED_RED_RGTC1_EXT;if(n===bo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Eo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===wo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Vi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var $m=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Km=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,ja=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new xs(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new tn({vertexShader:$m,fragmentShader:Km,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new mt(new rn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ec=class extends bn{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,p=null,d=null,_=null,v=typeof XRWebGLBinding<"u",m=new ja,f={},I=t.getContextAttributes(),P=null,M=null,C=[],b=[],D=new Me,w=null,g=new Et;g.viewport=new dt;let x=new Et;x.viewport=new dt;let N=[g,x],O=new Dr,z=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let V=C[B];return V===void 0&&(V=new Oi,C[B]=V),V.getTargetRaySpace()},this.getControllerGrip=function(B){let V=C[B];return V===void 0&&(V=new Oi,C[B]=V),V.getGripSpace()},this.getHand=function(B){let V=C[B];return V===void 0&&(V=new Oi,C[B]=V),V.getHandSpace()};function H(B){let V=b.indexOf(B.inputSource);if(V===-1)return;let W=C[V];W!==void 0&&(W.update(B.inputSource,B.frame,c||o),W.dispatchEvent({type:B.type,data:B.inputSource}))}function G(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",Q);for(let B=0;B<C.length;B++){let V=b[B];V!==null&&(b[B]=null,C[B].disconnect(V))}z=null,q=null,m.reset();for(let B in f)delete f[B];e.setRenderTarget(P),d=null,p=null,u=null,s=null,M=null,j.stop(),n.isPresenting=!1,e.setPixelRatio(w),e.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){r=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){a=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return p!==null?p:d},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(B){if(s=B,s!==null){if(P=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",G),s.addEventListener("inputsourceschange",Q),I.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(D),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let W=null,te=null,Y=null;I.depth&&(Y=I.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,W=I.stencil?Gi:Pi,te=I.stencil?Vi:Wn);let oe={colorFormat:t.RGBA8,depthFormat:Y,scaleFactor:r};u=this.getBinding(),p=u.createProjectionLayer(oe),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),M=new cn(p.textureWidth,p.textureHeight,{format:qt,type:on,depthTexture:new _s(p.textureWidth,p.textureHeight,te,void 0,void 0,void 0,void 0,void 0,void 0,W),stencilBuffer:I.stencil,colorSpace:e.outputColorSpace,samples:I.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{let W={antialias:I.antialias,alpha:!0,depth:I.depth,stencil:I.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,W),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new cn(d.framebufferWidth,d.framebufferHeight,{format:qt,type:on,colorSpace:e.outputColorSpace,stencilBuffer:I.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),j.setContext(s),j.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Q(B){for(let V=0;V<B.removed.length;V++){let W=B.removed[V],te=b.indexOf(W);te>=0&&(b[te]=null,C[te].disconnect(W))}for(let V=0;V<B.added.length;V++){let W=B.added[V],te=b.indexOf(W);if(te===-1){for(let oe=0;oe<C.length;oe++)if(oe>=b.length){b.push(W),te=oe;break}else if(b[oe]===null){b[oe]=W,te=oe;break}if(te===-1)break}let Y=C[te];Y&&Y.connect(W)}}let Z=new k,U=new k;function y(B,V,W){Z.setFromMatrixPosition(V.matrixWorld),U.setFromMatrixPosition(W.matrixWorld);let te=Z.distanceTo(U),Y=V.projectionMatrix.elements,oe=W.projectionMatrix.elements,se=Y[14]/(Y[10]-1),L=Y[14]/(Y[10]+1),he=(Y[9]+1)/Y[5],ve=(Y[9]-1)/Y[5],ae=(Y[8]-1)/Y[0],le=(oe[8]+1)/oe[0],Te=se*ae,_e=se*le,Ne=te/(-ae+le),tt=Ne*-ae;if(V.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(tt),B.translateZ(Ne),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert(),Y[10]===-1)B.projectionMatrix.copy(V.projectionMatrix),B.projectionMatrixInverse.copy(V.projectionMatrixInverse);else{let nt=se+Ne,F=L+Ne,S=Te-tt,ee=_e+(te-tt),ce=he*L/F*nt,de=ve*L/F*nt;B.projectionMatrix.makePerspective(S,ee,ce,de,nt,F),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}}function R(B,V){V===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(V.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(s===null)return;let V=B.near,W=B.far;m.texture!==null&&(m.depthNear>0&&(V=m.depthNear),m.depthFar>0&&(W=m.depthFar)),O.near=x.near=g.near=V,O.far=x.far=g.far=W,(z!==O.near||q!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),z=O.near,q=O.far),O.layers.mask=B.layers.mask|6,g.layers.mask=O.layers.mask&3,x.layers.mask=O.layers.mask&5;let te=B.parent,Y=O.cameras;R(O,te);for(let oe=0;oe<Y.length;oe++)R(Y[oe],te);Y.length===2?y(O,g,x):O.projectionMatrix.copy(g.projectionMatrix),E(B,O,te)};function E(B,V,W){W===null?B.matrix.copy(V.matrixWorld):(B.matrix.copy(W.matrixWorld),B.matrix.invert(),B.matrix.multiply(V.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(V.projectionMatrix),B.projectionMatrixInverse.copy(V.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=Di*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(p===null&&d===null))return l},this.setFoveation=function(B){l=B,p!==null&&(p.fixedFoveation=B),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=B)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function(B){return f[B]};let A=null;function X(B,V){if(h=V.getViewerPose(c||o),_=V,h!==null){let W=h.views;d!==null&&(e.setRenderTargetFramebuffer(M,d.framebuffer),e.setRenderTarget(M));let te=!1;W.length!==O.cameras.length&&(O.cameras.length=0,te=!0);for(let L=0;L<W.length;L++){let he=W[L],ve=null;if(d!==null)ve=d.getViewport(he);else{let le=u.getViewSubImage(p,he);ve=le.viewport,L===0&&(e.setRenderTargetTextures(M,le.colorTexture,le.depthStencilTexture),e.setRenderTarget(M))}let ae=N[L];ae===void 0&&(ae=new Et,ae.layers.enable(L),ae.viewport=new dt,N[L]=ae),ae.matrix.fromArray(he.transform.matrix),ae.matrix.decompose(ae.position,ae.quaternion,ae.scale),ae.projectionMatrix.fromArray(he.projectionMatrix),ae.projectionMatrixInverse.copy(ae.projectionMatrix).invert(),ae.viewport.set(ve.x,ve.y,ve.width,ve.height),L===0&&(O.matrix.copy(ae.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),te===!0&&O.cameras.push(ae)}let Y=s.enabledFeatures;if(Y&&Y.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=n.getBinding();let L=u.getDepthInformation(W[0]);L&&L.isValid&&L.texture&&m.init(L,s.renderState)}if(Y&&Y.includes("camera-access")&&v){e.state.unbindTexture(),u=n.getBinding();for(let L=0;L<W.length;L++){let he=W[L].camera;if(he){let ve=f[he];ve||(ve=new xs,f[he]=ve);let ae=u.getCameraImage(he);ve.sourceTexture=ae}}}}for(let W=0;W<C.length;W++){let te=b[W],Y=C[W];te!==null&&Y!==void 0&&Y.update(te,V,c||o)}A&&A(B,V),V.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:V}),_=null}let j=new ql;j.setAnimationLoop(X),this.setAnimationLoop=function(B){A=B},this.dispose=function(){}}},di=new jt,Qm=new ut;function jm(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Fa(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,I,P,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),p(m,f),f.isMeshPhysicalMaterial&&d(m,f,M)):f.isMeshMatcapMaterial?(r(m,f),_(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),v(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,I,P):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===It&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===It&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let I=e.get(f),P=I.envMap,M=I.envMapRotation;P&&(m.envMap.value=P,di.copy(M),di.x*=-1,di.y*=-1,di.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),m.envMapRotation.value.setFromMatrix4(Qm.makeRotationFromEuler(di)),m.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,I,P){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*I,m.scale.value=P*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function p(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function d(m,f,I){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===It&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=I.texture,m.transmissionSamplerSize.value.set(I.width,I.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,f){f.matcap&&(m.matcap.value=f.matcap)}function v(m,f){let I=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(I.matrixWorld),m.nearDistance.value=I.shadow.camera.near,m.farDistance.value=I.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function eg(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(I,P){let M=P.program;n.uniformBlockBinding(I,M)}function c(I,P){let M=s[I.id];M===void 0&&(_(I),M=h(I),s[I.id]=M,I.addEventListener("dispose",m));let C=P.program;n.updateUBOMapping(I,C);let b=e.render.frame;r[I.id]!==b&&(p(I),r[I.id]=b)}function h(I){let P=u();I.__bindingPointIndex=P;let M=i.createBuffer(),C=I.__size,b=I.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,C,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,P,M),M}function u(){for(let I=0;I<a;I++)if(o.indexOf(I)===-1)return o.push(I),I;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(I){let P=s[I.id],M=I.uniforms,C=I.__cache;i.bindBuffer(i.UNIFORM_BUFFER,P);for(let b=0,D=M.length;b<D;b++){let w=Array.isArray(M[b])?M[b]:[M[b]];for(let g=0,x=w.length;g<x;g++){let N=w[g];if(d(N,b,g,C)===!0){let O=N.__offset,z=Array.isArray(N.value)?N.value:[N.value],q=0;for(let H=0;H<z.length;H++){let G=z[H],Q=v(G);typeof G=="number"||typeof G=="boolean"?(N.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,O+q,N.__data)):G.isMatrix3?(N.__data[0]=G.elements[0],N.__data[1]=G.elements[1],N.__data[2]=G.elements[2],N.__data[3]=0,N.__data[4]=G.elements[3],N.__data[5]=G.elements[4],N.__data[6]=G.elements[5],N.__data[7]=0,N.__data[8]=G.elements[6],N.__data[9]=G.elements[7],N.__data[10]=G.elements[8],N.__data[11]=0):(G.toArray(N.__data,q),q+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,N.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(I,P,M,C){let b=I.value,D=P+"_"+M;if(C[D]===void 0)return typeof b=="number"||typeof b=="boolean"?C[D]=b:C[D]=b.clone(),!0;{let w=C[D];if(typeof b=="number"||typeof b=="boolean"){if(w!==b)return C[D]=b,!0}else if(w.equals(b)===!1)return w.copy(b),!0}return!1}function _(I){let P=I.uniforms,M=0,C=16;for(let D=0,w=P.length;D<w;D++){let g=Array.isArray(P[D])?P[D]:[P[D]];for(let x=0,N=g.length;x<N;x++){let O=g[x],z=Array.isArray(O.value)?O.value:[O.value];for(let q=0,H=z.length;q<H;q++){let G=z[q],Q=v(G),Z=M%C,U=Z%Q.boundary,y=Z+U;M+=U,y!==0&&C-y<Q.storage&&(M+=C-y),O.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=M,M+=Q.storage}}}let b=M%C;return b>0&&(M+=C-b),I.__size=M,I.__cache={},this}function v(I){let P={boundary:0,storage:0};return typeof I=="number"||typeof I=="boolean"?(P.boundary=4,P.storage=4):I.isVector2?(P.boundary=8,P.storage=8):I.isVector3||I.isColor?(P.boundary=16,P.storage=12):I.isVector4?(P.boundary=16,P.storage=16):I.isMatrix3?(P.boundary=48,P.storage=48):I.isMatrix4?(P.boundary=64,P.storage=64):I.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",I),P}function m(I){let P=I.target;P.removeEventListener("dispose",m);let M=o.indexOf(P.__bindingPointIndex);o.splice(M,1),i.deleteBuffer(s[P.id]),delete s[P.id],delete r[P.id]}function f(){for(let I in s)i.deleteBuffer(s[I]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}var Io=class{constructor(e={}){let{canvas:t=xl(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;let _=new Uint32Array(4),v=new Int32Array(4),m=null,f=null,I=[],P=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Cn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let M=this,C=!1;this._outputColorSpace=Rt;let b=0,D=0,w=null,g=-1,x=null,N=new dt,O=new dt,z=null,q=new Oe(0),H=0,G=t.width,Q=t.height,Z=1,U=null,y=null,R=new dt(0,0,G,Q),E=new dt(0,0,G,Q),A=!1,X=new Bi,j=!1,B=!1,V=new ut,W=new k,te=new dt,Y={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},oe=!1;function se(){return w===null?Z:1}let L=n;function he(T,$){return t.getContext(T,$)}try{let T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",ye,!1),t.addEventListener("webglcontextrestored",Re,!1),t.addEventListener("webglcontextcreationerror",fe,!1),L===null){let $="webgl2";if(L=he($,T),L===null)throw he($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let ve,ae,le,Te,_e,Ne,tt,nt,F,S,ee,ce,de,re,Ue,xe,Pe,De,me,we,He,Le,be,Xe;function J(){ve=new xp(L),ve.init(),Le=new Jm(L,ve),ae=new up(L,ve,e,Le),le=new Ym(L,ve),ae.reversedDepthBuffer&&p&&le.buffers.depth.setReversed(!0),Te=new Mp(L),_e=new Um,Ne=new Zm(L,ve,le,_e,ae,Le,Te),tt=new fp(M),nt=new _p(M),F=new Tu(L),be=new lp(L,F),S=new yp(L,F,Te,be),ee=new bp(L,S,F,Te),me=new Sp(L,ae,Ne),xe=new dp(_e),ce=new Lm(M,tt,nt,ve,ae,be,xe),de=new jm(M,_e),re=new Fm,Ue=new Vm(ve),De=new cp(M,tt,nt,le,ee,d,l),Pe=new Xm(M,ee,ae),Xe=new eg(L,Te,ae,le),we=new hp(L,ve,Te),He=new vp(L,ve,Te),Te.programs=ce.programs,M.capabilities=ae,M.extensions=ve,M.properties=_e,M.renderLists=re,M.shadowMap=Pe,M.state=le,M.info=Te}J();let ge=new ec(M,L);this.xr=ge,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let T=ve.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=ve.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(T){T!==void 0&&(Z=T,this.setSize(G,Q,!1))},this.getSize=function(T){return T.set(G,Q)},this.setSize=function(T,$,ne=!0){if(ge.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=T,Q=$,t.width=Math.floor(T*Z),t.height=Math.floor($*Z),ne===!0&&(t.style.width=T+"px",t.style.height=$+"px"),this.setViewport(0,0,T,$)},this.getDrawingBufferSize=function(T){return T.set(G*Z,Q*Z).floor()},this.setDrawingBufferSize=function(T,$,ne){G=T,Q=$,Z=ne,t.width=Math.floor(T*ne),t.height=Math.floor($*ne),this.setViewport(0,0,T,$)},this.getCurrentViewport=function(T){return T.copy(N)},this.getViewport=function(T){return T.copy(R)},this.setViewport=function(T,$,ne,ie){T.isVector4?R.set(T.x,T.y,T.z,T.w):R.set(T,$,ne,ie),le.viewport(N.copy(R).multiplyScalar(Z).round())},this.getScissor=function(T){return T.copy(E)},this.setScissor=function(T,$,ne,ie){T.isVector4?E.set(T.x,T.y,T.z,T.w):E.set(T,$,ne,ie),le.scissor(O.copy(E).multiplyScalar(Z).round())},this.getScissorTest=function(){return A},this.setScissorTest=function(T){le.setScissorTest(A=T)},this.setOpaqueSort=function(T){U=T},this.setTransparentSort=function(T){y=T},this.getClearColor=function(T){return T.copy(De.getClearColor())},this.setClearColor=function(){De.setClearColor(...arguments)},this.getClearAlpha=function(){return De.getClearAlpha()},this.setClearAlpha=function(){De.setClearAlpha(...arguments)},this.clear=function(T=!0,$=!0,ne=!0){let ie=0;if(T){let K=!1;if(w!==null){let pe=w.texture.format;K=pe===$r||pe===Jr||pe===Zr}if(K){let pe=w.texture.type,Ee=pe===on||pe===Wn||pe===Hi||pe===Vi||pe===qr||pe===Yr,Ce=De.getClearColor(),Ae=De.getClearAlpha(),ze=Ce.r,ke=Ce.g,Fe=Ce.b;Ee?(_[0]=ze,_[1]=ke,_[2]=Fe,_[3]=Ae,L.clearBufferuiv(L.COLOR,0,_)):(v[0]=ze,v[1]=ke,v[2]=Fe,v[3]=Ae,L.clearBufferiv(L.COLOR,0,v))}else ie|=L.COLOR_BUFFER_BIT}$&&(ie|=L.DEPTH_BUFFER_BIT),ne&&(ie|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ye,!1),t.removeEventListener("webglcontextrestored",Re,!1),t.removeEventListener("webglcontextcreationerror",fe,!1),De.dispose(),re.dispose(),Ue.dispose(),_e.dispose(),tt.dispose(),nt.dispose(),ee.dispose(),be.dispose(),Xe.dispose(),ce.dispose(),ge.dispose(),ge.removeEventListener("sessionstart",an),ge.removeEventListener("sessionend",ic),Yn.stop()};function ye(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function Re(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;let T=Te.autoReset,$=Pe.enabled,ne=Pe.autoUpdate,ie=Pe.needsUpdate,K=Pe.type;J(),Te.autoReset=T,Pe.enabled=$,Pe.autoUpdate=ne,Pe.needsUpdate=ie,Pe.type=K}function fe(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ue(T){let $=T.target;$.removeEventListener("dispose",ue),Ie($)}function Ie(T){Ge(T),_e.remove(T)}function Ge(T){let $=_e.get(T).programs;$!==void 0&&($.forEach(function(ne){ce.releaseProgram(ne)}),T.isShaderMaterial&&ce.releaseShaderCache(T))}this.renderBufferDirect=function(T,$,ne,ie,K,pe){$===null&&($=Y);let Ee=K.isMesh&&K.matrixWorld.determinant()<0,Ce=sh(T,$,ne,ie,K);le.setMaterial(ie,Ee);let Ae=ne.index,ze=1;if(ie.wireframe===!0){if(Ae=S.getWireframeAttribute(ne),Ae===void 0)return;ze=2}let ke=ne.drawRange,Fe=ne.attributes.position,Ze=ke.start*ze,it=(ke.start+ke.count)*ze;pe!==null&&(Ze=Math.max(Ze,pe.start*ze),it=Math.min(it,(pe.start+pe.count)*ze)),Ae!==null?(Ze=Math.max(Ze,0),it=Math.min(it,Ae.count)):Fe!=null&&(Ze=Math.max(Ze,0),it=Math.min(it,Fe.count));let pt=it-Ze;if(pt<0||pt===1/0)return;be.setup(K,ie,Ce,ne,Ae);let at,rt=we;if(Ae!==null&&(at=F.get(Ae),rt=He,rt.setIndex(at)),K.isMesh)ie.wireframe===!0?(le.setLineWidth(ie.wireframeLinewidth*se()),rt.setMode(L.LINES)):rt.setMode(L.TRIANGLES);else if(K.isLine){let Be=ie.linewidth;Be===void 0&&(Be=1),le.setLineWidth(Be*se()),K.isLineSegments?rt.setMode(L.LINES):K.isLineLoop?rt.setMode(L.LINE_LOOP):rt.setMode(L.LINE_STRIP)}else K.isPoints?rt.setMode(L.POINTS):K.isSprite&&rt.setMode(L.TRIANGLES);if(K.isBatchedMesh)if(K._multiDrawInstances!==null)Li("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),rt.renderMultiDrawInstances(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount,K._multiDrawInstances);else if(ve.get("WEBGL_multi_draw"))rt.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{let Be=K._multiDrawStarts,lt=K._multiDrawCounts,$e=K._multiDrawCount,Lt=Ae?F.get(Ae).bytesPerElement:1,gi=_e.get(ie).currentProgram.getUniforms();for(let Ut=0;Ut<$e;Ut++)gi.setValue(L,"_gl_DrawID",Ut),rt.render(Be[Ut]/Lt,lt[Ut])}else if(K.isInstancedMesh)rt.renderInstances(Ze,pt,K.count);else if(ne.isInstancedBufferGeometry){let Be=ne._maxInstanceCount!==void 0?ne._maxInstanceCount:1/0,lt=Math.min(ne.instanceCount,Be);rt.renderInstances(Ze,pt,lt)}else rt.render(Ze,pt)};function ot(T,$,ne){T.transparent===!0&&T.side===ft&&T.forceSinglePass===!1?(T.side=It,T.needsUpdate=!0,Os(T,$,ne),T.side=Sn,T.needsUpdate=!0,Os(T,$,ne),T.side=ft):Os(T,$,ne)}this.compile=function(T,$,ne=null){ne===null&&(ne=T),f=Ue.get(ne),f.init($),P.push(f),ne.traverseVisible(function(K){K.isLight&&K.layers.test($.layers)&&(f.pushLight(K),K.castShadow&&f.pushShadow(K))}),T!==ne&&T.traverseVisible(function(K){K.isLight&&K.layers.test($.layers)&&(f.pushLight(K),K.castShadow&&f.pushShadow(K))}),f.setupLights();let ie=new Set;return T.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;let pe=K.material;if(pe)if(Array.isArray(pe))for(let Ee=0;Ee<pe.length;Ee++){let Ce=pe[Ee];ot(Ce,ne,K),ie.add(Ce)}else ot(pe,ne,K),ie.add(pe)}),f=P.pop(),ie},this.compileAsync=function(T,$,ne=null){let ie=this.compile(T,$,ne);return new Promise(K=>{function pe(){if(ie.forEach(function(Ee){_e.get(Ee).currentProgram.isReady()&&ie.delete(Ee)}),ie.size===0){K(T);return}setTimeout(pe,10)}ve.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let Qe=null;function mn(T){Qe&&Qe(T)}function an(){Yn.stop()}function ic(){Yn.start()}let Yn=new ql;Yn.setAnimationLoop(mn),typeof self<"u"&&Yn.setContext(self),this.setAnimationLoop=function(T){Qe=T,ge.setAnimationLoop(T),T===null?Yn.stop():Yn.start()},ge.addEventListener("sessionstart",an),ge.addEventListener("sessionend",ic),this.render=function(T,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),ge.enabled===!0&&ge.isPresenting===!0&&(ge.cameraAutoUpdate===!0&&ge.updateCamera($),$=ge.getCamera()),T.isScene===!0&&T.onBeforeRender(M,T,$,w),f=Ue.get(T,P.length),f.init($),P.push(f),V.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),X.setFromProjectionMatrix(V,Kt,$.reversedDepth),B=this.localClippingEnabled,j=xe.init(this.clippingPlanes,B),m=re.get(T,I.length),m.init(),I.push(m),ge.enabled===!0&&ge.isPresenting===!0){let pe=M.xr.getDepthSensingMesh();pe!==null&&Uo(pe,$,-1/0,M.sortObjects)}Uo(T,$,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(U,y),oe=ge.enabled===!1||ge.isPresenting===!1||ge.hasDepthSensing()===!1,oe&&De.addToRenderList(m,T),this.info.render.frame++,j===!0&&xe.beginShadows();let ne=f.state.shadowsArray;Pe.render(ne,T,$),j===!0&&xe.endShadows(),this.info.autoReset===!0&&this.info.reset();let ie=m.opaque,K=m.transmissive;if(f.setupLights(),$.isArrayCamera){let pe=$.cameras;if(K.length>0)for(let Ee=0,Ce=pe.length;Ee<Ce;Ee++){let Ae=pe[Ee];rc(ie,K,T,Ae)}oe&&De.render(T);for(let Ee=0,Ce=pe.length;Ee<Ce;Ee++){let Ae=pe[Ee];sc(m,T,Ae,Ae.viewport)}}else K.length>0&&rc(ie,K,T,$),oe&&De.render(T),sc(m,T,$);w!==null&&D===0&&(Ne.updateMultisampleRenderTarget(w),Ne.updateRenderTargetMipmap(w)),T.isScene===!0&&T.onAfterRender(M,T,$),be.resetDefaultState(),g=-1,x=null,P.pop(),P.length>0?(f=P[P.length-1],j===!0&&xe.setGlobalState(M.clippingPlanes,f.state.camera)):f=null,I.pop(),I.length>0?m=I[I.length-1]:m=null};function Uo(T,$,ne,ie){if(T.visible===!1)return;if(T.layers.test($.layers)){if(T.isGroup)ne=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update($);else if(T.isLight)f.pushLight(T),T.castShadow&&f.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||X.intersectsSprite(T)){ie&&te.setFromMatrixPosition(T.matrixWorld).applyMatrix4(V);let Ee=ee.update(T),Ce=T.material;Ce.visible&&m.push(T,Ee,Ce,ne,te.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||X.intersectsObject(T))){let Ee=ee.update(T),Ce=T.material;if(ie&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),te.copy(T.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),te.copy(Ee.boundingSphere.center)),te.applyMatrix4(T.matrixWorld).applyMatrix4(V)),Array.isArray(Ce)){let Ae=Ee.groups;for(let ze=0,ke=Ae.length;ze<ke;ze++){let Fe=Ae[ze],Ze=Ce[Fe.materialIndex];Ze&&Ze.visible&&m.push(T,Ee,Ze,ne,te.z,Fe)}}else Ce.visible&&m.push(T,Ee,Ce,ne,te.z,null)}}let pe=T.children;for(let Ee=0,Ce=pe.length;Ee<Ce;Ee++)Uo(pe[Ee],$,ne,ie)}function sc(T,$,ne,ie){let K=T.opaque,pe=T.transmissive,Ee=T.transparent;f.setupLightsView(ne),j===!0&&xe.setGlobalState(M.clippingPlanes,ne),ie&&le.viewport(N.copy(ie)),K.length>0&&Fs(K,$,ne),pe.length>0&&Fs(pe,$,ne),Ee.length>0&&Fs(Ee,$,ne),le.buffers.depth.setTest(!0),le.buffers.depth.setMask(!0),le.buffers.color.setMask(!0),le.setPolygonOffset(!1)}function rc(T,$,ne,ie){if((ne.isScene===!0?ne.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[ie.id]===void 0&&(f.state.transmissionRenderTarget[ie.id]=new cn(1,1,{generateMipmaps:!0,type:ve.has("EXT_color_buffer_half_float")||ve.has("EXT_color_buffer_float")?ki:on,minFilter:Gn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));let pe=f.state.transmissionRenderTarget[ie.id],Ee=ie.viewport||N;pe.setSize(Ee.z*M.transmissionResolutionScale,Ee.w*M.transmissionResolutionScale);let Ce=M.getRenderTarget(),Ae=M.getActiveCubeFace(),ze=M.getActiveMipmapLevel();M.setRenderTarget(pe),M.getClearColor(q),H=M.getClearAlpha(),H<1&&M.setClearColor(16777215,.5),M.clear(),oe&&De.render(ne);let ke=M.toneMapping;M.toneMapping=Cn;let Fe=ie.viewport;if(ie.viewport!==void 0&&(ie.viewport=void 0),f.setupLightsView(ie),j===!0&&xe.setGlobalState(M.clippingPlanes,ie),Fs(T,ne,ie),Ne.updateMultisampleRenderTarget(pe),Ne.updateRenderTargetMipmap(pe),ve.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let it=0,pt=$.length;it<pt;it++){let at=$[it],rt=at.object,Be=at.geometry,lt=at.material,$e=at.group;if(lt.side===ft&&rt.layers.test(ie.layers)){let Lt=lt.side;lt.side=It,lt.needsUpdate=!0,oc(rt,ne,ie,Be,lt,$e),lt.side=Lt,lt.needsUpdate=!0,Ze=!0}}Ze===!0&&(Ne.updateMultisampleRenderTarget(pe),Ne.updateRenderTargetMipmap(pe))}M.setRenderTarget(Ce,Ae,ze),M.setClearColor(q,H),Fe!==void 0&&(ie.viewport=Fe),M.toneMapping=ke}function Fs(T,$,ne){let ie=$.isScene===!0?$.overrideMaterial:null;for(let K=0,pe=T.length;K<pe;K++){let Ee=T[K],Ce=Ee.object,Ae=Ee.geometry,ze=Ee.group,ke=Ee.material;ke.allowOverride===!0&&ie!==null&&(ke=ie),Ce.layers.test(ne.layers)&&oc(Ce,$,ne,Ae,ke,ze)}}function oc(T,$,ne,ie,K,pe){T.onBeforeRender(M,$,ne,ie,K,pe),T.modelViewMatrix.multiplyMatrices(ne.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),K.onBeforeRender(M,$,ne,ie,T,pe),K.transparent===!0&&K.side===ft&&K.forceSinglePass===!1?(K.side=It,K.needsUpdate=!0,M.renderBufferDirect(ne,$,ie,K,T,pe),K.side=Sn,K.needsUpdate=!0,M.renderBufferDirect(ne,$,ie,K,T,pe),K.side=ft):M.renderBufferDirect(ne,$,ie,K,T,pe),T.onAfterRender(M,$,ne,ie,K,pe)}function Os(T,$,ne){$.isScene!==!0&&($=Y);let ie=_e.get(T),K=f.state.lights,pe=f.state.shadowsArray,Ee=K.state.version,Ce=ce.getParameters(T,K.state,pe,$,ne),Ae=ce.getProgramCacheKey(Ce),ze=ie.programs;ie.environment=T.isMeshStandardMaterial?$.environment:null,ie.fog=$.fog,ie.envMap=(T.isMeshStandardMaterial?nt:tt).get(T.envMap||ie.environment),ie.envMapRotation=ie.environment!==null&&T.envMap===null?$.environmentRotation:T.envMapRotation,ze===void 0&&(T.addEventListener("dispose",ue),ze=new Map,ie.programs=ze);let ke=ze.get(Ae);if(ke!==void 0){if(ie.currentProgram===ke&&ie.lightsStateVersion===Ee)return cc(T,Ce),ke}else Ce.uniforms=ce.getUniforms(T),T.onBeforeCompile(Ce,M),ke=ce.acquireProgram(Ce,Ae),ze.set(Ae,ke),ie.uniforms=Ce.uniforms;let Fe=ie.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Fe.clippingPlanes=xe.uniform),cc(T,Ce),ie.needsLights=oh(T),ie.lightsStateVersion=Ee,ie.needsLights&&(Fe.ambientLightColor.value=K.state.ambient,Fe.lightProbe.value=K.state.probe,Fe.directionalLights.value=K.state.directional,Fe.directionalLightShadows.value=K.state.directionalShadow,Fe.spotLights.value=K.state.spot,Fe.spotLightShadows.value=K.state.spotShadow,Fe.rectAreaLights.value=K.state.rectArea,Fe.ltc_1.value=K.state.rectAreaLTC1,Fe.ltc_2.value=K.state.rectAreaLTC2,Fe.pointLights.value=K.state.point,Fe.pointLightShadows.value=K.state.pointShadow,Fe.hemisphereLights.value=K.state.hemi,Fe.directionalShadowMap.value=K.state.directionalShadowMap,Fe.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Fe.spotShadowMap.value=K.state.spotShadowMap,Fe.spotLightMatrix.value=K.state.spotLightMatrix,Fe.spotLightMap.value=K.state.spotLightMap,Fe.pointShadowMap.value=K.state.pointShadowMap,Fe.pointShadowMatrix.value=K.state.pointShadowMatrix),ie.currentProgram=ke,ie.uniformsList=null,ke}function ac(T){if(T.uniformsList===null){let $=T.currentProgram.getUniforms();T.uniformsList=Yi.seqWithValue($.seq,T.uniforms)}return T.uniformsList}function cc(T,$){let ne=_e.get(T);ne.outputColorSpace=$.outputColorSpace,ne.batching=$.batching,ne.batchingColor=$.batchingColor,ne.instancing=$.instancing,ne.instancingColor=$.instancingColor,ne.instancingMorph=$.instancingMorph,ne.skinning=$.skinning,ne.morphTargets=$.morphTargets,ne.morphNormals=$.morphNormals,ne.morphColors=$.morphColors,ne.morphTargetsCount=$.morphTargetsCount,ne.numClippingPlanes=$.numClippingPlanes,ne.numIntersection=$.numClipIntersection,ne.vertexAlphas=$.vertexAlphas,ne.vertexTangents=$.vertexTangents,ne.toneMapping=$.toneMapping}function sh(T,$,ne,ie,K){$.isScene!==!0&&($=Y),Ne.resetTextureUnits();let pe=$.fog,Ee=ie.isMeshStandardMaterial?$.environment:null,Ce=w===null?M.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:ni,Ae=(ie.isMeshStandardMaterial?nt:tt).get(ie.envMap||Ee),ze=ie.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,ke=!!ne.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),Fe=!!ne.morphAttributes.position,Ze=!!ne.morphAttributes.normal,it=!!ne.morphAttributes.color,pt=Cn;ie.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(pt=M.toneMapping);let at=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,rt=at!==void 0?at.length:0,Be=_e.get(ie),lt=f.state.lights;if(j===!0&&(B===!0||T!==x)){let Tt=T===x&&ie.id===g;xe.setState(ie,T,Tt)}let $e=!1;ie.version===Be.__version?(Be.needsLights&&Be.lightsStateVersion!==lt.state.version||Be.outputColorSpace!==Ce||K.isBatchedMesh&&Be.batching===!1||!K.isBatchedMesh&&Be.batching===!0||K.isBatchedMesh&&Be.batchingColor===!0&&K.colorTexture===null||K.isBatchedMesh&&Be.batchingColor===!1&&K.colorTexture!==null||K.isInstancedMesh&&Be.instancing===!1||!K.isInstancedMesh&&Be.instancing===!0||K.isSkinnedMesh&&Be.skinning===!1||!K.isSkinnedMesh&&Be.skinning===!0||K.isInstancedMesh&&Be.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&Be.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&Be.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&Be.instancingMorph===!1&&K.morphTexture!==null||Be.envMap!==Ae||ie.fog===!0&&Be.fog!==pe||Be.numClippingPlanes!==void 0&&(Be.numClippingPlanes!==xe.numPlanes||Be.numIntersection!==xe.numIntersection)||Be.vertexAlphas!==ze||Be.vertexTangents!==ke||Be.morphTargets!==Fe||Be.morphNormals!==Ze||Be.morphColors!==it||Be.toneMapping!==pt||Be.morphTargetsCount!==rt)&&($e=!0):($e=!0,Be.__version=ie.version);let Lt=Be.currentProgram;$e===!0&&(Lt=Os(ie,$,K));let gi=!1,Ut=!1,Ki=!1,ht=Lt.getUniforms(),zt=Be.uniforms;if(le.useProgram(Lt.program)&&(gi=!0,Ut=!0,Ki=!0),ie.id!==g&&(g=ie.id,Ut=!0),gi||x!==T){le.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),ht.setValue(L,"projectionMatrix",T.projectionMatrix),ht.setValue(L,"viewMatrix",T.matrixWorldInverse);let Pt=ht.map.cameraPosition;Pt!==void 0&&Pt.setValue(L,W.setFromMatrixPosition(T.matrixWorld)),ae.logarithmicDepthBuffer&&ht.setValue(L,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&ht.setValue(L,"isOrthographic",T.isOrthographicCamera===!0),x!==T&&(x=T,Ut=!0,Ki=!0)}if(K.isSkinnedMesh){ht.setOptional(L,K,"bindMatrix"),ht.setOptional(L,K,"bindMatrixInverse");let Tt=K.skeleton;Tt&&(Tt.boneTexture===null&&Tt.computeBoneTexture(),ht.setValue(L,"boneTexture",Tt.boneTexture,Ne))}K.isBatchedMesh&&(ht.setOptional(L,K,"batchingTexture"),ht.setValue(L,"batchingTexture",K._matricesTexture,Ne),ht.setOptional(L,K,"batchingIdTexture"),ht.setValue(L,"batchingIdTexture",K._indirectTexture,Ne),ht.setOptional(L,K,"batchingColorTexture"),K._colorsTexture!==null&&ht.setValue(L,"batchingColorTexture",K._colorsTexture,Ne));let Ht=ne.morphAttributes;if((Ht.position!==void 0||Ht.normal!==void 0||Ht.color!==void 0)&&me.update(K,ne,Lt),(Ut||Be.receiveShadow!==K.receiveShadow)&&(Be.receiveShadow=K.receiveShadow,ht.setValue(L,"receiveShadow",K.receiveShadow)),ie.isMeshGouraudMaterial&&ie.envMap!==null&&(zt.envMap.value=Ae,zt.flipEnvMap.value=Ae.isCubeTexture&&Ae.isRenderTargetTexture===!1?-1:1),ie.isMeshStandardMaterial&&ie.envMap===null&&$.environment!==null&&(zt.envMapIntensity.value=$.environmentIntensity),Ut&&(ht.setValue(L,"toneMappingExposure",M.toneMappingExposure),Be.needsLights&&rh(zt,Ki),pe&&ie.fog===!0&&de.refreshFogUniforms(zt,pe),de.refreshMaterialUniforms(zt,ie,Z,Q,f.state.transmissionRenderTarget[T.id]),Yi.upload(L,ac(Be),zt,Ne)),ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(Yi.upload(L,ac(Be),zt,Ne),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&ht.setValue(L,"center",K.center),ht.setValue(L,"modelViewMatrix",K.modelViewMatrix),ht.setValue(L,"normalMatrix",K.normalMatrix),ht.setValue(L,"modelMatrix",K.matrixWorld),ie.isShaderMaterial||ie.isRawShaderMaterial){let Tt=ie.uniformsGroups;for(let Pt=0,No=Tt.length;Pt<No;Pt++){let Zn=Tt[Pt];Xe.update(Zn,Lt),Xe.bind(Zn,Lt)}}return Lt}function rh(T,$){T.ambientLightColor.needsUpdate=$,T.lightProbe.needsUpdate=$,T.directionalLights.needsUpdate=$,T.directionalLightShadows.needsUpdate=$,T.pointLights.needsUpdate=$,T.pointLightShadows.needsUpdate=$,T.spotLights.needsUpdate=$,T.spotLightShadows.needsUpdate=$,T.rectAreaLights.needsUpdate=$,T.hemisphereLights.needsUpdate=$}function oh(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return D},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(T,$,ne){let ie=_e.get(T);ie.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,ie.__autoAllocateDepthBuffer===!1&&(ie.__useRenderToTexture=!1),_e.get(T.texture).__webglTexture=$,_e.get(T.depthTexture).__webglTexture=ie.__autoAllocateDepthBuffer?void 0:ne,ie.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,$){let ne=_e.get(T);ne.__webglFramebuffer=$,ne.__useDefaultFramebuffer=$===void 0};let ah=L.createFramebuffer();this.setRenderTarget=function(T,$=0,ne=0){w=T,b=$,D=ne;let ie=!0,K=null,pe=!1,Ee=!1;if(T){let Ae=_e.get(T);if(Ae.__useDefaultFramebuffer!==void 0)le.bindFramebuffer(L.FRAMEBUFFER,null),ie=!1;else if(Ae.__webglFramebuffer===void 0)Ne.setupRenderTarget(T);else if(Ae.__hasExternalTextures)Ne.rebindTextures(T,_e.get(T.texture).__webglTexture,_e.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Fe=T.depthTexture;if(Ae.__boundDepthTexture!==Fe){if(Fe!==null&&_e.has(Fe)&&(T.width!==Fe.image.width||T.height!==Fe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ne.setupDepthRenderbuffer(T)}}let ze=T.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(Ee=!0);let ke=_e.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(ke[$])?K=ke[$][ne]:K=ke[$],pe=!0):T.samples>0&&Ne.useMultisampledRTT(T)===!1?K=_e.get(T).__webglMultisampledFramebuffer:Array.isArray(ke)?K=ke[ne]:K=ke,N.copy(T.viewport),O.copy(T.scissor),z=T.scissorTest}else N.copy(R).multiplyScalar(Z).floor(),O.copy(E).multiplyScalar(Z).floor(),z=A;if(ne!==0&&(K=ah),le.bindFramebuffer(L.FRAMEBUFFER,K)&&ie&&le.drawBuffers(T,K),le.viewport(N),le.scissor(O),le.setScissorTest(z),pe){let Ae=_e.get(T.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+$,Ae.__webglTexture,ne)}else if(Ee){let Ae=$;for(let ze=0;ze<T.textures.length;ze++){let ke=_e.get(T.textures[ze]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+ze,ke.__webglTexture,ne,Ae)}}else if(T!==null&&ne!==0){let Ae=_e.get(T.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ae.__webglTexture,ne)}g=-1},this.readRenderTargetPixels=function(T,$,ne,ie,K,pe,Ee,Ce=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=_e.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ae=Ae[Ee]),Ae){le.bindFramebuffer(L.FRAMEBUFFER,Ae);try{let ze=T.textures[Ce],ke=ze.format,Fe=ze.type;if(!ae.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ae.textureTypeReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=T.width-ie&&ne>=0&&ne<=T.height-K&&(T.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Ce),L.readPixels($,ne,ie,K,Le.convert(ke),Le.convert(Fe),pe))}finally{let ze=w!==null?_e.get(w).__webglFramebuffer:null;le.bindFramebuffer(L.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(T,$,ne,ie,K,pe,Ee,Ce=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ae=_e.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ae=Ae[Ee]),Ae)if($>=0&&$<=T.width-ie&&ne>=0&&ne<=T.height-K){le.bindFramebuffer(L.FRAMEBUFFER,Ae);let ze=T.textures[Ce],ke=ze.format,Fe=ze.type;if(!ae.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ae.textureTypeReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ze=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Ze),L.bufferData(L.PIXEL_PACK_BUFFER,pe.byteLength,L.STREAM_READ),T.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Ce),L.readPixels($,ne,ie,K,Le.convert(ke),Le.convert(Fe),0);let it=w!==null?_e.get(w).__webglFramebuffer:null;le.bindFramebuffer(L.FRAMEBUFFER,it);let pt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await yl(L,pt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Ze),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,pe),L.deleteBuffer(Ze),L.deleteSync(pt),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,$=null,ne=0){let ie=Math.pow(2,-ne),K=Math.floor(T.image.width*ie),pe=Math.floor(T.image.height*ie),Ee=$!==null?$.x:0,Ce=$!==null?$.y:0;Ne.setTexture2D(T,0),L.copyTexSubImage2D(L.TEXTURE_2D,ne,0,0,Ee,Ce,K,pe),le.unbindTexture()};let ch=L.createFramebuffer(),lh=L.createFramebuffer();this.copyTextureToTexture=function(T,$,ne=null,ie=null,K=0,pe=null){pe===null&&(K!==0?(Li("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),pe=K,K=0):pe=0);let Ee,Ce,Ae,ze,ke,Fe,Ze,it,pt,at=T.isCompressedTexture?T.mipmaps[pe]:T.image;if(ne!==null)Ee=ne.max.x-ne.min.x,Ce=ne.max.y-ne.min.y,Ae=ne.isBox3?ne.max.z-ne.min.z:1,ze=ne.min.x,ke=ne.min.y,Fe=ne.isBox3?ne.min.z:0;else{let Ht=Math.pow(2,-K);Ee=Math.floor(at.width*Ht),Ce=Math.floor(at.height*Ht),T.isDataArrayTexture?Ae=at.depth:T.isData3DTexture?Ae=Math.floor(at.depth*Ht):Ae=1,ze=0,ke=0,Fe=0}ie!==null?(Ze=ie.x,it=ie.y,pt=ie.z):(Ze=0,it=0,pt=0);let rt=Le.convert($.format),Be=Le.convert($.type),lt;$.isData3DTexture?(Ne.setTexture3D($,0),lt=L.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(Ne.setTexture2DArray($,0),lt=L.TEXTURE_2D_ARRAY):(Ne.setTexture2D($,0),lt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,$.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,$.unpackAlignment);let $e=L.getParameter(L.UNPACK_ROW_LENGTH),Lt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),gi=L.getParameter(L.UNPACK_SKIP_PIXELS),Ut=L.getParameter(L.UNPACK_SKIP_ROWS),Ki=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,at.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,at.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ze),L.pixelStorei(L.UNPACK_SKIP_ROWS,ke),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Fe);let ht=T.isDataArrayTexture||T.isData3DTexture,zt=$.isDataArrayTexture||$.isData3DTexture;if(T.isDepthTexture){let Ht=_e.get(T),Tt=_e.get($),Pt=_e.get(Ht.__renderTarget),No=_e.get(Tt.__renderTarget);le.bindFramebuffer(L.READ_FRAMEBUFFER,Pt.__webglFramebuffer),le.bindFramebuffer(L.DRAW_FRAMEBUFFER,No.__webglFramebuffer);for(let Zn=0;Zn<Ae;Zn++)ht&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,_e.get(T).__webglTexture,K,Fe+Zn),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,_e.get($).__webglTexture,pe,pt+Zn)),L.blitFramebuffer(ze,ke,Ee,Ce,Ze,it,Ee,Ce,L.DEPTH_BUFFER_BIT,L.NEAREST);le.bindFramebuffer(L.READ_FRAMEBUFFER,null),le.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(K!==0||T.isRenderTargetTexture||_e.has(T)){let Ht=_e.get(T),Tt=_e.get($);le.bindFramebuffer(L.READ_FRAMEBUFFER,ch),le.bindFramebuffer(L.DRAW_FRAMEBUFFER,lh);for(let Pt=0;Pt<Ae;Pt++)ht?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ht.__webglTexture,K,Fe+Pt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ht.__webglTexture,K),zt?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Tt.__webglTexture,pe,pt+Pt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Tt.__webglTexture,pe),K!==0?L.blitFramebuffer(ze,ke,Ee,Ce,Ze,it,Ee,Ce,L.COLOR_BUFFER_BIT,L.NEAREST):zt?L.copyTexSubImage3D(lt,pe,Ze,it,pt+Pt,ze,ke,Ee,Ce):L.copyTexSubImage2D(lt,pe,Ze,it,ze,ke,Ee,Ce);le.bindFramebuffer(L.READ_FRAMEBUFFER,null),le.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else zt?T.isDataTexture||T.isData3DTexture?L.texSubImage3D(lt,pe,Ze,it,pt,Ee,Ce,Ae,rt,Be,at.data):$.isCompressedArrayTexture?L.compressedTexSubImage3D(lt,pe,Ze,it,pt,Ee,Ce,Ae,rt,at.data):L.texSubImage3D(lt,pe,Ze,it,pt,Ee,Ce,Ae,rt,Be,at):T.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,pe,Ze,it,Ee,Ce,rt,Be,at.data):T.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,pe,Ze,it,at.width,at.height,rt,at.data):L.texSubImage2D(L.TEXTURE_2D,pe,Ze,it,Ee,Ce,rt,Be,at);L.pixelStorei(L.UNPACK_ROW_LENGTH,$e),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Lt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,gi),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ut),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ki),pe===0&&$.generateMipmaps&&L.generateMipmap(lt),le.unbindTexture()},this.initRenderTarget=function(T){_e.get(T).__webglFramebuffer===void 0&&Ne.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Ne.setTextureCube(T,0):T.isData3DTexture?Ne.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Ne.setTexture2DArray(T,0):Ne.setTexture2D(T,0),le.unbindTexture()},this.resetState=function(){b=0,D=0,w=null,le.reset(),be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kt}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}};var Xn={water:6543572,deep:3510169,foam:14745587,cream:15325358,rock:12166539,land:10464897,pine:4549728,solute:16046484},fn=(i,e=0,t=1)=>Math.min(t,Math.max(e,Number.isFinite(i)?i:e)),pn=(i,e,t,n,s=7)=>n?e:Ke.lerp(i,e,1-Math.exp(-s*fn(t,0,.1)));function mi(i){let e=new je;e.name=i;let t=new Set,n=new Set,s=new Map;function r(C,b={},D=!1){let w=JSON.stringify([C,b]);if(!D&&s.has(w))return s.get(w);let g=new Dt({color:C,roughness:.86,flatShading:!0,...b});return n.add(g),D||s.set(w,g),g}function o(C,b,D=[0,0,0],w=e,g={}){t.add(C);let x=new mt(C,b?.isMaterial?b:r(b,g));return x.position.fromArray(D),x.castShadow=!x.material.transparent,x.receiveShadow=!0,w.add(x),x}function a(C,b=e){let D=new je;return D.name=C,b.add(D),D}function l(C,b,D,w=e){return o(new en(...b),D,C,w)}function c(C,b=.3,D=Xn.rock,w=e){let g=o(new gt(b,0),D,C,w);return g.rotation.set(C[0]*.47,C[1]*.74,C[2]*.43),g}function h(C,b,D=e){if(!C.length)return a("unexposed-stratum",D);let w=new st;return w.setAttribute("position",new Ve(C,3)),w.computeVertexNormals(),o(w,b,[0,0,0],D,{side:ft})}function u(C,b,D,w=1){let g=a("alpine-conifer");g.position.set(C,b,D),o(new Wt(.045*w,.085*w,.9*w,5),8286297,[0,.4*w,0],g);for(let x=0;x<3;x++)o(new ii((.47-x*.105)*w,(1-x*.13)*w,6),[4812638,6521953,9018994][x],[0,(.75+x*.31)*w,0],g);return g}function p(){let C=a("geological-plinth");for(let D=0;D<3;D++){let w=o(new Wt(4.52+D*.07,4.36+D*.08,.25,11),[9404784,11772296,13614752][D],[0,-.77+D*.25,0],C);w.scale.z=1.05}let b=o(new Wt(4.65,4.65,.13,11),10661770,[0,-.055,0],C);return b.scale.z=1.05,C}function d(C){return new nn(C.map(b=>new k(...b)),!1,"centripetal")}function _(C,b,D,w=e,g=32){return o(new An(C,g,b,5,!1),D,[0,0,0],w)}function v(C,b,D,w=e,g=40,x=0){let N=[],O=new k,z=new k;for(let q=0;q<g;q++){let H=q/g,G=(q+1)/g,Q=C.getPoint(H),Z=C.getPoint(G),U=C.getTangent(H),y=C.getTangent(G);O.set(U.z,0,-U.x).normalize().multiplyScalar(b/2),z.set(y.z,0,-y.x).normalize().multiplyScalar(b/2);let R=[Q.x-O.x,Q.y+x,Q.z-O.z],E=[Q.x+O.x,Q.y+x,Q.z+O.z],A=[Z.x-z.x,Z.y+x,Z.z-z.z],X=[Z.x+z.x,Z.y+x,Z.z+z.z];N.push(...R,...A,...E,...E,...A,...X)}return h(N,D,w)}function m(C,{name:b="stream",width:D=.25,count:w=13,bed:g=!0,color:x=Xn.water,speed:N=.18,underground:O=!1,parent:z=e,steps:q=40}={}){let H=d(C),G=a(b,z),Q=r(x,{roughness:.23,metalness:.05,transparent:!0,opacity:.92,depthWrite:!1,side:ft},!0);g&&v(H,D+.2,Xn.cream,z,q,-.045);let Z=O?_(H,D*.3,Q,G):v(H,D,Q,G,q);Z.name=b+"-water";let U=a(b+"-particles",G),y=r(Xn.foam,{roughness:.2,transparent:!0,opacity:1,depthWrite:!1},!0),R=new gt(.037,0);for(let j=0;j<w;j++)o(R,y,[0,0,0],U).scale.set(.65,.65,1.8);let E=0,A=new k(0,0,1),X=new k;return{group:G,particles:U,path:H,water:Z,get amount(){return E},update(j,B=1,V=1/60,W=!1){E=pn(E,fn(B),V,W,9),G.visible=E>.008,Q.opacity=.88*E,y.opacity=E,U.children.forEach((te,Y)=>{let oe=((j*N+Y/w)%1+1)%1;H.getPoint(oe,te.position),te.position.y+=O?0:.04,H.getTangent(oe,X),te.quaternion.setFromUnitVectors(A,X)})}}}function f(C=[0,0,0],b=1){let D=a("travelling-water-drop");D.position.fromArray(C),D.scale.setScalar(b);let w=[new Me(0,-.23),new Me(.19,-.18),new Me(.29,.04),new Me(.23,.24),new Me(.1,.43),new Me(0,.66)],g=o(new si(w,10),r(7922660,{roughness:.22,metalness:.08}),[0,0,0],D);g.name="water-drop-body";for(let N of[-.095,.095])o(new oi(.027,6,4),2379607,[N,.09,.262],D);return o(new gt(.044,0),15204339,[-.12,.27,.21],D).scale.set(.6,1.8,.4),D}function I(C,b,D,{name:w="aquifer-pool",color:g=Xn.water,parent:x=e}={}){let N=a(w,x);N.position.fromArray(C);let O=o(new Wt(b+.13,b+.27,.16,15),Xn.cream,[0,-.07,0],N);O.scale.z=D/b;let z=o(new Wt(b,b,.032,20),r(g,{roughness:.18,metalness:.08}),[0,.018,0],N);return z.scale.z=D/b,{group:N,water:z}}function P(){let C=a("mountain-cutaway"),b=.45,D=(H,G)=>.22+3.75*Math.exp(-((H+1.05)**2/7+(G+1.8)**2/12))+1.08*Math.exp(-((H-1.75)**2/2.3+(G+1.75)**2/7)),w=[-3.65,-2.9,-2.15,-1.4,-.65,.1,.85,1.6,2.35,3.1,3.65],g=[-3.65,-2.85,-2.1,-1.35,-.55,b],x=[[],[],[],[]];for(let H=0;H<g.length-1;H++)for(let G=0;G<w.length-1;G++){let Q=[w[G],D(w[G],g[H]),g[H]],Z=[w[G+1],D(w[G+1],g[H]),g[H]],U=[w[G],D(w[G],g[H+1]),g[H+1]],y=[w[G+1],D(w[G+1],g[H+1]),g[H+1]],R=(G+H)%3;x[(Q[1]+Z[1]+U[1]+y[1])/4>3.38?3:R].push(...Q,...U,...Z,...Z,...U,...y)}x.forEach((H,G)=>h(H,[10530179,9543545,11580813,12171684][G],C));let N=[0,.65,1.3,1.95,2.6,3.25,4.5],O=[9538947,11970189,13746079,12364944,14470063,12433828];for(let H=0;H<N.length-1;H++){let G=[];for(let Q=0;Q<w.length-1;Q++){let Z=w[Q],U=w[Q+1],y=D(Z,b),R=D(U,b),E=N[H],A=N[H+1];if(Math.max(y,R)<=E)continue;let X=y<E?Ke.lerp(Z,U,(E-y)/(R-y)):Z,j=R<E?Ke.lerp(Z,U,(E-y)/(R-y)):U,B=Math.min(A,Math.max(E,y)),V=Math.min(A,Math.max(E,R));G.push(X,E,b,j,E,b,X,B,b,X,B,b,j,E,b,j,V,b)}h(G,O[H],C)}let z=[...w.map(H=>[H,-3.65]),...g.slice(1).map(H=>[3.65,H]),...w.slice(0,-1).reverse().map(H=>[H,b]),...g.slice(1,-1).reverse().map(H=>[-3.65,H])],q=[];z.forEach((H,G)=>{let Q=z[(G+1)%z.length];H[1]===b&&Q[1]===b||q.push(H[0],0,H[1],Q[0],0,Q[1],H[0],D(...H),H[1],H[0],D(...H),H[1],Q[0],0,Q[1],Q[0],D(...Q),Q[1])}),h(q,10852222,C);for(let[H,G,Q]of[[-2.7,-1.2,.72],[-.15,-2.9,.55],[2.45,-1.6,.66],[1.7,-.25,.48]])u(H,D(H,G),G,Q);for(let H=0;H<13;H++){let G=-3.05+H*.46,Q=.25+H%3*.6;Q<D(G,b)-.15&&c([G,Q,b+.018],.05,15128765,C).scale.set(2.6,.35,.6)}return{group:C,height:D,cut:b}}function M(){t.forEach(C=>C.dispose()),n.forEach(C=>C.dispose())}return{root:e,material:r,mesh:o,group:a,box:l,rock:c,surface:h,pine:u,base:p,curve:d,tube:_,ribbon:v,stream:m,droplet:f,pool:I,mountain:P,dispose:M}}var Ns=_h(Kl(),1);function Ql(){let i=mi("03 \u2022 Find the spring, connected fractures and open air"),{root:e}=i;i.base();let t=i.group("mountain-cutaway"),n=[-3.4,-2.9,-2.2,-1.45,-.65,.25,1.2,2.15,2.9,3.4],s=[.3,2.6,4.2,5,4.65,3.9,3.35,2.75,1.4,.25],r=[0,.42,.95,1.55,2.15,2.8,3.5,4.2,5.2],o=[7830904,10263431,13220770,14732977,12432281,14075564,12171170,14673108];for(let E=0;E<r.length-1;E++){let A=[],X=r[E],j=r[E+1];for(let B=0;B<n.length-1;B++){let V=s[B],W=s[B+1];if(Math.max(V,W)<=X)continue;let te=V<X?Ke.lerp(n[B],n[B+1],(X-V)/(W-V)):n[B],Y=W<X?Ke.lerp(n[B],n[B+1],(X-V)/(W-V)):n[B+1],oe=Math.min(j,Math.max(X,V)),se=Math.min(j,Math.max(X,W));A.push(te,X,.3,Y,X,.3,te,oe,.3,te,oe,.3,Y,X,.3,Y,se,.3)}i.surface(A,o[E],t)}let a=[],l=[];for(let E=0;E<n.length-1;E++){let A=[n[E],s[E],.3],X=[n[E+1],s[E+1],.3],j=[n[E],s[E]+.25,-1.55],B=[n[E+1],s[E+1]+.25,-1.55];a.push(...A,...j,...X,...X,...j,...B),l.push(...j,n[E],0,-1.55,...B,...B,n[E],0,-1.55,n[E+1],0,-1.55)}i.surface(a,7968122,t),i.surface(l,9411715,t),i.surface([-2.2,4.2,.31,-1.45,5,.31,-.65,4.65,.31,-2.2,4.2,.31,-.65,4.65,.31,-1.55,4.4,.32],15397092,t);for(let[E,A,X,j]of[[-2.8,2.9,-.5,.65],[-2.2,4.35,-.8,.5],[.8,3.65,-.5,.63],[1.7,3.1,-.7,.7],[2.6,1.9,-.5,.5],[-3.3,.1,1.3,.68]])i.pine(E,A,X,j);i.box([-.6,.42,.42],[4.4,.18,.16],7437687,t);for(let E=0;E<14;E++)i.rock([-2.8+E*.4,.17,1.5+Math.sin(E)*.35],.12+E%3*.035,10661265).scale.set(1.6,.5,1);let c=Array.from({length:6},(E,A)=>[-1.5+A%2*1.4,3.65-Math.floor(A/2)*1.3,.64]),h=[],u=[],p=[],d=(E,A)=>{let[X,j,B]=c[E];return[X+[0,.54,0,-.54][A],j+[.54,0,-.54,0][A],B+.16]};c.forEach((E,A)=>{let X=i.group("spring-socket-"+A);X.position.fromArray(E),i.box([0,0,-.08],[1.29,1.19,.18],9343877,X);let j=i.group("spring-slab-"+A,X),B=i.material(14734267,{roughness:.9},!0);i.box([0,0,0],[1.2,1.12,.18],B,j);for(let ve of[-.4,-.3,.3,.4])i.box([-.12,ve,.101],[.82,.012,.009],12826525,j);let V=A===5?[[0,.54,.13],[.02,.23,.14],[0,0,.15],[-.015,-.25,.14],[0,-.54,.13]]:[[0,.54,.13],[-.03,.23,.14],[0,0,.15],[.25,-.02,.14],[.54,0,.13]],W=i.curve(V);i.tube(W,.083,7108204,j,16);let te=i.material(6544860,{roughness:.18,metalness:.08,emissive:1863790,transparent:!0,opacity:0,depthWrite:!1},!0),Y=i.tube(W,.052,te,j,16);Y.name="spring-fracture-water-"+A,Y.position.z=.075;let oe=i.group("spring-fracture-particles-"+A,j),se=new gt(.032,0);for(let ve=0;ve<5;ve++)i.mesh(se,14680048,[0,0,0],oe);let L=i.material(14791533,{emissive:8144926,transparent:!0,opacity:0,depthWrite:!1},!0),he=i.mesh(new Tn(.62,.022,4,28),L,[0,0,.12],X);he.scale.y=.94,h.push({socket:X,pivot:j,mat:B,waterMat:te,water:Y,particles:oe,path:W,rim:he,rimMat:L,amount:0,angle:0}),u.push({object:X,action:"rotateRock",value:A})});let _=Ns.default.SPRING.route;for(let E=0;E<_.length-1;E++){let A=_[E],X=_[E+1],j=X===A+1?1:X===A-1?3:2,B=d(A,j),V=d(X,(j+2)%4),W=i.stream([B,[(B[0]+V[0])/2,(B[1]+V[1])/2,B[2]],V],{name:"spring-bridge-"+E,width:.12,count:3,bed:!1,underground:!0,steps:6});p.push({stream:W,i:A,next:X})}let v=i.stream([[-2.05,4.7,.55],[-1.5,4.48,.65],d(0,0)],{name:"spring-source",width:.16,count:10,bed:!1,underground:!0,steps:15}),m=d(5,1),f=[1.5,.99,.86],I=i.stream([m,[.83,1.05,.8],f],{name:"spring-outlet-fracture",width:.19,count:12,bed:!1,underground:!0,steps:15}),P=i.stream([f,[1.85,.83,1.2],[2.02,.38,1.8],[1.8,.25,2.45],[1.1,.22,3]],{name:"emergence-spring",width:.4,count:22,steps:22});i.rock([1.48,1.12,.6],.43,11119247).scale.set(1.2,.75,.6),i.rock([1.18,.76,.81],.17,12961447),i.rock([1.83,.88,.69],.23,14141862);let C=i.pool([1.4,.1,2.9],1.35,.85,{name:"spring-jade-pool",color:7387309}),b=[],D=new Tn(.2,.014,4,32);for(let E=0;E<3;E++){let A=i.material(14024689,{transparent:!0,opacity:0,depthWrite:!1},!0),X=i.mesh(D,A,[1.7,.25,2.55]);X.rotation.x=-Math.PI/2,b.push(X)}let w=i.group("emergence-co2-bubbles"),g=i.material(15466480,{transparent:!0,opacity:0,depthWrite:!1},!0),x=new gt(.052,1);for(let E=0;E<17;E++)i.mesh(x,g,[0,0,0],w);let N=i.group("spring-splash"),O=new gt(.025,0);for(let E=0;E<18;E++)i.mesh(O,13105385,[0,0,0],N);let z=i.material(15908712,{emissive:8998939,transparent:!0,opacity:.9},!0),q=i.mesh(new Tn(.15,.025,5,24),z,[0,0,1]);q.name="spring-blocked-point";let H=i.droplet([-1.5,4.4,.97],.55),G=0,Q=0,Z=new k,U=new Oe(14734267),y=new Oe(10737611);function R(E,A={},X=1/60,j=!1){let B=Ns.default.springInfo(A),V=A.rotations||Ns.default.SPRING.initial;h.forEach((Y,oe)=>{let se=-V[oe]*Math.PI/2,L=Ke.euclideanModulo(se-Y.angle+Math.PI,Math.PI*2)-Math.PI;Y.angle=j?se:Y.angle+L*(1-Math.exp(-X*12)),Y.pivot.rotation.z=Y.angle;let he=B.path.indexOf(oe),ve=he>0?h[B.path[he-1]].amount:1,ae=Math.abs(L)<.13||j;Y.amount=pn(Y.amount,he>=0&&ae&&(ve>.5||j)?1:0,X,j,7),Y.mat.color.copy(U).lerp(y,Y.amount*.55),Y.water.visible=Y.amount>.01,Y.waterMat.opacity=Y.amount*.96,Y.particles.visible=Y.amount>.1;let le=B.segments.find(F=>F.index===oe),Te=Ns.default.springPorts(oe,0),_e=le?(le.entry-V[oe]+4)%4:Te[0],Ne=_e!==Te[0];Y.particles.children.forEach((F,S)=>{let ee=(E*.35+S/5)%1;Ne&&(ee=1-ee),Y.path.getPoint(ee,F.position),F.position.z+=.13,F.scale.setScalar(Y.amount)});let tt=A.hintIndex===oe||A.selectedRock===oe,nt=B.blocked===oe;Y.rimMat.opacity=tt?1:nt?.5+.2*Math.sin(E*4):0,Y.rimMat.color.setHex(tt?16771245:15117144),Y.socket.scale.setScalar(tt?1.025:1)}),v.update(E,1,X,j),p.forEach(({stream:Y,i:oe,next:se})=>Y.update(E,B.path.includes(oe)&&B.path.includes(se)?Math.min(h[oe].amount,h[se].amount):0,X,j));let W=B.connected&&(j||h[5].amount>.8);G=pn(G,W?1:0,X,j,4),I.update(E,G,X,j),P.update(E,G,X,j);let te=fn(A.exposure,0,6);if(Q=pn(Q,B.connected?fn(te/2):0,X,j,3),g.opacity=G*.85,w.visible=G>.01,N.visible=G>.01,w.children.forEach((Y,oe)=>{let se=(E*.25+oe/17)%1;Y.position.set(1.62+Math.sin(oe*2.4)*(.12+se*.35),1+se*1.5,1.02+Math.cos(oe)*.16),Y.scale.setScalar(G*(.4+se))}),N.children.forEach((Y,oe)=>{let se=(E*.65+oe/18)%1;Y.position.set(1.8+Math.sin(oe*2.4)*se*.38,.25+Math.sin(se*Math.PI)*.35,2.35+Math.cos(oe*1.8)*se*.25),Y.scale.setScalar(G*(1-se))}),b.forEach((Y,oe)=>{let se=(E*.45+oe/3)%1;Y.scale.setScalar(.5+se*3.3),Y.material.opacity=G*(1-se)*.8}),C.water.material.color.setRGB(.44-G*.1,.72+G*.06,.68+G*.06),q.visible=!B.connected,B.blocked!==null){let Y=c[B.blocked];q.position.set(Y[0],Y[1],Y[2]+.26),q.scale.setScalar(.9+Math.sin(E*4)*.12)}if(B.connected)P.path.getPoint(fn(te/5),Z),Z.y+=.34,Z.z+=.12;else if(B.path.length){let Y=B.path.at(-1);Z.fromArray(c[Y]),Z.z+=.45}else Z.set(-1.5,4.45,.85);j?H.position.copy(Z):H.position.lerp(Z,1-Math.exp(-X*4)),H.rotation.y=.12}return R(0,{},0,!0),{root:e,markers:[],interactables:u,dropTarget:H,get focus(){return Q},update:R,dispose:i.dispose}}function eh(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new st,c=0;for(let h=0;h<i.length;++h){let u=i[h],p=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),p++}if(p!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(e){let d;if(t)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(t){let h=0,u=[];for(let p=0;p<i.length;++p){let d=i[p].index;for(let _=0;_<d.count;++_)u.push(d.getX(_)+h);h+=i[p].attributes.position.count}l.setIndex(u)}for(let h in r){let u=jl(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let p=0;p<u;++p){let d=[];for(let v=0;v<o[h].length;++v)d.push(o[h][v][p]);let _=jl(d);if(!_)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(_)}}return l}function jl(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new Ct(o,t,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let p=0,d=h.count;p<d;p++)for(let _=0;_<t;_++){let v=h.getComponent(p,_);a.setComponent(p+u,_,v)}}else o.set(h.array,l);l+=h.count*t}return s!==void 0&&(a.gpuType=s),a}var Yt=[{x:-.3,z:-3.8,y:2.9,rx:1.3,rz:1,color:4705213},{x:.8,z:-2.05,y:2.35,rx:1.8,rz:1.15,color:2144686},{x:-.85,z:-.25,y:1.8,rx:2.05,rz:1.25,color:6739642},{x:.65,z:1.45,y:1.25,rx:2.2,rz:1.3,color:2737860},{x:-.65,z:3.05,y:.7,rx:2.4,rz:1.4,color:7526598},{x:.5,z:4.5,y:.23,rx:1.9,rz:1,color:3455671}];function th({poolCount:i=Yt.length}={}){let e=Yt.slice(0,Math.max(1,Math.min(Yt.length,Math.floor(i)))),t=19092026,n=()=>(t=1664525*t+1013904223>>>0,t/4294967296),s=new je;s.name="Huanglong \u2022 a drop through time";let r=new je;r.name="Static miniature",s.add(r);let o=new je;o.name="Turquoise pools",s.add(o);let a=new je;a.name="New calcite deposits",s.add(a);let l=new Map;function c(y,R=.9){let E=y+":"+R;return l.has(E)||l.set(E,new Dt({color:y,roughness:R,flatShading:!0})),l.get(E)}function h(y,R,E=r){let A=new mt(y,R);return A.castShadow=!0,A.receiveShadow=!0,E.add(A),A}let u=y=>.18+(5.3-y)*.19;function p(y,R,E,A,X=7572839){let j=h(new gt(A,0),c(X));return j.position.set(y,R,E),j.scale.set(1.25,.8,.95),j.rotation.set(n(),n()*3,n()),j}function d(y,R,E,A,X=r){let j=[],B=[],V=new Oe(A);for(let te=0;te<R.length-1;te++)for(let Y=0;Y<y.length;Y++){let oe=(Y+1)%y.length,se=[y[Y][0]*E[te],R[te],y[Y][1]*E[te]],L=[y[oe][0]*E[te],R[te],y[oe][1]*E[te]],he=[y[oe][0]*E[te+1],R[te+1],y[oe][1]*E[te+1]],ve=[y[Y][0]*E[te+1],R[te+1],y[Y][1]*E[te+1]],ae=V.clone().multiplyScalar(.88+n()*.18);for(let le of[se,L,ve,L,he,ve])j.push(...le),B.push(ae.r,ae.g,ae.b)}let W=new st;return W.setAttribute("position",new Ve(j,3)),W.setAttribute("color",new Ve(B,3)),W.computeVertexNormals(),h(W,new Dt({vertexColors:!0,roughness:.88,flatShading:!0,side:ft}),X)}let _=Array.from({length:18},(y,R)=>{let E=R/18*Math.PI*2,A=1+n()*.055;return[Math.cos(E)*4.2*A,Math.sin(E)*6*A]}),v=d(_,[-1,-.78,-.42,-.18],[.76,.91,1,1.01],10193768);v.name="Faceted limestone foundation";let m=v.geometry.attributes.position;for(let y=0;y<m.count;y++)Math.abs(m.getY(y)+.18)<.001&&m.setY(y,u(m.getZ(y))-.2);m.needsUpdate=!0,v.geometry.computeVertexNormals();let f=[],I=[],P=new Oe(12042390);for(let y=0;y<_.length;y++){let R=_[y],E=_[(y+1)%_.length],A=P.clone().multiplyScalar(.88+n()*.2);for(let X of[[0,u(0)-.2,0],[R[0],u(R[1])-.2,R[1]],[E[0],u(E[1])-.2,E[1]]])f.push(...X),I.push(A.r,A.g,A.b)}let M=new st;M.setAttribute("position",new Ve(f,3)),M.setAttribute("color",new Ve(I,3)),M.computeVertexNormals(),h(M,new Dt({vertexColors:!0,flatShading:!0,side:ft,roughness:1})).name="Mossy hillside";let C=[];e.forEach((y,R)=>{let E=Array.from({length:36},(Y,oe)=>{let se=oe/36*Math.PI*2,L=1+.085*Math.sin(se*3+R)+.055*Math.cos(se*7-R);return[Math.cos(se)*y.rx*L,Math.sin(se)*y.rz*L]}),A=d(E,[Math.min(-.46,u(y.z)-y.y-.4),-.2,.035,.115,.045],[1.05,1.075,1.055,1,.94],15259815);if(A.position.set(y.x,y.y,y.z),A.name="Calcite rim "+(R+1),d(E,[-.2,-.165],[1.076,1.08],16246973).position.copy(A.position),R>1)for(let Y=0;Y<2;Y++){let oe=Array.from({length:7},(L,he)=>{let ve=he/6;return new k(y.x+(ve*1.75-.875)*y.rx,y.y+.09,y.z+(Y?-.24:.23)*y.rz+Math.sin(ve*Math.PI*2+R)*y.rz*.15)}),se=h(new An(new nn(oe),18,.047,4,!1),c(15129519));se.name="Small natural pool partitions"}if(R>2){let Y=d(E,[0,.06,.15],[1.008,1.007,.973],15984055,a);Y.position.set(y.x,y.y+.08,y.z),Y.userData.rim=!0,Y.userData.patch=R-3,Y.name="Accumulating rim "+R}let j=[],B=[],V=new Oe(y.color);for(let Y=0;Y<E.length;Y++){let oe=(Y+1)%E.length,se=V.clone().lerp(new Oe(9496273),n()*.2);for(let L of[[.15,0,-.12],[E[oe][0]*.945,0,E[oe][1]*.945],[E[Y][0]*.945,0,E[Y][1]*.945]])j.push(...L),B.push(se.r,se.g,se.b)}let W=new st;W.setAttribute("position",new Ve(j,3)),W.setAttribute("color",new Ve(B,3)),W.computeVertexNormals();let te=h(W,new Dt({vertexColors:!0,roughness:.24,metalness:.1,side:ft}),o);te.position.set(y.x,y.y+.06,y.z),te.name="Water surface "+(R+1),te.castShadow=!1,C.push(te);for(let Y=0;Y<6;Y++){let oe=n()*Math.PI*2,se=.3+n()*.38,L=h(new rn(.12+n()*.25,.018),c(12842717,.3),o);L.rotation.x=-Math.PI/2,L.position.set(y.x+Math.cos(oe)*y.rx*se,y.y+.069,y.z+Math.sin(oe)*y.rz*se),L.castShadow=!1}if(R>2)for(let Y=0;Y<12;Y++){let oe=Y/12*Math.PI*.95+.05,se=h(new sn(.095+n()*.075,0),c(16773051),a);se.position.set(y.x+Math.cos(oe)*y.rx,y.y+.09,y.z+Math.sin(oe)*y.rz),se.rotation.z=n(),se.userData.fullScale=.5+n()*.7,se.userData.patch=R-3}});let b=[];e.forEach((y,R)=>{if(b.push(new k(y.x,y.y+.12,y.z)),R===e.length-1)return;let E=e[R+1],A=new k(y.x*.65+E.x*.35,y.y+.13,y.z+y.rz*.78),X=new k(E.x,E.y+.09,E.z-.2);b.push(A,X);let j=[];for(let te=0;te<8;te++){let Y=te/7,oe=Ke.lerp(A.x,X.x,Y),se=Ke.lerp(A.y,X.y,Y),L=Ke.lerp(A.z,X.z,Y);j.push(oe-.21,se,L,oe+.21,se,L)}let B=[];for(let te=0;te<7;te++){let Y=te*2;B.push(Y,Y+1,Y+2,Y+1,Y+3,Y+2)}let V=new st;V.setAttribute("position",new Ve(j,3)),V.setIndex(B),V.computeVertexNormals();let W=h(V,new Dt({color:10088411,roughness:.3,transparent:!0,opacity:.76,side:ft}),o);W.name="Overflow "+R,W.castShadow=!1});function D(y,R,E){let A=u(R),X=h(new Wt(.065,.095,.85,5),c(8087632));X.position.set(y,A+.32*E,R),X.scale.setScalar(E);let j=[4353881,6326634,8560758];for(let B=0;B<3;B++){let V=h(new ii((.6-B*.11)*E,(1.1-B*.13)*E,6,1),c(j[B]));V.position.set(y,A+(.8+B*.44)*E,R),V.rotation.y=B*.48+n()}}for(let[y,R,E]of[[-2.6,-3.4,1.2],[-2.6,-4.5,.9],[-1.6,-5.1,1.05],[.6,-5.2,.8],[2.3,-4.3,1.25],[3,-3.3,.9],[-3.05,-1.7,1.1],[-3.3,.1,.82],[-3.15,2,.72],[2.9,-.4,.72],[3.4,1.2,.6]])D(y,R,E);for(let y=0;y<22;y++){let R=n()*Math.PI*2,E=Math.cos(R)*(3.25+n()*.65),A=Math.sin(R)*5.35;p(E,u(A)-.04,A,.15+n()*.3,[9479809,8230004,10792334][y%3])}for(let y=0;y<8;y++){let R=-3.1+n()*.65,E=1.5+n()*1.6,A=u(E)+.18;p(R,A,E,.13,9280098),h(new gt(.065,0),c(y%2?14596266:15062186)).position.set(R,A+.12,E)}function w(y,R,E,A){let X=new k().subVectors(R,y),j=h(new en(E,X.length(),E),c(A));return j.position.copy(y).add(R).multiplyScalar(.5),j.quaternion.setFromUnitVectors(new k(0,1,0),X.normalize()),j}let g=[];for(let y=0;y<27;y++){let R=-3.2+y*.28,E=3+Math.sin(y*.16)*.4,A=u(R)+.16,X=h(new en(.72,.1,.255),c(y%3?11307361:12951928));if(X.position.set(E,A,R),X.rotation.y=-Math.cos(y*.16)*.12,y%3===0){let j=new k(E+.37,A,R),B=j.clone().add(new k(0,.48,0));w(j,B,.045,8875344),g.push(B)}}for(let y=0;y<g.length-1;y++)w(g[y],g[y+1],.045,10190166);r.updateMatrixWorld(!0);let x=new Map;for(let y of[...r.children]){let R=y.geometry.clone();R.applyMatrix4(y.matrixWorld);let E=R.index?R.toNonIndexed():R;E.deleteAttribute("uv");let A=y.material.uuid,X=x.get(A)||{material:y.material,geos:[]};X.geos.push(E),x.set(A,X),r.remove(y),y.geometry.dispose()}for(let{material:y,geos:R}of x.values()){let E=eh(R),A=h(E,y);A.name="Merged terrain detail",R.forEach(X=>X.dispose())}let N=new je;N.name="Travelling water droplet",s.add(N);let O=[new Me(0,-.24),new Me(.21,-.2),new Me(.3,-.02),new Me(.28,.16),new Me(.14,.4),new Me(0,.7)],z=h(new si(O,10),c(7923949,.2),N);z.name="Drop body";for(let y of[-.09,.09])h(new oi(.035,6,4),c(2378320),N).position.set(y,.1,.265);h(new gt(.045,0),c(15269887),N).position.set(-.12,.3,.17);let H=h(new ri(.37,.4,32),new ln({color:16643257,side:ft}),N);H.rotation.x=-Math.PI/2,H.position.y=-.35;let G=new je;G.name="Moving water highlights",s.add(G);for(let y=0;y<12;y++){let R=h(new gt(.045,0),c(14811122,.2),G);R.castShadow=!1}let Q=new nn(b,!1,"centripetal"),Z=new je;Z.name="CO2 release illustration",s.add(Z);for(let y=0;y<7;y++)h(new gt(.04+y%3*.017,0),new ln({color:16187373,transparent:!0,opacity:.75}),Z);function U(y=0,R=0,E=0,A=null){let X=R===0?.12:R===1?.39:R===2?.68:.84,j=Q.getPoint(X);N.position.copy(j),N.position.y+=.55+Math.sin(y*1.8)*.065,N.rotation.y=.3+Math.sin(y*.5)*.15,G.children.forEach((B,V)=>{B.position.copy(Q.getPoint((y*.04+V/12)%1))}),a.children.forEach(B=>{let V=A?A[B.userData.patch]:E;B.userData.rim?B.scale.set(1,Math.max(.001,V),1):B.scale.setScalar(Math.max(.001,V)*B.userData.fullScale),B.visible=V>.005}),Z.visible=R===1,Z.children.forEach((B,V)=>{let W=(y*.5+V*.14)%1;B.position.set(j.x+Math.sin(V*2)*.22,j.y+.1+W*1.1,j.z+Math.cos(V)*.18),B.scale.setScalar(.4+W*.8)})}return U(),{root:s,update:U,curve:Q,drop:N,growth:a,dispose(){s.traverse(y=>{if(y.geometry?.dispose(),y.material)for(let R of Array.isArray(y.material)?y.material:[y.material])R.dispose()})}}}var qn=48,Lo=Math.PI*2,$i=i=>Math.max(0,Math.min(1,i));function nh(){let i=th({poolCount:3}),e=i.root;e.name="04 \u2022 Growing calcite terraces",i.drop.visible=!1,e.getObjectByName("Moving water highlights").visible=!1,e.getObjectByName("CO2 release illustration").visible=!1;let t=new Map;function n(w,g=!1){let x=w+":"+g;return t.has(x)||t.set(x,new Dt({color:w,roughness:g?.24:.85,metalness:g?.08:0,flatShading:!0,side:ft})),t.get(x)}function s(w,g,x,N,O=!1){let z=new mt(w,n(g,O));return z.name=N,z.castShadow=!O,z.receiveShadow=!0,x.add(z),z}let r=new gt(.055,0),o=new sn(.13,0),a=mi("Waterdrop through the growing terraces");e.add(a.root);let l=a.droplet([Yt[2].x,Yt[2].y+.98,Yt[2].z],.95),c=Yt.slice(2).map(w=>new k(w.x,w.y+.98,w.z)),h=c[0].clone(),u=new k,p=new Mt;p.name="Waterdrop hover landing",e.add(p);let d=new je;d.name="Next terrace landing target",e.add(d);let _=new ln({color:16773054,transparent:!0,opacity:.62,side:ft,depthWrite:!1}),v=new mt(new ri(.36,.4,36),_);v.name="Unnumbered landing ripple",v.rotation.x=-Math.PI/2,d.add(v);function m(w,g){return Array.from({length:qn},(x,N)=>{let O=N/qn*Lo,z=1+.085*Math.sin(O*3+g)+.055*Math.cos(O*7-g);return[Math.cos(O)*w.rx*z,Math.sin(O)*w.rz*z]})}function f(w){let g=[],x=[],N=[0,.1,.31,.54,.45],O=[1.085,1.1,1.075,1,.935],z=new Oe(15391144);for(let H=0;H<qn;H++){let G=w[H],Q=w[(H+1)%qn],Z=.89+.11*Math.sin(H*2.17)**2;for(let U=0;U<4;U++){let y=[G[0]*O[U],N[U],G[1]*O[U]],R=[Q[0]*O[U],N[U],Q[1]*O[U]],E=[Q[0]*O[U+1],N[U+1],Q[1]*O[U+1]],A=[G[0]*O[U+1],N[U+1],G[1]*O[U+1]];for(let X of[y,R,A,R,E,A])g.push(...X),x.push(z.r*Z,z.g*Z,z.b*Z)}}let q=new st;return q.setAttribute("position",new Ve(g,3)),q.setAttribute("color",new Ve(x,3)),q.computeVertexNormals(),q}function I(w,g=1){let x=[];for(let O=0;O<qn;O++){let z=w[O],q=w[(O+1)%qn];x.push(0,0,0,q[0]*g,0,q[1]*g,z[0]*g,0,z[1]*g)}let N=new st;return N.setAttribute("position",new Ve(x,3)),N.computeVertexNormals(),N}function P(w,g,x,N){let O=[],z=[];for(let G=0;G<=20;G++){let Q=G/20,Z=Q*Q*(3-2*Q),U=Ke.lerp(w.x,g.x,Q),y=Ke.lerp(w.y,g.y,Z),R=Ke.lerp(w.z,g.z,Q);if(O.push(U-.19,y,R,U+.19,y,R),G<20){let E=G*2;z.push(E,E+1,E+2,E+1,E+3,E+2)}}let q=new st;q.setAttribute("position",new Ve(O,3)),q.setIndex(z),q.computeVertexNormals();let H=s(q,7988692,x,N,!0);return H.geometry.setDrawRange(0,0),H}let M=[];for(let w=0;w<3;w++){let g=Yt[w+3],x=`Pond ${w+1}`,N=m(g,w+3),O=new je;O.name=x+" assembly",e.add(O),O.position.set(g.x,g.y-.1,g.z);let z=new Dt({vertexColors:!0,roughness:.87,flatShading:!0,side:ft}),q=new mt(f(N),z);q.name=x+" rim",q.castShadow=!0,q.receiveShadow=!0,O.add(q);let H=s(I(N,1.035),14604464,O,x+" basin");H.position.y=.018;let G=s(I(N,.936),g.color,O,x+" water",!0),Q=new je;Q.name=x+" partitions",O.add(Q);for(let he=0;he<2;he++){let ve=Array.from({length:8},(le,Te)=>{let _e=Te/7;return new k((_e*1.72-.86)*g.rx,0,(he?-.26:.23)*g.rz+Math.sin(_e*Lo+w)*g.rz*.13)}),ae=s(new An(new nn(ve),18,.04,4,!1),15655607,Q,x+" partition "+he);ae.position.y=.46}let Z=new je;Z.name=x+" crystals",O.add(Z);for(let he=0;he<18;he++){let ve=he/18*Lo,ae=1+.085*Math.sin(ve*3+w+3)+.055*Math.cos(ve*7-w-3),le=s(o,he%3?15984055:16773073,Z,x+" crystal "+he);le.position.set(Math.cos(ve)*g.rx*ae,.49,Math.sin(ve)*g.rz*ae),le.rotation.set(.1,he*.73,.18*Math.sin(he))}let U=new je;U.name=x+" glints",O.add(U);for(let he=0;he<10;he++){let ve=he*2.39,ae=.2+he%3*.17,le=s(new rn(.17+he%3*.055,.023),13303791,U,x+" glint "+he,!0);le.rotation.x=-Math.PI/2,le.position.set(Math.cos(ve)*g.rx*ae,0,Math.sin(ve)*g.rz*ae)}let y=new je;y.name=x+" mineral particles",O.add(y);for(let he=0;he<22;he++)s(r,he%3?16770978:16777215,y,x+" mineral "+he);let R=new je;R.name=x+" overflow",O.add(R);let E=Yt[w+4],A={x:Math.sin(w+.7)*g.rx*.19,y:.46,z:g.rz*.87},X=E?{x:E.x-g.x,y:E.y+.08-(g.y-.1),z:E.z-g.z-.15}:{x:.48,y:-.72,z:g.rz+1.12},j=P(A,X,R,x+" overflow sheet"),B=new je;B.name=x+" overflow droplets",R.add(B);for(let he=0;he<22;he++)s(r,he%4?13959152:9301734,B,x+" overflow droplet "+he,!0);let V=new je;V.name=x+" landing spray",R.add(V);for(let he=0;he<10;he++)s(r,13959154,V,x+" spray "+he,!0);let W=Yt[w+2],te={x:W.x-g.x,y:(w===0?W.y+.12:W.y+.34)-(g.y-.1),z:W.z-g.z+W.rz*.8},Y={x:0,y:.035,z:-g.rz*.3},oe=new je;oe.name=x+" inlet",O.add(oe);let se=P(te,Y,oe,x+" inlet sheet"),L=new je;oe.add(L);for(let he=0;he<10;he++)s(r,13500395,L,x+" inlet droplet "+he,!0);M.push({assembly:O,rim:q,floor:H,water:G,details:Q,crystals:Z,glints:U,dust:y,overflow:R,sheet:j,droplets:B,foam:V,spillStart:A,spillEnd:X,inletGroup:oe,inlet:se,incoming:L,inletStart:te,inletEnd:Y,p:g,points:N,rimAmount:0,fillAmount:0,spillAmount:0})}function C(w,g,x,N,O=0){let z=N*N*(3-2*N);w.position.set(Ke.lerp(g.x,x.x,N)+O,Ke.lerp(g.y,x.y,z)+.025,Ke.lerp(g.z,x.z,N))}let b=!1;function D(w=0,g={},x=1/60,N=!1){if(b)return;let O=Number.isFinite(g.sequence)?Math.max(0,Math.min(9,Math.floor(g.sequence))):0,z=Number.isFinite(g.fraction)?$i(g.fraction):0,q=g.won?9:O+z,H=Number.isFinite(w)?w:0,G=N?1:1-Math.exp(-12*Math.max(0,Math.min(.1,Number.isFinite(x)?x:0))),Q=!!g.won||O===9,Z=Math.min(2,Math.floor(O/3)),U=!Q&&!!g.running&&O%3===0&&z===0,y=Number.isFinite(g.travel)?$i(g.travel):1;if(Q)u.copy(c[3]);else if(U){let E=y*y*(3-2*y);y===0?u.copy(c[Z]):y===1?u.copy(c[Z+1]):(u.lerpVectors(c[Z],c[Z+1],E),u.y+=Math.sin(y*Math.PI)*.42)}else u.copy(c[O%3!==0||z>0?Z+1:Z]);N?h.copy(u):h.lerp(u,G),l.position.copy(h),l.position.y+=Math.sin(H*2.1)*.055,l.rotation.y=.38+Math.sin(H*.65)*.1,l.visible=!0,p.position.copy(c[Q?3:Z+1]),p.position.y+=Math.sin(H*2.1)*.055;let R=Yt[Z+3];d.position.set(R.x,.015+(5.3-R.z)*.19,R.z),d.visible=!Q&&!g.running&&O%3===0&&z===0,v.scale.setScalar(.95+.09*Math.sin(H*2)),_.opacity=.54+.12*Math.sin(H*2);for(let E=0;E<3;E++){let A=M[E],X=E*3,j=$i(q-X),B=$i(q-X-1),V=$i(q-X-2);A.rimAmount=j===0||j===1?j:A.rimAmount+(j-A.rimAmount)*G,A.fillAmount=B===0||B===1?B:A.fillAmount+(B-A.fillAmount)*G,A.spillAmount=V===0||V===1?V:A.spillAmount+(V-A.spillAmount)*G;let W=A.rimAmount,te=A.fillAmount,Y=A.spillAmount;A.assembly.visible=W>0,A.rim.visible=W>0,A.rim.geometry.setDrawRange(0,Math.min(qn,Math.ceil(W*qn))*24),A.rim.scale.y=.06+.94*W,A.floor.visible=W>.08,A.floor.scale.setScalar(.08+.92*W),A.water.visible=te>0,A.water.position.y=.035+.405*te;let oe=Math.sqrt(te);A.water.scale.set(oe,1,oe),A.details.visible=W>.58,A.details.scale.set(W,Math.max(.01,W),W),A.crystals.visible=W>0;for(let se=0;se<A.crystals.children.length;se++){let L=A.crystals.children[se],he=$i((W-se/A.crystals.children.length)*8);L.visible=he>0,L.scale.setScalar((.65+se%4*.12)*he),L.position.y=.49*W}A.glints.visible=te>0,A.glints.position.y=A.water.position.y+.008,A.glints.scale.set(oe,1,oe);for(let se=0;se<A.glints.children.length;se++)A.glints.children[se].scale.x=.7+.3*Math.sin(H*2+se);A.dust.visible=!!g.running&&O===X&&W>0&&W<1;for(let se=0;se<A.dust.children.length;se++){let L=A.dust.children[se],he=((H*1.2+se/22)%1+1)%1,ve=(W-.045+se*.004)*Lo,ae=1+.085*Math.sin(ve*3+E+3)+.055*Math.cos(ve*7-E-3);L.position.set(Math.cos(ve)*A.p.rx*ae+Math.sin(se*2.3)*he*.22,.54*W+.1+Math.sin(he*Math.PI)*.6,Math.sin(ve)*A.p.rz*ae+Math.cos(se*1.7)*he*.19),L.scale.setScalar(.5+Math.sin(he*Math.PI)*.9)}A.inletGroup.visible=te>0&&te<1,A.inlet.geometry.setDrawRange(0,Math.ceil(Math.min(1,te*3)*20)*6);for(let se=0;se<A.incoming.children.length;se++){let L=A.incoming.children[se],he=((H*.68+se/10)%1+1)%1;C(L,A.inletStart,A.inletEnd,he,Math.sin(se*2)*.075),L.visible=he<Math.min(1,te*3)}A.overflow.visible=Y>0,A.sheet.geometry.setDrawRange(0,Math.ceil(Y*20)*6);for(let se=0;se<A.droplets.children.length;se++){let L=A.droplets.children[se],he=((H*.55+se/22)%1+1)%1;C(L,A.spillStart,A.spillEnd,he,Math.sin(se*2.39)*.145),L.visible=he<Y,L.scale.set(.72,1.1+.3*Math.sin(H*3+se),.72)}A.foam.visible=Y>.85;for(let se=0;se<A.foam.children.length;se++){let L=A.foam.children[se],he=((H*.9+se/10)%1+1)%1;L.position.set(A.spillEnd.x+Math.sin(se*2.39)*he*.35,A.spillEnd.y+Math.sin(he*Math.PI)*.33,A.spillEnd.z+Math.cos(se*2.39)*he*.24),L.scale.setScalar((1-he)*.95+.2)}}}return D(0,{},0,!0),{root:e,markers:[],drop:l,dragSource:l,dropTarget:d,dropLanding:p,update:D,dispose(){if(b)return;b=!0;let w=new Set,g=new Set;e.traverse(x=>{if(x.geometry&&w.add(x.geometry),x.material)for(let N of Array.isArray(x.material)?x.material:[x.material])g.add(N)});for(let x of w)x.dispose();for(let x of g)x.dispose()}}}var tg=["flow","dissolution","emergence","deposition"];function nc(i){if(!tg.includes(i))throw new Error("Unknown water process");return i==="deposition"?nh():i==="flow"?ng():i==="dissolution"?ig():Ql()}function ng(){let i=mi("01 \u2022 Forest runoff, leaf matching and infiltration"),{root:e}=i;i.base();let t=O=>2.08-.46*O,n=[4,5,14,20,29],s=[9,15,24],r=[[-2.6,-3.8],[1.95,-3.95],[2.65,-2.45],[2.75,.4],[2.15,2.6],[.65,3],[-2.1,2.65],[-2.85,.8],[-2.8,-1.7]],o=[],a=[];r.forEach((O,z)=>{let q=r[(z+1)%r.length],H=[O[0],t(O[1]),O[1]],G=[q[0],t(q[1]),q[1]];o.push(0,t(0),0,...G,...H),a.push(...H,...G,O[0],.09,O[1],...G,q[0],.09,q[1],O[0],.09,O[1])}),i.surface(o,10005120),i.surface(a,12956820);for(let[O,z,q]of[[-2.5,-2.9,.7],[2.35,-2.6,.8],[-2.5,-.25,.62],[2.5,.65,.6],[-2.3,2.15,.5]])i.pine(O,t(z),z,q);i.rock([-1.4,4,-3.5],.8,10728353).scale.set(1.3,1.4,.6);let l=Array.from({length:30},(O,z)=>{let q=(z%5-2)*.82,H=-2.65+Math.floor(z/5)*.91;return[q,t(H)+.12,H]}),c=[],h=[],u=[],p=[7575890,12881225,12299608],d=new Oe(13153936),_=new Oe(14997426),v=new Oe(7976880);l.forEach((O,z)=>{let q=i.group("forest-cell-"+z);q.position.fromArray(O);let H=i.material(13153936,{roughness:.94},!0),G=i.box([0,-.06,0],[.75,.09,.82],H,q);G.rotation.x=.43;let Q=i.group("forest-leaf-"+z,q),Z=i.material(p[0],{},!0),U=i.mesh(new sn(.28,0),Z,[0,.1,0],Q);U.scale.set(.62,.15,1),U.rotation.y=z*.7;let y=i.box([0,.13,0],[.018,.018,.38],15785899,Q);y.rotation.y=z*.7;let R=i.rock([0,.12,0],.36,9608077,q);R.scale.set(1,.7,.95),R.visible=n.includes(z),R.name="forest-fixed-rock-"+z;let E=i.group("forest-branch-"+z,q);for(let[A,X]of[-.65,.5].entries()){let j=i.box([A*.12,.14,0],[.07,.08,.62],8874573,E);j.rotation.y=X}E.visible=s.includes(z),c.push({tile:q,mat:H,leaf:Q,leafMat:Z,blade:U,twig:E,stone:R,amount:0}),h.push({object:q,action:"pick",value:z});for(let A of[z+1,z+5]){if(A>=30||A===z+1&&A%5===0)continue;let X=l[A],j=[O[0],O[1]+.015,O[2]],B=[X[0],X[1]+.015,X[2]],V=i.stream([j,[(j[0]+B[0])/2,(j[1]+B[1])/2,(j[2]+B[2])/2],B],{name:"forest-water-"+z+"-"+A,width:.16,count:2,bed:!1,steps:5,speed:.32});u.push({i:z,next:A,stream:V})}});let m=i.stream([[0,3.92,-3.7],[0,3.55,-3.1],l[2]],{name:"flow-source",width:.27,count:12,steps:16}),f=l[27],I=i.stream([f,[0,.79,2.95],[0,.36,3.1],[.3,.09,3.55],[1.05,.09,3.86]],{name:"flow-aquifer-entry",width:.25,count:17,steps:20,bed:!1});I.particles.name="flow-aquifer-particles",i.rock([-.48,.64,3.05],.42,14075038).scale.set(.65,1.1,.65),i.rock([.5,.62,3.03],.4,14075038);let P=i.pool([.78,.015,3.57],1.25,.58,{name:"flow-underground-aquifer",color:3906469}),M=i.droplet([0,4.25,-3.45],.62),C=new k,b=i.group("forest-leaf-scatter"),D=[];for(let O=0;O<36;O++){let z=i.mesh(new sn(.06,0),p[O%3],[0,0,0],b);D.push(z)}let w=-1,g=1,x=l.map((O,z)=>n.includes(z)?-1:s.includes(z)?-2:([0,0,1,0,2][z%5]+Math.floor(z/5))%3);function N(O,z={},q=1/60,H=!1){let G=z.tiles||x,Q=new Set(z.wet||[]),Z=Q.has(27),U=z.lastClear||[];w!==(z.serial||0)&&(w=z.serial||0,g=0),g=H?1:Math.min(1,g+q*1.65),m.update(O,1,q,H),c.forEach((R,E)=>{R.amount=pn(R.amount,Q.has(E)?1:0,q,H,5),R.mat.color.copy(z.open?.[E]?_:d).lerp(v,R.amount),R.mat.emissive.setHex(z.selectedCell===E?9598252:z.hintCells?.includes(E)?5133355:0),R.leaf.visible=G[E]>=0,R.twig.visible=G[E]===-2,R.stone.visible=G[E]===-1,G[E]>=0&&(R.leafMat.color.setHex(p[G[E]]),R.blade.scale.set(G[E]===1?.9:.62,.15,G[E]===2?1.15:1));let A=U.includes(E)?Math.sin(g*Math.PI):0;R.leaf.position.y=A*.28,R.leaf.rotation.y=A*.7,R.leaf.scale.setScalar((1-R.amount*.35)*(1-A*.55))}),u.forEach(({i:R,next:E,stream:A})=>A.update(O,Q.has(R)&&Q.has(E)?1:0,q,H)),I.update(O,Z?1:0,q,H),P.water.scale.y=1+(z.runoff||0)*.5;let y=(z.wet||[]).reduce((R,E)=>Math.floor(E/5)>Math.floor(R/5)?E:R,2);Z?(I.path.getPoint(Math.min(1,z.runoff||0),C),C.y+=.38):Q.size?(C.fromArray(l[y]),C.y+=.42):C.set(0,4.12,-3.4),H?M.position.copy(C):M.position.lerp(C,1-Math.exp(-q*3.5)),M.rotation.y=.2,b.visible=g<1&&U.length>0,D.forEach((R,E)=>{let A=l[U[E%U.length]??2],X=E*2.4;R.position.set(A[0]+Math.cos(X)*g*.6,A[1]+Math.sin(g*Math.PI)*.65,A[2]+Math.sin(X)*g*.4),R.scale.setScalar(1-g),R.rotation.set(g*3,E,g*5)})}return N(0,{},0,!0),{root:e,markers:[],interactables:h,dropTarget:M,update:N,dispose:i.dispose}}function ig(){let i=mi("02 \u2022 CO\u2082 enriched water dissolves fractured limestone"),{root:e}=i;i.base();let t=i.mountain(),n=[[-1.5,2.95,.1],[-1.34,2.53,.6],[-.65,2.18,.82],[.28,1.89,1.03],[-.35,1.27,1.52],[.5,.65,2.17],[1.4,.16,3.02]],s=i.group("dissolution-lower-rock-section"),r=[[-.05,2.25,.6,.95],[-.08,1.76,1.05,1.03],[-.2,1.1,1.62,.8],[.51,.48,2.24,.78],[1.17,.1,2.91,.66]],o=[],a=[.04,.48,.98,1.48,1.98,2.5],l=[10918016,12824975,14009251,12298637,14732976];for(let U=0;U<r.length-1;U++){let[y,R,E,A]=r[U],[X,j,B,V]=r[U+1];o.push(y-A,R,E,y+A,R,E,X-V,j,B,y+A,R,E,X+V,j,B,X-V,j,B);for(let W of[-1,1])for(let te=0;te<a.length-1;te++){let Y=a[te],oe=a[te+1];if(Math.max(R,j)<=Y)continue;let se=[y+W*A,E,R],L=[X+W*V,B,j];if(se[2]<Y){let he=(Y-se[2])/(L[2]-se[2]);se=[Ke.lerp(se[0],L[0],he),Ke.lerp(se[1],L[1],he),Y]}if(L[2]<Y){let he=(Y-L[2])/(se[2]-L[2]);L=[Ke.lerp(L[0],se[0],he),Ke.lerp(L[1],se[1],he),Y]}i.surface([se[0],Y,se[1],L[0],Y,L[1],se[0],Math.min(se[2],oe),se[1],se[0],Math.min(se[2],oe),se[1],L[0],Y,L[1],L[0],Math.min(L[2],oe),L[1]],l[te],s)}}i.surface(o,14075040,s);let c=i.curve(n),h=i.tube(c,.14,7630692,e,38);h.position.z=-.12;let u=i.stream(n,{name:"dissolution-stream",width:.25,count:27,bed:!1,speed:.15,underground:!0}),p=[],d=[],_=[.2,.43,.68];_.forEach((U,y)=>{let R=c.getPoint(U);R.x+=y%2?.17:-.17,R.z+=.15;let E=i.rock(R.toArray(),.4,[15456956,14469543,15851451][y]);E.name="dissolving-limestone-"+y,E.scale.set(1.2,.87,.87),p.push(E);for(let B=0;B<3;B++)i.rock([R.x+Math.cos(B*2.1)*.33,R.y+Math.sin(B*2.1)*.23,R.z-.12],.1,13878183);let A=i.group("dissolved-minerals-"+y),X=i.material(Xn.solute,{roughness:.24,transparent:!0,opacity:0,depthWrite:!1},!0),j=new sn(.037,0);for(let B=0;B<10;B++)i.mesh(j,X,[0,0,0],A);d.push({group:A,material:X,amount:0})}),i.pool([1.05,.08,3],1.62,.65,{name:"dissolution-mineral-bearing-water"});let v=i.droplet([-1.5,3.7,.62],1.05),m=v.getObjectByName("water-drop-body");m.material=i.material(7922660,{roughness:.22,metalness:.08},!0);let f=new Oe(7922660),I=new Oe(10938576),P=i.group("dissolution-charge-glow",v),M=i.material(15070656,{roughness:.4,transparent:!0,opacity:0,depthWrite:!1},!0),C=i.mesh(new Tn(.49,.018,4,22),M,[0,.07,0],P);C.rotation.x=Math.PI/2;let b=i.group("dissolution-co2-cloud"),D=new k(2.55,3.55,.52),w=new k(-1.5,3.86,.62),g=D.clone(),x=[15134680,13032390,16118239].map(U=>i.material(U,{roughness:.94,transparent:!0,opacity:.97,depthWrite:!1},!0)),N=new gt(1,1),O=[];for(let[U,[y,R,E,A]]of[[-.41,-.02,0,.3],[-.13,.13,-.04,.41],[.22,.2,0,.36],[.48,.02,.01,.27],[.08,-.09,.17,.35],[-.26,-.09,.18,.3],[.26,-.07,-.15,.26]].entries()){let X=i.mesh(N,x[U%3],[y,R,E],b);X.name="co2-cloud-puff-"+U,X.rotation.set(U*.63,U*.47,U*.28),X.scale.set(A,A*.85,A*.86),O.push({puff:X,x:y,y:R,z:E,s:A})}let z=i.group("dissolution-co2-wisps"),q=new gt(.1,0),H=i.material(14937810,{roughness:.85,transparent:!0,opacity:0,depthWrite:!1},!0);for(let U=0;U<9;U++)i.mesh(q,H,[0,0,0],z).rotation.set(U*.52,U*.31,U*.17);for(let U=0;U<6;U++)i.rock([-1.84+U*.13,t.height(-1.84+U*.13,.12)+.025,.12],.075,7892816).scale.set(1.3,.6,.9);let G=0,Q=[0,0,0];function Z(U,y={},R=1/60,E=!1){let A=y.charged?fn(y.elapsed,0,8):0;G=pn(G,y.charged?1:0,R,E,6),u.update(U,y.charged?1:0,R,E),m.material.color.copy(f).lerp(I,G),M.opacity=G*.65,P.rotation.y=U*.3;let X=y.charged?A:U,j=y.charged?Ke.smoothstep(A,0,.9):0,B=y.charged?Ke.smoothstep(A,.28,1):0;g.copy(D).lerp(w,j),g.x+=Math.sin(X*.42)*.055*(1-j),g.y+=Math.sin(X*.8)*.055*(1-j)+Math.sin(j*Math.PI)*.26,b.position.copy(g),b.rotation.set(0,Math.sin(X*.48)*.07,Math.sin(X*.6)*.025),b.scale.setScalar((1+Math.sin(X*.9)*.025)*(1-Ke.smoothstep(A,.12,1))),b.visible=!y.charged||A<1,x.forEach(W=>W.opacity=.97*(1-B)),O.forEach(({puff:W,x:te,y:Y,z:oe,s:se},L)=>{let he=1+Math.sin(X*.85+L*.7)*.035;W.position.set(te,Y+Math.sin(X*.72+L)*.012,oe),W.scale.set(se*he,se*.85*he,se*.86*he)});let V=y.charged?Ke.smoothstep(A,.05,.25)*(1-Ke.smoothstep(A,.7,1.15)):0;z.visible=V>.01,H.opacity=V*.72,z.children.forEach((W,te)=>{let Y=fn((A-.05-te*.035)/.68),oe=Math.sin(Y*Math.PI);W.position.copy(D).lerp(w,Y),W.position.x+=Math.sin(te*2.3)*.19*oe,W.position.y+=.15+oe*(.17+Math.sin(te*1.7)*.16),W.position.z+=Math.cos(te*2.2)*.16*oe,W.scale.setScalar((.65+te%3*.16)*(1-Y*.87))}),p.forEach((W,te)=>{let Y=fn((A-te*2.35)/2.7);Q[te]=pn(Q[te],Y,R,E,7);let oe=1-.62*Q[te];W.scale.set(1.2*oe,.87*oe,.87*oe);let se=d[te];se.amount=pn(se.amount,Y>0?.45+.55*Y:0,R,E,7),se.group.visible=se.amount>.01,se.material.opacity=se.amount,se.group.children.forEach((L,he)=>{let ve=((U*.13+he/10)%1+1)%1,ae=_[te]+ve*(1-_[te]);c.getPoint(ae,L.position),L.position.x+=Math.sin(he*2.4)*.1,L.position.z+=.12+Math.cos(he*1.7)*.06,L.scale.setScalar(.8+ve*.32)})}),v.position.set(-1.5,3.7+Math.sin(U*2)*.06,.62),v.rotation.y=.16}return Z(0,{},0,!0),{root:e,markers:[],interactables:[],dragSource:b,dropTarget:v,update:Z,dispose:i.dispose}}function ih(i,e){return e===null||!Number.isFinite(i)||!Number.isFinite(e)?0:Math.max(0,Math.min((i-e)/1e3,.05))}window.HuanglongWaterScene={mount(i,e={}){let t,n=!1,s=!1,r=0,o=.12,a=1,l=0,c=null,h=!1,u="flow",p={},d={},_=!1,v=1,m=!1,f=null,I=null,P=window.matchMedia("(prefers-reduced-motion: reduce)");try{t=new Io({antialias:!0,alpha:!0,powerPreference:"low-power"})}catch{return i.dataset.renderState="fallback",null}let M=new gs,C=new Et(34,1,.1,80),b=new As;C.position.set(10,11.5,15),C.lookAt(0,1,0),t.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65)),t.setClearColor(0,0),t.outputColorSpace=Rt,t.toneMapping=kr,t.toneMappingExposure=1,t.shadowMap.enabled=!0,t.shadowMap.type=Lr;let D=t.domElement;D.setAttribute("role","img"),i.prepend(D),i.dataset.renderState="ready";let w=nc(u);M.add(w.root),M.add(new ws(16056309,12362107,1.8));let g=new zi(16774359,2.5);g.position.set(-6,13,7),g.castShadow=!0,g.shadow.mapSize.set(1024,1024),Object.assign(g.shadow.camera,{left:-9,right:9,top:10,bottom:-9}),g.shadow.normalBias=.05,g.shadow.bias=-3e-4,M.add(g);let x=new zi(10218978,1.1);x.position.set(6,5,-6),M.add(x);let N=new mt(new rn(200,200),new Ss({color:2445123,opacity:.15}));N.rotation.x=-Math.PI/2,N.position.y=-1.07,N.receiveShadow=!0,M.add(N);let O=new k,z=new k,q=new k;function H(ae,le){let Te=i.querySelector(le);!ae||!Te||(ae.getWorldPosition(O),O.project(C),Te.style.left=(O.x+1)*i.clientWidth/2+"px",Te.style.top=(1-O.y)*i.clientHeight/2+"px",Te.style.visibility=O.z>1||Math.abs(O.x)>1.16||Math.abs(O.y)>1.16?"hidden":"")}function G(ae,le,Te){let _e=D.getBoundingClientRect();return!_e.width||!_e.height?null:(b.setFromCamera(new Me((ae-_e.left)/_e.width*2-1,1-(le-_e.top)/_e.height*2),C),b.ray.intersectPlane(Te,z))}function Q(ae,le){let Te=u==="dissolution"?!p.charged:u==="deposition"&&!p.running&&!p.won&&p.sequence%3===0;if(n||m||!_||!w.dragSource||!Te)return!1;w.root.updateMatrixWorld(!0),C.updateMatrixWorld(!0);let _e=w.dragSource,Ne=_e.getWorldPosition(new k),tt=C.getWorldDirection(new k),nt=new Vt().setFromNormalAndCoplanarPoint(tt,Ne),F=G(ae,le,nt);return F?(f={object:_e,plane:nt,offset:Ne.clone().sub(F),local:_e.position.clone()},I=null,!0):!1}function Z(ae,le){if(!f||m)return;let Te=G(ae,le,f.plane);Te&&(f.object.parent.updateMatrixWorld(!0),f.local.copy(Te).add(f.offset),f.object.parent.worldToLocal(f.local),E(0))}function U(ae=!1){f&&(I={object:f.object,from:f.local.clone(),age:0,accepted:ae},f=null,E(0),X())}function y(ae){let le=w.dragSource;if(!le)return;if(f?.object===le){le.position.copy(f.local);return}if(I?.object!==le)return;let Te=I;if(Te.accepted){let _e=w.dropLanding||w.dropTarget;_e?(_e.getWorldPosition(q),le.parent.worldToLocal(q)):q.copy(le.position),Te.age+=P.matches||h?1:ae,le.position.lerpVectors(Te.from,q,Math.min(1,Te.age/.22)),u==="dissolution"&&!le.visible?I=null:u==="deposition"&&p.running&&p.travel>=1&&(Te.accepted=!1,Te.age=0,Te.from.copy(le.position))}else{Te.age+=P.matches||h?1:ae;let _e=Math.min(1,Te.age/.28),Ne=1-Math.pow(1-_e,3);le.position.lerpVectors(Te.from,le.position.clone(),Ne),_e===1&&(I=null)}}function R(){if(n)return;let ae=i.clientWidth,le=i.clientHeight;!ae||!le||(t.setSize(ae,le,!1),C.aspect=ae/le,C.updateProjectionMatrix(),E(0))}function E(ae=0){if(n||m||!i.clientWidth||!i.clientHeight)return;P.matches?v=1:v=Math.min(1,v+ae*2.8);let le=1-Math.pow(1-v,3);if(w.root.rotation.y=o,w.root.scale.setScalar(.94+le*.06),w.root.position.y=-.16*(1-le),C.zoom=a,C.updateProjectionMatrix(),w.update(l,["flow","emergence"].includes(u)?{...p,...d}:p,ae,P.matches||h),w.root.updateMatrixWorld(!0),y(ae),u==="deposition"&&w.dropTarget&&(w.dropTarget.visible=w.dropTarget.visible&&_),u==="emergence"){let Te=w.focus||0;C.position.set(4.6-Te*1.5,6-Te*1.4,16.8-Te*2.6),C.lookAt(.1+Te*.55,2-Te*.6,.4+Te*.65)}else C.position.set(10,11.5,15),C.lookAt(0,1,0);t.render(M,C),u==="dissolution"&&!p.charged&&(H(w.dragSource,"#co2Token"),H(w.dropTarget||w.drop,"#co2DropTarget")),u==="deposition"&&(H(w.dragSource,"#waterDropHandle"),H(w.dropTarget,"#waterDropNextTarget"))}function A(ae){if(r=0,n||!s||document.hidden||m)return;let le=ih(ae,c);c=ae,!h&&!P.matches&&(l+=le,e.onTick?.(u,le)),E(h?0:le),!h&&!P.matches&&!r&&(r=requestAnimationFrame(A))}function X(){n||!s||document.hidden||r||m||(c=null,r=requestAnimationFrame(A))}function j(){document.hidden?(U(),cancelAnimationFrame(r),r=0,c=null):X()}let B=new IntersectionObserver(ae=>{s=ae[0].isIntersecting,s?X():(U(),e.onDragCancel?.(),cancelAnimationFrame(r),r=0,c=null)},{threshold:.08});B.observe(i);let V=new ResizeObserver(R);V.observe(i),document.addEventListener("visibilitychange",j);let W=()=>{X(),E(0)};P.addEventListener("change",W);let te=null;function Y(ae){ae.button===0&&(te={id:ae.pointerId,x:ae.clientX,y:ae.clientY,yaw:o})}function oe(ae){if(!te||te.id!==ae.pointerId)return;let le=ae.clientX-te.x,Te=ae.clientY-te.y;Math.abs(Te)>Math.abs(le)&&Math.abs(le)<12||(o=te.yaw+le*.009,E(0))}function se(ae){if(te&&ae&&Math.hypot(ae.clientX-te.x,ae.clientY-te.y)<8&&_){let le=D.getBoundingClientRect();b.setFromCamera(new Me((ae.clientX-le.left)/le.width*2-1,1-(ae.clientY-le.top)/le.height*2),C);let Te=w.interactables||[],_e=b.intersectObjects(Te.map(Ne=>Ne.object),!0)[0];if(_e){let Ne=_e.object;for(;Ne;){let tt=Te.find(nt=>nt.object===Ne);if(tt){e.onInteract?.(tt.action,tt.value);break}Ne=Ne.parent}}}te=null}let L=()=>{te=null};D.addEventListener("pointerdown",Y),D.addEventListener("pointermove",oe),D.addEventListener("pointerup",se),D.addEventListener("pointercancel",L),D.addEventListener("pointerleave",L);let he=ae=>{ae.preventDefault(),f=null,I=null,m=!0,cancelAnimationFrame(r),r=0,i.dataset.renderState="fallback"};D.addEventListener("webglcontextlost",he);function ve(){m=!1,i.dataset.renderState="ready",R(),X()}return D.addEventListener("webglcontextrestored",ve),R(),{setChapter(ae,le,Te,_e={}){u!==ae&&(f=null,I=null,M.remove(w.root),w.dispose(),w=nc(ae),u=ae,M.add(w.root),o=.12,a=1,v=0),p=le||{},d=_e,_=Te,D.setAttribute("aria-label",{flow:"\u6797\u95F4\u4E09\u6D88\u5761\u9762\uFF0C\u4EA4\u6362\u843D\u53F6\u6253\u5F00\u6C34\u8DEF\uFF0C\u5CA9\u77F3\u7ED5\u6D41\uFF0C\u5761\u811A\u4E0B\u6E17",dissolution:"\u62D6\u52A8 CO\u2082 \u6C14\u56E2\uFF0C\u628A\u5B83\u4EA4\u7ED9\u6C34\u6EF4",emergence:"\u96EA\u5CF0\u5C71\u4F53\u5256\u9762\uFF0C\u65CB\u8F6C\u516D\u5757\u88C2\u9699\u5CA9\u5C42\u8FDE\u63A5\u6CC9\u773C\uFF0C\u7425\u73C0\u8272\u8868\u793A\u6C34\u8DEF\u65AD\u70B9",deposition:"\u62D6\u52A8\u6C34\u6EF4\u5230\u4E0B\u4E00\u5904\uFF0C\u8BA9\u5F69\u6C60\u9010\u4E2A\u751F\u957F\u3001\u84C4\u6C34\u3001\u6EA2\u6D41"}[ae]),E(0),X()},beginDrag:Q,moveDrag:Z,endDrag:U,rotate(ae){o+=ae*.32,E(0)},zoom(ae){a=Ke.clamp(a+ae*.13,.8,1.45),E(0)},reset(){o=.12,a=1,E(0)},pause(ae){U(),h=ae,E(0),X()},dispose(){f=null,I=null,n=!0,cancelAnimationFrame(r),B.disconnect(),V.disconnect(),document.removeEventListener("visibilitychange",j),P.removeEventListener("change",W),D.removeEventListener("pointerdown",Y),D.removeEventListener("pointermove",oe),D.removeEventListener("pointerup",se),D.removeEventListener("pointercancel",L),D.removeEventListener("pointerleave",L),D.removeEventListener("webglcontextlost",he),D.removeEventListener("webglcontextrestored",ve),w.dispose(),N.geometry.dispose(),N.material.dispose(),t.dispose(),D.remove()}}}};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
