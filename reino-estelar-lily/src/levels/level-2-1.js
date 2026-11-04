/**
 * level-2-1.js - Nivel 2-1: Ruinas Tierra
 */
export function loadLevel2_1(ctx) {
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
                // MUNDO 2-1: RUINAS DE LA TIERRA SILENCIOSA (7800 px | 145s | TIERRA DEVASTADA)
                // Lily aterriza en su planeta natal pero lo encuentra destruido.
                // Al fondo se ven edificios derruidos y árboles sin hojas.
                // Nuevos enemigos: Hombres con máscaras aterradoras que atacan a Lily.
                // Nuevos obstáculos: Techos de casas destruidas, escaleras de emergencia y abismos profundos.
                // Al cruzar el mundo y abordar la nave, Lily viaja hacia el Mundo 2-2.
                // =========================================================================
                levelWidth = 7800;

                // Segmento 1: Aterrizaje en la carretera agrietada (0 - 780)
                addGround(0, 780);
                addBlock(240, 340, 'mystery', 'bell');      // 🔔 Triple Salto para escalar escombros
                addBlock(285, 340, 'mystery', 'rocket');    // 🚀 Cohete Propulsor
                addBlock(330, 340, 'mystery', 'cat');       // 🐱 Gatito Protector
                addBlock(395, 340, 'mystery', 'punch');     // 👊 Poder del Puñito
                addStarArc(220, 260, 4, 45, 20);

                // Abismo 1 (780 - 1100): Primer hueco profundo con techo de casa derruida y escalera
                addRooftop(860, 350, 160, 26);
                addLadder(990, 350, groundY);
                addStarArc(880, 280, 3, 35, 15);

                // Segmento 2: Suburbios en ruinas y primeros hombres enmascarados (1100 - 2020)
                addGround(1100, 920);
                // Primera casa derruida con escaleras sucesivas a los techos
                addRooftop(1260, 340, 150, 26);
                addLadder(1270, 340, groundY);
                addRooftop(1460, 265, 160, 26);
                addLadder(1470, 265, 340);
                addBlock(1330, 275, 'mystery', 'bell');
                addBlock(1525, 200, 'mystery', 'punch');
                addStarArc(1280, 200, 5, 45, 22);

                // Patrulla de hombre enmascarado en la calle destruida
                addEnemy(1680, groundY - 42, 'masked_man', 1540, 1960, 1.35);
                addBlock(1750, 340, 'mystery', 'rocket');

                // Abismo 2 (2020 - 2440): Gran fisura terrestre con escombros inestables
                addFallingCloud(2120, 360, 92);
                addNightDrop(2210, 160, 430, 3.2);
                addRooftop(2260, 305, 130, 26);
                addStarArc(2070, 240, 5, 55, 30);

                // Segmento 3: Avenida de la Desolación (2440 - 3540)
                addGround(2440, 1100);
                addBlock(2550, 340, 'mystery', 'bubble');
                addBlock(2600, 340, 'mystery', 'punch');
                addEnemy(2720, groundY - 42, 'masked_man', 2560, 2890, 1.45);
                addEnemy(3020, groundY - 42, 'masked_man', 2880, 3200, 1.5);
                addBlock(2850, 340, 'mystery', 'rocket');

                // Edificio derrumbado de dos pisos con escaleras metálicas
                addRooftop(3160, 335, 175, 26);
                addLadder(3170, 335, groundY);
                addRooftop(3380, 255, 150, 26);
                addLadder(3390, 255, 335);
                addStarArc(3190, 270, 4, 45, 20);

                // Abismo 3: La Gran Falla Tectónica (3540 - 3980)
                movingPlatforms.push({
                    x: 3620, y: 350, w: 92, h: 24,
                    minX: 3590, maxX: 3770, vx: 2.1,
                    minY: 350, maxY: 350, vy: 0
                });
                addNightDrop(3730, 150, 430, 3.4);
                addFallingCloud(3830, 295, 88);
                addStarArc(3640, 230, 5, 50, 25);

                // Segmento 4: Plaza Central y 🚩 Checkpoint (3980 - 5240)
                addGround(3980, 1260);
                addBlock(4120, 340, 'mystery', 'cat');
                addBlock(4170, 340, 'mystery', 'bubble');
                addBlock(4220, 340, 'mystery', 'bell');
                addBlock(4270, 340, 'mystery', 'rocket');
                addEnemy(4380, groundY - 42, 'masked_man', 4220, 4560, 1.55);
                addEnemy(4660, groundY - 42, 'masked_man', 4500, 4830, 1.6);

                // Gran complejo de techos residenciales destruidos
                addRooftop(4730, 345, 180, 26);
                addLadder(4740, 345, groundY);
                addRooftop(4930, 265, 160, 26);
                addLadder(4940, 265, 345);
                addRooftop(5110, 195, 140, 26);
                addLadder(5120, 195, 265);
                addStarArc(4750, 280, 4, 45, 20);
                addStarArc(4950, 200, 4, 45, 20);
                addBlock(5170, 130, 'mystery', 'star');

                // Abismo 4 (5240 - 5720): Hundimiento urbano con trampolines de escombros
                bounceClouds.push({ x: 5320, y: 405, w: 85, h: 32, bounceAnim: 0 });
                addNightDrop(5410, 150, 430, 3.6);
                addFallingCloud(5465, 305, 86);
                bounceClouds.push({ x: 5585, y: 395, w: 85, h: 32, bounceAnim: 0 });
                addNightDrop(5650, 150, 430, 3.6);

                // Segmento 5: Afueras Industriales (5720 - 6670)
                addGround(5720, 950);
                addEnemy(5890, groundY - 42, 'masked_man', 5760, 6120, 1.65);
                addEnemy(6190, groundY - 42, 'masked_man', 6020, 6380, 1.7);
                addBlock(5980, 340, 'mystery', 'rocket');
                addBlock(6030, 340, 'mystery', 'punch');
                addPipe(6310, 92);
                addStarArc(5800, 270, 5, 48, 24);

                // Abismo 5: El Puente Colapsado (6670 - 7100)
                addRooftop(6740, 350, 140, 26);
                addLadder(6750, 350, groundY);
                movingPlatforms.push({
                    x: 6920, y: 290, w: 92, h: 24,
                    minX: 6890, maxX: 7060, vx: 2.3,
                    minY: 290, maxY: 290, vy: 0
                });
                addStarArc(6760, 270, 5, 50, 25);

                // Segmento 6: Pista de Lanzamiento hacia el Mundo 2-2 (7100 - 7800)
                addGround(7100, 900);
                addEnemy(7260, groundY - 42, 'masked_man', 7140, 7430, 1.55);
                addRooftop(7380, 360, 130, 26);
                addRooftop(7540, 290, 130, 26);
                addStarArc(7400, 310, 3, 40, 15);
                addStarArc(7560, 240, 3, 40, 15);

                // 🛸 Nave Estelar de Escape para viajar hacia el Mundo 2-2
                spaceship = createGoalSpaceship(7650);



    if (spaceship) ctx.spaceship = spaceship;
    if (boss !== null) ctx.boss = boss;
    ctx.levelWidth = levelWidth;
    return { spaceship, boss, levelWidth };
}

export default loadLevel2_1;
