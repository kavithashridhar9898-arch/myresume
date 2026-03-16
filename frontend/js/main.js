/* ========================================
   MYRESUME - Main JavaScript
   API Integration & Dynamic Content
   ======================================== */

const API_BASE_URL = window.location.origin;

// DOM Elements
const elements = {
    heroName: document.getElementById('hero-name'),
    heroTitle: document.getElementById('hero-title'),
    heroBio: document.getElementById('hero-bio'),
    profileImage: document.getElementById('profile-image'),
    aboutText: document.getElementById('about-text'),
    projectsGrid: document.getElementById('projects-grid'),
    skillsContainer: document.getElementById('skills-container'),
    techTrack: document.getElementById('tech-track'),
    resumePreview: document.getElementById('resume-preview'),
    downloadResume: document.getElementById('download-resume'),
    qrCode: document.getElementById('qr-code'),
    githubLink: document.getElementById('github-link'),
    linkedinLink: document.getElementById('linkedin-link'),
    leetcodeLink: document.getElementById('leetcode-link'),
    qrGithub: document.getElementById('qr-github'),
    qrLinkedin: document.getElementById('qr-linkedin'),
    qrLeetcode: document.getElementById('qr-leetcode'),
    contactEmail: document.getElementById('contact-email'),
    contactLocation: document.getElementById('contact-location'),
    contactPhone: document.getElementById('contact-phone')
};

// API Helper Functions
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// Load Profile Data
async function loadProfile() {
    const profile = await fetchAPI('/api/profile');
    
    if (profile) {
        // Update hero section
        if (elements.heroName) elements.heroName.textContent = profile.name || 'Your Name';
        if (elements.heroTitle) elements.heroTitle.textContent = profile.title || 'Full Stack Developer';
        if (elements.heroBio) elements.heroBio.textContent = profile.bio || 'Welcome to my portfolio!';
        
        // Update about section
        if (elements.aboutText) {
            elements.aboutText.innerHTML = `<p>${profile.bio || 'Welcome to my portfolio!'}</p>`;
        }
        
        // Update profile image
        if (elements.profileImage && profile.profile_image) {
            elements.profileImage.src = profile.profile_image;
            elements.profileImage.alt = profile.name;
        }
        
        // Update social links
        if (elements.githubLink) elements.githubLink.href = profile.github || '#';
        if (elements.linkedinLink) elements.linkedinLink.href = profile.linkedin || '#';
        if (elements.leetcodeLink) elements.leetcodeLink.href = profile.leetcode || '#';
        
        // Update QR links
        if (elements.qrGithub) elements.qrGithub.href = profile.github || '#';
        if (elements.qrLinkedin) elements.qrLinkedin.href = profile.linkedin || '#';
        if (elements.qrLeetcode) elements.qrLeetcode.href = profile.leetcode || '#';
        
        // Update contact info
        if (elements.contactEmail) {
            elements.contactEmail.textContent = profile.email || 'your.email@example.com';
            elements.contactEmail.href = `mailto:${profile.email}`;
        }
        if (elements.contactLocation) elements.contactLocation.textContent = profile.location || 'Your Location';
        if (elements.contactPhone) elements.contactPhone.textContent = profile.phone || '+1 234 567 890';
        
        // Update resume
        if (profile.resume_file) {
            if (elements.resumePreview) {
                const fileExt = profile.resume_file.split('.').pop().toLowerCase();
                if (fileExt === 'pdf') {
                    elements.resumePreview.innerHTML = `
                        <iframe src="${profile.resume_file}" type="application/pdf"></iframe>
                    `;
                } else {
                    elements.resumePreview.innerHTML = `
                        <img src="${profile.resume_file}" alt="Resume">
                    `;
                }
            }
            if (elements.downloadResume) {
                elements.downloadResume.href = profile.resume_file;
                elements.downloadResume.download = 'resume.pdf';
            }
        }
    }
}

