var emptyString = "";
var alphabet = "abcdefghijklmnopqrstuvwxyz";

while (emptyString.length < 6) {
    emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
}
const peerId = emptyString;

/*
Object.keys(connections).forEach(id => {
    connections[id].send('TESTING')
})
*/

const peer = new Peer(peerId, { debug: 1 })
var connections = {};
var connection;

var host = false;

peer.on('connection', x => {
    x.on('open', () => {
        if (host) {
            connections[x.peer] = peer.connect(x.peer);
            connections[x.peer].on("open", () => {
                console.log("Connected to: " + x.peer)
            })
            connections[x.peer].on("close", () => {
                console.log(x.peer + " disconnected")
                delete connections[x.peer]
            })
        }
    });

    x.on('data', data => {    
        if (data.type === 'QUESTION') {
            // Show Question
        } else if (data.type === 'ANSWER') {
            // Send Clicked Answer
        }
    })

});


function sendData(data) {
    if (!host) { connection.send(data); return }

    for (let con of Object.values(connections)) {
        con.send(data)
    }
}

function connect() {
    const connectTo = document.getElementById('inputId').value
    if (connectTo != peerId) {
        connection = peer.connect(connectTo);
        connection.on("open", () => {
            console.log("connected to host")
        })
        connection.on("close", () => {
            console.log("host disconnected")
            connection = undefined
        })
    }
}

function initGame() {
    host = true;
    document.getElementById('inputId').style.visibility = "hidden"
    document.getElementById('connectbutton').style.visibility = "hidden"
    document.getElementById('hostbutton').style.visibility = "hidden"
    document.getElementById("thisId").innerHTML = "Your Id: " + peerId;
}