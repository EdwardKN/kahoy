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