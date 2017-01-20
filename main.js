var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.addEventListener('click', action);

var h = 0;
var w = 0;

function action(e) {
        e.preventDefault();
  
    if(( e.clientX >= asteroid.x - asteroid.radius && e.clientX <= asteroid.x + asteroid.radius ) 
      && ( e.clientY >= asteroid.y - asteroid.radius && e.clientY <= asteroid.y + asteroid.radius )
      && (asteroid.y >= game.y )
      && (asteroid.yDirection >= 1)
      ){
          game.score ++;
          asteroid.yDirection = -1;
          //randomize the direction a bit
          var directionModifier = Math.random();

          if(Math.random() >= 0.75){
            asteroid.xDirection = asteroid.xDirection * -1;
          }
            if(asteroid.xDirection >= 1){
              asteroid.xDirection = directionModifier;
            }else{
              asteroid.xDirection = -(directionModifier);
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

var asteroid = {
  x: null,
  y: null,
  radius: 20,
  hp: 1,
  speed: 1,
  acceleration: 0.0035,
  yDirection: -1,
  xDirection: 1
};

var game = {
  score: 0,
  y: 1,
  speed: 0.05,
  yDirection:1

};

var start = null;

var step = function( timestamp ) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  
  // Stash Canvas Height/Width
  h = canvas.height;
  w = canvas.width;
  if(!asteroid.y) asteroid.y = h * 0.8;
  if(!asteroid.x) asteroid.x = w * 0.5;

  // Clear the canvas
  ctx.clearRect(0, 0, w, h);
  
  // Draw the background
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, w, h);
  ctx.save();    
  
  
   ctx.restore();
   ctx.fillStyle = "green";
   ctx.fillRect(0, game.y, w, h);
   ctx.fillStyle = "orange";     
   ctx.fillText(game.score, 10, 10);
   

    // Move the Asteroid
    //asteriod.move;
    move(asteroid);
    move(game);
  
  
    if( asteroid.y > h ) {
      //asteroid.y = 90;
      asteroid.speed = 0;
      alert("Game Over! Final Score: "+ game.score);
      return;
      //you lost
      //right now just "resets"
    }
  
  //end move asteroid

  
  // Draw the Asteroid
    ctx.beginPath();
    ctx.strokeStyle = '#0CF';
    ctx.arc(
      asteroid.x, 
      asteroid.y, 
      asteroid.radius, 
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