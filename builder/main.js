var games = [];
var gameButtons = [];
var currentEditingGame = undefined;
var questionButtons = [];

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
        //currentEditingGame.questions[currentEditingGame.currentSelectedQuestion]
    }
}


class Game {
    constructor(id) {
        this.questions = [new Question()];
        this.id = id;
        this.name = "Game " + (this.id + 1)
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

class SingleAnswer extends Question {

}
init();