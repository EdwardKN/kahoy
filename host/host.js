const peer = new Peer(generateId(6), { debug: 1 } )
let connections = {}

/* IMEPLEMENT HEARTBEAT */
let currentGame = undefined
let idx = undefined
let layout = 'LEADERBOARD'

let currentNames = []

peer.on('connection', x => {
    x.on('open', () => {
        if (!currentGame) return
        console.log(x.peer + ' connected')
        connections[x.peer] = peer.connect(x.peer)
    })

    x.on('close', () => {
        
    })

    x.on('data', response => {
        let data = response.data
        console.log(response)

        if (response.type === 'NICKNAME') {
            let nickname = data.nickname.trim()
            let _valid = !(currentNames.includes(nickname) || nickname.length < 3)
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
            document.getElementById('client-container').appendChild(client)

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

peer.on('disconnected', data => {
    console.log(data)
})

function startGame(game) {
    currentGame = game
    currentNames = []
    idx = 0

    previewScreen()
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



/* Preview Screen
    Game Id
        Lock, Start

    Waiting for players (when no players)

        Amount of players, sound, settings, fullscreen

*/

