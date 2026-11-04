/**
 * LevelManager.js - Selector y transiciones entre mundos
 */
import { loadLevel1_1 } from './level-1-1.js';
import { loadLevel1_2 } from './level-1-2.js';
import { loadLevel1_3 } from './level-1-3.js';
import { loadLevel1_4 } from './level-1-4.js';
import { loadLevel2_1 } from './level-2-1.js';
import { loadLevel2_2 } from './level-2-2.js';
import { VIEW_W, VIEW_H } from '../core/Camera.js';
import { MELODIES } from '../core/Audio.js';

        const LEVEL_THEMES = [
            {
                id: '1-1',
                name: 'Noche Estelar de Algodón',
                timeOfDay: 'night',
                weatherType: 'starfall',
                weatherLabel: '🌙 Noche Estrellada · Polvo de Hadas',
                timeLimit: 130,
                checkpointX: 3060,   // 🚩 bandera de mitad de nivel (≈52 % del recorrido)
                skyTop: '#0b0524',
                skyMid: '#1f114d',
                skyBot: '#3b1d6e',
                groundTop: '#ff9ed2',
                groundBody: '#4a2574',
                cloudTint1: '#3a216b',
                cloudTint2: '#4a2678'
            },
            {
                id: '1-2',
                name: 'Atardecer de Fuego y Caramelo',
                timeOfDay: 'sunset',
                weatherType: 'cosmic_rain',
                weatherLabel: '🌅 Atardecer Galáctico · Lluvia Cósmica',
                timeLimit: 115,
                checkpointX: 3800,   // 🚩 (≈53 %)
                skyTop: '#2c1054',
                skyMid: '#9e2a74',
                skyBot: '#ff8c66',
                groundTop: '#ffe58f',
                groundBody: '#5c1d52',
                cloudTint1: '#ffb3c6',
                cloudTint2: '#ff9ebb'
            },
            {
                id: '1-3',
                name: 'Día Radiante de Cristal Polar',
                timeOfDay: 'day',
                weatherType: 'crystal_snow',
                weatherLabel: '☀️ Día de Cristal · ¡Rescata al Gatito! 🐱',
                timeLimit: 115,
                checkpointX: 3545,   // 🚩 (≈42 %, tras la escalera de nubes)
                skyTop: '#69c0ff',
                skyMid: '#b5f5ec',
                skyBot: '#ffd6e7',
                groundTop: '#ffffff',
                groundBody: '#597ef7',
                cloudTint1: '#ffffff',
                cloudTint2: '#f0f5ff'
            },
            {
                id: '1-4',
                name: 'Abismo Tenebroso del Rey Marciano',
                timeOfDay: 'dark_boss',
                weatherType: 'dark_ash',
                weatherLabel: '🌑 Abismo Tenebroso · ¡Derrota al Boss! 🐙',
                timeLimit: 165,
                checkpointX: 2560,   // 🚩 Checkpoint justo antes de entrar a la Arena del Boss
                skyTop: '#04010a',
                skyMid: '#140526',
                skyBot: '#2b0938',
                groundTop: '#722ed1',
                groundBody: '#160729',
                cloudTint1: '#220b38',
                cloudTint2: '#33114d'
            },
            {
                id: '2-1',
                name: 'Ruinas de la Tierra Silenciosa',
                timeOfDay: 'ruined_earth',
                weatherType: 'ruined_ash',
                weatherLabel: '🏚️ Tierra Devastada · Hombres Enmascarados 🎭',
                timeLimit: 145,
                checkpointX: 4050,   // 🚩 Checkpoint en la Plaza Central de las Ruinas
                skyTop: '#15161e',
                skyMid: '#2d2733',
                skyBot: '#453842',
                groundTop: '#57606f',
                groundBody: '#1e272e',
                cloudTint1: '#2f3542',
                cloudTint2: '#1e272e'
            },
            {
                id: '2-2',
                name: 'Atardecer Carmesí de la Tierra Caída',
                timeOfDay: 'somber_sunset',
                weatherType: 'blood_embers',
                weatherLabel: '🌇 Atardecer Carmesí · ¡Hombres Zombie y Peligro Máximo! 🧟🔥',
                timeLimit: 140,
                checkpointX: 4200,   // 🚩 Checkpoint a mitad del atardecer
                skyTop: '#13041c',
                skyMid: '#440d29',
                skyBot: '#78281f',
                groundTop: '#b33939',
                groundBody: '#190e14',
                cloudTint1: '#5c192a',
                cloudTint2: '#3d101d'
            }
        ];

        // ⚙️ Ajustes fáciles de cambiar


const CHECKPOINT_MIN_TIME = 40;
const DEATH_ANIM_FRAMES = 80;

