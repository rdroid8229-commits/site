import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const file = 'blogger/paginas/EDITOR-DE-FOTOS-ON-LINE-PROPOSTA.html';
const html = readFileSync(file, 'utf8');

test('iframe preserves the existing editor URL and closes attributes', () => {
  const iframe = html.match(/<iframe\b([\s\S]*?)><\/iframe>/i);
  assert.ok(iframe, 'iframe must have opening and closing tags');
  assert.match(iframe[1], /src="https:\/\/rdroid8229-commits\.github\.io\/rn-photo-editor\/\?versao=4"/);
  assert.match(iframe[1], /title="[^"]+"/);
  assert.match(iframe[1], /loading="eager"/);
  assert.doesNotMatch(iframe[1], /src="[^"]*\n[^"]*"/);
});

test('page includes responsive frame sizing and safe fallback link', () => {
  assert.match(html, /\.rn-photo-stage\s*\{[^}]*width:calc\(100vw - 32px\)/);
  assert.match(html, /max-width:1200px/);
  assert.match(html, /\.rn-photo-frame\s*\{[^}]*width:100%/);
  assert.match(html, /@media\(max-width:767px\)/);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /Abrir editor em uma nova aba/);
});

test('page has editorial instructions and no ad placements', () => {
  for (const phrase of ['Como usar o editor de fotos', 'Perguntas frequentes', 'Dicas para preparar fotografias', 'Salvar JPG', 'Salvar PNG']) {
    assert.ok(html.includes(phrase), 'Missing: ' + phrase);
  }
  assert.doesNotMatch(html, /adsbygoogle|data-ad-position|pagead2\.googlesyndication/i);
});

test('page remains a fragment and does not overwrite theme or editor app', () => {
  assert.doesNotMatch(html, /<!doctype|<html|<body|<script/i);
  assert.equal((html.match(/<iframe\b/g)||[]).length, 1);
  assert.equal((html.match(/<\/iframe>/g)||[]).length, 1);
});
