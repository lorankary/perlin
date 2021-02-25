function Game(){

    this.ga = new GameArea();   // create all the dom elements
    // get the canvas as a property of the game
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas
    this.canvas = document.getElementById('canvas');
    // get the context
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
    this.ctx = this.canvas.getContext('2d'); // This is the context

    // //  set number of cells in grid
    // this.numCols = 40;
    // this.cellWidth = this.canvas.width / this.numCols;
    // this.numRows = 26;
    // this.cellHeight = this.canvas.height / this.numRows;

    // Create the two-dimensional grid of cells
    // this.grid = new Array(this.numRows);
    // // Populate the grid of cells
    // for (let r = 0; r < this.grid.length; r++) {
    //     this.grid[r] = new Array(this.numCols);
    //     for (let c = 0; c < this.grid[r].length; c++) {
    //         this.grid[r][c] = new Cell(this, r, c);
    //     }
    // }

    // perlin terrain ala Ramsays
    let map_config = {  noise_seed: Math.random(),
                        noise_scale: 3,
                        noise_scale_range: [3,5],
                        rock_probability_range:[.2,.3],
                        rock_probability: 0  //to be set later
                        };
    let config =     {    map_x_size: 60, //measured in tiles
                          map_y_size: 60, //measred in tiles
                       };
    let tile_types = {  rock: { color: "#696e75"},
                        grass: { color: "green"}
                        };

    map_config.noise_scale = Math.random() * -(map_config.noise_scale_range[0] - map_config.noise_scale_range[1]) + map_config.noise_scale_range[0];
    map_config.rock_probability = Math.random() * -(map_config.rock_probability_range[0] - map_config.rock_probability_range[1]) + map_config.rock_probability_range[0];


    this.cellWidth = this.canvas.width / config.map_x_size;
    this.cellHeight = this.canvas.height / config.map_y_size;

    noise.seed(map_config.noise_seed);
    //Create map array
    this.map = [];
    for (let i = 0; i < config.map_x_size; i++) {
      this.map.push([]);
      for (let j = 0; j < config.map_y_size; j++) {
        // this.map[i].push(new Tile(this.game, new InnerVector2D(i, j)));
        this.map[i].push(new Cell(this, j, i));
      }
    }
    //Initialize tiles
    for (let i = 0; i < config.map_x_size; i++) {
      for (let j = 0; j < config.map_y_size; j++) {

        //Set the seed
        /*
        *  noise perlin2--> in util
        *  all tile type chosen according to perlin noise
        */
        this.map[i][j].perlin = this.normalizePerlin(noise.perlin2(
          i / this.map.length * map_config.noise_scale,
          j / this.map[i].length * map_config.noise_scale
        ));

        //Set tile types
        if (this.map[i][j].perlin > 1 - map_config.rock_probability) {
          this.map[i][j].tileType = tile_types.rock;
          }
        // } else if (this.map[i][j].perlin > map_config.water_range[0] &&
        //   this.map[i][j].perlin < map_config.water_range[1]) {
        //     this.map[i][j].tileType = tile_types.water;
          // }
          else {
            this.map[i][j].tileType = tile_types.grass;
          }

          // //Create valid starts
          // //  Only spawn player, minions
          // if (!this.map[i][j].tileType.is_occupied) {
          //   this.validStartTiles.push(this.map[i][j]);
          // }

          //Initialize
        }
      }
}//++++++++++++++++++++++  end Game constructor

Game.prototype.normalizePerlin = function (value) {
  let SQ2 = Math.sqrt(2);
  let output = value + (SQ2 / 2.0);
  return output / SQ2;
}

// function to run the game each animation cycle
Game.prototype.run = function(){
    this.ctx.fillStyle = "saddlebrown";
    this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    for (let r = 0; r < this.map.length; r++) {
        for (let c = 0; c < this.map[r].length; c++) {
            this.map[r][c].run();
        }
    }

}
