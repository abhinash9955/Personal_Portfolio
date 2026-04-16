/* 
   ABK Premium Portfolio - Interactive Logic
   Features: Scroll Reveals, Smooth Navigation, Theme Management, EmailJS Integration
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Navbar Scroll Effect
    const header = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            // Using a simple toggle for mobile layout
            const isOpen = navLinks.style.display === 'flex';
            if (isOpen) {
                navLinks.style.display = '';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = 'var(--header-h)';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(10, 15, 28, 0.9)';
                navLinks.style.backdropFilter = 'blur(20px)';
                navLinks.style.webkitBackdropFilter = 'blur(20px)';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid var(--border)';
            }
        });
    }

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                navLinks.style.display = '';
            }
        });
    });

    // 4. Section Reveal Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 5. Section 5 is now simplified (Theme logic removed)

    // 6. EmailJS Implementation & Form Logic
    const contactForm = document.getElementById('contact-form');
    const successPopup = document.getElementById('contact-success');

    // Replace with your actual EmailJS Public Key
    const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; 
    
    if (window.emailjs) {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-premium-send');
            const originalContent = submitBtn.innerHTML;
            
            // Loading State
            submitBtn.innerHTML = '<span>Sending...</span><i data-lucide="loader-2" class="spin"></i>';
            submitBtn.disabled = true;
            if (window.lucide) window.lucide.createIcons();

            // Prepare template parameters
            const templateParams = {
                from_name: document.getElementById('user_name').value,
                from_email: document.getElementById('user_email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                to_name: "Abhinash Kumar"
            };

            // Send Email via EmailJS
            if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
                window.emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                    .then(() => {
                        showSuccess();
                    }, (error) => {
                        console.error('EmailJS Error:', error);
                        alert('Oops! Something went wrong. Please try again later.');
                        resetBtn();
                    });
            } else {
                // Simulation Mode (if keys aren't set yet)
                setTimeout(() => {
                    showSuccess();
                }, 1500);
            }

            function showSuccess() {
                // Show Success Popup
                successPopup.classList.add('active');
                successPopup.querySelector('p').textContent = "Message sent successfully! I will get back to you soon.";
                contactForm.reset();
                
                // Hide popup after 4 seconds
                setTimeout(() => {
                    successPopup.classList.remove('active');
                }, 4000);

                resetBtn();
            }

            function resetBtn() {
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                if (window.lucide) window.lucide.createIcons();
            }
        });
    }

    // 7. Hero Particles Logic
    initHeroParticles();

    // 8. Dynamic Typing Effect
    initTypingEffect();

    // 9. Skill Bars Animation Setup
    initSkillBars();
});

function initSkillBars() {
    const skillRows = document.querySelectorAll('.skill-row');
    skillRows.forEach(row => {
        const percent = row.getAttribute('data-percent');
        row.style.setProperty('--skill-percent', percent + '%');
    });
}

function initTypingEffect() {
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;

    const phrases = [
        "Data Science Enthusiast",
        "Python Developer",
        "Machine Learning Learner",
        "Dashboard Creator"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

function initHeroParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 100;
    
    // Mouse tracking
    let mouse = { x: null, y: null, radius: 150 };
    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Slower, more diverse floating speeds
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3 - 0.1; // Slight upward bias
            this.size = Math.random() * 2 + 1;
            this.baseSize = this.size;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.baseOpacity = this.opacity;
            this.angle = Math.random() * Math.PI * 2;
            this.spin = Math.random() * 0.02;
        }

        update() {
            // Add a subtle sine-wave drift for "floating" feel
            this.angle += this.spin;
            this.x += this.vx + Math.sin(this.angle) * 0.2;
            this.y += this.vy + Math.cos(this.angle) * 0.2;

            // Interactive Glow logic
            if (mouse.x && !isMobile) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    // Smoothly increase size and opacity
                    this.size = this.baseSize + (mouse.radius - distance) / 15;
                    this.opacity = Math.min(0.8, this.baseOpacity + (mouse.radius - distance) / 150);
                } else {
                    if (this.size > this.baseSize) this.size -= 0.1;
                    if (this.opacity > this.baseOpacity) this.opacity -= 0.01;
                }
            }

            // Screen wrapping
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
            ctx.fill();
            
            // Subtle glow stroke for "active" particles
            if (this.size > this.baseSize + 1) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
            } else {
                ctx.shadowBlur = 0;
            }
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    createParticles();
    animate();
}
