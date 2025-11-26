import { useEffect, useRef } from 'react';

interface GameControlsProps {
  isLocked: boolean;
  setIsLocked: (value: boolean) => void;
  setControls: React.Dispatch<React.SetStateAction<{ forward: boolean; backward: boolean; left: boolean; right: boolean }>>;
  mouseXRef: React.MutableRefObject<number>;
  mouseYRef: React.MutableRefObject<number>;
  rendererRef: React.MutableRefObject<HTMLElement | null>;
  joystickX: number;
  joystickY: number;
}

export const useGameControls = ({
  isLocked,
  setIsLocked,
  setControls,
  mouseXRef,
  mouseYRef,
  rendererRef,
  joystickX,
  joystickY
}: GameControlsProps) => {
  const lastTouchRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isLocked) return;

    const onTouchStart = (event: TouchEvent) => {
      const touches = Array.from(event.touches);
      touches.forEach(touch => {
        const x = touch.clientX;
        if (x > window.innerWidth * 0.5) {
          lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
        }
      });
    };

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      
      const touches = Array.from(event.touches);
      touches.forEach(touch => {
        const x = touch.clientX;
        const y = touch.clientY;
        
        if (x > window.innerWidth * 0.5) {
          const deltaX = x - lastTouchRef.current.x;
          const deltaY = y - lastTouchRef.current.y;
          
          mouseXRef.current += deltaX * 0.003;
          mouseYRef.current += deltaY * 0.003;
          mouseYRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseYRef.current));
          
          lastTouchRef.current = { x, y };
        }
      });
    };

    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, [isLocked, mouseXRef, mouseYRef]);

  useEffect(() => {
    const threshold = 0.05;
    setControls({
      forward: joystickY > threshold,
      backward: joystickY < -threshold,
      left: joystickX < -threshold,
      right: joystickX > threshold
    });
  }, [joystickX, joystickY, setControls]);
};