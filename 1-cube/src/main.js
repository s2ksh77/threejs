import * as THREE from "three";

window.addEventListener("load", () => {
  init();
});

function init() {
  const renderer = new THREE.WebGLRenderer({
    // alpha: true,
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

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  // const material = new THREE.MeshBasicMaterial({ color: "#993366" }); // 조명의 영향을 받지 않는 material
  const material = new THREE.MeshStandardMaterial({ color: "#993366" });

  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  camera.position.set(3, 4, 5);

  camera.lookAt(cube.position);

  const directionalLight = new THREE.DirectionalLight("#F0F0F0", 1); // 그림자나 음영을 표시해주는 조명
  directionalLight.position.set(-1, 2, 3);

  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight("#ffffff", 0.1); // 그림자나 음영을 표시해주지 않는 조명

  ambientLight.position.set(3, 2, 1);

  scene.add(ambientLight);

  renderer.render(scene, camera);
}
