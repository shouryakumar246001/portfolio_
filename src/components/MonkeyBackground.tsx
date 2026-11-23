import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function makeFurTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create the monkey fur texture.');

  context.fillStyle = '#69402b';
  context.fillRect(0, 0, canvas.width, canvas.height);

  let seed = 19;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 8000; i++) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const length = 2 + random() * 8;
    const lightness = Math.floor(45 + random() * 38);
    context.strokeStyle = `rgba(${lightness + 38}, ${lightness + 10}, ${lightness}, ${0.08 + random() * 0.2})`;
    context.lineWidth = 0.35 + random() * 0.8;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + (random() - 0.5) * 2, y + length);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createMonkey(): {
  group: THREE.Group;
  tail: THREE.Group;
  legs: THREE.Group[];
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
  ropeSegments: THREE.Mesh[];
} {
  const group = new THREE.Group();
  const tail = new THREE.Group();
  const legs: THREE.Group[] = [];
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const furTexture = makeFurTexture();
  const fur = new THREE.MeshStandardMaterial({
    color: 0x8c5c3b,
    map: furTexture,
    bumpMap: furTexture,
    bumpScale: 0.035,
    roughness: 0.92,
  });
  const darkFur = new THREE.MeshStandardMaterial({ color: 0x51331f, roughness: 0.96, map: furTexture });
  const face = new THREE.MeshStandardMaterial({ color: 0xc98d68, roughness: 0.84 });
  const muzzle = new THREE.MeshStandardMaterial({ color: 0xe2b28d, roughness: 0.8 });
  const innerEar = new THREE.MeshStandardMaterial({ color: 0x9b594c, roughness: 0.86 });
  const eye = new THREE.MeshStandardMaterial({ color: 0x1c1513, roughness: 0.22 });
  const highlight = new THREE.MeshBasicMaterial({ color: 0xfff0d7 });
  const glassesFrame = new THREE.MeshStandardMaterial({
    color: 0x171323,
    metalness: 0.72,
    roughness: 0.24,
  });
  const glassesLens = new THREE.MeshPhysicalMaterial({
    color: 0x261a3a,
    metalness: 0.48,
    roughness: 0.13,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  });
  const ropeMaterial = new THREE.MeshStandardMaterial({
    color: 0xc6aa7f,
    roughness: 0.9,
    bumpMap: furTexture,
    bumpScale: 0.015,
  });
  materials.push(fur, darkFur, face, muzzle, innerEar, eye, highlight, glassesFrame, glassesLens, ropeMaterial);

  const ellipsoid = (
    parent: THREE.Object3D,
    material: THREE.Material,
    position: THREE.Vector3,
    scale: THREE.Vector3,
    detail = 24,
  ) => {
    const geometry = new THREE.SphereGeometry(1, detail, detail);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.scale.copy(scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const segment = (
    parent: THREE.Object3D,
    from: THREE.Vector3,
    to: THREE.Vector3,
    radiusStart: number,
    radiusEnd: number,
    material: THREE.Material,
  ) => {
    const direction = new THREE.Vector3().subVectors(to, from);
    const geometry = new THREE.CylinderGeometry(radiusEnd, radiusStart, direction.length(), 12, 1);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(from).add(to).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    ellipsoid(parent, material, from, new THREE.Vector3(radiusStart, radiusStart, radiusStart), 12);
    ellipsoid(parent, material, to, new THREE.Vector3(radiusEnd, radiusEnd, radiusEnd), 12);
    return mesh;
  };

  const ropeGeometry = new THREE.CylinderGeometry(0.009, 0.009, 1, 6, 1);
  geometries.push(ropeGeometry);
  const ropeSegments = Array.from({ length: 16 }, () => {
    const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
    rope.castShadow = true;
    return rope;
  });

  const body = new THREE.Group();
  group.add(body);

  ellipsoid(body, fur, new THREE.Vector3(0.015, -0.99, 0), new THREE.Vector3(0.235, 0.34, 0.17), 32);
  ellipsoid(body, fur, new THREE.Vector3(0.015, -1.23, 0.01), new THREE.Vector3(0.24, 0.22, 0.18), 28);
  ellipsoid(body, muzzle, new THREE.Vector3(0, -0.76, 0.035), new THREE.Vector3(0.19, 0.2, 0.17), 28);

  const head = new THREE.Group();
  head.position.set(0, -0.58, 0);
  body.add(head);
  ellipsoid(head, fur, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.27, 0.28, 0.22), 32);
  ellipsoid(head, face, new THREE.Vector3(0, -0.08, 0.155), new THREE.Vector3(0.205, 0.19, 0.105), 28);
  ellipsoid(head, muzzle, new THREE.Vector3(0, -0.17, 0.223), new THREE.Vector3(0.13, 0.085, 0.06), 24);
  ellipsoid(head, darkFur, new THREE.Vector3(0, -0.115, 0.275), new THREE.Vector3(0.034, 0.023, 0.018), 16);

  for (const side of [-1, 1]) {
    const earPosition = new THREE.Vector3(side * 0.255, -0.005, 0.015);
    ellipsoid(head, fur, earPosition, new THREE.Vector3(0.105, 0.13, 0.07), 20);
    ellipsoid(
      head,
      innerEar,
      new THREE.Vector3(side * 0.27, -0.008, 0.071),
      new THREE.Vector3(0.055, 0.078, 0.025),
      18,
    );
    ellipsoid(
      head,
      eye,
      new THREE.Vector3(side * 0.084, -0.037, 0.245),
      new THREE.Vector3(0.026, 0.036, 0.018),
      16,
    );
    ellipsoid(
      head,
      highlight,
      new THREE.Vector3(side * 0.09, -0.023, 0.262),
      new THREE.Vector3(0.008, 0.01, 0.006),
      10,
    );
  }

  for (const side of [-1, 1]) {
    ellipsoid(
      head,
      glassesFrame,
      new THREE.Vector3(side * 0.084, -0.037, 0.268),
      new THREE.Vector3(0.086, 0.056, 0.026),
      24,
    );
    ellipsoid(
      head,
      glassesLens,
      new THREE.Vector3(side * 0.084, -0.037, 0.286),
      new THREE.Vector3(0.069, 0.041, 0.017),
      24,
    );
  }
  segment(
    head,
    new THREE.Vector3(-0.02, -0.035, 0.281),
    new THREE.Vector3(0.02, -0.035, 0.281),
    0.012,
    0.012,
    glassesFrame,
  );
  segment(
    head,
    new THREE.Vector3(-0.17, -0.035, 0.245),
    new THREE.Vector3(-0.24, -0.045, 0.12),
    0.01,
    0.008,
    glassesFrame,
  );
  segment(
    head,
    new THREE.Vector3(0.17, -0.035, 0.245),
    new THREE.Vector3(0.24, -0.045, 0.12),
    0.01,
    0.008,
    glassesFrame,
  );

  const hangingShoulder = new THREE.Vector3(0.17, -0.76, 0);
  const holdingHand = new THREE.Vector3(0.015, -0.34, 0.02);
  segment(body, hangingShoulder, new THREE.Vector3(0.11, -0.53, 0.01), 0.075, 0.06, fur);
  segment(body, new THREE.Vector3(0.11, -0.53, 0.01), holdingHand, 0.06, 0.045, fur);
  ellipsoid(body, face, holdingHand, new THREE.Vector3(0.065, 0.055, 0.06), 18);
  for (let finger = -1; finger <= 1; finger++) {
    segment(
      body,
      new THREE.Vector3(finger * 0.018, -0.34, 0.075),
      new THREE.Vector3(finger * 0.02 + 0.005, -0.39, 0.08),
      0.012,
      0.009,
      face,
    );
  }

  segment(body, new THREE.Vector3(-0.17, -0.76, 0), new THREE.Vector3(-0.28, -0.96, 0.01), 0.075, 0.058, fur);
  segment(body, new THREE.Vector3(-0.28, -0.96, 0.01), new THREE.Vector3(-0.22, -1.17, 0.04), 0.058, 0.042, fur);
  ellipsoid(body, face, new THREE.Vector3(-0.22, -1.19, 0.06), new THREE.Vector3(0.055, 0.045, 0.045), 16);

  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(side * 0.11, -1.32, 0);
    body.add(leg);
    segment(leg, new THREE.Vector3(0, 0, 0), new THREE.Vector3(side * 0.035, -0.19, 0.015), 0.09, 0.065, fur);
    segment(
      leg,
      new THREE.Vector3(side * 0.035, -0.19, 0.015),
      new THREE.Vector3(-side * 0.015, -0.39, 0.07),
      0.065,
      0.045,
      darkFur,
    );
    ellipsoid(
      leg,
      face,
      new THREE.Vector3(-side * 0.025, -0.405, 0.095),
      new THREE.Vector3(0.09, 0.045, 0.06),
      18,
    );
    legs.push(leg);
  }

  tail.position.set(0.17, -1.2, -0.005);
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.16, -0.1, 0),
    new THREE.Vector3(0.31, -0.28, 0),
    new THREE.Vector3(0.3, -0.48, 0),
    new THREE.Vector3(0.18, -0.58, 0.015),
  ]);
  const tailGeometry = new THREE.TubeGeometry(tailCurve, 30, 0.035, 8, false);
  geometries.push(tailGeometry);
  const tailMesh = new THREE.Mesh(tailGeometry, fur);
  tailMesh.castShadow = true;
  tail.add(tailMesh);
  ellipsoid(tail, darkFur, new THREE.Vector3(0.18, -0.58, 0.015), new THREE.Vector3(0.04, 0.04, 0.04), 12);
  body.add(tail);

  return { group, tail, legs, materials, geometries, ropeSegments };
}

const MonkeyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-4, 4, 4, -4, 0.1, 100);
    camera.position.set(0, 0, 12);
    camera.lookAt(0, 0, 0);

    const { group, tail, legs, materials, geometries, ropeSegments } = createMonkey();
    scene.add(group);
    ropeSegments.forEach((rope) => scene.add(rope));

    const keyLight = new THREE.DirectionalLight(0xffdfc4, 2.2);
    keyLight.position.set(-3, 5, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(512, 512);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb7c4d2, 1.15);
    fillLight.position.set(4, 1, 4);
    scene.add(fillLight);
    scene.add(new THREE.HemisphereLight(0xd9e8ff, 0x241322, 1.15));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let targetProgress = 0;
    let progress = 0;
    let frame = 0;
    let viewportHeight = window.innerHeight;
    let viewportWidth = window.innerWidth;

    const updateTarget = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      if (!frame) frame = requestAnimationFrame(animate);
    };

    const resize = () => {
      viewportHeight = window.innerHeight;
      viewportWidth = window.innerWidth;
      const aspect = viewportWidth / Math.max(1, viewportHeight);
      const halfHeight = 4;
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(viewportWidth, viewportHeight, false);
      updateTarget();
    };

    const animate = () => {
      const difference = targetProgress - progress;
      progress = reduceMotion ? targetProgress : progress + difference * 0.09;
      const settled = Math.abs(targetProgress - progress) < 0.0007;
      if (settled) progress = targetProgress;

      const halfHeight = 4;
      const worldWidth = halfHeight * 2 * (viewportWidth / Math.max(1, viewportHeight));
      const swing = reduceMotion ? 0 : Math.sin(progress * Math.PI * 8) * 0.11;
      const bob = reduceMotion ? 0 : Math.sin(progress * Math.PI * 12) * 0.06;

      group.position.set(worldWidth * 0.34 + Math.sin(progress * 10) * 0.08, halfHeight + 1.55 - progress * (halfHeight * 2 + 3.2) + bob, 0);
      group.rotation.z = swing;
      tail.rotation.z = reduceMotion ? 0 : Math.sin(progress * Math.PI * 10 + 0.8) * 0.12;
      legs[0].rotation.z = reduceMotion ? 0 : Math.sin(progress * Math.PI * 8 + 0.5) * 0.055;
      legs[1].rotation.z = reduceMotion ? 0 : Math.sin(progress * Math.PI * 8 - 0.5) * 0.055;
      group.scale.setScalar(viewportWidth < 640 ? 0.56 : 0.66);
      group.updateMatrixWorld(true);

      const ropeStart = new THREE.Vector3(worldWidth * 0.34, halfHeight + 0.12, 0.08);
      const ropeEnd = group.localToWorld(new THREE.Vector3(0.015, -0.34, 0.02));
      const ropeVisible = ropeEnd.y < ropeStart.y;
      const ropeSway = reduceMotion ? 0 : Math.sin(progress * Math.PI * 8) * 0.08;
      const ropePoint = (t: number) => new THREE.Vector3(
        THREE.MathUtils.lerp(ropeStart.x, ropeEnd.x, t) + Math.sin(Math.PI * t) * ropeSway,
        THREE.MathUtils.lerp(ropeStart.y, ropeEnd.y, t) - Math.sin(Math.PI * t) * 0.025,
        THREE.MathUtils.lerp(ropeStart.z, ropeEnd.z, t),
      );
      ropeSegments.forEach((rope, index) => {
        rope.visible = ropeVisible;
        if (!ropeVisible) return;
        const from = ropePoint(index / ropeSegments.length);
        const to = ropePoint((index + 1) / ropeSegments.length);
        const direction = new THREE.Vector3().subVectors(to, from);
        rope.position.copy(from).add(to).multiplyScalar(0.5);
        rope.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
        rope.scale.y = direction.length();
      });

      renderer.render(scene, camera);
      if (settled) {
        frame = 0;
      } else {
        frame = requestAnimationFrame(animate);
      }
    };

    resize();
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', resize);
      if (frame) cancelAnimationFrame(frame);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full pointer-events-none select-none"
      style={{ opacity: 0.94 }}
    />
  );
};

export default MonkeyBackground;
