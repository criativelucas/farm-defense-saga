// ---------- scenarios. Each is wider than the screen; slots are [x, y, soil].
function oliveTree(tx,ty,c){r(tx-2,ty,4,26,c);r(tx-6,ty+8,4,2,c);r(tx+2,ty+4,5,2,c);blob(tx,ty-4,16,8,c,c,c,tx|0);blob(tx-10,ty+2,8,5,c,c,c,(tx|0)+3)}

const MAPS={
 eden:{name:'Jardim do Éden',ww:768,water:[420,462],night:'22,10,48',fog:'255,170,170',rays:'eden',home:'tree',
  prof:[[0,170],[92,170],[128,152],[196,152],[230,166],[262,166],[264,146],[318,146],[350,160],[390,160],[404,170],[476,170],[500,154],[548,154],[566,144],[612,144],[614,160],[668,160],[696,152],[768,152]],
  plats:[{x:30,y:128,w:46},{x:150,y:110,w:34},{x:226,y:124,w:28},{x:292,y:104,w:44,fall:'L'},{x:430,y:128,w:36,fall:'R'},{x:560,y:102,w:40},{x:684,y:110,w:42}],
  slots:[[150,0,'boa'],[248,0,'espinho'],[290,0,'boa'],[372,0,'pedra'],[506,0,'espinho'],[590,0,'boa'],[640,0,'pedra'],[730,0,'boa'],
         [54,128,'boa'],[166,110,'boa'],[240,124,'pedra'],[312,104,'boa'],[446,128,'boa'],[578,102,'espinho'],[702,110,'boa']],
  pal:{fill:'#7c4a34',dark:'#5e3428',lite:'#9a6444',band:'#6c3e2e',top2:'#4a9a3e',top1:'#9ad85a',grass:1},
  fg(w){const a=[];for(let x0=20,k=0;x0<w;x0+=70+hs(k,31)*110,k++){a.push({t:'vine',x:x0,len:10+(hs(k,32)*28|0),s:k});if(hs(k,33)>.55)a.push({t:'fern',x:x0+40,s:k})}return a},
  homeDraw(){// the tree of life at home: rooted trunk, layered crown with golden fruit, a little gate (Gn 2:9)
    r(11,116,12,54,'#6a3a22');r(11,116,4,54,'#9a6040');r(20,118,3,52,'#4a2414');for(const[a,b,w2]of[[4,166,9],[20,165,10],[0,168,6],[26,168,6]])r(a,b,w2,2,'#6a3a22');
    r(15,128,2,6,'#4a2414');r(7,140,5,2,'#6a3a22');r(22,134,6,2,'#6a3a22');
    blob(17,104,24,17,'#1a5c36','#2e9c48','#78dc5a',5);blob(0,116,11,8,'#1a5c36','#2e9c48','#78dc5a',9);blob(33,114,11,8,'#1a5c36','#2e9c48','#78dc5a',11);blob(17,90,13,8,'#1a5c36','#2e9c48','#78dc5a',13);
    for(let i=0;i<9;i++){const fx=2+hs(i,61)*30,fy=92+hs(i,62)*26;r(fx,fy,2,2,'#ffffff');r(fx+.5,fy+.5,1,1,'#fff6c0')}
    r(28,146,2,24,'#c9a24a');r(34,146,2,24,'#c9a24a');r(28,146,1,24,'#f7c948');r(27,144,10,2,'#f7c948');r(27,152,10,1,'#c9a24a');r(28,143,2,1,'#fff6c0');r(34,143,2,1,'#fff6c0')}
 },
 sinai:{name:'Monte Sinai',ww:832,storm:1,night:'8,8,34',fog:'170,140,220',rays:'sinai',home:'tabernacle',
  prof:[[0,168],[88,168],[118,158],[150,158],[166,150],[236,150],[238,166],[300,166],[330,150],[400,150],[428,140],[510,140],[512,158],[580,158],[600,146],[660,146],[690,160],[760,160],[788,154],[832,154]],
  plats:[{x:34,y:126,w:44},{x:176,y:108,w:38},{x:262,y:124,w:30},{x:420,y:98,w:34},{x:536,y:116,w:36},{x:632,y:104,w:42},{x:748,y:118,w:40}],
  rockFall:{x:231,y0:153},
  slots:[[132,0,'pedra'],[200,0,'boa'],[268,0,'espinho'],[362,0,'boa'],[494,0,'boa'],[545,0,'pedra'],[628,0,'boa'],[722,0,'espinho'],[808,0,'boa'],
         [56,126,'boa'],[195,108,'boa'],[277,124,'pedra'],[437,98,'boa'],[554,116,'espinho'],[653,104,'boa'],[768,118,'boa']],
  pal:{fill:'#b4703e',dark:'#8e5232',lite:'#d4945a',band:'#a0603a',top2:'#e0a85a',top1:'#f8d890',grass:0},
  fg(w){const a=[];for(let x0=40,k=0;x0<w;x0+=90+hs(k,51)*120,k++){a.push({t:'rock',x:x0,s:k});if(hs(k,52)>.6)a.push({t:'frond',x:x0+50,s:k})}return a},
  homeDraw(){// the Tabernacle: acacia frame, white linen, a gate of blue, purple and scarlet, a roof of skins (Ex 26-27)
    r(1,148,38,22,'#efe6cc');r(1,148,38,2,'#ffffff');for(let i=1;i<39;i+=5)r(i,148,1,22,'#c9b890');r(1,167,38,3,'#d8cca8');
    r(0,141,40,8,'#8a4a2a');r(0,141,40,2,'#b0603a');r(2,139,36,2,'#6a3420');for(let i=2;i<38;i+=6)r(i,142,3,1,'#a0582f');
    for(let i=0;i<8;i++)r(13+i*2,151,2,19,['#2a5bd7','#7b2fbf','#c0283f'][i%3]);r(13,151,16,1,'#f7c948');
    for(const px of[0,39])r(px,140,1,30,'#c9a24a');r(0,138,1,2,'#f7c948');r(39,138,1,2,'#f7c948')}
 },
 mar:{name:'Mar Vermelho',ww:800,sea:[300,460,158],night:'10,14,44',fog:'200,170,220',rays:'eden',home:'pillar',
  prof:[[0,166],[70,166],[96,158],[170,158],[196,166],[262,166],[300,180],[460,180],[492,164],[560,164],[590,150],[640,150],[664,160],[740,160],[762,154],[800,154]],
  plats:[{x:30,y:124,w:44},{x:176,y:118,w:34},{x:316,y:138,w:34},{x:404,y:134,w:30},{x:500,y:122,w:36},{x:596,y:108,w:40},{x:696,y:118,w:44}],
  slots:[[110,0,'boa'],[150,0,'boa'],[236,0,'espinho'],[520,0,'boa'],[612,0,'pedra'],[700,0,'boa'],[780,0,'espinho'],
         [52,124,'boa'],[193,118,'boa'],[333,138,'boa'],[419,134,'pedra'],[518,122,'boa'],[616,108,'espinho'],[718,118,'boa']],
  pal:{fill:'#b47c50',dark:'#8e5c3c',lite:'#d29c68',band:'#a06c46',top2:'#e8c088',top1:'#fae4b0',grass:0},
  fg(w){const a=[];for(let x0=30,k=0;x0<w;x0+=80+hs(k,61)*120,k++){a.push({t:'rock',x:x0,s:k});if(hs(k,62)>.5)a.push({t:'fern',x:x0+50,s:k})}return a},
  homeDraw(){// a ring of stones where the pillar of fire stands at night (Ex 13:21)
    blob(18,166,14,6,'#4a3a32','#7a6a5a','#a89a88',4);r(9,156,18,10,'#5a4a40');r(9,156,18,2,'#8a7a6a');r(9,156,2,10,'#7a6a5a');r(13,152,10,4,'#3a2a22');r(12,150,12,2,'#6a5a4a');
    for(const[a,b]of[[6,163],[27,162],[16,164]])r(a,b,3,2,'#9a8a78')}
 },
 jerico:{name:'Jericó',ww:800,night:'20,12,30',fog:'255,200,150',rays:'eden',home:'rahab',
  seg:[[0,120,168],[120,200,160],[200,300,166],[300,380,156],[380,470,164],[470,560,154],[560,650,162],[650,730,150],[730,800,160]],
  plats:[{x:60,y:126,w:36,wall:1},{x:220,y:124,w:44,wall:1},{x:236,y:88,w:24,wall:1},{x:400,y:122,w:46,wall:1},{x:414,y:86,w:24,wall:1},{x:590,y:118,w:44,wall:1},{x:602,y:82,w:24,wall:1},{x:740,y:118,w:36,wall:1}],
  slots:[[140,160,'boa'],[280,166,'pedra'],[340,156,'boa'],[500,154,'espinho'],[540,154,'boa'],[690,150,'boa'],[770,160,'pedra'],
         [78,126,'boa'],[242,124,'boa'],[248,88,'boa'],[423,122,'espinho'],[426,86,'boa'],[612,118,'boa'],[614,82,'pedra'],[758,118,'boa']],
  pal:{fill:'#a8744a',dark:'#86583a',lite:'#c8946a',band:'#946240',top2:'#d8b070',top1:'#f2dca0',grass:0,bricks:1},
  fg(w){const a=[];for(let x0=40,k=0;x0<w;x0+=90+hs(k,71)*110,k++){a.push({t:'rock',x:x0,s:k});if(hs(k,72)>.6)a.push({t:'frond',x:x0+50,s:k})}return a},
  homeDraw(){// Rahab's house on the wall: mud brick, flax drying on the flat roof, the scarlet cord in the window (Js 2:6, 2:18)
    r(3,134,30,36,'#c8946a');r(3,134,3,36,'#e0b088');r(30,134,3,36,'#946240');for(let j=138;j<170;j+=5)r(3,j,30,1,'#a8744a');
    r(1,131,34,4,'#946240');r(1,131,34,1,'#d8b080');for(let i=4;i<32;i+=3)r(i,128,2,3,i%2?'#e8d070':'#c8b050');
    r(12,142,9,9,'#2a1408');r(12,142,9,1,'#5a3420');r(19,148,1,22,'#e0284a');r(18,168,3,2,'#e0284a');r(20,150,1,1,'#ff6a7a');
    r(7,158,7,12,'#5a3420');r(7,158,7,1,'#8a5a34');r(12,164,1,1,'#f7c948')}
 },
 babel:{name:'Torre de Babel',ww:820,night:'24,12,40',fog:'230,180,200',rays:'eden',home:'altar',
  seg:[[0,110,168],[110,180,160],[180,240,148],[240,300,134],[300,360,120],[360,460,108],[460,520,120],[520,580,134],[580,640,148],[640,720,160],[720,820,166]],
  plats:[{x:60,y:124,w:40},{x:200,y:104,w:36},{x:320,y:80,w:40},{x:400,y:68,w:36},{x:470,y:80,w:36},{x:560,y:96,w:40},{x:680,y:118,w:40}],
  slots:[[150,160,'boa'],[210,148,'pedra'],[270,134,'boa'],[330,120,'espinho'],[410,108,'boa'],[490,120,'boa'],[550,134,'espinho'],[610,148,'boa'],[690,160,'pedra'],[770,166,'boa'],
         [80,124,'boa'],[218,104,'boa'],[340,80,'boa'],[418,68,'pedra'],[488,80,'boa'],[580,96,'boa'],[700,118,'espinho']],
  pal:{fill:'#7a4a3a',dark:'#5a3428',lite:'#9a6248',band:'#6a3e30',top2:'#b07a50',top1:'#d8a070',grass:0,bricks:1},
  fg(w){const a=[];for(let x0=30,k=0;x0<w;x0+=100+hs(k,81)*120,k++){a.push({t:'rock',x:x0,s:k})}return a},
  homeDraw(){// an altar of unhewn stones with its fire (Ex 20:25)
    for(let j=0;j<4;j++)for(let i=0;i<4-(j>2?1:0);i++){const bx=6+i*6+(j%2)*3,by=164-j*5;r(bx,by,6,5,j%2?'#8a8a9a':'#9a9aa8');r(bx,by,6,1,'#c0c0cc');r(bx+5,by,1,5,'#5a5a6a')}
    r(8,144,20,2,'#6a5a4a');r(8,144,20,1,'#9a8a78')}
 },
 getsemani:{name:'Getsêmani',ww:780,night:'6,10,30',nightBase:.45,fog:'150,170,230',rays:'none',home:'rock',
  seg:[[0,120,168],[120,200,160],[200,280,164],[280,360,152],[360,440,160],[440,520,148],[520,600,158],[600,680,150],[680,780,162]],
  plats:[{x:50,y:126,w:40},{x:180,y:118,w:40},{x:300,y:108,w:40},{x:420,y:116,w:40},{x:520,y:112,w:40},{x:640,y:108,w:40},{x:720,y:120,w:40}],
  slots:[[150,160,'boa'],[240,164,'boa'],[320,152,'espinho'],[400,160,'boa'],[480,148,'pedra'],[560,158,'boa'],[640,150,'boa'],[730,162,'espinho'],
         [70,126,'boa'],[200,118,'pedra'],[320,108,'boa'],[440,116,'boa'],[540,112,'espinho'],[660,108,'boa'],[740,120,'boa']],
  pal:{fill:'#4a3c3a',dark:'#362a2a',lite:'#5e4c48',band:'#40322f',top2:'#2f7a4a',top1:'#6ab45a',grass:1},
  fg(w){const a=[];for(let x0=30,k=0;x0<w;x0+=80+hs(k,91)*100,k++){a.push({t:'vine',x:x0,len:8+(hs(k,92)*20|0),s:k});if(hs(k,93)>.5)a.push({t:'fern',x:x0+40,s:k})}return a},
  homeDraw(){// the rock where he prayed, mossy, with a small oil lamp (Lc 22:41)
    blob(18,160,15,10,'#3a3a4e','#5a5a70','#8a8aa0',7);r(6,152,22,2,'#3a6a3a');r(8,151,8,1,'#5a9a4a');r(24,156,3,1,'#3a6a3a');
    r(14,150,8,3,'#a0583a');r(14,150,8,1,'#d07a50');r(21,149,2,2,'#a0583a');r(17,147,1,3,'#3a2010')}
 }
};
MAPS.tumulo={name:'O Jardim do Sepulcro',ww:560,water:[440,472],night:'0,0,0',fog:'255,220,200',rays:'eden',home:'tomb',
  seg:[[0,140,166],[140,300,160],[300,420,164],[420,560,158]],plats:[],slots:[],
  pal:{fill:'#7a5444',dark:'#5c3c32',lite:'#96705a',band:'#6a483a',top2:'#4fa84e',top1:'#a6e070',grass:1},
  fg(w){return[]},
  homeDraw(){// the tomb with the stone rolled away (Jo 20:1)
    blob(176,140,36,26,'#5a4a4a','#7a6a6a','#9a8a8a',3);r(166,140,20,26,'#140c0c');r(168,142,16,2,'#2a1a1a');
    for(let yy=-13;yy<=13;yy++){const w=Math.sqrt(169-yy*yy);r(214-w,151+yy,w*2,1,yy<-6?'#b0a0a0':'#8a7a7a')}r(209,146,10,2,'#6a5a5a');
    // the tree of life by the river (Ap 22:1-2)
    r(512,96,12,62,'#7a4a2e');r(516,100,3,56,'#9a6a40');r(504,120,8,3,'#7a4a2e');r(524,112,9,3,'#7a4a2e');
    blob(518,86,38,26,'#2a7a3a','#5fc060','#b0f090',77);blob(490,100,16,10,'#2a7a3a','#5fc060','#b0f090',78);blob(546,98,16,10,'#2a7a3a','#5fc060','#b0f090',79)}
};
MAPS.abismo={...MAPS.mar,name:'O Abismo',nightBase:.4,night:'4,8,30'};
// the seventh world: the garden of the resurrection at dawn, the empty tomb as the home to defend (Jo 20:1, 1 Co 15:36)
MAPS.ressurreicao={name:'Jardim da Ressurreição',ww:800,night:'24,14,44',fog:'255,210,190',rays:'eden',home:'tomb',
  prof:[[0,168],[100,168],[130,156],[200,156],[226,164],[290,164],[318,150],[384,150],[410,160],[470,160],[500,148],[566,148],[590,158],[660,158],[690,150],[800,150]],
  plats:[{x:40,y:130,w:40},{x:148,y:114,w:36},{x:250,y:126,w:30},{x:330,y:108,w:40,fall:'R'},{x:436,y:120,w:34},{x:516,y:106,w:40,fall:'L'},{x:610,y:118,w:36},{x:712,y:108,w:44}],
  slots:[[160,0,'boa'],[256,0,'espinho'],[366,0,'boa'],[440,0,'pedra'],[532,0,'boa'],[624,0,'espinho'],[750,0,'boa'],
         [60,130,'boa'],[166,114,'boa'],[265,126,'pedra'],[350,108,'boa'],[453,120,'boa'],[536,106,'espinho'],[628,118,'boa'],[734,108,'boa']],
  pal:{fill:'#7a5444',dark:'#5c3c32',lite:'#96705a',band:'#6a483a',top2:'#4fa84e',top1:'#a6e070',grass:1},
  fg:MAPS.eden.fg,
  homeDraw(){// the tomb hewn in the rock, the stone rolled away, light pouring out, lilies at the door
    blob(16,146,26,22,'#5a4a4a','#7a6a6a','#a89a9a',3);r(6,146,16,22,'#140c0c');r(8,148,12,2,'#2a1a1a');
    for(let i=0;i<5;i++)r(10+i*2,150+i,1,18-i,'#fff6c022');
    for(let yy=-10;yy<=10;yy++){const w=Math.sqrt(100-yy*yy);r(44-w,158+yy,w*2,1,yy<-4?'#b8a8a8':'#8a7a7a')}r(40,154,8,2,'#6a5a5a');
    for(const lx of[26,32,54]){r(lx,160,1,8,'#4faa4a');r(lx-1,158,3,2,'#ffffff');r(lx,157,1,1,'#fff6c0')}}
};
Object.values(MAPS).forEach(m=>{if(Array.isArray(m.slots[0]))m.slots=m.slots.map(([x,y,soil])=>({x,y,soil}))});

