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
  }

  draw(ctx) {
    ctx.save();
    ctx.rotate(this.angle);

    ctx.strokeStyle = "brown";
    ctx.fillStyle = "brown";

    ctx.beginPath();

    ctx.arc(this.bX, this.bY, 10, 0, 2 * Math.PI);

    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(this.bX, this.bY);
    ctx.lineTo(this.tX, CANON_SIZE);
    ctx.stroke();

    ctx.restore();
  }

  update(value) {
    this.angle += value;
  }
}
