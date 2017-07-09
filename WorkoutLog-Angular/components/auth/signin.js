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
