var bool = false;
var img = document.createElement("img");

img.src = "assets/img/icons/dark_mode.svg";
document.getElementById("modeToggle").appendChild(img);

function togglekMode(typeMode) {
    const div = document.createElement("div");
    div.className = "mode-notification";
    if (typeMode) {
        div.innerHTML = `<p>Light mode Enabled</p>`

    } else {
        div.innerHTML = `<p>Dark mode Enabled</p>`
    }
    document.getElementById("light-mode-notifier").appendChild(div);

    setTimeout(function() {
        document.getElementById("light-mode-notifier").removeChild(div);
    }, 3000);
}

document.getElementById("modeToggle").addEventListener("click", function() {
    var element = document.body;
    element.classList.toggle("light-mode");

    if (bool){
        img.src = "assets/img/icons/dark_mode.svg";
        document.getElementById("modeToggle").appendChild(img);
        togglekMode(false);

        bool = false;
    }
    else {
        img.src = "assets/img/icons/light_mode.svg";
        document.getElementById("modeToggle").appendChild(img);
        togglekMode(true);

        bool = true;
    }
});
