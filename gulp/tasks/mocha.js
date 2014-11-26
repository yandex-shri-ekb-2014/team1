var gulp = require('gulp');
var mocha = require('gulp-mocha');
var config = require('config');


// Include mocha task
gulp.task('mocha', function () {
    gulp.src(config.get('gulp.paths.testPath'), {read: false})
        .pipe(mocha({reporter: 'spec', timeout: 10000}));
});

gulp.task('test', ['mocha']);
