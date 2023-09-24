async function handleQuestion(data) {
    await fetchHTML(document, 'gameBlock.html', '../host/states/')
    createAlternative(document.getElementById('alternatives-container'), data.alternatives, true)

    let interface = document.getElementById('interface-container')
    interface.removeAttribute('id')
    for (let child of interface.children) child.remove()

    if (data.questionType === 'Single answer') singleAnswer(data)
}

function singleAnswer() {
    for (let alternative of document.getElementsByClassName('alternative')) {
        alternative.onclick = () => {
            connection.send({
                type: 'ANSWER',
                data: { answer: [alternative.getAttribute('index')] }
            })

            fetchHTML(document, 'clientCorrectAnswer.html', '../host/states/')
        }
    }
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
showCorrectClient()
showLeaderboard()
showCorrectHost()
*/