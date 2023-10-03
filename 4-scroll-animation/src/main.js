import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GUI from "lil-gui";

window.addEventListener("load", () => {
  init();
});

async function init() {
  gsap.registerPlugin(ScrollTrigger);
  const params = {
    waveColor: "#00ffff",
    backgroundColor: "#ffffff",
    fogColor: "#f0f0f0",
  };

  const gui = new GUI();

  gui.hide();

  const canvas = document.querySelector("#canvas");

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
  });

  renderer.shadowMap.enabled = true;

  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  scene.fog = new THREE.Fog(0xf0f0f0, 0.1, 500);
  // scene.fog = new THREE.FogExp2(0xf0f0f0, 0.005);

  gui.add(scene.fog, "near").min(0).max(100).step(0.1);
  gui.add(scene.fog, "far").min(100).max(500).step(0.1);

  // 물체에 대한 원근감 표현 카메라
  const camera = new THREE.PerspectiveCamera(
    75, // fov 카메라의 각도
    window.innerWidth / window.innerHeight, //
    1, // near
    500 // far 성능적인 문제 때문에 범위를 적어준다.
  );

  camera.position.set(0, 25, 150); // z 축 방향으로 멀리서 바라보는 효과

  const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 150, 150); // x축,y축을 길게 늘리고, x,y 세그먼트를 더 잘게 쪼갠다
  const waveMeterial = new THREE.MeshStandardMaterial({
    // wireframe: true,
    color: params.waveColor,
  });

  // waveGeometry.attributes.position.array -> 정점들의 좌표가 있다.
  // array의 0,1,2가 x,y,z 이고 3,4,5가 x,y,z 값과 매핑이 된다. itemSize: 3이랑 같다.

  // z축만 랜덤하게 변경해서 파도처럼 나타낸다.
  const waveHeight = 2.5;
  // for (let i = 0; i < waveGeometry.attributes.position.array.length; i += 3) {
  //   waveGeometry.attributes.position.array[i + 2] +=
  //     (Math.random() - 0.5) * waveHeight;
  // }
  const initialZPositions = [];

  for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
    const z =
      waveGeometry.attributes.position.getZ(i) +
      (Math.random() - 0.5) * waveHeight;
    waveGeometry.attributes.position.setZ(i, z);
    initialZPositions.push(z);
  }

  const wave = new THREE.Mesh(waveGeometry, waveMeterial);

  wave.receiveShadow = true; // 그림자가 비춰질 object 에 receiveShadow
  wave.rotation.x = -Math.PI / 2; // 파도를 가로로 눕힘

  const clock = new THREE.Clock();

  wave.update = function () {
    const elapsedTime = clock.getElapsedTime();

    for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
      // const z = initialZPositions[i] + Math.sin(elapsedTime * 3) * waveHeight; // 전체의 sin 이 시간에 따라 전체가 같은 높낮이로 왔다갔다 하게 됨
      const z =
        initialZPositions[i] + Math.sin(elapsedTime * 3 + i ** 2) * waveHeight; // i가 선형적이게 증가하던 값을 i의 제곱 값으로 더함으로써 시간의 값을 랜덤하게 만들어 줌

      waveGeometry.attributes.position.setZ(i, z);
    }

    waveGeometry.attributes.position.needsUpdate = true;
  };

  scene.add(wave);

  const gltfLoader = new GLTFLoader();

  const gltf = await gltfLoader.loadAsync("./models/ship/scene.gltf");

  const ship = gltf.scene;

  ship.update = function () {
    const elapsedTime = clock.getElapsedTime();

    ship.position.y = Math.sin(elapsedTime * 3);
  };

  ship.rotation.y = Math.PI;

  ship.castShadow = true;

  ship.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true; // 그림자가 생길 object에 castShadow
    }
  });

  ship.scale.set(40, 40, 40);

  scene.add(ship);

  const pointLight = new THREE.PointLight(0xffffff, 1);

  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.radius = 10;

  pointLight.position.set(15, 15, 15);

  scene.add(pointLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.radius = 10;

  directionalLight.position.set(-15, 15, 15);

  scene.add(directionalLight);

  render();

  function render() {
    wave.update();
    ship.update();

    camera.lookAt(ship.position);

    renderer.render(scene, camera);

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

  // gsap to의 meterial에 바로 hex 값의 색상을 넣을 수 없다.
  // 따라서 THREE.Color 속성으로 나오는 color 값을 update 에 넣어준다.
  // gsap.to(params, {
  // waveColor: "#4268ff",
  // onUpdate: () => {
  //   waveMeterial.color = new THREE.Color(params.waveColor);
  // },
  //   scrollTrigger: {
  //     trigger: ".wrapper",
  //     start: "top top",
  //     markers: true,
  //     scrub: true,
  //   },
  // });

  // gsap.to(params, {
  //   backgroundColor: "#2a2a2a",
  //   onUpdate: () => {
  //     scene.background = new THREE.Color(params.backgroundColor);
  //   },
  //   scrollTrigger: {
  //     trigger: ".wrapper",
  //     start: "top top",
  //     markers: true,
  //     scrub: true,
  //   },
  // });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wrapper",
      start: "top top",
      markers: true,
      scrub: true,
    },
  });

  tl.to(params, {
    waveColor: "#4268ff",
    onUpdate: () => {
      waveMeterial.color = new THREE.Color(params.waveColor);
    },
  })
    .to(
      params,
      {
        backgroundColor: "#2a2a2a",
        onUpdate: () => {
          scene.background = new THREE.Color(params.backgroundColor);
        },
      },
      "<"
    )
    .to(
      params,
      {
        fogColor: "#2f2f2f",
        onUpdate: () => {
          scene.fog.color = new THREE.Color(params.fogColor);
        },
      },
      "<"
    );
}
