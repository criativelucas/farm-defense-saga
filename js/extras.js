// ---------- the gardener's special ability (C), one per character, 30s recharge
const ABIL={lavrador:['Mutirão','Rega todas as árvores de uma vez'],noe:['Chuva de Noé','Chuva por 8 segundos'],rute:['Respiga','Frutos e maná do chão vêm até você'],
  davi:['Funda','Uma pedra de 40 na praga mais forte'],elias:['Fogo do céu','18 de dano em tudo perto de você'],jose:['Celeiro cheio','+4 de maná'],
  debora:['Toque de guerra','Todas as árvores atiram já, e mais rápido por 6s'],moises:['Cajado','Congela as pragas por 3s']};
const ABIL_CD=30;
function useAbility(){if(!live()||S.paused||S.intro||S.dialog)return;const P=S.p;
  if((S.abil||0)>0){sfx('no');pop(P.x,P.y-26,'recarregando '+Math.ceil(S.abil)+'s','#c9a99a');return}
  const k=(RUN&&RUN.char)||META.char,A=ABIL[k]||ABIL.lavrador;S.abil=ABIL_CD*(1-.15*tl('cd'));sfx('super');vfx('ring2',P.x,P.y-8,{r:46,c:'#ffe36a'});pop(P.x,P.y-30,A[0]+'!','#ffe36a',10);mission('abil',1);
  if(k==='noe')S.rain=Math.max(S.rain,8);
  else if(k==='rute')S.respigar=8;
  else if(k==='davi'){let b=null;for(const e of S.en)if(e.hp>0&&!(e.dive>0)&&(!b||e.hp>b.hp))b=e;if(b){vfx('spark',b.x,ecy(b),{n:10});damage(b,40,'pedras');shake(4)}}
  else if(k==='elias'){vfx('holy',P.x,0);for(const e of S.en)if(Math.abs(e.x-P.x)<70)damage(e,18);shake(5)}
  else if(k==='jose')S.mana=Math.min(MAXM,S.mana+4);
  else if(k==='debora'){S.tw.forEach(t=>{if(t){t.cd={};t.dcd=0}});S.rally=6}
  else if(k==='moises')for(const e of S.en){if(EN[e.k].boss)e.slow=3;else e.frz=3}
  else S.tw.forEach((t,i)=>{if(t&&t.grow>=1&&!t.joio)water(t,MAP.slots[i],.6)});
  renderItems()}

// ---------- systems arrive one at a time in the adventure, each with a short "novidade" note
const SYS_AT={links:2,barriers:3,fruitset:4,basket:5};
const SYS_TXT={links:['Vizinhança','Árvores perto umas das outras se ligam por ramos e ficam mais fortes.'],barriers:['Barreiras','Q põe cerca, E espantalho e R lama. Compre mais na loja.'],
  fruitset:['Fruto em cacho','Plante frutos diferentes: cada fruto novo aumenta o dano de todas as árvores.'],basket:['Cesto','As árvores soltam frutos. Junte 5 e dê um pisão de colheita.']};
const sysOn=k=>!RUN||RUN.mode!=='level'||RUN.endless||RUN.level>=SYS_AT[k];
function announceSystems(){META.sysSeen=META.sysSeen||{};for(const k in SYS_AT)if(sysOn(k)&&!META.sysSeen[k]&&RUN.mode==='level'){META.sysSeen[k]=1;toast('Novidade: '+SYS_TXT[k][0],SYS_TXT[k][1])}saveMeta()}

// ---------- bosses: a splash when they arrive, and a "!" over their head before each attack
function bossIntro(k){const d=EN[k],el=$('bossintro');el.innerHTML=`<div class="bi"><canvas width="48" height="48"></canvas><div><small>Chefe · ${d.ref||''}</small><b>${d.name}</b><span>${d.desc.replace(/^Chefe\.\s*/,'')}</span></div></div>`;
  enemyIconTo(el.querySelector('canvas'),k);el.hidden=false;el.classList.remove('show');void el.offsetWidth;el.classList.add('show');sfx('horn');shake(6);
  clearTimeout(bossIntro.t);bossIntro.t=setTimeout(()=>el.hidden=true,3200)}
function drawTelegraph(e){const d=EN[e.k];if(!d.boss||e.dive>0||e.st>.9||(S.t*10|0)%2)return;const top=(d.fly?e.y-d.h/2:e.y-d.h)-14;
  r(e.x-1,top,2.5,6,'#1a0808');r(e.x-.5,top+.5,1.5,5,'#ff3a3a');r(e.x-1,top+7,2.5,2.5,'#1a0808');r(e.x-.5,top+7.5,1.5,1.5,'#ff3a3a')}

