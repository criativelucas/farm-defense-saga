// ---------- the Garden: a greenhouse with tables of pots, like a zen garden.
// Crops grow and are sold; the nine fruit trees grow up, ask for things in little bubbles, and drop coins while happy.
const GW=480,GH=300,GROWS=[{y:128,s:.84},{y:174,s:.9},{y:222,s:.95},{y:272,s:1}];
const GSPOTS=(()=>{const a=[];GROWS.forEach(rw=>{for(let i=0;i<8;i++)a.push({x:240+(i-3.5)*52*rw.s,y:rw.y,s:rw.s})});return a})();
const GTOOLS=[['regar','Regador','Mata a sede'],['adubo','Adubo','Faz crescer um estágio'],['spray','Spray','Tira a praguinha'],['harpa','Harpa','Um salmo alegra a árvore'],
  ['mel','Mel','A árvore dança e solta moedas por 20s'],['luva','Luva','Muda um vaso de lugar'],['vender','Vender','Vende a planta']];
const NEEDS=['water','spray','harpa'];
let gTool=null,gHover=-1,gLoop=null,gT=0,gParts=[],gSnail={x:80,d:1},gInfo='',gRain=0,gNextEv=900,gDrops=[],gHeld=-1;
function potPrice(){return 150+META.garden.potsN*40}
const isTree=k=>k&&k.startsWith('t:');
function gPlant(k,stage,t){// drawn at the pot's soil line, local pixels
  if(isTree(k)){const sp=k.slice(2),sz=[.32,.5,.72,.92][stage]*TREE[sp].b*.8;if(stage===0){r(-1,-4,1,4,'#5fe08a');r(0,-6,1,6,'#5fe08a');r(1,-3,1,3,'#8ae07a');return}
    sp==='mostarda'?drawMostarda(0,0,Math.min(2,stage-1)):drawTower(sp,0,0,t,null,sz);return}
  const sw=Math.sin(t*2+k.length)*.6;
  if(stage===0){r(-1,-4,1,4,'#5fe08a');r(0,-6,1,6,'#5fe08a');r(1,-3,1,3,'#8ae07a');return}
  if(k==='trigo'){const n=2+stage*2,h=[0,8,14,20][stage];for(let i=0;i<n;i++){const x0=-6+i*(12/(n-1||1)),lean=Math.round(sw*(i%2?1:-1));r(x0,-h,1,h,'#6aa040');r(x0+lean,-h-1,1,2,'#8ac050');
      if(stage===3){r(x0-1+lean,-h-6,3,6,'#e8c86a');r(x0+lean,-h-7,1,1,'#fff0a0')}}}
  if(k==='uva'){const h=[0,10,16,22][stage];r(-1,-h-2,2,h+2,'#8a5236');r(-6,-h,12,1,'#8a5236');blob(-3,-h+3,4+stage,2+stage,'#1f6b3a','#2f9a5a','#5fe08a',3);blob(4,-h+6,3+stage,2+stage,'#1f6b3a','#2f9a5a','#5fe08a',8);
    if(stage===3)[[-5,-h+6],[3,-h+9],[-1,-h+10]].forEach(([a,b])=>{r(a,b,3,3,'#7b2fbf');r(a+1,b+3,2,2,'#6a24a8');r(a,b,1,1,'#c58cff')})}
  if(k==='roma'){const h=[0,8,14,20][stage];r(-1,-h,3,h,'#7a3e2e');blob(0,-h-3,3+stage*2,2+stage*2,'#1c5a33','#2f9a5a','#6fe09a',11);
    if(stage===3)[[-5,-h-2],[4,-h-5],[1,-h+1],[-2,-h-8]].forEach(([a,b])=>{r(a,b,3,3,'#e0284a');r(a,b,1,1,'#ff9aa8');r(a+1,b-1,1,1,'#f7c948')})}
  if(k==='oliva'){const h=[0,7,12,17][stage];r(-1,-h,2,h,'#7d6a5a');r(-3,-h+3,2,2,'#7d6a5a');blob(0,-h-3,4+stage*2,2+stage*2,'#4f6b48','#7f9a6e','#b8cf9a',23);
    if(stage===3)[[-5,-h-2],[4,-h-4],[0,-h],[-2,-h-7],[6,-h]].forEach(([a,b])=>{r(a,b,2,2,'#2a2a3a');r(a,b,1,1,'#6a6a8a')})}
}
function gPot(){// a terracotta pot on a little saucer, outlined like the sprites
  r(-13,6,26,4,'#2a1408');r(-12,7,24,2,'#a0502a');r(-12,7,24,1,'#c87048');
  r(-12,-5,24,5,'#2a1408');for(let y=0;y<9;y++){const q=y*.25|0;r(-10+q-1,y,20-2*q+2,1,'#2a1408')}
  for(let y=0;y<8;y++){const q=y*.25|0;r(-10+q,y,20-2*q,1,'#c0603a');r(-10+q,y,2,1,'#e08050');r(8-q,y,2,1,'#8a3a20')}r(-8,4,16,1,'#8a3a20');
  r(-11,-4,22,4,'#d87a4a');r(-11,-4,22,1,'#f8a070');r(-11,-1,22,1,'#a04a28');r(-9,-3,18,1,'#4a2a1a')}
function gBubble(kind){r(-6,-12,13,11,'#ffffff');r(-7,-11,15,9,'#ffffff');r(-1,-1,3,2,'#ffffff');r(-7,-12,15,1,'#00000022');
  if(kind==='water'){r(-1,-10,2,2,'#4a9ad8');r(-2,-8,4,3,'#4a9ad8');r(-1,-8,1,1,'#bfe8ff')}
  else if(kind==='spray'){r(-3,-9,4,7,'#5aa84a');r(-2,-11,2,2,'#3a6a3a');r(1,-10,3,1,'#9a9aa8');r(4,-11,1,1,'#bfe8ff');r(4,-9,1,1,'#bfe8ff')}
  else if(kind==='harpa'){r(-3,-10,1,8,'#c9921a');r(-3,-10,6,1,'#c9921a');r(3,-10,1,5,'#c9921a');for(let i=-2;i<3;i+=2)r(i,-9,1,6,'#fff6c0')}
  else{disc(0,-7,3,'#c9921a');disc(0,-7,2,'#f7c948');r(-1,-9,1,1,'#fff6c0')}}
