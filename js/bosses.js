// ---------- boss stages (BSTAGE in content.js): the fifth level of every world. The seed cart brings the cards, a clock runs,
// and each boss has one rule that decides how it can be hurt. When the clock runs out the boss charges the garden in fury.
function bossStageStart(L){const B=BSTAGE[L.wi];
  S.goal='chefe';S.bstage=B;S.bs={t:B.time,escT:9,prevSea:S.seaOpen,stones:[],stoneT:4,hook:null,lamps:[],allLit:0,wor:6,boss:null,done:false};
  S.hand=[null,null,null,null,null];S.draw=[];S.convT=.5;RUN.handSize=5;renderHand();
  if(B.boss==='leviata')S.bs.hook={x:Math.round(MAP.ww*.55)};
  if(B.boss==='sombra')S.bs.lamps=[.28,.5,.72].map(f=>({x:Math.round(MAP.ww*f),lit:0}));
  banner('Fase do chefe · '+B.ref,B.rule);toast(EN[B.boss].name+': '+B.rule,B.tip)}

function bossStageUpdate(dt){const B=S.bstage,Z=S.bs;
  // the seed cart: free cards from this boss's own list, mana always full
  S.mana=MAXM;S.convT-=dt;if(S.convT<=0){S.convT=2.6;const i=S.hand.findIndex(c=>!c);if(i>=0){S.hand[i]=mk(rpick(B.belt));S.newIdx=i;renderHand();S.newIdx=-1;sfx('card')}}
  if(!Z.boss){const e=S.en.find(o=>o.k===B.boss&&o.hp>0);if(e){Z.boss=e;e.hp*=B.hp;e.max*=B.hp}}
  const e=Z.boss;if(S.state!=='wave'||Z.done)return;
  if(e&&e.hp<=0){Z.done=true;for(const o of S.en)if(o!==e&&o.hp>0){o.hp=0;deathFx(o)}S.en=S.en.filter(o=>o.hp>0);S.q=[];banner(EN[B.boss].name,'Derrotado! O jardim está livre');return}
  if(!e)return;
  // the clock
  if(!e.fury){Z.t-=dt;if(Z.t<=0){Z.t=0;e.fury=1;e.ph2=1;banner('O tempo acabou!',EN[B.boss].name+' avança sobre o jardim');flash(.5,'255,40,40');shake(10);sfx('thunder')}}
  // escorts from this world keep coming while the boss lives
  Z.escT-=dt;if(Z.escT<=0){Z.escT=e.ph2?5.5:7.5;const pool=levelPool(BSTAGE.indexOf(B)*4+3);spawn(rpick(pool));S.total++}
  const P=S.p;
  if(B.boss==='golias'){
    // smooth stones from the brook (1 Sm 17:40): walk over one and it flies at Goliath's forehead
    Z.stoneT-=dt;if(Z.stoneT<=0&&Z.stones.length<3){Z.stoneT=8;const x0=clamp(rnd(S.cam+30,Math.min(e.x-50,S.cam+W-40)),20,MAP.ww-20);Z.stones.push({x:x0,t:0});pop(x0,gy(x0)-14,'pedra lisa','#d0d0d8',8)}
    Z.stones=Z.stones.filter(s=>{s.t+=dt;if(P.on&&Math.abs(P.x-s.x)<9){S.pstones++;S.pstT=0;sfx('stone');pop(P.x,P.y-24,'+1 pedra · vai na testa!','#d0d0d8',9);return false}return true});
    if(e.ph2){Z.slam=(Z.slam??5)-dt;if(Z.slam<=0){Z.slam=6;shake(8);S.fx.push({k:'ring',x:e.x,y:e.y-2,r:4,max:80,t:0,c:'#c9a24a'});sfx('slam');
      MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(t&&!(t.ark>0)&&Math.abs(s.x-e.x)<80){t.stun=Math.max(t.stun,2);pop(s.x,s.y-30,'tremeu!','#c9a24a',7)}})}}}
  if(B.boss==='farao'&&MAP.sea){
    // the waters return over Pharaoh's chariots (Ex 14:28)
    if(Z.prevSea&&!S.seaOpen&&e.x>=MAP.sea[0]-6&&e.x<=MAP.sea[1]+6){damage(e,e.max*.3,'mar');e.frz=2;shake(12);flash(.4,'120,200,255');sfx('splash');
      burst(e.x,e.y-20,50,['#bfe8ff','#5ab0ff','#ffffff'],160,300,.9,2);banner('As águas voltaram','O Faraó foi coberto pelo mar')}
    Z.prevSea=S.seaOpen}
  if(B.boss==='bezerro'){
    // the people dance around the calf (Ex 32:19): worshippers heal it while they are close
    Z.wor-=dt;if(Z.wor<=0){Z.wor=e.ph2?6:8;for(let j=0;j<2;j++){const n=spawn('idolatria',e.x+14+j*10);n.y=gy(n.x);S.total++}pop(e.x,e.y-50,'dançam ao redor do ídolo','#ffe36a',8)}
    const near=S.en.filter(o=>o.k==='idolatria'&&o.hp>0&&Math.abs(o.x-e.x)<60).length;if(near&&e.hp<e.max){e.hp=Math.min(e.max,e.hp+e.max*.004*near*dt);if(Math.random()<dt*3)vfx('heal',e.x,ecy(e),{c:'#ffe36a'})}}
  if(B.boss==='leviata'&&Z.hook){e.hooked=Math.max(0,(e.hooked||0)-dt);if(e.hooked>0){e.frz=Math.max(e.frz,.1);e.st=Math.max(e.st,2)}}
  if(B.boss==='sombra'){for(const l of Z.lamps)l.lit=Math.max(0,l.lit-dt);Z.allLit=Math.max(0,Z.allLit-dt);
    if(Z.lamps.every(l=>l.lit>0)&&Z.allLit<=0){Z.allLit=18;damage(e,e.max*.15,'luz');e.x=Math.min(MAP.ww-20,e.x+50);flash(.6,'255,245,200');shake(10);sfx('super');banner('Lâmpada para os meus pés','A Sombra recua diante da luz')}}
}
// how much a hit really hurts the boss under its rule
function bossMod(e,d,src){const k=e.k,tree=!!(src&&CARDS[src]);
  if(k==='serpente'&&tree)return d*.35;
  if(k==='ninrode'&&tree){if(src===e.lk)e.ln=(e.ln||0)+1;else{e.lk=src;e.ln=0}const m=Math.max(.2,Math.pow(.8,e.ln));
    if(e.ln===4&&S.t-(e.lpop||0)>2){e.lpop=S.t;pop(e.x,e.y-EN[k].h-6,'já entendi essa língua!','#ffb060',8)}return d*m}
  const B=S.bstage;if(!B||B.boss!==k)return d;
  if(k==='golias'){if(src==='funda'){e.frz=Math.max(e.frz,1.2);pop(e.x,e.y-EN[k].h-6,'na testa!','#ffffff',10);shake(6);return d*2}return tree?d*.25:d}
  if(k==='farao')return tree?d*.6:d;
  if(k==='bezerro')return src==='sarca'?d*1.6:tree?d*.25:d;
  if(k==='leviata')return e.hooked>0?d*2:tree?d*.25:d*.6;
  if(k==='sombra'){const lit=S.lamps>0||S.bs.lamps.some(l=>l.lit>0&&Math.abs(l.x-e.x)<100);return src==='luz'?d:lit?d*1.5:d*.1}
  return d}
