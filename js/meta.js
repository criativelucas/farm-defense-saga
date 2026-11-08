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
function hubIconTo(cvs,k){const g=hdCtx(cvs,32,32);C=g;
  if(k==='aventura'){disc(16,18,11,'#3a6a3a');disc(16,16,10,'#4faa50');r(10,22,12,6,'#6a5a6a');blob(16,10,7,5,'#2a7a3a','#5fc060','#b0f090',5);r(15,12,2,8,'#7a4a2e')}
  if(k==='jardim'){r(4,22,24,8,'#5a3a20');for(let i=0;i<4;i++){r(6+i*6,16,1,6,'#5fe08a');r(5+i*6,15,3,2,['#e0284a','#9b4be0','#f7c948','#ff8ac0'][i])}r(3,20,26,2,'#8a5a2a')}
  if(k==='loja'){r(5,12,22,16,'#8a5236');r(5,12,22,2,'#b07a40');for(let i=0;i<5;i++)r(4+i*5,6,5,6,i%2?'#e0284a':'#f4f0e0');r(12,18,8,10,'#3a2010');disc(25,25,3,'#f7c948')}
  if(k==='personagem'){const keep=RUN;RUN={char:META.char};try{drawGardener({face:1,x:16,y:30,vx:0,vy:0,on:true,sq:1,anim:0,slam:false,stun:0,inv:0,faint:0,swing:0})}finally{RUN=keep}}
  if(k==='jornada'){NICONS.chefe()}
  if(k==='arvore'){r(15,14,3,16,'#7a4a2e');blob(16,11,12,8,'#2a7a3a','#5fc060','#b0f090',77);[[8,10],[22,9],[14,6],[19,15],[10,15]].forEach(([a,b],i)=>r(a,b,2,2,['#ff4f7b','#c58cff','#f7c948','#5af0ff','#ffa64a'][i]))}
  if(k==='codex'){ICONS.profecia()}
  if(k==='missoes'){r(8,5,16,22,'#e8d8b0');r(8,5,16,2,'#a88a5a');r(8,25,16,2,'#a88a5a');for(let j=10;j<24;j+=5){r(11,j,3,3,'#5fae4a');r(16,j+1,6,1,'#a88a5a')}r(12,10,1,2,'#ffffff')}
  if(k==='config'){disc(16,16,10,'#9aa0b0');disc(16,16,4,'#3a2a2a');for(let i=0;i<8;i++){const a=i/8*Math.PI*2;r(15+Math.cos(a)*11,15+Math.sin(a)*11,3,3,'#9aa0b0')}}
  if(k==='intro'){disc(16,16,11,'#2a5bd7');disc(16,16,9,'#4a8af0');r(15,9,3,3,'#fff');r(15,14,3,9,'#fff')}
  if(k==='conquistas'){disc(16,14,8,'#f7c948');disc(16,14,6,'#ffe08a');r(11,21,4,8,'#e0284a');r(17,21,4,8,'#2a5bd7');r(15,11,2,6,'#c9921a')}
  C=x}
function showHub(){
  if(!S||S.state!=='title'){blankBattle('eden',true);S.state='title';
    [['roma',1],['tamareira',4],['oliveira',6],['videira',9],['amendoeira',11]].forEach(([k,i])=>{if(!MAP.slots[i])return;plantAt(i,[k],false,0);Object.assign(S.tw[i],{grow:1,water:3,szv:1,lvl:3})});S.pops=[];S.wx='petals'}
  MUS.mode='calm';MUS.scene='titulo';RUN=null;
  if(!META.intro){META.intro=1;saveMeta();return showIntro(0)}
  const next=LEVELS.find(l=>!META.done[l.id]),mr=missionsReady();
  let pn=0,qn=0;const plank=(k,label,sub,locked)=>`<button type="button" class="plank2 ${locked?'locked':''}" style="--n:${pn++}" data-hub="${k}" ${locked?'disabled':''}><b>${label}</b>${sub?`<small>${sub}</small>`:''}</button>`;
  const prop=(k,label,tc,badge)=>`<button type="button" class="prop" style="--tc:${tc};--n:${qn++}" data-hub="${k}" title="${label}"><canvas width="48" height="48" data-prop="${k}"></canvas><span>${label}</span>${badge?`<i>${badge}</i>`:''}</button>`;
  menu(`<div class="farmhub">
    <div class="logo"><img src="assets/logo.png" alt="Farm Defense Saga" width="720" height="606">${[[18,22,0],[78,14,.7],[90,52,1.4],[8,62,2.1],[52,6,1.1],[66,78,1.8]].map(([a,b,d])=>`<i class="spk" style="--x:${a}%;--y:${b}%;--d:${d}s"></i>`).join('')}</div>
    <div class="welcome"><b>Bem-vindo de volta,</b><span>${CHARS[META.char].name}!</span>${coinsTag()}</div>
    <div class="barn"><canvas id="barnc" width="400" height="520"></canvas><div class="planks">
      ${plank('aventura','Aventura',next?'fase '+next.id:'tudo vencido!')}
      ${plank('jornada','Jornada',jornadaOpen()?'desafio em 3 atos':'vença Jericó 2-4',!jornadaOpen())}
      ${plank('jardim','Estufa',gardenOpen()?'plante e colha':'vença Éden 1-4',!gardenOpen())}
      ${plank('minijogos','Minijogos',miniOpen('raposas')?trophies()+'/6 troféus':'vença 2 fases',!miniOpen('raposas'))}
      ${treeOwned()?plank('arvore','Árvore da Vida','nível '+META.garden.tree.lvl+'/10'):''}</div></div>
    <div class="props">${prop('codex','Códex','#c8403a')}${prop('loja','Quitanda','#e8902a')}${shopOpen('cartas')?prop('pacotes','Pacotes','#9b5ae0',packGifts()||''):''}${prop('personagem','Lavrador','#e8b830')}${prop('missoes','Missões','#4faa4a',mr||'')}${prop('conquistas','Conquistas','#2aa8a0')}${prop('intro','Ajuda','#3a7ad8')}${prop('config','Ajustes','#7a8094')}</div>
  </div>`);
  $('menu').classList.add('scene');paintCoins();barnArt();
  $('menu').querySelectorAll('canvas[data-prop]').forEach(c=>propIconTo(c,c.dataset.prop));
  $('menu').querySelectorAll('[data-hub]').forEach(b=>{b.onmouseenter=()=>sfx('hit');b.onclick=()=>{initAudio();sfx('card');({aventura:showWorld,jardim:showGarden,arvore:showTree,intro:()=>showIntro(0),config:showConfig,loja:()=>showShop2('ferramentas'),pacotes:showPacks,personagem:showLavrador,jornada:showJornada,minijogos:showMinis,missoes:showMissions,codex:()=>showCodex('cartas'),conquistas:showAchs})[b.dataset.hub]()}});
}
// a two-storey red barn seen from the front: the red wall rises into the gambrel gable, a band of slate shingles
// caps it with a white fascia, hayloft door and pulley up top, braced doors below; dark outline all around
function barnArt(){const g=hdCtx($('barnc'),200,260,2);C=g;
  const red='#c0362c',dk='#8e2622',lt='#d84a3a',wh='#f6eedc',wd='#cfc2aa',ol='#2a1216',sl='#2e2a3e',sl2='#463e5a',sl3='#5e5478';
  // the gable edge: ridge at the middle, a break, steep lower slopes down to the eaves
  const gable=x0=>{const d=Math.abs(x0-100);return d<56?16+d*.39:16+56*.39+(d-56)*1.18};
  const top=x0=>gable(x0)+9;   // the red wall starts under the roof band
  const W0=18,W1=182;
  // outline first, one unit wider than everything
  for(let x0=4;x0<196;x0+=.5){const y0=gable(x0)-2.5;if(y0<80)r(x0,y0,.5,(Math.abs(x0-100)<82?260:Math.min(260,gable(x0)+12))-y0,ol)}
  r(W0-1.5,gable(W0)+4,W1-W0+3,200,ol);
  // red wall with vertical boards, lit from the left
  for(let x0=W0;x0<W1;x0+=.5){const y0=Math.max(top(x0),0),k=(x0-W0)%6;r(x0,y0,.5,260-y0,k<.5?dk:k<1?lt:red)}
  for(let x0=W0;x0<W0+10;x0+=.5){const t=top(x0);r(x0,t,.5,260-t,lt)}
  // the roof band: shingle rows that follow the slope, lighter on the left, a highlight along the outer edge
  for(let x0=5;x0<195;x0+=.5){const y0=gable(x0),h=Math.min(9,Math.abs(x0-100)>82?14:9);
    for(let j=0;j<h;j+=.5){const row=Math.floor(j/3),edge=(x0+row*3)%7<.6||j%3<.5;r(x0,y0+j,.5,.5,edge?sl:x0<100?sl3:sl2)}
    r(x0,y0,.5,.5,'#8a80a8')}
  // white fascia under the shingles, ending at the eaves; a shadow line on the wall below it
  for(let x0=W0-4;x0<W1+4;x0+=.5){const y0=top(x0)-1.5;r(x0,y0,.5,2,wh);if(x0>W0&&x0<W1)r(x0,y0+2,.5,1.5,dk)}
  // ridge cap and weathervane with a rooster
  r(94,12,12,4,sl);r(94,12,12,1,'#9a9ac0');r(99,0,2,13,ol);r(93,4,14,1,ol);r(95,0,7,3,ol);r(102,-1,3,3,'#e0402a');r(95,6,2,1,'#f7c948');
  // corner trims and the floor line
  r(W0,top(W0),4,260,wh);r(W1-4,top(W1-4),4,260,wh);r(W0,150,W1-W0,3,wh);
  // hayloft: door with an X brace, hay spilling out, a pulley beam with rope and hook
  r(82,34,36,34,ol);r(84,36,32,30,'#5a1a14');r(84,36,32,2,wh);r(84,64,32,2,wh);r(84,36,2,30,wh);r(114,36,2,30,wh);
  for(let k=0;k<26;k++){r(86+k*1.1,38+k,1.5,1.5,wh);r(112-k*1.1,38+k,1.5,1.5,wh)}
  for(let i=0;i<10;i++){const hx=86+i*3,hh=4+hs(i,7)*4;r(hx,66-hh,2,hh,'#f0c850');r(hx,66-hh,1,1,'#fff0a0')}r(84,62,32,3,'#e8b840');
  r(96,22,8,5,ol);r(97,23,8,3,'#7a4a2a');r(97,23,8,1,'#a06a3a');r(103,26,1,9,'#c8b088');r(102,34,3,2,'#5a5a60');
  // downstairs: big double doors with braces, small side doors with windows
  r(54,168,92,92,ol);r(56,170,88,90,dk);r(56,170,88,3,wh);r(56,170,3,90,wh);r(141,170,3,90,wh);r(98,170,4,90,wh);
  for(let k=0;k<84;k++){r(59+k*.46,173+k,3,2,wh);r(102+k*.46,173+k,3,2,wh)}
  for(const sx of[24,150]){r(sx-1,191,28,69,ol);r(sx,192,26,68,dk);r(sx,192,26,3,wh);r(sx,192,3,68,wh);r(sx+23,192,3,68,wh);r(sx+9,206,8,8,'#2a3a5a');r(sx+10,207,3,2,'#7a9ac8')}
  // ivy up the left corner, flowers, hay bales by the door
  for(let j=0;j<90;j++)if(hs(j,4)>.35)r(17+Math.sin(j*.3)*3+hs(j,5)*6,258-j*1.5,3,2,j%3?'#3a8a3a':'#5fae4a');
  for(const hx of[36,150]){r(hx-1,245,20,15,ol);r(hx,246,18,14,'#e8c050');r(hx,246,18,2,'#fff0a0');for(let i=hx+2;i<hx+18;i+=4)r(i,248,1,12,'#c8a030')}
  C=x}
