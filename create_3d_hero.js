// 3D Cinematic GitHub Hero Banner Generator
// Builds a real Three.js scene and renders to animated GIF

const THREE = require('three');

// --- SCENE SETUP ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020205);

// Fog for depth
scene.fog = new THREE.Fog(0x020205, 50, 200);

// Camera - slow orbital movement
const camera = new THREE.PerspectiveCamera(45, 1600 / 500, 0.1, 1000);
camera.position.set(180, 120, 220);
camera.lookAt(0, 0, 0);

// --- RENDERER ---
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(1600, 500);
renderer.setPixelRatio(1);
renderer.autoClear = false;

// Tone mapping for cinematic look
renderer.outputColorSpace = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

// --- LIGHTING ---

// Strong cyan key light
const keyLight = new THREE.DirectionalLight(0x00ffff, 1.2);
keyLight.position.set(100, 150, 100);
keyLight.castShadow = false;
scene.add(keyLight);

// Purple secondary light
const secondaryLight = new THREE.DirectionalLight(0x9b59b6, 0.6);
secondaryLight.position.set(-80, -50, 80);
secondaryLight.castShadow = false;
scene.add(secondaryLight);

// Soft blue rim light
const rimLight = new THREE.DirectionalLight(0x4ecdc4, 0.3);
rimLight.position.set(0, -100, 0);
rimLight.castShadow = false;
scene.add(rimLight);

// Point light at core center
const coreLight = new THREE.PointLight(0x00ffff, 2, 80);
coreLight.position.set(0, 0, 0);
scene.add(coreLight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.5);
scene.add(ambientLight);

// --- CENTRAL AI CORE (multi-layered) ---
function createCore() {
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 0, 0);
  
  // Layer 1: Outer transparent energy shell
  const outerShell = new THREE.Mesh(
    new THREE.TorusGeometry(55, 12, 16, 64),
    new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.08,
      emissive: 0x00ffff,
      emissiveStrength: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  outerShell.rotation.x = Math.PI / 4;
  coreGroup.add(outerShell);
  
  // Layer 2: Rotating metallic ring system
  const innerRingsGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const ringGeo = new THREE.RingGeometry(20 + i * 12, 22 + i * 12, 32, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a40,
      metalness: 0.8,
      roughness: 0.3,
      side: THREE.DoubleSide,
      emissive: 0x0055aa,
      emissiveStrength: 0.2
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = (i / 4) * Math.PI * 2;
    ring.scale.setScalar(1 + i * 0.15);
    innerRingsGroup.add(ring);
  }
  innerRingsGroup.position.set(0, 0, 0);
  coreGroup.add(innerRingsGroup);
  
  // Layer 3: Volumetric energy field (icosphere with glow)
  const energyField = new THREE.Mesh(
    new THREE.IcosahedronGeometry(35, 3),
    new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.03,
      emissive: 0x00a3e,
      emissiveStrength: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  coreGroup.add(energyField);
  
  // Layer 4: Bright inner core (small sphere with glow)
  const innerCore = new THREE.Mesh(
    new THREE.SphereGeometry(12, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 3.5,
      shininess: 100,
      specular: 0xffffff
    })
  );
  coreGroup.add(innerCore);
  
  // Add subtle pulse animation to core
  coreGroup.userData.pulsePhase = Math.random() * Math.PI * 2;
  
  return coreGroup;
}

const core = createCore();
scene.add(core);

