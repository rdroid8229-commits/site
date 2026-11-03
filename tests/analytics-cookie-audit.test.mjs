import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync('src/privacy-consent.js', 'utf8');
const bootstrap = readFileSync('scripts/export-blogger.mjs', 'utf8');

test('revogação mantém atualização explícita do Consent Mode', () => {
  assert.match(source, /updateConsent\(value === 'accepted'\)/);
  assert.match(bootstrap, /analytics_storage': accepted \? 'granted' : 'denied'/);
});

test('auditoria: o código não contém remoção explícita de cookies existentes', t => {
  const removesCookies = /document\.cookie\s*=|cookieStore\.delete\s*\(/.test(source);
  if (!removesCookies) {
    t.diagnostic('LACUNA IDENTIFICADA: revogar o consentimento atualiza o estado, mas não executa remoção explícita dos cookies _ga/_ga_* já existentes.');
  }
  assert.equal(removesCookies, false, 'Este teste registra o comportamento atual; se houver correção, atualize a auditoria e acrescente testes de remoção.');
});

test('auditoria: não tenta apagar cookies de terceiros nem dados do Blogger', () => {
  assert.doesNotMatch(source, /document\.cookie\s*=/);
  assert.doesNotMatch(source, /localStorage\.clear\s*\(/);
});

test('auditoria: preferência é guardada localmente e pode ser substituída', () => {
  assert.match(source, /localStorage\.setItem\(KEY, choice\)/);
  assert.match(source, /saveChoice\(value\)/);
});
