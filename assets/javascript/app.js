
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
var name1 = "nobody";
var name2 = "nobody";
var nameArray = ["Dante", "Rocco", "Giana", "Kaira", "Verena", "Aldis", "Primrose", "Rosabel", "Suri", "Zelda", "Nova", "Taj", "Evelina", "Cosimia", "Krishna", "Alegra", "Kenji"];
var myName = "";
var computerChoices = ["rock", "paper", "scissors", "lizard", "spock"];
var computerChoice = "x";
var picOne = "";
var picTwo = "";
var p1winCount = 0;
var p1lossCount = 0;
var p1tieCount = 0;
var p2winCount = 0;
var p2lossCount = 0;
var p2tieCount = 0;
var countclicks = 0;
var computer = false;
var cwin = 0;
var closs = 0;
var ctie = 0;
var userNow = firebase.auth().currentUser;
var n2 = false;
var n1 = false;
var emailSent = false;
var pclassArray = ["p2", "p1"];
var runafter1change = true;
var choice1 = "x";
var choice2 = "x";
var startimg = "assets/images/placeholder.jpeg";
var emailArray = ["<br>Waiting for email Verification...", "<br>Waiting for email Verification.....", "<br>Waiting for email Verification.......", "<br>Waiting for email Verification.........", "<br>Waiting for email Verification...........", "<br>Waiting for email Verification.............", "<br>Waiting for email Verification..............."]
var messageArray = ["Start Chat:<br>"];
//---------------------------------------------------------------
// set listner values
var player2Ref = dataRef.ref('player2');
var playerRef = dataRef.ref('player1');
var choice1Ref = dataRef.ref('choice1');
var choice2Ref = dataRef.ref('choice2');
var user1Ref = dataRef.ref('userone');
var user2Ref = dataRef.ref('usertwo');
var pic1Ref = dataRef.ref('opPic');
var pic2Ref = dataRef.ref('uPic');
var messageRef = dataRef.ref().child("message");

//---------------------------------------------------------------
// check key firebase data values before login

 //console.log("check firebase values before login");
    // is there a player one?
    playerRef.on('value', function(snapshot) {
        n1 = snapshot.val();
      //console.log("updating n1 from firebase: " + n1);
     });
    // is there a player two?
    player2Ref.on('value', function(snapshot) {
        n2 = snapshot.val();
      //console.log("updating n2 from firebase: " + n2);
    });
//---------------------------------------------------------------
    //update player one name.
    user1Ref.on('value', function(snapshot) {
      //console.log(snapshot.val());
        name1 = snapshot.val();
        $("#p1").html(name1);
      //console.log("updating user1 from firebase to: " + name1);
    });
    // update player 2 name.
    user2Ref.on('value', function(snapshot) {
        name2 = snapshot.val();
        $("#p2").html(name2);
      //console.log("updating user2 from firebase to: " + name2);
    });
//---------------------------------------------------------------   
    //update player 1 choice for game.
   choice1Ref.on('value', function(snapshot) {
      choice1 = snapshot.val();
      if (n1) {
        shoot();
      }
    });
    //update player 2 choice for game.
    choice2Ref.on('value', function(snapshot) {
      choice2 = snapshot.val();
      if (n2) {
        shoot();
      }
    });
//----------------------------------------------------------------  
    //update player 1 picture
    pic1Ref.on('value', function(snapshot) {
      console.log(snapshot.val());
      picOne = snapshot.val();
      imgChange();
    });
    // update player 2 picture.
    pic2Ref.on('value', function(snapshot) {
      console.log(snapshot.val());
      picTwo = snapshot.val();
      imgChange();
    });
//-----------------------------------------------------------------
// update chat
    messageRef.on('value', function(snapshot) {
      messageArray = snapshot.val();
      //console.log(messageArray);
      $(".myChat").empty();
      for (i=0; i < messageArray.length; i++) {
        $(".myChat").prepend(messageArray[i]);
      }
      
    })


//-----------------------------------------------------------------
    // Get Elements
    const txtName = $("#name")[0];
    const txtEmail = $("#email")[0];
    const txtPassword = $("#password")[0];
    const btnLogin = $("#login")[0];
    const btnSignUp = $("#signup")[0];
    const btn1Logout = $("#logout1")[0];
    const btn2Logout = $("#logout2")[0];

