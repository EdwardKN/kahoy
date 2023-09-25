const peer = new Peer(generateId(6), { debug: 1 } )
const responseTiem = 1000

let clients = {}
let currentGame = JSON.parse(localStorage.getItem('gameToStart')) || {
    currentSelectedQuestion: 0,
    id: 0,
    name: "Blablabla",
    questions: [
        {
            type: 'Single answer',
            answers: [{ text: '1', rightAnswer: false }, { text: '2', rightAnswer: false }, { text: '3', rightAnswer: true }, { text: '4', rightAnswer: false } ],
            question: 'Vad är 1 + 2?'
        }
    ]
}
let idx = 0
let clientsAnswers = 0
let correctAnswers = []

peer.on('connection', x => {
    let id = x.peer
    x.on('open', () => {
        if (!currentGame || !document.getElementById('lock').state) return
        console.log(id + ' connected')
        clients[id] = { connection: peer.connect(id) }
    })

    x.on('close', () => {
        if (clients[id]) removeClient(id)
    })

    x.on('data', response => {
        if (response.type === 'HEARTBEAT') { clients[id].recieved = true; return }

        let data = response.data
        console.log(response)

        if (response.type === 'NICKNAME') {
            let nickname = data.nickname.trim()
            let currentNames = Object.values(clients).map(e => e.nickname)
            let _valid = !(currentNames.includes(nickname) || 
                        nickname.length < 3 || nickname.length > 16)
            clients[id].connection.send({ type: 'NICKNAME', data: { valid: _valid }})
            
            if (!_valid) return
            
            clients[id].nickname = nickname
            let client = document.createElement('div')
            client.className = 'client'
            client.textContent = nickname
            client.onclick = () => removeClient(id)

            document.getElementById('client-container').appendChild(client)
            document.getElementsByClassName('next')[0].disabled = false
            document.getElementById('waiting-for-players').style.visibility = 'hidden'

            heartbeat(id)
            clients[id].connection.send({ type: 'HEARTBEAT' })
        }

        
        if (response.type === 'ANSWER') {
            clientsAnswers++
            clients[x.peer].answer = data.answer

            if (clientsAnswers === Object.keys(clients).length) fetchHTML(document, 'showAnswers.html', 'states/')
        }
    })
})

function handleAnswers() {
    // Send to clients
    Object.values(clients).forEach(client => {
        client.connection.send({
            type: 'IS_CORRECT',
            correct: validateAnswer(client.answer)
        })
    })
    currentGame.questions[idx].answers.forEach((ans, i) => {
        if (ans.rightAnswer) {
            correctAnswers.push(i)
        }
    })

    document.getElementById('question').textContent = currentGame.questions[idx].question

    let showAnswers = document.getElementById('show-answers')
    let alternativeContainer = document.getElementById('alternatives-container')

    createAlternative(alternativeContainer, currentGame.questions[idx].answers.map(e => e.text))



    let j = 0
    for (let i of document.getElementsByClassName('alternative')) {
        let container = document.createElement('div')
        container.className = 'answer-container'
        let amount = document.createElement('div')
        let bottom = document.createElement('div')

        bottom.textContent = i.textContent
        amount.textContent = 'AMOUNT' + i.textContent
        amount.style.width = '75%'
        
        let height = Object.values(clients).filter(client => client.answer.includes(`${j}`)) / Object.keys(clients).length
        amount.style.height = `calc(80% * ${height})`

        container.appendChild(amount)
        container.appendChild(bottom)
        showAnswers.appendChild(container)
        j++
    }
}

function validateAnswer(answer) {
    return correctAnswers.length === answer.length && correctAnswers.every(i => answer.includes(i))
}

function heartbeat(id) {
    clients[id].recieved = false
    clients[id].heart = setTimeout(() => {
        if (clients[id].recieved) {
            clients[id].connection.send({ type: 'HEARTBEAT' })
            heartbeat(id)
        } else {
            clearTimeout(clients[id].heart)
            removeClient(id)
        }
    }, responseTiem)
}

function removeClient(id) {
    for (let client of document.getElementsByClassName('client')) {
        if (client.textContent === clients[id].nickname) { client.remove() }
    }

    clearTimeout(clients[id].heart)
    clients[id].connection.close()
    delete clients[id]

    if (Object.values(clients).length !== 0) return

    document.getElementsByClassName('next')[0].disabled = true
    document.getElementById('waiting-for-players').style.visibility = 'visible'
}

function sendMessage(data) {
    for (const client of Object.values(clients)) {
        client.connection.send(data)
    }
}

function startGame(game) {
    currentGame = game
    idx = 0

    fetchHTML(document, 'preview.html', 'states/')
}

async function sendQuestion() {
    let data = currentGame.questions[idx]
    let answers = data.answers.map(e => e.text)
    currentGame.questions[idx].answers.forEach((ans, i) => { if (ans.rightAnswer) { correctAnswers.push(i) } })

    sendMessage({
        type: 'QUESTION',
        data: {
            questionType: data.type,
            question: data.question,
            alternatives: answers
        }
    })

    await fetchHTML(document, 'gameBlock.html', 'states/')
    createAlternative(document.getElementById('alternatives-container'), answers)
}

window.onload = () => fetchHTML(document, 'preview.html', 'states/')