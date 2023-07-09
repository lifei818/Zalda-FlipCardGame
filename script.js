// state cardFaces
let possibleCardFaces = [
    './imgs/carton_1.png',
    './imgs/carton_2.png',
    './imgs/carton_3.png',
    './imgs/carton_4.png',
    './imgs/carton_5.png',
    './imgs/carton_6.png',
    './imgs/carton_1.png',
    './imgs/carton_2.png',
    './imgs/carton_3.png',
    './imgs/carton_4.png',
    './imgs/carton_5.png',
    './imgs/carton_6.png',
];

// set initial values
let lowScore = localStorage.getItem("lowScore");
let score = 0;
let flippedCards = [];
let matchedCards = [];
let locked = false;
let flipTimeout = 700;

// Low Score
function assignLowScore(lowScoreOutput){
    lowScore=lowScore || "N/A";
    lowScoreOutput.textContent = "Low Score" + lowScore;
}

// Random Face
function getRandomIndex(length){
    // math.floor rounds down to the random nearest whole number
    // 0-1 demical * 12 = 0-11.99
    return Math.floor(Math.random()*length);
}
function getRandomFace(){
    // return 0-11
    const randomIndex = getRandomIndex(possibleCardFaces.length);
    const face = possibleCardFaces[randomIndex];
    possibleCardFaces.splice(randomIndex,1);
    // return 1/12 random face
    return face;
}
function shuffleCards(cardFaces){
    // let possibleCardFacesCopy = possibleCardFaces .slice();
    for (let i = 0; i < cardFaces.length; i++){
        cardFaces[i].innerHTML = `<img src = "${getRandomFace()}" alt"carton" />`;
        console.log(`cardFaces${i}}`, cardFaces[i].innerHTML);
    }
}
// check if the card is flipped
function isNotFlipped(card){
    return card.classList.contains("flipped");
}
// check if the card has a match
// true = card 1 === card 0, elseif false
function areMatching(flippedCards){
    return flippedCards[0].innerHTML === flippedCards[1].innerHTML;
}
// if this card does not has a match, hide it
function hideCards(flippedCards){
    setTimeout(function(){
        flippedCards[0].classList.remove("flipped");
        flippedCards[1].classList.remove("flipped");
        locked = false;
    },flipTimeout);
}
// when 12 cards are flipped, win screen
function hideScoreBoard(scoreBoard){
    scoreBoard.classList.add("hidden");
}
function renderWinScreen(winScreen){
    let totalClicks = document.querySelector(".total-count");
    totalClicks.textContent = `Total Clicks: ${score}`;
    setTimeout(function(){
        winScreen.classList.add("visible");
    },400);
}
// check lowest score in storage
function checkForLowScore(score,lowScoreOutput){
    if (score<lowScore||lowScore==="N/A"){
        localStorage.setItem("lowScore", score);
        lowScore = score;
        lowScoreOutput.textContent =`Low Score : ${lowScore}`;
    }
}

// replay, reset everything
function reset(
    lowScoreOutput,
      cardFaces,
      gameClicks,
      gameCardElements,
      winScreen,
      scoreBoard
){
    shuffleCards(cardFaces);
    matchedCards = [];
    score = 0;
    lowScoreOutput.textContent = `Clicks: ${score}`;
    winScreen.classList.remove("visible");
    scoreBoard.classList.remove("hidden");
    gameCardElements.forEach(function(card){
        card.classList.remove("flipped");
    })
}


document.addEventListener("DOMContentLoaded", function () {
    let newGameButton = document.getElementById("new-game-button");
    let gameContainer = document.getElementById("game-container");
    let gameCardElements = document.querySelectorAll(".game-card");
    let cardFaces = document.querySelectorAll(".game-card.back");
    let scoreBoard = document.getElementById("score-board");
    let gameClicks = document.querySelector(".click-count");
    let lowScoreOutput = document.querySelector(".low-score");
    let winScreen = document.getElementById("win-screen");
    let replayButton = document.getElementById("replay-button");

// call lowScore
assignLowScore(lowScoreOutput);
// call cardFaces
shuffleCards(cardFaces);
// call getRandomFace
newGameButton.addEventListener("click", function () {
    gameContainer.classList.remove("hidden");
});
    
// call click function when click any card from card container
gameContainer.addEventListener("click",function(event){
    let target = event.target;
    console.log("target",target);
    let card = target.closest(".game-card");
    // check if this card is exist 
    if (card && (target.classList.contains("front")) && !locked){
        // check if this card is not flipped
        if(!isNotFlipped(card)){
            card.classList.add("flipped");
            flippedCards.push(card);
            score++;
            gameClicks.textContent = `Clicks: ${score}`;
        }
        // check if this card has a match
        if (flippedCards.length ===2) {
            if(areMatching(flippedCards)){
                matchedCards.push(flippedCards[0],flippedCards[1]);
            } else {
                locked =true;
                hideCards(flippedCards);
            }
            flippedCards =[];
        }
        if (matchedCards.length ===gameCardElements.length){
            checkForLowScore(score, lowScoreOutput);
            hideScoreBoard(scoreBoard);
            renderWinScreen(winScreen);
        }

    }
});


// replay
replayButton.addEventListener("click", function (){
    resizeTo(lowScoreOutput,
        cardFaces,
        gameClicks,
        gameCardElements,
        winScreen,
        scoreBoard);
});


    // smooth scrolling
    let links = document.querySelectorAll("a");
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function (event) {
            console.log("hash", this.hash);
            if (this.hash !== "") {
                event.preventDefault();
                let hash = this.hash;
                let target = document.querySelector(hash);
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: "smooth",
                });
            }
        });
    }
});