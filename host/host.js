const peer = new Peer(generateId(6), { debug: 1 } )
let clients = {}

let currentGame = undefined
let idx = undefined
let layout = 'LEADERBOARD'

peer.on('connection', x => {
    let id = x.peer
    x.on('open', () => {
        if (!currentGame || !document.getElementById('lock').state) return
        console.log(id + ' connected')
        clients[id] = {}
        clients[id].connection = peer.connect(id)
    })

    x.on('close', () => {
        removeClient(id)
    })

    x.on('data', response => {
        console.log(id, response)
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
            client.textContent = data.nickname
            client.onclick = () => removeClient(id)

            document.getElementById('client-container').appendChild(client)
            document.getElementsByClassName('next')[0].disabled = false

            heartbeat(id)
            clients[id].connection.send({ type: 'HEARTBEAT' })
        }

        /* FIX */
        if (response.type === 'ANSWER') {
            let clientAnswers = data.answer
            let correctAnswers = []
            currentGame.questions[idx].answers.forEach((answer, i) => { if (answer.rightAnswer) { correctAnswers.push(i) }})

            let correct = clientAnswers.length === correctAnswers.length
            
            for (let i of correctAnswers) {
                if (!clientAnswers.includes(i)) { correct = false }
            }

            clients[id].correct = correct
        }
    })
})

const responseTiem = 1000

function heartbeat(id) {
    clients[id].recieved = false
    clients[id].heart = setTimeout(() => {
        clearTimeout(clients[id].heart)

        if (clients[id].recieved) {
            clients[id].connection.send({ type: 'HEARTBEAT' })
            heartbeat(id)
        } else removeClient(id)
            
    }, responseTiem)
}

function removeClient(id) {
    for (let client of document.getElementsByClassName('client')) {
        if (client.textContent === clients[id].nickname) { client.remove() }
    }

    clearTimeout(clients[id].heart)
    clients[id].connection.close()
    delete clients[id]
    if (Object.values(clients).length === 0) { document.getElementsByClassName('next')[0].disabled = true }
}

function startGame(game) {
    currentGame = game
    idx = 0

    showPreviewScreen()
}

/* FIX */


function showQuestion() {
    let container = document.createElement('main')
    container.className = 'main-container'

}

function handleQuestion() {
    let question = currentGame.questions[idx]

    sendQuestion(question.type, question.question, question.answers)
}


function sendQuestion(qType, q, qAns) {
    for (let connection of Object.values(clients)) {
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