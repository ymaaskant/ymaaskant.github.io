const disableButton = () => {
    const button = document.querySelector("#buttonRoll");
    button.disabled = true;
  };

  const enableButton = () => {
    const button = document.querySelector("#buttonRoll");
    button.disabled = false;
  };

  const boardSpot = [
    { x: -1, y: 1, z:3, type:"start"},
    { x: -0.125, y: 1.05, z:3, type:"green"},
    { x: 0.33, y: 1, z:3, type:"green"},
    { x: 0.78, y: 0.666, z:3, type:"reset"},
    { x: 0.78, y: 0.25, z:2.2, type:"trap"},
    { x: 0.78, y: 0.25, z:2.2, type:"trap"},


  ];

  var p1Spot = 1;
  var p2Spot = 1;
  var p1NewSpot = 0;
  var p2NewSpot = 0;
  var playerTurn = 1;
  const finish = 25;

  const roll = () => {
    disableButton();
    var randomNumber = Math.floor(Math.random() * 6) + 1;
    console.log("rolled: " + randomNumber);
    playerMove(playerTurn, randomNumber);
    return randomNumber;
  };

  const animationTimer = (ms) => new Promise((res) => setTimeout(res, ms));

  async function playerMove(player, roll) {
    if (player === 1) {
      var player = document.querySelector("#player01");
      var playerOldSpot = p1Spot;
      var playerNewSpot = p1Spot + roll;
      p1Spot = playerNewSpot;
      playerTurn = 2;
    } else if (player === 2) {
      var player = document.querySelector("#player02");
      var playerOldSpot = p2Spot;
      var playerNewSpot = p2Spot + roll;
      p2Spot = playerNewSpot;
      playerTurn = 1;
    }

    if (playerNewSpot > finish) {
      playerNewSpot = finish;
      console.log("player wins");
    }
    for (var i = playerOldSpot; i < playerNewSpot; i++) {
      console.log("i" + i);
      player.setAttribute("animation", "to", {
        x: boardSpot[i].x,
        y: 0.25,
        z: boardSpot[i].y,
      });
      await animationTimer(600);
    }
    console.log("p1Spot: " + p1Spot + " p2Spot: " + p2Spot);
    enableButton();
  }