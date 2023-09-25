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
            if (!data.valid) { alert("Invalid username") }
            else {
                document.getElementsByClassName('main-container')[0].remove()
                let h1 = document.createElement('h1')
                h1.textContent = 'Waiting for host...'
                document.body.appendChild(h1)
            }
        }

        if (response.type === 'QUESTION') handleQuestion(data)

        if (response.type === 'ISCORRECT') {
            let result = document.createElement('div')
            result.className = 'is-correct-answer'
            result.style.backgroundColor = data.correct ? 'green' : 'red'
            document.body.appendChild(result)
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