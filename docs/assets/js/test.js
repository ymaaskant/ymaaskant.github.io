//THREE + TWEENjs imports
import * as THREE from 'three';
import {Tween, Group, Easing} from '@tweenjs/tween.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { degToRad, radToDeg } from 'three/src/math/MathUtils.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import HelvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json';

//scene + cam
let camera, scene, renderer;
let camVector = new THREE.Vector3();
let camPosition = new THREE.Vector3();
let sky, sun;

//txt
const fontLoader = new FontLoader();
const font = fontLoader.parse(HelvetikerFont);
//raycasting
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let runOnce = true;
let togglePointerMove = false;
let toggleFog = false;

//camera
camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 100, 2000000 );
camera.position.set( 4000, 2000, 4000 );
camera.lookAt(-200,2500,-200);
scene = new THREE.Scene();

//renderer
renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.sortObjects = true;
document.body.appendChild( renderer.domElement );
renderer.domElement.addEventListener('click', onClick, false);

//controller
const controls = new OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render );
controls.enableZoom = true;
controls.enablePan = true;

//fog
if(toggleFog){
  scene.fog = new THREE.Fog( 0x000000, 5000, 8000 );
}

const ambientLight = new THREE.AmbientLight(0xffffff,1);
scene.add(ambientLight);

const groundPlane= new THREE.Mesh(new THREE.PlaneGeometry(50000,50000,100,100), new THREE.MeshPhongMaterial({color:0x55bb88}));
groundPlane.rotation.set(degToRad(-90),0,0);
scene.add(groundPlane);

const geometry = new THREE.BoxGeometry( 100,100,100 );
const material = new THREE.MeshBasicMaterial({vertexColors:true, color:T });
const testCube = new THREE.Mesh(geometry,material);
testCube.name="testCube";
console.log(testCube.uuid);
scene.add(testCube);




function initSky() {
// Add Sky
sky = new Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );
sun = new THREE.Vector3();

/// GUI
const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

function guiChanged() {

    const uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = effectController.turbidity;
    uniforms[ 'rayleigh' ].value = effectController.rayleigh;
    uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
    uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
    const theta = THREE.MathUtils.degToRad( effectController.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    uniforms[ 'sunPosition' ].value.copy( sun );

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render( scene, camera );
}

const gui = new GUI();

gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );

guiChanged();

}

  //animation timer promise
const animationTimer = (ms) => new Promise((res) => setTimeout(res, ms));
const inputTimeout = async ms => new Promise(res => setTimeout(res, ms));
  
async function initGame(nPlayers) {
  
  

  
  animate();

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}


function animate(){
//   tweenGroup.update();
  render();
//   requestAnimationFrame(animate);
}

function render() {
  renderer.render( scene, camera );
}

function onKeyDown(){
    switch( event.keyCode ) {
        case 65: //A

        break;
        case 68: //D

        break;
       case 83: // S
        
           playerBlue1.position.z += cameraSpeed;
        
       break;
       case 87: // W
            playerBlue1.position.z -= cameraSpeed;
       break;
    }
}

function onPointerMove( event ) {
    if(togglePointerMove){
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        // raycaster.setFromCamera( pointer, camera );
        // const intersects = raycaster.intersectObjects(scene.children, false );
  }
}

function onClick(){
  return new Promise (function(resolve,reject){
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0){
    console.log(intersects[0].face);
    resolve(intersects[0].face);
    }
  });   
}


//EventHandlers
// document.getElementById("buttonRoll").addEventListener("click", game ,false);
// document.getElementById("buttonTrap").addEventListener("click", testButton ,false);
// document.getElementById("buttonReset").addEventListener("click", reset ,false);
// document.getElementById("buttonName").addEventListener("click", updatePlayerName ,false);
document.addEventListener( 'mousemove', onPointerMove );
window.addEventListener( 'resize', onWindowResize );

//loop
if(runOnce){
    runOnce = false;
    // initSky();
}
animate();




