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

  // Física
  player.dy += gravity;
  player.y += player.dy;

  // Suelo = perder
  if (player.y + player.h > canvas.height) {
    player.y = canvas.height - player.h;
    player.dy = 0;
    gameOver();
  }

  drawPlayer();
  requestAnimationFrame(update);
}

// Reiniciar juego
function restartGame() {
  player.x = 200;
  player.y = 200;
  player.dy = 0;
  isPlaying = true;
  document.getElementById("btnRestart").style.display = "none";
  update();
}

// Fin del juego
function gameOver() {
  isPlaying = false;
  document.getElementById("btnRestart").style.display = "block";
}

// Controles PC: solo espacio
document.addEventListener("keydown", e => {
  if (e.key === " ") {
    if (player.dy === 0) player.dy = jumpForce;
  }
});

// 📱 Control en celular: tocar pantalla = saltar
canvas.addEventListener("touchstart", () => {
  if (player.dy === 0) player.dy = jumpForce;
});

// Botón volver a jugar
document.getElementById("btnRestart").addEventListener("click", restartGame);

// Iniciar juego
update();
