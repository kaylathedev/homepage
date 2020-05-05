/* [(hot_output * TEMP_HOT) + (cold_output * TEMP_COLD)] / [hot_output + cold_output] = temp */
var HOT_WATER_TEMPERATURE = 120;
var COLD_WATER_TEMPERATURE = 45;

var calculateExpectedOutputOfColdWaterWithPressure = function(pressure, totalTemperature) {
    var numerator = pressure * (totalTemperature - HOT_WATER_TEMPERATURE);
    var denominator = COLD_WATER_TEMPERATURE - HOT_WATER_TEMPERATURE;
    return numerator / denominator;
};
var calculateHotWaterFromPressure = function(pressure, coldOutput) {
    return pressure - coldOutput;
};
var hotWaterValve = document.getElementById('hot-water-valve');
var coldWaterValve = document.getElementById('cold-water-valve');
var hotWaterValvePosition = 0;
var coldWaterValvePosition = 0;

var valveRotationSpeed = -1;
var valveMaxRotation = 90;

var pressure = 0;
var hotWaterOutput = 0;
var coldWaterOutput = 0;

var pressureElement = document.getElementById('pressure');
var hotWaterOutputElement = document.getElementById('hot-water-output');
var coldWaterOutputElement = document.getElementById('cold-water-output');
var finalTemperatureElement = document.getElementById('final-temperature');
var pressureField = document.getElementById('pressure-selector');
var temperatureField = document.getElementById('temperature-selector');

var calculateRotationToTurnValve = function(oldPosition, percent) {
    var degrees = (percent / 100) * valveMaxRotation * valveRotationSpeed;
    var changeInDegrees = degrees - oldPosition;

    while (changeInDegrees >= 360) {
        changeInDegrees -= 360;
    }
    while (changeInDegrees < 0) {
        changeInDegrees += 360;
    }
    var newPosition = 0;
    // Degrees is now between 0 and 360 exclusive.
    if (changeInDegrees < 180) {
        newPosition += changeInDegrees;
    } else if (changeInDegrees > 180) {
        changeInDegrees = 360 - changeInDegrees;
        newPosition -= changeInDegrees;
    } else {
        return;
    }
    return newPosition;
};

var moveHotWaterValve = function(degrees) {
    var newPosition = hotWaterValvePosition + degrees;
    hotWaterValve.style.transform = 'rotate(' + newPosition + 'deg)';
    hotWaterValvePosition = newPosition;
};
var moveColdWaterValve = function(degrees) {
    var newPosition = coldWaterValvePosition + degrees;
    coldWaterValve.style.transform = 'rotate(' + newPosition + 'deg)';
    coldWaterValvePosition = newPosition;
};
var updateValves = function() {
    var degreesToRotateHotValve = calculateRotationToTurnValve(hotWaterValvePosition, hotWaterOutput);
    if (degreesToRotateHotValve > 1) {
        degreesToRotateHotValve = 1;
    }
    if (degreesToRotateHotValve < -1) {
        degreesToRotateHotValve = -1;
    }
    var degreesToRotateColdValve = calculateRotationToTurnValve(coldWaterValvePosition, coldWaterOutput);
    if (degreesToRotateColdValve > 1) {
        degreesToRotateColdValve = 1;
    }
    if (degreesToRotateColdValve < -1) {
        degreesToRotateColdValve = -1;
    }
    moveHotWaterValve(degreesToRotateHotValve);
    moveColdWaterValve(degreesToRotateColdValve);
};
var updateOutput = function() {
    var oldColdWaterOutput = coldWaterOutput;
    var oldHotWaterOutput = hotWaterOutput;
    pressure = parseInt(pressureField.value);
    temperature = parseInt(temperatureField.value);
    coldWaterOutput = calculateExpectedOutputOfColdWaterWithPressure(pressure, temperature);
    hotWaterOutput = calculateHotWaterFromPressure(pressure, coldWaterOutput);
    pressureElement.innerHTML = pressure + '%';
    hotWaterOutputElement.innerHTML = Math.round(hotWaterOutput) + '%';
    coldWaterOutputElement.innerHTML = Math.round(coldWaterOutput) + '%';
    finalTemperatureElement.innerHTML = temperature + ' *F';
};

console.log('start shower');

setInterval(updateValves, 50);
setInterval(updateOutput, 100);
