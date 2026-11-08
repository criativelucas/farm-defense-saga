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
const POOL=[...SEED_KEYS,'videira','roma','oliveira','mostarda','talentos','semeador','chuva','mana','jerico','profecia'];
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
  farao:{name:'Faraó',hp:520,spd:7,rew:60,dmg:12,fly:0,w:40,h:30,c:'#f7c948',glow:'#5a8aff',weak:null,boss:1,ref:'Êxodo 14:9',desc:'Chefe. Chama pragas de reforço. Furioso, chama ainda mais.'},
  leviata:{name:'Leviatã',hp:700,spd:7,rew:80,dmg:15,fly:0,w:44,h:24,c:'#2a6a7a',glow:'#5af0c0',weak:null,boss:1,ref:'Isaías 27:1',desc:'Chefe. Mergulha, fica intocável e surge atordoando as árvores.'}
};
const VICE_REF='Gálatas 5:19-21';

// ---------- journey: three acts, each with two scenarios and a boss
const ACTS=[
  {name:'Ato I',title:'O Jardim',pool:['eden','jerico'],boss:'golias',arena:'jerico'},
  {name:'Ato II',title:'O Êxodo',pool:['mar','sinai'],boss:'farao',arena:'mar'},
  {name:'Ato III',title:'A Vigília',pool:['babel','getsemani'],boss:'leviata',arena:'abismo'}
];
const WAVE_POOL=[['odio','inveja','discordia','gula','embriaguez','ira'],
  ['odio','inveja','discordia','gula','embriaguez','feitico','contenda','faccoes','ambicao','ira','ciume'],
  ['odio','inveja','discordia','gula','embriaguez','feitico','contenda','faccoes','ambicao','impureza','ciume','heresia']];
// adventure levels meet the works of the flesh one at a time, in this order; each level mixes the six newest it knows
const PEST_ORDER=['odio','discordia','inveja','embriaguez','ira','gula','feitico','contenda','ciume','faccoes','impureza','heresia','ambicao'];
const levelPool=n=>{const k=Math.min(PEST_ORDER.length,2+Math.floor(n*.6));return PEST_ORDER.slice(Math.max(0,k-6),k)};
const COST={odio:2,inveja:2,discordia:1,gula:6,embriaguez:3,feitico:3,contenda:4,faccoes:3,ambicao:8,impureza:5,ira:3,ciume:3,heresia:4};
function genWave(act,i,kind,ascN,only){
  const pool=only||WAVE_POOL[act],L=[],theme=rpick(pool);
  let budget=(16+act*15+i*7+(kind==='elite'?8:0))*(ascN>=5?1.2:1);
  while(budget>0){
    const k=RNG()<.45?theme:rpick(pool),c=COST[k];
    if(k==='faccoes'){for(let j=0;j<3;j++)L.push([k,.22]);L[L.length-1][1]=1.2}
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
  jornada:{name:'Combati o bom combate',ref:'2 Timóteo 4:7',desc:'Vença a jornada inteira.'}
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
  maraberto:{type:'bencao',name:'Estende a Mão',cost:3,own:'moises',ref:'Êxodo 14:21',desc:'No mar, abre as águas por 12s. Fora dele, congela todos os inimigos por 3s.'}
});

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
