one.include('../HSL.js');

ONECOLOR.installMethod('darken', function (amount) {
    amount = isNaN(amount) ? 0.1 : amount;
    return this.lightness(-amount, true);
});
