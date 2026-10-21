// Tambaqui (Colossoma macropomum) desenhado em canvas, nadando no topo da página.
// O corpo é um contorno anatômico; a ondulação lateral é simulada por uma "espinha"
// que gira em cada ponto, o que encurta a parte de trás e a cauda vista de lado,
// e muda o brilho do flanco conforme ele vira para a luz.
(function () {
  const canvas = document.getElementById("rio");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Anatomia (unidades do peixe: focinho em x=200, pedúnculo em x=-130) ----------
  const X0 = -130, X1 = 200, PASSO = 2;
  const N = (X1 - X0) / PASSO + 1;
  const DORSO = [[-130, -20], [-95, -40], [-50, -72], [0, -95], [40, -101], [80, -95], [120, -80], [152, -62], [174, -42], [190, -22], [198, -8], [200, 2]];
  const VENTRE = [[-130, 18], [-95, 34], [-50, 62], [0, 84], [40, 92], [80, 89], [120, 76], [152, 58], [176, 40], [192, 22], [199, 10], [200, 4]];

  function curva(pts, x) {
    let i = 0;
    while (i < pts.length - 2 && x > pts[i + 1][0]) i++;
    const p0 = pts[Math.max(i - 1, 0)][1], p1 = pts[i][1], p2 = pts[i + 1][1], p3 = pts[Math.min(i + 2, pts.length - 1)][1];
    const t = Math.min(Math.max((x - pts[i][0]) / (pts[i + 1][0] - pts[i][0]), 0), 1);
    const t2 = t * t, t3 = t2 * t;
    return 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (3 * p1 - p0 - 3 * p2 + p3) * t3);
  }

  const dorsoY = new Float32Array(N), ventreY = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    dorsoY[i] = curva(DORSO, X0 + i * PASSO);
    ventreY[i] = curva(VENTRE, X0 + i * PASSO);
  }

  function amostra(arr, x) {
    const f = Math.min(Math.max((x - X0) / PASSO, 0), N - 1);
    const i = Math.min(Math.floor(f), N - 2), r = f - i;
    return arr[i] + (arr[i + 1] - arr[i]) * r;
  }
  const dorso = (x) => amostra(dorsoY, x);
  const ventre = (x) => amostra(ventreY, x);

  function quad(a, c, b, t) {
    const u = 1 - t;
    return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
  }

  // ---------- Peixe ----------
  class Tambaqui {
    constructor(o) {
      Object.assign(this, {
        x: 0, y: 0, L: 300, dir: 1, vel: 50, alfa: 1, sombra: true,
        fase: Math.random() * 6, resp: Math.random() * 6,
        giro: 0, girando: false, alvoY: null, vy: 0,
      }, o);
      this.X = new Float32Array(N);
      this.phi = new Float32Array(N);
      this.lim = { xmin: 0, xmax: 0, ymin: 0, ymax: 0 };
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
      const alvoVy = Math.max(-18, Math.min(18, (this.alvoY - this.y) * 0.5));
      this.vy += (alvoVy - this.vy) * Math.min(1, dt * 0.7);
      this.y += this.vy * dt;

      this.fase += dt * 2 * Math.PI * (this.girando ? 2.1 : 1.3);
      this.resp += dt * 2 * Math.PI * 0.45;
    }

    // Lado visível: 1 olhando pra direita, -1 pra esquerda. No giro ele "afina" como se virasse de frente.
    escalaX() {
      if (!this.girando) return this.dir;
      const c = this.dir * Math.cos(Math.PI * this.giro);
      return Math.abs(c) < 0.06 ? 0.06 * (Math.sign(c) || 1) : c;
    }

    inclinacao() {
      return Math.sign(this.escalaX()) * Math.atan2(this.vy, Math.max(this.vel, 1)) * 0.7;
    }

    boca() {
      const s = this.L / 410, sx = this.escalaX(), a = this.inclinacao();
      const lx = 200 * s * sx, ly = 6 * s;
      return [this.x + Math.cos(a) * lx - Math.sin(a) * ly, this.y + Math.sin(a) * lx + Math.cos(a) * ly];
    }

    espinha() {
      const A = this.girando ? 0.55 : 0.4;
      for (let i = N - 1; i >= 0; i--) {
        const u = (200 - (X0 + i * PASSO)) / 400;
        const env = Math.pow(Math.max(0, (u - 0.3) / 0.7), 2);
        this.phi[i] = A * env * Math.sin(this.fase - 5.6 * u) + 0.02 * Math.sin(this.fase);
        this.X[i] = i === N - 1 ? X1 : this.X[i + 1] - PASSO * Math.cos((this.phi[i] + this.phi[i + 1]) / 2);
      }
      this.angCauda = (this.girando ? 0.95 : 0.75) * Math.sin(this.fase - 6.1);
      this.angCaudaInf = (this.girando ? 0.95 : 0.75) * Math.sin(this.fase - 6.5);
    }

    mx(x) {
      if (x >= X1) return x;
      const f = (x - X0) / PASSO;
      if (f <= 0) return this.X[0] + (x - X0);
      const i = Math.min(Math.floor(f), N - 2), r = f - i;
      return this.X[i] + (this.X[i + 1] - this.X[i]) * r;
    }

    desenha(c, dpr, cx = this.x, cy = this.y) {
      const s = this.L / 410;
      this.espinha();
      c.save();
      c.translate(cx, cy);
      c.rotate(this.inclinacao());
      c.scale(s * this.escalaX(), s);

      this.nadadeiraCaudal(c);
      this.nadadeiraDorsal(c);
      this.nadadeiraAdiposa(c);
      this.nadadeiraAnal(c);
      this.nadadeiraPelvica(c);
      this.corpo(c, dpr);
      this.cabeca(c);
      this.nadadeiraPeitoral(c);

      c.restore();
    }

    contorno(c) {
      c.beginPath();
      c.moveTo(this.X[0], dorsoY[0]);
      for (let i = 1; i < N; i++) c.lineTo(this.X[i], dorsoY[i]);
      for (let i = N - 1; i >= 0; i--) c.lineTo(this.X[i], ventreY[i]);
      c.closePath();
    }

    membrana(c, gradA, gradB, ga, gb) {
      const g = c.createLinearGradient(ga[0], ga[1], gb[0], gb[1]);
      g.addColorStop(0, gradA);
      g.addColorStop(1, gradB);
      c.fillStyle = g;
      c.fill();
    }

    raios(c, pares, alfa = 0.4) {
      c.beginPath();
      for (const [a, b] of pares) { c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); }
      c.strokeStyle = `rgba(0,0,0,${alfa})`;
      c.lineWidth = 1.1;
      c.stroke();
    }

    nadadeiraCaudal(c) {
      const bx = this.X[0] + 10;
      const cU = Math.cos(this.angCauda), cL = Math.cos(this.angCaudaInf);
      const bU = [bx, -19], bL = [bx, 17];
      const tU = [bx - 84 * cU, -74], tL = [bx - 84 * cL, 70];
      const ent = [bx - 36 * (cU + cL) / 2, -1];
      const cUa = [bx - 40 * cU, -48], cUt = [bx - 60 * cU, -26], cLt = [bx - 60 * cL, 24], cLa = [bx - 40 * cL, 44];

      c.beginPath();
      c.moveTo(bU[0], bU[1]);
      c.quadraticCurveTo(cUa[0], cUa[1], tU[0], tU[1]);
      c.quadraticCurveTo(cUt[0], cUt[1], ent[0], ent[1]);
      c.quadraticCurveTo(cLt[0], cLt[1], tL[0], tL[1]);
      c.quadraticCurveTo(cLa[0], cLa[1], bL[0], bL[1]);
      c.closePath();
      this.membrana(c, "rgba(34,36,26,0.98)", "rgba(14,14,12,0.82)", [bx, 0], [bx - 84, 0]);

      const luz = Math.sin(this.angCauda);
      c.fillStyle = luz > 0 ? `rgba(255,240,200,${0.14 * luz})` : `rgba(0,0,0,${-0.22 * luz})`;
      c.fill();

      const pares = [];
      for (let k = 0; k <= 16; k++) {
        const t = k / 16;
        const ponta = t < 0.5 ? quad(tU, cUt, ent, t * 2) : quad(ent, cLt, tL, (t - 0.5) * 2);
        pares.push([[bx, -18 + 34 * t], ponta]);
      }
      this.raios(c, pares, 0.45);
    }

    nadadeiraDorsal(c) {
      const ond = 3 * Math.sin(this.fase * 0.5);
      const A = [this.mx(42), dorso(42) + 4], B = [this.mx(-28), dorso(-28) + 4];
      const T = [this.mx(6) + ond, dorso(6) - 60];
      const cAT = [this.mx(36), dorso(36) - 52], cTB = [this.mx(-8) + ond * 0.5, dorso(-8) - 22];
      c.beginPath();
      c.moveTo(A[0], A[1]);
      c.quadraticCurveTo(cAT[0], cAT[1], T[0], T[1]);
      c.quadraticCurveTo(cTB[0], cTB[1], B[0], B[1]);
      c.closePath();
      this.membrana(c, "rgba(48,52,34,0.98)", "rgba(18,18,14,0.86)", [0, A[1]], [0, T[1]]);

      const pares = [[A, T]];
      for (let k = 1; k <= 11; k++) {
        const t = k / 11;
        pares.push([[A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t], quad(T, cTB, B, t)]);
      }
      this.raios(c, pares, 0.38);
    }

    nadadeiraAdiposa(c) {
      const A = [this.mx(-86), dorso(-86) + 3], B = [this.mx(-116), dorso(-116) + 3];
      const T = [this.mx(-119), dorso(-112) - 17];
      c.beginPath();
      c.moveTo(A[0], A[1]);
      c.quadraticCurveTo(this.mx(-98), dorso(-98) - 16, T[0], T[1]);
      c.quadraticCurveTo(this.mx(-120), dorso(-117) - 4, B[0], B[1]);
      c.closePath();
      this.membrana(c, "rgba(40,42,30,0.97)", "rgba(18,18,14,0.9)", [0, A[1]], [0, T[1]]);
      const pares = [];
      for (let k = 1; k <= 4; k++) {
        const t = k / 5;
        pares.push([[A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t], [T[0] + (A[0] - T[0]) * (1 - t) * 0.6, T[1] + 4 * (1 - t)]]);
      }
      this.raios(c, pares, 0.3);
    }

    nadadeiraAnal(c) {
      const ond = 2.5 * Math.sin(this.fase * 0.6 + 1);
      const A = [this.mx(-14), ventre(-14) - 4], B = [this.mx(-118), ventre(-118) - 3];
      const T = [this.mx(-34) + ond, ventre(-34) + 40];
      const E = [this.mx(-124), ventre(-122) + 9];
      const cAT = [this.mx(-18), ventre(-18) + 30], cTE = [this.mx(-80), ventre(-80) + 13];
      c.beginPath();
      c.moveTo(A[0], A[1]);
      c.quadraticCurveTo(cAT[0], cAT[1], T[0], T[1]);
      c.quadraticCurveTo(cTE[0], cTE[1], E[0], E[1]);
      c.lineTo(B[0], B[1]);
      c.closePath();
      this.membrana(c, "rgba(30,28,22,0.98)", "rgba(12,12,10,0.85)", [0, A[1]], [0, T[1]]);
      const pares = [[A, T]];
      for (let k = 1; k <= 14; k++) {
        const t = k / 14;
        pares.push([[A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t], quad(T, cTE, E, t)]);
      }
      this.raios(c, pares, 0.38);
    }

    nadadeiraPelvica(c) {
      const ond = 3 * Math.sin(this.fase * 0.8);
      const A = [this.mx(46), ventre(46) - 5], B = [this.mx(26), ventre(26) - 5];
      const T = [this.mx(2) + ond, ventre(8) + 30];
      c.beginPath();
      c.moveTo(A[0], A[1]);
      c.quadraticCurveTo(this.mx(30), ventre(30) + 24, T[0], T[1]);
      c.quadraticCurveTo(this.mx(16), ventre(16) + 10, B[0], B[1]);
      c.closePath();
      this.membrana(c, "rgba(32,30,22,0.97)", "rgba(12,12,10,0.85)", [0, A[1]], [0, T[1]]);
      const pares = [];
      for (let k = 0; k <= 5; k++) {
        const t = k / 5;
        pares.push([[A[0] + (B[0] - A[0]) * t, A[1]], [T[0] + 10 * t, T[1] - 14 * t]]);
      }
      this.raios(c, pares, 0.35);
    }

    corpo(c, dpr) {
      // base: dorso oliva escuro, flanco bronze-dourado, ventre escuro
      this.contorno(c);
      const g = c.createLinearGradient(0, -100, 0, 92);
      g.addColorStop(0.00, "#1a2316");
      g.addColorStop(0.18, "#2e3a22");
      g.addColorStop(0.36, "#6a6834");
      g.addColorStop(0.50, "#8f7f40");
      g.addColorStop(0.62, "#735f2e");
      g.addColorStop(0.78, "#2f2a1e");
      g.addColorStop(1.00, "#131310");
      c.fillStyle = g;
      if (this.sombra) {
        c.shadowColor = "rgba(0,8,6,0.45)";
        c.shadowBlur = 34 * dpr;
        c.shadowOffsetY = 22 * dpr;
      }
      c.fill();
      c.shadowColor = "transparent";

      c.save();
      this.contorno(c);
      c.clip();

      // flanco virando pra luz conforme a ondulação
      const gl = c.createLinearGradient(this.X[0], 0, X1, 0);
      const span = X1 - this.X[0];
      for (let i = 0; i < N; i += 6) {
        const v = Math.sin(this.phi[i]) * 2.2;
        gl.addColorStop((this.X[i] - this.X[0]) / span, v > 0 ? `rgba(255,244,205,${Math.min(0.28, v * 0.3)})` : `rgba(0,0,0,${Math.min(0.3, -v * 0.35)})`);
      }
      c.fillStyle = gl;
      c.fillRect(this.X[0], -110, span + 10, 210);

      // brilho prateado no flanco
      const br = c.createRadialGradient(70, -30, 10, 70, -30, 160);
      br.addColorStop(0, "rgba(255,250,225,0.20)");
      br.addColorStop(1, "rgba(255,250,225,0)");
      c.fillStyle = br;
      c.fillRect(-140, -110, 350, 210);

      // escamas (borda exposta virada pra cauda)
      c.beginPath();
      for (let r = 0, y = -100; y < 96; y += 8.5, r++) {
        for (let x = -126 + (r % 2) * 4.5; x < 124 - Math.max(0, -y) * 0.15; x += 9) {
          const X = this.mx(x);
          c.moveTo(X, y + 5.4);
          c.arc(X, y, 5.4, Math.PI / 2, Math.PI * 1.5);
        }
      }
      c.strokeStyle = "rgba(255,232,170,0.07)";
      c.lineWidth = 2.2;
      c.stroke();
      c.strokeStyle = "rgba(0,0,0,0.15)";
      c.lineWidth = 0.8;
      c.stroke();

      // linha lateral
      c.fillStyle = "rgba(235,222,170,0.2)";
      for (let x = 122; x > -126; x -= 5.5) {
        const d = 122 - x;
        const y = -30 + d * 0.11 - d * d * 0.00016;
        c.fillRect(this.mx(x) - 1.6, y - 0.7, 3.2, 1.4);
      }

      // luz da superfície passando pelo corpo (cáusticas)
      c.globalCompositeOperation = "soft-light";
      const t = this.fase * 0.08;
      for (let k = 0; k < 4; k++) {
        const px = ((t * 60 + k * 113) % 440) - 220;
        const py = -55 + 45 * Math.sin(t * 2.3 + k * 1.7);
        const rg = c.createRadialGradient(px, py, 0, px, py, 46);
        rg.addColorStop(0, "rgba(255,255,235,0.55)");
        rg.addColorStop(1, "rgba(255,255,235,0)");
        c.fillStyle = rg;
        c.fillRect(px - 50, py - 50, 100, 100);
      }
      c.globalCompositeOperation = "source-over";

      // sombra da borda do opérculo
      const ob = 1.6 * Math.sin(this.resp);
      c.beginPath();
      c.moveTo(144, -70);
      c.quadraticCurveTo(120 + ob, -30, 120 + ob, 8);
      c.quadraticCurveTo(120 + ob, 44, 142, 64);
      c.strokeStyle = "rgba(0,0,0,0.13)";
      c.lineWidth = 6;
      c.stroke();

      // cabeça sem escamas, um pouco mais escura em cima
      const gc = c.createLinearGradient(124, 0, 200, 0);
      gc.addColorStop(0, "rgba(20,22,14,0)");
      gc.addColorStop(1, "rgba(20,22,14,0.28)");
      c.fillStyle = gc;
      c.fillRect(124, -110, 80, 210);

      c.restore();

      // contorno sutil
      this.contorno(c);
      c.strokeStyle = "rgba(0,0,0,0.35)";
      c.lineWidth = 1.2;
      c.stroke();
    }

    cabeca(c) {
      const ob = 1.6 * Math.sin(this.resp);

      // opérculo (tampa das brânquias)
      c.beginPath();
      c.moveTo(148, -68);
      c.quadraticCurveTo(124 + ob, -30, 124 + ob, 8);
      c.quadraticCurveTo(124 + ob, 44, 146, 62);
      c.strokeStyle = "rgba(10,10,6,0.42)";
      c.lineWidth = 1.8;
      c.stroke();
      c.beginPath();
      c.moveTo(150, -66);
      c.quadraticCurveTo(127 + ob, -30, 127 + ob, 8);
      c.quadraticCurveTo(127 + ob, 42, 148, 60);
      c.strokeStyle = "rgba(255,232,180,0.13)";
      c.lineWidth = 1.2;
      c.stroke();
      // pré-opérculo
      c.beginPath();
      c.moveTo(162, -50);
      c.quadraticCurveTo(142, -10, 152, 40);
      c.strokeStyle = "rgba(0,0,0,0.16)";
      c.lineWidth = 1.6;
      c.stroke();

      // olho
      const ex = 166, ey = -32;
      const cav = c.createRadialGradient(ex, ey, 8, ex, ey, 18);
      cav.addColorStop(0, "rgba(0,0,0,0.35)");
      cav.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = cav;
      c.beginPath(); c.arc(ex, ey, 18, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#17140d";
      c.beginPath(); c.arc(ex, ey, 10, 0, Math.PI * 2); c.fill();
      const iris = c.createRadialGradient(ex - 1, ey - 1, 3, ex, ey, 9);
      iris.addColorStop(0.45, "#b88d3e");
      iris.addColorStop(0.8, "#6b4a17");
      iris.addColorStop(1, "#2a1d08");
      c.fillStyle = iris;
      c.beginPath(); c.arc(ex, ey, 9, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#050505";
      c.beginPath(); c.arc(ex + 0.5, ey, 5.4, 0, Math.PI * 2); c.fill();
      c.fillStyle = "rgba(255,255,255,0.7)";
      c.beginPath(); c.ellipse(ex - 2.5, ey - 3, 1.8, 1.2, -0.5, 0, Math.PI * 2); c.fill();
      c.fillStyle = "rgba(255,255,255,0.35)";
      c.beginPath(); c.arc(ex + 3, ey + 4, 1.1, 0, Math.PI * 2); c.fill();

      // narinas
      c.fillStyle = "rgba(0,0,0,0.55)";
      c.beginPath(); c.ellipse(186, -19, 2, 1.4, 0.3, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.ellipse(180, -18, 1.4, 1, 0.3, 0, Math.PI * 2); c.fill();

      // boca (lábios grossos, abre de leve ao respirar)
      const ab = 1.4 * Math.max(0, Math.sin(this.resp));
      c.beginPath();
      c.moveTo(200, 4);
      c.quadraticCurveTo(195, 7 + ab, 189, 6 + ab * 0.6);
      c.strokeStyle = "rgba(0,0,0,0.55)";
      c.lineWidth = 1.8;
      c.stroke();
      c.beginPath();
      c.moveTo(196, 1);
      c.quadraticCurveTo(192, 4, 186, 5);
      c.strokeStyle = "rgba(255,225,170,0.18)";
      c.lineWidth = 1.4;
      c.stroke();
      c.beginPath();
      c.moveTo(194, 14 + ab);
      c.quadraticCurveTo(186, 20, 174, 21);
      c.strokeStyle = "rgba(0,0,0,0.12)";
      c.lineWidth = 1.4;
      c.stroke();
    }

    nadadeiraPeitoral(c) {
      const bat = Math.sin(this.fase * 0.7);
      c.save();
      c.translate(this.mx(128), 46);
      c.rotate(-0.12 + 0.2 * bat);
      c.scale(0.75 + 0.25 * Math.cos(this.fase * 0.7 + 0.6), 1);
      c.beginPath();
      c.moveTo(2, -5);
      c.quadraticCurveTo(-28, -9, -56, 9);
      c.quadraticCurveTo(-48, 22, -30, 20);
      c.quadraticCurveTo(-12, 16, 2, 6);
      c.closePath();
      this.membrana(c, "rgba(44,40,28,0.82)", "rgba(16,15,12,0.7)", [0, 0], [-56, 0]);
      const pares = [];
      for (let k = 0; k <= 7; k++) {
        const t = k / 7;
        pares.push([[0, -4 + 9 * t], quad([-56, 9], [-48, 22], [-30, 20], t)]);
      }
      this.raios(c, pares, 0.32);
      c.restore();
    }
  }

  // ---------- Cena ----------
  let W = 0, H = 0, dpr = 1;
  const principal = new Tambaqui({ vel: 46, dir: 1 });
  const fundo = new Tambaqui({ vel: 30, dir: -1, alfa: 0.3, sombra: false });
  const buffer = document.createElement("canvas");
  const bctx = buffer.getContext("2d");

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
      principal.L = Math.max(170, Math.min(W * 0.5, 260));
      principal.lim = { xmin: principal.L * 0.15, xmax: W - principal.L * 0.15, ymin: H - 215, ymax: H - 165 };
    } else {
      principal.L = Math.max(260, Math.min(W * 0.27, 420));
      const fimTexto = Math.max(16, (W - 1100) / 2) + 560;
      const xmax = W - principal.L * 0.55 - 20;
      const xmin = Math.min(fimTexto + principal.L * 0.5, xmax - 120);
      principal.lim = { xmin, xmax, ymin: H * 0.38, ymax: H * 0.62 };
    }
    fundo.L = principal.L * 0.45;
    fundo.lim = { xmin: fundo.L, xmax: W - fundo.L, ymin: H * 0.18, ymax: H * (movel ? 0.4 : 0.5) };
    for (const p of [principal, fundo]) {
      if (!p.iniciado) {
        p.x = (p.lim.xmin + p.lim.xmax) / 2;
        p.y = (p.lim.ymin + p.lim.ymax) / 2;
        p.iniciado = true;
      }
    }
    buffer.width = Math.ceil(fundo.L * 1.3 * dpr);
    buffer.height = Math.ceil(fundo.L * 0.9 * dpr);
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
    if (proxBolha <= 0 && !principal.girando) {
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

  function desenhaFundo() {
    const bw = buffer.width / dpr, bh = buffer.height / dpr;
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.clearRect(0, 0, buffer.width, buffer.height);
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fundo.desenha(bctx, dpr, bw / 2, bh / 2 + fundo.L * 0.03);
    ctx.save();
    ctx.globalAlpha = fundo.alfa;
    if ("filter" in ctx) ctx.filter = "blur(1.5px)";
    ctx.drawImage(buffer, fundo.x - bw / 2, fundo.y - bh / 2, bw, bh);
    ctx.restore();
  }

  function desenha(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    desenhaRaios(t);
    desenhaParticulas(false);
    desenhaFundo();
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
