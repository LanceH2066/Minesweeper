<?php
    require_once 'includes/dbh.inc.php';
    require_once 'includes/import_json_data.inc.php';
    require_once 'includes/config_session.inc.php';
    require_once 'includes/login_view.inc.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minesweeper Main Menu</title>
    <link href="css/style.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</head>

<body>
    <div id = "topBar">
        <a href="index.php">
            <img id="logo" src="./img/Fresno State.PNG" alt="Fresno State Logo">
        </a>        
        <h1>Minesweeper</h1>

        <div id = "accountCreated">
            <?php
                check_logged_in();
            ?>
        </div>
    </div>
     
    <div class="container">

        <div id="navMenu">
            <a href="game.html" class="button">Play Game</a>                <!-- Link to game.html -->
            <a href="help.html" class="button">How to Play</a>              <!-- Link to help.html -->
            <a href="login.php" class="button">Login</a>                   <!-- Link to login.php -->
            <a href="signup.php" class="button">Sign Up</a>                <!-- Link to signup.php -->
            <a href="leaderboard.html" class="button">Leaderboard</a>        <!-- Link to signup.php -->     
            <a href="contact.html" class="button">Contact Info</a>          <!-- Link to contact.html -->
        </div>
        <img id ="bulldog" src = "./img/Bulldog.png">
        <img id ="bomb" src = "./img/Bomb.png">

    </div>

</body>

</html>