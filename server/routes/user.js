var router = require('express').Router();	
// The "router" variable is an Express router!

var sequelize = require('../db.js');
var User = sequelize.import('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Call the ".post" method on "require('express').Router();" from above,
// which is saved in the variable called "router".
router.post('/', function(req, res) {

	var username = req.body.user.username;
	var pass = req.body.user.password;

	User.create({
		username: username,
		// Use bcrypt to hash out our password:
		passwordhash: bcrypt.hashSync(pass, 10)
	}).then(
		function createSuccess(user) {

			var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});

			res.json({
				user: user,
				message: 'created',
				sessionToken: token
	
			});
		},
		function createError(err) {
			res.send(500, err.message);
		}
	);
});

// Add an export:
module.exports = router;












