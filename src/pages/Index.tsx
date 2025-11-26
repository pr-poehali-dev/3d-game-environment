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
  const [gameTime, setGameTime] = useState({ hours: 9, minutes: 0 });
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

    const roadGeometry = new THREE.PlaneGeometry(8, 40);
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x3d3d3d });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.01, 15);
    road.receiveShadow = true;
    scene.add(road);

    const sidewalkLeft = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 40),
      new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    sidewalkLeft.rotation.x = -Math.PI / 2;
    sidewalkLeft.position.set(-5.5, 0.05, 15);
    sidewalkLeft.receiveShadow = true;
    scene.add(sidewalkLeft);

    const sidewalkRight = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 40),
      new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    sidewalkRight.rotation.x = -Math.PI / 2;
    sidewalkRight.position.set(5.5, 0.05, 15);
    sidewalkRight.receiveShadow = true;
    scene.add(sidewalkRight);

    const grassArea = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 40),
      new THREE.MeshStandardMaterial({ color: 0x7a9b5f })
    );
    grassArea.rotation.x = -Math.PI / 2;
    grassArea.position.set(-15, 0.02, 15);
    scene.add(grassArea);

    const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0xe0d8c8 });
    const building1 = new THREE.Mesh(new THREE.BoxGeometry(10, 15, 8), buildingMaterial);
    building1.position.set(-20, 7.5, 10);
    building1.castShadow = true;
    building1.receiveShadow = true;
    building1.userData = { name: 'Жилой дом напротив' };
    scene.add(building1);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        const windowGeometry = new THREE.BoxGeometry(1, 1.2, 0.1);
        const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x87ceeb, emissive: 0x4682b4, emissiveIntensity: 0.3 });
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(-20 + (i - 1.5) * 2.2, 3 + j * 3.5, 14.05);
        scene.add(windowMesh);
      }
    }

    const buildingMaterial2 = new THREE.MeshStandardMaterial({ color: 0xc8c0b0 });
    const building2 = new THREE.Mesh(new THREE.BoxGeometry(8, 12, 8), buildingMaterial2);
    building2.position.set(-20, 6, 22);
    building2.castShadow = true;
    building2.receiveShadow = true;
    scene.add(building2);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const windowMesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1.2, 0.1),
          new THREE.MeshStandardMaterial({ color: 0x87ceeb, emissive: 0x4682b4, emissiveIntensity: 0.3 })
        );
        windowMesh.position.set(-20 + (i - 1) * 2.2, 3 + j * 3, 26.05);
        scene.add(windowMesh);
      }
    }

    for (let i = 0; i < 5; i++) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.3, 2),
        new THREE.MeshStandardMaterial({ color: 0x654321 })
      );
      trunk.position.y = 1;
      tree.add(trunk);

      const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(1, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x228b22 })
      );
      leaves.position.y = 2.5;
      tree.add(leaves);

      tree.position.set(-13 + i * 3, 0, 8 + i * 4);
      tree.castShadow = true;
      scene.add(tree);
    }

    const truckGroup = new THREE.Group();
    const truckBody = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.5, 4),
      new THREE.MeshStandardMaterial({ color: 0x0066ff })
    );
    truckBody.position.set(0, 1, 0);
    truckBody.castShadow = true;
    truckGroup.add(truckBody);

    const truckCabin = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.2, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x0055cc })
    );
    truckCabin.position.set(0, 1.1, -2.5);
    truckCabin.castShadow = true;
    truckGroup.add(truckCabin);

    const truckCargo = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.8, 3.5),
      new THREE.MeshStandardMaterial({ color: 0xcccccc })
    );
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

    const truckState = 'waiting';
    const truckTimer = 0;
    const deliverySchedule = [
      { time: 10 * 60, duration: 5 },
      { time: 11 * 60, duration: 10 },
      { time: 12 * 60, duration: 5 },
      { time: 13 * 60, duration: 3 }
    ];

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

      if (truckState === 'arriving') {
        truckGroup.position.z -= delta * 3;
        if (truckGroup.position.z <= 13) {
          truckState = 'unloading';
          truckGroup.position.z = 13;
        }
      } else if (truckState === 'unloading') {
        const elapsed = currentGameMinutes - deliverySchedule.find(d => currentGameMinutes >= d.time && currentGameMinutes < d.time + d.duration)!.time;
        if (elapsed >= activeDuration - 1) {
          truckState = 'leaving';
        }
        
        if (!driver.parent) {
          truckGroup.add(driver);
          driver.position.set(-2, 1, 0);
        }
        
        const walkCycle = Math.sin(Date.now() * 0.005) * 0.1;
        if (elapsed < activeDuration / 2) {
          driver.position.x = Math.max(-2 + elapsed * 0.5, 8);
          driver.position.y = 1 + walkCycle;
        }
      } else if (truckState === 'leaving') {
        if (driver.parent) {
          truckGroup.remove(driver);
        }
        truckGroup.position.z += delta * 3;
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
      
      {isLocked && (
        <div className="absolute top-4 right-4">
          <Card className="p-3 bg-[#1A1F2C]/95 border-[#9b87f5]">
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={20} className="text-[#9b87f5]" />
              <span className="text-white font-mono text-lg">
                {String(gameTime.hours).padStart(2, '0')}:{String(gameTime.minutes).padStart(2, '0')}
              </span>
            </div>
          </Card>
        </div>
      )}
      
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