// ---------- daily missions
const MISSIONS=[{k:'kill',n:30,t:'Vença 30 pragas'},{k:'water',n:6,t:'Complete 6 regas'},{k:'plant',n:10,t:'Plante 10 árvores'},{k:'slam',n:15,t:'Dê 15 pisões'},
  {k:'bless',n:5,t:'Use 5 bênçãos'},{k:'win',n:2,t:'Vença 2 fases'},{k:'star3',n:1,t:'Vença uma fase com 3 estrelas'},{k:'evolve',n:1,t:'Evolua uma árvore'},{k:'abil',n:3,t:'Use a habilidade especial 3 vezes'}];
const MISSION_PAY=100;
function ensureMissions(){const day=todayKey();if(META.missions&&META.missions.day===day)return META.missions;
  const keep=RNG;seedRng(day.split('-').join('')|0);const pick3=rshuffle(MISSIONS).slice(0,3);RNG=keep;
  META.missions={day,list:pick3.map(m=>({k:m.k,n:m.n,t:m.t,p:0,got:false}))};saveMeta();return META.missions}
function mission(k,n=1){const M=ensureMissions();for(const m of M.list)if(m.k===k&&m.p<m.n){m.p=Math.min(m.n,m.p+n);if(m.p>=m.n){toast('Missão cumprida!',m.t+' · receba no menu');sfx('ach')}saveMeta()}}
const missionsReady=()=>ensureMissions().list.filter(m=>m.p>=m.n&&!m.got).length;
function showMissions(){const M=ensureMissions();
  menu(`<div class="mbox"><div class="topbar"><button class="btn ghost" data-go="hub">‹ Menu</button><h2>Missões do dia</h2>${coinsTag()}</div>
    <p class="help">Três missões novas por dia. Cada uma vale ${MISSION_PAY} moedas.</p>
    <div class="sheet vstats">${M.list.map((m,i)=>`<div class="stat"><b>${m.got?'✓ ':''}${m.t}</b><span>${m.p}/${m.n}</span><div class="meter g"><i style="width:${m.p/m.n*100}%"></i></div>
      ${m.p>=m.n&&!m.got?`<button class="btn sm" data-claim="${i}" style="grid-column:1/-1">Receber ${MISSION_PAY} moedas</button>`:''}</div>`).join('')}</div></div>`);
  paintCoins();$('menu').querySelectorAll('[data-claim]').forEach(b=>b.onclick=()=>{const m=M.list[+b.dataset.claim];m.got=true;META.coins+=MISSION_PAY;saveMeta();sfx('coin');showMissions()})}

// ---------- the garden feeds the battle: growing pots give starting maná
function gardenBonus(){const G=META.garden;if(!G||!G.pots)return 0;const grow=G.pots.filter(p=>p&&p.stage>=1).length,ripe=G.pots.filter(p=>p&&p.stage>=3).length;
  return Math.min(4,Math.floor(grow/2)+ripe)}

// ---------- endless mode: one per world, opens after its boss; how far can the garden hold?
function startEndless(wi){const n=wi*4+3;startLevel(n);RUN.endless=true;RUN.world=wi;showDeck()}
function endlessNode(){const L=LEVELS[RUN.level],w=WORLDS[L.wi],waves=[];seedRng(Date.now()|0);
  for(let i=0;i<60;i++){const wv=genWave(w.act,Math.floor(i/1.4)+2,'batalha',0,levelPool(L.n));if(i%10===9){const b=w.boss||'golias';wv.list.unshift([b,2.5]);wv.name=EN[b].name}waves.push(wv)}
  RNG=Math.random;return{type:'batalha',map:w.map,waves,night:false,level:L.id+'∞'}}
function endlessOver(){const wi=RUN.world,best=(META.endless=META.endless||{})[wi]||0,got=S.wi;META.endless[wi]=Math.max(best,got);
  const picked=S.coins;META.coins+=picked;saveMeta();MUS.mode='calm';
  endScreen({win:false,eyebrow:WORLDS[wi].name+' · modo infinito',title:'Fim da resistência',stars:0,coins:picked,coinNote:'todas as moedas recolhidas',
    hint:`Você aguentou ${got} onda${got===1?'':'s'}. ${got>best?'Novo recorde!':'Recorde: '+best+'.'}`,
    buttons:`<button class="btn ghost" id="tomap">Mapa</button><button class="btn" id="again">Tentar de novo</button>`});
  $('tomap').onclick=()=>showWorld();$('again').onclick=()=>startEndless(wi)}

