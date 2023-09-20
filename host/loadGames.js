var games = JSON.parse(localStorage.getItem("games"));


games.forEach(e => {
    let tmpButton = document.createElement("button");

    tmpButton.innerText = e.name;

    document.body.appendChild(tmpButton);
})