// a stomp near the serpent's head, on the hook, or beside a lamp
function bossStomp(p){const B=S.bstage,Z=S.bs,e=Z&&Z.boss;if(!B)return;
  if(e&&e.hp>0&&e.k==='serpente'){const hx=e.x-EN.serpente.w*.42;if(Math.abs(p.x-hx)<18&&!(e.headDown>0)){pop(hx,p.y-30,'a cabeça está alta: espere o bote','#9ff05a',8)}
    else if(Math.abs(p.x-hx)<18){damage(e,35*(1+.15*atr('for'))*(S.up?S.up.str:1));e.frz=Math.max(e.frz,1);shake(10);flash(.3,'255,255,200');
    pop(hx,p.y-30,'na cabeça!','#ffffff',11);burst(hx,p.y-6,24,['#9ff05a','#ffffff','#2f7a2f'],120,250,.6,2)}}
  if(Z.hook&&Math.abs(p.x-Z.hook.x)<16){if(e&&e.hp>0&&!(e.dive>0)&&Math.abs(e.x-Z.hook.x)<60){e.hooked=5;e.frz=5;e.st=7;sfx('sling');shake(10);flash(.3,'255,230,150');
      pop(Z.hook.x,gy(Z.hook.x)-40,'FISGADO!','#f7c948',12);banner('O anzol','Poderás tirar com anzol o Leviatã?');Z.hook.x=Math.max(70,Math.round(e.x-140))}
    else pop(Z.hook.x,gy(Z.hook.x)-30,e&&e.dive>0?'ele mergulhou: espere':'longe demais do Leviatã','#f7c948',8)}
  for(const l of Z.lamps)if(Math.abs(p.x-l.x)<16&&!l.lit){l.lit=12;sfx('super');pop(l.x,gy(l.x)-40,'lâmpada acesa','#ffe36a',9);S.fx.push({k:'ring',x:l.x,y:gy(l.x)-20,r:2,max:40,t:0,c:'#ffe36a'})}}

