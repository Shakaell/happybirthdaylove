/* ==========================================
   PINK GLOWING ROSE GARDEN (VERSI RINGAN)
   A Birthday Gift for Sayang ♡
========================================== */

const canvas = document.getElementById("flowerCanvas");
let ctx = canvas ? canvas.getContext("2d") : null;

const IS_MOBILE = window.innerWidth < 700;
const FRAME_GAP = IS_MOBILE ? 33 : 16; // ~30fps di HP, ~60fps di desktop

let W = 0, H = 0;
let animationFrame = null;
let startTime = null;
let lastFrame = 0;
let progress = 0;
let particles = [];
let running = true;

const roses = [
  { x: .12, size: .62, height: .62, delay: 0 },
  { x: .25, size: .82, height: .75, delay: .8 },
  { x: .40, size: .58, height: .58, delay: 1.5 },
  { x: .53, size: 1.05, height: .76, delay: .2 },
  { x: .68, size: .72, height: .68, delay: 1.2 },
  { x: .83, size: .9, height: .75, delay: .5 },
  { x: .96, size: .53, height: .55, delay: 2 }
];

function smooth(t) {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
}

function resizeCanvas() {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1.5 : 2);
  W = rect.width;
  H = rect.height;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* ---------- SPRITES (digambar sekali, dipakai ulang) ---------- */

function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

// Sprite cahaya partikel
const glowSprite = makeCanvas(32, 32);
(function () {
  const g = glowSprite.getContext("2d");
  const grd = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grd.addColorStop(0, "rgba(255,213,240,1)");
  grd.addColorStop(.4, "rgba(255,155,215,.5)");
  grd.addColorStop(1, "rgba(255,155,215,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 32, 32);
})();

/* ---------- DRAW FUNCTIONS ---------- */

function drawRoseLeaf(x, y, angle, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  ctx.shadowColor = "#48ff9a";
  ctx.shadowBlur = 18;

  const gradient = ctx.createLinearGradient(0, 0, 65, -20);
  gradient.addColorStop(0, "#176b42");
  gradient.addColorStop(.5, "#39e982");
  gradient.addColorStop(1, "#a4ffc2");

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(18, -35, 62, -36, 75, -5);
  ctx.bezierCurveTo(55, 20, 20, 15, 0, 0);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#b0ffcc";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(35, -8, 75, -5);
  ctx.stroke();

  ctx.restore();
}

function drawRosePetal(angle, length, width, color1, color2) {
  ctx.save();
  ctx.rotate(angle);

  ctx.shadowColor = color1;
  ctx.shadowBlur = 15;

  const gradient = ctx.createLinearGradient(0, -length, 0, 10);
  gradient.addColorStop(0, color2);
  gradient.addColorStop(.35, color1);
  gradient.addColorStop(1, "#7f174e");

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-width * 1.1, -length * .35, -width, -length * .85, 0, -length);
  ctx.bezierCurveTo(width, -length * .85, width * 1.1, -length * .35, 0, 0);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = "rgba(255,190,230,.7)";
  ctx.lineWidth = .7;
  ctx.stroke();

  ctx.restore();
}

