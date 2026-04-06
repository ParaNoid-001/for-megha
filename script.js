/* ============================================
   MUSIC — BULLETPROOF AUTO-PLAY + RESUME
   ============================================ */
let musicPlaying = false;
let musicStarted = false;
const audio = document.getElementById('bg-music');

if (audio) {
  audio.volume = 0.45;
  audio.loop = true;

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
  if (!audio) return;
  if (musicStarted) {
    // Already started — just make sure it's playing
    if (audio.paused && musicPlaying) audio.play().catch(() => {});
    return;
  }
  audio.volume = 0.45;
  audio.loop = true;
  audio.play().then(() => {
    musicPlaying = true;
    musicStarted = true;
    const btn = document.getElementById('music-btn');
    if (btn) btn.classList.add('playing');
  }).catch(() => {
    // Autoplay blocked — will retry on first user interaction
    musicStarted = false;
  });
}

function toggleMusic() {
  if (!audio) return;
  const btn = document.getElementById('music-btn');
  if (musicPlaying) {
    audio.pause();
    musicPlaying = false;
    if (btn) btn.classList.remove('playing');
  } else {
    audio.volume = 0.45;
    audio.play().then(() => {
      musicPlaying = true;
      musicStarted = true;
      if (btn) btn.classList.add('playing');
    }).catch(() => {});
  }
}

// Try autoplay immediately on load
window.addEventListener('load', () => {
  setTimeout(startMusic, 400);
});

// Retry on first user interaction (browser autoplay policy fallback)
function onFirstInteraction() {
  if (!musicStarted) startMusic();
}
['click', 'touchstart', 'touchend', 'keydown', 'scroll'].forEach(e => {
  document.addEventListener(e, onFirstInteraction, { once: false, passive: true });
});

// Resume when tab becomes visible again
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && musicPlaying && audio && audio.paused) {
    audio.play().catch(() => {});
  }
});

// Heartbeat — check every 2s and resume if music died unexpectedly
setInterval(() => {
  if (musicPlaying && audio && audio.paused && !audio.ended) {
    audio.play().catch(() => {});
  }
}, 2000);

/* ============================================
   FALLING HEARTS
   ============================================ */
const heartChars  = ['♥','♡','❤','💕','💗','💓','🌸','✿','💝','💖','🌷','🎀'];
const heartColors = ['#e8436e','#f4809e','#ffb3cc','#f06090','#ff6fa8','#fce4ec','#e8d5f5','#ffd6e4'];

function spawnHeart() {
  const bg = document.getElementById('hearts-bg');
  if (!bg) return;
  const el = document.createElement('div');
  el.className = 'bg-heart';
  el.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  const sz = 11 + Math.floor(Math.random() * 22);
  el.style.cssText = `left:${Math.random()*96}%;font-size:${sz}px;color:${heartColors[Math.floor(Math.random()*heartColors.length)]};animation-duration:${3.5+Math.random()*5}s;animation-delay:${Math.random()*4}s;`;
  bg.appendChild(el);
  el.addEventListener('animationiteration', () => { el.style.left = Math.random()*96+'%'; });
}
for (let i = 0; i < 30; i++) spawnHeart();

/* ============================================
   FLOATING STICKERS
   ============================================ */
const stickerEmojis = ['🫠','🫣','🌸','🥺','😌','🥰','😭','🫂','💌','🌷','🎀','😘','🤭','🥹','😻','🐼','🐱','💞','✨','🌝'];
function spawnStickers() {
  const layer = document.getElementById('sticker-layer');
  if (!layer) return;
  const positions = [
    {left:'4%',top:'8%'},{left:'88%',top:'12%'},{left:'6%',top:'55%'},
    {left:'85%',top:'58%'},{left:'2%',top:'82%'},{left:'90%',top:'80%'},
    {left:'45%',top:'4%'},{left:'15%',top:'30%'},{left:'78%',top:'35%'},
    {left:'50%',top:'90%'}
  ];
  positions.forEach((pos, i) => {
    const el = document.createElement('div');
    el.className = 'float-sticker';
    el.textContent = stickerEmojis[i % stickerEmojis.length];
    el.style.cssText = `left:${pos.left};top:${pos.top};animation-duration:${3.5+Math.random()*3}s;animation-delay:${Math.random()*3}s;font-size:${22+Math.floor(Math.random()*16)}px;`;
    layer.appendChild(el);
  });
}
spawnStickers();

