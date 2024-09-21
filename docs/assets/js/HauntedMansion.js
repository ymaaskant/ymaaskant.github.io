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
let camLocations = [
  {x:1000, y:4000, z:2000},
  {x:4000, y:2000, z:4000},
  {x:-4000, y:2000, z:4000},
  {x:-4000, y:2000, z:-4000},
  {x:4000, y:2000, z:-4000}
];
let sky, sun;

//GameVars
let gameStarted = false;
let turn = 0;

//settings & debugoptions
let toggleTestBalls = false;
let toggleTrapCoordHelpers = false;
let toggleSpotLightHelpers = false;
let togglePointLightHelpers = true;
let toggleCastShadows = false;
let togglePointLights = false;
let toggleSpotLights = true;
let toggleAmbientLight = true;
let setAmbientLightStrength = 0.1;
let togglePlayerIndicatorHelper = false;
let toggleFog = true;
let toggleBoard = true;

//players
let playerTurn = 0;
let players =  [];
let nPlayers = 8;
const playerGeometry = {x:300,y:750};
const playerIndicator = new THREE.Object3D();
const playerIndicatorTarget = new THREE.Object3D();
let playerMesh = [];
let playerNames = [];
let playerObj = [];

//animationsn
let tweenGroup = new Group();
let setAnimationSpeed = 1;

//txt
const fontLoader = new FontLoader();
const font = fontLoader.parse(HelvetikerFont);

//pathSelecting
let selectingPath = false;
let selectedPath;
let activePathSelector;
let pathSelector1 = [];
let pathSelector2 = [];

//raycasting
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let raycastTargets = null;
let highlightedObject = null;

//dice
const diceObj = new THREE.Group();
const dice = [1,1,2,3,4,0];
const diceShape = [
  {posX:0,posY:0,posZ:1,rotX:0,rotY:0,rotZ:0},
  {posX:0,posY:-1,posZ:0,rotX:90,rotY:0,rotZ:0},
  {posX:0,posY:0,posZ:-1,rotX:180,rotY:0,rotZ:0},
  {posX:0,posY:1,posZ:0,rotX:270,rotY:0,rotZ:0},
  {posX:-1,posY:0,posZ:0,rotX:0,rotY:90,rotZ:0},
  {posX:1,posY:0,posZ:0,rotX:0,rotY:270,rotZ:0}
];

//traps
const trapBall = new THREE.Mesh(new THREE.SphereGeometry(100,12,12),new THREE.MeshPhongMaterial({color:0x666666,reflectivity:1}));
let traps = [];
const trapCoords1 = [
  { x: 0.375, y: 2.5, z: 0.2, speed:1000, blend:200, easing:Easing.Linear.None},
  { x: 0.6, y: 2.3, z: 0.2, speed:500, blend:100, easing:Easing.Bounce.Out},
  { x: 1.1, y: 2.3, z: 0.2, speed:1000, blend:200, easing:Easing.Linear.None},
  { x: 1.1, y: 2, z: 0.2, speed:500, blend:100, easing:Easing.Bounce.Out},
  { x: 1.61, y: 2, z: 0.2, speed:1000, blend:200, easing:Easing.Linear.NoneOut},
  { x: 1.61, y: 1.64, z: 0.2, speed:500, blend:100, easing:Easing.Bounce.Out},
  { x: 2.08, y: 1.64, z: 0.2, speed:1000, blend:200, easing:Easing.Linear.None},
  { x: 2.08, y: 1.28, z: 0.2, speed:500, blend:100, easing:Easing.Bounce.Out},
  { x: 2.6, y: 1.28, z: 0.2, speed:1000, blend:200, easing:Easing.Linear.None},
  { x: 2.6, y: 0.93, z: 0.2, speed:500, blend:100, easing:Easing.Bounce.Out},
  { x: 3.09, y: 0.93, z: 0.2, speed:1000, blend:200, easing:Easing.Linear.None},
  { x: 3.09, y: 0.45, z: 0.2, speed:500, blend:100, easing:Easing.Bounce.Out},
  { x: 4.2, y: 0.45, z: 0.2,speed:1200, blend:200, easing:Easing.Linear.None},
  { x: 4.2, y: -2, z: 0.2, speed:500, blend:100, easing:Easing.Bounce.Out}
];  
const trapCoords2 = [
{ x: -150, y: 1700, z: 200, speed:1000, blend:200, easing:Easing.Linear.None},
{ x: -150, y: 1700, z: 500, speed:1000, blend:500, easing:Easing.Linear.None},
{ x: -150, y: 100, z: 500, speed:1000, blend:200, easing:Easing.Bounce.Out},
{ x: -900, y: 100, z: 500, speed:1000, blend:200, easing:Easing.Linear.None},
{ x: -1600, y: 100, z: 400, speed:1000, blend:200, easing:Easing.Linear.None},
{ x: -2200, y: 100, z: 200, speed:1000, blend:200, easing:Easing.Linear.None},
{ x: -2900, y: 100, z: 400, speed:1000, blend:100, easing:Easing.Linear.None},
{x: -2900, y:-1000,z:400,speed:500, blend:100, easing:Easing.Linear.None}
];
const trapCoords3 = [
{ x: -150, y: 1700, z: -125, speed:1000, blend:200, easing:Easing.Linear.None},
{ x: -500, y: 1700, z: -125, speed:1000, blend:200, easing:Easing.Linear.None},
{ x: -1275, y: 1625, z: -125, speed:1000, blend:200, easing:Easing.Linear.None},
{ x: -1275, y: 1600, z: 125, speed:1000, blend:200, easing:Easing.Linear.None},
{ x: -1275, y: 1300, z: 125, speed:1000, blend:200, easing:Easing.Linear.None}
];
const trapCoords4 = [
{ x: 120, y: 1700, z: 0, speed:1000, blend:200, easing:Easing.Linear.None},
{ x: 120, y: 1700, z: -475, speed:1000, blend:200, easing:Easing.Linear.None},
{ x: 120, y: 1300, z: -475, speed:1000, blend:200, easing:Easing.Linear.None},

];

