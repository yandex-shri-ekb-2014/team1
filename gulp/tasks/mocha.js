var gulp = require('gulp');
var mocha = require('gulp-mocha');
var config = require('config');

var tasksData = config.get('gulp');

// Include mocha task
gulp.task('mocha', function () {
    return gulp.src(tasksData.paths.testPath, {
        read: false
    })
        .pipe(mocha({
            reporter: 'spec', timeout: 10000
        }));
});

gulp.task('test', ['mocha']);