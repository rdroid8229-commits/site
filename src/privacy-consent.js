// Consentimento opcional para medição de audiência (GA4).
// Não altera cookies ou scripts que o próprio Blogger/Google possa carregar.
const KEY = 'rn_analytics_consent_v1';
function readChoice() { try { return localStorage.getItem(KEY); } catch { return null; } }
function saveChoice(choice) { try { localStorage.setItem(KEY, choice); } catch { /* armazenamento indisponível */ } }
function updateConsent(accepted) {
  if (typeof window.rnUpdateAnalyticsConsent === 'function') {
    window.rnUpdateAnalyticsConsent(accepted);
  } else if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: accepted ? 'granted' : 'denied' });
  }
}
export function initPrivacyConsent(privacyUrl) {
  const panel = document.createElement('section');
  panel.className = 'rn-consent-panel';
  panel.setAttribute('aria-label', 'Preferências de privacidade');
  panel.innerHTML = `<h2>Privacidade e cookies</h2>
    <p>Usamos o Google Analytics para medir visitas. Com sua autorização, ele usa cookies; sem ela, poderá enviar sinais limitados sem cookies. O Blogger pode utilizar tecnologias próprias. <a href="${privacyUrl}">Leia nossa Política de Privacidade</a>.</p>
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
  function choose(value) { saveChoice(value); updateConsent(value === 'accepted'); close(); }
  panel.addEventListener('click', event => {
    const action = event.target.closest('[data-consent]')?.dataset.consent;
    if (action === 'accept') choose('accepted');
    if (action === 'reject') choose('rejected');
    if (action === 'settings') { settings.hidden = !settings.hidden; checkbox.focus(); }
    if (action === 'save') choose(checkbox.checked ? 'accepted' : 'rejected');
  });
  reopen.addEventListener('click', show);
  const choice = readChoice();
  if (choice === 'accepted') { updateConsent(true); close(); }
  else if (choice === 'rejected') close();
  else show();
}