function propIconTo(cvs,k){const g=hdCtx(cvs,48,48,3);C=g;
  if(k==='codex'){r(9,10,30,30,'#3a0e0a');r(10,9,28,30,'#a8302a');r(10,9,28,2,'#d85a48');r(10,9,3,30,'#7a1e1a');r(34,11,4,27,'#f0e0c0');for(let j=13;j<37;j+=3)r(35,j,3,1,'#c8b088');
    r(10,9,5,5,'#f7c948');r(33,9,5,3,'#f7c948');r(10,34,5,5,'#f7c948');r(15,16,16,15,'#7a1e1a');disc(23,24,5,'#e0284a');r(22,17,2,3,'#4a8a3a');r(21,22,2,2,'#ff8a9a');r(26,38,3,8,'#2a6ad8');r(26,44,1,2,'#1a4a9a');return C=x}
  if(k==='loja'){r(6,24,36,18,'#c8925a');r(6,24,36,3,'#e0b07a');r(6,32,36,1,'#8a5a30');for(let i=0;i<8;i++)disc(9+i*4.2,22+(i%2),3,i%3?'#e0284a':'#f7c948');r(30,8,14,10,'#f4ecdc');r(36,4,1,4,'#8a6a4a');r(31,10,12,1,'#c8302a')}
  if(k==='personagem'){r(10,37,28,2,'#0005');r(3,30,42,6,'#2a1608');r(4,30,40,5,'#c89a3a');r(6,29,36,2,'#e8c060');r(4,34,40,1,'#8a6020');
    for(let j=0;j<16;j++){const w2=14+j*.45;r(24-w2/2-1,15+j,w2+2,1,'#2a1608')}for(let j=1;j<16;j++){const w2=14+j*.45;r(24-w2/2,15+j,w2,1,j<3?'#f6d880':'#e0b450');r(24+w2/2-3,15+j,3,1,'#b08030')}r(14,25,20,4,'#c8302a');r(14,25,20,1,'#f06050');r(14,28,20,1,'#8a1a18');
    for(let i=0;i<5;i++)r(16+i*3.5,19+(i%2)*3,1,1,'#b08030');for(let i=0;i<9;i++)r(7+i*4,31+(i%2),2,1,'#b08030');return C=x}
  if(k==='missoes'){r(10,8,28,32,'#e8d8b0');r(8,6,32,4,'#c8a878');r(8,38,32,4,'#c8a878');for(let j=14;j<34;j+=7){r(13,j,4,4,'#5fae4a');r(19,j+1,14,2,'#a88a5a')}}
  if(k==='conquistas'){r(16,30,6,14,'#e0284a');r(26,30,6,14,'#2a5bd7');disc(24,22,11,'#c9921a');disc(24,22,9,'#f7c948');r(22,15,4,14,'#fff6c0')}
  if(k==='intro'){r(22,22,4,22,'#3a1a08');r(23,22,2,22,'#8a5228');r(7,7,34,19,'#3a1a08');r(8,8,32,17,'#c8884a');r(8,8,32,2,'#e8b070');r(8,23,32,2,'#8a5228');
    [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,1,0,0]].forEach((row,j)=>row.forEach((v,i)=>v&&r(19+i*2,10+j*2,2,2,'#1e4aa8')));r(15,43,18,2,'#4faa4a');r(17,41,2,2,'#4faa4a');r(29,41,2,2,'#4faa4a');return C=x}
  if(k==='config'){const cog=(cx,cy,R,n,c1,c2,c3)=>{for(let i=0;i<n;i++){const a=i/n*Math.PI*2;r(cx+Math.cos(a)*R-2,cy+Math.sin(a)*R-2,4,4,c1)}disc(cx,cy,R-1,c1);disc(cx,cy,R-2,c2);disc(cx-1,cy-1,R-4,c3);disc(cx,cy,R/3,'#2a1a1a')};
    cog(20,21,13,10,'#3a4050','#8a94a8','#c8d0e0');cog(34,34,8,8,'#6a3a08','#c88a1a','#f7c948');return C=x}
  if(k==='pacotes'){C.save();C.translate(9,0);C.scale(.75,.75);packDraw('bencao',false);C.restore();return C=x}
  C=x}
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
// a floating island for the map, painted like the ones in the battles: grass on top, a wedge of earth with stones
const WISLE={};
function paintIsle(w,top,seed){const W2=Math.ceil(w)+6,dep=w*.42,cap=w/7|0,c=mkHD(W2,cap+dep+6,1),B=layerBuf(c,'#000000',0,1,0),{d,k}=B,cx=W2/2,ty=cap+2;
  const G=[top[0],top[1],top[2],shade(top[2],.3)].map(u32),E=['#2a1c22','#4a3030','#6a4636','#8a5e44','#a8805c'].map(u32),S2=['#3a3a44','#6a6a78','#9a9aa8'].map(u32);
  for(let X=0;X<B.w;X++){const u=X+.5,q=(u-cx)/(w/2);if(Math.abs(q)>=1)continue;const t=ty-cap*Math.sqrt(1-q*q)*.9-vn(u*.4,seed)*1.5,dp=dep*Math.pow(1-q*q,.65)*(.8+.3*vn(u*.2,seed+1));
    for(let Y=Math.max(0,Math.floor(t));Y<Math.min(B.h,ty+dp);Y++){const v=Y+.5,dd=v-ty;let col;
      if(dd<2)col=rp(G,.95-(v-t)/(ty+2-t)*.6-q*.12,X,Y,2.2);else{let sh=.62-q*.3-(dd/dp)*.4+(fbm(u*.25,v*.25,seed)-.5)*.3;if(((dd+vn(u*.1,seed)*4)%7)<1)sh-=.2;if(ty+dp-v<1)sh=0;col=rp(E,sh,X,Y,2.2)}
      d[Y*B.w+X]=col}}
  for(let i=0;i<5;i++){const sx=cx-w*.3+hs(i,seed)*w*.6,sy=ty+4+hs(i,seed+3)*dep*.4,rr=1.5+hs(i,seed+5)*1.5;disk(B,sx,sy,rr,(X,Y,nx,ny)=>rp(S2,light(nx,ny),X,Y))}
  putBuf(B);return c}
