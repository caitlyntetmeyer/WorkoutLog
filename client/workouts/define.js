$(function() {
	$.extend(WorkoutLog, {
	// .extend merges objects together.
		definition: {
			userDefinitions: [],

			create: function() {
				var def = {
					desc: $("#def-description").val(),
					type: $("#def-logtype").val()
				};	
				var postData = { definition: def };
				var define = $.ajax({
					type: "POST",
					url: WorkoutLog.API_BASE + "definition",
					data: JSON.stringify(postData),
					contentType: "application/json"
				}); 

				define.done(function(data) {
					WorkoutLog.definition.userDefinitions.push(data.definition);
					$("#def-description").val("");
					$("#def-logtype").val("");
					// Routing:
					$('a[href="#define"]').tab("show");

				});

			},	

			
			fetchAll: function() {
				var fetchDefs = $.ajax({
					type: "GET",
					url: WorkoutLog.API_BASE + "definition",
					headers: {
						"authorization": window.localStorage.getItem("sessionToken")
					}
				})
				.done(function(data) {
					WorkoutLog.definition.userDefinitions = data;
				})
					.fail(function(err) {
						console.log(err);
					});
				}}
			});
		// Bindings:
		$("#def-save").on("click", WorkoutLog.definition.create);
		// This is where we create a workout definition or category.

		// Fetch definitions if we're already authenticated & refreshed:
		if (window.localStorage.getItem("sessionToken")) {
			WorkoutLog.definition.fetchAll();
		} 
		/* This if-statement says - when there is a sessionToken (an 
		authenticated user), grab all the workout definition types, 
		AKA categories. */
});








