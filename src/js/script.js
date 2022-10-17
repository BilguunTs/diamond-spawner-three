import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//===============================
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const Ground_Name = "Ground";
let intersects;
let spawnedObj = [];
//===============================
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 10, -12);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();
document.body.appendChild(renderer.domElement);
///==========================================================
const planeGTR = new THREE.PlaneGeometry(GRID_WIDTH, GRID_HEIGHT);
const planeMTR = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  visible: false,
});
const planeMesh = new THREE.Mesh(planeGTR, planeMTR);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.name = Ground_Name;
scene.add(planeMesh);

const grid = new THREE.GridHelper(GRID_WIDTH, GRID_HEIGHT);
scene.add(grid);

const highlightGridGTR = new THREE.PlaneGeometry(1, 1);
const highlightGridMTR = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
});
const highlightGridMesh = new THREE.Mesh(highlightGridGTR, highlightGridMTR);
highlightGridMesh.rotateX(-Math.PI / 2);
highlightGridMesh.position.set(0.5, 0, 0.5);
scene.add(highlightGridMesh);

const mousePosition = new THREE.Vector2();
const rayCaster = new THREE.Raycaster();

window.addEventListener("mousemove", (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
  rayCaster.setFromCamera(mousePosition, camera);

  intersects = rayCaster.intersectObjects(scene.children);
  intersects.forEach((o) => {
    if (o.object.name === Ground_Name) {
      const instancePos = new THREE.Vector3()
        .copy(o.point)
        .floor()
        .addScalar(0.5);
      highlightGridMesh.position.set(instancePos.x, 0, instancePos.z);
    }
  });
});

window.addEventListener("click", (e) => {
  intersects.forEach((o) => {
    if (o.object.name === Ground_Name) {
      const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 4, 3),
        new THREE.MeshBasicMaterial({ color: "yellow", wireframe: true })
      );
      const instancePos = new THREE.Vector3()
        .copy(o.point)
        .floor()
        .addScalar(0.5);
      sphereMesh.position.set(instancePos.x, 1, instancePos.z);
      spawnedObj.push(sphereMesh);
      scene.add(sphereMesh);
    }
  });
});

///==========================================================

const updateSpawnedObj = () => {
  if (spawnedObj.length > 0) {
    spawnedObj.forEach((o) => {
      o.rotateY(0.02);
    });
  }
};

function animate() {
  updateSpawnedObj();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
