/**
 * level-2-2.js - Nivel 2-2: Atardecer Carmesí
 */
export function loadLevel2_2(ctx) {
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
                // MUNDO 2-2: ATARDECER CARMESÍ DE LA TIERRA CAÍDA (8200 px | 140s)
                // Máxima dificultad: cielo sombrío carmesí, escaleras que caen y aplastan,
                // hombres enmascarados poseídos tipo zombie que persiguen a Lily sin tregua,
                // abismos profundos, vigas tambaleantes y escasez extrema de cofres (solo 3).
                // =========================================================================
                levelWidth = 8200;

                // Tramo 1: Despertar en el Atardecer Carmesí (0 - 1050)
                addGround(0, 1050);
                addBlock(420, groundY - 38, 'mystery', 'cat'); // 📦 Cofre 1/3: Gatito Protector Mishi
                addEnemy(740, groundY - 42, 'zombie_masked', 560, 950, 1.35); // 🧟 Primer Hombre Zombie
                addRooftop(860, 320, 160, 26);
                addLadder(920, 320, groundY, 'falling'); // ⚠️ Escalera inestable que colapsa
                addStarArc(480, 370, 4, 40, 15);
                addStarArc(880, 260, 4, 35, 18);

                // Tramo 2: Abismo 1 - Salto sobre vigas móviles y escombros (1050 - 2050)
                movingPlatforms.push({
                    x: 1120, y: 350, w: 90, h: 24,
                    minX: 1080, maxX: 1280, vx: 2.6,
                    minY: 350, maxY: 350, vy: 0
                });
                addGround(1320, 730);
                addRooftop(1360, 340, 140, 26);
                addLadder(1370, 340, groundY, 'fixed');
                addEnemy(1600, groundY - 42, 'masked_man', 1420, 1780, 1.6);
                addEnemy(1780, groundY - 42, 'zombie_masked', 1650, 1980, 1.45); // 🧟 Zombie pursuer
                addFallingCloud(1920, 370, 84);
                addStarArc(1140, 280, 4, 40, 20);
                addStarArc(1400, 270, 3, 35, 12);

                // Tramo 3: El Callejón de las Escaleras Desplomadas (2050 - 3050)
                movingPlatforms.push({
                    x: 2120, y: 340, w: 86, h: 24,
                    minX: 2080, maxX: 2260, vx: 2.7,
                    minY: 340, maxY: 340, vy: 0
                });
                addGround(2300, 750);
                addRooftop(2340, 260, 130, 26);
                addLadder(2360, 260, groundY, 'falling'); // ⚠️ Escalera que colapsa
                addEnemy(2680, groundY - 42, 'zombie_masked', 2460, 2960, 1.5); // 🧟 Zombie acechando
                addRooftop(2820, 330, 140, 26);
                addEnemy(2870, 330 - 42, 'masked_man', 2830, 2940, 1.4);
                addStarArc(2400, 200, 4, 38, 18);
                addStarArc(2740, 390, 4, 36, 15);

                // Tramo 4: Barranco de Ruinas y Plataformas Móviles Rápidas (3050 - 4180)
                addFallingCloud(3100, 380, 80);
                movingPlatforms.push({
                    x: 3240, y: 320, w: 84, h: 24,
                    minX: 3200, maxX: 3420, vx: 2.8,
                    minY: 320, maxY: 320, vy: 0
                });
                addGround(3460, 680);
                addEnemy(3580, groundY - 42, 'zombie_masked', 3480, 3860, 1.55); // 🧟 Zombie rápido
                addRooftop(3760, 280, 150, 26);
                addLadder(3800, 280, groundY, 'falling'); // ⚠️ Escalera que colapsa
                movingPlatforms.push({
                    x: 4000, y: 360, w: 88, h: 24,
                    minX: 4000, maxX: 4000, vx: 0,
                    minY: 250, maxY: 420, vy: 2.6
                });
                addStarArc(3300, 250, 5, 40, 25);
                addStarArc(3820, 220, 4, 35, 15);

                // Tramo 5: Búnker del Checkpoint (X: 4200) (4180 - 5100)
                addGround(4180, 920);
                addRooftop(4220, 310, 160, 26);
                addBlock(4240, 310 - 38, 'mystery', 'bell'); // 📦 Cofre 2/3: Cascabel de Triple Salto
                addEnemy(4520, groundY - 42, 'zombie_masked', 4300, 4800, 1.6); // 🧟 Zombie agresivo
                addEnemy(4800, groundY - 42, 'masked_man', 4600, 5020, 1.65);
                addRooftop(4700, 320, 150, 26);
                addLadder(4720, 320, groundY, 'fixed');
                addStarArc(4300, 240, 5, 36, 18);
                addStarArc(4850, 380, 4, 36, 14);

                // Tramo 6: Salto sobre Vigas Oxidadas y Trampas de Escaleras (5100 - 6200)
                movingPlatforms.push({
                    x: 5160, y: 340, w: 86, h: 24,
                    minX: 5120, maxX: 5320, vx: 2.9,
                    minY: 340, maxY: 340, vy: 0
                });
                addGround(5360, 800);
                addRooftop(5380, 250, 140, 26);
                addLadder(5400, 250, groundY, 'falling'); // ⚠️ Escalera que cae y aplasta
                addEnemy(5650, groundY - 42, 'zombie_masked', 5420, 5950, 1.65); // 🧟 Zombie implacable
                addRooftop(5840, 300, 140, 26);
                addEnemy(5880, 300 - 42, 'masked_man', 5850, 5960, 1.5);
                addFallingCloud(6060, 360, 80);
                addStarArc(5220, 270, 4, 38, 20);
                addStarArc(5700, 390, 4, 36, 15);

                // Tramo 7: Techos Colapsantes y Último Cofre Sorpresa (6200 - 7200)
                movingPlatforms.push({
                    x: 6220, y: 310, w: 84, h: 24,
                    minX: 6180, maxX: 6380, vx: 3.0,
                    minY: 310, maxY: 310, vy: 0
                });
                addGround(6420, 780);
                addRooftop(6440, 250, 150, 26);
                addBlock(6460, 250 - 38, 'mystery', 'rocket'); // 📦 Cofre 3/3: Cohete Propulsor 🚀
                addEnemy(6680, groundY - 42, 'zombie_masked', 6480, 7050, 1.7); // 🧟 Zombie veloz
                addRooftop(6820, 260, 140, 26);
                addLadder(6840, 260, groundY, 'falling'); // ⚠️ Escalera trampa que colapsa
                addStarArc(6500, 190, 4, 36, 16);
                addStarArc(6880, 200, 4, 36, 16);

                // Tramo 8: La Pista de Escape Final en el Atardecer Sombrío (7200 - 8200)
                addFallingCloud(7080, 360, 80);
                addFallingCloud(7220, 300, 80);
                addGround(7360, 840);
                addEnemy(7480, groundY - 42, 'zombie_masked', 7380, 7850, 1.75); // 🧟 Último Zombie acechante
                addRooftop(7620, 330, 130, 26);
                addRooftop(7780, 260, 130, 26);
                addStarArc(7400, 380, 5, 38, 16);
                addStarArc(7640, 270, 3, 35, 14);
                addStarArc(7800, 200, 3, 35, 14);

                // 🛸 Nave Estelar de Escape hacia la Salvación
                spaceship = createGoalSpaceship(7950);


    if (spaceship) ctx.spaceship = spaceship;
    if (boss !== null) ctx.boss = boss;
    ctx.levelWidth = levelWidth;
    return { spaceship, boss, levelWidth };
}

export default loadLevel2_2;
