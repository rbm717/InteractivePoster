//Moves player character based on key input
function movePlayer(coords){
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        if(coords.x > 30){
          coords.x -= moveBy;
        }
        break;
      case 'ArrowRight':
        if(coords.x < 320){
          coords.x += moveBy;
        }
        break;
      case 'ArrowUp':
        if(coords.y > 30){
          coords.y -= moveBy;
        }
        break;
      case 'ArrowDown':
        if(coords.y < 300){
          coords.y += moveBy;
        }
        break;
        }
  });
}


//Spawns projectile and plays sound
function moveProjectile(){
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Enter':
        if(bullets.length < maxBullets){
          firedOnce = true;
          bullets.push(new bullet);
          if(player == 0){
            hoho.play();
          }else if(player == 1){
            dirt.play();
          }else{
            splash.play();
          }
        }
        break;
    }
  });
}
