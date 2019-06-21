let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const POINTS_PER_POP = 10;

let ceilLevel = 0;
let score = 0;
let totalSeconds = 0;

let numOfSeconds = 0;
let numOfMinutes = 0;
let interval;

const PLANET_RADIUS = 50;
const INITIAL_SET = canvas.width / (PLANET_RADIUS * 2);
const PLANET_SPEED = 40;

let planets = [];

let planetNames;
let canon = new Canon();

let backgroundMusic = new Audio();
backgroundMusic.src = "audio/background.mp3";

let scoreDisplay = document.querySelector("#scoreDisplay");

const LIMIT_BOTTOM = 850;
const LIMIT_TOP = 0;

let background = new Image();
background.src = "images/green_background.png";

let background_blue = new Image();
background_blue.src = "images/blue_background.png";

let background_yellow = new Image();
background_yellow.src = "images/yellow_background.png";

let status;

let speed_of_ceiling_fall;

let goToSelectLevelsMenu;

  let startMenu = document.querySelector(".StartMenu");
  let levelsMenu = document.querySelector(".SelectLevels");
  
  let startButtons = document.querySelectorAll(".StartGameButton");
  let goToLevelsButton = document.querySelector(".SelectLevelsButton");

  let speedLevelButtons = document.querySelectorAll("button.Speed");
  let coverageLevelButtons = document.querySelectorAll("button.Coverage");

//Creates first shot and first planets
function createInitialSet() {
  

  speed_of_ceiling_fall = 60;
  planetNames = ["mercury", "uranus", "mars","earth","sun"]

  for (let num = 50; num < CANVAS_WIDTH; num += 100) {
    let b = new Planet(
      PLANET_RADIUS,
      num,
      50,
      false,
      planetNames[Math.floor(Math.random() * planetNames.length)]
    );
    planets.push(b);
  }

  planets.push(new Planet(PLANET_RADIUS, 300, 900, false, planetNames[Math.floor(Math.random() * planetNames.length)]));
}

function fillCeilOfPlanets() {
  for (let num = 50; num < CANVAS_WIDTH; num += 100) {
    let b = new Planet(
      PLANET_RADIUS,
      num,
      50,
      false, planetNames[Math.floor(Math.random() * planetNames.length)]
    );
    planets.unshift(b);
  }
}

function drawLimit(startX, startY, endX, endY) {
  ctx.save();
  ctx.globalAlpha=0;
  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();
}

// To draw things on the canvas
// Don't change any variable (except ctx) in this function
function drawEverything() {
  switch (status) {
    case "GameOver":
      drawGameOver(ctx)
      break;
    case "GameOn":
       //drawGameOver(ctx)
       drawGame(ctx)
      break;
    case "Win":
      drawGameWin(ctx)
      break;
    default:
      break;
  }
}




function drawGame(ctx) {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawLimit(0, LIMIT_BOTTOM, CANVAS_WIDTH, LIMIT_BOTTOM);
  drawLimit(0, ceilLevel, CANVAS_WIDTH, ceilLevel);
  ctx.drawImage(background_blue,0,0); 
  for (let num = 0; num < planets.length; num++) {
    planets[num].draw(ctx);
  }
  canon.draw(ctx);
  ctx.restore();
}

function drawGameOver(ctx) {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  clearInterval(interval);
  ctx.save();
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.font = "65px ElectricLiquorGoggles";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.drawImage(background_yellow,0,0); 

  scoreDisplay.style.visibility = "hidden";
  
  ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
  ctx.font = "30px Sansus-Webissimo";

  ctx.fillText("You had one job...", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4 + 40);
  ctx.font = "40px Sansus-Webissimo";

  ctx.fillText(
    `YOUR TIME: ${numOfMinutes} : ${numOfSeconds}`,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2 + 100
  );

  ctx.fillText(
    `YOUR SCORE: ${score}`,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2 + 160
  );

  ctx.fillText("Restart", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 260);
  ctx.fillText("Press Space", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 300);
  ctx.restore();
}

