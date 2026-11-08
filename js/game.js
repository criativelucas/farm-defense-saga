// ---------- persistent profile, current journey (RUN) and current battle (S)
let S=null,RUN=null;
// saved progress is merged over these defaults key by key (nested objects too), so saves from older versions gain new fields
const META_DEFAULTS={celeiro:store.get('jardim-do-fruto-celeiro',[]),chars:{lavrador:1},ascMax:0,stats:{kills:0,podas:0,runs:0,wins:0},ach:{},tut:0,daily:{},
  coins:0,char:'lavrador',weapon:'enxada',weapons:{enxada:1},items:{cerca:2,espantalho:1,lama:2},upg:{hearts:0,bag:0,mana:0,treeHearts:0},done:{},unlocked:['videira','mana'],seen:{c:{},e:{},r:{}},
  garden:{pots:[],potsN:8,seeds:{trigo:2,'t:videira':1},adubo:1,spray:3,mel:1,fertil:0,treeSeed:0,tree:{planted:false,lvl:0,xp:0,lastWater:0},lastVisit:0},
  stars:{},talents:{},cardLv:{},sysSeen:{},dlg:{},endless:{},mg:{},missions:null,intro:0,v:2};
function fillDefaults(t,d){for(const k in d){const dv=d[k];if(t[k]===undefined||t[k]===null&&dv!==null)t[k]=structuredClone(dv);
  else if(dv&&typeof dv==='object'&&!Array.isArray(dv)&&t[k]&&typeof t[k]==='object'&&!Array.isArray(t[k]))fillDefaults(t[k],dv)}return t}
const META=fillDefaults(store.get('fds-meta',{}),META_DEFAULTS);META.celeiro=store.get('jardim-do-fruto-celeiro',META.celeiro||[]);
if(!Array.isArray(META.garden.pots))META.garden.pots=[];META.garden.pots=META.garden.pots.map(p=>p&&typeof p.k==='string'?p:null);META.v=2;
function saveMeta(){store.set('fds-meta',META)}
let UID=1;const mk=(k,o={})=>({uid:UID++,k,...o});
const relic=k=>!!RUN&&RUN.relics.includes(k);
const isChar=k=>!!RUN&&RUN.char===k;
const ascN=()=>RUN?RUN.asc:0;
function info(c){
  let I;
  if(c.hyb){const[a,b]=c.hyb;I={type:'semente',name:CARDS[a].name+'-'+CARDS[b].name,cost:Math.max(CARDS[a].cost,CARDS[b].cost)+1,fruit:FRUIT[a]+' + '+FRUIT[b],fruits:[FRUIT[a],FRUIT[b]],
    desc:'Enxerto: faz o que as duas fazem, com 80% da força.',short:'Faz o que as duas fazem (80%).',kinds:[a,b],ref:'Romanos 11:17',key:a}}
  else{const d=CARDS[c.k];I={type:d.type,name:d.name,cost:d.cost,fruit:FRUIT[c.k]||'',fruits:FRUIT[c.k]?[FRUIT[c.k]]:[],desc:d.desc,short:SHORT[c.k]||d.desc,
    kinds:(d.type==='semente'||d.plant)?[c.k]:null,ref:d.ref,key:c.k}}
  if(c.rare){I.name+=' ★';I.desc+=' Consagrada: +50% de dano.'}
  if(c.plus){I.name+='+';if(I.kinds)I.desc+=' Aperfeiçoada: +30% de dano.';else{I.cost=Math.max(0,I.cost-1);I.desc+=' Aperfeiçoada: custa 1 a menos.'}}
  return I;
}
function newRelic(){const free=Object.keys(RELICS).filter(k=>!RUN.relics.includes(k));if(!free.length)return null;const k=rpick(free);RUN.relics.push(k);return k}
function unlockAch(id){if(META.ach[id])return;META.ach[id]=1;saveMeta();toast('Conquista: '+ACH[id].name,ACH[id].ref);sfx('ach')}

// ---------- battle setup
const lvVariant=n=>{const m=/^\d+-(\d)/.exec(n&&n.level||'');return m?+m[1]-1:0};
function blankBattle(mapId,day=false,variant=0){
  MAPS[mapId]._fallen=false;buildMap(mapId,day,variant);
  S={t:0,state:'title',node:null,wi:0,waves:[],q:[],qt:0,total:1,done:0,between:12,cam:0,mana:6,
     en:[],tw:MAP.slots.map(()=>null),proj:[],eproj:[],parts:[],pops:[],drops:[],fx:[],shake:0,stop:0,combo:0,comboT:0,comboShow:0,comboN:0,lifeHit:0,
     rain:0,talents:0,talentsDue:0,fullT:0,setMult:1,setTier:0,fruits:new Set(),bolt:0,night:0,wet:0,sand:0,sandT:20,sandOn:0,
     flash:{a:0,c:'255,255,255'},slow:0,zoom:1,zoomTo:{x:0,y:0},sx:0,sy:0,newIdx:-1,sel:-1,reveal:false,trumpet:false,seaOpen:true,seaT:11,
     fruitDrops:[],basket:0,cut:{},links:[],pstones:0,pstT:0,rally:0,bank:0,perm:[0,1,2,3],babelOn:0,babelT:18,laps:0,lastLap:0,flood:0,floodIn:0,forbid:null,folk:null,idol:null,pairsSeen:{},pairHeal:0,respigar:0,fallen:false,
     fences:[],scares:[],muds:[],coins:0,levelNight:null,speed:1,paused:false,infoSlot:-1,hoverSlot:-1,
     draw:[],hand:[],p:{x:60,y:0,vx:0,vy:0,on:true,face:1,slam:false,sq:1,anim:0,dust:0,stun:0,moved:0,jumped:0,hp:3,maxhp:3,inv:0,faint:0,atkCD:0,swing:0,dash:0,dashHit:null}};
  S.p.y=gy(60);
}
function startBattle(node){
  MUS.scene=null;blankBattle(node.map,node.night===false,lvVariant(node));S.wx=(WEATHER[node.map]||[])[lvVariant(node)]||null;
  S.node=node;S.waves=node.waves;S.state='prep';S.between=12;
  S.mana=6+atr('mana')+(relic('arca')?4:0)+2*((META.upg&&META.upg.mana)||0);S.p.maxhp=S.p.hp=3+atr('vida')+((META.upg&&META.upg.hearts)||0)+((META.upg&&META.upg.treeHearts)||0)+tl('hearts');S.mana+=tl('mana');S.levelNight=node.night??null;
  S.draw=rshuffle(RUN.deck);S.hand=S.draw.splice(0,RUN.handSize);
  RUN.deck.forEach(c=>(c.hyb||[c.k]).forEach(k=>META.seen.c[k]=1));RUN.relics.forEach(k=>META.seen.r[k]=1);saveMeta();
  if(isChar('elias'))S.rain=16;
  S.reveal=relic('pomba')||isChar('jose');
  if(node.map==='eden')S.forbid={x:530,y:gy(530),on:false,t:0,wh:3};
  if(node.map==='mar')S.folk={x:240,saved:false};
  if(node.map==='sinai')S.idol={x:470,y:gy(470),hp:3,t:12};
  MUS.mode='calm';showStory();
  renderHand();banner(ACTS[RUN.act].name+' · '+MAP.name,node.type==='chefe'?'O guardião espera':node.type==='elite'?'O ídolo está aqui':'Prepare o jardim');
  if(!META.tut)startTutorial();
  wipe();if(RUN.mode==='level'){const gb=gardenBonus();if(gb){S.mana=Math.min(MAXM,S.mana+gb);toast('O jardim ajudou','+'+gb+' de maná no começo')}announceSystems();if(LEVELS[RUN.level].l===0&&!RUN.endless)startDialog(node.map)}
}
function startWave(){
  if(S.talentsDue){S.mana+=S.talentsDue;pop(S.p.x,S.p.y-26,'+'+S.talentsDue+' talentos','#f7c948');sfx('coin');S.talentsDue=0}
  const w=S.waves[S.wi];S.q=w.list.map(a=>[...a]);S.qt=1;S.total=S.q.length;S.done=0;S.state='wave';S.trumpet=false;
  MUS.mode=w.list.some(([k])=>EN[k].boss)?'boss':'wave';
  if(S.bank){const b=Math.round(S.bank*1.5);S.mana+=b;S.bank=0;pop(S.p.x,S.p.y-34,'+'+b+' dos celeiros','#f7c948')}
  if(isChar('noe')&&S.wi===1)S.floodIn=8;
  banner('Onda '+(S.wi+1)+' de '+S.waves.length,w.name);sfx('wave');
  if(relic('vara')){const i=MAP.slots.findIndex((s,j)=>!S.tw[j]&&s.soil==='boa');if(i>=0){plantAt(i,[rpick(['videira','roma','oliveira'])],false,.2);pop(MAP.slots[i].x,MAP.slots[i].y-40,'a vara floresceu','#f7c948')}}
  if(tutStep===5)tutNext();
}
function endWave(){
  if(MUS.mode==='wave')MUS.mode='calm';
  if(S.forbid&&S.forbid.on){RUN.hp=Math.max(1,RUN.hp-2);pop(S.forbid.x,S.forbid.y-44,'o fruto custou caro: -2 Vida','#c070ff',9)}
  MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(!t)return;
    if(t.soil==='pedra'){S.tw[i]=null;burst(s.x,s.y-8,10,['#7a5a3a','#9a9aa8'],50,200,.6);return}
    t.age++;if(t.mods&&t.mods.grow2&&t.kinds.includes('mostarda'))t.age++;const nl=Math.min(3,t.age);
    if(nl>(t.lvl||0)){t.lvl=nl;S.fx.push({k:'ring',x:s.x,y:s.y-14,r:2,max:22,t:0,c:'#f7c948'});pop(s.x,s.y-44,'nível '+(nl+1),'#f7c948',9)}
    if(t.kinds.includes('mostarda')&&t.age===2)unlockAch('mostarda')});
  S.talentsDue+=S.talents;S.talents=0;S.fullT=0;S.wi++;
  if(S.wi>=S.waves.length&&!goalKeepsWaves()){MUS.mode='calm';battleWon();return}
  S.state='prep';S.between=10;S.mana=Math.min(MAXM,S.mana+2);S.reveal=relic('pomba')||isChar('jose');
  banner('Onda vencida','Respire. A próxima vem aí');
}
function spawn(k,xo){
  const d=EN[k],a=RUN?RUN.act:0;
  let sc=d.boss?1+a*.1:d.elite?1+a*.3:1+a*.45+S.wi*.08;
  if(ascN()>=1)sc*=1.15;if(d.boss&&ascN()>=4)sc*=1.3;
  const x0=xo??MAP.ww+12;
  if(d.boss){META.seen.e[k]=1;saveMeta();bossIntro(k)}
  else if(!META.seen.e[k]){META.seen.e[k]=1;saveMeta();if(S.intro)(S.introQ||(S.introQ=[])).push(k);else foeIntro(k)}
  const e={k,born:S.t,x:x0,y:gy(Math.min(x0,MAP.ww-1)),hp:d.hp*sc,max:d.hp*sc,slow:0,frz:0,t:rnd(0,9),flash:0,base:rnd(90,122),st:3};
  if(d.fly===1)e.y=gy(Math.min(x0,MAP.ww-1))-20;if(d.fly===2)e.y=e.base;
  S.en.push(e);return e;
}

