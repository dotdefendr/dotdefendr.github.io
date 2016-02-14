//
//  These are the main object declarations
//  in the game. These are objects that will
//  have their own animation defined in main.js.
//
//  Most of these objects will be able to move
//

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

        this.node.x(PLAYGROUND_WIDTH/2);
        this.node.y(PLAYGROUND_HEIGHT/2);

        this.health = PLAYER_HEALTH;
        this.respawnTime = (new Date()).getTime();

        if(this.replay==0){
            return true;
        }

        return false;

    }

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
    this.memory = GRUNT_ENEMY_MEMORY;
    this.player_seen_at_time;
    this.view_distance = GRUNT_ENEMY_VIEW_DISTANCE;
    this.something_in_the_way = false;
    this.player_last_seen_at = [];

    this.damage = function(){
        this.health--;
        if(this.health == 0){
            return true;
        }
        return false;
    };

    // updates the position of the enemy
    this.update = function(playerNode){
        smart_movement(this);
    };
}

function Bullet(node){
    this.direction = CROSSHAIR_DIRECTION;
    this.node = $(node);
    this.fired = false;
    this.index;

    // Birth and age are necessary
    // to keep track of how long a
    // bullet has been on the field.
    // this helps if a bullet suddenly
    // suddenly glitches out.
    this.birth = Date.now();
    this.age = function(){
        if(this.birth != 0){
            return Number((new Date).getTime() - this.birth);
        }
        return Number(0);
    };
}

function Obstacle(node){
    this.width;
    this.height;
    this.posx;
    this.posy;
    this.node = $(node);
}
