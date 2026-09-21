const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width=800; canvas.height=400;

let player={x:100,y:320,w:30,h:30,vy:0,onGround:true,crouching:false};
let gravity=0.6, jumpForce=-12;
let obstacles=[], coins=[], speed=5, dist=0, count=0, coinsGot=0;
let gameOver=false, win=false;

function createLevel(){
  for(let i=1;i<=100;i++){
    let x = 500 + i*350;
    let type = Math.random();
    if(type<0.4) obstacles.push({x,y:320,w:30,h:50,type:'spike'});
    else if(type<0.7) obstacles.push({x,y:300,w:40,h:70,type:'block'});
    else obstacles.push({x,y:280,w:60,h:25,type:'fly'});
    if(i==30 || i==65 || i==90){
      coins.push({x:x+80,y:260,w:20,h:20,taken:false});
    }
  }
}
createLevel();

function jump(){ if(player.onGround&&!player.crouching&&!gameOver&&!win){player.vy=jumpForce;player.onGround=false;} }
function setCrouch(v){ if(!gameOver&&!win){player.crouching=v; if(v){player.h=15; player.y=335;}else{player.h=30; if(player.y>320) player.y=320;}}}

window.addEventListener('keydown',e=>{
  if(e.code==='Space') jump();
  if(e.code==='KeyS'||e.code==='ArrowDown') setCrouch(true);
});
window.addEventListener('keyup',e=>{
  if(e.code==='KeyS'||e.code==='ArrowDown') setCrouch(false);
});

let touchTimer;
canvas.addEventListener('touchstart',e=>{
  e.preventDefault();
  touchTimer=setTimeout(()=>setCrouch(true),150);
},{passive:false});
canvas.addEventListener('touchend',e=>{
  e.preventDefault();
  clearTimeout(touchTimer);
  if(player.crouching) setCrouch(false);
  else jump();
},{passive:false});
canvas.addEventListener('mousedown',jump);

function genCode(){
  let r=Math.random().toString(36).substring(2,6).toUpperCase();
  return coinsGot===3 ? `KARGO15-${r}` : `KARGO10-${r}`;
}

function update(){
  if(gameOver||win) return;
  player.vy+=gravity; player.y+=player.vy;
  if(player.y>= (player.crouching?335:320)){player.y=player.crouching?335:320; player.vy=0; player.onGround=true;}
  obstacles.forEach(o=>o.x-=speed);
  coins.forEach(c=>c.x-=speed);
  obstacles.forEach(o=>{
    if(player.x < o.x+o.w && player.x+player.w > o.x && player.y+player.h > o.y){
      if(o.type==='fly' && player.crouching) return;
      if(o.type!=='fly'){ gameOver=true; document.getElementById('loseScreen').classList.remove('hidden');}
      if(o.type==='fly' && !player.crouching){ gameOver=true; document.getElementById('loseScreen').classList.remove('hidden');}
    }
    if(o.x+o.w<0 && !o.counted){o.counted=true; count++; if(count%25==0) speed+=0.8;}
  });
  coins.forEach(c=>{
    if(!c.taken && player.x < c.x+c.w && player.x+player.w > c.x && player.y < c.y+c.h && player.y+player.h > c.y){
      c.taken=true; coinsGot++;
    }
  });
  document.getElementById('score').innerText=count+" / 100";
  document.getElementById('coins').innerText=`💰 ${coinsGot} / 3`;
  if(count>=100){
    win=true;
    let code=genCode();
    let discount = coinsGot===3 ? "¡Conseguiste las 3 monedas! 15% de descuento" : "¡Ganaste 10% de descuento!";
    document.getElementById('discountText').innerText=discount;
    document.getElementById('couponCode').innerText=code;
    document.getElementById('waBtn').href=`https://wa.me/51967414343?text=Hola%20Kargo%2C%20llegue%20a%20la%20meta%20mi%20codigo%20es%20${code}%20y%20consegui%20${coinsGot}%2F3%20monedas`;
    document.getElementById('winScreen').classList.remove('hidden');
    document.getElementById('copyBtn').onclick=()=>{navigator.clipboard.writeText(code); alert("Código copiado: "+code);};
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#ffffff22"; ctx.fillRect(0,350,canvas.width,2);
  ctx.fillStyle=player.crouching?"#ffff00":"#00ffff";
  ctx.shadowColor=ctx.fillStyle; ctx.shadowBlur=12;
  ctx.fillRect(player.x,player.y,player.w,player.h);
  ctx.shadowBlur=0;
  obstacles.forEach(o=>{
    if(o.x>-100&&o.x<810){
      ctx.fillStyle=o.type==='fly'?"#ffcc00":"#ff0044";
      ctx.fillRect(o.x,o.y,o.w,o.h);
    }
  });
  coins.forEach(c=>{
    if(!c.taken&&c.x>-100&&c.x<810){
      ctx.fillStyle="#ffcc00"; ctx.beginPath(); ctx.arc(c.x+10,c.y+10,10,0,Math.PI*2); ctx.fill();
    }
  });
}
(function loop(){update(); draw(); requestAnimationFrame(loop);})();
