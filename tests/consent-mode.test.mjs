import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
const xml = readFileSync('blogger/downloads/RN-Grafica-Rapida-Blogger.xml', 'utf8');
const match = [...xml.matchAll(/<script type='text\/javascript'>\s*\/\/<!\[CDATA\[([\s\S]*?)\/\/\]\]>\s*<\/script>/g)];
test('Consent Mode: script de padrões anterior ao cabeçalho do Blogger', () => {
  assert.ok(xml.indexOf("gtag('consent', 'default'") > 0);
  assert.ok(xml.indexOf("gtag('consent', 'default'") < xml.indexOf("name='all-head-content'"));
  for (const key of ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization']) {
    assert.match(xml, new RegExp("'"+key+"': 'denied'"));
  }
});
test('Consent Mode: JavaScript embutido sem erro de sintaxe', () => {
  assert.ok(match.length >= 2);
  for (const [,script] of match) new Script(script);
});
test('Consent Mode: identificador único na configuração própria', () => {
  assert.match(xml, /G-95RKPEGCS9/);
  assert.match(xml, /window\.rnUpdateAnalyticsConsent/);
  assert.match(xml, /analytics_storage': accepted \? 'granted' : 'denied'/);
  assert.ok(xml.indexOf("gtag('consent', 'default'") < xml.indexOf("gtag('config', ID)"));
});
test('Consent Mode: não habilita anúncios personalizados', () => {
  assert.doesNotMatch(xml, /'ad_personalization': 'granted'/);
  assert.doesNotMatch(xml, /'ad_user_data': 'granted'/);
});
