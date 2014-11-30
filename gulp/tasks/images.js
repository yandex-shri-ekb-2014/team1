var path = require('path');

var gulp = require('gulp');
var config = require('config');


gulp.task('images', function () {
    var srcPath = path.join(config.get('gulp.paths.blocksPath') + '.{png,jpg,gif,svg}');
    var destPath = path.join(config.get('gulp.paths.publicPath'), 'images');

    gulp.src(srcPath)
        .pipe(gulp.dest(destPath));
});
