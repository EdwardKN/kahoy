function sendData(item, callback) {
    const http = new XMLHttpRequest();
    let url = "https://l2niipto9l.execute-api.eu-north-1.amazonaws.com/EdwardKN/updatekahoyusers?";
    Object.entries(item).forEach(e => {
        url += e[0] + "=" + e[1] + "&";
    })

    http.open("GET", url);
    http.send();


    http.onreadystatechange = (e) => {
        if (http.readyState === 4) {
            callback(http.responseText)
        }
    };
};
function getUser(callback) {
    const http = new XMLHttpRequest();
    const url = `https://l2niipto9l.execute-api.eu-north-1.amazonaws.com/EdwardKN/getkahoyusers?session=${localStorage.getItem('session')}`;
    http.open("GET", url);
    http.send();

    http.onreadystatechange = (e) => {
        if (http.readyState === 4) {
            callback(JSON.parse(http.responseText));
        }
    };
};

function getPublicGames(callback){
    const http = new XMLHttpRequest();
    const url = `https://l2niipto9l.execute-api.eu-north-1.amazonaws.com/EdwardKN/getkahoyusers?getpublic=true`;
    http.open("GET", url);
    http.send();

    http.onreadystatechange = (e) => {
        if (http.readyState === 4) {
            callback(JSON.parse(http.responseText));
        }
    };
}

function checkPassword(username, password, callback) {
    const http = new XMLHttpRequest();
    const url = `https://l2niipto9l.execute-api.eu-north-1.amazonaws.com/EdwardKN/getkahoyusers?username=${username}&password=${password}`;
    http.open("GET", url);
    http.send();

    http.onreadystatechange = (e) => {
        if (http.readyState === 4) {
            callback(JSON.parse(http.responseText));
        }
    };
};

function shuffle(unshuffled){
    let shuffled = unshuffled
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

    return shuffled
}


const questionTypes = ["Single answer", "Multiple choice"]
const colors = ['red', 'blue', 'orange', 'green']

function generateId(length) {
    const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let id = ""
    for (let _ = 0; _ < length; _++) { 
        id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
    }
    
    return id
}

async function fetchHTML(document, url, prefix) {
    await fetch(prefix + url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser()
            const newDoc = parser.parseFromString(html, 'text/html')
            const script = newDoc.querySelector('script')

            for (let css of document.head.querySelectorAll('link[rel="stylesheet"]')) css.remove()
            
            for (let cssLink of newDoc.head.querySelectorAll('link[rel="stylesheet"]')) {
                let newLink = document.createElement('link')
                newLink.rel = "stylesheet"
                newLink.href = prefix + cssLink.getAttribute('href')
                document.head.appendChild(newLink)
            }
            
            document.body.innerHTML = newDoc.body.innerHTML

            if (!script) return
            
            let newScript = document.createElement('script')
            newScript.textContent = script.textContent
            document.body.appendChild(newScript)
        })
        .catch(error => console.error('Error loading content: ' + error))
}

function createAlternative(container, alternatives, isClient = false) {
    for (let i = 0; i < alternatives.length; i++) {
        let alternative = document.createElement('div')
        alternative.className = 'alternative ' + colors[i]
        alternative.setAttribute('index', i)
        alternative.textContent = alternatives[i]

        if (isClient) alternative.style.cursor = 'pointer'
        
        container.appendChild(alternative)
    }
}

function createFakeClients(amount) {
    for (let _  = 0; _ < amount; _++) {
        let clientDiv = document.createElement('div')
        clientDiv.className = 'client'
        clientDiv.textContent = `${_}`.repeat(3)
        clientDiv.onclick = () => removeClient(x.peer)

        document.getElementById('client-container').appendChild(clientDiv)
    }
}
