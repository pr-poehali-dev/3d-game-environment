import { useEffect, useRef, useState } from 'react';
import { useGameScene } from '@/hooks/useGameScene';
import { useGameControls } from '@/hooks/useGameControls';
import { GameUI } from '@/components/GameUI';
import { MobileControls } from '@/components/MobileControls';

const Index = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLElement | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [controls, setControls] = useState({ forward: false, backward: false, left: false, right: false });
  const [isMobile] = useState(true);
  const [gameTime, setGameTime] = useState({ hours: 9, minutes: 0 });
  const [money, setMoney] = useState(0);
  const [joystickX, setJoystickX] = useState(0);
  const [joystickY, setJoystickY] = useState(0);
  
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);

  useEffect(() => {
    if (mountRef.current) {
      const canvas = mountRef.current.querySelector('canvas');
      if (canvas) {
        canvasRef.current = canvas as HTMLElement;
      }
    }
  }, []);

  const { scene, camera } = useGameScene({
    mountRef,
    isLocked,
    controls,
    mouseXRef,
    mouseYRef,
    gameTime,
    setGameTime,
    setMoney
  });

  useGameControls({
    isLocked,
    setIsLocked,
    setControls,
    mouseXRef,
    mouseYRef,
    rendererRef: canvasRef,
    joystickX,
    joystickY
  });

  const handleJoystickMove = (x: number, y: number) => {
    setJoystickX(x);
    setJoystickY(y);
  };

  const handleStartGame = () => {
    setIsLocked(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      
      <GameUI 
        isLocked={isLocked}
        gameTime={gameTime}
        money={money}
        onStartGame={handleStartGame}
      />

      {isLocked && (
        <MobileControls onJoystickMove={handleJoystickMove} />
      )}
    </div>
  );
};

export default Index;