import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [controls, setControls] = useState({ forward: false, backward: false, left: false, right: false });
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const lastTouchRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd3d3d3);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const ceilingLight1 = new THREE.PointLight(0xffffff, 1, 10);
    ceilingLight1.position.set(-2, 2.8, 0);
    ceilingLight1.castShadow = true;
    scene.add(ceilingLight1);

    const ceilingLight2 = new THREE.PointLight(0xffffff, 1, 10);
    ceilingLight2.position.set(2, 2.8, 0);
    ceilingLight2.castShadow = true;
    scene.add(ceilingLight2);

    const floorGeometry = new THREE.PlaneGeometry(12, 10);
    const floorTexture = new THREE.TextureLoader().load('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZjVmNWY1Ij48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIvPjwvZz48ZyBmaWxsPSIjZGRkZGRkIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIyMDAiLz48cmVjdCB5PSIwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEiLz48L2c+PC9zdmc+');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(6, 5);
    const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.userData = { name: 'Плитка пола' };
    scene.add(floor);

    const ceilingGeometry = new THREE.PlaneGeometry(12, 10);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf0f0f0,
      side: THREE.DoubleSide 
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.y = 3;
    ceiling.rotation.x = Math.PI / 2;
    ceiling.userData = { name: 'Потолок с освещением' };
    scene.add(ceiling);

    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x2d2d3d });
    
    const backWallGeometry = new THREE.BoxGeometry(12, 3, 0.2);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 1.5, -5);
    backWall.receiveShadow = true;
    backWall.userData = { name: 'Стена сзади' };
    scene.add(backWall);

    const leftWallGeometry = new THREE.BoxGeometry(0.2, 3, 10);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-6, 1.5, 0);
    leftWall.receiveShadow = true;
    leftWall.userData = { name: 'Стол (стенка слева)' };
    scene.add(leftWall);

    const rightWallGeometry = new THREE.BoxGeometry(0.2, 3, 10);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(6, 1.5, 0);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    const receptionDeskGeometry = new THREE.BoxGeometry(3, 1.2, 1.5);
    const receptionDeskMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
    const receptionDesk = new THREE.Mesh(receptionDeskGeometry, receptionDeskMaterial);
    receptionDesk.position.set(0, 0.6, -3);
    receptionDesk.castShadow = true;
    receptionDesk.userData = { name: 'Reception' };
    scene.add(receptionDesk);

    const ozonTextGeometry = new THREE.BoxGeometry(1.5, 0.4, 0.1);
    const ozonTextMaterial = new THREE.MeshStandardMaterial({ color: 0x0066ff });
    const ozonText = new THREE.Mesh(ozonTextGeometry, ozonTextMaterial);
    ozonText.position.set(0, 1.8, -4.9);
    ozonText.userData = { name: 'OZON надпись' };
    scene.add(ozonText);

    const chairGeometry = new THREE.BoxGeometry(0.6, 0.5, 0.6);
    const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x4169e1 });
    const chair = new THREE.Mesh(chairGeometry, chairMaterial);
    chair.position.set(-1, 0.25, -2.5);
    chair.castShadow = true;
    chair.userData = { name: 'Кресло-трудяги' };
    scene.add(chair);

    const infoStandGeometry = new THREE.BoxGeometry(0.3, 2, 0.8);
    const infoStandMaterial = new THREE.MeshStandardMaterial({ color: 0x90ee90 });
    const infoStand = new THREE.Mesh(infoStandGeometry, infoStandMaterial);
    infoStand.position.set(4, 1, -1);
    infoStand.castShadow = true;
    infoStand.userData = { name: 'ПримМолк (информ. стойка)' };
    scene.add(infoStand);

    const posterGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.05);
    const posterMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    const poster = new THREE.Mesh(posterGeometry, posterMaterial);
    poster.position.set(5.9, 1.5, 2);
    poster.userData = { name: 'Плакат на стене' };
    scene.add(poster);

    const securityGateMaterial = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });
    
    const leftGatePost1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.3, 0.15), securityGateMaterial);
    leftGatePost1.position.set(3.5, 1.15, 3);
    leftGatePost1.castShadow = true;
    leftGatePost1.userData = { name: 'Турникет (левая стойка 1)' };
    scene.add(leftGatePost1);

    const leftGatePost2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.3, 0.4), securityGateMaterial);
    leftGatePost2.position.set(3.25, 1.15, 3);
    leftGatePost2.castShadow = true;
    scene.add(leftGatePost2);

    const rightGatePost1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.3, 0.15), securityGateMaterial);
    rightGatePost1.position.set(-3.5, 1.15, 3);
    rightGatePost1.castShadow = true;
    rightGatePost1.userData = { name: 'Турникет (правая стойка 1)' };
    scene.add(rightGatePost1);

    const rightGatePost2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.3, 0.4), securityGateMaterial);
    rightGatePost2.position.set(-3.25, 1.15, 3);
    rightGatePost2.castShadow = true;
    scene.add(rightGatePost2);

    const textureLoader = new THREE.TextureLoader();
    const entranceSignMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const entranceSign = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.05), entranceSignMaterial);
    entranceSign.position.set(0, 1.8, 3.5);
    entranceSign.userData = { name: 'Примерочная (надпись)' };
    scene.add(entranceSign);

    const exitArrowGeometry = new THREE.ConeGeometry(0.15, 0.4, 3);
    const exitArrowMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const exitArrow = new THREE.Mesh(exitArrowGeometry, exitArrowMaterial);
    exitArrow.position.set(5, 1.6, 3.5);
    exitArrow.rotation.z = -Math.PI / 2;
    exitArrow.userData = { name: 'Стрелка выхода' };
    scene.add(exitArrow);

    const bluePosterTexture = textureLoader.load('https://cdn.poehali.dev/files/12ecfb23-88b7-4cb7-9acd-0b2c5fca274c.jpeg');
    const bluePosterMaterial = new THREE.MeshStandardMaterial({ map: bluePosterTexture });
    const bluePoster = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.05), bluePosterMaterial);
    bluePoster.position.set(-5.9, 1.5, 2);
    bluePoster.userData = { name: 'Синий плакат OZON' };
    scene.add(bluePoster);

    const wallPosterMaterial = new THREE.MeshStandardMaterial({ color: 0x005aff });
    const wallPoster = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 0.05), wallPosterMaterial);
    wallPoster.position.set(-5.9, 1.5, -2);
    wallPoster.userData = { name: 'Синяя табличка на стене' };
    scene.add(wallPoster);

    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const moveSpeed = 5;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      if (isLocked) {
        mouseX += event.movementX * 0.002;
        mouseY += event.movementY * 0.002;
        mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseY));
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
        
        mouseX += deltaX * 0.003;
        mouseY += deltaY * 0.003;
        mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseY));
        
        lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: true });

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      camera.rotation.order = 'YXZ';
      camera.rotation.y = -mouseX;
      camera.rotation.x = -mouseY;

      direction.z = Number(controls.forward) - Number(controls.backward);
      direction.x = Number(controls.right) - Number(controls.left);
      direction.normalize();

      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(camera.quaternion);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3(1, 0, 0);
      right.applyQuaternion(camera.quaternion);
      right.y = 0;
      right.normalize();

      velocity.set(0, 0, 0);
      if (direction.z !== 0) velocity.add(forward.multiplyScalar(direction.z));
      if (direction.x !== 0) velocity.add(right.multiplyScalar(direction.x));
      
      camera.position.add(velocity.multiplyScalar(moveSpeed * delta));
      camera.position.y = 1.6;
      camera.position.x = Math.max(-5.5, Math.min(5.5, camera.position.x));
      camera.position.z = Math.max(-4.5, Math.min(4.5, camera.position.z));

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [isLocked, controls]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  const handleLockPointer = () => {
    if (!isLocked) {
      if (!isMobile) {
        document.body.requestPointerLock();
      }
      setIsLocked(true);
    }
  };

  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsLocked(document.pointerLockElement === document.body);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      
      {!isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="p-8 max-w-md space-y-4 bg-[#1A1F2C] border-[#9b87f5]">
            <h1 className="text-3xl font-bold text-white text-center">3D Офис OZON</h1>
            <div className="space-y-2 text-gray-300">
              {isMobile ? (
                <>
                  <div className="flex items-center gap-2">
                    <Icon name="Hand" size={20} className="text-[#9b87f5]" />
                    <span>Свайп - осмотр</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Gamepad2" size={20} className="text-[#9b87f5]" />
                    <span>Джойстик - движение</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Icon name="Move" size={20} className="text-[#9b87f5]" />
                    <span>WASD - движение</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="MousePointer2" size={20} className="text-[#9b87f5]" />
                    <span>Мышь - осмотр</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Hand" size={20} className="text-[#9b87f5]" />
                    <span>Клик - взаимодействие</span>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={handleLockPointer}
              className="w-full px-6 py-3 bg-[#9b87f5] hover:bg-[#7E69AB] text-white rounded-lg font-semibold transition-colors"
            >
              Начать игру
            </button>
          </Card>
        </div>
      )}

      {isLocked && (
        <div className="absolute top-4 left-4 space-y-2">
          <Card className="p-4 bg-[#1A1F2C]/90 border-[#9b87f5]">
            <div className="text-white text-sm space-y-1">
              <div className="flex items-center gap-2">
                <Icon name="Navigation" size={16} className="text-[#9b87f5]" />
                <span>WASD - движение</span>
              </div>
              <div className="text-gray-400 text-xs">ESC - выход</div>
            </div>
          </Card>
        </div>
      )}

      {selectedObject && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Card className="p-4 bg-[#1A1F2C]/95 border-[#9b87f5] min-w-[200px]">
            <div className="text-center">
              <h3 className="text-[#9b87f5] font-semibold mb-1">{selectedObject}</h3>
              <button
                onClick={() => setSelectedObject(null)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Закрыть
              </button>
            </div>
          </Card>
        </div>
      )}

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
      </div>

      {isMobile && isLocked && (
        <div className="absolute bottom-8 left-8 flex flex-col gap-4">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full border-4 border-[#9b87f5]/30 bg-[#1A1F2C]/50" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 rounded-full bg-[#9b87f5]/70 touch-none" 
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  const rect = e.currentTarget.getBoundingClientRect();
                  const centerX = rect.left + rect.width / 2;
                  const centerY = rect.top + rect.height / 2;
                  const deltaX = touch.clientX - centerX;
                  const deltaY = touch.clientY - centerY;
                  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                  const maxDistance = 32;
                  const normalizedDistance = Math.min(distance, maxDistance) / maxDistance;
                  
                  if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    if (deltaY < 0) {
                      setControls(prev => ({ ...prev, forward: true }));
                    } else {
                      setControls(prev => ({ ...prev, backward: true }));
                    }
                  } else {
                    if (deltaX < 0) {
                      setControls(prev => ({ ...prev, left: true }));
                    } else {
                      setControls(prev => ({ ...prev, right: true }));
                    }
                  }
                }}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const rect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
                  if (!rect) return;
                  const centerX = rect.left + rect.width / 2;
                  const centerY = rect.top + rect.height / 2;
                  const deltaX = touch.clientX - centerX;
                  const deltaY = touch.clientY - centerY;
                  
                  setControls({
                    forward: deltaY < -20,
                    backward: deltaY > 20,
                    left: deltaX < -20,
                    right: deltaX > 20
                  });
                }}
                onTouchEnd={() => {
                  setControls({ forward: false, backward: false, left: false, right: false });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;