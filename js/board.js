class Board // Board Class handles building board, populating it, and revealing all mines when the game is lost.
{
    constructor(rows, cols, tileSize, game) 
    {
        this.rows = rows;           // Set # of rows
        this.cols = cols;           // Set # of cols
        this.tileSize = tileSize;   // Set tileSize
        this.game = game;           // Get game reference
        this.tiles = [];            // Create empty array to store tiles
        this.buildBoard();          // Build board element
        this.populateBoard();       // Populate board element
    }
    buildBoard()   // Method to build board element 
    {
        const boardContainer = document.getElementById("board");    // Get reference to DOM element

        boardContainer.style.height = `${Math.floor(this.rows * this.tileSize)+19}px`;  // Set board height = rows*tileSize+offset(makes up for borders) 
        boardContainer.style.width = `${Math.floor(this.cols * this.tileSize)+20}px`;   // Set board width = cols*tileSize+offset(makes up for borders) 
    }
    populateBoard() // Method to populate the board with tiles
    {
        // Nested for loop to go through every index of board
        for (let r = 0; r < this.rows; r++)     // Iterate through each row
        {
            let row = []; // temp array for current row
            for (let c = 0; c < this.cols; c++)     //  Iterate through each col
            {
                const tile = new Tile(r, c, this.game);    // Create Tile
                document.getElementById("board").appendChild(tile.element); // Append tile to board element
                row.push(tile); // Push tile into temp array
            }
            this.tiles.push(row); // Push temp array into the array tiles (at the end of the loop tiles will contain every tile in the board)
        }
    }
    revealAllMines() // Method to reaveal all mines
    {
        this.tiles.forEach(row => // Iterate through each row
        {
            row.forEach(tile => // Iterate through each tile
            {
                if (this.game.minesLocation.includes(tile.id)) // Check if it is a mine 
                {
                    tile.reveal(true); // Reveal Mine
                }
            });
        });
    }
}