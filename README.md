# VaiJunto — PoC de sistema de caronas

Protótipo navegável (HTML + CSS + JS mínimo) da atividade **Protótipo de Interface e Teste de Usabilidade** — Gestão de Projetos de Software · 8º período · UFVJM.

Só o **caminho feliz**: todos os dados são mockados, não há backend, banco de dados nem autenticação real.

## Como rodar

Abra `index.html` no navegador (duplo clique). Precisa de internet só para carregar a fonte Inter e o GSAP via CDN.

## Fluxo

1. **Cadastro / Autenticação** → `cadastro/`
2. **Busca e Match de Caronas** → `busca/`
3. **Pagamento e Divisão de Custos** → `pagamento/`

`index.html` redireciona para o cadastro. O nome digitado no cadastro e a carona escolhida na busca seguem para a próxima tela pela URL (`?nome=…&carona=…`).

## Divisão do time (subequipe de desenvolvimento)

| Papel | Pessoa | Responsabilidade | Pasta |
|---|---|---|---|
| Dev 1 | Miguel | Tela de Cadastro / Autenticação | `cadastro/` |
| Dev 2 | Maria | Tela de Busca e Match de Caronas | `busca/` |
| Dev 3 | Humberto | Tela de Pagamento e Divisão de Custos | `pagamento/` |
| Integração | Yago | Junta as 3 telas num fluxo único: base visual compartilhada, dados mockados comuns, barra de etapas, transições e links | `shared/`, `index.html` |

Cada pessoa tem um commit próprio com o nome no título.

## Estrutura

```
index.html            entrada → cadastro
shared/base.css       tokens visuais, botões, barra de etapas (Integração)
shared/caronas.js     caronas mockadas usadas por Busca e Pagamento (Integração)
shared/fluxo.js       parâmetros de URL, barra de etapas, transição entre telas (Integração)
cadastro/             Dev 1
busca/                Dev 2
pagamento/            Dev 3
```

## Visual e animação

- Paleta monocromática (preto/branco/cinzas), botões em pílula, cards com raio 16px, fonte Inter.
- Animações com [GSAP 3](https://gsap.com) (entrada das telas, stagger da lista, bottom sheet, check de sucesso). Respeita `prefers-reduced-motion`.
