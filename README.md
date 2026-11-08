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
- `js/maps.js` — fases (chão, plataformas, canteiros)
- `js/tiles.js` — tileset do chão, adereços animados
- `js/scenery.js` — fundos pintados pixel a pixel (céu, nuvens, montanhas, penhascos, florestas, cidades)
- `js/game.js` — lógica da batalha
- `js/draw.js` — desenho em pixel art
- `js/ui.js` — HUD, menus da jornada
- `js/cards.js` — cartas desenhadas por categoria
- `js/meta.js` — menu principal, aventura, loja
- `js/garden.js` — jardim, Árvore da Vida, tutorial
- `js/icons.js` — ícones dos itens (loja, equipamento, barra de itens) em pixel grosso com contorno

## Teste antes de publicar

```bash
node tools/smoke.mjs
```

Abre o jogo no Google Chrome sem janela e passa por todas as telas e por uma batalha em cada mundo, como jogador novo, com progresso e com o controle bloqueado (como no artifact). Sai com erro se alguma tela quebrar.
