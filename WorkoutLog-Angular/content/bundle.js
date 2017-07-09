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

// Signing in a User
(function(){
	angular
		.module('workoutlog.auth.signin', ['ui.router'])
		.config(signinConfig);

		function signinConfig($stateProvider) {
			$stateProvider
				.state('signin', {
					url: '/signin',
					templateUrl: '/components/auth/signin.html',
					controller: SignInController,
					controllerAs: 'ctrl',
					bindToController: this
				});
		}

		signinConfig.$inject = ['$stateProvider'];

		// UsersService is used throughout this application to gather or create data regarding a user:
		function SignInController($state, UsersService) { // The signin component uses $state and UsersService as dependencies.
			var vm = this;
			// The following line allows the controller to create a new user based upon the inputs from signin.html:
			vm.user = {};
			vm.login = function() {
				UsersService.login(vm.user).then(function(response){
					console.log(response);
					$state.go('define');
				});
			};
		}

		SignInController.$inject = ['$state', "UsersService"];
})(); // This is an IIFE.

// This configuration (config) file is found in a single file to keep the components together.
// The config and controller for each feature will use the .$inject directive from Angular to inject dependencies.
(function(){
	angular
		.module('workoutlog.auth.signup', ['ui.router'])
		.config(signupConfig);

		function signupConfig($stateProvider) { 
		// $stateProvider is from ui-router and is the method through which url routing is handled.
			$stateProvider
				.state('signup', {
					url: '/signup',
					// defines this component as the state of signup and provides the url route
					templateUrl: '/components/auth/signup.html',
					// templateUrl is the html the component will use
					controller: SignUpController,
					// controller indicates which controller will dictate the behavior of this view
					controllerAs: 'ctrl',
					// controllerAs creates an alias so a developer doesn’t have to type SignUpController.<function or object>
					bindToController: this
					// bindToController binds the scope of the view to the scope of this controller and eliminates the need to use $scope
				});
		}

		signupConfig.$inject = ['$stateProvider'];

		function SignUpController($state, UsersService) {
			var vm = this;
			// "var vm = this" is how the binding of the controller to the view is completed.
			vm.user = {};
			// "vm.user = {}" establishes an object to build the username and password inside.
			vm.message = "Sign up for an account!"
			// example of expressions and how vm and this scope work together
			vm.submit = function() {
				UsersService.create(vm.user)
					.then(function(response){
				// "ng-model" and "ng-submit" (not in this file) create the vm.user object that "UserService.create" uses to sign a new user up.
				// The .then is how the SignUpController handles the resolved promise and then routes the app to the "define" feature of the WorkoutLog.
					console.log(response); // displays response data in console
					$state.go('define');
					// $state.go(‘define’) is how ui-route changes from state (url) to other states.
				});
			};
		}

		SignUpController.$inject = ['$state', 'UsersService'];
		// SignUpController has $state and UsersService injected into it.
})();

// This file will "power" the custom directive.
(function() {
	angular.module('workoutlog')
	.directive('userlinks',
		function() {
			UserLinksController.$inject = [ '$state', 'CurrentUser', 'SessionToken' ];
			function UserLinksController($state, CurrentUser, SessionToken) {
				var vm = this;
				vm.user = function() {
					return CurrentUser.get();
				};

				vm.signedIn = function() {
					return !!(vm.user().id);
				};

				vm.logout = function() {
					CurrentUser.clear();
					SessionToken.clear();
					$state.go('signin');
				};
			}

			// Configure the directive:
			return {
				// Create an isolated scope to isolate the data to a portion of the application:
				scope: {},
				controller: UserLinksController,
				controllerAs: 'ctrl',
				bindToController: true,
				templateUrl: '/components/auth/userlinks.html'
			};
		});
})();

(function() {
	angular.module('workoutlog.define', [
		'ui.router'
		])
	.config(defineConfig);

	function defineConfig($stateProvider) {

		$stateProvider
			.state('define', {
				url: '/define',
				templateUrl: '/components/define/define.html',
				controller: DefineController,
				controllerAs: 'ctrl',
				bindToController: this,
				// Resolve is built in to Angular as a function that executes code prior to going to that route:
				resolve: [
					// Run functions to ensure that a user's actually logged in:
					'CurrentUser', '$q', '$state',
					// Above line: 3 things are injected. $q is Angular's way to build custom promises.
					function(CurrentUser, $q, $state){
						var deferred = $q.defer();
						if (CurrentUser.isSignedIn()){
							deferred.resolve();
						} else {
							deferred.reject();
							$state.go('signin');
						}
						return deferred.promise;
					}
				]
			});
	}

	defineConfig.$inject = [ '$stateProvider' ];

	function DefineController( $state, DefineService ) {
		var vm = this;
		vm.message = "Define a new workout type, such as running, swimming, or doing dumbbell bicep curls.";
		vm.saved = false;
		vm.definition = {};
		vm.save = function() {
			DefineService.save(vm.definition)
				.then(function(){
					vm.saved = true;
					$state.go('logs')
				});
		};

	}
	DefineController.$inject = ['$state', 'DefineService'];
})();

