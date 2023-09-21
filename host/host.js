const peer = new Peer(generateId(6), { debug: 1 } )
let connections = {}

let currentGame = undefined
let idx = undefined
let layout = 'LEADERBOARD'

let currentNames = {}

peer.on('connection', x => {
    x.on('open', () => {
        if (!currentGame || !document.getElementById('lock').state) return
        console.log(x.peer + ' connected')
        connections[x.peer] = peer.connect(x.peer)
    })

    x.on('close', () => {
        clearTimeout(beat)
    })

    x.on('data', response => {
        if (response.type === 'HEARTBEAT') { recieved = true; return }

        let data = response.data        
        console.log(response)

        if (response.type === 'NICKNAME') {
            if (!beat) {
                connections[x.peer].send({ type: 'HEARTBEAT' })
                heartbeat(x.peer)
            }
            let nickname = data.nickname.trim()
            let _valid = !(Object.values(currentNames).includes(nickname) || 
                        nickname.length < 3 || nickname.length > 16)
            connections[x.peer].send({ type: 'NICKNAME', data: { valid: _valid }})
            if (!_valid) return
            
            currentNames[x.peer] = nickname
            let client = document.createElement('div')
            client.className = 'client'
            client.textContent = data.nickname
            client.onclick = () => removeClient(x.peer)

            document.getElementById('client-container').appendChild(client)
            document.getElementsByClassName('next')[0].disabled = false
        }

        if (response.type === 'ANSWER') {
            let clientAnswers = data.answer
            let correctAnswers = []
            currentGame.questions[idx].answers.forEach((answer, i) => { if (answer.rightAnswer) { correctAnswers.push(i) }})

            let correct = clientAnswers.length === correctAnswers.length
            
            for (let i of correctAnswers) {
                if (!clientAnswers.includes(i)) { correct = false }
            }

            connections[x.peer].correct = correct
        }
    })
})

const responseTiem = 1000
let recieved = true
let beat

function heartbeat(id) {
    recieved = false
    beat = setTimeout(() => {
        clearTimeout(beat)

        if (recieved) {
            connections[id].send({ type: 'HEARTBEAT' })
            heartbeat(id)
        } else removeClient(id)
            
    }, responseTiem)
}

function removeClient(id) {
    for (let client of document.getElementsByClassName('client')) {
        if (client.textContent === currentNames[id]) { client.remove() }
    }

    connections[id].close()
    delete currentNames[id]
    delete connections[id]
    if (Object.values(connections).length === 0) { document.getElementsByClassName('next')[0].disabled = true }
}


function startGame(game) {
    currentGame = game
    currentNames = []
    idx = 0

    showPreviewScreen()
}




function showQuestion() {
    let container = document.createElement('main')
    container.className = 'main-container'

}

function handleQuestion() {
    let question = currentGame.questions[idx]

    sendQuestion(question.type, question.question, question.answers)
}


function sendQuestion(qType, q, qAns) {
    for (let connection of Object.values(connections)) {
        connection.send({
            type: 'QUESTION',
            data: {
                questionType: qType,
                question: q,
                alternatives: qAns.map(e => e.text)
            }
        })
    }
}