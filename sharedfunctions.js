function sendData(item) {
    const http = new XMLHttpRequest();
    let url = "https://l2niipto9l.execute-api.eu-north-1.amazonaws.com/EdwardKN/updatekahoyusers?";
    Object.entries(item).forEach(e => {
        console.log(e)
        url += e[0] + "=" + e[1] + "&";
    })

    http.open("GET", url);
    http.send();


    http.onreadystatechange = (e) => {
        if (http.readyState === 4) {
            console.log(e.responseText)
        }
    };
};
function getData(callback) {
    const http = new XMLHttpRequest();
    const url = `https://l2niipto9l.execute-api.eu-north-1.amazonaws.com/EdwardKN/getkahoyusers`;
    http.open("GET", url);
    http.send();

    http.onreadystatechange = (e) => {
        if (http.readyState === 4) {
            callback(JSON.parse(http.responseText));
        }
    };
};

function getSessions(callback) {
    const http = new XMLHttpRequest();
    const url = `https://l2niipto9l.execute-api.eu-north-1.amazonaws.com/EdwardKN/getkahoysessions`;
    http.open("GET", url);
    http.send();

    http.onreadystatechange = (e) => {
        if (http.readyState === 4) {
            callback(JSON.parse(http.responseText));
        }
    };
};