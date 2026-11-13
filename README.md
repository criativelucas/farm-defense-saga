# Farm Defense Saga

Tower defense de plataforma em pixel art com cartas, inspirado no fruto do Espírito (Gálatas 5:22-23).
Você é o lavrador: planta frutos do Espírito contra as obras da carne, do Éden ao Getsêmani.

## Como jogar
Abra `jardim-do-fruto.html` num navegador (ou sirva a pasta com `python3 -m http.server`).

- ← → andar · ↑ pular · ↓ no ar: pisão · X golpe
- Q cerca · E espantalho · R lama
- 1 a 4 jogar carta (ou arraste até o canteiro) · Enter chama a onda · M som

## Fases de chefe
Cada mundo termina numa fase X-5 só do chefe, que abre depois da X-4 e libera o mundo seguinte. Fases já vencidas continuam abertas. Nela não há bolsa nem maná: uma carroça traz cartas escolhidas para aquele chefe, um cronômetro corre (quando zera, o chefe avança em fúria) e cada chefe tem uma regra própria para ser derrotado:

| Fase | Chefe | Regra |
|---|---|---|
| 1-5 | A Serpente | as árvores mal a ferem; depois de cada bote, pisão na cabeça |
| 2-5 | Golias | armadura de bronze; pegue as pedras lisas do ribeiro, que vão na testa |
| 3-5 | Faraó | segure-o no mar: quando as águas se fecham sobre ele, o golpe é enorme |
| 4-5 | Bezerro de Ouro | só o fogo derrete o ouro; os adoradores o curam |
| 5-5 | Ninrode | aprende cada golpe: misture árvores diferentes |
| 6-5 | Leviatã | escamas fechadas; pisão no anzol quando ele passar perto |
| 7-5 | A Sombra da Morte | só sente perto das lâmpadas acesas com pisões; as três juntas a fazem recuar |

Os dados ficam em `BSTAGE` (`js/content.js`) e a lógica em `js/bosses.js`. Os chefes são desenhados 1,5x maiores (`BOSS_SCALE`).

Carta nova descoberta (vitória de fase ou pacote) ganha uma tela de destaque, com a carta de perto, raios e brilho na cor da raridade.

## Evolução e fusão
- **Galho** (nível 4, 4 de maná): +70% de dano ou mais rápida e longe.
- **Evolução final** (depois do galho, 7 de maná): toda árvore vira sua forma plena (ex.: Videira Verdadeira, Sarça que Não se Consome), com +20% de dano e um poder próprio a cada poucos segundos. Lista em `EVO` (`js/content.js`).
- **Fusões** (Altar, enxertando duas sementes): 12 receitas nomeadas (ex.: Romã + Sarça = Fogo do Altar) nascem com força total, sem a perda de 20% do enxerto comum, e ganham um poder próprio. Lista em `FUSIONS`. Os poderes ficam em `POWER` (`js/game.js`). O Códex (Vizinhanças) mostra todas.

## Estrutura
- `jardim-do-fruto.html` — página, HUD e estilos
- `js/engine.js` — utilitários, áudio, música, entrada
- `js/content.js` — cartas, inimigos, relíquias, eventos, personagens
- `js/maps.js` — fases (perfil do relevo, ilhas, canteiros)
- `js/tiles.js` — tileset (torres de Jericó), adereços e bichinhos animados
- `js/terrain.js` — relevo orgânico: perfil com rampas e paredões, chão pintado, ilhas flutuantes, cachoeiras, decoração por mundo
- `js/scenery.js` — fundos pintados pixel a pixel (céu, nuvens, montanhas, penhascos, florestas, cidades)
- `js/game.js` — lógica da batalha
- `js/draw.js` — desenho em pixel art
- `js/ui.js` — HUD, menus da jornada
- `js/cards.js` — cartas desenhadas por categoria
- `js/meta.js` — menu principal, aventura, loja
- `js/garden.js` — jardim, Árvore da Vida, tutorial
- `js/icons.js` — ícones dos itens (loja, equipamento, barra de itens) em pixel grosso com contorno
- `js/aseprite.js` — lê folhas de sprites exportadas pelo Aseprite (`assets/sprites/`, ver o LEIA-ME de lá) e usa no lugar do desenho por código

## Teste antes de publicar

```bash
node tools/smoke.mjs
```

Abre o jogo no Google Chrome sem janela e passa por todas as telas e por uma batalha em cada mundo, como jogador novo, com progresso e com o controle bloqueado (como no artifact). Sai com erro se alguma tela quebrar.

```bash
node tools/visual.mjs
```

Fotografa as telas principais e compara com as fotos de referência em `tools/visual/`. Sai com erro se alguma tela mudou demais (um painel fora do lugar, uma tela preta) e guarda a foto atual em `tools/visual/out/`. Depois de uma mudança visual de propósito, rode `node tools/visual.mjs --update` para trocar as referências.

```bash
node tools/perf.mjs
```

Mede o desempenho com o processador 6 vezes mais lento, como num celular fraco: quadros por segundo e trabalho por quadro em duas batalhas, tempo para desenhar as cartas e para abrir um pacote.

```bash
node tools/balance.mjs 3 normal
```

Com `FROM=28` na frente, o robô joga só as fases de chefe (ele conhece a regra de cada chefe).

Robô de equilíbrio: joga cada fase da Aventura 3 vezes com as cartas que o jogador teria naquele ponto e mostra vitórias, vida média do Éden e quais pragas mais passaram. Troque `normal` por `facil` ou `dificil`. Com `BOT=fraco` na frente, ele joga como iniciante (reage devagar, sem bênçãos e sem enxada). Compare as fases entre si; o robô não faz os objetivos especiais (colheita, vigília).
