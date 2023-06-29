import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Card from './Card';
import GUI from 'lil-gui';

window.addEventListener('load', () => {
  init();
});

function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  const gui = new GUI();

  // renderer.setClearAlpha(0.5); // 0 에 가까울수록 투명
  // renderer.setClearColor('#00aaff', 0.5);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  // scene.background = new THREE.Color('#ffaa0a');

  const textureLoader = new THREE.TextureLoader();

  // const texture = textureLoader.load(
  //   'https://images.unsplash.com/photo-1503480207415-fdddcc21d5fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2t5JTIwdGV4dHVyZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80'
  // );
  // scene.background = texture;

  // 물체에 대한 원근감 표현 카메라
  const camera = new THREE.PerspectiveCamera(
    75, // fov 카메라의 각도
    window.innerWidth / window.innerHeight, //
    1, // near
    500 // far 성능적인 문제 때문에 범위를 적어준다.
  );

  camera.position.z = 25;

  const controls = new OrbitControls(camera, renderer.domElement);

  const card = new Card({ width: 10, height: 15.8, radius: 0.5, color: '#0077FF' });

  scene.add(card.mesh);

  const cardFolder = gui.addFolder('Card');

  cardFolder
    .add(card.mesh.material, 'roughness')
    .min(0)
    .max(1)
    .step(0.01)
    .name('material.roughness');

  cardFolder
    .add(card.mesh.material, 'metalness')
    .min(0)
    .max(1)
    .step(0.01)
    .name('material.metalness');

  const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.8);

  ambientLight.position.set(-5, -5, -5);

  scene.add(ambientLight);

  const directinalLight = new THREE.DirectionalLight('#ffffff', 0.6);

  const directinalLight2 = directinalLight.clone();

  directinalLight.position.set(1, 1, 3);
  directinalLight2.position.set(-1, 1, -3);

  scene.add(directinalLight, directinalLight2);

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
