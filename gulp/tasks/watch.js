var gulp = require('gulp');

var NODE_ENV;
if (!process.env.NODE_ENV) {
    NODE_ENV = 'development';
}
var tasksData = require('./gulp/configs/' + NODE_ENV + '.json');

// Include js & css watch task
gulp.task('watch', function () {
    gulp.watch(tasksData.paths.blocksPath + '.styl', function () {
        gulp.run('styles');
    });
    gulp.watch(tasksData.paths.blocksPath + '.js' , function () {
        gulp.run('scripts');
    });
});