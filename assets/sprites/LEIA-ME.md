# Sprites do Aseprite

Desenhe no Aseprite, exporte para esta pasta e o jogo usa o seu desenho no lugar do desenho feito por código.
O que não tiver arquivo continua como está.

## Como exportar

1. No Aseprite: **File > Export Sprite Sheet**.
2. Aba **Layout**: qualquer tipo serve (Horizontal Strip é o mais simples).
3. Aba **Output**:
   - marque **Output File** e salve como `NOME.png` nesta pasta;
   - marque **JSON Data**, salve como `NOME.json` nesta pasta (Hash ou Array, tanto faz);
   - em **Meta**, marque **Tags** (e **Slices**, se usar pivô).
4. Abra `sprites.json` e acrescente o nome: `["odio", "lavrador", "tree-videira"]`.
5. Recarregue o jogo. Em **Ajustes > Sprites do Aseprite** aparece o que carregou.

## Nomes

| O que | Nome do arquivo | Tags que o jogo usa |
|---|---|---|
| Pragas e chefes | `odio`, `inveja`, `discordia`, `gula`, `feitico`, `ambicao`, `embriaguez`, `contenda`, `contendinha`, `impureza`, `faccoes`, `ira`, `ciume`, `heresia`, `bezerro`, `golias`, `farao`, `leviata` | `walk`, `hurt`, `frozen`, `idle` |
| Personagens | `lavrador`, `noe`, `rute`, `davi`, `elias`, `jose`, `debora`, `moises` | `idle`, `walk`, `jump`, `slam`, `attack` |
| Árvores | `tree-videira`, `tree-roma`, `tree-oliveira`, `tree-sarca`, `tree-figueira`, `tree-tamareira`, `tree-amendoeira`, `tree-lirio`, `tree-mostarda` | `idle` |

Nenhuma tag é obrigatória. Sem a tag pedida, o jogo usa a primeira que existir na lista, ou todos os quadros em sequência.
A duração de cada quadro e a direção da tag (forward, reverse, pingpong) vêm do Aseprite.

## Tamanho e posição

- 1 pixel do Aseprite = 1 unidade do jogo. A tela do jogo tem 384 × 216 unidades.
  Uma praga comum tem cerca de 10 a 16 pixels de altura, o lavrador uns 20, uma árvore uns 28.
- Os **pés** ficam no meio da base do quadro. Para mudar isso, crie um **slice** chamado `pivot`
  e marque o ponto de pivô nele (ou use a base do slice).
- O contorno escuro é colocado pelo jogo. Não precisa desenhar.
- **Pragas**: desenhe olhando para a **esquerda** (elas andam para a esquerda).
- **Personagens**: desenhe olhando para a **direita**. O jogo espelha quando eles viram.

## Exemplo

A pasta `exemplo/` tem duas folhas prontas no formato do Aseprite: uma praga (`odio`) e uma árvore (`tree-videira`).
Para testar, copie as duas para esta pasta e coloque `["odio", "tree-videira"]` em `sprites.json`.
