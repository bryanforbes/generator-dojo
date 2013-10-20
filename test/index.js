/* jshint node:true */
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');

var TestGenerator = module.exports = function TestGenerator(args, options) {
	// By calling `NamedBase` here, we get the argument to the subgenerator call
	// as `this.name`.
	yeoman.generators.NamedBase.apply(this, arguments);

	this.appname = this._.slugify(path.basename(process.cwd()));
	this.subdir = '';
	if (this._.contains(this.name, '/')) {
		this.subdir = path.dirname(this.name);
		this.name = this._.slugify(path.basename(this.name));
	}

	var projectRoot = process.cwd();

	var basePath = path.join(projectRoot, 'src'),
		appPath = path.join(basePath, this.appname),
		testsPath = path.join(appPath, 'tests'),
		testPath = path.join(testsPath, this.subdir),
		relativeBaseUrl = path.relative(testPath, basePath),
		relativeAppUrl = path.relative(testPath, appPath),
		relativeTestsUrl = path.relative(testPath, testsPath);

	if (path.sep === '\\') {
		relativeBaseUrl = relativeBaseUrl.replace('\\', '/');
		relativeAppUrl = relativeAppUrl.replace('\\', '/');
		relativeTestsUrl = relativeTestsUrl.replace('\\', '/');
	}
	if (relativeTestsUrl) {
		relativeTestsUrl += '/';
	}

	this.functional = options.functional;
	this.testDirPath = testPath;
	this.appUrl = relativeAppUrl;
	this.testsUrl = relativeTestsUrl;
	this.baseUrl = relativeBaseUrl;

	this.on('end', function () {
		console.log('Don\'t forget to add ' + path.join(this.appname, 'tests', this.subdir, this.name) +
					' to the dependency list in ' +
					path.join('src', this.appname, 'tests', (this.functional ? 'functional' : 'unit') + '.js'));
	}.bind(this));
};

util.inherits(TestGenerator, yeoman.generators.NamedBase);

TestGenerator.prototype.files = function files() {
	var testPath = path.join('src', this.appname, 'tests', this.subdir);
	if (this.functional) {
		this.template('functional.js', path.join(testPath, this.name + '.js'));
		this.template('functional.html', path.join(testPath, this.name + '.html'));
	}
	else {
		this.template('unit.js', path.join(testPath, this.name + '.js'));
	}
};
