// ---------- mini-games: short twists on the main game, each with a trophy, opened as the adventure goes on
const MINIS={
  raposas:{name:'As raposinhas',ref:'Cânticos 2:15',desc:'Acerte as raposas que estragam a vinha. Não acerte os cordeiros. Faça 20 pontos.',at:2,solo:1},
  chuva:{name:'Chuva de sementes',ref:'Isaías 55:10',desc:'As cartas caem do céu. Corra para pegar e plante de graça.',at:3,level:1,waves:3},
  escuro:{name:'Na escuridão',ref:'João 1:5',desc:'As pragas só aparecem no clarão dos raios, perto das árvores ou perto de você.',at:5,level:5,waves:3},
  funda:{name:'A funda de Davi',ref:'1 Samuel 17:49',desc:'Sem árvores: só você e a funda. Aperte X para atirar pedras.',at:6,level:12,waves:3},
  ultima:{name:'Última resistência',ref:'Efésios 6:13',desc:'Maná só no começo e entre as ondas. Cada carta conta.',at:8,level:9,waves:5},
  voltas:{name:'Sete voltas',ref:'Josué 6:15',desc:'Dê 7 voltas pela torre do meio antes de o tempo acabar.',at:10,level:4,waves:3,time:80}};
const MINI_PRIZE=150;
const miniOpen=k=>winsN()>=MINIS[k].at;
const trophies=()=>Object.keys(MINIS).filter(k=>META.mg&&META.mg[k]).length;

function showMinis(){META.mg=META.mg||{};
  menu(`<div class="mbox wide cabin"><div class="topbar"><button class="btn ghost" data-go="hub">‹ Menu</button><h2>Minijogos</h2><span class="trophies">🏆 ${trophies()}/${Object.keys(MINIS).length}</span></div>
    <div class="minis">${Object.entries(MINIS).map(([k,m])=>{const open=miniOpen(k),got=META.mg[k];return`<button type="button" class="mtile ${open?'':'locked'} ${got?'got':''}" data-mini="${k}" ${open?'':'disabled'}>
      <canvas width="96" height="64" data-mart="${k}"></canvas><b>${open?m.name:'?'}</b><small>${open?m.ref:'abre após '+m.at+' fases'}</small>${got?'<i class="trophy">🏆</i>':''}</button>`}).join('')}</div>
    <p class="help" id="minfo">Escolha um minijogo. A primeira vitória em cada um dá um troféu e ${MINI_PRIZE} moedas.</p></div>`);
  $('menu').querySelectorAll('canvas[data-mart]').forEach(c=>miniArt(c,c.dataset.mart));
  $('menu').querySelectorAll('[data-mini]').forEach(b=>{const m=MINIS[b.dataset.mini];b.onmouseenter=()=>{if(miniOpen(b.dataset.mini))$('minfo').textContent=m.name+': '+m.desc};
    b.onclick=()=>{initAudio();sfx('card');startMini(b.dataset.mini)}})}
function miniArt(cvs,k){const g=hdCtx(cvs,96,64,3);C=g;const sky=g.createLinearGradient(0,0,0,64);sky.addColorStop(0,k==='escuro'?'#0a0e24':'#5aa8e8');sky.addColorStop(1,k==='escuro'?'#2a2a50':'#cfeefc');
  g.fillStyle=sky;g.fillRect(0,0,96,64);r(0,48,96,16,'#5a3a24');r(0,48,96,3,'#5fae4a');
  if(k==='raposas'){for(let i=0;i<3;i++){r(10+i*30,40,16,5,'#2a1a10');foxSprite(18+i*30,44,i===1?1:.5,i===2)}}
  if(k==='chuva'){for(let i=0;i<5;i++){const x0=10+i*18,y0=8+(i*13)%30;r(x0,y0,9,12,'#e8d8b0');r(x0,y0,9,2,'#2f9a5a');disc(x0+4.5,y0+7,2,['#e0284a','#7b2fbf','#5fae4a'][i%3])}drawGardener({face:1,x:48,y:48,vx:0,vy:0,on:true,sq:1,anim:0,slam:false,stun:0,inv:0,faint:0,swing:0})}
  if(k==='escuro'){for(let i=0;i<4;i++){r(14+i*20,34,3,2,'#ffe14a');r(20+i*20,34,3,2,'#ffe14a')}r(60,4,2,10,'#fffbe0');r(57,13,4,2,'#fffbe0');r(55,15,2,8,'#fffbe0')}
  if(k==='funda'){drawGardener({face:1,x:22,y:48,vx:0,vy:0,on:true,sq:1,anim:0,slam:false,stun:0,inv:0,faint:0,swing:0});for(let i=0;i<4;i++)r(32+i*9,30+i*i*1.2,2,2,'#9a9aa8');enemyBody({k:'golias',x:78,y:48,t:1})}
  if(k==='ultima'){for(const tx of[20,44,68])drawTower(['roma','oliveira','sarca'][tx%3],tx,48,1,null,.9);disc(86,12,6,'#9b4be0');r(84,9,3,3,'#e2b0ff')}
  if(k==='voltas'){r(38,18,20,30,'#b88a5a');r(38,18,20,2,'#ecd090');for(let j=22;j<48;j+=5)r(38,j,20,1,'#8a5c3a');r(57,8,1,10,'#4a2a18');r(58,9,6,4,'#e0284a');
    for(let i=0;i<7;i++){const a=i/7*Math.PI*2;r(48+Math.cos(a)*30,40+Math.sin(a)*8,2,2,'#ffe36a')}}
  C=x}

