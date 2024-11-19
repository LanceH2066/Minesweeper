<?php

declare(strict_types=1);

function check_login_errors()
{
    if(isset($_SESSION["errors_login"]))
    {
        $errors = $_SESSION["errors_login"];

        echo "<br>";

        foreach($errors as $error)
        {
            echo '<h2>' . $error . '</h2>';
        }

        unset($_SESSION["errors_login"]);
    }
}

function check_logged_in()
{
    if(isset($_SESSION["user_id"]))
    {
        echo '<h1>User:' . htmlspecialchars($_SESSION["user_username"]) . '</h1>';
        echo '
        <form action="includes/logout.inc.php" method="post">
            <button id="logoutBtn"><h1>Logout</h1></button>       
        </form>';
    }
    else
    {
        echo '<h1>Not Logged In</h1>';
    }
}
