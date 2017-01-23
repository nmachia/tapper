var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.addEventListener('click', action);

var h = 0;
var w = 0;

function easeOut(value) {
  max = (3 * Math.PI) / 2;
  min = Math.PI;
  return  Math.sin(((max - min) * (value / h)) + Math.PI);

}



function action(e) {
        e.preventDefault();
  
    if(( e.clientX >= ball.x - ball.radius && e.clientX <= ball.x + ball.radius ) 
      && ( e.clientY >= ball.y - ball.radius && e.clientY <= ball.y + ball.radius )
      && (ball.y >= game.y )
      && (ball.yDirection >= 1)
      ){
          game.score ++;
          ball.yDirection = -1;

          //x direction could be more precise
          if((ball.xDirection == -1) && (e.clientX >= (ball.x + 0.5 * ball.radius))){
            ball.Direction = 1;
          }else if((ball.xDirection == 1) && (e.clientX >= (ball.x - 0.5 * ball.radius))) {
            ball.xDirection = -1;
          }
        }


  return;
}

function move(item){

  if((item.xDirection <= 0 && item.x - item.radius <= 0) || (item.xDirection > 0 && item.x + item.radius >= w)){
    item.xDirection = -(item.xDirection);
  }

  if(item.yDirection == -1 && item.y - item.radius <= 0){
      item.yDirection = 1;
      item.y = item.y + (item.yDirection * item.speed);
      return;
  }

  item.x = item.x + (item.xDirection * item.speed);
  item.y = item.y + (item.yDirection * item.speed);
  return;
}

function asteroid(radius, speed){
  this.x = null;
  this.y = null;
  this.radius = radius;
  this.speed = speed;
  this.terminalVelocity = 1.8;
  this.acceleration = 1;
  this.yDirection = -1;
  this.xDirection = 1;
  this.move = function(){
    //test x hit
    if((this.xDirection <= 0 && this.x - this.radius <= 0) || (this.xDirection > 0 && this.x + this.radius >= w)){
      this.xDirection = -(this.xDirection);
    }
    //test y top out
    if(this.yDirection == -1 && this.acceleration <= 0.1){
      this.yDirection = 1;
    }
    //going down at terminal velocity
    if(this.yDirection == 1 && this.acceleration >= this.terminalVelocity){
       this.x = this.x + this.xDirection;
       this.y = this.y + (this.yDirection * this.acceleration);
       return;
    }

    if(this.yDirection == 1){
      this.acceleration  = (this.y - game.topBuffer) / 30;
    }else{
      this.acceleration  = (this.y - game.topBuffer) / 40;
    }
    this.x = this.x + this.xDirection;
    this.y = this.y + (this.yDirection * this.acceleration);
    return;
    
  };
}

var ball = new asteroid(20,1);


var game = {
  score: 0,
  level: 1,
  y: 1,
  topBuffer: null,
  speed: 0.25,
  yDirection:1,
  gravity: null

};

var start = null;

var step = function( timestamp ) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  
  // Stash Canvas Height/Width
  h = canvas.height;
  w = canvas.width;
  if(!ball.y) ball.y = h * 0.8;
  if(!ball.x) ball.x = w * 0.5;
  if(!game.topBuffer) game.topBuffer = h * 0.05;
  if(!game.gravity) game.gravity = h / 12;

  // Clear the canvas
  ctx.clearRect(0, 0, w, h);
  
  // Draw the background
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 0, w, h);
  ctx.save();    
  
  
   ctx.restore();
   ctx.fillStyle = "black";
   ctx.fillRect(0, game.y, w, h);
   ctx.fillStyle = "orange";  
   ctx.font = "30px Arial";   
   ctx.fillText(game.score, 10, 30);

   //ctx.fillText(ball.acceleration, 600, 10);
   

    // Move the ball
    ball.move();
    //move(ball);
    move(game);
  
  
    if( ball.y > h ) {
      //ball.y = 90;
      ball.speed = 1;
      ball.x = null;
      ball.y = null;
      ball.acceleration = 1;
      ball.yDirection = -1;
      alert("Game Over! Final Score: "+ game.score);
      game.score = 0;
      game.y = 1;
      //return;
      //you lost
      //right now just "resets"
    }
  
  //end move ball

  
  // Draw the ball
    ctx.beginPath();
    ctx.strokeStyle = '#0CF';
    ctx.arc(
      ball.x, 
      ball.y, 
      ball.radius, 
      0, 
      2 * Math.PI);
    ctx.stroke();
  
  // Re-draw the Scene
  requestAnimationFrame(step);
};

// Make the canvas responsive?
var setCanvasSize = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};



setCanvasSize();
window.addEventListener('resize', setCanvasSize );

// Start the animation
window.requestAnimationFrame(step);