var modal = document.getElementById('win');
var startPopUp = document.getElementById('start');
//var spanWin = document.getElementById('closeWin');
var spanStart = document.getElementById('closeStart');
var spanBuild = document.getElementById('closeBuild');
var cnv = document.getElementById('defaultCanvas0');
var h1 = document.getElementById("message")
var lvl1 = document.getElementById('lvl1');
var lvl2 = document.getElementById('lvl2');
var lvl3 = document.getElementById('lvl3');
var build = document.getElementById('build');
var letsstart = document.getElementById('letsstart');
var confirmYes = document.getElementById('yes');
var confirmNo = document.getElementById('no');
var confBox = document.getElementById('delete');
var saveBox = document.getElementById('save');
var saveButton = document.getElementById("saveButton");
var spanSave = document.getElementById("closeSave");
var spanLink = document.getElementById("closeLink");
var inputField = document.getElementById("data");
var linkOk = document.getElementById("OK");
var getLinkBox = document.getElementById("getLink")

function checkClose() {
    if (blocks.length == 0 && levelsPassed < 3) {
        spanStart.style.display = "none"
    }
    else {
        spanStart.style.display = "inline"
    }
}

// spanWin.onclick = function () {
//     modal.style.display = "none";
//     popup = false;
// }
linkOk.onclick = function () {
    copyToClipboard();
    getLinkBox.style.display = "none";
    popup = false;
    location.href = saveCoords(data);

}
spanLink.onclick = function () {
    getLinkBox.style.display = "none";
    popup = false;
}
spanStart.onclick = function () {
    startPopUp.style.display = "none";
    popup = false;
}
spanBuild.onclick = function () {
    build.style.display = "none";
    popup = false;
}
spanBuild.onclick = function () {
    build.style.display = "none";
    popup = false;
}
spanSave.onclick = function () {
    saveBox.style.display = "none";
    popup = false;
}
saveButton.onclick = function () {
    saveBox.style.display = "none";
    popup = false;
    saveCoords(data);
}
lvl1.onclick = function () {
    startPopUp.style.display = "none";
    popup = false;
    currentLvl = 1;
    drawLevel(currentLvl)

}
lvl2.onclick = function () {
    startPopUp.style.display = "none";
    popup = false;
    currentLvl = 2;
    drawLevel(currentLvl)

}
lvl3.onclick = function () {
    startPopUp.style.display = "none";
    popup = false;
    currentLvl = 3;
    drawLevel(currentLvl)
}
letsstart.onclick = function () {
    build.style.display = "none";
    popup = false;
    levelsPassed++
    deleteEverything();
    data = {
        blocks: [],
        player: { x: playerStartingX, y: playerStartingY },
        coins: [],
        cup: { x: cupStartingX, y: cupStartingY },
        camera: { x: 0, y: 0 }
    }

}


function check() {
    // if (playerWon && !informed) {
    //     //modal.style.display = "block";
    //     popup = true;
    //     informed = true;
    // }
    let input = checkInput()
    if (input) {
        startPopUp.style.display = "none";
        popup = false;
    }
    checkClose()
}

function confirm() {
    confBox.style.display = "block";
    popup = true;
}

function enableDisable(passed) {
    for (let i = 3; i > passed; i--) {
        window['lvl' + i].disabled = true;
        window['lvl' + i].style.backgroundColor = "#aaa";
    }
    for (let i = 1; i <= passed; i++) {
        window['lvl' + i].disabled = false;
        window['lvl' + i].style.backgroundColor = window['lvl' + i].style.borderColor;

    }
}

confirmYes.onclick = function () {
    confBox.style.display = "none";
    popup = false;
    deleteEverything();
}
confirmNo.onclick = function () {
    confBox.style.display = "none";
    popup = false;
}