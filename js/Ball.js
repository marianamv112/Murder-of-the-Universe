class Ball {
    constructor (radius, initialX, initialY, vx, vy, color) {
        this.radius = radius;
        this.x = initialX;
        this.y = initialY;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fill()
        ctx.restore()
    }
    
    update() {
        this.x+=this.vx ;
        this.y+=this.vy ;

        if (this.rigth() > CANVAS_WIDTH || this.left() < 0 ) {
            this.vx *= -1;
        }
        if (this.top() < 0 )  { //500
            this.vy = -Math.abs(this.vy);
        }
        if (this.bottom() > CANVAS_HEIGHT) {
            this.vy = -40;
        }
        let gravity = 1;
        this.vy += gravity;
    }

    top() {return this.y - this.radius};
    bottom() {return this.y + this.radius};
    left() { return this.x - this.radius}; //0 - 50 = -50 
    rigth() { return this.x + this.radius};
}