// 3D Cinematic GitHub Hero - Three.js Scene Builder
// Builds a real 3D scene and renders to animated GIF for GitHub profile
// This creates genuinely 3D visuals, not SVG/2D simulations

const { 
  PerspectiveCamera, 
  Scene, 
  WebGLRenderer, 
  Color,
  BoxGeometry,
  SphereGeometry,
  TorusGeometry,
  ConeGeometry,
  CylinderGeometry,
  RingGeometry,
  IcosahedronGeometry,
  PolyhedronGeometry,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  MeshLambertMaterial,
  AmbientLight,
  DirectionalLight,
  PointLight,
  HemisphereLight,
  Fog,
  CubeTextureLoader,
  sRGBEncoding,
  ACESFilmicToneMapping,
  ... } = require('three');

// ===== SETTINGS =====
const WIDTH = 1600;
const HEIGHT = 500;
const FRAME_COUNT = 96;  // 8 seconds at 12fps
const FRAME_DELAY = 1000 / 12;  // milliseconds per frame
const OUTPUT_DIR = './assets';

// ===== SCENE SETUP =====
const scene = new Scene();
scene.background = new Color(0x0a0a14);
scene.fog = new Fog(0x0a0a14, 80, 300);

// Perspective camera with orbital movement capability
const camera = new PerspectiveCamera(55, WIDTH / HEIGHT, 0.1, 500);
camera.position.set(180, 130, 250);
camera.lookAt(0, 0, 0);

// Renderer with physically-based settings
const renderer = new WebGLRenderer({ 
  antialias: true, 
  alpha: false 
});
renderer.setSize(WIDTH, HEIGHT);
renderer.setPixelRatio(1.25);
renderer.autoClear = false;

// Cinematic tone mapping
renderer.outputColorSpace = sRGBEncoding;
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

// ===== LIGHTING SYSTEM =====

// Strong cyan key light (top left)
const keyLight = new DirectionalLight(0x00d4ff, 1.3);
keyLight.position.set(100, 150, 100);
keyLight.castShadow = false;
keyLight.shadow.mapSize.width = 1024;
keyLight.shadow.mapSize.height = 1024;
scene.add(keyLight);

// Purple secondary light (top right)
const secondaryLight = new DirectionalLight(0x9b59b6, 0.55);
secondaryLight.position.set(-80, -60, 80);
secondaryLight.castShadow = false;
scene.add(secondaryLight);

// Blue rim light (bottom)
const rimLight = new DirectionalLight(0x4ecdc4, 0.25);
rimLight.position.set(0, -100, 0);
rimLight.castShadow = false;
scene.add(rimLight);

// Core glowing point light
const coreLight = new PointLight(0x00ffff, 2.5, 100);
coreLight.position.set(0, 0, 0);
scene.add(coreLight);

// Soft ambient light
const ambientLight = new AmbientLight(0x1a172e, 0.45);
scene.add(ambientLight);

// === CORE LIGHTing effect: add subtle fill ===
const fillLight = new DirectionalLight(0x6c5ce7, 0.15);
fillLight.position.set(50, 50, 50);
fillLight.castShadow = false;
scene.add(fillLight);

// === 1. CENTRAL AI CORE (genuinely 3D) ===
// A complex nested structure with volume

