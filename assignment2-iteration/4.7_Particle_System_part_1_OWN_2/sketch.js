let particles = []
let numParticles = 500;

function setup() {
  createCanvas(600, 600);
  
  for(let i = 0; i < numParticles; i++) {
    let p = new Particle()
    particles.push(p)
  }
}

function draw() {
  background(220);
  
  for(let i = 0; i < particles.length; i++) {
    let p = particles[i]
    p.update()
    p.draw()
  }
}
  
  class Particle {
    
    constructor() {
      this.pos = createVector(width/2, height/2)
      this.vel = createVector(random(-2, 2), random(-2, 2))
      this.color = color(random(255), random(255), random(255))
      this.size = random(1, 50)
    }
    
   update() {
    this.pos.add(this.vel)
    
    // bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1
    }
    
    // mouse attraction
    let mouse = createVector(mouseX, mouseY)
    let d = dist(this.pos.x, this.pos.y, mouse.x, mouse.y)
    
    if (d < 150) { // only affect when mouse is nearby
      let dir = p5.Vector.sub(mouse, this.pos) // direction towards mouse
      dir.normalize()
      dir.mult(0.3) // control strength of pull
      
      // add a little randomness for scattered motion
      dir.add(createVector(random(-0.2, 0.2), random(-0.2, 0.2)))
      
      this.vel.add(dir) // apply the force
      this.vel.limit(4) // cap max speed
    }
  }
      
  draw() {
    fill(this.color)
    noStroke()
    circle(this.pos.x, this.pos.y, this.size)
  }
}
