var gulp = require('gulp');
var jscs = require('gulp-jscs');

var NODE_ENV;
if (!process.env.NODE_ENV) {
    NODE_ENV = 'development';
}
var tasksData = require('./gulp/configs/' + NODE_ENV + '.json');

// Include jscs task
gulp.task('jscs', function () {
    return gulp.src(tasksData.paths.scriptsPaths)
        .pipe(jscs());
});