function drawGameWin(ctx) {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  clearInterval(interval);
  
  ctx.save();
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.drawImage(background,0,0); 
  
  ctx.font = "65px ElectricLiquorGoggles";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";

  scoreDisplay.style.visibility = "hidden";


  ctx.fillText("Congratulations,", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
  ctx.font = "45px ElectricLiquorGoggles";

  ctx.fillText("Murder of The Universe!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4 + 60);
  ctx.font = "25px Sansus-Webissimo";
  ctx.fillText("Now I am become Death, the destroyer of worlds", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4 + 90);
  
  ctx.font = "40px Sansus-Webissimo";

  ctx.fillText(
    `YOUR TIME: ${numOfMinutes} : ${numOfSeconds}`,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2 + 100
  );

  ctx.fillText(
    `YOUR SCORE: ${score}`,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2 + 160
  );

  ctx.fillText("Restart", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 260);
  ctx.fillText("Press Space", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 300);
  ctx.restore();
}

// To change variables
// Don't use ctx
function updateEverything() {
  
  for (let i = 0; i < planets.length-1; i++) {
    if (planets[i].bottom() > LIMIT_BOTTOM && !planets[i].isMoving()) {
      status = "GameOver";
    }
  }

  if (planets.length<2) {
    status = "Win";
  }

  canon.update();
  
  for (let i = 0; i < planets.length; i++) {
    planets[i].update();
  }
  
  planets[planets.length-1].setToCanon(canon);
  let planetShot = planets.find(planet => planet.isMoving());
  if (planetShot) {

    for (let iPlanet = 0; iPlanet < planets.length; iPlanet++) {
      if (
        planetShot !== planets[iPlanet] &&
        checkCollision(planetShot, planets[iPlanet])
      ) {
        collisionPlanet = planets[iPlanet]; //there's a collision
        planetShot.repeal(planets[iPlanet]);
        planetShot.stop();
        
      }
    }
    removeCollidingBalls(planetShot);
    removeAloneBalls();
  }
  

  scoreDisplay.innerText = `Score: ${score} points`;
}

function updateCeilLevel() {
  ceilLevel += 100;
  for(let i = 0; i < planets.length-1; i++) {
    planets[i].y += 100;
  }
  
}

function removeCollidingBalls(planetShot) {
  planets.forEach(planet => (planet.toRemove = false));
  planetShot.toRemove = true;
  let itemsToRemove = 1;

  //blackHoleCollision();

  for (let n = 0; n < 100; n++) {
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        if (
          checkCollision(planets[i], planets[j]) &&
          planets[i].name === planets[j].name &&
          ((planets[i].toRemove && !planets[j].toRemove) ||
            (!planets[i].toRemove && planets[j].toRemove))
        ) {
          itemsToRemove++;
          planets[i].toRemove = true;
          planets[j].toRemove = true;
        }
      }
    }
  }

  if (itemsToRemove >= 3) {
    sunCollision();

    score += planets.length
    planets = planets.filter(planet => !planet.toRemove);
    score -= planets.length
  }
}

/* function blackHoleCollision() {

  for (let n = 0; n < 100; n++) {
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) { 
       if (checkCollision(planets[i], planets[j]) &&
        (planets[i].color === "black") &&
        ((planets[i].toRemove && !planets[j].toRemove) ||
          (!planets[i].toRemove && planets[j].toRemove))
      ) {
        planets[j].color = "black";
      }
      } } }

} */

function sunCollision() {
  for (let k = 0; k < planets.length; k++) {
    for (let j = 0; j< planets.length; j++ ) {
      if(planets[k].name === "sun" && planets[k].toRemove) {
        if (planets[j].name === "sun") {
        planets[j].toRemove = true;
      }
    }
  }
}
}

function removeAloneBalls() {
  planets.forEach(p => {
    if (p.top() <= 0 || p.y > LIMIT_BOTTOM || p.isMoving()) p.score = 1;
    else p.score = 0;
  });

  for (let n = 0; n < planets.length; n++) {
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        if (
          checkCollision(planets[i], planets[j])
        ) {
          let maxScore = Math.max(planets[i].score, planets[j].score);
          planets[i].score = maxScore;
          planets[j].score = maxScore;
        }
      }
    }
  }
    score += planets.length
    planets = planets.filter(p => p.score >= 1)
    score -= planets.length
}

// Return the distance between two planets
function distance(planetA, planetB) {
  return Math.sqrt((planetA.x - planetB.x) ** 2 + (planetA.y - planetB.y) ** 2);
}

// Return true when planets are colliding
function checkCollision(planetA, planetB) {
  return (
    planetA.y < LIMIT_BOTTOM &&
    planetB.y < LIMIT_BOTTOM &&
    distance(planetA, planetB) <= planetA.radius + planetB.radius + planetA.borderWidth + planetB.borderWidth
  );
}

function animation() {
  updateEverything();
  drawEverything();
  window.requestAnimationFrame(animation);
}

createInitialSet();
animation();

