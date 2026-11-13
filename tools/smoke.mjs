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
    ['garden',`META.done['1-4']=1;showGarden()`],['codex tabs',`['cartas','vizinhas','inimigos','reliquias','personagens'].forEach(t=>showCodex(t))`],
    ['lavrador',`showLavrador()`],['missions',`showMissions()`],['achievements',`showAchs()`],['config',`showConfig()`],['jornada',`showJornada()`],
    ['intro',`for(let i=0;i<INTRO.length;i++)showIntro(i)`],['choose seeds',`startLevel(0)`],
    ['win screen',`startLevelBattle();S.kills=9;levelWon()`],['lose screen',`startLevel(1);startLevelBattle();levelLost()`],
    ['endless',`META.done['1-4']=1;startEndless(0);startLevelBattle()`],
    ['new blessings',`startLevel(0);startLevelBattle();S.dialog=null;S.intro=null;['vento','uncao','nuvem','estrela'].forEach(k=>blessing(k));for(let i=0;i<30;i++)update(1/60)`],
    ['tent and chooser',`META.gifts=1;showPacks();startLevel(6);document.getElementById('cauto').click();document.querySelector('[data-filt=bencao]').click()`],
    ['story scene',`showScene(6,()=>{});await new Promise(r=>setTimeout(r,600));document.getElementById('csline').click();document.getElementById('csskip').click();META.scenes={1:1,2:1,3:1,4:1,5:1,6:1}`],
    ['shadow boss',`META.scenes={1:1,2:1,3:1,4:1,5:1,6:1};startLevel(27);startLevelBattle();S.dialog=null;S.intro=null;const e=spawn('sombra',300);e.hp=e.max*.4;S.state='wave';for(let i=0;i<300;i++){if(S.intro)closeFoeIntro();update(1/30)}draw()`],
    ['pack opening',`META.coins+=2000;showPacks();buyItem('p:arca');openPack('arca',()=>showShop2());document.querySelector('.ppack').click();await new Promise(r=>setTimeout(r,1200));document.getElementById('pall').click();await new Promise(r=>setTimeout(r,4800));document.getElementById('pclose').click()`],['tree of life',`META.garden.treeSeed=1;showTree()`]];
  for(const[n,code]of steps){const before=errors.length;await js(`(async()=>{${code};${settle}return 1})()`);check(label+': '+n,errors.length===before,errors.slice(before).join(' | ').slice(0,200))}}
// every farmer differs, sums 15 points, and the battle uses those numbers
async function farmers(label){
  const r=await js(`(()=>{const keep=META.char,out=[];for(const k of Object.keys(CHARS)){META.char=k;startLevel(0);startLevelBattle();out.push([k,(CHAR_AT[k]||[]).join(""),(CHAR_AT[k]||[]).reduce((a,b)=>a+b,0),S.p.maxhp-3-((META.upg.hearts||0)+(META.upg.treeHearts||0)+tl("hearts")),atr("vida")])}META.char=keep;hideMenu();return out})()`);
  const bad=(r||[]).filter(([k,s,sum,hp,v])=>sum!==15||hp!==v);
  check(label+": farmer attributes",r&&r.length>=8&&!bad.length&&new Set(r.map(x=>x[1])).size===r.length,bad.map(x=>x.join(" ")).join(", ")||(r||[]).map(x=>x[0]+" "+x[1]).join(" · "))}
// packs keep their guaranteed rarity, and every card they give lands somewhere: new, a copy, a level or coins
async function packs(label){
  const r=await js(`(()=>{let bad=0;for(let i=0;i<300;i++){const a=rollPack('arca'),b=rollPack('bencao'),s=rollPack('semeador');if(a.length!==5||RAR_ORDER.indexOf(a[4].rk)<2||RAR_ORDER.indexOf(b[4].rk)<1||s.length!==4)bad++}
    const st=[...Array(12)].map(()=>grantCard({k:'figueira',rk:'rara',foil:false}).st);return JSON.stringify({bad,st:[...new Set(st)],lv:cardLv('figueira')})})()`);
  const o=JSON.parse(r||'{}');check(label+': packs',o.bad===0&&o.st&&o.st.every(s=>['nova','copia','nivel','moedas'].includes(s))&&o.lv>=1,r)}
