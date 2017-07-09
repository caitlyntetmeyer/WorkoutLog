// Use Express Middleware to allow CORS (Cross Origin Resource Sharing).

// This is our own Node module.

module.exports = function(req, res, next) {
	res.header('access-control-allow-origin', '*');
/* 
The res.header method is an Express method that allows us to enable CORS 
(Cross Origin Resource Sharing). res.header stands for response.header 
and  is saying, "Allow the server to respond to any request from 
anywhere."

For res.header above: 1st parameter - the "origin" keyword refers to
the ORIGIN of the request. 2nd parameter - the asterisk states that
we're allowing requests and  responses from ANY origin. The asterisk
is a wild card. */   

res.header('access-control-allow-methods','GET, POST, PUT, DELETE');  
// allows the methods GET, POST, PUT and DELETE   
res.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
/* allows the headers Origin, X-Requested-With, Content-Type, Accept, 
and Authorization */

	next();
};
/* 
The next() function tells our app.js to look at the NEXT 
middleware and pass request info along. When a file isn’t found, 
instead of sending a 404 not found, next() will be called to move 
on to the NEXT middleware. We can include info here to 
authenticate / authorize application-level access.
*/












