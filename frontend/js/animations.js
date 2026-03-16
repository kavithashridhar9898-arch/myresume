/* ========================================
   MYRESUME - Premium Animations
   GSAP, Three.js, Lenis Smooth Scroll
   ======================================== */

// Smooth scroll variables
let isTouchDevice;

// Native smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Simple Custom Cursor
class SimpleCursor {
    constructor() {
        this.cursorDot = document.querySelector('.cursor-dot');
        this.cursorOutline = document.querySelector('.cursor-outline');
        
        if (!this.cursorDot || !this.cursorOutline) return;
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.outlineX = 0;
        this.outlineY = 0;
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Move dot immediately
            this.cursorDot.style.left = this.mouseX + 'px';
            this.cursorDot.style.top = this.mouseY + 'px';
        }, { passive: true });
        
        // Animate outline with slight delay for smooth effect
        const animateOutline = () => {
            this.outlineX += (this.mouseX - this.outlineX) * 0.15;
            this.outlineY += (this.mouseY - this.outlineY) * 0.15;
            
            this.cursorOutline.style.left = this.outlineX + 'px';
            this.cursorOutline.style.top = this.outlineY + 'px';
            
            requestAnimationFrame(animateOutline);
        };
        
        animateOutline();
        
        // Add hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .magnetic-btn, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursorOutline.classList.remove('hover');
            });
        });
    }
}

