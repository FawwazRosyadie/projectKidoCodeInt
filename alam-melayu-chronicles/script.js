/**
 * Chronicles of Alam Melayu: Heritage Guardian
 * Separated and Refactored for GameGenerator Platform Compliance
 */

// --- POLYFILLS FOR LOCAL TESTING ---
// (These prevent errors when running locally where 'root' and 'game' are undefined)
if (typeof root === 'undefined') {
    var root = document;
}
if (typeof game === 'undefined') {
    var game = {
        end: function (data) { console.log("Game Ended:", data); },
        emit: function (evt, data) { console.log("Emit:", evt, data); }
    };
}
// -----------------------------------

(function () {
    const CONFIG = {
        GAME_DURATION: 60,
        INITIAL_SPAWN_RATE: 1500,
        MIN_SPAWN_RATE: 450,
        ITEM_SPEED_MIN: 2.8,
        ITEM_SPEED_MAX: 4.8,
        TYPES: {
            RELIGION: 'religion',
            HERITAGE: 'heritage',
            WISDOM: 'wisdom'
        }
    };

    const STRINGS = {
        en: {
            title: "Chronicles of Alam Melayu",
            description: "Master the legacy of the Great Kingdoms. Align your spiritual shield to the essence of falling artifacts. Do not let the wisdom of the past fade into chaos.",
            start_btn: "Begin Revelation",
            restart_btn: "Try Again", // Updated to match button text
            score_label: "Score",
            high_score_label: "Top Record",
            timer_label: "Time Remaining",
            multiplier_label: "Power Multiplier",
            game_over: "The Record is Sealed",
            final_score: "Final Legacy Points",
            mode_heritage: "Heritage Mode",
            mode_religion: "Religion Mode",
            inst_1: "🖱️ Move Mouse: Control Guardian movement across the screen.",
            inst_2: "🛡️ Click/Space: Switch Shield Mode between Religion (Blue) & Heritage (Gold).",
            inst_3: "⚡ Match & Catch: Catch items with the correct shield to build your multiplier!",
            eval_1: "A seeker of knowledge. The path of the ancestors is long.",
            eval_2: "Guardian of the Realms. Your wisdom shines bright.",
            eval_3: "Eternal Chronicler! You have mastered the spirit of the Orient!",
            wave_prefix: "WAVE ",
            facts: [
                "Animisme & Dinamisme were the core early beliefs of Alam Melayu.",
                "Hinduism/Buddhism influenced the concept of 'Devaraja' (Divine King).",
                "Islam arrived in the 7th century, bringing Jawi scripts and new laws.",
                "Candi architecture like Borobudur & Angkor Wat are peak heritage sites.",
                "Srivijaya was the spiritual center for Buddhist studies in SE Asia.",
                "The Malay language was the 'Lingua Franca' for regional trade.",
                "Baray irrigation in Angkor shows advanced engineering wisdom.",
                "Diplomacy with China helped Melaka flourish as a trade hub.",
                "Pallava, Kawi, and Jawi scripts preserve our written history.",
                "Royal Regalia signifies the sovereignty of the Malay Monarchs.",
                "The concept of 'Daulat' defines the sacred power of the King.",
                "Kedah Tua was a major early center for iron smelting & trade.",
                "Majapahit's influence spread far through the 'Sumpah Palapa'.",
                "Candi Lembah Bujang is evidence of Hindu-Buddhist influence in Kedah.",
                "Traditional medicine (Jamu/Ubat) is part of the unique heritage."
            ]
        },
        ms: {
            title: "Hikayat Alam Melayu",
            description: "Kuasai warisan Kerajaan-Kerajaan Agung. Selaraskan perisai rohani anda dengan pati artifak yang jatuh. Jangan biarkan kearifan masa lalu pudar dalam kekacauan.",
            start_btn: "Mulakan Wahyu",
            restart_btn: "Cuba Lagi", // Try Again
            score_label: "Skor",
            high_score_label: "Rekod Terbaik",
            timer_label: "Baki Masa",
            multiplier_label: "Pengganda Kuasa",
            game_over: "Rekod Telah Dimeterai",
            final_score: "Mata Warisan Akhir",
            mode_heritage: "Mod Warisan",
            mode_religion: "Mod Agama",
            inst_1: "🖱️ Gerakkan Tetikus: Kawal pergerakan Penjaga di seluruh skrin.",
            inst_2: "🛡️ Klik/Space: Tukar mod perisai antara Agama (Biru) & Warisan (Emas).",
            inst_3: "⚡ Padan & Tangkap: Tangkap item dengan perisai yang betul untuk mata kombo!",
            eval_1: "Pencari ilmu. Jalan nenek moyang masih jauh.",
            eval_2: "Penjaga Alam. Kebijaksanaan anda terpancar terang.",
            eval_3: "Kronikel Abadi! Anda telah menguasai roh ketimuran!",
            wave_prefix: "GELOMBANG ",
            facts: [
                "Animisme & Dinamisme adalah teras kepercayaan awal Alam Melayu.",
                "Agama Hindu/Buddha mempengaruhi konsep 'Devaraja' (Raja Dewa).",
                "Islam tiba pada abad ke-7, membawa tulisan Jawi dan hukum baharu.",
                "Seni bina Candi seperti Borobudur & Angkor Wat adalah tapak warisan utama.",
                "Srivijaya menjadi pusat pengajian agama Buddha di Asia Tenggara.",
                "Bahasa Melayu merupakan 'Lingua Franca' bagi perdagangan serantau.",
                "Sistem pengairan Baray di Angkor menunjukkan kearifan kejuruteraan.",
                "Diplomasi dengan China membantu Melaka berkembang sebagai hab.",
                "Tulisan Pallava, Kawi, dan Jawi memelihara sejarah bertulis kita.",
                "Alat Kebesaran Diraja melambangkan kedaulatan Raja-raja Melayu.",
                "Konsep 'Daulat' menentukan kuasa suci seorang Raja.",
                "Kedah Tua merupakan pusat utama peleburan besi dan perdagangan.",
                "Pengaruh Majapahit tersebar luas melalui 'Sumpah Palapa'.",
                "Candi Lembah Bujang bukti pengaruh Hindu-Buddha di Kedah.",
                "Perubatan tradisional (Jamu/Ubat) adalah sebahagian warisan unik."
            ]
        }
    };

    const ASSETS = {
        religion: [
            { icon: '🕉️', fact: 1, color: '#4fa4ff' },
            { icon: '☸️', fact: 1, color: '#4fa4ff' },
            { icon: '🌙', fact: 2, color: '#4fa4ff' },
            { icon: '🌿', fact: 0, color: '#4fa4ff' },
            { icon: '🗿', fact: 0, color: '#4fa4ff' },
            { icon: '🕍', fact: 4, color: '#4fa4ff' }
        ],
        heritage: [
            { icon: '🏛️', fact: 3, color: '#ffd700' },
            { icon: '📜', fact: 8, color: '#ffd700' },
            { icon: '👑', fact: 9, color: '#ffd700' },
            { icon: '🧱', fact: 6, color: '#ffd700' },
            { icon: '⛵', fact: 5, color: '#ffd700' },
            { icon: '🗡️', fact: 10, color: '#ffd700' },
            { icon: '🏺', fact: 11, color: '#ffd700' }
        ],
        wisdom: [
            { icon: '🤝', fact: 7, color: '#4ade80' },
            { icon: '🏗️', fact: 6, color: '#4ade80' },
            { icon: '💊', fact: 14, color: '#4ade80' }
        ]
    };

    class HeritageGame {
        constructor() {
            this.lang = 'ms';
            this.score = 0;
            this.highScore = localStorage.getItem('alamMelayuHighScore') || 0;
            this.isPlaying = false;
            this.timeLeft = CONFIG.GAME_DURATION;
            this.multiplier = 1.0;
            this.combo = 0;
            this.mode = 'heritage';
            this.items = [];
            this.particles = [];
            this.bgParticles = [];
            this.wave = 1;
            this.spawnRate = CONFIG.INITIAL_SPAWN_RATE;
            this.finalStars = 0;

            // Movement state
            this.guardianX = window.innerWidth / 2;
            this.targetX = this.guardianX;
            this.guardianWidth = 140;

            // Use root instead of document
            this.canvasBg = root.getElementById('bg-canvas');
            this.canvasItems = root.getElementById('item-canvas');
            this.canvasParts = root.getElementById('particle-canvas');

            this.ctxBg = this.canvasBg.getContext('2d');
            this.ctxItems = this.canvasItems.getContext('2d');
            this.ctxParts = this.canvasParts.getContext('2d');

            this.init();
        }

        init() {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.initBgParticles();
            this.updateStrings();
            root.getElementById('high-score-val').innerText = this.highScore;

            // Input Listeners
            window.addEventListener('mousemove', (e) => {
                this.targetX = e.clientX;
            });

            window.addEventListener('touchmove', (e) => {
                if (e.touches[0]) this.targetX = e.touches[0].clientX;
            }, { passive: false });

            window.addEventListener('mousedown', () => {
                if (this.isPlaying) this.switchMode();
            });

            // Using window for keydown to be broader than document, though document is standard
            window.addEventListener('keydown', (e) => {
                if (e.code === 'Space') {
                    e.preventDefault();
                    this.switchMode();
                }
            });

            this.animate();
        }

        resize() {
            this.canvasBg.width = this.canvasItems.width = this.canvasParts.width = window.innerWidth;
            this.canvasBg.height = this.canvasItems.height = this.canvasParts.height = window.innerHeight;
            this.guardianWidth = window.innerWidth < 768 ? 100 : 140;
        }

        initBgParticles() {
            this.bgParticles = [];
            for (let i = 0; i < 80; i++) {
                this.bgParticles.push({
                    x: Math.random() * innerWidth,
                    y: Math.random() * innerHeight,
                    size: Math.random() * 3 + 0.5,
                    speed: Math.random() * 0.5 + 0.1,
                    opacity: Math.random(),
                    osc: Math.random() * Math.PI
                });
            }
        }

        updateStrings() {
            const t = STRINGS[this.lang];
            root.querySelectorAll('[data-key]').forEach(el => {
                const key = el.getAttribute('data-key');
                if (t[key]) el.innerText = t[key];
            });
            this.updateGuardianLabel();
        }

        toggleLanguage() {
            this.lang = this.lang === 'en' ? 'ms' : 'en';
            root.getElementById('lang-btn').innerText = this.lang === 'en' ? 'MS | EN' : 'EN | MS';
            this.updateStrings();
        }

        switchMode() {
            if (!this.isPlaying) return;
            this.mode = this.mode === 'heritage' ? 'religion' : 'heritage';
            const g = root.getElementById('guardian');
            g.className = `mode-${this.mode}`;
            this.updateGuardianLabel();

            const color = this.mode === 'religion' ? '#4fa4ff' : '#ffd700';
            this.createExplosion(this.guardianX, innerHeight - 190, color, 25);

            g.style.transition = 'none';
            g.style.transform = `scale(1.2)`;
            setTimeout(() => {
                g.style.transition = 'border-color 0.3s ease, background 0.3s ease';
                g.style.transform = `scale(1)`;
            }, 100);
        }

        updateGuardianLabel() {
            const key = this.mode === 'heritage' ? 'mode_heritage' : 'mode_religion';
            root.getElementById('guardian-mode-text').innerText = STRINGS[this.lang][key];
        }

        start() {
            this.isPlaying = true;
            this.score = 0;
            this.timeLeft = CONFIG.GAME_DURATION;
            this.multiplier = 1.0;
            this.combo = 0;
            this.wave = 1;
            this.items = [];
            this.spawnRate = CONFIG.INITIAL_SPAWN_RATE;
            this.guardianX = innerWidth / 2;
            this.targetX = innerWidth / 2;

            root.getElementById('start-screen').style.display = 'none';
            root.getElementById('game-over-screen').style.display = 'none';
            root.getElementById('game-container').style.cursor = 'none';
            this.updateHUD();

            this.startTimers();
            this.showAchievement(STRINGS[this.lang].wave_prefix + "1");
        }

        startTimers() {
            if (this.gameInterval) clearInterval(this.gameInterval);
            if (this.spawnTimeout) clearTimeout(this.spawnTimeout);

            this.gameInterval = setInterval(() => {
                if (!this.isPlaying) return;
                this.timeLeft--;

                if (this.timeLeft <= 0) {
                    this.timeLeft = 0;
                    this.updateHUD();
                    this.gameOver();
                    return;
                }

                this.updateHUD();

                if (this.timeLeft % 12 === 0) {
                    this.wave++;
                    this.spawnRate = Math.max(CONFIG.MIN_SPAWN_RATE, this.spawnRate * 0.8);
                    this.showAchievement(STRINGS[this.lang].wave_prefix + this.wave);
                }
            }, 1000);

            const loop = () => {
                if (!this.isPlaying) return;
                this.spawnItem();
                this.spawnTimeout = setTimeout(loop, this.spawnRate);
            };
            loop();
        }

        spawnItem() {
            const rand = Math.random();
            let type;
            if (rand < 0.45) type = 'religion';
            else if (rand < 0.9) type = 'heritage';
            else type = 'wisdom';

            const pool = ASSETS[type];
            const item = pool[Math.floor(Math.random() * pool.length)];

            const x = 50 + Math.random() * (innerWidth - 100);
            this.items.push({
                x, y: -100,
                type,
                icon: item.icon,
                fact: item.fact,
                color: item.color,
                speed: (CONFIG.ITEM_SPEED_MIN + Math.random() * (CONFIG.ITEM_SPEED_MAX - CONFIG.ITEM_SPEED_MIN)) * (1 + (this.wave - 1) * 0.15),
                rot: 0,
                rotSpeed: (Math.random() - 0.5) * 0.12
            });
        }

        updateHUD() {
            root.getElementById('score-val').innerText = Math.floor(this.score);
            root.getElementById('timer-val').innerText = `${this.timeLeft}s`;
            root.getElementById('multiplier-val').innerText = `x${this.multiplier.toFixed(1)}`;
        }

        showAchievement(msg) {
            const el = root.getElementById('achievement');
            el.innerText = msg;
            el.classList.add('show');
            setTimeout(() => el.classList.remove('show'), 2500);
        }

        showFact(index) {
            const bubble = root.getElementById('fact-bubble');
            const text = root.getElementById('fact-text');
            text.innerText = STRINGS[this.lang].facts[index];
            bubble.classList.add('visible');
            setTimeout(() => bubble.classList.remove('visible'), 4500);
        }

        createExplosion(x, y, color, count) {
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 12,
                    vy: (Math.random() - 0.5) * 12,
                    life: 1.0,
                    color,
                    size: Math.random() * 5 + 2
                });
            }
        }

        spawnPointsText(x, y, text, color) {
            const div = document.createElement('div');
            div.className = 'points-anim';
            div.innerText = text;
            div.style.left = `${x}px`;
            div.style.top = `${y}px`;
            div.style.color = color;
            root.getElementById('game-container').appendChild(div);
            setTimeout(() => div.remove(), 1200);
        }

        gameOver() {
            this.isPlaying = false;
            clearInterval(this.gameInterval);
            clearTimeout(this.spawnTimeout);

            root.getElementById('game-container').style.cursor = 'auto';

            if (this.score > this.highScore) {
                this.highScore = Math.floor(this.score);
                localStorage.setItem('alamMelayuHighScore', this.highScore);
                root.getElementById('high-score-val').innerText = this.highScore;
            }

            root.getElementById('final-score-val').innerText = Math.floor(this.score);
            root.getElementById('game-over-screen').style.display = 'flex';

            let stars = 0;
            if (this.score >= 500) stars = 1;
            if (this.score >= 1200) stars = 2;
            if (this.score >= 2500) stars = 3;
            this.finalStars = stars;

            const nodes = root.getElementById('stars-display').children;
            for (let i = 0; i < 3; i++) nodes[i].classList.toggle('active', i < stars);

            root.getElementById('evaluation-text').innerText = STRINGS[this.lang][`eval_${stars || 1}`];
        }

        restart() {
            this.start();
        }

        animate() {
            // Smooth movement interpolation (Lerp)
            const lerpFactor = 0.15;
            this.guardianX += (this.targetX - this.guardianX) * lerpFactor;

            // Clamp guardian within screen
            const halfWidth = this.guardianWidth / 2;
            if (this.guardianX < halfWidth) this.guardianX = halfWidth;
            if (this.guardianX > innerWidth - halfWidth) this.guardianX = innerWidth - halfWidth;

            // Update Guardian DOM position
            const gEl = root.getElementById('guardian');
            gEl.style.left = `${this.guardianX - halfWidth}px`;

            // Background Rendering
            this.ctxBg.clearRect(0, 0, innerWidth, innerHeight);

            // Ancient Geometric Background
            this.ctxBg.strokeStyle = 'rgba(255, 215, 0, 0.04)';
            this.ctxBg.lineWidth = 1;
            const time = Date.now() * 0.001;
            for (let i = 0; i < 3; i++) {
                this.ctxBg.beginPath();
                this.ctxBg.arc(innerWidth / 2, innerHeight / 2, 200 + i * 80 + Math.sin(time + i) * 20, 0, Math.PI * 2);
                this.ctxBg.stroke();
            }

            this.bgParticles.forEach(p => {
                p.y += p.speed;
                p.osc += 0.02;
                const xOffset = Math.sin(p.osc) * 5;
                if (p.y > innerHeight) p.y = -20;
                this.ctxBg.fillStyle = `rgba(255, 255, 255, ${p.opacity * (0.5 + Math.sin(time + p.osc) * 0.5)})`;
                this.ctxBg.beginPath();
                this.ctxBg.arc(p.x + xOffset, p.y, p.size, 0, Math.PI * 2);
                this.ctxBg.fill();
            });

            // Items Handling
            this.ctxItems.clearRect(0, 0, innerWidth, innerHeight);
            const gY = innerHeight - 120 - (this.guardianWidth / 2);

            if (this.isPlaying) {
                for (let i = this.items.length - 1; i >= 0; i--) {
                    const item = this.items[i];
                    item.y += item.speed;
                    item.rot += item.rotSpeed;

                    // Draw Item with Shadow Glow
                    this.ctxItems.save();
                    this.ctxItems.translate(item.x, item.y);
                    this.ctxItems.rotate(item.rot);
                    this.ctxItems.font = `${innerWidth < 768 ? '45px' : '60px'} Arial`; // Changed to Arial
                    this.ctxItems.textAlign = 'center';
                    this.ctxItems.textBaseline = 'middle';
                    this.ctxItems.shadowBlur = 20;
                    this.ctxItems.shadowColor = item.color;
                    this.ctxItems.fillText(item.icon, 0, 0);
                    this.ctxItems.restore();

                    // Collision Logic (Circular)
                    const dx = item.x - this.guardianX;
                    const dy = item.y - (innerHeight - 120 - halfWidth);
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < halfWidth + 20) {
                        this.handleCollection(item, i);
                    } else if (item.y > innerHeight + 100) {
                        this.items.splice(i, 1);
                        if (item.type !== 'wisdom') {
                            this.combo = 0;
                            this.multiplier = 1.0;
                        }
                    }
                }
            }

            // Particles
            this.ctxParts.clearRect(0, 0, innerWidth, innerHeight);
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.025;
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                } else {
                    this.ctxParts.globalAlpha = p.life;
                    this.ctxParts.fillStyle = p.color;
                    this.ctxParts.beginPath();
                    this.ctxParts.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                    this.ctxParts.fill();
                }
            }

            requestAnimationFrame(() => this.animate());
        }

        handleCollection(item, index) {
            let isCorrect = (item.type === this.mode);
            let bonus = (item.type === 'wisdom');

            if (isCorrect || bonus) {
                this.combo++;
                this.multiplier = Math.min(5, 1 + (Math.floor(this.combo / 4) * 0.25));
                const basePoints = bonus ? 60 : 25;
                const gained = basePoints * this.multiplier;
                this.score += gained;

                this.createExplosion(item.x, item.y, item.color, 30);
                this.spawnPointsText(item.x, item.y, `+${Math.floor(gained)}`, item.color);

                if (Math.random() > 0.7 || bonus) {
                    this.showFact(item.fact);
                }
            } else {
                this.combo = 0;
                this.multiplier = 1.0;
                this.createExplosion(item.x, item.y, '#ff4d4d', 20);
                this.spawnPointsText(item.x, item.y, 'MISS', '#ff4d4d');
                // Flash screen red briefly
                const container = root.getElementById('game-container');
                container.style.boxShadow = 'inset 0 0 100px rgba(255,0,0,0.3)';
                setTimeout(() => container.style.boxShadow = 'none', 100);
            }

            this.updateHUD();
            this.items.splice(index, 1);
        }
    }

    const myGame = new HeritageGame();

    // Attach Event Listeners (Replacing HTML onclicks)
    root.getElementById('lang-btn').addEventListener('click', () => myGame.toggleLanguage());
    root.getElementById('btn-start').addEventListener('click', () => myGame.start());
    root.getElementById('btn-restart').addEventListener('click', () => myGame.restart());
    root.getElementById('btn-submit').addEventListener('click', () => {
        game.end({
            score: Math.floor(myGame.score),
            stars: myGame.finalStars,
            success: myGame.score > 0
        });
    });

})();
