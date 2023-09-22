getUser(function(user){
    let games = user?.games ? JSON.parse(decodeURIComponent(user.games)) : [];

    games.forEach(e => {
        let tmpButton = document.createElement("button");
    
        tmpButton.innerText = e.name;
    
        document.body.appendChild(tmpButton);
    })
})