//Board
const boardScaling = 666;
const boardSpot = [
    { x: -1, y: 1, z: 3, type:"start",path:"A"},
    { x: -0.125, y: 1.05, z: 3, type:"green",path:"A"},
    { x: 0.33, y: 1, z: 3, type:"green",path:"A"},
    { x: 0.75, y: 0.666, z: 3, type:"reset",path:"A"},
    { x: 0.75, y: 0.25, z: 2.2, type:"trap",path:"A"},
    { x: 1.25, y: 0.25, z: 1.875, type:"trap",path:"A"},
    { x: 1.75, y: 0.25, z: 1.55, type:"trap",path:"A"},
    { x: 2.25, y: 0.25, z: 1.2, type:"trap",path:"A"},
    { x: 2.75, y: 0.25, z: 0.85, type:"trap",path:"A"},
    { x: 3.5, y: 0.25, z: 0.35, type:"trap",path:"A"},
    { x: 3.2, y: 0.9, z: 0, type:"green",path:"A"},
    { x: 3.18, y: 1.4, z: 0, type:"green",path:"A"},
    { x: 2.85, y: 1.75, z: 0, type:"green",path:"A"},
    { x: 2.45, y: 1.7, z: 0, type:"yellow",path:"A"},
    { x: 1.9, y: 1.5, z: 0, type:"green",path:"A"},
    { x: 1.6, y: 1.75, z: 0, type:"green",path:"A"},
    { x: 1.1, y: 1.8, z: 0, type:"yellow",path:"A"},
    { x: 0.73, y: 2, z: 0, type:"green",path:"A"},
    { x: 0.2, y: 2, z: 0, type:"green",path:"A"},
    { x: -0.3, y: 2, z: 0, type:"reset",path:"A"},
    { x: -0.78, y: 1.7, z: 0, type:"green",path:"A"},
    { x: -0.9, y: 1.25, z: 0, type:"green",path:"B"},
    {x:-1.17, y:0.83, z:0, type:"trap",path:"B"},
    {x:-1.7, y:0.65, z:0, type:"trap",path:"B"},
    {x:-2.25, y:0.52, z:0, type:"trap",path:"B"},
    {x:-2.8, y:0.4, z:0, type:"trap",path:"B"},
    {x:-1.17, y:1.9, z:0, type:"green",path:"C"},
    {x:-1.65, y:2.05, z:0, type:"green",path:"C"},
    {x:-2.05, y:2.15, z:0, type:"green",path:"C"},
    {x:-2.6, y:2.1, z:0, type:"yellow",path:"C"},
    {x:-3, y:2.15, z:0, type:"green",path:"C"},
    {x:-3.4, y:1.95, z:0, type:"green",path:"C"},
    {x:-3.65, y:1.6, z:0, type:"yellow",path:"C"},
    {x:-3.65, y:1.2, z:0, type:"green",path:"C"},
    {x:-3.45, y:0.8, z:0, type:"green",path:"C"},
    {x:-3.4, y:0.3, z:0, type:"trap",path:"D"},
    {x:-3.4, y:-0.25, z:0, type:"reset",path:"D"},
    {x:-3.45, y:-0.76, z:0, type:"green",path:"D"},
    {x:-3.55, y:-1.15, z:0, type:"yellow",path:"D"},
    {x:-3.4, y:-1.6, z:0, type:"green",path:"D"},
    {x:-2.9, y:-1.65, z:0, type:"green",path:"D"},
    {x:-2.5, y:-1.33, z:0, type:"trap",path:"D"},
    {x:-2.35, y:-0.875, z:0, type:"trap",path:"D"},
    {x:-2.1, y:-0.45, z:0, type:"trap",path:"D"},
    {x:-1.65, y:-0.51, z:0, type:"trap",path:"D"},
    {x:-1.2, y:-0.78, z:0, type:"green",path:"D"},
    {x:-1.0, y:-1.18, z:0, type:"green",path:"D"},
    {x:-0.77, y:-1.65, z:0, type:"yellow",path:"D"},
    {x:-0.33, y:-1.9, z:0, type:"reset",path:"D"},
    {x:0.3, y:-1.78, z:0, type:"trap",path:"D"},
    {x:0.82, y:-1.88, z:0, type:"trap",path:"E"},
    {x:1.29, y:-1.8, z:0, type:"trap",path:"E"},
    {x:1.74, y:-1.88, z:0, type:"trap",path:"E"},
    {x:2.22, y:-1.8, z:0, type:"trap",path:"E"},
    {x:2.7, y:-1.8, z:0, type:"trap",path:"E"},
    {x:3.15, y:-2.07, z:0, type:"green",path:"E"},
    {x:3.45, y:-1.77, z:0, type:"green",path:"E"},
    {x:0.5, y:-1.2, z:0, type:"green",path:"F"},
    {x:0.65, y:-0.78, z:0, type:"green",path:"F"},
    {x:1.1, y:-0.85, z:0, type:"yellow",path:"F"},
    {x:1.55, y:-0.9, z:0, type:"green",path:"F"},
    {x:2, y:-0.7, z:0, type:"green",path:"F"},
    {x:2.35, y:-0.45, z:0, type:"yellow",path:"F"},
    {x:2.85, y:-0.325, z:0, type:"green",path:"F"},
    {x:3.35, y:-0.6, z:0, type:"green",path:"F"},
    {x:3.6, y:-1, z:0, type:"yellow",path:"F"},
    {x:3.7, y:-1.4, z:0, type:"green",path:"F"},
    {x:3.93, y:-2, z:0, type:"finish",path:"finish"}
  ];

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

