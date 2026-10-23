import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPages } from '../src/page-content.js';
import { business } from '../src/site.config.js';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(resolve(root, 'src/images.json'), 'utf8'));
const base = 'https://raw.githubusercontent.com/rdroid8229-commits/site/main/public/images/';
const pages = createPages(business, Object.fromEntries(Object.entries(manifest).map(([key,value])=>[key,base+value])));
const out = resolve(root, 'blogger/paginas');
await mkdir(out, { recursive: true });
const escape = text => text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const index = ['PÁGINAS PARA CRIAR NO BLOGGER — R&N GRÁFICA RÁPIDA', '', 'Crie ou edite as seis páginas em Blogger > Páginas. Para cada uma, use o título indicado, alterne o editor para a visualização HTML e cole o conteúdo do arquivo .txt correspondente. Publique a página. Os arquivos .html têm o mesmo conteúdo para consulta.', '', 'Não cole estes arquivos na área Tema. Eles contêm somente o corpo de cada página. O tema é o XML da raiz do ZIP.', '', 'Se já existir uma página com o mesmo assunto, edite-a em vez de criar uma cópia. Confira a URL final: ela precisa coincidir com o endereço indicado. Se o Blogger acrescentar um sufixo ao endereço, os links do tema precisarão ser ajustados.', ''];
for (const [i,page] of pages.entries()) {
  const filename = `${String(i+1).padStart(2,'0')}-${page.slug}`;
  const image = page.image ? `<img class="article-hero" src="${page.image}" alt="Arte ilustrativa R&amp;N Gráfica: ${escape(page.title)}." width="1080" height="720"/>` : '';
  const fragment = `<!-- Título da página: ${page.title}. URL esperada: /p/${page.slug}.html -->\n<div class="article-body">${image}${page.body}</div>\n`;
  await writeFile(resolve(out,filename+'.html'), fragment);
  await writeFile(resolve(out,filename+'.txt'), fragment);
  index.push(`Título: ${page.title}`,`Endereço esperado: https://rngraficarapida.blogspot.com/p/${page.slug}.html`,`Arquivo para copiar: ${filename}.txt`,`Descrição sugerida: ${page.description}`,'');
}
index.push('Antes de publicar a política de privacidade, confira se o texto corresponde ao atendimento e às ferramentas realmente usadas pela gráfica. O contato divulgado é somente o WhatsApp (81) 99609-0928. Não foram inventados endereço, e-mail ou CNPJ.', '', 'Preparar conteúdo e posições de publicidade não garante aprovação do Google AdSense. Os novos blocos do tema permanecem desativados porque a conta ainda não foi aprovada e os IDs públicos não foram informados.');
await writeFile(resolve(out,'COMECE-AQUI.txt'),index.join('\n')+'\n');
console.log('Seis páginas exportadas: Sobre, Contato, Privacidade e três guias.');
