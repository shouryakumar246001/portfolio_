import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { playRotaryClick } from '../utils/audio';

export interface DialButtonInfo {
  id: string;
  name: string;
  actionText: string;
  detail: string;
  url: string;
  isExternal?: boolean;
  angleDeg: number;
}

export const DIAL_BUTTONS: DialButtonInfo[] = [
  {
    id: 'phone',
    name: 'Phone',
    actionText: 'Call Me',
    detail: '+91 82498 26372',
    url: 'tel:+918249826372',
    angleDeg: -128,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    actionText: 'Connect with Me',
    detail: 'shourya-kumar-9143372b9',
    url: 'https://linkedin.com/in/shourya-kumar-9143372b9',
    isExternal: true,
    angleDeg: -64,
  },
  {
    id: 'email',
    name: 'Email',
    actionText: 'Send Email',
    detail: 'shourya24600101@gmail.com',
    url: 'mailto:shourya24600101@gmail.com',
    angleDeg: 0,
  },
  {
    id: 'github',
    name: 'GitHub',
    actionText: 'Explore My Projects',
    detail: 'github.com/shouryakumar246001',
    url: 'https://github.com/shouryakumar246001',
    isExternal: true,
    angleDeg: 64,
  },
  {
    id: 'location',
    name: 'Location',
    actionText: 'Find Me',
    detail: 'Bhubaneswar, India',
    url: 'https://maps.google.com/?q=Bhubaneswar,+India',
    isExternal: true,
    angleDeg: 128,
  },
];

interface VintageTelephone3DProps {
  isRinging?: boolean;
  onRingEnd?: () => void;
  className?: string;
}

