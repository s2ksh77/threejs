import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import typeface from './assets/fonts/The Jamsil 3 Regular_Regular.json';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

window.addEventListener('load', () => {
  init();
});

function init() {
  const gui = new GUI();

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

  const fontLoader = new FontLoader();

  fontLoader.load(
    './assets/fonts/The Jamsil 3 Regular_Regular.json',
    (font) => {
      /** Text */
      const textGeometry = new TextGeometry('안녕 친구들', {
        font,
        size: 0.5,
        height: 0.1,
      });
      const textMeterial = new THREE.MeshPhongMaterial({ color: '#00C896' });

      const text = new THREE.Mesh(textGeometry, textMeterial);

      scene.add(text);
    }
    // (event) => {
    //   console.log('progress', event);
    // },
    // (error) => {
    //   console.log('error', error);
    // }
  );
  // const font = fontLoader.parse(typeface);

  /** AmbientLight */
  const ambientLight = new THREE.AmbientLight('#FFFFFF', 1);

  scene.add(ambientLight);

  const pointLight = new THREE.PointLight('#FFFFFF', 0.5);
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);

  pointLight.position.set(3, 0, 2);

  gui.add(pointLight.position, 'x').min(-3).max(3).step(0.1);

  scene.add(pointLight, pointLightHelper);

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
