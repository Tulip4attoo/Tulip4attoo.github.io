const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement; // Target the <html> element

// Function to set the theme
const setTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
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
let currentTheme = 'light'; // Default to light
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
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
    }
});