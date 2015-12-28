function updateBulletMovement(){
    // Update bullet movement
    $(".playerBullet").each(function(){
        var posx = $(this).x();
        var posy = $(this).y();
        if(posx > PLAYGROUND_WIDTH || posy > PLAYGROUND_HEIGHT){
            $(this).remove();
            return;
        }
        var nextX = Math.round(Math.cos($(this)[0].bullet.direction) * BULLET_SPEED + posx);
        var nextY = Math.round(Math.sin($(this)[0].bullet.direction) * BULLET_SPEED + posy);

        $(this).x(nextX);
        $(this).y(nextY);

        var collided = $(this).collision(".enemy,."+$.gQ.groupCssClass);
        var temp = $(this);
        if(collided.length > 0){
            collided.each(function(){
                if($(this)[0].enemy.damage()){
                    killcount++;
                    NUM_ENEMIES--;
                    $(this).setAnimation(enemies[0]["dead"], function(node){$(node).remove();});
                    $(this).removeClass("enemy");
                    temp.removeClass("playerBullet");
                    temp.remove();
                    $(this).fadeTo(3000,0).done(function(){
                        $(this).remove();
                    });
                }
            });
            $(this).removeClass("playerBullet");
            $(this).remove();
        }
    });

}