// ---------- tree pots: grow like crops, then cycle between needs and happy, coin-dropping spells
function treeTick(p,now){if(!isTree(p.k)||p.stage<3)return;
  if(!p.need&&!(p.happy>now)&&now>=(p.needAt||0))p.need=NEEDS[(now/1000|0)%3];}
function satisfy(p,i,kind){const now=Date.now();if(p.need!==kind)return false;p.need=null;p.happy=now+180000;p.needAt=now+240000;p.coinAt=now+8000;gBurst(i,12,['#ff8ab0','#ffd0e0','#fff6c0'],1);return true}
function gBurst(i,n,c,up){const sp=GSPOTS[i];for(let k=0;k<n;k++)gParts.push({x:sp.x+rnd(-10,10)*sp.s,y:sp.y-24*sp.s,vx:rnd(-1,1),vy:up?rnd(-2,-1):rnd(-.5,.5),g:up?.08:.15,t:rnd(.6,1.2),c:pick(c),s:2})}
function dropCoins(now){const G=META.garden;G.pots.forEach((p,i)=>{if(!p||!isTree(p.k)||p.stage<3)return;const mel=p.mel>now,happy=p.happy>now||mel;if(!happy||now<(p.coinAt||0))return;
  if(gDrops.filter(d=>d.i===i).length>=4)return;p.coinAt=now+(mel?1800:25000);const gold=Math.random()<(mel?.25:.12),sp=GSPOTS[i];
  gDrops.push({i,x:sp.x+rnd(-14,14)*sp.s,y:sp.y+4*sp.s,vy:-2.5,yy:0,gold,t:0});sfx('coin')})}
function gPick(d){META.coins+=d.gold?25:5;d.dead=1;saveMeta();sfx('coin');gParts.push({x:d.x,y:d.y-6,vx:0,vy:-1.2,g:0,t:.8,c:d.gold?'#ffe36a':'#e8e8f0',s:2,txt:'+'+(d.gold?25:5)});$('gcoins')&&($('gcoins').textContent=META.coins)}
// the greenhouse behind the pots: painted once (sky and trees through the glass, white frames, a stone floor, wooden shelves)
let GH_BG=null;
function greenhouseBG(){if(GH_BG)return GH_BG;const c=mkHD(GW,GH,2),B=layerBuf(c,'#e8f4ec',40,220,.5),{d,w,h,k}=B;
  pSky(B,{sky:['#5ab0dc','#7ac4e4','#a0d8ea','#c8ecf2','#e8f6f0'],hor:140});pForest(B,-10,GW+10,108,11,3,'leaf',2);
  const T=['#4a3424','#6a4a32','#8a6444','#a88058','#c49c70'].map(u32);
  for(let Y=Math.floor(113*k);Y<h;Y++)for(let X=0;X<w;X++){const u=(X+.5)/k,v=(Y+.5)/k,row=Math.floor((v-113)/12),tx=(u+(row%2)*14)%28,ty=(v-113)%12;
    let s=.62-(v-113)/(GH-113)*.3+(hs(Math.floor((u+(row%2)*14)/28),row)-.5)*.16+(fbm(u*.2,v*.2,3)-.5)*.14;if(tx<1||ty<1)s=.08;else if(tx<2||ty<2)s+=.12;d[Y*w+X]=rp(T,s,X,Y,2)}
  putBuf(B);const keep=C;C=c.getContext('2d');
  for(let i=0;i<=GW;i+=60){r(i-2,0,4,110,'#f8faf8');r(i+1,0,1,110,'#c8d0c8')}for(const yy of[0,36,72]){r(0,yy,GW,4,'#f8faf8');r(0,yy+3,GW,1,'#c8d0c8')}
  r(0,104,GW,8,'#e8ece8');r(0,104,GW,1,'#ffffff');r(0,111,GW,2,'#a8b0a8');
  GROWS.forEach(rw=>{const y=rw.y+11*rw.s,hh=7*rw.s;r(15,y-3,GW-30,hh+4,'#2a1408');r(16,y-2,GW-32,hh+2,'#a8703e');r(16,y-2,GW-32,1,'#d8a064');r(16,y+hh-1,GW-32,1,'#7a4a26');
    for(let i=20;i<GW-24;i+=17)r(i,y+(i%3),6,.5,'#8a5a32');
    for(const lx of[26,GW/2-4,GW-34]){r(lx-1,y+hh+1,7,18*rw.s+1,'#2a1408');r(lx,y+hh+1,5,18*rw.s,'#8a5a32');r(lx,y+hh+1,1,18*rw.s,'#b07a48')}});
  C=keep;return GH_BG=c}
function drawGreenhouse(g){g.drawImage(greenhouseBG(),0,0,GW,GH);
  g.globalAlpha=.25;for(let i=0;i<5;i++){g.fillStyle='#ffffff';g.beginPath();g.moveTo(40+i*100,0);g.lineTo(70+i*100,0);g.lineTo(130+i*100,110);g.lineTo(100+i*100,110);g.fill()}g.globalAlpha=1}
