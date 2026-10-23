# R&N Gráfica Rápida — tema 2.1 e páginas informativas

O pacote inclui o catálogo de 20 serviços, seis artes, três guias originais e os conteúdos de Sobre, Contato e Privacidade. Os novos espaços manuais de publicidade ficam desativados porque a conta AdSense ainda não foi aprovada e os IDs não foram fornecidos.

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

O XML termina com `FIM DO TEMA R&N 2.1`. Ele mantém os estilos em uma tag `style`, inclui as fontes e acrescenta o suporte a páginas estáticas do Blogger. As artes permanecem hospedadas no repositório GitHub; não é necessário enviá-las separadamente.

## 4. Confira

- Início: 20 serviços, seis categorias, busca, perguntas frequentes e orçamento.
- Informações: links Sobre, Contato e Privacidade.
- Guias: links das três orientações e retorno ao catálogo.
- Talões: quantidade de talões separada das 50 a 100 folhas de cada talão.
- Celular: menu, imagens, leitura e formulário sem sair das margens.
- Páginas: conteúdo publicado no Blogger deve aparecer com seu título e texto próprios. A edição no painel tem prioridade sobre a prévia incluída no tema.

## 5. Publicidade depois da aprovação

Consulte **ATIVAR-ADSENSE.txt**. As posições novas ficam ocultas e não exibem caixas vazias. Há uma posição depois dos guias na página inicial e outra ao final dos guias individuais. Não há anúncios flutuantes, no formulário ou nas páginas Sobre, Contato e Privacidade.

A conta, a aprovação, a verificação solicitada pelo Google, eventuais configurações de ads.txt e os requisitos de consentimento são administrados no Google/Blogger. O tema não aprova uma conta nem muda as opções de anúncios automáticos. Só configure IDs públicos reais depois de confirmar o estado da conta.

Criar conteúdo e preparar espaços não garante aprovação ou receita. Antes de solicitar análise, confirme que as páginas estão públicas e que seus links funcionam.

Para gerar outra versão do pacote, execute `npm run build:blogger` na raiz do projeto.
