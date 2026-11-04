/**
 * main.js - Punto de entrada, bucle principal y orquestador de estados
 * "El Reino Estelar de Lily"
 */

import { AssetManager, drawMagicBloom } from './core/AssetLoader.js';
import { VIEW_W, VIEW_H, Camera } from './core/Camera.js';
import { keys, triggerJumpInput, bindTouchButton, initInput } from './core/Input.js';
import { KawaiiAudio, MELODIES, BOSS_TENSION_MELODY } from './core/Audio.js';

import {
    IDLE_TIMELINE,
    getLilySpriteFrame,
    createLilyState,
    drawLilyCharacter,
    renderLilyPortraitPreview,
    checkExtraHeart,
    hurtLily
} from './entities/Lily.js';

import {
    createCatCompanionState,
    drawCatCompanionSprite,
    loseCat
} from './entities/CatCompanion.js';

import {
    drawKawaiiObstacle,
    befriendEnemy
} from './entities/Enemy.js';

import {
    createBossState,
    drawMarcianoBoss,
    damageBoss
} from './entities/Boss.js';

import {
    FW_COLORS,
    fireworks,
    drawStarShape,
    drawHeartShape,
    drawRoundedRect,
    drawSurpriseGiftBox,
    openSurpriseBox,
    spawnPowerUpFromBlock,
    shootSweetBubble,
    launchFirework,
    updateFireworks,
    drawFireworks
} from './entities/Collectibles.js';

import {
    aabb,
    drawCloudPlatform,
    drawThrusterFlames,
    drawThrusterPlatform,
    drawRooftopPlatform,
    drawLadder,
    drawCheckpointFlag,
    drawArrivalSpaceship,
    drawGoalSpaceship
} from './world/Platform.js';

import {
    createWeatherState,
    spawnShootingStar,
    drawKawaiiPlanet,
    drawKawaiiMoon,
    drawFluffyBgCloud,
    renderStarryNightBackground
} from './world/Weather.js';

import {
    LEVEL_THEMES,
    buildLevel as buildLevelCore,
    CHECKPOINT_MIN_TIME,
    DEATH_ANIM_FRAMES
} from './levels/LevelManager.js';

// ============================================================================
// Canvas & Context Setup
// ============================================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
window.ctx = ctx;

const previewCanvas = document.getElementById('lilyPreviewCanvas');
const previewCtx = previewCanvas.getContext('2d');
window.previewCtx = previewCtx;

// Audio & Camera
const audio = new KawaiiAudio();
const camera = new Camera(VIEW_W, VIEW_H);

// Entities & Weather
const lily = createLilyState();
const catCompanion = createCatCompanionState();
const weatherState = createWeatherState();
const bgStars = weatherState.bgStars;
const shootingStars = weatherState.shootingStars;
const bgClouds = weatherState.bgClouds;
const bgPlanets = weatherState.bgPlanets;
const weatherParticles = weatherState.weatherParticles;
const constellations = weatherState.constellations;

// Game State & Timing
const FIXED_STEP_MS = 1000 / 60;
let lastFrameTime = 0;
let stepAccumulator = 0;
let currentLevelIndex = 0;
let gameState = 'TITLE'; // 'TITLE', 'INTRO_ROOM', 'PLAYING', 'DYING', 'AUTO_NEXT_LEVEL', 'GAME_WIN', 'GAME_OVER'
let globalTick = 0;
let deathCount = 0;
let timeLeftSeconds = 130;
let autoNextLevelTimer = 0;
let checkpoint = null;
const checkpointSave = { levelIndex: -1, time: 0 };
const deathInfo = { cause: '', timer: 0 };
let lightningFlash = 0;
let cameraX = 0;
let levelWidth = 6200;
let cameraShakeAmount = 0;
let gameOverTick = 0;

// Victory & Celebration State
const CELEBRATION_FRAMES = 300;
let celebrationTimer = 0;
let celebGroundY = null;
let celebHops = 0;
let celebHopCd = 0;

window.globalTick = 0;
window.cameraX = 0;
window.gameState = 'TITLE';
window.lightningFlash = 0;
window.lily = lily;
window.catCompanion = catCompanion;
window.audio = audio;
window.camera = camera;
window.weatherState = weatherState;
window.fireworks = fireworks;

// World entity arrays
let platforms = [];
let blocks = [];
let thrusterPlatforms = [];
let starCandies = [];
let powerUps = [];
let enemies = [];
let enemyProjectiles = [];
let bubbles = [];
let movingPlatforms = [];
let fallingClouds = [];
let nightDrops = [];
let bounceClouds = [];
let ladders = [];
let particles = [];
let floatingTexts = [];
let boss = null;
let spaceship = null;
let arrivalShip = null;

// Expose entity arrays and references on window for modular interop
window.platforms = platforms;
window.blocks = blocks;
window.thrusterPlatforms = thrusterPlatforms;
window.starCandies = starCandies;
window.powerUps = powerUps;
window.enemies = enemies;
window.enemyProjectiles = enemyProjectiles;
window.bubbles = bubbles;
window.movingPlatforms = movingPlatforms;
window.fallingClouds = fallingClouds;
window.nightDrops = nightDrops;
window.bounceClouds = bounceClouds;
window.ladders = ladders;
window.particles = particles;
window.floatingTexts = floatingTexts;
window.boss = boss;

        const introRoom = {
            sittingInChair: true,
            lilyX: 255,
            lilyY: 378,
            facing: 1,
            animTimer: 0,
            reachingScreen: false,
            suctionActive: false,
            suctionProgress: 0, // 0 to 1
            deskX: 620,
            monitorCenterX: 690,
            monitorCenterY: 315
        };



