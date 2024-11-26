<?php
function checkLeaderboardEmpty($pdo)
{
    // Query to count all rows in the leaderboard table
    $query = "SELECT COUNT(*) FROM leaderboard";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    // Fetch the count
    $rowCount = $stmt->fetchColumn();
    
    // Return true if the count is 0, otherwise false
    return $rowCount == 0;
}

function insert_into_leaderboard($pdo, $entry)
{
    $query = "INSERT INTO leaderboard (username, games_won, games_played, time_played, user_id) VALUES (:username, :games_won, :games_played, :time_played, :user_id)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":username", $entry['username']);
    $stmt->bindParam(":games_won", $entry['games_won']);
    $stmt->bindParam(":games_played", $entry['games_played']);
    $stmt->bindParam(":time_played", $entry['time_played']);
    $stmt->bindParam(":user_id", $entry['user_id']);
    $stmt->execute();
}

function checkGamesEmpty($pdo)
{
    // Query to count all rows in the leaderboard table
    $query = "SELECT COUNT(*) FROM games";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    // Fetch the count
    $rowCount = $stmt->fetchColumn();
    
    // Return true if the count is 0, otherwise false
    return $rowCount == 0;
}

function insert_into_games($pdo, $game)
{
    $query = "INSERT INTO games (user_id, difficulty, result, time_spent) VALUES (:user_id, :difficulty, :result, :time_spent)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":user_id", $game['user_id']);
    $stmt->bindParam(":difficulty", $game['difficulty']);
    $stmt->bindParam(":result", $game['result']);
    $stmt->bindParam(":time_spent", $game['time_spent']);
    $stmt->execute();
}
