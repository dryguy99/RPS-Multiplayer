
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBVJQT-3Q7kuy7KCg8rS7LOx8s1VAe5-lo",
    authDomain: "rps-multiplayer-bcafb.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-bcafb.firebaseio.com",
    storageBucket: "rps-multiplayer-bcafb.appspot.com",
    messagingSenderId: "1015633302315"
  };

  firebase.initializeApp(config);
  var dataRef = firebase.database();
  var userAuth = firebase.auth();
//-----------------------------------------------------------------
// set initial variables
var name1 = "Nobody";
var name2 = "Me";   
var yourChoice = "";
var computerChoices = ["rock", "paper", "scissors"];
var opponentChoice = "";
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
var p1 = true;
var cwin = 0;
var closs = 0;
var ctie = 0;
var players = 2;
var userNow = firebase.auth().currentUser;
var n2 = false;
var n1 = false;
var bothpick = false;
var emailSent = false;
var twoPlayers = false;
var pclassArray = ["p2", "p1"];
var runafter1change = true;
var choice1 = "x";
var choice2 = "x";

var playerRef = dataRef.ref('twoPlayers');
var player2Ref = dataRef.ref('player2');
var bothpicRef = dataRef.ref('bothpick');
var choice1Ref = dataRef.ref('choice1');
var choice2Ref = dataRef.ref('choice2');
var twoPlayersRef = dataRef.ref('twoPlayers');
// check key data values before login
    bothpicRef.on('value', function(snapshot) {
      bothpick = snapshot.val();
      if (bothpick) {
        shoot();
        bothpick = false;
      }
    });

    twoPlayersRef.on('value', function(snapshot) {
      twoPlayers = snapshot.val();
    });

    choice1Ref.on('value', function(snapshot) {
      choice1 = snapshot.val();
      if (twoPlayers) {
          shoot();}
    });

    choice2Ref.on('value', function(snapshot) {
      choice2 = snapshot.val();
      if (twoPlayers) {
          shoot();}
    });

    console.log("check firebase values before login");

    playerRef.on('value', function(snapshot) {
      resetGame();
      console.log("checked twoPlayers value");
    });

    player2Ref.on('value', function(snapshot) {
      if (snapshot.val()) {
        n2 = snapshot.val();}
      console.log("updating n2 from firebase: " + n2);
    });

//-----------------------------------------------------------------

// allow signin with google
      //var provider = new firebase.auth.GoogleAuthProvider();
      //userAuth.signInWithRedirect(provider);
//-----------------------------------------------------------------
    //
    /*userAuth.getRedirectResult().then(function(result) {
      console.log("redirect");
      if (result.credential) {
       // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      console.log("Token: " + token);
      // ...
      }
      // The signed-in user info.
      var user = result.user;
      }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      });*/
//-----------------------------------------------------------------
    // Get Elements
    const txtName = $("#name")[0];
    const txtEmail = $("#email")[0];
    const txtPassword = $("#password")[0];
    const btnLogin = $("#login")[0];
    const btnSignUp = $("#signup")[0];
    const btnLogout = $("#logout")[0];

  if (userAuth.user) {
    mylogIn();
  }
//-----------------------------------------------------------------
// add sign out event
    btnLogout.addEventListener("click", e => {
      userAuth.signOut();
      
      if (n1) {
        n1 = false;}
      else { 
        n2 = false;
        dataRef.ref().update({
          player2: n2});
        console.log("updated player2 to firebase as false");
      }
      mylogOut();
     });

    //add login event
    btnLogin.addEventListener("click", e=> {
      // get email name & password
      const email = txtEmail.value;
      const pass = txtPassword.value;
      const name = txtName.value;
      //const auth = firebase.auth();
      const promise = userAuth.signInWithEmailAndPassword(email, pass);
      //signin
      promise.catch(e => console.log(e.message));
    });
//-----------------------------------------------------------------
    //add signup event
    btnSignUp.addEventListener("click", e => {
        //get email and password
        // TODO: Check 4 real emails
        emailSent = false;
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const name = txtName.value;
        const auth = firebase.auth();
        //const user = 
        // Sign In
        const promise = auth.createUserWithEmailAndPassword(email, pass);
        promise.catch(e => console.log(e.message));
    });
//-----------------------------------------------------------------    
// when authorizied user state changes
  userAuth.onAuthStateChanged(firebaseUser => {
    
      console.log(firebaseUser);
      // if logged in:
      if (firebaseUser){ 
        console.log("n2: " + n2);
        firebaseUser.updateProfile({
        displayName: name});
        
        // check to see if email is verified
        // temporarilyh disabled for testing
        /*if (!firebaseUser.emailVerified) {
          verifyEmail();
          console.log("email Sent");
          emailSent = true;
        }
        else { mylogIn(); }*/
        mylogIn(); // need  to delete after reinstating email verification
        runafter1change = false;
        // if email is sent check every second to see if verified
        if (emailSent){
          var mytimer = setInterval(function() {
            firebase.auth().currentUser.reload();
            if (firebase.auth().currentUser.emailVerified) {
              console.log("Email Verified!");
              mylogIn();
              myStopFunction(mytimer);
            }
          }, 1000);
        }
       // end login tasks
        //if logged out
        else if (!firebaseUser){
          //set up to log user in
          mylogOut(); // turn off game and allow login
          }
      }
        
  });