function islandAt(I,top,open,landmark){
  const{x:cx,y:cy,w}=I,key=I.id||cx;WISLE[key]=WISLE[key]||paintIsle(w,top,cx);const c=WISLE[key];
  C.drawImage(c,Math.round(cx-c.width/2),Math.round(cy-w/7-2));
  for(let i=0;i<5;i++){const rx=cx-w/3+hs(i,cx)*w*.66,L=5+hs(i,3)*9,base=cy+w*.4*Math.pow(1-Math.abs(rx-cx)/(w/2),.7)-2;for(let j=0;j<L;j++)r(rx+Math.sin(j*.5+wt*1.5+i)*1,base+j,1,1,j%3?'#2f7a3a':'#5fae4a')}
  landmark&&landmark(cx,cy-4);
  if(!open){C.globalAlpha=.55;blob(cx,cy-6,w/2+2,w/5|0,'#8a8a9a','#a0a0b0','#c0c0d0',cx+1);C.globalAlpha=1;r(cx-4,cy-16,8,7,'#c9a24a');r(cx-3,cy-20,6,4,'#c9a24a');r(cx-2,cy-19,4,3,'#2a1e3a');r(cx-1,cy-13,2,3,'#2a1e3a')}
}
const LANDMARK={
  eden(cx,cy){r(cx-2,cy-24,5,24,'#7a4a2e');blob(cx,cy-30,20,12,'#2a7a3a','#5fc060','#b0f090',9);for(let i=0;i<6;i++)r(cx-14+hs(i,2)*28,cy-38+hs(i,3)*14,2,2,'#ffe36a');palm(cx+30,cy+2,'#3a6a3a')},
  jerico(cx,cy){r(cx-34,cy-14,68,14,'#b88a5a');for(let i=0;i<68;i+=6)r(cx-34+i,cy-17,3,3,'#b88a5a');r(cx-8,cy-28,16,28,'#a07848');for(let i=0;i<16;i+=5)r(cx-8+i,cy-31,3,3,'#a07848');r(cx-3,cy-10,6,10,'#3a2010');r(cx+20,cy-12,2,4,'#e0284a')},
  mar(cx,cy){r(cx-34,cy-4,68,6,'#2a6aa8');const o=Math.sin(wt*2)*2;r(cx-34,cy-16+o,12,14,'#4a9ad8');r(cx+22,cy-16-o,12,14,'#4a9ad8');r(cx-22,cy-2,44,3,'#e8c890');for(let i=0;i<5;i++)r(cx-30+i*14+((wt*8)%6),cy-4,3,1,'#d8f0ff');
    for(let j=0;j<40;j++)r(cx+40+Math.sin(j*.3+wt*6)*1,cy+j,2,1,j%3?'#7ac0f0':'#d8f0ff')},
  sinai(cx,cy){for(let j=0;j<44;j++){const hw=j*1.1,sp=Math.sin(j*.7)*2;r(cx-hw,cy-44+j,hw+sp,1,'#c0703e');r(cx+sp,cy-44+j,hw-sp,1,'#8a3e2a');if(j%9===4)r(cx-hw*.6,cy-44+j,hw*.4,1,'#e0904e')}blob(cx,cy-46,18,5,'#3a3260','#4a4278','#5a5288',4);if((wt*1.3%3)<.15){r(cx+4,cy-42,1,8,'#fffbe0');r(cx+5,cy-34,1,6,'#fffbe0')}},
  babel(cx,cy){for(let k=0;k<6;k++){const x0=cx-30+k*5,w2=60-k*10,y0=cy-6-k*8;r(x0,y0,w2,8,'#a8704a');r(x0,y0,w2,1,'#d8a070');r(x0+w2-4,y0+1,4,7,'#7a4a32');for(let i=x0+3;i<x0+w2-5;i+=6)r(i,y0+3,2,3,'#5a3424')}r(cx-3,cy-54,6,48,'#c98a5a');r(cx-3,cy-54,2,48,'#e0a878');r(cx-2,cy-60,1,6,'#6a4a2a');r(cx+2,cy-60,1,6,'#6a4a2a');r(cx-3,cy-58,6,1,'#6a4a2a')},
  getsemani(cx,cy){oliveTree(cx-20,cy-22,'#0e2a24');oliveTree(cx+18,cy-18,'#123a30');blob(cx+30,cy-46,8,8,'#f8f0d8','#f8f0d8','#ffffff',3);blob(cx-2,cy-2,6,3,'#5a5a70','#7a7a90','#9a9ab0',5)},
  jardim(cx,cy){const lv=META.garden.tree.planted?META.garden.tree.lvl:0;if(lv>0){const s=6+lv*1.6;r(cx-1,cy-s*1.6,3,s*1.6,'#7a4a2e');blob(cx,cy-s*1.8,s|0,(s*.6)|0,'#2a7a3a','#5fc060','#b0f090',33)}else{r(cx-1,cy-8,2,8,'#8a5a2a');r(cx-5,cy-12,10,5,'#c9a060')}
    for(let i=0;i<5;i++){r(cx-24+i*10,cy-6,1,6,'#5fe08a');r(cx-25+i*10,cy-8,3,2,['#e0284a','#9b4be0','#f7c948','#ff8ac0','#ffffff'][i])}}
};
let wt=0,WMAP=null;
function drawWorldMap(){
  const cvs=$('wmapc');if(!cvs){clearInterval(wmapTimer);wmapTimer=null;return}
  wt+=.05;const g=cvs.getContext('2d');C=g;
  // the painted sky and clouds of the battles, made once
  if(!WMAP){const bg=mkHD(480,300,1),B=layerBuf(bg,'#d8f0e8',0,1);pSky(B,{sky:SKIES.day,hor:330,sun:{...SUNS.day,x:420,y:40,r:14}});putBuf(B);
    WMAP={bg,cl:[0,1,2].map(i=>{const c=mkHD(110,44,1),B2=layerBuf(c,'#fff',0,1);pCloud(B2,55,24,56+i*14,16+i*4,i*5+2,CLOUDS.day);putBuf(B2);return c})}}
  g.drawImage(WMAP.bg,0,0);
  for(let i=0;i<7;i++){const cx=((hs(i,1)*620+wt*(4+i))%660)-110,cy=hs(i,2)*120-6;g.drawImage(WMAP.cl[i%3],Math.round(cx),Math.round(cy))}
  // stone bridges between consecutive islands
  for(let i=0;i<WORLDS.length-1;i++){const a=WORLDS[i],b=WORLDS[i+1],open=levelOpen(i*4+4);const n=Math.hypot(b.x-a.x,b.y-a.y)/4|0;
    for(let k=0;k<=n;k++){const u=k/n,px=a.x+(b.x-a.x)*u,py=a.y+(b.y-a.y)*u+Math.sin(u*Math.PI)*10;if(k%2)r(px-1,py,3,2,open?'#c9a060':'#8a8a9a')}}
  WORLDS.forEach((w,i)=>islandAt(w,w.top,levelOpen(i*4),LANDMARK[w.id]));
  if(selWorld!=null){const w=WORLDS[selWorld];C.globalAlpha=.5+Math.sin(wt*4)*.3;ring(w.x,w.y-10,w.w/2+6,'#ffe36a');C.globalAlpha=1}
  drawWalker(g);C=g;
  for(let i=0;i<8;i++){const cx=((hs(i,7)*660-wt*(6+i))%660+660)%660-110;g.drawImage(WMAP.cl[i%3],Math.round(cx),262+Math.round(hs(i,8)*10))}
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
        <b>${l.id}</b><small>${l.night?'Noite':'Dia'}${l.boss?' · '+EN[l.boss].name:''}${l.rule?' · '+RULES[l.rule].name:''}${l.goal?' · '+GOALS[l.goal].name:''}</small><span class="stars">${done?starStr(starsOf(l.id)):''}</span><small class="rw">${done?'vencida':open?(unl&&!META.unlocked.includes(unl)?'Nova carta: '+CARDS[unl].name:'Moedas'):'bloqueada'}</small></button>`}).join('')}</div></div></div>`);
  paintCoins();
  $('menu').querySelectorAll('canvas[data-sky]').forEach(c=>{const g=c.getContext('2d');C=g;if(c.dataset.sky==='1'){disc(8,8,6,'#f8f0d8');disc(10,6,5,'#2a3060')}else{disc(8,8,5,'#ffd34a');for(let i=0;i<8;i++){const a=i/8*Math.PI*2;r(8+Math.cos(a)*7,8+Math.sin(a)*7,1,1,'#ffd34a')}}C=x});
  $('menu').querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{sfx('card');showWorld(+b.dataset.w)});
  $('menu').querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{initAudio();startLevel(+b.dataset.l)});
  const bossDone=META.done[LEVELS[selWorld*4+3].id],best=(META.endless||{})[selWorld]||0;
  $('menu').querySelector('.lvpanel').insertAdjacentHTML('beforeend',`<div class="row" style="justify-content:flex-start"><button class="btn ${bossDone?'':'ghost'}" id="endless" ${bossDone?'':'disabled'}>Modo infinito${bossDone?' · recorde '+best+' ondas':' · vença o chefe deste mundo'}</button></div>`);
  $('endless').onclick=()=>{initAudio();startEndless(selWorld)};
  clearInterval(wmapTimer);drawWorldMap();wmapTimer=setInterval(drawWorldMap,60);
}

