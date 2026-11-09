// ---------- HUD and hand
const garble=s=>s.replace(/\S/g,()=>pick([...'ʘΔλΣЖЊѮᚠᚢᚦ϶']));
function onCardClick(i){const c=S.hand[i];if(!c)return;const I=info(c);
  if(I.kinds&&slotAt()<0){S.sel=S.sel===i?-1:i;renderHand();if(S.sel>=0)pop(S.p.x,S.p.y-24,'toque num canteiro','#f7c948');return}
  playCard(i)}
// drag a card from the hand onto a slot (or anywhere for blessings)
let drag=null;
function slotFromClient(cx,cy){const[wx,wy]=screenToWorld(cx,cy);
  let best=-1,bd=20;MAP.slots.forEach((s,i)=>{const d=Math.hypot(s.x-wx,s.y-8-wy);if(d<bd){bd=d;best=i}});return best}
function startDrag(e,i,b){if(e.button>0||!S.hand[i])return;drag={i,b,x0:e.clientX,y0:e.clientY,moved:false,ghost:null};try{b.setPointerCapture(e.pointerId)}catch(_){}}
addEventListener('pointermove',e=>{if(!drag)return;
  if(!drag.moved&&Math.hypot(e.clientX-drag.x0,e.clientY-drag.y0)>8){drag.moved=true;const c=S.hand[drag.i];if(!c)return;
    const g=document.createElement('div');g.className='hc2 dragghost';const gc=cardCanvas(c,true);g.append(gc);$('stage').append(g);drag.ghost=g;
    S.dragKinds=info(c).kinds;drag.b.classList.add('lifted')}
  if(drag.ghost){const rc=$('stage').getBoundingClientRect();drag.ghost.style.left=(e.clientX-rc.left)+'px';drag.ghost.style.top=(e.clientY-rc.top)+'px';S.dragSlot=S.dragKinds?slotFromClient(e.clientX,e.clientY):-1}});
addEventListener('pointerup',e=>{if(!drag)return;const d=drag;drag=null;if(d.ghost)d.ghost.remove();d.b.classList.remove('lifted');
  const kinds=S.dragKinds;S.dragSlot=-1;S.dragKinds=null;
  if(!d.moved){onCardClick(d.i);return}
  if(!S.hand[d.i])return;
  if(kinds){const si=slotFromClient(e.clientX,e.clientY);if(si>=0)playCard(d.i,si)}
  else{const rc=$('stage').getBoundingClientRect();if(e.clientY<rc.top+rc.height*.72)playCard(d.i)}});
cv.parentElement.addEventListener('pointerdown',e=>{
  if(!S||S.sel<0||(S.state!=='prep'&&S.state!=='wave')||e.target.closest('button,#menu'))return;
  const[wx,wy]=screenToWorld(e.clientX,e.clientY);
  let best=-1,bd=16;MAP.slots.forEach((s,i)=>{const d=Math.hypot(s.x-wx,s.y-8-wy);if(d<bd){bd=d;best=i}});
  if(best>=0)playCard(S.sel,best);
});
function flyCard(i,c,tx,ty){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  try{const stage=$('stage'),st=stage.getBoundingClientRect(),btn=$('cards').children[i];if(!btn)return;const b=btn.getBoundingClientRect();
    const I=info(c),el=document.createElement('div');el.className='hc fly t-'+I.type;
    el.innerHTML=`<canvas width="32" height="32"></canvas><b>${I.name}</b>`;iconTo(el.querySelector('canvas'),c);
    el.style.left=(b.left-st.left)+'px';el.style.top=(b.top-st.top)+'px';el.style.width=b.width+'px';stage.append(el);
    const k=st.width/W,ddx=tx*k-(b.left-st.left)-b.width/2,ddy=(ty+VY)*k-(b.top-st.top)-b.height/2;
    el.animate([{transform:'translate(0,0) rotate(0deg) scale(1)'},{transform:`translate(${ddx*.45}px,${ddy*.45-st.height*.18}px) rotate(200deg) scale(.7)`},
      {transform:`translate(${ddx}px,${ddy}px) rotate(380deg) scale(.12)`,opacity:.6}],{duration:420,easing:'cubic-bezier(.4,0,.8,.6)'}).onfinish=()=>el.remove();
  }catch(e){}
}
function waveSummary(w){const n={};w.list.forEach(([k])=>{const nm=EN[k].name;n[nm]=(n[nm]||0)+1});return Object.entries(n).map(([k,v])=>k+(v>1?' ×'+v:'')).join(' · ')}
function updHUD(){
  const live=S&&(S.state==='prep'||S.state==='wave');
  $('hud').hidden=!live;$('hand').hidden=!live;
  if(!live)return;
  [...$('cards').children].forEach((b,i)=>{if(i<S.hand.length&&S.hand[i]){const poor=S.mana<info(S.hand[i]).cost;if(b.dataset.poor==='1'&&!poor){b.classList.remove('ready');void b.offsetWidth;b.classList.add('ready')}b.dataset.poor=poor?'1':'0';b.classList.toggle('poor',poor)}});
  $('mfill').style.transform=`scaleX(${Math.min(1,S.mana/MAXM)})`;$('mtxt').textContent=Math.floor(S.mana)+' / '+MAXM;
  $('hpfill').style.transform=`scaleX(${RUN.hp/RUN.maxhp})`;$('hptxt').textContent=RUN.hp;
  const hk=S.p.hp+'/'+S.p.maxhp+(S.p.faint>0?'f':'');if($('hearts').dataset.k!==hk){$('hearts').dataset.k=hk;$('hearts').innerHTML='<span class="lbl">Lavrador</span>'+Array.from({length:S.p.maxhp},(_,i)=>`<i class="heart ${i<S.p.hp?'on':''}"></i>`).join('')+(S.p.faint>0?'<small>desmaiado</small>':'')}
  const w=S.waves[Math.min(S.wi,S.waves.length-1)];
  $('wname').textContent='Onda '+(Math.min(S.wi,S.waves.length-1)+1)+'/'+S.waves.length+' · '+(S.state==='wave'||S.reveal?w.name:'???');
  $('wfill').style.transform=`scaleX(${S.state==='wave'?S.done/S.total:0})`;
  const tm=$('timer');tm.hidden=S.state!=='prep';if(S.state==='prep')tm.textContent=S.between>99?'Enter chama a onda':`Onda em ${Math.ceil(S.between)}s · Enter`;
  const pv=$('preview');pv.hidden=S.state!=='prep'||!S.reveal;if(S.state==='prep')pv.textContent=S.reveal?'Próxima: '+waveSummary(w):'Próxima onda: ??? (use Profecia)';
  const fr=$('fruits');if(!fr.children.length)fr.innerHTML='<b>Frutos</b>'+FRUIT_ORDER.map(f=>`<span data-f="${f}" title="${f}" style="--c:${FRUIT_COL[f]}"><i>${f.slice(0,2)}</i></span>`).join('');
  fr.querySelectorAll('span').forEach(s=>s.classList.toggle('on',S.fruits.has(s.dataset.f)));
  $('setb').textContent=S.setMult>1?'Fruto em cacho: +'+Math.round((S.setMult-1)*100)+'% de dano':'';
  const ab=$('abilbtn');if(ab){const f=(S.abil||0)/abilCD();ab.style.setProperty('--cd',f);ab.classList.toggle('ready',f<=0)}
  $('fruits').hidden=!sysOn('fruitset');
  const sh=[sysOn('basket')?'Cesto '+S.basket+'/5'+(S.basket>=5?' · pisão de colheita!':''):''];
  if(MAPID==='jerico')sh.push(S.fallen?'As muralhas caíram':'Voltas pela torre: '+S.laps+'/7');
  if(S.folk)sh.push(S.folk.saved?'O povo atravessou':'Leve o povo à outra margem');
  if(S.idol)sh.push(S.idol.hp>0?'Ídolo: faltam '+S.idol.hp+' pisões':'Ídolo destruído');
  if(S.forbid&&S.forbid.on)sh.push('Fruto proibido: -2 Vida por onda');
  if(MAPID==='getsemani')sh.push('Vigiai: passe perto das árvores');
  if(S.babelOn>0)sh.push('Confusão de línguas!');
  if(S.bank)sh.push('Celeiro: '+Math.floor(S.bank)+' maná');
  if(S.pstones)sh.push('Pedras: '+S.pstones);
  sh.unshift(goalHud(),miniHud());$('storyhud').innerHTML=sh.filter(Boolean).join('<br>');
  const tal=$('tal');tal.hidden=!(S.talents||S.talentsDue);
  tal.textContent=S.talents?`Talentos: ${S.talents}${S.fullT>1?' · gaste maná!':''}`:`Talentos a receber: ${S.talentsDue}`;tal.classList.toggle('warn',S.fullT>1);
  const boss=S.en.find(e=>EN[e.k].boss||EN[e.k].elite),bb=$('boss');bb.hidden=!boss;
  if(boss){$('bname').textContent=EN[boss.k].name+(boss.ph2?' · furioso':'');$('bfill').style.transform=`scaleX(${Math.max(0,boss.hp/boss.max)})`}
}