function drawGarden(){
  const cvs=$('gardc');if(!cvs){clearInterval(gLoop);gLoop=null;return}
  gT+=.05;const g=hdCtx(cvs,GW,GH,2);C=g;const G=META.garden,now=Date.now();G.pots.forEach(p=>{if(p){potAdvance(p);treeTick(p,now)}});dropCoins(now);
  drawGreenhouse(g);
  GSPOTS.forEach((sp,i)=>{const open=i<G.potsN,p=G.pots[i];g.save();g.translate(sp.x,sp.y);g.scale(sp.s*1.55,sp.s*1.55);
    if(!open){g.globalAlpha=i===G.potsN?.7:.25;r(-14,4,28,4,'#d8d0b8');r(-1,-6,3,9,'#8a8070');r(-5,-3,11,3,'#8a8070');g.globalAlpha=1}
    else if(gHeld!==i){gPot();if(p){const mel=p.mel>now,happy=p.happy>now;g.save();if(mel){g.rotate(Math.sin(gT*12)*.12)}else if(happy)g.translate(0,-Math.abs(Math.sin(gT*3+i))*1);gPlant(p.k,p.stage,gT+i);g.restore();
      const h=isTree(p.k)?[8,14,22,30][p.stage]*(TREE[p.k.slice(2)]?Math.min(1.4,TREE[p.k.slice(2)].b):1):[6,12,18,24][p.stage],bob=Math.sin(gT*3+i)*1.5;
      const need=isTree(p.k)?(p.stage<3&&!p.watered?'water':p.need):(p.stage>=3?'coin':!p.watered?'water':null);
      if(need){g.save();g.translate(4,-h-6+bob);gBubble(need);g.restore()}
      else if(p.stage<3){const P=GPLANTS[p.k],u=Math.min(1,(now-p.t0)/(P.stage*1000));r(-8,10,16,2,'#00000055');r(-8,10,16*u,2,'#7fc8ff')}
      if(happy&&(gT*4|0)%6===i%6){const hy=-h-4-((gT*20+i*7)%14);r(-2,hy,1,2,'#ff6a9a');r(1,hy,1,2,'#ff6a9a');r(-2,hy+1,4,1,'#ff6a9a');r(-1,hy+2,2,1,'#ff6a9a')}}}
    if(gHover===i){g.globalAlpha=.6+Math.sin(gT*6)*.3;ring(0,5,16,'#ffe36a');g.globalAlpha=1}
    g.restore()});
  // coins on the tables: hover or click to pick up
  gDrops=gDrops.filter(d=>!d.dead&&(d.t+=.05)<30);for(const d of gDrops){if(d.yy<0||d.vy<0){d.vy+=.25;d.yy=Math.min(0,d.yy+d.vy)}const w=Math.abs(Math.cos(d.t*3))*3+1;
    if(d.t>26&&(gT*10|0)%2)continue;disc(d.x,d.y+d.yy,4,d.gold?'#c9921a':'#8a8a98');disc(d.x,d.y+d.yy,3,d.gold?'#ffe36a':'#e0e0ea');r(d.x-w/2,d.y+d.yy-2,w,4,d.gold?'#fff6c0':'#ffffff')}
  if(gHeld>=0&&G.pots[gHeld]){const p=G.pots[gHeld];g.save();g.translate(gMouse.x,gMouse.y);g.scale(1.2,1.2);gPot();gPlant(p.k,p.stage,gT);g.restore()}
  // the snail on the floor, and rain over the glass
  gSnail.x+=gSnail.d*.15;if(gSnail.x>GW-30||gSnail.x<30)gSnail.d*=-1;const sx=gSnail.x,sy=292;
  r(sx-5,sy,10,3,'#c8b090');disc(sx-gSnail.d,sy-3,4,'#b07a40');disc(sx-gSnail.d,sy-3,2,'#e0a060');r(sx+gSnail.d*5,sy-4,1,4,'#c8b090');
  gEvents();if(gRain>0)for(let i=0;i<24;i++)r(hs(i,gT*80|0)*GW,hs(i+3,gT*80|0)*104,1,5,'#9ad0f0');
  gParts=gParts.filter(p=>(p.t-=.05)>0);for(const p of gParts){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;if(p.txt){g.font='700 9px "Pixelify Sans", monospace';g.textAlign='center';g.fillStyle='#000';g.fillText(p.txt,p.x+1,p.y+1);g.fillStyle=p.c;g.fillText(p.txt,p.x,p.y)}else r(p.x,p.y,p.s||1,p.s||1,p.c)}
  C=x}
function gEvents(){const G=META.garden;gRain=Math.max(0,gRain-1);if(--gNextEv>0)return;gNextEv=900+(Math.random()*600|0);
  gRain=140;let n=0;G.pots.forEach(p=>{if(p&&!p.watered&&p.stage<3){p.watered=true;p.t0=Date.now();n++}if(p&&p.need==='water'&&satisfy(p,G.pots.indexOf(p),'water'))n++});saveMeta();toast('Chuva serôdia na estufa',n?n+' planta(s) regada(s)':'Tudo já estava regado')}
const gMouse={x:0,y:0};
function gPos(ev){const cvs=$('gardc'),rc=cvs.getBoundingClientRect();return{x:(ev.clientX-rc.left)/rc.width*GW,y:(ev.clientY-rc.top)/rc.height*GH}}
function gSpotAt(ev){const m=gPos(ev);let best=-1,bd=1e9;GSPOTS.forEach((s,i)=>{const d=Math.hypot(s.x-m.x,(s.y-8*s.s)-m.y);if(d<26*s.s&&d<bd){bd=d;best=i}});return best}
const sellPrice=p=>isTree(p.k)?[5,25,70,160][p.stage]:p.stage>=3?GPLANTS[p.k].sell:Math.round(GPLANTS[p.k].price*.3);
function gDescribe(i){const G=META.garden,p=G.pots[i];if(i<0)return'';if(i>=G.potsN)return i===G.potsN?'Lugar livre · vaso novo por '+potPrice()+' moedas (clique para comprar)':'Compre os vasos em ordem';
  if(!p)return'Vaso vazio · escolha uma semente ou muda na barra e clique aqui';const P=GPLANTS[p.k],nm=P.name,st=['broto','muda','jovem','adulta'][p.stage];
  if(isTree(p.k)){if(p.stage<3)return nm+' · '+st+(p.watered?' · crescendo':' · precisa de água')+' · vende por '+sellPrice(p);
    if(p.need)return nm+' adulta · quer '+{water:'água (regador)',spray:'o spray contra praguinha',harpa:'ouvir a harpa'}[p.need];
    return nm+' adulta · '+(p.mel>Date.now()?'dançando com o mel!':p.happy>Date.now()?'feliz, soltando moedas':'descansando')+' · vende por '+sellPrice(p)}
  if(p.stage>=3)return nm+' madura! Clique para colher e vender por '+P.sell+' moedas';
  return nm+' · '+st+(p.watered?' · crescendo, falta '+Math.max(0,P.stage-(Date.now()-p.t0)/1000|0)+'s':' · precisa de água')}
