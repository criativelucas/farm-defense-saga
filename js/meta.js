// ---------- Adventure: fixed levels across six floating islands, day and night alternating
const WORLDS=[
  {id:'eden',name:'Jardim do Éden',map:'eden',act:0,boss:null,x:100,y:232,w:112,top:['#2a7a3a','#4faa50','#8ae07a']},
  {id:'jerico',name:'Jericó',map:'jerico',act:0,boss:'golias',x:238,y:254,w:100,top:['#a0784a','#c9a060','#ecd090']},
  {id:'mar',name:'Mar Vermelho',map:'mar',act:1,boss:'farao',x:384,y:212,w:110,top:['#a0604a','#c98a5a','#f0c08a']},
  {id:'sinai',name:'Monte Sinai',map:'sinai',act:1,boss:'bezerro',x:330,y:126,w:100,top:['#8a5a3a','#b07a4a','#d9a060']},
  {id:'babel',name:'Torre de Babel',map:'babel',act:2,boss:null,x:166,y:134,w:100,top:['#6a3a2a','#9a6248','#c98a5a']},
  {id:'getsemani',name:'Getsêmani',map:'getsemani',act:2,boss:'leviata',arena:'abismo',x:262,y:54,w:112,top:['#1e3a3a','#2a5a4a','#4a8a6a']}
];
const UNLOCK_ORDER=['roma','oliveira','chuva','sarca','figueira','jerico','lirio','talentos','tamareira','semeador','amendoeira','mostarda','profecia','regar','videira','oliveira','roma','sarca','lirio','figueira','tamareira','amendoeira','mostarda'];
const RULES={poucas:{name:'Mão curta',desc:'Só 3 cartas na mão'},sempisao:{name:'Sem pisão',desc:'O pisão não funciona'},trevas:{name:'Noite total',desc:'Escuridão quase completa'}};
const RULE_AT={5:'poucas',9:'sempisao',13:'trevas',17:'poucas',21:'sempisao'};
const LEVELS=[];WORLDS.forEach((w,wi)=>{for(let l=0;l<4;l++){const n=wi*4+l;LEVELS.push({id:(wi+1)+'-'+(l+1),wi,l,n,night:l%2===1||RULE_AT[n]==='trevas',boss:l===3?w.boss:null,rule:RULE_AT[n]||null})}});
const starsOf=id=>(META.stars||{})[id]||0;
const starStr=n=>'★'.repeat(n)+'☆'.repeat(3-n);
const levelOpen=n=>n===0||!!META.done[LEVELS[n-1].id];
const gardenOpen=()=>!!META.done['1-4'];
const jornadaOpen=()=>!!META.done['2-4'];

// ---------- hub (main menu)
function coinsTag(){return `<span class="coins"><canvas width="12" height="12" class="coin"></canvas>${META.coins} moedas</span>`}
function paintCoins(){document.querySelectorAll('canvas.coin').forEach(c=>{const g=c.getContext('2d');C=g;g.clearRect(0,0,12,12);disc(6,6,5,'#c9921a');disc(6,6,4,'#f7c948');r(4,3,2,2,'#fff6c0');r(6,4,1,5,'#c9921a');C=x})}
function hubIconTo(cvs,k){const g=cvs.getContext('2d');g.clearRect(0,0,32,32);C=g;
  if(k==='aventura'){disc(16,18,11,'#3a6a3a');disc(16,16,10,'#4faa50');r(10,22,12,6,'#6a5a6a');blob(16,10,7,5,'#2a7a3a','#5fc060','#b0f090',5);r(15,12,2,8,'#7a4a2e')}
  if(k==='jardim'){r(4,22,24,8,'#5a3a20');for(let i=0;i<4;i++){r(6+i*6,16,1,6,'#5fe08a');r(5+i*6,15,3,2,['#e0284a','#9b4be0','#f7c948','#ff8ac0'][i])}r(3,20,26,2,'#8a5a2a')}
  if(k==='loja'){r(5,12,22,16,'#8a5236');r(5,12,22,2,'#b07a40');for(let i=0;i<5;i++)r(4+i*5,6,5,6,i%2?'#e0284a':'#f4f0e0');r(12,18,8,10,'#3a2010');disc(25,25,3,'#f7c948')}
  if(k==='personagem'){const keep=RUN;RUN={char:META.char};try{drawGardener({face:1,x:16,y:30,vx:0,vy:0,on:true,sq:1,anim:0,slam:false,stun:0,inv:0,faint:0,swing:0})}finally{RUN=keep}}
  if(k==='jornada'){NICONS.chefe()}
  if(k==='arvore'){r(15,14,3,16,'#7a4a2e');blob(16,11,12,8,'#2a7a3a','#5fc060','#b0f090',77);[[8,10],[22,9],[14,6],[19,15],[10,15]].forEach(([a,b],i)=>r(a,b,2,2,['#ff4f7b','#c58cff','#f7c948','#5af0ff','#ffa64a'][i]))}
  if(k==='codex'){ICONS.profecia()}
  if(k==='config'){disc(16,16,10,'#9aa0b0');disc(16,16,4,'#3a2a2a');for(let i=0;i<8;i++){const a=i/8*Math.PI*2;r(15+Math.cos(a)*11,15+Math.sin(a)*11,3,3,'#9aa0b0')}}
  if(k==='intro'){disc(16,16,11,'#2a5bd7');disc(16,16,9,'#4a8af0');r(15,9,3,3,'#fff');r(15,14,3,9,'#fff')}
  if(k==='conquistas'){disc(16,14,8,'#f7c948');disc(16,14,6,'#ffe08a');r(11,21,4,8,'#e0284a');r(17,21,4,8,'#2a5bd7');r(15,11,2,6,'#c9921a')}
  C=x}
