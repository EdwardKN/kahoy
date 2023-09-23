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
        clients[id] = {
            connection: peer.connect(id)
        }
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

    clients[id].connection.close()
    delete clients[id]
    if (Object.values(clients).length === 0) { document.getElementsByClassName('next')[0].disabled = true }
}

function sendMessage(data) {
    for (const client of Object.values(clients)) {
        console.log(client)
        client.connection.send(data)
    }
}

function startGame(game) {
    currentGame = game
    idx = 0

    fetchHTML(document, 'preview.html')
}


function sendQuestion() {
    let data = currentGame.questions[idx]

    sendMessage({
        type: 'QUESTION',
        data: {
            questionType: data.type,
            question: data.question,
            alternatives: data.answers.map(e => e.text)
        }
    })

    showQuestion()
}

/*
startGame(games[0])
showQuestion(currentGame.questions[idx].question, currentGame.questions[idx].answers.map(e => e.text), currentGame.questions[idx].time || 10)*/