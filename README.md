# R&N Gráfica Rápida — tema 2.2

Site responsivo em português com 20 produtos e serviços organizados em seis categorias, busca, artes exclusivas da R&N e orçamento pelo WhatsApp **(81) 99609-0928**.

## Catálogo

1. **Impressões e cópias:** impressões e xerox em papel ofício; impressões em papel fotográfico, papel adesivo e papel-cartão.
2. **Plastificação:** documentos e folhas A4 inteiras.
3. **Papelaria e documentos:** cartões de visita; talões de recibos de aluguel de 50 a 100 folhas; contratos de aluguel; declarações de residência.
4. **Comunicação visual:** cartazes A4 e banners.
5. **Agendamentos:** apoio para agendamento no CRAS, para identidade e para título de eleitor, conforme disponibilidade do órgão responsável.
6. **Personalizados e estampas:** canecas, camisas, estampas personalizadas, sublimação total e estampas em DTF.

O formulário distingue folhas, documentos, talões, unidades, peças e atendimentos. Para talões, o número de folhas é um campo separado que aceita inteiros de 50 a 100. Nomes contendo apenas espaços e quantidades inválidas são rejeitados. Não há cálculo de preço nem reserva automática: o cliente envia o resumo pelo WhatsApp e confirma valor, prazo e disponibilidade no atendimento.

## Desenvolvimento

Requer Node.js 20.19+ ou >=22.12+ e npm; validado com Node.js 24.19.0. A exportação do ZIP usa Python 3, sem dependências adicionais.

```sh
cd /workspace/site
npm --cache /workspace/.npm-cache ci
npm run dev -- --port 5173 --strictPort
```

O projeto usa JavaScript, CSS e Vite. Dados do catálogo: `src/catalog.js`. Contato: `src/site.config.js`. Layout: `src/style.css`. As artes ilustrativas estão em `public/images`, com nomes baseados no conteúdo. Elas mostram a identidade R&N e não são fotografias de trabalhos realizados. As fontes são distribuídas com suas licenças OFL.

## Build e Blogger

```sh
npm run build
npm run build:blogger
```

O primeiro comando gera a versão estática em `dist`. O segundo gera o XML e o ZIP em `blogger/downloads`, a partir dos mesmos arquivos do site, incluindo fontes e uma prévia independente. A pasta `images` do ZIP acompanha a prévia.

No Blogger, as imagens usam URLs públicas configuradas em `.env.blogger`. Os arquivos correspondentes precisam estar publicados no repositório indicado. Preserve imagens antigas referenciadas por temas já instalados. É possível alterar essa base para outra hospedagem HTTPS ao gerar o tema.

Instruções de instalação: [blogger/COMO-INSTALAR.md](blogger/COMO-INSTALAR.md). O arquivo a instalar é `blogger/downloads/RN-Grafica-Rapida-Blogger.xml`. Gerar ou publicar arquivos no GitHub não altera o blog: o usuário precisa instalar o XML na própria conta.

## Validação funcional

Neste ambiente, Python Playwright e `/usr/bin/chromium` estão disponíveis. Com o servidor de desenvolvimento ativo:

```sh
python3 tests/smoke.py
python3 tests/smoke.py --theme blogger/downloads/RN-Grafica-Rapida-Blogger.xml
```

O segundo comando simula localmente a resposta HTML do Blogger e fornece as artes locais às URLs configuradas. Os testes cobrem catálogo, busca, todos os filtros e botões de serviço, orçamento, quantidades, talões, WhatsApp, cópia, edição, perguntas frequentes, menu móvel e margens de 320 a 1440 pixels. As navegações ao WhatsApp são interceptadas: nenhuma mensagem é enviada. Verifique também as URLs públicas das artes após enviá-las ao GitHub e a instalação final no Blogger.

## Páginas e preparação para publicidade — versão 2.1

O tema preserva os 20 serviços e acrescenta uma área editorial, Sobre, Contato, Privacidade e três guias originais. Os contatos publicados continuam limitados ao nome da gráfica e ao WhatsApp, conforme solicitado.

- Conteúdo: `src/page-content.js`; rotas e navegação: `src/pages.js`.
- Páginas exportadas: `blogger/paginas`, incluídas no ZIP em `PAGINAS`.
- Publicação nativa: criar/editar as seis páginas no painel do Blogger usando os títulos, os códigos HTML e as URLs esperadas em `PAGINAS/COMECE-AQUI.txt`. O tema renderiza `post.title` e `post.body` nas páginas estáticas por meio de um widget Blog1 dedicado. O conteúdo editado no Blogger tem prioridade sobre o conteúdo de prévia.
- A prévia do ZIP permite navegar pelos guias e pelas páginas com links internos, sem publicá-los. As URLs nativas só passam a existir depois de criar as páginas na conta do Blogger.
- Publicidade: `src/ads.config.js` mantém `enabled: false`, sem IDs. Não foi reutilizado o código de anunciante eventualmente injetado pelo Blogger. Há duas posições editoriais ocultas, fora do formulário e dos botões de serviço. Sobre, Contato e Privacidade não recebem o bloco de artigo.
- Antes de ativar os blocos: confirmar a aprovação, configurar os IDs públicos reais e os requisitos de privacidade/consentimento indicados pelo Google. Não existe garantia de aprovação nem de receita. Os blocos manuais do tema são independentes dos anúncios automáticos administrados no Blogger.