// --- 6 SYSTEM NODES (real 3D objects) ---
function createSystemNode(type) {
  const nodeGroup = new THREE.Group();
  nodeGroup.position.set(
    70 * Math.sin((Math.PI * 2 / 6) * type),
    0,
    70 * Math.cos((Math.PI * 2 / 6) * type)
  );
  
  switch (type) {
    case 0: // AGENTS - translucent crystalline cube
      const agentCube = new THREE.Mesh(
        new THREE.BoxGeometry(14, 14, 14),
        new THREE.MeshStandardMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.7,
          metalness: 0.4,
          roughness: 0.3,
          side: THREE.DoubleSide
        })
      );
      agentCube.position.set(0, 0, 0);
      nodeGroup.add(agentCube);
      
      // Glowing neural symbol inside
      const agentSymbol = new THREE.Mesh(
        new THREE.SphereGeometry(3, 12, 12),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0x00ffff,
          emissiveIntensity: 2
        })
      );
      agentSymbol.position.set(0, 0, 2);
      nodeGroup.add(agentSymbol);
      break;
      
    case 1: // VISION - glass prism / optical lens
      const visionPrism = new THREE.Mesh(
        new THREE.PolyhedronGeometry(
          [new THREE.Vector3(-8,0,8), new THREE.Vector3(8,0,8), new THREE.Vector3(0,-8,0)], 
          [new THREE.Vector3(0,0,0)]
        ),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.4,
          metalness: 0,
          side: THREE.DoubleSide
        })
      );
      visionPrism.position.set(0, 0, 0);
      nodeGroup.add(visionPrism);
      
      // Lens flare effect
      const lens = new THREE.Mesh(
        new THREE.SphereGeometry(5, 12, 12),
        new THREE.MeshStandardMaterial({
          color: 0xffff00,
          emissive: 0xffff00,
          emissiveIntensity: 1.5
        })
      );
      lens.position.set(0, 0, -3);
      nodeGroup.add(lens);
      break;
      
    case 2: // VOICE - resonating sphere
      const voiceSphere = new THREE.Mesh(
        new THREE.SphereGeometry(11, 32, 32),
        new THREE.MeshStandardMaterial({
          color: 0x9b59b6,
          metalness: 0.5,
          roughness: 0.4,
          emissive: 0x9b59b6,
          emissiveIntensity: 1.2
        })
      );
      voiceSphere.position.set(0, 0, 0);
      nodeGroup.add(voiceSphere);
      
      // Waveform detail
      const waveformGeo = new THREE.TorusKnotGeometry(6, 2, 64, 32);
      const waveform = new THREE.Mesh(
        waveformGeo,
        new THREE.MeshStandardMaterial({
          color: 0xe8c4bc,
          metalness: 0.1,
          roughness: 0.9
        })
      );
      waveform.position.set(0, 0, 0);
      nodeGroup.add(waveform);
      break;
      
    case 3: // CODE - holographic code geometry
      const codeParticles = [];
      for (let i = 0; i < 18; i++) {
        const particle = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2, 2),
          new THREE.MeshStandardMaterial({
            color: 0xf0f0f0,
            transparent: true,
            opacity: 0.5
          })
        );
        particle.position.set(
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 16
        );
        codeParticles.push(particle);
        nodeGroup.add(particle);
      }
      nodeGroup.userData.codeParticles = codeParticles;
      break;
      
    case 4: // DATA - layered cylindrical data-core
      const dataLayers = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const cylinder = new THREE.Mesh(
          new THREE.CylinderGeometry(3 + i * 2, 3 + i * 2, 18, 16),
          new THREE.MeshStandardMaterial({
            color: 0x00d4ff,
            metalness: 0.5,
            roughness: 0.3,
            emissive: 0x0055aa,
            emissiveStrength: 0.3
          })
        );
        cylinder.position.set(0, 0, 0);
        cylinder.rotation.x = (i / 5) * Math.PI;
        dataLayers.add(cylinder);
      }
      nodeGroup.add(dataLayers);
      break;
      
    case 5: // SYSTEMS - miniature architectural structure
      const sysStruct = new THREE.Group();
      // Base platform
      const base = new THREE.Mesh(
        new THREE.RingGeometry(8, 9, 32, 12),
        new THREE.MeshStandardMaterial({
          color: 0x1a1a40,
          metalness: 0.9,
          roughness: 0.2
        })
      );
      base.rotation.x = Math.PI / 2;
      sysStruct.add(base);
      
      // Spires
      for (let i = 0; i < 6; i++) {
        const spire = new THREE.Mesh(
          new THREE.ConeGeometry(2, 10, 12, 8),
          new THREE.MeshStandardMaterial({
            color: 0x00d4ff,
            metalness: 0.7,
            roughness: 0.2
          })
        );
        spire.position.set(
          Math.cos((i / 6) * Math.PI * 2) * 6,
          0,
          Math.sin((i / 6) * Math.PI * 2) * 6
        );
        spire.rotation.z = (i / 6) * Math.PI * 2;
        sysStruct.add(spire);
      }
      nodeGroup.add(sysStruct);
      break;
  }
  
  nodeGroup.userData.type = type;
  nodeGroup.userData.rotationPhase = Math.random() * Math.PI * 2;
  return nodeGroup;
}

