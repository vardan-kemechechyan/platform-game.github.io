function drawBackground(x, y) {
    checkMouseMovement();
    for (var i = 0; i <= backgroundSize / width; i++) {
        if (x > -width)
            image(backgroundImg, x + i * width, y, width, height)
    }
    fill(...seaColor);
    drawSea();
    translate(x, y);
    player.animate()
    drawBlocks();
    cup.drawCup();
    translate(-x, -y);

    drawToolBar();
}

function blink() {

    if (player.opacity == 1)
        player.opacity = 0.5;
    else
        player.opacity = 1;

}
function drawToolBar() {
    let input = checkInput();
    if (levelsPassed >= 4 || input) {
        for (let i = 0; i < tools.length; i++) {
            fill(...tools[i].color);
            if (tools[i].f == "Save" && !playerWon) {
                fill(...tools[i].color, 50);
            }
            rect(tools[i].x, 0, tools[i].w, tools[i].h, toolBarRectCorners);
            if (tools[i].f == "Stone" || tools[i].f == "Horizontal" || tools[i].f == "Vertical" || tools[i].f == "Death" || tools[i].f == "Sand" || tools[i].f == "Coin") {
                var img = tools[i].img;
                var imageWidth = tools[i].imgW;
                var imageHeight = tools[i].imgH;
            }
            else if (tools[i].f == "Play") {
                var img = gameStarted ? stopImg : startImg;
                var imageWidth = stopStartW;
                var imageHeight = stopStarth;
            }
            else {
                img = undefined;
            }

            imageMode(CENTER)
            if (img) {
                var scale = imageWidth > imageHeight ? tools[i].w / imageWidth : tools[i].h / imageHeight
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
                    //imageMode(CORNER);
                    if (false) {
                        tools[i].slicer.vY *= -1
                    }
                    tools[i].slicer.y += tools[i].slicer.vY;
                    image(tools[i].slicer.img, tools[i].x + tools[i].w / 2, tools[i].y + tools[i].h / 2 - tools[i].imgH / 2 * scale - tools[i].slicer.h / 2, tools[i].slicer.w * scale - 2 * horGap, tools[i].slicer.h * scale - 2 * vertGap)
                    //imageMode(CENTER)
                }
                image(img, tools[i].x + tools[i].w / 2, tools[i].y + tools[i].h / 2, tools[i].imgW * scale - 2 * horGap, tools[i].imgH * scale - 2 * vertGap);
                if (tools[i].f == "Horizontal")
                    image(hArrowImg, tools[i].x + tools[i].w / 2, tools[i].y + tools[i].h / 2, tools[i].w * scale / 1.5 - 2 * horGap, tools[i].h * scale / 1.5 - 2 * vertGap);
                else if (tools[i].f == "Vertical")
                    image(vArrowImg, tools[i].x + tools[i].w / 2, tools[i].y + tools[i].h / 2, tools[i].w * scale / 1.5 - 2 * horGap, tools[i].h * scale / 1.5 - 2 * vertGap);

            }

            imageMode(CORNER);
        }

        image(deleteButton.img, deleteButton.x, deleteButton.y, deleteButton.w, deleteButton.h)
        stroke(0);
        strokeWeight(1);
        noStroke();

    }
    else if (levelsPassed < 4 && !input) {
        for (let i = 0; i < toolsForPlaying.length; i++) {
            fill(...toolsForPlaying[i].color, 255 * toolsForPlaying[i].opacity);
            rect(toolsForPlaying[i].x, 0, toolsForPlaying[i].w, toolsForPlaying[i].h, toolBarRectCorners);
            if (toolsForPlaying[i].f == "Next" || toolsForPlaying[i].f == "Menu") {
                var img = toolsForPlaying[i].img;
                var imageWidth = toolsForPlaying[i].imgW;
                var imageHeight = toolsForPlaying[i].imgH;
            }
            else if (toolsForPlaying[i].f == "Play") {
                var img = gameStarted ? stopImg : startImg;
                var imageWidth = stopStartW;
                var imageHeight = stopStarth;
            }
            else {
                img = undefined;
            }

            imageMode(CENTER)
            if (img) {
                var scale = imageWidth > imageHeight ? toolsForPlaying[i].w / imageWidth : toolsForPlaying[i].h / imageHeight
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

                image(img, toolsForPlaying[i].x + toolsForPlaying[i].w / 2, toolsForPlaying[i].y + toolsForPlaying[i].h / 2, toolsForPlaying[i].imgW * scale - 2 * horGap, toolsForPlaying[i].imgH * scale - 2 * vertGap);

            }
            imageMode(CORNER)
        }
    }
}

