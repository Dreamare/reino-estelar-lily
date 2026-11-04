/**
 * Lily.js - Físicas, animaciones, vidas y poderes del personaje
 */
import { AssetManager } from '../core/AssetLoader.js';
import { drawStarShape, drawHeartShape, drawRoundedRect } from './Collectibles.js';
import { loseCat } from './CatCompanion.js';

const IDLE_TIMELINE = [
    { frame: 0, duration: 2.4, desc: '😌 Quieta (Respirando)' },
    { frame: 1, duration: 0.08, desc: '😑 Parpadeo' },
    { frame: 2, duration: 0.09, desc: '😑 Parpadeo' },
    { frame: 0, duration: 1.8, desc: '😌 Quieta (Respirando)' },
    { frame: 4, duration: 0.22, desc: '🐱 Mueve la colita' },
    { frame: 3, duration: 0.18, desc: '😌 Quieta' },
    { frame: 4, duration: 0.22, desc: '🐱 Mueve la colita' },
    { frame: 0, duration: 2.5, desc: '😌 Quieta (Respirando)' },
    { frame: 5, duration: 0.35, desc: '👀 Mirando al frente' },
    { frame: 6, duration: 1.15, desc: '👀 Mirando hacia atrás' },
    { frame: 5, duration: 0.30, desc: '👀 Volviendo la mirada' },
    { frame: 10, duration: 2.2, desc: '😌 Quieta (Respirando)' },
    { frame: 1, duration: 0.07, desc: '😑 Parpadeo' },
    { frame: 0, duration: 0.12, desc: '😌 Quieta' },
    { frame: 2, duration: 0.08, desc: '😑 Parpadeo' },
    { frame: 8, duration: 2.6, desc: '😌 Quieta (Respirando)' },
    { frame: 9, duration: 0.95, desc: '👓 Acomodándose las gafas' },
    { frame: 7, duration: 0.45, desc: '😊 Suspiro feliz' },
    { frame: 11, duration: 1.8, desc: '😌 Quieta (Respirando)' }
];

function getLilySpriteFrame(state) {
    const sheets = (typeof AssetManager !== 'undefined' && AssetManager.sheets) ? AssetManager.sheets : null;
    const runFps = 10;
    const globalLily = (typeof window !== 'undefined' && window.lily) ? window.lily : null;
    const animTime = (state.animTime !== undefined) ? state.animTime : ((globalLily && globalLily.animTime !== undefined) ? globalLily.animTime : ((state.animTimer || 0)));
    const idleIdx = (state.idleStepIndex !== undefined) ? state.idleStepIndex : ((globalLily && globalLily.idleStepIndex !== undefined) ? globalLily.idleStepIndex : 0);

    // 1. Golpe puñito (Frame 11)
    if ((state.punchTimer || 0) > 0) {
        return { sheetKey: 'action', frameIndex: 11, isIdle: false };
    }
    // 2. En el aire (Salto / Caída: Frames 7, 8, 9, 10)
    if (!state.onGround && !state.sitting) {
        if ((state.jumpStartTimer || 0) > 0) return { sheetKey: 'action', frameIndex: 7, isIdle: false };
        if (state.vy < -2.0) return { sheetKey: 'action', frameIndex: 8, isIdle: false };
        if (state.vy >= -2.0 && state.vy <= 3.5) return { sheetKey: 'action', frameIndex: 9, isIdle: false };
        return { sheetKey: 'action', frameIndex: 10, isIdle: false };
    }
    // 3. Aterrizaje amortiguado (Frame 7)
    if ((state.landTimer || 0) > 0) {
        return { sheetKey: 'action', frameIndex: 7, isIdle: false };
    }
    // 4. Corriendo (Ciclo de 6 cuadros: Frames 0 a 5 a 10 FPS)
    if (Math.abs(state.vx || 0) > 0.35) {
        return { sheetKey: 'action', frameIndex: Math.floor(animTime * runFps) % 6, isIdle: false };
    }
    // 5. Reposo / Idle con 12 cuadros de micro-gestos y respiración (sprites_lily_reposo.jpg)
    if (sheets && sheets.idle && sheets.idle.loaded) {
        const step = IDLE_TIMELINE[idleIdx] || IDLE_TIMELINE[0];
        return { sheetKey: 'idle', frameIndex: step.frame, isIdle: true };
    }
    return { sheetKey: 'action', frameIndex: 6, isIdle: true };
}


