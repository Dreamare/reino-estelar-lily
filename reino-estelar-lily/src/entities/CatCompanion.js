/**
 * CatCompanion.js - Lógica del gatito protector (ataques y escudo)
 */
import { AssetManager } from '../core/AssetLoader.js';
import { drawStarShape, drawHeartShape, drawRoundedRect } from './Collectibles.js';
const getGlobalTick = () => (typeof window !== 'undefined' ? window.globalTick || 0 : 0);


export function createCatCompanionState() {
    return {
        active: false,
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        facing: 1,
        projectiles: []
    };
}

        function drawCatCompanionSprite(c, x, y, scale = 1, facing = 1) {
            c.save();
            c.translate(x, y);
            c.scale(scale * facing, scale);

            // Aura protectora estelar alrededor del gatito
            const aura = c.createRadialGradient(0, 0, 4, 0, 0, 24);
            aura.addColorStop(0, 'rgba(255, 229, 143, 0.55)');
            aura.addColorStop(1, 'rgba(255, 133, 192, 0)');
            c.fillStyle = aura;
            c.beginPath();
            c.arc(0, 0, 24, 0, Math.PI * 2);
            c.fill();

            // Alitas de ángel estelares batiendo suavemente
            const wingFlap = Math.sin(getGlobalTick() * 0.35) * 0.28;
            c.save();
            c.translate(-6, -2);
            c.rotate(-0.3 + wingFlap);
            c.fillStyle = '#fff0f6';
            c.strokeStyle = '#ffadd2';
            c.lineWidth = 1.4;
            c.beginPath();
            c.ellipse(-7, 0, 8, 4.5, 0.2, 0, Math.PI * 2);
            c.fill();
            c.stroke();
            c.restore();

            // Colita blanca y rosa ondulante
            const tailWag = Math.sin(getGlobalTick() * 0.2) * 3;
            c.strokeStyle = '#ffffff';
            c.lineWidth = 3.5;
            c.lineCap = 'round';
            c.beginPath();
            c.moveTo(-8, 6);
            c.quadraticCurveTo(-16, 2 + tailWag, -14, -5 + tailWag);
            c.stroke();

            // Cuerpo redondito blanco perlado del gatito
            c.fillStyle = '#ffffff';
            c.strokeStyle = '#ffc2e2';
            c.lineWidth = 1.8;
            c.beginPath();
            c.ellipse(0, 4, 9.5, 7.5, 0, 0, Math.PI * 2);
            c.fill();
            c.stroke();

            // Collar rosa con cascabel dorado protector
            c.strokeStyle = '#ff66b3';
            c.lineWidth = 2.4;
            c.beginPath();
            c.moveTo(-6, -1);
            c.quadraticCurveTo(0, 2, 6, -1);
            c.stroke();
            c.fillStyle = '#ffe58f';
            c.beginPath();
            c.arc(1, 1.5, 2.6, 0, Math.PI * 2);
            c.fill();

            // Cabeza del gatito con orejitas rosas
            c.fillStyle = '#ffffff';
            c.strokeStyle = '#ffc2e2';
            c.lineWidth = 1.8;
            c.beginPath();
            c.arc(0, -5, 9, 0, Math.PI * 2);
            c.fill();
            c.stroke();

            // Orejitas de gato
            const drawMiniEar = (ex, rot) => {
                c.save();
                c.translate(ex, -12);
                c.rotate(rot);
                c.fillStyle = '#ffffff';
                c.strokeStyle = '#ffc2e2';
                c.lineWidth = 1.5;
                c.beginPath();
                c.moveTo(-4, 3);
                c.quadraticCurveTo(0, -5, 4, 3);
                c.closePath();
                c.fill();
                c.stroke();
                c.fillStyle = '#ff9ed2';
                c.beginPath();
                c.moveTo(-2.2, 2.2);
                c.quadraticCurveTo(0, -2.5, 2.2, 2.2);
                c.closePath();
                c.fill();
                c.restore();
            };
            drawMiniEar(-5.5, -0.28);
            drawMiniEar(5.5, 0.28);

            // Ojitos brillantes, naricita rosa y bigotitos
            c.fillStyle = '#261712';
            c.beginPath();
            c.arc(-3.2, -5, 1.7, 0, Math.PI * 2);
            c.arc(3.8, -5, 1.7, 0, Math.PI * 2);
            c.fill();
            c.fillStyle = '#ffffff';
            c.beginPath();
            c.arc(-3.6, -5.6, 0.7, 0, Math.PI * 2);
            c.arc(3.4, -5.6, 0.7, 0, Math.PI * 2);
            c.fill();

            c.fillStyle = '#ff85c0';
            c.beginPath();
            c.arc(0.4, -3.2, 1.2, 0, Math.PI * 2);
            c.fill();

            // Estrellita en la frente del gatito guardián
            drawStarShape(c, 0.3, -9.5, 4, 3.2, 1.4, '#ffe58f');

            c.restore();
        }

        // 🐙👑 DIBUJA AL BOSS FINAL FIEL A LA IMAGEN `marciano boss.jpeg`:
        // - Rey Pulpo-Marciano Ciclópeo verde con manchas orgánicas
        // - Un gran ojo central amarillo/ámbar con ceja fruncida y sonrisa con colmillos
        // - Tentáculos verdes rizados con ventosas
        // - Capa galáctica oscura decorada con estrellas y planetas
        // - Casco cibernético plateado + Corona real dorada con estrellas de colores,
        //   engranajes mecánicos y 4 cohetes espaciales acoplados
        // - Barra de vida grande en la parte superior del Boss


        function loseCat(reason) {
            if (!catCompanion.active) return;
            addParticles(catCompanion.x, catCompanion.y, 16, 'heart', '#ff85c0');
            addFloatingText(catCompanion.x, catCompanion.y - 18, '😿 ¡Perdiste al gatito!', '#ffc2e2');
            if (reason) showToast(`😿 ${reason} Perdiste a tu gatito protector`, 3400);
            lily.hasCatCompanion = false;
            catCompanion.active = false;
            catCompanion.projectiles = [];
        }



export {
    drawCatCompanionSprite,
    loseCat
};
