/**
 * ALAM MELAYU MINIGAME ENGINE
 * Topic: Sosiobudaya & Ekonomi Kerajaan Alam Melayu
 * Development for Kidocode Project
 */

const LANG = {
    ms: {
        title: "EMPAYAR NUSANTARA",
        subtitle: "WARISAN SOSIOBUDAYA & EKONOMI",
        start: "Mula Berkhidmat",
        score: "Mata",
        timer: "Masa",
        stars: "Kemakmuran",
        river: "ALIRAN WARISAN SEJARAH",
        st_economy: "Dermaga & Perdagangan",
        desc_economy: "Isih Rempah, Emas, & Hasil Hutan",
        st_culture: "Balai Persuratan",
        desc_culture: "Skrip Purba, Inskripsi & Karya Sastera",
        st_arch: "Tapak Seni Bina",
        desc_arch: "Pembangunan Candi, Masjid & Monumen",
        st_social: "Dewan Struktur Sosial",
        desc_social: "Tentukan Hierarki Masyarakat",
        cls_royal: "Diraja",
        cls_noble: "Bangsawan",
        cls_free: "Rakyat Merdeka",
        cls_slave: "Hamba",
        game_over: "TAMAT PERKHIDMATAN",
        final_score: "Mata Keseluruhan",
        top_score: "Skor Tertinggi",
        restart: "Main Semula",
        instruction: "Uraskan kegemilangan Kerajaan Alam Melayu. Isih item ke balai yang betul dengan menyeretnya! Item yang terlepas akan mengurangkan kemakmuran kingdom.",
        ranks: ["Rakyat Biasa", "Satu-Satu", "Pembesar Kerajaan", "Wazir Agung", "Maharaja Budaya"],
        fact_title: "TAHUKAH ANDA?",
        btn_next: "Teruskan",
        era_1: "Era Pembentukan",
        era_2: "Zaman Kemuncak",
        era_3: "Keemasan Nusantara",
        multiplier_msg: "Multiplier Aktif!",
        not_matched: "Salah Balai!",
        missed: "Terlepas!",
        ach_1: "Diplomat Ekonomi",
        ach_2: "Arkitek Ulung",
        ach_3: "Pujangga Istana",
        ach_4: "Penjaga Kedaulatan"
    },
    en: {
        title: "NUSANTARA EMPIRE",
        subtitle: "SOCIO-CULTURAL & ECONOMIC LEGACY",
        start: "Begin Service",
        score: "Score",
        timer: "Timer",
        stars: "Prosperity",
        river: "HISTORICAL HERITAGE FLOW",
        st_economy: "Docks & Trade Hub",
        desc_economy: "Sort Spices, Gold, & Jungle Produce",
        st_culture: "Scriptorium",
        desc_culture: "Ancient Scripts & Literary Works",
        st_arch: "Architecture Site",
        desc_arch: "Building Temples, Mosques & Monuments",
        st_social: "Social Structure Hall",
        desc_social: "Define Society Hierarchy",
        cls_royal: "Royalty",
        cls_noble: "Nobility",
        cls_free: "Free Citizens",
        cls_slave: "Slaves",
        game_over: "SERVICE ENDED",
        final_score: "Total Score",
        top_score: "Top Score",
        restart: "Play Again",
        instruction: "Manage the glory of the Alam Melayu Kingdoms. Sort items to the correct hall by dragging them! Missed items reduce kingdom prosperity.",
        ranks: ["Commoner", "Apprentice", "Court Official", "Grand Vizier", "Cultural Emperor"],
        fact_title: "DID YOU KNOW?",
        btn_next: "Continue",
        era_1: "Era of Formation",
        era_2: "Age of Prosperity",
        era_3: "Nusantara Golden Age",
        multiplier_msg: "Multiplier Active!",
        not_matched: "Wrong Hall!",
        missed: "Missed Item!",
        ach_1: "Economic Diplomat",
        ach_2: "Master Architect",
        ach_3: "Palace Poet",
        ach_4: "Guardian of Sovereignty",
        combo: "Combo!",
        multiplier_active: "Multiplier x2 Active!"
    }
};

