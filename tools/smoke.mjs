// Smoke test: opens the game in headless Chrome and visits every screen, plus a battle in each world.
// Fails (exit 1) if any error is thrown, if the game loop stops, or if the title scene renders black.
// Runs three times: a brand-new player, a player with progress, and an embed where gamepad access throws (like the artifact).
// usage: node tools/smoke.mjs        (needs Google Chrome; serves the project itself)
import {spawn} from 'node:child_process';import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const CHROME=process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.mp3':'audio/mpeg','.wav':'audio/wav','.json':'application/json','.webmanifest':'application/manifest+json'};
const server=http.createServer((q,res)=>{const f=path.join(ROOT,decodeURIComponent(new URL(q.url,'http://x').pathname));
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end()}
  res.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res)}).listen(0);
const PORT=server.address().port,URL0=`http://127.0.0.1:${PORT}/jardim-do-fruto.html`,DBG=9400+(process.pid%400);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const prof=fs.mkdtempSync(path.join(os.tmpdir(),'fds-smoke-'));
const chrome=spawn(CHROME,['--headless=new',`--remote-debugging-port=${DBG}`,`--user-data-dir=${prof}`,'--window-size=1280,720','--mute-audio','--no-first-run','--autoplay-policy=no-user-gesture-required','about:blank'],{stdio:'ignore'});
let targets=[];for(let i=0;i<60&&!targets.length;i++){try{targets=(await (await fetch(`http://127.0.0.1:${DBG}/json/list`)).json()).filter(t=>t.type==='page')}catch(e){}await sleep(200)}
const ws=new WebSocket(targets[0].webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const wait=new Map(),errors=[];
ws.onmessage=ev=>{const m=JSON.parse(ev.data);if(m.id&&wait.has(m.id)){wait.get(m.id)(m);wait.delete(m.id);return}
  if(m.method==='Runtime.exceptionThrown')errors.push((m.params.exceptionDetails.exception||{}).description||m.params.exceptionDetails.text);
  if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args.map(a=>a.description||a.value).join(' '))};
