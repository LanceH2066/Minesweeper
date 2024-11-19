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

            $signupData = [
                "username" => $username,
            ];
            $_SESSION["signup_data"] = $signupData;

            header("Location: ../signup.php");
            die();
        }

        create_user($pdo, $username, $pwd);

        require_once "login_model.inc.php";

        $result = get_user($pdo, $username);

        $newSessionId = session_create_id();
        $sessionId = $newSessionId . "_" . $result["id"];
        session_id($sessionId);

        $_SESSION["user_id"] = $result["id"];
        $_SESSION["user_username"] = htmlspecialchars($result["username"]);

        $_SESSION["last_regeneration"]=time();

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