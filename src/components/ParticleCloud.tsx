import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';

const matcapDataURI = '/matcap.png';

// Simulation shader for a complete, stable, volumetric 3D particle donut (torus)
const simShader = `
uniform float uTime;
uniform float uHZ;
uniform sampler2D textureOrigin;
uniform sampler2D textureRandom;
uniform sampler2D uFluidVelocity;
uniform sampler2D uFluidDensity;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uCameraWorldMatrix;

vec3 snoise3(vec3 x) {
  float s1 = sin(x.y * 3.1415 + sin(x.z * 1.5)) * cos(x.x * 2.0);
  float s2 = sin(x.z * 3.1415 + sin(x.x * 1.5)) * cos(x.y * 2.0);
  float s3 = sin(x.x * 3.1415 + sin(x.y * 1.5)) * cos(x.z * 2.0);
  return vec3(s1, s2, s3);
}

vec3 curlNoise(vec3 p) {
  const float e = 0.05;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 p_x0 = snoise3(p - dx);
  vec3 p_x1 = snoise3(p + dx);
  vec3 p_y0 = snoise3(p - dy);
  vec3 p_y1 = snoise3(p + dy);
  vec3 p_z0 = snoise3(p - dz);
  vec3 p_z1 = snoise3(p + dz);

  float x = (p_y1.z - p_y0.z) - (p_z1.y - p_z0.y);
  float y = (p_z1.x - p_z0.x) - (p_x1.z - p_x0.z);
  float z = (p_x1.y - p_x0.y) - (p_y1.x - p_y0.x);

  return normalize(vec3(x, y, z) / (2.0 * e));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 posData = texture2D(texturePosition, uv);
  vec4 originData = texture2D(textureOrigin, uv);
  vec4 randData = texture2D(textureRandom, uv);

  vec3 pos = posData.xyz;
  vec3 origin = originData.xyz;

  // Donut geometry parameters
  float majorR = 0.46;
  float minorR = 0.17;

  // Nearest point on the core ring
  float r_xy = length(pos.xy);
  vec2 dir_xy = (r_xy > 1e-4) ? (pos.xy / r_xy) : vec2(1.0, 0.0);
  vec3 tubeCenter = vec3(dir_xy * majorR, 0.0);

  vec3 radial = pos - tubeCenter;
  float distToCore = length(radial);
  vec3 radialDir = (distToCore > 1e-4) ? (radial / distToCore) : vec3(0.0, 0.0, 1.0);

  // Swirling tangents
  vec3 ringTangent = vec3(-dir_xy.y, dir_xy.x, 0.0);
  vec3 poloidalTangent = cross(ringTangent, radialDir);

  // 1. Natural circulation around the donut
  pos += ringTangent * 0.0016 * uHZ;
  pos += poloidalTangent * 0.0006 * uHZ;

  // 2. Volumetric shape attractor: maintains full 3D body
  float targetDist = minorR * (0.45 + 0.55 * randData.w);
  pos -= radialDir * (distToCore - targetDist) * 0.12 * uHZ;

  // 3. Gentle anchor spring back to origin
  pos += (origin - pos) * 0.0015 * uHZ;

  // 4. Subtle atmospheric star dust curl
  pos += curlNoise(pos * 0.7 + uTime * 0.08) * 0.00035 * uHZ;

  // 5. Cursor fluid interaction in 3D
  vec4 worldPos = uModelMatrix * vec4(pos, 1.0);
  vec4 viewPos = uViewMatrix * worldPos;
  vec4 clipPos = uProjectionMatrix * viewPos;
  vec2 screenUV = (clipPos.xy / clipPos.w) * 0.5 + 0.5;

  if (screenUV.x >= 0.0 && screenUV.x <= 1.0 && screenUV.y >= 0.0 && screenUV.y <= 1.0) {
    vec2 fluidVel = texture2D(uFluidVelocity, screenUV).xy;
    float fluidDen = texture2D(uFluidDensity, screenUV).r;
    vec3 flow = vec3(fluidVel, 0.0);
    flow = (uCameraWorldMatrix * vec4(flow, 0.0)).xyz;
    pos += flow * 0.00045 * uHZ * fluidDen;
  }

  // Keep the torus opening clear, even when cursor forces push particles inward.
  float innerHoleRadius = majorR - minorR * 0.88;
  float radialDistance = length(pos.xy);
  if (radialDistance < innerHoleRadius) {
    vec2 radialDirection = radialDistance > 1e-4
      ? pos.xy / radialDistance
      : normalize(origin.xy);
    pos.xy = radialDirection * innerHoleRadius;
  }

  gl_FragColor = vec4(pos, 1.0);
}
`;

