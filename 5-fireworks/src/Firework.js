import * as THREE from 'three';

class Firework {
  constructor({ x, y }) {
    const count = 1000;
    const velocity = 10 + Math.random() * 10;

    const particlesGeometry = new THREE.BufferGeometry();

    this.particles = [];

    for (let i = 0; i < count; i++) {
      const particle = new THREE.Vector3(x, y, 0);

      particle.deltaX = THREE.MathUtils.randFloatSpread(velocity);
      particle.deltaY = THREE.MathUtils.randFloatSpread(velocity);
      particle.deltaZ = THREE.MathUtils.randFloatSpread(velocity);

      this.particles.push(particle);
    }

    particlesGeometry.setFromPoints(this.particles);

    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load('./assets/textures/particle.png');

    const pointMeterial = new THREE.PointsMaterial({
      size: 1,
      alphaMap: texture,
      transparent: true,
      depthWrite: false,
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    });

    const points = new THREE.Points(particlesGeometry, pointMeterial);

    this.points = points;
  }

  update() {
    const position = this.points.geometry.attributes.position;
    for (let i = 0; i < this.particles.length; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      position.setX(i, x + this.particles[i].deltaX);
      position.setY(i, y + this.particles[i].deltaY);
      position.setZ(i, z + this.particles[i].deltaZ);
    }

    position.needsUpdate = true;
  }
}

export default Firework;
