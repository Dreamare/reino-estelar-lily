/**
 * level-1-4.js - Nivel 1-4: Guarida Marciana
 */
export function loadLevel1_4(ctx) {
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
                // NIVEL 1-4: ABISMO TENEBROSO DEL REY MARCIANO (4400 px | 165s | BOSS FINAL)
                // Mundo oscuro, lúgubre y tenebroso con obstáculos peligrosos y la Gran Arena
                // final donde espera el Rey Kraken Marciano que se encoge al recibir daño.
                // =========================================================================
                levelWidth = 4400;
                addGround(0, 720);
                addGround(1180, 620);
                addGround(2460, 1940); // Gran Arena Tenebrosa del Boss + Plataforma de Escape

                // Inicio del Mundo 1-4: Cajitas con Gatito (si no lo tenía), Burbujas y Cascabel
                addBlock(210, 340, 'mystery', 'cat');
                addBlock(265, 340, 'mystery', 'bubble');
                addBlock(320, 340, 'mystery', 'bell');
                addBlock(380, 340, 'mystery', 'punch');   // 👊 Poder del Puñito
                addEnemy(500, groundY - 42, 'cushion', 360, 670, 2.0);

                // Tramo tenebroso 1: Abismo sombrío con meteoritos carmesí y nubes efímeras
                addFallingCloud(780, 380, 86);
                addNightDrop(905, 150, 430, 3.6);
                movingPlatforms.push({
                    x: 950, y: 325, w: 94, h: 24,
                    minX: 930, maxX: 1110, vx: 2.4,
                    minY: 325, maxY: 325, vy: 0
                });
                addStarArc(800, 250, 5, 50, 28);

                // Isla Oscura Intermedia: Patrulla de élite y cajita de Cohete Propulsor
                addPipe(1260, 96);
                addEnemy(1420, groundY - 42, 'cloud', 1310, 1580, 2.05);
                addEnemy(1640, groundY - 42, 'cushion', 1480, 1750, 2.1);
                addBlock(1480, 320, 'mystery', 'rocket');
                addBlock(1532, 320, 'mystery', 'bubble');

                // Tramo tenebroso 2: Puente sobre el vacío hacia el Checkpoint y la Arena del Boss
                bounceClouds.push({ x: 1880, y: 405, w: 85, h: 32, bounceAnim: 0 });
                addNightDrop(2010, 150, 430, 3.8);
                addFallingCloud(2065, 285, 86);
                movingPlatforms.push({
                    x: 2210, y: 340, w: 92, h: 24,
                    minX: 2190, maxX: 2370, vx: 2.4,
                    minY: 340, maxY: 340, vy: 0
                });
                addNightDrop(2410, 150, 430, 3.7);

                // 🐙👑 ARENA FINAL DEL REY KRAKEN MARCIANO (X: 2650 a 3850)
                // Plataformas de apoyo en la arena para esquivar y saltar sobre el Boss
                addPastelPlatform(2820, 345, 115);
                addPastelPlatform(3180, 275, 130);
                addPastelPlatform(3540, 345, 115);
                bounceClouds.push({ x: 2690, y: 405, w: 82, h: 32, bounceAnim: 0 });
                bounceClouds.push({ x: 3720, y: 405, w: 82, h: 32, bounceAnim: 0 });

                // Cajitas de suministros en la arena del Boss
                addBlock(2855, 235, 'mystery', 'bubble');
                addBlock(3225, 165, 'mystery', 'bell');
                addBlock(3000, 165, 'mystery', 'punch');   // 👊 Poder del Puñito
                addBlock(3575, 235, 'mystery', 'rocket');

                boss = {
                    x: 3320,
                    y: 230,
                    baseY: 230,
                    vx: -2.3,
                    vy: 0,
                    minX: 2740,
                    maxX: 3680,
                    maxHp: 18,
                    hp: 18,
                    scale: 1.80,       // Empieza gigante y se va encogiendo con cada golpe hasta 0.42
                    active: false,     // Se activa cuando Lily cruza X > 2580
                    defeated: false,
                    hurtTimer: 0,
                    attackTimer: 75,
                    swoopPhase: 0,
                    tentaclePhase: 0
                };

                // La Nave Estelar de escape espera al fondo de la arena (bloqueada hasta derrotar al Boss)
                spaceship = createGoalSpaceship(4040);



    if (spaceship) ctx.spaceship = spaceship;
    if (boss !== null) ctx.boss = boss;
    ctx.levelWidth = levelWidth;
    return { spaceship, boss, levelWidth };
}

export default loadLevel1_4;
