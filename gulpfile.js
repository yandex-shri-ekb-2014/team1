var gulp = require('gulp');
var concat = require('gulp-concat');
// var watcher = require('gulp-watcher');
// var min = require('gulp-min');
var stylus = require('gulp-stylus');
// var copy = require('gulp-copy');
// var jshint = require('gulp-jshint');
// var imagemin = require('gulp-imagemin');
// var autoprefixer = require('gulp-autoprefixer');
// var csscomb = require('gulp-csscomb');
// var imagemin = require('gulp-imagemin');


gulp.task('concat-scripts', function() {
  gulp.src('./blocks/**/*.js')
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./desktop.bundles/index/'))
});

gulp.task('concat-stylus', function() {
  gulp.src('./blocks/**/*.styl')
    .pipe(concat('index.styl'))
    .pipe(gulp.dest('./desktop.bundles/index/'))
});

gulp.task('stylus-generate', function () {
  gulp.src('./desktop.bundles/index/index.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./desktop.bundles/index/'));
});


gulp.task('styles', ['concat-stylus', 'stylus-generate']);
gulp.task('scripts', ['concat-scripts']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['styles','scripts']);