const ITEMS_DATA = [
    // Ekonomi (Economic Activities)
    { id: 'spices', type: 'ekonomi', ms: 'Rempah Ratus', en: 'Spices', icon: '🌿', fact: 'Cengkih dan buah pala adalah komoditi utama yang menarik pedagang luar ke Alam Melayu.' },
    { id: 'gold', type: 'ekonomi', ms: 'Emas', en: 'Gold', icon: '💰', fact: 'Semenanjung Tanah Melayu dikenali sebagai "Golden Chersonese" atau Semenanjung Emas oleh orang Greko-Roman.' },
    { id: 'camphor', type: 'ekonomi', ms: 'Kapur Barus', en: 'Camphor', icon: '💎', fact: 'Kapur barus digunakan sebagai ubat dan bahan pengawet, dieksport dari pelabuhan Barus di Sumatera.' },
    { id: 'beads', type: 'ekonomi', ms: 'Manik Kaca', en: 'Glass Beads', icon: '🔮', fact: 'Manik kaca menjadi simbol status dan bahan pertukaran penting dalam perdagangan maritim.' },
    { id: 'aromatic', type: 'ekonomi', ms: 'Kayu Gaharu', en: 'Aromatic Wood', icon: '🪵', fact: 'Gaharu digunakan untuk colok dan wangian, merupakan hasil hutan yang sangat berharga.' },
    { id: 'tortoise', type: 'ekonomi', ms: 'Kulit Penyu', en: 'Tortoise Shell', icon: '🐢', fact: 'Kulit penyu dieksport ke China untuk dijadikan bahan perhiasan dan perubatan.' },
    { id: 'silk', type: 'ekonomi', ms: 'Laluan Sutera', en: 'Silk Road Item', icon: '🧣', fact: 'Pelabuhan Alam Melayu menjadi pusat entrepot strategik antara China dan India.' },

    // Bahasa & Persuratan (Language & Literature)
    { id: 'palava', type: 'bahasa', ms: 'Inskripsi Palava', en: 'Palava Inscription', icon: '🗿', fact: 'Skrip Palava berasal dari India Selatan dan digunakan dalam batu bersurat awal Alam Melayu.' },
    { id: 'kawi', type: 'bahasa', ms: 'Aksara Kawi', en: 'Kawi Script', icon: '🍃', fact: 'Aksara Kawi digunakan meluas untuk menulis bahasa Kawi purba di Jawa dan sekitarnya.' },
    { id: 'jawi', type: 'bahasa', ms: 'Tulisan Jawi', en: 'Jawi Writing', icon: '🖊️', fact: 'Tulisan Jawi berkembang pesat seiring dengan penyebaran Islam di Alam Melayu.' },
    { id: 'hikayat', type: 'bahasa', ms: 'Hikayat Seri Rama', en: 'Epic of Rama', icon: '📘', fact: 'Hikayat Seri Rama membuktikan pengaruh ajaran Hindu-Buddha dalam sastera awal.' },
    { id: 'gurindam', type: 'bahasa', ms: 'Gurindam 12', en: 'Aphorisms (Gurindam)', icon: '📜', fact: 'Gurindam merupakan puisi lama yang mengandungi nasihat dan pengajaran moral.' },
    { id: 'nagarak', type: 'bahasa', ms: 'Nagarakartagama', en: 'Nagarakartagama', icon: '📜', fact: 'Karya agung Prapanca ini menceritakan tentang kegemilangan empayar Majapahit.' },
    { id: 'sanskrit', type: 'bahasa', ms: 'Bahasa Sanskrit', en: 'Sanskrit Language', icon: '🕉️', fact: 'Banyak perkataan Bahasa Melayu hari ini berakar daripada Bahasa Sanskrit.' },

    // Seni Bina (Architecture)
    { id: 'candi', type: 'senibina', ms: 'Candi Borobudur', en: 'Borobudur Temple', icon: '🏯', fact: 'Borobudur merupakan monumen Buddha terbesar di dunia, dibina oleh kerajaan Sailendra.' },
    { id: 'angkor', type: 'senibina', ms: 'Angkor Wat', en: 'Angkor Wat', icon: '🏯', fact: 'Angkor Wat di Kemboja melambangkan kehebatan seni bina empayar Khmer.' },
    { id: 'mosque', type: 'senibina', ms: 'Masjid Demak', en: 'Demak Mosque', icon: '🕌', fact: 'Masjid Demak merupakan salah satu masjid tertua di Jawa yang mengekalkan ciri seni bina tempatan.' },
    { id: 'relief', type: 'senibina', ms: 'Arca & Relief', en: 'Carvings & Relief', icon: '🧱', fact: 'Relief pada candi menceritakan tentang kehidupan seharian dan kepercayaan masyarakat purba.' },
    { id: 'ship', type: 'senibina', ms: 'Kapal Layar', en: 'Maritime Ships', icon: '⛵', fact: 'Teknologi perkapalan Alam Melayu sangat maju, membolehkan pelayaran jarak jauh.' },

    // Sosial (Social Structure)
    { id: 'king', type: 'sosial', ms: 'Raja / Maharaja', en: 'King / Emperor', icon: '👑', fact: 'Raja berada di puncak hierarki sosial dan dianggap sebagai tonggak kedaulatan.' },
    { id: 'lords', type: 'sosial', ms: 'Pembesar / Datu', en: 'Chiefs / Datu', icon: '🛡️', fact: 'Pembesar bertanggungjawab mentadbir wilayah dan membantu raja dalam pemerintahan.' },
    { id: 'merdeka', type: 'sosial', ms: 'Rakyat Merdeka', en: 'Free Citizens', icon: '👨‍🌾', fact: 'Rakyat merdeka terdiri daripada petani, pedagang, dan tukang yang menyumbang kepada ekonomi.' },
    { id: 'slaves', type: 'sosial', ms: 'Hamba', en: 'Slaves', icon: '⛓️', fact: 'Hamba berada di lapisan paling bawah dan berkhidmat untuk golongan atasan.' }
];

