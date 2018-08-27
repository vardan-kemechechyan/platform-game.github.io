function drawBackground(x, y) {
    //checks if the player wants to move the background with the mouse or not
    checkMouseMovement();
    //draws background image
    for (var i = 0; i <= backgroundSize / width; i++) {
        if (x > -width)
            image(backgroundImg, x + i * width, y, width, height)
    }
    //sets x,y to 0,0
    translate(x, y);
    //draws the world
    player.animate();
    drawSea();
    drawBlocks();
    cup.drawCup();
    //sets the starting points to the default
    translate(-x, -y);
    drawToolBar();

    if (!gameStarted && !starIsRising) {
        //synchronizes the minimap with the actual map
        minimapCameraMove(minimap);
        //draws the minimap
        drawMinimap(minimap)
    }
}

function blink() {
    //blink function
    if (player.opacity == 1)
        player.opacity = 0.5;
    else
        player.opacity = 1;

}
function drawToolBar() {
    let input = checkInput();
    //if(player passed 3 levels or inserted a link, the toolBar allows him to make editions)
    if (levelsPassed >= 4 || input) {
        for (let i = 0; i < tools.length; i++) {
            fill(...tools[i].color);
            rect(tools[i].x, 0, tools[i].w, tools[i].h, toolBarRectCorners);
            if (tools[i].f == "Stone" || tools[i].f == "Horizontal" || tools[i].f == "Vertical" || tools[i].f == "Death" || tools[i].f == "Sand" || tools[i].f == "Coin") {
                //prepares images for scaling
                var img = tools[i].img;
                var imageWidth = tools[i].imgW;
                var imageHeight = tools[i].imgH;
            }
            else if (tools[i].f == "Play") {
                //changes the icon
                var img = gameStarted ? stopImg : startImg;
                var imageWidth = stopStartW;
                var imageHeight = stopStarth;
            }
            else {
                img = undefined;
            }

            imageMode(CENTER)
            if (img) {
                //calculates the "scale"
                var scale = imageWidth > imageHeight ? tools[i].w / imageWidth : tools[i].h / imageHeight;
                //addes paddings to the toolBar buttons
                if (imageWidth > imageHeight) {
                    var horGap = toolBarImagesGap;
                    var vertGap = 0;
                }
                else if (imageWidth == imageHeight) {
                    var horGap = toolBarImagesGap;
                    var vertGap = toolBarImagesGap;
                }
                else {
                    var horGap = 0;
                    var vertGap = toolBarImagesGap;
                }

                if (tools[i].f == "Death") {
                    //killer tool animation
                    if (frameCount % deathToolFrameCount == 0) {
                        deathTool.counter++;
                        if (deathTool.counter >= deathTool.numOfFrames) {
                            deathTool.counter = 0;
                        }
                    }
                    image(window["deathImg" + deathTool.counter], tools[i].x + tools[i].w / 2, tools[i].y + tools[i].h / 2, tools[i].imgW * scale - horGap, tools[i].imgH * scale - vertGap);
                }
                else if (tools[i].f == "Sand") {
                    //breaking block animation
                    if (frameCount % sandToolFrameCount == 0) {
                        sandTool.counter--;
                        if (sandTool.counter < 0) {
                            sandTool.counter = sandTool.numOfSteps;
                        }
                    }
                    tint(255, sandTool.counter * (255 / sandTool.numOfSteps));
                    image(img, tools[i].x + tools[i].w / 2, tools[i].y + tools[i].h / 2, tools[i].imgW * scale - horGap, tools[i].imgH * scale - vertGap);
                    tint(255, 255);
                }
                else if (tools[i].f == "Vertical") {
                    //vertical block animation
                    if (frameCount % verticalToolFrameCount == 0) {
                        verticalTool.counter++;
                        if (verticalTool.counter >= verticalTool.numOfFrames) {
                            verticalTool.counter = 0;
                        }
                    }
                    image(window["verticalImg" + verticalTool.counter], tools[i].x + tools[i].w / 2, tools[i].y + tools[i].h / 2, tools[i].imgW * scale - horGap, tools[i].imgH * scale - vertGap);
                }
                else if (tools[i].f == "Horizontal") {
                    //horizontal block animation
                    if (frameCount % horizontalToolFrameCount == 0) {
                        horizontalTool.counter++;
                        if (horizontalTool.counter >= horizontalTool.numOfFrames) {
                            horizontalTool.counter = 0;
                        }
                    }
                    image(window["horizontalImg" + horizontalTool.counter], tools[i].x + tools[i].w / 2, tools[i].y + tools[i].h / 2, tools[i].imgW * scale - horGap, tools[i].imgH * scale - vertGap);
                }
                else {
                    // if there are no animations it just draws the blocks
                    image(img, tools[i].x + tools[i].w / 2, tools[i].y + tools[i].h / 2, tools[i].imgW * scale - horGap, tools[i].imgH * scale - vertGap);
                }
            }

            imageMode(CORNER);
        }
        // draws the trash box
        image(deleteButton.img, deleteButton.x, deleteButton.y, deleteButton.w, deleteButton.h)

        stroke(0);
        strokeWeight(1);
        noStroke()
    }
    //if the player can't create his own levels
    else if (levelsPassed < 4 && !input) {
        for (let i = 0; i < toolsForPlaying.length; i++) {
            fill(...toolsForPlaying[i].color, 255 * toolsForPlaying[i].opacity);
            rect(toolsForPlaying[i].x, 0, toolsForPlaying[i].w, toolsForPlaying[i].h, toolBarRectCorners);
            if (toolsForPlaying[i].f == "Menu") {
                //prepares for the scaling
                var img = toolsForPlaying[i].img;
                var imageWidth = toolsForPlaying[i].imgW;
                var imageHeight = toolsForPlaying[i].imgH;
            }
            else if (toolsForPlaying[i].f == "Play") {
                //switches the icons
                var img = gameStarted ? stopImg : startImg;
                var imageWidth = stopStartW;
                var imageHeight = stopStarth;
            }
            else {
                img = undefined;
            }

            imageMode(CENTER)
            if (img) {
                //scaling
                var scale = imageWidth > imageHeight ? toolsForPlaying[i].w / imageWidth : toolsForPlaying[i].h / imageHeight;
                //adding paddings
                if (imageWidth > imageHeight) {
                    var horGap = toolBarImagesGap;
                    var vertGap = 0;
                }
                else if (imageWidth == imageHeight) {
                    var horGap = toolBarImagesGap;
                    var vertGap = toolBarImagesGap;
                }
                else {
                    var horGap = 0;
                    var vertGap = toolBarImagesGap;
                }

                image(img, toolsForPlaying[i].x + toolsForPlaying[i].w / 2, toolsForPlaying[i].y + toolsForPlaying[i].h / 2, toolsForPlaying[i].imgW * scale - horGap, toolsForPlaying[i].imgH * scale - vertGap);

            }
            imageMode(CORNER)
        }
    }
}

