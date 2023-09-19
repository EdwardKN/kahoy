const hostId = document.getElementById('pincode')
const peer = new Peer(generateId(6))
let connection = undefined


peer.on('connection', x => {
    x.on('open', () => {
        console.log("Connected to " + x.peer)
    })

    x.on('close', () => {
        console.log("Host Disconnected")
    })

    x.on('data', data => {
        console.log(data)
        if (data.type === 'NICKNAME') {
            let input = document.createElement('input')
            input.id = 'nickname'
            input.placeholder = 'Enter nickname'
            document.body.appendChild(input)
        }if (data.type === 'QUESTION') {
            if (data.question.type === 'SINGLE') singleAnswer(data.question)
        }
    })
})

peer.on('error', error => {
    connection.close()
    connection = undefined
})

async function connectToHost(hostId) {
    if (hostId === peer.id) { alert("Can't connect to self!"); return }
    connection = peer.connect(hostId)
}

hostId.addEventListener('keydown', (e) => {
    let key = e.key.toLowerCase()
    if (key === 'enter') { connectToHost(hostId.value) }
})