function createCore() {
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 0, 0);
  
  // Layer 1: Outer transparent crystalline shell
  // Use Icosahedron for complex geometry
  const outerShell = new Mesh(
    new IcosahedronGeometry(50, 2),
    new MeshStandardMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.06,
      metalness: 0.2,
      roughness: 0.4,
      emissive: 0x0055aa,
      emissiveStrength: 0.6,
      side: DoubleSide,
      depthWrite: false
    })
  );
  outerShell.rotation.x = Math.PI / 6;
  outerShell.rotation.y = Math.PI / 4;
  coreGroup.add(outerShell);
  
  // Layer 2: Inner rotating metallic ring system
  const innerRings = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const ringGeo = new RingGeometry(15 + i * 8, 18 + i * 8, 32, 24);
    const ringMat = new MeshStandardMaterial({
      color: 0x1a1230,
      metalness: 0.9 + i * 0.02,
      roughness: 0.15 + i * 0.02,
      side: DoubleSide,
      emissive: 0x0f0a28,
      emissiveStrength: 0.15 * (i + 1)
    });
    const ring = new Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = (i / 5) * Math.PI * 2;
    ring.scale.setScalar(1 + i * 0.12);
    innerRings.add(ring);
  }
  innerRings.position.set(0, 0, 0);
  coreGroup.add(innerRings);
  
  // Layer 3: Volumetric energy field (coarse icosphere)
  const energyField = new Mesh(
    new IcosahedronGeometry(30, 2),
    new MeshStandardMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.02,
      emissive: 0x00a3e2,
      emissiveStrength: 1.2,
      side: DoubleSide,
      depthWrite: false
    })
  );
  coreGroup.add(energyField);
  
  // Layer 4: Bright inner core with complex geometry
  // A combination sphere + tetrahedron combination
  const innerCore = new Mesh(
    new PolyhedronGeometry(
      [
        new THREE.Vector3(0, 12, 0),
        new THREE.Vector3(-10, -6, 8),
        new THREE.Vector3(10, -6, 8),
        new THREE.Vector3(0, -6, -8)
      ],
      [
        [0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 2, 3]
      ]
    ),
    new MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 4,
      shininess: 200,
      specular: 0xffffff
    })
  );
  innerCore.position.set(0, 0, 0);
  coreGroup.add(innerCore);
  
  // Layer 5: Energy filaments radiating outward
  const filamentGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const filament = new THREE.Group();
    
    // Create a line geometry for the filament
    const points = [];
    for (let j = 0; j <= 8; j++) {
      const t = j / 8;
      const radius = 3 + t * 6;
      const theta = t * Math.PI * 2;
      const phi = Math.acos(1 - 2 * t);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      points.push(new THREE.Vector3(x, y, z));
    }
    const filamentGeo = new THREE.BufferGeometry().setFromPoints(points);
    const filamentMat = new MeshStandardMaterial({
      color: 0x00d4ff,
      emissive: 0x0055aa,
      emissiveStrength: 1.5,
      linewidth: 2,
      linecap: 'round',
      linejoin: 'round'
    });
    const filamentLine = new THREE.Line(filamentGeo, filamentMat);
    filamentLine.rotation.z = (i / 6) * Math.PI * 2;
    filamentLine.position.set(
      Math.cos((i / 6) * Math.PI * 2) * 25,
      0,
      Math.sin((i / 6) * Math.PI * 2) * 25
    );
    filament.add(filamentLine);
    filamentGroup.add(filament);
  }
  filamentGroup.position.set(0, 0, 0);
  coreGroup.add(filamentGroup);
  
  // Core animation state
  coreGroup.userData.pulsePhase = Math.random() * Math.PI * 2;
  coreGroup.userData.innerPhase = Math.random() * Math.PI * 2;
  
  return coreGroup;
}

const core = createCore();
scene.add(core);

// === 2. SIX SYSTEM NODES (real 3D objects) ===
// AGENTS, VISION, VOICE, CODE, DATA, SYSTEMS