function drawSea() {
    //drawing the sea
    image(seaImg, 0, seaStartingY, backgroundSize, height - seaStartingY);
}

function checkMouseMovement() {
    if (mouseY > toolBarHeight && mouseY < 0 + seaStartingY && mouseX > 0 && mouseX < 0 + width) {
        //moving both cameras (minimap and map)
        if (mouseX > width / backgroundEditRange * (backgroundEditRange - 1) && x > width - backgroundSize) {
            x -= 2;
            minimap.camera.x += 2 * minimap.scale;
        }
        else if (mouseX < width / backgroundEditRange && x < 0) {
            x += 2;
            minimap.camera.x -= 2 * minimap.scale;
        }
    }

}

function toolBarFunction(arr) {
    var tool = Math.floor(mouseX / arr[0].w);
    if (arr[tool].f == 'Play')
        start();
    //checking on which button the player clicked
    if (!gameStarted && !starIsRising) {
        let addedBlock = false;
        if (arr[tool].f == 'Stone') {
            blocks.push(new Block(arr[tool].x - x, arr[tool].y - y + toolBarHeight, stoneWidth, stoneHeight, stoneImg, 'Stone'));
            addedBlock = true;
        }
        else if (arr[tool].f == 'Horizontal') {
            blocks.push(new HorizontalBlock(arr[tool].x - x, arr[tool].y - y + toolBarHeight, metalBlocksWidth, metalBlocksHeight, metalImg, editorColor, 'Horizontal', horizontalBlocksSpeed, horizontalBlocksRange));
            addedBlock = true;
        }
        else if (arr[tool].f == 'Vertical') {
            blocks.push(new VerticalBlock(arr[tool].x - x, arr[tool].y + toolBarHeight - y, metalBlocksWidth, metalBlocksHeight, metalImg, editorColor, 'Vertical', verticalBlocksSpeed, verticalBlocksRange));
            addedBlock = true;
        }
        else if (arr[tool].f == 'Sand') {
            blocks.push(new SandBlock(arr[tool].x - x, arr[tool].y - y + toolBarHeight, sandWidth, sandHeight, sandImg, 'Sand'));
            addedBlock = true;
        }
        else if (arr[tool].f == 'Death') {
            blocks.push(new DeathBlock(arr[tool].x - x, arr[tool].y - y + toolBarHeight, metalBlocksWidth, metalBlocksHeight, metalImg, slicerImg, 'Death', deathBlockSlicerV));
            addedBlock = true;
        }
        else if (arr[tool].f == 'Coin') {
            coins.push(new Coin(arr[tool].x - x, arr[tool].y - y + toolBarHeight, coinSize, coinSize, coinImg));
            addedBlock = true;
        }

        if (addedBlock && playerWon) {
            playerWon = false;
            informed = false;
        }

        if (arr[tool].f == 'Menu') {
            startPopUp.style.display = "block";
            //disables not passed levels to prevent cheating
            if (levelsPassed <= 3)
                enableDisable(levelsPassed);

            popup = true;
        }
    }
}

