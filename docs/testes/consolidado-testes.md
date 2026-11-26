# Consolidado dos testes de usabilidade — VaiJunto

| | |
|---|---|
| **Atividade** | Protótipo de Interface e Teste de Usabilidade · Gestão de Projetos de Software · 8º período · UFVJM |
| **Protótipo** | VaiJunto (`vaijunto-poc`): caronas Campus JK → Centro de Diamantina |
| **Período** | 25/11/2026 a 26/11/2026 |
| **Testes** | 2 testes fixos de funcionalidade + 2 testes livres de usabilidade |
| **Ambiente** | Navegador Chromium, servidor local (`python -m http.server`), computador e celular (375×812) |
| **Resultado geral** | **4 de 4 testes concluídos.** O fluxo completo funciona do cadastro ao pagamento e à oferta de carona. Ficam **2 problemas de gravidade alta abertos**, ambos no pagamento (Teste fixo 2). |

Relatórios completos:

- [Teste fixo 1 — Cadastro de novo usuário](teste-01-cadastro.md)
- [Teste fixo 2 — Busca e confirmação de carona](teste-02-busca-reserva.md)
- [Teste livre 1 — Navegação ponta a ponta, mapa e cupom](teste-livre-01-navegacao-cupom.md)
- [Teste livre 2 — Conta, login, reserva com custos e oferta de carona](teste-livre-02-conta-login-oferta.md)

---

## 1. Visão geral

| Teste | Tipo | Responsável | Data | Foco | Resultado | Problemas abertos |
|---|---|---|---|---|---|---|
| **Fixo 1** | Funcionalidade | Tester 1 — Ana Clara | 25/11 | Cadastro, código de verificação e passagem para a Busca | Concluído com sucesso | 5 (1 média, 4 baixas) |
| **Fixo 2** | Funcionalidade | Tester 2 — _(nome)_ | 26/11 | Busca para 2 passageiros, detalhe do motorista, reserva e pagamento | Concluído com ressalvas | 4 (**2 altas**, 2 baixas) |
| **Livre 1** | Usabilidade | Tester — _(nome)_ | 26/11 | Navegação ponta a ponta, mapa, retorno visual e cupom | Concluído com sucesso | 0 |
| **Livre 2** | Usabilidade | Tester — _(nome)_ | 26/11 | Conta e login, reserva com cálculo de custos e oferta de carona | Concluído com sucesso | 0 |

Os dois testes livres tiveram uma **primeira rodada com problemas** (8 no total). Eles foram corrigidos no mesmo dia e os testes foram refeitos do zero; os relatórios mostram a rodada final. A seção 4 lista o que foi corrigido.

---

## 2. Resumo de cada teste

### Teste fixo 1 — Cadastro de novo usuário

A estudante Alice criou a conta errando de propósito (envio vazio, nome sem sobrenome, Gmail, senha curta) e depois corrigindo. A validação em tempo real, a máscara do celular, o medidor de força da senha e o código de 4 dígitos funcionaram, e o primeiro nome chegou à Busca. **Seis pontos de melhoria**, nenhum impeditivo; o mais relevante é que a regra da senha só fica clara quando o usuário erra (P1).

### Teste fixo 2 — Busca e confirmação de carona

A busca para 2 passageiros retornou as caronas que têm vagas, ordenadas por match; a ordenação, o autocomplete, o detalhe do motorista e a reserva até **"Vaga garantida!"** funcionaram no computador e no celular. Foram confirmados **dois problemas de gravidade alta**: o pagamento cobra e confirma **apenas 1 vaga** quando a busca foi para 2 passageiros, e o pagamento com **cartão é aprovado com os campos em branco**.

### Teste livre 1 — Navegação ponta a ponta, mapa e cupom

Fluxo completo do cadastro ao acompanhamento da viagem, com o mapa (zoom, arrastar, hover e clique nos carros) e o cupom `CALOURO` (vazio, inválido, minúsculo, com gorjeta, troca de cupom). Na rodada final tudo funcionou e **não houve problemas de usabilidade**.

### Teste livre 2 — Conta, login, reserva com custos e oferta de carona

Uma motorista criou a conta, **ofereceu uma carona** (validação de carro e placa, divisão do custo ao vivo, "Carona publicada!"), testou o login com erros comuns (campos vazios, Gmail, senha errada) e conferiu a divisão do custo das 3 caronas até a reserva com cupom e gorjeta. Na rodada final tudo funcionou **sem erros**.

---

## 3. Problemas em aberto

**Gravidade:** Alta (impede ou confunde muito) · Média (atrapalha, mas o usuário contorna) · Baixa (detalhe)