// LogsService is injected and then implemented in this controller.  
// The history component is used to present the collection of logs.  
// Look inside vm.updateLog. $state.go has the route as the first argument, but the second argument is an object with an id property. This is how logs.js knows which log to get so it can be updated.
(function(){
	angular.module('workoutlog.history', [
'ui.router'
		])
	.config(historyConfig);

	// Inject stuff:
	historyConfig.$inject = ['$stateProvider'];
	function historyConfig($stateProvider) {

		$stateProvider
		.state('history', {
			url: '/history',
			templateUrl: '/components/history/history.html',
			controller: HistoryController,
			controllerAs: 'ctrl',
			bindToController: this,
			resolve: {
				getUserLogs: [
				'LogsService',
				function(LogsService) {
					return LogsService.fetch();
				}
				]
			}
		});
	}

	HistoryController.$inject = ['$state', 'LogsService'];
	function HistoryController($state, LogsService) {
		var vm = this;
		vm.history = LogsService.getLogs();

		vm.delete = function(item) {
			LogsService.deleteLogs(item);
		};
// Inside vm.updateLog, $state.go has the route as the first argument, but the second argument is an object with an id property. This is how logs.js knows which log to get so it can be updated.
		vm.updateLog = function(item) {
			$state.go('logs/update', { 'id': item.id });
		};
	}
})();

(function(){
	angular.module('workoutlog.logs', [
		'ui.router'
		])
	.config(logsConfig);

	logsConfig.$inject = ['$stateProvider'];
	function logsConfig($stateProvider) {

		$stateProvider
			.state('logs', {
				url: '/logs',
				templateUrl: '/components/logs/logs.html',
				controller: LogsController,
				controllerAs: 'ctrl',
				bindToController: this,
				resolve: {
					getUserDefinitions: [
					'DefineService',
					function(DefineService) {
						return DefineService.fetch();
					}
					]
				}
			})
// $stateParams.id (line 36) allows the application to pass the url and use that as a way to identify an individual workout. Notice the '/:id' in the .state('logs/update' (line 28). This is the variable that is passed to $stateParams.id.
			.state('logs/update', {
				url: '/logs/:id',
				templateUrl: '/components/logs/log-update.html',
				controller: LogsController,
				controllerAs: 'ctrl',
				bindToController: this,
// The two functions in the resolve (below) allow the route to have access to the data of the log being edited. The resolve is getting ALL user definitions of a workout.
				resolve: {
					getSingleLog: function($stateParams, LogsService) {
// $stateParams.id (line 36) allows the application to pass the url and use that as a way to identify an individual workout. Notice the '/:id' in the .state('logs/update' (line 28). This is the variable that is passed to $stateParams.id.
						return LogsService.fetchOne($stateParams.id);
					},

					getUserDefinitions: function(DefineService) {
						return DefineService.fetch();
					}
				}
			});
	}

	LogsController.$inject = ['$state', 'DefineService', 'LogsService'];
	function LogsController($state, DefineService, LogsService) {
		var vm = this;
		vm.saved = false;
		vm.log = {};
		vm.userDefinitions = DefineService.getDefinitions();
		vm.updateLog = LogsService.getLog();
		vm.save = function() {
			LogsService.save(vm.log)
			.then(function(){
				vm.saved = true;
				$state.go('history');
			});
		};

		// Create an update function here
		vm.updateSingleLog = function() {
			var logToUpdate = {
				id: vm.updateLog.id,
				desc: vm.updateLog.description,
				result: vm.updateLog.result,
				def: vm.updateLog.def 
			}
			LogsService.updateLog(logToUpdate)
			.then(function() {
				$state.go('history');
			});
		};
	}
})();

(function(){
	angular.module('workoutlog')
		.factory('AuthInterceptor', ['SessionToken', 'API_BASE',
			function(SessionToken, API_BASE) {
				return {
					request: function(config) {
						var token = SessionToken.get();
						if (token && config.url.indexOf(API_BASE) > -1) {
							config.headers['Authorization'] = token;
						}
						return config;
					}
				};
			}]);

		angular.module('workoutlog')
			.config(['$httpProvider', function($httpProvider) {
				return $httpProvider.interceptors.push('AuthInterceptor');
			}]);
})();



























(function() {
	angular.module('workoutlog')
		.service('CurrentUser', [ '$window', function($window) {
			function CurrentUser() { // declaring the CurrentUser
				var currUser = $window.localStorage.getItem('currentUser');
				// Check if there's a currUser. If so, and if the currUser is undefined, set the currentUser:
				if (currUser && currUser !== "undefined") { 
					this.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
				}
			}
			CurrentUser.prototype.set = function(user) { // attaching further functionality onto the prototype chain
				this.currentUser = user;
				$window.localStorage.setItem('currentUser', JSON.stringify(user));
			};
			CurrentUser.prototype.get = function() { // attaching further functionality onto the prototype chain
				return this.currentUser || {};
			};
			CurrentUser.prototype.clear = function() { // attaching further functionality onto the prototype chain
				this.currentUser = undefined;
				$window.localStorage.removeItem('currentUser');
			};
			CurrentUser.prototype.isSignedIn = function() { // attaching further functionality onto the prototype chain
				return !!this.get().id; // The !! ensures that isSignedIn flips the boolean correctly.
			};
			return new CurrentUser();
		}]);
})();





















































