var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
// var uglifyjs = require('gulp-uglify');

var NODE_ENV;
if (!process.env.NODE_ENV) {
    NODE_ENV = 'development';
}
var tasksData = require('./gulp/configs/' + NODE_ENV + '.json');

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