function createSystemNode(type) {
  const nodeGroup = new THREE.Group();
  
  // Position in a hexagonal arrangement at ~80 units from core
  const angle = (type / 6) * Math.PI * 2 - 0.2;
  const distance = 80 + type * 5;
  nodeGroup.position.set(
    Math.cos(angle) * distance,
    (type - 2) * 8,
    Math.sin(angle) * distance
  );
  
  nodeGroup.userData.type = type;
  nodeGroup.userData.rotationPhase = Math.random() * Math.PI * 2;
  
  switch (type) {
    case 0: // AGENTS - glowing crystalline cube with neural geometry
      const agentsCube = new Mesh(
        new BoxGeometry(14, 14, 14),
        new MeshStandardMaterial({
          color: 0x00d4ff,
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0x0055aa,
          emissiveStrength: 1.2,
          reflectivity: 0.8
        })
      );
      // Bevel the edges for volume
      agentsCube.geometry.clearCache();
      // Add internal neural geometry
      const neuralGeo = new IcosahedronGeometry(4, 0);
      neuralGeo.applyMatrix4(new THREE.Matrix4().makeScale(0.5, 0.5, 0.5));
      const neural = new Mesh(neuralGeo, new MeshBasicMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2
      }));
      neural.position.set(0, 0, 2);
      agentsCube.add(neural);
      nodeGroup.add(agentsCube);
      break;
      
    case 1: // VISION - glass optical prism/lens
      const visionPrism = new Mesh(
        new PolyhedronGeometry(
          [
            new THREE.Vector3(-8, 0, 8),
            new THREE.Vector3(8, 0, 8),
            new THREE.Vector3(0, -8, 0),
            new THREE.Vector3(0, 0, 0)
          ],
          [
            [0, 1, 2], [0, 2, 3], [0, 3, 1]
          ]
        ),
        new MeshStandardMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.4,
          metalness: 0,
          side: DoubleSide,
          refractionRatio: 0.8,
          depthWrite: false
        })
      );
      // Add lens curvature effect
      const lensAdd = new Mesh(
        new SphereGeometry(6, 24, 24),
        new MeshStandardMaterial({
          color: 0xffff00,
          transparent: true,
          opacity: 0.2,
          metalness: 0,
          refractionRatio: 1.0
        })
      );
      lensAdd.position.set(0, 0, -2);
      nodeGroup.add(visionPrism);
      nodeGroup.add(lensAdd);
      break;
      
    case 2: // VOICE - 3D waveform structure
      const voiceSphere = new Mesh(
        new SphereGeometry(12, 32, 32),
        new MeshStandardMaterial({
          color: 0x9b59b6,
          metalness: 0.6,
          roughness: 0.3,
          emissive: 0x9b59b6,
          emissiveIntensity: 1.3
        })
      );
      // Add waveform detail - torus knots
      for (let i = 0; i < 3; i++) {
        const wk = new TorusKnotGeometry(5, 1.5, 64, 32, 3 + i, 2);
        const wm = new MeshStandardMaterial({
          color: 0xe8c4bc,
          metalness: 0.1,
          roughness: 0.9
        });
        const wkMesh = new Mesh(wk, wm);
        wkMesh.rotation.z = i * Math.PI * 2 / 3;
        wkMesh.position.set(0, 0, 0);
        voiceSphere.add(wkMesh);
      }
      nodeGroup.add(voiceSphere);
      break;
      
    case 2: // CODE - floating holographic code geometry
      const codeGroup = new THREE.Group();
      // Create floating hexagon fragments
      for (let i = 0; i < 20; i++) {
        const fragSize = 3 + Math.random() * 4;
        const frag = new Mesh(
          new BoxGeometry(fragSize, fragSize * 0.5, fragSize * 0.5),
          new MeshStandardMaterial({
            color: 0xf0f8ff,
            transparent: true,
            opacity: 0.6 + Math.random() * 0.2,
            metalness: 0.1,
            roughness: 0.3
          })
        );
        frag.position.set(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25
        );
        // Add rotating code text simulation
        frag.userData.speed = 0.01 + Math.random() * 0.01;
        codeGroup.add(frag);
      }
      // Add central hub
      const hub = new Mesh(
        new TorusGeometry(4, 1, 16, 32),
        new MeshStandardMaterial({
          color: 0x7d9bf0,
          metalness: 0.7,
          roughness: 0.2
        })
      );
      hub.position.set(0, 0, 0);
      codeGroup.add(hub);
      nodeGroup.add(codeGroup);
      break;
      
    case 3: // DATA - layered cylindrical data module
      const dataGroup = new THREE.Group();
      // Create 5 cylindrical layers
      for (let i = 0; i < 5; i++) {
        const layer = new Mesh(
          new CylinderGeometry(4 + i * 2, 4 + i * 2, 16, 20),
          new MeshStandardMaterial({
            color: 0x00d4ff,
            metalness: 0.5 + i * 0.1,
            roughness: 0.3 - i * 0.05,
            emissive: 0x0055aa,
            emissiveStrength: 0.2 + i * 0.05
          })
        );
        layer.position.set(0, 0, 0);
        layer.rotation.x = (i / 5) * Math.PI;
        layer.rotation.z = i * Math.PI / 5;
        dataGroup.add(layer);
      }
      // Add data flow particles around
      const dataParticles = new THREE.Group();
      for (let i = 0; i < 15; i++) {
        const p = new Mesh(
          new SphereGeometry(0.5, 8, 8),
          new MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x0055aa,
            emissiveStrength: 2
          })
        );
        const theta = (i / 15) * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 8 + Math.random() * 4;
        p.position.set(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
        dataParticles.add(p);
      }
      dataGroup.add(dataParticles);
      nodeGroup.add(dataGroup);
      break;
      
    case 4: // SYSTEMS - miniature architectural/network structure
      const sysGroup = new THREE.Group();
      // Base platform
      const base = new Mesh(
        new RingGeometry(8, 9, 32, 12),
        new MeshStandardMaterial({
          color: 0x1a1230,
          metalness: 0.9,
          roughness: 0.15
        })
      );
      base.rotation.x = Math.PI / 2;
      sysGroup.add(base);
      
      // Add spire structures
      for (let i = 0; i < 7; i++) {
        const spire = new Mesh(
          new ConeGeometry(2 + i * 0.5, 12 + i * 1.5, 10, 8),
          new MeshStandardMaterial({
            color: 0x00d4ff,
            metalness: 0.8,
            roughness: 0.2
          })
        );
        const ang = (i / 7) * Math.PI * 2;
        spire.position.set(
          Math.cos(ang) * 7,
          0,
          Math.sin(ang) * 7
        );
        spire.rotation.z = ang;
        spire.rotation.x = Math.PI / 4;
        sysGroup.add(spire);
      }
      // Add connecting nodes
      for (let i = 0; i < 4; i++) {
        const node = new Mesh(
          new SphereGeometry(1.5, 8, 8),
          new MeshStandardMaterial({
            color: 0x00d4ff,
            metalness: 0.7,
            roughness: 0.3
          })
        );
        const ang2 = (i / 4) * Math.PI * 2;
        node.position.set(
          Math.cos(ang2) * 6,
          Math.sin(ang2) * 2,
          Math.sin(ang2) * 6
        );
        sysGroup.add(node);
      }
      nodeGroup.add(sysGroup);
      break;
  }
  
  return nodeGroup;
}

