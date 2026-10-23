# R&N Gráfica Rápida — tema 2.0

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