const pawns = [
  {c:0x26a2ef},
  {c:0x26a2ef},
  {c:0x3bb835},
  {c:0x3bb835},
  {c:0x7e34a6},
  {c:0x7e34a6},
  {c:0xe0e259},
  {c:0xe0e259}
];
//////////////////////////////////////////////////////////////////////

//camera
camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 100, 2000000 );
camera.position.set(camLocations[0].x,camLocations[0].y,camLocations[0].z);
// camera.lookAt(boardSpot[0],2500,-200);
scene = new THREE.Scene();

//renderer
renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.sortObjects = true;
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render );
controls.enableZoom = true;
controls.enablePan = true;

renderer.domElement.addEventListener('click', onClick, false);
document.addEventListener( 'mousemove', onPointerMove );
window.addEventListener( 'resize', onWindowResize );

document.getElementById("buttonRoll").addEventListener("click", game ,false);
document.getElementById("buttonTrap").addEventListener("click", testButton ,false);
document.getElementById("buttonReset").addEventListener("click", reset ,false);
document.getElementById("buttonName").addEventListener("click", updatePlayerName ,false);


//////////////////////////////////////////////////////////////////////

  //functions
function disableButton () {
    const button = document.getElementById("buttonRoll");
    button.disabled = true;
  };
  
function enableButton () {
    const button = document.getElementById("buttonRoll");
    button.disabled = false;
  };
function scaleArray(arr,scale){
  for (let i = 0; i<arr.length;i++){
    arr[i].x = Math.floor(arr[i].x * scale);
    arr[i].y = Math.floor(arr[i].y * scale);
    arr[i].z = Math.floor(arr[i].z * scale);
  }
  // console.log(arr);
}

function scaleBoard(){
  for (var i = 0; i<boardSpot.length;i++){
    var x = Math.floor(boardSpot[i].x * boardScaling);
    var y = Math.floor(boardSpot[i].z * boardScaling + (0.5* playerGeometry.y));
    var z = Math.floor(boardSpot[i].y * boardScaling);
    boardSpot[i].x=x;
    boardSpot[i].y=y;
    boardSpot[i].z=z;
  }
}
  // Player Objects
function playerArray () {
    return {
      name:"player",
      position:0,
      path:"A",
      meshId:0
    };
};
  
  // To start the game
function startGame(nPlayers) {
  players = Array(nPlayers).fill(null).map(playerArray);
  for (var i = 0; i < nPlayers; i++){
    players[i].name=players[i].name+(i+1);
  }
  gameStarted=true;
  // console.log(players);
};
  
function playerTurnHandler () {
  if (playerTurn >= (nPlayers-1)){
    playerTurn=0;
  } 
  else playerTurn++;
  setPlayerIndicator(playerTurn);
  for(let i = 0; i<nPlayers;i++){
    if(i === playerTurn){
      playerNames[i].material.emissiveIntensity = 1;
    }
    else{
      playerNames[i].material.emissiveIntensity = 0.05;
    }
  }
  diceObj.rotation.set(0,0,0);
  controls.target.set(playerObj[playerTurn].position.x,playerObj[playerTurn].position.y,playerObj[playerTurn].position.z);
  controls.update();
  document.getElementById("inputName").value = players[playerTurn].name;
  turn++;
};

function logGame(){
  // console.log(players);
  // console.log("playerTurn = " + playerTurn + "   " + "nTurns = " + turn + "selectedPath = "+selectedPath + "   ");
}
  
async function game () {
  disableButton();
  let playerRoll = await roll();
  switch(playerRoll){
    case 0:
      trapActivation();
      break;
  default:
    let playerPosition = await calcPos(playerTurn,playerRoll);
    // console.log("calcpos: " + playerPosition);
    await playerMove(playerTurn, playerPosition);
  }
    
    // Next Turn
    playerTurnHandler();
    logGame();
    enableButton();
    // tweenGroup.removeAll();
};
  
  //animation timer promise
const animationTimer = (ms) => new Promise((res) => setTimeout(res, ms));
const inputTimeout = async ms => new Promise(res => setTimeout(res, ms));
  


async function roll (r) {
  return new Promise (async function(resolve,rejct){
    if (r == null){
      var randomNumber = Math.floor(Math.random() * 6);
      let diceSide = parseInt(dice[randomNumber]);
      // console.log("diceSide in roll(): " + diceSide);
      await diceAnimation(randomNumber);
      resolve(diceSide);
    } 
    else{
      await diceAnimation(r);
      resolve(r);
    }
  });


};

async function pathSelection (s){
  return new Promise (async function(resolve,reject){
    let choice;
    switch (s){
      case 20: 
        selectingPath = true;
        activePathSelector = s;
        raycastTargets = pathSelector1;
        updatePathSelectors(selectingPath,activePathSelector);
        while (selectingPath === true) await inputTimeout(250);
        choice = selectedPath;
        selectedPath = null;
        activePathSelector = null;
        updatePathSelectors();
        resolve(choice);
      break;
      case 25:
      resolve("D");
      break;
      case 34:
      resolve("D");
      case 49:
        selectingPath = true;
        activePathSelector = s;
        raycastTargets = pathSelector2;
        updatePathSelectors(selectingPath,activePathSelector);
        while (selectingPath === true) await inputTimeout(250);
        choice = selectedPath;
        // console.log("choice: " + choice);
        selectedPath = null;
        activePathSelector = null;
        updatePathSelectors();
        resolve(choice);
      break;
      default:
    }
    resolve(choice);
  });
}

