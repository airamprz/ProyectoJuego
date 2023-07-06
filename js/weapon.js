class Weapon {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;

    this.bullets = [];
  }

  shoot() {
    // Define la cantidad de balas en cada ráfaga y el retardo entre cada bala (en milisegundos)
    const bulletsPerBurst = 57;
    const bulletDelay = 50;

    // Crea y agrega múltiples balas a la matriz con un retardo entre ellas
    for (let i = 0; i < bulletsPerBurst; i++) {
      setTimeout(() => {
        const newBullet = new Bullet(this.ctx, this.x, this.y);
        this.bullets.push(newBullet);
      }, i * bulletDelay);
    }
  }

  removeBullet(bullet) {
    const index = this.bullets.indexOf(bullet);
    if (index !== -1) {
      this.bullets.splice(index, 1);
    }
  }

  draw() {
    this.bullets.forEach((bullet) => bullet.draw());
  }

  move() {
    this.bullets.forEach((bullet) => bullet.move());
  }
}