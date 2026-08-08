/**
 * Amit Verma — Portfolio Admin Dashboard JavaScript
 */

const PASSCODE_HASH = 'admin123'; // Default passcode
const GITHUB_USERNAME = 'amiitt001';
const GITHUB_REPO = 'amiitt001.github.io';
const DATA_FILE_PATH = 'data/projects.json';

let projectsState = [];
let pendingRepos = [];

document.addEventListener('DOMContentLoaded', () => {
    initLucideIcons();
    initAuth();
    initTabNavigation();
    initPATSettings();
    initAdminActions();
});

function initLucideIcons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

// --------------------------------------------------------------------------
// 1. Authentication
// --------------------------------------------------------------------------
function initAuth() {
    const authModal = document.getElementById('auth-modal');
    const adminApp = document.getElementById('admin-app');
    const authForm = document.getElementById('auth-form');
    const authError = document.getElementById('auth-error');
    const passcodeInput = document.getElementById('passcode');

    const isAuthenticated = sessionStorage.getItem('portfolio_admin_auth') === 'true';

    if (isAuthenticated) {
        authModal.classList.add('hidden');
        adminApp.classList.remove('hidden');
        adminApp.classList.add('flex');
        loadInitialData();
    }

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = passcodeInput.value.trim();

        if (value === PASSCODE_HASH) {
            sessionStorage.setItem('portfolio_admin_auth', 'true');
            authModal.classList.add('hidden');
            adminApp.classList.remove('hidden');
            adminApp.classList.add('flex');
            authError.classList.add('hidden');
            loadInitialData();
        } else {
            authError.classList.remove('hidden');
        }
    });
}

// --------------------------------------------------------------------------
// 2. Data Loading & GitHub Sync Engine
// --------------------------------------------------------------------------
async function loadInitialData() {
    showStatus('Loading projects database...');
    try {
        // Try local storage cache first, fallback to data/projects.json
        const localCache = localStorage.getItem('portfolio_projects');
        if (localCache) {
            projectsState = JSON.parse(localCache);
        } else {
            const res = await fetch('data/projects.json');
            if (res.ok) {
                projectsState = await res.json();
                localStorage.setItem('portfolio_projects', JSON.stringify(projectsState));
            }
        }
    } catch (err) {
        console.error('Error loading projects.json:', err);
    }

    renderDashboard();
    syncGitHubRepos();
}

