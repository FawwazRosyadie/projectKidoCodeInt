/**
 * REACTION RATE RUSH
 * Game Logic
 */

// --- CONFIGURATION & STATE ---
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const COLORS = {
    A: '#3B82F6', // Reactant A (Blue)
    B: '#EF4444', // Reactant B (Red)
    Product: '#D946EF', // Product (Purple)
    Solid: '#9CA3AF', // Solid Chunk (Grey)
    CatalystGlow: 'rgba(234, 179, 8, 0.1)'
};

const STATE = {
    level: 1,
    score: 0,
    time: 60,
    isPlaying: false,
    products: 0,
    target: 20,
    temperature: 30, // 0 to 100
    activationEnergy: 5, // Threshold speed for reaction
    catalystActive: false,
    particles: []
};

// --- LEVEL DATA ---
const LEVELS = [
    {
        id: 1,
        title: "Temperature Rising",
        goal: 15,
        time: 45,
        target: 15,
        hint: "Heat transmits kinetic energy to particles. Move the Temperature Slider!",
        tools: ['temp'],
        startParticles: { A: 40, B: 40, Solid: 0 },
        activationEnergy: 4, // Moderate
        eduTitle: "Kinetic Energy & Temperature",
        eduText: "Increasing temperature increases the kinetic energy of particles. They move faster and collide more frequently and with more energy, leading to a higher reaction rate."
    },
    {
        id: 2,
        title: "Concentration Station",
        goal: 30,
        time: 60,
        target: 30,
        hint: "Crowded spaces mean more collisions! Add more reactants.",
        tools: ['temp', 'conc'],
        startParticles: { A: 5, B: 5, Solid: 0 },
        activationEnergy: 4,
        eduTitle: "Concentration",
        eduText: "Higher concentration means more particles in a given volume. This increases the frequency of collisions, thus increasing the rate of reaction."
    },
    {
        id: 3,
        title: "Surface Area Smash",
        goal: 40,
        time: 60,
        target: 40,
        hint: "Solid blocks react slowly. CRUSH them to expose more surface area!",
        tools: ['temp', 'conc', 'crush'],
        startParticles: { A: 20, B: 0, Solid: 5 }, // B is locked in solids
        activationEnergy: 4,
        eduTitle: "Surface Area",
        eduText: "Breaking a solid into smaller pieces increases its total surface area. More area helps particles collide more often, speeding up the reaction."
    },
    {
        id: 4,
        title: "Catalyst Commander",
        goal: 50,
        time: 60,
        target: 50,
        hint: "This reaction is tough! It needs high energy... or a shortcut. Use the Catalyst!",
        tools: ['temp', 'conc', 'cat'],
        startParticles: { A: 20, B: 20, Solid: 0 },
        activationEnergy: 8, // Very High!
        eduTitle: "Catalysts",
        eduText: "Catalysts provide an alternative reaction pathway with a lower activation energy. This allows more collisions to be successful without needing extreme heat."
    }
];

// --- DOM ELEMENTS ---
const canvas = document.getElementById('reaction-canvas');
const ctx = canvas.getContext('2d');
const ui = {
    score: document.getElementById('score-display'),
    level: document.getElementById('level-display'),
    timer: document.getElementById('timer-display'),
    productCurrent: document.getElementById('product-current'),
    productTarget: document.getElementById('product-target'),
    progressBar: document.getElementById('product-progress'),
    startScreen: document.getElementById('start-screen'),
    overlay: document.getElementById('reactor-overlay'),
    heatWarning: document.getElementById('heat-warning'),
    modal: document.getElementById('edu-modal'),
    modalTitle: document.getElementById('edu-title'),
    modalText: document.getElementById('edu-text'),
    modalScore: document.getElementById('level-score'),
    modalTime: document.getElementById('level-time'),
    btnNext: document.getElementById('next-level-btn'),
    startBtn: document.getElementById('start-btn'),

    // Controls
    sliderTemp: document.getElementById('temp-slider'),
    readoutTemp: document.getElementById('temp-readout'),
    btnConc: document.getElementById('btn-concentrate'),
    btnCrush: document.getElementById('btn-crush'),
    btnCat: document.getElementById('btn-catalyst')
};

// --- SETUP CANVAS ---
function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Init

// --- PARTICLE SYSTEM ---
class Particle {
    constructor(type, x, y) {
        this.type = type;
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2; // Base velocity
        this.vy = (Math.random() - 0.5) * 2;

        // Properties based on type
        if (type === 'Solid') {
            this.radius = 25;
            this.mass = 50;
            this.color = COLORS.Solid;
        } else if (type === 'Product') {
            this.radius = 8;
            this.mass = 2;
            this.color = COLORS.Product;
        } else {
            this.radius = 6;
            this.mass = 1;
            this.color = type === 'A' ? COLORS.A : COLORS.B;
        }
    }

