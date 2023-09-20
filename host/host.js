const peer = new Peer(generateId(6), { debug: 1 } )
let connections = {}

let currentGame = undefined
let idx = undefined

let answers = {}
let correctAnswers = []


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
            answers[x.peer] = data.answers
        }
    })
})

function startGame(game) {
    currentGame = game
    idx = 0

    handleQuestion(idx)
}

function handleQuestion(idx) {
    let question = currentGame.questions[idx]
    //correctAnswers = shuffle(question.answers.map(e => e.text))

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


console.log(peer.id)