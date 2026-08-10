import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const AuthBackground = () => {
    const bgContainer = useRef(null);
    const logoRef = useRef(null);

    useEffect(() => {
        // Vibrant floating, pulsing, and glowing animation for the background logo
        gsap.to(logoRef.current, {
            y: -30,
            scale: 1.1,
            filter: 'drop-shadow(0px 0px 40px rgba(0, 210, 255, 0.8))',
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Very slow rotation for the gradient background
        gsap.to('.animated-gradient-bg', {
            backgroundPosition: "200% center",
            duration: 15,
            repeat: -1,
            ease: "linear"
        });
    }, []);

    return (
        <div ref={bgContainer} style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            zIndex: 0, overflow: 'hidden', backgroundColor: '#050505'
        }}>
            {/* Full animated gradient background - Made much brighter! */}
            <div className="animated-gradient-bg" style={{
                position: 'absolute', top: 0, left: 0, width: '200%', height: '200%',
                background: 'linear-gradient(270deg, #050505, rgba(255, 30, 86, 0.15), #050505, rgba(0, 210, 255, 0.15), #050505)',
                backgroundSize: '400% 400%',
                zIndex: 1,
                transform: 'translate(-25%, -25%)'
            }}></div>
            
            {/* Tech Overlay Grid */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `
                    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                zIndex: 2,
                pointerEvents: 'none'
            }}></div>

            {/* Dark overlay to blend the grid into the edges */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'radial-gradient(circle at center, transparent 0%, #050505 100%)',
                zIndex: 3,
                pointerEvents: 'none'
            }}></div>

            {/* Massive Logo Watermark - Brought to front and made highly visible! */}
            <img 
                ref={logoRef}
                src="/logo.png" 
                alt="Background Logo" 
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70vh', // Large size to fill background
                    height: 'auto',
                    opacity: 1, // Full opacity!
                    zIndex: 10, // Bring it to the absolute front behind the card
                    pointerEvents: 'none',
                    userSelect: 'none',
                    filter: 'drop-shadow(0px 0px 20px rgba(255, 30, 86, 0.5))'
                }} 
            />
        </div>
    );
};

export default AuthBackground;
