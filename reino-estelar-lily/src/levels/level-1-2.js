/**
 * level-1-2.js - Nivel 1-2: Atardecer Dulce
 */
export function loadLevel1_2(ctx) {
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
                // NIVEL 1-2: ATARDECER DE FUEGO Y CARAMELO (7400 px | 115s | DIFÍCIL)
                // Clima: Lluvia cósmica + Marcianos agresivos que disparan fuego y plasma
                // =========================================================================
                levelWidth = 7400;
                addGround(0, 820);
                addGround(1180, 760);
                addGround(2360, 680);
                addGround(3480, 780);
                addGround(4720, 720);
                addGround(5920, 1480);

                // Inicio Nivel 1-2
                addBlock(240, 340, 'mystery', 'bell');
                addBlock(282, 340, 'mystery', 'rocket'); // 🚀 Cohete Propulsor inicial
                addBlock(324, 340, 'mystery', 'bubble');
                addBlock(390, 340, 'mystery', 'punch');   // 👊 Poder del Puñito
                addEnemy(520, groundY - 42, 'cushion', 390, 760, 1.45);
                addPipe(690, 98);

                // Primer abismo con plataforma móvil y nube efímera
                movingPlatforms.push({
                    x: 860, y: 380, w: 105, h: 24,
                    minX: 840, maxX: 980, vx: 1.85,
                    minY: 380, maxY: 380, vy: 0
                });
                addFallingCloud(1035, 330, 95);
                addStarArc(880, 300, 5, 42, 24);

                // Segunda isla con marcianos rápidos y elevador vertical
                addEnemy(1320, groundY - 42, 'cloud', 1210, 1520, 1.55);
                addEnemy(1680, groundY - 42, 'cushion', 1520, 1880, 1.55);
                addBlock(1440, 330, 'cookie', 'star');
                addBlock(1482, 330, 'mystery', 'rocket'); // 🚀 Cohete para volar sobre el abismo
                addBlock(1524, 330, 'cookie', 'star');
                addNightDrop(1600, 180, 420, 2.5);

                // Abismo 2: Plataformas móviles verticales y horizontales combinadas
                movingPlatforms.push({
                    x: 1990, y: 340, w: 100, h: 24,
                    minX: 1990, maxX: 1990, vx: 0,
                    minY: 230, maxY: 410, vy: 1.9
                });
                addFallingCloud(2135, 270, 90);
                addPastelPlatform(2250, 340, 85);
                addStarArc(2010, 210, 5, 45, 22);

                // Tercera isla: Plataforma propulsora alta y patrulla marciana doble
                addPipe(2430, 105);
                addEnemy(2620, groundY - 42, 'cloud', 2510, 2780, 1.65);
                addEnemy(2820, groundY - 42, 'cushion', 2680, 2980, 1.6);
                addBlock(2690, 310, 'mystery', 'rocket'); // 🚀 Cohete

                // Abismo 3: Nubes saltarinas y gotitas nocturnas
                bounceClouds.push({ x: 3090, y: 410, w: 85, h: 32, bounceAnim: 0 });
                addNightDrop(3210, 170, 420, 2.8);
                addFallingCloud(3260, 290, 92);
                addStarArc(3120, 240, 5, 44, 35);

                // Cuarta isla: Desafío de precisión
                addEnemy(3620, groundY - 42, 'cushion', 3510, 3820, 1.65);
                addPipe(3860, 95);
                addEnemy(4060, groundY - 42, 'cloud', 3940, 4210, 1.7);
                addBlock(3960, 325, 'mystery', 'rocket'); // 🚀 Cohete tras el checkpoint
                addBlock(4002, 325, 'mystery', 'bubble');
                addBlock(4100, 325, 'mystery', 'punch');   // 👊 Poder del Puñito

                // Abismo 4: Puente largo de plataformas móviles con propulsor
                movingPlatforms.push({
                    x: 4310, y: 375, w: 98, h: 24,
                    minX: 4290, maxX: 4450, vx: 2.1,
                    minY: 375, maxY: 375, vy: 0
                });
                addNightDrop(4495, 180, 430, 2.9);
                movingPlatforms.push({
                    x: 4530, y: 310, w: 98, h: 24,
                    minX: 4530, maxX: 4530, vx: 0,
                    minY: 220, maxY: 390, vy: 2.0
                });

                // Quinta isla
                addEnemy(4880, groundY - 42, 'cloud', 4750, 5080, 1.7);
                addEnemy(5220, groundY - 42, 'cushion', 5040, 5380, 1.75);
                addBlock(5060, 330, 'mystery', 'bell');
                addBlock(5102, 330, 'mystery', 'rocket'); // 🚀 Cohete

                // Abismo 5: Secuencia de nubes efímeras
                addFallingCloud(5490, 380, 88);
                addFallingCloud(5635, 325, 88);
                addFallingCloud(5780, 270, 88);
                addStarArc(5510, 240, 6, 48, 30);

                // Tramo final hacia la Nave Estelar 1-2
                addEnemy(6120, groundY - 42, 'cloud', 5960, 6340, 1.7);
                addEnemy(6480, groundY - 42, 'cushion', 6300, 6680, 1.75);
                addPastelPlatform(6550, 365, 105);
                addPastelPlatform(6700, 295, 105);
                addPastelPlatform(6850, 225, 105);
                addStarArc(6570, 315, 3, 35, 10);
                addStarArc(6720, 245, 3, 35, 10);

                spaceship = createGoalSpaceship(7050);



    if (spaceship) ctx.spaceship = spaceship;
    if (boss !== null) ctx.boss = boss;
    ctx.levelWidth = levelWidth;
    return { spaceship, boss, levelWidth };
}

export default loadLevel1_2;