    update() {
        // Temperature effect: Speed multiplier
        // 0-100 temp maps to 0.5x to 4.0x speed
        let speedMult = 0.5 + (STATE.temperature / 100) * 3.5;

        this.x += this.vx * speedMult;
        this.y += this.vy * speedMult;

        // Wall Collision
        if (this.x - this.radius < 0) { this.x = this.radius; this.vx *= -1; }
        if (this.x + this.radius > canvas.width) { this.x = canvas.width - this.radius; this.vx *= -1; }
        if (this.y - this.radius < 0) { this.y = this.radius; this.vy *= -1; }
        if (this.y + this.radius > canvas.height) { this.y = canvas.height - this.radius; this.vy *= -1; }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Effects
        if (this.type === 'Product') {
            ctx.shadowBlur = 10;
            ctx.shadowColor = COLORS.Product;
        } else {
            ctx.shadowBlur = 0;
        }
        ctx.closePath();
        ctx.shadowBlur = 0; // Reset
    }
}

// --- GAME ENGINE ---

function spawnParticle(type, x, y) {
    STATE.particles.push(new Particle(type, x, y));
}

function initLevel(levelId) {
    const levelData = LEVELS[levelId - 1];
    if (!levelData) return endGame(); // Finish all levels

    STATE.level = levelId;
    STATE.target = levelData.target;
    STATE.time = levelData.time;
    STATE.activationEnergy = levelData.activationEnergy;
    STATE.products = 0;
    STATE.particles = [];
    STATE.catalystActive = false;

    // Unlock UI
    ui.btnConc.classList.toggle('locked', !levelData.tools.includes('conc'));
    ui.btnCrush.classList.toggle('locked', !levelData.tools.includes('crush'));
    ui.btnCat.classList.toggle('locked', !levelData.tools.includes('cat'));

    // Spawn Initials
    for (let i = 0; i < levelData.startParticles.A; i++) spawnParticle('A');
    for (let i = 0; i < levelData.startParticles.B; i++) spawnParticle('B');
    for (let i = 0; i < levelData.startParticles.Solid; i++) spawnParticle('Solid');

    // UI Updates
    ui.level.textContent = STATE.level;
    ui.productTarget.textContent = STATE.target;
    ui.sliderTemp.value = 30; // Reset temp
    STATE.temperature = 30;
    ui.readoutTemp.textContent = "30°C";

    ui.startScreen.innerHTML = `
        <h1>LEVEL ${STATE.level}</h1>
        <p>${levelData.title}</p>
        <p style="color: #fff; font-style: italic;">"${levelData.hint}"</p>
        <button class="btn-primary" id="start-level-btn">START</button>
    `;
    ui.overlay.classList.remove('hidden');

    document.getElementById('start-level-btn').onclick = () => {
        ui.overlay.classList.add('hidden');
        STATE.isPlaying = true;
        gameLoop();
        startTimer();
    };
}

function checkCollisions() {
    for (let i = 0; i < STATE.particles.length; i++) {
        for (let j = i + 1; j < STATE.particles.length; j++) {
            const p1 = STATE.particles[i];
            const p2 = STATE.particles[j];

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < p1.radius + p2.radius) {
                // COLLISION!

                // Simple Elastic Bounce Logic (Simplified)
                const angle = Math.atan2(dy, dx);
                // Just reverse velocity roughly for chaos effect (not physics accurate but fun)
                const tempVx = p1.vx; p1.vx = p2.vx; p2.vx = tempVx;
                const tempVy = p1.vy; p1.vy = p2.vy; p2.vy = tempVy;

                // Move part so they don't stick
                const overlap = (p1.radius + p2.radius - dist) + 1;
                p1.x += Math.cos(angle) * overlap * 0.5;
                p1.y += Math.sin(angle) * overlap * 0.5;
                p2.x -= Math.cos(angle) * overlap * 0.5;
                p2.y -= Math.sin(angle) * overlap * 0.5;

                // REACTION CHECK
                // A + B -> Product
                if ((p1.type === 'A' && p2.type === 'B') || (p1.type === 'B' && p2.type === 'A')) {
                    attemptReaction(i, j);
                }
            }
        }
    }
}

function attemptReaction(idx1, idx2) {
    // Check Energy
    // Kinetic Energy is proportional to Velocity^2. 
    // We used a speed multiplier in update(), so true speed is base_vel * multiplier.
    // Simplifying: Just use Temp * Random Factor

    const reactionChance = (STATE.temperature / 100) + (STATE.catalystActive ? 0.5 : 0);
    const energyRequired = STATE.activationEnergy / 10; // Normalize 0-1

    // Roll dice
    // If Temp is high, chance is high.
    // If Activation Energy is high, chance is lower.

    const collisionEnergy = Math.random() * (STATE.temperature / 12); // Simulated collision energy
    const barrier = STATE.activationEnergy * (STATE.catalystActive ? 0.3 : 1.0);

    if (collisionEnergy > barrier) {
        // SUCCESS
        const p1 = STATE.particles[idx1];
        const p2 = STATE.particles[idx2];

        // Spawn Product at midpoint
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;

        // Remove reactants (careful with indices, remove higher first)
        STATE.particles.splice(Math.max(idx1, idx2), 1);
        STATE.particles.splice(Math.min(idx1, idx2), 1);

        spawnParticle('Product', mx, my);

        // Update Game State
        STATE.products++;
        STATE.score += 10 * STATE.level;
        updateHUD();

        // Check Completion
        if (STATE.products >= STATE.target) {
            winLevel();
        }
    }
}

