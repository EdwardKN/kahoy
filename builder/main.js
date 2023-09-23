var games = [];
var gameButtons = [];
var currentEditingGame = undefined;
var questionButtons = [];

var username = undefined;

const questionTypes = ["Single answer", "Multiple choice"]

function init() {
    document.getElementById("gameselectorContainer")?.remove();
    document.getElementById("currentGameContainer")?.remove();
    document.getElementById("questionListContainer")?.remove();
    document.getElementById("questionSettingContainer")?.remove();
    document.getElementById("answerContainer")?.remove();

    let gameselectorContainer = document.createElement("container");
    gameselectorContainer.id = "gameselectorContainer";
    document.body.appendChild(gameselectorContainer);

    let newButton = document.createElement("button");
    newButton.id = "newGame"
    newButton.innerText = "New Game"
    newButton.onclick = function () {
        games.push(new Game());
        init();
    }
    gameselectorContainer.appendChild(newButton);

    gameButtons.forEach(e => e.remove());
    games.forEach(function (e, i) {
        gameButtons.push(document.createElement("button"));
        gameButtons[i].innerText = e.name;
        gameButtons[i].onclick = function () {
            currentEditingGame = e;
            init();
        }
        gameselectorContainer.appendChild(gameButtons[i]);
    })

    if (currentEditingGame) {

        let currentGameContainer = document.createElement("container");
        currentGameContainer.id = "currentGameContainer";
        document.body.appendChild(currentGameContainer);

        let gameName = document.createElement("input");
        gameName.value = currentEditingGame.name;
        gameName.type = "text";
        gameName.id = "Gamename"
        gameName.maxLength = 20;
        currentGameContainer.appendChild(gameName);
        gameName.onchange = function () {
            currentEditingGame.changeName(gameName.value);
        }

        let removeGame = document.createElement("button");
        removeGame.id = "removeGame";
        removeGame.innerText = "Remove Game"

        removeGame.onclick = function () {
            games.splice(currentEditingGame.id, 1)
            games.forEach((e, i) => {
                e.id = i;
            })
            currentEditingGame = games[0];
            init();
        }
        currentGameContainer.appendChild(removeGame);

        let privateGame = document.createElement("button");
        privateGame.id = "privateGame";
        privateGame.innerText = currentEditingGame.private ? "Private" : "Public";
    
        
        privateGame.onclick = function(){
            currentEditingGame.private = !currentEditingGame.private
            init();
        }
        currentGameContainer.appendChild(privateGame);


        let playGame = document.createElement("button");
        playGame.id = "playGame";
        playGame.innerText = "Play Game"
    
        playGame.onclick = function(){
            window.location.replace('../host/host.html?private=true&id=' + currentEditingGame.id);
        }

        currentGameContainer.appendChild(playGame);



        let questionListContainer = document.createElement("container");
        questionListContainer.id = "questionListContainer";
        document.body.appendChild(questionListContainer);

        let newQuestionButton = document.createElement("button");
        newQuestionButton.id = "newQuestion"
        newQuestionButton.innerText = "New Question"
        newQuestionButton.onclick = function () {
            currentEditingGame.questions.push(new Question());
            init();
        }
        questionListContainer.appendChild(newQuestionButton);

        questionButtons.forEach(e => e.remove());
        currentEditingGame.questions.forEach(function (e, i) {
            questionButtons.push(document.createElement("button"));
            questionButtons[i].innerText = "Question " + (i + 1);
            questionButtons[i].onclick = function () {
                for (let b = 0; b < currentEditingGame.questions[currentEditingGame.currentSelectedQuestion]?.answers.length + 1; b++) {
                    document.getElementById("answer" + b)?.remove();
                    document.getElementById("rightAnswer" + b)?.remove();
                }
                console.log(i)
                currentEditingGame.currentSelectedQuestion = i;
                init();
            }
            questionListContainer.appendChild(questionButtons[i]);
        })

        if(currentEditingGame.currentSelectedQuestion !== undefined){
            
            let tmpDiv = document.createElement("div");

            let typebutton = document.createElement("select");
            typebutton.id = "typebutton"
            let option = document.createElement("option");
            option.value = "0";
            option.innerText = "Type Of Question";
            typebutton.appendChild(option);

            questionTypes.forEach(e => {
                let option = document.createElement("option");
                option.value = e;
                option.innerText = e;
                typebutton.appendChild(option);
            })
            tmpDiv.className = "custom-select"
            typebutton.value = (currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].type ? currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].type : "0");

            tmpDiv.appendChild(typebutton);


            let questionSettingContainer = document.createElement("container");
            questionSettingContainer.id = "questionSettingContainer";
            document.body.appendChild(questionSettingContainer);





            let currentQuestion = document.createElement("input");
            currentQuestion.type = "text";
            currentQuestion.id = "currentQuestion";
            currentQuestion.value = currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].question ? currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].question : "";
            currentQuestion.placeholder = "Write your question here";
            currentQuestion.onchange = function () {
                currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].question = currentQuestion.value;
            }
            questionSettingContainer.appendChild(currentQuestion);
            questionSettingContainer.appendChild(tmpDiv);
            fixSelectButtons([tmpDiv], function () {
                currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].type = typebutton.value;
                init();
            });
            if (currentEditingGame.questions.length > 1) {

                let removeQuestion = document.createElement("button");
                removeQuestion.id = "removeQuestion";
                removeQuestion.innerText = "Remove Question"

                removeQuestion.onclick = function () {
                    currentEditingGame.questions.splice(currentEditingGame.currentSelectedQuestion, 1);
                    currentEditingGame.currentSelectedQuestion = 0;
                    init();
                }
                questionSettingContainer.appendChild(removeQuestion);
            }

            let answerContainer = document.createElement("container");
            answerContainer.id = "answerContainer";
            document.body.appendChild(answerContainer);

            let numberOfAnswers = currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].type ? currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers.length + 1 : 0

            for (let b = 0; b < (numberOfAnswers > 4 ? 4 : numberOfAnswers); b++) {


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
                answerContainer.appendChild(answer);

                if (b < currentEditingGame.questions[currentEditingGame.currentSelectedQuestion].answers.length) {

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

                    answerContainer.appendChild(rightAnswer);
                }


            }
        }
    }
}

function loadGames() {
    getUser(function (user) {

        let gamesToLoad = user?.games ? JSON.parse(decodeURIComponent(user.games)) : [];
        username = user.username;

        gamesToLoad.forEach(e => {
            let questions = [];
            e.questions.forEach(g => {
                questions.push(new Question(g.type, g.question, g.answers, g.rightAnswer))
            })
            console.log(e)

            games.push(new Game(e.name, questions,e?.private));
        })
        init()
    })
}

class Game {
    constructor(name, questions,privateGame) {
        this.questions = questions ? questions : [new Question()];
        this.id = games.length;
        this.name = name ? name : "Game " + (this.id + 1)
        this.currentSelectedQuestion = undefined;
        this.private = privateGame ? privateGame : false;
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

function save() {
    sendData({
        username: username,
        games: encodeURIComponent(JSON.prune(games))
    })
}

loadGames();
init();