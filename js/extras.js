// ---------- the gardener's special ability (C), one per character, 30s recharge
const ABIL={lavrador:['Mutirão','Rega todas as árvores de uma vez'],noe:['Chuva de Noé','Chuva por 8 segundos'],rute:['Respiga','Frutos e maná do chão vêm até você'],
  davi:['Funda','Uma pedra de 40 na praga mais forte'],elias:['Fogo do céu','18 de dano em tudo perto de você'],jose:['Celeiro cheio','+4 de maná'],
  debora:['Toque de guerra','Todas as árvores atiram já, e mais rápido por 6s'],moises:['Cajado','Congela as pragas por 3s']};
const ABIL_CD=30,abilCD=(k=(RUN&&RUN.char)||META.char)=>(ABIL_CD-3*atr('poder',k))*(1-.15*tl('cd'));
function useAbility(){if(!live()||S.paused||S.intro||S.dialog)return;const P=S.p;
  if((S.abil||0)>0){sfx('no');pop(P.x,P.y-26,'recarregando '+Math.ceil(S.abil)+'s','#c9a99a');return}
  const k=(RUN&&RUN.char)||META.char,A=ABIL[k]||ABIL.lavrador;S.abil=abilCD();sfx('super');vfx('ring2',P.x,P.y-8,{r:46,c:'#ffe36a'});pop(P.x,P.y-30,A[0]+'!','#ffe36a',10);mission('abil',1);
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
function drawTelegraph(e){const d=EN[e.k];if(!d.boss||e.dive>0||e.st>.9||(S.t*10|0)%2)return;const top=(d.fly?e.y-d.h/2:e.y-d.h/BOSS_SCALE)-14;
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
// one chunky icon per kind of mission, drawn on the 24x24 item grid
const QICON={kill(){C.save();C.translate(12,22);C.scale(1.7,1.7);enemyBody({k:'odio',x:0,y:0,t:1});C.restore()},
  water(){C.save();C.translate(0,1);C.scale(.75,.75);ICONS.regar();C.restore()},plant(){C.save();C.translate(12,22);C.scale(.8,.8);drawTower('videira',0,0,1);C.restore()},
  slam(){r(7,6,7,10,'#7a4a2a');r(7,6,7,2,'#a06a3a');r(7,15,12,4,'#5a3018');r(7,15,12,1,'#8a5a30');for(let i=0;i<4;i++)r(3+i*5,21,3,2,'#c9a99a')},
  bless(){C.save();C.translate(0,1);C.scale(.75,.75);ICONS.chuva();C.restore()},win(){r(6,3,2,19,'#5a3a1a');r(8,4,11,7,'#e0284a');r(8,4,11,2,'#ff6a7a');r(4,21,8,2,'#4faa4a')},
  star3(){for(const[sx,sy]of[[3,10],[12,4],[15,13]]){r(sx+2,sy,2,6,'#f7c948');r(sx,sy+2,6,2,'#f7c948');r(sx+1,sy+1,4,4,'#f7c948');r(sx+2,sy+1,1,1,'#fff6c0')}},
  evolve(){C.save();C.translate(9,22);C.scale(.65,.65);drawTower('roma',0,0,1);C.restore();r(17,8,3,10,'#4cc46e');r(15,9,7,2,'#4cc46e');r(16,7,5,2,'#9ff7b8')},
  abil(){disc(12,12,8,'#c88a1a');disc(12,12,6,'#f7c948');disc(12,12,3,'#fff6c0');for(let i=0;i<8;i++){const a=i/8*Math.PI*2;r(12+Math.cos(a)*10-1,12+Math.sin(a)*10-1,2,2,'#fff6c0')}}};
function showMissions(){const M=ensureMissions(),now=new Date(),mid=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1),left=Math.max(0,mid-now),
    hh=Math.floor(left/36e5),mm=Math.floor(left%36e5/6e4),done=M.list.filter(m=>m.got).length;
  menu(`<div class="mbox wide modern quests"><div class="topbar"><button class="btn ghost" data-go="hub">‹ Menu</button><h2>Missões do dia</h2>${coinsTag()}</div>
    <div class="qhead"><span>Novas missões em <b>${hh}h ${String(mm).padStart(2,'0')}min</b></span><span class="qdots">${M.list.map(m=>`<i class="${m.got?'on':''}"></i>`).join('')}<b>${done}/${M.list.length}</b></span></div>
    <div class="questlist">${M.list.map((m,i)=>{const st=m.got?'got':m.p>=m.n?'ready':'';return`<div class="quest ${st}" style="--n:${i}">
      <div class="qicon"><canvas width="24" height="24" data-qicon="${m.k}"></canvas></div>
      <div class="qtxt"><b>${m.t}</b><div class="qbar"><i style="width:${Math.min(100,m.p/m.n*100)}%"></i><span>${Math.min(m.p,m.n)} / ${m.n}</span></div></div>
      <div class="qrew">${m.got?'<span class="qdone">✓ Feito</span>':m.p>=m.n?`<button class="btn" data-claim="${i}">Receber ${MISSION_PAY}</button>`:`<span class="qcoin"><canvas width="12" height="12" class="coin"></canvas>${MISSION_PAY}</span>`}</div></div>`}).join('')}</div>
    <p class="help">Três missões novas por dia. Cada uma vale ${MISSION_PAY} moedas.</p></div>`);
  paintCoins();$('menu').querySelectorAll('canvas[data-qicon]').forEach(c=>{const k=c.dataset.qicon;itemIconTo(c,'q:'+k,QICON[k]||QICON.abil)});
  $('menu').querySelectorAll('[data-claim]').forEach(b=>b.onclick=()=>{const m=M.list[+b.dataset.claim];m.got=true;META.coins+=MISSION_PAY;saveMeta();sfx('coin');showMissions()})}

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
function wipe(){const el=$('wipe');if(!el.dataset.ok){el.dataset.ok=1;const g=hdCtx($('wipec'),48,48,2),keep=C;C=g;disc(24,24,22,'#1a0c06');disc(24,24,21,'#ffd23a');disc(24,24,19,'#8a5a1a');disc(24,24,17,'#2a1a3a');
  r(22,22,4,14,'#7a4a2e');r(18,34,12,2,'#7a4a2e');blob(24,18,13,9,'#2a7a3a','#5fc060','#b0f090',7);[[16,14],[30,12],[22,9],[32,20],[14,21]].forEach(([a,b],i)=>r(a,b,2,2,['#ff4f7b','#c58cff','#f7c948','#5af0ff','#ffa64a'][i]));C=keep}
  // shown only while it plays: display restarts every animation inside, and after 1.1s it is taken off the screen whatever happens
  el.style.display='none';void el.offsetWidth;el.style.display='block';clearTimeout(wipe.t);wipe.t=setTimeout(()=>{el.style.display='none'},1100)}

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

// ---------- the road: one place that says what each win opens (cards, bag space, pests, systems, shop shelves, modes)
const SHOP_AT={ferramentas:0,cartas:2,barreiras:3,jardim:4,arvore:4,melhorias:5};
const SHOP_NAME={ferramentas:'Ferramentas',cartas:'Cartas',barreiras:'Barreiras',jardim:'Jardim',arvore:'Árvore da Vida',melhorias:'Melhorias'};
const winsN=()=>Object.keys(META.done).length;
const shopOpen=k=>winsN()>=SHOP_AT[k];
function unlocksAfter(n){const L=[],lv=LEVELS[n];if(!lv)return L;
  const card=UNLOCK_ORDER[n];if(card)L.push(['card','Carta: '+CARDS[card].name]);
  if(n+1<LEVELS.length){const b0=levelBag(n)[1],b1=levelBag(n+1)[1];if(b1>b0)L.push(['bag','+1 espaço na bolsa ('+b1+' cartas)']);
    levelPool(n+1).filter(k=>!levelPool(n).includes(k)).forEach(k=>L.push(['pest','Praga nova: '+EN[k].name]))}
  for(const k in SYS_AT)if(SYS_AT[k]===n+1)L.push(['sys','Novidade: '+SYS_TXT[k][0]]);
  for(const k in SHOP_AT)if(SHOP_AT[k]===n+1)L.push(['shop','Quitanda: '+SHOP_NAME[k]]);
  for(const k in MINIS)if(MINIS[k].at===n+1)L.push(['mode','Minijogo: '+MINIS[k].name]);
  const nx=LEVELS[n+1];if(nx&&nx.goal)L.push(['sys','Fase especial: '+GOALS[nx.goal].name]);
  if(lv.id==='1-4')L.push(['mode','Estufa do jardim']);if(lv.id==='2-4')L.push(['mode','Modo Jornada']);if(lv.l===3)L.push(['mode','Fase do chefe: '+EN[BSTAGE[lv.wi].boss].name]);if(lv.bossStage)L.push(['mode','Modo infinito: '+WORLDS[lv.wi].name]);
  return L}

// ---------- a small log of adventure battles (last 80), to tune balance from real games instead of guesses
function logRun(win){const L=RUN&&LEVELS[RUN.level];if(!L||RUN.mini||RUN.endless)return;const worst=Object.entries(S.leaks||{}).sort((a,b)=>b[1]-a[1])[0];
  META.log=(META.log||[]).slice(-79);META.log.push({d:Date.now(),lv:L.id,ch:RUN.char,w:win?1:0,wave:(S.wi||0)+1,hp:RUN.hp,k:S.kills||0,s:Math.round(S.t),by:worst?worst[0]:null});saveMeta()}
function logHTML(){const L=META.log||[];if(!L.length)return'<p class="help">Nenhuma fase jogada ainda. Cada vitória ou derrota na Aventura fica anotada aqui.</p>';
  const wins=L.filter(r=>r.w).length,by={},per=WORLDS.map(()=>[0,0]),chars={};
  L.forEach(r=>{const wi=+r.lv.split('-')[0]-1;if(per[wi]){per[wi][1]++;if(r.w)per[wi][0]++}if(!r.w&&r.by)by[r.by]=(by[r.by]||0)+1;const c=chars[r.ch]=chars[r.ch]||[0,0];c[1]++;if(r.w)c[0]++});
  const pct=(a,b)=>b?Math.round(a/b*100)+'%':'—',top=Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,3);
  return`<div class="logsum"><span><b>${L.length}</b> fases</span><span><b>${pct(wins,L.length)}</b> vitórias</span><span>Mais derrotas por: <b>${top.map(([k,n])=>EN[k].name+' ('+n+')').join(', ')||'—'}</b></span></div>
    <div class="logworlds">${WORLDS.map((w,i)=>`<div><small>${w.name}</small><i><u style="width:${per[i][1]?per[i][0]/per[i][1]*100:0}%"></u></i><b>${per[i][1]?pct(...per[i]):'—'}</b></div>`).join('')}</div>
    <p class="help">Por personagem: ${Object.entries(chars).map(([k,[a,b]])=>CHARS[k].name+' '+pct(a,b)+' de '+b).join(' · ')}</p>
    <div class="logrows">${L.slice(-8).reverse().map(r=>`<span class="${r.w?'w':'l'}">${r.lv} · ${CHARS[r.ch]?CHARS[r.ch].name:r.ch} · ${r.w?'venceu com '+r.hp+' de Vida':'caiu na onda '+r.wave+(r.by?' ('+EN[r.by].name+')':'')} · ${r.s}s</span>`).join('')}</div>`}

