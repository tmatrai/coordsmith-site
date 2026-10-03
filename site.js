(() => {
  const languageLinks = [...document.querySelectorAll('[data-language]')];
  const language = document.documentElement.lang;
  const currentUrl = new URL(window.location.href);
  const explicitLanguage = currentUrl.searchParams.get('lang');
  const storeLanguage = value => {
    try { localStorage.setItem('coordsmith.language', value); } catch { /* Storage is optional. */ }
  };
  if (explicitLanguage === language) storeLanguage(language);
  // A localized URL is authoritative. Restore a saved language on homepage entry.
  if (!explicitLanguage && language === 'en' && currentUrl.pathname === new URL(languageLinks[0].href).pathname) {
    let preferred;
    try { preferred = localStorage.getItem('coordsmith.language'); } catch { /* Storage is optional. */ }
    if (preferred === 'hu' && languageLinks[0].pathname.endsWith('/') && !document.querySelector('main.legal')) {
      const destination = new URL(languageLinks[1].href);
      destination.search = currentUrl.search;
      destination.hash = currentUrl.hash;
      window.location.replace(destination.href);
      return;
    }
  }
  for (const link of languageLinks) {
    const destination = new URL(link.href);
    destination.search = currentUrl.search;
    destination.searchParams.set('lang', link.dataset.language);
    destination.hash = currentUrl.hash;
    link.href = destination.href;
    link.addEventListener('click', () => storeLanguage(link.dataset.language));
  }
  const button = document.querySelector('.theme-toggle');
  const label = document.querySelector('.theme-label');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem('coordsmith.appearance'); } catch { /* Storage is optional. */ }
  if (preference === 'light' || preference === 'dark') document.documentElement.dataset.theme = preference;
  const isDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : media.matches;
  const appearance = language === 'hu'
    ? { light: 'Világos', dark: 'Sötét', useLight: 'Világos megjelenés használata', useDark: 'Sötét megjelenés használata' }
    : { light: 'Light', dark: 'Dark', useLight: 'Use light appearance', useDark: 'Use dark appearance' };
  const update = () => {
    button.setAttribute('aria-pressed', String(isDark()));
    button.setAttribute('aria-label', isDark() ? appearance.useLight : appearance.useDark);
    label.textContent = isDark() ? appearance.light : appearance.dark;
  };
  button.hidden = false;
  update();
  media.addEventListener('change', update);
  button.addEventListener('click', () => {
    const theme = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('coordsmith.appearance', theme); } catch { /* Keep working without storage. */ }
    update();
  });
})();
