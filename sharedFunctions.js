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

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
    return arr
}

function fetchHTML(document, url) {    
    fetch(url)
        .then(response => response.text())
        .then(html => {

            const parser = new DOMParser()
            const newDoc = parser.parseFromString(html, 'text/html')
            const script = newDoc.querySelector('script')

            document.body.innerHTML = newDoc.body.innerHTML
            document.head.innerHTML = newDoc.head.innerHTML

            if (!script) return
            
            let newScript = document.createElement('script')
            newScript.textContent = script.textContent
            document.body.appendChild(newScript)
        })
        .catch(error => console.error('Error loading content: ' + error))
}