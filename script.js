// ===== Preloader =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
        initParticles();
    }, 2500);
});

// ===== Particle Background =====
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = ['#e8a0bf', '#f0d48a', '#ffb7ce', '#d4a853'][Math.floor(Math.random() * 4)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

// ===== Confetti =====
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const confetti = [];
    const colors = ['#e8a0bf', '#f0d48a', '#ffb7ce', '#d4a853', '#c77dba', '#f5d5e0', '#ff69b4', '#ffd700'];

    for (let i = 0; i < 200; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 12 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 4 + 2,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.2,
            drift: (Math.random() - 0.5) * 2,
            opacity: 1,
        });
    }

    let frame = 0;
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;
        let alive = false;
        confetti.forEach(c => {
            if (c.opacity <= 0) return;
            alive = true;
            c.y += c.speed;
            c.x += c.drift;
            c.angle += c.spin;
            if (frame > 120) c.opacity -= 0.008;
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.angle);
            ctx.globalAlpha = c.opacity;
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
            ctx.restore();
        });
        if (alive) requestAnimationFrame(animateConfetti);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animateConfetti();
}

// ===== Intersection Observer for Animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in-text, .wish-card').forEach(el => observer.observe(el));

// ===== Counter Animation =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter-number');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                const duration = 2000;
                const start = performance.now();
                function updateCounter(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(eased * target).toLocaleString();
                    if (progress < 1) requestAnimationFrame(updateCounter);
                }
                requestAnimationFrame(updateCounter);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const counterSection = document.getElementById('counter-section');
if (counterSection) counterObserver.observe(counterSection);

// ===== Celebrate Button =====
document.getElementById('celebrate-btn').addEventListener('click', () => {
    launchConfetti();
    // Add screen shake
    document.body.style.animation = 'shake 0.5s ease';
    setTimeout(() => document.body.style.animation = '', 500);
});

// Add shake keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-5px) rotate(-0.5deg); }
        40% { transform: translateX(5px) rotate(0.5deg); }
        60% { transform: translateX(-3px) rotate(-0.3deg); }
        80% { transform: translateX(3px) rotate(0.3deg); }
    }
`;
document.head.appendChild(style);

// ===== Smooth parallax on scroll =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / 800;
    }
});

// ===== Music Toggle =====
const musicBtn = document.getElementById('music-toggle');
const audio = document.getElementById('birthday-audio');
musicBtn.addEventListener('click', function() {
    if (audio.paused) {
        audio.play();
        this.classList.add('playing');
    } else {
        audio.pause();
        this.classList.remove('playing');
    }
});
