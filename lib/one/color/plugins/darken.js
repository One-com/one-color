one.include('../HSL.js');

one.color.installMethod('darken', function (amount) {
	amount = amount || 0.1;
	return this.lightness(-amount, true);
});
