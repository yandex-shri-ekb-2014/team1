var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var config = require('config');


// Include scripts task ( concat + uglify )
gulp.task('scripts', function () {
    var env = process.env.NODE_ENV || 'development';
    var stream = browserify(config.get('gulp.paths.appPath'))
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer());
    if (env === 'production') {
        stream = stream.pipe(uglify());
    }
    stream.pipe(gulp.dest(config.get('gulp.paths.publicPath')));


});
