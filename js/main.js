/* =========================================================
   Ana Clara Limirio — site pessoal
   Sem dependências, sem backend.
   ========================================================= */
(function () {
  "use strict";

  /* =======================================================
     CONFIGURAÇÃO DO FORMULÁRIO
     -------------------------------------------------------
     O envio usa o FormSubmit (formsubmit.co) — serviço
     gratuito que recebe o POST e repassa por e-mail. Não
     precisa de conta nem de servidor.

     >>> IMPORTANTE, NA PRIMEIRA VEZ:
     Ao enviar a primeira mensagem, o FormSubmit manda um
     e-mail de confirmação para claralimirio@gmail.com.
     Enquanto ela não clicar no link daquele e-mail, as
     mensagens NÃO chegam. É só uma vez.

     >>> DEPOIS DE CONFIRMAR (recomendado):
     O FormSubmit fornece um endereço "mascarado", tipo
     https://formsubmit.co/ajax/a1b2c3d4e5f6...
     Troque o valor de DESTINO por esse código para o
     e-mail dela deixar de ficar exposto no código-fonte.
     ======================================================= */
  var DESTINO = "claralimirio@gmail.com";
  var ENDPOINT = "https://formsubmit.co/ajax/" + DESTINO;

  var $  = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ============ ano no rodapé ============ */
  var ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* ============ nav: fundo ao rolar ============ */
  var nav = $("#nav");
  function aoRolar() {
    if (!nav) return;
    nav.classList.toggle("solida", window.scrollY > 40);
  }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  /* ============ nav: menu mobile ============ */
  var toggle = $("#navToggle");
  var menu = $("#navMenu");

  function fecharMenu() {
    if (!menu) return;
    menu.classList.remove("aberto");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("travado");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var aberto = menu.classList.toggle("aberto");
      toggle.setAttribute("aria-expanded", String(aberto));
      toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("travado", aberto);
    });

    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", fecharMenu);
    });

    document.addEventListener("click", function (e) {
      if (!menu.classList.contains("aberto")) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      fecharMenu();
    });
  }

  /* ============ reveal ao entrar na tela ============ */
  var alvos = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("visivel");
        obs.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    alvos.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 6, 5) * 0.07) + "s";
      obs.observe(el);
    });
  } else {
    alvos.forEach(function (el) { el.classList.add("visivel"); });
  }

  /* =======================================================
     LIGHTBOX / GALERIAS
     ======================================================= */
  var GALERIAS = {
    nihon: {
      titulo: "Nihon Hostel Cápsula",
      itens: [
        { src: "img/nihon-1.jpg", cap: "Nihon Hostel Cápsula — logotipo, paleta de cores e tipografia da marca." },
        { src: "img/nihon-2.jpg", cap: "Variações do logotipo, sinalização, cartões de visita e telas do aplicativo." },
        { src: "img/nihon-3.jpg", cap: "Aplicação em uniforme. Redesign inspirado na estética e na cultura japonesa, feito em Illustrator e Photoshop." }
      ]
    },
    tattoo: {
      titulo: "Ana Tattoo",
      itens: [
        { src: "img/tattoo-1.jpg", cap: "Ana Tattoo — logotipo, paleta e tipografia. O conceito parte da vespa: o ferrão como analogia da agulha." },
        { src: "img/tattoo-2.jpg", cap: "Variações da marca, adesivos, padronagem, cartões e presença em redes sociais." },
        { src: "img/tattoo-3.jpg", cap: "Aplicação em vestuário. Identidade criada para transmitir precisão, elegância e força no traço." }
      ]
    },
    ilustra: {
      titulo: "Ilustrações",
      itens: [
        { src: "img/ilustra-1.jpg",        cap: "Seleção de ilustrações autorais — criação de personagens e composição gráfica, em Photoshop e Sketchbook." },
        { src: "img/ilustra-quadro.jpg",   cap: "Pôster ilustrado com aplicação em moldura." },
        { src: "img/ilustra-camiseta.jpg", cap: "Ilustração aplicada em camiseta." },
        { src: "img/ilustra-gatinho.jpg",  cap: "Calendário ilustrado — criação de personagem e composição gráfica." },
        { src: "img/ilustra-pokemon.jpg",  cap: "Calendário temático — ilustração de personagens e composição gráfica." }
      ]
    }
  };

  var lb      = $("#lb");
  var lbImg   = $("#lbImg");
  var lbCap   = $("#lbCap");
  var lbCont  = $("#lbCont");
  var lbAnt   = $("#lbAnt");
  var lbProx  = $("#lbProx");
  var lbFecha = $("#lbFechar");

  var atual = { itens: [], i: 0, titulo: "" };
  var ultimoFoco = null;

  function pintar() {
    var it = atual.itens[atual.i];
    if (!it) return;
    lbImg.src = it.src;
    lbImg.alt = atual.titulo + " — imagem " + (atual.i + 1);
    lbCap.textContent = it.cap;
    lbCont.textContent = (atual.i + 1) + " / " + atual.itens.length;
    var varios = atual.itens.length > 1;
    lbAnt.style.display = varios ? "grid" : "none";
    lbProx.style.display = varios ? "grid" : "none";
  }

  function abrir(chave, origem) {
    var g = GALERIAS[chave];
    if (!g) return;
    ultimoFoco = origem || null;
    atual = { itens: g.itens, i: 0, titulo: g.titulo };
    pintar();
    lb.hidden = false;
    document.body.classList.add("travado");
    requestAnimationFrame(function () { lb.classList.add("aberto"); });
    lbFecha.focus();

    // pré-carrega as próximas
    g.itens.forEach(function (it) { var im = new Image(); im.src = it.src; });
  }

  function fechar() {
    lb.classList.remove("aberto");
    document.body.classList.remove("travado");
    setTimeout(function () {
      lb.hidden = true;
      lbImg.src = "";
      if (ultimoFoco) ultimoFoco.focus();
    }, 300);
  }

  function mover(passo) {
    if (!atual.itens.length) return;
    atual.i = (atual.i + passo + atual.itens.length) % atual.itens.length;
    pintar();
  }

  $$(".card").forEach(function (card) {
    var chave = card.getAttribute("data-galeria");
    card.addEventListener("click", function () { abrir(chave, card); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrir(chave, card);
      }
    });
  });

  if (lb) {
    lbFecha.addEventListener("click", fechar);
    lbAnt.addEventListener("click", function () { mover(-1); });
    lbProx.addEventListener("click", function () { mover(1); });

    lb.addEventListener("click", function (e) {
      if (e.target === lb) fechar();
    });

    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") fechar();
      else if (e.key === "ArrowLeft") mover(-1);
      else if (e.key === "ArrowRight") mover(1);
      else if (e.key === "Tab") {
        // mantém o foco dentro do modal
        var foco = [lbFecha, lbAnt, lbProx].filter(function (b) {
          return b.style.display !== "none";
        });
        var idx = foco.indexOf(document.activeElement);
        e.preventDefault();
        var prox = e.shiftKey ? idx - 1 : idx + 1;
        if (prox < 0) prox = foco.length - 1;
        if (prox >= foco.length) prox = 0;
        foco[prox].focus();
      }
    });

    // arrastar no celular
    var x0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var d = e.changedTouches[0].clientX - x0;
      if (Math.abs(d) > 55) mover(d < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  /* =======================================================
     FORMULÁRIO
     ======================================================= */
  var form   = $("#form");
  var aviso  = $("#aviso");
  var enviar = $("#enviar");

  var REGRAS = {
    nome: function (v) {
      if (!v.trim()) return "Escreva o seu nome.";
      if (v.trim().length < 2) return "Nome muito curto.";
      return "";
    },
    email: function (v) {
      if (!v.trim()) return "Escreva o seu e-mail.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "Esse e-mail não parece válido.";
      return "";
    },
    mensagem: function (v) {
      if (!v.trim()) return "Escreva a sua mensagem.";
      if (v.trim().length < 10) return "Conte um pouco mais (mínimo 10 caracteres).";
      return "";
    }
  };

  function validarCampo(nome) {
    var input = $("#" + nome);
    var saida = $('[data-erro="' + nome + '"]');
    if (!input || !REGRAS[nome]) return true;
    var msg = REGRAS[nome](input.value);
    saida.textContent = msg;
    input.closest(".campo").classList.toggle("invalido", !!msg);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  function mostrarAviso(texto, tipo) {
    aviso.textContent = texto;
    aviso.className = "form__aviso" + (tipo ? " " + tipo : "");
  }

  if (form) {
    Object.keys(REGRAS).forEach(function (nome) {
      var input = $("#" + nome);
      if (!input) return;
      input.addEventListener("blur", function () { validarCampo(nome); });
      input.addEventListener("input", function () {
        if (input.closest(".campo").classList.contains("invalido")) validarCampo(nome);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var ok = Object.keys(REGRAS).map(validarCampo).every(Boolean);
      if (!ok) {
        mostrarAviso("Confira os campos destacados antes de enviar.", "ruim");
        var primeiro = $(".campo.invalido input, .campo.invalido textarea");
        if (primeiro) primeiro.focus();
        return;
      }

      // se a armadilha foi preenchida, é robô — finge que deu certo
      if ($("#site") && $("#site").value) {
        mostrarAviso("Mensagem enviada. Obrigada pelo contato!", "ok");
        form.reset();
        return;
      }

      enviar.disabled = true;
      enviar.classList.add("carregando");
      $(".btn__txt", enviar).textContent = "Enviando...";
      mostrarAviso("", "");

      var dados = {
        nome:     $("#nome").value.trim(),
        email:    $("#email").value.trim(),
        assunto:  $("#assunto").value,
        mensagem: $("#mensagem").value.trim(),
        _subject: "Site — nova mensagem de " + $("#nome").value.trim(),
        _template: "table",
        _captcha: "false"
      };

      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(dados)
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (resp) {
          var sucesso = resp && (resp.success === "true" || resp.success === true);
          if (!sucesso) throw new Error(resp && resp.message ? resp.message : "falhou");
          mostrarAviso("Mensagem enviada! Obrigada pelo contato — respondo em breve.", "ok");
          form.reset();
          $$(".campo").forEach(function (c) { c.classList.remove("invalido"); });
          $$(".erro").forEach(function (c) { c.textContent = ""; });
        })
        .catch(function () {
          mostrarAviso(
            "Não consegui enviar agora. Escreva direto para claralimirio@gmail.com ou chame no WhatsApp (16) 99444-9762.",
            "ruim"
          );
        })
        .then(function () {
          enviar.disabled = false;
          enviar.classList.remove("carregando");
          $(".btn__txt", enviar).textContent = "Enviar mensagem";
        });
    });
  }
})();
