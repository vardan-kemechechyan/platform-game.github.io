function preload() {
    stoneImg = loadImage(stoneImg);
    sandImg = loadImage(sandImg);
    metalImg = loadImage(metalImg);
    playerSprite = loadImage(playerSprite);
    coinImg = loadImage(coinImg);
    cupImg = loadImage(cupImg);
    slicerImg = loadImage(slicerImg);
    backgroundImg = loadImage(backgroundImg);
    hArrowImg = loadImage(hArrowImg);
    vArrowImg = loadImage(vArrowImg);
    startImg = loadImage(startImg);
    stopImg = loadImage(stopImg);
    nextArrowImg = loadImage(nextArrowImg);
    deleteButton.img = loadImage(deleteButton.img);
    menuImg = loadImage(menuImg);
    starImg = loadImage(starImg);
    player = new Player(playerStartingX, playerStartingY, playerWidth, playerHeight, playerSprite, playerVX, playerVY, playerA);
    cup = new Cup(cupStartingX, cupStartingY, cupWidth, cupHeight, cupImg);
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    noStroke();
    for (let i = 0; i <= width / waveSize; i++) {
        seaArr.push({
            size: waveSize,
            x: i * waveSize + waveSize / 2,
            y: seaStartingY
        });
    }

    for (let i = 0; i < toolsFunctions.length; i++) {
        tools.push({
            x: i * width / toolsFunctions.length,
            y: 0,
            w: width / toolsFunctions.length,
            h: toolBarHeight,
            color: toolBarColor,
            f: toolsFunctions[i]
        })

        if (toolsFunctions[i] == "Stone") {
            tools[i].img = stoneImg;
            tools[i].imgH = stoneHeight;
            tools[i].imgW = stoneWidth;
        }
        else if (toolsFunctions[i] == "Horizontal") {
            tools[i].vX = 0.2;
            tools[i].img = metalImg;
            tools[i].imgH = metalBlocksHeight;
            tools[i].imgW = metalBlocksWidth;
        }
        else if (toolsFunctions[i] == "Vertical") {
            tools[i].vY = 0.2;
            tools[i].img = metalImg;
            tools[i].imgH = metalBlocksHeight;
            tools[i].imgW = metalBlocksWidth;
        }
        else if (toolsFunctions[i] == "Death") {
            tools[i].img = metalImg;
            tools[i].imgH = metalBlocksHeight;
            tools[i].imgW = metalBlocksWidth;
            tools[i].slicer = {
                x: tools[i].x,
                y: tools[i].y,
                w: tools[i].imgW,
                h: tools[i].imgH / 2,
                vY: 0.2,
                img: slicerImg
            }
        }
        else if (toolsFunctions[i] == "Sand") {
            tools[i].img = sandImg;
            tools[i].imgH = sandHeight;
            tools[i].imgW = sandWidth;
            tools[i].opacity = 1;
        }
        else if (toolsFunctions[i] == "Coin") {
            tools[i].img = coinImg;
            tools[i].imgH = coinSize;
            tools[i].imgW = coinSize;

        }
    }

    for (let i = 0; i < toolBarForPlaying.length; i++) {
        toolsForPlaying.push({
            x: i * width / toolBarForPlaying.length,
            y: 0,
            w: width / toolBarForPlaying.length,
            h: toolBarHeight,
            color: toolBarColor,
            f: toolBarForPlaying[i],
            opacity: 1
        })

        if (toolsForPlaying[i].f == "Next") {
            toolsForPlaying[i].img = nextArrowImg;
            toolsForPlaying[i].imgH = nextArrowH;
            toolsForPlaying[i].imgW = nextArrowW;
            toolsForPlaying[i].opacity = 0.5;
        }
        else if (toolsForPlaying[i].f == "Menu") {
            toolsForPlaying[i].img = menuImg;
            toolsForPlaying[i].imgH = menuH;
            toolsForPlaying[i].imgW = menuW;
        }
    }
    initalInput = checkInput();
    if (initalInput) {
        deleteEverything();
        construct(initalInput)
        built = true;
    }

}

