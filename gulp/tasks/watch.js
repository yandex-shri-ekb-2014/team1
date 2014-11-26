var gulp = require('gulp');
var config = require('config');


// Include css watch task
gulp.task('watch', function () {
    gulp.watch(config.get('gulp.paths.blocksPath') + '.styl', function () {
        gulp.run('styles');
    });
    gulp.watch(config.get('gulp.paths.scriptsPaths'), function () {
        gulp.run('scripts');
    });
});