// ---------- effects
function burst(px,py,n,cols,sp=60,g=200,life=.6,s=1){for(let i=0;i<n;i++){const a=rnd(0,Math.PI*2),v=rnd(sp*.3,sp);
  S.parts.push({x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*.4,g,life:rnd(life*.5,life),max:life,c:cols[i%cols.length],s:Math.random()<.3?s+1:s})}}
function pop(px,py,txt,c='#fff',size=7){S.pops.push({x:px,y:py,txt,c,t:0,size})}
function shake(n){if(!CFG.noShake)S.shake=Math.max(S.shake,n)}
function flash(a,c='255,255,255'){if(a>S.flash.a)S.flash={a,c}}
function banner(small,big){$('bsmall').textContent=small;$('bbig').textContent=big;const b=$('banner');b.classList.remove('show');void b.offsetWidth;b.classList.add('show')}
function ecy(e){const d=EN[e.k];return d.fly?e.y:e.y-d.h/2}

function damage(e,d,src){
  if(e.hp<=0||e.dive>0)return;
  const strong=src&&EN[e.k].weak===src;if(strong)d*=2.5;
  if(e.shield)d*=.5;
  d*=1+Math.min(S.combo,25)*.02;
  e.hp-=d;e.flash=.07;sfx('hit');if(!EN[e.k].boss&&!EN[e.k].elite)e.x+=Math.min(3,d*.25);vfx('spark',e.x,ecy(e),{n:2});
  if(d>=8)S.stop=Math.max(S.stop,.035);
  if(EN[e.k].boss||EN[e.k].elite){if(d>=3){S.stop=Math.max(S.stop,.045);shake(Math.min(5,1.5+d*.15))}vfx('spark',e.x+rnd(-6,6),ecy(e)+rnd(-8,8),{n:4})}
  pop(e.x+rnd(-3,3),ecy(e)-6,(d<1?d.toFixed(1):Math.round(d))+(strong?'!':''),strong?'#ffe14a':e.shield?'#9ab0ff':'#fff4dc',strong?11:d>=6?9:7);
  const D=EN[e.k];
  if(D.boss&&!e.ph2&&e.hp>0&&e.hp<e.max/2){e.ph2=1;shake(8);flash(.35,'255,80,80');banner(D.name,{golias:'Golias se enfurece',farao:'O Faraó endurece o coração',leviata:'O Leviatã se agita'}[e.k])}
  if(e.hp<=0)kill(e);
}
function kill(e){
  const d=EN[e.k];S.done++;deathFx(e);mission('kill',1);
  if(RUN){RUN.stats.kills++;META.stats.kills++}
  const v=isChar('rute')?2:1;
  for(let i=0;i<Math.ceil(d.rew/5);i++)S.drops.push({x:e.x,y:ecy(e),vx:rnd(-50,50),vy:rnd(-120,-60),v,t:0,g:300});
  if(Math.random()<.4||d.boss||d.elite)S.drops.push({x:e.x,y:ecy(e),vx:rnd(-40,40),vy:rnd(-140,-80),v:d.boss?25:d.elite?12:Math.random()<.2?3:1,t:0,g:300,coin:1});
  S.combo++;S.maxCombo=Math.max(S.maxCombo||0,S.combo);S.kills=(S.kills||0)+1;S.comboT=1.3;if(S.combo>=3){S.comboShow=1;S.comboN=S.combo}if(S.combo>=25)unlockAch('combo');
  shake(d.boss?12:d.hp>20?4:1.5);sfx('kill');
  if(d.split){for(let j=0;j<2;j++){const n=spawn('contendinha',e.x+(j?5:-5));n.y=e.y;n.hp=n.max=EN.contendinha.hp*(1+RUN.act*.45)}S.total+=2}
  if(d.hp>20&&!d.boss){S.stop=Math.max(S.stop,.05);flash(.2)}
  if(d.boss||d.elite){S.slow=d.boss?1.8:.8;S.zoomTo={x:e.x,y:e.y-14};flash(.6,'255,230,150');pop(e.x,e.y-44,d.boss?d.name.toUpperCase()+' CAIU':'O ÍDOLO CAIU','#f7c948',11)}
  if(d.boss&&RUN){RUN.stats.bosses++;unlockAch(e.k);if(e.k==='golias'&&!META.chars.davi){META.chars.davi=1;saveMeta();toast('Personagem liberado: Davi','1 Samuel 17:40')}if(e.k==='farao'&&!META.chars.moises){META.chars.moises=1;saveMeta();toast('Personagem liberado: Moisés','Êxodo 14:21')}}
  if(META.stats.kills>=490)unlockAch('setenta');
}
// the colors each monster breaks into: body, shadow, light
const CHUNKC={odio:['#e8303f','#9a1428','#ff8a7a'],inveja:['#68cc34','#2a6a18','#b8f07a'],discordia:['#ff8a2c','#a8420e','#ffd080'],contendinha:['#d0662a','#7a3010','#f0a060'],
  contenda:['#e08a34','#8a4410','#ffc070'],gula:['#9040d0','#4a1a7a','#c890ff'],feitico:['#2a8ac8','#1a4a7a','#7ad0ff'],ambicao:['#d8404a','#8a1a3a','#f7c948'],
  embriaguez:['#f0609a','#9a2a5a','#ffb0d0'],impureza:['#b0b030','#5a5a10','#e8e870'],faccoes:['#3a6ae0','#1a3a8a','#90b8ff'],ira:['#ff7a28','#a8380e','#ffd34a'],
  ciume:['#3ad0a8','#1a6a5a','#a0f8e0'],heresia:['#7a4ad0','#3a1a6a','#f7c948'],bezerro:['#f0b838','#a06a10','#fff4b0'],golias:['#c9a24a','#6a5030','#d9a07a'],
  farao:['#d9a521','#2a5bd7','#c78b5a'],leviata:['#2a6a7a','#1a4250','#5af0c0']};
function deathFx(e){
  S.fx.push({k:'corpse',e:{...e},t:0,max:.3});
  {const D=EN[e.k],big=D.boss||D.elite,cc=CHUNKC[e.k]||[D.glow,'#2a1a1a','#ffffff'],n=big?46:Math.min(18,6+D.w);for(let i=0;i<n;i++){const a=rnd(-Math.PI,0),v=rnd(40,big?200:120);
    S.parts.push({x:e.x+rnd(-D.w/2,D.w/2),y:ecy(e)+rnd(-D.h/3,D.h/3),vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,g:380,life:rnd(.5,big?1.4:.9),max:big?1.4:.9,c:cc[i%3],s:big&&i%3===0?3:2})}}onoma(e.x,ecy(e)-4,EN[e.k].boss||EN[e.k].elite?'big':'kill',EN[e.k].boss||EN[e.k].elite?1:.18);vfx('puff',e.x,ecy(e),{n:5});vfx('spark',e.x,ecy(e),{n:6});
  const X=e.x,Y=ecy(e),P=(n,c,o)=>{for(let i=0;i<n;i++){const a=rnd(0,Math.PI*2),v=rnd(o.sp*.3,o.sp);
    S.parts.push({x:X+rnd(-3,3),y:Y+rnd(-3,3),vx:Math.cos(a)*v,vy:Math.sin(a)*v+(o.up||0),g:o.g,life:rnd(o.l*.5,o.l),max:o.l,c:pick(c),s:o.s||1,sway:o.sway,a:o.a})}};
  switch(e.k){
    case 'odio':P(22,['#ff6a1a','#ffd34a','#ff3a4a','#fff0a0'],{sp:70,g:-50,l:.9,up:-30});S.fx.push({k:'ring',x:X,y:Y,r:2,max:16,t:0,c:'#ff6a1a'});break;
    case 'inveja':P(12,['#7fd04a','#4f9a2a','#2f5a22'],{sp:25,g:-25,l:1.2,s:3,a:.6});P(6,['#e8ffe0'],{sp:40,g:0,l:.4});break;
    case 'discordia':case 'contendinha':P(14,['#ffa040','#ffffff','#ff6a1a'],{sp:110,g:150,l:.4});break;
    case 'contenda':P(16,['#ffb060','#d06a2a','#fff'],{sp:90,g:200,l:.5});S.fx.push({k:'ring',x:X,y:Y,r:2,max:14,t:0,c:'#ffb060'});break;
    case 'gula':P(18,['#8e5bc0','#6a3f96','#c070ff'],{sp:90,g:420,l:.8,s:2,up:-60});break;
    case 'feitico':P(16,['#5af0ff','#e0ffff','#2a8a9a'],{sp:30,g:-70,l:1.1,sway:1});break;
    case 'ambicao':P(16,['#f7c948','#fff0a0','#c9921a'],{sp:100,g:380,l:1,s:2,up:-80});P(10,['#e0284a','#a43a50'],{sp:60,g:200,l:.6});break;
    case 'embriaguez':P(16,['#ff5aa0','#b0306a','#ffd0e0'],{sp:60,g:-20,l:.9,s:2,a:.7,sway:1});break;
    case 'impureza':P(16,['#c8c860','#6a6a2a','#3a3a1a'],{sp:40,g:-15,l:1.2,s:3,a:.55});break;
    case 'faccoes':P(14,['#7a9aff','#4a5aa0','#fff'],{sp:80,g:250,l:.5});break;
    default:P(70,['#f7c948','#fff0a0','#ffffff',EN[e.k].glow],{sp:180,g:150,l:1.6,s:2,up:-40});
      S.fx.push({k:'ring',x:X,y:Y,r:4,max:120,t:0,c:EN[e.k].glow});S.fx.push({k:'shock',x:X,y:Y,r:0,max:160,t:0});
  }
}

