define([
	'intern!object',
	'intern/chai!assert',
	'intern/node_modules/dojo/node!../../../../../app'
], function (registerSuite, assert, app) {
	registerSuite({
		name: 'load',

		'import': function () {
			assert(app !== undefined);
		}
	});
});
