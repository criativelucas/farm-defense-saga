// ---------- the fruit of the Spirit (Gl 5:22-23) and the trees that bear it
const FRUIT={videira:'Alegria',roma:'Amor',oliveira:'Paz',sarca:'Domínio',mostarda:'Fé',figueira:'Paciência',tamareira:'Benignidade',amendoeira:'Bondade',lirio:'Mansidão'};
const FRUIT_ORDER=['Amor','Alegria','Paz','Paciência','Benignidade','Bondade','Fé','Mansidão','Domínio'];
const FRUIT_COL={Amor:'#ff4f7b',Alegria:'#c58cff',Paz:'#b8cf9a',Paciência:'#7ac050',Benignidade:'#ffa64a',Bondade:'#ffc8e4',Fé:'#e8e070',Mansidão:'#f4f4ff',Domínio:'#ff9a3c'};
const TYPE_LABEL={semente:'Semente',bencao:'Bênção',parabola:'Parábola',joio:'Joio'};
const CARDS={
  videira:{type:'semente',name:'Videira',cost:3,ref:'João 15:5',desc:'Atira uvas. Forte contra Inveja e Feitiçaria.'},
  roma:{type:'semente',name:'Romã',cost:4,ref:'Cânticos 4:13',desc:'Raio vertical quando o mal chega perto. Forte contra Ódio e Facções.'},
  oliveira:{type:'semente',name:'Oliveira',cost:4,ref:'Gênesis 8:11',desc:'Azeite que deixa lento. Forte contra Discórdia e Contenda.'},
  sarca:{type:'semente',name:'Sarça',cost:6,ref:'Êxodo 3:2',desc:'Fogo em área. Forte contra Glutonaria, Embriaguez e Ambição.'},
  figueira:{type:'semente',name:'Figueira',cost:4,ref:'Lucas 13:8',desc:'Paciência: quanto mais tempo sem atirar, mais forte o próximo figo.'},
  tamareira:{type:'semente',name:'Tamareira',cost:4,ref:'Salmos 92:12',desc:'Benignidade: cura 1 de Vida a cada 12s e atira tâmaras.'},
  amendoeira:{type:'semente',name:'Amendoeira',cost:5,ref:'Números 17:8',desc:'Bondade: vizinhas atiram 35% mais rápido e não viram joio. Forte contra Impureza.'},
  lirio:{type:'semente',name:'Lírio do Campo',cost:3,ref:'Mateus 6:28',desc:'Mansidão: um sopro empurra os inimigos para trás a cada 3s.'},
  mostarda:{type:'parabola',name:'Grão de Mostarda',cost:2,plant:1,ref:'Mateus 13:31',desc:'Começa minúscula. Depois de 2 ondas vira a maior árvore do jardim.'},
  talentos:{type:'parabola',name:'Talentos',cost:3,ref:'Mateus 25:15',desc:'Investe 3 e recebe 6 na próxima onda. Maná cheio parado por 5s enterra o talento.'},
  semeador:{type:'parabola',name:'Semeador',cost:4,ref:'Mateus 13:3',desc:'Lança 3 sementes ao acaso. O solo decide qual vinga.'},
  chuva:{type:'bencao',name:'Chuva Serôdia',cost:3,ref:'Joel 2:23',desc:'8s de tiros 60% mais rápidos e pisão recarregado. A mostarda cresce.'},
  mana:{type:'bencao',name:'Maná do Céu',cost:1,ref:'Êxodo 16:15',desc:'Recebe 5 de maná na hora.'},
  jerico:{type:'bencao',name:'Muralha de Jericó',cost:5,ref:'Josué 6:20',desc:'Trombetas: 14 de dano em todo inimigo no chão que está na tela.'},
  profecia:{type:'bencao',name:'Profecia',cost:1,ref:'Amós 3:7',desc:'Revela a próxima onda e dá +2 de maná.'},
  joio:{type:'joio',name:'Joio',cost:2,ref:'Mateus 13:25',desc:'Ocupa a mão. Jogue para arrancar da bolsa.'}
};
const SEED_KEYS=['videira','roma','oliveira','sarca','figueira','tamareira','amendoeira','lirio'];
const POOL=[...SEED_KEYS,'videira','roma','oliveira','mostarda','talentos','semeador','chuva','mana','jerico','profecia','hissopo','cedro','luz','paz','fogo','pedra','fermento','ovelha'];
const START=['videira','videira','videira','roma','roma','oliveira','sarca','mana','chuva','semeador','oliveira','jerico','mostarda','talentos','mana','lirio','figueira'];

