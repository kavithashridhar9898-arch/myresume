/* ========================================
   MYRESUME - Admin Dashboard JavaScript
   ======================================== */

const API_BASE_URL = window.location.origin;
let authToken = localStorage.getItem('myresume_token');

// DOM Elements
const elements = {
    loginScreen: document.getElementById('login-screen'),
    dashboard: document.getElementById('dashboard'),
    loginForm: document.getElementById('login-form'),
    logoutBtn: document.getElementById('logout-btn'),
    navItems: document.querySelectorAll('.nav-item'),
    contentSections: document.querySelectorAll('.content-section'),
    pageTitle: document.getElementById('page-title'),
    
    // Stats
    statProjects: document.getElementById('stat-projects'),
    statSkills: document.getElementById('stat-skills'),
    statMedia: document.getElementById('stat-media'),
    
    // Forms
    profileForm: document.getElementById('profile-form'),
    projectForm: document.getElementById('project-form'),
    skillForm: document.getElementById('skill-form'),
    qrForm: document.getElementById('qr-form'),
    
    // Tables
    projectsTableBody: document.getElementById('projects-table-body'),
    skillsTableBody: document.getElementById('skills-table-body'),
    mediaGrid: document.getElementById('media-grid'),
    
    // Upload
    uploadArea: document.getElementById('upload-area'),
    fileInput: document.getElementById('file-input'),
    
    // QR
    adminQrCode: document.getElementById('admin-qr-code'),
    qrDownload: document.getElementById('qr-download')
};

// API Helper with Auth
async function fetchAPI(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        if (response.status === 401) {
            logout();
            return null;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showToast('Error connecting to server', 'error');
        return null;
    }
}

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Authentication
async function login(username, password) {
    const response = await fetchAPI('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
    
    if (response && response.token) {
        authToken = response.token;
        localStorage.setItem('myresume_token', authToken);
        showDashboard();
        showToast('Login successful!', 'success');
        return true;
    } else {
        showToast('Invalid credentials', 'error');
        return false;
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('myresume_token');
    showLoginScreen();
    showToast('Logged out successfully', 'success');
}

function showLoginScreen() {
    elements.loginScreen.classList.remove('hidden');
    elements.dashboard.classList.add('hidden');
}

function showDashboard() {
    elements.loginScreen.classList.add('hidden');
    elements.dashboard.classList.remove('hidden');
    loadAllData();
}

// Navigation
function showSection(sectionId) {
    // Update nav items
    elements.navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });
    
    // Update content sections
    elements.contentSections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`section-${sectionId}`).classList.add('active');
    
    // Update page title
    const titles = {
        overview: 'Dashboard Overview',
        profile: 'Edit Profile',
        projects: 'Manage Projects',
        skills: 'Manage Skills',
        media: 'Media Manager',
        qr: 'QR Code Settings'
    };
    elements.pageTitle.textContent = titles[sectionId];
}

