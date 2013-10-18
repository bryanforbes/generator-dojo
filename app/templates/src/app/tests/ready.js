var testReady = 0;
define([
	'dojo/promise/all',
	'dojo/Deferred',
	'dojo/domReady!'
], function (all, Deferred) {
	var promises = [];
	var context = {
		async: function () {
			var deferred = new Deferred();
			promises.push(deferred.promise);
			return deferred;
		}
	};
	var req = function (config, deps, callback) {
		if (!callback) {
			callback = deps;
			deps = config;
			config = {};
		}
		var deferred = new Deferred();
		promises.push(deferred.promise);
		require(config, deps, function () {
			callback.apply(this, arguments);
			deferred.resolve();
		});
	};
	if (typeof window.initializeTest === 'function') {
		window.initializeTest.call(context, req);
		all(promises).then(function () {
			testReady = 1;
		});
	}
	else {
		testReady = 1;
	}
});
