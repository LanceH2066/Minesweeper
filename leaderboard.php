<?php
    require_once "includes/leaderboard_handler.inc.php";
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minesweeper Leaderboard</title>
    <link href="css/style.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</head>

<body>
    <div id = "topBar">
        <a href="index.php">
            <img id="logo" src="./img/Fresno State.PNG" alt="Fresno State Logo">
        </a>        
        <a href="index.php" class="inGameLinks">Main Menu</a>
    </div>

    <h1>Leaderboard</h1>
    <form action="leaderboard_handler.php" method="post">
        <div class = "sortingForm">

            <p>Display: </p>
            <button class="button" name="display" value="best_players">Best Players</button>    
            <button class="button" name="display" value="your_games">Your Games</button>
            
            <p>Sort Order: </p>
            <button class="button" name="order" value="ASC">Ascending Order</button>    
            <button class="button" name="order" value="DESC">Descending Order</button>
            
            <p>Sort By: </p>
            <button class="button" name="sort_by" value="games_won">Games Won</button>    
            <button class="button" name="sort_by" value="games_played">Games Played</button>
            <button class="button" name="sort_by" value="time_played">Time Played</button>

        </div>
    </form>
    <div id="leaderboardContainer">
    <?php
        displayResults($results);
    ?>
    </div>

</body>

</html>