// Modal Functions
function openModal(modalId, data = null) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    
    if (modalId === 'project-modal' && data) {
        document.getElementById('project-modal-title').textContent = 'Edit Project';
        document.getElementById('project-id').value = data.id;
        document.getElementById('project-title').value = data.title;
        document.getElementById('project-category').value = data.category || '';
        document.getElementById('project-description').value = data.description || '';
        document.getElementById('project-tech').value = data.tech_stack || '';
        document.getElementById('project-github').value = data.github_link || '';
        document.getElementById('project-demo').value = data.demo_link || '';
        document.getElementById('project-image').value = data.image || '';
        document.getElementById('project-video').value = data.video || '';
        document.getElementById('project-featured').checked = data.featured;
        document.getElementById('project-order').value = data.display_order || 0;
    } else if (modalId === 'project-modal') {
        document.getElementById('project-modal-title').textContent = 'Add Project';
        elements.projectForm.reset();
        document.getElementById('project-id').value = '';
    }
    
    if (modalId === 'skill-modal' && data) {
        document.getElementById('skill-modal-title').textContent = 'Edit Skill';
        document.getElementById('skill-id').value = data.id;
        document.getElementById('skill-name').value = data.skill_name;
        document.getElementById('skill-category').value = data.category;
        document.getElementById('skill-percentage').value = data.percentage;
        document.getElementById('skill-icon').value = data.icon || '';
        document.getElementById('skill-order').value = data.display_order || 0;
    } else if (modalId === 'skill-modal') {
        document.getElementById('skill-modal-title').textContent = 'Add Skill';
        elements.skillForm.reset();
        document.getElementById('skill-id').value = '';
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Data Loading
async function loadAllData() {
    await Promise.all([
        loadStats(),
        loadProfile(),
        loadProjects(),
        loadSkills(),
        loadMedia(),
        loadQRCode()
    ]);
}

async function loadStats() {
    const [projects, skills, media] = await Promise.all([
        fetchAPI('/api/projects'),
        fetchAPI('/api/skills'),
        fetchAPI('/api/media')
    ]);
    
    if (elements.statProjects) elements.statProjects.textContent = projects ? projects.length : 0;
    if (elements.statSkills) elements.statSkills.textContent = skills ? skills.length : 0;
    if (elements.statMedia) elements.statMedia.textContent = media ? media.length : 0;
}

async function loadProfile() {
    const profile = await fetchAPI('/api/profile');
    
    if (profile && elements.profileForm) {
        document.getElementById('profile-name').value = profile.name || '';
        document.getElementById('profile-title').value = profile.title || '';
        document.getElementById('profile-bio').value = profile.bio || '';
        document.getElementById('profile-email').value = profile.email || '';
        document.getElementById('profile-phone').value = profile.phone || '';
        document.getElementById('profile-location').value = profile.location || '';
        document.getElementById('profile-github').value = profile.github || '';
        document.getElementById('profile-linkedin').value = profile.linkedin || '';
        document.getElementById('profile-leetcode').value = profile.leetcode || '';
        document.getElementById('profile-twitter').value = profile.twitter || '';
        document.getElementById('profile-website').value = profile.website || '';
        document.getElementById('profile-resume').value = profile.resume_file || '';
        document.getElementById('profile-image').value = profile.profile_image || '';
        
        // QR form
        document.getElementById('qr-github-input').value = profile.github || '';
        document.getElementById('qr-linkedin-input').value = profile.linkedin || '';
        document.getElementById('qr-leetcode-input').value = profile.leetcode || '';
    }
}

async function loadProjects() {
    const projects = await fetchAPI('/api/projects');
    
    if (projects && elements.projectsTableBody) {
        elements.projectsTableBody.innerHTML = projects.map(project => `
            <tr>
                <td>${project.title}</td>
                <td>${project.category || '-'}</td>
                <td>${project.tech_stack || '-'}</td>
                <td>${project.featured ? '<i class="fas fa-check" style="color: var(--success)"></i>' : '-'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline" onclick='editProject(${JSON.stringify(project)})'>
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProject(${project.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

async function loadSkills() {
    const skills = await fetchAPI('/api/skills');
    
    if (skills && elements.skillsTableBody) {
        elements.skillsTableBody.innerHTML = skills.map(skill => `
            <tr>
                <td>${skill.skill_name}</td>
                <td>${skill.category}</td>
                <td>${skill.percentage}%</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline" onclick='editSkill(${JSON.stringify(skill)})'>
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteSkill(${skill.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

async function loadMedia() {
    const media = await fetchAPI('/api/media');
    
    if (media && elements.mediaGrid) {
        elements.mediaGrid.innerHTML = media.map(item => {
            const isImage = item.mime_type && item.mime_type.startsWith('image');
            const isVideo = item.mime_type && item.mime_type.startsWith('video');
            
            return `
                <div class="media-item">
                    ${isImage ? `<img src="${item.file_path}" alt="${item.file_name}">` : ''}
                    ${isVideo ? `<video src="${item.file_path}"></video>` : ''}
                    ${!isImage && !isVideo ? `
                        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                            <i class="fas fa-file" style="font-size: 2rem;"></i>
                        </div>
                    ` : ''}
                    <div class="media-overlay">
                        <button class="copy-url" onclick="copyToClipboard('${item.file_path}')">
                            <i class="fas fa-link"></i> Copy URL
                        </button>
                    </div>
                    <button class="delete-media" onclick="deleteMedia(${item.id})" title="Delete">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }).join('');
    }
}

async function loadQRCode() {
    const qrData = await fetchAPI('/api/qr');
    
    if (qrData && elements.adminQrCode) {
        elements.adminQrCode.src = qrData.qrCode;
        elements.qrDownload.href = qrData.qrCode;
    }
}

// Form Submissions
elements.profileForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('profile-name').value,
        title: document.getElementById('profile-title').value,
        bio: document.getElementById('profile-bio').value,
        email: document.getElementById('profile-email').value,
        phone: document.getElementById('profile-phone').value,
        location: document.getElementById('profile-location').value,
        github: document.getElementById('profile-github').value,
        linkedin: document.getElementById('profile-linkedin').value,
        leetcode: document.getElementById('profile-leetcode').value,
        twitter: document.getElementById('profile-twitter').value,
        website: document.getElementById('profile-website').value,
        resume_file: document.getElementById('profile-resume').value,
        profile_image: document.getElementById('profile-image').value
    };
    
    const response = await fetchAPI('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(formData)
    });
    
    if (response) {
        showToast('Profile updated successfully!', 'success');
        loadQRCode(); // Update QR with new links
    }
});

elements.projectForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const projectId = document.getElementById('project-id').value;
    const formData = {
        title: document.getElementById('project-title').value,
        category: document.getElementById('project-category').value,
        description: document.getElementById('project-description').value,
        tech_stack: document.getElementById('project-tech').value,
        github_link: document.getElementById('project-github').value,
        demo_link: document.getElementById('project-demo').value,
        image: document.getElementById('project-image').value,
        video: document.getElementById('project-video').value,
        featured: document.getElementById('project-featured').checked,
        display_order: parseInt(document.getElementById('project-order').value) || 0
    };
    
    const url = projectId ? `/api/projects/${projectId}` : '/api/projects';
    const method = projectId ? 'PUT' : 'POST';
    
    const response = await fetchAPI(url, {
        method,
        body: JSON.stringify(formData)
    });
    
    if (response) {
        showToast(projectId ? 'Project updated!' : 'Project created!', 'success');
        closeModal('project-modal');
        loadProjects();
        loadStats();
    }
});

elements.skillForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const skillId = document.getElementById('skill-id').value;
    const formData = {
        skill_name: document.getElementById('skill-name').value,
        category: document.getElementById('skill-category').value,
        percentage: parseInt(document.getElementById('skill-percentage').value),
        icon: document.getElementById('skill-icon').value,
        display_order: parseInt(document.getElementById('skill-order').value) || 0
    };
    
    const url = skillId ? `/api/skills/${skillId}` : '/api/skills';
    const method = skillId ? 'PUT' : 'POST';
    
    const response = await fetchAPI(url, {
        method,
        body: JSON.stringify(formData)
    });
    
    if (response) {
        showToast(skillId ? 'Skill updated!' : 'Skill created!', 'success');
        closeModal('skill-modal');
        loadSkills();
        loadStats();
    }
});

elements.qrForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        github: document.getElementById('qr-github-input').value,
        linkedin: document.getElementById('qr-linkedin-input').value,
        leetcode: document.getElementById('qr-leetcode-input').value
    };
    
    const response = await fetchAPI('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(formData)
    });
    
    if (response) {
        showToast('QR Code updated!', 'success');
        loadQRCode();
    }
});

// CRUD Operations
function editProject(project) {
    openModal('project-modal', project);
}

function editSkill(skill) {
    openModal('skill-modal', skill);
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const response = await fetchAPI(`/api/projects/${id}`, {
        method: 'DELETE'
    });
    
    if (response) {
        showToast('Project deleted!', 'success');
        loadProjects();
        loadStats();
    }
}

async function deleteSkill(id) {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    const response = await fetchAPI(`/api/skills/${id}`, {
        method: 'DELETE'
    });
    
    if (response) {
        showToast('Skill deleted!', 'success');
        loadSkills();
        loadStats();
    }
}

async function deleteMedia(id) {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    const response = await fetchAPI(`/api/media/${id}`, {
        method: 'DELETE'
    });
    
    if (response) {
        showToast('File deleted!', 'success');
        loadMedia();
        loadStats();
    }
}

// File Upload
elements.uploadArea?.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.uploadArea.classList.add('dragover');
});

elements.uploadArea?.addEventListener('dragleave', () => {
    elements.uploadArea.classList.remove('dragover');
});

elements.uploadArea?.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

elements.fileInput?.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

async function handleFiles(files) {
    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'document');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });
            
            if (response.ok) {
                showToast(`Uploaded: ${file.name}`, 'success');
            } else {
                showToast(`Failed to upload: ${file.name}`, 'error');
            }
        } catch (error) {
            showToast(`Error uploading: ${file.name}`, 'error');
        }
    }
    
    loadMedia();
    loadStats();
}

// Utility Functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('URL copied to clipboard!', 'success');
    });
}

// Event Listeners
elements.loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    await login(username, password);
});

elements.logoutBtn?.addEventListener('click', logout);

elements.navItems?.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(item.dataset.section);
    });
});

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Initialize
function init() {
    if (authToken) {
        showDashboard();
    } else {
        showLoginScreen();
    }
}

// Run initialization
document.addEventListener('DOMContentLoaded', init);
