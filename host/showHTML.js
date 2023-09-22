function showPreviewScreen() {
    document.getElementById('main').remove()
    let a = document.getElementsByClassName('game-button')
    while (a[0]) a[0].remove()

    // Main
    let mainContainer = document.createElement('div')
    mainContainer.className = 'main-container'    

    // Id
    let gameId = document.createElement('h1')
    gameId.id = 'game-id'
    gameId.textContent = 'Game pin: ' + peer.id
    gameId.onclick = () => { navigator.clipboard.writeText(peer.id) }

    // Start, Lock
    let statusContainer = document.createElement('div')
    statusContainer.id = 'status-container'

    let lockStart = document.createElement('div')
    lockStart.id = 'lock-start'

    let lock = document.createElement('img')
    lock.id = 'lock'
    lock.src = 'imgs/open-lock.png'
    lock.state = true
    lock.onclick = () => {
        if (lock.state) {
            lock.src = 'imgs/closed-lock.png'
        } else if (!lock.state) {
            lock.src = 'imgs/open-lock.png'
        }
        lock.state = !lock.state
    }

    let start = document.createElement('button')
    start.className = 'next'
    start.textContent = 'Start'
    start.disabled = true
    
    start.onclick = () => {
        console.log("Hi")
    }

    // Client Container
    /* WAITING FOR PLAYERS HAS NOT BEEN IMPLEMENTED */
    let clientContainer = document.createElement('div')
    clientContainer.id = 'client-container'

    // Amount, Sound, Settings, Fullscreen
    let settingsContainer = document.createElement('div')
    settingsContainer.id = 'settings-container'

    let amount = document.createElement('div')
    amount.id = 'amount-of-players'
    amount.textContent = '0'
    
    let sound = document.createElement('button')
    sound.textContent = 'Sound'

    let settings = document.createElement('button')
    settings.textContent = 'Settings'

    let fullscreen = document.createElement('button')
    fullscreen.textContent = 'Fullscreen'

    fullscreen.onclick = () => {
        if (!window.screenTop && !window.screenY) { document.exitFullscreen() }
        else { document.requestFullscreeen(container) }
    }

    settingsContainer.appendChild(amount)
    settingsContainer.appendChild(sound)
    settingsContainer.appendChild(settings)
    settingsContainer.appendChild(fullscreen)

    lockStart.appendChild(lock)
    lockStart.appendChild(start)
    statusContainer.appendChild(lockStart)

    mainContainer.appendChild(gameId)
    mainContainer.appendChild(statusContainer)
    mainContainer.appendChild(clientContainer)
    mainContainer.appendChild(settingsContainer)

    document.body.appendChild(mainContainer)
}