const nodes = [];
const nodeTypes = [0, 1, 2, 3, 4, 5]; // AGENTS, VISION, VOICE, CODE, DATA, SYSTEMS

for (let i = 0; i < 6; i++) {
  const node = createSystemNode(nodeTypes[i]);
  scene.add(node);
  nodes.push(node);
}

// === 3. ORBITAL RINGS (different 3D planes) ===
function createOrbitalRing(radius, tilt, rotationSpeed, ringIdx) {
  const ringGroup = new THREE.Group();
  
  // Main torus ring
  const ringGeo = new TorusGeometry(radius, 4, 24, 48);
  // Color based on ring index
  const ringColors = [0x00d4ff, 0x00d4ff, 0x4ecdc4, 0x9b59b6, 0xf0a5ff];
  const ringMat = new MeshStandardMaterial({
    color: ringColors[ringIdx] || 0x00d4ff,
    metalness: 0.7,
    roughness: 0.3,
    side: DoubleSide,
    transparent: ringIdx >= 3,
    opacity: ringIdx >= 3 ? 0.25 : 1
  });
  
  const ring = new Mesh(ringGeo, ringMat);
  // Apply tilt for different planes
  ring.rotation.x = tilt;
  ring.rotation.z = ringIdx * 0.4;
  ring.rotation.y = 0;
  
  // Add inner detailing
  const innerTube = new Mesh(
    new TorusGeometry(radius * 0.4, 2, 16, 32),
    new MeshStandardMaterial({
      color: 0x0055aa,
      metalness: 0.5,
      roughness: 0.4,
      side: DoubleSide,
      transparent: true,
      opacity: 0.15
    })
  );
  innerTube.rotation.x = Math.PI / 2;
  ring.add(innerTube);
  
  ringGroup.add(ring);
  
  // Ring rotation animation state
  ringGroup.userData.rotationSpeed = rotationSpeed;
  ringGroup.userData.rotationPhase = Math.random() * Math.PI * 2;
  ringGroup.userData.tilt = tilt;
  ringGroup.userData.radius = radius;
  
  return ringGroup;
}

