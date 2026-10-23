import { adsConfig } from './ads.config.js';

export function validAdsConfig(config) {
  return config.enabled === true && /^ca-pub-\d{16}$/.test(config.client) && /^\d{6,20}$/.test(config.slots?.home || '') && /^\d{6,20}$/.test(config.slots?.article || '');
}
export function initAds() {
  if (!validAdsConfig(adsConfig) || location.protocol !== 'https:' || window.__RN_PREVIEW__) return;
  const existing = document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
  if (existing) {
    const existingClient = new URL(existing.src, location.href).searchParams.get('client');
    if (existingClient && existingClient !== adsConfig.client) return;
  }
  const regions = [...document.querySelectorAll('[data-ad-position]')].filter(region => region.dataset.adEligible !== 'false' && !region.parentElement.closest('[hidden]'));
  if (!regions.length) return;
  const initialize = region => {
    if (region.dataset.adInitialized) return;
    region.dataset.adInitialized = 'true';
    region.hidden = false;
    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.dataset.adClient = adsConfig.client;
    ad.dataset.adSlot = adsConfig.slots[region.dataset.adPosition];
    ad.dataset.adFormat = 'auto';
    ad.dataset.fullWidthResponsive = 'true';
    region.append(ad);
    const observer = new MutationObserver(() => {
      if (ad.dataset.adStatus === 'unfilled') { region.hidden = true; observer.disconnect(); }
    });
    observer.observe(ad, { attributes: true, attributeFilter: ['data-ad-status'] });
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  };
  // Anúncios somente em posições editoriais, sem blocos flutuantes ou sobre o orçamento.
  regions.forEach(initialize);
  if (!existing && !document.querySelector('#rn-adsense-loader')) {
    const script = document.createElement('script');
    script.id = 'rn-adsense-loader';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsConfig.client)}`;
    document.head.append(script);
  }
}