function loopFreeSpot(id,Spot){
  let playerNewPosition = Spot;
  for (let i = 0; i < nPlayers; i++){
    if(i === id){
      continue;
    }
    if(players[i].position === playerNewPosition){
      playerNewPosition++;
      i=-1;
    }
  }   
  return(playerNewPosition);
}

async function calcPos (playerId,roll) {
//when player lands on occupied spot player will advance to next unoccupied spot
//when player PASSES fork during turn they need to choose a path
// playerpos + roll --> target spot --> is target spot occupied or did we pass a fork?
//when both apply the player needs to select a path, and the remainning roll needs to be added to the targetpos on the new path. 
//this new path also needs to be checked for occupied spot.
//in theory it is possible for a player to skip an entire path --> start at fork, select ' full' path and get pushed to the next main path (A > C > D).

  let playerSpot = players[playerId].position;
  let targetSpot = players[playerId].position + roll
  let updatedTargetSpot = players[playerId].position + roll
  // let pathStart = boardSpot.findIndex(({path})=> path === players[playerId].path);
  let pathEnd = boardSpot.findLastIndex(({path})=> path === players[playerId].path);

  return new Promise(async function(resolve,reject){
    //check if targetSpot is occupied, not checkin if player crosses pathEnd within roll
    if(targetSpot <= pathEnd){
      updatedTargetSpot = loopFreeSpot(playerId,targetSpot);
    }

    //if the target spot > pathEnd
    if(updatedTargetSpot > pathEnd){
      // console.log("in pathSelectionloop");
      //wait for return of enxt path
      let targetPath = await pathSelection(pathEnd);
      // console.log(targetPath);
      //get index of boardSpot for selected path, compare to see if player landed 1 square in (by roll or occupied spots), and if not add the remaininng roll.
      let pathStart = boardSpot.findIndex(({path})=> path === targetPath);
      let selectedPathEnd = boardSpot.findLastIndex(({path}) => path === targetPath);
      // console.log("pathStart: " + pathStart);
      if(targetSpot <= pathEnd){
        updatedTargetSpot = pathStart;
      }
      if(targetSpot > pathEnd){
        updatedTargetSpot = (roll - (pathEnd - playerSpot))+pathStart;
      }
      updatedTargetSpot = loopFreeSpot(playerId,updatedTargetSpot);
      if(updatedTargetSpot > selectedPathEnd){
        targetPath = await pathSelection(selectedPathEnd);
        // console.log("targetPath: " + targetPath);
        updatedTargetSpot = loopFreeSpot(playerId,updatedTargetSpot);
      }
      console.log(updatedTargetSpot);
    }

      if (updatedTargetSpot > boardSpot.length){
        console.log("player position > board spots. Player will not land on finish");
        resolve(playerSpot);
      }
    resolve(updatedTargetSpot);
  });
}

async function trapActivation(t){
  if(t == undefined){
    t = Math.floor(Math.random() * 4);
  }
  console.log("activating trap " + (t+1));
  await trapAnimation(t);

  switch (t){
    case 0:
      for (let i = 0; i < nPlayers;i++){
        if (players[i].position > 3 && players[i].position <10){
          console.log(players[i].name + " is reset to spot 3");
          playerMove(i,3);
        }
      }
      break;
  case 1:
    for (let i = 0; i < nPlayers;i++){
      if ((players[i].position >= 22 && players[i].position <= 25) ||  players[i].position === 35){
        console.log(players[i].name + " is reset to spot 3");
        playerMove(i,19);
      }
    }
    break;
  case 2:
    for (let i = 0; i < nPlayers;i++){
      if (players[i].position >= 41 && players[i].position <= 44){
        console.log(players[i].name + " is reset to spot 3");
        playerMove(i,27);
      }
    }
    break;
  case 3:
    for (let i = 0; i < nPlayers;i++){
      if (players[i].position >= 50 && players[i].position <= 54){
        console.log(players[i].name + " is reset to spot 3");
        playerMove(i,39);
      }
    }
    break;
  }
};

async function trapAnimation(t){
  let tweenTrap =[];
  let targetVector = new THREE.Vector3;
  return new Promise(async function(resolve,reject){
    trapBall.position.set(traps[t][0].x,traps[t][0].y,traps[t][0].z);
    for (let i = 0; i<traps[t].length;i++){
      targetVector=({x:traps[t][i].x,y:traps[t][i].y,z:traps[t][i].z});
      tweenTrap[i] = new Tween(trapBall.position)
      .to((targetVector),(traps[t][i].speed * setAnimationSpeed))
      .easing(traps[t][i].easing)
      .start();
      tweenGroup.add(tweenTrap[i]);
      await animationTimer((traps[t][i].speed-traps[t][i].blend)*setAnimationSpeed);
    }
      resetTrapBall();
      resolve("Done");
  });
}

function resetTrapBall(){
  trapBall.position.set(0,2500,0);
}
    
async function playerMove(playerId,playerNewPosition){
  return new Promise(async function(resolve,reject){

    if(!playerNewPosition === players[playerId].position){
      resolve("player at new position")
    }
  
    await animatePlayerMove(playerId,playerNewPosition);
    players[playerId].position = playerNewPosition;
    players[playerId].path = boardSpot[playerNewPosition].path;
  
    let type = boardSpot[playerNewPosition].type;
  
    switch (type){
      case "finish" :
        console.log(playerMesh[playerId].name + " wins!");
      break;
      case "trap" :
        await trapActivation();
      break;
      case "reset" :
      break;
      default:
    }
    resolve(true);
  });
  
}

async function animatePosition(id,target,speed){
  let o = playerObj[id];
  let tarX = target.x;
  let tarY = target.y;
  let tarZ = target.Z;
  let vec = new THREE.Vector3(tarX,tarY,tarZ);
  console.log(o);
  console.log(tarX + "  " + tarY + " " +tarZ);
  return new Promise (async function(resolve,reject){
    const tweenMove = new Tween(o.position)
    .to({x:vec.x,y:vec.y,z:vec.z},speed)
    .start();
    tweenMove.onComplete(function(){
      tweenGroup.remove(tweenMove);
      resolve(true);
    });
    tweenGroup.add(tweenMove);
  });
}

