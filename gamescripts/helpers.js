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
