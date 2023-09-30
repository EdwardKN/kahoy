async function handleQuestion(data) {
    await fetchHTML(document, 'gameBlock.html', './../host/states/')
        
    clearInterval(clock)
    document.getElementById('timer').remove()
    document.getElementsByClassName('next')[0].remove()
    document.getElementById('question-text').textContent = data.question    
    
    createAlternative(document.getElementById('alternatives-container'), data.alternatives, true)


    if (data.questionType === 'Single answer') singleAnswer(data)
}

function singleAnswer() {
    for (let alternative of document.getElementsByClassName('alternative')) {
        alternative.onclick = () => {
            connection.send({
                type: 'ANSWER',
                data: { answer: [alternative.getAttribute('index')] }
            })

            fetchHTML(document, 'clientCorrectAnswer.html', './../host/states/')
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