var gulp = require('gulp');
var jshint = require('gulp-jshint');

var NODE_ENV;
if (!process.env.NODE_ENV) {
    NODE_ENV = 'development';
}
var tasksData = require('./gulp/configs/' + NODE_ENV + '.json');

// Include jshint task
gulp.task('jshint', function () {
    return gulp.src(tasksData.paths.scriptsPaths)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});