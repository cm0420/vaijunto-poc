// Tela Cadastro / Autenticação — Dev 1 (Miguel)
// Mock de caminho feliz: validação só no navegador, código de verificação aceita quaisquer 4 dígitos.
(function () {
  const d = VJ.d;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- Entrada ----------
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".topbar", { autoAlpha: 0, y: -10, duration: d(0.4) })
    .from("#etapa-form > :not(form)", { autoAlpha: 0, y: 18, stagger: 0.06, duration: d(0.5) }, "-=0.2")
    .from("#form-cadastro > *", { autoAlpha: 0, y: 12, stagger: 0.04, duration: d(0.35) }, "-=0.3")
    .from(".ao-vivo, .numero", { autoAlpha: 0, y: 16, stagger: 0.08, duration: d(0.5) }, 0.4);

  // ---------- Abas ----------
  const pill = $(".abas-pill");
  const forms = { cadastro: $("#form-cadastro"), login: $("#form-login") };
  $$(".aba").forEach((aba, i) => aba.addEventListener("click", () => {
    $$(".aba").forEach((a) => { a.classList.toggle("is-ativa", a === aba); a.setAttribute("aria-selected", a === aba); });
    gsap.to(pill, { xPercent: i * 100, duration: d(0.35), ease: "power3.inOut" });
    Object.entries(forms).forEach(([k, f]) => { f.hidden = k !== aba.dataset.aba; });
    gsap.from(forms[aba.dataset.aba].children, { autoAlpha: 0, y: 8, stagger: 0.04, duration: d(0.3) });
  }));
  $("[data-esqueci]").addEventListener("click", () => VJ.toast("Link de nova senha enviado pro seu e-mail", "mail"));
  $$("[data-sem-link]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); VJ.toast("Termos de uso: fora do escopo do protótipo", "livro"); }));

  // ---------- Máscara de celular ----------
  const cel = $("#celular");
  cel.addEventListener("input", () => {
    const n = cel.value.replace(/\D/g, "").slice(0, 11);
    let v = n;
    if (n.length > 2) v = `(${n.slice(0, 2)}) ${n.slice(2)}`;
    if (n.length > 7) v = `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
    cel.value = v;
  });

  // ---------- Mostrar senha + força ----------
  const senha = $("#senha");
  $("[data-ver-senha]").addEventListener("click", (e) => {
    const mostrar = senha.type === "password";
    senha.type = mostrar ? "text" : "password";
    e.currentTarget.textContent = mostrar ? "Esconder" : "Mostrar";
    e.currentTarget.setAttribute("aria-pressed", mostrar);
  });
  const forca = $(".forca");
  const NIVEIS = ["Use letras e números.", "Fraca: aumente pra 8+ caracteres.", "Razoável. Um número ou símbolo ajuda.", "Boa senha.", "Senha forte."];
  senha.addEventListener("input", () => {
    const s = senha.value;
    let n = 0;
    if (s.length >= 1) n = 1;
    if (s.length >= 8) n = 2;
    if (s.length >= 8 && /\d/.test(s) && /[a-z]/i.test(s)) n = 3;
    if (s.length >= 10 && /\d/.test(s) && /[^a-z0-9]/i.test(s)) n = 4;
    if (forca.dataset.nivel !== String(n)) {
      forca.dataset.nivel = n;
      gsap.fromTo(forca.querySelectorAll("i"), { scaleX: 0.6 }, { scaleX: 1, duration: d(0.3), stagger: 0.03, ease: "power2.out" });
    }
    if (!senha.closest(".field").classList.contains("is-erro")) $("#senha-msg").textContent = NIVEIS[n];
  });

  // ---------- Validação ----------
  const REGRAS = {
    nome: [() => $("#nome").value.trim().split(/\s+/).length >= 2, "Digite nome e sobrenome."],
    email: [() => /^[^\s@]+@ufvjm\.edu\.br$/i.test($("#email").value.trim()), "Use seu e-mail que termina em @ufvjm.edu.br."],
    celular: [() => cel.value.replace(/\D/g, "").length === 11, "Celular com DDD: 11 números."],
    senha: [() => senha.value.length >= 8, "A senha precisa de pelo menos 8 caracteres."],
    termos: [() => $("#termos").checked, "Pra continuar, aceite os termos."],
  };

  function validar(nome, mostrarErro) {
    const field = $(`[data-validar="${nome}"]`);
    const [ok, erro] = REGRAS[nome];
    const valido = ok();
    const msg = $(`#${nome}-msg`);
    field.classList.toggle("is-ok", valido && nome !== "termos");
    if (valido) {
      field.classList.remove("is-erro");
      msg.textContent = { senha: NIVEIS[forca.dataset.nivel || 0], email: "E-mail da UFVJM confirmado." }[nome] || "";
    } else if (mostrarErro) {
      field.classList.add("is-erro");
      msg.textContent = erro;
    }
    const input = field.querySelector("input");
    input.setAttribute("aria-invalid", !valido && mostrarErro ? "true" : "false");
    return valido;
  }
  Object.keys(REGRAS).forEach((nome) => {
    const input = $(`[data-validar="${nome}"] input`);
    input.addEventListener("blur", () => { if (input.value || nome === "termos") validar(nome, nome !== "termos"); });
    input.addEventListener(nome === "termos" ? "change" : "input", () => {
      const field = input.closest(".field");
      if (field.classList.contains("is-erro") || field.classList.contains("is-ok") || nome === "termos") validar(nome, field.classList.contains("is-erro"));
    });
  });

  function carregar(btn, ms, depois) {
    btn.classList.add("is-loading");
    setTimeout(() => { btn.classList.remove("is-loading"); depois(); }, VJ.reduz ? 0 : ms);
  }

  // ---------- Envio do cadastro ----------
  let usuario = { nome: "Ana Souza", email: "ana.souza@ufvjm.edu.br", perfil: "Passageiro" };
  forms.cadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    const invalidos = Object.keys(REGRAS).filter((n) => !validar(n, true));
    if (invalidos.length) {
      const primeiro = $(`[data-validar="${invalidos[0]}"]`);
      primeiro.querySelector("input").focus();
      gsap.fromTo(primeiro, { x: -6 }, { x: 0, duration: d(0.4), ease: "elastic.out(1, 0.3)" });
      return;
    }
    usuario = {
      nome: $("#nome").value.trim().replace(/\s+/g, " "),
      email: $("#email").value.trim().toLowerCase(),
      perfil: { passageiro: "Passageiro", motorista: "Motorista", ambos: "Passageiro e motorista" }[$('input[name="perfil"]:checked').value],
    };
    carregar(e.submitter || forms.cadastro.querySelector("[type=submit]"), 800, () => irPara("#etapa-codigo"));
  });

  forms.login.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#login-email").value.trim();
    if (email) usuario.email = email.toLowerCase();
    if (/^[^.@]+\.[^@]+@/.test(usuario.email)) {
      usuario.nome = usuario.email.split("@")[0].split(".").map((p) => p[0].toUpperCase() + p.slice(1)).join(" ");
    }
    carregar(e.submitter || forms.login.querySelector("[type=submit]"), 700, () => irPara("#etapa-ok"));
  });

  // ---------- Troca de etapa ----------
  let atual = $("#etapa-form");
  function irPara(sel) {
    const prox = $(sel);
    gsap.to(atual, {
      autoAlpha: 0, x: -24, duration: d(0.25), ease: "power2.in",
      onComplete: () => {
        atual.hidden = true;
        gsap.set(atual, { clearProps: "all" });
        prox.hidden = false;
        atual = prox;
        $(".painel").scrollTo(0, 0);
        if (sel === "#etapa-codigo") entrarCodigo();
        else entrarPronto();
      },
    });
  }
  $("[data-voltar-form]").addEventListener("click", () => {
    const prox = $("#etapa-form");
    atual.hidden = true; prox.hidden = false; atual = prox;
    gsap.from(prox, { autoAlpha: 0, x: 24, duration: d(0.3) });
  });

  // ---------- Código ----------
  const digitos = $$(".codigo input");
  const btnConfirmar = $("[data-confirmar]");
  let timer = null;
  function entrarCodigo() {
    $("[data-email-enviado]").textContent = usuario.email;
    // opacity (não autoAlpha): visibility:hidden impediria o foco no 1º dígito
    gsap.from("#etapa-codigo > *", { opacity: 0, x: 24, stagger: 0.05, duration: d(0.4), ease: "power3.out" });
    gsap.from(digitos, { y: 12, opacity: 0, stagger: 0.06, duration: d(0.4), ease: "back.out(2)", delay: d(0.15) });
    digitos[0].focus();
    let s = 30;
    const btn = $("[data-reenviar]");
    btn.disabled = true;
    clearInterval(timer);
    timer = setInterval(() => {
      s -= 1;
      $("[data-contador]").textContent = `0:${String(s).padStart(2, "0")}`;
      if (s <= 0) { clearInterval(timer); btn.disabled = false; btn.textContent = "Reenviar código"; }
    }, 1000);
  }
  $("[data-reenviar]").addEventListener("click", () => VJ.toast("Código reenviado", "mail"));
  const atualizarCodigo = () => {
    digitos.forEach((i) => i.classList.toggle("cheio", i.value !== ""));
    btnConfirmar.disabled = !digitos.every((i) => /\d/.test(i.value));
  };
  digitos.forEach((input, i) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(-1);
      if (input.value) {
        gsap.fromTo(input, { scale: 0.88 }, { scale: 1, duration: d(0.3), ease: "back.out(3)" });
        if (digitos[i + 1]) digitos[i + 1].focus();
      }
      atualizarCodigo();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && digitos[i - 1]) digitos[i - 1].focus();
    });
    input.addEventListener("paste", (e) => {
      const txt = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 4);
      if (!txt) return;
      e.preventDefault();
      txt.split("").forEach((c, k) => { if (digitos[k]) digitos[k].value = c; });
      digitos[Math.min(txt.length, 3)].focus();
      atualizarCodigo();
    });
  });
  $("#form-codigo").addEventListener("submit", (e) => {
    e.preventDefault();
    if (btnConfirmar.disabled) return;
    clearInterval(timer);
    carregar(btnConfirmar, 700, () => irPara("#etapa-ok"));
  });

  // ---------- Pronto ----------
  function entrarPronto() {
    const primeiro = usuario.nome.split(" ")[0];
    $("[data-nome-ok]").textContent = primeiro;
    $("[data-nome-completo-ok]").textContent = usuario.nome;
    $("[data-email-ok]").textContent = usuario.email;
    $("[data-perfil-ok]").textContent = usuario.perfil;
    $("[data-avatar-ok]").textContent = VJ.iniciais(usuario.nome);
    $("[data-next]").href = "../busca/index.html" + VJ.qs({ nome: primeiro });
    const nav = $(".passos .passo-linha i");
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".selo", { scale: 0, rotation: -60, duration: d(0.6), ease: "back.out(1.8)" })
      .fromTo(".selo-check", { strokeDashoffset: 50 }, { strokeDashoffset: 0, duration: d(0.45), ease: "power2.out" }, "-=0.25")
      .from("#etapa-ok > :not(.selo)", { autoAlpha: 0, y: 14, stagger: 0.08, duration: d(0.4) }, "-=0.2")
      .to(nav, { scaleX: 1, duration: d(0.6), ease: "power3.inOut" }, "-=0.4");
  }

  // ---------- Palco: mapa vivo ----------
  const m = VJ.mapa("mapa", { interativo: false, zoom: false, padding: [80, 80] });
  m.rota();
  m.inicioFim();
  VJ.CARONAS.forEach((c, k) => {
    const carro = m.carro(c.iCarro, c.hue);
    m.andar(carro, k * 30, VJ.ROTA.length - 1, 38, { repeat: -1, delay: d(0.6 + k * 0.4) });
  });
  const media = VJ.CARONAS.reduce((s, c) => s + VJ.parte(c), 0) / VJ.CARONAS.length;
  $("[data-media]").textContent = VJ.brl(media);

  const vivo = VJ.CARONAS.map((c) => ({
    t: `${c.motorista.split(" ")[0]} sai às ${c.saida} do Campus JK`,
    s: `${c.vagas} ${c.vagas > 1 ? "vagas" : "vaga"} · ${VJ.brl(VJ.parte(c))} por pessoa`,
  }));
  let iv = 0;
  if (!VJ.reduz) {
    setInterval(() => {
      iv = (iv + 1) % vivo.length;
      gsap.timeline()
        .to(".ao-vivo-txt", { autoAlpha: 0, y: -6, duration: 0.2 })
        .add(() => { $("[data-vivo-titulo]").textContent = vivo[iv].t; $("[data-vivo-sub]").textContent = vivo[iv].s; })
        .fromTo(".ao-vivo-txt", { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3 });
    }, 3500);
  }
  $("[data-vivo-titulo]").textContent = vivo[0].t;
  $("[data-vivo-sub]").textContent = vivo[0].s;
})();
