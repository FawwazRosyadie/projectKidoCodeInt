
const content = {
    en: {
        game_title: "Alam Melayu: Empire Architect",
        res_rice: "Rice (Beras)",
        res_gold: "Wealth (Gold)",
        res_power: "Influence (Wibawa)",
        res_score: "Legacy Score",
        tab_admin: "Administration",
        tab_edu: "Encyclopedia",
        section_gov: "Governance System",
        section_econ: "Economic Activities",
        node_farm: "Valley of Plenty",
        node_forest: "Royal Jungle",
        node_port: "Empire Harbor",
        node_mine: "Golden Hills",
        empire_rank: "Empire Rank:",
        start_title: "Rise of Empires",
        final_score: "Legacy Score",
        final_rank: "Kingdom Status",
        choose_kingdom: "CHOOSE YOUR KINGDOM:",
        needs_gold: "Not enough Wealth!",
        appointed: "Official Appointed!",
        upgrade_purchased: "Expansion Complete!",
        monsoon: "Season: Monsoon (Trade Speed -30%)",
        harvest_season: "Season: Harvest (Rice Yield +50%)",
        tax_season: "Season: Tax Collection (Resource Growth Up)",
        drought: "Season: Drought (Rice Growth -50%)"
    },
    ms: {
        game_title: "Alam Melayu: Arkitek Empayar",
        res_rice: "Beras (Rice)",
        res_gold: "Kekayaan (Emas)",
        res_power: "Wibawa (Influence)",
        res_score: "Skor Legasi",
        tab_admin: "Pentadbiran",
        tab_edu: "Ensiklopedia",
        section_gov: "Sistem Pemerintahan",
        section_econ: "Kegiatan Ekonomi",
        node_farm: "Lembah Melimpah",
        node_forest: "Hutan Diraja",
        node_port: "Pelabuhan Empayar",
        node_mine: "Bukit Emas",
        empire_rank: "Pangkat Empayar:",
        start_title: "Kebangkitan Empayar",
        final_score: "Skor Legasi",
        final_rank: "Status Kerajaan",
        choose_kingdom: "PILIH KERAJAAN ANDA:",
        needs_gold: "Kekayaan tidak mencukupi!",
        appointed: "Pembesar Dilantik!",
        upgrade_purchased: "Perluasan Selesai!",
        monsoon: "Musim: Monsun (Kelajuan Trade -30%)",
        harvest_season: "Musim: Menuai (Hasil Beras +50%)",
        tax_season: "Musim: Pungutan Cukai (Hasil Meningkat)",
        drought: "Musim: Kemarau (Hasil Beras -50%)"
    }
};

const historicalFacts = [
    "Kerajaan Funan merupakan kerajaan terawal di Alam Melayu, terkenal dengan sistem pengairan (Baray).",
    "Srivijaya menjadi kuasa maritim utama kerana penguasaan terhadap Selat Melaka dan Selat Sunda.",
    "Angkor mempunyai Baray yang sangat luas untuk menyimpan air bagi pertanian padi sepanjang tahun.",
    "Majapahit mempunyai majlis penasihat Raja yang dipanggil Sapta Prabhu.",
    "Syahbandar bertanggungjawab mengurus pelabuhan, perdagangan, dan keselamatan pedagang asing.",
    "Padi merupakan tanaman utama kerana kawasan lembangan sungai yang subur (Mekong, Musi, Solo).",
    "Gaharu, kapur barus, dan rempah-ratus merupakan hasil hutan dan laut yang sangat dicari oleh pedagang luar.",
    "Kerajaan Alam Melayu mengamalkan sistem Kedatuan (Srivijaya) dan Rajadhiraja (Champa)."
];

let state = {
    lang: 'en',
    active: false,
    resources: { rice: 0, gold: 100, power: 0, score: 0 },
    kingdom: 'funan',
    timer: 600, // 10 minutes
    season: 'normal',
    rank: 'Village',
    rankScore: 0,
    officials: [],
    upgrades: [],
    buildings: 0,
    unlocks: {
        castle: false,
        port_upgraded: false,
        temple: false
    }
};

