let shapes = [];
let currentVerts = [];
let startVerts = [];
let nextVerts = [];
let morphing = false;
let t = 0;
let steps = 120;
let n = 100;          // number of vertices per shape
let shapeIndex = 0;
let glowFrames = 10;
let glowT = 0;

function setup() {
  createCanvas(800, 800);
  
  // Generate 3 smooth organic shapes
  for (let s = 0; s < 3; s++) {
    let verts = [];
    let noiseOffset = random(1000);
    for (let i = 0; i < n; i++) {
      let angle = map(i, 0, n, 0, TWO_PI);
      let r = 100 + map(noise(noiseOffset + cos(angle), noiseOffset + sin(angle)), 0, 1, -30, 30);
      let x = width/2 + r * cos(angle);
      let y = height/2 + r * sin(angle);
      verts.push(createVector(x, y));
    }
    shapes.push(verts);
  }

  currentVerts = shapes[0].map(v => v.copy());
}

function draw() {
  background(30);

  // Glow effect on click
  if (glowT > 0) {
    let glowAlpha = map(glowT, 0, glowFrames, 150, 0);
    stroke(50, 200, 255, glowAlpha);
    strokeWeight(6);
    noFill();
    beginShape();
    for (let v of currentVerts) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
    glowT--;
  }

  // Draw main shape
  stroke(255);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let v of currentVerts) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);

  // Morph animation
  if (morphing) {
    t += 1 / steps;
    if (t >= 1) {
      t = 1;
      morphing = false;
      currentVerts = nextVerts.map(v => v.copy());
    } else {
      for (let i = 0; i < currentVerts.length; i++) {
        currentVerts[i] = p5.Vector.lerp(startVerts[i], nextVerts[i], t);
      }
    }
  }
}

function mousePressed() {
  if (!morphing) {
    glowT = glowFrames;
    startVerts = currentVerts.map(v => v.copy());
    shapeIndex = (shapeIndex + 1) % shapes.length;
    nextVerts = shapes[shapeIndex].map(v => v.copy());
    t = 0;
    morphing = true;
  }
}