// ============================================================================
// DOM References & HUD
// ============================================================================
        const hudHearts = document.getElementById('hud-hearts');
        const hudLives = document.getElementById('hud-lives');
        const miniLives = document.getElementById('mini-lives');
        const miniCat = document.getElementById('mini-cat');
        const miniTime = document.getElementById('mini-time');
        const miniTimePill = document.getElementById('mini-time-pill');
        const miniStars = document.getElementById('mini-stars');
        const btnPunch = document.getElementById('btn-punch');
        const menuOverlay = document.getElementById('menu-overlay');
        const pauseOverlay = document.getElementById('pause-overlay');
        const hudDeaths = document.getElementById('hud-deaths');
        const hudDeathsPill = document.getElementById('hud-deaths-pill');
        const hudCheckpoint = document.getElementById('hud-checkpoint');
        const hudTimer = document.getElementById('hud-timer');
        const hudTimerPill = document.getElementById('hud-timer-pill');
        const hudStars = document.getElementById('hud-stars');
        const hudScore = document.getElementById('hud-score');
        const hudLevel = document.getElementById('hud-level');
        const hudPowerName = document.getElementById('hud-power-name');
        const toastBanner = document.getElementById('toast-banner');
        const storyGuideBar = document.getElementById('story-guide-bar');
        const storyGuideIcon = document.getElementById('story-guide-icon');
        const storyGuideText = document.getElementById('story-guide-text');

        const titleOverlay = document.getElementById('title-overlay');
        const victoryOverlay = document.getElementById('victory-overlay');
        const helpOverlay = document.getElementById('help-overlay');

        const modalStars = document.getElementById('modal-stars');
        const modalScore = document.getElementById('modal-score');
        const modalDeaths = document.getElementById('modal-deaths');
        const btnNextAction = document.getElementById('btn-next-action');


        let toastTimeout = null;
        function showToast(message, duration = 3200) {
            toastBanner.textContent = message;
            toastBanner.classList.remove('opacity-0', '-translate-y-4');
            toastBanner.classList.add('opacity-100', 'translate-y-0');
            if (toastTimeout) clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toastBanner.classList.remove('opacity-100', 'translate-y-0');
                toastBanner.classList.add('opacity-0', '-translate-y-4');
            }, duration);
        }


        function isOverlayPaused() {
            return !menuOverlay.classList.contains('hidden') || !pauseOverlay.classList.contains('hidden');
        }
        function syncPauseAudio() {
            const paused = isOverlayPaused();
            audio.paused = paused;
            if (audio.ctx) {
                if (paused) audio.ctx.suspend(); else audio.ctx.resume();
            }
            keys.left = keys.right = keys.jumpHeld = false;
        }
        function openMenu() {
            if (gameState === 'TITLE') return;
            updateHUD();
            menuOverlay.classList.remove('hidden');
            syncPauseAudio();
        }
        function closeMenu() {
            menuOverlay.classList.add('hidden');
            syncPauseAudio();
            canvas.focus();
        }
        function togglePause() {
            if (gameState === 'TITLE') return;
            if (!menuOverlay.classList.contains('hidden')) { closeMenu(); return; }
            pauseOverlay.classList.toggle('hidden');
            syncPauseAudio();
            canvas.focus();
        }

        function resizeCanvas() {
            canvas.width = VIEW_W;
            canvas.height = VIEW_H;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        /******************************************************************
         * 🎨 ASSET MANAGER + CHROMA KEY CON FEATHERING (./asets/)
         * Carga las 4 imágenes de ./asets/, procesa las 3 hojas de sprites/tiles
         * en un <canvas> oculto en memoria (offscreen canvas) con getImageData
         * para eliminar el fondo blanco (R > 240 && G > 240 && B > 240 -> alpha = 0)
         * con suavizado de bordes (feathering) y mantiene fallback vectorial.
         ******************************************************************/

        function addParticles(x, y, count = 8, type = 'sparkle', customColor = null) {
            const palette = ['#ff85c0', '#ffe58f', '#d3adf7', '#ffc2e2', '#b5f5ec'];
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3.4 + 0.8;
                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 1.1,
                    size: Math.random() * 5 + 4,
                    life: 1,
                    decay: Math.random() * 0.025 + 0.018,
                    type,
                    color: customColor || palette[Math.floor(Math.random() * palette.length)]
                });
            }
        }

        function addFloatingText(x, y, text, color = '#ffe58f') {
            floatingTexts.push({
                x,
                y,
                text,
                color,
                vy: -1.3,
                life: 1
            });
        }

        /******************************************************************
         * GAME STATE, INTRO BEDROOM SCENE & EXTENDED 3-LEVEL DEFINITIONS
         ******************************************************************/

        function shakeCamera(intensity = 8) {
            cameraShakeAmount = Math.max(cameraShakeAmount, intensity);
        }

        function registerDeath(reasonMessage, soundDelay = 0) {
            deathCount++;
            hudDeaths.textContent = deathCount;
            // Pequeño "pop" rojo en el contador para que se note cada muerte
            hudDeathsPill.classList.remove('death-pop');
            void hudDeathsPill.offsetWidth; // reinicia la animación CSS
            hudDeathsPill.classList.add('death-pop');
            audio.playDeath(soundDelay);
            showToast(reasonMessage, 3400);
        }

        // Toda muerte pasa por aquí: 'hearts' (sin energía), 'fall' (vacío) o 'timeout' (tiempo agotado).
        function killLily(cause) {
            if (gameState !== 'PLAYING') return;
            const toCheckpoint = cause !== 'timeout' && checkpointSave.levelIndex === currentLevelIndex;
            const where = toCheckpoint ? 'Volverás al checkpoint 🚩' : 'Volverás al inicio del nivel';
            const reasons = {
                hearts: `💀 ¡Los marcianos dejaron a Lily sin energía! ${where}`,
                fall: `💀 ¡Lily cayó al vacío estelar! ${where}`,
                timeout: `⏰ ¡Se acabó el tiempo! ${where}`
            };
            const hadCat = catCompanion.active;
            lily.lives = Math.max(0, lily.lives - 1);
            lily.hasCatCompanion = false;
            catCompanion.active = false;
            catCompanion.projectiles = [];
            let msg = reasons[cause] + (hadCat ? ' 😿 Perdiste al gatito.' : '');
            if (lily.lives <= 0) msg = '💔 ¡Lily se quedó sin vidas!';
            else msg += ` Te quedan ${lily.lives} ❤️`;
            registerDeath(msg, cause === 'hearts' ? 0.18 : 0);
            lily.score = Math.max(0, lily.score - (cause === 'timeout' ? 500 : 300));

            deathInfo.cause = cause;
            deathInfo.timer = cause === 'fall' ? 60 : DEATH_ANIM_FRAMES;
            lily.invincibleTimer = 0;
            lily.vx = 0;
            lily.onGround = false;
            lily.rotation = 0;
            if (cause === 'fall') {
                addParticles(lily.x + lily.w / 2, VIEW_H - 10, 12, 'star', '#ffc2e2');
            } else {
                lily.vy = -9.5;
                addParticles(lily.x + lily.w / 2, lily.y + lily.h / 2, 14, 'heart', '#ff85c0');
            }
            gameState = 'DYING';
            updateHUD();
        }

        // Termina la animación de muerte: reconstruye el nivel ACTUAL y coloca a Lily donde corresponda.
        function respawnAfterDeath() {
            if (lily.lives <= 0) { triggerGameOver(); return; }
            const toCheckpoint = deathInfo.cause !== 'timeout' && checkpointSave.levelIndex === currentLevelIndex;
            lily.hearts = lily.maxHearts;
            lily.power = 'none';
            lily.rocketTimer = 0;
            if (audio.isBossMusicActive) {
                audio.stopLullaby();
                audio.startLullaby();
            }
            buildLevel(currentLevelIndex, toCheckpoint, false);
            lily.invincibleTimer = 120;   // 2 s de gracia al reaparecer
            gameState = 'PLAYING';
        }
        function triggerGameOver() {
            gameState = 'GAME_OVER';
            gameOverTick = 0;
            keys.jumpBufferTimer = 0;
            keys.actionJustPressed = false;
            audio.stopLullaby();
            particles = [];
        }

        // Game Over → reinicia todo desde el Nivel 1-1
        function restartFromLevel1() {
            deathCount = 0;
            hudDeaths.textContent = '0';
            lily.hearts = lily.maxHearts;
            lily.lives = 3;
            lily.lifeAwards = 0;
            lily.stars = 0;
            lily.score = 0;
            lily.power = 'none';
            lily.rocketTimer = 0;
            lily.hasCatCompanion = false;
            catCompanion.active = false;
            checkpointSave.levelIndex = -1;
            currentLevelIndex = 0;
            audio.startLullaby();
            buildLevel(0, false, true);
            gameState = 'PLAYING';
            canvas.focus();
        }


        function drawInGameHUD() {
            if (gameState === 'TITLE' || gameState === 'INTRO_ROOM') return;
            const danger = timeLeftSeconds <= 20;
            const secs = Math.max(0, Math.ceil(timeLeftSeconds));
            const toNext = 50 - (lily.stars % 50);
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            const x = 12, y = 50, w = 214, h = 92;
            ctx.fillStyle = 'rgba(28, 12, 66, 0.8)';
            ctx.strokeStyle = danger ? '#ff4d6d' : '#ff9ed2';
            ctx.lineWidth = 3;
            drawRoundedRect(ctx, x, y, w, h, 16);
            ctx.fill();
            ctx.stroke();
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'left';
            ctx.lineJoin = 'round';
            const line = (txt, ly, color) => {
                ctx.font = 'bold 21px Fredoka, sans-serif';
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#261247';
                ctx.strokeText(txt, x + 14, ly);
                ctx.fillStyle = color;
                ctx.fillText(txt, x + 14, ly);
            };
            line(`❤️ Vidas: ${lily.lives}${catCompanion.active ? '  🐱' : ''}`, y + 21, '#ffc2e2');
            line(`🍬 Estrellas: ${lily.stars}`, y + 46, '#ffe58f');
            line(`⏱️ Tiempo: ${secs}s`, y + 71, danger ? '#ff8fa3' : '#b5f5ec');
            ctx.font = 'bold 11px Fredoka, sans-serif';
            ctx.fillStyle = '#d3adf7';
            ctx.textAlign = 'right';
            ctx.fillText(`+❤️ en ${toNext}`, x + w - 10, y + 46);
            ctx.restore();
        }


        function drawGameOverScreen() {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = 'rgba(10, 4, 28, 0.86)';
            ctx.fillRect(0, 0, VIEW_W, VIEW_H);
            const cx = VIEW_W / 2, t = gameOverTick;
            // Nubecita de lluvia sobre Lily
            ctx.fillStyle = '#6b7aa8';
            [[-46, 0, 34], [-14, -14, 40], [24, -6, 36], [54, 4, 28]].forEach(([dx, dy, r]) => {
                ctx.beginPath(); ctx.arc(cx + dx, 112 + dy, r, 0, Math.PI * 2); ctx.fill();
            });
            ctx.fillStyle = '#9fb4ff';
            for (let i = 0; i < 14; i++) {
                const dx = -70 + i * 11, dy = 150 + ((t * 4 + i * 23) % 150);
                ctx.fillRect(cx + dx, dy, 2.5, 9);
            }
            // Lily triste
            const sc = 2.6, ly = 330 + Math.sin(t * 0.05) * 2;
            drawLilyCharacter(ctx, cx, ly, sc, { ...lily, facing: 1, rotation: 0, vx: 0, vy: 0, onGround: true, power: 'none', invincibleTimer: 0, animTimer: 0 });
            // Lagrimitas desde los ojos
            ctx.fillStyle = '#7cc8ff';
            [-5.0, 5.4].forEach((ex, k) => {
                const prog = ((t * 0.03 + k * 0.5) % 1);
                const tx = cx + ex * sc, ty = ly - 11.8 * sc + 8 * sc + prog * 60;
                ctx.globalAlpha = 1 - prog * 0.6;
                ctx.beginPath(); ctx.arc(tx, ty, 5, 0, Math.PI * 2); ctx.moveTo(tx - 5, ty); ctx.lineTo(tx, ty - 12); ctx.lineTo(tx + 5, ty); ctx.fill();
            });
            ctx.globalAlpha = 1;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 64px Fredoka, sans-serif';
            ctx.lineWidth = 8; ctx.lineJoin = 'round';
            ctx.strokeStyle = '#261247'; ctx.strokeText('😢 GAME OVER', cx, 62);
            ctx.fillStyle = '#ff85c0'; ctx.fillText('😢 GAME OVER', cx, 62);
            ctx.font = 'bold 20px Fredoka, sans-serif';
            ctx.fillStyle = '#ffe58f';
            ctx.fillText('Lily se quedó sin vidas... ¡pero las estrellas siempre vuelven a brillar!', cx, 462);
            if (t > 60 && Math.floor(t / 30) % 2 === 0) {
                ctx.fillStyle = '#ffffff';
                ctx.fillText('Toca la pantalla o presiona Espacio / Enter para empezar desde el Nivel 1-1 🌙', cx, 500);
            }
            ctx.restore();
        }


        function activateCheckpoint() {
            checkpoint.reached = true;
            checkpointSave.levelIndex = currentLevelIndex;
            checkpointSave.time = timeLeftSeconds;
            audio.playCheckpoint();
            addParticles(checkpoint.x, checkpoint.y - 80, 20, 'star', '#ffe58f');
            addParticles(checkpoint.x, checkpoint.y - 60, 10, 'heart', '#ff85c0');
            addFloatingText(checkpoint.x, checkpoint.y - 115, '🚩 ¡Checkpoint!', '#ffe58f');
            showToast('🚩 ¡Checkpoint alcanzado! Si pierdes, volverás aquí', 3000);
            updateHUD();
        }


        function startIntroRoomScene() {
            gameState = 'INTRO_ROOM';
            introRoom.sittingInChair = true;
            introRoom.lilyX = 255;
            introRoom.lilyY = 374;
            introRoom.facing = 1;
            introRoom.animTimer = 0;
            introRoom.reachingScreen = false;
            introRoom.suctionActive = false;
            introRoom.suctionProgress = 0;
            particles = [];
            floatingTexts = [];
            hudLevel.textContent = 'Cuarto';
            hudTimer.textContent = '---';
            hudTimerPill.classList.remove('kawaii-pill-danger');
            checkpoint = null;
            checkpointSave.levelIndex = -1;
            updateHUD();
            showToast('💻 Camina con ➡️ hacia la computadora rosa de Lily para tocar la pantalla ✨', 4500);
        }

        function updateIntroRoom() {
            if (introRoom.suctionActive) {
                introRoom.suctionProgress += 0.011;
                if (globalTick % 2 === 0) {
                    const ang = Math.random() * Math.PI * 2;
                    const dist = (1 - introRoom.suctionProgress) * 140 + 15;
                    particles.push({
                        x: introRoom.monitorCenterX + Math.cos(ang) * dist,
                        y: introRoom.monitorCenterY + Math.sin(ang) * dist,
                        vx: -Math.cos(ang) * 3.5,
                        vy: -Math.sin(ang) * 3.5,
                        size: Math.random() * 6 + 4,
                        life: 0.9,
                        decay: 0.04,
                        type: Math.random() < 0.5 ? 'star' : 'heart',
                        color: ['#ff85c0', '#ffe58f', '#b5f5ec', '#d3adf7'][Math.floor(Math.random() * 4)]
                    });
                }

                if (introRoom.suctionProgress >= 1) {
                    currentLevelIndex = 0;
                    buildLevel(0, false, true);
                    gameState = 'PLAYING';
                    showToast('🛸 ¡Aterrizando en el Mundo 1-1! Busca los bloques con Cohete 🚀 para volar', 4200);
                }
                updateParticlesAndTexts();
                return;
            }

            // Check if player moves to stand up from the chair and walk toward the pink computer
            const wantsRight = keys.right;
            const wantsLeft = keys.left;
            const wantsJumpOrInteract = keys.jumpBufferTimer > 0 || keys.actionJustPressed;

            if (introRoom.sittingInChair) {
                if (wantsRight || wantsLeft || wantsJumpOrInteract) {
                    introRoom.sittingInChair = false;
                    introRoom.lilyY = 390;
                    keys.jumpBufferTimer = 0;
                    keys.actionJustPressed = false;
                    audio.playJump(false);
                    addParticles(introRoom.lilyX, introRoom.lilyY + 15, 8, 'sparkle', '#ffc2e2');
                }
            } else {
                if (wantsRight) {
                    introRoom.lilyX += 3.6;
                    introRoom.facing = 1;
                    introRoom.animTimer += 0.32;
                } else if (wantsLeft) {
                    introRoom.lilyX = Math.max(120, introRoom.lilyX - 3.6);
                    introRoom.facing = -1;
                    introRoom.animTimer += 0.32;
                } else {
                    introRoom.animTimer = 0;
                }

                // When Lily reaches the pink desk/computer (around X = 575)
                if (introRoom.lilyX >= 565) {
                    introRoom.lilyX = 568;
                    introRoom.facing = 1;
                    introRoom.reachingScreen = true;
                    // Trigger magical computer screen suction!
                    introRoom.suctionActive = true;
                    introRoom.suctionProgress = 0;
                    audio.playPortalVortex();
                    addFloatingText(introRoom.monitorCenterX, introRoom.monitorCenterY - 65, '✨ ¡PORTAL ROSA ACTIVADO! ✨', '#ffe58f');
                    showToast('🌀 ¡La computadora rosa está absorbiendo a Lily hacia el Reino Estelar!', 3500);
                }
            }

            updateParticlesAndTexts();
        }

        /******************************************************************
         * BUILD EXTENDED LEVELS (1-1: 6200px, 1-2: 7400px, 1-3: 8600px)
         ******************************************************************/

        function updateHUD() {
            hudHearts.textContent = '💖'.repeat(Math.max(0, lily.hearts)) + '🤍'.repeat(Math.max(0, lily.maxHearts - lily.hearts));
            hudDeaths.textContent = deathCount;
            hudLives.textContent = `❤️×${lily.lives}`;
            hudCheckpoint.classList.toggle('hidden', !(checkpoint && checkpoint.reached));
            hudStars.textContent = lily.stars;
            hudScore.textContent = String(lily.score).padStart(5, '0');

            if (gameState === 'INTRO_ROOM') {
                hudLevel.textContent = 'Cuarto';
                hudTimer.textContent = '---';
            } else {
                hudLevel.textContent = LEVEL_THEMES[currentLevelIndex].id;
                hudTimer.textContent = `${Math.max(0, Math.ceil(timeLeftSeconds))}s`;
                if (timeLeftSeconds <= 20) {
                    hudTimerPill.classList.add('kawaii-pill-danger');
                } else {
                    hudTimerPill.classList.remove('kawaii-pill-danger');
                }
            }

            miniLives.textContent = lily.lives;
            miniCat.classList.toggle('hidden', !catCompanion.active);
            miniStars.textContent = lily.stars;
            btnPunch.style.display = lily.power === 'punch' ? '' : 'none';
            if (gameState === 'INTRO_ROOM') {
                miniTime.textContent = '--';
                miniTimePill.classList.remove('danger');
            } else {
                miniTime.textContent = `${Math.max(0, Math.ceil(timeLeftSeconds))}s`;
                miniTimePill.classList.toggle('danger', timeLeftSeconds <= 20);
            }

            if (lily.rocketTimer > 0) {
                hudPowerName.textContent = `🚀 Vuelo (${(lily.rocketTimer / 60).toFixed(1)}s)`;
            } else if (catCompanion.active) {
                hudPowerName.textContent = lily.power === 'bubble' ? '🐱 Gatito + 🫧 Burbuja' : '🐱 Gatito Protector';
            } else if (lily.power === 'bell') {
                hudPowerName.textContent = '🔔 Cascabel (Triple Salto)';
            } else if (lily.power === 'punch') {
                hudPowerName.textContent = '👊 Puñito Poderoso';
            } else if (lily.power === 'bubble') {
                hudPowerName.textContent = '🫧 Burbuja Dulce';
            } else {
                hudPowerName.textContent = '⭐ Doble Salto';
            }

            updateStoryGuide();
        }

        /******************************************************************
         * DYNAMIC STORY & TUTORIAL GUIDE SYSTEM (Parte Inferior)
         ******************************************************************/
        let lastStoryText = '';

        function getStoryGuideMessage() {
            if (gameState === 'TITLE') {
                return {
                    icon: '✨',
                    text: '¡Bienvenida al Reino Estelar de Lily! Elige tu punto de inicio y presiona COMENZAR A JUGAR.'
                };
            }
            if (gameState === 'INTRO_ROOM') {
                if (introRoom.suctionActive) {
                    return {
                        icon: '🌀',
                        text: '¡El portal de la computadora rosa está absorbiendo a Lily hacia el Reino Estelar! ¡Prepárate!'
                    };
                }
                if (introRoom.sittingInChair) {
                    return {
                        icon: '👧🏻',
                        text: 'Lily está sentada frente a su compu rosa. Presiona ➡️ (o tecla D) para levantarte y explorar su cuarto.'
                    };
                }
                return {
                    icon: '💻',
                    text: 'Camina con ➡️ hacia la pantalla de la computadora para tocarla e ingresar al portal galáctico.'
                };
            }
            if (gameState === 'DYING') {
                return {
                    icon: '💔',
                    text: '¡Auch! Lily perdió energía... pero no te rindas, ¡las estrellas siempre vuelven a brillar!'
                };
            }
            if (gameState === 'GAME_OVER') {
                return {
                    icon: '😢',
                    text: '¡Lily se quedó sin vidas! Toca la pantalla o presiona Espacio / Enter para intentarlo de nuevo desde el Nivel 1.'
                };
            }
            if (gameState === 'CELEBRATING') {
                return {
                    icon: '🎉',
                    text: '¡VICTORIA GALÁCTICA! ¡El Rey Marciano ha sido vencido! ¡Celebra con los fuegos artificiales estelares!'
                };
            }
            if (gameState === 'GAME_WIN') {
                return {
                    icon: '👑',
                    text: '¡Felicidades! Completaste toda la aventura galáctica de Lily con éxito. ¡Eres una gran heroína estelar!'
                };
            }
            if (gameState === 'AUTO_NEXT_LEVEL') {
                return {
                    icon: '🚀',
                    text: '¡Nivel superado con éxito! La Nave Estelar de Lily viaja a la velocidad de la luz hacia el siguiente mundo...'
                };
            }

            // gameState === 'PLAYING'
            if (lily.landingInProgress) {
                return {
                    icon: '🛸',
                    text: '¡Lily acaba de aterrizar en su Nave Estelar! Prepárate para saltar y explorar este nuevo mundo.'
                };
            }

            if (lily.inSpaceship) {
                return {
                    icon: '🚀',
                    text: '¡Excelente! Lily abordó la Nave Estelar y está encendiendo los propulsores para despegar.'
                };
            }

            // Boss final en Mundo 1-4
            if (boss && !boss.defeated) {
                const distBoss = Math.abs((lily.x + lily.w / 2) - boss.x);
                if (distBoss < 650) {
                    if (boss.hurtTimer > 0) {
                        return {
                            icon: '💥',
                            text: '¡Impacto al Rey Marciano! ¡Se está encogiendo! ¡Sigue atacándolo hasta derrotarlo!'
                        };
                    }
                    if (lily.power === 'punch') {
                        return {
                            icon: '👊',
                            text: '¡Usa tu Puñito Poderoso 👊 (o teclas C / F / V) para noquear al Rey Marciano!'
                        };
                    }
                    if (lily.power === 'bubble') {
                        return {
                            icon: '🫧',
                            text: '¡Dispara Burbujas Dulces 🫧 (o teclas Z / X) para golpear al Rey Marciano a distancia!'
                        };
                    }
                    return {
                        icon: '👑',
                        text: '¡Rey Marciano al frente! Esquiva sus meteoritos y salta sobre su corona para encogerlo.'
                    };
                }
            }

            // Nave de Meta cercana
            if (spaceship && !spaceship.reached) {
                const distShip = spaceship.x - lily.x;
                if (distShip > 0 && distShip < 480) {
                    if (boss && !boss.defeated) {
                        return {
                            icon: '🔒',
                            text: '¡La Nave Estelar está asegurada! Vence al Rey Marciano para desbloquear el despegue.'
                        };
                    }
                    return {
                        icon: '🛸',
                        text: '¡La Nave Estelar de escape te espera! Sube a la cabina para completar la misión de este mundo.'
                    };
                }
            }

            // Advertencia de tiempo
            if (timeLeftSeconds <= 20) {
                return {
                    icon: '⏰',
                    text: `¡TIEMPO AGOTÁNDOSE! Quedan solo ${Math.ceil(timeLeftSeconds)} segundos. ¡Corre a la derecha hacia la Nave Estelar!`
                };
            }

            // Advertencia de poca salud
            if (lily.hearts <= 1) {
                return {
                    icon: '⚠️',
                    text: '¡A Lily le queda solo 1 corazón! Salta sobre cajas sorpresa para encontrar caramelos y curarte.'
                };
            }

            // Poderes activos
            if (lily.rocketTimer > 0) {
                const secsLeft = (lily.rocketTimer / 60).toFixed(1);
                return {
                    icon: '🚀',
                    text: `¡Cohete Propulsor activo (${secsLeft}s)! Mantén presionado SALTO (⬆️ / W / Espacio) para volar por los cielos.`
                };
            }

            if (catCompanion.active) {
                return {
                    icon: '🐱',
                    text: '¡Mishi el gatito protector te cuida! Bloquea ataques marcianos y dispara destellos estelares.'
                };
            }

            if (lily.power === 'punch') {
                return {
                    icon: '👊',
                    text: '¡Tienes el Puñito Poderoso! Presiona el botón 👊 (o teclas C / F / V) para noquear a los marcianos.'
                };
            }

            if (lily.power === 'bubble') {
                return {
                    icon: '🫧',
                    text: '¡Poder de Burbuja activo! Presiona 🫧 (o teclas Z / X) para atrapar enemigos en esferas de corazón.'
                };
            }

            if (lily.power === 'bell') {
                return {
                    icon: '🔔',
                    text: '¡Cascabel Mágico activo! Lily corre más rápido y puede realizar un Triple Salto en el aire.'
                };
            }

            // Checkpoint cercano
            if (checkpoint && !checkpoint.reached) {
                const distCp = checkpoint.x - lily.x;
                if (distCp > -20 && distCp < 220) {
                    return {
                        icon: '🚩',
                        text: '¡Bandera de Checkpoint al frente! Tócala para guardar tu avance por si te caes al vacío.'
                    };
                }
            }

            // Cofre sorpresa cercano
            for (let i = 0; i < blocks.length; i++) {
                const b = blocks[i];
                if (!b.used) {
                    const distB = b.x - lily.x;
                    if (distB > -20 && distB < 170) {
                        if (b.content === 'cat') {
                            return {
                                icon: '📦',
                                text: '¡Cofre con el Gatito Protector Mishi! Salta encima o golpéalo por abajo para rescatarlo.'
                            };
                        }
                        if (b.content === 'rocket') {
                            return {
                                icon: '📦',
                                text: '¡Cofre con Cohete Propulsor 🚀! Golpéalo para obtener 5 segundos de vuelo libre.'
                            };
                        }
                        if (b.content === 'punch') {
                            return {
                                icon: '📦',
                                text: '¡Cofre con el Puñito Poderoso 👊! Golpéalo para aprender a boxear contra marcianos.'
                            };
                        }
                        return {
                            icon: '📦',
                            text: '¡Cofre sorpresa cerca! Salta encima de él o dale un cabezazo por abajo para abrirlo.'
                        };
                    }
                }
            }

            // Nube frágil cercana
            for (let i = 0; i < fallingClouds.length; i++) {
                const fc = fallingClouds[i];
                const distFc = fc.x - lily.x;
                if (distFc > -20 && distFc < 160 && fc.respawnTimer === 0) {
                    return {
                        icon: '☁️',
                        text: '¡Cuidado con las nubes moradas! Caen rápidamente tras pisarlas. Salta ágilmente a la siguiente.'
                    };
                }
            }

            // Escalera de emergencia o inestable cercana (Mundo 2)
            for (let i = 0; i < ladders.length; i++) {
                const lad = ladders[i];
                const distLad = lad.x - lily.x;
                if (distLad > -18 && distLad < 130) {
                    if (lad.type === 'falling') {
                        return {
                            icon: '⚠️🪜',
                            text: '¡Cuidado! Esta escalera está desprendida e inestable: ¡caerá y te aplastará si estás cerca o debajo!'
                        };
                    }
                    return {
                        icon: '🪜',
                        text: '¡Escalera de emergencia! Mantén presionado SALTO (⬆️ / W / Espacio) para trepar hasta el techo.'
                    };
                }
            }

            // Techo de casa destruida cercano
            for (let i = 0; i < platforms.length; i++) {
                const p = platforms[i];
                if (p.type === 'rooftop') {
                    const distR = p.x - lily.x;
                    if (distR > -20 && distR < 140) {
                        return {
                            icon: '🏚️',
                            text: '¡Techo de casa destruida! Salta sobre las tejas para evitar caer en los abismos profundos.'
                        };
                    }
                }
            }

            // Enemigo cercano (Hombre enmascarado, Hombre Zombie o Marciano)
            for (let i = 0; i < enemies.length; i++) {
                const en = enemies[i];
                if (!en.happy && !en.defeated) {
                    const distEn = (en.x + en.w / 2) - (lily.x + lily.w / 2);
                    if (distEn > -30 && distEn < 180) {
                        if (en.kind === 'zombie_masked') {
                            return {
                                icon: '🧟',
                                text: '¡Hombre Zombie enmascarado! ¡Te perseguirá a toda velocidad para atraparte! Salta sobre él o usa Puñito 👊 para liberarlo.'
                            };
                        } else if (en.kind === 'masked_man') {
                            return {
                                icon: '🎭',
                                text: '¡Hombre con máscara aterradora! Golpéalo con Puñito 👊 o salta sobre él para romper su máscara y salvarlo.'
                            };
                        }
                        return {
                            icon: '👾',
                            text: '¡Marciano al frente! Salta sobre su cabeza o esquiva sus ataques para proteger tu energía.'
                        };
                    }
                }
            }

            // Mensajes base por nivel
            if (currentLevelIndex === 0) {
                return {
                    icon: '🌙',
                    text: 'Mundo 1-1 (Noche Estelar): Corre hacia la derecha, junta estrellitas (¡50 = 1 vida extra!) y llega a la nave.'
                };
            } else if (currentLevelIndex === 1) {
                return {
                    icon: '🌅',
                    text: 'Mundo 1-2 (Atardecer Cósmico): Cuidado con los meteoritos y salta entre las plataformas con propulsores.'
                };
            } else if (currentLevelIndex === 2) {
                return {
                    icon: '☀️',
                    text: 'Mundo 1-3 (Día de Cristal): ¡Avanza por las nubes polares! Con tu gatito Mishi estarás a salvo de los disparos.'
                };
            } else if (currentLevelIndex === 3) {
                return {
                    icon: '🌑',
                    text: 'Mundo 1-4 (Abismo Tenebroso): Cruza las plataformas sobre el vacío estelar para enfrentar al Rey Marciano.'
                };
            } else if (currentLevelIndex === 4) {
                return {
                    icon: '🏚️',
                    text: 'Mundo 2-1 (Tierra Devastada): ¡La Tierra está en ruinas! Cruza los techos y abismos para rescatar a la humanidad.'
                };
            } else {
                return {
                    icon: '🌇',
                    text: 'Mundo 2-2 (Atardecer Carmesí): Máximo peligro. ¡Hombres zombie, escaleras que caen y apenas hay cofres! ¡Sé ágil y sobrevive!'
                };
            }
        }

        function updateStoryGuide() {
            if (!storyGuideText || !storyGuideIcon) return;
            const guide = getStoryGuideMessage();
            if (guide.text !== lastStoryText) {
                lastStoryText = guide.text;
                storyGuideIcon.textContent = guide.icon;
                storyGuideText.textContent = guide.text;
            }
        }

        /******************************************************************
         * COLLISION, TIMER & GAMEPLAY LOOP
         ******************************************************************/


