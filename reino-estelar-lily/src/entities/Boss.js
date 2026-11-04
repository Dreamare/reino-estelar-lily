/**
 * Boss.js - Rey Kraken Marciano (escalado, patrones y vida)
 */
import { AssetManager, drawMagicBloom } from '../core/AssetLoader.js';
import { drawStarShape, drawHeartShape, drawRoundedRect } from './Collectibles.js';
import { VIEW_W } from '../core/Camera.js';
const getGlobalTick = () => (typeof window !== 'undefined' ? window.globalTick || 0 : 0);
const getCameraX = () => (typeof window !== 'undefined' ? window.cameraX || 0 : 0);


export function createBossState(arenaX = 3500, groundY = 460) {
    return {
        x: arenaX,
        y: groundY - 180,
        w: 160,
        h: 180,
        origW: 160,
        origH: 180,
        hp: 12,
        maxHp: 12,
        phase: 1,
        state: 'enter', // 'enter' | 'patrol' | 'jump' | 'attack' | 'defeated'
        timer: 0,
        vx: -2.0,
        vy: 0,
        jumpCooldown: 120,
        slamAttack: false,
        meteorCooldown: 180,
        flashTimer: 0,
        scale: 1.0,
        defeated: false
    };
}

        function damageBoss(amount, label = '💖 ¡Impacto!') {
            if (!boss || boss.defeated || boss.hurtTimer > 8) return;
            boss.hp = Math.max(0, boss.hp - amount);
            boss.hurtTimer = 16;

            // Encoger progresivamente al Boss según su vida restante (de 1.80x hasta 0.42x)
            const hpRatio = boss.hp / boss.maxHp;
            boss.scale = 0.42 + hpRatio * 1.38;

            lily.score += 350;
            audio.playBossHit();
            addParticles(boss.x, boss.y, 16, 'heart', '#ff85c0');
            addParticles(boss.x, boss.y, 14, 'star', '#ffe58f');
            addFloatingText(boss.x, boss.y - 60 * boss.scale, `${label} (¡Se encoge!)`, '#ffe58f');

            if (boss.hp <= 0) {
                boss.defeated = true;
                boss.scale = 0.35;
                lily.score += 3000;
                if (typeof window !== 'undefined') window.lightningFlash = 22;
                audio.stopLullaby();
                audio.playVictory();
                addParticles(boss.x, boss.y, 45, 'star', '#ffe58f');
                addParticles(boss.x, boss.y, 35, 'heart', '#ff85c0');
                addFloatingText(boss.x, boss.y - 40, '👑💥 ¡REY MARCIANO DERROTADO! +3000', '#ffe58f');
                if (typeof window !== 'undefined' && window.startVictoryCelebration) window.startVictoryCelebration();
            }
            updateHUD();
        }



        function drawMarcianoBoss(b) {
            if (b.x + 240 < getCameraX() || b.x - 240 > getCameraX() + VIEW_W) return;
            ctx.save();
            ctx.translate(b.x, b.y);

            // =================================================================
            // 1. BARRA DE VIDA ARRIBA DEL BOSS (No se encoge para verse clara)
            // =================================================================
            const barY = -98 * b.scale - 34;
            const barW = 168;
            const barH = 14;
            const hpRatio = Math.max(0, b.hp / b.maxHp);

            ctx.save();
            ctx.font = 'bold 13px Fredoka, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffe58f';
            ctx.strokeStyle = '#140526';
            ctx.lineWidth = 3.5;
            ctx.strokeText(`👑 REY KRAKEN MARCIANO (${Math.ceil(hpRatio * 100)}%)`, 0, barY - 7);
            ctx.fillText(`👑 REY KRAKEN MARCIANO (${Math.ceil(hpRatio * 100)}%)`, 0, barY - 7);

            ctx.fillStyle = 'rgba(15, 4, 32, 0.9)';
            ctx.strokeStyle = '#ff85c0';
            ctx.lineWidth = 2.5;
            drawRoundedRect(ctx, -barW / 2, barY, barW, barH, 7);
            ctx.fill();
            ctx.stroke();

            const hpGrad = ctx.createLinearGradient(-barW / 2, 0, barW / 2, 0);
            hpGrad.addColorStop(0, '#ff4d4f');
            hpGrad.addColorStop(0.5, '#ffa940');
            hpGrad.addColorStop(1, '#73d13d');
            ctx.fillStyle = hpGrad;
            if (hpRatio > 0) {
                drawRoundedRect(ctx, -barW / 2 + 2, barY + 2, (barW - 4) * hpRatio, barH - 4, 5);
                ctx.fill();
            }
            ctx.restore();

            // Aplicar la escala del Boss (¡se va haciendo cada vez más pequeño con los golpes!)
            ctx.scale(b.scale, b.scale);

            if (b.hurtTimer > 0 && b.hurtTimer % 2 === 0) {
                ctx.globalAlpha = 0.55;
            }

            // =================================================================
            // 2. CAPA GALÁCTICA OSCURA CON ESTRELLAS Y PLANETAS (Detrás del cuerpo)
            // =================================================================
            const capeWave = Math.sin(b.tentaclePhase) * 6;
            ctx.save();
            const capeGrad = ctx.createLinearGradient(0, -18, 0, 48);
            capeGrad.addColorStop(0, '#1d1340');
            capeGrad.addColorStop(1, '#2f1d63');
            ctx.fillStyle = capeGrad;
            ctx.strokeStyle = '#59388a';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(-28, -14);
            ctx.quadraticCurveTo(-78, 6 + capeWave, -86, 36 + capeWave);
            ctx.quadraticCurveTo(-55, 26, -34, 42);
            ctx.lineTo(34, 42);
            ctx.quadraticCurveTo(55, 26, 86, 36 - capeWave);
            ctx.quadraticCurveTo(78, 6 - capeWave, 28, -14);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Estrellitas y planetitas estampados en la capa galáctica
            drawStarShape(ctx, -58, 18 + capeWave * 0.4, 5, 5, 2.5, '#ffe58f');
            drawStarShape(ctx, 58, 16 - capeWave * 0.4, 5, 5, 2.5, '#ff7875');
            ctx.fillStyle = '#9254de';
            ctx.beginPath();
            ctx.arc(-44, 8, 4.5, 0, Math.PI * 2);
            ctx.arc(44, 24, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffe58f';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.ellipse(-44, 8, 8, 2.2, -0.3, 0, Math.PI * 2);
            ctx.ellipse(44, 24, 8, 2.2, 0.3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // =================================================================
            // 3. TENTÁCULOS VERDES RIZADOS CON VENTOSAS (6 inferiores + 2 brazos)
            // =================================================================
            const drawTentacle = (startX, startY, ctrl1X, ctrl1Y, endX, endY, width = 12) => {
                ctx.save();
                ctx.strokeStyle = '#237804';
                ctx.lineWidth = width + 3;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(ctrl1X, ctrl1Y, endX, endY);
                ctx.stroke();

                ctx.strokeStyle = '#52c41a';
                ctx.lineWidth = width;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(ctrl1X, ctrl1Y, endX, endY);
                ctx.stroke();

                // Ventosas verde claro a lo largo del tentáculo
                ctx.fillStyle = '#95de64';
                for (let t = 0.35; t <= 0.85; t += 0.25) {
                    const sx = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrl1X + t * t * endX;
                    const sy = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrl1Y + t * t * endY;
                    ctx.beginPath();
                    ctx.arc(sx, sy + 2, 2.4, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            };

            const w1 = Math.sin(b.tentaclePhase) * 8;
            const w2 = Math.cos(b.tentaclePhase * 1.2) * 8;

            // Brazo-tentáculo izquierdo ondulante hacia arriba (como en la imagen)
            drawTentacle(-26, 6, -58, -4 + w1, -48, -32 + w2, 11);
            // Brazo-tentáculo derecho levantando el dedo / apuntando amenazante
            drawTentacle(26, 6, 56, 2 - w1, 48, -22 - w2, 11);

            // Abanico de tentáculos inferiores rizados
            drawTentacle(-22, 22, -52, 34 + w1, -62, 18 + w2, 11);
            drawTentacle(-14, 26, -36, 54 - w2, -42, 42 + w1, 11.5);
            drawTentacle(-4, 28, -14, 64 + w1, -4, 56 - w2, 12);
            drawTentacle(8, 28, 18, 62 - w1, 10, 54 + w2, 12);
            drawTentacle(18, 24, 42, 50 + w2, 46, 36 - w1, 11);

            // =================================================================
            // 4. CABEZA / TORSO VERDE DEL PULPO-MARCIANO CON TEXTURA MANCHADA
            // =================================================================
            const bodyGrad = ctx.createRadialGradient(-6, -8, 6, 0, 0, 38);
            bodyGrad.addColorStop(0, '#73d13d');
            bodyGrad.addColorStop(0.65, '#389e0d');
            bodyGrad.addColorStop(1, '#237804');
            ctx.fillStyle = bodyGrad;
            ctx.strokeStyle = '#135200';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.ellipse(0, 0, 33, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Manchas orgánicas verde oscuro en la piel del marciano
            ctx.fillStyle = 'rgba(19, 82, 0, 0.35)';
            [[-22, 4, 4], [-18, 14, 3], [22, 6, 4.5], [17, 15, 3], [-12, 20, 3.5], [12, 20, 3.5]].forEach(([mx, my, mr]) => {
                ctx.beginPath();
                ctx.arc(mx, my, mr, 0, Math.PI * 2);
                ctx.fill();
            });

            // =================================================================
            // 5. GRAN OJO CENTRAL CICLÓPEO AMARILLO/ÁMBAR Y BOCA CON COLMILLOS
            // =================================================================
            // Cuenca / Esclerótica crema brillante
            ctx.fillStyle = '#fffbe6';
            ctx.strokeStyle = '#135200';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(0, -6, 13.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Iris dorado/ámbar intenso
            const irisGrad = ctx.createRadialGradient(0, -6, 2, 0, -6, 9);
            irisGrad.addColorStop(0, '#ffd666');
            irisGrad.addColorStop(0.7, '#faad14');
            irisGrad.addColorStop(1, '#ad6800');
            ctx.fillStyle = irisGrad;
            ctx.beginPath();
            ctx.arc(0, -6, 8.8, 0, Math.PI * 2);
            ctx.fill();

            // Pupila negra + doble reflejo blanco
            ctx.fillStyle = '#141118';
            ctx.beginPath();
            ctx.arc(0, -6, 4.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-2.5, -8.5, 2.2, 0, Math.PI * 2);
            ctx.arc(2.2, -4.0, 1.1, 0, Math.PI * 2);
            ctx.fill();

            // Ceño fruncido / Párpado superior verde amenazante (igual a la foto)
            ctx.fillStyle = '#389e0d';
            ctx.strokeStyle = '#135200';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(-16, -13);
            ctx.quadraticCurveTo(0, -7, 16, -13);
            ctx.quadraticCurveTo(0, -22, -16, -13);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Sonrisa maliciosa con colmillos blancos afilados en los extremos
            ctx.strokeStyle = '#135200';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(0, 5, 14, 0.15 * Math.PI, 0.85 * Math.PI);
            ctx.stroke();

            // Colmillos blancos
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#135200';
            ctx.lineWidth = 1.4;
            const drawFang = (fx, fy, rot) => {
                ctx.save();
                ctx.translate(fx, fy);
                ctx.rotate(rot);
                ctx.beginPath();
                ctx.moveTo(-2.5, 0);
                ctx.lineTo(0, 5.5);
                ctx.lineTo(2.5, 0);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            };
            drawFang(-10, 11.5, 0.2);
            drawFang(-6, 13.5, 0.1);
            drawFang(10, 11.5, -0.2);
            drawFang(6, 13.5, -0.1);

            // =================================================================
            // 6. CASCO CIBERNÉTICO PLATEADO + CORONA REAL CON GEMAS Y 4 COHETES
            // =================================================================
            // Arco del casco metálico plateado con protectores laterales cobrizos y luz cian
            ctx.fillStyle = '#8c9bae';
            ctx.strokeStyle = '#262626';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, -6, 33, 1.08 * Math.PI, 1.92 * Math.PI);
            ctx.lineTo(26, -6);
            ctx.arc(0, -6, 26, 1.92 * Math.PI, 1.08 * Math.PI, true);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Orejeras cibernéticas cobrizas con LED neón celeste
            [-31, 25].forEach(hx => {
                ctx.fillStyle = '#d46b08';
                drawRoundedRect(ctx, hx, -14, 7, 14, 2.5);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#36cfc9';
                ctx.fillRect(hx + 1.5, -10, 4, 6);
            });

            // Gema cian brillante en la frente del casco
            ctx.fillStyle = '#36cfc9';
            ctx.beginPath();
            ctx.moveTo(-5, -28);
            ctx.lineTo(5, -28);
            ctx.lineTo(3, -23);
            ctx.lineTo(-3, -23);
            ctx.closePath();
            ctx.fill();

            // 4 Cohetes Espaciales acoplados detrás de la corona y el casco (como en la imagen)
            const drawCrownRocket = (rx, ry, angle) => {
                ctx.save();
                ctx.translate(rx, ry);
                ctx.rotate(angle);
                ctx.fillStyle = '#d9e2ec';
                ctx.strokeStyle = '#334e68';
                ctx.lineWidth = 1.6;
                drawRoundedRect(ctx, -5, -12, 10, 18, 4);
                ctx.fill();
                ctx.stroke();
                // Punta roja/naranja del cohete
                ctx.fillStyle = '#ff4d4f';
                ctx.beginPath();
                ctx.moveTo(-5, -10);
                ctx.lineTo(0, -19);
                ctx.lineTo(5, -10);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // Ventanita circular celeste
                ctx.fillStyle = '#36cfc9';
                ctx.beginPath();
                ctx.arc(0, -4, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            };
            drawCrownRocket(-27, -28, -0.35);
            drawCrownRocket(-10, -44, -0.10);
            drawCrownRocket(10, -44, 0.10);
            drawCrownRocket(27, -28, 0.35);

            // Corona Real Dorada inclinada con picos y gemas en forma de estrella (verde, rosa y celeste)
            ctx.save();
            ctx.translate(2, -32);
            ctx.rotate(0.12);
            ctx.fillStyle = '#faad14';
            ctx.strokeStyle = '#874d00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-22, 6);
            ctx.lineTo(-24, -10);
            ctx.lineTo(-12, -2);
            ctx.lineTo(0, -14);
            ctx.lineTo(12, -2);
            ctx.lineTo(24, -10);
            ctx.lineTo(22, 6);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Estrellas de colores incrustadas en la corona del Boss
            drawStarShape(ctx, -13, 0, 5, 4.5, 2.2, '#73d13d');
            drawStarShape(ctx, 0, -2, 5, 6.0, 3.0, '#ff85c0');
            drawStarShape(ctx, 13, 0, 5, 4.5, 2.2, '#36cfc9');
            ctx.restore();

            ctx.restore();
        }

        // 🔥 Dibuja un chorro de fuego propulsor animado debajo de una boquilla


export {
    drawMarcianoBoss,
    damageBoss
};
