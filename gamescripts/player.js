//---------------------------------------------------------------------------------------------------//
//----------------------------------------- Player helpers ------------------------------------------//
// Kill the player
function killPlayer(playerNode){
    playerNode.children().hide();

    // Add a "dead" animation
    playerNode.addSprite("invincible", {animation: playerAnimation["invincible"], width: 20, height: 20 });
    playerHit = true;
    invincible = true;
    flashScreen();
};

function handlePlayerDamage(enemy){
    // Check if there was a collision with the player
    var collided_with_player = $(enemy).collision("#playerBody,."+$.gQ.groupCssClass);
    // if an enemy has collided with the player, inflict damage.
    // Kill the player if they run out of health.
    if(collided_with_player.length > 0){
        collided_with_player.each(function(){
            if($("#player")[0].player.damage()){
                killPlayer($("#player"));
            }
        });
    }
}

function onCollisionResetPositionTo(posx, posy){
    if($("#player").collision(".obstacleBody,."+$.gQ.groupCssClass).length > 0){
        $("#player").x(posx);
        $("#player").y(posy);
    }
}

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
            // Make sure the player is both in bounds, and
            // hasn't collided with a building

            if(!isOutOfBounds(next, currenty)){
                $("#player").x(next);
                onCollisionResetPositionTo(currentx, currenty);
            }
        }

        // d - right
        if(jQuery.gameQuery.keyTracker[68]){
            var currentx = $("#player").x();
            var currenty = $("#player").y();
            var next = currentx + speed;
            // Make sure the player is both in bounds, and
            // hasn't collided with a building
            if(!isOutOfBounds(next + PLAYER_WIDTH, currenty)){
                $("#player").x(next);
                onCollisionResetPositionTo(currentx, currenty);
            }
        }

        // w - up
        if(jQuery.gameQuery.keyTracker[87]){
            var currentx = $("#player").x();
            var currenty = $("#player").y();
            var next = currenty - speed;
            // Make sure the player is both in bounds, and
            // hasn't collided with a building
            if(!isOutOfBounds(currentx, next)){
                $("#player").y(next);
                onCollisionResetPositionTo(currentx, currenty);
            }
        }

        // s - down
        if(jQuery.gameQuery.keyTracker[83]){
            var currentx = $("#player").x();
            var currenty = $("#player").y();
            var next = currenty + speed;
            // Make sure the player is both in bounds, and
            // hasn't collided with a building
            if(!isOutOfBounds(currentx, next + PLAYER_HEIGHT)){
                $("#player").y(next);
                onCollisionResetPositionTo(currentx, currenty);
            }
        }
    } else {
        if($("#player")[0].player.respawn()){
            endGameScreen();
        }
        playerHit = false;
        invincible = false;
        $("#player").addSprite("idle", {animation: playerAnimation["idle"], width: 20, height: 20 });
        $("#player").children().show();
        $("#player").x(PLAYGROUND_WIDTH/2);
        $("#player").y(PLAYGROUND_HEIGHT/2);

    }
}
