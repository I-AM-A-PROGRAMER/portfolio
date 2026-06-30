import './style.css';
import gsap from 'gsap';

// --- Scroll & Navigation Logic ---
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-links li a');
const sections = document.querySelectorAll('.section');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');

// Mobile Menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('nav-active');
    const icon = hamburger.querySelector('i');
    if (navMenu.classList.contains('nav-active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
            navMenu.classList.remove('nav-active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

window.addEventListener('scroll', () => {
    let current = '';
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// --- Scroll Reveal Animations ---
const revealElements = document.querySelectorAll('[data-scroll-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.fromTo(entry.target, 
                { y: 50, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
            );
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    revealObserver.observe(el);
});

// --- ADVANCED THREE.JS SCENE (LAZY LOADED FOR PAGESPEED PERFORMANCE) ---
async function initThree() {
    const THREE = await import('three');
    const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
    const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
    const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');

    const canvas = document.querySelector('#bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;

    // Post-Processing (Bloom effect active for all screens as requested)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.8;
    bloomPass.radius = 0.5;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- 1. Morphing Data Core (Central Element) ---
    const coreGeometry = new THREE.IcosahedronGeometry(8, 15);
    const coreMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x6C63FF,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const coreMesh = new THREE.Points(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Store original vertices for morphing math
    const corePositions = coreMesh.geometry.attributes.position.array;
    const originalPositions = [];
    for (let i = 0; i < corePositions.length; i += 3) {
        originalPositions.push({ x: corePositions[i], y: corePositions[i+1], z: corePositions[i+2] });
    }

    // --- 2. Ambient Particles (Starfield / Dust) ---
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 1200; // Reduced slightly from 2000 for mobile smoothness
    const posArr = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount * 3; i++) {
        posArr[i] = (Math.random() - 0.5) * 200;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x00D4FF,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const ambientParticles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(ambientParticles);

    // --- 3. Geometric Halos / Rings ---
    const halos = new THREE.Group();
    scene.add(halos);

    for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(12 + (i * 3), 0.02, 16, 80);
        const ringMat = new THREE.MeshBasicMaterial({ 
            color: i % 2 === 0 ? 0x00D4FF : 0x6C63FF, 
            transparent: true, 
            opacity: 0.4,
            wireframe: true
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        ring.userData = { speedX: (Math.random() - 0.5) * 0.02, speedY: (Math.random() - 0.5) * 0.02 };
        halos.add(ring);
    }

    // --- Interaction & Animation Logic ---
    const mouse = new THREE.Vector2(0, 0);
    let targetX = 0;
    let targetY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX - windowHalfX);
        mouse.y = (event.clientY - windowHalfY);
    });

    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    const clock = new THREE.Clock();
    let isTabActive = true;
    let animationFrameId = null;

    document.addEventListener('visibilitychange', () => {
        isTabActive = !document.hidden;
        if (isTabActive) {
            clock.getDelta(); // Reset clock delta
            animate();
        } else if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });

    function animate() {
        if (!isTabActive) return;
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // 1. Morph the Data Core using Sine waves
        const positions = coreMesh.geometry.attributes.position.array;
        for (let i = 0; i < originalPositions.length; i++) {
            const i3 = i * 3;
            const orig = originalPositions[i];
            
            const offset = 0.5 * Math.sin(orig.x * 0.5 + elapsedTime * 2) 
                         + 0.5 * Math.cos(orig.y * 0.5 + elapsedTime * 1.5)
                         + 0.5 * Math.sin(orig.z * 0.5 + elapsedTime * 1.2);

            const scrollEffect = Math.min((scrollY * 0.005), 5);
            
            const scale = 1 + (offset * 0.2) + scrollEffect;

            positions[i3] = orig.x * scale;
            positions[i3+1] = orig.y * scale;
            positions[i3+2] = orig.z * scale;
        }
        coreMesh.geometry.attributes.position.needsUpdate = true;
        
        coreMesh.rotation.y += 0.002;
        coreMesh.rotation.x += 0.001;

        // 2. Halos Rotation & Scale on Scroll
        halos.children.forEach(ring => {
            ring.rotation.x += ring.userData.speedX;
            ring.rotation.y += ring.userData.speedY;
        });
        const haloScale = 1 + (scrollY * 0.002);
        halos.scale.set(haloScale, haloScale, haloScale);

        // 3. Ambient Particles Flow & Scale on Scroll
        ambientParticles.rotation.y = elapsedTime * 0.05;
        const particleScale = 1 + (scrollY * 0.001);
        ambientParticles.scale.set(particleScale, particleScale, particleScale);
        
        // 4. Parallax based on Mouse (Smoothly move the whole scene)
        targetX = mouse.x * 0.001;
        targetY = mouse.y * 0.001;
        
        scene.rotation.y += 0.05 * (targetX - scene.rotation.y);
        scene.rotation.x += 0.05 * (targetY - scene.rotation.x);

        composer.render();
    }

    animate();
    // Fade in canvas smoothly once loaded
    requestAnimationFrame(() => {
        canvas.style.opacity = '1';
    });
}

// Defer Three.js loading by 400ms to allow main thread to paint initial layout immediately
if (document.readyState === 'complete') {
    setTimeout(initThree, 400);
} else {
    window.addEventListener('load', () => {
        setTimeout(initThree, 400);
    });
}

// --- Entrance Animations ---
gsap.from(".greeting", { y: -30, opacity: 0, duration: 1, delay: 0.2 });
gsap.from(".main-title", { y: 30, opacity: 0, duration: 1, delay: 0.4 });
gsap.from(".subtitle", { opacity: 0, duration: 1, delay: 0.8 });
gsap.from(".tagline", { opacity: 0, duration: 1, delay: 1 });
gsap.from(".description", { opacity: 0, duration: 1, delay: 1.2 });
gsap.from(".cta-container", { scale: 0.8, opacity: 0, duration: 1, delay: 1.4, ease: "back.out(1.7)" });

// --- Skill Bar Animation on Scroll ---
const skillBars = document.querySelectorAll('.skill-progress');
const skillsSection = document.querySelector('#skills');

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            skillBars.forEach(bar => {
                const targetVal = bar.getAttribute('data-target');
                gsap.to(bar, {
                    width: targetVal + '%',
                    duration: 1.5,
                    ease: "power2.out",
                    delay: 0.2
                });
            });
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// --- Dynamic Project Count Update ---
const projectCards = document.querySelectorAll('.project-card');
const projectCountVal = document.getElementById('project-count-val');
if (projectCountVal && projectCards) {
    projectCountVal.textContent = projectCards.length;
}

// --- Email Copy to Clipboard ---
const copyEmailBtn = document.getElementById('copy-email-btn');
const emailTooltip = document.getElementById('email-tooltip');

if (copyEmailBtn && emailTooltip) {
    copyEmailBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = 'supriyo3606c@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            emailTooltip.textContent = 'Copied to clipboard!';
            emailTooltip.classList.add('active');
            emailTooltip.style.borderColor = 'var(--secondary)';
            emailTooltip.style.boxShadow = '0 0 10px var(--secondary-glow)';
            
            setTimeout(() => {
                emailTooltip.textContent = 'Click to copy';
                emailTooltip.classList.remove('active');
                emailTooltip.style.borderColor = 'var(--primary)';
                emailTooltip.style.boxShadow = '0 0 10px var(--primary-glow)';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });
}