function draw() {
    check();
    drawBackground(x, y);
    var menu = toolsForPlaying.find(function (item) {
        return item.f == "Menu"
    });
    var next = toolsForPlaying.find(function (item) {
        return item.f == "Next"
    });
    if (gameStarted)
        menu.opacity = 0.5;
    else
        menu.opacity = 1;

    // if (playerWon)
    //     next.opacity = 1;
    // else
    //     next.opacity = 0.5;

    let input = checkInput();
    if (levelsPassed <= 3)
        enableDisable(levelsPassed);
    if (!popup) {
        if (gameStarted) {
            player.play();
            star.x = cup.x + cup.w / 2 - star.w/2;
            star.y = cup.y + cup.h / 2;
        }
        else {
            if (!playerWon) {
                star.x = cup.x + cup.w / 2 - star.w/2;
                star.y = cup.y + cup.h / 2;
            }
            else if (star.y > cup.y - 50) {
                star.y--;
            }
            if (levelsPassed >= 3 || input) {
                player.prepare();
                cup.edit();
                if (mouseIsPressed) {
                    if (editedBlocksID >= 0) {
                        blocks[editedBlocksID].x = mouseX - x - blocks[editedBlocksID].w / 2;
                        blocks[editedBlocksID].y = mouseY - y - blocks[editedBlocksID].h / 2;
                        updateBlocksCoordinates(editedBlocksID)
                    }
                    if (editedCoinsID >= 0) {
                        coins[editedCoinsID].x = mouseX - x - coins[editedCoinsID].w / 2;
                        coins[editedCoinsID].y = mouseY - y - coins[editedCoinsID].h / 2;
                    }
                }
            }
        }
    }
}

function mouseReleased() {
    if (editedBlocksID >= 0 && editedBlocksID != undefined) {
        blocks[editedBlocksID].deleteBlock()
        editedBlocksID = undefined;
    }
    if (editedCoinsID >= 0 && editedCoinsID != undefined) {
        coins[editedCoinsID].deleteCoin();
        editedCoinsID = undefined;
    }
    playerEditing = false;
    blockRangeEditing = false;
    cupEditing = false;
}

function mousePressed() {
    if (!popup) {
        let input = checkInput();
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            if (!gameStarted) {
                if (mouseX > deleteButton.x && mouseX < deleteButton.x + deleteButton.w && mouseY > deleteButton.y && mouseY < deleteButton.y + deleteButton.h && (editedBlocksID == undefined || editedBlocksID < 0) && !playerEditing && (editedCoinsID == undefined || editedCoinsID < 0) && !blockRangeEditing) {
                    if (levelsPassed >= 3 || input)
                        confirm();
                }
                else {
                    editedBlocksID = editBlocks();
                    editedCoinsID = editCoins();
                    if ((editedBlocksID == undefined || editedBlocksID < 0) && (editedCoinsID == undefined || editedCoinsID < 0) && !cupEditing && !blockRangeEditing && mouseX > player.x + x && mouseX < player.x + x + player.w && mouseY > player.y + y && mouseY < player.y + y + player.h) {
                        playerEditing = true;
                    }
                    if ((editedBlocksID == undefined || editedBlocksID < 0) && (editedCoinsID == undefined || editedCoinsID < 0) && !cupEditing && !playerEditing) {
                        blockRangeEditing = blocks.find(function (b) {

                            if (b.editor) {
                                return mouseX > b.editor.x + x && mouseX < b.editor.x + b.editor.w + x && mouseY > b.editor.y + y && mouseY < b.editor.y + y + b.editor.h
                            }
                        });
                    }

                    if ((editedBlocksID == undefined || editedBlocksID < 0) && (editedCoinsID == undefined || editedCoinsID < 0) && !blockRangeEditing && !playerEditing &&
                        mouseX > cup.x + x && mouseX < cup.x + x + cup.w && mouseY > cup.y + y && mouseY < cup.y + y + cup.h) {
                        cupEditing = true;
                    }
                }
            }
            if (mouseY <= toolBarHeight) {

                if (levelsPassed <= 3 && !input) {
                    toolBarFunction(toolsForPlaying);
                }
                else {
                    toolBarFunction(tools);
                }
            }
        }
    }
}


function keyPressed() {
    if (keyCode == UP_ARROW && !popup) {
        player.startJump();
    }
}

function keyReleased() {
    if (keyCode == UP_ARROW && !popup) {
        player.endJump();
    }
}


