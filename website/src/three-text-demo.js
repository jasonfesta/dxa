import * as THREE from 'three';
import { Text } from 'three-text/three';

Text.setHarfBuzzPath('/hb/hb.wasm');

const canvas = document.querySelector('#three-text-canvas');
const textOverride = canvas?.dataset.text?.replaceAll('\\n', '\n');
const defaultSettings = {
  text: textOverride || 'SF\n9/29\nDesign\nxAgents\nMercor\nOpenAI\nPen.dev',
  size: 210,
  lineHeight: 0.92,
  depth: 0,
  camera: 720,
  panX: 0,
  panY: 0,
  rotation: 0.16,
  wave: 48,
  pulse: 28,
  speed: 2.2,
};
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(defaultSettings.panX, defaultSettings.panY, defaultSettings.camera);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const material = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor: { value: new THREE.Color(0x000000) },
    uWaveAmplitude: { value: defaultSettings.wave },
    uPulseAmplitude: { value: defaultSettings.pulse },
    uWaveSpeed: { value: defaultSettings.speed },
  },
  vertexShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uWaveAmplitude;
    uniform float uPulseAmplitude;
    uniform float uWaveSpeed;
    varying float vShade;

    void main() {
      vec3 transformed = position;
      float wave = sin((position.x * 0.018) + uTime * uWaveSpeed) * uWaveAmplitude;
      float pulse = cos((position.y * 0.024) - uTime * (uWaveSpeed * 0.78)) * uPulseAmplitude;
      float mouseLift = uMouse.x * 18.0 + uMouse.y * 10.0;
      transformed.z += wave + pulse + mouseLift;
      transformed.y += sin(uTime + position.x * 0.01) * 2.5;
      vShade = smoothstep(-20.0, 28.0, transformed.z);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying float vShade;

    void main() {
      float ink = mix(0.02, 0.22, vShade);
      gl_FragColor = vec4(vec3(ink), 1.0);
    }
  `,
});

let textMesh;
let textResult;
const settings = {
  ...defaultSettings,
};
const activePointers = new Map();
let pinchStartDistance = 0;
let viewTween;
let viewMode = 'default';

const viewTargets = {
  default: {
    camera: defaultSettings.camera,
    panX: defaultSettings.panX,
    panY: defaultSettings.panY,
  },
  fitLeft: {
    camera: 1500,
    panX: 0,
    panY: 0,
  },
};

function getVisibleSize(distance) {
  const height = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  return {
    width: height * camera.aspect,
    height,
  };
}

function updateDefaultTarget() {
  if (!textMesh?.geometry.boundingBox) {
    return;
  }

  const bounds = textMesh.geometry.boundingBox;
  const textHeight = bounds.max.y - bounds.min.y;
  const textWidth = bounds.max.x - bounds.min.x;
  const aspect = window.innerWidth / window.innerHeight;
  const cropWidth = textWidth * (aspect > 1.45 ? 0.84 : 0.78);
  const cropHeight = cropWidth / aspect;
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance = Math.min(2200, Math.max(460, cropHeight / (2 * Math.tan(fov / 2))));
  const visible = getVisibleSize(distance);

  viewTargets.default.camera = distance;
  viewTargets.default.panX = (bounds.min.x + bounds.max.x) / 2;
  viewTargets.default.panY = (bounds.min.y + bounds.max.y) / 2 + visible.height * 0.02;
}

function updateFitLeftTarget() {
  if (!textMesh?.geometry.boundingBox) {
    return;
  }

  const bounds = textMesh.geometry.boundingBox;
  const textHeight = bounds.max.y - bounds.min.y;
  const paddingPx = Math.max(24, Math.min(44, window.innerHeight * 0.035));
  const paddingRatio = paddingPx / window.innerHeight;
  const visibleHeight = textHeight / Math.max(0.1, 1 - paddingRatio * 2);
  const distance = Math.min(
    2400,
    Math.max(640, visibleHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2))),
  );
  const visible = getVisibleSize(distance);
  const paddingWorld = visible.height * paddingRatio;

  viewTargets.fitLeft.camera = distance;
  viewTargets.fitLeft.panX = bounds.min.x + visible.width / 2 - paddingWorld;
  viewTargets.fitLeft.panY = (bounds.min.y + bounds.max.y) / 2;
}

function applyCameraPosition() {
  camera.position.set(settings.panX, settings.panY, settings.camera);
}

function syncCamera() {
  applyCameraPosition();
}

function animateView(targetName) {
  if (targetName === 'default') {
    updateDefaultTarget();
  }

  if (targetName === 'fitLeft') {
    updateFitLeftTarget();
  }

  if (viewMode === targetName) {
    return;
  }

  viewMode = targetName;
  window.cancelAnimationFrame(viewTween);

  const target = viewTargets[targetName];
  const start = {
    camera: settings.camera,
    panX: settings.panX,
    panY: settings.panY,
  };
  const duration = 180;
  const startedAt = performance.now();

  function tick(now) {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    settings.camera = start.camera + (target.camera - start.camera) * eased;
    settings.panX = start.panX + (target.panX - start.panX) * eased;
    settings.panY = start.panY + (target.panY - start.panY) * eased;
    syncCamera();

    if (progress < 1) {
      viewTween = window.requestAnimationFrame(tick);
    } else {
      settings.camera = target.camera;
      settings.panX = target.panX;
      settings.panY = target.panY;
      syncCamera();
    }
  }

  viewTween = window.requestAnimationFrame(tick);
}

function panBy(deltaX, deltaY) {
  const worldPerPixel = settings.camera / 900;
  settings.panX -= deltaX * worldPerPixel;
  settings.panY += deltaY * worldPerPixel;
  applyCameraPosition();
}

function getPointerDistance() {
  const pointers = [...activePointers.values()];
  if (pointers.length < 2) {
    return 0;
  }
  return Math.hypot(pointers[0].x - pointers[1].x, pointers[0].y - pointers[1].y);
}

async function createText() {
  if (textMesh) {
    scene.remove(textMesh);
    textMesh.geometry.dispose();
  }

  textResult = await Text.create({
    text: settings.text,
    font: '/fonts/InstrumentSans.ttf',
    size: settings.size,
    depth: settings.depth,
    lineHeight: settings.lineHeight,
  });

  const geometry = textResult.geometry;
  geometry.computeBoundingBox();
  const center = new THREE.Vector3();
  geometry.boundingBox.getCenter(center);
  geometry.translate(-center.x, -center.y, -center.z);
  geometry.computeBoundingBox();

  textMesh = new THREE.Mesh(geometry, material);
  textMesh.rotation.x = -0.05;
  scene.add(textMesh);

  updateDefaultTarget();
  if (viewMode === 'default') {
    settings.camera = viewTargets.default.camera;
    settings.panX = viewTargets.default.panX;
    settings.panY = viewTargets.default.panY;
    syncCamera();
  }
}

createText().catch((error) => console.error(error));

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateDefaultTarget();
  updateFitLeftTarget();
  const target = viewTargets[viewMode];
  settings.camera = target.camera;
  settings.panX = target.panX;
  settings.panY = target.panY;
  syncCamera();
}

window.addEventListener('resize', resize);

canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  if (event.deltaY > 0) {
    animateView('fitLeft');
  } else if (event.deltaY < 0) {
    animateView('default');
  }
}, { passive: false });

canvas.addEventListener('pointerdown', (event) => {
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  canvas.setPointerCapture(event.pointerId);

  if (activePointers.size === 2) {
    pinchStartDistance = getPointerDistance();
  }
});

canvas.addEventListener('pointermove', (event) => {
  material.uniforms.uMouse.value.x = (event.clientX / window.innerWidth - 0.5) * 2;
  material.uniforms.uMouse.value.y = (event.clientY / window.innerHeight - 0.5) * -2;

  const previousPointer = activePointers.get(event.pointerId);
  if (!previousPointer) {
    return;
  }

  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (activePointers.size === 1) {
    panBy(event.clientX - previousPointer.x, event.clientY - previousPointer.y);
    return;
  }

  const pointerDistance = getPointerDistance();
  if (pointerDistance > 0 && pinchStartDistance > 0) {
    const pinchDelta = pointerDistance - pinchStartDistance;
    if (pinchDelta > 18) {
      animateView('fitLeft');
    } else if (pinchDelta < -18) {
      animateView('default');
    }
  }
});

function finishPointer(event) {
  activePointers.delete(event.pointerId);
  if (activePointers.size === 1) {
    pinchStartDistance = 0;
  }
}

canvas.addEventListener('pointerup', finishPointer);
canvas.addEventListener('pointercancel', finishPointer);
canvas.addEventListener('lostpointercapture', finishPointer);

canvas.addEventListener('dblclick', () => {
  animateView(viewMode === 'fitLeft' ? 'default' : 'fitLeft');
});

const clock = new THREE.Clock();

function animate() {
  material.uniforms.uTime.value = clock.getElapsedTime();
  if (textMesh) {
    textMesh.rotation.y = Math.sin(material.uniforms.uTime.value * 0.28) * settings.rotation;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
