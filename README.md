# Site dos Tamba 🎣

Wiki com recomendações de equipamentos para pescaria de **tambaqui** e **tambacu**, com links de afiliado do Mercado Livre.

## Objetivo

Reunir em um só lugar dicas e indicações de equipamentos testados para a pesca desses peixes redondos, como varas, molinetes e carretilhas, linhas, anzóis, iscas e acessórios. Cada indicação traz um link de afiliado do Mercado Livre.

## Estrutura planejada

- **Varas**: ação, comprimento e libragem indicados
- **Molinetes e carretilhas**: capacidade de linha e drag
- **Linhas e multifilamentos**
- **Anzóis, chicotes e empates**
- **Iscas e cevas**: ração, massas, frutas
- **Acessórios**: alicates, puçás, caixas e bolsas

## Aviso de afiliados

Alguns links deste site são de afiliado do Mercado Livre. Se você comprar por eles, o site pode receber uma comissão, sem custo extra para você.

## Como adicionar ou editar um link de afiliado

Tudo fica no arquivo **`produtos.js`**. Cada produto é um bloco assim:

```js
{
  categoria: "varas",
  nome: "Vara de carbono 1,80 m, 20–40 lb",
  descricao: "Por que você recomenda.",
  link: "https://mercadolivre.com/sec/SEU-LINK",
  destaque: true, // opcional: selo "Escolha do Hulk"
},
```

Enquanto `link` estiver vazio (`""`), o botão do card mostra "Link em breve". Dá pra editar direto pelo GitHub: abra `produtos.js`, clique no lápis, troque o link e salve (commit). O site atualiza sozinho em cerca de 1 minuto.

## Publicar de graça no GitHub Pages

1. No GitHub, vá em **Settings → Pages**.
2. Em *Source*, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
3. Em alguns minutos o site fica em `https://mateuscoelho07-debug.github.io/site-dos-tamba/`.

## Arquivos

- `index.html`: página, dicionário de gírias e dicas
- `produtos.js`: lista de equipamentos e links (o único arquivo que você precisa mexer)
- `app.js`: monta os cards, busca e filtros
- `style.css`: visual e animação do tambaqui