// ---------- toast, tutorial
const toasts=[];let toastBusy=false;
function toast(t,sub){toasts.push([t,sub]);if(!toastBusy)nextToast()}
function nextToast(){const n=toasts.shift();if(!n){toastBusy=false;return}toastBusy=true;const el=$('toast');el.innerHTML=`<b>${n[0]}</b>${n[1]?`<small>${n[1]}</small>`:''}`;el.hidden=false;
  el.classList.remove('show');void el.offsetWidth;el.classList.add('show');setTimeout(()=>{el.hidden=true;nextToast()},3200)}
let tutStep=-1;
// the guided tutorial of the first level: each step shows the key to press, two or three words, and a bouncing arrow
// on the spot in the world (a bed, the tree) or on the card in the hand; the step ends when the player does it
let tutTree=-1;
const freeBed=()=>{let b=-1,bd=1e9;MAP.slots.forEach((s,i)=>{if(S.tw[i]||s.y<150||MAP.plats.some(p=>s.x>p.x-6&&s.x<p.x+p.w+6&&p.y<s.y))return;const d=Math.abs(s.x-S.p.x)+(s.x<S.p.x?40:0);if(d<bd){bd=d;b=i}});return b};
const handIdx=f=>S.hand.findIndex(c=>c&&f(c));
const TUT=[
  {id:'walk',keys:['←','→'],txt:'Ande até o canteiro',world:()=>{const i=freeBed();return i<0?null:MAP.slots[i]},done:()=>S.p.moved>30},
  {id:'jump',keys:['↑'],txt:'Pule',world:()=>({x:S.p.x,y:S.p.y-26}),done:()=>S.p.jumped},
  {id:'plant',keys:['1'],txt:'Pare no canteiro e plante',world:()=>{const i=freeBed();return i<0?null:MAP.slots[i]},card:()=>handIdx(c=>info(c).kinds)},
  {id:'water',keys:[],txt:'Fique perto: ela é regada e cresce',world:()=>tutTree>=0?{x:MAP.slots[tutTree].x,y:MAP.slots[tutTree].y-22}:null,done:()=>tutTree>=0&&S.tw[tutTree]&&(S.tw[tutTree].water||0)>=1},
  {id:'slam',keys:['↑','↓'],txt:'Pule e caia em cima dela',world:()=>tutTree>=0?{x:MAP.slots[tutTree].x,y:MAP.slots[tutTree].y-34}:null},
  {id:'bless',keys:['2'],txt:'Use a bênção',card:()=>handIdx(c=>catOf(c)==='bencao'),enter:()=>{
    if(handIdx(c=>catOf(c)==='bencao')<0){const j=S.hand.findIndex(c=>c&&!info(c).kinds);const k=j>=0?j:S.hand.length-1;if(S.hand[k])S.draw.push(S.hand[k]);S.hand[k]=mk('mana');S.newIdx=k;renderHand()}
    S.mana=Math.max(S.mana,3)}},
  {id:'attack',keys:['X'],txt:'Golpeie com a ferramenta',world:()=>({x:S.p.x+S.p.face*14,y:S.p.y-10})},
  {id:'wave',keys:['Enter'],txt:'Chame a onda quando quiser',dom:()=>$('timer')}];
function startTutorial(){tutStep=0;tutTree=-1;TUT.forEach(t=>delete t._in);showTut()}
function showTut(){const el=$('tut');if(tutStep<0||tutStep>=TUT.length){el.hidden=true;tutArrow(null);return}const T=TUT[tutStep];if(T.enter&&!T._in){T._in=1;T.enter()}
  el.hidden=false;el.innerHTML=`<i class="tutdots">${TUT.map((_,i)=>`<b class="${i<tutStep?'ok':i===tutStep?'now':''}"></b>`).join('')}</i>${T.keys.map(k=>`<kbd>${k}</kbd>`).join('')}<span>${T.txt}</span><button type="button" id="tutskip">Pular</button>`;
  el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');
  $('tutskip').onclick=e=>{e.currentTarget.blur();endTutorial()}}
function tutNext(){tutStep++;sfx('coin');burst(S.p.x,S.p.y-20,12,['#ffe36a','#9ff7b8','#ffffff'],70,200,.5);if(tutStep>=TUT.length)endTutorial();else showTut()}
function endTutorial(){tutStep=-1;META.tut=1;saveMeta();$('tut').hidden=true;tutArrow(null);document.querySelectorAll('.tutglow').forEach(e=>e.classList.remove('tutglow'))}
// an event from the game (plant, slam, bless, attack, wave): moves on when it is the step being taught
function tutEvent(id,arg){if(tutStep<0||!TUT[tutStep]||TUT[tutStep].id!==id)return;if(id==='plant')tutTree=arg;tutNext()}
function tutCheck(){if(tutStep<0||!S)return;const T=TUT[tutStep];if(!T)return;if(T.done&&T.done())return tutNext();
  // the arrow over a card in the hand or over a HUD element, placed on the stage
  let tgt=null;const ci=T.card?T.card():-1;document.querySelectorAll('.tutglow').forEach(e=>e.classList.remove('tutglow'));
  if(ci>=0){tgt=$('cards').children[ci];if(tgt){tgt.classList.add('tutglow');const k=T.keys[0];if(k&&k!==String(ci+1)){T.keys=[String(ci+1)];showTut()}}}
  else if(T.dom){tgt=T.dom();if(tgt)tgt.classList.add('tutglow')}tutArrow(tgt)}
function tutArrow(tgt){const a=$('tutarrow');if(!tgt||tgt.hidden){a.hidden=true;return}const st=$('stage').getBoundingClientRect(),b=tgt.getBoundingClientRect();
  a.hidden=false;a.style.left=((b.left+b.width/2-st.left)/st.width*100)+'%';a.style.top=((b.top-st.top)/st.height*100)+'%'}
// the arrow in the world, drawn with the scene: chunky, gold with a dark outline, bobbing over the target
function drawTutWorld(){if(tutStep<0||!TUT[tutStep]||!TUT[tutStep].world)return;const p=TUT[tutStep].world();if(!p)return;
  const X=Math.round(clamp(p.x,S.cam+12,S.cam+W-12)),Y=Math.round(p.y-14-Math.abs(Math.sin(S.t*5))*5);
  const A=[[0,0,7,0],[0,1,7,1],[0,2,7,2],[0,3,7,3],[-3,4,13,4],[-2,5,11,5],[-1,6,9,6],[0,7,7,7],[1,8,5,8],[2,9,3,9]];
  for(const[dx,dy,w]of A)r(X-4+dx-1,Y+dy-1,w+2,3,'#1a0806');for(const[dx,dy,w]of A)r(X-4+dx,Y+dy,w,1,dy<4?'#ffe36a':'#f7b030');
  r(X-3,Y,2,3,'#fff6c0');x.globalAlpha=.35+.25*Math.sin(S.t*6);ring(p.x,p.y+(p.y<S.p.y-18?0:2),8,'#ffe36a');x.globalAlpha=1}

// ---------- menus
const catOf=c=>c.hyb?'hibrida':CARDS[c.k]&&CARDS[c.k].own?'propria':info(c).type;
const CAT_LABEL={semente:'Semente',hibrida:'Enxerto',propria:'Carta de personagem',bencao:'Bênção',parabola:'Parábola',joio:'Joio'};
// cards lean toward the pointer; consecrated cards catch the light
addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.card,.card2');if(!c)return;const b=c.getBoundingClientRect(),px=(e.clientX-b.left)/b.width-.5,py=(e.clientY-b.top)/b.height-.5;
  c.style.setProperty('--rx',(-py*12)+'deg');c.style.setProperty('--ry',(px*12)+'deg');c.style.setProperty('--mx',((px+.5)*100)+'%');c.style.setProperty('--my',((py+.5)*100)+'%')});
addEventListener('pointerout',e=>{const c=e.target.closest&&e.target.closest('.card,.card2');if(c&&!c.contains(e.relatedTarget)){c.style.removeProperty('--rx');c.style.removeProperty('--ry')}});
function showStory(){const st=STORY[MAPID];if(!st)return;const el=$('story');el.innerHTML=`<small>${MAP.name} · ${st[0]}</small><span>${st[1]}</span>`;el.hidden=false;
  el.classList.remove('show');void el.offsetWidth;el.classList.add('show');clearTimeout(showStory.t);showStory.t=setTimeout(()=>el.hidden=true,9000)}