//-----------------------------------------------------------------
// add sign out event
// player 1 logout
    btn1Logout.addEventListener("click", e => {
      
      if (n1) {
        n1 = false;
        $("#logout1").css("display", "none");
        $(".loggedIn").css("display", "none");
        $(".loggedIn").html("");
        var tempMessage = name1 + " has left the game.<br>"
        messageArray = [tempMessage];
        dataRef.ref().update({
          player1: n1,
          message: messageArray
        });
        //console.log("updated player1 to firebase as false");
      }
      userAuth.signOut();
      mylogOut();
     });
// player 2 logout
    btn2Logout.addEventListener("click", e => {
      
      if (n2) { 
        n2 = false;
        $("#logout2").css("display", "none");
        $(".loggedIn").css("display", "none");
        var tempMessage = name2 + " has left the game.<br>"
        messageArray = [tempMessage];
        $(".loggedIn").html("");
        dataRef.ref().update({
          player2: n2,
          message: messageArray
        });
        //console.log("updated player2 to firebase as false");
      }
      userAuth.signOut();
      mylogOut();
     });
//-----------------------------------------------------------------
    //add login event
    btnLogin.addEventListener("click", e=> {
      // get email name & password
      const email = txtEmail.value;
      const pass = txtPassword.value;
      const name = txtName.value;
      const promise = userAuth.signInWithEmailAndPassword(email, pass);
      //signin
      promise.catch(function (e) {
        //console.log(e.message);
        $(".exception").css("display", "block");
        $(".error").html("<p>" + e.message + "</p>");
        $(".error").append("Please try again or press signup if you are a new user.");
      });
    });
//-----------------------------------------------------------------
    //add signup event
    btnSignUp.addEventListener("click", e => {
        //get email and password
        emailSent = false;
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const name = txtName.value;
        const auth = firebase.auth();
        var leng = pass.length;
        // Sign In
        if (leng > 5) {
          const promise = auth.createUserWithEmailAndPassword(email, pass);
          promise.catch(function (e) {
            //console.log(e.message);
            $(".exception").css("display", "block");
            $(".error").html("<p>" + e.message + "</p>");
            $(".error").append("Please try again or press signup if you are a new user.");
          });
        } else {
            (".exception").css("display", "block");
            $(".error").append("Your password must be at least 6 characters long. Please try again.");
        }
    });
    
//-----------------------------------------------------------------    
// when authorizied user state changes
  userAuth.onAuthStateChanged(firebaseUser => {
    
    //console.log(firebaseUser);
    // if logged in:
    if (firebaseUser){ 
        //console.log("n2: " + n2 + " n1: " + n1 + " name: " + name);
        firebaseUser.updateProfile({
        displayName: name});
        // check to see if email is verified
      if (!firebaseUser.emailVerified) {
          verifyEmail(firebaseUser);
          //console.log("email Sent");
          emailSent = true;
      } else { mylogIn();} 
      // if email is sent check every second to see if verified
      if (emailSent){
          var z = 0;

          setIntervalX(function () {
              $(".email").html(emailArray[z]);
              z++;
              if (z >= emailArray.length) { z = 0; }
              firebaseUser.reload();
              if (firebaseUser.emailVerified) {
                  window.clearInterval(intervalID);
                  $(".email").html("");
                  $(".error").html("");
                  $(".exception").css("display", "none");
                  mylogIn();
                  //console.log("Email Verified!"); 
              }
          }, 2000, 60);
      } // end signin tasks
    }//end if logged in
    //if not a firebase user
    else if (!firebaseUser){
        //set up to log user in
        mylogOut(); // turn off game and allow login
    } 
    
  });
