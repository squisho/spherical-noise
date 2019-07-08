var $container = document.getElementById("container");
var renderer = new THREE.WebGLRenderer({antialias: true});
var camera = new THREE.PerspectiveCamera(80,1,0.1,10000);
var scene = new THREE.Scene();

scene.add(camera);
renderer.setSize(800, 800);
$container.append(renderer.domElement);

///////////////////////////////////////////////

// Camera
camera.position.z = 200;

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Material
var pinkMat = new THREE.MeshPhongMaterial({
  color      :  new THREE.Color("rgb(75,35,213)"),
  emissive   :  new THREE.Color("rgb(100,100,255)"),
  specular   :  new THREE.Color("rgb(100,100,255)"),
  shininess  :  10,
  shading    :  THREE.FlatShading,
  transparent: 1,
  opacity    : 1
});

var L1 = new THREE.PointLight( 0xffffff, 1);
L1.position.z = 100;
L1.position.y = 100;
L1.position.x = 100;
scene.add(L1);

var L2 = new THREE.PointLight( 0xff0000, 0.8);
L2.position.z = 200;
L2.position.y = 50;
L2.position.x = -100;
scene.add(L2);

// IcoSphere -> THREE.IcosahedronGeometry(80, 1) 1-4
var ico = new THREE.Mesh(new THREE.IcosahedronGeometry(75,3), pinkMat);
ico.rotation.z = 0.5;
scene.add(ico);

noise.seed(Math.random());

let originalVertices;
let offset = 0;

const f = n => n * 2 + offset;

function update(){
   // ico.rotation.x+=2/100;
   // ico.rotation.y+=2/100;

   if (!originalVertices) originalVertices = ico.geometry.vertices;
   ico.geometry.vertices.forEach((vertex, i) => {
     const p = vertex.normalize();
     const r = noise.perlin3(f(p.x), f(p.y), f(p.z)) * 60 + 40;
     p.multiplyScalar(r*2);
   });
   ico.geometry.verticesNeedUpdate = true;
   offset += 0.005;
}

// Render
function render() {
  requestAnimationFrame(render);
  update();
  renderer.render(scene, camera);
}

render();
