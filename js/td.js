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
const rangeOf=(k,t)=>(STATS[k]?STATS[k].rng:40)*(t&&t.branch==='b'?1.3:1)*(k==='mostarda'&&t&&t.age<2?.5:1);
function ringAt(xc,yc,rad,c){const n=Math.max(24,rad*1.6|0);for(let i=0;i<n;i++){if(i%2)continue;const a=i/n*Math.PI*2+S.t*.4;r(xc+Math.cos(a)*rad,yc+Math.sin(a)*rad*.32,1,.5,c)}}
function drawRanges(){if(!live())return;
  const show=(si,kinds,t,c)=>{const s=MAP.slots[si];if(!s)return;x.globalAlpha=.75;kinds.forEach(k=>ringAt(s.x,s.y-2,rangeOf(k,t),c));x.globalAlpha=1};
  if(S.dragSlot>=0&&S.dragKinds)show(S.dragSlot,S.dragKinds,null,'#f7c948');
  if(S.sel>=0&&S.hoverSlot>=0&&S.hand[S.sel]){const I=info(S.hand[S.sel]);if(I.kinds)show(S.hoverSlot,I.kinds,null,'#f7c948')}
  const si=S.infoSlot>=0?S.infoSlot:S.sel<0?S.hoverSlot:-1,t=si>=0&&S.tw[si];if(t&&!t.joio)show(si,t.kinds,t,'#ffffff')}
function treeSlotAt(cx,cy,needTree){const rc=$('stage').getBoundingClientRect(),wx=(cx-rc.left)/rc.width*W+S.cam,wy=(cy-rc.top)/rc.height*H-VY;
  let best=-1,bd=needTree?22:16;MAP.slots.forEach((s,i)=>{if(needTree&&!S.tw[i])return;const d=Math.hypot(s.x-wx,(s.y-(needTree?14:8))-wy);if(d<bd){bd=d;best=i}});return best}
cv.parentElement.addEventListener('pointermove',e=>{if(!live()||e.target.closest('#menu,#hand,#treeinfo'))return;S.hoverSlot=treeSlotAt(e.clientX,e.clientY,S.sel<0)});
cv.parentElement.addEventListener('pointerdown',e=>{if(!live()||S.sel>=0||e.target.closest('button,#menu,#hand,#treeinfo,#itembar'))return;
  const si=treeSlotAt(e.clientX,e.clientY,true);if(si>=0)openTree(si);else closeTree()});

// ---------- tree sheet: what it does, how grown it is, evolve at level 3, or pull it up
const BRANCH={videira:['Vinho novo','Ramos que se estendem'],roma:['Romã madura','Romã que alcança'],oliveira:['Azeite puro','Oliveira frondosa'],sarca:['Fogo que não consome','Sarça alastrada'],
  figueira:['Figo temporão','Figueira de sombra'],tamareira:['Tâmara doce','Palmeira alta'],amendoeira:['Flor de Arão','Amendoeira vigilante'],lirio:['Lírio de Sarom','Lírio do campo'],mostarda:['Grão que move montes','Árvore das aves']};
const BRANCH_COST=4;
function openTree(si){const t=S.tw[si],s=MAP.slots[si];if(!t)return closeTree();S.infoSlot=si;const el=$('treeinfo'),k=t.kinds[0],I=CARDS[k]||{},st=STATS[k]||{};
  const refund=Math.floor((CARDS[k]?CARDS[k].cost:2)*.5),lv=(t.lvl||0)+1,wat=Math.min(3,t.water||0);
  const br=BRANCH[k]||['Força','Alcance'];
  el.innerHTML=`<button class="tx" id="tclose" aria-label="Fechar">×</button><b>${t.kinds.map(q=>CARDS[q]?CARDS[q].name:q).join(' + ')}${t.joio?' · virou joio':''}</b>
    <small>${FRUIT[k]?'Fruto: '+FRUIT[k]+' · ':''}Solo: ${{boa:'boa terra',pedra:'pedregoso',espinho:'espinhos'}[t.soil]}</small>
    <div class="trow"><span>Nível</span><i class="pips">${[1,2,3,4].map(n=>`<em class="${n<=lv?'on':''}"></em>`).join('')}</i></div>
    <div class="trow"><span>Rega</span><i class="wbar"><em style="width:${wat/3*100}%"></em></i><span>${Math.floor(wat)}/3</span></div>
    <div class="trow"><span>Dano ${st.dmg||'-'} · alcance ${Math.round(rangeOf(k,t))}</span></div>
    ${t.branch?`<p class="tbr">${br[t.branch==='a'?0:1]}: ${t.branch==='a'?'+70% de dano':'+50% de velocidade e +30% de alcance'}</p>`:
      (t.lvl||0)>=3?`<div class="tbtns"><button class="btn sm" data-br="a">${br[0]}<small>+70% dano · ${BRANCH_COST} maná</small></button><button class="btn sm" data-br="b">${br[1]}<small>mais rápida e longe · ${BRANCH_COST} maná</small></button></div>`
      :`<p class="tbr dim">No nível 4 ela pode evoluir. Regue e sobreviva às ondas.</p>`}
    <button class="btn ghost sm" id="tup">Arrancar · +${refund} maná</button>`;
  el.hidden=false;
  $('tclose').onclick=closeTree;
  $('tup').onclick=()=>{S.tw[si]=null;S.mana=Math.min(MAXM,S.mana+refund);vfx('puff',s.x,s.y-4,{n:6,c:'#8a5a3a'});burst(s.x,s.y-6,12,['#6a3a24','#5fe08a'],60,200,.5);sfx('plant');pop(s.x,s.y-24,'arrancada · +'+refund+' maná','#c58cff');closeTree()};
  el.querySelectorAll('[data-br]').forEach(b=>b.onclick=()=>{if(S.mana<BRANCH_COST){sfx('no');pop(s.x,s.y-30,'falta maná','#c9a99a');return}
    S.mana-=BRANCH_COST;t.branch=b.dataset.br;t.pulse=1;sfx('super');vfx('holy',s.x,0);vfx('sparkle',s.x,s.y-30,{s:4});pop(s.x,s.y-44,br[t.branch==='a'?0:1]+'!','#f7c948',10);mission('evolve',1);openTree(si)})}
function closeTree(){if(!S)return;S.infoSlot=-1;$('treeinfo').hidden=true}
