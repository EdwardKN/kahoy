document.getElementById("form").addEventListener('submit', handleForm);
function handleForm(event) { event.preventDefault(); }


function signUp() {
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;

    if (password == password2) {
        getData(function (users) {
            let notOkUsers = users.filter(e => (e.username == username || e.email == email))
            if (notOkUsers.length > 0) {
                alert("Same username or email is used by another account");
            } else {
                sendData({
                    username: username,
                    password: CryptoJS.MD5(password).toString(),
                    email: email
                },function(){
                    login(username,password);
                });
            };
        });
    } else {
        alert("Passwords are not the same!");
    };
};

function login(username,password) {
    let loginUsername = username ? username : document.getElementById("username").value;
    let loginPassword = password ? password : document.getElementById("password").value;

    getData(function (users) {
        let user = users.filter(e => e.username == loginUsername)[0];
        if (user?.password == CryptoJS.MD5(CryptoJS.MD5(loginPassword).toString()).toString()) {
            sendSession(loginUsername);
        };
    });
};

function sendSession(username) {
    const http = new XMLHttpRequest();
    let session = CryptoJS.MD5((Math.random() * 100000000000));
    let url = "https://l2niipto9l.execute-api.eu-north-1.amazonaws.com/EdwardKN/sendkahoysession?session=" + session + "&username=" + username;

    http.open("GET", url);
    http.send();


    http.onreadystatechange = (e) => {
        if (http.readyState === 4) {
            localStorage.setItem("session", session);
            window.location.replace('../main/main.html');
        };
    };
}