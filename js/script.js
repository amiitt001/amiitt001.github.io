/**
 * Amit Verma — Brutalist Portfolio JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Load & Render Approved Projects Dynamically
    loadApprovedProjects();

    // 3. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            const progress = (scrollTop / docHeight) * 100;
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }
    });

    // 4. Mobile Navigation Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking nav links
        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 5. Project Filtering Setup
    initProjectFiltering();

    // 6. Toast Notification & Copy Email
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast');

    function showToast(message) {
        if (!toast) return;
        toast.innerHTML = `<i data-lucide="check-circle" class="h-4 w-4 text-green-400"></i> ${message}`;
        if (window.lucide) lucide.createIcons();
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = 'amiitt.v001@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email copied to clipboard!');
            }).catch(err => {
                showToast('Email: amiitt.v001@gmail.com');
            });
        });
    }

    // 7. Active Nav Link Highlighting & Scroll Reveal
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => sectionObserver.observe(section));

    // Scroll Reveal for Elements
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
});

// Helper escape function
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

// --------------------------------------------------------------------------
// Dynamic Project Database Loading
// --------------------------------------------------------------------------
async function loadApprovedProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    let projects = [];

    try {
        // Try local storage first (allows immediate preview when changed in Admin Panel)
        const localData = localStorage.getItem('portfolio_projects');
        if (localData) {
            projects = JSON.parse(localData);
        } else {
            const res = await fetch('data/projects.json');
            if (res.ok) {
                projects = await res.json();
            }
        }
    } catch (err) {
        console.error('Error fetching projects.json:', err);
    }

    // Filter only APPROVED projects
    const approved = projects.filter(p => p.approved);

    if (approved.length > 0) {
        grid.innerHTML = approved.map(p => `
            <div class="bcard p-6 flex flex-col" data-category="${escapeHtml(p.category || 'tools')}" style="background:#fafaf5">
                <div class="flex justify-between items-start mb-4">
                    <div class="sticker" style="background:${escapeHtml(p.icon_bg || '#ccf5e7')}">${p.icon || '🤖'}</div>
                    <div class="flex gap-2">
                        ${p.demo_url ? `
                            <a href="${escapeHtml(p.demo_url)}" target="_blank" rel="noopener noreferrer" class="border-2 border-black rounded p-1.5 hover:bg-yellow-200 transition-colors" title="Live Demo">
                                <i data-lucide="external-link" class="h-4 w-4"></i>
                            </a>
                        ` : ''}
                        <a href="${escapeHtml(p.github_url)}" target="_blank" rel="noopener noreferrer" class="border-2 border-black rounded p-1.5 hover:bg-yellow-200 transition-colors" title="GitHub Repository">
                            <i data-lucide="github" class="h-4 w-4"></i>
                        </a>
                    </div>
                </div>
                <h3 class="text-xl font-bold mb-2">${escapeHtml(p.title)}</h3>
                <p class="text-sm text-gray-600 leading-relaxed flex-grow">
                    ${escapeHtml(p.description)}
                </p>
                <div class="flex flex-wrap gap-2 mt-5">
                    ${(p.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>
        `).join('');

        if (window.lucide) {
            lucide.createIcons();
        }

        // Re-initialize category filtering for newly created cards
        initProjectFiltering();
    }
}

function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('#projects-grid .bcard');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || cardCategory === filterValue || (cardCategory && cardCategory.includes(filterValue))) {
                        card.style.display = 'flex';
                        card.classList.add('is-visible');
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}
