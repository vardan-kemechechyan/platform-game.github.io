//MATTER OF INVESTIGATION: get rid of vars in the loops. var -> let

class Parent {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

class Player extends Parent {
    constructor(x, y, w, h, VX, VY, a) {
        super(x, y, w, h);
        this.speedX = VX;
        this.speedY = 0;
        this.accelaration = a;
        this.downCollBlock = undefined;
        this.dead = false;
        this.eatenCoins = 0;
        this.opacity = 1;
        this.blinkCount = 0;
        this.animFrameChange = 2;
        this.currentFrame = 0;
        this.collision = {
            right: false,
            left: false,
            up: false,
            down: false
        };
        // 0 - left, 1 - right
        this.left_right = [false, false];
        this.dirX = 1;
        this.walkCounter = 0;
    }

    animate() {
        //makes the player transparent if needed

        if(this.opacity != 1) tint(255, 255 * this.opacity);
        
        //standing picture of the player
        if (!gameStarted) image(playerSprite, this.x - (playerWalkSprite.w - this.w) / 2, this.y, playerWalkSprite.w, playerWalkSprite.h, ...playerStand);
    
        else {
            if (this.left_right[0] || this.left_right[1]) {
                //walking player
                let wc = (this.walkCounter >= 0 ? this.walkCounter : "_" + Math.abs(this.walkCounter));

                image(playerSprite, this.x - (playerWalkSprite.w - this.w) / 2, this.y, playerWalkSprite.w, playerWalkSprite.h, window['playerWalk' + wc].x, window['playerWalk' + wc].y, playerWalkSprite.w, playerWalkSprite.h);
            }
            else {
                //standing picture of the player
                image(playerSprite, this.x - (playerWalkSprite.w - this.w) / 2, this.y, playerWalkSprite.w, playerWalkSprite.h, ...playerStand);
                this.walkCounter = 0;
            }
        }
        //prevents other images from being transparent
        noTint();
    }

    play() {
        //player must move and check collision until death
        if (!player.dead) {
            this.move();
            this.checkCollision();
        }
    }

    prepare() {
        // before starting the game we need to prepare the world for playing
        this.edit();
        if (!playerEditing)
            this.snap();
    }

    move() {
        // looping sprite animation
        ++this.currentFrame;

        if (this.walkCounter === playerWalkFrames - 1 || this.walkCounter === -playerWalkFrames + 1) {
            this.walkCounter = 1 * this.dirX;
        }
        if (this.left_right[0] && !this.collision.left) {
            //flips the player if it needs to be filpped
            if (this.dirX >= 0) {
                this.walkCounter = -1;
                this.dirX = -1;
            }
            else {
                if( this.currentFrame % this.animFrameChange === 0) this.walkCounter--;
            }

            if (this.x > 0) {
                this.x -= this.speedX;
                //if it is possible it moves also the background
                if (x < 0) {
                    x += this.speedX;
                }
            }
        }
        else if (this.left_right[1] && !this.collision.right) {
            //flips the player if it needs to be filpped
            if (this.dirX <= 0) {
                this.walkCounter = 1;
                this.dirX = 1;
            }
            else {
                if( this.currentFrame % this.animFrameChange === 0) this.walkCounter++;
            }
            if (this.x + this.w <= backgroundSize) {
                this.x += this.speedX;
                //if it is possible it moves also the background
                if (x > width - backgroundSize) {
                    x -= this.speedX;
                }
            }
        }

        //limiting the falling speed
        if (this.speedY < playerFallingMaxSpeed)
            this.speedY += gravity;

        //if the block with which the player has a collision is a "Vertical" block, the player takes its velocity 
        if (this.collision.down)
            this.speedY = this.downCollBlock.type === "Vertical" ? this.downCollBlock.dirY : 0;
        //a part of jumping
        if (!this.collision.up || this.speedY >= 0)
            this.y += this.speedY;
        else
            this.speedY = 0;

        //player drowns
        if (this.y >= seaStartingY - this.h / 2 && !player.dead)
            this.die();
    }

    startJump() {
        //while we hold the key, it gains acceleration
        if (this.collision.down) {
            this.y -= 2;
            this.speedY = playerJumpV0;
            this.collision.down = false;
        }
    }

    endJump() {
        //falling part
        if (this.speedY < -playerFallingMaxSpeed) {
            this.speedY = -playerFallingMaxSpeed;
        }
    }

