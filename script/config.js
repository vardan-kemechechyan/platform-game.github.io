var canvasWidth = 800;
var canvasHeight = 500;
var popup = true;
var x = 0;
var y = 0;
var levelsPassed = 1;
var gameStarted = false;
var gravity = 0.5;

var stoneImg = 'images/brickWall.png';
var sandImg = 'images/grassCenter_rounded.png';//'images/sand.png'
var metalImg = 'images/grassMid.png';//'images/metal.png'

var startImg = "images/forward.png";
var stopImg = "images/pause.png";
var starImg = "images/star.png";
var stopStartW = 50;
var stopStarth = 50;

var backgroundColor = [192, 232, 236];
var toolBarColor = [246, 192, 143];
var seaColor = [56, 161, 193];
// var stoneColor = [205, 82, 82];
// var metalColor = [170, 170, 170];
// var sandColor = [255, 120, 100];
// var deathBlockSlicerColor = [255, 0, 0]

var editorColor = [170, 170, 170, 50]; //r g b alpha
var player, cup;
// var playerColor = [230, 230, 0];
var playerOpacity = 50;

var player;
var playerStartingX = 100;
var playerStartingY = 200;
var playerWidth = 30;
var playerHeight = 90;
var playerWalkSprite = { w: 72, h: 97 }
var playerWalkFrames = 11;
var playerSprite = "images/p3_spritesheet.png"
var playerWalk0 = { x: 0, y: 0 };
var playerWalk1 = { x: 73, y: 0 };
var playerWalk2 = { x: 146, y: 0 };
var playerWalk3 = { x: 0, y: 98 };
var playerWalk4 = { x: 73, y: 98 };
var playerWalk5 = { x: 146, y: 98 };
var playerWalk6 = { x: 219, y: 0 };
var playerWalk7 = { x: 292, y: 0 };
var playerWalk8 = { x: 219, y: 98 };
var playerWalk9 = { x: 365, y: 0 };
var playerWalk10 = { x: 292, y: 98 };
var playerStand = [0, 196, 66, 92];

