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
//
//  Here we're going to initialize all the constants & variables we'll use in the game.
//
//-------------------------------------------------------------------------------------------------------------------------------//

// Initialize the default game constants
const PLAYGROUND_HEIGHT = 400;
const PLAYGROUND_WIDTH = 1000;
const REFRESH_RATE = 25;
const PAUSE_AFTER_DEATH = 5000;
const RESPAWN_TIME = -1;

// Initialize player constants
const NUM_REPLAYS = 3; // number of replays you get
const PLAYER_HEALTH = 20;
const PLAYER_SPEED = 5; // Player initial speed
const BULLET_SPEED = 30; // pixels per frame
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 20;
var PLAYER_POSITION = [];

// Stuff involving the crosshair
const MAX_CROSSHAIR_DISTANCE = 75;
const CROSSHAIR_WIDTH = 7;
const CROSSHAIR_HEIGHT = 7;
var MOUSE_POSITION = [];
var CROSSHAIR_DIRECTION = 0; // in radians

// Initialize enemy constants
const GRUNT_ENEMY_HEALTH = 1;
const GRUNT_ENEMY_SPEEDX = 1;
const GRUNT_ENEMY_SPEEDY = 1;
const MAX_ENEMIES = 20;
const ENEMY_SPAWN_DELAY = 2000;
var NUM_ENEMIES = 0;

// Animation Holder
var playerAnimation = new Array();
var crosshair = new Array();
var bullet = new Array();
var enemies = new Array(1); // only 1 kind of enemy in the game for now

// Game State
var bossWave = false;
var playerHit = false;
var timeOfRespawn = 0;
var gameOver = true;
var grenades = 0;
var bulletCount = 0;
var killcount = 0;

//-------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------- Helper Functions ------------------------------------------------------------------//

// Nice reboot function
function restartGame(){
    window.location.reload();
};

// Kill the player
function killPlayer(playerNode){
    playerNode.children().hide();

    // Add a "dead" animation
    playerNode.addSprite("dead", {animation: playerAnimation["dead"], width: 20, height: 20 });
    playerHit = true;
};

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
    if(!e.pageX && !e.pageY){
        mousePosition = MOUSE_POSITION;
    } else {
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

function getRadians(point1, point2){
    var dx = point1[0] - point2[0];
    var dy = point1[1] - point2[1];
    return Math.atan2(dy, dx);
}

function getDistance(point1, point2){
    var dx = point1[0] - point2[0];
    var dy = point1[1] - point2[1];
    return Math.floor(Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2)));
}

