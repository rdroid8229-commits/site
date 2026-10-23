import { readFile, readdir, mkdir, writeFile, cp } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const files = await readdir(resolve(dist, 'assets'));
const cssFile = files.find(file => /^index-.*\.css$/.test(file));
const jsFile = files.find(file => /^index-.*\.js$/.test(file));
if (!cssFile || !jsFile) throw new Error('Execute o build antes da exportação.');
let css = await readFile(resolve(dist, 'assets', cssFile), 'utf8');
for (const match of [...css.matchAll(/url\(([^)]+)\)/g)]) {
  const url = match[1].replace(/^["']|["']$/g, '');
  if (url.startsWith('data:')) continue;
  const name = url.split('/').pop();
  if (!name.endsWith('.woff2')) throw new Error(`Recurso CSS inesperado: ${url}`);
  const font = await readFile(resolve(dist, 'assets', name));
  css = css.replace(match[0], `url(data:font/woff2;base64,${font.toString('base64')})`);
}
const js = await readFile(resolve(dist, 'assets', jsFile), 'utf8');
const assetBase = 'https://raw.githubusercontent.com/rdroid8229-commits/site/main/public/images/';
if (!js.includes(assetBase)) throw new Error('Use npm run build:blogger para definir as URLs públicas das artes.');
if (/\b(?:import|export)\s*(?:["'{*]|\()/.test(js)) throw new Error('O tema deve usar um único JavaScript sem módulos externos.');
const cdata = text => text.replaceAll(']]>', ']]]]><![CDATA[>');
const favicon = (await readFile(resolve(dist, 'favicon.svg'))).toString('base64');
const head = `<meta charset='UTF-8'/><meta name='viewport' content='width=device-width,initial-scale=1'/><meta name='theme-color' content='#f8f7f3'/><title>R&amp;N Gráfica Rápida — Produtos e serviços</title><meta name='description' content='Impressões e xerox, plastificação, papelaria e documentos, banners, agendamentos e personalizados. Conheça os serviços da R&amp;N Gráfica Rápida e peça seu orçamento pelo WhatsApp.'/><link rel='icon' type='image/svg+xml' href='data:image/svg+xml;base64,${favicon}'/>`;
const fallback = `<noscript><div style='max-width:750px;margin:50px auto;padding:24px;font-family:Arial,sans-serif'><h1>R&amp;N Gráfica Rápida</h1><p>Impressões e xerox em papel ofício, papel fotográfico, papel adesivo e papel-cartão. Plastificação de documentos e folhas A4 inteiras. Cartões de visita, talões de recibos de aluguel com 50 a 100 folhas, contratos de aluguel e declarações de residência. Cartazes A4, banners, apoio em agendamentos no CRAS, para identidade e para título de eleitor. Canecas, camisas, estampas personalizadas, sublimação total e DTF.</p><p>Ative o JavaScript para explorar as categorias e montar o pedido.</p><p>Peça um orçamento informando a quantidade de peças ou o serviço desejado. Tire suas dúvidas pelo nosso WhatsApp.</p><a href='https://wa.me/5581996090928' target='_blank' rel='noopener noreferrer'>WhatsApp: (81) 99609-0928</a></div></noscript>`;
const theme = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr' lang='pt-BR' b:responsive='true' b:css='false'>
<head>${head}<b:include data='blog' name='all-head-content'/><b:skin><![CDATA[]]></b:skin>
<style type='text/css'>/*<![CDATA[*/
${cdata(css)}
/*]]>*/</style></head>
<body><div id='app'></div>${fallback}<b:section id='bloggerreserved' class='bloggerreserved' showaddelement='no'/>
<script type='text/javascript'>
//<![CDATA[
${cdata(js)}
//]]>
</script></body></html>
<!-- FIM DO TEMA R&N 2.0 -->
`;
const previewJS = js.replaceAll(assetBase, './images/');
const preview = `<!doctype html><html lang='pt-BR'><head>${head}<style>${css}</style></head><body><div id='app'></div>${fallback}<script>${previewJS.replaceAll('</script', '<\\/script')}</script></body></html>`;
const blogger = resolve(root, 'blogger');
await mkdir(resolve(blogger, 'downloads'), { recursive: true });
await writeFile(resolve(blogger, 'tema-rn-grafica.xml'), theme);
await writeFile(resolve(blogger, 'tema-corrigido.xml'), theme);
await writeFile(resolve(blogger, 'downloads', 'RN-Grafica-Rapida-Blogger.xml'), theme);
await writeFile(resolve(blogger, 'previa.html'), preview);
await cp(resolve(root, 'public/images'), resolve(blogger, 'images'), { recursive: true });
execFileSync('python3', [resolve(root, 'scripts/package-blogger.py')], { stdio: 'inherit' });
console.log('Tema 2.0 exportado com CSS compatível, fontes incluídas e seis artes R&N.');