//-----------------------------------------------------------------
// turn on game display and turn off setup but allow logout
function mylogIn () {
  $(".mynav").css("display", "inline");
  $(".mygame").css("display", "inline");
  $(".setup").css("display", "none");
  yourChoice = "";
  
  if (!n2) {
    n2 = true;
    name2 = $("#name").val().trim();
    signupIn ();}

  else if (!computer) {
    n1 = true;
    name1 = $("#name").val().trim();
    signupIn();}
}
//-----------------------------------------------------------------

function clearFields () {
  $("#name").html("");
  $("#email").html("");
  $("#password").html("");
  console.log("clear input fields");
}


//-----------------------------------------------------------------
// turn off game display and turn on signin, turn off logout
function mylogOut () {
  $(".mygame").css("display", "none");
  $(".setup").css("display", "inline");
  $(".player").css("display", "none");
  if (players < 2) {
    players++;
  }
}
//-----------------------------------------------------------------
// stop interval timer
function myStopFunction() {
    clearInterval(mytimer);
    break;
}
//-----------------------------------------------------------------
// send verification email
function verifyEmail () {
  //checkemail = userNow.emailVerified;
  //if (checkemail === null) 
      var user = userAuth.currentUser;
      user.sendEmailVerification().then(function() {
          alert("Verification Email Sent.  Please verify your account to continue.");

          // Email sent.
          }, function(error) {
          alert(error); // still need to deal with errors
      });
}


//-----------------------------------------------------------------
// set player names and set up database
/*function signupIn () {
  console.log("before if,then: " + name2 + " " + name1);
  if (players === 1) {
    console.log("during player 1 if,then: " + name2 + " " + name1);
    players = 0;
    n1 = true;
    setDatabaseUp();
  }
  else if (players === 2) {
    console.log("during player 2 if,then: " + name2 + " " + name1);
    players--;
    n2 = true;
    console.log("run set up database");
    setDatabaseUp();
  }
  else { alert("There are already 2 players playing! Please wait for one to finish.");}
}
*/

//-----------------------------------------------------------------
function signupIn () {
    console.log("set up database in signin function");
    clearFields();
    dataRef.ref().set({
        bothpick: bothpick,
        twoPlayers: false,
        player2: n2,
        player1: n1
      });
    console.log("bothpick set in signup 268");
    
    if (n1) {
      twoPlayers = true;
      dataRef.ref().update({
        userone: name1,
        choice1: opponentChoice,
        opPic: opPic,
        twoPlayers: twoPlayers
      });
      console.log("setup player 1: " + name1 + " 279");
      displayPlayer1 ();
      setPlayers();
    }
    else if (n2) {
      dataRef.ref().update({
        choice2: yourChoice,
        uPic: uPic,
        usertwo: name2
      });
      console.log("setup player 2: " + name2 + " 288");
      displayPlayer2 ();
    }

}
//-----------------------------------------------------------------
//  turn on player 2 buttons and turn off player 1 buttons
function displayPlayer2 () {
  $(".p2").css("display", "inline");
  $(".p1").css("display", "none");
}
// turn on player 21 buttons and turn off player 2 buttons
function displayPlayer1 () {
  $(".p1").css("display", "inline");
  $(".p2").css("display", "none");
}
//-----------------------------------------------------------------


function rock2() {
    yourChoice = "rock";
    console.log(yourChoice);
    dataRef.ref().update({
        choice2: yourChoice,
        uPic: "assets/images/rock2.jpg"
      });
    shoot();
    imgChange();
}

function rock1() {
    opponentChoice = "rock";
    console.log(opponentChoice);
    dataRef.ref().update({
        choice1: opponentChoice,
        opPic: "assets/images/rock2.jpg"
      });
    shoot();
    imgChange();
}
//-----------------------------------------------------------------

function paper2() {
    yourChoice = "paper";
    console.log(yourChoice);
    dataRef.ref().update({
        choice2: yourChoice,
        uPic: "assets/images/paper2.jpg"
      });
    shoot();
    imgChange();
}

function paper1() {
    opponentChoice = "paper";
    console.log(opponentChoice);
    dataRef.ref().update({
        choice1: opponentChoice,
        opPic: "assets/images/paper2.jpg"
      });
    shoot();
    imgChange();
}
//-----------------------------------------------------------------

