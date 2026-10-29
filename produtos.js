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
  {
    categoria: "indicados",
    nome: "Molinete Shimano IX 4000R (fricção traseira)",
    descricao: "Shimano de entrada que não deixa na mão: mais de 10 mil vendidos e nota 4.8. A fricção fica atrás, então dá pra soltar ou apertar o drag no meio da briga sem enfiar a mão perto da linha. Arraste de até 6,8 kg: com calma no drag, cansa até hulk grande.",
    link: "https://meli.la/2xc1usP",
    destaque: true,
    tags: ["molinete", "shimano", "fricção traseira", "drag", "iniciante"],
  },
  {
    categoria: "indicados",
    nome: "Vara Albatroz Missouri 2,10 m, 40 lb, para carretilha",
    descricao: "Fibra de vidro maciça: verga até a ponta e não quebra fácil, perfeita pra quem tá começando e ainda erra a mão no drag. Os 2,10 m dão alavanca e arremesso longe pra alcançar o cardume no meio do tanque. Custo-benefício raiz pro pesqueiro.",
    link: "https://meli.la/2REMDbi",
    tags: ["vara", "carretilha", "fibra maciça", "iniciante", "pesqueiro"],
  },
  {
    categoria: "indicados",
    nome: "Vara Albatroz Missouri 2,10 m, 40 lb, para molinete",
    descricao: "A mesma Missouri parruda, agora pra quem é time molinete. Mais de mil vendidas: aguenta pancada de redondo, perdoa erro e cabe no bolso. Combina certinho com o Shimano IX daqui da lista.",
    link: "https://meli.la/2LjrnZ2",
    destaque: true,
    tags: ["vara", "molinete", "fibra maciça", "iniciante", "kit"],
  },
  {
    categoria: "indicados",
    nome: "Vara Marine Sports Giant Catfish 1,98 m, 60–120 lb, para carretilha",
    descricao: "Arma de pegar monstro. Carbono, ação rápida e resistência de até 120 lb: feita pra bagre gigante, então segura hulk de 20 kg e verdão bitelo sem tremer. Leve na mão e com a fisgada na hora. É pra quem já pesca e quer subir de nível.",
    link: "https://meli.la/1gFFBtq",
    destaque: true,
    tags: ["vara", "carretilha", "carbono", "pesada", "bitelo", "hulk"],
  },
  {
    categoria: "indicados",
    nome: "Vara Maruri Austin Tamba 1,80 m, 60 lb, para carretilha",
    descricao: "Tem \"Tamba\" no nome e não é à toa: vara de pesqueiro feita pro redondo. 60 lb, ação rápida pra cravar o anzol na boca dura do tambaqui e 1,80 m que não atrapalha no tanque cheio de gente. A ponteira laranja ajuda a ver a beliscada.",
    link: "https://meli.la/29M6spj",
    tags: ["vara", "carretilha", "tamba", "pesqueiro", "ação rápida"],
  },
  {
    categoria: "indicados",
    nome: "Vara Maruri Austin Tamba 1,80 m, 60 lb, para molinete",
    descricao: "A Austin Tamba na versão molinete: mesma força de 60 lb, ação rápida e fibra de vidro que aguenta tranco. Bota um molinete 4000 nela e vai pro tanque buscar o verdão.",
    link: "https://meli.la/1VCrfmX",
    tags: ["vara", "molinete", "tamba", "pesqueiro", "ação rápida"],
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
