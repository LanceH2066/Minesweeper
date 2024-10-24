class Board 
{
    constructor(rows, cols, tileSize, game) 
    {
        this.rows = rows;
        this.cols = cols;
        this.tileSize = tileSize;
        this.game = game;
        this.tiles = [];
        this.buildBoard();
        this.populateBoard();
    }
    buildBoard() 
    {
        const boardContainer = document.getElementById("board");
        boardContainer.style.height = `${this.rows * this.tileSize}px`;
        boardContainer.style.width = `${this.cols * this.tileSize}px`;
    }
    populateBoard() 
    {
        for (let r = 0; r < this.rows; r++) 
            {
            let row = [];
            for (let c = 0; c < this.cols; c++) 
            {
                const tile = new Tile(r, c, this.game);
                document.getElementById("board").appendChild(tile.element);
                row.push(tile);
            }
            this.tiles.push(row);
        }
    }
    revealAllMines() 
    {
        this.tiles.forEach(row => 
        {
            row.forEach(tile => 
            {
                if (this.game.minesLocation.includes(tile.id)) 
                {
                    tile.reveal(true);
                }
            });
        });
    }
}