function showHub(){
  if(!S||S.state!=='title'){blankBattle('eden');S.state='title'}MUS.mode='calm';RUN=null;
  const tile=(k,label,sub,locked)=>`<button type="button" class="hubtile ${locked?'locked':''}" data-hub="${k}" ${locked?'disabled':''}><canvas width="32" height="32" data-hubicon="${k}"></canvas><b>${label}</b><small>${sub}</small></button>`;
  const doneN=Object.keys(META.done).length;
  if(!META.intro){META.intro=1;saveMeta();return showIntro(0)}
  menu(`<div class="mbox"><small class="eyebrow">O fruto do Espírito · Gálatas 5:22-23</small><h1>Farm Defense Saga</h1>${coinsTag()}
    <div class="hubgrid">
      ${tile('aventura','Aventura',doneN+'/'+LEVELS.length+' fases')}
      ${tile('jardim','Jardim',gardenOpen()?'Plante, regue e venda':'Libera ao vencer Éden 1-4',!gardenOpen())}
      ${treeOwned()?tile('arvore','Árvore da Vida',META.garden.tree.planted?'Nível '+META.garden.tree.lvl+'/10':'Semente pronta para plantar'):''}
      ${tile('loja','Loja','Ferramentas, barreiras e sementes')}
      ${tile('personagem','Lavrador',CHARS[META.char].name+' · '+WEAPONS[META.weapon].name)}
      ${tile('jornada','Jornada',jornadaOpen()?'Modo desafio em 3 atos':'Libera ao vencer Jericó 2-4',!jornadaOpen())}
      ${tile('codex','Códex','Cartas, inimigos, relíquias')}
      ${tile('intro','Como jogar','Tutorial ilustrado')}
      ${tile('config','Configurações','Som, modo leve, progresso')}
      ${tile('conquistas','Conquistas',Object.keys(META.ach).length+'/'+Object.keys(ACH).length)}
    </div>
    <p class="keys">← → andar · ↑ pular · ↓ no ar: pisão · parado ao lado da árvore: regar · X golpe · Q cerca · E espantalho · R lama · 1 a 4 cartas (ou arraste) · Enter chama a onda · M som</p></div>`);
  $('menu').querySelectorAll('canvas[data-hubicon]').forEach(c=>hubIconTo(c,c.dataset.hubicon));paintCoins();
  $('menu').querySelectorAll('[data-hub]').forEach(b=>b.onclick=()=>{initAudio();sfx('card');({aventura:showWorld,jardim:showGarden,arvore:showTree,intro:()=>showIntro(0),config:showConfig,loja:()=>showShop2('ferramentas'),personagem:showLavrador,jornada:showJornada,codex:()=>showCodex('cartas'),conquistas:showAchs})[b.dataset.hub]()});
}
GO.title=showHub;GO.hub=showHub;
function showJornada(){
  const saved=store.get('fds-run',null),today=todayKey(),best=META.daily[today];
  menu(`<div class="mbox"><small class="eyebrow">Modo desafio</small><h2>Jornada</h2><p>Três atos com caminho sorteado, eventos, relíquias e chefes. Cada partida é diferente.</p>
    <div class="col">${saved?`<button class="btn" data-go="cont">Continuar jornada · ${ACTS[saved.RUN.act].name}</button>`:''}
      <button class="btn ${saved?'ghost':''}" data-go="newrun">Nova jornada</button>
      <button class="btn ghost" data-go="daily">Desafio diário${best!=null?' · recorde '+best:''}</button>
      <button class="btn ghost" data-go="hub">Voltar</button></div></div>`);
}