class AlamMelayuGame {
    constructor() {
        this.currentLang = 'ms';
        this.score = 0;
        this.highScore = localStorage.getItem('alamMelayuHighScore') || 0;
        this.timeLeft = 120;
        this.gameState = 'MENU';
        this.items = [];
        this.spawnTimerId = null;
        this.countDownId = null;
        this.draggedElement = null;
        this.draggedID = null;
        this.prosperity = 50; // Start at 50%
        this.multiplier = 1;
        this.multiplierTimer = 0;
        this.era = 1;
        this.correctCount = 0;
        this.comboCount = 0;
        this.maxCombo = 0;
        this.achievements = [];

        this.init();
    }

    init() {
        // UI Bindings using root instead of document
        this.dom = {
            container: root.getElementById('game-container'),
            score: root.getElementById('score-val'),
            timer: root.getElementById('timer-val'),
            langBtn: root.getElementById('lang-toggle'),
            startBtn: root.getElementById('start-btn'),
            restartBtn: root.getElementById('restart-btn'),
            submitBtn: root.getElementById('submit-btn'),
            menuScreen: root.getElementById('menu-screen'),
            resultScreen: root.getElementById('result-screen'),
            gameArea: root.getElementById('game-play-area'),
            conveyor: root.getElementById('conveyor-belt'),
            finalScore: root.getElementById('final-score-val'),
            highScore: root.getElementById('high-score-val'),
            rankTitle: root.getElementById('rank-title'),
            stars: [
                root.getElementById('star-1'),
                root.getElementById('star-2'),
                root.getElementById('star-3')
            ],
            combo: root.getElementById('combo-val'),
            comboContainer: root.getElementById('combo-box'),
            multiplierBar: root.getElementById('multiplier-bar-container'),
            multiplierProgress: root.getElementById('multiplier-progress'),
            langMs: root.getElementById('lang-ms'),
            langEn: root.getElementById('lang-en')
        };

        // Fact Overlay
        this.createFactOverlay();

        // Event Listeners
        this.dom.langBtn.addEventListener('click', () => this.toggleLang());
        this.dom.startBtn.addEventListener('click', () => this.startGame());
        this.dom.restartBtn.addEventListener('click', () => this.startGame());
        this.dom.submitBtn.addEventListener('click', () => {
            game.end({
                score: this.score,
                stars: Math.floor(this.prosperity / 33.3),
                success: this.score > 300
            });
        });

        // Interaction Listeners
        this.setupStations();
        this.updateLanguageUI();
        this.createParticleContainer();
    }