// ---------- player
function updPlayer(dt){
  const p=S.p;
  p.stun=Math.max(0,p.stun-dt);p.inv=Math.max(0,p.inv-dt);p.atkCD=Math.max(0,p.atkCD-dt);p.swing=Math.max(0,p.swing-dt);
  if(p.faint>0){p.faint-=dt;if(p.faint<=0){p.hp=p.maxhp;p.inv=2;pop(p.x,p.y-26,'de pé de novo','#9ff7b8')}}
  const L=p.stun>0?0:dn('ArrowLeft','KeyA'),R=p.stun>0?0:dn('ArrowRight','KeyD');
  const spd=(inSea(p.x)?55:100)*(1+.08*atr('vel'));
  if(p.dash>0){p.dash-=dt;p.vx=p.face*240;if(Math.random()<.6)S.parts.push({x:p.x-p.face*4,y:p.y-1,vx:-p.face*30,vy:-20,g:100,life:.4,max:.4,c:'#8a5a3a',s:2})}
  else if(!p.slam){p.vx+=((R-L)*spd-p.vx)*Math.min(1,dt*14);if(L!==R){const nf=R?1:-1;if(nf!==p.face&&p.on)p.sq=Math.min(p.sq,.86);p.face=nf}}
  if(p.stun<=0&&pr('ArrowUp','KeyW','Space')&&p.on){p.vy=-240;p.on=false;p.sq=.7;p.jumped=1;sfx('jump');burst(p.x,p.y,4,['#c9a99a'],30,0,.3)}
  if(p.stun<=0&&pr('ArrowDown','KeyS')&&!p.on&&!p.slam&&S.noSlam){pop(p.x,p.y-24,'sem pisão nesta fase','#c9a99a')}
  else if(p.stun<=0&&pr('ArrowDown','KeyS')&&!p.on&&!p.slam){p.slam=true;p.vy=420;p.vx=0;p.sq=.75}
  p.vy=Math.min(p.vy+560*dt,p.slam?520:400);
  const py=p.y,ox=p.x;p.x=clamp(p.x+p.vx*dt,6,MAP.ww-6);p.y+=p.vy*dt;p.moved+=Math.abs(p.x-ox);
  let floor=gy(p.x);
  if(p.vy>=0)for(const pl of MAP.plats)if(p.x>pl.x-3&&p.x<pl.x+pl.w+3&&py<=pl.y+.5&&p.y>=pl.y)floor=Math.min(floor,pl.y);
  if(p.y>=floor){
    if(!p.on){p.sq=p.slam?1.6:1.3;vfx('dust',p.x,floor-1,{n:p.slam?8:2});if(p.slam)doSlam();else burst(p.x,floor,3,['#c9a99a'],25,0,.25)}
    p.y=floor;p.vy=0;p.on=true;p.slam=false;
  }else p.on=false;
  p.sq+=(1-p.sq)*Math.min(1,dt*12);p.anim+=Math.abs(p.vx)*dt*.25;
  if(p.on&&Math.abs(p.vx)>20){p.dust-=dt;if(p.dust<=0){p.dust=.12;const w=inWater(p.x)||inSea(p.x);
    S.parts.push({x:p.x-p.face*3,y:p.y-1,vx:-p.face*rnd(5,15),vy:rnd(w?-40:-12,-4),g:w?200:-5,life:.4,max:.4,c:w?'#9ad0ff':'#c9a99a',s:1,a:.7})}}
  p.look=(p.look||0)+(p.face*20-(p.look||0))*Math.min(1,dt*1.6);// look a little ahead of where the gardener faces
  S.cam+=(clamp(p.x-W*.42+p.look,0,MAP.ww-W)-S.cam)*Math.min(1,dt*5);
}
function doSlam(){mission('slam',1);onoma(S.p.x,S.p.y-10,'slam',.8);
  const p=S.p,harvest=S.basket>=5;shake(harvest?9:5);S.stop=.06;sfx('slam');flash(harvest?.4:.22,harvest?'255,220,120':'255,255,255');
  const davi=isChar('davi'),rad=(davi?42:30)*(harvest?1.8:1);
  if(harvest){S.basket=0;banner('Pisão de colheita','O cesto transbordou');burst(p.x,p.y-6,30,['#ffd34a','#ff4f7b','#9b4be0','#5fe08a'],140,250,.8,2)}
  burst(p.x,p.y,16,['#e8dcc0','#c9a99a','#fff'],90,220,.5);
  S.fx.push({k:'ring',x:p.x,y:p.y-2,r:2,max:rad,t:0,c:harvest?'#ffd34a':'#fff3c0'});S.fx.push({k:'shock',x:p.x,y:p.y-4,r:0,max:(davi?100:70)*(harvest?1.6:1),t:0});
  for(const e of S.en){if(Math.hypot(e.x-p.x,ecy(e)-p.y)<rad+(EN[e.k].boss?16:0)){let d=3*(davi?2:1)*(harvest?3:1)*(1+.15*atr('for'));if(relic('funda'))d*=EN[e.k].boss?3:2;damage(e,d);if(!EN[e.k].boss)e.x+=Math.sign(e.x-p.x||1)*6}}
  MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(!t||t.grow<1||Math.abs(s.x-p.x)>=14||Math.abs(s.y-p.y)>=3)return;
    if(t.joio){t.joio=false;S.fx.push({k:'ring',x:s.x,y:s.y-12,r:2,max:24,t:0,c:'#ffffff'});pop(s.x,s.y-36,'joio arrancado','#ffffff');return}
    if(t.seduced){t.seduced=false;S.fx.push({k:'ring',x:s.x,y:s.y-12,r:2,max:24,t:0,c:'#f7c948'});pop(s.x,s.y-36,'livre do ídolo','#f7c948');return}
    if(t.sleep){t.sleep=false;t.awake=20;pop(s.x,s.y-36,'acordou','#9ab0ff')}
    if(t.dcd<=0)superTower(t,s)});
  if(isChar('debora'))MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(t&&Math.abs(s.x-p.x)<80)t.cd={}});
  if(relic('trombeta')&&!S.trumpet&&S.state==='wave'){S.trumpet=true;blessing('jerico')}
  if(S.forbid&&!S.forbid.on&&Math.abs(p.x-S.forbid.x)<16&&Math.abs(p.y-S.forbid.y)<4){S.forbid.on=true;S.forbid.t=1;banner('Você comeu do fruto','Poder agora, preço depois');sfx('super');flash(.4,'180,60,220')}
  if(S.idol&&S.idol.hp>0&&Math.abs(p.x-S.idol.x)<24&&Math.abs(p.y-S.idol.y)<6){S.idol.hp--;shake(8);burst(S.idol.x,S.idol.y-14,20,['#f7c948','#fff0a0'],100,300,.6,2);
    pop(S.idol.x,S.idol.y-40,S.idol.hp?'o ídolo rachou':'O ÍDOLO CAIU','#f7c948',9);
    if(!S.idol.hp){S.tw.forEach(t=>{if(t)t.seduced=false});RUN.siclos+=20;banner('Sinai','O bezerro virou pó · +20 siclos')}}
}
const slotAt=()=>MAP.slots.findIndex(s=>Math.abs(s.x-S.p.x)<12&&Math.abs(s.y-S.p.y)<3);

// ---------- trees
function tmult(t){let m=(t.plus?1.3:1)*(t.mods?t.mods.dmg:1)*S.setMult*(t.soil==='boa'?1.3:t.soil==='espinho'?.6:1)*(t.rare?1.5:1)*(t.kinds.length>1?.8:1)*(1+.2*(t.lvl||0))*(t.branch==='a'?1.7:1)*(1+.15*cardLv(t.kinds[0]))*(1+.08*tl('dmg'));
  if(relic('lampada')&&S.night>.3)m*=1.1;return m}
function nearest(sx,sy,range){let best=null,bd=range;for(const e of S.en){if(e.dive>0)continue;const d=Math.hypot(e.x-sx,ecy(e)-sy);if(d<bd&&e.hp>0){bd=d;best=e}}return best}
const SHOTC={seed:['#e8e070','#ffffff'],date:['#d9802a','#ffc080'],almond:['#e8d0b0','#ffd0e8'],fig:['#a04a8a','#7ac050'],oil:['#d9c24a','#fff3a0'],grape:['#9b4be0','#d8a8ff'],mustard:['#e8e070','#fff']};
function lob(sx,sy,e,kind,dmg,src,T=.55){const g=300,tx=e.x-EN[e.k].spd*1.2*T*(e.frz>0?0:e.slow>0?.5:1),ty=ecy(e);burst(sx,sy,4,SHOTC[kind]||['#fff6c0'],50,0,.22);
  S.proj.push({x:sx,y:sy,vx:(tx-sx)/T,vy:(ty-sy)/T-.5*g*T,g,kind,dmg,src,life:2})}
