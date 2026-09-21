// Variables del juego
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let player = { x: 200, y: 200, w: 30, h: 30, dx: 0, dy: 0 };
let gravity = 0.5;
let jumpForce = -8;
let isPlaying = true;

// Dibujar jugador
function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

// Actualizar juego
function update() {
  if (!isPlaying) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Física simple
  player.dy += gravity;
  player.y += player.dy;
  player.x += player.dx;

  // Suelo
  if (player.y + player.h > canvas.height) {
    player.y = canvas.height - player.h;
    player.dy = 0;
  }

  drawPlayer();
  requestAnimationFrame(update);
}

// Reiniciar juego
function restartGame() {
  player.x = 200;
  player.y = 200;
  player.dx = 0;
  player.dy = 0;
  isPlaying = true;
  update();
}

// Controles teclado
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") player.dx = -3;
  if (e.key === "ArrowRight") player.dx = 3;
  if (e.key === " " || e.key === "ArrowUp") {
    if (player.dy === 0) player.dy = jumpForce;
  }
  if (e.key === "r" || e.key === "R") restartGame();
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
});

// Botón volver a jugar
document.getElementById("btnRestart").addEventListener("click", restartGame);

// Controles móviles
document.getElementById("btnLeft").addEventListener("touchstart", () => player.dx = -3);
document.getElementById("btnLeft").addEventListener("touchend", () => player.dx = 0);

document.getElementById("btnRight").addEventListener("touchstart", () => player.dx = 3);
document.getElementById("btnRight").addEventListener("touchend", () => player.dx = 0);

document.getElementById("btnJump").addEventListener("click", () => {
  if (player.dy === 0) player.dy = jumpForce;
});

// Iniciar juego
update();