// Load Projects
async function loadProjects() {
    const projects = await fetchAPI('/api/projects');
    
    if (projects && projects.length > 0 && elements.projectsGrid) {
        elements.projectsGrid.innerHTML = projects.map(project => `
            <article class="project-card" data-tilt>
                ${project.featured ? '<span class="project-featured">Featured</span>' : ''}
                <div class="project-image">
                    <img src="${project.image || 'assets/placeholder-project.jpg'}" alt="${project.title}" loading="lazy">
                    <div class="project-overlay">
                        <div class="project-links">
                            ${project.github_link ? `
                                <a href="${project.github_link}" class="project-link" target="_blank" title="View Code">
                                    <i class="fab fa-github"></i>
                                </a>
                            ` : ''}
                            ${project.demo_link ? `
                                <a href="${project.demo_link}" class="project-link" target="_blank" title="Live Demo">
                                    <i class="fas fa-external-link-alt"></i>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <span class="project-category">${project.category || 'Project'}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description || ''}</p>
                    ${project.tech_stack ? `
                        <div class="project-tech">
                            ${project.tech_stack.split(',').map(tech => 
                                `<span class="tech-tag">${tech.trim()}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            </article>
        `).join('');
        
        // Re-initialize tilt effect for new cards
        if (window.initTiltEffect) {
            window.initTiltEffect();
        }
    }
}

// Load Skills
async function loadSkills() {
    const skills = await fetchAPI('/api/skills');
    
    if (skills && skills.length > 0) {
        // Group skills by category
        const categories = skills.reduce((acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
        }, {});
        
        // Category icons mapping
        const categoryIcons = {
            'Frontend': 'fa-laptop-code',
            'Backend': 'fa-server',
            'Database': 'fa-database',
            'DevOps': 'fa-cloud',
            'AI/Tools': 'fa-brain',
            'Other': 'fa-tools'
        };
        
        if (elements.skillsContainer) {
            elements.skillsContainer.innerHTML = Object.entries(categories).map(([category, categorySkills]) => `
                <div class="skill-category">
                    <div class="category-header">
                        <div class="category-icon">
                            <i class="fas ${categoryIcons[category] || 'fa-code'}"></i>
                        </div>
                        <h3 class="category-title">${category}</h3>
                    </div>
                    ${categorySkills.map(skill => `
                        <div class="skill-item">
                            <div class="skill-header">
                                <span class="skill-name">${skill.skill_name}</span>
                                <span class="skill-percent">${skill.percentage}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress" style="width: ${skill.percentage}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('');
        }
        
        // Update tech track with unique skills
        if (elements.techTrack) {
            const uniqueSkills = [...new Set(skills.map(s => s.skill_name))];
            const techIcons = {
                'HTML/CSS': 'fa-html5',
                'JavaScript': 'fa-js',
                'React': 'fa-react',
                'Node.js': 'fa-node',
                'Python': 'fa-python',
                'Git': 'fa-git-alt',
                'Docker': 'fa-docker',
                'AWS': 'fa-aws',
                'Database': 'fa-database',
                'MySQL': 'fa-database',
                'MongoDB': 'fa-envira'
            };
            
            // Duplicate for infinite scroll effect
            const allSkills = [...uniqueSkills, ...uniqueSkills];
            
            elements.techTrack.innerHTML = allSkills.map(skill => `
                <div class="tech-item">
                    <i class="fab ${techIcons[skill] || 'fa-code'}"></i>
                    <span>${skill}</span>
                </div>
            `).join('');
        }
    }
}

// Load QR Code
async function loadQRCode() {
    const qrData = await fetchAPI('/api/qr');
    
    if (qrData && elements.qrCode) {
        elements.qrCode.src = qrData.qrCode;
    }
}

// Initialize all data loading
async function initializeApp() {
    await Promise.all([
        loadProfile(),
        loadProjects(),
        loadSkills(),
        loadQRCode()
    ]);
    
    console.log('MyResume App Initialized');
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});
