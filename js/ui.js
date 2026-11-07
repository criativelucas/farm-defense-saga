// ---------- HUD and hand
const garble=s=>s.replace(/\S/g,()=>pick([...'ʘΔλΣЖЊѮᚠᚢᚦ϶']));
function renderHand(){
  const el=$('cards');el.innerHTML='';const n=S.hand.length,conf=S.babelOn>0;
  for(let j=0;j<n;j++){
    const i=conf&&S.perm[j]!=null?S.perm[j]:j,c=S.hand[i],b=document.createElement('button');b.type='button';
    b.style.setProperty('--rot',((j-(n-1)/2)*5)+'deg');b.style.setProperty('--lift',(Math.abs(j-(n-1)/2)*4)+'px');
    if(!c){b.className='hc empty';b.disabled=true;b.innerHTML='<b>vazio</b>';el.append(b);continue}
    const I=info(c);b.className='hc c-'+catOf(c)+' t-'+I.type+(c.rare?' rare':'')+(c.plus?' plus':'')+(S.sel===i?' sel':'')+(conf?' garbled':'');
    b.innerHTML=`<span class="gem">${conf?'?':I.cost}</span><span class="key">${j+1}</span>${conf?'':I.fruits.map(f=>`<canvas class="emb" width="12" height="12" data-emb="${f}"></canvas>`).join('')}<span class="art"><canvas width="64" height="44"></canvas></span><b>${conf?garble(I.name):I.name}</b>`;
    b.title=conf?'':I.name+': '+I.desc;
    const art=b.querySelector('.art canvas');if(conf){const g=art.getContext('2d');g.fillStyle='#3a1e4a';g.fillRect(0,0,64,44);g.fillStyle='#e0c0ff';g.font='20px serif';g.fillText(garble('??'),18,30)}else cardArtTo(art,c);
    b.querySelectorAll('canvas[data-emb]').forEach(e=>embTo(e,e.dataset.emb));
    b.addEventListener('pointerdown',e=>startDrag(e,i,b));
    b.addEventListener('click',e=>{e.currentTarget.blur();if(e.detail===0)onCardClick(i)});
    if(i===S.newIdx)b.classList.add('enter');el.append(b)}
  const nx=S.draw[0];
  $('pilecount').textContent=S.draw.length;renderItems();
  const pv=$('nextc');pv.innerHTML='';if(nx&&!conf){const cv2=document.createElement('canvas');cv2.width=64;cv2.height=44;cardArtTo(cv2,nx);pv.append(cv2);pv.title='Próxima: '+info(nx).name}
}
function onCardClick(i){const c=S.hand[i];if(!c)return;const I=info(c);
  if(I.kinds&&slotAt()<0){S.sel=S.sel===i?-1:i;renderHand();if(S.sel>=0)pop(S.p.x,S.p.y-24,'toque num canteiro','#f7c948');return}
  playCard(i)}
