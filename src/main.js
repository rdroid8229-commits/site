import './fonts.css';
import './style.css';
import './navigation.css';
import { business } from './site.config.js';
import { categories, services, contactText } from './catalog.js';
import { guides, pageHref, currentPage, isPreview, isBloggerPage } from './pages.js';
import { loadPublishedPage } from './published-pages.js';
import { initAds } from './ads.js';
const nativePage = document.querySelector('[data-native-page]');
const hasNativePage = Boolean(nativePage?.querySelector('h1')?.textContent.trim());

const paths = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  external: '<path d="M6 18 18 6M6 6h12v12"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z"/><path d="M8 8c1 4 3 6 7 7l1-2-3-1-1 1M8 8l2-1 1 3-1 1"/>',
  print: '<path d="M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v7H6zM17 11h1"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  document: '<path d="M5 3h10l4 4v14H5V3Zm9 0v5h5M8 12h8M8 16h8"/>',
  banner: '<path d="M5 3h14v15H5zM8 7h8M8 11h8M12 18v3M8 21h8"/>',
  calendar: '<path d="M4 5h16v16H4zM8 3v4M16 3v4M4 10h16m-12 4 3 3 5-5"/>',
  shirt: '<path d="m8 3-5 4 3 5 2-1v10h8V11l2 1 3-5-5-4c-1 4-7 4-8 0Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
};
const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
const wa = (message = '') => `https://wa.me/${business.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
const brand = () => `<span class="brand-word">R<span>&amp;</span>N<span class="brand-dot">.</span></span><span class="brand-caption">GRÁFICA<br>RÁPIDA</span>`;
const contactLink = (label = 'Conversar no WhatsApp', className = 'button button-dark') => `<a class="${className}" href="${wa('Olá! Gostaria de informações sobre os produtos e serviços da R&N Gráfica Rápida.')}" target="_blank" rel="noopener noreferrer">${icon('chat')}${label}${icon('external')}</a>`;

 document.querySelector('#app').innerHTML = `
<a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
<header class="header"><div class="wrap header-inner">
  <a href="#servicos" class="brand" aria-label="R&N Gráfica Rápida — início">${brand()}</a>
  <nav class="nav" id="main-nav" aria-label="Navegação principal">
  <details class="nav-group"><summary>Serviços</summary><div class="nav-submenu">
    <a href="#servicos">Todos os serviços</a>
    <a href="#como-pedir">Como pedir</a>
    <a href="#duvidas">Dúvidas frequentes</a>
  </div></details>
  <details class="nav-group"><summary>Ferramentas</summary><div class="nav-submenu">
    <a href="https://rngraficarapida.blogspot.com/p/editor-de-fotos-on-line.html">Editor de fotos online</a>
  </div></details>
  <details class="nav-group"><summary>Informações</summary><div class="nav-submenu">
    <a href="#guias">Guias úteis</a>
    <a href="${pageHref('sobre')}">Sobre a gráfica</a>
    <a href="${pageHref('contato')}">Contato</a>
    <a href="${pageHref('privacidade')}">Privacidade</a>
  </div></details>
</nav>
  <button class="button button-dark header-quote" data-quote>${icon('chat')}Pedir orçamento</button>
  <button class="menu-toggle" aria-controls="main-nav" aria-expanded="false" aria-label="Abrir menu">${icon('menu')}</button>
