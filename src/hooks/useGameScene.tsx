import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GameSceneProps {
  mountRef: React.RefObject<HTMLDivElement>;
  isLocked: boolean;
  controls: { forward: boolean; backward: boolean; left: boolean; right: boolean };
  mouseXRef: React.MutableRefObject<number>;
  mouseYRef: React.MutableRefObject<number>;
  gameTime: { hours: number; minutes: number };
  setGameTime: React.Dispatch<React.SetStateAction<{ hours: number; minutes: number }>>;
  setMoney: React.Dispatch<React.SetStateAction<number>>;
}

export const useGameScene = ({
  mountRef,
  isLocked,
  controls,
  mouseXRef,
  mouseYRef,
  gameTime,
  setGameTime,
  setMoney
}: GameSceneProps) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd3d3d3);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

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

    const rightWallPart1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 4), wallMaterial);
    rightWallPart1.position.set(6, 1.5, -3);
    rightWallPart1.receiveShadow = true;
    scene.add(rightWallPart1);

    const rightWallPart2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 3), wallMaterial);
    rightWallPart2.position.set(6, 1.5, 3.5);
    rightWallPart2.receiveShadow = true;
    scene.add(rightWallPart2);

    const curtainGeometry = new THREE.PlaneGeometry(1.8, 2.5);
    const curtainMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const curtain = new THREE.Mesh(curtainGeometry, curtainMaterial);
    curtain.position.set(5.9, 1.25, 0.5);
    curtain.rotation.y = Math.PI / 2;
    curtain.userData = { name: 'Чёрная занавеска → Склад' };
    scene.add(curtain);

    const warehouseWallMaterial = new THREE.MeshStandardMaterial({ color: 0x3a3a3a });
    
    const warehouseFrontWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 8), warehouseWallMaterial);
    warehouseFrontWall.position.set(6.1, 1.5, 0.5);
    warehouseFrontWall.receiveShadow = true;
    scene.add(warehouseFrontWall);

    const warehouseBackWall = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 0.2), warehouseWallMaterial);
    warehouseBackWall.position.set(9, 1.5, 4.4);
    warehouseBackWall.receiveShadow = true;
    scene.add(warehouseBackWall);

    const warehouseRightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 8), warehouseWallMaterial);
    warehouseRightWall.position.set(12, 1.5, 0.5);
    warehouseRightWall.receiveShadow = true;
    scene.add(warehouseRightWall);

    const warehouseLeftWall = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 0.2), warehouseWallMaterial);
    warehouseLeftWall.position.set(9, 1.5, -3.4);
    warehouseLeftWall.receiveShadow = true;
    scene.add(warehouseLeftWall);

    const warehouseFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 8),
      new THREE.MeshStandardMaterial({ color: 0x505050 })
    );
    warehouseFloor.rotation.x = -Math.PI / 2;
    warehouseFloor.position.set(9, 0, 0.5);
    warehouseFloor.receiveShadow = true;
    warehouseFloor.userData = { name: 'Пол склада' };
    scene.add(warehouseFloor);

    const warehouseCeiling = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 8),
      new THREE.MeshStandardMaterial({ color: 0x4a4a4a, side: THREE.DoubleSide })
    );
    warehouseCeiling.rotation.x = Math.PI / 2;
    warehouseCeiling.position.set(9, 3, 0.5);
    scene.add(warehouseCeiling);

    const warehouseLight = new THREE.PointLight(0xffa500, 0.8, 15);
    warehouseLight.position.set(9, 2.5, 0.5);
    warehouseLight.castShadow = true;
    scene.add(warehouseLight);

    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), boxMaterial);
        box.position.set(7.5 + i * 0.7, 0.3 + j * 0.65, 2);
        box.castShadow = true;
        box.userData = { name: `Коробка ${i + 1}-${j + 1}` };
        scene.add(box);
      }
    }

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), boxMaterial);
        box.position.set(10.5 + i * 0.7, 0.3 + j * 0.65, -1);
        box.castShadow = true;
        box.userData = { name: `Коробка стек ${i + 1}-${j + 1}` };
        scene.add(box);
      }
    }

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

    const posterGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.05);
    const posterMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    const poster = new THREE.Mesh(posterGeometry, posterMaterial);
    poster.position.set(5.9, 1.5, 2);
    poster.userData = { name: 'Плакат' };
    scene.add(poster);

    const roadGeometry = new THREE.PlaneGeometry(8, 40);
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x3a3a3a });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(3, 0, 20);
    road.receiveShadow = true;
    road.userData = { name: 'Дорога' };
    scene.add(road);

    const sidewalkGeometry = new THREE.PlaneGeometry(3, 40);
    const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b8b8b });
    
    const sidewalkLeft = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    sidewalkLeft.rotation.x = -Math.PI / 2;
    sidewalkLeft.position.set(-2, 0.02, 20);
    sidewalkLeft.receiveShadow = true;
    scene.add(sidewalkLeft);

    const sidewalkRight = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    sidewalkRight.rotation.x = -Math.PI / 2;
    sidewalkRight.position.set(8.5, 0.02, 20);
    sidewalkRight.receiveShadow = true;
    scene.add(sidewalkRight);

    const lawnGeometry = new THREE.PlaneGeometry(5, 40);
    const lawnMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    
    const lawnLeft = new THREE.Mesh(lawnGeometry, lawnMaterial);
    lawnLeft.rotation.x = -Math.PI / 2;
    lawnLeft.position.set(-5.5, 0.01, 20);
    scene.add(lawnLeft);

    const lawnRight = new THREE.Mesh(lawnGeometry, lawnMaterial);
    lawnRight.rotation.x = -Math.PI / 2;
    lawnRight.position.set(11.5, 0.01, 20);
    scene.add(lawnRight);

    const treeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 8);
    const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const leavesGeometry = new THREE.SphereGeometry(1.5, 8, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });

    for (let i = 0; i < 5; i++) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(treeGeometry, treeMaterial);
      trunk.position.y = 1.5;
      tree.add(trunk);
      
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.position.y = 3.5;
      tree.add(leaves);
      
      tree.position.set(-5.5, 0, 5 + i * 8);
      tree.castShadow = true;
      scene.add(tree);

      const tree2 = tree.clone();
      tree2.position.set(11.5, 0, 5 + i * 8);
      scene.add(tree2);
    }

    const buildingGeometry = new THREE.BoxGeometry(6, 8, 4);
    const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37 });

    const building1 = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building1.position.set(-5.5, 4, 15);
    building1.castShadow = true;
    scene.add(building1);

    const building2 = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building2.position.set(-5.5, 4, 25);
    building2.castShadow = true;
    scene.add(building2);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        const windowGeometry = new THREE.PlaneGeometry(0.8, 1);
        const windowMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x87ceeb,
          emissive: 0x4682b4,
          emissiveIntensity: 0.3
        });
        const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
        window1.position.set(-2.5 + j * 2, 3 + i * 1.5, 2.01);
        building1.add(window1);

        const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
        window2.position.set(-2.5 + j * 2, 3 + i * 1.5, 2.01);
        building2.add(window2);
      }
    }

    const truckGroup = new THREE.Group();
    
    const truckCabinGeometry = new THREE.BoxGeometry(2.5, 2, 2);
    const truckCabinMaterial = new THREE.MeshStandardMaterial({ color: 0x0066ff });
    const truckCabin = new THREE.Mesh(truckCabinGeometry, truckCabinMaterial);
    truckCabin.position.set(0, 1.5, -1.5);
    truckCabin.castShadow = true;
    truckGroup.add(truckCabin);

    const truckCargoGeometry = new THREE.BoxGeometry(2.5, 2.5, 4);
    const truckCargoMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
    const truckCargo = new THREE.Mesh(truckCargoGeometry, truckCargoMaterial);
    truckCargo.position.set(0, 1.2, 0.8);
    truckCargo.castShadow = true;
    truckGroup.add(truckCargo);

    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    
    for (let i = 0; i < 4; i++) {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(i < 2 ? -1.1 : 1.1, 0.4, i % 2 === 0 ? -2 : 1.5);
      wheel.castShadow = true;
      truckGroup.add(wheel);
    }

    const driverGeometry = new THREE.CapsuleGeometry(0.3, 1, 8, 16);
    const driverMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const driver = new THREE.Mesh(driverGeometry, driverMaterial);
    driver.position.set(0, 1, 0);
    driver.castShadow = true;

    truckGroup.position.set(3, 0, 25);
    truckGroup.visible = false;
    scene.add(truckGroup);

    let truckState = 'waiting';
    let truckTimer = 0;
    const deliverySchedule = [
      { time: 10 * 60, duration: 5 },
      { time: 11 * 60, duration: 10 },
      { time: 12 * 60, duration: 5 },
      { time: 13 * 60, duration: 3 }
    ];

    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const moveSpeed = 5;

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      camera.rotation.order = 'YXZ';
      camera.rotation.y = -mouseXRef.current;
      camera.rotation.x = -mouseYRef.current;

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
      camera.position.x = Math.max(-5.5, Math.min(11.5, camera.position.x));
      camera.position.z = Math.max(-4.5, Math.min(25, camera.position.z));

      truckTimer += delta;
      if (truckTimer >= 12) {
        truckTimer = 0;
        setGameTime(prev => {
          let newMinutes = prev.minutes + 5;
          let newHours = prev.hours;
          if (newMinutes >= 60) {
            newHours += Math.floor(newMinutes / 60);
            newMinutes = newMinutes % 60;
            if (newHours >= 24) newHours = newHours % 24;
          }
          return { hours: newHours, minutes: newMinutes };
        });
      }

      const currentGameMinutes = gameTime.hours * 60 + gameTime.minutes;
      let shouldShowTruck = false;
      let activeDuration = 0;

      for (const delivery of deliverySchedule) {
        if (currentGameMinutes >= delivery.time && currentGameMinutes < delivery.time + delivery.duration) {
          shouldShowTruck = true;
          activeDuration = delivery.duration;
          break;
        }
      }

      if (shouldShowTruck && !truckGroup.visible) {
        truckState = 'arriving';
        truckGroup.visible = true;
        truckGroup.position.set(3, 0, 35);
      }

      if (truckState === 'arriving' && truckGroup.visible) {
        truckGroup.position.z -= delta * 5;
        if (truckGroup.position.z <= 8) {
          truckGroup.position.z = 8;
          truckState = 'unloading';
          driver.position.set(-1.5, 0.5, -2.5);
          truckGroup.add(driver);
        }
      }

      if (truckState === 'unloading' && truckGroup.visible) {
        if (driver.position.x < 7) {
          driver.position.x += delta * 1.5;
          const walkCycle = Math.sin(Date.now() * 0.01) * 0.3;
          driver.position.y = 0.5 + Math.abs(walkCycle) * 0.1;
        } else {
          const timeInDelivery = currentGameMinutes - (deliverySchedule.find(d => 
            currentGameMinutes >= d.time && currentGameMinutes < d.time + d.duration
          )?.time || 0);
          
          if (timeInDelivery >= activeDuration - 1) {
            truckState = 'returning_driver';
          } else {
            setMoney(prev => prev + delta * 10);
          }
        }
      }

      if (truckState === 'returning_driver' && truckGroup.visible) {
        if (driver.position.x > -1.5) {
          driver.position.x -= delta * 1.5;
          const walkCycle = Math.sin(Date.now() * 0.01) * 0.3;
          driver.position.y = 0.5 + Math.abs(walkCycle) * 0.1;
        } else {
          driver.position.set(0, 1, 0);
          truckState = 'leaving';
        }
      }

      if (truckState === 'leaving' && truckGroup.visible) {
        truckGroup.position.z += delta * 5;
        if (truckGroup.position.z >= 35) {
          truckGroup.visible = false;
          truckState = 'waiting';
        }
      }

      if (!shouldShowTruck && truckGroup.visible && truckState === 'waiting') {
        truckGroup.visible = false;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mountRef, isLocked, controls, mouseXRef, mouseYRef, gameTime, setGameTime, setMoney]);

  return { scene: sceneRef.current, camera: cameraRef.current, renderer: rendererRef.current };
};