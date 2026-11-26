# Crônicas de Capivara — aplicativo independente

O endereço `cronicas/` abre diretamente o menu do jogo. O motor e as imagens são compartilhados com o Laboratório de Jogos; não há uma segunda campanha para manter. No navegador, o progresso existente é compartilhado quando o navegador disponibiliza o mesmo armazenamento da origem. O APK tem armazenamento próprio.

## Instalação web

Abra `cronicas/` pelo Chrome, Edge ou Safari e use `Instalar jogo` ou o menu do navegador. No iPhone/iPad, use Compartilhar → Adicionar à Tela de Início. Aguarde a indicação de disponibilidade offline antes de desconectar.

## Atualizações

Ao modificar o jogo, altere também a versão do cache em `cronicas/sw.js` e a versão das referências em `cronicas/index.html`. Adicione novas imagens à lista de recursos do worker. O cache exclusivo mantém uma versão consistente do jogo e não apaga o cache do Portal. Execute `node --test tests/cronicas-app.test.cjs tests/nile-boss.test.cjs`.

## APK Android

`android-cronicas/` contém uma atividade WebView com pacote independente e recursos locais. O workflow `Build Crônicas Android` gera um APK de teste com os arquivos do jogo incorporados e verifica a assinatura. Ele está disponível como artefato de execução quando a compilação termina com sucesso. A chave descartável de teste não é adequada para atualizações distribuídas aos alunos; para uma versão oficial será necessária uma assinatura persistente e validação em dispositivo Android. Não publicar um link de download de APK antes de confirmar a compilação e os testes.
