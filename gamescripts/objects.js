//-------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------ Game Object Declarations -----------------------------------------------------------//

function Player(node){

    this.node = node;
    this.replay = NUM_REPLAYS;
    this.health = PLAYER_HEALTH;
    this.respawnTime = RESPAWN_TIME;
    this.speed = PLAYER_SPEED;
    this.invincible = false;

    // Decrement player health.
    // Return true if health is 0 (player is dead)
    // Return false otherwise.
    this.damage = function(){
        if(!this.invincible){
            this.health--;
            if(this.health <= 0){
                return true;
            }
            return false;
        }
        return false;

    };

    // Decrement the number of replays.
    // if there are no more (the game is over) return true
    // otherwise reset the players health, set the respawn time,
    // and return false
    this.respawn = function(){
        this.invincible = true;
        this.replay--;
        //alert("Replays: " + this.replay);


        //this.setAnimation(playerAnimation["dead"], function(node){ $(node).remove() });
        this.node.x(PLAYGROUND_WIDTH/2);
        this.node.y(PLAYGROUND_HEIGHT/2);
        this.invincible = false;

        this.health = PLAYER_HEALTH;
        this.respawnTime = (new Date()).getTime();

        if(this.replay==0){
            return true;
        }

        return false;

    }

    // update? ok I'm honestly not sure what this does. We'll see.
    this.update = function(){
        if((this.respawnTime > 0) && (((new Date()).getTime()-this.respawnTime) > PAUSE_AFTER_DEATH)){
            this.invincible = false;
            $(this.node).fadeTo(500, 1);
            this.respawnTime = RESPAWN_TIME;
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