function menu(html,cards=[],onCard=null){
  const m=$('menu'),st=m.scrollTop;m.innerHTML=html;m.hidden=false;m.scrollTop=st;m.classList.remove('scene');
  if(S&&S.state!=='title')S.state='menu';
  window.menuCards=cards;window.menuClick=onCard;
  if(typeof paintCards==='function')paintCards(m,cards);
  m.querySelectorAll('canvas[data-art]').forEach(c=>{const card=cards.find(k=>String(k.uid)===c.dataset.art);if(card)cardArtTo(c,card)});
  m.querySelectorAll('canvas[data-emb]').forEach(c=>embTo(c,c.dataset.emb));
  m.querySelectorAll('canvas[data-relic]').forEach(c=>relicIconTo(c,c.dataset.relic));
  m.querySelectorAll('canvas[data-node]').forEach(c=>nodeIconTo(c,c.dataset.node));
  m.querySelectorAll('canvas[data-enemy]').forEach(c=>enemyIconTo(c,c.dataset.enemy));
  m.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{sfx('card');GO[b.dataset.go]()});
  const go=m.querySelector('.btn:not([disabled])');if(go)go.focus({preventScroll:true});
  fitPages();requestAnimationFrame(()=>fitPages());
}
// long grids are cut into pages that fit the screen, with ‹ 1 / 3 › under them, so menus never need scrolling;
// it measures the real rows, so it adapts to the window size (and runs again when the window changes)
const PAGED='.book .grid,.achs .grid,.minis';
function fitPages(){const m=$('menu');if(m.hidden)return;m.classList.add('measuring');try{fitPagesNow(m)}finally{m.classList.remove('measuring')}}
function fitPagesNow(m){const box=m.querySelector('.mbox')||m.firstElementChild;if(box)box.style.zoom='';
  m.querySelectorAll(PAGED).forEach(grid=>{const items=[...grid.children];items.forEach(el=>el.style.display='');const nx=grid.nextElementSibling;if(nx&&nx.classList.contains('pager'))nx.remove();
    if(m.scrollHeight-m.clientHeight<=1||items.length<2)return;
    const tops=[...new Set(items.map(el=>el.offsetTop))],cols=items.filter(el=>el.offsetTop===tops[0]).length,rowH=tops.length>1?tops[1]-tops[0]:items[0].offsetHeight;
    const pager=document.createElement('div');pager.className='pager';pager.innerHTML='<button type="button" class="btn ghost">‹</button><span></span><button type="button" class="btn ghost">›</button>';grid.after(pager);
    let rows=Math.max(1,tops.length-Math.ceil((m.scrollHeight-m.clientHeight)/rowH)),per,pages,pg=+(grid.dataset.page||0);
    const show=()=>{per=cols*rows;pages=Math.ceil(items.length/per);pg=Math.min(pg,pages-1);items.forEach((el,i)=>el.style.display=i>=pg*per&&i<(pg+1)*per?'':'none');
      pager.querySelector('span').textContent=(pg+1)+' / '+pages;grid.dataset.page=pg;const[a,b]=pager.querySelectorAll('button');a.disabled=pg===0;b.disabled=pg>=pages-1};
    show();while(rows>1&&m.scrollHeight-m.clientHeight>1){rows--;show()}
    const[a,b]=pager.querySelectorAll('button');a.onclick=()=>{pg--;sfx('card');show()};b.onclick=()=>{pg++;sfx('card');show()}});
  // what still does not fit (a small screen, a long panel) shrinks a little instead of scrolling, down to 70%
  if(!box||box.classList.contains('farmhub')||box.classList.contains('cutscene'))return;const over=m.scrollHeight-m.clientHeight;
  if(over>1){let z=Math.max(.7,(m.clientHeight-2)/m.scrollHeight);box.style.zoom=z.toFixed(3);while(z>.7&&m.scrollHeight-m.clientHeight>1){z-=.02;box.style.zoom=z.toFixed(3)}}}
let fitT=0;addEventListener('resize',()=>{clearTimeout(fitT);fitT=setTimeout(fitPages,150)});
function hideMenu(){$('menu').hidden=true;$('menu').innerHTML=''}
$('menu').addEventListener('click',e=>{const el=e.target.closest('.card,.card2');if(!el||!window.menuClick)return;
  const c=window.menuCards.find(k=>String(k.uid)===el.dataset.uid);if(c){sfx('card');window.menuClick(c)}});
const GO={};
const relicChips=()=>RUN.relics.map(k=>`<span class="relic" title="${RELICS[k].name}: ${RELICS[k].desc}"><canvas width="32" height="32" data-relic="${k}"></canvas>${RELICS[k].name}</span>`).join('');
function runBar(){return `<div class="runbar"><span>❤ <b>${RUN.hp}</b>/${RUN.maxhp}</span><span>Siclos <b>${RUN.siclos}</b></span><span>${CHARS[RUN.char].name}${RUN.asc?' · Ascensão '+RUN.asc:''}${RUN.daily?' · Desafio diário':''}</span><span>Bolsa <b>${RUN.deck.length}</b> cartas</span></div>${RUN.relics.length?`<div class="relics">${relicChips()}</div>`:''}`}

// ---------- title, characters, ascension
function showTitle(){
  if(!S||!S.node)blankBattle('eden',true);S.state='title';MUS.mode='calm';
  const saved=store.get('fds-run',null),today=todayKey(),best=META.daily[today];
  menu(`<div class="mbox"><small class="eyebrow">O fruto do Espírito · Gálatas 5:22-23</small><h1>Farm Defense Saga</h1>
    <p>Você é o lavrador. As obras da carne querem invadir o jardim. Atravesse três atos, do Éden ao Abismo, plantando cada fruto contra a obra que ele vence.</p>
    <div class="col">
      ${saved?`<button class="btn" data-go="cont">Continuar jornada · ${ACTS[saved.RUN.act].name}</button>`:''}
      <button class="btn ${saved?'ghost':''}" data-go="newrun">Nova jornada</button>
      <button class="btn ghost" data-go="daily">Desafio diário${best!=null?' · recorde '+best:''}</button>
      <div class="row"><button class="btn ghost" data-go="codex">Códex</button><button class="btn ghost" data-go="achs">Conquistas ${Object.keys(META.ach).length}/${Object.keys(ACH).length}</button></div>
    </div>
    <p class="keys">← → andar · ↑ pular · ↓ no ar: pisão · 1 a 4 jogar carta (ou toque na carta e depois no canteiro) · Enter chama a onda · M som</p></div>`);
}
GO.cont=()=>{const sv=store.get('fds-run',null);if(!sv)return showTitle();RUN=sv.RUN;UID=sv.UID;initAudio();RUN.needDeck?showDeck():showJourney()};
GO.newrun=()=>showChars();
GO.daily=()=>{const k=todayKey();newRun('lavrador',0,true,+k.replace(/-/g,''));initAudio()};
GO.codex=()=>showCodex('cartas');GO.achs=()=>showAchs();GO.title=()=>showTitle();
const todayKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function showChars(){
  let ch='lavrador',as=Math.min(META.ascMax,0);
  const render=()=>{
    menu(`<div class="mbox"><small class="eyebrow">Nova jornada</small><h2>Escolha o lavrador</h2>
      <div class="grid g5">${Object.entries(CHARS).map(([k,c])=>{const ok=META.chars[k];return`<button type="button" class="pick ${ch===k?'on':''} ${ok?'':'locked'}" data-ch="${k}" ${ok?'':'disabled'}>
        <canvas width="32" height="40" data-char="${k}"></canvas><b>${c.name}</b><small>${ok?c.desc:'Bloqueado: '+c.hint}</small>${ok&&c.card?`<small>Carta: ${CARDS[c.card].name}</small>`:''}${attrRows(k)}<i>${c.ref}</i></button>`}).join('')}</div>
      <div class="sec"><h3>Ascensão ${as}</h3><div class="row" style="justify-content:flex-start">${ASC.map((t,i)=>`<button type="button" class="btn ghost ${as===i?'act':''}" data-as="${i}" ${i>META.ascMax?'disabled':''}>${i}</button>`).join('')}</div>
        <p class="help" style="text-align:left">${ASC.slice(1,as+1).map((t,i)=>(i+1)+'. '+t).join(' · ')||'Sem regras extras. Vença uma jornada para liberar a Ascensão 1.'}</p></div>
      <div class="row"><button class="btn ghost" data-go="title">Voltar</button><button class="btn" id="go">Começar com ${CHARS[ch].name}</button></div></div>`);
    $('menu').querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{ch=b.dataset.ch;render()});
    $('menu').querySelectorAll('[data-as]').forEach(b=>b.onclick=()=>{as=+b.dataset.as;render()});
    $('menu').querySelectorAll('canvas[data-char]').forEach(c=>charIconTo(c,c.dataset.char));
    $('go').onclick=()=>{initAudio();newRun(ch,as,false,0)};
  };render();
}
function charIconTo(cvs,k){const g=hdCtx(cvs,32,40);const keep=RUN;RUN={char:k};C=g;
  try{drawGardener({face:1,x:14,y:36,vx:0,vy:0,on:true,sq:1,anim:0,slam:false,stun:0})}finally{C=x;RUN=keep}}

