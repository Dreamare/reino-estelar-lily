/**
 * level-1-1.js - Nivel 1-1: Noche Estelar
 */
export function loadLevel1_1(ctx) {
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
                // NIVEL 1-1: NOCHE ESTELAR DE ALGODÓN (6200 px | 130 SEGUNDOS)
                // =========================================================================
                levelWidth = 6200;
                addGround(0, 1220);
                addGround(1340, 1080);
                addGround(2540, 1180);
                addGround(3850, 1020);
                addGround(5000, 1200);

                // Zona 1: Bienvenida dulce y primeros bloques (¡incluye Cohete Propulsor 🚀!)
                addStarArc(200, 410, 4);
                addBlock(310, 340, 'mystery', 'star');
                addBlock(352, 340, 'cookie', 'star');
                addBlock(394, 340, 'mystery', 'bell');   // Cascabel Mágico
                addBlock(436, 340, 'cookie', 'star');
                addBlock(478, 340, 'mystery', 'rocket'); // 🚀 ¡Cohete Propulsor de 5s!
                addBlock(570, 340, 'mystery', 'punch');   // 👊 Poder del Puñito
                addBlock(394, 220, 'mystery', 'bubble');

                addPipe(630, 82);
                addEnemy(790, groundY - 42, 'cloud', 710, 930, 1.0);
                addPipe(970, 102);
                addStarArc(980, 300, 4, 35, 18);

                addPastelPlatform(1180, 375, 130);
                addStarArc(1195, 325, 3, 34, 14);

                // Zona 2: Galletas flotantes y marcianos
                addEnemy(1470, groundY - 42, 'cushion', 1370, 1650, 1.0);
                addBlock(1520, 340, 'cookie', 'star');
                addBlock(1562, 340, 'mystery', 'bubble');
                addBlock(1604, 340, 'mystery', 'rocket'); // 🚀 Cohete para cruzar volando

                addPastelPlatform(1720, 265, 160);
                addStarArc(1740, 215, 4, 36, 16);

                addPipe(1960, 92);
                addEnemy(2120, groundY - 42, 'cloud', 2040, 2320, 1.05);
                bounceClouds.push({ x: 2390, y: 405, w: 95, h: 32, bounceAnim: 0 });
                addStarArc(2390, 275, 4, 36, 32);

                // Zona 3: Valle de las plataformas de fuego
                addPastelPlatform(2640, 355, 130);
                addPastelPlatform(2820, 280, 140);
                addBlock(2865, 170, 'mystery', 'rocket'); // 🚀 Cohete en altura
                addEnemy(2880, groundY - 42, 'cloud', 2600, 3080, 1.05);
                addPipe(3150, 98);
                addEnemy(3350, groundY - 42, 'cushion', 3240, 3580, 1.1);
                addBlock(3400, 330, 'mystery', 'bell');
                addBlock(3442, 330, 'mystery', 'rocket'); // 🚀 Cohete después del checkpoint
                addBlock(3560, 330, 'mystery', 'punch');   // 👊 Poder del Puñito

                movingPlatforms.push({
                    x: 3720, y: 375, w: 120, h: 24,
                    minX: 3690, maxX: 3820, vx: 1.2,
                    minY: 375, maxY: 375, vy: 0
                });

                // Zona 4: Plataformas propulsoras y patrulla marciana
                addPipe(4020, 82);
                addEnemy(4180, groundY - 42, 'cloud', 4100, 4340, 1.1);
                addPipe(4370, 108);
                addPastelPlatform(4480, 290, 160);
                addStarArc(4500, 235, 4, 36, 18);
                addEnemy(4650, groundY - 42, 'cushion', 4460, 4810, 1.1);
                bounceClouds.push({ x: 4880, y: 405, w: 95, h: 32, bounceAnim: 0 });

                // Zona 5: Escalera estelar hacia la Nave Espacial 1-1
                addPastelPlatform(5150, 380, 120);
                addPastelPlatform(5310, 315, 120);
                addPastelPlatform(5470, 250, 120);
                addStarArc(5170, 330, 3, 35, 12);
                addStarArc(5330, 265, 3, 35, 12);
                addStarArc(5490, 200, 3, 35, 12);
                addEnemy(5400, groundY - 42, 'cloud', 5150, 5650, 1.1);

                spaceship = createGoalSpaceship(5810);



    if (spaceship) ctx.spaceship = spaceship;
    if (boss !== null) ctx.boss = boss;
    ctx.levelWidth = levelWidth;
    return { spaceship, boss, levelWidth };
}

export default loadLevel1_1;
