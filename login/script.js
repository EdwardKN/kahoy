document.getElementById("form").addEventListener('submit', handleForm);
function handleForm(event) { event.preventDefault(); }


function signUp() {
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;

    if (password == password2) {
        sendData({
            username: username,
            password: CryptoJS.MD5(password).toString(),
            email: email,
            signUp: true
        }, function (e) {
            if (e) {
                login(username, password);
            } else {
                alert("Same username or email is used by another account");
            }
        });
    } else {
        alert("Passwords are not the same!");
    };
};

function login(username, password) {
    let loginUsername = username ? username : document.getElementById("username").value;
    let loginPassword = password ? password : document.getElementById("password").value;

    checkPassword(loginUsername, loginPassword, function (e) {
        if (e) {
            localStorage.setItem("session", e);
            window.location.replace('./../index.html');
        } else {
            alert("Wrong username or password")
        }
    })
};
