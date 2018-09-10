//MATTER OF INVESTIGATION: get rid of the global variables

var canvasWidth = 800;
var canvasHeight = 500;
var popup = false;
var x = 0;
var y = 0;
var levelsPassed = 1;
var gameStarted = false;
var gravity = 0.5;
var editModeEnabled = false;

var stoneImg = 'images/brickWall.png';
var sandImg = 'images/grassCenter_rounded.png';
var metalImg = 'images/grassMid.png';
var sandToolImgUrl = "images/fragile_soil.png";
var HToolImgUrl = "images/moving_H.png";
var VToolImgUrl = "images/moving_V.png";
var deathToolImgUrl = "images/death0.png";
var sandToolImg, HToolImg, VToolImg, deathToolImg;
var startImg = "images/forward.png";
var stopImg = "images/pause.png";
var starImg = "images/star.png";
var stopStartW = 50;
var stopStarth = 50;
//the animation loops after x frames
var deathToolFrameCount = 10;
var sandToolFrameCount = 20;
var verticalToolFrameCount = 10;
var horizontalToolFrameCount = 10;

var toolBarColor = [246, 192, 143];
var minimapCameraStroke = 4;
var editorColor = [170, 170, 170, 50]; //r g b alpha
var player, cup;
var playerOpacity = 50;
var deathTool = {
    numOfFrames: 3,
    counter: 0
};

var verticalTool = {
    numOfFrames: 3,
    counter: 0
};

var horizontalTool = {
    numOfFrames: 3,
    counter: 0
};

var sandTool = {
    opacity: 1,
    numOfSteps: 3,
    counter: 3
};

var player;
var playerStartingX = 100;
var playerStartingY = 200;
var playerWidth = 30;
var playerHeight = 97;
var playerWalkSprite = { w: 72, h: 97 };
var playerWalkFrames = 11;
var playerSprite = "images/player.png";
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
var playerWalk_1 = { x: 949 - 73, y: 0 }; // imgWidth(1022) - 1frameWidth(73) = 949
var playerWalk_2 = { x: 949 - 146, y: 0 };
var playerWalk_3 = { x: 949, y: 98 };
var playerWalk_4 = { x: 949 - 73, y: 98 };
var playerWalk_5 = { x: 949 - 146, y: 98 };
var playerWalk_6 = { x: 949 - 219, y: 0 };
var playerWalk_7 = { x: 949 - 292, y: 0 };
var playerWalk_8 = { x: 949 - 219, y: 98 };
var playerWalk_9 = { x: 949 - 365, y: 0 };
var playerWalk_10 = { x: 949 - 292, y: 98 };
var playerStand = [0, 196, 66, 92];

var playerWon = false;
var starIsRising = false;

var playerBlinkCount = 7;
var blinkTimeInterval = 60 / (1000 / 100); // 100 miliseconds: 60 frame per seconds, 1000 miliseconds, 100 miliseconds interval

