import test from 'node:test';
import assert from 'node:assert/strict';
import { validAdsConfig, initAds } from '../src/ads.js';
import { adsConfig } from '../src/ads.config.js';

test('a distribuição não ativa publicidade sem aprovação e IDs confirmados', () => {
  assert.equal(adsConfig.enabled, false);
  assert.equal(adsConfig.client, '');
  assert.equal(validAdsConfig(adsConfig), false);
  // Sem DOM ou rede em Node: o modo desativado deve sair antes de acessar o navegador.
  assert.doesNotThrow(() => initAds());
});
test('habilitação explícita exige cliente e ambos os blocos públicos válidos', () => {
  const example = { enabled: true, client: 'ca-pub-0000000000000000', slots: {home:'0000000000',article:'0000000001'} };
  assert.equal(validAdsConfig(example), true);
  assert.equal(validAdsConfig({...example, enabled:false}), false);
  assert.equal(validAdsConfig({...example, client:''}), false);
  assert.equal(validAdsConfig({...example, slots:{home:'0000000000',article:''}}), false);
  assert.equal(validAdsConfig({...example, client:'https://example.com'}), false);
});
