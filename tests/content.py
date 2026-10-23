"""Páginas, prévia e posições de anúncio desativadas. Não envia mensagens nem solicita anúncios."""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
import json, re, argparse, xml.etree.ElementTree as ET
root = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:5173/')
args = parser.parse_args()
slugs = ['sobre','contato','privacidade','como-escolher-o-papel','como-preparar-sua-arte','sublimacao-e-dtf']
titles = ['Sobre','Contato','Privacidade','Como escolher o papel','Como preparar sua arte','Sublimação e DTF']
output=Path('/workspace/shared/rn-v21-review');output.mkdir(parents=True,exist_ok=True)
checks=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(reduced_motion='reduce',viewport={'width':1440,'height':1000})
    context.route('https://wa.me/**',lambda route:route.fulfill(status=200,content_type='text/html',body='Sem envio.'))
    requests=[]
    context.on('request',lambda r:requests.append(r.url))
    page=context.new_page()
    page.set_default_timeout(10000)
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(args.url,wait_until='networkidle')
    expect(page.locator('#home-view')).to_be_visible()
    expect(page.locator('#article-view')).not_to_be_visible()
    expect(page.locator('.guide-card')).to_have_count(3)
    assert page.locator('ins.adsbygoogle').count()==0
    for slug,title in zip(slugs,titles):
        r=page.goto(args.url+'p/'+slug+'.html',wait_until='networkidle')
        assert r.status==200
        expect(page.locator('#home-view')).not_to_be_visible()
        expect(page.locator('#article-view')).to_be_visible()
        expect(page.locator('#article-content h1')).to_have_text(title)
        assert page.title()==title+' | R&N Gráfica Rápida'
        text=page.locator('#article-content').inner_text()
        assert len(text.split()) >= (350 if slug in slugs[3:] else 100)
        assert 'SUBSTITUA' not in text and '[SEU' not in text
        for width in [320,390,768,1440]:
            page.set_viewport_size({'width':width,'height':900})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),(slug,width)
        assert page.locator('[data-ad-position="article"]').get_attribute('data-ad-eligible')==str(slug in slugs[3:]).lower()
        expect(page.locator('[data-ad-position="article"]')).not_to_be_visible()
        assert page.locator('ins.adsbygoogle').count()==0
        page.get_by_role('button',name='Pedir orçamento',exact=True).click()
        expect(page.locator('.quote-dialog')).to_be_visible()
        assert page.locator('#quote-service option').count()==21
        page.keyboard.press('Escape')
        if slug=='privacidade':
            assert 'endereço direcionado ao WhatsApp' in text
            assert 'Blogger' in text and 'GitHub' in text
            assert page.locator('#article-content a[href^="https://wa.me/5581996090928"]').count()>=2
        if slug=='sublimacao-e-dtf':
            page.screenshot(path=str(output/'guia-desktop.png'),full_page=True)
        if slug=='sobre':
            page.set_viewport_size({'width':390,'height':844})
            page.screenshot(path=str(output/'sobre-celular.png'),full_page=True)
        page.set_viewport_size({'width':1440,'height':1000})
        page.locator('.header a[href="/#servicos"]').click()
        expect(page.locator('#home-view')).to_be_visible()
        expect(page.locator('#article-view')).not_to_be_visible()
    checks.append('Seis páginas legíveis, três guias com mais de 350 palavras, navegação, orçamento e margens de 320 a 1440 px.')
    assert not [u for u in requests if 'googlesyndication' in u or 'doubleclick' in u]
    checks.append('Nenhum novo anúncio ou pedido de publicidade: blocos desativados e ocultos.')
    theme=(root/'blogger/downloads/RN-Grafica-Rapida-Blogger.xml').read_text()
    xml=ET.fromstring(theme)
    ns={'b':'http://www.google.com/2005/gml/b','h':'http://www.w3.org/1999/xhtml','data':'http://www.google.com/2005/gml/data'}
    assert len(xml.findall('.//b:widget[@id="Blog1"]',ns))==1
    assert xml.find('.//data:post.body',ns) is not None
    assert len(xml.findall('.//b:skin',ns))==1
    # Simula a resposta renderizada do Blogger para provar que o conteúdo nativo é preservado.
    native="<article class='native-page article-content' data-native-page='true'><header><h1>Sobre publicada no Blogger</h1></header><div class='native-page-body'><p id='native-proof'>Conteúdo efetivamente editado no painel do Blogger.</p></div></article>"
    rendered=re.sub(r"<b:if[^>]*><b:section id='rnNativePages'[\s\S]*?</b:if>",lambda m:native,theme,count=1)
    assert rendered != theme
    context.route('https://rn-native.invalid/**',lambda route:route.fulfill(status=200,content_type='text/html; charset=utf-8',body=rendered))
    context.route('https://raw.githubusercontent.com/rdroid8229-commits/site/main/public/images/**',lambda route:route.fulfill(status=200,content_type='image/webp',body=(root/'public/images'/route.request.url.split('/')[-1]).read_bytes()))
    page.goto('https://rn-native.invalid/p/sobre.html',wait_until='networkidle')
    expect(page.locator('#native-proof')).to_have_text('Conteúdo efetivamente editado no painel do Blogger.')
    expect(page.locator('#article-content h1')).to_have_text('Sobre publicada no Blogger')
    assert page.locator('[data-native-page]').count()==1
    expect(page.locator('#home-view')).not_to_be_visible()
    checks.append('Tema suporta páginas nativas: título e corpo editados no Blogger são preservados.')
    # A prévia deve funcionar sem páginas publicadas e com imagens relativas do ZIP.
    preview=(root/'blogger/previa.html').read_text()
    def preview_route(route):
        path=route.request.url.split('rn-preview.invalid/')[-1]
        if path.startswith('images/'):
            route.fulfill(status=200,content_type='image/webp',body=(root/'public'/path).read_bytes())
        else:
            route.fulfill(status=200,content_type='text/html; charset=utf-8',body=preview)
    context.route('https://rn-preview.invalid/**',preview_route)
    page.goto('https://rn-preview.invalid/',wait_until='networkidle')
    page.locator('.footer a[href="#pagina/privacidade"]').click()
    expect(page.locator('#article-content h1')).to_have_text('Privacidade')
    page.locator('.header .brand').click()
    expect(page.locator('#home-view')).to_be_visible()
    page.locator('.guide-card a[href="#pagina/como-escolher-o-papel"]').first.click()
    expect(page.locator('#article-content h1')).to_have_text('Como escolher o papel')
    page.locator('.article-back a').click()
    expect(page.locator('#home-view')).to_be_visible()
    assert page.url.endswith('#servicos')
    assert not errors,errors
    checks.append('Prévia do ZIP navega entre início, privacidade e guias sem criar páginas no Blogger.')
    browser.close()
for slug in slugs:
    files=list((root/'blogger/paginas').glob('*-'+slug+'.txt'))
    assert len(files)==1
    assert '/p/'+slug+'.html' in files[0].read_text()
report={'checks':checks,'javascript_errors':errors,'ads_activated':False}
(output/'content-tests.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
