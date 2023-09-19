const peer = new Peer(generateId(6), { debug: 1 } )
let connections = {}

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

// { type: '', alternativ: ''}
function sendQuestion(_question) {
    for (let connection of Object.values(connections)) {
        connection.send({
            type: 'QUESTION',
            question: _question,
        })
    }
}
/*
{
    question: ''
    alternatives: []
}

*/



console.log(peer.id)