var emptyString = "";
var alphabet = "abcdefghijklmnopqrstuvwxyz";

while (emptyString.length < 6) {
    emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
}
const peerId = emptyString;



const peer = new Peer(peerId, { debug: 1 })
var connections = {};
var connection;

var host = false;

peer.on('connection', x => {
    x.on('open', () => {
        if (host) {
            connections[x.peer] = peer.connect(x.peer);
        }
    });
    x.on('data', data => {
        console.log(data)
        if (host) {

        } else {

        }
    })
});

function connect() {
    const connectTo = document.getElementById('inputId').value
    if (connectTo != peerId) {
        connection = peer.connect(connectTo);
    }
}

function initGame() {
    host = true;
    document.getElementById('inputId').style.visibility = "hidden"
    document.getElementById('connectbutton').style.visibility = "hidden"
    document.getElementById('hostbutton').style.visibility = "hidden"
    document.getElementById("thisId").innerHTML = "Your Id: " + peerId;

}

