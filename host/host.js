const peer = new Peer(generateId(6), { debug: 1 } )
let connections = {}

let currentGame = undefined
let idx = undefined
let layout = 'LEADERBOARD'

let currentNames = []

peer.on('connection', x => {
    x.on('open', () => {
        if (!currentGame) return
        console.log(x.peer + ' connected')
        connections[x.peer] = peer.connect(x.peer)
        console.log(connections)

    })

    x.on('close', () => {
        
    })

    x.on('data', response => {
        let data = response.data
        console.log(response)

        if (response.type === 'NICKNAME') {
            let _valid = !currentNames.includes(data.nickname)
            connections[x.peer].send({ type: 'NICKNAME', data: { valid: _valid }})
            if (!_valid) return

            let client = document.createElement('div')
            client.className = 'client'
            client.textContent = data.nickname
            client.onclick = () => {
                client.remove()
                connections[x.peer].close()
                delete connections[x.peer]
            }
            document.getElementById('client-list').appendChild(client)

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

function startGame(game) {
    currentGame = game
    currentNames = []
    idx = 0

    // Remove Main, and Games Button
    document.getElementById('main').remove()
    //document.getElementById('client-list').remove()
    
    let container = document.createElement('main')
    container.className = 'question-container'

    let header = document.createElement('h1')
    header.textContent = peer.id

    let clients = document.createElement('div')
    clients.id = 'client-list'
    
    let start = document.createElement('button')
    start.id = 'start-game'
    start.textContent = 'Start'
    start.onclick = () => {
        if (layout === 'QUESTION') handleLeaderboard()
        if (layout === 'LEADERBOARD') handleQuestion()
        handleQuestion()
        start.textContent = 'Next'
    }

    container.appendChild(header)
    container.appendChild(clients)
    container.appendChild(start)
    document.body.appendChild(container)
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

function previewScreen() {
    let container = document.createElement('div')
    container.className = 'main-container'

    let gameId = document.createElement('h1')
    gameId.id = 'game-id'
}

/* Preview Screen
    Game Id
        Lock, Start

    Waiting for players (when no players)

        Amount of players, sound, settings, fullscreen

*/