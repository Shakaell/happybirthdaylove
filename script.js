/* ==========================================
   PINK GLOWING ROSE GARDEN
   A Birthday Gift for Sayang ♡
========================================== */

const canvas = document.getElementById("flowerCanvas");
const ctx = canvas.getContext("2d");

let W, H;
let animationFrame;
let startTime = null;
let progress = 0;
let particles = [];

const ROSE_COUNT = 7;

// Posisi dan ukuran masing-masing mawar
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
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  W = rect.width;
  H = rect.height;

  canvas.width = W * dpr;
  canvas.height = H * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* PARTICLES */
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

  for (let i = 0; i < 110; i++) {
    particles.push(createParticle());
  }
}

initializeParticles();

function drawParticles(time) {
  particles.forEach(p => {
    p.y -= p.speed;

    if (p.y < 0) {
      p.y = H;
      p.x = Math.random() * W;
    }

    const glow = .3 + Math.abs(Math.sin(time * .001 + p.alpha)) * .7;

    ctx.save();
    ctx.globalAlpha = glow;
    ctx.fillStyle = "#ffd5f0";
    ctx.shadowColor = "#ff9bd7";
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });
}

/* GLOWING STROKE */
function glowStroke(color, width, blur) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
}

/* DRAW LEAF */
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

  ctx.bezierCurveTo(
    18, -35,
    62, -36,
    75, -5
  );

  ctx.bezierCurveTo(
    55, 20,
    20, 15,
    0, 0
  );

  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = "#b0ffcc";
  ctx.lineWidth = 1.1;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(35, -8, 75, -5);
  ctx.stroke();

  ctx.restore();
}

/* ROSE PETAL */
function drawRosePetal(angle, length, width, color1, color2) {
  ctx.save();

  ctx.rotate(angle);

  ctx.shadowColor = color1;
  ctx.shadowBlur = 15;

  const gradient = ctx.createLinearGradient(
    0, -length,
    0, 10
  );

  gradient.addColorStop(0, color2);
  gradient.addColorStop(.35, color1);
  gradient.addColorStop(1, "#7f174e");

  ctx.beginPath();

  ctx.moveTo(0, 0);

  ctx.bezierCurveTo(
    -width * 1.1, -length * .35,
    -width, -length * .85,
    0, -length
  );

  ctx.bezierCurveTo(
    width, -length * .85,
    width * 1.1, -length * .35,
    0, 0
  );

  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = "rgba(255,190,230,.7)";
  ctx.lineWidth = .7;
  ctx.stroke();

  ctx.restore();
}

