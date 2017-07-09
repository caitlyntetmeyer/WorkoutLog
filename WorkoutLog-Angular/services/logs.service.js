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