// Point render shaders with soft borderless falloff
const pointVertexShader = `
attribute vec2 uvPos;
attribute vec4 aRandom;

uniform sampler2D texturePosition;
uniform float uDPR;
uniform float uTime;

varying vec4 vRandom;
varying float vScale;
varying float vDist;
varying float vEdgeFade;

void main() {
  vec3 pos = texture2D(texturePosition, uvPos).xyz;
  vRandom = aRandom;

  // Soft spherical edge falloff: zero hard borders anywhere
  float distFromOrigin = length(pos);
  vEdgeFade = smoothstep(1.6, 0.8, distFromOrigin);

  pos *= mix(1.0, 1.35, pow(aRandom.y, 100.0));

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPos;

  float distToCamera = length(mvPos.xyz);
  vDist = distToCamera;

  float scale = smoothstep(2.5, 12.0, distToCamera) * mix(0.5, 1.0, aRandom.z);
  vScale = scale;

  gl_PointSize = max(1.5, 0.07 * uDPR * 2.0 * scale * (1000.0 / distToCamera));
}
`;

const pointFragmentShader = `
uniform sampler2D uMatcap;
uniform float uTime;

varying vec4 vRandom;
varying float vScale;
varying float vDist;
varying float vEdgeFade;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  if (length(coord) > 0.5) discard;

  // Soft spherical particle point
  float radialAlpha = smoothstep(0.5, 0.1, length(coord));

  // Base silver-white with high vibrancy
  vec3 baseColor = mix(vec3(0.4), vec3(1.0), vRandom.x);
  // Lavender accent highlights
  baseColor = mix(baseColor, vec3(0.72, 0.58, 1.0), pow(vRandom.z, 14.0));

  // Shimmer / sparkle
  float sparkle = 0.7 + (0.5 + sin(uTime * 3.5 + vRandom.y * 20.0)) * pow(vRandom.z, 8.0) * 2.0;

  // Spherical matcap reflection
  float angle = sin(uTime + vRandom.z * 20.0) * 0.5 + 1.0;
  float s = sin(angle);
  float c = cos(angle);
  mat2 rot = mat2(c, -s, s, c);
  vec2 matcapUV = rot * coord + vec2(0.5);
  vec4 matcapCol = texture2D(uMatcap, clamp(matcapUV, 0.0, 1.0));

  vec3 col = baseColor * sparkle * (0.65 + 0.35 * matcapCol.rgb) * vEdgeFade * radialAlpha;

  gl_FragColor = vec4(col, 1.0);
}
`;

// Fluid Splat & Advection Shaders
const fluidSplatShader = `
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec2 uPrevPoint;
uniform vec3 uColor;
uniform float uRadius;
uniform float uAspect;

varying vec2 vUv;

float lineDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba + 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv;
  p.x *= uAspect;
  vec2 a = uPrevPoint;
  a.x *= uAspect;
  vec2 b = uPoint;
  b.x *= uAspect;

  float d = lineDist(p, a, b);
  float splat = exp(-d * d / (uRadius * uRadius * 0.5));

  vec4 base = texture2D(uTarget, uv);
  gl_FragColor = base + vec4(uColor * splat, splat);
}
`;

const fluidAdvectShader = `
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform float uDt;
uniform float uDissipation;

varying vec2 vUv;

void main() {
  vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * 0.05;
  gl_FragColor = uDissipation * texture2D(uSource, coord);
}
`;

