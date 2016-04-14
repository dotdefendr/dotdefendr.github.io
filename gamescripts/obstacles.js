//======================================================================
//  Because each obstacle needs its own width & height constants,
//  they will be defined here.
//======================================================================
// Initialize Obstacle constants
//
//  These represent the number of
//  obstacles that will be placed
//  on the playground upon creation.
const COVER_LIGHT = 3;
const COVER_MID = 5;
const COVER_HEAVY = 7;
const CELL_SIZE = 25;
var NUM_X_CELLS = Math.floor(PLAYGROUND_WIDTH/CELL_SIZE);
var NUM_Y_CELLS = Math.floor(PLAYGROUND_HEIGHT/CELL_SIZE);

//  The obstacle grid keeps track of
//  which parts of the playground are
//  occupied by an obstacle. It is a
//  way of preventing obstacles from
//  spawning on top of eachother.
//
var OBSTACLE_GRID = new Array(NUM_X_CELLS);

//  Each cell is initially unoccupied,
//  (except for the middle-most cell, which
//  the player spawns in)
//  so the array value is set to false.
//
var player_cell = [Math.floor((PLAYGROUND_WIDTH/CELL_SIZE)/2), Math.floor((PLAYGROUND_HEIGHT/CELL_SIZE)/2)];
for(i = 0; i < NUM_X_CELLS; i++){
    OBSTACLE_GRID[i] = new Array(NUM_Y_CELLS);
    for(j = 0; j < NUM_Y_CELLS; j++){

        // Make sure the player's cell is occupied
        if(i == player_cell[0] && j == player_cell[1]){
            OBSTACLE_GRID[i][j] = true;
        } else {
            OBSTACLE_GRID[i][j] = false;
        }
    }
}

// Each obstacle's size needs to be documented here.
// The size must be added in the same order that the
// obstacles are initialized in main.js. Otherwise
// boundary dimensions are not going to work correctly.
//
var OBSTACLE_SIZE = [
    [200, 100],
    [50, 100],
    [100, 200]//,
    //[150, 50],
    //[150, 50]
];

// The obstacle size and element are passed in
// and and a location is chosen, and checked
// to determine whether it is occuppied.
function placeInRandomLocation(obstacle_size, obstacle){

    // Translate object width and height into # of cells.
    var width_in_cells = Math.floor(obstacle_size[0]/CELL_SIZE);
    var height_in_cells = Math.floor(obstacle_size[1]/CELL_SIZE);

    // Get some coordinates within the boundaries of
    // the playground
    var cell_x = Math.floor(Math.random()*(NUM_X_CELLS-width_in_cells));
    var cell_y = Math.floor(Math.random()*(NUM_Y_CELLS-height_in_cells));

    while(areaIsOccupied(cell_x, cell_y, cell_x + width_in_cells, cell_y + height_in_cells) == true){
        cell_x = Math.floor(Math.random()*(NUM_X_CELLS-width_in_cells));
        cell_y = Math.floor(Math.random()*(NUM_Y_CELLS-height_in_cells));
    }

    occupyArea(cell_x, cell_y, (cell_x + width_in_cells), (cell_y + height_in_cells));
    var x = cell_x * CELL_SIZE;
    var y = cell_y * CELL_SIZE;

    obstacle[0].obstacle.xpos = obstacle.x(x);
    obstacle[0].obstacle.ypos = obstacle.y(y);
}

// A set of cells is defined, and
// the grid array is travered as each
// cell is set to true (representing occupied)
function occupyArea(startingCellX, startingCellY, endingCellX, endingCellY){
    // Loop through X cells (width)
    for(var i = startingCellX; i <= endingCellX; i++){
        // Loop through Y cells(height)
        for(var j = startingCellY; j <= endingCellY; j++){
            OBSTACLE_GRID[i][j] = true;
        }
    }
}

// Converts coordinates to grid spaces and returns their value
function coordinatesAreOccupied(x,y){
    return OBSTACLE_GRID[Math.floor(x/CELL_SIZE)][Math.floor(y/CELL_SIZE)];
}

// A set of cells is passed in to define an area.
// if any one of those cells is occupied it returns
// true. Otherwise it returns false
function areaIsOccupied(startingCellX, startingCellY, endingCellX, endingCellY){
    for(var i = startingCellX; i < endingCellX; i++){
        for(var j = startingCellY; j < endingCellY; j++){
            if(OBSTACLE_GRID[i][j] == true){
                return true;
            }
        }
    }
    return false;
}

// This is run when the game is started.
// It places obstacles on the playground.
function populatePlayground(cover){
    // Make sure the obstacle does not
    // spawn on top of the player.
    OBSTACLE_GRID[player_cell[0], player_cell[1]] = true;

    // Loop through the obstacles we've decided to generate
    for(var i=0; i < cover; i++){
        // Name the obstacle & initialize it
        var name = "obstacle_" + i;
        $("#obstacles").addSprite(name, {
            animation: obstacles[i],
            width: OBSTACLE_SIZE[i][0],
            height: OBSTACLE_SIZE[i][1]
        });
        $("#"+name).addClass("obstacleBody");
        $("#"+name)[0].obstacle = new Obstacle($("#"+name));

        // Now figure out where to put it
        placeInRandomLocation(OBSTACLE_SIZE[i], $("#"+name));
    }

    // The player cell is no longer considered occupied.
    OBSTACLE_GRID[player_cell[0], player_cell[1]] = false;
}