function scissors2() {
    yourChoice = "scissors";
    console.log(yourChoice);
    dataRef.ref().update({
        choice2: yourChoice,
        uPic: "assets/images/scissors2.jpg"
      });
    shoot();
    imgChange();
}

function scissors1() {
    opponentChoice = "scissors";
    console.log(opponentChoice);
    dataRef.ref().update({
        choice1: opponentChoice,
        opPic: "assets/images/scissors2.jpg"
      });
    shoot();
    imgChange();
}
//-----------------------------------------------------------------

function updateStats () {
    $("#win").html("Wins: " + p2winCount);
    $("#win").append(" - Losses: " + p2lossCount);
    $("#win").append(" - Ties: " + p2tieCount);
}
//-----------------------------------------------------------------

function computerPick () {
    theirChoice = computerChoices[Math.floor(Math.random()*3)];
    console.log(theirChoice);
}
//-----------------------------------------------------------------

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
    if (choice1 != "x" && choice2 != "x") {
    if (choice1 === choice2) {
        console.log("you (right): " + choice2 + " them(left): " + choice1 + " tied");
        $("#status").html("It's a TIE");
        p1tieCount++;
        p2tieCount++;
        ctie++;

    } else if (choice1 === "rock" && choice2 === "scissors") {
        console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
        $("#status").html(name1 + "Lost... -- "+ name2 +" Won!!!!");
        p1lossCount++;
        p2winCount++;
        closs++;
    } else if (choice1 === "paper" && choice2 === "rock") {
        console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
        $("#status").html(name1 + " Won!!!! -- " + name2 + " Lost ...");
        p2lossCount++
        p1winCount++;
        closs++;
    } else if (choice1 === "scissors" && choice2 === "paper") {
        console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
        $("#status").html(name1 + " Won!!!! -- " + name2 + " Lost ...");
        p2winCount++;
        closs++;
    } else {
        console.log("you (right): " + choice2 + " them(left): " + choice1 + " you lost");
        $("#status").html(name1 + "Lost... -- "+ name2 +" Won!!!!");
        p1lossCount++;
        p2winCount++;
        cwin++;
    }
    updateStats();
    dataRef.ref().update({
        choice1: "x",
        choice2: "x"
      });
  }
  else {
    $("#status").html("Waiting for Other Player....");
  }
}
//-----------------------------------------------------------------

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
//-----------------------------------------------------------------

function imgChange() {
    $("#yourPic").attr("src", uPic);
    $("#opponentPic").attr("src", opPic);
}
//-----------------------------------------------------------------


function check() {
  $('input[type="checkbox"]').on('change', function() {
    $('input[type="checkbox"]').not(this).prop('checked', false);
    computer = $("#computercheck").prop('checked');
    p1 = $("#p1check").prop('checked');
    console.log("check function: Computer: " +computer + " Player 2: " + p1);
    if (computer) {
      name1 = "Computer";
    }
    else { name1 = "";}
    
  });
    console.log("check function end: computer: " + computer + " Player 2: " + p1);
}

//-----------------------------------------------------------------
// create game buttons, one set for each player
var bArray = ["rock2", "rock1", "paper2", "paper1", "scissors2", "scissors1"];
var vArray = ["Rock", "Paper", "Scissors"];
function createButtons () {
    var k = 0;
    var j = 0;
    for (i=0;i < bArray.length;i++) {
      if (i === 2 || i === 4) {j = 0;}
      $(".gamebuttons").append('<button id="' + bArray[i] + '" class="btn-primary mysize-btn mygame ' + pclassArray[j] + '" value="' + computerChoices[k] + '">' + vArray[k] + '</button>');
      j++;
      if (i === 1 || i === 3) {k++;}
    }
}
//-----------------------------------------------------------------

// set up on click listeners once!
function setButtons() {
  $("#rock2").on("click", function () {rock2();});
  $("#rock1").on("click", function () {rock1();});
  $("#paper2").on("click", function () {paper2();});
  $("#paper1").on("click", function () {paper1();});
  $("#scissors2").on("click", function() {scissors2();});
  $("#scissors1").on("click", function() {scissors1();});
  $("#reset").on("click", function () {resetGame();});
}
var name1Ref = dataRef.ref('userone');
var name2Ref = dataRef.ref('usertwo');

function setPlayers () {

  name1Ref.on('value', function(snapshot) {
      name1 = snapshot.val(); });
  name2Ref.on('value', function(snapshot) {
      name2 = snapshot.val(); });
  $("#p1").html(name1);
  $("#p2").html(name2);
}

//function playGame () {
//  $(".player").css("display", "inline");
// $(".mygame").css("display", "inline");
//}
function runGame() {
    
  }
$(document).ready( function startGame() {
    $('#p1check').prop('checked', true);
    check();
    resetGame();
    imgChange();
    createButtons();
    setButtons();
});

