"""Integração da calculadora completa: HTML publicado, dados locais e prévia. Sem mensagens."""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
import json, re, tempfile
from zipfile import ZipFile

root=Path(__file__).resolve().parent.parent
out=Path('/workspace/shared/rn-calculadora-review');out.mkdir(parents=True,exist_ok=True)
theme=(root/'blogger/downloads/RN-Grafica-Rapida-Blogger.xml').read_text()
theme=re.sub(r'<!-- RN:NATIVE:START -->[\s\S]*?<!-- RN:NATIVE:END -->',"<div class='rn-native-section' id='rnNativePages'></div>",theme,count=1)
theme=theme.replace("<meta name='rn-page-id' expr:content='data:blog.pageId'/>","<meta name='rn-page-id' content='12345'/>")
body=(root/'blogger/paginas/07-calculadora.txt').read_text()
entry={'title':{'$t':'Calculadora'},'content':{'$t':body},'link':[{'rel':'alternate','href':'https://rn-calculadora.invalid/p/calculadora.html'}]}
standalone=(root/'public/calculadora.html').read_text()
checks=[];errors=[];dialogs=[];requests=[]

def routes(context):
    def serve(route):
        url=route.request.url;requests.append(url)
        if '/feeds/pages/default/12345?' in url:
            route.fulfill(status=200,content_type='application/json',body=json.dumps({'entry':entry}))
        elif '/feeds/pages/default?' in url:
            route.fulfill(status=200,content_type='application/json',body=json.dumps({'feed':{'entry':[entry]}}))
        elif (url.endswith('/calculadora.html') and '/p/' not in url) or url.endswith('/standalone.html'):
            route.fulfill(status=200,content_type='text/html; charset=utf-8',body=standalone)
        else:
            route.fulfill(status=200,content_type='text/html; charset=utf-8',body=theme)
    context.route('https://rn-calculadora.invalid/**',serve)
    context.route('https://wa.me/**',lambda r:r.fulfill(status=200,body='Sem envio.'))
    context.route('https://raw.githubusercontent.com/rdroid8229-commits/site/main/public/images/**',lambda r:r.fulfill(status=200,content_type='image/webp',body=(root/'public/images'/r.request.url.split('/')[-1]).read_bytes()))