| ID | Gravidade | Onde | Problema | Sugestão |
|---|---|---|---|---|
| **T2-P1** | **Alta** | Busca → Pagamento | Busca para 2 passageiros, mas o pagamento cobra e confirma 1 vaga (R$ 6,00 em vez de R$ 12,00). | Ler `p` da URL no pagamento, multiplicar a parte e mostrar "2 vagas" no recibo. |
| **T2-P2** | **Alta** | Pagamento, Cartão | Cartão aprovado com número, nome, validade e CVV vazios. | Validar os 4 campos como o cadastro faz. |
| T1-P1 | Média | Cadastro, Senha | "Use letras e números." parece regra, mas só 8 caracteres é exigido. | "Mínimo de 8 caracteres. Letras e números deixam a senha mais forte." |
| T1-P2 | Baixa | Código, Reenviar | Depois do 1º reenvio o botão fica sempre ativo, sem contador. | Reiniciar o contador de 30 s a cada reenvio. |
| T1-P3 | Baixa | Termos de uso | Usuário aceita termos que não consegue ler. | Abrir um resumo dos termos num modal. |
| T1-P4 | Baixa | Código | Precisa clicar em Confirmar depois do 4º dígito. | Confirmar sozinho ao completar o código. |
| T1-P5 | Baixa | Cadastro no celular | Mapa ocupa o topo e o formulário fica abaixo da dobra. | Diminuir o mapa nessa tela em telas pequenas. |
| T2-P3 | Baixa | Detalhe do motorista | "Vagas 3/3" parece "lotado". | Escrever "3 livres". |
| T2-P4 | Baixa | Busca, Horário | O horário e o dia escolhidos não mudam os resultados (limitação do mock). | Filtrar ou avisar que o protótipo mostra sempre as caronas da manhã. |

**Prioridade sugerida:** T2-P1 e T2-P2 primeiro (afetam dinheiro e vaga reservada), depois T1-P1. Os demais são ajustes de texto e conforto.

---

## 4. Problemas já corrigidos (26/11/2026)

Achados na primeira rodada dos testes livres (e um do Teste fixo 1) e corrigidos antes da rodada final.

| Origem | Problema | Correção | Arquivos |
|---|---|---|---|
| Livre 1 | "Voltar" do pagamento abria a Busca vazia. | A busca manda `p`, `hora` e `dia` para o pagamento; o "Voltar" refaz a mesma busca. | `busca/busca.js`, `pagamento/pagamento.js` |
| Livre 1 + Fixo 1 (P6) | Aviso (toast) aparecia sobre o mapa, longe da ação. | No computador fica centralizado no alto do painel; nunca bloqueia cliques. | `shared/base.css` |
| Livre 1 | "Voltar ao início" levava de novo para "Criar conta". | "Voltar ao início" e o logo levam para a Busca, sem sair da conta. | `shared/fluxo.js`, `pagamento/`, `busca/` |
| Livre 1 | Clicar num carro do mapa não fazia nada. | Abre a carona; se ela não tem vagas para a busca, avisa. | `busca/busca.js`, `busca/busca.css` |
| Livre 2 | **Não havia como oferecer carona.** | Tela nova **Oferecer carona** (trajeto, embarque, dia/horário, vagas, carro e placa validados, divisão do custo ao vivo, confirmação). Perfil Motorista / Os dois ganha o botão na tela final; a Busca ganha o atalho "Vai de carro?". | `oferecer/` (novo), `cadastro/`, `busca/` |
| Livre 2 | Login entrava com campos vazios, Gmail e senha errada; e-mail sem ponto virava "Ana Souza". | Login valida e-mail @ufvjm.edu.br e senha; conta criada no navegador confere a senha e lembra nome e perfil; tela "Que bom te ver, …!". | `cadastro/cadastro.js`, `cadastro/index.html`, `shared/fluxo.js` |
| Livre 2 | "Esqueci minha senha" "enviava" o link sem e-mail. | Pede o e-mail antes e mostra para onde foi o link. | `cadastro/cadastro.js` |
| Livre 2 | Divisão do custo prometia redução impossível (5 pessoas num carro de 4). | Barra mostra motorista, outros passageiros, você e lugares livres; a dica explica que a parte é fixa. | `pagamento/pagamento.js`, `pagamento/pagamento.css` |
| Livre 1 | "Copiar código" do Pix gerava erro no console quando o navegador nega a área de transferência. | Erro tratado. | `pagamento/pagamento.js` |

> As correções mudaram dois detalhes descritos no Teste fixo 1: o aviso agora aparece no alto do painel (resolve o P6) e quem escolhe o perfil "Os dois" vê também o botão **Oferecer uma carona** na tela "Tudo pronto". Os problemas do Teste fixo 2 **não** foram corrigidos, para manter o resultado registrado pelos testadores.

---

## 5. O que funcionou bem em todos os testes

- **Retorno visual imediato:** campos verdes ou vermelhos durante a digitação, mensagens que dizem o que fazer, spinners, skeleton e avisos.
- **Continuidade entre telas:** nome, carona escolhida e valores seguem do cadastro à busca, ao pagamento e ao recibo; a barra de etapas mostra onde o usuário está.
- **Mapa útil:** rota real, carros ao vivo, ponto de embarque e acompanhamento da viagem.
- **Contas corretas:** parte de cada carona, cupom de 10% e gorjeta sempre fecham.
- **Funciona no celular** com o mesmo comportamento, sem erros no console.

## 6. Conclusão

Os quatro testes foram **concluídos**. O protótipo integrado cobre o caminho completo de um estudante da UFVJM: criar conta ou entrar, buscar e reservar uma carona com divisão justa do custo, pagar, acompanhar a viagem e, como motorista, oferecer vagas. Os testes livres validaram a navegação, o mapa, o cupom, o login e a oferta de viagens sem problemas de usabilidade na rodada final. Ficam em aberto **dois problemas de gravidade alta no pagamento** (quantidade de passageiros e validação do cartão), que devem ser a próxima correção, além de sete ajustes de gravidade média ou baixa.
