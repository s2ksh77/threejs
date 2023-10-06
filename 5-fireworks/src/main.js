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

  const count = 1000;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = THREE.MathUtils.randFloatSpread(10); // x
    positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(10); // y
    positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(10); // z

    colors[i * 3] = Math.random();
    colors[i * 3 + 1] = Math.random();
    colors[i * 3 + 2] = Math.random();
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const meterial = new THREE.PointsMaterial({
    color: 0xccaaff,
    size: 0.1,
    vertexColors: true, // 각 정점마다 랜덤한 색상을 하겠다
  });

  const textureLoader = new THREE.TextureLoader();

  const texture = textureLoader.load('./assets/textures/particle.png');

  meterial.alphaMap = texture;
  meterial.transparent = true; // texture 입히고 배경을 안보이게
  meterial.depthWrite = false;

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
