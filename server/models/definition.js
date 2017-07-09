module.exports = function(sequelize, DataTypes) {
	/* With "define", the 1st argument will represent a column
	in the database table. */

	return sequelize.define('definition', {
		description: DataTypes.STRING,
		logType: DataTypes.STRING, // by time/reps/weight

		owner: DataTypes.INTEGER
	}, {

	});
};