function animatePlayerMove(playerId,targetSpot){
  const tweenObject = playerObj[playerId];
  
  let speed = setAnimationSpeed * 2000;
  let offsetReset = 0;
  if(boardSpot[targetSpot].type === "reset"){
    offsetReset = 5;
  }
  
  const targetVector = new THREE.Vector3(boardSpot[targetSpot].x, boardSpot[targetSpot].y, boardSpot[targetSpot].z + (offsetReset*playerId));
  let posVector = new THREE.Vector3();
  let offsetY = Math.max(tweenObject.position.y, targetVector.y) + 500;

  if (tweenObject == null){
    console.log("move() did not receive tween target");
    return;
  }

  return new Promise(async function(resolve,reject){
    //up
    posVector = {x:tweenObject.position.x,y:offsetY,z:tweenObject.position.z};
    console.log(posVector.x +  " " + posVector.y + "  " + posVector.z);
    await animatePosition(playerId,posVector,speed);
    //move spots
    for (let i = players[playerId].position;i<targetSpot;i++){
      posVector = {x:boardSpot[i].x, y:offsetY,z:boardSpot[i].z};
      await animatePosition(playerId, posVector,500);
    }
    //down
    await animatePosition(playerId,targetVector,500);
    await animationTimer(1000);
    resolve(true);

    // const tweenUp = new Tween(tweenObject.position)
    //   .to(new THREE.Vector3(tweenObject.position.x,offsetY,tweenObject.position.z), 0.25*speed)
    //   .start();
    //   tweenUp.onComplete(function() {
    //     tweenGroup.remove(tweenUp);
    //     const tweenMove = new Tween(tweenObject.position)
    //     .to(new THREE.Vector3(targetVector.x,offsetY,targetVector.z),0.5*speed)
    //     .start();
    //     tweenMove.onComplete(function() {
    //       tweenGroup.remove(tweenMove);
    //       const tweenDown = new Tween(tweenObject.position)
    //       .to((targetVector),0.25*speed)
    //       .start();
    //       tweenGroup.add(tweenDown);
    //       tweenDown.onComplete(function(){
    //         tweenGroup.remove(tweenDown);
    //         done=true;
    //         resolve(done);
    //       });
    //     });
    //     tweenGroup.add(tweenMove);
    //   }
    // );
    // tweenGroup.add(tweenUp);
  });
}

