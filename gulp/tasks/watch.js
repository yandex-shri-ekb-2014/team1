var gulp = require('gulp');
var config = require('config');

var tasksData = config.get('gulp');

// Include js & css watch task
gulp.task('watch', function () {
    gulp.watch(tasksData.paths.blocksPath + '.styl', function () {
        gulp.run('styles');
    });
    gulp.watch(tasksData.paths.blocksPath + '.js' , function () {
        gulp.run('scripts');
    });
});