function drawRoseHead(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  for (let i = 0; i < 12; i++) {
    drawRosePetal(i * Math.PI * 2 / 12, 48, 25, "#f34c9c", "#ffacd9");
  }
  for (let i = 0; i < 10; i++) {
    drawRosePetal(i * Math.PI * 2 / 10 + .2, 37, 20, "#ed348a", "#ff91c6");
  }
  for (let i = 0; i < 8; i++) {
    drawRosePetal(i * Math.PI * 2 / 8 + .4, 25, 14, "#c91f70", "#ffb5dd");
  }

  // Spiral tengah
  ctx.save();
  ctx.shadowColor = "#ff9edb";
  ctx.shadowBlur = 20;
  ctx.beginPath();
  for (let i = 0; i <= 120; i++) {
    const a = i * .12;
    const r = 1 + i * .075;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = "#ffe3f4";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Pusat bercahaya
  const center = ctx.createRadialGradient(0, 0, 1, 0, 0, 15);
  center.addColorStop(0, "#ffffff");
  center.addColorStop(.4, "#ffc5e8");
  center.addColorStop(1, "rgba(255,90,180,0)");
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* Bangun sprite mawar & daun SEKALI (shadowBlur berat hanya dipakai di sini) */
const ROSE_SPRITE_SIZE = 240; // mewakili area 200x200 unit
const roseSprite = makeCanvas(ROSE_SPRITE_SIZE, ROSE_SPRITE_SIZE);
const LEAF_W = 140, LEAF_H = 110, LEAF_OX = 30, LEAF_OY = 60;
const leafSprite = makeCanvas(LEAF_W, LEAF_H);

function buildSprites() {
  if (!ctx) return;
  const real = ctx;

  ctx = roseSprite.getContext("2d");
  ctx.clearRect(0, 0, ROSE_SPRITE_SIZE, ROSE_SPRITE_SIZE);
  drawRoseHead(ROSE_SPRITE_SIZE / 2, ROSE_SPRITE_SIZE / 2, ROSE_SPRITE_SIZE / 200);

  ctx = leafSprite.getContext("2d");
  ctx.clearRect(0, 0, LEAF_W, LEAF_H);
  drawRoseLeaf(LEAF_OX, LEAF_OY, 0, 1);

  ctx = real;
}

function drawLeafSprite(x, y, angle, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.drawImage(leafSprite, -LEAF_OX, -LEAF_OY);
  ctx.restore();
}

/* ---------- PARTICLES ---------- */

function createParticle() {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    size: Math.random() * 2 + .5,
    speed: Math.random() * .45 + .1,
    alpha: Math.random() * Math.PI * 2
  };
}

function initializeParticles() {
  particles = [];
  const count = IS_MOBILE ? 35 : 100;
  for (let i = 0; i < count; i++) particles.push(createParticle());
}

function drawParticles(time) {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.y -= p.speed;
    if (p.y < 0) {
      p.y = H;
      p.x = Math.random() * W;
    }
    ctx.globalAlpha = .3 + Math.abs(Math.sin(time * .001 + p.alpha)) * .7;
    const s = p.size * 6;
    ctx.drawImage(glowSprite, p.x - s / 2, p.y - s / 2, s, s);
  }
  ctx.globalAlpha = 1;
}

/* ---------- ROSE ---------- */

function drawRose(rose, time, globalProgress) {
  const x = W * rose.x;
  const bottom = H * .89;

  const localProgress = smooth((globalProgress * 1.35 - rose.delay * .08) / .95);
  if (localProgress <= 0) return;

  const stemHeight = H * rose.height * localProgress;
  const flowerY = bottom - stemHeight;
  const size = rose.size * Math.min(W / 450, 1.15);
  const sway = Math.sin(time * .001 + rose.x * 10) * 4;

  ctx.save();
  ctx.translate(x, 0);

  // Batang (glow palsu: garis tebal transparan + garis tipis)
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, bottom);
  ctx.bezierCurveTo(
    sway - 12, bottom - stemHeight * .35,
    sway + 12, bottom - stemHeight * .75,
    sway, flowerY
  );
  ctx.strokeStyle = "rgba(56,245,160,.25)";
  ctx.lineWidth = 9;
  ctx.stroke();
  ctx.strokeStyle = "#38f5a0";
  ctx.lineWidth = 3.5;
  ctx.stroke();
  ctx.strokeStyle = "#bdffdb";
  ctx.lineWidth = 1.1;
  ctx.stroke();

  // Daun
  if (localProgress > .3) {
    ctx.globalAlpha = smooth((localProgress - .3) / .4);
    drawLeafSprite(sway, bottom - stemHeight * .34, -2.8, .58 * size);
    drawLeafSprite(sway, bottom - stemHeight * .53, .35, .55 * size);
    drawLeafSprite(sway, bottom - stemHeight * .72, -2.9, .42 * size);
    ctx.globalAlpha = 1;
  }

  // Bunga mekar
  if (localProgress > .7) {
    const bloom = smooth((localProgress - .7) / .3);
    const pulse = 1 + Math.sin(time * .002) * .025;
    const s = 200 * size * bloom * pulse;

    ctx.globalAlpha = bloom;
    ctx.drawImage(roseSprite, sway - s / 2, flowerY - s / 2, s, s);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawGround() {
  const gradient = ctx.createRadialGradient(W / 2, H * .9, 2, W / 2, H * .9, W * .65);
  gradient.addColorStop(0, "rgba(65,255,166,.17)");
  gradient.addColorStop(1, "rgba(65,255,166,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, H * .65, W, H * .35);
}

/* ---------- MAIN LOOP ---------- */

function animate(time) {
  if (!running) {
    animationFrame = null;
    return;
  }

  animationFrame = requestAnimationFrame(animate);

  if (time - lastFrame < FRAME_GAP) return;
  lastFrame = time;

  if (startTime === null) startTime = time;
  progress = Math.min((time - startTime) / 11000, 1);

  ctx.clearRect(0, 0, W, H);
  drawGround();
  drawParticles(time);

  for (let i = 0; i < roses.length; i++) {
    drawRose(roses[i], time, progress);
  }
}

function startLoop() {
  if (!ctx || animationFrame) return;
  running = true;
  animationFrame = requestAnimationFrame(animate);
}

function stopLoop() {
  running = false;
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
}

function restartFlower() {
  stopLoop();
  startTime = null;
  progress = 0;
  initializeParticles();

  const message = document.getElementById("gardenMessage");
  if (message) {
    message.textContent = "Every rose blooms beautifully for you, Sayang ♡";
  }
  startLoop();
}

if (canvas && ctx) {
  resizeCanvas();
  buildSprites();
  initializeParticles();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      initializeParticles();
    }, 200);
  });

  // Jalankan animasi hanya saat canvas terlihat
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      entries[0].isIntersecting ? startLoop() : stopLoop();
    }, { threshold: 0.05 }).observe(canvas);
  } else {
    startLoop();
  }

  // Hentikan saat tab/aplikasi tidak aktif
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stopLoop() : startLoop();
  });

  canvas.addEventListener("click", restartFlower);
}

