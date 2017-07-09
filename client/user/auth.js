$(document).ready(function(){
	// $.extend merges the contents of 2+ objects together into the 1st object.
	// Syntax: $.extend( target [, object1 ] [, objectN ] )
	$.extend(WorkoutLog, {
		//Signup method:
		signup: function() {
			// username & password variables:
			var username = $("#su_username").val();
			// corresponds to su_username in index.html (su is for signup)
			var password = $("#su_password").val();
			// user object:
			var user = {
				user: {
					username: username,
					password: password
				}
			};

			// signup post:
			var signup = $.ajax({
				type: "POST",
				url: WorkoutLog.API_BASE + "user",
				data: JSON.stringify(user),
				contentType: "application/json"
			});

			// signup done/fail:
			signup.done(function(data) {
				if (data.sessionToken) {
					WorkoutLog.setAuthHeader(data.sessionToken);
					WorkoutLog.definition.fetchAll();
					WorkoutLog.log.fetchAll();
					
					// remove after test
					console.log("You made it!");
					console.log(data.sessionToken);
				}
				// Clean up the front end using jQuery:
				$("#signup-modal").modal("hide");
				$(".disabled").removeClass("disabled");
				$("#loginout").text("Logout");
				$("#su_username").val("");
				$("#su_password").val("");
				// Routing:
				$('a[href="#define"]').tab('show');

			}).fail(function() {
				$("#su_error").text("There was an issue with signup").show();
			});
		},
		// Login method:
		login: function() {
			// Login variables:
			var username = $("#li_username").val();
			var password = $("#li_password").val();
			var user = {
				user: {
					username: username,
					password: password
				}
			};
			// Login POST:
			var login = $.ajax({
				type: "POST",
				url: WorkoutLog.API_BASE + "login",
				data: JSON.stringify(user),
				contentType: "application/json"
			});

			// Login done/fail:
			login.done(function(data) {
				if (data.sessionToken) {
					WorkoutLog.setAuthHeader(data.sessionToken);
					WorkoutLog.definition.fetchAll();
					WorkoutLog.log.fetchAll();
				}
				// TODO: Add logic to set user and auth token
				$("#login-modal").modal("hide");
				$(".disabled").removeClass("disabled");
				$("#loginout").text("Logout");

				$("#li_username").val("");
				$("#li_password").val("");
				// Routing:
				$('a[href="#define"]').tab("show");

			}).fail(function() {
				$("#li_error").text("There was an issue with sign up").show();
			});
		},

		// Loginout method:
		loginout: function() {
			if (window.localStorage.getItem("sessionToken")) {
				window.localStorage.removeItem("sessionToken");
				$("#loginout").text("Login");
			}

			// TODO: on logout, make sure stuff is disabled.
		}

	});

	//bind events:
	$("#signup").on("click", WorkoutLog.signup);
	$("#login").on("click", WorkoutLog.login);
	$("#loginout").on("click", WorkoutLog.loginout);

	if (window.localStorage.getItem("sessionToken")) {
		$("#loginout").text("Logout");
	}

});	// end outside function