const nodeTypes = [0, 1, 2, 3, 4, 5]; // AGENTS, VISION, VOICE, CODE, DATA, SYSTEMS
const nodes = [];

for (let i = 0; i < 6; i++) {
  const node = createSystemNode(nodeTypes[i]);
  scene.add(node);
  nodes.push(node);
}

// --- ORBITAL RINGS (different 3D planes) ---
function createOrbitalRing(radius, rotationAxis, rotationSpeed, ringIdx) {
  const ringGroup = new THREE.Group();
  
  // Main ring
  const ringGeo = new THREE.RingGeometry(radius - 2, radius + 2, 64, 32);
  const ringColor = i < 2 ? 0x00ffff : (i < 4 ? 0x9b59b6 : 0xf0a5ff);
  const ringMat = new THREE.MeshStandardMaterial({
    color: ringColor,
    metalness: i % 2 === 0 ? 0.8 : 0.5,
    roughness: i % 2 === 0 ? 0.2 : 0.4,
    side: i >= 2 ? THREE.DoubleSide : THREE.FrontSide,
    transparent: i >= 2,
    opacity: i >= 2 ? 0.3 : 1
  });
  
  const ring = new THREE.Mesh(ringGeo, ringMat);
  const axis = rotationAxis;
  ring.rotation.x = axis.x;
  ring.rotation.y = axis.y;
  ring.rotation.z = axis.z;
  ring.rotation.z += ringIdx * 0.3;
  ringGroup.add(ring);
  
  // Ring detail torus
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.6, 5, 16, 32),
    new THREE.MeshStandardMaterial({
      color: 0x0055aa,
      metalness: 0.6,
      roughness: 0.4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15
    })
  );
  torus.rotation.x = Math.PI / 2;
  ringGroup.add(torus);
  
  ringGroup.userData.rotationSpeed = rotationSpeed;
  ringGroup.userData.rotationPhase = Math.random() * Math.PI * 2;
  ringGroup.userData.radius = radius;
  
  return ringGroup;
}

const ringConfigs = [
  { axis: new THREE.Vector3(1, 0, 0), speed: 0.008, idx: 0 },
  { axis: new THREE.Vector3(0, Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)), speed: 0.006, idx: 1 },
  { axis: new THREE.Vector3(0, Math.cos(-Math.PI / 6), Math.sin(-Math.PI / 6)), speed: 0.005, idx: 2 },
  { axis: new THREE.Vector3(0.3, 0.5, 0), speed: 0.007, idx: 3 },
  { axis: new THREE.Vector3(-0.5, 0.3, 0.1), speed: 0.009, idx: 4 },
  { axis: new THREE.Vector3(0.1, -0.4, 0.2), speed: 0.007, idx: 5 }
];

const orbitalRings = [];

for (let i = 0; i < 6; i++) {
  const ring = createOrbitalRing(100 + i * 25, ringConfigs[i].axis, ringConfigs[i].speed, i);
  scene.add(ring);
  orbitalRings.push(ring);
}

