# Dojo generator [![Build Status](https://secure.travis-ci.org/bryanforbes/generator-dojo.png?branch=master)](https://travis-ci.org/bryanforbes/generator-dojo)

A Dojo application generator for [Yeoman](http://yeoman.io).


## Getting started

* Make sure you have [yo](https://github.com/yeoman/yo) and [generator-dojo](https://github.com/bryanforbes/generator-dojo) installed:
```bash
npm install -g yo generator-dojo
```
* Make a new directory and traverse into it:
```bash
mkdir my-app && cd $_
```
* Run `yo dojo`, optionally passing an application name (the application name and AMD package will default to the directory you are currently in):
```bash
yo dojo [app-name]
```

## Application layout

`generator-dojo` will scaffold out a Dojo application using best practices for web development. This means the directory structure for development will be in the same structure as it would be after building for production:

```bash
src/
    dojo/
	dijit/
	dgrid/
	...
	my-app/
	index.html
```

Because of this structure, a Dojo application is completely agnostic to the server which delivers it in both development and production environments and requires little to no configuration of the server. It will work equally as well with nginx as it would with Apache Tomcat.

## Generators

* [dojo](#dojo) (aka [dojo:app](#dojo))
* [dojo:test](#test)

### Dojo

Sets up a new Dojo application, generating all of the boilerplate to get started. The application generator also optionally installs Dijit, DojoX, dgrid, and Stylus.

Example:
```bash
yo dojo
```

### Test

Generates a unit or functional test for [Intern](http://theintern.io) and places it in `src/<appname>/tests/<test name>.{js,html}`. Optionally receives a `--functional` flag. If the flag is passed, a functional test is generated, otherwise a unit test is generated.

Example:
```bash
yo dojo:test --functional widgets/functional/MyWidget
```

Produces `src/<appname>/tests/widgets/functional/MyWidget.js` and `src/<appname>/tests/widgets/functional/MyWidget.html`.

Example:
```bash
yo dojo:test widgets/MyWidget
```

Produces `src/<appname>/tests/widgets/MyWidget.js`.

## Grunt tasks

The default `Gruntfile.js` defines some common tasks for your Dojo application:

### default

Compiles and watches for changes to changes in stylus files, compiling them if necessary.

### build

Compiles your application into the `dist` directory using the Dojo build tool. The `dist` directory can then be copied, zipped, tarred, warred, etc. to a production server without the need for complex configuration of the server: it's just a directory of static files!

### server

Serves up the `src` directory as the root directory of `localhost:8888` (this can be configured using the `connect.options.port` option in `Gruntfile.js`). This also watches for changes to stylus files, compiling them if necessary.

`server` also takes an optional `target` flag. If this flag is `dist`, a build will run and the `dist` directory will be served as the root directory of `localhost:8888`:

```bash
grunt server:dist
```

### intern

Runs unit and functional tests using [Intern](http://theintern.io). Intern allows web developers to run unit and functional tests in various versions of browsers from the command line.

This task takes an optional `target` flag. If this flag is `local`, only local non-browser tests will be run. If this flag is `remote`, only remote tests will be run using Selenium (via SauceLabs or your own Selenium server). If this flag is not passed, both non-browser and remote tests will be run.

### clean

Removes the `dist` directory (if one exists) to clean up after a build.

## License

[New BSD License](LICENSE)