function gAct(i,ev){const G=META.garden,now=Date.now();
  if(gTool==='luva'&&gHeld>=0){if(i>=0&&i<G.potsN&&!G.pots[i]){G.pots[i]=G.pots[gHeld];G.pots[gHeld]=null;sfx('plant');saveMeta()}gHeld=-1;gardenBar();return}
  if(i<0)return;
  if(i>=G.potsN){if(i!==G.potsN){toast('Compre os vasos em ordem');return}const pr2=potPrice();if(META.coins<pr2){sfx('no');toast('Faltam moedas','Um vaso custa '+pr2);return}
    META.coins-=pr2;G.potsN++;G.pots.push(null);saveMeta();sfx('coin');toast('Vaso novo','-'+pr2+' moedas');gardenBar();return}
  const p=G.pots[i];
  if(gTool&&gTool.startsWith('seed:')){const k=gTool.slice(5);if(p){toast('Esse vaso já tem planta');return}if(!G.seeds[k]){sfx('no');return}
    G.seeds[k]--;G.pots[i]={k,stage:0,watered:false,t0:0};saveMeta();sfx('plant');gBurst(i,8,['#6a3a24','#8a5236'],1);if(!G.seeds[k])gTool=null;gardenBar();return}
  if(!p)return;
  if(gTool==='luva'){gHeld=i;sfx('card');return}
  if(gTool==='vender'){const v=sellPrice(p);META.coins+=v;G.pots[i]=null;saveMeta();sfx('coin');gBurst(i,12,['#f7c948','#fff6c0'],1);toast('+'+v+' moedas',GPLANTS[p.k].name+' vendida');gardenBar();return}
  if(gTool==='adubo'){if(!G.adubo){sfx('no');toast('Sem adubo','Compre na loja');return}if(p.stage>=3){toast('Ela já está adulta');return}G.adubo--;p.stage++;p.watered=false;p.t0=now;saveMeta();sfx('super');gBurst(i,14,['#8a5a2a','#5fe08a','#f7c948'],1);gardenBar();return}
  if(gTool==='mel'){if(!G.mel){sfx('no');toast('Sem mel','Compre na loja');return}if(!isTree(p.k)||p.stage<3){toast('O mel é para árvores adultas');return}G.mel--;p.mel=now+20000;p.coinAt=now;saveMeta();sfx('ach');gardenBar();return}
  if(gTool==='spray'){if(p.need!=='spray'){toast('Essa planta não tem praguinha');return}if(!G.spray){sfx('no');toast('Sem spray','Compre na loja');return}G.spray--;satisfy(p,i,'spray');sfx('wind');gardenBar();return}
  if(gTool==='harpa'){if(p.need!=='harpa'){toast('Ela não pediu música agora');return}satisfy(p,i,'harpa');[0,4,7,12].forEach((n,k)=>setTimeout(()=>AC&&tone(hz(n+12),AC.currentTime,.4,'triangle',.05),k*120));return}
  if((gTool==='colher'||!gTool)&&!isTree(p.k)&&p.stage>=3){const P=GPLANTS[p.k];META.coins+=P.sell;G.pots[i]=null;saveMeta();sfx('coin');gBurst(i,14,['#f7c948','#fff6c0'],1);toast('+'+P.sell+' moedas',P.name+' vendida');gardenBar();return}
  if(gTool==='regar'||!gTool){if(p.stage<3&&!p.watered){p.watered=true;p.t0=now;saveMeta();sfx('heal');gBurst(i,14,['#7fc8ff','#bfe8ff'],0);mission('water',1);gardenBar();return}
    if(p.need==='water'){satisfy(p,i,'water');sfx('heal');gBurst(i,14,['#7fc8ff','#bfe8ff'],0);return}}
}
function gIcon(cvs,k){if(k.startsWith('seed:')){const sk=k.slice(5);itemIconTo(cvs,'',()=>{C.save();C.translate(12,23);gPlant(sk,3,1);C.restore()});return}
  itemIconTo(cvs,'g:'+k)}
function gardenBar(){const G=META.garden,el=$('gbar');if(!el)return;const cnt={adubo:G.adubo,spray:G.spray||0,mel:G.mel||0};
  el.innerHTML=GTOOLS.map(([k,n,d])=>`<button type="button" class="gtool ${gTool===k?'on':''}" data-gt="${k}" title="${n}: ${d}"><canvas width="32" height="32" data-gi="${k}"></canvas><b>${n}</b>${k in cnt?`<i>${cnt[k]}</i>`:''}</button>`).join('')+
    `<button type="button" class="gtool shopb" id="gshop" title="Comprar sementes, mudas, adubo, spray e mel"><b>Loja ›</b></button>`;
  const sd=$('gseeds');sd.innerHTML=Object.entries(GPLANTS).filter(([k])=>G.seeds[k]).map(([k,P])=>`<button type="button" class="gtool seed ${gTool==='seed:'+k?'on':''}" data-gt="seed:${k}" title="${P.name}" style="--band:${P.col||'#5fae4a'}"><canvas width="32" height="32" data-gi="seed:${k}"></canvas><b>${P.name}</b><i>${G.seeds[k]}</i></button>`).join('')||'<small>Sem sementes. Vença fases para ganhar mudas, ou compre na loja.</small>';
  [el,sd].forEach(z=>{z.querySelectorAll('canvas[data-gi]').forEach(c=>gIcon(c,c.dataset.gi));z.querySelectorAll('[data-gt]').forEach(b=>b.onclick=()=>{gTool=gTool===b.dataset.gt?null:b.dataset.gt;gHeld=-1;sfx('card');gardenBar()})});
  $('gshop').onclick=()=>showShop2('jardim');
  $('ginfo').textContent=gInfo||({regar:'Regador: clique em quem tem sede.',adubo:'Adubo: a planta cresce um estágio na hora.',spray:'Spray: clique na planta com praguinha.',harpa:'Harpa: toque para quem pediu música.',mel:'Mel: uma árvore adulta dança e solta moedas.',luva:'Luva: pegue um vaso e solte num lugar vazio.',vender:'Vender: clique numa planta para vender.'}[gTool]||(gTool?'Semente na mão: clique num vaso vazio.':'Clique num vaso: rega quem tem sede e colhe o que está maduro. Passe o mouse nas moedas para pegar.'));
  $('gcoins').textContent=META.coins}
