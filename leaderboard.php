<?php
    require_once "includes/dbh.inc.php";
    require_once "includes/config_session.inc.php";
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
    <form action="includes/leaderboard_handler.inc.php" method="post">
        <div class = "sortingForm">
        <p>Display: </p>
            <label><input type="radio" name="display" value="best_players"> Best Players</label>
            <label><input type="radio" name="display" value="your_games"> Your Games</label>

            <p>Sort Order: </p>
            <label><input type="radio" name="order" value="ASC">Ascending</label>
            <label><input type="radio" name="order" value="DESC">Descending</label>

            <p>Sort By: </p>
            <label><input type="radio" name="sort_by" value="games_won"> Wins / Result</label><br>
            <label><input type="radio" name="sort_by" value="games_played"> Total Games / Difficulty</label>
            <label><input type="radio" name="sort_by" value="time_played"> Time</label>

            <button class="button" type="submit">Sort</button>
        </div>
    </form>

    <div id="leaderboardContainer">
    <?php
        if(!isset($_SESSION["results"]) && !isset($_SESSION["games"]))
        {
            $query = "SELECT * FROM leaderboard";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo "<table> <thead> <tr> <th>Username</th> <th>Games Won</th> <th>Games Played</th> <th>Time Played</th> </tr> </thead> <tbody>";
                    
            // Table Rows
            foreach ($results as $row) 
            {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row["username"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["games_won"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["games_played"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["time_played"]) . "</td>";
                echo "</tr>";
            }
            
            echo "</tbody> </table>";
        }
        if(isset($_SESSION["results"]))
        {
            $results = $_SESSION["results"];
            echo "<table> <thead> <tr> <th>Username</th> <th>Games Won</th> <th>Games Played</th> <th>Time Played</th> </tr> </thead> <tbody>";
                
            // Table Rows
            foreach ($results as $row) 
            {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row["username"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["games_won"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["games_played"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["time_played"]) . "</td>";
                echo "</tr>";
            }
            
            echo "</tbody> </table>";

            unset($_SESSION["results"]);
        }
        else if (isset($_SESSION["games"]))
        {
            $games = $_SESSION["games"];
            echo "<table> <thead> <tr> <th>Username</th> <th>Difficulty</th> <th>Result</th> <th>Time</th> </tr> </thead> <tbody>";
                
            // Table Rows
            foreach ($games as $game) 
            {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($_SESSION["user_username"]) . "</td>";
                echo "<td>" . htmlspecialchars($game["difficulty"]) . "</td>";
                echo "<td>" . htmlspecialchars($game["result"]) . "</td>";
                echo "<td>" . htmlspecialchars($game["time_spent"]) . "</td>";
                echo "</tr>";
            }
            echo "</tbody> </table>";

            unset($_SESSION["games"]);
        }
    ?>
    </div>

</body>

</html>
