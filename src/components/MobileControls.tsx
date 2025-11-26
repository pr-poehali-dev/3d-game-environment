import { useEffect, useRef, useState } from 'react';

interface MobileControlsProps {
  onJoystickMove: (x: number, y: number) => void;
}

export const MobileControls = ({ onJoystickMove }: MobileControlsProps) => {
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const joystickRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!joystickRef.current) return;
      const touch = e.touches[0];
      const rect = joystickRef.current.getBoundingClientRect();
      
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        e.preventDefault();
        setJoystickActive(true);
        touchStartPos.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!joystickActive) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartPos.current.x;
      const deltaY = touch.clientY - touchStartPos.current.y;
      
      const maxDistance = 50;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      let x = deltaX;
      let y = deltaY;
      
      if (distance > maxDistance) {
        x = (deltaX / distance) * maxDistance;
        y = (deltaY / distance) * maxDistance;
      }
      
      setJoystickPosition({ x, y });
      
      const normalizedX = x / maxDistance;
      const normalizedY = -y / maxDistance;
      
      onJoystickMove(normalizedX, normalizedY);
    };

    const handleTouchEnd = () => {
      setJoystickActive(false);
      setJoystickPosition({ x: 0, y: 0 });
      onJoystickMove(0, 0);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [joystickActive, onJoystickMove]);

  return (
    <div className="absolute bottom-8 left-8 pointer-events-auto z-50">
      <div
        ref={joystickRef}
        className="relative w-32 h-32 bg-[#1A1F2C]/80 rounded-full backdrop-blur-sm border-2 border-white/40 shadow-lg"
      >
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white/30 rounded pointer-events-none" />
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white/30 rounded pointer-events-none" />
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 h-1 w-3 bg-white/30 rounded pointer-events-none" />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 h-1 w-3 bg-white/30 rounded pointer-events-none" />
        
        <div
          className={`absolute top-1/2 left-1/2 w-12 h-12 rounded-full ${
            joystickActive ? 'bg-[#9b87f5]' : 'bg-white/50'
          } shadow-md z-10`}
          style={{
            transform: `translate(calc(-50% + ${joystickPosition.x}px), calc(-50% + ${joystickPosition.y}px))`,
            transition: joystickActive ? 'none' : 'all 0.2s'
          }}
        />
      </div>
    </div>
  );
};