(function(){
	// Connect the service to our application:
	angular.module('workoutlog')
		.service('DefineService', DefineService);

		// Inject $http and API_BASE:
		DefineService.$inject = ['$http', 'API_BASE'];
		function DefineService($http, API_BASE) {
			var defineService = this;
			defineService.userDefinitions = [];

			defineService.save = function(definition) {
				return $http.post(API_BASE + 'definition', {
					definition: definition

				}).then(function(response){
					defineService.userDefinitions.unshift(response.data);
				});
			};

			defineService.fetch = function(definition) {
				return $http.get(API_BASE + 'definition')
					.then(function(response){
						defineService.userDefinitions = response.data;
					});
			};

			defineService.getDefinitions = function() {
				return defineService.userDefinitions;
			};
		}
})();






























// 1. Create the service
// 2. Inject the service into the controller
// 3. Create the views needed for the controller
// 4. Update app.js (or the configuration file)

(function(){
	angular.module('workoutlog')
		// 1. Create the service
		.service('LogsService', LogsService);

		// 2. Inject the service into the controller
		LogsService.$inject = ['$http', 'API_BASE'];
		function LogsService($http, API_BASE, DefineService) {
			var logsService = this;
			// Next 2 lines are used to expose data to the rest of the application:
			logsService.workouts = [];
			logsService.individualLog = {};
			// Save the log:
			logsService.save = function(log) {
				return $http.post(API_BASE + 'log', {
					log: log
				}).then(function(response){
					logsService.workouts.push(response);
				});
			};

			logsService.fetch = function(log) {
				return $http.get(API_BASE + 'log')
					.then(function(response){
						logsService.workouts = response.data;
					});
			};
			// .getLogs returns data types so they can be used in multiple controllers:
			logsService.getLogs = function() {
				return logsService.workouts;
			};

			logsService.deleteLogs = function(log) {
				var logIndex = logsService.workouts.indexOf(log);
				logsService.workouts.splice(logIndex, 1);
				var deleteData = {log: log};
				return $http({
					method: 'DELETE',
					url: API_BASE + "log",
					data: JSON.stringify(deleteData),
					headers: {"Content-Type": "application/json"}
				});
			};

			logsService.fetchOne = function(log) {
				// console.log(log);
				return $http.get(API_BASE + 'log/' + log)
					.then(function(response) {
					logsService.individualLog = response.data;
				});
			};
			// .getLog returns data types so they can be used in multiple controllers:
			logsService.getLog = function() {
				return logsService.individualLog;
			};

			logsService.updateLog = function(logToUpdate) {
				return $http.put(API_BASE + 'log', { log: logToUpdate });
			}
		}
})();

(function(){
	angular.module('workoutlog')
		.service('SessionToken', ['$window', function($window) {
			function SessionToken(){
			// declares and defines SessionToken
				this.sessionToken = $window.localStorage.getItem('sessionToken');
			}

			SessionToken.prototype.set = function(token){
			// uses the .prototype to attach the function .set to the prototype chain; this has memory enhancements and follows conventional design patterns
				this.sessionToken = token;
				$window.localStorage.setItem('sessionToken', token);
			};

			SessionToken.prototype.get = function(){
			// uses the .prototype to attach the function .get to the prototype chain; this has memory enhancements and follows conventional design patterns
				return this.sessionToken;
			};

			SessionToken.prototype.clear = function() {
			// uses the .prototype to attach the function .clear to the prototype chain; this has memory enhancements and follows conventional design patterns
				this.sessionToken = undefined;
				$window.localStorage.removeItem('sessionToken');
			};
			return new SessionToken;
		}]);
})();









































// This file handles the http request to create and/or sign in a user.
// Implements the design pattern Dependency Injection (DI)
(function(){
	angular.module('workoutlog')
		.service('UsersService', [
			'$http', 'API_BASE', 'SessionToken', 'CurrentUser',
			function($http, API_BASE, SessionToken, CurrentUser) {
				function UsersService(){

				}

				UsersService.prototype.create = function(user) {
					var userPromise = $http.post(API_BASE + 'user', {
						user: user
					});

					userPromise.then(function(response){
						SessionToken.set(response.data.sessionToken);
						CurrentUser.set(response.data.user);
					});
					return userPromise;
				};

				UsersService.prototype.login = function(user) {
					var loginPromise = $http.post(API_BASE + 'login',{
						user: user
					});

					loginPromise.then(function(response){
						SessionToken.set(response.data.sessionToken);
						CurrentUser.set(response.data.user);
					});
					return loginPromise;
				};
				return new UsersService();
			}]);
})();

//# sourceMappingURL=bundle.js.map