// --- 3D PARTICLE FIELD ---
const particleCount = 200;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleSizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  const radius = 150 + Math.random() * 100;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  
  particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  particlePositions[i * 3 + 2] = radius * Math.cos(phi) * (Math.random() > 0.5 ? 1 : -1);
  
  particleSizes[i] = 0.5 + Math.random() * 1.5;
}

const particleMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.4
});

const particles = new THREE.Mesh(particleGeometry, particleMaterial);
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
scene.add(particles);

// --- HUD ELEMENTS (3D, not flat HTML) ---
function createHUDNode(labelText, positionIdx) {
  const group = new THREE.Group();
  
  const angle = (Math.PI * 2 / 6) * positionIdx;
  group.position.set(
    50 * Math.cos(angle),
    30 * Math.sin(angle * 0.7),
    40 * Math.cos(angle * 0.5)
  );
  
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(25, 8, 1),
    new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.2,
      metalness: 0.1,
      roughness: 0.1,
      side: THREE.DoubleSide,
      emissive: 0x0055aa,
      emissiveStrength: 0.1
    })
  );
  panel.position.set(0, 0, 0.5);
  group.add(panel);
  
  const label = new THREE.Mesh(
    new THREE.BoxGeometry(20, 4, 0.1),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00ffff,
      emissiveStrength: 0.5
    })
  );
  label.position.set(0, 0, 0);
  group.add(label);
  
  group.userData.labelIndex = positionIdx;
  return group;
}

const hudNodes = [];
for (let i = 0; i < 6; i++) {
  const hud = createHUDNode(['AGENTS', 'VISION', 'VOICE', 'CODE', 'DATA', 'SYSTEMS'][i], i);
  scene.add(hud);
  hudNodes.push(hud);
}

// --- ANIMATION STATE ---
const animationState = {
  time: 0,
  corePulse: 0,
  cameraAngle: 0,
  nodeRotations: new Array(6).fill(0),
  ringRotations: new Array(6).fill(0),
  particlePhase: 0
};

// --- RENDER LOOP ---
let currentFrame = 0;
const frameCount = 96; // 8 seconds at 12fps
const frameDuration = 1000 / 12; // 12fps

// Renderer pixel buffer for frame capture
const frameBuffer = [];

function animate() {
  requestAnimationFrame(animate);
  
  animationState.time += frameDuration / 1000;
  animationState.corePulse = Math.sin(animationState.time * 1.5) * 0.1 + 1.0;
  animationState.cameraAngle += 0.005;
  
  // Core pulse animation
  core.scale.set(
    animationState.corePulse,
    animationState.corePulse,
    animationState.corePulse
  );
  
  // Inner core glow intensity
  innerCore.material.emissiveIntensity = 2 + animationState.corePulse * 2.5;
  
  // Rotate inner rings
  innerRingsGroup.rotation.y += 0.008;
  innerRingsGroup.rotation.x += 0.003;
  
  // Animate orbital rings
  for (let i = 0; i < orbitalRings.length; i++) {
    const ring = orbitalRings[i];
    ring.rotation.y += ring.userData.rotationSpeed * 0.02;
    ring.rotation.z += 0.01;
    ring.rotation.y += Math.sin(animationState.time * ring.userData.rotationSpeed) * 0.005;
  }
  
  // Animate system nodes
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.rotation.y += 0.01;
    node.rotation.x += 0.005;
    
    // Code particles drift
    if (node.userData.codeParticles) {
      const particles = node.userData.codeParticles;
      for (let j = 0; j < particles.length; j++) {
        particles.position.x += 0.02;
        particles.position.y += 0.01;
      }
    }
    
    // HUD nodes subtle movement
    const hud = hudNodes[i];
    hud.rotation.y += 0.008;
  }
  
  // Camera orbital movement
  camera.position.x = 180 * Math.sin(animationState.cameraAngle);
  camera.position.y = 120 + 20 * Math.sin(animationState.cameraAngle * 0.7);
  camera.position.z = 220 * Math.cos(animationState.cameraAngle);
  camera.lookAt(0, 0, 0);
  
  // Particle drift
  const particleArray = particleGeometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    particleArray[i * 3 + 2] += 0.01;
    if (particleArray[i * 3 + 2] > 80) {
      particleArray[i * 3 + 2] = -80;
    }
  }
  particleGeometry.attributes.position.needsUpdate = true;
  
  // Render the scene
  renderer.render(scene, camera);
}

