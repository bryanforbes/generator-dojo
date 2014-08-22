define([
	'intern!object',
	'intern/chai!assert',
	'<%= testsUrl %>/remoteReady',
	'require'
], function (registerSuite, assert, remoteReady, require) {
	registerSuite({
		name: '<%= name %>',

		setup: function () {
			return this.get('remote')
				.get(require.toUrl('./<%= name %>.html'))
				.then(remoteReady());
		}
	});
});
