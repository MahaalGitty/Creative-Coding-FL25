let size = 100;
let isOn = true; //boolean, can be true of false
let onClicks = 0; // on is white
let offClicks = 0; // off is black

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER)
}

function draw() {
  background(220);
  
  
  line(width/2, 0, width/2, height)
  line(0, height/2, width, height/2)
  
  fill(255)
  //check if the mouse is inside the square
  
  if(isOn == false) {
    fill(0)
    textSize(40)
    textAlign(CENTER)
    text("Clicked!", width/2, height/4)
  }
  //check if the mouse is inside 
  rect(width/2, height/2, size)

}
function mousePressed() {
if(mouseY > (width/2) - (size/2) &&
     mouseY < (width/2) + (size/2) &&
     mouseX > (height/2) - (size/2) &&
     mouseX < (height/2) + (size/2)) {
    
  //console.log("Mouse pressed in area")
  fill(255, 0, 0)  
  
  if(isOn == true) {
    onClicks++;
    
    if(onClicks == 3) {
      isOn = false; //reset counter
      onClicks = 0;
    }
    console.log("onClicks: " + onClicks)
  } else {
    offClicks++
    if(offClicks == 2) {
      isOn = true;
      offClicks = 0; // reset Counter
    }
  }
}
}