(function() {
    'use strict';
    
    if (typeof window.gameState === 'undefined') return;
    
    window.ParticleSystem = {
        initialized: false,
        particlePool: [],
        activeParticles: [],
        scene: null,
        maxParticles: 200,
        
        init: function(scene) {
            if (this.initialized) return;
            
            this.scene = scene;
            this.createParticlePool();
            this.createAmbientParticles();
            this.initialized = true;
        },
        
        createParticlePool: function() {
            for (let i = 0; i < this.maxParticles; i++) {
                const particle = new THREE.Mesh(
                    new THREE.SphereGeometry(0.02, 8, 8),
                    new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 1
                    })
                );
                particle.visible = false;
                this.particlePool.push(particle);
                this.scene.add(particle);
            }
        },
        
        getParticle: function() {
            if (this.particlePool.length > 0) {
                const particle = this.particlePool.pop();
                particle.visible = true;
                particle.material.opacity = 1;
                this.activeParticles.push(particle);
                return particle;
            }
            return null;
        },
        
        returnParticle: function(particle) {
            const index = this.activeParticles.indexOf(particle);
            if (index > -1) {
                this.activeParticles.splice(index, 1);
                particle.visible = false;
                particle.position.set(0, 0, 0);
                particle.scale.set(1, 1, 1);
                particle.material.color.setHex(0xffffff);
                particle.material.opacity = 1;
                this.particlePool.push(particle);
            }
        },
        
        createAmbientParticles: function() {
            const ambientCount = 50;
            for (let i = 0; i < ambientCount; i++) {
                const particle = this.getParticle();
                if (particle) {
                    particle.position.set(
                        (Math.random() - 0.5) * 60,
                        (Math.random() - 0.5) * 30,
                        (Math.random() - 0.5) * 30
                    );
                    
                    particle.material.color.setHSL(
                        Math.random() * 0.3 + 0.5, // Blue-cyan range
                        0.8,
                        0.6
                    );
                    
                    particle.userData = {
                        type: 'ambient',
                        velocity: {
                            x: (Math.random() - 0.5) * 0.01,
                            y: (Math.random() - 0.5) * 0.01,
                            z: (Math.random() - 0.5) * 0.01
                        },
                        life: 1,
                        maxLife: 1
                    };
                }
            }
        },
        
        collectibleSparkle: function(position) {
            const sparkleCount = 12;
            for (let i = 0; i < sparkleCount; i++) {
                const particle = this.getParticle();
                if (particle) {
                    particle.position.copy(position);
                    particle.position.add(new THREE.Vector3(
                        (Math.random() - 0.5) * 0.4,
                        (Math.random() - 0.5) * 0.4,
                        (Math.random() - 0.5) * 0.4
                    ));
                    
                    particle.material.color.setHex(0xffff00);
                    particle.scale.set(0.5, 0.5, 0.5);
                    
                    particle.userData = {
                        type: 'sparkle',
                        velocity: {
                            x: (Math.random() - 0.5) * 0.05,
                            y: (Math.random() - 0.5) * 0.05,
                            z: (Math.random() - 0.5) * 0.05
                        },
                        life: 1,
                        maxLife: 1
                    };
                }
            }
        },
        
        collectionExplosion: function(position) {
            const explosionCount = 20;
            for (let i = 0; i < explosionCount; i++) {
                const particle = this.getParticle();
                if (particle) {
                    particle.position.copy(position);
                    
                    const angle = (i / explosionCount) * Math.PI * 2;
                    const speed = 0.1 + Math.random() * 0.05;
                    
                    particle.material.color.setHex(0x00ffff);
                    particle.scale.set(0.3, 0.3, 0.3);
                    
                    particle.userData = {
                        type: 'explosion',
                        velocity: {
                            x: Math.cos(angle) * speed,
                            y: Math.sin(angle) * speed,
                            z: (Math.random() - 0.5) * 0.02
                        },
                        life: 1,
                        maxLife: 1
                    };
                }
            }
        },
        
        dashTrail: function(position) {
            const trailCount = 8;
            for (let i = 0; i < trailCount; i++) {
                const particle = this.getParticle();
                if (particle) {
                    particle.position.copy(position);
                    particle.position.add(new THREE.Vector3(
                        (Math.random() - 0.5) * 0.2,
                        (Math.random() - 0.5) * 0.2,
                        (Math.random() - 0.5) * 0.2
                    ));
                    
                    particle.material.color.setHex(0x00aaff);
                    particle.scale.set(0.2, 0.2, 0.2);
                    
                    particle.userData = {
                        type: 'trail',
                        velocity: {
                            x: (Math.random() - 0.5) * 0.02,
                            y: (Math.random() - 0.5) * 0.02,
                            z: (Math.random() - 0.5) * 0.02
                        },
                        life: 1,
                        maxLife: 1
                    };
                }
            }
        },
        
        jumpParticles: function(position) {
            const jumpCount = 6;
            for (let i = 0; i < jumpCount; i++) {
                const particle = this.getParticle();
                if (particle) {
                    particle.position.copy(position);
                    particle.position.y -= 0.3;
                    
                    particle.material.color.setHex(0x00ff88);
                    particle.scale.set(0.15, 0.15, 0.15);
                    
                    particle.userData = {
                        type: 'jump',
                        velocity: {
                            x: (Math.random() - 0.5) * 0.03,
                            y: -Math.random() * 0.02,
                            z: (Math.random() - 0.5) * 0.03
                        },
                        life: 1,
                        maxLife: 1
                    };
                }
            }
        },
        
        powerUpGlow: function(position) {
            const glowCount = 15;
            for (let i = 0; i < glowCount; i++) {
                const particle = this.getParticle();
                if (particle) {
                    const angle = (i / glowCount) * Math.PI * 2;
                    const radius = 0.8;
                    
                    particle.position.copy(position);
                    particle.position.add(new THREE.Vector3(
                        Math.cos(angle) * radius,
                        Math.sin(angle) * radius,
                        (Math.random() - 0.5) * 0.2
                    ));
                    
                    particle.material.color.setHex(0xffffff);
                    particle.scale.set(0.4, 0.4, 0.4);
                    
                    particle.userData = {
                        type: 'powerup',
                        velocity: {
                            x: Math.cos(angle) * 0.02,
                            y: Math.sin(angle) * 0.02,
                            z: (Math.random() - 0.5) * 0.01
                        },
                        life: 1,
                        maxLife: 1
                    };
                }
            }
        },
        
        update: function(deltaTime) {
            if (!this.initialized) return;
            
            const time = Date.now() * 0.001;
            
            // Update all active particles
            for (let i = this.activeParticles.length - 1; i >= 0; i--) {
                const particle = this.activeParticles[i];
                const userData = particle.userData;
                
                if (!userData) continue;
                
                // Update position
                particle.position.x += userData.velocity.x;
                particle.position.y += userData.velocity.y;
                particle.position.z += userData.velocity.z;
                
                // Update life
                userData.life -= deltaTime * 2;
                
                // Update based on particle type
                switch (userData.type) {
                    case 'ambient':
                        particle.position.y += Math.sin(time + particle.position.x) * 0.001;
                        particle.material.opacity = 0.6 + Math.sin(time * 2 + particle.position.x) * 0.2;
                        
                        // Reset ambient particles when they go out of bounds
                        if (userData.life <= 0) {
                            userData.life = 1;
                            particle.position.set(
                                (Math.random() - 0.5) * 60,
                                (Math.random() - 0.5) * 30,
                                (Math.random() - 0.5) * 30
                            );
                        }
                        break;
                        
                    case 'sparkle':
                        particle.material.opacity = userData.life;
                        particle.scale.setScalar(0.5 * userData.life);
                        break;
                        
                    case 'explosion':
                        particle.material.opacity = userData.life;
                        particle.scale.setScalar(0.3 * userData.life);
                        userData.velocity.y -= 0.002; // Gravity
                        break;
                        
                    case 'trail':
                        particle.material.opacity = userData.life * 0.7;
                        particle.scale.setScalar(0.2 * userData.life);
                        break;
                        
                    case 'jump':
                        particle.material.opacity = userData.life;
                        particle.scale.setScalar(0.15 * userData.life);
                        userData.velocity.y -= 0.001; // Light gravity
                        break;
                        
                    case 'powerup':
                        particle.material.opacity = userData.life;
                        particle.scale.setScalar(0.4 * userData.life);
                        // Spiral motion
                        const spiral = time * 2;
                        userData.velocity.x = Math.cos(spiral) * 0.02;
                        userData.velocity.y = Math.sin(spiral) * 0.02;
                        break;
                }
                
                // Remove dead particles (except ambient)
                if (userData.life <= 0 && userData.type !== 'ambient') {
                    this.returnParticle(particle);
                }
            }
        }
    };
    
    // Auto-initialize when scene is ready
    if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('load', () => {
            const checkForScene = () => {
                if (window.scene) {
                    window.ParticleSystem.init(window.scene);
                } else {
                    setTimeout(checkForScene, 100);
                }
            };
            setTimeout(checkForScene, 1000);
        });
    }
})();