<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    $username = $_POST["username"];
    $pwd = $_POST["pwd"];

    try 
    {
        require_once "dbh.inc.php";

        // Query to fetch user based on username
        $query = "SELECT pwd FROM users WHERE username = :username";

        $stmt = $pdo->prepare($query);

        $stmt->bindParam(":username", $username);

        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) 
        {
            // Verify the password
            if ($pwd == $user["pwd"]) 
            {
                // Start a session for the logged-in user
                session_start();
                $_SESSION["username"] = $username;
        
                header("Location: ../index.php");
        
                exit();
            } 
            else 
            {
                // Incorrect password
                header("Location: ../login.html?error=IncorrectPassword");
                exit();
            }
        } else 
        {
            // User not found
            header("Location: ../login.html?error=UserNotFound");
            exit();
        }
    } catch (PDOException $e) 
    {
        die("Query Failed: " . $e->getMessage());
    }
} else 
{
    header("Location: ../index.php");
}
