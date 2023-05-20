const firebaseConfig = {
    apiKey: "AIzaSyA780wrJr1IZ0WKMcD9Z7hS-fhU_x81ck0",
    authDomain: "playermovementstorage.firebaseapp.com",
    databaseURL: "https://playermovementstorage-default-rtdb.firebaseio.com",
    projectId: "playermovementstorage",
    storageBucket: "playermovementstorage.appspot.com",
    messagingSenderId: "334013295605",
    appId: "1:334013295605:web:408e20e9ad3cffd7b18ebc",
    measurementId: "G-2WBJR6ZSMT"
  };
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

var PlayerShell = document.querySelector(".players")
var PlayerID = localStorage.getItem("PlayerID") || 0
var PlayerValue = 0

var PlayerNew = true

function CreatePlayers() {
    PlayerShell.innerHTML = ""
    db.ref("PlayerPositions").once("value").then((snapshot) => {
        var PlayerPos = snapshot.val()

        try {
            for (let i = 0; i < PlayerPos.length; i++) {
                if (PlayerPos[i][0] == PlayerID) {
                    PlayerNew = false;
                }
            }
            if (PlayerNew) {
                PlayerPos[PlayerPos.length] = [PlayerID, 10, 10, Math.floor(Math.random()*16777215).toString(16)]
            }
        }
        catch {
            PlayerPos = [[PlayerID, 10, 10, Math.floor(Math.random()*16777215).toString(16)]]
        }
        PlayerCount = PlayerPos.length
    
        db.ref("PlayerPositions").set(PlayerPos)

        for (let i = 0; i < PlayerPos.length; i++) {
            var PlayerPosInner = PlayerPos[i]
            try {
                if (PlayerPosInner[0] == PlayerID) { PlayerValue = i }
                var PlayerX = PlayerPosInner[1]
                var PlayerY = PlayerPosInner[2]
                var PlayerColor = PlayerPosInner[3]
    
                console.log(PlayerX, PlayerY)
                var NewPlayer = document.createElement("div")
                NewPlayer.id = i;
                NewPlayer.classList.add("player")
                NewPlayer.style.left = PlayerX + "px"
                NewPlayer.style.top = PlayerY + "px"
                NewPlayer.style.backgroundColor = "#" + PlayerColor
                document.querySelector(".players").appendChild(NewPlayer)
            }
            catch (e) {
                console.log(e)
            }
        }
    })
}

window.onload = function() {
    if (PlayerID == 0) {
        PlayerID = Math.random()
        localStorage.setItem("PlayerID", PlayerID); 
    }

    CreatePlayers()
}

db.ref("PlayerPositions").on("value", (snapshot) => {
    var PlayerPositionsCurrent = snapshot.val()

    for (let i = 0; i < PlayerPositionsCurrent.length; i++) {
        var PlayerPosInner = PlayerPositionsCurrent[i]
        try {
            var PlayerX = PlayerPosInner[1]
            var PlayerY = PlayerPosInner[2]

            console.log(PlayerX, PlayerY)
            document.getElementById(i.toString()).style.left = PlayerX + "px"
            document.getElementById(i.toString()).style.top = PlayerY + "px"
        }
        catch (e) {
            console.log(e)
        }

        console.log(PlayerPositionsCurrent[i])
    }
})

function move(direction) {
    db.ref("PlayerPositions").once("value").then((snapshot) => {
        var PlayerPos = snapshot.val()
        
        for (let i = 0; i < PlayerPos.length; i++) {
            if (PlayerPos[i][0] == PlayerID) {
                if (direction == "up") { PlayerPos[i][2] -= 10 }
                else if (direction == "down") { PlayerPos[i][2] += 10 }
                else if (direction == "left") { PlayerPos[i][1] -= 10 }
                else if (direction == "right") { PlayerPos[i][1] += 10 }
            }
        }

        db.ref("PlayerPositions").set(PlayerPos)
    })
}

const keyState = {};

// Add event listeners for keydown and keyup events
document.addEventListener("keydown", (event) => {
  keyState[event.key] = true;
  handleMovement();
});

document.addEventListener("keyup", (event) => {
  keyState[event.key] = false;
  handleMovement();
});

// Handle movement based on key state
function handleMovement() {
  if (keyState["w"]) {
    move("up");
  }
  if (keyState["a"]) {
    move("left");
  }
  if (keyState["s"]) {
    move("down");
  }
  if (keyState["d"]) {
    move("right");
  }
}

setInterval(() => {
    CreatePlayers()
  }, 5000);



  function ChangePlayerColor() {
    db.ref("PlayerPositions").once("value").then((snapshot) => {
        var PlayerPos = snapshot.val()
        
        for (let i = 0; i < PlayerPos.length; i++) {
            if (PlayerPos[i][0] == PlayerID) {
                var NewColor = Math.floor(Math.random()*16777215).toString(16)
                PlayerPos[i][3] = NewColor
                console.log(PlayerValue)
                document.getElementById(PlayerValue).style.backgroundColor = "#" + NewColor
            }
        }

        db.ref("PlayerPositions").set(PlayerPos)
    })
}