function bossHud(){const Z=S.bs,B=S.bstage;if(!Z)return'';const e=Z.boss,m=Math.floor(Z.t/60),s=String(Math.floor(Z.t%60)).padStart(2,'0');
  if(e&&e.fury)return B.rule+' · FÚRIA! derrote antes que chegue';
  return B.rule+' · ⏱ '+m+':'+s+(B.boss==='golias'?' · pedras: '+S.pstones:'')+(B.boss==='sombra'?' · lâmpadas '+Z.lamps.filter(l=>l.lit>0).length+'/3':'')}

// stones in the brook, the golden hook, the lamps on their posts
function drawBossStage(){const Z=S.bs;if(!Z)return;
  for(const s of Z.stones){const y=gy(s.x)-2+Math.round(Math.sin(s.t*4)),f=(S.t*6|0)%2;disc(s.x,y,2.5,'#9a9aa8');r(s.x-1,y-2,2,1,'#e0e0e8');if(f){r(s.x+3,y-5,1,1,'#ffffff');r(s.x-4,y-4,1,1,'#ffffff')}}
  if(Z.hook){const hx=Z.hook.x,gyy=gy(hx),sw=Math.round(Math.sin(S.t*2)*2),hy=gyy-26;for(let y=0;y<hy;y+=2)r(hx+Math.round(sw*y/hy),y,1,1,'#c8b090');
    r(hx+sw-1,hy,3,6,'#f7c948');r(hx+sw-3,hy+5,3,2,'#f7c948');r(hx+sw-3,hy+3,1,2,'#f7c948');r(hx+sw,hy,1,1,'#fff6c0');
    if((S.t*3|0)%2){r(hx-1,gyy-4,3,1,'#f7c948');r(hx,gyy-5,1,3,'#f7c948')}}
  for(const l of Z.lamps){const y=gy(l.x);r(l.x-1,y-24,2,24,'#5a3a24');r(l.x-3,y-27,7,3,'#c9a24a');r(l.x-2,y-30,5,3,'#e0b050');
    if(l.lit>0){const fl=Math.round(Math.sin(S.t*14)*1);r(l.x-1,y-34-fl,3,4,'#ff9a3c');r(l.x,y-35-fl,1,3,'#ffe36a');x.globalAlpha=.18+.05*Math.sin(S.t*6);disc(l.x,y-30,22,'#ffe9a0');x.globalAlpha=1}
    else if((S.t*2|0)%2)r(l.x-1,y-40,3,1,'#ffe36a')}}
// the two new bosses fight wherever they appear (boss stage or endless mode)
function bossAIx(e,dt){
  if(e.k==='serpente'){e.lunge=Math.max(0,(e.lunge||0)-dt);e.headDown=Math.max(0,(e.headDown||0)-dt);e.bt=(e.bt??4)-dt;e.ct=(e.ct??6)-dt;
    // the strike: a quick lunge; whoever stands at the head gets bitten
    if(e.bt<=0){e.bt=e.ph2?3.5:5;e.lunge=.4;e.headDown=2.4;e.x-=18;sfx('hit');const hx=e.x-EN.serpente.w*.42;if(Math.abs(S.p.x-hx)<24&&Math.abs(S.p.y-e.y)<30)hurtPlayer(1,e);pop(hx,e.y-30,'bote!','#9ff05a',8)}
    // coils around the closest tree ahead of it
    if(e.ct<=0){e.ct=e.ph2?6:9;let best=-1,bd=90;MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(t&&t.grow>=1&&!(t.ark>0)&&s.x<e.x&&e.x-s.x<bd){bd=e.x-s.x;best=i}});
      if(best>=0){const t=S.tw[best],s=MAP.slots[best];t.stun=Math.max(t.stun,4);pop(s.x,s.y-34,'enrolada pela serpente!','#9ff05a',8);S.fx.push({k:'zap',x1:e.x-20,y1:e.y-10,x2:s.x,y2:s.y-12,t:0,max:.4})}}}
  if(e.k==='ninrode'){e.st-=dt;e.draw=Math.max(0,(e.draw||0)-dt);
    // the hunter's arrows: at you, and once furious also at the trees
    if(e.st<=0){e.st=e.ph2?2.2:3.2;e.draw=.4;const n=e.ph2?2:1;for(let j=0;j<n;j++)throwStone(e,n===1?1:j*2);
      if(e.ph2){const i=MAP.slots.findIndex((s,j)=>S.tw[j]&&S.tw[j].grow>=1&&s.x<e.x&&e.x-s.x<140&&!(S.tw[j].ark>0));
        if(i>=0){const s=MAP.slots[i];S.tw[i].stun=Math.max(S.tw[i].stun,2);S.fx.push({k:'zap',x1:e.x-10,y1:e.y-40,x2:s.x,y2:s.y-14,t:0,max:.3});pop(s.x,s.y-30,'flechada!','#ffb060',7)}}}}}
