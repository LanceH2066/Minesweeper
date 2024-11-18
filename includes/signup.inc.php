<?php

if($_SERVER["REQUEST_METHOD"] =="POST")
{
    $username = $_POST["username"];
    $pwd = $_POST["pwd"];

    try 
    {
        require_once "dbh.inc.php";
        require_once "signup_model.inc.php";
        require_once "signup_contr.inc.php";

        $errors = [];

        // ERROR HANDLERS
        if(is_input_empty($username, $pwd))
        {
            $errors["empty_input"] = "Fill in all fields!";
        }
        if(is_username_taken($pdo, $username))
        {
            $errors["username_taken"] = "Username already taken!";
        }
        
        require_once "config_session.inc.php";

        if($errors)
        {
            $_SESSION["errors_signup"] = $errors;
            header("Location: ../signup.php");
        }

        create_user($pdo, $username, $pwd);

        header("Location: ../index.php");

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