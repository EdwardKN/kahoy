const gameInput = document.getElementById('game-input')
const peer = new Peer(generateId(6), { debug: 1 })
let connection = undefined
// Ok, kör!
// Spelarnamn

peer.on('error', error => {
    console.log(error.type)
    connection = undefined
})

peer.on('connection', x => {
    x.on('open', () => {
        let confirmBtn = document.getElementById('enter-pin')

        gameInput.placeholder = 'Spelarnamn'
        gameInput.value = ''
        confirmBtn.textContent = 'Ok, kör!'

        confirmBtn.onclick = () => connection.send({
            type: 'NICKNAME',
            data: { nickname: gameInput.value }
        })
    })

    x.on('close', () => {
        window.location.reload()
    })

    x.on('data', response => {
        if (response.type === 'HEARTBEAT') { connection.send({ type: response.type }); return }

        let data = response.data
        console.log(response)

        if (response.type === 'NICKNAME') {
            if (data.valid) {
                document.getElementsByClassName('main-container')[0].remove()
                let h1 = document.createElement('h1')
                h1.textContent = 'Waiting for host...'
                document.body.appendChild(h1)
                return
            }
            if (data.reason === 'SHORT') { alert("Username needs to be longer than 3 characters") }
            if (data.reason === 'LONG') { alert("Username needs to be shorter than 16 characters") }
            if (data.reason === 'TAKEN') { alert("Username already taken") }
        }

        if (response.type === 'QUESTION') handleQuestion(data)

        if (response.type === 'IS_CORRECT') {
            fetchHTML(document, 'clientCorrectAnswer.html', './../host/states/')
                .then(() => {
                    document.getElementById('correct').style.backgroundColor = (data.newScore > 0 ? 'green' : 'red')
                    document.getElementById('score').textContent = data.newScore
                    document.getElementById('total-score').textContent = data.score
                })
        }
    })
})

function connectToHost(hostId) {
    if (hostId === peer.id) { alert("Can't connect to self!"); return }
    if (connection) { connection.close() }

    connection = peer.connect(hostId)
}


// Stopping page from reloading when pressing enter in input field for some reason
document.getElementById('game-input').addEventListener('keydown', (e) => { if (e.keyCode === 13) { e.preventDefault() } })