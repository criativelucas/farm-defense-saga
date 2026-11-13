// ---------- tower defense basics: pause, 2x speed, range rings, tree sheet (evolve or uproot), early wave bonus
const live=()=>S&&(S.state==='prep'||S.state==='wave');
function togglePause(on=!S.paused){if(!S)return;S.paused=on;const el=$('pause');el.hidden=!on;if(!on)return;
  el.innerHTML=`<div class="fi"><small>Jogo pausado</small><h3>Pausa</h3>
    <div class="col"><button class="btn" id="presume">Continuar <small>Esc</small></button><button class="btn ghost" id="prestart">Recomeçar a fase</button><button class="btn ghost" id="pquit">Sair para o menu</button></div>
    <label class="pvol">Música <input type="range" min="0" max="1" step=".05" value="${CFG.mus}" id="pmus"></label><label class="pvol">Efeitos <input type="range" min="0" max="1" step=".05" value="${CFG.sfx}" id="psfx"></label></div>`;
  $('presume').onclick=()=>togglePause(false);
  $('prestart').onclick=()=>{togglePause(false);RUN&&RUN.mode==='level'?startLevel(RUN.level):showHub()};
  $('pquit').onclick=()=>{togglePause(false);S.state='menu';RUN&&RUN.mode==='level'?showWorld():showHub()};
  $('pmus').oninput=e=>{CFG.mus=+e.target.value;saveCfg()};$('psfx').oninput=e=>{CFG.sfx=+e.target.value;saveCfg()}}
function toggleSpeed(){if(!S)return;S.speed=S.speed===2?1:2;$('bspeed').textContent=S.speed+'x';$('bspeed').classList.toggle('on',S.speed===2);sfx('card')}
addEventListener('blur',()=>{if(live()&&!S.paused)togglePause(true)});
$('bpause').onclick=e=>{e.currentTarget.blur();togglePause()};$('bspeed').onclick=e=>{e.currentTarget.blur();toggleSpeed()};

// calling the wave before the timer runs out pays a little courage bonus
function callWave(){if(!S||S.state!=='prep')return;const b=Math.round(Math.max(0,S.between)/2);if(b>0){S.coins+=b;pop(S.p.x,S.p.y-30,'+'+b+' moedas por coragem','#f7c948',9);sfx('coin')}startWave()}

// ---------- range rings
const rangeOf=(k,t)=>(STATS[k]?STATS[k].rng:40)*(t&&t.branch==='b'?1.3:1)*(S&&S.up?S.up.rng:1)*(k==='mostarda'&&t&&t.age<2?.5:1);
function ringAt(xc,yc,rad,c){const n=Math.max(24,rad*1.6|0);for(let i=0;i<n;i++){if(i%2)continue;const a=i/n*Math.PI*2+S.t*.4;r(xc+Math.cos(a)*rad,yc+Math.sin(a)*rad*.32,1,.5,c)}}
function drawRanges(){if(!live())return;
  const show=(si,kinds,t,c)=>{const s=MAP.slots[si];if(!s)return;x.globalAlpha=.75;kinds.forEach(k=>ringAt(s.x,s.y-2,rangeOf(k,t),c));x.globalAlpha=1};
  if(S.dragSlot>=0&&S.dragKinds)show(S.dragSlot,S.dragKinds,null,'#f7c948');
  if(S.sel>=0&&S.hoverSlot>=0&&S.hand[S.sel]){const I=info(S.hand[S.sel]);if(I.kinds)show(S.hoverSlot,I.kinds,null,'#f7c948')}
  const si=S.infoSlot>=0?S.infoSlot:S.sel<0?S.hoverSlot:-1,t=si>=0&&S.tw[si];if(t&&!t.joio)show(si,t.kinds,t,'#ffffff')}
function treeSlotAt(cx,cy,needTree){const[wx,wy]=screenToWorld(cx,cy);
  let best=-1,bd=needTree?22:16;MAP.slots.forEach((s,i)=>{if(needTree&&!S.tw[i])return;const d=Math.hypot(s.x-wx,(s.y-(needTree?14:8))-wy);if(d<bd){bd=d;best=i}});return best}
cv.parentElement.addEventListener('pointermove',e=>{if(!live()||e.target.closest('#menu,#hand,#treeinfo'))return;S.hoverSlot=treeSlotAt(e.clientX,e.clientY,S.sel<0)});
cv.parentElement.addEventListener('pointerdown',e=>{if(!live()||S.sel>=0||e.target.closest('button,#menu,#hand,#treeinfo,#itembar'))return;
  const si=treeSlotAt(e.clientX,e.clientY,true);if(si>=0)openTree(si);else closeTree()});

