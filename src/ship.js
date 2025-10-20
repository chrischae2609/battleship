function Ship(length) {
    let timesHit = 0;

    const createShip = (length) => {
        const ship = document.createElement("div");
        for (let i = 0; i < length; i++) {
            const shipSquare = document.createElement("div");
            ship.appendChild(shipSquare);
        }
    }

    const getShip = () => createShip(length);

    const hit = () => {
        timesHit++;
        return timesHit;
    }

    const isSunk = () => {
        return timesHit === length;
    }

    return { length, getShip, hit, isSunk };

}

module.exports = Ship