// ---------- playing a level
function advColl(){const c=[];const cc=CHARS[META.char].card;if(cc)c.push(mk(cc));META.unlocked.forEach(k=>{c.push(mk(k,(META.foil||{})[k]?{rare:true}:{}));if(CARDS[k].type==='semente')c.push(mk(k))});return c}
// the bag grows with the adventure: 3 to 5 cards on the first level, up to 8 to 10 later
const levelBag=n=>{const mn=Math.min(8,3+Math.floor(n/3));return[mn,Math.min(RUN?deckMax():10,mn+2)]};
function startLevel(n){
  const L=LEVELS[n],w=WORLDS[L.wi];UID=1;
  RUN={mode:'level',level:n,char:META.char,asc:0,daily:false,seed:0,act:w.act,row:0,rows:[],path:[],hp:20,maxhp:20,siclos:0,coll:advColl(),deck:[],relics:[],handSize:4,esau:-1,samaritano:0,seenEv:[],stats:{kills:0,bosses:0},podas:0};
  const prev=META.lastDeck&&META.lastDeck.length?META.lastDeck:null;
  RUN.deck=prev?RUN.coll.filter((c,i,a)=>prev.includes(c.k)&&a.findIndex(o=>o.k===c.k)===i).concat(RUN.coll.filter((c,i,a)=>prev.includes(c.k)&&a.findIndex(o=>o.k===c.k)!==i)).slice(0,levelBag(n)[1]):RUN.coll.slice(0,levelBag(n)[1]);
  showDeck();
}
function levelNode(){
  if(RUN.mini)return miniNode();
  if(RUN.endless)return endlessNode();
  const L=LEVELS[RUN.level],w=WORLDS[L.wi];seedRng(9001+L.n*977);
  const nW=L.l===0?2:3,waves=[];
  for(let i=0;i<nW;i++)waves.push(genWave(w.act,i+L.l,'batalha',0,levelPool(L.n)));
  if(L.boss){waves[waves.length-1].list.unshift([L.boss,2.5]);waves[waves.length-1].name=EN[L.boss].name}
  RNG=Math.random;
  return{type:L.boss?'chefe':'batalha',map:w.arena&&L.boss?w.arena:w.map,waves,night:L.night,level:L.id};
}
function startLevelBattle(){META.lastDeck=RUN.deck.map(c=>c.k);saveMeta();const L=LEVELS[RUN.level],rule=RUN.mini?null:L.rule;if(rule==='poucas')RUN.handSize=3;RUN.handSize=Math.min(RUN.handSize,RUN.deck.length);hideMenu();clearInterval(wmapTimer);const node=levelNode();startBattle(node);
  if(rule==='sempisao')S.noSlam=true;if(rule==='trevas')S.trevas=true;if(rule)banner('Regra da fase',RULES[rule].name+': '+RULES[rule].desc);goalStart();miniStart()}
function levelWon(){
  if(RUN.mini)return miniOver(true);
  const L=LEVELS[RUN.level],first=!META.done[L.id],treeBonus=1+(META.garden.tree.lvl||0)*.05;
  const reward=Math.round((first?60+L.n*20:30+L.n*5)*treeBonus),picked=Math.round(S.coins*treeBonus);
  META.coins+=reward+picked;META.done[L.id]=1;const stars=RUN.hp>=18?3:RUN.hp>=10?2:1;META.stars=META.stars||{};const newBest=stars>(META.stars[L.id]||0);META.stars[L.id]=Math.max(stars,META.stars[L.id]||0);
  let card=null;const unl=UNLOCK_ORDER[L.n];if(first&&unl&&!META.unlocked.includes(unl)){META.unlocked.push(unl);card=mk(unl)}if(first&&L.boss)META.gifts=(META.gifts||0)+1;
  saveMeta();MUS.mode='calm';mission('win',1);if(stars===3)mission('star3',1);
  // every win leaves a seedling of a tree you know in the greenhouse
  const known=META.unlocked.filter(k=>CARDS[k].type==='semente'),sprout=known.length?known[(Math.random()*known.length)|0]:null;if(sprout){const sk='t:'+sprout;META.garden.seeds[sk]=(META.garden.seeds[sk]||0)+1;saveMeta()}
  const news=unlocksAfter(L.n).filter(([k])=>first&&(k==='bag'||k==='pest'||k==='sys'||k==='shop'||(k==='mode'&&L.l===3))).map(([,t])=>'Liberado · '+t);if(sprout&&gardenOpen())news.push('Uma muda de '+CARDS[sprout].name+' foi para a estufa do jardim.');if(first&&L.boss)news.push('Presente: um Pacote da Bênção na Tenda das Cartas');if(L.id==='1-4')news.push('O Jardim foi liberado! Plante, regue e venda. Junte moedas para a semente da Árvore da Vida.');
  if(L.id==='2-4')news.push('O modo Jornada foi liberado no menu.');
  const last=RUN.level===LEVELS.length-1,total=reward+picked;
  endScreen({win:true,eyebrow:`${WORLDS[L.wi].name} · ${L.id} · ${L.night?'Noite':'Dia'}`,title:'Vitória!',stars,
    hint:stars<3?'3 estrelas: termine com 18 de Vida ou mais.':newBest&&!first?'Perfeito! Novo recorde!':'Perfeito!',
    coins:total,coinNote:`${reward} da fase + ${picked} recolhidas${treeBonus>1?' · Árvore da Vida +'+Math.round((treeBonus-1)*100)+'%':''}`,card,news,
    buttons:`<button class="btn ghost" id="tomap">Mapa</button>${last?`<button class="btn" id="fim">Ir ao último jardim</button>`:`<button class="btn" id="next">Próxima fase ›</button>`}`});
  $('tomap').onclick=()=>showWorld();
  if($('next'))$('next').onclick=()=>{const n=RUN.level+1;selWorld=LEVELS[n].wi;startLevel(n)};
  if($('fim'))$('fim').onclick=()=>startEpilogue();
}
function levelLost(){
  if(RUN.mini)return miniOver(false);
  if(RUN.endless)return endlessOver();
  const picked=Math.round(S.coins*.5);META.coins+=picked;saveMeta();MUS.mode='calm';
  const worst=Object.entries(S.leaks||{}).sort((a,b)=>b[1]-a[1])[0],w=worst&&EN[worst[0]];
  endScreen({win:false,eyebrow:LEVELS[RUN.level].id,title:'O jardim secou',stars:0,coins:picked,coinNote:'metade das moedas recolhidas',
    hint:w?`${w.name} passou mais vezes.${w.weak?' Dica: '+CARDS[w.weak].name+' vence '+w.name+'.':''}`:'Tente outras sementes, ou passe na loja.',
    buttons:`<button class="btn ghost" id="tomap">Mapa</button><button class="btn ghost" id="toshop">Loja</button><button class="btn" id="again">Tentar de novo</button>`});
  $('tomap').onclick=()=>showWorld();$('toshop').onclick=()=>showShop2('ferramentas');$('again').onclick=()=>startLevel(RUN.level);
}
// ---------- end of level: stars light one by one, coins count up, a new card flips over. A click skips the show.
function starPx(cvs,on){const g=hdCtx(cvs,15,15);C=g;
  const rows=['.......#.......','......###......','......###......','.....#####.....','###############','.#############.','..###########..','...#########...','...#########...','..####...####..','..###.....###..','.##.........##.'];
  rows.forEach((row,y)=>{for(let i=0;i<15;i++)if(row[i]==='#')r(i,y+1,1,1,on?(y<4||i<5?'#fff3a0':y>8?'#c98a10':'#f7c948'):'#4a3020')});
  if(on){r(6,3,1,2,'#ffffff');r(3,5,2,1,'#ffffff')}C=x}