/* DRAW A REALISTIC STYLIZED ROSE */
function drawRoseHead(x, y, scale, time) {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const pulse = 1 + Math.sin(time * .002) * .025;
  ctx.scale(pulse, pulse);

  // Outer petals
  for (let i = 0; i < 12; i++) {
    drawRosePetal(
      i * Math.PI * 2 / 12,
      48,
      25,
      "#f34c9c",
      "#ffacd9"
    );
  }

  // Middle petals
  for (let i = 0; i < 10; i++) {
    drawRosePetal(
      i * Math.PI * 2 / 10 + .2,
      37,
      20,
      "#ed348a",
      "#ff91c6"
    );
  }

  // Inner petals
  for (let i = 0; i < 8; i++) {
    drawRosePetal(
      i * Math.PI * 2 / 8 + .4,
      25,
      14,
      "#c91f70",
      "#ffb5dd"
    );
  }

  // Rose spiral center
  ctx.save();

  ctx.shadowColor = "#ff9edb";
  ctx.shadowBlur = 20;

  ctx.beginPath();

  for (let i = 0; i <= 120; i++) {
    const angle = i * .12;
    const radius = 1 + i * .075;

    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.strokeStyle = "#ffe3f4";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();

  // Glowing flower center
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

/* DRAW ONE COMPLETE ROSE */
function drawRose(rose, time, globalProgress) {
  const x = W * rose.x;
  const bottom = H * .89;

  const localProgress = smooth(
    (globalProgress * 1.35 - rose.delay * .08) / .95
  );

  if (localProgress <= 0) return;

  const stemHeight = H * rose.height * localProgress;
  const flowerY = bottom - stemHeight;

  const size = rose.size * Math.min(W / 450, 1.15);

  // Gentle movement
  const sway = Math.sin(time * .001 + rose.x * 10) * 4;

  ctx.save();

  ctx.translate(x, 0);

  // Stem
  ctx.beginPath();
  ctx.moveTo(0, bottom);

  ctx.bezierCurveTo(
    sway - 12,
    bottom - stemHeight * .35,
    sway + 12,
    bottom - stemHeight * .75,
    sway,
    flowerY
  );

  ctx.save();

  glowStroke("#38f5a0", 4, 18);
  ctx.stroke();

  glowStroke("#bdffdb", 1.2, 7);
  ctx.stroke();

  ctx.restore();

  // Leaves
  if (localProgress > .3) {
    const leafAlpha = smooth((localProgress - .3) / .4);

    ctx.globalAlpha = leafAlpha;

    drawRoseLeaf(
      sway,
      bottom - stemHeight * .34,
      -2.8,
      .58 * size
    );

    drawRoseLeaf(
      sway,
      bottom - stemHeight * .53,
      .35,
      .55 * size
    );

    drawRoseLeaf(
      sway,
      bottom - stemHeight * .72,
      -2.9,
      .42 * size
    );

    ctx.globalAlpha = 1;
  }

  // Flower bloom
  if (localProgress > .7) {
    const bloom = smooth((localProgress - .7) / .3);

    ctx.save();
    ctx.globalAlpha = bloom;

    drawRoseHead(
      sway,
      flowerY,
      size * bloom,
      time
    );

    ctx.restore();
  }

  ctx.restore();
}

/* GROUND */
function drawGround() {
  const gradient = ctx.createRadialGradient(
    W / 2, H * .9, 2,
    W / 2, H * .9, W * .65
  );

  gradient.addColorStop(0, "rgba(65,255,166,.17)");
  gradient.addColorStop(1, "rgba(65,255,166,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, H * .65, W, H * .35);
}

/* MAIN ANIMATION */
function animate(time) {
  if (startTime === null) startTime = time;

  const elapsed = time - startTime;

  progress = Math.min(elapsed / 11000, 1);

  ctx.clearRect(0, 0, W, H);

  drawGround();
  drawParticles(time);

  roses.forEach(rose => {
    drawRose(rose, time, progress);
  });

  animationFrame = requestAnimationFrame(animate);
}

/* RESTART GARDEN */
function restartFlower() {
  cancelAnimationFrame(animationFrame);

  startTime = null;
  progress = 0;

  initializeParticles();

  const message = document.getElementById("gardenMessage");

  if (message) {
    message.textContent = "Every rose blooms beautifully for you, Sayang ♡";
  }

  animationFrame = requestAnimationFrame(animate);
}

animate(0);

/* FALLING PETALS */
const petals = document.getElementById("petals");

function createPetal() {
  if (!petals) return;

  const p = document.createElement("span");

  p.className = "petal";
  p.textContent = ["🌸", "🌷", "✿", "♡"][
    Math.floor(Math.random() * 4)
  ];

  p.style.left = Math.random() * 100 + "vw";
  p.style.fontSize = (12 + Math.random() * 18) + "px";
  p.style.animationDuration = (6 + Math.random() * 7) + "s";

  petals.appendChild(p);

  setTimeout(() => p.remove(), 14000);
}

setInterval(createPetal, 600);

/* NAVIGATION */
function goTo(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth"
  });
}

/* FLOATING HEARTS */
function hearts(amount) {
  for (let i = 0; i < amount; i++) {
    const h = document.createElement("span");

    h.className = "heart";
    h.textContent = Math.random() > .5 ? "💗" : "💕";
    h.style.left = Math.random() * 100 + "vw";
    h.style.top = (40 + Math.random() * 50) + "vh";
    h.style.fontSize = (18 + Math.random() * 18) + "px";

    document.body.appendChild(h);

    setTimeout(() => h.remove(), 1700);
  }
}

/* FLOWER RAIN */
function flowerRain() {
  hearts(20);
  restartFlower();
}

/* LOVE LETTER */
function openLetter() {
  const envelope = document.getElementById("envelope");
  const letter = document.getElementById("letterContent");

  envelope.classList.toggle("open");

  const isOpen = letter.style.display === "block";

  letter.style.display = isOpen ? "none" : "block";

  if (!isOpen) {
    hearts(10);

    setTimeout(() => {
      letter.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 200);
  }
}

/* =========================================
   HEART SHOWER
========================================= */

function hearts(amount) {

  const heartTypes = ["💗", "💕", "💖", "💘", "💓"];

  for (let i = 0; i < amount; i++) {

    const heart = document.createElement("span");

    heart.className = "heart";

    heart.textContent =
      heartTypes[Math.floor(Math.random() * heartTypes.length)];

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.top = (45 + Math.random() * 45) + "vh";

    heart.style.fontSize =
      (18 + Math.random() * 25) + "px";

    heart.style.animationDuration =
      (1.5 + Math.random() * 2) + "s";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 4000);
  }
}


/* =========================================
   OPEN GIFT + ROSE REVEAL
========================================= */

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

  // Hilangkan hadiah
  gift.style.pointerEvents = "none";
  gift.style.transform = "scale(0) rotate(360deg)";
  gift.style.opacity = "0";

  // Tahap 1: Hujan hati
  hearts(70);

  setTimeout(() => {
    hearts(50);
  }, 600);

  setTimeout(() => {
    hearts(35);
  }, 1200);

  // Tahap 2: Munculkan pesan
  setTimeout(() => {

    message.style.display = "block";

    message.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    // Tahap 3: Mawar mulai mekar
    setTimeout(() => {
      rose.classList.add("show");
    }, 500);

  }, 1700);

}