// ---------- battle mini-games reuse the level machinery with a twist
function startMini(k){const M=MINIS[k];if(M.solo)return showFoxes();
  startLevel(M.level);RUN.mini=k;const seeds=META.unlocked.filter(q=>CARDS[q].type==='semente');RUN.coll=(k==='ultima'?[...seeds,...seeds]:seeds).slice(0,10).map(q=>mk(q));RUN.deck=[...RUN.coll];RUN.handSize=4;startLevelBattle()}
function miniNode(){const M=MINIS[RUN.mini],L=LEVELS[RUN.level],w=WORLDS[L.wi],waves=[];seedRng(4242+L.n);
  for(let i=0;i<M.waves;i++)waves.push(genWave(w.act,i+1+L.l,'batalha',0,levelPool(L.n)));RNG=Math.random;
  return{type:'batalha',map:M.map||w.map,waves,night:RUN.mini==='escuro',level:'mini'}}
function miniStart(){const k=RUN.mini;if(!k)return;S.mini=k;const M=MINIS[k];banner('Minijogo · '+M.ref,M.name);toast(M.name,M.desc);
  if(k==='chuva'){S.hand=[null,null,null,null,null];S.draw=[];RUN.handSize=5;S.rcards=[];S.rcT=1;renderHand()}
  if(k==='funda'){S.hand=[];S.draw=[];renderHand()}
  if(k==='escuro'){S.trevas=true;S.darkT=2}
  if(k==='ultima')S.mana=MAXM;
  if(k==='voltas')S.voltT=M.time}
function miniUpdate(dt){const k=S.mini;if(!k)return;const P=S.p;
  if(k==='chuva'){S.mana=MAXM;S.rcT-=dt;if(S.rcT<=0){S.rcT=2.2;S.rcards.push({x:S.cam+rnd(30,W-30),y:-8,c:cartCard(),t:0})}
    for(const rc of S.rcards){rc.t+=dt;const fl=gy(rc.x)-6;if(rc.y<fl)rc.y=Math.min(fl,rc.y+42*dt);
      if(Math.abs(rc.x-P.x)<10&&Math.abs(rc.y-(P.y-8))<16){const i=S.hand.findIndex(c=>!c);if(i>=0){S.hand[i]=rc.c;rc.got=1;S.newIdx=i;renderHand();S.newIdx=-1;sfx('coin');vfx('sparkle',rc.x,rc.y,{s:3})}}}
    S.rcards=S.rcards.filter(rc=>!rc.got&&rc.t<9)}
  if(k==='escuro'){S.darkT-=dt;if(S.darkT<=0){S.darkT=rnd(2.5,4.5);S.flashT=.35;flash(.35,'210,210,255');sfx('wind')}S.flashT=Math.max(0,(S.flashT||0)-dt)}
  if(k==='voltas'&&S.state!=='menu'){if(S.fallen){S.voltT=0;battleWon();return}if(S.state==='wave'||S.state==='prep'){S.voltT-=dt;if(S.voltT<=0){S.state='menu';showOver()}}}}
function slingShot(){const p=S.p;if(p.atkCD>0||p.stun>0)return;p.atkCD=.42;p.swing=.22;sfx('hit');
  S.proj.push({x:p.x+p.face*5,y:p.y-13,vx:p.face*200,vy:-70,g:240,kind:'pstone',dmg:4*(1+.08*tl('dmg')),src:'pedras',life:2})}
