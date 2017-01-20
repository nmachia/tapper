var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.addEventListener('click', action);

function action(e) {
        e.preventDefault();
  
    if(( e.clientX >= asteroid.x - asteroid.radius && e.clientX <= asteroid.x + asteroid.radius ) && ( e.clientY >= asteroid.y - asteroid.radius && e.clientY <= asteroid.y + asteroid.radius )){
          game.score += 20;
          asteroid.direction = -1;
        }
}


var asteroid = {
  x: 50,
  y: null,
  radius: 20,
  hp: 1,
  speed: 0.07,
  acceleration: 0.0035,
};

var game = {
  score: 0,
  gravity: 0.05
};

var start = null;

var step = function( timestamp ) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  
  // Stash Canvas Height/Width
  var h = canvas.height;
  var w = canvas.width;
  if(!asteroid.y) asteroid.y = h * 0.8;
  // Clear the canvas
  ctx.clearRect(0, 0, w, h);
  
  // Draw the background
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, w, h);
  ctx.save();    
  
  
   ctx.restore();
   ctx.fillStyle = "orange";     
   ctx.fillText(game.score, 10, 10);
   

    // Move the Asteroid
  
    asteroid.speed -= asteroid.acceleration;
  
    if(android.speed <= 0){
      asteroid.y += (1 / Math.abs(asteroid.speed));
    }else{
      asteroid.y -= (1 / Math.abs(asteroid.speed)); 
    }
  
 
 
  
  
    if( asteroid.y > h ) {
      asteroid.y = 0;
      asteroid.speed = 1;
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