const officialsData = [
    { id: 'wazir', name_en: 'Wazir (Vizier)', name_ms: 'Wazir', cost: 150, influence: 5, auto_gold: 1, desc_en: "Advises the King on national policy.", desc_ms: "Menasihati Raja dalam urusan dasar negara." },
    { id: 'datu', name_en: 'Datu', name_ms: 'Datu', cost: 200, influence: 8, auto_rice: 2, desc_en: "Manages regional administration.", desc_ms: "Menguruskan pentadbiran wilayah." },
    { id: 'syahbandar', name_en: 'Syahbandar', name_ms: 'Syahbandar', cost: 300, influence: 10, bonus_trade: 0.5, desc_en: "Handles ports and foreign trade.", desc_ms: "Mengurus pelabuhan dan dagangan asing." },
    { id: 'temenggung', name_en: 'Temenggung', name_ms: 'Temenggung', cost: 500, influence: 15, auto_score: 5, desc_en: "Head of internal security.", desc_ms: "Ketua keselamatan dalam negeri." },
    { id: 'pradesa', name_en: 'Pradesa', name_ms: 'Pradesa', cost: 800, influence: 20, multi: 1.1, desc_en: "District administrator (Majapahit).", desc_ms: "Pentadbir daerah (Zaman Majapahit)." }
];

const economyData = [
    { id: 'irrigation', name_en: 'Baray System', name_ms: 'Sistem Baray', cost: 100, effect: 'rice_boost', desc_en: "Huge reservoirs to maintain water flow.", desc_ms: "Takungan air untuk bekalan pertanian." },
    { id: 'fleet', name_en: 'Merchant Fleet', name_ms: 'Armada Dagang', cost: 250, effect: 'gold_boost', desc_en: "Increases trade income speed.", desc_ms: "Meningkatkan kelajuan hasil trade." },
    { id: 'taxes', name_en: 'Taxation Office', name_ms: 'Pejabat Cukai', cost: 400, effect: 'all_round', desc_en: "Collect gold from forest & sea products.", desc_ms: "Pungutan cukai hasil hutan dan laut." },
    { id: 'embassy', name_en: 'Diplomatic Hub', name_ms: 'Pusat Diplomasi', cost: 700, effect: 'power_boost', desc_en: "Gains influence from foreign relations.", desc_ms: "Meningkatkan wibawa melalui hubungan luar." }
];

/* --- Initialization --- */

function init() {
    // Attach Event Listeners
    root.getElementById('btn-lang').addEventListener('click', toggleLanguage);

    // Tab buttons
    const tabBtns = root.querySelectorAll('.panel-tab-btn');
    // Assuming first is admin, second is edu based on order
    tabBtns[0].addEventListener('click', (e) => switchTab('gov', 'admin-tab', e));
    tabBtns[1].addEventListener('click', (e) => switchTab('gov', 'history-tab', e));

    // Interact Nodes
    // We need to attach listeners to the specific nodes based on their hardcoded visual data or just selects
    // In original HTML they had onclick="interactNode('farm', event)"
    const nodes = root.querySelectorAll('.kingdom-node');
    // Order in HTML: farm, forest, port, mine
    nodes[0].addEventListener('click', (e) => interactNode('farm', e));
    nodes[1].addEventListener('click', (e) => interactNode('forest', e));
    nodes[2].addEventListener('click', (e) => interactNode('port', e));
    nodes[3].addEventListener('click', (e) => interactNode('mine', e));

    // Start Button
    root.getElementById('btn-start').addEventListener('click', startGame);

    // End Buttons
    root.getElementById('btn-try-again').addEventListener('click', resetGame);
    root.getElementById('btn-submit').addEventListener('click', submitScore);

    // Initial Render
    updateUIStrings();
    // Don't render panels yet until needed? Or render empty/defaults.
    // Panels might rely on language default EN
}