// ---------- short story scenes before each new world: the next garden behind, cinema bars, a portrait and lines typed out
// 'eu' is whoever the player is using
const SCENE_TXT=[null,
  [['narrador','Do jardim, o caminho segue até uma cidade de muralhas altas: Jericó.'],['debora','Josué rodeou a cidade sete vezes. Não há muralha que resista à fé.'],['eu','Então eu dou as sete voltas. Vamos!']],
  [['narrador','O Faraó endureceu o coração e perseguiu o povo até a beira do mar.'],['moises','“Não temais; aquietai-vos e vede o livramento do Senhor.” (Êxodo 14:13)'],['eu','Eu levo o povo até a outra margem.']],
  [['narrador','No deserto, enquanto Moisés subia o monte, o povo fez um bezerro de ouro.'],['moises','“Não terás outros deuses diante de mim.” (Êxodo 20:3)'],['eu','Três pisões e esse ídolo cai.']],
  [['narrador','Na planície de Sinar, os homens quiseram uma torre até o céu, para fazer um nome para si.'],['noe','Depois do dilúvio, a terra tinha uma só língua. Mas o orgulho confunde tudo.'],['eu','Mesmo com as cartas trocadas, o jardim fica de pé.']],
  [['narrador','Num jardim de oliveiras, à noite, o Mestre pediu: “Vigiai e orai.” (Mateus 26:41)'],['elias','Eu também me cansei um dia, debaixo de um zimbro. Mas o Senhor disse: levanta e come.'],['eu','Vou passar perto das árvores para que não adormeçam.']],
  [['narrador','Ao terceiro dia, bem cedo, as mulheres foram ao sepulcro. A pedra tinha sido removida.'],['rute','“Por que buscais entre os mortos ao que vive?” (Lucas 24:5)'],['eu','A última sombra ainda ronda o jardim. Agora ela não vence mais.']]];
