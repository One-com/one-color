one.include('../HSL.js');

ONECOLOR.installMethod('saturate', function (amount) {
    amount = isNaN(amount) ? 0.1 : amount;
    return this.saturation(amount, true);
});
