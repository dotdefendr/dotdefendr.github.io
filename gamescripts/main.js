/*
 *  This is DOT DEFENDR!
 *
 *  You are a dot.
 *  defend yourself.
 *
 *  controls are WASD
 *  aim and shoot using the mouse.
 *
 *
 *
 *  it will be a pretty cool game.
 *
 */


//-------------------------------------------------------------------------------------------------------------------------------//
//  Load all the other scripts we need
//
//  These scripts should contain functions only. variables do not get transfered.
//  Any variables should be included with a <script src='path/to/variable/file.js'></script> tag.
//
//-------------------------------------------------------------------------------------------------------------------------------//
function loadScripts(){
    $.getScript("gamescripts/keybindings.js");
    $.getScript("gamescripts/helpers.js");
}
loadScripts();

//-------------------------------------------------------------------------------------------------------------------------------//
//
//
//          MAIN FRIGGIN DECLARATION
//
//-------------------------------------------------------------------------------------------------------------------------------//
$(function(){

    //-------------------------------------- Assign and initialize images ---------------------------------------------//
    //-----------------------------------------------------------------------------------------------------------------//
    // Create the backgrounds
    var background1 = new $.gQ.Animation({imageURL: "img/bg_concrete.png"});
    var background2 = new $.gQ.Animation({imageURL: "img/bg_concrete.png"});

    // Player Animations
    playerAnimation["idle"] = new $.gQ.Animation({imageURL: "img/player.png"});
    playerAnimation["dead"] = new $.gQ.Animation({imageURL: "img/player_dead.png"});

    // Enemy Animations
    enemies[0] = new Array();
    enemies[0]["idle"] = new $.gQ.Animation({imageURL: "img/grunt_enemy.png"});//, numberOfFrame: 5, delta: 52, rate: 60, type: $.gQ.ANIMATION_VERTICAL});
    enemies[0]["dead"] = new $.gQ.Animation({imageURL: "img/grunt_enemy_dead.png"});//, numberOfFrame: 5, delta: 52, rate: 30, type: $.gQ.ANIMATION_VERTICAL | $.gQ.ANIMATION_CALLBACK});

    // Bullet Animations
    bullet["player"] = new $.gQ.Animation({imageURL: "img/bullet.png"});//, numberOfFrame: 6, delta: 10, rate: 90, type: $.gQ.ANIMATION_VERTICAL});

    crosshair["aim"] = new $.gQ.Animation({imageURL: "img/crosshair_complex.png"});

    //--------------------------------- Place everything within the playground -------------------------------------------//
    //--------------------------------------------------------------------------------------------------------------------//

    // Initialize the 'playground' element with a default width and height,
    // and all the elements it contains.
    $("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH, keyTracker: true});

    $.playground().addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
        .addSprite("background1", {animation: background1, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
        .addSprite("background2", {animation: background2, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH})
    .end()
    .addGroup("playerBulletLayer", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
    .addGroup("actors", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
        .addGroup("player", {posx: PLAYGROUND_WIDTH/2, posy: PLAYGROUND_HEIGHT/2, width: PLAYER_WIDTH, height: PLAYER_HEIGHT})
            .addSprite("playerBody", {animation: playerAnimation["idle"], posx: 0, posy: 0, width: PLAYER_WIDTH, height: PLAYER_HEIGHT})
        .end()
    .end()
    .addGroup("enemiesBulletLayer", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
    .addGroup("overlay", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
        .addGroup("crosshair", {posx: PLAYGROUND_WIDTH/2, posy: PLAYGROUND_HEIGHT/2, width: CROSSHAIR_WIDTH, height: CROSSHAIR_HEIGHT})
            .addSprite("crosshairSprite", {animation: crosshair["aim"], posx: 0, posy: 0, width: CROSSHAIR_WIDTH, height: CROSSHAIR_HEIGHT});

    $("#player")[0].player = new Player($("#player"));

    //--------------------------------------------------------------------------------------------------------------------//
    //--------------------------------------------------------------------------------------------------------------------//

    // Center the game
    var width = $(document).width();
    var padding = (width - $('#playground').width())/2;
    $('#playground').css('margin', '0 ' + padding + 'px');

    // Center the start button
    var pushX = ($('#playground').width()/2) - ($('#startbutton').width()/2);
    var pushY = ($('#playground').height()/2) - ($('#startbutton').height()/2);
    $('#startbutton').css('margin', pushY + 'px ' + pushX + 'px');


    // Get the overlay from the file
    // using an ajax call, and append
    // the html to the overlay div.
    var template = "";
    $.ajax({
        url: "gamescripts/templates/hud.html",
        type: 'get',
        async: true,
        success: function(html){
            $("#overlay").append(html);
        }
    });

    // Set the ID of the loading bar.
    $.loadCallback(function(percent){
        $("#loadingBar").width(400 * percent);
    });

    // Initialize the start button
    $("#startbutton").click(function(){
        $.playground().startGame(function(){
            $("#welcomeScreen").fadeTo(500,0,function(){$(this).remove();});
            gameOver = false;
        });
    });


    //--------------------------------------------------------------------------------------------------------------------//
    //------------------------------------------------ LOGIC! ------------------------------------------------------------//

    // MAJOR GAME LOGIC HAPPENS HERE
    $.playground().registerCallback(function(){
        if(!gameOver){
            updateUI();
            updateCrosshair(jQuery.event);

            updatePlayerMovement();

            updateEnemyMovement();

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
    }, REFRESH_RATE);

    // Handle enemy creation
    $.playground().registerCallback(function(){
        var num_enemies = NUM_ENEMIES;
        if(!gameOver && num_enemies < MAX_ENEMIES){
            leftSpawn();
            num_enemies++;
        }
        NUM_ENEMIES = num_enemies;
    }, ENEMY_SPAWN_DELAY);
});
