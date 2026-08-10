import React, { useEffect, useRef } from 'react';

const NetworkBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        canvas.width = width;
        canvas.height = height;

        const particles = [];
        const particleCount = Math.min(Math.floor(width * height / 12000), 100); // Responsive particle count
        
        const mouse = {
            x: width / 2,
            y: height / 2,
            radius: 150
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.radius = Math.random() * 2 + 1;
                this.baseColor = Math.random() > 0.5 ? '0, 210, 255' : '255, 30, 86'; // Cyan or Pink
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.baseColor}, 0.8)`;
                ctx.fill();
            }

            update() {
                if (this.x > width || this.x < 0) this.vx = -this.vx;
                if (this.y > height || this.y < 0) this.vy = -this.vy;

                this.x += this.vx;
                this.y += this.vy;

                // Mouse interactivity
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= forceDirectionX * force * 2;
                    this.y -= forceDirectionY * force * 2;
                }

                this.draw();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const connect = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = dx * dx + dy * dy;

                    // If particles are close, draw a line
                    if (distance < 20000) {
                        const opacity = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(150, 150, 150, ${opacity * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
            
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            zIndex: 0, overflow: 'hidden', backgroundColor: '#050505'
        }}>
            {/* Background subtle glowing radial gradient */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', width: '150vw', height: '150vw',
                background: 'radial-gradient(circle, rgba(0, 210, 255, 0.03) 0%, transparent 60%)',
                transform: 'translate(-50%, -50%)', pointerEvents: 'none'
            }}></div>

            <canvas 
                ref={canvasRef} 
                style={{ 
                    display: 'block', 
                    width: '100%', 
                    height: '100%',
                    position: 'absolute',
                    top: 0, left: 0
                }}
            />

            {/* Premium Vignette Overlay */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'radial-gradient(circle at center, transparent 30%, #050505 100%)',
                pointerEvents: 'none',
                zIndex: 2
            }}></div>
        </div>
    );
};

export default NetworkBackground;