// each newer work of the flesh does its trick
async function pests(label){
  const r=await js(`(()=>{Object.keys(EN).forEach(k=>META.seen.e[k]=1);startLevel(0);startLevelBattle();S.dialog=null;S.intro=null;tutStep=-1;S.state='wave';S.q=[];S.en=[];const o={};
    const T=(k,x)=>{const e=spawn(k,x??300);return e};
    let e=T('soberba');damage(e,5,'videira');o.armor=e.armor>0&&e.hp===e.max;damage(e,99,'videira');o.crownOff=!!e.humbled||e.hp<=0;
    e=T('vaidade');damage(e,5,'videira');damage(e,5,'videira');damage(e,5,'videira');o.mirror=e.hp===e.max&&e.mirror===0;
    e=T('mentira',500);o.hidden=e.dive>0&&!nearest(500,ecy(e),200);S.p.x=500;update(1/60);o.revealed=!(e.dive>0);S.p.x=60;
    e=T('amargura',600);o.buried=e.dive>0;e.x=MAP.ww*.4;update(1/60);o.surfaced=!(e.dive>0);
    e=T('avareza',300);S.drops.push({x:e.x,y:e.y,vx:0,vy:0,v:1,t:1,g:0,coin:1});update(1/60);o.greed=(e.loot||0)>0;
    e=T('murmuracao',300);e.mt=0;update(1/60);o.summon=S.en.some(x=>x.k==='murmurinho');
    e=T('preguica',300);e.nt=0;update(1/60);const h=e.hp;damage(e,2,'videira');o.nap=e.napT>0&&h-e.hp>=4*0.99*Math.min(1,1);
    MAP.slots.forEach((s,i)=>{if(!S.tw[i])plantAt(i,['videira'],false,0);S.tw[i].grow=1});
    const s=MAP.slots[3];e=T('calunia',s.x+40);e.y=gy(e.x);e.ct=0;update(1/60);o.spit=S.tw[3].stun>0;
    e=T('medo',s.x+10);e.ft=0;S.tw.forEach(t=>t&&(t.stun=0));update(1/60);o.fear=S.tw[3].stun>0;
    e=T('rebeldia',300);e.jt=0;update(1/60);o.vault=e.vault>0;
    for(let i=0;i<120;i++)update(1/60);draw();return JSON.stringify(o)})()`);
  const o=JSON.parse(r||'{}'),bad=Object.entries(o).filter(([,v])=>!v).map(([k])=>k);check(label+': new pests',Object.keys(o).length===13&&!bad.length,bad.join(', ')||r)}
// the eight newer cards do what they say
async function newCards(label){
  const r=await js(`(()=>{Object.keys(EN).forEach(k=>META.seen.e[k]=1);startLevel(0);startLevelBattle();S.dialog=null;S.intro=null;tutStep=-1;S.state='wave';S.q=[];S.en=[];const o={};
    let m=spawn('mentira',400),s=spawn('soberba',300),v=spawn('vaidade',320),a=spawn('amargura',600);blessing('luz');o.luz=!(m.dive>0)&&!(a.dive>0)&&!v.mirror&&!s.armor;
    plantAt(0,['videira'],false,0);S.tw[0].grow=1;S.tw[0].stun=3;S.tw[0].joio=true;blessing('paz');o.paz=S.tw[0].stun===0&&!S.tw[0].joio&&S.tw[0].ark>0;
    S.en=[];const f=S.fences.length;blessing('pedra');o.pedra=S.fences.length===f+1&&S.fences[f].stone&&S.fences[f].hp===90;
    blessing('fogo');const e=spawn('odio',S.fire.x);const h=e.hp;for(let i=0;i<30;i++)update(1/60);o.fogo=e.hp<h;
    S.mana=0;blessing('fermento');const m0=S.mana;update(.5);o.fermento=S.leaven>0&&S.mana-m0>.6;
    S.en=[];const w=spawn('odio',60),w2=spawn('ira',70);blessing('ovelha');o.ovelha=w.x>MAP.ww-60&&w2.x>MAP.ww-60;
    S.en=[];const sl=MAP.slots[2];plantAt(2,['hissopo'],false,0);S.tw[2].grow=1;S.tw[2].cd={};const hm=spawn('mentira',sl.x+20);hm.y=gy(hm.x);for(let i=0;i<60;i++)update(1/60);o.hissopo=!(hm.dive>0);
    S.en=[];const sc=MAP.slots[4];plantAt(4,['cedro'],false,0);S.tw[4].grow=1;S.tw[4].cd={};const c1=spawn('gula',sc.x+40),c2=spawn('gula',sc.x+90);const h1=c1.hp,h2=c2.hp;for(let i=0;i<60;i++)update(1/60);o.cedro=c1.hp<h1&&c2.hp<h2;
    draw();Object.keys(CARDS).forEach(k=>cardCanvas(mk(k)));return JSON.stringify(o)})()`);
  const o=JSON.parse(r||'{}'),bad=Object.entries(o).filter(([,v])=>!v).map(([k])=>k);check(label+': new cards',Object.keys(o).length===8&&!bad.length,bad.join(', ')||r)}
