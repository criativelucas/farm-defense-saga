// ---------- core helpers shared by every file
const $=id=>document.getElementById(id);
const W=384,H=216,MAXM=10,LIFE_X=26,RS=2;
const cv=$('c'),x=cv.getContext('2d'),gl=$('glow'),gx=gl.getContext('2d');x.__k=gx.__k=RS;
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>v<a?a:v>b?b:v,pick=a=>a[Math.random()*a.length|0];
const hs=(a,b)=>{let h=Math.imul(a|0,374761393)^Math.imul(b|0,668265263);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295};
const mkCanvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
// The world is 384x216 units but drawn at RS device pixels per unit, so foliage, ground and text get finer detail.
// An HD canvas carries its scale in __k; the pixel helpers read it from the context they draw on.
function mkHD(w,h,k=RS){const c=mkCanvas(Math.ceil(w*k),Math.ceil(h*k)),g=c.getContext('2d');g.scale(k,k);g.imageSmoothingEnabled=false;g.__k=k;c.__k=k;return c}
// small UI canvases (portraits, icons) get 4 device pixels per unit so half-unit sprites stay sharp
function hdCtx(cvs,w,h,k=4){if(cvs.width!==w*k){cvs.width=w*k;cvs.height=h*k}const g=cvs.getContext('2d');g.setTransform(k,0,0,k,0,0);g.__k=k;g.imageSmoothingEnabled=false;g.clearRect(0,0,w,h);return g}
const dl=(g,c,dx,dy)=>g.drawImage(c,dx,dy,c.width/(c.__k||1),c.height/(c.__k||1));

// Gameplay randomness (map, waves, events, rewards). Seeded in the daily challenge so every player gets the same journey.
let RNG=Math.random;
function seedRng(seed){let a=seed>>>0;RNG=()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rr=(a,b)=>a+RNG()*(b-a),rpick=a=>a[RNG()*a.length|0];
const rshuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=RNG()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};

const store={
  get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
  del(k){try{localStorage.removeItem(k)}catch(e){}}
};

// ---------- pixel helpers (C = current context, OV = flat color override for flashes and outlines)
let C=x,OV=null;
function r(px,py,w,h,c){const k=C.__k||1;C.fillStyle=OV||c;C.fillRect(Math.round(px*k)/k,Math.round(py*k)/k,w,h)}
// leafy blobs are drawn once at the target's resolution and cached, then stamped; at 2x the leaves are half-size pixels
const BLOBC=new Map();
function blob(cx,cy,rx,ry,dark,mid,lite,seed){
  if(rx<=0||ry<=0)return;const k=C.__k||1,key=rx+','+ry+','+dark+mid+lite+','+seed+','+(OV||'')+','+k;let b=BLOBC.get(key);
  if(!b){if(BLOBC.size>800)BLOBC.clear();b=mkHD(rx*2+3,ry*2+3,k);const keep=C;C=b.getContext('2d');const s=1/k,hi=shade(lite,.4);
    for(let dy=-ry;dy<=ry;dy+=s)for(let dx=-rx;dx<=rx;dx+=s){
      const d=dx*dx/(rx*rx)+dy*dy/(ry*ry),n=hs(Math.round(dx*k)+seed*31,Math.round(dy*k)+seed);
      if(d>1.15-n*.4)continue;const l=(-dx-dy*1.3)/(rx+ry)+n*.3+Math.sin(dx*1.3+seed)*Math.sin(dy*1.5+seed*.7)*.22;
      // leafy clumps: a bright speck tone on top of the lit side, a darker rim on the shaded side
      r(rx+1+dx,ry+1+dy,s,s,d>.74&&dx+dy>0?dark:l>.62?hi:l>.34?lite:l>-.15?mid:dark)}
    C=keep;BLOBC.set(key,b)}
  C.drawImage(b,Math.round((cx-rx-1)*k)/k,Math.round((cy-ry-1)*k)/k,b.width/k,b.height/k)}
function ring(cx,cy,rad,c){const n=Math.max(8,rad*6|0);for(let i=0;i<n;i++){const a=i/n*Math.PI*2;r(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad,1,1,c)}}
function disc(cx,cy,rad,c){const s=1/(C.__k||1);for(let dy=-rad;dy<=rad;dy+=s){const w=Math.round(Math.sqrt(Math.max(0,rad*rad-dy*dy))/s)*s;r(cx-w,cy+dy,w*2+1,s,c)}}
function mount(w,base,amp,f,seed,c){const s=1/(C.__k||1);for(let i=0;i<w;i+=s){const h=Math.sin(i*f+seed)*amp+Math.sin(i*f*2.7+seed*3)*amp*.4+Math.sin(i*.2+seed)*1.5;r(i,base-h,s,H,c)}}
function palm(px,py,c){for(let i=0;i<22;i++)r(px+Math.sin(i*.15)*3,py-i,2,1,c);
  for(let a=0;a<5;a++){const an=-Math.PI*.9+a*Math.PI*.45;for(let j=0;j<10;j++)r(px+Math.cos(an)*j,py-22+Math.sin(an)*j+j*j*.06,2,1,c)}}

