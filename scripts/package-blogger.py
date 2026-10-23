from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parent.parent
blogger = root / 'blogger'
output = blogger / 'downloads'
theme = output / 'RN-Grafica-Rapida-Blogger.xml'
ET.parse(theme)
readme = '''R&N Gráfica Rápida — Tema 2.2 para Blogger

CALCULADORA PÚBLICA
Leia primeiro CALCULADORA-INSTALAR.txt. Publique a página Calculadora com o conteúdo completo de PAGINAS/07-calculadora.txt no modo HTML. O endereço esperado é /p/calculadora.html. Atualize Privacidade com PAGINAS/03-privacidade.txt, que já inclui a calculadora, após revisar o texto. Se deseja manter personalizações próprias da política, insira somente CALCULADORA/PRIVACIDADE-ADICIONAL.txt. Depois faça backup do tema e instale o XML 2.2 para mostrar o acesso no menu, no rodapé e na página inicial. Preserve as demais páginas existentes que já estão corretas.
CALCULADORA/RN-Calculadora-Publica.html abre a ferramenta completa sem login do ChatGPT. Os cadastros ficam no navegador de cada visitante; use backup JSON para transferir dados entre dispositivos ou endereços. O ZIP contém as três áreas: encaixe, preço por m² e custos/preços/lucros.

REPARO OPCIONAL DE PÁGINAS ANTIGAS QUE AINDA MOSTREM CÓDIGO
1. Abra Blogger > Páginas > Privacidade e corrija a colagem usando PAGINAS/03-privacidade.txt. Selecione o modo HTML antes de substituir o conteúdo e clique em Atualizar. Confira o texto para corresponder ao atendimento da gráfica.
2. Faça o mesmo nas outras páginas que ainda mostram código ou trechos /p/...html -->. Os novos arquivos começam diretamente com <div class="article-body">. Preserve os endereços já publicados.
3. Faça backup do tema atual e instale o XML 2.2 em Tema > Restaurar.
4. Confira a página Privacidade e os guias. O conteúdo vem das páginas publicadas, não da cópia de demonstração. Se uma página estiver indisponível, há um link para tentar novamente e o WhatsApp permanece acessível.
5. Se publicou uma página extra Comece aqui com uma cópia de Sobre, reverta-a para rascunho. COMECE-AQUI.txt é somente um manual.

O widget foi ajustado para receber explicitamente os dados da página. Se o Blogger ainda entregar a seção vazia, o tema consulta o feed público de páginas da própria hospedagem. Esse caminho exige que o feed esteja disponível. A confirmação final no servidor do Blogger é feita após a instalação na sua conta.

INSTALAÇÃO
1. Extraia o ZIP, entre no Blogger e selecione seu blog.
2. Publique as páginas seguindo PAGINAS/COMECE-AQUI.txt, incluindo Calculadora.
3. Abra Tema e faça backup do tema atual.
4. No menu ao lado de Personalizar, escolha Restaurar.
5. Envie RN-Grafica-Rapida-Blogger.xml e aguarde a confirmação.
6. Clique em Ver blog e atualize a página para conferir a nova versão.

Se Restaurar não estiver disponível, use Tema > Editar HTML e substitua o código pelo XML completo. Salve.

PRÉVIA
Abra PREVIA.html mantendo a pasta images ao lado. As seis artes estão incluídas para essa prévia. No Blogger, o tema usa as imagens publicadas no repositório rdroid8229-commits/site; não é necessário enviá-las separadamente.

CONTEÚDO E PUBLICIDADE
A pasta PAGINAS contém Sobre, Contato, Privacidade, três guias e Calculadora. Crie ou edite as páginas nativas em Blogger > Páginas usando os títulos e os códigos indicados. A nova navegação só terá URLs publicadas depois dessa etapa. PREVIA.html permite navegar entre essas informações sem publicar, mantendo as pastas images e CALCULADORA ao lado.
Os novos espaços manuais de publicidade ficam ocultos e desativados; não há IDs de blocos configurados. O Blogger pode inserir o código de anunciante associado à conta independentemente desses espaços. A monetização e a aprovação são administradas pelo Google, separadamente. Consulte ATIVAR-ADSENSE.txt.

CATÁLOGO
20 serviços em 6 categorias: Impressões e cópias; Plastificação; Papelaria e documentos; Comunicação visual; Agendamentos; Personalizados e estampas.
Talões de recibos de aluguel: 50 a 100 folhas por talão.
WhatsApp: (81) 99609-0928.

O pedido só é enviado quando o cliente toca em Enviar no WhatsApp. Valores, prazos e disponibilidade são confirmados no atendimento. Agendamentos dependem da disponibilidade do órgão responsável.

As imagens são artes ilustrativas da R&N, não fotografias de trabalhos realizados. O tema apresenta um catálogo e páginas informativas. Ele não lista postagens ou comentários do blog. As fontes são incluídas no XML. O tema foi validado localmente; instalar o arquivo é uma ação feita na sua conta do Blogger.
'''
(output / 'LEIA-ME.txt').write_text(readme, encoding='utf-8')
archive = output / 'RN-Grafica-Rapida-Blogger.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED) as z:
    z.write(theme, theme.name)
    z.write(output / 'LEIA-ME.txt', 'LEIA-ME.txt')
    z.write(blogger / 'previa.html', 'PREVIA.html')
    z.write(blogger / 'ATIVAR-ADSENSE.txt', 'ATIVAR-ADSENSE.txt')
    z.write(blogger / 'COMO-INSTALAR.md', 'COMO-INSTALAR.md')
    z.write(blogger / 'CALCULADORA-INSTALAR.txt', 'CALCULADORA-INSTALAR.txt')
    z.write(root / 'public/calculadora.html', 'CALCULADORA/RN-Calculadora-Publica.html')
    for extra in sorted((blogger / 'calculadora').glob('*.txt')):
        z.write(extra, f'CALCULADORA/{extra.name}')
    for page_file in sorted((blogger / 'paginas').iterdir()):
        if page_file.is_file():
            z.write(page_file, f'PAGINAS/{page_file.name}')
    for license_file in sorted((root / 'licenses').glob('*.txt')):
        z.write(license_file, f'LICENCAS/{license_file.name}')
    for image in sorted((root / 'public/images').glob('*.webp')):
        z.write(image, f'images/{image.name}')
with ZipFile(archive) as z:
    assert z.testzip() is None
    assert z.read(theme.name) == theme.read_bytes()
print(f'XML válido: {theme.stat().st_size:,} bytes; ZIP verificado: {archive.stat().st_size:,} bytes.')