/* ============================================
   GIF REACTIONS
   ============================================ */
const reactionGifs = [
  'https://media.giphy.com/media/McOXfLCpYA6mAQkKDj/giphy.gif',
  'https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif',
  'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
  'https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif',
  'https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif',
  'https://media.giphy.com/media/l2JehQ2GitHGdVG9a/giphy.gif',
  'https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif',
  'https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif',
];
let gifIndex = 0;

function swapGif() {
  gifIndex = (gifIndex + 1) % reactionGifs.length;
  const img = document.getElementById('reaction-gif');
  if (!img) return;
  img.style.opacity = '0';
  img.style.transform = 'scale(0.65) rotate(-8deg)';
  setTimeout(() => {
    img.src = reactionGifs[gifIndex];
    img.style.opacity = '1';
    img.style.transform = '';
  }, 200);
}
window.addEventListener('DOMContentLoaded', () => {
  const img = document.getElementById('reaction-gif');
  if (img) img.style.transition = 'opacity 0.22s, transform 0.22s';
});

/* ============================================
   ENVELOPE
   ============================================ */
function openEnvelope() {
  startMusic();
  document.getElementById('envelope').classList.add('opening');
  setTimeout(() => {
    document.getElementById('step-envelope').classList.add('hidden');
    document.getElementById('step-letter').classList.remove('hidden');
    burst(50, 45);
  }, 580);
}

function goBack() {
  document.getElementById('step-letter').classList.add('hidden');
  document.getElementById('step-envelope').classList.remove('hidden');
  document.getElementById('envelope').classList.remove('opening');
  noCount = 0; yesScale = 1; noScale = 1; gifIndex = 0;
  applyScales();
  const img = document.getElementById('reaction-gif');
  if (img) img.src = reactionGifs[0];
  const btn = document.getElementById('btn-no');
  if (btn) { btn.classList.remove('runaway'); btn.style.position=''; btn.style.left=''; btn.style.top=''; }
  if (activeToast) { activeToast.remove(); activeToast = null; }
}

/* ============================================
   BUTTON SCALING
   ============================================ */
let yesScale = 1, noScale = 1;
const YES_GROW = 0.16, NO_SHRINK = 0.11, NO_MIN = 0.3;

function applyScales() {
  const btnYes = document.getElementById('btn-yes');
  const btnNo  = document.getElementById('btn-no');
  if (btnYes) {
    btnYes.style.transform = `scale(${yesScale})`;
    btnYes.style.boxShadow = `0 ${6*yesScale}px ${20*yesScale}px rgba(232,67,110,${0.25+yesScale*0.1})`;
  }
  if (btnNo) {
    btnNo.style.fontSize = `${Math.max(7, 14*noScale)}px`;
    btnNo.style.padding  = `${Math.max(3, 11*noScale)}px ${Math.max(5, 20*noScale)}px`;
    btnNo.style.opacity  = `${Math.max(0.25, noScale)}`;
  }
}

/* ============================================
   NO BUTTON MESSAGES
   ============================================ */