// ---------- short dialogues with portraits, the first time you enter each world
const DIALOG={
  eden:[['narrador','No princípio o jardim era bom. Mas as obras da carne rondam a cerca.'],['lavrador','Então eu planto. O que é plantado com amor dá fruto.']],
  jerico:[['narrador','Jericó tem muralhas altas. Sete voltas pela torre e elas caem.'],['debora','Coragem, lavrador. O Senhor vai à frente.']],
  mar:[['moises','O mar vai se abrir. Leve o povo para a outra margem.'],['lavrador','E eu guardo o caminho enquanto eles passam.']],
  sinai:[['moises','Enquanto eu subia o monte, fizeram um bezerro de ouro.'],['narrador','Três pisões no ídolo e ele cai.']],
  babel:[['narrador','Quiseram uma torre até o céu, e as línguas se confundiram.'],['jose','Quando as cartas embaralharem, confie no que você plantou.']],
  getsemani:[['narrador','Noite no jardim das oliveiras. Vigiai e orai.'],['lavrador','Não vou dormir. As árvores precisam de mim por perto.']]};
function startDialog(id){const D=DIALOG[id];META.dlg=META.dlg||{};if(!D||META.dlg[id])return;META.dlg[id]=1;saveMeta();S.dialog={lines:D,i:0,t:0};showLine()}
function showLine(){const d=S.dialog,[who,txt]=d.lines[d.i],el=$('dialog');d.t=performance.now();
  el.innerHTML=`<div class="dl"><div class="dp"><canvas width="32" height="40"></canvas></div><div><b>${who==='narrador'?'Narrador':CHARS[who].name}</b><p></p><small>Enter ▸</small></div></div>`;el.hidden=false;
  const c=el.querySelector('canvas');if(who==='narrador'){const g=hdCtx(c,32,40);C=g;r(6,8,20,26,'#e8d8b0');r(6,8,20,2,'#a88a5a');r(6,32,20,2,'#a88a5a');for(let j=14;j<30;j+=4)r(10,j,12,1,'#a88a5a');C=x}else charIconTo(c,who);
  const p=el.querySelector('p');let n=0;clearInterval(showLine.iv);showLine.iv=setInterval(()=>{n+=2;p.textContent=txt.slice(0,n);if(n>=txt.length)clearInterval(showLine.iv)},28);
  el.onclick=dialogNext}
function dialogNext(){const d=S.dialog;if(!d)return;const txt=d.lines[d.i][1],p=$('dialog').querySelector('p');
  if(p&&p.textContent.length<txt.length){clearInterval(showLine.iv);p.textContent=txt;return}
  d.i++;sfx('card');if(d.i>=d.lines.length){S.dialog=null;$('dialog').hidden=true;return}showLine()}

// ---------- a quick leafy wipe between screens
function wipe(){const el=$('wipe');el.classList.remove('go');void el.offsetWidth;el.classList.add('go')}

// ---------- talents bought with stars, and card levels bought with coins
const TALENTS={hearts:['Coração forte','+1 coração na batalha'],mana:['Bolsa de maná','+1 de maná no começo'],cd:['Fôlego','Habilidade recarrega 15% mais rápido'],dmg:['Mãos de lavrador','+8% de dano das árvores']};
const TAL_COST=2,TAL_MAX=3;
const tl=k=>(META.talents&&META.talents[k])||0;
const starsTotal=()=>Object.values(META.stars||{}).reduce((a,b)=>a+b,0);
const starsFree=()=>starsTotal()-Object.values(META.talents||{}).reduce((a,b)=>a+b*TAL_COST,0);
function talentsHTML(){return `<div class="sec"><h3>Talentos · ${starsFree()} ★ livres</h3><p class="help">Cada estrela que você ganha nas fases pode virar um talento. ${TAL_COST} ★ por nível.</p>
  <div class="grid g5">${Object.entries(TALENTS).map(([k,[n,d]])=>`<button type="button" class="pick" data-tal="${k}" ${tl(k)>=TAL_MAX||starsFree()<TAL_COST?'disabled':''}><b>${n}</b><small>${d}</small><small>${'●'.repeat(tl(k))+'○'.repeat(TAL_MAX-tl(k))}</small><i>${tl(k)>=TAL_MAX?'completo':TAL_COST+' ★'}</i></button>`).join('')}</div></div>`}
function bindTalents(rerender){$('menu').querySelectorAll('[data-tal]').forEach(b=>b.onclick=()=>{const k=b.dataset.tal;if(tl(k)>=TAL_MAX||starsFree()<TAL_COST)return;META.talents=META.talents||{};META.talents[k]=tl(k)+1;saveMeta();sfx('ach');rerender()})}
const CARD_LV_PRICE=[200,450,800];
const cardLv=k=>(META.cardLv&&META.cardLv[k])||0;