function showScene(wi,onDone){const L=SCENE_TXT[wi];if(!L){onDone();return}
  const w=WORLDS[wi];blankBattle(w.map,true);S.state='title';S.cam=0;MUS.mode='calm';let i=0,typing=null,done=false;
  menu(`<div class="cutscene"><i class="csbar top"></i><i class="csbar bot"></i>
    <div class="cstitle"><small>Capítulo ${wi+1}</small><b>${w.name}</b></div>
    <div class="csline" id="csline"><div class="csport"><canvas width="32" height="40" id="csp"></canvas></div><div class="cstext"><b id="csname"></b><p id="cstxt"></p><small>Toque ou Enter ▸</small></div></div>
    <button type="button" class="btn ghost csskip" id="csskip">Pular</button></div>`);
  $('menu').classList.add('scene');
  const pan=setInterval(()=>{if(!S||S.state!=='title'||!$('csline')){clearInterval(pan);return}S.cam=Math.min(MAP.ww-W,S.cam+.35)},30);
  const finish=()=>{if(done)return;done=true;clearInterval(pan);clearInterval(typing);removeEventListener('keydown',key,true);onDone()};
  const show=()=>{const[who,txt]=L[i],k=who==='eu'?META.char:who,el=$('csline');el.classList.remove('in');void el.offsetWidth;el.classList.add('in');
    $('csname').textContent=k==='narrador'?'Narrador':CHARS[k].name;
    const c=$('csp');if(k==='narrador'){const g=hdCtx(c,32,40);C=g;g.save();g.translate(0,4);ICONS.profecia();g.restore();C=x}else charIconTo(c,k);
    let n=0;const p=$('cstxt');p.textContent='';clearInterval(typing);typing=setInterval(()=>{n+=2;p.textContent=txt.slice(0,n);if(n>=txt.length)clearInterval(typing)},22);sfx('card')};
  const next=()=>{const p=$('cstxt');if(p&&p.textContent.length<L[i][1].length){clearInterval(typing);p.textContent=L[i][1];return}if(++i>=L.length)finish();else show()};
  const key=e=>{if(e.code==='Enter'||e.code==='Space'){e.preventDefault();e.stopPropagation();next()}else if(e.code==='Escape'){e.stopPropagation();finish()}};
  addEventListener('keydown',key,true);$('csline').onclick=next;$('csskip').onclick=finish;show()}
