import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Firework from './Firework';

window.addEventListener('load', () => {
  init();
});

function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  // 물체에 대한 원근감 표현 카메라
  const camera = new THREE.PerspectiveCamera(
    75, // fov 카메라의 각도
    window.innerWidth / window.innerHeight, //
    1, // near
    10000 // far 성능적인 문제 때문에 범위를 적어준다.
  );

  camera.position.z = 8000;

  // new OrbitControls(camera, renderer.domElement);

  const fireworks = [];

  const firework = new Firework({ x: 0, y: 0 });

  fireworks.push(firework);

  fireworks.update = function () {
    for (let i = 0; i < this.length; i++) {
      const firework = fireworks[i];

      firework.update();
    }
  };

  scene.add(firework.points);

  render();

  function render() {
    fireworks.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);
  }
  window.addEventListener('resize', () => {
    handleResize();
  });

  function handleMouseDown() {
    const firework = new Firework({
      x: THREE.MathUtils.randFloatSpread(8000),
      y: THREE.MathUtils.randFloatSpread(8000),
    });

    scene.add(firework.points);

    fireworks.push(firework);
  }

  window.addEventListener('mousedown', handleMouseDown);
}
