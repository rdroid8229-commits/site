from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parent.parent
blogger = root / 'blogger'
output = blogger / 'downloads'
theme = output / 'RN-Grafica-Rapida-Blogger.xml'
ET.parse(theme)
readme = '''R&N Gráfica Rápida — Tema 2.0 para Blogger

INSTALAÇÃO
1. Extraia o ZIP.
2. Entre no Blogger e selecione seu blog.
3. Abra Tema e faça backup do tema atual.
4. No menu ao lado de Personalizar, escolha Restaurar.
5. Envie RN-Grafica-Rapida-Blogger.xml e aguarde a confirmação.
6. Clique em Ver blog e atualize a página para conferir a nova versão.

Se Restaurar não estiver disponível, use Tema > Editar HTML e substitua o código pelo XML completo. Salve.

PRÉVIA
Abra PREVIA.html mantendo a pasta images ao lado. As seis artes estão incluídas para essa prévia. No Blogger, o tema usa as imagens publicadas no repositório rdroid8229-commits/site; não é necessário enviá-las separadamente.

CATÁLOGO
20 serviços em 6 categorias: Impressões e cópias; Plastificação; Papelaria e documentos; Comunicação visual; Agendamentos; Personalizados e estampas.
Talões de recibos de aluguel: 50 a 100 folhas por talão.
WhatsApp: (81) 99609-0928.

O pedido só é enviado quando o cliente toca em Enviar no WhatsApp. Valores, prazos e disponibilidade são confirmados no atendimento. Agendamentos dependem da disponibilidade do órgão responsável.

As imagens são artes ilustrativas da R&N, não fotografias de trabalhos realizados. O tema apresenta uma página de serviços e não lista postagens ou comentários do blog. As fontes são incluídas no XML. O tema foi validado localmente; instalar o arquivo é uma ação feita na sua conta do Blogger.
'''
(output / 'LEIA-ME.txt').write_text(readme, encoding='utf-8')
archive = output / 'RN-Grafica-Rapida-Blogger.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED) as z:
    z.write(theme, theme.name)
    z.write(output / 'LEIA-ME.txt', 'LEIA-ME.txt')
    z.write(blogger / 'previa.html', 'PREVIA.html')
    for license_file in sorted((root / 'licenses').glob('*.txt')):
        z.write(license_file, f'LICENCAS/{license_file.name}')
    for image in sorted((root / 'public/images').glob('*.webp')):
        z.write(image, f'images/{image.name}')
with ZipFile(archive) as z:
    assert z.testzip() is None
    assert z.read(theme.name) == theme.read_bytes()
print(f'XML válido: {theme.stat().st_size:,} bytes; ZIP verificado: {archive.stat().st_size:,} bytes.')
