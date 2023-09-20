const peer = new Peer(generateId(6), { debug: 1 } )
let connections = {}
let currentGame = undefined
let questionIndex = undefined

peer.on('connection', x => {
    x.on('open', () => {
        console.log(x.peer + ' connected')
        connections[x.peer] = peer.connect(x.peer)
    })

    x.on('close', () => {
    
    })

    x.on('data', data => {
        console.log(data)
        if (data.type === 'ANSWER') {

        }
    })
})

function startGame(game) {
    currentGame = game
    questionIndex = 0

    for (let connection of Object.values(connections)) {
        sendQuestion(connection, game.questions[questionIndex])
    }
}


function sendQuestion(connection, q) {
    connection.send({
        type: 'QUESTION',
        questionType: q.type,
        question: q.question,
        alternatives: shuffle(q.answers.map(e => e.text))
    })
}


console.log(peer.id)