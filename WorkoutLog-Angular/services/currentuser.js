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




















































