import { useEffect, useRef, useState } from 'react';

const mousePos = { x: -100, y: -100 };
const orbPos = { x: -100, y: -100 };
let animationId = null;
let isEnabledGlobal = true;

export const useOrbCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isEnabled, setIsEnabled] = useState(isEnabledGlobal);
  const isHoveringRef = useRef(isHovering);
  
  useEffect(() => { isHoveringRef.current = isHovering; }, [isHovering]);
  useEffect(() => { isEnabledGlobal = isEnabled; }, [isEnabled]);

  const lerp = (start, end, f) => start + (end - start) * 0.35;

  useEffect(() => {
    if (!animationId) {
      const animate = () => {
        try {
          if (!isEnabledGlobal) {
            document.body.style.cursor = 'auto';
            animationId = requestAnimationFrame(animate);
            return;
          }
          
          const orb = document.getElementById('zamani-orb');
          if (!orb) {
            document.body.style.cursor = 'auto';
            animationId = requestAnimationFrame(animate);
            return;
          }

          document.body.style.cursor = 'none';
          orbPos.x = lerp(orbPos.x, mousePos.x, 0.35);
          orbPos.y = lerp(orbPos.y, mousePos.y, 0.35);

          orb.style.transform = `translate(${orbPos.x}px, ${orbPos.y}px) scale(${isHoveringRef.current ? 1.8 : 1})`;
          orb.style.opacity = '1';
        } catch (err) {
          console.error('Orb crash:', err);
          document.body.style.cursor = 'auto';
        }
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setIsEnabled(prev => {
          const next = !prev;
          isEnabledGlobal = next;
          return next;
        });
      }
    };
    
    const updateMouse = (e) => { mousePos.x = e.clientX; mousePos.y = e.clientY; };
    const checkHover = (e) => setIsHovering(!!e.target.closest('button, a, input, select, .clickable'));

    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousemove', updateMouse);
    window.addEventListener('mouseover', checkHover);
    window.addEventListener('mouseout', checkHover);

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousemove', updateMouse);
      window.removeEventListener('mouseover', checkHover);
      window.removeEventListener('mouseout', checkHover);
    };
  }, []);

  return { isEnabled };
};