function endScreen(o){
  ['story','tut','foeintro'].forEach(id=>$(id).hidden=true);playJingle(o.win?'vitoria':'derrota');
  const st=S,secs=st.t|0,stat=(l,v)=>`<div class="stat"><b>${l}</b><span>${v}</span></div>`;
  menu(`<div class="mbox endscr ${o.win?'won':'lost'}"><small class="eyebrow">${o.eyebrow}</small><h2>${o.title}</h2>
    ${o.win?`<div class="vstars">${[0,1,2].map(i=>`<canvas width="60" height="60" data-vs="${i}"></canvas>`).join('')}</div>`:`<div class="wilt"><canvas width="60" height="60" id="wiltc"></canvas></div>`}
    <p class="help">${o.hint}</p>
    <div class="sheet vstats">${stat('Pragas vencidas',st.kills||0)}${stat('Maior combo','x'+(st.maxCombo||0))}${stat('Vida do jardim',Math.max(0,RUN.hp)+' / '+RUN.maxhp)}${stat('Árvores plantadas',st.tw.filter(Boolean).length)}${stat('Tempo',(secs/60|0)+':'+String(secs%60).padStart(2,'0'))}</div>
    <div class="vcoins"><canvas width="12" height="12" class="coin"></canvas><b id="vcoin">+0</b><small>${o.coinNote}</small></div>
    ${o.card?`<div class="vcard"><h3>Nova carta!</h3><div class="flip" id="vflip"><div class="fb"><canvas width="${CARD_W*CK}" height="${CARD_H*CK}" id="vback"></canvas></div><div class="ff">${cardHTML(o.card)}</div></div></div>`:''}
    ${(o.news||[]).map(t=>`<p class="epi late">${t}</p>`).join('')}
    <div class="row late">${o.buttons}</div></div>`,o.card?[o.card]:[]);
  paintCoins();if(o.card)$('vback').getContext('2d').drawImage(cardBack(),0,0);
  const box=$('menu').querySelector('.endscr'),T=[],at=(ms,fn)=>T.push(setTimeout(()=>{if(box.isConnected)fn()},ms));
  $('menu').querySelectorAll('canvas[data-vs]').forEach(c=>starPx(c,false));
  if(!o.win){const g=hdCtx($('wiltc'),30,30);C=g;r(14,12,3,16,'#6a4a2e');r(9,26,13,2,'#4a3020');blob(15,10,9,6,'#5a4a20','#7a6a30','#9a8a40',3);r(6,14,2,3,'#7a6a30');r(23,15,2,4,'#7a6a30');C=x;sfx('no')}
  const show=k=>{const c=box.querySelector(`[data-vs="${k}"]`);if(!c)return;starPx(c,true);c.classList.add('lit');sfx('ach');
    const rc=c.getBoundingClientRect(),sr=$('stage').getBoundingClientRect(),wx=(rc.left+rc.width/2-sr.left)/sr.width*W+S.cam,wy=(rc.top+rc.height/2-sr.top)/sr.height*H-VY;
    burst(wx,wy,22,['#ffe36a','#fff6c0','#ff9a3c'],120,60,.8,1)};
  let k=0,n=0;const steps=Math.min(30,o.coins),count=()=>{n++;$('vcoin').textContent='+'+Math.round(o.coins*n/steps);if(n%3===0)sfx('coin');if(n<steps)at(28,count)};
  for(let i=0;i<(o.stars||0);i++)at(450+i*450,()=>show(i));
  const tCoins=500+(o.stars||0)*450;if(o.coins>0)at(tCoins,count);else $('vcoin').textContent='+0';
  const tCard=tCoins+steps*28+300;if(o.card)at(tCard,()=>{$('vflip').classList.add('on');sfx('super')});
  at(o.card?tCard+600:tCoins+steps*28+150,()=>box.classList.add('done'));
  if(o.win)for(let i=0;i<40;i++)S.parts.push({x:S.cam+rnd(0,W),y:rnd(-30,-4),vx:rnd(-20,20),vy:rnd(20,50),g:20,life:5,max:5,c:pick(['#ffe36a','#ff8ab0','#9ff7b8','#7ac0ff','#ffffff']),s:1,sway:1});
  // click anywhere on the panel to skip to the end
  box.addEventListener('pointerdown',ev=>{if(box.classList.contains('done')||ev.target.closest('button'))return;T.forEach(clearTimeout);
    for(let i=0;i<(o.stars||0);i++){const c=box.querySelector(`[data-vs="${i}"]`);starPx(c,true);c.classList.add('lit')}
    $('vcoin').textContent='+'+o.coins;if(o.card)$('vflip').classList.add('on');box.classList.add('done')});
}

// ---------- the gardener: character and tool
// five pip rows per farmer; big adds what each attribute gives right now
function attrRows(k,big){const a=CHAR_AT[k]||CHAR_AT.lavrador;
  return`<div class="cattr${big?' big':''}">${ATTRS.map(([s,l,c],i)=>`<span>${l}</span><i style="--c:${c}">${[1,2,3,4,5].map(n=>`<u class="${n<=a[i]?'on':''}"></u>`).join('')}</i>${big?`<em>${attrVal(k,s)}</em>`:''}`).join('')}</div>`}
function attrVal(k,s){const d=atr(s,k),u=META.upg,pc=x=>Math.round(x*100)+'%';
  if(s==='vida')return (3+d+u.hearts+u.treeHearts+tl('hearts'))+' na batalha';
  if(s==='vel')return pc(1+.08*d);
  if(s==='for')return 'dano '+pc(1+.15*d);
  if(s==='mana')return 'começa com '+(6+d+2*(u.mana||0)+tl('mana'));
  return ABIL[k][0]+' · '+Math.round(abilCD(k))+'s'}
