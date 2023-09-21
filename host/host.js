const peer = new Peer(generateId(6), { debug: 1 } )
let connections = {}

let currentGame = undefined
let idx = undefined
let layout = 'LEADERBOARD'


peer.on('connection', x => {
    x.on('open', () => {
        if (!currentGame) return
        console.log(x.peer + ' connected')
        connections[x.peer] = peer.connect(x.peer)
        console.log(connections)

    })

    x.on('close', () => {
        
    })

    x.on('data', data => {
        console.log(data)
        if (data.type === 'NICKNAME') {
            if (Object.values(connections).some(c => c.nickname === data.data.nickname)) {
                connections[x.peer].send({ type: 'NICKNAME', valid: false })
                return
            } else { connections[x.peer].send({ type: 'NICKNAME', valid: true }) }
            let client = document.createElement('div')
            client.className = 'client'
            connections[x.peer].nickname = data.data.nickname
            client.textContent = data.data.nickname
            client.onclick = () => {
                client.remove()
                connections[x.peer].close()
                delete connections[x.peer]
            }
            document.getElementById('client-list').appendChild(client)

        }

        if (data.type === 'ANSWER') {
            if (data.questionType === 'Single answer') {
                connections[x.peer].correct = (currentGame.questions[idx].rightAnswer === data.answer)
            }
        }
    })
})

function startGame(game) {
    currentGame = game
    idx = 0

    // Create Lobby
    document.getElementById('main').remove()

    //let a = document.getElementsByClassName('game-buttons')
    //while (a[0]) a[0].remove()
    
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
            questionType: qType,
            question: q,
            alternatives: qAns.map(e => e.text)
        })
    }
}

