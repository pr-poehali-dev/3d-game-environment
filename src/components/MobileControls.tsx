import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

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
    <>
      <div className="absolute bottom-6 left-6 pointer-events-auto z-50">
        <div
          ref={joystickRef}
          className="relative w-36 h-36 bg-[#1A1F2C]/90 rounded-full backdrop-blur-md border-4 border-[#9b87f5]/50 shadow-2xl"
        >
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/5 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1.5 h-4 bg-white/40 rounded pointer-events-none" />
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-1.5 h-4 bg-white/40 rounded pointer-events-none" />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-1.5 w-4 bg-white/40 rounded pointer-events-none" />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 h-1.5 w-4 bg-white/40 rounded pointer-events-none" />
          
          <div
            className={`absolute top-1/2 left-1/2 w-14 h-14 rounded-full ${
              joystickActive ? 'bg-[#9b87f5] shadow-lg shadow-[#9b87f5]/50' : 'bg-white/60'
            } z-10 border-2 border-white/20`}
            style={{
              transform: `translate(calc(-50% + ${joystickPosition.x}px), calc(-50% + ${joystickPosition.y}px))`,
              transition: joystickActive ? 'none' : 'all 0.2s'
            }}
          >
            {joystickActive && (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" />
            )}
          </div>
        </div>
        
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="bg-[#1A1F2C]/80 px-2 py-1 rounded text-xs text-white border border-[#9b87f5]/50">
            Движение
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 pointer-events-none z-40">
        <div className="relative w-32 h-32 border-4 border-dashed border-[#9b87f5]/40 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-[#1A1F2C]/30 to-[#9b87f5]/10">
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-1">
            <Icon name="Hand" size={28} className="text-white/50" />
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-white/30"></div>
              <div className="w-1 h-1 rounded-full bg-white/30"></div>
              <div className="w-1 h-1 rounded-full bg-white/30"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="bg-[#1A1F2C]/80 px-2 py-1 rounded text-xs text-white border border-[#9b87f5]/50">
            Осмотр
          </div>
        </div>
      </div>
    </>
  );
};