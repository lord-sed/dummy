//Declaration of global variables
let life = 3;
let level = 1;
let timer;
let time;
let timeAllowed = 20;
let gameSequence = [];
let gameEntry;
let playerEntry;
let playerIndex;
let hintColors;
let colors = ["red", "yellow", "blue", "green"];
let gameOverAnimation;

//Game start
document.body.addEventListener("keypress", () => {
    startGame();
}, {once: true});

document.getElementById("restart").addEventListener("click", () =>  {
    document.getElementById("restart").classList.add("active");
    setTimeout(() => {
        document.getElementById("restart").classList.remove("active");
    }, 300);
    document.getElementById("level").innerText = "SIMON GAME";
    document.getElementById("life").innerText = "life: "+ life;
    document.getElementById("comment").innerText = "Press any key to start...";
    document.body.addEventListener("keypress", () => {
        startGame();
    }, {once: true});   
});
//Declaring Functions

function startGame () { 
    playerIndex = 0;
    document.getElementById("level").innerText = "Level: "+ level;
    document.getElementById("life").innerText = "life: "+ life;
    gameEntry = colors[Math.floor(4 * Math.random())];
    buttonSelect(gameEntry);
    gameSequence.push(gameEntry);
    startTimer();
    // Hint functionality
    hintColors = colors.filter(element => {
        return element != gameSequence [playerIndex];
    });
    hintDouble = hintColors[Math.floor(3 * Math.random())];
    //Add event listeners for buttons
    document.querySelectorAll(".play-area button").forEach(element => {
        element.addEventListener("click", gameLogic);
    });
    document.getElementById("hint").addEventListener("click", hinter);
}
function startTimer () {
    time = timeAllowed;
    timer = setInterval(() => {
        if (time > 0) {
            time--;
        }
        else if (time == 0) {
            if (life > 1) {
                clearInterval(timer);
                wrongEntry();
            } else if (life == 1) {
                clearInterval(timer);
                gameOver();
            };
        };
    }, 1000);
}
function buttonSelect (button) {
    document.getElementById(button).classList.add("selected");
    setTimeout(() => {
        document.getElementById(button).classList.remove("selected");
    }, 300);
}
function buttonClick (button) {
    document.getElementById(button).classList.add("clicked");
    setTimeout(() => {
        document.getElementById(button).classList.remove("clicked");
    }, 300);
}
function wrongEntry () {
    document.getElementById("comment").innerText = "Retry!";
    document.body.style.backgroundColor = "red";
    setTimeout(() => {
        document.body.style.backgroundColor = "#0F6292";;
    }, 300)
    life--;
    document.getElementById("life").innerText = "life: "+ life;
    startTimer();
}
function gameOver () {
    life = 0;
    playerIndex = 0;
    gameSequence = 0;
    document.getElementById("level").innerText = "GAME OVER";
    document.getElementById("life").innerText = "life: "+ life;
    document.getElementById("comment").innerText = "Press any key to restart...";
    // document.querySelector(".container").classList.add("game-over");
    document.body.style.backgroundColor = "red";
    gameOverAnimation = setInterval (() => {
        document.body.style.backgroundColor = "yellow";
        setTimeout(() => {
            document.body.style.backgroundColor = "red";
        }, 300);
    }, 500);
}
function restart () {
    life = 3;
    level = 1;
    clearInterval (gameOverAnimation);
    document.body.style.backgroundColor = "#0F6292";
    document.body.addEventListener("keypress", () => {
        startGame();
    }, {once: true});
}
function hinter () {
    document.getElementById("hint").classList.add("active");
    setTimeout(() => {
        document.getElementById("hint").classList.remove("active");
    }, 300);

    let i = 30;
    let j = 0;
    let x = 1;
    let animation = setInterval(() => {
        if (i < 60 && j < 3) {
            document.getElementById(hintDouble).style.transform = "rotate("+x+"deg)";
            document.getElementById(gameEntry).style.transform = "rotate("+x+"deg)";
            i++;
            x++;
        } else if (i >= 60 && i != 120 && j < 3) {
            document.getElementById(hintDouble).style.transform = "rotate("+x+"deg)";
            document.getElementById(gameEntry).style.transform = "rotate("+x+"deg)";
            i++;
            x--;
        } else if (i == 120 && j < 3) {
            document.getElementById(hintDouble).style.transform = "rotate("+x+"deg)";
            document.getElementById(gameEntry).style.transform = "rotate("+x+"deg)";
            i=0;
            j++;
            x++;
        } else if (j >= 3) {
            clearInterval(animation);
            document.getElementById(hintDouble).style.transform = "rotate(0deg)";
            document.getElementById(gameEntry).style.transform = "rotate(0deg)";
        };
    }, 10);
}

function gameLogic () {
    //if player is allowed to make entries
    if (time > 0 && playerIndex < gameSequence.length && life > 0) {
        playerEntry = this.id;
        if (playerIndex < gameSequence.length - 1 && playerEntry == gameSequence [playerIndex]) {
            //correct keep making entries
            clearInterval(timer);
            buttonClick(playerEntry);
            document.getElementById("comment").innerText = "Excellent!";
            playerIndex++;
            hintColors = colors.filter(element => {
                return element != gameSequence [playerIndex];
            });
            hintDouble = hintColors[Math.floor(3 * Math.random())];
            startTimer();
        } else if (playerIndex == gameSequence.length - 1 && playerEntry == gameSequence [playerIndex]) {
            //last entry correct, level completed
            clearInterval(timer);
            document.getElementById("hint").removeEventListener("click", hinter);
            document.querySelectorAll(".play-area button").forEach(element => {
                element.removeEventListener("click", gameLogic);
            });
            buttonClick(playerEntry);
            document.getElementById("comment").innerText = "Next Level!";
            playerIndex = 0;
            level++;
            setTimeout (() => {
                startGame();
            }, 400);
            
        } else if (playerEntry != gameSequence [playerIndex] && life > 1) {
            clearInterval(timer);
            //wrong entry reduce life and repeat
            clearInterval(timer);
            life--;
            wrongEntry();
        } else if (playerEntry != gameSequence [playerIndex] && life == 1) {
            //life exhausted game over
            clearInterval(timer);
            document.querySelectorAll(".play-area button").forEach(element => {
                element.removeEventListener("click", gameLogic);
            });
            document.getElementById("hint").removeEventListener("click", hinter);
            gameOver();
            life = 0;
            playerIndex = 0;
            gameSequence = 0;
        };
    };
}