var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.addEventListener('click', action);

var game = {
  score: 0,
  level: 1,
  y: 1,
  buffer: 50,
  speed: 0.25,
  yDirection:1,
  gravity: 0.1,

};
// Velocity x
  
  // Velocity y
  //var vy = (Math.random() * -15) - 5;
  
  //var gravity = 0.1;

  var W = canvas.width = window.innerWidth;
  var H = canvas.height = window.innerHeight;

/*
  var stepSum = (H - W/12) - game.buffer;
  var steps = 0;



  for(var i = game.gravity; stepSum >= 0; i += game.gravity){
      steps++;
      stepSum -= i;
    }

  var vy = -(i);

*/

function resetGame(){
  game.score = 0;
  game.level = 1;
  game.y = 1;
  game.gravity = 0.1;
  ball.vy = null;

}



function action(e) {
        e.preventDefault();
    //if(( e.clientX >= ball.x - ball.radius && e.clientX <= ball.x + ball.radius ) && ( e.clientY >= ball.y - ball.radius && e.clientY <= ball.y + ball.radius ) && (ball.y >= game.y ) && (ball.yDirection >= 1)){
      if(( e.clientX >= ball.x - ball.radius && e.clientX <= ball.x + ball.radius ) && ( e.clientY >= ball.y - ball.radius && e.clientY <= ball.y + ball.radius ) && (ball.y >= game.y ) && (ball.vy >= 0)){
          game.score ++;
          ball.vy *= -1;
          
          if((e.clientX >= (ball.x + 0.5 * ball.radius)) || (e.clientX >= (ball.x - 0.5 * ball.radius))){
            ball.vx *= -1;
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

function Ball(){
  this.x = canvas.width / 2;
  this.y = canvas.height - (canvas.width/10);
  this.radius = canvas.width / 10;
  this.vy = null;
  this.vx = Math.random();
  this.draw = function(ctx) {
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      
      ctx.arc(
        this.x,
        this.y,
        this.radius,
        0,
        Math.PI*2,
        false
      );
      
      ctx.closePath();
      ctx.fill();
    };
    this.calculateVelocity = function(game){
        var stepSum = (H - W/12) - game.buffer;
        var steps = 0;
        for(var i = game.gravity; stepSum >= 0; i += game.gravity){
            steps++;
            stepSum -= i;
          }
        this.vy = -(i);
    };
  }

var ball = new Ball(20);


var start = null;

var step = function( timestamp ) {
  if (!start) start = timestamp;
  if(!ball.vy) ball.calculateVelocity(game);
  var progress = timestamp - start;
  
  // Stash Canvas Height/Width
  h = canvas.height;
  w = canvas.width;
  if(!game.topBuffer) game.topBuffer = h * 0.05;

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



    ball.vy += game.gravity;
    
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (
        ball.x + ball.radius > canvas.width ||
        ball.x - ball.radius < 0 ){
      ball.vx *= -1;
    }

      if(
        ball.y + ball.radius > canvas.height
       ) {
      //GAME OVER
       alert("Game Over! Final Score: "+ game.score);
      resetGame();
    }
    ball.draw(ctx);

    move(game);
  
  

    /*
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
    */
  
  //end move ball

  
  // Draw the ball
    /*ctx.beginPath();
    ctx.strokeStyle = '#0CF';
    ctx.arc(
      ball.x, 
      ball.y, 
      ball.radius, 
      0, 
      2 * Math.PI);
    ctx.stroke();*/
  
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