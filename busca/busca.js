// Tela Busca e Match de Caronas — Dev 2 (Maria)
// Mock: a busca sempre devolve as caronas de shared/caronas.js; filtros e ordenação rodam no navegador.
(function () {
  const d = VJ.d;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  if (window.Flip) gsap.registerPlugin(Flip);

  const nome = VJ.param("nome", "Ana");
  $("[data-nome]").textContent = nome;
  const h = new Date().getHours();
  $("[data-periodo]").textContent = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";

  // ---------- Entrada ----------
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".topbar", { autoAlpha: 0, y: -10, duration: d(0.4) })
    .from(".saudacao > *", { autoAlpha: 0, y: 16, stagger: 0.08, duration: d(0.5) }, "-=0.2")
    .from(".busca-card", { autoAlpha: 0, y: 24, duration: d(0.5) }, "-=0.3")
    .from(".busca-card > *", { opacity: 0, y: 10, stagger: 0.06, duration: d(0.35), clearProps: "transform,opacity" }, "-=0.3");

  // ---------- Mapa ----------
  const m = VJ.mapa("mapa", { padding: [70, 70] });
  m.rota();
  const { ini } = m.inicioFim();
  const rotuloInicio = (visivel) => { const r = ini.getElement().querySelector(".pin-label"); if (r) r.hidden = !visivel; };
  const carros = {};
  VJ.CARONAS.forEach((c) => {
    carros[c.id] = m.carro(c.iCarro, c.hue);
    gsap.from(carros[c.id].el(), { scale: 0, duration: d(0.5), ease: "back.out(2)", delay: d(1.2 + c.id * 0.15), clearProps: "transform" });
  });
  let pinEmbarque = null;
  function focarNoMapa(c) {
    Object.entries(carros).forEach(([id, mk]) => {
      mk.el().classList.toggle("is-ativo", c && Number(id) === c.id);
      mk.el().classList.toggle("is-apagado", c && Number(id) !== c.id);
    });
  }
  function mostrarEmbarque(c) {
    if (pinEmbarque) pinEmbarque.remove();
    rotuloInicio(false);
    pinEmbarque = m.pin(m.latlng(c.iRota), `<div class="pin-ponto"></div><span class="pin-label baixo">Embarque · ${c.saida}</span>`, [18, 18]);
    m.map.flyTo(m.latlng(c.iRota), 16, { duration: VJ.reduz ? 0 : 1 });
    m.andar(carros[c.id], c.iCarro, c.iRota, 1.8, { ease: "power2.inOut" });
  }

  // ---------- Autocomplete de lugares ----------
  const ICONE_TIPO = { campus: "livro", centro: "pin", onibus: "carro", bairro: "pin" };
  ["origem", "destino"].forEach((campo) => {
    const input = $("#" + campo);
    const lista = $("#sugestoes-" + campo);
    let ativo = -1;
    const abrir = () => {
      const q = input.value.trim().toLowerCase();
      const outro = $(campo === "origem" ? "#destino" : "#origem").value;
      const itens = VJ.LUGARES.filter((l) => l.nome !== outro && (!q || l.nome.toLowerCase().includes(q) || l.sub.toLowerCase().includes(q) || input.dataset.limpo !== "1"));
      lista.innerHTML = itens.map((l, i) => `
        <li class="sugestao" role="option" id="${campo}-op-${i}" data-nome="${l.nome}" aria-selected="false">
          <span class="sug-ico">${VJ.ico(ICONE_TIPO[l.tipo])}</span>
          <div><strong>${l.nome}</strong><span>${l.sub}</span></div>
        </li>`).join("");
      lista.hidden = !itens.length;
      input.setAttribute("aria-expanded", String(!lista.hidden));
      ativo = -1;
      if (!lista.hidden) gsap.fromTo(lista, { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: d(0.2) });
    };
    const fechar = () => { lista.hidden = true; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); };
    const escolher = (li) => {
      input.value = li.dataset.nome;
      input.dataset.limpo = "0";
      fechar();
      gsap.fromTo(input, { backgroundColor: "#e3f6ee" }, { backgroundColor: "#f6f8f7", duration: d(0.6), clearProps: "backgroundColor" });
    };
    input.addEventListener("focus", () => { input.select(); abrir(); });
    input.addEventListener("input", () => { input.dataset.limpo = "1"; abrir(); });
    input.addEventListener("blur", () => setTimeout(fechar, 150));
    input.addEventListener("keydown", (e) => {
      const ops = $$(".sugestao", lista);
      if (lista.hidden || !ops.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        ativo = (ativo + (e.key === "ArrowDown" ? 1 : -1) + ops.length) % ops.length;
        ops.forEach((o, i) => o.setAttribute("aria-selected", i === ativo));
        input.setAttribute("aria-activedescendant", ops[ativo].id);
      } else if (e.key === "Enter" && ativo >= 0) { e.preventDefault(); escolher(ops[ativo]); }
      else if (e.key === "Escape") fechar();
    });
    lista.addEventListener("mousedown", (e) => { const li = e.target.closest(".sugestao"); if (li) { e.preventDefault(); escolher(li); } });
  });

  $("[data-trocar]").addEventListener("click", (e) => {
    const o = $("#origem"), de = $("#destino");
    [o.value, de.value] = [de.value, o.value];
    gsap.fromTo(e.currentTarget.querySelector("svg"), { rotation: 0 }, { rotation: 180, duration: d(0.45), ease: "power2.inOut" });
    gsap.fromTo([o, de], { y: (i) => (i ? -8 : 8), opacity: 0.4 }, { y: 0, opacity: 1, duration: d(0.35), ease: "power2.out" });
  });

  // ---------- Passageiros ----------
  let lugares = 1;
  const out = $("#qtd-passageiros");
  const setLugares = (n) => {
    lugares = Math.max(1, Math.min(3, n));
    out.textContent = lugares;
    gsap.fromTo(out, { scale: 1.4 }, { scale: 1, duration: d(0.3), ease: "back.out(3)" });
  };
  $("[data-menos]").addEventListener("click", () => setLugares(lugares - 1));
  $("[data-mais]").addEventListener("click", () => setLugares(lugares + 1));

  // ---------- Busca → skeleton → resultados ----------
  const lista = $("#lista");
  const resultados = $("#resultados");
  const NOMES_ORDEM = { match: "match", preco: "preço", saida: "horário", nota: "nota" };
  const ORDENS = {
    match: (a, b) => b.match - a.match,
    preco: (a, b) => VJ.parte(a) - VJ.parte(b),
    saida: (a, b) => a.saida.localeCompare(b.saida),
    nota: (a, b) => b.nota - a.nota,
  };
  let caronas = [];

  const cardHTML = (c) => `
    <li data-id="${c.id}">
      <button type="button" class="carona" data-id="${c.id}" aria-label="${c.motorista}, sai ${c.saida}, ${VJ.brl(VJ.parte(c))}, ${c.match}% de match">
        <span class="avatar" style="--hue:${c.hue}">${VJ.iniciais(c.motorista)}</span>
        <span class="carona-meio">
          <span class="carona-nome">${c.motorista} <span class="carona-nota">${VJ.ico("estrela")}${c.nota.toFixed(1).replace(".", ",")}</span></span>
          <span class="carona-horas"><b>${c.saida}</b><i></i>${c.chegada} · ${c.viagens} viagens</span>
        </span>
        <span class="carona-preco">
          <strong>${VJ.brl(VJ.parte(c))}</strong>
          <span class="match${c.match >= 90 ? " alto" : ""}">${c.match}% match</span>
        </span>
        <span class="carona-pe">
          <span class="vagas-dots" aria-hidden="true">${Array.from({ length: c.total - 1 }, (_, k) => `<i class="${k < c.vagas ? "livre" : ""}"></i>`).join("")}<span>${c.vagas} ${c.vagas > 1 ? "vagas" : "vaga"}</span></span>
          <span class="tag">${c.tags[0]}</span>
        </span>
      </button>
    </li>`;

  function render(animar) {
    const ordem = $('input[name="ordem"]:checked').value;
    $("[data-ordem-nome]").textContent = NOMES_ORDEM[ordem];
    const ordenadas = [...caronas].sort(ORDENS[ordem]);
    if (!animar && window.Flip && lista.children.length) {
      const estado = Flip.getState("#lista > li");
      ordenadas.forEach((c) => lista.append(lista.querySelector(`li[data-id="${c.id}"]`)));
      Flip.from(estado, { duration: d(0.55), ease: "power3.inOut", stagger: 0.04 });
      return;
    }
    lista.innerHTML = ordenadas.map(cardHTML).join("");
    gsap.from("#lista > li", { opacity: 0, y: 18, stagger: 0.08, duration: d(0.45), ease: "power3.out" });
  }

  $("#form-busca").addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = $("#form-busca [type=submit]");
    btn.classList.add("is-loading");
    $("[data-hora-busca]").textContent = $("#hora").value;
    resultados.hidden = false;
    lista.innerHTML = $("#tpl-skeleton").innerHTML.repeat(3);
    gsap.from(".resultados-topo, .filtros", { opacity: 0, y: 10, duration: d(0.3) });
    $(".painel").scrollTo({ top: resultados.offsetTop - 16, behavior: VJ.reduz ? "auto" : "smooth" });
    setTimeout(() => {
      btn.classList.remove("is-loading");
      caronas = VJ.CARONAS.filter((c) => c.vagas >= lugares);
      $("[data-qtd]").textContent = caronas.length;
      lista.innerHTML = "";
      render(true);
      m.enquadrar();
      focarNoMapa(null);
    }, VJ.reduz ? 0 : 1100);
  });

  $$('input[name="ordem"]').forEach((r) => r.addEventListener("change", () => render(false)));

  lista.addEventListener("mouseover", (e) => { const b = e.target.closest(".carona"); if (b) focarNoMapa(VJ.carona(b.dataset.id)); });
  lista.addEventListener("mouseleave", () => focarNoMapa(null));
  lista.addEventListener("click", (e) => { const b = e.target.closest(".carona"); if (b) abrirDetalhe(VJ.carona(b.dataset.id), b); });

  // ---------- Detalhe ----------
  const pBusca = $("#painel-busca"), pDet = $("#painel-detalhe");
  let origemFoco = null;
  function abrirDetalhe(c, botao) {
    origemFoco = botao;
    const campos = {
      iniciais: VJ.iniciais(c.motorista), motorista: c.motorista, curso: c.curso, match: `${c.match}%`,
      nota: c.nota.toFixed(1).replace(".", ","), viagens: c.viagens, vagas: `${c.vagas}/${c.total - 1}`,
      saida: c.saida, chegada: c.chegada, ponto: c.ponto, carro: c.carro, placa: c.placa,
      "review-texto": `“${c.review.texto}”`, "review-autor": c.review.autor, preco: VJ.brl(VJ.parte(c)),
    };
    Object.entries(campos).forEach(([k, v]) => { pDet.querySelector(`[data-f="${k}"]`).textContent = v; });
    pDet.querySelector(".avatar").style.setProperty("--hue", c.hue);
    pDet.querySelector("[data-f-match]").setAttribute("aria-label", `${c.match}% de match com sua rota`);
    pDet.querySelector("[data-f-tags]").innerHTML = c.tags.map((t, i) => `<span class="tag${i === 0 ? " tag-brand" : ""}">${t}</span>`).join("");
    pDet.querySelector("[data-next]").href = "../pagamento/index.html" + VJ.qs({ carona: c.id, nome });

    pBusca.hidden = true;
    pDet.hidden = false;
    $(".painel").scrollTo(0, 0);
    focarNoMapa(c);
    mostrarEmbarque(c);
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from("#painel-detalhe > *", { opacity: 0, x: 24, stagger: 0.05, duration: d(0.4) })
      .fromTo(".match-anel .anel", { strokeDashoffset: 119.4 }, { strokeDashoffset: 119.4 * (1 - c.match / 100), duration: d(0.9), ease: "power2.out" }, 0.2);
    pDet.querySelector("[data-fechar]").focus({ preventScroll: true });
  }
  $("[data-fechar]").addEventListener("click", () => {
    pDet.hidden = true;
    pBusca.hidden = false;
    if (pinEmbarque) { pinEmbarque.remove(); pinEmbarque = null; }
    rotuloInicio(true);
    focarNoMapa(null);
    m.enquadrar();
    gsap.from(pBusca, { opacity: 0, x: -24, duration: d(0.35), ease: "power3.out" });
    $(".painel").scrollTo(0, resultados.offsetTop - 16);
    if (origemFoco) origemFoco.focus({ preventScroll: true });
  });
})();
