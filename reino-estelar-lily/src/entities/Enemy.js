/**
 * Enemy.js - Marcianos, hombres enmascarados y zombies
 */
import { AssetManager, drawMagicBloom } from '../core/AssetLoader.js';
import { drawStarShape, drawHeartShape, drawRoundedRect } from './Collectibles.js';
const getGlobalTick = () => (typeof window !== 'undefined' ? window.globalTick || 0 : 0);
const getLily = () => (typeof window !== 'undefined' ? window.lily : null);


        function befriendEnemy(en) {
            en.happy = true;
            const isZombie = en.kind === 'zombie_masked';
            const isMasked = en.kind === 'masked_man';
            const points = isZombie ? 500 : (isMasked ? 300 : 250);
            lily.score += points;
            audio.playBefriend();
            addParticles(en.x + en.w / 2, en.y + en.h / 2, isZombie ? 22 : 14, (isZombie || isMasked) ? 'heart' : 'star', isZombie ? '#ff7875' : '#ffe58f');
            const msg = isZombie
                ? '¡Alma liberada de la oscuridad! 🕊️💖 +500'
                : (isMasked
                    ? '¡Máscara destruida! 🕊️ Humano salvado +300'
                    : (en.kind === 'cloud' ? '¡Marciano Mareado! 🛸💫 +250' : '¡Alien derrotado! 👾💫 +250'));
            addFloatingText(en.x + en.w / 2, en.y - 10, msg, isZombie ? '#ff4d4f' : (isMasked ? '#ff7675' : '#b5f5ec'));
            updateHUD();
        }

        // 🎆 Celebración de victoria (5 segundos): fuegos artificiales + Lily salta de alegría
        const CELEBRATION_FRAMES = 300;
        let celebrationTimer = 0;
        let celebGroundY = null;
        let celebHops = 0;
        let celebHopCd = 0;
        const fireworks = { rockets: [], sparks: [] };
        const FW_COLORS = ['#ff85c0', '#ffe58f', '#b5f5ec', '#d3adf7', '#ffa940', '#95de64', '#ffffff'];



        function drawKawaiiObstacle(en) {
            ctx.save();
            const hop = Math.abs(Math.sin(en.bouncePhase)) * (en.kind === 'cushion' ? 6 : 3.5);
            const facingDir = en.vx <= 0 ? -1 : 1;
            ctx.translate(en.x + en.w / 2, en.y + en.h / 2 - hop);

            // Oscilación de los puños marcianos (se estiran con fuerza cuando golpean a Lily)
            const isPunching = en.punchTimer > 0;
            const punchReach = isPunching
                ? Math.sin((en.punchTimer / 28) * Math.PI) * 14 + 7
                : Math.sin(getGlobalTick() * 0.22 + en.bouncePhase) * 3.5;

            if (en.kind === 'masked_man') {
                // =========================================================
                // TIPO C: HOMBRE CON MÁSCARA ATERRADORA (MUNDO 2: TIERRA) 🎭🦹
                // =========================================================
                ctx.scale(facingDir, 1);

                if (en.happy) {
                    // ¡Máscara rota! El humano es salvado por Lily: sonríe aliviado con lágrimas de emoción y paloma de paz 🕊️💖
                    ctx.fillStyle = '#f7d2ba';
                    ctx.beginPath();
                    ctx.arc(0, -6, 15, 0, Math.PI * 2);
                    ctx.fill();

                    // Cabello humano despeinado
                    ctx.fillStyle = '#4b4b4b';
                    ctx.beginPath();
                    ctx.arc(0, -11, 15, Math.PI, 0);
                    ctx.fill();

                    // Ojos felices / aliviados (arcos ^_^)
                    ctx.strokeStyle = '#2d3436';
                    ctx.lineWidth = 2.2;
                    ctx.beginPath();
                    ctx.arc(-5, -6, 3, 0.15 * Math.PI, 0.85 * Math.PI);
                    ctx.moveTo(2, -6);
                    ctx.arc(5, -6, 3, 0.15 * Math.PI, 0.85 * Math.PI);
                    ctx.stroke();

                    // Sonrisa cálida
                    ctx.beginPath();
                    ctx.arc(0, -1, 5, 0.1 * Math.PI, 0.9 * Math.PI);
                    ctx.stroke();

                    // Fragmentos de máscara rota flotando hacia afuera
                    ctx.fillStyle = '#f5f6fa';
                    ctx.strokeStyle = '#2d3436';
                    ctx.lineWidth = 1.2;
                    ctx.fillRect(-18, -14, 6, 6);
                    ctx.fillRect(14, -12, 6, 5);

                    // Corazón y estrellitas de paz sobre su cabeza
                    drawHeartShape(ctx, 0, -28, 12, '#ff7675');
                    drawStarShape(ctx, -14, -26, 5, 6, 3, '#ffeaa7');
                    drawStarShape(ctx, 14, -26, 5, 6, 3, '#ffeaa7');

                } else {
                    // Capucha y gabardina oscura y rasgada
                    ctx.fillStyle = '#2d3436';
                    ctx.strokeStyle = '#1e272e';
                    ctx.lineWidth = 2;
                    // Capucha
                    ctx.beginPath();
                    ctx.arc(0, -8, 18, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    // Gabardina / torso oscuro
                    drawRoundedRect(ctx, -15, 4, 30, 22, 6);
                    ctx.fill();
                    ctx.stroke();

                    // Bordes rasgados de la capa inferior
                    ctx.fillStyle = '#1e272e';
                    for (let rx = -12; rx <= 10; rx += 7) {
                        ctx.beginPath();
                        ctx.moveTo(rx, 26);
                        ctx.lineTo(rx + 3.5, 33);
                        ctx.lineTo(rx + 7, 26);
                        ctx.fill();
                    }

                    // 🎭 Máscara aterradora de porcelana blanca angular
                    ctx.fillStyle = '#f5f6fa';
                    ctx.strokeStyle = '#2d3436';
                    ctx.lineWidth = 2.2;
                    ctx.beginPath();
                    ctx.moveTo(-11, -16);
                    ctx.lineTo(11, -16);
                    ctx.lineTo(13, -4);
                    ctx.lineTo(7, 8);
                    ctx.lineTo(0, 11);
                    ctx.lineTo(-7, 8);
                    ctx.lineTo(-13, -4);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();

                    // Ojos oscuros y aterradores con brillo rojo maligno
                    ctx.fillStyle = '#000000';
                    ctx.beginPath();
                    ctx.moveTo(-9, -7); ctx.lineTo(-3, -5); ctx.lineTo(-8, -2); ctx.closePath();
                    ctx.moveTo(9, -7); ctx.lineTo(3, -5); ctx.lineTo(8, -2); ctx.closePath();
                    ctx.fill();

                    // Pupilas rojas brillantes
                    const redGlow = (Math.sin(getGlobalTick() * 0.15) + 1) * 0.5;
                    ctx.fillStyle = `rgba(255, 30, 60, ${0.7 + redGlow * 0.3})`;
                    ctx.beginPath();
                    ctx.arc(-6, -5, 2.2, 0, Math.PI * 2);
                    ctx.arc(6, -5, 2.2, 0, Math.PI * 2);
                    ctx.fill();

                    // Marcas rojas tétricas en la máscara
                    ctx.strokeStyle = '#d63031';
                    ctx.lineWidth = 1.8;
                    ctx.beginPath();
                    ctx.moveTo(-6, -14); ctx.lineTo(-6, -9);
                    ctx.moveTo(6, -14); ctx.lineTo(6, -9);
                    ctx.moveTo(0, 0); ctx.lineTo(0, 7);
                    ctx.stroke();

                    // Boca con costuras o colmillos tétricos
                    ctx.strokeStyle = '#2d3436';
                    ctx.lineWidth = 1.6;
                    ctx.beginPath();
                    ctx.moveTo(-6, 5); ctx.lineTo(6, 5);
                    ctx.moveTo(-4, 2); ctx.lineTo(-4, 8);
                    ctx.moveTo(0, 2); ctx.lineTo(0, 8);
                    ctx.moveTo(4, 2); ctx.lineTo(4, 8);
                    ctx.stroke();

                    // Puño con vendajes que ataca a Lily
                    const reach = isPunching ? 16 : 4;
                    ctx.fillStyle = '#b2bec3';
                    ctx.strokeStyle = '#2d3436';
                    ctx.lineWidth = 1.6;
                    ctx.beginPath();
                    ctx.arc(13 + reach, 8, 6.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }

            } else if (en.kind === 'zombie_masked') {
                // =========================================================
                // TIPO D: HOMBRE ZOMBIE ENMASCARADO ACECHANTE (MUNDO 2-2) 🧟🎭
                // =========================================================
                ctx.scale(facingDir, 1);

                if (en.happy) {
                    // ¡Alma purificada de la oscuridad! Aura celestial, rostro en paz, palomas y corazones 🕊️💖
                    // Halo dorado celestial
                    ctx.strokeStyle = '#ffeaa7';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.ellipse(0, -28, 14, 5, 0, 0, Math.PI * 2);
                    ctx.stroke();

                    // Rostro sereno
                    ctx.fillStyle = '#f7d2ba';
                    ctx.beginPath();
                    ctx.arc(0, -6, 15, 0, Math.PI * 2);
                    ctx.fill();

                    // Cabello humano en reposo
                    ctx.fillStyle = '#3d3d3d';
                    ctx.beginPath();
                    ctx.arc(0, -11, 15, Math.PI, 0);
                    ctx.fill();

                    // Ojos cerrados con expresión pacífica
                    ctx.strokeStyle = '#2d3436';
                    ctx.lineWidth = 2.2;
                    ctx.beginPath();
                    ctx.arc(-5, -6, 3, 0.1 * Math.PI, 0.9 * Math.PI);
                    ctx.moveTo(2, -6);
                    ctx.arc(5, -6, 3, 0.1 * Math.PI, 0.9 * Math.PI);
                    ctx.stroke();

                    // Sonrisa de agradecimiento
                    ctx.beginPath();
                    ctx.arc(0, -1, 5, 0.1 * Math.PI, 0.9 * Math.PI);
                    ctx.stroke();

                    // Palomas y corazones flotando
                    drawHeartShape(ctx, -12, -34, 11, '#ff7675');
                    drawHeartShape(ctx, 12, -34, 11, '#ff7675');
                    drawStarShape(ctx, 0, -42, 5, 7, 3, '#ffeaa7');

                } else {
                    // Estado Hostil: Zombie enmascarado sediento de sangre
                    const twitch = en.isAlerted ? Math.sin(getGlobalTick() * 0.45) * 0.1 : Math.sin(getGlobalTick() * 0.16) * 0.04;
                    ctx.rotate(twitch);

                    // Aura sombría / miasma oscuro si está en alerta
                    if (en.isAlerted) {
                        ctx.fillStyle = 'rgba(235, 77, 75, 0.18)';
                        ctx.beginPath();
                        ctx.arc(0, 4, 28, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // Capucha y harapos desgarrados de color vino oscuro / púrpura ceniza
                    ctx.fillStyle = '#1e131d';
                    ctx.strokeStyle = '#3e1b2e';
                    ctx.lineWidth = 2;
                    // Capucha
                    ctx.beginPath();
                    ctx.arc(0, -8, 19, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    // Torso y túnica andrajosa
                    drawRoundedRect(ctx, -16, 4, 32, 24, 6);
                    ctx.fill();
                    ctx.stroke();

                    // Tirones y jirones inferiores ensangrentados
                    ctx.fillStyle = '#4b1528';
                    for (let rx = -14; rx <= 12; rx += 6) {
                        ctx.beginPath();
                        ctx.moveTo(rx, 28);
                        ctx.lineTo(rx + 3, 36);
                        ctx.lineTo(rx + 6, 28);
                        ctx.fill();
                    }

                    // 🎭 Máscara de hueso agrietada con cuernos
                    ctx.fillStyle = '#dfe4ea';
                    ctx.strokeStyle = '#2f3542';
                    ctx.lineWidth = 2.2;
                    ctx.beginPath();
                    ctx.moveTo(-13, -18);
                    ctx.lineTo(-19, -24); // Cuerno izquierdo
                    ctx.lineTo(-11, -21);
                    ctx.lineTo(0, -17);
                    ctx.lineTo(11, -21);
                    ctx.lineTo(19, -24); // Cuerno derecho
                    ctx.lineTo(13, -18);
                    ctx.lineTo(14, -3);
                    ctx.lineTo(8, 10);
                    ctx.lineTo(0, 13);
                    ctx.lineTo(-8, 10);
                    ctx.lineTo(-14, -3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();

                    // Grietas rojas profundas en la máscara
                    ctx.strokeStyle = '#c0392b';
                    ctx.lineWidth = 1.6;
                    ctx.beginPath();
                    ctx.moveTo(-7, -15); ctx.lineTo(-4, -8); ctx.lineTo(-7, 2);
                    ctx.moveTo(8, -14); ctx.lineTo(4, -9); ctx.lineTo(6, -2);
                    ctx.stroke();

                    // Cuencas oculares oscuras y vacías
                    ctx.fillStyle = '#0a0508';
                    ctx.beginPath();
                    ctx.arc(-6, -6, 4, 0, Math.PI * 2);
                    ctx.arc(6, -6, 4, 0.1, Math.PI * 2);
                    ctx.fill();

                    // Ojos incandescentes de zombie (rojo escarlata pulsante)
                    const pulse = (Math.sin(getGlobalTick() * 0.3) + 1) * 0.5;
                    ctx.fillStyle = en.isAlerted ? '#ff1744' : '#eb4d4b';
                    ctx.beginPath();
                    ctx.arc(-6, -6, 2.5 + pulse * 0.8, 0, Math.PI * 2);
                    ctx.arc(6, -6, 2.5 + pulse * 0.8, 0, Math.PI * 2);
                    ctx.fill();

                    // Estela de fuego en los ojos si está alertado
                    if (en.isAlerted) {
                        ctx.strokeStyle = 'rgba(255, 77, 79, 0.65)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(-6, -6); ctx.lineTo(-14, -9);
                        ctx.moveTo(6, -6); ctx.lineTo(14, -9);
                        ctx.stroke();
                    }

                    // Colmillos afilados en la mandíbula
                    ctx.fillStyle = '#f1f2f6';
                    ctx.beginPath();
                    ctx.moveTo(-5, 6); ctx.lineTo(-3, 11); ctx.lineTo(-1, 6);
                    ctx.moveTo(1, 6); ctx.lineTo(3, 11); ctx.lineTo(5, 6);
                    ctx.fill();

                    // Brazos y garras de zombie que se estiran para atrapar a Lily
                    const clawReach = isPunching ? 20 : (en.isAlerted ? 14 : 6);
                    // Brazo decrépito grisáceo
                    ctx.strokeStyle = '#57606f';
                    ctx.lineWidth = 4.5;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(10, 6);
                    ctx.lineTo(16 + clawReach * 0.6, 6);
                    ctx.lineTo(20 + clawReach, 7);
                    ctx.stroke();

                    // Garras negras afiladas
                    ctx.fillStyle = '#1e272e';
                    ctx.beginPath();
                    ctx.arc(20 + clawReach, 7, 4.5, 0, Math.PI * 2);
                    ctx.fill();
                    // Puntas de garra
                    ctx.strokeStyle = '#1e272e';
                    ctx.lineWidth = 1.8;
                    ctx.beginPath();
                    ctx.moveTo(20 + clawReach, 4); ctx.lineTo(26 + clawReach, 3);
                    ctx.moveTo(21 + clawReach, 7); ctx.lineTo(27 + clawReach, 7);
                    ctx.moveTo(20 + clawReach, 10); ctx.lineTo(26 + clawReach, 11);
                    ctx.stroke();
                }

            } else if (en.kind === 'cloud') {
                // =========================================================
                // TIPO A: MARCIANITO MORADO EN PLATILLO VOLADOR (Fila 3 de sprites_props_enemies.png) 🛸👾
                // =========================================================
                ctx.scale(facingDir, 1);

                if (AssetManager.isReady('props')) {
                    const propsSheet = AssetManager.get('props');
                    const saucers = AssetManager.sprites.props.saucers;
                    const bouncePhase = en.bouncePhase || 0;
                    const frameIdx = Math.abs(Math.floor(getGlobalTick() * 0.16 + bouncePhase)) % saucers.length;
                    const fr = saucers[frameIdx] || saucers[0];
                    const drawW = 50;
                    const drawH = drawW * (fr.h / fr.w);

                    drawMagicBloom(ctx, 0, 8, 26, 'rgba(211, 173, 247, 0.48)', 'rgba(255, 133, 192, 0)');
                    ctx.drawImage(propsSheet, fr.x, fr.y, fr.w, fr.h, -drawW / 2, -drawH / 2 - 2, drawW, drawH);

                    if (en.happy) {
                        drawStarShape(ctx, -10, -24, 5, 6, 3, '#ffe58f');
                        drawStarShape(ctx, 10, -26, 5, 5, 2.5, '#ff85c0');
                    }
                    if (isPunching) {
                        const fistX = 16 + punchReach;
                        const fistY = -1;
                        ctx.fillStyle = '#ffec3d';
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 1.8;
                        ctx.beginPath();
                        ctx.arc(fistX, fistY, 7.2, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        drawStarShape(ctx, fistX + 6, fistY, 5, 7, 3, '#ffe58f');
                    }
                } else {
                    // Fallback vectorial original
                    const antWobble = Math.sin(getGlobalTick() * 0.18 + en.bouncePhase) * 2.5;
                    ctx.strokeStyle = '#73d13d';
                    ctx.lineWidth = 2.6;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(-7, -14);
                    ctx.quadraticCurveTo(-12, -24, -10 + antWobble, -27);
                    ctx.moveTo(7, -14);
                    ctx.quadraticCurveTo(12, -24, 10 + antWobble, -27);
                    ctx.stroke();

                    ctx.fillStyle = '#ffe58f';
                    ctx.beginPath();
                    ctx.arc(-10 + antWobble, -27, 3.8, 0, Math.PI * 2);
                    ctx.arc(10 + antWobble, -27, 3.8, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#ff4d6d';
                    ctx.strokeStyle = '#fff0f6';
                    ctx.lineWidth = 1.6;
                    ctx.beginPath();
                    ctx.arc(-15, 3, 5.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    const alienGrad = ctx.createRadialGradient(-3, -4, 3, 0, 0, 20);
                    alienGrad.addColorStop(0, '#b7eb8f');
                    alienGrad.addColorStop(0.6, '#73d13d');
                    alienGrad.addColorStop(1, '#389e0d');
                    ctx.fillStyle = alienGrad;
                    ctx.strokeStyle = '#d9f7be';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 17, 15.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#531dab';
                    ctx.fillRect(-15, 6, 30, 4.5);
                    ctx.fillStyle = '#ffe58f';
                    ctx.beginPath();
                    ctx.arc(0, 8.2, 3, 0, Math.PI * 2);
                    ctx.fill();

                    if (en.happy) {
                        ctx.strokeStyle = '#135200';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(-6, -3, 3.2, 0, Math.PI);
                        ctx.moveTo(3, -3);
                        ctx.arc(6, -3, 3.2, 0, Math.PI);
                        ctx.stroke();
                        drawStarShape(ctx, -8, -22, 5, 6, 3, '#ffe58f');
                        drawStarShape(ctx, 8, -24, 5, 5, 2.5, '#ff85c0');
                    } else {
                        ctx.fillStyle = '#141118';
                        ctx.beginPath();
                        ctx.ellipse(-6.2, -3.5, 3.8, 4.8, -0.18, 0, Math.PI * 2);
                        ctx.ellipse(6.2, -3.5, 3.8, 4.8, 0.18, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.fillStyle = '#87e8de';
                        ctx.beginPath();
                        ctx.arc(-5.2, -5.0, 1.5, 0, Math.PI * 2);
                        ctx.arc(7.0, -5.0, 1.5, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.strokeStyle = '#135200';
                        ctx.lineWidth = 1.8;
                        ctx.beginPath();
                        ctx.moveTo(-10, -9.5);
                        ctx.lineTo(-2.5, -7.2);
                        ctx.moveTo(10, -9.5);
                        ctx.lineTo(2.5, -7.2);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.arc(0, 2.5, 2.8, 0.1 * Math.PI, 0.9 * Math.PI);
                        ctx.stroke();
                    }

                    const fistX = 15 + punchReach;
                    const fistY = isPunching ? -1 : 2;
                    ctx.strokeStyle = '#52c41a';
                    ctx.lineWidth = 3.5;
                    ctx.beginPath();
                    ctx.moveTo(11, 2);
                    ctx.lineTo(fistX, fistY);
                    ctx.stroke();

                    ctx.fillStyle = isPunching ? '#ffec3d' : '#ff4d6d';
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1.8;
                    ctx.beginPath();
                    ctx.arc(fistX, fistY, isPunching ? 7.2 : 6.0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    if (isPunching) {
                        drawStarShape(ctx, fistX + 6, fistY, 5, 7, 3, '#ffe58f');
                    }
                }

            } else {
                // =========================================================
                // TIPO B: ALIENÍGENA AZUL REDONDO CON CASCO ESPACIAL Y BURBUJAS (Fila 4 de sprites_props_enemies.png) 🫧👽
                // =========================================================
                ctx.scale(facingDir, 1);

                if (AssetManager.isReady('props')) {
                    const propsSheet = AssetManager.get('props');
                    const blueAliens = AssetManager.sprites.props.blueAliens;
                    let frameIdx;
                    if (isPunching || en.isAlerted) {
                        frameIdx = 6 + (Math.floor(getGlobalTick() * 0.2) % 2);
                    } else if (en.happy) {
                        frameIdx = 3 + (Math.floor(getGlobalTick() * 0.14) % 3);
                    } else {
                        frameIdx = Math.floor(getGlobalTick() * 0.14 + en.bouncePhase) % 6;
                    }
                    const fr = blueAliens[frameIdx];
                    const drawW = 50;
                    const drawH = drawW * (fr.h / fr.w);

                    drawMagicBloom(ctx, 0, 2, 24, 'rgba(135, 232, 222, 0.45)', 'rgba(179, 127, 235, 0)');
                    ctx.drawImage(propsSheet, fr.x, fr.y, fr.w, fr.h, -drawW / 2, -drawH / 2 - 2, drawW, drawH);

                    if (en.happy) {
                        drawStarShape(ctx, 0, -24, 5, 7, 3.5, '#ffe58f');
                    }
                    if (isPunching) {
                        const fistX = 16 + punchReach;
                        const fistY = -1;
                        ctx.fillStyle = '#ffe58f';
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 1.8;
                        ctx.beginPath();
                        ctx.arc(fistX, fistY, 7.5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        drawStarShape(ctx, fistX + 6, fistY, 5, 7.5, 3.5, '#b5f5ec');
                    }
                } else {
                    // Fallback vectorial original
                    ctx.fillStyle = 'rgba(181, 245, 236, 0.22)';
                    ctx.strokeStyle = '#b5f5ec';
                    ctx.lineWidth = 1.8;
                    ctx.beginPath();
                    ctx.arc(0, -3, 18.5, Math.PI, 0);
                    ctx.stroke();
                    ctx.fill();

                    ctx.strokeStyle = '#ff85c0';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.moveTo(0, -18);
                    ctx.lineTo(0, -26);
                    ctx.stroke();
                    ctx.fillStyle = '#ffe58f';
                    ctx.beginPath();
                    ctx.arc(0, -27, 4, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = en.happy ? '#d3adf7' : '#9254de';
                    ctx.strokeStyle = '#f9f0ff';
                    ctx.lineWidth = 2;
                    drawRoundedRect(ctx, -16, -13, 32, 26, 11);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#ff85c0';
                    drawRoundedRect(ctx, -18, 7, 36, 7, 4);
                    ctx.fill();

                    if (en.happy) {
                        ctx.strokeStyle = '#fff0f6';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(-6, -3, 3, 0, Math.PI);
                        ctx.moveTo(3, -3);
                        ctx.arc(6, -3, 3, 0, Math.PI);
                        ctx.stroke();
                        drawStarShape(ctx, 0, -24, 5, 7, 3.5, '#ffe58f');
                    } else {
                        [-7, 0, 7].forEach((ox, idx) => {
                            const oy = idx === 1 ? -6.5 : -2.5;
                            ctx.fillStyle = '#ffe58f';
                            ctx.beginPath();
                            ctx.arc(ox, oy, 3.1, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillStyle = '#22075e';
                            ctx.beginPath();
                            ctx.arc(ox + 0.7, oy, 1.4, 0, Math.PI * 2);
                            ctx.fill();
                        });
                    }

                    const fistX = 16 + punchReach;
                    const fistY = isPunching ? -1 : 2;
                    ctx.strokeStyle = '#ff85c0';
                    ctx.lineWidth = 3.5;
                    ctx.beginPath();
                    ctx.moveTo(12, 2);
                    ctx.lineTo(fistX, fistY);
                    ctx.stroke();

                    ctx.fillStyle = isPunching ? '#ffe58f' : '#ff66b3';
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1.8;
                    ctx.beginPath();
                    ctx.arc(fistX, fistY, isPunching ? 7.5 : 6.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    if (isPunching) {
                        drawStarShape(ctx, fistX + 6, fistY, 5, 7.5, 3.5, '#b5f5ec');
                    }
                }
            }

            ctx.restore();
        }

        // 🚩 Bandera de checkpoint: lila "dormida" y rosa brillante con estrella al activarse


export {
    drawKawaiiObstacle,
    befriendEnemy
};