export const VintageTelephone3D: React.FC<VintageTelephone3DProps> = ({
  isRinging = false,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeTooltip, setActiveTooltip] = useState<{
    button: DialButtonInfo;
    x: number;
    y: number;
  } | null>(null);

  // References to communicate between React state and Three.js render loop
  const stateRef = useRef({
    hoveredId: null as string | null,
    pressedId: null as string | null,
    isRinging,
    mouseX: 0,
    mouseY: 0,
    targetRotX: 0,
    targetRotY: 0,
  });

  useEffect(() => {
    stateRef.current.isRinging = isRinging;
  }, [isRinging]);

  // Create crisp icon canvas textures for the 5 dial buttons
  const createButtonTexture = useCallback((id: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Dark vintage enamel circular background
    const cx = 128;
    const cy = 128;
    const r = 118;

    // Metallic outer ring gradient
    const ringGrad = ctx.createLinearGradient(0, 0, 256, 256);
    ringGrad.addColorStop(0, '#E5C158');
    ringGrad.addColorStop(0.3, '#D4AF37');
    ringGrad.addColorStop(0.7, '#8C6D23');
    ringGrad.addColorStop(1, '#FFE680');

    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Inner dark bronze/enamel disc
    const innerGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 96);
    innerGrad.addColorStop(0, '#261F18');
    innerGrad.addColorStop(0.75, '#15110D');
    innerGrad.addColorStop(1, '#0C0A08');

    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 96, 0, Math.PI * 2);
    ctx.fill();

    // Subtle inner golden rim
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 84, 0, Math.PI * 2);
    ctx.stroke();

    // Draw high-contrast gold icon
    ctx.strokeStyle = '#F5D77F';
    ctx.fillStyle = '#F5D77F';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (id === 'phone') {
      // Classic vintage telephone handset icon
      ctx.beginPath();
      ctx.arc(128, 128, 42, -Math.PI * 0.75, -Math.PI * 0.25);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(98, 106, 12, 18, -Math.PI * 0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(158, 106, 12, 18, Math.PI * 0.25, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === 'linkedin') {
      // 'in' monogram
      ctx.font = 'bold 74px "Kanit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('in', 128, 126);
    } else if (id === 'email') {
      // Envelope icon
      ctx.beginPath();
      ctx.strokeRect(90, 102, 76, 52);
      ctx.beginPath();
      ctx.moveTo(90, 102);
      ctx.lineTo(128, 132);
      ctx.lineTo(166, 102);
      ctx.stroke();
    } else if (id === 'github') {
      // GitHub cat silhouette outline
      ctx.font = 'bold 68px "Kanit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GH', 128, 126);
    } else if (id === 'location') {
      // Map Pin icon
      ctx.beginPath();
      ctx.arc(128, 114, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(128, 114, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(112, 128);
      ctx.lineTo(128, 158);
      ctx.lineTo(144, 128);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.center.set(0.5, 0.5);
    texture.rotation = Math.PI / 2;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Create center cameo medallion texture (antique Victorian/French crest)
  const createCameoTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const cx = 128;
    const cy = 128;

    // Rich burgundy / deep carmine vintage enamel
    const rad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120);
    rad.addColorStop(0, '#5A1E26');
    rad.addColorStop(0.7, '#381016');
    rad.addColorStop(1, '#20080B');

    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.fill();

    // Concentric gold filigree rings
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 108, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 98, 0, Math.PI * 2);
    ctx.stroke();

    // Central French Fleur-de-lis / Crest motif
    ctx.fillStyle = '#E5C158';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ 1960 ✦', cx, cy - 24);

    ctx.font = 'bold 22px "Kanit", sans-serif';
    ctx.fillText('DISPATCH', cx, cy + 18);

    const texture = new THREE.CanvasTexture(canvas);
    texture.center.set(0.5, 0.5);
    texture.rotation = Math.PI / 2;
    texture.needsUpdate = true;
    return texture;
  }, []);

  const handleButtonClick = useCallback((btn: DialButtonInfo) => {
    playRotaryClick(1);
    if (btn.isExternal) {
      window.open(btn.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = btn.url;
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 520;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 7.8);
    camera.lookAt(0, 0.3, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // --- Lighting ---
    // 1. Soft warm ambient light matching portfolio cosmic room
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.4);
    scene.add(ambientLight);

    // 2. Main Key Directional light casting soft shadows
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.6);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // 3. Cool fill light for bronze / silver contrast
    const fillLight = new THREE.DirectionalLight(0x7fb5ff, 1.1);
    fillLight.position.set(-5, 4, -2);
    scene.add(fillLight);

    // 4. Warm rear rim light to highlight the curved handset & cradle
    const rimLight = new THREE.DirectionalLight(0xffd580, 1.8);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    // 5. Dial accent spotlight highlighting the 5 circular buttons
    const dialSpotlight = new THREE.SpotLight(0xffd700, 2.2, 10, Math.PI / 4, 0.4, 1.2);
    dialSpotlight.position.set(0, 2, 4.5);
    dialSpotlight.target.position.set(0, 0, 1.2);
    scene.add(dialSpotlight);
    scene.add(dialSpotlight.target);

    // --- Master Materials ---
    const ivoryMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5eee3,
      roughness: 0.32,
      metalness: 0.06,
    });

    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.88,
    });

    const polishedNickelMaterial = new THREE.MeshStandardMaterial({
      color: 0xd2d7df,
      roughness: 0.18,
      metalness: 0.92,
    });

    const darkBronzeMaterial = new THREE.MeshStandardMaterial({
      color: 0x221c17,
      roughness: 0.35,
      metalness: 0.65,
    });

    // --- Root Groups ---
    const masterPhoneGroup = new THREE.Group();
    scene.add(masterPhoneGroup);

    // Telephone sits gracefully with slight front-facing tilt
    masterPhoneGroup.position.set(0, -0.15, 0);

    // --- 1. Base Structure ---
    const baseGroup = new THREE.Group();
    masterPhoneGroup.add(baseGroup);

    // Pyramidal beveled ivory base (truncated 4-sided pyramid)
    const baseGeom = new THREE.CylinderGeometry(1.5, 2.3, 1.15, 4, 1, false, Math.PI / 4);
    const baseMesh = new THREE.Mesh(baseGeom, ivoryMaterial);
    baseMesh.position.y = 0;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    baseGroup.add(baseMesh);

    // Base lower stepped plinth
    const plinthGeom = new THREE.CylinderGeometry(2.32, 2.48, 0.2, 4, 1, false, Math.PI / 4);
    const plinthMesh = new THREE.Mesh(plinthGeom, ivoryMaterial);
    plinthMesh.position.y = -0.58;
    plinthMesh.castShadow = true;
    plinthMesh.receiveShadow = true;
    baseGroup.add(plinthMesh);

    // Brass lower rim border
    const rimBorderGeom = new THREE.CylinderGeometry(2.5, 2.52, 0.05, 4, 1, false, Math.PI / 4);
    const rimBorderMesh = new THREE.Mesh(rimBorderGeom, brassMaterial);
    rimBorderMesh.position.y = -0.68;
    rimBorderMesh.castShadow = true;
    baseGroup.add(rimBorderMesh);

    // 4 Stepped brass feet at the corners
    const footGeom = new THREE.CylinderGeometry(0.2, 0.26, 0.18, 16);
    const footPositions = [
      [-1.38, -0.74, -1.38],
      [1.38, -0.74, -1.38],
      [-1.38, -0.74, 1.38],
      [1.38, -0.74, 1.38],
    ];
    footPositions.forEach(([x, y, z]) => {
      const foot = new THREE.Mesh(footGeom, brassMaterial);
      foot.position.set(x, y, z);
      foot.castShadow = true;
      baseGroup.add(foot);
    });

    // --- 2. Slanted Rotary Dial Console ---
    const dialConsoleGroup = new THREE.Group();
    dialConsoleGroup.position.set(0, 0.08, 1.35);
    dialConsoleGroup.rotation.x = -Math.PI * 0.17; // Matches the slant of the phone's front face
    masterPhoneGroup.add(dialConsoleGroup);

    // Heavy polished brass outer bezel ring
    const dialBezelGeom = new THREE.TorusGeometry(1.36, 0.09, 16, 48);
    const dialBezelMesh = new THREE.Mesh(dialBezelGeom, brassMaterial);
    dialBezelMesh.castShadow = true;
    dialConsoleGroup.add(dialBezelMesh);

    // Inner stepped brass dial housing collar
    const dialCollarGeom = new THREE.CylinderGeometry(1.38, 1.42, 0.12, 40);
    dialCollarGeom.rotateX(Math.PI / 2);
    const dialCollarMesh = new THREE.Mesh(dialCollarGeom, brassMaterial);
    dialCollarMesh.position.z = -0.05;
    dialConsoleGroup.add(dialCollarMesh);

    // Dark vintage enamel dial faceplate
    const dialFaceGeom = new THREE.CylinderGeometry(1.32, 1.32, 0.04, 40);
    dialFaceGeom.rotateX(Math.PI / 2);
    const dialFaceMesh = new THREE.Mesh(dialFaceGeom, darkBronzeMaterial);
    dialFaceMesh.position.z = 0.01;
    dialFaceMesh.receiveShadow = true;
    dialConsoleGroup.add(dialFaceMesh);

    // Rotating finger wheel / disc group (can give a mechanical twist on hover)
    const rotaryWheelGroup = new THREE.Group();
    rotaryWheelGroup.position.z = 0.04;
    dialConsoleGroup.add(rotaryWheelGroup);

    // Ornate center medallion (cameo crest)
    const cameoGeom = new THREE.CylinderGeometry(0.48, 0.48, 0.08, 32);
    cameoGeom.rotateX(Math.PI / 2);
    const cameoTexture = createCameoTexture();
    const cameoMaterial = new THREE.MeshStandardMaterial({
      map: cameoTexture,
      roughness: 0.28,
      metalness: 0.45,
    });
    const cameoMesh = new THREE.Mesh(cameoGeom, cameoMaterial);
    cameoMesh.position.z = 0.08;
    cameoMesh.castShadow = true;
    dialConsoleGroup.add(cameoMesh);

    // Center cameo brass bezel ring
    const cameoBezelGeom = new THREE.TorusGeometry(0.48, 0.045, 16, 32);
    const cameoBezel = new THREE.Mesh(cameoBezelGeom, brassMaterial);
    cameoBezel.position.z = 0.11;
    dialConsoleGroup.add(cameoBezel);

    // --- 3. The 5 3D Circular Metallic Dial Buttons ---
    // Stored with interaction tracking
    interface ButtonMeshEntry {
      info: DialButtonInfo;
      meshGroup: THREE.Group;
      baseZ: number;
      currentZ: number;
      targetZ: number;
      glowMesh: THREE.Mesh;
      buttonMaterial: THREE.MeshStandardMaterial;
      emissiveIntensity: number;
    }

    const buttonMeshEntries: ButtonMeshEntry[] = [];
    const interactiveMeshes: THREE.Object3D[] = [];

    const dialRadius = 0.94;

    DIAL_BUTTONS.forEach((btn) => {
      const btnGroup = new THREE.Group();

      // Convert angle in degrees to radians (0° is top, -90° is left, +90° is right)
      // Standard mathematical coordinate: angle from top (Y-axis)
      const rad = THREE.MathUtils.degToRad(btn.angleDeg);
      const bx = Math.sin(rad) * dialRadius;
      const by = Math.cos(rad) * dialRadius;

      btnGroup.position.set(bx, by, 0.06);

      // 1. Raised 3D brass outer collar / bezel ring
      const buttonCollarGeom = new THREE.CylinderGeometry(0.24, 0.26, 0.08, 24);
      buttonCollarGeom.rotateX(Math.PI / 2);
      const buttonCollar = new THREE.Mesh(buttonCollarGeom, brassMaterial);
      buttonCollar.castShadow = true;
      btnGroup.add(buttonCollar);

      // 2. Raised circular 3D button disc with metallic icon face
      const buttonCapGeom = new THREE.CylinderGeometry(0.21, 0.21, 0.1, 24);
      buttonCapGeom.rotateX(Math.PI / 2);

      const iconTex = createButtonTexture(btn.id);
      const buttonMaterial = new THREE.MeshStandardMaterial({
        map: iconTex,
        roughness: 0.25,
        metalness: 0.75,
        emissive: new THREE.Color(0xd4af37),
        emissiveIntensity: 0.08,
      });

      const buttonCap = new THREE.Mesh(buttonCapGeom, buttonMaterial);
      buttonCap.position.z = 0.04;
      buttonCap.castShadow = true;
      // Attach metadata for raycaster lookup
      buttonCap.userData = { dialButtonId: btn.id };
      btnGroup.add(buttonCap);
      interactiveMeshes.push(buttonCap);

      // 3. Subtle glowing border ring for hover animation
      const glowRingGeom = new THREE.TorusGeometry(0.245, 0.025, 12, 28);
      const glowRingMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.2,
      });
      const glowRing = new THREE.Mesh(glowRingGeom, glowRingMaterial);
      glowRing.position.z = 0.08;
      btnGroup.add(glowRing);

      rotaryWheelGroup.add(btnGroup);

      buttonMeshEntries.push({
        info: btn,
        meshGroup: btnGroup,
        baseZ: 0.06,
        currentZ: 0.06,
        targetZ: 0.06,
        glowMesh: glowRing,
        buttonMaterial,
        emissiveIntensity: 0.08,
      });
    });

    // --- 4. Brass Lyre-Style Cradle Assembly (Top of Base) ---
    const cradleGroup = new THREE.Group();
    cradleGroup.position.set(0, 0.58, 0);
    masterPhoneGroup.add(cradleGroup);

    // Central brass mounting dome / turret
    const turretGeom = new THREE.CylinderGeometry(0.38, 0.55, 0.35, 24);
    const turretMesh = new THREE.Mesh(turretGeom, brassMaterial);
    turretMesh.position.y = 0.17;
    turretMesh.castShadow = true;
    cradleGroup.add(turretMesh);

    // Twin lyre cradle prongs (supporting the handset receiver)
    // Left fork arm
    const leftForkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(-0.45, 0.45, 0),
      new THREE.Vector3(-1.05, 0.75, 0),
      new THREE.Vector3(-1.18, 1.05, 0),
    ]);
    const forkTubeGeom = new THREE.TubeGeometry(leftForkCurve, 24, 0.065, 12, false);
    const leftForkMesh = new THREE.Mesh(forkTubeGeom, brassMaterial);
    leftForkMesh.castShadow = true;
    cradleGroup.add(leftForkMesh);

    // Right fork arm
    const rightForkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(0.45, 0.45, 0),
      new THREE.Vector3(1.05, 0.75, 0),
      new THREE.Vector3(1.18, 1.05, 0),
    ]);
    const rightForkTubeGeom = new THREE.TubeGeometry(rightForkCurve, 24, 0.065, 12, false);
    const rightForkMesh = new THREE.Mesh(rightForkTubeGeom, brassMaterial);
    rightForkMesh.castShadow = true;
    cradleGroup.add(rightForkMesh);

    // Left cradle U-shaped cup
    const leftCupGeom = new THREE.TorusGeometry(0.22, 0.05, 12, 24, Math.PI);
    leftCupGeom.rotateZ(Math.PI);
    const leftCup = new THREE.Mesh(leftCupGeom, brassMaterial);
    leftCup.position.set(-1.18, 1.08, 0);
    leftCup.castShadow = true;
    cradleGroup.add(leftCup);

    // Right cradle U-shaped cup
    const rightCup = leftCup.clone();
    rightCup.position.set(1.18, 1.08, 0);
    cradleGroup.add(rightCup);

    // Plunger switch buttons
    const plungerGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.18, 12);
    const leftPlunger = new THREE.Mesh(plungerGeom, polishedNickelMaterial);
    leftPlunger.position.set(-1.18, 0.98, 0);
    cradleGroup.add(leftPlunger);

    const rightPlunger = leftPlunger.clone();
    rightPlunger.position.set(1.18, 0.98, 0);
    cradleGroup.add(rightPlunger);

    // --- 5. Receiver Handset ---
    const handsetGroup = new THREE.Group();
    handsetGroup.position.set(0, 1.74, 0);
    masterPhoneGroup.add(handsetGroup);

    // Central cylindrical ivory grip handle (ergonomic barrel)
    const handleGeom = new THREE.CylinderGeometry(0.18, 0.18, 1.7, 24);
    handleGeom.rotateZ(Math.PI / 2);
    const handleMesh = new THREE.Mesh(handleGeom, ivoryMaterial);
    handleMesh.castShadow = true;
    handsetGroup.add(handleMesh);

    // Handle brass end ferrules / decorative collars
    const ferruleGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.14, 24);
    ferruleGeom.rotateZ(Math.PI / 2);

    const leftFerrule = new THREE.Mesh(ferruleGeom, brassMaterial);
    leftFerrule.position.x = -0.85;
    leftFerrule.castShadow = true;
    handsetGroup.add(leftFerrule);

    const rightFerrule = new THREE.Mesh(ferruleGeom, brassMaterial);
    rightFerrule.position.x = 0.85;
    rightFerrule.castShadow = true;
    handsetGroup.add(rightFerrule);

    // Left: Earpiece Cup (flared brass bell with ivory cushion rim)
    const earpieceGroup = new THREE.Group();
    earpieceGroup.position.set(-1.25, -0.05, 0.08);
    earpieceGroup.rotation.z = Math.PI * 0.14;
    handsetGroup.add(earpieceGroup);

    const earBellGeom = new THREE.CylinderGeometry(0.5, 0.22, 0.58, 32);
    earBellGeom.rotateZ(Math.PI / 2);
    const earBell = new THREE.Mesh(earBellGeom, brassMaterial);
    earBell.castShadow = true;
    earpieceGroup.add(earBell);

    const earRimGeom = new THREE.TorusGeometry(0.48, 0.08, 16, 32);
    earRimGeom.rotateY(Math.PI / 2);
    const earRim = new THREE.Mesh(earRimGeom, ivoryMaterial);
    earRim.position.x = -0.28;
    earRim.castShadow = true;
    earpieceGroup.add(earRim);

    // Right: Mouthpiece Horn (downward angled curved speaking trumpet)
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(1.22, -0.06, 0.15);
    mouthGroup.rotation.z = -Math.PI * 0.12;
    mouthGroup.rotation.x = Math.PI * 0.18;
    handsetGroup.add(mouthGroup);

    const mouthBellGeom = new THREE.CylinderGeometry(0.44, 0.2, 0.55, 32);
    mouthBellGeom.rotateZ(-Math.PI / 2);
    const mouthBell = new THREE.Mesh(mouthBellGeom, brassMaterial);
    mouthBell.castShadow = true;
    mouthGroup.add(mouthBell);

    const mouthRimGeom = new THREE.TorusGeometry(0.44, 0.065, 16, 32);
    mouthRimGeom.rotateY(Math.PI / 2);
    const mouthRim = new THREE.Mesh(mouthRimGeom, ivoryMaterial);
    mouthRim.position.x = 0.26;
    mouthRim.castShadow = true;
    mouthGroup.add(mouthRim);

    // Perforated brass speaking grille inside cup
    const grilleGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.02, 24);
    grilleGeom.rotateZ(Math.PI / 2);
    const grille = new THREE.Mesh(grilleGeom, polishedNickelMaterial);
    grille.position.x = 0.22;
    mouthGroup.add(grille);

    // --- 6. Vintage Spiral Coiled Cord ---
    const cordPoints: THREE.Vector3[] = [];
    const cordLoops = 14;
    const cordRadius = 0.14;
    const startPos = new THREE.Vector3(-1.3, 1.5, 0.1);
    const endPos = new THREE.Vector3(-1.45, 0.05, 0.2);

    for (let i = 0; i <= cordLoops * 10; i++) {
      const t = i / (cordLoops * 10);
      const angle = t * Math.PI * 2 * cordLoops;
      const x = THREE.MathUtils.lerp(startPos.x, endPos.x, t) + Math.cos(angle) * cordRadius * (1 - Math.abs(t - 0.5) * 0.5);
      const y = THREE.MathUtils.lerp(startPos.y, endPos.y, t) - Math.sin(t * Math.PI) * 0.45;
      const z = THREE.MathUtils.lerp(startPos.z, endPos.z, t) + Math.sin(angle) * cordRadius;
      cordPoints.push(new THREE.Vector3(x, y, z));
    }
    const cordCurve = new THREE.CatmullRomCurve3(cordPoints);
    const cordGeom = new THREE.TubeGeometry(cordCurve, 120, 0.038, 8, false);
    const cordMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d3228,
      roughness: 0.65,
      metalness: 0.15,
    });
    const cordMesh = new THREE.Mesh(cordGeom, cordMaterial);
    cordMesh.castShadow = true;
    masterPhoneGroup.add(cordMesh);

    // --- 7. Ground Contact Shadow ---
    // Soft radial ground shadow blending seamlessly into the website's dark background
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
      grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.55)');
      grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.18)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeom = new THREE.PlaneGeometry(6.2, 5.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeom, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, -0.84, 0.3);
    masterPhoneGroup.add(contactShadow);

    // --- Interaction & Raycasting ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouse.x = (clientX / rect.width) * 2 - 1;
      mouse.y = -(clientY / rect.height) * 2 + 1;

      // Parallax target angles (gentle 3D mouse tracking)
      stateRef.current.targetRotY = (mouse.x * Math.PI) / 14;
      stateRef.current.targetRotX = -(mouse.y * Math.PI) / 22;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, false);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const buttonId = hitMesh.userData.dialButtonId as string;

        if (stateRef.current.hoveredId !== buttonId) {
          stateRef.current.hoveredId = buttonId;
          renderer.domElement.style.cursor = 'pointer';
          playRotaryClick(0);

          const btnInfo = DIAL_BUTTONS.find((b) => b.id === buttonId);
          if (btnInfo) {
            setActiveTooltip({
              button: btnInfo,
              x: clientX,
              y: clientY,
            });
          }
        }
      } else {
        if (stateRef.current.hoveredId !== null) {
          stateRef.current.hoveredId = null;
          renderer.domElement.style.cursor = 'default';
          setActiveTooltip(null);
        }
      }
    };

    const onPointerDown = () => {
      if (stateRef.current.hoveredId) {
        stateRef.current.pressedId = stateRef.current.hoveredId;
      }
    };

    const onPointerUp = () => {
      if (stateRef.current.pressedId && stateRef.current.pressedId === stateRef.current.hoveredId) {
        const targetBtn = DIAL_BUTTONS.find((b) => b.id === stateRef.current.pressedId);
        if (targetBtn) {
          handleButtonClick(targetBtn);
        }
      }
      stateRef.current.pressedId = null;
    };

    const onPointerLeave = () => {
      stateRef.current.hoveredId = null;
      stateRef.current.pressedId = null;
      stateRef.current.targetRotX = 0;
      stateRef.current.targetRotY = 0;
      renderer.domElement.style.cursor = 'default';
      setActiveTooltip(null);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', onPointerMove, { passive: true });
    domElement.addEventListener('mousedown', onPointerDown);
    domElement.addEventListener('mouseup', onPointerUp);
    domElement.addEventListener('mouseleave', onPointerLeave);

    // --- Animation Loop ---
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax rotation on the master group
      masterPhoneGroup.rotation.y += (stateRef.current.targetRotY - masterPhoneGroup.rotation.y) * 0.08;
      masterPhoneGroup.rotation.x += (stateRef.current.targetRotX - masterPhoneGroup.rotation.x) * 0.08;

      // Realistic idle breathing
      const idleFloat = Math.sin(elapsedTime * 1.5) * 0.015;
      baseGroup.position.y = idleFloat;

      // Ringing vibration animation: handset and cradle shake rapidly
      if (stateRef.current.isRinging) {
        const ringShake = Math.sin(elapsedTime * 55) * 0.035;
        const ringTwist = Math.cos(elapsedTime * 60) * 0.025;
        handsetGroup.position.x = ringShake;
        handsetGroup.position.y = 1.74 + Math.abs(ringShake) * 0.8;
        handsetGroup.rotation.z = ringTwist;

        cradleGroup.position.x = ringShake * 0.3;
      } else {
        // Smoothly settle back to rest position
        handsetGroup.position.x += (0 - handsetGroup.position.x) * 0.15;
        handsetGroup.position.y += (1.74 - handsetGroup.position.y) * 0.15;
        handsetGroup.rotation.z += (0 - handsetGroup.rotation.z) * 0.15;
        cradleGroup.position.x += (0 - cradleGroup.position.x) * 0.15;
      }

      // Update 3D dial buttons animation (elevation, click depression, rotary give)
      let activeHoverAngle = 0;

      buttonMeshEntries.forEach((entry) => {
        const isHovered = stateRef.current.hoveredId === entry.info.id;
        const isPressed = stateRef.current.pressedId === entry.info.id;

        if (isPressed) {
          entry.targetZ = entry.baseZ - 0.05; // Depresses down
          entry.emissiveIntensity = 0.55;
        } else if (isHovered) {
          entry.targetZ = entry.baseZ + 0.11; // Elevates up
          entry.emissiveIntensity = 0.42;
          activeHoverAngle = THREE.MathUtils.degToRad(entry.info.angleDeg * 0.06);
        } else {
          entry.targetZ = entry.baseZ;
          entry.emissiveIntensity = 0.08;
        }

        // Smooth spring interpolation
        entry.currentZ += (entry.targetZ - entry.currentZ) * 0.22;
        entry.meshGroup.position.z = entry.currentZ;

        // Animate glow ring
        const targetGlowOpacity = isHovered ? 0.85 : 0.18;
        (entry.glowMesh.material as THREE.MeshBasicMaterial).opacity +=
          (targetGlowOpacity - (entry.glowMesh.material as THREE.MeshBasicMaterial).opacity) * 0.18;

        // Button material emissive ramp
        entry.buttonMaterial.emissiveIntensity +=
          (entry.emissiveIntensity - entry.buttonMaterial.emissiveIntensity) * 0.2;
      });

      // Subtle mechanical rotary wheel spring give when a button is hovered
      rotaryWheelGroup.rotation.z += (activeHoverAngle - rotaryWheelGroup.rotation.z) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    // --- Responsive Resize ---
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousemove', onPointerMove);
      domElement.removeEventListener('mousedown', onPointerDown);
      domElement.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('mouseleave', onPointerLeave);

      // Clean up Three.js resources
      renderer.dispose();
      if (domElement.parentNode) {
        domElement.parentNode.removeChild(domElement);
      }
    };
  }, [createButtonTexture, createCameoTexture, handleButtonClick]);

  return (
    <div className={`relative w-full h-[380px] sm:h-[460px] md:h-[520px] lg:h-[560px] flex items-center justify-center select-none ${className}`}>
      {/* Three.js Canvas Container (100% transparent background, sits directly on existing website space) */}
      <div ref={mountRef} className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Tooltip for Hovered Rotary Button */}
      {activeTooltip && (
        <div
          className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-full mb-3 transition-all duration-150"
          style={{
            left: `${Math.max(120, Math.min(activeTooltip.x, (mountRef.current?.clientWidth || 500) - 120))}px`,
            top: `${Math.max(40, activeTooltip.y - 18)}px`,
          }}
        >
          <div className="flex flex-col items-center">
            <div className="px-3.5 py-2 rounded-xl bg-[#14100C]/95 backdrop-blur-md border border-[#D4AF37]/50 shadow-[0_8px_25px_rgba(0,0,0,0.85),0_0_15px_rgba(212,175,55,0.25)] text-center whitespace-nowrap">
              <div className="text-xs font-semibold text-[#FFFFFF] tracking-tight">
                {activeTooltip.button.detail}
              </div>
              <div className="text-[9px] font-mono text-[#C8A97E]/75 mt-0.5">
                {activeTooltip.button.isExternal ? 'Click to open in new tab ↗' : 'Click to dial/send ✆'}
              </div>
            </div>
            {/* Tooltip Downward Beak */}
            <div className="w-2.5 h-2.5 bg-[#14100C] border-r border-b border-[#D4AF37]/50 transform rotate-45 -mt-1.5 shadow-sm" />
          </div>
        </div>
      )}

      {/* Accessible Mobile & Keyboard Dial Buttons Bar */}
      <div className="sr-only focus-within:not-sr-only absolute -bottom-2 sm:bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-full bg-[#120F0C]/85 backdrop-blur-md border border-[#D4AF37]/30 shadow-[0_8px_25px_rgba(0,0,0,0.7)]">
        {DIAL_BUTTONS.map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleButtonClick(btn)}
            title={`${btn.name}: ${btn.actionText} (${btn.detail})`}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#D4AF37]/25 hover:border-[#D4AF37]/80 bg-[#1D1711]/80 hover:bg-[#2A2016] text-[#E5C158] hover:text-[#FFFFFF] text-[10px] font-mono tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>{btn.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VintageTelephone3D;
