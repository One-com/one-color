ONECOLOR.installMethod('opaquer', function (amount) {
    amount = isNaN(amount) ? 0.1 : amount;
    return this.alpha(amount, true);
});