// Three.js Hero Background - Optimized
class HeroBackground {
    constructor() {
        this.container = document.getElementById('hero-canvas');
        if (!this.container) return;
        
        // Skip Three.js on mobile for performance
        if (isTouchDevice && window.innerWidth < 768) {
            this.container.style.display = 'none';
            return;
        }
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: false,
            powerPreference: 'low-power'
        });
        
        this.frameCount = 0;
        this.isVisible = true;
        
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.container.appendChild(this.renderer.domElement);

        // Create gradient sphere - reduced detail
        const geometry = new THREE.IcosahedronGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0xC6A15B,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);

        // Add particles - reduced count
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 100;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x4F8CFF,
            transparent: true,
            opacity: 0.4
        });

        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);

        this.camera.position.z = 5;

        // Mouse interaction - throttled
        this.mouseX = 0;
        this.mouseY = 0;
        let mouseTimeout;
        
        document.addEventListener('mousemove', (e) => {
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            }, 50);
        }, { passive: true });

        window.addEventListener('resize', () => this.onResize(), { passive: true });
        
        // Pause when not visible
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
        });

        this.animate();
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.isVisible) return;
        
        this.frameCount++;
        
        // Render at 30fps for performance
        if (this.frameCount % 2 === 0) {
            // Rotate sphere
            this.sphere.rotation.x += 0.001;
            this.sphere.rotation.y += 0.002;

            // Rotate particles
            this.particles.rotation.y += 0.0005;

            // Mouse interaction
            this.sphere.rotation.x += this.mouseY * 0.001;
            this.sphere.rotation.y += this.mouseX * 0.001;

            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Magnetic Buttons
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic-btn');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.onMouseMove(e, btn));
            btn.addEventListener('mouseleave', (e) => this.onMouseLeave(e, btn));
        });
    }

    onMouseMove(e, btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    onMouseLeave(e, btn) {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
}

// GSAP Animations - Optimized
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Simple fade in without animations
        gsap.set('.hero-subtitle, .title-line, .title-name, .hero-role, .hero-description, .hero-buttons, .scroll-indicator', {
            opacity: 1,
            y: 0
        });
        return;
    }

    // Hero entrance animations - faster duration
    const heroTl = gsap.timeline({ delay: 0.3 });
    
    heroTl.to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    })
    .to('.title-line', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4')
    .to('.title-name', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.4')
    .to('.hero-role', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4')
    .to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4')
    .to('.hero-buttons', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4')
    .to('.scroll-indicator', {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.2');

    // Cinematic scroll reveal animations - Video-like smooth feel
    initCinematicScrollAnimations();

    // Parallax effects
    gsap.to('.hero-content', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        }
    });

    // Navbar background on scroll
    ScrollTrigger.create({
        start: 100,
        onUpdate: (self) => {
            const navbar = document.getElementById('navbar');
            if (self.scroll() > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

// Pop-up Scroll Reveal Animations
function initCinematicScrollAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || isTouchDevice) {
        // Make all elements visible immediately
        gsap.set('.about-image, .about-content, .about-stats, .about-social, .project-card, .skill-category, .resume-container, .qr-card, .contact-item', {
            opacity: 1,
            y: 0,
            scale: 1
        });
        return;
    }
    
    // Pop-up animation for About section
    gsap.set('.about-image', { opacity: 0, scale: 0.8, y: 60 });
    gsap.set('.about-content', { opacity: 0, scale: 0.8, y: 60 });
    
    ScrollTrigger.create({
        trigger: '.about',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.about-image', {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });
            gsap.to('.about-content', {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                delay: 0.15,
                ease: 'back.out(1.7)'
            });
        },
        once: true
    });
    
    // Pop-up animation for Project cards with stagger
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        gsap.set(card, { opacity: 0, scale: 0.7, y: 80, rotationX: -15 });
        
        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.7,
                    delay: index * 0.1,
                    ease: 'back.out(1.4)'
                });
            },
            once: true
        });
    });
    
    // Pop-up animation for Skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((cat, index) => {
        gsap.set(cat, { opacity: 0, scale: 0.85, y: 50 });
        
        ScrollTrigger.create({
            trigger: cat,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(cat, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.08,
                    ease: 'back.out(1.5)'
                });
            },
            once: true
        });
    });
    
    // Pop-up animation for Resume container
    gsap.set('.resume-container', { opacity: 0, scale: 0.9, y: 60 });
    
    ScrollTrigger.create({
        trigger: '.resume',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.resume-container', {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: 'back.out(1.4)'
            });
        },
        once: true
    });
    
    // Pop-up animation for QR card with bounce
    gsap.set('.qr-card', { opacity: 0, scale: 0.6, y: 100 });
    
    ScrollTrigger.create({
        trigger: '.qr-section',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.qr-card', {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.5)'
            });
        },
        once: true
    });
    
    // Pop-up animation for Contact items with stagger
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        gsap.set(item, { opacity: 0, scale: 0.8, x: -50 });
        
        ScrollTrigger.create({
            trigger: item,
            start: 'top 90%',
            onEnter: () => {
                gsap.to(item, {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'back.out(1.7)'
                });
            },
            once: true
        });
    });
    
    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
        const target = parseInt(stat.dataset.count);
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 90%',
            onEnter: () => {
                gsap.to(stat, {
                    innerHTML: target,
                    duration: 1.2,
                    delay: index * 0.1,
                    snap: { innerHTML: 1 },
                    ease: 'power2.out'
                });
            },
            once: true
        });
    });
    
    // Skill bars animation
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 90%',
            onEnter: () => {
                gsap.to(bar, {
                    width: width,
                    duration: 0.8,
                    delay: index * 0.05,
                    ease: 'power2.out'
                });
            },
            once: true
        });
    });
}

// 3D Tilt Effect for Cards - Disabled on touch devices
function initTiltEffect() {
    if (isTouchDevice) return;
    
    const cards = document.querySelectorAll('.project-card, .skill-category, .qr-card');
    let rafId = null;
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (rafId) cancelAnimationFrame(rafId);
            
            rafId = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
        }, { passive: true });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        }, { passive: true });
    });
}

// Hamburger Menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for touch device
    isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    // Initialize mobile menu first (always needed)
    initMobileMenu();
    
    // Initialize native smooth scroll for anchor links
    initSmoothScroll();
    
    // Initialize cursor immediately on desktop
    if (!isTouchDevice) {
        new SimpleCursor();
        new MagneticButtons();
    }
    
    // Initialize Three.js background (with internal mobile check)
    new HeroBackground();
    
    // Initialize GSAP animations
    initGSAPAnimations();
    
    // Initialize tilt effects (with internal mobile check)
    initTiltEffect();
});

// Export for use in other scripts
window.Animations = {
    lenis: () => lenis,
    scrollTo: (target) => {
        if (lenis) {
            lenis.scrollTo(target);
        } else {
            document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        }
    }
};
