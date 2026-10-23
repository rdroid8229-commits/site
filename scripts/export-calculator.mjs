import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculatorPrivacy } from '../src/calculator-page.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let html = await readFile(resolve(root, 'calculator/source.html'), 'utf8');
const replace = (before, after) => {
  if (!html.includes(before)) throw new Error(`Trecho da calculadora não encontrado: ${before.slice(0, 70)}`);
  html = html.replace(before, after);
};
replace('Calculadora privada de produção da R&N Gráfica Rápida.', 'Calculadora de produção da R&N Gráfica Rápida.');
replace('<meta name="robots" content="noindex,nofollow">', '<meta name="robots" content="index,follow">');
replace('Versão para uso local', 'Seus dados neste navegador');
replace('Arquivo local</span>', 'Calculadora on-line</span>');
replace('Tabela da R&N Gráfica Rápida', 'Tabela de referência da R&N');
replace('O total é arredondado em centavos somente após calcular toda a área cobrada.', 'O total é arredondado em centavos após calcular toda a área cobrada. Confirme materiais, acabamento, disponibilidade e prazo no atendimento.');
// O endereço about:srcdoc herda a origem do Blogger, mas location.origin é "null".
replace("if(event.origin!==window.location.origin||event.source!==frame.contentWindow||event.data?.type!=='rn-costs-height')return;", "let origin=window.location.origin;try{if(origin==='null'&&parent!==window)origin=parent.location.origin}catch{}\n  if(event.origin!==origin||event.source!==frame.contentWindow||event.data?.type!=='rn-costs-height')return;");
// Fragmentos continuam navegáveis em arquivo local e na página incorporada.
replace("if(updateHash&&window.history?.replaceState)window.history.replaceState(null,'',hashes[mode]);", "if(updateHash&&window.history?.replaceState){try{window.history.replaceState(null,'',hashes[mode])}catch{window.location.hash=hashes[mode]}}");
const extraStyle = `
.rn-public-contact{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;border-top:1px solid #e6e9ef;padding:23px 0;margin-top:22px}.rn-public-contact p{font-size:12px;line-height:1.8;color:#6b778d;max-width:640px}.rn-public-contact .button{white-space:normal}.rn-embedded .app-shell{min-height:0}.rn-embedded body{min-height:0}.rn-embedded .sidebar{position:absolute}.rn-embedded .sidebar-bottom{padding-bottom:20px}@media(max-width:760px){.rn-embedded .sidebar{position:relative}}@media print{.rn-public-contact{display:none!important}}
`;
replace('</style>', extraStyle + '</style>');
const contact = `<section class="rn-public-contact" aria-label="Atendimento da R&N"><div><h2>Precisa produzir seu material?</h2><p>Peça um orçamento informando a quantidade de peças ou o serviço desejado. Tire suas dúvidas pelo nosso WhatsApp. As configurações e os cadastros desta calculadora ficam no navegador de quem a utiliza.</p></div><a class="button blue" href="https://wa.me/5581996090928" target="_blank" rel="noopener noreferrer">Falar com a R&amp;N no WhatsApp</a><a class="button secondary" href="https://rngraficarapida.blogspot.com/" target="_top">Ver produtos e serviços</a></section>`;
replace('<footer class="page-footer">', contact + '<footer class="page-footer">');
const resizeScript = `<script>
(function(){
  if(!window.frameElement)return;
  document.documentElement.classList.add('rn-embedded');
  let queued=false;
  const resize=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;const h=Math.min(40000,Math.max(760,Math.ceil(document.body.scrollHeight+12)));if(Math.abs(window.frameElement.getBoundingClientRect().height-h)>2)window.frameElement.style.height=h+'px'})};
  new ResizeObserver(resize).observe(document.body);
  new MutationObserver(resize).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','style']});
  window.addEventListener('load',resize);resize();
})();
</script>`;
replace('</body>', resizeScript + '</body>');

const escapeAttribute = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const fragment = `<div class="article-body rn-calculator-page"><p class="article-lead">Encaixe de peças, preço por metro quadrado e cálculo de custos e margens.</p><p>Use a ferramenta para planejar seu material. Os valores são estimativas; confirme seu pedido com a R&amp;N. Seus cadastros ficam neste navegador, sem sincronização automática. Para transferi-los, use Exportar e Importar backup na área de custos.</p><iframe data-rn-calculator="embedded" title="Calculadora de produção da R&amp;N Gráfica Rápida" srcdoc="${escapeAttribute(html)}" style="display:block;width:100%;height:1800px;border:0" allow="clipboard-write" loading="eager"></iframe></div>\n`;
await mkdir(resolve(root, 'blogger/paginas'), { recursive: true });
await mkdir(resolve(root, 'blogger/calculadora'), { recursive: true });
await writeFile(resolve(root, 'public/calculadora.html'), html);
await writeFile(resolve(root, 'blogger/paginas/07-calculadora.html'), fragment);
await writeFile(resolve(root, 'blogger/paginas/07-calculadora.txt'), fragment);
await writeFile(resolve(root, 'blogger/calculadora/PRIVACIDADE-ADICIONAL.txt'), calculatorPrivacy + '\n');
console.log('Calculadora completa exportada: arquivo independente e página HTML para o Blogger.');
