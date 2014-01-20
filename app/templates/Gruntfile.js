/*jshint node:true*/
module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt, [ 'grunt-*', 'intern-geezer' ]);
	require('time-grunt')(grunt);
	var path = require('path');

	var stripComments = /<\!--.*?-->/g,
		collapseWhiteSpace = /\s+/g;

	grunt.initConfig({
		dojo: {
			dist: {
				options: {
					dojo: path.join('src', 'dojo', 'dojo.js'),
					dojoConfig: path.join('src', 'dojoConfig.js'),
					profile: path.join('profiles', '<%= appname %>.profile.js'),
					releaseDir: path.join('..', 'dist'),
					basePath: path.join(__dirname, 'src')
				}
			}
		},
		copy: {
			config: {
				options: {
					processContent: function (content) {
						return content.replace(/isDebug:\s+(true|1),?\s+/, '');
					}
				},
				files: [{
					src: path.join('src', 'dojoConfig.js'),
					dest: path.join('dist', 'dojoConfig.js')
				}]
			},
			index: {
				options: {
					processContent: function (content) {
						return content
							.replace(stripComments, '')
							.replace(collapseWhiteSpace, ' ')
						;
					}
				},
				files: [{
					src: path.join('src', 'index.html'),
					dest: path.join('dist', 'index.html')
				}]
			}
		},

		connect: {
			options: {
				port: 8888,
				livereload: 35733,
				hostname: 'localhost'
			},
			livereload: {
                options: {
                    open: true,
                    base: [
                        'src'
                    ]
                }
            },
			test: {
				options: {
					open: true,
					base: 'src'
				}
			},
			dist: {
				options: {
					open: true,
					base: 'dist',
					livereload: false
				}
			}
		},

		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'dist',
						'!dist/.git*'
					]
				}]
			}
		},

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                'src/<%= appname %>/{,*/}*.js',
                '!src/<%= appname %>/dojo/*',
                '!src/<%= appname %>/dijit/*',
                '!src/<%= appname %>/dojox/*'
                //'test/spec/{,*/}*.js'
            ]
        },<% if (stylus) { %>
		stylus: {
			compile: {
				options: {
					compress: false<% if (nib) { %>,
					'import': [ 'nib' ]<% } %>
				},
				files: {
					'src/<%= appname %>/resources/main.css': 'src/<%= appname %>/resources/main.styl'
				}
			}
		},<% } %>
		watch: {
			js: {
                files: ['src/<%= appname %>/{,*/}*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%%= connect.options.livereload %>'
                },
                files: [
                    'src/{,*/}*.html',
                    'src/<%= appname %>/styles/{,*/}*.css',
					'src/<%= appname %>/{,*/}*.js',
                    'src/<%= appname %>/images/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
                ]
            }<% if (stylus) { %>,
			stylus: {
				files: 'src/<%= appname %>/resources/**/*.styl',
				tasks: [ 'stylus:compile' ]
			}<% } %>
		},
		intern: {
			local: {
				options: {
					runType: 'client',
					config: 'src/<%= appname %>/tests/intern'
				}
			},
			remote: {
				options: {
					runType: 'runner',
					config: 'src/<%= appname %>/tests/intern'
				}
			}
		}
	});

	grunt.registerTask('default',
		[
			<% if (stylus) { %>'stylus:compile',<% } %>
			'jshint',
			'watch'
		]
	);

	grunt.registerTask('server', function (target) {
		if (target === 'dist') {
			return grunt.task.run([
				'build',
				'connect:dist:keepalive'
			]);
		}

		grunt.task.run(
			[
				'jshint',
				<% if (stylus) { %>'stylus:compile',
				<% } %>'connect:livereload<% if (!stylus) { %>:keepalive<% } %>',
				'watch'
			]
		);
	});

	grunt.registerTask('build',
		[
			<% if (stylus) { %>'stylus:compile',<% } %>
			'jshint',
			'clean',
			'dojo:dist',
			'copy'
		]
	);
};