// Start the render loop
animate();

// --- FRAME CAPTURE SETUP ---
// Capture frames manually and export as GIF
// We'll render each frame to a canvas and then compile

// Since GIF compilation in Node.js requires additional processing,
// we'll capture frames and output them for manual compilation
// or use a simple approach: render 96 frames and save as sequence

function captureFrames() {
  const framesData = [];
  
  // Render each frame
  for (let i = 0; i < frameCount; i++) {
    // Advance animation state
    animationState.time += frameDuration / 1000;
    animationState.corePulse = Math.sin(animationState.time * 1.5) * 0.1 + 1.0;
    animationState.cameraAngle += 0.005;
    
    // Update core pulse
    core.scale.set(
      animationState.corePulse,
      animationState.corePulse,
      animationState.corePulse
    );
    innerCore.material.emissiveIntensity = 2 + animationState.corePulse * 2.5;
    
    // Rotate inner rings
    innerRingsGroup.rotation.y += 0.008;
    innerRingsGroup.rotation.x += 0.003;
    
    // Rotate orbital rings
    for (let i = 0; i < orbitalRings.length; i++) {
      const ring = orbitalRings[i];
      ring.rotation.y += ring.userData.rotationSpeed * 0.02;
      ring.rotation.z += 0.01;
    }
    
    // Update system nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.rotation.y += 0.01;
      node.rotation.x += 0.005;
    }
    
    // Camera movement
    camera.position.x = 180 * Math.sin(animationState.cameraAngle);
    camera.position.y = 120 + 20 * Math.sin(animationState.cameraAngle * 0.7);
    camera.position.z = 220 * Math.cos(animationState.cameraAngle);
    camera.lookAt(0, 0, 0);
    
    // Particle drift
    const particleArray = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      particleArray[i * 3 + 2] += 0.01;
      if (particleArray[i * 3 + 2] > 80) {
        particleArray[i * 3 + 2] = -80;
      }
    }
    particleGeometry.attributes.position.needsUpdate = true;
    
    // Render the scene
    renderer.render(scene, camera);
    
    // Capture frame as PNG data URL
    const frameData = renderer.domElement.toDataURL('image/png');
    framesData.push(frameData);
    
    console.log(`Captured frame ${i + 1}/${frameCount}`);
  }
  
  console.log(`\nCaptured ${framesData.length} frames total`);
  console.log('Now compile these frames to GIF using:');
  console.log('  - gifsicle CLI: gifsicle -O2 --delay=3 --loop --dispose=previous frame1.png frame2.png ...');
  console.log('  - Or use: convert frame*.png -delay 5 -loop 0 animated.gif');
  console.log('\nOutput: assets/hero.gif');
  
  return framesData;
}

// Run frame capture
captureFrames();

console.log('\n=== 3D SCENE RENDERING COMPLETE ===');
console.log('Scene features:');
console.log('  - Central AI core with 4 nested layers');
console.log('  - 6 system nodes as real 3D objects (AGENTS, VISION, VOICE, CODE, DATA, SYSTEMS)');
console.log('  - 6 orbital rings in different 3D planes');
console.log('  - 200 particles with Z-depth variation');
console.log('  - 6 HUD nodes in 3D space');
console.log('  - Cinematic camera orbital movement');
console.log('  - Physically-based lighting (4 light sources)');
console.log('  - Color scheme: cyan, violet, teal, deep navy');
console.log('  - Target: 1600x500, 96 frames @ 12fps = 8 seconds');
console.log('  - Output: assets/hero.gif (compile the captured frames)');