async function syncGitHubRepos() {
    showStatus(`Fetching public repositories for @${GITHUB_USERNAME}...`);
    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`);
        if (!res.ok) throw new Error(`GitHub API returned status ${res.status}`);

        const repos = await res.json();
        
        // Find repos not yet in projectsState
        const knownRepoNames = new Set(projectsState.map(p => p.name.toLowerCase()));
        
        pendingRepos = repos.filter(repo => {
            // Ignore fork repos or site repo itself if desired, or include all user repos
            if (repo.name === GITHUB_REPO) return false;
            return !knownRepoNames.has(repo.name.toLowerCase());
        }).map(formatGitHubRepoToProject);

        showStatus(`GitHub Sync complete! Found ${pendingRepos.length} pending repository(ies).`);
        renderDashboard();
    } catch (err) {
        console.error('Error syncing GitHub repos:', err);
        showStatus(`GitHub Sync notice: Unable to fetch live API (${err.message}). Using local cache.`);
    }
}

function formatGitHubRepoToProject(repo) {
    // Auto-detect Category & Tags based on repo topics/description
    const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
    
    let category = 'tools';
    let icon = '⚡';
    let iconBg = '#d6e8ff';
    let tags = [];

    if (text.includes('agent') || text.includes('adk') || text.includes('gemini') || text.includes('llm') || text.includes('ai')) {
        category = 'ai';
        icon = '🤖';
        iconBg = '#ccf5e7';
        tags.push('Gemini AI', 'Python');
    } else if (text.includes('vision') || text.includes('detection') || text.includes('yolo') || text.includes('opencv') || text.includes('image')) {
        category = 'vision';
        icon = '👁️';
        iconBg = '#ffd6e7';
        tags.push('Python', 'PyTorch');
    } else {
        category = 'tools';
        icon = '⚡';
        iconBg = '#f5d90a';
        tags.push(repo.language || 'TypeScript');
    }

    if (repo.homepage) {
        tags.push('Live Demo');
    }

    return {
        id: repo.name,
        name: repo.name,
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        description: repo.description || 'No description provided.',
        category: category,
        tags: Array.from(new Set(tags)),
        github_url: repo.html_url,
        demo_url: repo.homepage || '',
        icon: icon,
        icon_bg: iconBg,
        approved: false,
        featured: false,
        updated_at: repo.updated_at
    };
}

// --------------------------------------------------------------------------
// 3. UI Rendering
// --------------------------------------------------------------------------
function renderDashboard() {
    const approvedProjects = projectsState.filter(p => p.approved);
    
    document.getElementById('stat-approved-count').textContent = approvedProjects.length;
    document.getElementById('stat-pending-count').textContent = pendingRepos.length;
    document.getElementById('stat-total-count').textContent = projectsState.length + pendingRepos.length;

    document.getElementById('approved-badge').textContent = approvedProjects.length;
    document.getElementById('pending-badge').textContent = pendingRepos.length;

    renderPendingList();
    renderApprovedList();
    initLucideIcons();
}

function renderPendingList() {
    const container = document.getElementById('pending-list');
    const emptyState = document.getElementById('pending-empty');

    if (pendingRepos.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = pendingRepos.map((p, idx) => `
        <div class="bcard p-5 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex items-start gap-4">
                <div class="sticker" style="background:${p.icon_bg}">${p.icon}</div>
                <div>
                    <div class="flex items-center gap-2">
                        <h4 class="font-bold text-lg">${escapeHtml(p.title)}</h4>
                        <span class="mono text-xs text-gray-400">(${escapeHtml(p.name)})</span>
                        <span class="tag tag-pink">Pending Approval</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1 max-w-2xl">${escapeHtml(p.description)}</p>
                    <div class="flex flex-wrap gap-2 mt-3">
                        ${p.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <button onclick="openEditModal(${idx}, true)" class="btn btn-yellow text-xs py-2 px-3">
                    <i data-lucide="check-circle" class="h-4 w-4"></i> Review & Approve
                </button>
                <button onclick="dismissPending(${idx})" class="btn btn-outline text-xs py-2 px-3 text-red-600 border-red-600">
                    Ignore
                </button>
            </div>
        </div>
    `).join('');
}

function renderApprovedList() {
    const container = document.getElementById('approved-list');
    const approvedProjects = projectsState.filter(p => p.approved);

    if (approvedProjects.length === 0) {
        container.innerHTML = '<div class="bcard p-6 text-center text-gray-500">No approved projects yet.</div>';
        return;
    }

    container.innerHTML = approvedProjects.map((p, idx) => `
        <div class="bcard p-5 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex items-start gap-4">
                <div class="sticker" style="background:${p.icon_bg}">${p.icon}</div>
                <div>
                    <div class="flex items-center gap-2">
                        <h4 class="font-bold text-lg">${escapeHtml(p.title)}</h4>
                        <span class="tag tag-green">Live on Frontend</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1 max-w-2xl">${escapeHtml(p.description)}</p>
                    <div class="flex flex-wrap gap-2 mt-3">
                        ${p.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
                        ${p.demo_url ? `<a href="${escapeHtml(p.demo_url)}" target="_blank" class="tag tag-blue">Demo ↗</a>` : ''}
                        <a href="${escapeHtml(p.github_url)}" target="_blank" class="tag tag-yellow">GitHub ↗</a>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <button onclick="openEditModalApproved('${escapeHtml(p.id)}')" class="btn btn-outline text-xs py-2 px-3">
                    <i data-lucide="edit-2" class="h-4 w-4"></i> Edit
                </button>
                <button onclick="unapproveProject('${escapeHtml(p.id)}')" class="btn btn-black text-xs py-2 px-3">
                    Unpublish
                </button>
            </div>
        </div>
    `).join('');
}

// Helper escape function
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

// --------------------------------------------------------------------------
// 4. Modal Editing & Project Actions
// --------------------------------------------------------------------------
window.openEditModal = function(index, isPending = false) {
    const modal = document.getElementById('edit-modal');
    const project = isPending ? pendingRepos[index] : projectsState.find(p => p.id === index);

    if (!project) return;

    document.getElementById('edit-id').value = project.id;
    document.getElementById('edit-name').value = project.name;
    document.getElementById('edit-display-title').value = project.title;
    document.getElementById('edit-description').value = project.description;
    document.getElementById('edit-category').value = project.category || 'tools';
    document.getElementById('edit-icon').value = project.icon || '🤖';
    document.getElementById('edit-icon-bg').value = project.icon_bg || '#ccf5e7';
    document.getElementById('edit-github-url').value = project.github_url;
    document.getElementById('edit-demo-url').value = project.demo_url || '';
    document.getElementById('edit-tags').value = (project.tags || []).join(', ');
    document.getElementById('edit-approved').checked = true; // Default approve when saving

    modal.dataset.isPending = isPending ? 'true' : 'false';
    modal.dataset.pendingIndex = index;
    modal.classList.remove('hidden');
};

window.openEditModalApproved = function(id) {
    const project = projectsState.find(p => p.id === id);
    if (!project) return;

    const modal = document.getElementById('edit-modal');
    document.getElementById('edit-id').value = project.id;
    document.getElementById('edit-name').value = project.name;
    document.getElementById('edit-display-title').value = project.title;
    document.getElementById('edit-description').value = project.description;
    document.getElementById('edit-category').value = project.category || 'tools';
    document.getElementById('edit-icon').value = project.icon || '🤖';
    document.getElementById('edit-icon-bg').value = project.icon_bg || '#ccf5e7';
    document.getElementById('edit-github-url').value = project.github_url;
    document.getElementById('edit-demo-url').value = project.demo_url || '';
    document.getElementById('edit-tags').value = (project.tags || []).join(', ');
    document.getElementById('edit-approved').checked = project.approved;

    modal.dataset.isPending = 'false';
    modal.classList.remove('hidden');
};

window.dismissPending = function(index) {
    pendingRepos.splice(index, 1);
    renderDashboard();
};

window.unapproveProject = function(id) {
    const project = projectsState.find(p => p.id === id);
    if (project) {
        project.approved = false;
        saveProjectsState();
        renderDashboard();
    }
};

function initAdminActions() {
    const modal = document.getElementById('edit-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const editForm = document.getElementById('edit-project-form');
    const syncBtn = document.getElementById('sync-github-btn');
    const commitBtn = document.getElementById('commit-github-btn');
    const exportBtn = document.getElementById('export-json-btn');
    const copyBtn = document.getElementById('copy-json-btn');

    closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    cancelEditBtn.addEventListener('click', () => modal.classList.add('hidden'));

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const isPending = modal.dataset.isPending === 'true';
        const pendingIndex = parseInt(modal.dataset.pendingIndex, 10);

        const updatedProject = {
            id: id,
            name: document.getElementById('edit-name').value,
            title: document.getElementById('edit-display-title').value,
            description: document.getElementById('edit-description').value,
            category: document.getElementById('edit-category').value,
            tags: document.getElementById('edit-tags').value.split(',').map(t => t.trim()).filter(Boolean),
            github_url: document.getElementById('edit-github-url').value,
            demo_url: document.getElementById('edit-demo-url').value,
            icon: document.getElementById('edit-icon').value,
            icon_bg: document.getElementById('edit-icon-bg').value,
            approved: document.getElementById('edit-approved').checked,
            featured: true,
            updated_at: new Date().toISOString()
        };

        if (isPending) {
            // Remove from pending, add to projectsState
            pendingRepos.splice(pendingIndex, 1);
            projectsState.unshift(updatedProject);
        } else {
            const existingIdx = projectsState.findIndex(p => p.id === id);
            if (existingIdx !== -1) {
                projectsState[existingIdx] = updatedProject;
            } else {
                projectsState.unshift(updatedProject);
            }
        }

        saveProjectsState();
        modal.classList.add('hidden');
        renderDashboard();
        showStatus(`Project "${updatedProject.title}" saved & published!`);
    });

    syncBtn.addEventListener('click', () => syncGitHubRepos());

    commitBtn.addEventListener('click', () => commitChangesToGitHub());

    exportBtn.addEventListener('click', () => downloadProjectsJSON());
    copyBtn.addEventListener('click', () => copyProjectsJSON());

    const closeStatusBtn = document.getElementById('close-status-btn');
    if (closeStatusBtn) {
        closeStatusBtn.addEventListener('click', () => {
            document.getElementById('sync-status').classList.add('hidden');
        });
    }
}

function saveProjectsState() {
    localStorage.setItem('portfolio_projects', JSON.stringify(projectsState));
}

// --------------------------------------------------------------------------
// 5. Direct GitHub Commit via REST API
// --------------------------------------------------------------------------
async function commitChangesToGitHub() {
    const pat = localStorage.getItem('github_pat');

    if (!pat) {
        alert('GitHub Personal Access Token (PAT) is required to commit directly to GitHub.\n\nPlease enter your token under the "GitHub PAT & Sync Settings" tab.');
        switchTab('settings');
        return;
    }

    showStatus('Preparing commit to GitHub repository...');

    try {
        // 1. Get SHA of existing file
        const getUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${DATA_FILE_PATH}`;
        const getRes = await fetch(getUrl, {
            headers: {
                'Authorization': `token ${pat}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        let sha = '';
        if (getRes.ok) {
            const data = await getRes.json();
            sha = data.sha;
        }

        // 2. Encode JSON content to base64
        const contentStr = JSON.stringify(projectsState, null, 2);
        const base64Content = btoa(unescape(encodeURIComponent(contentStr)));

        // 3. PUT request to update contents
        const putRes = await fetch(getUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${pat}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: 'feat(admin): Update approved portfolio projects via Admin Dashboard',
                content: base64Content,
                sha: sha
            })
        });

        if (putRes.ok) {
            showStatus('Successfully committed projects.json to GitHub repository! Live site will update shortly.');
        } else {
            const errData = await putRes.json();
            throw new Error(errData.message || 'GitHub commit failed');
        }

    } catch (err) {
        console.error('Commit error:', err);
        showStatus(`Commit failed: ${err.message}. You can manually download projects.json under Settings.`);
    }
}

function downloadProjectsJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectsState, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "projects.json");
    dlAnchorElem.click();
    showStatus('Downloaded updated projects.json file.');
}

function copyProjectsJSON() {
    navigator.clipboard.writeText(JSON.stringify(projectsState, null, 2)).then(() => {
        showStatus('Copied projects.json content to clipboard!');
    });
}

// --------------------------------------------------------------------------
// 6. Settings & Navigation
// --------------------------------------------------------------------------
function initPATSettings() {
    const patInput = document.getElementById('pat-input');
    const savePatBtn = document.getElementById('save-pat-btn');
    const clearPatBtn = document.getElementById('clear-pat-btn');

    const storedPAT = localStorage.getItem('github_pat');
    if (storedPAT) patInput.value = storedPAT;

    savePatBtn.addEventListener('click', () => {
        const token = patInput.value.trim();
        if (token) {
            localStorage.setItem('github_pat', token);
            showStatus('GitHub PAT saved successfully!');
        }
    });

    clearPatBtn.addEventListener('click', () => {
        localStorage.removeItem('github_pat');
        patInput.value = '';
        showStatus('GitHub PAT cleared.');
    });
}

function initTabNavigation() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');

    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) btn.classList.add('active');
    });

    tabContents.forEach(content => {
        if (content.id === `tab-${tabName}`) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });
}

function showStatus(message) {
    const statusBanner = document.getElementById('sync-status');
    const statusMsg = document.getElementById('sync-status-msg');
    if (statusBanner && statusMsg) {
        statusMsg.textContent = message;
        statusBanner.classList.remove('hidden');
    }
}
