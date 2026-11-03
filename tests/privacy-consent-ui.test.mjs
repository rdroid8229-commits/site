import test from 'node:test';
import assert from 'node:assert/strict';
import { initPrivacyConsent } from '../src/privacy-consent.js';

function setup(initial = null) {
  const store = new Map(initial ? [['rn_analytics_consent_v1', initial]] : []);
  const calls = [];
  const nodes = [];
  globalThis.localStorage = {
    getItem(key) { return store.get(key) ?? null; },
    setItem(key, value) { store.set(key, value); },
  };
  globalThis.window = { rnUpdateAnalyticsConsent(value) { calls.push(value); } };
  globalThis.document = {
    body: { append(...elements) { nodes.push(...elements); } },
    createElement(tag) {
      const node = {
        tag, hidden: false, attrs: {}, listeners: {},
        setAttribute(k,v) { this.attrs[k] = v; },
        addEventListener(k,fn) { this.listeners[k] = fn; },
        querySelector(selector) {
          if (!this.children) {
            this.children = {
              '[data-analytics-check]': { checked: false, focus() {} },
              '.rn-consent-settings': { hidden: true },
            };
          }
          return this.children[selector];
        },
      };
      return node;
    },
  };
  initPrivacyConsent('/p/privacidade.html');
  const [panel, reopen] = nodes;
  function click(action) {
    panel.listeners.click({ target: { closest() { return { dataset: { consent: action } }; } } });
  }
  function reopenPanel() { reopen.listeners.click(); }
  return { panel, reopen, click, reopenPanel, store, calls, checkbox: panel.querySelector('[data-analytics-check]'), settings: panel.querySelector('.rn-consent-settings') };
}
test('visitante novo vê painel e nenhuma autorização é concedida', () => {
  const s = setup();
  assert.equal(s.panel.hidden, false);
  assert.equal(s.reopen.hidden, true);
  assert.deepEqual(s.calls, []);
});
test('aceitar concede consentimento e guarda preferência', () => {
  const s = setup();
  s.click('accept');
  assert.equal(s.store.get('rn_analytics_consent_v1'), 'accepted');
  assert.deepEqual(s.calls, [true]);
  assert.equal(s.panel.hidden, true);
});
test('recusar nega consentimento e guarda preferência', () => {
  const s = setup();
  s.click('reject');
  assert.equal(s.store.get('rn_analytics_consent_v1'), 'rejected');
  assert.deepEqual(s.calls, [false]);
});
test('configurar permite escolher e salvar', () => {
  const s = setup();
  s.click('settings');
  assert.equal(s.settings.hidden, false);
  s.checkbox.checked = true;
  s.click('save');
  assert.deepEqual(s.calls, [true]);
});
test('preferência aceita é restaurada e pode ser revogada', () => {
  const s = setup('accepted');
  assert.deepEqual(s.calls, [true]);
  assert.equal(s.panel.hidden, true);
  s.reopenPanel();
  assert.equal(s.panel.hidden, false);
  assert.equal(s.checkbox.checked, true);
  s.click('reject');
  assert.deepEqual(s.calls, [true, false]);
  assert.equal(s.store.get('rn_analytics_consent_v1'), 'rejected');
});
test('preferência recusada não concede consentimento ao reabrir', () => {
  const s = setup('rejected');
  assert.deepEqual(s.calls, []);
  assert.equal(s.panel.hidden, true);
  s.reopenPanel();
  assert.equal(s.checkbox.checked, false);
});
