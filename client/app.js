$(function() {

	var WorkoutLog = (function($, undefined) {
		var API_BASE = "http://localhost:3000/api/";
		/* When a user enters data into a form, the data's appended to
		an empty array. */
		var userDefinitions = [];

		var setAuthHeader = function(sessionToken) {
			window.localStorage.setItem("sessionToken", sessionToken);
			// Set the authorization header
			// This can be done on individual calls
			// Here, we showcase ajaxSetup as a global tool
			$.ajaxSetup({
				"headers": {
					"Authorization": sessionToken
				}
			});
		};

		// public
		return {
			API_BASE: API_BASE,
			setAuthHeader: setAuthHeader
		};
		/* This is an example of an IIFE being used to protect / hide data 
		from the window object. We return / expose the information needed 
		to authenticate the user and to have the api url available. */

	})(jQuery);

	// Ensure .disabled aren't clickable:
	$('.nav-tabs a[data-toggle="tab"]').on("click", function(e) {
	  var token = window.localStorage.getItem("sessionToken");
	  if ($(this).hasClass("disabled") && !token) {
	     e.preventDefault();
	     return false;
	  }
	});

	// bind tab change events
	$('a[data-toggle="tab]').on('shown.bs.tab', function (e) {
		var target = $(e.target).attr("href");	// activated tab
		if (target === "#log") {
			WorkoutLog.log.setDefinitions();
		}

		if (target === "#history") {
			WorkoutLog.log.setHistory();
		}
	});

	// bind enter key
	$(document).on("keypress", function(e) {
		if (e.which === 13) {	// enter key
			if ($("#signup-modal").is(":visible")) {
				$("#signup").trigger("click");
			}
			if ($("#login-modal").is(":visible")) {
				$("#login").trigger("click");
			}
		}
	});

	// Bind tab change events
	// Bootstrap tab --> binding to a bootstrap event
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var target = $(e.target).attr("href");	// activated tab
		if (target === "#log") {
			WorkoutLog.log.setDefinitions();
		}

		if (target === "#history") {
			WorkoutLog.log.setHistory();
		}

		if (target === "#update-log"){
			Workout.log.setDefinitions();
		}
	});

	// bind enter key
	$(document).on("keypress", function(e) {
		if (e.which === 13) { // enter key
			if ($("#signup-modal").is(":visible")) {
				$("#signup").trigger("click");
			}
			if ($("#login-modal").is(":visible")) {
				$("#login").trigger("click");
			}
		}
	})


	
	var token = window.localStorage.getItem("sessionToken");
	if (token) {
		WorkoutLog.setAuthHeader(token);
	}

	// expose this to the other workoutlog modules
	window.WorkoutLog = WorkoutLog;
});















