class Planet {
    constructor (radius, initialX, initialY, color, active, name) {
        this.radius = radius;
        this.x = initialX;
        this.y = initialY;
        this.vx = 0;
        this.vy = 0;
        this.color = color;
        this.active = active;
        this.name = name;
        this.borderWidth = 10;
    }


    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fill()
        ctx.globalAlpha=0;
        ctx.lineWidth = this.borderWidth
        ctx.stroke()
        ctx.restore()
    }
    
    update() {

            this.x+=this.vx ;
            this.y+=this.vy ;
    
            if (this.rigth() > CANVAS_WIDTH || this.left() < 0 ) {
                this.vx *= -1;
            }
            if (this.top() < 0 )  { //500
                this.stop()
                this.y = this.radius 
            }
            if (this.bottom() > CANVAS_HEIGHT) {
                this.vy = -43.5;
            } 
    }

    stop() {
        this.vx = 0
        this.vy = 0
    }
    repeal(planet) {
        let vector = {
            x: this.x - planet.x,
            y: this.y - planet.y,
        }
        let vectorLength = Math.sqrt(vector.x**2 + vector.y**2)
        this.x += 0.95 * (planet.radius + this.radius - vectorLength) * vector.x / vectorLength
        this.y += 0.95 * (planet.radius + this.radius - vectorLength) * vector.y / vectorLength
    }
    isMoving() {
        return this.vx !== 0 || this.vy !== 0 
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
    setToCanon(canon) {
        this.x = CANVAS_WIDTH/2 + 100 * Math.sin(canon.angle)
        this.y = CANVAS_HEIGHT - 100 * Math.cos(canon.angle)
    }
    
}