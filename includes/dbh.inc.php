<?php

$host = "localhost";
$dbname = "MinesweeperDB";
$dbusername = "root";
$dbpassword = "";

try 
{
    // Connect to MySQL server
    $pdo = new PDO("mysql:host=$host", $dbusername, $dbpassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create the database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $dbname");

    // Connect to the MinesweeperDB
    $pdo->exec("USE $dbname");

    // Create the `users` table if it doesn't exist
    $createUsersTable = "
        CREATE TABLE IF NOT EXISTS users (
            id INT(11) NOT NULL AUTO_INCREMENT,
            username VARCHAR(30) NOT NULL,
            pwd VARCHAR(255) NOT NULL,
            PRIMARY KEY (id)
        );
    ";
    $pdo->exec($createUsersTable);

    // Create the `leaderboard` table if it doesn't exist
    $createLeaderboardTable = "
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INT(11) NOT NULL AUTO_INCREMENT,
            username VARCHAR(30) NOT NULL,
            games_won INT(11) NOT NULL,
            games_played INT(11) NOT NULL,
            time_played TIME NOT NULL,
            user_id INT(11),
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
        );
    ";

    $pdo->exec($createLeaderboardTable);

        // Create the `games` table if it doesn't exist
        $createGamesTable = "
        CREATE TABLE IF NOT EXISTS games (
            id INT(11) NOT NULL AUTO_INCREMENT,
            user_id INT(11),
            start_time DATETIME NOT NULL,
            end_time DATETIME,
            result ENUM('win', 'lose') NOT NULL,
            time_spent TIME NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
        );
    ";
    $pdo->exec($createGamesTable);

} catch (PDOException $e) 
{
    echo "Connection or operation failed: " . $e->getMessage();
}
