var gulp = require('gulp');

var environment;
if (!process.env.environment) {
    environment = 'development';
}
var tasksData = require('../configs/' + environment + '.json');

// Include js & css watch task
gulp.task('watch', function () {
    gulp.watch(tasksData.paths.blocksPath + '.styl', function () {
        gulp.run('styles');
    });
    gulp.watch(tasksData.paths.blocksPath + '.js' , function () {
        gulp.run('scripts');
    });
});