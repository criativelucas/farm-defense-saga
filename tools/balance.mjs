// Balance robot: plays every Adventure level several times with the cards a player would own at that point
// (the starting cards plus every first-win card before it) and prints how often it wins and how much Eden life is left.
// The robot plants seeds on free beds, uses blessings when the screen is crowded, evolves grown trees and swings
// the hoe at the nearest pest: an average player, not a perfect one. Compare levels with each other, not with 100%.
// BOT=fraco plays like a beginner: it thinks every 1.5 s, never blesses and never swings the hoe.
// usage: node tools/balance.mjs [runs per level] [difficulty]     e.g. node tools/balance.mjs 4 normal   ·   BOT=fraco node tools/balance.mjs
import {openGame} from './browser.mjs';

const WEAK=process.env.BOT==='fraco',RUNS=+process.argv[2]||3,DIFF=process.argv[3]||'normal',G=await openGame();
await G.js(`(()=>{Object.assign(META,{intro:1,tut:1,coins:0});META.scenes={1:1,2:1,3:1,4:1,5:1,6:1};Object.keys(EN).forEach(k=>META.seen.e[k]=1);META.dlg={};Object.keys(DIALOG).forEach(k=>META.dlg[k]=1);META.diff=${JSON.stringify(DIFF)};saveMeta();return 1})()`);
const play=(n,run)=>G.js(`(()=>{
  const cards=['videira','mana',...UNLOCK_ORDER.slice(0,${n}).filter(Boolean)];META.unlocked=[...new Set(cards)];META.lastDeck=null;
  startLevel(${n});const seeds=RUN.coll.filter(c=>CARDS[c.k].type==='semente'),rest=RUN.coll.filter(c=>CARDS[c.k].type!=='semente');
  RUN.deck=[...seeds.slice(-6),...rest.slice(-4)].slice(0,levelBag(${n})[1]);startLevelBattle();tutStep=-1;
  let t=0,think=0;const dt=1/30;
  for(let i=0;i<30*600;i++){
    S.dialog=null;if(S.intro)closeFoeIntro();
    if(S.state==='prep'&&t>3)callWave();
    if(S.state!=='prep'&&S.state!=='wave')break;
    think-=dt;if(think<=0){think=${WEAK?1.5:.5};
      const crowd=S.en.filter(e=>e.hp>0).length;
      S.hand.forEach((c,hi)=>{if(!c)return;const I=info(c);if(S.mana<I.cost)return;
        if(I.kinds){const si=MAP.slots.findIndex((s,j)=>!S.tw[j]);if(si>=0)playCard(hi,si)}
        else if(!${WEAK}&&crowd>=4||(c.k==='mana'&&S.mana<4))playCard(hi)});
      S.tw.forEach(tw=>{if(tw&&(tw.lvl||0)>=3&&!tw.branch&&S.mana>=BRANCH_COST+2){S.mana-=BRANCH_COST;tw.branch=RNG()<.5?'a':'b'}});
      const near=S.en.filter(e=>e.hp>0&&!EN[e.k].fly).sort((a,b)=>a.x-b.x)[0];if(near&&!${WEAK}){S.p.x+=Math.sign(near.x-S.p.x)*Math.min(40,Math.abs(near.x-S.p.x));playerAttack()}}
    update(dt);t+=dt}
  return JSON.stringify({id:LEVELS[${n}].id,win:S.state==='victory'&&S.vicWin,hp:Math.max(0,RUN.hp),t:Math.round(t),wave:S.wi,leak:Object.entries(S.leaks||{}).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k,v])=>k+' '+v).join(', '),goal:LEVELS[${n}].goal||''})})()`).then(JSON.parse);

const out=[];
for(let n=0;n<28;n++){const rs=[];for(let k=0;k<RUNS;k++)rs.push(await play(n,k));
  const wins=rs.filter(r=>r.win).length,hp=Math.round(rs.reduce((a,r)=>a+r.hp,0)/RUNS),tm=Math.round(rs.reduce((a,r)=>a+r.t,0)/RUNS);
  const tag=wins<RUNS*.5?'DIFÍCIL':hp>=19&&wins===RUNS?'fácil':'';
  const leak=rs.map(r=>r.leak).filter(Boolean)[0]||'';out.push({id:rs[0].id,wins,hp,tm,goal:rs[0].goal,tag,leak});
  console.log(`${rs[0].id.padEnd(4)} vitórias ${wins}/${RUNS}  vida média ${String(hp).padStart(2)}/20  ${String(tm).padStart(3)}s ${rs[0].goal?'('+rs[0].goal+')':''} ${tag}${leak?'  passaram: '+leak:''}`)}
if(G.errors.length)console.log('erros:',G.errors.slice(0,5).join(' | '));
G.close();
