"use strict";

var controllers = require('./lib/controllers'),
	middleware = require('./lib/middleware'),

	plugin = {},
	titleMatch = /^user\/.+\/canned-responses$/;

plugin.init = function(params, callback) {
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers,
		routeHelpers = module.parent.require('./routes/helpers'),
		checks = [hostMiddleware.authenticate, hostMiddleware.exposeUid, middleware.restrictToProfileOwner],
		ACPchecks = [hostMiddleware.authenticate, hostMiddleware.isAdmin];
		
	// ACP Routes
	router.get('/admin/plugins/canned-responses', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/canned-responses', controllers.renderAdminPage);
	router.route('/admin/plugins/canned-responses/:responseId?')
		.post(ACPchecks, controllers.addGlobal)
		.delete(ACPchecks, controllers.delete)
		.put(ACPchecks, controllers.update);

	// User settings routes
	routeHelpers.setupPageRoute(router, '/user/:userslug/canned-responses/:responseId?', hostMiddleware, checks, controllers.get);
	router.route('/user/:userslug/canned-responses/:responseId?')
		.post(checks, controllers.add)
		.delete(checks, controllers.delete)
		.put(checks, controllers.update);

	// Global routes
	router.get('/canned-responses', controllers.getAll);

	callback();
};

plugin.addProfileItem = function(links, callback) {
	links.push({
		id: 'canned-responses',
		route: 'canned-responses',
		icon: 'fa-bullhorn',
		name: 'Canned Responses',
		public: false
	});

	callback(null, links);
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/canned-responses',
		icon: 'fa-bullhorn',
		name: 'Canned Responses'
	});

	callback(null, header);
};

plugin.addComposerButton = function(payload, callback) {
	payload.options.push({ name: 'canned-responses', className: 'fa fa-bullhorn' });
	callback(null, payload);
};

plugin.addTitles = function(data, callback) {
	if (titleMatch.test(data.fragment)) {
		data.parsed = 'Canned Responses';
	}

	callback(null, data);
};

module.exports = plugin;