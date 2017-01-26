var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.addEventListener('click', action);

var scoreTable = document.getElementById('score');

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
  this.radius = canvas.width / 4;
  this.x = canvas.width / 2;
  this.y = canvas.height - this.radius;
  this.vy = null;
  this.imageUp = new Image();
  this.imageUp.src = 'pigUp.svg';
  this.imageDown = new Image();
  this.imageDown.src = 'pig.svg';
  this.minSpeed = 0;
  this.maxSpeed = 2;
  this.vx = Math.random(this.minSpeed, this.maxSpeed);
  this.draw = function(ctx) {
      if(this.vy > 0){
        ctx.drawImage(this.imageDown, this.x-this.radius/2, this.y, this.radius, this.radius);
      }else{
        ctx.drawImage(this.imageUp, this.x-this.radius/2, this.y, this.radius, this.radius);
      }
    };
    this.calculateVelocity = function(game){
        var stepSum = (this.y) - game.buffer;
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
          w: canvas.width/3,
          r: canvas.width/9,
          h: canvas.height/8,
          d: Math.random()
        });
      }
  };
  this.move = function(){
    for(var i = 0; i< this.group.length; i++ ) {
      var item = this.group[i];
      item.y += 1;
      
      if( item.y - (item.r * 2) > H ) {
        this.group.splice(i, 1);
      }
    }
  };
  this.draw = function(){
    for(var i = 0; i< this.group.length; i++ ) {
      var item = this.group[i];

      ctx.beginPath();
      ctx.arc(item.x, item.y-item.r, item.r, 0, 2 * Math.PI, false);
      ctx.arc(item.x-item.r, item.y-item.r, item.r/1.3, 0, 2 * Math.PI, false);
      ctx.arc(item.x+item.r, item.y-item.r, item.r/1.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = '#EEEEEE';
      ctx.fill();
    }
  };
}

var clouds = new Clouds();


function resetGame(){
  ctx.clearRect(0, 0, W, H);
  game.score = 0;
  game.level = 1;
  game.gravity = 0.1;
  ball.vy = null;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - ball.radius;
  clouds.group.length = 0;
  ball.draw(ctx);
  document.getElementById('score').innerHTML = '0';
  document.body.style.background = '#66ccff';

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
    var hitBall = false;
    //var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;
    
    // Get the data of the pixel according to the location generate by the getEventLocation function
    var context = this.getContext('2d');
    //var pixelData = context.getImageData(eventLocation.x, eventLocation.y,1, 1).data;

    var allData = context.getImageData(eventLocation.x - 10, eventLocation.y -10 ,20, 20).data;

    var allLength = allData.length;
    for(var i = 0; i < allLength; i+= 4){
      //R+G+B compare
      if((""+allData[i]+allData[i+1]+allData[i+2] == '255255255')|| (""+allData[i]+allData[i+1]+allData[i+2] == '232158171')||(""+allData[i]+allData[i+1]+allData[i+2] == '181100118')||(""+allData[i]+allData[i+1]+allData[i+2] == '515151')){
          hitBall = true;
          break;
        }
    }

    if(hitBall){
            if(!ball.vy){
              window.requestAnimationFrame(step);
              return;
            }
            game.score ++;
            ball.vy *= -1;
            if(eventLocation.x >= (ball.x + 0.2 * ball.radius) && ball.vx >= 0){
              ball.vx = -(Math.random(this.maxSpeed/2,this.maxSpeed));
            }else if(eventLocation.x <= (ball.x - 0.2 * ball.radius) && ball.vx <= 0){
              ball.vx = (Math.random(this.maxSpeed/2,this.maxSpeed));
            }
            document.getElementById('score').innerHTML = game.score;
            //transition background (needs work)
            if(game.score === 5){
               document.body.style.background = '#40a2d3';
            }
            return;
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

    
    ball.vy += game.gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;


    if (
        ball.x + ball.radius/2 > canvas.width ||
        ball.x-ball.radius/2  < 0 ){
      ball.vx *= -1;
    }

      if(
        ball.y - ball.radius > canvas.height
       ) {
      //GAME OVER
       alert("Game Over! Final Score: "+ game.score);
       resetGame();
       return;
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