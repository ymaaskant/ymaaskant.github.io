//THREE
import * as THREE from 'three';
import {Tween, Group} from '@tweenjs/tween.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { degToRad, radToDeg } from 'three/src/math/MathUtils.js';

let camera, scene, renderer;
let camVector = new THREE.Vector3();
let camPosition = new THREE.Vector3();
let sky, sun;

//GameVars
var gameStarted = false;
var playerTurn = 1;
var players =  [];
var nPlayers = 8;

let toggleTestBalls = false;
let toggleSpotLightHelpers = false;
let togglePointLightHelpers = false;
let toggleCastShadows = true;
let toggleAmbientLight = true;
let togglePlayerIndicatorHelper = false;
let toggleFog = true;
var boardScaling = 666;
var playerMesh = [];
let selectingPath = false;
let selectedPath;
let highlightedObject;
let tweenGroup = new Group();
let animationSpeed = 1000;

let pathSelector1 = [];
let pathSelector2 = [];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const playerIndicator = new THREE.Object3D();
const playerIndicatorTarget = new THREE.Object3D();
const testCube = new THREE.Mesh(new THREE.BoxGeometry(50,50,50),new THREE.MeshBasicMaterial(0xffffff));


//GameConst
var boardSpot = [
    { x: -1, y: 1, z: 3, type:"start",Path:"A"},
    { x: -0.125, y: 1.05, z: 3, type:"green",Path:"A"},
    { x: 0.33, y: 1, z: 3, type:"green",Path:"A"},
    { x: 0.75, y: 0.666, z: 3, type:"reset",Path:"A"},
    { x: 0.75, y: 0.25, z: 2.2, type:"trap",Path:"A"},
    { x: 1.25, y: 0.25, z: 1.875, type:"trap",Path:"A"},
    { x: 1.75, y: 0.25, z: 1.55, type:"trap",Path:"A"},
    { x: 2.25, y: 0.25, z: 1.2, type:"trap",Path:"A"},
    { x: 2.75, y: 0.25, z: 0.85, type:"trap",Path:"A"},
    { x: 3.5, y: 0.25, z: 0.35, type:"trap",Path:"A"},
    { x: 3.2, y: 0.9, z: 0, type:"green",Path:"A"},
    { x: 3.18, y: 1.4, z: 0, type:"green",Path:"A"},
    { x: 2.85, y: 1.75, z: 0, type:"green",Path:"A"},
    { x: 2.45, y: 1.7, z: 0, type:"yellow",Path:"A"},
    { x: 1.9, y: 1.5, z: 0, type:"green",Path:"A"},
    { x: 1.6, y: 1.75, z: 0, type:"green",Path:"A"},
    { x: 1.1, y: 1.8, z: 0, type:"yellow",Path:"A"},
    { x: 0.73, y: 2, z: 0, type:"green",Path:"A"},
    { x: 0.2, y: 2, z: 0, type:"green",Path:"A"},
    { x: -0.3, y: 2, z: 0, type:"reset",Path:"A"},
    { x: -0.78, y: 1.7, z: 0, type:"green",Path:"Fork"},
    { x: -0.9, y: 1.25, z: 0, type:"green",Path:"A"},
    {x:-1.17, y:0.83, z:0, type:"trap",Path:"A"},
    {x:-1.7, y:0.65, z:0, type:"trap",Path:"A"},
    {x:-2.25, y:0.52, z:0, type:"trap",Path:"A"},
    {x:-2.8, y:0.4, z:0, type:"trap",Path:"A"},
    {x:-3.4, y:0.3, z:0, type:"trap",Path:"A"},
    {x:-1.17, y:1.9, z:0, type:"green",Path:"B"},
    {x:-1.65, y:2.05, z:0, type:"green",Path:"B"},
    {x:-2.05, y:2.15, z:0, type:"green",Path:"B"},
    {x:-2.6, y:2.1, z:0, type:"yellow",Path:"B"},
    {x:-3, y:2.15, z:0, type:"green",Path:"B"},
    {x:-3.4, y:1.95, z:0, type:"green",Path:"B"},
    {x:-3.65, y:1.6, z:0, type:"yellow",Path:"B"},
    {x:-3.65, y:1.2, z:0, type:"green",Path:"B"},
    {x:-3.45, y:0.8, z:0, type:"green",Path:"B"},
    {x:-3.4, y:-0.25, z:0, type:"reset",Path:"A"},
    {x:-3.45, y:-0.76, z:0, type:"green",Path:"A"},
    {x:-3.55, y:-1.15, z:0, type:"yellow",Path:"A"},
    {x:-3.4, y:-1.6, z:0, type:"green",Path:"A"},
    {x:-2.9, y:-1.65, z:0, type:"green",Path:"A"},
    {x:-2.5, y:-1.33, z:0, type:"trap",Path:"A"},
    {x:-2.35, y:-0.875, z:0, type:"trap",Path:"A"},
    {x:-2.1, y:-0.45, z:0, type:"trap",Path:"A"},
    {x:-1.65, y:-0.51, z:0, type:"trap",Path:"A"},
    {x:-1.2, y:-0.78, z:0, type:"green",Path:"A"},
    {x:-1.0, y:-1.18, z:0, type:"green",Path:"A"},
    {x:-0.77, y:-1.65, z:0, type:"yellow",Path:"A"},
    {x:-0.33, y:-1.9, z:0, type:"reset",Path:"A"},
    {x:0.3, y:-1.78, z:0, type:"trap",Path:"Fork"},
    {x:0.82, y:-1.88, z:0, type:"trap",Path:"A2"},
    {x:1.29, y:-1.8, z:0, type:"trap",Path:"A2"},
    {x:1.74, y:-1.88, z:0, type:"trap",Path:"A2"},
    {x:2.22, y:-1.8, z:0, type:"trap",Path:"A2"},
    {x:2.7, y:-1.8, z:0, type:"trap",Path:"A2"},
    {x:3.15, y:-2.07, z:0, type:"green",Path:"A2"},
    {x:3.45, y:-1.77, z:0, type:"green",Path:"A2"},
    {x:0.5, y:-1.2, z:0, type:"green",Path:"C"},
    {x:0.65, y:-0.78, z:0, type:"green",Path:"C"},
    {x:1.1, y:-0.85, z:0, type:"yellow",Path:"C"},
    {x:1.55, y:-0.9, z:0, type:"green",Path:"C"},
    {x:2, y:-0.7, z:0, type:"green",Path:"C"},
    {x:2.35, y:-0.45, z:0, type:"yellow",Path:"C"},
    {x:2.85, y:-0.325, z:0, type:"green",Path:"C"},
    {x:3.35, y:-0.6, z:0, type:"green",Path:"C"},
    {x:3.6, y:-1, z:0, type:"yellow",Path:"C"},
    {x:3.7, y:-1.4, z:0, type:"green",Path:"C"},
    {x:3.93, y:-2, z:0, type:"finish",Path:"finish"}
  ];

