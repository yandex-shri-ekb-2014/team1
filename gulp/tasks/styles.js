var gulp = require('gulp');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var config = require('config');


// Include styles task ( concat + stylus + autoprefixer + minify )
gulp.task('styles', function () {
    gulp.src(config.get('gulp.paths.blocksPath') + '.styl')
        .pipe(concat('index.styl'))
        .pipe(stylus())
        .pipe(autoprefixer({
            browsers: ['> 0%']
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(config.get('gulp.paths.publicPath')));
});
