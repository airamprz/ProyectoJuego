class Bullet {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y + 30;
        this.vx = 10;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0.02;
        this. r = 3;
    }

    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }

    move() {
        this.vx += this.ax;
        this.x += this.vx;
        this.y += this.vy;
    }
}