INCLUDE('../HSL.js');

ONECOLOR.installMethod('desaturate', function (amount) {
    return this.saturation(isNaN(amount) ? -0.1 : -amount, true);
});
