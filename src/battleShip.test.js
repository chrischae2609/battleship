
const Ship = require('./Ship');

test('hit increases timesHit', () => {
    const ship = Ship();
    expect(ship.hit()).toBe(1);
    expect(ship.hit()).toBe(2);
    expect(ship.hit()).toBe(3);
});

test('isSunk returns true when timesHit equals length', () => {
    const ship = Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
})