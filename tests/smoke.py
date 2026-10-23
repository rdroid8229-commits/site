"""Teste de navegação e orçamento. Não envia mensagens ao WhatsApp.
Uso: python3 tests/smoke.py [--theme blogger/downloads/RN-Grafica-Rapida-Blogger.xml]
"""
from pathlib import Path
from urllib.parse import urlparse, parse_qs
import argparse, json
from playwright.sync_api import sync_playwright, expect

parser = argparse.ArgumentParser()
parser.add_argument('--theme')
parser.add_argument('--url', default='http://127.0.0.1:5173/')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
output = Path('/workspace/shared/rn-v2-review')
output.mkdir(parents=True, exist_ok=True)
checks = []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, permissions=['clipboard-read', 'clipboard-write'])
    messages = []
    def whatsapp(route):
        messages.append(route.request.url)
        route.fulfill(status=200, content_type='text/html', body='Teste do link, sem envio de mensagem.')
    context.route('https://wa.me/**', whatsapp)
    if args.theme:
        theme = (root / args.theme).read_text()
        context.route('https://rn-teste.invalid/**', lambda route: route.fulfill(status=200, content_type='text/html; charset=utf-8', body=theme))
        def artwork(route):
            name = route.request.url.split('/')[-1]
            route.fulfill(status=200, content_type='image/webp', body=(root / 'public/images' / name).read_bytes())
        context.route('https://raw.githubusercontent.com/rdroid8229-commits/site/main/public/images/**', artwork)
        url = 'https://rn-teste.invalid/'
    else:
        url = args.url
    page = context.new_page()
    page.set_default_timeout(12000)
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    response = page.goto(url, wait_until='networkidle')
    assert response.status == 200
    expect(page.locator('.service-row')).to_have_count(20)
    expect(page.locator('.category-card')).to_have_count(6)
    assert page.locator('.service-row').first.get_attribute('data-service') == 'oficio'
    assert page.locator('#catalog-count').inner_text() == '20 serviços em 6 categorias'
    # Faz o navegador visitar as imagens lazy antes de conferir carregamento e capturar a página.
    for img in page.locator('.category-photo img').all():
        img.scroll_into_view_if_needed()
        expect(img).to_have_js_property('complete', True)
        assert img.evaluate('(e)=>e.naturalWidth > 0')
    assert page.locator('.category-photo img').count() == 6
    checks.append('20 serviços e 6 artes carregadas; impressões e xerox vêm primeiro.')
    for category, count in [('impressoes',4),('plastificacao',2),('documentos',4),('comunicacao',2),('agendamentos',3),('personalizados',5),('todos',20)]:
        button = page.locator('[data-category="'+category+'"]')
        button.click()
        expect(button).to_have_attribute('aria-pressed','true')
        expect(page.locator('.service-row')).to_have_count(count)
    search = page.get_by_role('searchbox', name='Buscar produto ou serviço')
    for term, count in [('fotografico',1),('aluguel',2),('CRAS',1),('DTF',1),('sublimacao',1),('nao-existe-xyz',0)]:
        search.fill(term)
        expect(page.locator('.service-row')).to_have_count(count)
    expect(page.locator('.empty-state')).to_be_visible()
    page.get_by_role('button',name='Ver todos os serviços',exact=False).click()
    expect(page.locator('.service-row')).to_have_count(20)
    search.fill('xerox')
    page.get_by_role('button',name='Limpar busca',exact=True).click()
    expect(search).to_have_value('')
    expect(page.locator('.service-row')).to_have_count(20)
    checks.append('Todos os filtros, busca sem acentos, limpeza e recuperação de busca sem resultados.')
    service_ids = page.locator('.service-row').evaluate_all('(e)=>e.map(x=>x.dataset.service)')
    assert len(service_ids) == len(set(service_ids)) == 20
    for service_id in service_ids:
        page.locator('[data-service="'+service_id+'"]').click()
        expect(page.locator('#quote-service')).to_have_value(service_id)
        expect(page.locator('.quote-dialog')).to_be_visible()
        page.get_by_role('button',name='Fechar orçamento',exact=True).click()
    for category, count in [('impressoes',4),('plastificacao',2),('documentos',4),('comunicacao',2),('agendamentos',3),('personalizados',5)]:
        page.locator('[data-category-quote="'+category+'"]').click()
        assert page.locator('#quote-service option').count() == count + 1
        expect(page.locator('#quote-service')).to_have_value('')
        page.keyboard.press('Escape')
    checks.append('Todos os 20 botões de serviço e os 6 botões de orçamento por categoria.')
    page.locator('[data-service="recibos"]').click()
    name = page.get_by_label('Seu nome',exact=True)
    name.fill('   ')
    page.get_by_role('button',name='Preparar pedido no WhatsApp',exact=False).click()
    assert not name.evaluate('(e)=>e.validity.valid')
    expect(page.locator('#quote-result')).not_to_be_visible()
    name.fill('Revisão R&N')
    quantity = page.locator('#quantity')
    for value in ['0','-1','1.5']:
        quantity.fill(value)
        assert not quantity.evaluate('(e)=>e.validity.valid')
    quantity.fill('2')
    pages = page.locator('#receipt-pages')
    for value in ['49','101','50.5']:
        pages.fill(value)
        assert not pages.evaluate('(e)=>e.validity.valid')
    for value in ['50','75','100']:
        pages.fill(value)
        assert pages.evaluate('(e)=>e.validity.valid')
    pages.fill('75')
    page.locator('#quote-details').fill('Quero consultar prazo e valor. Já tenho o modelo.')
    with page.expect_popup() as newpage:
        page.get_by_role('button',name='Preparar pedido no WhatsApp',exact=False).click()
    newpage.value.wait_for_load_state()
    parsed = urlparse(newpage.value.url)
    assert parsed.path == '/5581996090928'
    message = parse_qs(parsed.query)['text'][0]
    for text in ['Revisão R&N','Talões de recibos de aluguel','Quantidade: 2 (talões)','Folhas por talão: 75','Quero consultar prazo e valor.']:
        assert text in message, text
    assert page.locator('#message-preview').input_value() == message
    page.get_by_role('button',name='Copiar resumo',exact=True).click()
    expect(page.locator('#copy-status')).to_have_text('Resumo copiado!')
    assert page.evaluate('navigator.clipboard.readText()') == message
    page.get_by_role('button',name='Editar pedido',exact=True).click()
    expect(quantity).to_have_value('2')
    expect(pages).to_have_value('75')
    # Trocar de serviço não deve deixar um campo de talão oculto bloqueando o envio.
    page.locator('#quote-service').select_option('cras')
    expect(pages).to_be_disabled()
    expect(page.locator('#quote-size')).to_be_disabled()
    expect(page.locator('#quantity-label')).to_have_text('Quantidade de atendimentos')
    with page.expect_popup() as newpage2:
        page.get_by_role('button',name='Preparar pedido no WhatsApp',exact=False).click()
    newpage2.value.wait_for_load_state()
    appointment_message = page.locator('#message-preview').input_value()
    assert 'Agendamento no CRAS' in appointment_message
    assert 'Folhas por talão' not in appointment_message
    assert 'Tamanho ou formato' not in appointment_message
    page.keyboard.press('Escape')
    checks.append('Nome sem espaços vazios; quantidades inteiras/positivas; talões de 50 a 100 folhas; resumo, WhatsApp, cópia e edição.')
    page.get_by_role('button',name='Pedir orçamento',exact=True).click()
    expect(page.locator('#quote-service')).to_have_value('')
    assert page.locator('#quote-service option').count() == 21
    page.keyboard.press('Escape')
    for summary in page.locator('.faq-list summary').all():
        summary.click()
        assert summary.locator('..').get_attribute('open') is not None
        summary.click()
    checks.append('Orçamento genérico, unidades por serviço e quatro perguntas frequentes.')
    for width in [320,360,390,550,600,768,850,1024,1440]:
        page.set_viewport_size({'width':width,'height':900})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Margem em {width}'
        page.get_by_role('button',name='Pedir orçamento',exact=True).click()
        assert page.locator('.quote-dialog').evaluate('(e)=>e.scrollWidth <= e.clientWidth'), f'Modal em {width}'
        page.keyboard.press('Escape')
    page.set_viewport_size({'width':390,'height':844})
    menu = page.locator('.menu-toggle')
    menu.click()
    expect(menu).to_have_attribute('aria-expanded','true')
    page.locator('.nav').get_by_role('link',name='Produtos e serviços',exact=True).click()
    expect(menu).to_have_attribute('aria-expanded','false')
    menu.click()
    page.keyboard.press('Escape')
    expect(menu).to_have_attribute('aria-expanded','false')
    # Os contatos têm o número correto e os links internos apontam para IDs existentes.
    links = page.locator('a[href]').evaluate_all('(nodes)=>nodes.map(n=>n.getAttribute("href"))')
    for href in links:
        if href.startswith('#'):
            assert page.locator('[id="'+href[1:]+'"]').count(),href
        else:
            assert href.startswith('https://wa.me/5581996090928'),href
    for width,label in [(1440,'desktop'),(390,'celular')]:
        page.set_viewport_size({'width':width,'height':1000 if width==1440 else 844})
        for img in page.locator('.category-photo img').all():
            img.scroll_into_view_if_needed()
            expect(img).to_have_js_property('complete',True)
        page.evaluate('scrollTo(0,0)')
        page.screenshot(path=str(output/(('blogger-' if args.theme else '')+label+'.png')),full_page=True)
    checks.append('Menu móvel, links internos e todos os contatos; margens da página e do formulário de 320 a 1440 px.')
    assert not errors,errors
    browser.close()
report = {'target':'Blogger HTML simulado' if args.theme else args.url,'checks':checks,'javascript_errors':errors,'whatsapp_links_tested':len(messages),'messages_sent':0}
(output/('testes-blogger.json' if args.theme else 'testes-desenvolvimento.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
