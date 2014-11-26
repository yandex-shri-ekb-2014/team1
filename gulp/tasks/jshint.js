var gulp = require('gulp');
var jshint = require('gulp-jshint');
var config = require('config');


// Include jshint task
gulp.task('jshint', function () {
    gulp.src(config.get('gulp.paths.scriptsPaths'))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
