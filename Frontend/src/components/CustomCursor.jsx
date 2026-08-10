import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './CustomCursor.scss';

const CustomCursor = () => {
    const glowRef = useRef(null);

    useEffect(() => {
        const glow = glowRef.current;
        const setGlowX = gsap.quickSetter(glow, "x", "px");
        const setGlowY = gsap.quickSetter(glow, "y", "px");

        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let glowPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        const onMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener("mousemove", onMouseMove);

        // Buttery smooth sliding interpolation
        const ticker = gsap.ticker.add(() => {
            // The glow slides smoothly towards the mouse
            glowPos.x += (mouse.x - glowPos.x) * 0.15;
            glowPos.y += (mouse.y - glowPos.y) * 0.15;
            
            setGlowX(glowPos.x);
            setGlowY(glowPos.y);
        });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            gsap.ticker.remove(ticker);
        };
    }, []);

    return (
        <div className="custom-cursor-container">
            <div ref={glowRef} className="cursor-simple-glow"></div>
        </div>
    );
};

export default CustomCursor;
