import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPublishedPage } from '../src/published-pages.js';

const entry = (slug, title, body) => ({
  title: { $t: title }, content: { $t: body },
  link: [{ rel: 'alternate', href: `https://rngraficarapida.blogspot.com/p/${slug}.html` }],
});
const response = entries => ({ ok: true, json: async () => ({ feed: { entry: entries } }) });

test('usa o título e o corpo realmente publicados, sem mandar cookies', async () => {
  const edited = entry('sobre', 'Sobre editada', '<p>Texto atualizado no painel.</p>');
  const result = await loadPublishedPage('/p/sobre.html', async (url, options) => {
    assert.equal(url, '/feeds/pages/default?alt=json&max-results=150');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.cache, 'no-store');
    return response([entry('contato', 'Contato', '<p>Outra página.</p>'), edited]);
  });
  assert.deepEqual(result, { title: 'Sobre editada', body: '<p>Texto atualizado no painel.</p>' });
});

test('não apresenta uma demonstração para uma página ausente ou com falha', async () => {
  await assert.rejects(loadPublishedPage('/p/ausente.html', async () => response([entry('sobre', 'Sobre', '<p>Sobre.</p>')])));
  await assert.rejects(loadPublishedPage('/p/sobre.html', async () => ({ ok: false, status: 403 })));
  await assert.rejects(loadPublishedPage('/p/sobre.html', async () => response([entry('sobre', 'Sobre', '')])));
  await assert.rejects(loadPublishedPage('/p/sobre.html', async () => ({ ok: true, json: async () => ({}) })));
});

test('não reinterpreta código salvo como texto nem aceita endereços fora de páginas', async () => {
  const body = '<p>&lt;h2&gt;Conteúdo colado como texto&lt;/h2&gt;</p>';
  assert.equal((await loadPublishedPage('/p/privacidade.html', async () => response([entry('privacidade', 'Privacidade', body)]))).body, body);
  await assert.rejects(loadPublishedPage('/search', async () => { throw new Error('Não deve consultar.'); }));
});