function start() {
    //stop-play
    if (gameStarted) {
        construct(data);
        gameStarted = false;
    }
    else {
        gameStarted = true;
        let input = checkInput();
        if (levelsPassed >= 4 || input)
            data = fix();
    }
}

function drawBlocks() {
    image(starImg, star.x, star.y, star.w, star.h)
    for (var block of blocks) {
        //moving the blocks which can move and drawin their editors
        if (block.type == 'Horizontal' || block.type == 'Vertical') {
            if (gameStarted) {
                block.move();
            }
            else {
                let input = checkInput();
                if ((levelsPassed >= 4 || input) && !starIsRising) {
                    block.edit();
                    fill(block.editor.color);
                    rect(block.editor.x, block.editor.y, block.editor.w, block.editor.h);
                }
            }
        }

        else if (block.type == 'Death') {
            //killer block's functoin
            if (gameStarted) {
                block.move();
                block.kill();
            }
            image(slicerImg, block.slicer.x, block.slicer.y, block.slicer.w, block.slicer.h)
        }

        if (block.img) {
            //sand block
            tint(255, block.type == "Sand" ? block.strength / sandBlockStartingStrength * 255 : 255);
            image(block.img, block.x, block.y, block.w, block.h, blocksRoundedCorners);
            tint(255, 255);
        }
        else
            rect(block.x, block.y, block.w, block.h, blocksRoundedCorners);

    }
    noStroke();
    //drawing the coins (keys)
    coins.forEach(function (coin) {
        image(coinImg, coin.x, coin.y, coin.h, coin.w);
    });
}

function editBlocks() {
    //finds the block on which the player clicked
    var blockIndex = blocks.findIndex(function (b) {
        return mouseX - x > b.x && mouseX - x < b.x + b.w && mouseY - y > b.y && mouseY - y < b.y + b.h && !playerEditing && (editedCoinsID == undefined || editedCoinsID < 0);
    });
    return blockIndex
}

function editCoins() {
    //finds the coin on which the player clicked
    var coinIndex = coins.findIndex(function (b) {
        return mouseX - x > b.x && mouseX - x < b.x + b.w && mouseY - y > b.y && mouseY - y < b.y + b.h && !playerEditing && (editedBlocksID == undefined || editedBlocksID < 0);
    });
    return coinIndex
}

function updateBlocksCoordinates(i) {
    //updates the editors' and the slicer's coordinated while the main block is moved
    if (blocks[i].type == 'Horizontal') {
        blocks[i].editor.x = blocks[i].x + blocks[i].editRange;
        blocks[i].editor.y = blocks[i].y;
        blocks[i].staticX = blocks[i].x + blocks[i].w / 2;

    }
    else if (blocks[i].type == 'Vertical') {
        blocks[i].editor.x = blocks[i].x;
        blocks[i].editor.y = blocks[i].y + blocks[i].editRange;
        blocks[i].staticY = blocks[i].y + blocks[i].h / 2;
    }
    else if (blocks[i].type == 'Death') {
        blocks[i].slicer.y = blocks[i].y - blocks[i].slicer.h;
        blocks[i].slicer.x = blocks[i].x;
    }


}

