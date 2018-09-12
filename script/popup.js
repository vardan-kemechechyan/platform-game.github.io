//gets the html elements

var modal = document.getElementById('win');
var startPopUp = document.getElementById('start');
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

//if there is a level created, the closing button is available
function checkClose() {
    if (blocks.length === 0 && levelsPassed < 3) {
        spanStart.style.display = "none"
    }
    else {
        spanStart.style.display = "inline"
    }
}

let input = checkInput();

if(!input){
    startPopUp.style.display = 'block';
    //disables not passed levels to prevent cheating
    if (levelsPassed <= 3)
    enableDisable(levelsPassed);

    popup = true;
}
//copy link to clipboard
linkOk.onclick = function () {
    copyToClipboard();
    getLinkBox.style.display = "none";
    popup = false;
    location.href = saveCoords(data);

}

//closes the save page and update the location
spanLink.onclick = function () {
    getLinkBox.style.display = "none";
    playerWon = false;
    popup = false;
    location.href = saveCoords(data);
}
//closes the main (start) popup
spanStart.onclick = function () {
    startPopUp.style.display = "none";
    playerWonTemp = false;
    popup = false;
}
//closes the popup which asks you to build a level
spanBuild.onclick = function () {
    build.style.display = "none";
    playerWonTemp = false;
    popup = false;
}

//closes the popup about saving the level
spanSave.onclick = function () {
    saveBox.style.display = "none";
    playerWon = false;
    popup = false;
}

//generates your link to give it to you
saveButton.onclick = function () {
    saveBox.style.display = "none";
    playerWonTemp = false;
    popup = false;
    saveCoords(data);
}

//draws level 1
lvl1.onclick = function () {
    startPopUp.style.display = "none";
    playerWonTemp = false;
    popup = false;
    currentLvl = 1;
    drawLevel(currentLvl);
}

//draws level 2
lvl2.onclick = function () {
    startPopUp.style.display = "none";
    playerWonTemp = false;
    popup = false;
    currentLvl = 2;
    drawLevel(currentLvl);
}

//draws level 3
lvl3.onclick = function () {
    startPopUp.style.display = "none";
    playerWonTemp = false;
    popup = false;
    currentLvl = 3;
    drawLevel(currentLvl);
}

//start building your level and delete everything which was built before you
letsstart.onclick = function () {
    playerWonTemp = false;
    playerWon = false;
    build.style.display = "none";
    popup = false;
    levelsPassed++;
    deleteEverything();
    cup.x = cupStartingX;
    cup.y = cupStartingY;
    data = {
        blocks: [],
        player: { x: playerStartingX, y: playerStartingY },
        coins: [],
        cup: { x: cupStartingX, y: cupStartingY },
        camera: { x: 0, y: 0 }
    };
}

//confirms the deletation
function confirm() {
    confBox.style.display = "block";
    popup = true;
}

//enables/disables the levels
function enableDisable(passed) {
    for (let i = 1; i <= passed; i++) {
        window['lvl' + i].disabled = false;
        window['lvl' + i].style.backgroundColor = window['lvl' + i].style.borderColor;
    }
}

//confirmation process
confirmYes.onclick = function () {
    confBox.style.display = "none";
    popup = false;
    deleteEverything();
}
confirmNo.onclick = function () {
    confBox.style.display = "none";
    popup = false;
}
