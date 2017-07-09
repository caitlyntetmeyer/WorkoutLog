var jwt = require('jsonwebtoken');
var sequelize = require('../db');
var User = sequelize.import('../models/user');

module.exports = function(req, res, next) {
	var sessionToken = req.headers.authorization;
	// .authorization is the long string of text (sessionToken in Postman)
	// so when the user's gonna do any retrieval, updates, creations, they
	// need to have that sessionToken. W/the request the user's sending, a
	// sessionToken is created. The sessionToken is appended to any request
	// the user sends to us.

	if(!req.body.user && sessionToken) {	// ! means not
		jwt.verify(sessionToken, process.env.JWT_SECRET, function(err, 
			decoded) {
			if(decoded) {
				// Find a user with the specified id:
				User.findOne({where: {id: decoded.id}}).then(
					function(user) {
						req.user = user;
						next();
					},
					function() {
						res.status(401).send({error: 'Not authorized'});
						}
					);
			} else {
				res.status(401).send({error: 'Not authorized'});
			}
		});
	} else {
		next();
	}
}













