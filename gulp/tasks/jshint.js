var gulp = require('gulp');
var jshint = require('gulp-jshint');

var environment;
if (!process.env.environment) {
    environment = 'development';
}
var tasksData = require('../configs/' + environment + '.json');

// Include jshint task
gulp.task('jshint', function () {
    return gulp.src(tasksData.paths.scriptsPaths)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});