// This function updates the enemy's movement.
//      For each enemy it does the following
//          Check if there was a collision with a bullet.
//          If there was, enemy is dead.
//          Check if there was a collision with the player.
//          If there was, then deal damage.
//          Otherwise update the enemy's position
//          based on the players current position.
function updateEnemyMovement(){
    $(".enemy").each(function(){
        // Check if there was a collision with a bullet
        var collided_with_bullet = $(this).collision(".playerBullet,."+$.gQ.groupCssClass);
        var collider = $(this);
        handleEnemyDamage(collided_with_bullet, "playerBullet", collider, "enemy");

        handlePlayerDamage($(this));

        // Update the movement
        this.enemy.update($("#player"));
    });
}

function handlePlayerDamage(enemy){
    // Check if there was a collision with the player
    var collided_with_player = $(enemy).collision("#playerBody,."+$.gQ.groupCssClass);
    if((collided_with_player.length > 0) && (player_damage_timeout > DAMAGE_RATE)){
        collided_with_player.each(function(){
            if($("#player")[0].player.damage()){
                killPlayer($("#player"));
                killcount = 0;
            }
            clearTimeout(player_damage_timeout);
        });
    }
    player_damage_timeout = setTimeout('handlePlayerDamage', DAMAGE_RATE);
    //$("#player").text(player_damage_timeout);
}

function handleEnemyDamage(collided, collided_class, collider, collider_class){
    if(collided.length > 0){
        collided.each(function(){
            if($(this)[0].enemy.damage()){
                killcount++;
                NUM_ENEMIES--;
                $(this).setAnimation(enemies[0]["dead"], function(node){$(node).remove();});
                $(this).removeClass(collided_class);
                collider.removeClass(collider_class);
                collider.remove();
                $(this).fadeTo(3000,0).done(function(){
                    $(this).remove();
                });
            }
        });
        $(this).removeClass("playerBullet");
        $(this).remove();
    }
}

// This function spawns enemies from the left side of the screen only
function leftSpawn(){
    if(!gameOver && !bossWave){
        var posy = Math.random()*PLAYGROUND_HEIGHT;
        var name = "enemy1_"+Math.ceil(Math.random()*1000);
        $("#actors").addSprite(name, {animation: enemies[0]["idle"], posx: 0, posy: posy, width: PLAYER_WIDTH, height: PLAYER_HEIGHT});
        $("#"+name).addClass("enemy");
        $("#"+name)[0].enemy = new Enemy($("#"+name));
    }
}

