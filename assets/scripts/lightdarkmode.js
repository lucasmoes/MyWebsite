var bool = false;
var img = document.createElement("img");

img.src = "assets/img/icons/dark_mode.svg";
document.getElementById("modeToggle").appendChild(img);

document.getElementById("modeToggle").addEventListener("click", function() {
    var element = document.body;
    element.classList.toggle("light-mode");

    if (bool){
        img.src = "assets/img/icons/dark_mode.svg";
        document.getElementById("modeToggle").appendChild(img);

        bool = false;
    }
    else {
        img.src = "assets/img/icons/light_mode.svg";
        document.getElementById("modeToggle").appendChild(img);
        bool = true;
    }
});
