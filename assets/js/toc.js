document.addEventListener('DOMContentLoaded', function() {
    const article = document.querySelector('.entry-body');
    if (!article) return;

    const headings = article.querySelectorAll('h1, h2, h3');
    if (headings.length === 0) return;

    // Create TOC container
    const tocContainer = document.createElement('nav');
    tocContainer.className = 'toc-sidebar';
    tocContainer.innerHTML = `
        <div class="toc-header">
            <span class="toc-title">Contents</span>
            <button class="toc-toggle" aria-label="Toggle table of contents">
                <span class="toc-toggle-icon"></span>
            </button>
        </div>
        <ul class="toc-list"></ul>
    `;

    const tocList = tocContainer.querySelector('.toc-list');
    const tocToggle = tocContainer.querySelector('.toc-toggle');

    // Generate TOC items
    headings.forEach((heading, index) => {
        // Add ID to heading if it doesn't have one
        if (!heading.id) {
            heading.id = 'heading-' + index;
        }

        const li = document.createElement('li');
        li.className = 'toc-item toc-' + heading.tagName.toLowerCase();

        const a = document.createElement('a');
        a.href = '#' + heading.id;
        a.textContent = heading.textContent;
        a.className = 'toc-link';

        li.appendChild(a);
        tocList.appendChild(li);

        // Smooth scroll on click
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById(heading.id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, '#' + heading.id);
            }
        });
    });

    // Insert TOC into page
    document.body.appendChild(tocContainer);

    // Toggle collapse/expand
    const savedState = localStorage.getItem('toc-collapsed');
    if (savedState === 'true') {
        tocContainer.classList.add('collapsed');
    }

    tocToggle.addEventListener('click', function() {
        tocContainer.classList.toggle('collapsed');
        localStorage.setItem('toc-collapsed', tocContainer.classList.contains('collapsed'));
    });

    // Highlight current section on scroll
    const tocLinks = tocContainer.querySelectorAll('.toc-link');

    function highlightCurrentSection() {
        const scrollPos = window.scrollY + 100; // Offset for better UX

        let currentHeading = null;
        headings.forEach((heading) => {
            if (heading.offsetTop <= scrollPos) {
                currentHeading = heading;
            }
        });

        tocLinks.forEach((link) => {
            link.classList.remove('active');
            if (currentHeading && link.getAttribute('href') === '#' + currentHeading.id) {
                link.classList.add('active');
            }
        });
    }

    // Throttle scroll event
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                highlightCurrentSection();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial highlight
    highlightCurrentSection();
});
