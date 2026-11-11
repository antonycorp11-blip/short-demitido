import { M, camFromKeys, idle, blinkAt, q, ramp, clamp } from './motion.js';
export const FPS=30, TOTAL=1395, DECK=0;
export const SHOTS=[
  {id:1,a:0,b:272,light:'day'}, {id:2,a:273,b:388,light:'day'},
  {id:3,a:389,b:527,light:'day'}, {id:4,a:528,b:635,light:'day'},
  {id:5,a:636,b:824,light:'golden'}, {id:6,a:825,b:937,light:'golden'},
  {id:7,a:938,b:1011,light:'night'}, {id:8,a:1012,b:1128,light:'night'},
  {id:9,a:1129,b:1252,light:'night'}, {id:10,a:1253,b:1394,light:'day'}
];
export const shotAt=f=>SHOTS.find(s=>f>=s.a&&f<=s.b)||SHOTS[9];
export const LIGHTS={
 day:{az:120,el:48,sky:'#d6e6ff',ground:'#8a795b',hemi:1.45,sun:'#fff2d4',sunI:2.3,fog:'#cde3fa',fogNear:42,fogFar:190,skyTop:'#4e9cdd',skyHor:'#d6ebff',sat:1.16,waterDeep:'#2c6c8c',waterShal:'#5aaec4',glint:'#effaff',vig:.16,shadowExt:24},
 golden:{az:35,el:16,sky:'#f3c9ae',ground:'#866957',hemi:1.4,sun:'#ffd28e',sunI:2.6,fog:'#f4d4ad',fogNear:40,fogFar:180,skyTop:'#976ca0',skyHor:'#ffe0a5',sat:1.16,waterDeep:'#425b82',waterShal:'#d99a6e',glint:'#ffe2a8',vig:.2,shadowExt:24},
 night:{az:150,el:42,sky:'#708cb5',ground:'#394d6d',hemi:1.35,sun:'#b9d6ff',sunI:1.5,fog:'#819cbe',fogNear:35,fogFar:150,skyTop:'#253c76',skyHor:'#a6bee0',sat:1.14,waterDeep:'#263f6b',waterShal:'#6482a6',glint:'#dce8ff',vig:.25,shadowExt:24}
};
export const lightFor=S=>LIGHTS[S.light];
const D=[-3,1.2,1.5], N=[2,1.2,-12];
const K={
1:[{f:0,pos:[-3,2.2,7],look:[-3,1.8,.4],fov:39},{f:160,pos:[-3.1,2.15,6.4],look:[-3,1.8,.4],fov:46},{f:272,pos:[-3.1,2.15,6.4],look:[-3,1.8,.4],fov:46,roll:2}],
2:[{f:273,pos:[-3,2.7,6.2],look:[-3,2.5,-.4],fov:50},{f:340,pos:[-3,2.7,5.8],look:[-3,2.5,-.4],fov:50},{f:388,pos:[-3,2.7,5.8],look:[-3,2.5,-.4],fov:50}],
3:[{f:389,pos:[1.4,2.2,-5],look:[1.4,1.35,-12.2],fov:39},{f:527,pos:[1.4,2.2,-5.4],look:[1.4,1.35,-12.2],fov:39}],
4:[{f:528,pos:[-3,2.2,6.2],look:[-3,1.8,.2],fov:43},{f:587,pos:[-3,2.2,6.2],look:[-3,1.8,.2],fov:43},{f:635,pos:[2.2,2.3,-.3],look:[2.2,1.4,-12.4],fov:53}],
5:[{f:636,pos:[2.2,2.3,-.3],look:[2.2,1.4,-12.4],fov:53},{f:744,pos:[2.2,2.3,-.3],look:[2.2,1.4,-12.4],fov:53},{f:824,pos:[2.2,2.3,-.8],look:[2.2,1.4,-12.4],fov:51}],
6:[{f:825,pos:[-3,2.5,7.4],look:[-3,1.8,.6],fov:48},{f:900,pos:[-3,2.5,6.9],look:[-3,2.2,.2],fov:47},{f:937,pos:[-3,2.6,6.4],look:[-3,2.3,-.2],fov:45,roll:-3}],
7:[{f:938,pos:[-3,2.7,6.3],look:[-3,2.5,-.4],fov:50},{f:1011,pos:[-3,2.7,5.9],look:[-3,2.5,-.4],fov:48}],
8:[{f:1012,pos:[-3,2.6,6.3],look:[-3,2.1,.1],fov:50},{f:1128,pos:[-3,2.6,6.3],look:[-3,2.1,.1],fov:50}],
9:[{f:1129,pos:[-3,2.6,6.3],look:[-3,2.1,.1],fov:50},{f:1252,pos:[-3,2.6,6.3],look:[-3,2.1,.1],fov:50}],
10:[{f:1253,pos:[2.1,2.6,-2.7],look:[2.1,1.25,-13],fov:55},{f:1394,pos:[2.1,2.6,-2.7],look:[2.1,1.25,-13],fov:55}]
};
export const camAt=f=>{
 const s=shotAt(f),c=camFromKeys(K[s.id],f,{kicks:[{f:167,a:.04},{f:911,a:.05},{f:1098,a:.06},{f:1295,a:.06}]});
 c.flash= f>=273&&f<279?(1-(f-273)/6)*.8:0;
 return c;
};
export const dofAt=f=>{const s=shotAt(f);return {focus:s.id===3||s.id===5||s.id===10?7:5,cinf:(s.id===2&&f>345?0:s.id===5?2:8),near:1};};
export const worldAt=f=>({
 mine:[354,360,366,372,378,384].map(a=>M.spring(Math.max(0,(f-a)/30),2.2,5)),
 rh:M.spring(Math.max(0,(f-590)/30),2.4,5),
 chairs:f>=1253?M.spring((f-1253)/30,2,5):0,
 screen:f<165?'hook':f<273?'firedHook':f<360?'typing':f<528?'mine':f<825?'mine':f<970?'angry':f<1071?'resolved':f<1150?'fired':f<1253?'shift':'shift',
 typing:clamp((f-310)/46),f
});
const actor=(T,key,f,pos,opts={},extra={})=>{const seed=opts.seed||3;const o={...idle(f,seed),blink:blinkAt(f,seed),...opts};for(const k of ['tilt','headTilt','bob','step','swirl']) if(o[k]!==undefined)o[k]=q(o[k],2);return {key:key+JSON.stringify(o),draw:p=>T.romanFront(p,key,o),x:pos[0],y:pos[1],z:pos[2],...extra};};
const minepos=[[-.2,0,-12.1],[1.45,0,-12.1],[3.1,0,-12.1]];
export const actorsAt=(f,T)=>{
 const s=shotAt(f),out=[];
 const creator=(opts={},pos=[-3,0,2.2])=>out.push(actor(T,f>=1190&&s.id>=9?'CRIADOR_MINER':'CRIADOR',f,pos,{seed:3,expr:'smile',...opts}));
 const miners=(mode='work')=>minepos.forEach((p,i)=>out.push(actor(T,['MINEIRO','MINEIRO_B','MINEIRO_C'][i],f,p,{seed:11+i,expr:mode==='work'?'neutral':'stubborn',R:mode==='strike'?'up':'hang',L:mode==='strike'?'hip':'hang',prop:mode==='work'?'pickaxe':undefined,sign:mode==='strike'?'GREVE!':undefined,step:mode==='work'?q((f/24+i*.3)%1):0,bob:mode==='strike'?q(.014*Math.sin(f*.25+i)):undefined})));
 if(s.id===1) creator({expr:f>=167?'shock':'smile',R:f>=167?'cheek':'thumb',headTilt:f>=167?6:undefined});
 if(s.id===2) {creator({R:'point',expr:'smile'}); if(f>348) miners('work');}
 if(s.id===3){out.push(actor(T,'MINEIRO_B',f,[1.4,0,-12.2],{seed:12,expr:'stubborn',L:f>=453?'cross':'hang',R:f>=504?'up':'hang',prop:f<504?'pickaxe':undefined,sign:f>=504?'FÉRIAS JÁ!':undefined}));}
 if(s.id===4){if(f<588) creator({R:'temple',expr:'nervous',swirl:q(f*.2,1)});else{miners('work');out.push(actor(T,'RH',f,[4.75,0,-12.1],{seed:22,expr:'neutral',prop:'clipboard',R:'hang'}));}}
 if(s.id===5){miners(f>=773?'strike':'work');out.push(actor(T,'RH',f,[4.75,0,-12.1],{seed:22,expr:'stern',prop:'clipboard',R:'hang'}));}
 if(s.id===6) creator({expr:'panic',L:'temple',R:f>=909?'up':'temple',swirl:q(f*.22,1),bob:f>=911&&f<916?.03:undefined});
 if(s.id===7) creator({expr:f>=978?'smile':'nervous',R:'thumb'});
 if(s.id===8) creator({expr:f>=1098?'shock':'nervous',L:f>=1098?'cheek':'hang',R:f>=1098?'cheek':'hang'});
 if(s.id===9)creator({expr:'shock',R:f>=1215?'hang':'cheek',prop:f>=1215?'pickaxe':undefined});
 if(s.id===10){out.push(actor(T,'CRIADOR_MINER',f,[1.35,0,-10.4],{seed:3,expr:f>=1294?'shock':'stubborn',L:f>=1292?'up':'hip',R:'hang',prop:'pickaxe'}));[[.2,-14.2],[2,-14.6],[3.3,-14.2]].forEach((xz,i)=>out.push(actor(T,['MINEIRO','MINEIRO_B','MINEIRO_C'][i],f,[xz[0],0,xz[1]+1.3],{seed:11+i,expr:'smile',sunglasses:true,L:'belly',R:'thumb'},{s:.72})));out.push(actor(T,'RH',f,[4.7,0,-13.0],{seed:22,expr:'smile',sunglasses:true,R:'hang'},{s:.72}));}
 return out;
};
export const fxAt=()=>[];
