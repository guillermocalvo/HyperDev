// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery and Underscore
// Add other scripts at the bottom of index.html

$(function() {

  console.log('hello world :o');
  
  setInterval(step, 1000/60);

  $("canvas").on("mousemove", function(e) {
    var newY = event.pageY - $(this).offset().top;
    
    // paddle y + hard-coded paddle height can't exceed hard-coded canvas height
    if (newY + 60 <= 320) {
      paddleY = newY;
    }
  });
});

var score = 0;
var WIDTH = 480;
var HEIGHT = 320;

function step() {
  update();
  draw();
}

var t = 0;
var dt = 1/60;
function update() {
  t += dt;

  // TODO: Check collisions
  collisions();
  ballX += dt * speedX;
  ballY += dt * speedY;
}

function collisions() {
  paddleBallCollision();

  if (ballX > WIDTH) {
    speedX = -speedX;
    ballX += speedX * dt;
  }

  if (ballX < 0) {
    // you lose
    submitScore();
    ballX = WIDTH/2;
    ballY = HEIGHT/2;
    speedX = 70;
    speedY = 70;
    score = 0;
    // stop game; try again?
  }

  if (ballY > HEIGHT || ballY < 0) {
    speedY = -speedY;
    ballY += speedY * dt;
  }
}

function submitScore() {
  var initials = prompt("Enter your initials for the high score board!", "ABC");
  if (initials !== null) {
    $.post("/scores",{
      name: initials,
      score: score
    });
  }
}

function paddleBallCollision() {
  if(ballY >= paddleY && ballY <= paddleY + 60) {
    if(ballX >= 10 && ballX <= 30) {
      speedX = -(speedX * 1.1);
      ballX += speedX * dt;
      score += 1;
    }
  }
}

var paddleY = 0;
function drawPaddle(context) {
  context.fillStyle = "red";
  context.fillRect(10, paddleY, 20, 60);
}

var speedX = 200;
var speedY = 200;

var ballX = WIDTH/2;
var ballY = HEIGHT/2;
var ballRadius = 10;
var TAU = 2*Math.PI;
function drawBall(context) {
  context.fillStyle = "white";
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 0, TAU);
  context.stroke();
  context.fill();
}

function draw() {
  var canvas = $("canvas").get(0);
  var context = canvas.getContext("2d");

  context.fillStyle = "white";
  context.clearRect(0, 0, 480, 320);

  drawBall(context);
  drawPaddle(context);
}
