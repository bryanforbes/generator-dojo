var __ready__ = false;
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
	function done() {
		__ready__ = true;
	}
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
		all(promises).then(done);
	}
	else {
		done();
	}
});
