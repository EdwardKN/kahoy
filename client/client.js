const hostId = document.getElementById('pincode')
const peer = new Peer(generateId(6))
let connection = undefined


peer.on('connection', x => {
    x.on('open', () => {
        console.log("Connected to " + x.peer)
        document.getElementById('pincode').remove()
        document.getElementById('main').remove()
        document.getElementById('join').remove()
    })

    x.on('close', () => {
        console.log("Host Disconnected")
    })

    x.on('data', data => {
        console.log(data)

        if (data.type === 'NICKNAME') {

        } if (data.type === 'QUESTION') {
            createHTML()
            if (data.questionType === 'Single answer') singleAnswer(data)
        }
    })
})

peer.on('error', error => {
    console.log(error.type)
    connection = undefined
})

function connectToHost(hostId) {
    if (hostId === peer.id) { alert("Can't connect to self!"); return }
    connection = peer.connect(hostId)
}

function createHTML() {
    document.getElementById('pincode').remove()
        document.getElementById('main').remove()
        document.getElementById('join').remove()

    // Background 
    let background = document.createElement('div')
    background.className = 'background'
    document.body.appendChild(background)

    
}