    //MATTER OF INVESTIGATION: check the loops and if
    //MATTER OF INVESTIGATION: merge into one loop
    checkCollision() {
        //collision with the blocks
        var that = this;
        var arrayY = [];
        var bottomColls = blocks.filter(function (block) {
            if(Math.abs(block.x + block.w/2 - that.x - that.w / 2) < collisionRange)
            {
                var a = block.dirY ? block.dirY : 0;
                return ((block.y + block.h / 2) - (that.y + that.h / 2) <= that.h / 2 + block.h / 2 - a + that.speedY) &&
                    ((block.y + block.h / 2) - (that.y + that.h / 2)) >= that.h / 2 + block.h / 2 - that.speedY + a
                    && Math.abs((block.x + block.w / 2) - (that.x + that.w / 2)) < that.w / 2 + block.w / 2 + that.speedX;
            }
        });
        bottomColls.forEach(function (block) { arrayY.push(block.y) });

        var index = arrayY.indexOf(Math.min(...arrayY))
        var bottom = bottomColls[index];

        var rightColls = blocks.filter(function (block) {
            if(Math.abs(block.x + block.w/2 - that.x - that.w / 2) < collisionRange)
            {
                var b = bottom ? !(block.x === bottom.x && block.y === bottom.y && block.w === bottom.w && block.h === bottom.h) : true;
                return ((block.x + block.w / 2) - (that.x + that.w / 2) <= that.w / 2 + block.w / 2 + that.speedX) &&
                    ((block.x + block.w / 2) - (that.x + that.w / 2) >= that.w / 2 + block.w / 2 - that.speedX)
                    && Math.abs((block.y + block.h / 2) - (that.y + that.h / 2)) < that.h / 2 + block.h / 2 - that.speedY && b;
            }
        });

        var leftColls = blocks.filter(function (block) {
            if(Math.abs(block.x + block.w/2 - that.x - that.w / 2) < collisionRange)
            {
                var b = bottom ? !(block.x === bottom.x && block.y === bottom.y && block.w === bottom.w && block.h === bottom.h) : true;
                return ((that.x + that.w / 2) - (block.x + block.w / 2) <= that.w / 2 + block.w / 2 + that.speedX) &&
                    ((that.x + that.w / 2) - (block.x + block.w / 2)) >= that.w / 2 + block.w / 2 - that.speedX
                    && Math.abs((block.y + block.h / 2) - (that.y + that.h / 2)) < that.h / 2 + block.h / 2 - that.speedY && b;
            }
        });

        var right = rightColls[0];
        var left = leftColls[0];

        var up = blocks.find(function (block) {
            if(Math.abs(block.x + block.w/2 - that.x - that.w / 2) < collisionRange)
            {
                var l = left ? !(left.x === block.x && left.y === block.y && left.w === block.w && left.h === block.h) : true;
                var r = right ? !(right.x === block.x && right.y === block.y && right.w === block.w && right.h === block.h) : true;
                return ((that.y + that.h / 2) - (block.y + block.h / 2) <= that.h / 2 + block.h / 2) &&
                    ((that.y + that.h / 2) - (block.y + block.h / 2)) >= that.h / 2 + block.h / 2 + that.speedY
                    && Math.abs((block.x + block.w / 2) - (that.x + that.w / 2)) < that.w / 2 + block.w / 2 - 2 * that.speedX && r && l;
            }
        });

        if (bottom) {
            this.collision.down = true;
            this.downCollBlock = bottom;
            this.y = bottom.y - this.h;

            if (bottom.type === "Horizontal") {
                if (bottom.dirX < 0) {
                    if (!this.collision.left) {
                        this.x += bottom.dirX;
                    }
                }
                else {
                    if (!this.collision.right) {
                        this.x += bottom.dirX;
                    }
                }
            }
            else if (bottom.type === "Sand")
                bottom.break();
        }
        else
            this.collision.down = false;


        if (up)
            this.collision.up = true;
        else
            this.collision.up = false;

        if (right) {
            this.collision.right = true;
            if (!this.collision.left && right.type === "Horizontal")
                this.x = right.x - this.w
        }
        else
            this.collision.right = false;

        if (left) {
            this.collision.left = true;
            if (!this.collision.right && left.type === "Horizontal")
                this.x = left.x + left.w;
        }
        else {
            this.collision.left = false;
        }

        if (this.collision.left && this.collision.right && this.collision.down && !player.dead) {
            this.die();
        }

        //ADDED BY VARDAN
        for (let c in coins) {
            if(Math.abs(coins[c].x + coins[c].w/2 - that.x - that.w / 2) < collisionRange)
            {
                if (that.x + that.w > coins[c].x && that.x < coins[c].x + coins[c].w && that.y + that.h > coins[c].y && that.y < coins[c].y + coins[c].h) {
                    coins.splice(coins.indexOf(coins[c]), 1);
                    player.eatenCoins++;
                    //ADDED BY VARDAN
                    cup.checkAvailablity();
                    break;
                }
            }
        }

        //MATTER OF INVESTIGATION: This can be optimized: a. Instead of checking availabilit
        //collision with the cup (lock)
        //EDITED BY VARDAN
        if (cup.available) {
            if(Math.abs(cup.x + cup.w/2 - that.x - that.w / 2) < collisionRange)
            {
                if (this.x + this.w > cup.x && this.x < cup.x + cup.w && this.y + this.h > cup.y && this.y < cup.y + cup.h ) {
                    //checks which level has the player passed
                    gameStarted = false;
                    if (levelsPassed > 3 || input) {
                        playerWon = true;
                    }
                    else if (levelsPassed === 3 && !input && currentLvl === levelsPassed) {
                        playerWonTemp = true;
                    }
                    else {
                        playerWonTemp = true;
                    }
                    if (levelsPassed < 3 && !input) {
                        playerWonTemp = true;
                    }
                }
            }
        }
    }

