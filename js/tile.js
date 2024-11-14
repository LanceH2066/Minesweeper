class Tile // Tile Class handles tile div creation and user mouse input during game 
{
    constructor(row, col, game) 
    {
        this.row = row;             // Set tile row
        this.col = col;             // Set tile col
        this.id = `${row}-${col}`;  // Format id
        this.game = game;           // Give tile a reference to game for using methods (checkMine, loseGame)

        this.isFlagged = false;     // Track if the tile is flagged
        this.isMine = this.game.minesLocation.includes(this.id); // Track if this tile is a mine

        this.element = this.createTile(); // Create Element in DOM
    }
    createTile() 
    {
        const tile = document.createElement("div"); // Create div element
        tile.id = this.id;
        tile.addEventListener("click", () => this.handleClick());   // Add event listener for left click
        tile.oncontextmenu = (e) => {                               // Disable default right click functionality, and set it to handleRightClick()
            e.preventDefault();
            this.handleRightClick();
        };

        tile.style.height = `${this.game.tileSize}px`;  // Set height to tileSize, calculated in game constructor
        tile.style.width = `${this.game.tileSize}px`;   // Set width to tileSize, calculated in game constructor
        return tile;
    }
    handleClick() // Method to handle left clicking tiles
    {
        if (this.game.gameOver || this.element.classList.contains("tile-clicked")) return;  // Just return if game is over
        if (this.isMine) // If you click a mine
        {
            this.game.loseGame(); // Lose Game 
        } else
        {
            this.game.checkMine(this.row, this.col); // Reveal tiles
        }
    }
    handleRightClick() // Method to handle right clicking tiles
    {
        if (this.game.gameOver || this.element.classList.contains("tile-clicked")) return;  // Just return if game is over or if the tile is already revealed (no flags on revealed tiles)
        // Toggle flag on the tile
        if (this.isFlagged) 
        {
            this.element.innerText = ""; // Remove flag
            this.isFlagged = false;
            this.game.flagsPlaced--; // Decrement flags placed
            
            // Check if it was correctly flagged
            if (this.isMine) 
            {
                this.game.correctFlags--; // Decrement correct flags
            }
        } else 
        {
            this.element.innerText = "🚩"; // Place flag
            this.isFlagged = true;
            this.game.flagsPlaced++; // Increment flags placed
            
            // Check if it is a correct flag
            if (this.isMine) 
            {
                this.game.correctFlags++; // Increment correct flags
            }
        }
        this.game.checkWinCondition();
    }
    reveal(isMine = false) // Method to handle clicking a mine
    {
        this.element.innerText = isMine ? "💣" : "";    // Show mine
        if (isMine) this.element.style.backgroundColor = "red";  // Make background red for mines when you lose
    }
}