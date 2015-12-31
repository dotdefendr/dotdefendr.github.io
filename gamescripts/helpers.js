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

function flashScreen(){
    $("#playground").append("<div id='flash'></div>");
    $("#flash").height(PLAYGROUND_HEIGHT);
    $("#flash").width(PLAYGROUND_WIDTH);
    $("#flash").fadeIn(FLASH_SPEED).fadeOut(FLASH_SPEED);
    $("#playground").remove("#flash");
}

function endGameScreen(){
    $("#actors,#playerBulletLayer,#overlay").fadeTo(1000,0);
    $("#background").fadeTo(3000, 0);
    gameOver = true;
    var template = "";
    $.ajax({
        url: "gamescripts/templates/endgame.html",
        type: 'get',
        async: true,
        success: function(html){
            $("#playground").append(html);
        }
    });
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

function countBulletsForLog(){
    console.log(CURRENT_BULLET)
    console.log(BULLETS[CURRENT_BULLET][0].bullet.fired);
}

$("#restartbutton").click(function(){
    restartGame();
});
