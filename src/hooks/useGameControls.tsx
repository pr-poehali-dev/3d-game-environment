import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GameControlsProps {
  isLocked: boolean;
  setIsLocked: (value: boolean) => void;
  setControls: React.Dispatch<React.SetStateAction<{ forward: boolean; backward: boolean; left: boolean; right: boolean }>>;
  setSelectedObject: (value: string | null) => void;
  mouseXRef: React.MutableRefObject<number>;
  mouseYRef: React.MutableRefObject<number>;
  rendererRef: React.MutableRefObject<HTMLElement | null>;
  scene: THREE.Scene | null;
  camera: THREE.Camera | null;
  isMobile: boolean;
  joystickX: number;
  joystickY: number;
}

export const useGameControls = ({
  isLocked,
  setIsLocked,
  setControls,
  setSelectedObject,
  mouseXRef,
  mouseYRef,
  rendererRef,
  scene,
  camera,
  isMobile,
  joystickX,
  joystickY
}: GameControlsProps) => {
  const touchStartRef = useRef({ x: 0, y: 0 });
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const cameraSwipeAreaRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!rendererRef.current) return;

    const onMouseMove = (event: MouseEvent) => {
      if (isLocked) {
        mouseXRef.current += event.movementX * 0.002;
        mouseYRef.current += event.movementY * 0.002;
        mouseYRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseYRef.current));
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW': setControls(prev => ({ ...prev, forward: true })); break;
        case 'KeyS': setControls(prev => ({ ...prev, backward: true })); break;
        case 'KeyA': setControls(prev => ({ ...prev, left: true })); break;
        case 'KeyD': setControls(prev => ({ ...prev, right: true })); break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW': setControls(prev => ({ ...prev, forward: false })); break;
        case 'KeyS': setControls(prev => ({ ...prev, backward: false })); break;
        case 'KeyA': setControls(prev => ({ ...prev, left: false })); break;
        case 'KeyD': setControls(prev => ({ ...prev, right: false })); break;
      }
    };

    const onClick = (event: MouseEvent) => {
      if (!scene || !camera) return;
      
      if (!isLocked) {
        if (!isMobile) {
          rendererRef.current?.requestPointerLock();
        }
        setIsLocked(true);
        return;
      }

      if (!isMobile) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0 && intersects[0].object.userData.name) {
          setSelectedObject(intersects[0].object.userData.name);
        }
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        
        if (x > window.innerWidth * 0.6) {
          cameraSwipeAreaRef.current = { x, y };
        }
        
        touchStartRef.current = { x, y };
        lastTouchRef.current = { x, y };
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 1 && isLocked && isMobile) {
        const touch = event.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        
        if (x > window.innerWidth * 0.6) {
          const deltaX = x - lastTouchRef.current.x;
          const deltaY = y - lastTouchRef.current.y;
          
          mouseXRef.current += deltaX * 0.005;
          mouseYRef.current += deltaY * 0.005;
          mouseYRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseYRef.current));
        }
        
        lastTouchRef.current = { x, y };
      }
    };

    const onPointerLockChange = () => {
      setIsLocked(document.pointerLockElement === rendererRef.current);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    rendererRef.current.addEventListener('click', onClick);
    rendererRef.current.addEventListener('touchstart', onTouchStart, { passive: true });
    rendererRef.current.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      if (rendererRef.current) {
        rendererRef.current.removeEventListener('click', onClick);
        rendererRef.current.removeEventListener('touchstart', onTouchStart);
        rendererRef.current.removeEventListener('touchmove', onTouchMove);
      }
    };
  }, [isLocked, setIsLocked, setControls, setSelectedObject, mouseXRef, mouseYRef, rendererRef, scene, camera, isMobile]);

  useEffect(() => {
    if (isMobile && isLocked) {
      const threshold = 0.1;
      setControls({
        forward: joystickY > threshold,
        backward: joystickY < -threshold,
        left: joystickX < -threshold,
        right: joystickX > threshold
      });
    }
  }, [joystickX, joystickY, isMobile, isLocked, setControls]);
};