var playerWon = false;
// var linkLvl1 = "JTdCJTIyYmxvY2tzJTIyOiU1QiU3QiUyMnglMjI6OTMsJTIyeSUyMjoyOTYuODQzNzUsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCU1RCwlMjJwbGF5ZXIlMjI6JTdCJTIyeCUyMjoxMDAsJTIyeSUyMjoyMDAlN0QsJTIyY29pbnMlMjI6JTVCJTVELCUyMmN1cCUyMjolN0IlMjJ4JTIyOjE5Ny41LCUyMnklMjI6MjE5LjM0Mzc1JTdELCUyMmNhbWVyYSUyMjolN0IlMjJ4JTIyOjAsJTIyeSUyMjowJTdEJTdE"
// var linkLvl2 = "JTdCJTIyYmxvY2tzJTIyOiU1QiU3QiUyMnglMjI6OTMsJTIyeSUyMjoyOTYuODQzNzUsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCU1RCwlMjJwbGF5ZXIlMjI6JTdCJTIyeCUyMjoxMDAsJTIyeSUyMjoyMDAlN0QsJTIyY29pbnMlMjI6JTVCJTVELCUyMmN1cCUyMjolN0IlMjJ4JTIyOjE5Ny41LCUyMnklMjI6MjE5LjM0Mzc1JTdELCUyMmNhbWVyYSUyMjolN0IlMjJ4JTIyOjAsJTIyeSUyMjowJTdEJTdE"
// var linkLvl3 = "JTdCJTIyYmxvY2tzJTIyOiU1QiU3QiUyMnglMjI6OTMsJTIyeSUyMjoyOTYuODQzNzUsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCU1RCwlMjJwbGF5ZXIlMjI6JTdCJTIyeCUyMjoxMDAsJTIyeSUyMjoyMDAlN0QsJTIyY29pbnMlMjI6JTVCJTVELCUyMmN1cCUyMjolN0IlMjJ4JTIyOjE5Ny41LCUyMnklMjI6MjE5LjM0Mzc1JTdELCUyMmNhbWVyYSUyMjolN0IlMjJ4JTIyOjAsJTIyeSUyMjowJTdEJTdE"
var linkLvl1 = "JTdCJTIyYmxvY2tzJTIyOiU1QiU3QiUyMnglMjI6OTQsJTIyeSUyMjozMDguNDA2MjUsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjIwNCwlMjJ5JTIyOjI3Ni45MDYyNSwlMjJ0eXBlJTIyOiUyMkhvcml6b250YWwlMjIsJTIyZWRpdFJhbmdlJTIyOjE1MCU3RCwlN0IlMjJ4JTIyOjM5MiwlMjJ5JTIyOjIyMS40MDYyNSwlMjJ0eXBlJTIyOiUyMlNhbmQlMjIlN0QsJTdCJTIyeCUyMjo1MDksJTIyeSUyMjoyNzIuOTA2MjUsJTIydHlwZSUyMjolMjJWZXJ0aWNhbCUyMiwlMjJlZGl0UmFuZ2UlMjI6NzUlN0QlNUQsJTIycGxheWVyJTIyOiU3QiUyMnglMjI6MTAwLCUyMnklMjI6MjAwJTdELCUyMmNvaW5zJTIyOiU1QiU3QiUyMnglMjI6MjUwLCUyMnklMjI6MjA5LjQwNjI1JTdEJTVELCUyMmN1cCUyMjolN0IlMjJ4JTIyOjU4Ny41LCUyMnklMjI6MTcxLjkwNjI1JTdELCUyMmNhbWVyYSUyMjolN0IlMjJ4JTIyOi0yNiwlMjJ5JTIyOjAlN0QlN0Q"
var linkLvl2 = "JTdCJTIyYmxvY2tzJTIyOiU1QiU3QiUyMnglMjI6ODUsJTIyeSUyMjozMTEuODEyNSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6MTg4LCUyMnklMjI6MjUyLjMxMjUsJTIydHlwZSUyMjolMjJIb3Jpem9udGFsJTIyLCUyMmVkaXRSYW5nZSUyMjoxNTAlN0QsJTdCJTIyeCUyMjozMjAsJTIyeSUyMjoyNjcuMzEyNSwlMjJ0eXBlJTIyOiUyMlZlcnRpY2FsJTIyLCUyMmVkaXRSYW5nZSUyMjo3NSU3RCwlN0IlMjJ4JTIyOjQ4NiwlMjJ5JTIyOjI4Mi44MTI1LCUyMnR5cGUlMjI6JTIyU2FuZCUyMiU3RCwlN0IlMjJ4JTIyOjU2OSwlMjJ5JTIyOjMwNi4zMTI1LCUyMnR5cGUlMjI6JTIyRGVhdGglMjIlN0QsJTdCJTIyeCUyMjo3NjMsJTIyeSUyMjoyODIuODEyNSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdEJTVELCUyMnBsYXllciUyMjolN0IlMjJ4JTIyOjEwMCwlMjJ5JTIyOjIwMCU3RCwlMjJjb2lucyUyMjolNUIlN0IlMjJ4JTIyOjc5MSwlMjJ5JTIyOjIwMS44MTI1JTdEJTVELCUyMmN1cCUyMjolN0IlMjJ4JTIyOjY1NSwlMjJ5JTIyOjIwMCU3RCwlMjJjYW1lcmElMjI6JTdCJTIyeCUyMjotOTIsJTIyeSUyMjowJTdEJTdE"
var linkLvl3 = "JTdCJTIyYmxvY2tzJTIyOiU1QiU3QiUyMnglMjI6OTgsJTIyeSUyMjozMTcuNDA2MjUsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjI0MSwlMjJ5JTIyOjMwOC45MDYyNSwlMjJ0eXBlJTIyOiUyMkhvcml6b250YWwlMjIsJTIyZWRpdFJhbmdlJTIyOjE1MCU3RCwlN0IlMjJ4JTIyOjg4LCUyMnklMjI6MTM3LjQwNjI1LCUyMnR5cGUlMjI6JTIyU2FuZCUyMiU3RCwlN0IlMjJ4JTIyOjIzNiwlMjJ5JTIyOjIxOS40MDYyNSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6MzkyLCUyMnklMjI6MzA4LjkwNjI1LCUyMnR5cGUlMjI6JTIySG9yaXpvbnRhbCUyMiwlMjJlZGl0UmFuZ2UlMjI6MTUwJTdELCU3QiUyMnglMjI6NjE1LCUyMnklMjI6MjM1LjkwNjI1LCUyMnR5cGUlMjI6JTIyVmVydGljYWwlMjIsJTIyZWRpdFJhbmdlJTIyOjc1JTdELCU3QiUyMnglMjI6NzQ1LCUyMnklMjI6MzQ1LjkwNjI1LCUyMnR5cGUlMjI6JTIyRGVhdGglMjIlN0QsJTdCJTIyeCUyMjo4ODksJTIyeSUyMjoyMTcuNDA2MjUsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjkzNSwlMjJ5JTIyOjE3MS40MDYyNSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6OTgwLCUyMnklMjI6MTIyLjQwNjI1LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxMDIzLCUyMnklMjI6MTY4LjQwNjI1LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjo5NTYsJTIyeSUyMjo3My45MDYyNSwlMjJ0eXBlJTIyOiUyMlZlcnRpY2FsJTIyLCUyMmVkaXRSYW5nZSUyMjoyODglN0QlNUQsJTIycGxheWVyJTIyOiU3QiUyMnglMjI6MTAwLCUyMnklMjI6MjAwJTdELCUyMmNvaW5zJTIyOiU1QiU3QiUyMnglMjI6NjUxLCUyMnklMjI6Mjc1LjQwNjI1JTdELCU3QiUyMnglMjI6OTk1LCUyMnklMjI6MjMyLjQwNjI1JTdEJTVELCUyMmN1cCUyMjolN0IlMjJ4JTIyOjg4MS41LCUyMnklMjI6NzkuOTA2MjUlN0QsJTIyY2FtZXJhJTIyOiU3QiUyMnglMjI6LTU4LCUyMnklMjI6MCU3RCU3RA="
var cupImg = "images/lock_r.png";
var coinImg = "images/key_r.png";