// the farmer screen: the chosen farmer on a lit pedestal with power and card, attributes and gear beside,
// then round tokens to switch farmer and tool
function showLavrador(){
  const render=()=>{const k0=META.char,ch=CHARS[k0],A=ABIL[k0]||ABIL.lavrador,w=WEAPONS[META.weapon],doneN=Object.keys(META.done).length,stars=Object.values(META.stars||{}).reduce((a,b)=>a+b,0);
    const slot=(cv,name,sub,empty)=>`<div class="slotbox ${empty?'empty':''}">${cv}<b>${name}</b><small>${sub}</small></div>`;
    menu(`<div class="mbox wide modern hero"><div class="topbar"><button class="btn ghost" data-go="hub">‹ Menu</button><h2>O lavrador</h2>${coinsTag()}</div>
    <div class="herogrid">
      <div class="heroshow"><div class="hstage"><canvas width="32" height="40" data-char="${k0}"></canvas></div>
        <div class="hname"><h3>${ch.name}</h3><i>${ch.ref}</i></div><p>${ch.desc}</p>
        <div class="hchips"><span class="hc-abil"><b>Poder · C</b>${A[0]}: ${A[1]}</span>${ch.card?`<span class="hc-card"><b>Carta</b>${CARDS[ch.card].name}</span>`:''}</div></div>
      <div class="herostats"><h4>Atributos</h4>${attrRows(k0,1)}
        <div class="hprog"><span>Fases <b>${doneN}/${LEVELS.length}</b></span><span>Estrelas <b>${stars}/${LEVELS.length*3}</b></span></div>
        <h4>Equipamento</h4><div class="slots">${slot(`<canvas width="32" height="32" data-tool="${META.weapon}"></canvas>`,w.name,'Golpe X · dano '+w.dmg)}
        ${Object.entries(ITEMS).map(([k,it])=>slot(`<canvas width="32" height="32" data-bar="${k}"></canvas>`,it.name,'×'+(META.items[k]||0)+' · tecla '+it.key,!META.items[k])).join('')}</div></div>
    </div>
    <div class="sec"><h3>Personagem</h3><div class="htokens">${Object.entries(CHARS).map(([k,c],i)=>{const ok=META.chars[k];return`<button type="button" class="htok ${k0===k?'on':''} ${ok?'':'locked'}" data-ch="${k}" ${ok?'':'disabled'} style="--n:${i}" title="${ok?c.desc:'Como liberar: '+c.hint}">
      <canvas width="32" height="40" data-char="${k}"></canvas><b>${c.name}</b><small>${ok?(ABIL[k]||ABIL.lavrador)[0]:'bloqueado'}</small></button>`}).join('')}</div></div>
    <div class="sec"><h3>Ferramenta · X</h3><div class="htokens tools">${Object.entries(WEAPONS).map(([k,t],i)=>{const own=META.weapons[k];return`<button type="button" class="htok ${META.weapon===k?'on':''} ${own?'':'locked'}" data-wp="${k}" ${own?'':'disabled'} style="--n:${i}" title="${t.desc}">
      <canvas width="32" height="32" data-tool="${k}"></canvas><b>${t.name}</b><small>${own?'dano '+t.dmg+' · alcance '+t.rng:'na Quitanda'}</small></button>`}).join('')}</div></div>
    ${talentsHTML()}
    <p class="help">Encostar nas pragas tira um coração. Sem corações, você desmaia por 3s e perde maná.</p></div>`);
    paintCoins();
    $('menu').querySelectorAll('canvas[data-char]').forEach(c=>charIconTo(c,c.dataset.char));
    $('menu').querySelectorAll('canvas[data-tool]').forEach(c=>toolIconTo(c,c.dataset.tool));
    $('menu').querySelectorAll('canvas[data-bar]').forEach(c=>barrierIconTo(c,c.dataset.bar));
    $('menu').querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{META.char=b.dataset.ch;saveMeta();sfx('card');render()});
    $('menu').querySelectorAll('[data-wp]').forEach(b=>b.onclick=()=>{META.weapon=b.dataset.wp;saveMeta();sfx('card');render()});bindTalents(render)};render();
}

// ---------- shop
const UPGRADES={hearts:{name:'Coração extra',prices:[200,500,1000],desc:'+1 coração em toda batalha.'},bag:{name:'Bolsa maior',prices:[300,800],desc:'+1 carta na bolsa.'},mana:{name:'Maná inicial',prices:[250,600],desc:'+2 de maná no começo das batalhas.'}};
const GPLANTS={trigo:{name:'Trigo',price:20,stage:40,sell:50,col:'#e8c86a'},uva:{name:'Uva',price:50,stage:90,sell:130,col:'#9b4be0'},roma:{name:'Romã',price:120,stage:180,sell:320,col:'#e0284a'},oliva:{name:'Oliva',price:300,stage:360,sell:850,col:'#b8cf9a'}};
// the nine fruit trees as greenhouse plants: they grow, then ask for care and drop coins while happy
[...SEED_KEYS,'mostarda'].forEach((k,i)=>GPLANTS['t:'+k]={name:CARDS[k].name,price:90+i*25,stage:120+i*20,sell:160,col:FRUIT_COL[FRUIT[k]],tree:k});
const TREE_SEED_PRICE=2000;
// ---------- the shop is Boaz's market stall: shelves of goods, price tags, pages like a catalogue
function shopItems(tab){let items=[];
  if(tab==='cartas')items=META.unlocked.filter(k=>CARDS[k].type==='semente').map(k=>{const lv=cardLv(k);return{id:'c:'+k,icon:['card',k],name:CARDS[k].name+' nv '+(lv+1)+'/4',desc:'Cada nível dá +15% de dano a esta árvore.',price:CARD_LV_PRICE[lv],owned:lv>=3}});
  if(tab==='ferramentas')items=Object.entries(WEAPONS).filter(([k])=>k!=='enxada').map(([k,w])=>({id:'w:'+k,icon:['tool',k],name:w.name,desc:w.desc,price:w.price,owned:!!META.weapons[k]}));
  if(tab==='barreiras')items=Object.entries(ITEMS).map(([k,it])=>({id:'i:'+k,icon:['bar',k],name:it.name+' ×'+it.qty,desc:it.desc+' Tecla '+it.key+'. Você tem '+(META.items[k]||0)+'.',price:it.price}));
  if(tab==='melhorias')items=Object.entries(UPGRADES).map(([k,u])=>{const lv=META.upg[k]||0;return{id:'u:'+k,icon:['shop',k],name:u.name+' '+lv+'/'+u.prices.length,desc:u.desc,price:u.prices[lv],owned:lv>=u.prices.length}});
  if(tab==='jardim'){items=Object.entries(GPLANTS).map(([k,p])=>({id:'s:'+k,icon:['shop','seed:'+k],name:(p.tree?'Muda de ':'Semente de ')+p.name,desc:(p.tree?'Cresce na estufa e, adulta, solta moedas.':'Vende por '+p.sell+' moedas quando madura.')+' Você tem '+(META.garden.seeds[k]||0)+'.',price:p.price}));
    items.push({id:'g:vaso',icon:['shop','vaso'],name:'Vaso '+META.garden.potsN+'/32',desc:'Mais um lugar na estufa.',price:150+META.garden.potsN*40,owned:META.garden.potsN>=32},
      {id:'g:adubo',icon:['shop','adubo'],name:'Adubo',desc:'Faz uma planta crescer um estágio. Você tem '+META.garden.adubo+'.',price:100},{id:'g:spray',icon:['shop','spray'],name:'Spray ×3',desc:'Tira a praguinha de uma árvore. Você tem '+(META.garden.spray||0)+'.',price:60},{id:'g:mel',icon:['shop','mel'],name:'Mel',desc:'Uma árvore adulta dança e solta moedas por 20s. Você tem '+(META.garden.mel||0)+'.',price:150})}
  if(tab==='arvore'){items=[{id:'g:arvore',icon:['shop','arvore'],name:'Árvore da Vida',desc:'Abre um lugar só para ela no menu. “No meio da praça... estava a árvore da vida.” (Apocalipse 22:2)',price:TREE_SEED_PRICE,owned:treeOwned(),rare:1}];
    if(treeOwned())items.push({id:'g:fertil',icon:['shop','fertil'],name:'Fertilizante',desc:'+70 de crescimento para a Árvore da Vida. Você tem '+META.garden.fertil+'.',price:400})}
  return items.map(it=>({...it,tab}))}