    snap() {
        //doesn't let the blocks to be on the player
        for (let b in blocks) {
            let block = blocks[b];
            if (this.y - block.y + this.h < this.h / 2 && this.y - block.y + this.h > 0 && this.x - block.x <= block.w && block.x - this.x <= this.w) {

                block.y = this.y + this.h;
            }
            else if (block.y - this.y + block.h < this.h / 2 && block.y - this.y + block.h > 0 && block.x - this.x <= this.w && this.x - block.x <= block.w) {
                block.y = this.y - block.h;
            }
            else if (this.x + this.w / 2 - (block.x + block.w / 2) < 0 && this.x + this.w / 2 - (block.x + block.w / 2) > -(this.w / 2 + block.w / 2) && Math.abs((this.y + this.h / 2) - (block.y + block.h / 2)) < this.h / 2 + block.h / 2) {

                block.x = this.x + this.w;
            }
            else if (this.x + this.w / 2 - (block.x + block.w / 2) > 0 && this.x + this.w / 2 - (block.x + block.w / 2) < (this.w / 2 + block.w / 2) && Math.abs((this.y + this.h / 2) - (block.y + block.h / 2)) < this.h / 2 + block.h / 2)
                block.x = this.x - block.w;
            updateBlocksCoordinates(b)
        }
    }

    edit() {
        //editing the player
        if (playerEditing) {
            this.x = mouseX - this.w / 2 - x;
            this.y = mouseY - this.h / 2 - y;
        }
    }

    win() {
        // checks which level has the player won
        if (levelsPassed > 3 || input) {
            saveBox.style.display = "block";
            popup = true;
        }
        else if (levelsPassed === 3 && !input && currentLvl === levelsPassed) {
            build.style.display = "block";
            popup = true;
        }
        else {
            startPopUp.style.display = "block";
            popup = true;
            //disables not passed levels to prevent cheating
            if (levelsPassed <= 3)
                enableDisable(levelsPassed);
        }
        if (levelsPassed < 3 && !input) {
            levelsPassed++
            startPopUp.style.display = "block";
            popup = true;
            //disables not passed levels to prevent cheating
            if (levelsPassed <= 3)
                enableDisable(levelsPassed);
        }
        construct(data);
    }

    die() {  this.dead = true;  }
}

class Block extends Parent {
    constructor(x, y, w, h, type) {
        super(x, y, w, h);
        this.type = type;
    }

    deleteBlock() {
        // if a block has a collision whith the trash box, this function deletes that block after the mouse is released
        if (this.x + this.w / 2 > deleteButton.x - x && this.x + this.w / 2 < deleteButton.x - x + deleteButton.w && this.y + this.h / 2 > deleteButton.y - y && this.y + this.h / 2 < deleteButton.y - y + deleteButton.h) {
            blocks.splice(blocks.indexOf(this), 1);
        }
    }
}

class HorizontalBlock extends Block {
    constructor(x, y, w, h, c, type, dirX, editRange) {
        super(x, y, w, h, type);
        this.staticX = this.x + this.w / 2;
        this.dirX = dirX;
        this.editRange = editRange;
        this.editor = {
            x: this.x + this.editRange,
            y: this.y,
            w: this.w,
            h: this.h,
            color: c
        }
    }
    move() {
        //moving the "Horizontal" block horizontally
        if (this.x + this.w / 2 > this.staticX + this.editRange || this.x + this.w / 2 < this.staticX) {
            this.dirX *= -1;
        }
        this.x += this.dirX;
    }