// ---------- audio: blips + a small generated score in the Phrygian dominant scale
let AC=null,MASTER=null,MUSG=null,SFXG=null,muted=false;
const CFG=Object.assign({mus:.55,sfx:.9,lite:false},store.get('fds-cfg',{}));
function saveCfg(){store.set('fds-cfg',CFG);if(MUSG)MUSG.gain.value=CFG.mus;if(SFXG)SFXG.gain.value=CFG.sfx;document.body.classList.toggle('lite',CFG.lite);document.body.classList.toggle('big',!!CFG.big)}
function initAudio(){
  if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();MASTER=AC.createGain();MASTER.gain.value=muted?0:.9;MASTER.connect(AC.destination);
    MUSG=AC.createGain();MUSG.gain.value=CFG.mus;SFXG=AC.createGain();SFXG.gain.value=CFG.sfx;SFXG.connect(MASTER);
    // music goes through a soft low-pass and a short echo, so the square waves sound warm instead of buzzy
    const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;const dl2=AC.createDelay();dl2.delayTime.value=.27;const fb=AC.createGain();fb.gain.value=.28;const wet=AC.createGain();wet.gain.value=.22;
    MUSG.connect(lp);lp.connect(MASTER);lp.connect(dl2);dl2.connect(fb);fb.connect(dl2);dl2.connect(wet);wet.connect(MASTER);loadAudio()}catch(e){AC=null}}
  else if(AC.state==='suspended')AC.resume();
}
function setMuted(m){muted=m;if(MASTER)MASTER.gain.value=m?0:.9}
const lastS={};
const SND={bleat:[400,300,.4,'square',.05],splash:[900,200,.25,'sine',.05],thunder:[90,40,.9,'sawtooth',.08],sling:[600,1200,.15,'triangle',.04],pop:[900,1500,.08,'triangle',.04],jump:[320,640,.08,'square',.04],slam:[200,40,.2,'sawtooth',.09],hit:[520,300,.04,'square',.025],kill:[600,1200,.09,'triangle',.06],
  coin:[900,1600,.06,'square',.03],plant:[300,900,.18,'triangle',.07],beam:[1300,180,.28,'sawtooth',.05],hurt:[160,60,.3,'square',.08],
  super:[200,1400,.35,'triangle',.08],no:[220,140,.14,'square',.05],wave:[220,440,.4,'triangle',.06],horn:[180,240,.6,'sawtooth',.08],card:[600,900,.06,'triangle',.05],
  stone:[140,70,.2,'square',.07],wind:[400,200,.3,'sine',.05],heal:[500,1000,.3,'sine',.05],ach:[700,1400,.4,'triangle',.07]};
// a noisy layer under the tone gives hits, stomps and stones some body
const NOISY={hit:[2400,.04,.05],kill:[1800,.08,.07],slam:[300,.22,.25],stone:[500,.12,.12],plant:[900,.08,.06],hurt:[600,.12,.08],wind:[1200,.3,.06]};
function sfx(n){if(!AC||muted)return;const now=AC.currentTime;if(lastS[n]&&now-lastS[n]<.035)return;lastS[n]=now;
  if(AUD.sfx[n]){const s=AC.createBufferSource();s.buffer=AUD.sfx[n];s.playbackRate.value=.95+Math.random()*.1;s.connect(SFXG||MASTER);s.start(now);return}
  if(!SND[n])return;
  const P=SND[n],o=AC.createOscillator(),g=AC.createGain(),j=1+(Math.random()-.5)*.1;o.type=P[3];
  o.frequency.setValueAtTime(P[0]*j,now);o.frequency.exponentialRampToValueAtTime(P[1]*j,now+P[2]);
  const N=NOISY[n];if(N){if(!NOISE)drum(now,0,1);const s=AC.createBufferSource(),bp=AC.createBiquadFilter(),v=AC.createGain();s.buffer=NOISE;bp.type='bandpass';bp.frequency.value=N[0];
    v.gain.setValueAtTime(N[2],now);v.gain.exponentialRampToValueAtTime(.0001,now+N[1]);s.connect(bp).connect(v).connect(SFXG||MASTER);s.start(now);s.stop(now+N[1]+.02)}
  g.gain.setValueAtTime(P[4],now);g.gain.exponentialRampToValueAtTime(.0001,now+P[2]);
  o.connect(g).connect(SFXG||MASTER);o.start(now);o.stop(now+P[2]+.02)}

