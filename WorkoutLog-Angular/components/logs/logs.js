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