/* ---------- FALLING PETALS ---------- */

const petals = document.getElementById("petals");
const MAX_PETALS = IS_MOBILE ? 8 : 20;

function createPetal() {
  if (!petals || document.hidden) return;
  if (petals.childElementCount >= MAX_PETALS) return;

  const p = document.createElement("span");
  p.className = "petal";
  p.textContent = ["🌸", "🌷", "✿", "♡"][Math.floor(Math.random() * 4)];
  p.style.left = Math.random() * 100 + "vw";
  p.style.fontSize = (12 + Math.random() * 18) + "px";
  p.style.animationDuration = (6 + Math.random() * 7) + "s";

  petals.appendChild(p);
  setTimeout(() => p.remove(), 14000);
}

setInterval(createPetal, IS_MOBILE ? 1400 : 700);

/* ---------- NAVIGATION ---------- */

function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ---------- HEART SHOWER ---------- */

function hearts(amount) {
  const heartTypes = ["💗", "💕", "💖", "💘", "💓"];
  const total = IS_MOBILE ? Math.ceil(amount / 2) : amount;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < total; i++) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = heartTypes[Math.floor(Math.random() * heartTypes.length)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.top = (45 + Math.random() * 45) + "vh";
    heart.style.fontSize = (18 + Math.random() * 25) + "px";
    heart.style.animationDuration = (1.5 + Math.random() * 2) + "s";
    frag.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }
  document.body.appendChild(frag);
}

/* ---------- FLOWER RAIN ---------- */

function flowerRain() {
  hearts(20);
  restartFlower();
}

/* ---------- LOVE LETTER ---------- */

function openLetter() {
  const envelope = document.getElementById("envelope");
  const letter = document.getElementById("letterContent");
  if (!envelope || !letter) return;

  envelope.classList.toggle("open");

  const isOpen = letter.style.display === "block";
  letter.style.display = isOpen ? "none" : "block";

  if (!isOpen) {
    hearts(10);
    setTimeout(() => {
      letter.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  }
}

/* ---------- OPEN GIFT + ROSE REVEAL ---------- */

let giftOpened = false;

function openGift() {
  if (giftOpened) return;

  const gift = document.getElementById("gift");
  const message = document.getElementById("surpriseMessage");
  const rose = document.getElementById("roseContainer");

  if (!gift || !message || !rose) {
    console.error("Elemen hadiah atau mawar tidak ditemukan!");
    return;
  }

  giftOpened = true;

  gift.style.pointerEvents = "none";
  gift.style.transform = "scale(0) rotate(360deg)";
  gift.style.opacity = "0";

  hearts(70);
  setTimeout(() => hearts(50), 600);
  setTimeout(() => hearts(35), 1200);

  setTimeout(() => {
    message.style.display = "block";
    message.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => rose.classList.add("show"), 500);
  }, 1700);
}

/* ---------- MUSIC PLAYER ---------- */

const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

async function toggleMusic() {
  if (!music || !musicBtn) {
    console.error("Elemen musik tidak ditemukan!");
    return;
  }

  if (music.paused) {
    try {
      await music.play();
      musicBtn.textContent = "♫";
      musicBtn.classList.add("playing");
    } catch (error) {
      console.error("Musik gagal diputar:", error);
      alert("Musik belum bisa diputar. Periksa lokasi file MP3.");
    }
  } else {
    music.pause();
    musicBtn.textContent = "▶";
    musicBtn.classList.remove("playing");
  }
}
