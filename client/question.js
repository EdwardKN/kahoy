const container = document.getElementById('question-container')
const question = document.getElementById('question')
const alternativesContainer = document.getElementById('alternatives')


function trueOrFalse() {

}

function singleAnswer(q) {
    document.getElementById('pincode').remove()
    document.querySelector('button').remove()

    question.textContent = q.question
    let colors = ['red', 'blue', 'orange', 'green']

    for (let i = 0; i < q.alternatives.length; i++) {
        let div = document.createElement('div')
        div.textContent = q.alternatives[i]
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

// Fake question

let q = {
    question: 'Vad är 2 * 5',
    alternatives: ['10', '5', '7', '3']
}
singleAnswer(q)
