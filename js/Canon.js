const CANON_SIZE = -100;
const MAX_TX = 120;
// let angle = 0;

class Canon {
  constructor() {
    this.bX = 0;
    this.bY = 0;

    this.tX = this.bX;
    this.tY = CANON_SIZE;

    this.movementDirection = 1;
    this.angle = 0;
    this.isMovingLeft = false;
    this.isMovingRight = false;

    this.img = new Image();
    this.img.src = "images/canon.png";
    this.img.src = "/Users/mariana/Documents/IronHack/WebDev Bootcamp/code/w3/Project /images/canon.png";
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT);

    ctx.rotate(this.angle);

    ctx.strokeStyle = "brown";
    ctx.fillStyle = "brown";

    ctx.beginPath();
    ctx.drawImage(this.img, -CANON_SIZE , -CANON_SIZE , CANON_SIZE*2, CANON_SIZE*2);
    ctx.globalAlpha=0;
    ctx.arc(this.bX, this.bY, 10, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(this.bX, this.bY);
    ctx.lineTo(this.tX, CANON_SIZE);
    ctx.stroke();

    ctx.restore();
  }

  update() {
    if (this.isMovingLeft) this.angle -= 0.02;
    if (this.isMovingRight) this.angle += 0.02;
  }
}