async function initGame(nPlayers) {
  
  players = Array(nPlayers).fill(null).map(playerArray);
  for (var i = 0; i < nPlayers; i++){
    players[i].name=players[i].name+(i+1);
  }

  //fog
  if(toggleFog){
    scene.fog = new THREE.Fog( 0x000000, 5000, 8000 );
  }

  //traps
  scaleArray(trapCoords1,boardScaling);
  trapBall.position.set(0,1700,0);
  scene.add(trapBall);
  traps[0] = trapCoords1;
  traps[1] = trapCoords2;
  traps[2] = trapCoords3;
  traps[3] = trapCoords4;

  //lights
  if(toggleSpotLights){
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
  }

  if(togglePointLights){
    var pointLights = [];
    var pointHelpers = [];
    for (let i = 0; i<pointLightPositions.length;i++){
      pointLights[i] = new THREE.PointLight(pointLightPositions[i].color,50000,400);
      pointLights[i].position.set(pointLightPositions[i].x,pointLightPositions[i].y,pointLightPositions[i].z);
      pointLights[i].castShadow = toggleCastShadows;
      scene.add(pointLights[i]);

      if (togglePointLightHelpers){
        pointHelpers[i] = new THREE.PointLightHelper(pointLights[i],50);
        scene.add(pointHelpers[i]);
      }
    }
  }

  if(toggleAmbientLight){
    const ambientLight = new THREE.AmbientLight(0xffffff,setAmbientLightStrength);
    scene.add(ambientLight);
  }
  //controller
  // const controls = new OrbitControls( camera, renderer.domElement );
  // controls.addEventListener( 'change', render );
  // controls.enableZoom = true;
  // controls.enablePan = true;
  // window.addEventListener( 'resize', onWindowResize );

  const matBlack = new THREE.MeshPhongMaterial( {color: 0x000000});
  const matWhite = new THREE.MeshPhongMaterial({color:0xffffff});
  const matColorGreen = new THREE.MeshPhongMaterial({color:0x00ff00});
  const matColorYellow = new THREE.MeshPhongMaterial({color:0xffff00});
  const matColorRed = new THREE.MeshPhongMaterial({color:0xff0000});
  const matColorBlue = new THREE.MeshPhongMaterial({color:0x00ffff});

  scaleBoard();
  if(toggleBoard){
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

    const matBBase = new THREE.MeshPhongMaterial( { map: txBBase, transparent: false, side: THREE.FrontSide});
    const matBTop = new THREE.MeshPhongMaterial( { map: txBTop, transparent: true, side: THREE.FrontSide});
    const matTower1 = new THREE.MeshPhongMaterial( { map: txTower1, transparent: false, side: THREE.DoubleSide});
    const matTower2 = new THREE.MeshPhongMaterial( { map: txTower2, transparent: false, side: THREE.DoubleSide});
    const matTower3 = new THREE.MeshPhongMaterial( { map: txTower3, transparent: false, side: THREE.DoubleSide});
    const matStairs = new THREE.MeshPhongMaterial( { map: txStairs, transparent: true, side: THREE.DoubleSide});

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
      boardMesh[i].receiveShadow = false;
    }
    scene.add(Board);
    Board.rotation.set(0,degToRad(180),0);
  }

  //dice
  const diceSides = [];
  let txtGeo;
  scene.add(diceObj);
  for (let i = 0; i < dice.length;i++){
    let txtString = dice[i].toString();
    txtGeo = new TextGeometry(txtString,{font:font,size:1,depth:0.1,curveSegments:12,bevelEnabled:false});
    txtGeo.computeBoundingSphere();
    diceSides[i] = new THREE.Mesh(txtGeo,matColorBlue);
    diceSides[i].position.set(-txtGeo.boundingSphere.center.x,-txtGeo.boundingSphere.center.y,1);
    diceObj.rotation.set(degToRad(diceShape[i].rotX),degToRad(diceShape[i].rotY),degToRad(diceShape[i].rotZ));
    diceObj.attach(diceSides[i]);

  }
  const diceCenter = new THREE.Mesh(new THREE.BoxGeometry(2,2,2,1,1,1),new THREE.MeshBasicMaterial({color:0x440044}));
  diceObj.add(diceCenter);
  diceObj.scale.set(100,100,100);
  diceObj.rotation.set(0,0,0);
  diceObj.position.set(0,2500,0);


  //Players
  //textures
  const tx_pb1 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_b1.png');
  const tx_pb2 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_b2.png');
  const tx_pg1 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_g1.png');
  const tx_pg2 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_g2.png');
  const tx_pp1 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_p1.png');
  const tx_pp2 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_p2.png');
  const tx_py1 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_y1.png');
  const tx_py2 = new THREE.TextureLoader().load('/docs/assets/images/Textures/texture_c_y2.png');
  //materials
  const matPB1 = new THREE.MeshPhongMaterial( { map: tx_pb1, transparent: true, side: THREE.DoubleSide});
  const matPB2 = new THREE.MeshPhongMaterial( { map: tx_pb2, transparent: true, side: THREE.DoubleSide});
  const matPG1 = new THREE.MeshPhongMaterial( { map: tx_pg1, transparent: true, side: THREE.DoubleSide});
  const matPG2 = new THREE.MeshPhongMaterial( { map: tx_pg2, transparent: true, side: THREE.DoubleSide});
  const matPP1 = new THREE.MeshPhongMaterial( { map: tx_pp1, transparent: true, side: THREE.DoubleSide});
  const matPP2 = new THREE.MeshPhongMaterial( { map: tx_pp2, transparent: true, side: THREE.DoubleSide});
  const matPY1 = new THREE.MeshPhongMaterial( { map: tx_py1, transparent: true, side: THREE.DoubleSide});
  const matPY2 = new THREE.MeshPhongMaterial( { map: tx_py2, transparent: true, side: THREE.DoubleSide});
  //geometry + meshes
  const geometryPlayer = new THREE.PlaneGeometry(playerGeometry.x, playerGeometry.y);

  const player1Mesh = new THREE.Mesh( geometryPlayer, matPB1 );
  const player2Mesh = new THREE.Mesh( geometryPlayer, matPB2 );
  const player3Mesh = new THREE.Mesh( geometryPlayer, matPG1 );
  const player4Mesh = new THREE.Mesh( geometryPlayer, matPG2 );
  const player5Mesh = new THREE.Mesh( geometryPlayer, matPP1 );
  const player6Mesh = new THREE.Mesh( geometryPlayer, matPP2 );
  const player7Mesh = new THREE.Mesh( geometryPlayer, matPY1 );
  const player8Mesh = new THREE.Mesh( geometryPlayer, matPY2 );

  playerMesh.push(player1Mesh);
  playerMesh.push(player2Mesh);
  playerMesh.push(player3Mesh);
  playerMesh.push(player4Mesh);
  playerMesh.push(player5Mesh);
  playerMesh.push(player6Mesh);
  playerMesh.push(player7Mesh);
  playerMesh.push(player8Mesh);

  for ( var i = 0; i < nPlayers; i++){
    playerMesh[i].name = players[i].name;
    playerMesh[i].renderOrder = 900-(i*100);
    playerMesh[i].receiveShadow = false;
    players[i].meshId = playerMesh[i].id;   
  }
  //namebadges
  for (let i = 0; i<nPlayers; i++){
    let nameString = players[i].name.toString();
    let eI;
    if(i===0){
      eI = 1;
    }
    else{
      eI = 0.05;
    }

    const nameGeo = new TextGeometry(nameString,{font:font,size:50,depth:0.001,curveSegments:12,bevelEnabled:false});
    playerNames[i] = new THREE.Mesh(nameGeo,new THREE.MeshPhongMaterial({color:pawns[i].c,emissive:pawns[i].c,emissiveIntensity:eI}));
    playerNames[i].name = "player" + (i+1);
    nameGeo.computeBoundingSphere();
    playerNames[i].position.set(-nameGeo.boundingSphere.center.x,(0.5*playerGeometry.y)+150,0);
  }

  for(let i = 0; i < nPlayers;i++){
    playerObj[i] = new THREE.Object3D();
    playerObj[i].add(playerMesh[i]);
    playerObj[i].add(playerNames[i]);
    playerObj[i].position.set(boardSpot[0].x,boardSpot[0].y,boardSpot[0].z+200 - (i*150));
    scene.add(playerObj[i]);
  }

  //player Highlighter
  const playerIndicatorLight = new THREE.SpotLight(0xffffff,5,1500,degToRad(10),0.2,0);
  playerIndicator.add(playerIndicatorLight);
  playerIndicatorLight.target = playerIndicatorTarget;
  playerIndicatorTarget.position.set(playerObj[0].position.x, playerObj[0].position.y,playerObj[0].position.z);
  playerIndicator.position.set(playerObj[0].position.x, playerObj[0].position.y + 1250, playerObj[0].position.z);

  if(togglePlayerIndicatorHelper){
    const playerIndicatorLightHelper = new THREE.SpotLightHelper(playerIndicatorLight);
    playerIndicator.add(playerIndicatorLightHelper);
    const playerIndicatorLocator = new THREE.Mesh(new THREE.SphereGeometry(100,12,12),matColorBlue);
    playerIndicatorTarget.add(playerIndicatorLocator);
  }

  scene.add(playerIndicatorTarget);
  scene.add(playerIndicator);

  //pathSelectors
  const matPathSelectorB = new THREE.MeshPhongMaterial({color:0xff00ff,emissive:0xff00ff,emissiveIntensity:1});
  const matPathSelectorC = new THREE.MeshPhongMaterial({color:0xff00ff,emissive:0xff00ff,emissiveIntensity:1});
  const matPathSelectorE = new THREE.MeshPhongMaterial({color:0xff00ff,emissive:0xff00ff,emissiveIntensity:1});
  const matPathSelectorF = new THREE.MeshPhongMaterial({color:0xff00ff,emissive:0xff00ff,emissiveIntensity:1});
  const geoPathSelector = new THREE.ConeGeometry( 100, 250, 32 ); 
  const pathSelectorB = new THREE.Mesh(geoPathSelector, matPathSelectorB ); 
  const pathSelectorC = new THREE.Mesh(geoPathSelector,matPathSelectorC);
  const pathSelectorE = new THREE.Mesh(geoPathSelector,matPathSelectorE);
  const pathSelectorF = new THREE.Mesh(geoPathSelector,matPathSelectorF);

  var posB = boardSpot[21];
  var posE = boardSpot[50];
  var posC = boardSpot[26];
  var posF = boardSpot[57];

  pathSelectorB.position.set(posB.x, posB.y+500,posB.z);
  pathSelectorB.rotation.set(degToRad(90),0,degToRad(135));
  pathSelectorB.visible=false;
  pathSelectorC.position.set(posC.x,posC.y+500,posC.z);
  pathSelectorC.rotation.set(degToRad(90),0,degToRad(66));
  pathSelectorC.visible=false;
  pathSelectorE.position.set(posE.x, posE.y+500,posE.z);
  pathSelectorE.rotation.set(degToRad(-90),0,degToRad(-90));
  pathSelectorE.visible=false;
  pathSelectorF.position.set(posF.x,posF.y+500,posF.z);
  pathSelectorF.rotation.set(degToRad(-90),0,degToRad(190));
  pathSelectorF.visible=false;
  
  pathSelector1.push(pathSelectorB);
  pathSelector1.push(pathSelectorC);
  pathSelector2.push(pathSelectorE);
  pathSelector2.push(pathSelectorF);
  scene.add(pathSelectorB);
  scene.add(pathSelectorC);
  scene.add(pathSelectorE);
  scene.add(pathSelectorF);

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

  if(toggleTrapCoordHelpers){
    let trapCoords1Helpers = [];
    let trapCoords2Helpers = [];
    let trapCoords3Helpers = [];
    let trapCoords4Helpers = [];
    for(let i = 0; i< trapCoords1.length; i++){
      trapCoords1Helpers[i] = new THREE.Mesh(new THREE.SphereGeometry(100,6,6),matColorBlue);
      trapCoords1Helpers[i].position.set(trapCoords1[i].x,trapCoords1[i].y,trapCoords1[i].z);
      scene.add(trapCoords1Helpers[i]);
    }
    for(let i = 0; i< trapCoords2.length; i++){
      trapCoords2Helpers[i] = new THREE.Mesh(new THREE.SphereGeometry(100,6,6),matColorGreen);
      trapCoords2Helpers[i].position.set(trapCoords2[i].x,trapCoords2[i].y,trapCoords2[i].z);
      scene.add(trapCoords2Helpers[i]);
    }
    for(let i = 0; i<trapCoords3.length; i++){
      trapCoords3Helpers[i] = new THREE.Mesh(new THREE.SphereGeometry(100,6,6),matColorRed);
      trapCoords3Helpers[i].position.set(trapCoords3[i].x,trapCoords3[i].y,trapCoords3[i].z);
      scene.add(trapCoords3Helpers[i]);
    }
    for(let i = 0; i<trapCoords4.length; i++){
      trapCoords4Helpers[i] = new THREE.Mesh(new THREE.SphereGeometry(100,6,6),matColorYellow);
      trapCoords4Helpers[i].position.set(trapCoords4[i].x,trapCoords4[i].y,trapCoords4[i].z);
      scene.add(trapCoords4Helpers[i]);
    }
  }

  controls.target.set(playerObj[0].position.x, playerObj[0].position.y,playerObj[0].position.z);
  gameStarted=true;
}

