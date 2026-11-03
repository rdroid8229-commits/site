import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync('src/privacy-consent.js', 'utf8');
const bootstrap = readFileSync('scripts/export-blogger.mjs', 'utf8');

test('revogação mantém atualização explícita do Consent Mode', () => {
  assert.match(source, /updateConsent\(value === 'accepted'\)/);
  assert.match(bootstrap, /analytics_storage': accepted \? 'granted' : 'denied'/);
});
test('recusa chama limpeza de cookies GA4 acessíveis', () => {
  assert.match(source, /if \(value === 'rejected'\) clearAccessibleAnalyticsCookies\(\)/);
  assert.match(source, /\^_ga/);
  assert.match(source, /Max-Age=0/);
});
test('não apaga armazenamento inteiro nem cookies indiscriminadamente', () => {
  assert.doesNotMatch(source, /localStorage\.clear\s*\(/);
  assert.match(source, /\.filter\(name =>/);
});
test('preferência permanece salva', () => {
  assert.match(source, /localStorage\.setItem\(KEY, choice\)/);
});
