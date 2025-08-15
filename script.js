// Main JavaScript functionality for the Mindscape website

/**
 * Scrolls to a specific section on the page
 * @param {string} sectionId - The ID of the section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update active nav item
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');
    }
}

/**
 * Toggles the visibility of additional essays in a section
 * @param {string} domain - The domain/section to toggle
 */
function toggleMoreEssays(domain) {
    const moreSection = document.getElementById(domain + '-more');
    const link = event.target;
    
    if (moreSection.classList.contains('show')) {
        moreSection.classList.remove('show');
        link.textContent = 'More essays';
    } else {
        moreSection.classList.add('show');
        link.textContent = 'Show fewer essays';
    }
}

/**
 * Displays an individual essay page
 * @param {string} essayId - The ID of the essay to display
 */
function showEssay(essayId) {
    const essayPageData = essayData[essayId];
    if (!essayPageData) {
        console.warn(`Essay data not found for ID: ${essayId}`);
        return;
    }

    // Hide home page and show essay page
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('essay-page').classList.add('active');

    // Populate essay header
    document.getElementById('current-essay-category').textContent = essayPageData.category;
    document.getElementById('current-essay-title').textContent = essayPageData.title;
    document.getElementById('current-essay-author').textContent = essayPageData.author;
    document.getElementById('current-essay-date').textContent = essayPageData.date;
    document.getElementById('current-essay-read-time').textContent = essayPageData.readTime;

    // Populate table of contents
    const contentsElement = document.getElementById('essay-contents');
    contentsElement.innerHTML = '';
    essayPageData.sections.forEach(section => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + section.id;
        a.textContent = section.title;
        a.onclick = (e) => {
            e.preventDefault();
            const targetSection = document.getElementById(section.id);
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        };
        li.appendChild(a);
        contentsElement.appendChild(li);
    });

    // Populate essay sections
    const sectionsElement = document.getElementById('essay-sections');
    sectionsElement.innerHTML = '';
    essayPageData.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'essay-section';
        sectionDiv.id = section.id;
        
        const heading = document.createElement('h2');
        heading.textContent = section.title;
        sectionDiv.appendChild(heading);
        
        const paragraphs = section.content.split('\n\n');
        paragraphs.forEach(paragraphText => {
            if (paragraphText.trim()) {
                const p = document.createElement('p');
                p.textContent = paragraphText.trim();
                sectionDiv.appendChild(p);
            }
        });
        
        sectionsElement.appendChild(sectionDiv);
    });

    // Populate suggestions based on domain
    const suggestionsElement = document.getElementById('suggestions-grid');
    suggestionsElement.innerHTML = '';
    const domainSuggestions = suggestionsByDomain[essayPageData.domain] || [];
    
    domainSuggestions.forEach(suggestion => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestion-card';
        suggestionDiv.innerHTML = `
            <div class="essay-category">${suggestion.category}</div>
            <div class="essay-title" style="font-size: 18px; margin-bottom: 8px;">${suggestion.title}</div>
            <div class="essay-author">${suggestion.author}</div>
        `;
        suggestionsElement.appendChild(suggestionDiv);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Shows the home page and hides the essay page
 */
function showHomePage() {
    document.getElementById('essay-page').classList.remove('active');
    document.getElementById('home-page').style.display = 'block';
    
    // Clear active nav items
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Initializes scroll spy functionality for essay table of contents
 */
function initializeScrollSpy() {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.essay-section');
        const menuLinks = document.querySelectorAll('.essay-menu a');
        
        if (sections.length === 0 || menuLinks.length === 0) {
            return; // No essay page active
        }
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.id;
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Initializes the website when the DOM is loaded
 */
function initializeWebsite() {
    showHomePage();
    initializeScrollSpy();
    
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize the website when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeWebsite);

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page === 'essay') {
        showEssay(event.state.essayId);
    } else {
        showHomePage();
    }
});

// Add error handling for missing essays
window.addEventListener('error', function(event) {
    console.error('Website error:', event.error);
});

// Utility function to add essay data dynamically (for future use)
function addEssayData(essayId, essayData) {
    window.essayData = window.essayData || {};
    window.essayData[essayId] = essayData;
}

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrollToSection,
        toggleMoreEssays,
        showEssay,
        showHomePage,
        addEssayData
    };
}
