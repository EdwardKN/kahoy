const hostId = document.getElementById('pincode')
const peer = new Peer(generateId(6))
let connection = undefined


peer.on('connection', x => {
    x.on('open', () => {
        console.log("Connected to " + x.peer)
        document.getElementById('pincode').remove()
        document.getElementById('main').remove()
        document.getElementById('join').remove()

        enterNickname()
    })

    x.on('close', () => {
        console.log("Host Disconnected")
        window.location.reload()
    })

    x.on('data', data => {
        console.log(data)

        if (data.type === 'NICKNAME') {
            if (data.valid === true) {
                document.getElementById('nickname-container').remove()
                
            }
            else alert("Username Already Taken")
        }

        if (data.type === 'QUESTION') {
            if (data.questionType === 'Single answer') singleAnswer(data.question, data.alternatives)
        }

        if (data.type === 'ISCORRECT') {
            let result = document.createElement('div')
            result.className = 'is-correct-answer'
            result.style.backgroundColor = data.correct ? 'green' : 'red'
            document.body.appendChild(result)
        }
    })
})

peer.on('error', error => {
    console.log(error.type)
    connection = undefined
})

function connectToHost(hostId) {
    if (hostId === peer.id) { alert("Can't connect to self!"); return }
    if (connection) { connection.close(); connection = undefined }

    connection = peer.connect(hostId)
}

function enterNickname() {
    let div = document.createElement('div')
    div.id = 'nickname-container'
    let header = document.createElement('h1')
    let container = document.createElement('question-container')
    let name = document.createElement('input')
    name.placeholder = 'Enter nickname'
    let confirm = document.createElement('button')
    confirm.textContent = 'Confirm'
    confirm.onclick = () => {
        connection.send({ type: 'NICKNAME', data: { nickname: name.value }})
    }

    container.appendChild(name)
    container.appendChild(confirm)
    div.appendChild(header)
    div.appendChild(container)
    document.body.appendChild(div)
}