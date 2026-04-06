/* ============================================
   MUSIC — BULLETPROOF ON YES PAGE
   ============================================ */
let musicPlaying = false;
let musicStarted = false;
const audio = document.getElementById('bg-music');

if (audio) {
  audio.addEventListener('pause', () => {
    if (musicPlaying) setTimeout(() => audio.play().catch(() => {}), 300);
  });
  audio.addEventListener('ended', () => {
    if (musicPlaying) { audio.currentTime = 0; audio.play().catch(() => {}); }
  });
  audio.addEventListener('stalled', () => {
    if (musicPlaying) { audio.load(); audio.play().catch(() => {}); }
  });
}

function startMusic() {
  if (!audio || musicStarted) return;
  audio.volume = 0.45; audio.loop = true;
  audio.play().then(() => {
    musicPlaying = true; musicStarted = true;
    const btn = document.getElementById('music-btn');
    if (btn) btn.classList.add('playing');
  }).catch(() => {});
}

function toggleMusic() {
  if (!audio) return;
  const btn = document.getElementById('music-btn');
  if (musicPlaying) {
    audio.pause(); musicPlaying = false;
    if (btn) btn.classList.remove('playing');
  } else {
    audio.volume = 0.45;
    audio.play().then(() => {
      musicPlaying = true; musicStarted = true;
      if (btn) btn.classList.add('playing');
    }).catch(() => {});
  }
}

window.addEventListener('load', () => setTimeout(startMusic, 300));
['click','touchstart','keydown'].forEach(e => {
  document.addEventListener(e, startMusic, { once: true });
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && musicPlaying && audio && audio.paused) {
    audio.play().catch(() => {});
  }
});

/* ============================================
   FALLING HEARTS (more dense on yes page)
   ============================================ */
const heartChars  = ['♥','♡','❤','💕','💗','💓','🌸','✿','💝','💖','🌷','🎀','🎊','🎉'];
const heartColors = ['#e8436e','#f4809e','#ffb3cc','#f06090','#ff6fa8','#fce4ec','#e8d5f5','#ffe0f0'];

function spawnHeart() {
  const bg = document.getElementById('hearts-bg');
  if (!bg) return;
  const el = document.createElement('div');
  el.className = 'bg-heart';
  el.textContent = heartChars[Math.floor(Math.random()*heartChars.length)];
  const sz = 14 + Math.floor(Math.random()*26);
  el.style.cssText = `left:${Math.random()*96}%;font-size:${sz}px;color:${heartColors[Math.floor(Math.random()*heartColors.length)]};animation-duration:${2.5+Math.random()*4}s;animation-delay:${Math.random()*2}s;`;
  bg.appendChild(el);
  el.addEventListener('animationiteration', () => { el.style.left = Math.random()*96+'%'; });
}
for (let i = 0; i < 44; i++) spawnHeart();

/* ============================================
   FLOATING STICKERS
   ============================================ */
const stickerEmojis = ['🫠','🫣','🌸','🥺','😌','🥰','😭','🫂','💌','🌷','🎀','😘','🤭','🥹','😻','🐼','🐱','💞','✨','🎊'];
function spawnStickers() {
  const layer = document.getElementById('sticker-layer');
  if (!layer) return;
  const positions = [
    {left:'3%',top:'6%'},{left:'87%',top:'10%'},{left:'5%',top:'50%'},
    {left:'88%',top:'55%'},{left:'2%',top:'78%'},{left:'89%',top:'78%'},
    {left:'44%',top:'3%'},{left:'14%',top:'25%'},{left:'79%',top:'30%'},
    {left:'50%',top:'88%'},{left:'22%',top:'70%'},{left:'70%',top:'72%'}
  ];
  positions.forEach((pos, i) => {
    const el = document.createElement('div');
    el.className = 'float-sticker';
    el.textContent = stickerEmojis[i % stickerEmojis.length];
    el.style.cssText = `left:${pos.left};top:${pos.top};animation-duration:${3+Math.random()*3}s;animation-delay:${Math.random()*3}s;font-size:${22+Math.floor(Math.random()*18)}px;`;
    layer.appendChild(el);
  });
}
spawnStickers();

/* ============================================
   CANVAS CONFETTI — 3 WAVES
   ============================================ */
const canvas = document.getElementById('confetti-canvas');
const ctx    = canvas.getContext('2d');
let pieces   = [];
let running  = true;

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const confCols = ['#e8436e','#f4809e','#ffb3cc','#ffd6e4','#c0305a','#ffffff','#e8d5f5','#fff8d0','#ffb3d5'];

function makePiece(x, y) {
  return {
    x, y,
    vx: (Math.random()-0.5)*15,
    vy: -(Math.random()*19+5),
    gravity: 0.44,
    rot: Math.random()*360,
    rotV: (Math.random()-0.5)*10,
    w: 6 + Math.random()*10,
    h: 5 + Math.random()*9,
    color: confCols[Math.floor(Math.random()*confCols.length)],
    alpha: 1,
    circle: Math.random()>0.55,
  };
}

function bigBang() {
  const cx = window.innerWidth/2;
  const cy = window.innerHeight*0.4;
  for (let i = 0; i < 180; i++) {
    pieces.push(makePiece(cx+(Math.random()-0.5)*130, cy+(Math.random()-0.5)*80));
  }
}

bigBang();
setTimeout(bigBang, 700);
setTimeout(bigBang, 1500);
setTimeout(() => { running = false; }, 8000);

function drawFrame() {
  if (!running && pieces.length===0) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces = pieces.filter(p => p.alpha > 0.02);
  for (const p of pieces) {
    p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.rot += p.rotV;
    if (p.y > canvas.height * 0.68) p.alpha -= 0.02;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * Math.PI / 180);
    ctx.fillStyle = p.color;
    if (p.circle) { ctx.beginPath(); ctx.arc(0,0,p.w/2,0,Math.PI*2); ctx.fill(); }
    else { ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); }
    ctx.restore();
  }
  requestAnimationFrame(drawFrame);
}
drawFrame();