// ---------- world map: floating islands
let wmapTimer=null,selWorld=null;
function islandAt(I,top,open,landmark){
  const{x:cx,y:cy,w}=I,dep=w*.42;
  for(let j=0;j<dep;j++){const hw=w/2*Math.pow(1-j/dep,.7);const c=hs(j,cx)>.5?'#5a4a5a':'#6a5a6a';r(cx-hw,cy+j,hw*2,1,j%7===0?'#4a3a4a':c)}
  for(let i=0;i<6;i++){const rx=cx-w/3+hs(i,cx)*w*.66;for(let j=0;j<6+hs(i,3)*10;j++)r(rx+Math.sin(j*.5)*1,cy+dep*.3+j,1,1,'#3a5a3a')}
  blob(cx,cy,w/2,w/7|0,top[0],top[1],top[2],cx);r(cx-w/2+4,cy+2,w-8,2,top[0]);
  landmark&&landmark(cx,cy-4);
  if(!open){C.globalAlpha=.55;blob(cx,cy-6,w/2+2,w/5|0,'#8a8a9a','#a0a0b0','#c0c0d0',cx+1);C.globalAlpha=1;r(cx-4,cy-16,8,7,'#c9a24a');r(cx-3,cy-20,6,4,'#c9a24a');r(cx-2,cy-19,4,3,'#2a1e3a');r(cx-1,cy-13,2,3,'#2a1e3a')}
}
const LANDMARK={
  eden(cx,cy){r(cx-2,cy-24,5,24,'#7a4a2e');blob(cx,cy-30,20,12,'#2a7a3a','#5fc060','#b0f090',9);for(let i=0;i<6;i++)r(cx-14+hs(i,2)*28,cy-38+hs(i,3)*14,2,2,'#ffe36a');palm(cx+30,cy+2,'#3a6a3a')},
  jerico(cx,cy){r(cx-34,cy-14,68,14,'#b88a5a');for(let i=0;i<68;i+=6)r(cx-34+i,cy-17,3,3,'#b88a5a');r(cx-8,cy-28,16,28,'#a07848');for(let i=0;i<16;i+=5)r(cx-8+i,cy-31,3,3,'#a07848');r(cx-3,cy-10,6,10,'#3a2010');r(cx+20,cy-12,2,4,'#e0284a')},
  mar(cx,cy){r(cx-34,cy-4,68,6,'#2a6aa8');const o=Math.sin(wt*2)*2;r(cx-34,cy-16+o,12,14,'#4a9ad8');r(cx+22,cy-16-o,12,14,'#4a9ad8');r(cx-22,cy-2,44,3,'#e8c890');for(let i=0;i<5;i++)r(cx-30+i*14+((wt*8)%6),cy-4,3,1,'#d8f0ff');
    for(let j=0;j<40;j++)r(cx+40+Math.sin(j*.3+wt*6)*1,cy+j,2,1,j%3?'#7ac0f0':'#d8f0ff')},
  sinai(cx,cy){for(let j=0;j<44;j++){const hw=j*1.1;r(cx-hw,cy-44+j,hw*2,1,j<10?'#4a3a5a':'#6a4a5a')}blob(cx,cy-46,18,5,'#3a3260','#4a4278','#5a5288',4);if((wt*1.3%3)<.15){r(cx+4,cy-42,1,8,'#fffbe0');r(cx+5,cy-34,1,6,'#fffbe0')}},
  babel(cx,cy){for(let k=0;k<6;k++)r(cx-30+k*5,cy-6-k*8,60-k*10,8,k%2?'#9a6248':'#7a4a3a');r(cx-2,cy-56,4,8,'#c98a5a')},
  getsemani(cx,cy){oliveTree(cx-20,cy-22,'#0e2a24');oliveTree(cx+18,cy-18,'#123a30');blob(cx+30,cy-46,8,8,'#f8f0d8','#f8f0d8','#ffffff',3);blob(cx-2,cy-2,6,3,'#5a5a70','#7a7a90','#9a9ab0',5)},
  jardim(cx,cy){const lv=META.garden.tree.planted?META.garden.tree.lvl:0;if(lv>0){const s=6+lv*1.6;r(cx-1,cy-s*1.6,3,s*1.6,'#7a4a2e');blob(cx,cy-s*1.8,s|0,(s*.6)|0,'#2a7a3a','#5fc060','#b0f090',33)}else{r(cx-1,cy-8,2,8,'#8a5a2a');r(cx-5,cy-12,10,5,'#c9a060')}
    for(let i=0;i<5;i++){r(cx-24+i*10,cy-6,1,6,'#5fe08a');r(cx-25+i*10,cy-8,3,2,['#e0284a','#9b4be0','#f7c948','#ff8ac0','#ffffff'][i])}}
};
let wt=0;
function drawWorldMap(){
  const cvs=$('wmapc');if(!cvs){clearInterval(wmapTimer);wmapTimer=null;return}
  wt+=.05;const g=cvs.getContext('2d');C=g;
  const gr=g.createLinearGradient(0,0,0,300);gr.addColorStop(0,'#5aa8d8');gr.addColorStop(.6,'#a8d8e8');gr.addColorStop(1,'#d8eef0');g.fillStyle=gr;g.fillRect(0,0,480,300);
  disc(420,40,16,'#fff4c8');
  for(let i=0;i<9;i++){const cx=((hs(i,1)*560+wt*(4+i))%600)-60,cy=20+hs(i,2)*120;blob(cx,cy,20+hs(i,3)*20|0,5+hs(i,4)*4|0,'#d8e8f0','#eef6fa','#ffffff',i+50)}
  // stone bridges between consecutive islands
  for(let i=0;i<WORLDS.length-1;i++){const a=WORLDS[i],b=WORLDS[i+1],open=levelOpen(i*4+4);const n=Math.hypot(b.x-a.x,b.y-a.y)/4|0;
    for(let k=0;k<=n;k++){const u=k/n,px=a.x+(b.x-a.x)*u,py=a.y+(b.y-a.y)*u+Math.sin(u*Math.PI)*10;if(k%2)r(px-1,py,3,2,open?'#c9a060':'#8a8a9a')}}
  WORLDS.forEach((w,i)=>islandAt(w,w.top,levelOpen(i*4),LANDMARK[w.id]));
  if(selWorld!=null){const w=WORLDS[selWorld];C.globalAlpha=.5+Math.sin(wt*4)*.3;ring(w.x,w.y-10,w.w/2+6,'#ffe36a');C.globalAlpha=1}
  for(let i=0;i<7;i++){const cx=((hs(i,7)*560-wt*(6+i))%600+600)%600-60;blob(cx,294,40,12,'#c8d0e0','#dde4ee','#ffffff',i+80)}
  C=x;
}
function showWorld(sel){
  if(sel!=null)selWorld=sel;else if(selWorld==null){selWorld=0;for(let i=WORLDS.length-1;i>=0;i--)if(levelOpen(i*4)){selWorld=i;break}}
  const plate=(w,i)=>{const n=LEVELS.filter(l=>l.wi===i&&META.done[l.id]).length,open=levelOpen(i*4);
    return `<button type="button" class="isle ${selWorld===i?'on':''} ${open?'':'locked'}" style="left:${w.x/480*100}%;top:${(w.y+18)/300*100}%" data-w="${i}" ${open?'':'disabled'}><b>${w.name}</b><small>${open?n+'/4 fases':'bloqueada'}</small></button>`};
  const w=WORLDS[selWorld];
  const lv=LEVELS.filter(l=>l.wi===selWorld);
  menu(`<div class="mbox wide"><div class="topbar"><button class="btn ghost" data-go="hub">‹ Menu</button><h2>Aventura</h2>${coinsTag()}</div>
    <div class="wmap"><canvas id="wmapc" width="480" height="300"></canvas>${WORLDS.map(plate).join('')}
</div>
    <div class="lvpanel"><h3>${w.name}</h3><div class="lvrow">${lv.map(l=>{const open=levelOpen(l.n),done=META.done[l.id],unl=UNLOCK_ORDER[l.n];
      return `<button type="button" class="lvl ${l.night?'night':'day'} ${done?'done':''}" data-l="${l.n}" ${open?'':'disabled'}><canvas width="16" height="16" data-sky="${l.night?1:0}"></canvas>
        <b>${l.id}</b><small>${l.night?'Noite':'Dia'}${l.boss?' · '+EN[l.boss].name:''}${l.rule?' · '+RULES[l.rule].name:''}</small><span class="stars">${done?starStr(starsOf(l.id)):''}</span><small class="rw">${done?'vencida':open?(unl&&!META.unlocked.includes(unl)?'Nova carta: '+CARDS[unl].name:'Moedas'):'bloqueada'}</small></button>`}).join('')}</div></div></div>`);
  paintCoins();
  $('menu').querySelectorAll('canvas[data-sky]').forEach(c=>{const g=c.getContext('2d');C=g;if(c.dataset.sky==='1'){disc(8,8,6,'#f8f0d8');disc(10,6,5,'#2a3060')}else{disc(8,8,5,'#ffd34a');for(let i=0;i<8;i++){const a=i/8*Math.PI*2;r(8+Math.cos(a)*7,8+Math.sin(a)*7,1,1,'#ffd34a')}}C=x});
  $('menu').querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{sfx('card');showWorld(+b.dataset.w)});
  $('menu').querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{initAudio();startLevel(+b.dataset.l)});
  clearInterval(wmapTimer);drawWorldMap();wmapTimer=setInterval(drawWorldMap,60);
}