// ---------- starting a journey
function newRun(char,asc,daily,seed){
  if(daily)seedRng(seed);else RNG=Math.random;
  UID=1;
  RUN={char,asc,daily,seed:seed||0,act:0,row:0,rows:[],path:[],hp:asc>=3?15:20,maxhp:20,siclos:0,coll:[],deck:[],relics:[],handSize:4,esau:-1,samaritano:0,seenEv:[],
       stats:{kills:0,bosses:0},podas:0,needDeck:true};
  RUN.coll=START.map(k=>mk(k));{const cc=CHARS[char].card;if(cc)RUN.coll.unshift(mk(cc),mk(cc))}
  if(char==='noe')['tamareira','amendoeira','figueira','lirio'].forEach(k=>RUN.coll.push(mk(k)));
  RUN.deck=RUN.coll.slice(0,deckMax());
  META.stats.runs++;saveMeta();
  genAct();showDeck();
}
const deckMax=()=>(RUN.char==='noe'?11:10)+((META.upg&&META.upg.bag)||0);
function nodeRng(salt){if(RUN.daily)seedRng(RUN.seed*31+RUN.act*1000+RUN.row*37+salt);else RNG=Math.random}
function genAct(){
  nodeRng(1);const a=RUN.act,pool=ACTS[a].pool,b=()=>({type:'batalha',map:rpick(pool)});
  const choice=(n,types)=>rshuffle(types).slice(0,n).map(t=>t==='batalha'?b():t==='elite'?{type:'elite',map:rpick(pool)}:{type:t});
  RUN.rows=[[b()],choice(3,['batalha','evento','mercado','descanso','altar','evento']),choice(2,['batalha','elite','evento']),
    choice(3,['evento','mercado','altar','batalha','evento']),choice(2,['descanso','mercado','altar']),[{type:'chefe',map:ACTS[a].arena}]];
  RUN.row=0;RUN.path=[];
  if(RUN.esau>=0&&RUN.esau<a){RUN.handSize=4;RUN.esau=-1}
}
function saveRun(){if(RUN&&RUN.mode==='level')return;store.set('fds-run',{RUN,UID})}

// ---------- deck builder (start of each act)
// ---------- choosing seeds before a level, like Plants vs. Zombies: the bank on top, your cards below, the level waiting on the right
function showChoose(){
  const n=RUN.level,[mn,max]=levelBag(n),node=levelNode();
  blankBattle(node.map,node.night===false,lvVariant(node));S.cam=MAP.ww-W;
  const cnt={};node.waves.forEach(w=>w.list.forEach(([k])=>{if(!EN[k].hide)cnt[k]=(cnt[k]||0)+1}));
  Object.entries(cnt).forEach(([k,c])=>{for(let j=0;j<Math.min(c,3);j++){const d=EN[k],x0=MAP.ww-rnd(20,150),e={k,born:-9,x:x0,y:gy(x0),hp:1,max:1,t:rnd(0,9),flash:0,slow:0,frz:0,base:rnd(80,110),st:9};
    if(d.fly===1)e.y=gy(x0)-20;if(d.fly===2)e.y=e.base;S.en.push(e)}});
  S.en.sort((a,b)=>a.y-b.y);
  const sel=RUN.deck.slice(0,max),locked=UNLOCK_ORDER.filter(k=>k&&!META.unlocked.includes(k)).length;
  const goal=LEVELS[n].goal;
  const TORD={semente:0,hibrida:0,parabola:1,bencao:2,propria:3,joio:4},rv=c=>RAR_ORDER.indexOf(rarOf(c));
  const view=[...RUN.coll].sort((a,b)=>TORD[catOf(a)]-TORD[catOf(b)]||rv(b)-rv(a)||info(a).cost-info(b).cost);let filt='all';
  // fill for me: about 60% trees (best ones first, then their copies), then the best other cards, then anything left
  const auto=()=>{sel.length=0;const tree=c=>!!info(c).kinds,key=c=>c.k+(c.hyb||''),add=(ok,lim)=>{for(const c of view){if(sel.length>=lim)return;if(!sel.includes(c)&&catOf(c)!=='joio'&&ok(c))sel.push(c)}};
    const nT=Math.ceil(max*.6),has=c=>sel.some(o=>key(o)===key(c));
    add(c=>tree(c)&&!has(c),nT);add(tree,nT);add(c=>!tree(c)&&!has(c),max);add(()=>true,max)};
  const render=()=>{const ok=goal==='esteira'||sel.length>=Math.min(mn,RUN.coll.length);
    menu(`<div class="choose"><div class="bank"><div class="bmana"><canvas width="32" height="32" id="bmana"></canvas><b>${6+2*((META.upg&&META.upg.mana)||0)+tl('mana')}</b></div>
      ${Array.from({length:max},(_,i)=>sel[i]?`<button type="button" class="bslot full" data-out="${i}" title="Tirar ${info(sel[i]).name}"><canvas width="${MINI_W*CK}" height="${MINI_H*CK}" data-mini="${sel[i].uid}"></canvas></button>`:`<span class="bslot"></span>`).join('')}</div>
      <div class="cpanel"><h2>Escolha suas sementes</h2>
        <div class="cfilt">${[['all','Todas'],['semente','Sementes'],['bencao','Bênçãos'],['parabola','Parábolas']].map(([k,t])=>`<button type="button" class="${filt===k?'on':''}" data-filt="${k}">${t}</button>`).join('')}<span></span><button type="button" id="cauto">Montar sozinho</button><button type="button" id="cclear">Limpar</button></div>
        <div class="cgrid">${view.filter(c=>filt==='all'||catOf(c)===filt||(filt==='bencao'&&catOf(c)==='propria')||(filt==='semente'&&catOf(c)==='hibrida')).map(c=>{const on=sel.includes(c);return`<button type="button" class="cpick r-${rarOf(c)} ${on?'used':''}" data-in="${c.uid}" title="${info(c).name}: ${info(c).desc}"><canvas width="${MINI_W*CK}" height="${MINI_H*CK}" data-mini="${c.uid}"></canvas></button>`}).join('')}
          ${Array.from({length:Math.max(0,Math.min(locked,24-RUN.coll.length))},()=>'<span class="cpick lock"></span>').join('')}</div>
        <p class="cinfo" id="cinfo">${goal?`<b class="goalt">${GOALS[goal].name}:</b> ${GOALS[goal].desc} `:''}${LEVELS[n].id} · ${LEVELS[n].night?'Noite':'Dia'} · escolha de ${Math.min(mn,RUN.coll.length)} a ${max} cartas. A bolsa cresce conforme você avança.</p>
        <button class="btn plantar" id="go" ${ok?'':'disabled'}>Plantar!</button></div>
      <div class="cside"><button class="btn ghost" id="backmap">‹ Mapa</button><button class="btn ghost" id="cpacks">Tenda</button><button class="btn ghost" id="cshop">Quitanda</button><button class="btn ghost" id="ccodex">Códex</button></div></div>`);
    S.state='choose';
    const all=[...RUN.coll];$('menu').querySelectorAll('canvas[data-mini]').forEach(cv2=>{const c=all.find(k=>String(k.uid)===cv2.dataset.mini);if(c)cv2.getContext('2d').drawImage(cardCanvas(c,true),0,0)});
    {const g=hdCtx($('bmana'),32,32);C=g;disc(16,16,11,'#6a24a8');disc(16,16,9,'#9b4be0');disc(13,12,3,'#e2b0ff');C=x}
    $('menu').querySelectorAll('[data-in]').forEach(b=>{b.onmouseenter=()=>{const c=all.find(k=>String(k.uid)===b.dataset.in);$('cinfo').textContent=info(c).name+': '+info(c).desc};
      b.onclick=()=>{const c=all.find(k=>String(k.uid)===b.dataset.in),i=sel.indexOf(c);if(i>=0)sel.splice(i,1);else if(sel.length<max)sel.push(c);else{sfx('no');return}sfx('card');render()}});
    $('menu').querySelectorAll('[data-out]').forEach(b=>b.onclick=()=>{sel.splice(+b.dataset.out,1);sfx('card');render()});
    $('go').onclick=()=>{RUN.deck=[...sel];RUN.needDeck=false;startLevelBattle()};
    $('backmap').onclick=()=>showWorld();$('cshop').onclick=()=>showShop2('ferramentas');$('ccodex').onclick=()=>showCodex('cartas');$('cpacks').onclick=()=>showPacks();
    $('menu').querySelectorAll('[data-filt]').forEach(b=>b.onclick=()=>{filt=b.dataset.filt;sfx('card');render()});
    $('cauto').onclick=()=>{auto();sfx('card');render()};$('cclear').onclick=()=>{sel.length=0;sfx('card');render()}};
  render()}
