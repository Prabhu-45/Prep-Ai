import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const AuroraBackground = () => {
    const containerRef = useRef(null);
    const aurora1 = useRef(null);
    const aurora2 = useRef(null);
    const aurora3 = useRef(null);

    useEffect(() => {
        // Set initial centered state so GSAP doesn't override it with x/y
        gsap.set([aurora1.current, aurora2.current, aurora3.current], {
            xPercent: -50,
            yPercent: -50
        });

        // Fluid, organic movement for Aurora 1 (Pink)
        gsap.to(aurora1.current, {
            x: 'random(-20vw, 20vw)',
            y: 'random(-20vh, 20vh)',
            scale: 'random(0.8, 1.5)',
            rotation: 'random(-45, 45)',
            duration: 'random(15, 25)',
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });

        // Fluid, organic movement for Aurora 2 (Cyan)
        gsap.to(aurora2.current, {
            x: 'random(-30vw, 30vw)',
            y: 'random(-30vh, 30vh)',
            scale: 'random(0.8, 1.5)',
            rotation: 'random(-90, 90)',
            duration: 'random(15, 25)',
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: -5
        });

        // Fluid, organic movement for Aurora 3 (Violet)
        gsap.to(aurora3.current, {
            x: 'random(-25vw, 25vw)',
            y: 'random(-25vh, 25vh)',
            scale: 'random(0.8, 1.3)',
            rotation: 'random(-60, 60)',
            duration: 'random(15, 25)',
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: -10
        });
    }, []);

    return (
        <div ref={containerRef} style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: -1, overflow: 'hidden', backgroundColor: '#030303'
        }}>
            {/* Base Aurora Glows */}
            <div ref={aurora1} style={{
                position: 'absolute', top: '20%', left: '30%', width: '60vw', height: '60vh',
                background: 'radial-gradient(circle, rgba(255, 30, 86, 0.4) 0%, transparent 60%)',
                filter: 'blur(100px)', opacity: 0.8
            }}></div>
            
            <div ref={aurora2} style={{
                position: 'absolute', bottom: '20%', right: '20%', width: '50vw', height: '50vh',
                background: 'radial-gradient(circle, rgba(0, 210, 255, 0.4) 0%, transparent 60%)',
                filter: 'blur(100px)', opacity: 0.8
            }}></div>

            <div ref={aurora3} style={{
                position: 'absolute', top: '50%', left: '50%', width: '70vw', height: '40vh',
                background: 'radial-gradient(circle, rgba(138, 43, 226, 0.3) 0%, transparent 60%)',
                filter: 'blur(120px)', opacity: 0.7
            }}></div>

            {/* Stunning Glass/Noise Overlay to give it a premium physical texture */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
                opacity: 0.04,
                mixBlendMode: 'overlay',
                pointerEvents: 'none',
                zIndex: 2
            }}></div>

            {/* Micro Tech Grid Overlay */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `
                    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                zIndex: 3,
                pointerEvents: 'none'
            }}></div>
        </div>
    );
};

export default AuroraBackground;