// ---------- playing a level
function advColl(){const c=[];const cc=CHARS[META.char].card;if(cc)c.push(mk(cc),mk(cc));META.unlocked.forEach(k=>{c.push(mk(k));if(CARDS[k].type==='semente'||k==='mana')c.push(mk(k))});return c}
function startLevel(n){
  const L=LEVELS[n],w=WORLDS[L.wi];UID=1;
  RUN={mode:'level',level:n,char:META.char,asc:0,daily:false,seed:0,act:w.act,row:0,rows:[],path:[],hp:20,maxhp:20,siclos:0,coll:advColl(),deck:[],relics:[],handSize:4,esau:-1,samaritano:0,seenEv:[],stats:{kills:0,bosses:0},podas:0};
  const prev=META.lastDeck&&META.lastDeck.length?META.lastDeck:null;
  RUN.deck=prev?RUN.coll.filter((c,i,a)=>prev.includes(c.k)&&a.findIndex(o=>o.k===c.k)===i).concat(RUN.coll.filter((c,i,a)=>prev.includes(c.k)&&a.findIndex(o=>o.k===c.k)!==i)).slice(0,deckMax()):RUN.coll.slice(0,deckMax());
  showDeck();
}
function levelNode(){
  const L=LEVELS[RUN.level],w=WORLDS[L.wi];seedRng(9001+L.n*977);
  const nW=L.l===0?2:3,waves=[];
  for(let i=0;i<nW;i++)waves.push(genWave(w.act,i+L.l,'batalha',0));
  if(L.boss){waves[waves.length-1].list.unshift([L.boss,2.5]);waves[waves.length-1].name=EN[L.boss].name}
  RNG=Math.random;
  return{type:L.boss?'chefe':'batalha',map:w.arena&&L.boss?w.arena:w.map,waves,night:L.night,level:L.id};
}
function startLevelBattle(){META.lastDeck=RUN.deck.map(c=>c.k);saveMeta();const L=LEVELS[RUN.level];if(L.rule==='poucas')RUN.handSize=3;hideMenu();clearInterval(wmapTimer);const node=levelNode();startBattle(node);
  if(L.rule==='sempisao')S.noSlam=true;if(L.rule==='trevas')S.trevas=true;if(L.rule)banner('Regra da fase',RULES[L.rule].name+': '+RULES[L.rule].desc)}
