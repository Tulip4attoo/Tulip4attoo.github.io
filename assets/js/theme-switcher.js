const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement; // Target the <html> element

// Function to set the theme
const setTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const cusdisThread = document.getElementById('cusdis_thread');
    if (cusdisThread) {
        cusdisThread.dataset.theme = theme;

        const iframeDocument = cusdisThread.querySelector('iframe')?.contentDocument;
        const overrides = iframeDocument?.getElementById('cusdis-site-overrides');
        if (overrides) {
            const background = getComputedStyle(htmlElement).getPropertyValue('--bg-color').trim();
            overrides.textContent = `html, body, #root { background: ${background} !important; }`;
        }
    }

    if (window.CUSDIS && typeof window.CUSDIS.setTheme === 'function') {
        window.CUSDIS.setTheme(theme);
    }

    // Optional: Update button text/icon based on theme
    // if (themeToggle) {
    //     // Button content is now handled by HTML/CSS (emojis)
    //     // themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode'; // This line is removed/commented
    // }
};

// Check for saved theme in localStorage or system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Determine initial theme
const defaultTheme = htmlElement.dataset.defaultTheme || 'light';
let currentTheme = defaultTheme;
if (savedTheme) {
    currentTheme = savedTheme;
} else if (prefersDark) {
    currentTheme = 'dark';
}

// Apply the initial theme
setTheme(currentTheme);

// Add event listener to the toggle button (if it exists)
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

// Optional: Listen for changes in system preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    // Only change if no theme is explicitly saved by the user
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : defaultTheme;
        setTheme(newTheme);
    }
});