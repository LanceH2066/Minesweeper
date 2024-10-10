var board = [];
var rows = 9;
var columns = 9;
var tileSize = 50;
var minesCount = 10;
var minesLocation = []; //2-2 3-4 2-1 | location on board
var tilesClicked =0; // goal click all tiles except the ones containing mines
var flagEnabled = false;
var gameOver = false;

function startGame()
{
    document.getElementById("mines-count").innerText = minesCount; // show # of mines on screen
    document.getElementById("board").addEventListener("contextmenu", (e) => {e.preventDefault()}); // disable contexmenu on board (right click)
    buildBoard();   // Dynamically set size of board container
    setMines();     // randomize mine positions
    populateBoard(); // populate board with tiles
}
function buildBoard()
{
    // Select the board element
    const boardContainer = document.getElementById("board");

    // Set the dynamic height and width using string concatenation
    boardContainer.style.height = (rows * tileSize) + "px";
    boardContainer.style.width = (columns * tileSize) + "px";
}
function populateBoard()
{
    for(let r = 0; r<rows;r++)
    {
        let row = [];
        for(let c = 0; c< columns;c++)
        {
            //BUILD GRID <div id="0-0, 0-1, 0-2.... 7-7"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            //ADD CONTROLS
            tile.addEventListener("click", clickTile);
            tile.oncontextmenu = rightClickTile;
            // APPEND TO BOARD AND PUSH TO ROW
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    } 
}
function setMines()
{
    let minesLeft = minesCount;

    while(minesLeft > 0)
    {
        let r = Math.floor(Math.random()*rows);
        let c = Math.floor(Math.random()*columns);
        let id = r.toString() + "-" + c.toString();

        if(!minesLocation.includes(id))
        {
            minesLocation.push(id);
            minesLeft -=1;
        }
    }
}
function rightClickTile()
{
    if(gameOver)
    {
        return;
    }
    
    let tile = this;

    if(tile.innerText=="")
    {
        tile.innerText = "🚩";
    }
    else if (tile.innerText=="🚩")
    {
        tile.innerText = "";
    }
}
function clickTile()
{
    if(gameOver || this.classList.contains("tile-clicked"))
    {
        return;
    }

    let tile = this;

    if(minesLocation.includes(tile.id))
    {
        //alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-"); //"0-0 -> ["0","0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r,c);
}
function revealMines()
{
    for(let r = 0; r<rows;r++)
    {
        for(let c = 0; c< columns;c++)
        {
            let tile = board[r][c];
            if(minesLocation.includes(tile.id))
            {
                tile.innerText="💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}
function checkMine(r,c) // Recursive function that checks tiles for mines
{
    if(r < 0 || r >= rows || c < 0 || c >= columns)
    {
        return;
    }
    if(board[r][c].classList.contains("tile-clicked"))
    {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked +=1;
    let minesFound = 0;

    //top 3
    minesFound += checkTile(r-1,c-1); //top left
    minesFound += checkTile(r-1,c); //top 
    minesFound += checkTile(r-1,c+1); //top right
    //left and right
    minesFound += checkTile(r,c-1); //left
    minesFound += checkTile(r,c+1); //right
    //bottom 3
    minesFound += checkTile(r+1,c-1); //bottom left
    minesFound += checkTile(r+1,c); //bottom left
    minesFound += checkTile(r+1,c+1); //bottom left

    if(minesFound>0)
    {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else
    {
        //top 3
        checkMine(r-1,c-1); //top left
        checkMine(r-1,c); //top 
        checkMine(r-1,c+1); //top right
        //left and right
        checkMine(r,c-1); //left
        checkMine(r,c+1); //right
        //bottom 3
        checkMine(r+1,c-1); //bottom left
        checkMine(r+1,c); //bottom left
        checkMine(r+1,c+1); //bottom left
    }

    if(tilesClicked == rows*columns-minesCount)
    {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}
function checkTile(r,c) // check tile for mine
{
    if(r < 0 || r >= rows || c < 0 || c >= columns)
    {
        return 0;
    }
    if (minesLocation.includes(r.toString()+"-"+c.toString()))
    {
        return 1;
    }
    return 0;
}