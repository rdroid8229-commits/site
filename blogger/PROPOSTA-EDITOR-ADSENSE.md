# Proposta de atualização da página Editor de Fotos On-line

**Status: proposta de desenvolvimento; NÃO publicada.** Não substituir o HTML atual da página inteira: o editor incorporado deve permanecer exatamente como está. Não alterar o repositório `rn-photo-editor`.

## Trecho A — inserir ANTES do código atual do editor (modo HTML do Blogger)

```html
<section class="rn-editor-guide" aria-labelledby="rn-editor-title">
  <h1 id="rn-editor-title">Editor de fotos on-line grátis</h1>
  <p>Melhore suas fotografias no navegador com o R&amp;N Photo Editor, ferramenta gratuita da R&amp;N Gráfica Rápida. Abra uma imagem, experimente a melhoria automática, ajuste cores e iluminação e salve o resultado.</p>
  <p>Não é necessário instalar um programa. Para melhores resultados, prefira a fotografia original em boa qualidade e guarde uma cópia antes de editar.</p>
  <h2>Comece a editar sua foto</h2>
  <p>Na ferramenta abaixo, clique em <strong>Abrir imagem</strong> para escolher seu arquivo. Depois, use os controles disponíveis e escolha <strong>Salvar JPG</strong> ou <strong>Salvar PNG</strong>.</p>
</section>
```

## Trecho B — inserir DEPOIS do código atual do editor (modo HTML do Blogger)

```html
<section class="rn-editor-guide" aria-labelledby="rn-editor-howto">
  <h2 id="rn-editor-howto">Como usar o editor de fotos</h2>
  <ol>
    <li><strong>Abra sua fotografia:</strong> clique em Abrir imagem e selecione um arquivo do seu dispositivo.</li>
    <li><strong>Experimente a melhoria automática:</strong> utilize Melhorar automaticamente para obter um ajuste inicial e confira o resultado.</li>
    <li><strong>Faça ajustes manuais:</strong> altere brilho, contraste e saturação aos poucos, observando os detalhes da imagem.</li>
    <li><strong>Compare com o original:</strong> use o recurso de visualizar o original, quando disponível.</li>
    <li><strong>Salve o resultado:</strong> escolha Salvar JPG ou Salvar PNG e confira o arquivo gerado.</li>
  </ol>
  <h2>Para que serve cada ajuste?</h2>
  <h3>Brilho</h3><p>Controla a luminosidade geral. Evite clarear tanto a ponto de apagar detalhes.</p>
  <h3>Contraste</h3><p>Ajusta a diferença entre regiões claras e escuras. Exagerar pode ocultar detalhes nas sombras.</p>
  <h3>Saturação</h3><p>Altera a intensidade das cores. Em retratos, observe se a pele continua com aparência natural.</p>
  <h3>Rotação</h3><p>Ajuda a corrigir a orientação de uma fotografia carregada de lado.</p>
  <h3>Melhoria automática</h3><p>Aplica ajustes iniciais à aparência da imagem, mas não recupera necessariamente detalhes ausentes ou desfocados.</p>
  <h2>Dicas para fotos destinadas à impressão</h2>
  <p>Use o arquivo original sempre que possível. Defina o tamanho final e confira se rostos, textos e elementos importantes não serão cortados. Uma imagem ampliada artificialmente pode continuar com baixa definição no papel.</p>
  <h2>Perguntas frequentes</h2>
  <h3>Preciso instalar algum programa?</h3><p>Não. O editor funciona no navegador compatível.</p>
  <h3>O editor é gratuito?</h3><p>Sim. Os recursos oferecidos nesta página são gratuitos.</p>
  <h3>Posso editar fotografias antigas?</h3><p>Você pode experimentar ajustes de iluminação e cor. Fotos muito danificadas podem precisar de restauração especializada.</p>
  <h3>Posso salvar a imagem editada?</h3><p>Sim. Utilize as opções JPG ou PNG disponibilizadas pela ferramenta.</p>
  <h3>A imagem editada serve para impressão?</h3><p>Depende das dimensões, resolução e qualidade do arquivo original. Confirme o tamanho desejado antes de imprimir.</p>
  <h2>Precisa imprimir suas fotos?</h2>
  <p>A R&amp;N Gráfica Rápida oferece impressão de fotografias. Consulte tamanhos, papéis e disponibilidade pelo canal de contato indicado no site.</p>
</section>
```

## Layout — proposta para teste isolado (não aplicar automaticamente)

A captura de tela mostra o editor estreito e muito espaço lateral. Isso pode decorrer de dimensões fixas do `iframe` no conteúdo da página, e não do tema. **Não modificar o iframe sem inspecionar o HTML atualmente publicado**. Após obter uma cópia desse HTML, testar apenas no ambiente de desenvolvimento: contêiner central com largura máxima confortável; iframe com `width:100%` e altura apropriada; responsividade em 360px, 768px e 1366px. Confirmar rolagem, controles, carregamento e salvamento antes de publicar.

## Checklist antes da publicação

- Fazer cópia do HTML integral da página atual.
- Preservar `iframe`, `src`, atributos de segurança, scripts e identificadores existentes.
- Evitar duplicar o título `h1` caso a página/tema já o renderize.
- Conferir se todos os recursos citados estão realmente presentes no editor publicado.
- Testar computador, tablet e celular; confirmar abertura e salvamento JPG/PNG.
- Não ativar anúncios automáticos em páginas sem conteúdo.
- Solicitar aprovação explícita antes de editar o Blogger.
