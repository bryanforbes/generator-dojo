/* jshint node:true */
var yeoman = require('yeoman-generator');
var path = require('path');

module.exports = yeoman.generators.NamedBase.extend({
	constructor: function () {
		// By calling `NamedBase` here, we get the argument to the subgenerator call
		// as `this.name`.
		yeoman.generators.NamedBase.apply(this, arguments);

		this.appname = this.config.get('appname');
		this.subdir = '';
		if (this._.contains(this.name, '/')) {
			this.subdir = path.dirname(this.name);
			this.name = path.basename(this.name);
		}
	}
});
