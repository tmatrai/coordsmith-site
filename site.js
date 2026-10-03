(() => {
  const button = document.querySelector('.theme-toggle');
  const label = document.querySelector('.theme-label');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem('coordsmith.appearance'); } catch { /* Storage is optional. */ }
  if (preference === 'light' || preference === 'dark') document.documentElement.dataset.theme = preference;
  const isDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : media.matches;
  const update = () => {
    button.setAttribute('aria-pressed', String(isDark()));
    button.setAttribute('aria-label', isDark() ? 'Use light appearance' : 'Use dark appearance');
    label.textContent = isDark() ? 'Light' : 'Dark';
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