    createFactOverlay() {
        this.factOverlay = document.createElement('div');
        this.factOverlay.id = 'fact-overlay';
        this.factOverlay.style.cssText = `
        position: absolute; top:0; left:0; width:100%; height:100%;
        background: rgba(0,0,0,0.9); display: none;
        flex-direction: column; justify-content: center; align-items: center;
        z-index: 300; text-align: center; padding: 40px;
    `;
        this.factOverlay.innerHTML = `
        <div class="fact-box" style="max-width: 500px; padding: 30px; border: 2px solid var(--primary); border-radius: 20px; background: #1a1a1a;">
            <h3 id="fact-title-text" style="color: var(--primary); margin-bottom: 20px; font-family: serif; font-size: 2rem;"></h3>
            <p id="fact-content" style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px;"></p>
            <button class="main-menu-btn" id="fact-close-btn" style="margin-bottom: 0;"></button>
        </div>
    `;
        this.dom.container.appendChild(this.factOverlay);
        root.getElementById('fact-close-btn').addEventListener('click', () => {
            this.factOverlay.style.display = 'none';
            this.gameState = 'PLAYING';
        });
    }

    createParticleContainer() {
        this.particleLayer = document.createElement('div');
        this.particleLayer.id = 'particle-layer';
        this.particleLayer.style.cssText = `
        position: absolute; top:0; left:0; width:100%; height:100%;
        pointer-events: none; z-index: 150;
    `;
        this.dom.container.appendChild(this.particleLayer);
    }

    toggleLang() {
        this.currentLang = this.currentLang === 'ms' ? 'en' : 'ms';
        this.updateLanguageUI();

        // Update items
        root.querySelectorAll('.legacy-item').forEach(el => {
            const id = el.dataset.id;
            const data = ITEMS_DATA.find(i => i.id === id);
            el.querySelector('.item-text').innerText = data[this.currentLang];
        });
    }

