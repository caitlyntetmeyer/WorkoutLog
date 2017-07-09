// user model created using sequelize talks to the table user
module.exports = function(sequelize, DataTypes) {	// export statement
	return sequelize.define('user', {	
		username: DataTypes.STRING,
		passwordhash: DataTypes.STRING
	});		// returns the sequelize.define FUNCTION
};
// creates an Object factory for our Database table
// With this module, we can create an infinite amnt of users.