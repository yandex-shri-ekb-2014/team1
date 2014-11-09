var gulp = require('gulp');
var concat = require('gulp-concat');
// var watcher = require('gulp-watcher');
// var min = require('gulp-min');
// var stylus = require('gulp-stylus');
// var copy = require('gulp-copy');
// var jshint = require('gulp-jshint');
// var imagemin = require('gulp-imagemin');
// var autoprefixer = require('gulp-autoprefixer');
// var csscomb = require('gulp-csscomb');
// var imagemin = require('gulp-imagemin');


gulp.task('scripts', function() {
  gulp.src('./blocks/*.js')
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./desktop.bundles/index/'))
});

gulp.task('styles', function() {
  gulp.src('./blocks/*.css')
    .pipe(concat('index.css'))
    .pipe(gulp.dest('./desktop.bundles/index/'))
});

gulp.task('concat',['scripts', 'styles']);





// The default task (called when you run `gulp` from cli)
gulp.task('default', ['concat']);