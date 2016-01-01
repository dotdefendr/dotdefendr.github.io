

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