var playerGeometry = {x:300,y:750};

var trapCoords1 = [
    { x: 0.375, y: 2.5, z: 0.2, easing:""},
    { x: 0.6, y: 2.3, z: 0.2, easing:""},
    { x: 1.1, y: 2.3, z: 0.2, easing:""},
    { x: 1.1, y: 2, z: 0.2, easing:""},
    { x: 1.61, y: 2, z: 0.2, easing:""},
    { x: 1.61, y: 1.64, z: 0.2, easing:""},
    { x: 2.08, y: 1.64, z: 0.2, easing:""},
    { x: 2.08, y: 1.28, z: 0.2, easing:""},
    { x: 2.6, y: 1.28, z: 0.2, easing:""},
    { x: 2.6, y: 0.93, z: 0.2, easing:""},
    { x: 3.09, y: 0.93, z: 0.2, easing:""},
    { x: 3.09, y: 0.45, z: 0.2, easing:""},
    { x: 4.2, y: 0.45, z: 0.2, easing:""},
    { x: 4.2, y: -2, z: 0.2, easing:""}
  ];  

var dice = [1,1,2,3,4,0];

  //functions
function disableButton () {
    const button = document.getElementById("buttonRoll");
    button.disabled = true;
  };
  
function enableButton () {
    const button = document.getElementById("buttonRoll");
    button.disabled = false;
  };

function scaleBoard(){
  for (var i = 0; i<boardSpot.length;i++){
    var x = boardSpot[i].x * boardScaling;
    var y = boardSpot[i].z * boardScaling + (0.5* playerGeometry.y);
    var z = boardSpot[i].y * boardScaling;
    boardSpot[i].x=x;
    boardSpot[i].y=y;
    boardSpot[i].z=z;
  }
  // console.log(boardSpot);
}
  // Player Objects
function playerObj () {
    return {
      name:"player",
      position:0,
      path:"A",
      meshId:0
    };
};
  
  // To start the game
function startGame(nPlayers) {
  players = Array(nPlayers).fill(null).map(playerObj);
  for (var i = 0; i < nPlayers; i++){
    players[i].name=players[i].name+(i+1);
  }
  gameStarted=true;
  console.log(players);
};
  
function playerTurnHandler () {
  if (playerTurn >= nPlayers){
    playerTurn=1;
  } 
  else playerTurn++;
  setPlayerIndicator(playerTurn);
};
  
function game () {
  disableButton();
  var playerRoll = roll();
  switch(playerRoll){
    case 0:
      trapActivation();
      break;
  default:
    var playerPosition = calcPos(playerTurn-1,playerRoll);
    playerMove(playerTurn-1, playerPosition);
  }
    
    // Next Turn
    playerTurnHandler();
    enableButton();
    animate();
};
  
  //animation timer promise
