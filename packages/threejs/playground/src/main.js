import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

window.addEventListener('load', init);

function init() {
  // 1) 렌더러 / 씬 / 카메라 / 컨트롤
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50, innerWidth/innerHeight, 0.1, 1000
  );
  camera.position.set(0, 5, 10);
  new OrbitControls(camera, renderer.domElement);

  // 2) 좌석 지오메트리 제작 (쿠션, 등받이, 팔걸이, 다리)
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
  ].map(p => legProto.clone().applyMatrix4(
    new THREE.Matrix4().makeTranslation(p.x, p.y, p.z)
  ));

  const seatGeo = mergeBufferGeometries(
    [cushionGeo, backGeo, leftArmGeo, rightArmGeo, ...legGeos],
    false
  );

  // 3) 좌석 배치 & 개별 Mesh 생성
  const rows    = 5;
  const cols    = 10;
  const spacing = 1.5;
  const baseColor = new THREE.Color(0x336699);
  const selColor  = new THREE.Color(0xffaa00);

  const seats = [];  // 클릭 대상 배열

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const material = new THREE.MeshStandardMaterial({ color: baseColor.clone() });
      const mesh = new THREE.Mesh(seatGeo, material);
      mesh.position.set(
        (j - (cols-1)/2) * spacing,
        0,
        (i - (rows-1)/2) * spacing
      );
      scene.add(mesh);
      seats.push(mesh);
    }
  }

  // 4) 조명
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
  const dl = new THREE.DirectionalLight(0xffffff, 0.8);
  dl.position.set(5, 10, 7);
  scene.add(dl);

  // 5) Raycaster로 클릭 시 색 토글
  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2();

  renderer.domElement.addEventListener('pointermove', e => {
    const r = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left)/r.width)*2 - 1;
    mouse.y = -((e.clientY - r.top)/r.height)*2 + 1;
  });

  renderer.domElement.addEventListener('pointerdown', () => {
    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObjects(seats)[0];
    if (!hit) return;

    const m = hit.object;
    const c = m.material.color;
    // baseColor와 같으면 selColor, 아니면 다시 baseColor
    if (c.equals(baseColor)) {
      c.copy(selColor);
    } else {
      c.copy(baseColor);
    }
  });

  // 6) 애니메이션 루프 & 리사이즈
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}
