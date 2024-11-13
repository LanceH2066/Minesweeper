class Tile 
{
    constructor(row, col, game) 
    {
        this.row = row;
        this.col = col;
        this.id = `${row}-${col}`;
        this.game = game;
        this.element = this.createTile();
    }
    createTile() 
    {
        const tile = document.createElement("div");
        tile.id = this.id;
        tile.addEventListener("click", () => this.handleClick());
        tile.oncontextmenu = (e) => {
            e.preventDefault();
            this.handleRightClick();
        };

        tile.style.height = `${this.game.tileSize}px`;
        tile.style.width = `${this.game.tileSize}px`;

        return tile;
    }
    handleClick() 
    {
        if (this.game.gameOver || this.element.classList.contains("tile-clicked")) return;
        if (this.game.minesLocation.includes(this.id)) 
        {
            this.game.loseGame();
        } else
        {
            this.game.checkMine(this.row, this.col);
        }
    }
    handleRightClick() 
    {
        if (this.game.gameOver || this.element.classList.contains("tile-clicked")) return;
        this.element.innerText = this.element.innerText === "🚩" ? "" : "🚩";
    }
    reveal(isMine = false) 
    {
        this.element.innerText = isMine ? "💣" : "";
        if (isMine) this.element.style.backgroundColor = "red";
    }
}