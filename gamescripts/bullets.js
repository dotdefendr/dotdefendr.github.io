// This function updates the bullet movement.
//      For each bullet on the screen it does the following
//          Get the bullet position,
//          Make sure it's not outside the boundaries.
//          If it is, remove it.
//          Otherwise, do some trig to figure out where the next
//          position for the bullet is and move the bullet.
//
function updateBulletMovement(){
    $(".playerBullet").each(function(){
        // Get current position
        var posx = $(this).x();
        var posy = $(this).y();

        // Check if out of bounds
        if(posx < 0 || posx > PLAYGROUND_WIDTH || posy > PLAYGROUND_HEIGHT || posy < 0){
            $(this)[0].bullet.fired = false;
            $(this).fadeOut(0,0);
            return;
        }
        // Check if there was a collision
        var collided = $(this).collision(".enemy,."+$.gQ.groupCssClass);
        var collider = $(this);

        handleEnemyDamage(collided, "enemy", collider, "playerBullet");

        // Figure out the next position
        var nextX = Math.round(Math.cos($(this)[0].bullet.direction) * BULLET_SPEED + posx);
        var nextY = Math.round(Math.sin($(this)[0].bullet.direction) * BULLET_SPEED + posy);

        // Move the bullet
        $(this).x(nextX);
        $(this).y(nextY);

    });
}

// This function handles fire logic.
//
function fire(e){
    if(!gameOver){
        // First update the crosshair;
        updateCrosshair(e);

        // Next figure out the players position
        // This is where the bullet will go.
        var playerposx = $("#player").x() + (PLAYER_WIDTH - BULLET_SIZE)/2;
        var playerposy = $("#player").y() + (PLAYER_HEIGHT - BULLET_SIZE)/2;
        // Increment the bullet count and the current bullet index
        bulletCount = (bulletCount + 1);
        CURRENT_BULLET = Number(CURRENT_BULLET+1) % Number(MAX_BULLETS);

        // If a bullet has been out for longer than it should
        // take to cross the screen, reload it. It's buggy.
        var live_bullet = Number(BULLETS[CURRENT_BULLET][0].bullet.age()) < EXPIRATION;
        if(live_bullet == false){
            BULLETS[CURRENT_BULLET][0].bullet.birth = Date.now();
            BULLETS[CURRENT_BULLET][0].bullet.fired = false;
        }
        if(BULLETS[CURRENT_BULLET][0].bullet.fired == false){
            var fired_bullet = BULLETS[CURRENT_BULLET];
            $(fired_bullet)[0].bullet.index = CURRENT_BULLET;
            $(fired_bullet)[0].bullet.fired = true;
            $(fired_bullet)[0].bullet.birth = Date.now();
            $(fired_bullet).x(playerposx);
            $(fired_bullet).y(playerposy);
            $(fired_bullet)[0].bullet.direction = CROSSHAIR_DIRECTION;
            $(fired_bullet).fadeIn(0,1);
        }
    }
}
