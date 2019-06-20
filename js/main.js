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
let interval = setInterval(setTime, 1000);

const PLANET_RADIUS = 50;
const INITIAL_SET = canvas.width / (PLANET_RADIUS * 2);
const PLANET_SPEED = 40;

let planets = [];
let colors = ["purple", "orange", "blue"];
let canon = new Canon();


let scoreDisplay = document.querySelector("h5");
const LIMIT_BOTTOM = 850;
const LIMIT_TOP = 0;

let status = "GameOn";

//Creates first shot and first planets
function createInitialSet() {
  for (let num = 50; num < CANVAS_WIDTH; num += 100) {
    let b = new Planet(
      PLANET_RADIUS,
      num,
      50,
      colors[Math.floor(Math.random() * colors.length)],
      false
    );
    planets.push(b);
  }

  planets.push(new Planet(PLANET_RADIUS, 300, 900, "purple", false));
}

function fillCeilOfPlanets() {
  for (let num = 50; num < CANVAS_WIDTH; num += 100) {
    let b = new Planet(
      PLANET_RADIUS,
      num,
      50,
      colors[Math.floor(Math.random() * colors.length)],
      false
    );
    planets.unshift(b);
  }
}

function drawLimit(startX, startY, endX, endY) {
  ctx.save();
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

  for (let num = 0; num < planets.length; num++) {
    planets[num].draw(ctx);
  }
  canon.draw(ctx);
  ctx.restore();
}

function drawGameOver(ctx) {
  clearInterval(interval);
  ctx.save();
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.font = "100px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";

  scoreDisplay.style.display = "None";
  ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
  ctx.font = "40px Arial";

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
  clearInterval(interval);
  ctx.save();
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  ctx.font = "100px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "green";

  scoreDisplay.style.display = "None";
  ctx.fillText("CONGRATS!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
  ctx.font = "40px Arial";

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
    if (planets.length===0) {
      status = "Win";
    }
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

  for (let n = 0; n < 100; n++) {
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        if (
          checkCollision(planets[i], planets[j]) &&
          planets[i].color === planets[j].color &&
          ((planets[i].toRemove && !planets[j].toRemove) ||
            (!planets[i].toRemove && planets[j].toRemove))
        ) {
          itemsToRemove++;
          planets[i].toRemove = true;
          planets[j].toRemove = true;
        }
       /*  else if (checkCollision(planets[i], planets[j]) && planets[i].color === planets[j].color 
        && (planets[i].color === "black" || planets[j].color === "black")) {
          
        } */
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

function sunCollision() {
  for (let k = 0; k < planets.length; k++) {
    for (let j = 0; j< planets.length; j++ ) {
      if(planets[k].color === "blue" && planets[k].toRemove) {
        if (planets[j].color === "blue") {
        planets[j].toRemove = true;
      }
    }
  }
}
}





function removeAloneBalls() {
  planets.forEach(p => {
    if (p.top() <= ceilLevel || p.y > LIMIT_BOTTOM || p.isMoving()) p.score = 1;
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
    if (status == "GameOn") {
      planets[planets.length - 1].launch(canon);

      let nextPlanetShot = new Planet(
        PLANET_RADIUS,
        300,
        900,
        colors[Math.floor(Math.random() * colors.length)],
        false
      );

      planets.push(nextPlanetShot);
    } else {
      status = "GameOn";
      location.reload();
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
  if (totalSeconds != 0 && (totalSeconds % 2) === 0 && ceilLevel < LIMIT_BOTTOM) {
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