function fire(e){
    e.preventDefault();
    if(!gameOver){
        updateCrosshair(e);
        var playerposx = $("#player").x();
        var playerposy = $("#player").y();
        bulletCount = (bulletCount + 1) % 100000;
        var name = "playerBullet_" + bulletCount;
        $("#playerBulletLayer").addSprite(name, {
            animation: bullet["player"],
            posx: playerposx + (PLAYER_WIDTH/2 - 2),
            posy: playerposy + (PLAYER_HEIGHT/2 - 2),
            width: 5,
            height: 5
        });
        $("#"+name).addClass("playerBullet");
        $("#"+name)[0].bullet = new Bullet($("#"+name));
        $("#"+name)[0].bullet.direction = CROSSHAIR_DIRECTION;
    }

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

//-------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------ Game Object Declarations -----------------------------------------------------------//

function Player(node){

    this.node = node;
    this.replay = NUM_REPLAYS;
    this.health = PLAYER_HEALTH;
    this.respawnTime = RESPAWN_TIME;
    this.speed = PLAYER_SPEED;

    // Decrement player health.
    // Return true if health is 0 (player is dead)
    // Return false otherwise.
    this.damage = function(){
        this.health--;
        if(this.health == 0){
            return true;
        }
        return false;
    };

    // Decrement the number of replays.
    // if there are no more (the game is over) return true
    // otherwise reset the players health, set the respawn time,
    // and return false
    this.respawn = function(){
        this.replay--;
        if(this.replay==0){
            return true;
        }
        this.health = PLAYER_HEALTH;
        this.respawnTime = (new Date()).getTime();
        $(this.node).fadeTo(0, 0.5);
        return false;
    }

    // update? ok I'm honestly not sure what this does. We'll see.
    this.update = function(){
        if((this.respawnTime > 0) && (((new Date()).getTime()-this.respawnTime) > PAUSE_AFTER_DEATH)){
            $(this.node).fadeTo(500, 1);
            this.respawnTime = -1;
        }
    }

    return true;
}

function Enemy(node){
    this.health = GRUNT_ENEMY_HEALTH;
    this.speedx = GRUNT_ENEMY_SPEEDX;
    this.speedy = GRUNT_ENEMY_SPEEDY;
    this.node = $(node);

    this.damage = function(){
        this.health--;
        if(this.health == 0){
            return true;
        }
        return false;
    };

    // updates the position of the enemy
    this.update = function(playerNode){
        var posx = this.node.x();
        var posy = this.node.y();
        var enemyPoint = [posx, posy];
        var playerPoint = PLAYER_POSITION;
        var direction = getRadians(playerPoint, enemyPoint);

        var nextX = Math.round(Math.cos(direction) * this.speedx + posx);
        var nextY = Math.round(Math.sin(direction) * this.speedy + posy);
        this.node.x(nextX);
        this.node.y(nextY);
    };
}

function Bullet(node){
    this.direction = CROSSHAIR_DIRECTION;
    this.node = $(node);
}


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
        url: "hud.html",
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
            var accuracy = Math.round((killcount/bulletCount)*100);
            if(!accuracy){
                accuracy = 0;
            }
            $("#health").html("Health: "+$("#player")[0].player.health);
            $("#stats").html("<div class='text-center'>Kills: "+killcount+" Shots Fired: "+bulletCount+" Accuracy: "+accuracy+"%</div>");
            $("#lives").html("<div class='pull-right'>Lives: "+$("#player")[0].player.replay+"</div>");
            // Update the health
            updateCrosshair(jQuery.event);

            // Update the player's movement
            if(!playerHit){
                var speed = $("#player")[0].player.speed;
                $("#player")[0].player.update();

                // a - left
                if(jQuery.gameQuery.keyTracker[65]){
                    var current = $("#player").x();
                    var next = current - speed;
                    if(next > 0){
                        $("#player").x(next);
                    }
                }

                // d - right
                if(jQuery.gameQuery.keyTracker[68]){
                    var current = $("#player").x();
                    var next = current + speed;
                    if(next < $("#playground").width() - PLAYER_WIDTH){
                        $("#player").x(next);
                    }
                }

                // w - up
                if(jQuery.gameQuery.keyTracker[87]){
                    var current = $("#player").y();
                    var next = current - speed;
                    if(next > 0){
                        $("#player").y(next);
                    }
                }

                // s - down
                if(jQuery.gameQuery.keyTracker[83]){
                    var current = $("#player").y();
                    var next = current + speed;
                    if(next < $("#playground").height() - PLAYER_HEIGHT){
                        $("#player").y(next);
                    }
                }
            } else {
                if($("#player")[0].player.respawn()){
                    gameOver = true;
                    $("#playground").append("<div class='text-center'><h2>GAME OVER</h2></div><div class='text-center'><a href='#' id='restartbutton'>Try Again?</a></div>");
                    $("#restartbutton").click(function(){
                        restartGame();
                    });
                    $("#actors,#playerBulletLayer,#overlay").fadeTo(1000,0);
                    $("#background").fadeTo(3000, 0);
                } else {
                    playerHit = false;
                }
            }

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
        // This function controls what
        // happens when the user clicks.
        fire(e);
    });
    //--------------------------------------------------------------------------------------------------------------------//
    //--------------------------------------------------------------------------------------------------------------------//
});
