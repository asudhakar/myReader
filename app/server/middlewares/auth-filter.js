/**
 * Created by sridharrajs.
 */

'use strict';

let _ = require('lodash');
let jwt = require('jwt-simple');

let config = require('../../../config');

const NON_AUTH_URLS = [
	'/users',
	'/login',
	'/join'
];

function isNonAuthEndPointAccessURL(url) {
	return _.contains(NON_AUTH_URLS, url);
}

let authenticate = function (req, res, next) {
	let token = req.headers.authorization;
	let isNonAuthURL = isNonAuthEndPointAccessURL(req.url);

	if (isNonAuthURL) {
		return next();
	}

	if (!token) {
		res.status(401).send({
			err: 'please login'
		});
	}
	try {
		let decoded = jwt.decode(token, config.FBaseAdminToken);
		req.uid = decoded.d.uid;
		req.teamId = decoded.d.data.teamId;
		next();
	} catch (ex) {
		console.log('Exception ', ex);
	}
};

function getValidURLs() {
	return NON_AUTH_URLS;
}

module.exports = {
	authenticate,
	isNonAuthEndPointAccessURL,
	getValidURLs
};