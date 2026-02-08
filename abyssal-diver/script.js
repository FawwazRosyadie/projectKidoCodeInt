/**
 * ABYSSAL DIVER - Interactive Science Minigame
 * Concepts: Pressure in Fluids, Depth relationship, Hull Stress
 */

(function () {
    // --- Configuration ---
    const CONFIG = {
        gravity: 0.1,
        buoyancy: 0.15,
        drag: 0.98,
        speed: 0.5,
        maxSpeed: 6,
        surfaceLevel: 100, // Y position of surface
        maxDepth: 3000,
        pixelsPerMeter: 5,
        pressurePerMeter: 0.1,
        basePressure: 1, // ATM
        hullMaxHealth: 100,
        gameDuration: 60, // seconds
        starThresholds: [1000, 3000, 5000]
    };

    // --- Game State ---
    const state = {
        isPlaying: false,
        score: 0,
        highScore: 0,
        timeLeft: CONFIG.gameDuration,
        depth: 0,
        pressure: 1, // atm
        hullHealth: 100,
        lastTime: 0,
        keys: { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false },
        objects: [],
        particles: [],
        camY: 0
    };

    try {
        state.highScore = parseInt(localStorage.getItem('abyssal_highscore')) || 0;
    } catch (e) { }

    // --- Asset Setup ---
    // Using root.getElementById as per Golden Rule
    const canvas = root.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    // Resize handling
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // --- Input Handling ---
    window.addEventListener('keydown', e => {
        if (state.keys.hasOwnProperty(e.key) || state.keys.hasOwnProperty(e.code)) state.keys[e.key] = true;
    });
    window.addEventListener('keyup', e => {
        if (state.keys.hasOwnProperty(e.key) || state.keys.hasOwnProperty(e.code)) state.keys[e.key] = false;
    });

    // --- Classes ---

    class Player {
        constructor() {
            this.x = canvas.width / 2;
            this.y = 200;
            this.vx = 0;
            this.vy = 0;
            this.width = 60;
            this.height = 30;
            this.angle = 0;
        }

        update() {
            if (state.keys['w'] || state.keys['ArrowUp']) this.vy -= CONFIG.speed;
            if (state.keys['s'] || state.keys['ArrowDown']) this.vy += CONFIG.speed;
            if (state.keys['a'] || state.keys['ArrowLeft']) this.vx -= CONFIG.speed;
            if (state.keys['d'] || state.keys['ArrowRight']) this.vx += CONFIG.speed;

            this.vy += CONFIG.gravity;
            this.vy -= (this.y > CONFIG.surfaceLevel) ? CONFIG.buoyancy : 0;
            this.vx *= CONFIG.drag;
            this.vy *= CONFIG.drag;
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) { this.x = 0; this.vx *= -0.5; }
            if (this.x > canvas.width) { this.x = canvas.width; this.vx *= -0.5; }
            if (this.y < 0) { this.y = 0; this.vy = 0; }

            let rawDepthPixels = Math.max(0, this.y - CONFIG.surfaceLevel);
            state.depth = Math.floor(rawDepthPixels / CONFIG.pixelsPerMeter);
            state.pressure = CONFIG.basePressure + (state.depth * CONFIG.pressurePerMeter);

            const CRITICAL_DEPTH = 300;
            if (state.depth > CRITICAL_DEPTH) {
                const excess = state.depth - CRITICAL_DEPTH;
                state.hullHealth -= (0.01 + (excess * 0.0001));
                if (Math.random() < 0.05) createParticle(this.x, this.y, 'bubble');
            }

            this.angle = this.vx * 0.05;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#00f3ff';
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(10, -5, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
            if (state.isPlaying) {
                ctx.fillStyle = '#444';
                ctx.fillRect(-this.width / 2 - 5, -5, 5, 10);
                if (Date.now() % 100 < 50) {
                    ctx.fillStyle = '#666';
                    ctx.fillRect(-this.width / 2 - 8, -8, 2, 16);
                }
            }
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#fff';
            let g = ctx.createLinearGradient(0, 0, 150, 0);
            g.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            g.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(150, -40);
            ctx.lineTo(150, 40);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
        }
    }

    class Collectible {
        constructor(y) {
            this.x = Math.random() * canvas.width;
            this.y = y;
            this.size = 15;
            this.value = 100 + Math.floor(y / 10);
            this.collected = false;
            this.type = Math.random() > 0.8 ? 'gold' : 'data';
            this.oscillation = Math.random() * Math.PI;
        }

        update() {
            this.oscillation += 0.05;
            this.y += Math.sin(this.oscillation) * 0.2;
        }

        draw() {
            if (this.collected) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            if (this.type === 'data') {
                ctx.fillStyle = '#0f0';
                ctx.shadowColor = '#0f0';
            } else {
                ctx.fillStyle = '#ffd700';
                ctx.shadowColor = '#ffd700';
            }
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size, 0);
            ctx.lineTo(0, this.size);
            ctx.lineTo(-this.size, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    class Debris {
        constructor(y) {
            this.x = Math.random() * canvas.width;
            this.y = y;
            this.size = 20 + Math.random() * 30;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = 0.5 + Math.random();
        }

        update() {
            this.y += this.vy;
            this.x += this.vx;
            if (this.y > (state.depth * CONFIG.pixelsPerMeter) + canvas.height + 500) {
                this.y = state.camY - 100;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = '#554433';
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(this.size / 2, this.size / 2);
            ctx.lineTo(-this.size / 2, this.size / 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Particle {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.life = 1.0;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (type === 'bubble') ? -1 - Math.random() : (Math.random() - 0.5) * 5;
            this.size = Math.random() * 5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= 0.02;
        }

        draw() {
            ctx.globalAlpha = this.life;
            ctx.fillStyle = (this.type === 'bubble') ? 'rgba(255,255,255,0.5)' : '#ff5500';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
    }

    const player = new Player();

    // --- Systems ---

    function createParticle(x, y, type) {
        state.particles.push(new Particle(x, y, type));
    }

    function spawnLevel() {
        state.objects = [];
        for (let i = 0; i < 30; i++) {
            let d = 200 + Math.random() * 4000;
            state.objects.push(new Collectible(d));
        }
        for (let i = 0; i < 15; i++) {
            let d = 500 + Math.random() * 4000;
            state.objects.push(new Debris(d));
        }
    }

    function checkCollisions() {
        state.objects.forEach(obj => {
            if (obj instanceof Collectible && !obj.collected) {
                const dist = Math.hypot(player.x - obj.x, player.y - obj.y);
                if (dist < player.width / 2 + obj.size) {
                    obj.collected = true;
                    state.score += obj.value;
                    createParticle(obj.x, obj.y, 'sparkle');
                }
            } else if (obj instanceof Debris) {
                const dist = Math.hypot(player.x - obj.x, player.y - obj.y);
                if (dist < player.width / 2 + obj.size) {
                    state.hullHealth -= 10;
                    obj.y += 100;
                    createParticle((player.x + obj.x) / 2, (player.y + obj.y) / 2, 'explosion');
                    player.vx = -player.vx * 2;
                    player.vy = -player.vy * 2;
                }
            }
        });
    }

    function updateHUD() {
        root.getElementById('hud-timer').innerText = `00:${Math.max(0, Math.floor(state.timeLeft)).toString().padStart(2, '0')}`;
        root.getElementById('hud-score').innerText = state.score.toString().padStart(4, '0');
        root.getElementById('hud-highscore').innerText = state.highScore;
        root.getElementById('depth-text').innerText = state.depth + " m";

        let pressureVal = state.pressure.toFixed(1);
        root.getElementById('pressure-text').innerText = pressureVal + " ATM";

        const hullParams = root.getElementById('hull-bar');
        hullParams.style.width = Math.max(0, state.hullHealth) + "%";
        hullParams.className = state.hullHealth < 30 ? "bar-fill danger" : (state.hullHealth < 60 ? "bar-fill warning" : "bar-fill");
        root.getElementById('hull-text').innerText = Math.ceil(state.hullHealth) + "%";

        const pressurePercent = Math.min(100, (state.depth / 600) * 100);
        root.getElementById('pressure-bar').style.width = pressurePercent + "%";

        const popup = root.getElementById('fact-popup');
        if (state.depth > 300 && !popup.classList.contains('active')) {
            popup.classList.add('active');
            root.getElementById('fact-text').innerText = "WARNING: DEPTH > 300m. Hull stress active due to extreme fluid pressure!";
        } else if (state.depth < 300 && popup.classList.contains('active')) {
            popup.classList.remove('active');
        }
    }

    // --- Game Loop ---
    function loop(timestamp) {
        if (!state.isPlaying) return;

        const dt = (timestamp - state.lastTime) / 1000;
        state.lastTime = timestamp;

        if (state.timeLeft > 0) {
            state.timeLeft -= (1 / 60);
        } else {
            gameOver("Oxygen Depleted");
            return;
        }

        if (state.hullHealth <= 0) {
            gameOver("Hull Crush Depth Exceeded");
            return;
        }

        player.update();
        state.objects.forEach(o => o.update());
        state.particles.forEach((p, i) => {
            p.update();
            if (p.life <= 0) state.particles.splice(i, 1);
        });

        checkCollisions();
        updateHUD();

        let targetCamY = player.y - canvas.height / 2;
        if (targetCamY < -100) targetCamY = -100;
        state.camY = targetCamY;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(0, -state.camY);

        ctx.fillStyle = 'rgba(0, 243, 255, 0.1)';
        ctx.fillRect(0, CONFIG.surfaceLevel, canvas.width, canvas.height + 5000);

        ctx.font = '12px Verdana';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let d = 0; d < 1000; d += 50) {
            let yPos = CONFIG.surfaceLevel + (d * CONFIG.pixelsPerMeter);
            if (yPos > state.camY - 50 && yPos < state.camY + canvas.height + 50) {
                ctx.fillText(`- ${d}m -`, 50, yPos);
                ctx.fillRect(0, yPos, 40, 1);
            }
        }

        state.objects.forEach(o => o.draw());
        state.particles.forEach(p => p.draw());
        player.draw();

        ctx.restore();

        requestAnimationFrame(loop);
    }

    // --- Control Flow ---
    function startGame() {
        state.score = 0;
        state.hullHealth = 100;
        state.timeLeft = CONFIG.gameDuration;
        state.depth = 0;
        state.pressure = 1;
        state.isPlaying = true;
        state.lastTime = performance.now();
        state.particles = [];

        player.x = canvas.width / 2;
        player.y = 100;
        player.vx = 0;
        player.vy = 0;

        spawnLevel();

        root.getElementById('start-screen').classList.add('hidden');
        root.getElementById('game-over-screen').classList.add('hidden');
        requestAnimationFrame(loop);
    }

    function calculateStars(score) {
        if (score >= CONFIG.starThresholds[2]) return 3;
        if (score >= CONFIG.starThresholds[1]) return 2;
        if (score >= CONFIG.starThresholds[0]) return 1;
        return 0;
    }

    function gameOver(reason) {
        state.isPlaying = false;
        if (state.score > state.highScore) {
            state.highScore = state.score;
            try { localStorage.setItem('abyssal_highscore', state.highScore); } catch (e) { }
        }

        const s = state.score;
        const starCount = calculateStars(s);

        const stars = [
            root.getElementById('star-1'),
            root.getElementById('star-2'),
            root.getElementById('star-3')
        ];
        stars.forEach(star => star.classList.remove('earned'));

        if (starCount >= 1) stars[0].classList.add('earned');
        if (starCount >= 2) stars[1].classList.add('earned');
        if (starCount >= 3) stars[2].classList.add('earned');

        root.getElementById('go-title').innerText = (reason === "Win" || reason === "Time Up" || s >= 1000) ? "MISSION COMPLETE" : "MISSION FAILED";

        root.getElementById('go-reason').innerText = reason;
        root.getElementById('go-score').innerText = state.score;
        root.getElementById('game-over-screen').classList.remove('hidden');
    }

    // Event Listeners
    const startBtn = root.getElementById('start-btn');
    if (startBtn) startBtn.addEventListener('click', startGame);

    const restartBtn = root.getElementById('restart-btn');
    if (restartBtn) restartBtn.addEventListener('click', startGame);

    const submitBtn = root.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const finalStars = calculateStars(state.score);
            game.end({
                score: state.score,
                stars: finalStars
            });
        });
    }

    resize();
})();
