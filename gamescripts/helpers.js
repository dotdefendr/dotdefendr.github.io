//-------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------- Helper Functions ------------------------------------------------------------------//


//---------------------------------------------------------------------------------------------------//
//----------------------------------------- Game general helpers ------------------------------------//
// Nice reboot function
function restartGame(){
    window.location.reload();
};

function updateUI(){
    var accuracy = Math.round((killcount/bulletCount)*100);
    if(!accuracy){
        accuracy = 0;
    }
    // Update the health
    $("#health").html("Health: "+$("#player")[0].player.health);
    // Update the stats
    $("#stats").html("<div class='text-center'>Kills: "+killcount+" Shots Fired: "+bulletCount+" Accuracy: "+accuracy+"%</div>");
    // Update lives
    $("#lives").html("<div class='pull-right'>Lives: "+$("#player")[0].player.replay+"</div>");

}

//---------------------------------------------------------------------------------------------------//
//----------------------------------------- Player helpers ------------------------------------------//
// Kill the player
function killPlayer(playerNode){
    playerNode.children().hide();

    // Add a "dead" animation
    playerNode.addSprite("dead", {animation: playerAnimation["dead"], width: 20, height: 20 });
    playerHit = true;
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
    if(!e.pageX && !e.pageY){
        mousePosition = MOUSE_POSITION;
    } else {
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
    e.preventDefault();
    if(!gameOver){
        updateCrosshair(e);
        var playerposx = $("#player").x();
        var playerposy = $("#player").y();
        bulletCount = (bulletCount + 1) % 100000;
        var name = "playerBullet_" + bulletCount;
        $("#playerBulletLayer").addSprite(name, {
            animation: bullet["player"],
            posx: playerposx + (PLAYER_WIDTH/2 - 2),
            posy: playerposy + (PLAYER_HEIGHT/2 - 2),
            width: 5,
            height: 5
        });
        $("#"+name).addClass("playerBullet");
        $("#"+name)[0].bullet = new Bullet($("#"+name));
        $("#"+name)[0].bullet.direction = CROSSHAIR_DIRECTION;
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
            gameOver = true;
            $("#playground").append("<div class='text-center'><h2>GAME OVER</h2></div><div class='text-center'><a href='#' id='restartbutton'>Try Again?</a></div>");
            $("#restartbutton").click(function(){
                restartGame();
            });
            $("#actors,#playerBulletLayer,#overlay").fadeTo(1000,0);
            $("#background").fadeTo(3000, 0);
        } else {
            playerHit = false;
        }
    }
}
//---------------------------------------------------------------------------------------------------//
//-------------------------------------- Enemy Helpers ----------------------------------------------//
function updateEnemyMovement(){
    $(".enemy").each(function(){
        this.enemy.update($("#player"));
        var posx = $(this).x();
        var posy = $(this).y();
        var collided = $(this).collision("#playerBody,."+$.gQ.groupCssClass);
        if(collided.length > 0){
            if($("#player")[0].player.damage()){
                killPlayer($("#player"));
                $("#crosshair").remove();
                killcount = 0;
            }
        }
    });
}

function leftSpawn(){
    if(!gameOver && !bossWave){
        var posy = Math.random()*PLAYGROUND_HEIGHT;
        var name = "enemy1_"+Math.ceil(Math.random()*1000);
        $("#actors").addSprite(name, {animation: enemies[0]["idle"], posx: 0, posy: posy, width: PLAYER_WIDTH, height: PLAYER_HEIGHT});
        $("#"+name).addClass("enemy");
        $("#"+name)[0].enemy = new Enemy($("#"+name));
    }
}