function levelWon(){
  const L=LEVELS[RUN.level],first=!META.done[L.id],treeBonus=1+(META.garden.tree.lvl||0)*.05;
  const reward=Math.round((first?60+L.n*20:30+L.n*5)*treeBonus),picked=Math.round(S.coins*treeBonus);
  META.coins+=reward+picked;META.done[L.id]=1;const stars=RUN.hp>=18?3:RUN.hp>=10?2:1;META.stars=META.stars||{};const newBest=stars>(META.stars[L.id]||0);META.stars[L.id]=Math.max(stars,META.stars[L.id]||0);
  let card=null;const unl=UNLOCK_ORDER[L.n];if(first&&unl&&!META.unlocked.includes(unl)){META.unlocked.push(unl);card=mk(unl)}
  saveMeta();MUS.mode='calm';
  const news=[];if(L.id==='1-4')news.push('O Jardim foi liberado! Plante, regue e venda. Junte moedas para a semente da Árvore da Vida.');
  if(L.id==='2-4')news.push('O modo Jornada foi liberado no menu.');
  const last=RUN.level===LEVELS.length-1;
  menu(`<div class="mbox"><small class="eyebrow">${WORLDS[L.wi].name} · ${L.id} · ${L.night?'Noite':'Dia'}</small><h2>Fase vencida!</h2><p class="bigstars">${starStr(stars)}</p><p class="help">${stars<3?'3 estrelas: termine com 18 de Vida ou mais.':'Perfeito!'}${newBest&&!first?' Novo recorde!':''}</p>
    <p>+${reward} moedas pela fase · +${picked} moedas recolhidas${treeBonus>1?' (Árvore da Vida +'+Math.round((treeBonus-1)*100)+'%)':''}</p>${coinsTag()}
    ${card?`<div class="sec"><h3>Nova carta liberada</h3><div class="grid g3">${cardHTML(card)}</div></div>`:''}
    ${news.map(t=>`<p class="epi">${t}</p>`).join('')}
    <div class="row"><button class="btn ghost" id="tomap">Mapa</button>${last?`<button class="btn" id="fim">Ir ao último jardim</button>`:`<button class="btn" id="next">Próxima fase</button>`}</div></div>`,card?[card]:[]);
  paintCoins();
  $('tomap').onclick=()=>showWorld();
  if($('next'))$('next').onclick=()=>{const n=RUN.level+1;selWorld=LEVELS[n].wi;startLevel(n)};
  if($('fim'))$('fim').onclick=()=>startEpilogue();
}
function levelLost(){
  const picked=Math.round(S.coins*.5);META.coins+=picked;saveMeta();MUS.mode='calm';
  menu(`<div class="mbox"><small class="eyebrow">${LEVELS[RUN.level].id}</small><h2>O jardim secou</h2><p>Você guardou ${picked} moedas. Tente de novo com outras sementes, ou passe na loja.</p>
    <div class="row"><button class="btn ghost" id="tomap">Mapa</button><button class="btn ghost" id="toshop">Loja</button><button class="btn" id="again">Tentar de novo</button></div></div>`);
  $('tomap').onclick=()=>showWorld();$('toshop').onclick=()=>showShop2('ferramentas');$('again').onclick=()=>startLevel(RUN.level);
}