// Global functions exposed to window for modules
window.getLilySpriteFrame = getLilySpriteFrame;
window.IDLE_TIMELINE = IDLE_TIMELINE;
window.addParticles = addParticles;
window.addFloatingText = addFloatingText;
window.showToast = showToast;
window.updateHUD = updateHUD;
window.killLily = killLily;
window.loseCat = loseCat;

function buildLevel(idx, fromCheckpoint = false, withLanding = false) {
    const game = {
        lily, catCompanion, checkpointSave, audio, addParticles, addFloatingText,
        hudTimerPill, platforms, blocks, thrusterPlatforms, starCandies, powerUps,
        enemies, enemyProjectiles, bubbles, movingPlatforms, fallingClouds,
        nightDrops, bounceClouds, ladders, particles, floatingTexts,
        boss, spaceship, arrivalShip, checkpoint, cameraX, levelWidth,
        timeLeftSeconds, updateHUD
    };

    buildLevelCore(idx, fromCheckpoint, withLanding, game);

    // Sync updated references back to main.js local state
    platforms = game.platforms;
    blocks = game.blocks;
    thrusterPlatforms = game.thrusterPlatforms;
    starCandies = game.starCandies;
    powerUps = game.powerUps;
    enemies = game.enemies;
    enemyProjectiles = game.enemyProjectiles;
    bubbles = game.bubbles;
    movingPlatforms = game.movingPlatforms;
    fallingClouds = game.fallingClouds;
    nightDrops = game.nightDrops;
    bounceClouds = game.bounceClouds;
    ladders = game.ladders;
    particles = game.particles;
    floatingTexts = game.floatingTexts;
    boss = game.boss;
    spaceship = game.spaceship;
    arrivalShip = game.arrivalShip;
    checkpoint = game.checkpoint;
    cameraX = game.cameraX;
    levelWidth = LEVEL_THEMES[idx].levelWidth;
    timeLeftSeconds = game.timeLeftSeconds;

    window.cameraX = cameraX;
    window.boss = boss;
    window.platforms = platforms;
    window.blocks = blocks;
    window.enemies = enemies;
    window.starCandies = starCandies;
    window.powerUps = powerUps;
}

        function startVictoryCelebration() {
            gameState = 'CELEBRATING';
            celebrationTimer = CELEBRATION_FRAMES;
            celebHops = 0;
            celebHopCd = 8;
            enemyProjectiles = [];
            bubbles = [];
            lily.vx = 0;
            lily.power = 'none';
            lily.rocketTimer = 0;
            lily.invincibleTimer = 0;
            lily.punchTimer = 0;
            const c = platforms
                .filter(pl => (pl.type === 'ground' || pl.type === 'cloud_plat') &&
                    lily.x + lily.w > pl.x + 4 && lily.x < pl.x + pl.w - 4 && pl.y >= lily.y + lily.h - 14)
                .sort((a, b) => a.y - b.y);
            celebGroundY = c.length ? c[0].y : null;
            fireworks.rockets = [];
            fireworks.sparks = [];
            showToast('🎉 ¡Derrotaste al Rey Kraken Marciano! 🎆', 4800);
        }


window.startVictoryCelebration = startVictoryCelebration;

        function updateVictoryCelebration() {
            keys.jumpBufferTimer = 0;
            keys.actionJustPressed = false;
            keys.punchPressed = false;
            celebrationTimer--;
            lily.animTimer++;

            // Fuegos artificiales durante los primeros ~4.5 s
            if (celebrationTimer > 30 && celebrationTimer % 14 === 0) {
                launchFirework();
                if (Math.random() < 0.5) launchFirework();
            }
            updateFireworks();

            // Lily salta de alegría (cada 2 saltos, una voltereta)
            if (celebGroundY === null) {
                lily.vy = 0;
                lily.y += Math.sin(globalTick * 0.2) * 1.6;
                lily.rotation = Math.sin(globalTick * 0.2) * 0.25;
            } else {
                lily.vy = Math.min(lily.vy + 0.48, 11.5);
                lily.y += lily.vy;
                if (lily.y + lily.h >= celebGroundY && lily.vy >= 0) {
                    lily.y = celebGroundY - lily.h;
                    lily.vy = 0;
                    lily.onGround = true;
                    lily.rotation = 0;
                    if (celebHopCd > 0) celebHopCd--;
                    else {
                        lily.vy = -10.5;
                        lily.onGround = false;
                        celebHops++;
                        celebHopCd = 5;
                        lily.facing = celebHops % 2 ? 1 : -1;
                        audio.playJump(false);
                        addParticles(lily.x + lily.w / 2, lily.y + lily.h, 6, 'heart', '#ff85c0');
                    }
                } else {
                    lily.onGround = false;
                    if (celebHops % 2 === 0) lily.rotation += 0.143;
                }
            }
            if (celebrationTimer % 9 === 0) {
                addParticles(lily.x + lily.w / 2, lily.y - 6, 4, 'star', FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)]);
            }
            updateParticlesAndTexts();

            if (celebrationTimer <= 0) {
                gameState = 'PLAYING';
                lily.rotation = 0;
                lily.vy = 0;
                lily.facing = 1;
                lily.invincibleTimer = 60;
                audio.startLullaby();
                addFloatingText(lily.x + 18, lily.y - 30, '🚀 ¡A la Nave!', '#ffe58f');
                showToast('🚀 ¡Sube a tu Nave Estelar (a la derecha) para escapar!', 6000);
                updateHUD();
            }
        }

        // 🐙👑 Función para dañar al Boss y hacerlo cada vez más pequeño hasta derrotarlo

        function updateParticlesAndTexts() {
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;
                if (p.life <= 0) particles.splice(i, 1);
            }
            for (let i = floatingTexts.length - 1; i >= 0; i--) {
                const ft = floatingTexts[i];
                ft.y += ft.vy;
                ft.life -= 0.022;
                if (ft.life <= 0) floatingTexts.splice(i, 1);
            }
        }


        function triggerLevelCompletion() {
            if (currentLevelIndex < LEVEL_THEMES.length - 1) {
                // AUTOMATICALLY ADVANCE TO NEXT LEVEL WITHOUT CLICKING ANY MODAL!
                gameState = 'AUTO_NEXT_LEVEL';
                autoNextLevelTimer = 95; // ~1.6 seconds celebration then auto-loads next level
                const nextTheme = LEVEL_THEMES[currentLevelIndex + 1];
                showToast(`🎉 ¡Nivel ${LEVEL_THEMES[currentLevelIndex].id} superado! Pasando automáticamente al Nivel ${nextTheme.id}...`, 2800);
            } else {
                // Final Level 1-3 completed -> Show Grand Victory Modal
                gameState = 'GAME_WIN';
                modalStars.textContent = `🍬 ${lily.stars}`;
                modalScore.textContent = lily.score;
                modalDeaths.textContent = `💀 ${deathCount}`;
                victoryOverlay.classList.remove('hidden');
            }
        }

        /******************************************************************
         * KAWAII ART & CANVAS RENDERING ENGINE
         ******************************************************************/


