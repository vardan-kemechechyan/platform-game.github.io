function preload() {
    //loading the images

    stoneImg = loadImage(stoneImg);
    sandImg = loadImage(sandImg);
    metalImg = loadImage(metalImg);
    playerSprite = loadImage(playerSprite);
    coinImg = loadImage(coinImg);
    cupImg = loadImage(cupImg);
    slicerImg = loadImage(slicerImg);
    backgroundImg = loadImage(backgroundImg);
    startImg = loadImage(startImg);
    stopImg = loadImage(stopImg);
    deleteButton.img = loadImage(deleteButton.img);
    menuImg = loadImage(menuImg);
    starImg = loadImage(starImg);
    sandToolImg = loadImage(sandToolImgUrl);
    HToolImg = loadImage(HToolImgUrl);
    VToolImg = loadImage(VToolImgUrl);
    deathToolImg = loadImage(deathToolImgUrl);

    //creating the main objects
    player = new Player(playerStartingX, playerStartingY, playerWidth, playerHeight, playerVX, playerVY, playerA);
    cup = new Cup(cupStartingX, cupStartingY, cupWidth, cupHeight);
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    noStroke();
    //preparing the toolBar
    for (let i = 0, n = toolsFunctions.length; i < n; i++) {
        tools.push({
            x: i * width / toolsFunctions.length,
            y: 0,
            w: width / toolsFunctions.length,
            h: toolBarHeight,
            color: toolBarColor,
            f: toolsFunctions[i]
        });

        if (toolsFunctions[i] === "Stone") {
            tools[i].img = stoneImg;
            tools[i].imgH = stoneHeight;
            tools[i].imgW = stoneWidth;
        }
        else if (toolsFunctions[i] === "Horizontal") {
            tools[i].vX = 0.2;
            tools[i].img = metalImg;
            tools[i].imgH = metalBlocksHeight;
            tools[i].imgW = metalBlocksWidth;
        }
        else if (toolsFunctions[i] === "Vertical") {
            tools[i].vY = 0.2;
            tools[i].img = metalImg;
            tools[i].imgH = metalBlocksHeight;
            tools[i].imgW = metalBlocksWidth;
        }
        else if (toolsFunctions[i] === "Death") {
            tools[i].img = metalImg;
            tools[i].imgH = metalBlocksHeight;
            tools[i].imgW = metalBlocksWidth;
            tools[i].slicer = {
                x: tools[i].x,
                y: tools[i].y,
                w: tools[i].imgW,
                h: tools[i].imgH / 2,
                vY: 0.2,
            }
        }
        else if (toolsFunctions[i] === "Sand") {
            tools[i].img = sandImg;
            tools[i].imgH = sandHeight;
            tools[i].imgW = sandWidth;
            tools[i].opacity = 1;
        }
        else if (toolsFunctions[i] === "Coin") {
            tools[i].img = coinImg;
            tools[i].imgH = coinSize;
            tools[i].imgW = coinSize;
        }
    }

    for (let i = 0, n = toolBarForPlaying.length; i < n; i++) {
        toolsForPlaying.push({
            x: i * width / toolBarForPlaying.length,
            y: 0,
            w: width / toolBarForPlaying.length,
            h: toolBarHeight,
            color: toolBarColor,
            f: toolBarForPlaying[i],
            opacity: 1
        })

        if (toolsForPlaying[i].f === "Next") {
            toolsForPlaying[i].img = nextArrowImg;
            toolsForPlaying[i].imgH = nextArrowH;
            toolsForPlaying[i].imgW = nextArrowW;
            toolsForPlaying[i].opacity = 0.5;
        }
        else if (toolsForPlaying[i].f === "Menu") {
            toolsForPlaying[i].img = menuImg;
            toolsForPlaying[i].imgH = menuH;
            toolsForPlaying[i].imgW = menuW;
        }
    }
    //if there is an initial input, it constructs the level

    if (input) {
        deleteEverything();
        construct(input)
        built = true;
    }
}

var menu;