function showGarden(){
  clearInterval(wmapTimer);if(!gardenOpen()){toast('O jardim abre ao vencer a fase 1-4');return}
  MUS.scene='estufa';const G=META.garden;while(G.pots.length<G.potsN)G.pots.push(null);if(G.spray==null){G.spray=3;G.mel=1;G.seeds['t:videira']=(G.seeds['t:videira']||0)+1}
  // coins the happy trees dropped while you were away (up to 3 each)
  const now=Date.now(),away=now-(G.lastVisit||now);G.lastVisit=now;gDrops=[];
  if(away>25000)G.pots.forEach((p,i)=>{if(p&&isTree(p.k)&&p.stage>=3&&(p.happy||0)>now-away){const n=Math.min(3,Math.floor(Math.min(away,(p.happy-(now-away)))/25000));const sp=GSPOTS[i];for(let k=0;k<n;k++)gDrops.push({i,x:sp.x+rnd(-14,14)*sp.s,y:sp.y+4*sp.s,vy:0,yy:0,gold:Math.random()<.12,t:0})}});
  menu(`<div class="mbox wide garden modern"><div class="topbar"><button class="btn ghost" data-go="hub">‹ Menu</button><h2>Estufa</h2><span class="coins"><canvas width="12" height="12" class="coin"></canvas><b id="gcoins">${META.coins}</b> moedas</span></div>
    <div class="gbar" id="gbar"></div><div class="gcare" id="gcare">${gCare()}</div>
    <div class="gscene"><canvas id="gardc" width="${GW*2}" height="${GH*2}"></canvas></div>
    <p class="ginfo" id="ginfo"></p><div class="gbar seeds" id="gseeds"></div>
    <p class="help">Plantas crescem com o tempo real. Árvores adultas pedem água, spray ou música; atendidas, ficam felizes e soltam moedas.</p></div>`);
  paintCoins();const cvs=$('gardc');
  cvs.addEventListener('pointermove',e=>{const m=gPos(e);gMouse.x=m.x;gMouse.y=m.y;for(const d of gDrops)if(!d.dead&&Math.hypot(d.x-m.x,d.y-m.y)<9)gPick(d);
    const i=gSpotAt(e);if(i!==gHover){gHover=i;gInfo=gDescribe(i);$('ginfo').textContent=gInfo||' '}});
  cvs.addEventListener('pointerleave',()=>{gHover=-1;gInfo='';gardenBar()});
  cvs.addEventListener('click',e=>{const m=gPos(e);const d=gDrops.find(d=>!d.dead&&Math.hypot(d.x-m.x,d.y-m.y)<10);if(d){gPick(d);return}const i=gSpotAt(e);gAct(i,e);gInfo=gDescribe(i);$('ginfo').textContent=gInfo});
  gardenBar();clearInterval(gLoop);drawGarden();let gTick=0;gLoop=setInterval(()=>{drawGarden();if(++gTick%20===0&&$('gcare'))$('gcare').innerHTML=gCare();if(gHover>=0&&$('ginfo'))$('ginfo').textContent=gDescribe(gHover)},50);
}

