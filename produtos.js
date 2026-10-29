/*
  ============================================================
  AQUI É ONDE VOCÊ MEXE, PARCEIRO 🎣
  ============================================================
  Cada item da lista PRODUTOS vira um card no site.
  Para adicionar um equipamento, copie um bloco { ... }, cole
  no final da lista e troque os textos.

  Campos:
    categoria  -> uma das chaves de CATEGORIAS (lá embaixo)
    nome       -> nome do produto
    descricao  -> por que você recomenda (curto e direto)
    link       -> seu link de afiliado do Mercado Livre
                  (enquanto estiver "", o botão mostra "Link em breve")
    imagem     -> opcional: URL de uma foto do produto
    destaque   -> opcional: true para ganhar o selo "Escolha do Hulk"
    tags       -> opcional: palavras-chave que ajudam na busca

  Dica: não esqueça a vírgula entre um bloco e outro.
*/

const CATEGORIAS = {
  indicados:  { titulo: "Indicações",              emoji: "⭐" },
  varas:      { titulo: "Varas",                   emoji: "🎣" },
  molinetes:  { titulo: "Molinetes e carretilhas", emoji: "⚙️" },
  linhas:     { titulo: "Linhas",                  emoji: "🧵" },
  anzois:     { titulo: "Anzóis e chicotes",       emoji: "🪝" },
  iscas:      { titulo: "Iscas e ceva",            emoji: "🍈" },
  acessorios: { titulo: "Acessórios",              emoji: "🧰" },
};

const PRODUTOS = [
  // ---- Indicações com link de afiliado ----
  // Textos genéricos até a gente confirmar qual produto é cada link: troque nome e descricao por produto.
  {
    categoria: "indicados",
    nome: "Indicação nº 1",
    descricao: "Equipamento escolhido pra quem vai atrás de hulk e verdão de verdade. Clica no botão amarelo e confere preço, fotos e avaliações direto no Mercado Livre.",
    link: "https://meli.la/2xc1usP",
    destaque: true,
    tags: ["indicação", "hulk", "verdão"],
  },
  {
    categoria: "indicados",
    nome: "Indicação nº 2",
    descricao: "Pra montar o kit pro redondo sem passar sufoco na beira do tanque. Dá uma olhada no Mercado Livre e vê se combina com o seu.",
    link: "https://meli.la/2REMDbi",
    destaque: true,
    tags: ["indicação", "kit", "pesqueiro"],
  },
  {
    categoria: "indicados",
    nome: "Indicação nº 3",
    descricao: "Um item que não pode faltar na mala de quem pesca tambaqui e tambacu. Confere os detalhes e as avaliações no Mercado Livre.",
    link: "https://meli.la/2LjrnZ2",
    destaque: true,
    tags: ["indicação", "tambaqui", "tambacu"],
  },
  {
    categoria: "indicados",
    nome: "Indicação nº 4",
    descricao: "Quem já embarcou bitelo sabe: equipamento bom faz diferença na hora da arrancada. Vê as fotos e o preço no Mercado Livre.",
    link: "https://meli.la/1gFFBtq",
    destaque: true,
    tags: ["indicação", "bitelo"],
  },
  {
    categoria: "indicados",
    nome: "Indicação nº 5",
    descricao: "Mais uma indicação pra turbinar a pescaria de redondo. Clica no botão amarelo e confere tudo no Mercado Livre.",
    link: "https://meli.la/29M6spj",
    destaque: true,
    tags: ["indicação", "pescaria"],
  },
  {
    categoria: "indicados",
    nome: "Indicação nº 6",
    descricao: "Pra fechar o kit e ir pro tanque confiante. Dá uma olhada no Mercado Livre antes que acabe no estoque.",
    link: "https://meli.la/1VCrfmX",
    destaque: true,
    tags: ["indicação", "kit"],
  },

  // ---- Sugestões ainda sem link (aparecem depois, com "Link em breve") ----
  {
    categoria: "varas",
    nome: "Vara de carbono 1,80 m, 20–40 lb, ação média",
    descricao: "Tem espinha pra segurar hulk de 15 kg sem perder a sensibilidade na beliscada. A queridinha do pesqueiro.",
    link: "",
    destaque: true,
    tags: ["pesqueiro", "hulk", "carbono"],
  },
  {
    categoria: "varas",
    nome: "Vara 2,10 m, 25–50 lb, ação pesada",
    descricao: "Pra quem vai atrás de verdão em tanque fundo e precisa de alavanca pra tirar o bicho da galhada.",
    link: "",
    tags: ["pesada", "verdão"],
  },
  {
    categoria: "molinetes",
    nome: "Molinete tamanho 4000–5000 com drag de 8 kg ou mais",
    descricao: "Carretel grande e drag macio: o redondo dá aquela primeira arrancada e o drag precisa cantar sem travar.",
    link: "",
    destaque: true,
    tags: ["drag", "molinete"],
  },
  {
    categoria: "molinetes",
    nome: "Carretilha perfil baixo com drag de 7 kg ou mais",
    descricao: "Pra quem curte carretilha: escolha uma com freio forte e boa capacidade de linha 0,40 mm.",
    link: "",
    tags: ["carretilha", "perfil baixo"],
  },
  {
    categoria: "linhas",
    nome: "Multifilamento 8 fios, 40–50 lb",
    descricao: "Zero elasticidade, fisgada na hora. Use com um líder de monofilamento pra aguentar o atrito.",
    link: "",
    tags: ["multi", "8x"],
  },
  {
    categoria: "linhas",
    nome: "Monofilamento 0,40–0,50 mm",
    descricao: "Mais barato, perdoa erro de drag e segura bem a pancada. Ótimo pra quem tá começando.",
    link: "",
    tags: ["mono", "iniciante"],
  },
  {
    categoria: "anzois",
    nome: "Anzol tipo chinu ou maruseigo, nº 12 a 16",
    descricao: "Tambaqui tem boca dura e dente de gente. Anzol forte e bem afiado é obrigatório.",
    link: "",
    destaque: true,
    tags: ["anzol", "chinu", "maruseigo"],
  },
  {
    categoria: "anzois",
    nome: "Chicote de aço ou cabo encapado",
    descricao: "O redondo mastiga a linha. Um chicote curto evita perder o peixe (e o anzol) na mordida.",
    link: "",
    tags: ["chicote", "empate"],
  },
  {
    categoria: "iscas",
    nome: "Ração flutuante para peixe (extrusada)",
    descricao: "A isca clássica do pesqueiro. Serve pra cevar e pra iscar na boia de ração.",
    link: "",
    tags: ["ração", "ceva"],
  },
  {
    categoria: "iscas",
    nome: "Massa pronta sabor frutas",
    descricao: "Prática e cheirosa. Boa pra quando o peixe tá manhoso e não quer saber de ração.",
    link: "",
    tags: ["massa", "fruta"],
  },
  {
    categoria: "acessorios",
    nome: "Passaguá grande com rede emborrachada",
    descricao: "É o jeito certo de embarcar peixe grande: boca larga e rede emborrachada, que não arranca escama nem enrosca o anzol. Hulk de 20 kg não cabe em passaguá pequeno.",
    link: "",
    destaque: true,
    tags: ["passaguá", "rede", "pesque-solte", "foto"],
  },
  {
    categoria: "acessorios",
    nome: "Alicate de bico longo para tirar anzol",
    descricao: "Dedo longe da boca do redondo. Confia.",
    link: "",
    tags: ["alicate"],
  },
];