const MUS={mode:'calm',next:0,step:0,world:'eden'};
const MSTYLE={eden:{t:84,tr:0,lead:'triangle',prog:[0,5,3,4]},jerico:{t:96,tr:2,lead:'square',prog:[0,3,4,0]},mar:{t:90,tr:-2,lead:'sine',prog:[0,5,6,4]},sinai:{t:78,tr:-5,lead:'triangle',prog:[0,1,0,4]},
  babel:{t:104,tr:3,lead:'square',prog:[0,4,5,3]},getsemani:{t:66,tr:-7,lead:'sine',prog:[0,5,3,1]},abismo:{t:70,tr:-9,lead:'sine',prog:[0,1,5,4]},tumulo:{t:72,tr:5,lead:'triangle',prog:[0,3,5,4]}};
// each world gets its own 32-step melody, built once from its name so it is always the same tune
const MELO={};function melody(w){if(MELO[w])return MELO[w];let h=0;for(const ch of w)h=h*31+ch.charCodeAt(0)|0;const R=()=>{h=Math.imul(h^h>>>15,2246822507)+1|0;return((h>>>0)%1000)/1000};
  const m=[];let d=4;for(let i=0;i<32;i++){if(i%8===7||R()<.22){m.push(null);continue}d=Math.max(0,Math.min(9,d+[-2,-1,-1,0,1,1,2][R()*7|0]));m.push(i%4===0?[0,2,4,7][R()*4|0]:d)}return MELO[w]=m}
const SCALE=[0,1,4,5,7,8,10];
const deg=d=>{const o=Math.floor(d/7);return SCALE[((d%7)+7)%7]+12*o};
const hz=s=>146.83*Math.pow(2,(s+((MSTYLE[MUS.world]||{tr:0}).tr))/12);
function tone(f,t,d,type,g){const o=AC.createOscillator(),v=AC.createGain();o.type=type;o.frequency.value=f;
  v.gain.setValueAtTime(.0001,t);v.gain.exponentialRampToValueAtTime(g,t+Math.min(.08,d*.3));v.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(v).connect(MUSG);o.start(t);o.stop(t+d+.05)}
let NOISE=null;
function drum(t,g,f){if(!NOISE){NOISE=AC.createBuffer(1,AC.sampleRate*.3|0,AC.sampleRate);const d=NOISE.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length)}
  const s=AC.createBufferSource(),bp=AC.createBiquadFilter(),v=AC.createGain();s.buffer=NOISE;bp.type='bandpass';bp.frequency.value=f;v.gain.value=g;s.connect(bp).connect(v).connect(MUSG);s.start(t)}
const PROG=[0,5,3,4];
function musicTick(){
  if(!AC||muted||AC.state!=='running')return;
  if(AUD.mode==='files')return musicFiles();
  const boss=MUS.mode==='boss',wave=MUS.mode==='wave',ms=MSTYLE[MUS.world]||MSTYLE.eden,spb=60/(boss?120:wave?ms.t*1.12:ms.t)/2,mel=melody(MUS.world);
  if(MUS.next<AC.currentTime)MUS.next=AC.currentTime+.05;
  while(MUS.next<AC.currentTime+.25){
    const s=MUS.step,t=MUS.next,root=(ms.prog||PROG)[(s>>4)%4],note=mel[s%32];
    if(s%16===0)[0,2,4].forEach(i=>tone(hz(deg(root+i)),t,spb*16,'triangle',.016));
    if(s%4===0)tone(hz(deg(root)-12),t,spb*3,'sine',boss?.07:.045);
    const arp=[0,2,4,7,4,2,1,2][s%8];if(s%2===0||boss)tone(hz(deg(root+arp)+12),t,spb*.9,'square',boss?.011:.007);
    if(!boss&&s%32===24)tone(hz(deg(root+4)+24),t,spb*6,'sine',.014);
    // the melody plays every phrase during a wave, and every other phrase while you prepare
    if(note!=null&&s%2===0&&(wave||(!boss&&(s>>5)%2===0)))tone(hz(deg(root+note)+12),t,spb*1.8,ms.lead||'triangle',wave?.02:.016);
    if(wave){if(s%8===0)drum(t,.32,110);if(s%8===4)drum(t,.2,1800);if(s%2===1)drum(t,.04,6000)}
    if(boss){if(s%4===0)drum(t,.5,120);if(s%8===6)drum(t,.35,220);if(s%2===1)drum(t,.06,3000)}else if(s%8===0)drum(t,.1,140);
    MUS.step++;MUS.next+=spb;
  }
}
setInterval(musicTick,50);

