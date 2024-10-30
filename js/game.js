let game;
let currentDifficulty = 0;
let autoStart = false;

function startGame()
{
    let customMines = document.getElementById("minesInput").value;
    let customDifficulty = difficulties[currentDifficulty];
    autoStart = document.getElementById("autoStart").checked;
    if(customMines < customDifficulty.cols*customDifficulty.rows && customMines > 0)
    {
        customDifficulty.minesCount = document.getElementById("minesInput").value;
        game = new Game(customDifficulty);
        document.getElementById("game-settings").style.display = "none"; // Hide settings
        document.getElementById("restartLink").style.display = "flex"; // Show restart
        if (autoStart) 
        {
            // Reveal the first tile randomly on start
            game.revealFirstTile();
        }
    }
    else if (customMines >= customDifficulty.cols*customDifficulty.rows)
    {
        document.getElementById("minesError").innerText = "Must Have Less Mines Than Tiles!";
    }
    else
    {
        document.getElementById("minesError").innerText = "You Must Have at Least 1 Mine!";
    }

}
function restartGame()
{
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // Clear the current board
    let customDifficulty = difficulties[currentDifficulty];
    customDifficulty.minesCount = document.getElementById("minesInput").value;
    game = new Game(customDifficulty);
    if (autoStart) 
    {
        game.revealFirstTile();
    }
}
function setDifficulty(button)
{
    currentDifficulty = parseInt(button.value);
    document.getElementById("minesInput").value=difficulties[currentDifficulty].minesCount;

        // Remove the "selected" class from all buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    
        // Add the "selected" class to the clicked button
        button.classList.add('selected');
}
class Difficulty
{
    constructor(name, rows, cols, minesCount) 
    {
        this.name = name;
        this.rows = rows;
        this.cols = cols;
        this.minesCount = minesCount;
    }
}
const difficulties = [
    new Difficulty("Easy", 9, 9, 10),
    new Difficulty("Medium", 16, 16, 40),
    new Difficulty("Hard", 16, 30, 99)
];
class Game 
{
    constructor(difficulty) 
    {
        this.rows = difficulty.rows;
        this.cols = difficulty.cols;
        this.minesCount = difficulty.minesCount;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        this.tileSize = Math.min(
            Math.floor((0.9*screenWidth) / this.cols), 
            Math.floor((0.8*screenHeight) / this.rows) // 80% because we have a top bar taking space
        );        
        
        this.board = null;
        this.minesLocation = [];
        this.tilesClicked = 0;
        this.flagEnabled = false;
        this.gameOver = false;
        this.firstMoveMade = false;
        this.timerInterval = null;
        this.startTime = 0; // Store start time in milliseconds

        this.init();
    }
    init() 
    {
        document.getElementById("mines-count").innerText = this.minesCount;
        document.getElementById("board").addEventListener("contextmenu", (e) => e.preventDefault());
        document.getElementById("time-display").innerText = "Time: 00:00"; // Reset the timer
        this.board = new Board(this.rows, this.cols, this.tileSize, this);
        this.setMines();
    }
    revealFirstTile() 
    {
        let r, c;
        do {
            r = Math.floor(Math.random() * this.rows);
            c = Math.floor(Math.random() * this.cols);
        } while (this.minesLocation.includes(`${r}-${c}`)); // Ensure first tile is not a mine

        this.checkMine(r, c); // Reveal the selected tile
    }
    setMines() 
    {
        let minesLeft = this.minesCount;

        while (minesLeft > 0) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            const id = `${r}-${c}`;

            if (!this.minesLocation.includes(id)) {
                this.minesLocation.push(id);
                minesLeft--;
            }
        }
    }
    checkMine(r, c) 
    {
        if (this.isOutOfBounds(r, c) || this.board.tiles[r][c].element.classList.contains("tile-clicked")) return;


        if (!this.firstMoveMade) 
        {
            this.startTimer(); // Start the timer on first move
            this.firstMoveMade = true;
        }


        const tile = this.board.tiles[r][c];
        tile.element.classList.add("tile-clicked");
        this.tilesClicked++;

        const minesFound = this.getSurroundingMines(r, c);

        if (minesFound > 0) 
        {
            tile.element.innerText = minesFound;
            tile.element.classList.add(`x${minesFound}`);
        } else 
        {
            this.revealSurroundingTiles(r, c);
        }

        if (this.tilesClicked === this.rows * this.cols - this.minesCount) 
        {
            this.endGame("Cleared!");
        }
    }
    getSurroundingMines(r, c) 
    {
        return this.checkTile(r - 1, c - 1) +
               this.checkTile(r - 1, c) +
               this.checkTile(r - 1, c + 1) +
               this.checkTile(r, c - 1) +
               this.checkTile(r, c + 1) +
               this.checkTile(r + 1, c - 1) +
               this.checkTile(r + 1, c) +
               this.checkTile(r + 1, c + 1);
    }
    revealSurroundingTiles(r, c) 
    {
        this.checkMine(r - 1, c - 1);
        this.checkMine(r - 1, c);
        this.checkMine(r - 1, c + 1);
        this.checkMine(r, c - 1);
        this.checkMine(r, c + 1);
        this.checkMine(r + 1, c - 1);
        this.checkMine(r + 1, c);
        this.checkMine(r + 1, c + 1);
    }
    checkTile(r, c) 
    {
        if (this.isOutOfBounds(r, c)) return 0;
        if (this.minesLocation.includes(`${r}-${c}`)) 
        {
            return 1;
        } else 
        {
            return 0;
        }
    }
    isOutOfBounds(r, c) 
    {
        return r < 0 || r >= this.rows || c < 0 || c >= this.cols;
    }
    startTimer() 
    {
        this.startTime = Date.now(); // Record the starting time

        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;

            // Format minutes and seconds as MM:SS (e.g., 02:05)
            const formattedTime = 
                String(minutes).padStart(2, "0") + ":" + 
                String(seconds).padStart(2, "0");

            document.getElementById("time-display").innerText = "Time: " + formattedTime;
        }, 1000);
    }
    endGame(status) 
    {
        this.gameOver = true;
        clearInterval(this.timerInterval); // Stop the timer
        document.getElementById("mines-count").innerText = status;
        this.board.revealAllMines();
    }
}