// Wrap updateGame to sync window variables
const _origUpdateGame =         function() {
            globalTick++;
            const dtGlobal = FIXED_STEP_MS / 1000;
            lily.animTime = (lily.animTime || 0) + dtGlobal;
            if (lily.jumpStartTimer > 0) lily.jumpStartTimer = Math.max(0, lily.jumpStartTimer - dtGlobal);
            if (lily.landTimer > 0) lily.landTimer = Math.max(0, lily.landTimer - dtGlobal);

            const isMovingInIntro = (gameState === 'INTRO_ROOM' && !introRoom.sittingInChair && introRoom.animTimer > 0);
            const isRestingGlobal = (gameState === 'TITLE') ||
                (gameState === 'INTRO_ROOM' && !isMovingInIntro && !introRoom.suctionActive) ||
                (gameState === 'PLAYING' && !lily.landingInProgress && !lily.inSpaceship && Math.abs(lily.vx) <= 0.35 && lily.onGround && (lily.punchTimer || 0) <= 0 && (lily.landTimer || 0) <= 0);

            if (isRestingGlobal) {
                const step = IDLE_TIMELINE[lily.idleStepIndex || 0] || IDLE_TIMELINE[0];
                lily.idleStepTimer = (lily.idleStepTimer || 0) + dtGlobal;
                if (lily.idleStepTimer >= step.duration) {
                    lily.idleStepTimer = 0;
                    lily.idleStepIndex = ((lily.idleStepIndex || 0) + 1) % IDLE_TIMELINE.length;
                }
            } else {
                lily.idleStepIndex = 0;
                lily.idleStepTimer = 0;
            }
            if (globalTick % 8 === 0) updateStoryGuide();
            if (cameraShakeAmount > 0) cameraShakeAmount = Math.max(0, cameraShakeAmount - 0.7);
            if (gameState !== 'CELEBRATING') updateFireworks();
            if (gameState === 'GAME_OVER') {
                gameOverTick++;
                if (gameOverTick > 60 && (keys.jumpBufferTimer > 0 || keys.actionJustPressed)) {
                    keys.jumpBufferTimer = 0;
                    keys.actionJustPressed = false;
                    restartFromLevel1();
                }
                return;
            }

            if (Math.random() < 0.015 && shootingStars.length < 3) {
                spawnShootingStar();
            }
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                s.x += s.vx;
                s.y += s.vy;
                s.alpha -= 0.016;
                if (s.alpha <= 0) shootingStars.splice(i, 1);
            }

            // Actualizar partículas de clima del mundo actual
            const theme = LEVEL_THEMES[currentLevelIndex];
            weatherParticles.forEach(wp => {
                if (theme.weatherType === 'starfall') {
                    wp.y += wp.speedY * 0.45;
                    wp.x += Math.sin(globalTick * 0.03 + wp.phase) * 0.5;
                } else if (theme.weatherType === 'cosmic_rain') {
                    wp.y += wp.speedY * 3.1;
                    wp.x -= 1.6;
                } else if (theme.weatherType === 'dark_ash') {
                    // Ceniza tenebrosa flotando hacia arriba y en diagonal en el Mundo 1-4
                    wp.y -= wp.speedY * 0.65;
                    wp.x += Math.sin(globalTick * 0.04 + wp.phase) * 0.9 - 0.4;
                    if (wp.y < -10) {
                        wp.y = VIEW_H + 10;
                        wp.x = Math.random() * VIEW_W;
                    }
                } else if (theme.weatherType === 'ruined_ash') {
                    // Cenizas grises y ascuas flotando con viento desolado en la Tierra (Mundo 2-1)
                    wp.y += wp.speedY * 0.75;
                    wp.x -= Math.sin(globalTick * 0.03 + wp.phase) * 0.9 + 0.8;
                } else if (theme.weatherType === 'blood_embers') {
                    // Ascuas carmesí incandescentes del atardecer sombrío en Mundo 2-2
                    wp.y += wp.speedY * 1.05;
                    wp.x -= Math.sin(globalTick * 0.04 + wp.phase) * 1.2 + 1.1;
                } else {
                    // crystal_snow (Día de Cristal 1-3)
                    wp.y += wp.speedY * 0.95;
                    wp.x += Math.sin(globalTick * 0.05 + wp.phase) * 1.3 - 0.5;
                }
                if (theme.weatherType !== 'dark_ash' && wp.y > VIEW_H + 10) {
                    wp.y = -10;
                    wp.x = Math.random() * VIEW_W;
                }
                if (wp.x < -10) wp.x = VIEW_W + 10;
                if (wp.x > VIEW_W + 10) wp.x = -10;
            });

            if (lightningFlash > 0) lightningFlash--;
            if (theme.timeOfDay === 'dark_boss' && gameState === 'PLAYING' && Math.random() < 0.005) {
                lightningFlash = 10;
            }

            if (gameState === 'INTRO_ROOM') {
                updateIntroRoom();
                return;
            }

            if (gameState === 'AUTO_NEXT_LEVEL') {
                autoNextLevelTimer--;
                updateParticlesAndTexts();
                if (autoNextLevelTimer <= 0) {
                    currentLevelIndex++;
                    buildLevel(currentLevelIndex, false, true); // 🛸 Aterriza en su Nave Estelar al llegar al nuevo mundo
                    gameState = 'PLAYING';
                    const newTheme = LEVEL_THEMES[currentLevelIndex];
                    showToast(`🛸 ¡Aterrizando en ${newTheme.id}: ${newTheme.name} (${newTheme.weatherLabel})!`, 4000);
                }
                return;
            }

            // 💀 Animación de muerte: Lily sale disparada, gira y cae; después reaparece
            if (gameState === 'CELEBRATING') {
                updateVictoryCelebration();
                return;
            }

            if (gameState === 'DYING') {
                keys.jumpBufferTimer = 0;
                keys.actionJustPressed = false;
                deathInfo.timer--;
                if (deathInfo.cause !== 'fall') {
                    lily.vy = Math.min(lily.vy + 0.5, 12);
                    lily.y += lily.vy;
                    lily.rotation += 0.3;
                    if (globalTick % 3 === 0) {
                        addParticles(lily.x + lily.w / 2, lily.y + lily.h / 2, 2, 'star', '#ffc2e2');
                    }
                }
                updateParticlesAndTexts();
                if (deathInfo.timer <= 0) respawnAfterDeath();
                return;
            }

            if (gameState !== 'PLAYING') {
                keys.jumpBufferTimer = 0;
                keys.actionJustPressed = false;
                return;
            }

            // 🛸 Secuencia de aterrizaje de la Nave Estelar al comenzar el nivel
            if (lily.landingInProgress && arrivalShip) {
                if (arrivalShip.state === 'descending') {
                    const dist = arrivalShip.targetY - arrivalShip.y;
                    arrivalShip.vy = Math.max(1.4, Math.min(5.6, dist * 0.075));
                    arrivalShip.y += arrivalShip.vy;
                    lily.x = arrivalShip.x + arrivalShip.w / 2 - lily.w / 2;
                    lily.y = arrivalShip.y + 30;

                    if (globalTick % 2 === 0) {
                        addParticles(arrivalShip.x + arrivalShip.w / 2 + (Math.random() * 36 - 18), arrivalShip.y + arrivalShip.h + 2, 3, 'star', '#ffe58f');
                    }

                    if (arrivalShip.y >= arrivalShip.targetY - 1) {
                        arrivalShip.y = arrivalShip.targetY;
                        arrivalShip.state = 'opening';
                        arrivalShip.timer = 26;
                        addParticles(arrivalShip.x + arrivalShip.w / 2, arrivalShip.y + arrivalShip.h, 18, 'sparkle', '#ffc2e2');
                        addFloatingText(arrivalShip.x + arrivalShip.w / 2, arrivalShip.y - 12, '🛸 ¡Aterrizaje Exitoso!', '#ffe58f');
                    }
                } else if (arrivalShip.state === 'opening') {
                    arrivalShip.timer--;
                    if (arrivalShip.timer <= 0) {
                        arrivalShip.state = 'parked';
                        lily.landingInProgress = false;
                        lily.x = arrivalShip.x + arrivalShip.w - 6;
                        lily.y = arrivalShip.y + 36;
                        lily.vx = 2.8;
                        lily.vy = -6.8;
                        lily.onGround = false;
                        audio.playJump(true);
                        addParticles(lily.x + 18, lily.y + 20, 14, 'heart', '#ff85c0');
                    }
                }
                updateParticlesAndTexts();
                return;
            }

            // ⏱️ Cuenta regresiva: se detiene cuando Lily ya subió a la Nave Estelar
            if (!lily.inSpaceship) {
                const secondBefore = Math.ceil(timeLeftSeconds);
                timeLeftSeconds = Math.max(0, timeLeftSeconds - FIXED_STEP_MS / 1000);
                if (Math.ceil(timeLeftSeconds) !== secondBefore) {
                    if (timeLeftSeconds <= 20 && timeLeftSeconds > 0) audio.playTimerTick();
                    updateHUD();
                }
                if (timeLeftSeconds <= 0) {
                    killLily('timeout');   // vuelve al INICIO del nivel actual
                    return;
                }
            }

            if (lily.invincibleTimer > 0) lily.invincibleTimer--;
            if (lily.bubbleCooldown > 0) lily.bubbleCooldown--;
            if (keys.jumpBufferTimer > 0) keys.jumpBufferTimer--;
            lily.earTwitchTimer++;

            // 🚀 Actualizar temporizador del Cohete Propulsor (5 segundos = 300 frames)
            if (lily.rocketTimer > 0) {
                lily.rocketTimer--;
                if (lily.rocketTimer % 6 === 0 || lily.rocketTimer === 0) {
                    updateHUD();
                }
                if (lily.rocketTimer === 0) {
                    addFloatingText(lily.x + 18, lily.y - 12, '🚀 ¡Fin del combustible!', '#ffc2e2');
                }
            }

            // 🚀 Secuencia de abordaje y despegue en la Nave Estelar hacia el siguiente nivel
            if (lily.inSpaceship && spaceship) {
                spaceship.boardingTimer++;
                if (spaceship.boardingTimer < 26) {
                    // Cúpula cerrándose y motores calentando con chispas
                    spaceship.y = spaceship.baseY + Math.sin(globalTick * 0.8) * 1.5;
                    if (globalTick % 2 === 0) {
                        addParticles(spaceship.x + spaceship.w / 2 + (Math.random() * 44 - 22), spaceship.y + spaceship.h - 6, 3, 'sparkle', '#ffe58f');
                    }
                } else {
                    // ¡Despegue vertical hacia las estrellas!
                    spaceship.launching = true;
                    spaceship.vy = Math.max(spaceship.vy - 0.38, -11.5);
                    spaceship.y += spaceship.vy;

                    if (globalTick % 2 === 0) {
                        addParticles(spaceship.x + spaceship.w / 2 + (Math.random() * 34 - 17), spaceship.y + spaceship.h + 4, 4, 'star', '#ffe58f');
                        addParticles(spaceship.x + spaceship.w / 2 + (Math.random() * 26 - 13), spaceship.y + spaceship.h + 10, 3, 'heart', '#ff85c0');
                    }
                }

                // Mantener a Lily dentro de la cabina de cristal de la nave
                lily.x = spaceship.x + spaceship.w / 2 - lily.w / 2;
                lily.y = spaceship.y + 30;

                if (spaceship.y + spaceship.h < -50) {
                    triggerLevelCompletion();
                }
                updateParticlesAndTexts();
                return;
            }

            // 1. Update Moving Platforms & Floating Thruster Platforms
            movingPlatforms.forEach(mp => {
                mp.x += mp.vx;
                if (mp.vx !== 0 && (mp.x < mp.minX || mp.x > mp.maxX)) mp.vx *= -1;
                mp.y += mp.vy;
                if (mp.vy !== 0 && (mp.y < mp.minY || mp.y > mp.maxY)) mp.vy *= -1;
            });

            // Suave oscilación de las plataformas con fuego propulsor
            thrusterPlatforms.forEach(tp => {
                tp.prevY = tp.y;
                tp.y = tp.baseY + Math.sin(globalTick * 0.06 + tp.phase) * 3.5;
                tp.vy = tp.y - tp.prevY;
            });

            // Update Ephemeral Falling Clouds (Level 2 & 3)
            fallingClouds.forEach(fc => {
                if (fc.respawnTimer > 0) {
                    fc.respawnTimer--;
                    if (fc.respawnTimer === 0) {
                        fc.y = fc.baseY;
                        fc.vy = 0;
                        fc.triggered = false;
                        fc.shakeTimer = 0;
                    }
                } else if (fc.triggered) {
                    if (fc.shakeTimer > 0) {
                        fc.shakeTimer--;
                    } else {
                        fc.vy = Math.min(fc.vy + 0.38, 7.5);
                        fc.y += fc.vy;
                        if (fc.y > VIEW_H + 60) {
                            fc.respawnTimer = 150;
                        }
                    }
                }
            });

            // 2. Horizontal Movement
            const moveAccel = lily.onGround ? 0.65 : (lily.rocketTimer > 0 ? 0.62 : 0.48);
            const maxSpeed = lily.rocketTimer > 0 ? 5.8 : (lily.power === 'bell' ? 5.15 : 4.55);
            if (keys.left) {
                lily.vx = Math.max(lily.vx - moveAccel, -maxSpeed);
                lily.facing = -1;
            } else if (keys.right) {
                lily.vx = Math.min(lily.vx + moveAccel, maxSpeed);
                lily.facing = 1;
            } else {
                lily.vx *= lily.onGround ? 0.80 : 0.90;
                if (Math.abs(lily.vx) < 0.08) lily.vx = 0;
            }

            const targetSway = -lily.vx * 1.6 + (lily.vy * 0.35);
            lily.hairSway += (targetSway - lily.hairSway) * 0.2;

            if (Math.abs(lily.vx) > 0.35 && lily.onGround) {
                lily.animTimer += Math.abs(lily.vx) * 0.085;
                if (globalTick % 9 === 0) {
                    addParticles(lily.x + (lily.facing === 1 ? 6 : lily.w - 6), lily.y + lily.h - 2, 1, 'sparkle', '#ffc2e2');
                }
            } else {
                lily.animTimer = 0;
            }

            // 3. Horizontal Collisions
            const prevBottom = lily.y + lily.h;
            const prevX = lily.x;
            lily.x += lily.vx;
            if (lily.x < 0) {
                lily.x = 0;
                lily.vx = 0;
            }

            const hBoxY = lily.y + 3;
            const hBoxH = lily.h - 6;

            for (let i = 0; i < platforms.length; i++) {
                const obs = platforms[i];
                if (obs.type !== 'ground' && obs.type !== 'rooftop') continue;
                if (prevBottom <= obs.y + 6) continue;
                if (hBoxY < obs.y + obs.h && hBoxY + hBoxH > obs.y) {
                    if (lily.vx > 0 && prevX + lily.w <= obs.x + 8 && lily.x + lily.w > obs.x) {
                        lily.x = obs.x - lily.w;
                        lily.vx = 0;
                    } else if (lily.vx < 0 && prevX >= obs.x + obs.w - 8 && lily.x < obs.x + obs.w) {
                        lily.x = obs.x + obs.w;
                        lily.vx = 0;
                    }
                }
            }

            for (let i = 0; i < blocks.length; i++) {
                const obs = blocks[i];
                if (prevBottom <= obs.y + 6) continue;
                if (hBoxY < obs.y + obs.h && hBoxY + hBoxH > obs.y) {
                    if (lily.vx > 0 && prevX + lily.w <= obs.x + 8 && lily.x + lily.w > obs.x) {
                        lily.x = obs.x - lily.w;
                        lily.vx = 0;
                        if (!obs.used) openSurpriseBox(obs);
                    } else if (lily.vx < 0 && prevX >= obs.x + obs.w - 8 && lily.x < obs.x + obs.w) {
                        lily.x = obs.x + obs.w;
                        lily.vx = 0;
                        if (!obs.used) openSurpriseBox(obs);
                    }
                }
            }

            // 🪜 Escaleras de emergencia y Escaleras Inestables que colapsan (Mundo 2)
            let onLadder = false;
            for (let i = 0; i < ladders.length; i++) {
                const lad = ladders[i];

                // Fisiología y colapso de escaleras inestables (Mundo 2-2)
                if (lad.type === 'falling') {
                    if (lad.state === 'idle') {
                        // Se activa si Lily se acerca horizontalmente y está en su rango vertical
                        const distLadX = Math.abs((lily.x + lily.w / 2) - (lad.x + lad.w / 2));
                        const inLadY = (lily.y + lily.h >= lad.topY - 30) && (lily.y <= lad.targetGroundY + 50);
                        if (distLadX < 95 && inLadY) {
                            lad.state = 'shaking';
                            lad.shakeTimer = 28;
                            audio.playLadderCreak();
                            addFloatingText(lad.x + lad.w / 2, lad.topY - 18, '⚠️ ¡ESCALERA INESTABLE!', '#ff4d4f');
                        }
                    } else if (lad.state === 'shaking') {
                        lad.shakeTimer--;
                        if (lad.shakeTimer % 4 === 0) {
                            addParticles(lad.x + Math.random() * lad.w, lad.topY + Math.random() * 20, 2, 'sparkle', '#ffa940');
                        }
                        if (lad.shakeTimer <= 0) {
                            lad.state = 'falling';
                            lad.vy = 2.4;
                            audio.playLadderCreak();
                        }
                    } else if (lad.state === 'falling') {
                        lad.vy = Math.min(lad.vy + 0.65, 14.5);
                        lad.topY += lad.vy;
                        lad.bottomY += lad.vy;
                        if (globalTick % 3 === 0) {
                            addParticles(lad.x + lad.w / 2, lad.topY, 2, 'star', '#ff7875');
                        }

                        // ¡Causa daño a Lily si la escalera cae encima de ella!
                        if (!lad.damagedLily && lily.invincibleTimer === 0) {
                            const ladBox = { x: lad.x - 4, y: lad.topY, w: lad.w + 8, h: lad.bottomY - lad.topY };
                            if (lily.x + lily.w > ladBox.x && lily.x < ladBox.x + ladBox.w &&
                                lily.y + lily.h > ladBox.y && lily.y < ladBox.y + ladBox.h) {
                                lad.damagedLily = true;
                                audio.playLadderCrash();
                                hurtLily({ kind: 'falling_ladder' }, 1);
                                shakeCamera(16);
                                lily.vy = 4; // Golpe hacia abajo
                            }
                        }

                        // Colisión con el piso: la escalera se estrella y colapsa
                        if (lad.bottomY >= lad.targetGroundY) {
                            lad.bottomY = lad.targetGroundY;
                            lad.topY = lad.targetGroundY - 26; // Queda deformada en el suelo
                            lad.state = 'fallen';
                            lad.vy = 0;
                            audio.playLadderCrash();
                            shakeCamera(12);
                            addParticles(lad.x + lad.w / 2, lad.targetGroundY, 14, 'sparkle', '#dcdde1');
                        }
                    }
                }

                // Trepar: Lily solo puede trepar si la escalera NO está cayendo ni destruida en el piso
                if (lad.state !== 'falling' && lad.state !== 'fallen') {
                    if (lily.x + lily.w > lad.x + 2 && lily.x < lad.x + lad.w - 2) {
                        if (lily.y + lily.h >= lad.topY - 8 && lily.y <= lad.bottomY + 12) {
                            onLadder = true;
                        }
                    }
                }
            }

            // 4. Gravity & Vertical Collisions (o Vuelo con Cohete Propulsor 🚀 / Trepar Escalera 🪜)
            if (lily.rocketTimer > 0) {
                if (keys.jumpHeld) {
                    lily.vy = Math.max(lily.vy - 0.85, -6.2);
                    if (globalTick % 2 === 0) {
                        addParticles(lily.x + lily.w / 2, lily.y + lily.h, 2, 'star', '#ffe58f');
                    }
                } else {
                    lily.vy = Math.min(lily.vy + 0.28, 4.5);
                }
            } else if (onLadder) {
                if (keys.jumpHeld) {
                    lily.vy = -3.4;
                    lily.onGround = false;
                    if (globalTick % 12 === 0) {
                        audio.playJump(false);
                        addParticles(lily.x + lily.w / 2, lily.y + lily.h, 1, 'sparkle', '#ffe58f');
                    }
                } else if (!lily.onGround && lily.vy > 0) {
                    lily.vy = 0.4; // Agarre a los peldaños de la escalera
                } else {
                    lily.vy = Math.min(lily.vy + 0.48, 11.5);
                }
            } else {
                lily.vy = Math.min(lily.vy + 0.48, 11.5);
            }
            lily.y += lily.vy;
            if (lily.y < 10) {
                lily.y = 10;
                lily.vy = 0;
            }

            let landedThisFrame = false;

            for (let i = 0; i < platforms.length; i++) {
                const obs = platforms[i];
                if (obs.type !== 'ground' && obs.type !== 'rooftop') continue;
                if ((lily.x + lily.w - 2 > obs.x) && (lily.x + 2 < obs.x + obs.w) && (lily.y < obs.y + obs.h) && (lily.y + lily.h > obs.y)) {
                    if (lily.vy >= 0 && prevBottom <= obs.y + 14) {
                        lily.y = obs.y - lily.h;
                        lily.vy = 0;
                        landedThisFrame = true;
                    } else if (lily.vy < 0 && prevBottom > obs.y + obs.h) {
                        lily.y = obs.y + obs.h;
                        lily.vy = 0;
                    }
                }
            }

            for (let i = 0; i < blocks.length; i++) {
                const obs = blocks[i];
                if ((lily.x + lily.w - 2 > obs.x) && (lily.x + 2 < obs.x + obs.w) && (lily.y < obs.y + obs.h) && (lily.y + lily.h > obs.y)) {
                    if (lily.vy >= 0 && prevBottom <= obs.y + 14) {
                        lily.y = obs.y - lily.h;
                        lily.vy = 0;
                        landedThisFrame = true;
                        if (!obs.used) {
                            openSurpriseBox(obs);
                        }
                    } else if (lily.vy < 0 && prevBottom > obs.y + obs.h) {
                        lily.y = obs.y + obs.h;
                        lily.vy = 0;
                        if (!obs.used) {
                            openSurpriseBox(obs);
                        } else {
                            obs.bounceY = -6;
                            audio.playBlockPop();
                            addParticles(obs.x + 21, obs.y, 4, 'sparkle');
                        }
                    }
                }
            }

            // One-way Platforms, Thruster Platforms, Moving Platforms & Ephemeral Falling Clouds
            const checkOneWay = (plat, isMoving, isThruster, isFalling) => {
                if (
                    lily.vy >= 0 &&
                    prevBottom <= plat.y + 16 &&
                    lily.x + lily.w - 3 > plat.x &&
                    lily.x + 3 < plat.x + plat.w &&
                    lily.y + lily.h >= plat.y &&
                    lily.y + lily.h <= plat.y + plat.h + 16
                ) {
                    lily.y = plat.y - lily.h;
                    lily.vy = 0;
                    landedThisFrame = true;
                    if (isMoving) {
                        lily.x += plat.vx;
                        lily.y += plat.vy;
                    } else if (isThruster) {
                        lily.y += plat.vy || 0;
                    }
                    if (isFalling && !plat.triggered) {
                        plat.triggered = true;
                        plat.shakeTimer = 22;
                        addParticles(plat.x + plat.w / 2, plat.y, 5, 'sparkle', '#ffe58f');
                    }
                    return true;
                }
                return false;
            };

            for (let i = 0; i < platforms.length; i++) {
                if (platforms[i].type === 'cloud_plat') checkOneWay(platforms[i], false, false, false);
            }
            for (let i = 0; i < thrusterPlatforms.length; i++) {
                checkOneWay(thrusterPlatforms[i], false, true, false);
            }
            for (let i = 0; i < movingPlatforms.length; i++) {
                checkOneWay(movingPlatforms[i], true, false, false);
            }
            for (let i = 0; i < fallingClouds.length; i++) {
                const fc = fallingClouds[i];
                if (fc.respawnTimer === 0 && fc.y < VIEW_H) {
                    checkOneWay(fc, false, false, true);
                }
            }

            // Ground probe for stable standing
            if (!landedThisFrame && lily.vy >= 0) {
                const footProbeY = lily.y + lily.h + 2;
                const probeObs = (obs) => {
                    if (
                        lily.x + lily.w - 3 > obs.x &&
                        lily.x + 3 < obs.x + obs.w &&
                        footProbeY >= obs.y &&
                        prevBottom <= obs.y + 8
                    ) {
                        lily.y = obs.y - lily.h;
                        lily.vy = 0;
                        landedThisFrame = true;
                        return true;
                    }
                    return false;
                };

                let probed = false;
                for (let i = 0; i < platforms.length; i++) {
                    if (probeObs(platforms[i])) { probed = true; break; }
                }
                if (!probed) {
                    for (let i = 0; i < blocks.length; i++) {
                        if (probeObs(blocks[i])) { probed = true; break; }
                    }
                }
                if (!probed) {
                    for (let i = 0; i < thrusterPlatforms.length; i++) {
                        if (probeObs(thrusterPlatforms[i])) { probed = true; break; }
                    }
                }
                if (!probed) {
                    for (let i = 0; i < movingPlatforms.length; i++) {
                        if (probeObs(movingPlatforms[i])) { probed = true; break; }
                    }
                }
                if (!probed) {
                    for (let i = 0; i < fallingClouds.length; i++) {
                        const fc = fallingClouds[i];
                        if (fc.respawnTimer === 0 && fc.y < VIEW_H) {
                            if (probeObs(fc)) { probed = true; break; }
                        }
                    }
                }
            }

            if (landedThisFrame) {
                if (!lily.wasOnGround) {
                    lily.landTimer = 0.10;
                }
                lily.wasOnGround = true;
                lily.onGround = true;
                lily.coyoteTimer = 8;
                lily.airJumpsLeft = lily.power === 'bell' ? 2 : 1;
            } else {
                lily.wasOnGround = false;
                lily.onGround = false;
                if (lily.coyoteTimer > 0) lily.coyoteTimer--;
            }

            // 5. Execute Jump
            if (keys.jumpBufferTimer > 0) {
                lily.jumpStartTimer = 0.08;
                lily.idleStepIndex = 0;
                lily.idleStepTimer = 0;
                if (lily.coyoteTimer > 0) {
                    lily.vy = lily.power === 'bell' ? -12.6 : -11.6;
                    lily.onGround = false;
                    lily.coyoteTimer = 0;
                    keys.jumpBufferTimer = 0;
                    audio.playJump(false);
                    addParticles(lily.x + lily.w / 2, lily.y + lily.h, 9, 'star');
                } else if (lily.airJumpsLeft > 0) {
                    lily.vy = lily.power === 'bell' ? -11.4 : -10.4;
                    lily.airJumpsLeft--;
                    keys.jumpBufferTimer = 0;
                    audio.playJump(true);
                    addParticles(lily.x + lily.w / 2, lily.y + lily.h, 12, 'star', '#ffe58f');
                    addParticles(lily.x + lily.w / 2, lily.y + lily.h, 6, 'heart', '#ff85c0');
                    addFloatingText(lily.x + lily.w / 2, lily.y + lily.h, '✨ ¡Salto Estelar!', '#ffe58f');
                }
            }

            if (!keys.jumpHeld && lily.vy < -4.2) {
                lily.vy *= 0.86;
            }

            // 👊 Puñetazo de Lily (tecla C / F / V o botón 👊)
            if (lily.punchTimer > 0) lily.punchTimer--;
            if (lily.punchCooldown > 0) lily.punchCooldown--;
            if (keys.punchPressed) {
                keys.punchPressed = false;
                if (lily.power !== 'punch') {
                    if (globalTick - (lily.lastPunchHint || -999) > 240) {
                        lily.lastPunchHint = globalTick;
                        showToast('👊 Busca el poder del Puñito dentro de los cofres', 2400);
                    }
                } else if (lily.punchCooldown <= 0 && !lily.inSpaceship && !lily.landingInProgress) {
                    lily.punchTimer = 17;
                    lily.idleStepIndex = 0;
                    lily.idleStepTimer = 0;
                    lily.punchCooldown = 24;
                    audio.playBubble();
                }
            }
            if (lily.punchTimer > 3 && lily.punchTimer < 12) {
                const fx = lily.facing === 1 ? lily.x + lily.w - 2 : lily.x - 48;
                const fist = { x: fx, y: lily.y + 6, w: 50, h: 32 };
                if (boss && boss.active && !boss.defeated) {
                    const bx = Math.max(fist.x, Math.min(boss.x, fist.x + fist.w));
                    const by = Math.max(fist.y, Math.min(boss.y, fist.y + fist.h));
                    if (Math.hypot(boss.x - bx, boss.y - by) < 56 * boss.scale && boss.hurtTimer <= 8) {
                        damageBoss(1.5, '👊 ¡Puñetazo!');
                        lily.vx = -lily.facing * 3;
                        lily.punchTimer = 3;
                    }
                }
                for (const en of enemies) {
                    if (!en.happy && aabb(fist, en)) {
                        befriendEnemy(en);
                        addFloatingText(en.x + en.w / 2, en.y - 12, '👊 ¡Pum!', '#ffe58f');
                    }
                }
            }

            if (keys.actionJustPressed) {
                shootSweetBubble();
                keys.actionJustPressed = false;
            }

            if (!lily.onGround && globalTick % 5 === 0) {
                addParticles(
                    lily.x + lily.w / 2 + (Math.random() * 12 - 6),
                    lily.y + lily.h - 6,
                    1,
                    Math.random() < 0.5 ? 'star' : 'heart',
                    lily.power === 'bell' ? '#ffe58f' : '#ffc2e2'
                );
            }

            // Bouncy Jelly Clouds
            for (const bc of bounceClouds) {
                if (bc.bounceAnim > 0) bc.bounceAnim -= 0.1;
                if (
                    lily.vy >= 0 &&
                    lily.x + lily.w > bc.x &&
                    lily.x < bc.x + bc.w &&
                    lily.y + lily.h >= bc.y &&
                    lily.y + lily.h <= bc.y + bc.h + 14
                ) {
                    lily.y = bc.y - lily.h;
                    lily.vy = -14.2;
                    lily.onGround = false;
                    lily.airJumpsLeft = lily.power === 'bell' ? 2 : 1;
                    bc.bounceAnim = 1;
                    audio.playJump(true);
                    addParticles(bc.x + bc.w / 2, bc.y, 12, 'heart', '#ff85c0');
                    addFloatingText(bc.x + bc.w / 2, bc.y - 10, '¡Boing! ☁️💖', '#ffc2e2');
                }
            }

            // Caer al vacío estelar = muerte (+1 💀): vuelve al checkpoint o al inicio del nivel
            if (lily.y > VIEW_H + 55) {
                killLily('fall');
                return;
            }

            blocks.forEach(b => {
                if (b.bounceY < 0) b.bounceY = Math.min(0, b.bounceY + 1.5);
                if (b.used && b.openProgress < 1) {
                    b.openProgress = Math.min(1, b.openProgress + 0.12);
                }
            });

            // Star Candies
            starCandies.forEach(sc => {
                if (!sc.collected) {
                    const dx = (lily.x + lily.w / 2) - sc.x;
                    const dy = (lily.y + lily.h / 2) - sc.y;
                    if (Math.hypot(dx, dy) < sc.r + 22) {
                        sc.collected = true;
                        lily.stars++;
                        lily.score += 100;
                        audio.playStarCandy();
                        addParticles(sc.x, sc.y, 8, 'star');
                        addFloatingText(sc.x, sc.y - 10, '+100 ⭐', '#ffe58f');
                        checkExtraHeart();
                        updateHUD();
                    }
                }
            });

            // Power-Ups
            for (let i = powerUps.length - 1; i >= 0; i--) {
                const pu = powerUps[i];
                pu.vy = Math.min(pu.vy + 0.35, 6);
                pu.x += pu.vx;
                pu.y += pu.vy;

                for (let j = 0; j < platforms.length; j++) {
                    const obs = platforms[j];
                    if (obs.type !== 'ground') continue;
                    if (aabb(pu, obs)) {
                        if (pu.vy > 0 && pu.y + pu.h - pu.vy <= obs.y + 8) {
                            pu.y = obs.y - pu.h;
                            pu.vy = 0;
                        } else {
                            pu.vx *= -1;
                        }
                    }
                }
                for (let j = 0; j < blocks.length; j++) {
                    const obs = blocks[j];
                    if (aabb(pu, obs)) {
                        if (pu.vy > 0 && pu.y + pu.h - pu.vy <= obs.y + 8) {
                            pu.y = obs.y - pu.h;
                            pu.vy = 0;
                        } else {
                            pu.vx *= -1;
                        }
                    }
                }

                if (aabb(lily, pu)) {
                    if (pu.kind === 'cat') {
                        // 🐱 ¡Lily rescata a su Gatito Compañero Protector!
                        lily.hasCatCompanion = true;
                        catCompanion.active = true;
                        catCompanion.x = lily.x - 32;
                        catCompanion.y = lily.y - 12;
                        lily.score += 1000;
                        audio.playCatMeow();
                        audio.playPowerUp();
                        addParticles(pu.x + 16, pu.y + 16, 24, 'heart', '#ff85c0');
                        addParticles(pu.x + 16, pu.y + 16, 18, 'star', '#ffe58f');
                        addFloatingText(lily.x + 18, lily.y - 22, '🐱✨ ¡GATITO PROTECTOR UNIDO!', '#ffe58f');
                        showToast('🐱💖 ¡Michi Estelar ahora te acompaña! Te protegerá atacando marcianos y bloqueando disparos ✨', 4200);
                    } else if (pu.kind === 'rocket') {
                        lily.rocketTimer = 300; // 🚀 5 segundos exactos (300 frames a 60fps)
                        lily.vy = -6.2;
                        lily.onGround = false;
                        lily.score += 750;
                        audio.playRocketActivate();
                        addParticles(pu.x + 16, pu.y + 16, 22, 'star', '#ffe58f');
                        addFloatingText(lily.x + 18, lily.y - 18, '🚀 ¡COHETE PROPULSOR! (5s de Vuelo)', '#ffe58f');
                        showToast('🚀 ¡Cohete activado! Mantén Saltar (⬆️ / Espacio) para volar por 5 segundos ✨', 3400);
                    } else {
                        lily.power = pu.kind;
                        lily.airJumpsLeft = pu.kind === 'bell' ? 2 : 1;
                        lily.score += 500;
                        audio.playPowerUp();
                        addParticles(pu.x + 16, pu.y + 16, 16, 'star');
                        const label = pu.kind === 'bell' ? '🔔 ¡Cascabel Mágico!' : (pu.kind === 'punch' ? '👊 ¡PUÑITO PODEROSO! (C / F / V)' : '🫧 ¡Flor de Burbuja!');
                        addFloatingText(lily.x + 18, lily.y - 15, label, '#ffe58f');
                    }
                    powerUps.splice(i, 1);
                    updateHUD();
                }
            }

            // 🐱 Actualizar Gatito Compañero Protector (sigue a Lily, bloquea balas y dispara estrellitas)
            if (catCompanion.active) {
                const targetCatX = lily.x + (lily.facing === 1 ? -34 : lily.w + 14);
                const targetCatY = lily.y - 10 + Math.sin(globalTick * 0.12) * 6;
                catCompanion.x += (targetCatX - catCompanion.x) * 0.18;
                catCompanion.y += (targetCatY - catCompanion.y) * 0.18;
                catCompanion.facing = lily.facing;

                if (catCompanion.attackCooldown > 0) catCompanion.attackCooldown--;
                if (catCompanion.shieldCooldown > 0) catCompanion.shieldCooldown--;

                // 1) Escudo felino: destruye proyectiles enemigos que se acerquen demasiado a Lily
                for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                    const ep = enemyProjectiles[i];
                    const distToLily = Math.hypot((lily.x + lily.w / 2) - ep.x, (lily.y + lily.h / 2) - ep.y);
                    if (distToLily < 68 && catCompanion.shieldCooldown === 0) {
                        catCompanion.shieldCooldown = 70;
                        addParticles(ep.x, ep.y, 10, 'star', '#ffe58f');
                        addFloatingText(catCompanion.x, catCompanion.y - 14, '🐾 ¡Escudo Michi!', '#b5f5ec');
                        audio.playStarShimmer();
                        enemyProjectiles.splice(i, 1);
                        break;
                    }
                }

                // 2) Ataque automático del gatito contra marcianos cercanos o contra el Boss
                if (catCompanion.attackCooldown === 0) {
                    let target = null;
                    let bestDist = 340;
                    for (const en of enemies) {
                        if (!en.happy) {
                            const d = Math.hypot((en.x + en.w / 2) - catCompanion.x, (en.y + en.h / 2) - catCompanion.y);
                            if (d < bestDist) {
                                bestDist = d;
                                target = { x: en.x + en.w / 2, y: en.y + en.h / 2 };
                            }
                        }
                    }
                    if (!target && boss && boss.active && !boss.defeated) {
                        const dBoss = Math.hypot(boss.x - catCompanion.x, boss.y - catCompanion.y);
                        if (dBoss < 460) {
                            target = { x: boss.x, y: boss.y };
                        }
                    }
                    if (target) {
                        const ang = Math.atan2(target.y - catCompanion.y, target.x - catCompanion.x);
                        catCompanion.projectiles.push({
                            x: catCompanion.x,
                            y: catCompanion.y,
                            vx: Math.cos(ang) * 7.2,
                            vy: Math.sin(ang) * 7.2,
                            life: 65
                        });
                        catCompanion.attackCooldown = 68;
                    }
                }

                // Actualizar proyectiles estelares del gatito
                for (let i = catCompanion.projectiles.length - 1; i >= 0; i--) {
                    const cp = catCompanion.projectiles[i];
                    cp.x += cp.vx;
                    cp.y += cp.vy;
                    cp.life--;

                    let hit = false;
                    for (const en of enemies) {
                        if (!en.happy && Math.hypot(cp.x - (en.x + en.w / 2), cp.y - (en.y + en.h / 2)) < 26) {
                            befriendEnemy(en);
                            hit = true;
                            break;
                        }
                    }
                    if (!hit && boss && boss.active && !boss.defeated) {
                        const bossRadius = 56 * boss.scale;
                        if (Math.hypot(cp.x - boss.x, cp.y - boss.y) < bossRadius) {
                            damageBoss(1, '🐾 ¡Garra Estelar!');
                            hit = true;
                        }
                    }
                    if (hit || cp.life <= 0) {
                        addParticles(cp.x, cp.y, 4, 'star', '#ffe58f');
                        catCompanion.projectiles.splice(i, 1);
                    }
                }
            }

            // Bubbles (Burbujas de Corazón de Lily: derrotan marcianos y encogen al Boss)
            for (let i = bubbles.length - 1; i >= 0; i--) {
                const b = bubbles[i];
                b.x += b.vx;
                b.y += Math.sin(globalTick * 0.2 + i) * 0.8 + b.vy;
                b.life--;

                for (const en of enemies) {
                    if (!en.happy) {
                        const dx = b.x - (en.x + en.w / 2);
                        const dy = b.y - (en.y + en.h / 2);
                        if (Math.hypot(dx, dy) < b.r + 22) {
                            befriendEnemy(en);
                            b.life = 0;
                            break;
                        }
                    }
                }

                // Impacto de Burbuja de Corazón contra el Boss del Mundo 1-4
                if (b.life > 0 && boss && boss.active && !boss.defeated) {
                    const bossRadius = 58 * boss.scale;
                    if (Math.hypot(b.x - boss.x, b.y - boss.y) < b.r + bossRadius) {
                        damageBoss(lily.power === 'bubble' ? 1.5 : 1, '💖 ¡Burbuja de Corazón!');
                        b.life = 0;
                    }
                }

                if (b.life <= 0) {
                    addParticles(b.x, b.y, 4, 'sparkle', '#ffc2e2');
                    bubbles.splice(i, 1);
                }
            }

            // 👽 Marcianos y Extraterrestres que golpean y (desde Nivel 2) disparan a Lily
            enemies.forEach(en => {
                if (en.happy) {
                    en.y -= 1.8;
                    en.happyTimer++;
                    return;
                }
                if (en.punchTimer > 0) en.punchTimer--;

                // En Niveles 2 y 3 los marcianos son más agresivos; en Mundo 2-2 los Hombres Zombie persiguen activamente a Lily
                const isAggressiveWorld = currentLevelIndex >= 1;
                const isZombie = en.kind === 'zombie_masked';
                const dxLily = (lily.x + lily.w / 2) - (en.x + en.w / 2);
                const dyLily = (lily.y + lily.h / 2) - (en.y + en.h / 2);
                const distToLily = Math.hypot(dxLily, dyLily);

                if (isZombie) {
                    // 🧟 IA del Hombre Zombie: Acecha y persigue implacablemente a Lily cuando la detecta
                    if (Math.abs(dxLily) < 460 && Math.abs(dyLily) < 300) {
                        if (!en.isAlerted) {
                            en.isAlerted = true;
                            if (!en.alertSoundPlayed) {
                                audio.playZombieRoar();
                                en.alertSoundPlayed = true;
                            }
                            addFloatingText(en.x + en.w / 2, en.y - 20, '🧟 ¡TE VIO!', '#ff4d4f');
                            shakeCamera(6);
                        }
                        const chaseDir = dxLily >= 0 ? 1 : -1;
                        const isLunging = distToLily < 95;
                        const sprintSpeed = (isLunging ? 3.6 : 2.75) * (en.speedMult || 1);
                        en.vx = chaseDir * sprintSpeed;
                        en.x += en.vx;
                        en.x = Math.max(en.minX - 60, Math.min(en.maxX + 60, en.x));

                        if (isLunging && en.punchTimer === 0) {
                            en.punchTimer = 26; // Estira los brazos hacia Lily
                        }
                    } else {
                        if (Math.abs(dxLily) > 650) {
                            en.isAlerted = false;
                            en.alertSoundPlayed = false;
                        }
                        en.x += en.vx;
                        if (en.x < en.minX || en.x > en.maxX) en.vx *= -1;
                    }
                } else {
                    en.x += en.vx * (isAggressiveWorld && Math.abs(dxLily) < 260 ? 1.22 : 1.0);
                    if (en.x < en.minX || en.x > en.maxX) en.vx *= -1;
                }
                en.bouncePhase += 0.12 * (en.speedMult || 1);

                if (distToLily < 78 && en.punchTimer === 0) {
                    en.punchTimer = 18;
                }

                // 🔥⚡ Disparo de fuego, plasma o escombros terrestres a partir del Nivel 2
                if (isAggressiveWorld) {
                    if (en.shootCooldown > 0) en.shootCooldown--;
                    if (en.shootCooldown <= 0 && Math.abs(dxLily) < 430 && Math.abs(dyLily) < 220) {
                        const dirX = dxLily >= 0 ? 1 : -1;
                        const projKind = (en.kind === 'masked_man' || en.kind === 'zombie_masked') ? 'debris' : (en.kind === 'cloud' ? 'fire' : 'plasma');
                        const projSpeed = (currentLevelIndex === 2 || currentLevelIndex >= 4) ? 5.6 : 4.5;
                        en.punchTimer = 22;
                        en.shootCooldown = (currentLevelIndex === 2 || currentLevelIndex >= 4) ? (isZombie ? 65 : 75) : 105;

                        enemyProjectiles.push({
                            x: en.x + en.w / 2 + dirX * 18,
                            y: en.y + 18,
                            vx: dirX * projSpeed,
                            vy: projKind === 'fire' ? -1.4 : (projKind === 'debris' ? -2.2 : (dyLily * 0.008)),
                            r: projKind === 'fire' ? 10 : (projKind === 'debris' ? 9 : 8),
                            kind: projKind,
                            isProjectile: true,
                            damage: (currentLevelIndex === 2 || currentLevelIndex >= 4) ? 2 : 1, // ¡Hacen más daño!
                            life: 115
                        });
                        audio.playEnemyShoot(projKind === 'plasma');
                        addParticles(en.x + en.w / 2 + dirX * 18, en.y + 18, 5, 'sparkle', projKind === 'fire' ? '#ff7a45' : (projKind === 'debris' ? '#a4b0be' : '#87e8de'));
                    }
                }

                if (en.happyTimer < 80 && aabb(lily, en)) {
                    if (lily.vy >= 0 && lily.y + lily.h - lily.vy <= en.y + 22) {
                        lily.vy = -10.8;
                        lily.airJumpsLeft = lily.power === 'bell' ? 2 : 1;
                        befriendEnemy(en);
                    } else {
                        hurtLily(en, 1);
                    }
                }
            });
            enemies = enemies.filter(en => en.happyTimer < 70);

            // Actualizar proyectiles de los marcianos (Bolas de Fuego 🔥, Balitas de Plasma ⚡ y Escombros 🪨)
            for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                const ep = enemyProjectiles[i];
                ep.x += ep.vx;
                ep.y += ep.vy;
                if (ep.kind === 'fire' || ep.kind === 'debris') {
                    ep.vy += 0.09; // parábola que rebota en el suelo
                    if (ep.y > 448) {
                        ep.y = 448;
                        ep.vy = -2.8;
                    }
                }
                ep.life--;

                if (globalTick % 3 === 0) {
                    addParticles(ep.x, ep.y, 1, 'sparkle', ep.kind === 'fire' ? '#ffa940' : '#b5f5ec');
                }

                const dx = (lily.x + lily.w / 2) - ep.x;
                const dy = (lily.y + lily.h / 2) - ep.y;
                if (Math.hypot(dx, dy) < ep.r + 16) {
                    hurtLily(ep, ep.damage);
                    enemyProjectiles.splice(i, 1);
                    continue;
                }

                if (ep.life <= 0) {
                    enemyProjectiles.splice(i, 1);
                }
            }

            // Nocturnal Star-Drops (Level 2 & 3 hazards)
            nightDrops.forEach(nd => {
                nd.y += nd.vy;
                if (nd.y > nd.maxY || nd.y < nd.minY) nd.vy *= -1;
                const dx = (lily.x + lily.w / 2) - nd.x;
                const dy = (lily.y + lily.h / 2) - nd.y;
                if (Math.hypot(dx, dy) < nd.r + 16) {
                    hurtLily();
                }
            });

            // Si un golpe acabó con Lily en este mismo paso, ya no se procesa nada más
            if (gameState !== 'PLAYING') {
                updateParticlesAndTexts();
                return;
            }

            // 🚩 Checkpoint de mitad de nivel: se activa al pasar por la bandera
            if (checkpoint && !checkpoint.reached && lily.x + lily.w / 2 >= checkpoint.x) {
                activateCheckpoint();
            }

            // 🐙👑 ACTUALIZAR BATALLA CONTRA EL REY KRAKEN MARCIANO (MUNDO 1-4)
            if (boss && !boss.defeated) {
                // Activar Boss y cambiar a música de tensión cuando Lily entra a la Arena (X >= 2580)
                if (!boss.active && lily.x >= 2580) {
                    boss.active = true;
                    audio.startBossTensionMusic();
                    lightningFlash = 16;
                    showToast('⚠️ ¡EL REY KRAKEN MARCIANO HA APARECIDO! Golpéalo con el poder 👊 del Puñito (C), Burbujas 🫧 o saltándole encima para encogerlo', 4500);
                }

                if (boss.active) {
                    if (boss.hurtTimer > 0) boss.hurtTimer--;
                    boss.tentaclePhase += 0.11;
                    boss.swoopPhase += 0.045;

                    // Movimiento más rápido a medida que se hace más pequeño
                    const rageMultiplier = 1 + (1 - boss.hp / boss.maxHp) * 0.85;
                    boss.x += boss.vx * rageMultiplier;
                    if (boss.x < boss.minX) {
                        boss.x = boss.minX;
                        boss.vx = Math.abs(boss.vx);
                    } else if (boss.x > boss.maxX) {
                        boss.x = boss.maxX;
                        boss.vx = -Math.abs(boss.vx);
                    }

                    // Vuelo ondulante con descensos hacia la altura de Lily
                    boss.y = boss.baseY + Math.sin(boss.swoopPhase) * 75 + Math.cos(boss.swoopPhase * 0.5) * 35;

                    // Ataques del Boss: Lanza ráfagas de fuego marciano y plasma cósmico
                    boss.attackTimer--;
                    if (boss.attackTimer <= 0) {
                        const dx = (lily.x + lily.w / 2) - boss.x;
                        const dy = (lily.y + lily.h / 2) - boss.y;
                        const baseAng = Math.atan2(dy, dx);
                        const spreadAngles = [-0.24, 0, 0.24];
                        spreadAngles.forEach((offset, idx) => {
                            const ang = baseAng + offset;
                            enemyProjectiles.push({
                                x: boss.x + Math.cos(ang) * (45 * boss.scale),
                                y: boss.y + Math.sin(ang) * (45 * boss.scale),
                                vx: Math.cos(ang) * 5.2,
                                vy: Math.sin(ang) * 5.2,
                                r: 10,
                                kind: idx === 1 ? 'fire' : 'plasma',
                                isProjectile: true,
                                damage: 1,
                                life: 135
                            });
                        });
                        audio.playEnemyShoot(true);
                        addParticles(boss.x, boss.y, 10, 'sparkle', '#ff4d94');
                        boss.attackTimer = Math.max(42, Math.floor(88 - (1 - boss.hp / boss.maxHp) * 38));
                    }

                    // Colisión directa entre Lily y el Boss (Saltar sobre su corona lo daña y lo encoge)
                    const bossHitR = 52 * boss.scale;
                    const lilyCenterX = lily.x + lily.w / 2;
                    const lilyCenterY = lily.y + lily.h / 2;
                    const distBoss = Math.hypot(lilyCenterX - boss.x, lilyCenterY - boss.y);

                    if (distBoss < bossHitR + 18) {
                        if (lily.vy > 0 && lily.y + lily.h - lily.vy <= boss.y + 12) {
                            // ¡Salto heroico sobre la corona del Boss!
                            lily.vy = -12.2;
                            lily.airJumpsLeft = lily.power === 'bell' ? 2 : 1;
                            damageBoss(2, '💥 ¡Salto Estelar! (-Tamaño)');
                        } else if (boss.hurtTimer === 0) {
                            hurtLily({ x: boss.x, w: 60, kind: 'boss' }, 1);
                        }
                    }
                }
            }

            // 🚀 Meta: Abordar la Nave Estelar para despegar automáticamente al siguiente nivel
            // En el Mundo 1-4 la nave solo se puede abordar tras derrotar al Boss
            const canBoardSpaceship = !boss || boss.defeated;
            if (spaceship && !spaceship.reached && canBoardSpaceship) {
                if (
                    lily.x + lily.w >= spaceship.x + 18 &&
                    lily.x <= spaceship.x + spaceship.w - 18 &&
                    lily.y + lily.h >= spaceship.y + 10
                ) {
                    spaceship.reached = true;
                    spaceship.boardingTimer = 0;
                    spaceship.vy = 0;
                    lily.inSpaceship = true;
                    lily.vx = 0;
                    lily.vy = 0;
                    lily.facing = 1;
                    const timeBonus = Math.max(0, Math.floor(timeLeftSeconds)) * 15;
                    lily.score += 1000 + timeBonus;
                    audio.playSpaceshipLaunch();
                    addParticles(spaceship.x + spaceship.w / 2, spaceship.y + 40, 28, 'star', '#ffe58f');
                    addParticles(spaceship.x + spaceship.w / 2, spaceship.y + 70, 20, 'heart', '#ff85c0');
                    addFloatingText(spaceship.x + spaceship.w / 2, spaceship.y - 12, `🚀 ¡DESPEGUE ESTELAR! +${1000 + timeBonus}`, '#ffe58f');
                    showToast('🚀 ¡Lily subió a la Nave Estelar! Despegando hacia el siguiente planeta...', 3200);
                    updateHUD();
                }
            }

            const targetCamX = lily.x - VIEW_W * 0.35;
            cameraX += (targetCamX - cameraX) * 0.14;
            cameraX = Math.max(0, Math.min(cameraX, levelWidth - VIEW_W));

            updateParticlesAndTexts();
        }


