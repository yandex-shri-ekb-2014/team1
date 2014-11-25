var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var config = require('config');

var tasksData = config.get('gulp');

// Include scripts task ( concat + uglify )
gulp.task('scripts', function () {
    return browserify(tasksData.paths.appPath)
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
        // Todo: fix uglify
        // .pipe(uglifyjs())
        .pipe(gulp.dest(tasksData.paths.publicPath));
});