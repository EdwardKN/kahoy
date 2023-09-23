/* Maybe not needed 1 */
async function requestScriptContent(script) {
    let src = script.src
    if (!src) { return script.textContent }
    
    return await new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()
        request.open('GET', src)
        request.onreadystatechange = () => {
            if (request.readyState !== 4) { return }
            if (request.status === 200) { resolve(request.responseText) }
            else { reject(new Error(`Failed to load script; ${src}. Status: ${request.status}`)) }
        }
        request.send()
    })
}
/* 1 End */




function showQuestion(question, answers, time = 60) {
    document.getElementsByClassName('main-container')[0].remove()

    let container = document.createElement('main')
    container.className = 'main-container'

    let subContainer = document.createElement('div')
    subContainer.className = 'time-next-container'

    let clock = document.createElement('div')
    clock.id = 'timer'
    clock.textContent = time
    let timer = setInterval(() => {
        let time = parseInt(clock.textContent) - 1
        clock.textContent = time
        if (time > 0) return
        sendMessage({ type: 'TIMER DONE' })
        showQuestionAnswers()
        clearInterval(timer)
    }, 1000)

    let next = document.createElement('button')
    next.className = 'next'
    next.textContent = 'Next'
    next.onclick = () => showQuestionAnswers()

    let questionText = document.createElement('h1')
    questionText.className = 'question-text'
    questionText.textContent = question

    let answerContainer = document.createElement('div')
    answerContainer.className = 'answer-container'

    for (let i = 0; i < answers.length; i++) {
        let div = document.createElement('div')
        div.className = 'answer ' + colors[i]
        div.textContent = answers[i]        
        
        addShape(div, colors[i])
        answerContainer.appendChild(div)
    }

    subContainer.appendChild(clock)
    subContainer.appendChild(next)

    container.appendChild(questionText)
    container.appendChild(subContainer)
    container.appendChild(answerContainer)

    document.body.appendChild(container)
}

function addShape(element, color) {    
    // Add shapes
}

function showQuestionAnswers() {

}


