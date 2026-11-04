/**
 * Platform.js - Suelo de escamas, islas de cristal, escaleras y plataformas
 */
import { AssetManager, drawMagicBloom } from '../core/AssetLoader.js';
import { drawRoundedRect, drawStarShape, drawHeartShape } from '../entities/Collectibles.js';
import { VIEW_W, VIEW_H } from '../core/Camera.js';
const getGlobalTick = () => (typeof window !== 'undefined' ? window.globalTick || 0 : 0);
const getCameraX = () => (typeof window !== 'undefined' ? window.cameraX || 0 : 0);
const getLily = () => (typeof window !== 'undefined' ? window.lily : null);
const getCtx = () => (typeof window !== 'undefined' ? window.ctx : null);


        function aabb(a, b) {
            return (
                a.x < b.x + b.w &&
                a.x + a.w > b.x &&
                a.y < b.y + b.h &&
                a.y + a.h > b.y
            );
        }



        function drawCloudPlatform(x, y, w, h, borderColor, isBouncy = false, isEphemeral = false) {
            ctx.save();
            if (AssetManager.isReady('tileset')) {
                // 🎨 Islas flotantes de cristal rosa tallado (./asets/tileset_platforms.png)
                const ts = AssetManager.get('tileset');
                const islands = AssetManager.sprites.tileset.crystalIslands;
                const variantIdx = Math.abs(Math.floor(x + y)) % islands.length;
                const isl = islands[variantIdx];

                // Resplandor mágico bajo la isla de cristal
                const glowColor = isBouncy
                    ? 'rgba(255, 133, 192, 0.50)'
                    : (isEphemeral ? 'rgba(179, 127, 235, 0.45)' : 'rgba(255, 170, 220, 0.38)');
                drawMagicBloom(ctx, x + w / 2, y + h * 0.6, Math.max(w * 0.58, 38), glowColor, 'rgba(255, 133, 192, 0)');

                if (isEphemeral) {
                    ctx.globalAlpha = 0.86 + Math.sin(getGlobalTick() * 0.25 + x) * 0.12;
                }

                // Alinear la superficie plana caminable de la isla exactamente con 'y'
                const slabDrawH = Math.max(h * 1.65, 36);
                const decoH = slabDrawH * (isl.topOffset / isl.slabH);
                const totalDrawH = slabDrawH + decoH;
                const padX = Math.max(6, w * 0.05);

                ctx.drawImage(
                    ts,
                    isl.x, isl.y, isl.w, isl.h,
                    x - padX, y - decoH + 3, w + padX * 2, totalDrawH
                );
                ctx.restore();
                return;
            }

            // Fallback vectorial original si tileset_platforms.png no ha cargado
            if (!isBouncy && !isEphemeral) {
                drawThrusterFlames(x + w * 0.25, y + h, 14);
                drawThrusterFlames(x + w * 0.75, y + h, 14);
            }

            ctx.fillStyle = isBouncy ? '#ffd6e7' : (isEphemeral ? '#f4e8ff' : '#fff0f6');
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 3;
            if (isEphemeral) ctx.setLineDash([6, 4]);
            drawRoundedRect(ctx, x, y, w, h, 12);
            ctx.fill();
            ctx.stroke();
            ctx.setLineDash([]);

            const cx = x + w / 2;
            const cy = y + h / 2;
            ctx.fillStyle = '#ff85c0';
            ctx.beginPath();
            ctx.arc(cx - 10, cy + 1, 2.5, 0, Math.PI * 2);
            ctx.arc(cx + 10, cy + 1, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#593869';
            ctx.beginPath();
            ctx.arc(cx - 6, cy - 1, 1.8, 0, Math.PI * 2);
            ctx.arc(cx + 6, cy - 1, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 🎁 Dibuja una Cajita de Sorpresa / Cofre de Regalo Estelar con tapa que se abre


        function drawThrusterFlames(nozzleCenterX, nozzleBottomY, size = 18) {
            ctx.save();
            const flicker1 = Math.sin(getGlobalTick() * 0.45 + nozzleCenterX) * 4;
            const flicker2 = Math.cos(getGlobalTick() * 0.6 + nozzleCenterX * 0.5) * 3;
            const flameLen = size * 1.65 + flicker1;

            // Tobera metálica espacial
            ctx.fillStyle = '#593869';
            ctx.strokeStyle = '#d3adf7';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(nozzleCenterX - size * 0.48, nozzleBottomY - 2);
            ctx.lineTo(nozzleCenterX + size * 0.48, nozzleBottomY - 2);
            ctx.lineTo(nozzleCenterX + size * 0.62, nozzleBottomY + 5);
            ctx.lineTo(nozzleCenterX - size * 0.62, nozzleBottomY + 5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            const baseY = nozzleBottomY + 5;

            // Halo de calor brillante alrededor del fuego
            const glow = ctx.createRadialGradient(nozzleCenterX, baseY + flameLen * 0.35, 2, nozzleCenterX, baseY + flameLen * 0.35, size * 1.5);
            glow.addColorStop(0, 'rgba(255, 140, 66, 0.55)');
            glow.addColorStop(0.6, 'rgba(255, 85, 165, 0.25)');
            glow.addColorStop(1, 'rgba(255, 85, 165, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(nozzleCenterX, baseY + flameLen * 0.35, size * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Capa exterior del fuego (Naranja / Magenta intenso)
            ctx.fillStyle = '#ff5c8a';
            ctx.beginPath();
            ctx.moveTo(nozzleCenterX - size * 0.52, baseY);
            ctx.quadraticCurveTo(nozzleCenterX - size * 0.28, baseY + flameLen * 0.7, nozzleCenterX + flicker2 * 0.4, baseY + flameLen);
            ctx.quadraticCurveTo(nozzleCenterX + size * 0.28, baseY + flameLen * 0.7, nozzleCenterX + size * 0.52, baseY);
            ctx.closePath();
            ctx.fill();

            // Capa media del fuego (Naranja / Dorado vivo)
            ctx.fillStyle = '#ffa940';
            ctx.beginPath();
            ctx.moveTo(nozzleCenterX - size * 0.36, baseY);
            ctx.quadraticCurveTo(nozzleCenterX - size * 0.18, baseY + flameLen * 0.55, nozzleCenterX - flicker2 * 0.25, baseY + flameLen * 0.76);
            ctx.quadraticCurveTo(nozzleCenterX + size * 0.18, baseY + flameLen * 0.55, nozzleCenterX + size * 0.36, baseY);
            ctx.closePath();
            ctx.fill();

            // Núcleo interior del fuego (Amarillo / Blanco incandescente)
            ctx.fillStyle = '#fffb8f';
            ctx.beginPath();
            ctx.moveTo(nozzleCenterX - size * 0.20, baseY);
            ctx.quadraticCurveTo(nozzleCenterX, baseY + flameLen * 0.48, nozzleCenterX, baseY + flameLen * 0.48);
            ctx.quadraticCurveTo(nozzleCenterX, baseY + flameLen * 0.48, nozzleCenterX + size * 0.20, baseY);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

        // 🔥 Plataforma espacial flotante sostenida por propulsores de fuego


        function drawThrusterPlatform(x, y, w, h, rimColor = '#ff85c0', bodyColor = '#3b1d6e') {
            ctx.save();

            // ✨ Resplandor suave (bloom aditivo) bajo los propulsores de la plataforma
            const flamePulse = 0.86 + Math.sin(getGlobalTick() * 0.45 + x * 0.08) * 0.20;
            drawMagicBloom(ctx, x + w * 0.28, y + h + 16, 26 * flamePulse, 'rgba(255, 169, 64, 0.62)', 'rgba(255, 92, 138, 0)');
            drawMagicBloom(ctx, x + w * 0.72, y + h + 16, 26 * flamePulse, 'rgba(255, 169, 64, 0.62)', 'rgba(255, 92, 138, 0)');

            if (AssetManager.isReady('tileset')) {
                // 🎨 Plataforma metálica morada con propulsores de fuego (./asets/tileset_platforms.png)
                const ts = AssetManager.get('tileset');
                const tpBody = AssetManager.sprites.tileset.thrusterBody;
                const tpFire = AssetManager.sprites.tileset.thrusterFire;
                const hoverBob = Math.sin(getGlobalTick() * 0.12 + x * 0.04) * 1.2;

                // 1. Llamas propulsoras con oscilación vertical y escalado dinámico para que se vean vivas
                const fireH = Math.max(26, h * 1.35) * flamePulse;
                ctx.drawImage(
                    ts,
                    tpFire.x, tpFire.y, tpFire.w, tpFire.h,
                    x - 4, y + h - 4 + hoverBob, w + 8, fireH
                );

                // 2. Cuerpo metálico morado de la plataforma
                const bodyDrawH = Math.max(h + 6, 28);
                ctx.drawImage(
                    ts,
                    tpBody.x, tpBody.y, tpBody.w, tpBody.h,
                    x - 4, y - 3 + hoverBob, w + 8, bodyDrawH
                );

                ctx.restore();
                return;
            }

            // Fallback vectorial original
            drawThrusterFlames(x + w * 0.28, y + h - 1, 18);
            drawThrusterFlames(x + w * 0.72, y + h - 1, 18);

            const platGrad = ctx.createLinearGradient(x, y, x, y + h);
            platGrad.addColorStop(0, '#f9f0ff');
            platGrad.addColorStop(0.5, '#d3adf7');
            platGrad.addColorStop(1, bodyColor);
            ctx.fillStyle = platGrad;
            ctx.strokeStyle = rimColor;
            ctx.lineWidth = 2.8;
            drawRoundedRect(ctx, x, y, w, h, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = rimColor;
            drawRoundedRect(ctx, x + 6, y + 2, w - 12, 5, 2.5);
            ctx.fill();

            for (let lx = x + 18; lx <= x + w - 18; lx += 24) {
                ctx.fillStyle = '#ffe58f';
                ctx.beginPath();
                ctx.arc(lx, y + h / 2 + 2, 2.8, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }

        // 👽 MARCIANOS Y EXTRATERRESTRES QUE GOLPEAN A LILY


        function drawRooftopPlatform(p) {
            ctx.save();
            const { x, y, w, h } = p;
            
            // Base del edificio destruido (muro de ladrillos desgastados y hormigón)
            ctx.fillStyle = '#2d3436';
            ctx.fillRect(x + 4, y + 10, w - 8, h - 10 + 20);
            
            // Textura de ladrillos agrietados
            ctx.strokeStyle = '#1e272e';
            ctx.lineWidth = 1.2;
            for (let ly = y + 12; ly < y + h + 16; ly += 9) {
                ctx.beginPath();
                ctx.moveTo(x + 4, ly);
                ctx.lineTo(x + w - 4, ly);
                ctx.stroke();
                const stagger = (Math.floor(ly / 9) % 2) * 12;
                for (let lx = x + 4 + stagger; lx < x + w - 4; lx += 24) {
                    ctx.beginPath();
                    ctx.moveTo(lx, ly);
                    ctx.lineTo(lx, ly + 9);
                    ctx.stroke();
                }
            }

            // Techo de tejas de terracota / chapa acanalada desgastada
            const roofGrad = ctx.createLinearGradient(x, y, x, y + 14);
            roofGrad.addColorStop(0, '#e17055');
            roofGrad.addColorStop(0.5, '#d63031');
            roofGrad.addColorStop(1, '#8b2626');
            ctx.fillStyle = roofGrad;
            drawRoundedRect(ctx, x, y, w, 14, 4);
            ctx.fill();

            // Borde superior con tejas redondeadas
            ctx.fillStyle = '#ff7675';
            for (let tx = x + 6; tx < x + w - 6; tx += 18) {
                ctx.beginPath();
                ctx.arc(tx, y + 11, 7, 0, Math.PI);
                ctx.fill();
            }

            // Antena de televisión doblada con cable colgante
            if (w >= 140) {
                ctx.strokeStyle = '#718093';
                ctx.lineWidth = 2.2;
                ctx.beginPath();
                ctx.moveTo(x + 18, y);
                ctx.lineTo(x + 14, y - 26);
                ctx.lineTo(x + 24, y - 38);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + 8, y - 24);
                ctx.lineTo(x + 22, y - 26);
                ctx.moveTo(x + 16, y - 34);
                ctx.lineTo(x + 30, y - 36);
                ctx.stroke();
            }
            if (w >= 160) {
                // Chimenea de ladrillo rota
                ctx.fillStyle = '#632626';
                ctx.fillRect(x + w - 28, y - 18, 18, 20);
                ctx.fillStyle = '#2d3436';
                ctx.fillRect(x + w - 30, y - 22, 22, 5);
            }

            ctx.restore();
        }



        function drawLadder(lad) {
            ctx.save();
            const { x, topY, bottomY, w, type, state } = lad;

            if (state === 'fallen') {
                // Escalera colapsada y destruida en el piso
                const gy = lad.targetGroundY;
                ctx.fillStyle = '#2f3542';
                ctx.strokeStyle = '#c0392b';
                ctx.lineWidth = 2;
                // Vigas de metal torcidas y dobladas
                ctx.beginPath();
                ctx.moveTo(x - 12, gy);
                ctx.lineTo(x + 10, gy - 16);
                ctx.lineTo(x + w + 14, gy);
                ctx.stroke();

                ctx.strokeStyle = '#718093';
                ctx.beginPath();
                ctx.moveTo(x - 6, gy);
                ctx.lineTo(x + 18, gy - 22);
                ctx.lineTo(x + w + 8, gy);
                ctx.stroke();

                // Peldaños retorcidos
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(x + 4, gy - 10, 14, 4);
                ctx.fillRect(x + 16, gy - 18, 12, 4);

                // Señal de peligro roto
                if (Math.sin(getGlobalTick() * 0.1) > 0) {
                    ctx.fillStyle = '#ff4d4f';
                    ctx.font = 'bold 9px Fredoka, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('💥 ROTA', x + w / 2, gy - 28);
                }
                ctx.restore();
                return;
            }

            const shakeOffset = state === 'shaking' ? (Math.random() - 0.5) * 5.5 : 0;
            const drawX = x + shakeOffset;
            const rungs = Math.max(1, Math.floor((bottomY - topY) / 14));

            // Si está cayendo, estela de movimiento vertical
            if (state === 'falling') {
                ctx.strokeStyle = 'rgba(235, 77, 75, 0.45)';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(drawX + 3, topY - 18);
                ctx.lineTo(drawX + 3, topY);
                ctx.moveTo(drawX + w - 3, topY - 18);
                ctx.lineTo(drawX + w - 3, topY);
                ctx.stroke();
            }

            // Rieles verticales de metal reforzado (con óxido en escaleras inestables)
            const railColor = (type === 'falling' || state === 'shaking' || state === 'falling') ? '#b33939' : '#718093';
            const railBorder = (type === 'falling' || state === 'shaking' || state === 'falling') ? '#2c1810' : '#2f3542';
            ctx.fillStyle = railColor;
            ctx.strokeStyle = railBorder;
            ctx.lineWidth = 1.5;
            // Riel izquierdo
            drawRoundedRect(ctx, drawX, topY - 8, 6, bottomY - topY + 12, 2);
            ctx.fill();
            ctx.stroke();
            // Riel derecho
            drawRoundedRect(ctx, drawX + w - 6, topY - 8, 6, bottomY - topY + 12, 2);
            ctx.fill();
            ctx.stroke();

            // Peldaños metálicos horizontales
            for (let i = 0; i <= rungs; i++) {
                const ry = topY + i * 14;
                ctx.fillStyle = (type === 'falling' && i % 2 === 0) ? '#ff7675' : '#dcdde1';
                ctx.fillRect(drawX + 5, ry - 2, w - 10, 4);
                ctx.fillStyle = railBorder;
                ctx.fillRect(drawX + 5, ry + 1, w - 10, 1.5);
                // Remaches
                ctx.fillStyle = '#f5f6fa';
                ctx.beginPath();
                ctx.arc(drawX + 3, ry, 1.6, 0, Math.PI * 2);
                ctx.arc(drawX + w - 3, ry, 1.6, 0, Math.PI * 2);
                ctx.fill();
            }

            // Indicador flotante
            if (state === 'shaking') {
                ctx.fillStyle = '#ff4d4f';
                ctx.font = 'bold 10px Fredoka, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('⚠️ ¡COLAPSA!', drawX + w / 2, topY - 14);
            } else if (state === 'falling') {
                ctx.fillStyle = '#ff7675';
                ctx.font = 'bold 10px Fredoka, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('💥 ¡CUIDADO!', drawX + w / 2, topY - 14);
            } else if (type === 'falling') {
                if (Math.sin(getGlobalTick() * 0.08) > 0.3) {
                    ctx.fillStyle = '#ffa940';
                    ctx.font = 'bold 9.5px Fredoka, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('⚠️ SUBIR (Frágil)', drawX + w / 2, topY - 14);
                }
            } else {
                if (Math.sin(getGlobalTick() * 0.08) > 0.4) {
                    ctx.fillStyle = '#ffeaa7';
                    ctx.font = 'bold 10px Fredoka, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('🪜 SUBIR', drawX + w / 2, topY - 14);
                }
            }
            ctx.restore();
        }


        function drawCheckpointFlag(cp) {
            if (cp.x + 70 < getCameraX() || cp.x - 70 > getCameraX() + VIEW_W) return;
            const active = cp.reached;
            const poleTop = cp.y - 96;
            ctx.save();

            if (active) {
                const pulse = 0.5 + Math.sin(getGlobalTick() * 0.12) * 0.5;
                const halo = ctx.createRadialGradient(cp.x + 14, poleTop + 22, 4, cp.x + 14, poleTop + 22, 58 + pulse * 8);
                halo.addColorStop(0, 'rgba(255, 229, 143, 0.55)');
                halo.addColorStop(1, 'rgba(255, 133, 192, 0)');
                ctx.fillStyle = halo;
                ctx.beginPath();
                ctx.arc(cp.x + 14, poleTop + 22, 66, 0, Math.PI * 2);
                ctx.fill();
            }

            // Base
            ctx.fillStyle = active ? '#ff85c0' : '#8e7cc3';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            drawRoundedRect(ctx, cp.x - 15, cp.y - 14, 30, 14, 5);
            ctx.fill();
            ctx.stroke();

            // Mástil
            ctx.fillStyle = '#fff0f6';
            ctx.fillRect(cp.x - 3, poleTop, 6, 84);

            // Banderín: abajo y apagado antes de activarse; arriba, ondeando y rosa después
            const flagY = active ? poleTop + 4 : poleTop + 40;
            const wave = active ? Math.sin(getGlobalTick() * 0.18) * 3 : 0;
            ctx.fillStyle = active ? '#ff85c0' : '#7a6aa8';
            ctx.strokeStyle = '#fff0f6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cp.x + 3, flagY);
            ctx.lineTo(cp.x + 41, flagY + 14 + wave);
            ctx.lineTo(cp.x + 3, flagY + 30);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            drawStarShape(ctx, cp.x + 15, flagY + 15 + wave * 0.3, 5, 6, 3, active ? '#ffe58f' : '#cfc3ee');

            // Estrella en la punta del mástil
            drawStarShape(ctx, cp.x, poleTop - 5, 5, 9, 4.5, active ? '#ffe58f' : '#cfc3ee');
            ctx.restore();
        }

        // 🛸 NAVE ESTELAR DE LLEGADA (Aterriza con Lily al comenzar el siguiente mundo)


        function drawArrivalSpaceship(sp) {
            if (sp.x + sp.w + 100 < getCameraX() || sp.x - 100 > getCameraX() + VIEW_W) return;
            ctx.save();
            const centerX = sp.x + sp.w / 2;
            const groundY = 460;

            if (AssetManager.isReady('props')) {
                // 🎨 Nave espacial rosada de la Fila 1 (./asets/sprites_props_enemies.png)
                const propsSheet = AssetManager.get('props');
                const ships = AssetManager.sprites.props.ships;

                ctx.translate(centerX, sp.y + 64);

                // ✨ Resplandor bloom y fuego de frenado bajo los propulsores
                if (sp.state === 'descending') {
                    drawMagicBloom(ctx, 0, 52, 65, 'rgba(255, 169, 64, 0.72)', 'rgba(255, 133, 192, 0)');
                    drawThrusterFlames(-22, 34, 22);
                    drawThrusterFlames(0, 38, 28);
                    drawThrusterFlames(22, 34, 22);
                } else {
                    drawMagicBloom(ctx, 0, 22, 54, 'rgba(255, 194, 226, 0.45)', 'rgba(255, 133, 192, 0)');
                }

                // Si Lily sigue dentro mientras aterriza, dibujarla en la cabina detrás del cristal
                if (lily.landingInProgress) {
                    ctx.save();
                    drawLilyCharacter(ctx, -4, -10, 0.72, {
                        facing: 1,
                        onGround: true,
                        animTimer: 0,
                        vx: 0,
                        vy: 0,
                        power: lily.power
                    });
                    ctx.restore();
                }

                // Frame 0 (con plataforma de aterrizaje) cuando está estacionada, Frame 4 al descender
                const fr = sp.state === 'descending' ? ships[4] : ships[0];
                const drawW = 148;
                const drawH = drawW * (fr.h / fr.w);
                ctx.drawImage(propsSheet, fr.x, fr.y, fr.w, fr.h, -drawW / 2, -drawH + 54, drawW, drawH);

                ctx.restore();
                return;
            }

            // Fallback vectorial original
            ctx.fillStyle = '#531dab';
            ctx.strokeStyle = '#b5f5ec';
            ctx.lineWidth = 2.5;
            drawRoundedRect(ctx, centerX - 70, groundY - 14, 140, 14, 6);
            ctx.fill();
            ctx.stroke();

            ctx.translate(centerX, sp.y + 64);

            if (sp.state === 'descending') {
                drawThrusterFlames(-22, 42, 22);
                drawThrusterFlames(0, 45, 28);
                drawThrusterFlames(22, 42, 22);
            }

            ctx.strokeStyle = '#d3adf7';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-36, 32);
            ctx.lineTo(-48, 52);
            ctx.moveTo(36, 32);
            ctx.lineTo(48, 52);
            ctx.stroke();

            ctx.fillStyle = '#ff66b3';
            ctx.strokeStyle = '#fff0f6';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-38, 0);
            ctx.quadraticCurveTo(-68, 18, -56, 42);
            ctx.lineTo(-30, 32);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(38, 0);
            ctx.quadraticCurveTo(68, 18, 56, 42);
            ctx.lineTo(30, 32);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            const hullGrad = ctx.createLinearGradient(-48, -45, 48, 40);
            hullGrad.addColorStop(0, '#ffffff');
            hullGrad.addColorStop(0.55, '#ffd6eb');
            hullGrad.addColorStop(1, '#ff85c0');
            ctx.fillStyle = hullGrad;
            ctx.strokeStyle = '#fff0f6';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(0, 8, 54, 34, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            if (lily.landingInProgress) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(0, -6, 32, Math.PI, 0);
                ctx.lineTo(32, 4);
                ctx.lineTo(-32, 4);
                ctx.closePath();
                ctx.clip();
                drawLilyCharacter(ctx, 0, 6, 0.85, {
                    facing: 1,
                    onGround: true,
                    animTimer: 0,
                    vx: 0,
                    vy: 0,
                    power: lily.power
                });
                ctx.restore();
            }

            ctx.save();
            if (sp.state === 'parked') {
                ctx.translate(-18, -10);
                ctx.rotate(-0.55);
            }
            const domeGrad = ctx.createRadialGradient(-10, -18, 4, 0, -8, 34);
            domeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
            domeGrad.addColorStop(0.5, 'rgba(181, 245, 236, 0.32)');
            domeGrad.addColorStop(1, 'rgba(211, 173, 247, 0.48)');
            ctx.fillStyle = domeGrad;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(0, -4, 32, Math.PI, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            drawHeartShape(ctx, 0, 8, 14, '#ff4d94');
            ctx.restore();
        }

        // 🚀 NAVE ESTELAR DE META (Reemplaza la bandera final y el castillo)


        function drawGoalSpaceship(sp) {
            if (sp.x + sp.w + 120 < getCameraX() || sp.x - 120 > getCameraX() + VIEW_W) return;
            ctx.save();

            const centerX = sp.x + sp.w / 2;
            const groundY = 460;

            // 1. Plataforma Cósmica de Aterrizaje fija en el suelo + Rayo tractor luminoso
            ctx.save();
            ctx.fillStyle = '#531dab';
            ctx.strokeStyle = '#ffadd2';
            ctx.lineWidth = 3;
            drawRoundedRect(ctx, centerX - 78, groundY - 16, 156, 16, 7);
            ctx.fill();
            ctx.stroke();

            for (let i = -2; i <= 2; i++) {
                const lightOn = (Math.floor(getGlobalTick() / 10) + i) % 2 === 0;
                ctx.fillStyle = lightOn ? '#ffe58f' : '#ff85c0';
                ctx.beginPath();
                ctx.arc(centerX + i * 26, groundY - 8, 3.8, 0, Math.PI * 2);
                ctx.fill();
            }

            if (!sp.launching) {
                const beamGrad = ctx.createLinearGradient(centerX, sp.y + 70, centerX, groundY - 16);
                beamGrad.addColorStop(0, 'rgba(255, 229, 143, 0.32)');
                beamGrad.addColorStop(1, 'rgba(255, 133, 192, 0.06)');
                ctx.fillStyle = beamGrad;
                ctx.beginPath();
                ctx.moveTo(centerX - 36, sp.y + 90);
                ctx.lineTo(centerX + 36, sp.y + 90);
                ctx.lineTo(centerX + 64, groundY - 16);
                ctx.lineTo(centerX - 64, groundY - 16);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();

            // 2. Posición de la Nave (flota suavemente mientras espera, o sube al despegar)
            const hoverOffset = sp.reached ? 0 : Math.sin(getGlobalTick() * 0.07) * 5;
            const shipY = sp.y + hoverOffset;

            ctx.translate(centerX, shipY + 64);

            // 🔥 Fuego propulsor y resplandor bloom cuando la nave espera o despega
            const thrusterSize = sp.reached ? (sp.launching ? 34 : 24) : 14;
            drawMagicBloom(ctx, 0, 50, thrusterSize * 2.4, 'rgba(255, 169, 64, 0.68)', 'rgba(255, 133, 192, 0)');
            drawThrusterFlames(-22, 36, thrusterSize * 0.75);
            drawThrusterFlames(0, 40, thrusterSize);
            drawThrusterFlames(22, 36, thrusterSize * 0.75);

            if (AssetManager.isReady('props')) {
                // 🎨 Nave espacial rosada de la Fila 1 (./asets/sprites_props_enemies.png)
                const propsSheet = AssetManager.get('props');
                const ships = AssetManager.sprites.props.ships;

                if (lily.inSpaceship) {
                    ctx.save();
                    drawLilyCharacter(ctx, 0, -10, 0.72, {
                        facing: 1,
                        onGround: true,
                        animTimer: 0,
                        vx: 0,
                        vy: 0,
                        power: lily.power
                    });
                    ctx.restore();
                }

                // Frame 3 (simétrica frontal) al despegar con Lily dentro, Frame 2 (mirando a Lily) mientras espera
                const fr = sp.launching ? ships[3] : (sp.reached ? ships[4] : ships[2]);
                const drawW = 148;
                const drawH = drawW * (fr.h / fr.w);
                ctx.drawImage(propsSheet, fr.x, fr.y, fr.w, fr.h, -drawW / 2, -drawH + 48, drawW, drawH);

                if (!sp.reached) {
                    ctx.font = 'bold 14px Fredoka, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#ffe58f';
                    ctx.strokeStyle = '#261247';
                    ctx.lineWidth = 3.5;
                    ctx.strokeText('🚀 ¡SUBE A LA NAVE!', 0, -70);
                    ctx.fillText('🚀 ¡SUBE A LA NAVE!', 0, -70);
                }

                ctx.restore();
                return;
            }

            // Fallback vectorial original
            if (!sp.launching) {
                ctx.strokeStyle = '#d3adf7';
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(-36, 32);
                ctx.lineTo(-48, 52);
                ctx.moveTo(36, 32);
                ctx.lineTo(48, 52);
                ctx.stroke();
            }

            ctx.fillStyle = '#ff66b3';
            ctx.strokeStyle = '#fff0f6';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-38, 0);
            ctx.quadraticCurveTo(-68, 18, -56, 42);
            ctx.lineTo(-30, 32);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(38, 0);
            ctx.quadraticCurveTo(68, 18, 56, 42);
            ctx.lineTo(30, 32);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            const hullGrad = ctx.createLinearGradient(-48, -45, 48, 40);
            hullGrad.addColorStop(0, '#ffffff');
            hullGrad.addColorStop(0.55, '#ffd6eb');
            hullGrad.addColorStop(1, '#ff85c0');
            ctx.fillStyle = hullGrad;
            ctx.strokeStyle = '#fff0f6';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(0, 8, 54, 34, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ff85c0';
            ctx.beginPath();
            ctx.moveTo(-24, -22);
            ctx.quadraticCurveTo(-28, -42, -12, -32);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(24, -22);
            ctx.quadraticCurveTo(28, -42, 12, -32);
            ctx.closePath();
            ctx.fill();

            if (lily.inSpaceship) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(0, -6, 32, Math.PI, 0);
                ctx.lineTo(32, 4);
                ctx.lineTo(-32, 4);
                ctx.closePath();
                ctx.clip();
                drawLilyCharacter(ctx, 0, 6, 0.85, {
                    facing: 1,
                    onGround: true,
                    animTimer: 0,
                    vx: 0,
                    vy: 0,
                    power: lily.power
                });
                ctx.restore();
            }

            const domeGrad = ctx.createRadialGradient(-10, -18, 4, 0, -8, 34);
            domeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
            domeGrad.addColorStop(0.5, 'rgba(181, 245, 236, 0.32)');
            domeGrad.addColorStop(1, 'rgba(211, 173, 247, 0.48)');
            ctx.fillStyle = domeGrad;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(0, -4, 32, Math.PI, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.strokeStyle = '#fff0f6';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(0, -36);
            ctx.lineTo(0, -50);
            ctx.stroke();
            drawStarShape(ctx, 0, -53, 5, 10, 5, '#ffe58f');

            drawHeartShape(ctx, 0, 8, 14, '#ff4d94');
            ctx.fillStyle = '#ffe58f';
            ctx.beginPath();
            ctx.arc(-28, 12, 5.5, 0, Math.PI * 2);
            ctx.arc(28, 12, 5.5, 0, Math.PI * 2);
            ctx.fill();

            if (!sp.reached) {
                ctx.font = 'bold 14px Fredoka, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#ffe58f';
                ctx.strokeStyle = '#261247';
                ctx.lineWidth = 3.5;
                ctx.strokeText('🚀 ¡SUBE A LA NAVE!', 0, -70);
                ctx.fillText('🚀 ¡SUBE A LA NAVE!', 0, -70);
            }

            ctx.restore();
        }


export {
    aabb,
    drawCloudPlatform,
    drawThrusterFlames,
    drawThrusterPlatform,
    drawRooftopPlatform,
    drawLadder,
    drawCheckpointFlag,
    drawArrivalSpaceship,
    drawGoalSpaceship
};
