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
var mocha = require('gulp-mocha');
var browserify = require('gulp-browserify');


// Set paths
var blocksPath = './blocks/**/*';
var publicPath = './desktop.bundles/index/';
var appPath = 'server/app.js';
var testPath = 'server/test.js';
var scriptsPaths = [
    'gulpfile.js',
    './server/*.js',
    './blocks/**/*.js'
];



// Include scripts task ( concat + uglify )
gulp.task('scripts', function() {
    return gulp.src(appPath)
    .pipe(browserify({insertGlobals : true, debug : !process.env.production}))
    .pipe(uglifyjs())
    .pipe(gulp.dest(publicPath))
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


// Include mocha task
gulp.task('mocha', function () {
    return gulp.src(testPath, {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});


// Include jshint task
gulp.task('jshint', function () {
    return gulp.src(scriptsPaths)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// Include jscs task
gulp.task('jscs', function () {
    return gulp.src(scriptsPaths)
        .pipe(jscs());
});

// Include lint task
gulp.task('lint', ['jshint', 'jscs']);


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
gulp.task('default', ['styles', 'scripts', 'mocha' , 'watch']);