var path = require('path');

var gulp = require('gulp');
var config = require('config');


gulp.task('static', function () {
    var srcPath = path.join(config.get('gulp.paths.staticPath') + '.js');
    var destPath = path.join(config.get('gulp.paths.publicPath'));
    gulp.src(srcPath)
        .pipe(gulp.dest(destPath));
});
