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

