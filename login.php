<?php
    require_once 'includes/config_session.inc.php';
    require_once 'includes/login_view.inc.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minesweeper Login</title>
    <link href="css/style.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</head>

<body>
    <div id = "topBar">
        <a href="index.php">
            <img id="logo" src="./img/Fresno State.PNG" alt="Fresno State Logo">
        </a>        
        <a href="index.php" class="inGameLinks">Main Menu</a>
    </div>
    
    <h1>Enter Your Information</h1>

    <form action="includes/login.inc.php" method="POST" class = "userAuth" >

        <label for ="username">Username:</label>
        <input type="text" id="username" name="username">

        <label for ="pwd">Password:</label>
        <input type="password" id="pwd" name="pwd">

        <button id="userAuthBtn">Login</button>
    </form>

    <?php
        check_login_errors();
    ?>

    <img id ="bulldog" src = "./img/Bulldog.png">
    <img id ="bomb" src = "./img/Bomb.png">
</body>

</html>