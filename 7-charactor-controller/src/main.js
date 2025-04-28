import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { OrbitControls } from 'three/'

window.addEventListener('load', () => {
  init();
});

async function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.outputEncoding = THREE.sRGBEncoding;

  renderer.shadowMap.enabled = true;

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

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.minDistance = 15;
  controls.maxDistance = 25;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 3;

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

  const gltf = await gltfLoadr.loadAsync('models/character.gltf');

  const model = gltf.scene;

  model.scale.set(0.1, 0.1, 0.1);

  model.traverse(object => {
    if(object.isMesh) {
      object.castShadow = true;
    }
  })

  scene.add(model);

  camera.lookAt(model.position);

  const planeGeometry = new THREE.PlaneGeometry(10000, 10000, 10000);
  const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -7.5;
  plane.receiveShadow = true;

  scene.add(plane);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333);

  hemisphereLight.position.set(0, 20, 10);

  scene.add(hemisphereLight);

  const spotLight = new THREE.SpotLight(0xffffff, 1.5, 30, Math.PI * 0.15, 0.5, 0.5);

  spotLight.position.set(0, 20, 0);

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.radius = 8;

  scene.add(spotLight);

  const mixer = new THREE.AnimationMixer(model);

  const combatAnimation = gltf.animations.slice(0,5);
  const dancingAnimation = gltf.animations.slice(5);

  const buttons = document.querySelector('.actions');

  let currentAction;

  combatAnimation.forEach(animation => {
    const button = document.createElement('button');
    button.innerText = animation.name;
    buttons.appendChild(button);

    button.addEventListener('click', () => {
      const previousAction = currentAction;

      currentAction = mixer.clipAction(animation);

      if(previousAction !== currentAction) {
        previousAction.fadeOut(0.5);
        currentAction.reset().fadeIn(0.5).play();
      }
    })
  })

  const hasAnimation = gltf.animations.length !== 0;

  if(hasAnimation) {
    currentAction = mixer.clipAction(gltf.animations[0]);
    currentAction.play();
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const clock = new THREE.Clock();

  render();

  function render() {
    const delta = clock.getDelta();
    
    mixer.update(delta);

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

  function handlePointerDown(event) {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = -(event.clientY / window.innerHeight - 0.5) * 2;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    const object = intersects[0]?.object;
    if(object.name === 'Ch46') {
      const previousAction = currentAction;
      const index = Math.round(Math.random() * (dancingAnimation.length - 1))

      currentAction = mixer.clipAction(dancingAnimation[index]);

      currentAction.loop = THREE.LoopOnce;
      currentAction.clampWhenFinished = true;

      if(previousAction !== currentAction) {
        previousAction.fadeOut(0.5);
        currentAction.reset().fadeIn(0.5).play();
      }

      mixer.addEventListener('finished', handleFinished);

      function handleFinished() {
        mixer.removeEventListener('finished', handleFinished);

        const previousAction = currentAction;

        currentAction = mixer.clipAction(combatAnimation[0]);
        
        previousAction.fadeOut(0.5);
        currentAction.reset().fadeIn(0.5).play();
      }
    }
  }

  window.addEventListener('pointerdown', handlePointerDown)
}
