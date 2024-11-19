/*--------- GLOBAL VARIABLES ----------*/
let game;                   // Reference to our game, used in helpers
let currentDifficulty = 0;  // Current difficulty set by user, used in helpers
let autoStart = false;      // First move setting, used in helpers
let winCondition = 0;       // Win condition setting, used in helpers
let currentTheme = 0;       // Theme Setting
/*--------- HELPER / INPUT HANDLER FUNCTIONS  ----------*/
function startGame()        // Function to start the game
{
    let customMines = document.getElementById("minesInput").value;  // Get # of mines from input
    let customDifficulty = difficulties[currentDifficulty];         // Get difficulty from input
    autoStart = document.getElementById("autoStart").checked;       // Get first move setting from input
    if(customMines < customDifficulty.cols*customDifficulty.rows && customMines > 0) // Must be less mines than tiles and at least 1 mine
    {
        customDifficulty.minesCount = Math.round(document.getElementById("minesInput").value); // Change the # of mines in the difficulty
        game = new Game(customDifficulty, winCondition);  // Start the new game
        document.getElementById("game-settings").style.display = "none"; // Hide settings
        document.getElementById("restartLink").style.display = "flex"; // Show restart

        if(currentTheme == 1)
        {   // Change to legacy minesweeper color scheme

            boardElement = document.getElementById("board");
            inGameLinks = document.getElementsByClassName("inGameLinks");

            boardElement.style.backgroundColor = "#C0C0C0"; 
            boardElement.style.border = "10px solid #929292";
            document.body.style.backgroundColor = "#ffffff";
            document.getElementById("minesNtime").style.color = "Red";
            document.getElementById("topBar").style.backgroundColor = "#C0C0C0";
            document.getElementById("logo").style.display="none";
            for (let element of inGameLinks) 
            {
                element.style.color = "red";
            }        
        }
        
        if (autoStart) // If first move setting checked
        {
            // Reveal the first tile randomly on start
            game.revealFirstTile();
        }
    }
    else if (customMines >= customDifficulty.cols*customDifficulty.rows) // More mines than tiles
    {
        document.getElementById("minesError").innerText = "Must Have Less Mines Than Tiles!";
    }
    else   // 0 or less mines
    {
        document.getElementById("minesError").innerText = "You Must Have at Least 1 Mine!";
    }

}
function restartGame()      // Function to restart the game
{
    game.music.pause();  //  pause  music
    game.music.currentTime = 0;  // restart music

    if (game && game.timerInterval) // if we have an existing timer
    {
        clearInterval(game.timerInterval); // Stop the existing timer
    }

    document.getElementById("time-display").innerText = "Time: 00:00"; // Reset the displayed time

    
    const boardElement = document.getElementById("board"); // get board
    boardElement.innerHTML = ""; // Clear the current board

    startGame();

}
function setDifficulty(button)      // Function attached to difficulty buttons, takes in the button that is clicked as parameter
{
    // get difficulty from  buttons that hold a value 0,1,2 which are the index of the difficulties
    currentDifficulty = parseInt(button.value); 
    // change # of mines in the input to the default for that difficulty
    document.getElementById("minesInput").value=difficulties[currentDifficulty].minesCount;

        // Remove the "selected" class from all buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    
        // Add the "selected" class to the clicked button
        button.classList.add('selected');
}
function setWinCondition(button)      // Function attached to Win Condition buttons, takes in the button that is clicked as parameter
{
    // get Win Condition value from  buttons that hold a value 0 or 1
    winConditionValue = parseInt(button.value); 

    // Remove the "selected" class from all buttons
    document.querySelectorAll('.wincon-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add the "selected" class to the clicked button
    button.classList.add('selected');

    winCondition = winConditionValue;
}
function setTheme(button)
{
    // get Win Condition value from  buttons that hold a value 0 or 1
    themeValue = parseInt(button.value); 

    // Remove the "selected" class from all buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
        
    // Add the "selected" class to the clicked button
    button.classList.add('selected');

    currentTheme = themeValue;
}
/*--------- DIFFICULTY SETTINGS  ----------*/
class Difficulty                            // Simple difficulty class for creating hard coded difficulties
{
    constructor(name, rows, cols, minesCount) 
    {                                       
        this.name = name;                   // Name of difficulty: Easy,Medium,Hard,etc...
        this.rows = rows;                   // # of rows for that difficulty
        this.cols = cols;                   // # of cols for that difficulty
        this.minesCount = minesCount;       // # of mines for that difficulty
    }
}
const difficulties =                        // Array of default difficulty settings
[
    new Difficulty("Easy", 9, 9, 10),       // Defaults for Easy Mode
    new Difficulty("Medium", 16, 16, 40),   // Defaults for Medium Mode
    new Difficulty("Hard", 16, 30, 99)      // Defaults for Hard Mode
];

/*--------- GAME CLASS ----------*/
class Game      // Main driver class for game
{
    constructor(difficulty, winCondition) 
    {
        /* ---------------- BOARD --------------- */
        this.rows = difficulty.rows;                    // Get rows from difficulty
        this.cols = difficulty.cols;                    // Get cols from difficulty
        this.minesCount = difficulty.minesCount;        // Get number of mines from difficulty(can be custom / user input)
        
        /* ---------------- TILES --------------- */
        const screenWidth = window.innerWidth;          // Get window width
        const screenHeight = window.innerHeight;        // Get window height
        this.tileSize = Math.min                        // Getting tile size based on Screen size and number of rows/cols
        (
            Math.floor((0.9*screenWidth) / this.cols),  // 90% to leave some space on the sides
            Math.floor((0.8*screenHeight) / this.rows)  // 80% because we have a top bar taking space
        );        
        
        /* ---------------- GAME --------------- */        
        this.board = null;          // Reference to board
        this.minesLocation = [];    // Locations of all mines
        this.tilesClicked = 0;      // # Of uncovered tiles
        this.winCondition = winCondition;   // 0 or 1, 0 is Clear whole grid, 1 is flag all mines
        this.gameOver = false;      // Keep track of if game is over
        this.firstMoveMade = false; // Check if game has started for: Music & Timer reasons
        this.flagsPlaced = 0;       // # of flags placed currently
        this.correctFlags = 0;      // # of flags on mines

        /* ---------------- TIMER --------------- */
        this.timerInterval = null;  // Initialize timer interval variable for use in timer method
        this.startTime = 0;         // Initialize startTime to 0, timer always starts at 0

        /* ---------------- AUDIO --------------- */
        this.music = document.getElementById("backgroundMusic");            // Get and store music embedded in DOM
        this.explosionSound = document.getElementById("explosionSound");    // Get and store explosionSound embedded in DOM
        this.explosionSound.volume = 0.075;                                 // LOWER EXPLOSION VOLUME BECAUSE IT DESTROYED MY EARS
        this.winSound = document.getElementById("winSound");                // Get and store winSound embedded in DOM

        /* ---------------- INIT --------------- */
        this.init();    // Initialize DOM Elements, Disable Contextmenu, Create Board
                        // Disable contexmenu (right click options) so we can use right click for flags.
    }
    init()  // Method to initialize Board and Display
    {
        document.getElementById("mines-count").innerText = this.minesCount;     // Set DOM Element showing # of mines on screen
        document.getElementById("board").addEventListener("contextmenu", (e) => e.preventDefault()); // Disable contexmenu (right click options) so we can use right click for flags.
        document.getElementById("time-display").innerText = "Time: 00:00"; // Reset DOM Element timer to 0 on screen
        this.setMines();    // Randomize position of and store position of mines
        this.board = new Board(this.rows, this.cols, this.tileSize, this);      // Create board 
    }
    revealFirstTile() // Method for choosing a non mine tile for the players first move
    {
        let r, c;   // rows, cols
        do // check for a random safe tile until we hit one
        {
            r = Math.floor(Math.random() * this.rows);
            c = Math.floor(Math.random() * this.cols);
        } while (this.minesLocation.includes(`${r}-${c}`)); // Ensure tile is not a mine

        this.checkMine(r, c); // Reveal the selected tile
    }
    setMines() // Method to randomize mine positions and save them
    {
        let minesLeft = this.minesCount;    // Counter starts at the initial # of mines

        while (minesLeft > 0) // iterate through each mine
        {
            const r = Math.floor(Math.random() * this.rows); // randomize row
            const c = Math.floor(Math.random() * this.cols); // randomize col
            const id = `${r}-${c}`;                          // format id

            if (!this.minesLocation.includes(id)) // if tile does not already have a mine
            {
                this.minesLocation.push(id);    // store position of mine
                minesLeft--;                    // decrement counter
            }
        }
    }
    checkMine(r, c) // Main Method: Called on left click, checks & reveals tiles. RECURSIVE METHOD
    {
        // check if out of bounds
        if (this.isOutOfBounds(r, c) || this.board.tiles[r][c].element.classList.contains("tile-clicked")) return;
        // If its the first move, start the music and the timer
        if (!this.firstMoveMade) 
        {
            this.music.play();
            this.startTimer();
            this.firstMoveMade = true;
        }
        // Get reference to current tile and change it to a clicked tile(css)
        const tile = this.board.tiles[r][c];
        tile.element.classList.add("tile-clicked");
        this.tilesClicked++;    // increment # of revealed tiles (win condition)

        const minesFound = this.getSurroundingMines(r, c);  // check tile for surrounding mines

        if (minesFound > 0)  // If we found 1 or more mines
        {   
            tile.element.innerText = minesFound;            // Update Tile to show number of adjacent mines
            tile.element.classList.add(`x${minesFound}`);   // Set the css class to set the color of the text
        } else // if no mines found
        {
            this.revealSurroundingTiles(r, c); // Reveal all nearby tiles that dont contain a mine (RECURSIVE CALL)
        }

        this.checkWinCondition();
    }
    getSurroundingMines(r, c) // Method to check all tiles around current tile, add each call together and returns # of mines adjacent to it
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
    revealSurroundingTiles(r, c)  // Method to call checkMine on all adjacent tiles (recursive call, goes until tiles have adjacent mines)
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
    checkTile(r, c) // Method to check if a tile has a mine and return 1 if it does
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
    isOutOfBounds(r, c) // Basic Method to check if tile is out of bounds
    {
        return r < 0 || r >= this.rows || c < 0 || c >= this.cols;
    }
    startTimer() // Method to set timer interval and start timer
    {
        this.startTime = Date.now(); // Record the starting time

        this.timerInterval = setInterval(() => 
        {
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
    endGame(status) // Method to end the game
    {
        this.gameOver = true;
        this.music.pause();
        clearInterval(this.timerInterval); // Stop the timer
        document.getElementById("mines-count").innerText = status;
        this.board.revealAllMines();
    }
    checkWinCondition() 
    {
        if (this.winCondition === 0) 
        { 
            // Win by revealing all tiles
            if (this.tilesClicked === this.rows * this.cols - this.minesCount) 
            {
                this.winGame("Cleared!");
            }
        } else if (this.winCondition === 1) 
        { 
            // Win by flagging all mines correctly
            if (this.correctFlags === this.minesCount && this.flagsPlaced === this.minesCount) 
            {
                this.winGame("Flagged!");
            }
        }
    }
    winGame(status)   // Method to define win condition and do all win actions (win sound and text)
    {
        this.winSound.play();
        updateLeaderboard("win", document.getElementById("time-display").innerText);
        this.endGame(status);
    }
    loseGame()  // Method to do lose actions (play explosion sound and text)
    {
        this.explosionSound.play();
        updateLeaderboard("loss", document.getElementById("time-display").innerText);
        this.endGame("You Lost!");
    }
    updateLeaderboard(status, time) 
    {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "../includes/update_leaderboard.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(`status=${status}&time=${time}`);
    }
}