const animationTimer = (ms) => new Promise((res) => setTimeout(res, ms));
  
function trapActivation(){
  var trap = Math.floor(Math.random() * 4) + 1;
  
  switch (trap){
    case 1:
      console.log("trap 1 activated");
      // trapAnimation(1);
      for (let i = 0; i < nPlayers;i++){
        if (players[i].position > 3 && players[i].position <10){
          console.log(players[i].name + " is reset to spot 3");
          playerMove(i,3);
        }
      }
      break;
  case 2:
    console.log("trap 2 activated");
    // trapAnimation(2);
    for (let i = 0; i < nPlayers;i++){
      if (players[i].position >= 22 && players[i].position <= 26){
        console.log(players[i].name + " is reset to spot 3");
        playerMove(i,19);
      }
    }
    break;
  case 3:
    console.log("trap 3 activated");
    for (let i = 0; i < nPlayers;i++){
      if (players[i].position >= 32 && players[i].position <= 35){
        console.log(players[i].name + " is reset to spot 3");
        playerMove(i,27);
      }
    }
    break;
  case 4:
    console.log("trap 4 activated")
    for (let i = 0; i < nPlayers;i++){
      if (players[i].position >= 40 && players[i].position <= 45){
        console.log(players[i].name + " is reset to spot 3");
        playerMove(i,39);
      }
    }
    break;
  }
};
  
function roll () {
    var randomNumber = Math.floor(Math.random() * 6);
    var diceSide = parseInt(dice[randomNumber]);
    console.log("diceSide in roll(): " + diceSide)
    return diceSide;
};
  
function calcPos (playerId,roll) {
  let playerNewPosition = players[playerId].position + roll;
  if (playerNewPosition >= boardSpot.length){
    console.log("player position > board spots. Player will not land on finish");
    return(players[playerId].position);
  }

  for (var i = 0; i < nPlayers; i++){
    // console.log("checking positions, current i: " + i);
    if(!i === playerId){
      continue;
    }
    if(players[i].position === playerNewPosition){
      playerNewPosition++;
      // console.log("Occupied spot --> new pos: " + playerNewPosition);
      i=0;
    }
  }

  for (var i = players[playerId].position;i<playerNewPosition;i++){
    if (boardSpot[i].Path === "Fork" ){

    }
  }
  return (playerNewPosition);
};


// async function trapAnimation(trap){
//   let ballSpeed = 200;
//   switch (trap) {
//     case 1:
//           // console.log("in switch case 1");
//       // console.log("trapBall var: " + trapBall);
//       for (var i=0; i<trapCoords1.length; i++){
//         trapBall.setAttribute("animation","to",{
//           x:trapCoords1[i].x,
//           y:trapCoords1[i].y,
//           z:trapCoords1[i].z
//         }); 
//         await animationTimer(ballSpeed);
//       }
//       break;
//     case 2:
//       var trapBall = document.querySelector("#trapBall02");
//       break;  
//     case 3:
//       var trapBall = document.querySelector("#trapBall03");
//       break;  
//     case 4:
//       var trapBall = document.querySelector("#trapBall04");
//       break;  
//   }    
// }
    
async function playerMove(playerId,playerNewPosition){
  if(!playerNewPosition === players[playerId].position){
    return;
  }
  let player = playerMesh[playerId];

  player.position.set(boardSpot[playerNewPosition].x,boardSpot[playerNewPosition].y,boardSpot[playerNewPosition].z);
  players[playerId].position=playerNewPosition;
  

  if(! boardSpot[playerNewPosition].type === "trap" || "reset" || "finish"){
    return;
  }

  if(boardSpot[playerNewPosition].type === "finish"){
    console.log(playerMesh[playerId].name + " wins!");
  }

  if(boardSpot[playerNewPosition].type === "trap"){
    trapActivation();
  }

  if(boardSpot[playerNewPosition].type ==="reset"){
    player.position.set(player.position.x, player.position.y,player.position.z+(i*100));
  }

  for (var i = 0; i<nPlayers; i++){
    console.log(players[i].position);
  }
  animate();
};

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

