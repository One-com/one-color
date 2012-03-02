ONECOLOR.installMethod('opaquer', function (amount) {
    return this.alpha(isNaN(amount) ? 0.1 : amount, true);
});
