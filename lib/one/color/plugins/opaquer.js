one.color.installMethod('opaquer', function (amount) {
	amount = amount || 0.1;
	return this.alpha(amount, true);
});