export function createLilyState() {
    return {
        x: 48,
        y: 300,
        w: 38,
        h: 56,
        vx: 0,
        vy: 0,
        onGround: false,
        groundType: 'normal',
        facing: 1,
        animTimer: 0,
        animTime: 0,
        frame: 0,
        idleStepIndex: 0,
        idleStepTimer: 0,
        landTimer: 0,
        jumpStartTimer: 0,
        wasOnGround: false,
        hearts: 3,
        maxHearts: 3,
        lives: 3,
        invincibleTimer: 0,
        dead: false,
        dyingTimer: 0,
        landingInProgress: false,
        inSpaceship: false,
        stars: 0,
        score: 0,
        hasRocket: false,
        rocketTimer: 0,
        hasDoubleJump: true,
        canDoubleJump: true,
        punchTimer: 0,
        hasCatCompanion: false
    };
}

        function checkExtraHeart() {
            const earned = Math.floor(lily.stars / 50);
            while (lily.lifeAwards < earned) {
                lily.lifeAwards++;
                lily.lives++;
                lily.score += 1000;
                audio.playPowerUp();
                addFloatingText(lily.x + 18, lily.y - 20, '❤️ ¡Vida Extra!', '#ff85c0');
                showToast(`❤️ ¡50 estrellitas! Ganaste una vida extra (${lily.lives} vidas)`, 3000);
            }
        }



        function hurtLily(attacker = null, extraDamage = 1) {
            if (gameState !== 'PLAYING' || lily.invincibleTimer > 0 || lily.inSpaceship || lily.landingInProgress) return;
            // 🐱 El gatito protector bloquea las balas/disparos
            if (catCompanion.active && attacker && attacker.isProjectile) {
                lily.invincibleTimer = 20;
                catCompanion.shieldCooldown = 40;
                audio.playStarShimmer();
                addParticles(lily.x + 18, lily.y + 20, 10, 'star', '#b5f5ec');
                addFloatingText(catCompanion.x, catCompanion.y - 14, '🐾 ¡Escudo Michi!', '#b5f5ec');
                return;
            }
            // 🐱💔 Si un marciano, hombre enmascarado o zombie toca a Lily, pierde al gatito (pero no energía)
            if (catCompanion.active && attacker && attacker.kind && !attacker.isProjectile) {
                const loseMsg = attacker.kind === 'zombie_masked'
                    ? '🧟 ¡Un hombre zombie te atacó!'
                    : (attacker.kind === 'masked_man'
                        ? '👤 ¡Un hombre enmascarado te tocó!'
                        : (attacker.kind === 'falling_ladder'
                            ? '💥 ¡Una escalera te cayó encima!'
                            : '👽 ¡Un marciano te tocó!'));
                loseCat(loseMsg);
                const pd = (lily.x + lily.w / 2) >= (attacker.x + (attacker.w || 0) / 2) ? 1 : -1;
                lily.vx = pd * 5.8;
                lily.vy = -7.5;
                lily.invincibleTimer = 90;
                updateHUD();
                return;
            }
            lily.invincibleTimer = 90;
            audio.playCollision();   // 💥 sonido de choque / golpe
            addParticles(lily.x + 18, lily.y + 20, 10, 'star', '#ffe58f');

            // Si un enemigo, trampa o proyectil golpeó a Lily, mostrar impacto e impulso de retroceso
            if (attacker && attacker.kind) {
                if (attacker.punchTimer !== undefined) attacker.punchTimer = 28;
                const pushDir = (lily.x + lily.w / 2) >= (attacker.x + (attacker.w || 0) / 2) ? 1 : -1;
                lily.vx = pushDir * 5.8;
                const hitText = attacker.isProjectile
                    ? (attacker.kind === 'fire' ? '🔥 ¡Fuego Marciano!' : (attacker.kind === 'debris' ? '🪨 ¡Escombros Afilados!' : '⚡ ¡Láser Alienígena!'))
                    : (attacker.kind === 'falling_ladder'
                        ? '💥 ¡APLASTADA POR ESCALERA!'
                        : (attacker.kind === 'zombie_masked'
                            ? '🧟 ¡ZOMBIE TE ATRAPÓ!'
                            : (attacker.kind === 'masked_man'
                                ? '👤 ¡Hombre Enmascarado!'
                                : '💥 ¡Golpe Marciano!')));
                addFloatingText(lily.x + 18, lily.y - 18, hitText, '#ff85a1');
            }

            if (lily.power !== 'none' && extraDamage === 1) {
                lily.power = 'none';
                addFloatingText(lily.x + 18, lily.y - 34, '¡Perdiste el poder!', '#ffc2e2');
                addParticles(lily.x + 18, lily.y + 20, 12, 'sparkle');
                updateHUD();
                return;
            }
            if (lily.power !== 'none' && extraDamage > 1) {
                lily.power = 'none';
                lily.hearts -= (extraDamage - 1);
            } else {
                lily.hearts -= extraDamage;
            }
            addParticles(lily.x + 18, lily.y + 20, 14, 'heart', '#ff85c0');

            if (lily.hearts <= 0) {
                killLily('hearts');
            } else {
                lily.vy = -7.5;
                updateHUD();
            }
        }



        function drawLilyCharacter(c, centerX, centerY, scale = 1, state = null) {
            const s = state || (typeof window !== 'undefined' ? window.lily : null) || {};
            const globalTick = (typeof window !== 'undefined' && window.globalTick !== undefined) ? window.globalTick : (s.animTimer || 0);
            state = s;

            // =================================================================
            // 🌟 MOTOR DE SPRITES: HOJAS 2x6 AISLADAS (Acción + Reposo)
            // =================================================================
            const sheets = (typeof AssetManager !== 'undefined' && AssetManager.sheets) ? AssetManager.sheets : null;
            if (sheets && (sheets.action.loaded || sheets.idle.loaded)) {
                const frameInfo = getLilySpriteFrame(state);
                const activeSheet = (sheets[frameInfo.sheetKey] && sheets[frameInfo.sheetKey].loaded)
                    ? sheets[frameInfo.sheetKey]
                    : (sheets.action.loaded ? sheets.action : sheets.idle);

                if (activeSheet && activeSheet.loaded && activeSheet.frames.length > 0) {
                    const frame = activeSheet.frames[frameInfo.frameIndex] || activeSheet.frames[0];
                    const refHeight = frameInfo.sheetKey === 'action' && activeSheet.frames[6]
                        ? activeSheet.frames[6].charH
                        : activeSheet.avgHeight;

                    // Escala base calibrada al alto de Lily en el mundo
                    const baseScale = (68 * scale) / refHeight;
                    const globalLily = (typeof window !== 'undefined' && window.lily) ? window.lily : null;
                    const animClock = (state.animTime !== undefined) ? state.animTime : ((globalLily && globalLily.animTime !== undefined) ? globalLily.animTime : (globalTick / 60));

                    let breathScaleX = 1.0;
                    let breathScaleY = 1.0;
                    if (frameInfo.isIdle) {
                        const breathWave = Math.sin(animClock * 2.4);
                        breathScaleY = 1.0 + breathWave * 0.014;
                        breathScaleX = 1.0 - breathWave * 0.006;
                    }

                    // Anclaje al piso (pies exactamente en la base de la caja de colisión de Lily)
                    const halfH = (state && state.h) ? (state.h / 2) : 25;
                    const feetY = centerY + halfH * scale;

                    c.save();
                    c.translate(centerX, feetY);

                    if (state.rotation) {
                        c.rotate(state.rotation);
                    }
                    c.scale((state.facing || 1) * breathScaleX, breathScaleY);

                    if (state.invincibleTimer > 0 && Math.floor(state.invincibleTimer / 4) % 2 === 0) {
                        c.globalAlpha = 0.5;
                    }

                    // Aura mágica estelar al tener poder activo
                    if (state.power && state.power !== 'none') {
                        const auraGrad = c.createRadialGradient(0, -28 * scale, 6, 0, -28 * scale, 36);
                        if (state.power === 'bell') {
                            auraGrad.addColorStop(0, 'rgba(255, 229, 143, 0.55)');
                            auraGrad.addColorStop(1, 'rgba(255, 133, 192, 0)');
                        } else {
                            auraGrad.addColorStop(0, 'rgba(181, 245, 236, 0.55)');
                            auraGrad.addColorStop(1, 'rgba(211, 173, 247, 0)');
                        }
                        c.fillStyle = auraGrad;
                        c.beginPath();
                        c.arc(0, -28 * scale, 36, 0, Math.PI * 2);
                        c.fill();
                    }

                    // Mochila Cohete Propulsor en la espalda
                    if (state.rocketTimer && state.rocketTimer > 0) {
                        c.save();
                        c.fillStyle = '#ff4d94';
                        c.strokeStyle = '#ffffff';
                        c.lineWidth = 1.5;
                        drawRoundedRect(c, -17 * scale, -32 * scale, 8 * scale, 16 * scale, 3);
                        c.fill();
                        c.stroke();
                        const jetFlicker = Math.sin((state.animTime || (globalTick * 0.1)) * 40) * 3;
                        c.fillStyle = '#ff7a45';
                        c.beginPath();
                        c.moveTo(-16 * scale, -16 * scale);
                        c.lineTo(-13 * scale, (-6 + jetFlicker) * scale);
                        c.lineTo(-10 * scale, -16 * scale);
                        c.closePath();
                        c.fill();
                        c.restore();
                    }

                    const destW = frame.cellW * baseScale;
                    const destH = frame.cellH * baseScale;
                    const offsetX = -frame.pivotX * baseScale;
                    const offsetY = -frame.pivotBottomY * baseScale;

                    c.drawImage(frame.canvas, offsetX, offsetY, destW, destH);
                    c.restore();
                    return;
                }
            }

            c.save();
            c.translate(centerX, centerY);

            if (state.rotation) {
                c.rotate(state.rotation);
            }
            c.scale(scale * (state.facing || 1), scale);

            if (state.invincibleTimer > 0 && Math.floor(state.invincibleTimer / 4) % 2 === 0) {
                c.globalAlpha = 0.5;
            }

            // Magical Star Aura when powered up
            if (state.power && state.power !== 'none') {
                const auraGrad = c.createRadialGradient(0, 0, 8, 0, 0, 40);
                if (state.power === 'bell') {
                    auraGrad.addColorStop(0, 'rgba(255, 229, 143, 0.52)');
                    auraGrad.addColorStop(1, 'rgba(255, 133, 192, 0)');
                } else {
                    auraGrad.addColorStop(0, 'rgba(181, 245, 236, 0.52)');
                    auraGrad.addColorStop(1, 'rgba(211, 173, 247, 0)');
                }
                c.fillStyle = auraGrad;
                c.beginPath();
                c.arc(0, 0, 40, 0, Math.PI * 2);
                c.fill();
            }

            const isSitting = !!state.sitting;
            const bounceBob = isSitting
                ? Math.sin(globalTick * 0.06) * 0.8
                : (state.onGround ? Math.sin((state.animTimer || 0) * 2.2) * 1.8 : -1.5);
            c.translate(0, bounceBob);

            const sway = state.hairSway || Math.sin(globalTick * 0.06) * 1.8;
            const hairBlack = '#1f1c24';     // Deep soft black-brown hair from reference
            const hairShade = '#141118';     // Deeper shadow strands
            const hairShine = '#3e3847';     // Subtle 3D sheen highlight
            const skinTone = '#f7d2ba';      // Warm fair skin tone
            const sweaterPink = state.power === 'bubble' ? '#7de2d1' : '#f582ae';
            const sweaterRib = state.power === 'bubble' ? '#5cd1be' : '#e06796';

            // ==================================================================
            // 1. BACK WAVY DARK HAIR DRAPING OVER SHOULDERS + ROCKET JETPACK
            // ==================================================================
            if (state.rocketTimer && state.rocketTimer > 0) {
                c.save();
                drawMagicBloom(c, -13, 18, 22, 'rgba(255, 169, 64, 0.65)', 'rgba(255, 77, 148, 0)');
                // Mochila Cohete Propulsor en la espalda de Lily
                c.fillStyle = '#ff4d94';
                c.strokeStyle = '#ffffff';
                c.lineWidth = 1.6;
                drawRoundedRect(c, -17, -6, 9, 17, 4);
                c.fill();
                c.stroke();

                // Punta dorada del cohete y alerón
                c.fillStyle = '#ffe58f';
                c.beginPath();
                c.moveTo(-17, -6);
                c.lineTo(-12.5, -13);
                c.lineTo(-8, -6);
                c.closePath();
                c.fill();

                // Chorro de fuego del cohete
                const jetFlicker = Math.sin(globalTick * 0.7) * 4;
                c.fillStyle = '#ff7a45';
                c.beginPath();
                c.moveTo(-16, 11);
                c.lineTo(-12.5, 24 + jetFlicker);
                c.lineTo(-9, 11);
                c.closePath();
                c.fill();

                c.fillStyle = '#fffb8f';
                c.beginPath();
                c.moveTo(-14.5, 11);
                c.lineTo(-12.5, 18 + jetFlicker * 0.5);
                c.lineTo(-10.5, 11);
                c.closePath();
                c.fill();
                c.restore();
            }

            // 🎨 RENDERIZADO CON SPRITESHEET (./asets/sprites_lily.png) + FALLBACK VECTORIAL
            if (AssetManager.isReady('lily')) {
                const lilySheet = AssetManager.get('lily');
                let frameIndex = 0; // Frame 1: Idle / quieta
                if (!state.onGround && !isSitting) {
                    frameIndex = 3; // Frame 4: Saltando
                } else if (Math.abs(state.vx || 0) > 0.3) {
                    // Alterna entre los frames 2 y 3 según state.animTimer (correr)
                    frameIndex = (Math.floor((state.animTimer || 0) * 1.15) % 2 === 0) ? 1 : 2;
                }
                const fr = AssetManager.sprites.lily[frameIndex];
                const drawH = 54;
                const drawW = drawH * (fr.w / fr.h);
                const destX = -drawW * 0.46;
                const destY = (isSitting ? 19 : 22.5) - drawH;

                c.drawImage(lilySheet, fr.x, fr.y, fr.w, fr.h, destX, destY, drawW, drawH);
                c.restore();
                return;
            }

            c.save();
            c.fillStyle = hairShade;
            c.beginPath();
            c.moveTo(-15, -12);
            c.bezierCurveTo(-22 - sway * 0.6, -2, -23 - sway * 0.9, 9, -17 - sway * 0.7, 13);
            c.bezierCurveTo(-12, 16, 12, 16, 17 - sway * 0.4, 13);
            c.bezierCurveTo(22 - sway * 0.5, 9, 21 - sway * 0.3, -2, 15, -12);
            c.closePath();
            c.fill();
            c.restore();

            // ==================================================================
            // 2. DARK CHARCOAL PANTS WITH ROLLED CUFFS & PINK SNEAKERS
            // ==================================================================
            const legSwing = (!isSitting && state.onGround && Math.abs(state.vx || 0) > 0.3)
                ? Math.sin((state.animTimer || 0) * 2.5) * 5.5
                : (isSitting ? 4 : (state.onGround ? 0 : 3.5));

            const drawLegAndSneaker = (offsetX, swingOffset) => {
                c.save();
                c.translate(offsetX + swingOffset * 0.45, isSitting ? 10 : 11);
                if (isSitting) c.rotate(-0.35);

                // Dark charcoal pants leg (#333945)
                c.fillStyle = '#333945';
                drawRoundedRect(c, -3.6, 0, 7.2, 9.5, 2);
                c.fill();

                // Rolled-up cuff at ankle (#4c5466)
                c.fillStyle = '#4c5466';
                drawRoundedRect(c, -4.1, 7.2, 8.2, 2.8, 1.4);
                c.fill();

                // Ankle skin peek
                c.fillStyle = skinTone;
                c.fillRect(-2.5, 9.8, 5, 1.8);

                // Pink Sneaker body (#f58ab5)
                c.fillStyle = '#f58ab5';
                drawRoundedRect(c, -4.2, 11, 9.2, 5.2, 2.6);
                c.fill();

                // Light pink sneaker toe cap
                c.fillStyle = '#ffd1e6';
                c.beginPath();
                c.arc(2.5, 13.8, 2.6, -Math.PI * 0.5, Math.PI * 0.5);
                c.fill();

                // White shoe laces detail
                c.strokeStyle = '#ffffff';
                c.lineWidth = 1.1;
                c.beginPath();
                c.moveTo(-1, 11.8);
                c.lineTo(1.2, 11.8);
                c.moveTo(-1, 13.2);
                c.lineTo(1.2, 13.2);
                c.stroke();

                // Crisp White Sneaker Sole
                c.fillStyle = '#ffffff';
                drawRoundedRect(c, -4.5, 15.2, 9.8, 2.2, 1.1);
                c.fill();

                c.restore();
            };

            // Back leg & Front leg
            drawLegAndSneaker(-4.5, -legSwing);
            drawLegAndSneaker(4.5, legSwing);

            // ==================================================================
            // 3. BACK ARM + CLEARLY VISIBLE HAND (MANITO VISIBLE CON DEDITOS)
            // ==================================================================
            const armSwing = (!isSitting && state.onGround && Math.abs(state.vx || 0) > 0.3)
                ? Math.sin((state.animTimer || 0) * 2.5) * 0.38
                : (!state.onGround && !isSitting ? -0.55 : 0.12);

            const drawArmWithHand = (side, angleRad, isReaching = false) => {
                c.save();
                const shoulderX = side === 'left' ? -10.5 : 10.5;
                const shoulderY = 0.5;
                c.translate(shoulderX, shoulderY);
                c.rotate(isReaching ? -0.85 : angleRad);

                // Puffy Pink Sweater Sleeve
                c.fillStyle = sweaterPink;
                c.beginPath();
                c.moveTo(-3.2, -1);
                c.quadraticCurveTo(side === 'left' ? -6.5 : 6.5, 4.5, -3.8, 9.5);
                c.lineTo(3.8, 9.5);
                c.quadraticCurveTo(side === 'left' ? 4.5 : -4.5, 4.5, 3.2, -1);
                c.closePath();
                c.fill();

                // Ribbed Sleeve Cuff
                c.fillStyle = sweaterRib;
                drawRoundedRect(c, -3.5, 8.8, 7.0, 2.4, 1.2);
                c.fill();

                // CLEARLY VISIBLE HAND (Palm + Distinct Thumb + Rounded Fingers)
                c.save();
                c.translate(0, 13.0);
                c.fillStyle = skinTone;
                c.strokeStyle = '#d9a78c';
                c.lineWidth = 0.8;

                // Rounded Palm & Fingers
                c.beginPath();
                c.arc(0, 0, 3.3, 0, Math.PI * 2);
                c.fill();
                c.stroke();

                // Distinct Little Thumb pointing inward/forward
                const thumbDir = side === 'left' ? 1 : -1;
                c.beginPath();
                c.ellipse(thumbDir * 2.8, -0.6, 1.8, 1.2, thumbDir * 0.4, 0, Math.PI * 2);
                c.fill();
                c.stroke();

                // Subtle finger separation lines so her little fingers are unmistakable
                c.beginPath();
                c.moveTo(-1.1, 1.2);
                c.lineTo(-1.1, 2.9);
                c.moveTo(1.1, 1.2);
                c.lineTo(1.1, 2.9);
                c.stroke();

                c.restore();
                c.restore();
            };

            // Draw left (back) arm
            drawArmWithHand('left', -armSwing * 0.8 + 0.18, false);

            // ==================================================================
            // 4. PINK PUFFY SWEATER / PULLOVER WITH SMALL DARK HEART ON CHEST
            // ==================================================================
            c.fillStyle = sweaterPink;
            drawRoundedRect(c, -11.5, -2.5, 23, 14.5, 5.5);
            c.fill();

            // Sweater bottom ribbed waistband
            c.fillStyle = sweaterRib;
            drawRoundedRect(c, -11.0, 9.8, 22, 2.6, 1.3);
            c.fill();

            // Neck skin & Ribbed crew-neck collar
            c.fillStyle = skinTone;
            c.beginPath();
            c.arc(0, -2.5, 3.5, 0, Math.PI);
            c.fill();
            c.strokeStyle = sweaterRib;
            c.lineWidth = 2.0;
            c.beginPath();
            c.arc(0, -2.6, 4.2, 0.08 * Math.PI, 0.92 * Math.PI);
            c.stroke();

            // Small Dark-Rose Heart on the left side of her chest (viewer's right, X = +4.5)
            drawHeartShape(c, 4.6, 1.8, 4.2, '#6d2e46');

            // Draw right (front) arm & hand (reaches out if touching the computer screen!)
            drawArmWithHand('right', armSwing - 0.15, !!state.reachingArm);

            // ==================================================================
            // 5. HEAD, FACE, ROUND DARK GLASSES & BIG BROWN EYES
            // ==================================================================
            // Dark hair crown behind head
            c.fillStyle = hairBlack;
            c.beginPath();
            c.arc(0, -13.5, 15.8, 0, Math.PI * 2);
            c.fill();

            // Chibi Head (Soft warm skin)
            c.fillStyle = skinTone;
            c.beginPath();
            c.ellipse(0, -12.0, 13.8, 12.6, 0, 0, Math.PI * 2);
            c.fill();

            // Soft Dark Eyebrows
            c.strokeStyle = '#231f28';
            c.lineWidth = 1.6;
            c.lineCap = 'round';
            c.beginPath();
            c.arc(-5.2, -16.2, 3.2, 1.15 * Math.PI, 1.85 * Math.PI);
            c.stroke();
            c.beginPath();
            c.arc(5.6, -16.2, 3.2, 1.15 * Math.PI, 1.85 * Math.PI);
            c.stroke();

            // Big Expressive Dark Brown Eyes
            const drawEye = (ex, ey) => {
                // Dark brown iris
                c.fillStyle = '#261712';
                c.beginPath();
                c.ellipse(ex, ey, 3.3, 3.8, 0, 0, Math.PI * 2);
                c.fill();

                // Warm chestnut lower crescent
                c.fillStyle = '#593728';
                c.beginPath();
                c.arc(ex, ey + 1.2, 2.2, 0, Math.PI);
                c.fill();

                // Main white studio highlight
                c.fillStyle = '#ffffff';
                c.beginPath();
                c.arc(ex - 1.1, ey - 1.3, 1.35, 0, Math.PI * 2);
                c.fill();
                // Secondary tiny sparkle
                c.beginPath();
                c.arc(ex + 1.2, ey + 1.1, 0.65, 0, Math.PI * 2);
                c.fill();
            };
            drawEye(-5.0, -11.8);
            drawEye(5.4, -11.8);

            // Rosy Blush Cheeks
            c.fillStyle = 'rgba(255, 125, 165, 0.48)';
            c.beginPath();
            c.ellipse(-8.8, -8.2, 2.8, 1.6, 0, 0, Math.PI * 2);
            c.ellipse(9.0, -8.2, 2.8, 1.6, 0, 0, Math.PI * 2);
            c.fill();

            // Cute Little Nose & Sweet Gentle Smile
            c.fillStyle = '#e0ad94';
            c.beginPath();
            c.arc(0.2, -9.8, 1.0, 0, Math.PI * 2);
            c.fill();

            c.strokeStyle = '#b56557';
            c.lineWidth = 1.4;
            c.lineCap = 'round';
            c.beginPath();
            c.arc(0.2, -7.8, 2.6, 0.15 * Math.PI, 0.85 * Math.PI);
            c.stroke();

            // ROUND DARK-FRAMED GLASSES (Gafas redondas grandes características de Lily)
            c.save();
            // Subtle lens glass reflection
            c.fillStyle = 'rgba(255, 255, 255, 0.14)';
            c.beginPath();
            c.arc(-5.0, -11.8, 5.2, 0, Math.PI * 2);
            c.arc(5.4, -11.8, 5.2, 0, Math.PI * 2);
            c.fill();

            c.strokeStyle = '#231d26';
            c.lineWidth = 1.75;
            // Left round frame
            c.beginPath();
            c.arc(-5.0, -11.8, 5.2, 0, Math.PI * 2);
            c.stroke();
            // Right round frame
            c.beginPath();
            c.arc(5.4, -11.8, 5.2, 0, Math.PI * 2);
            c.stroke();
            // Center nose bridge
            c.beginPath();
            c.moveTo(0.2 - 0.3, -12.2);
            c.quadraticCurveTo(0.2, -13.2, 0.2 + 0.3, -12.2);
            c.stroke();
            c.restore();

            // ==================================================================
            // 6. FRONT SWEPT DARK BANGS & WAVY SHOULDER LOCKS
            // ==================================================================
            c.fillStyle = hairBlack;
            // Swept side-parted bangs across forehead (matching reference image)
            c.beginPath();
            c.moveTo(-14.5, -15.5);
            c.quadraticCurveTo(-6, -15.0, 3.5, -20.5);
            c.quadraticCurveTo(10.5, -16.5, 14.5, -14.5);
            c.lineTo(14.8, -21);
            c.quadraticCurveTo(0, -27.5, -14.8, -21);
            c.closePath();
            c.fill();

            // Soft 3D hair shine curve on bangs
            c.strokeStyle = hairShine;
            c.lineWidth = 2.0;
            c.lineCap = 'round';
            c.beginPath();
            c.moveTo(-8, -20.5);
            c.quadraticCurveTo(-2, -23.0, 4, -21.0);
            c.stroke();

            // Left & Right Wavy Shoulder Locks framing her face and resting on her pink sweater
            const drawWavyLock = (isLeft) => {
                const dir = isLeft ? -1 : 1;
                c.fillStyle = hairBlack;
                c.beginPath();
                c.moveTo(dir * 13.2, -15.5);
                c.bezierCurveTo(dir * 16.5, -9, dir * 11.5, -3, dir * 14.5, 2.5);
                c.bezierCurveTo(dir * 16.0, 5.5, dir * 11.0, 7.5, dir * 9.0, 4.5);
                c.bezierCurveTo(dir * 7.5, 1.0, dir * 11.5, -4, dir * 10.5, -14);
                c.closePath();
                c.fill();
            };
            drawWavyLock(true);
            drawWavyLock(false);

            // ==================================================================
            // 7. PINK CAT-EAR HEADPHONES / DIADEMA ROSA CON OREJITAS REDONDEADAS
            //    (Rounded, plush padded cat ears + pink headphone ear-cups!)
            // ==================================================================
            const earTwitch = Math.sin((state.earTwitchTimer || globalTick) * 0.12) > 0.93 ? 0.08 : 0;

            // Thick Cushioned Pink Headband Arch over her hair
            c.strokeStyle = '#f58ab5';
            c.lineWidth = 4.6;
            c.lineCap = 'round';
            c.beginPath();
            c.arc(0, -12.5, 15.8, Math.PI * 1.05, Math.PI * 1.95);
            c.stroke();

            // Soft highlight along headband arch
            c.strokeStyle = '#ffb8d6';
            c.lineWidth = 1.6;
            c.beginPath();
            c.arc(0, -13.2, 15.8, Math.PI * 1.15, Math.PI * 1.85);
            c.stroke();

            // Pink Headphone Ear-Cups on both sides of her head (as in reference image!)
            const drawEarCup = (sideSign) => {
                c.save();
                c.translate(sideSign * 15.2, -11.5);
                // Inner cushion pad
                c.fillStyle = '#e06796';
                drawRoundedRect(c, -2.5, -5.2, 5.0, 10.4, 2.4);
                c.fill();
                // Outer pink shell
                c.fillStyle = '#f794bc';
                drawRoundedRect(c, sideSign > 0 ? -1.2 : -3.2, -5.8, 4.4, 11.6, 2.2);
                c.fill();
                c.restore();
            };
            drawEarCup(-1);
            drawEarCup(1);

            // ROUNDED, PLUSH CAT EARS ON THE HEADBAND (Curved dome-like ears, NOT sharp triangles!)
            const drawPlushRoundedCatEar = (tx, ty, baseAngle) => {
                c.save();
                c.translate(tx, ty);
                c.rotate(baseAngle);

                // Outer plush pink rounded cat ear using smooth bezier curves
                c.fillStyle = '#f78fb8';
                c.strokeStyle = '#e06796';
                c.lineWidth = 1.2;
                c.beginPath();
                c.moveTo(-6.8, 3.5);
                // Smoothly curved left side rising to a soft rounded tip
                c.bezierCurveTo(-7.2, -4.5, -3.5, -10.2, 0, -10.2);
                // Smoothly curved right side descending back to headband
                c.bezierCurveTo(3.5, -10.2, 7.2, -4.5, 6.8, 3.5);
                c.quadraticCurveTo(0, 4.8, -6.8, 3.5);
                c.closePath();
                c.fill();
                c.stroke();

                // Soft pastel inner ear recess (also softly rounded)
                c.fillStyle = '#ffc9e0';
                c.beginPath();
                c.moveTo(-4.0, 2.2);
                c.bezierCurveTo(-4.2, -2.8, -2.0, -6.5, 0, -6.5);
                c.bezierCurveTo(2.0, -6.5, 4.2, -2.8, 4.0, 2.2);
                c.quadraticCurveTo(0, 3.0, -4.0, 2.2);
                c.closePath();
                c.fill();

                c.restore();
            };

            drawPlushRoundedCatEar(-9.5, -24.5, -0.34 - earTwitch);
            drawPlushRoundedCatEar(9.5, -24.5, 0.34 + earTwitch);

            c.restore();
        }

        /******************************************************************
         * RENDER COZY BEDROOM & PINK COMPUTER INTRO SCENE
         ******************************************************************/



        function renderLilyPortraitPreview(customCtx = null, customTick = null, customIsTitle = null) {
            const isTitle = (customIsTitle !== null) ? customIsTitle : (typeof window !== 'undefined' ? window.gameState === 'TITLE' : true);
            if (!isTitle) return;
            const pCtx = customCtx || (typeof window !== 'undefined' ? window.previewCtx : null);
            if (!pCtx) return;
            const gTick = (customTick !== null) ? customTick : (typeof window !== 'undefined' ? window.globalTick || 0 : 0);

            pCtx.clearRect(0, 0, 128, 128);
            drawStarShape(pCtx, 22, 24, 4, 5, 2, '#ffe58f');
            drawStarShape(pCtx, 104, 28, 4, 6, 2.5, '#ffc2e2');
            drawLilyCharacter(pCtx, 64, 72, 1.75, {
                facing: 1,
                onGround: true,
                animTimer: gTick * 0.035,
                vx: 0,
                vy: 0,
                hairSway: Math.sin(gTick * 0.05) * 1.5,
                earTwitchTimer: gTick,
                power: 'none',
                invincibleTimer: 0
            });
        }


export {
    IDLE_TIMELINE,
    getLilySpriteFrame,
    drawLilyCharacter,
    renderLilyPortraitPreview,
    checkExtraHeart,
    hurtLily
};
