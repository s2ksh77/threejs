import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';
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

  const COLORS = ['#FF6E6E', '#31E0C1', '#006FFF', '#FFD732'];

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

  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.5;
  controls.rotateSpeed = 0.75; //드래그해서 회전되는 스피드
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.minPolarAngle = Math.PI / 2 - Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 2 + Math.PI / 3;

  const card = new Card({ width: 10, height: 15.8, radius: 0.5, color: COLORS[0] });

  card.mesh.rotation.z = Math.PI * 0.1;

  scene.add(card.mesh);

  gsap.to(card.mesh.rotation, { y: -Math.PI * 4, duration: 2.5, ease: 'back.out(2.5)' }); // y 축의 방향을 반대방향으로 두바퀴 돌려줌, 2.5초 동안 돌고 Greensock 홈페이지에서 확인

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
    controls.update();

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

  const container = document.querySelector('.container');
  COLORS.forEach((color) => {
    const button = document.createElement('button');

    button.style.backgroundColor = color;

    button.addEventListener('click', () => {
      card.mesh.material.color = new THREE.Color(color);

      gsap.to(card.mesh.rotation, {
        y: card.mesh.rotation.y - Math.PI / 2,
        duration: 1,
        ease: 'back.out(2.5)',
      });
    });

    container.appendChild(button);
  });
}