function beam(xx,w,d){S.fx.push({k:'beam',x:xx,w,t:0,max:.4});shake(4);sfx('beam');flash(.22,'255,80,140');
  for(const e of S.en)if(Math.abs(e.x-xx)<w){burst(e.x,ecy(e),7,['#e0284a','#ff9aa8','#ffffff'],80,320,.5);damage(e,d,'roma')}}
const SOIL_MSG={boa:['boa terra: +30%','#5fe08a'],espinho:['espinhos: -40%','#ff9a3c'],pedra:['pedregoso: murcha no fim da onda','#c9a99a']};
function plantAt(si,kinds,rare,delay=.6,plus=false){
  const s=MAP.slots[si];
  if(S.tw[si])burst(s.x,s.y-10,10,['#7a5a3a','#5fe08a'],50,200,.5);
  S.tw[si]={kinds,cd:{},dcd:0,grow:-delay,t:0,pulse:0,soil:s.soil,rare,plus,age:0,lvl:0,joio:false,stun:0,charge:0,heal:0,awake:20,fruitT:rnd(0,6),mods:null,ark:0,seduced:false,sleep:false};
  sfx('card');pop(s.x,s.y-30,...SOIL_MSG[s.soil]);mission('plant',1);
  if(tutStep===2)tutNext();
}
function leaf(s,k){if(Math.random()<.6)S.parts.push({x:s.x+rnd(-8,8),y:s.y-rnd(12,24),vx:rnd(-12,12),vy:rnd(-15,0),g:25,life:1.6,max:1.6,
  c:{oliveira:'#b8cf9a',sarca:'#ffd34a',mostarda:'#e8e070',amendoeira:'#ffd0e8',lirio:'#ffffff',tamareira:'#d9a050'}[k]||'#5fe08a',s:1,sway:1})}
function superTower(t,s){
  t.dcd=6;t.pulse=1;sfx('super');S.stop=.08;flash(.3,'255,240,180');pop(s.x,s.y-48,'GLÓRIA!','#ffe36a',9);
  if(tutStep===3)tutNext();
  const m=tmult(t);
  for(const k of t.kinds){
    if(k==='videira')for(let i=0;i<16;i++)S.proj.push({x:s.x+rnd(-70,70),y:rnd(-40,0),vx:rnd(-10,10),vy:rnd(40,90),g:260,kind:'grape',dmg:3*m,src:k,life:3});
    if(k==='roma'){beam(s.x,26,16*m);t.cd.roma=0}
    if(k==='oliveira'){S.fx.push({k:'ring',x:s.x,y:s.y-14,r:4,max:80,t:0,c:'#9fe8ff'});for(const e of S.en)if(Math.hypot(e.x-s.x,ecy(e)-s.y)<80){e.frz=3;damage(e,1*m,k)}}
    if(k==='sarca'){S.fx.push({k:'ring',x:s.x,y:s.y-8,r:4,max:80,t:0,c:'#ff9a3c'});burst(s.x,s.y-8,40,['#ff6a1a','#ffd34a','#fff'],150,60,.6,2);for(const e of S.en)if(Math.hypot(e.x-s.x,ecy(e)-s.y)<80)damage(e,9*m,k)}
    if(k==='mostarda'){if(t.age>=2){for(let i=0;i<10;i++)S.fx.push({k:'bird',x:s.x+rnd(-10,10),y:s.y-50,vx:rnd(-90,90),vy:rnd(-60,-20),t:0,max:1.2});for(const e of S.en)if(Math.hypot(e.x-s.x,ecy(e)-s.y)<130)damage(e,5*m,k)}else pop(s.x,s.y-20,'ainda é pequena','#e8e070')}
    if(k==='figueira'){const e=nearest(s.x,s.y-16,160);if(e)lob(s.x,s.y-16,e,'fig',20*m,k);t.charge=0}
    if(k==='tamareira'){RUN.hp=Math.min(RUN.maxhp,RUN.hp+3);sfx('heal');heartsHome(s,6);pop(30,120,'+3 Vida','#ffa64a',9)}
    if(k==='amendoeira'){S.tw.forEach(o=>{if(o){o.cd={};o.dcd=Math.min(o.dcd,1)}});S.fx.push({k:'ring',x:s.x,y:s.y-14,r:4,max:120,t:0,c:'#ffd0e8'});pop(s.x,s.y-36,'todas atiram!','#ffd0e8')}
    if(k==='lirio'){wind(s,110,60,2*m)}
  }
}
function heartsHome(s,n){for(let i=0;i<n;i++)S.fx.push({k:'heart',x:s.x+rnd(-6,6),y:s.y-18,t:-i*.08,max:1.2})}
function wind(s,rad,push,dmg,slow){sfx('wind');S.fx.push({k:'ring',x:s.x,y:s.y-8,r:4,max:rad,t:0,c:'#f4f4ff'});
  for(let i=0;i<10;i++)S.parts.push({x:s.x+rnd(-6,6),y:s.y-rnd(4,16),vx:rnd(60,140),vy:rnd(-10,10),g:0,life:.6,max:.6,c:'#f4f4ff',s:1,a:.7});
  for(const e of S.en)if(Math.abs(e.x-s.x)<rad&&Math.abs(ecy(e)-s.y)<40&&e.dive<=0){e.x+=EN[e.k].boss?push*.25:push;if(slow)e.slow=2;damage(e,dmg,'lirio')}}
// watering grows a tree through 3 stages: bigger, and one level stronger each stage
function water(t,s,amt){const was=t.water||0;t.water=Math.min(3,was+amt);const st=Math.floor(t.water);if(st>Math.floor(was)){
  sfx('heal');burst(s.x,s.y-12,16,['#7ac0ff','#bfe8ff','#5fe08a'],60,120,.6);t.pulse=1;mission('water',1);vfx('heal',s.x,s.y-22,{c:'#7ac0ff'});vfx('sparkle',s.x+6,s.y-28,{s:3});
  if(st>(t.lvl||0)){t.lvl=st;S.fx.push({k:'ring',x:s.x,y:s.y-14,r:2,max:22,t:0,c:'#7ac0ff'})}
  if(t.kinds.includes('mostarda'))t.age=Math.max(t.age,st>=3?2:st>=2?1:0);
  pop(s.x,s.y-44,st>=3?'árvore adulta!':'cresceu! nível '+(t.lvl+1),'#9ad0ff',9)}}