document.onkeydown = event => {
  //space
  if (event.keyCode === 32) {
    if (status === "GameOn") {
      planets[planets.length - 1].launch(canon);
      let nextPlanetShot = new Planet(
        PLANET_RADIUS,
        300,
        900,
        false,
        planetNames[Math.floor(Math.random() * planetNames.length)]
      );
      planets.push(nextPlanetShot);
    } else if (status === "GameOver" || status === "Win") {
      status = "GameOn";
      location.reload();
    }

    if (startMenu.style.display !== "none") {
      startMenu.style.display = "none";
      levelsMenu.style.display = "flex";
    }
  }

  //left
  if (event.keyCode === 37) {
    canon.isMovingLeft = true 
  }
  // right
  if (event.keyCode === 39) {
    canon.isMovingRight = true
  }
};
document.onkeyup = event => {
  //left
  if (event.keyCode === 37) {
    canon.isMovingLeft = false
  }
  // right
  if (event.keyCode === 39) {
    canon.isMovingRight = false
  }
}

function setTime() {
  ++totalSeconds;
  numOfSeconds = numOfDigits(totalSeconds % 60);
  numOfMinutes = numOfDigits(parseInt(totalSeconds / 60));
  if (totalSeconds != 0 && (totalSeconds % speed_of_ceiling_fall) === 0 && ceilLevel < LIMIT_BOTTOM) {
    updateCeilLevel();
    fillCeilOfPlanets();
  };
  
}

function numOfDigits(val) {
  let valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}


  let startButton = document.getElementById("StartButtonImage");

  startButton.onclick = function() { 
    status = "GameOn";
    backgroundMusic.play();
    backgroundMusic.loop = true;
    interval = setInterval(setTime, 1000)
    startMenu.style.display = "none";
    levelsMenu.style.display = "none";
    canvas.style.display = "block";
    scoreDisplay.style.visibility = "visible";
  }

  for (let i = 0; i < speedLevelButtons.length; i++) {
    speedLevelButtons[i].onclick = function() {
      if (speedLevelButtons[i].classList.contains("Level1") ) {
        speed_of_ceiling_fall = 15;
        speedLevelButtons[i].style.backgroundColor = "white";
        for (let k = 0; k < speedLevelButtons.length; k++) {
          if (speedLevelButtons[k] !== speedLevelButtons[i]) {
            speedLevelButtons[k].style.backgroundColor = "#999";
          }
        }
      }
  
      if (speedLevelButtons[i].classList.contains("Level2") ) {
        speed_of_ceiling_fall = 30;
        speedLevelButtons[i].style.backgroundColor = "white";
        for (let k = 0; k < speedLevelButtons.length; k++) {
          if (speedLevelButtons[k] !== speedLevelButtons[i]) {
            speedLevelButtons[k].style.backgroundColor = "#999";
          }
        }
      }
  
      if (speedLevelButtons[i].classList.contains("Level3") ) {
        speed_of_ceiling_fall = 60;
        speedLevelButtons[i].style.backgroundColor = "white";
        for (let k = 0; k < speedLevelButtons.length; k++) {
          if (speedLevelButtons[k] !== speedLevelButtons[i]) {
            speedLevelButtons[k].style.backgroundColor = "#999";
          }
        }
      }
    }
  }

  for (let i = 0; i < coverageLevelButtons.length; i++) {
    

    
    coverageLevelButtons[i].onclick = function() {
      
      if (coverageLevelButtons[i].classList.contains("Level1") ) {
        planetNames = ["mercury","venus","mars","earth","jupiter","uranus","neptune","pluto","sun"];
        coverageLevelButtons[i].style.backgroundColor = "white";
        for (let k = 0; k < coverageLevelButtons.length; k++) {
          if (coverageLevelButtons[k] !== coverageLevelButtons[i]) {
            coverageLevelButtons[k].style.backgroundColor = "#999";
          }
        }

      } 
  
      if (coverageLevelButtons[i].classList.contains("Level2") ) {
        coverageLevelButtons[i].style.backgroundColor = "white";
        planetNames = ["mercury","neptune","mars","earth","jupiter","uranus"];

        coverageLevelButtons[i].style.backgroundColor = "white";
        for (let k = 0; k < coverageLevelButtons.length; k++) {
          if (coverageLevelButtons[k] !== coverageLevelButtons[i]) {
            coverageLevelButtons[k].style.backgroundColor = "#999";
          }
        }
      }
  
      if (coverageLevelButtons[i].classList.contains("Level3") ) {
        coverageLevelButtons[i].style.backgroundColor = "white";
        planetNames = ["mercury","uranus","mars"];

        coverageLevelButtons[i].style.backgroundColor = "white";
        for (let k = 0; k < coverageLevelButtons.length; k++) {
          if (coverageLevelButtons[k] !== coverageLevelButtons[i]) {
            coverageLevelButtons[k].style.backgroundColor = "#999";
          }
        }
      }

      
    }
  }
