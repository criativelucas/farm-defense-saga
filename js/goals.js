// ---------- level objectives: some adventure levels ask for something other than "survive every wave"
const GOALS={
  esteira:{name:'Carroça do semeador',desc:'As sementes chegam numa carroça, de graça. Não há bolsa nem maná.',ref:'Mateus 13:3'},
  ovelhas:{name:'O bom pastor',desc:'Proteja as 3 ovelhas no pasto. Se todas forem pegas, a fase acaba.',ref:'João 10:11'},
  colheita:{name:'Tempo de colheita',desc:'Junte 15 frutos caídos das árvores. As ondas continuam até você conseguir.',ref:'Eclesiastes 3:2'},
  seca:{name:'A seca de Elias',desc:'O maná volta pela metade e não chove. Regue bem e gaste com cuidado.',ref:'1 Reis 17:1'},
  vigilia:{name:'Vigiai',desc:'Aguente 90 segundos de ataque sem parar.',ref:'Mateus 26:41'}};
const GOAL_AT={2:'ovelhas',6:'esteira',10:'colheita',14:'seca',18:'vigilia',22:'colheita'};
LEVELS.forEach(l=>{l.goal=GOAL_AT[l.n]||null});
const HARVEST_GOAL=15,VIGIL_TIME=90;

function goalStart(){const L=RUN.mode==='level'&&!RUN.endless&&!RUN.mini?LEVELS[RUN.level]:null,g=L&&L.goal;S.goal=g||null;if(!g)return;const G=GOALS[g];
  banner('Objetivo · '+G.ref,G.name);toast(G.name,G.desc);
  if(g==='esteira'){S.hand=[null,null,null,null,null];S.draw=[];S.convT=1;RUN.handSize=5;renderHand()}
  if(g==='ovelhas'){const mid=MAP.ww*.45;S.sheep=[0,1,2].map(k=>{const x0=mid+(k-1)*34;return{x:x0,home:x0,hp:6,max:6,t:rnd(0,9),face:1,hurt:0}})}
  if(g==='colheita')S.harvest=0;
  if(g==='seca')S.mana=Math.min(MAXM,S.mana+4);
  if(g==='vigilia'){S.vig=VIGIL_TIME;S.vigT=0}}

// cards for the seed cart: what this player has unlocked, seeds weighted up
function cartCard(){const pool=META.unlocked.filter(k=>CARDS[k]&&CARDS[k].type!=='joio');const seeds=pool.filter(k=>CARDS[k].type==='semente');
  return mk(Math.random()<.75&&seeds.length?rpick(seeds):rpick(pool))}
function goalUpdate(dt){const g=S.goal;if(!g)return;
  if(g==='esteira'){S.mana=MAXM;S.convT-=dt;if(S.convT<=0){S.convT=3.2;const i=S.hand.findIndex(c=>!c);if(i>=0){S.hand[i]=cartCard();S.newIdx=i;renderHand();S.newIdx=-1;sfx('card')}}}
  if(g==='seca')S.rain=0;
  if(g==='ovelhas'){let alive=0;for(const sh of S.sheep){if(sh.hp<=0)continue;alive++;sh.t+=dt;sh.hurt=Math.max(0,sh.hurt-dt);
      const want=sh.home+Math.sin(sh.t*.3)*14;sh.face=want>sh.x?1:-1;sh.x+=clamp(want-sh.x,-6*dt,6*dt);
      for(const e of S.en){const d=EN[e.k];if(d.fly||e.hp<=0||Math.abs(e.x-sh.x)>8)continue;sh.hp-=dt*(d.boss?4:1.5);
        if(sh.hurt<=0){sh.hurt=.6;pop(sh.x,gy(sh.x)-16,'béé!','#ffffff',8);sfx('bleat')}}
      if(sh.hp<=0){burst(sh.x,gy(sh.x)-6,18,['#ffffff','#e8e0d0'],70,200,.7);pop(sh.x,gy(sh.x)-20,'levaram uma ovelha!','#ff9a9a',9);shake(4)}}
    if(!alive&&S.state!=='menu'){S.state='menu';RUN.hp=0;showOver()}}
  if(g==='vigilia'&&S.state==='wave'){S.vig-=dt;S.vigT-=dt;
    if(S.vigT<=0){S.vigT=Math.max(.9,2.6-(VIGIL_TIME-S.vig)/50);const pool=levelPool(RUN.level);spawn(rpick(pool));S.total++}
    if(S.vig<=0){S.vig=0;for(const e of S.en){e.hp=0;deathFx(e)}S.en=[];S.q=[];banner('Vigiai','Você não dormiu');battleWon()}}}
// the wave list must not run out before a harvest or a vigil is over
function goalKeepsWaves(){const g=S.goal;if(g==='colheita'&&S.harvest<HARVEST_GOAL||g==='vigilia'&&S.vig>0){const L=LEVELS[RUN.level],w=WORLDS[L.wi];
  S.waves.push(genWave(w.act,L.l+S.waves.length,'batalha',0,levelPool(L.n)));return true}return false}
function goalHarvest(n){if(S.goal!=='colheita')return;S.harvest+=n;if(S.harvest>=HARVEST_GOAL&&S.state!=='menu'){banner('Tempo de colheita','O celeiro está cheio');battleWon()}}
function goalHud(){const g=S.goal;if(!g)return'';
  if(g==='ovelhas')return'Ovelhas: '+S.sheep.filter(s=>s.hp>0).length+'/3';
  if(g==='colheita')return'Colheita: '+S.harvest+'/'+HARVEST_GOAL+' frutos';
  if(g==='vigilia')return S.state==='wave'?'Vigiai: '+Math.ceil(S.vig)+'s':'Vigiai: chame a onda (Enter)';
  if(g==='esteira')return'Carroça: nova semente em '+Math.max(0,Math.ceil(S.convT))+'s';
  if(g==='seca')return'Seca: maná pela metade, sem chuva';return''}
// fluffy sheep grazing, with a little health bar when hurt
function drawGoal(){if(S.goal!=='ovelhas'||!S.sheep)return;
  for(const sh of S.sheep){if(sh.hp<=0)continue;const y=gy(sh.x),b=Math.abs(Math.sin(sh.t*3))*.8,f=sh.face,X=sh.x,fl=sh.hurt>0&&(S.t*20|0)%2;
    const R=(dx,dy,w,h,c)=>r(f>0?X+dx:X-dx-w,y+dy-b,w,h,fl?'#ff8080':c);
    R(-5,-2,1.5,2,'#2a2a2a');R(-2,-2,1.5,2,'#2a2a2a');R(2,-2,1.5,2,'#2a2a2a');R(4.5,-2,1.5,2,'#2a2a2a');
    R(-6,-8,12,6,'#e8e4dc');R(-7,-7,14,4,'#e8e4dc');R(-5,-9,10,2,'#f8f6f0');R(-4,-8,3,2,'#ffffff');R(-6,-3,12,1,'#c8c0b4');
    R(5,-9,4,5,'#3a3a3a');R(4,-10,3,2,'#e8e4dc');R(7.5,-8,1,1,'#ffffff');R(5,-6,1,1,'#2a2a2a');R(3.5,-8,1.5,2,'#2a2a2a');
    if(sh.hp<sh.max){r(X-5,y-14,10,1.5,'#2a0c14');r(X-5,y-14,10*sh.hp/sh.max,1.5,'#9ff7b8')}}}
