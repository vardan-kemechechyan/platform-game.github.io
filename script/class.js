class Parent {
    constructor(x, y, w, h, img) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = img;
    }
}

class Player extends Parent {
    constructor(x, y, w, h, img, VX, VY, a) {
        super(x, y, w, h, img);
        this.speedX = VX;
        this.speedY = 0;
        this.accelaration = a;
        this.downCollBlock = undefined;
        this.dead = false;
        this.opacity = 1;
        this.eatenCoins = 0;
        this.collision = {
            right: false,
            left: false,
            up: false,
            down: false
        }
        this.dirX = 1;
        this.walkCounter = 0;
    }

    animate() {

        tint(255, 255 * this.opacity);
        if (!gameStarted) {
            image(playerSprite, this.x - (playerWalkSprite.w - this.w) / 2, this.y, playerWalkSprite.w, playerWalkSprite.h, ...playerStand);
        }
        else {
            if (keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(UP_ARROW)) {
                image(this.img, this.x - (playerWalkSprite.w - this.w) / 2, this.y, playerWalkSprite.w, playerWalkSprite.h, window['playerWalk' + this.walkCounter].x, window['playerWalk' + this.walkCounter].y, playerWalkSprite.w, playerWalkSprite.h);
            }
            else {
                image(playerSprite, this.x - (playerWalkSprite.w - this.w) / 2, this.y, playerWalkSprite.w, playerWalkSprite.h, ...playerStand);
                this.walkCounter = 0;
            }
        }
        tint(255, 255);
    }

    play() {
        if (!player.dead) {
            this.move();
            this.checkCollision();
        }

    }

    prepare() {
        this.edit();
        if (!playerEditing)
            this.snap();

    }

    move() {
        if (this.walkCounter == playerWalkFrames - 1)
            this.walkCounter = 0

        if (keyIsDown(LEFT_ARROW) && !this.collision.left) {
            this.dirX = -1;
            this.walkCounter++;
            if (this.x > 0) {
                this.x -= this.speedX;

                if (x < 0) {
                    x += this.speedX;
                }
            }
        }
        else if (keyIsDown(RIGHT_ARROW) && !this.collision.right) {
            this.walkCounter++;
            this.dirX = 1;
            if (this.x + this.w <= backgroundSize) {
                this.x += this.speedX;
                if (this.x + x + this.w / 2 >= canvasWidth / 2) {
                    x -= this.speedX;
                }

            }
        }


        if (this.speedY < playerFallingMaxSpeed)
            this.speedY += gravity;

        if (this.collision.down)
            this.speedY = this.downCollBlock.type == "Vertical" ? this.downCollBlock.dirY : 0;

        if (!this.collision.up || this.speedY >= 0)
            this.y += this.speedY;
        else
            this.speedY = 0;

        if (this.y >= seaStartingY - this.h / 2 && !player.dead)
            this.die();
    }

    startJump() {
        if (this.collision.down) {
            this.y -= 2;
            this.speedY = playerJumpV0;
            this.collision.down = false;
        }
    }

    endJump() {
        if (this.speedY < -playerFallingMaxSpeed) {
            this.speedY = -playerFallingMaxSpeed;
        }
    }

