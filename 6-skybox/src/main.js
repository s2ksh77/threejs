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
    10000 // far 성능적인 문제 때문에 범위를 적어준다.
  );

  camera.position.z = 5;

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.minDistance = 5;
  controls.maxDistance = 100;

  const textureLoader = new THREE.TextureLoader().setPath('assets/textures/Yokohama/');

  const images = ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'];

  const boxGeometry = new THREE.BoxGeometry(5000, 5000, 5000);

  const meterials = images.map(
    (image) =>
      new THREE.MeshBasicMaterial({
        map: textureLoader.load(image),
        side: THREE.BackSide,
      })
  );

  const skybox = new THREE.Mesh(boxGeometry, meterials);

  scene.add(skybox);

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
