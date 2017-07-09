var router = require('express').Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var Definition = sequelize.import('../models/definition');

// post method:
router.post('/', function(req, res) {
	// Variables:
	var description = req.body.definition.desc;
	var logType = req.body.definition.type;
	var owner = req.user.id;

	// Methods:
	Definition
	// Objects must match the model.
	.create({		// an object.create method
			description: description,
			logType: logType,
			owner: owner

	})
	.then(	// code that handles if the Definition object was successfully or unsuccessfully created:
			// createSuccess function:
			function createSuccess(definition) {
				// Send a response as JSON:
				res.json({
					definition: definition
				});
			},
			// createError function:
			function createError(err) {
				res.send(500, err.message);
			}
	);
});
// router.get method:
router.get('/', function(req, res) {
	// User variable:
	var userid = req.user.id;
	Definition
	// findAll by owner method:
	.findAll({
		where: { owner: userid }
	})
	.then(
		// Success:
		function findAllSuccess(data) {
			// console.log(data);
			res.json(data);
		},
		// Failure/error:
		function findAllError(err) {
			res.send(500, err.message);
		}
	);
});

module.exports = router;










