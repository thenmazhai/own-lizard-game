const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const Constraint = Matter.Constraint;
const MouseConstraint = Matter.MouseConstraint;

var engine, world;
var bgImg, starImg;
var player;

var sling;
var playerImg;

var bgPosX = 425;
var bgPosY = 235;

var gameState = "initial";
var score = 0;
var starsCount = 0;
var invisibleUpperWall;
var lives = 3;
var highScore = 900;
 
var points = [
  { x: 400, y: 200, isAttached: true },
  { x: 600, y: 100, isAttached: false },
  { x: 650, y: 300, isAttached: false },
  { x: 800, y: 180, isAttached: false }
];

var stars = [
  { x: 650, y: 200 },
  { x: 700, y: 50 }
];

function preload() {
  bgImg = loadImage("assets/wall1.jpg");
  starImg = loadImage("assets/fly.png");
  playerImg = loadImage("assets/player.png");
  player2Img = loadImage("assets/player2.png");
  player3Img = loadImage("assets/player3.png");
  song = loadSound("assets/bg.mp3");
  gameOverSound = loadSound("assets/fall.mp3");
}

function setup() {
  createCanvas(950, 470);
  engine = Engine.create();
  world = engine.world;

  player = new Player(100, 250, 70, 70, playerImg);

  sling = new Sling(points[0], player.body);

  invisibleUpperWall = new Player(425,15,1050,10);
  Body.setStatic(invisibleUpperWall.body, true);

  var mouseObject = Mouse.create(canvas.elt);
  let options = {
    mouse: mouseObject
  };
  var mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint);
}

function draw() {
  background(bgImg);

  Engine.update(engine);
  if(gameState === "play"){
    resetBackground();
  }

  sling.display();
  player.display();

  handlePoints();
  handleStars();
  scoreBoard();
  addPoints();
  addStars();

  if(gameState === "initial"){
    textSize(20);
    stroke("black");
  strokeWeight(1);
    fill("green");
    text("SLING TO START", 325, 150);
    if(mouseIsPressed){
      gameState = "play";
      song.setVolume(0.1);
      song.play();
    }
  }
  if(player.body.position.y > 500 && lives > 0){

    lives -=1;
    points[0].isAttached = true;
    sling.attach(points[0], player.body);
  
  }

  if(lives === 0){
    gameState = "end";
  }

  if(gameState === "end"){
    restartGame();
  }
  if(score >= highScore){
    gameState = "win";
  }
  if(gameState === "win"){
    //player.changeImage(player3Img);
    textSize(20);
    text("YOU WIN", 325, 130);
    textSize(17);
    text("Refresh the page to replay", 270,160);
    
  }
}

function mouseReleased() {
  setTimeout(() => {
    sling.fly();
  }, 70);
}

function drawPoints(i) {
  push();
  stroke("black");
  strokeWeight(3);
  ellipseMode(RADIUS);
  fill("red");
  ellipse(points[i].x, points[i].y, 10, 10);
  pop();
}

function drawStars(i) {
  push();
  imageMode(CENTER);
  image(starImg, stars[i].x, stars[i].y, 50, 50);
  pop();
}

function addPoints() {
  if (points.length < 5) {
    points.push({
      x: random(800, 1150),
      y: random(80, 300),
      isAttached: false
    });
  }
}

function addStars() {
  if (stars.length < 4) {
    stars.push({
      x: random(800, 1300),
      y: random(50, 300)
    });
  }
}

function handlePoints() {
  for (let i = 0; i < points.length; i++) {
    drawPoints(i);
    if(gameState === "play"){
    // Move the points
      points[i].x -= 0.3;
    }
    var collided = player.overlap(points[i].x, points[i].y, 20, 20);

    if (collided && !points[i].isAttached) {
      for (var j = 0; j < points.length; j++) {
        if (points[j].isAttached) {
          points[j].isAttached = false;
        }
      }
      
      sling.attach(points[i], player.body);
      points[i].isAttached = true;
      score += 50;
    }

    if (points[i].x < 60) {
      if (points[i].isAttached) {
        sling.fly();
      }
      points.shift();
    }
  }
}

function handleStars() {
  for (let i = 0; i < stars.length; i++) {
    drawStars(i);
    if(gameState === "play"){
      stars[i].x -= 0.3;
    }
    if (stars[i].x < 60) {
      stars.shift();
    }
    var starsCollected = player.overlap(stars[i].x, stars[i].y, 50,50);
    if(starsCollected){
      starsCount += 1;
      score += 50;
      stars.splice(i,1);
    }
  }
}

function resetBackground() {
  push();
  imageMode(CENTER);
  image(bgImg, bgPosX, bgPosY, 1900, 470);
  pop();
  bgPosX -= 0.3;

  if (bgPosX < 0) {
    bgPosX = 425;
  }
}

function scoreBoard(){
  textSize(17);
  text("Stars: " + starsCount, 30, 45);
  text("Lives: " + lives, 130, 45); 
  text("Score: " + score, 230, 45); 

}

function restartGame() {
  textSize(20);
  text("GAME OVER", 400, 130);
  textSize(16);
  text("Press space to restart the game", 350, 160);
  //player.changeImage(player2Img);
  gameOverSound.play();

  points = [
    { x: 400, y: 200, isAttached: true },
    { x: 600, y: 50, isAttached: false },
    { x: 650, y: 300, isAttached: false },
    { x: 800, y: 180, isAttached: false }
  ];

  starts = [
    { x: 650, y: 200 },
    { x: 700, y: 50 }
  ];

  lives = 3;
  score = 0;
  starsCount = 0;
  sling.attach(points[0], player.body);

  if(keyIsDown(32)){
    gameState = "initial";
    player.changeImage(playerImg);
  }
}

