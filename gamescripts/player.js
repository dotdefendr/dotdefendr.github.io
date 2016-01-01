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

function updatePlayerMovement(){
    // Update the player's movement
    if(!playerHit){
        var speed = $("#player")[0].player.speed;
        $("#player")[0].player.update();

        // a - left
        if(jQuery.gameQuery.keyTracker[65]){
            var current = $("#player").x();
            var next = current - speed;
            if(next > 0){
                $("#player").x(next);
            }
        }

        // d - right
        if(jQuery.gameQuery.keyTracker[68]){
            var current = $("#player").x();
            var next = current + speed;
            if(next < $("#playground").width() - PLAYER_WIDTH){
                $("#player").x(next);
            }
        }

        // w - up
        if(jQuery.gameQuery.keyTracker[87]){
            var current = $("#player").y();
            var next = current - speed;
            if(next > 0){
                $("#player").y(next);
            }
        }

        // s - down
        if(jQuery.gameQuery.keyTracker[83]){
            var current = $("#player").y();
            var next = current + speed;
            if(next < $("#playground").height() - PLAYER_HEIGHT){
                $("#player").y(next);
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
