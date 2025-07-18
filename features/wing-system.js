(function() {
    'use strict';
    
    if (typeof window.gameState === 'undefined') return;
    
    window.WingSystem = {
        initialized: false,
        leftWing: null,
        rightWing: null,
        martianMesh: null,
        isFlapping: false,
        flapSpeed: 0.1,
        wingSpread: 0.8,
        
        init: function(martianMesh) {
            if (this.initialized) return;
            
            this.martianMesh = martianMesh;
            this.createWings();
            this.initialized = true;
        },
        
        createWings: function() {
            // Left wing
            const leftWingGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
            const leftWingMaterial = new THREE.MeshPhongMaterial({
                color: 0x00aaff,
                transparent: true,
                opacity: 0.7,
                emissive: 0x002244,
                shininess: 100
            });
            
            this.leftWing = new THREE.Mesh(leftWingGeometry, leftWingMaterial);
            this.leftWing.position.set(-0.5, 0, 0);
            this.leftWing.rotation.z = Math.PI / 2;
            this.leftWing.rotation.x = Math.PI / 4;
            this.leftWing.visible = false;
            
            // Right wing
            const rightWingGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
            const rightWingMaterial = new THREE.MeshPhongMaterial({
                color: 0x00aaff,
                transparent: true,
                opacity: 0.7,
                emissive: 0x002244,
                shininess: 100
            });
            
            this.rightWing = new THREE.Mesh(rightWingGeometry, rightWingMaterial);
            this.rightWing.position.set(0.5, 0, 0);
            this.rightWing.rotation.z = -Math.PI / 2;
            this.rightWing.rotation.x = Math.PI / 4;
            this.rightWing.visible = false;
            
            // Add wings to martian
            this.martianMesh.add(this.leftWing);
            this.martianMesh.add(this.rightWing);
            
            // Create wing particle trails
            this.createWingTrails();
        },
        
        createWingTrails: function() {
            // Wing trail particles
            const trailGeometry = new THREE.BufferGeometry();
            const trailCount = 20;
            const positions = new Float32Array(trailCount * 3);
            const colors = new Float32Array(trailCount * 3);
            
            for (let i = 0; i < trailCount; i++) {
                const i3 = i * 3;
                positions[i3] = 0;
                positions[i3 + 1] = 0;
                positions[i3 + 2] = 0;
                
                colors[i3] = 0;
                colors[i3 + 1] = 0.7;
                colors[i3 + 2] = 1;
            }
            
            trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            trailGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const trailMaterial = new THREE.PointsMaterial({
                size: 0.1,
                transparent: true,
                opacity: 0.6,
                vertexColors: true,
                blending: THREE.AdditiveBlending
            });
            
            this.wingTrail = new THREE.Points(trailGeometry, trailMaterial);
            this.wingTrail.visible = false;
            this.martianMesh.add(this.wingTrail);
        },
        
        onDashStart: function() {
            if (!this.initialized) return;
            
            // Show wings
            this.leftWing.visible = true;
            this.rightWing.visible = true;
            this.wingTrail.visible = true;
            this.isFlapping = true;
            
            // Wing spread animation
            this.leftWing.rotation.y = -this.wingSpread;
            this.rightWing.rotation.y = this.wingSpread;
            
            // Bright flash effect
            this.leftWing.material.emissive.setHex(0x0066ff);
            this.rightWing.material.emissive.setHex(0x0066ff);
            
            // Create dash particles
            this.createDashParticles();
        },
        
        onDashEnd: function() {
            if (!this.initialized) return;
            
            this.isFlapping = false;
            
            // Fade out wings
            setTimeout(() => {
                if (this.leftWing) this.leftWing.visible = false;
                if (this.rightWing) this.rightWing.visible = false;
                if (this.wingTrail) this.wingTrail.visible = false;
            }, 500);
            
            // Reset emissive
            this.leftWing.material.emissive.setHex(0x002244);
            this.rightWing.material.emissive.setHex(0x002244);
        },
        
        createDashParticles: function() {
            const particleCount = 15;
            const particles = [];
            
            for (let i = 0; i < particleCount; i++) {
                const particle = new THREE.Mesh(
                    new THREE.SphereGeometry(0.05, 8, 8),
                    new THREE.MeshBasicMaterial({
                        color: 0x00ffff,
                        transparent: true,
                        opacity: 0.8
                    })
                );
                
                const angle = (i / particleCount) * Math.PI * 2;
                particle.position.set(
                    Math.cos(angle) * 0.8,
                    Math.sin(angle) * 0.8,
                    (Math.random() - 0.5) * 0.4
                );
                
                particle.velocity = {
                    x: Math.cos(angle) * 0.1,
                    y: Math.sin(angle) * 0.1,
                    z: (Math.random() - 0.5) * 0.1
                };
                
                this.martianMesh.add(particle);
                particles.push(particle);
            }
            
            // Animate particles
            const animateParticles = () => {
                particles.forEach((particle, index) => {
                    particle.position.x += particle.velocity.x;
                    particle.position.y += particle.velocity.y;
                    particle.position.z += particle.velocity.z;
                    
                    particle.material.opacity -= 0.05;
                    
                    if (particle.material.opacity <= 0) {
                        this.martianMesh.remove(particle);
                        particles.splice(index, 1);
                    }
                });
                
                if (particles.length > 0) {
                    requestAnimationFrame(animateParticles);
                }
            };
            
            animateParticles();
        },
        
        update: function(deltaTime) {
            if (!this.initialized || !this.isFlapping) return;
            
            const time = Date.now() * 0.01;
            
            // Wing flapping animation
            const flapAngle = Math.sin(time * this.flapSpeed) * 0.3;
            this.leftWing.rotation.z = Math.PI / 2 + flapAngle;
            this.rightWing.rotation.z = -Math.PI / 2 - flapAngle;
            
            // Wing glow pulsing
            const glow = 0.5 + Math.sin(time * 0.05) * 0.3;
            this.leftWing.material.emissive.setScalar(glow * 0.2);
            this.rightWing.material.emissive.setScalar(glow * 0.2);
            
            // Update wing trail
            this.updateWingTrail();
        },
        
        updateWingTrail: function() {
            if (!this.wingTrail) return;
            
            const positions = this.wingTrail.geometry.attributes.position.array;
            const colors = this.wingTrail.geometry.attributes.color.array;
            
            // Shift trail positions
            for (let i = positions.length - 3; i >= 3; i -= 3) {
                positions[i] = positions[i - 3];
                positions[i + 1] = positions[i - 2];
                positions[i + 2] = positions[i - 1];
            }
            
            // Add new trail point
            positions[0] = 0;
            positions[1] = 0;
            positions[2] = 0;
            
            // Update colors (fade out)
            for (let i = 0; i < colors.length; i += 3) {
                colors[i + 2] *= 0.95; // Fade blue
                colors[i + 1] *= 0.95; // Fade green
            }
            
            this.wingTrail.geometry.attributes.position.needsUpdate = true;
            this.wingTrail.geometry.attributes.color.needsUpdate = true;
        }
    };
    
    // Auto-initialize when martian exists
    if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('load', () => {
            const checkForMartian = () => {
                if (window.martian) {
                    window.WingSystem.init(window.martian);
                } else {
                    setTimeout(checkForMartian, 100);
                }
            };
            setTimeout(checkForMartian, 1000);
        });
    }
})();