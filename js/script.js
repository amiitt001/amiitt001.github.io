/**
 * Amit Verma — Brutalist Portfolio JavaScript (10-Section Structure)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Interactive Hero Canvas (Cursor Follow Particles)
    initHeroCanvas();

    // 3. Load & Render Approved Projects Dynamically
    loadApprovedProjects();

    // 4. GitHub Heatmap Grid Generator
    initGitHubHeatmap();

    // 5. Scroll Progress Bar
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

    // 6. Mobile Navigation Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 7. Copy Email & Toast Notification
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast');

    window.showToast = function(message) {
        if (!toast) return;
        toast.innerHTML = `<i data-lucide="check-circle" class="h-4 w-4 text-green-400"></i> ${message}`;
        if (window.lucide) lucide.createIcons();
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

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

    // 8. Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Message sent! Amit will get back to you shortly.');
            contactForm.reset();
        });
    }

    // 9. Active Nav Link Highlighting & Scroll Reveal
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
    }, { threshold: 0.2 });

    sections.forEach(section => sectionObserver.observe(section));

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

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
// Interactive 3D / Particle Canvas Effect
// --------------------------------------------------------------------------
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    window.addEventListener('resize', () => {
        if (!canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const particles = [];
    const particleCount = Math.min(35, Math.floor(width / 30));

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            radius: Math.random() * 2.5 + 1.5,
            color: '#0d0d0d'
        });
    }

    let mouse = { x: -1000, y: -1000 };
    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(13, 13, 13, ${1 - dist / 110})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Mouse interaction line
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mdist < 140) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(245, 217, 10, ${1 - mdist / 140})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// --------------------------------------------------------------------------
// Dynamic Projects Loading & Deep-Dive Toggle
// --------------------------------------------------------------------------
async function loadApprovedProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    let projects = [];

    try {
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

    const approved = projects.filter(p => p.approved);

    if (approved.length > 0) {
        grid.innerHTML = approved.map(p => `
            <div class="bcard p-6 flex flex-col justify-between" data-category="${escapeHtml(p.category || 'tools')}" style="background:#fafaf5">
                <div>
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
                    <p class="text-sm text-gray-600 leading-relaxed mb-4">
                        ${escapeHtml(p.description)}
                    </p>

                    <div class="flex flex-wrap gap-2 mb-4">
                        ${(p.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>

                ${p.architecture ? `
                    <div>
                        <button onclick="toggleDeepDive('${escapeHtml(p.id)}')" class="btn btn-outline text-xs w-full mt-2 py-2">
                            <i data-lucide="cpu" class="h-4 w-4"></i> Architecture & Engineering Breakdown
                        </button>
                        
                        <div id="drawer-${escapeHtml(p.id)}" class="project-details-drawer">
                            ${p.problem ? `<p class="text-xs mb-2"><strong>Problem Solved:</strong> ${escapeHtml(p.problem)}</p>` : ''}
                            ${p.architecture ? `
                                <div class="project-architecture-box mb-3">
                                    <strong>Architecture Pipeline:</strong><br>
                                    ${escapeHtml(p.architecture)}
                                </div>
                            ` : ''}
                            ${p.key_features && p.key_features.length > 0 ? `
                                <div class="text-xs mb-3">
                                    <strong>Key Technical Features:</strong>
                                    <ul class="list-disc list-inside mt-1 space-y-1 text-gray-700">
                                        ${p.key_features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            ${p.technical_decisions ? `
                                <p class="text-xs text-gray-600 italic">
                                    <strong>Engineering Rationale:</strong> ${escapeHtml(p.technical_decisions)}
                                </p>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        `).join('');

        if (window.lucide) {
            lucide.createIcons();
        }

        initProjectFiltering();
    }
}

window.toggleDeepDive = function(id) {
    const drawer = document.getElementById(`drawer-${id}`);
    if (drawer) {
        drawer.classList.toggle('open');
    }
};

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

// --------------------------------------------------------------------------
// GitHub Contribution Heatmap Mock Grid
// --------------------------------------------------------------------------
function initGitHubHeatmap() {
    const grid = document.getElementById('github-heatmap');
    if (!grid) return;

    let html = '';
    const totalCells = 26 * 7; // 26 weeks

    for (let i = 0; i < totalCells; i++) {
        // Random heat intensity simulation (0 to 4)
        const rand = Math.random();
        let level = 0;
        if (rand > 0.4) level = 1;
        if (rand > 0.65) level = 2;
        if (rand > 0.85) level = 3;
        if (rand > 0.95) level = 4;

        html += `<div class="github-cell cell-${level}"></div>`;
    }

    grid.innerHTML = html;
}
