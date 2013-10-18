define([
	'intern!object',
	'intern/chai!assert',
	'require'
], function (registerSuite, assert, require) {
	registerSuite({
		name: '<%= name %>',

		setup: function () {
			return this.get('remote').get(require.toUrl('./<%= name %>.html'))
				.waitForCondition('!!testReady', 5000);
		}
	});
});
