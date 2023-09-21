var games = JSON.parse(localStorage.getItem("games")) || [];

games.forEach(e => {
    let tmpButton = document.createElement("button");

    tmpButton.innerText = e.name;
    tmpButton.className = 'game-button'

    tmpButton.onclick = () => {
        startGame(e)
    }

    document.body.appendChild(tmpButton);
})