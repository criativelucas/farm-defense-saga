// Performance check on a slow phone: the CPU is slowed down (6x by default) and we measure frames in two battles,
// the first drawing of every card, a pack opening and the hub.
// usage: node tools/perf.mjs [slowdown]
import {openGame,sleep} from './browser.mjs';

const RATE=+process.argv[2]||6,G=await openGame();
await G.js(`(()=>{Object.assign(META,{intro:1,tut:1,coins:9999});LEVELS.slice(0,12).forEach(l=>META.done[l.id]=1);META.scenes={1:1,2:1,3:1,4:1,5:1,6:1};Object.keys(EN).forEach(k=>META.seen.e[k]=1);return 1})()`);
await G.send('Emulation.setCPUThrottlingRate',{rate:RATE});
// frame times over a few seconds of real animation frames
const frames=sec=>G.js(`new Promise(res=>{const t=[];let last=performance.now();const end=last+${sec*1000};const f=now=>{t.push(now-last);last=now;if(now<end)requestAnimationFrame(f);else{t.sort((a,b)=>a-b);res(JSON.stringify({fps:Math.round(1000/(t.reduce((a,b)=>a+b,0)/t.length)),p95:Math.round(t[Math.floor(t.length*.95)]),worst:Math.round(t[t.length-1])}))}};requestAnimationFrame(f)})`).then(JSON.parse);
const rows=[],cost=[];
const battle=async(n,label)=>{await G.js(`(()=>{hideMenu();startLevel(${n});startLevelBattle();S.dialog=null;S.intro=null;tutStep=-1;MAP.slots.slice(0,8).forEach((s,i)=>{plantAt(i,[['videira','roma','sarca','oliveira'][i%4]],false,0);Object.assign(S.tw[i],{grow:1})});
    for(let i=0;i<14;i++)spawn(['odio','inveja','gula','ira'][i%4],MAP.ww-20-i*14);S.state='wave';S.q=[];return 1})()`);await sleep(800);rows.push([label,await frames(4)]);
  cost.push([label,await G.js(`(()=>{const t0=performance.now();for(let i=0;i<30;i++){update(1/60);draw()}return Math.round((performance.now()-t0)/30*10)/10})()`)])};
await G.js(`(()=>{showHub();return 1})()`);await sleep(800);rows.push(['armazém (menu)',await frames(3)]);
await battle(0,'batalha no Éden, 8 árvores e 14 pragas');
await battle(16,'batalha em Babel, 8 árvores e 14 pragas');
const cards=await G.js(`(()=>{CARD_CACHE.clear();const t0=performance.now();Object.keys(CARDS).forEach(k=>{cardCanvas(mk(k));cardCanvas(mk(k),true)});const t1=performance.now();Object.keys(CARDS).forEach(k=>cardCanvas(mk(k)));return JSON.stringify({first:Math.round(t1-t0),again:Math.round(performance.now()-t1),n:Object.keys(CARDS).length})})()`).then(JSON.parse);
const pack=await G.js(`(async()=>{showPacks();const t0=performance.now();openPack('arca',()=>{});const t1=performance.now();document.querySelector('.ppack').click();await new Promise(r=>setTimeout(r,1300));return JSON.stringify({open:Math.round(t1-t0)})})()`).then(JSON.parse);
rows.push(['abertura de pacote (animação)',await frames(3)]);
console.log(`\nCPU ${RATE}x mais lenta (celular fraco)\n`);
for(const[l,r]of rows)console.log(`${l.padEnd(42)} ${String(r.fps).padStart(3)} fps · 95% dos quadros em até ${r.p95} ms · pior ${r.worst} ms`);
for(const[l,ms]of cost)console.log(('trabalho por quadro: '+l.split(',')[0]).padEnd(42)+` ${ms} ms (limite para 60 fps: 16,7 ms)`);
console.log(('desenhar as '+cards.n*2+' cartas pela 1ª vez').padEnd(42)+` ${cards.first} ms (depois, do cache: ${cards.again} ms)`);
console.log('montar a tela de abertura de pacote'.padEnd(42)+` ${pack.open} ms`);
G.errors.forEach(e=>console.log('  erro: '+String(e).split('\n')[0]));
G.close();