// ---------- tree sheet: what it does, how grown it is, evolve at level 3, or pull it up
const BRANCH={videira:['Vinho novo','Ramos que se estendem'],roma:['Romã madura','Romã que alcança'],oliveira:['Azeite puro','Oliveira frondosa'],sarca:['Fogo que não consome','Sarça alastrada'],
  figueira:['Figo temporão','Figueira de sombra'],tamareira:['Tâmara doce','Palmeira alta'],amendoeira:['Flor de Arão','Amendoeira vigilante'],lirio:['Lírio de Sarom','Lírio do campo'],mostarda:['Grão que move montes','Árvore das aves'],
  hissopo:['Hissopo que purifica','Ramo aspergido'],cedro:['Cedro do Líbano','Cedro altaneiro'],
  macieira:['Maçã dourada','Macieira copada'],sicomoro:['Figo do sicômoro','Galho de Zaqueu'],salgueiro:['Raiz nas águas','Ramos que choram'],
  acacia:['Espinho de acácia','Acácia do deserto'],murta:['Murta perfumada','Murta frondosa'],nogueira:['Noz de casca dura','Nogueira alta']};
const BRANCH_COST=4;
function openTree(si){const t=S.tw[si],s=MAP.slots[si];if(!t)return closeTree();S.infoSlot=si;const el=$('treeinfo'),k=t.kinds[0],I=CARDS[k]||{},st=STATS[k]||{};
  const refund=Math.floor((CARDS[k]?CARDS[k].cost:2)*.5),lv=(t.lvl||0)+1,wat=Math.min(3,t.water||0);
  const br=BRANCH[k]||['Força','Alcance'],ev=EVO[k],fu=t.kinds.length>1&&fusionOf(t.kinds[0],t.kinds[1]);
  el.innerHTML=`<button class="tx" id="tclose" aria-label="Fechar">×</button><b>${t.kinds.map(q=>CARDS[q]?CARDS[q].name:q).join(' + ')}${t.joio?' · virou joio':''}</b>
    <small>${FRUIT[k]?'Fruto: '+FRUIT[k]+' · ':''}Solo: ${{boa:'boa terra',pedra:'pedregoso',espinho:'espinhos'}[t.soil]}</small>
    <div class="trow"><span>Nível</span><i class="pips">${[1,2,3,4].map(n=>`<em class="${n<=lv?'on':''}"></em>`).join('')}</i></div>
    <div class="trow"><span>Rega</span><i class="wbar"><em style="width:${wat/3*100}%"></em></i><span>${Math.floor(wat)}/3</span></div>
    <div class="trow"><span>Dano ${st.dmg||'-'} · alcance ${Math.round(rangeOf(k,t))}</span></div>
    ${fu?`<p class="tbr">Fusão · ${fu.name}: ${fu.desc}</p>`:''}
    ${t.branch?`<p class="tbr">${br[t.branch==='a'?0:1]}: ${t.branch==='a'?'+70% de dano':'+50% de velocidade e +30% de alcance'}</p>`+
      (!ev?'':t.evo?`<p class="tbr">${ev.name}: +20% de dano. ${ev.desc} (a cada ${ev.every}s)</p>`
        :`<div class="tbtns"><button class="btn sm" id="tevo">Evoluir: ${ev.name}<small>${ev.desc} · ${EVO_COST} maná</small></button></div>`):
      (t.lvl||0)>=3?`<div class="tbtns"><button class="btn sm" data-br="a">${br[0]}<small>+70% dano · ${BRANCH_COST} maná</small></button><button class="btn sm" data-br="b">${br[1]}<small>mais rápida e longe · ${BRANCH_COST} maná</small></button></div>`
      :`<p class="tbr dim">No nível 4 ela pode evoluir. Regue e sobreviva às ondas.</p>`}
    <button class="btn ghost sm" id="tup">Arrancar · +${refund} maná</button>`;
  el.hidden=false;
  $('tclose').onclick=closeTree;
  if($('tevo'))$('tevo').onclick=()=>{if(S.mana<EVO_COST){sfx('no');pop(s.x,s.y-30,'falta maná','#c9a99a');return}
    S.mana-=EVO_COST;t.evo=1;t.pulse=1;t.pw={};sfx('super');flash(.3,'255,240,180');vfx('holy',s.x,0);vfx('sparkle',s.x,s.y-30,{s:5});S.fx.push({k:'ring',x:s.x,y:s.y-14,r:2,max:40,t:0,c:'#f7c948'});
    pop(s.x,s.y-44,ev.name+'!','#f7c948',10);banner('Evolução',ev.name+' · '+ev.ref);mission('evolve',1);openTree(si)};
  $('tup').onclick=()=>{S.tw[si]=null;S.mana=Math.min(MAXM,S.mana+refund);vfx('puff',s.x,s.y-4,{n:6,c:'#8a5a3a'});burst(s.x,s.y-6,12,['#6a3a24','#5fe08a'],60,200,.5);sfx('plant');pop(s.x,s.y-24,'arrancada · +'+refund+' maná','#c58cff');closeTree()};
  el.querySelectorAll('[data-br]').forEach(b=>b.onclick=()=>{if(S.mana<BRANCH_COST){sfx('no');pop(s.x,s.y-30,'falta maná','#c9a99a');return}
    S.mana-=BRANCH_COST;t.branch=b.dataset.br;t.pulse=1;sfx('super');vfx('holy',s.x,0);vfx('sparkle',s.x,s.y-30,{s:4});pop(s.x,s.y-44,br[t.branch==='a'?0:1]+'!','#f7c948',10);mission('evolve',1);openTree(si)})}