Validação adicional:

```sh
node --test tests/ads.test.mjs
node --test tests/published-pages.test.mjs
python3 tests/content.py
```

O teste de conteúdo confere as seis páginas, navegação, orçamento nas páginas informativas, prévia e suporte ao conteúdo nativo do Blogger por uma resposta renderizada simulada. A aceitação final do tema e a publicação das páginas na conta continuam dependendo da instalação pelo usuário. As páginas de privacidade devem ser revisadas pelo responsável para corresponder ao atendimento e às ferramentas efetivamente utilizados.

## Correção da integração — versão 2.1.1

O backup exportado pelo Blogger confirma que Blog1 estava visível, mas o HTML público continha uma seção nativa vazia. O widget agora declara `var="this"`, acessa `data:this.posts` e mantém sua seção registrada em todas as telas. A confirmação da renderização no servidor ainda depende de instalar o XML atualizado na conta; os testes locais não executam o motor do Blogger.

Se a seção vier vazia, `src/published-pages.js` consulta o feed público de páginas na própria origem, sem cookies. Título e corpo publicados passam a ser a fonte do conteúdo; o tema não usa os textos de demonstração para esconder uma página ausente ou uma falha. A demonstração permanece disponível apenas na prévia e no desenvolvimento. Nenhum arquivo de backup enviado pelo usuário é distribuído no repositório ou ZIP.

Os arquivos de colagem começam diretamente com a tag `div`, sem comentários de instrução. O manual orienta corrigir as páginas antes de instalar a atualização, para evitar que código salvo como texto passe a aparecer no site. Preserve as edições próprias que desejar manter e confira a política de privacidade. Os blocos manuais de anúncios continuam desativados, independentemente do código associado à conta pelo Blogger.

## Calculadora completa — versão 2.2

`calculator/source.html` é o arquivo correto enviado pelo proprietário, com encaixe de peças, preço por m² e custos/preços/lucros. `scripts/export-calculator.mjs` gera a versão pública independente em `public/calculadora.html` e o corpo da página Blogger em `blogger/paginas/07-calculadora.txt`. A calculadora não depende de servidor nem de login; os dados são locais de cada navegador. A cópia pública mantém as fórmulas e os quatro preços originais por m².

A página usa um iframe com `srcdoc`, que executa o aplicativo completo mesmo quando o corpo da página é inserido pelo leitor de páginas do tema. Os estilos ficam dentro do quadro. A altura acompanha as três áreas, inclusive o quadro interno de custos. A prévia do ZIP aponta para `CALCULADORA/RN-Calculadora-Publica.html`; a página pública leva o próprio aplicativo no seu HTML e não depende de hospedagem externa. O conteúdo não contém cadastros reais de materiais ou clientes do proprietário.

O menu, o rodapé e a chamada abaixo dos guias apontam para `/p/calculadora.html`. Essa página precisa ser publicada na conta; instalar o XML não a cria. Instruções para atualização sem duplicar as seis páginas existentes: `blogger/CALCULADORA-INSTALAR.txt`. Um parágrafo adicional de privacidade acompanha o pacote. Faça backup JSON no endereço antigo para transferir os cadastros ao novo domínio.

Para evitar baixar a página maior em todas as outras páginas, o XML inclui o ID da página fornecido pelo Blogger. O leitor consulta uma única entrada pública quando há um ID válido, com retorno à listagem apenas quando esse ID não está disponível. O caminho individual foi conferido com uma página pública existente do blog; a presença desse ID no modelo atualizado depende da instalação no Blogger.

Validação da calculadora, depois de gerar o pacote:

```sh
node --test tests/calculator.test.mjs tests/published-pages.test.mjs tests/ads.test.mjs
python3 tests/calculator.py
```

Os testes conferem fórmulas conhecidas, entradas inválidas, funcionamento dos três módulos dentro de uma página com HTML de feed, controles, cópia, acionamento de impressão, cadastro e atualização de insumos, backup JSON, persistência e separação entre visitantes. Também conferem as larguras de 320 a 1440 px, a altura dos dois quadros e os caminhos do ZIP extraído. O navegador do ambiente bloqueia `file://`; os bytes locais da versão independente e do ZIP são executados por respostas HTTPS simuladas, sem autenticação nem serviço externo da calculadora. A publicação e a aceitação final pelo editor do Blogger precisam ser conferidas após instalar na conta.