// the expansion: ten more pests, twenty cards, final evolutions and named fusions
async function expansion(label){
  const r=await js(`(()=>{Object.keys(EN).forEach(k=>META.seen.e[k]=1);startLevel(0);startLevelBattle();S.dialog=null;S.intro=null;tutStep=-1;S.state='wave';S.q=[];S.en=[];
    const o={},T=(k,x)=>spawn(k,x??300),step=n=>{for(let i=0;i<n;i++)update(1/60)},si=MAP.slots.findIndex(s=>Math.abs(s.y-gy(s.x))<2),s=MAP.slots[si],at=k=>{const e=T(k,s.x);e.y=gy(e.x);return e};
    const grove=()=>{S.tw=S.tw.map(()=>null);MAP.slots.forEach((q,i)=>{plantAt(i,['videira'],false,0);S.tw[i].grow=1})};grove();
    // pests
    let e=at('idolatria');step(1);o.seduce=S.tw[si].seduced;S.en=[];S.tw[si].seduced=false;plantAt(si,['acacia'],false,0);S.tw[si].grow=1;e=at('idolatria');step(1);o.acaciaGuard=!S.tw[si].seduced;
    S.en=[];grove();let a=T('inimizade',300),b=T('inimizade',320);b.hp=b.max*.3;damage(a,999);o.grudge=b.rage&&b.hp>b.max*.5;
    S.en=[];e=T('hipocrisia');e.masked=2;let h=e.hp;damage(e,3,'videira');o.mask=e.hp>=h;damage(e,1);o.unmask=!(e.masked>0);
    S.en=[];const nf=S.fences.length;S.fences.push({x:250,y:gy(250),hp:30,max:30});e=T('violencia',256);step(40);o.smash=S.fences.length===nf;
    S.en=[];S.tw.forEach(t=>t&&(t.stun=0));e=at('violencia');step(1);o.smashTree=S.tw[si].stun>0;
    S.en=[];S.mana=10;e=T('cobica',S.cam+100);e.drT=0;step(1);o.drain=S.mana<10&&e.stolen>0;damage(e,999);o.giveBack=S.mana>=9.9;
    S.en=[];S.tw.forEach(t=>t&&(t.stun=0));e=T('blasfemia',s.x);e.cuT=0;step(1);o.curse=S.tw.some(t=>t&&t.stun>0);
    S.en=[];e=T('impaciencia');e.dsT=0;step(1);o.dash=e.dsh>0;
    S.en=[];e=T('dureza',S.cam+120);o.armored=e.armor>0;step(1);let x0=e.x;e.x+=30;e.slow=5;e.frz=5;step(1);o.stone=e.x<=x0&&e.frz<=0&&e.slow<=0;
    let a0=e.armor;damage(e,2,'nogueira');o.nut=a0-e.armor>5.9;
    S.en=[];S.tw.forEach(t=>t&&(t.stun=0));const tv=S.tw[si];tv.cd.videira=1;step(1);const d0=1-tv.cd.videira;at('incredulidade');tv.cd.videira=1;step(1);o.doubt=1-tv.cd.videira<d0*.75;
    S.en=[];e=T('engano');damage(e,1,'videira');o.decoy=S.en.filter(x=>x.k==='ilusao').length===2;
    // blessings and parables
    S.en=[];S.tw.forEach(t=>t&&(t.water=0));blessing('orvalho');o.orvalho=S.tw.every(t=>!t||t.water>=1);
    e=T('heresia');blessing('sal');o.sal=S.salt>0&&e.hp<e.max;
    blessing('escudo');h=S.p.hp;S.p.inv=0;hurtPlayer(1);o.escudo=S.p.hp===h;
    S.en=[];blessing('espada');S.p.atkCD=0;S.p.stun=0;S.p.face=1;e=T('gula',S.p.x+30);e.y=gy(e.x);playerAttack();o.espada=e.hp<e.max;
    S.hand=[mk('jubileu'),mk('mana'),mk('mana'),mk('mana')];S.draw=[mk('roma'),mk('roma'),mk('roma')];blessing('jubileu');o.jubileu=S.hand[0].k==='jubileu'&&S.hand.slice(1).every(c=>c.k==='roma');
    S.en=[];const L=[T('gula',S.cam+100),T('odio',S.cam+150)];blessing('linguas');o.linguas=L.every(x=>x.hp<x.max);
    S.en=[];blessing('arcoiris');e=T('odio',LIFE_X+1);e.x=LIFE_X-1;h=RUN.hp;step(1);o.arcoiris=RUN.hp===h&&e.x>MAP.ww-40;
    const nd=S.fruitDrops.length;blessing('codornizes');o.codornizes=S.fruitDrops.length>=nd+8;
    S.en=[];blessing('harpa');RUN.hp=RUN.maxhp-2;h=RUN.hp;e=T('odio');damage(e,999);o.harpa=RUN.hp===h+1;
    S.hand=[mk('tesouro'),mk('mana'),mk('mana'),mk('mana')];const tc=S.hand[0];S.mana=5;playCard(0);o.tesouro=S.mana>=11.9&&!S.draw.includes(tc);
    S.en=[];S.p.face=1;e=T('odio',S.p.x+30);blessing('rede');o.rede=e.frz>2;
    const m0=tmult(S.tw[0]);blessing('virgens');o.virgens=tmult(S.tw[0])>m0*1.29;
    S.p.x=400;S.p.hp=1;blessing('prodigo');o.prodigo=S.p.x===40&&S.p.hp===S.p.maxhp;
    S.tw[0].lvl=0;blessing('vinha');o.vinha=S.tw[0].lvl===2;S.lamps=0;S.shieldT=0;S.swordT=0;S.rainbow=0;S.harp=0;S.salt=0;
    // the six new trees shoot, and their stomp power runs
    for(const k of['macieira','sicomoro','salgueiro','acacia','murta','nogueira']){S.en=[];S.tw=S.tw.map(()=>null);plantAt(si,[k],false,0);const t=S.tw[si];t.grow=1;t.cd={};
      e=T(k==='sicomoro'?'inveja':'gula',s.x+15);if(k!=='sicomoro')e.y=gy(e.x);h=e.hp;step(90);o['tree_'+k]=e.hp<h;superTower(t,s)}
    // the final evolution from the tree sheet, then every evolution and fusion power once
    S.en=[];S.tw=S.tw.map(()=>null);plantAt(si,['videira'],false,0);let t=S.tw[si];Object.assign(t,{grow:1,lvl:3,branch:'a'});S.mana=MAXM;openTree(si);$('tevo').onclick();o.evolve=t.evo===1&&S.mana<MAXM;closeTree();
    let ran=0;for(const id in POWER){S.en=[];const g=T('gula',s.x+20);g.y=gy(g.x);T('inveja',s.x+30);const ks=id.split('+');S.tw=S.tw.map(()=>null);plantAt(si,ks,false,0);t=S.tw[si];t.grow=1;t.evo=1;POWER[id](t,s,tmult(t));step(2);ran++}
    o.powers=ran===Object.keys(EVO).length+FUSIONS.length&&Object.keys(EVO).every(k=>POWER[k])&&FUSIONS.every(f=>POWER[f.a+'+'+f.b]);
    const fc=mk('hyb',{hyb:['sarca','roma']});o.fusion=info(fc).name==='Fogo do Altar'&&tmult({...t,kinds:['roma','sarca']})>tmult({...t,kinds:['roma','videira']});cardCanvas(fc);
    showCodex('vizinhas');o.codex=document.querySelectorAll('canvas[data-fusion]').length===FUSIONS.length&&document.querySelectorAll('canvas[data-evo]').length===Object.keys(EVO).length;showCodex('inimigos');
    for(let i=0;i<60;i++)update(1/60);draw();return JSON.stringify(o)})()`);
  const o=JSON.parse(r||'{}'),bad=Object.entries(o).filter(([,v])=>!v).map(([k])=>k);check(label+': expansion '+Object.keys(o).length+' tricks',Object.keys(o).length>=40&&!bad.length,bad.join(', ')||r)}
