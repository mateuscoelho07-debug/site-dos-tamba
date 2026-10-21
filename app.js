// Monta os cards a partir de produtos.js. Pra adicionar produto, edite produtos.js.
(function () {
  const grade = document.getElementById("grade");
  const filtros = document.getElementById("filtros");
  const busca = document.getElementById("busca");
  const vazio = document.getElementById("vazio");

  let categoriaAtual = "todas";

  function normaliza(texto) {
    return (texto || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function criaBotao(chave, rotulo) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = rotulo;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", chave === categoriaAtual);
    b.addEventListener("click", () => {
      categoriaAtual = chave;
      filtros.querySelectorAll("button").forEach((x) => x.setAttribute("aria-selected", x === b));
      desenha();
    });
    filtros.appendChild(b);
  }

  criaBotao("todas", "Tudo");
  Object.entries(CATEGORIAS).forEach(([chave, c]) => criaBotao(chave, `${c.emoji} ${c.titulo}`));

  function criaCard(p) {
    const cat = CATEGORIAS[p.categoria] || { titulo: p.categoria, emoji: "🐟" };
    const card = document.createElement("article");
    card.className = "card";

    if (p.destaque) {
      const selo = document.createElement("span");
      selo.className = "mini-selo";
      selo.textContent = "Escolha do Hulk";
      card.appendChild(selo);
    }

    if (p.imagem) {
      const img = document.createElement("img");
      img.className = "foto";
      img.src = p.imagem;
      img.alt = p.nome;
      img.loading = "lazy";
      card.appendChild(img);
    }

    const tipo = document.createElement("span");
    tipo.className = "cat";
    tipo.textContent = `${cat.emoji} ${cat.titulo}`;

    const titulo = document.createElement("h3");
    titulo.textContent = p.nome;

    const desc = document.createElement("p");
    desc.textContent = p.descricao;

    const link = document.createElement("a");
    link.className = "comprar";
    if (p.link) {
      link.href = p.link;
      link.target = "_blank";
      link.rel = "sponsored noopener";
      link.textContent = "Ver no Mercado Livre";
    } else {
      link.classList.add("sem-link");
      link.textContent = "Link em breve";
    }

    card.append(tipo, titulo, desc, link);
    return card;
  }

  function desenha() {
    const termo = normaliza(busca.value.trim());
    const lista = PRODUTOS
      .filter((p) => categoriaAtual === "todas" || p.categoria === categoriaAtual)
      .filter((p) => {
        if (!termo) return true;
        const alvo = normaliza([p.nome, p.descricao, ...(p.tags || [])].join(" "));
        return alvo.includes(termo);
      })
      .sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));

    grade.replaceChildren(...lista.map(criaCard));
    vazio.hidden = lista.length > 0;
  }

  busca.addEventListener("input", desenha);
  desenha();
})();
