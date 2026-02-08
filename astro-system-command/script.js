/*
    Astro-Systems Command Logic
    Refactored for separation and compliance.
*/

const STAGES = [
    { name: "EARLY ROCKETRY", obj: "RADIO TELEMETRY", goal: 500, desc: "Focus on Propulsion and Basic Radio. Vacuum tubes are heavy!", parts: ['part-comm'] },
    { name: "LUNAR EXPLORATION", obj: "GEOLOGICAL MAPPING", goal: 2000, desc: "Requires Solar Arrays. Moving from radio beeps to image transmission.", parts: ['part-comm', 'part-power'] },
    { name: "ORBITAL OBSERVATORY", obj: "DEEP SPACE SURVEY", goal: 8000, desc: "High Optics needed. Technology shift: Solid state sensors replace film.", parts: ['part-comm', 'part-power', 'part-lens'] }
];

let currentStage = 0;
let allocations = { opt: 33, pwr: 33, prp: 34 };
let yieldTotal = 0;
let totalAccumulatedScore = 0;
let gameInterval = null;
let sliders = {};

function init() {
    sliders = {
        opt: root.getElementById('slider-opt'),
        pwr: root.getElementById('slider-pwr'),
        prp: root.getElementById('slider-prp')
    };

    // Attach listeners
    sliders.opt.oninput = () => handleSlider('opt');
    sliders.pwr.oninput = () => handleSlider('pwr');
    sliders.prp.oninput = () => handleSlider('prp');
    root.getElementById('upgrade-btn').onclick = nextEra;

    // Attach End Screen listeners
    root.getElementById('btn-retry').onclick = resetGame;
    root.getElementById('btn-submit').onclick = submitScore;

    // Start loop
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateLogic, 100);
}

function updateLogic() {
    // Science Logic: Data yield depends on Optics * Power
    let yieldRate = (allocations.opt * allocations.pwr) / 1000;

    // Physics Logic: Propulsion prevents decay
    let decay = Math.max(0, (40 - allocations.prp) * 0.1);

    // Update Stats
    yieldTotal += yieldRate;

    root.getElementById('tel-yield').innerText = yieldTotal.toFixed(1) + " GB";
    root.getElementById('tel-decay').innerText = decay.toFixed(2) + " mm/s";
    root.getElementById('tel-signal').innerText = (allocations.opt > 50) ? "STRONG" : "NOMINAL";

    // Progress
    let pCent = (yieldTotal / STAGES[currentStage].goal) * 100;
    root.getElementById('progress-fill').style.width = Math.min(100, pCent) + "%";
    root.getElementById('objective-counter').innerText = `${Math.floor(yieldTotal)} / ${STAGES[currentStage].goal}`;

    if (pCent >= 100) root.getElementById('upgrade-btn').disabled = false;

    // Spacecraft jitter based on instability
    root.getElementById('spacecraft-svg').style.transform = `translate(${Math.random() * decay}px, ${Math.random() * decay}px)`;
}

function handleSlider(type) {
    // Constrain total to 100%
    let total = parseInt(sliders.opt.value) + parseInt(sliders.pwr.value) + parseInt(sliders.prp.value);
    let diff = total - 100;

    // Auto-adjust others
    if (type === 'opt') {
        sliders.pwr.value -= diff / 2;
        sliders.prp.value -= diff / 2;
    } else if (type === 'pwr') {
        sliders.opt.value -= diff / 2;
        sliders.prp.value -= diff / 2;
    } else {
        sliders.opt.value -= diff / 2;
        sliders.pwr.value -= diff / 2;
    }

    allocations.opt = parseInt(sliders.opt.value);
    allocations.pwr = parseInt(sliders.pwr.value);
    allocations.prp = parseInt(sliders.prp.value);

    root.getElementById('label-opt').innerText = allocations.opt + "%";
    root.getElementById('label-pwr').innerText = allocations.pwr + "%";
    root.getElementById('label-prp').innerText = allocations.prp + "%";
}

function nextEra() {
    // Accumulate score before resetting yield logic for next stats
    totalAccumulatedScore += yieldTotal;

    currentStage++;
    if (currentStage >= STAGES.length) {
        endGame();
        return;
    }

    yieldTotal = 0;
    const s = STAGES[currentStage];
    root.getElementById('era-indicator').innerText = "ERA: " + s.name;
    root.getElementById('objective-title').innerText = "OBJECTIVE: " + s.obj;
    root.getElementById('objective-desc').innerText = s.desc;
    root.getElementById('upgrade-btn').disabled = true;

    // Visual Upgrade: Turn on spacecraft parts
    s.parts.forEach(id => {
        root.getElementById(id).setAttribute('opacity', '1');
    });

    const log = root.getElementById('log-window');
    log.innerHTML = `> New Technology Integrated... <br> > ${s.name} initialized...<br>` + log.innerHTML;
}

function endGame() {
    // Add pending yield to total
    totalAccumulatedScore += yieldTotal;

    clearInterval(gameInterval);
    const endScreen = root.getElementById('end-screen');
    endScreen.style.display = 'flex';

    const finalScore = Math.floor(totalAccumulatedScore);
    root.getElementById('final-score-val').innerText = finalScore;
}

function cleanUp() {
    // Reset logic
    currentStage = 0;
    yieldTotal = 0;
    totalAccumulatedScore = 0;
    allocations = { opt: 33, pwr: 33, prp: 34 };

    // Reset sliders
    sliders.opt.value = 33;
    sliders.pwr.value = 33;
    sliders.prp.value = 34;
    handleSlider('opt');

    // Reset Text
    const s = STAGES[0];
    root.getElementById('era-indicator').innerText = "ERA: " + s.name;
    root.getElementById('objective-title').innerText = "OBJECTIVE: " + s.obj;
    root.getElementById('objective-desc').innerText = s.desc;
    root.getElementById('upgrade-btn').disabled = true;

    // Reset Log
    root.getElementById('log-window').innerHTML = `> Initialize Sputnik-type probe...<br>> Waiting for stable orbit...`;

    // Reset SVG opacity
    // part-comm is base
    root.getElementById('part-comm').setAttribute('opacity', '1');
    root.getElementById('part-power').setAttribute('opacity', '0.2');
    root.getElementById('part-lens').setAttribute('opacity', '0.2');

    root.getElementById('end-screen').style.display = 'none';
}

function resetGame() {
    cleanUp();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateLogic, 100);
}

function submitScore() {
    const finalScore = Math.floor(totalAccumulatedScore);
    game.end({
        score: finalScore,
        stars: 3,
        success: true
    });
}

// Start existing behavior
init();
