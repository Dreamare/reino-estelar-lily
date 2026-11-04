/**
 * AssetLoader.js - Carga imágenes, procesa chroma key y entrega texturas
 */

        const AssetManager = {
            sources: {
                bg: './asets/bg_cosmic_sunset.png',
                bgFallback: './asets/bg_cosmic_sunset.jpg',
                tileset: './asets/tileset_platforms.png',
                lily: './asets/sprites_lily.png',
                props: './asets/sprites_props_enemies.png',
                lilyAction: './asets/sprites_lily_animado.jpg',
                lilyActionFallback: './asets/sprites_lily_animado.png',
                lilyIdle: './asets/sprites_lily_reposo.jpg',
                lilyIdleFallback: './asets/sprites_lily_reposo.png',
                uiStart: './asets/ui_start_assets.jpg',
                uiStartFallback: './asets/ui_start_assets.png'
            },
            assets: {},
            ready: {},
            sheets: {
                action: { loaded: false, frames: [], refHeadWidth: 100, avgHeight: 200 },
                idle: { loaded: false, frames: [], refHeadWidth: 100, avgHeight: 200 }
            },

            // Coordenadas exactas de cada sprite en las hojas de ./asets/
            sprites: {
                // sprites_lily.png (1678x937): 4 poses horizontales mirando a la derecha
                lily: [
                    { x: 13,   y: 152, w: 355, h: 652 }, // Frame 1 (índice 0): Idle / quieta
                    { x: 415,  y: 152, w: 419, h: 650 }, // Frame 2 (índice 1): Corriendo paso 1
                    { x: 851,  y: 152, w: 409, h: 642 }, // Frame 3 (índice 2): Corriendo paso 2
                    { x: 1288, y: 152, w: 385, h: 596 }  // Frame 4 (índice 3): Saltando
                ],
                // tileset_platforms.png (1678x937)
                tileset: {
                    // Suelo de escamas rosadas con borde dorado luminoso (arriba a la izquierda)
                    groundFull: { x: 20,  y: 60, w: 881, h: 232 },
                    groundCapL: { x: 20,  y: 60, w: 147, h: 232 },
                    groundTile: { x: 167, y: 60, w: 621, h: 232 },
                    groundCapR: { x: 788, y: 60, w: 113, h: 232 },
                    // Bloques modulares de suelo (abajo a la izquierda)
                    groundMod1: { x: 21,  y: 345, w: 286, h: 214 },
                    groundMod2: { x: 324, y: 345, w: 295, h: 213 },
                    groundMod3: { x: 634, y: 346, w: 268, h: 212 },
                    // Islas flotantes de cristal rosa tallado (centro)
                    // topOffset indica dónde empieza la losa caminable plana dentro del recorte
                    crystalIslands: [
                        { x: 941, y: 62,  w: 372, h: 269, topOffset: 100, slabH: 169 },
                        { x: 952, y: 382, w: 337, h: 235, topOffset: 108, slabH: 127 }
                    ],
                    crystalSlabOnly: { x: 941, y: 160, w: 372, h: 171 },
                    // Plataformas metálicas moradas con propulsores de fuego (derecha)
                    thrusterFull: { x: 1343, y: 86,  w: 321, h: 237 },
                    thrusterBody: { x: 1343, y: 86,  w: 321, h: 106 },
                    thrusterFire: { x: 1343, y: 192, w: 321, h: 131 }
                },
                // sprites_props_enemies.png (1678x937)
                props: {
                    // Fila 1: Variantes de la nave espacial rosada con corazón y cúpula de cristal
                    ships: [
                        { x: 37,   y: 13, w: 252, h: 180 }, // 0: En plataforma de aterrizaje
                        { x: 313,  y: 13, w: 219, h: 187 }, // 1: Con patitas (derecha)
                        { x: 576,  y: 11, w: 225, h: 189 }, // 2: Con patitas (izquierda)
                        { x: 835,  y: 42, w: 259, h: 154 }, // 3: Frontal simétrica
                        { x: 1132, y: 14, w: 252, h: 187 }, // 4: Aterrizando / despegando
                        { x: 1427, y: 82, w: 217, h: 123 }  // 5: Casco abierto sin cúpula
                    ],
                    // Fila 2: Cofres del tesoro (cerrado -> entreabierto -> abierto brillando con estrellas)
                    chests: [
                        { x: 46,   y: 242, w: 162, h: 131 }, // 0: Cerrado clásico
                        { x: 235,  y: 232, w: 172, h: 146 }, // 1: Entreabierto clásico
                        { x: 432,  y: 226, w: 174, h: 151 }, // 2: Medio abierto
                        { x: 631,  y: 214, w: 177, h: 164 }, // 3: Abierto clásico
                        { x: 834,  y: 233, w: 168, h: 140 }, // 4: Cerrado especial / rosado
                        { x: 1025, y: 221, w: 177, h: 156 }, // 5: Entreabierto con destellos
                        { x: 1229, y: 200, w: 186, h: 177 }, // 6: Abierto brillando
                        { x: 1440, y: 204, w: 207, h: 176 }  // 7: Abierto rebosante de estrellas
                    ],
                    // Fila 3: Marcianito morado en platillo volador (enemigos tipo 'cloud')
                    saucers: [
                        { x: 39,   y: 396, w: 166, h: 140 },
                        { x: 241,  y: 398, w: 165, h: 165 },
                        { x: 442,  y: 398, w: 158, h: 163 },
                        { x: 640,  y: 391, w: 162, h: 175 },
                        { x: 842,  y: 393, w: 163, h: 169 },
                        { x: 1044, y: 404, w: 166, h: 159 },
                        { x: 1255, y: 400, w: 152, h: 161 },
                        { x: 1447, y: 399, w: 202, h: 148 }
                    ],
                    // Fila 4: Alienígena azul redondo con casco espacial y burbujas (enemigos tipo 'cushion')
                    blueAliens: [
                        { x: 44,   y: 572, w: 201, h: 160 },
                        { x: 245,  y: 578, w: 167, h: 150 },
                        { x: 433,  y: 577, w: 182, h: 151 },
                        { x: 641,  y: 582, w: 182, h: 156 },
                        { x: 844,  y: 575, w: 156, h: 159 },
                        { x: 1033, y: 580, w: 194, h: 154 },
                        { x: 1227, y: 578, w: 204, h: 159 },
                        { x: 1431, y: 579, w: 222, h: 143 }
                    ],
                    // Fila 5: Estrellitas doradas, dulces estelares y burbujas rosas con corazón
                    starsAndCandies: [
                        { x: 35,  y: 761, w: 129, h: 118 }, // 0: Estrella dorada
                        { x: 183, y: 772, w: 148, h: 100 }, // 1: Dulce estelar rosa
                        { x: 353, y: 763, w: 127, h: 119 }, // 2: Estrella dorada brillante
                        { x: 505, y: 759, w: 154, h: 135 }, // 3: Dulce estelar girando 1
                        { x: 676, y: 765, w: 149, h: 121 }  // 4: Dulce estelar girando 2
                    ],
                    heartBubbles: [
                        { x: 878,  y: 758, w: 135, h: 130 },
                        { x: 1045, y: 760, w: 133, h: 129 },
                        { x: 1209, y: 759, w: 132, h: 130 },
                        { x: 1361, y: 759, w: 136, h: 131 },
                        { x: 1518, y: 757, w: 131, h: 132 }
                    ]
                }
            },

            // Procesa una hoja de sprites en un <canvas> oculto eliminando el fondo blanco
            // (R > 240 && G > 240 && B > 240 -> alpha = 0) y aplicando feathering en los bordes
            processGridSheet(img, sheetKey) {
                const W = img.naturalWidth || img.width;
                const H = img.naturalHeight || img.height;
                const off = document.createElement('canvas');
                off.width = W;
                off.height = H;
                const octx = off.getContext('2d');
                octx.drawImage(img, 0, 0);

                let imgData;
                try {
                    imgData = octx.getImageData(0, 0, W, H);
                } catch (err) {
                    const b64 = (typeof window !== 'undefined' && window.LILY_SHEETS_B64) ? window.LILY_SHEETS_B64[sheetKey] : null;
                    if (b64 && img.src !== b64) {
                        const retryImg = new Image();
                        retryImg.onload = () => this.processGridSheet(retryImg, sheetKey);
                        retryImg.src = b64;
                        return;
                    }
                    console.warn('CORS restringió getImageData para ' + sheetKey, err);
                    return;
                }

                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const minC = Math.min(r, g, b);
                    const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
                    if (minC > 236 && maxDiff < 20) {
                        data[i + 3] = 0;
                    } else if (minC > 210 && maxDiff < 26) {
                        const factor = (236 - minC) / (236 - 210);
                        data[i + 3] = Math.min(data[i + 3], Math.floor(factor * 255));
                    }
                }
                octx.putImageData(imgData, 0, 0);

                const cols = 6;
                const rows = 2;
                const cellW = W / cols;
                const cellH = H / rows;
                const frames = [];
                let totalH = 0;

                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const idx = r * cols + c;
                        const sx = Math.floor(c * cellW);
                        const sy = Math.floor(r * cellH);
                        const sw = Math.floor(cellW);
                        const sh = Math.floor(cellH);

                        const cellCanvas = document.createElement('canvas');
                        cellCanvas.width = sw;
                        cellCanvas.height = sh;
                        const cellCtx = cellCanvas.getContext('2d');
                        cellCtx.drawImage(off, sx, sy, sw, sh, 0, 0, sw, sh);

                        const cellImgData = cellCtx.getImageData(0, 0, sw, sh);
                        const cd = cellImgData.data;

                        let minX = sw, maxX = 0, minY = sh, maxY = 0;
                        let found = false;

                        for (let y = 0; y < sh; y++) {
                            for (let x = 0; x < sw; x++) {
                                if (cd[(y * sw + x) * 4 + 3] > 35) {
                                    if (x < minX) minX = x;
                                    if (x > maxX) maxX = x;
                                    if (y < minY) minY = y;
                                    if (y > maxY) maxY = y;
                                    found = true;
                                }
                            }
                        }

                        if (!found) {
                            minX = Math.floor(sw * 0.2); maxX = Math.floor(sw * 0.8);
                            minY = Math.floor(sh * 0.1); maxY = Math.floor(sh * 0.9);
                        }

                        const pad = 3;
                        const fMinX = Math.max(0, minX - pad);
                        const fMaxX = Math.min(sw, maxX + pad);
                        const fMinY = Math.max(0, minY - pad);
                        const fMaxY = Math.min(sh, maxY + pad);
                        const fw = fMaxX - fMinX;
                        const fh = fMaxY - fMinY;

                        const finalCanvas = document.createElement('canvas');
                        finalCanvas.width = fw;
                        finalCanvas.height = fh;
                        const finalCtx = finalCanvas.getContext('2d');
                        finalCtx.drawImage(cellCanvas, fMinX, fMinY, fw, fh, 0, 0, fw, fh);

                        const fData = finalCtx.getImageData(0, 0, fw, fh).data;
                        const headYStart = Math.floor(fh * 0.08);
                        const headYEnd = Math.floor(fh * 0.42);
                        let headMinX = fw, headMaxX = 0;

                        for (let py = headYStart; py <= headYEnd; py++) {
                            for (let px = 0; px < fw; px++) {
                                if (fData[(py * fw + px) * 4 + 3] > 60) {
                                    if (px < headMinX) headMinX = px;
                                    if (px > headMaxX) headMaxX = px;
                                }
                            }
                        }

                        const headCenterX = (headMinX < headMaxX) ? (headMinX + headMaxX) / 2 : fw / 2;
                        const headWidth = (headMinX < headMaxX) ? (headMaxX - headMinX) : fw * 0.6;
                        totalH += fh;

                        frames.push({
                            index: idx,
                            canvas: finalCanvas,
                            cellW: fw,
                            cellH: fh,
                            minX: 0,
                            maxX: fw,
                            minY: 0,
                            maxY: fh,
                            pivotX: headCenterX,
                            pivotBottomY: fh,
                            charW: fw,
                            charH: fh,
                            headWidth
                        });
                    }
                }

                const avgHeight = totalH / frames.length;
                const refHeadWidth = frames.reduce((acc, f) => acc + f.headWidth, 0) / frames.length;
                this.sheets[sheetKey] = { loaded: true, frames, avgHeight, refHeadWidth };
                console.log(`[AssetLoader] Hoja ${sheetKey} procesada: ${frames.length} frames.`);
            },

            processChromaKey(img) {
                const w = img.naturalWidth || img.width;
                const h = img.naturalHeight || img.height;
                const offCanvas = document.createElement('canvas');
                offCanvas.width = w;
                offCanvas.height = h;
                const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
                offCtx.drawImage(img, 0, 0);

                try {
                    const imageData = offCtx.getImageData(0, 0, w, h);
                    const data = imageData.data;
                    const total = w * h;

                    // 1. Detectar máscara de fondo (píxeles ya transparentes o conectados al borde blanco)
                    const bgMask = new Uint8Array(total);
                    const queue = new Int32Array(total);
                    let qHead = 0, qTail = 0;

                    const isNearWhiteBg = (pIdx) => {
                        const i = pIdx * 4;
                        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                        return a < 40 || (r > 232 && g > 232 && b > 232);
                    };

                    // Semillas desde los 4 bordes y desde píxeles ya transparentes
                    for (let y = 0; y < h; y++) {
                        for (let x = 0; x < w; x++) {
                            const pIdx = y * w + x;
                            const a = data[pIdx * 4 + 3];
                            if (a < 40 || ((x === 0 || x === w - 1 || y === 0 || y === h - 1) && isNearWhiteBg(pIdx))) {
                                bgMask[pIdx] = 1;
                                queue[qTail++] = pIdx;
                            }
                        }
                    }

                    // Flood-fill del fondo blanco exterior (protege el blanco interior de ojos y tenis de Lily)
                    while (qHead < qTail) {
                        const curr = queue[qHead++];
                        const cx = curr % w;
                        const cy = (curr / w) | 0;
                        if (cx > 0 && !bgMask[curr - 1] && isNearWhiteBg(curr - 1)) { bgMask[curr - 1] = 1; queue[qTail++] = curr - 1; }
                        if (cx < w - 1 && !bgMask[curr + 1] && isNearWhiteBg(curr + 1)) { bgMask[curr + 1] = 1; queue[qTail++] = curr + 1; }
                        if (cy > 0 && !bgMask[curr - w] && isNearWhiteBg(curr - w)) { bgMask[curr - w] = 1; queue[qTail++] = curr - w; }
                        if (cy < h - 1 && !bgMask[curr + w] && isNearWhiteBg(curr + w)) { bgMask[curr + w] = 1; queue[qTail++] = curr + w; }
                    }

                    // 2. Aplicar Chroma Key (R > 240 && G > 240 && B > 240 -> alpha = 0) y Feathering suave en bordes
                    const FEATHER_START = 205;
                    const FEATHER_END = 240;
                    for (let y = 0; y < h; y++) {
                        for (let x = 0; x < w; x++) {
                            const pIdx = y * w + x;
                            const i = pIdx * 4;
                            const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                            if (a === 0) continue;

                            // Comprobar si pertenece al fondo o está a <= 2px del borde del fondo
                            let isEdgeOrBg = bgMask[pIdx] === 1;
                            if (!isEdgeOrBg) {
                                for (let dy = -2; dy <= 2 && !isEdgeOrBg; dy++) {
                                    const ny = y + dy;
                                    if (ny < 0 || ny >= h) continue;
                                    const rowOff = ny * w;
                                    for (let dx = -2; dx <= 2; dx++) {
                                        const nx = x + dx;
                                        if (nx >= 0 && nx < w && bgMask[rowOff + nx] === 1) {
                                            isEdgeOrBg = true;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (isEdgeOrBg) {
                                if (r > 240 && g > 240 && b > 240) {
                                    data[i + 3] = 0;
                                } else {
                                    const minC = Math.min(r, g, b);
                                    const maxC = Math.max(r, g, b);
                                    if (minC > FEATHER_START && (maxC - minC) < 35) {
                                        const alphaFactor = Math.max(0, Math.min(1, (FEATHER_END - minC) / (FEATHER_END - FEATHER_START)));
                                        data[i + 3] = Math.round(a * alphaFactor);
                                    }
                                }
                            }
                        }
                    }

                    offCtx.putImageData(imageData, 0, 0);
                } catch (err) {
                    // Si el navegador abre con file:// y restringe getImageData, offCanvas conserva la imagen dibujada
                }
                return offCanvas;
            },

            processStartMenuLogo(img) {
                const logoCanvas = document.getElementById('title-logo-canvas');
                const fallbackEl = document.getElementById('title-logo-fallback');
                if (!logoCanvas) return;

                const srcW = img.naturalWidth || img.width || 1024;
                const srcH = img.naturalHeight || img.height || 572;
                const sx = Math.round(srcW * (196 / 1024));
                const sy = Math.round(srcH * (14 / 572));
                const sw = Math.round(srcW * (632 / 1024));
                const sh = Math.round(srcH * (282 / 572));

                logoCanvas.width = sw;
                logoCanvas.height = sh;
                const lctx = logoCanvas.getContext('2d', { willReadFrequently: true });
                lctx.clearRect(0, 0, sw, sh);
                lctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

                try {
                    const imgData = lctx.getImageData(0, 0, sw, sh);
                    const data = imgData.data;
                    const total = sw * sh;
                    const bgMask = new Uint8Array(total);
                    const queue = new Int32Array(total);
                    let qHead = 0, qTail = 0;

                    const letterBandY1 = Math.floor(sh * 0.33);
                    const letterBandY2 = Math.floor(sh * 0.56);
                    const letterBandX1 = Math.floor(sw * 0.058);
                    const letterBandX2 = Math.floor(sw * 0.942);

                    const canFlood = (pIdx) => {
                        const px = pIdx % sw;
                        const py = (pIdx / sw) | 0;
                        const i = pIdx * 4;
                        const r = data[i], g = data[i + 1], b = data[i + 2];
                        const minC = Math.min(r, g, b);
                        const maxC = Math.max(r, g, b);
                        const sat = maxC - minC;
                        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                        if (py >= letterBandY1 && py <= letterBandY2 && px >= letterBandX1 && px <= letterBandX2) {
                            return minC > 195 && sat < 24;
                        }
                        return lum > 152;
                    };

                    for (let y = 0; y < sh; y++) {
                        for (let x = 0; x < sw; x++) {
                            if (x === 0 || x === sw - 1 || y === 0 || y === sh - 1) {
                                const pIdx = y * sw + x;
                                if (canFlood(pIdx)) {
                                    bgMask[pIdx] = 1;
                                    queue[qTail++] = pIdx;
                                }
                            }
                        }
                    }

                    while (qHead < qTail) {
                        const curr = queue[qHead++];
                        const cx = curr % sw;
                        const cy = (curr / sw) | 0;
                        if (cx > 0 && !bgMask[curr - 1] && canFlood(curr - 1)) { bgMask[curr - 1] = 1; queue[qTail++] = curr - 1; }
                        if (cx < sw - 1 && !bgMask[curr + 1] && canFlood(curr + 1)) { bgMask[curr + 1] = 1; queue[qTail++] = curr + 1; }
                        if (cy > 0 && !bgMask[curr - sw] && canFlood(curr - sw)) { bgMask[curr - sw] = 1; queue[qTail++] = curr - sw; }
                        if (cy < sh - 1 && !bgMask[curr + sw] && canFlood(curr + sw)) { bgMask[curr + sw] = 1; queue[qTail++] = curr + sw; }
                    }

                    const textYMin = Math.floor(sh * 0.32);
                    const textYMax = Math.floor(sh * 0.72);

                    for (let y = 0; y < sh; y++) {
                        for (let x = 0; x < sw; x++) {
                            const pIdx = y * sw + x;
                            const i = pIdx * 4;
                            const r = data[i], g = data[i + 1], b = data[i + 2];
                            const minC = Math.min(r, g, b);
                            const maxC = Math.max(r, g, b);
                            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

                            const isOuterFiligreeWhite = (y < textYMin || y > textYMax) && minC > 224 && (maxC - minC) < 26;
                            if (bgMask[pIdx] === 1 || isOuterFiligreeWhite) {
                                if (r > 240 && g > 240 && b > 240) {
                                    data[i + 3] = 0;
                                } else {
                                    const startLum = (y >= letterBandY1 && y <= letterBandY2) ? 185 : 152;
                                    const alphaNorm = Math.pow(Math.max(0, Math.min(1, (242 - lum) / (242 - startLum))), 1.15);
                                    if (alphaNorm <= 0.03) {
                                        data[i + 3] = 0;
                                    } else {
                                        data[i]     = Math.max(0, Math.min(255, Math.round((r - (1 - alphaNorm) * 255) / alphaNorm)));
                                        data[i + 1] = Math.max(0, Math.min(255, Math.round((g - (1 - alphaNorm) * 255) / alphaNorm)));
                                        data[i + 2] = Math.max(0, Math.min(255, Math.round((b - (1 - alphaNorm) * 255) / alphaNorm)));
                                        data[i + 3] = Math.round(alphaNorm * 255);
                                    }
                                }
                            }
                        }
                    }

                    lctx.putImageData(imgData, 0, 0);
                    this.assets.uiStartLogo = logoCanvas;
                    this.ready.uiStartLogo = true;
                    if (fallbackEl) fallbackEl.classList.add('hidden');
                } catch (err) {
                    const b64 = (typeof window !== 'undefined' && window.LILY_SHEETS_B64) ? window.LILY_SHEETS_B64.uiStart : null;
                    if (b64 && img.src !== b64) {
                        const retryImg = new Image();
                        retryImg.onload = () => this.processStartMenuLogo(retryImg);
                        retryImg.src = b64;
                        return;
                    }
                    logoCanvas.classList.add('hidden');
                    if (fallbackEl) fallbackEl.classList.remove('hidden');
                }
            },

            init() {
                // 1. Cargar fondo ilustrado bg_cosmic_sunset (.png con fallback automático a .jpg)
                const bgImg = new Image();
                bgImg.onload = () => {
                    this.assets.bg = bgImg;
                    this.ready.bg = true;
                };
                bgImg.onerror = () => {
                    if (!bgImg.dataset.retriedJpg) {
                        bgImg.dataset.retriedJpg = '1';
                        bgImg.src = this.sources.bgFallback;
                    }
                };
                bgImg.src = this.sources.bg;

                // 2. Cargar y procesar con Chroma Key las 3 hojas de sprites/tiles
                ['tileset', 'lily', 'props'].forEach(key => {
                    const img = new Image();
                    img.onload = () => {
                        this.assets[key] = this.processChromaKey(img);
                        this.ready[key] = true;
                    };
                    img.onerror = () => {
                        this.ready[key] = false;
                    };
                    img.src = this.sources[key];
                });

                // 3. Cargar hojas de animación de Lily (Acción y Reposo con cuadrícula 2x6)
                const b64Sheets = (typeof window !== 'undefined' && window.LILY_SHEETS_B64) ? window.LILY_SHEETS_B64 : null;

                const actionImg = new Image();
                actionImg.onload = () => this.processGridSheet(actionImg, 'action');
                actionImg.onerror = () => {
                    if (!actionImg.dataset.retried) {
                        actionImg.dataset.retried = '1';
                        actionImg.src = this.sources.lilyActionFallback;
                    }
                };
                actionImg.src = (b64Sheets && b64Sheets.action) ? b64Sheets.action : this.sources.lilyAction;

                const idleImg = new Image();
                idleImg.onload = () => this.processGridSheet(idleImg, 'idle');
                idleImg.onerror = () => {
                    if (!idleImg.dataset.retried) {
                        idleImg.dataset.retried = '1';
                        idleImg.src = this.sources.lilyIdleFallback;
                    }
                };
                idleImg.src = (b64Sheets && b64Sheets.idle) ? b64Sheets.idle : this.sources.lilyIdle;

                // 4. Cargar y extraer el logo de portada (ui_start_assets) con Chroma Key
                const uiStartImg = new Image();
                uiStartImg.onload = () => this.processStartMenuLogo(uiStartImg);
                uiStartImg.onerror = () => {
                    if (!uiStartImg.dataset.retried) {
                        uiStartImg.dataset.retried = '1';
                        uiStartImg.src = this.sources.uiStartFallback;
                    }
                };
                uiStartImg.src = (b64Sheets && b64Sheets.uiStart) ? b64Sheets.uiStart : this.sources.uiStart;
            },

            isReady(key) {
                return !!(this.ready[key] && this.assets[key]);
            },

            get(key) {
                return this.assets[key] || null;
            }
        };
        AssetManager.init();


        function drawMagicBloom(c, x, y, radius, innerColor = 'rgba(255, 229, 143, 0.55)', outerColor = 'rgba(255, 133, 192, 0)') {
            if (radius <= 0) return;
            c.save();
            c.globalCompositeOperation = 'lighter';
            const grad = c.createRadialGradient(x, y, radius * 0.08, x, y, radius);
            grad.addColorStop(0, innerColor);
            grad.addColorStop(0.55, innerColor.replace(/[\d.]+\)\s*$/, '0.22)'));
            grad.addColorStop(1, outerColor);
            c.fillStyle = grad;
            c.beginPath();
            c.arc(x, y, radius, 0, Math.PI * 2);
            c.fill();
            c.restore();
        }


export { AssetManager, drawMagicBloom };
export default AssetManager;
