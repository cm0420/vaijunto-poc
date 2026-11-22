// VaiJunto — cola do fluxo entre as 3 telas (Integração: Yago)
// - parâmetros da URL passam nome do usuário e carona escolhida de uma tela pra outra
// - barra de etapas anima do passo anterior pro atual
// - transição de saída ao navegar entre telas
(function () {
  window.VJ = window.VJ || {};
  const params = new URLSearchParams(location.search);
  VJ.param = (chave, padrao) => params.get(chave) || padrao;

  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const alvos = () => document.querySelectorAll(".screen, .sheet:not([hidden]), .sheet-fundo:not([hidden])");

  const barra = document.querySelector(".passos-barra i");
  if (barra) {
    gsap.fromTo(barra, { scaleX: Number(barra.dataset.de) },
      { scaleX: Number(barra.dataset.ate), duration: reduz ? 0 : 0.8, delay: reduz ? 0 : 0.2, ease: "power3.inOut" });
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-next], a[data-back], a[data-restart]");
    if (!link || reduz || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const voltando = link.matches("[data-back], [data-restart]");
    gsap.to(alvos(), {
      autoAlpha: 0, x: voltando ? 24 : -24, duration: 0.3, ease: "power2.in",
      onComplete: () => { location.href = link.href; },
    });
  });

  // Voltar pelo navegador (bfcache) restaura a tela que saiu animada
  window.addEventListener("pageshow", (e) => { if (e.persisted) gsap.set(alvos(), { clearProps: "opacity,visibility,transform" }); });
})();