// ---------- the gardener: character and tool
function sheetHTML(){
  const ch=CHARS[META.char],w=WEAPONS[META.weapon],hearts=3+META.upg.hearts+META.upg.treeHearts,doneN=Object.keys(META.done).length,
    stars=Object.values(META.stars||{}).reduce((a,b)=>a+b,0),mx=k=>Math.max(...Object.values(WEAPONS).map(v=>v[k])),
    stat=(l,v,f,g)=>`<div class="stat"><b>${l}</b><span>${v}</span><div class="meter ${g||''}"><i style="width:${Math.round(clamp(f,0,1)*100)}%"></i></div></div>`;
  const slot=(cv,name,sub,empty)=>`<div class="slotbox ${empty?'empty':''}">${cv}<b>${name}</b><small>${sub}</small></div>`;
  return `<div class="sheetrow"><div class="sheet"><div class="who"><div class="portrait"><canvas width="32" height="40" data-char="${META.char}"></canvas></div><div><h4>${ch.name}</h4><small>${ch.desc}</small></div></div>
    ${stat('Corações',hearts+' / '+Math.max(hearts,8),hearts/Math.max(hearts,8))}${stat('Dano · '+w.name,w.dmg,w.dmg/mx('dmg'))}${stat('Alcance',w.rng,w.rng/mx('rng'))}
    ${stat('Fases vencidas',doneN+' / '+LEVELS.length,doneN/LEVELS.length,'g')}${stat('Estrelas',stars+' / '+LEVELS.length*3,stars/(LEVELS.length*3),'g')}</div>
    <div class="sheet"><h4>Equipamento</h4><div class="slots">${slot(`<canvas width="32" height="32" data-tool="${META.weapon}"></canvas>`,w.name,'Golpe · X')}
    ${Object.entries(ITEMS).map(([k,it])=>slot(`<canvas width="32" height="32" data-bar="${k}"></canvas>`,it.name,'×'+(META.items[k]||0)+' · tecla '+it.key,!META.items[k])).join('')}</div></div></div>`}
function showLavrador(){
  const render=()=>{menu(`<div class="mbox"><div class="topbar"><button class="btn ghost" data-go="hub">‹ Menu</button><h2>O lavrador</h2>${coinsTag()}</div>
    ${sheetHTML()}
    <div class="sec"><h3>Personagem</h3><div class="grid g5">${Object.entries(CHARS).map(([k,c])=>{const ok=META.chars[k];return`<button type="button" class="pick ${META.char===k?'on':''} ${ok?'':'locked'}" data-ch="${k}" ${ok?'':'disabled'}>
      <canvas width="32" height="40" data-char="${k}"></canvas><b>${c.name}</b><small>${ok?c.desc:'Bloqueado: '+c.hint}</small>${ok&&c.card?`<small>Carta: ${CARDS[c.card].name}</small>`:''}</button>`}).join('')}</div></div>
    <div class="sec"><h3>Ferramenta (X)</h3><div class="grid g5">${Object.entries(WEAPONS).map(([k,w])=>{const own=META.weapons[k];return`<button type="button" class="pick ${META.weapon===k?'on':''} ${own?'':'locked'}" data-wp="${k}" ${own?'':'disabled'}>
      <canvas width="32" height="32" data-tool="${k}"></canvas><b>${w.name}</b><small>${w.desc}</small><small>Dano ${w.dmg} · alcance ${w.rng}</small>${own?'':'<i>compre na loja</i>'}</button>`}).join('')}</div></div>
    <p class="help">Corações: ${3+META.upg.hearts+META.upg.treeHearts} · Encostar nas pragas tira um coração. Sem corações, você desmaia por 3s e perde maná.</p></div>`);
    paintCoins();
    $('menu').querySelectorAll('canvas[data-char]').forEach(c=>charIconTo(c,c.dataset.char));
    $('menu').querySelectorAll('canvas[data-tool]').forEach(c=>toolIconTo(c,c.dataset.tool));
    $('menu').querySelectorAll('canvas[data-bar]').forEach(c=>barrierIconTo(c,c.dataset.bar));
    $('menu').querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{META.char=b.dataset.ch;saveMeta();sfx('card');render()});
    $('menu').querySelectorAll('[data-wp]').forEach(b=>b.onclick=()=>{META.weapon=b.dataset.wp;saveMeta();sfx('card');render()})};render();
}

