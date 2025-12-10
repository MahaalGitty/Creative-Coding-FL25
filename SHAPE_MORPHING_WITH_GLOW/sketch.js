let shapes = [];
let currentVerts = [];
let startVerts = [];
let nextVerts = [];
let morphing = false;
let glowFrames = 60;  // frames to show glow
let glowT = 0;
let t = 0;
let steps = 120;       // frames for morph
let n = 60;
let shapeIndex = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  let len = 200;
  let cx = width / 2;
  let cy = height / 2;

  // --- Square ---
  let squareVerts = [];
  for (let i = 0; i < n; i++) {
    let pos = i / n;
    let x, y;
    if (pos < 0.25) { x = lerp(cx - len/2, cx + len/2, pos/0.25); y = cy - len/2; }
    else if (pos < 0.5) { x = cx + len/2; y = lerp(cy - len/2, cy + len/2, (pos-0.25)/0.25); }
    else if (pos < 0.75) { x = lerp(cx + len/2, cx - len/2, (pos-0.5)/0.25); y = cy + len/2; }
    else { x = cx - len/2; y = lerp(cy + len/2, cy - len/2, (pos-0.75)/0.25); }
    squareVerts.push(createVector(x, y));
  }

  // --- Circle ---
  let circleVerts = [];
  for (let i = 0; i < n; i++) {
    let angle = map(i, 0, n, 0, TWO_PI);
    circleVerts.push(createVector(cx + len/2 * cos(angle), cy + len/2 * sin(angle)));
  }

  // --- Triangle ---
  let triPts = [createVector(cx, cy - len/2), createVector(cx + len/2, cy + len/2), createVector(cx - len/2, cy + len/2)];
  let triangleVerts = [];
  for (let i = 0; i < n; i++) {
    let pos = i / n; let x, y;
    if (pos < 1/3) { x = lerp(triPts[0].x, triPts[1].x, pos/(1/3)); y = lerp(triPts[0].y, triPts[1].y, pos/(1/3)); }
    else if (pos < 2/3) { x = lerp(triPts[1].x, triPts[2].x, (pos-1/3)/(1/3)); y = lerp(triPts[1].y, triPts[2].y, (pos-1/3)/(1/3)); }
    else { x = lerp(triPts[2].x, triPts[0].x, (pos-2/3)/(1/3)); y = lerp(triPts[2].y, triPts[0].y, (pos-2/3)/(1/3)); }
    triangleVerts.push(createVector(x, y));
  }

  shapes.push(squareVerts);
  shapes.push(circleVerts);
  shapes.push(triangleVerts);

  currentVerts = shapes[0].map(v => v.copy());
}

function draw() {
  background(30);

  // Glow effect
  if (glowT > 0) {
    let glowAlpha = map(glowT, 0, glowFrames, 150, 0);
    stroke(50, 200, 255, glowAlpha);
    strokeWeight(6); // thick glow
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

}

function mousePressed() {
  if (!morphing) {
    // Activate glow
    glowT = glowFrames;

    // Set up morph
    startVerts = currentVerts.map(v => v.copy());
    shapeIndex = (shapeIndex + 1) % shapes.length;
    nextVerts = shapes[shapeIndex].map(v => v.copy());
    t = 0;
    morphing = true;
  }
}
