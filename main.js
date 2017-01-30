//pregame stuff
var startBox = document.getElementById('start');
startBox.addEventListener('click',startAction);
function startAction(e){
  requestAnimationFrame(step);
  document.getElementById('notification').style.display = "none";
  return false;
}

//game stuff
var canvas = document.getElementById('canvas');
var W = canvas.width = window.innerWidth;
var H = canvas.height = window.innerHeight;
var heroSize = Math.floor(W/4);
var cloudSize = W/9;
var ctx = canvas.getContext('2d');
canvas.addEventListener('click', action);
var clickDisabled = false;
var game = {
  score: 0,
  level: 1,
  buffer: 50,
  speed: 0.25,
  yDirection:1,
  gravity: 0.1,
  backgrounds: ['#66ccff', '#5cb7e5', '#52a3cc', '#478eb2', '#3d7a99'],
  backgroundi: 1
};
document.body.style.background = game.backgrounds[0];

var start = null;

//prerendering pig
var rendered = document.createElement('canvas');
rendered.width = Math.floor(heroSize * 2);
rendered.height = Math.floor(heroSize);

var renderedCtx = rendered.getContext('2d');
var pig = new Image();
pig.onload = function(){
  renderedCtx.drawImage(pig,0,0, rendered.width, rendered.height);
};
pig.src = 'sprite.png';

//prerendering cloud
var renderedCloud = document.createElement('canvas');
renderedCloud.width = Math.floor(cloudSize * 4);
renderedCloud.height = Math.floor(cloudSize*2);
var renderedCloudCtx = renderedCloud.getContext('2d');
renderedCloudCtx.beginPath();
renderedCloudCtx.arc(cloudSize*2, cloudSize, cloudSize, 0, 2 * Math.PI, false);
renderedCloudCtx.arc(cloudSize, cloudSize, cloudSize/1.3, 0, 2 * Math.PI, false);
renderedCloudCtx.arc(cloudSize*3, cloudSize, cloudSize/1.4, 0, 2 * Math.PI, false);
renderedCloudCtx.fillStyle = '#EEEEEE';
renderedCloudCtx.fill();




function Ball(){
  this.radius = heroSize;
  this.x = Math.floor(W / 2);
  this.y = H - this.radius;
  this.vy = null;
  this.sprite = 0;
  this.spriteSwitch = false;
  this.minSpeed = 0;
  this.maxSpeed = 2;
  this.vx = Math.random(this.minSpeed, this.maxSpeed);

  this.draw = function(ctx) {
      if(this.vy > 0 && this.spriteSwitch ){
         ctx.drawImage(rendered,this.radius,0,this.radius,this.radius,this.x,this.y, this.radius, this.radius);
      }else{
          this.sprite++;

         if(this.sprite % 16 === 0){
            this.spriteSwitch ^= true;
          }

        if(this.spriteSwitch){
          ctx.drawImage(rendered,this.radius,0,this.radius,this.radius,this.x,this.y, this.radius, this.radius);
          
        }else{
           ctx.drawImage(rendered,0,0,this.radius, this.radius,this.x,this.y, this.radius, this.radius);
        }
        

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
          y: 0 - cloudSize*2,
          d: Math.random()
        });
      }
  };
  this.move = function(){
    for(var i = 0; i< this.group.length; i++ ) {
      var item = this.group[i];
      item.y += 1;
      
      if( item.y - (cloudSize * 2) > H ) {
        this.group.splice(i, 1);
      }
    }
  };
  this.draw = function(){
    for(var i = 0; i< this.group.length; i++ ) {
      var item = this.group[i];
      ctx.drawImage(renderedCloud,0,0,cloudSize*4, cloudSize*2,item.x,item.y, cloudSize*4, cloudSize*2);
    }
  };
}

var clouds = new Clouds();


var resetGame = function(){
  ctx.clearRect(0, 0, W, H);
  document.getElementById('notification').style.display = "block";
  document.getElementById('your-score').innerHTML = "FINAL SCORE: " + game.score;
  game.score = 0;
  game.level = 1;
  game.gravity = 0.1;
  ball.vy = null;
  ball.x = canvas.width / 2 - ball.radius/2;
  ball.y = canvas.height - ball.radius;
  clouds.group.length = 0;
  ball.draw(ctx);
  document.getElementById('score').innerHTML = game.score;
  document.body.style.background = game.backgrounds[0];
};

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

function action(e){
    if(clickDisabled){return;}
    var eventLocation = getEventLocation(this,e);
    var hitBall = false;
    
    // Get the data of the pixel according to the location generate by the getEventLocation function
    var context = this.getContext('2d');
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
            //if youre resting on the ground
            if(!ball.vy){
              window.requestAnimationFrame(step);
                //can only click every 750ms
                clickDisabled = true;
                setTimeout(function(){clickDisabled = false;},750);
              return;
            }
            //otherwise its an in-game hit
            game.score ++;
            ball.vy *= -1;
            if(eventLocation.x >= (ball.x + 0.65 * ball.radius)){
              ball.vx = -(Math.random(this.maxSpeed/2,this.maxSpeed));
            }else if(eventLocation.x <= (ball.x + 0.35 * ball.radius)){
              ball.vx = (Math.random(this.maxSpeed/2,this.maxSpeed));
            }else{
              ball.vx = (Math.random(-(this.maxSpeed/2),this.maxSpeed/2));
            }
            document.getElementById('score').innerHTML = game.score;
            //transition background every 10 hits (needs work)
            if(game.score % 10 === 0){
               document.body.style.background = game.backgrounds[game.backgroundi];
               game.backgroundi++;
               if(game.backgroundi >= game.backgrounds.length){
                game.backgroundi = 0;
               }
            }
            //can only click every 750ms
            clickDisabled = true;
            setTimeout(function(){clickDisabled = false;}, 750);
            return;
    }
}


var step = function( timestamp ) {
  if (!start) start = timestamp;
  if(!ball.vy) ball.calculateVelocity(game);
  var progress = timestamp - start;
  
  ctx.clearRect(0, 0, W, H);

    
    ball.vy += game.gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;


    //change x direction if you hit a wall
    if (
        ball.x + ball.radius > canvas.width ||
        ball.x  < 0 ){
      ball.vx *= -1;
    }

    //game over if you drop off screen
    if(
        ball.y - ball.radius > canvas.height
       ) {
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
//window.requestAnimationFrame(step);
//resetGame();

