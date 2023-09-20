function trueOrFalse() {

}

function singleAnswer(data) {
    let question = data.question
    let alternatives = data.alternatives
    console.log(data)
    return
    question.textContent = q.question
    let colors = ['red', 'blue', 'orange', 'green']

    for (let i = 0; i < alternatives.length; i++) {
        let div = document.createElement('div')
        div.textContent = alternatives[i]
        div.style.backgroundColor = colors[i]
        div.id = 'alternative-container'
        div.onclick = () => {
            connection.send({
                type: 'ANSWER',
                answer: i
            })
        }
        alternativesContainer.appendChild(div)
    }
}

function multipleAnswer() {

}