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
let allAnswers = {}
let answers = []

peer.on('connection', x => {
    let id = x.peer
    x.on('open', () => {
        if (!currentGame || !document.getElementById('lock').state) return
        console.log(id + ' connected')
        clients[id] = { connection: peer.connect(id), score: 0 }
    })

    x.on('close', () => {
        if (clients[id]) removeClient(id)
    })

    x.on('data', response => {
        if (response.type === 'HEARTBEAT') { clients[id].recieved = true; return }

        let data = response.data
        let client = clients[x.peer]
        console.log(response)

        if (response.type === 'NICKNAME') {
            let nickname = data.nickname.trim()
            let currentNames = Object.values(clients).map(e => e.nickname)
            
            if (nickname.length < 3) { client.connection.send({ type: 'NICKNAME', data: { valid: false, reason: 'SHORT' } }); return }
            if (nickname.length > 16) { client.connection.send({ type: 'NICKNAME', data: { valid: false, reason: 'LONG' } }); return }
            if (currentNames.includes(nickname)) { client.connection.send({ type: 'NICKNAME', data: { valid: false, reason: 'TAKEN' }}); return }
            
            client.connection.send({ type: 'NICKNAME', data: { valid: true }})
            client.nickname = nickname

            let clientDiv = document.createElement('div')
            clientDiv.className = 'client'
            clientDiv.textContent = nickname
            clientDiv.onclick = () => removeClient(x.peer)

            document.getElementById('client-container').appendChild(clientDiv)
            document.getElementsByClassName('next')[0].disabled = false
            document.getElementById('waiting-for-players').style.visibility = 'hidden'

            heartbeat(x.peer)
            client.connection.send({ type: 'HEARTBEAT' })
        }

        
        if (response.type === 'ANSWER') {
            clientsAnswers++
            clients[x.peer].answer = data.answer
            data.answer.forEach(index => allAnswers[index]++)
            clients[x.peer].end = performance.now()
            console.log(clientsAnswers, Object.keys(clients).length)
            
            if (clientsAnswers < Object.keys(clients).length) return
            
            clearInterval(clock)
            showAllAnswers()
        }
    })
})

function showAllAnswers() {
    clearInterval(clock)
    timer.remove()
    document.getElementsByClassName('next')[0].remove()
    delete timer
    delete clock
    timer = undefined
    clock = undefined
    console.log(timer, clock)
    fetchHTML(document, 'showAnswers.html', 'states/')
    // Send to clients
    Object.values(clients).forEach(client => {
        let newScore = calculateScore(client)
        client.score += newScore

        client.connection.send({
            type: 'IS_CORRECT',
            data: {
                score: Math.round(client.score),
                newScore: Math.round(newScore)
            }
        })
    })
}

function calculateScore(client) {
    if (!client.answer || !validateAnswer(client.answer)) return 0
    let s = 60 - (client.end - client.start) / 1000
    return Math.max(500, 1000 * s / 60)
}

function validateAnswer(answer) {
    console.log(correctAnswers, answer)
    return correctAnswers.length === answer.length && correctAnswers.every(i => answer.includes(`${i}`))
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

async function sendQuestion() {
    let data = currentGame.questions[idx]

    if (data === undefined) { fetchHTML(document, 'leaderboard.html', 'states/'); return }

    answers = shuffle(data.answers.map(e => [{ text: e.text, rightAnswer: e.rightAnswer }][0]))
    answers = answers.map((ans, i) => {
        allAnswers[i] = 0
        if (ans.rightAnswer) correctAnswers.push(i)
        return ans.text
    })
    
    Object.values(clients).forEach(client => {
        client.connection.send({
            type: 'QUESTION',
            data: {
                questionType: data.type,
                question: data.question,
                alternatives: answers
            }
        })
        client.start = performance.now()
    })

    await fetchHTML(document, 'gameBlock.html', 'states/')
    createAlternative(document.getElementById('alternatives-container'), answers)
    document.getElementById('question-text').textContent = data.question
    idx++
}

window.onload = () => fetchHTML(document, 'preview.html', 'states/')