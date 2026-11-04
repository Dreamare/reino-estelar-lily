/**
 * Collectibles.js - Cofres, estrellas, burbujas y cohetes
 */
import { AssetManager, drawMagicBloom } from '../core/AssetLoader.js';
const FW_COLORS = ['#ff85c0', '#ffe58f', '#b5f5ec', '#d3adf7', '#ffa940', '#95de64', '#ffffff'];
const fireworks = { rockets: [], sparks: [] };
const getAudio = () => (typeof window !== 'undefined' ? window.audio : null);
const getGameState = () => (typeof window !== 'undefined' ? window.gameState || 'TITLE' : 'TITLE');

const getGlobalTick = () => (typeof window !== 'undefined' ? window.globalTick || 0 : 0);


        function drawStarShape(c, cx, cy, spikes, outerR, innerR, color) {
            let rot = (Math.PI / 2) * 3;
            let x = cx;
            let y = cy;
            const step = Math.PI / spikes;

            c.save();
            c.beginPath();
            c.moveTo(cx, cy - outerR);
            for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerR;
                y = cy + Math.sin(rot) * outerR;
                c.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerR;
                y = cy + Math.sin(rot) * innerR;
                c.lineTo(x, y);
                rot += step;
            }
            c.lineTo(cx, cy - outerR);
            c.closePath();
            c.fillStyle = color;
            c.fill();
            c.restore();
        }



        function drawHeartShape(c, x, y, size, color) {
            c.save();
            c.translate(x, y);
            c.beginPath();
            const topCurveHeight = size * 0.3;
            c.moveTo(0, topCurveHeight);
            c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
            c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
            c.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
            c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
            c.closePath();
            c.fillStyle = color;
            c.fill();
            c.restore();
        }



        function drawRoundedRect(c, x, y, w, h, r) {
            c.beginPath();
            c.moveTo(x + r, y);
            c.lineTo(x + w - r, y);
            c.quadraticCurveTo(x + w, y, x + w, y + r);
            c.lineTo(x + w, y + h - r);
            c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            c.lineTo(x + r, y + h);
            c.quadraticCurveTo(x, y + h, x, y + h - r);
            c.lineTo(x, y + r);
            c.quadraticCurveTo(x, y, x + r, y);
            c.closePath();
        }

        /******************************************************************
         * DRAW LILY EXACTLY MATCHING REFERENCE IMAGE `Lily.jpeg`:
         * - Long wavy dark black/brown hair over shoulders with side part
         * - Round dark-framed glasses over big dark brown eyes
         * - Pink cat-ear headphone headband with ROUNDED, PLUSH CAT EARS
         *   (soft curved arcs, NOT sharp triangles) & side ear-cups
         * - Pink puffy long-sleeve sweater with small dark-rose heart on chest
         * - Clearly visible little skin-toned hands with thumb & fingers!
         * - Dark charcoal pants with rolled cuffs & pink sneakers with white soles
         ******************************************************************/


        function drawSurpriseGiftBox(b) {
            const by = b.y + b.bounceY;
            const special = b.type === 'mystery';
            const o = b.openProgress || 0;
            ctx.save();
            ctx.translate(b.x + b.w / 2, by + b.h);   // origen: base del cofre

            // ✨ Resplandor bloom detrás de los cofres abiertos o especiales
            if (b.used || o > 0.05 || special) {
                const bloomRadius = (b.used || o > 0.3) ? 44 : 34;
                const bloomAlpha = (b.used || o > 0.3) ? 0.65 : 0.42;
                drawMagicBloom(ctx, 0, -20, bloomRadius, `rgba(255, 229, 143, ${bloomAlpha})`, 'rgba(255, 133, 192, 0)');
            }

            if (AssetManager.isReady('props')) {
                // 🎨 Cofres del tesoro de la Fila 2 (./asets/sprites_props_enemies.png)
                const propsSheet = AssetManager.get('props');
                const chests = AssetManager.sprites.props.chests;
                let chestIdx;
                if (!b.used && o < 0.15) {
                    chestIdx = special ? 4 : 0; // Frame cerrado
                } else if (o < 0.5) {
                    chestIdx = special ? 5 : 1; // Frame entreabierto
                } else if (o < 0.85 && !b.used) {
                    chestIdx = special ? 6 : 2; // Frame abriéndose con brillo
                } else {
                    chestIdx = 7;               // Frame abierto brillando con estrellas
                }
                const fr = chests[chestIdx];
                const drawW = 54;
                const drawH = drawW * (fr.h / fr.w);

                // Sombra suave en el suelo
                ctx.fillStyle = 'rgba(0,0,0,0.25)';
                ctx.beginPath();
                ctx.ellipse(0, 0, 24, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.drawImage(propsSheet, fr.x, fr.y, fr.w, fr.h, -drawW / 2, -drawH + 2, drawW, drawH);
                ctx.restore();
                return;
            }

            // Fallback vectorial original
            // sombra
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.beginPath(); ctx.ellipse(0, 0, 25, 4, 0, 0, Math.PI * 2); ctx.fill();
            const wood = b.used ? '#6b5a8e' : (special ? '#c0507f' : '#8c5a3c');
            const woodL = b.used ? '#8777ad' : (special ? '#e87aa8' : '#b27a52');
            const gold = b.used ? '#b9a9d9' : '#ffd666';
            // interior luminoso al abrir
            if (o > 0) {
                ctx.fillStyle = `rgba(255, 240, 160, ${0.9 * Math.min(1, o)})`;
                drawRoundedRect(ctx, -17, -26, 34, 8, 3); ctx.fill();
            }
            // cuerpo
            ctx.fillStyle = wood; ctx.strokeStyle = '#2b1740'; ctx.lineWidth = 2.5;
            drawRoundedRect(ctx, -21, -22, 42, 22, 5); ctx.fill(); ctx.stroke();
            ctx.fillStyle = woodL; ctx.fillRect(-18, -19, 36, 4);
            // bandas doradas
            ctx.fillStyle = gold;
            ctx.fillRect(-14, -22, 5, 22); ctx.fillRect(9, -22, 5, 22);
            // tapa (se levanta hacia atrás)
            ctx.save();
            ctx.translate(-21, -22);
            ctx.rotate(-o * 1.25);
            ctx.fillStyle = woodL; ctx.strokeStyle = '#2b1740'; ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(0, -6);
            ctx.quadraticCurveTo(21, -22, 42, -6); ctx.lineTo(42, 0); ctx.closePath();
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = gold;
            ctx.fillRect(7, -12, 5, 12); ctx.fillRect(30, -12, 5, 12);
            ctx.restore();
            // cerradura (solo cerrado)
            if (o < 0.3) {
                ctx.fillStyle = gold; ctx.strokeStyle = '#2b1740'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(0, -20, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#2b1740'; ctx.fillRect(-1.2, -21, 2.4, 5);
            }
            ctx.restore();
        }

        // 🐱 Dibuja al Gatito Compañero Protector ("Michi Estelar")


        function openSurpriseBox(block) {
            if (block.used) return;
            block.used = true;
            block.bounceY = -8;
            spawnPowerUpFromBlock(block);
        }



        function spawnPowerUpFromBlock(block) {
            audio.playBlockPop();
            if (block.content === 'star') {
                lily.stars++;
                lily.score += 100;
                audio.playStarCandy();
                addParticles(block.x + 22, block.y - 6, 12, 'star', '#ffe58f');
                addFloatingText(block.x + 22, block.y - 15, '🧰 +1 🍬⭐', '#ffe58f');
                checkExtraHeart();
                updateHUD();
            } else if (block.content === 'cat') {
                // 🐱 ¡Sale el Gatito Compañero Protector!
                powerUps.push({
                    x: block.x + 6,
                    y: block.y - 36,
                    w: 34,
                    h: 34,
                    vx: 0.6,
                    vy: -4.2,
                    kind: 'cat'
                });
                audio.playCatMeow();
                addParticles(block.x + 22, block.y - 10, 18, 'heart', '#ff85c0');
                addFloatingText(block.x + 22, block.y - 26, '🐱 ¡Gatito Guardián!', '#ffe58f');
            } else if (block.content === 'bell' || block.content === 'bubble' || block.content === 'rocket' || block.content === 'punch') {
                powerUps.push({
                    x: block.x + 5,
                    y: block.y - 34,
                    w: 32,
                    h: 32,
                    vx: block.content === 'rocket' ? 0.9 : 1.25,
                    vy: -3.8,
                    kind: block.content
                });
                addParticles(block.x + 22, block.y - 10, 14, 'star', '#ffe58f');
                if (block.content === 'rocket') {
                    addFloatingText(block.x + 22, block.y - 24, '🧰🚀 ¡Cohete Sorpresa!', '#ffe58f');
                } else if (block.content === 'punch') {
                    addFloatingText(block.x + 22, block.y - 24, '🧰👊 ¡Puñito!', '#ffe58f');
                }
            }
        }

        // ❤️ Cada 50 estrellitas = 1 vida nueva (el contador de estrellitas sigue acumulándose)


        function shootSweetBubble() {
            if (lily.bubbleCooldown > 0 || lily.inSpaceship || lily.landingInProgress) return;
            const isPowered = lily.power === 'bubble';
            lily.bubbleCooldown = isPowered ? 15 : 26;
            audio.playBubble();
            bubbles.push({
                x: lily.facing === 1 ? lily.x + lily.w + 2 : lily.x - 20,
                y: lily.y + 18,
                r: isPowered ? 15 : 11,
                vx: lily.facing * (isPowered ? 6.8 : 5.4),
                vy: -0.25,
                life: isPowered ? 75 : 48
            });
            addParticles(lily.x + (lily.facing === 1 ? lily.w : 0), lily.y + 20, 4, 'heart', '#ffc2e2');
        }



        function launchFirework() {
            fireworks.rockets.push({
                x: 90 + Math.random() * (VIEW_W - 180),
                y: VIEW_H + 10,
                vy: -(8.5 + Math.random() * 3),
                targetY: 60 + Math.random() * 170,
                color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)]
            });
        }

        function updateFireworks() {
            for (let i = fireworks.rockets.length - 1; i >= 0; i--) {
                const r = fireworks.rockets[i];
                r.y += r.vy;
                if (r.y <= r.targetY) {
                    const n = 38;
                    const alt = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];
                    for (let k = 0; k < n; k++) {
                        const a = (k / n) * Math.PI * 2;
                        const sp = (k % 2 ? 2.2 : 3.6) + Math.random() * 0.8;
                        fireworks.sparks.push({
                            x: r.x, y: r.y,
                            vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                            life: 1, decay: 0.012 + Math.random() * 0.008,
                            color: k % 3 === 0 ? alt : r.color
                        });
                    }
                    const a = getAudio(); if (a && a.playFireworkBurst) a.playFireworkBurst();
                    fireworks.rockets.splice(i, 1);
                }
            }
            for (let i = fireworks.sparks.length - 1; i >= 0; i--) {
                const sp = fireworks.sparks[i];
                sp.x += sp.vx; sp.y += sp.vy;
                sp.vx *= 0.985; sp.vy = sp.vy * 0.985 + 0.045;
                sp.life -= sp.decay;
                if (sp.life <= 0) fireworks.sparks.splice(i, 1);
            }
        }

        function drawFireworks() {
            if (!fireworks.rockets.length && !fireworks.sparks.length && getGameState() !== 'CELEBRATING') return;
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.globalCompositeOperation = 'lighter';
            fireworks.rockets.forEach(r => {
                ctx.fillStyle = r.color;
                ctx.beginPath(); ctx.arc(r.x, r.y, 3, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = 'rgba(255,229,143,0.5)';
                ctx.fillRect(r.x - 1.5, r.y, 3, 16);
            });
            fireworks.sparks.forEach(sp => {
                ctx.globalAlpha = Math.max(0, sp.life);
                ctx.fillStyle = sp.color;
                ctx.beginPath(); ctx.arc(sp.x, sp.y, 2.6 * (0.5 + sp.life * 0.7), 0, Math.PI * 2); ctx.fill();
            });
            ctx.restore();
            if (getGameState() === 'CELEBRATING') {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                const pulse = 1 + Math.sin(getGlobalTick() * 0.2) * 0.05;
                ctx.translate(VIEW_W / 2, 96);
                ctx.scale(pulse, pulse);
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.font = 'bold 46px Fredoka, sans-serif';
                ctx.lineJoin = 'round'; ctx.lineWidth = 8;
                ctx.strokeStyle = '#261247'; ctx.strokeText('🎉 ¡VICTORIA! 🎉', 0, 0);
                ctx.fillStyle = '#ffe58f'; ctx.fillText('🎉 ¡VICTORIA! 🎉', 0, 0);
                ctx.restore();
            }
        }



export {
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
};