function updTowers(dt){
  const buffs=[];MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(t&&t.grow>=1&&!t.joio&&t.kinds.includes('amendoeira'))buffs.push(s.x)});
  const P=S.p;
  MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(!t)return;
    const was=t.grow;t.grow=Math.min(1,t.grow+dt*(t.soil==='pedra'?4:1.6));
    if(was<=0&&t.grow>0){vfx('puff',s.x,s.y-2,{n:4,c:'#8a5a3a'});vfx('sparkle',s.x,s.y-12,{s:3});burst(s.x,s.y-2,14,['#6a3a24','#8a5236','#4a2a1a'],60,300,.5);burst(s.x,s.y-6,8,['#5fe08a','#9ff7b8'],40,150,.5);shake(2);sfx('plant')}
    if(t.grow>=1&&!t.joio&&(t.water||0)<3){const near=P.on&&Math.abs(P.x-s.x)<16&&Math.abs(P.y-s.y)<6&&Math.abs(P.vx)<30&&P.faint<=0;
      const rate=(near?.19*(S.bucket>0?2.2:1):0)+(S.rain>0?.08:0);if(near&&S.bucket>0)S.bucket-=dt;if(rate>0)water(t,s,rate*dt*(t.soil==='espinho'?.6:t.soil==='pedra'?1.5:1));
      if(near&&Math.random()<dt*14)S.parts.push({x:P.x+P.face*4,y:P.y-10,vx:(s.x-P.x)*1.5+P.face*20,vy:-30,g:240,life:.45,max:.45,c:Math.random()<.5?'#7ac0ff':'#bfe8ff',s:1});
      if(near&&!S.waterHint){S.waterHint=1;pop(s.x,s.y-46,'regando: fique perto para crescer','#9ad0ff',7)}}
    t.t+=dt;t.dcd-=dt*(S.rain>0?3:1);t.pulse=Math.max(0,t.pulse-dt*2);t.stun=Math.max(0,t.stun-dt);t.ark=Math.max(0,(t.ark||0)-dt);
    if(t.ark>0){t.stun=0;t.joio=false;t.seduced=false;t.sleep=false}
    if(MAPID==='getsemani'&&t.grow>=1){
      if(Math.hypot(P.x-s.x,P.y-s.y)<34){if(t.sleep)pop(s.x,s.y-30,'acordou','#9ab0ff');t.awake=20;t.sleep=false}
      else{t.awake-=dt;if(t.awake<=0&&!t.sleep&&!(t.ark>0)){t.sleep=true;pop(s.x,s.y-30,'adormeceu','#9ab0ff')}}}
    if(t.grow<.6||t.joio||t.stun>0||t.sleep||t.seduced)return;
    t.fruitT+=dt;if((sysOn('basket')||S.goal==='colheita')&&t.fruitT>=(S.goal==='colheita'?4:10)&&t.grow>=1&&S.state==='wave'){t.fruitT=0;S.fruitDrops.push({x:s.x+rnd(-5,5),y:s.y-18,vx:rnd(-30,30),vy:-50,t:0,k:t.kinds[0],life:isChar('rute')?16:8})}
    const md=t.mods||{rate:1,fire:1,slowWind:0};
    const m=tmult(t),top=s.y-16;let rate=(S.rain>0?1.6:1)*(t.soil==='pedra'?1.3:1)*md.rate*(S.rally>0?1.5:1);
    if(buffs.some(bx=>bx!==s.x&&Math.abs(bx-s.x)<70))rate*=1.35;
    const RG=t.branch==='b'?1.3:1;if(t.branch==='b')rate*=1.5;
    for(const k of t.kinds){
      if(k==='sarca'&&Math.random()<dt*14)S.parts.push({x:s.x+rnd(-7,7),y:s.y-8,vx:rnd(-6,6),vy:rnd(-40,-20),g:-20,life:.5,max:.5,c:Math.random()<.5?'#ff6a1a':'#ffd34a',s:1});
      if(k==='figueira')t.charge=Math.min(6,t.charge+dt*rate);
      if(k==='tamareira'){t.heal+=dt;if(t.heal>=12){t.heal=0;if(RUN.hp<RUN.maxhp){RUN.hp++;sfx('heal');heartsHome(s,3);pop(30,120,'+1 Vida','#ffa64a')}}}
      t.cd[k]=(t.cd[k]??.5)-dt*rate;if(t.cd[k]>0)continue;
      if(k==='videira'){const e=nearest(s.x,top,85*RG);if(e){lob(s.x,top,e,'grape',2.2*m,k);t.cd[k]=.85;t.pulse=.4;leaf(s,k)}}
      else if(k==='oliveira'){const e=nearest(s.x,top,75*RG);if(e){lob(s.x,top,e,'oil',1*m,k);t.cd[k]=1.4;t.pulse=.4;leaf(s,k)}}
      else if(k==='roma'){if(S.en.some(e=>Math.abs(e.x-s.x)<18*RG&&e.hp>0&&!(e.dive>0))){beam(s.x,14,9*m);t.cd[k]=3.2;t.pulse=1;leaf(s,k);leaf(s,k)}}
      else if(k==='sarca'){t.cd[k]=.3;const fr=38*md.fire*RG;for(const e of S.en)if(Math.hypot(e.x-s.x,ecy(e)-(s.y-6))<fr){damage(e,1*m,k);if(Math.random()<.4)S.parts.push({x:e.x,y:ecy(e),vx:rnd(-10,10),vy:-30,g:-20,life:.5,max:.5,c:'#ff8a2a',s:1})}}
      else if(k==='mostarda'){
        if(t.age>=2){const e=nearest(s.x,s.y-40,125*RG);if(e){lob(s.x,s.y-40,e,'mustard',6*m,k,.7);t.cd[k]=1.5;t.pulse=.5;leaf(s,k)}}
        else{const e=nearest(s.x,s.y-8,60*RG);if(e){lob(s.x,s.y-8,e,'seed',(t.age?2:1)*m,k);t.cd[k]=1.2}}}
      else if(k==='figueira'){const e=nearest(s.x,top,95*RG);if(e&&t.charge>=1.2){lob(s.x,top,e,'fig',(2+t.charge*3)*m,k);t.charge=0;t.cd[k]=.6;t.pulse=.6;leaf(s,k)}}
      else if(k==='tamareira'){const e=nearest(s.x,s.y-24,60*RG);if(e){lob(s.x,s.y-24,e,'date',1*m,k);t.cd[k]=1.2}}
      else if(k==='amendoeira'){const e=nearest(s.x,top,70*RG);if(e){lob(s.x,top,e,'almond',1.5*m,k);t.cd[k]=1;leaf(s,k)}}
      else if(k==='lirio'){if(S.en.some(e=>Math.abs(e.x-s.x)<55&&Math.abs(ecy(e)-s.y)<40&&e.hp>0)){wind(s,55,22,.5*m,md.slowWind);t.cd[k]=3;t.pulse=.5;leaf(s,k)}}
    }
  });
}
// neighbours and the vine's branches (Jo 15:5): computed every frame
function computeLinks(dt){
  const L=[],P=MAP.slots;
  S.tw.forEach(t=>{if(t)t.mods={dmg:1,rate:1,fire:1,slowWind:0,grow2:0}});
  if(!sysOn('links')){S.links=[];return}
  for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=S.tw[i],b=S.tw[j];
    if(!a||!b||a.grow<1||b.grow<1||a.joio||b.joio)continue;if(Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y)>72)continue;
    const key=i+'-'+j,cut=(S.cut[key]||0)>0,ka=a.kinds,kb=b.kinds;
    const pair=PAIRS.find(p=>(ka.includes(p.a)&&kb.includes(p.b))||(ka.includes(p.b)&&kb.includes(p.a)));
    const vine=ka.includes('videira')||kb.includes('videira');
    L.push({i,j,cut,pair,vine});if(cut)continue;
    if(ka.join()!==kb.join()){a.mods.dmg*=1.1;b.mods.dmg*=1.1}
    if(vine){if(!ka.includes('videira'))a.mods.dmg*=1.25;if(!kb.includes('videira'))b.mods.dmg*=1.25}
    if(pair){const p=pair.a;
      if(p==='videira'){a.mods.rate*=1.3;b.mods.rate*=1.3}
      if(p==='oliveira'){a.mods.slowWind=b.mods.slowWind=1}
      if(p==='sarca'){a.mods.fire=b.mods.fire=1.3}
      if(p==='tamareira'){a.mods.grow2=b.mods.grow2=1}
      if(!S.pairsSeen[pair.name]){S.pairsSeen[pair.name]=1;toast('Vizinhas: '+pair.name,pair.desc+' · '+pair.ref)}}}
  S.links=L;
  for(const k in S.cut)S.cut[k]-=dt;
  for(const e of S.en){if(e.k!=='discordia'&&e.k!=='contendinha')continue;
    for(const l of L){if(l.cut)continue;const a=P[l.i],b=P[l.j],mx=(a.x+b.x)/2;
      if(Math.abs(e.x-mx)<4&&e.y>=Math.min(a.y,b.y)-2){S.cut[l.i+'-'+l.j]=8;pop(mx,Math.min(a.y,b.y)-22,'ramo cortado','#ffa040')}}}
  if(L.some(l=>!l.cut&&l.pair&&l.pair.a==='roma')&&S.state==='wave'){S.pairHeal+=dt;if(S.pairHeal>=15){S.pairHeal=0;if(RUN.hp<RUN.maxhp){RUN.hp++;sfx('heal');pop(30,120,'+1 Vida · Amor e Paz','#ff9ab0')}}}
}
function updSet(){
  const fr=new Set();S.tw.forEach(t=>t&&!t.joio&&t.grow>0&&t.kinds.forEach(k=>fr.add(FRUIT[k])));
  const prim=fr.has('Amor')&&fr.has('Alegria')&&fr.has('Paz');
  let m=1,tier=0;if(!sysOn('fruitset')){S.setTier=0;S.setMult=1;S.fruits=fr;return}if(fr.size>=3){m+=.15;tier=1}if(prim){m+=.3;tier=2;unlockAch('primicias')}if(fr.size>=5){m+=.35;tier=3}if(fr.size>=9){m+=.5;tier=4;unlockAch('completo')}
  if(tier>S.setTier){banner('Fruto em cacho',['','3 frutos: +15% de dano','Primícias: Amor, Alegria e Paz','5 frutos: +80% de dano','Os 9 frutos: +130% de dano'][tier]);sfx('super')}
  S.setTier=tier;S.setMult=m;S.fruits=fr;
}