//call the function blocksNum(link) to know how difficult is the level
var linkLvl1 = "JTdCJTIyYmxvY2tzJTIyOiU1QiU3QiUyMnglMjI6ODUsJTIyeSUyMjozMTEuODEyNSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6MTcxLCUyMnklMjI6MzcwLjUsJTIydHlwZSUyMjolMjJIb3Jpem9udGFsJTIyLCUyMmVkaXRSYW5nZSUyMjoxNTAlN0QsJTdCJTIyeCUyMjozMjQsJTIyeSUyMjoyNzEuNSwlMjJ0eXBlJTIyOiUyMlZlcnRpY2FsJTIyLCUyMmVkaXRSYW5nZSUyMjo5OCU3RCwlN0IlMjJ4JTIyOjQ4NiwlMjJ5JTIyOjI4Mi44MTI1LCUyMnR5cGUlMjI6JTIyU2FuZCUyMiU3RCwlN0IlMjJ4JTIyOjU2OSwlMjJ5JTIyOjMwNi4zMTI1LCUyMnR5cGUlMjI6JTIyRGVhdGglMjIlN0QsJTdCJTIyeCUyMjo3NzksJTIyeSUyMjoyODcsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjg1MiwlMjJ5JTIyOjMwNS41LCUyMnR5cGUlMjI6JTIySG9yaXpvbnRhbCUyMiwlMjJlZGl0UmFuZ2UlMjI6MTUwJTdELCU3QiUyMnglMjI6NzMyLCUyMnklMjI6Mjg3LCUyMnR5cGUlMjI6JTIyU2FuZCUyMiU3RCU1RCwlMjJwbGF5ZXIlMjI6JTdCJTIyeCUyMjoxMDAsJTIyeSUyMjoyMDAlN0QsJTIyY29pbnMlMjI6JTVCJTdCJTIyeCUyMjo3OTEsJTIyeSUyMjoyMDEuODEyNSU3RCwlN0IlMjJ4JTIyOjM2MCwlMjJ5JTIyOjE4MSU3RCwlN0IlMjJ4JTIyOjM1OSwlMjJ5JTIyOjMwOSU3RCU1RCwlMjJjdXAlMjI6JTdCJTIyeCUyMjoxMTAzLCUyMnklMjI6MjEyJTdELCUyMmNhbWVyYSUyMjolN0IlMjJ4JTIyOjAsJTIyeSUyMjowJTdEJTdE";
var linkLvl2 = "JTdCJTIyYmxvY2tzJTIyOiU1QiU3QiUyMnglMjI6MTg3LCUyMnklMjI6MTM5LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxOTcsJTIyeSUyMjo0MDIuNSwlMjJ0eXBlJTIyOiUyMkhvcml6b250YWwlMjIsJTIyZWRpdFJhbmdlJTIyOjE1MCU3RCwlN0IlMjJ4JTIyOjkxLCUyMnklMjI6Mjk3LCUyMnR5cGUlMjI6JTIyU2FuZCUyMiU3RCwlN0IlMjJ4JTIyOjk0LCUyMnklMjI6MTM5LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjo2MTUsJTIyeSUyMjoyMzUuOTA2MjUsJTIydHlwZSUyMjolMjJWZXJ0aWNhbCUyMiwlMjJlZGl0UmFuZ2UlMjI6NzUlN0QsJTdCJTIyeCUyMjo3NDUsJTIyeSUyMjozNDUuOTA2MjUsJTIydHlwZSUyMjolMjJEZWF0aCUyMiU3RCwlN0IlMjJ4JTIyOjg5MCwlMjJ5JTIyOjIxOSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6OTM1LCUyMnklMjI6MTcxLjQwNjI1LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxMDc0LCUyMnklMjI6MjE1LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxMDI3LCUyMnklMjI6MTY5LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjo5NTYsJTIyeSUyMjo3My45MDYyNSwlMjJ0eXBlJTIyOiUyMlZlcnRpY2FsJTIyLCUyMmVkaXRSYW5nZSUyMjoyODglN0QsJTdCJTIyeCUyMjo0NDksJTIyeSUyMjozMjcuNSwlMjJ0eXBlJTIyOiUyMlZlcnRpY2FsJTIyLCUyMmVkaXRSYW5nZSUyMjo5NiU3RCwlN0IlMjJ4JTIyOjE0MCwlMjJ5JTIyOjkzLCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QlNUQsJTIycGxheWVyJTIyOiU3QiUyMnglMjI6MTAwLCUyMnklMjI6MjAwJTdELCUyMmNvaW5zJTIyOiU1QiU3QiUyMnglMjI6NjUxLCUyMnklMjI6Mjc1LjQwNjI1JTdELCU3QiUyMnglMjI6OTk1LCUyMnklMjI6MjMyLjQwNjI1JTdELCU3QiUyMnglMjI6NDg4LCUyMnklMjI6Mzc3JTdEJTVELCUyMmN1cCUyMjolN0IlMjJ4JTIyOjExMTksJTIyeSUyMjoxNjclN0QsJTIyY2FtZXJhJTIyOiU3QiUyMnglMjI6MCwlMjJ5JTIyOjAlN0QlN0Q";
var linkLvl3 = "JTdCJTIyYmxvY2tzJTIyOiU1QiU3QiUyMnglMjI6OTcsJTIyeSUyMjozMjUsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjE4NSwlMjJ5JTIyOjMyNC41LCUyMnR5cGUlMjI6JTIySG9yaXpvbnRhbCUyMiwlMjJlZGl0UmFuZ2UlMjI6MTUwJTdELCU3QiUyMnglMjI6MjgxLCUyMnklMjI6MzAwLjUsJTIydHlwZSUyMjolMjJIb3Jpem9udGFsJTIyLCUyMmVkaXRSYW5nZSUyMjoxNTAlN0QsJTdCJTIyeCUyMjozNzcsJTIyeSUyMjozMDAuNSwlMjJ0eXBlJTIyOiUyMlZlcnRpY2FsJTIyLCUyMmVkaXRSYW5nZSUyMjo3NSU3RCwlN0IlMjJ4JTIyOjU1NCwlMjJ5JTIyOjI2NywlMjJ0eXBlJTIyOiUyMlNhbmQlMjIlN0QsJTdCJTIyeCUyMjo2NDAsJTIyeSUyMjoxODIuNSwlMjJ0eXBlJTIyOiUyMkRlYXRoJTIyJTdELCU3QiUyMnglMjI6NzUzLCUyMnklMjI6MjIxLCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjo3OTksJTIyeSUyMjoyNjcsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjg0NSwlMjJ5JTIyOjMxMywlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6ODkxLCUyMnklMjI6MzYwLjUsJTIydHlwZSUyMjolMjJIb3Jpem9udGFsJTIyLCUyMmVkaXRSYW5nZSUyMjo1MCU3RCwlN0IlMjJ4JTIyOjk4MSwlMjJ5JTIyOjI3MS41LCUyMnR5cGUlMjI6JTIyRGVhdGglMjIlN0QlNUQsJTIycGxheWVyJTIyOiU3QiUyMnglMjI6MTAwLCUyMnklMjI6MjAwJTdELCUyMmNvaW5zJTIyOiU1QiU3QiUyMnglMjI6NjY1LCUyMnklMjI6MTA3JTdELCU3QiUyMnglMjI6NDExLCUyMnklMjI6MzM1JTdELCU3QiUyMnglMjI6MTEyMywlMjJ5JTIyOjIzMiU3RCU1RCwlMjJjdXAlMjI6JTdCJTIyeCUyMjoxMTE1LCUyMnklMjI6MzIzJTdELCUyMmNhbWVyYSUyMjolN0IlMjJ4JTIyOjAsJTIyeSUyMjowJTdEJTdE";
var cupImg = "images/lock_r.png";
var coinImg = "images/key_r.png";