    checkCollision() {

        var that = this;
        var arrayY = [];
        var bottomColls = blocks.filter(function (block) {
            var a = block.dirY ? block.dirY : 0;
            return ((block.y + block.h / 2) - (that.y + that.h / 2) <= that.h / 2 + block.h / 2 - a + that.speedY) &&
                ((block.y + block.h / 2) - (that.y + that.h / 2)) >= that.h / 2 + block.h / 2 - that.speedY + a
                && Math.abs((block.x + block.w / 2) - (that.x + that.w / 2)) < that.w / 2 + block.w / 2 + that.speedX;
        });
        bottomColls.forEach(function (block) { arrayY.push(block.y) });

        var index = arrayY.indexOf(Math.min(...arrayY))
        var bottom = bottomColls[index];

        var rightColls = blocks.filter(function (block) {
            var b = bottom ? !(block.x == bottom.x && block.y == bottom.y && block.w == bottom.w && block.h == bottom.h) : true;
            return ((block.x + block.w / 2) - (that.x + that.w / 2) <= that.w / 2 + block.w / 2 + that.speedX) &&
                ((block.x + block.w / 2) - (that.x + that.w / 2) >= that.w / 2 + block.w / 2 - that.speedX)
                && Math.abs((block.y + block.h / 2) - (that.y + that.h / 2)) < that.h / 2 + block.h / 2 - that.speedY && b;
        });

        var leftColls = blocks.filter(function (block) {
            var b = bottom ? !(block.x == bottom.x && block.y == bottom.y && block.w == bottom.w && block.h == bottom.h) : true;
            return ((that.x + that.w / 2) - (block.x + block.w / 2) <= that.w / 2 + block.w / 2 + that.speedX) &&
                ((that.x + that.w / 2) - (block.x + block.w / 2)) >= that.w / 2 + block.w / 2 - that.speedX
                && Math.abs((block.y + block.h / 2) - (that.y + that.h / 2)) < that.h / 2 + block.h / 2 - that.speedY && b;
        });

        var right = rightColls[0];
        var left = leftColls[0];

        var up = blocks.find(function (block) {
            var l = left ? !(left.x == block.x && left.y == block.y && left.w == block.w && left.h == block.h) : true;
            var r = right ? !(right.x == block.x && right.y == block.y && right.w == block.w && right.h == block.h) : true;
            return ((that.y + that.h / 2) - (block.y + block.h / 2) <= that.h / 2 + block.h / 2) &&
                ((that.y + that.h / 2) - (block.y + block.h / 2)) >= that.h / 2 + block.h / 2 + that.speedY
                && Math.abs((block.x + block.w / 2) - (that.x + that.w / 2)) < that.w / 2 + block.w / 2 - 2 * that.speedX && r && l;
        });

        if (bottom) {
            this.collision.down = true;
            this.downCollBlock = bottom;
            this.y = bottom.y - this.h;

            if (bottom.type == "Horizontal") {
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
            else if (bottom.type == "Sand")
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
            if (!this.collision.left && right.type == "Horizontal")
                this.x = right.x - this.w
        }
        else
            this.collision.right = false;

        if (left) {
            this.collision.left = true;
            if (!this.collision.right && left.type == "Horizontal")
                this.x = left.x + left.w;
        }
        else {
            this.collision.left = false;
        }

        if (this.collision.left && this.collision.right && this.collision.down && !player.dead) {
            this.die();
        }

        var eaten = coins.filter(function (coin) {
            return that.x + that.w > coin.x && that.x < coin.x + coin.w && that.y + that.h > coin.y && that.y < coin.y + coin.h
        });

        eaten.forEach(function (c) {
            coins.splice(coins.indexOf(c), 1)
            player.eatenCoins++;
        });

        if (this.x + this.w > cup.x && this.x < cup.x + cup.w && this.y + this.h > cup.y && this.y < cup.y + cup.h && cup.available) {
            this.win();
        }
    }

    snap() {
        for (var b in blocks) {
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
        if (playerEditing) {
            this.x = mouseX - this.w / 2 - x;
            this.y = mouseY - this.h / 2 - y;
        }
    }

    win() {
        let input = checkInput()
        gameStarted = false;
        if (levelsPassed > 3 || input) {
            playerWon = true;
            saveBox.style.display = "block";
            popup = true;
        }
        else if (levelsPassed == 3 && !input && currentLvl == levelsPassed) {
            build.style.display = "block";
            popup = true;
        }
        else {
            startPopUp.style.display = "block";
            popup = true;
        }
        if (levelsPassed < 3 && !input) {
            levelsPassed++
            startPopUp.style.display = "block";
            popup = true;
        }
        construct(data);
    }

    die() {
        this.dead = true;
        var b = setInterval(blink, 100)

        setTimeout(function () {
            gameStarted = false;
            clearInterval(b)
            construct(data);
        }, 1000);
    }
}

class Block extends Parent {
    constructor(x, y, w, h, img, type) {
        super(x, y, w, h, img);
        this.type = type;
    }

    deleteBlock() {
        if (this.x + this.w / 2 > deleteButton.x - x && this.x + this.w / 2 < deleteButton.x - x + deleteButton.w && this.y + this.h / 2 > deleteButton.y - y && this.y + this.h / 2 < deleteButton.y - y + deleteButton.h) {
            blocks.splice(blocks.indexOf(this), 1)
        }
    }
}

class HorizontalBlock extends Block {
    constructor(x, y, w, h, img, c, type, dirX, editRange) {
        super(x, y, w, h, img, type);
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
        if (this.x + this.w / 2 > this.staticX + this.editRange || this.x + this.w / 2 < this.staticX) {
            this.dirX *= -1;
        }
        this.x += this.dirX;
    }

    edit() {
        if (blockRangeEditing) {
            if (blockRangeEditing.x == this.x && blockRangeEditing.y == this.y) {
                if (mouseX - this.editor.w / 2 - x >= this.x + this.w / 2)
                    this.editor.x = mouseX - this.editor.w / 2 - x;
                else
                    this.editor.x = this.x + this.w / 2;
                //test
                this.editRange = this.editor.x + this.editor.w / 2 - (this.x + this.w / 2);
            }
        }
    }
}

class VerticalBlock extends Block {
    constructor(x, y, w, h, img, c, type, dirY, editRange) {
        super(x, y, w, h, img, type);
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
        if (this.y + this.h / 2 > this.staticY + this.editRange || this.y + this.h / 2 < this.staticY) {
            this.dirY *= -1;
        }
        this.y += this.dirY;
    }

    edit() {
        if (blockRangeEditing) {

            if (blockRangeEditing.x == this.x && blockRangeEditing.y == this.y) {
                if (mouseY - this.editor.h / 2 + y >= this.y + this.h / 2)
                    this.editor.y = mouseY - this.editor.h / 2 + y;
                else
                    this.editor.y = this.y + this.h / 2
                //test
                this.editRange = this.editor.y + this.editor.h / 2 - (this.y + this.h / 2);

            }
        }
    }


}

class SandBlock extends Block {
    constructor(x, y, w, h, img, type) {
        super(x, y, w, h, img, type);
        this.strength = 5;
        this.startedBreaking = false;
    }
    break() {
        if (!this.startedBreaking) {
            this.startedBreaking = true;
            sandBreaker(this);
        }
    }
}

class DeathBlock extends Block {
    constructor(x, y, w, h, img, imgS, type, dirY) {
        super(x, y, w, h, img, type);
        this.slicer = {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h / 2,
            dirY: dirY,
            img: imgS
        }
    }

    move() {
        if (this.slicer.y + this.slicer.h < this.y || this.y - this.slicer.y < this.slicer.h - this.h) {
            this.slicer.dirY *= -1
        }
        this.slicer.y += this.slicer.dirY;
    }

    kill() {
        if (Math.abs((this.slicer.x + this.slicer.w / 2) - (player.x + player.w / 2)) < this.slicer.w / 2 + player.w / 2 && player.y + player.h > this.slicer.y && player.y + player.h < this.slicer.y + this.slicer.h && !player.dead)
            player.die()
    }

}

class Coin extends Parent {
    constructor(x, y, w, h, img) {
        super(x, y, w, h, img);
    }
    deleteCoin() {
        if (this.x + this.w / 2 > deleteButton.x - x && this.x + this.w / 2 < deleteButton.x - x + deleteButton.w && this.y + this.h / 2 > deleteButton.y - y && this.y + this.h / 2 < deleteButton.y - y + deleteButton.h) {
            coins.splice(coins.indexOf(this), 1)
        }
    }
}

class Cup extends Parent {
    constructor(x, y, w, h, img) {
        super(x, y, w, h, img);
        this.alpha = 0.5;
        this.available = false
    }
    checkAvailablity() {
        if (coins.length == 0) {
            this.alpha = 1;
            this.available = true;
        }
        else {
            this.available = false;
            this.alpha = 0.5;
        }
    }

    drawCup() {
        this.checkAvailablity();
        tint(255, this.alpha * 255)
        image(cupImg, this.x, this.y, this.w, this.h);
        tint(255, 255);
    }

    edit() {
        if (cupEditing) {
            this.x = mouseX - this.w / 2 - x;
            this.y = mouseY - this.h / 2 - y;
        }

    }
}

