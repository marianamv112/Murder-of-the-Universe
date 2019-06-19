class Planet {
    constructor (radius, initialX, initialY, vx, vy, color, active) {
        this.radius = radius;
        this.x = initialX;
        this.y = initialY;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.active = active;
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
        if(this.active) {
            this.x+=this.vx ;
            this.y+=this.vy ;
    
            if (this.rigth() > CANVAS_WIDTH || this.left() < 0 ) {
                this.vx *= -1;
            }
            if (this.top() < 0 )  { //500
                this.vy = -Math.abs(this.vy);
            }
            if (this.bottom() > CANVAS_HEIGHT) {
                this.vy = -43.5;
            }
            // let gravity = 1;
            // this.vy += gravity;
        } else {

        }
    }

    top() {return this.y - this.radius};
    bottom() {return this.y + this.radius};
    left() { return this.x - this.radius}; 
    rigth() { return this.x + this.radius};

    launch(canon) {
        this.active = true;
        this.vx = PLANET_SPEED * Math.sin(canon.angle)
        this.vy = -PLANET_SPEED * Math.cos(canon.angle)
    }
    
}