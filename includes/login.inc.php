<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    $username = $_POST["username"];
    $pwd = $_POST["pwd"];

    try 
    {
        require_once "dbh.inc.php";
        require_once "login_model.inc.php";
        require_once "login_contr.inc.php";

        $errors = [];

        // ERROR HANDLERS
        if(is_input_empty($username, $pwd))
        {
            $errors["empty_input"] = "Fill in all fields!";
        }
        
        $result = get_user($pdo, $username);

        if(is_username_wrong($result))
        {
            $errors["login_incorrect"] = "Username does not exist!";
        }
        if(!is_username_wrong($result)&&is_password_wrong($pwd, $result["pwd"]))
        {
            $errors["login_incorrect"] = "Incorrect password!";
        }

        require_once "config_session.inc.php";

        if($errors)
        {
            $_SESSION["errors_login"] = $errors;

            header("Location: ../login.php");
            die();
        }

        $newSessionId = session_create_id();
        $sessionId = $newSessionId . "_" . $result["id"];
        session_id($sessionId);

        $_SESSION["user_id"] = $result["id"];
        $_SESSION["user_username"] = htmlspecialchars($result["username"]);

        $_SESSION["last_regeneration"]=time();

        header("Location: ../index.php");

        $pdo = null;
        $stmt = null;

        die();
    } catch (PDOException $e) 
    {
        die("Query Failed: " . $e->getMessage());
    }
} else 
{
    header("Location: ../index.php");
}
