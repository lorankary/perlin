function Game(){

    this.ga = new GameArea();   // create all the dom elements
    // get the canvas as a property of the game
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas
    this.canvas = document.getElementById('canvas');
    // get the context
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
    this.ctx = this.canvas.getContext('2d'); // This is the context

    //  set number of cells in grid
    this.numCols = 40;
    this.cellWidth = this.canvas.width / this.numCols;
    this.numRows = 26;
    this.cellHeight = this.canvas.height / this.numRows;

    // Create the two-dimensional grid of cells
    this.grid = new Array(this.numRows);
    // Populate the grid of cells
    for (let r = 0; r < this.grid.length; r++) {
        this.grid[r] = new Array(this.numCols);
        for (let c = 0; c < this.grid[r].length; c++) {
            this.grid[r][c] = new Cell(this, r, c);
        }
    }

    // perlin terrain
    noise.seed(Math.random());
    let x_off = 0.1;
    let y_off = 0.1;
    let x = 0, y = 10;
    let p_min = 10, p_max = -10;
    for (let r = 0; r < this.grid.length; r++) {
        for (let c = 0; c < this.grid[r].length; c++) {
            let p = noise.perlin2(x, y);
            if(p > 0.2)
                this.grid[r][c].occupied = true;
            let col = Math.floor((p+1) * 100);
            this.grid[r][c].color = "rgba(" + col + "," + col + "," + col + ","+ 1.0 + ")";
            if(p < p_min)
                p_min = p;
            if(p > p_max)
                p_max = p;
            x = x + x_off;
            y = y + y_off;
        }
    }
    console.log(p_min, p_max);



}//++++++++++++++++++++++  end Game constructor

// function to run the game each animation cycle
Game.prototype.run = function(){
    this.ctx.fillStyle = "saddlebrown";
    this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    for (let r = 0; r < this.grid.length; r++) {
        for (let c = 0; c < this.numCols; c++) {
            this.grid[r][c].run();
        }
    }

}