def value(frame,selector,text):
    expect(frame.locator(selector)).to_have_text(re.compile(re.escape(text)))

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000},permissions=['clipboard-read','clipboard-write'],reduced_motion='reduce')
    routes(context)
    page=context.new_page();page.set_default_timeout(12000)
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('dialog',lambda d:(dialogs.append(d.message),d.accept()))
    page.goto('https://rn-calculadora.invalid/p/calculadora.html',wait_until='networkidle')
    frame=page.frame_locator('iframe[data-rn-calculator]')
    expect(frame.locator('#capacity')).to_have_text('10')
    expect(page.locator('.floating-contact')).not_to_be_visible()
    expect(frame.locator('#sheet-count')).to_have_text('100')
    frame.locator('#quantity').fill('1001');expect(frame.locator('#sheet-count')).to_have_text('101')
    frame.locator('#copy').click();expect(frame.locator('#action-status')).to_have_text('Resumo copiado!')
    copied=page.evaluate('navigator.clipboard.readText()');assert 'Quantidade desejada: 1.001' in copied
    frame.locator('body').evaluate('()=>{window.rnPrintCalls=0;window.print=()=>window.rnPrintCalls++}')
    frame.locator('#print').click();assert frame.locator('body').evaluate('()=>window.rnPrintCalls')==1
    frame.locator('#reset').click();expect(frame.locator('#sheet-count')).to_have_text('100')
    for shape,capacity in [('circle','15'),('triangle','15'),('square','15')]:
        frame.locator('#shape').select_option(shape);expect(frame.locator('#capacity')).to_have_text(capacity)
    frame.locator('#quantity').fill('1.5');expect(frame.locator('#errors')).to_be_visible();expect(frame.locator('#copy')).to_be_disabled()
    frame.locator('#reset').click()
    checks.append('Encaixe: formatos, tiragem arredondada, validação, resumo copiado e impressão acionada.')

    frame.locator('#tab-area').click()
    frame.locator('#area-width').fill('50');frame.locator('#area-height').fill('30');frame.locator('#area-quantity').fill('3')
    value(frame,'#area-price-result','15,75')
    frame.locator('#area-minimum').check();value(frame,'#area-price-result','105,00')
    frame.locator('#area-minimum').uncheck();frame.locator('#area-unit').select_option('m')
    expect(frame.locator('#area-width')).to_have_value('0.5');value(frame,'#area-price-result','15,75')
    frame.locator('#area-copy').click();expect(frame.locator('#area-action-status')).to_have_text('Orçamento copiado!')
    frame.locator('#area-print').click();assert frame.locator('body').evaluate('()=>window.rnPrintCalls')==2
    frame.locator('#area-width').fill('-1');expect(frame.locator('#area-errors')).to_be_visible();expect(frame.locator('#area-copy')).to_be_disabled()
    frame.locator('#area-reset').click();value(frame,'#area-price-result','35,00')
    checks.append('m²: medidas e conversão, mínimo por peça, centavos, entrada inválida, cópia, impressão e restauração.')

    frame.locator('#tab-costs').click()
    costs=frame.frame_locator('#costs-frame')
    expect(costs.locator('#category')).not_to_have_value('')
    costs.locator('[data-tab="materiais"]').click()
    costs.locator('#newMaterial').fill('Papel de teste');costs.locator('#newMode').select_option('pack')
    costs.locator('#newValue').fill('50');costs.locator('#newCount').fill('500');costs.locator('#createMaterial').click()
    expect(costs.locator('#materialsTable tr')).to_have_count(1)
    costs.locator('[data-tab="produtos"]').click()
    costs.locator('#newProduct').fill('Produto de teste');costs.locator('#newCategoryText').fill('Testes');costs.locator('#createProduct').click()
    costs.locator('#addRecipe').click();costs.locator('#recipe input').fill('2');costs.locator('#recipe input').press('Tab')
    costs.locator('#extra').fill('0.10');costs.locator('#manual').fill('1');costs.locator('#waste').fill('10')
    costs.locator('#inkMode').select_option('manual');costs.locator('#inkManual').fill('0.05');costs.locator('#qty').fill('10')
    value(costs,'#suggestOut','0,75');value(costs,'#profitOut','6,25');value(costs,'#actualOut','62,5%')
    costs.locator('#inkMode').select_option('auto');costs.locator('#inkBottlePrice').fill('100');costs.locator('#inkBottleMl').fill('100');costs.locator('#inkUsageMl').fill('0.05')
    value(costs,'#suggestOut','0,75')
    costs.locator('[data-tab="materiais"]').click()
    costs.locator('#materialsTable input').first.fill('100');costs.locator('#materialsTable input').first.press('Tab')
    costs.locator('[data-tab="produtos"]').click();value(costs,'#suggestOut','1,19');value(costs,'#profitOut','4,05');expect(costs.locator('#manual')).to_have_value('1')
    costs.locator('#qty').fill('0.5');expect(costs.locator('#qty')).to_have_attribute('aria-invalid','true')
    costs.locator('#unit').select_option('m²');value(costs,'#totalSaleOut','0,50')
    costs.locator('#qty').fill('10');costs.locator('#saveProduct').click()
    checks.append('Custos: cadastro, consumo, tinta manual/automática, atualização de material, preço manual preservado e quantidade fracionária por m².')

    costs.locator('[data-tab="config"]').click();costs.locator('#defaultMargin').fill('40');costs.locator('#warningMargin').fill('60');costs.locator('#saveConfig').click()
    costs.locator('[data-tab="produtos"]').click();expect(costs.locator('#margin')).to_have_value('50')
    costs.locator('[data-tab="dados"]').click()
    with page.expect_download() as downloaded:costs.locator('#export').click()
    backup=out/'backup-calculadora-teste.json';downloaded.value.save_as(backup)
    saved=json.loads(backup.read_text());assert saved['settings']['margin']==40 and len(saved['materials'])==1
    costs.locator('[data-tab="produtos"]').click();costs.locator('#deleteProduct').click()
    costs.locator('[data-tab="dados"]').click()
    with page.expect_event('dialog') as confirmation:
        costs.locator('#import').set_input_files(str(backup))
    assert 'Substituir os cadastros atuais' in confirmation.value.message
    costs.locator('[data-tab="produtos"]').click();costs.locator('#category').select_option('Testes');value(costs,'#suggestOut','1,19')
    costs.locator('[data-tab="dados"]').click()
    with page.expect_event('dialog') as invalid:
        costs.locator('#import').set_input_files({'name':'invalido.json','mimeType':'application/json','buffer':b'{"products":[]}'})
    assert 'Backup não importado:' in invalid.value.message
    page.reload(wait_until='networkidle');frame=page.frame_locator('iframe[data-rn-calculator]');frame.locator('#tab-costs').click();costs=frame.frame_locator('#costs-frame')
    costs.locator('#category').select_option('Testes');value(costs,'#suggestOut','1,19')
    checks.append('Configurações, backup JSON, importação válida/inválida e persistência após recarregar.')

    # O quadro externo e o quadro interno devem acompanhar o conteúdo sem corte.
    layouts=[]
    for width in [320,360,390,600,768,850,860,900,1024,1440]:
        page.set_viewport_size({'width':width,'height':900})
        for mode in ['production','area','costs']:
            frame.locator('#tab-'+mode).click()
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('Blogger',width,mode)
            assert frame.locator('body').evaluate('()=>document.documentElement.scrollWidth<=innerWidth'),('calculadora',width,mode)
            if mode=='costs':
                assert costs.locator('body').evaluate('()=>document.documentElement.scrollWidth<=innerWidth'),('custos',width)
                page.wait_for_function("""()=>{const outer=document.querySelector('iframe[data-rn-calculator]');const inner=outer?.contentDocument?.querySelector('#costs-frame');return inner?.contentDocument?.querySelector('main')&&inner.clientHeight>=inner.contentDocument.querySelector('main').getBoundingClientRect().height-2&&outer.clientHeight>=outer.contentDocument.body.scrollHeight-2}""")
        layouts.append(width)
    page.set_viewport_size({'width':390,'height':844});frame.locator('#tab-production').click()
    page.evaluate('document.activeElement.blur();scrollTo(0,0)')
    page.screenshot(path=str(out/'calculadora-blogger-390.png'),full_page=True)
    page.set_viewport_size({'width':1440,'height':1000});frame.locator('#tab-costs').click()
    page.evaluate('document.activeElement.blur();scrollTo(0,0)')
    page.screenshot(path=str(out/'calculadora-blogger-custos-1440.png'),full_page=True)
    checks.append('Página e três áreas sem transbordamento horizontal de 320 a 1440 px.')

    # Um visitante em outro contexto recebe seus próprios dados, não os cadastros acima.
    separate=browser.new_context(viewport={'width':1000,'height':900});routes(separate)
    other=separate.new_page();other.goto('https://rn-calculadora.invalid/p/calculadora.html',wait_until='networkidle')
    other.frame_locator('iframe[data-rn-calculator]').locator('#tab-costs').click()
    expect(other.frame_locator('iframe[data-rn-calculator]').frame_locator('#costs-frame').locator('#materialsTable tr')).to_have_count(0)
    separate.close();checks.append('Cadastros de um navegador não aparecem para outro visitante.')

    # Executa os bytes do arquivo independente em origem de teste: file:// é bloqueado
    # pela política do navegador deste ambiente, sem relação com o aplicativo.
    local=context.new_page();local.on('pageerror',lambda e:errors.append(str(e)))
    local.goto('https://rn-calculadora.invalid/standalone.html',wait_until='networkidle')
    expect(local.locator('#capacity')).to_have_text('10');local.locator('#tab-area').click();value(local,'#area-price-result','35,00')
    local.locator('#tab-costs').click();expect(local.frame_locator('#costs-frame').locator('#category')).not_to_have_value('')
    local.close();checks.append('HTML independente com as três áreas, sem autenticação nem dependências de rede, em origem de teste.')

    with tempfile.TemporaryDirectory(prefix='rn-calculadora-') as directory:
        unpacked=Path(directory)
        with ZipFile(root/'blogger/downloads/RN-Grafica-Rapida-Blogger.zip') as z:z.extractall(unpacked)
        def preview_route(route):
            path=route.request.url.split('https://rn-zip.invalid/',1)[-1].split('?',1)[0]
            target=unpacked/(path or 'PREVIA.html')
            typ='image/webp' if target.suffix=='.webp' else 'text/html; charset=utf-8'
            route.fulfill(status=200,content_type=typ,body=target.read_bytes())
        context.route('https://rn-zip.invalid/**',preview_route)
        preview=context.new_page();preview.on('pageerror',lambda e:errors.append(str(e)))
        preview.goto('https://rn-zip.invalid/PREVIA.html',wait_until='networkidle')
        preview.locator('.header a[href="#pagina/calculadora"]').click()
        expect(preview.frame_locator('iframe[data-rn-calculator]').locator('#capacity')).to_have_text('10')
        preview.locator('.article-back a').click();expect(preview.locator('#home-view')).to_be_visible()
        preview.close()
    checks.append('Prévia extraída do ZIP abre a calculadora e retorna ao catálogo, com os caminhos relativos corretos.')

    assert not errors,errors
    browser.close()

report={'checks':checks,'javascript_errors':errors,'viewport_widths':layouts,'messages_sent':0,'public_blogger_installation_required':True,'local_file_scheme_test':'file:// bloqueado pelo navegador do ambiente; bytes locais testados por respostas HTTPS simuladas.'}
(out/'calculator-tests.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
