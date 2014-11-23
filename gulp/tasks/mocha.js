var gulp = require('gulp');
var mocha = require('gulp-mocha');

var environment;
if (!process.env.environment) {
    environment = 'development';
}
var tasksData = require('../configs/' + environment + '.json');

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