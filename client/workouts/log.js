/* This file will help us Log our workouts in the app in the browser 
("Result", "Workout Select", "Notes" - they'll be populated from the 
"Define" tab in the app). */

$(function() {
	$.extend(WorkoutLog, {
		log: {
			workouts: [],	// We'll add data to this array on lines 49 & 65.

			setDefinitions: function() {
				var defs = WorkoutLog.definition.userDefinitions;
				var len = defs.length;
				var opts;	// an empty variable that we'll add to on lines 15 & 19
				for (var i = 0; i < len; i++) {
					opts += "<option value='" + defs[i].id + "'>" + 
					defs[i].description + "</option>";
				}
				$("#log-definition").children().remove();
				// clears options out before user adds more info
				$("#log-definition").append(opts);
			},
			setHistory: function() {
				var history = WorkoutLog.log.workouts;
				var len = history.length;
				var lis = "";
				console.log(history);
				for (var i = 0; i < len; i++) {
					lis += "<li class='list-group-item'>" + 
					// list-group-item is a Bootstrap class.
					history[i].def + " - " + history[i].result + 
					"<div class='pull-right'>" + "<button id='" + history[i].id + 
					"' class='remove glyphicon glyphicon-trash'></button>" + "</div>" + 
					"</li>";
				}
				$("#history-list").children().remove();
				$("#history-list").append(lis);
			},
			create: function() {
				var itsLog = {
					desc: $("#log-description").val(),
					result: $("#log-result").val(),
					def: $("#log-definition option:selected").text()
				};
				var postData = { log: itsLog };
				var logger = $.ajax({
					type: "POST",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(postData),
					contentType: "application/json"
				});

				logger.done(function(data) {
					WorkoutLog.log.workouts.push(data);
					/* workouts is an empty array on line 8. We're pushing the data 
					into the array here. */

					$("#log-description").val("");
					$("#log-result").val("");
					// Routing:
					$('a[href="#define"]').tab("show");

				});

			},
			fetchAll: function() {
				var fetchDefs = $.ajax({	// ajax request
					type: "GET",
					url: WorkoutLog.API_BASE + "log",
					headers: {
						"authorization": window.localStorage.getItem("sessionToken")
						// appends the sessionToken to the header
					}
				})

				// fetchDefs.done(function(data))

				.done(function(data) {
					WorkoutLog.log.workouts = data;
					/* workouts is the empty array from line 8 that we've been 
					adding to. */
				})
				.fail(function(err) {
					console.log(err);
				});

			},

			delete: function() {
				var thisLog = {
					id: $(this).attr("id")
				};

				var deleteData = {log: thisLog};
				var deleteLog = $.ajax({
					type: "DELETE",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(deleteData),
					contentType: "application/json"
				});

				$(this).closest("li").remove();

				for(var i = 0; i < WorkoutLog.log.workouts.length; i++) {
					if(WorkoutLog.log.workouts[i].id == thisLog.id){
						WorkoutLog.log.workouts.splice(i, 1);
					}
				}

				deleteLog.fail(function(){
					console.log("The workout was not deleted.");
				})

			}
		}
	});

	// When user clicks the button, it creates a log entry:
	$("#log-save").on("click", WorkoutLog.log.create);

	// Syntax of .delegate(): .delegate( selector, eventType, handler )
	$("#history-list").delegate( '.remove', 'click', WorkoutLog.log.delete );
	
	if (window.localStorage.getItem("sessionToken")) {
		WorkoutLog.log.fetchAll();
	}
	
});












