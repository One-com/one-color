ONECOLOR.installMethod('rotate', function (degrees) {
    amount = (degrees || 0) / 360;
    return this.hue(amount, true);
});
