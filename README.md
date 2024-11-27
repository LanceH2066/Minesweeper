Minesweeper - Created by Lance Heinrich

Minesweeper is a web-based game where players must uncover tiles on a grid, avoiding mines and trying to clear the board. 
The project is built using PHP, JavaScript, HTML, CSS, and a MySQL database to manage users and leaderboard data.
NOTE: For this project I tried to use some MVC (Model View Controller) Design methods to practice for any future careers where I might need such techniques.

Installation and Setup
Ensure XAMPP is installed.
Extract the project files (Folder Name: Minesweeper) into the server's root directory (htdocs).
Ensure APACHE and MYSQL servers are running.

Database Configuration:
NO CONFIGURATION REQUIRED
DATABASE NAME: MinesweeperDB
USER: root , PWD: ""
dbh.inc.php automatically creates the database and tables on the first load, no need to change user or database names around.

Load Sample Data:
The JSON data in data.json is imported automatically via import_json_data.inc.php.
IF YOU WANT TO RESET TO THIS DEFAULT DATA JUST DELETE THE DATABASE ON PHPMYADMIN, THEN GO THE THE WEBSITE AGAIN AND IT WILL GENERATE.

Start the Server:
Run your local server and access the application in the browser at:
http://localhost/Minesweeper/

Usage
Index Page (index.php): Navigate to Play, How To Play, Login, Sign Up, Leaderboard, or Contact Info. You can also logout if signed in (top left corner).
Game Page (game.html): Choose your Difficulty (map size), Win Condition, Theme, First Move, and Mines. Start a new game by clicking the "Start Game" button. 
                        If you select no options defaults are: Easy,Clear Grid,Fresno State, No Auto Move, and 10 Mines.
Leaderboard Page (leaderboard.html): View other players Games Won/Played & Time Played. Or switch Display mode to see all of your games if you're signed in!
Sign Up (signup.php): Create a new account to save your games.
Log In (login.php): Log in to track your leaderboard stats and game history.
Help Page (help.html): Get instructions on how to play Minesweeper.
Contact Page (contact.html): Find contact details for further inquiries.

Features
Play Game: Start a game, uncover tiles, and avoid mines.
Timer: Tracks time and shows it in the MM:SS format.
Leaderboard: Displays the top players, sorted by time, number of games played, or number of games won.
Themes: Switch between the Fresno State theme and the classic Minesweeper theme.
Sounds: Try not to get too anxious with the suspensful music and scary mine explosions!
Responsive UI: Engaging ui that is fun to play with, highlights, borders, glow all the fun stuff.

Project Structure

Frontend Files

audio/
Contains sound files for the game: winning, background music, and mine explosion sounds.

css/style.css
Stylesheet for the Minesweeper Website.

img/
fresno-state-bulldog.png: Background image with Fresno State Bulldog theme.
logo.png: Fresno State logo image.
mine.png: Image for the Minesweeper bomb in the background.

js/
game.js: Main script that handles game logic like initializing the board with the users settings, checking win conditions, and starting a new game.
board.js: Manages the game board, creating and rendering tiles.
tile.js: Handles individual tile logic, including uncovering tiles and flagging mines.
leaderboard.js: Manages leaderboard features, sorting, and displaying player rankings.

Backend Files
includes/

CONNECTION, SESSION, AND DEFAULT DATA

dbh.inc.php: Establishes a connection to the database and creates tables if they do not exist.
config_session.inc.php: Manages sessions, including session regeneration for security.
import_json_data.inc.php: Imports test data from a JSON file (data.json) for quick setup.
import_json_data_model.inc.php: Seperates queries into functions in a seperate php file.

LOGIN/SIGNUP

login.inc.php: Main PHP for logging in, uses functions from all 3 MVC Files
login_model.inc.php: Database Queries
login_view.inc.php: UI / Error Display
login_contr.inc.php: Basic logical comparison funcitons

signup.inc.php: Main PHP for Signup, uses functions from all 3 MVC Files
signup_model.inc.php: Database Queries
signup_view.inc.php: UI / Error Display
signup_contr.inc.php: Basic logical comparison funcitons

LEADERBOARD

update_leaderboard.inc.php: Handles updating leaderboard and games table in database after each game.
fetch_leaderboard.inc.php: Handles fetching leaderboard data and sorting.


PAGES

index.php: Main entry point for navigating between different pages.
login.php: Handles user authentication.
signup.php: Manages user sign-up and account creation.
game.html: Displays the game board and handles game interaction.
leaderboard.html: Shows the leaderboard with game scores.
help.html: Provides instructions for playing the game.
contact.html: Displays contact information.

DATA

data.json: Contains sample game data for testing purposes.

Contact Info

Name: Lance Heinrich
Email: heinrichlance2066@gmail.com 
Phone #: (559)572-2299
