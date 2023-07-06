class Player {
  constructor(ctx, x, y) {
    this.ctx = ctx;

    this.y0 = y;
    this.h0 = Math.floor(161 / 2);

    this.x = x;
    this.y = y;
    this.w = Math.floor(120);
    this.h = Math.floor(150);

    this.vx = 0;
    this.vy = 0;
    this.ay = PLAYER_AY;

    this.weapon = new Weapon(this.ctx, this.x + this.w, this.y + this.h / 2);

    this.isShooting = false;
    this.isSpaceReleased = true;
    this.shootingTime = 0;

    this.grenadeSpriteActivated = false;

    this.isRunning = false;
    

    this.shotSound = new Audio('music/shot.mp3');
    this.shotSound.volume = 0.3;
    this.shotSound.loop = false;

    this.runSound = new Audio('music/run.mp3');
    this.runSound.volume = 0.1;
    this.runSound.loop = true;

    this.walkSprite = new Image();
    this.walkSprite.src = '/img/Walk.png';
    this.walkSprite.verticalFrames = 1;
    this.walkSprite.verticalFrameIndex = 0;
    this.walkSprite.horizontalFrames = 7;
    this.walkSprite.horizontalFrameIndex = 0;

    this.runSprite = new Image();
    this.runSprite.src = '/img/Run.png';
    this.runSprite.verticalFrames = 1;
    this.runSprite.verticalFrameIndex = 0;
    this.runSprite.horizontalFrames = 8;
    this.runSprite.horizontalFrameIndex = 0;

    this.shootSprite = new Image();
    this.shootSprite.src = '/img/Shot_1.png';
    this.shootSprite.verticalFrames = 1;
    this.shootSprite.verticalFrameIndex = 0;
    this.shootSprite.horizontalFrames = 4;
    this.shootSprite.horizontalFrameIndex = 0;

    this.grenadeSprite = new Image();
    this.grenadeSprite.src = '/img/Grenade.png';
    this.grenadeSprite.verticalFrames = 1;
    this.grenadeSprite.verticalFrameIndex = 0;
    this.grenadeSprite.horizontalFrames = 9;
    this.grenadeSprite.horizontalFrameIndex = 0;

    this.sprite = this.walkSprite;

    this.walkSprite.onload = () => {
      this.walkSprite.isReady = true;
      this.walkSprite.frameWidth = Math.floor(
        this.walkSprite.width / this.walkSprite.horizontalFrames
      );
      this.walkSprite.frameHeight = Math.floor(
        this.walkSprite.height / this.walkSprite.verticalFrames
      );
    };

    this.shootSprite.onload = () => {
      this.shootSprite.isReady = true;
      this.shootSprite.frameWidth = Math.floor(
        this.shootSprite.width / this.shootSprite.horizontalFrames
      );
      this.shootSprite.frameHeight = Math.floor(
        this.shootSprite.height / this.shootSprite.verticalFrames
      );
    };

    this.grenadeSprite.onload = () => {
      this.grenadeSprite.isReady = true;
      this.grenadeSprite.frameWidth = Math.floor(
        this.grenadeSprite.width / this.grenadeSprite.horizontalFrames
      );
      this.grenadeSprite.frameHeight = Math.floor(
        this.grenadeSprite.height / this.grenadeSprite.verticalFrames
      );
    };

    this.runSprite.onload = () => {
      this.runSprite.isReady = true;
      this.runSprite.frameWidth = Math.floor(
        this.runSprite.width / this.runSprite.horizontalFrames
      );
      this.runSprite.frameHeight = Math.floor(
        this.runSprite.height / this.runSprite.verticalFrames
      );
    };

    this.animationTick = 0;
  }



  // KEYBOARD EVENTS
  onKeyDown(event) {
    switch (event.keyCode) {
      case KEY_SPACE:
        if (this.isSpaceReleased) {
          this.isShooting = true;
          this.isSpaceReleased = false;
          this.weapon.shoot();
          this.shotSound.play();
          this.shootingTime = 0; // Restablecer el tiempo de disparo
        }
        break;
      case KEY_UP:
        this.jump();
        break;
      case KEY_LEFT:
        this.vx = -PLAYER_SPEED;
        break;
      case KEY_RIGHT:
        this.vx = PLAYER_SPEED;
        break;
    }
  }

  onKeyUp(event) {
    switch (event.keyCode) {
      case KEY_LEFT:
      case KEY_RIGHT:
        this.vx = 0;
        break;
      case KEY_SPACE:
        if (this.isShooting) {
          this.isShooting = false;
          this.sprite = this.walkSprite;
          this.sprite.verticalFrameIndex = 0;
          this.sprite.frameWidth = Math.floor(this.sprite.width / this.sprite.horizontalFrames);
          this.sprite.frameHeight = Math.floor(this.sprite.height / this.sprite.verticalFrames);
        }
        this.isSpaceReleased = true;
        this.shotSound.pause();
        this.shotSound.currentTime = 0;
        break;
    }
  }




  // SOUNDS
  stopRunSound() {
    this.runSound.pause();
    this.runSound.currentTime = 0;
  }



  // MOVEMENT
  jump() {
    if (!this.isJumping()) {
      this.vy = -PLAYER_JUMP;
    }
  }

  isJumping() {
    return this.y < this.y0;
  }

  move() {
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;

    this.weapon.x = this.x + this.w;
    this.weapon.y = this.y + this.h / 2;
    this.weapon.move();

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.w > this.ctx.canvas.width) {
      this.x = this.ctx.canvas.width - this.w;
    }

    if (this.y > this.y0) {
      this.y = this.y0;
      this.vy = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    }

    this.weapon.move();
  }



  // DRAW AND ANIMATE
  draw() {
    if (this.sprite.isReady) {
      if (this.isShooting) {
        this.sprite = this.shootSprite;
      } else {
        this.sprite = this.walkSprite;
      }

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
    this.weapon.draw();
  }

  animate() {
    this.animationTick++;

    if (!this.isJumping() && !this.isShooting) {
      this.runSound.play();
    } else {
      this.runSound.pause();
    }

    if (this.isJumping()) {
      this.sprite.horizontalFrameIndex = 1;
    } else if (this.animationTick > PLAYER_RUN_ANIMATION_TICK) {
      this.animationTick = 0;
      this.sprite.horizontalFrameIndex++;

      if (this.sprite.horizontalFrameIndex > this.sprite.horizontalFrames - 1) {
        this.sprite.horizontalFrameIndex = 0;
      }
    }

    if (this.isShooting) {
      this.sprite = this.shootSprite;
      this.sprite.verticalFrameIndex = 0;
      this.sprite.frameWidth = Math.floor(this.sprite.width / this.sprite.horizontalFrames);
      this.sprite.frameHeight = Math.floor(this.sprite.height / this.sprite.verticalFrames);

      // Detener el disparo después de 3 segundos
      this.shootingTime += 1;
      if (this.shootingTime > 180) {
        this.isShooting = false;
        this.sprite = this.walkSprite;
      }
    }
  }
}