export const ParticleCloud: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMoonLoaded, setIsMoonLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Scene & Centered Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 1000);
    const baseCamPos = new THREE.Vector3(0, 0, 5.2);
    camera.position.copy(baseCamPos);
    camera.lookAt(0, 0, 0);

    // Complete 3D Donut - centered, perfectly proportioned so no parts are cut off
    const pointsGroup = new THREE.Group();
    pointsGroup.rotation.set(
      (-32 * Math.PI) / 180,
      (22 * Math.PI) / 180,
      (6 * Math.PI) / 180
    );

    const majorR = 0.46;
    const minorR = 0.17;

    const updateDonutFit = () => {
      const aspect = width / height;
      const fovRad = (camera.fov * Math.PI) / 180;
      const visibleH = 2 * Math.tan(fovRad / 2) * baseCamPos.z;
      const visibleW = visibleH * aspect;

      // Total outer donut diameter = 2 * (majorR + minorR) = 2 * (0.46 + 0.17) = 1.26
      const torusDiameter = (majorR + minorR) * 2;
      // Fit completely within viewport bounds with balanced margins so 100% of the donut is visible
      const maxAllowedH = visibleH * 0.91;
      const maxAllowedW = visibleW * 0.94;
      const fitDim = Math.min(maxAllowedH, maxAllowedW);
      const s = Math.max(0.88, Math.min(2.4, fitDim / torusDiameter));

      pointsGroup.scale.set(s, s, s);
      pointsGroup.position.set(0, -0.1, 0);
    };

    updateDonutFit();
    scene.add(pointsGroup);

    // Mouse Tracking & Gaze
    const mouse = { x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5, speed: 0, lastMoveTime: 0 };
    const targetCamPos = baseCamPos.clone();

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = (clientX - rect.left) / rect.width;
      mouse.y = 1.0 - (clientY - rect.top) / rect.height;

      const dx = mouse.x - mouse.prevX;
      const dy = mouse.y - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
      mouse.lastMoveTime = performance.now();

      // Camera gaze mapping
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      targetCamPos.x = baseCamPos.x + normX * -0.7;
      targetCamPos.y = baseCamPos.y + normY * 0.9;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    // Fluid Simulation Setup (Ping-Pong FBOs)
    const fluidRes = 256;
    const createFBO = () =>
      new THREE.WebGLRenderTarget(fluidRes, fluidRes, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      });

    let velFBO1 = createFBO();
    let velFBO2 = createFBO();
    let denFBO1 = createFBO();
    let denFBO2 = createFBO();

    const fluidQuadScene = new THREE.Scene();
    const fluidQuadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const fluidQuadGeom = new THREE.PlaneGeometry(2, 2);

    const splatMat = new THREE.ShaderMaterial({
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
      fragmentShader: fluidSplatShader,
      uniforms: {
        uTarget: { value: null },
        uPoint: { value: new THREE.Vector2(0.5, 0.5) },
        uPrevPoint: { value: new THREE.Vector2(0.5, 0.5) },
        uColor: { value: new THREE.Vector3(0, 0, 0) },
        uRadius: { value: 0.05 },
        uAspect: { value: width / height },
      },
    });

    const advectMat = new THREE.ShaderMaterial({
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
      fragmentShader: fluidAdvectShader,
      uniforms: {
        uVelocity: { value: null },
        uSource: { value: null },
        uDt: { value: 1 / 60 },
        uDissipation: { value: 0.98 },
      },
    });

    const quadMesh = new THREE.Mesh(fluidQuadGeom, splatMat);
    fluidQuadScene.add(quadMesh);

    // Particle GPGPU setup (65,536 particles forming a dense starry torus)
    const isMobile = width <= 768;
    const SIM_WIDTH = isMobile ? 144 : 288;
    const TOTAL_PARTICLES = SIM_WIDTH * SIM_WIDTH;

    const gpuCompute = new GPUComputationRenderer(SIM_WIDTH, SIM_WIDTH, renderer);
    if (!renderer.capabilities.isWebGL2) {
      gpuCompute.setDataType(THREE.HalfFloatType);
    }

    const dtPosition = gpuCompute.createTexture();
    const dtOrigin = gpuCompute.createTexture();
    const dtRandom = gpuCompute.createTexture();

    const posArr = dtPosition.image.data as Float32Array;
    const origArr = dtOrigin.image.data as Float32Array;
    const randArr = dtRandom.image.data as Float32Array;

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const i4 = i * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const r = minorR * Math.sqrt(0.2 + 0.8 * Math.random());

      const px = (majorR + r * Math.cos(phi)) * Math.cos(theta);
      const py = (majorR + r * Math.cos(phi)) * Math.sin(theta);
      const pz = r * Math.sin(phi);

      posArr[i4 + 0] = px;
      posArr[i4 + 1] = py;
      posArr[i4 + 2] = pz;
      posArr[i4 + 3] = 1.0;

      origArr[i4 + 0] = px;
      origArr[i4 + 1] = py;
      origArr[i4 + 2] = pz;
      origArr[i4 + 3] = 1.0;

      randArr[i4 + 0] = Math.random();
      randArr[i4 + 1] = Math.random();
      randArr[i4 + 2] = Math.random();
      randArr[i4 + 3] = Math.random();
    }

    const posVariable = gpuCompute.addVariable('texturePosition', simShader, dtPosition);
    gpuCompute.setVariableDependencies(posVariable, [posVariable]);

    posVariable.material.uniforms.uTime = { value: 0.0 };
    posVariable.material.uniforms.uHZ = { value: 1.0 };
    posVariable.material.uniforms.textureOrigin = { value: dtOrigin };
    posVariable.material.uniforms.textureRandom = { value: dtRandom };
    posVariable.material.uniforms.uFluidVelocity = { value: velFBO1.texture };
    posVariable.material.uniforms.uFluidDensity = { value: denFBO1.texture };
    posVariable.material.uniforms.uModelMatrix = { value: pointsGroup.matrixWorld };
    posVariable.material.uniforms.uViewMatrix = { value: camera.matrixWorldInverse };
    posVariable.material.uniforms.uProjectionMatrix = { value: camera.projectionMatrix };
    posVariable.material.uniforms.uCameraWorldMatrix = { value: camera.matrixWorld };

    const error = gpuCompute.init();
    if (error !== null) {
      console.error('GPUCompute error:', error);
    }

    // Geometry & Points Material
    const pointGeom = new THREE.BufferGeometry();
    const uvPosArr = new Float32Array(TOTAL_PARTICLES * 2);
    const randAttrArr = new Float32Array(TOTAL_PARTICLES * 4);

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const x = (i % SIM_WIDTH) / SIM_WIDTH;
      const y = Math.floor(i / SIM_WIDTH) / SIM_WIDTH;
      uvPosArr[i * 2 + 0] = x;
      uvPosArr[i * 2 + 1] = y;

      randAttrArr[i * 4 + 0] = randArr[i * 4 + 0];
      randAttrArr[i * 4 + 1] = randArr[i * 4 + 1];
      randAttrArr[i * 4 + 2] = randArr[i * 4 + 2];
      randAttrArr[i * 4 + 3] = randArr[i * 4 + 3];
    }

    pointGeom.setAttribute('uvPos', new THREE.BufferAttribute(uvPosArr, 2));
    pointGeom.setAttribute('aRandom', new THREE.BufferAttribute(randAttrArr, 4));
    pointGeom.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(TOTAL_PARTICLES * 3), 3)
    );

    const textureLoader = new THREE.TextureLoader();
    const matcapTex = textureLoader.load(matcapDataURI);

    const pointMaterial = new THREE.ShaderMaterial({
      vertexShader: pointVertexShader,
      fragmentShader: pointFragmentShader,
      uniforms: {
        texturePosition: { value: null },
        uDPR: { value: Math.min(window.devicePixelRatio, 2) },
        uTime: { value: 0.0 },
        uMatcap: { value: matcapTex },
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(pointGeom, pointMaterial);
    pointsGroup.add(particlesMesh);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      updateDonutFit();
      renderer.setSize(width, height);
      pointMaterial.uniforms.uDPR.value = Math.min(window.devicePixelRatio, 2);
      splatMat.uniforms.uAspect.value = width / height;
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let lastTime = performance.now();
    let animId: number;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const HZ = dt * 60;

      // Camera gaze
      camera.position.lerp(targetCamPos, 0.05);
      camera.lookAt(0, 0, 0);


      // Fluid Simulation
      if (mouse.speed > 0.0001 && now - mouse.lastMoveTime < 100) {
        const dx = (mouse.x - mouse.prevX) * width;
        const dy = (mouse.y - mouse.prevY) * height;
        const speed = Math.min(mouse.speed * 80.0, 10.0);

        // Splat Velocity
        splatMat.uniforms.uTarget.value = velFBO1.texture;
        splatMat.uniforms.uPoint.value.set(mouse.x, mouse.y);
        splatMat.uniforms.uPrevPoint.value.set(mouse.prevX, mouse.prevY);
        splatMat.uniforms.uColor.value.set(dx * speed * 0.2, dy * speed * 0.2, 1.0);
        splatMat.uniforms.uRadius.value = 0.055;
        quadMesh.material = splatMat;
        renderer.setRenderTarget(velFBO2);
        renderer.render(fluidQuadScene, fluidQuadCam);
        [velFBO1, velFBO2] = [velFBO2, velFBO1];

        // Splat Density
        splatMat.uniforms.uTarget.value = denFBO1.texture;
        splatMat.uniforms.uColor.value.set(1.0, 1.0, 1.0);
        splatMat.uniforms.uRadius.value = 0.06;
        renderer.setRenderTarget(denFBO2);
        renderer.render(fluidQuadScene, fluidQuadCam);
        [denFBO1, denFBO2] = [denFBO2, denFBO1];
      }

      // Advect Velocity
      advectMat.uniforms.uVelocity.value = velFBO1.texture;
      advectMat.uniforms.uSource.value = velFBO1.texture;
      advectMat.uniforms.uDt.value = dt;
      advectMat.uniforms.uDissipation.value = 0.98;
      quadMesh.material = advectMat;
      renderer.setRenderTarget(velFBO2);
      renderer.render(fluidQuadScene, fluidQuadCam);
      [velFBO1, velFBO2] = [velFBO2, velFBO1];

      // Advect Density
      advectMat.uniforms.uSource.value = denFBO1.texture;
      advectMat.uniforms.uDissipation.value = 0.97;
      renderer.setRenderTarget(denFBO2);
      renderer.render(fluidQuadScene, fluidQuadCam);
      [denFBO1, denFBO2] = [denFBO2, denFBO1];

      // GPGPU Simulation Step
      pointsGroup.updateMatrixWorld();
      camera.updateMatrixWorld();
      posVariable.material.uniforms.uTime.value = now * 0.001;
      posVariable.material.uniforms.uHZ.value = HZ;
      posVariable.material.uniforms.uFluidVelocity.value = velFBO1.texture;
      posVariable.material.uniforms.uFluidDensity.value = denFBO1.texture;
      posVariable.material.uniforms.uModelMatrix.value = pointsGroup.matrixWorld;
      posVariable.material.uniforms.uViewMatrix.value = camera.matrixWorldInverse;
      posVariable.material.uniforms.uProjectionMatrix.value = camera.projectionMatrix;
      posVariable.material.uniforms.uCameraWorldMatrix.value = camera.matrixWorld;

      gpuCompute.compute();

      // Render to screen
      const curPosTex = gpuCompute.getCurrentRenderTarget(posVariable).texture;
      pointMaterial.uniforms.texturePosition.value = curPosTex;
      pointMaterial.uniforms.uTime.value = now * 0.001;

      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] w-full h-full block cursor-grab active:cursor-grabbing" />

      <div className="absolute left-1/2 top-[56%] z-[3] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <div
          className={`relative h-[150px] w-[150px] overflow-hidden rounded-full bg-transparent sm:h-[190px] sm:w-[190px] md:h-[220px] md:w-[220px] lg:h-[240px] lg:w-[240px] transition-all duration-700 ease-out ${isMoonLoaded ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-0'}`}
        >
          <iframe
            title="Moon 3D Model"
            src="https://sketchfab.com/models/870de693475d436c8e925ab0bcda4ca4/embed?autostart=1&transparent=1&ui_theme=dark&ui_controls=0&ui_infos=0&ui_watermark=0&ui_stop=0&ui_hint=0&ui_help=0&ui_settings=0&ui_fullscreen=0&ui_vr=0&ui_annotations=0&annotations_visible=false&ui_loading=0&preload=1&scrollwheel=0"
            onLoad={() => setIsMoonLoaded(true)}
            className="absolute inset-0 h-full w-full border-0 rounded-full overflow-hidden pointer-events-none"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            style={{ background: 'transparent', border: 'none', outline: 'none', filter: 'contrast(1.08) brightness(0.94) saturate(0.82)', mixBlendMode: 'screen' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ParticleCloud;