    updateLanguageUI() {
        const strings = LANG[this.currentLang];
        root.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (strings[key]) el.innerText = strings[key];
        });

        // Update Lang Toggle Visuals
        if (this.currentLang === 'ms') {
            this.dom.langMs.classList.add('active');
            this.dom.langEn.classList.remove('active');
        } else {
            this.dom.langMs.classList.remove('active');
            this.dom.langEn.classList.add('active');
        }

        root.getElementById('fact-close-btn').innerText = strings.btn_next;
        root.getElementById('fact-title-text').innerText = strings.fact_title;
    }

    startGame() {
        this.score = 0;
        this.timeLeft = 120;
        this.prosperity = 50;
        this.gameState = 'PLAYING';
        this.era = 1;
        this.correctCount = 0;
        this.comboCount = 0;
        this.multiplier = 1;
        this.multiplierTimer = 0;
        this.achievements = [];

        this.dom.score.innerText = '0';
        this.dom.combo.innerText = '0x';
        this.dom.comboContainer.style.opacity = '0';
        this.dom.multiplierBar.style.display = 'none';
        this.dom.timer.innerText = '02:00';
        this.updateStars();
        this.updateEraUI();

        this.dom.menuScreen.classList.remove('active');
        this.dom.resultScreen.classList.remove('active');
        this.dom.conveyor.querySelectorAll('.legacy-item').forEach(e => e.remove());

        this.startTimers();
    }

    startTimers() {
        if (this.spawnTimerId) clearInterval(this.spawnTimerId);
        if (this.countDownId) clearInterval(this.countDownId);

        this.countDownId = setInterval(() => {
            if (this.gameState !== 'PLAYING') return;

            this.timeLeft--;
            const mins = Math.floor(this.timeLeft / 60);
            const secs = this.timeLeft % 60;
            this.dom.timer.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

            if (this.multiplierTimer > 0) {
                this.multiplierTimer--;
                const percent = (this.multiplierTimer / 10) * 100;
                this.dom.multiplierProgress.style.width = percent + '%';

                if (this.multiplierTimer === 0) {
                    this.multiplier = 1;
                    this.dom.multiplierBar.style.display = 'none';
                    this.showNotification("Multiplier Ended", "orange", this.dom.container);
                }
            }

            if (this.timeLeft <= 0) this.endGame();
        }, 1000);

        this.spawnLoop();
    }

    spawnLoop() {
        const spawnStep = () => {
            if (this.gameState === 'FINISHED') return;

            if (this.gameState === 'PLAYING') {
                this.spawnItem();
            }

            let baseRate = 2200;
            if (this.era === 2) baseRate = 1600;
            if (this.era === 3) baseRate = 1000;

            const rate = Math.max(700, baseRate - (this.score / 15));
            this.spawnTimerId = setTimeout(spawnStep, rate);
        };
        spawnStep();
    }

    spawnItem() {
        // Filter items based on Era for better progression
        let pool = ITEMS_DATA;
        if (this.era === 1) pool = ITEMS_DATA.filter(i => ['spices', 'gold', 'palava', 'merdeka', 'slaves', 'candi'].includes(i.id));

        const data = pool[Math.floor(Math.random() * pool.length)];
        const el = document.createElement('div');
        el.className = 'legacy-item';
        el.draggable = true;
        el.dataset.id = data.id;
        el.dataset.type = data.type;

        el.innerHTML = `
        <div class="icon-fallback">${data.icon}</div>
        <div class="item-text">${data[this.currentLang]}</div>
    `;

        const top = 30 + Math.random() * 50;
        el.style.top = top + 'px';
        this.dom.conveyor.appendChild(el);

        let posX = -120;
        const moveSpeed = (this.era * 0.8) + (this.score / 500) + 1.2;

        const move = () => {
            if (this.gameState === 'FINISHED' || !el.parentElement) return;
            if (this.gameState === 'PLAYING') {
                posX += moveSpeed;
                el.style.left = posX + 'px';
            }

            if (posX > this.dom.conveyor.offsetWidth) {
                this.handleMiss();
                el.remove();
            } else {
                requestAnimationFrame(move);
            }
        };
        requestAnimationFrame(move);

        el.addEventListener('dragstart', (e) => {
            this.draggedElement = el;
            this.draggedID = data.id;
            el.style.transform = 'scale(1.2) rotate(5deg)';
            el.style.opacity = '0.7';
        });

        el.addEventListener('dragend', () => {
            this.draggedElement = null;
            if (el) {
                el.style.transform = 'none';
                el.style.opacity = '1';
            }
        });
    }

    setupStations() {
        root.querySelectorAll('.station').forEach(st => {
            st.addEventListener('dragover', (e) => {
                e.preventDefault();
                st.style.border = '2px solid var(--primary)';
                st.style.transform = 'scale(1.02)';
            });

            st.addEventListener('dragleave', () => {
                st.style.border = '1px solid var(--glass-border)';
                st.style.transform = 'scale(1)';
            });

            st.addEventListener('drop', (e) => {
                e.preventDefault();
                st.style.border = '1px solid var(--glass-border)';
                st.style.transform = 'scale(1)';

                if (this.draggedElement) {
                    const targetType = st.dataset.station;
                    const itemType = this.draggedElement.dataset.type;
                    const itemID = this.draggedElement.dataset.id;

                    if (targetType === itemType) {
                        this.handleCorrect(st, itemID);
                    } else {
                        this.handleWrong(st);
                    }
                    this.draggedElement.remove();
                }
            });
        });
    }

    handleCorrect(station, itemID) {
        const data = ITEMS_DATA.find(i => i.id === itemID);
        this.comboCount++;
        if (this.comboCount > this.maxCombo) this.maxCombo = this.comboCount;

        const comboBonus = Math.floor(this.comboCount / 5);
        const points = 10 * this.multiplier * this.era * (comboBonus + 1);
        this.score += points;
        this.correctCount++;
        this.prosperity = Math.min(100, this.prosperity + 5);

        this.dom.score.innerText = this.score;
        this.updateStars();
        this.showNotification(`+${points}`, "var(--success)", station);
        this.spawnParticles(station, "var(--success)");

        // Combo UI
        if (this.comboCount > 1) {
            this.dom.combo.innerText = this.comboCount + 'x';
            this.dom.comboContainer.style.opacity = '1';
            this.dom.combo.style.transform = 'scale(1.4)';
            setTimeout(() => this.dom.combo.style.transform = 'scale(1)', 200);
        }

        // Social Multiplier Logic
        if (data.type === 'sosial' && (data.id === 'king' || data.id === 'lords')) {
            this.multiplier = 2;
            this.multiplierTimer = 10;
            this.dom.multiplierBar.style.display = 'block';
            this.dom.multiplierProgress.style.width = '100%';
            this.showNotification(LANG[this.currentLang].multiplier_msg, "gold", station);
        }

        // Fact Pop-up Logic
        if (this.correctCount % 10 === 0) {
            this.showFact(data);
        }

        // Achievements Logic
        this.checkAchievements(data);

        // Progress Eras
        if (this.score > 300 && this.era === 1) this.advanceEra(2);
        if (this.score > 1000 && this.era === 2) this.advanceEra(3);

        // Visual Punch
        station.style.animation = 'pulse 0.3s ease';
        setTimeout(() => station.style.animation = '', 300);

        // Audio Simulation (Visual Pulse of HUD)
        this.dom.score.parentElement.style.transform = 'scale(1.2)';
        setTimeout(() => this.dom.score.parentElement.style.transform = 'scale(1)', 100);
    }

    checkAchievements(item) {
        const strings = LANG[this.currentLang];
        if (this.score >= 500 && !this.achievements.includes('ach_1')) {
            this.unlockAchievement('ach_1', strings.ach_1);
        }
        if (this.correctCount >= 20 && !this.achievements.includes('ach_2')) {
            this.unlockAchievement('ach_2', strings.ach_2);
        }
        if (item.type === 'bahasa' && !this.achievements.includes('ach_3')) {
            this.unlockAchievement('ach_3', strings.ach_3);
        }
        if (this.prosperity >= 95 && !this.achievements.includes('ach_4')) {
            this.unlockAchievement('ach_4', strings.ach_4);
        }
    }

    unlockAchievement(id, name) {
        this.achievements.push(id);
        const pop = root.getElementById('ach-popup');
        root.getElementById('ach-text').innerText = name;
        pop.style.transform = 'translateX(0)';
        setTimeout(() => pop.style.transform = 'translateX(200%)', 3000);
    }

    handleWrong(station) {
        this.comboCount = 0;
        this.dom.comboContainer.style.opacity = '0';
        this.prosperity = Math.max(0, this.prosperity - 15);
        this.showNotification(LANG[this.currentLang].not_matched, "var(--danger)", station);
        this.spawnParticles(station, "var(--danger)");
        this.updateStars();

        // Shake Screen
        this.dom.container.style.animation = 'shake 0.2s';
        setTimeout(() => this.dom.container.style.animation = '', 200);
    }

    handleMiss() {
        this.comboCount = 0;
        this.dom.comboContainer.style.opacity = '0';
        this.prosperity = Math.max(0, this.prosperity - 10);
        this.showNotification(LANG[this.currentLang].missed, "rgba(255,255,255,0.5)", this.dom.conveyor);
        this.updateStars();

        if (this.prosperity <= 0) {
            // Could end early but keeping it playable
        }
    }

    showFact(data) {
        this.gameState = 'PAUSED';
        const strings = LANG[this.currentLang];
        root.getElementById('fact-content').innerText = data.fact || data[this.currentLang];
        this.factOverlay.style.display = 'flex';
    }

    advanceEra(newEra) {
        this.era = newEra;
        this.updateEraUI();
        const msg = LANG[this.currentLang][`era_${newEra}`];
        this.showBigNf(msg);
    }

    updateEraUI() {
        const colors = ["#2c3e50", "#1a2a2d", "#2d1a1a"];
        const bg = `linear-gradient(135deg, ${colors[this.era - 1]} 0%, #000 100%)`;
        this.dom.container.style.background = bg;
    }

    updateStars() {
        const count = Math.floor(this.prosperity / 33.3);
        this.dom.stars.forEach((star, idx) => {
            star.classList.toggle('earned', idx < count);
        });
    }

    showNotification(text, color, target) {
        const rect = target.getBoundingClientRect();
        const note = document.createElement('div');
        note.className = 'notification';
        note.innerText = text;
        note.style.color = color;
        // Adjust for shadow DOM offset if needed, but assuming rect is correct
        note.style.left = (rect.left + rect.width / 2) + 'px';
        note.style.top = (rect.top + 20) + 'px';

        // Append to container instead of body
        this.dom.container.appendChild(note);
        setTimeout(() => note.remove(), 1000);
    }

    showBigNf(text) {
        const nf = document.createElement('div');
        nf.style.cssText = `
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 3.5rem; font-weight: 900; color: var(--primary);
            text-shadow: 0 0 30px rgba(212, 175, 55, 0.5); z-index: 200; pointer-events: none;
            animation: bigFade 2.5s forwards; text-transform: uppercase;
            font-family: serif; display: flex; flex-direction: column; align-items: center; gap: 10px;
        `;
        nf.innerHTML = `<div>${text}</div><div style="font-size: 1.2rem; background: var(--primary); color: black; padding: 5px 15px; border-radius: 20px;">ERA ADVANCED</div>`;
        this.dom.container.appendChild(nf);
        setTimeout(() => nf.remove(), 2500);
        this.spawnEraParticles();
    }

    spawnEraParticles() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.style.cssText = `
                    position: absolute; width: 10px; height: 10px;
                    background: gold; border-radius: 50%;
                    left: ${Math.random() * 100}%; bottom: -20px;
                    pointer-events: none; opacity: 0.6; z-index: 5;
                    box-shadow: 0 0 10px gold;
                `;
                this.dom.container.appendChild(p);

                p.animate([
                    { transform: 'translateY(0) scale(1)', opacity: 0.6 },
                    { transform: `translateY(-${this.dom.container.offsetHeight + 50}px) scale(0)`, opacity: 0 }
                ], { duration: 3000 + Math.random() * 2000, easing: 'ease-out' }).onfinish = () => p.remove();
            }, i * 50);
        }
    }

    spawnParticles(target, color) {
        const rect = target.getBoundingClientRect();
        // Since we are appending to the particle layer in the container, we need to adjust coordinates relative to container (if container is relative)
        // However, particle layer is absolute top:0 left:0 of container.
        // rect is viewport.
        // container rect:
        const containerRect = this.dom.container.getBoundingClientRect();
        const startX = rect.left - containerRect.left + rect.width / 2;
        const startY = rect.top - containerRect.top + rect.height / 2;

        for (let i = 0; i < 15; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position: absolute; width: ${Math.random() * 6 + 2}px; height: ${Math.random() * 6 + 2}px;
                background: ${color}; border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                left: ${startX}px;
                top: ${startY}px;
                pointer-events: none;
                z-index: 1000;
            `;
            this.particleLayer.appendChild(p);
            const angle = Math.random() * Math.PI * 2;
            const dist = 40 + Math.random() * 80;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            p.animate([
                { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) rotate(360deg)`, opacity: 0 }
            ], { duration: 800, easing: 'cubic-bezier(0.1, 1, 0.1, 1)' }).onfinish = () => p.remove();
        }
    }

    endGame() {
        this.gameState = 'FINISHED';
        if (this.spawnTimerId) clearTimeout(this.spawnTimerId);
        if (this.countDownId) clearInterval(this.countDownId);

        // Save score if possible
        try {
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('alamMelayuHighScore', this.score);
            }
        } catch (e) { }

        this.dom.finalScore.innerText = this.score;
        this.dom.highScore.innerText = this.highScore;
        const ranks = LANG[this.currentLang].ranks;
        let ridx = 0;
        if (this.score > 300) ridx = 1;
        if (this.score > 800) ridx = 2;
        if (this.score > 1800) ridx = 3;
        if (this.score > 3000) ridx = 4;
        this.dom.rankTitle.innerText = ranks[ridx];

        const achList = root.getElementById('achievement-list');
        achList.innerHTML = '';
        this.achievements.forEach(id => {
            const badge = document.createElement('div');
            badge.style.cssText = "background: var(--primary); color: black; padding: 5px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 800;";
            badge.innerText = LANG[this.currentLang][id];
            achList.appendChild(badge);
        });

        this.dom.resultScreen.classList.add('active');

        // REQUIRED: Call game.end() when Submit is clicked
        // Note: The UI has a "Play Again" button, which restarts.
        // There is no explicit "Submit" button in the original UI, it just ended and showed 'Play Again'.
        // The requirements say: "When the game round is over, you MUST show an end screen with: 1. Try Again... 2. Submit".
        // I need to add a Submit button to the result screen.

        // Let's modify the result screen logic to include a Submit button if it's not there.
        // It currently has `restart-btn`.
        // I will dynamically add a Submit button or ensure it is in HTML.
        // For now, I will modify the script to add it if missing, or update HTML.
        // I will update HTML to include the Submit button.
    }
}

// Instantiate
new AlamMelayuGame();
