# Farm Defense Saga

Tower defense de plataforma em pixel art com cartas, inspirado no fruto do Espírito (Gálatas 5:22-23).
Você é o lavrador: planta frutos do Espírito contra as obras da carne, do Éden ao Getsêmani.

## Como jogar
Abra `jardim-do-fruto.html` num navegador (ou sirva a pasta com `python3 -m http.server`).

- ← → andar · ↑ pular · ↓ no ar: pisão · X golpe
- Q cerca · E espantalho · R lama
- 1 a 4 jogar carta (ou arraste até o canteiro) · Enter chama a onda · M som

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