function showDeck(){
  if(RUN.mode==='level')return showChoose();
  RUN.needDeck=true;saveRun();
  const cel=META.celeiro.map(o=>o.hyb?mk('hyb',{hyb:o.hyb,rare:true,cel:true}):mk(o.k,{rare:true,cel:true}));
  const lvl=RUN.mode==='level',bag=lvl?levelBag(RUN.level):[8,deckMax()],max=bag[1],sel=new Set(RUN.deck.slice(-max).map(c=>c.uid));
  const mn=Math.min(bag[0],RUN.coll.length+cel.length);
  const render=()=>{const n=sel.size,ok=n>=mn&&n<=max;
    menu(`<div class="mbox">${lvl?`<div class="row" style="justify-content:space-between;width:100%"><button class="btn ghost" id="backmap">‹ Mapa</button><small class="eyebrow">Fase ${LEVELS[RUN.level].id} · ${LEVELS[RUN.level].night?'Noite':'Dia'}</small><span></span></div>`:`<small class="eyebrow">${ACTS[RUN.act].name} · ${ACTS[RUN.act].title}</small>`}<h2>${lvl?'Escolha suas sementes':'Monte sua bolsa de sementes'}</h2>
      ${lvl?wavePreviewHTML():''}<p>Escolha de ${mn} a ${max} cartas. Na batalha você segura ${RUN.handSize} na mão; jogou uma, compra a próxima.</p>
      <div class="sec"><h3>Suas cartas · ${n} na bolsa</h3><div class="grid">${RUN.coll.map(c=>cardHTML(c,sel.has(c.uid)?'on':'')).join('')}</div></div>
      ${cel.length?`<div class="sec"><h3>Celeiro · cartas consagradas de colheitas anteriores</h3><div class="grid">${cel.map(c=>cardHTML(c,sel.has(c.uid)?'on':'')).join('')}</div></div>`:''}
      <div class="row"><span class="help">${ok?'Bolsa pronta.':n<mn?'Faltam '+(mn-n)+' cartas.':'Tire '+(n-max)+' carta'+(n-max>1?'s':'')+'.'}</span>
      <button class="btn" id="go" ${ok?'':'disabled'}>${lvl?'Começar a fase':'Seguir para a jornada'}</button></div></div>`,[...RUN.coll,...cel],c=>{sel.has(c.uid)?sel.delete(c.uid):sel.add(c.uid);render()});
    $('go').onclick=()=>{const all=[...RUN.coll,...cel];RUN.deck=all.filter(c=>sel.has(c.uid));
      RUN.deck.forEach(c=>{if(c.cel){delete c.cel;RUN.coll.push(c)}});RUN.needDeck=false;lvl?startLevelBattle():showJourney()};
    if($('backmap'))$('backmap').onclick=()=>showWorld();
  };render();
}

// ---------- journey map
function showJourney(){
  saveRun();MUS.mode='calm';
  if(!S||S.state==='title'||!S.node)blankBattle(ACTS[RUN.act].pool[0]);
  const rows=RUN.rows.map((row,ri)=>`<div class="jrow ${ri<RUN.row?'past':ri===RUN.row?'now':'next'}">${row.map((n,ni)=>{
      const chosen=RUN.path[ri]===ni,can=ri===RUN.row,N=NODES[n.type];
      return `<button type="button" class="node n-${n.type} ${chosen?'chosen':''}" ${can?`data-node-i="${ni}"`:'disabled'} title="${N.desc}">
        <canvas width="32" height="32" data-node="${n.type}"></canvas><b>${N.name}</b><small>${n.map?MAPS[n.map].name:N.desc}</small></button>`}).join('')}</div>`).join('<div class="jlink">›</div>');
  menu(`<div class="mbox wide"><small class="eyebrow">${ACTS[RUN.act].name} · ${ACTS[RUN.act].title}</small><h2>Escolha o caminho</h2>${runBar()}
    <div class="journey">${rows}</div>
    <div class="row"><button class="btn ghost" data-go="viewdeck">Ver bolsa</button><button class="btn ghost" data-go="title">Salvar e sair</button></div></div>`);
  $('menu').querySelectorAll('[data-node-i]').forEach(b=>b.onclick=()=>enterNode(+b.dataset.nodeI));
}
GO.viewdeck=()=>{menu(`<div class="mbox"><h2>Sua bolsa</h2>${runBar()}<div class="grid">${RUN.deck.map(c=>cardHTML(c)).join('')}</div><button class="btn" data-go="journey">Voltar</button></div>`,RUN.deck)};
GO.journey=()=>showJourney();
function enterNode(ni){
  const n=RUN.rows[RUN.row][ni];RUN.path[RUN.row]=ni;
  if(n.type==='batalha'||n.type==='elite'||n.type==='chefe'){
    nodeRng(10+ni);n.waves=[0,1,2].map(i=>genWave(RUN.act,i,n.type,RUN.asc));
    hideMenu();startBattle(n);return}
  if(n.type==='evento')return showEvent();
  if(n.type==='mercado')return showShop();
  if(n.type==='descanso')return showRest();
  if(n.type==='altar')return showAltar();
}
function advance(){RUN.row++;if(RUN.row>=RUN.rows.length){showHarvest();return}showJourney()}

// ---------- card picker used by tent, altar, shop and events
function pickCards(title,sub,filter,n,onDone){
  let chosen=[];const pool=RUN.deck.filter(filter);
  const render=()=>{menu(`<div class="mbox"><h2>${title}</h2><p>${sub}</p><div class="grid">${pool.map(c=>cardHTML(c,chosen.includes(c)?'mark':'')).join('')}</div>
    <div class="row"><button class="btn ghost" id="skip">Cancelar</button><button class="btn" id="go" ${chosen.length===n?'':'disabled'}>Confirmar</button></div></div>`,pool,c=>{
      if(chosen.includes(c))chosen=chosen.filter(k=>k!==c);else if(chosen.length<n)chosen.push(c);else chosen=[...chosen.slice(1),c];render()});
    $('skip').onclick=()=>onDone(null);$('go').onclick=()=>onDone(chosen)};render();
}
function prune(c){RUN.deck=RUN.deck.filter(k=>k!==c);RUN.coll=RUN.coll.filter(k=>k!==c);RUN.podas++;META.stats.podas++;saveMeta();if(META.stats.podas>=10)unlockAch('poda')}
function graft(a,b){const h=mk('hyb',{hyb:[a.k,b.k],rare:a.rare||b.rare});[a,b].forEach(c=>{RUN.deck=RUN.deck.filter(k=>k!==c);RUN.coll=RUN.coll.filter(k=>k!==c)});RUN.deck.push(h);RUN.coll.push(h);return h}
const baseSeed=c=>!c.hyb&&CARDS[c.k].type==='semente';
function podaMany(n,then){const loop=left=>{if(!left||RUN.deck.length<=6)return then();
  pickCards('Podar','Escolha uma carta para sair da bolsa. Ainda pode podar '+left+'. A bolsa precisa de pelo menos 6.',()=>true,1,ch=>{if(!ch)return then();prune(ch[0]);loop(left-1)})};loop(n)}

// ---------- events
function showEvent(){
  nodeRng(50);const keys=Object.keys(EVENTS).filter(k=>!RUN.seenEv.includes(k));const k=rpick(keys.length?keys:Object.keys(EVENTS));RUN.seenEv.push(k);const ev=EVENTS[k];
  menu(`<div class="mbox"><small class="eyebrow">${ev.ref}</small><h2>${ev.title}</h2><p>${ev.text}</p>${runBar()}
    <div class="col">${ev.opts.map((o,i)=>`<button class="btn ${i?'ghost':''}" data-opt="${i}">${o.label}</button>`).join('')}</div></div>`);
  $('menu').querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>{nodeRng(51);const o=ev.opts[+b.dataset.opt],res=o.run();
    menu(`<div class="mbox"><small class="eyebrow">${ev.ref}</small><h2>${ev.title}</h2><p>${res}</p>${runBar()}<button class="btn" id="go">Continuar</button></div>`);
    $('go').onclick=()=>{const after=o.after;if(after==='poda2')podaMany(2,advance);else if(after==='poda3')podaMany(3,advance);else advance()}});
}

