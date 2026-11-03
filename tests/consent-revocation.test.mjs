import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const xml = readFileSync('blogger/downloads/RN-Grafica-Rapida-Blogger.xml', 'utf8');
const blocks = [...xml.matchAll(/<script type='text\/javascript'>\s*\/\/<!\[CDATA\[([\s\S]*?)\/\/\]\]>\s*<\/script>/g)].map(m => m[1]);
function harness() {
  const queue = [];
  const tags = [];
  const document = {
    querySelector(selector) { return tags.find(t => selector.includes(t.src)) || null; },
    createElement(tag) { return { tag }; },
    head: { appendChild(tag) { tags.push(tag); } },
  };
  const window = { dataLayer: queue };
  runInNewContext(blocks[0], { window, document, Date });
  runInNewContext(blocks[1], { window, document, Date });
  return { window, queue, tags };
}
test('revogação: o consentimento muda de concedido para negado sem recarregar', () => {
  const s = harness();
  s.window.rnUpdateAnalyticsConsent(true);
  s.window.rnUpdateAnalyticsConsent(false);
  const updates = s.queue.filter(x => x[0] === 'consent' && x[1] === 'update');
  assert.equal(updates.length, 2);
  assert.equal(updates[0][2].analytics_storage, 'granted');
  assert.equal(updates[1][2].analytics_storage, 'denied');
});
test('revogação: permissões de anúncios permanecem negadas', () => {
  const s = harness();
  const defaults = s.queue.find(x => x[0] === 'consent' && x[1] === 'default')[2];
  for (const key of ['ad_storage','ad_user_data','ad_personalization']) assert.equal(defaults[key], 'denied');
  s.window.rnUpdateAnalyticsConsent(true);
  assert.deepEqual(Object.keys(s.queue.at(-1)[2]), ['analytics_storage']);
});
test('revogação: não carrega uma segunda tag no fluxo normal', () => {
  const s = harness();
  assert.equal(s.tags.length, 1);
  s.window.rnUpdateAnalyticsConsent(true);
  s.window.rnUpdateAnalyticsConsent(false);
  assert.equal(s.tags.length, 1);
});
