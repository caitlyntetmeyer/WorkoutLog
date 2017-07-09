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








