function toggleLanguage() {
    state.lang = state.lang === 'en' ? 'ms' : 'en';
    root.getElementById('btn-lang').innerText = state.lang === 'en' ? 'Language: MS' : 'Bahasa: EN';
    updateUIStrings();
    renderPanels();
}

function updateUIStrings() {
    root.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (content[state.lang][key]) el.innerText = content[state.lang][key];
    });
}

function startGame() {
    state.kingdom = root.getElementById('kingdom-select').value;
    state.active = true;
    root.getElementById('start-overlay').classList.add('hidden');

    // Starting bonuses
    if (state.kingdom === 'srivijaya') state.resources.gold += 200;
    if (state.kingdom === 'angkor') state.resources.rice += 100;

    renderPanels();
    startLoops();
    updateHistoricalFact();
    toast(`Reign of ${state.kingdom.toUpperCase()} begins!`);
}

function resetGame() {
    state = {
        lang: state.lang, // Keep language
        active: false,
        resources: { rice: 0, gold: 100, power: 0, score: 0 },
        kingdom: 'funan',
        timer: 600,
        season: 'normal',
        rank: 'Village',
        rankScore: 0,
        officials: [],
        upgrades: [],
        buildings: 0,
        unlocks: {
            castle: false,
            port_upgraded: false,
            temple: false
        }
    };

    // Reset UI
    root.getElementById('end-overlay').classList.add('hidden');
    root.getElementById('start-overlay').classList.remove('hidden');
    root.getElementById('val-rice').innerText = "0";
    root.getElementById('val-gold').innerText = "100";
    root.getElementById('val-power').innerText = "0";
    root.getElementById('val-score').innerText = "0";
    root.getElementById('timer-display').innerText = "10:00";
    root.querySelectorAll('.building-spot').forEach(s => {
        s.classList.remove('active');
        s.innerHTML = '';
    });

    // Clear any existing intervals if we can track them... 
    // Ideally we should have interval IDs. 
    // Since we don't declare them globally, we'll just reload the page logic? 
    // No, we cannot reload page. We MUST clear intervals.
    // I will add interval tracking.
    clearInterval(state.statsInterval);
    clearInterval(state.seasonInterval);
    clearTimeout(state.eventTimeout);

    // Re-init happens when they click Start
}

function submitScore() {
    game.end({
        score: Math.floor(state.resources.score),
        stars: calculateStars(state.resources.score),
        success: true,
        meta: { rank: state.rank, kingdom: state.kingdom }
    });
}

function calculateStars(score) {
    if (score > 50000) return 3;
    if (score > 20000) return 2;
    if (score > 5000) return 1;
    return 0;
}

/* --- Game Loops --- */

function startLoops() {
    // Main Stat Loop (1 second)
    state.statsInterval = setInterval(() => {
        if (!state.active) return;

        // Passives
        officialsData.forEach(off => {
            if (state.officials.includes(off.id)) {
                if (off.auto_gold) state.resources.gold += off.auto_gold;
                if (off.auto_rice) state.resources.rice += off.auto_rice;
                if (off.auto_score) state.resources.score += off.auto_score;
            }
        });

        // Resource decay/consumption (Small population need)
        if (state.resources.rice > 1 && Math.random() > 0.7) {
            state.resources.rice -= 1;
            state.resources.score += 2;
        }

        // Timer
        state.timer--;
        updateTimerDisplay();
        updateResources();
        checkRank();

        if (state.timer <= 0) endGame();
    }, 1000);

    // Season Loop (45 seconds)
    state.seasonInterval = setInterval(triggerPhaseChange, 45000);

    // Random Event Loop (60-90 seconds)
    triggerRandomEvent();
}

function updateResources() {
    root.getElementById('val-rice').innerText = Math.floor(state.resources.rice);
    root.getElementById('val-gold').innerText = Math.floor(state.resources.gold);
    root.getElementById('val-power').innerText = Math.floor(state.resources.power);
    root.getElementById('val-score').innerText = Math.floor(state.resources.score);
}

