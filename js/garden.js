// ---------- the Garden: a little backyard where you see every plant (like a zen garden)
const GW=480,GH=270;
const GSPOTS=(()=>{const a=[];[{y:132,s:.72,dx:70},{y:178,s:.86,dx:86},{y:232,s:1,dx:104}].forEach(rw=>{for(let i=0;i<4;i++)a.push({x:240+(i-1.5)*rw.dx,y:rw.y,s:rw.s})});return a})();
let gTool=null,gHover=-1,gLoop=null,gT=0,gParts=[],gSnail={x:60,d:1},gInfo='';
function potPrice(){return 150+META.garden.potsN*40}
function gPlant(k,stage,t){// drawn at the pot's soil line, local pixels
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
function gPot(){r(-11,-1,22,2,'#4a2a1a');r(-12,-3,24,4,'#d07a4a');r(-12,-3,24,1,'#f09a6a');r(-10,1,20,11,'#b0603a');r(-10,1,2,11,'#d07a4a');r(-10,11,20,1,'#7a3a20')}
function gBubble(kind){r(-6,-12,13,11,'#ffffff');r(-7,-11,15,9,'#ffffff');r(-1,-1,3,2,'#ffffff');r(-7,-12,15,1,'#00000022');
  if(kind==='water'){r(-1,-10,2,2,'#4a9ad8');r(-2,-8,4,3,'#4a9ad8');r(-1,-8,1,1,'#bfe8ff')}else{disc(0,-7,3,'#c9921a');disc(0,-7,2,'#f7c948');r(-1,-9,1,1,'#fff6c0')}}
function drawGarden(){
  const cvs=$('gardc');if(!cvs){clearInterval(gLoop);gLoop=null;return}
  gT+=.05;const g=cvs.getContext('2d');C=g;const G=META.garden;G.pots.forEach(p=>p&&potAdvance(p));
  // sky, hedge, fence, shed
  let gr=g.createLinearGradient(0,0,0,100);gr.addColorStop(0,'#7cc6ec');gr.addColorStop(1,'#d4f0f6');g.fillStyle=gr;g.fillRect(0,0,GW,100);
  disc(420,26,12,'#fff6c8');for(let i=0;i<5;i++)blob(((i*120+gT*6)%600)-60,18+(i%2)*12,24,5,'#e8f2f6','#f6fafc','#ffffff',i+3);
  for(let i=0;i<GW;i+=18)blob(i+8,70,14,10,'#2a6a3a','#3a8a4a','#5aaa5a',i);
  r(0,74,GW,30,'#d8b878');for(let i=0;i<GW;i+=16){r(i,66,10,40,'#e8c890');r(i,66,10,2,'#fff0c8');r(i+2,64,6,2,'#e8c890');r(i+9,66,1,40,'#a8885a')}r(0,80,GW,3,'#b8986a');r(0,94,GW,3,'#b8986a');
  for(let i=0;i<5;i++){const fx=300+i*34;r(fx,44,1,34,'#3a8a3a');disc(fx,42,4,'#f7c948');disc(fx,42,2,'#7a4a20')}
  r(14,40,64,60,'#a05a3a');for(let j=44;j<100;j+=6)r(14,j,64,1,'#8a4a2e');for(let j=0;j<20;j++)r(8+j*1.8,40-j,80-j*3.6,1,'#c0383a');r(36,66,20,34,'#4a2414');r(52,82,2,2,'#f7c948');r(20,52,10,10,'#7cc6ec');r(24,52,1,10,'#a05a3a');r(20,56,10,1,'#a05a3a');
  // lawn in perspective
  for(let y=100;y<GH;y++){const k=(y-100)/(GH-100),band=Math.floor(Math.pow(k,.7)*9)%2;g.fillStyle=band?'#5cae4a':'#6abe56';g.fillRect(0,y,GW,1)}
  for(let i=0;i<70;i++){const tx=hs(i,1)*GW,ty=104+hs(i,2)*160;r(tx,ty,1,2,'#8ad870')}
  for(let i=0;i<6;i++){const fx=hs(i,21)*GW,fy=110+hs(i,22)*150;if(GSPOTS.some(s=>Math.abs(s.x-fx)<30&&Math.abs(s.y-fy)<24))continue;r(fx,fy,2,2,['#ffffff','#ffd0e0','#ffe36a'][i%3])}
  // spots back to front
  GSPOTS.forEach((sp,i)=>{const open=i<G.potsN,p=G.pots[i];g.save();g.translate(sp.x,sp.y);g.scale(sp.s*2,sp.s*2);
    C.globalAlpha=.25;disc(0,11,13,'#1a3a10');C.globalAlpha=1;
    if(!open){C.globalAlpha=.55;for(let a=0;a<16;a++){if(a%2)continue;const an=a/16*Math.PI*2;r(Math.cos(an)*12,4+Math.sin(an)*5,2,1,'#ffffff')}r(-1,0,3,9,'#ffffff');r(-4,3,9,3,'#ffffff');C.globalAlpha=1}
    else{gPot();if(p){g.save();gPlant(p.k,p.stage,gT+i);g.restore();const h=[6,12,18,24][p.stage];
      if(p.stage>=3){g.save();g.translate(0,-h-12+Math.sin(gT*3)*1.5);gBubble('coin');g.restore()}else if(!p.watered){g.save();g.translate(0,-h-10+Math.sin(gT*3+i)*1.5);gBubble('water');g.restore()}
      else{const P=GPLANTS[p.k],u=Math.min(1,(Date.now()-p.t0)/(P.stage*1000));r(-8,15,16,2,'#00000055');r(-8,15,16*u,2,'#7fc8ff')}}}
    if(gHover===i){C.globalAlpha=.6+Math.sin(gT*6)*.3;ring(0,5,15,'#ffe36a');C.globalAlpha=1}
    g.restore()});
  // snail and butterflies
  gSnail.x+=gSnail.d*.12;if(gSnail.x>GW-30||gSnail.x<30)gSnail.d*=-1;const sx=gSnail.x,sy=258;
  r(sx-5,sy,10,3,'#c8b090');disc(sx-gSnail.d,sy-3,4,'#b07a40');disc(sx-gSnail.d,sy-3,2,'#e0a060');r(sx+gSnail.d*5,sy-4,1,4,'#c8b090');
  for(let i=0;i<3;i++){const bx=(hs(i,40)*GW+gT*(10+i*4))%GW,by=110+hs(i,41)*80+Math.sin(gT*2+i)*10,w=(gT*20|0)%2;r(bx-2,by-w,2,2,['#ff8ac0','#ffe36a','#8ad0ff'][i]);r(bx+1,by-w,2,2,['#ff8ac0','#ffe36a','#8ad0ff'][i]);r(bx,by,1,2,'#2a2030')}
  gParts=gParts.filter(p=>(p.t-=.05)>0);for(const p of gParts){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;r(p.x,p.y,p.s||1,p.s||1,p.c)}
  C=x;
}
function gSpotAt(ev){const cvs=$('gardc'),rc=cvs.getBoundingClientRect(),mx=(ev.clientX-rc.left)/rc.width*GW,my=(ev.clientY-rc.top)/rc.height*GH;
  let best=-1,bd=1e9;GSPOTS.forEach((s,i)=>{const d=Math.hypot(s.x-mx,(s.y-8*s.s)-my);if(d<28*s.s&&d<bd){bd=d;best=i}});return best}
function gDescribe(i){const G=META.garden,p=G.pots[i];if(i<0)return'';if(i>=G.potsN)return'Espaço vazio · vaso novo por '+potPrice()+' moedas (clique para comprar)';
  if(!p)return'Vaso vazio · escolha uma semente embaixo e clique aqui';const P=GPLANTS[p.k];
  if(p.stage>=3)return P.name+' madura! Clique para colher e vender por '+P.sell+' moedas';
  if(!p.watered)return P.name+' · '+['broto','muda','jovem'][p.stage]+' · precisa de água';
  return P.name+' · '+['broto','muda','jovem'][p.stage]+' · crescendo, falta '+Math.max(0,P.stage-(Date.now()-p.t0)/1000|0)+'s'}
function gAct(i){const G=META.garden;if(i<0)return;
  if(i>=G.potsN){if(i!==G.potsN){toast('Compre os espaços em ordem');return}const pr2=potPrice();if(META.coins<pr2){sfx('no');toast('Faltam moedas','Um vaso custa '+pr2);return}
    META.coins-=pr2;G.potsN++;G.pots.push(null);saveMeta();sfx('coin');toast('Vaso novo','-'+pr2+' moedas');gardenBar();return}
  const p=G.pots[i],sp=GSPOTS[i],burstAt=(n,c,up)=>{for(let k=0;k<n;k++)gParts.push({x:sp.x+rnd(-10,10)*sp.s,y:sp.y-20*sp.s,vx:rnd(-1,1),vy:up?rnd(-2,-1):rnd(-.5,.5),g:up?.08:.15,t:rnd(.6,1.2),c:pick(c),s:2})};
  if(gTool&&gTool.startsWith('seed:')){const k=gTool.slice(5);if(p){toast('Esse vaso já tem planta');return}if(!G.seeds[k]){sfx('no');return}
    G.seeds[k]--;G.pots[i]={k,stage:0,watered:false,t0:0};saveMeta();sfx('plant');burstAt(8,['#6a3a24','#8a5236'],1);if(!G.seeds[k])gTool=null;gardenBar();return}
  if(!p)return;
  if((gTool==='colher'||!gTool)&&p.stage>=3){const P=GPLANTS[p.k];META.coins+=P.sell;G.pots[i]=null;saveMeta();sfx('coin');burstAt(14,['#f7c948','#fff6c0'],1);toast('+'+P.sell+' moedas',P.name+' vendida');gardenBar();return}
  if((gTool==='regar'||!gTool)&&!p.watered&&p.stage<3){p.watered=true;p.t0=Date.now();saveMeta();sfx('heal');burstAt(14,['#7fc8ff','#bfe8ff'],0);gardenBar();return}
}
function gIcon(cvs,k){const g=cvs.getContext('2d');g.clearRect(0,0,32,32);C=g;
  if(k==='regar'){r(6,14,16,11,'#7a8a9a');r(6,14,16,2,'#a0b0c0');r(22,16,6,2,'#7a8a9a');r(27,13,3,3,'#7a8a9a');r(10,9,8,2,'#5a6a7a');r(9,9,1,6,'#5a6a7a');r(18,9,1,6,'#5a6a7a');for(let i=0;i<3;i++)r(29+(i%2),18+i*3,1,2,'#7fc8ff')}
  if(k==='colher'){for(let i=0;i<12;i++)r(8+i,22-i*.4,2,2,'#8a5236');for(let i=0;i<10;i++){const a=-2.2+i*.24;r(19+Math.cos(a)*8,12+Math.sin(a)*8,2,2,'#d0d0d8')}}
  if(k.startsWith('seed:')){const p=GPLANTS[k.slice(5)];r(8,6,16,22,'#e8d8b0');r(8,6,16,3,'#c9a060');r(8,25,16,3,'#c9a060');g.save();g.translate(16,22);gPlant(k.slice(5),3,1);g.restore()}
  if(k==='loja')hubIconTo(cvs,'loja');
  C=x}
function gardenBar(){const G=META.garden,el=$('gbar');if(!el)return;
  const tools=[['regar','Regador','Rega um vaso com sede'],['colher','Colher','Colhe e vende o que está maduro']];
  el.innerHTML=tools.map(([k,n,d])=>`<button type="button" class="gtool ${gTool===k?'on':''}" data-gt="${k}" title="${d}"><canvas width="32" height="32" data-gi="${k}"></canvas><b>${n}</b></button>`).join('')+'<span class="gsep"></span>'+
    Object.entries(GPLANTS).map(([k,P])=>`<button type="button" class="gtool seed ${gTool==='seed:'+k?'on':''}" data-gt="seed:${k}" ${G.seeds[k]?'':'disabled'} title="${P.name}: vende por ${P.sell} · ${Math.round(P.stage*3/60)} min no total"><canvas width="32" height="32" data-gi="seed:${k}"></canvas><b>${P.name}</b><i>${G.seeds[k]||0}</i></button>`).join('')+
    `<span class="gsep"></span><button type="button" class="gtool" id="gshop"><canvas width="32" height="32" data-gi="loja"></canvas><b>Loja</b></button>`;
  el.querySelectorAll('canvas[data-gi]').forEach(c=>gIcon(c,c.dataset.gi));
  el.querySelectorAll('[data-gt]').forEach(b=>b.onclick=()=>{gTool=gTool===b.dataset.gt?null:b.dataset.gt;sfx('card');gardenBar()});
  $('gshop').onclick=()=>showShop2('jardim');
  $('ginfo').textContent=gInfo||(gTool?{regar:'Regador na mão: clique num vaso com sede.',colher:'Colher: clique numa planta madura.'}[gTool]||'Semente na mão: clique num vaso vazio.':'Clique num vaso: ele rega quem tem sede e colhe quem está maduro.');
  $('menu').querySelectorAll('.coins').forEach(e=>e.outerHTML=coinsTag());paintCoins();
}
function showGarden(){
  clearInterval(wmapTimer);if(!gardenOpen()){toast('O jardim abre ao vencer a fase 1-4');return}
  const G=META.garden;while(G.pots.length<G.potsN)G.pots.push(null);
  menu(`<div class="mbox wide"><div class="topbar"><button class="btn ghost" data-go="hub">‹ Menu</button><h2>Jardim</h2>${coinsTag()}</div>
    <div class="gscene"><canvas id="gardc" width="${GW}" height="${GH}"></canvas></div>
    <p class="ginfo" id="ginfo"></p><div class="gbar" id="gbar"></div>
    <p class="help">As plantas crescem com o tempo real, mesmo com o jogo fechado. Cada etapa de crescimento precisa de água.</p></div>`);
  const cvs=$('gardc');
  cvs.addEventListener('pointermove',e=>{const i=gSpotAt(e);if(i!==gHover){gHover=i;gInfo=gDescribe(i);$('ginfo').textContent=gInfo||' '}});
  cvs.addEventListener('pointerleave',()=>{gHover=-1;gInfo='';gardenBar()});
  cvs.addEventListener('click',e=>{const i=gSpotAt(e);gAct(i);gInfo=gDescribe(i);$('ginfo').textContent=gInfo});
  gardenBar();clearInterval(gLoop);drawGarden();gLoop=setInterval(()=>{drawGarden();if(gHover>=0&&$('ginfo'))$('ginfo').textContent=gDescribe(gHover)},50);
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
 ['Cada fruto vence uma praga','Romã vence Ódio, Videira vence Inveja, Oliveira vence Discórdia... O dano fica 2,5 vezes maior. Árvores vizinhas se fortalecem.','fruit'],
 ['Lute junto','← → anda, ↑ pula. No ar, ↓ dá um pisão: em cima de uma árvore, solta o poder dela. X golpeia com a ferramenta. Q, E e R põem cerca, espantalho e lama.','gardener'],
 ['Cuidado com as pragas','Encostar nelas tira corações. Sem corações você desmaia e perde maná. Pegue os frutos e as moedas que caem.','hurt'],
 ['Fora das batalhas','Vença fases para ganhar moedas e cartas novas. Na Loja compre ferramentas e sementes. Depois da fase 1-4 abre o Jardim; a Árvore da Vida vem mais tarde.','shop']];
function introArt(cvs,k){const g=cvs.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,96,64);C=g;
  const gr=g.createLinearGradient(0,0,0,64);gr.addColorStop(0,'#3a2a5a');gr.addColorStop(1,'#d08a5a');g.fillStyle=gr;g.fillRect(0,0,96,64);r(0,52,96,12,'#4b2228');r(0,52,96,2,'#5fe08a');
  g.save();
  if(k==='gard'){drawTower('roma',20,52,1);enemyBody({k:'odio',x:62,y:52,t:1});enemyBody({k:'inveja',x:80,y:30,t:1})}
  if(k==='card'){g.drawImage(cardCanvas(mk('videira'),true),30,6,36,50)}
  if(k==='fruit'){drawTower('roma',26,52,1);enemyBody({k:'odio',x:70,y:52,t:1});pxText(g,'x2,5',48,24,'700 10px "Pixelify Sans"','#ffe14a','#000')}
  if(k==='gardener'){const kp=RUN;RUN={char:META.char};drawGardener({face:1,x:40,y:52,vx:0,vy:0,on:true,sq:1,anim:0,slam:false,stun:0,inv:0,faint:0,swing:0});RUN=kp;C=g;drawTower('videira',70,52,1)}
  if(k==='hurt'){[30,42,54].forEach((hx,i)=>disc(hx,22,5,i<2?'#e0284a':'#3a1a24'));enemyBody({k:'gula',x:74,y:52,t:1})}
  if(k==='shop'){g.translate(24,0);g.scale(1.5,1.5);ICONS.talentos();g.setTransform(1,0,0,1,0,0);drawTower('oliveira',78,52,1)}
  g.restore();C=x}
function showIntro(i){
  const[t,txt,art]=INTRO[i],last=i===INTRO.length-1;
  menu(`<div class="mbox"><small class="eyebrow">Como jogar · ${i+1}/${INTRO.length}</small><h2>${t}</h2>
    <div class="introart"><canvas id="introc" width="96" height="64"></canvas></div><p>${txt}</p>
    <div class="dots">${INTRO.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join('')}</div>
    <div class="row">${i?'<button class="btn ghost" id="iprev">‹ Voltar</button>':'<button class="btn ghost" id="iskip">Pular</button>'}<button class="btn" id="inext">${last?'Começar a jogar':'Próximo ›'}</button></div></div>`);
  introArt($('introc'),art);
  $('inext').onclick=()=>last?showHub():showIntro(i+1);
  if($('iprev'))$('iprev').onclick=()=>showIntro(i-1);if($('iskip'))$('iskip').onclick=showHub;
}
showHub();
