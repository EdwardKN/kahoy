const colors = ['red', 'blue', 'yellow', 'orange', 'purple', 'pink']

function trueOrFalse() {

}

function singleAnswer(question, alternatives) {
    let container = document.createElement('main')
    container.className = 'question-container'

    let header = document.createElement('h1')
    header.textContent = question

    let alternativesContainer = document.createElement('div')
    alternativesContainer.className = 'alternatives-container' 

    for (let i = 0; i < alternatives.length; i++) {
        let alternative = document.createElement('button')
        alternative.className = 'alternative'
        alternative.textContent = alternatives[i]
        alternative.style.backgroundColor = colors[i]
        alternative.onclick = () => {
            connection.send({
                type: 'ANSWER',
                questionType: 'Single answer',
                answer: i
            })
            document.body.removeChild(container)
        }

        alternativesContainer.appendChild(alternative)
    }

    container.appendChild(header)
    container.appendChild(alternativesContainer)
    document.body.appendChild(container)
}

function multipleAnswer() {

}

let fake_question = {
    type: 'QUESTION',
    questionType: 'Single Answer',
    question: 'Vad är 2 * 5?',
    alternatives: ['5', '10', '15', '20']
}



/*
sendQuestion()
showCorrectClient()
showLeaderboard()
showCorrectHost()
*/