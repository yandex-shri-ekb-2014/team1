var gulp = require('gulp');
var jscs = require('gulp-jscs');

var environment;
if (!process.env.environment) {
    environment = 'development';
}
var tasksData = require('../configs/' + environment + '.json');

// Include jscs task
gulp.task('jscs', function () {
    return gulp.src(tasksData.paths.scriptsPaths)
        .pipe(jscs());
});