// ---------- works of the flesh (Gl 5:19-21), the elite and the three bosses
const EN={
  odio:{name:'Ódio',hp:5,spd:22,rew:5,dmg:1,fly:0,w:8,h:10,c:'#c0283f',glow:'#ff3a4a',weak:'roma',desc:'Avança direto, sem pena.'},
  inveja:{name:'Inveja',hp:4,spd:32,rew:4,dmg:1,fly:1,w:8,h:7,c:'#7fd04a',glow:'#9dff5a',weak:'videira',desc:'Voa baixo, de olho no que é seu.'},
  discordia:{name:'Discórdia',hp:2.5,spd:40,rew:3,dmg:1,fly:0,w:5,h:6,c:'#ff8a3c',glow:'#ffa040',weak:'oliveira',desc:'Pequena, rápida e em bando.'},
  gula:{name:'Glutonaria',hp:28,spd:11,rew:14,dmg:2,fly:0,w:16,h:14,c:'#8e5bc0',glow:'#c070ff',weak:'sarca',desc:'Lenta e com muita vida.'},
  feitico:{name:'Feitiçaria',hp:9,spd:27,rew:7,dmg:1,fly:2,w:8,h:9,c:'#5ad6e0',glow:'#5af0ff',weak:'videira',desc:'Voa alto, longe das raízes.'},
  ambicao:{name:'Ambição',hp:42,spd:12,rew:18,dmg:3,fly:0,w:18,h:19,c:'#d9a521',glow:'#ffd34a',weak:'sarca',desc:'Grande, coroada e teimosa.'},
  embriaguez:{name:'Embriaguez',hp:8,spd:22,rew:6,dmg:1,fly:0,w:8,h:11,c:'#b0306a',glow:'#ff5aa0',weak:'sarca',ai:'zigzag',desc:'Cambaleia em zigue-zague e às vezes volta.'},
  contenda:{name:'Contenda',hp:10,spd:22,rew:6,dmg:1,fly:0,w:8,h:10,c:'#d06a2a',glow:'#ffb060',weak:'oliveira',split:1,desc:'Quando cai, vira duas.'},
  contendinha:{name:'Contenda',hp:3,spd:34,rew:2,dmg:1,fly:0,w:4,h:5,c:'#d06a2a',glow:'#ffb060',weak:'oliveira',hide:1,desc:'Metade de uma contenda.'},
  impureza:{name:'Impureza',hp:12,spd:16,rew:8,dmg:1,fly:0,w:10,h:8,c:'#6a6a2a',glow:'#d8d860',weak:'amendoeira',ai:'corrupt',desc:'Quando passa por uma árvore, ela vira joio. Um pisão limpa.'},
  faccoes:{name:'Facções',hp:7,spd:20,rew:4,dmg:1,fly:0,w:6,h:10,c:'#4a5aa0',glow:'#7a9aff',weak:'roma',desc:'Andam em trio. Quem está perto delas leva metade do dano.'},
  ira:{name:'Ira',hp:9,spd:17,rew:6,dmg:2,fly:0,w:8,h:11,c:'#ff5a1a',glow:'#ff8a3a',weak:'oliveira',ai:'rage',desc:'Quando apanha, se enfurece e corre o dobro.'},
  ciume:{name:'Ciúmes',hp:6,spd:22,rew:5,dmg:1,fly:1,w:7,h:8,c:'#3aa88a',glow:'#5af0c0',weak:'roma',ai:'blink',desc:'Some e reaparece mais à frente.'},
  heresia:{name:'Heresias',hp:14,spd:13,rew:8,dmg:1,fly:0,w:9,h:15,c:'#6a4a8a',glow:'#b08aff',weak:'mostarda',ai:'heal',desc:'Cura as pragas ao redor. Derrube primeiro.'},
  bezerro:{name:'Bezerro de Ouro',hp:220,spd:7,rew:40,dmg:8,fly:0,w:34,h:26,c:'#f7c948',glow:'#fff08a',weak:null,elite:1,ref:'Êxodo 32:4',desc:'Elite. O ídolo de ouro.'},
  golias:{name:'Golias',hp:420,spd:8,rew:60,dmg:12,fly:0,w:22,h:36,c:'#a08a5a',glow:'#ffd34a',weak:null,boss:1,ref:'1 Samuel 17:4',desc:'Chefe. Atira pedras que atordoam você. Com metade da vida, se enfurece.'},
  farao:{name:'Faraó',hp:460,spd:7,rew:60,dmg:10,fly:0,w:40,h:30,c:'#f7c948',glow:'#5a8aff',weak:null,boss:1,ref:'Êxodo 14:9',desc:'Chefe. Chama pragas de reforço. Furioso, chama ainda mais.'},
  leviata:{name:'Leviatã',hp:620,spd:7,rew:80,dmg:12,fly:0,w:44,h:24,c:'#2a6a7a',glow:'#5af0c0',weak:null,boss:1,ref:'Isaías 27:1',desc:'Chefe. Mergulha, fica intocável e surge atordoando as árvores.'}
};
EN.sombra={name:'A Sombra da Morte',hp:720,spd:6,rew:90,dmg:12,fly:0,w:34,h:44,c:'#4a3a6a',glow:'#3a2a5a',weak:null,boss:1,ref:'Salmos 23:4',desc:'Chefe final. Faz adormecer as árvores perto dela; um pisão acorda. Furiosa, chama pragas.'};
// more works of the flesh, each with its own trick (like the zombies of a tower defense, but from the Bible's lists of sins)
Object.assign(EN,{
  soberba:{name:'Soberba',hp:9,armor:14,spd:18,rew:7,dmg:1,fly:0,w:10,h:13,c:'#c89a28',glow:'#ffd34a',weak:'lirio',ai:'armor',ref:'Provérbios 16:18',desc:'Usa uma coroa que aguenta os primeiros golpes. Sem ela, cai e anda devagar.'},
  preguica:{name:'Preguiça',hp:22,spd:9,rew:8,dmg:2,fly:0,w:14,h:10,c:'#8a9aa8',glow:'#c8d8e8',weak:'videira',ai:'nap',ref:'Provérbios 6:9',desc:'Lenta e cheia de vida. Às vezes cochila: dormindo, leva o dobro de dano.'},
  mentira:{name:'Mentira',hp:7,spd:26,rew:6,dmg:1,fly:0,w:8,h:11,c:'#c8c8e0',glow:'#e8e8ff',weak:'roma',ai:'disguise',ref:'João 8:44',desc:'Anda disfarçada e as árvores não a veem. Chegue perto ou deixe-a avançar para revelá-la.'},
  avareza:{name:'Avareza',hp:12,spd:20,rew:6,dmg:1,fly:0,w:10,h:12,c:'#3a9a4a',glow:'#9ff7b8',weak:'amendoeira',ai:'greed',ref:'Lucas 12:15',desc:'Junta o maná e as moedas do chão e fica mais forte. Derrotada, devolve tudo em dobro.'},
  murmuracao:{name:'Murmuração',hp:10,spd:16,rew:7,dmg:1,fly:0,w:10,h:12,c:'#9a7a5a',glow:'#d8b890',weak:'oliveira',ai:'summon',ref:'Números 14:2',desc:'Reclama sem parar, e cada reclamação vira um murmurinho que corre na frente.'},
  murmurinho:{name:'Murmurinho',hp:2,spd:34,rew:1,dmg:1,fly:0,w:4,h:5,c:'#b89870',glow:'#e8c8a0',weak:'oliveira',hide:1,desc:'Uma reclamação pequena.'},
  calunia:{name:'Calúnia',hp:8,spd:22,rew:6,dmg:1,fly:0,w:9,h:11,c:'#a04a8a',glow:'#ff8ad8',weak:'tamareira',ai:'spit',ref:'Provérbios 10:18',desc:'Para de longe e atira palavras que atordoam as árvores por 2 segundos.'},
  rebeldia:{name:'Rebeldia',hp:11,spd:24,rew:6,dmg:1,fly:0,w:9,h:12,c:'#c83030',glow:'#ff6a4a',weak:'figueira',ai:'vault',ref:'1 Samuel 15:23',desc:'Pula por cima de cercas, espantalhos e lama, e de vez em quando dá um salto para a frente.'},
  vaidade:{name:'Vaidade',hp:9,spd:20,rew:6,dmg:1,fly:0,w:9,h:12,c:'#d890d8',glow:'#ffc8ff',weak:'sarca',ai:'mirror',ref:'Eclesiastes 1:2',desc:'Carrega um espelho que reflete os 3 primeiros tiros das árvores. Golpe e pisão quebram o espelho.'},
  amargura:{name:'Amargura',hp:14,spd:20,rew:7,dmg:2,fly:0,w:10,h:10,c:'#6a4a2a',glow:'#c8a060',weak:'mostarda',ai:'burrow',ref:'Hebreus 12:15',desc:'Uma raiz que avança por baixo da terra, intocável, e brota no meio do caminho. Um pisão em cima a arranca.'},
  medo:{name:'Medo',hp:6,spd:30,rew:5,dmg:1,fly:1,w:8,h:9,c:'#5a5a8a',glow:'#a8a8ff',weak:'lirio',ai:'fear',ref:'2 Timóteo 1:7',desc:'Grita e as árvores perto dele travam por um instante. Foge quando você chega perto.'}
});
const VICE_REF='Gálatas 5:19-21';

// ---------- journey: three acts, each with two scenarios and a boss
const ACTS=[
  {name:'Ato I',title:'O Jardim',pool:['eden','jerico'],boss:'golias',arena:'jerico'},
  {name:'Ato II',title:'O Êxodo',pool:['mar','sinai'],boss:'farao',arena:'mar'},
  {name:'Ato III',title:'A Vigília',pool:['babel','getsemani'],boss:'leviata',arena:'abismo'}
];
const WAVE_POOL=[['odio','inveja','discordia','embriaguez','ira','ciume','gula'],
  ['inveja','discordia','gula','embriaguez','ira','ciume','contenda','feitico','rebeldia','soberba','faccoes','avareza','murmuracao'],
  ['gula','feitico','contenda','faccoes','soberba','avareza','preguica','impureza','calunia','heresia','mentira','vaidade','ambicao','medo','amargura']];
// adventure levels meet the works of the flesh one at a time, in this order; each level mixes the six newest it knows
// which work of the flesh first appears on which adventure level (0 = 1-1 ... 27 = 7-4): simple ones in Eden,
// the tricky ones (invisible, reflecting, stunning, underground) only in the last worlds; boss levels bring nothing new
const PEST_INTRO={0:['odio','discordia'],1:['inveja'],2:['embriaguez'],
  4:['ira'],5:['ciume'],6:['gula'],
  8:['contenda'],9:['feitico'],10:['rebeldia'],
  12:['soberba'],13:['faccoes'],14:['avareza'],
  16:['preguica'],17:['murmuracao'],18:['impureza'],19:['calunia'],
  20:['heresia'],21:['mentira'],22:['vaidade'],
  24:['ambicao'],25:['medo'],26:['amargura']};
