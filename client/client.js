const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
let id = ""
for (let i = 0; i < 6; i++) {
    id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
}
const peer = new Peer(id, { debug: 1 } )

peer.on('connection', connection => {
    connection.on('open', () => {

    })

    connection.on('close', () => {

    })

    connection.on('data', data => {
        
    })
})