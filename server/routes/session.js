// express.Router helps us build dynamic routes in our system:
var router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var sequelize = require('../db.js');
var User = sequelize.import('../models/user.js');

router.post('/', function(req, res) {
	/* 1) First, we need a function that searches for a particular user 
	that matches the incoming request: */
	User.findOne( { where: { username: req.body.user.username } } ).then(
		function(user) {
			/* 2) If the request is successful and the username matches, 
			we need to do some stuff. */
			if (user) {
				bcrypt.compare(req.body.user.password, user.passwordhash, 
					function(err, matches){
					// Compare the password.
					if (matches) {
					/* If the password matches, show success and give 
					the user a token. */
					   var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24 });
						res.json({
							user: user,
							message: "successfully authenticated",
							sessionToken: token
						});
					/* If the password doesn't match, show failure to 
					authenticate. */
					} else {
					res.status(500).send(
						{ error: "failed to authenticate" });
					}
				});
			/* 2) If the request was not successful and that user does 
			not exist, throw an error. */
			} else {
				res.status(500).send({error: "failed to authenticate"});
			}
		},
		// If no data is returned, or the server's not responding:
		function(err) {
			res.json(err);
		}
	);
});

module.exports = router;
















