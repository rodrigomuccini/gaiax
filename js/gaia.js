/* GAIA v2 · comportamento da parede de vidro */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var WHATSAPP_DESTINO = '5511987511415';

  if (!reduce) root.classList.add('motion');

  /* ---------- dossiês dos agentes ---------- */
  var DATA = {
    gaia: {
      name: 'GAIA', role: 'Agente central · orquestradora', photo: 'img/gaia-full.webp',
      resumo: 'A gerente da sua operação de IA e o centro de comando do time. Recebe o pedido em português, planeja, delega ao especialista certo, valida e te entrega pronto.',
      does: ['Orquestra o time inteiro: copy, código, design, tráfego e vendas.', 'Conversa com você por texto ou áudio e devolve cada entrega revisada.', 'Cuida das campanhas, dos funis de venda e do atendimento.'],
      chips: ['Telegram', 'WhatsApp', 'Instagram', 'Meta Ads'],
      fluxo: 'Seu ponto único de contato: aciona os especialistas e garante que tudo volte revisado.'
    },
    juliana: {
      name: 'Juliana', role: 'Produção & design · braço direito da GAIA', photo: 'img/agent-1.webp',
      resumo: 'Braço direito da GAIA e segunda no comando. Quando a demanda é grande, assume a coordenação do time e garante o padrão visual.',
      does: ['Coordena a produção entre Jonathan e o Clone do Rodrigo nos trabalhos maiores.', 'Cria landing pages, criativos de anúncio e layouts de Instagram.', 'Define os padrões da marca e mantém a consistência visual.'],
      chips: ['Instagram', 'Vercel', 'OpenAI'],
      fluxo: 'A ponte entre a estratégia da GAIA e a execução: divide, padroniza e entrega fechado.'
    },
    rafael: {
      name: 'Rafael', role: 'Gestor de projetos', photo: 'img/agent-2.webp',
      resumo: 'O gestor de projetos do time. Transforma a estratégia da GAIA em cronograma, com prioridade e prazo.',
      does: ['Monta o plano de entregas e prioriza o que vem primeiro.', 'Divide a estratégia em etapas e distribui entre as áreas.', 'Acompanha cada frente e identifica gargalo antes do atraso.'],
      chips: ['Telegram'],
      fluxo: 'Pega a estratégia validada e garante que tudo chegue no tempo combinado.'
    },
    clone: {
      name: 'Clone do Rodrigo', role: 'Desenvolvedor full-stack', photo: 'img/agent-4.webp',
      resumo: 'O desenvolvedor do time. Quando precisa de código, é ele que constrói sites, sistemas e automações e coloca tudo no ar.',
      does: ['Constrói sites, sistemas e automações do zero.', 'Implementa funcionalidades novas e resolve o que quebrou.', 'Integra suas ferramentas e valida ponta a ponta antes de entregar.'],
      chips: ['GitHub', 'Vercel', 'Cloudflare', 'Hostinger'],
      fluxo: 'Acionado quando a entrega tem código: testa antes e devolve funcionando.'
    },
    jonathan: {
      name: 'Jonathan', role: 'Copywriter & pesquisa', photo: 'img/agent-5.webp',
      resumo: 'O redator e pesquisador do time. Escreve tudo com intenção de venda e pesquisa cada referência antes.',
      does: ['Escreve cartas e páginas de venda.', 'Cria roteiros de anúncio e de Reels.', 'Produz posts, carrossel e sequências de e-mail com base em pesquisa.'],
      chips: ['Instagram', 'E-mail'],
      fluxo: 'Recebe o briefing, pesquisa, escreve e abastece os anúncios com a copy certa.'
    },
    paulo: {
      name: 'Paulo', role: 'Gestor de tráfego', photo: 'img/agent-6.webp',
      resumo: 'O gestor de tráfego do time. Cuida dos anúncios pagos, do plano até a otimização.',
      does: ['Estrutura campanhas no Facebook e Instagram e cria o criativo.', 'Monta os públicos frio, quente e parecidos.', 'Acompanha as métricas e otimiza o custo por resultado.'],
      chips: ['Meta Ads', 'Facebook', 'Instagram'],
      fluxo: 'Transforma a verba em campanha rodando e entrega o lead direto ao time de vendas.'
    },
    davi: {
      name: 'Davi', role: 'SDR · vendas no WhatsApp', photo: 'img/agent-7.webp',
      resumo: 'O líder do squad de vendas e vendedor de WhatsApp. Conduz a conversa do primeiro contato até o agendamento.',
      does: ['Faz o primeiro contato e qualifica com método consultivo.', 'Responde objeção e faz o acompanhamento.', 'Agenda a reunião e coordena o squad de vendas.'],
      chips: ['WhatsApp', 'Calendários'],
      fluxo: 'Recebe o lead do tráfego, aquece pelo WhatsApp e entrega agendado ao comercial.'
    }
  };

  var dlg = document.getElementById('dossier');
  function fillList(el, items, cls) {
    el.textContent = '';
    items.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; el.appendChild(li); });
  }
  function openDossier(key) {
    var d = DATA[key]; if (!d || !dlg) return;
    document.getElementById('dsName').textContent = d.name;
    document.getElementById('dsRole').textContent = d.role;
    document.getElementById('dsResumo').textContent = d.resumo;
    document.getElementById('dsFluxo').textContent = d.fluxo;
    var ph = document.getElementById('dsPhoto'); ph.src = d.photo; ph.alt = d.name;
    fillList(document.getElementById('dsDoes'), d.does);
    fillList(document.getElementById('dsChips'), d.chips);
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }
  if (dlg) {
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
    });
  }
  document.querySelectorAll('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () { openDossier(b.getAttribute('data-open')); });
  });

  /* ---------- a parede: faixa curva arrastável ---------- */
  var wall = document.getElementById('wall');
  var agents = wall ? Array.prototype.slice.call(wall.querySelectorAll('.agent')) : [];
  /* posições medidas do comp aprovado (px de 1672x941), por distância do foco */
  var SLOTS = [
    { d: -3, x: 230, y: 330, w: 130, h: 450, o: 0 },
    { d: -2, x: 359, y: 312, w: 148, h: 486, o: 1 },
    { d: -1, x: 514, y: 296, w: 188, h: 515, o: 1 },
    { d: 0, x: 707, y: 280, w: 229, h: 536, o: 1 },
    { d: 1, x: 945, y: 299, w: 176, h: 509, o: 1 },
    { d: 2, x: 1127, y: 318, w: 166, h: 482, o: 1 },
    { d: 3, x: 1299, y: 334, w: 162, h: 458, o: 1 },
    { d: 4, x: 1466, y: 350, w: 161, h: 436, o: 1 },
    { d: 5, x: 1645, y: 366, w: 150, h: 420, o: 0 }
  ];
  var stacked = window.matchMedia('(max-width: 899px), (max-aspect-ratio: 5/4)');
  var focus = 2, target = 2, vel = 0, raf = 0;

  function slotAt(d) {
    if (d <= -3) return SLOTS[0];
    if (d >= 5) return SLOTS[8];
    var i = Math.floor(d) + 3, t = d - Math.floor(d);
    var a = SLOTS[i], b = SLOTS[Math.min(i + 1, 8)];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t, o: a.o + (b.o - a.o) * t };
  }
  function layout() {
    if (stacked.matches) {
      agents.forEach(function (el) { el.removeAttribute('style'); el.classList.remove('front'); el.querySelector('button').tabIndex = 0; el.removeAttribute('aria-hidden'); });
      return;
    }
    agents.forEach(function (el, i) {
      var n = agents.length, d = ((i - focus + 2.5) % n + n) % n - 2.5, s = slotAt(d), ad = Math.abs(d);
      var fade = Math.max(0, Math.min(1, (d + 2.5) / 0.5)) * Math.max(0, Math.min(1, (4.5 - d) / 0.5));
      el.style.setProperty('--x', (s.x / 16.72) + '%');
      el.style.setProperty('--y', (s.y / 9.41) + '%');
      el.style.setProperty('--w', (s.w / 16.72) + '%');
      el.style.setProperty('--h', (s.h / 9.41) + '%');
      el.style.setProperty('--o', fade.toFixed(3));
      el.style.setProperty('--z', String(100 - Math.round(ad * 10)));
      el.style.setProperty('--b', (1 - Math.min(ad, 4) * 0.045).toFixed(3));
      el.style.setProperty('--bl', ad > 4.2 ? ((ad - 4.2) * 2).toFixed(2) + 'px' : '0px');
      el.style.setProperty('--ry', (Math.max(-3.5, Math.min(4.5, d)) * 6).toFixed(2) + 'deg');
      el.classList.toggle('under-hand', d <= -1.6);
      var front = ad < 0.5; el.classList.toggle('front', front);
      var hidden = fade < 0.05; var btn = el.querySelector('button');
      btn.tabIndex = hidden ? -1 : 0;
      if (hidden) el.setAttribute('aria-hidden', 'true'); else el.removeAttribute('aria-hidden');
    });
  }
  function clampF(f) { return f; }
  function nearest(i) { var n = agents.length, k = Math.round((target - i) / n); return i + k * n; }
  function tick() {
    var k = 0.12;
    if (Math.abs(vel) > 0.0008) { target = clampF(target + vel); vel *= 0.92; if (Math.abs(vel) <= 0.0008) target = Math.round(target); }
    focus += (target - focus) * k;
    if (Math.abs(target - focus) < 0.001 && Math.abs(vel) <= 0.0008) { focus = target; layout(); raf = 0; return; }
    layout();
    raf = requestAnimationFrame(tick);
  }
  function go(t) { target = t; vel = 0; if (!raf) raf = requestAnimationFrame(tick); }

  if (wall && agents.length) {
    layout();
    var drag = null, moved = false;
    wall.addEventListener('pointerdown', function (e) {
      if (stacked.matches || e.button !== 0) return;
      drag = { x: e.clientX, f: target, t: performance.now(), lastX: e.clientX, lastT: performance.now() };
      moved = false; vel = 0;
      drag.pid = e.pointerId;
      wall.classList.add('dragging');
    });
    wall.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 5 && !moved) { moved = true; try { wall.setPointerCapture(drag.pid); } catch (_) {} glove && glove.classList.add('grab'); }
      var slotPx = wall.clientWidth * 0.11;
      target = clampF(drag.f - dx / slotPx);
      var now = performance.now(), dt = Math.max(1, now - drag.lastT);
      drag.v = -((e.clientX - drag.lastX) / slotPx) / dt * 16;
      drag.lastX = e.clientX; drag.lastT = now;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    function endDrag() {
      if (!drag) return;
      vel = moved ? Math.max(-0.35, Math.min(0.35, drag.v || 0)) : 0;
      if (!moved) target = Math.round(target);
      else if (Math.abs(vel) <= 0.0008) target = Math.round(target);
      drag = null;
      wall.classList.remove('dragging'); glove && glove.classList.remove('grab');
      if (!raf) raf = requestAnimationFrame(tick);
    }
    wall.addEventListener('pointerup', endDrag);
    wall.addEventListener('pointercancel', endDrag);

    agents.forEach(function (el, i) {
      el.querySelector('button').addEventListener('click', function (e) {
        if (moved) { e.preventDefault(); moved = false; return; }
        openDossier(el.getAttribute('data-agent'));
      });
    });
    wall.addEventListener('keydown', function (e) {
      if (stacked.matches) return;
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var n = Math.round(target) + (e.key === 'ArrowRight' ? 1 : -1), L = agents.length;
      go(n); agents[((n % L) + L) % L].querySelector('button').focus({ preventScroll: true });
    });
    stacked.addEventListener && stacked.addEventListener('change', layout);
    /* no celular a faixa abre com a GAIA no centro */
    function centerGaia() {
      if (!stacked.matches) return;
      var g = wall.querySelector('[data-agent=gaia]');
      if (g) wall.scrollLeft = g.offsetLeft - (wall.clientWidth - g.offsetWidth) / 2;
    }
    window.addEventListener('load', centerGaia); centerGaia();

    /* ampliação estilo Dock: cada painel cresce conforme a distância do cursor */
    var mags = agents.map(function () { return 0; }), magT = agents.map(function () { return 0; }), magRaf = 0, over = false;
    function magTick() {
      var moving = false;
      agents.forEach(function (el, i) {
        mags[i] += (magT[i] - mags[i]) * 0.2;
        if (Math.abs(magT[i] - mags[i]) < 0.004) mags[i] = magT[i]; else moving = true;
        el.style.setProperty('--mag', mags[i].toFixed(3));
      });
      magRaf = moving ? requestAnimationFrame(magTick) : 0;
    }
    function magSet(x) {
      var sigma = wall.clientWidth * 0.085;
      agents.forEach(function (el, i) {
        if (x == null || el.getAttribute('aria-hidden') === 'true') { magT[i] = 0; return; }
        var wr = wall.getBoundingClientRect();
        var cx = wr.left + (parseFloat(el.style.getPropertyValue('--x')) + parseFloat(el.style.getPropertyValue('--w')) / 2) / 100 * wr.width;
        var d = x - cx;
        magT[i] = Math.exp(-(d * d) / (2 * sigma * sigma));
      });
      if (!magRaf) magRaf = requestAnimationFrame(magTick);
    }
    if (!reduce && finePointer) {
      wall.addEventListener('pointermove', function (e) {
        if (stacked.matches || drag || e.pointerType !== 'mouse') return;
        magSet(e.clientX);
      });
      wall.addEventListener('pointerleave', function () { magSet(null); });
      wall.addEventListener('pointerdown', function () { magSet(null); });
    }

    /* barras de atividade */
    agents.forEach(function (el) {
      var w = el.querySelector('.agent-wave'); if (!w) return;
      for (var k = 0; k < 22; k++) { var i = document.createElement('i'); i.style.setProperty('--wd', (-Math.random() * 1.6).toFixed(2) + 's'); i.style.height = (25 + Math.random() * 75).toFixed(0) + '%'; w.appendChild(i); }
    });
  }

  /* ---------- decodificação de texto ---------- */
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·<>#';
  function decode(el, text, dur) {
    text = text == null ? el.textContent : text;
    if (reduce) { el.textContent = text; return; }
    var start = performance.now(); dur = dur || 900;
    function step(now) {
      var p = Math.min(1, (now - start) / dur), out = '';
      for (var i = 0; i < text.length; i++) {
        var c = text[i];
        if (c === ' ' || i / text.length < p) out += c;
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(step); else el.textContent = text;
    }
    requestAnimationFrame(step);
  }

  /* feed das tarefas: o painel troca de tarefa sozinho */
  if (!reduce && agents.length) {
    setInterval(function () {
      if (document.hidden) return;
      var vis = agents.filter(function (a) { return a.style.getPropertyValue('--o') !== '0.000'; });
      var el = vis[(Math.random() * vis.length) | 0]; if (!el) return;
      var t = el.querySelector('.agent-task'); var list = (t.getAttribute('data-tasks') || '').split('|');
      var cur = list.indexOf(t.textContent); var next = list[(cur + 1) % list.length];
      decode(t, next, 700);
    }, 2600);
  }

  /* ---------- entrada da parede (o momento autoral) ---------- */
  function lightUp() {
    root.classList.add('lit');
    if (!reduce && wall && !stacked.matches) { focus = 5.5; target = 2; layout(); raf = requestAnimationFrame(tick); }
  }
  var roomImg = document.querySelector('.hero-room');
  if (roomImg && !roomImg.complete) { roomImg.addEventListener('load', function () { setTimeout(lightUp, 120); }); setTimeout(lightUp, 1600); }
  else setTimeout(lightUp, 120);

  /* ---------- reveal por camada de vidro ---------- */
  var plies = document.querySelectorAll('[data-ply]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; el.classList.add('in'); io.unobserve(el);
        el.querySelectorAll('[data-decode]').forEach(function (d) { decode(d, null, 1000); });
        if (el.matches('[data-decode]')) decode(el, null, 1000);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    plies.forEach(function (el) {
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.querySelectorAll(':scope > [data-ply]'), el) : 0;
      el.style.setProperty('--d', Math.max(0, sib) * 90 + 'ms');
      io.observe(el);
    });
  } else plies.forEach(function (el) { el.classList.add('in'); });

  /* ---------- trilho e topo ---------- */
  var hero = document.getElementById('hero');
  var railLinks = Array.prototype.slice.call(document.querySelectorAll('[data-rail]'));
  var topLinks = Array.prototype.slice.call(document.querySelectorAll('.topnav a'));
  function onScroll() {
    var y = window.scrollY;
    root.classList.toggle('scrolled', y > 40);
    root.classList.toggle('past-hero', hero && y > hero.offsetHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if ('IntersectionObserver' in window) {
    var secIO = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        railLinks.forEach(function (a) { if (a.getAttribute('data-rail') === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
        topLinks.forEach(function (a) { if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    railLinks.forEach(function (a) { var s = document.getElementById(a.getAttribute('data-rail')); if (s) secIO.observe(s); });
  }

  /* ---------- luva: cursor de luz fria com rastro ---------- */
  var glove = null;
  if (finePointer) {
    glove = document.querySelector('.glove');
    var cv = document.querySelector('.glove-trail'), cx = cv.getContext('2d');
    var pts = [], gRaf = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
    size(); window.addEventListener('resize', size);
    root.classList.add('gloved');
    /* rastro de luz: só desenha enquanto há pontos recentes */
    function frame() {
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, innerWidth, innerHeight);
      var now = performance.now();
      pts = pts.filter(function (p) { return now - p.t < 420; });
      if (!reduce && pts.length > 1) {
        cx.lineCap = 'round'; cx.lineJoin = 'round';
        for (var i = 1; i < pts.length; i++) {
          var a = 1 - (now - pts[i].t) / 420;
          cx.strokeStyle = 'rgba(176,224,255,' + (a * 0.38).toFixed(3) + ')';
          cx.lineWidth = 1 + a * 2.2;
          cx.beginPath(); cx.moveTo(pts[i - 1].x, pts[i - 1].y); cx.lineTo(pts[i].x, pts[i].y); cx.stroke();
        }
      }
      gRaf = pts.length ? requestAnimationFrame(frame) : 0;
    }
    /* anel e ponto são um cursor só, no mesmo lugar do mouse, sem atraso */
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      glove.style.setProperty('--gx', e.clientX + 'px'); glove.style.setProperty('--gy', e.clientY + 'px');
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (pts.length > 40) pts.shift();
      var hot = e.target.closest && e.target.closest('a,button,select,input,label,.wall');
      glove.classList.toggle('hot', !!hot && !glove.classList.contains('grab'));
      if (!gRaf) gRaf = requestAnimationFrame(frame);
    }, { passive: true });
    document.addEventListener('mouseleave', function () { glove.style.setProperty('--gx', '-100px'); glove.style.setProperty('--gy', '-100px'); });

    /* parallax da sala sob a mão */
    var room = document.querySelector('.hero-room');
    if (room && !reduce) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        room.style.setProperty('--px', (((e.clientX - r.left) / r.width) - 0.5) * -14 + 'px');
        room.style.setProperty('--py', (((e.clientY - r.top) / r.height) - 0.5) * -10 + 'px');
      });
    }
  }

  /* ---------- linhas-guia das legendas ---------- */
  function drawLeaders() {
    document.querySelectorAll('.frame').forEach(function (fig) {
      var cap = fig.querySelector('.callout'); if (!cap) return;
      var old = fig.querySelector('.leader'); if (old) old.remove();
      if (getComputedStyle(cap).position !== 'absolute') return;
      var fr = fig.getBoundingClientRect(), cr = cap.getBoundingClientRect();
      var cs = getComputedStyle(cap);
      var px = parseFloat(cs.getPropertyValue('--cx')) / 100 * fr.width, py = parseFloat(cs.getPropertyValue('--cy')) / 100 * fr.height;
      var ax = Math.max(cr.left - fr.left, Math.min(px, cr.right - fr.left));
      var ay = py < cr.top - fr.top ? cr.top - fr.top : (cr.bottom - fr.top);
      var ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('class', 'leader'); svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = '<line x1="' + ax + '" y1="' + ay + '" x2="' + px + '" y2="' + py + '"/><circle cx="' + px + '" cy="' + py + '" r="7"/><circle class="c2" cx="' + px + '" cy="' + py + '" r="2"/>';
      fig.appendChild(svg);
    });
  }
  window.addEventListener('load', drawLeaders);
  window.addEventListener('resize', function () { clearTimeout(drawLeaders.t); drawLeaders.t = setTimeout(drawLeaders, 150); });

  /* ---------- fluxo do pedido: você pede, a GAIA organiza, o time executa, a entrega volta ---------- */
  var flow = document.getElementById('flow2');
  if (flow) {
    var NS = 'http://www.w3.org/2000/svg', svg = document.getElementById('flSvg');
    var CASES = [
      { req: 'Preciso de uma página para a campanha de sexta.', who: ['juliana', 'clone'], out: 'Página no ar.' },
      { req: 'Escreve o roteiro do anúncio.', who: ['jonathan'], out: 'Roteiro pronto para gravar.' },
      { req: 'Quero mais clientes chegando.', who: ['paulo'], out: 'Campanha rodando e sendo otimizada.' },
      { req: 'Quem me chamou hoje?', who: ['davi'], out: 'Contatos respondidos e reuniões agendadas.' }
    ];
    var node = function (n) { return flow.querySelector('[data-n="' + n + '"]'); };
    var steps = document.querySelectorAll('.steps li[data-step]'), tabs = document.querySelectorAll('.fl-tab');
    var lines = { yg: null, ga: {}, ao: {}, ret: null }, pulses = {};
    var AG = ['juliana', 'jonathan', 'paulo', 'davi', 'clone', 'rafael'];
    function mk(cls, d) { var p = document.createElementNS(NS, 'path'); p.setAttribute('class', cls); if (d) p.setAttribute('d', d); svg.appendChild(p); return p; }
    function curve(x1, y1, x2, y2) { var dx = Math.abs(x2 - x1) * 0.5; return 'M' + x1 + ' ' + y1 + ' C' + (x1 + dx) + ' ' + y1 + ' ' + (x2 - dx) + ' ' + y2 + ' ' + x2 + ' ' + y2; }
    function draw() {
      if (getComputedStyle(svg).display === 'none') return;
      var fr = flow.getBoundingClientRect(); svg.textContent = ''; lines = { yg: null, ga: {}, ao: {}, ret: null }; pulses = {};
      function pt(n, side) { var r = node(n).getBoundingClientRect(); var x = side === 'r' ? r.right : side === 'l' ? r.left : r.left + r.width / 2; var y = side === 'b' ? r.bottom : r.top + r.height / 2; return [x - fr.left, y - fr.top]; }
      function line(key, d, store, k) { var p = mk('fl-line', d), q = mk('fl-pulse', d); q.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 'px'); if (k) { store[k] = p; pulses[key + k] = q; } else { lines[key] = p; pulses[key] = q; } }
      var y = pt('you', 'r'), g1 = pt('gaia', 'l'), g2 = pt('gaia', 'r'), o = pt('out', 'l');
      line('yg', curve(y[0], y[1], g1[0], g1[1]));
      AG.forEach(function (a) { var l = pt(a, 'l'), r = pt(a, 'r'); line('ga', curve(g2[0], g2[1], l[0], l[1]), lines.ga, a); line('ao', curve(r[0], r[1], o[0], o[1]), lines.ao, a); });
      var ob = pt('out', 'b'), yb = pt('you', 'b'), low = flow.clientHeight - 36;
      line('ret', 'M' + ob[0] + ' ' + ob[1] + ' C' + ob[0] + ' ' + low + ' ' + yb[0] + ' ' + low + ' ' + yb[0] + ' ' + yb[1]);
    }
    function run(p, ms) { if (!p) return; p.style.setProperty('--dur', ms + 'ms'); p.classList.remove('run'); void p.getBoundingClientRect(); p.classList.add('run'); }
    var cur = 0, phase = 0, timer = 0, auto = true;
    function clear() {
      flow.querySelectorAll('.fl-node').forEach(function (n) { n.classList.remove('lit'); n.classList.remove('dim'); });
      flow.querySelectorAll('.fl-line').forEach(function (l) { l.classList.remove('on'); });
      document.getElementById('flBack').classList.remove('lit');
    }
    function show(i, ph) {
      var c = CASES[i]; clear();
      document.getElementById('flReq').textContent = c.req;
      document.getElementById('flOut').textContent = ph >= 3 ? c.out : '…';
      flow.querySelectorAll('.fl-agent').forEach(function (n) { if (c.who.indexOf(n.dataset.n) < 0 && ph >= 2) n.classList.add('dim'); });
      node('you').classList.add('lit');
      if (ph >= 1) { node('gaia').classList.add('lit'); lines.yg && lines.yg.classList.add('on'); if (ph === 1) run(pulses.yg, 900); }
      if (ph >= 2) c.who.forEach(function (a) { node(a).classList.add('lit'); lines.ga[a] && lines.ga[a].classList.add('on'); if (ph === 2) run(pulses['ga' + a], 900); });
      if (ph >= 3) { node('out').classList.add('lit'); c.who.forEach(function (a) { lines.ao[a] && lines.ao[a].classList.add('on'); if (ph === 3) run(pulses['ao' + a], 900); }); }
      if (ph >= 4) { document.getElementById('flBack').classList.add('lit'); lines.ret && lines.ret.classList.add('on'); if (ph === 4) run(pulses.ret, 1100); }
      var step = [1, 2, 3, 3, 4][ph];
      flow.classList.add('flow-on'); document.querySelector('#diferencial').classList.add('flow-on');
      steps.forEach(function (s) { s.classList.toggle('active', +s.dataset.step === step); });
      tabs.forEach(function (t, k) { t.classList.toggle('on', k === i); });
    }
    function tick() {
      if (document.hidden) return;
      show(cur, phase);
      phase++; if (phase > 4) { phase = 0; if (auto) cur = (cur + 1) % CASES.length; }
    }
    function start() { clearInterval(timer); phase = 0; show(cur, 0); phase = 1; timer = setInterval(tick, 1500); }
    tabs.forEach(function (t, k) { t.addEventListener('click', function () { cur = k; auto = false; start(); }); });
    var vis = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting && !vis) { vis = true; draw(); if (reduce) { cur = 0; show(0, 4); } else start(); }
      }, { threshold: 0.25 }).observe(flow);
    }
    window.addEventListener('resize', function () { clearTimeout(draw.t); draw.t = setTimeout(function () { draw(); if (vis) show(cur, Math.max(0, phase - 1)); }, 150); });
    window.addEventListener('load', function () { draw(); });
  }

  /* ---------- um dia de trabalho do squad (demonstração) ---------- */
  var feedEl = document.getElementById('taskFeed'), feedLog = document.getElementById('feedLog');
  if (feedEl) {
    var TASKS = [
      ['08:02', 'Davi', 'Respondeu e qualificou um novo contato no WhatsApp'],
      ['08:15', 'Jonathan', 'Escreveu o roteiro do anúncio da semana'],
      ['09:40', 'Juliana', 'Montou a página da campanha de sexta'],
      ['10:05', 'Clone do Rodrigo', 'Publicou o site no ar'],
      ['11:30', 'Paulo', 'Subiu os criativos e ajustou o custo por lead'],
      ['12:10', 'Rafael', 'Atualizou o cronograma das entregas'],
      ['12:45', 'GAIA', 'Revisou tudo e enviou o resumo no Telegram']
    ];
    var feedN = 0, feedStarted = false;
    function feedStep() {
      if (document.hidden) return;
      if (feedN >= TASKS.length) {
        feedN = 0; feedEl.textContent = ''; feedLog.textContent = 'Um novo dia começa'; return;
      }
      var t = TASKS[feedN++], li = document.createElement('li');
      li.innerHTML = '<span class="mono f-t"></span><b></b><span class="f-d"></span>';
      li.children[0].textContent = t[0]; li.children[1].textContent = t[1]; li.children[2].textContent = t[2];
      li.className = 'f-new'; feedEl.appendChild(li);
      Array.prototype.forEach.call(feedEl.children, function (x) { if (x !== li) x.classList.remove('f-new'); });
      feedLog.textContent = t[1] + ' · ' + t[2];
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting && !feedStarted) { feedStarted = true; feedStep(); setInterval(feedStep, reduce ? 3500 : 1900); }
      }, { threshold: 0.3 }).observe(feedEl);
    }
  }

  /* ---------- formulário → WhatsApp ---------- */
  var form = document.getElementById('offerForm');
  if (form) {
    var err = document.getElementById('formErr');
    var wrap = document.getElementById('offerFormWrap'), ok = document.getElementById('offerOk');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = [];
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name) return;
        var v = el.checkValidity(); el.setAttribute('aria-invalid', v ? 'false' : 'true'); if (!v) bad.push(el);
      });
      if (bad.length) {
        err.hidden = false;
        err.textContent = 'Falta preencher: ' + bad.map(function (el) { return form.querySelector('label[for="' + el.id + '"]').textContent.toLowerCase(); }).join(', ') + '.';
        bad[0].focus(); return;
      }
      err.hidden = true;
      var d = new FormData(form);
      var msg = 'Olá! Quero agendar a demonstração do Squad GAIA.\n\n' +
        'Nome: ' + d.get('nome') + '\n' + 'E-mail: ' + d.get('email') + '\n' + 'WhatsApp: ' + d.get('whatsapp') + '\n' +
        'Faturamento mensal: ' + d.get('faturamento') + '\n' + 'Funcionários: ' + d.get('funcionarios');
      var url = 'https://wa.me/' + WHATSAPP_DESTINO + '?text=' + encodeURIComponent(msg);
      window.open(url, '_blank', 'noopener');
      document.getElementById('zapAgain').href = url;
      wrap.hidden = true; ok.hidden = false;
    });
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity()) e.target.setAttribute('aria-invalid', 'false'); });
  }
})();
