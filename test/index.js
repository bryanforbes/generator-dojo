/* jshint node:true */
var NamedBase = require('../NamedBase');
var path = require('path');

module.exports = NamedBase.extend({
	constructor: function (args, options) {
		NamedBase.apply(this, arguments);

		var projectRoot = this.destinationRoot();

		var basePath = path.join(projectRoot, 'src'),
			appPath = path.join(basePath, this.appname),
			testsPath = path.join(appPath, 'tests'),
			testPath = path.join(testsPath, options.functional ? 'functional' : 'unit', this.subdir),
			relativeBaseUrl = path.relative(testPath, basePath),
			relativeAppUrl = path.relative(testPath, appPath),
			relativeTestsUrl = path.relative(testPath, testsPath);

		if (path.sep === '\\') {
			relativeBaseUrl = relativeBaseUrl.replace('\\', '/');
			relativeAppUrl = relativeAppUrl.replace('\\', '/');
			relativeTestsUrl = relativeTestsUrl.replace('\\', '/');
		}

		this.functional = options.functional;
		this.testDirPath = testPath;
		this.appUrl = relativeAppUrl;
		this.testsUrl = relativeTestsUrl;
		this.baseUrl = relativeBaseUrl;

		this.on('end', function () {
			var type = this.functional ? 'functional' : 'unit';

			console.log(
				'Don\'t forget to add ./' +
				type + '/' + (this.subdir ? this.subdir + '/' : '') + this.name +
				' to the dependency list in ' +
				path.join('src', this.appname, 'tests', type + '.js'));
		}.bind(this));
	},
	files: function () {
		var modulePath = path.join(this.testDirPath, this.name + '.js');
		if (this.functional) {
			this.template('functional.js', modulePath);
			this.template('functional.html', path.join(this.testDirPath, this.name + '.html'));
		}
		else {
			this.template('unit.js', modulePath);
		}
	}
});
