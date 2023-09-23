let searchBar = document.createElement("input");
searchBar.type = "text";

document.getElementById("searchContainer").appendChild(searchBar);

let searchButton = document.createElement("button");
searchButton.textContent = "Search"

document.getElementById("searchContainer").appendChild(searchButton);

getPublicGames(function(games){
    games.forEach(function(e,i){
        let gameDiv = document.createElement("div")
        gameDiv.className = "game"

        let gameName = document.createElement("h2");
        gameName.textContent = e.name;

        gameDiv.appendChild(gameName)

        let playButton = document.createElement("button")
        playButton.textContent = "Start Game"

        playButton.onclick = function(){
            window.location.replace('../host/host.html?public=true&id=' + i);
        }
        gameDiv.appendChild(playButton);

        let viewQuestions = document.createElement("button")
        viewQuestions.textContent = "View Questions"
        viewQuestions.id = "viewQuestions"

        viewQuestions.onclick = function(){

        }
        gameDiv.appendChild(viewQuestions);


        document.getElementById("gameContainer").appendChild(gameDiv);
    });
})