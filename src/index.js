import "./styles.css";

const startPage = document.getElementById("startPage");
const startBtn = document.getElementById("startBtn");
const myBoardEl = document.getElementById("myBoard");
const compBoardEl = document.getElementById("compBoard");
const turnComments = document.getElementById("turnComments");
const gameComments = document.getElementById("gameComments");
const resetBtn = document.getElementById("resetBtn");
const Ship = require('./Ship');
const Player = require('./Player');

const me = Player();
const comp = Player(true);
const myBoard = me.board;
const compBoard = comp.board;

const myShips = [
    {shipName: "Carrier", shipType: Ship(5), shipCoords: []},
    {shipName: "Battleship", shipType: Ship(4), shipCoords: []},
    {shipName: "Cruisor", shipType: Ship(3), shipCoords: []},
    {shipName: "Destroyer", shipType: Ship(3), shipCoords: []},
    {shipName: "Submarine", shipType: Ship(2), shipCoords: []}
]

let compShips = [
    {shipName: "Carrier", shipType: Ship(5), compCoords: []},
    {shipName: "Battleship",shipType: Ship(4), compCoords: []},
    {shipName: "Cruisor", shipType: Ship(3), compCoords: []},
    {shipName: "Destroyer", shipType: Ship(3), compCoords: []},
    {shipName: "Submarine", shipType: Ship(2), compCoords: []}
]

startBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // const playerName = document.getElementById("playerName").value.trim();
    // if (!playerName) return alert("Please enter your name!");

    startPage.style.display = "none";
    myBoardEl.style.display = "block";

    myBoard.renderBoard("#myBoard");
    myBoard.placeShips(myShips, "#myBoard", setCompBoard);


})

resetBtn.addEventListener("click", () => {
    restartGame();
})


function setCompBoard() {
    compBoard.renderBoard("#compBoard");
    compBoard.placeCompShips(compShips, "#compBoard");
    compBoardEl.style.display = "block";
    battleShip(me, comp);
}

function battleShip(playerOne, playerTwo) {
    const players = [
        { player: playerOne, ships: myShips},
        { player: playerTwo, ships: compShips}
    ];
    let activePlayer = players[0];
    let gameOver = false;
    let playerTurnReady = false;

    const endGame = (message) => {
        gameOver = true;
        myBoardEl.style.display = "none";
        compBoardEl.style.display = "none";
        gameComments.textContent = message;
        resetBtn.style.display = "inline-block";
    };

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const compAttacks = []
    const compChooseCell = (callBack) => {
        let x, y;
        let coord;
        do {
            x = Math.floor(Math.random() * 10) + 1;
            y = Math.floor(Math.random() * 10) + 1;
            coord = `${x}-${y}`;
        } while (compAttacks.includes(coord));
        compAttacks.push(coord);
        callBack(x, y);
    }

    const setupPlayerAttack = () => {
        const cells = compBoardEl.querySelectorAll(".shipCoord");
        cells.forEach((cell) => {
            cell.addEventListener("click", (e) => {
                if (!playerTurnReady || gameOver) return;
                const [x, y] = e.target.dataset.coords.split("-").map(Number);

                comp.board.receiveAttack(x, y, "#compBoard", "You");
                playerTurnReady = false;
                if (compShips.every((ship) => ship.shipType.isSunk())) {
                    turnComments.textContent = '';
                    endGame("All computer ships are sunk! You win!");
                    return;
                }
                switchPlayerTurn();
                setTimeout(playRound, 700);
            });
        });
    }

    setupPlayerAttack();

    const playRound = () => {
        if (gameOver) {
            return;
        };

        if (activePlayer === players[0]) {
            turnComments.textContent = "Your turn!";
            playerTurnReady = true;
        } else {
            turnComments.textContent = "Computer's turn";
            compChooseCell((x, y) => {
                me.board.receiveAttack(x, y, "#myBoard", "Computer");

                if (myShips.every((ship) => ship.shipType.isSunk())) {
                    endGame("All your ships are sunk! Computer wins!");
                    return;
                }
                switchPlayerTurn();
                setTimeout(playRound, 1000);
            })
        }
    };
    playRound();

}


function restartGame() {
    window.location.reload();
}



// playRound pseudocode:
// if game is over, return
// if its my turn, i select a cell from computer's board
// if i hit a cell already in missedShots, alert("you already hit this spot") and try another cell
//  the board received my "attack"
//      if i hit one of computer's ships:
//          if all of the ships are hit, game is over, i win
//          if i hit one part of ship, blah blah blah
//          switch player
//      if i miss, add that coordinate to missed shots 
//          switch player
// if its computer's turn, the computer randomly selects from my board;
// if computer attempts to hit a cell already in missedShots, try another cell
//  i receive the computer's attack
//      if computer hits one of my ships:
//          if all of my ships are hit, game is over, computer wins
//          if computer hits one part of ship, blah blah blah
//          switch player
//      if computer misses, add that coordinate to missed shots
//          switch player

