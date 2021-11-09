let newRect = document.querySelector('.rect');
let moveBy = 5;

//Setup Variables
let canvasW = 400;
let canvasH = 500;
let adversaries = [];
let bullets = [];
var fr = 30;  //used to set framerates if issues arise

//Character Selection Setup
let img_electroDio;
let img_quinDiglett;
let img_cuffy;
let img_poster;
let img_dex;
let img_back;
let img_player;
let img_gameBoy;
let t;  //strings to print to screen
let dexFont;
let charSelectorY = 310, charSelectorWidth = 100, charSelectorHeight = 100;

//Customization Variables
var adversaryType = 0; //Used to determine opponents. 0 is electroDio, 1 is quinDiglett, 2 is Cuffy
var adversarySize = 50; //Determines size of adversary icons
var player = 0; //Used to determine player character. 0 is electroDio, 1 is quinDiglett, 2 is Cuffy
var playerSize = 50;  //Determines size of player icon

//Tracking Variables
var stage = 0; //Determines what stage program is in. 0 is select pokemon, 1 is confirm select, 2 is game
var lives = 5;  //How many enemies can make it past the player before they lose
var score = 0;
var highscore = 0;
var numEnemies = 5;
var maxBullets = 5;
var enemiesInitialized = false;
var firedOnce = false;

//Sound
let hoho;
let splash;
let dirt;
let song;

class coordinates{  //Starting coordinates for player, control movement (see: newf.js)
  constructor(){
    this.x = canvasW/2 - playerSize/2;
    this.y = 350 - playerSize;
  }
}


class adversary{
  constructor(){
    this.width = 50;
    this.height = 50;
    this.x = random((1.5)*this.width, canvasW - (1.5)*this.width);  //Ensures object not "spawned" out of bounds
    this.y = this.height;
    this.img;
    this.alive = true;
    this.movementRate = (1);
    if(adversaryType == 0){
      this.img = loadImage('ElectroDio.PNG');
    }else if(adversaryType == 1){
      this.img = loadImage('quinDiglett.png');
    }else if(adversaryType == 2){
      this.img = loadImage('cuffySwole.png');
    }
  }
  move(){
    //If unit is alive, moves them...
    if(this.alive == true){ 
      this.y += this.movementRate;
      if(this.y > 300){
        this.alive = false;
        lives--;
      }
    }else{  //Otherwise, spawns a new one at the top of the screen
      this.x = random((1.5)*this.width, canvasW - (1.5)*this.width);  //Ensures object not "spawned" out of bounds
      this.y = this.height;
      this.alive = true;
    }
  }

  display(){
    image(this.img, this.x, this.y, adversarySize, adversarySize);
  }
}

class bullet{
  constructor(){
    this.x = coords.x + playerSize/2;
    this.y = coords.y;
    this.size = 10;
    this.movementRate = 2;
  }
  move(){
    this.y -= this.movementRate;
  }

