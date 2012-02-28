one.color.installMethod('clearer', function (amount) {
	amount = amount || 0.1;
	return this.alpha(-amount, true);
});