function updateTimerDisplay() {
    const m = Math.floor(state.timer / 60);
    const s = state.timer % 60;
    root.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}

/* --- Rendering --- */

function renderPanels() {
    const adminPanel = root.getElementById('admin-panel-list');
    const marketPanel = root.getElementById('market-panel-list');

    adminPanel.innerHTML = '';
    officialsData.forEach(off => {
        const owned = state.officials.includes(off.id);
        const card = document.createElement('div');
        card.className = 'card';
        // Using createElement for button to attach listener properly

        const header = document.createElement('div');
        header.className = 'card-header';
        header.innerHTML = `<span class="card-title">${state.lang === 'en' ? off.name_en : off.name_ms}</span>${owned ? '<span style="color:#4caf50; font-size:0.75rem;">ACTIVE</span>' : ''}`;

        const desc = document.createElement('p');
        desc.className = 'card-desc';
        desc.innerText = state.lang === 'en' ? off.desc_en : off.desc_ms;

        card.appendChild(header);
        card.appendChild(desc);

        if (!owned) {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.innerText = `APPOINT (${off.cost} 💰)`;
            btn.addEventListener('click', () => buyOfficial(off.id, off.cost));
            card.appendChild(btn);
        }

        adminPanel.appendChild(card);
    });

    marketPanel.innerHTML = '';
    economyData.forEach(upg => {
        const count = state.upgrades.filter(x => x === upg.id).length;
        const cost = Math.floor(upg.cost * Math.pow(1.5, count));
        const card = document.createElement('div');
        card.className = 'card';

        const header = document.createElement('div');
        header.className = 'card-header';
        header.innerHTML = `<span class="card-title">${state.lang === 'en' ? upg.name_en : upg.name_ms}</span><span style="font-size:0.75rem; color:gold;">LVL ${count}</span>`;

        const desc = document.createElement('p');
        desc.className = 'card-desc';
        desc.innerText = state.lang === 'en' ? upg.desc_en : upg.desc_ms;

        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.innerText = `EXPAND (${cost} 💰)`;
        btn.addEventListener('click', () => buyUpgrade(upg.id, cost));

        card.appendChild(header);
        card.appendChild(desc);
        card.appendChild(btn);

        marketPanel.appendChild(card);
    });
}

/* --- Gameplay Interactions --- */

function buyOfficial(id, cost) {
    if (state.resources.gold >= cost) {
        state.resources.gold -= cost;
        state.officials.push(id);
        const off = officialsData.find(x => x.id === id);
        state.resources.power += off.influence;
        state.resources.score += 500;

        toast(content[state.lang].appointed);
        addBuildingVisual(id);
        renderPanels();
        updateResources();
    } else {
        toast(content[state.lang].needs_gold, 'red');
    }
}

function buyUpgrade(id, cost) {
    if (state.resources.gold >= cost) {
        state.resources.gold -= cost;
        state.upgrades.push(id);
        state.resources.score += 300;

        toast(content[state.lang].upgrade_purchased);
        renderPanels();
        updateResources();
    } else {
        toast(content[state.lang].needs_gold, 'red');
    }
}

function interactNode(type, event) {
    if (!state.active) return;

    let gain = 0;
    let res = "";
    let color = "";

    // Modifiers
    let mult = 1;
    if (state.season === 'harvest' && type === 'farm') mult = 1.8;
    if (state.season === 'monsoon' && type === 'port') mult = 0.5;

    state.upgrades.forEach(u => {
        if (u === 'irrigation' && type === 'farm') mult += 0.2;
        if (u === 'fleet' && type === 'port') mult += 0.3;
    });

    switch (type) {
        case 'farm':
            gain = 10 * mult; res = "rice"; color = "#4caf50";
            state.resources.score += 5;
            break;
        case 'port':
            if (state.resources.rice < 15) { toast("Need 15 Rice to Export!", "orange"); return; }
            state.resources.rice -= 15;
            gain = 50 * mult; res = "gold"; color = "#ffd700";
            state.resources.score += 100;
            break;
        case 'forest':
        case 'mine':
            gain = 30; res = "gold"; color = "#deb887";
            state.resources.score += 50;
            break;
    }

    state.resources[res] += gain;
    spawnFloater(event.clientX, event.clientY, `+${Math.floor(gain)}`, color);
    updateResources();
}