// the boss stages: each world's fifth level, its seed cart, clock and rule, and the way on to the next world
async function bossStages(label){
  const r=await js(`(()=>{const o={};Object.keys(EN).forEach(k=>META.seen.e[k]=1);META.scenes={1:1,2:1,3:1,4:1,5:1,6:1};const step=n=>{for(let i=0;i<n;i++){if(S.intro)closeFoeIntro();update(1/60)}};
    o.levels=LEVELS.filter(l=>l.bossStage).length===7&&BSTAGE.every((b,i)=>bossStageOf(i).boss===b.boss)&&LEVELS.every((l,i)=>l.n===i);
    const keep={...META.done};META.done={};o.gate=!levelOpen(bossStageOf(0).n);META.done['1-4']=1;o.gate=o.gate&&levelOpen(bossStageOf(0).n)&&!levelOpen(4);META.done['1-5']=1;o.gate=o.gate&&levelOpen(4);META.done=keep;
    const go=wi=>{startLevel(bossStageOf(wi).n);S.dialog=null;S.intro=null;tutStep=-1;startWave();step(150);const e=S.bs.boss;return e};
    const res=[];
    for(let wi=0;wi<7;wi++){const B=BSTAGE[wi];let e=go(wi),ok=!!e&&S.goal==='chefe'&&S.hand.some(c=>c)&&S.mana===MAXM;if(!e){res.push(wi+':noboss');continue}
      e.frz=0;e.x=Math.min(e.x,MAP.ww*.6);step(1);const h=e.hp;
      if(B.boss==='serpente'){damage(e,10,'videira');ok=ok&&h-e.hp<4;const h2=e.hp;S.p.x=e.x-EN.serpente.w*.42;S.p.y=gy(S.p.x);bossStomp(S.p);ok=ok&&e.hp===h2;e.headDown=2;bossStomp(S.p);ok=ok&&h2-e.hp>=25}
      if(B.boss==='golias'){damage(e,10,'videira');ok=ok&&h-e.hp<3;S.bs.stones=[{x:S.p.x,t:0}];S.p.on=true;const n0=S.pstones;step(1);ok=ok&&S.pstones===n0+1;const h2=e.hp;damage(e,10,'funda');ok=ok&&h2-e.hp>=19&&e.frz>0}
      if(B.boss==='farao'){e.x=(MAP.sea[0]+MAP.sea[1])/2;S.seaOpen=true;step(1);S.bs.prevSea=true;S.seaOpen=false;const h2=e.hp;step(1);ok=ok&&h2-e.hp>=e.max*.19}
      if(B.boss==='bezerro'){damage(e,10,'videira');const a=h-e.hp,h2=e.hp;damage(e,10,'sarca');ok=ok&&a<3&&h2-e.hp>=15;S.bs.wor=0;step(1);ok=ok&&S.en.some(x=>x.k==='idolatria')}
      if(B.boss==='ninrode'){const hs=[];for(let i=0;i<6;i++){const h0=e.hp;damage(e,10,'videira');hs.push(h0-e.hp)}const h0=e.hp;damage(e,10,'roma');ok=ok&&hs[5]<hs[0]*.5&&h0-e.hp>hs[5]*2}
      if(B.boss==='leviata'){e.dive=0;e.x=S.bs.hook.x+20;damage(e,10,'videira');ok=ok&&h-e.hp<3;S.p.x=S.bs.hook.x;bossStomp(S.p);ok=ok&&e.hooked>0;const h2=e.hp;damage(e,10,'videira');ok=ok&&h2-e.hp>=19}
      if(B.boss==='sombra'){S.lamps=0;S.bs.lamps.forEach(l=>l.lit=0);e.x=MAP.ww*.9;damage(e,10,'videira');ok=ok&&h-e.hp<2;const L=S.bs.lamps[0];e.x=L.x+20;S.p.x=L.x;bossStomp(S.p);ok=ok&&L.lit>0;const h2=e.hp;damage(e,10,'videira');ok=ok&&h2-e.hp>=14}
      // the clock runs out: the boss charges in fury
      S.bs.t=.01;step(2);ok=ok&&e.fury===1;
      // bring it down: the stage is won and the next button leads to the next world
      draw();damage(e,1e9);for(let i=0;i<400&&S.state==='wave';i++)step(1);ok=ok&&S.state==='victory';if(wi===0){levelWon();o.next=$('next')&&(()=>{$('next').onclick();return RUN.level===4})()}
      res.push(wi+':'+(ok?'ok':'bad'))}
    o.stages=res.every(x=>x.endsWith('ok'));o.res=res.join(',');
    return JSON.stringify(o)})()`);
  const o=JSON.parse(r||'{}'),bad=Object.entries(o).filter(([k,v])=>!v&&k!=='res').map(([k])=>k);check(label+': fases de chefe '+(o.res||''),Object.keys(o).length>=4&&!bad.length,bad.join(', ')||r)}
