let searchBar = document.createElement("input");
searchBar.type = "text";
searchBar.id = "searchBar";

searchBar.onkeydown = function (event) {
    if (event.keyCode == 13) {
        showGames(document.getElementById("searchBar").value)
    }
}

document.getElementById("searchContainer").appendChild(searchBar);

let searchButton = document.createElement("button");
searchButton.textContent = "Search"

searchButton.onclick = function () {
    showGames(document.getElementById("searchBar").value)
}

document.getElementById("searchContainer").appendChild(searchButton);

var games = [];

getPublicGames(function (gamesToShow) {
    gamesToShow.forEach(e => {
        e.questions = e.questions.filter(g => (g.question != '' && g.answers.length > 1))
    })
    gamesToShow = gamesToShow.filter(e => e.questions.length > 0)
    games = shuffle(gamesToShow);
    showGames();
})

function showGames(key) {
    Array.from(document.getElementById("gameContainer")?.children).forEach(g => g.remove());
    games.forEach(function (e, i) {
        if (e.name.toUpperCase().replaceAll(" ", "").includes(key?.toUpperCase().replaceAll(" ", "")) || !key) {
            let gameDiv = document.createElement("div")
            gameDiv.className = "game"

            let gameName = document.createElement("h2");
            gameName.textContent = e.name;

            gameDiv.appendChild(gameName)

            let playButton = document.createElement("button")
            playButton.textContent = "Host Game"

            playButton.onclick = function () {
                localStorage.setItem('gameToStart', JSON.prune(e))
                window.location.replace('../host/host.html');

            }
            gameDiv.appendChild(playButton);

            let viewQuestions = document.createElement("button")
            viewQuestions.textContent = "View Questions"
            viewQuestions.id = "viewQuestions"

            viewQuestions.onclick = function () {

            }
            gameDiv.appendChild(viewQuestions);


            document.getElementById("gameContainer").appendChild(gameDiv);
        }
    });
}