/* --- Visual Updates --- */

function addBuildingVisual(id) {
    const spots = root.querySelectorAll('.building-spot');
    for (let s of spots) {
        if (!s.classList.contains('active')) {
            s.classList.add('active');
            s.innerHTML = (id === 'wazir' || id === 'temenggung') ? '<span style="font-size:3rem">🏯</span>' : '<span style="font-size:3rem">🛖</span>';
            state.buildings++;
            break;
        }
    }
}

function spawnFloater(x, y, text, color) {
    const el = document.createElement('div');
    el.style.position = 'absolute'; // Changed from fixed
    // Adjust coordinates to be relative to game-wrapper if possible, 
    // but clientX is viewport relative.
    // If game-wrapper is relative, we need to calculate offset.
    // However, since we are inside shadow DOM, positioning might be tricky.
    // Let's assume standard clientX/Y works with fixed, but rule says no fixed.
    // We should append to game-wrapper and use absolute pos.

    const wrapper = root.getElementById('game-wrapper');
    const rect = wrapper.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;

    el.style.left = relX + 'px';
    el.style.top = relY + 'px';
    el.style.color = color;
    el.style.fontWeight = '800';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '1000';
    el.innerText = text;
    el.style.transition = 'all 1s';

    wrapper.appendChild(el);

    requestAnimationFrame(() => {
        el.style.transform = 'translateY(-100px)';
        el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 1000);
}

function toast(msg, type = 'gold') {
    const box = root.getElementById('notification-box');
    const t = document.createElement('div');
    t.className = 'toast';
    if (type === 'red') t.style.borderColor = '#ff5252';
    t.innerText = msg;
    box.appendChild(t);
    setTimeout(() => {
        t.style.opacity = '0';
        setTimeout(() => t.remove(), 500);
    }, 3000);
}

/* --- Systems: Seasons & Events --- */

function triggerPhaseChange() {
    if (!state.active) return;

    const seasons = ['normal', 'monsoon', 'harvest', 'tax', 'drought'];
    state.season = seasons[Math.floor(Math.random() * seasons.length)];

    const info = root.getElementById('system-info');
    const weather = root.getElementById('weather-overlay');
    weather.className = '';

    let key = "";
    switch (state.season) {
        case 'monsoon':
            key = "monsoon";
            weather.classList.add('rain');
            break;
        case 'harvest': key = "harvest_season"; break;
        case 'tax': key = "tax_season"; break;
        case 'drought': key = "drought"; break;
        default: info.innerText = "Season: Stable (Calm Seas)"; break;
    }

    if (key) {
        const msg = content[state.lang][key];
        info.innerText = msg;
        toast(msg, 'cyan');
    }
}

function triggerRandomEvent() {
    state.eventTimeout = setTimeout(() => {
        if (!state.active) return;

        const eventOverlay = root.getElementById('event-overlay');
        const title = root.getElementById('event-title');
        const desc = root.getElementById('event-desc');
        const icon = root.getElementById('event-icon');
        const options = root.getElementById('event-options');

        const pool = [
            {
                title_en: "Foreign Merchants", title_ms: "Pedagang Asing",
                icon: "🛳️",
                desc_en: "Merchants from India wish to trade special textiles for spices.",
                desc_ms: "Pedagang dari India mahu menukar tekstil khas dengan rempah-ratus.",
                choices: [
                    { text_en: "Agree (Pay 50 Rice, Get 300 Gold)", text_ms: "Setuju (Bayar 50 Beras, Dapat 300 Emas)", action: () => { if (state.resources.rice >= 50) { state.resources.rice -= 50; state.resources.gold += 300; } } },
                    { text_en: "Refuse (Gain 50 Influence)", text_ms: "Tolak (Dapat 50 Wibawa)", action: () => { state.resources.power += 50; } }
                ]
            },
            {
                title_en: "Regional Conflict", title_ms: "Konflik Wilayah",
                icon: "⚔️",
                desc_en: "A neighboring village disputes your border markers.",
                desc_ms: "Sebuah kampung jiran mempertikaikan penanda sempadan anda.",
                choices: [
                    { text_en: "Send Wazir to Negotiate (Cost 100 Gold)", text_ms: "Hantar Wazir Berunding (Kos 100 Emas)", action: () => { state.resources.gold -= 100; state.resources.score += 1000; } },
                    { text_en: "Assert Dominance (Gain 100 Influence, lose 200 Gold)", text_ms: "Tunjukkan Kuasa (Dapat 100 Wibawa, hilang 200 Emas)", action: () => { state.resources.power += 100; state.resources.gold -= 200; } }
                ]
            }
        ];

        const ev = pool[Math.floor(Math.random() * pool.length)];
        icon.innerText = ev.icon;
        title.innerText = state.lang === 'en' ? ev.title_en : ev.title_ms;
        desc.innerText = state.lang === 'en' ? ev.desc_en : ev.desc_ms;

        options.innerHTML = '';
        ev.choices.forEach(c => {
            const b = document.createElement('button');
            b.className = 'btn';
            b.style.padding = '15px';
            b.innerText = state.lang === 'en' ? c.text_en : c.text_ms;
            b.onclick = () => {
                c.action();
                eventOverlay.classList.add('hidden');
                updateResources();
            };
            options.appendChild(b);
        });

        eventOverlay.classList.remove('hidden');

        // Next event
        triggerRandomEvent(); // Recursive call for next event loop
    }, 60000 + Math.random() * 30000);
}

/* --- Rank System --- */

function checkRank() {
    const score = state.resources.score;
    let rank = "Village";
    let prog = 10;

    if (score > 2000) { rank = "Kingdom"; prog = 30; }
    if (score > 8000) { rank = "Great Kingdom"; prog = 60; }
    if (score > 20000) { rank = "Maritime Empire"; prog = 85; }
    if (score > 50000) { rank = "Golden Empire"; prog = 100; }

    state.rank = rank;
    root.getElementById('txt-empire-rank').innerText = rank;
    root.getElementById('progress-empire').style.width = prog + '%';

    // Removed localStorage usage as it's not strictly allowed/needed for this logic
    const top = 0;
    root.getElementById('top-score-val').innerText = Math.floor(score); // Just show current score since we can't persist
}

/* --- UI Helpers --- */

function switchTab(panel, tab, event) {
    const admin = root.getElementById('admin-panel-list');
    const history = root.getElementById('history-panel-content');
    if (tab === 'admin-tab') {
        admin.classList.remove('hidden');
        history.classList.add('hidden');
    } else {
        admin.classList.add('hidden');
        history.classList.remove('hidden');
        updateHistoricalFact();
    }

    // Toggle active state on buttons
    root.querySelectorAll('.panel-tab-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function updateHistoricalFact() {
    const fact = historicalFacts[Math.floor(Math.random() * historicalFacts.length)];
    root.getElementById('historical-fact').innerText = fact;
}

function endGame() {
    state.active = false;
    clearInterval(state.statsInterval);
    clearInterval(state.seasonInterval);
    clearTimeout(state.eventTimeout);

    root.getElementById('end-overlay').classList.remove('hidden');
    root.getElementById('final-score-val').innerText = Math.floor(state.resources.score);
    root.getElementById('final-rank-val').innerText = state.rank;

    const medals = root.getElementById('end-medals');
    medals.innerHTML = "";
    if (state.resources.score > 10000) medals.innerHTML += "🥇";
    if (state.resources.score > 25000) medals.innerHTML += "👑";
    if (state.resources.score > 50000) medals.innerHTML += "✨";
}

// Start the game initialization
init();