function initGame(nPlayers) {
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
  renderer.toneMappingExposure = 1.5;
  renderer.sortObjects = true;
  document.body.appendChild( renderer.domElement );
  renderer.domElement.addEventListener('click', onClick, false);

  //fog
  if(toggleFog){
    //purplish
    // scene.fog = new THREE.Fog( 0x0a080d, 1800, 7000 );
    //black
    scene.fog = new THREE.Fog( 0x000000, 5000, 8000 );
  }

  //testCube
  testCube.position.set(-1024,1024,-1024);
  scene.add(testCube);



  //lights
const pointLightPositions = [
  {x:2725,y:870,z:20,color:0xff6a00},
  {x:2700,y:1250,z:20,color:0xff6a00},
  {x:-400,y:1250,z:240,color:0xff6a00},
  {x:-1750,y:860,z:20,color:0xff6a00},
  {x:-1780,y:1080,z:-40,color:0xff6a00},
  {x:-850,y:1080,z:-40,color:0xff6a00},
  {x:-850,y:860,z:20,color:0xff6a00},
  {x:-2250,y:1400,z:20,color:0xff6a00},
  {x:-2800,y:860,z:20,color:0xff6a00},
  {x:1350,y:1800,z:-250,color:0xff6a00},
  {x:-80,y:880,z:700,color:0xff6a00},
  {x:80,y:950,z:1050,color:0x99ccff},
  {x:40,y:800,z:1600,color:0x99ccff},
  {x:-80,y:650,z:1675,color:0xff6a00},
  {x:-80,y:1300,z:-1675,color:0xff6a00},
  {x:-80,y:1300,z:-875,color:0xff6a00},
  {x:0,y:3000,z:0,color:0xff6a00},
  {x:1150,y:700,z:450,color:0xaaffaa}
  ];

  const spotLightPositions = [
    {x:4000,y:2000,z:3000,color:0x00ff99},
    {x:-4000,y:2000,z:3000,color:0x99ff00},
    {x:-4000,y:2000,z:-3000,color:0xffcc99},
    {x:4000,y:2000,z:-3000,color:0xffccff},
    {x:0,y:6000,z:0,color:0x00ff99}
  ];

  var spotLights = [];
  var spotLightHelpers = [];
  for (let i = 0; i<spotLightPositions.length; i++){
    spotLights[i] = new THREE.SpotLight( spotLightPositions[i].color, 7000000,6000,degToRad(25),0.75);
    spotLights[i].position.set(spotLightPositions[i].x,spotLightPositions[i].y,spotLightPositions[i].z);
    spotLights[i].castShadow = toggleCastShadows;
    scene.add(spotLights[i]);
    if (toggleSpotLightHelpers){
      spotLightHelpers[i] = new THREE.SpotLightHelper(spotLights[i]);
      scene.add(spotLightHelpers[i]);
    }
  }

  var pointLights = [];
  var pointHelpers = [];
  for (let i = 0; i<pointLightPositions.length;i++){
    pointLights[i] = new THREE.PointLight(pointLightPositions[i].color,50000,0);
    pointLights[i].position.set(pointLightPositions[i].x,pointLightPositions[i].y,pointLightPositions[i].z);
    pointLights[i].castShadow = toggleCastShadows;
    scene.add(pointLights[i]);

    if (togglePointLightHelpers){
      pointHelpers[i] = new THREE.PointLightHelper(pointLights[i],50);
      scene.add(pointHelpers[i]);
    }
  }

  if(toggleAmbientLight){
    const ambientLight = new THREE.AmbientLight(0xffffff,0.05);
    scene.add(ambientLight);
  }
  //controller
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );
  controls.enableZoom = true;
  controls.enablePan = false;
  window.addEventListener( 'resize', onWindowResize );

  scaleBoard();
  const tx_pb1 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_b1.png');
  const tx_pb2 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_b2.png');
  const tx_pg1 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_g1.png');
  const tx_pg2 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_g2.png');
  const tx_pp1 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_p1.png');
  const tx_pp2 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_p2.png');
  const tx_py1 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_y1.png');
  const tx_py2 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_y2.png');
  const txBBase = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_board_base.png');
  const txBTop = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_board_top.png');
  const txTower1 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_tower_1.png');
  const txTower2 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_tower_2.png');
  const txTower3 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_tower_3.png');
  const txStairs = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_stairs.png');

  const txW1B = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_w1b.png');
  const txW1Y = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_w1y.png');
  const txW1G = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_w1g.png');
  const txW1P = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_w1p.png');
  const txW2B = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_w2b.png');
  const txW2Y = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_w2y.png');
  const txW2G = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_w2g.png');
  const txW2P = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_w2p.png');

  const txW1GEmissive = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_w1g_emissive.png');

  const matPB1 = new THREE.MeshPhongMaterial( { map: tx_pb1, transparent: true, side: THREE.DoubleSide});
  const matPB2 = new THREE.MeshPhongMaterial( { map: tx_pb2, transparent: true, side: THREE.DoubleSide});
  const matPG1 = new THREE.MeshPhongMaterial( { map: tx_pg1, transparent: true, side: THREE.DoubleSide});
  const matPG2 = new THREE.MeshPhongMaterial( { map: tx_pg2, transparent: true, side: THREE.DoubleSide});
  const matPP1 = new THREE.MeshPhongMaterial( { map: tx_pp1, transparent: true, side: THREE.DoubleSide});
  const matPP2 = new THREE.MeshPhongMaterial( { map: tx_pp2, transparent: true, side: THREE.DoubleSide});
  const matPY1 = new THREE.MeshPhongMaterial( { map: tx_py1, transparent: true, side: THREE.DoubleSide});
  const matPY2 = new THREE.MeshPhongMaterial( { map: tx_py2, transparent: true, side: THREE.DoubleSide});
  const matBBase = new THREE.MeshPhongMaterial( { map: txBBase, transparent: false, side: THREE.FrontSide});
  const matBTop = new THREE.MeshPhongMaterial( { map: txBTop, transparent: true, side: THREE.FrontSide});
  const matTower1 = new THREE.MeshPhongMaterial( { map: txTower1, transparent: false, side: THREE.DoubleSide});
  const matTower2 = new THREE.MeshPhongMaterial( { map: txTower2, transparent: false, side: THREE.DoubleSide});
  const matTower3 = new THREE.MeshPhongMaterial( { map: txTower3, transparent: false, side: THREE.DoubleSide});
  const matStairs = new THREE.MeshPhongMaterial( { map: txStairs, transparent: true, side: THREE.DoubleSide});
  const matBlack = new THREE.MeshPhongMaterial( {color: 0x000000});
  const matColorGreen = new THREE.MeshPhongMaterial({color:0x00ff00});
  const matColorYellow = new THREE.MeshPhongMaterial({color:0xffff00});
  const matColorRed = new THREE.MeshPhongMaterial({color:0xff0000});
  const matColorBlue = new THREE.MeshPhongMaterial({color:0x00ffff});
  const matPathSelectorA = new THREE.MeshPhongMaterial({color:0xff00ff,emissive:0xff00ff,emissiveIntensity:1});
  const matPathSelectorA2 = new THREE.MeshPhongMaterial({color:0xff00ff,emissive:0xff00ff,emissiveIntensity:1});
  const matPathSelectorB = new THREE.MeshPhongMaterial({color:0xff00ff,emissive:0xff00ff,emissiveIntensity:1});
  const matPathSelectorC = new THREE.MeshPhongMaterial({color:0xff00ff,emissive:0xff00ff,emissiveIntensity:1});


  const matW1B = new THREE.MeshPhongMaterial( { map: txW1B, transparent: true, side: THREE.FrontSide});
  const matW1Y = new THREE.MeshPhongMaterial( { map: txW1Y, transparent: true, side: THREE.FrontSide});
  const matW1G = new THREE.MeshPhongMaterial( { map: txW1G, transparent: true, side: THREE.FrontSide});
  const matW1P = new THREE.MeshPhongMaterial( { map: txW1P, transparent: true, side: THREE.FrontSide});
  const matW2B = new THREE.MeshPhongMaterial( { map: txW2B, transparent: true, side: THREE.FrontSide});
  const matW2Y = new THREE.MeshPhongMaterial( { map: txW2Y, transparent: true, side: THREE.FrontSide});
  const matW2G = new THREE.MeshPhongMaterial( { map: txW2G, transparent: true, side: THREE.FrontSide});
  const matW2P = new THREE.MeshPhongMaterial( { map: txW2P, transparent: true, side: THREE.FrontSide});
  

  const geoBoardBase = new THREE.PlaneGeometry(3361, 2048);
  const geoBoardTop = new THREE.PlaneGeometry(1800,1800);
  const geoBoardTower = new THREE.PlaneGeometry(708,2304);
  const geoBoardTowerCube = new THREE.BoxGeometry (700, 2304,700,1,1,1);
  const geoBoardStairs = new THREE.PlaneGeometry(2048,2048);
  const geoBoardW1B = new THREE.PlaneGeometry(2614,2048);
  const geoBoardW1G = new THREE.PlaneGeometry(2487,2048);
  const geoBoardW1Y = new THREE.PlaneGeometry(2624,2048);
  const geoBoardW1P = new THREE.PlaneGeometry(2656,2048);
  const geoBoardW2B = new THREE.PlaneGeometry(1667, 2048);
  const geoBoardW2G = new THREE.PlaneGeometry(1541, 2048);
  const geoBoardW2Y = new THREE.PlaneGeometry(1537, 2048);
  const geoBoardW2P = new THREE.PlaneGeometry(1667, 2048);

  const boardBase = new THREE.Mesh( geoBoardBase, matBBase);
  const boardTop = new THREE.Mesh( geoBoardTop, matBTop );
  const boardTower = new THREE.Mesh( geoBoardTowerCube, matBlack);
  const boardTower1 = new THREE.Mesh( geoBoardTower, matTower1 );
  const boardTower2 = new THREE.Mesh( geoBoardTower, matTower2 );
  const boardTower3 = new THREE.Mesh( geoBoardTower, matTower3 );
  const boardStairs = new THREE.Mesh( geoBoardStairs, matStairs );
  const boardW1B = new THREE.Mesh( geoBoardW1B, matW1B );
  const boardW1Y = new THREE.Mesh( geoBoardW1Y, matW1Y );
  const boardW1G = new THREE.Mesh( geoBoardW1G, matW1G );
  const boardW1P = new THREE.Mesh( geoBoardW1P, matW1P );
  const boardW2B = new THREE.Mesh( geoBoardW2B, matW2B );
  const boardW2Y = new THREE.Mesh( geoBoardW2Y, matW2Y );
  const boardW2G = new THREE.Mesh( geoBoardW2G, matW2G );
  const boardW2P = new THREE.Mesh( geoBoardW2P, matW2P );

  var boardMesh = [];

  // scene.add( boardBase );
  boardBase.renderOrder = 99;
  boardMesh.push(boardBase);
  boardBase.rotation.set(degToRad(-90),0,0);
  boardBase.scale.set(1.63,1.63);
  boardBase.renderOrder = 99;

  // scene.add(boardTower);
  boardMesh.push(boardTower);
  boardTower.position.set(0,1152,0);

  // scene.add( boardTower1 );
  boardMesh.push(boardTower1);
  boardTower1.renderOrder=80;
  boardTower1.position.set(-352,1152,0);
  boardTower1.rotation.set(0,degToRad(-90),0);
  
  // scene.add( boardTower2 );
  boardMesh.push(boardTower2);
  boardTower2.renderOrder=80;
  boardTower2.position.set(0,1152,352);
  boardTower2.rotation.set(0,0,0);

  // scene.add( boardTower3 );
  boardMesh.push(boardTower3);
  boardTower3.renderOrder=80;
  boardTower3.position.set(352,1152,0);
  boardTower3.rotation.set(0,degToRad(90),0);

  // scene.add(boardW1B);
  boardMesh.push(boardW1B);
  boardW1B.renderOrder=3;
  boardW1B.position.set(354+1307,1024,5);
  boardW1B.rotation.set(0,0,0);
  boardW1B.scale.set(-1,1);
  
  // scene.add(boardW1Y);
  boardMesh.push(boardW1Y);
  boardW1Y.renderOrder=3;
  boardW1Y.position.set(354+1312,1024,-5);
  boardW1Y.rotation.set(0,degToRad(180),0);
  
  // scene.add(boardW1P);
  boardMesh.push(boardW1P);
  boardW1P.renderOrder=3;
  boardW1P.position.set(-354-1307,1024,5);
  boardW1P.rotation.set(0,0,0);
  boardW1P.scale.set(-1,1);
  
  // scene.add(boardW1G);
  boardMesh.push(boardW1G);
  boardW1G.renderOrder=3;
  boardW1G.renderOrder=10;
  boardW1G.position.set(-354-1312,1024,-5);
  boardW1G.rotation.set(0,degToRad(180),0);  

  // scene.add(boardW2B);
  boardMesh.push(boardW2B);
  boardW2B.renderOrder=3;
  boardW2B.position.set(5,1024,1200);
  boardW2B.rotation.set(0,degToRad(90),0);
  boardW2B.scale.set(1,1);
  
  // scene.add(boardW2Y);
  boardMesh.push(boardW2Y);
  boardW2Y.renderOrder=3;
  boardW2Y.position.set(60,1024,-1122);
  boardW2Y.rotation.set(0,degToRad(90),0);
  
  // scene.add(boardW2P);
  boardMesh.push(boardW2P);
  boardW2P.renderOrder=3;
  boardW2P.position.set(-5,1024,1200);
  boardW2P.rotation.set(0,degToRad(-90),0);
  boardW2P.scale.set(1,1);
  
  // scene.add(boardW2G);
  boardMesh.push(boardW2G);
  boardW2G.renderOrder=3;
  boardW2G.renderOrder=10;
  boardW2G.position.set(-5,1024,-1124);
  boardW2G.rotation.set(0,degToRad(-90),0);

  // scene.add( boardStairs );
  boardMesh.push(boardStairs);
  boardStairs.renderOrder=9999;
  boardStairs.position.set(-825,1024*1.15,-352);
  boardStairs.rotation.set(0,degToRad(180),0)
  boardStairs.scale.set(1.15,1.15);

  // scene.add( boardTop );
  boardMesh.push(boardTop);
  boardTop.renderOrder = 1;
  boardTop.position.set(100,2050,-450);
  boardTop.rotation.set(degToRad(90),degToRad(-180),degToRad(0));

  const Board = new THREE.Object3D();

  for (var i = 0; i < boardMesh.length; i++) {
    Board.add(boardMesh[i]);
    boardMesh[i].receiveShadow = true;
  }
  scene.add(Board);
  Board.rotation.set(0,degToRad(180),0);

  //Players
  //meshes
  const geometryPlayer = new THREE.PlaneGeometry(playerGeometry.x, playerGeometry.y);

  const player1 = new THREE.Mesh( geometryPlayer, matPB1 );
  const player2 = new THREE.Mesh( geometryPlayer, matPB2 );
  const player3 = new THREE.Mesh( geometryPlayer, matPG1 );
  const player4 = new THREE.Mesh( geometryPlayer, matPG2 );
  const player5 = new THREE.Mesh( geometryPlayer, matPP1 );
  const player6 = new THREE.Mesh( geometryPlayer, matPP2 );
  const player7 = new THREE.Mesh( geometryPlayer, matPY1 );
  const player8 = new THREE.Mesh( geometryPlayer, matPY2 );

  playerMesh.push(player1);
  playerMesh.push(player2);
  playerMesh.push(player3);
  playerMesh.push(player4);
  playerMesh.push(player5);
  playerMesh.push(player6);
  playerMesh.push(player7);
  playerMesh.push(player8);

  // console.log(playerMesh);
  for ( var i = 0; i < nPlayers; i++){
    scene.add(playerMesh[i]);
    playerMesh[i].position.set(boardSpot[0].x,boardSpot[0].y,boardSpot[0].z+200 - (i*150));
    playerMesh[i].name = players[i].name;
    playerMesh[i].renderOrder = 900-(i*100);
    playerMesh[i].receiveShadow = false;
    players[i].meshId = playerMesh[i].id;   
  }

  //player Highlighter
  const playerIndicatorLight = new THREE.SpotLight(0xffffff,5,1500,degToRad(10),0.2,0);
  playerIndicator.add(playerIndicatorLight);
  playerIndicatorLight.target = playerIndicatorTarget;
  playerIndicatorTarget.position.set(playerMesh[0].position.x, playerMesh[0].position.y,playerMesh[0].position.z);
  playerIndicator.position.set(playerMesh[0].position.x, playerMesh[0].position.y + 1000, playerMesh[0].position.z);

  if(togglePlayerIndicatorHelper){
    const playerIndicatorLightHelper = new THREE.SpotLightHelper(playerIndicatorLight);
    playerIndicator.add(playerIndicatorLightHelper);
    const playerIndicatorLocator = new THREE.Mesh(new THREE.SphereGeometry(100,12,12),matColorBlue);
    playerIndicatorTarget.add(playerIndicatorLocator);
  }
 
  scene.add(playerIndicatorTarget);
  scene.add(playerIndicator);
  animate();

  const geoPathSelector = new THREE.ConeGeometry( 100, 250, 32 ); 
  const pathSelectorA = new THREE.Mesh(geoPathSelector, matPathSelectorA ); 
  const pathSelectorB = new THREE.Mesh(geoPathSelector,matPathSelectorB);
  const pathSelectorA2 = new THREE.Mesh(geoPathSelector,matPathSelectorA2);
  const pathSelectorC = new THREE.Mesh(geoPathSelector,matPathSelectorC);

  var posA = boardSpot[21];
  var posA2 = boardSpot[50];
  var posB = boardSpot[27];
  var posC = boardSpot[57];

  pathSelectorA.position.set(posA.x, posA.y+500,posA.z);
  pathSelectorA.rotation.set(degToRad(90),0,degToRad(135));
  pathSelectorA2.position.set(posA2.x, posA2.y+500,posA2.z);
  pathSelectorA2.rotation.set(degToRad(-90),0,degToRad(-90));
  pathSelectorB.position.set(posB.x,posB.y+500,posB.z);
  pathSelectorB.rotation.set(degToRad(90),0,degToRad(66));
  pathSelectorC.position.set(posC.x,posC.y+500,posC.z);
  pathSelectorC.rotation.set(degToRad(-90),0,degToRad(190));
  
  pathSelector1.push(pathSelectorA);
  pathSelector1.push(pathSelectorB);
  pathSelector2.push(pathSelectorA2);
  pathSelector2.push(pathSelectorC);
  scene.add(pathSelectorA);
  scene.add(pathSelectorB);
  scene.add(pathSelectorA2);
  scene.add(pathSelectorC);

  //check board spot allignment:
  if(toggleTestBalls){
    var testBalls = [];
    for (var i = 0; i < boardSpot.length; i++){
      var type = boardSpot[i].type;
      switch (type){
        case "green":
          testBalls[i] = new THREE.Mesh(new THREE.SphereGeometry(100),matColorGreen);
        break;
        case "yellow":
          testBalls[i] = new THREE.Mesh(new THREE.SphereGeometry(100),matColorYellow);
        break;
        case "trap":
          testBalls[i] = new THREE.Mesh(new THREE.SphereGeometry(100),matColorRed);
        break;
        default:
          testBalls[i] = new THREE.Mesh(new THREE.SphereGeometry(100),matColorBlue);
      }
      scene.add(testBalls[i]);
      testBalls[i].position.set(boardSpot[i].x,boardSpot[i].y,boardSpot[i].z);
    }
  }
}