// free planting: anywhere with room, each species with its own footprint, beds still snap, water refuses
async function freePlant(label){
  const r=await js(`(()=>{const o={};startLevel(0);RUN.coll=['videira','sarca','cedro','sicomoro'].map(k=>mk(k));RUN.deck=[...RUN.coll];startLevelBattle();S.dialog=null;S.intro=null;tutStep=-1;S.tw=S.tw.map(()=>null);
    const beds=MAP.slots.length,spot=(()=>{for(let x0=90;x0<MAP.ww-90;x0+=4)if(!inWater(x0)&&!inWater(x0+30)&&!MAP.slots.some(s=>Math.abs(s.x-x0)<12||Math.abs(s.x-x0-26)<12)&&Math.abs(gy(x0)-gy(x0+26))<13)return x0})(),y0=gy(spot);
    S.p.x=spot;S.p.y=y0;S.p.on=true;S.mana=MAXM;S.hand=[mk('sicomoro'),mk('sarca'),mk('sarca'),mk('cedro')];playCard(0);
    const i=MAP.slots.findIndex((s,j)=>s.free&&S.tw[j]);o.planted=i>=0&&MAP.slots.length===beds+1&&S.tw[i].soil==='comum'&&Math.abs(MAP.slots[i].x-spot)<1;
    o.tooClose=!!plantCheck(spot+FOOT.sicomoro+FOOT.sarca-2,gy(spot+23),['sarca']);o.fits=!plantCheck(spot+FOOT.sicomoro+FOOT.sarca+1,gy(spot+26),['sarca'])||Math.abs(gy(spot+26)-gy(spot+26))>3;
    o.bigNeedsMore=FOOT.sicomoro>FOOT.sarca&&footOf(['cedro','sarca'])>FOOT.cedro;
    o.water=!MAP.water||!!plantCheck((MAP.water[0]+MAP.water[1])/2,gy((MAP.water[0]+MAP.water[1])/2),['sarca']);o.home=!!plantCheck(30,gy(30),['sarca']);
    const b=MAP.slots[0];o.bedSnap=freeSlot(b.x+4,b.y,['sarca']).i===0;
    const pl=MAP.plats.find(p=>!p.wall&&p.w>24&&!MAP.slots.some(s=>Math.abs(s.y-p.y)<2&&s.x>p.x&&s.x<p.x+p.w));o.island=!pl||!plantCheck(pl.x+pl.w/2,surfaceAt(pl.x+pl.w/2,pl.y-8),['sarca'])&&surfaceAt(pl.x+pl.w/2,pl.y-8)===pl.y;
    S.tw[i]=null;update(1/60);o.parked=MAP.slots[i].x<0;const f2=freeSlot(spot,y0,['sarca']);o.reused=f2.i===i&&MAP.slots.length===beds+1;
    // the tree limit: a full garden refuses one more, and the shop's makes change what tools and barriers do
    S.tw=S.tw.map(()=>null);const cap=treeCap();for(let k=0;k<cap;k++)plantAt(k,['sarca'],false,0);S.mana=MAXM;S.hand=[mk('sarca'),mk('sarca'),mk('sarca'),mk('sarca')];playCard(0,cap);o.cap=cap===6&&!S.tw[cap]&&treesNow()===cap;
    META.upg.trees=1;o.capUp=treeCap()===7;META.upg.trees=0;const d0=weaponNow().dmg;META.wtier={[META.weapon||'enxada']:2};o.tier=weaponNow().dmg>d0*1.6;META.wtier={};
    const w0=winsN();o.shopLock=shopItems('ferramentas').some(i=>i.id.startsWith('wt:')&&(i.lock||w0>=5))&&shopItems('barreiras').some(i=>i.id.startsWith('bt:'));
    startLevel(0);RUN.deck=[...RUN.coll];startLevelBattle();o.reset=MAP.slots.length===beds&&S.tw.length===beds;
    for(let i=0;i<30;i++)update(1/60);draw();return JSON.stringify(o)})()`);
  const o=JSON.parse(r||'{}'),bad=Object.entries(o).filter(([,v])=>!v).map(([k])=>k);check(label+': plantio livre',Object.keys(o).length>=10&&!bad.length,bad.join(', ')||r)}
