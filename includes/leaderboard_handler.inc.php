<?php
    require_once "dbh.inc.php";
    require_once "config_session.inc.php";

    $query = "SELECT * FROM leaderboard";

    $stmt = $pdo->prepare($query);

    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $pdo = null;
    $stmt = null;

function displayResults($results)
{
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
}
