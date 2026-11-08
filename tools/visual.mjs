// Visual check: photographs every main screen and compares each with its saved picture, so a layout that breaks
// (a label out of place, a panel stretched, a screen gone black) shows up even when no error is thrown.
// Pictures are compared shrunk to 96x54, where moving clouds and particles barely count but a misplaced block does.
// usage: node tools/visual.mjs            compare with tools/visual/*.png (fails when a screen changed too much)
//        node tools/visual.mjs --update   save the current screens as the new reference
import fs from 'node:fs';import path from 'node:path';import {openGame,sleep,ROOT} from './browser.mjs';

const UPDATE=process.argv.includes('--update'),DIR=path.join(ROOT,'tools','visual'),OUT=path.join(DIR,'out'),LIMIT=3;
const P="Object.assign(META,{intro:1,tut:1,coins:5000});LEVELS.slice(0,10).forEach(l=>META.done[l.id]=1);META.scenes={1:1,2:1,3:1,4:1,5:1,6:1};Object.keys(EN).forEach(k=>META.seen.e[k]=1);";
const SCREENS=[['hub','showHub()'],['mapa','showWorld(1)'],['quitanda',"showShop2('ferramentas')"],['tenda','showPacks()'],['codex-cartas',"showCodex('cartas')"],
  ['codex-vizinhas',"showCodex('vizinhas')"],['codex-obras',"showCodex('inimigos')"],['codex-reliquias',"showCodex('reliquias')"],['lavrador','showLavrador()'],
  ['missoes','showMissions()'],['conquistas','showAchs()'],['ajustes','showConfig()'],['estufa','showGarden()'],['escolha','startLevel(2)'],['cena','showScene(6,()=>{})']];
fs.mkdirSync(DIR,{recursive:true});fs.mkdirSync(OUT,{recursive:true});
const G=await openGame();await G.js(`(()=>{${P}return 1})()`);let bad=0;
for(const[name,code]of SCREENS){
  await G.js(`(async()=>{try{document.getElementById('packov')&&document.getElementById('packov').remove()}catch(e){}${code};await new Promise(r=>setTimeout(r,900));document.getAnimations().forEach(a=>{try{a.finish()}catch(e){}});return 1})()`);await sleep(150);
  const full=await G.shot(),ref=path.join(DIR,name+'.png'),old=fs.existsSync(ref)?'data:image/png;base64,'+fs.readFileSync(ref).toString('base64'):null;
  // shrink in the page, and measure the mean difference against the reference (0 to 255)
  const r=JSON.parse(await G.js(`(async()=>{const load=s=>new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.src=s});const small=im=>{const c=document.createElement('canvas');c.width=96;c.height=54;const g=c.getContext('2d');g.imageSmoothingEnabled=true;g.drawImage(im,0,0,96,54);return c};
    const cur=small(await load('data:image/png;base64,${full}'));let diff=null;
    if(${JSON.stringify(old)}){const a=cur.getContext('2d').getImageData(0,0,96,54).data,b=small(await load(${JSON.stringify(old)})).getContext('2d').getImageData(0,0,96,54).data;let s=0;for(let i=0;i<a.length;i+=4)s+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]);diff=s/(a.length/4*3)}
    return JSON.stringify({diff,png:cur.toDataURL().split(',')[1]})})()`));
  if(UPDATE||r.diff===null){fs.writeFileSync(ref,Buffer.from(r.png,'base64'));console.log('saved  ',name);continue}
  const ok=r.diff<=LIMIT;if(!ok){bad++;fs.writeFileSync(path.join(OUT,name+'.png'),Buffer.from(full,'base64'))}
  console.log((ok?'ok     ':'CHANGED')+' '+name.padEnd(16)+' diferença '+r.diff.toFixed(1)+(ok?'':' (foto atual em tools/visual/out/)'))}
G.errors.forEach(e=>console.log('  erro: '+String(e).split('\n')[0]));
G.close();process.exit(bad||G.errors.length?1:0);
