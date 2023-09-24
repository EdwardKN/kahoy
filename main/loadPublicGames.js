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
var viewingQuestion = undefined;

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
            viewQuestions.className = "viewQuestions"

            viewQuestions.onclick = function () {
                if(viewingQuestion != e){
                    viewQuestion(e);
                    viewQuestions.textContent = "Hide Questions"
                } else{
                    closeQuestion()
                    viewQuestions.textContent = "View Questions"
                }
                
            }
            gameDiv.appendChild(viewQuestions);


            document.getElementById("gameContainer").appendChild(gameDiv);
        }
    });
}

function viewQuestion(game){
    closeQuestion();
    viewingQuestion = game;

    document.getElementById("gameBar").style.width = "calc(50% - 60px)";

    let questionDiv = document.createElement("div");

    questionDiv.id = "questionDiv";
    questionDiv.className = "topBar";


    
    document.body.appendChild(questionDiv)

    let questionContainer = document.createElement("container");

    questionContainer.id = "questionContainer";
    
    questionDiv.appendChild(questionContainer)

    let headerDiv = document.createElement("div");

    headerDiv.style.height = "100px"


    questionContainer.appendChild(headerDiv)

    let header =  document.createElement("h1");

    header.textContent = "Questions";

    headerDiv.appendChild(header)

    game.questions.forEach(e =>{
        let div = document.createElement("div");

        div.textContent = e.question;
        div.className = "questionDiv"

        div.onclick = function(){
            div.selected = !div.selected;

            if(div.selected){
                div.style.height = (e.answers.length * 50 + 40) + "px"
                Array.from(div.children).forEach(e => {if(e.nodeName == "A"){e.remove()}});
                e.answers.forEach(e =>{
                    let tmp = document.createElement("a");
                    tmp.textContent = e.text + (e.rightAnswer ? "✔️" : "❌");
                    tmp.className = "answer"

                    div.appendChild(tmp);
                })
            }else{
                Array.from(div.children).forEach(e => {if(e.nodeName == "A"){e.remove()}});
                div.style.height = "40px"
            }
        }

        questionContainer.appendChild(div)
    })
}

function closeQuestion(){    
    viewingQuestion = undefined;
    Array.from(document.getElementsByClassName("viewQuestions")).forEach(e => e.textContent = "View Questions");

    document.getElementById("gameBar").style.width = "calc(100% - 60px)";
    document.getElementById("questionDiv")?.remove()
}