let MAP,SKY,FAR,MID,NEAR,GROUND,MAPID='eden';
const PAR=[.15,.45,.75],FGK=1.3;
const VIG=mkCanvas(W,H);{const g=VIG.getContext('2d'),gr=g.createRadialGradient(W/2,H/2,H*.42,W/2,H/2,W*.72);gr.addColorStop(0,'rgba(6,2,14,0)');gr.addColorStop(1,'rgba(6,2,14,.6)');g.fillStyle=gr;g.fillRect(0,0,W,H)}
function gy(px){const T=MAP.gyT,j=Math.round(px*2);return T[j<0?0:j>=T.length?T.length-1:j]}
const inWater=px=>!!MAP.water&&px>=MAP.water[0]&&px<MAP.water[1];
const inSea=px=>!!MAP.sea&&S&&!S.seaOpen&&px>=MAP.sea[0]&&px<MAP.sea[1];
function buildMap(id,day=false,variant=0){
  MAPID=id;MAP=MAPS[id];MUS.world=id;MAP.day=day;MAP.variant=variant;varyTerrain(variant);buildProfile();varyIslands(variant);
  const lw=f=>Math.ceil(W+2+(MAP.ww-W)*f);
  paintScene(lw,day);GROUND=mkHD(MAP.ww,H);
  C=GROUND.getContext('2d');drawGround();outlinedGround(()=>MAP.homeDraw());
  C=x;
  MAP.fgItems=MAP.fg(Math.ceil(MAP.ww*FGK+W));buildProps();
  MAP.tufts=[];MAP.vines=[];MAP.puddles=[];
  for(let i=4;i<MAP.ww-4;i+=3){if(hs(i,9)<.45||inWater(i)||Math.abs(gy(i+2)-gy(i-2))>2)continue;MAP.tufts.push({x:i,y:gy(i),h:1+(hs(i,9)*2|0)})}
  MAP.flats.forEach(([a,b,y])=>{if(b-a>50&&!(MAP.sea&&a>=MAP.sea[0]&&b<=MAP.sea[1])&&!inWater(a+20)&&!inWater(b-20))MAP.puddles.push({x:a+12+(hs(a,7)*(b-a-34)|0),y,w:8+(hs(a,8)*8|0)})});
  MAP.plats.forEach((pl,k)=>{if(pl.wall)return;for(let j=0;j<2+pl.w/10;j++){const vx=Math.round(pl.x+4+hs(k,j+60)*(pl.w-8));{const top=Math.round(pl.y+Math.min(islandDepth(pl,vx),gy(vx)-pl.y-5)-2);MAP.vines.push({x:vx,y:top,len:Math.max(2,Math.min(6+(hs(k,j+70)*18|0),gy(vx)-top-3))})}}});
}
const STORY={
  eden:['Gênesis 3:6','A serpente está enrolada na árvore do conhecimento. Um pisão nela dá poder, mas custa 2 de Vida a cada onda.'],
  jerico:['Josué 6:15','Passe 7 vezes pela torre do meio e as muralhas cairão sobre os inimigos.'],
  mar:['Êxodo 14:22','Leve o povo até a outra margem enquanto as águas estão abertas. Fique perto: eles seguem você.'],
  sinai:['Êxodo 32:20','O bezerro de ouro seduz árvores, que param de atirar. Um pisão liberta. Três pisões no ídolo o derrubam.'],
  babel:['Gênesis 11:7','De tempos em tempos as línguas se confundem: as cartas ficam ilegíveis e trocam de lugar.'],
  getsemani:['Mateus 26:41','As árvores adormecem se você não passar perto delas. Vigiai e orai.'],
  abismo:['Isaías 27:1','O Leviatã, a serpente veloz, sobe do fundo do mar.'],
  tumulo:['João 20:15','Caminhe até a Árvore da Vida.'],
  ressurreicao:['1 Coríntios 15:36','A cada nova onda o sol nasce: toda árvore acorda, se renova e sobe um nível.']
};
