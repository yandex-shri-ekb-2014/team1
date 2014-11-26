var gulp = require('gulp');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var config = require('config');

var tasksData = config.get('gulp');

// Include styles task ( concat + stylus + autoprefixer + minify )
gulp.task('styles', function () {
    gulp.src(tasksData.paths.blocksPath + '.styl')
        .pipe(concat('index.styl'))
        .pipe(stylus())
        .pipe(autoprefixer({
            browsers: ['> 0%']
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(tasksData.paths.publicPath));

});