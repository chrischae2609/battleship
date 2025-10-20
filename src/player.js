const GameBoard = require('./GameBoard');

function Player(isComputer = false) {
    const board = GameBoard();


    return { isComputer, board }
}

module.exports = Player;