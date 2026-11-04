/**
 * Weather.js - Partículas de lluvia cósmica, ceniza, meteoritos y cielo estrellado
 */
import { AssetManager } from '../core/AssetLoader.js';
import { drawStarShape, drawHeartShape, drawRoundedRect } from '../entities/Collectibles.js';
import { VIEW_W, VIEW_H } from '../core/Camera.js';
import { LEVEL_THEMES } from '../levels/LevelManager.js';

export function createWeatherState() {
    const bgStars = [];
    for (let i = 0; i < 90; i++) {
        bgStars.push({
            x: Math.random() * VIEW_W * 2.2,
            y: Math.random() * (VIEW_H * 0.78),
            size: Math.random() * 2.4 + 0.8,
            blinkSpeed: Math.random() * 0.04 + 0.015,
            blinkOffset: Math.random() * Math.PI * 2,
            color: ['#ffffff', '#ffeb3b', '#e1bee7', '#b3e5fc', '#ffcdd2'][Math.floor(Math.random() * 5)]
        });
    }

    const constellations = [
        { name: 'Osa Kawaii', stars: [{ x: 120, y: 80 }, { x: 155, y: 70 }, { x: 195, y: 85 }, { x: 230, y: 110 }, { x: 250, y: 145 }, { x: 215, y: 160 }, { x: 180, y: 140 }] },
        { name: 'Corazón Estelar', stars: [{ x: 620, y: 90 }, { x: 645, y: 70 }, { x: 675, y: 75 }, { x: 690, y: 105 }, { x: 655, y: 145 }, { x: 620, y: 105 }] },
        { name: 'Gatito Cósmico', stars: [{ x: 410, y: 130 }, { x: 425, y: 105 }, { x: 440, y: 130 }, { x: 460, y: 130 }, { x: 475, y: 105 }, { x: 490, y: 130 }, { x: 485, y: 155 }, { x: 450, y: 165 }, { x: 415, y: 155 }] }
    ];

    const bgPlanets = [
        { x: 180, y: 95, r: 36, type: 'saturn', color: '#ff80bf', ringColor: '#ffe066' },
        { x: 520, y: 140, r: 22, type: 'crater', color: '#80d8ff' },
        { x: 860, y: 80, r: 48, type: 'sun', color: '#ffd166' }
    ];

    const bgClouds = [];
    for (let i = 0; i < 7; i++) {
        bgClouds.push({
            x: i * 220 + Math.random() * 80,
            y: 180 + Math.sin(i * 1.3) * 60,
            w: 130 + Math.random() * 60,
            h: 38 + Math.random() * 16,
            speed: 0.15 + Math.random() * 0.15,
            color: ['rgba(255,182,193,0.3)', 'rgba(230,190,255,0.28)', 'rgba(179,229,252,0.26)'][i % 3]
        });
    }

    return {
        bgStars,
        shootingStars: [],
        weatherParticles: [],
        constellations,
        bgPlanets,
        bgClouds
    };
}

        function spawnShootingStar() {
            const list = (typeof window !== 'undefined' && window.weatherState) ? window.weatherState.shootingStars : null;
            if (!list) return;
            list.push({
                x: Math.random() * VIEW_W * 0.8 + 100,
                y: Math.random() * 150 + 20,
                vx: -(Math.random() * 4.5 + 4.5),
                vy: Math.random() * 2.2 + 1.2,
                alpha: 1
            });
            const gState = typeof window !== 'undefined' ? window.gameState : '';
            const a = typeof window !== 'undefined' ? window.audio : null;
            if (gState === 'PLAYING' && Math.random() < 0.35 && a && a.playStarShimmer) {
                a.playStarShimmer();
            }
        }


        function drawKawaiiPlanet(px, py, r, bodyColor, stripeColor, ringColor, tilt) {
            ctx.save();
            ctx.translate(px, py);

            // Halo cósmico suave
            const glow = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2.1);
            glow.addColorStop(0, 'rgba(255, 194, 226, 0.22)');
            glow.addColorStop(1, 'rgba(255, 194, 226, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, r * 2.1, 0, Math.PI * 2);
            ctx.fill();

            // Cuerpo del planeta
            ctx.fillStyle = bodyColor;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();

            // Franja decorativa del planeta
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.clip();
            ctx.rotate(tilt);
            ctx.fillStyle = stripeColor;
            ctx.fillRect(-r * 1.2, -r * 0.25, r * 2.4, r * 0.45);
            ctx.restore();

            // Anillo planetario brillante
            ctx.save();
            ctx.rotate(tilt);
            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            ctx.ellipse(0, 0, r * 1.85, r * 0.42, 0, -0.15 * Math.PI, 1.15 * Math.PI);
            ctx.stroke();
            ctx.restore();

            // Carita kawaii del planeta
            ctx.fillStyle = '#3b1d6e';
            ctx.beginPath();
            ctx.arc(-6, -2, 2.2, 0, Math.PI * 2);
            ctx.arc(6, -2, 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#3b1d6e';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(0, 2, 3, 0.15 * Math.PI, 0.85 * Math.PI);
            ctx.stroke();

            ctx.restore();
        }



        function drawKawaiiMoon(mx, my) {
            ctx.save();
            ctx.translate(mx, my);

            const glow = ctx.createRadialGradient(0, 0, 25, 0, 0, 95);
            glow.addColorStop(0, 'rgba(255, 235, 160, 0.45)');
            glow.addColorStop(1, 'rgba(255, 235, 160, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, 95, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fff3b0';
            ctx.beginPath();
            ctx.arc(0, 0, 46, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 133, 192, 0.55)';
            ctx.beginPath();
            ctx.ellipse(-18, 6, 7, 4.5, 0, 0, Math.PI * 2);
            ctx.ellipse(14, 6, 7, 4.5, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#6b4c35';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(-14, -4, 6, 0.15 * Math.PI, 0.85 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(10, -4, 6, 0.15 * Math.PI, 0.85 * Math.PI);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(-2, 5, 5, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.stroke();

            ctx.fillStyle = '#ff85c0';
            ctx.beginPath();
            ctx.ellipse(-26, -32, 9, 5, -0.4, 0, Math.PI * 2);
            ctx.ellipse(-12, -38, 9, 5, 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffe58f';
            ctx.beginPath();
            ctx.arc(-19, -35, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }



        function drawFluffyBgCloud(x, y, scale, color) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, scale);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, 0, 28, 0, Math.PI * 2);
            ctx.arc(26, -8, 34, 0, Math.PI * 2);
            ctx.arc(56, 0, 26, 0, Math.PI * 2);
            drawRoundedRect(ctx, -20, 0, 95, 26, 12);
            ctx.fill();
            ctx.restore();
        }



        function renderStarryNightBackground(customCtx = null, customCameraX = null, customTheme = null) {
            const ctx = customCtx || (typeof window !== 'undefined' ? window.ctx : null);
            if (!ctx) return;
            const cameraX = (customCameraX !== null) ? customCameraX : (typeof window !== 'undefined' ? window.cameraX || 0 : 0);
            const currentLevelIndex = typeof window !== 'undefined' ? window.currentLevelIndex || 0 : 0;
            const theme = customTheme || (typeof window !== 'undefined' && window.LEVEL_THEMES ? window.LEVEL_THEMES[currentLevelIndex] : LEVEL_THEMES[currentLevelIndex]);
            const globalTick = typeof window !== 'undefined' ? window.globalTick || 0 : 0;
            const levelWidth = typeof window !== 'undefined' ? window.levelWidth || 6200 : 6200;
            const weatherParticles = typeof window !== 'undefined' ? window.weatherParticles || [] : [];
            const shootingStars = typeof window !== 'undefined' ? window.shootingStars || [] : [];
            const constellations = typeof window !== 'undefined' ? window.constellations || [] : [];
            const bgPlanets = typeof window !== 'undefined' ? window.bgPlanets || [] : [];
            const bgClouds = typeof window !== 'undefined' ? window.bgClouds || [] : [];
            const bgStars = typeof window !== 'undefined' ? window.bgStars || [] : [];
            const audio = typeof window !== 'undefined' ? window.audio : null;
            // theme already resolved

            if (AssetManager.isReady('bg')) {
                // 🎨 Fondo ilustrado (./asets/bg_cosmic_sunset.png) con parallax suave basado en cameraX
                const bgImg = AssetManager.get('bg');
                const drawW = Math.round(VIEW_W * 1.2);
                const extraW = drawW - VIEW_W;
                const maxCam = Math.max(1, (typeof levelWidth !== 'undefined' ? levelWidth : 4500) - VIEW_W);
                const ratio = Math.max(0, Math.min(1, cameraX / maxCam));
                const bgX = -ratio * extraW;

                ctx.save();
                ctx.drawImage(bgImg, bgX, 0, drawW, VIEW_H);

                // Sutil matiz atmosférico según el mundo para conservar la ambientación de cada nivel
                if (theme.timeOfDay === 'dark_boss') {
                    ctx.fillStyle = 'rgba(20, 4, 38, 0.38)';
                    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
                } else if (theme.timeOfDay === 'ruined_earth') {
                    ctx.fillStyle = 'rgba(21, 22, 30, 0.28)';
                    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
                } else if (theme.timeOfDay === 'somber_sunset') {
                    ctx.fillStyle = 'rgba(68, 13, 41, 0.25)';
                    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
                }
                ctx.restore();
            } else {
                // Fallback vectorial original si bg_cosmic_sunset.png aún no ha cargado
                const skyGrad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
                skyGrad.addColorStop(0, theme.skyTop);
                skyGrad.addColorStop(0.55, theme.skyMid);
                skyGrad.addColorStop(1, theme.skyBot);
                ctx.fillStyle = skyGrad;
                ctx.fillRect(0, 0, VIEW_W, VIEW_H);

                if (theme.timeOfDay === 'night') {
                    ctx.save();
                    const nebulaGrad = ctx.createRadialGradient(VIEW_W * 0.5, 130, 20, VIEW_W * 0.5, 150, 420);
                    nebulaGrad.addColorStop(0, 'rgba(255, 145, 210, 0.16)');
                    nebulaGrad.addColorStop(0.5, 'rgba(179, 127, 235, 0.1)');
                    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    ctx.fillStyle = nebulaGrad;
                    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
                    ctx.restore();

                    ctx.save();
                    for (let i = 0; i < bgStars.length; i++) {
                        const st = bgStars[i];
                        const sx = ((st.x - cameraX * 0.08) % VIEW_W + VIEW_W) % VIEW_W;
                        const alpha = 0.35 + 0.65 * Math.abs(Math.sin(globalTick * st.twinkleSpeed + st.phase));
                        ctx.globalAlpha = alpha;
                        ctx.fillStyle = st.color;
                        ctx.beginPath();
                        ctx.arc(sx, st.y, st.r, 0, Math.PI * 2);
                        ctx.fill();
                        if (st.isCrossStar && alpha > 0.75) {
                            ctx.strokeStyle = st.color;
                            ctx.lineWidth = 1.2;
                            ctx.beginPath();
                            ctx.moveTo(sx - st.r * 2.4, st.y);
                            ctx.lineTo(sx + st.r * 2.4, st.y);
                            ctx.moveTo(sx, st.y - st.r * 2.4);
                            ctx.lineTo(sx, st.y + st.r * 2.4);
                            ctx.stroke();
                        }
                    }
                    ctx.restore();

                    ctx.save();
                    constellations.forEach(c => {
                        const baseX = ((c.offsetX - cameraX * 0.05) % VIEW_W + VIEW_W) % VIEW_W;
                        const baseY = c.offsetY;
                        ctx.strokeStyle = 'rgba(255, 214, 245, 0.28)';
                        ctx.lineWidth = 1.5;
                        ctx.setLineDash([4, 4]);
                        ctx.beginPath();
                        c.points.forEach((pt, idx) => {
                            if (idx === 0) ctx.moveTo(baseX + pt[0], baseY + pt[1]);
                            else ctx.lineTo(baseX + pt[0], baseY + pt[1]);
                        });
                        ctx.stroke();
                        ctx.setLineDash([]);
                        c.points.forEach(pt => {
                            ctx.fillStyle = '#ffe58f';
                            ctx.beginPath();
                            ctx.arc(baseX + pt[0], baseY + pt[1], 2.5, 0, Math.PI * 2);
                            ctx.fill();
                        });
                    });
                    ctx.restore();

                    drawKawaiiMoon(VIEW_W - 140 - (cameraX * 0.02), 105);

                } else if (theme.timeOfDay === 'sunset') {
                    ctx.save();
                    ctx.globalAlpha = 0.45;
                    ctx.fillStyle = '#ffe58f';
                    const sunsetStarsCount = Math.min(65, bgStars.length);
                    for (let i = 0; i < sunsetStarsCount; i++) {
                        const st = bgStars[i];
                        if (st.y > 220) continue;
                        const sx = ((st.x - cameraX * 0.06) % VIEW_W + VIEW_W) % VIEW_W;
                        ctx.beginPath();
                        ctx.arc(sx, st.y, st.r * 0.9, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();

                    const sunX = VIEW_W - 175 - (cameraX * 0.015);
                    const sunY = 215;
                    ctx.save();
                    const sunGlow = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 150);
                    sunGlow.addColorStop(0, 'rgba(255, 229, 143, 0.65)');
                    sunGlow.addColorStop(0.5, 'rgba(255, 102, 179, 0.30)');
                    sunGlow.addColorStop(1, 'rgba(255, 102, 179, 0)');
                    ctx.fillStyle = sunGlow;
                    ctx.beginPath();
                    ctx.arc(sunX, sunY, 150, 0, Math.PI * 2);
                    ctx.fill();

                    const sunGrad = ctx.createLinearGradient(sunX, sunY - 62, sunX, sunY + 62);
                    sunGrad.addColorStop(0, '#fffb8f');
                    sunGrad.addColorStop(0.55, '#ffa940');
                    sunGrad.addColorStop(1, '#ff4d94');
                    ctx.fillStyle = sunGrad;
                    ctx.beginPath();
                    ctx.arc(sunX, sunY, 62, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#5c1d52';
                    ctx.beginPath();
                    ctx.arc(sunX - 16, sunY - 4, 4, 0, Math.PI * 2);
                    ctx.arc(sunX + 16, sunY - 4, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#5c1d52';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.arc(sunX, sunY + 4, 7, 0.15 * Math.PI, 0.85 * Math.PI);
                    ctx.stroke();
                    ctx.restore();

                } else if (theme.timeOfDay === 'day') {
                    ctx.save();
                    for (let band = 0; band < 3; band++) {
                        ctx.strokeStyle = band === 0 ? 'rgba(255, 133, 192, 0.32)' : (band === 1 ? 'rgba(255, 245, 102, 0.28)' : 'rgba(179, 127, 235, 0.28)');
                        ctx.lineWidth = 18;
                        ctx.beginPath();
                        for (let x = 0; x <= VIEW_W; x += 40) {
                            const y = 95 + band * 26 + Math.sin((x + globalTick * 2 + cameraX * 0.1) * 0.012 + band) * 18;
                            if (x === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                    }
                    ctx.restore();

                    const daySunX = VIEW_W - 145 - (cameraX * 0.015);
                    const daySunY = 105;
                    ctx.save();
                    ctx.translate(daySunX, daySunY);
                    ctx.save();
                    ctx.rotate(globalTick * 0.01);
                    for (let r = 0; r < 12; r++) {
                        ctx.rotate(Math.PI / 6);
                        ctx.fillStyle = 'rgba(255, 236, 61, 0.55)';
                        ctx.beginPath();
                        ctx.moveTo(-7, -48);
                        ctx.lineTo(0, -68);
                        ctx.lineTo(7, -48);
                        ctx.closePath();
                        ctx.fill();
                    }
                    ctx.restore();

                    ctx.fillStyle = '#fff566';
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(0, 0, 44, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#ff85c0';
                    ctx.beginPath();
                    ctx.ellipse(-18, 5, 6.5, 4, 0, 0, Math.PI * 2);
                    ctx.ellipse(18, 5, 6.5, 4, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#593869';
                    ctx.beginPath();
                    ctx.arc(-12, -4, 3.8, 0, Math.PI * 2);
                    ctx.arc(12, -4, 3.8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#593869';
                    ctx.lineWidth = 2.4;
                    ctx.beginPath();
                    ctx.arc(0, 3, 6.5, 0.1 * Math.PI, 0.9 * Math.PI);
                    ctx.stroke();
                    ctx.restore();

                } else if (theme.timeOfDay === 'dark_boss') {
                    ctx.save();
                    const darkNebula = ctx.createRadialGradient(VIEW_W * 0.5, 160, 20, VIEW_W * 0.5, 180, 480);
                    darkNebula.addColorStop(0, 'rgba(168, 7, 26, 0.24)');
                    darkNebula.addColorStop(0.55, 'rgba(83, 29, 171, 0.18)');
                    darkNebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    ctx.fillStyle = darkNebula;
                    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
                    ctx.restore();

                    ctx.save();
                    const darkStarsCount = Math.min(95, bgStars.length);
                    for (let idx = 0; idx < darkStarsCount; idx++) {
                        const st = bgStars[idx];
                        const sx = ((st.x - cameraX * 0.06) % VIEW_W + VIEW_W) % VIEW_W;
                        const alpha = 0.25 + 0.55 * Math.abs(Math.sin(globalTick * st.twinkleSpeed + st.phase));
                        ctx.globalAlpha = alpha;
                        ctx.fillStyle = idx % 3 === 0 ? '#ff4d4f' : (idx % 2 === 0 ? '#b37feb' : '#ffe58f');
                        ctx.beginPath();
                        ctx.arc(sx, st.y, st.r, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();

                    const eclX = VIEW_W - 155 - (cameraX * 0.015);
                    const eclY = 110;
                    ctx.save();
                    const eclGlow = ctx.createRadialGradient(eclX, eclY, 22, eclX, eclY, 110);
                    eclGlow.addColorStop(0, 'rgba(255, 77, 79, 0.55)');
                    eclGlow.addColorStop(0.5, 'rgba(114, 46, 209, 0.25)');
                    eclGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    ctx.fillStyle = eclGlow;
                    ctx.beginPath();
                    ctx.arc(eclX, eclY, 110, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#a8071a';
                    ctx.strokeStyle = '#ff7875';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(eclX, eclY, 44, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#140526';
                    ctx.beginPath();
                    ctx.arc(eclX + 10, eclY - 6, 36, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();

                } else if (theme.timeOfDay === 'ruined_earth') {
                    ctx.save();
                    const ruinedGlow = ctx.createRadialGradient(VIEW_W * 0.5, 140, 20, VIEW_W * 0.5, 160, 460);
                    ruinedGlow.addColorStop(0, 'rgba(108, 92, 231, 0.12)');
                    ruinedGlow.addColorStop(0.55, 'rgba(214, 48, 49, 0.15)');
                    ruinedGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    ctx.fillStyle = ruinedGlow;
                    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

                    const sunX = VIEW_W - 160 - (cameraX * 0.02);
                    const sunY = 130;
                    const paleSunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 80);
                    paleSunGlow.addColorStop(0, 'rgba(253, 203, 110, 0.45)');
                    paleSunGlow.addColorStop(0.6, 'rgba(225, 112, 85, 0.18)');
                    paleSunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    ctx.fillStyle = paleSunGlow;
                    ctx.beginPath();
                    ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#ffeaa7';
                    ctx.beginPath();
                    ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();

                } else if (theme.timeOfDay === 'somber_sunset') {
                    ctx.save();
                    const sunsetGlow = ctx.createRadialGradient(VIEW_W * 0.45, 170, 20, VIEW_W * 0.45, 180, 520);
                    sunsetGlow.addColorStop(0, 'rgba(235, 77, 75, 0.35)');
                    sunsetGlow.addColorStop(0.45, 'rgba(109, 33, 79, 0.42)');
                    sunsetGlow.addColorStop(1, 'rgba(19, 4, 28, 0)');
                    ctx.fillStyle = sunsetGlow;
                    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

                    const sunX = VIEW_W * 0.42 - (cameraX * 0.015);
                    const sunY = 160;
                    const bloodSunGlow = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 130);
                    bloodSunGlow.addColorStop(0, 'rgba(255, 107, 129, 0.7)');
                    bloodSunGlow.addColorStop(0.5, 'rgba(235, 77, 75, 0.35)');
                    bloodSunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    ctx.fillStyle = bloodSunGlow;
                    ctx.beginPath();
                    ctx.arc(sunX, sunY, 130, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#ff4757';
                    ctx.beginPath();
                    ctx.arc(sunX, sunY, 48, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = 'rgba(25, 14, 20, 0.78)';
                    ctx.fillRect(sunX - 75, sunY - 16, 150, 7);
                    ctx.fillRect(sunX - 65, sunY + 6, 130, 8);
                    ctx.fillRect(sunX - 85, sunY + 24, 170, 9);
                    ctx.restore();
                }

                // Planetas con anillos en el cielo (fallback vectorial)
                bgPlanets.forEach(pl => {
                    const px = ((pl.x - cameraX * pl.speed) % (VIEW_W + 260) + (VIEW_W + 260)) % (VIEW_W + 260) - 130;
                    drawKawaiiPlanet(px, pl.y, pl.r, pl.bodyColor, pl.stripeColor, pl.ringColor, pl.tilt);
                });

                bgClouds.forEach((cl, idx) => {
                    const cx = ((cl.x - cameraX * cl.speed) % (VIEW_W + 300) + (VIEW_W + 300)) % (VIEW_W + 300) - 150;
                    const tint = idx % 2 === 0 ? theme.cloudTint1 : theme.cloudTint2;
                    drawFluffyBgCloud(cx, cl.y, cl.scale, tint);
                });

                // Montañas / Paisaje de fondo diferente según el mundo (fallback vectorial)
                ctx.save();
                for (let i = -1; i < 6; i++) {
                    const hx = i * 320 - ((cameraX * 0.22) % 320);
                    if (theme.timeOfDay === 'night') {
                        ctx.fillStyle = i % 2 === 0 ? 'rgba(69, 32, 115, 0.55)' : 'rgba(92, 42, 140, 0.45)';
                        ctx.beginPath();
                        ctx.arc(hx + 160, 480, 190, Math.PI, 0);
                        ctx.fill();
                    } else if (theme.timeOfDay === 'sunset') {
                        ctx.fillStyle = i % 2 === 0 ? 'rgba(135, 31, 98, 0.55)' : 'rgba(184, 51, 106, 0.45)';
                        drawRoundedRect(ctx, hx + 25, 335 + (i % 2) * 28, 250, 160, 26);
                        ctx.fill();
                    } else if (theme.timeOfDay === 'dark_boss') {
                        ctx.fillStyle = i % 2 === 0 ? 'rgba(18, 4, 34, 0.88)' : 'rgba(36, 8, 56, 0.82)';
                        ctx.strokeStyle = 'rgba(146, 84, 222, 0.35)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(hx, 470);
                        ctx.lineTo(hx + 65, 270);
                        ctx.lineTo(hx + 135, 410);
                        ctx.lineTo(hx + 215, 240);
                        ctx.lineTo(hx + 320, 470);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    } else if (theme.timeOfDay === 'ruined_earth') {
                        ctx.fillStyle = i % 2 === 0 ? 'rgba(30, 39, 46, 0.92)' : 'rgba(47, 53, 66, 0.85)';
                        ctx.fillRect(hx + 10, 220 + (i % 3) * 25, 75, 260);
                        ctx.fillStyle = 'rgba(255, 234, 167, 0.12)';
                        for (let wy = 235 + (i % 3) * 25; wy < 420; wy += 22) {
                            for (let wx = hx + 18; wx < hx + 75; wx += 16) {
                                if ((wx + wy) % 5 !== 0) ctx.fillRect(wx, wy, 8, 12);
                            }
                        }
                        ctx.fillStyle = i % 2 === 0 ? 'rgba(24, 32, 38, 0.94)' : 'rgba(38, 44, 56, 0.88)';
                        ctx.fillRect(hx + 95, 260 - (i % 2) * 35, 65, 220);

                        ctx.strokeStyle = 'rgba(20, 24, 28, 0.95)';
                        ctx.lineWidth = 3.5;
                        ctx.lineCap = 'round';
                        const treeX = hx + 200;
                        ctx.beginPath();
                        ctx.moveTo(treeX, 460);
                        ctx.lineTo(treeX, 360);
                        ctx.lineTo(treeX - 22, 325);
                        ctx.moveTo(treeX, 375);
                        ctx.lineTo(treeX + 24, 335);
                        ctx.lineTo(treeX + 34, 305);
                        ctx.moveTo(treeX - 14, 338);
                        ctx.lineTo(treeX - 32, 310);
                        ctx.stroke();

                        ctx.strokeStyle = 'rgba(47, 53, 66, 0.6)';
                        ctx.lineWidth = 1.2;
                        ctx.beginPath();
                        ctx.moveTo(hx + 10, 240);
                        ctx.quadraticCurveTo(hx + 60, 290, hx + 100, 275);
                        ctx.stroke();
                    } else if (theme.timeOfDay === 'somber_sunset') {
                        ctx.fillStyle = i % 2 === 0 ? 'rgba(25, 12, 19, 0.95)' : 'rgba(40, 16, 26, 0.90)';
                        ctx.fillRect(hx + 15, 200 + (i % 3) * 28, 85, 280);
                        ctx.fillRect(hx + 30, 160 + (i % 3) * 28, 16, 45);
                        ctx.fillRect(hx + 65, 175 + (i % 3) * 28, 18, 30);
                        ctx.strokeStyle = 'rgba(52, 18, 32, 0.94)';
                        ctx.lineWidth = 3.5;
                        ctx.beginPath();
                        ctx.moveTo(hx + 120, 460);
                        ctx.lineTo(hx + 145, 220);
                        ctx.lineTo(hx + 215, 275);
                        ctx.moveTo(hx + 130, 300);
                        ctx.lineTo(hx + 195, 290);
                        ctx.stroke();
                        ctx.fillStyle = 'rgba(18, 8, 14, 0.96)';
                        ctx.fillRect(hx + 175, 310, 135, 22);
                        ctx.fillRect(hx + 205, 332, 22, 140);
                    } else {
                        ctx.fillStyle = i % 2 === 0 ? 'rgba(145, 213, 255, 0.65)' : 'rgba(255, 194, 226, 0.65)';
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(hx + 20, 470);
                        ctx.lineTo(hx + 115, 290);
                        ctx.lineTo(hx + 210, 470);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(hx + 140, 470);
                        ctx.lineTo(hx + 230, 325);
                        ctx.lineTo(hx + 320, 470);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    }
                }
                ctx.restore();
            }

            // 🌠 Estrellas fugaces con mezcla aditiva (globalCompositeOperation = 'lighter')
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            shootingStars.forEach(s => {
                ctx.save();
                ctx.globalAlpha = s.alpha;
                const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 8, s.y - s.vy * 8);
                grad.addColorStop(0, '#ffe58f');
                grad.addColorStop(1, 'rgba(255, 133, 192, 0)');
                ctx.strokeStyle = grad;
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
                ctx.stroke();
                drawStarShape(ctx, s.x, s.y, 5, 6, 3, '#ffe58f');
                ctx.restore();
            });
            ctx.restore();

            // 3. Efecto Climático en Primer Plano con mezcla aditiva (globalCompositeOperation = 'lighter')
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            if (theme.weatherType === 'starfall') {
                ctx.fillStyle = 'rgba(255, 229, 143, 0.75)';
                ctx.beginPath();
                for (let i = 0; i < weatherParticles.length; i++) {
                    const wp = weatherParticles[i];
                    ctx.moveTo(wp.x + wp.size * 0.65, wp.y);
                    ctx.arc(wp.x, wp.y, wp.size * 0.65, 0, Math.PI * 2);
                }
                ctx.fill();
            } else if (theme.weatherType === 'cosmic_rain') {
                ctx.strokeStyle = 'rgba(255, 224, 245, 0.65)';
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                for (let i = 0; i < weatherParticles.length; i++) {
                    const wp = weatherParticles[i];
                    ctx.moveTo(wp.x, wp.y);
                    ctx.lineTo(wp.x - 5, wp.y + 13);
                }
                ctx.stroke();
            } else if (theme.weatherType === 'dark_ash') {
                ctx.fillStyle = 'rgba(255, 77, 109, 0.65)';
                ctx.beginPath();
                for (let i = 0; i < weatherParticles.length; i++) {
                    const wp = weatherParticles[i];
                    if (wp.size > 3.2) {
                        ctx.moveTo(wp.x + wp.size * 0.75, wp.y);
                        ctx.arc(wp.x, wp.y, wp.size * 0.75, 0, Math.PI * 2);
                    }
                }
                ctx.fill();
                ctx.fillStyle = 'rgba(179, 127, 235, 0.45)';
                ctx.beginPath();
                for (let i = 0; i < weatherParticles.length; i++) {
                    const wp = weatherParticles[i];
                    if (wp.size <= 3.2) {
                        ctx.moveTo(wp.x + wp.size * 0.75, wp.y);
                        ctx.arc(wp.x, wp.y, wp.size * 0.75, 0, Math.PI * 2);
                    }
                }
                ctx.fill();
            } else if (theme.weatherType === 'ruined_ash') {
                // Cenizas grises y ascuas flotantes de la Tierra Devastada
                ctx.fillStyle = 'rgba(178, 190, 195, 0.55)';
                ctx.beginPath();
                for (let i = 0; i < weatherParticles.length; i++) {
                    const wp = weatherParticles[i];
                    if (wp.size > 2.8) {
                        ctx.moveTo(wp.x + wp.size * 0.6, wp.y);
                        ctx.arc(wp.x, wp.y, wp.size * 0.6, 0, Math.PI * 2);
                    }
                }
                ctx.fill();

                // Ascuas incandescentes anaranjadas/rojizas
                ctx.fillStyle = 'rgba(255, 118, 117, 0.75)';
                ctx.beginPath();
                for (let i = 0; i < weatherParticles.length; i++) {
                    const wp = weatherParticles[i];
                    if (wp.size <= 2.8) {
                        ctx.moveTo(wp.x + wp.size * 0.7, wp.y);
                        ctx.arc(wp.x, wp.y, wp.size * 0.7, 0, Math.PI * 2);
                    }
                }
                ctx.fill();
            } else if (theme.weatherType === 'blood_embers') {
                // Ascuas incandescentes color rubí y chispas de fuego que flotan en el viento sombrío
                ctx.fillStyle = 'rgba(255, 71, 87, 0.85)';
                ctx.beginPath();
                for (let i = 0; i < weatherParticles.length; i++) {
                    const wp = weatherParticles[i];
                    if (wp.size > 2.6) {
                        ctx.moveTo(wp.x + wp.size * 0.75, wp.y);
                        ctx.arc(wp.x, wp.y, wp.size * 0.75, 0, Math.PI * 2);
                    }
                }
                ctx.fill();

                // Chispas anaranjadas y doradas brillantes
                ctx.fillStyle = 'rgba(255, 165, 2, 0.9)';
                ctx.beginPath();
                for (let i = 0; i < weatherParticles.length; i++) {
                    const wp = weatherParticles[i];
                    if (wp.size <= 2.6) {
                        ctx.moveTo(wp.x + wp.size * 0.65, wp.y);
                        ctx.arc(wp.x, wp.y, wp.size * 0.65, 0, Math.PI * 2);
                    }
                }
                ctx.fill();
            } else {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                for (let i = 0; i < weatherParticles.length; i++) {
                    const wp = weatherParticles[i];
                    ctx.moveTo(wp.x + wp.size, wp.y);
                    ctx.arc(wp.x, wp.y, wp.size, 0, Math.PI * 2);
                }
                ctx.fill();
            }
            ctx.restore();

            // Destello de relámpago tenebroso en el Mundo 1-4
            const lf = (typeof window !== 'undefined' ? window.lightningFlash || 0 : 0);
            if (lf > 0) {
                ctx.save();
                ctx.fillStyle = `rgba(255, 180, 220, ${lf * 0.025})`;
                ctx.fillRect(0, 0, VIEW_W, VIEW_H);
                ctx.restore();
            }
        }



export {
    spawnShootingStar,
    drawKawaiiPlanet,
    drawKawaiiMoon,
    drawFluffyBgCloud,
    renderStarryNightBackground
};
