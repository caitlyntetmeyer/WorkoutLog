// Sequelize setup (module 7):
var Sequelize = require('sequelize');	
// Above: 'sequelize' grabs node_modules folder > sequelize folder, so that we can 
// use all the code in that folder.

// Below: sequelize is just a variable that holds our NEW instance of Sequelize.
var sequelize = new Sequelize('workoutlog', 'postgres', 'Letmein1234!', {
	host: 'localhost',
	dialect: 'postgres'
});

// Use the password on line 7 to sign in and be authenticated:
sequelize.authenticate().then(	// "Once you're authenticated, THEN..."
	function() {
		console.log('Connected to workoutlog postgres db');	//"...log this sentence."
	},	// This comma indicates that there are 2 arguments in this function.
	function(err) {	// "If authentication fails..."
		console.log(err);	// "...log an error."
	}
);

// Import server > models > user.js:
var User = sequelize.import('./models/user');

// Export statement:
module.exports = sequelize;
// We've now created our own module & are exporting sequelize.