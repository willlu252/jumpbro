(function() {
    'use strict';
    
    if (typeof window.gameState === 'undefined') return;
    
    window.SynthwaveMusic = {
        initialized: false,
        volume: 0.7,
        isPlaying: false,
        currentIntensity: 0.5,
        synth: null,
        bassLine: null,
        lead: null,
        drums: null,
        filter: null,
        reverb: null,
        delay: null,
        
        init: function() {
            if (this.initialized) return;
            
            // Create audio context and components
            this.reverb = new Tone.Reverb({
                decay: 4,
                wet: 0.3
            }).toDestination();
            
            this.delay = new Tone.FeedbackDelay({
                delayTime: "8n",
                feedback: 0.3,
                wet: 0.2
            }).connect(this.reverb);
            
            this.filter = new Tone.Filter({
                frequency: 2000,
                type: "lowpass"
            }).connect(this.delay);
            
            // Bass synthesizer
            this.bassLine = new Tone.FMSynth({
                harmonicity: 0.5,
                modulationIndex: 2,
                envelope: {
                    attack: 0.1,
                    decay: 0.2,
                    sustain: 0.3,
                    release: 0.5
                },
                volume: -15
            }).connect(this.filter);
            
            // Lead synthesizer
            this.lead = new Tone.Synth({
                oscillator: {
                    type: "sawtooth"
                },
                envelope: {
                    attack: 0.1,
                    decay: 0.2,
                    sustain: 0.4,
                    release: 0.8
                },
                volume: -18
            }).connect(this.filter);
            
            // Drum machine
            this.drums = new Tone.MembraneSynth({
                envelope: {
                    attack: 0.01,
                    decay: 0.2,
                    sustain: 0,
                    release: 0.1
                },
                volume: -12
            }).connect(this.reverb);
            
            this.initialized = true;
        },
        
        startAmbient: function() {
            if (!this.initialized) this.init();
            if (this.isPlaying) return;
            
            this.isPlaying = true;
            this.playBassPattern();
            this.playDrumPattern();
            this.playLeadMelody();
        },
        
        playBassPattern: function() {
            if (!this.isPlaying) return;
            
            const bassNotes = ['C2', 'F2', 'G2', 'F2'];
            let noteIndex = 0;
            
            const playBass = () => {
                if (!this.isPlaying) return;
                
                this.bassLine.triggerAttackRelease(bassNotes[noteIndex], '4n');
                noteIndex = (noteIndex + 1) % bassNotes.length;
                
                setTimeout(playBass, 500);
            };
            
            playBass();
        },
        
        playDrumPattern: function() {
            if (!this.isPlaying) return;
            
            const playDrum = () => {
                if (!this.isPlaying) return;
                
                this.drums.triggerAttackRelease('C1', '16n');
                
                setTimeout(() => {
                    if (this.isPlaying) {
                        this.drums.triggerAttackRelease('C1', '16n');
                    }
                }, 250);
                
                setTimeout(playDrum, 1000);
            };
            
            setTimeout(playDrum, 250);
        },
        
        playLeadMelody: function() {
            if (!this.isPlaying) return;
            
            const melodyNotes = ['C4', 'D4', 'F4', 'G4', 'A4', 'F4', 'D4', 'C4'];
            let noteIndex = 0;
            
            const playLead = () => {
                if (!this.isPlaying) return;
                
                if (Math.random() < 0.6) {
                    this.lead.triggerAttackRelease(melodyNotes[noteIndex], '8n');
                }
                
                noteIndex = (noteIndex + 1) % melodyNotes.length;
                
                setTimeout(playLead, 750);
            };
            
            setTimeout(playLead, 2000);
        },
        
        onPlayerDash: function() {
            if (!this.initialized) return;
            
            // Dash sound effect
            const dashSynth = new Tone.FMSynth({
                harmonicity: 5,
                modulationIndex: 3,
                envelope: {
                    attack: 0.01,
                    decay: 0.1,
                    sustain: 0,
                    release: 0.2
                },
                volume: -10
            }).connect(this.reverb);
            
            dashSynth.triggerAttackRelease('F4', '16n');
            
            setTimeout(() => {
                dashSynth.dispose();
            }, 1000);
        },
        
        onPlayerJump: function() {
            if (!this.initialized) return;
            
            // Jump sound effect
            const jumpSynth = new Tone.Synth({
                oscillator: {
                    type: "triangle"
                },
                envelope: {
                    attack: 0.01,
                    decay: 0.1,
                    sustain: 0,
                    release: 0.2
                },
                volume: -12
            }).connect(this.reverb);
            
            jumpSynth.triggerAttackRelease('C5', '32n');
            
            setTimeout(() => {
                jumpSynth.dispose();
            }, 500);
        },
        
        onCollectItem: function() {
            if (!this.initialized) return;
            
            // Collection chime
            const collectSynth = new Tone.Synth({
                oscillator: {
                    type: "sine"
                },
                envelope: {
                    attack: 0.01,
                    decay: 0.3,
                    sustain: 0,
                    release: 0.3
                },
                volume: -8
            }).connect(this.reverb);
            
            collectSynth.triggerAttackRelease('E5', '16n');
            setTimeout(() => {
                collectSynth.triggerAttackRelease('G5', '16n');
            }, 100);
            
            setTimeout(() => {
                collectSynth.dispose();
            }, 1000);
        },
        
        onTakeDamage: function() {
            if (!this.initialized) return;
            
            // Damage sound
            const damageSynth = new Tone.FMSynth({
                harmonicity: 0.25,
                modulationIndex: 8,
                envelope: {
                    attack: 0.01,
                    decay: 0.2,
                    sustain: 0,
                    release: 0.1
                },
                volume: -8
            }).connect(this.reverb);
            
            damageSynth.triggerAttackRelease('A2', '8n');
            
            setTimeout(() => {
                damageSynth.dispose();
            }, 500);
        },
        
        onPowerUp: function() {
            if (!this.initialized) return;
            
            // Power-up sound
            const powerSynth = new Tone.Synth({
                oscillator: {
                    type: "sawtooth"
                },
                envelope: {
                    attack: 0.01,
                    decay: 0.2,
                    sustain: 0.5,
                    release: 0.8
                },
                volume: -6
            }).connect(this.reverb);
            
            const notes = ['C4', 'E4', 'G4', 'C5'];
            notes.forEach((note, index) => {
                setTimeout(() => {
                    powerSynth.triggerAttackRelease(note, '16n');
                }, index * 100);
            });
            
            setTimeout(() => {
                powerSynth.dispose();
            }, 2000);
        },
        
        setIntensity: function(intensity) {
            this.currentIntensity = Math.max(0, Math.min(1, intensity));
            
            if (this.filter) {
                this.filter.frequency.value = 1000 + (this.currentIntensity * 2000);
            }
            
            if (this.reverb) {
                this.reverb.wet.value = 0.2 + (this.currentIntensity * 0.3);
            }
        },
        
        setVolume: function(volume) {
            this.volume = Math.max(0, Math.min(1, volume));
            Tone.Master.volume.value = Tone.gainToDb(this.volume);
        },
        
        stop: function() {
            this.isPlaying = false;
        }
    };
    
    // Auto-initialize when game starts
    if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('load', () => {
            // Start audio context on first user interaction
            document.addEventListener('click', () => {
                if (Tone.context.state !== 'running') {
                    Tone.start();
                }
            }, { once: true });
            
            document.addEventListener('keydown', () => {
                if (Tone.context.state !== 'running') {
                    Tone.start();
                }
            }, { once: true });
        });
    }
})();