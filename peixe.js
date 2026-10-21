// Tambaqui de verdade nadando no topo da página.
// A foto (img/tambaqui.png, fundo recortado) é fatiada em tiras verticais. Cada tira
// gira um pouco numa "espinha" que ondula da cabeça pra cauda: vista de lado, isso
// encurta a cauda e muda o brilho do flanco, como um peixe nadando de verdade.
(function () {
  const canvas = document.getElementById("rio");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const foto = new Image();
  foto.src = canvas.dataset.foto || "img/tambaqui.png";

  // Posições na foto (fração da largura/altura). A foto olha pra esquerda.
  const PEDUNCULO = 0.83; // onde o corpo vira cauda
  const BOCA = [0.012, 0.6];
  const TIRA = 3; // largura de cada tira em pixels da foto

  class Tambaqui {
    constructor(o) {
      Object.assign(this, {
        x: 0, y: 0, L: 300, dir: 1, vel: 50, alfa: 1, sombra: true, desfoque: 0,
        fase: Math.random() * 6, giro: 0, girando: false, alvoY: null, vy: 0,
      }, o);
      this.lim = { xmin: 0, xmax: 0, ymin: 0, ymax: 0 };
      this.buf = document.createElement("canvas");
      this.bctx = this.buf.getContext("2d");
    }

    atualiza(dt) {
      const lim = this.lim;
      if (this.girando) {
        this.giro += dt / 1.8;
        if (this.giro >= 1) { this.girando = false; this.giro = 0; this.dir *= -1; }
      } else if ((this.dir > 0 && this.x > lim.xmax) || (this.dir < 0 && this.x < lim.xmin)) {
        this.girando = true;
        this.giro = 0;
      }
      this.x += this.dir * this.vel * (this.girando ? 0.2 : 1) * dt;

      if (this.alvoY === null || Math.abs(this.alvoY - this.y) < 6 || this.alvoY < lim.ymin || this.alvoY > lim.ymax) {
        this.alvoY = lim.ymin + Math.random() * Math.max(0, lim.ymax - lim.ymin);
      }
      const alvoVy = Math.max(-14, Math.min(14, (this.alvoY - this.y) * 0.5));
      this.vy += (alvoVy - this.vy) * Math.min(1, dt * 0.7);
      this.y += this.vy * dt;

      this.fase += dt * 2 * Math.PI * (this.girando ? 2 : 1.2);
    }

    // 1 olhando pra direita, -1 pra esquerda. No giro ele "afina" como se virasse de frente.
    escalaX() {
      if (!this.girando) return this.dir;
      const c = this.dir * Math.cos(Math.PI * this.giro);
      return Math.abs(c) < 0.05 ? 0.05 * (Math.sign(c) || 1) : c;
    }

    inclinacao() {
      return Math.sign(this.escalaX()) * Math.atan2(this.vy, Math.max(this.vel, 1)) * 0.7;
    }

    altura() {
      return this.L * foto.naturalHeight / foto.naturalWidth;
    }

    boca() {
      const sx = this.escalaX(), a = this.inclinacao();
      const lx = (0.5 - BOCA[0]) * this.L * sx, ly = (BOCA[1] - 0.5) * this.altura();
      return [this.x + Math.cos(a) * lx - Math.sin(a) * ly, this.y + Math.sin(a) * lx + Math.cos(a) * ly];
    }

    // Monta o peixe ondulando num canvas próprio (olhando pra esquerda, como a foto).
    montaQuadro(dpr) {
      const fw = foto.naturalWidth, fh = foto.naturalHeight;
      const L = this.L, H = this.altura();
      const bw = Math.ceil(L * dpr), bh = Math.ceil(H * dpr);
      if (this.buf.width !== bw || this.buf.height !== bh) { this.buf.width = bw; this.buf.height = bh; }
      const c = this.bctx, q = L / fw;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, bw, bh);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);

      const A = this.girando ? 0.6 : 0.42;
      const angulos = [], posicoes = [];
      let X = 0;
      for (let sx = 0; sx < fw; sx += TIRA) {
        const u = (sx + TIRA / 2) / fw;
        const env = Math.pow(Math.max(0, (u - 0.35) / 0.65), 2);
        // a cauda é mais mole: amplitude extra depois do pedúnculo
        const extra = u > PEDUNCULO ? 1 + (u - PEDUNCULO) * 2.2 : 1;
        const phi = A * env * extra * Math.sin(this.fase - 5.4 * u) + 0.015 * Math.sin(this.fase);
        const w = Math.min(TIRA, fw - sx);
        const dw = w * Math.cos(phi) * q;
        c.drawImage(foto, sx, 0, w, fh, X, 0, dw + 0.7, H);
        angulos.push(phi);
        posicoes.push(X);
        X += dw;
      }

      // luz: o flanco que vira pra cima/pra frente brilha, o outro escurece
      c.globalCompositeOperation = "source-atop";
      const gl = c.createLinearGradient(0, 0, X, 0);
      for (let i = 0; i < angulos.length; i += 4) {
        const v = Math.sin(angulos[i]) * 2;
        gl.addColorStop(Math.min(1, posicoes[i] / X), v > 0 ? `rgba(255,250,215,${Math.min(0.22, v * 0.25)})` : `rgba(0,10,8,${Math.min(0.3, -v * 0.32)})`);
      }
      c.fillStyle = gl;
      c.fillRect(0, 0, L, H);

      // água: tom esverdeado e cáusticas passando pelo corpo
      c.fillStyle = "rgba(20,70,60,0.12)";
      c.fillRect(0, 0, L, H);
      const t = this.fase * 0.07;
      for (let k = 0; k < 4; k++) {
        const px = (((t * 0.15 + k * 0.29) % 1.3) - 0.15) * L;
        const py = H * (0.3 + 0.15 * Math.sin(t * 2.1 + k * 1.9));
        const r = L * 0.12;
        const rg = c.createRadialGradient(px, py, 0, px, py, r);
        rg.addColorStop(0, "rgba(255,255,225,0.16)");
        rg.addColorStop(1, "rgba(255,255,225,0)");
        c.fillStyle = rg;
        c.fillRect(px - r, py - r, r * 2, r * 2);
      }
      c.globalCompositeOperation = "source-over";
    }

    desenha(c, dpr) {
      if (!foto.complete || !foto.naturalWidth) return;
      this.montaQuadro(dpr);
      const L = this.L, H = this.altura();
      c.save();
      c.translate(this.x, this.y);
      c.rotate(this.inclinacao());
      c.scale(-this.escalaX(), 1); // a foto olha pra esquerda
      c.globalAlpha = this.alfa;
      if (this.desfoque && "filter" in c) c.filter = `blur(${this.desfoque}px)`;
      if (this.sombra) {
        c.shadowColor = "rgba(0,8,6,0.45)";
        c.shadowBlur = 26 * dpr;
        c.shadowOffsetY = 18 * dpr;
      }
      c.drawImage(this.buf, -L / 2, -H / 2, L, H);
      c.restore();
    }
  }

  // ---------- Cena ----------
  let W = 0, H = 0, dpr = 1;
  const principal = new Tambaqui({ vel: 44, dir: 1 });
  const fundo = new Tambaqui({ vel: 28, dir: -1, alfa: 0.28, sombra: false, desfoque: 1.5 });

  const raiosLuz = Array.from({ length: 6 }, (_, k) => ({
    x: 0.05 + k * 0.17 + Math.random() * 0.05, w: 40 + Math.random() * 80,
    inc: 0.2 + Math.random() * 0.25, f: Math.random() * 6,
  }));
  const particulas = Array.from({ length: 70 }, () => ({
    x: Math.random(), y: Math.random(), r: 0.5 + Math.random() * 1.4,
    a: 0.1 + Math.random() * 0.3, vx: (Math.random() - 0.5) * 4, vy: -1 - Math.random() * 3,
    perto: Math.random() < 0.15,
  }));
  const bolhas = [];
  let proxBolha = 2;

  function limites() {
    const movel = W < 760;
    if (movel) {
      principal.L = Math.max(170, Math.min(W * 0.55, 240));
      principal.lim = { xmin: principal.L * 0.15, xmax: W - principal.L * 0.15, ymin: H - 150, ymax: H - 128 };
    } else {
      principal.L = Math.max(260, Math.min(W * 0.27, 380));
      const fimTexto = Math.max(16, (W - 1100) / 2) + 560;
      const xmax = W - principal.L * 0.55 - 20;
      const xmin = Math.min(fimTexto + principal.L * 0.5, xmax - 120);
      principal.lim = { xmin, xmax, ymin: H * 0.4, ymax: H * 0.58 };
    }
    fundo.L = principal.L * 0.5;
    fundo.lim = { xmin: fundo.L, xmax: W - fundo.L, ymin: H * 0.18, ymax: H * (movel ? 0.4 : 0.5) };
    for (const p of [principal, fundo]) {
      if (!p.iniciado) {
        p.x = (p.lim.xmin + p.lim.xmax) / 2;
        p.y = (p.lim.ymin + p.lim.ymax) / 2;
        p.iniciado = true;
      }
    }
  }

  function redimensiona() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    limites();
  }

  function passo(dt, t) {
    principal.atualiza(dt);
    fundo.atualiza(dt);

    for (const p of particulas) {
      p.x += (p.vx + Math.sin(t * 0.3 + p.y * 10) * 2) * dt / W;
      p.y += p.vy * dt / H;
      if (p.y < 0) p.y += 1;
      if (p.x < 0) p.x += 1;
      if (p.x > 1) p.x -= 1;
    }

    proxBolha -= dt;
    if (proxBolha <= 0 && !principal.girando && foto.naturalWidth) {
      const [bx, by] = principal.boca();
      const n = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        bolhas.push({ x: bx, y: by + i * 6, r: 1.5 + Math.random() * 3, vy: 35 + Math.random() * 30, f: Math.random() * 6, idade: -i * 0.15 });
      }
      proxBolha = 4 + Math.random() * 5;
    }
    for (let i = bolhas.length - 1; i >= 0; i--) {
      const b = bolhas[i];
      b.idade += dt;
      if (b.idade < 0) continue;
      b.y -= b.vy * dt;
      b.x += Math.sin(b.idade * 5 + b.f) * 12 * dt;
      b.r += dt * 0.6;
      if (b.y < 20) bolhas.splice(i, 1);
    }
  }

  function desenhaRaios(t) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const r of raiosLuz) {
      const x0 = r.x * W + Math.sin(t * 0.15 + r.f) * 30;
      const a = 0.045 + 0.03 * Math.sin(t * 0.4 + r.f * 2);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, `rgba(255,236,180,${a})`);
      g.addColorStop(1, "rgba(255,236,180,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x0 - r.w * 0.3, 0);
      ctx.lineTo(x0 + r.w * 0.3, 0);
      ctx.lineTo(x0 + r.w + H * r.inc, H);
      ctx.lineTo(x0 - r.w * 0.2 + H * r.inc, H);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function desenhaParticulas(perto) {
    for (const p of particulas) {
      if (p.perto !== perto) continue;
      const x = p.x * W, y = p.y * H;
      if (perto) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, p.r * 4);
        g.addColorStop(0, `rgba(230,240,220,${p.a * 0.5})`);
        g.addColorStop(1, "rgba(230,240,220,0)");
        ctx.fillStyle = g;
        ctx.fillRect(x - p.r * 4, y - p.r * 4, p.r * 8, p.r * 8);
      } else {
        ctx.fillStyle = `rgba(220,235,215,${p.a})`;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function desenhaBolhas() {
    for (const b of bolhas) {
      if (b.idade < 0) continue;
      const a = Math.min(1, b.y / 120);
      ctx.strokeStyle = `rgba(255,255,255,${0.55 * a})`;
      ctx.lineWidth = 1;
      ctx.fillStyle = `rgba(255,255,255,${0.08 * a})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${0.8 * a})`;
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function desenha(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    desenhaRaios(t);
    desenhaParticulas(false);
    fundo.desenha(ctx, dpr);
    principal.desenha(ctx, dpr);
    desenhaBolhas();
    desenhaParticulas(true);
  }

  // ---------- Loop ----------
  let ultimo = 0, t = 0, rodando = false, visivel = true;

  function quadro(agora) {
    const dt = Math.min(0.05, (agora - ultimo) / 1000);
    ultimo = agora;
    t += dt;
    passo(dt, t);
    desenha(t);
    if (visivel) requestAnimationFrame(quadro);
    else rodando = false;
  }

  function inicia() {
    if (rodando || reduz) return;
    rodando = true;
    ultimo = performance.now();
    requestAnimationFrame(quadro);
  }

  redimensiona();
  window.addEventListener("resize", () => { redimensiona(); if (reduz) desenha(0); });

  if (reduz) {
    foto.addEventListener("load", () => desenha(0));
    desenha(0);
    return;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((e) => {
      visivel = e[0].isIntersecting;
      if (visivel) inicia();
    }).observe(hero);
  }
  inicia();
})();
