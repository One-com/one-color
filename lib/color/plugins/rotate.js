ONECOLOR.installMethod('rotate', function (degrees) {
    return this.hue((degrees || 0) / 360, true);
});
