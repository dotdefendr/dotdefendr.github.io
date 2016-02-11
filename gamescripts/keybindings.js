//
//  This file contains keybindings OTHER than those
//  having to do with player movement.
//
//

// Handle special keys being pushed
$(document).keydown(function(e){

    if(gameOver){
        switch(e.keyCode){
            case 13: // enter
                $("#startbutton").trigger("click");
                break;
        }
    }
    if(e.keyCode == 27 || e.which == 27){ // Escape was pressed
        restartGame();
    }
    if(e.keyCode == 80){
        if(PAUSED == true){
            $.playground().resumeGame(function(){});
            $("#paused-screen").fadeOut(100);
            $("#paused-screen").remove();
            $("#playground").remove("#paused-screen");
            PAUSED = false;
        } else {
            $.playground().pauseGame(function(){});
            $("#playground").append("<div id='paused-screen'></div>");
            $("#paused-screen").height(PLAYGROUND_HEIGHT);
            $("#paused-screen").width(PLAYGROUND_WIDTH);
            $("#paused-screen").append("<div class='text-center'><h1>PAUSED</h1></div>");
            $("#paused-screen").fadeIn(100);
            PAUSED = true;
        }
    }
});

$(document).keyup(function(e){
});

// Handle crosshair updates
$(document).mousemove(function(e){
    if(!gameOver){
        e.preventDefault();
        updateCrosshair(e);
    }
});

// Handle stuff that happens within the playground
$("#playground").click(function(e){
    mouseDown = true;
    fire(e);
    mouseDown = false;
});

$("#playground").mousedown(function(e){
    // This function controls what
    // happens when the user clicks.
    mouseDown = true;
    fire_rate_timeout = setInterval(function(e){
        fire(e);
    }, FIRE_RATE);
});

$("#playground").mouseup(function(e){
    mouseDown = false;
    clearInterval(fire_rate_timeout);
});

$("#playground").mouseout(function(e){
    mouseDown = false;
    clearInterval(fire_rate_timeout);
});

// Make sure things arent accidentally clicked or selected
$("#hud").click(function(e){
    e.preventDefault();
});

$("#stats").click(function(e){
    e.preventDefault();
});

