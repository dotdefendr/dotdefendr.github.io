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
    var health_width = (PLAYGROUND_WIDTH / PLAYER_HEALTH) * $("#player")[0].player.health;
    $("#health").css({"width": health_width});
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

function flashEntity(entity){
    setTimeout(function(){
        $(entity).css({ 'box-shadow': '0 0 15px rgba(0,28,0, 0.3)', 'border-radius': '2em' });
    }, 20);
    $(entity).css({ 'box-shadow': '0 0 0px #fff' });
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
        $("#elapsedTime").text($("#timer").text());
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

            // Update the stats.
            $("#accuracy").text(ACCURACY+"%");
            $("#bulletCount").text(BULLET_COUNT);
            $("#killCount").text(KILL_COUNT);
            $("#elapsedTime").text($("#timer").text());

            var pushX = ($('#playground').width()/2) - ($("#paused-img").width()/2);
            $('#paused-img').css('left', pushX + 'px');


            // Center the resume button
            var pushX = ($('#playground').width()/2) - 5 - ($('#resumebutton').width()/2) - ($('#restartbutton').width());
            $('#resumebutton').css('left', pushX + 'px');
            $("#resumebutton").click(function(){
                resume();
            });

            // Center the fucking restart button
            $('#restartbutton').css('left', pushX + $('#resumebutton').width() + 10 + $('#restartbutton').width()/2 + 'px');
            $("#restartbutton").click(function(){
                restartGame();
            });

            // Fade in
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

// LINE EQUATION STUFF
function getM(point1, point2){
    return (point2[1]-point1[1])/(point2[0]-point1[0]);
}

function getB(point, slope){
    return point[1] - (slope * point[0]);
}

function linesIntersectAt(m1, b1, m2, b2){
    if(m1 == m2){
        return false;
    } else {
        var X = (b2 - b1)/(m1 - m2);
        var Y = (m2*X) + b2;
        return [X,Y];
    }
}

// FUNCTION ASSUMES POINT IS ON LINE.
// CHECK FOR INTERSECTION FIRST.
function isPointInSegment(point, start, end){
    var x = (Math.min(start[0], end[0]) <= point[0]) && (point[0] <= Math.max(start[0], end[0]));
    var y = (Math.min(start[1], end[1]) <= point[1]) && (point[1] <= Math.max(start[1], end[1]));
    return (x && y);
}

// Take a rectangle and return the diagonal
// lines made that connect opposing points
// through the center of the rectangle.
function getDiagonalsFromElement(element){
    // more variables but easier to code IMO.
    var p1 = [element.posx, element.posy];
    var p2 = [(element.posx + element.width), element.posy];
    var p3 = [element.posx, (element.posy + element.height)];
    var p4 = [(element.posx + element.width), (element.posy + element.height)];
    var diag1 = [p1, p4];
    var diag2 = [p2, p3];
    return [diag1, diag2];
}

function getOutlineOfElement(element){
    var p1 = [element.posx, element.posy];
    var p2 = [(element.posx + element.width), element.posy];
    var p3 = [element.posx, (element.posy + element.height)];
    var p4 = [(element.posx + element.width), (element.posy + element.height)];
    var l1 = [p1, p2];
    var l2 = [p1, p3];
    var l3 = [p4, p3];
    var l4 = [p4, p2];
    return [l1, l2, l3, l4];
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

function timerIncrement(){
    timer_seconds++;
    if(timer_seconds >= 60){
        timer_seconds = 0;
        timer_minutes++;
        if(timer_minutes >= 60){
            timer_minutes = 0;
            timer_hours++;
        }
    }
    var result = (timer_hours ? (timer_hours > 9 ? timer_hours : "0" + timer_hours) : "00") + ":" + (timer_minutes ? (timer_minutes > 9 ? timer_minutes : "0" + timer_minutes) : "00") + ":" + (timer_seconds > 9 ? timer_seconds : "0" + timer_seconds);
    $("#timer").html(result);
}
