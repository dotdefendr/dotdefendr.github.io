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
        if(collided_with_bullet.length > 0){
            // If the enemy collided with a bullet, the enemy is damaged.
            handleEnemyDamage(collider, "enemy", collided_with_bullet, "playerBullet");
        }
        // handle the players damage
        handlePlayerDamage($(this));

        // No collision so update the movement
        this.enemy.update($("#player"));
    });
}

// This function handles what happens when
// an enemy collides with a bullet.
function handleEnemyDamage(collided, collided_class, collider, collider_class){
    if(collided.length > 0){
        try {
            // For every bullet that has collided
            collided.each(function(){
                // if the bullet was fired
                if($(collider)[0].bullet.fired){
                    // and the enemy was killed
                    if($(this)[0].enemy.damage()){
                        // Increment stats
                        killcount++;
                        NUM_ENEMIES--;

                        flashEntity(this);
                        // Remove the bullet.
                        BULLETS[$(collider)[0].bullet.index][0].bullet.fired = false;
                        $(collider).fadeOut(0);

                        // Remove the enemy.
                        $(this).setAnimation(enemies[0]["dead"], function(node){$(node).remove();});
                        $(this).removeClass(collided_class);
                        $(this).fadeOut(3000,0).promise().done(function(){
                            $(this).remove();
                        });
                    }
                }
            });
        } catch(e){
            // We may not need this try/catch anymore.
            // But I'm leaving it here in case any bugs
            // try to creep in later.
            console.log(e.stack);
            // Enemy already dead
        }
    }
}

// This function spawns enemies from the left side of the screen only
function leftSpawn(){
    if(!gameOver && !bossWave){
        var push = 50;
        var pull = push / 2;
        var posy = Math.random()*(PLAYGROUND_HEIGHT - push)+pull;
        var name = "enemy1_"+Math.ceil(Math.random()*1000);

        //TODO: Implement some sort of type-defining code
        // so enemy types are determined before they are added,
        // and so attributes can be dynamically referenced.

        // but for now...
        var type = "grunt";

        $("#actors").addSprite(name, {animation: enemies[0]["alive"], posx: 0, posy: posy, width: ENEMY_DATA[type]["size"], height: ENEMY_DATA[type]["size"]});
        $("#"+name).addClass("enemy");
        $("#"+name)[0].enemy = new Enemy($("#"+name), type);
        $("#"+name)[0].enemy.type = type;

        while($("#"+name).collision(".obstacleBody,."+$.gQ.groupCssClass).length > 0){
            posy = Math.random()*(PLAYGROUND_HEIGHT - push) + pull;
            $("#"+name).y(posy);
        }

        while($("#"+name).collision(".enemy,."+$.gQ.groupCssClass).length > 0){
            posy = Math.random()*(PLAYGROUND_HEIGHT - push) + pull;
            $("#"+name).y(posy);
        }
    }
}