</div></header>
<main id="conteudo"><div id="home-view">
<section class="wrap catalog section" id="servicos">
 <div class="section-heading"><div><div class="eyebrow">ENCONTRE O QUE VOCÊ PRECISA</div><h2>Seus projetos.<br class="mobile-only"> <em>Nossas soluções.</em></h2></div><p>Escolha a categoria, encontre o serviço<br class="desktop-only"> e peça um orçamento sem complicação.</p></div>
 <div class="catalog-toolbar"><div class="filters" role="group" aria-label="Categorias de produtos e serviços"><button class="filter active" data-category="todos" aria-pressed="true">Todos os serviços<span>20</span></button>${categories.map(c => `<button class="filter" data-category="${c.id}" aria-pressed="false">${c.short}</button>`).join('')}</div><div class="search-box"><label for="service-search" class="sr-only">Buscar produto ou serviço</label>${icon('search')}<input id="service-search" type="search" placeholder="Busque por xerox, canecas, CRAS…" maxlength="100" autocomplete="off"><button class="clear-search" aria-label="Limpar busca" hidden>${icon('close')}</button></div></div>
 <div class="catalog-status"><p id="catalog-count" role="status" aria-live="polite"></p><span>Artes ilustrativas criadas para a R&N.</span></div>
 <div id="catalog-grid" class="category-grid"></div>
 <div class="empty-state" hidden><span>${icon('search')}</span><h3>Vamos encontrar sua solução?</h3><p>Nenhum serviço corresponde a essa busca. Tente outro termo ou fale com a gente.</p><button class="button button-dark" id="reset-filters">Ver todos os serviços ${icon('arrow')}</button></div>
 <div class="catalog-bottom"><p>Tem uma ideia diferente ou ainda está com dúvidas?</p>${contactLink('Conte para a gente', 'text-link')}</div>