// ---------- the Tree of Life: its own place, only after you buy the seed
const treeOwned=()=>!!(META.garden.treeSeed||META.garden.tree.planted);
let tLoop=null,tT=0;
const REWARD_ICON=['','coin','cerca','card','heart','coin','espantalho','card','arado','coin','leaf'];
function drawTreeScene(){
  const cvs=$('treec2');if(!cvs){clearInterval(tLoop);tLoop=null;return}
  tT+=.05;const g=cvs.getContext('2d');C=g;const T=META.garden.tree,lv=T.planted?T.lvl:-1;
  const gr=g.createLinearGradient(0,0,0,GH);gr.addColorStop(0,'#2a3a7a');gr.addColorStop(.45,'#e8a0a0');gr.addColorStop(.7,'#ffd8a0');gr.addColorStop(1,'#fff0c0');g.fillStyle=gr;g.fillRect(0,0,GW,GH);
  for(let yy=-34;yy<=0;yy++){const w=Math.sqrt(1156-yy*yy);r(90-w,170+yy,w*2,1,'#fff6d0')}
  g.save();g.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const a=(.04+.02*Math.sin(tT+i))*(lv>=0?1:.5);g.fillStyle=`rgba(255,240,190,${a})`;g.beginPath();g.moveTo(240,60);g.lineTo(240+(i-3)*70-14,GH);g.lineTo(240+(i-3)*70+14,GH);g.fill()}g.restore();
  mount(GW,186,12,.02,4,'#b07a8a');mount(GW,200,8,.03,8,'#8a5a6a');
  for(let y=196;y<GH;y++){const hw=y<214?Math.sqrt(Math.max(0,1-((214-y)/18)**2))*170:GW;g.fillStyle=y%6<3?'#4faa50':'#5cba5a';g.fillRect(240-hw,y,hw*2,1)}
  // river of the water of life (Ap 22:1)
  for(let y=238;y<256;y++){g.fillStyle=y%4<2?'#4a9ad8':'#6ab8e8';g.fillRect(0,y+Math.round(Math.sin(y+tT*2)),GW,1)}for(let i=0;i<14;i++)r(((i*40+tT*20)%GW),242+(i%3)*5,6,1,'#e8f8ff');
  const cx=240,base=206;
  if(lv<0){r(cx-14,base-2,28,6,'#3a2414');disc(cx,base-4,4+Math.sin(tT*3),'#f7c948');disc(cx,base-4,2,'#fff6c0');for(let i=0;i<8;i++){const a=i/8*Math.PI*2+tT;r(cx+Math.cos(a)*10,base-4+Math.sin(a)*6,1,1,'#fff6c0')}}
  else{const s=1+lv*.5,trunkH=12+lv*9;
    for(let j=0;j<trunkH;j++){const w=(4+lv*.8)*(1-j/trunkH*.4);r(cx-w/2,base-j,w,1,'#7a4a2e');r(cx-w/2,base-j,1,1,'#9a6a40')}
    for(let k=0;k<Math.min(4,lv);k++){const dir=k%2?1:-1,yb=base-trunkH*.5-k*6;for(let j=0;j<10+lv*2;j++)r(cx+dir*j,yb-j*.6,2,2,'#7a4a2e')}
    const cy=base-trunkH-4*s;blob(cx,cy,(12+lv*7)|0,(8+lv*4)|0,'#2a7a3a','#5fc060','#b0f090',77);
    if(lv>=3){blob(cx-14-lv*4,cy+8+lv,(8+lv*3)|0,(5+lv*2)|0,'#2a7a3a','#5fc060','#b0f090',78);blob(cx+14+lv*4,cy+8+lv,(8+lv*3)|0,(5+lv*2)|0,'#2a7a3a','#5fc060','#b0f090',79)}
    const fc=['#ff4f7b','#c58cff','#b8cf9a','#7ac050','#ffa64a','#ffc8e4','#e8e070','#ffffff','#ff9a3c','#5af0ff','#f7c948','#ff4f7b'];
    for(let i=0;i<Math.min(12,lv+(lv>=10?2:1));i++){const a=i/12*Math.PI*2+Math.sin(tT*.5)*.1;r(cx+Math.cos(a)*(10+lv*5),cy+Math.sin(a)*(6+lv*3),3,3,fc[i]);r(cx+Math.cos(a)*(10+lv*5),cy+Math.sin(a)*(6+lv*3),1,1,'#ffffff')}
    for(let i=0;i<4+lv;i++){const lx=(hs(i,3)*GW+tT*(6+i))%GW,ly=(hs(i,4)*180+tT*(8+i*2))%190;r(lx,ly,2,1,'#8ae07a')}}
  C=x;
}
function rewardIconTo(cvs,k){if(k==='cerca'||k==='espantalho')return barrierIconTo(cvs,k);if(k==='arado')return toolIconTo(cvs,k);
  const g=cvs.getContext('2d');g.clearRect(0,0,32,32);C=g;
  if(k==='coin'){disc(16,16,9,'#c9921a');disc(16,16,7,'#f7c948');r(12,11,3,3,'#fff6c0');r(15,12,2,9,'#c9921a')}
  if(k==='card'){r(9,5,14,22,'#c9921a');r(10,6,12,20,'#3e2458');r(12,9,8,8,'#f7c948');r(13,20,6,2,'#fff6c0')}
  if(k==='heart')shopIconTo(cvs,'hearts');
  if(k==='leaf'){for(let i=0;i<10;i++)r(8+i,22-i*1.2,4,3,'#5fc060');r(8,22,14,1,'#2a7a3a')}
  C=x}
function showTree(){
  clearInterval(wmapTimer);clearInterval(gLoop);if(!treeOwned()){showHub();return}
  const G=META.garden,T=G.tree;
  const render=()=>{const need=treeNeed(T.lvl),wcd=Math.max(0,60-(Date.now()-T.lastWater)/1000|0),full=T.lvl>=10;
    menu(`<div class="mbox wide"><div class="topbar"><button class="btn ghost" data-go="hub">‹ Menu</button><h2>Árvore da Vida</h2>${coinsTag()}</div>
      <div class="gscene"><canvas id="treec2" width="${GW}" height="${GH}"></canvas></div>
      ${T.planted?`<div class="treepanel"><div class="tlv"><b>Nível ${T.lvl}<small>/10</small></b><div class="xp"><i style="width:${full?100:Math.min(100,T.xp/need*100)}%"></i></div><small>${full?'A árvore está plena.':T.xp+' / '+need+' de crescimento'} · +${T.lvl*5}% de moedas nas fases</small></div>
        <div class="row"><button class="btn" id="twater" ${wcd>0||full?'disabled':''}>${wcd>0?'Regar em '+wcd+'s':'Regar · +8'}</button>
        <button class="btn ghost" id="tadubo" ${!G.adubo||full?'disabled':''}>Adubo · +20 <i>(${G.adubo})</i></button><button class="btn ghost" id="tfert" ${!G.fertil||full?'disabled':''}>Fertilizante · +70 <i>(${G.fertil})</i></button>
        <button class="btn ghost" id="tshop">Comprar adubo</button></div></div>
        <div class="sec"><h3>Recompensas por nível</h3><div class="rtrack">${TREE_REWARDS.slice(1).map((R,i)=>`<div class="rw ${T.lvl>=i+1?'got':T.lvl===i?'next':''}"><canvas width="32" height="32" data-rw="${REWARD_ICON[i+1]}"></canvas><b>${i+1}</b><small>${R.txt}</small></div>`).join('')}</div></div>`
      :`<div class="treepanel"><p>“No meio da sua praça, e de um e de outro lado do rio, estava a árvore da vida.” (Apocalipse 22:2)</p><button class="btn" id="tplant">Plantar a semente da Árvore da Vida</button></div>`}
    </div>`);
    paintCoins();$('menu').querySelectorAll('canvas[data-rw]').forEach(c=>rewardIconTo(c,c.dataset.rw));
    const grow=n=>{T.xp+=n;const msg=[];while(T.lvl<10&&T.xp>=treeNeed(T.lvl)){T.xp-=treeNeed(T.lvl);T.lvl++;const R=TREE_REWARDS[T.lvl];
        if(R.coins)META.coins+=R.coins;if(R.items)for(const k in R.items)META.items[k]=(META.items[k]||0)+R.items[k];if(R.rare)META.celeiro.push({k:rpick(SEED_KEYS)});
        if(R.heart)META.upg.treeHearts=(META.upg.treeHearts||0)+1;if(R.weapon)META.weapons[R.weapon]=1;msg.push('Nível '+T.lvl+': '+R.txt)}
      if(T.lvl>=10)T.xp=0;saveMeta();msg.forEach(m=>toast('A Árvore da Vida cresceu',m));if(msg.length)sfx('ach');render()};
    if($('tplant'))$('tplant').onclick=()=>{G.treeSeed=0;T.planted=true;T.lvl=0;T.xp=0;saveMeta();sfx('super');toast('A Árvore da Vida foi plantada','Gênesis 2:9');render()};
    if($('twater'))$('twater').onclick=()=>{T.lastWater=Date.now();sfx('heal');grow(8)};
    if($('tadubo'))$('tadubo').onclick=()=>{G.adubo--;sfx('plant');grow(20)};
    if($('tfert'))$('tfert').onclick=()=>{G.fertil--;sfx('super');grow(70)};
    if($('tshop'))$('tshop').onclick=()=>showShop2('arvore');
  };
  render();clearInterval(tLoop);drawTreeScene();tLoop=setInterval(()=>{drawTreeScene();const b=$('twater');if(b&&b.disabled&&T.lastWater){const s=Math.max(0,60-(Date.now()-T.lastWater)/1000|0);if(s>0)b.textContent='Regar em '+s+'s';else render()}},50);
}


