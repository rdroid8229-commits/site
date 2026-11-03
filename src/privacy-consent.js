// Consentimento opcional para medição de audiência (GA4).
// Não altera cookies ou scripts que o próprio Blogger/Google possa carregar.
const KEY = 'rn_analytics_consent_v1';
const ID = 'G-95RKPEGCS9';
function readChoice() { try { return localStorage.getItem(KEY); } catch { return null; } }
function saveChoice(choice) { try { localStorage.setItem(KEY, choice); } catch { /* armazenamento indisponível */ } }
function enableAnalytics() {
  if (typeof window.rnEnableAnalytics === 'function') { window.rnEnableAnalytics(); return; }
  if (window.__rnAnalyticsStarted) return;
  window.__rnAnalyticsStarted = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', ID);
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js?id=' + ID + '"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(script);
  }
}
export function initPrivacyConsent(privacyUrl) {
  const panel = document.createElement('section');
  panel.className = 'rn-consent-panel';
  panel.setAttribute('aria-label', 'Preferências de privacidade');
  panel.innerHTML = `<h2>Privacidade e cookies</h2>
    <p>Podemos usar o Google Analytics para entender quais páginas são mais úteis. Essa medição é opcional e só será ativada se você aceitar. O Blogger e outros serviços podem usar tecnologias próprias. <a href="${privacyUrl}">Leia nossa Política de Privacidade</a>.</p>
    <div class="rn-consent-actions">
      <button type="button" data-consent="reject">Recusar</button>
      <button type="button" data-consent="settings">Configurar</button>
      <button type="button" data-consent="accept" class="rn-consent-primary">Aceitar</button>
    </div>
    <div class="rn-consent-settings" hidden>
      <p><strong>Cookies essenciais:</strong> necessários aos recursos e serviços da plataforma, conforme suas próprias regras.</p>
      <label><input type="checkbox" data-analytics-check /> Permitir análise de visitas (Google Analytics)</label>
      <button type="button" data-consent="save">Salvar preferências</button>
    </div>`;
  const reopen = document.createElement('button');
  reopen.type = 'button';
  reopen.className = 'rn-consent-reopen';
  reopen.textContent = 'Privacidade e cookies';
  reopen.setAttribute('aria-label', 'Revisar preferências de privacidade e cookies');
  document.body.append(panel, reopen);
  const checkbox = panel.querySelector('[data-analytics-check]');
  const settings = panel.querySelector('.rn-consent-settings');
  function show() { checkbox.checked = readChoice() === 'accepted'; panel.hidden = false; reopen.hidden = true; }
  function close() { panel.hidden = true; reopen.hidden = false; }
  function choose(value) { saveChoice(value); if (value === 'accepted') enableAnalytics(); close(); }
  panel.addEventListener('click', event => {
    const action = event.target.closest('[data-consent]')?.dataset.consent;
    if (action === 'accept') choose('accepted');
    if (action === 'reject') choose('rejected');
    if (action === 'settings') { settings.hidden = !settings.hidden; checkbox.focus(); }
    if (action === 'save') choose(checkbox.checked ? 'accepted' : 'rejected');
  });
  reopen.addEventListener('click', show);
  const choice = readChoice();
  if (choice === 'accepted') { enableAnalytics(); close(); }
  else if (choice === 'rejected') close();
  else show();
}