const noMessages = [
  "arre, mouse ta sorate parchho na? 😏😏",
  "button ta paliye jacche keno bbu? 🏃💨",
  "eta ki na bolte parbe amake? 🥺🥺",
  "try korte thako, amio wait korbo 😌",
  "tomar haath slow, amar button faster 🤣",
  "na bolar kono scope nei! 😤😤",
  "pookie tumi sotti erm korte parbe toh? 🥺🥺",
  "\"tomar sathe kotha bolbona toh kar sathe bolbo\" 🫠",
  "are you still sureeeee? 🥺🥺",
  "safe place bhule gele? 🫂",
  "jheel paar er kotha bhule gele? 🥹",
  "escalator er chumu bhule gele? 😭😭",
  "last chance to say no!! 😤😤",
  "FINAL last chance!! 😤😤",
  "this is the FINAL FINAL last chance!! 😤😤",
  "okay tumi jito.. ami hariyechi 😔💔 ...just kidding CLICK YES 😭",
];
let noCount = 0;

function runAway(btn) {
  startMusic();
  yesScale = Math.min(yesScale + YES_GROW, 2.6);
  noScale  = Math.max(noScale  - NO_SHRINK, NO_MIN);
  applyScales();
  swapGif();

  btn.classList.add('runaway');
  const pad = 68;
  const maxX = window.innerWidth  - pad - 110;
  const maxY = window.innerHeight - pad - 52;
  btn.style.left = (pad + Math.random()*maxX) + 'px';
  btn.style.top  = (pad + Math.random()*maxY) + 'px';

  if (noCount < noMessages.length) {
    showToast(noMessages[noCount++]);
  } else {
    showToast("bas koro!! 🥺 amar heart break hochhe!");
    noCount = 0;
  }
}

function noClick() {
  showToast("hahaha nice try 😂 na bola cholbe na!");
  swapGif();
}

/* ============================================
   EMAILJS CONFIG — replace these 3 values!
   Step 1: sign up free at emailjs.com
   Step 2: Add Service → Gmail → copy Service ID
   Step 3: Create Template → copy Template ID
   Step 4: Account tab → copy Public Key
   ============================================ */
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

function sendNotificationEmail() {
  const now  = new Date();
  const date = now.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
  const time = now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_name:  'Swarnadip',
      from_name:'Megha 🌸🌸',
      reply:    'i love you too 🥰',
      date:     date,
      time:     time,
      message:  `Megha clicked "i love you too" at ${time} on ${date}!! ebr hami dao 🫠💌`,
    }).then(() => {
      console.log('💌 mail sent!');
    }).catch(err => console.error('mail failed:', err));
  };
  document.head.appendChild(script);
}

/* ============================================
   YES
   ============================================ */
function sayYes() {
  burst(50, 42);
  sendNotificationEmail();
  setTimeout(() => { window.location.href = 'yes.html'; }, 700);
}

/* ============================================
   CONFETTI BURST
   ============================================ */
function burst(pxPct, pyPct) {
  const cols = ['#e8436e','#f4809e','#ffb3cc','#ffd6e4','#c0305a','#ffffff','#e8d5f5','#fff8d0'];
  if (!document.getElementById('cf-kf')) {
    const s = document.createElement('style'); s.id='cf-kf';
    s.textContent = `@keyframes cf-fall{0%{opacity:1;transform:translateY(0) rotate(0deg) scale(1)}100%{opacity:0;transform:translateY(200px) rotate(720deg) scale(0.4)}}`;
    document.head.appendChild(s);
  }
  for (let i = 0; i < 38; i++) {
    const p = document.createElement('div');
    const sz = 5 + Math.random()*9;
    p.style.cssText = `position:fixed;left:${pxPct+(Math.random()*18-9)}%;top:${pyPct+(Math.random()*18-9)}%;width:${sz}px;height:${sz}px;background:${cols[Math.floor(Math.random()*cols.length)]};border-radius:${Math.random()>.5?'50%':'3px'};pointer-events:none;z-index:9998;animation:cf-fall ${0.9+Math.random()*0.9}s ease-out forwards;animation-delay:${Math.random()*0.45}s;`;
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

/* ============================================
   TOAST — stays until next NO click
   ============================================ */
let activeToast = null;

function showToast(msg) {
  const area = document.getElementById('toast-area');
  if (!area) return;
  if (activeToast) { activeToast.remove(); activeToast = null; }
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  area.appendChild(t);
  activeToast = t;
}
