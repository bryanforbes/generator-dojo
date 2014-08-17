define([
	'intern/dojo/node!leadfoot/helpers/pollUntil'
], function (pollUntil) {
	/* global __ready__ */
	function remoteReady(timeout) {
		if (isNaN(timeout)) {
			timeout = 5000;
		}
		return pollUntil(
			function () {
				if (typeof __ready__ !== 'undefined') {
					return __ready__ || null;
				}
			},
			timeout == null ? 5000 : timeout
		);
	}

	return remoteReady;
});