// in the dark a pest shows only in a lightning flash, near a tree's light, or close to you
function darkVisible(e){return S.flashT>0||Math.abs(e.x-S.p.x)<30||MAP.slots.some((s,i)=>S.tw[i]&&S.tw[i].grow>=1&&Math.abs(s.x-e.x)<38)}
function drawMini(){if(S.mini==='chuva'&&S.rcards)for(const rc of S.rcards){const b=Math.sin(rc.t*5)*.8,fade=rc.t>7&&(S.t*10|0)%2;if(fade)continue;
    r(rc.x-4,rc.y-6+b,8,11,'#1a0c06');r(rc.x-3.5,rc.y-5.5+b,7,10,'#efe0bc');r(rc.x-3.5,rc.y-5.5+b,7,2,'#2f9a5a');const I=info(rc.c);disc(rc.x,rc.y+b,2,I.fruits[0]?FRUIT_COL[I.fruits[0]]:'#f7c948')}}
function miniHud(){const k=S.mini;if(!k)return'';if(k==='voltas')return'Sete voltas: '+S.laps+'/7 · '+Math.ceil(S.voltT)+'s';if(k==='chuva')return'Pegue as cartas que caem';
  if(k==='escuro')return'Na escuridão: fique perto da luz';if(k==='funda')return'Funda: X atira pedras';if(k==='ultima')return'Maná só entre as ondas';return''}
function miniOver(win){const k=RUN.mini,M=MINIS[k],first=win&&!(META.mg&&META.mg[k]);META.mg=META.mg||{};if(win)META.mg[k]=1;
  const coins=(first?MINI_PRIZE:0)+Math.round(S.coins*(win?1:.5));META.coins+=coins;saveMeta();MUS.mode='calm';
  endScreen({win,eyebrow:'Minijogo · '+M.ref,title:win?(first?'Troféu!':'Vitória!'):'Quase lá',stars:win?3:0,coins,coinNote:first?'troféu + moedas recolhidas':'moedas recolhidas',
    hint:win?(first?'Primeiro troféu de '+M.name+'.':'Você já tinha este troféu.'):M.desc,
    buttons:`<button class="btn ghost" id="tominis">Minijogos</button><button class="btn" id="again">Jogar de novo</button>`});
  $('tominis').onclick=()=>{S.state='title';showMinis()};$('again').onclick=()=>startMini(k)}

// ---------- "As raposinhas": whack the little foxes in the vineyard, leave the lambs alone
function foxSprite(cx,cy,up,lamb){const y0=cy-up*14;if(up<=0)return;
  if(lamb){disc(cx,y0,6,'#f4f0e8');disc(cx-3,y0-3,3,'#ffffff');r(cx-3,y0-1,6,6,'#3a3a3a');r(cx-2,y0+1,1,1,'#ffffff');r(cx+1,y0+1,1,1,'#ffffff');return}
  r(cx-6,y0-2,12,9,'#e0702a');r(cx-6,y0-6,3,5,'#e0702a');r(cx+3,y0-6,3,5,'#e0702a');r(cx-5,y0-5,1,3,'#2a1408');r(cx+4,y0-5,1,3,'#2a1408');
  r(cx-3,y0+2,6,5,'#fff0e0');r(cx-1,y0+3,2,1,'#2a1408');r(cx-4,y0,2,2,'#2a1408');r(cx+2,y0,2,2,'#2a1408');r(cx-4,y0,1,1,'#ffffff');r(cx+2,y0,1,1,'#ffffff')}
let foxLoop=null;
function showFoxes(){const F={t:40,score:0,holes:[],pops:[],over:false};
  for(let j=0;j<3;j++)for(let i=0;i<3;i++)F.holes.push({x:100+i*140+(j%2)*20,y:120+j*62,up:0,dir:0,lamb:false,stay:0,hit:0});
  menu(`<div class="mbox wide cabin foxes"><div class="topbar"><button class="btn ghost" id="fxback">‹ Minijogos</button><h2>As raposinhas</h2><span class="trophies" id="fxscore">0 pontos · 40s</span></div>
    <div class="gscene"><canvas id="foxc" width="960" height="600"></canvas></div><p class="help">“Apanhai as raposinhas que fazem mal às vinhas” (Cânticos 2:15). Clique nas raposas; cordeiro tira 2 pontos.</p></div>`);
  const cvs=$('foxc');let last=performance.now(),spawnT=.5;
  const hitAt=ev=>{if(F.over)return;const rc=cvs.getBoundingClientRect(),mx=(ev.clientX-rc.left)/rc.width*480,my=(ev.clientY-rc.top)/rc.height*300;
    for(const h of F.holes){if(h.up>.4&&Math.abs(mx-h.x)<24&&my<h.y+8&&my>h.y-h.up*36-14){h.hit=1;h.dir=-1;h.stay=0;F.score+=h.lamb?-2:1;F.pops.push({x:h.x,y:h.y-44,t:0,w:h.lamb?'BÉÉ!':pick(['POW!','PÁ!','TOC!','PLAFT!']),bad:h.lamb});sfx(h.lamb?'no':'hit');return}}};
  cvs.addEventListener('pointerdown',hitAt);$('fxback').onclick=()=>{clearInterval(foxLoop);showMinis()};
  clearInterval(foxLoop);foxLoop=setInterval(()=>{if(!cvs.isConnected){clearInterval(foxLoop);return}const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
    if(!F.over){F.t-=dt;spawnT-=dt;if(spawnT<=0){spawnT=Math.max(.35,.9-(40-F.t)/80);const free=F.holes.filter(h=>h.up<=0&&h.dir===0);if(free.length){const h=pick(free);h.dir=1;h.lamb=Math.random()<.18;h.stay=rnd(.7,1.3)-(40-F.t)/90;h.hit=0}}
      for(const h of F.holes){if(h.dir===1){h.up=Math.min(1,h.up+dt*6);if(h.up>=1){h.stay-=dt;if(h.stay<=0)h.dir=-1}}else if(h.dir===-1){h.up=Math.max(0,h.up-dt*6);if(h.up<=0)h.dir=0}}
      if(F.t<=0){F.over=true;foxEnd(F)}}
    $('fxscore')&&($('fxscore').textContent=F.score+' pontos · '+Math.max(0,Math.ceil(F.t))+'s');drawFoxes(cvs,F,dt)},33)}