const PEST_ORDER=Object.keys(PEST_INTRO).sort((a,b)=>a-b).flatMap(n=>PEST_INTRO[n]);
// each level mixes the seven newest it knows, so old easy pests give way to harder ones
const levelPool=n=>{const known=Object.keys(PEST_INTRO).filter(i=>+i<=n).sort((a,b)=>a-b).flatMap(i=>PEST_INTRO[i]);return known.slice(-7)};
const COST={odio:2,inveja:2,discordia:1,gula:6,embriaguez:3,feitico:3,contenda:4,faccoes:3,ambicao:8,impureza:5,ira:3,ciume:3,heresia:4,
  soberba:4,preguica:5,mentira:3,avareza:3,murmuracao:4,calunia:4,rebeldia:3,vaidade:4,amargura:4,medo:3};
function genWave(act,i,kind,ascN,only){
  const pool=only||WAVE_POOL[act],L=[],theme=rpick(pool);
  let budget=(16+act*15+i*7+(kind==='elite'?8:0))*(ascN>=5?1.2:1);
  while(budget>0){
    const k=RNG()<.45?theme:rpick(pool),c=COST[k];
    if(k==='faccoes'){for(let j=0;j<3;j++)L.push([k,.22]);L[L.length-1][1]=1.2}
    else if(k==='inimizade')L.push([k,.3],[k,rr(.7,1.1)]);
    else L.push([k,rr(.45,1.1)*(c>5?1.8:1)]);
    budget-=c;
  }
  let name=EN[theme].name;
  if(kind==='elite'&&i===2){L.splice(L.length>>1,0,['bezerro',2.5]);name='O Ídolo'}
  if(kind==='chefe'&&i===2){const b=ACTS[act].boss;L.unshift([b,2.5]);name=EN[b].name}
  return{list:L,name};
}
const NODES={
  batalha:{name:'Batalha',desc:'3 ondas. Siclos e uma carta nova.'},
  elite:{name:'Elite',desc:'Ondas fortes com o Bezerro de Ouro. Vale uma relíquia.'},
  evento:{name:'Evento',desc:'Uma história bíblica e uma escolha.'},
  mercado:{name:'Mercado',desc:'Compre cartas e relíquias com siclos.'},
  descanso:{name:'Tenda',desc:'Descanse ou pode uma carta.'},
  altar:{name:'Altar',desc:'Enxerte sementes ou consagre uma carta.'},
  chefe:{name:'Chefe',desc:'O guardião do ato.'}
};

// ---------- relics (passive)
const RELICS={
  vara:{name:'Vara de Arão',ref:'Números 17:8',desc:'No começo de cada onda, uma semente brota sozinha num canteiro vazio de boa terra.'},
  funda:{name:'Funda de Davi',ref:'1 Samuel 17:49',desc:'O pisão dá o dobro de dano, e o triplo contra chefes.'},
  pomba:{name:'Pomba de Noé',ref:'Gênesis 8:11',desc:'Você sempre vê a próxima onda.'},
  arca:{name:'Arca da Aliança',ref:'Êxodo 25:10',desc:'Começa cada batalha com +4 de maná.'},
  cajado:{name:'Cajado de Moisés',ref:'Êxodo 14:16',desc:'Inimigos dentro da água andam pela metade da velocidade.'},
  manto:{name:'Manto de José',ref:'Gênesis 37:3',desc:'As recompensas oferecem uma carta a mais.'},
  jarro:{name:'Jarro da Viúva',ref:'1 Reis 17:16',desc:'O maná recarrega 20% mais rápido.'},
  paes:{name:'Cinco Pães e Dois Peixes',ref:'João 6:9',desc:'Ao fim de cada batalha, cura 3 de Vida.'},
  trombeta:{name:'Trombeta de Gideão',ref:'Juízes 7:20',desc:'O primeiro pisão de cada onda solta a Muralha de Jericó.'},
  lampada:{name:'Lâmpada Acesa',ref:'Mateus 25:4',desc:'A noite escurece menos e, nela, as árvores dão +10% de dano.'}
};

// ---------- characters
const CHARS={
  lavrador:{name:'Lavrador',ref:'João 15:1',desc:'Equilibrado. Bom para começar.',pal:{tunic:'#e8dcc0',hat:'#e8c86a',band:'#c23b4f',hair:null}},
  noe:{name:'Noé',ref:'Gênesis 6:14',desc:'Começa com 4 sementes a mais e leva 11 cartas na bolsa.',hint:'Guarde 4 cartas no celeiro',pal:{tunic:'#8aa0c8',hat:null,band:null,hair:'#f0f0f0',beard:'#f0f0f0'}},
  rute:{name:'Rute',ref:'Rute 2:3',desc:'Respigadora: o maná que cai dos inimigos vale o dobro.',hint:'Vença o Ato I',pal:{tunic:'#c8a0d8',hat:null,band:null,hair:'#5a3a2a',scarf:'#e8dcc0'}},
  davi:{name:'Davi',ref:'1 Samuel 17:40',desc:'Pisão 2x mais forte e com área maior.',hint:'Derrote Golias',pal:{tunic:'#d8b080',hat:null,band:null,hair:'#c0602a'}},
  elias:{name:'Elias',ref:'1 Reis 18:45',desc:'Toda batalha começa com chuva, e a chuva dura o dobro.',hint:'As 12 tribos: guarde 12 cartas no celeiro',pal:{tunic:'#6a5a4a',hat:null,band:null,hair:'#a0a0a0',beard:'#a0a0a0'}}
};

// ---------- ascension: cumulative rules unlocked by winning
const ASC=['Jornada normal.','Inimigos com +15% de vida.','O maná recarrega 15% mais devagar.','Começa a jornada com 15 de Vida.','Chefes com +30% de vida.','Ondas com 20% mais inimigos.','Recompensas oferecem uma carta a menos.'];

// ---------- achievements with verses
const ACH={
  setenta:{name:'Setenta vezes sete',ref:'Mateus 18:22',desc:'Derrote 490 obras da carne no total.'},
  primicias:{name:'Primícias',ref:'Gálatas 5:22',desc:'Tenha Amor, Alegria e Paz plantados ao mesmo tempo.'},
  completo:{name:'Contra estas coisas não há lei',ref:'Gálatas 5:23',desc:'Tenha os 9 frutos plantados ao mesmo tempo.'},
  golias:{name:'Pedra e funda',ref:'1 Samuel 17:50',desc:'Derrote Golias.'},
  farao:{name:'Deixa ir o meu povo',ref:'Êxodo 5:1',desc:'Derrote o Faraó.'},
  leviata:{name:'Quem pode com o Leviatã?',ref:'Jó 41:1',desc:'Derrote o Leviatã.'},
  samaritano:{name:'Bom Samaritano',ref:'Lucas 10:33',desc:'Ajude o viajante ferido.'},
  ultimo:{name:'Os últimos serão primeiros',ref:'Mateus 20:16',desc:'Vença a jornada com 3 de Vida ou menos.'},
  poda:{name:'Para que dê mais fruto',ref:'João 15:2',desc:'Pode 10 cartas no total.'},
  mostarda:{name:'Fé como um grão',ref:'Mateus 17:20',desc:'Faça um grão de mostarda virar árvore.'},
  combo:{name:'Mil ao teu lado',ref:'Salmos 91:7',desc:'Faça um combo de 25.'},
  tribos:{name:'As 12 tribos',ref:'Gênesis 49:28',desc:'Guarde 12 cartas no celeiro.'},
  jornada:{name:'Combati o bom combate',ref:'2 Timóteo 4:7',desc:'Vença a jornada inteira.'},
  sombra:{name:'Onde está, ó morte, a tua vitória?',ref:'1 Coríntios 15:55',desc:'Derrote a Sombra da Morte.'},
  perola:{name:'Pérola de grande valor',ref:'Mateus 13:46',desc:'Encontre uma carta lendária num pacote.'},
  tesouros:{name:'Ajuntai tesouros no céu',ref:'Mateus 6:20',desc:'Complete a coleção das cartas de pacote.'}
};