// ---------- shop
const UPGRADES={hearts:{name:'Coração extra',prices:[200,500,1000],desc:'+1 coração em toda batalha.'},bag:{name:'Bolsa maior',prices:[300,800],desc:'+1 carta na bolsa.'},mana:{name:'Maná inicial',prices:[250,600],desc:'+2 de maná no começo das batalhas.'}};
const GPLANTS={trigo:{name:'Trigo',price:20,stage:40,sell:50,col:'#e8c86a'},uva:{name:'Uva',price:50,stage:90,sell:130,col:'#9b4be0'},roma:{name:'Romã',price:120,stage:180,sell:320,col:'#e0284a'},oliva:{name:'Oliva',price:300,stage:360,sell:850,col:'#b8cf9a'}};
const TREE_SEED_PRICE=2000;
function shopIconTo(cvs,k){const g=cvs.getContext('2d');g.clearRect(0,0,32,32);C=g;
  if(k==='hearts'){[[9,8,6],[17,8,6],[7,10,18],[7,12,18],[9,14,14],[11,16,10],[13,18,6],[15,20,2]].forEach(([a,b,w])=>r(a,b,w,2,'#ff4f7b'));r(10,10,3,2,'#ffb0c8')}
  if(k==='bag'){r(8,10,16,18,'#c9a99a');r(8,10,16,3,'#e8dcc0');r(11,6,10,4,'#a88a7a');r(14,16,4,6,'#5fe08a')}
  if(k==='mana'){disc(16,16,9,'#6a24a8');disc(16,16,7,'#9b4be0');r(12,11,4,3,'#e2b0ff')}
  if(k.startsWith('seed:')){const p=GPLANTS[k.slice(5)];r(9,8,14,20,'#c9a060');r(9,8,14,3,'#e8c890');r(12,4,8,4,'#a8784a');disc(16,18,4,p.col)}
  if(k==='vaso'){r(8,14,16,14,'#b0603a');r(6,12,20,4,'#d07a4a');r(10,16,2,10,'#d07a4a')}
  if(k==='adubo'){r(7,8,18,20,'#6a4a2a');r(7,8,18,3,'#8a6a3a');r(10,16,12,6,'#3a2414');r(13,4,6,4,'#5a3a20')}
  if(k==='fertil'){r(11,6,10,4,'#5fe08a');r(9,10,14,18,'#2a8a5a');r(11,14,10,8,'#9ff7b8');r(14,16,4,4,'#ffffff')}
  if(k==='arvore'){disc(16,18,8,'#c9921a');disc(16,18,6,'#f7c948');r(15,6,2,8,'#5fe08a');r(12,6,3,2,'#5fe08a');r(17,5,3,2,'#5fe08a');for(let i=0;i<6;i++){const a=i/6*Math.PI*2+wt;r(16+Math.cos(a)*12,18+Math.sin(a)*12,1,1,'#fff6c0')}}
  C=x}
function showShop2(tab){
  const tabs={ferramentas:'Ferramentas',barreiras:'Barreiras',melhorias:'Melhorias',jardim:'Jardim',arvore:'Árvore da Vida'};let items=[];
  if(tab==='ferramentas')items=Object.entries(WEAPONS).filter(([k])=>k!=='enxada').map(([k,w])=>({id:'w:'+k,icon:['tool',k],name:w.name,desc:w.desc,price:w.price,owned:!!META.weapons[k]}));
  if(tab==='barreiras')items=Object.entries(ITEMS).map(([k,it])=>({id:'i:'+k,icon:['bar',k],name:it.name+' ×'+it.qty,desc:it.desc+' Tecla '+it.key+'. Você tem '+(META.items[k]||0)+'.',price:it.price}));
  if(tab==='melhorias')items=Object.entries(UPGRADES).map(([k,u])=>{const lv=META.upg[k]||0;return{id:'u:'+k,icon:['shop',k],name:u.name+' ('+lv+'/'+u.prices.length+')',desc:u.desc,price:u.prices[lv],owned:lv>=u.prices.length}});
  if(tab==='jardim'){items=Object.entries(GPLANTS).map(([k,p])=>({id:'s:'+k,icon:['shop','seed:'+k],name:'Semente de '+p.name,desc:'Vende por '+p.sell+' moedas quando madura. Você tem '+(META.garden.seeds[k]||0)+'.',price:p.price}));
    items.push({id:'g:vaso',icon:['shop','vaso'],name:'Vaso novo ('+META.garden.potsN+'/12)',desc:'Mais um lugar para plantar.',price:150+META.garden.potsN*40,owned:META.garden.potsN>=12});
  }
  if(tab==='arvore'){items=[{id:'g:arvore',icon:['shop','arvore'],name:'Semente da Árvore da Vida',desc:'Abre um lugar só para ela no menu. “No meio da praça... estava a árvore da vida.” (Apocalipse 22:2)',price:TREE_SEED_PRICE,owned:treeOwned(),rare:1}];
    if(treeOwned()){items.push({id:'g:adubo',icon:['shop','adubo'],name:'Adubo',desc:'+20 de crescimento. Você tem '+META.garden.adubo+'.',price:100});
      items.push({id:'g:fertil',icon:['shop','fertil'],name:'Fertilizante',desc:'+70 de crescimento. Você tem '+META.garden.fertil+'.',price:400})}}
  menu(`<div class="mbox wide"><div class="topbar"><button class="btn ghost" data-go="hub">‹ Menu</button><h2>Loja</h2>${coinsTag()}</div>
    <div class="row">${Object.entries(tabs).map(([k,t])=>`<button class="btn ghost ${k===tab?'act':''}" data-tab="${k}">${t}</button>`).join('')}</div>
    <div class="grid">${items.map(it=>`<div class="shopcard ${it.rare?'rare':''}"><canvas width="32" height="32" data-si="${it.icon.join(':')}"></canvas><b>${it.name}</b><small>${it.desc}</small>
      <button class="btn ${it.owned?'ghost':''}" data-buy="${it.id}" ${it.owned||META.coins<it.price?'disabled':''}>${it.owned?'Já tem':it.price+' moedas'}</button></div>`).join('')}</div>
    ${tab==='jardim'&&!gardenOpen()?'<p class="help">O jardim abre ao vencer a fase 1-4. Você já pode comprar sementes.</p>':''}${tab==='arvore'&&!treeOwned()?'<p class="help">Adubo e fertilizante aparecem depois que você comprar a semente.</p>':''}</div>`);
  paintCoins();
  $('menu').querySelectorAll('canvas[data-si]').forEach(c=>{const[t,...k]=c.dataset.si.split(':');const kk=k.join(':');if(t==='tool')toolIconTo(c,kk);else if(t==='bar')barrierIconTo(c,kk);else shopIconTo(c,kk)});
  $('menu').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>showShop2(b.dataset.tab));
  $('menu').querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const[t,k]=b.dataset.buy.split(':');let price=0;
    if(t==='w'){price=WEAPONS[k].price;META.weapons[k]=1;META.weapon=k}
    if(t==='i'){price=ITEMS[k].price;META.items[k]=(META.items[k]||0)+ITEMS[k].qty}
    if(t==='u'){const lv=META.upg[k]||0;price=UPGRADES[k].prices[lv];META.upg[k]=lv+1}
    if(t==='s'){price=GPLANTS[k].price;META.garden.seeds[k]=(META.garden.seeds[k]||0)+1}
    if(t==='g'){if(k==='vaso'){price=150+META.garden.potsN*40;META.garden.potsN++}if(k==='adubo'){price=100;META.garden.adubo++}if(k==='fertil'){price=400;META.garden.fertil++}if(k==='arvore'){price=TREE_SEED_PRICE;if(META.coins<price)return;META.garden.treeSeed=1;toast('A Árvore da Vida apareceu no menu','Gênesis 2:9')}}
    if(META.coins<price)return;META.coins-=price;saveMeta();sfx('coin');showShop2(tab)});
}

