

var name1 = "Nobody";
var name2 = "Me";   
var yourChoice = "none";
var opponentChoices = ["rock", "paper", "scissors"];
var theirChoice;
var opPic = "";
var uPic = "";
var p1winCount = 0;
var p1lossCount = 0;
var p1tieCount = 0;
var p2winCount = 0;
var p2lossCount = 0;
var p2tieCount = 0;
var computer = false;
var p1 = false;
var cwin = 0;
var closs = 0;
var ctie = 0;

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
function updateStats () {
    $("#win").html("Wins: " + p2winCount);
    $("#win").append(" - Losses: " + p2lossCount);
    $("#win").append(" - Ties: " + p2tieCount);
}
function computerPick () {
    theirChoice = opponentChoices[Math.floor(Math.random()*3)];
    console.log(theirChoice);
}

function shoot() {
    if (computer) {
      computerPick ();
    }
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
        $("#status").html("It's a TIE");
        p1tieCount++;
        p2tieCount++;
        ctie++;
    } else if (yourChoice === "rock" && theirChoice === "scissors") {
        console.log("you: " + yourChoice + " them: " + theirChoice + " you won");
        $("#status").html("You Won!!!!");
        p2winCount++;
        closs++;
    } else if (yourChoice === "paper" && theirChoice === "rock") {
        console.log("you: " + yourChoice + " them: " + theirChoice + " you won");
        $("#status").html("You Won!!!!");
        p2winCount++;
        closs++;
    } else if (yourChoice === "scissors" && theirChoice === "paper") {
        console.log("you: " + yourChoice + " them: " + theirChoice + " you won");
        $("#status").html("You Won!!!!");
        p2winCount++;
        closs++;
    } else {
        console.log("you: " + yourChoice + " them: " + theirChoice + " you lost");
        $("#status").html("You Lost...");
        p2lossCount++;
        cwin++;
    }
    updateStats();
}

function resetGame() {
  p2winCount = 0;
  p2lossCount = 0;
  p2tieCount = 0;
  opPic = "";
  uPic = "";
  yourChoice = "none";
  imgChange();
  updateStats();

}
function imgChange() {
    $("#yourPic").attr("src", uPic);
    $("#opponentPic").attr("src", opPic);
}

function check() {
  $('input[type="checkbox"]').on('change', function() {
    $('input[type="checkbox"]').not(this).prop('checked', false);
    computer = $("#computercheck").prop('checked');
    p1 = $("#p1check").prop('checked');
    console.log("Computer: " +computer + " Player 2: " + p1);
    name1 = "Computer";
  });
    console.log("computer: " + computer + " Player 2: " + p1);
}



function setButtons() {
  $("#rock").on("click", function () {rock();});
  $("#paper").on("click", function () {paper();});
  $("#scissors").on("click", function() {scissors();});
  $("#reset").on("click", function () {resetGame();});
}
function setPlayers () {
  $("#p1").html(name1);
  $("#p2").html(name2);
}
function inputNames() {
  $("#submit").on("click", function () {
    name2 = $("#name").val().trim();
    check();
    $(".player").css("display", "inline");
    $(".mygame").css("display", "inline");
    if (!computer) {
      alert("There is no one to play!");
      $("#name").empty();
      $("#email").empty();
      $(".player").css("display", "none");
      $(".mygame").css("display", "none");
      inputNames();
    }
    else {
      $(".setup").css("display", "none");
      setPlayers();
    }
  });
}

$(document).ready( function runGame() {
    check();
    inputNames();
    resetGame();
    imgChange();
    setButtons();
 
});

