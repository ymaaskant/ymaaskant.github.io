
// UI handling
const disableButton = () => {
  const button = document.querySelector("#buttonRoll");
  button.disabled = true;
};

const enableButton = () => {
  const button = document.querySelector("#buttonRoll");
  button.disabled = false;
};

// Player Objects
const playerObj = () => {
  return {
    name:"player",
    position:0,
    selector:"#player0"
  };
};

var gameStarted = false;
var playerTurn = 1;
var players =  [];
var nPlayers = 8;

// To start the game
const startGame = (nPlayers) => {
  players = Array(nPlayers).fill(null).map(playerObj);
  for (var i = 0; i < nPlayers; i++){
    players[i].selector=players[i].selector+(i+1);
  }
};

// Board 
const boardSpot = [
  { x: -1, y: 1, z: 3, type:"start"},
  { x: -0.125, y: 1.05, z: 3, type:"green"},
  { x: 0.33, y: 1, z: 3, type:"green"},
  { x: 0.75, y: 0.666, z: 3, type:"reset"},
  { x: 0.75, y: 0.25, z: 2.2, type:"trap"},
  { x: 1.25, y: 0.25, z: 1.875, type:"trap"},
  { x: 1.75, y: 0.25, z: 1.55, type:"trap"},
  { x: 2.25, y: 0.25, z: 1.2, type:"trap"},
  { x: 2.75, y: 0.25, z: 0.85, type:"trap"},
  { x: 3.5, y: 0.25, z: 0.35, type:"trap"},
  { x: 3.2, y: 0.9, z: 0, type:"green"},
  { x: 3.18, y: 1.4, z: 0, type:"green"},
  { x: 2.85, y: 1.75, z: 0, type:"green"},
  { x: 2.45, y: 1.7, z: 0, type:"yellow"},
  { x: 1.6, y: 1.65, z: 0, type:"green"},
  { x: 1.5, y: 1.65, z: 0, type:"green"},
  { x: 1.1, y: 1.8, z: 0, type:"yellow"},
  { x: 0.73, y: 2, z: 0, type:"green"},
  { x: 0.2, y: 2, z: 0, type:"green"},
  { x: -0.3, y: 2, z: 0, type:"reset"},
  { x: -0.78, y: 1.7, z: 0, type:"green"},
  { x: -0.9, y: 1.25, z: 0, type:"green"},
];

const dice = [
  {value:1},{value:1},{value:2},{value:3},{value:4},{value:0}
];

const game = () => {
// Initialize
  if(gameStarted === false){
    startGame(8);
    console.log(players);
    gameStarted=true;
  }

  // roll
  disableButton();
  var playerRoll=roll();
  var playerPosition = calcPos(playerTurn-1,playerRoll)
  playerMove(playerTurn-1, playerPosition);


  // Next Turn
  if (playerTurn >= nPlayers){
    playerTurn=1;
  } 
  else playerTurn++;
enableButton();
};

const trapActivation = (nTraps) =>{
  var randomNumber = Math.floor(Math.random() * nTraps) + 1;
  // console.log(randomNumber);
  return(randomNumber);
};

const roll = () => {
  var randomNumber = Math.floor(Math.random() * 6) + 1;
  // console.log("rolled: " + randomNumber);
  return randomNumber;
};

const calcPos = (playerId,roll) => {
  var playerNewPosition = players[playerId].position + roll;
  console.log(playerNewPosition);
  for (var i = 0; i < nPlayers; i++){
    if(i === playerId){
      console.log(i);
      continue;
    }
    if(players[i].position === playerNewPosition){
      playerNewPosition++;
      i=0;
    }
  }
  return (playerNewPosition);
};

const animationTimer = (ms) => new Promise((res) => setTimeout(res, ms));

async function playerMove(playerId,playerNewPosition){
  var player = document.querySelector(players[playerId].selector);

// Movement animation
// lift
  player.setAttribute("animation","to",{
    x:boardSpot[players[playerId].position].x,
    y:boardSpot[players[playerId].position].z + 0.5,
    z: boardSpot[players[playerId].position].y
  });
  // Move spots
  for (var i = players[playerId].position; i < playerNewPosition+1; i++) {
    await animationTimer(600);
    player.setAttribute("animation", "to", {
      x: boardSpot[i].x,
      y: boardSpot[i].z + 0.5,
      z: boardSpot[i].y,
    });
  }
  // Drop
  await animationTimer(500);
  player.setAttribute("animation","to",{
    x: boardSpot[playerNewPosition].x,
    y: boardSpot[playerNewPosition].z,
    z: boardSpot[playerNewPosition].y
  });
  players[playerId].position=playerNewPosition;
};