(function() {
	var app = angular.module('workoutlog', [
		// Inject dependencies:
		'ui.router',
		'workoutlog.define',
		'workoutlog.logs',
		'workoutlog.history',
		'workoutlog.feed',
		'workoutlog.auth.signup',
		'workoutlog.auth.signin'
		])
	.factory('socket', function(socketFactory){
		var myIoSocket = io.connect('http://localhost:3000');

		var socket = socketFactory({
			ioSocket: myIoSocket
		});
		return socket;
	});

	function config($urlRouterProvider) {
		$urlRouterProvider.otherwise('/signin');
	}

	config.$inject = [ '$urlRouterProvider' ];
	app.config(config);

	var API_BASE = location.hostname === "localhost" ? "//localhost:3000/api/" : "//cct-workoutlogangular.herokuapp.com/api/";
	// var API_BASE is now dynamic, and WorkoutLog-Angular can run deployed or locally because the ternary operator (?) determines the environment and alters the API_BASE accordingly.
	app.constant('API_BASE', API_BASE);
})();
