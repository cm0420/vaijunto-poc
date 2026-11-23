// VaiJunto — cola do fluxo entre as telas (Integração: Yago)
// Helpers comuns + barra de etapas + transição entre páginas + toast.
(function () {
  window.VJ = window.VJ || {};
  const params = new URLSearchParams(location.search);
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  VJ.reduz = reduz;
  VJ.d = (s) => (reduz ? 0 : s);
  VJ.param = (chave, padrao) => params.get(chave) || padrao;
  VJ.brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  VJ.iniciais = (nome) => nome.split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  VJ.qs = (extra) => {
    const p = new URLSearchParams(location.search);
    Object.entries(extra || {}).forEach(([k, v]) => p.set(k, v));
    return "?" + p.toString();
  };

  // Ícones de linha (stroke) usados nas telas: <svg class="ico"><use href="#i-carro"/></svg>
  const ICONES = {
    carro: '<path d="M5 17h14M6 17v2M18 17v2M4 13l2-5a2 2 0 0 1 2-1h8a2 2 0 0 1 2 1l2 5v4H4z"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    fone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    cadeado: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    olho: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    check: '<path d="m5 12 5 5L20 7"/>',
    checkCirc: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    voltar: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    trocar: '<path d="M7 4v14m0 0-3-3m3 3 3-3M17 20V6m0 0-3 3m3-3 3 3"/>',
    estrela: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    escudo: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    livro: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    pessoas: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    filtro: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chat: '<path d="M4 5h16v11H8l-4 4z"/>',
    ligar: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    cartao: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    pix: '<path d="m12 3 4 4-4 4-4-4zM12 13l4 4-4 4-4-4zM3 12l4-4 4 4-4 4zM13 12l4-4 4 4-4 4z"/>',
    dinheiro: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9v6M18 9v6"/>',
    copiar: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    cupom: '<path d="M3 9a3 3 0 0 0 0 6v3h18v-3a3 3 0 0 1 0-6V6H3z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
    mochila: '<path d="M6 8a6 6 0 0 1 12 0v12H6z"/><path d="M9 4V3h6v1M9 14h6"/>',
    neve: '<path d="M12 2v20M4 7l16 10M20 7 4 17"/>',
  };
  const sprite = document.createElement("div");
  sprite.hidden = true;
  sprite.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${Object.entries(ICONES)
    .map(([n, p]) => `<symbol id="i-${n}" viewBox="0 0 24 24">${p}</symbol>`).join("")}</svg>`;
  document.body.prepend(sprite);
  VJ.ico = (nome, cls = "ico") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${nome}"/></svg>`;

  // Barra de etapas: <nav class="passos" data-passo="2"></nav>
  const nav = document.querySelector(".passos[data-passo]");
  if (nav) {
    const atual = Number(nav.dataset.passo);
    const nomes = ["Cadastro", "Carona", "Pagamento"];
    nav.setAttribute("aria-label", `Etapa ${atual} de 3`);
    nav.innerHTML = nomes.map((n, i) => {
      const k = i + 1;
      const estado = k < atual ? "feito" : k === atual ? "atual" : "";
      const linha = k < 3 ? `<span class="passo-linha"><i${k < atual ? ' data-encher' : ""}></i></span>` : "";
      return `<span class="passo ${estado}"${k === atual ? ' aria-current="step"' : ""}><span class="passo-num">${k < atual ? "✓" : k}</span><span class="passo-nome">${n}</span></span>${linha}`;
    }).join("");
    const encher = nav.querySelectorAll("[data-encher]");
    if (encher.length) {
      gsap.set([...encher].slice(0, -1), { scaleX: 1 });
      gsap.to(encher[encher.length - 1], { scaleX: 1, duration: VJ.d(0.7), delay: VJ.d(0.3), ease: "power3.inOut" });
    }
  }

  // Toast
  let toastEl = null;
  VJ.toast = (msg, icone = "checkCirc") => {
    if (toastEl) toastEl.remove();
    toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.setAttribute("role", "status");
    toastEl.innerHTML = VJ.ico(icone) + `<span>${msg}</span>`;
    document.body.append(toastEl);
    const el = toastEl;
    gsap.timeline()
      .fromTo(el, { autoAlpha: 0, y: 16, xPercent: -50 }, { autoAlpha: 1, y: 0, xPercent: -50, duration: VJ.d(0.35), ease: "back.out(2)" })
      .to(el, { autoAlpha: 0, y: 8, duration: VJ.d(0.25), delay: 2.2, onComplete: () => el.remove() });
  };

  // Saída animada ao navegar entre telas
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-next], a[data-back], a[data-restart]");
    if (!link || reduz || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const voltando = link.matches("[data-back], [data-restart]");
    gsap.to(".painel", { autoAlpha: 0, x: voltando ? 24 : -24, duration: 0.28, ease: "power2.in" });
    gsap.to(".palco", { autoAlpha: 0.4, duration: 0.28, onComplete: () => { location.href = link.href; } });
  });
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) gsap.set(".painel, .palco", { clearProps: "opacity,visibility,transform" });
  });
})();
