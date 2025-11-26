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
  camera
}: GameControlsProps) => {
  const touchStartRef = useRef({ x: 0, y: 0 });
  const lastTouchRef = useRef({ x: 0, y: 0 });

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
        rendererRef.current?.requestPointerLock();
        setIsLocked(true);
        return;
      }

      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0 && intersects[0].object.userData.name) {
        setSelectedObject(intersects[0].object.userData.name);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        touchStartRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        lastTouchRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 1 && isLocked) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - lastTouchRef.current.x;
        const deltaY = touch.clientY - lastTouchRef.current.y;
        
        mouseXRef.current += deltaX * 0.003;
        mouseYRef.current += deltaY * 0.003;
        mouseYRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseYRef.current));
        
        lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
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
  }, [isLocked, setIsLocked, setControls, setSelectedObject, mouseXRef, mouseYRef, rendererRef, scene, camera]);
};