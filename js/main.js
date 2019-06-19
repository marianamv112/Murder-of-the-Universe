let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const POINTS_PER_POP = 10;

let score = 0;

let numOfSeconds = 0;
let numOfMinutes = 0;
let interval = setInterval(setTime, 1000);

const PLANET_RADIUS = 50;
const INITIAL_SET = canvas.width / (PLANET_RADIUS * 2);
const PLANET_SPEED = 40

let shots = [];
let planets = [];
let colors = ["purple", "orange"];
let planetShot;
let canon = new Canon();
let toPop = [];

let scoreDisplay = document.querySelector("h5");
const LIMIT_BOTTOM = 850;
const LIMIT_TOP = 0;

let status = "GameOn";

//Creates first shot and first planets
function createInitialSet() {
  planetShot = new Planet(PLANET_RADIUS, 300, 900, 10, 0, "purple", false);
  shots.push(planetShot);

  for (let num = 50; num < CANVAS_WIDTH; num += 100) {
    let b = new Planet(
      PLANET_RADIUS,
      num,
      50,
      10,
      0,
      colors[Math.floor(Math.random() * colors.length)],
      false
    );
    planets.push(b);
  }
}

function drawLimit() {
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, LIMIT_BOTTOM);
  ctx.lineTo(CANVAS_WIDTH, LIMIT_BOTTOM);
  ctx.stroke();
  ctx.restore();
}

// To draw things on the canvas
// Don't change any variable (except ctx) in this function
function drawEverything() {
  for (let i = 0; i < planets.length; i++) {
    if (distanceToLimits(planets[i], LIMIT_BOTTOM) <= 0) {
      status = "GameOver";
    }
  }

  if (status == "GameOver") {
    drawGameOver(ctx);
  } else {
    drawGame(ctx);
  }
}

function drawGame(ctx) {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawLimit();

  for (let num = 0; num < planets.length; num++) {
    planets[num].draw(ctx);
  }

  if (shots.length >= 1) {
    for (let num = 0; num < shots.length; num++) {
      shots[num].draw(ctx);
    }
  }

  ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT);

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

let direction = 1;

// To change variables
// Don't use ctx
function updateEverything() {
  if (planetShot) {
    planetShot.update();

    /* if (distanceToLimits(planetShot, LIMIT_TOP) < 0) {
      shotGetsGluded();
    } */

    let collisionPlanet;

    for (let planet = 0; planet < planets.length; planet++) {
      if (checkCollision(planetShot, planets[planet])) {
        collisionPlanet = planets[planet]; //there's a collision
      }
    }
    if (collisionPlanet && collisionPlanet.color == planetShot.color) {
      //we need to evaluate if planets pop or not
      checkAdjacencies(collisionPlanet); //at least three planets needed

      if (toPop.length < 2) {
        //collision between only two
        //shot glues
        shotGetsGluded();
      } else {
        //shot pops as the planets
        score += (toPop.length + 1) * POINTS_PER_POP;
        shots.splice(shots.indexOf(planetShot), 1);
        planetShot = shots[0];
      }
      //collision between planets of different colors
    } else if (collisionPlanet && collisionPlanet.color !== planetShot.color) {
      shotGetsGluded(); //shot glues
    }
    scoreDisplay.innerText = `Score: ${score} points`;
    toPop = [];
  }
}

function shotGetsGluded() {
  planetShot.active = false;
  planets.push(planetShot);
  shots.splice(shots.indexOf(planetShot), 1);
  planetShot = shots[0];
}

//Verifies adjencies of the planet receives the collison
function checkAdjacencies(planet) {
  planets.forEach(p => {
    //in comparison to every other planet
    //if they're adjacents and have the same color
    if (
      checkCollision(p, planet) &&
      p.color == planet.color &&
      !toPop.includes(p) &&
      p !== planet
    ) {
      toPop.push(p);
      pivot = p;
      return checkAdjacencies(p); //I'll need to call the function again over the adjacent
    } else {
      if (toPop.length > 1) {
        planets = planets.filter(x => !toPop.includes(x)); //remove adjacencies collected from planets
      }
    }
  });
}

//Return the distance between a planet and the limit
function distanceToLimits(planet, limit) {
  return limit - (planet.y + planet.radius);
}

// Return the distance between two planets
function distance(planetA, planetB) {
  return Math.sqrt((planetA.x - planetB.x) ** 2 + (planetA.y - planetB.y) ** 2);
}

// Return true when planets are colliding
function checkCollision(planetA, planetB) {
  return distance(planetA, planetB) <= planetA.radius + planetB.radius;
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
      planetShot.launch(canon)


      let nextPlanetShot = new Planet(
        PLANET_RADIUS,
        300,
        900,
        10,
        0,
        colors[Math.floor(Math.random() * colors.length)],
        false
      );

      shots.push(nextPlanetShot);
    } else {
      status = "GameOn";
      location.reload();
    }
  }

  //left
  if (event.keyCode === 37) {
    canon.update(-0.02);
  }
  // right
  if (event.keyCode === 39) {
    canon.update(0.02);
  }
};

let totalSeconds = 0;

function setTime() {
  ++totalSeconds;
  numOfSeconds = numOfDigits(totalSeconds % 60);
  numOfMinutes = numOfDigits(parseInt(totalSeconds / 60));
}

function numOfDigits(val) {
  let valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