// ---------- shop, tent, altar
function priceOf(c){const I=info(c);return 15+I.cost*7+(c.rare?30:0)}
function showShop(){
  nodeRng(60);const items=[0,1,2,3,4].map(i=>mk(rpick(POOL),i===4?{rare:true}:{}));
  const free=Object.keys(RELICS).filter(k=>!RUN.relics.includes(k));let rel=free.length?rpick(free):null,podaUsed=false;
  const render=()=>{menu(`<div class="mbox"><small class="eyebrow">Mercado</small><h2>Siclos de prata</h2>${runBar()}
    <div class="grid">${items.map(c=>`<div class="shopitem">${cardHTML(c,c.sold?'dim':'')}<span class="price">${c.sold?'vendida':priceOf(c)+' siclos'}</span></div>`).join('')}</div>
    <div class="row">${rel?`<button class="btn ghost" id="buyrel" ${RUN.siclos<110?'disabled':''}><canvas width="32" height="32" data-relic="${rel}" class="inl"></canvas> ${RELICS[rel].name} · 110</button>`:''}
      <button class="btn ghost" id="buypoda" ${RUN.siclos<40||podaUsed?'disabled':''}>Podar uma carta · 40</button></div>
    ${rel?`<p class="help">${RELICS[rel].name}: ${RELICS[rel].desc}</p>`:''}
    <button class="btn" id="go">Sair do mercado</button></div>`,items,c=>{if(c.sold)return;const p=priceOf(c);if(RUN.siclos<p){sfx('no');return}RUN.siclos-=p;c.sold=1;const nc=mk(c.k,c.rare?{rare:true}:{});RUN.coll.push(nc);RUN.deck.push(nc);sfx('coin');render()});
    if($('buyrel'))$('buyrel').onclick=()=>{RUN.siclos-=110;RUN.relics.push(rel);sfx('ach');toast('Relíquia: '+RELICS[rel].name,RELICS[rel].ref);rel=null;render()};
    $('buypoda').onclick=()=>pickCards('Podar','Escolha a carta que sai da bolsa.',()=>true,1,ch=>{if(ch){RUN.siclos-=40;prune(ch[0]);podaUsed=true}render()});
    $('go').onclick=advance};render();
}
function showRest(){
  menu(`<div class="mbox"><small class="eyebrow">Tenda</small><h2>Descanse à sombra</h2><p>“Vinde a mim, todos os que estais cansados.” (Mateus 11:28)</p>${runBar()}
    <div class="col"><button class="btn" id="a">Descansar · +8 de Vida</button><button class="btn ghost" id="b">Podar uma carta</button></div></div>`);
  $('a').onclick=()=>{RUN.hp=Math.min(RUN.maxhp,RUN.hp+8);sfx('heal');advance()};
  $('b').onclick=()=>pickCards('Podar','Escolha a carta que sai da bolsa.',()=>true,1,ch=>{if(ch)prune(ch[0]);advance()});
}
function showAltar(){
  menu(`<div class="mbox"><small class="eyebrow">Altar</small><h2>Ofereça ao Senhor</h2><p>Enxerte duas sementes numa só árvore, ou consagre uma carta para que dê +50% de dano.</p>${runBar()}
    <div class="col"><button class="btn" id="a">Enxertar duas sementes</button><button class="btn ghost" id="b">Consagrar uma carta (★ +50% de dano)</button><button class="btn ghost" id="d">Aperfeiçoar uma carta (+)</button><button class="btn ghost" id="c">Seguir sem oferecer</button></div></div>`);
  $('d').onclick=()=>pickCards('Aperfeiçoar','Sementes ganham +30% de dano; bênçãos e parábolas custam 1 a menos.',c=>!c.plus&&c.k!=='joio',1,ch=>{if(ch){ch[0].plus=true;toast('Aperfeiçoada: '+info(ch[0]).name)}advance()});
  $('a').onclick=()=>pickCards('Enxertar','Escolha duas sementes diferentes (Romanos 11:17).',baseSeed,2,ch=>{if(ch&&ch[0].k!==ch[1].k){const h=graft(ch[0],ch[1]);toast('Nova árvore: '+info(h).name)}else if(ch)toast('Escolha duas sementes diferentes');advance()});
  $('b').onclick=()=>pickCards('Consagrar','Escolha uma carta para virar ★.',c=>!c.rare&&c.k!=='joio',1,ch=>{if(ch){ch[0].rare=true;toast('Consagrada: '+info(ch[0]).name)}advance()});
  $('c').onclick=advance;
}

// ---------- after a battle
function battleWon(){
  if(RUN.mode==='level'){levelWon();return}
  const n=S.node,a=RUN.act;
  let gain=n.type==='chefe'?70:n.type==='elite'?45+a*10:25+a*10;RUN.siclos+=gain;
  if(relic('paes'))RUN.hp=Math.min(RUN.maxhp,RUN.hp+3);
  saveMeta();
  nodeRng(70);
  const nOpts=Math.max(1,3+(relic('manto')?1:0)-(RUN.asc>=6?1:0));
  const opts=Array.from({length:nOpts},()=>mk(rpick(POOL)));
  let relOpts=[];if(n.type!=='batalha'){const free=Object.keys(RELICS).filter(k=>!RUN.relics.includes(k));relOpts=rshuffle(free).slice(0,2)}
  let extra=null;if(RUN.samaritano){RUN.samaritano=0;extra=mk(rpick(SEED_KEYS),{rare:true});RUN.coll.push(extra);RUN.deck.push(extra)}
  let chosen=false,relChosen=!relOpts.length,mode=null,pruned=false,grafted=false,mark=[],msg='';
  const render=()=>{
    const help=mode==='poda'?'Toque na carta que vai sair. Ramo podado dá mais fruto (João 15:2).':mode==='enx'?'Toque em duas sementes diferentes (Romanos 11:17).':msg;
    menu(`<div class="mbox"><small class="eyebrow">${MAP.name} · vitória</small><h2>${n.type==='chefe'?EN[ACTS[a].boss].name+' caiu':'O jardim resistiu'}</h2>
      <p>+${gain} siclos${relic('paes')?' · +3 de Vida (pães e peixes)':''}${extra?' · O viajante voltou e trouxe: '+info(extra).name:''}</p>
      ${relOpts.length?`<div class="sec"><h3>${relChosen?'Relíquia guardada':'Escolha uma relíquia'}</h3><div class="row" style="justify-content:flex-start">${relOpts.map(k=>`<button type="button" class="relicpick ${relChosen?'dimmed':''}" data-rel="${k}" ${relChosen?'disabled':''}><canvas width="32" height="32" data-relic="${k}"></canvas><b>${RELICS[k].name}</b><small>${RELICS[k].desc}</small><i>${RELICS[k].ref}</i></button>`).join('')}</div></div>`:''}
      <div class="sec"><h3>${chosen?'Carta guardada na bolsa':'Escolha 1 carta'}</h3><div class="grid g3">${opts.map(c=>cardHTML(c,chosen?'dim':'')).join('')}</div>${chosen?'':'<button class="btn ghost" id="skip">Pular</button>'}</div>
      <div class="sec"><h3>Sua bolsa · ${RUN.deck.length} cartas</h3>
        <div class="row" style="justify-content:flex-start"><button class="btn ghost ${mode==='poda'?'act':''}" id="mpoda" ${pruned?'disabled':''}>${pruned?'Já podou':'Podar 1 carta'}</button>
        <button class="btn ghost ${mode==='enx'?'act':''}" id="menx" ${grafted?'disabled':''}>${grafted?'Já enxertou':'Enxertar 2 sementes'}</button><span class="help">${help}</span></div>
        <div class="grid">${RUN.deck.map(c=>cardHTML(c,mark.includes(c)?'mark':'')).join('')}</div></div>
      <button class="btn" id="go">${n.type==='chefe'?'Ir para a colheita':'Voltar ao caminho'}</button></div>`,[...opts,...RUN.deck],c=>{
        if(opts.includes(c)){if(!chosen){RUN.deck.push(c);RUN.coll.push(c);chosen=true}render();return}
        if(mode==='poda'){if(RUN.deck.length<=6){msg='A bolsa precisa de pelo menos 6 cartas.';mode=null;render();return}prune(c);pruned=true;mode=null;msg='Podada: '+info(c).name+'.';render();return}
        if(mode==='enx'){if(!baseSeed(c)){msg='Só sementes simples podem ser enxertadas.';render();return}
          if(mark.includes(c)){mark=mark.filter(k=>k!==c);render();return}mark.push(c);
          if(mark.length===2){const[x1,x2]=mark;if(x1.k===x2.k){msg='Escolha duas sementes diferentes.';mark=[x2]}else{const h=graft(x1,x2);grafted=true;mode=null;mark=[];msg='Nova árvore: '+info(h).name+'.'}}
          render()}});
    $('menu').querySelectorAll('[data-rel]').forEach(b=>b.onclick=()=>{RUN.relics.push(b.dataset.rel);relChosen=true;sfx('ach');render()});
    if($('skip'))$('skip').onclick=()=>{chosen=true;render()};
    $('mpoda').onclick=()=>{mode=mode==='poda'?null:'poda';mark=[];render()};
    $('menx').onclick=()=>{mode=mode==='enx'?null:'enx';mark=[];render()};
    $('go').onclick=()=>advance();
  };render();
}
function showHarvest(){
  const seen=new Set(),got=[];
  (S&&S.tw||[]).forEach(t=>{if(!t||t.joio||got.length>=3)return;const key=t.kinds.join('+');if(seen.has(key))return;seen.add(key);
    got.push(t.kinds.length>1?mk('hyb',{hyb:[...t.kinds],rare:true}):mk(t.kinds[0],{rare:true}))});
  got.forEach(c=>META.celeiro.push(c.hyb?{hyb:c.hyb}:{k:c.k}));META.celeiro=META.celeiro.slice(-30);
  const unl=[];
  if(RUN.act===0&&!META.chars.rute){META.chars.rute=1;unl.push('Rute')}
  if(META.celeiro.length>=4&&!META.chars.noe){META.chars.noe=1;unl.push('Noé')}
  if(META.celeiro.length>=8&&!META.chars.jose){META.chars.jose=1;unl.push('José')}
  if(META.celeiro.length>=12){if(!META.chars.elias){META.chars.elias=1;unl.push('Elias')}unlockAch('tribos')}
  saveMeta();
  const fin=RUN.act>=2;
  menu(`<div class="mbox"><small class="eyebrow">Fim do ${ACTS[RUN.act].name}</small><h2>Dia de Colheita</h2>
    <p>${got.length?'As árvores que resistiram viraram cartas consagradas, com +50% de dano. Elas ficam no seu celeiro para as próximas jornadas.':'Nenhuma árvore resistiu até a colheita.'}</p>
    ${got.length?`<div class="grid g3">${got.map(c=>cardHTML(c)).join('')}</div>`:''}
    <p class="help">Celeiro: ${META.celeiro.length}/12 para “as 12 tribos”${unl.length?' · Personagem liberado: '+unl.join(', '):''}</p>
    <button class="btn" id="go">${fin?'Ir ao jardim':'Seguir para o '+ACTS[RUN.act+1].name}</button></div>`,got);
  $('go').onclick=()=>{if(fin)return startEpilogue();RUN.act++;genAct();RUN.needDeck=true;blankBattle(ACTS[RUN.act].pool[0]);showDeck()};
}
function score(){return RUN.stats.kills*5+RUN.stats.bosses*250+RUN.act*400+RUN.hp*15}
function endRun(won){
  store.del('fds-run');MUS.mode='calm';
  const sc=score();
  if(RUN.daily){const k=todayKey();META.daily[k]=Math.max(META.daily[k]||0,sc)}
  if(won){META.stats.wins++;if(!META.chars.debora){META.chars.debora=1;toast('Personagem liberado: Débora','Juízes 4:4')}unlockAch('jornada');if(RUN.hp<=3)unlockAch('ultimo');if(RUN.asc===META.ascMax&&META.ascMax<ASC.length-1){META.ascMax++;toast('Ascensão '+META.ascMax+' liberada',ASC[META.ascMax])}}
  saveMeta();return sc;
}
function shareText(sc,won){return `Farm Defense Saga · ${RUN.daily?'Desafio de '+todayKey():CHARS[RUN.char].name+(RUN.asc?' A'+RUN.asc:'')} · ${sc} pontos · ${won?'jornada vencida':'caí no '+ACTS[RUN.act].name}`}
function resultBox(sc,won){return `<p class="score">${sc} pontos</p><div class="row"><button class="btn ghost" id="share">Copiar resultado</button><button class="btn" data-go="title">Menu inicial</button></div><p class="help" id="sharemsg"></p>`}
function wireShare(sc,won){const t=shareText(sc,won);$('share').onclick=()=>{const m=$('sharemsg');
  navigator.clipboard?.writeText(t).then(()=>m.textContent='Copiado: '+t,()=>m.textContent=t).catch(()=>m.textContent=t)||(m.textContent=t)}}
