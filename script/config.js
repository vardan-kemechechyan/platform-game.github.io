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
var linkLvl1 = "JTdCJTIyYmxvY2tzJTIyOiU1QiU3QiUyMnglMjI6MSwlMjJ5JTIyOjMwMSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6NTAsJTIyeSUyMjozMDEsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjk4LCUyMnklMjI6MzAxLCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxNDcsJTIyeSUyMjozMDEsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjE5NiwlMjJ5JTIyOjMwMSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6MSwlMjJ5JTIyOjM1MCwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6OTksJTIyeSUyMjozNTEsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjUwLCUyMnklMjI6MzUwLCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxNDgsJTIyeSUyMjozNTEsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjE5NiwlMjJ5JTIyOjM1MSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6MTk3LCUyMnklMjI6NDAwLCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxOTgsJTIyeSUyMjo0NTAsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjE0OCwlMjJ5JTIyOjQwMSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6OTksJTIyeSUyMjo0MDEsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjUwLCUyMnklMjI6NDAwLCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxLCUyMnklMjI6NDAwLCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxNDksJTIyeSUyMjo0NTEsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjUxLCUyMnklMjI6NDQ5LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxMDAsJTIyeSUyMjo0NTAsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjIsJTIyeSUyMjo0NDksJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjI0OCwlMjJ5JTIyOjMwNC41LCUyMnR5cGUlMjI6JTIySG9yaXpvbnRhbCUyMiwlMjJlZGl0UmFuZ2UlMjI6MzAzJTdELCU3QiUyMnglMjI6NjYzLCUyMnklMjI6MzAzLCUyMnR5cGUlMjI6JTIyU2FuZCUyMiU3RCwlN0IlMjJ4JTIyOjY2MywlMjJ5JTIyOjM1MSwlMjJ0eXBlJTIyOiUyMlNhbmQlMjIlN0QsJTdCJTIyeCUyMjo2NjMsJTIyeSUyMjo0MDEsJTIydHlwZSUyMjolMjJTYW5kJTIyJTdELCU3QiUyMnglMjI6NjE0LCUyMnklMjI6NDAyLCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjo3MTIsJTIyeSUyMjo0MDIsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjYxNSwlMjJ5JTIyOjQ1MSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6MTI0NCwlMjJ5JTIyOjQ3OCwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6NzIwLCUyMnklMjI6MzAzLjUsJTIydHlwZSUyMjolMjJIb3Jpem9udGFsJTIyLCUyMmVkaXRSYW5nZSUyMjozMzElN0QsJTdCJTIyeCUyMjo3ODgsJTIyeSUyMjo0MzIuNSwlMjJ0eXBlJTIyOiUyMkRlYXRoJTIyJTdELCU3QiUyMnglMjI6MTI0MCwlMjJ5JTIyOjI5NCwlMjJ0eXBlJTIyOiUyMlNhbmQlMjIlN0QsJTdCJTIyeCUyMjoxMjQwLCUyMnklMjI6MzQ0LCUyMnR5cGUlMjI6JTIyU2FuZCUyMiU3RCwlN0IlMjJ4JTIyOjEyNDEsJTIyeSUyMjozOTQsJTIydHlwZSUyMjolMjJTYW5kJTIyJTdELCU3QiUyMnglMjI6MTI0MSwlMjJ5JTIyOjQ0MywlMjJ0eXBlJTIyOiUyMlNhbmQlMjIlN0QsJTdCJTIyeCUyMjoxMDAwLCUyMnklMjI6NDMxLjUsJTIydHlwZSUyMjolMjJEZWF0aCUyMiU3RCwlN0IlMjJ4JTIyOjEwOTUsJTIyeSUyMjo0MzEuNSwlMjJ0eXBlJTIyOiUyMkRlYXRoJTIyJTdELCU3QiUyMnglMjI6MTI0MiwlMjJ5JTIyOjQ5MiwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6OTUzLCUyMnklMjI6NDMwLCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjo5MDUsJTIyeSUyMjo0MzAsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjkwNiwlMjJ5JTIyOjQ3OSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6OTU0LCUyMnklMjI6NDc5LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QlNUQsJTIycGxheWVyJTIyOiU3QiUyMnglMjI6MTAwLCUyMnklMjI6MjAwJTdELCUyMmNvaW5zJTIyOiU1QiU3QiUyMnglMjI6Njc0LCUyMnklMjI6MjY0JTdELCU3QiUyMnglMjI6OTYwLCUyMnklMjI6Mzk4JTdELCU3QiUyMnglMjI6NDMwLCUyMnklMjI6MTUzJTdEJTVELCUyMmN1cCUyMjolN0IlMjJ4JTIyOjEzMTgsJTIyeSUyMjoyMDIlN0QsJTIyY2FtZXJhJTIyOiU3QiUyMnglMjI6MCwlMjJ5JTIyOjAlN0QlN0Q=";
var linkLvl2 = "JTdCJTIyYmxvY2tzJTIyOiU1QiU3QiUyMnglMjI6NDIsJTIyeSUyMjoyOTcsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjkxLCUyMnklMjI6Mjk4LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxMzksJTIyeSUyMjoyOTgsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjEzNiwlMjJ5JTIyOjM0NywlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6MTM4LCUyMnklMjI6Mzk1LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxMzksJTIyeSUyMjo0NDUsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjE0MSwlMjJ5JTIyOjQ5MiwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6Mjc5LCUyMnklMjI6MTE0LjUsJTIydHlwZSUyMjolMjJWZXJ0aWNhbCUyMiwlMjJlZGl0UmFuZ2UlMjI6MTkzJTdELCU3QiUyMnglMjI6Mzk4LCUyMnklMjI6MTE0LjUsJTIydHlwZSUyMjolMjJIb3Jpem9udGFsJTIyLCUyMmVkaXRSYW5nZSUyMjo1NCU3RCwlN0IlMjJ4JTIyOjYxMywlMjJ5JTIyOjI5OSwlMjJ0eXBlJTIyOiUyMlNhbmQlMjIlN0QsJTdCJTIyeCUyMjo2NjEsJTIyeSUyMjoyOTksJTIydHlwZSUyMjolMjJTYW5kJTIyJTdELCU3QiUyMnglMjI6NTY0LCUyMnklMjI6Mjk5LCUyMnR5cGUlMjI6JTIyU2FuZCUyMiU3RCwlN0IlMjJ4JTIyOjE4MiwlMjJ5JTIyOjM0OC41LCUyMnR5cGUlMjI6JTIyRGVhdGglMjIlN0QsJTdCJTIyeCUyMjoyNzcsJTIyeSUyMjozNDguNSwlMjJ0eXBlJTIyOiUyMkRlYXRoJTIyJTdELCU3QiUyMnglMjI6MzczLCUyMnklMjI6MzQ4LjUsJTIydHlwZSUyMjolMjJEZWF0aCUyMiU3RCwlN0IlMjJ4JTIyOjQ2OSwlMjJ5JTIyOjM0OC41LCUyMnR5cGUlMjI6JTIyRGVhdGglMjIlN0QsJTdCJTIyeCUyMjo3MDcsJTIyeSUyMjozNDYuNSwlMjJ0eXBlJTIyOiUyMkRlYXRoJTIyJTdELCU3QiUyMnglMjI6MTgxLCUyMnklMjI6MzczLCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoxODMsJTIyeSUyMjo0MjAsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjIyNywlMjJ5JTIyOjM2OSwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6OTIsJTIyeSUyMjozNDYsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjkxLCUyMnklMjI6Mzk0LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjo5MCwlMjJ5JTIyOjQ0NCwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6OTMsJTIyeSUyMjo0OTIsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjQzLCUyMnklMjI6MzQ3LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjoyNzUsJTIyeSUyMjozNzAsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjMyMiwlMjJ5JTIyOjM3MiwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6MzcxLCUyMnklMjI6MzcwLCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjo0MjAsJTIyeSUyMjozNzAsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjQ2OSwlMjJ5JTIyOjM3MCwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6NTE3LCUyMnklMjI6MzcxLCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjozMjQsJTIyeSUyMjo0NzIsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjUxOCwlMjJ5JTIyOjQyMCwlMjJ0eXBlJTIyOiUyMlN0b25lJTIyJTdELCU3QiUyMnglMjI6NTIwLCUyMnklMjI6NDY5LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QsJTdCJTIyeCUyMjo5OTMsJTIyeSUyMjozNDguNSwlMjJ0eXBlJTIyOiUyMkRlYXRoJTIyJTdELCU3QiUyMnglMjI6MTEzOCwlMjJ5JTIyOjM0OC41LCUyMnR5cGUlMjI6JTIyRGVhdGglMjIlN0QsJTdCJTIyeCUyMjo4MDIsJTIyeSUyMjozNDYsJTIydHlwZSUyMjolMjJTYW5kJTIyJTdELCU3QiUyMnglMjI6OTQ2LCUyMnklMjI6MzQ4LCUyMnR5cGUlMjI6JTIyU3RvbmUlMjIlN0QlNUQsJTIycGxheWVyJTIyOiU3QiUyMnglMjI6MTAwLCUyMnklMjI6MjAwJTdELCUyMmNvaW5zJTIyOiU1QiU3QiUyMnglMjI6Mzc0LCUyMnklMjI6NzAlN0QsJTdCJTIyeCUyMjo2MjQsJTIyeSUyMjoyNDAlN0QsJTdCJTIyeCUyMjo4MTIsJTIyeSUyMjozMDUlN0QsJTdCJTIyeCUyMjo5NTUsJTIyeSUyMjozMDYlN0QlNUQsJTIyY3VwJTIyOiU3QiUyMnglMjI6MTA4OCwlMjJ5JTIyOjM0NyU3RCwlMjJjYW1lcmElMjI6JTdCJTIyeCUyMjotMzQsJTIyeSUyMjowJTdEJTdE";
var linkLvl3 = "JTdCJTIyYmxvY2tzJTIyOiU1QiU3QiUyMnglMjI6MTEsJTIyeSUyMjo0NDQuNSwlMjJ0eXBlJTIyOiUyMkhvcml6b250YWwlMjIsJTIyZWRpdFJhbmdlJTIyOjExMiU3RCwlN0IlMjJ4JTIyOjEyNiwlMjJ5JTIyOjQxOS41LCUyMnR5cGUlMjI6JTIyRGVhdGglMjIlN0QsJTdCJTIyeCUyMjoyNjEsJTIyeSUyMjo0MzMsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjMzNywlMjJ5JTIyOjIxMC41LCUyMnR5cGUlMjI6JTIyVmVydGljYWwlMjIsJTIyZWRpdFJhbmdlJTIyOjIxMyU3RCwlN0IlMjJ4JTIyOjU1MSwlMjJ5JTIyOjI5NiwlMjJ0eXBlJTIyOiUyMlNhbmQlMjIlN0QsJTdCJTIyeCUyMjo0ODcsJTIyeSUyMjoxNzQuNSwlMjJ0eXBlJTIyOiUyMkhvcml6b250YWwlMjIsJTIyZWRpdFJhbmdlJTIyOjI2NyU3RCwlN0IlMjJ4JTIyOjc1OCwlMjJ5JTIyOjMxMy41LCUyMnR5cGUlMjI6JTIySG9yaXpvbnRhbCUyMiwlMjJlZGl0UmFuZ2UlMjI6MTk5JTdELCU3QiUyMnglMjI6MTA1MiwlMjJ5JTIyOjM1MS41LCUyMnR5cGUlMjI6JTIyRGVhdGglMjIlN0QsJTdCJTIyeCUyMjoxMjE2LCUyMnklMjI6MzUwLjUsJTIydHlwZSUyMjolMjJEZWF0aCUyMiU3RCwlN0IlMjJ4JTIyOjEzNjgsJTIyeSUyMjo0MzQsJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCwlN0IlMjJ4JTIyOjExNTgsJTIyeSUyMjozOTksJTIydHlwZSUyMjolMjJTdG9uZSUyMiU3RCU1RCwlMjJwbGF5ZXIlMjI6JTdCJTIyeCUyMjo0MCwlMjJ5JTIyOjM0Ni41JTdELCUyMmNvaW5zJTIyOiU1QiU3QiUyMnglMjI6MTU3LCUyMnklMjI6MzYwJTdELCU3QiUyMnglMjI6NTYyLCUyMnklMjI6MjU3JTdELCU3QiUyMnglMjI6NjYyLCUyMnklMjI6ODUlN0QsJTdCJTIyeCUyMjoxMTY1LCUyMnklMjI6MTk0JTdELCU3QiUyMnglMjI6MTE2NSwlMjJ5JTIyOjI5NiU3RCwlN0IlMjJ4JTIyOjEzNzUsJTIyeSUyMjozOTYlN0QlNUQsJTIyY3VwJTIyOiU3QiUyMnglMjI6MTE1NywlMjJ5JTIyOjM0OSU3RCwlMjJjYW1lcmElMjI6JTdCJTIyeCUyMjowLCUyMnklMjI6MCU3RCU3RA==";
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
    x: cupStartingX + cupWidth / 2 - 25,
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