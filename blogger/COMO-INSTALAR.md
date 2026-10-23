# Instalar o tema 2.0 da R&N no Blogger

1. Baixe `RN-Grafica-Rapida-Blogger.zip` do repositório GitHub e extraia os arquivos.
2. Acesse https://www.blogger.com/ e selecione o blog da R&N.
3. Abra **Tema** e faça backup do tema atual no menu ao lado de **Personalizar**.
4. Nesse menu, escolha **Restaurar** e envie **RN-Grafica-Rapida-Blogger.xml**.
5. Aguarde a confirmação, clique em **Ver blog** e atualize a página.

Se a opção de restauração não estiver disponível, use **Tema → Editar HTML** e substitua o código pelo conteúdo completo do XML. Salve. Não cole o tema em uma postagem, página ou gadget. O arquivo termina com `FIM DO TEMA R&N 2.0`.

## Antes de instalar

Abra **PREVIA.html** do ZIP mantendo a pasta **images** ao lado. Essa prévia inclui as fontes e as seis artes para ver o visual sem instalar nada no Blogger. Os botões de WhatsApp abrem a conversa; o pedido só é enviado quando você toca em Enviar no aplicativo.

## O que mudou

- 20 opções de produtos e serviços em 6 categorias, começando por impressões e xerox.
- Uma arte da R&N por categoria.
- Filtros por categoria e busca que reconhece palavras com ou sem acentos.
- Um botão de orçamento para cada serviço e para cada categoria.
- Campos que distinguem a quantidade de peças, folhas, documentos, talões e atendimentos.
- Talões de recibos de aluguel com 50 a 100 folhas por talão.
- Bloqueio de nomes vazios ou contendo apenas espaços e de quantidades inválidas.
- Menu no celular, perguntas frequentes e contatos com o número (81) 99609-0928.
- Ícones SVG, evitando setas que aparecem como quadradinhos em alguns dispositivos.

## Depois de instalar

Confira se aparecem 20 serviços e 6 categorias. Teste uma busca, um filtro e o orçamento de um talão. No formulário, confira a quantidade de talões e o número de folhas por talão. Abra o WhatsApp e confira o resumo antes de enviar. Veja também a versão no celular e os endereços com `?m=1` e `?m=0`.

As artes são ilustrativas e usam a identidade da R&N. No Blogger, são carregadas do repositório GitHub informado no tema; não é necessário subir as imagens separadamente. Não apague essas imagens do repositório enquanto houver temas que dependam delas.

Este tema apresenta uma página de produtos e serviços e não lista postagens, comentários ou gadgets de um blog tradicional. Instalar o XML é uma ação feita na sua conta; enviar arquivos ao GitHub não altera o Blogger.

Para gerar outra versão, altere o catálogo e os estilos e execute `npm run build:blogger` na raiz do projeto.