function drawFoxes(cvs,F,dt){const g=hdCtx(cvs,480,300,2);C=g;
  let gr=g.createLinearGradient(0,0,0,90);gr.addColorStop(0,'#5aa8e8');gr.addColorStop(1,'#cfeefc');g.fillStyle=gr;g.fillRect(0,0,480,90);mount(480,80,8,.03,2,'#8ac08a');
  r(0,86,480,214,'#6aa84a');for(let i=0;i<500;i++)r(hs(i,3)*480,88+hs(i,4)*212,1,1,'#5a9840');
  for(let j=0;j<4;j++){const y=100+j*62;r(0,y,480,2,'#8a5a34');for(let i=0;i<480;i+=40){r(i,y-14,2,16,'#6a4228');blob(i+20,y-10,14,6,'#2a6a2a','#3f8a3a','#7ac050',i+j);[[i+12,y-6],[i+26,y-4]].forEach(([a,b])=>{r(a,b,3,4,'#7b2fbf');r(a,b,1,1,'#c58cff')})}}
  // animals drawn at 2.2x so they are easy to click
  for(const h of F.holes){r(h.x-22,h.y-1,44,9,'#3a2414');r(h.x-20,h.y,40,6,'#1a0c06');g.save();g.beginPath();g.rect(h.x-28,h.y-60,56,64);g.clip();g.translate(h.x,h.y+4);g.scale(2.2,2.2);foxSprite(0,0,h.up,h.lamb);
    if(h.hit&&!h.lamb&&h.up>0){r(-4,-h.up*14-1,2,1,'#2a1408');r(2,-h.up*14-1,2,1,'#2a1408')}g.restore();r(h.x-23,h.y+5,46,3,'#5a3a24')}
  F.pops=F.pops.filter(p=>(p.t+=dt)<.8);for(const p of F.pops){g.font='700 13px "Pixelify Sans", monospace';g.textAlign='center';g.lineWidth=3;g.strokeStyle='#1a0806';g.strokeText(p.w,p.x,p.y-p.t*20);g.fillStyle=p.bad?'#ff8a8a':'#ffcb3a';g.fillText(p.w,p.x,p.y-p.t*20)}
  if(F.over){g.fillStyle='#000a';g.fillRect(0,0,480,300);g.font='22px "Luckiest Guy", sans-serif';g.textAlign='center';g.lineWidth=5;g.strokeStyle='#2a1206';g.strokeText(F.score+' pontos',240,140);g.fillStyle='#ffcb3a';g.fillText(F.score+' pontos',240,140)}
  C=x}
function foxEnd(F){const win=F.score>=20,first=win&&!(META.mg&&META.mg.raposas);META.mg=META.mg||{};if(win)META.mg.raposas=1;const coins=Math.max(0,F.score)+(first?MINI_PRIZE:0);META.coins+=coins;saveMeta();
  sfx(win?'ach':'no');setTimeout(()=>{if(!$('foxc'))return;$('menu').querySelector('.help').innerHTML=`${win?(first?'Troféu! ':'Muito bem! '):'Faltou pouco: são 20 pontos para o troféu. '}+${coins} moedas. <button class="btn sm" id="fxagain">Jogar de novo</button>`;$('fxagain').onclick=showFoxes},600)}
