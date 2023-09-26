if (localStorage.getItem("session")) {
    document.getElementById("signUp").textContent = "Logout";
    document.getElementById("login").textContent = "Logged in as";
    document.getElementById("login").onclick = undefined;
    document.getElementById("signUp").onclick = function () {
        localStorage.clear();
        window.location.reload();
    }
    getUser(function (user) {
        if (localStorage.getItem("session")) {
            document.getElementById("login").textContent = user.username;
        } else {
            document.getElementById("login").textContent = "Login";
        }
    })
} else {
    document.getElementById("login").onclick = function () {
        window.location.replace('./../login/index.html')
    }
    document.getElementById("signUp").onclick = function () {
        window.location.replace('./../login/create.html');
    }
    document.getElementById("create").remove();

}