function showOver(){
  S.state='menu';if(RUN.mode==='level'){levelLost();return}const sc=endRun(false);
  menu(`<div class="mbox"><small class="eyebrow">${MAP.name}</small><h2>O jardim secou</h2>
    <p>“Todo ramo que dá fruto, ele o poda para que dê mais fruto.” (João 15:2). As cartas do celeiro continuam guardadas.</p>${resultBox(sc,false)}</div>`);wireShare(sc,false);
}
function showWin(){
  if(RUN&&RUN.mode==='level'){const ch=CHARS[RUN.char];META.done.fim=1;saveMeta();menu(`<div class="mbox"><small class="eyebrow">O terceiro jardim</small><h1>Combati o bom combate</h1><p>Começou num jardim, passou por um jardim e terminou num jardim. “Ela, supondo ser ele o jardineiro...” (João 20:15)</p><p class="epi">${ch.epi}<br><i>${ch.epiRef}</i></p><p class="help">“E as folhas da árvore são para a cura das nações.” (Apocalipse 22:2)</p><button class="btn" data-go="hub">Voltar ao menu</button></div>`);return}
  const sc=endRun(true);
  const ch=CHARS[RUN.char];
  menu(`<div class="mbox"><small class="eyebrow">O terceiro jardim</small><h1>Combati o bom combate</h1>
    <p>Começou num jardim, passou por um jardim e terminou num jardim. “Ela, supondo ser ele o jardineiro...” (João 20:15)</p>
    <p class="epi">${ch.epi}<br><i>${ch.epiRef}</i></p><p class="help">“E as folhas da árvore são para a cura das nações.” (Apocalipse 22:2)</p>${resultBox(sc,true)}</div>`);wireShare(sc,true);
}

// ---------- codex and achievements
// first time a work of the flesh shows up, the battle pauses and introduces it
function foeIntro(k){const d=EN[k],el=$('foeintro');S.intro=k;sfx('horn');
  el.innerHTML=`<div class="fi"><small>${d.boss?'Chefe':'Nova obra da carne'}</small><canvas width="48" height="48"></canvas><h3>${d.name}</h3><p>${d.desc}</p>${d.weak?`<p class="weak">Fraca contra <b>${CARDS[d.weak].name}</b>: dano 2,5 vezes maior.</p>`:''}<i>${d.ref||VICE_REF}</i><button class="btn" id="fiok">Entendi <small>Enter</small></button></div>`;
  el.hidden=false;enemyIconTo(el.querySelector('canvas'),k);$('fiok').onclick=closeFoeIntro}
function closeFoeIntro(){$('foeintro').hidden=true;S.intro=null;if(S.introQ&&S.introQ.length)foeIntro(S.introQ.shift())}
const cardKnown=k=>META.unlocked.includes(k)||!!META.seen.c[k]||!!(CARDS[k].own&&META.chars[CARDS[k].own]);
// codex cards: a header bar, an art window tinted by the subject's color, a body and the verse
const ccard=o=>`<div class="ccard ${o.cls||''}" style="--cc:${o.col}"><div class="cchead"><b>${o.name}</b>${o.tag?`<span>${o.tag}</span>`:''}</div><div class="ccart">${o.art}</div><div class="ccbody">${o.body}</div>${o.ref?`<i class="ccref">${o.ref}</i>`:''}</div>`;
const lvlOf=(v,cuts)=>1+cuts.filter(c=>v>=c).length;
function showCodex(tab){
  const tabs={cartas:'Frutos e cartas',vizinhas:'Vizinhanças',inimigos:'Obras da carne',reliquias:'Relíquias',personagens:'Personagens'};let body='',cards=[];
  if(tab==='cartas'){cards=Object.keys(CARDS).map(k=>mk(k,cardKnown(k)?{}:{locked:true}));body=`<p class="help">${cards.filter(c=>!c.locked).length} de ${cards.length} cartas descobertas. Vença fases e abra pacotes na Tenda para encontrar as outras.</p><div class="grid">${cards.map(c=>{const I=info(c),rk=RAR[rarOf(c)],lv=cardLv(c.k),tree=!!I.kinds;
    return`<div class="cx">${cardHTML(c)}<small class="cxr" style="color:${rk.c}">${rk.sym} ${rk.name}${tree&&!c.locked?` · nível ${lv+1}${lv<3?` · cópias ${(META.copies||{})[c.k]||0}/${COPY_NEED[lv]}`:''}`:''}${(META.foil||{})[c.k]&&!c.locked?' · ★':''}</small><i>${c.locked?'???':I.ref}</i></div>`}).join('')}</div>`}
  if(tab==='vizinhas')body=`<div class="ccrules"><span style="--c:#4faa4a">Árvores a até 72 passos se ligam por ramos</span><span style="--c:#e8a020">Frutos diferentes juntos: +10% de dano</span><span style="--c:#9b5ae0">Perto de uma Videira: +25% (João 15:5)</span><span style="--c:#c8403a">A Discórdia corta ramos ao passar por baixo</span></div>
    <div class="grid ccg pairs">${PAIRS.map((p,i)=>ccard({col:FRUIT_COL[FRUIT[p.a]],name:p.name,art:`<canvas width="288" height="144" data-pair="${i}"></canvas>`,body:`<b class="ccsub">${CARDS[p.a].name} + ${CARDS[p.b].name}</b><p>Juntas, ${p.desc}.</p>`,ref:p.ref})).join('')}</div>`;
  if(tab==='inimigos')body=`<p class="help">Passe o mouse numa carta para ver a praga se mexer.</p><div class="grid ccg">${Object.entries(EN).filter(([,d])=>!d.hide).map(([k,d])=>{const seen=META.seen.e[k];
    return seen?ccard({col:d.c,name:d.name,tag:d.boss?'Chefe':d.elite?'Elite':'',art:`<canvas width="48" height="48" data-enemy="${k}" data-anim="${k}"></canvas>`,
      body:`<div class="cattr">${[['Vida',lvlOf(d.hp,[4,8,12,30]),'#ff5a6a'],['Velocidade',lvlOf(d.spd,[12,18,25,33]),'#5ad0ff'],['Dano',lvlOf(d.dmg,[2,3,5,8]),'#ffa040']].map(([l,v,c])=>`<span>${l}</span><i style="--c:${c}">${[1,2,3,4,5].map(n=>`<u class="${n<=v?'on':''}"></u>`).join('')}</i>`).join('')}</div>
        <p>${d.desc}</p>${d.weak?`<div class="ccweak"><canvas width="12" height="12" data-emb="${FRUIT[d.weak]}"></canvas>Fraca contra ${CARDS[d.weak].name}</div>`:''}`,ref:d.ref||VICE_REF})
      :ccard({col:'#3a3040',name:'???',cls:'unk',art:`<canvas width="48" height="48" data-enemy="${k}"></canvas>`,body:'<p>Ainda não apareceu no seu jardim.</p>'})}).join('')}</div>`;
  if(tab==='reliquias')body=`<div class="grid ccg">${Object.entries(RELICS).map(([k,d])=>META.seen.r[k]?ccard({col:'#c9921a',name:d.name,art:`<canvas width="32" height="32" data-relic="${k}"></canvas>`,body:`<p>${d.desc}</p>`,ref:d.ref,cls:'relic'})
    :ccard({col:'#3a3040',name:'???',cls:'unk relic',art:`<canvas width="32" height="32" data-relic="${k}"></canvas>`,body:'<p>Encontre na Jornada.</p>'})).join('')}</div>`;
  if(tab==='personagens')body=`<div class="grid cxg">${Object.entries(CHARS).map(([k,c])=>META.chars[k]?`<div class="entry"><canvas width="32" height="40" data-char="${k}"></canvas><div><b>${c.name}</b><small>${c.desc}</small>${attrRows(k)}<i>${c.ref}</i></div></div>`:`<div class="entry unk"><canvas width="32" height="40" data-char="${k}"></canvas><div><b>${c.name} · bloqueado</b><small>Como liberar: ${c.hint}</small></div></div>`).join('')}</div>`;
  menu(`<div class="mbox wide book"><h2>Códex</h2><div class="row tabs">${Object.entries(tabs).map(([k,t])=>`<button class="btn ghost ${k===tab?'act':''}" data-tab="${k}">${t}</button>`).join('')}</div>${body}<button class="btn" data-go="title">Voltar</button></div>`,cards);
  $('menu').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>showCodex(b.dataset.tab));
  $('menu').querySelectorAll('canvas[data-pair]').forEach(c=>pairArtTo(c,PAIRS[+c.dataset.pair]));
  $('menu').querySelectorAll('.relic:not(.unk) canvas[data-relic]').forEach(c=>relicCardArt(c,c.dataset.relic));
  // pests move while the mouse is over their card
  $('menu').querySelectorAll('canvas[data-anim]').forEach(cv=>{const k=cv.dataset.anim,card=cv.closest('.ccard');let raf=0,t=1,last=0;
    const step=now=>{if(!cv.isConnected)return;t+=Math.min(.05,(now-(last||now))/1000);last=now;enemyIconTo(cv,k,t);raf=requestAnimationFrame(step)};
    card.onmouseenter=()=>{last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(step)};card.onmouseleave=()=>cancelAnimationFrame(raf)});
  $('menu').querySelectorAll('canvas[data-char]').forEach(c=>charIconTo(c,c.dataset.char));
}
function showAchs(){const keys=Object.keys(ACH),got=keys.filter(k=>META.ach[k]).length;
  menu(`<div class="mbox wide modern achs"><h2>Conquistas</h2>
    <div class="achtop"><b>${got} de ${keys.length} conquistadas</b><div class="xp"><i style="width:${got/keys.length*100}%"></i></div><small>Obras da carne derrotadas: ${META.stats.kills} · Jornadas vencidas: ${META.stats.wins}</small></div>
    <div class="grid ccg">${keys.map((k,i)=>{const a=ACH[k],on=!!META.ach[k];return ccard({col:on?'#c9921a':'#3a4458',name:a.name,cls:'medal'+(on?'':' off'),tag:on?'✓':'',art:`<canvas width="64" height="80" data-medal="${i}" data-on="${on?1:0}"></canvas>`,body:`<p>${a.desc}</p>`,ref:a.ref})}).join('')}</div>
    <button class="btn" data-go="title">Voltar</button></div>`);
  $('menu').querySelectorAll('canvas[data-medal]').forEach(c=>medalTo(c,+c.dataset.medal,c.dataset.on==='1'))}
