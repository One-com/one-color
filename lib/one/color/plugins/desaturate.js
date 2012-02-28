one.include('../HSL.js');

one.color.installMethod('saturate', function (amount) {
	amount = amount || 0.1;
	return this.saturation(-amount, true);
});
