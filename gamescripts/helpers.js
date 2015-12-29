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
