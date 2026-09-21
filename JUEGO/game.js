const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let score = 0;
let gameOver = false;
let player = { x: 80, y: 250, w: 30, h: 30, vy: 0, jumping: false };
let gravity = 0.7;
let obstacles = [];
let frame = 0;

function getDiscount(){ 
  // 1000 puntos = 10% máximo
  let d = Math.min(10, (score / 1000) * 10);
  return d.toFixed(1);
}

function update(){
  if(gameOver) return;
  frame++;
  if(frame % 85 === 0){
    obstacles.push({ x: 600, y: 260, w: 25, h: 40 });
  }
  
  player.y += player.vy;
  player.vy += gravity;
  if(player.y >= 250){ 
    player.y = 250; 
    player.vy = 0; 
    player.jumping = false; 
  }

  obstacles.forEach(o => o.x -= 6);
  obstacles = obstacles.filter(o => o.x > -30);

  obstacles.forEach(o => {
    if(player.x < o.x + o.w && player.x + player.w > o.x && player.y < o.y + o.h && player.y + player.h > o.y){
      gameOver = true;
      showWinModal();
    }
  });

  if(frame % 5 === 0) score++;
  
  let discount = getDiscount();
  document.getElementById('score').textContent = score;
  document.getElementById('discount').textContent = discount + '% DESCUENTO';
  document.getElementById('bar').style.width = (discount * 10) + '%';
  document.getElementById('bar-text').textContent = discount + '% / 10% máximo';
}

function draw(){
  ctx.clearRect(0,0,600,350);
  ctx.fillStyle = '#2d3436';
  ctx.fillRect(0,290,600,60);
  
  ctx.fillStyle = '#00cec9';
  ctx.shadowColor = '#00cec9';
  ctx.shadowBlur = 12;
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ff7675';
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.w, o.h);
  });

  if(gameOver){
    ctx.fillStyle = 'rgba(15,15,20,0.6)';
    ctx.fillRect(0,0,600,350);
  }
}

function showWinModal(){
  const discount = getDiscount();
  const modal = document.getElementById('win-modal');
  const text = document.getElementById('final-text');
  const waLink = document.getElementById('wa-link');
  
  text.innerHTML = `¡Conseguiste <b>${discount}% OFF</b>!<br>Tu código es: <b>KARGO${Math.round(discount*10)}</b>`;
  
  // TU NÚMERO YA AGREGADO
  const tuNumero = "51967414343"; 
  const mensaje = `Hola Kargo! 🎮 Jugué KARGO RUN y gané ${discount}% de descuento. Mi código es KARGO${Math.round(discount*10)}. Quiero canjearlo por un producto!`;
  waLink.href = `https://wa.me/${tuNumero}?text=${encodeURIComponent(mensaje)}`;
  
  modal.classList.remove('hidden');
}

function loop(){ 
  update(); 
  draw(); 
  requestAnimationFrame(loop); 
}

window.addEventListener('keydown', e => {
  if(e.code === 'Space' && !player.jumping && !gameOver){
    player.vy = -14;
    player.jumping = true;
  }
  if(e.code === 'KeyR' && gameOver){
    obstacles = []; 
    score = 0; 
    gameOver = false; 
    player.y = 250;
    document.getElementById('win-modal').classList.add('hidden');
  }
});

loop();