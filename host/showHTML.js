/* Maybe not needed 1 */
async function requestScriptContent(script) {
    let src = script.src
    if (!src) { return script.textContent }
    
    return await new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()
        request.open('GET', src)
        request.onreadystatechange = () => {
            if (request.readyState !== 4) { return }
            if (request.status === 200) { resolve(request.responseText) }
            else { reject(new Error(`Failed to load script; ${src}. Status: ${request.status}`)) }
        }
        request.send()
    })
}
/* 1 End */






function addShape(element, color) {    
    // Add shapes
}

function showQuestionAnswers() {

}


