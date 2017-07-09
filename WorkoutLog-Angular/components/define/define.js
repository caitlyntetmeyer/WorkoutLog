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
