/* jshint node:true */
define([
	'intern!object',
	'intern/chai!assert',
	'intern/node_modules/dojo/Deferred',
	'intern/node_modules/dojo/node!path',
	'intern/node_modules/dojo/node!yeoman-generator',
	'module'
], function (registerSuite, assert, Deferred, path, generator, module) {
	var helpers = generator.test,
		app;

	registerSuite({
		name: 'creation',

		beforeEach: function () {
			var dfd = new Deferred();

			helpers.testDirectory(path.join(path.dirname(module.uri), 'temp'), function (err) {
				if (err) {
					return dfd.reject(err);
				}

				app = helpers.createGenerator('dojo:app', [
					'../../app'
				]);

				dfd.resolve();
			});

			return dfd.promise;
		},

		'expected files': function () {
			var dfd = this.async(),
				expected = [
					'.jshintrc',
					'.editorconfig',
					'src/temp/resources/main.styl'
				];

			helpers.mockPrompt(app, {
				'dojoVersion': '1.9.1',
				'features': [ 'dijit', 'dgrid', 'stylus' ],
				'dgridVersion': '0.3.10',
				'nib': true,
				'compression': 'closure',
				'travisci': false
			});
			app.options['skip-install'] = true;
			app.run({}, function () {
				helpers.assertFiles(expected);
				dfd.resolve();
			});
		}
	});
});
