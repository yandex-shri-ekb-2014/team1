var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var config = require('config');


// Include scripts task ( concat + uglify )
gulp.task('scripts', function () {
    browserify(config.get('gulp.paths.appPath'))
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(config.get('gulp.paths.publicPath')));
});
