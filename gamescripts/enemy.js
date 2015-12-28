//---------------------------------------------------------------------------------------------------//
//-------------------------------------- Enemy Helpers ----------------------------------------------//
function updateEnemyMovement(){
    $(".enemy").each(function(){
        this.enemy.update($("#player"));
        var posx = $(this).x();
        var posy = $(this).y();
        var collided = $(this).collision("#playerBody,."+$.gQ.groupCssClass);
        if(collided.length > 0){
            if($("#player")[0].player.damage()){
                killPlayer($("#player"));
                $("#crosshair").remove();
                killcount = 0;
            }
        }
    });
}

function leftSpawn(){
    if(!gameOver && !bossWave){
        var posy = Math.random()*PLAYGROUND_HEIGHT;
        var name = "enemy1_"+Math.ceil(Math.random()*1000);
        $("#actors").addSprite(name, {animation: enemies[0]["idle"], posx: 0, posy: posy, width: PLAYER_WIDTH, height: PLAYER_HEIGHT});
        $("#"+name).addClass("enemy");
        $("#"+name)[0].enemy = new Enemy($("#"+name));
    }
}