// ---------- events: a story and a choice. Each option returns the result text.
const EVENTS={
  samaritano:{title:'O Bom Samaritano',ref:'Lucas 10:33',text:'Um viajante ferido está caído à beira do caminho. Ele pede ajuda para chegar à hospedaria.',
    opts:[{label:'Ajudar (15 siclos ou 4 de Vida)',run(){if(RUN.siclos>=15)RUN.siclos-=15;else RUN.hp=Math.max(1,RUN.hp-4);RUN.samaritano=1;unlockAch('samaritano');return'Você cuidou dele. “Quando eu voltar, eu pagarei.” Depois da próxima batalha, ele traz uma carta rara.'}},
      {label:'Passar pelo outro lado',run(){return'Você seguiu viagem. O caminho ficou em silêncio.'}}]},
  esau:{title:'O prato de lentilhas',ref:'Gênesis 25:33',text:'Esaú chega faminto do campo. Jacó oferece um prato de lentilhas em troca da primogenitura.',
    opts:[{label:'Comer as lentilhas',run(){RUN.hp=Math.min(RUN.maxhp,RUN.hp+8);RUN.handSize=3;RUN.esau=RUN.act;return'+8 de Vida. Até o fim do ato, sua mão terá só 3 cartas.'}},
      {label:'Guardar a primogenitura',run(){return'Você ficou com fome, mas com a herança.'}}]},
  viuva:{title:'A oferta da viúva',ref:'Marcos 12:42',text:'Uma viúva pobre põe duas moedas no gazofilácio. É tudo o que ela tinha. Você também pode dar.',
    opts:[{label:'Dar todos os siclos',run(){const g=RUN.siclos;RUN.siclos=0;if(g>=10){const k=newRelic();if(k)return'Você deu '+g+' siclos. Em troca recebeu: '+RELICS[k].name+'.';}return'Você deu '+g+' siclos. Foi pouco para mudar algo agora.'}},
      {label:'Guardar',run(){return'Você guardou o que tinha.'}}]},
  jaco:{title:'Jacó luta com o anjo',ref:'Gênesis 32:24',text:'À noite, um homem luta com você até o amanhecer. Ele pede para ir embora.',
    opts:[{label:'“Não te deixarei ir se não me abençoares” (-6 Vida)',run(){RUN.hp=Math.max(1,RUN.hp-6);const k=newRelic();return k?'Você saiu mancando, mas abençoado: '+RELICS[k].name+'.':'Você saiu mancando.'}},
      {label:'Soltar',run(){const c=mk(rpick(SEED_KEYS));RUN.coll.push(c);RUN.deck.push(c);return'Ele deixou uma semente para trás: '+info(c).name+'.'}}]},
  lo:{title:'Não olhe para trás',ref:'Gênesis 19:26',text:'A cidade queima atrás de você. Há riquezas no caminho de volta.',
    opts:[{label:'Seguir em frente',run(){return'Você não olhou. Pode podar até 2 cartas agora.';},after:'poda2'},
      {label:'Voltar e pegar (+30 siclos, recebe 2 Joio)',run(){RUN.siclos+=30;for(let i=0;i<2;i++){const c=mk('joio');RUN.coll.push(c);RUN.deck.push(c)}return'+30 siclos. Mas duas cartas de Joio entraram na sua bolsa.'}}]},
  gideao:{title:'Os 300 de Gideão',ref:'Juízes 7:7',text:'“O povo que está contigo é demais.” Diminua o exército e vença com poucos.',
    opts:[{label:'Ficar com poucos (pode até 3 cartas e ganha a Trombeta)',run(){if(!RUN.relics.includes('trombeta'))RUN.relics.push('trombeta');return'Você ficou com os que lamberam a água. Pode podar até 3 cartas.'},after:'poda3'},
      {label:'Manter todos',run(){return'Você manteve o exército inteiro.'}}]},
  mana:{title:'Maná no deserto',ref:'Êxodo 16:20',text:'De manhã o chão está coberto de maná. A ordem é juntar só o do dia.',
    opts:[{label:'Juntar só o de hoje (+12 siclos)',run(){RUN.siclos+=12;return'+12 siclos.'}},
      {label:'Juntar a mais (+35 siclos, pode apodrecer)',run(){if(RNG()<.5){RUN.hp=Math.max(1,RUN.hp-6);return'Deu bicho e cheirou mal. -6 de Vida e nada de siclos.'}RUN.siclos+=35;return'+35 siclos. Desta vez não apodreceu.'}}]}
};

// ---------- short card lines, stats for the card icons, character cards
const SHORT={videira:'Atira uvas no inimigo mais perto.',roma:'Raio vertical quando o mal chega perto.',oliveira:'Azeite que deixa lento.',sarca:'Queima tudo em volta.',
  figueira:'Guarda força enquanto espera.',tamareira:'Cura 1 de Vida a cada 12s.',amendoeira:'Vizinhas atiram 35% mais rápido.',lirio:'Sopro que empurra para trás.',
  mostarda:'Minúscula; em 2 ondas vira gigante.',talentos:'Invista 3, receba 6 na próxima onda.',semeador:'3 sementes ao acaso; o solo decide.',chuva:'Tudo atira mais rápido por 8s.',
  mana:'+5 de maná na hora.',jerico:'14 de dano em todos no chão.',profecia:'Revela a próxima onda. +2 de maná.',joio:'Ocupa a mão. Jogue para arrancar.',
  regar:'Rega a árvore mais perto: ela cresce e sobe 1 nível.',arca:'Protege as 3 árvores mais perto por 20s.',respigar:'Frutos e maná do chão vêm até você.',pedras:'5 pedras de 8. Triplo em gigantes.',
  fogoceu:'Consome a árvore onde você está e queima a tela.',celeiro:'Guarda o maná; volta 50% maior na próxima onda.',palmeira:'Todas atiram já, e mais rápido por 6s.',maraberto:'Abre o mar por 12s, ou congela todos por 3s.'};
const STATS={videira:{dmg:'2',rng:85,cd:'0,9s'},roma:{dmg:'9',rng:18,cd:'3,2s'},oliveira:{dmg:'1',rng:75,cd:'1,4s'},sarca:{dmg:'3/s',rng:38,cd:'sempre'},
  figueira:{dmg:'2-20',rng:95,cd:'espera'},tamareira:{dmg:'1',rng:60,cd:'1,2s'},amendoeira:{dmg:'1,5',rng:70,cd:'1s'},lirio:{dmg:'0,5',rng:55,cd:'3s'},mostarda:{dmg:'1-6',rng:125,cd:'1,5s'}};
