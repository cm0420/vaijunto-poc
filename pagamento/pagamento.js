// Tela Pagamento e Divisão de Custos — Dev 3 (Humberto)
// Carona mockada; pagamento sempre aprovado.
(function () {
  const CARONA = { motorista: "Lucas Pereira", horario: "07:20", carro: "Gol branco", combustivel: 20, desgaste: 4, ocupantes: 4, ponto: "Sai da portaria do Campus JK" };

  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const d = (s) => (reduz ? 0 : s);
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const custo = CARONA.combustivel + CARONA.desgaste;
  const parte = custo / CARONA.ocupantes;
  const NOMES_METODO = { pix: "Pix", cartao: "Cartão •••• 4821", dinheiro: "Dinheiro" };

  const preencher = (campo, valor) => document.querySelectorAll(`[data-f="${campo}"]`).forEach((el) => { el.textContent = valor; });
  preencher("iniciais", CARONA.motorista.split(" ").map((p) => p[0]).join(""));
  preencher("motorista", CARONA.motorista);
  preencher("primeiro-nome", CARONA.motorista.split(" ")[0]);
  preencher("horario", CARONA.horario);
  preencher("carro", CARONA.carro);
  preencher("ponto", CARONA.ponto);
  preencher("combustivel", brl(CARONA.combustivel));
  preencher("desgaste", brl(CARONA.desgaste));
  preencher("custo", brl(custo));
  preencher("ocupantes", CARONA.ocupantes);
  preencher("parte", brl(parte));

  // Assentos: motorista + passageiros, "você" destacado
  const pessoa = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 21a8 8 0 0 1 16 0z"/></svg>';
  const rotulos = ["Motorista", "Você", ...Array(CARONA.ocupantes - 2).fill("Passageiro")];
  document.querySelector(".assentos").innerHTML = rotulos.map((r, i) =>
    `<span class="assento${i === 0 ? " motor" : ""}${i === 1 ? " voce" : ""}">${pessoa}${r}<b>${brl(parte)}</b></span>`).join("");

  // QR Code ilustrativo (padrão fixo, não é Pix real)
  const qr = document.getElementById("qr");
  let rects = "";
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff" style="fill:#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
  for (let y = 0; y < 25; y++) for (let x = 0; x < 25; x++) {
    const emFinder = (x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16);
    if (!emFinder && ((x * 7 + y * 13 + x * y) % 5 < 2)) rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  qr.innerHTML = rects + finder(0, 0) + finder(18, 0) + finder(0, 18);

  // Entrada
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".topo", { autoAlpha: 0, y: -8, duration: d(0.4) })
    .from("[data-anim]", { autoAlpha: 0, y: 20, stagger: 0.1, duration: d(0.5) }, "-=0.2")
    .from(".assento", { autoAlpha: 0, scale: 0.8, stagger: 0.06, duration: d(0.35), ease: "back.out(2)" }, "-=0.4")
    .from(".rodape-pagar", { autoAlpha: 0, y: 24, duration: d(0.4) }, "-=0.3");

  // Troca de método
  document.querySelectorAll('input[name="metodo"]').forEach((r) => r.addEventListener("change", () => {
    document.querySelectorAll("[data-painel]").forEach((p) => { p.hidden = p.dataset.painel !== r.value; });
    gsap.from(`[data-painel="${r.value}"]`, { autoAlpha: 0, y: 8, duration: d(0.3) });
  }));

  // Copiar código Pix (mock)
  document.querySelector("[data-copiar]").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    btn.textContent = "Código copiado ✓";
    gsap.fromTo(btn, { scale: 0.94 }, { scale: 1, duration: d(0.4), ease: "back.out(3)" });
    setTimeout(() => { btn.textContent = "Copiar código Pix"; }, 2000);
  });

  // Pagar → confirmado
  document.querySelector("[data-pagar]").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    btn.classList.add("is-loading");
    btn.disabled = true;
    preencher("metodo", NOMES_METODO[document.querySelector('input[name="metodo"]:checked').value]);
    setTimeout(() => {
      gsap.to("#etapa-pagar", {
        autoAlpha: 0, y: -16, duration: d(0.3),
        onComplete: () => {
          document.getElementById("etapa-pagar").hidden = true;
          document.getElementById("etapa-ok").hidden = false;
          window.scrollTo(0, 0);
          gsap.timeline()
            .from(".check-icon", { scale: 0, rotation: -45, duration: d(0.5), ease: "back.out(2)" })
            .fromTo(".check-icon path", { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: d(0.4) }, "-=0.2")
            .from(".confirmado > :not(svg)", { autoAlpha: 0, y: 12, stagger: 0.08, duration: d(0.35) }, "-=0.2");
        },
      });
    }, reduz ? 0 : 1000);
  });
})();