// a medal on a two-color ribbon; gray with a padlock while it is still locked
function medalTo(cvs,i,on){const g=hdCtx(cvs,16,20,4);C=g;const RB=[['#c0283f','#f7c948'],['#2a5bd7','#ffffff'],['#2f8a3a','#f7c948'],['#7b2fbf','#ffd0f0'],['#e0782a','#fff0c0'],['#1a8a9a','#f7c948']][i%6];
  const A=on?RB[0]:'#5a5866',B=on?RB[1]:'#7a7888',ol='#2a1408';
  r(3,0,10,9,ol);r(4,0,4,8,A);r(8,0,4,8,B);r(5,0,1,7,on?'#ffffff55':'#8a8898');r(10,0,1,7,on?'#0003':'#5a5866');
  disc(8,13,6.5,ol);disc(8,13,5.5,on?'#c98a1a':'#6a6458');disc(8,13,4.5,on?'#f7c948':'#8a8478');disc(7.5,12.5,3,on?'#ffe27a':'#9a9488');
  r(5,10,1.5,1.5,on?'#fff8d0':'#b0aaa0');
  if(on){const st=[[8,10],[7,11],[8,11],[9,11],[5.5,12],[6.5,12],[7,12],[8,12],[9,12],[10,12],[6.5,13],[7,13],[8,13],[9,13],[7,14],[9,14],[6.5,15],[9.5,15]];st.forEach(([a,b])=>r(a,b,1,1,'#b8781a'))}
  else{r(6.5,12,3,3,'#3a3630');r(7,10.5,2,2,'#3a3630');r(7.5,11,1,1,'#8a8478');r(7.5,13,1,1.2,'#8a8478')}
  C=x}

// ---------- loop and boot
let last=performance.now();
// one bad frame must never stop the game loop: errors are reported once and the next frame runs
let frameErr=0;
function frame(now){try{frameBody(now)}catch(e){if(frameErr++<3)console.error(e)}hit.clear();requestAnimationFrame(frame)}
function frameBody(now){
  pollPad();
  const rdt=Math.min(.033,(now-last)/1000);last=now;
  if(S){
    if(live()&&pr('Escape','KeyP')&&!S.intro&&!S.dialog)togglePause();if(live()&&pr('KeyF'))toggleSpeed();
    if(S.paused&&live()){draw();updHUD();return}
    const dt=rdt*(S.slow>0?.28:1)*(live()?S.speed||1:1);S.slow=Math.max(0,S.slow-rdt);S.t+=dt;
    if(S.state==='title'){S.cam=(Math.sin(S.t*.035-1.2)*.5+.5)*(MAP.ww-W);for(const t of S.tw)if(t)t.t+=dt}
    if(S.state==='choose')for(const e of S.en)e.t+=dt*.6;
    S.zoom+=((S.slow>0?1.7:1)-S.zoom)*Math.min(1,rdt*4);
    if(pr('KeyM'))setMuted(!muted);
    if(S.state==='prep'||S.state==='wave'){if(S.dialog){if(pr('Enter','Space','KeyX'))dialogNext()}else if(S.intro){if(pr('Enter','Space','KeyX'))closeFoeIntro()}else if(S.stop>0)S.stop-=rdt;else update(dt)}
    else if(S.state==='epilogue'){updPlayer(dt);if(Math.random()<dt*4)S.parts.push({x:S.cam+rnd(0,W+60),y:rnd(-10,60),vx:rnd(-22,-8),vy:rnd(8,16),g:0,life:9,max:9,c:pick(['#ffb0c8','#ffffff','#ffe36a']),s:1,sway:1});if(S.p.x>MAP.ww-70){S.state='menu';showWin()}}
    updFx(dt);draw();updHUD();
  }
}
$('timer').addEventListener('click',()=>callWave());
// the loop starts once every script has loaded (scripts after this one define parts of a frame) and the pixel font is ready
addEventListener('load',()=>(document.fonts?document.fonts.load('8px "Pixelify Sans"'):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(frame)));

function startEpilogue(){hideMenu();MUS.scene=null;blankBattle('tumulo');S.state='epilogue';MUS.mode='calm';banner('A manhã do primeiro dia','João 20:1');showStory()}

function renderItems(){const el=$('itembar');if(!el)return;const A=ABIL[(RUN&&RUN.char)||META.char]||ABIL.lavrador;el.innerHTML=Object.entries(ITEMS).filter(()=>sysOn('barriers')).map(([k,it])=>`<button type="button" class="itm ${META.items[k]?'':'empty'}" data-itm="${k}" title="${it.name}: ${it.desc}"><canvas width="32" height="32" data-bar="${k}"></canvas><b>${META.items[k]||0}</b><small>${it.key}</small></button>`).join('')+
  `<button type="button" class="itm atk" id="atkbtn" title="Golpe com a ferramenta (X)"><canvas width="32" height="32" data-tool="${META.weapon}"></canvas><b>X</b><small>golpe</small></button>`+
  `<button type="button" class="itm abil" id="abilbtn" title="${A[0]}: ${A[1]} (C)"><canvas width="32" height="32" data-hubicon="personagem"></canvas><b>C</b><small>${A[0]}</small><i class="cdm"></i></button>`;
  el.querySelectorAll('canvas[data-bar]').forEach(c=>barrierIconTo(c,c.dataset.bar));el.querySelectorAll('canvas[data-tool]').forEach(c=>toolIconTo(c,c.dataset.tool));
  el.querySelectorAll('[data-itm]').forEach(b=>b.onclick=e=>{e.currentTarget.blur();placeItem(b.dataset.itm)});el.querySelectorAll('canvas[data-hubicon]').forEach(c=>hubIconTo(c,'personagem'));$('abilbtn').onclick=e=>{e.currentTarget.blur();useAbility()};$('atkbtn').onclick=e=>{e.currentTarget.blur();playerAttack()}}