const send=(method,params={})=>new Promise(r=>{const i=++id;wait.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
const js=async e=>{const r=await send('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true});const x=r.result||{};if(x.exceptionDetails)errors.push('eval: '+((x.exceptionDetails.exception||{}).description||x.exceptionDetails.text));return x.result&&x.result.value};
await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});

const settle=`await new Promise(r=>setTimeout(r,250));document.getAnimations().forEach(a=>{try{a.finish()}catch(e){}});`;
const checks=[];const check=(name,ok,detail='')=>{checks.push([name,ok,detail]);console.log((ok?'ok   ':'FAIL ')+name+(detail?' — '+detail:''))};
async function load(fresh,blockPad){
  const scr=blockPad?await send('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(navigator,'getGamepads',{value:()=>{throw new DOMException('blocked','SecurityError')}})"}):null;
  await send('Page.navigate',{url:URL0});await sleep(2200);
  if(fresh)await js(`localStorage.clear();location.reload();1`),await sleep(2200);
  if(scr)await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:scr.result.identifier});}
// the loop must be running and the scene must not be a black screen
async function loopAndScene(label){
  const t0=await js('S.t');await sleep(600);const t1=await js('S.t');check(label+': loop running',t1>t0,`S.t ${t0?.toFixed?.(2)} → ${t1?.toFixed?.(2)}`);
  const lum=await js(`(()=>{const c=document.getElementById('c'),g=c.getContext('2d'),d=g.getImageData(0,0,c.width,c.height/2).data;let s=0;for(let i=0;i<d.length;i+=40)s+=d[i]+d[i+1]+d[i+2];return s/(d.length/40)/3})()`);
  check(label+': scene not black',lum>25,'mean brightness '+Math.round(lum))}
async function everyScreen(label){
  const steps=[
    ['hub',`showHub()`],['world',`for(let i=0;i<WORLDS.length;i++)showWorld(i)`],['shop pages',`showShop2('ferramentas');for(let i=0;i<8;i++){shopPage=i;showShop2()}`],
    ['garden',`META.done['1-4']=1;showGarden()`],['codex tabs',`['caminho','cartas','vizinhas','inimigos','reliquias','personagens'].forEach(t=>showCodex(t))`],
    ['lavrador',`showLavrador()`],['missions',`showMissions()`],['achievements',`showAchs()`],['config',`showConfig()`],['jornada',`showJornada()`],
    ['intro',`for(let i=0;i<INTRO.length;i++)showIntro(i)`],['choose seeds',`startLevel(0)`],
    ['win screen',`startLevelBattle();S.kills=9;levelWon()`],['lose screen',`startLevel(1);startLevelBattle();levelLost()`],
    ['endless',`META.done['1-4']=1;startEndless(0);startLevelBattle()`],['tree of life',`META.garden.treeSeed=1;showTree()`]];
  for(const[n,code]of steps){const before=errors.length;await js(`(async()=>{${code};${settle}return 1})()`);check(label+': '+n,errors.length===before,errors.slice(before).join(' | ').slice(0,200))}}
// a short battle in every world: plant, call the wave, let it run, draw frames
async function battles(label){
  for(let w=0;w<6;w++){const before=errors.length;
    const r=await js(`(async()=>{const n=${w}*4+${w%2?1:0};startLevel(n);RUN.coll=['videira','roma','oliveira','sarca'].map(k=>mk(k));RUN.deck=[...RUN.coll];startLevelBattle();
      S.dialog=null;S.intro=null;tutStep=-1;S.mana=MAXM;const slots=MAP.slots.map((s,i)=>i).slice(0,4);slots.forEach((si,k)=>{const hi=S.hand.findIndex(c=>c&&info(c).kinds);if(hi>=0){S.mana=MAXM;playCard(hi,si)}});
      callWave();let frames=0;for(let i=0;i<900;i++){if(S.intro)closeFoeIntro();if(S.dialog){S.dialog=null}if(S.state==='prep')startWave();if(S.state!=='wave')break;update(.033);updFx(.033);if(i%15===0){draw();frames++}}
      return MAPID+' '+S.state+' wave '+S.wi+' frames '+frames})()`);
    check(label+': battle '+(r||'?'),errors.length===before,errors.slice(before).join(' | ').slice(0,200))}}

// each special objective: start it, play a while, and check its own state moves the right way
async function goals(label){
  for(const n of [2,6,10,14,18]){const before=errors.length;
    const r=await js(`(async()=>{startLevel(${n});RUN.coll=['videira','roma','oliveira'].map(k=>mk(k));RUN.deck=[...RUN.coll];startLevelBattle();S.dialog=null;tutStep=-1;
      const g=S.goal,start={hand:S.hand.filter(Boolean).length,vig:S.vig};
      for(let i=0;i<300;i++){if(S.intro)closeFoeIntro();S.dialog=null;if(S.state==='prep')callWave();if(S.state!=='wave')break;
        if(g==='colheita'&&i===50)S.fruitDrops.push({x:S.p.x,y:S.p.y-6,vx:0,vy:0,t:1,k:'roma',life:8});update(.033);updFx(.033);if(i%30===0)draw()}
      const ok={esteira:S.hand.filter(Boolean).length>start.hand,ovelhas:Array.isArray(S.sheep)&&S.sheep.length===3,colheita:S.harvest>=1,seca:S.goal==='seca'&&S.rain===0,vigilia:S.vig<start.vig}[g];
      return g+':'+(ok?'ok':'falhou')})()`);
    check(label+': objetivo '+r,errors.length===before&&/:ok$/.test(r||''),errors.slice(before).join(' | ').slice(0,200))}}

// every mini-game: the menu, the fox game for a few seconds, and each battle twist with its own check
async function minis(label){let before=errors.length;
  await js(`(async()=>{['1-1','1-2','1-3','1-4','2-1','2-2','2-3','2-4','3-1','3-2'].forEach(i=>META.done[i]=1);showMinis();${settle}showFoxes();await new Promise(r=>setTimeout(r,1500));return 1})()`);
  check(label+': minijogos menu + raposinhas',errors.length===before,errors.slice(before).join(' | ').slice(0,200));
  for(const k of ['chuva','escuro','funda','ultima','voltas']){before=errors.length;
    const r=await js(`(async()=>{startMini('${k}');S.dialog=null;tutStep=-1;const m0=S.mana;let shot=0;
      for(let i=0;i<300;i++){if(S.intro)closeFoeIntro();S.dialog=null;if(S.state==='prep')callWave();if(S.state!=='wave')break;
        if('${k}'==='funda'&&i%20===0){S.p.atkCD=0;playerAttack();shot=Math.max(shot,S.proj.length)}update(.033);updFx(.033);if(i%30===0)draw()}
      const ok={chuva:Array.isArray(S.rcards),escuro:S.mini==='escuro'&&typeof darkVisible(S.en[0]||{x:0})==='boolean',funda:shot>0&&S.hand.length===0,ultima:S.mini==='ultima',voltas:S.voltT<80}['${k}'];
      miniOver(true);${settle}return '${k}:'+(ok?'ok':'falhou')})()`);
    check(label+': minijogo '+r,errors.length===before&&/:ok$/.test(r||''),errors.slice(before).join(' | ').slice(0,200))}}

// recorded audio: effects decode, the title track plays, a world track takes over and its drums come in during a wave
async function audio(label){const before=errors.length;
  const r=await js(`(async()=>{initAudio();const w=ms=>new Promise(x=>setTimeout(x,ms));for(let i=0;i<40&&Object.keys(AUD.sfx).length<AUD_SFX.length;i++)await w(150);
    const sfxOk=Object.keys(AUD.sfx).length===AUD_SFX.length;MUS.mode='calm';MUS.scene='titulo';for(let i=0;i<60&&!(AUD.cur&&AUD.cur.k==='titulo');i++){musicTick();await w(100)}
    const title=AUD.cur&&AUD.cur.k==='titulo';MUS.scene=null;MUS.world='jerico';MUS.mode='wave';for(let i=0;i<60&&!(AUD.cur&&AUD.cur.k==='jerico'&&AUD.cur.pg.gain.value>.5);i++){musicTick();await w(100)}
    const world=AUD.cur&&AUD.cur.k==='jerico',drums=world&&AUD.cur.pg.gain.value>.5;sfx('bleat');MUS.mode='calm';
    return [AUD.mode,sfxOk?'sfx':'sem-sfx',title?'titulo':'sem-titulo',world?'mundo':'sem-mundo',drums?'tambores':'sem-tambores'].join(',')})()`);
  check(label+': áudio '+r,errors.length===before&&r==='files,sfx,titulo,mundo,tambores',errors.slice(before).join(' | ').slice(0,200))}

console.log('— new player');await load(true,false);await loopAndScene('new');
console.log('— player with progress');await js(`Object.assign(META,{intro:1,tut:1,coins:5000});['1-1','1-2','1-3','1-4','2-1','2-4'].forEach(i=>META.done[i]=1);saveMeta();1`);await everyScreen('progress');await battles('progress');await goals('progress');await minis('progress');await audio('progress');
console.log('— embed with gamepad blocked');await load(false,true);await loopAndScene('blocked-pad');
const fails=checks.filter(c=>!c[1]);console.log(`\n${checks.length-fails.length}/${checks.length} checks passed`+(errors.length?`; ${errors.length} error(s) logged:`:''));
errors.forEach(e=>console.log('  · '+String(e).split('\n').slice(0,3).join(' / ')));
ws.close();chrome.kill();server.close();try{fs.rmSync(prof,{recursive:true,force:true})}catch(e){}
process.exit(fails.length||errors.length?1:0);
