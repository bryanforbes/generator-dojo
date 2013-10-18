/*jshint unused:false*/
var dojoConfig = {
	async: true,
	baseUrl: location.pathname.replace(/\/<%= appname %>\/.*$/, '/'),
	tlmSiblingOfDojo: false,
	isDebug: true,
	packages: [
		'dojo',<% if (dijit) { %>
		'dijit',<% } %><% if (dojox) { %>
		'dojox',<% } %><% if (dgrid) { %>
		'put-selector',
		'xstyle',
		'dgrid',<% } %>
		'<%= appname %>'
	],
	deps: [ '<%= appname %>/tests/ready' ]
};