// ---------- recorded music and effects (assets/audio, made by tools/audio/compose.py)
// Effects load up front (they are tiny); music tracks load when first needed. If anything fails, the synth above takes over.
const AUD={mode:'synth',sfx:{},buf:{},loading:{},meta:null,cur:null};
const AUD_SFX=['jump','slam','hit','kill','coin','plant','beam','hurt','super','no','horn','wave','card','stone','wind','heal','ach','bleat','splash','thunder','sling','pop'];
async function loadAudio(){if(AUD.meta)return;AUD.meta={};
  const get=async f=>{const r=await fetch('assets/audio/'+f);if(!r.ok)throw new Error(f);return AC.decodeAudioData(await r.arrayBuffer())};
  try{AUD.meta=await (await fetch('assets/audio/music.json')).json();AUD.mode='files'}catch(e){AUD.mode='synth';return}
  AUD_SFX.forEach(n=>get('sfx-'+n+'.wav').then(b=>AUD.sfx[n]=b).catch(()=>{}))}
function trackBuf(k){if(AUD.buf[k])return AUD.buf[k];if(!AUD.loading[k]){AUD.loading[k]=1;fetch('assets/audio/'+k+'.mp3').then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(a=>AC.decodeAudioData(a)).then(b=>AUD.buf[k]=b).catch(()=>{if(!/perc|vitoria|derrota/.test(k))AUD.mode='synth'})}return null}
function wantedTrack(){if(MUS.mode==='boss')return'chefe';if(MUS.scene)return MUS.scene;const w=MUS.world==='abismo'?'mar':MUS.world;return AUD.meta.loops&&AUD.meta.loops[w]?w:'titulo'}
function loopSource(buf,L,dest,when){const s=AC.createBufferSource();s.buffer=buf;s.loop=true;let lead=0;const d=buf.getChannelData(0);while(lead<4000&&Math.abs(d[lead])<1e-3)lead++;
  s.loopStart=lead/buf.sampleRate;s.loopEnd=Math.min(buf.duration,s.loopStart+L);s.connect(dest);s.start(when,s.loopStart);return s}
function musicFiles(){const k=wantedTrack(),now=AC.currentTime,cur=AUD.cur;
  if(!cur||cur.k!==k){const buf=trackBuf(k);if(!buf)return;const hasPerc=(AUD.meta.perc||[]).includes(k),pbuf=hasPerc?trackBuf(k+'-perc'):null;if(hasPerc&&!pbuf)return;
    if(cur){cur.g.gain.setTargetAtTime(0,now,.4);const old=cur;setTimeout(()=>{try{old.s.stop();old.p&&old.p.stop()}catch(e){}},2500)}
    const g=AC.createGain(),pg=AC.createGain();g.gain.value=0;g.gain.setTargetAtTime(1,now+.05,.5);pg.gain.value=0;pg.connect(g);g.connect(MUSG);
    const L=AUD.meta.loops[k],when=now+.06;AUD.cur={k,g,pg,s:loopSource(buf,L,g,when),p:pbuf?loopSource(pbuf,L,pg,when):null}}
  // drums come in during a wave and fade out between waves
  const c=AUD.cur;if(c&&c.p){const want=MUS.mode==='wave'||MUS.mode==='boss'?.9:0;if(Math.abs(c.pg.gain.value-want)>.01)c.pg.gain.setTargetAtTime(want,now,.6)}}
function playJingle(k){if(!AC||muted||AUD.mode!=='files')return;const b=trackBuf(k);if(!b)return;const s=AC.createBufferSource();s.buffer=b;s.connect(MUSG);s.start();
  if(AUD.cur){const g=AUD.cur.g.gain,t=AC.currentTime;g.setTargetAtTime(.2,t,.1);g.setTargetAtTime(1,t+b.duration,.8)}}

// ---------- input
const keys=new Set(),hit=new Set();
const GAME=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','KeyW','KeyA','KeyS','KeyD','KeyN','KeyM','Digit1','Digit2','Digit3','Digit4','KeyX','KeyJ','KeyQ','KeyE','KeyR']);
addEventListener('keydown',e=>{if(GAME.has(e.code)&&!(e.target.closest&&e.target.closest('#menu')))e.preventDefault();if(!e.repeat)hit.add(e.code);keys.add(e.code);initAudio()});
addEventListener('keyup',e=>keys.delete(e.code));
addEventListener('blur',()=>keys.clear());
const dn=(...c)=>c.some(k=>keys.has(k))?1:0, pr=(...c)=>c.some(k=>hit.has(k));
document.querySelectorAll('#touch button').forEach(b=>{const k=b.dataset.k;
  b.addEventListener('pointerdown',e=>{e.preventDefault();keys.add(k);hit.add(k);initAudio()});
  ['pointerup','pointercancel','pointerleave'].forEach(t=>b.addEventListener(t,()=>keys.delete(k)))});

document.body.classList.toggle('lite',CFG.lite);document.body.classList.toggle('big',!!CFG.big);