function updatePlayerName(playerId,name){
  let nameString = document.getElementById("inputName").value;
  let oldGeo = playerNames[playerTurn].geometry;
  const nameGeo = new TextGeometry(nameString,{font:font,size:50,depth:0.001,curveSegments:12,bevelEnabled:false});
  nameGeo.computeBoundingSphere();
  playerNames[playerTurn].geometry = nameGeo;
  nameGeo.computeBoundingSphere();
  playerNames[playerTurn].position.set(-nameGeo.boundingSphere.center.x,playerNames[playerTurn].position.y,playerNames[playerTurn].position.z);
  scene.add(playerNames[playerTurn]);
  playerObj[playerTurn].add(playerNames[playerTurn]);
  oldGeo.dispose();
  players[playerTurn].name = nameString;
}

function setPlayerIndicator(playerId){
  playerIndicatorTarget.position.set(playerObj[playerId].position.x,playerObj[playerId].position.y,playerObj[playerId].position.z);
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
    players[i].position = 0;
    playerObj[i].position.set(boardSpot[0].x,boardSpot[0].y,boardSpot[0].z-500 + (i*100));
  }
  playerTurn = 0;
  setPlayerIndicator(0);
  controls.target.set(playerObj[playerTurn]);
  controls.update();
  document.getElementById("inputName").value = players[playerTurn].name;
  animate();
}

