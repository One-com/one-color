/*global window*/

/**
 * @namespace one One.com global JavaScript namespace.
 * @exports window.one as one
 */
if (typeof window !== 'undefined') {
	window.one = window.one || {};
} else {
	var one = {};
}

one.include = one.exclude = function () {}; // Ignore these in development mode
