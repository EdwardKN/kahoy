if (localStorage.getItem("session")) {
    document.getElementById("login").textContent = "Logout";
    document.getElementById("signUp").remove();
    document.getElementById("login").onclick = function () {
        localStorage.clear();
        window.location.reload();
    }
} else {
    document.getElementById("login").onclick = function () {
        window.location.replace('./../login/index.html')
    }
    document.getElementById("create").remove();

}