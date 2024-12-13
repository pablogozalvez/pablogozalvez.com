function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

(function() {
    function applyPreferedTheme() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('theme-dark');
        } else {
            setTheme('theme-light');
        }
    }

    applyPreferedTheme();

    // Listen for changes to the prefers-color-scheme media query
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyPreferedTheme);
})();
