function sendData(item,callback) {
    console.log(item)
    const http = new XMLHttpRequest();
    let url = "https://l2niipto9l.execute-api.eu-north-1.amazonaws.com/EdwardKN/updatekahoyusers?";
    Object.entries(item).forEach(e => {
        url += e[0] + "=" + e[1] + "&";
    })

    http.open("GET", url);
    http.send();


    http.onreadystatechange = (e) => {
        if (http.readyState === 4) {
            callback()
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

function getUser(callback){
    getSessions(e => {
        getData(h => {
            callback(h.filter(j => j.username == (e.filter(g => g.session == localStorage.getItem("session"))[0].username))[0]);
        })
    })
   
}