// drag a card from the hand onto a slot (or anywhere for blessings)
let drag=null;
function slotFromClient(cx,cy){const rc=$('stage').getBoundingClientRect(),wx=(cx-rc.left)/rc.width*W+S.cam,wy=(cy-rc.top)/rc.height*H;
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
  const rc=$('stage').getBoundingClientRect(),wx=(e.clientX-rc.left)/rc.width*W+S.cam,wy=(e.clientY-rc.top)/rc.height*H;
  let best=-1,bd=16;MAP.slots.forEach((s,i)=>{const d=Math.hypot(s.x-wx,s.y-8-wy);if(d<bd){bd=d;best=i}});
  if(best>=0)playCard(S.sel,best);
});
function flyCard(i,c,tx,ty){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  try{const stage=$('stage'),st=stage.getBoundingClientRect(),btn=$('cards').children[i];if(!btn)return;const b=btn.getBoundingClientRect();
    const I=info(c),el=document.createElement('div');el.className='hc fly t-'+I.type;
    el.innerHTML=`<canvas width="32" height="32"></canvas><b>${I.name}</b>`;iconTo(el.querySelector('canvas'),c);
    el.style.left=(b.left-st.left)+'px';el.style.top=(b.top-st.top)+'px';el.style.width=b.width+'px';stage.append(el);
    const k=st.width/W,ddx=tx*k-(b.left-st.left)-b.width/2,ddy=ty*k-(b.top-st.top)-b.height/2;
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
  const tm=$('timer');tm.hidden=S.state!=='prep';if(S.state==='prep')tm.textContent=`Onda em ${Math.ceil(S.between)}s · Enter chama agora`;
  const pv=$('preview');pv.hidden=S.state!=='prep';if(S.state==='prep')pv.textContent=S.reveal?'Próxima: '+waveSummary(w):'Próxima onda: ??? (use Profecia)';
  const fr=$('fruits');if(!fr.children.length)fr.innerHTML=FRUIT_ORDER.map(f=>`<span data-f="${f}" style="--c:${FRUIT_COL[f]}">${f}</span>`).join('');
  [...fr.children].forEach(s=>s.classList.toggle('on',S.fruits.has(s.dataset.f)));
  $('setb').textContent=S.setMult>1?'Fruto em cacho: +'+Math.round((S.setMult-1)*100)+'% de dano':'';
  const sh=['Cesto '+S.basket+'/5'+(S.basket>=5?' · pisão de colheita!':'')];
  if(MAPID==='jerico')sh.push(S.fallen?'As muralhas caíram':'Voltas pela torre: '+S.laps+'/7');
  if(S.folk)sh.push(S.folk.saved?'O povo atravessou':'Leve o povo à outra margem');
  if(S.idol)sh.push(S.idol.hp>0?'Ídolo: faltam '+S.idol.hp+' pisões':'Ídolo destruído');
  if(S.forbid&&S.forbid.on)sh.push('Fruto proibido: -2 Vida por onda');
  if(MAPID==='getsemani')sh.push('Vigiai: passe perto das árvores');
  if(S.babelOn>0)sh.push('Confusão de línguas!');
  if(S.bank)sh.push('Celeiro: '+Math.floor(S.bank)+' maná');
  if(S.pstones)sh.push('Pedras: '+S.pstones);
  $('storyhud').innerHTML=sh.join('<br>');
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
const TUT=['Ande com ← → (ou A e D)','Pule com ↑ (ou W)','Pare sobre um canteiro (os brotinhos) e aperte 1 para plantar a primeira carta','No ar, aperte ↓ em cima de uma árvore crescida: é o pisão','Aperte X para golpear com a sua ferramenta. Cuidado: encostar nas pragas tira corações','Aperte Enter para chamar a onda quando estiver pronto'];
function startTutorial(){tutStep=0;showTut()}
function showTut(){const el=$('tut');if(tutStep<0||tutStep>=TUT.length){el.hidden=true;return}
  el.hidden=false;el.innerHTML=`<small>Tutorial ${tutStep+1}/${TUT.length}</small><span>${TUT[tutStep]}</span><button type="button" id="tutskip">Pular</button>`;
  $('tutskip').onclick=e=>{e.currentTarget.blur();endTutorial()}}
function tutNext(){tutStep++;sfx('coin');if(tutStep>=TUT.length)endTutorial();else showTut()}
function endTutorial(){tutStep=-1;META.tut=1;saveMeta();$('tut').hidden=true}
function tutCheck(){if(tutStep===0&&S.p.moved>30)tutNext();else if(tutStep===1&&S.p.jumped)tutNext()}

// ---------- menus
const SVGI={dmg:'<svg viewBox="0 0 8 8" aria-hidden="true"><path d="M1 7 5 3 6 1 7 2 5 3 1 7z" stroke="currentColor" fill="currentColor"/></svg>',
  rng:'<svg viewBox="0 0 8 8" aria-hidden="true"><circle cx="4" cy="4" r="3" fill="none" stroke="currentColor"/><circle cx="4" cy="4" r="1" fill="currentColor"/></svg>',
  cd:'<svg viewBox="0 0 8 8" aria-hidden="true"><circle cx="4" cy="4" r="3" fill="none" stroke="currentColor"/><path d="M4 2v2h2" stroke="currentColor" fill="none"/></svg>'};
const strongVs=I=>I.kinds?Object.keys(EN).filter(k=>!EN[k].hide&&I.kinds.includes(EN[k].weak)):[];
const catOf=c=>c.hyb?'hibrida':CARDS[c.k]&&CARDS[c.k].own?'propria':info(c).type;
const CAT_LABEL={semente:'Semente',hibrida:'Enxerto',propria:'Carta de personagem',bencao:'Bênção',parabola:'Parábola',joio:'Joio'};
function cardHTML(c,cls=''){const I=info(c),st=I.kinds&&STATS[I.key],vs=strongVs(I),cat=catOf(c),own=CARDS[c.k]&&CARDS[c.k].own;
  return `<button type="button" class="card t-${I.type} c-${cat}${c.rare?' rare':''}${c.plus?' plus':''} ${cls}" data-uid="${c.uid}" title="${I.desc.replace(/"/g,'&quot;')}"><span class="face">
    <span class="gem">${I.cost}</span><span class="embs">${I.fruits.map(f=>`<canvas class="emb" width="12" height="12" data-emb="${f}" title="${f}"></canvas>`).join('')}</span>
    <span class="plate">${I.name}</span>
    <span class="art"><canvas width="64" height="44" data-art="${c.uid}"></canvas></span>
    <i>${own?'Carta de '+CHARS[own].name:CAT_LABEL[cat]}${I.fruit?' · '+I.fruit:''}</i>
    ${st?`<span class="stats"><span title="dano">${SVGI.dmg}${st.dmg}</span><span title="alcance">${SVGI.rng}${st.rng}</span><span title="recarga">${SVGI.cd}${st.cd}</span></span>`:''}
    <small>${I.short}</small>
    ${vs.length?`<span class="vs">forte contra ${vs.map(k=>`<canvas width="48" height="48" data-enemy="${k}" title="${EN[k].name}"></canvas>`).join('')}</span>`:''}
    <em>${I.ref||''}</em></span></button>`}
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
}
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
        <canvas width="32" height="40" data-char="${k}"></canvas><b>${c.name}</b><small>${ok?c.desc:'Bloqueado: '+c.hint}</small>${ok&&c.card?`<small>Carta: ${CARDS[c.card].name}</small>`:''}<i>${c.ref}</i></button>`}).join('')}</div>
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
function showDeck(){
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
function showCodex(tab){
  const tabs={cartas:'Frutos e cartas',vizinhas:'Vizinhanças',inimigos:'Obras da carne',reliquias:'Relíquias',personagens:'Personagens'};let body='',cards=[];
  if(tab==='cartas'){cards=Object.keys(CARDS).map(k=>mk(k,cardKnown(k)?{}:{locked:true}));body=`<p class="help">${cards.filter(c=>!c.locked).length} de ${cards.length} cartas descobertas. Vença fases para encontrar as outras.</p><div class="grid">${cards.map(c=>{const I=info(c);return`<div class="cx">${cardHTML(c)}<i>${c.locked?'???':I.ref}</i></div>`}).join('')}</div>`}
  if(tab==='vizinhas')body=`<p class="help">Árvores a até 72 passos de distância se ligam por ramos. Frutos diferentes juntos: +10% de dano. Perto de uma Videira: +25% (João 15:5). A Discórdia corta ramos ao passar por baixo.</p><div class="grid">${PAIRS.map(p=>`<div class="entry"><b>${p.name}</b><small>${CARDS[p.a].name} + ${CARDS[p.b].name}: ${p.desc}</small><i>${p.ref}</i></div>`).join('')}</div>`;
  if(tab==='inimigos')body=`<div class="grid cxg">${Object.entries(EN).filter(([,d])=>!d.hide).map(([k,d])=>META.seen.e[k]?`<div class="entry"><canvas width="48" height="48" data-enemy="${k}"></canvas><div><b>${d.name}</b><small>${d.desc}</small>${d.weak?`<small>Fraca contra: ${CARDS[d.weak].name}</small>`:''}<i>${d.ref||VICE_REF}</i></div></div>`:`<div class="entry unk"><canvas width="48" height="48" data-enemy="${k}"></canvas><div><b>???</b><small>Ainda não apareceu no seu jardim.</small></div></div>`).join('')}</div>`;
  if(tab==='reliquias')body=`<div class="grid cxg">${Object.entries(RELICS).map(([k,d])=>META.seen.r[k]?`<div class="entry"><canvas width="32" height="32" data-relic="${k}"></canvas><div><b>${d.name}</b><small>${d.desc}</small><i>${d.ref}</i></div></div>`:`<div class="entry unk"><canvas width="32" height="32" data-relic="${k}"></canvas><div><b>???</b><small>Encontre na Jornada.</small></div></div>`).join('')}</div>`;
  if(tab==='personagens')body=`<div class="grid cxg">${Object.entries(CHARS).map(([k,c])=>META.chars[k]?`<div class="entry"><canvas width="32" height="40" data-char="${k}"></canvas><div><b>${c.name}</b><small>${c.desc}</small><i>${c.ref}</i></div></div>`:`<div class="entry unk"><canvas width="32" height="40" data-char="${k}"></canvas><div><b>${c.name} · bloqueado</b><small>Como liberar: ${c.hint}</small></div></div>`).join('')}</div>`;
  menu(`<div class="mbox wide"><h2>Códex</h2><div class="row">${Object.entries(tabs).map(([k,t])=>`<button class="btn ghost ${k===tab?'act':''}" data-tab="${k}">${t}</button>`).join('')}</div>${body}<button class="btn" data-go="title">Voltar</button></div>`,cards);
  $('menu').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>showCodex(b.dataset.tab));
  $('menu').querySelectorAll('canvas[data-char]').forEach(c=>charIconTo(c,c.dataset.char));
}
function showAchs(){
  menu(`<div class="mbox"><h2>Conquistas</h2><p class="help">Obras da carne derrotadas: ${META.stats.kills} · Jornadas vencidas: ${META.stats.wins}</p>
    <div class="grid">${Object.entries(ACH).map(([k,a])=>`<div class="entry ${META.ach[k]?'got':'locked'}"><b>${META.ach[k]?'✓ ':''}${a.name}</b><small>${a.desc}</small><i>${a.ref}</i></div>`).join('')}</div>
    <button class="btn" data-go="title">Voltar</button></div>`);
}

// ---------- loop and boot
let last=performance.now();
function frame(now){
  const rdt=Math.min(.033,(now-last)/1000);last=now;
  if(S){
    const dt=rdt*(S.slow>0?.28:1);S.slow=Math.max(0,S.slow-rdt);S.t+=dt;
    if(S.state==='title'){S.cam=(Math.sin(S.t*.035-1.2)*.5+.5)*(MAP.ww-W);for(const t of S.tw)if(t)t.t+=dt}
    S.zoom+=((S.slow>0?1.7:1)-S.zoom)*Math.min(1,rdt*4);
    if(pr('KeyM'))setMuted(!muted);
    if(S.state==='prep'||S.state==='wave'){if(S.intro){if(pr('Enter','Space','KeyX'))closeFoeIntro()}else if(S.stop>0)S.stop-=rdt;else update(dt)}
    else if(S.state==='epilogue'){updPlayer(dt);if(Math.random()<dt*4)S.parts.push({x:S.cam+rnd(0,W+60),y:rnd(-10,60),vx:rnd(-22,-8),vy:rnd(8,16),g:0,life:9,max:9,c:pick(['#ffb0c8','#ffffff','#ffe36a']),s:1,sway:1});if(S.p.x>MAP.ww-70){S.state='menu';showWin()}}
    updFx(dt);draw();updHUD();
  }
  hit.clear();requestAnimationFrame(frame);
}
$('timer').addEventListener('click',()=>{if(S&&S.state==='prep')startWave()});
(document.fonts?document.fonts.load('8px "Pixelify Sans"'):Promise.resolve()).catch(()=>{}).finally(()=>requestAnimationFrame(frame));

function startEpilogue(){hideMenu();blankBattle('tumulo');S.state='epilogue';MUS.mode='calm';banner('A manhã do primeiro dia','João 20:1');showStory()}

function renderItems(){const el=$('itembar');if(!el)return;el.innerHTML=Object.entries(ITEMS).map(([k,it])=>`<button type="button" class="itm ${META.items[k]?'':'empty'}" data-itm="${k}" title="${it.name}: ${it.desc}"><canvas width="32" height="32" data-bar="${k}"></canvas><b>${META.items[k]||0}</b><small>${it.key}</small></button>`).join('')+
  `<button type="button" class="itm atk" id="atkbtn" title="Golpe com a ferramenta (X)"><canvas width="32" height="32" data-tool="${META.weapon}"></canvas><b>X</b><small>golpe</small></button>`;
  el.querySelectorAll('canvas[data-bar]').forEach(c=>barrierIconTo(c,c.dataset.bar));el.querySelectorAll('canvas[data-tool]').forEach(c=>toolIconTo(c,c.dataset.tool));
  el.querySelectorAll('[data-itm]').forEach(b=>b.onclick=e=>{e.currentTarget.blur();placeItem(b.dataset.itm)});$('atkbtn').onclick=e=>{e.currentTarget.blur();playerAttack()}}