var slicerImg = "images/slicer.png";
var backgroundImg = "images/bg.png"

var hArrowImg = "images/horArrow.png";
var vArrowImg = "images/vArrow.png";

var menuImg = "images/menu.png";
var menuW = 50;
var menuH = 50;
// var cupColor = [255, 100, 120];
var cupWidth = 50;
var cupHeight = 50;
var cupEditing = false;

var cupStartingX = canvasWidth - playerStartingX - cupWidth
var cupStartingY = playerStartingY
var blocks = [];
var tools = [];
var toolsForPlaying = [];
var seaArr = [];
var toolsFunctions = ["Play", "Stone", "Horizontal", "Vertical", "Sand", "Death", "Coin"];
var toolBarForPlaying = ["Play", "Menu"];
var nextArrowImg = "images/arrowRight.png";
var nextArrowW = 50;
var nextArrowH = 50;
var waveSize = 20;
var toolBarHeight = canvasHeight / 8;
var seaStartingY = canvasHeight / 8 * 7;

var currentLvl = 0;
var deleteButton = {
    w: 50,
    h: 50,
    x: canvasWidth - 50 - 15, // - w - gap
    y: canvasHeight - 50 - 15,   // - h - gap
    color: [255, 145, 145],
    strokeWeight: 10,
    img: "images/trashBox.png"
}
var horizontalBlocksSpeed = 0.75;
var verticalBlocksSpeed = 0.75;

var stoneWidth = 50;
var stoneHeight = 50;
var metalBlocksWidth = 100;
var metalBlocksHeight = 25;
var sandWidth = 50;
var sandHeight = 50;
var sandBlockStartingStrength = 5;
var toolBarImagesGap = 5;

var toolBarRectCorners = 5;
var toolBarTextSize = 20;

var backgroundSize = 1200;     // > canvasWidth
var backgroundEditRange = 5;   // 1/5 of Canvas

var blocksRoundedCorners = 2;

var horizontalBlocksRange = 150;
var verticalBlocksRange = 75;

var editedBlocksID;
var editedCoinsID;
var playerEditing = false;
var blockRangeEditing = false;

var playerVX = 3;
var playerVY = 0;
var playerA = 0.4;
var deathBlockSlicerV = 0.2;

var coins = [];
var coinColor = [255, 100, 0];
var coinSize = 30;

var data;
var built = false;
var base64;

var playerFallingMaxSpeed = 6;
var playerJumpV0 = -12;

var informed = false;

var star = {
    x: cupStartingX + cupWidth/2,
    y: cupStartingY + cupHeight/2, 
    w: 20,
    h:20
}