// the ten cards of high rarity do what they say
async function rareCards(label){
  const r=await js(`(()=>{Object.keys(EN).forEach(k=>META.seen.e[k]=1);startLevel(0);startLevelBattle();S.dialog=null;S.intro=null;tutStep=-1;S.state='wave';S.q=[];S.en=[];const o={},T=(k,x)=>{const e=spawn(k,x??S.cam+200);e.y=gy(e.x);return e},step=n=>{for(let i=0;i<n;i++)update(1/60)};
    S.tw=S.tw.map(()=>null);const si=MAP.slots.findIndex(s=>Math.abs(s.y-gy(s.x))<2),s=MAP.slots[si];
    for(const k of['carvalho','escol']){S.en=[];plantAt(si,[k],false,0);S.tw[si].grow=1;S.tw[si].cd={};const e=T('gula',s.x+20),h=e.hp;step(120);o['tree_'+k]=e.hp<h&&(k!=='carvalho'||e.slow>0);superTower(S.tw[si],s)}
    S.en=[];S.p.x=S.cam+60;S.p.face=1;let a=T('gula',S.p.x+80),b=T('odio',S.p.x-40);blessing('carruagem');o.carruagem=a.hp<a.max&&b.hp===b.max;
    S.mana=0;blessing('multiplica');o.multiplica=S.mana===1;
    const m0=tmult(S.tw[si]);blessing('maos');o.maos=tmult(S.tw[si])>m0*1.59;S.hands=0;
    RUN.hp=10;S.p.hp=1;blessing('lazaro');o.lazaro=RUN.hp===15&&S.p.hp===S.p.maxhp;
    S.en=[];a=T('odio');blessing('sol');o.sol=a.frz>4&&S.rally>4;
    S.en=[];a=T('gula');b=T('inveja');const ax=a.x;blessing('diluvio');o.diluvio=a.hp<a.max&&b.hp<b.max&&a.x>ax+50;
    S.en=[];a=T('soberba');b=T('odio');blessing('anjo');step(1);o.anjo=!S.en.includes(a)&&S.en.includes(b);
    S.en=[];a=T('gula');a.hp=a.max*.2;b=T('gula');S.tw[si].joio=true;blessing('ceifa');step(1);o.ceifa=!S.en.includes(a)&&S.en.includes(b)&&!S.tw[si].joio;
    o.rar=['carvalho','carruagem','multiplica','maos','lazaro'].every(k=>RARITY[k]==='epica')&&['escol','sol','diluvio','anjo','ceifa'].every(k=>RARITY[k]==='lendaria');
    Object.keys(CARDS).slice(-10).forEach(k=>cardCanvas(mk(k)));draw();return JSON.stringify(o)})()`);
  const o=JSON.parse(r||'{}'),bad=Object.entries(o).filter(([,v])=>!v).map(([k])=>k);check(label+': cartas raras',Object.keys(o).length===11&&!bad.length,bad.join(', ')||r)}
