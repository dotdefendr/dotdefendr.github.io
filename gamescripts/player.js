function updatePlayerMovement(){
    // Update the player's movement
    if(!playerHit){
        var speed = $("#player")[0].player.speed;
        $("#player")[0].player.update();

        // a - left
        if(jQuery.gameQuery.keyTracker[65]){
            var currentx = $("#player").x();
            var currenty = $("#player").y();
            var next = currentx - speed;
            directionUpdate(currentx, currenty, next, currenty, 0, 0);
        }

        // d - right
        if(jQuery.gameQuery.keyTracker[68]){
            var currentx = $("#player").x();
            var currenty = $("#player").y();
            var next = currentx + speed;
            directionUpdate(currentx, currenty, next, currenty, PLAYER_WIDTH, 0);
        }

        // w - up
        if(jQuery.gameQuery.keyTracker[87]){
            var currentx = $("#player").x();
            var currenty = $("#player").y();
            var next = currenty - speed;
            directionUpdate(currentx, currenty, currentx, next, 0, 0);
        }

        // s - down
        if(jQuery.gameQuery.keyTracker[83]){
            var currentx = $("#player").x();
            var currenty = $("#player").y();
            var next = currenty + speed;
            directionUpdate(currentx, currenty, currentx, next, 0, PLAYER_HEIGHT);
        }
    } else {
        if($("#player")[0].player.respawn()){
            endGameScreen();
        }
        playerHit = false;
        $("#player").children().show();
        $("#player").x(PLAYGROUND_WIDTH/2);
        $("#player").y(PLAYGROUND_HEIGHT/2);
    }
    if(timeOfRespawn < Date.now() - INVINCIBLE){
        invincible = false;
        $("#playerBody").setAnimation(playerAnimation["idle"]);
    }
}


// This is how the player handles collisions with
// obstacles. First it moves to the location, then
// moves back if a collision was caused.
function onCollisionResetPositionTo(posx, posy){
    if($("#player").collision(".obstacleBody,."+$.gQ.groupCssClass).length > 0){
        $("#player").x(posx);
        $("#player").y(posy);
    }
}

// Takes the current x and y position,
// the next x and y position, and the
// offset of the image (to prevent going
// out of bounds when moving right, or down).
function directionUpdate(posx, posy, nextx, nexty, offsetx, offsety){
    // Make sure the player is both in bounds, and
    // hasn't collided with a building
    if(!isOutOfBounds(nextx + offsetx, nexty + offsety)){
        $("#player").x(nextx);
        $("#player").y(nexty);
        onCollisionResetPositionTo(posx, posy);
    }
}

// Kill the player
function killPlayer(playerNode){
    playerNode.children().hide();
    // Add a "dead" animation
    $("#playerBody").setAnimation(playerAnimation["invincible"]);
    playerHit = true;
    invincible = true;
    timeOfRespawn = Date.now();
    flashScreen();
    playerNode.children().show();
};

// Enemy inflicts damage on the player
// by running into them.
function handlePlayerDamage(enemy){
    // Check if there was a collision with the player
    var collided_with_player = $(enemy).collision("#playerBody,."+$.gQ.groupCssClass);
    // if an enemy has collided with the player, inflict damage.
    // Kill the player if they run out of health.
    if(collided_with_player.length > 0){
        collided_with_player.each(function(){
            stressPulse();
            if($("#player")[0].player.damage()){
                killPlayer($("#player"));
            }
        });
    }
}
