let spritesheet;
let spritedata;
let animation = [];
let currentFrame = 0;
let isPlaying = false;
let direction = 1;
let lastClicked = null;

let symbolA_img, symbolM_img, symbolMT_img, symbolAT_img;
let symbolA, symbolM;

let floatersCurrent = [];
let floatersNext = [];
let currentFloaterSet = "M"; // "M" or "A"
let transitionProgress = 0;
let isTransitioning = false;
let fadeSpeed = 0.01;

function preload() {
  spritedata = loadJSON("Chakra/CHAKRASPRITE1.json");
  spritesheet = loadImage("Chakra/CHAKRASPRITE1.png");

  symbolA_img = loadImage("Chakra/SYMBOL_A.png");
  symbolM_img = loadImage("Chakra/SYMBOL_M.png");
  symbolMT_img = loadImage("Chakra/SYMBOL_M_T.png");
  symbolAT_img = loadImage("Chakra/SYMBOL_A_T.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  // Load sprite frames
  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    animation.push(spritesheet.get(pos.x, pos.y, pos.w, pos.h));
  }

  setupSymbols(); // set initial clickable symbol layout
  floatersCurrent = createFloaters();
}

function setupSymbols() {
  let bodyX = width / 2;
  let bodyY = height / 2;
  let offsetX = width * 0.18;

  if (height > width) {
    // 📱 Mobile layout (portrait)
    let symbolY = height * 0.85; // ⬆ symbols moved closer to body
    let spacing = width * 0.25;
    let size = width * 0.22;
    symbolA = { x: width / 2 - spacing / 2, y: symbolY, w: size, h: size, id: "A" };
    symbolM = { x: width / 2 + spacing / 2, y: symbolY, w: size, h: size, id: "M" };
  } else {
    // 💻 Desktop layout (landscape)
    symbolA = { x: bodyX - offsetX, y: bodyY, w: width * 0.1, h: width * 0.1, id: "A" };
    symbolM = { x: bodyX + offsetX, y: bodyY, w: width * 0.1, h: width * 0.1, id: "M" };
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupSymbols();
}

function createFloaters() {
  let arr = [];
  for (let i = 0; i < 5; i++) {
    let x, y;
    do {
      x = random(width);
      y = random(height);
    } while (dist(x, y, width / 2, height / 2) < min(width, height) * 0.25);

    arr.push({
      x: x,
      y: y,
      size: random(min(width, height) * 0.25, min(width, height) * 0.4),
      selfRotation: random(TWO_PI),
      selfRotationSpeed: random(0.002, 0.006),
      floatAngle: random(TWO_PI),
      floatRadius: random(20, 60),
      centerX: x,
      centerY: y
    });
  }
  return arr;
}

function draw() {
  background(0);

  // Update floater motion
  updateFloaters(floatersCurrent);
  if (isTransitioning) updateFloaters(floatersNext);

  // Manage crossfade transition
  let alphaCurrent = 255;
  let alphaNext = 0;
  if (isTransitioning) {
    transitionProgress += fadeSpeed;
    transitionProgress = min(transitionProgress, 1);
    alphaCurrent = 255 * (1 - transitionProgress);
    alphaNext = 255 * transitionProgress;

    if (transitionProgress >= 1) {
      floatersCurrent = floatersNext;
      floatersNext = [];
      isTransitioning = false;
      transitionProgress = 0;
      currentFloaterSet = currentFloaterSet === "M" ? "A" : "M";
    }
  }

  // Draw floaters (current + next if fading)
  drawFloaters(floatersCurrent, currentFloaterSet === "M" ? symbolMT_img : symbolAT_img, alphaCurrent);
  if (isTransitioning) {
    drawFloaters(floatersNext, currentFloaterSet === "M" ? symbolAT_img : symbolMT_img, alphaNext);
  }

  // Draw body sprite
  drawBody();

  // Draw clickable symbols
  drawSymbol(symbolA, symbolA_img);
  drawSymbol(symbolM, symbolM_img);

  // Animate body sprite
  animateBody();
}

function updateFloaters(arr) {
  for (let f of arr) {
    f.floatAngle += 0.002;
    f.x = f.centerX + cos(f.floatAngle) * f.floatRadius;
    f.y = f.centerY + sin(f.floatAngle) * f.floatRadius;
    f.selfRotation += f.selfRotationSpeed;
  }
}

function drawFloaters(arr, img, alpha) {
  for (let f of arr) {
    push();
    translate(f.x, f.y);
    rotate(f.selfRotation);
    tint(255, alpha);
    image(img, 0, 0, f.size, f.size);
    pop();
  }
}

function drawBody() {
  let bodyScale;
  if (height > width) {
    // 📱 Mobile — make the body larger
    bodyScale = min(width * 2, height * 1);
  } else {
    // 💻 Desktop
    bodyScale = min(width * 0.7, height * 0.7);
  }
  image(animation[currentFrame], width / 2, height / 2, bodyScale, bodyScale * 0.56);
}

function drawSymbol(symbol, img) {
  push();
  imageMode(CENTER);
  if (lastClicked === symbol.id) {
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = color(255, 255, 120);
  }
  image(img, symbol.x, symbol.y, symbol.w, symbol.h);
  pop();
}

function animateBody() {
  if (isPlaying && frameCount % 7 === 0) {
    currentFrame += direction;
    if (currentFrame >= animation.length) {
      currentFrame = animation.length - 1;
      isPlaying = false;
      direction = -1;
    } else if (currentFrame < 0) {
      currentFrame = 0;
      isPlaying = false;
      direction = 1;
    }
  }
}

function mousePressed() {
  if (isPlaying || isTransitioning) return;
  if (insideSymbol(mouseX, mouseY, symbolA)) handleSymbolClick(symbolA);
  else if (insideSymbol(mouseX, mouseY, symbolM)) handleSymbolClick(symbolM);
}

function handleSymbolClick(symbol) {
  if (lastClicked === symbol.id) return;
  isPlaying = true;
  lastClicked = symbol.id;

  floatersNext = createFloaters(); // new random set
  isTransitioning = true;
  transitionProgress = 0;
}

function insideSymbol(mx, my, symbol) {
  return mx > symbol.x - symbol.w / 2 &&
         mx < symbol.x + symbol.w / 2 &&
         my > symbol.y - symbol.h / 2 &&
         my < symbol.y + symbol.h / 2;
}