// ---------- Boaz's stall between waves: three upgrades for this battle, paid with the coins picked up in it,
// a reroll that costs a little more each time, or move on. The battle waits while it is open.
const WUP={
  raiz:{name:'Raízes profundas',desc:'+20% de dano das árvores',price:30,icon:'g:adubo',fn:()=>S.up.dmg*=1.2},
  galho:{name:'Galhos longos',desc:'+15% de alcance das árvores',price:25,tree:'cedro',fn:()=>S.up.rng*=1.15},
  chuva:{name:'Chuva serôdia',desc:'Maná 30% mais rápido',price:25,icon:'g:regar',fn:()=>S.up.mana*=1.3},
  pes:{name:'Pés ligeiros',desc:'O poder das árvores (pisão) recarrega 40% mais rápido',price:20,icon:'g:luva',fn:()=>S.up.stomp*=1.4},
  muro:{name:'Muro de pedras',desc:'+4 de Vida no Éden',price:20,icon:'i:cerca',fn:()=>{RUN.hp=Math.min(RUN.maxhp,RUN.hp+4)}},
  cesto:{name:'Cesto farto',desc:'As pragas soltam 50% mais moedas',price:20,icon:'g:vender',fn:()=>S.up.coin*=1.5},
  braco:{name:'Braço forte',desc:'Golpe e pisão 50% mais fortes',price:20,icon:'w:foice',fn:()=>S.up.str*=1.5},
  azeite:{name:'Bilha de azeite',desc:'+5 de maná agora',price:12,icon:'g:mel',fn:()=>{S.mana=Math.min(MAXM,S.mana+5)}}};
const shopOk=()=>RUN&&RUN.mode==='level'&&!RUN.mini&&S.goal!=='esteira'&&S.goal!=='chefe'&&RUN.level>=1&&!!META.tut&&S.coins>=12;
const upPrice=k=>Math.round(WUP[k].price*(1+.3*(S.upN[k]||0)));
function openWaveShop(){S.shop=rshuffle(Object.keys(WUP)).slice(0,3);sfx('card');renderShop()}
function closeWaveShop(){S.shop=null;renderShop()}
function renderShop(){let el=$('wshop');if(!el){el=document.createElement('div');el.id='wshop';$('stage').appendChild(el)}
  if(!S||!S.shop){el.hidden=true;return}const rp=10+5*S.rolls;
  el.innerHTML=`<div class="ws"><div class="wsh"><small>Entre as ondas</small><h3>Barraca do Boaz</h3><span class="wsc"><canvas width="12" height="12" class="coin"></canvas>${S.coins} moedas desta batalha</span></div>
    <div class="wsr">${S.shop.map(k=>{const u=WUP[k],p=upPrice(k),ok=S.coins>=p;return`<button type="button" class="wsu ${ok?'':'off'}" data-up="${k}" ${ok?'':'disabled'}><canvas data-wi="${k}"></canvas><b>${u.name}</b><span>${u.desc}</span><i><canvas width="12" height="12" class="coin"></canvas>${p}</i></button>`}).join('')}</div>
    <div class="wsf"><button type="button" class="btn ghost sm" id="wsroll" ${S.coins>=rp?'':'disabled'}>Sortear de novo · ${rp}</button><button type="button" class="btn sm" id="wsgo">Seguir <small>Enter</small></button></div></div>`;
  el.hidden=false;paintCoins();
  el.querySelectorAll('canvas[data-wi]').forEach(c=>{const u=WUP[c.dataset.wi];u.tree?treeIconTo(c,u.tree):itemIconTo(c,u.icon)});
  el.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const k=b.dataset.up,p=upPrice(k);if(S.coins<p)return;S.coins-=p;S.upN[k]=(S.upN[k]||0)+1;WUP[k].fn();sfx('coin');
    pop(S.p.x,S.p.y-26,WUP[k].name+'!','#f7c948',9);closeWaveShop()});
  $('wsroll').onclick=()=>{if(S.coins<rp)return;S.coins-=rp;S.rolls++;sfx('card');S.shop=rshuffle(Object.keys(WUP)).slice(0,3);renderShop()};
  $('wsgo').onclick=closeWaveShop}
function closeTree(){if(!S)return;S.infoSlot=-1;$('treeinfo').hidden=true}