function updateGame() {
    window.globalTick = globalTick;
    window.cameraX = cameraX;
    window.gameState = gameState;
    window.lightningFlash = lightningFlash;
    _origUpdateGame();
    window.globalTick = globalTick;
    window.cameraX = cameraX;
    window.gameState = gameState;
    window.lightningFlash = lightningFlash;
}

        function renderIntroRoomScene() {
            // Cozy nocturnal bedroom walls
            const wallGrad = ctx.createLinearGradient(0, 0, 0, 430);
            wallGrad.addColorStop(0, '#231542');
            wallGrad.addColorStop(1, '#3c2369');
            ctx.fillStyle = wallGrad;
            ctx.fillRect(0, 0, VIEW_W, 430);

            // Cute wallpaper subtle vertical stripes
            ctx.fillStyle = 'rgba(255, 194, 226, 0.04)';
            for (let x = 0; x < VIEW_W; x += 48) {
                ctx.fillRect(x, 0, 24, 430);
            }

            // Wooden Baseboard & Warm Bedroom Floor
            ctx.fillStyle = '#ffadd2';
            ctx.fillRect(0, 422, VIEW_W, 10);
            const floorGrad = ctx.createLinearGradient(0, 432, 0, VIEW_H);
            floorGrad.addColorStop(0, '#4a2c59');
            floorGrad.addColorStop(1, '#2d1838');
            ctx.fillStyle = floorGrad;
            ctx.fillRect(0, 432, VIEW_W, VIEW_H - 432);

            // Cozy Pastel Rug in center of bedroom floor
            ctx.save();
            ctx.fillStyle = '#ff9ed2';
            ctx.strokeStyle = '#fff0f6';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(470, 468, 250, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // Bedroom Window showing the Starry Night Sky outside
            ctx.save();
            const winX = 350, winY = 70, winW = 190, winH = 165;
            ctx.fillStyle = '#0c0626';
            drawRoundedRect(ctx, winX, winY, winW, winH, 14);
            ctx.fill();

            // Stars & Crescent Moon inside window
            for (let i = 0; i < 18; i++) {
                const sx = winX + 18 + ((i * 37) % (winW - 36));
                const sy = winY + 18 + ((i * 29) % (winH - 36));
                ctx.fillStyle = i % 2 === 0 ? '#ffe58f' : '#ffffff';
                ctx.beginPath();
                ctx.arc(sx, sy, (i % 3) + 1, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = '#fff3b0';
            ctx.beginPath();
            ctx.arc(winX + 135, winY + 55, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0c0626';
            ctx.beginPath();
            ctx.arc(winX + 145, winY + 49, 18, 0, Math.PI * 2);
            ctx.fill();

            // Window panes & pastel curtains
            ctx.strokeStyle = '#ffd6eb';
            ctx.lineWidth = 5;
            drawRoundedRect(ctx, winX, winY, winW, winH, 14);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(winX + winW / 2, winY);
            ctx.lineTo(winX + winW / 2, winY + winH);
            ctx.moveTo(winX, winY + winH / 2);
            ctx.lineTo(winX + winW, winY + winH / 2);
            ctx.stroke();

            // Soft Pink Curtains
            ctx.fillStyle = '#ff85c0';
            ctx.beginPath();
            ctx.moveTo(winX - 10, winY - 8);
            ctx.quadraticCurveTo(winX + 35, winY + 70, winX - 12, winY + winH + 10);
            ctx.lineTo(winX - 22, winY - 8);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(winX + winW + 10, winY - 8);
            ctx.quadraticCurveTo(winX + winW - 35, winY + 70, winX + winW + 12, winY + winH + 10);
            ctx.lineTo(winX + winW + 22, winY - 8);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // Cozy Bed on the Left with Cat Pillow & Pastel Duvet
            ctx.save();
            // Headboard
            ctx.fillStyle = '#f78fb8';
            drawRoundedRect(ctx, 45, 295, 28, 135, 10);
            ctx.fill();
            // Mattress & Duvet
            ctx.fillStyle = '#fff0f6';
            drawRoundedRect(ctx, 65, 355, 155, 55, 10);
            ctx.fill();
            ctx.fillStyle = '#d3adf7';
            drawRoundedRect(ctx, 105, 355, 115, 55, 10);
            ctx.fill();
            // Cute Pillow
            ctx.fillStyle = '#ffc2e2';
            drawRoundedRect(ctx, 72, 338, 42, 22, 8);
            ctx.fill();
            // Bed Frame Legs
            ctx.fillStyle = '#b85d8c';
            ctx.fillRect(55, 405, 14, 25);
            ctx.fillRect(200, 405, 14, 25);
            ctx.restore();

            // Wall Shelf with Books & Cute Plant
            ctx.save();
            ctx.fillStyle = '#ffadd2';
            drawRoundedRect(ctx, 90, 150, 150, 12, 5);
            ctx.fill();
            // Books
            ctx.fillStyle = '#ff85c0';
            ctx.fillRect(105, 118, 14, 32);
            ctx.fillStyle = '#87e8de';
            ctx.fillRect(121, 122, 14, 28);
            ctx.fillStyle = '#ffe58f';
            ctx.fillRect(137, 115, 14, 35);
            // Little potted plant
            ctx.fillStyle = '#ff9c6e';
            ctx.fillRect(195, 130, 22, 20);
            ctx.fillStyle = '#73d13d';
            ctx.beginPath();
            ctx.arc(206, 125, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Lily's Cute Gaming Chair (where she starts sitting)
            ctx.save();
            const chairX = 248;
            ctx.fillStyle = '#ff85c0';
            drawRoundedRect(ctx, chairX - 18, 325, 22, 68, 10);
            ctx.fill();
            drawRoundedRect(ctx, chairX - 16, 382, 46, 14, 6);
            ctx.fill();
            ctx.fillStyle = '#d3adf7';
            ctx.fillRect(chairX + 2, 396, 8, 34);
            ctx.fillRect(chairX - 14, 426, 40, 6);
            ctx.restore();

            // DESK & GLOWING PINK COMPUTER ON THE RIGHT
            const deskX = introRoom.deskX;
            ctx.save();
            // Desk legs & pastel top
            ctx.fillStyle = '#f9f0ff';
            ctx.fillRect(deskX + 12, 362, 14, 70);
            ctx.fillRect(deskX + 154, 362, 14, 70);
            ctx.fillStyle = '#ffadd2';
            drawRoundedRect(ctx, deskX, 350, 185, 16, 6);
            ctx.fill();

            // Pink PC Tower with glowing heart LED
            ctx.fillStyle = '#ff85c0';
            ctx.strokeStyle = '#fff0f6';
            ctx.lineWidth = 2;
            drawRoundedRect(ctx, deskX + 130, 292, 42, 58, 8);
            ctx.fill();
            ctx.stroke();
            drawHeartShape(ctx, deskX + 151, 312, 12, '#ffe58f');

            // Pink Keyboard & Mouse on Desk
            ctx.fillStyle = '#ffc2e2';
            drawRoundedRect(ctx, deskX + 25, 344, 52, 6, 3);
            ctx.fill();

            // PINK COMPUTER MONITOR (WITH MAGICAL PORTAL SCREEN)
            const monX = deskX + 24;
            const monY = 266;
            const monW = 92;
            const monH = 68;

            // Monitor Stand
            ctx.fillStyle = '#ff66b3';
            ctx.fillRect(monX + 38, monY + monH, 16, 16);
            drawRoundedRect(ctx, monX + 24, monY + monH + 12, 44, 6, 3);
            ctx.fill();

            // Outer Pink Monitor Bezel + Cute Cat Ears on top of Monitor!
            ctx.fillStyle = '#ff66b3';
            ctx.strokeStyle = '#fff0f6';
            ctx.lineWidth = 3;
            drawRoundedRect(ctx, monX, monY, monW, monH, 12);
            ctx.fill();
            ctx.stroke();

            // Glowing Screen Inside Pink Monitor
            const scrX = monX + 7;
            const scrY = monY + 7;
            const scrW = monW - 14;
            const scrH = monH - 14;

            const scrGrad = ctx.createRadialGradient(
                introRoom.monitorCenterX, introRoom.monitorCenterY, 4,
                introRoom.monitorCenterX, introRoom.monitorCenterY, 55
            );
            scrGrad.addColorStop(0, '#fff0f6');
            scrGrad.addColorStop(0.45, '#ff85c0');
            scrGrad.addColorStop(1, '#531dab');
            ctx.fillStyle = scrGrad;
            drawRoundedRect(ctx, scrX, scrY, scrW, scrH, 8);
            ctx.fill();

            // Animated Swirling Portal inside the Pink Computer Screen
            ctx.save();
            ctx.translate(introRoom.monitorCenterX, introRoom.monitorCenterY);
            ctx.rotate(globalTick * 0.08);
            for (let r = 8; r <= 26; r += 7) {
                ctx.strokeStyle = r % 2 === 0 ? '#ffe58f' : '#ffc2e2';
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 5]);
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.setLineDash([]);
            drawStarShape(ctx, 0, 0, 5, 8, 4, '#ffe58f');
            ctx.restore();

            // Outer magical aura pulsing from the pink monitor
            const pulseR = 65 + Math.sin(globalTick * 0.1) * 10 + (introRoom.suctionProgress * 95);
            const portalGlow = ctx.createRadialGradient(
                introRoom.monitorCenterX, introRoom.monitorCenterY, 10,
                introRoom.monitorCenterX, introRoom.monitorCenterY, pulseR
            );
            portalGlow.addColorStop(0, 'rgba(255, 133, 192, 0.45)');
            portalGlow.addColorStop(0.6, 'rgba(255, 229, 143, 0.20)');
            portalGlow.addColorStop(1, 'rgba(255, 133, 192, 0)');
            ctx.fillStyle = portalGlow;
            ctx.beginPath();
            ctx.arc(introRoom.monitorCenterX, introRoom.monitorCenterY, pulseR, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            // Draw Lily in her bedroom (sitting, walking, or being sucked into the pink monitor!)
            if (introRoom.suctionActive) {
                const t = introRoom.suctionProgress;
                const curX = introRoom.lilyX + (introRoom.monitorCenterX - introRoom.lilyX) * Math.pow(t, 0.75);
                const curY = introRoom.lilyY + (introRoom.monitorCenterY - introRoom.lilyY) * Math.pow(t, 0.75);
                const curScale = Math.max(0.05, 1.35 * (1 - t));
                const curRot = t * Math.PI * 6;

                // Spiral Vortex Beams pulling Lily into the screen
                ctx.save();
                ctx.translate(introRoom.monitorCenterX, introRoom.monitorCenterY);
                ctx.rotate(-globalTick * 0.14);
                for (let i = 0; i < 6; i++) {
                    ctx.rotate(Math.PI / 3);
                    ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 158, 210, 0.7)' : 'rgba(255, 229, 143, 0.7)';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.quadraticCurveTo(40, 35, (1 - t) * 130, 0);
                    ctx.stroke();
                }
                ctx.restore();

                drawLilyCharacter(ctx, curX, curY, curScale, {
                    facing: 1,
                    onGround: false,
                    animTimer: globalTick * 0.2,
                    vx: 0,
                    vy: 0,
                    reachingArm: true,
                    rotation: curRot,
                    power: 'bell'
                });
            } else {
                drawLilyCharacter(ctx, introRoom.lilyX, introRoom.lilyY, 1.35, {
                    facing: introRoom.facing,
                    onGround: true,
                    sitting: introRoom.sittingInChair,
                    animTimer: introRoom.animTimer,
                    vx: introRoom.animTimer > 0 ? 2 : 0,
                    vy: 0,
                    reachingArm: introRoom.reachingScreen || (introRoom.lilyX > 500),
                    power: 'none'
                });

                // Helpful Floating Arrow & Prompt above the Pink Computer
                const bobY = Math.sin(globalTick * 0.1) * 6;
                ctx.save();
                ctx.font = 'bold 16px Fredoka, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#ffe58f';
                ctx.strokeStyle = '#231542';
                ctx.lineWidth = 4;
                const promptText = introRoom.sittingInChair
                    ? 'Presiona ➡️ o D para levantarte e ir a tu Computadora Rosa 💻'
                    : '¡Acércate y toca la pantalla rosa con tu manito! 👉💻✨';
                ctx.strokeText(promptText, VIEW_W / 2, 52);
                ctx.fillText(promptText, VIEW_W / 2, 52);

                // Bouncing arrow over the pink monitor
                ctx.font = 'bold 26px Fredoka, sans-serif';
                ctx.fillText('⬇️', introRoom.monitorCenterX, 238 + bobY);
                ctx.restore();
            }

            // Render particles & floating texts
            particles.forEach(p => {
                ctx.save();
                ctx.globalAlpha = Math.max(0, p.life);
                if (p.type === 'star') {
                    drawStarShape(ctx, p.x, p.y, 5, p.size, p.size * 0.5, p.color);
                } else if (p.type === 'heart') {
                    drawHeartShape(ctx, p.x, p.y - p.size / 2, p.size * 1.3, p.color);
                } else {
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            });

            floatingTexts.forEach(ft => {
                ctx.save();
                ctx.globalAlpha = Math.max(0, ft.life);
                ctx.font = 'bold 17px Fredoka, sans-serif';
                ctx.fillStyle = ft.color;
                ctx.strokeStyle = '#261247';
                ctx.lineWidth = 3.5;
                ctx.textAlign = 'center';
                ctx.strokeText(ft.text, ft.x, ft.y);
                ctx.fillText(ft.text, ft.x, ft.y);
                ctx.restore();
            });
        }


        function renderWorld() {
            const theme = LEVEL_THEMES[currentLevelIndex];
            ctx.save();
            const shakeX = cameraShakeAmount > 0 ? (Math.random() - 0.5) * cameraShakeAmount : 0;
            const shakeY = cameraShakeAmount > 0 ? (Math.random() - 0.5) * cameraShakeAmount : 0;
            ctx.translate(-cameraX + shakeX, shakeY);

            platforms.forEach(p => {
                if (p.x + p.w < cameraX - 100 || p.x > cameraX + VIEW_W + 100) return;
                if (p.type === 'ground') {
                    if (AssetManager.isReady('tileset')) {
                        // 🎨 Suelo con textura de escamas rosadas y borde dorado (./asets/tileset_platforms.png)
                        const ts = AssetManager.get('tileset');
                        const gt = AssetManager.sprites.tileset;
                        const tileDestH = 112;
                        const scaleRatio = tileDestH / gt.groundTile.h;
                        const capLW = Math.round(gt.groundCapL.w * scaleRatio);
                        const capRW = Math.round(gt.groundCapR.w * scaleRatio);
                        const midW = Math.max(32, Math.round(gt.groundTile.w * scaleRatio));

                        ctx.save();
                        // Relleno base profundo si el bloque de suelo es más alto que el tile
                        ctx.fillStyle = '#2d1147';
                        ctx.fillRect(p.x, p.y + 8, p.w, p.h - 8);

                        ctx.beginPath();
                        drawRoundedRect(ctx, p.x, p.y - 3, p.w, p.h + 6, 8);
                        ctx.clip();

                        // Repetir horizontalmente el tile de escamas rosadas a lo largo de p.w sin costuras
                        const drawY = p.y - 3;
                        if (p.w <= capLW + capRW + 10) {
                            ctx.drawImage(ts, gt.groundFull.x, gt.groundFull.y, gt.groundFull.w, gt.groundFull.h, p.x, drawY, p.w, tileDestH);
                        } else {
                            ctx.drawImage(ts, gt.groundCapL.x, gt.groundCapL.y, gt.groundCapL.w, gt.groundCapL.h, p.x, drawY, capLW, tileDestH);
                            const innerW = p.w - capLW - capRW;
                            const srcScaleW = gt.groundTile.w / 6; // 103.5px por escama
                            const dstScaleW = srcScaleW * scaleRatio;
                            const totalScales = Math.max(1, Math.round(innerW / dstScaleW));
                            const adjScaleW = innerW / totalScales;
                            let remScales = totalScales;
                            let curX = p.x + capLW;
                            while (remScales > 0) {
                                const chunkScales = Math.min(6, remScales);
                                const chunkSrcW = Math.round(chunkScales * srcScaleW);
                                const chunkSrcX = (gt.groundTile.x + gt.groundTile.w) - chunkSrcW;
                                const chunkDstW = chunkScales * adjScaleW;
                                ctx.drawImage(
                                    ts,
                                    chunkSrcX, gt.groundTile.y, chunkSrcW, gt.groundTile.h,
                                    Math.floor(curX), drawY, Math.ceil(chunkDstW) + 1, tileDestH
                                );
                                curX += chunkDstW;
                                remScales -= chunkScales;
                            }
                            ctx.drawImage(ts, gt.groundCapR.x, gt.groundCapR.y, gt.groundCapR.w, gt.groundCapR.h, p.x + p.w - capRW, drawY, capRW, tileDestH);
                        }
                        ctx.restore();
                    } else {
                        // Fallback vectorial original
                        ctx.fillStyle = theme.groundBody;
                        ctx.fillRect(p.x, p.y, p.w, p.h);

                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(p.x, p.y, p.w, p.h);
                        ctx.clip();
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                        for (let sx = p.x; sx < p.x + p.w; sx += 48) {
                            ctx.fillRect(sx, p.y, 24, p.h);
                        }
                        ctx.restore();

                        ctx.fillStyle = theme.groundTop;
                        ctx.fillRect(p.x, p.y, p.w, 14);

                        for (let fx = p.x + 12; fx < p.x + p.w - 8; fx += 24) {
                            ctx.fillStyle = theme.groundTop;
                            ctx.beginPath();
                            ctx.arc(fx, p.y + 14, 9, 0, Math.PI);
                            ctx.fill();

                            ctx.fillStyle = (fx % 48 === 0) ? '#ffe58f' : '#ffffff';
                            ctx.beginPath();
                            ctx.arc(fx, p.y + 7, 2.2, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                } else if (p.type === 'rooftop') {
                    drawRooftopPlatform(p);
                } else {
                    drawCloudPlatform(p.x, p.y, p.w, p.h, '#ffc2e2');
                }
            });

            ladders.forEach(lad => {
                if (lad.x + lad.w < cameraX - 80 || lad.x > cameraX + VIEW_W + 80) return;
                drawLadder(lad);
            });

            movingPlatforms.forEach(mp => {
                if (mp.x + mp.w < cameraX - 90 || mp.x > cameraX + VIEW_W + 90) return;
                drawThrusterPlatform(mp.x, mp.y, mp.w, mp.h, '#ffe58f', '#593869');
            });

            // Ephemeral Falling Clouds
            fallingClouds.forEach(fc => {
                if (fc.respawnTimer > 0 || fc.x + fc.w < cameraX - 90 || fc.x > cameraX + VIEW_W + 90) return;
                const shakeX = (fc.triggered && fc.shakeTimer > 0) ? (Math.random() * 6 - 3) : 0;
                drawCloudPlatform(fc.x + shakeX, fc.y, fc.w, fc.h, '#b37feb', false, true);
            });

            bounceClouds.forEach(bc => {
                if (bc.x + bc.w < cameraX - 90 || bc.x > cameraX + VIEW_W + 90) return;
                const squash = Math.sin(bc.bounceAnim * Math.PI) * 7;
                drawCloudPlatform(bc.x, bc.y + squash, bc.w, bc.h - squash, '#ff85c0', true);
            });

            // 🔥 Plataformas Flotantes con Fuego Propulsor (reemplazan a los tubos)
            thrusterPlatforms.forEach(tp => {
                if (tp.x + tp.w < cameraX - 90 || tp.x > cameraX + VIEW_W + 90) return;
                drawThrusterPlatform(tp.x, tp.y, tp.w, tp.h, '#ff85c0', '#3b1d6e');
            });

            // 🎁 Cajitas de Regalo / Cofrecitos Sorpresa que Lily abre (reemplazan a los cubos de Mario)
            blocks.forEach(b => {
                if (b.x + b.w < cameraX - 70 || b.x > cameraX + VIEW_W + 70) return;
                drawSurpriseGiftBox(b);
            });

            starCandies.forEach(sc => {
                if (sc.collected || sc.x < cameraX - 50 || sc.x > cameraX + VIEW_W + 50) return;
                const bob = Math.sin(globalTick * 0.08 + sc.phase) * 4;
                ctx.save();
                ctx.translate(sc.x, sc.y + bob);
                // ✨ Resplandor bloom detrás de cada estrellita / dulce estelar
                drawMagicBloom(ctx, 0, 0, 22, 'rgba(255, 229, 143, 0.55)', 'rgba(255, 133, 192, 0)');
                if (AssetManager.isReady('props')) {
                    const propsSheet = AssetManager.get('props');
                    const items = AssetManager.sprites.props.starsAndCandies;
                    // Alterna entre estrellitas doradas (0, 2) y dulces estelares rosas (1) de la Fila 5
                    const pickIdx = (Math.round(sc.phase * 2) % 3 === 1) ? 1 : ((Math.floor(globalTick / 18 + sc.phase) % 2 === 0) ? 0 : 2);
                    const fr = items[pickIdx];
                    const sz = pickIdx === 1 ? 30 : 28;
                    const dw = sz;
                    const dh = sz * (fr.h / fr.w);
                    ctx.drawImage(propsSheet, fr.x, fr.y, fr.w, fr.h, -dw / 2, -dh / 2, dw, dh);
                } else {
                    drawStarShape(ctx, 0, 0, 5, 13, 6.5, '#ffe58f');
                    ctx.fillStyle = '#593869';
                    ctx.beginPath();
                    ctx.arc(-3, -1, 1.4, 0, Math.PI * 2);
                    ctx.arc(3, -1, 1.4, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            });

            powerUps.forEach(pu => {
                if (pu.x + pu.w < cameraX - 60 || pu.x > cameraX + VIEW_W + 60) return;
                ctx.save();
                ctx.translate(pu.x + pu.w / 2, pu.y + pu.h / 2);
                if (pu.kind === 'bell') {
                    ctx.fillStyle = '#ffe58f';
                    ctx.strokeStyle = '#faad14';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, 13, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = '#ff85c0';
                    ctx.beginPath();
                    ctx.ellipse(-6, -11, 6, 3.5, -0.3, 0, Math.PI * 2);
                    ctx.ellipse(6, -11, 6, 3.5, 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#874d00';
                    ctx.beginPath();
                    ctx.arc(0, 4, 3, 0, Math.PI * 2);
                    ctx.fill();
                } else if (pu.kind === 'rocket') {
                    // 🚀 Ítem Cohete Propulsor de 5 Segundos
                    const bob = Math.sin(globalTick * 0.18) * 3;
                    ctx.translate(0, bob);
                    // Llama debajo del ítem cohete
                    ctx.fillStyle = '#ff7a45';
                    ctx.beginPath();
                    ctx.moveTo(-6, 11);
                    ctx.lineTo(0, 21 + Math.sin(globalTick * 0.6) * 3);
                    ctx.lineTo(6, 11);
                    ctx.closePath();
                    ctx.fill();
                    // Aletas laterales rosas
                    ctx.fillStyle = '#ff4d94';
                    ctx.beginPath();
                    ctx.moveTo(-8, 2);
                    ctx.lineTo(-15, 12);
                    ctx.lineTo(-6, 11);
                    ctx.closePath();
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(8, 2);
                    ctx.lineTo(15, 12);
                    ctx.lineTo(6, 11);
                    ctx.closePath();
                    ctx.fill();
                    // Cuerpo del cohete blanco y dorado
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeStyle = '#ff85c0';
                    ctx.lineWidth = 2;
                    drawRoundedRect(ctx, -8, -10, 16, 22, 7);
                    ctx.fill();
                    ctx.stroke();
                    // Punta cónica dorada
                    ctx.fillStyle = '#ffe58f';
                    ctx.beginPath();
                    ctx.moveTo(-8, -8);
                    ctx.lineTo(0, -18);
                    ctx.lineTo(8, -8);
                    ctx.closePath();
                    ctx.fill();
                    // Ventanita celeste
                    ctx.fillStyle = '#87e8de';
                    ctx.beginPath();
                    ctx.arc(0, -1, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (pu.kind === 'punch') {
                    // 👊 Guante rosa flotante: poder del Puñito
                    ctx.translate(0, Math.sin(globalTick * 0.14) * 3);
                    const pg = ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
                    pg.addColorStop(0, 'rgba(255, 229, 143, 0.55)');
                    pg.addColorStop(1, 'rgba(255, 133, 192, 0)');
                    ctx.fillStyle = pg;
                    ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = '#ffe58f'; ctx.strokeStyle = '#2b1740'; ctx.lineWidth = 2;
                    ctx.fillRect(-14, -5, 7, 10); ctx.strokeRect(-14, -5, 7, 10);
                    ctx.fillStyle = '#ff85c0'; ctx.strokeStyle = '#fff0f6'; ctx.lineWidth = 2.5;
                    ctx.beginPath(); ctx.arc(2, 0, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                    ctx.strokeStyle = '#fff0f6'; ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(6, -7); ctx.lineTo(6, 7); ctx.moveTo(10, -4); ctx.lineTo(10, 4); ctx.stroke();
                } else if (pu.kind === 'cat') {
                    // 🐱 Ítem del Gatito Guardián esperando a ser rescatado por Lily
                    const bob = Math.sin(globalTick * 0.16) * 3.5;
                    ctx.translate(0, bob);
                    drawCatCompanionSprite(ctx, 0, 2, 1.05, 1);
                } else {
                    const petals = ['#ff85c0', '#b5f5ec', '#ffe58f', '#d3adf7', '#ffc2e2'];
                    for (let a = 0; a < 5; a++) {
                        const ang = (a * Math.PI * 2) / 5 + globalTick * 0.04;
                        ctx.fillStyle = petals[a];
                        ctx.beginPath();
                        ctx.arc(Math.cos(ang) * 9, Math.sin(ang) * 9, 6.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(0, 0, 6, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            });

            enemies.forEach(en => {
                if (en.x + en.w < cameraX - 80 || en.x > cameraX + VIEW_W + 80) return;
                drawKawaiiObstacle(en);
            });

            // 🔥⚡ Renderizar proyectiles disparados por los marcianos (Bolas de Fuego y Balitas de Plasma)
            enemyProjectiles.forEach(ep => {
                if (ep.x < cameraX - 50 || ep.x > cameraX + VIEW_W + 50) return;
                ctx.save();
                ctx.translate(ep.x, ep.y);
                if (ep.kind === 'fire') {
                    // Bola de fuego marciana con cola llameante
                    const dir = ep.vx >= 0 ? 1 : -1;
                    ctx.fillStyle = '#ff4d4f';
                    ctx.beginPath();
                    ctx.moveTo(0, -ep.r);
                    ctx.lineTo(-dir * ep.r * 2.2, 0);
                    ctx.lineTo(0, ep.r);
                    ctx.closePath();
                    ctx.fill();

                    ctx.fillStyle = '#ffa940';
                    ctx.beginPath();
                    ctx.arc(0, 0, ep.r, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#fffb8f';
                    ctx.beginPath();
                    ctx.arc(dir * 2, 0, ep.r * 0.55, 0, Math.PI * 2);
                    ctx.fill();
                } else if (ep.kind === 'debris') {
                    // Escombro de ladrillo/hormigón arrojado por el hombre enmascarado
                    ctx.save();
                    ctx.rotate(globalTick * 0.15);
                    ctx.fillStyle = '#636e72';
                    ctx.strokeStyle = '#2d3436';
                    ctx.lineWidth = 1.6;
                    drawRoundedRect(ctx, -ep.r, -ep.r, ep.r * 2, ep.r * 1.6, 2.5);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = '#d63031';
                    ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();
                } else {
                    // Balita de plasma / láser alienígena
                    ctx.fillStyle = '#36cfc9';
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    drawRoundedRect(ctx, -11, -5, 22, 10, 5);
                    ctx.fill();
                    ctx.stroke();
                    drawStarShape(ctx, 0, 0, 4, 6, 2.5, '#fffb8f');
                }
                ctx.restore();
            });

            // Nocturnal Star-Drops (Level 2 & 3 hazards)
            nightDrops.forEach(nd => {
                if (nd.x < cameraX - 60 || nd.x > cameraX + VIEW_W + 60) return;
                ctx.save();
                ctx.translate(nd.x, nd.y);
                ctx.fillStyle = '#ff66b3';
                ctx.strokeStyle = '#fff0f6';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 3, 11, 0, Math.PI);
                ctx.lineTo(0, -14);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                drawStarShape(ctx, 0, 2, 4, 6, 3, '#ffe58f');
                ctx.restore();
            });

            bubbles.forEach(b => {
                if (b.x + b.r < cameraX - 60 || b.x - b.r > cameraX + VIEW_W + 60) return;
                ctx.save();
                ctx.translate(b.x, b.y);
                // ✨ Resplandor bloom detrás de cada burbuja de corazón
                drawMagicBloom(ctx, 0, 0, b.r * 2.1, 'rgba(255, 133, 192, 0.55)', 'rgba(181, 245, 236, 0)');
                if (AssetManager.isReady('props')) {
                    const propsSheet = AssetManager.get('props');
                    const hbs = AssetManager.sprites.props.heartBubbles;
                    const frameIdx = Math.floor(globalTick * 0.2) % hbs.length;
                    const fr = hbs[frameIdx];
                    const sz = b.r * 2.35;
                    ctx.drawImage(propsSheet, fr.x, fr.y, fr.w, fr.h, -sz / 2, -sz / 2, sz, sz);
                } else {
                    ctx.fillStyle = 'rgba(255, 194, 226, 0.55)';
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, b.r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    drawHeartShape(ctx, 0, -5, 9, '#ff66b3');
                }
                ctx.restore();
            });

            if (checkpoint) {
                drawCheckpointFlag(checkpoint);
            }

            // 🛸 Nave Estelar en la que Lily aterriza al inicio del mundo
            if (arrivalShip) {
                drawArrivalSpaceship(arrivalShip);
            }

            // 🐙👑 Dibujar al Boss Final del Mundo 1-4 (Rey Kraken Marciano) y su Barra de Vida arriba
            if (boss && !boss.defeated) {
                drawMarcianoBoss(boss);
            }

            if (spaceship) {
                drawGoalSpaceship(spaceship);
            }

            // 🐱 Dibujar al Gatito Compañero Protector junto a Lily y sus estrellitas disparadas
            if (catCompanion.active && !lily.inSpaceship && !lily.landingInProgress) {
                drawCatCompanionSprite(ctx, catCompanion.x, catCompanion.y, 1.0, catCompanion.facing);
                catCompanion.projectiles.forEach(cp => {
                    drawStarShape(ctx, cp.x, cp.y, 5, 8, 4, '#ffe58f');
                });
            }

            // Si Lily no está dentro de ninguna nave cerrada, se dibuja normalmente en el mundo
            if (!lily.inSpaceship && !lily.landingInProgress) {
                drawLilyCharacter(ctx, lily.x + lily.w / 2, lily.y + lily.h / 2, 1.05, lily);

                // 👊 Guante rosa del puñetazo (fallback vectorial si no está activa la hoja de 12 cuadros Frame 11)
                const hasActionSheet12 = (typeof AssetManager !== 'undefined' && AssetManager.sheets && AssetManager.sheets.action && AssetManager.sheets.action.loaded);
                if (lily.punchTimer > 0 && !hasActionSheet12) {
                    const prog = 1 - lily.punchTimer / 14;
                    const reach = Math.sin(Math.min(1, prog * 1.4) * Math.PI) * 40;
                    const gx = lily.x + lily.w / 2 + lily.facing * (14 + reach);
                    const gy = lily.y + 24;
                    ctx.save();
                    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.moveTo(gx - lily.facing * 30, gy - 6); ctx.lineTo(gx - lily.facing * 10, gy - 6);
                    ctx.moveTo(gx - lily.facing * 34, gy + 4); ctx.lineTo(gx - lily.facing * 12, gy + 4); ctx.stroke();
                    ctx.fillStyle = '#ff85c0'; ctx.strokeStyle = '#fff0f6'; ctx.lineWidth = 2.5;
                    ctx.beginPath(); ctx.arc(gx, gy, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                    ctx.fillStyle = '#ffe58f';
                    ctx.fillRect(gx - lily.facing * 16 - 4, gy - 7, 8, 14);
                    ctx.restore();
                }

                // Barra flotante de tiempo de vuelo sobre Lily cuando lleva el Cohete Propulsor 🚀
                if (lily.rocketTimer > 0) {
                    const barW = 46;
                    const ratio = lily.rocketTimer / 300;
                    ctx.save();
                    ctx.fillStyle = 'rgba(29, 17, 69, 0.85)';
                    drawRoundedRect(ctx, lily.x - 5, lily.y - 18, barW, 8, 4);
                    ctx.fill();
                    ctx.fillStyle = ratio > 0.3 ? '#ffe58f' : '#ff4d6d';
                    drawRoundedRect(ctx, lily.x - 4, lily.y - 17, Math.max(4, (barW - 2) * ratio), 6, 3);
                    ctx.fill();
                    ctx.font = 'bold 11px Fredoka, sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.fillText(`🚀 ${(lily.rocketTimer / 60).toFixed(1)}s`, lily.x + lily.w / 2, lily.y - 22);
                    ctx.restore();
                }
            }

            particles.forEach(p => {
                if (p.x < cameraX - 50 || p.x > cameraX + VIEW_W + 50 || p.y < -50 || p.y > VIEW_H + 50) return;
                ctx.save();
                ctx.globalAlpha = Math.max(0, p.life);
                if (p.type === 'star') {
                    drawStarShape(ctx, p.x, p.y, 5, p.size, p.size * 0.5, p.color);
                } else if (p.type === 'heart') {
                    drawHeartShape(ctx, p.x, p.y - p.size / 2, p.size * 1.3, p.color);
                } else {
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            });

            floatingTexts.forEach(ft => {
                if (ft.x < cameraX - 100 || ft.x > cameraX + VIEW_W + 100) return;
                ctx.save();
                ctx.globalAlpha = Math.max(0, ft.life);
                ctx.font = 'bold 16px Fredoka, sans-serif';
                ctx.fillStyle = ft.color;
                ctx.strokeStyle = '#261247';
                ctx.lineWidth = 3.5;
                ctx.textAlign = 'center';
                ctx.strokeText(ft.text, ft.x, ft.y);
                ctx.fillText(ft.text, ft.x, ft.y);
                ctx.restore();
            });

            ctx.restore();
        }


        function gameLoop(timestamp = performance.now()) {
            if (!lastFrameTime) lastFrameTime = timestamp;
            stepAccumulator += Math.max(0, Math.min(timestamp - lastFrameTime, 100));
            lastFrameTime = timestamp;

            if (!helpOverlay.classList.contains('hidden') || isOverlayPaused()) {
                stepAccumulator = 0;
                keys.punchPressed = false;
                keys.jumpBufferTimer = 0;
                keys.actionJustPressed = false;
            } else {
                let updates = 0;
                while (stepAccumulator >= FIXED_STEP_MS && updates < 5) {
                    try {
                        updateGame();
                    } catch (err) {
                        console.error('Error en updateGame:', err);
                    }
                    stepAccumulator -= FIXED_STEP_MS;
                    updates++;
                }
                if (updates >= 5) stepAccumulator = 0;
            }

            try {
                if (gameState === 'INTRO_ROOM') {
                    renderIntroRoomScene();
                } else {
                    renderStarryNightBackground();
                    renderWorld();
                    drawFireworks();
                    if (gameState === 'GAME_OVER') drawGameOverScreen();
                }
            } catch (err) {
                console.error('Error en render:', err);
            }
            try {
                renderTitleScreenParticles();
                renderLilyPortraitPreview();
            } catch (err) {
                console.error('Error en preview:', err);
            }
            requestAnimationFrame(gameLoop);
        }

        // ✨ Partículas estelares sutiles superpuestas en la pantalla de portada (#titleParticlesCanvas)
        const titleParticlesCanvas = document.getElementById('titleParticlesCanvas');
        const titleParticlesCtx = titleParticlesCanvas ? titleParticlesCanvas.getContext('2d') : null;
        const titleStardust = Array.from({ length: 42 }, (_, i) => ({
            x: (i * 97) % 960,
            y: (i * 67) % 540,
            r: 0.9 + (i % 3) * 0.7,
            vx: -0.35 - (i % 4) * 0.14,
            vy: 0.55 + (i % 5) * 0.22,
            phase: i * 0.85,
            isStreak: i % 5 === 0,
            color: i % 3 === 0 ? '#ffe5b4' : (i % 3 === 1 ? '#ffc2e2' : '#e6d4ff')
        }));

        function renderTitleScreenParticles() {
            if (!titleParticlesCtx || gameState !== 'TITLE') return;
            titleParticlesCtx.clearRect(0, 0, 960, 540);
            titleParticlesCtx.save();
            titleParticlesCtx.globalCompositeOperation = 'lighter';

            for (let i = 0; i < titleStardust.length; i++) {
                const p = titleStardust[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.y > 550) { p.y = -10; p.x = (p.x + 230) % 980; }
                if (p.x < -20) { p.x = 970; }

                const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(globalTick * 0.05 + p.phase));
                if (p.isStreak) {
                    const grad = titleParticlesCtx.createLinearGradient(p.x, p.y, p.x - p.vx * 24, p.y - p.vy * 24);
                    grad.addColorStop(0, `rgba(255, 229, 180, ${alpha * 0.85})`);
                    grad.addColorStop(1, 'rgba(255, 182, 220, 0)');
                    titleParticlesCtx.strokeStyle = grad;
                    titleParticlesCtx.lineWidth = 1.4;
                    titleParticlesCtx.beginPath();
                    titleParticlesCtx.moveTo(p.x, p.y);
                    titleParticlesCtx.lineTo(p.x - p.vx * 24, p.y - p.vy * 24);
                    titleParticlesCtx.stroke();
                }

                titleParticlesCtx.globalAlpha = alpha;
                titleParticlesCtx.fillStyle = p.color;
                titleParticlesCtx.beginPath();
                titleParticlesCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                titleParticlesCtx.fill();
            }
            titleParticlesCtx.restore();
        }

        function startGameNow() {
            try { audio.init(); } catch (e) {}
            try { audio.startLullaby(); } catch (e) {}
            try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {}); } catch (e) {}
            titleOverlay.classList.add('hidden');
            const selectEl = document.getElementById('start-level-select');
            const selectedMode = selectEl ? selectEl.value : 'intro';
            deathCount = 0;
            hudDeaths.textContent = '0';
            lily.hearts = 3;
            lily.stars = 0;
            lily.score = 0;
            lily.power = 'none';
            lily.lives = 3;
            lily.lifeAwards = 0;
            lily.hasCatCompanion = false;
            catCompanion.active = false;

            if (selectedMode === 'intro') {
                startIntroRoomScene();
            } else {
                currentLevelIndex = parseInt(selectedMode, 10) || 0;
                buildLevel(currentLevelIndex, false, true);
                gameState = 'PLAYING';
            }
            window.gameState = gameState;
            window.focus();
            canvas.focus();
        }

        // 🌌 Navegación e interacción del Menú de Portada Celestial (3 botones con flechas ⬆️/⬇️ y mouse)
        let titleMenuIndex = 0;
        const btnStart = document.getElementById('btn-start-game');
        const btnTitleOptions = document.getElementById('btn-title-options');
        const btnTitleCredits = document.getElementById('btn-title-credits');
        const titleOptionsPanel = document.getElementById('title-options-panel');
        const btnCloseTitleOptions = document.getElementById('btn-close-title-options');
        const btnPlayFromOptions = document.getElementById('btn-play-from-options');
        const titlePressAny = document.getElementById('title-press-any');
        const startLevelSelect = document.getElementById('start-level-select');
        const titleSelectedModeBadge = document.getElementById('title-selected-mode-badge');
        const titleMenuBtns = [btnStart, btnTitleOptions, btnTitleCredits].filter(Boolean);

        function updateTitleMenuSelection(idx) {
            if (!titleMenuBtns.length) return;
            titleMenuIndex = ((idx % titleMenuBtns.length) + titleMenuBtns.length) % titleMenuBtns.length;
            titleMenuBtns.forEach((btn, i) => {
                if (i === titleMenuIndex) {
                    btn.classList.add('celestial-btn-active');
                    btn.classList.remove('celestial-btn-inactive');
                } else {
                    btn.classList.remove('celestial-btn-active');
                    btn.classList.add('celestial-btn-inactive');
                }
            });
            try {
                if (audio.ctx) audio.playWarmTone(740 + titleMenuIndex * 80, 0.08, 0.035, 'sine', 0.005);
            } catch (e) {}
        }

        function activateTitleMenuSelection() {
            if (titleMenuIndex === 0) {
                startGameNow();
            } else if (titleMenuIndex === 1) {
                if (titleOptionsPanel) titleOptionsPanel.classList.toggle('hidden');
            } else if (titleMenuIndex === 2) {
                helpOverlay.classList.remove('hidden');
            }
        }
        window.updateTitleMenuSelection = updateTitleMenuSelection;
        window.activateTitleMenuSelection = activateTitleMenuSelection;

        titleMenuBtns.forEach((btn, idx) => {
            btn.addEventListener('mouseenter', () => {
                if (titleMenuIndex !== idx) updateTitleMenuSelection(idx);
            });
        });

        if (btnStart) {
            btnStart.addEventListener('click', startGameNow);
            btnStart.addEventListener('touchend', (e) => {
                e.preventDefault();
                startGameNow();
            }, { passive: false });
        }
        if (btnTitleOptions && titleOptionsPanel) {
            btnTitleOptions.addEventListener('click', () => {
                updateTitleMenuSelection(1);
                titleOptionsPanel.classList.remove('hidden');
            });
        }
        if (btnCloseTitleOptions && titleOptionsPanel) {
            btnCloseTitleOptions.addEventListener('click', () => {
                titleOptionsPanel.classList.add('hidden');
            });
        }
        if (btnPlayFromOptions) {
            btnPlayFromOptions.addEventListener('click', () => {
                if (titleOptionsPanel) titleOptionsPanel.classList.add('hidden');
                startGameNow();
            });
        }
        if (btnTitleCredits) {
            btnTitleCredits.addEventListener('click', () => {
                updateTitleMenuSelection(2);
                helpOverlay.classList.remove('hidden');
            });
        }
        if (titlePressAny) {
            titlePressAny.addEventListener('click', startGameNow);
        }
        if (startLevelSelect && titleSelectedModeBadge) {
            const modeShortNames = {
                'intro': '💻 Intro + Aventura',
                '0': '🌙 Mundo 1-1',
                '1': '🌅 Mundo 1-2',
                '2': '☀️ Mundo 1-3',
                '3': '🐙 Mundo 1-4 (Boss)',
                '4': '🏙️ Mundo 2-1',
                '5': '🌇 Mundo 2-2'
            };
            startLevelSelect.addEventListener('change', () => {
                titleSelectedModeBadge.textContent = modeShortNames[startLevelSelect.value] || '💻 Intro + Aventura';
            });
        }

        window.addEventListener('keydown', (e) => {
            if (gameState !== 'TITLE') return;
            const isOptionsOpen = titleOptionsPanel && !titleOptionsPanel.classList.contains('hidden');
            const isHelpOpen = !helpOverlay.classList.contains('hidden');

            if (e.code === 'Escape') {
                if (isHelpOpen) { helpOverlay.classList.add('hidden'); return; }
                if (isOptionsOpen) { titleOptionsPanel.classList.add('hidden'); return; }
            }
            if (isHelpOpen) {
                if (e.code === 'Enter' || e.code === 'Space') {
                    e.preventDefault();
                    helpOverlay.classList.add('hidden');
                }
                return;
            }
            if (isOptionsOpen) {
                if (e.code === 'Enter' && document.activeElement && document.activeElement.id !== 'start-level-select') {
                    e.preventDefault();
                    titleOptionsPanel.classList.add('hidden');
                }
                return;
            }
            if (e.code === 'ArrowUp' || e.code === 'KeyW') {
                e.preventDefault();
                updateTitleMenuSelection((titleMenuIndex + 2) % 3);
                return;
            }
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                e.preventDefault();
                updateTitleMenuSelection((titleMenuIndex + 1) % 3);
                return;
            }
            if (e.code === 'Enter' || e.code === 'Space' || e.code === 'KeyA') {
                e.preventDefault();
                activateTitleMenuSelection();
            }
        });

        document.getElementById('btn-preview-melody').addEventListener('click', () => {
            audio.init();
            if (!audio.isPlayingMusic) {
                audio.startLullaby();
                showToast(`🎶 Escuchando: ${MELODIES[audio.melodyIndex].fullName}`);
            } else {
                audio.cycleMelody();
            }
        });

        btnNextAction.addEventListener('click', () => {
            audio.init();
            victoryOverlay.classList.add('hidden');
            deathCount = 0;
            hudDeaths.textContent = '0';
            lily.hearts = 3;
            lily.stars = 0;
            lily.score = 0;
            lily.power = 'none';
            lily.lives = 3;
            lily.lifeAwards = 0;
            lily.hasCatCompanion = false;
            catCompanion.active = false;
            startIntroRoomScene();
            canvas.focus();
        });

        document.getElementById('btn-music').addEventListener('click', () => {
            audio.toggleMusic();
            canvas.focus();
        });

        document.getElementById('btn-melody').addEventListener('click', () => {
            audio.cycleMelody();
            canvas.focus();
        });

        document.getElementById('btn-sfx').addEventListener('click', () => {
            audio.toggleSfx();
            canvas.focus();
        });

        document.getElementById('volume-slider').addEventListener('input', (e) => {
            audio.init();
            audio.setVolume(parseFloat(e.target.value) / 100);
        });

        document.getElementById('btn-menu').addEventListener('click', openMenu);
        document.getElementById('btn-fullscreen').addEventListener('click', () => {
            try {
                const el = document.documentElement;
                const req = el.requestFullscreen ? el.requestFullscreen() : (el.webkitRequestFullscreen && el.webkitRequestFullscreen());
                Promise.resolve(req).then(() => {
                    if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
                }).catch(() => {});
            } catch (e) {}
        });
        window.addEventListener('resize', syncPauseAudio);
        window.addEventListener('orientationchange', syncPauseAudio);
        document.getElementById('btn-close-menu').addEventListener('click', closeMenu);
        document.getElementById('btn-pause').addEventListener('click', togglePause);
        document.getElementById('btn-resume').addEventListener('click', togglePause);

        document.getElementById('btn-help').addEventListener('click', () => {
            helpOverlay.classList.remove('hidden');
        });
        document.getElementById('btn-close-help').addEventListener('click', () => {
            helpOverlay.classList.add('hidden');
            canvas.focus();
        });

        canvas.addEventListener('pointerdown', () => {
            if (gameState === 'GAME_OVER' && gameOverTick > 60) restartFromLevel1();
            canvas.focus();
        });



function initGame() {
    buildLevel(0);
    gameLoop();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initGame();
} else {
    window.addEventListener('DOMContentLoaded', initGame);
}

