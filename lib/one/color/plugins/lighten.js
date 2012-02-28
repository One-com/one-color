one.include('../HSL.js');

ONECOLOR.installMethod('lighten', function (amount) {
    amount = isNaN(amount) ? 0.1 : amount;
    return this.lightness(amount, true);
});