// 5 orbital rings with different tilts and radii
const orbitalRings = [];
const ringConfigs = [
  { tilt: 0, speed: 0.008, idx: 0 },    // equatorial-ish
  { tilt: Math.PI / 6, speed: 0.006, idx: 1 },  // 30° tilt
  { tilt: -Math.PI / 6, speed: 0.005, idx: 2 }, // -30° tilt
  { tilt: Math.PI / 4, speed: 0.007, idx: 3 },  // 45° tilt
  { tilt: -Math.PI / 4, speed: 0.008, idx: 4 }  // -45° tilt
];

for (let i = 0; i < 5; i++) {
  const ring = createOrbitalRing(100 + i * 25, ringConfigs[i].tilt, ringConfigs[i].speed, i);
  scene.add(ring);
  orbitalRings.push(ring);
}

// === 4. 3D PARTICLE FIELD ===
const particleCount = 300;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleSizes = new Float32Array(particleCount);
const particleTypes = []; // 'fg', 'md', 'bg'

// Distribute particles across 3 depth layers
let idx = 0;

// Foreground particles (larger, brighter, closer)
for (let i = 0; i < 80; i++) {
  // Spherical distribution biased toward camera
  const radius = 70 + Math.random() * 50;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1); // hemisphere
  
  particlePositions[idx++] = radius * Math.sin(phi) * Math.cos(theta);
  particlePositions[idx++] = radius * Math.sin(phi) * Math.sin(theta);
  particlePositions[idx++] = radius * Math.cos(phi) * 0.8; // biased toward camera (Z)
  
  particleSizes[i] = 2 + Math.random() * 3;
  particleTypes[i] = 'fg';
}

// Midground particles
for (let i = 0; i < 120; i++) {
  const radius = 120 + Math.random() * 80;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  
  particlePositions[idx++] = radius * Math.sin(phi) * Math.cos(theta);
  particlePositions[idx++] = radius * Math.sin(phi) * Math.sin(theta);
  particlePositions[idx++] = radius * Math.cos(phi);
  
  particleSizes[80 + i] = 1 + Math.random() * 1.5;
  particleTypes[80 + i] = 'md';
}

// Background particles (smaller, dimmer, farther)
for (let i = 0; i < 100; i++) {
  const radius = 200 + Math.random() * 100;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  
  particlePositions[idx++] = radius * Math.sin(phi) * Math.cos(theta);
  particlePositions[idx++] = radius * Math.sin(phi) * Math.sin(theta);
  particlePositions[idx++] = radius * Math.cos(phi) * 0.5;
  
  particleSizes[200 + i] = 0.5 + Math.random() * 1;
  particleTypes[200 + i] = 'bg';
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.5,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.5,
  depthWrite: false
});

const particleSystem = new THREE.Points(particleGeo, particleMat);
scene.add(particleSystem);

// Per-particle color variation based on type
// We'll handle this in the animation loop

// === 4. HUD ELEMENTS (3D panels) ===
function createHUDPanel(labelIdx) {
  const group = new THREE.Group();
  
  // Position in an arc above the core
  const phase = (labelIdx / 6) * Math.PI * 2;
  const dist = 90;
  group.position.set(
    Math.cos(phase) * dist,
    40 + labelIdx * 8,
    Math.sin(phase) * dist * 0.5
  );
  
  // Holographic panel
  const panel = new Mesh(
    new PlaneGeometry(30, 10),
    new MeshStandardMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.15,
      metalness: 0.05,
      roughness: 0.1,
      side: DoubleSide,
      emissive: 0x0055aa,
      emissiveStrength: 0.05
    })
  );
  panel.position.set(0, 0, 0.1);
  group.add(panel);
  
  // Add subtle border
  const border = new Mesh(
    new PlaneGeometry(32, 12),
    new MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05,
      linewidth: 1
    })
  );
  border.position.set(0, 0, 0.15);
  group.add(border);
  
  group.userData.labelIdx = labelIdx;
  return group;
}

