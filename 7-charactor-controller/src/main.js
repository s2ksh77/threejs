import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

window.addEventListener('load', () => {
  init();
});

async function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.outputEncoding = THREE.sRGBEncoding;

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

  camera.position.set(0, 5, 20);

  const loadingManager = new THREE.LoadingManager();

  const progressBar = document.querySelector('#progress-bar');
  const progressBarContainer = document.querySelector('#progress-bar-container');

  loadingManager.onProgress = (url, loaded, total) => {
    progressBar.value = (loaded / total) * 100;
  };

  loadingManager.onLoad = () => {
    progressBarContainer.style.display = 'none';
  };

  const gltfLoadr = new GLTFLoader(loadingManager);

  const gltf = await gltfLoadr.loadAsync('models/charactor.gltf');

  const model = gltf.scene;

  model.scale.set(0.1, 0.1, 0.1);

  scene.add(model);

  camera.lookAt(model.position);

  const hemisphereLight = new THREE.HemisphereLight(0xfffff, 0x33333);

  hemisphereLight.position.set(0, 20, 10);

  scene.add(hemisphereLight);

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
