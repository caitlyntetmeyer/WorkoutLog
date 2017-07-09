var bcrypt = require('bcryptjs');
// makes bcrypt accessible in this file so we can encrypt/hash passwords

module.exports = function(mongoose){
// "module.exports" allows this code be accessible elsewhere
  var UserSchema = new mongoose.Schema({
  // "new mongoose.Schema" creates an instance of this table saying how the data should be saved (see the next two lines)
    username: {type: String},
    password: {type: String}
});

var User = mongoose.model('User', UserSchema);
// how we build the model in our database. Calling the table 'User' and passing in UserSchema (from line 6 above)

var registerCallback = function(err) {
// tells us whether saving was successful
    if (err) {
      return console.log(err);
    };
    return console.log('Account was created');
  };

  var register = function(username, password) {
  // how we're creating/saving data in our db
  // Build a row with data:
    var user = new User({
      username: username,
      password: bcrypt.hashSync(password, 10)
    });
    user.save(registerCallback);
    // saves user to db
    // registerCallback is a variable from above
    console.log('Save command was sent');
  }

  return {
  // If smn calls this file (user.js), they'll see an object w/2 properties
    User: User,
    // User is a variable from above
    register: register
    // register is a function from above
  }
}

















