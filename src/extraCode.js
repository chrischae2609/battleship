// function placeShips(myShips) {
//     const myTakenCoords = [];
//     const allCells = document.querySelectorAll(".shipCoord");
//     let currentShip = 0;
//     let isHorizontal = true;
//     const directionBtn = document.getElementById("hor-ver");
//     directionBtn.style.display = "inline-block";
//         directionBtn.addEventListener("click", () => {
//             isHorizontal = !isHorizontal;
//             directionBtn.textContent = isHorizontal ? "Vertical" : "Horizontal";
//         })

//         allCells.forEach(cell => {
//             cell.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 if (currentShip >= myShips.length) return;

//                 const ship = myShips[currentShip].shipType;
//                 const [x, y] = e.target.dataset.coords.split("-").map(Number);

//                 for (let i = 0; i < ship.length; i++) {
//                     const coord = isHorizontal ? `${x + i}-${y}` : `${x}-${y - i}`;
//                     if (
//                         (isHorizontal && x + ship.length - 1 > 10) || 
//                         (!isHorizontal && y - (ship.length - 1) < 1) ||
//                         myTakenCoords.includes(coord)) 
//                     {
//                         alert("Ship can't be placed here!");
//                         return;
//                     }
//                 }

//                 for (let i = 0; i < ship.length; i++) {
//                     const coord = isHorizontal ? `${x + i}-${y}`: `${x}-${y - i}`;
//                     const shipCell = myBoard.querySelector(`[data-coords="${coord}"]`);
//                     if (shipCell) {
//                         shipCell.style.backgroundColor = "lightblue";
//                         shipCell.textContent = ship.length;
//                         myTakenCoords.push(coord);
//                         myShips[currentShip].shipCoords.push(coord);
//                     };
//                 }
//                 console.log(myShips[currentShip].shipCoords);
//                 currentShip++;

//                 if (currentShip >= myShips.length) {
//                     directionBtn.style.display = "none";
//                     alert("All ships placed!")

//                     compGameBoard.renderBoard("#compBoard");
//                     placeCompShips(compShips);
//                     compBoard.style.display = "block";

//                 }
//             })
//         })
// }


// function placeCompShips(compShips) {
//     const compTakenCoords = [];
//     for (const ship of compShips) {
//         let placed = false;

//         while (!placed) {
//             const isHorizontal = Math.random() < 0.5;
//             const x = Math.floor(Math.random() * 10);
//             const y = Math.floor(Math.random() * 10);

//             const fitsOnBoard = isHorizontal ? x + ship.shipType.length <= 10 : y - (ship.shipType.length-1) >= 0;
//             if (!fitsOnBoard) continue;

//             const shipCoords = [];

//             for (let i = 0; i < ship.shipType.length; i++) {
//                 const coord = isHorizontal ? `${x + i + 1}-${y + 1}` : `${x + 1}-${y - i + 1}`;
//                 shipCoords.push(coord);

//             }

//             const overlaps = shipCoords.some(coord => compTakenCoords.includes(coord));
//             if (overlaps) continue;
//             for (const coord of shipCoords) {
//                 const cell = compBoard.querySelector(`[data-coords="${coord}"]`);
//                 if (cell) {
//                     cell.style.backgroundColor = "lightgreen";       
//                     cell.textContent = ship.shipType.length;
//                 }
//                 compTakenCoords.push(coord);
//                 ship.compCoords.push(coord);
//             }
//             placed = true;
//             console.log(ship.compCoords);
//         };
//     }
// }