function draw() {

    if(player.dead)
    {
        if(frameCount % blinkTimeInterval === 0) {
            // every 100 milisecs
            player.blinkCount++;

            if (player.opacity === 1)  player.opacity = 0.5;
            else player.opacity = 1;
        }
    
        if(player.blinkCount === playerBlinkCount) {
            // every second
            gameStarted = false;
            construct(data);
        }
    }

    //draws the background
    drawBackground(x, y);

    //saves the object in a variable
    if(menu == undefined)
    {
        menu = toolsForPlaying.find(function (item) {
            return item.f === "Menu";
        });
    }
    //enable/disable the menu
    if (gameStarted)
        menu.opacity = 0.5;
    else
        menu.opacity = 1;

    //disables the toolbar's function if there is a popup
    if (!popup) {
        if (gameStarted) {
            player.play();
        }
        else {
            //if player passed 3 levels or there is an input, allows editing of objects
            if (levelsPassed >= 4 || input) {
                player.prepare();
                cup.edit();
                if (mouseIsPressed) {
                    if (editedBlocksID >= 0) {
                        blocks[editedBlocksID].x = mouseX - x - blocks[editedBlocksID].w / 2;
                        blocks[editedBlocksID].y = mouseY - y - blocks[editedBlocksID].h / 2;
                        updateBlocksCoordinates(editedBlocksID);
                    }
                    if (editedCoinsID >= 0) {
                        coins[editedCoinsID].x = mouseX - x - coins[editedCoinsID].w / 2;
                        coins[editedCoinsID].y = mouseY - y - coins[editedCoinsID].h / 2;
                    }
                }
            }
        }

        //player won the levels-star rises
        if (playerWon || playerWonTemp) {
            starRise();
        }
        else {
            star.x = cup.x + cup.w / 2 - star.w / 2;
            star.y = cup.y;
        }
    }
}

function mouseReleased() {
    //mouse is Released => there are no objects which are being edited
    if (editedBlocksID >= 0 && editedBlocksID != undefined) {
        blocks[editedBlocksID].deleteBlock();
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
    //disables everything if there is a popup
    if (!popup) {
        //checks if mouse was pressed on the canvas
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            if (!gameStarted) {
                //ckecks if mouse was pressed on the trash box
                if (mouseX > deleteButton.x && mouseX < deleteButton.x + deleteButton.w && mouseY > deleteButton.y && mouseY < deleteButton.y + deleteButton.h && (editedBlocksID == undefined || editedBlocksID < 0) && !playerEditing && (editedCoinsID == undefined || editedCoinsID < 0) && !blockRangeEditing) {
                    //needs a confirmation to delete everything
                    if (levelsPassed >= 4 || input)
                        confirm();
                }
                else {
                    //editing different objects
                    editedBlocksID = editBlocks();
                    editedCoinsID = editCoins();
                    if ((editedBlocksID === undefined || editedBlocksID < 0) && (editedCoinsID === undefined || editedCoinsID < 0) && !cupEditing && !blockRangeEditing && mouseX > player.x + x && mouseX < player.x + x + player.w && mouseY > player.y + y && mouseY < player.y + y + player.h) {
                        playerEditing = true;
                    }
                    if ((editedBlocksID === undefined || editedBlocksID < 0) && (editedCoinsID === undefined || editedCoinsID < 0) && !cupEditing && !playerEditing) {
                        blockRangeEditing = blocks.find(function (b) {

                            if (b.editor) {
                                return mouseX > b.editor.x + x && mouseX < b.editor.x + b.editor.w + x && mouseY > b.editor.y + y && mouseY < b.editor.y + y + b.editor.h
                            }
                        });
                    }

                    if ((editedBlocksID === undefined || editedBlocksID < 0) && (editedCoinsID === undefined || editedCoinsID < 0) && !blockRangeEditing && !playerEditing &&
                        mouseX > cup.x + x && mouseX < cup.x + x + cup.w && mouseY > cup.y + y && mouseY < cup.y + y + cup.h) {
                        cupEditing = true;
                    }
                }
            }

            if (mouseY <= toolBarHeight) {
                //toolBarfunction for both cases (passed 3 levels and not passed)
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
    //starts jumping
    if (keyCode === UP_ARROW && !popup) {
        player.startJump();
    }
    if (keyCode === LEFT_ARROW) {
        player.left_right[0] = true;
    }
    if (keyCode === RIGHT_ARROW) {
        player.left_right[1] = true;
    }
}

function keyReleased() {
    //starts falling
    if (keyCode === UP_ARROW && !popup) {
        player.endJump();
    }
    if (keyCode === LEFT_ARROW) {
        player.left_right[0] = false;
        player.currentFrame = 0;
    }
    if (keyCode === RIGHT_ARROW) {
        player.left_right[1] = false;
        player.currentFrame = 0;
    }
}