Object.assign(CARDS,{
  regar:{type:'bencao',name:'Regar',cost:2,own:'lavrador',ref:'1 Coríntios 3:6',desc:'Rega a árvore mais perto: ela cresce um estágio, sobe 1 nível e recarrega o pisão.'},
  arca:{type:'bencao',name:'A Arca',cost:3,own:'noe',ref:'Gênesis 7:1',desc:'As 3 árvores mais perto ficam protegidas por 20s: nada as atordoa, adormece, seduz ou corrompe.'},
  respigar:{type:'bencao',name:'Respigar',cost:1,own:'rute',ref:'Rute 2:7',desc:'Todos os frutos e o maná do chão vêm até você.'},
  pedras:{type:'bencao',name:'Cinco Pedras Lisas',cost:4,own:'davi',ref:'1 Samuel 17:40',desc:'Você atira 5 pedras de 8 de dano. Contra gigantes, o triplo.'},
  fogoceu:{type:'bencao',name:'Fogo do Céu',cost:5,own:'elias',ref:'1 Reis 18:38',desc:'Consome a árvore onde você está e queima todo inimigo na tela com 25 de dano.'},
  celeiro:{type:'bencao',name:'Celeiros do Egito',cost:0,own:'jose',ref:'Gênesis 41:35',desc:'Guarda todo o seu maná. Ele volta 50% maior no começo da próxima onda.'},
  palmeira:{type:'bencao',name:'Sob a Palmeira',cost:3,own:'debora',ref:'Juízes 4:5',desc:'Todas as árvores atiram na hora e 50% mais rápido por 6s.'},
  maraberto:{type:'bencao',name:'Estende a Mão',cost:3,own:'moises',ref:'Êxodo 14:21',desc:'No mar, abre as águas por 12s. Fora dele, congela todos os inimigos por 3s.'},
  // found only in card packs
  vento:{type:'bencao',name:'Vento do Senhor',cost:2,ref:'Números 11:31',desc:'Um vento forte empurra para trás todos os inimigos na tela.'},
  uncao:{type:'bencao',name:'Óleo da Unção',cost:3,ref:'Salmos 23:5',desc:'O jardim recupera 4 de Vida e você recupera todos os corações.'},
  nuvem:{type:'bencao',name:'Coluna de Nuvem',cost:4,ref:'Êxodo 13:21',desc:'Uma nuvem desce: todos os inimigos andam na metade da velocidade por 8s.'},
  estrela:{type:'bencao',name:'Estrela da Manhã',cost:5,ref:'Apocalipse 22:16',desc:'Toda árvore sobe 1 nível e atira na hora. Você ganha 3 de maná.'}
});
Object.assign(CARDS,{
  hissopo:{type:'semente',name:'Hissopo',cost:4,ref:'Salmos 51:7',desc:'Purifica em volta a cada 4s: revela disfarces, arranca raízes, quebra espelhos e coroas, limpa as árvores vizinhas e fere as pragas.'},
  cedro:{type:'semente',name:'Cedro do Líbano',cost:6,ref:'Salmos 92:12',desc:'Árvore alta e firme: a cada 2,4s lança uma agulha que atravessa todas as pragas em fila, bem longe.'},
  luz:{type:'bencao',name:'Luz do Mundo',cost:2,ref:'Mateus 5:14',desc:'Revela tudo o que está escondido: disfarces e raízes aparecem, espelhos quebram, coroas caem. 4 de dano em todos.'},
  paz:{type:'bencao',name:'Paz de Deus',cost:3,ref:'Filipenses 4:7',desc:'Todas as árvores acordam, se livram de atordoamento, ídolo e joio, e ficam protegidas por 10s.'},
  fogo:{type:'bencao',name:'Muro de Fogo',cost:4,ref:'Zacarias 2:5',desc:'Ergue um muro de fogo onde você está por 8s. Quem atravessa queima e fica lento.'},
  pedra:{type:'bencao',name:'Pedra Angular',cost:2,ref:'Salmos 118:22',desc:'Coloca à sua frente uma pedra que segura as pragas, três vezes mais firme que uma cerca.'},
  fermento:{type:'parabola',name:'Fermento',cost:2,ref:'Mateus 13:33',desc:'Um pouco de fermento leveda tudo: o maná recarrega o dobro de rápido por 12s.'},
  ovelha:{type:'parabola',name:'Ovelha Perdida',cost:3,ref:'Lucas 15:4',desc:'As 3 pragas mais perto do jardim (menos chefes) são levadas de volta para o começo do caminho.'}
});
STATS.hissopo={dmg:'2',rng:55,cd:'4s'};STATS.cedro={dmg:'5',rng:140,cd:'2,4s'};
Object.assign(SHORT,{hissopo:'Purifica em volta: revela e limpa.',cedro:'Agulha longa que atravessa a fila.',luz:'Revela tudo; espelhos e coroas caem.',paz:'Árvores livres e protegidas por 10s.',
  fogo:'Muro de fogo por 8s onde você está.',pedra:'Uma pedra firme segura as pragas.',fermento:'Maná recarrega o dobro por 12s.',ovelha:'As 3 pragas mais adiantadas voltam ao começo.'});
Object.assign(SHORT,{vento:'Empurra todos os inimigos para trás.',uncao:'+4 de Vida e corações cheios.',nuvem:'Inimigos lentos por 8s.',estrela:'Toda árvore sobe 1 nível e atira.'});

// ---------- neighbours: trees close to each other strengthen each other
const PAIRS=[
  {a:'roma',b:'oliveira',name:'Amor e Paz',desc:'curam 1 de Vida a cada 15s',ref:'Salmos 85:10'},
  {a:'videira',b:'figueira',name:'Videira e Figueira',desc:'atiram 30% mais rápido',ref:'Miqueias 4:4'},
  {a:'oliveira',b:'lirio',name:'Paz e Mansidão',desc:'o sopro também deixa lento',ref:'Mateus 5:5'},
  {a:'sarca',b:'amendoeira',name:'Fogo e Bondade',desc:'o fogo alcança 30% mais longe',ref:'Romanos 12:20'},
  {a:'tamareira',b:'mostarda',name:'Benignidade e Fé',desc:'a mostarda cresce o dobro de rápido',ref:'Salmos 92:12'}
];

// ---------- the story arc: three gardens
ACTS[0].title='O Jardim Perdido';ACTS[1].title='O Caminho';ACTS[2].title='A Vigília';
Object.assign(CHARS.lavrador,{card:'regar',epi:'O lavrador olhou o jardim e viu fruto onde antes havia espinho.',epiRef:'“Eu sou a videira, vós os ramos.” João 15:5'});
Object.assign(CHARS.noe,{card:'arca',epi:'As águas baixaram, e a pomba voltou com uma folha de oliveira no bico.',epiRef:'Gênesis 8:11'});
Object.assign(CHARS.rute,{card:'respigar',epi:'Ela respigou até a tarde e achou graça. Nos campos, nada se perdeu.',epiRef:'Rute 2:17'});
Object.assign(CHARS.davi,{card:'pedras',epi:'Sem espada, com uma funda e cinco pedras, o pastor guardou o jardim.',epiRef:'1 Samuel 17:50'});
Object.assign(CHARS.elias,{card:'fogoceu',epi:'Depois do fogo e do vento, veio uma voz mansa e delicada.',epiRef:'1 Reis 19:12'});
CHARS.jose={name:'José',ref:'Gênesis 41:16',desc:'Sonhos: você sempre vê a próxima onda.',hint:'Guarde 8 cartas no celeiro',card:'celeiro',
  pal:{tunic:'#e0284a',hat:null,band:null,hair:'#3a2418',coat:1},epi:'“Vós intentastes o mal contra mim; Deus o tornou em bem.”',epiRef:'Gênesis 50:20'};
CHARS.debora={name:'Débora',ref:'Juízes 4:4',desc:'Juíza: seu pisão faz as árvores vizinhas atirarem na hora.',hint:'Vença uma jornada',card:'palmeira',
  pal:{tunic:'#5a8a4a',hat:null,band:null,hair:'#3a2418',scarf:'#f7c948'},epi:'“Os que te amam sejam como o sol quando sai na sua força.”',epiRef:'Juízes 5:31'};
CHARS.moises={name:'Moisés',ref:'Êxodo 14:21',desc:'Inimigos na água ficam muito mais lentos.',hint:'Derrote o Faraó',card:'maraberto',
  pal:{tunic:'#c9b89a',hat:null,band:null,hair:'#e0e0e0',beard:'#e0e0e0'},epi:'Do alto do monte ele viu a terra prometida, verde de ponta a ponta.',epiRef:'Deuteronômio 34:1'};

