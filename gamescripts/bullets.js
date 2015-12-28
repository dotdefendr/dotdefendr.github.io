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
        if(posx > PLAYGROUND_WIDTH || posy > PLAYGROUND_HEIGHT){
            $(this).remove();
            return;
        }
        // Check if there was a collision
        var collided = $(this).collision(".enemy,."+$.gQ.groupCssClass);
        var collider = $(this);

        handleEnemyDamage(collided, collider, "playerBullet");

        // Figure out the next position
        var nextX = Math.round(Math.cos($(this)[0].bullet.direction) * BULLET_SPEED + posx);
        var nextY = Math.round(Math.sin($(this)[0].bullet.direction) * BULLET_SPEED + posy);

        // Move the bullet
        $(this).x(nextX);
        $(this).y(nextY);

    });

}
