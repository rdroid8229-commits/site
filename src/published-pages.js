// Consulta somente páginas públicas da própria hospedagem, sem enviar cookies.
export async function loadPublishedPage(pathname, fetcher = fetch) {
  if (!/^\/p\/[^/]+\.html$/.test(pathname)) throw new Error('Endereço de página inválido.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetcher('/feeds/pages/default?alt=json&max-results=150', {
      credentials: 'omit', cache: 'no-store', signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('Não foi possível consultar as páginas públicas.');
    const data = await response.json();
    const entries = data.feed?.entry;
    if (!Array.isArray(entries)) throw new Error('Nenhuma página pública encontrada.');
    const entry = entries.find(item => item.link?.some(link => {
      if (link.rel !== 'alternate' || !link.href) return false;
      try { return new URL(link.href).pathname === pathname; }
      catch { return false; }
    }));
    const title = entry?.title?.$t;
    const body = entry?.content?.$t;
    if (typeof title !== 'string' || !title.trim() || typeof body !== 'string' || !body.trim()) {
      throw new Error('Página sem conteúdo publicado.');
    }
    return { title, body };
  } finally {
    clearTimeout(timeout);
  }
}
