var gulp = require('gulp');
var jscs = require('gulp-jscs');
var config = require('config');


// Include jscs task
gulp.task('jscs', function () {
    gulp.src(config.get('gulp.paths.scriptsPaths'))
        .pipe(jscs());
});