function setPlayerIndicator(playerId){
  playerId = playerId-1;
  console.log(playerId);
  playerIndicatorTarget.position.set(playerMesh[playerId].position.x,playerMesh[playerId].position.y,playerMesh[playerId].position.z);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}

function reset(){
  startGame(8);
  for ( var i = 0; i < players.length; i++){
    playerMesh[i].position.set(boardSpot[0].x,boardSpot[0].y,boardSpot[0].z-500 + (i*100));
  }
  playerTurn = 0;
  setPlayerIndicator(0);
  animate();
}



async function move(tweenObject,target,speed){
  if (tweenObject == null){
    console.log("move() did not receive tween target");
    return;
  }
  console.log("tween from tweenObjectposition:" + tweenObject.position.x + " " + tweenObject.position.y + " " + tweenObject.position.z);

  console.log("targetVector: " +  tweenObject.position.x + " " + tweenObject.position.y + " " + tweenObject.position.z);
    
  const tween1 = new Tween(tweenObject.position)
      .to(new THREE.Vector3(tweenObject.position.x,tweenObject.position.y+500,tweenObject.position.z), speed)
      .start();
      tween1.onComplete(function() {
        tweenGroup.remove(tween1);
        const tween2 = new Tween(tweenObject.position)
        .to(new THREE.Vector3(target.x,target.y+500,target.z),speed)
        .start();
        tween2.onComplete(function() {
          tweenGroup.remove(tween2);
          const tween3 = new Tween(tweenObject.position)
          .to((target),speed)
          .start();
          tweenGroup.add(tween3);
          tween3.onComplete(function(){
            console.log("finished tween3");
            tweenGroup.removeAll();
            return("finish");
          });
          console.log("finished tween2");
        });
        tweenGroup.add(tween2);
      }
    );
    tweenGroup.add(tween1);
}

