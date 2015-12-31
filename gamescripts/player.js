//---------------------------------------------------------------------------------------------------//
//----------------------------------------- Player helpers ------------------------------------------//
// Kill the player
function killPlayer(playerNode){
    playerNode.children().hide();

    // Add a "dead" animation
    playerNode.addSprite("dead", {animation: playerAnimation["dead"], width: 20, height: 20 });
    playerHit = true;
    invincible = true;
    flashScreen();
};

function updateCrosshair(e){
    // To figure out the mouse position,
    // we need somewhere to store it,
    // and the offset of the containing <div>
    var mousePosition = [];
    var playerPosition = [$('#player').x() + (PLAYER_WIDTH/2), $('#player').y() + (PLAYER_HEIGHT/2)];
    var offset = $("#playground").offset();

    // Get the current mouse position with respect to
    // the playground <div>. If the mouse position
    // wasn't given in this event, load it from
    // a previous value.
    if(!e){
        mousePosition = MOUSE_POSITION;
    }
    else if(!e.pageX && !e.pageY){
        mousePosition = MOUSE_POSITION;
    }
    else {
        mousePosition = [
            e.pageX - offset.left,
            e.pageY - offset.top
        ];
    }

    // Now get the magnitude and direction.
    var distance = getDistance(mousePosition, playerPosition);
    var rad = getRadians(mousePosition, playerPosition);

    // Update the semi-persistent data
    PLAYER_POSITION = playerPosition;
    MOUSE_POSITION = mousePosition;
    CROSSHAIR_DIRECTION = rad;

    // calculate the new coordinates
    var newX;
    var newY;
    if(distance <= MAX_CROSSHAIR_DISTANCE){
        newX = mousePosition[0];
        newY = mousePosition[1];
    } else {
        newX = Math.round(Math.cos(rad) * MAX_CROSSHAIR_DISTANCE + playerPosition[0]);
        newY = Math.round(Math.sin(rad) * MAX_CROSSHAIR_DISTANCE + playerPosition[1]);
    }

    // Adjust the crosshair
    try{
        $("#crosshair").x(newX - CROSSHAIR_WIDTH/2);
        $("#crosshair").y(newY - CROSSHAIR_HEIGHT/2);
    } catch(TypeError){
    }
}

function getRadians(point1, point2){
    var dx = point1[0] - point2[0];
    var dy = point1[1] - point2[1];
    return Math.atan2(dy, dx);
}

function getDistance(point1, point2){
    var dx = point1[0] - point2[0];
    var dy = point1[1] - point2[1];
    return Math.floor(Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2)));
}


function fire(e){
    if(!gameOver){
        updateCrosshair(e);

        var playerposx = $("#player").x() + (PLAYER_WIDTH - BULLET_SIZE)/2;
        var playerposy = $("#player").y() + (PLAYER_HEIGHT - BULLET_SIZE)/2;
        bulletCount = (bulletCount + 1);
        CURRENT_BULLET = Number(CURRENT_BULLET+1) % Number(MAX_BULLETS);
        var expired = (Number(new Date) - Number(BULLETS[CURRENT_BULLET][0].bullet.age)) > EXPIRATION;
        countBulletsForLog();
        if(!BULLETS[CURRENT_BULLET][0].bullet.fired){
            var fired_bullet = BULLETS[CURRENT_BULLET];
            $(fired_bullet)[0].bullet.fired = true;
            $(fired_bullet)[0].bullet.age = new Date;
            $(fired_bullet).x(playerposx);
            $(fired_bullet).y(playerposy);
            $(fired_bullet)[0].bullet.direction = CROSSHAIR_DIRECTION;
            $(fired_bullet).fadeIn(0,1);
        }
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

$("#restartbutton").click(function(){
    restartGame();
});