function sandBreaker(obj) {
    // breaks the sandBlock
    var breakInt = setInterval(function () {
        var i = blocks.indexOf(obj)
        if (i >= 0) {
            blocks[i].strength--;
            if (blocks[i].strength == 0) {
                blocks.splice(i, 1)
                clearInterval(breakInt)
            }
        }
        else
            clearInterval(breakInt);
    }, 1000);

}

function deleteEverything() {
    //deletes everything excep the player and the cup (lock)
    blocks = [];
    player.x = playerStartingX;
    player.y = playerStartingY;
    coins = [];
    player.speedY = 0;
}

function fix() {
    //fixes the data to use it after
    var data = {};
    data.blocks = [];
    for (var i = 0; i < blocks.length; i++) {
        data.blocks[i] = {
            x: blocks[i].x,
            y: blocks[i].y,
            type: blocks[i].type,
            editRange: blocks[i].editRange ? blocks[i].editRange : undefined
        }
    }
    data.player = { x: player.x, y: player.y };
    data.coins = [];

    for (var i = 0; i < coins.length; i++) {
        data.coins[i] = {
            x: coins[i].x,
            y: coins[i].y,
        }
    }

    data.cup = { x: cup.x, y: cup.y };
    data.camera = { x: x, y: y };
    return data
}

function saveCoords(data) {
    //prepares the url 
    var json = JSON.stringify(data);
    let url = location.href
    if (url.indexOf("?") >= 0) {
        url = url.slice(0, url.indexOf("?"));
    }

    base64 = window.btoa(encodeURI(json))
    getLinkBox.style.display = 'block';
    var linkTXT = document.getElementById("link")
    linkTXT.value = base64;
    return url + "?data=" + base64;

}


function construct(data) {
    // builds the world by recieving a data
    blocks = [];
    coins = [];
    data.blocks.forEach(function (b) {
        if (b.type == 'Stone')
            blocks.push(new Block(b.x, b.y, stoneWidth, stoneHeight, stoneImg, 'Stone'));

        else if (b.type == 'Horizontal')
            blocks.push(new HorizontalBlock(b.x, b.y, metalBlocksWidth, metalBlocksHeight, metalImg, editorColor, 'Horizontal', horizontalBlocksSpeed, b.editRange));

        else if (b.type == 'Vertical')
            blocks.push(new VerticalBlock(b.x, b.y, metalBlocksWidth, metalBlocksHeight, metalImg, editorColor, 'Vertical', verticalBlocksSpeed, b.editRange));

        else if (b.type == 'Sand')
            blocks.push(new SandBlock(b.x, b.y, sandWidth, sandHeight, sandImg, 'Sand'));

        else if (b.type == 'Death')
            blocks.push(new DeathBlock(b.x, b.y, metalBlocksWidth, metalBlocksHeight, metalImg, slicerImg, 'Death', deathBlockSlicerV));

        else if (b.type == 'Coin')
            coins.push(new Coin(b.x, b.y, coinSize, coinSizem, coinImg));

    });

    data.coins.forEach(function (c) {
        coins.push(new Coin(c.x, c.y, coinSize, coinSize, coinImg))
    });
    player = new Player(data.player.x, data.player.y, playerWidth, playerHeight, playerSprite, playerVX, playerVY, playerA);
    cup = new Cup(data.cup.x, data.cup.y, cupWidth, cupHeight, cupImg);
    x = data.camera.x;
    y = data.camera.y;
    minimap.camera.x = -x * minimap.scale
}


function linkToObj(link) {
    //converts encoded link to js object 
    let encoded = window.atob(link)
    let decoded = decodeURI(encoded);
    if (decoded) {
        try {
            var localData = JSON.parse(decoded)
        }
        catch (err) {
            var localData = undefined;
        }
    }
    return localData;
}


function drawLevel(num) {
    //draws the level (first 3 levels)
    let link = window["linkLvl" + num]

    data = linkToObj(link);
    if (data) {
        construct(data)
        built = true;
    }
    gameStarted = true;
}

function checkInput() {
    //checks if there is an input in the link
    let url = location.href;
    let startIndex = url.indexOf("=") + 1;
    if (startIndex > 0) {
        var base64 = url.slice(startIndex);
        base64 = base64.replace(/%3D/g, "");
        base64 = base64.replace(/=/g, "");
        var initialData = linkToObj(base64);
        return initialData
    }
}

