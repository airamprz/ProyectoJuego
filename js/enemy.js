class Enemy {
  constructor(ctx, player) {
    this.ctx = ctx;
    this.x = this.ctx.canvas.width;
    this.y = this.ctx.canvas.height - 90;
    this.w = 60;
    this.h = 80;
    this.vx = -0.5;

    this.player = player;

    this.sprite = new Image();
    this.sprite.src = '/img/zombie.png';
    this.sprite.verticalFrames = 1;
    this.sprite.verticalFrameIndex = 0;
    this.sprite.horizontalFrames = 7;
    this.sprite.horizontalFrameIndex = 0;

    this.sprite.onload = () => {
      this.sprite.isReady = true;
      this.sprite.frameWidth = Math.floor(this.sprite.width / this.sprite.horizontalFrames);
      this.sprite.frameHeight = Math.floor(this.sprite.height / this.sprite.verticalFrames);
    }

    this.animationTick = 0;
  }


  
  draw() {
    if (this.sprite.isReady) {
      this.ctx.drawImage(
        this.sprite,
        this.sprite.horizontalFrameIndex * this.sprite.frameWidth,
        this.sprite.verticalFrameIndex * this.sprite.frameHeight,
        this.sprite.frameWidth,
        this.sprite.frameHeight,
        this.x,
        this.y,
        this.w,
        this.h
      );

      this.animate();
    }
  }

  move() {
    this.x += this.vx;
  }

  animate() {
    this.animationTick++;

    if (this.animationTick > PLAYER_RUN_ANIMATION_TICK) {
      this.animationTick = 0;
      this.sprite.horizontalFrameIndex++;

      if (this.sprite.horizontalFrameIndex > this.sprite.horizontalFrames - 1) {
        this.sprite.horizontalFrameIndex = 0;
      }
    }
  }
}