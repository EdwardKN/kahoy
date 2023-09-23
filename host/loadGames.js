const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
if(params?.private){
    getUser(function (user) {

        let gamesFromUser = JSON.parse(decodeURIComponent(user.games));

        let gameToStart = gamesFromUser[JSON.parse(params.id)];
    })
}else if(params?.game){
    let gameToStart = JSON.parse(params.game)
}
