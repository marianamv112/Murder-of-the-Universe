let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
let angle = 0;
let angle2 = 0;
let scaleRatio = 1;
let b1 = new Ball(50,200,100,10,0,"purple");
let b2 = new Ball(50,50,100,10,0,"orange");


function drawReferential() {
  ctx.save();

  ctx.fillStyle = "red";
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;

  // Circle
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, 2 * Math.PI);
  ctx.fill();

  // Line for x
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(100, 0);
  ctx.stroke();

  // Line for y
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 100);
  ctx.stroke();

  ctx.restore();
}

function drawRotatedSquare() {
  ctx.save();
  ctx.fillStyle = "blue";

  ctx.translate(150, 150);
  ctx.rotate(angle);
  ctx.fillRect(-50, -50, 100, 100);
  // drawReferential();

  ctx.restore();
}

function drawRotatedSquare2() {
  ctx.save();
  ctx.fillStyle = "blue";

  ctx.translate(350, 150);
  ctx.rotate(angle2);
  ctx.scale(scaleRatio, scaleRatio);
  ctx.fillRect(-50, -50, 100, 100);
  // drawReferential();

  ctx.restore();
}


// To draw things on the canvas
// Don't change any variable (except ctx) in this function
function drawEverything() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  // ctx.fillRect(100, 100, 100, 100);
  // // drawReferential();
  // ctx.fillRect(300, 100, 100, 100);
  // drawRotatedSquare();
  // drawRotatedSquare2();
  b1.draw(ctx);
  b2.draw(ctx);
  
  
}

// To change variables
// Don't use ctx
function updateEverything() {
  angle += 0.01;
  angle2 += 0.02;
  scaleRatio *= 1.005;
  if (scaleRatio > 2) scaleRatio = 2
  b1.update();
  b2.update();
}

function animation() {
  updateEverything();
  drawEverything();
  window.requestAnimationFrame(animation);
}
animation();