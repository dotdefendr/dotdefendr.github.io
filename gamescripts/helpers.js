//
//  This file just has a bunch of helper
//  functions. Most of it will probably
//  be categorized and moved later.
//


// Nice reboot function
function restartGame(){
    window.location.reload();
};

// Function to update the user interface.
function updateUI(){
    // Update the accuracy.
    var accuracy = Math.round((killcount/bulletCount)*100);
    // Handle the accuracy coming back as "undefined" or "infinity"
    if(!accuracy){
        accuracy = 0;
    } else if(accuracy > 100){
        accuracy = 100;
    }

    // Update persistant variables
    ACCURACY = accuracy;
    KILL_COUNT = killcount;
    BULLET_COUNT = bulletCount;

    // Update the actual hud

    // Update the health
    $("#health").html("Health: "+$("#player")[0].player.health);
    // Update the stats
    $("#stats").html("<div class='text-center'>Kills: "+killcount+" Shots Fired: "+bulletCount+" Accuracy: "+accuracy+"%</div>");
    // Update lives
    $("#lives").html("<div class='pull-right'>Lives: "+$("#player")[0].player.replay+"</div>");

}

// Flash the screen if the player dies
function flashScreen(){
    $("#playground").append("<div id='flash'></div>");
    $("#flash").height(PLAYGROUND_HEIGHT);
    $("#flash").width(PLAYGROUND_WIDTH);
    $("#flash").fadeIn(FLASH_SPEED).fadeOut(FLASH_SPEED);
    $("#playground").remove("#flash");
}

// Show this screen if the game is over.
function endGameScreen(){
    $("#actors,#playerBulletLayer,#overlay,#obstacles").fadeOut(1000);
    $("#background").fadeOut(3000);
    gameOver = true;
    var template = "";
    $.ajax({
        url: "gamescripts/templates/endgame.html",
        type: 'get',
        async: true,
        success: function(html){
            $("#playground").append(html);
        }
    }).done(function(){
        $("#accuracy").text(ACCURACY+"%");
        $("#bulletCount").text(BULLET_COUNT);
        $("#killCount").text(KILL_COUNT);
        // Center the start button
        var pushX = ($('#playground').width()/2) - ($('#restartbutton').width()/2);
        $('#restartbutton').css('left', pushX + 'px');
        $("#restartbutton").click(function(){
            restartGame();
        });

    });
}

// Show this screen on pause
function pausedScreen(){
    if(PAUSED == true){
        resume();
    } else {
        $.playground().pauseGame(function(){});
        $.ajax({
            url: "gamescripts/templates/pause.html",
            type: 'get',
            async: true,
            success: function(html){
                $('#playground').append(html);
            }
        }).done(function(){
            $("#paused-screen").height(PLAYGROUND_HEIGHT);
            $("#paused-screen").width(PLAYGROUND_WIDTH);

            $("#accuracy").text(ACCURACY+"%");
            $("#bulletCount").text(BULLET_COUNT);
            $("#killCount").text(KILL_COUNT);

            // Center the start button
            var pushX = ($('#playground').width()/2) - ($('#resumebutton').width()/2);
            $('#resumebutton').css('left', pushX + 'px');
            $("#resumebutton").click(function(){
                resume();
            });

            $("#paused-screen").fadeIn(100);
            PAUSED = true;
        });
    }
}

function resume(){
    $.playground().resumeGame(function(){});
    $("#paused-screen").fadeOut(100);
    $("#paused-screen").remove();
    $("#playground").remove("#paused-screen");
    PAUSED = false;
}

// take 2 [x,y] coordinates and returns
// then angle between them in radians.
function getRadians(point1, point2){
    var dx = point1[0] - point2[0];
    var dy = point1[1] - point2[1];
    return Math.atan2(dy, dx);
}

// Takes 2 [x,y] coordinates and returns
// the distance between them.
function getDistance(point1, point2){
    var dx = point1[0] - point2[0];
    var dy = point1[1] - point2[1];
    return Math.floor(Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2)));
}

// lets you know if a coordinate is out of bounds
function isOutOfBounds(x,y){
    if(x < 0){
        return true;
    } else if(x > PLAYGROUND_WIDTH){
        return true;
    } else if(y < 0){
        return true;
    } else if(y > PLAYGROUND_HEIGHT){
        return true;
    } else {
        return false;
    }
}

function causedCollision(playerNode){
    var collided = playerNode.node.collision(".obstacleBody,."+$.gQ.groupCssClass);
    var collided_with_another_enemy = playerNode.node.collision(".enemy,."+$.gQ.groupCssClass);
    if(collided.length > 0 || collided_with_another_enemy.length > 0){
        return true;
    }
    return false;
}

function countBulletsForLog(){
    console.log(CURRENT_BULLET)
    console.log(BULLETS[CURRENT_BULLET][0].bullet.fired);
}