    edit() {
        //editing the block's editing range
        if (blockRangeEditing) {
            if (blockRangeEditing.x === this.x && blockRangeEditing.y === this.y) {
                if (mouseX - this.editor.w / 2 - x >= this.x + this.w / 2)
                    this.editor.x = mouseX - this.editor.w / 2 - x;
                else
                    this.editor.x = this.x + this.w / 2;

                this.editRange = this.editor.x + this.editor.w / 2 - (this.x + this.w / 2);
            }
        }
    }
}

class VerticalBlock extends Block {
    constructor(x, y, w, h, c, type, dirY, editRange) {
        super(x, y, w, h, type);
        this.staticY = this.y + this.h / 2;
        this.dirY = dirY;
        this.editRange = editRange;
        this.editor = {
            x: this.x,
            y: this.y + this.editRange,
            w: this.w,
            h: this.h,
            color: c
        }
    }
    move() {
        //moving the "Vertical" block horizontally
        if (this.y + this.h / 2 > this.staticY + this.editRange || this.y + this.h / 2 < this.staticY) {
            this.dirY *= -1;
        }
        this.y += this.dirY;
    }

    edit() {
        if (blockRangeEditing) {
            //editing the block's editing range
            if (blockRangeEditing.x === this.x && blockRangeEditing.y === this.y) {
                if (mouseY - this.editor.h / 2 + y >= this.y + this.h / 2)
                    this.editor.y = mouseY - this.editor.h / 2 + y;
                else
                    this.editor.y = this.y + this.h / 2

                this.editRange = this.editor.y + this.editor.h / 2 - (this.y + this.h / 2);

            }
        }
    }
}

class SandBlock extends Block {
    constructor(x, y, w, h, type) {
        super(x, y, w, h, type);
        this.strength = 5;
        this.startedBreaking = false;
    }
    break() {
        //if the player steps on this block, it starts breaking
        if (!this.startedBreaking) {
            this.startedBreaking = true;
            sandBreaker(this);
        }
    }
}

class DeathBlock extends Block {
    constructor(x, y, w, h, type, dirY) {
        super(x, y, w, h, type);
        this.slicer = {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h / 2,
            dirY: dirY
        }
    }

    move() {
        // moves the killing part of the killer block
        if (this.slicer.y + this.slicer.h < this.y || this.y - this.slicer.y < this.slicer.h - this.h) {
            this.slicer.dirY *= -1;
        }
        this.slicer.y += this.slicer.dirY;
    }

    kill() {
        //murders the player, if there's a collision with the killing-part of the block
        if (Math.abs((this.slicer.x + this.slicer.w / 2) - (player.x + player.w / 2)) < this.slicer.w / 2 + player.w / 2 && player.y + player.h > this.slicer.y && player.y + player.h < this.slicer.y + this.slicer.h && !player.dead)
            player.die();
    }
}

class Coin extends Parent {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }
    // if a block has a collision whith the trash box, this function deletes that block after the mouse is released
    deleteCoin() {
        if (this.x + this.w / 2 > deleteButton.x - x && this.x + this.w / 2 < deleteButton.x - x + deleteButton.w && this.y + this.h / 2 > deleteButton.y - y && this.y + this.h / 2 < deleteButton.y - y + deleteButton.h) {
            coins.splice(coins.indexOf(this), 1);
        }
    }
}

class Cup extends Parent {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.alpha = 0.5;
        this.available = false
    }
    //if all of the coins (keys) are eatten, the cup (lock) is available
    checkAvailablity() {
        if (coins.length === 0) {
            this.alpha = 1;
            this.available = true;
        }
        else {
            this.available = false;
            this.alpha = 0.5;
        }
    }

    drawCup() {
        if(this.alpha != 1) {
            tint(255, this.alpha * 255)
        }
        image(cupImg, this.x, this.y, this.w, this.h);
        noTint();
    }

    edit() {
        //editing thw cup (lock)
        if (cupEditing) {
            this.x = mouseX - this.w / 2 - x;
            this.y = mouseY - this.h / 2 - y;
        }
    }
}