// ---------- first-time tutorial: illustrated slides
const INTRO=[
 ['Bem-vindo ao jardim','Você é o lavrador. As obras da carne (Ódio, Inveja, Discórdia...) querem chegar à árvore do lado esquerdo. Não deixe passar.','gard'],
 ['Plante com cartas','Sua mão tem 4 cartas. Pare sobre um canteiro (os brotinhos) e aperte 1 a 4, ou arraste a carta até ele. Cada carta custa maná, que recarrega sozinho.','card'],
 ['Regue para crescer','Fique parado ao lado de uma árvore e o lavrador rega. A cada rega completa ela cresce e sobe de nível; com 3 vira árvore adulta. A chuva e a carta Regar também regam.','water'],
 ['Cada fruto vence uma praga','Romã vence Ódio, Videira vence Inveja, Oliveira vence Discórdia... O dano fica 2,5 vezes maior. Árvores vizinhas se fortalecem.','fruit'],
 ['Lute junto','← → anda, ↑ pula. No ar, ↓ dá um pisão: em cima de uma árvore, solta o poder dela. X golpeia com a ferramenta e C usa o poder especial do seu personagem. Esc pausa, F acelera.','fight'],
 ['Cuidado com as pragas','Encostar nelas tira corações. Sem corações você desmaia e perde maná. Pegue os frutos e as moedas que caem.','hurt'],
 ['Fora das batalhas','Vença fases para ganhar moedas e cartas novas. Na Loja compre ferramentas e sementes. Depois da fase 1-4 abre o Jardim; a Árvore da Vida vem mais tarde.','shop']];
// ---------- tutorial art: small animated scenes drawn at 4x, sprites at 2x, so they read clearly
let introRAF=0,introCard=null;
function introArt(cvs,k){cancelAnimationFrame(introRAF);const g=cvs.getContext('2d'),t0=performance.now();
  const loop=()=>{if(!cvs.isConnected)return;g.setTransform(4,0,0,4,0,0);g.__k=4;g.imageSmoothingEnabled=false;introScene(g,k,(performance.now()-t0)/1000);introRAF=requestAnimationFrame(loop)};loop()}