function animate(){
  tweenGroup.update();
  render();
  requestAnimationFrame(animate);
}

function render() {
  camera.getWorldDirection(camVector);
  camPosition = camera.position;
  var rotateY = Math.atan2(camVector.x,camVector.z);

  for (var i = 0; i < playerMesh.length;i++){
    playerMesh[i].rotation.set(playerMesh[i].rotation.x, rotateY,playerMesh[i].rotation.z);
  }

  playerIndicatorTarget.position.set(playerMesh[playerTurn-1].position.x,playerMesh[playerTurn-1].position.y,playerMesh[playerTurn-1].position.z)
  playerIndicator.position.set((0.9 * playerIndicatorTarget.position.x) + (0.1 * camPosition.x), playerIndicatorTarget.position.y+1000, (0.9 * playerIndicatorTarget.position.z) + (0.1 * camPosition.z));

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
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
  
  raycaster.setFromCamera( pointer, camera );
  const intersects = raycaster.intersectObjects(pathSelector1, false );

  if(intersects.length > 0 && highlightedObject == null){
    highlightedObject = intersects[0];
    highlightedObject.object.material.emissiveIntensity = 2;
    highlightedObject.object.scale.set(1.2,1.2,1,2);
    render();
    return;    
  }

  if(!intersects.length > 0){
    if(highlightedObject == null){
      return;
    }
      highlightedObject.object.material.emissiveIntensity = 1;
      highlightedObject.object.scale.set(1,1,1);
      render();
      highlightedObject = null;
      return;
  }
}

function onClick(){
  raycaster.setFromCamera( pointer, camera );
  let firstIntersect;
  let uuids = [pathSelector1[0].uuid,pathSelector1[1].uuid];
  const intersects = raycaster.intersectObjects(pathSelector1, false );
  if (intersects.length > 0){
    firstIntersect = intersects[0];
    if(uuids[0] === firstIntersect.object.uuid){
      console.log("selected A");
      selectedPath = "A";
      selectingPath = false;
    }
    if(uuids[1] === firstIntersect.object.uuid){
      console.log("selected B");
      selectedPath = "B";
      selectingPath = false;
    }
    return firstIntersect;
  }
}

function testAnimation(){
  move(playerMesh[0],new THREE.Vector3(boardSpot[3].x, boardSpot[3].y, boardSpot[3].z),1000);
}

//EventHandlers
document.getElementById("buttonRoll").addEventListener("click", game ,false);
document.getElementById("buttonTrap").addEventListener("click", testAnimation ,false);
document.getElementById("buttonReset").addEventListener("click", reset ,false);
document.addEventListener( 'mousemove', onPointerMove );


if(!gameStarted){
  startGame(8);
  initGame(8);
}
animate();
// game();