function buyItem(id){const[t,k]=id.split(':');let price=0;
  if(t==='w')price=WEAPONS[k].price;if(t==='i')price=ITEMS[k].price;if(t==='u')price=UPGRADES[k].prices[META.upg[k]||0];if(t==='c')price=CARD_LV_PRICE[cardLv(k)];if(t==='p')price=PACKS[k].price;if(t==='s')price=GPLANTS[k].price;
  if(t==='g')price={vaso:150+META.garden.potsN*40,adubo:100,spray:60,mel:150,fertil:400,arvore:TREE_SEED_PRICE}[k];
  if(!price||META.coins<price)return false;META.coins-=price;
  if(t==='w'){META.weapons[k]=1;META.weapon=k}if(t==='i')META.items[k]=(META.items[k]||0)+ITEMS[k].qty;if(t==='u')META.upg[k]=(META.upg[k]||0)+1;
  if(t==='c'){META.cardLv=META.cardLv||{};META.cardLv[k]=cardLv(k)+1}if(t==='s')META.garden.seeds[k]=(META.garden.seeds[k]||0)+1;
  if(t==='g'){const G=META.garden;if(k==='vaso'){G.potsN++;G.pots.push(null)}if(k==='adubo')G.adubo++;if(k==='spray')G.spray=(G.spray||0)+3;if(k==='mel')G.mel=(G.mel||0)+1;if(k==='fertil')G.fertil++;
    if(k==='arvore'){G.treeSeed=1;toast('A Árvore da Vida apareceu no menu','Gênesis 2:9')}}
  saveMeta();sfx('coin');return true}
const BOAZ=['Bem-vindo à minha quitanda!','Tudo fresquinho, colhido hoje.','Rute respigou nos meus campos, sabia? (Rute 2)','Balança fiel, preço justo. (Provérbios 11:1)','Quem semeia com fartura, com fartura colhe. (2 Coríntios 9:6)','Leve um vaso a mais, a estufa agradece.'];
let shopPage=0;
function showShop2(tab){
  const order=['ferramentas','cartas','barreiras','jardim','melhorias','arvore'].filter(shopOpen),pages=[];
  order.forEach(tb=>{const it=shopItems(tb);for(let i=0;i<Math.max(1,it.length);i+=8)pages.push({tab:tb,items:it.slice(i,i+8)})});
  if(tab){const f=pages.findIndex(p=>p.tab===tab);if(f>=0)shopPage=f}shopPage=clamp(shopPage,0,pages.length-1);
  const pg=pages[shopPage],locked=Object.keys(SHOP_AT).filter(k=>!shopOpen(k));
  menu(`<div class="quitanda"><canvas id="qbg" width="960" height="540"></canvas>
    <div class="qsign">Quitanda do Boaz</div>
    <div class="qboaz"><canvas id="qboazc" width="256" height="384"></canvas><div class="qbubble" id="qbub">${pick(BOAZ)}</div></div>
    <div class="qshelf">${pg.items.map(it=>`<button type="button" class="qitem ${it.owned?'owned':''} ${!it.owned&&META.coins<it.price?'poor':''} ${it.rare?'rare':''}" data-buy="${it.id}" ${it.owned?'disabled':''}>
      <canvas width="32" height="32" data-si="${it.icon.join(':')}"></canvas><small>${it.name}</small><span class="tag">${it.owned?'✓ tem':it.price}</span></button>`).join('')||'<p class="qempty">Prateleira vazia por enquanto.</p>'}</div>
    <button type="button" class="qarrow prev" id="qprev" ${shopPage?'':'disabled'}>‹</button><button type="button" class="qarrow next" id="qnext" ${shopPage<pages.length-1?'':'disabled'}>›</button>
    <div class="qfoot"><button class="btn ghost" data-go="hub">‹ Menu</button><span class="qpage">${SHOP_NAME[pg.tab]} · página ${shopPage+1} de ${pages.length}${locked.length?' · mais prateleiras abrem com as fases':''}</span>${coinsTag()}</div></div>`);
  paintCoins();quitandaArt();
  $('menu').querySelectorAll('canvas[data-si]').forEach(c=>{const[t,...k]=c.dataset.si.split(':');const kk=k.join(':');if(t==='tool')toolIconTo(c,kk);else if(t==='bar')barrierIconTo(c,kk);else if(t==='card')treeIconTo(c,kk);else shopIconTo(c,kk)});
  const bub=$('qbub'),all=pg.items;
  $('menu').querySelectorAll('[data-buy]').forEach(b=>{const it=all.find(i=>i.id===b.dataset.buy);
    b.onmouseenter=()=>{bub.innerHTML=`<b>${it.name}</b><br>${it.desc}`};b.onmouseleave=()=>{bub.textContent=pick(BOAZ)};
    b.onclick=()=>{if(buyItem(it.id)){showShop2();$('qbub').innerHTML=pick(['Ótima escolha!','Que Deus abençoe a colheita!','Volte sempre!','Negócio fechado!'])}else{sfx('no');bub.innerHTML='Faltam moedas para '+it.name+'. Vença umas fases e volte!'}}});
  $('qprev').onclick=()=>{shopPage--;sfx('card');showShop2()};$('qnext').onclick=()=>{shopPage++;sfx('card');showShop2()}}
// painted backdrop: sky and fields, the stall with its striped awning, shelves, crates of fruit; and Boaz himself
function quitandaArt(){let g=hdCtx($('qbg'),480,270,2);C=g;
  let gr=g.createLinearGradient(0,0,0,170);gr.addColorStop(0,'#5aa8e8');gr.addColorStop(1,'#cfeefc');g.fillStyle=gr;g.fillRect(0,0,480,270);disc(70,40,12,'#fff6c8');
  for(let i=0;i<5;i++)blob(40+i*110,30+(i%2)*14,22,5,'#dceaf8','#eef6fc','#ffffff',i+2);
  mount(480,150,10,.02,3,'#8ac08a');mount(480,165,6,.04,7,'#6aa86a');r(0,170,480,100,'#5aa84a');for(let i=0;i<300;i++)r(hs(i,8)*480,172+hs(i,9)*98,1,2,'#7ac860');
  for(let i=0;i<480;i+=14){r(i,150,4,26,'#e8d8b0');r(i,150,4,1,'#fff6e0')}r(0,156,480,2,'#c8b890');r(0,166,480,2,'#c8b890');
  // the stall
  r(176,70,292,128,'#8a5a34');for(let j=74;j<196;j+=7)r(176,j,292,1,'#7a4a2a');r(176,70,4,128,'#6a3a20');r(464,70,4,128,'#6a3a20');
  for(const yy of[124,182]){r(184,yy,276,6,'#b8834e');r(184,yy,276,1,'#e0b07a');r(184,yy+6,276,2,'#4a2a14')}
  for(let i=0;i<300;i+=20){r(170+i,40,20,30,(i/20)%2?'#fff0dc':'#d0383a');disc(180+i,70,10,(i/20)%2?'#fff0dc':'#d0383a')}r(170,38,300,3,'#8a2028');
  r(170,198,300,40,'#a06a3a');r(170,198,300,3,'#c8925a');for(let i=180;i<470;i+=24)r(i,202,2,34,'#7a4a24');
  const crate=(cx,cy,c1,c2)=>{r(cx-16,cy-12,32,16,'#c8925a');r(cx-16,cy-12,32,2,'#e0b07a');r(cx-16,cy-4,32,1,'#8a5a30');for(let i=0;i<7;i++)disc(cx-12+i*4,cy-14+(i%2),3,i%2?c1:c2)};
  crate(150,245,'#e0284a','#ff6a6a');crate(120,258,'#f7c948','#ffe08a');crate(458,252,'#5fae4a','#9fe070');crate(30,250,'#9b4be0','#c58cff');
  C=x;
  boazArt()}
