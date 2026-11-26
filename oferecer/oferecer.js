// Tela Oferecer carona (motorista) — correção pós-teste livre 2
// Mock: nada vai para servidor; o custo usa a mesma regra do pagamento (custo da viagem ÷ lugares do carro).
(function () {
  const d = VJ.d;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const nome = VJ.param("nome", "Ana");
  $("[data-nome]").textContent = nome;
  $$("[data-back], [data-restart], .logo").forEach((a) => { a.href = VJ.inicio(nome); });

  // Estimativa do trajeto de 9,3 km (mesma ordem de grandeza das caronas mockadas)
  const COMBUSTIVEL = 18, DESGASTE = 4, CUSTO = COMBUSTIVEL + DESGASTE;
  const preencher = (campo, valor) => $$(`[data-f="${campo}"]`).forEach((el) => { el.textContent = valor; });
  preencher("combustivel", VJ.brl(COMBUSTIVEL));
  preencher("desgaste", VJ.brl(DESGASTE));
  preencher("custo", VJ.brl(CUSTO));
  $("[data-km]").textContent = `${VJ.ROTA_INFO.km.toLocaleString("pt-BR")} km`;

  // ---------- Trajeto ----------
  const PONTOS_JK = [
    { nome: "Portaria principal do Campus JK", i: 0 },
    { nome: "Estacionamento do Bloco II", i: 6 },
    { nome: "Ponto de ônibus da BR-367", i: 14 },
  ];
  const selOrigem = $("#origem"), selDestino = $("#destino"), selPonto = $("#ponto");
  const opcoes = VJ.LUGARES.map((l) => `<option value="${l.id}">${l.nome}</option>`).join("");
  selOrigem.innerHTML = opcoes;
  selDestino.innerHTML = opcoes;
  selOrigem.value = "jk";
  selDestino.value = "centro";
  function atualizarPontos() {
    const o = VJ.lugar(selOrigem.value);
    const lista = o.id === "jk" ? PONTOS_JK : [{ nome: o.nome, i: 0 }];
    selPonto.innerHTML = lista.map((p) => `<option value="${p.i}">${p.nome}</option>`).join("");
    mostrarEmbarque();
  }
  [selOrigem, selDestino].forEach((s) => s.addEventListener("change", () => {
    if (selOrigem.value === selDestino.value) {
      const outroSel = s === selOrigem ? selDestino : selOrigem;
      outroSel.value = VJ.LUGARES.find((l) => l.id !== s.value).id;
      VJ.toast("Origem e destino precisam ser diferentes", "pin");
    }
    atualizarPontos();
  }));
  $("[data-trocar]").addEventListener("click", (e) => {
    [selOrigem.value, selDestino.value] = [selDestino.value, selOrigem.value];
    gsap.fromTo(e.currentTarget, { rotation: 0 }, { rotation: 180, duration: d(0.45), ease: "power2.inOut", clearProps: "transform" });
    atualizarPontos();
  });
  selPonto.addEventListener("change", mostrarEmbarque);

  // ---------- Vagas e divisão ----------
  let vagas = 3;
  function atualizarCusto() {
    const lugares = vagas + 1;
    const parte = CUSTO / lugares;
    $("#qtd-vagas").textContent = vagas;
    $("[data-menos]").disabled = vagas <= 1;
    $("[data-mais]").disabled = vagas >= 4;
    preencher("lugares", lugares);
    preencher("parte", VJ.brl(parte));
    $(".barra-cotas").innerHTML = [`<span class="cota motor" title="Você (motorista)">Você</span>`,
      ...Array(vagas).fill(`<span class="cota" title="Passageiro">${VJ.brl(parte)}</span>`)].join("");
    $("[data-dica]").textContent = `Com as ${vagas} ${vagas > 1 ? "vagas preenchidas" : "vaga preenchida"} você recebe ${VJ.brl(parte * vagas)} e paga só a sua parte (${VJ.brl(parte)}) dos ${VJ.brl(CUSTO)} da viagem.`;
  }
  const mudarVagas = (n) => {
    vagas = Math.max(1, Math.min(4, n));
    atualizarCusto();
    gsap.fromTo("#qtd-vagas", { scale: 1.4 }, { scale: 1, duration: d(0.3), ease: "back.out(3)" });
    gsap.from(".barra-cotas .cota", { scaleX: 0.6, duration: d(0.3), stagger: 0.03, ease: "power2.out" });
  };
  $("[data-menos]").addEventListener("click", () => mudarVagas(vagas - 1));
  $("[data-mais]").addEventListener("click", () => mudarVagas(vagas + 1));

  // ---------- Carro: validação ----------
  const placa = $("#placa");
  placa.addEventListener("input", () => {
    const v = placa.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
    placa.value = v.length > 3 ? `${v.slice(0, 3)}-${v.slice(3)}` : v;
  });
  const REGRAS = {
    carro: [() => $("#carro").value.trim().length >= 3, "Diga o modelo e a cor do carro."],
    placa: [() => /^[A-Z]{3}-\d[A-Z0-9]\d{2}$/.test(placa.value), "Placa no formato ABC-1D23 ou ABC-1234."],
  };
  function validar(campo, mostrarErro) {
    const field = $(`[data-validar="${campo}"]`);
    const [ok, erro] = REGRAS[campo];
    const valido = ok();
    field.classList.toggle("is-ok", valido);
    if (valido) { field.classList.remove("is-erro"); $(`#${campo}-msg`).textContent = ""; }
    else if (mostrarErro) { field.classList.add("is-erro"); $(`#${campo}-msg`).textContent = erro; }
    field.querySelector("input").setAttribute("aria-invalid", String(!valido && mostrarErro));
    return valido;
  }
  Object.keys(REGRAS).forEach((campo) => {
    const input = $(`#${campo}`);
    input.addEventListener("blur", () => { if (input.value) validar(campo, true); });
    input.addEventListener("input", () => {
      const f = input.closest(".field");
      if (f.classList.contains("is-erro") || f.classList.contains("is-ok")) validar(campo, f.classList.contains("is-erro"));
    });
  });

  // ---------- Mapa ----------
  const m = VJ.mapa("mapa", { padding: [70, 70] });
  m.rota();
  m.inicioFim({ rotuloInicio: false });
  const carro = m.carro(0, 200);
  carro.el().classList.add("is-ativo");
  let pinEmbarque = null;
  function mostrarEmbarque() {
    const i = Number(selPonto.value || 0);
    if (pinEmbarque) pinEmbarque.remove();
    pinEmbarque = m.pin(m.latlng(i), `<div class="pin-ponto"></div><span class="pin-label baixo">Embarque · ${$("#hora").value}</span>`, [18, 18]);
    carro.setLatLng(m.latlng(i));
  }
  $("#hora").addEventListener("change", mostrarEmbarque);

  // ---------- Publicar ----------
  let atual = $("#etapa-form");
  function irPara(sel, depois) {
    const prox = $(sel);
    gsap.to(atual, {
      opacity: 0, x: -24, duration: d(0.25), ease: "power2.in",
      onComplete: () => {
        atual.hidden = true; gsap.set(atual, { clearProps: "all" });
        prox.hidden = false; atual = prox;
        $(".painel").scrollTo(0, 0);
        depois && depois();
      },
    });
  }
  $("#form-oferecer").addEventListener("submit", (e) => {
    e.preventDefault();
    const invalidos = Object.keys(REGRAS).filter((c) => !validar(c, true));
    if (invalidos.length) {
      const primeiro = $(`[data-validar="${invalidos[0]}"]`);
      primeiro.querySelector("input").focus();
      gsap.fromTo(primeiro, { x: -6 }, { x: 0, duration: d(0.4), ease: "elastic.out(1, 0.3)" });
      return;
    }
    const btn = e.submitter || $("#form-oferecer [type=submit]");
    btn.classList.add("is-loading");
    const dia = $('input[name="dia"]:checked').value;
    preencher("codigo", "VJ-OF-" + String(Math.floor(1000 + Math.random() * 9000)));
    preencher("quando", `${dia}, ${$("#hora").value}`);
    preencher("vagas", `${vagas} ${vagas > 1 ? "vagas" : "vaga"}`);
    preencher("trajeto", `${VJ.lugar(selOrigem.value).nome.split(" —")[0]} → ${VJ.lugar(selDestino.value).nome.split(" —")[0]}`);
    preencher("ponto", selPonto.options[selPonto.selectedIndex].text);
    preencher("carro", `${$("#carro").value.trim()} · ${placa.value}`);
    setTimeout(() => {
      btn.classList.remove("is-loading");
      irPara("#etapa-ok", () => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".selo", { scale: 0, rotation: -60, duration: d(0.6), ease: "back.out(1.8)" })
          .fromTo(".selo path", { strokeDashoffset: 50 }, { strokeDashoffset: 0, duration: d(0.45) }, "-=0.25")
          .from("#etapa-ok > :not(.selo)", { opacity: 0, y: 14, stagger: 0.07, duration: d(0.4) }, "-=0.2");
        m.map.flyTo(m.latlng(Number(selPonto.value || 0)), 15, { duration: VJ.reduz ? 0 : 1 });
      });
    }, VJ.reduz ? 0 : 1000);
  });
  $("[data-outra]").addEventListener("click", () => irPara("#etapa-form", () => {
    $("#form-oferecer").reset();
    ["carro", "placa"].forEach((c) => { const f = $(`[data-validar="${c}"]`); f.classList.remove("is-ok", "is-erro"); $(`#${c}-msg`).textContent = ""; });
    selOrigem.value = "jk"; selDestino.value = "centro";
    vagas = 3; atualizarCusto(); atualizarPontos(); m.enquadrar();
    gsap.from("#etapa-form > *", { opacity: 0, y: 14, stagger: 0.05, duration: d(0.35) });
  }));

  // ---------- Entrada ----------
  atualizarCusto();
  atualizarPontos();
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".topbar", { autoAlpha: 0, y: -10, duration: d(0.4) })
    .from("#form-oferecer > .bloco", { opacity: 0, y: 18, stagger: 0.07, duration: d(0.5), clearProps: "transform,opacity" }, "-=0.2")
    .from(".rodape-pagar", { yPercent: 100, duration: d(0.5) }, "-=0.5");
})();