function introScene(g,k,t){const keep=C,kr=RUN;C=g;RUN={char:META.char};g.save();
  const gr=g.createLinearGradient(0,0,0,90);gr.addColorStop(0,'#3a86de');gr.addColorStop(.8,'#bfe4ff');g.fillStyle=gr;g.fillRect(0,0,160,90);
  for(let i=0;i<160;i+=.5){const h=Math.sin(i*.04+1)*6+Math.sin(i*.11)*3;r(i,54-h,.5,30,'#9cc4dc')}
  for(let i=0;i<160;i+=.5){const h=Math.sin(i*.07+3)*4;r(i,64-h,.5,20,'#7cae86')}
  for(let c=0;c<2;c++){const cx=((t*4+c*90)%200)-30;blob(cx,14+c*8,12,3,'#c8dcf0','#e8f2ff','#ffffff',c+3)}
  const A=MAP&&MAP.atlas;if(A)for(let i=0;i<160;i+=8){g.drawImage(A,(hs(i,1)*3|0)*8*A.__k,0,8*A.__k,8*A.__k,i,74,8,8);for(let j=82;j<90;j+=8)g.drawImage(A,(5+(hs(i,j)*3|0))*8*A.__k,0,8*A.__k,8*A.__k,i,j,8,8)}
  else{r(0,74,160,16,'#4b2228');r(0,74,160,2,'#5fe08a')}
  const txt=(s,x0,y0,c='#fff',sz=7)=>pxText(g,s,x0,y0,`700 ${sz}px "Pixelify Sans", monospace`,c,'#1a0c06');
  const P=(o)=>Object.assign({face:1,x:0,y:37,vx:0,vy:0,on:true,sq:1,anim:0,slam:false,stun:0,inv:0,faint:0,swing:0},o);
  const T=(kind,X,sz=1.2)=>drawTower(kind,X,37,t,null,sz);
  g.save();g.scale(2,2);// sprite space: 80x45, ground at y=37
  if(k==='gard'){T('oliveira',10,1.7);const ex=78-((t*10)%52);enemyBody({k:'odio',x:ex,y:37,t});enemyBody({k:'inveja',x:ex+14,y:16+Math.sin(t*3)*2,t});
    drawGardener(P({x:30,face:1}))}
  if(k==='card'){const ph=(t%3.4)/3.4,grow=ph<.55?0:Math.min(1,(ph-.55)/.25);r(39,36,5,1,'#3a2010');
    if(grow>0)drawTower('videira',41,37,t,null,.5+easeBack(grow)*.8);else{r(41,33,1,3,'#5fe08a');r(40,32,1,1,'#5fe08a');r(42,32,1,1,'#5fe08a')}
    drawGardener(P({x:33}))}
  if(k==='water'){const u=(t%6)/6,sz=.55+Math.min(1,u*1.3)*.75;T('roma',46,sz*1.55);drawGardener(P({x:36,face:1}));
    for(let i=0;i<6;i++){const v=(t*1.6+i/6)%1;r(39+v*6,26-Math.sin(v*Math.PI)*5+v*8,1,1,i%2?'#7ac0ff':'#bfe8ff')}
    r(40,39,12,2,'#0a1a30');r(40,39,12*((u*3.9)%1),2,'#5ab0ff');for(let s2=0;s2<3;s2++)r(40+s2*5,42,3,1,s2<Math.min(3,u*3.9|0)?'#5ab0ff':'#2a3a50')}
  if(k==='fruit'){T('roma',18,1.5);const ex=70-((t*8)%26);enemyBody({k:'odio',x:ex,y:37,t,flash:Math.sin(t*12)>.7?1:0});
    for(let i=0;i<3;i++){const v=(t*1.4+i/3)%1;r(18+(ex-18)*v,22+(30-22)*v-Math.sin(v*Math.PI)*8,2,2,'#e0284a')}}
  if(k==='fight'){const jy=Math.max(0,Math.sin(t*2.6))*14,slam=Math.sin(t*2.6)<-.2;drawGardener(P({x:30,y:37-jy,on:jy<.5,slam:jy>2&&Math.cos(t*2.6)<0,swing:slam?.1:0}));
    enemyBody({k:'discordia',x:44,y:37,t});T('figueira',62,1.3);if(jy<1){g.globalAlpha=.6;ring(30,37,6+((t*20)%6),'#ffffff');g.globalAlpha=1}}
  if(k==='hurt'){const gx2=58-((t*9)%24),hit=gx2<40;enemyBody({k:'gula',x:gx2,y:37,t});if(!(hit&&(t*12|0)%2))drawGardener(P({x:30,stun:hit?1:0}));}
  if(k==='shop'){g.save();g.translate(16,8);g.scale(1.2,1.2);hubIconTo2('loja');g.restore();for(let i=0;i<4;i++){const cy=30-((t*20+i*6)%14);disc(56+i*4,cy,2,'#c9921a');disc(56+i*4,cy,1.5,'#f7c948')}T('oliveira',68,1.2)}
  g.restore();
  // labels drawn at full resolution so they stay sharp
  if(k==='gard'){txt('proteja a árvore',44,20,'#ffe9a0');txt('←',96-((t*20)%104),52,'#ff6a6a',10)}
  if(k==='card'){const ph=(t%3.4)/3.4;if(ph<.55){const u=ph/.55,cx=120+(84-120)*u,cy=40+(46-40)*u-Math.sin(u*Math.PI)*16;g.imageSmoothingEnabled=true;g.drawImage(introCard||(introCard=cardCanvas(mk('videira'),true)),cx-14,cy-20,28,39);C=g;g.imageSmoothingEnabled=false}
    txt('aperte 1 a 4',120,86,'#fff3c0',6)}
  if(k==='water'){txt('fique parado ao lado',86,12,'#ffe9a0');txt('rega '+Math.min(3,((t%6)/6*3.9)|0)+'/3',92,88,'#bfe8ff',6)}
  if(k==='fruit'){const ex=140-((t*16)%52);txt('x2,5',ex,36+Math.sin(t*6)*2,'#ffe14a',10);txt('Romã vence Ódio',80,14,'#fff3c0')}
  if(k==='fight'){txt('↑ pula   ↓ pisão   X golpe',80,14,'#fff3c0')}
  if(k==='hurt'){for(let i=0;i<3;i++){const on=i<2||(t*3|0)%2;C=g;disc(12+i*11,12,4,'#1a0c06');disc(12+i*11,12,3,on&&i<2?'#e0284a':'#3a1a24')}txt('encostar tira coração',100,14,'#ffb0b0')}
  if(k==='shop'){txt('moedas → loja → sementes',80,14,'#fff3c0')}
  g.restore();C=keep;RUN=kr}
function hubIconTo2(k){const keep=C;const c=mkHD(32,32,4);hubIconTo(c,k);C=keep;C.drawImage(c,0,0,32,32)}
function showIntro(i){
  const[t,txt,art]=INTRO[i],last=i===INTRO.length-1;
  menu(`<div class="mbox"><small class="eyebrow">Como jogar · ${i+1}/${INTRO.length}</small><h2>${t}</h2>
    <div class="introart"><canvas id="introc" width="640" height="360"></canvas></div><p>${txt}</p>
    <div class="dots">${INTRO.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join('')}</div>
    <div class="row">${i?'<button class="btn ghost" id="iprev">‹ Voltar</button>':'<button class="btn ghost" id="iskip">Pular</button>'}<button class="btn" id="inext">${last?'Começar a jogar':'Próximo ›'}</button></div></div>`);
  introArt($('introc'),art);
  $('inext').onclick=()=>last?showHub():showIntro(i+1);
  if($('iprev'))$('iprev').onclick=()=>showIntro(i-1);if($('iskip'))$('iskip').onclick=showHub;
}
showHub();
// what the pots need right now, as chips under the tool bar: how many, and which tool solves it
function gCare(){const G=META.garden,now=Date.now(),c={water:0,spray:0,harpa:0,ripe:0,happy:0};
  G.pots.forEach(p=>{if(!p)return;const tree=isTree(p.k);if(p.stage<3&&!p.watered)c.water++;else if(tree&&p.need)c[p.need]++;else if(!tree&&p.stage>=3)c.ripe++;else if(tree&&p.happy>now)c.happy++});
  const chips=[['water','#5ad0ff','com sede','use o Regador'],['spray','#9ff7b8','com praguinha','use o Spray'],['harpa','#ffd040','querem música','toque a Harpa'],['ripe','#ff9ab0','maduras','clique para colher'],['happy','#c47aff','felizes','soltando moedas']].filter(([k])=>c[k]);
  return chips.length?chips.map(([k,col,t,h])=>`<span style="--c:${col}"><b>${c[k]}</b> ${t}<small>${h}</small></span>`).join(''):'<span style="--c:#8aa0c0">Tudo em ordem. Que tal plantar algo novo?</span>'}
