<?php

require_once 'includes/signup_model.inc.php';
require_once 'includes/signup_contr.inc.php';
require_once 'includes/import_json_data_model.inc.php';

$jsonData = file_get_contents('data.json');
$data = json_decode($jsonData, true);

try 
{
    foreach ($data['users'] as $user) 
    {
        if(!is_username_taken($pdo, $user['username']))
        {
            create_user($pdo, $user['username'], $user['pwd']);
        }
    }

    if(checkLeaderboardEmpty($pdo))
    {
        foreach ($data['leaderboard'] as $entry) 
        {
            insert_into_leaderboard($pdo, $entry);
        }
    }

    if(checkGamesEmpty($pdo))
    {
        foreach ($data['games'] as $game) 
        {
            insert_into_games($pdo, $game);
        }
    }

} catch (PDOException $e) 
{
    echo "Error: " . $e->getMessage();
}
