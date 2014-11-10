// Include gulp
var gulp = require('gulp');


// Include plugins
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var autoprefixer = require('gulp-autoprefixer');
var uglifyjs = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var rimraf = require('gulp-rimraf');


// Set paths
var blocksPath = './blocks/**/*';
var publicPath = './desktop.bundles/index/';


// Include scripts task ( concat + uglify )
gulp.task('scripts', function () {
    gulp.src(blocksPath + '.js')
        .pipe(concat('index.js'))
        .pipe(uglifyjs())
        .pipe(gulp.dest(publicPath));
});


// Include styles task ( concat + stylus + autoprefixer + minify )
gulp.task('styles', function () {
    gulp.src(blocksPath + '.styl')
        .pipe(concat('index.styl'))
        .pipe(stylus())
        .pipe(autoprefixer({
            browsers: ['> 0%']
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(publicPath));
});


// Include js jshint task
gulp.task('jshint', function () {
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


// Include js & css watch task
gulp.task('watch', function () {
    gulp.watch(blocksPath + '.styl', function () {
        gulp.run('styles');
    });
    gulp.watch(blocksPath + '.js' , function () {
        gulp.run('scripts');
    });
});


// Include clear task
gulp.task('clear', function () {
    return gulp.src(publicPath)
    .pipe(rimraf());
});



// Default task
gulp.task('default', ['styles', 'scripts', 'watch']);