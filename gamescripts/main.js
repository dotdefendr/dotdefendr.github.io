/*
 *  This is DOT DEFENDR!
 *
 *  You are a dot.
 *  defend yourself.
 *
 *  This is the main game file.
 *  Game initialization and logic
 *  management is defined here.
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
    $.getScript("gamescripts/player.js");
    $.getScript("gamescripts/enemy.js");
    $.getScript("gamescripts/bullets.js");
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

    // Initialize the 'playground' element with a default width and height.
    // Make sure it is able to keep track of which keys get pressed.
    $("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH, keyTracker: true});

    //  Add all the layers to the playground.
    //  Here's how they work.
    //
    //      background              - group (holds all the sprites)
    //          background<N>       - sprite (the background image)
    //      playerBulletLayer       - group
    //          bullet<N>           - sprite (each individual bullet shot by the player)
    //      actors                  - group (the player and enemies)
    //          player              - group (the player and their corresponding sprites)
    //              playerBody      - sprite (the actual player image)
    //          enemy               - group (the enemies and their corresponding sprites)
    //              enemy           - sprite (the actual enemy image)
    //      overlay                 - group (all HUD and Crosshair stuff)
    //          crosshair           - group (the crosshair and its corresponding sprites)
    //              crosshairSprite - sprite (the crosshair sprite)
    //
    //
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
    .addGroup("overlay", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
        .addGroup("crosshair", {posx: PLAYGROUND_WIDTH/2, posy: PLAYGROUND_HEIGHT/2, width: CROSSHAIR_WIDTH, height: CROSSHAIR_HEIGHT})
            .addSprite("crosshairSprite", {animation: crosshair["aim"], posx: 0, posy: 0, width: CROSSHAIR_WIDTH, height: CROSSHAIR_HEIGHT});


    // Initialize the player.
    //      The player <div> is turned into an array
    //      that holds the 'player' javascript object.
    //      The player object is initialized using the
    //      player <div>.
    //
    //      Honestly it seems kinda circular to me but
    //      as long as it works I guess.
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


    // Define the onclick behavior of the start button div.
    //      Welcome screen fades out.
    //      game has begun so gameOver = false
    $("#startbutton").click(function(){
        $.playground().startGame(function(){
            $("#welcomeScreen").fadeTo(500,0,function(){$(this).remove();});
            gameOver = false;
        });
    });

    //--------------------------------------------------------------------------------------------------------------------//
    //------------------------------------------------ LOGIC! ------------------------------------------------------------//

    // This callback function handles most of the major
    // game logic management.
    // Update logic is handled here.
    $.playground().registerCallback(function(){
        if(!gameOver){

            // First update the players movement.
            // Player should get first priority.
            updatePlayerMovement();

            // Next update the players bullets.
            updateBulletMovement();
            updateEnemyMovement();

            // The least important parts are
            // the crosshair and the user interface.
            // Those can wait until everything else is done.
            updateCrosshair(jQuery.event);
            updateUI();
        }
    }, REFRESH_RATE);


    // This callback function handles creation of enemies.
    // It simply checks the that it's still ok to spawn more enemies
    // (AKA the number of enemies currently is less than the max
    // number of enemies allowed) before calling the spawn function
    // (decided at the beginning of the game by the player).
    $.playground().registerCallback(function(){
        var num_enemies = NUM_ENEMIES;
        if(!gameOver && num_enemies < MAX_ENEMIES){
            leftSpawn();
            num_enemies++;
        }
        NUM_ENEMIES = num_enemies;
    }, ENEMY_SPAWN_DELAY);
});
