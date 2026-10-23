import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../public/calculadora.html', import.meta.url), 'utf8');
function modules(document, entry) {
  const script = [...document.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('const __modules='));
  assert.ok(script?.includes(`__require("${entry}");`));
  const context = {};
  vm.runInNewContext(script.replace(`__require("${entry}");`, 'globalThis.rnRequire=__require;'), context);
  return context.rnRequire;
}
const decode = s => s.replace(/&(?:amp|quot|lt|gt|#x[0-9a-f]+|#\d+);/gi, m => {
  const named = { '&amp;':'&', '&quot;':'"', '&lt;':'<', '&gt;':'>' };
  return named[m] ?? String.fromCodePoint(m.startsWith('&#x') ? parseInt(m.slice(3,-1),16) : Number(m.slice(2,-1)));
});
const main = modules(html, 'app.js');
const frame = html.match(/<iframe[^>]*id="costs-frame"[^>]*srcdoc="([\s\S]*?)"[^>]*>/);
assert.ok(frame);
const costs = modules(decode(frame[1]), 'costs-app.js')('cost-engine.js');
const production = main('calculator.js');
const area = main('area-calculator.js');
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-8, `${a} ≠ ${b}`);

test('encaixe mantém margens, sangria e arredondamento da tiragem', () => {
  const d = production.DEFAULTS;
  const r = production.calculate(d);
  assert.equal(r.layout.count,10); assert.equal(r.sheets,100);
  assert.equal(r.layout.cols,2); assert.equal(r.layout.rows,5);
  const last = production.calculate({...d,quantity:'1001'});
  assert.equal(last.sheets,101); assert.equal(last.lastSheet,1); assert.equal(last.extra,9);
  assert.equal(production.calculate({...d,quantity:'1.5'}).ok,false);
  assert.equal(production.calculate({...d,margin:'999'}).ok,false);
  assert.equal(production.calculate({...d,pieceW:'500',pieceH:'500'}).fits,false);
});

test('orientação automática e formas usam a grade e as áreas esperadas', () => {
  const d = production.DEFAULTS;
  const r = production.calculate({...d,sheetW:'10',sheetH:'20',pieceW:'6',pieceH:'9',bleed:'0',margin:'0'});
  assert.equal(r.layout.count,3); assert.equal(r.layout.rotated,true);
  const circle = production.calculate({...d,shape:'circle',pieceW:'5'});
  assert.equal(circle.layout.count,15); close(circle.pieceArea/1e8,Math.PI*25/4);
  const triangle = production.calculate({...d,shape:'triangle',pieceW:'6',pieceH:'5'});
  assert.equal(triangle.layout.count,15); close(triangle.pieceArea/1e8,15);
  const gap = production.calculate({...d,sheetW:'10',sheetH:'10',pieceW:'3',pieceH:'3',bleed:'0',margin:'0',gap:'10'});
  assert.equal(gap.layout.count,4);
});

test('preço por m² mantém a tabela, converte medidas e aplica mínimo por peça', () => {
  assert.equal(area.PRODUCTS.banner.rateCents,3500);
  assert.equal(area.PRODUCTS.adhesive.rateCents,3500);
  assert.equal(area.PRODUCTS.perforated.rateCents,4500);
  assert.equal(area.PRODUCTS.poster.rateCents,3000);
  const input={...area.AREA_DEFAULTS,width:'50',height:'30',quantity:'3'};
  const r=area.calculateArea(input); close(r.totalArea,.45); assert.equal(r.totalCents,1575);
  const minimum=area.calculateArea({...input,minimum:true}); assert.equal(minimum.billedArea,3);assert.equal(minimum.totalCents,10500);
  const converted=area.convertAreaUnit(input,'m');assert.equal(converted.width,'0.5');assert.equal(area.calculateArea(converted).totalCents,1575);
  assert.equal(area.calculateArea({...input,quantity:'1.5'}).ok,false);
  assert.equal(area.calculateArea({...input,width:'0'}).ok,false);
  assert.equal(area.calculateArea({...area.AREA_DEFAULTS,unit:'m',width:'0,333',height:'1',quantity:'3'}).totalCents,3497);
});

test('custos incluem material, tinta e desperdício e calculam margem sobre venda', () => {
  const p=costs.newCostProduct('Teste','Teste',50,'p');
  const materials=[{id:'m',name:'Papel',mode:'pack',value:50,count:500}];
  Object.assign(p,{recipe:[{materialId:'m',qty:2}],inkMode:'manual',inkManual:.05,waste:10,extra:.10,manual:1});
  const r=costs.calculateCost(p,materials,10);
  close(r.cost,.375);assert.equal(r.suggested,.75);close(r.profit,6.25);close(r.actualMargin,62.5);
  p.inkMode='auto';p.inkBottlePrice=100;p.inkBottleMl=100;p.inkUsageMl=.05;
  close(costs.calculateCost(p,materials).cost,r.cost);
  assert.throws(()=>costs.calculateCost(p,materials,.5));
  p.unit='m²';close(costs.calculateCost(p,materials,.5).totalCost,.1875);
});

test('backup valida estrutura e material de referência; os dados iniciais não trazem cadastros de clientes', () => {
  const d=costs.createCostDefaults();assert.equal(d.materials.length,0);assert.ok(d.products.length>20);
  assert.equal(costs.normalizeCostsData(d).products.length,d.products.length);
  const invalid=JSON.parse(JSON.stringify(d));invalid.products[0].recipe=[{materialId:'ausente',qty:1}];
  assert.throws(()=>costs.normalizeCostsData(invalid));
  assert.throws(()=>costs.normalizeCostsData({settings:{},materials:[],products:[]}));
});
