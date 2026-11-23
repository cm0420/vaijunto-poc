# VaiJunto — PoC de sistema de caronas

Protótipo navegável da atividade **Protótipo de Interface e Teste de Usabilidade** — Gestão de Projetos de Software · 8º período · UFVJM.

Caronas entre estudantes no trajeto real **Campus JK → Centro de Diamantina** (9,3 km, ~15 min).
Só o **caminho feliz**, tudo mockado: sem backend, sem banco de dados, sem autenticação real.

## Como rodar

Abra `index.html` no navegador (duplo clique). Precisa de internet só para as fontes, o GSAP, o Leaflet e os tiles do mapa (CDN).

## Fluxo

| Etapa | Pasta | O que dá pra fazer |
|---|---|---|
| 1. Cadastro / Autenticação | `cadastro/` | criar conta com validação em tempo real (e-mail @ufvjm.edu.br, máscara de celular, força da senha), escolher perfil, confirmar código de 4 dígitos (qualquer código serve), ou entrar com conta existente |
| 2. Busca e Match | `busca/` | autocomplete de lugares, inverter rota, dia/horário/passageiros, carregamento com skeleton, ordenar por match/preço/horário/nota, carros no mapa, detalhe do motorista com embarque no mapa |
| 3. Pagamento e Divisão | `pagamento/` | divisão do custo por ocupante, gorjeta, cupom (`CALOURO` = 10%), Pix com QR e contador, cartão com preview ao vivo, dinheiro; confirmação com recibo e acompanhamento da viagem no mapa |

O nome digitado no cadastro e a carona escolhida seguem pela URL (`?nome=…&carona=…`).

## Divisão do time (subequipe de desenvolvimento)

| Papel | Pessoa | Responsabilidade | Pasta |
|---|---|---|---|
| Dev 1 | Miguel | Tela de Cadastro / Autenticação | `cadastro/` |
| Dev 2 | Maria | Tela de Busca e Match de Caronas | `busca/` |
| Dev 3 | Humberto | Tela de Pagamento e Divisão de Custos | `pagamento/` |
| Integração | Yago | Design system, dados mockados, mapa, etapas e transições que ligam as 3 telas | `shared/`, `index.html` |

Cada pessoa tem commits próprios com o nome no título.

## Estrutura

```
index.html            entrada → cadastro
shared/base.css       design system: cores, tipografia, botões, campos, chips, layout painel + mapa
shared/caronas.js     dados mockados: rota real (OSRM/OpenStreetMap, gravada no arquivo), lugares, caronas
shared/mapa.js        mapa Leaflet: rota animada, pins, carros andando pela rota
shared/fluxo.js       ícones, barra de etapas, transição entre telas, toast, helpers
cadastro/  busca/  pagamento/   uma pasta por dev
```

## Notas

- Animações com [GSAP 3](https://gsap.com) (+ Flip na reordenação da lista). Respeita `prefers-reduced-motion`.
- Mapa: [Leaflet](https://leafletjs.com) com tiles Esri Light Gray (não exige chave). Dados © OpenStreetMap.
- Nomes de motoristas, avaliações, placas e valores são fictícios.
