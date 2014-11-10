var gulp = require('gulp');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
// var csscomb = require('gulp-csscomb');
var autoprefixer = require('gulp-autoprefixer');

// var min = require('gulp-min');
// var copy = require('gulp-copy');
// var imagemin = require('gulp-imagemin');

// var imagemin = require('gulp-imagemin');


gulp.task('concat-scripts', function () {
    gulp.src('./blocks/**/*.js')
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./desktop.bundles/index/'));
});

gulp.task('concat-stylus', function () {
    gulp.src('./blocks/**/*.styl')
        .pipe(concat('index.styl'))
        .pipe(stylus())
        .pipe(autoprefixer({
            browsers: ['> 0%'],
            cascade: false
        }))
        .pipe(gulp.dest('./desktop.bundles/index/'));
});

gulp.task('lint', function () {
    var paths = [
        'gulpfile.js',
        './server/*.js',
        './blocks/**/*.js'
    ];

    return gulp.src(paths)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jscs());
});

gulp.task('watch', function () {
    gulp.watch('./blocks/**/*.styl', function () {
        gulp.run('concat-stylus');
    });
    gulp.watch('./blocks/**/*.js' , function () {
        gulp.run('concat-scripts');
    });
});


gulp.task('styles', ['concat-stylus']);
gulp.task('scripts', ['concat-scripts']);
gulp.task('jshint', ['lint']);


gulp.task('default', ['styles', 'scripts', 'jshint', 'watch']);
