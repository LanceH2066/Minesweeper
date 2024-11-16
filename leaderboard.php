<?php

if($_SERVER["REQUEST_METHOD"] =="POST")
{
    try 
    {
        require_once "includes/dbh.inc.php";

        $query = "SELECT * FROM leaderboard";

        $stmt = $pdo->prepare($query);

        //$stmt->bindParam(":username", $username);

        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $pdo = null;
        $stmt = null;
    } 
    catch (PDOException $e) 
    {
        die("Query Failed: " . $e->getMessage());
    }
}
else
{
    header("Location: ../index.html");
}
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
        <a href="index.html">
            <img id="logo" src="./img/Fresno State.PNG" alt="Fresno State Logo">
        </a>        
        <a href="index.html" class="inGameLinks">Main Menu</a>
    </div>

    <h1>Leaderboard</h1>

    <div id="leaderboardContainer">
    <?php
        if (empty($results)) 
        {
            echo "<p>No Results</p>";
        } else 
        {
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
    ?>
    </div>

    <img id ="bulldog" src = "./img/Bulldog.png">
    <img id ="bomb" src = "./img/Bomb.png">

</body>

</html>
