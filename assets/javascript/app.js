

    
var yourChoice = "none";
var opponentChoices = ["rock", "paper", "scissors"];
var theirChoice;
var opPic = "";
var uPic = "";
var winCount = 0;
var lossCount = 0;
var tieCount = 0;

function rock() {
    yourChoice = "rock";
    console.log(yourChoice);
    shoot();
    uPic = "assets/images/rock2.jpg"
    imgChange();
}
function paper() {
    yourChoice = "paper";
    console.log(yourChoice);
    shoot();
    uPic = "assets/images/paper2.jpg";
    imgChange();
}
function scissors() {
    yourChoice = "scissors";
    console.log(yourChoice);
    shoot();
    uPic = "assets/images/scissors2.jpg";
    imgChange();
}
function shoot() {
    theirChoice = opponentChoices[Math.floor(Math.random()*3)];
    console.log(theirChoice);
    switch (theirChoice) {
      case "rock":
        opPic = "assets/images/rock2.jpg";
        break;
      case "scissors":
        opPic = "assets/images/scissors2.jpg";
        break;
      case "paper":
        opPic = "assets/images/paper2.jpg";
        break;
    }
    if (yourChoice === theirChoice) {
        console.log("you: " + yourChoice + " them: " + theirChoice + " tied");
        $("#headLine").html("It's a TIE");
        tieCount++;
    } else if (yourChoice === "rock" && theirChoice === "scissors") {
        console.log("you: " + yourChoice + " them: " + theirChoice + " you won");
        $("#headLine").html("You Won!!!!");
        winCount++;
    } else if (yourChoice === "paper" && theirChoice === "rock") {
        console.log("you: " + yourChoice + " them: " + theirChoice + " you won");
        $("#headLine").html("You Won!!!!");
        winCount++;
    } else if (yourChoice === "scissors" && theirChoice === "paper") {
        console.log("you: " + yourChoice + " them: " + theirChoice + " you won");
        $("#headLine").html("You Won!!!!");
        winCount++;
    } else {
        console.log("you: " + yourChoice + " them: " + theirChoice + " you lost");
        $("#headLine").html("You Lost...");
        lossCount++;
    }
    $("#win").html("Wins: " + winCount);
    $("#win").append(" - Losses: " + lossCount);
    $("#win").append(" - Ties: " + tieCount);

}
function imgChange() {
    $("#yourPic").attr("src", uPic);
    $("#opponentPic").attr("src", opPic);
}