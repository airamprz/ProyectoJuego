class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.intervalId = null;
    this.tick = 60;

    this.bg = new Background(ctx);
    this.player = new Player(ctx, 10, this.ctx.canvas.height - 164);
    this.enemies = [];
    this.enemySpawnInterval = this.getRandomSpawnInterval();

    this.enemyTimer = null;

    this.introMessage = "¡Bienvenido al juego, mata a los zombies para sobrevivir y consigue 50.000 puntos para huir!";

    this.round = 1;
    this.enemiesKilled = 0;

    this.saveKey = 'gameProgress';

    this.lives = 5;
    this.lifeSprite = new Image();
    this.lifeSprite.src = '/img/livess.png';

    this.points = 0;
    this.cashImg = new Image();
    this.cashImg.src = '/img/cash.png';

    this.introTimer = null;
    this.introDuration = 3000;
    this.showIntro = true;

    this.winSprite = new Image();
    this.winSprite.src = '/img/helicopter.png';
    this.winSprite.verticalFrames = 4;
    this.winSprite.verticalFrameIndex = 0;
    this.winSprite.horizontalFrames = 1;
    this.winSprite.horizontalFrameIndex = 0;
    this.winSound = new Audio('/music/helicoptersound.mp3');

    this.showMessage = false;
    this.messageDuration = 3000; // Duración en milisegundos
    this.messageTimer = null; // Identificador del temporizador

    this.pointlvlSound = new Audio('/music/pointlvl1.mp3');
    this.audio = new Audio('/music/intro.mp3');
    this.gameMusic = new Audio('/music/music.mp3');
    this.gameOverAudio = new Audio('/music/theend.mp3');
    this.gameMusic.volume = 0.5;

    this.isPaused = false;
    this.loadProgress();
  }


  // KEYBOARD EVENTS
  onKeyDown(event) {
    if (this.showIntro && event.key === 'Enter') {
      this.hideIntro();
    } else if (event.key === 'Escape') {
      this.togglePause(); // Pausar/despausar el juego al presionar "Esc"
    } else if (event.keyCode === 112) { // Código de tecla para F1
      this.onF1KeyDown();
    } else {
      this.player.onKeyDown(event);
    }
  }

  onKeyUp(event) {
    if (!this.showIntro) {
      this.player.onKeyUp(event);
    }
  }

  onF1KeyDown() {
    if (this.points >= 500) {
      this.win();
    }
  }


  // START AND STOP
  start() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.clear();
        this.move();
        this.checkCollisions();
        this.draw();
      }, 1000 / this.tick);
    }

    this.spawnEnemy();
    this.enemyTimer = setInterval(() => {
      this.spawnEnemy();
    }, this.enemySpawnInterval);
  }

  stop() {
    clearInterval(this.intervalId);
    clearInterval(this.enemyTimer);
    this.intervalId = null;
    this.enemyTimer = null;
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.stop();
      this.stopRunSound();
    } else {
      this.start();
      this.gameMusic.play();
    }
  }


  // INTRO 
  startIntro() {
    this.showIntro = true;
    this.stop();

    this.clear();
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    const logoImg = new Image();
    logoImg.src = '/img/logozombie.png';

    logoImg.onload = () => {
      const desiredWidth = this.ctx.canvas.width * 0.3;
      const scaleFactor = desiredWidth / logoImg.width;
      const desiredHeight = logoImg.height * scaleFactor;
      const x = this.ctx.canvas.width / 2 - desiredWidth / 2;
      const y = this.ctx.canvas.height / 2 - desiredHeight / 2;

      this.ctx.drawImage(logoImg, x, y, desiredWidth, desiredHeight);

      this.ctx.font = '30px Arial';
      this.ctx.fillStyle = 'white';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Presiona "ENTER" para comenzar', this.ctx.canvas.width / 2, y + desiredHeight + 50);
    };

    window.addEventListener('keydown', this.handleIntroKeyDown.bind(this)); // Agrega el controlador de eventos keydown para el modo de introducción

    this.audio.loop = true;
    this.audio.play();
  }

  handleIntroKeyDown(event) {
    if (event.key === 'Enter') {
      this.hideIntro();
    }
  }

  hideIntro() {
    this.showIntro = false;
    window.removeEventListener('keydown', this.handleIntroKeyDown); // Elimina el controlador de eventos keydown para el modo de introducción
    this.audio.pause();
    this.start();
    this.gameMusic.loop = true;
    this.gameMusic.play();

    this.pointlvlSound.play();

    setTimeout(() => {
      alert(this.introMessage);
    }, 750); // Espera 1 segundo antes de mostrar el mensaje

  }


  // COLLISIONS
  checkCollisions() {
    const player = this.player;
    const bullets = this.player.weapon.bullets;

    this.enemies.forEach((enemy) => {
      const colx = player.x + player.w > enemy.x && player.x < enemy.x + enemy.w;
      const coly = player.y + player.h > enemy.y && player.y < enemy.y + enemy.h;

      if (colx && coly) {
        this.lives--;
        this.removeEnemy(enemy);

        if (this.lives === 0) {
          this.gameOver();
        }
      }
    });

    bullets.forEach((bullet) => {
      this.enemies.forEach((enemy) => {
        const colx = bullet.x + bullet.r > enemy.x && bullet.x - bullet.r < enemy.x + enemy.w;
        const coly = bullet.y + bullet.r > enemy.y && bullet.y - bullet.r < enemy.y + enemy.h;

        if (colx && coly) {
          this.removeEnemy(enemy);
          this.player.weapon.removeBullet(bullet);
          enemy.isDestroyed = true;

          this.points += 100;
          this.enemiesKilled++;

          if (this.enemiesKilled === 5) {
            this.round++;
            this.enemiesKilled = 0;
          }
          this.updateShowMessage(); // Actualizar this.showMessage
        }
      });
    });

    if (this.points >= 500 && KEY_F1 === 'true') {
      this.win();
    }
  }

  updateShowMessage() {
    if (this.points >= 500) {
      this.showMessage = true;
    }
  }

  // ENEMY SPAWN AND REMOVE
  spawnEnemy() {
    const enemy = new Enemy(this.ctx, this.player);
    this.enemies.push(enemy);
    this.enemySpawnInterval = this.getRandomSpawnInterval();
  }

  getRandomSpawnInterval() {
    return Math.floor(Math.random() * (7000 - 3000 + 1) + 3000);
  }

  removeEnemy(enemy) {
    const index = this.enemies.indexOf(enemy);
    if (index !== -1) {
      this.enemies.splice(index, 1);
    }
  }


  // CLEAR AND MOVE
  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  move() {
    this.bg.move();
    this.player.move();
    this.enemies.forEach((enemy) => {
      enemy.move();
    });
  }


  // DRAW
  drawRound() {
    this.ctx.font = '75px Arial';
    this.ctx.fillStyle = 'red';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`${this.round}`, this.ctx.canvas.width - 30, 100);
  }

  drawPoints() {
    this.ctx.font = '30px Arial';
    this.ctx.fillStyle = 'yellow';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`${this.points}`, 30, 100);

    const cashWidth = this.cashImg.width * 0.05; // Tamaño deseado del ancho de la imagen (más pequeño)
    const cashHeight = this.cashImg.height * 0.05; // Tamaño deseado del alto de la imagen (más pequeño)
    const cashX = 45 - cashWidth - 10; // Posición X de la imagen (antes del texto de los puntos)
    const cashY = 90 - cashHeight / 2; // Posición Y centrada de la imagen

    this.ctx.drawImage(this.cashImg, cashX, cashY, cashWidth, cashHeight);
  }


  drawLives() {
    const lifeWidth = 30; // Ancho deseado para cada vida
    const lifeHeight = 30; // Alto deseado para cada vida

    const canvasWidth = this.ctx.canvas.width;
    const padding = 10; // Espacio entre cada vida

    const totalWidth = this.lives * lifeWidth + (this.lives - 1) * padding; // Ancho total de las vidas

    const startX = (canvasWidth - totalWidth) / 2; // Posición X inicial para centrar las vidas
    const startY = padding; // Posición Y inicial

    for (let i = 0; i < this.lives; i++) {
      const lifeX = startX + (lifeWidth + padding) * i; // Posición X de cada vida
      const lifeY = startY; // Posición Y de cada vida

      this.ctx.drawImage(this.lifeSprite, lifeX, lifeY, lifeWidth, lifeHeight);
    }
  }

  draw() {
    this.bg.draw();
    this.player.draw();
    this.enemies.forEach((enemy) => {
      enemy.draw();
    });

    this.drawRound();
    this.drawPoints();
    this.drawLives();

    if (this.showMessage) {
      this.ctx.font = '24px Arial';
      this.ctx.fillStyle = 'black';
      this.ctx.textAlign = 'center';
      const messageX = this.ctx.canvas.width / 2;
      const messageY = this.ctx.canvas.height / 2;
      this.ctx.fillText('Presiona F1 para llamar al helicóptero', messageX, messageY);

      if (this.messageTimer === null) {
        this.messageTimer = setTimeout(() => {
          this.showMessage = false;
          this.messageTimer = null;
        }, this.messageDuration);
      }
    }
  }


  // SOUNDS
  stopRunSound() {
    this.player.stopRunSound();
  }


  // SAVE AND LOAD PROGRESS
  saveProgress() {
    const progress = {
      round: this.round,
      points: this.points,
      lives: this.lives,
    };
  
    localStorage.setItem(this.saveKey, JSON.stringify(progress));
  }
  
  loadProgress() {
    const savedProgress = localStorage.getItem(this.saveKey);
  
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
  
      this.round = progress.round;
      this.points = progress.points;
      this.lives = progress.lives;
    }
  }

  resetProgress() {
    localStorage.removeItem(this.saveKey);
  }


  // GAME OVER AND WIN
  gameOver() {
    this.stop();
    this.stopRunSound();
    this.gameOverAudio.volume = 0.02;
    this.gameOverAudio.play();
    this.gameMusic.pause();
    alert(`¡Has perdido! Rondas sobrevividas: ${this.round}, Puntos: ${this.points}`);
    location.reload();
  }

  win() {
    this.stop();
    this.stopRunSound();
    this.gameMusic.pause();
    this.winSound.play();

    alert(`¡Lo has logrado! Rondas sobrevividas: ${this.round}, Puntos: ${this.points}`);

    const spriteWidth = this.ctx.canvas.width * 0.5; // Ancho deseado del sprite
    const spriteHeight = spriteWidth * (this.winSprite.height / this.winSprite.width); // Mantener la proporción de aspecto

    const x = this.ctx.canvas.width / 2 - spriteWidth / 2; // Posición X centrada
    const y = this.ctx.canvas.height / 2 - spriteHeight / 2; // Posición Y centrada

    this.ctx.drawImage(this.winSprite, x, y, spriteWidth, spriteHeight);

  }

  // RESET GAME
  resetGame() {
    this.round = 1;
    this.points = 0;
    this.lives = 5;
    this.enemies = [];
  }
}