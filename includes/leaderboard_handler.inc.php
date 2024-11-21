<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try 
    {
        require_once "dbh.inc.php";
        require_once "config_session.inc.php";

        // Check if any radio button was selected, use default values if not
        $display = isset($_POST['display']) ? $_POST['display'] : 'best_players';
        $order = isset($_POST['order']) ? $_POST['order'] : 'ASC';
        $sort_by = isset($_POST['sort_by']) ? $_POST['sort_by'] : 'games_won';

        // Prepare SQL query with dynamic sorting options
        if($display == 'best_players')
        {
            $query = "SELECT * FROM leaderboard ORDER BY $sort_by $order";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $_SESSION["results"] = $results;
        }
        else if (isset($_SESSION["user_id"]))
        {
            if($sort_by=='games_won')
            {
                $sort_by = 'result';
            }
            else if($sort_by=='games_played')
            {
                $sort_by = 'difficulty';
            }
            else if($sort_by=='time_played')
            {
                $sort_by = 'time_spent';
            }
            $userId = $_SESSION["user_id"];
            $query = "SELECT * FROM games WHERE user_id = :user_id ORDER BY $sort_by $order";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(":user_id", $userId);
            $stmt->execute();
            $games = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $_SESSION["games"] = $games;
        }
        else
        {
            echo "You are not logged in!";
        }

        header("Location: ../leaderboard.php");

        $pdo = null;
        $stmt = null;

        die();
    } catch (PDOException $e) 
    {
        die("Query Failed: " . $e->getMessage());
    }
} 
else 
{
    header("Location: ../index.php");
}