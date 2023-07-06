class Background {
  constructor(ctx) {
    this.ctx = ctx;
    this.w = this.ctx.canvas.width
    this.h = this.ctx.canvas.height
    this.x = 0
    this.y = 0

    this.vx = -2

    this.img = new Image()
    this.img.src = "https://image.freepik.com/free-vector/sky-day-game-background_7814-306.jpg"
    this.img.onload = () => {
      this.img.isReady = true;
    }

  }

  move() {
    this.x += this.vx;
    if (this.x < -this.w) {
      this.x = 0;
    }
  }


  draw() {
    if (this.img.isReady) {
      this.ctx.drawImage(
        this.img,
        this.x,
        this.y,
        this.w,
        this.h
      )

      this.ctx.drawImage(
        this.img,
        this.x + this.w,
        this.y,
        this.w,
        this.h
      )
    }
  }
}