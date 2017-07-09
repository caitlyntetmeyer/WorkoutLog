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
