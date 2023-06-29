import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import typeface from "./assets/fonts/The Jamsil 3 Regular_Regular.json";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

window.addEventListener("load", () => {
  init();
});

async function init() {
  const gui = new GUI();

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();

  // 물체에 대한 원근감 표현 카메라
  const camera = new THREE.PerspectiveCamera(
    75, // fov 카메라의 각도
    window.innerWidth / window.innerHeight, //
    1, // near
    500 // far 성능적인 문제 때문에 범위를 적어준다.
  );

  camera.position.set(0, 1, 5);

  new OrbitControls(camera, renderer.domElement);

  const fontLoader = new FontLoader();

  const font = await fontLoader.loadAsync(
    "./assets/fonts/The Jamsil 3 Regular_Regular.json"
  );

  const textGeometry = new TextGeometry("Three.js Interactive Web", {
    font,
    size: 0.5,
    height: 0.1,
    bevelEnabled: true, // 경사진 면
    bevelSegments: 5,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });

  const textMeterial = new THREE.MeshPhongMaterial({ color: "#FFFFFF" });
  const text = new THREE.Mesh(textGeometry, textMeterial);
  text.castShadow = true; // 그림자 시작할 곳

  scene.add(text);

  // 뒤에 그림자가 비춰질 평면 추가
  const planGeometry = new THREE.PlaneGeometry(2000, 2000);
  const planMaterial = new THREE.MeshPhongMaterial({ color: "#000000" });

  const plane = new THREE.Mesh(planGeometry, planMaterial);

  plane.receiveShadow = true; // 그림자 받는 곳

  plane.position.z = -10;

  scene.add(plane);

  textGeometry.computeBoundingBox();

  // textGeometry.translate(
  //   -((textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) * 0.5),
  //   -((textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) * 0.5),
  //   -((textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z) * 0.5)
  // );

  textGeometry.center();

  /** Texture */
  const textureLoader = new THREE.TextureLoader().setPath("./assets/textures/");
  const textTexture = textureLoader.load("holographic.jpeg");

  textMeterial.map = textTexture; // 요소에 텍스쳐 입히기

  // fontLoader.load(
  //   './assets/fonts/The Jamsil 3 Regular_Regular.json',
  //   (font) => {
  //     /** Text */
  //     const textGeometry = new TextGeometry('안녕 친구들', {
  //       font,
  //       size: 0.5,
  //       height: 0.1,
  //     });
  //     const textMeterial = new THREE.MeshPhongMaterial({ color: '#00C896' });

  //     const text = new THREE.Mesh(textGeometry, textMeterial);

  //     scene.add(text);
  //   }
  //   // (event) => {
  //   //   console.log('progress', event);
  //   // },
  //   // (error) => {
  //   //   console.log('error', error);
  //   // }
  // );
  // const font = fontLoader.parse(typeface);

  /** AmbientLight */
  const ambientLight = new THREE.AmbientLight("#FFFFFF", 0.2);

  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(
    "#FFFFFF",
    2.5,
    30,
    Math.PI * 0.15,
    0.2,
    0.5
  );

  spotLight.castShadow = true; // 그림자 시작할 곳
  spotLight.shadow.mapSize.width = 1024; // 기본 값 512 뒤에 그림자의 선명도
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.radius = 10; // 뒤에 그림자 흐릿함 정도

  spotLight.position.set(0, 0, 3);
  spotLight.target.position.set(0, 0, -3);

  scene.add(spotLight, spotLight.target);

  // spotLight에 Texture 입히기
  const spotLightTexture = textureLoader.load("gradient.jpg");
  spotLightTexture.encoding = THREE.sRGBEncoding;

  THREE.LinearEncoding;

  spotLight.map = spotLightTexture;

  // 마우스 움직이는 효과에 따라 스포트라이트 타겟의 위치를 변경
  window.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 5;
    const y = -(clientY / window.innerHeight - 0.5) * 5;

    spotLight.target.position.set(x, y, -3);
  });

  // const spotLightHelper = new THREE.SpotLightHelper(spotLight);

  // scene.add(spotLightHelper);

  const spotLightFolder = gui.addFolder("SpotLight"); // addFolder 일 경우 같은 target의 속성을 묶어준다.
  // 빛을 어떤 타겟을 향해 방출할지에 대한 정보를 담고 있다.
  spotLightFolder
    .add(spotLight, "angle")
    .min(0)
    .max(Math.PI / 2)
    .step(0.01);

  spotLightFolder
    .add(spotLight.position, "z")
    .min(1)
    .max(10)
    .step(0.01)
    .name("position.z");

  spotLightFolder.add(spotLight, "distance").min(1).max(30).step(0.01);

  spotLightFolder.add(spotLight, "decay").min(0).max(10).step(0.01);

  spotLightFolder.add(spotLight, "penumbra").min(0).max(1).step(0.01);

  spotLightFolder
    .add(spotLight.shadow, "radius")
    .min(1)
    .max(10)
    .step(0.01)
    .name("shadow.radius");

  // 후처리 효과------------------------------------------------------------------
  const composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);

  const unrealBloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.2, // strength
    1, // radius
    0 // threthholds
  );

  composer.addPass(renderPass);

  composer.addPass(unrealBloomPass);

  const unrealBloomPassFolder = gui.addFolder("UnrealBloomPass");

  unrealBloomPassFolder
    .add(unrealBloomPass, "strength")
    .min(0)
    .max(3)
    .step(0.01);
  unrealBloomPassFolder.add(unrealBloomPass, "radius").min(0).max(1).step(0.01);
  unrealBloomPassFolder
    .add(unrealBloomPass, "threshold")
    .min(0)
    .max(1)
    .step(0.01);
  // -----------------------------------------------------------------------------
  render();

  function render() {
    composer.render();

    // spotLightHelper.update();

    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);
  }
  window.addEventListener("resize", () => {
    handleResize();
  });
}