// ---------- cards
function playCard(i,si=null){
  if(S.state!=='prep'&&S.state!=='wave')return;
  const c=S.hand[i];if(!c)return;const I=info(c),P=S.p;
  if(S.mana<I.cost){sfx('no');pop(P.x,P.y-24,'falta maná','#c58cff');return}
  let tx=P.x-S.cam,ty=P.y-14;
  if(I.kinds){si=si??slotAt();if(si<0){sfx('no');pop(P.x,P.y-24,'fique num canteiro ou toque nele','#c9a99a');return}
    const s=MAP.slots[si];tx=s.x-S.cam;ty=s.y-8;plantAt(si,I.kinds,c.rare,.6,c.plus)}
  else if(c.k==='joio'){RUN.deck=RUN.deck.filter(k=>k!==c);RUN.coll=RUN.coll.filter(k=>k!==c);pop(P.x,P.y-24,'joio arrancado da bolsa','#ffffff')}
  else{if(c.k==='chuva'){tx=W/2;ty=30}if(blessing(c.k)===false)return}
  flyCard(i,c,tx,ty);
  S.mana-=I.cost;if(CARDS[c.k]&&CARDS[c.k].type==='bencao'){vfx('holy',S.p.x,0);mission('bless',1)}if(S.goal==='esteira'||S.mini==='chuva')S.hand[i]=null;else{if(c.k!=='joio')S.draw.push(c);S.hand[i]=S.draw.shift()}S.sel=-1;S.newIdx=i;renderHand();S.newIdx=-1;
}
function blessing(k){
  const P=S.p;sfx('card');
  if(k==='mana'){S.mana+=5;pop(P.x,P.y-24,'+5 maná','#c58cff');for(let i=0;i<14;i++)S.parts.push({x:P.x+rnd(-30,30),y:P.y-rnd(40,70),vx:0,vy:rnd(20,40),g:20,life:1,max:1,c:'#f7c948',s:2})}
  if(k==='chuva'){S.rain=isChar('elias')?16:8;S.tw.forEach(t=>{if(!t)return;t.dcd=0;if(t.kinds.includes('mostarda')&&t.age<2)t.age++});banner('Bênção','Chuva Serôdia')}
  if(k==='jerico'){sfx('horn');shake(10);S.stop=.1;flash(.45,'255,220,120');S.fx.push({k:'shock',x:P.x,y:P.y-8,r:0,max:200,t:0});S.fx.push({k:'ring',x:P.x,y:P.y-8,r:4,max:160,t:0,c:'#f7c948'});
    for(const e of S.en)if(!EN[e.k].fly&&e.x>S.cam-10&&e.x<S.cam+W+10){damage(e,14);if(!EN[e.k].boss)e.x+=10}banner('As trombetas soaram','Muralha de Jericó')}
  if(k==='talentos'){S.talents+=6;pop(P.x,P.y-24,'investido: +6 na próxima onda','#f7c948')}
  if(k==='semeador'){for(let i=0;i<3;i++)S.proj.push({x:P.x,y:P.y-12,vx:rnd(-150,150),vy:rnd(-210,-130),g:300,kind:'sow',life:4})}
  if(k==='profecia'){S.reveal=true;S.mana+=2;pop(P.x,P.y-24,'a próxima onda foi revelada','#c58cff')}
  if(k==='regar'){const si=nearestTreeSlot();if(si<0){pop(P.x,P.y-24,'nenhuma árvore perto','#c9a99a');return false}const t=S.tw[si],s=MAP.slots[si];t.lvl=Math.min(3,(t.lvl||0)+1);water(t,s,1);t.dcd=0;
    S.fx.push({k:'ring',x:s.x,y:s.y-14,r:2,max:24,t:0,c:'#7fc8ff'});pop(s.x,s.y-44,'nível '+(t.lvl+1),'#7fc8ff',9);for(let i=0;i<12;i++)S.parts.push({x:s.x+rnd(-8,8),y:s.y-30,vx:0,vy:rnd(40,80),g:200,life:.5,max:.5,c:'#7fc8ff',s:1})}
  if(k==='arca'){const ids=MAP.slots.map((s,i)=>[i,Math.hypot(s.x-P.x,s.y-P.y)]).filter(([i])=>S.tw[i]).sort((a,b)=>a[1]-b[1]).slice(0,3);
    ids.forEach(([i])=>{S.tw[i].ark=20;const s=MAP.slots[i];S.fx.push({k:'ring',x:s.x,y:s.y-14,r:2,max:22,t:0,c:'#c9a24a'})});banner('Noé','A Arca guarda as árvores')}
  if(k==='respigar'){S.respigar=2.5;pop(P.x,P.y-24,'tudo vem até você','#ffd34a')}
  if(k==='pedras'){S.pstones+=5;S.pstT=0}
  if(k==='fogoceu'){const si=slotAt();if(si<0||!S.tw[si]){pop(P.x,P.y-24,'fique sobre uma árvore','#c9a99a');return false}
    const s=MAP.slots[si];S.tw[si]=null;S.fx.push({k:'beam',x:s.x,w:22,t:0,max:.6});shake(12);flash(.6,'255,160,60');sfx('beam');banner('Fogo do Céu','1 Reis 18:38');
    burst(s.x,s.y-10,40,['#ff6a1a','#ffd34a','#fff'],160,100,.8,2);for(const e of S.en)if(e.x>S.cam-10&&e.x<S.cam+W+10)damage(e,25)}
  if(k==='celeiro'){S.bank+=S.mana;pop(P.x,P.y-24,Math.floor(S.mana)+' maná guardado','#f7c948');S.mana=0}
  if(k==='palmeira'){S.rally=6;S.tw.forEach(t=>{if(t)t.cd={}});banner('Débora','Sob a palmeira, o povo se levantou')}
  if(k==='maraberto'){if(MAP.sea){S.seaOpen=true;S.seaT=12;banner('Moisés','As águas se dividiram')}else{S.en.forEach(e=>e.frz=3);banner('Moisés','Estende a mão')}}
}
function sowLand(px,py){
  let best=-1,bd=20;MAP.slots.forEach((s,i)=>{if(S.tw[i])return;const d=Math.abs(s.x-px);if(d<bd&&Math.abs(s.y-py)<6){bd=d;best=i}});
  if(best<0){pop(px,py-12,'as aves comeram','#c9a99a');for(let i=0;i<2;i++)S.fx.push({k:'bird',x:px,y:py-4,vx:rnd(-40,40),vy:-60,t:0,max:1});return}
  plantAt(best,[pick(['videira','roma','oliveira'])],false,.15);
}

// ---------- boss behaviour
function throwStone(e,j){const P=S.p,T=1,g=300,tx=P.x+(j-1)*18,ty=P.y-6,sx=e.x-8,sy=e.y-34;
  S.eproj.push({x:sx,y:sy,vx:(tx-sx)/T,vy:(ty-sy)/T-.5*g*T,g,life:3});sfx('stone')}
function bossAI(e,dt){
  if(e.k==='golias'){e.st-=dt;if(e.st<=0){const n=e.ph2?3:1;for(let j=0;j<n;j++)throwStone(e,n===1?1:j);e.st=e.ph2?2.4:3.6}}
  if(e.k==='farao'){e.st-=dt;if(e.st<=0){const n=e.ph2?4:3;for(let j=0;j<n;j++){spawn(pick(e.ph2?['odio','inveja','gula','discordia']:['odio','inveja','discordia']),e.x+10+j*7);S.total++}
    e.st=e.ph2?4:6.5;pop(e.x,e.y-40,'pragas!','#5a8aff',9);shake(3)}}
  if(e.k==='leviata'){
    if(e.dive>0){e.dive-=dt;e.x-=30*dt;if(Math.random()<dt*20)S.parts.push({x:e.x+rnd(-20,20),y:e.y-rnd(0,4),vx:0,vy:-rnd(10,30),g:-10,life:.6,max:.6,c:'#bfe8ff',s:1,a:.7});
      if(e.dive<=0){shake(7);flash(.25,'120,220,255');burst(e.x,e.y-10,30,['#bfe8ff','#5af0c0','#ffffff'],120,300,.8,2);
        MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(t&&Math.abs(s.x-e.x)<80){t.stun=4;pop(s.x,s.y-30,'atordoada','#9ad0ff')}})}}
    else{e.st-=dt;if(e.st<=0){e.dive=2;e.st=e.ph2?4.5:7;burst(e.x,e.y-6,20,['#bfe8ff','#ffffff'],80,300,.6)}}}
}

function updStory(dt){
  const P=S.p;
  for(const f of S.fruitDrops){f.t+=dt;const dist=Math.hypot(P.x-f.x,P.y-6-f.y);
    if((S.respigar>0||dist<30)&&f.t>.3){const k=dt*240/Math.max(dist,1);f.x+=(P.x-f.x)*k;f.y+=(P.y-6-f.y)*k}
    else{const py=f.y;f.vy+=300*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;let fl=gy(f.x);for(const pl of MAP.plats)if(f.x>=pl.x&&f.x<=pl.x+pl.w&&py<=pl.y&&f.y>=pl.y-2)fl=Math.min(fl,pl.y);
      if(f.y>fl-2){f.y=fl-2;f.vy*=-.3;f.vx*=.6}}
    if(dist<9){f.got=1;goalHarvest(1);const v=isChar('rute')?2:1,was=S.basket;S.mana=Math.min(MAXM,S.mana+v);S.basket=Math.min(5,S.basket+v);sfx('coin');pop(P.x,P.y-22,'+'+v+' fruto','#ffd34a');
      if(was<5&&S.basket>=5)pop(P.x,P.y-34,'cesto cheio: dê um pisão!','#ffd34a',9)}}
  S.fruitDrops=S.fruitDrops.filter(f=>!f.got&&f.t<f.life);
  S.respigar=Math.max(0,S.respigar-dt);S.rally=Math.max(0,S.rally-dt);
  if(S.pstones>0){S.pstT-=dt;if(S.pstT<=0){const e=nearest(P.x,P.y-10,230);
    if(e){const T=.35;S.proj.push({x:P.x,y:P.y-14,vx:(e.x-P.x)/T,vy:(ecy(e)-P.y+14)/T-.5*300*T,g:300,kind:'pstone',dmg:8,src:null,life:2});S.pstones--;sfx('stone')}S.pstT=.25}}
  if(S.forbid){const f=S.forbid;f.wh-=dt;if(!f.on&&f.wh<=0&&Math.abs(P.x-f.x)<90){f.wh=7;pop(f.x,f.y-52,'“Certamente não morrereis”','#c070ff')}
    if(f.on&&S.state==='wave'){f.t-=dt;if(f.t<=0){f.t=2.5;let best=null;for(const e of S.en)if(!(e.dive>0)&&(!best||e.hp>best.hp))best=e;
      if(best){S.fx.push({k:'zap',x1:f.x,y1:f.y-30,x2:best.x,y2:ecy(best),t:0,max:.3});damage(best,20);flash(.12,'180,60,220')}}}}
  if(MAPID==='jerico'&&!S.fallen){const side=P.x<423;if(S.side!==undefined&&side!==S.side&&S.t-S.lastLap>.8){S.laps++;S.lastLap=S.t;pop(P.x,P.y-28,'volta '+S.laps+'/7','#f7c948',9);sfx('horn');if(S.laps>=7)fallWalls()}S.side=side}
  if(S.folk&&!S.folk.saved){const f=S.folk,[a,b]=MAP.sea;
    if(Math.abs(P.x-f.x)<60){let tx=P.x;if(!S.seaOpen&&f.x<a&&tx>a-8)tx=a-8;f.x+=clamp(tx-f.x,-45*dt,45*dt)}
    if(!S.seaOpen&&f.x>a&&f.x<b){f.x=a-10;pop(f.x,gy(f.x)-20,'o povo voltou à margem','#9ad0ff')}
    if(f.x>b+14){f.saved=true;RUN.hp=Math.min(RUN.maxhp,RUN.hp+3);RUN.siclos+=20;banner('O povo atravessou','+3 Vida · +20 siclos');sfx('ach')}}
  if(S.idol&&S.idol.hp>0&&S.state==='wave'){S.idol.t-=dt;if(S.idol.t<=0){S.idol.t=12;let best=-1,bd=170;
    MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(t&&t.grow>=1&&!t.seduced&&!(t.ark>0)){const d=Math.abs(s.x-S.idol.x);if(d<bd){bd=d;best=i}}});
    if(best>=0){S.tw[best].seduced=true;const s=MAP.slots[best];pop(s.x,s.y-30,'seduzida pelo ídolo: pisão liberta','#f7c948')}}}
  if(MAPID==='babel'&&S.state==='wave'){if(S.babelOn>0){S.babelOn-=dt;if(S.babelOn<=0)renderHand()}
    else{S.babelT-=dt;if(S.babelT<=0){S.babelT=22;S.babelOn=6;S.perm=rshuffle([...Array(S.hand.length).keys()]);banner('Babel','As línguas se confundiram');renderHand()}}}
  if(S.floodIn>0){S.floodIn-=dt;if(S.floodIn<=0){S.flood=6;banner('O dilúvio','Só a Arca protege');sfx('wind');MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(t&&!(t.ark>0))t.stun=6})}}
  S.flood=Math.max(0,S.flood-dt);
}
function fallWalls(){S.fallen=true;MAP._fallen=true;C=GROUND.getContext('2d');C.clearRect(0,0,MAP.ww,H);drawGround();outlinedGround(()=>MAP.homeDraw());C=x;
  shake(14);flash(.5,'255,220,150');sfx('horn');banner('As muralhas caíram','Josué 6:20');
  MAP.plats.forEach(pl=>{if(pl.wall)burst(pl.x+pl.w/2,pl.y+20,20,['#8a5c3a','#b88a5a','#ecd090'],120,300,.9,2)});
  for(const e of S.en){damage(e,20);e.frz=3}}
