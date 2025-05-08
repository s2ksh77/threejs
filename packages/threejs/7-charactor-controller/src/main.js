import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

window.addEventListener('load', init);

function init() {
  // 1) 렌더러/씬/카메라/컨트롤
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);
  const controls = new OrbitControls(camera, renderer.domElement);

  // 2) 좌석 지오메트리 생성 (쿠션, 등받이, 팔걸이, 다리)
  const cushionGeo = new THREE.BoxGeometry(1, 0.3, 1);
  const backGeo    = new THREE.BoxGeometry(1, 0.6, 0.2)
    .applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.45, -0.4));
  const leftArmGeo  = new THREE.BoxGeometry(0.1, 0.3, 1)
    .applyMatrix4(new THREE.Matrix4().makeTranslation(-0.55, 0, 0));
  const rightArmGeo = new THREE.BoxGeometry(0.1, 0.3, 1)
    .applyMatrix4(new THREE.Matrix4().makeTranslation( 0.55, 0, 0));
  const legProto = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
  const legGeos = [
    { x:  0.45, y:-0.4, z: 0.45 },
    { x: -0.45, y:-0.4, z: 0.45 },
    { x:  0.45, y:-0.4, z:-0.45 },
    { x: -0.45, y:-0.4, z:-0.45 }
  ].map(({ x,y,z }) => legProto.clone().applyMatrix4(
    new THREE.Matrix4().makeTranslation(x, y, z)
  ));

  const seatGeo = mergeBufferGeometries(
    [ cushionGeo, backGeo, leftArmGeo, rightArmGeo, ...legGeos ],
    false
  );

  // 3) InstancedMesh + 색 초기화
  const rows = 5, cols = 10, spacing = 1.5;
  const count = rows * cols;

  // 기본 & 선택 색상
  const baseColor = new THREE.Color(0x336699);
  const selColor  = new THREE.Color(0xffaa00);

  const seatMat = new THREE.MeshStandardMaterial({
    vertexColors: true, metalness:0.3, roughness:0.6
  });
  const inst = new THREE.InstancedMesh(seatGeo, seatMat, count);

  // InstancedMesh 에 컬러 버퍼 자동 생성 (r152 이상)
  inst.instanceColor = new THREE.InstancedBufferAttribute(
    new Float32Array(count * 3), 3
  );
  // 기본 색 채워넣기
  for (let i = 0; i < count; i++) {
    inst.setColorAt(i, baseColor);
  }
  inst.instanceColor.needsUpdate = true;

  // 4) 좌석 배치
  const dummy = new THREE.Object3D();
  let idx = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      dummy.position.set(
        (j - (cols - 1)/2) * spacing,
        0,
        (i - (rows - 1)/2) * spacing
      );
      dummy.updateMatrix();
      inst.setMatrixAt(idx++, dummy.matrix);
    }
  }
  scene.add(inst);

  // 5) 조명
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.0));
  const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(5, 10, 7);
  scene.add(dLight);

  // 6) 선택 상태 관리
  const selected = new Set();

  // 7) Raycaster & 마우스
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  renderer.domElement.addEventListener('pointermove', e => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width ) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });
  renderer.domElement.addEventListener('pointerdown', () => {
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(inst);
    if (!hits.length) return;
    const i = hits[0].instanceId;
    // 토글
    if (selected.has(i)) {
      selected.delete(i);
      inst.setColorAt(i, baseColor);
    } else {
      selected.add(i);
      inst.setColorAt(i, selColor);
    }
    inst.instanceColor.needsUpdate = true;
    console.log('토글된 좌석 ID:', i);
  });

  // 8) 애니메이션 루프
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // 9) 리사이즈
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}
