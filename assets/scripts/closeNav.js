function closeNave(){
    document.getElementById("navbar").checked = false;
}

document.getElementById("closeNavHome").addEventListener("click", closeNave)
document.getElementById("closeNavAbout").addEventListener("click", closeNave)
document.getElementById("closeNavSkills").addEventListener("click", closeNave)
document.getElementById("closeNavTimeline").addEventListener("click", closeNave)
document.getElementById("closeNavProjects").addEventListener("click", closeNave)
document.getElementById("modeToggle").addEventListener("click", closeNave)
// document.getElementById("closeNavContact").addEventListener("click", closeNave)
document.getElementById("main").addEventListener("click", closeNave)
