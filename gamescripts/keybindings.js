//--------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------- Keybindings ---------------------------------------------------------//

$(document).keydown(function(e){
    if(!gameOver){
        switch(e.keyCode){
            case 13: // enter
                $("#startbutton").trigger("click");
                break;
            case 27:
                restartGame();
                break;
        }
    }
});

$(document).keyup(function(e){
});

$(document).mousemove(function(e){
    if(!gameOver){
        e.preventDefault();
        updateCrosshair(e);
    }
});

$("#hud").click(function(e){
    e.preventDefault();
});

$("#stats").click(function(e){
    e.preventDefault();
});

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
//--------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------//