// ---------- garden: pots that grow in real time, and the tree of life
const TREE_REWARDS=[null,{coins:150,txt:'150 moedas'},{items:{cerca:4},txt:'4 cercas'},{rare:1,txt:'uma carta consagrada no celeiro'},{heart:1,txt:'+1 coração em toda batalha'},
  {coins:500,txt:'500 moedas'},{items:{espantalho:3,lama:4},txt:'3 espantalhos e 4 poças de lama'},{rare:1,txt:'outra carta consagrada'},{weapon:'arado',txt:'o Arado'},{coins:1500,txt:'1500 moedas'},{final:1,txt:'as folhas para a cura das nações: +50% de moedas'}];
const treeNeed=lv=>100+lv*80;
function potAdvance(p){const P=GPLANTS[p.k],now=Date.now();while(p.watered&&p.stage<3&&now-p.t0>=P.stage*1000){p.t0+=P.stage*1000;p.stage++;p.watered=p.stage<3?false:true}}

// ---------- settings
function showConfig(){let armed=false;
  const render=()=>{menu(`<div class="mbox"><div class="topbar"><button class="btn ghost" data-go="hub">‹ Menu</button><h2>Configurações</h2><span></span></div>
    <div class="cfg"><label>Música <input type="range" id="cmus" min="0" max="1" step="0.05" value="${CFG.mus}"></label>
    <label>Efeitos <input type="range" id="csfx" min="0" max="1" step="0.05" value="${CFG.sfx}"></label>
    <label class="chk"><input type="checkbox" id="clite" ${CFG.lite?'checked':''}> Modo leve <small>sem brilho, neblina e distorção; para aparelhos mais fracos</small></label>
    <label class="chk"><input type="checkbox" id="cmute" ${muted?'checked':''}> Silenciar tudo (M)</label></div>
    <div class="sec"><h3>Progresso</h3><p class="help">Apaga fases, moedas, jardim, árvore, cartas e conquistas deste navegador.</p>
    <button class="btn ${armed?'act':'ghost'}" id="creset">${armed?'Tem certeza? Clique de novo para apagar tudo':'Reiniciar progresso'}</button></div></div>`);
    $('cmus').oninput=e=>{CFG.mus=+e.target.value;saveCfg()};$('csfx').oninput=e=>{CFG.sfx=+e.target.value;saveCfg();sfx('coin')};
    $('clite').onchange=e=>{CFG.lite=e.target.checked;saveCfg()};$('cmute').onchange=e=>{initAudio();setMuted(e.target.checked)};
    $('creset').onclick=()=>{if(!armed){armed=true;return render()}['fds-meta','fds-run','jardim-do-fruto-celeiro'].forEach(k=>store.del(k));location.reload()}};render()}
// ---------- show which works of the flesh come, on the seed screen
function wavePreviewHTML(){if(!RUN||RUN.mode!=='level')return'';const node=levelNode(),cnt={};node.waves.forEach(w=>w.list.forEach(([k])=>{if(!EN[k].hide)cnt[k]=(cnt[k]||0)+1}));
  return `<div class="sec"><h3>Vêm nesta fase</h3><div class="foes">${Object.entries(cnt).map(([k,n])=>`<span class="foe" title="${EN[k].desc}${EN[k].weak?' Fraco contra '+CARDS[EN[k].weak].name+'.':''}"><canvas width="48" height="48" data-enemy="${k}"></canvas><b>${EN[k].name}</b><small>×${n}${EN[k].weak?' · '+CARDS[EN[k].weak].name:''}</small></span>`).join('')}</div></div>`}
