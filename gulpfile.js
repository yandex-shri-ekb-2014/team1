var gulp = require('gulp');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');
// var csscomb = require('gulp-csscomb');
var autoprefixer = require('gulp-autoprefixer');


// var min = require('gulp-min');
// var copy = require('gulp-copy');
// var imagemin = require('gulp-imagemin');

// var imagemin = require('gulp-imagemin');


gulp.task('concat-scripts', function() {
  gulp.src('./blocks/**/*.js')
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./desktop.bundles/index/'))
});

gulp.task('concat-stylus', function() {
  gulp.src('./blocks/**/*.styl')
    .pipe(concat('index.styl'))
    .pipe(stylus())
    .pipe(autoprefixer({
        browsers: ['> 0%'],
        cascade: false
    }))
    .pipe(gulp.dest('./desktop.bundles/index/'));
});

gulp.task('lint', function() {
  return gulp.src('./blocks/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function () {
    gulp.watch('./blocks/**/*.styl', function(event) { 
	    gulp.run('concat-stylus'); 
	}); 
    gulp.watch('./blocks/**/*.js' , function (event) {
        gulp.run('concat-scripts');
    });
});

// gulp.task('comb', function () {
//   return gulp.src('./blocks/**/*.styl')
//     .pipe(csscomb())
//     .pipe(gulp.dest('./blocks/'));
// });


gulp.task('styles', ['concat-stylus']);
gulp.task('scripts', ['concat-scripts']);
gulp.task('jshint', ['lint']);


gulp.task('default', ['styles','scripts','jshint','watch']);



