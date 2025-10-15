let spritesheet;
let spritedata;
let animation = [];
let currentFrame = 0;
let isPlaying = false;
let direction = 1;
let lastClicked = null; // keeps track of which symbol was last clicked

// symbol images
let symbolA_img, symbolM_img;
let symbolA, symbolM;

function preload() {
  // Load sprite animation (body)
  spritedata = loadJSON('Chakra/CHAKRASPRITE1.json');
  spritesheet = loadImage('Chakra/CHAKRASPRITE1.png');

  // Load symbol images
  symbolA_img = loadImage('Chakra/SYMBOL_A.png'); // sitting position
  symbolM_img = loadImage('Chakra/SYMBOL_M.png'); // standing position
}

function setup() {
  createCanvas(640, 544);
  imageMode(CENTER);

  // Extract animation frames from JSON
  let frames = spritedata.frames; // check if "frame" or "frames" in your JSON
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    animation.push(img);
  }
  console.log("Frames loaded:", animation.length);

  // Define clickable symbol positions
  symbolA = { x: 180, y: 480, w: 100, h: 100, id: 'A' }; // Ajna (sitting)
  symbolM = { x: 460, y: 480, w: 100, h: 100, id: 'M' }; // Muladhara (standing)
}

function draw() {
  background(220);

  // Draw sprite (body)
  image(animation[currentFrame], width / 2, height / 2 - 80, 640, 360);

  // Draw symbol buttons
  drawSymbol(symbolA, symbolA_img);
  drawSymbol(symbolM, symbolM_img);

  // Animate sprite frames
  if (isPlaying && frameCount % 5 === 0) {
    currentFrame += direction;

    // Animation bounds and direction logic
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

function drawSymbol(symbol, img) {
  push();
  imageMode(CENTER);

  // Optional: glow when active
  if (lastClicked === symbol.id) {
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = color(255, 255, 120);
  }

  image(img, symbol.x, symbol.y, symbol.w, symbol.h);
  pop();
}

function mousePressed() {
  if (isPlaying) return; // ignore clicks while animation runs

  if (insideSymbol(mouseX, mouseY, symbolA)) {
    handleSymbolClick(symbolA);
  } else if (insideSymbol(mouseX, mouseY, symbolM)) {
    handleSymbolClick(symbolM);
  }
}

function handleSymbolClick(symbol) {
  // If same symbol clicked, ignore
  if (lastClicked === symbol.id) {
    console.log("Same symbol clicked – ignored");
    return;
  }

  // Different symbol clicked → play animation
  isPlaying = true;
  lastClicked = symbol.id;
}

function insideSymbol(mx, my, symbol) {
  return (
    mx > symbol.x - symbol.w / 2 &&
    mx < symbol.x + symbol.w / 2 &&
    my > symbol.y - symbol.h / 2 &&
    my < symbol.y + symbol.h / 2
  );
}