// a short battle in every world: plant, call the wave, let it run, draw frames
async function battles(label){
  for(let w=0;w<7;w++){const before=errors.length;
    const r=await js(`(async()=>{const n=${w}*4+${w%2?1:0};META.scenes={1:1,2:1,3:1,4:1,5:1,6:1};startLevel(n);RUN.coll=['videira','roma','oliveira','sarca'].map(k=>mk(k));RUN.deck=[...RUN.coll];startLevelBattle();
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

// difficulty scales the pests and the stars, the day's challenge pays once a day, a grown tree evolves, the loading screen goes away
async function polish(label){const before=errors.length;
  const r=await js(`(()=>{const out=[];const hp=d=>{META.diff=d;startLevel(4);startLevelBattle();S.dialog=null;S.intro=null;tutStep=-1;const e=spawn('odio');return e.max};
    const f=hp('facil'),n=hp('normal'),h=hp('dificil');out.push(f<n&&n<h?'hp':'hp-ruim');
    META.diff='facil';startLevel(4);startLevelBattle();S.dialog=null;S.intro=null;tutStep=-1;RUN.hp=20;delete META.stars['2-1'];levelWon();out.push(META.stars['2-1']===2?'estrelas':'estrelas-'+META.stars['2-1']);
    META.diff='normal';const d=dailyAdv();if(!d)return 'sem-desafio';startLevel(d.n);RUN.dmods=d.mods;startLevelBattle();S.dialog=null;S.intro=null;tutStep=-1;
    const g0=META.gifts||0;delete (META.dailyAdv||{})[todayKey()];levelWon();const g1=META.gifts;startLevel(d.n);RUN.dmods=d.mods;startLevelBattle();S.dialog=null;S.intro=null;levelWon();
    out.push(g1===g0+1&&META.gifts===g1?'desafio':'desafio-ruim');
    startLevel(4);startLevelBattle();S.dialog=null;S.intro=null;tutStep=-1;S.mana=MAXM;plantAt(0,['videira'],false,0);Object.assign(S.tw[0],{grow:1,lvl:3});openTree(0);document.querySelector('[data-br=a]').click();
    out.push(S.tw[0].branch==='a'?'evolui':'nao-evolui');for(let i=0;i<5;i++)update(1/30);draw();closeTree();
    out.push(document.getElementById('boot')?'carregando-preso':'sem-carregando');return out.join(',')})()`);
  check(label+': dificuldade, desafio do dia, evolução '+r,errors.length===before&&r==='hp,estrelas,desafio,evolui,sem-carregando',errors.slice(before).join(' | ').slice(0,200))}
// pests step out of the portals, the stall opens between waves and sells, the hyssop and the cedar answer a stomp
async function waveShop(label){const before=errors.length;
  const r=await js(`(()=>{const out=[];startLevel(3);startLevelBattle();S.dialog=null;S.intro=null;tutStep=-1;startWave();S.q=[];
    const g=spawn('odio'),fk=Object.keys(EN).find(k=>EN[k].fly===2&&!EN[k].boss),f=fk&&spawn(fk);out.push(g.x===MAP.ww-14&&(!f||f.x===MAP.ww-22)?'portais':'portais-ruim');
    S.en=[];S.coins=60;update(1/30);out.push(S.shop&&S.shop.length===3?'loja':'sem-loja');draw();
    const c0=S.coins;document.getElementById('wsroll').click();const c1=S.coins;document.querySelector('#wshop [data-up]:not([disabled])').click();out.push(c1===c0-10&&S.coins<c1&&!S.shop&&document.getElementById('wshop').hidden?'compra':'compra-ruim');
    S.mana=MAXM;plantAt(0,['hissopo'],false,0);plantAt(1,['cedro'],false,0);[0,1].forEach(i=>{Object.assign(S.tw[i],{grow:1});spawn('odio',MAP.slots[i].x+20);superTower(S.tw[i],MAP.slots[i])});
    for(let i=0;i<10;i++){update(1/30);updFx(1/30)}draw();out.push('poderes');
    const s4=MAP.slots[4];plantAt(4,['videira'],false,0);Object.assign(S.tw[4],{grow:1,dcd:0});S.p.x=s4.x+10;S.p.y=s4.y-40;S.p.on=false;S.p.slam=true;S.p.vy=420;for(let i=0;i<20;i++)update(1/30);out.push(S.tw[4].dcd>4?'pisao':'pisao-falhou');
    return out.join(',')})()`);
  check(label+': portais, loja entre ondas, poderes '+r,errors.length===before&&r==='portais,loja,compra,poderes,pisao',errors.slice(before).join(' | ').slice(0,200))}
console.log('— new player');await load(true,false);await loopAndScene('new');
console.log('— player with progress');await js(`Object.assign(META,{intro:1,tut:1,coins:5000});['1-1','1-2','1-3','1-4','2-1','2-4'].forEach(i=>META.done[i]=1);saveMeta();1`);await everyScreen('progress');await farmers('progress');await packs('progress');await pests('progress');await newCards('progress');await expansion('progress');await bossStages('progress');await freePlant('progress');await rareCards('progress');await battles('progress');await goals('progress');await minis('progress');await audio('progress');await polish('progress');await waveShop('progress');
console.log('— embed with gamepad blocked');await load(false,true);await loopAndScene('blocked-pad');
const fails=checks.filter(c=>!c[1]);console.log(`\n${checks.length-fails.length}/${checks.length} checks passed`+(errors.length?`; ${errors.length} error(s) logged:`:''));
errors.forEach(e=>console.log('  · '+String(e).split('\n').slice(0,3).join(' / ')));
ws.close();chrome.kill();server.close();try{fs.rmSync(prof,{recursive:true,force:true})}catch(e){}
process.exit(fails.length||errors.length?1:0);
