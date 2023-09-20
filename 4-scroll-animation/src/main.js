import * as THREE from "three";

window.addEventListener("load", () => {
  init();
});

function init() {
  const canvas = document.querySelector("#canvas");
  console.log(canvas);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

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
    color: "#00ffff",
  });

  console.log(waveGeometry.attributes.position);
  // waveGeometry.attributes.position.array -> 정점들의 좌표가 있다.
  // array의 0,1,2가 x,y,z 이고 3,4,5가 x,y,z 값과 매핑이 된다. itemSize: 3이랑 같다.

  // z축만 랜덤하게 변경해서 파도처럼 나타낸다.
  const waveHeight = 2.5;
  // for (let i = 0; i < waveGeometry.attributes.position.array.length; i += 3) {
  //   waveGeometry.attributes.position.array[i + 2] +=
  //     (Math.random() - 0.5) * waveHeight;
  // }

  for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
    const z =
      waveGeometry.attributes.position.getZ(i) +
      (Math.random() - 0.5) * waveHeight;
    waveGeometry.attributes.position.setZ(i, z);
  }

  const wave = new THREE.Mesh(waveGeometry, waveMeterial);

  wave.rotation.x = -Math.PI / 2; // 파도를 가로로 눕힘

  scene.add(wave);

  const pointLight = new THREE.PointLight(0xffffff, 1);

  pointLight.position.set(15, 15, 15);

  scene.add(pointLight);

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
  window.addEventListener("resize", () => {
    handleResize();
  });
}