// Boaz, drawn by hand at a finer scale: striped headscarf, full beard, robe and mantle, a basket of fruit
function boazArt(){const g=hdCtx($('qboazc'),64,96,4);C=g;OV='#1a0c06';for(const[ox,oy]of[[-1,0],[1,0],[0,-1],[0,1]]){g.translate(ox,oy);drawBoaz();g.translate(-ox,-oy)}OV=null;drawBoaz();C=x}
function drawBoaz(){const sk='#e0a878',skd='#c08058',rb='#5a7a3a',rbd='#3e5a28',rbl='#7a9a50',mt='#8a5a34',mtd='#6a3e22',bd='#7a4a22',bdl='#9a6230';
  r(20,90,10,4,'#5a3a20');r(34,90,10,4,'#5a3a20');r(20,92,10,2,'#3a2414');r(34,92,10,2,'#3a2414');
  r(18,40,28,52,rb);r(18,40,4,52,rbd);r(40,44,3,46,rbl);for(const fx of[26,32,37])r(fx,64,1,26,rbd);r(17,88,30,3,rbd);
  r(12,38,10,46,mt);r(42,38,10,46,mt);r(12,38,3,46,mtd);r(49,40,2,42,'#a8744a');r(12,82,10,3,mtd);r(42,82,10,3,mtd);
  r(18,58,28,4,'#c8a040');r(18,58,28,1,'#f0d070');for(let i=0;i<5;i++)r(36+i*2,62,1,4,'#c8a040');
  r(11,48,8,16,mt);r(45,48,8,16,mt);r(12,62,7,5,sk);r(45,62,7,5,sk);
  // basket of fruit held in front
  r(16,62,32,14,'#c89a5a');for(let j=64;j<76;j+=3)for(let i=17;i<47;i+=4)r(i+((j/3|0)%2)*2,j,2,1,'#a87a3a');r(15,61,34,2,'#a87a3a');
  [[20,'#7b2fbf'],[25,'#e0284a'],[30,'#f7c948'],[35,'#e0284a'],[40,'#5fae4a'],[44,'#7b2fbf']].forEach(([fx,c],k)=>{disc(fx,59-(k%2),3,c);r(fx-1,57-(k%2),1,1,'#ffffff')});
  // head, face, beard
  r(22,16,20,22,sk);r(22,16,3,22,skd);r(38,20,4,14,skd);
  r(25,22,5,2,'#5a3418');r(34,22,5,2,'#5a3418');r(26,25,3,3,'#ffffff');r(35,25,3,3,'#ffffff');r(27,26,2,2,'#2a1a10');r(36,26,2,2,'#2a1a10');r(27,26,1,1,'#ffffff');
  r(31,27,3,5,skd);r(31,31,4,1,'#a86040');r(24,29,3,2,'#f09080');r(37,29,3,2,'#f09080');
  r(21,31,22,14,bd);r(23,44,18,4,bd);r(26,47,12,3,bd);r(24,32,4,10,bdl);r(36,33,3,8,bdl);r(28,33,8,3,'#5a3418');r(29,36,6,2,'#c8505a');r(30,36,4,1,'#ffffff');
  // keffiyeh with red stripes and a dark cord
  r(18,8,28,12,'#efe4cc');for(let i=19;i<46;i+=5)r(i,9,2,10,'#c03a2a');r(16,16,6,26,'#efe4cc');r(42,16,6,26,'#efe4cc');for(let j=18;j<42;j+=5){r(16,j,6,1,'#c03a2a');r(42,j,6,1,'#c03a2a')}
  r(18,14,28,3,'#2a1a10');r(18,14,28,1,'#5a4030');r(20,8,24,1,'#ffffff');
}


// ---------- garden: pots that grow in real time, and the tree of life
const TREE_REWARDS=[null,{coins:150,txt:'150 moedas'},{items:{cerca:4},txt:'4 cercas'},{rare:1,txt:'uma carta consagrada no celeiro'},{heart:1,txt:'+1 coração em toda batalha'},
  {coins:500,txt:'500 moedas'},{items:{espantalho:3,lama:4},txt:'3 espantalhos e 4 poças de lama'},{rare:1,txt:'outra carta consagrada'},{weapon:'arado',txt:'o Arado'},{coins:1500,txt:'1500 moedas'},{final:1,txt:'as folhas para a cura das nações: +50% de moedas'}];
const treeNeed=lv=>100+lv*80;
function potAdvance(p){const P=GPLANTS[p.k],now=Date.now();while(p.watered&&p.stage<3&&now-p.t0>=P.stage*1000){p.t0+=P.stage*1000;p.stage++;p.watered=p.stage<3?false:true}}

// ---------- settings
function showConfig(){let armed=false;
  const render=()=>{menu(`<div class="mbox cabin"><div class="topbar"><button class="btn ghost" data-go="hub">‹ Menu</button><h2>Configurações</h2><span></span></div>
    <div class="cfg"><label>Música <input type="range" id="cmus" min="0" max="1" step="0.05" value="${CFG.mus}" style="--v:${CFG.mus}"></label>
    <label>Efeitos <input type="range" id="csfx" min="0" max="1" step="0.05" value="${CFG.sfx}" style="--v:${CFG.sfx}"></label>
    <label class="chk"><input type="checkbox" id="clite" ${CFG.lite?'checked':''}> Modo leve <small>sem brilho, neblina e distorção; para aparelhos mais fracos</small></label>
    <label class="chk"><input type="checkbox" id="cmute" ${muted?'checked':''}> Silenciar tudo (M)</label>
    <label class="chk"><input type="checkbox" id="cbig" ${CFG.big?'checked':''}> Texto maior <small>aumenta letras dos menus e do painel</small></label>
    <label class="chk"><input type="checkbox" id="cshake" ${CFG.noShake?'':'checked'}> Tremor de tela <small>desligue se a tela tremendo incomoda</small></label></div>
    <div class="sec"><h3>Guardar progresso</h3><p class="help">Salve um arquivo com seu progresso para levar a outro aparelho ou navegador.</p>
    <div class="row" style="justify-content:flex-start"><button class="btn ghost" id="cexp">Salvar arquivo</button><label class="btn ghost">Carregar arquivo<input type="file" id="cimp" accept="application/json,.json" hidden></label></div></div>
    <div class="sec"><h3>Progresso</h3><p class="help">Apaga fases, moedas, jardim, árvore, cartas e conquistas deste navegador.</p>
    <button class="btn ${armed?'act':'ghost'}" id="creset">${armed?'Tem certeza? Clique de novo para apagar tudo':'Reiniciar progresso'}</button></div></div>`);
    $('cmus').oninput=e=>{CFG.mus=+e.target.value;e.target.style.setProperty('--v',e.target.value);saveCfg()};$('csfx').oninput=e=>{CFG.sfx=+e.target.value;e.target.style.setProperty('--v',e.target.value);saveCfg();sfx('coin')};
    $('clite').onchange=e=>{CFG.lite=e.target.checked;saveCfg()};$('cshake').onchange=e=>{CFG.noShake=!e.target.checked;saveCfg()};$('cbig').onchange=e=>{CFG.big=e.target.checked;saveCfg()};$('cexp').onclick=exportSave;$('cimp').onchange=e=>{if(e.target.files[0])importSave(e.target.files[0])};$('cmute').onchange=e=>{initAudio();setMuted(e.target.checked)};
    $('creset').onclick=()=>{if(!armed){armed=true;return render()}['fds-meta','fds-run','jardim-do-fruto-celeiro'].forEach(k=>store.del(k));location.reload()}};render()}
// ---------- show which works of the flesh come, on the seed screen
function wavePreviewHTML(){if(!RUN||RUN.mode!=='level')return'';const node=levelNode(),cnt={};node.waves.forEach(w=>w.list.forEach(([k])=>{if(!EN[k].hide)cnt[k]=(cnt[k]||0)+1}));
  return `<div class="sec"><h3>Vêm nesta fase</h3><div class="foes">${Object.entries(cnt).map(([k,n])=>`<span class="foe" title="${EN[k].desc}${EN[k].weak?' Fraco contra '+CARDS[EN[k].weak].name+'.':''}"><canvas width="48" height="48" data-enemy="${k}"></canvas><b>${EN[k].name}</b><small>×${n}${EN[k].weak?' · '+CARDS[EN[k].weak].name:''}</small></span>`).join('')}</div></div>`}