// ---------- farmer attributes, 1 to 5. The lavrador is the 3-3-3-3-3 baseline; every farmer sums 15.
// Corações: +1 heart per point. Velocidade: +8% walk. Força: +15% golpe and pisão. Maná: +1 at the start. Poder: -3s ability recharge.
const ATTRS=[['vida','Corações','#ff5a6a'],['vel','Velocidade','#5ad0ff'],['for','Força','#ffa040'],['mana','Maná','#a08aff'],['poder','Poder','#ffe36a']];
const CHAR_AT={lavrador:[3,3,3,3,3],noe:[4,2,3,4,2],rute:[3,5,1,3,3],davi:[3,3,5,2,2],elias:[3,2,2,3,5],jose:[3,3,2,5,2],debora:[4,3,4,2,2],moises:[3,2,2,4,4]};
// points above (or below) the baseline for attribute s of farmer k, by default the one playing
const atr=(s,k=(RUN&&RUN.char)||META.char)=>(CHAR_AT[k]||CHAR_AT.lavrador)[ATTRS.findIndex(a=>a[0]===s)]-3;

// ---------- farm tools the gardener fights with, and things he can set on the field
const WEAPONS={
  enxada:{name:'Enxada',dmg:3,rng:16,cd:.45,price:0,desc:'Golpe curto e rápido.'},
  foice:{name:'Foice',dmg:2.5,rng:24,cd:.32,wide:1,price:300,desc:'Golpe largo que alcança os voadores.'},
  forcado:{name:'Forcado',dmg:4,rng:32,cd:.6,push:26,price:550,desc:'Estocada longa que empurra para trás.'},
  arado:{name:'Arado',dmg:5,rng:14,cd:1.6,dash:1,price:950,desc:'Você avança arando tudo pelo caminho.'}
};
const ITEMS={
  cerca:{name:'Cerca',key:'Q',price:40,qty:3,desc:'Barra os inimigos do chão até quebrar.'},
  espantalho:{name:'Espantalho',key:'E',price:60,qty:2,desc:'Afasta os voadores por 20s.'},
  lama:{name:'Poça de lama',key:'R',price:30,qty:3,desc:'Inimigos do chão ficam lentos por 15s.'}
};

// ---------- expansion: ten more works of the flesh, twenty cards, a final evolution for every tree and named fusions
Object.assign(EN,{
  idolatria:{name:'Idolatria',hp:13,spd:17,rew:7,dmg:1,fly:0,w:10,h:14,c:'#d9a521',glow:'#ffe36a',weak:'acacia',ai:'seduce',ref:'Gálatas 5:20',desc:'Carrega um ídolo: as árvores por onde passa param de atirar para olhar. Um pisão as liberta.'},
  inimizade:{name:'Inimizade',hp:9,spd:21,rew:5,dmg:1,fly:0,w:8,h:10,c:'#8a2a4a',glow:'#ff5a8a',weak:'murta',ai:'grudge',ref:'Gálatas 5:20',desc:'Anda em dupla. Se uma cai, a outra jura vingança: cura metade da vida e corre o dobro.'},
  hipocrisia:{name:'Hipocrisia',hp:12,spd:19,rew:7,dmg:1,fly:0,w:9,h:13,c:'#e8e0d0',glow:'#ffffff',weak:'hissopo',ai:'mask',ref:'Mateus 23:27',desc:'De tempos em tempos põe uma máscara branca: os tiros das árvores a curam. Golpe, pisão e bênçãos arrancam a máscara.'},
  violencia:{name:'Violência',hp:16,spd:18,rew:8,dmg:2,fly:0,w:11,h:12,c:'#8a1a1a',glow:'#ff3a2a',weak:'salgueiro',ai:'smash',ref:'Gênesis 6:11',desc:'Quebra cercas e pedras num instante e atordoa as árvores por onde passa.'},
  cobica:{name:'Cobiça',hp:10,spd:22,rew:6,dmg:1,fly:0,w:9,h:11,c:'#2a8a7a',glow:'#7af0d0',weak:'tamareira',ai:'drain',ref:'Êxodo 20:17',desc:'Enquanto está na tela, rouba seu maná aos poucos. Derrotada, devolve o que roubou.'},
  blasfemia:{name:'Blasfêmia',hp:7,spd:20,rew:7,dmg:1,fly:2,w:10,h:9,c:'#3a1a3a',glow:'#c04ac0',weak:'sicomoro',ai:'curse',ref:'Colossenses 3:8',desc:'Voa alto e deixa cair palavras que calam as árvores embaixo por 2,5 segundos.'},
  impaciencia:{name:'Impaciência',hp:7,spd:24,rew:5,dmg:1,fly:0,w:8,h:10,c:'#e8a020',glow:'#ffd34a',weak:'figueira',ai:'dash',ref:'Provérbios 14:29',desc:'Não espera: de vez em quando dispara correndo três vezes mais rápido.'},
  dureza:{name:'Dureza de Coração',hp:18,armor:22,spd:11,rew:10,dmg:2,fly:0,w:13,h:13,c:'#6a6a78',glow:'#c8c8d8',weak:'nogueira',ai:'stone',ref:'Ezequiel 36:26',desc:'Um coração de pedra: casca grossa, e nada a empurra, prende ou deixa lenta.'},
  incredulidade:{name:'Incredulidade',hp:11,spd:16,rew:7,dmg:1,fly:0,w:9,h:12,c:'#5a6a8a',glow:'#a0b8e0',weak:'mostarda',ai:'doubt',ref:'Hebreus 3:12',desc:'Espalha dúvida: as árvores perto dela atiram 40% mais devagar. O Grão de Mostarda não duvida.'},
  engano:{name:'Engano',hp:10,spd:22,rew:7,dmg:1,fly:0,w:9,h:12,c:'#7a4ac8',glow:'#c8a0ff',weak:'cedro',ai:'decoy',ref:'Jeremias 17:9',desc:'No primeiro golpe que leva, se divide em ilusões que não fazem mal ao Éden. Qual é a verdadeira?'},
  ilusao:{name:'Ilusão',hp:1.5,spd:26,rew:0,dmg:0,fly:0,w:9,h:12,c:'#7a4ac8',glow:'#c8a0ff',weak:'cedro',hide:1,desc:'Uma ilusão do Engano.'}
});
Object.assign(COST,{idolatria:4,inimizade:4,hipocrisia:4,violencia:5,cobica:3,blasfemia:4,impaciencia:3,dureza:6,incredulidade:4,engano:4});
WAVE_POOL[0].push('impaciencia');
WAVE_POOL[1].push('inimizade','violencia','cobica','idolatria');
WAVE_POOL[2].push('incredulidade','blasfemia','engano','hipocrisia','dureza');
// the new pests join the adventure beside the ones already met on those levels
[[5,'impaciencia'],[9,'inimizade'],[10,'violencia'],[13,'cobica'],[14,'idolatria'],[17,'incredulidade'],[19,'blasfemia'],[21,'engano'],[22,'hipocrisia'],[25,'dureza']]
  .forEach(([n,k])=>PEST_INTRO[n].push(k));
PEST_ORDER.splice(0,PEST_ORDER.length,...Object.keys(PEST_INTRO).sort((a,b)=>a-b).flatMap(n=>PEST_INTRO[n]));

