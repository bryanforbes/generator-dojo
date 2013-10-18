/*jshint unused:false*/
var dojoConfig = {
	async: true,
	baseUrl: '',
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
	deps: [ '<%= appname %>' ],
	callback: function (<%= _.camelize(appname) %>) {
		<%= _.camelize(appname) %>.init();
	}
};
