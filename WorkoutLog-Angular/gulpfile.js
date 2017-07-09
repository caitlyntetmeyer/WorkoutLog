var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');

var javascriptFiles = [
	'app.js',
	'./components/**/*.js',
	'./services/**/*.js'
];

gulp.task('bundle', function() {
	return gulp.src(javascriptFiles) // line 7: var javascriptFiles. gulp.src tell the Gulp task what files to use for the task.
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest("./content")); // gulp.dest tells Gulp where to output the files onces the task is completed.
});

gulp.task('watch', function() {
	gulp.watch(javascriptFiles, ['bundle']);
});

gulp.task('start-webserver', function() {
	connect.server({ root: '.' });
});

// Default task when 'gulp' runs: bundle, starts web server, then watches for changes
gulp.task('default', ['bundle', 'start-webserver', 'watch']);
// 'bundle' is from lines 13 & 23.
// 'start-webserver' is from line 26.
// 'watch' is from lines 22 & 23.




























