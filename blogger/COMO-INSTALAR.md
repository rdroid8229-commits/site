# R&N Gráfica Rápida — tema 2.2 e calculadora completa

O pacote inclui o catálogo de 20 serviços, seis artes, três guias originais e os conteúdos de Sobre, Contato e Privacidade. Os novos espaços manuais de publicidade ficam desativados porque a aprovação ainda não foi confirmada e os IDs dos blocos não foram fornecidos. O código de anunciante associado à conta pelo Blogger é independente desses espaços.

## Para adicionar a calculadora ao site já instalado

Siga **CALCULADORA-INSTALAR.txt**. Crie somente a nova página com o título **Calculadora**, usando o código completo de `PAGINAS/07-calculadora.txt` no modo HTML, e confira o endereço `/p/calculadora.html`. O arquivo `PAGINAS/03-privacidade.txt` já inclui a explicação sobre os dados da calculadora; revise e atualize sua página Privacidade. Se deseja preservar personalizações próprias, insira somente `CALCULADORA/PRIVACIDADE-ADICIONAL.txt` na seção de informações tratadas. Depois faça backup do tema e instale o XML 2.2. Não duplique as seis páginas existentes.

Para testar antes, abra `CALCULADORA/RN-Calculadora-Publica.html`. O arquivo não depende do login do ChatGPT. A prévia do site completo também abre a calculadora, mantendo a pasta CALCULADORA ao lado de PREVIA.html. Os cadastros são locais de cada navegador; exporte e importe o backup JSON para transferir dados entre endereços ou dispositivos.

## Reparo opcional de páginas que ainda mostrem código

Primeiro corrija a página Privacidade: em **Páginas → Privacidade**, selecione a visualização HTML, substitua o conteúdo pelo arquivo completo `PAGINAS/03-privacidade.txt`, revise o texto e atualize. Repita nas páginas com código salvo como texto ou fragmentos `/p/...html -->`. Os arquivos novos começam diretamente com `<div class="article-body">`; não há comentário inicial para copiar parcialmente. Preserve as URLs existentes e as alterações próprias que desejar manter.

Depois faça backup do tema atual e instale o XML 2.2. O tema passa a mostrar o conteúdo publicado no Blogger. Se o widget não o entregar, consulta o feed público da própria hospedagem. Falhas ou páginas ausentes exibem uma opção de nova tentativa, sem apresentar uma cópia antiga como se fosse o conteúdo publicado. A prévia offline continua independente.

Se existe uma página extra **Comece aqui** com uma cópia de Sobre, reverta-a para rascunho. O arquivo `COMECE-AQUI.txt` é somente um manual, não uma página a publicar.

## 1. Baixe e visualize

Extraia `RN-Grafica-Rapida-Blogger.zip`. Abra `PREVIA.html` mantendo a pasta `images` ao lado. A prévia permite abrir os guias e as páginas informativas sem instalar nada. O WhatsApp abre a conversa; o pedido só chega à gráfica quando você confirma o envio no aplicativo.

## 2. Publique as seis páginas no Blogger

Entre na sua conta, selecione o blog e abra **Páginas**. A pasta **PAGINAS** contém os códigos e o arquivo **COMECE-AQUI.txt**, com todos os títulos e endereços esperados.

| Título no Blogger | Endereço esperado |
| --- | --- |
| Sobre | `/p/sobre.html` |
| Contato | `/p/contato.html` |
| Privacidade | `/p/privacidade.html` |
| Como escolher o papel | `/p/como-escolher-o-papel.html` |
| Como preparar sua arte | `/p/como-preparar-sua-arte.html` |
| Sublimação e DTF | `/p/sublimacao-e-dtf.html` |

Para cada página:

1. Crie uma nova página ou edite a existente com o mesmo assunto, evitando duplicatas.
2. Use o título exato indicado na tabela.
3. Abra o arquivo `.txt` correspondente em um editor de texto. Ele contém código HTML, não apenas texto para colar visualmente.
4. No editor da página do Blogger, alterne para a visualização HTML, cole o código completo e publique.
5. Confira a URL publicada. Se o Blogger acrescentar um sufixo ou usar outro endereço, os links do tema precisarão ser ajustados. Não deixe páginas de rascunho como destino dos links.

Não cole esses conteúdos no editor de **Tema**, em uma postagem ou em um gadget. Eles são corpos de páginas. O arquivo XML é instalado separadamente.

Revise a política de privacidade para que corresponda ao atendimento e aos serviços realmente utilizados. Não foram inventados endereço, e-mail, CNPJ ou prazos específicos de retenção de documentos. O contato divulgado é o WhatsApp (81) 99609-0928.

## 3. Instale o tema

1. Em **Tema**, faça backup do tema atual no menu ao lado de **Personalizar**.
2. Escolha **Restaurar**, envie **RN-Grafica-Rapida-Blogger.xml** e aguarde a confirmação.
3. Se a opção não estiver disponível, use **Tema → Editar HTML**, substitua o código pelo XML completo e salve.
4. Abra **Ver blog** e atualize a página.

O XML termina com `FIM DO TEMA R&N 2.2`. Ele mantém os estilos em uma tag `style`, inclui as fontes e acrescenta o suporte a páginas estáticas do Blogger. As artes permanecem hospedadas no repositório GitHub; não é necessário enviá-las separadamente.

## 4. Confira

- Início: 20 serviços, seis categorias, busca, perguntas frequentes e orçamento.
- Informações: links Sobre, Contato e Privacidade.
- Guias: links das três orientações e retorno ao catálogo.
- Talões: quantidade de talões separada das 50 a 100 folhas de cada talão.
- Celular: menu, imagens, leitura e formulário sem sair das margens.
- Páginas: conteúdo publicado no Blogger deve aparecer com seu título e texto próprios. A edição no painel tem prioridade sobre a prévia incluída no tema.
- Integração: faça uma pequena edição real em uma página no painel e confirme que ela aparece no site. A leitura do corpo nativo e a consulta ao feed foram testadas localmente; a renderização do widget no servidor precisa ser conferida depois de instalar na conta. Se o feed estiver desativado e a seção continuar vazia, a página exibirá uma opção de nova tentativa. Use a cópia de backup para retornar ao tema anterior se necessário.

## 5. Publicidade depois da aprovação

Consulte **ATIVAR-ADSENSE.txt**. As posições novas ficam ocultas e não exibem caixas vazias. Há uma posição depois dos guias na página inicial e outra ao final dos guias individuais. Não há anúncios flutuantes, no formulário ou nas páginas Sobre, Contato e Privacidade.

A conta, a aprovação, a verificação solicitada pelo Google, eventuais configurações de ads.txt e os requisitos de consentimento são administrados no Google/Blogger. O tema não aprova uma conta nem muda as opções de anúncios automáticos. Só configure IDs públicos reais depois de confirmar o estado da conta.

Criar conteúdo e preparar espaços não garante aprovação ou receita. Antes de solicitar análise, confirme que as páginas estão públicas e que seus links funcionam.

Para gerar outra versão do pacote, execute `npm run build:blogger` na raiz do projeto.
