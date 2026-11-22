// Tela Busca e Match de Caronas — Dev 2 (Maria)
// Dados mockados: a busca sempre retorna as mesmas caronas.
(function () {
  // Integração: caronas vêm de shared/caronas.js (mesma fonte da tela de Pagamento)
  const CARONAS = VJ.CARONAS.map((c) => ({ ...c, preco: VJ.parte(c) }));
  const nome = VJ.param("nome", "Ana");
  document.querySelector("[data-nome]").textContent = nome;

  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const d = (s) => (reduz ? 0 : s);
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const iniciais = (nome) => nome.split(" ").map((p) => p[0]).slice(0, 2).join("");

  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".topo > *", { autoAlpha: 0, y: 16, stagger: 0.08, duration: d(0.5) })
    .from(".busca-card", { autoAlpha: 0, y: 24, duration: d(0.5) }, "-=0.3");

  // Inverter origem / destino
  document.querySelector("[data-trocar]").addEventListener("click", (e) => {
    const o = document.getElementById("origem");
    const de = document.getElementById("destino");
    [o.value, de.value] = [de.value, o.value];
    gsap.fromTo(e.currentTarget, { rotation: 0 }, { rotation: 180, duration: d(0.4), ease: "power2.inOut" });
  });

  // Buscar → lista com match
  const lista = document.getElementById("lista");
  document.getElementById("form-busca").addEventListener("submit", (e) => {
    e.preventDefault();
    lista.innerHTML = CARONAS.map((c, i) => `
      <li>
        <button type="button" class="carona${i === 0 ? " is-top" : ""}" data-id="${c.id}">
          <span class="avatar">${iniciais(c.motorista)}</span>
          <span class="carona-info">
            <strong>${c.motorista}</strong>
            <span>${c.horario} · ${c.vagas} ${c.vagas > 1 ? "vagas" : "vaga"} · ${c.nota} ★</span>
          </span>
          <span class="carona-preco">
            <strong>${brl(c.preco)}</strong>
            <span class="match">${i === 0 ? "Melhor match · " : ""}${c.match}%</span>
          </span>
        </button>
      </li>`).join("");
    document.querySelector("[data-qtd]").textContent = CARONAS.length;
    const res = document.getElementById("resultados");
    res.hidden = false;
    gsap.timeline()
      .from(".resultados-topo", { autoAlpha: 0, y: 12, duration: d(0.35) })
      .from(".lista li", { autoAlpha: 0, y: 20, stagger: 0.08, duration: d(0.45), ease: "power3.out" }, "-=0.15");
    res.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "start" });
  });

  // Bottom sheet de detalhes
  const sheet = document.getElementById("sheet");
  const fundo = document.getElementById("sheet-fundo");
  let ultimoFoco = null;

  lista.addEventListener("click", (e) => {
    const btn = e.target.closest(".carona");
    if (btn) abrir(CARONAS.find((c) => c.id === Number(btn.dataset.id)), btn);
  });

  function abrir(c, origem) {
    ultimoFoco = origem;
    const campos = {
      iniciais: iniciais(c.motorista), motorista: c.motorista, nota: c.nota, viagens: c.viagens,
      match: `${c.match}% match`, horario: c.horario, carro: c.carro,
      vagas: `${c.vagas} ${c.vagas > 1 ? "livres" : "livre"}`, preco: brl(c.preco), ponto: c.ponto,
    };
    Object.entries(campos).forEach(([k, v]) => { sheet.querySelector(`[data-f="${k}"]`).textContent = v; });
    sheet.querySelector("[data-next]").href = `../pagamento/index.html?carona=${c.id}&nome=${encodeURIComponent(nome)}`;
    sheet.hidden = fundo.hidden = false;
    gsap.fromTo(fundo, { autoAlpha: 0 }, { autoAlpha: 1, duration: d(0.25) });
    gsap.fromTo(sheet, { yPercent: 100 }, { yPercent: 0, duration: d(0.45), ease: "power3.out" });
    sheet.querySelector("[data-next]").focus({ preventScroll: true });
  }

  function fechar() {
    gsap.to(fundo, { autoAlpha: 0, duration: d(0.2) });
    gsap.to(sheet, {
      yPercent: 100, duration: d(0.3), ease: "power2.in",
      onComplete: () => { sheet.hidden = fundo.hidden = true; ultimoFoco && ultimoFoco.focus(); },
    });
  }
  fundo.addEventListener("click", fechar);
  sheet.querySelector("[data-fechar]").addEventListener("click", fechar);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) fechar(); });
})();
