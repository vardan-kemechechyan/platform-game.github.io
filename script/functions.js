function drawBackground(x, y) {
    //checks if the player wants to move the background with the mouse or not
    /*if(!gameStarted)*/ checkMouseMovement(); // Uncomment if you want to disable the mouse camera movement in the game.

    image(backgroundImg, 0, 0, width, height);

    //sets x,y to 0,0
    translate(x, y);

    //draws the world
    player.animate();

    drawBlocks();
    cup.drawCup();
    //sets the starting points to the default
    translate(-x, -y);
    drawToolBar();

    if (!gameStarted && !starIsRising) {
        //synchronizes the minimap with the actual map
        minimapCameraMove(minimap);
        //draws the minimap
        drawMinimap(minimap);
    }
}

function blink() {
    //blink function
    if (player.opacity === 1) player.opacity = 0.5;
    else player.opacity = 1;
}
function drawToolBar() {
    //if(player passed 3 levels or inserted a link, the toolBar allows him to make editions)
    if (levelsPassed >= 4 || input) {
        for (let i = 0, n=tools.length; i < n; i++) {
            fill(...tools[i].color);
            rect(tools[i].x, 0, tools[i].w, tools[i].h, toolBarRectCorners);

            if (tools[i].f === "Stone" || tools[i].f === "Horizontal" || tools[i].f === "Vertical" || tools[i].f === "Death" || tools[i].f === "Sand" || tools[i].f === "Coin") {
                //prepares images for scaling
                var imageWidth = tools[i].imgW;
                var imageHeight = tools[i].imgH;
                if(tools[i].f === "Stone")
                    var img = stoneImg;
                else if(tools[i].f === "Horizontal")
                    var img = HToolImg;
                else if(tools[i].f === "Vertical")
                    var img = VToolImg;
                else if(tools[i].f === "Death")
                    var img = deathToolImg;
                else if(tools[i].f === "Sand")
                    var img = sandToolImg;
                else if(tools[i].f === "Coin")
                    var img = coinImg; 
            }
            else if (tools[i].f === "Play") {
                //changes the icon
                var img = gameStarted ? stopImg : startImg;
                var imageWidth = stopStartW;
                var imageHeight = stopStarth;
            }
            else {
               var img = undefined;
            }

            imageMode(CENTER);

            if (img) {
                //calculates the "scale"
                var scale = imageWidth > imageHeight ? tools[i].w / imageWidth : tools[i].h / imageHeight;
                //addes paddings to the toolBar buttons
                if (imageWidth > imageHeight) {
                    var horGap = toolBarImagesGap;
                    var vertGap = 0;
                }
                else if (imageWidth === imageHeight) {
                    var horGap = toolBarImagesGap;
                    var vertGap = toolBarImagesGap;
                }
                else {
                    var horGap = 0;
                    var vertGap = toolBarImagesGap;
                }
                image(img, tools[i].x + tools[i].w / 2, tools[i].y + tools[i].h / 2, tools[i].imgW * scale - horGap, tools[i].imgH * scale - vertGap);
            }

            imageMode(CORNER);
        }
        // draws the trash box
        image(deleteButton.img, deleteButton.x, deleteButton.y, deleteButton.w, deleteButton.h);

        stroke(0);
        strokeWeight(1);
        noStroke();
    }
    //if the player can't create his own levels
    else {
        for (let i = 0, n = toolsForPlaying.length; i < n; i++) {
            fill(...toolsForPlaying[i].color, 255 * toolsForPlaying[i].opacity);
            rect(toolsForPlaying[i].x, 0, toolsForPlaying[i].w, toolsForPlaying[i].h, toolBarRectCorners);
            if (toolsForPlaying[i].f === "Menu") {
                //prepares for the scaling
                var img = toolsForPlaying[i].img;
                var imageWidth = toolsForPlaying[i].imgW;
                var imageHeight = toolsForPlaying[i].imgH;
            }
            else if (toolsForPlaying[i].f === "Play") {
                //switches the icons
                var img = gameStarted ? stopImg : startImg;
                var imageWidth = stopStartW;
                var imageHeight = stopStarth;
            }
            else {
                var img = undefined;
            }

            imageMode(CENTER);

            if (img) {
                //scaling
                var scale = imageWidth > imageHeight ? toolsForPlaying[i].w / imageWidth : toolsForPlaying[i].h / imageHeight;
                //adding paddings
                if (imageWidth > imageHeight) {
                    var horGap = toolBarImagesGap;
                    var vertGap = 0;
                }
                else if (imageWidth === imageHeight) {
                    var horGap = toolBarImagesGap;
                    var vertGap = toolBarImagesGap;
                }
                else {
                    var horGap = 0;
                    var vertGap = toolBarImagesGap;
                }

                image(img, toolsForPlaying[i].x + toolsForPlaying[i].w / 2, toolsForPlaying[i].y + toolsForPlaying[i].h / 2, toolsForPlaying[i].imgW * scale - horGap, toolsForPlaying[i].imgH * scale - vertGap);
            }
            imageMode(CORNER);
        }
    }
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
    if (arr[tool].f === 'Play')
        start();
    //checking on which button the player clicked
    if (!gameStarted && !starIsRising) {

        let addedBlock = false;

        if (arr[tool].f === 'Stone') {
            blocks.push(new Block(arr[tool].x - x, arr[tool].y - y + toolBarHeight, stoneWidth, stoneHeight, 'Stone'));
            addedBlock = true;
        }
        else if (arr[tool].f === 'Horizontal') {
            blocks.push(new HorizontalBlock(arr[tool].x - x, arr[tool].y - y + toolBarHeight, metalBlocksWidth, metalBlocksHeight, editorColor, 'Horizontal', horizontalBlocksSpeed, horizontalBlocksRange));
            addedBlock = true;
        }
        else if (arr[tool].f === 'Vertical') {
            blocks.push(new VerticalBlock(arr[tool].x - x, arr[tool].y + toolBarHeight - y, metalBlocksWidth, metalBlocksHeight, editorColor, 'Vertical', verticalBlocksSpeed, verticalBlocksRange));
            addedBlock = true;
        }
        else if (arr[tool].f === 'Sand') {
            blocks.push(new SandBlock(arr[tool].x - x, arr[tool].y - y + toolBarHeight, sandWidth, sandHeight, 'Sand'));
            addedBlock = true;
        }
        else if (arr[tool].f === 'Death') {
            blocks.push(new DeathBlock(arr[tool].x - x, arr[tool].y - y + toolBarHeight, metalBlocksWidth, metalBlocksHeight, 'Death', deathBlockSlicerV));
            addedBlock = true;
        }
        else if (arr[tool].f === 'Coin') {
            coins.push(new Coin(arr[tool].x - x, arr[tool].y - y + toolBarHeight, coinSize, coinSize));
            addedBlock = true;
        }

        if (addedBlock && playerWon) playerWon = false;
        
        if (arr[tool].f === 'Menu') {
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
        if (levelsPassed >= 4 || input)
            data = fix();
    }
}

function drawBlocks() {
    image(starImg, star.x, star.y, star.w, star.h);

    for (var block of blocks) {
        //moving the blocks which can move and drawin their editors
        if (block.type === 'Horizontal' || block.type === 'Vertical') {
            if (gameStarted) {
                block.move();
            }
            else {
                if ((levelsPassed >= 4 || input) && !starIsRising) {
                    block.edit();
                    fill(block.editor.color);
                    rect(block.editor.x, block.editor.y, block.editor.w, block.editor.h);
                }
            }
        }
        else if (block.type === 'Death') {
            //killer block's functoin
            if (gameStarted) {
                block.move();
                block.kill();
            }
            image(slicerImg, block.slicer.x, block.slicer.y, block.slicer.w, block.slicer.h);
        }
           
        //ADDED BY VARDAN
        
        switch(block.type)
        {
            case "Stone":
                    image(stoneImg, block.x, block.y, block.w, block.h, blocksRoundedCorners);
                    break;
            case "Horizontal":
            case "Vertical":
            case "Death":
                    image(metalImg, block.x, block.y, block.w, block.h, blocksRoundedCorners);
                    break;
            case "Sand":
                    if(block.strength != 5) {
                        tint(255, block.strength / sandBlockStartingStrength * 255);
                    }
                    image(sandImg, block.x, block.y, block.w, block.h, blocksRoundedCorners);
                    noTint();
                    break;
            default:
                    rect(block.x, block.y, block.w, block.h, blocksRoundedCorners);
        }
    }

    noStroke();
    //drawing the coins (keys)
    for(let i in coins) image(coinImg, coins[i].x, coins[i].y, coins[i].h, coins[i].w);
}

function editBlocks() {
    //finds the block on which the player clicked
    var blockIndex = blocks.findIndex(function (b) {
        return mouseX - x > b.x && mouseX - x < b.x + b.w && mouseY - y > b.y && mouseY - y < b.y + b.h && !playerEditing && (editedCoinsID === undefined || editedCoinsID < 0);
    });
    return blockIndex;
}

function editCoins() {
    //finds the coin on which the player clicked
    var coinIndex = coins.findIndex(function (b) {
        return mouseX - x > b.x && mouseX - x < b.x + b.w && mouseY - y > b.y && mouseY - y < b.y + b.h && !playerEditing && (editedBlocksID === undefined || editedBlocksID < 0);
    });
    return coinIndex;
}

function updateBlocksCoordinates(i) {
    //updates the editors' and the slicer's coordinated while the main block is moved
    if (blocks[i].type === 'Horizontal') {
        blocks[i].editor.x = blocks[i].x + blocks[i].editRange;
        blocks[i].editor.y = blocks[i].y;
        blocks[i].staticX = blocks[i].x + blocks[i].w / 2;

    }
    else if (blocks[i].type === 'Vertical') {
        blocks[i].editor.x = blocks[i].x;
        blocks[i].editor.y = blocks[i].y + blocks[i].editRange;
        blocks[i].staticY = blocks[i].y + blocks[i].h / 2;
    }
    else if (blocks[i].type === 'Death') {
        blocks[i].slicer.y = blocks[i].y - blocks[i].slicer.h;
        blocks[i].slicer.x = blocks[i].x;
    }
}

//MATTER OF INVESTIGATION: Get rid of setinterval
function sandBreaker(obj) {
    // breaks the sandBlock
    var breakInt = setInterval(function () {
        var i = blocks.indexOf(obj);
        if (i >= 0) {
            blocks[i].strength--;
            if (blocks[i].strength === 0) {
                blocks.splice(i, 1);
                clearInterval(breakInt);
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
    for (let i = 0, n = blocks.length; i < n; i++) {
        data.blocks[i] = {
            x: blocks[i].x,
            y: blocks[i].y,
            type: blocks[i].type,
            editRange: blocks[i].editRange ? blocks[i].editRange : undefined
        }
    }
    data.player = { x: player.x, y: player.y };
    data.coins = [];

    for (let i = 0, n = coins.length; i < n; i++) {
        data.coins[i] = {
            x: coins[i].x,
            y: coins[i].y,
        };
    }

    data.cup = { x: cup.x, y: cup.y };
    data.camera = { x: x, y: y };
    return data;
}

function saveCoords(data) {
    //prepares the url 
    var json = JSON.stringify(data);
    let url = location.href;
    if (url.indexOf("?") >= 0) {
        url = url.slice(0, url.indexOf("?"));
    }

    base64 = window.btoa(encodeURI(json));
    getLinkBox.style.display = 'block';
    var linkTXT = document.getElementById("link")
    linkTXT.value = base64;
    return url + "?data=" + base64;
}

function construct(data) {
    // builds the world by recieving a data
    blocks = [];
    coins = [];
    let b;

    for(let i = 0, n = data.blocks.length; i < n; ++i )
    {
        b = data.blocks[i];

        switch(b.type)
        {
            case 'Stone':
                blocks.push(new Block(b.x, b.y, stoneWidth, stoneHeight, 'Stone'));
                break;
            case 'Horizontal':
                blocks.push(new HorizontalBlock(b.x, b.y, metalBlocksWidth, metalBlocksHeight, editorColor, 'Horizontal', horizontalBlocksSpeed, b.editRange));
                break;
            case 'Vertical':
                blocks.push(new VerticalBlock(b.x, b.y, metalBlocksWidth, metalBlocksHeight, editorColor, 'Vertical', verticalBlocksSpeed, b.editRange));
                break;
            case 'Sand':
                blocks.push(new SandBlock(b.x, b.y, sandWidth, sandHeight, 'Sand'));
                break;
            case 'Death':
                blocks.push(new DeathBlock(b.x, b.y, metalBlocksWidth, metalBlocksHeight, 'Death', deathBlockSlicerV));
                break;
        }
    }

    for(let i = 0, n = data.coins.length; i < n; ++i ) coins.push(new Coin(data.coins[i].x, data.coins[i].y, coinSize, coinSize));

    player = new Player(data.player.x, data.player.y, playerWidth, playerHeight, playerVX, playerVY, playerA);
    cup = new Cup(data.cup.x, data.cup.y, cupWidth, cupHeight);

    x = data.camera.x;
    y = data.camera.y;

    minimap.camera.x = -x * minimap.scale;
}

function linkToObj(link) {
    //converts encoded link to js object 
    let encoded = window.atob(link);
    let decoded = decodeURI(encoded);
    if (decoded) {
        try {
            var localData = JSON.parse(decoded);
        }
        catch (err) {
            var localData = undefined;
        }
    }
    return localData;
}

function drawLevel(num) {
    //draws the level (first 3 levels)
    let link = window["linkLvl" + num];

    data = linkToObj(link);
    if (data) {
        construct(data);
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
        return initialData;
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
    image(backgroundImg, map.x, map.y, map.w, map.h);
    noFill();
    stroke(...toolBarColor);
    strokeWeight(minimapCameraStroke);
    rect(map.camera.x+map.x, map.camera.y+map.y, map.camera.w, map.camera.h);
    noStroke(); 
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
    return obj.blocks.length;
}