function updateHUD() {
    ui.score.textContent = STATE.score;
    ui.productCurrent.textContent = STATE.products;
    const pct = (STATE.products / STATE.target) * 100;
    ui.progressBar.style.height = `${pct}%`;

    // Heat warning
    if (STATE.temperature > 90) {
        ui.heatWarning.style.display = 'block';
    } else {
        ui.heatWarning.style.display = 'none';
    }
}

let timerInterval;
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!STATE.isPlaying) return;
        STATE.time--;
        ui.timer.textContent = STATE.time;
        if (STATE.time <= 0) {
            loseLevel();
        }
    }, 1000);
}

function winLevel() {
    STATE.isPlaying = false;
    clearInterval(timerInterval);

    const levelData = LEVELS[STATE.level - 1];

    // Show Edu Modal
    ui.modalTitle.textContent = "Level Complete!";
    ui.modalScore.textContent = Math.floor(STATE.score + (STATE.time * 5)); // Time bonus
    ui.modalTime.textContent = (levelData.time - STATE.time) + "s";

    // Edu Content
    let visualClass = "";
    if (STATE.level === 1) visualClass = "fa-fire"; // Example icon logic

    const eduHTML = `
        <div style="padding: 20px; color: #fff;">
            <h3 style="color: var(--accent-cyan)">${levelData.eduTitle}</h3>
            <p>${levelData.eduText}</p>
        </div>
    `;
    ui.modalText.innerHTML = eduHTML;

    ui.modal.classList.remove('hidden');

    ui.btnNext.onclick = () => {
        ui.modal.classList.add('hidden');
        if (STATE.level < LEVELS.length) {
            initLevel(STATE.level + 1);
        } else {
            // Victory
            alert("CONGRATULATIONS! You are a Reaction Master!");
            initLevel(1); // Restart
        }
    };
}

function loseLevel() {
    STATE.isPlaying = false;
    clearInterval(timerInterval);
    alert("Time's Up! Reaction Incomplete.");
    initLevel(STATE.level); // Retry
}

// --- CONTROLS ---

ui.sliderTemp.addEventListener('input', (e) => {
    STATE.temperature = parseInt(e.target.value);
    ui.readoutTemp.textContent = STATE.temperature + "°C";
});

ui.btnConc.addEventListener('click', () => {
    if (ui.btnConc.classList.contains('locked')) return;
    // Add 2 A and 2 B
    for (let i = 0; i < 3; i++) spawnParticle('A');
    for (let i = 0; i < 3; i++) spawnParticle('B');
});

ui.btnCrush.addEventListener('click', () => {
    if (ui.btnCrush.classList.contains('locked')) return;
    // Find solids and break them
    const solids = STATE.particles.filter(p => p.type === 'Solid');
    if (solids.length === 0) return;

    // Animate or just break first one found
    const target = solids[0];
    const idx = STATE.particles.indexOf(target);
    if (idx > -1) {
        STATE.particles.splice(idx, 1);
        // Spawn fragments (B particles)
        for (let i = 0; i < 6; i++) {
            spawnParticle('B', target.x + (Math.random() - 0.5) * 20, target.y + (Math.random() - 0.5) * 20);
        }
    }
});

ui.btnCat.addEventListener('click', () => {
    if (ui.btnCat.classList.contains('locked')) return;
    if (STATE.catalystActive) return;

    STATE.catalystActive = true;
    ui.btnCat.classList.add('active');

    // Catalyst lasts 5 seconds
    setTimeout(() => {
        STATE.catalystActive = false;
        ui.btnCat.classList.remove('active');
    }, 5000);
});


// --- RENDER LOOP ---
function gameLoop() {
    if (!STATE.isPlaying) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Catalyst Background Effect
    if (STATE.catalystActive) {
        ctx.fillStyle = COLORS.CatalystGlow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Update and Draw Particles
    STATE.particles.forEach(p => {
        p.update();
        p.draw();
    });

    checkCollisions();

    requestAnimationFrame(gameLoop);
}

// --- INIT ---
ui.startBtn.addEventListener('click', () => {
    initLevel(1);
    // Hide main menu wrapper if we had one, but we reuse overlay for now
});

// Initial generic start
// ui.overlay.innerHTML ... set in InitLevel
initLevel(1);
STATE.isPlaying = false; // Wait for start click

