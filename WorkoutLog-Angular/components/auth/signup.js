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
