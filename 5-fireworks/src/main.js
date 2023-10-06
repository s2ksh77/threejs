import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
    500 // far 성능적인 문제 때문에 범위를 적어준다.
  );

  camera.position.z = 5;

  new OrbitControls(camera, renderer.domElement);

  // const geometry = new THREE.SphereGeometry();
  const geometry = new THREE.BufferGeometry();

  const count = 10000;

  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = THREE.MathUtils.randFloatSpread(10); // x
    positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(10); // y
    positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(10); // z
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const meterial = new THREE.PointsMaterial({
    color: 0xccaaff,
    size: 0.01,
  });

  const points = new THREE.Points(geometry, meterial);

  scene.add(points);

  render();

  function render() {
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
}