async function diceAnimation (roll){
  let done = false;
  return new Promise(async function(resolve, reject){
    if(roll == null){
      reject("didn't receive roll");
    }
    let rotationX = degToRad(diceShape[roll].rotX + 3600);
    let rotationY = degToRad(diceShape[roll].rotY + 3600);
    let rotationZ = degToRad(diceShape[roll].rotZ + 3600);
  
    const tweenRoll = new Tween(diceObj.rotation)
    .to(new THREE.Vector3(rotationX,rotationY,rotationZ),(setAnimationSpeed * 1000))
    .easing(Easing.Quintic.Out)
    .start();
    tweenRoll.onComplete(async function(){
        await animationTimer(1000);
        done = true;
        resolve(true);
      }
    );
    tweenGroup.add(tweenRoll)
  });
}

function animate(){
  // controls.target.set(playerObj[playerTurn].position.x,playerObj[playerTurn].position.y,playerObj[playerTurn].position.z);
  // controls.update();
  tweenGroup.update();
  render();
  requestAnimationFrame(animate);
}

function render() {
  
  camera.getWorldDirection(camVector);
  camPosition = camera.position;
  var rotateY = Math.atan2(camVector.x,camVector.z)+degToRad(180);

  for (var i = 0; i < playerObj.length;i++){
    playerObj[i].rotation.set(playerObj[i].rotation.x, rotateY,playerObj[i].rotation.z);
  }

  playerIndicatorTarget.position.set(playerObj[playerTurn].position.x,playerObj[playerTurn].position.y,playerObj[playerTurn].position.z)
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
  if(selectingPath){
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    // console.log(activePathSelector);
    
    if(activePathSelector ===20){
      raycastTargets = pathSelector1;
    }
    if(activePathSelector === 49){
      raycastTargets = pathSelector2;
    }
    // console.log(raycastTargets);
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects(raycastTargets, false );
    
    if(intersects.length > 0 && highlightedObject == null){
      highlightedObject = intersects[0];
      highlightedObject.object.material.emissiveIntensity = 2;
      highlightedObject.object.scale.set(1.2,1.2,1.2);
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
}

function updatePathSelectors(selectingPath,activePathSelector){
  switch(activePathSelector){
  case 20:
    pathSelector1[0].visible = selectingPath;
    pathSelector1[1].visible = selectingPath;
  break;
  case 49:
    pathSelector2[0].visible = selectingPath;
    pathSelector2[1].visible = selectingPath;
  break;
  default:
  }
  if(!highlightedObject){
    return;
  }
  else{
    highlightedObject.object.material.emissiveIntensity = 1;
    highlightedObject.object.scale.set(1,1,1);
    highlightedObject = null;
  }
}

function onClick(){
  return new Promise (function(resolve,reject){
    if(selectingPath){
      raycaster.setFromCamera( pointer, camera );
      let firstIntersect;
      let uuids = [pathSelector1[0].uuid,pathSelector1[1].uuid,pathSelector2[0].uuid,pathSelector2[1].uuid];
      const intersects = raycaster.intersectObjects(raycastTargets, false );
      if (intersects.length > 0){
        firstIntersect = intersects[0];
        if(uuids[0] === firstIntersect.object.uuid){
          selectedPath = "B";
          selectingPath = false;
          updatePathSelectors(selectingPath,activePathSelector);
          resolve(selectedPath);
        }
        if(uuids[1] === firstIntersect.object.uuid){
          selectedPath = "C";
          selectingPath = false;
          updatePathSelectors(selectingPath,activePathSelector);
          resolve(selectedPath);
        }
        if(uuids[2] === firstIntersect.object.uuid){
          selectedPath = "E";
          selectingPath = false;
          updatePathSelectors(selectingPath,activePathSelector);
          resolve(selectedPath);
        }
        if(uuids[3] === firstIntersect.object.uuid){
          selectedPath = "F";
          selectingPath = false;
          updatePathSelectors(selectingPath,activePathSelector);
          resolve(selectedPath);
        }
      } 
    }
  });   
}

async function testButton (){
  // trapActivation(1);
  for(let i = 0; i<dice.length;i++){
  dice[i] = 20;
  }
  game();
}

//EventHandlers


//loop
if(!gameStarted){
  initGame(8);
}

animate();
// game();



// function initSky() {
//   // Add Sky
//   sky = new Sky();
//   sky.scale.setScalar( 450000 );
//   scene.add( sky );
//   sun = new THREE.Vector3();

//   /// GUI
//   const effectController = {
//       turbidity: 10,
//       rayleigh: 3,
//       mieCoefficient: 0.005,
//       mieDirectionalG: 0.7,
//       elevation: 2,
//       azimuth: 180,
//       exposure: renderer.toneMappingExposure
//   };

//   function guiChanged() {

//       const uniforms = sky.material.uniforms;
//       uniforms[ 'turbidity' ].value = effectController.turbidity;
//       uniforms[ 'rayleigh' ].value = effectController.rayleigh;
//       uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
//       uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

//       const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
//       const theta = THREE.MathUtils.degToRad( effectController.azimuth );

//       sun.setFromSphericalCoords( 1, phi, theta );

//       uniforms[ 'sunPosition' ].value.copy( sun );

//       renderer.toneMappingExposure = effectController.exposure;
//       renderer.render( scene, camera );

//   }

//   const gui = new GUI();

//   gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
//   gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
//   gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
//   gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
//   gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
//   gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
//   gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );

//   guiChanged();

// }