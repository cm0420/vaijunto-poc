// Tela Cadastro / Autenticação — Dev 1 (Miguel)
// Caminho feliz mockado: qualquer envio do formulário dá certo.
(function () {
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const d = (s) => (reduz ? 0 : s);

  // Entrada da tela
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".passos", { autoAlpha: 0, duration: d(0.3) })
    .from(".brand", { autoAlpha: 0, y: -8, duration: d(0.4) })
    .from(".hero > *", { autoAlpha: 0, y: 16, stagger: 0.08, duration: d(0.5) }, "-=0.2")
    .from(".tabs", { autoAlpha: 0, y: 12, duration: d(0.4) }, "-=0.3")
    .from("#form-cadastro > *", { autoAlpha: 0, y: 12, stagger: 0.05, duration: d(0.4) }, "-=0.25");

  // Abas Criar conta / Entrar
  const pill = document.querySelector(".tabs-pill");
  const tabs = document.querySelectorAll(".tab");
  const paineis = { cadastro: document.getElementById("form-cadastro"), login: document.getElementById("form-login") };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => { t.classList.toggle("is-active", t === tab); t.setAttribute("aria-selected", t === tab); });
      gsap.to(pill, { xPercent: i * 100, duration: d(0.35), ease: "power3.inOut" });
      Object.entries(paineis).forEach(([nome, el]) => { el.hidden = nome !== tab.dataset.tab; });
      gsap.from(paineis[tab.dataset.tab].children, { autoAlpha: 0, y: 8, stagger: 0.04, duration: d(0.3) });
    });
  });

  // Mostrar / esconder senha
  document.querySelector("[data-toggle-senha]").addEventListener("click", (e) => {
    const input = document.getElementById("senha");
    const mostrar = input.type === "password";
    input.type = mostrar ? "text" : "password";
    e.currentTarget.textContent = mostrar ? "Esconder" : "Mostrar";
  });

  // Envio mockado → loading → sucesso
  Object.values(paineis).forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("[data-submit]");
      btn.classList.add("is-loading");
      btn.disabled = true;
      setTimeout(() => mostrarSucesso(form), reduz ? 0 : 900);
    });
  });

  function mostrarSucesso(form) {
    const sucesso = document.getElementById("sucesso");
    // Integração: nome digitado segue pra tela de Busca via URL
    const nome = (form.elements.nome ? form.elements.nome.value : "Ana Souza").trim().split(" ")[0] || "Ana";
    const email = form.querySelector('input[type="email"]').value;
    sucesso.querySelector("[data-nome-ok]").textContent = nome;
    sucesso.querySelector("[data-email-ok]").textContent = email;
    sucesso.querySelector("[data-next]").href = "../busca/index.html?nome=" + encodeURIComponent(nome);
    gsap.to([form, ".tabs", ".hero"], {
      autoAlpha: 0, y: -12, duration: d(0.3), stagger: 0.04,
      onComplete: () => {
        form.hidden = true;
        document.querySelector(".tabs").hidden = true;
        document.querySelector(".hero").hidden = true;
        sucesso.hidden = false;
        gsap.timeline()
          .from(sucesso, { autoAlpha: 0, scale: 0.96, duration: d(0.35), ease: "power2.out" })
          .from(".check-icon", { scale: 0, rotation: -45, duration: d(0.5), ease: "back.out(2)" }, "-=0.1")
          .fromTo(".check-icon path", { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: d(0.4), ease: "power2.out" }, "-=0.2")
          .from(".sucesso > :not(svg)", { autoAlpha: 0, y: 8, stagger: 0.06, duration: d(0.3) }, "-=0.2");
      },
    });
  }
})();
