document.addEventListener("DOMContentLoaded", () => {
    const displayModeButton = document.getElementById("displayMode");
    const sortButtonsContainer = document.getElementById("sortButtons");
    const leaderboardContainer = document.getElementById("leaderboardContainer");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    // Initial mode
    let displayMode = "all_players";
    let order = "DESC";
    let sortBy = "games_won";  // Default sort for all players
    let currentPage = 1;  // Default page
    const entriesPerPage = 15;
    let hasNextPage = true;


    // Update sorting buttons based on display mode
    const updateSortButtons = () => {
        sortButtonsContainer.innerHTML = "";
        const isAllPlayers = displayMode === "all_players";
        const buttonOptions = isAllPlayers
            ? [
                { id: "games_won", text: "Games Won" },
                { id: "games_played", text: "Games Played" },
                { id: "time_played", text: "Time Played" },
            ]
            : [
                { id: "difficulty", text: "Difficulty" },
                { id: "result", text: "Result" },
                { id: "time_played", text: "Time Played" },
            ];

        // Add ascending/descending buttons
        const orderButton = document.createElement("button");
        orderButton.textContent = `Order: ${order}`;
        orderButton.addEventListener("click", () => {
            order = order === "ASC" ? "DESC" : "ASC";
            orderButton.textContent = `Order: ${order}`;
            fetchLeaderboard();
        });
        sortButtonsContainer.appendChild(orderButton);

        // Add sort-by buttons
        buttonOptions.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option.text;
            button.addEventListener("click", () => {
                sortBy = option.id;
                updateSelectedButton(button);
                fetchLeaderboard();
            });
            sortButtonsContainer.appendChild(button);
        });
    };
    // Update selected class on the sorting button
    const updateSelectedButton = (clickedButton) => {
        // Remove selected class from all buttons
        const allButtons = sortButtonsContainer.querySelectorAll("button");
        allButtons.forEach(button => button.classList.remove("selected"));
        
        // Add selected class to the clicked button
        clickedButton.classList.add("selected");
    };

    // Fetch leaderboard data
    const fetchLeaderboard = () => {
        const validSortOptions = displayMode === "all_players"
            ? ["games_won", "games_played", "time_played"]
            : ["time_played", "difficulty", "result"];

        if (!validSortOptions.includes(sortBy)) {
            sortBy = validSortOptions[0];
        }

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "includes/fetch_leaderboard.inc.php", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                renderLeaderboard(data);
            }
        };
        xhr.send(JSON.stringify({
            displayMode,
            order,
            sortBy,
            currentPage,
            entriesPerPage,
        }));
    };


    // Render leaderboard data
    const renderLeaderboard = (data) => 
    {
        leaderboardContainer.innerHTML = "";

        hasNextPage = data.hasNextPage;

        if (data && Array.isArray(data.entries)) {
            const table = document.createElement("table");
            table.innerHTML = "<thead><tr>" +
                (displayMode === "all_players"
                    ? "<th>Username</th><th>Games Won</th><th>Games Played</th><th>Time Played</th>"
                    : "<th>Username</th><th>Difficulty</th><th>Result</th><th>Time</th>") +
                "</tr></thead><tbody>";

            data.entries.forEach(row => {
                const tr = document.createElement("tr");
                Object.values(row).forEach(value => {
                    const td = document.createElement("td");
                    td.textContent = value;
                    tr.appendChild(td);
                });
                table.querySelector("tbody").appendChild(tr);
            });

            table.innerHTML += "</tbody></table>";
            leaderboardContainer.appendChild(table);
        } 
        else 
        {
            leaderboardContainer.innerHTML = "<p>Sign In To See Your Games Here!</p>";
        }
    };

    // Pagination buttons
    prevButton.addEventListener("click", () => 
    {
        if (currentPage > 1) {
            currentPage--;
            fetchLeaderboard();
        }
    });

    nextButton.addEventListener("click", () => 
    {
        if(hasNextPage)
        {
            currentPage++;
            fetchLeaderboard();
        }
    });

    // Toggle display mode
    displayModeButton.addEventListener("click", () => {
        displayMode = displayMode === "all_players" ? "your_games" : "all_players";
        displayModeButton.textContent = `Display: ${displayMode === "all_players" ? "All Players" : "Your Games"}`;
        updateSortButtons();
        fetchLeaderboard();
    });

    // Initial load
    updateSortButtons();
    fetchLeaderboard();
});