function drawSea() {
    rect(0, seaStartingY, width, width - seaStartingY);
    fill(...backgroundColor);
    for (var item of seaArr) {
        ellipse(item.x, item.y, item.size)
    }
}

function checkMouseMovement() {
    if (mouseY > toolBarHeight && mouseY < 0 + height && mouseX > 0 && mouseX < 0 + width) {

        if (mouseX > width / backgroundEditRange * (backgroundEditRange - 1) && x > width - backgroundSize) {
            seaArr.map(function (item) {
                return item.x > 0 - item.size / 2 ? item.x-- : item.x = width + item.size / 2;
            });
            x -= 2;
        }
        else if (mouseX < width / backgroundEditRange && x < 0) {
            seaArr.map(function (item) {
                return item.x < width + item.size / 2 ? item.x++ : item.x = -item.size / 2;
            });
            x += 2;
        }
    }

}

function toolBarFunction(arr) {
    var tool = Math.floor(mouseX / arr[0].w);
    if (arr[tool].f == 'Play')
        start();
    else if (arr[tool].f == "Save" && playerWon)
        saveCoords(data);

    if (!gameStarted) {
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
            popup = true;
        }
        // if (arr[tool].f == 'Next') {
        //     if (playerWon) {
        //         levelsPassed++
        //     }
        // }
    }
}

function start() {
    if (gameStarted) {
        construct(data);
        gameStarted = false;
    }
    else {
        gameStarted = true;
        data = fix();
    }
}

function drawBlocks() {
    image(starImg, star.x, star.y, star.w, star.h)
    for (var block of blocks) {
        if (block.type == 'Horizontal' || block.type == 'Vertical') {
            if (gameStarted) {
                block.move();
            }
            else {
                block.edit();
                fill(block.editor.color);
                rect(block.editor.x, block.editor.y, block.editor.w, block.editor.h);
            }
        }

        else if (block.type == 'Death') {

            if (gameStarted) {
                block.move();
                block.kill();
            }
            image(slicerImg, block.slicer.x, block.slicer.y, block.slicer.w, block.slicer.h)
        }

        if (block.img) {
            tint(255, block.type == "Sand" ? block.strength / sandBlockStartingStrength * 255 : 255);
            image(block.img, block.x, block.y, block.w, block.h, blocksRoundedCorners);
            tint(255, 255);
        }
        else
            rect(block.x, block.y, block.w, block.h, blocksRoundedCorners);

    }
    noStroke();

    coins.forEach(function (coin) {
        image(coinImg, coin.x, coin.y, coin.h, coin.w);
    });
}

function editBlocks() {
    var blockIndex = blocks.findIndex(function (b) {
        return mouseX - x > b.x && mouseX - x < b.x + b.w && mouseY - y > b.y && mouseY - y < b.y + b.h && !playerEditing && (editedCoinsID == undefined || editedCoinsID < 0);
    });
    return blockIndex
}

function editCoins() {
    var coinIndex = coins.findIndex(function (b) {
        return mouseX - x > b.x && mouseX - x < b.x + b.w && mouseY - y > b.y && mouseY - y < b.y + b.h && !playerEditing && (editedBlocksID == undefined || editedBlocksID < 0);
    });
    return coinIndex
}

function updateBlocksCoordinates(i) {
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
    }, 1000)

}

function deleteEverything() {
    blocks = [];
    player.x = playerStartingX;
    player.y = playerStartingY;
    coins = [];
    player.speedY = 0;
}

function fix() {
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

    //console.log(encoded);
    //var decoded = decodeURI(encoded)
    //console.log(decoded)
    ///console.log(JSON.parse(decoded))
}


function construct(data) {
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

}


function linkToObj(link) {
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

// function drawUneditableBG() {
//     checkMouseMovement();
//     for (var i = 0; i <= backgroundSize / width; i++) {
//         if (x > -width)
//             image(backgroundImg, x + i * width, y, width, height)
//     }
//     fill(...seaColor);
//     drawSea();
//     translate(x, y);
//     player.animate()
//     drawBlocks();
//     cup.drawCup();
//     translate(-x, -y);
// }

function drawLevel(num) {

    let link = window["linkLvl" + num]
    data = linkToObj(link);
    if (data) {
        construct(data)
        built = true;
    }
    gameStarted = true;
}

function checkInput() {
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
    var copyText = document.getElementById("link");
    copyText.select();
    document.execCommand("copy");
}