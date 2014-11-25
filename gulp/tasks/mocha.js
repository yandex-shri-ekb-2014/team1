var gulp = require('gulp');
var mocha = require('gulp-mocha');

var NODE_ENV;
if (!process.env.NODE_ENV) {
    NODE_ENV = 'development';
}
var tasksData = require('./gulp/configs/' + NODE_ENV + '.json');

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