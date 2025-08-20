// Select the canvas element where the 3D scene will be drawn
const canvas = document.querySelector('canvas.webgl');

// Create a new 3D scene, a container for all objects
const scene = new THREE.Scene();

// Define the planet's color; change this hex code to alter the planet's color
const planetColor = '#8B7355';
// Create a sphere for the planet: 1 is radius, 32x32 are segments for smoothness
const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial({ color: planetColor });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

// Parameters object to control the rings' appearance
const parameters = {
  count: 120000,
  radiusInner: 1.5,
  radiusOuter: 6,
  size: 0.02,
  randomness: 0.2,
  randomnessPower: 3,
  rings: 3,
  insideColor: '#C4A484',
  outsideColor: '#E8DCC0'
};

// Variables for ring geometry, material, and points
let ringGeometry = null;
let ringMaterial = null;
let ringPoints = null;

// Vertex shader: Positions and colors ring particles
const vertexShader = `
  varying vec3 vColor;
  void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = 10.0 / -mvPosition.z;
      gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment shader: Makes particles circular with a fade-out effect
const fragmentShader = `
  varying vec3 vColor;
  void main() {
      float dist = length(gl_PointCoord - vec2(0.5, 0.5));
      if (dist > 0.5) discard;
      gl_FragColor = vec4(vColor, 1.0 - dist);
  }
`;

// Function to generate the rings based on parameters
const generateRings = () => {
  if (ringPoints !== null) {
    ringGeometry.dispose();
    ringMaterial.dispose();
    scene.remove(ringPoints);
  }

  ringGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const ringIndex = Math.floor(i / (parameters.count / parameters.rings));
    const randomRingOffset = Math.random() * 0.5;
    const ringRadiusInner = parameters.radiusInner + ringIndex * (1.2 + randomRingOffset);
    const ringRadiusOuter = ringRadiusInner + 1 + randomRingOffset;
    const radius = ringRadiusInner + Math.pow(Math.random() * (ringRadiusOuter - ringRadiusInner), 1.5);
    const angle = Math.random() * Math.PI * 2;

    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
    positions[i3 + 2] = Math.sin(angle) * radius;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, (radius - parameters.radiusInner) / (parameters.radiusOuter - parameters.radiusInner));
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  ringGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  ringGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  ringMaterial = new THREE.ShaderMaterial({
    vertexColors: true,
    transparent: true,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });

  ringPoints = new THREE.Points(ringGeometry, ringMaterial);
  scene.add(ringPoints);
};

generateRings();

// Set initial window size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Window resize handler
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Create camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
const elevationDegrees = 20;
const elevationRadians = THREE.MathUtils.degToRad(elevationDegrees);
const distance = 6;
const x = distance * Math.cos(elevationRadians);
const y = distance * Math.sin(elevationRadians);
const z = 0;
camera.position.set(x, y, z);
camera.lookAt(0, 0, 0);
scene.add(camera);

// Add controls
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(ambientLight, pointLight);

// Set up renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// Animation loop
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  planet.rotation.y = elapsedTime * 0.1;
  ringPoints.rotation.y = elapsedTime * 0.05;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

// Tilt planet and rings for Saturn-like appearance
planet.rotation.x = THREE.MathUtils.degToRad(-15);
ringPoints.rotation.x = THREE.MathUtils.degToRad(-15);