<?php

if($_SERVER["REQUEST_METHOD"] =="POST")
{
    $username = $_POST["username"];
    $pwd = $_POST["pwd"];

    try 
    {
        require_once "dbh.inc.php";

        $query = "INSERT INTO users (username, pwd) VALUES (:username, :pwd);";

        $stmt = $pdo->prepare($query);

        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":pwd", $pwd);

        $stmt->execute();

        $pdo = null;
        $stmt = null;


        header("Location: ../index.html");

        die();
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