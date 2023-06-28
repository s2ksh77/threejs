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

  const cubeGeometry = new THREE.IcosahedronGeometry(1);
  // const material = new THREE.MeshBasicMaterial({ color: "#993366" }); // 조명의 영향을 받지 않는 material
  const cubeMaterial = new THREE.MeshLambertMaterial({
    // color: "#993366",
    color: new THREE.Color("#00FFFF"),
    emissive: "#111111",
    // transparent: true,
    // opacity: 0.5,
    // visible: true,
    // wireframe: true,
    // side: THREE.DoubleSide,
  });

  const skeletonGeometry = new THREE.IcosahedronGeometry(2);
  // const material = new THREE.MeshBasicMaterial({ color: "#993366" }); // 조명의 영향을 받지 않는 material
  const skeletonMaterial = new THREE.MeshBasicMaterial({
    color: "#AAAAAA",
    wireframe: true,
    transparent: true,
    opacity: 0.2,
    // visible: true,
    // wireframe: true,
    // side: THREE.DoubleSide,
  });

  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterial);

  scene.add(cube, skeleton);

  camera.position.z = 5;
  // camera.position.set(3, 4, 5);

  // camera.lookAt(cube.position);

  const directionalLight = new THREE.DirectionalLight("#FFFFFF", 1); // 그림자나 음영을 표시해주는 조명
  // directionalLight.position.set(-1, 2, 3);

  scene.add(directionalLight);

  // const ambientLight = new THREE.AmbientLight("#ffffff", 0.1); // 그림자나 음영을 표시해주지 않는 조명

  // ambientLight.position.set(3, 2, 1);

  // scene.add(ambientLight);

  const clock = new THREE.Clock();

  render();

  function render() {
    // radian  ( deg -> rad )
    // cube.rotation.x = THREE.MathUtils.degToRad(45);
    // cube.rotation.x += 0.01;
    // cube.rotation.x = Date.now() / 1000; // 브라우저에서 동일한 프레임으로 회전시키기 위해 같은 값을 넣음
    // cube.rotation.x = clock.getElapsedTime();
    const elapsedTime = clock.getElapsedTime();
    cube.rotation.x = elapsedTime;
    cube.rotation.y = elapsedTime;

    skeleton.rotation.x = elapsedTime * 1.5;
    skeleton.rotation.y = elapsedTime * 1.5;

    // cube.position.y = Math.sin(cube.rotation.x);
    // cube.scale.x = Math.cos(cube.rotation.x);

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
