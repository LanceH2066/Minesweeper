<?php

function insert_into_leaderboard($pdo, $entry)
{
    // Check if the entry already exists
    $checkQuery = "SELECT COUNT(*) FROM leaderboard WHERE username = :username AND games_won = :games_won AND games_played = :games_played AND time_played = :time_played";
    $checkStmt = $pdo->prepare($checkQuery);
    $checkStmt->bindParam(":username", $entry['username']);
    $checkStmt->bindParam(":games_won", $entry['games_won']);
    $checkStmt->bindParam(":games_played", $entry['games_played']);
    $checkStmt->bindParam(":time_played", $entry['time_played']);
    $checkStmt->execute();
    $exists = $checkStmt->fetchColumn();

    if (!$exists) 
    {
        // Insert if the entry does not exist
        $query = "INSERT INTO leaderboard (username, games_won, games_played, time_played,user_id) VALUES (:username, :games_won, :games_played, :time_played, :user_id)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":username", $entry['username']);
        $stmt->bindParam(":games_won", $entry['games_won']);
        $stmt->bindParam(":games_played", $entry['games_played']);
        $stmt->bindParam(":time_played", $entry['time_played']);
        $stmt->bindParam(":user_id", $entry['user_id']);
        $stmt->execute();
    }
}

function insert_into_games($pdo, $game)
{
    // Check if the game entry already exists
    $checkQuery = "SELECT COUNT(*) FROM games WHERE start_time = :start_time AND end_time = :end_time AND result = :result AND time_spent = :time_spent";
    $checkStmt = $pdo->prepare($checkQuery);
    $checkStmt->bindParam(":start_time", $game['start_time']);
    $checkStmt->bindParam(":end_time", $game['end_time']);
    $checkStmt->bindParam(":result", $game['result']);
    $checkStmt->bindParam(":time_spent", $game['time_spent']);
    $checkStmt->execute();
    $exists = $checkStmt->fetchColumn();

    if (!$exists) 
    {
        // Insert if the game does not exist
        $query = "INSERT INTO games (user_id, start_time, end_time, result, time_spent) VALUES (:user_id, :start_time, :end_time, :result, :time_spent)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":user_id", $game['user_id']);
        $stmt->bindParam(":start_time", $game['start_time']);
        $stmt->bindParam(":end_time", $game['end_time']);
        $stmt->bindParam(":result", $game['result']);
        $stmt->bindParam(":time_spent", $game['time_spent']);
        $stmt->execute();
    }
}