var slicerImg = "images/slicer.png";
var backgroundImg = "images/bg_sea-min.png"; //bg-min.png

var menuImg = "images/menu.png";
var menuW = 50;
var menuH = 50;
var cupWidth = 50;
var cupHeight = 50;
var cupEditing = false;

var cupStartingX = canvasWidth - playerStartingX - cupWidth;
var cupStartingY = playerStartingY;
var blocks = [];
var tools = [];
var toolsForPlaying = [];

var toolsFunctions = ["Play", "Stone", "Horizontal", "Vertical", "Sand", "Death", "Coin"];
var toolBarForPlaying = ["Play", "Menu"];

var toolBarHeight = canvasHeight / 8;
var seaStartingY = canvasHeight / 8 * 7;

var currentLvl = 0;
var deleteButton = {
    w: 50,
    h: 50,
    x: canvasWidth - 50 - 15, // - w - gap
    y: canvasHeight - 50 - 15,   // - h - gap
    strokeWeight: 10,
    img: "images/trashBox.png"
};
var horizontalBlocksSpeed = 0.75;
var verticalBlocksSpeed = 0.75;

var stoneWidth = 50;
var stoneHeight = 50;
var metalBlocksWidth = 100;
var metalBlocksHeight = 25;
var sandWidth = 50;
var sandHeight = 50;
var sandBlockStartingStrength = 5;
var toolBarImagesGap = 20;

var toolBarRectCorners = 5;
var toolBarTextSize = 20;

var backgroundSize = 1500;     // > canvasWidth
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
var deathBlockSlicerV = 0.4;

var coins = [];
var coinSize = 30;

var data;
var built = false;
var base64;

var playerFallingMaxSpeed = 6;
var playerJumpV0 = -12;

var star = {
    x: cupStartingX + cupWidth / 2,
    y: cupStartingY,
    w: 50,
    h: 50,
    maxHeight: 75
};
var playerWonTemp = false;

var minimap = {
    scale : 1/8,
    x : (canvasWidth - backgroundSize/8)/2,
    y : canvasHeight/8*7,
    w: backgroundSize/8,
    h:  canvasHeight/8,
    camera : {
        x: 0,
        y: 0,
        w:  backgroundSize/8 / (backgroundSize/canvasWidth),
        h: canvasHeight/8
    }
};
////////////////////////////////////////////////////////////

var collisionRange = 100;