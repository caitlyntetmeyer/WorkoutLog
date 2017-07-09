// Routing

// In class, we first wrote this file to go with postgres. Later, we started replacing postgres with mongo; but we didn't finish. So it screwed everything up until Jeremy had me comment out the mongo stuff.

require('dotenv').config();

// Import the express module:
var express = require('express');

var app = express();
/* creates an instance of Express that we can use to call the various 
Express functions that will help us build our server.
"var app" is an **instance** of Express. Everything that fires in 
Express gets stored in "var app". */

/* The following package will help the server parse out incoming requests 
that are easier to work with: */
var bodyParser = require('body-parser');

// Import the server > db.js module:
var sequelize = require('./db');

// Import sequelize, as well as server > models > user.js:
var User = sequelize.import('./models/user');
// var User = sequelize.import(__dirname + '\\models\\user');	// No!


// mongo setup:
// var mongoose = require('mongoose');
// var mongodb = require('./db_mongo');
// var Account = require('./models_mongo/user')(mongoose);
// var Product = require('./models_mongo/products.js')(mongoose);

// mongoose.connect(mongodb.databaseUrl);
// // connects our db to our application
// // mongodb is a variable from above.

// mongoose.connection.on('connected', function(){
// 	console.log('connected to db ' + mongodb.databaseUrl);
// })
// "Once you've connected to the db, print the database URL." 

// end mongo setup

/* 
"User.sync();" 
1) creates the table in postgres...
2) matches the model we defined...
3) doesn't drop the db.
Call the sequelize METHOD ".sync()" on the "User" OBJECT:
*/
// User.sync();	// helps w/data persistence
// User({force: true})   WARNING: This will DROP the table!

sequelize.sync();

// Tell the application to use bodyParser:
app.use(bodyParser.json());
/*
bodyParser will parse data off incoming requests and turn the data into
JSON. bodyParser will take that JSON & expose it to be used for
req.body.
*/

// Import middleware > headers.js:
app.use(require('./middleware/headers'));

// Import middleware > validate-session.js:
app.use(require('./middleware/validate-session'));

// Creating a user
// Tell express to use routes > user.js as a route:
app.use('/api/user', require('./routes/user')); // pre-mongo line

// mongo stuff:
// app.post('/api/user', function(req, res){
// 	var username = req.body.user.username;
// 	var pass = req.body.user.password;

// 	Account.register(username, pass);
// 	// Account is a variable from above.
// 	res.send(200);
// 	// Once the data has been saved, send an "OK" message.
// })

// products route:
app.post('/api/products', function(req, res){
	var name = req.body.product.name;
	var description = req.body.product.description;
	var image = req.body.product.image;
	var price = req.body.product.price;

	Product.createProduct(name, description, image, price);
	res.send(200);
})

// login route:
app.use('/api/login', require('./routes/session'));
// localhost:3000/api/login

// definition route:POST
app.use('/api/definition', require('./routes/definition'));

app.use('/api/log', require('./routes/log'));


app.use('/api/test', function(req, res) {
	// When someone goes to localhost:3000/api/test...
	res.send("Hello World");
	// ...res.send takes the request and sends out above response to the DOM.
});

// Make the server start up when it is run on port 3000:
app.listen(3000, function(){
	console.log("App is listening on 3000.");
});
/*
app.listen - app is a variable and listen is a method. listen 
binds a certain port, port 3000 in this case.
*/



/*
When we run node app.js in the Terminal, the callback function will 
fire up and give us the console.log message in the Terminal.
*/



