function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}
  
(function() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('theme-dark');
    } else {
        setTheme('theme-light');
    }
})();
