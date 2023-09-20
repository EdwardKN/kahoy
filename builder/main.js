var games = [];
var gameButtons = [];
var currentEditingGame = undefined;
var questionButtons = [];

const questionTypes = ["Single answer", "Multiple choice"]

function init() {
    document.getElementById("newGame")?.remove();
    let newButton = document.createElement("button");
    newButton.id = "newGame"
    newButton.innerText = "New Game"
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
        document.getElementById("removeGame")?.remove();
        if (games.length > 1) {
            let removeGame = document.createElement("button");
            removeGame.id = "removeGame";
            removeGame.innerText = "Remove Game"

            removeGame.onclick = function () {
                games.splice(currentEditingGame.id, 1)
                currentEditingGame = games[0];
                init();
            }
            document.body.appendChild(removeGame);
        }


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
        newQuestionButton.innerText = "New Question"
        newQuestionButton.onclick = function () {
            currentEditingGame.questions.push(new Question());
            init();
        }
        document.body.appendChild(newQuestionButton);

        questionButtons.forEach(e => e.remove());
        currentEditingGame.questions.forEach(function (e, i) {
            questionButtons.push(document.createElement("button"));
            questionButtons[i].innerText = "Question " + (i + 1);
            questionButtons[i].onclick = function () {
                for (let b = 0; b < currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers.length + 1; b++) {
                    document.getElementById("answer" + b)?.remove();
                    document.getElementById("rightAnswer" + b)?.remove();
                }
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
        typebutton.value = currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].type;
        typebutton.onchange = function () {
            currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].type = typebutton.value;
            init();
        }

        document.body.appendChild(typebutton);

        document.getElementById("currentQuestion")?.remove();
        let currentQuestion = document.createElement("input");
        currentQuestion.type = "text";
        currentQuestion.id = "currentQuestion";
        currentQuestion.value = currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].question ? currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].question : "";
        currentQuestion.placeholder = "Write your question here";
        currentQuestion.onchange = function () {
            currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].question = currentQuestion.value;
        }
        document.body.appendChild(currentQuestion);

        for (let b = 0; b < currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers.length + 1; b++) {
            document.getElementById("answer" + b)?.remove();

            let answer = document.createElement("input")
            answer.type = "text";
            answer.id = "answer" + b;
            answer.placeholder = "Write answer " + (b + 1) + " here";
            answer.value = currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers[b]?.text ? currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers[b]?.text : ""
            answer.onchange = function () {
                if (answer.value != "") {
                    currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers[b] = {}
                    currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers[b].text = answer.value;
                } else {
                    currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers.splice(b, 1);
                    document.getElementById("answer" + (currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers.length + 1))?.remove();
                }
                init();
            }
            document.body.appendChild(answer);

            if (b < currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers.length) {
                document.getElementById("rightAnswer" + b)?.remove();

                let rightAnswer = document.createElement("input")
                rightAnswer.id = "rightAnswer" + b;
                rightAnswer.name = "rightAnswer";
                if (currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].type == questionTypes[0]) {
                    rightAnswer.type = "radio";
                    rightAnswer.checked = (b == currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].rightAnswer)
                    rightAnswer.onchange = function () {
                        currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].rightAnswer = b;
                    }
                } else {
                    rightAnswer.checked = currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers[b].rightAnswer ? currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers[b].rightAnswer : false
                    rightAnswer.type = "checkbox";
                    rightAnswer.onchange = function () {
                        currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers[b].rightAnswer = rightAnswer.checked;
                    }
                }

                document.body.appendChild(rightAnswer);
            }


        }
    }
}

function loadGames() {
    let gamesToLoad = JSON.parse(localStorage.getItem("games"))
    console.log(gamesToLoad);

    gamesToLoad.forEach(e => {
        let questions = [];
        e.questions.forEach(g => {
            questions.push(new Question(g.type, g.question, g.answers, g.rightAnswer))
        })
        games.push(new Game(e.id, e.name, questions));
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
    constructor(type, question, answers, rightAnswer) {
        this.type = type;
        this.answers = answers ? answers : [];
        this.question = question ? question : "";
        this.rightAnswer = rightAnswer;
    }
}

window.onbeforeunload = function (e) {

    localStorage.setItem("games", JSON.prune(games));
    e.preventDefault();
}
loadGames();
init();