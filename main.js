var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.addEventListener('click', action);

var start = null;
var game = {
  score: 0,
  level: 1,
  buffer: 50,
  speed: 0.25,
  yDirection:1,
  gravity: 0.1,

};

var W = canvas.width = window.innerWidth;
var H = canvas.height = window.innerHeight;

function Ball(){
  this.x = canvas.width / 2;
  this.y = canvas.height - (canvas.width/10);
  this.radius = canvas.width / 10;
  this.vy = null;
  this.image = new Image();
  this.image.src = 'pig.svg';
  this.vx = Math.random();
  this.draw = function(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.radius, this.radius);
    };
    this.calculateVelocity = function(game){
        var stepSum = (H - W/10) - game.buffer;
        for(var i = game.gravity; stepSum >= 0; i += game.gravity){
            stepSum -= i;
          }
        this.vy = -(i);
    };
  }
var ball = new Ball();

function Clouds(){
  this.group = [];
  this.create = function(){
    var rando = Math.floor(Math.random() * 200 );
      if(rando === 0) {
        this.group.push( {
          x: Math.floor(Math.random()* canvas.width),
          y: 0,
          w: canvas.width/4,
          h: canvas.height/8,
          d: Math.random()
        });
      }
  };
  this.move = function(){
    for(var i = 0; i< this.group.length; i++ ) {
      var item = this.group[i];
      item.y += 1;
      
      if( item.y - item.h > H ) {
        this.group.splice(i, 1);
      }
    }
  };
  this.draw = function(){
    for(var i = 0; i< this.group.length; i++ ) {
      var item = this.group[i];

      ctx.fillStyle = 'white';
      ctx.fillRect(item.x + item.w * 0.1, item.y - item.h, item.w * 0.8, item.h * 0.4);
      ctx.fillRect(item.x, item.y - item.h * 0.65, item.w, item.h *0.5);
      ctx.fillStyle = 'gray';
      ctx.fillRect(item.x, item.y - item.h * 0.15, item.w, item.h * 0.1);


      //ctx.fillRect(item.x-20, item.y+20, 140,40);

    }
  };
}

var clouds = new Clouds();


function resetGame(){
  game.score = 0;
  game.level = 1;
  game.gravity = 0.1;
  ball.vy = null;

}

////hit detection
function getElementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function getEventLocation(element,event){
    var pos = getElementPosition(element);
    
    return {
        x: (event.pageX - pos.x),
        y: (event.pageY - pos.y)
    };
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function action(e){
    var eventLocation = getEventLocation(this,e);
    //var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;
    
    // Get the data of the pixel according to the location generate by the getEventLocation function
    var context = this.getContext('2d');
    var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;

    // If transparency on the image
    if((pixelData[0] === 0) && (pixelData[1] === 0) && (pixelData[2] === 0) && (pixelData[3] === 0)){
        //coord += " (Transparent color detected, cannot be converted to HEX)";
    }
    
    var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
    
    // hit based on color
    if(hex == "#2a3eff"  && ball.vy >= 0){
            game.score ++;
            ball.vy *= -1;
            if(eventLocation.x >= (ball.x + 0.5 * ball.radius) && ball.vx >= 0){
              ball.vx *= -1;
            }else if(eventLocation.x <= (ball.x - 0.5 * ball.radius) && ball.vx <= 0){
              ball.vx *= -1;
            }
    }
}


var step = function( timestamp ) {
  if (!start) start = timestamp;
  if(!ball.vy) ball.calculateVelocity(game);
  var progress = timestamp - start;
  
  // Stash Canvas Height/Width
  H = canvas.height;
  W = canvas.width;
  if(!game.topBuffer) game.topBuffer = H * 0.05;

  // Clear the canvas
  ctx.clearRect(0, 0, W, H);


   ctx.fillStyle = "orange";
   ctx.font = "30px Arial";
   ctx.fillText(game.score, 10, 30);



    ball.vy += game.gravity;
    
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (
        ball.x + ball.radius > canvas.width ||
        ball.x  < 0 ){
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

    clouds.create();
    clouds.move();
    clouds.draw();

  
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