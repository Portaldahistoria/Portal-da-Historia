# Portal da História

Acervo didático e laboratório de jogos de História. Site estático publicado em [GitHub Pages](https://portaldahistoria.github.io/Portal-da-Historia/), sem dependências de CDN.

## Estrutura
- `index.html`, `portal.js`: página principal e navegação por hash.
- `grades.js`, `chapter-index.js`: catálogos de capítulos.
- `chapters/`, `chapter-em.html`, `chapter-em.js`: conteúdo e leitura.
- `portal-resources.js`: materiais externos.
- `jogos.html`: seis jogos educativos; `campaign-landscape.js`: cenários de Crônicas de Capivara.
- `img/`, `fonts/`: recursos visuais e fontes locais.
- `sw.js`, `manifest.webmanifest`: PWA e cache offline.

## Adicionar capítulos
1. Identifique o ano e o número do capítulo.
2. Siga o formato dos capítulos existentes no catálogo correspondente: `grades.js` para o Fundamental, `chapter-index.js` para o 1º ano do Médio.
3. Crie ou atualize o conteúdo correspondente, seguindo o padrão de leitura do ano. Confira os links e as rotas por hash.
4. Inclua novos arquivos locais necessários no cache de `sw.js`; não deixe caminhos inexistentes na lista obrigatória.
5. Atualize as versões dos scripts afetados no HTML e a constante VERSION do service worker.

## Publicação e testes
As mudanças são registradas no GitHub. Confira o status do deploy de Pages antes de testar o endereço público.
- Teste navegação entre início, capítulos, jogos e retorno ao acervo.
- Teste cada jogo com teclado e toque, em desktop e celular.
- Teste Crônicas: capa, escolha de personagem, mapa, fase, retorno à galeria.
- Teste a instalação PWA e o modo offline após carregar os recursos.
- Use Ctrl+F5 para verificar a versão nova; não apague dados locais dos jogadores sem necessidade.
- Revise novos conteúdos históricos antes de publicar.
- Não exclua pastas antigas antes de verificar referências e dependências.

## Cache
Ao modificar `jogos.html`, incremente o parâmetro `v` da URL incorporada em `portal.js`, a versão de `portal.js` em `index.html` e VERSION em `sw.js`. Faça alterações pequenas e verificáveis; use o histórico Git para recuperar versões estáveis.

## Identidade visual
Preserve o vinho #861b23, títulos Anton, personagens Gabi e Gio, arte pixel e o fundo claro do portal. Evite modificar a campanha junto de mudanças extensas em outros jogos.
