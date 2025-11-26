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
    if (!rendererRef.current) return;

    const onClick = () => {
      if (!isLocked) {
        setIsLocked(true);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 1 && isLocked) {
        const touch = event.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        
        if (x > window.innerWidth * 0.4) {
          const deltaX = x - lastTouchRef.current.x;
          const deltaY = y - lastTouchRef.current.y;
          
          mouseXRef.current += deltaX * 0.008;
          mouseYRef.current += deltaY * 0.008;
          mouseYRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseYRef.current));
        }
        
        lastTouchRef.current = { x, y };
      }
    };

    rendererRef.current.addEventListener('click', onClick);
    rendererRef.current.addEventListener('touchstart', onTouchStart, { passive: true });
    rendererRef.current.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      if (rendererRef.current) {
        rendererRef.current.removeEventListener('click', onClick);
        rendererRef.current.removeEventListener('touchstart', onTouchStart);
        rendererRef.current.removeEventListener('touchmove', onTouchMove);
      }
    };
  }, [isLocked, setIsLocked, mouseXRef, mouseYRef, rendererRef]);

  useEffect(() => {
    if (isLocked) {
      const threshold = 0.1;
      setControls({
        forward: joystickY > threshold,
        backward: joystickY < -threshold,
        left: joystickX < -threshold,
        right: joystickX > threshold
      });
    }
  }, [joystickX, joystickY, isLocked, setControls]);
};