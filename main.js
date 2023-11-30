var blockSize = 30;
var rows = 20;
var cols = 20;
var board;
var context;

//bashka
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;;

var velocityX = 0;
var velocityY = 0;

//eda
var edaX;
var edaY;

var speed = 10;

//massiv dlya xranenia novovo tela
var snakeBody =[];
var score = 0;
var maxScore = localStorage.getItem('maxScore') || 0;

var gameOver = false;
var paused = false; 

var speed = 10;
var speedIncreaseThreshold = 10; 
var updateInterval;

window.onload = function(){
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", handleKeyPress);
    //update;;
    updateInterval = setInterval(update, 1000 / speed);
}


function update(){
    if(gameOver || paused){
        return;
    }

    context.fillStyle="black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle= "red";
    context.fillRect(edaX, edaY, blockSize, blockSize);

    if(snakeX == edaX && snakeY == edaY){
        //zvuk
        var eatSound = document.getElementById('eatSound');
        eatSound.play();
        snakeBody.push([edaX, edaY]);
        placeFood();
        score++;

        if (score > maxScore) {
            maxScore = score;
            localStorage.setItem('maxScore', maxScore);
        }
    }

    for(let i = snakeBody.length-1; i>0; i--){
        snakeBody[i] = snakeBody[i-1];
    }

    if(snakeBody.length){
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX = (snakeX + velocityX * blockSize + board.width) % board.width;
    snakeY = (snakeY + velocityY * blockSize + board.height) % board.height;

    context.fillStyle="lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for(let i = 0; i < snakeBody.length; i++){
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    for(let i = 0; i < snakeBody.length; i++){
        if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver = true;
            alert("Game Over!!!")
        }
      }

    document.getElementById('score').innerText = score;
    document.getElementById('max-score').innerText = maxScore;

    //speed++
    if (score !== 0 && score % speedIncreaseThreshold === 0 && speed < 20) {
        speed += 0.2;
        clearInterval(updateInterval);
        updateInterval = setInterval(update, 1000 / speed);
    }
}

//space pause/resume
function handleKeyPress(e){
    if (e.code === "Space") {
        if (gameOver) {
            restartGame();
        } else {
            paused = !paused;
        }
    } else {
        changeDirection(e);
    }
}

function restartGame(){
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    
    gameOver = false;
    paused = false;
    placeFood();
}

function changeDirection(e){
    if(e.code == "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }
    else if(e.code == "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }
    else if(e.code == "ArrowRight"&& velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
    else if(e.code == "ArrowLeft"&& velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }
}

function placeFood(){
    edaX = Math.floor(Math.random() * cols) * blockSize;
    edaY = Math.floor(Math.random() * rows) * blockSize;
}
