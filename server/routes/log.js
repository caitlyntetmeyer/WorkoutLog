var router = require('express').Router();
var sequelize = require('../db');
var Log = sequelize.import('../models/log');
var User = sequelize.import('../models/user');
var Definition = sequelize.import('../models/definition');

router.post('/', function(req, res) {
	// req has some body properties that have a username & pwd
	var description = req.body.log.desc;
	var result = req.body.log.result;
	var user = req.user;
	var definition = req.body.log.def;

	// Use our sequelize model to create user:
	Log.create({
			description: description,
			result: result,
			owner: user.id,
			def: definition
		}).then(
			// If success:
			function createSuccess(log) {
				res.json(log);
			},
			// If fail:
			function createError(err) {
				res.send(500, err.message);
				}
			);

	});

router.get('/', function(req, res) {
	var userid = req.user.id;
	Log.findAll({ where: {owner: userid} }).then(
		function findAllSuccess(data) {
			// console.log(data);
			res.json(data);
		},
		function findAllError(err) {
			res.send(500, err.message);
		}

	);

});

router.delete('/', function(req, res){
	var dataID = req.body.log.id;
	// grabs the log you want to delete
	Log.destroy({ where: {id: dataID}}).then(
		function deleteLogSuccess(data){
			res.send("You removed a log!");
		},
		function deleteLogError(err){
			res.send(500, err.message)
		}
	)
})

// Retrieve one workout specified by the log id:
router.get('/:id', function(req, res){

	var dataID = req.params.id

	Log.findOne({ where: {id: dataID} }).then(
		function getSuccess(data){
			res.json(data)
		},

		function getError(err){
			res.send(500, err.message)
		}
	)
})

// Return the data from the log that was updated:
router.put('/', function(req, res){
	var description = req.body.log.description;
	var result = req.body.log.result;
	var data = req.body.log.id;
	var definition = req.body.log.def;

	Log.update({
		description: description,
		result: result,
		def: definition
		},

		{ where: {id: data} }).then(
		function updateSuccess(updateData){
			res.json(updateData);
		},

		function updateError(err){
			res.send(500, err.message);
		}
	)
});

module.exports = router;





