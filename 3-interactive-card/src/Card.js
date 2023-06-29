import * as THREE from 'three';

class Card {
  width;
  constructor({ width, height, radius, color }) {
    // const geometry = new THREE.PlaneGeometry(width, height);
    const shape = new THREE.Shape();

    const x = width / 2 - radius;
    const y = height / 2 - radius;

    shape
      .absarc(x, y, radius, Math.PI / 2, 0, true) // 문서도 봐보기 clockwise -> 시계방향일지 반시계방향일지
      .lineTo(x + radius, -y)
      .absarc(x, -y, radius, 0, -(Math.PI / 2), true)
      .lineTo(-x, -(y + radius))
      .absarc(-x, -y, radius, -(Math.PI / 2), Math.PI, true)
      .lineTo(-(x + radius), y)
      .absarc(-x, y, radius, Math.PI, Math.PI / 2, true);

    const geometry = new THREE.ShapeGeometry(shape);
    const metarial = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      roughness: 0.5,
      metalness: 0.5,
    });

    const mesh = new THREE.Mesh(geometry, metarial);

    this.mesh = mesh;
  }
}
export default Card;
