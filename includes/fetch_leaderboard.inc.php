<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    try 
    {
        require_once "dbh.inc.php";
        require_once "config_session.inc.php";
    
        $data = json_decode(file_get_contents("php://input"), true);
        $displayMode = $data["displayMode"];
        $order = $data["order"];
        $sortBy = $data["sortBy"];
        $page = $data["currentPage"];
        $entriesPerPage = 15;
        $offset = ($page - 1) * $entriesPerPage;

        if ($displayMode === "all_players") 
        {
            $query = "SELECT username, games_won, games_played, time_played FROM leaderboard ORDER BY $sortBy $order LIMIT $entriesPerPage OFFSET $offset";
            $stmt = $pdo->prepare($query);

            // Count total entries to calculate if there's a next page
            $countQuery = "SELECT COUNT(*) FROM leaderboard";  
            $countStmt = $pdo->prepare($countQuery);
            $countStmt->execute();
            $totalEntries = $countStmt->fetchColumn();
            $hasNextPage = ($page * $entriesPerPage) < $totalEntries;
        } 
        else if (isset($_SESSION["user_id"])) 
        {
            $userId = $_SESSION["user_id"];
            $query = "SELECT username, difficulty, result, time_played FROM games WHERE user_id = :user_id ORDER BY $sortBy $order LIMIT $entriesPerPage OFFSET $offset";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(":user_id", $userId, PDO::PARAM_INT);

            // Count total entries to calculate if there's a next page
            $countQuery = "SELECT COUNT(*) FROM games WHERE user_id = :user_id";  
            $countStmt = $pdo->prepare($countQuery);
            $countStmt->bindParam(":user_id", $userId, PDO::PARAM_INT);
            $countStmt->execute();
            $totalEntries = $countStmt->fetchColumn();
            $hasNextPage = ($page * $entriesPerPage) < $totalEntries;            
        }
        else 
        {
            echo json_encode([
                "status" => "error",
                "message" => "User is not logged in."
            ]);
            die();
        }

        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format time_played from seconds to hours, minutes, seconds
        foreach ($results as &$result) {
            $seconds = $result['time_played'];
            $hours = floor($seconds / 3600);
            $minutes = floor(($seconds % 3600) / 60);
            $seconds = $seconds % 60;
            $result['time_played'] = sprintf("%02d:%02d:%02d", $hours, $minutes, $seconds);
        }

        echo json_encode([
            'entries' => $results,
            'hasNextPage' => $hasNextPage
        ]);

        $pdo = null;
        $stmt = null;

        die();
    } 
    catch (PDOException $e) 
    {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