function nearestTreeSlot(){let best=-1,bd=90;MAP.slots.forEach((s,i)=>{if(!S.tw[i])return;const d=Math.hypot(s.x-S.p.x,s.y-S.p.y);if(d<bd){bd=d;best=i}});return best}

// ---------- the gardener fights back, and gets hurt
function playerAttack(){if(S.mini==='funda')return slingShot();const p=S.p;if(p.stun>0||p.atkCD>0)return;if(tutStep===4)tutNext();const w=WEAPONS[META.weapon||'enxada'];p.atkCD=w.cd;p.swing=.22;sfx('hit');
  if(w.dash){p.dash=.22;p.dashHit=new Set();sfx('wind');return}
  for(const e of S.en){if(e.dive>0)continue;const d=EN[e.k],ddx=(e.x-p.x)*p.face,ddy=ecy(e)-(p.y-8);
    if(ddx>-(w.wide?10:4)&&ddx<w.rng+d.w/2&&Math.abs(ddy)<(w.wide?26:14)+d.h/2){damage(e,w.dmg*(1+.15*atr('for')));onoma(e.x,ecy(e)-6,'hit',.45);if(!d.boss)e.x+=p.face*(w.push||8);burst(e.x,ecy(e),5,['#ffffff','#e8dcc0'],60,200,.3)}}
  S.fx.push({k:'swing',x:p.x,y:p.y-8,f:p.face,r:w.rng,t:0,max:.2,wide:w.wide})}
function hurtPlayer(n,src){const p=S.p;if(p.inv>0||p.faint>0)return;p.hp-=n;p.inv=1.2;p.vx=(src&&src.x>p.x?-1:1)*140;p.vy=-120;p.on=false;
  shake(6);flash(.25,'255,40,40');sfx('hurt');pop(p.x,p.y-26,'-'+n+' coração','#ff4f4f',9);
  if(p.hp<=0){p.hp=0;p.stun=3;p.faint=3;const lost=Math.min(3,Math.floor(S.mana));S.mana-=lost;pop(p.x,p.y-38,'desmaiou! -'+lost+' maná','#ff4f4f',9);banner('Você desmaiou','Evite encostar nas pragas')}}
function updHazards(dt){const p=S.p;
  for(const e of S.en){if(e.dive>0||e.hp<=0)continue;const d=EN[e.k];if(Math.abs(e.x-p.x)<d.w/2+3&&Math.abs(ecy(e)-(p.y-6))<d.h/2+6){
    if(p.dash>0){if(!p.dashHit.has(e)){p.dashHit.add(e);damage(e,WEAPONS.arado.dmg);if(!d.boss)e.x+=p.face*14}}else if(!p.slam)hurtPlayer(d.boss||d.elite?2:1,e)}}
  S.fences=S.fences.filter(f=>{if(f.hp<=0){burst(f.x,f.y-6,14,['#8a5a2a','#c9a060'],70,300,.6);pop(f.x,f.y-20,'a cerca quebrou','#c9a060');return false}return true});
  S.scares=S.scares.filter(s=>(s.t-=dt)>0);S.muds=S.muds.filter(m=>(m.t-=dt)>0)}
function placeItem(k){const p=S.p;if(p.stun>0||!sysOn('barriers'))return;if(!META.items||!META.items[k]){sfx('no');pop(p.x,p.y-24,'sem '+ITEMS[k].name.toLowerCase()+': compre na loja','#c9a99a');return}
  const x0=clamp(p.x+p.face*12,10,MAP.ww-10),y0=gy(x0);META.items[k]--;saveMeta();sfx('plant');burst(x0,y0-4,10,['#8a5a2a','#c9a060'],50,200,.4);
  if(k==='cerca')S.fences.push({x:x0,y:y0,hp:30,max:30});if(k==='espantalho')S.scares.push({x:x0,y:y0,t:20});if(k==='lama')S.muds.push({x:x0,y:y0,t:15});renderItems()}