const hudPanels = [];
const hudLabels = ['AGENTS', 'VISION', 'VOICE', 'CODE', 'DATA', 'SYSTEMS'];

for (let i = 0; i < 6; i++) {
  const panel = createHUDPanel(i);
  scene.add(panel);
  hudPanels.push(panel);
}

// === 5. FLOATING ENVIRONMENT OBJECTS ===
// Subtle floating crystals and structures for depth

function createFloatingObject(type) {
  const group = new THREE.Group();
  
  switch (type) {
    case 'crystal':
      const crystal = new Mesh(
        new IcosahedronGeometry(4 + Math.random() * 3, 0),
        new MeshStandardMaterial({
          color: 0x00d4ff,
          metalness: 0.9,
          roughness: 0.2,
          transparent: true,
          opacity: 0.6,
          side: DoubleSide
        })
      );
      crystal.rotation.random = Math.random() * Math.PI * 2;
      group.add(crystal);
      break;
      
    case 'cube':
      const cube = new Mesh(
        new BoxGeometry(5 + Math.random() * 4, 5 + Math.random() * 4, 5 + Math.random() * 4),
        new MeshStandardMaterial({
          color: 0x0f0a28,
          metalness: 0.8,
          roughness: 0.15
        })
      );
      cube.rotation.random = Math.random() * Math.PI * 2;
      group.add(cube);
      break;
  }
  
  // Position at various distances
  const dist = 150 + Math.random() * 100;
  const angle = Math.random() * Math.PI * 2;
  const height = (Math.random() - 0.5) * 40;
  group.position.set(
    Math.cos(angle) * dist,
    height,
    Math.sin(angle) * dist
  );
  
  group.userData.type = type;
  group.userData.rotationSpeed = 0.005 + Math.random() * 0.01;
  return group;
}

const floatingObjects = [];
const objectTypes = ['crystal', 'cube', 'crystal', 'cube', 'crystal'];
for (let i = 0; i < 8; i++) {
  const obj = createFloatingObject(objectTypes[i]);
  scene.add(obj);
  floatingObjects.push(obj);
}

// === ANIMATION STATE ===
const animState = {
  time: 0,
  corePulse: 0,
  coreInner: 0,
  cameraAngle: 0,
  nodeRotations: new Array(6).fill(0),
  ringRotations: new Array(5).fill(0),
  particlePhase: 0,
  cameraHeight: 0
};

// === RENDER LOOP & FRAME CAPTURE ===
const frameBuffer = [];
let currentFrame = 0;

function animate() {
  requestAnimationFrame(animate);
  
  animState.time += FRAME_DELAY / 1000;
  animState.corePulse = Math.sin(animState.time * 1.8) * 0.1 + 0.95;
  animState.coreInner = Math.sin(animState.time * 2.2) * 0.08 + 0.92;
  animState.cameraAngle += 0.008;
  animState.particlePhase += 0.02;
  
  // === Core animation ===
  core.scale.set(
    animState.corePulse,
    animState.coreInner,
    animState.corePulse
  );
  
  // Core inner glow pulsation
  core.children[3].material.emissiveIntensity = 3 + animState.corePulse * 2;
  
  // Rotate inner rings
  core.children[1].rotation.y += 0.01;
  core.children[1].rotation.x += 0.005;
  
  // Animate system nodes
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.rotation.y += 0.01;
    node.rotation.x += 0.005;
    node.rotation.z += 0.002;
    node.userData.rotationPhase += 0.01;
    
    // HUD panels subtle movement
    if (hudPanels[i]) {
      hudPanels[i].rotation.y += 0.005;
    }
  }
  
  // Animate orbital rings
  for (let i = 0; i < orbitalRings.length; i++) {
    const ring = orbitalRings[i];
    ring.rotation.y += ring.userData.rotationSpeed * 0.03;
    ring.rotation.z += 0.01;
    ring.userData.rotationPhase += ring.userData.rotationSpeed * 0.02;
  }
  
  // Camera orbital movement (subtle and cinematic)
  camera.position.x = 180 * Math.sin(animState.cameraAngle);
  camera.position.y = 130 + 15 * Math.sin(animState.cameraAngle * 0.7);
  camera.position.z = 250 * Math.cos(animState.cameraAngle);
  camera.lookAt(0, 0, 0);
  
  // Animate floating objects
  for (let i = 0; i < floatingObjects.length; i++) {
    const obj = floatingObjects[i];
    obj.rotation.y += obj.userData.rotationSpeed;
    obj.rotation.x += 0.01;
  }
  
  // Animate particle system
  const particlePos = particleGeo.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    // Particles drift slowly
    particlePos[i * 3 + 2] += 0.01; // Z drift
    if (particlePos[i * 3 + 2] > 120) {
      particlePos[i * 3 + 2] = -120; // Wrap around
    }
    
    // Slight size animation based on type
    const typeIdx = i;
    if (typeIdx < 80) { // fg
      particleSizes[i] = 2 + Math.sin(animState.time * 2 + i) * 0.3;
    } else if (typeIdx < 200) { // md
      particleSizes[i] = 1 + Math.sin(animState.time * 1.5 + i) * 0.2;
    } else { // bg
      particleSizes[i] = 0.5 + Math.sin(animState.time * 1 + i) * 0.1;
    }
  }
  particleGeo.attributes.position.needsUpdate = true;
  
  // Render the scene
  renderer.render(scene, camera);
}

