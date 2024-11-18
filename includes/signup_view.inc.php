<?php

declare(strict_types=1);

function signup_inputs()
{
    if(isset($_SESSION["signup_data"]["username"]) && !isset($_SESSION["errors_signup"]["username_taken"]))
    {
        echo '<input type="text" id="username" name="username" placeholder = "Username" value="'. $_SESSION["signup_data"]["username"].'">';
    }
    else
    {
        echo '<input type="text" id="username" name="username">';
    }
    echo '<input type="password" id="pwd" name="pwd" placeholder = "Password">';
    unset($_SESSION["signup_data"]);
}

function check_signup_errors()
{
    if(isset($_SESSION['errors_signup']))
    {
        $errors = $_SESSION['errors_signup'];

        echo "<br>";

        foreach($errors as $error)
        {
            echo '<h2>' . $error . '</h2>';
        }

        unset($_SESSION['errors_signup']);
    }
}

function check_account_created()
{
    if(isset($_GET["signup"]) && $_GET["signup"]==="success")
    {
        echo "<br>";
        echo "<h1>Account Created!</h1>";
    }
}
