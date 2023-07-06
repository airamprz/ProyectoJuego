const modal = document.getElementById("logandreg");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

window.onload = function () {
  modal.style.display = "block";
};

const closeButton = document.getElementsByClassName("close")[0];
closeButton.onclick = function () {
  modal.style.display = "none";
};



const ctx = document.getElementById('canvas').getContext('2d');
const game = new Game(ctx);

window.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('canvas').getContext('2d');
  const game = new Game(ctx);
  game.loadProgress(); // Carga el progreso guardado antes de iniciar el juego

  window.addEventListener('keydown', (event) => {
    game.onKeyDown(event);
  });

  window.addEventListener('keyup', (event) => {
    game.onKeyUp(event);
  });

  window.addEventListener('beforeunload', () => {
    game.saveProgress(); // Guarda el progreso antes de salir de la página
  });

  game.startIntro();
});