// ---------- update
function update(dt){
  S.abil=Math.max(0,(S.abil||0)-dt);if(pr('KeyC'))useAbility();
  // walking through water fills the bucket: watering is twice as fast for a while
  if(inWater(S.p.x)&&S.p.on&&!(S.bucket>0)){S.bucket=8;pop(S.p.x,S.p.y-26,'balde cheio: rega 2x','#9ad0ff',8);sfx('splash')}
  updPlayer(dt);
  for(let i=0;i<4;i++)if(pr('Digit'+(i+1),'Numpad'+(i+1)))playCard(S.babelOn>0&&S.perm[i]!=null?S.perm[i]:i);
  computeLinks(dt);updStory(dt);
  if(pr('KeyX','KeyJ'))playerAttack();if(pr('KeyQ'))placeItem('cerca');if(pr('KeyE'))placeItem('espantalho');if(pr('KeyR'))placeItem('lama');updHazards(dt);
  const regen=.75*(relic('jarro')?1.2:1)*(ascN()>=2?.85:1)*(S.goal==='seca'?.5:1)*(S.mini==='ultima'?0:1);goalUpdate(dt);miniUpdate(dt);
  if(S.mana<MAXM)S.mana=Math.min(MAXM,S.mana+regen*dt);
  S.rain=Math.max(0,S.rain-dt);
  S.wet+=((S.rain>0?1:0)-S.wet)*Math.min(1,dt*(S.rain>0?1.5:.12));
  if(S.rain>0&&Math.random()<dt*70)S.parts.push({x:S.cam+rnd(0,W+40),y:-4,vx:-30,vy:260,g:0,life:.9,max:.9,c:'#8ac8ff',s:1,a:.7});
  if(MAPID==='eden'&&Math.random()<dt*3)S.parts.push({x:S.cam+rnd(0,W+60),y:rnd(-10,60),vx:rnd(-22,-8),vy:rnd(8,16),g:0,life:9,max:9,c:pick(['#ffb0c8','#ff8ab0','#fff0f4']),s:1,sway:1});
  if(MAPID==='getsemani'&&Math.random()<dt*2)S.parts.push({x:S.cam+rnd(0,W),y:rnd(60,160),vx:rnd(-4,4),vy:rnd(-4,4),g:0,life:3,max:3,c:'#fff4a0',s:1,sway:1});
  if(MAP.storm){
    if(Math.random()<dt*(6+S.sand*90))S.parts.push({x:S.cam+W+rnd(0,30),y:rnd(50,205),vx:-rnd(120,240),vy:rnd(-6,6),g:0,life:2.6,max:2.6,c:pick(['#e8c890','#c9a070']),s:1,a:.55});
    if(S.state==='wave'){S.sandT-=dt;if(S.sandT<=0){S.sandOn=8;S.sandT=rnd(35,50);banner('Sinai','Tempestade de areia')}}
    S.sandOn-=dt;S.sand+=((S.sandOn>0?1:0)-S.sand)*Math.min(1,dt*1.2);
  }
  if(MAP.sea&&S.state==='wave'){S.seaT-=dt;if(S.seaT<=0){S.seaOpen=!S.seaOpen;S.seaT=S.seaOpen?11:9;banner(MAP.name,S.seaOpen?'As águas se abriram':'As águas se fecharam');shake(4);sfx('wind')}}
  if(S.state==='prep'){if(tutStep<0||tutStep>=5)S.between-=dt;if(pr('Enter','KeyN'))callWave();else if(S.between<=0)startWave()}
  if(S.state==='wave'){
    S.qt-=dt;if(S.q.length&&S.qt<=0){const[k,gap]=S.q.shift();spawn(k);S.qt=gap}
    if(S.talents>0&&S.mana>=MAXM){S.fullT+=dt;if(S.fullT>5){pop(S.p.x,S.p.y-26,'talento enterrado!','#ff4f7b');sfx('no');S.talents=0;S.fullT=0}}else S.fullT=0;
  }
  for(const e of S.en)e.shield=S.en.some(o=>o!==e&&o.k==='faccoes'&&Math.abs(o.x-e.x)<18&&Math.abs(o.y-e.y)<14);
  for(const e of S.en){
    const d=EN[e.k];e.t+=dt;e.flash-=dt;e.slow-=dt;e.frz-=dt;
    let m=e.frz>0?0:e.slow>0?.45:1;
    if(!d.fly&&!d.boss&&(inSea(e.x)||inWater(e.x))){const cj=relic('cajado')||isChar('moises');m*=inSea(e.x)?(cj?.2:.35):(cj?.5:1)}
    if(d.boss&&e.ph2&&e.k==='golias')m*=1.6;
    let sp=d.spd*1.2*m;
    if(d.ai==='zigzag')sp*=.7+Math.sin(e.t*2.3)*1.1;
    if(d.ai==='rage'){if(!e.rage&&e.hp<e.max*.6){e.rage=1;pop(e.x,e.y-16,'fúria!','#ff6a1a',9);vfx('puff',e.x,e.y-6,{n:5,c:'#5a4a4a'})}if(e.rage)sp*=2}
    if(d.ai==='blink'){e.bt=(e.bt??rnd(2,3.5))-dt;if(e.bt<=0){e.bt=rnd(2.5,4);vfx('blink',e.x,e.y);e.x-=26;vfx('blink',e.x,e.y)}}
    if(d.ai==='heal'){e.ht=(e.ht??3)-dt;if(e.ht<=0){e.ht=3;for(const o of S.en)if(o!==e&&o.hp>0&&!EN[o.k].boss&&Math.abs(o.x-e.x)<40&&o.hp<o.max){o.hp=Math.min(o.max,o.hp+3);vfx('heal',o.x,ecy(o),{c:'#b08aff'})}vfx('ring2',e.x,e.y-8,{c:'#b08aff',r:40})}}
    e.x-=sp*dt*(!d.fly&&S.muds.some(m=>Math.abs(e.x-m.x)<16)?.4:1);
    if(!d.fly)for(const f of S.fences)if(f.hp>0&&e.x>f.x&&e.x-f.x<d.w/2+5){e.x=f.x+d.w/2+5;f.hp-=dt*(d.boss?40:d.elite?20:6)}
    if(d.fly)for(const sc of S.scares)if(e.x>sc.x-10&&e.x-sc.x<60)e.x+=(sp+30)*dt;
    if(d.fly===0)e.y+=(gy(e.x)-e.y+(d.ai==='zigzag'?Math.sin(e.t*7)*1.5:0))*Math.min(1,dt*14);
    else if(d.fly===1)e.y=gy(e.x)-20+Math.sin(e.t*8)*3;
    else e.y=e.base+Math.sin(e.t*3)*7;
    if(d.boss)bossAI(e,dt);
    if(d.ai==='corrupt'&&!e.corrupted)MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(!t||t.joio||t.grow<1||Math.abs(s.x-e.x)>5||Math.abs(s.y-e.y)>4)return;
      const near=MAP.slots.some((o,j)=>j!==i&&S.tw[j]&&S.tw[j].kinds.includes('amendoeira')&&!S.tw[j].joio&&Math.abs(o.x-s.x)<70)||t.kinds.includes('amendoeira');
      if(near){pop(s.x,s.y-30,'a bondade protegeu','#ffd0e8');e.corrupted=1;return}
      t.joio=true;e.corrupted=1;pop(s.x,s.y-30,'virou joio! dê um pisão','#d8d860',9);burst(s.x,s.y-10,12,['#6a6a2a','#d8d860'],40,100,.6)});
    if(!d.fly&&(inWater(e.x)||inSea(e.x))&&Math.random()<dt*8)S.parts.push({x:e.x+rnd(-3,3),y:(inSea(e.x)?MAP.sea[2]:e.y)-1,vx:rnd(-15,15),vy:rnd(-45,-20),g:220,life:.4,max:.4,c:'#9ad0ff',s:1});
    if(e.slow>0&&Math.random()<dt*6)S.parts.push({x:e.x,y:ecy(e)+2,vx:0,vy:10,g:200,life:.4,max:.4,c:'#d9c24a',s:1});
    if(e.x<LIFE_X&&e.hp>0){e.hp=0;S.done++;RUN.hp-=d.dmg;S.leaks=S.leaks||{};S.leaks[e.k]=(S.leaks[e.k]||0)+d.dmg;S.lifeHit=.4;shake(7);sfx('hurt');flash(.25,'255,40,80');pop(LIFE_X+8,130,'-'+d.dmg,'#ff4f7b',11);burst(LIFE_X,150,14,['#ff4f7b','#ffe36a'],80,200,.6)}
  }
  S.en=S.en.filter(e=>e.hp>0);
  if(RUN.hp<=0){RUN.hp=0;showOver();return}
  updTowers(dt);updSet();
  for(const p of S.proj){
    const py=p.y;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
    if(p.kind==='sow'){let land=gy(p.x);if(p.vy>0)for(const pl of MAP.plats)if(p.x>=pl.x&&p.x<=pl.x+pl.w&&py<=pl.y&&p.y>=pl.y)land=Math.min(land,pl.y);
      if(p.y>=land){p.life=0;sowLand(p.x,land)}continue}
    for(const e of S.en){if(e.dive>0)continue;const d=EN[e.k];if(Math.abs(e.x-p.x)<d.w/2+3&&Math.abs(ecy(e)-p.y)<d.h/2+3){hitProj(p,e);p.life=0;break}}
    if(p.life>0&&p.y>=gy(p.x)){p.life=0;if(p.kind==='mustard')hitProj(p,null);else burst(p.x,gy(p.x),4,['#7b2fbf','#c58cff'],40,200,.3)}
  }
  S.proj=S.proj.filter(p=>p.life>0);
  const P=S.p;
  for(const s of S.eproj){s.vy+=s.g*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;
    if(Math.hypot(s.x-P.x,s.y-(P.y-6))<8){s.life=0;P.stun=.9;P.vx=-90;shake(5);flash(.2,'255,60,60');sfx('hurt');pop(P.x,P.y-26,'atordoado!','#ff9a9a',9);burst(s.x,s.y,10,['#8a8a8a','#c9c9c9'],60,250,.5)}
    else if(s.y>=gy(s.x)){s.life=0;burst(s.x,gy(s.x),8,['#8a7a6a','#c9b89a'],50,250,.4);shake(2)}}
  S.eproj=S.eproj.filter(s=>s.life>0);
  for(const d of S.drops){
    d.t+=dt;const dist=Math.hypot(P.x-d.x,P.y-6-d.y);
    if((dist<46||S.respigar>0)&&d.t>.25){const k=dt*260/Math.max(dist,1);d.x+=(P.x-d.x)*k;d.y+=(P.y-6-d.y)*k}
    else{d.vy+=d.g*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;const f=gy(d.x);if(d.y>f-2){d.y=f-2;d.vy*=-.4;d.vx*=.7}}
    if(dist<8){d.got=1;if(d.coin){S.coins+=d.v;pop(P.x,P.y-22,'+'+d.v+' moeda'+(d.v>1?'s':''),'#f7c948')}else S.mana=Math.min(MAXM,S.mana+d.v);sfx('coin')}
  }
  S.drops=S.drops.filter(d=>!d.got&&d.t<13);
  if(S.comboT>0){S.comboT-=dt;if(S.comboT<=0)S.combo=0}
  S.lifeHit=Math.max(0,S.lifeHit-dt);
  let nt=S.trevas?.82:S.levelNight===true?.55+S.wi*.05:S.levelNight===false?S.wi*.04:(MAP.nightBase||0)+S.wi*.13;if(relic('lampada'))nt*=.6;nt=Math.min(.85,nt);
  S.night+=(nt-S.night)*Math.min(1,dt*.6);
  tutCheck();
  if(S.state==='wave'&&!S.q.length&&!S.en.length)endWave();
}
function hitProj(p,e){
  if(p.kind==='grape'){damage(e,p.dmg,p.src);burst(p.x,p.y,9,['#7b2fbf','#c58cff','#5a1a9a'],80,340,.5)}
  else if(p.kind==='seed'||p.kind==='date'||p.kind==='almond'){damage(e,p.dmg,p.src);burst(p.x,p.y,5,p.kind==='date'?['#d9802a','#ffc080']:p.kind==='almond'?['#e8d0b0','#ffd0e8']:['#e8e070','#fff'],40,200,.3)}
  else if(p.kind==='pstone'){damage(e,p.dmg*(EN[e.k].boss||EN[e.k].elite?3:1));burst(p.x,p.y,8,['#9a9aa8','#d0d0d8'],60,250,.4);shake(2)}
  else if(p.kind==='fig'){damage(e,p.dmg,p.src);burst(p.x,p.y,14,['#6a2a5a','#a04a8a','#7ac050'],90,300,.5,2);shake(2)}
  else if(p.kind==='oil'){for(const f of S.en)if(Math.hypot(f.x-p.x,ecy(f)-p.y)<16){f.slow=2.6;damage(f,p.dmg,p.src)}burst(p.x,p.y,10,['#d9c24a','#fff3a0','#a89020'],60,300,.5,2)}
  else if(p.kind==='mustard'){for(const f of S.en)if(Math.hypot(f.x-p.x,ecy(f)-p.y)<20)damage(f,p.dmg,p.src);burst(p.x,p.y,18,['#e8e070','#fff','#9aaa3a'],90,220,.5,2);shake(2);flash(.08,'255,240,150')}
}
function updFx(dt){updVfx(dt);
  for(const p of S.parts){p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.sway)p.x+=Math.sin(p.life*4+p.vx)*.45}
  S.parts=S.parts.filter(p=>p.life>0);if(CFG.lite&&S.parts.length>120)S.parts.splice(0,S.parts.length-120);
  for(const p of S.pops)p.t+=dt;S.pops=S.pops.filter(p=>p.t<.9);
  for(const f of S.fx){f.t+=dt;if(f.k==='ring')f.r+=(f.max-f.r)*Math.min(1,dt*10);if(f.k==='bird'){f.x+=f.vx*dt;f.y+=f.vy*dt}if(f.k==='shock')f.r=f.max*Math.min(1,f.t/.5)}
  S.fx=S.fx.filter(f=>f.k==='ring'?f.t<.45:f.k==='shock'?f.t<.5:f.t<f.max);
  S.shake=Math.max(0,S.shake-dt*30);S.comboShow=Math.max(0,S.comboShow-dt*.8);S.flash.a=Math.max(0,S.flash.a-dt*2.2);
  if(MAP.storm){S.bolt-=dt;if(S.bolt<-3&&Math.random()<dt*.4){S.bolt=.25;shake(2)}}
}
