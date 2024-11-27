<?php

if($_SERVER["REQUEST_METHOD"] =="POST")
{
    try 
    {
        require_once "dbh.inc.php";
        require_once "config_session.inc.php";

        $data = json_decode(file_get_contents('php://input'), true);

        if(isset( $_SESSION["user_username"]))
        {
            $username = $_SESSION["user_username"];
            $id = $_SESSION["user_id"];
        }
        else
        {
            $username = null;
            $id = null;
        }

        if(!$username)
        {
            $pdo = null;
            $stsm = null;
    
            echo json_encode([
                "status" => "error",
                "message" => "User is not logged in."
            ]);

            die();
        }

        $difficulty = htmlspecialchars($data['difficulty']);
        $result = htmlspecialchars($data['result']);
        $time = htmlspecialchars($data['time']);
        $gamesPlayed = 1;

        if($result == "win")
        {
            $gamesWon = 1;   
        }
        else
        {
            $gamesWon = 0;   
        }

        $query = "INSERT INTO games (user_id,username, difficulty, result, time_played) VALUES (:user_id, :username, :difficulty, :result, :time_played)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":user_id", $id);
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":difficulty", $difficulty);
        $stmt->bindParam(":result", $result);
        $stmt->bindParam(":time_played", $time);
        $stmt->execute();

        $checkQuery = "SELECT * FROM leaderboard WHERE user_id = :user_id";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->bindParam(":user_id", $id);
        $checkStmt->execute();
        $existingEntry = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if ($existingEntry) 
        {
            $updateQuery = "UPDATE leaderboard 
                            SET 
                                games_won = games_won + :games_won,
                                games_played = games_played + :games_played,
                                time_played = time_played + :time_played
                            WHERE user_id = :user_id";
            $updateStmt = $pdo->prepare($updateQuery);
            $updateStmt->bindParam(":games_won", $gamesWon);
            $updateStmt->bindParam(":games_played", $gamesPlayed);
            $updateStmt->bindParam(":time_played", $time);
            $updateStmt->bindParam(":user_id", $id);
            $updateStmt->execute();
        } 
        else 
        {
            // Insert a new entry if no existing entry is found
            $insertQuery = "INSERT INTO leaderboard (username, games_won, games_played, time_played, user_id) 
                            VALUES (:username, :games_won, :games_played, :time_played, :user_id)";
            $insertStmt = $pdo->prepare($insertQuery);
            $insertStmt->bindParam(":username", $username);
            $insertStmt->bindParam(":games_won", $gamesWon);
            $insertStmt->bindParam(":games_played", $gamesPlayed);
            $insertStmt->bindParam(":time_played",$time);
            $insertStmt->bindParam(":user_id", $id);
            $insertStmt->execute();
        }

        echo json_encode([
            "status" => "success",
            "message" => "Game result saved successfully!"
        ]);

        $pdo = null;
        $stsm = null;

        die();
    } 
    catch (PDOException $e) 
    {
        die("Query Failed: " . $e->getMessage());
    }
}
else
{
    header("Location: ../index.php");
    die();
}