function buildLevel(idx, fromCheckpoint = false, withLanding = false, game) {
    const {
        lily, catCompanion, checkpointSave, audio, addParticles, addFloatingText,
        hudTimerPill
    } = game;

    game.platforms = [];
    game.blocks = [];
    game.thrusterPlatforms = [];
    game.starCandies = [];
    game.powerUps = [];
    game.enemies = [];
    game.enemyProjectiles = [];
    game.bubbles = [];
    game.movingPlatforms = [];
    game.fallingClouds = [];
    game.nightDrops = [];
    game.bounceClouds = [];
    game.ladders = [];
    game.particles = [];
    game.floatingTexts = [];
    game.boss = null;
    game.spaceship = null;

    const groundY = 460;
    game.timeLeftSeconds = LEVEL_THEMES[idx].timeLimit;
    if (hudTimerPill) hudTimerPill.classList.remove('kawaii-pill-danger');

    const addGround = (x, w, y = groundY) => {
        game.platforms.push({ x, y, w, h: VIEW_H - y + 80, type: 'ground' });
    };
    const addRooftop = (x, y, w, h = 26) => {
        game.platforms.push({ x, y, w, h, type: 'rooftop' });
    };
    const addLadder = (x, topY, bottomY, type = 'fixed', targetGroundY = groundY) => {
        game.ladders.push({
            x, topY, bottomY,
            origTopY: topY,
            origBottomY: bottomY,
            w: 32,
            type,
            state: 'idle',
            shakeTimer: 0,
            vy: 0,
            targetGroundY,
            damagedLily: false
        });
    };
    const addPastelPlatform = (x, y, w) => {
        game.platforms.push({ x, y, w, h: 24, type: 'cloud_plat' });
    };
    const addFallingCloud = (x, y, w = 95) => {
        game.fallingClouds.push({
            x, y, baseY: y, w, h: 22,
            triggered: false,
            shakeTimer: 0,
            vy: 0,
            respawnTimer: 0
        });
    };
    const addBlock = (x, y, type = 'cookie', content = 'star') => {
        game.blocks.push({
            x, y, w: 44, h: 38,
            type, content,
            used: false,
            openProgress: 0,
            bounceY: 0
        });
    };
    const addPipe = (x, h) => {
        const py = groundY - h;
        game.thrusterPlatforms.push({
            x: x - 12,
            y: py,
            baseY: py,
            w: 88,
            h: 24,
            phase: Math.random() * Math.PI * 2
        });
    };
    const addStarArc = (startX, y, count = 5, stepX = 38, arcH = 26) => {
        for (let i = 0; i < count; i++) {
            const ratio = count > 1 ? i / (count - 1) : 0.5;
            const offsetY = Math.sin(ratio * Math.PI) * arcH;
            game.starCandies.push({
                x: startX + i * stepX,
                y: y - offsetY,
                r: 13,
                collected: false,
                phase: i * 0.5
            });
        }
    };
    const addEnemy = (x, y, kind = 'cloud', minX = x - 120, maxX = x + 120, speedMult = 1) => {
        const baseSpeed = kind === 'cloud' ? 1.15 : (kind === 'zombie_masked' ? 1.75 : 1.45);
        game.enemies.push({
            x, y,
            w: 44, h: 42,
            vx: -baseSpeed * speedMult,
            vy: 0,
            kind,
            minX, maxX,
            speedMult,
            happy: false,
            happyTimer: 0,
            punchTimer: 0,
            shootCooldown: Math.floor(Math.random() * 60) + 45,
            bouncePhase: Math.random() * Math.PI * 2,
            isAlerted: false,
            alertSoundPlayed: false
        });
    };
    const addNightDrop = (x, minY, maxY, speed = 2.4) => {
        game.nightDrops.push({
            x, y: minY + Math.random() * (maxY - minY),
            minY, maxY,
            vy: speed,
            r: 13
        });
    };
    const createGoalSpaceship = (x) => ({
        x,
        y: groundY - 128,
        baseY: groundY - 128,
        w: 140,
        h: 128,
        vy: 0,
        reached: false,
        boardingTimer: 0,
        launching: false
    });

    const ctx = {
        addGround, addRooftop, addLadder, addPastelPlatform, addFallingCloud,
        addBlock, addPipe, addStarArc, addEnemy, addNightDrop, createGoalSpaceship,
        platforms: game.platforms,
        blocks: game.blocks,
        thrusterPlatforms: game.thrusterPlatforms,
        starCandies: game.starCandies,
        powerUps: game.powerUps,
        enemies: game.enemies,
        enemyProjectiles: game.enemyProjectiles,
        bubbles: game.bubbles,
        movingPlatforms: game.movingPlatforms,
        fallingClouds: game.fallingClouds,
        nightDrops: game.nightDrops,
        bounceClouds: game.bounceClouds,
        ladders: game.ladders,
        groundY,
        spaceship: null,
        boss: null
    };

    if (idx === 0) loadLevel1_1(ctx);
    else if (idx === 1) loadLevel1_2(ctx);
    else if (idx === 2) loadLevel1_3(ctx);
    else if (idx === 3) loadLevel1_4(ctx);
    else if (idx === 4) loadLevel2_1(ctx);
    else loadLevel2_2(ctx);

    if (ctx.spaceship) game.spaceship = ctx.spaceship;
    if (ctx.boss !== null) game.boss = ctx.boss;

    // Reset state de Lily en el nuevo mundo
    if (idx !== 3) {
        game.boss = null;
    }

    lily.x = 90;
    lily.y = groundY - lily.h;
    lily.vx = 0;
    lily.vy = 0;
    lily.facing = 1;
    lily.onGround = true;
    lily.coyoteTimer = 8;
    lily.rocketTimer = 0;
    lily.inSpaceship = false;
    lily.landingInProgress = false;
    game.cameraX = 0;
    game.arrivalShip = null;

    // Ajustar cofres flotantes contra el terreno si están por debajo
    const grounds = game.platforms.filter(p => p.type === 'ground' || p.type === 'rooftop');
    if (grounds.length > 0) {
        const placed = [];
        game.blocks.forEach(b => {
            let g = grounds.find(gr => b.x + b.w > gr.x && b.x < gr.x + gr.w);
            if (!g) {
                let best = null;
                grounds.forEach(cand => {
                    const cx = Math.max(cand.x + 8, Math.min(b.x, cand.x + cand.w - b.w - 8));
                    const dist = Math.abs(cx - b.x);
                    if (!best || dist < best.dist) best = { p: cand, dist, cx };
                });
                if (best) { g = best.p; b.x = best.cx; }
            }
            if (g) {
                let guard = 0;
                while (placed.some(o => Math.abs(o.x - b.x) < b.w + 40) && guard++ < 12) {
                    b.x += b.w + 40;
                    if (b.x + b.w > g.x + g.w - 8) { b.x = g.x + 8; break; }
                }
                b.y = g.y - b.h;
            }
            placed.push(b);
        });
    }

    // Gatito protector persistente
    catCompanion.projectiles = [];
    if (lily.hasCatCompanion) {
        lily.hasCatCompanion = true;
        catCompanion.active = true;
        catCompanion.x = lily.x - 36;
        catCompanion.y = lily.y - 10;
    } else {
        catCompanion.active = false;
    }

    // Checkpoint
    game.checkpoint = { x: LEVEL_THEMES[idx].checkpointX, y: groundY, reached: false };
    if (fromCheckpoint && checkpointSave.levelIndex === idx) {
        game.checkpoint.reached = true;
        lily.x = game.checkpoint.x - lily.w / 2;
        lily.y = game.checkpoint.y - lily.h;
        game.cameraX = Math.max(0, Math.min(lily.x - VIEW_W * 0.35, game.levelWidth - VIEW_W));
        game.timeLeftSeconds = Math.min(
            LEVEL_THEMES[idx].timeLimit,
            Math.max(checkpointSave.time, CHECKPOINT_MIN_TIME)
        );
        addParticles(game.checkpoint.x, game.checkpoint.y - 40, 16, 'star', '#ffe58f');
        addFloatingText(game.checkpoint.x, game.checkpoint.y - 115, '🚩 ¡Sigue intentando!', '#ffe58f');
    } else {
        checkpointSave.levelIndex = -1;
        if (withLanding) {
            game.arrivalShip = {
                x: 42,
                y: -145,
                targetY: groundY - 128,
                w: 140,
                h: 128,
                vy: 5.2,
                state: 'descending',
                timer: 0
            };
            lily.landingInProgress = true;
            lily.x = game.arrivalShip.x + game.arrivalShip.w / 2 - lily.w / 2;
            lily.y = game.arrivalShip.y + 30;
            if (audio) audio.playSpaceshipLand();
        }
    }

    // Melodía musical según el nivel
    if (audio) {
        audio.melodyIndex = Math.min(idx, MELODIES.length - 1);
        audio.noteStep = 0;
        const mel = MELODIES[audio.melodyIndex];
        const melEl = document.getElementById('melody-name');
        if (melEl) melEl.textContent = mel.name;
        const prevEl = document.getElementById('preview-melody-text');
        if (prevEl) prevEl.textContent = `Música: ${mel.name.slice(3)}`;
    }

    if (game.updateHUD) game.updateHUD();
}

export {
    LEVEL_THEMES,
    buildLevel,
    CHECKPOINT_MIN_TIME,
    DEATH_ANIM_FRAMES
};

export default {
    LEVEL_THEMES,
    buildLevel,
    CHECKPOINT_MIN_TIME,
    DEATH_ANIM_FRAMES
};
