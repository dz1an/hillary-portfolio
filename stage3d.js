/* =========================================================
   Hero 3D — subtle wireframe icosahedron + floating points
   Light-mode, ink-on-cream. No post-processing, no shaders.
   ========================================================= */

import * as THREE from "three";

const canvas = document.getElementById("stage3d");
if (canvas) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const INK = 0x111111;
  const DIM = 0x8a8478;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 6.5);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /* ---------- Wireframe icosahedron ---------- */
  const geo = new THREE.IcosahedronGeometry(1.6, 1);
  const edges = new THREE.EdgesGeometry(geo, 1);
  const lineMat = new THREE.LineBasicMaterial({
    color: INK,
    transparent: true,
    opacity: 0.82,
  });
  const mesh = new THREE.LineSegments(edges, lineMat);
  // shift slightly right so title stays readable
  mesh.position.set(1.4, 0.2, 0);
  scene.add(mesh);

  /* ---------- Inner solid (subtle ghost fill) ---------- */
  const solid = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.55, 1),
    new THREE.MeshBasicMaterial({
      color: 0xf3efe8,
      transparent: true,
      opacity: 0.55,
    })
  );
  solid.position.copy(mesh.position);
  scene.add(solid);

  /* ---------- Floating points halo ---------- */
  const pCount = 180;
  const positions = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    // spherical shell around the mesh
    const r = 2.4 + Math.random() * 1.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3]     = mesh.position.x + r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = mesh.position.y + r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: DIM,
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  /* ---------- Mouse parallax ---------- */
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ---------- Scroll fade ---------- */
  let scrollY = 0;
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  }, { passive: true });

  /* ---------- Loop ---------- */
  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();

    // ease mouse
    current.x += (target.x - current.x) * 0.05;
    current.y += (target.y - current.y) * 0.05;

    // slow intrinsic rotation + mouse tilt
    const baseRx = t * 0.12;
    const baseRy = t * 0.18;
    mesh.rotation.x = baseRx + current.y * 0.35;
    mesh.rotation.y = baseRy + current.x * 0.5;
    solid.rotation.copy(mesh.rotation);

    // points breathe slowly
    points.rotation.y = t * 0.04 + current.x * 0.2;
    points.rotation.x = current.y * 0.15;

    // fade out with scroll
    const vh = window.innerHeight;
    const fade = Math.max(0, 1 - scrollY / (vh * 0.9));
    canvas.style.opacity = String(fade);

    renderer.render(scene, camera);
    if (!prefersReduced) requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize);
  animate();
}
