var gulp = require('gulp');
var jscs = require('gulp-jscs');
var config = require('config');

var tasksData = config.get('gulp');

// Include jscs task
gulp.task('jscs', function () {
    return gulp.src(tasksData.paths.scriptsPaths)
        .pipe(jscs());
});