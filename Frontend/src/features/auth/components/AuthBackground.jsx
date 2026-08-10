import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AuthBackground = () => {
    const container = useRef();

    useGSAP(() => {
        // Create a stunning slow-moving floating effect for the orbs
        gsap.to('.ambient-orb', {
            y: "random(-50, 50)",
            x: "random(-50, 50)",
            scale: "random(0.8, 1.2)",
            duration: "random(5, 10)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: {
                each: 0.5,
                from: "random"
            }
        });
    }, { scope: container });

    return (
        <div ref={container} style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            zIndex: 0, overflow: 'hidden', background: '#0a0a0a' 
        }}>
            {/* Glowing Orbs - MUCH BRIGHTER */}
            <div className="ambient-orb" style={{
                position: 'absolute', top: '10%', left: '20%', width: '40vw', height: '40vw',
                background: 'radial-gradient(circle, rgba(255, 30, 86, 0.4) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(50px)'
            }}></div>
            
            <div className="ambient-orb" style={{
                position: 'absolute', bottom: '10%', right: '10%', width: '35vw', height: '35vw',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(50px)'
            }}></div>

            <div className="ambient-orb" style={{
                position: 'absolute', top: '40%', left: '50%', width: '25vw', height: '25vw',
                background: 'radial-gradient(circle, rgba(255, 30, 86, 0.25) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(30px)', transform: 'translate(-50%, -50%)'
            }}></div>
            
            {/* Overlay grid to give it a tech/premium feel */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `
                    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                zIndex: 1,
                pointerEvents: 'none'
            }}></div>
        </div>
    );
};

export default AuthBackground;