//-----------------------------------------------------------------
// turn on game display and turn off setup but allow logout
function mylogIn () {
  setPlayers();
  $(".mynav").css("display", "inline");
  $(".mygame").css("display", "inline");
  $(".setup").css("display", "none");
  $(".player").css("display", "inline");
  
  if (!n2) {
    resetGame();
    n2 = true;
    name2 = $("#name").val().trim();
    name1 = "no one yet.."
    $(".loggedIn").css("display", "inline");
    $(".loggedIn").html(name2 + " (logged in)");
    if (name2 === "") {
          namePick();
          name2 = myName;
        }
    $("#logout2").css("display", "inline");
    $("#logout1").css("display", "none");
    $("#textBtn2").css("display", "inline");
    $("#textBtn1").css("display", "none");
    messageArray = ["Waiting for another player...<br>"];
    console.log("setting initial values in firebase.")
    dataRef.ref().set({
        player2: n2,
        player1: n1,
        choice2: choice2,
        choice1: choice1,
        uPic: startimg,
        opPic: startimg,
        usertwo: name2,
        userone: name1,
        message: messageArray
      });
    displayPlayer2 ();
    signupIn ();}

  else if (!n1) {
    resetGame ();
    n1 = true;
    name1 = $("#name").val().trim();
    $(".loggedIn").css("display", "inline");
    $(".loggedIn").html(name1 + " (logged in)");
    $("#textBtn2").css("display", "none");
    $("#textBtn1").css("display", "inline");
    if (name1 === "") {
          namePick();
          name1 = myName;
        }
    messageArray = ["Start Chat:<br>"];
    dataRef.ref().update({
        player1: n1,
        userone: name1,
        message: messageArray
    });
    $("#logout2").css("display", "none");
    $("#logout1").css("display", "inline");
    displayPlayer1 ();
    signupIn();}
  else {
    $("#status").html("There are already 2 people playing. Please wait or choose to play the computer.");
  }
}
//-----------------------------------------------------------------
//clear login fields
function clearFields () {
  $("#name").html("");
  $("#email").html("");
  $("#password").html("");
  //console.log("clear input fields");
}
//-----------------------------------------------------------------
// run messaging here 
// note: use id text to display, id mytext to get input, onclick id textbtn 
function startMessage() {
  $("#textBtn1").on("click", function message(chat) {
    event.preventDefault();
    var currentMessage = name1 + ": " + $("#mytext").val().trim() + "<br>";
    //console.log(name1 + ": " + $("#mytext").val().trim());
    $("#mytext").html(" ");
    messageArray.push(currentMessage);
    dataRef.ref().update({
      message: messageArray
    });
  });
  $("#textBtn2").on("click", function message(chat) {
    event.preventDefault();
    var currentMessage = name2 + ": " + $("#mytext").val().trim() + "<br>";
    //console.log(name2 + ": " + $("#mytext").val().trim());
    $("#mytext").html("");
    messageArray.push(currentMessage);
    dataRef.ref().update({
      message: messageArray
    });

  });
}
//-----------------------------------------------------------------
// turn off game display and turn on signin, turn off logout
function mylogOut () {
  $(".mygame").css("display", "none");
  $(".setup").css("display", "inline");
  $(".player").css("display", "none");
}
//-----------------------------------------------------------------
// send verification email
function verifyEmail (user) {
    user.sendEmailVerification().then(function() {
        $(".exception").css("display", "block");
        $(".error").html("<p>Verification Email Sent.<br>Please verify your account to continue.</p>");
        $(".error").append("Once Your Email Account is verified, the Game will load automatically.");
    // Email sent.
    },  function(error) {
          $(".exception").css("display", "block");
          $(".error").html("<p>" + error + "</p>");
          $(".error").append("Please check your email address and press 'SIGNUP' Again.");
        });
}
//-----------------------------------------------------------------
// set firebase data and user names for gameplay
function signupIn () {
    //console.log("set up database in signin function");
    clearFields();
    setPlayers();
    if (computer) {
      $("#status").html("Ready to Play");
      name1 = "Computer"
      setPlayers();
    }else if (n2 && !n1) {
      $("#status").html("Waitng for player another player");
    }else if (n1 && n2) {
      $("#status").html("Let's PLAY!");
    }else {
      $("#status").html("Waitng for player another player");
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
  $('.exception').css("display", "none");
}
//-----------------------------------------------------------------
// if player 2 selects rock set choice
function rock2() {
    choice2 = "rock";
    picTwo = "assets/images/rock.jpg";
    console.log(choice2+ " pic2: " + picTwo);
    dataRef.ref().update({
        choice2: choice2
      });
    if (computer) {
      compShoot();
    }
}
// if player 1 selects rock set choice
function rock1() {
    choice1 = "rock";
    picOne = "assets/images/rock.jpg";
    console.log(choice1 + " pic: " + picOne);
    dataRef.ref().update({
        choice1: choice1
      });
}
//-----------------------------------------------------------------
// if player 2 selects paper set choice
function paper2() {
    choice2 = "paper";
    picTwo = "assets/images/paper.jpg";
    console.log(choice2 + " Pic2: " + picTwo);
    dataRef.ref().update({
        choice2: choice2 
      });
    if (computer) {
      compShoot();
    }
}
// if player 1 selects paper set choice
function paper1() {
    choice1 = "paper";
    picOne = "assets/images/paper.jpg";
    console.log(choice1 + " pic: " + picOne);
    dataRef.ref().update({
        choice1: choice1
      });
}
//-----------------------------------------------------------------
// if player 2 selects scissors set choice
function scissors2() {
    choice2 = "scissors";
    picTwo = "assets/images/scissors2.jpg";
    console.log(choice2 + " pic2: " +picTwo);
    dataRef.ref().update({
        choice2: choice2
      });
    if (computer) {
      compShoot();
    }
}
// if player 1 selects scissors set choice
function scissors1() {
    choice1 = "scissors";
    picOne = "assets/images/scissors2.jpg";
    console.log(choice1 + " pic1: " + picOne);
    dataRef.ref().update({
        choice1: choice1, 
      });
}
//-----------------------------------------------------------------
// if player 2 selects lizard set choice
function lizard2() {
    choice2 = "lizard";
    picTwo = "assets/images/lizard.jpg";
    console.log(choice2 + " pic2: " +picTwo);
    dataRef.ref().update({
        choice2: choice2
      });
    if (computer) {
      compShoot();
    }
}
// if player 1 selects lizard set choice
function lizard1() {
    choice1 = "lizard";
    picOne = "assets/images/lizard.jpg";
    console.log(choice1 + " pic1: " + picOne);
    dataRef.ref().update({
        choice1: choice1, 
      });
}
//-----------------------------------------------------------------
// if player 2 selects spock set choice
function spock2() {
    choice2 = "spock";
    picTwo = "assets/images/spock.jpg";
    console.log(choice2 + " pic2: " +picTwo);
    dataRef.ref().update({
        choice2: choice2
      });
    if (computer) {
      compShoot();
    }
}
// if player 1 selects spock set choice
function spock1() {
    choice1 = "spock";
    picOne = "assets/images/spock.jpg";
    console.log(choice1 + " pic1: " + picOne);
    dataRef.ref().update({
        choice1: choice1, 
      });
}
//-----------------------------------------------------------------
// update players 1 win/loss/tie stats to screen
function updatep1Stats () {
    $("#player1").html("<h3>Wins: " + p1winCount + "</h3><br>");
    $("#player1").append("<h3>Losses: " + p1lossCount + "</h3><br>");
    $("#player1").append("<h3>Ties: " + p1tieCount + "</h3>");
}
//-----------------------------------------------------------------
// update player 2 win/loss/tie stats to screen
function updatep2Stats () {
    $("#player2").html("<h3>Wins: " + p2winCount + "</h3><br>");
    $("#player2").append("<h3>Losses: " + p2lossCount + "</h3><br>");
    $("#player2").append("<h3>Ties: " + p2tieCount + "</h3>");
}
//-----------------------------------------------------------------
// update computer win/loss/tie stats to screen
function updatecompStats () {
    $("#player1").html("<h3>Wins: " + cwin + "</h3><br>");
    $("#player1").append("<h3>Losses: " + closs + "</h3><br>");
    $("#player1").append("<h3>Ties: " + ctie + "</h3>");
}
//-----------------------------------------------------------------
// have the computer randomly pick a response
function computerPick () {
  var temp;
    do {
      temp = computerChoices[Math.floor(Math.random()*10)];
    }
    while  (temp > 5);
    computerChoice = temp;
    //console.log(computerChoice);
}
//-----------------------------------------------------------------
// pick random name for person if they don't provide one
function namePick () {
    myName = nameArray[Math.floor(Math.random()*17)];
    //console.log(myName);
}
//-----------------------------------------------------------------
//set up a interval timer
var intervalID;
function setIntervalX(callback, delay, repetitions) {
    var y = 0;
    intervalID = window.setInterval(function () {
       callback();
       if (++y === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
}
//-----------------------------------------------------------------
//run logic to play locally against the computer & update screen
function compShoot() {
  //console.log("running computer shoot")
    if (computer) {
      computerPick ();
    
      switch (computerChoice) {
        case "rock":
          picOne = "assets/images/rock.jpg";
          break;
        case "scissors":
          picOne = "assets/images/scissors2.jpg";
          break;
        case "paper":
          picOne = "assets/images/paper.jpg";
          break;
        case "lizard":
          picOne = "assets/images/lizard.jpg";
          break;
        case "spock":
          picOne = "assets/images/spock.jpg";
          return;
      }
      imgChange();
      if (computerChoice === choice2) {
          //console.log("you (right): " + choice2 + " them(left): " + choice1 + " tied");
          $("#status").html("It's a TIE");
          ctie++;
          p2tieCount++;

        } else if (computerChoice === "rock" && (choice2 === "scissors" || choice2 === "lizard")) {
            //console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
            $("#status").html("You Lost...");
            cwin++;
            p2lossCount++;

        } else if (computerChoice === "paper" && (choice2 === "rock" || choice2 === "spock")) {
            //console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
            $("#status").html("You Lost ...");
            cwin++;
            p2lossCount++;

        } else if (computerChoice === "scissors" && (choice2 === "paper" || choice2 === "lizard")) {
            //console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
            $("#status").html("You Lost ...");
            cwin++;
            p2lossCount++;

        } else if (computerChoice === "lizard" && (choice2 === "paper" || choice2 === "spock")) {
            //console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
            $("#status").html("You Lost ...");
            cwin++;
            p2lossCount++;
        } else if (computerChoice === "spock" && (choice2 === "rock" || choice2 === "scissors")) {
            //console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
            $("#status").html("You Lost ...");
            cwin++;
            p2lossCount++;
        } else {
            //console.log("you (right): " + choice2 + " them(left): " + choice1 + " you lost");
            $("#status").html("You Won!!!!");
            closs++;
            p2winCount++;
      }
      updatecompStats();
      updatep2Stats();
    } 
}
//---------------------------------------------------------------
// run game logic for 2 player game and update screen
var a = 0;
function shoot() {
    console.log("running shoot")
    if ((choice1 != "x") && (choice2 != "x") && (n1 === true) && (n2 ===true)) {
      console.log("in Shoot picOne = " + picOne + " picTwo = " + picTwo);
      dataRef.ref().update({
        uPic: picTwo,
        opPic: picOne
      });
      console.log("updating pic 1: " + picOne);
      console.log("updating pic 2: " + picTwo);
      
      if (choice1 === choice2) {
          //console.log("you (right): " + choice2 + " them(left): " + choice1 + " tied");
          $("#status").html("It's a TIE");
          p1tieCount++;
          p2tieCount++;
          ctie++;

        } else if (choice1 === "rock" && (choice2 === "scissors" || choice2 === "lizard")) {
            //console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
            $("#status").html(name1 + " Won!!! -- "+ name2 +" Lost...");
            p1winCount++;
            p2lossCount++;

        } else if (choice1 === "paper" && (choice2 === "rock" || choice2 === "spock")) {
            //console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
            $("#status").html(name1 + " Won!!!! -- " + name2 + " Lost ...");
            p1winCount++;
            p2lossCount++;

        } else if (choice1 === "scissors" && (choice2 === "paper" || choice2 === "lizard")) {
            //console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
            $("#status").html(name1 + " Won!!!! -- " + name2 + " Lost ...");
            p1winCount++;
            p2lossCount++;

        } else if (choice1 === "lizard" && (choice2 === "paper" || choice2 === "spock")) {
            //console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
            $("#status").html(name1 + " Won!!!! -- " + name2 + " Lost ...");
            p1winCount++;
            p2lossCount++;

        } else if (choice1 === "spock" && (choice2 === "rock" || choice2 === "scissors")) {
            //console.log("you (right): " + choice2 + " them(left): " + choice1 + " you won");
            $("#status").html(name1 + " Won!!!! -- " + name2 + " Lost ...");
            p1winCount++;
            p2lossCount++;

        } else {
            //console.log("you (right): " + choice2 + " them(left): " + choice1 + " you lost");
            $("#status").html(name1 + " Lost... -- "+ name2 +" Won!!!!");
            p1lossCount++;
            p2winCount++;
            cwin++;
      }
      updatep1Stats();
      updatep2Stats();
      dataRef.ref().update({
          choice1: "x",
          choice2: "x"
        });
      countclicks = 0;
    } else {
        //console.log("running else on shoot, a = " + a);
        if (a === 3) {
          //console.log("inside if, a = " + a);
          if (countclicks >= 5) { countclicks = 0;}
          var waitArray = ["Waiting for the Other Player...", "STILL Waiting for the Other Player...", "Yes, You are really WAITING for the Other Player", "Impatient are we? We're Still Waiting...", "Honestly, I don't know why they can't make a choice, <br>Text Them already!"];
          $("#status").html(waitArray[countclicks]);
          countclicks++;
          a = 0;
        } else { a++; }
    }
}
//-----------------------------------------------------------------

function resetGame() {
  console.log("running reset");
  a = 0;
  countclicks = 0;
  p2winCount = 0;
  p2lossCount = 0;
  p2tieCount = 0;
  p1winCount = 0;
  p1lossCount = 0;
  p1tieCount = 0;
  cwin = 0;
  closs = 0;
  ctie = 0;
  picOne = startimg;
  picTwo = startimg;
  choice1 = "x";
  choice2 = "x";
  console.log("updating choice1, choice2, picOne, picTwo");
  dataRef.ref().update({
    choice1: choice1,
    choice2: choice2,
    uPic: picTwo,
    opPic: picOne
  });
  
  updatep2Stats();
  if (computer) {
    name1 = "Computer";
    updatecompStats();
  }else updatep2Stats();

}
//-----------------------------------------------------------------
// update choice pictures so you may see what your opponent chose.
function imgChange() {
    $("#yourPic").attr("src", picTwo);
    $("#opponentPic").attr("src", picOne);
}
//-----------------------------------------------------------------
// check to see if they are playing the computer or another player
function check() {
  // set listener on checkbox
  $('input[type="checkbox"]').on('change', function() {
    //only allow one checkbox to be clicked
    $('input[type="checkbox"]').not(this).prop('checked', false);
    // set boolean for computer
    computer = $("#computercheck").prop('checked');
    //console.log("check function: Computer?: " +computer + " 2 player?: " + p1);
    if (computer && !n1) {
      name1 = "Computer";
    }
  });
    //console.log("check function end: computer: " + computer + "player 1 name: " + name1 + " Player 2: " + name1);
}

//-----------------------------------------------------------------
// create game buttons, one set for each player
var bArray = ["rock2", "rock1", "paper2", "paper1", "scissors2", "scissors1", "lizard2", "lizard1", "spock2", "spock1"];
var vArray = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];
function createButtons () {
    var k = 0;
    var j = 0;
    for (i=0;i < bArray.length;i++) {
      if (i === 2 || i === 4 || i === 6 || i === 8) {j = 0;}
      $(".gamebuttons").append('<button id="' + bArray[i] + '" class="btn-primary mysize-btn mygame ' + pclassArray[j] + '" value="' + computerChoices[k] + '">' + vArray[k] + '</button>');
      j++;
      if (i === 1 || i === 3 || i === 5 || i === 7) {k++;}
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
  $("#lizard2").on("click", function () {lizard2();});
  $("#lizard1").on("click", function () {lizard1();});
  $("#spock2").on("click", function () {spock2();});
  $("#spock1").on("click", function () {spock1();});
}
//-----------------------------------------------------------------
// display players names
function setPlayers () {
  //console.log("display players names p1: "+name1+ " p2: "+name2);
  $("#p1").html(name1);
  $("#p2").html(name2);
  if (computer) {
    $("#text").css("display", "none");
  }
}
//-----------------------------------------------------------------
// once loaded stet up game
$(document).ready( function startGame() {
    $('#p1check').prop('checked', true);
    check();
    startMessage();
    createButtons();
    setButtons();
});
