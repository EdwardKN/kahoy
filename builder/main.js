var games = [];
var gameButtons = [];
var currentEditingGame = undefined;
var questionButtons = [];

const questionTypes = ["True or False", "Single answer", "Multiple choice"]

function init() {
    document.getElementById("newGame")?.remove();
    let newButton = document.createElement("button");
    newButton.id = "newGame"
    newButton.innerText = "+"
    newButton.onclick = function () {
        games.push(new Game(games.length));
        init();
    }
    document.body.appendChild(newButton);

    gameButtons.forEach(e => e.remove());
    games.forEach(function (e, i) {
        gameButtons.push(document.createElement("button"));
        gameButtons[i].innerText = e.name;
        gameButtons[i].onclick = function () {
            currentEditingGame = e;
            init();
        }
        document.body.appendChild(gameButtons[i]);
    })

    if (currentEditingGame) {
        document.getElementById("Gamename")?.remove();
        let gameName = document.createElement("input");
        gameName.value = currentEditingGame.name;
        gameName.type = "text";
        gameName.id = "Gamename"
        document.body.appendChild(gameName);
        gameName.onchange = function () {
            currentEditingGame.changeName(gameName.value);
        }
        document.getElementById("newQuestion")?.remove();
        let newQuestionButton = document.createElement("button");
        newQuestionButton.id = "newQuestion"
        newQuestionButton.innerText = "+"
        newQuestionButton.onclick = function () {
            currentEditingGame.questions.push(new Question());
            init();
        }
        document.body.appendChild(newQuestionButton);

        questionButtons.forEach(e => e.remove());
        currentEditingGame.questions.forEach(function (e, i) {
            questionButtons.push(document.createElement("button"));
            questionButtons[i].innerText = "Fråga " + (i + 1);
            questionButtons[i].onclick = function () {
                currentEditingGame.currentSelectedQuestion = i;
                init();
            }
            document.body.appendChild(questionButtons[i]);
        })
        document.getElementById("typebutton")?.remove();
        let typebutton = document.createElement("select");
        typebutton.id = "typebutton"
        questionTypes.forEach(e => {
            let option = document.createElement("option");
            option.value = e;
            option.innerText = e;
            typebutton.appendChild(option);
        })

        document.body.appendChild(typebutton);

        //currentEditingGame.questions[currentEditingGame.currentSelectedQuestion]
    }
}

function loadGames() {
    let gamesToLoad = JSON.parse(localStorage.getItem("games"))
    console.log(gamesToLoad);

    gamesToLoad.forEach(e => {
        games.push(new Game(e.id, e.name, e.questions));
    })
}

class Game {
    constructor(id, name, questions) {
        this.questions = questions ? questions : [new Question()];
        this.id = id;
        this.name = name ? name : "Game " + (this.id + 1)
        this.currentSelectedQuestion = 0;
    }
    changeName(newName) {
        gameButtons[this.id].innerText = newName;
        this.name = newName;
    }
}

class Question {
    constructor() {
    }
}

window.onbeforeunload = function (e) {

    localStorage.setItem("games", JSON.prune(games));
    e.preventDefault();
}
loadGames();
init();