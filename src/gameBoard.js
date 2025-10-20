
const gameComments = document.getElementById("gameComments");

function GameBoard() {
    const rows = 10;
    const columns = 10;
    const ships = [];
    const takenCoords = [];
    const missedShots = [];
    const hitShots = [];

    const isTaken = (coord) => {
        return takenCoords.includes(coord);
    };

    const createBoard = (rows, columns) => {
        const table = document.createElement("table");

        for (let i = 0; i <= rows; i++) {
            const tr = document.createElement("tr");
            for (let j = 0; j <= columns; j++) {
                const td = document.createElement("td");

                if (i === 0 && j === 0) {
                    td.textContent = "";
                } else if (i === 0) {
                    td.textContent = j;
                    td.className = "numCoord";
                } else if (j === 0) {
                    td.textContent = String.fromCharCode(64 + i);
                    td.className = "letterCoord";
                } else {
                    td.textContent = "" // empty cell
                    td.className = "shipCoord";
                    // td.dataset.coords = `${j}-${rows + 1 - i}`
                    td.dataset.coords = `${j}-${i}`;
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        return table;
    }

    const renderBoard = (containerSelector) => {
        const board = createBoard(rows, columns);
        const container = document.querySelector(containerSelector);
        container.innerHTML = '';
        container.appendChild(board);
    
    }

    const placeShips = (shipList, containerSelector, onAllShipsPlaced) => {
        const allCells = document.querySelectorAll(".shipCoord");
        const board = document.querySelector(containerSelector);

        const directionBtn = document.getElementById("hor-ver");
        let currentShip = 0;
        let isHorizontal = true;

        directionBtn.style.display = "inline-block";
        directionBtn.textContent = "Vertical";
        directionBtn.addEventListener("click", () => {
            isHorizontal = !isHorizontal;
            directionBtn.textContent = isHorizontal ? "Vertical" : "Horizontal";
        });

        allCells.forEach(cell => {
            cell.addEventListener("mouseenter", (e) => {
                if (currentShip >= shipList.length) return;
                const ship = shipList[currentShip].shipType;
                const [x, y] = e.target.dataset.coords.split("-").map(Number);

                const prevCoords = [];

                for (let i = 0; i < ship.length; i++) {
                    const coord = isHorizontal ? `${x + i}-${y}` : `${x}-${y + i}`;
                    prevCoords.push(coord);
                }

                // const isValid = prevCoords.every(coord => {
                //     const [cx, cy] = coord.split("-").map(Number);
                //     return (
                //         (isHorizontal && cx + ship.length - 1 >= 10) ||
                //         (!isHorizontal && cy - (ship.length - 1) < 1)
                //     );
                // });
                prevCoords.forEach(coord => {
                    const prevCell = board.querySelector(`[data-coords="${coord}"]`);
                    if (prevCell) {
                        prevCell.style.backgroundColor = "lightblue";
                    }
                })
            });

            cell.addEventListener("mouseleave", () => {
                if (currentShip >= shipList.length) return;
                const allCells = board.querySelectorAll(".shipCoord");
                allCells.forEach(c => {
                    if (!takenCoords.includes(c.dataset.coords)) {
                        c.style.backgroundColor = "";
                    }
                })
            })

            cell.onclick = (e) => {
                e.preventDefault();

                if (currentShip >= shipList.length) return;

                const ship = shipList[currentShip].shipType;
                const [x, y] = e.target.dataset.coords.split("-").map(Number);

                for (let i = 0; i < ship.length; i++) {
                    const coord = isHorizontal ? `${x + i}-${y}` : `${x}-${y + i}`;
                    if (
                        (isHorizontal && x + ship.length - 1 > 10) ||
                        (!isHorizontal && y - (ship.length - 1) > 10) ||
                        isTaken(coord)
                    ) {
                        alert("Ship can't be placed here!");
                        return;
                    }
                }

                for (let i = 0; i < ship.length; i++) {
                    const coord = isHorizontal ? `${x + i}-${y}` : `${x}-${y + i}`;
                    const shipCell = board.querySelector(`[data-coords="${coord}"]`);
                    if (shipCell) {
                        shipCell.style.backgroundColor = "lightblue";
                        // shipCell.textContent = ship.length;
                        takenCoords.push(coord);
                        shipList[currentShip].shipCoords.push(coord);
                    }
                }
                ships.push(shipList[currentShip]);
                currentShip++;

                if (currentShip >= shipList.length) {
                    directionBtn.style.display = "none";
                    alert("All ships placed!");
                    // ships.push(...shipList);
                    if (onAllShipsPlaced) onAllShipsPlaced();
                }
            };
        });
    }

    const placeCompShips = (compShipList, containerSelector) => {
        const compTakenCoords = [];

        for (const ship of compShipList) {
            let placed = false;
            while (!placed) {
                const isHorizontal = Math.random() < 0.5;
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);

                const fitsOnBoard = isHorizontal 
                    ? x + ship.shipType.length <= 10
                    : y - (ship.shipType.length - 1) >= 0;
                if (!fitsOnBoard) continue;

                const shipCoords = [];
                for (let i = 0; i < ship.shipType.length; i++) {
                    const coord = isHorizontal
                        ? `${x + i + 1}-${y + 1}`
                        : `${x + 1}-${y - i + 1}`;
                    shipCoords.push(coord);
                }

                const overlaps = shipCoords.some(coord => compTakenCoords.includes(coord));
                if (overlaps) continue;
                for (const coord of shipCoords) {
                    const cell = document.querySelector(`${containerSelector} [data-coords="${coord}"]`);
                    if (cell) {
                        // cell.style.backgroundColor = "lightgreen";
                        // cell.textContent = ship.shipType.length;
                    }
                    compTakenCoords.push(coord);
                    ship.compCoords.push(coord);
                }
                placed = true;
            }
        }
        ships.push(...compShipList);
    }


    const receiveAttack = (x, y, containerSelector, player) => {
        const coordKey = `${x}-${y}`;
        const alreadyAttacked = missedShots.some(([mx, my]) => mx === x && my === y) ||
                                hitShots.some(([hx, hy]) => hx === x && hy === y);
        if (alreadyAttacked) {
            alert("Already missed this spot!");
            return;
        }

        const cell = document.querySelector(`${containerSelector} [data-coords="${coordKey}"]`);
        let hitDetected = false;

        for (const ship of ships) {
            const coords = ship.shipCoords || ship.compCoords || [];

            if (coords.includes(coordKey)) {
                hitDetected = true;
                ship.shipType.hit();
                cell.style.backgroundColor = "lightgreen";
                gameComments.textContent = `It's a hit!`
                gameComments.style.color = 'lightgreen';
                hitShots.push([x, y]);
                if (ship.shipType.isSunk()) {
                    gameComments.textContent = `${player} sunk a ${ship.shipName}!`
                }
                break;
            }
        }
        if (!hitDetected) {
            cell.style.backgroundColor = "red";
            gameComments.textContent = `It's a miss!`
            gameComments.style.color = 'salmon';
            missedShots.push([x, y]);
        }
    }

    return { renderBoard, receiveAttack, placeShips, placeCompShips }
}

module.exports = GameBoard;