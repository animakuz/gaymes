//--References to Visual Components
var infoBar= document.getElementById("info-bar");
var score  = document.getElementById("score");
var level  = document.getElementById("level");
var lives  = document.getElementById("lives");

var canvas = document.getElementById("pong-canvas");
var ctx    = canvas.getContext("2d");
var gameLoop; 

//--Base Data and Functions
var ball = {
  r    : 20,
  x    : 0,
  y    : 0,
  dx   : 0,
  dy   : 0,
  speed: 0,
  active: false,
  color : "#55f",
  reset : function() {  
    this.x = this.r;
    this.y = this.r;
    this.speed = 4;
    this.dx = this.speed;
    this.dy = this.speed;
    this.active = true;
  },
  move: function() {
    if (this.active) {
      //Change data thit represents position of ball
      this.x += this.dx;
      this.y += this.dy;

      //collisions
      if (this.x + this.r >= game.board.width || this.x - this.r <= 0) {
        //horizontal wall collisions
        this.dx *= -1;
      }

      if (this.y - this.r <= 0) {
        //top wall collision
        this.dy *= -1;
      }

      if (this.y + this.r >= game.board.height) {
        //pit drop = death
        game.death();
      }

      if (this.y + this.r >= paddle.y) {
        //paddle collision
        if (this.x > paddle.x && this.x < paddle.x + paddle.width) {
          this.dy *= -1;
          game.updateGameData();
        }
      }
    }
  },
  render: function() {
    if (this.active) {
      //update visual component of ball
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
      ctx.fill();
    }
  },
  speedUp: function() {
    //speed up ball
    this.speed += 1;
    this.dx = this.speed * (this.dx / Math.abs(this.dx));
    this.dy = this.speed * (this.dy / Math.abs(this.dy)); 
  },
  stop: function() {
    this.dx = 0;
    this.dy = 0;
    this.active = false;
  }
};

var paddle = {
  x : 0,
  y : 0,
  width: 100,
  height: 20,
  reset: function() {
    this.x = 0;
    this.y = game.board.height - this.height;
  },
  move: function(xPos) {
    //Change data that represents positon of paddle
    this.x = xPos - canvas.getBoundingClientRect().left - (this.width /2); 
  },
  render: function() {
    //update visual representation of paddle
    ctx.fillStyle = "#5f5";
    ctx.fillRect(this.x, this.y, this.width, this.width);
  }  
};
 
var game = {
  inPlay: false,
  score : 0,
  level : 0,
  lives : 0,
  reset : function () {
    this.inPlay = true;
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    
    //launch ball
    ball.reset();

    //set paddle
    paddle.reset();
  },
  board: {
    width : 500,
    height: 400   
  },
  updateGameData: function() {
    this.score += 1;

    if (this.score % 2 == 0) {
      //update speed and level ever 10 score updates
      this.level += 1;
      ball.speedUp();
    }

    score.innerHTML = this.score;
    level.innerHTML = this.level;
  },
  death: function() {
    //death when ball drops below pit line (bottom)
    ball.y = ball.r;
    game.lives -= 1;
    lives.innerHTML = game.lives;

    if (game.lives === 0) {
      game.over();
    }   
  },
  over: function() {
    //stop ball
    ball.stop();
 
    //show game over screen  
    //alert("Game Over");
  }
};

//--Game Update function
function initGame() {
  //launch game
  game.reset() ;

  //move paddle
  canvas.onmousemove = function(e) {
    paddle.move(e.clientX);
  };
 
  gameLoop = setInterval(function() {
    //refresh paint area
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, game.board.width, game.board.height);
    ball.move();
    ball.render();
    paddle.render();
  }, 32);
};

initGame();
  