</section>
<section class="process-section" id="como-pedir"><div class="wrap section"><div class="section-heading"><div><div class="eyebrow">DO PEDIDO AO ATENDIMENTO</div><h2>Simples do <em>início ao fim.</em></h2></div><p>Uma boa conversa é o primeiro passo.</p></div><div class="steps"><article><div class="step-label">01 ${icon('search')}</div><h3>Escolha o que precisa</h3><p>Explore as categorias ou busque pelo nome do produto ou serviço.</p></article><article><div class="step-label">02 ${icon('document')}</div><h3>Informe os detalhes</h3><p>Diga a quantidade de peças, folhas ou atendimentos e conte sua ideia.</p></article><article><div class="step-label">03 ${icon('chat')}</div><h3>Converse pelo WhatsApp</h3><p>Envie o resumo do pedido. Confirmaremos valor, prazo e próximos passos.</p></article></div></div></section>
<section class="wrap section editorial-section" id="guias"><div class="about-teaser"><div><div class="eyebrow">SOBRE A R&N</div><h2>Soluções para sua rotina.<br><em>Cuidado com sua ideia.</em></h2></div><div><p>Da cópia de um documento à personalização de uma peça, encontre nossos serviços e converse com a gente sobre o que precisa. Quantidade, material, valor e prazo são alinhados no atendimento.</p><a class="text-link" href="${pageHref('sobre')}">Conheça a gráfica ${icon('arrow')}</a></div></div><div class="section-heading guide-heading"><div><div class="eyebrow">INFORMAÇÃO QUE AJUDA A ESCOLHER</div><h2>Antes de imprimir, <em>entenda.</em></h2></div><p>Guias práticos para preparar seu pedido<br class="desktop-only"> e esclarecer as dúvidas mais comuns.</p></div><div class="guide-grid">${guides.map((guide, index) => `<article class="guide-card"><a href="${pageHref(guide.slug)}" class="guide-image-link" aria-label="Ler: ${guide.title}"><img src="${guide.image}" alt="Arte ilustrativa R&N Gráfica para o guia ${guide.title}." width="1080" height="720" loading="lazy"></a><div class="guide-card-content"><span class="eyebrow">GUIA ${String(index+1).padStart(2,'0')}</span><h3><a href="${pageHref(guide.slug)}">${guide.title}</a></h3><p>${guide.description}</p><a class="text-link" href="${pageHref(guide.slug)}">Ler o guia ${icon('arrow')}</a></div></article>`).join('')}</div><aside class="ad-region" data-ad-position="home" aria-label="Publicidade" hidden><span>Publicidade</span></aside></section>
<section class="wrap section faq-section" id="duvidas"><div class="faq-intro"><div class="eyebrow">PODE PERGUNTAR</div><h2>Antes de pedir,<br><em>tire suas dúvidas.</em></h2><p>Nosso atendimento ajuda você a escolher o serviço e organizar os detalhes.</p>${contactLink('Tirar uma dúvida', 'text-link')}</div><div class="faq-list"><details><summary>Como faço para pedir um orçamento? ${icon('chevron')}</summary><p>Clique no serviço desejado, informe a quantidade e preencha os detalhes. O site prepara um resumo para você enviar pelo WhatsApp. O valor e o prazo serão confirmados no atendimento.</p></details><details><summary>Posso enviar a arte pelo WhatsApp? ${icon('chevron')}</summary><p>Sim. Na conversa, você pode enviar sua arte e explicar o que deseja produzir. Se ainda não tiver a arte, informe isso no pedido para consultar as opções.</p></details><details><summary>Quantas folhas podem ter os talões de recibos? ${icon('chevron')}</summary><p>Os talões de recibos de aluguel podem ter de 50 a 100 folhas. No orçamento, informe quantos talões deseja e a quantidade de folhas por talão.</p></details><details><summary>Como funciona o apoio em agendamentos? ${icon('chevron')}</summary><p>Prestamos apoio para agendamentos no CRAS e para atendimentos relacionados à identidade e ao título de eleitor. Consulte as informações necessárias pelo WhatsApp. As vagas dependem do órgão responsável.</p></details></div></section>
<section class="wrap contact-band" id="contato"><div><div class="eyebrow">R&N GRÁFICA RÁPIDA</div><h2>Seu próximo pedido<br>começa com <em>uma conversa.</em></h2><p>${contactText}</p></div><div class="contact-band-actions">${contactLink()}<a class="phone-link" href="${wa()}" target="_blank" rel="noopener noreferrer">(81) 99609-0928</a></div></section>
</div><section class="wrap article-view" id="article-view" hidden aria-label="Informações da gráfica"><nav class="article-breadcrumb" aria-label="Localização"><a href="/">Início</a><span aria-hidden="true">/</span><span id="article-breadcrumb-title"></span></nav><div id="article-content" class="article-content"></div><aside class="ad-region" data-ad-position="article" aria-label="Publicidade" hidden><span>Publicidade</span></aside><div class="article-back"><a href="/#servicos" class="text-link">Voltar aos produtos e serviços ${icon('arrow')}</a></div></section></main>
<footer class="wrap footer"><div class="footer-top"><a class="brand" href="#servicos" aria-label="Voltar ao início">${brand()}</a><p>Impressões, soluções e ideias<br>com a sua identidade.</p><nav aria-label="Navegação do rodapé"><a href="#servicos">Produtos e serviços</a><a href="#como-pedir">Como pedir</a><a href="${pageHref('sobre')}">Sobre</a><a href="${pageHref('contato')}">Contato</a><a href="${pageHref('privacidade')}">Privacidade</a></nav></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} R&N Gráfica Rápida.</span><span>Do seu jeito. Com o nosso cuidado.<span class="cmyk"><i></i><i></i><i></i><i></i></span></span></div></footer>
<aside class="floating-contact" aria-label="Atendimento pelo WhatsApp"><span>Orçamentos e dúvidas</span><a href="${wa('Olá! Quero pedir um orçamento e informar a quantidade de peças ou o serviço desejado.')}" target="_blank" rel="noopener noreferrer">${icon('chat')} WhatsApp ${icon('external')}</a></aside>
<dialog class="quote-dialog" aria-labelledby="quote-title"><button class="dialog-close" aria-label="Fechar orçamento">${icon('close')}</button><div class="eyebrow">CONTE PARA A GENTE</div><h2 id="quote-title">Vamos preparar<br><em>seu orçamento?</em></h2><p class="dialog-intro">Informe a quantidade de peças ou o serviço desejado. O resumo será aberto no WhatsApp.</p><form id="quote-form"><label for="customer-name">Seu nome</label><input id="customer-name" name="name" autocomplete="name" required maxlength="100" placeholder="Como podemos chamar você?"><label for="quote-service">Produto ou serviço</label><select id="quote-service" name="service" required></select><div class="form-row"><div><label for="quantity" id="quantity-label">Quantidade</label><input id="quantity" name="quantity" type="number" min="1" max="1000000" step="1" value="1" required></div><div id="receipt-field" hidden><label for="receipt-pages">Folhas por talão</label><input id="receipt-pages" name="pages" type="number" min="50" max="100" step="1" value="50" disabled><span class="field-hint">Mínimo: 50. Máximo: 100.</span></div><div id="size-field"><label for="quote-size">Tamanho ou formato <span>(opcional)</span></label><input id="quote-size" name="size" maxlength="120" placeholder="Ex.: A4, medidas ou tamanhos"></div></div><label for="quote-details">Mais detalhes <span>(opcional)</span></label><textarea id="quote-details" name="details" rows="3" maxlength="2000" placeholder="Conte o que precisa. Se já tiver uma arte ou uma data em mente, informe aqui."></textarea><p class="quote-notice">Valor, disponibilidade e prazo serão confirmados no atendimento. O pedido só é enviado quando você toca em Enviar no WhatsApp.</p><button type="submit" class="button button-pink submit-quote">Preparar pedido no WhatsApp ${icon('arrow')}</button></form><section id="quote-result" hidden aria-label="Resumo do pedido"><div class="result-check">${icon('check')}</div><h3>Seu resumo está pronto.</h3><p>Confira os detalhes e toque em Enviar na conversa do WhatsApp. Se a conversa não abrir, use o botão abaixo.</p><textarea id="message-preview" rows="9" readonly aria-label="Resumo do pedido"></textarea><a id="send-whatsapp" class="button button-pink" target="_blank" rel="noopener noreferrer">${icon('chat')} Abrir WhatsApp ${icon('external')}</a><div class="result-actions"><button class="text-link" id="copy-quote">Copiar resumo</button><button class="text-link" id="edit-quote">Editar pedido</button></div><p id="copy-status" role="status" aria-live="polite"></p></section></dialog>
<dialog class="details-dialog" aria-labelledby="details-title"><div class="details-panel"><button type="button" class="details-close" aria-label="Fechar detalhes">${icon('close')}</button><div class="eyebrow">CONHEÇA NOSSO SERVIÇO</div><h2 id="details-title"></h2><p id="details-summary"></p><div id="details-content"></div><button type="button" class="button button-pink" id="details-quote">${icon('chat')} Solicitar orçamento pelo WhatsApp</button></div></dialog>
`;

let selectedCategory = 'todos';
const search = document.querySelector('#service-search');
const grid = document.querySelector('#catalog-grid');
const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
function renderCatalog() {
  const query = normalize(search.value);
  const filtered = services.filter(s => (selectedCategory === 'todos' || s.category === selectedCategory) && (!query || normalize(`${s.name} ${s.description} ${categories.find(c => c.id === s.category).name}`).includes(query)));
  const shownCategories = categories.filter(c => filtered.some(s => s.category === c.id));
  grid.innerHTML = shownCategories.map(c => {
    const items = filtered.filter(s => s.category === c.id);
    return `<article class="category-card" data-category-card="${c.id}" aria-labelledby="title-${c.id}"><div class="category-photo"><img src="${c.image}" alt="${c.alt}" width="1080" height="720" loading="lazy" decoding="async"><span class="category-photo-label">${icon(c.icon)} R&N GRÁFICA</span></div><div class="category-body"><div class="category-title-row"><h3 id="title-${c.id}">${c.name}</h3><span class="category-count">${String(items.length).padStart(2, '0')}</span></div><p class="category-description">${c.description}</p><div class="service-list">${items.map(s => `<button class="service-row" data-service="${s.id}" aria-label="Pedir orçamento: ${s.name}"><span><strong>${s.name}</strong><span class="service-description">${s.description}</span></span><span class="service-arrow">${icon('external')}</span></button><button type="button" class="service-more" data-service-details="${s.id}" aria-label="Saiba mais sobre ${s.name}">Saiba mais ${icon('arrow')}</button>`).join('')}</div>${c.note ? `<p class="category-note">${c.note}</p>` : ''}<button class="category-quote" data-category-quote="${c.id}">Solicitar orçamento nesta categoria ${icon('arrow')}</button></div></article>`;
  }).join('');
  document.querySelector('#catalog-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'serviço' : 'serviços'} em ${shownCategories.length} ${shownCategories.length === 1 ? 'categoria' : 'categorias'}`;
  document.querySelector('.empty-state').hidden = filtered.length !== 0;
  document.querySelector('.clear-search').hidden = !search.value;
}
function setCategory(id) {
  selectedCategory = id;
  document.querySelectorAll('[data-category]').forEach(button => { const selected = button.dataset.category === id; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
  renderCatalog();
}
document.querySelectorAll('[data-category]').forEach(b => b.addEventListener('click', () => setCategory(b.dataset.category)));
search.addEventListener('input', renderCatalog);
document.querySelector('.clear-search').addEventListener('click', () => { search.value = ''; renderCatalog(); search.focus(); });
document.querySelector('#reset-filters').addEventListener('click', () => { search.value = ''; setCategory('todos'); });
renderCatalog();

const dialog = document.querySelector('.quote-dialog');
const form = document.querySelector('#quote-form');
const result = document.querySelector('#quote-result');
const serviceSelect = document.querySelector('#quote-service');
let lastFocus;
function populateServices(category = '') {
  serviceSelect.innerHTML = '<option value="">Selecione um produto ou serviço</option>' + categories.filter(c => !category || c.id === category).map(c => `<optgroup label="${c.name}">${services.filter(s => s.category === c.id).map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</optgroup>`).join('');
}
function updateServiceFields() {
  const service = services.find(s => s.id === serviceSelect.value);
  const receipt = Boolean(service?.receipt);
  document.querySelector('#quantity-label').textContent = service ? `Quantidade de ${service.unit}` : 'Quantidade';
  document.querySelector('#receipt-field').hidden = !receipt;
  const pages = document.querySelector('#receipt-pages');
  pages.disabled = !receipt; pages.required = receipt;
  document.querySelector('#size-field').hidden = service?.category === 'agendamentos';
  document.querySelector('#quote-size').disabled = service?.category === 'agendamentos';
}
function openQuote(serviceId = '', category = '') {
  lastFocus = document.activeElement;
  populateServices(category);
  serviceSelect.value = serviceId;
  updateServiceFields();
  form.hidden = false; result.hidden = true;
  document.querySelector('#copy-status').textContent = '';
  dialog.showModal(); document.body.classList.add('modal-open');
}
const detailsDialog = document.querySelector('.details-dialog');
let detailsServiceId = '';
function openDetails(id) {
  const service = services.find(item => item.id === id);
  if (!service) return;
  detailsServiceId = id;
  document.querySelector('#details-title').textContent = service.name;
  document.querySelector('#details-summary').textContent = service.description;
  const headings = ['O que oferecemos', 'Opções e informações para o pedido', 'Antes de encomendar'];
  const content = document.querySelector('#details-content');
  content.replaceChildren();
  (service.details || []).forEach((paragraph, index) => {
    const section = document.createElement('section');
    const title = document.createElement('h3'); title.textContent = headings[index] || 'Informações';
    const text = document.createElement('p'); text.textContent = paragraph;
    section.append(title, text); content.append(section);
  });
  detailsDialog.showModal();
  document.body.classList.add('modal-open');
}
document.addEventListener('click', event => {
  const more = event.target.closest('[data-service-details]');
  if (more) openDetails(more.dataset.serviceDetails);
});
document.querySelector('.details-close').addEventListener('click', () => detailsDialog.close());
detailsDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
detailsDialog.addEventListener('click', event => { if (event.target === detailsDialog) detailsDialog.close(); });
document.querySelector('#details-quote').addEventListener('click', () => {
  const id = detailsServiceId;
  detailsDialog.close();
  openQuote(id);
});
serviceSelect.addEventListener('change', updateServiceFields);
document.addEventListener('click', event => {
  const service = event.target.closest('[data-service]');
  const category = event.target.closest('[data-category-quote]');
  if (service) openQuote(service.dataset.service);
  else if (category) openQuote('', category.dataset.categoryQuote);
  else if (event.target.closest('[data-quote]')) openQuote();
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); lastFocus?.focus(); });
dialog.addEventListener('click', event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); });
const nameField = document.querySelector('#customer-name');
nameField.addEventListener('input', () => nameField.setCustomValidity(nameField.value.trim() ? '' : 'Informe seu nome.'));
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!nameField.value.trim()) { nameField.setCustomValidity('Informe seu nome.'); nameField.reportValidity(); return; }
  const data = new FormData(form);
  const service = services.find(s => s.id === data.get('service'));
  if (!service || !form.reportValidity()) return;
  const category = categories.find(c => c.id === service.category);
  const message = `Olá, R&N Gráfica Rápida! Gostaria de um orçamento.\n\nNome: ${data.get('name').trim()}\nCategoria: ${category.name}\nProduto ou serviço: ${service.name}\nQuantidade: ${data.get('quantity')} (${service.unit})${service.receipt ? `\nFolhas por talão: ${data.get('pages')}` : ''}${data.get('size')?.trim() ? `\nTamanho ou formato: ${data.get('size').trim()}` : ''}${data.get('details')?.trim() ? `\n\nDetalhes: ${data.get('details').trim()}` : ''}`;
  document.querySelector('#message-preview').value = message;
  const link = document.querySelector('#send-whatsapp'); link.href = wa(message);
  form.hidden = true; result.hidden = false; link.focus(); link.click();
});
document.querySelector('#edit-quote').addEventListener('click', () => { result.hidden = true; form.hidden = false; serviceSelect.focus(); });
document.querySelector('#copy-quote').addEventListener('click', async () => {
  const field = document.querySelector('#message-preview');
  try { await navigator.clipboard.writeText(field.value); document.querySelector('#copy-status').textContent = 'Resumo copiado!'; }
  catch { field.focus(); field.select(); document.querySelector('#copy-status').textContent = 'Selecione o resumo acima e use a opção Copiar do seu dispositivo.'; }
});
const menu = document.querySelector('.menu-toggle');
function closeMenu() { document.querySelectorAll('.nav-group[open]').forEach(group => { group.open = false; }); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); menu.innerHTML = icon('menu'); document.querySelector('.nav').classList.remove('open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); menu.innerHTML = icon(open ? 'close' : 'menu'); document.querySelector('.nav').classList.toggle('open', open); });
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', closeMenu));
document.querySelectorAll('.nav-group').forEach(group => group.addEventListener('toggle', () => { if (group.open) document.querySelectorAll('.nav-group').forEach(other => { if (other !== group) other.open = false; }); }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });


function prepareArticle() {
  const view = document.querySelector('#article-view');
  view.classList.remove('calculator-view');
  document.body.classList.remove('calculator-open');
}

function displayPage() {
  const page = currentPage();
  const isArticle = Boolean(page || hasNativePage || isBloggerPage());
  const home = document.querySelector('#home-view');
  const view = document.querySelector('#article-view');
  const content = document.querySelector('#article-content');
  const breadcrumb = document.querySelector('#article-breadcrumb-title');
  home.hidden = isArticle;
  view.hidden = !isArticle;
  if (isArticle) {
    if (hasNativePage) {
      content.replaceChildren(nativePage);
      breadcrumb.textContent = nativePage.querySelector('h1').textContent;
    } else if (isBloggerPage()) {
      // No blog publicado, nunca substitua uma página pela cópia de demonstração.
      content.innerHTML = '<p class="article-lead" role="status">Carregando a página…</p>';
      breadcrumb.textContent = page?.title || 'Informações';
      const articleAd = document.querySelector('[data-ad-position="article"]');
      articleAd.dataset.adEligible = 'false';
      articleAd.hidden = true;
      const pageId = document.querySelector('meta[name="rn-page-id"]')?.content;
      loadPublishedPage(location.pathname, fetch, pageId).then(published => {
        const article = document.createElement('article');
        const header = document.createElement('header');
        header.className = 'article-header';
        const heading = document.createElement('h1');
        heading.textContent = published.title;
        header.append(heading);
        const body = document.createElement('div');
        body.className = 'native-page-body';
        body.innerHTML = published.body;
        article.append(header, body);
        content.replaceChildren(article);
        prepareArticle();
        breadcrumb.textContent = published.title;
        document.title = `${published.title} | R&N Gráfica Rápida`;
        articleAd.dataset.adEligible = String(page?.type === 'guide');
        initAds();
      }).catch(() => {
        content.innerHTML = `<h1>Não foi possível abrir esta página</h1><p class="article-lead">Tente novamente ou fale com a gráfica pelo WhatsApp.</p><a class="text-link" id="retry-page">Tentar novamente ${icon('arrow')}</a>`;
        content.querySelector('#retry-page').href = location.pathname;
        breadcrumb.textContent = 'Página indisponível';
        document.title = 'Página indisponível | R&N Gráfica Rápida';
      });
    } else {
      content.innerHTML = `<article><header class="article-header"><div class="eyebrow">${page.type === 'guide' ? 'GUIAS R&N GRÁFICA' : 'R&N GRÁFICA RÁPIDA'}</div><h1>${page.title}</h1></header>${page.image ? `<img class="article-hero" src="${page.image}" alt="Arte ilustrativa R&N Gráfica: ${page.title}." width="1080" height="720">` : ''}<div class="article-body">${page.body}</div></article>`;
      breadcrumb.textContent = page.title;
    }
    document.title = `${breadcrumb.textContent} | R&N Gráfica Rápida`;
  } else {
    content.replaceChildren();
    breadcrumb.textContent = '';
    document.title = 'R&N Gráfica Rápida — Produtos e serviços';
  }
  // On native Blogger pages, global navigation must return to the home page.
  document.querySelectorAll('.header a[href^="#"], .footer a[href^="#"], .article-back a, .article-breadcrumb a').forEach(link => {
    const original = link.dataset.homeAnchor || link.getAttribute('href');
    link.dataset.homeAnchor = original;
    const fragment = original.includes('#') ? original.slice(original.indexOf('#')) : '#servicos';
    link.setAttribute('href', isPreview() ? fragment : isArticle ? `/${fragment}` : fragment);
  });
  document.querySelectorAll('.rn-native-section').forEach(section => section.remove());
  const articleAd = document.querySelector('[data-ad-position="article"]');
  articleAd.dataset.adEligible = String(page?.type === 'guide' && (!isBloggerPage() || hasNativePage));
  if (page?.type !== 'guide') articleAd.hidden = true;
  closeMenu();
  prepareArticle();
  initAds();
}
displayPage();
window.addEventListener('hashchange', () => {
  if (isPreview()) {
    const targetPage = currentPage();
    const wasArticle = !document.querySelector('#article-view').hidden;
    displayPage();
    if (targetPage) window.scrollTo({ top: 0, behavior: 'instant' });
    else if (wasArticle) document.getElementById(location.hash.slice(1) || 'servicos')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
});
