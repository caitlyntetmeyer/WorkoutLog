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