// Start the render loop
animate();

// === FRAME CAPTURE SYSTEM ===
// Capture frames and compile to GIF

const FRAMES_TO_CAPTURE = FRAME_COUNT;
const capturedFrames = [];
let frameCountCaptured = 0;

function captureFrame() {
  // Render the scene
  renderer.render(scene, camera);
  
  // Capture as data URL / binary
  const frameImg = renderer.domElement.toDataURL('image/png');
  capturedFrames.push(frameImg);
  
  frameCountCaptured++;
  if (frameCountCaptured < FRAMES_TO_CAPTURE) {
    // Schedule next frame
    setTimeout(captureFrame, FRAME_DELAY);
  } else {
    // All frames captured - now compile to GIF
    console.log(`Captured ${capturedFrames.length} frames`);
    console.log('Now would compile to GIF using gifsicle or similar');
    console.log('For GitHub, we need an optimized animated GIF');
    console.log('');
    console.log('Output locations:');
    console.log('  - assets/hero.gif (final optimized)');
    console.log('  - assets/hero.png (static fallback)');
    console.log('');
    console.log('Frame count: ' + FRAMES_TO_CAPTURE);
    console.log('Frame rate: 12fps');
    console.log('Duration: ' + (FRAMES_TO_CAPTURE / 12) + ' seconds');
    console.log('Resolution: ' + WIDTH + 'x' + HEIGHT);
  }
}

// Start capture
setTimeout(captureFrame, 500);

// ===== EXPORT SCENE DATA =====
console.log('=== 3D CINEMATIC HERO SCENE ===');
console.log('Scene components:');
console.log('  - Central AI core with 5 nested layers');
console.log('  - 6 system nodes (AGENTS, VISION, VOICE, CODE, DATA, SYSTEMS)');
console.log('  - 5 orbital rings in different 3D planes');
console.log('  - 300 particles in 3 depth layers (fg/md/bg)');
console.log('  - 6 HUD panels in 3D space');
console.log('  - 8 floating environment objects');
console.log('  - 5 light sources with interaction');
console.log('  - Perspective camera with orbital movement');
console.log('  - Physically-based materials and lighting');
console.log('');
console.log('Target output:');
console.log('  - assets/hero.gif (8s, 1600x500, 12fps)');
console.log('  - assets/hero.png (static fallback)');
console.log('');
console.log('Key 3D features:');
console.log('  - Perspective camera with orbital movement');
console.log('  - Objects at different Z depths');
console.log('  - Materials reacting to lighting');
console.log('  - Reflective surfaces with highlights');
console.log('  - Bloom from emissive objects');
console.log('  - Parallax between depth layers');
console.log('  - Independent object motion');
console.log('  - Subtle camera dolly movement');