// six new trees, nine blessings and five parables
Object.assign(FRUIT,{macieira:'Amor',sicomoro:'Alegria',salgueiro:'Paz',acacia:'Fé',murta:'Benignidade',nogueira:'Domínio'});
Object.assign(CARDS,{
  macieira:{type:'semente',name:'Macieira',cost:4,ref:'Cânticos 2:3',desc:'Atira maçãs que quicam e acertam até 3 pragas seguidas.'},
  sicomoro:{type:'semente',name:'Sicômoro',cost:5,ref:'Lucas 19:4',desc:'Vigia do alto, como Zaqueu: alcança muito longe e dá o dobro de dano nos voadores. Forte contra Blasfêmia.'},
  salgueiro:{type:'semente',name:'Salgueiro',cost:4,ref:'Isaías 44:4',desc:'Galhos que prendem: a cada 4s segura a praga mais perto por 1,5s. Forte contra Violência.'},
  acacia:{type:'semente',name:'Acácia',cost:4,ref:'Êxodo 25:10',desc:'Madeira da Arca: espinhos ferem e deixam lento quem passa por baixo, e as vizinhas não são seduzidas. Forte contra Idolatria.'},
  murta:{type:'semente',name:'Murta',cost:3,ref:'Isaías 55:13',desc:'Perfume que anima: árvores vizinhas dão +25% de dano. Atira folhas. Forte contra Inimizade.'},
  nogueira:{type:'semente',name:'Nogueira',cost:5,ref:'Cânticos 6:11',desc:'Nozes duras: dano alto e o triplo contra coroas e cascas. Forte contra Dureza de Coração.'},
  orvalho:{type:'bencao',name:'Orvalho do Hermom',cost:3,ref:'Salmos 133:3',desc:'O orvalho desce sobre o jardim: toda árvore recebe uma rega inteira.'},
  sal:{type:'bencao',name:'Sal da Terra',cost:2,ref:'Mateus 5:13',desc:'Por 15s as pragas não se curam nem engordam, e todas na tela levam 3 de dano.'},
  escudo:{type:'bencao',name:'Escudo da Fé',cost:3,ref:'Efésios 6:16',desc:'Por 12s você não se fere nem fica atordoado, e o pisão dá o dobro de dano.'},
  espada:{type:'bencao',name:'Espada do Espírito',cost:2,ref:'Efésios 6:17',desc:'Por 10s seu golpe alcança o dobro e dá o triplo de dano.'},
  jubileu:{type:'bencao',name:'Ano do Jubileu',cost:1,ref:'Levítico 25:10',desc:'Troca todas as cartas da mão por novas e dá +2 de maná.'},
  linguas:{type:'bencao',name:'Línguas de Fogo',cost:4,ref:'Atos 2:3',desc:'Chamas descem sobre as 6 pragas mais fortes da tela: 12 de dano em cada.'},
  arcoiris:{type:'bencao',name:'Arco da Aliança',cost:4,ref:'Gênesis 9:13',desc:'Por 8s o Éden não perde Vida: a praga que chega volta para o começo do caminho.'},
  codornizes:{type:'bencao',name:'Codornizes',cost:2,ref:'Êxodo 16:13',desc:'Caem 8 frutos do céu perto de você. Cada um vale maná e enche o cesto.'},
  harpa:{type:'bencao',name:'Harpa de Davi',cost:3,ref:'1 Samuel 16:23',desc:'Por 12s, cada praga derrotada cura 1 de Vida do Éden (até 5).'},
  tesouro:{type:'parabola',name:'Tesouro Escondido',cost:0,ref:'Mateus 13:44',desc:'Vende tudo pelo campo: +7 de maná, e a carta sai da bolsa nesta batalha.'},
  rede:{type:'parabola',name:'A Rede',cost:3,ref:'Mateus 13:47',desc:'Lança uma rede à sua frente: as pragas do chão naquele trecho ficam presas por 3s.'},
  virgens:{type:'parabola',name:'As Dez Virgens',cost:2,ref:'Mateus 25:4',desc:'Lâmpadas acesas: por 15s a noite some e as árvores dão +30% de dano.'},
  prodigo:{type:'parabola',name:'Filho Pródigo',cost:2,ref:'Lucas 15:20',desc:'Volta para casa: você vai até o Éden, recupera os corações e o Éden ganha +2 de Vida.'},
  vinha:{type:'parabola',name:'Trabalhadores da Vinha',cost:3,ref:'Mateus 20:16',desc:'Os últimos serão primeiros: toda árvore de nível 1 ou 2 sobe para o nível 3.'}
});
SEED_KEYS.push('macieira','sicomoro','salgueiro','acacia','murta','nogueira');
POOL.push('macieira','sicomoro','salgueiro','acacia','murta','nogueira','orvalho','sal','escudo','espada','jubileu','linguas','arcoiris','codornizes','harpa','tesouro','rede','virgens','prodigo','vinha');
Object.assign(STATS,{macieira:{dmg:'3',rng:80,cd:'1,3s'},sicomoro:{dmg:'4',rng:135,cd:'1,6s'},salgueiro:{dmg:'1',rng:65,cd:'4s'},acacia:{dmg:'4',rng:22,cd:'1,5s'},murta:{dmg:'1',rng:65,cd:'1s'},nogueira:{dmg:'7',rng:80,cd:'2,2s'}});
Object.assign(SHORT,{macieira:'Maçãs que quicam em 3 pragas.',sicomoro:'Longe; dobro de dano nos voadores.',salgueiro:'Segura a praga mais perto.',acacia:'Espinhos ferem quem passa por baixo.',
  murta:'Vizinhas dão +25% de dano.',nogueira:'Nozes que quebram coroas e cascas.',orvalho:'Toda árvore recebe uma rega.',sal:'Pragas não se curam por 15s. 3 de dano.',
  escudo:'12s sem se ferir; pisão em dobro.',espada:'Golpe longo e triplo por 10s.',jubileu:'Mão nova e +2 de maná.',linguas:'12 de dano nas 6 pragas mais fortes.',
  arcoiris:'8s: o Éden não perde Vida.',codornizes:'8 frutos caem perto de você.',harpa:'Pragas derrotadas curam o Éden.',tesouro:'+7 de maná; sai da batalha.',
  rede:'Prende as pragas à sua frente por 3s.',virgens:'15s sem noite e +30% de dano.',prodigo:'Volta ao Éden: corações e +2 Vida.',vinha:'Árvores pequenas sobem ao nível 3.'});
PAIRS.push(
  {a:'macieira',b:'videira',name:'Maçãs e Uvas',desc:'atiram 30% mais rápido',ref:'Cânticos 2:5'},
  {a:'salgueiro',b:'oliveira',name:'Águas e Azeite',desc:'dão 20% mais dano',ref:'Salmos 1:3'},
  {a:'murta',b:'lirio',name:'Murta e Lírio',desc:'curam 1 de Vida a cada 15s',ref:'Isaías 55:13'});

