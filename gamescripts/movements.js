function smart_movement(enemy){

    var posx = enemy.node.x();
    var posy = enemy.node.y();
    var enemyPoint = [posx, posy];
    var playerPoint = PLAYER_POSITION;

    var distance_to_player = getDistance(enemyPoint, playerPoint);
    // Make line from enemy to player
    var m1 = getM(enemyPoint, playerPoint);
    var b1 = getB(enemyPoint, m1);

    // Line is y = (m1 * x) + b
    enemy.something_in_the_way = false;
    // Loop through Obstacles
    $(OBSTACLES).each(function(){
        var diagonals = getDiagonalsFromElement(this[0].obstacle.node[0].gameQuery);
        var lines = getOutlineOfElement(this[0].obstacle.node[0].gameQuery);
        var lines_to_check = diagonals.concat(lines);
        $(lines_to_check).each(function(){
            var m2 = getM(this[0], this[1]);
            var b2 = getB(this[0], m2);
            var point = linesIntersectAt(m1,b1,m2,b2);
            if(point){
                if(isPointInSegment(point, this[0], this[1])){
                    enemy.something_in_the_way = true;
                }
            }
        });
    });

    if(enemy.something_in_the_way == false){
        // CASE 1: Player is visible
        if(distance_to_player <= enemy.view_distance){ // <-- GENERATING UNINTENDED BEHAVIOR
            always_move_towards_player(enemy);
            enemy.player_last_seen_at = PLAYER_POSITION;
            enemy.player_seen_at_time = Date.now();
        } else {
            move_randomly(enemy);
        }
    } else {
        // CASE 2: Player has been seen recently
        if(Date.now() - enemy.player_seen_at_time < enemy.memory && enemyPoint != enemy.player_last_seen_at){
            //TODO: fix this goddamn shit
            move_towards_known_position(enemy, enemy.player_last_seen_at);
        } else {
            move_randomly(enemy);
        }
    }
}

function move_randomly(enemy){

    // define the variables we need to track
    var posx = enemy.node.x();
    var posy = enemy.node.y();
    var enemyPoint = [posx, posy];

    // here we overload the player_last_seen_at variable.
    var direction = (Math.random()*2*Math.PI*100)/100;

    // attempt to move
    var nextX = (Math.cos(direction) * enemy.speedx + posx);
    var nextY = (Math.sin(direction) * enemy.speedy + posy);
    attempt_movement(enemy, posx, posy, nextX, nextY);
}

function move_towards_known_position(enemy, position){
    // define the variables we need to track
    var posx = enemy.node.x();
    var posy = enemy.node.y();
    var enemyPoint = [posx, posy];
    var direction = getRadians(position, enemyPoint);

    // attempt to move
    var nextX = Math.round(Math.cos(direction) * enemy.speedx + posx);
    var nextY = Math.round(Math.sin(direction) * enemy.speedy + posy);
    attempt_movement(enemy, posx, posy, nextX, nextY);
}

function always_move_towards_player(enemy){
    // define the variables we need to track
    var posx = enemy.node.x();
    var posy = enemy.node.y();
    var enemyPoint = [posx, posy];
    var playerPoint = PLAYER_POSITION;
    var direction = getRadians(playerPoint, enemyPoint);

    // attempt to move
    var nextX = Math.round(Math.cos(direction) * enemy.speedx + posx);
    var nextY = Math.round(Math.sin(direction) * enemy.speedy + posy);
    attempt_movement(enemy, posx, posy, nextX, nextY);
}

function attempt_movement(enemy, posx, posy, nextX, nextY){
    // Define the direction x (left or right)
    if(nextX < posx){
        enemy.x_direction = -1;
    } else if(nextX > posx) {
        enemy.x_direction = 1;
    } else {
        enemy.x_direction = 0;
    }

    // Define the direction y (up or down)
    if(nextY < posy){
        enemy.y_direction = -1;
    } else if(nextY > posy){
        enemy.y_direction = 1;
    } else {
        enemy.y_direction = 0;
    }

    // attempt to move
    enemy.node.x(nextX);
    enemy.node.y(nextY);

    // check if the new position collides us into anything
    if(causedCollision(enemy)){
        // There was a collision
        // so try just moving in the y direciton
        enemy.node.x(posx);
        enemy.node.y(posy + (enemy.y_direction * enemy.speedy));
        if(causedCollision(enemy)){
            // That didn't work,
            // so try the x direction
            enemy.node.x(posx + (enemy.x_direction * enemy.speedx));
            enemy.node.y(posy);
            if(causedCollision(enemy)){
                // That didn't work either. We're stuck.
                // Revert the position
                enemy.node.x(posx);
                enemy.node.y(posy);
            }
        }
    }
}
