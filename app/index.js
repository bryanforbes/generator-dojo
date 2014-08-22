/*jshint node:true*/
var path = require('path');
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
	constructor: function (args, options) {
		yeoman.generators.Base.apply(this, arguments);

		this.argument('appname', { type: String, required: false });
		this.appname = this._.slugify(this.appname || path.basename(process.cwd()));

		this.on('end', function () {
			this.installDependencies({
				skipInstall: options['skip-install'],
				callback: function () {
					// Once dgrid is installed, grab the dependencies from package.json
					// and use `bowerInstall` to install them
					if (this.dgrid) {
						var dgridDeps = this.dest.readJSON('src/dgrid/package.json').dependencies;
						this.bowerInstall([
							'put-selector#~' + dgridDeps['put-selector'],
							'xstyle#~' + dgridDeps.xstyle
						], {
							save: true
						});
					}
				}.bind(this)
			});
		});

		this.config.defaults({
			appname: this.appname
		});
	},

	askFor: function askFor() {
		var cb = this.async(),
			_ = this._;

		function dgridIncluded(answers) {
			return _.contains(answers.features, 'dgrid');
		}

		var prompts = [{
			name: 'dojoVersion',
			message: 'What version of Dojo will be used?',
			'default': '1.10.0'
		}, {
			type: 'checkbox',
			name: 'features',
			message: 'What packages would you like to include?',
			choices: [{
				name: 'Dijit',
				value: 'dijit',
				checked: true
			}, {
				name: 'DojoX',
				value: 'dojox',
				checked: false
			}, {
				name: 'dgrid',
				value: 'dgrid',
				checked: true
			}, {
				name: 'Stylus',
				value: 'stylus',
				checked: true
			}]
		}, {
			name: 'dgridVersion',
			message: 'What version of dgrid?',
			when: dgridIncluded,
			'default': '0.3.15'
		}, {
			type: 'confirm',
			name: 'nib',
			message: 'Include nib when compiling Stylus files?',
			when: function (answers) {
				return _.contains(answers.features, 'stylus');
			},
			'default': true
		}, {
			type: 'list',
			name: 'compression',
			message: 'What type of compression should be used when building?',
			choices: [{
				name: 'Shrinksafe',
				value: 'shrinksafe'
			}, {
				name: 'Closure',
				value: 'closure'
			}, {
				name: 'Uglify',
				value: 'uglify'
			}],
			'default': 1
		}, {
			type: 'confirm',
			name: 'travisci',
			message: 'Will you be using Travis-CI?',
			'default': false
		}, {
			name: 'sauceUsername',
			message: 'What is your SauceLabs username?',
			when: function (answers) {
				return answers.travisci;
			},
			'default': process.env.SAUCE_USERNAME || ''
		}, {
			name: 'sauceAccessKey',
			message: 'What is your SauceLabs access key?',
			when: function (answers) {
				return answers.travisci;
			},
			'default': process.env.SAUCE_ACCESS_KEY || ''
		}];

		this.prompt(prompts, function (props) {
			this.dojoVersion = props.dojoVersion;
			this.travisci = props.travisci;
			this.sauceUsername = props.sauceUsername;
			this.sauceAccessKey = props.sauceAccessKey;

			this.dijit = _.contains(props.features, 'dijit');
			this.dojox = _.contains(props.features, 'dojox');
			this.dgrid = _.contains(props.features, 'dgrid');
			this.stylus = _.contains(props.features, 'stylus');
			this.nib = props.nib;

			this.dgridVersion = props.dgridVersion;
			this.putSelectorVersion = props.putSelectorVersion;
			this.xstyleVersion = props.xstyleVersion;
			this.compression = props.compression;
			cb();
		}.bind(this));
	},

	app: function app() {
		this.mkdir('src');
		this.mkdir('profiles');

		this.template('Gruntfile.js', 'Gruntfile.js');
		this.template('_package.json', 'package.json');
		this.template('_bower.json', 'bower.json');

		this.template('src/index.html', 'src/index.html');
		this.template('src/dojoConfig.js', 'src/dojoConfig.js');

		this.template('profiles/app.profile.js', 'profiles/' + this.appname + '.profile.js');
	},

	appPackage: function appPackage() {
		var appPath = 'src/' + this.appname;
		this.mkdir(appPath);

		this.mkdir(appPath + '/resources');
		this.mkdir(appPath + '/tests');

		this.template('src/app/main.js', appPath + '/main.js');
		this.template('src/app/_package.json', appPath + '/package.json');
		this.template('src/app/_package.js', appPath + '/package.js');

		if (this.stylus) {
			this.template('src/app/resources/main.styl', appPath + '/resources/main.styl');
		}
		else {
			this.template('src/app/resources/main.css', appPath + '/resources/main.css');
		}
		this.template('src/app/tests/unit.js', appPath + '/tests/unit.js');
		this.template('src/app/tests/functional.js', appPath + '/tests/functional.js');
		this.template('src/app/tests/dojoConfig.js', appPath + '/tests/dojoConfig.js');
		this.template('src/app/tests/intern.js', appPath + '/tests/intern.js');
		this.template('src/app/tests/ready.js', appPath + '/tests/ready.js');
		this.template('src/app/tests/remoteReady.js', appPath + '/tests/remoteReady.js');
	},

	runtime: function () {
		this.copy('bowerrc', '.bowerrc');
		this.template('gitignore', '.gitignore');
		this.copy('gitattributes', '.gitattributes');

		if (this.travisci) {
			this.template('travis.yml', '.travis.yml');
		}
	},

	projectfiles: function () {
		this.copy('editorconfig', '.editorconfig');
		this.copy('jshintrc', '.jshintrc');
	}
});
