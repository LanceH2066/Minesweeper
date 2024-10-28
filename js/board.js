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

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        boardContainer.style.height = `${Math.floor(this.rows * this.tileSize)+19}px`;
        boardContainer.style.width = `${Math.floor(this.cols * this.tileSize)+20}px`;

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