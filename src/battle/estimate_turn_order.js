// A sort of fake tickPhase.
// Calculates who should get turn number [index].
export var estimateTurnOrder = function (index, estimatedTurnOrder, units) {
    var unit;

    // First, figure out how many clock ticks it would take for every unit to reach 100 CT, based on their current testCT.
    for (var i = 0; i < units.length; i++) {
        unit = units[i];
        // If unit was the previous unit to go, assume CT would start at 0, and lose all the built up CT from before.
        if (estimatedTurnOrder[index - 1] === unit || estimatedTurnOrder[index] === unit) {
            unit.testCT = 0;
        } else if (index === 0) { // If estimating slot zero, testCT would equal current CT.
            unit.testCT = unit.ct;
        }

        unit.amountOfTicksTo100 = Math.ceil(100 / unit.speed) - (unit.testCT / unit.speed);

    }

    // Figure out who gets to 100 CT first, based on whoever needed the lowest amount of clock ticks.
    var minNumberOfTicks = Math.min.apply(
        null, units.map(function(o) { return o.amountOfTicksTo100; }),
    );
    var fastestUnit = units.filter(
        function(o) { return o.amountOfTicksTo100 === minNumberOfTicks; }
    );
    estimatedTurnOrder[index] = fastestUnit[0];

    // Pretend those ticks happened by increasing testCT for the next round of calculations.
    for (i = 0; i < units.length; i++) {
        unit = units[i];
        unit.testCT += unit.speed * minNumberOfTicks;
    }

};