// the final evolution: a tree that already chose a branch can become its full form; every few seconds it does something only it does
const EVO_COST=7;
const EVO={
  videira:{name:'Videira Verdadeira',ref:'João 15:1',every:5,desc:'Chove um cacho de uvas em volta.'},
  roma:{name:'Romã do Sumo Sacerdote',ref:'Êxodo 28:33',every:6,desc:'Três raios de uma vez.'},
  oliveira:{name:'Oliveira de Zacarias',ref:'Zacarias 4:3',every:6,desc:'Congela por 1,5s quem está perto.'},
  sarca:{name:'Sarça que Não se Consome',ref:'Êxodo 3:2',every:5,desc:'Explode em fogo: 8 de dano em volta.'},
  figueira:{name:'Figueira Frutífera',ref:'Lucas 13:9',every:7,desc:'Lança três figos carregados.'},
  tamareira:{name:'Palmeiras de Elim',ref:'Êxodo 15:27',every:10,desc:'+1 de Vida e +2 de maná.'},
  amendoeira:{name:'Vara que Floresceu',ref:'Números 17:8',every:8,desc:'Todas as vizinhas atiram na hora.'},
  lirio:{name:'Lírio dos Vales',ref:'Cânticos 2:1',every:5,desc:'Um sopro grande que empurra e deixa lento.'},
  mostarda:{name:'Árvore dos Céus',ref:'Mateus 13:32',every:6,desc:'As aves atacam as 3 pragas mais perto.'},
  hissopo:{name:'Hissopo da Páscoa',ref:'Êxodo 12:22',every:6,desc:'Purifica bem longe, em volta.'},
  cedro:{name:'Cedro do Templo',ref:'1 Reis 6:15',every:6,desc:'Uma agulha que atravessa a fila inteira: 12 de dano.'},
  macieira:{name:'Macieira do Amado',ref:'Cânticos 2:3',every:6,desc:'Uma maçã enorme que explode: 14 de dano em área.'},
  sicomoro:{name:'Sicômoro de Zaqueu',ref:'Lucas 19:6',every:5,desc:'Derruba o voador mais forte: 20 de dano.'},
  salgueiro:{name:'Salgueiro das Correntes',ref:'Isaías 44:4',every:6,desc:'Prende por 2s todas as pragas perto.'},
  acacia:{name:'Acácia da Arca',ref:'Êxodo 25:10',every:8,desc:'Protege as vizinhas de tudo por 4s.'},
  murta:{name:'Murta do Vale',ref:'Zacarias 1:8',every:8,desc:'As vizinhas ganham uma rega.'},
  nogueira:{name:'Nogueira do Jardim',ref:'Cânticos 6:11',every:6,desc:'Quebra coroas, cascas e espelhos em volta: 8 de dano.'}
};
// named fusions: grafting exactly these two seeds makes a tree at full strength (no 80% penalty) with its own power
const FUSIONS=[
  {a:'videira',b:'macieira',name:'Pomar da Alegria',ref:'Cânticos 2:5',every:6,desc:'Dá +2 de maná a cada 6s.'},
  {a:'roma',b:'sarca',name:'Fogo do Altar',ref:'Levítico 6:13',every:5,desc:'Raio de fogo que queima quem está embaixo.'},
  {a:'oliveira',b:'salgueiro',name:'Águas Tranquilas',ref:'Salmos 23:2',every:6,desc:'Deixa lentas por 3s todas as pragas perto.'},
  {a:'lirio',b:'murta',name:'Jardim Fechado',ref:'Cânticos 4:12',every:8,desc:'Cura 1 de Vida a cada 8s.'},
  {a:'cedro',b:'sicomoro',name:'Floresta do Líbano',ref:'1 Reis 7:2',every:5,desc:'Acerta o voador mais longe com 10 de dano.'},
  {a:'mostarda',b:'acacia',name:'Fé Incorruptível',ref:'Mateus 17:20',every:8,desc:'Protege as vizinhas por 5s.'},
  {a:'figueira',b:'nogueira',name:'Casca e Fruto',ref:'Mateus 7:17',every:6,desc:'Um figo-noz que quebra a coroa e dá 15 de dano.'},
  {a:'hissopo',b:'oliveira',name:'Óleo da Purificação',ref:'Levítico 14:6',every:6,desc:'Purifica em volta e cura 1 coração seu.'},
  {a:'tamareira',b:'macieira',name:'Árvores do Rio',ref:'Ezequiel 47:12',every:10,desc:'+1 de Vida e +1 de maná a cada 10s.'},
  {a:'amendoeira',b:'nogueira',name:'Vigia do Senhor',ref:'Jeremias 1:11',every:7,desc:'Todas as vizinhas atiram na hora.'},
  {a:'sarca',b:'acacia',name:'Sarça de Horebe',ref:'Êxodo 3:4',every:5,desc:'Anel de fogo: 6 de dano em volta.'},
  {a:'roma',b:'macieira',name:'Pomar do Amor',ref:'Cânticos 4:13',every:6,desc:'Raio de amor de 14 de dano na praga mais perto.'}
];
const fusionOf=(a,b)=>FUSIONS.find(f=>(f.a===a&&f.b===b)||(f.a===b&&f.b===a))||null;

// ---------- boss stages: a fifth level in every world, only for its boss. Like the boss levels of a lawn-defense game:
// a seed cart instead of the bag and the mana, a clock, and one rule that must be learned to bring the boss down
Object.assign(EN,{
  serpente:{name:'A Serpente',hp:480,spd:8,rew:60,dmg:10,fly:0,w:46,h:20,c:'#3a8a3a',glow:'#9ff05a',weak:null,boss:1,ref:'Gênesis 3:15',desc:'Chefe. Enrola-se nas árvores e dá botes. As árvores mal a arranham: um pisão na cabeça a fere de verdade.'},
  ninrode:{name:'Ninrode',hp:520,spd:7,rew:70,dmg:12,fly:0,w:24,h:40,c:'#a0603a',glow:'#ffb060',weak:null,boss:1,ref:'Gênesis 10:9',desc:'Chefe. O caçador de Babel atira flechas e aprende cada golpe: o mesmo tipo de árvore fere cada vez menos.'}
});
// bosses (and the golden calf) are drawn bigger in draw.js, and their bodies are as big as they look
const BOSS_SCALE=1.5;
['golias','farao','leviata','sombra','serpente','ninrode','bezerro'].forEach(k=>{EN[k].w=Math.round(EN[k].w*BOSS_SCALE);EN[k].h=Math.round(EN[k].h*BOSS_SCALE)});
Object.assign(ACH,{serpente:{name:'Esmagará a cabeça',ref:'Gênesis 3:15',desc:'Derrote a Serpente.'},ninrode:{name:'Confundidas as línguas',ref:'Gênesis 11:9',desc:'Derrote Ninrode.'}});
// one per world: the boss, the clock in seconds, the cards the cart brings, the rule and how to beat it
const BSTAGE=[
  {boss:'serpente',time:150,hp:1.8,rule:'Fira a cabeça',ref:'Gênesis 3:15',tip:'As árvores mal arranham a Serpente. Depois de cada bote a cabeça fica no chão por um instante: é a hora do pisão.',
    belt:['videira','roma','oliveira','lirio','figueira','chuva','jerico','tamareira']},
  {boss:'golias',time:120,hp:1.15,rule:'Uma pedra na testa',ref:'1 Samuel 17:49',tip:'A armadura de bronze segura as árvores. Pegue as pedras lisas do ribeiro: cada uma vai direto na testa e o atordoa.',
    belt:['pedras','videira','roma','sarca','cedro','pedra','oliveira','jerico','lirio']},
  {boss:'farao',time:180,hp:1,rule:'As águas voltam',ref:'Êxodo 14:28',tip:'Segure o Faraó no meio do mar. Cada vez que as águas se fecham sobre ele, o golpe é enorme.',
    belt:['oliveira','salgueiro','nuvem','rede','maraberto','videira','roma','lirio','cedro']},
  {boss:'bezerro',time:170,hp:1.15,rule:'Queimado no fogo',ref:'Êxodo 32:20',tip:'O ouro só derrete no fogo: a Sarça fere muito, as outras árvores quase nada. Os adoradores curam o ídolo: derrube-os.',
    belt:['sarca','sarca','fogo','linguas','fogoceu','hissopo','acacia','oliveira','videira']},
  {boss:'ninrode',time:160,hp:1.25,rule:'Confusão de línguas',ref:'Gênesis 11:7',tip:'Ninrode aprende cada golpe. Misture árvores diferentes: o mesmo tipo seguido fere cada vez menos.',
    belt:['videira','roma','oliveira','sarca','figueira','macieira','nogueira','murta','cedro','sicomoro','jubileu']},
  {boss:'leviata',time:180,hp:1.4,rule:'O anzol',ref:'Jó 41:1',tip:'As escamas quase nada deixam passar. Quando ele passar perto do anzol dourado, dê um pisão no anzol: fisgado, fica preso e frágil.',
    belt:['cedro','roma','videira','salgueiro','rede','paz','nogueira','oliveira','jerico']},
  {boss:'sombra',time:200,hp:1.6,rule:'Lâmpadas acesas',ref:'Salmos 119:105',tip:'No escuro ela não sente nada. Acenda as lâmpadas com um pisão ao lado: perto da luz ela é ferida, e as três acesas juntas a fazem recuar.',
    belt:['virgens','luz','paz','roma','videira','lirio','hissopo','tamareira','sarca']}];
