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
  varas:      { titulo: "Varas",                   emoji: "🎣" },
  molinetes:  { titulo: "Molinetes e carretilhas", emoji: "⚙️" },
  linhas:     { titulo: "Linhas",                  emoji: "🧵" },
  anzois:     { titulo: "Anzóis e chicotes",       emoji: "🪝" },
  iscas:      { titulo: "Iscas e ceva",            emoji: "🍈" },
  acessorios: { titulo: "Acessórios",              emoji: "🧰" },
};

const PRODUTOS = [
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
    nome: "Alicate de contenção (boga grip)",
    descricao: "Segura o bicho pela boca sem machucar. Essencial pra foto e pro pesque-solte.",
    link: "",
    destaque: true,
    tags: ["foto", "pesque-solte"],
  },
  {
    categoria: "acessorios",
    nome: "Puçá grande com rede emborrachada",
    descricao: "Rede emborrachada não arranca escama nem enrosca o anzol. Hulk de 20 kg não cabe em puçá pequeno.",
    link: "",
    tags: ["puçá", "rede"],
  },
  {
    categoria: "acessorios",
    nome: "Alicate de bico longo para tirar anzol",
    descricao: "Dedo longe da boca do redondo. Confia.",
    link: "",
    tags: ["alicate"],
  },
];
