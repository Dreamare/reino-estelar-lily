/**
 * Audio.js - Toda la síntesis de sonido y melodías Web Audio API
 */

        const N = {
            REST: 0,
            C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
            C4: 261.63, Cs4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
            C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Ab5: 830.61, A5: 880.00, B5: 987.77,
            C6: 1046.50
        };

        // Tema musical sombrío y tenso exclusivo para la pelea contra el Boss del Mundo 1-4
        const BOSS_TENSION_MELODY = {
            name: '⚠️ Tensión del Boss',
            fullName: 'Batalla contra el Rey Kraken Marciano',
            tempoMs: 210,
            leadWave: 'sawtooth',
            lead: [
                N.C4, N.Eb4, N.Fs4, N.G4, N.REST, N.Fs4, N.Eb4, N.C4,
                N.B3, N.D4, N.F4, N.Ab4, N.G4, N.Fs4, N.F4, N.D4,
                N.C4, N.Eb4, N.G4, N.C5, N.B4, N.Ab4, N.G4, N.Fs4,
                N.G4, N.REST, N.Eb4, N.REST, N.C4, N.B3, N.C4, N.REST
            ],
            bass: [
                N.C3, N.C3, N.G3, N.C3, N.Fs3, N.Fs3, N.C3, N.Fs3,
                N.G3, N.G3, N.D3, N.G3, N.Ab3, N.G3, N.F3, N.D3,
                N.C3, N.G3, N.Eb3, N.C3, N.Ab3, N.Eb3, N.Fs3, N.C3,
                N.G3, N.D3, N.G3, N.D3, N.C3, N.G3, N.C3, N.REST
            ]
        };

        const MELODIES = [
            {
                name: '1. Nana Estelar',
                fullName: 'Nana de Estrellas (Arpa y Cajita)',
                tempoMs: 420,
                leadWave: 'sine',
                lead: [
                    N.E5, N.G5, N.C6, N.REST, N.B5, N.G5, N.E5, N.REST,
                    N.F5, N.A5, N.G5, N.E5, N.D5, N.REST, N.REST, N.REST,
                    N.E5, N.G5, N.A5, N.C6, N.B5, N.G5, N.E5, N.G5,
                    N.F5, N.E5, N.D5, N.C5, N.C5, N.REST, N.REST, N.REST,
                    N.A5, N.G5, N.F5, N.E5, N.D5, N.F5, N.E5, N.REST,
                    N.G5, N.F5, N.E5, N.D5, N.C5, N.E5, N.D5, N.REST,
                    N.E5, N.G5, N.C6, N.A5, N.G5, N.E5, N.D5, N.E5,
                    N.C5, N.REST, N.G4, N.REST, N.C5, N.REST, N.REST, N.REST
                ],
                bass: [
                    N.C4, N.G4, N.E4, N.G4, N.A3, N.E4, N.C4, N.E4,
                    N.F3, N.C4, N.A3, N.C4, N.G3, N.D4, N.B3, N.D4,
                    N.C4, N.G4, N.E4, N.G4, N.E3, N.B3, N.G3, N.B3,
                    N.F3, N.C4, N.G3, N.D4, N.C3, N.G3, N.C4, N.REST,
                    N.F3, N.C4, N.A3, N.C4, N.C4, N.G4, N.E4, N.G4,
                    N.G3, N.D4, N.B3, N.D4, N.A3, N.E4, N.G3, N.D4,
                    N.C4, N.G4, N.F3, N.C4, N.G3, N.D4, N.G3, N.B3,
                    N.C3, N.G3, N.E4, N.G3, N.C4, N.REST, N.REST, N.REST
                ]
            },
            {
                name: '2. Cajita de Cristal',
                fullName: 'Cajita de Cristal (Celesta 3/4)',
                tempoMs: 380,
                leadWave: 'triangle',
                lead: [
                    N.G5, N.E5, N.C5, N.A5, N.G5, N.E5, N.F5, N.D5, N.B4, N.G5, N.E5, N.REST,
                    N.C5, N.E5, N.G5, N.A5, N.G5, N.E5, N.D5, N.F5, N.E5, N.D5, N.REST, N.REST,
                    N.G5, N.E5, N.C5, N.A5, N.C6, N.A5, N.G5, N.E5, N.C5, N.D5, N.REST, N.REST,
                    N.F5, N.A5, N.G5, N.E5, N.C5, N.D5, N.C5, N.REST, N.REST, N.REST, N.REST, N.REST
                ],
                bass: [
                    N.C3, N.G3, N.E4, N.F3, N.C4, N.A4, N.G3, N.D4, N.B3, N.C3, N.G3, N.E4,
                    N.A3, N.E4, N.C4, N.F3, N.C4, N.A3, N.G3, N.D4, N.B3, N.G3, N.D4, N.REST,
                    N.C3, N.G3, N.E4, N.F3, N.C4, N.A4, N.E3, N.B3, N.G3, N.G3, N.D4, N.B3,
                    N.F3, N.C4, N.A3, N.G3, N.D4, N.B3, N.C3, N.G3, N.C4, N.REST, N.REST, N.REST
                ]
            },
            {
                name: '3. Sueño de Algodón',
                fullName: 'Sueño de Algodón (Ambiente Lunar)',
                tempoMs: 500,
                leadWave: 'sine',
                lead: [
                    N.E5, N.REST, N.A5, N.G5, N.E5, N.REST, N.D5, N.REST,
                    N.C5, N.D5, N.E5, N.REST, N.G5, N.REST, N.REST, N.REST,
                    N.A5, N.REST, N.C6, N.B5, N.A5, N.G5, N.E5, N.REST,
                    N.D5, N.E5, N.G5, N.E5, N.A4, N.REST, N.REST, N.REST
                ],
                bass: [
                    N.A3, N.E4, N.A4, N.REST, N.G3, N.D4, N.G4, N.REST,
                    N.F3, N.C4, N.F4, N.REST, N.E3, N.B3, N.E4, N.REST,
                    N.F3, N.C4, N.A4, N.REST, N.C3, N.G3, N.E4, N.REST,
                    N.D3, N.A3, N.F4, N.REST, N.A3, N.E4, N.A4, N.REST
                ]
            },
            {
                name: '4. Cenizas y Esperanza',
                fullName: 'Cenizas y Esperanza (Tierra Devastada)',
                tempoMs: 440,
                leadWave: 'triangle',
                lead: [
                    N.A4, N.C5, N.E5, N.D5, N.C5, N.B4, N.A4, N.REST,
                    N.F4, N.A4, N.C5, N.B4, N.G4, N.B4, N.E5, N.REST,
                    N.A4, N.C5, N.E5, N.G5, N.F5, N.E5, N.D5, N.C5,
                    N.D5, N.F5, N.E5, N.C5, N.B4, N.G4, N.A4, N.REST
                ],
                bass: [
                    N.A3, N.E4, N.A4, N.C5, N.F3, N.C4, N.F4, N.A4,
                    N.D3, N.A3, N.D4, N.F4, N.E3, N.B3, N.E4, N.G4,
                    N.F3, N.C4, N.F4, N.A4, N.C3, N.G3, N.C4, N.E4,
                    N.D3, N.A3, N.D4, N.F4, N.E3, N.B3, N.A3, N.REST
                ]
            },
            {
                name: '5. Atardecer Carmesí',
                fullName: 'Atardecer Carmesí (Tensión Apocalíptica)',
                tempoMs: 330,
                leadWave: 'sawtooth',
                lead: [
                    N.D5, N.F5, N.A5, N.D6, N.CS6, N.A5, N.F5, N.E5,
                    N.D5, N.F5, N.G5, N.GS5, N.A5, N.F5, N.E5, N.CS5,
                    N.D5, N.D5, N.F5, N.A5, N.C6, N.B5, N.G5, N.E5,
                    N.F5, N.D5, N.CS5, N.E5, N.D5, N.REST, N.REST, N.REST
                ],
                bass: [
                    N.D3, N.A3, N.D4, N.A3, N.CS3, N.A3, N.CS4, N.A3,
                    N.C3, N.G3, N.C4, N.G3, N.B2, N.G3, N.B3, N.G3,
                    N.BB2, N.F3, N.BB3, N.F3, N.G2, N.D3, N.G3, N.D3,
                    N.A2, N.E3, N.A3, N.CS4, N.D3, N.A3, N.D4, N.REST
                ]
            }
        ];

        class KawaiiAudio {
            constructor() {
                this.ctx = null;
                this.masterGain = null;
                this.filterNode = null;
                this.musicEnabled = true;
                this.sfxEnabled = true;
                this.volume = 0.55;
                this.isPlayingMusic = false;
                this.isBossMusicActive = false;
                this.melodyIndex = 0;
                this.noteStep = 0;
                this.musicTimer = null;
                this.noiseBuffer = null;
            }

            init() {
                if (!this.ctx) {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtx) {
                        this.ctx = new AudioCtx();
                        this.masterGain = this.ctx.createGain();
                        this.masterGain.gain.value = this.volume;

                        this.filterNode = this.ctx.createBiquadFilter();
                        this.filterNode.type = 'lowpass';
                        this.filterNode.frequency.value = 1950;
                        this.filterNode.Q.value = 0.7;

                        this.filterNode.connect(this.masterGain);
                        this.masterGain.connect(this.ctx.destination);
                    }
                }
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
            }

            setVolume(val0to1) {
                this.volume = Math.max(0, Math.min(1, val0to1));
                if (this.masterGain && this.ctx) {
                    this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.03);
                }
            }

            toggleMusic() {
                this.init();
                this.musicEnabled = !this.musicEnabled;
                document.getElementById('music-icon').textContent = this.musicEnabled ? '🎵' : '🔇';
                if (this.musicEnabled) {
                    this.startLullaby();
                    showToast(`🎵 Música activada: ${MELODIES[this.melodyIndex].fullName}`);
                } else {
                    this.stopLullaby();
                    showToast('🔇 Música en silencio');
                }
            }

            toggleSfx() {
                this.init();
                this.sfxEnabled = !this.sfxEnabled;
                document.getElementById('btn-sfx').textContent = this.sfxEnabled ? '🔔' : '🔕';
                showToast(this.sfxEnabled ? '🔔 Efectos de sonido activados' : '🔕 Efectos de sonido silenciados');
            }

            cycleMelody() {
                this.init();
                this.melodyIndex = (this.melodyIndex + 1) % MELODIES.length;
                this.noteStep = 0;
                const mel = MELODIES[this.melodyIndex];
                document.getElementById('melody-name').textContent = mel.name;
                document.getElementById('preview-melody-text').textContent = `Música: ${mel.name.slice(3)}`;
                if (this.musicEnabled) {
                    this.stopLullaby();
                    this.startLullaby();
                }
                showToast(`🎹 Melodía: ${mel.fullName}`);
            }

            startLullaby() {
                this.init();
                if (!this.musicEnabled || this.isPlayingMusic || !this.ctx) return;
                this.isPlayingMusic = true;
                this.isBossMusicActive = false;
                const MELODY_LOOPS = 2;   // cada melodía suena 2 veces y cambia sola a la siguiente

                const tick = () => {
                    if (!this.isPlayingMusic || this.isBossMusicActive) return;
                    const mel = MELODIES[this.melodyIndex];
                    if (this.musicEnabled && this.ctx && !this.paused) {
                        const step = this.noteStep % mel.lead.length;
                        const leadFreq = mel.lead[step];
                        const bassFreq = mel.bass[step % mel.bass.length];
                        if (leadFreq > 0) {
                            this.playWarmTone(leadFreq, 0.75, 0.055, mel.leadWave, 0.02);
                            this.playWarmTone(leadFreq * 2, 0.35, 0.012, 'sine', 0.04);
                        }
                        if (bassFreq > 0) {
                            this.playWarmTone(bassFreq, 0.95, 0.048, 'sine', 0.02);
                        }
                        this.noteStep++;
                        if (this.noteStep >= mel.lead.length * MELODY_LOOPS) {
                            this.melodyIndex = (this.melodyIndex + 1) % MELODIES.length;
                            this.noteStep = 0;
                            const next = MELODIES[this.melodyIndex];
                            document.getElementById('melody-name').textContent = next.name;
                            document.getElementById('preview-melody-text').textContent = `Música: ${next.name.slice(3)}`;
                            showToast(`🎶 Ahora suena: ${next.fullName}`, 2600);
                        }
                    }
                    this.musicTimer = setTimeout(tick, MELODIES[this.melodyIndex].tempoMs);
                };
                this.musicTimer = setTimeout(tick, MELODIES[this.melodyIndex].tempoMs);
            }

            // 🐙 Activa la música de tensión cuando Lily se enfrenta al Boss en el Mundo 1-4
            startBossTensionMusic() {
                this.init();
                if (!this.musicEnabled || !this.ctx) return;
                if (this.isBossMusicActive && this.isPlayingMusic) return;
                this.stopLullaby();
                this.isPlayingMusic = true;
                this.isBossMusicActive = true;
                this.noteStep = 0;
                document.getElementById('melody-name').textContent = BOSS_TENSION_MELODY.name;

                this.musicTimer = setInterval(() => {
                    if (!this.musicEnabled || !this.ctx || this.paused) return;
                    const step = this.noteStep % BOSS_TENSION_MELODY.lead.length;
                    const leadFreq = BOSS_TENSION_MELODY.lead[step];
                    const bassFreq = BOSS_TENSION_MELODY.bass[step % BOSS_TENSION_MELODY.bass.length];

                    if (leadFreq > 0) {
                        this.playWarmTone(leadFreq, 0.28, 0.045, 'sawtooth', 0.015);
                        this.playWarmTone(leadFreq * 0.5, 0.28, 0.03, 'triangle', 0.015);
                    }
                    if (bassFreq > 0) {
                        this.playWarmTone(bassFreq, 0.35, 0.055, 'triangle', 0.01);
                    }
                    this.noteStep++;
                }, BOSS_TENSION_MELODY.tempoMs);
            }

            stopLullaby() {
                this.isPlayingMusic = false;
                this.isBossMusicActive = false;
                if (this.musicTimer) {
                    clearTimeout(this.musicTimer);
                    clearInterval(this.musicTimer);
                    this.musicTimer = null;
                }
            }

            playWarmTone(freq, duration = 0.6, vol = 0.05, type = 'sine', attack = 0.03) {
                if (!this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.0005, now);
                gain.gain.linearRampToValueAtTime(vol, now + attack);
                gain.gain.exponentialRampToValueAtTime(0.0005, now + duration);

                osc.connect(gain);
                gain.connect(this.filterNode || this.ctx.destination);
                osc.onended = () => {
                    try { osc.disconnect(); gain.disconnect(); } catch (e) {}
                };
                osc.start(now);
                osc.stop(now + duration + 0.02);
            }

            playFireworkBurst() {
                if (!this.ctx || !this.sfxEnabled) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(820, now);
                osc.frequency.exponentialRampToValueAtTime(160, now + 0.3);
                g.gain.setValueAtTime(0.001, now);
                g.gain.linearRampToValueAtTime(0.07, now + 0.01);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
                osc.connect(g);
                g.connect(this.filterNode);
                osc.onended = () => {
                    try { osc.disconnect(); g.disconnect(); } catch (e) {}
                };
                osc.start(now);
                osc.stop(now + 0.36);
                this.playWarmTone(1567.98 * (0.8 + Math.random() * 0.5), 0.5, 0.02, 'sine', 0.02);
            }

            playStarShimmer() {
                if (!this.ctx || !this.sfxEnabled) return;
                const shimmerNotes = [1046.50, 1174.66, 1318.51, 1567.98];
                const f = shimmerNotes[Math.floor(Math.random() * shimmerNotes.length)];
                this.playWarmTone(f, 0.6, 0.022, 'sine', 0.04);
            }

            playPortalVortex() {
                if (!this.ctx || !this.sfxEnabled) return;
                const sweep = [330, 392, 493.88, 587.33, 659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98];
                sweep.forEach((f, i) => {
                    setTimeout(() => this.playWarmTone(f, 0.45, 0.065, 'sine', 0.02), i * 95);
                });
            }

            playTimerTick() {
                if (!this.ctx || !this.sfxEnabled) return;
                this.playWarmTone(880, 0.12, 0.04, 'triangle', 0.01);
            }

            playJump(isDoubleJump = false) {
                if (!this.ctx || !this.sfxEnabled) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                const startF = isDoubleJump ? 440 : 330;
                const endF = isDoubleJump ? 784 : 587;
                osc.frequency.setValueAtTime(startF, now);
                osc.frequency.exponentialRampToValueAtTime(endF, now + 0.15);
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.075, now + 0.015);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
                osc.connect(gain);
                gain.connect(this.filterNode);
                osc.onended = () => {
                    try { osc.disconnect(); gain.disconnect(); } catch (e) {}
                };
                osc.start(now);
                osc.stop(now + 0.18);
            }

            playStarCandy() {
                if (!this.ctx || !this.sfxEnabled) return;
                this.playWarmTone(783.99, 0.22, 0.065, 'sine', 0.015);
                setTimeout(() => this.playWarmTone(1046.50, 0.3, 0.065, 'sine', 0.015), 55);
            }

            playBlockPop() {
                if (!this.ctx || !this.sfxEnabled) return;
                this.playWarmTone(293.66, 0.14, 0.07, 'triangle', 0.01);
                setTimeout(() => this.playWarmTone(440.00, 0.16, 0.06, 'sine', 0.01), 40);
            }

            playPowerUp() {
                if (!this.ctx || !this.sfxEnabled) return;
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((f, i) => {
                    setTimeout(() => this.playWarmTone(f, 0.35, 0.07, 'sine', 0.02), i * 65);
                });
            }

            playBubble() {
                if (!this.ctx || !this.sfxEnabled) return;
                this.playWarmTone(587.33, 0.16, 0.06, 'sine', 0.015);
                setTimeout(() => this.playWarmTone(880.00, 0.2, 0.05, 'sine', 0.015), 40);
            }

            playBefriend() {
                if (!this.ctx || !this.sfxEnabled) return;
                const notes = [587.33, 783.99, 987.77];
                notes.forEach((f, i) => {
                    setTimeout(() => this.playWarmTone(f, 0.28, 0.065, 'sine', 0.015), i * 55);
                });
            }

            playHurt() {
                if (!this.ctx || !this.sfxEnabled) return;
                this.playWarmTone(349.23, 0.22, 0.075, 'sine', 0.02);
                setTimeout(() => this.playWarmTone(261.63, 0.32, 0.075, 'sine', 0.02), 85);
            }

            // Ruido blanco (se crea una sola vez) para el "crash" del choque y propulsores
            getNoiseBuffer() {
                if (!this.noiseBuffer) {
                    const len = Math.floor(this.ctx.sampleRate * 0.25);
                    this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
                    const data = this.noiseBuffer.getChannelData(0);
                    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
                }
                return this.noiseBuffer;
            }

            // 💥 CHOQUE / GOLPE MARCIANO: Un marciano o meteorito golpea a Lily.
            playCollision() {
                if (!this.ctx || !this.sfxEnabled) return;
                const now = this.ctx.currentTime;

                const thud = this.ctx.createOscillator();
                const thudGain = this.ctx.createGain();
                thud.type = 'triangle';
                thud.frequency.setValueAtTime(200, now);
                thud.frequency.exponentialRampToValueAtTime(45, now + 0.17);
                thudGain.gain.setValueAtTime(0.001, now);
                thudGain.gain.linearRampToValueAtTime(0.28, now + 0.008);
                thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                thud.connect(thudGain);
                thudGain.connect(this.filterNode);
                thud.onended = () => {
                    try { thud.disconnect(); thudGain.disconnect(); } catch (e) {}
                };
                thud.start(now);
                thud.stop(now + 0.24);

                const crash = this.ctx.createBufferSource();
                crash.buffer = this.getNoiseBuffer();
                const crashFilter = this.ctx.createBiquadFilter();
                crashFilter.type = 'bandpass';
                crashFilter.frequency.value = 1100;
                crashFilter.Q.value = 0.7;
                const crashGain = this.ctx.createGain();
                crashGain.gain.setValueAtTime(0.001, now);
                crashGain.gain.linearRampToValueAtTime(0.22, now + 0.004);
                crashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                crash.connect(crashFilter);
                crashFilter.connect(crashGain);
                crashGain.connect(this.filterNode);
                crash.onended = () => {
                    try { crash.disconnect(); crashFilter.disconnect(); crashGain.disconnect(); } catch (e) {}
                };
                crash.start(now);
                crash.stop(now + 0.16);
            }

            // 💀 MUERTE: "wah-wah-wah-waaah" descendente (trombón triste).
            playDeath(delay = 0) {
                if (!this.ctx || !this.sfxEnabled) return;
                const t0 = this.ctx.currentTime + delay;
                const notes = [
                    { f: 392.00, at: 0.00, d: 0.20 },               // Sol
                    { f: 369.99, at: 0.24, d: 0.20 },               // Fa♯
                    { f: 349.23, at: 0.48, d: 0.20 },               // Fa
                    { f: 329.63, at: 0.72, d: 0.65, sink: true }    // Mi largo que se hunde
                ];
                notes.forEach(n => {
                    const s = t0 + n.at;
                    const osc = this.ctx.createOscillator();
                    const wah = this.ctx.createBiquadFilter();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(n.f, s);
                    if (n.sink) osc.frequency.exponentialRampToValueAtTime(n.f * 0.7, s + n.d);
                    wah.type = 'lowpass';
                    wah.Q.value = 3;
                    wah.frequency.setValueAtTime(300, s);
                    wah.frequency.exponentialRampToValueAtTime(1400, s + n.d * 0.4);
                    wah.frequency.exponentialRampToValueAtTime(350, s + n.d);
                    gain.gain.setValueAtTime(0.001, s);
                    gain.gain.linearRampToValueAtTime(0.065, s + 0.025);
                    gain.gain.setValueAtTime(0.065, s + n.d * 0.65);
                    gain.gain.exponentialRampToValueAtTime(0.001, s + n.d);
                    osc.connect(wah);
                    wah.connect(gain);
                    gain.connect(this.filterNode);
                    osc.onended = () => {
                        try { osc.disconnect(); wah.disconnect(); gain.disconnect(); } catch (e) {}
                    };
                    osc.start(s);
                    osc.stop(s + n.d + 0.03);
                });
            }

            // 🚩 CHECKPOINT: arpegio ascendente brillante
            playCheckpoint() {
                if (!this.ctx || !this.sfxEnabled) return;
                [659.25, 783.99, 987.77, 1318.51].forEach((f, i) => {
                    setTimeout(() => this.playWarmTone(f, 0.4, 0.07, 'triangle', 0.015), i * 70);
                });
                setTimeout(() => this.playWarmTone(1567.98, 0.7, 0.04, 'sine', 0.02), 300);
            }

            // 🔥 DISPARO MARCIANO (fuego o balita láser)
            playEnemyShoot(isPlasma = false) {
                if (!this.ctx || !this.sfxEnabled) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = isPlasma ? 'sawtooth' : 'triangle';
                osc.frequency.setValueAtTime(isPlasma ? 920 : 520, now);
                osc.frequency.exponentialRampToValueAtTime(isPlasma ? 210 : 130, now + 0.16);
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.06, now + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
                osc.connect(gain);
                gain.connect(this.filterNode);
                osc.onended = () => {
                    try { osc.disconnect(); gain.disconnect(); } catch (e) {}
                };
                osc.start(now);
                osc.stop(now + 0.18);
            }

            // 🚀 COHETE DE VUELO (sonido mágico al activar los 5 segundos de vuelo)
            playRocketActivate() {
                if (!this.ctx || !this.sfxEnabled) return;
                const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
                notes.forEach((f, i) => {
                    setTimeout(() => this.playWarmTone(f, 0.32, 0.075, 'triangle', 0.015), i * 50);
                });
            }

            // 🐱 MAULLIDO TIERNO DEL GATITO COMPAÑERO
            playCatMeow() {
                if (!this.ctx || !this.sfxEnabled) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(620, now);
                osc.frequency.exponentialRampToValueAtTime(980, now + 0.14);
                osc.frequency.exponentialRampToValueAtTime(540, now + 0.38);
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.40);
                osc.connect(gain);
                gain.connect(this.filterNode);
                osc.onended = () => {
                    try { osc.disconnect(); gain.disconnect(); } catch (e) {}
                };
                osc.start(now);
                osc.stop(now + 0.42);
            }

            // 🐙 GOLPE AL BOSS (sonido de impacto y encogimiento)
            playBossHit() {
                if (!this.ctx || !this.sfxEnabled) return;
                this.playWarmTone(220, 0.18, 0.09, 'sawtooth', 0.01);
                setTimeout(() => this.playWarmTone(587.33, 0.22, 0.07, 'triangle', 0.01), 50);
                setTimeout(() => this.playWarmTone(880, 0.25, 0.06, 'sine', 0.01), 100);
            }

            // 🛸 ATERRIZAJE DE LA NAVE AL LLEGAR A UN NUEVO MUNDO
            playSpaceshipLand() {
                if (!this.ctx || !this.sfxEnabled) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(620, now);
                osc.frequency.exponentialRampToValueAtTime(165, now + 0.9);
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.075, now + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
                osc.connect(gain);
                gain.connect(this.filterNode);
                osc.onended = () => {
                    try { osc.disconnect(); gain.disconnect(); } catch (e) {}
                };
                osc.start(now);
                osc.stop(now + 1.0);
                setTimeout(() => this.playWarmTone(783.99, 0.3, 0.065, 'sine', 0.02), 650);
                setTimeout(() => this.playWarmTone(1046.50, 0.4, 0.07, 'sine', 0.02), 780);
            }

            // 🚀 DESPEGUE DE LA NAVE ESTELAR: Fanfarria galáctica + propulsor ascendente
            playSpaceshipLaunch() {
                if (!this.ctx || !this.sfxEnabled) return;
                const fanfare = [523.25, 659.25, 783.99, 1046.50, 1174.66, 1567.98];
                fanfare.forEach((f, i) => {
                    setTimeout(() => this.playWarmTone(f, 0.42, 0.075, 'sine', 0.02), i * 95);
                });
                // Efecto de propulsor ascendente suave
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(140, now + 0.15);
                osc.frequency.exponentialRampToValueAtTime(880, now + 1.45);
                gain.gain.setValueAtTime(0.001, now + 0.15);
                gain.gain.linearRampToValueAtTime(0.08, now + 0.35);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
                osc.connect(gain);
                gain.connect(this.filterNode);
                osc.onended = () => {
                    try { osc.disconnect(); gain.disconnect(); } catch (e) {}
                };
                osc.start(now + 0.15);
                osc.stop(now + 1.55);
            }

            playVictory() {
                if (!this.ctx || !this.sfxEnabled) return;
                const fanfare = [523.25, 659.25, 783.99, 1046.50, 880.0, 1046.50];
                fanfare.forEach((f, i) => {
                    setTimeout(() => this.playWarmTone(f, 0.45, 0.08, 'sine', 0.02), i * 110);
                });
            }

            // 🪜 CRUJIDO DE ESCALERA A PUNTO DE CAER
            playLadderCreak() {
                try {
                    if (!this.ctx || !this.sfxEnabled) return;
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(260, now);
                    osc.frequency.linearRampToValueAtTime(140, now + 0.12);
                    osc.frequency.linearRampToValueAtTime(220, now + 0.22);
                    gain.gain.setValueAtTime(0.001, now);
                    gain.gain.linearRampToValueAtTime(0.07, now + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                    osc.connect(gain);
                    gain.connect(this.filterNode || this.masterGain || this.ctx.destination);
                    osc.onended = () => {
                        try { osc.disconnect(); gain.disconnect(); } catch (e) {}
                    };
                    osc.start(now);
                    osc.stop(now + 0.26);
                } catch (e) {}
            }

            // 💥 IMPACTO / COLAPSO DE ESCALERA AL CAER
            playLadderCrash() {
                try {
                    if (!this.ctx || !this.sfxEnabled) return;
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(130, now);
                    osc.frequency.exponentialRampToValueAtTime(45, now + 0.28);
                    gain.gain.setValueAtTime(0.001, now);
                    gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
                    osc.connect(gain);
                    gain.connect(this.filterNode || this.masterGain || this.ctx.destination);
                    osc.onended = () => {
                        try { osc.disconnect(); gain.disconnect(); } catch (e) {}
                    };
                    osc.start(now);
                    osc.stop(now + 0.34);
                    // Clang metálico complementario
                    setTimeout(() => {
                        try { this.playWarmTone(380, 0.22, 0.08, 'sawtooth', 0.01); } catch (e) {}
                    }, 25);
                } catch (e) {}
            }

            // 🧟 GRUÑIDO / RUGIDO DE HOMBRE ZOMBIE ENMASCARADO
            playZombieRoar() {
                try {
                    if (!this.ctx || !this.sfxEnabled) return;
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(195, now);
                    osc.frequency.exponentialRampToValueAtTime(82, now + 0.35);
                    gain.gain.setValueAtTime(0.001, now);
                    gain.gain.linearRampToValueAtTime(0.085, now + 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
                    osc.connect(gain);
                    gain.connect(this.filterNode || this.masterGain || this.ctx.destination);
                    osc.onended = () => {
                        try { osc.disconnect(); gain.disconnect(); } catch (e) {}
                    };
                    osc.start(now);
                    osc.stop(now + 0.40);
                } catch (e) {}
            }
        }



export { KawaiiAudio, MELODIES, BOSS_TENSION_MELODY };
export default KawaiiAudio;
