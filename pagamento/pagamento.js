// Tela Pagamento e Divisão de Custos — Dev 3 (Humberto)
// Mock: pagamento sempre aprovado; cupom CALOURO dá 10%; acompanhamento simula a viagem no mapa.
(function () {
  const d = VJ.d;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const c = VJ.carona(VJ.param("carona", 1));
  const nome = VJ.param("nome", "Ana");
  const parte = VJ.parte(c);
  const custo = c.combustivel + c.desgaste;
  let gorjeta = 0, desconto = 0;
  const total = () => Math.max(0, parte + gorjeta - desconto);

  const preencher = (campo, valor) => $$(`[data-f="${campo}"]`).forEach((el) => { el.textContent = valor; });
  // Voltar refaz a mesma busca (passageiros, horário e dia vêm na URL); "início" é a Busca, sem sair da conta
  $("[data-back]").href = "../busca/index.html" + VJ.qs({ voltar: 1 });
  $$("[data-restart], .logo").forEach((a) => { a.href = VJ.inicio(nome); });
  $$("[data-avatar]").forEach((a) => { a.textContent = VJ.iniciais(c.motorista); a.style.setProperty("--hue", c.hue); });
  preencher("motorista", c.motorista);
  preencher("primeiro", c.motorista.split(" ")[0]);
  preencher("carro", c.carro);
  preencher("placa", c.placa);
  preencher("saida", c.saida);
  preencher("chegada", c.chegada);
  preencher("ponto", c.ponto);
  preencher("km", `${VJ.ROTA_INFO.km.toLocaleString("pt-BR")} km`);
  preencher("combustivel", VJ.brl(c.combustivel));
  preencher("desgaste", VJ.brl(c.desgaste));
  preencher("custo", VJ.brl(custo));
  preencher("ocupantes", c.ocupantes);
  preencher("parte", VJ.brl(parte));

  // ---------- Barra de cotas ----------
  // O custo é dividido pelos lugares do carro (c.ocupantes = lugares, contando o motorista).
  // Quem já reservou + você ocupam lugares; o que sobra fica livre e não muda a sua parte.
  const jaReservados = Math.max(0, c.ocupantes - c.vagas - 1);
  const livres = Math.max(0, c.vagas - 1);
  const cotas = [["motor", "Motorista"], ...Array(jaReservados).fill(["outro", "Outro passageiro"]), ["voce", "Você"], ...Array(livres).fill(["livre", "Lugar livre"])];
  $(".barra-cotas").innerHTML = cotas.map(([k, t]) => `<span class="cota ${k}" title="${t}">${VJ.brl(parte)}</span>`).join("");
  $(".legenda").innerHTML = [
    ["motor", c.motorista.split(" ")[0] + " (motorista)", true], ["voce", "Você", true],
    ["outro", jaReservados > 1 ? "Outros passageiros" : "Outro passageiro", jaReservados > 0],
    ["livre", livres > 1 ? "Lugares livres" : "Lugar livre", livres > 0],
  ].filter((l) => l[2]).map(([k, t]) => `<li class="${k}"><i></i>${t}</li>`).join("");
  const dica = $("[data-dica]");
  dica.querySelector("span").textContent = livres > 0
    ? `Sua parte é fixa: o custo é dividido pelos ${c.ocupantes} lugares do carro. ${livres > 1 ? `Ainda há ${livres} lugares livres` : "Ainda há 1 lugar livre"}, e se ninguém mais entrar o motorista cobre essa parte.`
    : `Com você o carro lota: o custo fica dividido entre as ${c.ocupantes} pessoas.`;

  // ---------- QR ilustrativo ----------
  (function desenharQR() {
    const N = 29;
    let r = "";
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect class="qr-branco" x="${x + 1}" y="${y + 1}" width="5" height="5"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const finderArea = (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
      if (!finderArea && ((x * 31 + y * 17 + x * y * 7) % 7 < 3)) r += `<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`;
    }
    $("#qr").innerHTML = r + finder(0, 0) + finder(N - 7, 0) + finder(0, N - 7);
  })();

  // ---------- Totais ----------
  function atualizarTotais() {
    preencher("gorjeta", "+ " + VJ.brl(gorjeta));
    preencher("desconto", "− " + VJ.brl(desconto));
    $("[data-linha-gorjeta]").hidden = !gorjeta;
    $("[data-linha-desconto]").hidden = !desconto;
    const alvo = { v: parseFloat(($("[data-pagar] [data-f=total]").dataset.v || total())) };
    gsap.to(alvo, {
      v: total(), duration: d(0.4), ease: "power2.out",
      onUpdate: () => { $$("[data-f=total]").forEach((el) => { el.textContent = VJ.brl(Math.round(alvo.v * 100) / 100); el.dataset.v = alvo.v; }); },
    });
  }
  atualizarTotais();
  $$('input[name="gorjeta"]').forEach((r) => r.addEventListener("change", () => { gorjeta = Number(r.value); atualizarTotais(); }));

  // ---------- Cupom ----------
  const campoCupom = $("#field-cupom");
  $("[data-aplicar]").addEventListener("click", () => {
    const cod = $("#cupom").value.trim().toUpperCase();
    const msg = $("#cupom-msg");
    if (cod === "CALOURO") {
      desconto = Math.round(parte * 0.1 * 100) / 100;
      campoCupom.classList.remove("is-erro"); campoCupom.classList.add("is-ok");
      msg.textContent = `Cupom aplicado: ${VJ.brl(desconto)} de desconto.`;
      VJ.toast("Cupom CALOURO aplicado", "cupom");
    } else {
      desconto = 0;
      campoCupom.classList.remove("is-ok"); campoCupom.classList.add("is-erro");
      msg.textContent = cod ? "Esse cupom não existe. No protótipo, use CALOURO." : "Digite um cupom.";
      gsap.fromTo(campoCupom, { x: -6 }, { x: 0, duration: d(0.4), ease: "elastic.out(1, 0.3)" });
    }
    atualizarTotais();
  });
  $("#cupom").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $("[data-aplicar]").click(); } });

  // ---------- Método ----------
  $$('input[name="metodo"]').forEach((r) => r.addEventListener("change", () => {
    $$("[data-painel]").forEach((p) => { p.hidden = p.dataset.painel !== r.value; });
    gsap.from(`[data-painel="${r.value}"]`, { opacity: 0, y: 10, duration: d(0.3) });
    if (r.value === "cartao") gsap.from(".cartao-face", { rotationY: -25, opacity: 0, duration: d(0.6), ease: "power3.out" });
  }));

  // Pix: contador e copiar
  let seg = 600;
  setInterval(() => { seg = Math.max(0, seg - 1); $("[data-expira]").textContent = `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, "0")}`; }, 1000);
  $("[data-copiar]").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    // writeText devolve uma Promise: sem o .catch, navegador sem permissão (ou arquivo aberto do disco) gera erro no console
    try { navigator.clipboard && navigator.clipboard.writeText($("[data-copia]").textContent).catch(() => {}); } catch (_) { /* mock */ }
    btn.querySelector("span").textContent = "Copiado!";
    gsap.fromTo(btn, { scale: 0.92 }, { scale: 1, duration: d(0.4), ease: "back.out(3)" });
    setTimeout(() => { btn.querySelector("span").textContent = "Copiar código"; }, 2000);
  });

  // Cartão: preview ao vivo
  const ccNum = $("#cc-num"), ccNome = $("#cc-nome"), ccVal = $("#cc-val"), ccCvv = $("#cc-cvv");
  ccNum.addEventListener("input", () => {
    const n = ccNum.value.replace(/\D/g, "").slice(0, 16);
    ccNum.value = n.replace(/(\d{4})(?=\d)/g, "$1 ");
    $("[data-prev-num]").textContent = (n + "•".repeat(16 - n.length)).replace(/(.{4})(?=.)/g, "$1 ");
    $("[data-bandeira]").textContent = /^5[1-5]/.test(n) ? "MASTERCARD" : /^3[47]/.test(n) ? "AMEX" : /^(636|504|4011)/.test(n) ? "ELO" : "VISA";
  });
  ccNome.addEventListener("input", () => { $("[data-prev-nome]").textContent = ccNome.value.toUpperCase() || "NOME NO CARTÃO"; });
  ccVal.addEventListener("input", () => {
    const n = ccVal.value.replace(/\D/g, "").slice(0, 4);
    ccVal.value = n.length > 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n;
    $("[data-prev-val]").textContent = ccVal.value || "MM/AA";
  });
  ccCvv.addEventListener("focus", () => gsap.to(".cartao-face", { rotationY: 180, duration: d(0.5), ease: "power2.inOut", onUpdate() { if (this.progress() > 0.5) $(".cartao-face").style.visibility = "hidden"; } }));
  ccCvv.addEventListener("blur", () => { $(".cartao-face").style.visibility = ""; gsap.to(".cartao-face", { rotationY: 0, duration: d(0.5), ease: "power2.inOut" }); });

  // ---------- Entrada ----------
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".topbar", { autoAlpha: 0, y: -10, duration: d(0.4) })
    .from("#etapa-pagar > :not(.rodape-pagar)", { opacity: 0, y: 18, stagger: 0.07, duration: d(0.5) }, "-=0.2")
    .from(".cota", { scaleX: 0, stagger: 0.08, duration: d(0.5), ease: "power2.out" }, "-=0.6")
    .from(".rodape-pagar", { yPercent: 100, duration: d(0.5) }, "-=0.5");

  // ---------- Mapa ----------
  const m = VJ.mapa("mapa", { padding: [70, 70] });
  m.rota();
  m.inicioFim({ rotuloInicio: false });
  m.pin(m.latlng(c.iRota), `<div class="pin-ponto"></div><span class="pin-label baixo">Embarque · ${c.saida}</span>`, [18, 18]);
  const carro = m.carro(c.iRota, c.hue);
  carro.el().classList.add("is-ativo");

  // ---------- Pagar ----------
  const NOMES = { pix: "Pix", cartao: "Cartão de crédito", dinheiro: "Dinheiro" };
  let atual = $("#etapa-pagar");
  function irPara(sel, depois) {
    const prox = $(sel);
    gsap.to(atual, {
      opacity: 0, x: -24, duration: d(0.25), ease: "power2.in",
      onComplete: () => {
        atual.hidden = true; gsap.set(atual, { clearProps: "all" });
        prox.hidden = false; atual = prox;
        $(".painel").scrollTo(0, 0);
        depois();
      },
    });
  }
  $("[data-pagar]").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    btn.classList.add("is-loading");
    preencher("metodo", NOMES[$('input[name="metodo"]:checked').value]);
    setTimeout(() => irPara("#etapa-ok", () => {
      gsap.to(".passos .passo-linha i", { scaleX: 1, duration: d(0.5) });
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".selo", { scale: 0, rotation: -60, duration: d(0.6), ease: "back.out(1.8)" })
        .fromTo(".selo path", { strokeDashoffset: 50 }, { strokeDashoffset: 0, duration: d(0.45) }, "-=0.25")
        .from("#etapa-ok > :not(.selo)", { opacity: 0, y: 14, stagger: 0.07, duration: d(0.4) }, "-=0.2");
      confete();
    }), VJ.reduz ? 0 : 1200);
  });

  function confete() {
    if (VJ.reduz) return;
    const cores = ["#0ba36b", "#c8f169", "#0e1a16", "#f5a524", "#7fd8b4"];
    const ox = $(".painel").getBoundingClientRect().left + $(".painel").clientWidth / 2;
    for (let i = 0; i < 70; i++) {
      const p = document.createElement("i");
      p.className = "confete";
      p.style.background = cores[i % cores.length];
      document.body.append(p);
      gsap.set(p, { x: ox, y: 200, rotation: gsap.utils.random(0, 360) });
      gsap.to(p, {
        x: ox + gsap.utils.random(-260, 260), y: gsap.utils.random(-40, 120), rotation: "+=" + gsap.utils.random(180, 720),
        duration: gsap.utils.random(0.5, 0.8), ease: "power3.out",
      });
      gsap.to(p, { y: window.innerHeight + 40, duration: gsap.utils.random(1.4, 2.2), delay: 0.6, ease: "power1.in", onComplete: () => p.remove() });
    }
  }

  // ---------- Acompanhar ----------
  $("[data-acompanhar]").addEventListener("click", () => irPara("#etapa-acompanhar", () => {
    gsap.from("#etapa-acompanhar > *", { opacity: 0, y: 14, stagger: 0.06, duration: d(0.4), ease: "power3.out" });
    m.map.flyTo(m.latlng(c.iRota), 15, { duration: VJ.reduz ? 0 : 1 });
    const fim = VJ.ROTA.length - 1;
    const DUR = 24;
    let quadros = 0;
    m.andar(carro, c.iRota, fim, DUR, {
      ease: "power1.inOut", delay: d(1),
      aoAndar: (i) => {
        const frac = (i - c.iRota) / (fim - c.iRota);
        $(".progresso i").style.transform = `scaleX(${frac})`;
        const min = Math.max(1, Math.round(VJ.ROTA_INFO.min * (1 - frac)));
        $("[data-eta]").textContent = frac >= 0.999 ? "instantes" : `${min} min`;
        $("[data-km-falta]").textContent = `faltam ${(VJ.ROTA_INFO.km * (1 - frac)).toFixed(1).replace(".", ",")} km`;
        if (++quadros % 30 === 0) m.map.panTo(carro.getLatLng(), { animate: !VJ.reduz, duration: 0.6 });
      },
      onComplete: () => VJ.toast("Você chegou ao Centro. Boa aula!", "checkCirc"),
    });
  }));

  $$("[data-mock]").forEach((b) => b.addEventListener("click", () => VJ.toast(b.dataset.mock, "chat")));
})();
