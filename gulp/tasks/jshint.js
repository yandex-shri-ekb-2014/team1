var gulp = require('gulp');
var jshint = require('gulp-jshint');
var config = require('config');

var tasksData = config.get('gulp');

// Include jshint task
gulp.task('jshint', function () {
    return gulp.src(tasksData.paths.scriptsPaths)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});