/**
 * level-1-3.js - Nivel 1-3: Día Nevado
 */
export function loadLevel1_3(ctx) {
    const {
        addGround, addRooftop, addLadder, addPastelPlatform, addFallingCloud,
        addBlock, addPipe, addStarArc, addEnemy, addNightDrop, createGoalSpaceship,
        platforms, blocks, thrusterPlatforms, starCandies, powerUps,
        enemies, enemyProjectiles, bubbles, movingPlatforms, fallingClouds,
        nightDrops, bounceClouds, ladders, groundY
    } = ctx;

    let spaceship = null;
    let boss = null;
    let levelWidth = 6200;

                // =========================================================================
                // NIVEL 1-3: DÍA RADIANTE DE CRISTAL POLAR (8600 px | 115s | ¡GATITO PROTECTOR!)
                // Clima: Día luminoso con ventisca de nieve + Cajita Especial del Gatito Guardián 🐱
                // =========================================================================
                levelWidth = 8600;
                addGround(0, 680);
                addGround(1220, 560);
                addGround(2340, 540);
                addGround(3520, 580);
                addGround(4780, 540);
                addGround(5980, 580);
                addGround(7320, 1280);

                // 🐱 Cajita Especial de Rescate del Gatito Compañero Protector al inicio del Nivel 3
                addBlock(210, 340, 'mystery', 'cat');    // 🐱 ¡Gatito Guardián Compañero!
                addBlock(262, 340, 'mystery', 'rocket'); // 🚀 Cohete Propulsor
                addBlock(314, 340, 'mystery', 'bubble');
                addBlock(380, 340, 'mystery', 'punch');   // 👊 Poder del Puñito
                addEnemy(460, groundY - 42, 'cushion', 320, 630, 1.85);

                // Abismo 1: Nubes que caen + Gotita nocturna
                addFallingCloud(740, 385, 85);
                addNightDrop(865, 160, 430, 3.3);
                movingPlatforms.push({
                    x: 910, y: 330, w: 92, h: 24,
                    minX: 895, maxX: 1055, vx: 2.35,
                    minY: 330, maxY: 330, vy: 0
                });
                addFallingCloud(1100, 280, 85);
                addStarArc(760, 260, 5, 55, 30);

                // Isla 2
                addEnemy(1350, groundY - 42, 'cloud', 1240, 1520, 1.9);
                addEnemy(1620, groundY - 42, 'cushion', 1460, 1740, 1.95);
                addPipe(1480, 100);

                // Abismo 2: Doble elevador vertical y brinco elástico
                movingPlatforms.push({
                    x: 1840, y: 360, w: 88, h: 24,
                    minX: 1840, maxX: 1840, vx: 0,
                    minY: 210, maxY: 415, vy: 2.45
                });
                addNightDrop(1975, 150, 430, 3.5);
                bounceClouds.push({ x: 2020, y: 405, w: 82, h: 32, bounceAnim: 0 });
                addFallingCloud(2180, 265, 85);

                // Isla 3
                addBlock(2460, 325, 'mystery', 'rocket'); // 🚀 Cohete Propulsor
                addBlock(2508, 325, 'mystery', 'bell');
                addEnemy(2560, groundY - 42, 'cloud', 2370, 2680, 1.95);
                addEnemy(2740, groundY - 42, 'cushion', 2560, 2850, 2.0);

                // Abismo 3: Escalera de nubes efímeras sobre el vacío estelar
                addFallingCloud(2940, 390, 82);
                addNightDrop(3060, 160, 430, 3.4);
                addFallingCloud(3100, 330, 82);
                addFallingCloud(3250, 270, 82);
                addNightDrop(3370, 160, 430, 3.6);
                addFallingCloud(3400, 340, 82);
                addStarArc(2960, 230, 6, 65, 35);

                // Isla 4
                addPipe(3590, 95);
                addEnemy(3780, groundY - 42, 'cushion', 3670, 3950, 2.0);
                addEnemy(3980, groundY - 42, 'cloud', 3800, 4070, 2.05);
                addBlock(3840, 310, 'mystery', 'rocket'); // 🚀 Cohete tras el checkpoint
                addBlock(3888, 310, 'mystery', 'bubble');
                addBlock(3990, 310, 'mystery', 'punch');   // 👊 Poder del Puñito

                // Abismo 4: Plataformas cruzadas rápidas
                movingPlatforms.push({
                    x: 4160, y: 375, w: 88, h: 24,
                    minX: 4140, maxX: 4310, vx: 2.5,
                    minY: 375, maxY: 375, vy: 0
                });
                addNightDrop(4355, 150, 435, 3.6);
                movingPlatforms.push({
                    x: 4400, y: 290, w: 88, h: 24,
                    minX: 4400, maxX: 4400, vx: 0,
                    minY: 195, maxY: 395, vy: 2.5
                });
                addFallingCloud(4565, 255, 84);
                addStarArc(4180, 240, 6, 62, 32);

                // Isla 5
                addBlock(4900, 330, 'mystery', 'rocket'); // 🚀 Cohete
                addEnemy(5000, groundY - 42, 'cloud', 4810, 5150, 2.1);
                addEnemy(5180, groundY - 42, 'cushion', 4980, 5290, 2.1);

                // Abismo 5: Trampolines de nube y gotitas nocturnas
                bounceClouds.push({ x: 5390, y: 410, w: 82, h: 32, bounceAnim: 0 });
                addNightDrop(5520, 150, 430, 3.7);
                addFallingCloud(5575, 285, 82);
                bounceClouds.push({ x: 5720, y: 395, w: 82, h: 32, bounceAnim: 0 });
                addNightDrop(5855, 150, 430, 3.7);

                // Isla 6
                addEnemy(6140, groundY - 42, 'cushion', 6010, 6320, 2.15);
                addEnemy(6390, groundY - 42, 'cloud', 6200, 6530, 2.15);
                addBlock(6250, 320, 'mystery', 'rocket'); // 🚀 Cohete para el puente final

                // Abismo 6: El Gran Puente Lunar Final
                addFallingCloud(6640, 380, 82);
                movingPlatforms.push({
                    x: 6790, y: 330, w: 86, h: 24,
                    minX: 6770, maxX: 6950, vx: 2.6,
                    minY: 330, maxY: 330, vy: 0
                });
                addNightDrop(6995, 150, 430, 3.8);
                addFallingCloud(7045, 285, 82);
                addFallingCloud(7185, 240, 82);
                addStarArc(6660, 220, 6, 70, 30);

                // Isla Final de la Nave Estelar 1-3
                addEnemy(7520, groundY - 42, 'cloud', 7360, 7740, 2.1);
                addEnemy(7820, groundY - 42, 'cushion', 7650, 8020, 2.15);
                addPastelPlatform(7780, 370, 100);
                addPastelPlatform(7920, 300, 100);
                addPastelPlatform(8060, 230, 100);
                addStarArc(7800, 320, 3, 35, 12);
                addStarArc(7940, 250, 3, 35, 12);
                addStarArc(8080, 180, 3, 35, 12);

                spaceship = createGoalSpaceship(8240);



    if (spaceship) ctx.spaceship = spaceship;
    if (boss !== null) ctx.boss = boss;
    ctx.levelWidth = levelWidth;
    return { spaceship, boss, levelWidth };
}

export default loadLevel1_3;
