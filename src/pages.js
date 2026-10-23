import { business } from './site.config.js';
import { categories } from './catalog.js';
import { createPages } from './page-content.js';
export const pages = createPages(business, Object.fromEntries(categories.map(c => [c.id, c.image])));
export const guides = pages.filter(page => page.type === 'guide');
export const pageBySlug = slug => pages.find(page => page.slug === slug);
export const isPreview = () => location.protocol === 'file:' || Boolean(window.__RN_PREVIEW__);
export const isBloggerPage = () => Boolean(window.__RN_BLOGGER__) && !isPreview() && /^\/p\/[^/]+\.html$/.test(location.pathname);
export const pageHref = slug => isPreview() ? `#pagina/${slug}` : `/p/${slug}.html`;
export const currentPage = () => {
  const hash = location.hash.match(/^#pagina\/([a-z0-9-]+)$/);
  const path = location.pathname.match(/^\/p\/([a-z0-9-]+)\.html$/);
  return pageBySlug(hash?.[1] || path?.[1]);
};
