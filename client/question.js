async function handleQuestion(data) {
    await fetchHTML(document, 'gameBlock.html', '../host/states/')
    createAlternative(document.getElementById('alternatives-container'), data.alternatives, true)

    console.log(data)
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


/*
showCorrectClient()
showLeaderboard()
showCorrectHost()
*/