  display(){
    fill(0);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
  
}

function setup() {
  createCanvas(canvasW, canvasH);

  //Movement Setup
  coords = new coordinates; //Controls player movement
  projCoords = new coordinates; //Controls projectile movement

  //Loads images
  img_poster = loadImage('Poster.png');
  img_electroDio = loadImage('ElectroDio.PNG');
  img_quinDiglett = loadImage('quinDiglett.png');
  img_cuffy = loadImage('CuffySwole.png');
  img_dex = loadImage('Pokedex.png');
  img_back = loadImage('Back.PNG');
  img_gameBoy = loadImage('InteractiveBackground.png');
  dexFont = loadFont('digital-7 (mono).ttf');

  //Loads sounds
  hoho = loadSound('Dio Ho Ho.mp3');
  splash = loadSound('Splash.mp3');
  dirt = loadSound('Dirt.mp3');
  song = loadSound('CatchAFew.mp3');
  
  //Movement Execution
  frameRate(fr);
  movePlayer(coords);
  moveProjectile();
}

function draw() {
  background(220);
  //background(canvasW);
  //Character Selection
  if(stage == 0){
    image(img_poster, 0,0, canvasW, canvasH);
    image(img_electroDio, 30, charSelectorY, charSelectorWidth, charSelectorHeight);
    image(img_quinDiglett, 150, charSelectorY, charSelectorWidth, charSelectorHeight);
    image(img_cuffy, 270, charSelectorY, charSelectorWidth, charSelectorHeight);
  }

  //Confirm Character Selection
  if(stage == 1){
    image(img_dex, 0,0, canvasW, canvasH);
    if(player == 0){
      image(img_electroDio, 100,100,200, 200);
      image(img_back, 200,470, 20, 20);
      text(t, 20,410, 380, 450);
    }
    if(player == 1){
      image(img_quinDiglett, 100,100,200, 200);
      image(img_back, 200,470, 20, 20);
      text(t, 20,410, 380, 450);
    }
    if(player == 2){
      image(img_cuffy, 100,100,200, 200);
      image(img_back, 200,470, 20, 20);
      text(t, 20,410, 380, 450);
    }
  }

  //Minigame
  if(stage == 2){
    if(!song.isPlaying()){
      song.setVolume(0.25);
      song.play();
    }
    image(img_gameBoy, 0,0, canvasW, canvasH);
    var playerCharacter = image(img_player, coords.x, coords.y, playerSize, playerSize);

    //Tells player how to fire, then dissapears after player has fired once
    if(firedOnce == false){
      t = "[Press enter to fire]";
      text(t, 140,200);
    }

    t = "Lives: " + lives;
    text(t, 180,420);
    t = "Score: " + score;
    text(t, 180,440);
    t = "High Score: " + highscore;
    text(t, 180,460);

    //Moves enemies
    for(var i=0; i<numEnemies; i++){
      adversaries[i].move();
      adversaries[i].display();
    }

    //Moves bullets
    moreBullets = [];
    for(var i=0; i<bullets.length; i++){
      bullets[i].move();
      bullets[i].display();
      if(bullets[i].y > 30){
        moreBullets.push(bullets[i]);
      }
    }
    bullets = moreBullets;

    //Handles bullet collision
    for(var i=0; i<adversaries.length; i++){
      for(var j=0; j<bullets.length; j++){
        if(bullets[j].x > adversaries[i].x && 
          bullets[j].x < adversaries[i].x + adversaries[i].width &&
          bullets[j].y > adversaries[i].y &&
          bullets[j].y < adversaries[i].y + adversaries[i].height){
            adversaries[i].alive = false;
            bullets[j].y = 0;
            score += 100;
          }
      }
    }


    //Resets game if lives reach 0
    if(lives <= 0){
      stage = 0;
      if(score > highscore){
        highscore = score;
      }
      lives = 5;
      score = 0;
      for(var i=0; i<adversaries.length; i++){
        adversaries[i].y = this.height;
      }
      song.stop();
    }
  }
}

function mouseClicked(){
  //Handles character selection in stage 0
  if(stage == 0){
    textFont(dexFont);
    if(
      mouseX > 30 && //if the mouse is greather than 200 we're over the image
      mouseX < 30 + charSelectorWidth  && //if the mouse is less than 300 were over the image (since the image is at 200 and is 100 wide = 300)
      mouseY > charSelectorY && //same idea but on the vertical axis.
      mouseY < charSelectorY + charSelectorHeight
    ){
      player = 0;
      stage = 1;
      hoho.play();
      t = "ElectroDio, the electric ball pokemon. A special evolved form of an Electrode that has developed an unhealthy obession with Jojo's Bizarre Adventures. To confirm this pokemon as your starter, click on it. To go back, click the arrow below.";
    }
    if(
      mouseX > 150 && //if the mouse is greather than 200 we're over the image
      mouseX < 150 + charSelectorWidth  && //if the mouse is less than 300 were over the image (since the image is at 200 and is 100 wide = 300)
      mouseY > charSelectorY && //same idea but on the vertical axis.
      mouseY < charSelectorY + charSelectorHeight
    ){
      player = 1;
      stage = 1;
      dirt.play();
      t = "Quindig, the angry mole pokemon. Destruction of their habitat can lead some digletts to unprecedented levels of anger, and they take on this form to express their disapproval. To confirm this pokemon as your starter, click on it. To go back, click the arrow below.";
    }
    if(
      mouseX > 270 && //if the mouse is greather than 200 we're over the image
      mouseX < 270 + charSelectorWidth  && //if the mouse is less than 300 were over the image (since the image is at 200 and is 100 wide = 300)
      mouseY > charSelectorY && //same idea but on the vertical axis.
      mouseY < charSelectorY + charSelectorHeight
    ){
      player = 2;
      stage = 1;
      splash.play();
      t = "Cuffy, the buff cup pokemon. The cup of a former bodybuilder, the pure amount of protien the cup has held over the years gave it sentience, and now it too has aspirations of bodybuilding. To confirm this pokemon as your starter, click on it. To go back, click the arrow below.";
    }
  }


  //Confirmation of character selection
  if(stage == 1){
    if(
      mouseX > 100 && //if the mouse is greather than 200 we're over the image
      mouseX < 300 && //if the mouse is less than 300 were over the image (since the image is at 200 and is 100 wide = 300)
      mouseY > 100 && //same idea but on the vertical axis.
      mouseY < 300
    ){
      //If image was clicked on, confirm selection
      stage = 2;
      if(player == 0){
        adversaryType = 2;
        img_player = loadImage('ElectroDio.PNG');
      }else if(player == 1){
        adversaryType = 0;
        img_player = loadImage('quinDiglett.png');
      }else{
        adversaryType = 1;
        img_player = loadImage('CuffySwole.png');
      }
      //Sets up array of enemies
      adversaries = [];
      for(var i=0; i<numEnemies; i++){
        adversaries.push(new adversary);
      }
    }else if(
      mouseX > 200 && //if the mouse is greather than 200 we're over the image
      mouseX < 220 && //if the mouse is less than 300 were over the image (since the image is at 200 and is 100 wide = 300)
      mouseY > 470 && //same idea but on the vertical axis.
      mouseY < 490
    ){
      //Back button was clicked on, go back to stage 0
      stage = 0;
    }
  }
}

//no.
function printyay(){
  print("yay it works");
}