function copyToClipboard() {
    //copies the link to the clipboard
    var copyText = document.getElementById("link");
    copyText.select();
    document.execCommand("copy");
}
function starRise() {
    //after winning rises the star
    if (star.y > cup.y - star.maxHeight) {
        star.y--;
        starIsRising = true;

        if (star.y <= cup.y - star.maxHeight) {
            starIsRising = false;
            player.win();

        }
    }
}

function drawMinimap(map) {
    //draws the minimap
    translate(map.x, map.y);
    //sets map.x, map.y as a starting point
    for (var i = 0; i <= backgroundSize / width * map.scale; i++) {
        if (x * map.scale > -width * map.scale)
            image(backgroundImg, 0, 0, map.w, map.h)
    }

    //drawing the mini star
    image(starImg, star.x * map.scale, star.y * map.scale, star.w * map.scale, star.h * map.scale);
    //drawing the mini blocks
    for (var block of blocks) {
        if (block.type == 'Horizontal' || block.type == 'Vertical') {
            if (gameStarted) {
                block.move();
            }
            else {
                let input = checkInput();
                if ((levelsPassed >= 4 || input) && !starIsRising) {
                    block.edit();
                    fill(block.editor.color);
                    rect(block.editor.x * map.scale, block.editor.y * map.scale, block.editor.w * map.scale, block.editor.h * map.scale);
                }
            }
        }

        else if (block.type == 'Death') {

            if (gameStarted) {
                block.move();
                block.kill();
            }
            image(slicerImg, block.slicer.x * map.scale, block.slicer.y * map.scale, block.slicer.w * map.scale, block.slicer.h * map.scale)
        }

        if (block.img) {
            tint(255, block.type == "Sand" ? block.strength / sandBlockStartingStrength * 255 : 255);
            image(block.img, block.x * map.scale, block.y * map.scale, block.w * map.scale, block.h * map.scale, blocksRoundedCorners * map.scale);
            tint(255, 255);
        }
        else
            rect(block.x * map.scale, block.y * map.scale, block.w * map.scale, block.h * map.scale, blocksRoundedCorners * map.scale);

    }
    noStroke();

    // drawing the mini player 
    image(playerSprite, player.x * map.scale - (playerWalkSprite.w * map.scale - player.w * map.scale) / 2, player.y * map.scale, playerWalkSprite.w * map.scale, playerWalkSprite.h * map.scale, ...playerStand);

    //drawing the mini cup
    cup.checkAvailablity();
    tint(255, cup.alpha * 255)
    image(cupImg, cup.x * map.scale, cup.y * map.scale, cup.w * map.scale, cup.h * map.scale);
    tint(255, 255);
    //mini sea
    image(seaImg, 0 * map.scale, seaStartingY * map.scale, backgroundSize * map.scale, (height - seaStartingY) * map.scale)
    //mini coins
    coins.forEach(function (coin) {
        image(coinImg, coin.x * map.scale, coin.y * map.scale, coin.h * map.scale, coin.w * map.scale);
    });
    noFill();
    //frame
    stroke(...toolBarColor);
    strokeWeight(minimapCameraStroke);
    rect(map.camera.x, map.camera.y, map.camera.w, map.camera.h)
    noStroke();
    translate(-map.x, -map.y);

}

function minimapCameraMove(map) {
    //moving the camera of the mini map
    if (mouseIsPressed && mouseX >= map.x && mouseX <= map.x + map.w && mouseY > map.y && mouseY < map.y + map.h) {
        if (mouseIsPressed && mouseX >= map.x + map.camera.w / 2 && mouseX <= map.x + map.w - map.camera.w / 2 && mouseY > map.y && mouseY < map.y + map.h) {
            map.camera.x = mouseX - map.x - map.camera.w / 2;
        }
        else if (mouseX < map.x + map.camera.w / 2 && mouseX > map.x) {
            map.camera.x = 0;
        }
        else if (mouseX > map.x + map.w - map.camera.w / 2 && mouseX < map.x + map.w) {
            map.camera.x = map.w - map.camera.w;
        }
        x = (-map.camera.x * 1 / (map.scale));
    }
}

function blockNum(link) {
    //countes how many blocks are in the link
    var obj = linkToObj(link);
    return obj.blocks.length
}