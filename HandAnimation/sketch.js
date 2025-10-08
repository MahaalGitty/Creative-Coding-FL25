let spritesheet1, spritesheet2;
let spritedata1, spritedata2;

let animation1 = [];
let animation2 = [];
let animationIndex = 0; // this is the variable which is an arrey that will will be used to call back each animation. it's the start of the animation
let currentAnimation; // defining the current animation with a variable

let currentFrame = 0;  // definting that the animation will start from 0 
let isPlaying = false; 

let spriteData = [] // this variable is an arrey that will hold all the sprite animation files (json and pngs)
//using this to make the code small.
let animations = [] // Arrey of arreys of sprite animation, a0, a1, a2...
let animationChange = 0; // start with the first animation



function preload() {
  
  for(let i = 0; i < 3; i++) {
    let tempSprite = {  // loading json files and images of the sprite arreys into spriteData through i.
      spritePositions: loadJSON('handSP' + i + "/handSP.json"),
      spriteImage: loadImage('handSP' + i + "/handSP.png") // i = total sprite arrey numbers. if theres 12 animation sprites in 12 folders, i == 12. loading single image everytime
    }
    spriteData.push(tempSprite) //instead of writing a lot of animation sprites in the preload now we can call only spriteData arrey that ahs all the spritesheets and images and that will change one by one also.
  }
  
}



// Breaking the whole sprite canvases into frames
// Position is needed for defining each frame that will be breaking out and shown on frame
function setup() {
  createCanvas(1920, 1080)
  //loading animation1 frames
  
  // in this loop, process and load all sprite data into the animations array
  for(let i = 0; i < spriteData.length; i++) { 
    
    let positions = spriteData[i].spritePositions.frames; // variable. its breaking the frames. 'i' is used to call out the specific positions of any frame from a specitic sprite from inside the spriteData.
    
    let img = spriteData[i].spriteImage //just to minimise the line length in line 43, we are defining "spriteData[i].spriteImage as "frames". stores the frame image
    
    let tempAnimation = [] // another variable to definie specific current frames in arrey
    for(let k = 0; k < positions.length; k++) {
      let pos = positions[k].position; // definting the position of the current frame
      tempAnimation.push(img.get(pos.x, pos.y, pos.w, pos.h))
    }
    animations.push(tempAnimation)    
 // loading the frames of the current animation
  }
  
  console.log("animations: ", animations)
  
  currentAnimation = animations[animationIndex] // set the animation to 0
  
 
}

function draw() {
  background(220);
  
  //display current frame of the current animation
  image(currentAnimation[currentFrame], 0, 0, width, height);
  
  if(isPlaying && frameCount % 5 == 0) { // changes frame in a 10fps speed. isPlaying will go on playing untill...
    currentFrame++ // chnaging the frames
    
    if(currentFrame >= currentAnimation.length) { //now the time of changing the animation through isPlaying
      currentFrame = currentAnimation.length -1;
      isPlaying = false; // ...untill isPlaying is false. Means it stops there and won't change to the next animation until next click
    }
  }
  
}

function mousePressed() {
  if(!isPlaying) { // used to reverse the variables in if-else function
    isPlaying = true; //starts the animation
    currentFrame = 0; // starts the first frame
    
    
    // change to next animation in sequence
    animationChange++;
    if (animationChange >= animations.length) {
      animationChange = 0;
    }

    currentAnimation = animations[animationChange];
  }
}
