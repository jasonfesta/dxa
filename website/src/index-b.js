const scene = document.querySelector('.scene');
const cylinder = document.querySelector('.cylinder');
const items = [...document.querySelectorAll('.cylinder li')];

const state = {
  rotation: 0,
  targetRotation: 60,
  dragging: false,
  dragStartY: 0,
  dragStartScroll: 0,
  introComplete: false,
};

const introStartRotation = 0;
const focusRotation = 60;
const startRotation = -80;
const endRotation = 270;
let focusScrollY = 0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function maxScroll() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

function calculatePositions() {
  const radius = Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.4);
  const angleStep = 180 / items.length;

  items.forEach((item, index) => {
    const angle = index * angleStep;
    const radians = (angle * Math.PI) / 180;
    const y = Math.round(Math.sin(radians) * radius);
    const z = Math.round(Math.cos(radians) * radius);
    const rotation = index * -angleStep;

    item.style.transform = [
      'translate3d(-50%, -50%, 0)',
      `translate3d(0px, ${y}px, ${z}px)`,
      `rotateX(${rotation}deg)`,
    ].join(' ');
  });
}

function scrollToFocus() {
  const progress = (focusRotation - startRotation) / (endRotation - startRotation);
  focusScrollY = Math.round(maxScroll() * progress);
  window.scrollTo(0, focusScrollY);
}

function updateFromScroll() {
  if (!state.introComplete || state.dragging) {
    return;
  }

  const progress = clamp(window.scrollY / maxScroll(), 0, 1);
  if (Math.abs(window.scrollY - focusScrollY) <= 1) {
    state.targetRotation = focusRotation;
    return;
  }
  state.targetRotation = Number((startRotation + (endRotation - startRotation) * progress).toFixed(3));
}

function render() {
  const delta = state.targetRotation - state.rotation;
  state.rotation = Math.abs(delta) < 0.001 ? state.targetRotation : state.rotation + delta * 0.12;
  cylinder.style.transform = `rotateX(${Number(state.rotation.toFixed(3))}deg)`;
  requestAnimationFrame(render);
}

function finishIntro() {
  state.introComplete = true;
  scrollToFocus();
  state.rotation = focusRotation;
  state.targetRotation = focusRotation;
  updateFromScroll();
}

scene.addEventListener('pointerdown', (event) => {
  state.dragging = true;
  state.dragStartY = event.clientY;
  state.dragStartScroll = window.scrollY;
  scene.setPointerCapture(event.pointerId);
});

scene.addEventListener('pointermove', (event) => {
  if (!state.dragging) {
    return;
  }

  const nextScroll = Math.round(clamp(state.dragStartScroll - (event.clientY - state.dragStartY) * 3.2, 0, maxScroll()));
  window.scrollTo(0, nextScroll);
  const progress = nextScroll / maxScroll();
  state.targetRotation = startRotation + (endRotation - startRotation) * progress;
});

function endDrag(event) {
  state.dragging = false;
  if (scene.hasPointerCapture(event.pointerId)) {
    scene.releasePointerCapture(event.pointerId);
  }
  updateFromScroll();
}

scene.addEventListener('pointerup', endDrag);
scene.addEventListener('pointercancel', endDrag);
scene.addEventListener('dblclick', scrollToFocus);
window.addEventListener('scroll', updateFromScroll, { passive: true });
window.addEventListener('resize', () => {
  calculatePositions();
  updateFromScroll();
});

calculatePositions();
state.rotation = introStartRotation;
state.targetRotation = focusRotation;
requestAnimationFrame(render);
window.setTimeout(finishIntro, 1450);
